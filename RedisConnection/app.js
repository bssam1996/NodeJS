const redis = require('redis')
const dotenv = require("dotenv")
const express = require("express")

// Load Config
dotenv.config({path:'./config/config.env'})


const redis_client = redis.createClient({
    // url: `redis://alice:${process.env.REDIS_PASS}@${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`
    socket: {
        host:process.env.REDIS_HOSTNAME,
        port:process.env.REDIS_PORT
      },
    password: process.env.REDIS_PASS
});
redis_client.on('error', err => {
    console.log('Redis ' + err);
});
redis_client.on('connect', function() {
    console.log('Connected!');
  });
const app = express()
redis_client.connect()
const port = process.env.PORT || 3001

app.listen(
    port,
    console.log(`Server running on port ${port}`)
)

app.get("/testrediss",(req,res)=>{
    send();
    res.send("Sent");
})
app.get("/testredisr",(req,res)=>{
    receive();
    res.send("Received");
})
const send = async ()=>{
    await redis_client.set('foo', 'bar', (err, reply) => {
        if (err){
            console.log(err);
            return;
        } 
    });
    console.log("Sent");
}
const receive = async ()=>{
    const value = await redis_client.get('foo', (err, reply) => {
        if (err){
            console.log(err);
            return;
        }
    });
    console.log(value);
    console.log("Received");
}
// sendandRetrieve();