const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/post', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err){
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  //mock user
  const user = {
    id: 1,
    username: 'braid',
    email: 'brad@gmail.com'
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    })
  });
});

//Format of token
//authorization: Bearer <access_token>

//verify Token
function verifyToken(req, res, next){
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(' ');
    //get token from array
    const bearerToken = bearer[1];
    // set the Token
    req.token = bearerToken;
    //nextmiddleware
    next();
  } else {
    //forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server Started on port 5000'));
