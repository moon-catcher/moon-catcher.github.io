import{j as e,r as l}from"../chunks/chunk-9a4f56c2.js";import{u as x}from"../chunks/chunk-8c5952ad.js";import"../chunks/chunk-24dec1b5.js";const r="/moon-catcher.png";function u({showDetail:i}){const{userInfo:t,login:n,loading:c,error:o}=x();return console.log(t,o,"userInfo"),e.jsxs("div",{className:"author",style:i?{}:{padding:10},children:[e.jsx("div",{className:"logo",children:t.avatar_url?e.jsx("div",{className:"login",children:e.jsxs("a",{href:"/",style:i?{height:100,width:100}:{height:40,width:40},children:[e.jsx("div",{className:i?"rolling-bigger":"rolling"}),e.jsx("img",{src:t.avatar_url??r,alt:"login",style:i?{height:100,width:100}:{height:40,width:40}})]})}):e.jsxs("div",{className:"login",title:"点击登录",onClick:()=>n(),children:[e.jsx("div",{className:"login-text",style:i?{fontSize:16}:{fontSize:8},children:c&&!o?"校验中...":o&&"未登录"||"登录中..."}),e.jsx("div",{className:i?"loading-bigger":"loading"}),e.jsx("img",{src:r,alt:"login",style:i?{height:100,width:100}:{height:40,width:40}})]})}),e.jsxs("div",{className:["detail",i?"detail-hidden":""].join(" "),children:[e.jsx("div",{children:t.name}),e.jsx("div",{style:i?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:t.bio}),e.jsx("div",{style:i?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:"link"}),e.jsx("div",{style:i?{}:{position:"absolute",height:0,opacity:0,overflow:"hidden"},children:"connect"})]}),e.jsxs("div",{className:"dashboard",style:i?{}:{opacity:0,height:0,overflow:"hidden"},children:[e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"}),e.jsx("div",{children:"博客文章"})]})]})}function j(){const[i,t]=l.useState(0);return e.jsxs("button",{type:"button",onClick:()=>t(n=>n+1),children:["Counter ",i]})}const y={title:"Welcome Moon Catcher!"},g=new Array(100).fill(0).map((i,t)=>({name:"Name"+t,content:"啊发射点发的发射点发萨法沙发沙发沙发"}));function f(){const[i,t]=l.useState(!0),[n,c]=l.useState(0),o=s=>{t(s.deltaY<0)},d=l.useCallback(s=>{console.log(s),t(s.touches[0].clientY>n)},[n]),h=s=>{c(s.touches[0].clientY)};return e.jsxs(e.Fragment,{children:[e.jsx(u,{showDetail:i}),e.jsxs("div",{className:"article-list",onWheel:o,onTouchMove:d,onTouchStart:h,style:{height:`calc(100vh - ${i?"174px":"60px"} - 40px) `},children:[e.jsxs("div",{className:"article-box",children:[e.jsx("h1",{children:"Welcome"}),"This page is:",e.jsxs("ul",{children:[e.jsx("li",{children:"Rendered to HTML."}),e.jsxs("li",{children:["Interactive. ",e.jsx(j,{})]})]})]}),g.map(({name:s,content:a})=>e.jsxs("div",{className:"article-box",children:[e.jsx("h1",{children:s}),e.jsx("p",{children:a})]},s))]})]})}export{f as Page,y as documentProps};
