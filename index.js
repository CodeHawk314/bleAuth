const bleno = require('@abandonware/bleno')
const ble = require('./ble-module')
require("./server")
const stepper = require("./stepper")
const knockTrigger = require("./knock-sensor")

console.log("starting...")

const PhoneKeyBLEService = new ble.PhoneKeyBLEService

bleno.on('stateChange', function (state) {
  console.log('BLE state is ' + (state ? 'ON' : 'OFF') + ' now')

  if (state === 'poweredOn') {
    bleno.startAdvertising('PhoneKey', ["5bfe7ad8-5148-4bbe-b512-fab861e505a5"])
  } else {
    bleno.stopAdvertising()
  }
})

bleno.on('advertisingStart', function (error) {
  console.log('BLE peripheral started advertising with ' + (error ? 'error: ' + error : 'success'))

  if (!error) {
    bleno.setServices([PhoneKeyBLEService])
  }
})

const onKnock = () => {
  console.log("A KNOCK OCCURRED")
  if (PhoneKeyBLEService.primaryCharacteristic.subscribed) {
    console.log("yes it's subscribed")
    PhoneKeyBLEService.primaryCharacteristic.valueDidChangeCallback(Buffer.from("auth request", 'utf8')) // notify
  } else {
    console.log("no way Jose")
  }
}

knockTrigger(onKnock)
// stepper.openCloseDoor();