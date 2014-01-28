/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require("url");
var data = [];

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  var statusCode;
  var parsedURL = url.parse(request.url);
  console.log(parsedURL.pathname);

  var validURLs = {
    "/classes/room1" : true,
    "/classes/messages" : true
  };

  if(validURLs[parsedURL.pathname]){
      if(request.method === 'GET' || request.method === "OPTIONS") {
        statusCode = 200;
      } else if (request.method === 'POST'){
        request.on('data', function (chunk) {
          data.push(JSON.parse(chunk));
          console.log("new data: " + JSON.stringify(data, null, 2));
        });
      statusCode = 201;
      }
    }else{
      statusCode = 404;
    }
  console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

   console.log("sending data...: " + JSON.stringify(data, null, 2));
  response.end(JSON.stringify(data));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "X-Requested-With, content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = {
  handleRequest: handleRequest
};