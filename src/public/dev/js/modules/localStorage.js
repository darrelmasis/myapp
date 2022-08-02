class Storage {
  constructor() {
    this.defaultItem = 'history'

    if(!this.get(this.defaultItem)) {
      this.set(this.defaultItem, JSON.stringify({ users: []}))
    }
  }

  get(key) {
    return localStorage.getItem(key)
  }

  set(key, value) {
    localStorage.setItem(key, value)
  }

  remove(key) {
    localStorage.removeItem
  }

  update(currentValue, newValue) {

  }

}

export {Storage}