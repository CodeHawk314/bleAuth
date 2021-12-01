const Gpio = require('onoff').Gpio;

class Stepper {
  constructor(stepPin, dirPin, enabledPin) {
    this.stepPin = new Gpio(stepPin, 'out');
    this.dirPin = new Gpio(dirPin, 'out');
    this.enabledPin = new Gpio(enabledPin, 'out');
    this.opening = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  turn(steps, dir) {
    this.dirPin.writeSync(dir);
    let s = steps * 2
    let lastTime = Date.now()
    let h = 0
    while (s > 0) {
      if (Date.now() - lastTime > 0) {
        this.stepPin.writeSync(h);
        h = h ^ 1;
        lastTime = Date.now();
        s--
      }
    }
  }

  // bad
  async old_turn(steps, dir) {
    return new Promise(async resolve => {
      this.dirPin.writeSync(dir);
      for (let i = 0; i < steps; i++) {
        this.stepPin.writeSync(0);
        await this.sleep(1);
        this.stepPin.writeSync(1);
        await this.sleep(1);
      }
      resolve();
    })
  }

  async openCloseDoor() {
    if (!this.opening) {
      this.opening = true;
      this.turn(1100, 1);
      await this.sleep(3000);
      this.turn(1100, 0);
      this.opening = false;
    }
  }
}

const stepper = new Stepper(17, 27, 22);

module.exports = stepper