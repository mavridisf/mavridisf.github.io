/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

/* Zen - For peace of mind */

window.on = window.addEventListener;

// Decorators

const $ = selector => {
  return document.querySelectorAll(selector);
}

const $$ = (tag, arg1 = {}, arg2 = {}) => {
  let el = document.createElement(tag), properties;
  if (typeof arg1 === "object") {
    properties = arg1;
  }
  else {
    el.innerHTML = arg1;
    properties = arg2;
  }

  for (prop in properties) {
    el[prop] = properties[prop];
  }
  return el;
}

// HTMLElement prototype methods

HTMLElement.prototype.find = function(selector) {
  return this.querySelector(selector);
}

HTMLElement.prototype.findAll = function(selector) {
  return this.querySelectorAll(selector);
}

HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;

HTMLElement.prototype.attribute = function (key, value = undefined) {
  if (value === undefined) {
    return this.getAttribute(key);
  }
  this.setAttribute(key, value);
  return this;
}

// kate: replace-tabs true; indent-width 2;