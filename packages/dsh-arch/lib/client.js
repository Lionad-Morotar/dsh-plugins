window.__ModuleLoader__.load({
  id: "dsh-arch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var s=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var v=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var C=(e,r)=>{for(var t in r)s(e,t,{get:r[t],enumerable:!0})},S=(e,r,t,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of v(r))!E.call(e,n)&&n!==t&&s(e,n,{get:()=>r[n],enumerable:!(o=O(r,n))||o.enumerable});return e};var I=e=>S(s({},"__esModule",{value:!0}),e);var H={};C(H,{boot:()=>h,default:()=>M,mountArchDiagram:()=>_});module.exports=I(H);var i="dsh-arch";var d="client.diagram.js";var p=Object.freeze({chunk:d,id:`${i}/${d}`}),g=null,a=null;function h(e){g=e}function m(){if(a!==null)return a;let e=g;if(e===null)return Promise.reject(new Error(`${i}: the loader require was not handed over`));let r=e.async(`./${p.chunk}`).then(t=>{let o=t;if(o===null||typeof o.createDiagram!="function")throw new Error(`${i}: chunk ${p.id} is missing createDiagram`);return o});return a=r,r.catch(()=>{a===r&&(a=null)}),r}function y(e,r){return{scale:.75,tx:r.width/2-(e.x+e.width/2)*.75,ty:r.height/2-(e.y+e.height/2)*.75}}function N(e,r){let t=Math.abs(e.x-r.baseX),o=Math.abs(e.y-r.baseY);return t<=e.width/2&&o<=e.height/2}function w(e,r){let t=new Map;for(let o of e){let n=r[o.id];n!==void 0&&N(o,n)?t.set(o.id,{x:o.x+n.dx,y:o.y+n.dy}):t.set(o.id,{x:o.x,y:o.y})}return t}function A(e,r,t){return{dx:r-e.x,dy:t-e.y,baseX:e.x,baseY:e.y}}var M={name:i,inject:["dsh-workbench-core"],apply(){}};async function _(e,r,t,o=m){let n=await o(),x=t.offsetsFor(r.id),D=w(r.nodes,x),c=e.getBoundingClientRect(),R=t.viewport??y(r.bounds,{width:c.width,height:c.height}),l=n.createDiagram(e,r,{viewport:R,positions:D,onMove:(u,b,k)=>{let f=r.nodes.find(V=>V.id===u);f!==void 0&&t.queueOffset(r.id,u,A(f,b,k))}});return t.setView(r.id),t.setViewport(l.viewport()),l}

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
