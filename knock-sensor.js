const mcpadc = require('mcp-spi-adc');
const RingBuffer = require('./ringbuffer')

const KNOCK_PATTERN = ".-..."

// const VOLT_THRESHOLD = 0.009
const VOLT_THRESHOLD = 0.02
const VOLT_COOLDOWN = 150 // miliseconds
const SHORT_KNOCK = 600 // between VOLT_COOLDOWN and 800 miliseconds
const LONG_KNOCK = 2000 // between SHORT_KNOCK and 2000 miliseconds

let lastAboveThreshold = Date.now();
let lastKnocks = "";
let lastKnockTime = Date.now()
let lastVolts = new RingBuffer(6)

let timeoutId;

const trackKnocks = (knock, callback) => {
  // console.log("Kock: ", knock);
  clearTimeout(timeoutId);
  lastKnocks += (knock);
  console.log("Last knocks: ", lastKnocks)
  if (lastKnocks === KNOCK_PATTERN.slice(0, -1)) {
    callback();
  }
  timeoutId = setTimeout(() => {
    console.log("new knock sequence")
    lastKnocks = ""
  }, LONG_KNOCK)
}

const knockDetected = (callback) => {
  console.log("knock detected")
  let now = Date.now();
  if (now - lastKnockTime < SHORT_KNOCK) {
    trackKnocks(".", callback)
  }
  else if (now - lastKnockTime < LONG_KNOCK) {
    trackKnocks("-", callback);
  }
  lastKnockTime = Date.now();
}

const knockTrigger = (onKnockCallback) => {
  const tempSensor = mcpadc.openMcp3008(1, { speedHz: 20000 }, err => {
    if (err) throw err;

    setInterval(_ => {
      tempSensor.read((err, reading) => {
        if (err) throw err;

        let volts = reading.value * 3.3;
        if (volts > VOLT_THRESHOLD) {
          console.log("volts: ", volts)
          if (volts > lastVolts.max() + 0.005) {
            let now = Date.now();
            // console.log("lastvolts max: ", lastVolts.max())
            // console.log("lastVolts: ", lastVolts.arr)
            if (now - lastAboveThreshold > VOLT_COOLDOWN) {
              knockDetected(onKnockCallback);
            }
            lastAboveThreshold = Date.now();
          }
          lastVolts.push(volts)
        }
        lastVolts.push(volts)
      });
    }, 10);
  });
}

module.exports = knockTrigger