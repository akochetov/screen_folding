const process = require('process');
process.chdir(__dirname);

const http = require('http');
const config = require('config');

const status_ping = require('./monitors/ping');

const usbCommands = require('./utils/usb');
const irCommands = require('./ir_commands');

const projectorHost = config.get('projectorHost');
const screenHost = config.get('screenHost');
const stopInterval = config.get('stopInterval');
const rollUpIfNoPings = config.get('rollUpIfNoPings');
const irCommandsStartDelay = config.get('irCommandsStartDelay');

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

function onOnline() {
    // reset count of no-pings
    noPingCount = 0;
    
    if (isDown) return;

    // projector is online - roll the screen down
    down();

    // turn usb off and then on to wake up BT audio USB stick
    usbCommands.off();
    usbCommands.on();

    // schedule IR commands
    setTimeout(irCommands.sendIRPreCommands, irCommandsStartDelay);

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

    // schedule IR commands
    irCommands.sendIRPostCommands();

    isDown = false;
}

function doit() {
  console.log("Start pinging projector...");

  status_ping.ping(projectorHost, onOnline, onOffline);
//  status_hdmi.ping(onOnline, onOffline);
}

async function init_and_start() {
  isDown = await status_ping.isOnline(projectorHost);

  console.log(`Initial projector state at start: isDown = ${isDown}`);

  doit();
}

init_and_start();

