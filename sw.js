if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let t={};const u=e=>n(e,l),a={module:{uri:l},exports:t,require:u};s[l]=Promise.all(i.map((e=>a[e]||u(e)))).then((e=>(r(...e),t)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"56cb09884a161178f29359ae20a12429"},{url:"about/index.html",revision:"8c144a8e8905a8285449a0736593922d"},{url:"assets/chunks/chunk-053f14ea.js",revision:null},{url:"assets/chunks/chunk-10a2ec28.js",revision:null},{url:"assets/chunks/chunk-2c409e9d.js",revision:null},{url:"assets/chunks/chunk-5ad101ef.js",revision:null},{url:"assets/chunks/chunk-9a4f56c2.js",revision:null},{url:"assets/chunks/chunk-b6ef1873.js",revision:null},{url:"assets/chunks/chunk-cf010ec4.js",revision:null},{url:"assets/chunks/chunk-d209e026.js",revision:null},{url:"assets/chunks/chunk-e28961ee.js",revision:null},{url:"assets/entries/entry-client-routing.efb73244.js",revision:null},{url:"assets/entries/entry-server-routing.bcc6b743.js",revision:null},{url:"assets/entries/pages_about_index.page.24a195b9.js",revision:null},{url:"assets/entries/pages_auth_index.page.b8f7e0fb.js",revision:null},{url:"assets/entries/pages_blog_index.page.b7572dd4.js",revision:null},{url:"assets/entries/pages_blog_index.page.server.extractAssets.4ed993c7.js",revision:null},{url:"assets/entries/pages_index_index.page.ea0f1cb0.js",revision:null},{url:"assets/entries/pages_write_index.page.82e42b3b.js",revision:null},{url:"assets/entries/pages_write-setting_index.page.9b21615e.js",revision:null},{url:"assets/entries/renderer_default.page.client.030a4d26.js",revision:null},{url:"assets/entries/renderer_default.page.server.extractAssets.22b1f5ee.js",revision:null},{url:"assets/entries/renderer_error.page.d675eb5f.js",revision:null},{url:"assets/static/default.page.server.125b0899.css",revision:null},{url:"assets/static/index.fcfe032f.css",revision:null},{url:"assets/static/index.page.0b7590f1.css",revision:null},{url:"assets/static/index.page.323c9d8c.css",revision:null},{url:"assets/static/index.page.d21d7668.css",revision:null},{url:"assets/static/index.page.f1aef519.css",revision:null},{url:"assets/static/index.page.fe854a90.css",revision:null},{url:"auth/index.html",revision:"ce9c6db1c4a8e00bce97371485f59831"},{url:"blog/index.html",revision:"653997efdc0fba7af65ab03b40434ba9"},{url:"index.html",revision:"9a33898d5cb5a0d5b47d52653f776765"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"write-setting/index.html",revision:"404c27353f8f94a31a84a19808d3e3e4"},{url:"write/index.html",revision:"f8c75bcf4edab760ad90cdaec29a0a85"},{url:"manifest.webmanifest",revision:"9114366285edaebfd39057e328c9a5fd"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
