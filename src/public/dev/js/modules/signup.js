import { select, addAttributes, removeAttributes, passVerify, nomProp, validate} from "./dom";
import { postData } from "./postData";

const signupForm = select('signupForm')

// Prepara el registro de los usuarios
const sigingUp = async userData => {
  const data = await postData('/signup', 'POST', userData)
  return data
}
// Envía el formulario de registro y recibe respuesta del servidor
const signup = () => {
  if (signupForm) {
    
    signupForm.addEventListener('submit', e => {
      messages.innerHTML = ''
      e.preventDefault()

      const data = {
        fullName: nomProp(firstname.value) + ' ' + nomProp(lastname.value),
        firstName: nomProp(firstname.value),
        lastName: nomProp(lastname.value),
        username: email.value.substr(0, email.value.indexOf('@')).toLowerCase(),
        email: email.value.toLowerCase(),
        password: {pass1: password.value, pass2: passwordVerify.value},
        gender: nomProp(signupForm.gender.value)
      }

      addAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
      btnSubmit.value = 'Registrando...'

      sigingUp(data)
        .then(response => {
          if (response.type === 'error' || response.type === 'empty') {
            let messageElement = select(response.element, 'q')
            messageElement.innerHTML = ''
            messages.classList.remove('text-success')
            messages.classList.add('text-danger')
            removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
            btnSubmit.value = 'Registrarse'
            messageElement.innerHTML = response.message
          } else {
            messages.classList.remove('text-danger')
            messages.classList.add('text-success')
            removeAttributes(btnSubmit, { disabled: '' }) // Establece el boton como habilitado
            btnSubmit.value = 'Registrarse'
            signupForm.reset()
            window.location.href = `/signin?user=${data.username}` // redirige al usuario al inicio de sesión y se autocompleta el campo del nombre de usuario
          }
        }).catch(error => {
          console.log('Error: ' + error)
          btnSubmit.value = 'Registrarse'
        })
    })
  }
}

export default signup()
















































































































































































































































































































































































