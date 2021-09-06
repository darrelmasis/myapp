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
var searchForm = (0, _dom.select)('search-form', 'id');
var searchBar = (0, _dom.select)('search-bar', 'id');
var resultData = (0, _dom.select)('results-data', 'id');
var searchResults = (0, _dom.select)('search-results', 'id');
var resultsCount = (0, _dom.select)('results-count', 'id');
var resultsMessage = (0, _dom.select)('results-message', 'id');
var btnClear = (0, _dom.select)('btn-clear', 'id');
var spinner = (0, _dom.select)('spinner', 'id');

if (searchBar) {
  var search = (0, _dom.select)('search', 'id');
  var limit = 10;
  var key = -1;
  var prev = -1;
  searchBar.addEventListener('keyup', function (e) {
    if (e.key != 'ArrowDown' && e.key != 'ArrowUp') {
      if (searchBar.value.trim() === '') {
        resultData.classList.add('d-none');
        btnClear.classList.add('invisible');
        search.classList.remove('open');
      } else {
        socket.emit('search', {
          value: searchBar.value.trim()
        });
        key = -1;
        prev = -1;
        resultData.classList.remove('d-none');
        btnClear.classList.remove('invisible');
        search.classList.add('open');
      }
    }
  });
  document.addEventListener("keydown", function (e) {
    var mylist = document.querySelectorAll('.list-group-item');

    if (mylist) {
      if (e.key === 'ArrowDown') {
        key < limit - 1 ? key++ : key = 0; // Asigna un valor a key para el elemento siguiente

        key === 0 ? prev = limit - 1 : prev = key - 1; // Asigna un valor a prev para el elemento anterior 

        mylist[key].classList.add("search-item__active"); // Marca como activo el elemento de la lista de resultados

        if (mylist.length > 1) {
          prev > -1 ? mylist[prev].classList.remove("search-item__active") : null; // Desmarca el elemento actibo anterior
        }
      } else if (e.key === 'ArrowUp') {
        key <= 0 ? key = limit - 1 : key--; // Asigna un valor a key para el elemento Anterior

        key < limit - 1 ? prev = key + 1 : prev = 0;
        mylist[key].classList.add("search-item__active");

        if (mylist.length > 1) {
          prev > -1 ? mylist[prev].classList.remove("search-item__active") : null; // Desmarca el elemento actibo anterior
        }
      }
    }
  }); // searchBar.addEventListener('focus', (e) => {
  //   if(searchBar.value != '') {
  //     resultData.classList.toggle('d-none')
  //   }
  // })

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var el = document.querySelector('.search-item__active');
    location.href = el.href;
  });
  btnClear.addEventListener('click', function (e) {
    search.classList.remove('open');
    resultData.classList.add('d-none');
    btnClear.classList.add('invisible');
    searchBar.value = '';
  });
  socket.on('search-results', function (data) {
    // spinner.classList.add('d-none')
    var results = data.result;

    if (results.length < limit) {
      limit = results.length;
    } else if (results.length === 1) {
      limit = results.length;
    } else if (results.length === 0) {
      limit = 0;
    } else {
      limit = 10;
    }

    if (searchResults.hasChildNodes()) {
      while (searchResults.childNodes.length >= 1) {
        searchResults.removeChild(searchResults.firstChild);
      }
    }

    if (results.length > 0) {
      for (var i = 0; i < limit; i++) {
        var customer = results[i]; // const split = customer.fullName.split(' ')
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
          var content = "<span class=\"icon icon-user me-3 d-inline-block\"></span> <!-- <span class=\"ml-3\"><span class=\"text-secondary fw-bold\">".concat(customer.customerCode, "</span> -->").concat(customer.fullName, "</span>");
          var listItem = (0, _dom.createCustomElement)('a', {
            href: "/cliente/".concat(customer.customerCode),
            class: 'align-items-center list-group-item d-flex list-group-item-action border-0 rounded-0'
          }, [content]);
          searchResults.appendChild(listItem);
        }
      }

      resultsMessage.innerHTML = '';
      limit > results.length ? limit = results.length : null;
      resultsCount.innerHTML = " <div class=\"text-secondary small text-end me-3\">Mostrando ".concat(limit, " resultados de ").concat(results.length, "</div>");
    } else {
      resultsCount.innerHTML = '';
      resultsMessage.innerHTML = "<div class=\"text-secondary text-center\">No se han encontrado resultados para tu b\xFAsqueda <span class=\"search-criteria\">(".concat(searchBar.value, ")</span></div>");
    }
  });
} // if(signupForm != undefined) {
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

},{"./modules/dom":1,"./modules/localStorage":2}]},{},[3]);

//# sourceMappingURL=scripts.js.map
