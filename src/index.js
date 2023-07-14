const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const GPTCopilotRoute = require("./routes/GPTCopilotRoute");
const npcRoute = require("./routes/NPCRoute");

var app = express();


const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// endpoint
app.use("/", GPTCopilotRoute);
app.use("/", npcRoute);

//start http server
const httpServer = http.createServer(app);

//make the server listen on port 3000
httpServer .listen(process.env.PORT ||3000, function(){
	console.log('listening on *:3000');
});

module.exports = app;
 
console.log("------- server is running -------");
