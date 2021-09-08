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


if (searchBar) {
  const search = select('search', 'id')
  let limit = 10
  let key = -1;
  let prev = -1;

  searchBar.addEventListener('keyup', e => {

    if (e.key != 'ArrowDown' && e.key != 'ArrowUp') {
      if (searchBar.value.trim() === '') {
        resultData.classList.add('d-none')
        btnClear.classList.add('invisible')
        search.classList.remove('open')

      } else {
        searchIcon ? searchIcon.classList.add('d-none') : null
        searchSpinner ? searchSpinner.classList.remove('d-none') : null
        socket.emit('search', { value: searchBar.value.trim() })
        key = -1
        prev = -1
        resultData.classList.remove('d-none')
        btnClear.classList.remove('invisible')
        search.classList.add('open')
      }
    }
  })



  document.addEventListener("keydown", (e) => {
    let mylist = document.querySelectorAll('.list-group-item');
    if (mylist) {
      if (e.key === 'ArrowDown') {
        key < (limit - 1) ? key++ : key = 0 // Asigna un valor a key para el elemento siguiente
        key === 0 ? prev = (limit - 1) : prev = key - 1 // Asigna un valor a prev para el elemento anterior 
        mylist[key].classList.add("search-item__active"); // Marca como activo el elemento de la lista de resultados
        if (mylist.length > 1) {
          prev > -1 ? mylist[prev].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
        }
      } else if (e.key === 'ArrowUp') {
        key <= 0 ? key = (limit - 1) : key-- // Asigna un valor a key para el elemento Anterior
        key < (limit - 1) ? prev = key + 1 : prev = 0
        mylist[key].classList.add("search-item__active");
        if (mylist.length > 1) {
          prev > -1 ? mylist[prev].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
        }
      }
    }
  });


  // searchBar.addEventListener('focus', (e) => {
  //   if(searchBar.value != '') {
  //     resultData.classList.toggle('d-none')
  //   }
  // })

  searchForm.addEventListener('submit', e => {
    e.preventDefault()
    const el = document.querySelector('.search-item__active')
    location.href = el.href
  })

  btnClear.addEventListener('click', e => {
    search.classList.remove('open')
    resultData.classList.add('d-none')
    btnClear.classList.add('invisible')
    searchBar.value = ''

  })


  socket.on('search-results', data => {
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
        // const split = customer.fullName.split(' ')

        // split.forEach((word, index, array) => {
        //   let index1 = word.indexOf(searchBar.value);
        //   let index2 = word.indexOf(searchBar.value.toLowerCase());
        //   if (index1 != -1) {
        //     array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index1, searchBar.value.length)}</b>`)
        //   } else {
        //     array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index2, searchBar.value.length)}</b>`)
        //   }
        // })
        // customer.fullName = split.toString().replace(/,/g, ' ')


        if (customer != undefined) {
          let content = `<span class="icon icon-user me-3 d-inline-block"></span> <!-- <span class="ml-3"><span class="text-secondary fw-bold">${customer.customerCode}</span> -->${customer.fullName}</span>`
          let listItem = createCustomElement('a', { href: `/cliente/${customer.customerCode}`, class: 'align-items-center list-group-item d-flex list-group-item-action border-0 rounded-0' }, [content])
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
    searchIcon ? searchIcon.classList.remove('d-none') : null
    searchSpinner ? searchSpinner.classList.add('d-none') : null

  })
}

// if(signupForm != undefined) {
//   signupForm.addEventListener('submit', e => {
//     e.preventDefault()
//     const username = email.value.substr(0, email.value.indexOf('@'))
//     const data = {
//       fullName: firstName.value + ' ' + lastName.value,
//       username: username,
//       email: email.value,
//       password: password.value,
//     }
//     socket.emit('signup', {post: data})
//   })
// }

// if(signinForm) {
//   signinForm.addEventListener('submit', e => {
//     e.preventDefault()
//     const data = {
//       username: username.value,
//       password: password.value
//     }
//     socket.emit('signin', {data})
//   })
// }