const serialport = require("serialport");
const path  = "/dev/rfcomm0";
const baudRate = 115200;
const message = "Hakuna Matata";

const serialPort = new serialport.SerialPort({ path: path, baudRate: baudRate});

serialPort.write(message, function(err) {
  if (err) {
    return console.log("Error on write: ", err.message);
  }
  console.log("Message sent successfully");
});
