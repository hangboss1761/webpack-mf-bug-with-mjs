class AClass {
  constructor() {
    this.a = 1
  }

  install() {
    console.log('this.a', this.a)
  }
}

module.exports = AClass