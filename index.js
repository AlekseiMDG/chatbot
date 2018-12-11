const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mongoose = require('./conf/mongo_db');
var WorkerModel = require('./models/myModel');
const firebase_database = require('./conf/firebase');
const { WebhookClient } = require('dialogflow-fulfillment');

// // "start": "npm run shell",
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({request: request, response: response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));    

    function simpleWordOnEn(agent){    
        console.log('LOCAL is = ' + agent.locale);    
        agent.add('you are perfect');
    }

    function simpleWordOnRu(agent){    
        console.log('LOCAL is = ' + agent.locale);    
        agent.add('ты прекрасен');
    }

    function searcheColleagueByName(agent){
        var lastname = agent.parameters.lastname;
        console.log('search colleague = ' + lastname);
                
        return firebase_database.ref().once('value')
        .then(team => {
            var answer;
            team.forEach(function(childSnapshot){
                var teamName = childSnapshot.child('team').val();
                var teamVar = childSnapshot.child('lineUp').val();
                
                teamVar.forEach(teamSber => {                  
                    if(lastname == teamSber.last_name){                        
                        answer = "Нашел такого в команде " + teamName 
                        + ". Можешь написать ему в телеграмм - "  + teamSber.telegramm_acc;                                                                  
                    }                    
                });
            }); 
            
            if(answer == undefined){
                answer = "Не знаю, посмотри в МУССе";
            } 
            agent.add(answer);      
        })
        .catch(err => {
            console.log('Что-то пошло не так ');
            console.log('А именно: ' +err);
            agent.add("Что то не так");
        });       
    }

    let intentMap = new Map();
    if(agent.locale == 'en'){
        intentMap.set('simple word', simpleWordOnEn);
    }
    if(agent.locale == 'ru'){
        intentMap.set('simple word', simpleWordOnRu);    
    }

    intentMap.set('search_colleague', searcheColleagueByName);    
    agent.handleRequest(intentMap);
}); 