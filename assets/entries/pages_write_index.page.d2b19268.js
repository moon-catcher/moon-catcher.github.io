import{R as P,r as t,j as e}from"../chunks/chunk-9a4f56c2.js";import{u as R,d as O}from"../chunks/chunk-6b113bd9.js";import{O as E}from"../chunks/chunk-053f14ea.js";const F={icon:">>",children:"empty",title:"title"},y=P.createContext(void 0),T=({accordionContext:i,children:n})=>e.jsx(y.Provider,{value:i,children:n}),H=()=>{const i=t.useContext(y);if(!i)throw new Error("AccordionContext Error");return i},S=t.memo(function(n){const[h,d]=t.useState(!1);return e.jsx("div",{className:"accordion",children:e.jsx(T,{accordionContext:[h,d],children:n.children})})}),A=t.memo(function(n){const[h,d]=t.useState(!n.defaultClose),r=t.useRef(null),c=t.useRef(null),l=t.useRef(null),u=t.useRef(null),[m,p]=t.useState("unset"),[g,j]=t.useState("unset"),[k,o]=H(),a=t.useCallback(s=>{u.current=setTimeout(()=>{var x;(x=r.current)==null||x.style.setProperty(E,`${s*.1}`),s&&a(s-1)},30)},[]);t.useEffect(()=>{function s(v){v.target instanceof HTMLDivElement&&v.target.className==="collapse-box"&&o(!1)}function x(v){var w;!((w=r.current)!=null&&w.getElementsByClassName("collapse-box")[0].contains(v.target))&&!u.current&&a(15)}return window.addEventListener("transitionend",s),window.addEventListener("mouseover",x),()=>{window.removeEventListener("transitionend",s),window.removeEventListener("mouseover",x)}},[a,o]),t.useEffect(()=>{function s(){c.current&&p(c.current.clientHeight)}function x(){l.current&&j(l.current.offsetHeight)}c.current&&new ResizeObserver(s).observe(c.current),l.current&&new ResizeObserver(x).observe(l.current)},[n.children]);const f=()=>{o(!0),d(s=>!s)},C=()=>{var s;u.current&&(clearTimeout(u.current),u.current=null),(s=r.current)==null||s.style.setProperty(E,"1.5")};return t.useEffect(()=>{},[]),e.jsxs("div",{ref:r,className:"collapse",style:{flexShrink:Number(m)<50?0:1},children:[e.jsxs("div",{onClick:f,className:"collapse-header",children:[e.jsx("div",{children:n.icon}),e.jsx("div",{children:n.title})]}),e.jsx("div",{className:"collapse-box",onMouseOver:C,ref:l,style:{height:h?m:0,overflow:k?"hidden":"auto",transition:n.noTransition?void 0:"height 0.05s linear"},children:e.jsx("div",{className:"collapse-child",ref:c,children:n.children})})]})}),b=Object.assign(S,{Collapse:Object.assign(A,{defaultProps:F})}),B=i=>{const[n,h]=t.useState({remoteDraft:!0,localDraft:!0,published:!1}),d=t.useCallback((r,c)=>{h(l=>({...l,[r]:c}))},[]);return e.jsx("div",{className:["FilePicker",i.open?"filepicker-show":"filepicker-hidden"].join(" "),children:e.jsxs("div",{className:"filepicker-box",children:[e.jsxs("div",{className:"filepicker-header",children:[e.jsx("div",{className:"filepicker-tab",onClick:i.onFilePickerOpenChange,children:"Articles"}),e.jsx("div",{className:"filepicker-footer",children:e.jsxs("div",{className:"checkbox-group",children:[e.jsx("input",{type:"checkbox",id:"filepicker-remote-draft",checked:n.remoteDraft,onChange:r=>d("remoteDraft",r.target.checked)}),e.jsx("label",{htmlFor:"filepicker-remote-draft",className:"check-button",children:"在线草稿"}),e.jsx("input",{type:"checkbox",id:"filepicker-published",checked:n.published,onChange:r=>d("published",r.target.checked)}),e.jsx("label",{htmlFor:"filepicker-published",className:"check-button",children:"已发布"})]})})]}),e.jsx("div",{className:"filepicker-draft-box",children:e.jsxs(b,{children:[n.remoteDraft&&e.jsxs(b.Collapse,{title:"在线草稿",children:[e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"}),e.jsx("div",{children:"9999"})]}),n.published&&e.jsx(b.Collapse,{title:"已发布",children:"已发布"})]})})]})})},D=t.memo(B);const N="YYYY/MM/DD HH:mm:ss";function Y(){const i=t.useRef(null),{userInfo:n,login:h}=R(),[d,r]=t.useState(O().format(N)),[c,l]=t.useState(!0),[u,m]=t.useState("testteststestetest"),[p,g]=t.useState("");t.useEffect(()=>(i.current=setTimeout(()=>{r(O().format(N))},1e3),()=>{i.current&&clearTimeout(i.current)}),[d]),t.useEffect(()=>{const o=localStorage.getItem("filePickerOpen");l(o!=="close");const a=f=>{console.log(f,"event"),f.ctrlKey&&f.key==="e"&&(f.preventDefault(),l(C=>!C))};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[]);const j=t.useCallback(()=>{l(o=>(localStorage.setItem("filePickerOpen",o?"close":"open"),!o))},[]),k=t.useCallback(o=>{const{target:{value:a}}=o;g(a)},[]);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"header",children:[e.jsx(D,{open:c,handleFileContentChange:m,onFilePickerOpenChange:j}),e.jsx("button",{onClick:j,children:"展开"}),e.jsxs("div",{className:"header-title",children:[e.jsxs("div",{className:"author",children:["author: ",n.name??e.jsx("span",{onClick:h,children:"未登录"}),`  |       ${d}`]}),e.jsx("input",{className:"title",onInput:k,suppressContentEditableWarning:!0,value:p??""})]})]}),e.jsx("div",{contentEditable:!0,className:"editor-content",style:{width:c?"calc(100% - 300px)":"100%",right:c?"-150px":"0px"},children:u})]})}export{Y as Page};
