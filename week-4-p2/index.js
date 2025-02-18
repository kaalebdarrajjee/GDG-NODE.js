const http = require('http');


let users = [];

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


  if (method === 'GET' && url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (method === 'POST' && url === '/users') {
    parseJsonBody(req, (err, newUser) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }

      if (!newUser.name || !newUser.email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Name and email are required" }));
        return;
      }

      newUser.id = users.length + 1;
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else if (method === 'PUT' && url.startsWith('/users/')) {
    const userId = parseInt(url.split('/')[2]); // Extract ID from URL
    parseJsonBody(req, (err, updatedUser) => {
        if (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
        const index = users.findIndex(user => user.id === userId);
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "User not found" }));
          return;
        }
        users[index] = { ...users[index], ...updatedUser };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[index]));
    });
  } else if (method === 'DELETE' && url.startsWith('/users/')) {
    const userId = parseInt(url.split('/')[2]);
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }
    users.splice(index, 1);
    res.writeHead(204); 
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});


const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});