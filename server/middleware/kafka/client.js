var rpc = new (require('./kafkarpc'))();

//make request to kafka
function make_request(queue_name, msg_payload, callback){
    console.log('in make request');
    console.log(msg_payload.email);
	rpc.makeRequest(queue_name, msg_payload, function(err, response){

		if(err)
			console.error(err);
		else{
			//console.log("response", response);
			callback(null, response);
		}
	});
}


function makeChunkedRequest(queue_name, msg_payload , chunks , callback){
    console.log('in makeChunkedRequest request');
   
	rpc.makeChunkedRequest(queue_name, msg_payload , chunks , function(err, response){

		if(err)
			console.error(err);
		else{
			console.log("response", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
exports.makeChunkedRequest = makeChunkedRequest;
