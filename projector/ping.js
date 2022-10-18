module.exports.ping = function(host, onOnline, onOffline){
    execute("ping -i 1 -W 1 -v 1 " + host, function(data) {
        if (data && data.indexOf("bytes") == 0)
            onOnline();
        else
            onOffline();
    });
};