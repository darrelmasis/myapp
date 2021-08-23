class Storage {
  constructor() {
    this.defaultItem = 'history'

    if(!this.get(this.defaultItem)) {
      this.set(this.defaultItem, JSON.stringify([{}]))
    }
  }

  get(key) {

  }

  set(key, value) {

  }

  remove(key) {

  }

  update(currentValue, newValue) {

  }

}

export {Storage}