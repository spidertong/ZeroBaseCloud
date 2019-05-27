var botui = new BotUI('hello-world');


var BotSay= function(word){
  return botui.message.add({
    content: word
  })
  .then(function() {
    ipcRenderer.send('tts', word)
  });
}

var BotAsk = function(word){
   BotSay(word)
   .then(function() {
    botui.action.text({
      action: {
        placeholder: 'Enter your text here'
      }
    }).then(function (words) {
      AskBot(words)
    });
  })
}

BotAsk('Hello, well come to Cloud chat bot!')

/*
function AskBot(words)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        BotAsk(myObj.queryResult.fulfillmentText);
      }
    };
    xmlHttp.open( "GET", 'http://35.229.208.102:5000/'+words, true ); // false for synchronous request
    xmlHttp.send( null );
} */
function AskBot(words)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      //BotAsk(this.responseText);
      if (this.readyState == 4 && this.status == 200) {
        //if(this.responseType == "json") {
          var myObj = JSON.parse(this.responseText);
          if (myObj.action == "PolicyEnquiry") {
            //BotAsk(myObj.result.contractName)
            BotAsk(myObj.result)
          }
          else{
            BotAsk(myObj.stringResponse);
          }
        //}
        //else{
        //  var myObj = JSON.parse(this.responseText);
        //  BotAsk("ResponseType is NOT a json:" + myObj.queryResult.fulfillmentText)
        //}
      }
      else{
        //if (this.readyState == 4)
          BotAsk(this.responseText)
      }
    };
    xmlHttp.open( "GET", 'http://35.185.128.111:8080/'+words, true ); // false for synchronous request
    //xmlHttp.open( "GET", 'http://104.199.161.132:8080/'+words, true ); 
    //xmlHttp.open( "GET", 'http://35.229.208.102:5000/'+words, true ); 
    xmlHttp.send( null );
}


var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})

var lastIdex
var startSpeechRecognition = function(){
  BotSay('I am listening')
  botui.message.add({
    loading: true,
    human:true
  })
  .then(function(index){
    lastIdex = index
    ipcRenderer.send('stt-start', 'any')
  })
}

ipcRenderer.on('stt-reply', (event, arg) => {
  botui.message.update(lastIdex, {
    loading: false,
    content: arg
  });
  lastIdex = 0
  AskBot(arg)
})