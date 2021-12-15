import { select, addAttributes, removeAttributes, passVerify, nomProp, createCustomElement } from "./modules/dom";
import regeneratorRuntime from "regenerator-runtime";
import { postData } from "./modules/postData";
import getPosition from "./modules/geolocation"

const signinForm = select('signinForm')
const signupForm = select('signupForm')
const searchForm = select('searchForm')

// Prepara el registro de los usuarios
const signup = async userData => {
  const data = await postData('/signup', 'POST', userData)
  return data
}
// Envía el formulario de registro y recibe respuesta del servidor
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault()
    addAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
    btnSubmit.value = 'Registrando...'
    const passwordOk = passVerify(password.value, passwordVerify.value)
    const data = {
      fullName: nomProp(firstname.value) + ' ' + nomProp(lastname.value),
      username: email.value.substr(0, email.value.indexOf('@')).toLowerCase(),
      email: email.value.toLowerCase(),
      password: passwordOk,
      gender: nomProp(signupForm.gender.value)
    }
    passwordOk === true ? data.password = password.value : data.password = ''
    signup(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          messages.classList.remove('text-success')
          messages.classList.add('text-danger')
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
          btnSubmit.value = 'Registrarse'
        } else {
          messages.classList.remove('text-danger')
          messages.classList.add('text-success')
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
          btnSubmit.value = 'Registrarse'
          signupForm.reset()
          window.location.href = `/signin?user=${data.username}` // redirige al usuario al inicio de sesión y se autocompleta el campo del nombre de usuario
        }
        messages.classList.remove('visually-hidden')
        messages.innerHTML = data.message
      }).catch(error => {
        console.log('Error: ' + error)
        btnSubmit.value = 'Registrarse'
      })
  })
}

// Prepara el inicio de sesión de los usuarios
const signin = async userData => {
  const data = await postData('/signin', 'POST', userData)
  return data
}
// Envía formulario inicio de sesión y recibe respuesta del servidor
if (signinForm) {
  signinForm.addEventListener('submit', e => {
    e.preventDefault()
    btnSubmit.value = '...Iniciando'
    addAttributes(btnSubmit, { disabled: '' }) // Establece el boton como deshabilitado
    const data = {
      username: username.value,
      password: password.value
    }

    signin(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          messages.classList.remove('text-success')
          messages.classList.add('text-danger')
          btnSubmit.innerHTML = '<i class="far fa-sign-in-alt me-2"></i> Iniciar Sesión'
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
        } else {
          btnSubmit.innerHTML = '...Iniciando'
          messages.classList.remove('text-danger')
          messages.classList.add('text-success')
          window.location.href = '/'
        }
        messages.classList.remove('visually-hidden')
        messages.innerHTML = data.message
      }).catch(error => {
        console.log(error)
      })

  })
}

// Prepara la búsqueda
const search = async searchValue => {
  const data = await postData('/search', 'POST', searchValue)
  return data
}
// Envía formulario de búsqueda y recibe respuesta del servidor
if (searchForm) {
  // Configruración del botón clear
  btnClear.addEventListener('click', e => {
    // Oculta los resultados
    // vacía la barra de búsqueda
    searchBar.value = ''
    // Oculta el botón clear
    btnClear.classList.add('visually-hidden')
    // Oculta los resultados
    resultsData.classList.add('visually-hidden')
    // Marca como cerrado el buscador
    searchContainer.classList.remove('open')
  })

  // Definimos las variables del entorno del buscador
  let LIMIT = 10, NEXT = 0, PREV = 0;
  document.addEventListener("keydown", (e) => {
    let myList = document.querySelectorAll('#searchResults .list-group-item');
    if (myList) {

      if (e.key === 'ArrowDown') {
        NEXT < (LIMIT - 1) ? NEXT++ : NEXT = 0 // Asigna un valor a NEXT para el elemento siguiente
        NEXT === 0 ? PREV = (LIMIT - 1) : PREV = NEXT - 1 // Asigna un valor a PREV para el elemento anterior 
        myList[NEXT].classList.add("search-item__active") // Marca como activo el elemento de la lista de resultados
        if (myList.length > 1) {
          PREV > -1 ? myList[PREV].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
        }
      } else if (e.key === 'ArrowUp') {
        NEXT <= 0 ? NEXT = (LIMIT - 1) : NEXT-- // Asigna un valor a NEXT para el elemento Anterior
        NEXT < (LIMIT - 1) ? PREV = NEXT + 1 : PREV = 0
        myList[NEXT].classList.add("search-item__active")
        if (myList.length > 1) {
          PREV > -1 ? myList[PREV].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
        }
      }
    }
  });
  let timeout = null
  let searchValue = ''
  const TIMEOUT = 300 // tiempo que retrasa la consuta
  const ilegalKeys = [' ', 'Control', 'Tab', 'CapsLock', 'Shift', 'Alt', 'Meta', 'AltGraph', 'ContextMenu', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Insert', 'Home', 'PageUp', 'Delete', 'End', 'PageDown', 'PrintScreen', 'ScrollLock', 'Pause']
  // Evento cuando se levanta una tecla
  searchBar.addEventListener('keyup', e => {
    if(!ilegalKeys.includes(e.key)) {
      // Muestra el boton clear
      btnClear.classList.remove('visually-hidden')
      // Muestra el spinner
      searchSpinner.classList.remove('visually-hidden')
      // Oculta el icono de búsqueda
      searchIcon.classList.add('visually-hidden')
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchValue = searchBar.value.trim()
        if (searchValue === '') {
          // ocultar los resultados
          // Oculta el botón clear
          btnClear.classList.add('visually-hidden')
          // ocultar el spinner
          searchSpinner.classList.add('visually-hidden')
          // Muestra el icono de búsqueda
          searchIcon.classList.remove('visually-hidden')
          // Oculta los resultados
          resultsData.classList.add('visually-hidden')
          // Marca como cerrado el buscador
          searchContainer.classList.remove('open')
        } else {
          // Enviar formulario yrecibir la respuesta
          search({ searchValue })
            .then(response => {
              // Oculta el spinner
              searchSpinner.classList.add('visually-hidden')
              // muestra el icono de búsqueda
              searchIcon.classList.remove('visually-hidden')
              // Muestra los resultados
              resultsData.classList.remove('visually-hidden')
              // Marca como abierto el buscador
              searchContainer.classList.add('open')
              // Reinicializamos las variables
              NEXT = 0; PREV = 0

              if (response.message.length <= LIMIT || response.message.length === 1 || response.message.length === 0) {
                LIMIT = response.message.length
              } else {
                LIMIT = 10
              }
              if (response.message.length > 0) {
                // Si obtuvo algún resultado
                // Limpiamos los resultados anteriores
                searchResults.innerHTML = ''
                resultsMessage.innerHTML = ''
                
                // Mostramos estados de resultados
                resultsState.innerHTML = `<div class="text-muted small text-end me-3">Mostrando ${LIMIT} resultados de ${response.message.length}</div>`
                for (let i = 0; i < LIMIT; i++) {
                  const result = response.message[i];
                  if (result != undefined) {
                    let content = `<span class="text-truncate" title="${result.fullName}">${result.fullName}</span>`
                    let listItem = createCustomElement('a', { href: `/cliente/${result.customerCode}`, class: 'align-item-center list-group-item d-flex list-group-item-action border-0' }, [content])
                    searchResults.appendChild(listItem)
                  }
                }
                let myList = document.querySelectorAll('#searchResults .list-group-item')
                myList[0].classList.add("search-item__active")
              } else {
                // si no obtuvo resultados
                // Limpiamos los resultados anteriores
                searchResults.innerHTML = ''
                resultsState.innerHTML = ''
                // Mostramos mensaje sin resultados
                resultsMessage.innerHTML = `<div class="text-secondary text-center fw-semibold">Al parecer, no hay buenas coincidencias para tu búsqueda</div>`
              }
            }).catch(error => {
              console.log(error)
            })
        }
      }, TIMEOUT);
    }
  })
  // Evento cuando se se envía el formulario con submit
  searchForm.addEventListener('submit', e => {
    e.preventDefault()
    // Enviamos al usuario al perfil del clienteseleciononado previamene en los resultados de búsqueda
    const el = document.querySelector('.search-item__active')
    location.href = el.href
  })
}

getPosition().then(res => console.log(res))
