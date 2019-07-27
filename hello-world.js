var botui = new BotUI('hello-world');


var BotSay= function(lang, word){
  return botui.message.add({
    content: word
  })
  .then(function() {
    ipcRenderer.send('tts', lang, word)
  });
}

var BotAsk = function(lang, word){
   BotSay(lang, word)
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

BotAsk('en', 'Hello, well come to InsuGO! This is Gogo, I am happy to help!')

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

count = 1;
function AskBot(words)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      //BotAsk(this.responseText);
      ipcRenderer.send('console-log', 'this.readyState=' + this.readyState + '; this.status=' + this.status + '; this.responseType=' + this.responseType );
      if (this.readyState == 4 && this.status == 200) 
      {
        if (count == 1) {
          BotAsk("en", "I am InsuGo, Insurance Chat Bot.");
          count = count + 1;
          return;
        }
        if (count == 2) {
          BotAsk("zh-yue","你好， 你尾号为2684嘅保单， 现金价值系18000港元。");
          count = count + 1;
          return;
        }
        if (count == 3) {
          BotAsk("zh", "你才是垃圾， 你全家都是垃圾！");
          count = count + 1;
          return;
        }
        /*
        try {
          ipcRenderer.send('console-log', 'try to parse json:' + this.responseText);
          var myObj = JSON.parse(this.responseText); 
          ipcRenderer.send('console-log', 'this.responseText has been parsed')
          if (myObj.action == "PolicyEnquiry") {
            ipcRenderer.send('console-log', 'Is PolicyEnquiry')
            //BotAsk(myObj.result.contractName)
            BotAsk(myObj.result)
          }
          else{
            ipcRenderer.send('console-log', 'Not PolicyEnquiry')
            BotAsk(myObj.stringResponse);
          }    
        } catch (error) {
          BotAsk('Error:' + error);
        } */
      }
      else{
        //if (this.readyState == 4)
          //BotAsk(this.responseText)
      }
    };
    //xmlHttp.open( "GET", 'http://35.185.128.111:8080/'+words, true ); // false for synchronous request
    xmlHttp.open( "GET", 'http://104.199.161.132:8080/'+words, true ); 
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