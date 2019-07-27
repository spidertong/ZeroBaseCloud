const { app, BrowserWindow } = require('electron')
const { exec } = require('child_process');
const { ipcMain } = require('electron')

ipcMain.on('tts', (event, lang, arg) => {
  console.log(arg) 
  //exec('say ' + arg);
  //exec('python3 tts.py " ' + arg + '"')
  if(lang == "zh-yue") {
    console.log('macOS say:')
    exec('say -v Sin-ji ' + arg);
  }
  else{ 
    console.log('baidu_tts:')
    baidu_tts(lang, arg) 
  }
})
ipcMain.on('stt-start', (event, arg) => {
  console.log('ipcMain.on stt-start')
  exec('python3 stt.py').stdout.on('data', data => {
    console.log('ipcMain.on data:' + data)
    event.sender.send('stt-reply',data) 
  })
})
ipcMain.on('console-log', (event, arg) => {
  console.log(arg)
})





var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');


var baidu_tts = function(language, words){
  var  postData = querystring.stringify({
    "lan": language,//"lan": "en",//"zh",
    "ie": "UTF-8",
    "spd": 5,
    "text": words//"请问今天晚上下不下雨"
  })
  
  var options = {
    "method": "GET",
    "hostname": "tts.baidu.com",
    "path": "/text2audio?" + postData
  }
  
  var req = http.request(options, function(res){
    var chunks = [];
    res.on("data", function(chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function(){
      var body = Buffer.concat(chunks);
      var filePath = path.normalize('./baidu.mp3');
      fs.writeFileSync(filePath, body);

      var player = require('play-sound')(opts = {})
      player.play('./baidu.mp3', function(err){
        if (err) //throw err
          console.log(err)
      });
    });
  
  });
  
  req.end();  
};










// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({ width: 400
                          , height: 600
                          , webPreferences: {nodeIntegration: true} //https://stackoverflow.com/questions/55093700/electron-5-0-0-uncaught-referenceerror-require-is-not-defined
                          })  

  // 然后加载应用的 index.html。
  win.loadFile('index.html')

  // 打开开发者工具
  //win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
