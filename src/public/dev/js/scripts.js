const socket = io()
import { createCustomElement, select, addAttributes } from "./modules/dom";
import { storage } from "./modules/localStorage";

class Search {

  constructor() {

  }


}

const searchForm = select('search-form', 'id')
const searchBar = select('search-bar', 'id')
const resultData = select('results-data', 'id')
const searchResults = select('search-results', 'id')
const resultsCount = select('results-count', 'id')
const resultsMessage = select('results-message', 'id')
const btnClear = select('btn-clear', 'id')
const spinner = select('spinner', 'id')

const search = select('search', 'id')
let limit = 10

let key = -1;
let prev = -2;

searchBar.addEventListener('keyup', e => {
  if (e.key != 'ArrowDown' && e.key != 'ArrowUp') {
    socket.emit('search', { value: searchBar.value.trim() })
    key = 0
    prev = -1
    resultData.classList.remove('d-none')
    btnClear.classList.remove('invisible')
    search.classList.add('open')


    if (searchBar.value == '') {
      resultData.classList.add('d-none')
      btnClear.classList.add('invisible')
      search.classList.remove('open')

    }
  }

  
})



searchBar.addEventListener("keydown", (e) => {
let mylist = document.querySelectorAll('.list-group-item');

  if(mylist) {

    if (e.key === 'ArrowDown') {
      console.dir(mylist[key])
    searchBar.value = mylist[key].innerText
    key < limit - 1 ? key++ : key = key - (limit - 1)
    key === 0 ? prev = limit -1 : prev = key - 1 
    mylist[key].classList.add("active");
    if (prev != -1) {
      mylist[prev].classList.remove("active")
    }

  } else if (e.key === 'ArrowUp') {
    key < 0 ? key = limit - 1: key--
    key < limit -1 ? prev = key  +1 : prev = 0
    if (prev != -1) {
      mylist[prev].classList.remove("active")
    }
    mylist[key].classList.add("active");


  }
  }
});


// searchBar.addEventListener('focus', (e) => {
//   if(searchBar.value != '') {
//     resultData.classList.toggle('d-none')
//   }
// })

searchForm.addEventListener('submit', (e) => {
  socket.emit('search', { value: searchBar.value.trim() })
  e.preventDefault()
})

btnClear.addEventListener('click', e => {
  search.classList.remove('open')
  resultData.classList.add('d-none')
  btnClear.classList.add('invisible')
  searchBar.value = ''

})



socket.on('search-results', data => {
  // spinner.classList.add('d-none')
  const results = data.result
  if (results.length < limit) {
    limit = results.length
  } else if (results.length === 1) {
    limit = results.length
  } else if (results.length === 0) {
    limit = 0
  } else {
    limit = 10
  }
  if (searchResults.hasChildNodes()) {
    while (searchResults.childNodes.length >= 1) {
      searchResults.removeChild(searchResults.firstChild)
    }
  }

  if (results.length > 0) {
    for (let i = 0; i < limit; i++) {
      const customer = results[i]
      const split = customer.fullName.split(' ')

      split.forEach((word, index, array) => {
        let index1 = word.indexOf(searchBar.value);
        let index2 = word.indexOf(searchBar.value.toLowerCase());
        if (index1 != -1) {
          array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index1, searchBar.value.length)}</b>`)
        } else {
          array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index2, searchBar.value.length)}</b>`)
        }
      })
      customer.fullName = split.toString().replace(/,/g, ' ')


      if (customer != undefined) {
        let content = `<span class="icon icon-user me-3 d-inline-block"></span><span class="ml-3"><span class="text-secondary fw-bold">${customer.customerCode}</span> ${customer.fullName}</span>`
        let listItem = createCustomElement('a', { href: `/cliente/${customer.customerCode}`, class: 'list-group-item d-flex list-group-item-action border-0 rounded-0' }, [content])
        searchResults.appendChild(listItem)
      }
    }
    resultsMessage.innerHTML = ''
    limit > results.length ? limit = results.length : null
    resultsCount.innerHTML = ` <div class="text-secondary small text-end me-3">Mostrando ${limit} resultados de ${results.length}</div>`
  } else {
    resultsCount.innerHTML = ''
    resultsMessage.innerHTML = `<div class="text-secondary text-center">No se han encontrado resultados para tu búsqueda <span class="search-criteria">(${searchBar.value})</span></div>`

  }

})

