import{j as e,R as l,r as c}from"../chunks/chunk-9a4f56c2.js";import{r as m}from"../chunks/chunk-3c9561d0.js";import{P as x,L as t}from"../chunks/chunk-2b26b7f1.js";import"./renderer_default.page.server.extractAssets.7b5eae32.js";import{A as j}from"../chunks/chunk-c9b4f9f8.js";import"../chunks/chunk-24dec1b5.js";var n,d=m;d.createRoot,n=d.hydrateRoot;function h({children:s}){return e.jsx("div",{className:"layout",children:s})}function u({children:s}){return e.jsx("div",{className:"content",children:s})}function f({children:s}){return e.jsx("div",{className:"lightSidebar",children:s})}function v({children:s,pageContext:r}){return console.log(r,"pageContext****************"),e.jsx(l.StrictMode,{children:e.jsx(j,{children:e.jsxs(x,{pageContext:r,children:[e.jsx(h,{children:e.jsx(u,{children:s})}),e.jsxs(f,{children:[e.jsx(t,{className:"navitem",href:"/",children:"Home"}),e.jsx(t,{className:"navitem",href:"/blog",children:"Blog"}),e.jsx(t,{className:"navitem",href:"/about",children:"About"}),e.jsx(t,{className:"navitem",href:"/write",children:"Write"})]})]})})})}function N({htmlStr:s,className:r}){const a=c.useRef(null);return c.useEffect(()=>{a.current&&s&&(a.current.innerHTML=s)},[s]),e.jsxs("div",{ref:a,className:["background",r].join(" "),children:[e.jsx("a",{href:"/write",children:e.jsx("div",{className:"moon"})}),e.jsxs("div",{className:"container",children:[e.jsx("div",{className:"star star-1"}),e.jsx("div",{className:"star star-2"}),e.jsx("div",{className:"star star-3"}),e.jsx("div",{className:"shooting-star"}),e.jsx("div",{className:"shooting-star2"}),e.jsx("div",{className:"shooting-star3"}),e.jsx("div",{className:"mountains"}),e.jsxs("div",{className:"land",children:[e.jsxs("div",{className:"windmill",children:[e.jsx("div",{className:"light"}),e.jsx("div",{className:"blades"})]}),e.jsx("div",{className:"tree"})]})]})]})}async function k(s){const{Page:r,pageProps:a}=s;if(!r)throw new Error("Client-side render() hook expects pageContext.Page to be defined");const o=document.getElementById("react-root"),i=document.getElementById("background");if(!o||!i)throw new Error("DOM element #react-root not found");n(o,e.jsx(v,{pageContext:s,children:e.jsx(r,{...a})})),n(i,e.jsx(N,{}))}export{k as render};
