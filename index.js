'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server
const request = require('request');
const https = require('https');
const weather=require('./weather');

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
               if(webhook_event.message){
                   handle_message(webhook_event.sender.id,webhook_event.message);
               }
            //    else {
            //        handlePost(webhook_event.sender.id,webhook_event.postback);
            //    }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }

});
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = <VERIFY_TOKEN>

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.send("OK");

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
            res.send("Error");
        }
    }
});

function handle_message(sender_id,mes){
    var res;
    if(mes.text!='Hi' && mes.text!='hi' && mes.text!='HI' &&  mes.text!='Hello' && mes.text!='Hey'&& !(mes.attachments)){

        var x=weather(mes.text);
        x.then(function(result){
           var  usr=result;
           var  temp=usr.main.temp;
           var sky=usr.weather[0].description;
           var humid=usr.main.humidity;
           var wind=usr.wind.speed;
            // var temperature=toString(temp);
           temp=temp-273.15;
           temp=temp.toFixed(2);
            res={
                "text":`Weather Details in ${mes.text} is as follow:\n Sky is ${sky}\n Temperature is  ${temp} deg Celcius\n Humidity is ${humid}%  and Wind Speed is ${wind}Kmph`
            }
            sendMsg(sender_id,res);
        
        },function(err){
            res={
                "text":`I am afraid that I can't help you with this `
            }
            sendMsg(sender_id,res);
        }).catch(()=>{
            res={
                "text":`I am afraid that I can't help you with this `
            }
            sendMsg(sender_id,res);
        })
       
        
       
    }
     if(mes.text==='Hi' || mes.text==='hi' || mes.text==='HI'|| mes.text==='Hello' || mes.text==='Hey'){
        res={
            "text":`Hi ,Please Enter desired City name to get weather details`
        }
        sendMsg(sender_id,res);
    }
    if (mes.attachments) {
  
        // Gets the URL of the message attachment
        var loc = mes.attachments[0].payload.title;
        console.log(loc);

        var x=weather(loc);
        x.then(function(result){
           var  usr=result;
           var  temp=usr.main.temp;
            // var temperature=toString(temp);
           temp=temp-273.15;
           temp=temp.toFixed(2);
           var sky=usr.weather[0].description;
           var humid=usr.main.humidity;
           var wind=usr.wind.speed;
            res={
                "text":`Weather Details in ${loc} is as follow:\n Sky is ${sky}\n Temperature is  ${temp} deg Celcius\n Humidity is ${humid}%  and Wind Speed is ${wind}Kmph`
            }
            sendMsg(sender_id,res);
        
        },function(err){
            res={
                "text":`I am afraid that I can't help you with this ${loc}`
            }
            sendMsg(sender_id,res);
        }).catch(()=>{
            res={
                "text":`I am afraid that I can't help you with this ${loc}`
            }
            sendMsg(sender_id,res);
        })
     
      } 
  //  sendMsg(sender_id,res);
}
function sendMsg(sender_id,res){
    let request_body = {
        "recipient": {
          "id": sender_id
        },
        "message": res
      }
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": <ACCESS_TOKEN> },
        "method": "POST",
        "json": request_body
      }, (err, resP, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
}
