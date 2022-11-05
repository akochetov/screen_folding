const { exec } = require("child_process");
const serialport = require("serialport");

const path = "/dev/rfcomm0";
var serialPort = null;

rfcomm = function (deviceMAC, cmd) {
    return new Promise((resolve, reject) => {
        const command = `rfcomm ${cmd} /dev/rfcomm0 ${deviceMAC} 1`;
        console.log("Sending command: " + command);
          exec(command, (error, stderr, stdout) => {
          if (stderr || stdout) {
              console.log("Command response was: ");
              if (error) {
                  console.log(`error: ${error.message}`);
              }
              if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  if (stderr.indexOf("rfcomm0") == 0) {
                    resolve(stderr);
                    return;
                  }
              }
              if (stdout) {
                  console.log(`stdout: ${stdout}`);
                  if (stdout.indexOf("rfcomm0") == 0) {
                    resolve(stdout);
                    return;
                  }
              }
             reject();
          }
          else {
              console.log("Command returned no response = OK");
              resolve();
          }
         });
    });
};

module.exports.init = function (baudRate) {
    serialPort = new serialport.SerialPort({ path: path, baudRate: baudRate })
}

module.exports.bind = function (deviceMAC) {
    return rfcomm(deviceMAC, "bind");
};

module.exports.release = function (deviceMAC) {
    return rfcomm(deviceMAC, "release");
};

module.exports.isConnected = async function (deviceMAC) {
    try {
        const status = await rfcomm(deviceMAC, "show");
        console.log("status"+status);
        return status && status.indexOf(deviceMAC) >= 0;
    }
    catch {
        return false;
    }
};

module.exports.sendData = function (message) {
    console.log("Sending message to bluetooth device: " + message);
    serialPort.write(message, function (err) {
        if (err) {
            return console.log("Error on write: ", err.message);
        }
        console.log("Message sent successfully");
    });

};
