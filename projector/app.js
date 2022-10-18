const noble = require("noble");

noble.on('stateChange', state => {
    if (state === 'poweredOn') {
        console.log('Scanning');
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', peripheral => {
    // connect to the first peripheral that is scanned
    const name = peripheral.advertisement.localName;
    if (name.toLowerCase().indexOf('esp32') >= 0) {
        noble.stopScanning();
        console.log(`Connecting to '${name}' ${peripheral.id}`);
        connectAndSetUp(peripheral);
    }
});

function connectAndSetUp(peripheral) {
    peripheral.connect(error => {
        console.log('Connected to', peripheral.id);
    });

    peripheral.on('disconnect', () => console.log('disconnected'));
}