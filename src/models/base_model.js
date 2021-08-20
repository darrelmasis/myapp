module.exports = class User {
  constructor(t) {
    this.title = t
  }

  hello(name) {
    console.log('Hola ' + name)
  }
}