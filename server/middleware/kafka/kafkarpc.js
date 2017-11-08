var crypto = require('crypto');
var conn = require('./Connection');

var TIMEOUT=1000000; //time to wait for response in ms
var self;

exports = module.exports =  KafkaRPC;

var chunk_requests = {} ; 

function KafkaRPC(){
    self = this;
    this.connection = conn;
    this.requests = {}; //hash to store request in wait for response
    this.response_queue = false; //placeholder for the future queue
    this.producer = this.connection.getProducer();
}

KafkaRPC.prototype.makeRequest = function(topic_name, content, callback){

    self = this;
    //generate a unique correlation id for this call
    var correlationId = crypto.randomBytes(16).toString('hex');

    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function(corr_id){
        //if this ever gets called we didn't get a response in a
        //timely fashion
        console.log('timeout');
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    //create a request entry to store in a hash
    var entry = {
        callback:callback,
        timeout: tId //the id for the timeout so we can clear it
    };

    //put the entry in the hash so we can match the response later
    self.requests[correlationId]=entry;

    //make sure we have a response topic
    self.setupResponseQueue(self.producer,topic_name,function(){
        console.log('in response');
        //put the request on a topic

        var payloads = [
            { topic: topic_name, messages: JSON.stringify({
                correlationId:correlationId,
                replyTo:'response1',
                data:content}),
                partition:0}
        ];
        console.log('in response1');
      //  console.log(self.producer.ready);
        self.producer.send(payloads, function(err, data){
            console.log('in response2');
            if(err){
            	var entry = self.requests[correlationId];
                //make sure we don't timeout by clearing it
                clearTimeout(entry.timeout);
                //delete the entry from hash
                delete self.requests[correlationId];
                //callback, no err
                entry.callback(err);
                
                //console.log(data) ; 
            }
                
            
           
        });
    });
};


KafkaRPC.prototype.makeChunkedRequest = function(topic_name, content, chunks, callback){
	console.log('KAFKA RPC makeChunkedRequest') ;
    self = this;
    //generate a unique correlation id for this call
    var correlationId = crypto.randomBytes(16).toString('hex');

    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function(corr_id){
        //if this ever gets called we didn't get a response in a
        //timely fashion
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    //create a request entry to store in a hash
    var entry = {
        callback:callback,
        timeout: tId //the id for the timeout so we can clear it
    };
    //put the entry in the hash so we can match the response later
    self.requests[correlationId]=entry;

    //make sure we have a response topic
    self.setupResponseQueue(self.producer,topic_name,function(){
        //put the request on a topic
      

        for(var i=0;i<chunks.length;i++){
            var payloads = [
                { 
                    topic: topic_name, 
                    messages: JSON.stringify({
                        correlationId:correlationId,
                        replyTo:'response1',
                        data:content,
                        //chunk info
                        chunk:chunks[i],
                        chunk_no:i,
                        total_chunks:chunks.length,
                        is_chunk_data:true,
                    }),
                    partition:0
                }
            ];
            self.producer.send(payloads, function(err, data){
                if(err) {
                	 var entry = self.requests[correlationId];
                     //make sure we don't timeout by clearing it
                     clearTimeout(entry.timeout);
                     //delete the entry from hash
                     delete self.requests[correlationId];
                     //callback, no err
                     entry.callback(err);
                     
                     //console.log(data) ; 
                }
            });
        }

    });
};



KafkaRPC.prototype.setupResponseQueue = function(producer,topic_name, next){
    //don't mess around if we have a queue
    if(this.response_queue) return next();

    console.log('1');

    self = this;

    //subscribe to messages
    var consumer = self.connection.getConsumer('response1');
    consumer.on('message', function (message) {
        console.log('msg received');
        
        var data = JSON.parse(message.value);
        
        //get the correlationId
        var correlationId = data.correlationId;
        //is it a response to a pending request
        if(correlationId in self.requests){
            
        	if(data.is_chunk_data){
        		
        		console.log("Chunle , " , data.is_chunk_data) ;
        		
        		var chunk_request = chunk_requests[correlationId];
        		
        		if(chunk_request){
                    chunk_request.chunks.push({
                        data:data.chunk,
                        order:data.chunk_no  
                    })
                }else{
                	chunk_request = {
                            chunks:[
                                {
                                    data:data.chunk,
                                    order:data.chunk_no
                                }
                            ],
                            total_chunks:data.total_chunks
                        }
                	chunk_requests[data.correlationId] = chunk_request;
                }
        		
        		if(chunk_request.chunks.length === chunk_request.total_chunks){
        			chunk_request.chunks.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);});
                    var combined_chunks_data = "";
                    for (var i=0;i<chunk_request.chunks.length;i++) {
                        combined_chunks_data += chunk_request.chunks[i].data;
                    }
                    //data.data.buffer = Buffer.from(combined_chunks_data,'base64');
                    
                    var bufferData = Buffer.from(combined_chunks_data,'base64') ; 
                   // console.log("Data for file " , bufferData) ; 
                    
                  //retrieve the request entry
                    var entry = self.requests[correlationId];
                    //make sure we don't timeout by clearing it
                    clearTimeout(entry.timeout);
                    //delete the entry from hash
                    delete self.requests[correlationId];
                    //callback, no err
                    entry.callback(null, bufferData);
        		}
        		
        		
        		
        		
        		
        		
        		
        		
        		
        	}else{
        		//retrieve the request entry
                var entry = self.requests[correlationId];
                //make sure we don't timeout by clearing it
                clearTimeout(entry.timeout);
                //delete the entry from hash
                delete self.requests[correlationId];
                //callback, no err
                entry.callback(null, data.data);
        	}
        	
        	
        	
        	
        }
    });
    self.response_queue = true;
    console.log('returning next');
    return next();
};