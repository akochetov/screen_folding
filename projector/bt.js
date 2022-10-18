const serialport = require("serialport");
const { exec } = require("child_process");

rfcomm = function (deviceMAC, cmd) {
    return new Promise((resolve, reject) => {
        const command = `sudo rfcomm ${cmd} /dev/rfcomm0 ${deviceMAC} 1`;
        console.log("Sending command: " + command);
        exec(command, (error, stdout, stderr) => {
            if (error || stderr || stdout) {
                console.log("Command response was: ");
                if (error) {
                    console.log(`error: ${error.message}`);
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
                if (stdout && stdout.indexOf("rfcomm0") == 0) {
                    console.log(`stdout: ${stdout}`);
                    resolve(stdout);
                    return;
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

module.exports.bind = function (deviceMAC) {
    return rfcomm(deviceMAC, "bind");
};

module.exports.release = function (deviceMAC) {
    return rfcomm(deviceMAC, "release");
};

module.exports.isConnected = async function (deviceMAC) {
    try {
        const status = await rfcomm(deviceMAC, "show");

        return status && status.indexOf(deviceMAC) >= 0;
    }
    catch {
        return false;
    }
};

module.exports.sendData = function (message, baudRate) {
    const path = "/dev/rfcomm0";

    const serialPort = new serialport.SerialPort({ path: path, baudRate: baudRate });

    serialPort.write(message, function (err) {
        if (err) {
            return console.log("Error on write: ", err.message);
        }
        console.log("Message sent successfully");
    });

};
