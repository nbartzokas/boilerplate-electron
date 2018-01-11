var https = require('https');
var request = require('request');
var express  = require('express');
var fs = require('fs');

var key = fs.readFileSync( 'key.pem' );
var cert = fs.readFileSync( 'cert.pem' );

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs

//// example localhost server
// var frontendApp = express();
// frontendApp.use(function(req,res) {
//   request('https://localhost:8080/'+req.path).pipe(res);
// });
// var frontendServer = https.createServer({ 
//   key: key,
//   cert: cert 
// }, frontendApp);
// frontendServer.listen(8080);

//// example local proxy to remote server
// var backendApp = express();
// backendApp.use(function(req,res) {
//   request('https://ec2-54-174-220-60.compute-1.amazonaws.com/'+req.path).pipe(res);
// });
// var backendServer = https.createServer({ 
//   key: key,
//   cert: cert 
// }, backendApp);
// backendServer.listen(443);
