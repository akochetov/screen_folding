const { exec } = require("child_process");

// https://forums.raspberrypi.com/viewtopic.php?t=52309
const STATE_PLUGGED = "0x40000";
const STATE_ATTACHED = "0x1200";

const INTERVAL_MS = 2000;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

module.exports.ping = async function (host, onOnline, onOffline) {
    while (1) {
    const command = `tvservice -s`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`HDMI status error: ${error.message}`);
            onOffline();
            return;
        }
        if (stderr) {
            console.log(`HDMI status stderr: ${stderr}`);
            onOffline();
            return;
        }
        if (stdout) {
            console.log(`HDMI status stdout: ${stdout}`);
            if (stdout.indexOf(STATE_PLUGGED) > 0 || stdout.indexOf(STATE_ATTACHED))
                onOnline();
            return;
        }
    });
    await delay(2000);
    }
};
