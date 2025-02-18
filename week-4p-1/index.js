// index.js
import http from 'http'

const PORT = 5001;

const server = http.createServer((req, res) => {
  const { method, url } = req;

 
  const parseJsonBody = (req, callback) => {
    if (req.headers['content-type'] === 'application/json') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          callback(null, parsedBody);
        } catch (error) {
          callback(error);
        }
      });
    } else {
      callback(new Error('Invalid content type. Expected application/json'));
    }
  };


  if (method === 'GET' && url === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  } else if (method === 'POST' && url === '/data') {
    parseJsonBody(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message })); 
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data)); 
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});