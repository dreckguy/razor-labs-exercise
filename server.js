const express = require('express')
const axios = require('axios')
const uuidv4 = require('uuid').v4;

const config = require('./config')
const helper = require('./helper')

let msgQueue = []
let msgStatus = {}

function handleMsg(){
    if(msgQueue.length){
        let msg = msgQueue.shift()
        if(helper.hasBadWords(msg.message)|| helper.isOld(msg)){
            msgStatus[msg.transaction_id] = 'FAILED'
        }else{
            const serviceMsg = Object.assign({}, msg);
            delete serviceMsg.transaction_id
            axios.post(config.FAKE_SMS_URL,serviceMsg)
                .then(response=>{
                    msgStatus[msg.transaction_id] = 'SENT '
                })
                .catch(err=>{
                    msgStatus[msg.transaction_id] = 'FAILED'
                }) 
        }
    }
}

setInterval(handleMsg,config.RATE_LIMITING)

const app = express();
app.use(express.json());

app.get('/', function(req, res){
  res.send('Server is listenning to post requests...');
});

app.get('/', function(req, res){
    res.send('Server is listenning to post requests...');
  });

  app.post('/', function(req, res){  
    const transaction_id = uuidv4();
    let msgBody = req.body
    msgBody.transaction_id = transaction_id
    msgBody.time = new Date()
    msgQueue.push(msgBody)
    res.send(transaction_id);
    msgStatus[transaction_id] = 'ACCEPTED' 
    console.log(`Just received a msg!\n There are ${msgQueue.length} msgs to send`)
  });

  app.get('/:transaction_id',(req,res)=>{
    let transaction_id = req.params.transaction_id
    const status = msgStatus[transaction_id]
    res.send(status)
  });



app.listen(config.SERVER_PORT, () => {
    console.log(`Server is listening at http://localhost:${config.SERVER_PORT}`)
  })
