'use strict';

const electron = require('electron');
const express = require('express');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

const config = require('./config.json');
const browserWindowSettings = config.browserWindow || { fullscreen: true };
var appUrl = config.url || 'file://' + __dirname + '/index.html';
if (!/:\/\//.test(appUrl)){
  appUrl = 'file://' + __dirname + '/' + appUrl;
}

if ( config.commandLineSwitches){
  Object.keys( config.commandLineSwitches ).forEach(function(s){
    app.commandLine.appendSwitch(s, config.commandLineSwitches[s]);
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, webContents;

function init(){
  startServer().then(startClient);
}

function startServer() {
  return new Promise(function(resolve,reject){
    // ... write code to start server then call resolve() 
    resolve();
  });
}

function startClient(){
  if (config.launchDelay){
    // workaround ala https://github.com/atom/electron/issues/1054#issuecomment-173368614
    setTimeout(function(){
      createWindow();
    }, config.launchDelay);
  }else{
    createWindow();
  }
}

function createWindow () {

  // workaround ala https://github.com/atom/electron/issues/1054#issuecomment-173368614
  var kiosk = browserWindowSettings.kiosk;
  if (config.kioskDelay && kiosk) {
    browserWindowSettings.kiosk = false;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow( browserWindowSettings );
  mainWindow.on('unresponsive',     function(e){ reload('window unresponsive',e); });

  webContents = mainWindow.webContents;
  webContents.on('did-finish-load', function (e) {
    // Open the DevTools.
    if (config.debug) webContents.openDevTools();
  });

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    console.log('Debug pressed');
    config.debug = !config.debug;
    if (config.debug){
      webContents.openDevTools();
    }else{
      webContents.closeDevTools();
    }
  });

  webContents.on('did-fail-load',   function(e){ reload('contents did-fail-load',e); });
  webContents.on('crashed',         function(e){ reload('contents crashed',e); });
  webContents.on('plugin-crashed',  function(e){ reload('contents plugin-crashed',e); });

  // and load the index.html of the app.
  webContents.session.clearCache(function(){
    mainWindow.loadURL( appUrl, { extraHeaders: 'pragma: no-cache\n' } );
  });

  // lock zoom
  if (!config.zoom) electron.webFrame.setVisualZoomLevelLimits(1, 1);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // workaround ala https://github.com/atom/electron/issues/1054#issuecomment-173368614
  if (config.kioskDelay && kiosk){
    setTimeout(function(){
      mainWindow.setKiosk(true);
    }, config.kioskDelay);
  }

  if (config.bounds){ resize(); }

}

function reload(eventName, eventObject) {
  setTimeout( function(){
    if (mainWindow) {
      mainWindow.loadURL( appUrl, { extraHeaders: 'pragma: no-cache\n' } );
    }
  }, config.reloadTimeout || 3000 );
}

function resize(bounds){
  mainWindow.setBounds(config.bounds);
  setInterval( function(){
    mainWindow.setBounds(config.bounds);
  }, config.resizeTimeout || 3000 );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
