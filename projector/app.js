const config = require('config');
const bt = require('./bt');
const ping = require('./ping');

const btConfig = config.get('bluetooth');
const projectorHost = config.get('projectorHost');
const stopInterval = config.get('stopInterval');

function stop() {
    bt.sendData("STOP", btConfig.baudRate);
}

function onOnline() {
    // projector is online - roll the screen down
    bt.sendData("DOWN", btConfig.baudRate);

    // stop rolling it down after certain timeout
    setTimeout(stop, stopInterval);
}

function onOffline() {
    // project is now off - roll the screen up
    bt.sendData("UP", btConfig.baudRate);
}

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

