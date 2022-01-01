import { select, addAttributes, removeAttributes, passVerify, nomProp, createCustomElement } from "./modules/dom";
import regeneratorRuntime, { async } from "regenerator-runtime";
import { postData } from "./modules/postData";
import getPosition from "./modules/geolocation"
import { LATIN1_BIN } from "mysql/lib/protocol/constants/charsets";
import jimp from "jimp"
import cropImage from "../js/modules/cropImage"
import fs from "fs"
import { crop } from "jimp";
import { execFile } from "child_process";

const signinForm = select('signinForm')
const signupForm = select('signupForm')
const searchForm = select('searchForm')
const userUpdateForm = select('userUpdateForm')
const updateAvatarForm = select('updateAvatarForm')
const customerForm = select('customerForm')
const getCoords = select('getCoordsButton')

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
      .then(dataResponse => {
        if (dataResponse.type === 'error' || dataResponse.type === 'empty') {
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
        messages.innerHTML = dataResponse.message
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

// getPosition().then(res => {
//   latitude.innerHTML = `Lat: ${res.coords.latitude}`
//   longitude.innerHTML = `Lng: ${res.coords.longitude}`
// })

if (getCoords) {
  getCoords.addEventListener('click', e => {
    getPosition().then(res => {
      coords.value = ''
      const currentCoords = `${res.coords.latitude}, ${res.coords.longitude}`
      coords.value = currentCoords
      console.log(res)
    })
  })
}

// Prepara la actualización de los clientes
const customerUpdate = async customerData => {
  const data = await postData('/cliente', 'POST', customerData)
  return data
}
// Envía los datos del formulario para actualizar la información de los clientes
if (customerForm) {
  customerForm.addEventListener('submit', e => {
    e.preventDefault()
    saveButton.value = 'Guardando...'
    addAttributes(saveButton, { disabled: '' }) // Establece el boton como deshabilitado
    const data = {
      address: address.value,
      primaryPhone: primaryPhone.value,
      primaryEmail: primaryEmail.value,
      coords: coords.value,
      customerCode: customerCode.textContent
    }

    customerUpdate(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          // mensajes de error
          alert('Error')
        } else {
          // mensajes de éxito
          removeAttributes(saveButton, { disabled: '' }) // Establece el boton como deshabilitado
          alert('Éxito')
        }
      }).catch(error => {
      console.log(error)
    })
  })
}

const userUpdate = async userData => {
  const data = await postData('/userUpdate', 'POST', userData)
  return data
}

if (userUpdateForm) {
  userUpdateForm.addEventListener('submit', e => {
    e.preventDefault()
    const buttonOriginalValue = saveButton.innerHTML
    saveButton.innerHTML = '<i class="far fa-save me-2"></i> Guardando...'
    addAttributes(saveButton, { disabled: '' }) // Establece el boton como deshabilitado
    const data = {
      userId: userId.value,
      firstName: firstName.value,
      lastName: lastName.value,
      gender: gender.value,
      bio: bio.value,
      email: email.value
    }

    userUpdate(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          // mensajes de error
          alert('Error')
        } else {
          message.innerHTML = 'Datos actualizados con éxito'
          message.classList.remove('d-none')
          setTimeout(() => {
            message.innerHTML = ''
            message.classList.add('d-none')
            removeAttributes(saveButton, { disabled: '' }) // Establece el boton como deshabilitado
          }, 3000);
          setTimeout(() => {
            // mensajes de éxito
            saveButton.innerHTML = buttonOriginalValue
          }, 500);
        }
      }).catch(error => {
        console.log(error)
      })
    })
  }

if (updateAvatarForm) {
  updateAvatarForm.addEventListener('change', e => {

    /**
     * Cargar la imágen
     */
    const formData = new FormData(updateAvatarForm)
    const reader = new FileReader()
    reader.readAsDataURL(formData.get('userAvatar'))
    loader.classList.remove('d-none')
    uploadAvatar.classList.add('d-none')
    console.log(EXIF.readFromBinaryFile())
    /**
     * Recortar imagen
     */
    reader.addEventListener('load', () => {
      cropImage(reader.result, 1, 170)
        .then(async result => {
          // Simular cambio en tiempo real del avatar
          const avatars = document.getElementsByClassName('avatar')

          for (const element of avatars) {
            element.src = result
          }

          const response = await fetch(result) // Obtener la imágen del resultdo de la promesa
          const myBlob = await response.blob() //Convertir la respuesta a tipo blob
          formData.set('userAvatar', myBlob, 'userAvatar.jpg') // Asignar el blob al elemento userAvatar
          formData.append('userAvatarBase64', result) // Crear un nuevo elemento del formData
          //Enviar datos al servidor
          const request = new XMLHttpRequest()
          request.open('POST', '/update-avatar', true)
          request.addEventListener('load', e => {
            if (request.readyState === request.DONE) {
              switch (request.status) {
                case 200:
                  loader.classList.add('d-none')
                  uploadAvatar.classList.remove('d-none')
                break
              }
            }
          })
          request.send(formData)
      })
    })
  })
}

const c = document.getElementById('myClock')
// c.innerHTML = 'HOLA MUNDO'

const getTime = (expiredDate) => {
  let now = new Date(), // Obtiene el timestamp del momento
    remainingTime = (new Date(expiredDate) - now + 1000) / 1000,
    remainingSeconds = ("0" + Math.floor(remainingTime % 60)).slice(-2),
    remainingMinutes = ("0" + Math.floor((remainingTime / 60) % 60)).slice(-2),
    remainingHours = ("0" + Math.floor((remainingTime / 3600) % 24)).slice(-2),
    remainingDays = Math.floor(remainingTime / (3600 * 24));

  return {
    remainingTime,
    remainingSeconds,
    remainingMinutes,
    remainingHours,
    remainingDays,
  }

}

const myTime = setInterval(() => {
  const t = getTime('Jan 01 2022 00:00:00 GMT-6')
  // const t = getTime('Dec 31 2021 22:59:00 GMT-6')
  days.innerHTML = t.remainingDays
  hours.innerHTML = t.remainingHours
  minutes.innerHTML = t.remainingMinutes
  seconds.innerHTML = t.remainingSeconds

  if (t.remainingTime <= 1) {
    clearInterval(myTime)
    info.classList.add('d-none')
    musicControls.classList.remove('d-none')
    play.addEventListener('click', () => {
      music.play()
      play.classList.add('d-none')
      pause.classList.remove('d-none')
    })
    pause.addEventListener('click', () => {
      music.pause()
      play.classList.remove('d-none')
      pause.classList.add('d-none')

    })
  }
}, 1000);