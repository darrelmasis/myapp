const socket = io()
import { createCustomElement, select, addAttributes } from "./modules/dom";
import { storage } from "./modules/localStorage";

const searchForm = select('search-form', 'id')
const searchBar = select('search-bar', 'id')
const resultData = select('results-data', 'id')
const searchResults = select('search-results', 'id')
const resultsCount = select('results-count', 'id')
const resultsMessage = select('results-message', 'id')
const btnClear = select('btn-clear', 'id')
const spinner = select('spinner', 'id')
let limit = 10

searchBar.addEventListener('keyup', (e) => {
  socket.emit('search', {value: searchBar.value.trim()})
  resultData.classList.remove('d-none')
  btnClear.classList.remove('d-none')

  if(searchBar.value == '') {
    resultData.classList.add('d-none')
      btnClear.classList.add('d-none')
  }
})

searchBar.addEventListener('focus', (e) => {
  if(searchBar.value != '') {
    resultData.classList.toggle('d-none')
  }
})

searchForm.addEventListener('submit', (e) => {
  socket.emit('search', {value: searchBar.value.trim()})
  e.preventDefault()
})

btnClear.addEventListener('click', e => {
  resultData.classList.add('d-none')
  btnClear.classList.add('d-none')
  searchBar.value = ''
})



socket.on('search-results', data => {
  spinner.classList.add('d-none')
  const results = data.result
  if(results.length < limit) {
    limit = results.length
  } else if(results.length === 1) {
    limit = results.length
  } else if(results.length === 0) {
    limit = 0
  } else {
    limit = 10
  }
  if(searchResults.hasChildNodes()) {
    while (searchResults.childNodes.length >= 1) {
      searchResults.removeChild(searchResults.firstChild)
    }
  }

  if(results.length > 0 ) {
    for (let i = 0; i < limit; i++) {
      const customer = results[i]
        if(customer != undefined) {
          let content = createCustomElement('div', {id: 'result-box'}, [`<span class="icon icon-user me-3 d-inline-block"></span><span class="ml-3"><span class="text-secondary">${customer.customerCode}</span> ${customer.fullName}</span>`])
          let listItem = createCustomElement('a', {href: `/cliente/${customer.customerCode}`, class: 'list-group-item d-flex list-group-item-action border-0 rounded-0'}, [content])
          searchResults.appendChild(listItem)
        }
    }
    resultsMessage.innerHTML = ''
    limit > results.length ? limit = results.length : null
    resultsCount.innerHTML = ` <span class="flex-end text-secondary small">Mostrando ${limit} resultados de ${results.length}</span>`
  } else {
    resultsCount.innerHTML = ''
    resultsMessage.innerHTML = `No se han encontrado resultados para tu búsqueda <span class="search-criteria">(${searchBar.value})</span>`

  }
})