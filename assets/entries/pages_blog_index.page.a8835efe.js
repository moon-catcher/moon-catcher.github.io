import{j as e,r as l}from"../chunks/chunk-9a4f56c2.js";import{b as g,u as j}from"../chunks/chunk-bce179bd.js";const h="/moon-catcher.png";function v({showDetail:t}){const{userInfo:s,login:o,loading:c,error:n}=g();return console.log(s,n,"userInfo"),e.jsxs("div",{className:"author",style:t?{}:{padding:10},children:[e.jsx("div",{className:"logo",children:s.avatar_url?e.jsx("div",{className:"login",children:e.jsxs("a",{href:"/",style:t?{height:100,width:100}:{height:40,width:40},children:[e.jsx("div",{className:t?"rolling-bigger":"rolling"}),e.jsx("img",{src:s.avatar_url??h,alt:"login",style:t?{height:100,width:100}:{height:40,width:40}})]})}):e.jsxs("div",{className:"login",title:"点击登录",onClick:()=>o(),children:[e.jsx("div",{className:"login-text",style:t?{fontSize:16}:{fontSize:8},children:c&&!n?"校验中...":n&&"未登录"||"登录中..."}),e.jsx("div",{className:t?"loading-bigger":"loading"}),e.jsx("img",{src:h,alt:"login",style:t?{height:100,width:100}:{height:40,width:40}})]})}),e.jsxs("div",{className:["detail",t?"detail-hidden":""].join(" "),children:[e.jsx("div",{children:s.name}),e.jsx("div",{style:t?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:s.bio}),e.jsx("div",{style:t?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:"link"}),e.jsx("div",{style:t?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:"connect"})]}),e.jsxs("div",{className:"dashboard",style:t?{}:{opacity:0,height:0,overflow:"hidden"},children:[e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"})]})]})}function m(){const[t,s]=l.useState(0);return e.jsxs("button",{type:"button",onClick:()=>s(o=>o+1),children:["Counter ",t]})}const b={title:"Welcome Moon Catcher!"},p=new Array(100).fill(0).map((t,s)=>({name:"Name"+s,content:"啊发射点发的发射点发萨法沙发沙发沙发"}));function N(){const[t,s]=l.useState(!0),[o,c]=l.useState(0),{setLinkBntAction:n}=j(),d=i=>{s(i.deltaY<0)},a=l.useCallback(i=>{console.log(i),s(i.touches[0].clientY>o)},[o]),u=i=>{c(i.touches[0].clientY)},r=l.useCallback(i=>{console.log("search",i,"searchValue")},[]);return l.useEffect(()=>{typeof n=="function"&&n("search",r)},[n,r]),e.jsxs(e.Fragment,{children:[e.jsx(v,{showDetail:t}),e.jsxs("div",{className:"article-list",onWheel:d,onTouchMove:a,onTouchStart:u,style:{height:`calc(100vh - ${t?"174px":"60px"} - 40px) `},children:[e.jsxs("div",{className:"article-box",children:[e.jsx("h1",{children:"Welcome"}),"This page is:",e.jsxs("ul",{children:[e.jsx("li",{children:"Rendered to HTML."}),e.jsxs("li",{children:["Interactive. ",e.jsx(m,{})]})]})]}),p.map(({name:i,content:x})=>e.jsxs("div",{className:"article-box",children:[e.jsx("h1",{children:i}),e.jsx("p",{children:x})]},i))]})]})}export{N as Page,b as documentProps};