const bleno = require('@abandonware/bleno')
const ble = require('./ble-module')

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