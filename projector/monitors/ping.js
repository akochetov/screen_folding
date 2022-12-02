const util = require('util')
const exec = util.promisify(require('child_process').exec);

const INTERVAL_MS = 2000;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

module.exports.isOnline = async function (host) {
    const command = `ping -i 1 -W 1 -v -c 1 ${host}`;
    
    try {
        const {error, stdout, stderr} = await exec(command);

        if (error) {
            console.log(`Ping error: ${error.message}`);
            return false
        }
        if (stderr) {
            console.log(`Ping stderr: ${stderr}`);
            return false
        }

        console.log(`${command} returned: ${stdout}`);
        return true;
    }
    catch {
        console.log(`Ping error`);
        return false;
    }
}

module.exports.ping = async function (host, onOnline, onOffline) {
    while (1) {
        if (await module.exports.isOnline(host))
            onOnline();
        else
            onOffline();
        await delay(INTERVAL_MS);
    }
};

