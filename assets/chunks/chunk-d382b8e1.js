import{R as s,r as a,j as u}from"./chunk-9a4f56c2.js";const n=s.createContext(void 0);function c({pageContext:t,children:e}){return u.jsx(n.Provider,{value:t,children:e})}function f(){return a.useContext(n)}/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */function o(t){return Object.prototype.toString.call(t)==="[object Object]"}function p(t){var e,r;return o(t)===!1?!1:(e=t.constructor,e===void 0?!0:(r=e.prototype,!(o(r)===!1||r.hasOwnProperty("isPrototypeOf")===!1)))}export{c as P,p as i,f as u};
