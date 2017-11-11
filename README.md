# DropBox_mongo_kafka

Goto all 4 Folders and run command "npm install".

Run the Project

* Goto client folder and run "npm run start".
* Goto server folder and run "nodemon app.js".
* Goto server_kafka folder and run "nodemon server.js".

To run Mocha Test

* Goto Mocha folder and run "npm run test".


Database MongoDB
create 2 dbs by below commands
* use DropBox_sessions
* use DropBox_application

under DropBox_application, create few collections by below commands
* db.createCollection("groups");
* db.createCollection("profile");
* db.createCollection("user_files");
* db.createCollection("users");
* db.createCollection("user_shared_files");


KAFKA (Unix/Mac)
1. Goto Kafka Folder
2. Start Zookepper Server
	bin/zookeeper-server-start.sh config/zookeeper.properties
3. Start Kafka Server 
	bin/kafka-server-start.sh config/server.properties
4. Create 2 topics
	bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_app
	bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response1

KAFKA (Windows)
1. Goto Kafka Folder
2. Start Zookepper Server
	cd bin/windows
	zookeeper-server-start.bat ../../config/zookeeper.properties
3. Start Kafka Server 
	kafka-server-start.bat ../../config/server.properties
4. Create 2 topics
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_app
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response1



