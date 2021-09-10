(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAttributes = exports.createCustomElement = exports.select = void 0;
var id = document.getElementById.bind(document);
var q = document.querySelector.bind(document);
var all = document.querySelectorAll.bind(document);
/**
 * 
 * @param {string} elementSelector 
 * @param {int} type 
 * @returns DOM element
 */

var select = function select(elementSelector) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
  var domElement = '';

  switch (type) {
    case 'q':
      domElement = q(elementSelector);
      break;

    case 'all':
      domElement = all(elementSelector);
      break;

    default:
      domElement = id(elementSelector);
      break;
  }

  return domElement;
};
/**
 * Crea elementos con atributos e hijos
 * @param {DOM element} element 
 * @param {string} attributes 
 * @param {string} children 
 * @returns DOM Element
 */


exports.select = select;

var createCustomElement = function createCustomElement(element, attributes, children) {
  var customElement = document.createElement(element);
  if (children !== undefined) children.forEach(function (el) {
    if (el.nodeType) {
      if (el.nodeType === 1 || el.nodeType === 11) customElement.appendChild(el);
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


exports.createCustomElement = createCustomElement;

var addAttributes = function addAttributes(element, attrObj) {
  for (var attr in attrObj) {
    if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr, attrObj[attr]);
  }
};

exports.addAttributes = addAttributes;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Storage = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.defaultItem = 'history';

    if (!this.get(this.defaultItem)) {
      this.set(this.defaultItem, JSON.stringify([{}]));
    }
  }

  _createClass(Storage, [{
    key: "get",
    value: function get(key) {}
  }, {
    key: "set",
    value: function set(key, value) {}
  }, {
    key: "remove",
    value: function remove(key) {}
  }, {
    key: "update",
    value: function update(currentValue, newValue) {}
  }]);

  return Storage;
}();

exports.Storage = Storage;

},{}],3:[function(require,module,exports){
"use strict";

var _dom = require("./modules/dom");

var _localStorage = require("./modules/localStorage");

var socket = io();
var signinForm = (0, _dom.select)('signinForm');
var signupForm = (0, _dom.select)('signupForm'); // const searchForm = select('search-form', 'id')
// const searchBar = select('search-bar', 'id')
// const resultData = select('results-data', 'id')
// const searchResults = select('search-results', 'id')
// const resultsCount = select('results-count', 'id')
// const resultsMessage = select('results-message', 'id')
// const btnClear = select('btn-clear', 'id')

if (signinForm) {
  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      username: username.value,
      password: password.value
    };
    socket.emit('signin', {
      signin: data
    });
    socket.on('response', function (e) {
      console.log(e);

      if (e.response.type === 'error') {
        messages.classList.add('text-danger');
      } else {
        messages.classList.add('text-success');
      }

      messages.innerHTML = e.response.message;
    });
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    btnSubmit.value = 'Registrando...';
    var data = {
      fullName: firstName.value + ' ' + lastName.value,
      username: email.value.substr(0, email.value.indexOf('@')),
      email: email.value,
      password: password.value
    };
    socket.emit('signup', {
      signup: data
    });
    (0, _dom.addAttributes)(btnSubmit, {
      disabled: ''
    });
    socket.on('response', function (res) {
      var r = res.response;
      var alertType;
      var alertTitle;

      if (r.type === 'ok') {
        alertType = 'success';
        alertTitle = '¡Enhorabuena!';
        signupForm.reset(); // TODO REMOVER ATRIBUTO DISABLED 
      } else {
        alertType = 'danger';
        alertTitle = '¡Error!';
      }

      messages.innerHTML = "<div class=\"alert mt-3 alert-".concat(alertType, " alert-dismissible fade show\" role=\"alert\">\n      <strong>").concat(alertTitle, " </strong>").concat(r.message, "\n      <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n    </div>");
    });
  });
} // if (searchBar) {
//   const search = select('search', 'id')
//   let limit = 10
//   let key = -1;
//   let prev = -1;
//   searchBar.addEventListener('keyup', e => {
//     if (e.key != 'ArrowDown' && e.key != 'ArrowUp') {
//       if (searchBar.value.trim() === '') {
//         resultData.classList.add('d-none')
//         btnClear.classList.add('invisible')
//         search.classList.remove('open')
//       } else {
//         searchIcon ? searchIcon.classList.add('d-none') : null
//         searchSpinner ? searchSpinner.classList.remove('d-none') : null
//         socket.emit('search', { value: searchBar.value.trim() })
//         key = -1
//         prev = -1
//         resultData.classList.remove('d-none')
//         btnClear.classList.remove('invisible')
//         search.classList.add('open')
//       }
//     }
//   })
//   document.addEventListener("keydown", (e) => {
//     let mylist = document.querySelectorAll('.list-group-item');
//     if (mylist) {
//       if (e.key === 'ArrowDown') {
//         key < (limit - 1) ? key++ : key = 0 // Asigna un valor a key para el elemento siguiente
//         key === 0 ? prev = (limit - 1) : prev = key - 1 // Asigna un valor a prev para el elemento anterior 
//         mylist[key].classList.add("search-item__active"); // Marca como activo el elemento de la lista de resultados
//         if (mylist.length > 1) {
//           prev > -1 ? mylist[prev].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
//         }
//       } else if (e.key === 'ArrowUp') {
//         key <= 0 ? key = (limit - 1) : key-- // Asigna un valor a key para el elemento Anterior
//         key < (limit - 1) ? prev = key + 1 : prev = 0
//         mylist[key].classList.add("search-item__active");
//         if (mylist.length > 1) {
//           prev > -1 ? mylist[prev].classList.remove("search-item__active") : null // Desmarca el elemento actibo anterior
//         }
//       }
//     }
//   });
//   // searchBar.addEventListener('focus', (e) => {
//   //   if(searchBar.value != '') {
//   //     resultData.classList.toggle('d-none')
//   //   }
//   // })
//   searchForm.addEventListener('submit', e => {
//     e.preventDefault()
//     const el = document.querySelector('.search-item__active')
//     location.href = el.href
//   })
//   btnClear.addEventListener('click', e => {
//     search.classList.remove('open')
//     resultData.classList.add('d-none')
//     btnClear.classList.add('invisible')
//     searchBar.value = ''
//   })
//   socket.on('search-results', data => {
//     const results = data.result
//     if (results.length < limit) {
//       limit = results.length
//     } else if (results.length === 1) {
//       limit = results.length
//     } else if (results.length === 0) {
//       limit = 0
//     } else {
//       limit = 10
//     }
//     if (searchResults.hasChildNodes()) {
//       while (searchResults.childNodes.length >= 1) {
//         searchResults.removeChild(searchResults.firstChild)
//       }
//     }
//     if (results.length > 0) {
//       for (let i = 0; i < limit; i++) {
//         const customer = results[i]
//         // const split = customer.fullName.split(' ')
//         // split.forEach((word, index, array) => {
//         //   let index1 = word.indexOf(searchBar.value);
//         //   let index2 = word.indexOf(searchBar.value.toLowerCase());
//         //   if (index1 != -1) {
//         //     array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index1, searchBar.value.length)}</b>`)
//         //   } else {
//         //     array[index] = word.replace(new RegExp(searchBar.value, "gi"), `<b>${word.substr(index2, searchBar.value.length)}</b>`)
//         //   }
//         // })
//         // customer.fullName = split.toString().replace(/,/g, ' ')
//         if (customer != undefined) {
//           let content = `<span class="icon icon-user me-3 d-inline-block"></span> <!-- <span class="ml-3"><span class="text-secondary fw-bold">${customer.customerCode}</span> -->${customer.fullName}</span>`
//           let listItem = createCustomElement('a', { href: `/cliente/${customer.customerCode}`, class: 'align-items-center list-group-item d-flex list-group-item-action border-0 rounded-0' }, [content])
//           searchResults.appendChild(listItem)
//         }
//       }
//       resultsMessage.innerHTML = ''
//       limit > results.length ? limit = results.length : null
//       resultsCount.innerHTML = ` <div class="text-secondary small text-end me-3">Mostrando ${limit} resultados de ${results.length}</div>`
//     } else {
//       resultsCount.innerHTML = ''
//       resultsMessage.innerHTML = `<div class="text-secondary text-center">No se han encontrado resultados para tu búsqueda <span class="search-criteria">(${searchBar.value})</span></div>`
//     }
//     searchIcon ? searchIcon.classList.remove('d-none') : null
//     searchSpinner ? searchSpinner.classList.add('d-none') : null
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

},{"./modules/dom":1,"./modules/localStorage":2}]},{},[3]);

//# sourceMappingURL=scripts.js.map
