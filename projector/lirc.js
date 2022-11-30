const { exec } = require("child_process");

module.exports.sendCommand = function (device, key, repeat) {
    for (let i = 0; i < repeat; i++) {
      const command = `sudo irsend SEND_ONCE ${device} ${key}`;
      console.log('Sending command: '+command);
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
}
