const { exec } = require("child_process");

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

module.exports.ping = async function (host, onOnline, onOffline) {
    while (1) {
    const command = `ping -i 1 -W 1 -v -c 1 ${host}`;
    console.log("Sending command: " + command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`Ping error: ${error.message}`);
        }
        if (stderr) {
            console.log(`Ping stderr: ${stderr}`);
        }
        if (stdout) {
            console.log(`Ping stdout: ${stdout}`);
            if (stdout.indexOf("1 received") >= 0)
                onOnline();
            else
                onOffline();
        }
    });
    await delay(2000);
    }
};
