const mcpadc = require('mcp-spi-adc');

const tempSensor = mcpadc.openMcp3008(1, { speedHz: 20000 }, err => {
  if (err) throw err;

  setInterval(_ => {
    tempSensor.read((err, reading) => {
      if (err) throw err;

//      console.log(reading.value * 3.3);
    });
  }, 100);
});
