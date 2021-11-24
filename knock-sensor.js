const mcpadc = require('mcp-spi-adc');

const VOLT_THRESHOLD = 0.1
const VOLT_COOLDOWN = 100 // miliseconds

let lastAboveThreshold = Date.now();

const knockTrigger = (onKnockCallback) => {
  const tempSensor = mcpadc.openMcp3008(1, { speedHz: 20000 }, err => {
    if (err) throw err;

    setInterval(_ => {
      tempSensor.read((err, reading) => {
        if (err) throw err;

        let volts = reading.value * 3.3;
        // if (volts > 0.01) {
        //   console.log(volts);
        // }
        if (volts > VOLT_THRESHOLD) {
          if (Date.now() - lastAboveThreshold > VOLT_COOLDOWN) {
            onKnockCallback();
          }
          lastAboveThreshold = Date.now();
        }
      });
    }, 100);
  });
}

module.exports = knockTrigger