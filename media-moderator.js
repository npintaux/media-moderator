var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var express = require("express");
var app = express();


// 
// global variables
//
var urlLogicAppApprove = "";
var urlLogicAppReject = "";

//
// read Logic App URL config file
//
fs.readFile("./config.json", "UTF-8", function(err, config) {
    var configs = JSON.parse(config);
    urlLogicAppApprove =  configs.urlLogicAppApprove;
    urlLogicAppReject = configs.urlLogicAppReject;
})

//
// Handler for: http://localhost:3000/approve?assetID=<your_asset_id>
//
app.get('/approve', function(req, res) {
    // retrieve the assetId passed in the query string
    var assetId = req.query.assetId;
    console.log(`AssetId received in query string: ${assetId}`);
    
    // prepare the body that will be passed to the Logic App
    var jsonInput = `{ "id": "${assetId}" }`;

    // initialize the HTTPS call options
    var options = initLogicAppCallOptions(urlLogicAppApprove);

    //
    // Call to the logic app with handlers to retrieve responses and send back the results
    //
    console.log("Now triggering the logic app %s", urlLogicAppApprove);
    var responseBody = "";
    var reqLogicApp = https.request(options, function(logicAppResponse) {
        
        console.log(`Server status: ${logicAppResponse.statusCode}`);
        
        logicAppResponse.setEncoding("UTF-8");
        logicAppResponse.on("data", function(chunk) {
            console.log(`-- chunk -- ${chunk.length}`);
            responseBody += chunk;
        });

        
        logicAppResponse.on("error", function(e) {
            console.log("Problem with Logic App request: " + e.message);
        });

        // once the answer from the Logic App is received (immediately), we can return the message to the user
        logicAppResponse.on("end", function() {
            //console.log("Returning the string %j", responseBody);
            res.end(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Asset Approved!</title>
                    </head>
                    <body>
                        <h1>We are glad you approved the asset ${assetId}</h1>
                        <p>This asset is being re-encoded in multiple bitrates for better experience across devices. </p>
                        <p>You will receive an e-mail as soon as the process is over. </p>
                    </body>
                </html>
            `);
        });
    });

    // request to Logic App
    reqLogicApp.write(jsonInput);
    reqLogicApp.end();
});

//
// Handler for: http://localhost:3000/reject?assetID=<your_asset_id>
//
app.get('/reject', function(req, res) {
    
    // retrieve the assetId passed in the query string
    var assetId = req.query.assetId;
    console.log(`AssetId received in query string: ${assetId}`);
    
    // prepare the body that will be passed to the Logic App
    var jsonInput = `{ "id": "${assetId}" }`;

    // initialize the HTTPS call options
    var options = initLogicAppCallOptions(urlLogicAppReject);

    //
    // Call to the logic app with handlers to retrieve responses and send back the results
    //
    console.log("Now triggering the logic app %s", urlLogicAppReject);
    var responseBody = "";
    var reqLogicApp = https.request(options, function(logicAppResponse) {
            
        console.log(`Server status: ${logicAppResponse.statusCode}`);
        
        logicAppResponse.setEncoding("UTF-8");
        logicAppResponse.on("data", function(chunk) {
            console.log(`-- chunk -- ${chunk.length}`);
            responseBody += chunk;
        });

        logicAppResponse.on("error", function(e) {
            console.log("Problem with Logic App request: " + e.message);
        });

        // once the answer from the Logic App is received (immediately), we can return the message to the user
        logicAppResponse.on("end", function() {
            //console.log("Returning the string %j", responseBody);
            res.end(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Asset Rejected!</title>
                    </head>
                    <body>
                        <h1>We are sorry to inform you that Asset ${assetId} has been rejected and deleted</h1>
                        <p>Please allow for a few minutes to let the system clean itself up!</p>
                    </body>
                </html>
            `);
        });
    });

    // request to Logic App
    reqLogicApp.write(jsonInput);
    reqLogicApp.end();
});

app.listen(3000);

//
// Helper function to initialize the HTTPS initLogicAppCallOptions
//
function initLogicAppCallOptions(urlstring) {
    var parsedUrl = url.parse(urlstring);
    var options = {
             hostname: parsedUrl.hostname,
             port: parsedUrl.port,
             path: parsedUrl.path,
             method: "POST",
             headers: {
                'Content-Type': 'application/json'
             }
    };
    return options;
}