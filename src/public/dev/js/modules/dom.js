const id = document.getElementById.bind(document)
const q = document.querySelector.bind(document)
const all = document.querySelectorAll.bind(document)

/**
 * 
 * @param {string} elementSelector 
 * @param {int} type (id | q | all)
 * @returns DOM element
 */
const select = (elementSelector, type = 'id') => {
  let domElement = ''
  switch (type) {
    case 'q':
      domElement = q(elementSelector);
      break;

    case 'all':
      domElement = all(elementSelector);
      break;

    default:
      domElement = id(elementSelector)
      break;
  }

  return domElement
}

/**
 * Crea elementos con atributos e hijos
 * @param {DOM element} element 
 * @param {string} attributes 
 * @param {string} children 
 * @returns DOM Element
 */
const createCustomElement = (element, attributes, children) => {
  let customElement = document.createElement(element);
  if (children !== undefined)
    children.forEach((el) => {
      if (el.nodeType) {
        if (el.nodeType === 1 || el.nodeType === 11)
          customElement.appendChild(el);
      } else {
        customElement.innerHTML += el;
      }
    });
  addAttributes(customElement, attributes);
  return customElement;
};

/**
 * Añade un objeto de atributos a un elemento
 * @param {DOM element} element 
 * @param {object} attrObj 
 */
const addAttributes = (element, attrObj) => {
  for (let attr in attrObj) {
    if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr, attrObj[attr]);
  }
}

const removeAttributes = (element, attrObj) => {
  for (let attr in attrObj) {
    if (attrObj.hasOwnProperty(attr)) element.removeAttribute(attr, attrObj[attr]);
  }
};

const passVerify = (pass1, pass2) => {

  if (pass1 !== '' && pass2 !== '' && pass1 === pass2 && pass1.length >= 8 && pass2.length >= 8) {
    return true
  } else {
    return false
  }
}

const nomProp = (string) => {
  if (string !== '') {
    const myArray = []
    const arr = string.trim().split(' ')

    arr.forEach(slice => {
      slice !== '' ? myArray.push(slice.charAt(0).toUpperCase() + slice.slice(1).toLowerCase()) : false
    });

    return myArray.join(' ')
  }
  return string
}

const validate = (string, type = '') => {
  switch (type) {
    case email:
      const regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi
      return regex.test(string)

    default:
      break;
  }
}

const sanitizeSearchParams = (string, invert = false) => {
  if (invert) {
    return string.replace(/\+/g, ' ')
  }

  return string.replace(/\s+/g, '+')
}

const resaltarPalabras = (texto, palabrasResaltadas) => {
  const palabras = palabrasResaltadas.map(palabra => palabra.trim()).filter(palabra => palabra !== '');
  const expresionRegular = new RegExp(`(${palabras.join('|')})`, 'gi');
  return texto.replace(expresionRegular, '<strong>$&</strong>');
}

export { select, createCustomElement, addAttributes, removeAttributes, passVerify, nomProp, validate, sanitizeSearchParams, resaltarPalabras}