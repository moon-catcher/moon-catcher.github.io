import{j as a}from"./chunk-2c409e9d.js";const o=async(t,e)=>{const r=`/authenticate/${t}/${e}`;return await a.get(r,{withCredentials:!0})},s=async(t,e)=>await t.request("GET /repos/{owner}/{repo}/contents/{path}",{owner:e.owner,repo:e.repo??`${e.owner}.github.io`,path:e.path??"blog",headers:{"X-GitHub-Api-Version":"2022-11-28"}});export{s as a,o as g};
