var re=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Z(c){return c&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c}function ne(c){if(c.__esModule)return c;var v=c.default;if(typeof v=="function"){var _=function m(){return this instanceof m?Reflect.construct(v,arguments,this.constructor):v.apply(this,arguments)};_.prototype=v.prototype}else _={};return Object.defineProperty(_,"__esModule",{value:!0}),Object.keys(c).forEach(function(m){var R=Object.getOwnPropertyDescriptor(c,m);Object.defineProperty(_,m,R.get?R:{enumerable:!0,get:function(){return c[m]}})}),_}var H={exports:{}},j={},W={exports:{}},r={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var J;function ee(){if(J)return r;J=1;var c=Symbol.for("react.element"),v=Symbol.for("react.portal"),_=Symbol.for("react.fragment"),m=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),O=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),k=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),h=Symbol.iterator;function E(e){return e===null||typeof e!="object"?null:(e=h&&e[h]||e["@@iterator"],typeof e=="function"?e:null)}var w={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},A=Object.assign,F={};function b(e,t,n){this.props=e,this.context=t,this.refs=F,this.updater=n||w}b.prototype.isReactComponent={},b.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},b.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function L(){}L.prototype=b.prototype;function P(e,t,n){this.props=e,this.context=t,this.refs=F,this.updater=n||w}var I=P.prototype=new L;I.constructor=P,A(I,b.prototype),I.isPureReactComponent=!0;var N=Array.isArray,U=Object.prototype.hasOwnProperty,T={current:null},M={key:!0,ref:!0,__self:!0,__source:!0};function V(e,t,n){var u,o={},f=null,l=null;if(t!=null)for(u in t.ref!==void 0&&(l=t.ref),t.key!==void 0&&(f=""+t.key),t)U.call(t,u)&&!M.hasOwnProperty(u)&&(o[u]=t[u]);var s=arguments.length-2;if(s===1)o.children=n;else if(1<s){for(var i=Array(s),d=0;d<s;d++)i[d]=arguments[d+2];o.children=i}if(e&&e.defaultProps)for(u in s=e.defaultProps,s)o[u]===void 0&&(o[u]=s[u]);return{$$typeof:c,type:e,key:f,ref:l,props:o,_owner:T.current}}function Y(e,t){return{$$typeof:c,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function q(e){return typeof e=="object"&&e!==null&&e.$$typeof===c}function K(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var B=/\/+/g;function D(e,t){return typeof e=="object"&&e!==null&&e.key!=null?K(""+e.key):t.toString(36)}function g(e,t,n,u,o){var f=typeof e;(f==="undefined"||f==="boolean")&&(e=null);var l=!1;if(e===null)l=!0;else switch(f){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case c:case v:l=!0}}if(l)return l=e,o=o(l),e=u===""?"."+D(l,0):u,N(o)?(n="",e!=null&&(n=e.replace(B,"$&/")+"/"),g(o,t,n,"",function(d){return d})):o!=null&&(q(o)&&(o=Y(o,n+(!o.key||l&&l.key===o.key?"":(""+o.key).replace(B,"$&/")+"/")+e)),t.push(o)),1;if(l=0,u=u===""?".":u+":",N(e))for(var s=0;s<e.length;s++){f=e[s];var i=u+D(f,s);l+=g(f,t,n,i,o)}else if(i=E(e),typeof i=="function")for(e=i.call(e),s=0;!(f=e.next()).done;)f=f.value,i=u+D(f,s++),l+=g(f,t,n,i,o);else if(f==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return l}function x(e,t,n){if(e==null)return e;var u=[],o=0;return g(e,u,"","",function(f){return t.call(n,f,o++)}),u}function Q(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var a={current:null},$={transition:null},X={ReactCurrentDispatcher:a,ReactCurrentBatchConfig:$,ReactCurrentOwner:T};return r.Children={map:x,forEach:function(e,t,n){x(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return x(e,function(){t++}),t},toArray:function(e){return x(e,function(t){return t})||[]},only:function(e){if(!q(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},r.Component=b,r.Fragment=_,r.Profiler=R,r.PureComponent=P,r.StrictMode=m,r.Suspense=p,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=X,r.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var u=A({},e.props),o=e.key,f=e.ref,l=e._owner;if(t!=null){if(t.ref!==void 0&&(f=t.ref,l=T.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(i in t)U.call(t,i)&&!M.hasOwnProperty(i)&&(u[i]=t[i]===void 0&&s!==void 0?s[i]:t[i])}var i=arguments.length-2;if(i===1)u.children=n;else if(1<i){s=Array(i);for(var d=0;d<i;d++)s[d]=arguments[d+2];u.children=s}return{$$typeof:c,type:e.type,key:o,ref:f,props:u,_owner:l}},r.createContext=function(e){return e={$$typeof:O,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:C,_context:e},e.Consumer=e},r.createElement=V,r.createFactory=function(e){var t=V.bind(null,e);return t.type=e,t},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:S,render:e}},r.isValidElement=q,r.lazy=function(e){return{$$typeof:y,_payload:{_status:-1,_result:e},_init:Q}},r.memo=function(e,t){return{$$typeof:k,type:e,compare:t===void 0?null:t}},r.startTransition=function(e){var t=$.transition;$.transition={};try{e()}finally{$.transition=t}},r.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")},r.useCallback=function(e,t){return a.current.useCallback(e,t)},r.useContext=function(e){return a.current.useContext(e)},r.useDebugValue=function(){},r.useDeferredValue=function(e){return a.current.useDeferredValue(e)},r.useEffect=function(e,t){return a.current.useEffect(e,t)},r.useId=function(){return a.current.useId()},r.useImperativeHandle=function(e,t,n){return a.current.useImperativeHandle(e,t,n)},r.useInsertionEffect=function(e,t){return a.current.useInsertionEffect(e,t)},r.useLayoutEffect=function(e,t){return a.current.useLayoutEffect(e,t)},r.useMemo=function(e,t){return a.current.useMemo(e,t)},r.useReducer=function(e,t,n){return a.current.useReducer(e,t,n)},r.useRef=function(e){return a.current.useRef(e)},r.useState=function(e){return a.current.useState(e)},r.useSyncExternalStore=function(e,t,n){return a.current.useSyncExternalStore(e,t,n)},r.useTransition=function(){return a.current.useTransition()},r.version="18.2.0",r}W.exports=ee();var G=W.exports;const oe=Z(G);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z;function te(){if(z)return j;z=1;var c=G,v=Symbol.for("react.element"),_=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,R=c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,C={key:!0,ref:!0,__self:!0,__source:!0};function O(S,p,k){var y,h={},E=null,w=null;k!==void 0&&(E=""+k),p.key!==void 0&&(E=""+p.key),p.ref!==void 0&&(w=p.ref);for(y in p)m.call(p,y)&&!C.hasOwnProperty(y)&&(h[y]=p[y]);if(S&&S.defaultProps)for(y in p=S.defaultProps,p)h[y]===void 0&&(h[y]=p[y]);return{$$typeof:v,type:S,key:E,ref:w,props:h,_owner:R.current}}return j.Fragment=_,j.jsx=O,j.jsxs=O,j}H.exports=te();var ue=H.exports;export{oe as R,ne as a,re as c,Z as g,ue as j,G as r};
