const process = require('process');
process.chdir(__dirname);

const http = require('http');
const config = require('config');

const status_ping = require('./monitors/ping');
const status_hdmi = require('./monitors/hdmi');
const lirc = require('./lirc');

const projectorHost = config.get('projectorHost');
const screenHost = config.get('screenHost');
const stopInterval = config.get('stopInterval');
const rollUpIfNoPings = config.get('rollUpIfNoPings');
const irCommandsStartDelay = config.get('irCommandsStartDelay');
const irCommands = config.get('irCommands');

const SIGNAL_UP = "UP";
const SIGNAL_DOWN = "DOWN";
const SIGNAL_STOP = "STOP";

var isDown = false;
var noPingCount = 0;

function send(signal) {
  http.get(`http://${screenHost}/${signal}`, (resp) => {
    let data = '';
  
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

function up() {
  send(SIGNAL_UP);
}

function down() {
  send(SIGNAL_DOWN);
}

function stop() {
  send(SIGNAL_STOP);
}

function sendIRCommands() {
  // turning sound bar on goes first
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.soundbarAudioIn))}, 100);

  // screen connection on
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorCorrection))}, 1000);

  // vertical correction
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorUp))}, 2000);
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorDown))}, 3000);
  
  // horizontal correction
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorLeft))}, 4000);
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorRight))}, 5000);

  // screen connection on
  setTimeout(function(){lirc.sendCommand(...Object.values(irCommands.projectorCorrection))}, 6000);
}

function onOnline() {
    // reset count of no-pings
    noPingCount = 0;
    
    if (isDown) return;

    // projector is online - roll the screen down
    down();

    // schedule IR commands
    setTimeout(sendIRCommands, irCommandsStartDelay);

    isDown = true;
    // stop rolling it down after certain timeout
    setTimeout(stop, stopInterval);
}

function onOffline() {
    if (!isDown) return;

    if (noPingCount < rollUpIfNoPings ) {
        noPingCount++;
        return;
    }

    // project is now off - roll the screen up
    up();

    isDown = false;
}

function doit() {
  console.log("Start pinging projector...");

  status_ping.ping(projectorHost, onOnline, onOffline);
  status_hdmi.ping(onOnline, onOffline);
}

async function init_and_start() {
  doit();
}

sendIRCommands();

init_and_start();

