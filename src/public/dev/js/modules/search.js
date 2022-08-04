import { createCustomElement, select } from "./dom";
import { postData } from "./postData";

class Search {
  constructor(searchBar, clearButton, searchSpinner, searchIcon, searchResults, searchContainer) {
    // Search elements
    this.searchBar = searchBar
    this.clearButton = clearButton
    this.searchSpinner = searchSpinner
    this.searchIcon = searchIcon
    this.searchResults = searchResults
    this.searchContainer = searchContainer
    // search variables
    this.resultsLimit = 5 // cantidad máxima de resultados que se mostraran en pantalla
    this.delay = 300 // tiempo que se retrasa la consulta
    this.limit = 0 // controla el limite de la selección por teclas de dirección
    this.next = 0
    this.prev = 0
    this.current = 0
  }

  /**
   * TODO: Limpia la barra de búsqueda y oculta los resultados
   * @param {*} cb Recibe una función callback opcional
   */
  clear(searchElement = 'searchBar', cb = () => { }) {
    if (searchElement === 'results') {
      this.searchResults.resultsState.innerHTML = ''
      this.searchResults.searchResults.innerHTML = ''
      this.searchResults.resultsMessage.innerHTML = ''
    } else if (searchElement === 'searchBar') {
      this.searchBar.value = ''
      this.clearButton.classList.add('visually-hidden')
      this.hideResults()
    } else if (searchElement === 'onlySearchBar') {
      this.searchBar.value = ''
      this.clearButton.classList.add('visually-hidden')
    }
    cb()
  }

  toggleClearButton(counter, cb = () => { }) {
    if (counter > 0) {
      this.clearButton.classList.remove('visually-hidden')
    } else {
      this.clearButton.classList.add('visually-hidden')
    }
    cb()
  }

  showLoader() {
    this.searchSpinner.classList.remove('visually-hidden')
    this.searchIcon.classList.add('visually-hidden')
  }

  hideLoader() {
    this.searchSpinner.classList.add('visually-hidden')
    this.searchIcon.classList.remove('visually-hidden')
  }


  /**
   * TODO: Realiza una búsqueda personalizada en la base de datos
   * @param {string} searchValue Criterio de búsqueda
   * @returns Object
   */
  async search(searchValue, scrollLimit, cb = () => { }) {
    let results = {}
    let timeStart = Date.now()
    const response = await postData('/search', 'POST', {searchValue, scrollLimit}) // Obtenemos los resultados de la búsqueda segun el searchvalue
    let timeEnd = Date.now()
    results.response = response
    results.time = timeEnd - timeStart
    // return results
    results.response.data.length <= 5 ? this.resultsLimit = results.response.data.length : this.resultsLimit = 5
    cb()
    return new Promise((resolve, reject) => {
      resolve(results)
    })
  }

  showResults(data, isOpen) {
    if (isOpen) {
      const results = data.response.data
      // Limpiar resultados
      this.clear('results')
      // Mostrar resultados
      this.searchResults.resultsData.classList.remove('visually-hidden')
      this.searchContainer.classList.add('open')

      if (results.length === 0) {
        this.clear('results')
        this.searchResults.resultsMessage.innerHTML = `
          <div class="text-secondary text-center fw-semibold">No se han encontrado resultados para tu búsqueda</div>
          <div class="text-dark text-center fw-semibold small">(${searchBar.value})</div>
          `
      } else {
        this.clear('results')
        this.searchResults.resultsState.innerHTML = `<div class="text-muted small text-end me-3">${results.length} resultado(s) (${((data.time / 1000) - (this.delay / 1000)).toFixed(3)} segundos)</div>`
        for (let i = 0; i < this.resultsLimit; i++) {
          const resultItem = results[i];
          let userIcon = createCustomElement('span', { class: 'image-xsmall avatar me-3' }, [`<img class="avatar-image" src="https://res.cloudinary.com/darrelmasis/image/upload/${resultItem.avatar}">`])

          let customerIcon = createCustomElement('span', { class: 'me-3' }, ['<svg class="svg-inline--fa far-house-user fa-w-16 text-secondary" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="house-user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 224C352 259.3 323.3 288 288 288C252.7 288 224 259.3 224 224C224 188.7 252.7 160 288 160C323.3 160 352 188.7 352 224zM320 320C364.2 320 400 355.8 400 400C400 408.8 392.8 416 384 416H192C183.2 416 176 408.8 176 400C176 355.8 211.8 320 256 320H320zM272.5 5.7C281.4-1.9 294.6-1.9 303.5 5.7L567.5 229.7C577.6 238.3 578.9 253.4 570.3 263.5C561.7 273.6 546.6 274.9 536.5 266.3L512 245.5V432C512 476.2 476.2 512 432 512H144C99.82 512 64 476.2 64 432V245.5L39.53 266.3C29.42 274.9 14.28 273.6 5.7 263.5C-2.876 253.4-1.634 238.3 8.473 229.7L272.5 5.7zM112 204.8V432C112 449.7 126.3 464 144 464H432C449.7 464 464 449.7 464 432V204.8L288 55.47L112 204.8z"></path></svg>'])
          let icon = ''

          if (resultItem.type === 'cliente/') {
            icon = customerIcon
          } else if (resultItem.type === '@') {
            icon = userIcon
          }

          let content = createCustomElement('span', { class: 'text-truncate' }, [resultItem.fullName])
          let listItem = createCustomElement('a', { href: `/${resultItem.type}${resultItem.href}`, class: 'align-item-center list-group-item d-flex list-group-item-action border-0' }, [icon, content])
          this.searchResults.searchResults.appendChild(listItem)
        }
        
        if (results.length > 5) {
          let showAllResults = createCustomElement('a', { href: `/search/${searchBar.value}`, class: 'text-primary list-group-item text-center list-group-item-action border-0' }, ['Ver todos los resultados'])
          this.searchResults.searchResults.appendChild(showAllResults)
        }
      }
    }
  }

  hideResults() {
    this.clear('results')
    this.searchResults.resultsData.classList.add('visually-hidden')
    this.searchContainer.classList.remove('open')
  }

  navigate(direction, limit, list) {
    const getNext = () => {
      this.next < limit - 1 ? (this.next = ++this.current) : (this.next = 0)
      this.current = this.next
      list[this.next].classList.add("search-item__active")
      this.next > 0 && this.next < limit && list.length > 1
        ? list[this.next - 1].classList.remove("search-item__active")
        : list[limit - 1].classList.remove("search-item__active")
    }

    const getPrev = () => {
      this.current > 0 ? this.prev = --this.current : (this.prev = limit - 1)
      this.current = this.prev
      list[this.prev].classList.add("search-item__active")
      this.prev >= 0 && this.prev < limit - 1
        ? list[this.prev + 1].classList.remove("search-item__active")
        : list[0].classList.remove("search-item__active")
    }

    switch (direction) {
      case 'bottom':
        getNext()
        break
      case 'top':
        getPrev()
        break
    }
  }

}
const searchForm = select('searchForm') // Elemento form que contiene a la barra de búsqueda

if (searchForm) {
  const results = { resultsState, searchResults, resultsMessage, resultsData }
  const search = new Search(searchBar, clearButton, searchSpinner, searchIcon, results, searchContainer)
  const ilegalKeys = ['Enter', 'Control', 'Tab', 'CapsLock', 'Shift', 'Alt', 'Meta', 'AltGraph', 'ContextMenu', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Insert', 'Home', 'PageUp', 'End', 'PageDown', 'PrintScreen', 'ScrollLock', 'Pause']
  let timer = undefined
  let focus = false
  let letterCounter = 0
  let isOpen = false

  search.searchBar.addEventListener('keyup', e => {

    letterCounter = search.searchBar.value.trim().length
    search.toggleClearButton(letterCounter) // muestra u oculta el boton clear

    clearTimeout(timer) // reinicia el timer 
    // realiza la consulta solo si no es una tecla del array ilegalKeys
    if (!ilegalKeys.includes(e.key)) {
      if (letterCounter > 0) {
        search.showLoader()
        isOpen = true;
        timer = setTimeout(() => {
          const results = search.search(searchBar.value, {start: 0, end: 19999}) // Por ahora queda con un límite fijo de 20,000 registros
          results.then(data => {
            search.showResults(data, isOpen)
            search.hideLoader()
            if (letterCounter === 0) {
              search.hideResults()
            }
          })

        }, search.delay)
      } else {
        clearTimeout(timer)
        search.hideLoader()
        search.hideResults()
      }
    }
  })

  // /**
  //  * Eventos que detectan si el input está en foco
  //  */
  // search.searchBar.addEventListener('focus', e => {
  //   focus = true
  // })

  // search.searchBar.addEventListener('blur', e => {
  //   focus = false
  // })


  /**
   * Evento keydownpara navegar entre los resultados
   */
  // document.body.addEventListener('keydown', e => {
  //   // Contador de letras de la barra de búsqueda
  //   if (!ilegalKeys.includes(e.key) && search.searchBar.value !== '') {
  //     search.showLoader()
  //   }
  //   if (focus) {
  //     let key = e.key
  //     let direction = ''
  //     key === 'ArrowDown' ? direction = 'bottom' : direction = 'top'
  //     const regex = /(ArrowDown|ArrowUp)/g
  //     if (regex.test(key)) {
  //       const list = select('#searchResults .list-group-item', 'all')
  //       search.navigate(direction, search.limit, list)
  //     }
  //   }
  // })

  /**
   * Evento click en el método clear
   */
  search.clearButton.addEventListener('click', e => {
    search.clear('searchBar', () => {
      clearTimeout(timer)
      search.hideLoader()
      search.hideResults()
    })
  })


  //Evento submit
  searchForm.addEventListener('submit', e => {
    e.preventDefault()
    clearTimeout(timer)
    search.hideLoader()
    search.hideResults()
    const itemSelected = select('.search-item__active', 'q')
    if (itemSelected === null || itemSelected === 'null') {
      if (searchBar.value !== '') {
        location.href = `/search/${searchBar.value}`
        localStorage.setItem('currentSearch', searchBar.value)
      }
    } else {
      location.href = itemSelected.href
    }
  })
}

const resultsForm = select('resultsForm')

if (resultsForm) {
  const results = {}
  let scrollLimit = {}
  scrollLimit.start = 0
  scrollLimit.end = 9
  let isEnd = false
  
  const search = new Search(searchBar, clearButton, searchSpinner, searchIcon, results, searchContainer)
  search.searchBar.value = localStorage.getItem('currentSearch')

  // Ejecuta la función loadResults al hacer scroll
  
  const loadResults = (scrollLimit) => {

    preloader.classList.remove('visually-hidden')

    let data = search.search(searchBar.value, scrollLimit)
    
    data.then(results => {
      preloader.classList.add('visually-hidden')
      if (results.response.length === 0) {
        isEnd = true
        let content = `No se han encontrado resultados para tu búsqueda`
        const cardBody = createCustomElement('div', { class: "card-body" }, [content])
        const card = createCustomElement('div', {class: "text-center text-muted fw-semibold" }, [cardBody])
        allResults.appendChild(card)
      } else {
        for (let i = 0; i < results.response.data.length; i++) {
          const result = results.response.data[i]
  
  
          for (const key in result) {
            if (Object.hasOwnProperty.call(result, key)) {
              const element = result[key];
              element === null ? result[key] = '' : false
            }
          }
  
          const description = createCustomElement('div', { class: 'small text-muted' }, [result.description])
          const descriptionContainer = createCustomElement('div', { class: "d-flex align-items-center" }, [description])
  
          const resultFullName = createCustomElement('span', { class: "fw-semibold me-auto d-inline-block" }, [result.fullName])
          const resultFullNameContainer = createCustomElement('div', { class: "d-flex align-items-center mb-1" }, [resultFullName])
  
          const infoContainer = createCustomElement('div', { class: "col ps-0" }, [resultFullNameContainer, descriptionContainer])
  
          const avatarImage = createCustomElement('img', { class: "avatar-image", src: `https://res.cloudinary.com/darrelmasis/image/upload/${result.avatar}` }, [])
          const avatar = createCustomElement('div', { class: "image-medium avatar" }, [avatarImage])
          const avatarContainer = createCustomElement('div', { class: "col-auto me-3 pe-0" }, [avatar])
  
          const row = createCustomElement('div', { class: "row" }, [avatarContainer, infoContainer])
  
          const cardBody = createCustomElement('div', { class: "card-body" }, [row])
  
          const card = createCustomElement('a', { href: `/${result.type}${result.href}`, class: "card bg-white text-reset text-decoration-none position-realtive mt-3" }, [cardBody])
  
          allResults.appendChild(card)
        }
      }
    })
  }

  loadResults(scrollLimit)

  window.addEventListener('scroll', () => {
    
    let target = (document.documentElement.scrollHeight - window.innerHeight) - ((document.documentElement.scrollHeight - window.innerHeight) * 0.3)

    if (window.scrollY >= target && !isEnd) {
      scrollLimit.start += scrollLimit.end
      loadResults(scrollLimit)
    }
  })

  // if (search.searchBar.value !== '') {
  //   search.toggleClearButton(search.searchBar.value, 'r')
  // }
  // /**
  //  * Evento keyup en la barra de búsqueda
  //  */
  // search.searchBar.addEventListener('keyup', () => {
  //   search.toggleClearButton(search.searchBar.value, 'r')
  // })

  // /**
  //  * Evento click en el método clear
  //  */
  // search.clearButton.addEventListener('click', () => {
  //   search.clear('onlySearchBar')
  // })

  /**
   * Evento submit
   */
  resultsForm.addEventListener('submit', e => {
    e.preventDefault()
    preloader.classList.remove('visually-hidden')
    scrollLimit.start = 0
    allResults.innerHTML = ''
    loadResults(scrollLimit)
    // location.href = `/search/${searchBar.value}`
    localStorage.setItem('currentSearch', searchBar.value)
  })
}
