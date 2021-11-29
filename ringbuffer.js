class RingBuffer {
  constructor(size) {
    this.n = size
    this.i = 0
    this.arr = new Array(this.n)
  }

  push(x) {
    this.i = (this.i + 1) % this.n;
    this.arr[this.i] = x;
  }

  max() {
    return Math.max(...this.arr);
  }
}

module.exports = RingBuffer