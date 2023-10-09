import{j as e,r as a,R as w}from"../chunks/chunk-9a4f56c2.js";import{r as C,M as j}from"../chunks/chunk-3dd8c495.js";import{P as S}from"../chunks/chunk-10a2ec28.js";import"./renderer_default.page.server.extractAssets.0ec17af2.js";import{L as u}from"../chunks/chunk-d209e026.js";import{A as y}from"../chunks/chunk-9903c753.js";var f,g=C;g.createRoot,f=g.hydrateRoot;function B({children:t}){return e.jsx("div",{className:"layout",children:t})}function E({children:t}){return e.jsx("div",{className:"content",children:t})}const m=(t={children:"🚀",hiddenPath:[]})=>{const[i,n]=a.useState(!1);return a.useEffect(()=>{var r,s;(r=t.hiddenPath)!=null&&r.length?typeof t.hiddenPath=="string"&&location.pathname.includes(t.hiddenPath)||typeof t.hiddenPath=="object"&&t.hiddenPath.some(o=>location.pathname.includes(o))?n(!1):n(!0):(s=t.showPath)!=null&&s.length?typeof t.showPath=="string"&&location.pathname.includes(t.showPath)||typeof t.showPath=="object"&&t.showPath.some(o=>location.pathname.includes(o))?n(!0):n(!1):n(!0)},[t.hiddenPath,t.showPath]),i?e.jsx("div",{className:["action-button",t.className].join(" "),onClick:t.onClick,children:t.children}):e.jsx(e.Fragment,{})},M=()=>e.jsx(m,{className:"writeButton",hiddenPath:"write",children:e.jsx("a",{href:"/write",children:"🚀"})}),R=t=>e.jsx(m,{className:"searchButton",hiddenPath:"write",onClick:()=>{var i;return(i=t.onClick)==null?void 0:i.call(t,"adf")},children:"🔎"}),L=t=>e.jsx(m,{className:"saveButton",showPath:"write",onClick:t.onClick,children:"📌"}),W=t=>e.jsx(m,{className:"submitButton",showPath:"write",onClick:t.onClick,children:"🎈"}),A=()=>e.jsx(m,{className:"writeSettingButton",showPath:"write",children:e.jsx("a",{href:"/write-setting",children:"⚙"})}),H=w.createContext(!1),I=a.forwardRef(function({children:i},n){const[r,s]=a.useState(0),[o,d]=a.useState(!1),v=a.Children.count(i),h=a.useRef(new Map);a.useImperativeHandle(n,()=>({functionMap:h.current}),[]);const N=a.useCallback(c=>{var l;(l=h.current.get("search"))==null||l(c)},[]),b=a.useCallback(()=>{var c;(c=h.current.get("save"))==null||c()},[]),k=a.useCallback(()=>{var c;(c=h.current.get("submit"))==null||c()},[]);a.useEffect(()=>{if(location.search.includes("menu")){d(!0);const l=document.querySelector("#toggle");l&&l instanceof HTMLInputElement&&(l.checked=!0)}window.innerWidth>j?s(0):s(1);const c=l=>{var x;((x=l==null?void 0:l.target)==null?void 0:x.innerWidth)>j?s(0):s(1)};return window.addEventListener("resize",c),()=>{window.removeEventListener("resize",c)}},[]);const P=c=>{c.target.checked?(d(!0),history.pushState(null,"menu","?menu")):(d(!1),window.history.replaceState(null,"menu",location.pathname))};return console.log(h.current,"functionMap.current"),e.jsxs("div",{className:"lightSidebar",children:[e.jsxs("div",{className:"active-links",style:{right:r===0||o?"calc(103%)":65},children:[e.jsx(M,{}),e.jsx(R,{onClick:N}),e.jsx(L,{onClick:b}),e.jsx(W,{onClick:k}),e.jsx(A,{})]}),e.jsx("div",{className:["right-sidebar",r!==0?"hidden":"",o?"force-show":""].join(" "),style:{height:r===0||o?v*35:0},children:e.jsx(H.Provider,{value:o,children:i})}),e.jsxs("div",{className:["show-right-sidebar",r!==0?"":"button-hidden"].join(" "),children:[e.jsx("input",{id:"toggle",type:"checkbox",onChange:P}),e.jsxs("label",{htmlFor:"toggle",className:"hamburger",style:o?{bottom:-45}:{top:0},children:[e.jsx("div",{className:"top-bun"}),e.jsx("div",{className:"meat"}),e.jsx("div",{className:"bottom-bun"})]})]})]})});function F({children:t,pageContext:i}){const n=a.useRef(null);function r(s,o){var d;(d=n.current)==null||d.functionMap.set(s,o)}return a.useEffect(()=>{document.onclick=function(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().then(s=>{alert(JSON.stringify(s))}).catch(s=>{alert(JSON.stringify(s))})}},[]),e.jsx(w.StrictMode,{children:e.jsxs(S,{pageContext:{...i,setLinkBntAction:r},children:[e.jsx(B,{children:e.jsx(E,{children:t})}),e.jsxs(I,{ref:n,children:[e.jsx(u,{className:"navitem",href:"/",children:"Home"}),e.jsx(u,{className:"navitem",href:"/blog",children:"Blog"}),e.jsx(u,{className:"navitem",href:"/about",children:"About"}),e.jsx(u,{className:"navitem",href:"/write",children:"Write"}),e.jsx(u,{className:"navitem",href:"/draft",children:"Draft"})]})]})})}function O({htmlStr:t,className:i}){const n=a.useRef(null);return a.useEffect(()=>{n.current&&t&&(n.current.innerHTML=t)},[t]),e.jsxs("div",{ref:n,className:["background",i].join(" "),children:[e.jsx("a",{href:"/write",children:e.jsx("div",{className:"moon"})}),e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"star star-1"}),e.jsx("div",{className:"star star-2"}),e.jsx("div",{className:"star star-3"}),e.jsx("div",{className:"shooting-star"}),e.jsx("div",{className:"shooting-star2"}),e.jsx("div",{className:"shooting-star3"}),e.jsx("div",{className:"mountains"}),e.jsxs("div",{className:"land",children:[e.jsxs("div",{className:"windmill",children:[e.jsx("div",{className:"light"}),e.jsx("div",{className:"blades"})]}),e.jsx("div",{className:"tree"})]})]})]})}async function _(t){const{Page:i,pageProps:n}=t;if(!i)throw new Error("Client-side render() hook expects pageContext.Page to be defined");const r=document.getElementById("react-root"),s=document.getElementById("background");if(!r||!s)throw new Error("DOM element #react-root not found");f(r,e.jsx(y,{children:e.jsx(F,{pageContext:t,children:e.jsx(i,{...n})})})),f(s,e.jsx(O,{}))}export{_ as render};
