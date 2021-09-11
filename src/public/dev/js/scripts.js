import { select, addAttributes, removeAttributes } from "./modules/dom";
import regeneratorRuntime from "regenerator-runtime";
import { postData } from "./modules/postData";

const signinForm = select('signinForm')
const signupForm = select('signupForm')

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

    const data = {
      fullName: firstName.value + ' ' + lastName.value,
      username: email.value.substr(0, email.value.indexOf('@')),
      email: email.value,
      password: password.value,
    }

    signup(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          messages.classList.remove('text-success')
          messages.classList.add('text-danger')
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
        } else {
          messages.classList.remove('text-danger')
          messages.classList.add('text-success')
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
        }
        messages.classList.remove('visually-hidden')
        messages.innerHTML = data.message
      }).catch(error => {
        console.log('Error: ' + error)
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
    addAttributes(btnSubmit, {disabled: ''}) // Establece el boton como deshabilitado
    const data = {
      username: username.value,
      password: password.value
    }

    signin(data)
      .then(data => {
        if (data.type === 'error' || data.type === 'empty') {
          messages.classList.remove('text-success')
          messages.classList.add('text-danger')
          removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
        } else {
          btnSubmit.value = 'Iniciando...'
          messages.classList.remove('text-danger')
          messages.classList.add('text-success')
          window.location.href = '/'
        }
        messages.classList.remove('visually-hidden')
        messages.innerHTML = data.message
      }).catch(error => {
        console.log('Error: ' + error)
      })

  })
}
