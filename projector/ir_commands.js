const config = require('config');

const lirc = require('./utils/lirc');

const irPreCommands = config.get('irPreCommands');
const irPostCommands = config.get('irPostCommands');

function sendCommands(commands) {
    var timeout = 500;
    for (var cmd in commands) {
        for (let i = 0; i < commands[cmd].repeat; i++) {
            const device = commands[cmd].device
            const command = commands[cmd].command;
            setTimeout(function () { lirc.sendCommand(device, command) }, timeout);
            
            timeout += 500;
        }
        timeout += 500;
    }
}

module.exports.sendIRPreCommands = function () {
    sendCommands(irPreCommands);
}

module.exports.sendIRPostCommands = function () {
    sendCommands(irPostCommands);
}
