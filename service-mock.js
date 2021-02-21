const express = require('express')
const app = express();

const config = require('./config')

app.get('/', function(req, res){
    res.send('Service Mock is online');
  });

  app.post('/', function(req, res){
    res.send('OK');
  });




app.listen(config.SERVICE_MOCK_PORT, () => {
    console.log(`Service Mock is listening at http://localhost:${config.SERVICE_MOCK_PORT}`)
  })

