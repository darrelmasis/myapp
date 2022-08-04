import { select, addAttributes, removeAttributes, passVerify, nomProp, createCustomElement } from "./modules/dom";
import regeneratorRuntime, { async } from "regenerator-runtime";
import { postData } from "./modules/postData";
import getPosition from "./modules/geolocation"
import { LATIN1_BIN } from "mysql/lib/protocol/constants/charsets";
import cropImage from "../js/modules/cropImage"


const socket = io()
const signinForm = select('signinForm')
const addContactForm = select('addContactForm')
const removeContactForm = select('removeContactForm')
const userUpdateForm = select('userUpdateForm')
const updateAvatarForm = select('updateAvatarForm')
const customerForm = select('customerForm')
const getCoords = select('getCoordsButton')
const sendMessageForm = select('sendMessageForm')

// Añade función hasClass al prototipo del objeto element
Element.prototype.hasClass = function (className) {
  return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
}

/**
 * 
 * MODULES 
 * 
 */

 import "./modules/search"
 import "./modules/signup"

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
        if (data.type === 'error' || data.type === 'empty' || data.type === 'warning') {
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
      phoneNumber: phoneNumber.value,
      email: email.value,
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
    /**
     * Recortar imagen
     */
    reader.addEventListener('load', () => {
      cropImage(reader.result, 1, 170)
        .then(async result => {
          // Simular cambio en tiempo real del avatar
          const avatars = document.getElementsByClassName('avatar-image')
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
// Prepara añadircontacto
const addContact = async contactId => {
  const data = await postData('/addContact', 'POST', contactId)
  return data
}
// Envía los datos del formulario para agregar un nuevo contacto
if (addContactForm) {
  addContactForm.addEventListener('submit', e => {

    e.preventDefault()
    const originalButton = addButton.innerHTML
    addButton.innerHTML = '<svg class="svg-inline--fa fa-user-plus fa-w-20 me-2" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M224 256C294.695 256 352 198.691 352 128S294.695 0 224 0C153.312 0 96 57.309 96 128S153.312 256 224 256ZM224 48C268.113 48 304 83.887 304 128C304 172.111 268.113 208 224 208C179.889 208 144 172.111 144 128C144 83.887 179.889 48 224 48ZM274.664 304H173.336C77.609 304 0 381.602 0 477.332C0 496.477 15.523 512 34.664 512H413.336C432.477 512 448 496.477 448 477.332C448 381.602 370.398 304 274.664 304ZM48.705 464C55.379 401.133 108.727 352 173.336 352H274.664C339.273 352 392.621 401.133 399.297 464H48.705ZM616 200H568V152C568 138.75 557.25 128 544 128S520 138.75 520 152V200H472C458.75 200 448 210.75 448 224S458.75 248 472 248H520V296C520 309.25 530.75 320 544 320S568 309.25 568 296V248H616C629.25 248 640 237.25 640 224S629.25 200 616 200Z"></path></svg> Guardando...'
    addAttributes(addButton, { disabled: '' }) // Establece el boton como deshabilitado
    const data = {
      userId: localUser.id,
      contactsId: remoteUser.id
    }
    addContact(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          // mensajes de error
          console.log(data.message)
        } else {
          removeAttributes(addButton, { disabled: '' }) // Establece el boton como deshabilitado
          addButton.innerHTML = originalButton
          addContactForm.classList.toggle('d-none')
          removeContactForm.classList.toggle('d-none')
        } 
        })
  })
}

// Prepara eliminar contacto
const removeContact = async contactId => {
  const data = await postData('/removeContact', 'POST', contactId)
  return data
}
// Envía los datos del formulario para remover un contacto existente
if (removeContactForm) {
  removeContactForm.addEventListener('submit', e => {
    e.preventDefault()
    const originalButton = removeButton.innerHTML
    removeButton.innerHTML = '<svg class="svg-inline--fa fa-user-minus fa-w-20 me-2" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M274.664 304H173.336C77.609 304 0 381.602 0 477.332C0 496.477 15.523 512 34.664 512H413.336C432.477 512 448 496.477 448 477.332C448 381.602 370.398 304 274.664 304ZM48.705 464C55.379 401.133 108.727 352 173.336 352H274.664C339.273 352 392.621 401.133 399.297 464H48.705ZM224 256C294.695 256 352 198.691 352 128S294.695 0 224 0C153.312 0 96 57.309 96 128S153.312 256 224 256ZM224 48C268.113 48 304 83.887 304 128C304 172.111 268.113 208 224 208C179.889 208 144 172.111 144 128C144 83.887 179.889 48 224 48ZM616 200H472C458.75 200 448 210.75 448 224S458.75 248 472 248H616C629.25 248 640 237.25 640 224S629.25 200 616 200Z"></path></svg> Eliminando...'
    addAttributes(removeButton, { disabled: '' }) // Establece el boton como deshabilitado
    const data = {
      userId: localUser.id,
      contactsId: remoteUser.id
    }
    removeContact(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          // mensajes de error
          console.log(data.message)
        } else {
          removeAttributes(removeButton, { disabled: '' }) // Establece el boton como deshabilitado
          removeButton.innerHTML = originalButton
          addContactForm.classList.toggle('d-none')
          removeContactForm.classList.toggle('d-none')
        } 
        })
  })
}

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

if (sendMessageForm) {
  
  const localUserData = {
    id: localUser.id,
    username: localUser.username,
    fullName: localUser.fullName,
    avatar: localUser.avatar,
    socketId: ''
  }

  socket.emit('newClient', localUserData)


  // Envía al servidor los datos del cliente con sesión activa
  socket.emit('userConnected', localUserData)

  // Recibe del servidor un objeto con el socketId y los datos del usuario
  socket.on('usersOnline', users => {
    //const isOnline = users.some(user => user.id === localUserData.id)
    //isOnline ? userStatus.innerText = 'En linea' : userStatus.innerText = 'últ. vez hoy a la(s) 9:16 p.m.'
    getUsersOnline(users)
  })


  const getUsersOnline = users => {
    // Listar a los usuarios conectados
    if (contacts == null || contacts.length === 0) {
      console.log('no tienes contactos')
    } else {
      contacts.forEach((contact, index)=> { 
        const isOnline = users.some(data => data.id === contact.id)
        const currentUser = users.findIndex(data => data.id === contact.id)
        console.log(currentUser)
        console.log(isOnline)
        if (isOnline && currentUser > -1) {
          chatList.childNodes[currentUser].querySelector('.user-status').classList.toggle('user-status-offline')
          chatList.childNodes[currentUser].querySelector('.user-status').classList.toggle('user-status-online')
        } else {
          chatList.childNodes[index].querySelector('.user-status').classList.toggle('user-status-offline')
          chatList.childNodes[index].querySelector('.user-status').classList.toggle('user-status-online')
        }
      })
    }

    users.forEach(user => {
      const span = createCustomElement('span', {}, ['3'])
      const unreadChatMessage = createCustomElement('div', { class: ' unread-chat-messages badge bg-primary ms-3 ms-auto' }, [span])
      const lastChatMessage = createCustomElement('div', { class: 'last-chat-message small text-muted me-1' }, ['Hola soy el último de la conversación'])
      const col2 = createCustomElement('div', { class: 'd-flex align-items-center' }, [lastChatMessage, unreadChatMessage])

      const userFullName = createCustomElement('span', { class: 'fw-semibold me-auto' }, [user.fullName])
      const lastChatTime = createCustomElement('span', { class: 'extra-small text-muted', title: 'Último mensaje' }, ['00:00'])
      const col1 = createCustomElement('div', { class: 'd-flex align-items-center mb-1' }, [userFullName, lastChatTime])

      const col = createCustomElement('div', { class: 'col-auto me-3 pe-0' }, [col1, col2])

      const avatarImage = createCustomElement('img', { src: `https://res.cloudinary.com/darrelmasis/image/upload/${user.avatar}`, class: 'avatar-image' }, [])
      const avatar = createCustomElement('div', { class: 'image-medium avatar user-status' }, [avatarImage])
      const colAuto = createCustomElement('div', { class: 'col-auto me-3 pe-0' }, [avatar])

      const row = createCustomElement('div', { class: 'row' }, [colAuto, col])
      const card = createCustomElement('a', { href: `/chat/@${user.username}`, class: 'card bg-white border-0 text-reset text-decoration-none chat' }, [row])

      // const hasChild = Array.from(usersOnline.childNodes).some(data => data.innerText === user.fullName)

      const u = createCustomElement('li', {}, [user.fullName])
      // !hasChild ? usersOnline.appendChild(u) : false
    })
  }

  socket.on('disconnect', () => {

  })
}