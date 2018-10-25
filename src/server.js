const http = require('http');

const app = require('./app');

const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT);

server.on('listening', () =>
{
  console.log(`server is listening for requests on port ${PORT}`);
});