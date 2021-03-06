const { Characteristic } = require('@abandonware/bleno')
const bleno = require('@abandonware/bleno')
const stepper = require("./stepper")
const validateToken = require('./authenticate')

class PhoneKeyBLEService extends bleno.PrimaryService {
  constructor() {
    super({
      uuid: "5bfe7ad8-5148-4bbe-b512-fab861e505a5",
      characteristics: [new PhoneKeyBLECharacteristic()]
    })

    this.valueDidChangeCallback = null
    this.primaryCharacteristic = this.characteristics[0]
    console.log("service made")
  }
}

class PhoneKeyBLECharacteristic extends bleno.Characteristic {
  constructor() {
    super({
      value: null,
      uuid: "13ebbac0-73ab-43b5-bd1b-775ec77171ea",
      properties: ['read', 'notify', 'write']
    })
    this.subscribed = false

    console.log("characteristic made")
  }

  onReadRequest(offset, callback) {
    console.log('CustomCharacteristic onReadRequest');
    var data = new Buffer.alloc(1);
    data.writeUInt8(42, 0);
    callback(this.RESULT_SUCCESS, data)
  };

  onSubscribe(maxValueSize, callback) {
    console.log('BLE characteristic subscribed')

    this.subscribed = true
    this.valueDidChangeCallback = callback
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    // console.log('write request')
    let token = data.toString()
    // console.log(token)

    bleno.updateRssi((error, rssi) => {
      if (rssi > -75) {
        let validated = validateToken(token)
        if (validated) {
          console.log("AUTHENTICATED. OPENING DOOR.")
          stepper.openCloseDoor();
          this.valueDidChangeCallback(Buffer.from("unlocking", 'utf8'))
        } else {
          console.log("access denied")
          this.valueDidChangeCallback(Buffer.from("invalid token", 'utf8'))
        }
      } else {
        console.log("phone too far away")
        this.valueDidChangeCallback(Buffer.from("too far", 'utf8'))
      }
    })

    var result = Characteristic.RESULT_SUCCESS;
    callback(result);
  }

  onUnsubscribe() {
    this.subscribed = false
    console.log('BLE characteristic unsubscribed')
  }

}

module.exports.PhoneKeyBLEService = PhoneKeyBLEService
