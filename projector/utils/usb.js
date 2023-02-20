const { exec } = require("child_process");

const TOGGLE_ON = 1;
const TOGGLE_OFF = 0;

const sendCommand = function (toggle) {
  const command = `echo ${toggle} | sudo tee /sys/devices/platform/soc/3f980000.usb/buspower > /dev/null`;
  console.log('Sending command: ' + command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`irrsend error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`irrsend stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`irrsemd stdout: ${stdout}`);
      return;
    }
  });
}

module.exports.on = function () {
    return sendCommand(TOGGLE_ON);
  }

module.exports.off = function () {
    return sendCommand(TOGGLE_OFF);
  }
