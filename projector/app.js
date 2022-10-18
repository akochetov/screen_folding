const config = require('config');
const bt = require('./bt');
const ping = require('./ping');

const btConfig = config.get('bluetooth');
const projectorHost = config.get('projectorHost');
const stopInterval = config.get('stopInterval');
const rollUpIfNoPings = config.get('rollUpIfNoPings');

var isDown = false;
var noPingCount = 0;

function stop() {
    bt.sendData("STOP");
}

function onOnline() {
    // reset count of no-pings
    noPingCount = 0;
    
    if (isDown) return;

    // projector is online - roll the screen down
    bt.sendData("DOWN");
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
    bt.sendData("UP");
    isDown = false;
}

bt.init(btConfig.baudRate);

if (!bt.isConnected(btConfig.deviceMAC))
    bt.bind(btConfig.deviceMAC)
    .then(() => {
        console.log("Bluetooth channel connected.");
    })
    .catch(() => {
        console.log("Couldn't bind bluetooth device channel. Exiting.");
    });

 console.log("Start pinging projector...");
 ping.ping(projectorHost, onOnline, onOffline);

