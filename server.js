const http = require('http');
const fs = require('fs');

const server = http.createServer(
    (request, response) => {
        response.setHeader("Content-Type", "text/html");
        //response.end('/index.html');
        fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(response);
    }
);

//Starts the server
server.listen(8080);
console.log("Server listening on port 8080");