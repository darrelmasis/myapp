const id = document.getElementById.bind(document)
const q = document.querySelector.bind(document)
const all = document.querySelectorAll.bind(document)

/**
 * 
 * @param {string} elementSelector 
 * @param {int} type 
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
  let passOk
  if(pass1 == '' && pass2 == '') {
    passOk = false
  } else {
    pass1 === pass2 ? passOk = true : passOk = false
  }
  return passOk
}
export { select, createCustomElement, addAttributes, removeAttributes, passVerify}