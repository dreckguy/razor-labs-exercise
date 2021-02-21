const express = require('express')
const axios = require('axios')
const uuidv4 = require('uuid').v4;

const config = require('./config')

let msgQueue = []
let msgStatus = {}

function hasBadWords(string){
    let badWords = fs.readFileSync('bad-words.txt').toString().split("\n");
    return true
}

function isOld(msg){
    return Date.now() - msg.time.getMilliseconds() < config.TIMEOUT

}
function handleMsg(){
    if(msgQueue.length){
        let msg = msgQueue.shift()
        if(hasBadWords(msg.message)|| isOld(msg)){
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

setInterval(handleMsg,config.SENDING_INTERVAL)

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





app.listen(config.SERVER_PORT, () => {
    console.log(`Server is listening at http://localhost:${config.SERVER_PORT}`)
  })
