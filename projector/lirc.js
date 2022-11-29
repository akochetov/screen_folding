// https://github.com/alexbain/lirc_node

// Sending commands
lirc_node = require('lirc_node');
lirc_node.init();

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);

module.exports.sendCommand = function (device, command, repeat) {
    for (let i = 0; i < repeat; i++)
        lirc_node.irsend.send_once(device, command, function() {
            console.log(`Sent command ${command} to device ${device}.`);
        });
}
