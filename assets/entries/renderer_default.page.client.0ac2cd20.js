import{j as e,r as s,R as g}from"../chunks/chunk-9a4f56c2.js";import{r as C,M as x}from"../chunks/chunk-3dd8c495.js";import{P as S}from"../chunks/chunk-10a2ec28.js";import"./renderer_default.page.server.extractAssets.c9203ae8.js";import{L as u}from"../chunks/chunk-d209e026.js";import{A as y}from"../chunks/chunk-9903c753.js";var w,j=C;j.createRoot,w=j.hydrateRoot;function B({children:t}){return e.jsx("div",{className:"layout",children:t})}function M({children:t}){return e.jsx("div",{className:"content",children:t})}const m=(t={children:"🚀",hiddenPath:[]})=>{const[a,n]=s.useState(!1);return s.useEffect(()=>{var i,r;(i=t.hiddenPath)!=null&&i.length?typeof t.hiddenPath=="string"&&location.pathname.includes(t.hiddenPath)||typeof t.hiddenPath=="object"&&t.hiddenPath.some(o=>location.pathname.includes(o))?n(!1):n(!0):(r=t.showPath)!=null&&r.length?typeof t.showPath=="string"&&location.pathname.includes(t.showPath)||typeof t.showPath=="object"&&t.showPath.some(o=>location.pathname.includes(o))?n(!0):n(!1):n(!0)},[t.hiddenPath,t.showPath]),a?e.jsx("div",{className:["action-button",t.className].join(" "),onClick:t.onClick,children:t.children}):e.jsx(e.Fragment,{})},E=()=>e.jsx(m,{className:"writeButton",hiddenPath:"write",children:e.jsx("a",{href:"/write",children:"🚀"})}),R=t=>e.jsx(m,{className:"searchButton",hiddenPath:"write",onClick:()=>{var a;return(a=t.onClick)==null?void 0:a.call(t,"adf")},children:"🔎"}),L=t=>e.jsx(m,{className:"saveButton",showPath:"write",onClick:t.onClick,children:"📌"}),W=t=>e.jsx(m,{className:"submitButton",showPath:"write",onClick:t.onClick,children:"🎈"}),A=()=>e.jsx(m,{className:"writeSettingButton",showPath:"write",children:e.jsx("a",{href:"/write-setting",children:"⚙"})}),H=g.createContext(!1),I=s.forwardRef(function({children:a},n){const[i,r]=s.useState(0),[o,d]=s.useState(!1),v=s.Children.count(a),h=s.useRef(new Map);s.useImperativeHandle(n,()=>({functionMap:h.current}),[]);const N=s.useCallback(c=>{var l;(l=h.current.get("search"))==null||l(c)},[]),b=s.useCallback(()=>{var c;(c=h.current.get("save"))==null||c()},[]),k=s.useCallback(()=>{var c;(c=h.current.get("submit"))==null||c()},[]);s.useEffect(()=>{if(location.search.includes("menu")){d(!0);const l=document.querySelector("#toggle");l&&l instanceof HTMLInputElement&&(l.checked=!0)}window.innerWidth>x?r(0):r(1);const c=l=>{var f;((f=l==null?void 0:l.target)==null?void 0:f.innerWidth)>x?r(0):r(1)};return window.addEventListener("resize",c),()=>{window.removeEventListener("resize",c)}},[]);const P=c=>{c.target.checked?(d(!0),history.pushState(null,"menu","?menu")):(d(!1),window.history.replaceState(null,"menu",location.pathname))};return console.log(h.current,"functionMap.current"),e.jsxs("div",{className:"lightSidebar",children:[e.jsxs("div",{className:"active-links",style:{right:i===0||o?"calc(103%)":65},children:[e.jsx(E,{}),e.jsx(R,{onClick:N}),e.jsx(L,{onClick:b}),e.jsx(W,{onClick:k}),e.jsx(A,{})]}),e.jsx("div",{className:["right-sidebar",i!==0?"hidden":"",o?"force-show":""].join(" "),style:{height:i===0||o?v*35:0},children:e.jsx(H.Provider,{value:o,children:a})}),e.jsxs("div",{className:["show-right-sidebar",i!==0?"":"button-hidden"].join(" "),children:[e.jsx("input",{id:"toggle",type:"checkbox",onChange:P}),e.jsxs("label",{htmlFor:"toggle",className:"hamburger",style:o?{bottom:-45}:{top:0},children:[e.jsx("div",{className:"top-bun"}),e.jsx("div",{className:"meat"}),e.jsx("div",{className:"bottom-bun"})]})]})]})});function T({htmlStr:t,className:a}){const n=s.useRef(null);return s.useEffect(()=>{n.current&&t&&(n.current.innerHTML=t)},[t]),e.jsxs("div",{ref:n,className:["background",a].join(" "),children:[e.jsx("a",{href:"/write",children:e.jsx("div",{className:"moon"})}),e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"star star-1"}),e.jsx("div",{className:"star star-2"}),e.jsx("div",{className:"star star-3"}),e.jsx("div",{className:"shooting-star"}),e.jsx("div",{className:"shooting-star2"}),e.jsx("div",{className:"shooting-star3"}),e.jsx("div",{className:"mountains"}),e.jsxs("div",{className:"land",children:[e.jsxs("div",{className:"windmill",children:[e.jsx("div",{className:"light"}),e.jsx("div",{className:"blades"})]}),e.jsx("div",{className:"tree"})]})]})]})}function q({children:t,pageContext:a}){const n=s.useRef(null);function i(r,o){var d;(d=n.current)==null||d.functionMap.set(r,o)}return s.useEffect(()=>{},[]),e.jsx(g.StrictMode,{children:e.jsxs(S,{pageContext:{...a,setLinkBntAction:i},children:[e.jsx(B,{children:e.jsx(M,{children:t})}),e.jsxs(I,{ref:n,children:[e.jsx(u,{className:"navitem",href:"/",children:"Home"}),e.jsx(u,{className:"navitem",href:"/blog",children:"Blog"}),e.jsx(u,{className:"navitem",href:"/about",children:"About"}),e.jsx(u,{className:"navitem",href:"/write",children:"Write"}),e.jsx(u,{className:"navitem",href:"/draft",children:"Draft"}),e.jsx("button",{onClick:()=>{var r;return(r=document.querySelector("body"))==null?void 0:r.requestFullscreen()},children:"全屏"})]}),e.jsx(T,{})]})})}async function V(t){const{Page:a,pageProps:n}=t;if(!a)throw new Error("Client-side render() hook expects pageContext.Page to be defined");const i=document.getElementById("react-root");if(!i)throw new Error("DOM element #react-root not found");w(i,e.jsx(y,{children:e.jsx(q,{pageContext:t,children:e.jsx(a,{...n})})}))}export{V as render};
