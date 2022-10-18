const { exec } = require("child_process");

module.exports.ping = function (host, onOnline, onOffline) {
    exec("ping -i 1 -W 1 -v 1 " + host, (error, stdout, stderr) => {
        if (error) {
            console.log(`Ping error: ${error.message}`);
        }
        if (stderr) {
            console.log(`Ping stderr: ${stderr}`);
        }
        if (stdout) {
            console.log(`Ping stdout: ${stdout}`);
            if (stdout.indexOf("bytes") >= 0)
                onOnline();
            else
                onOffline();
        }
    });
};