window.__ModuleLoader__.load({
  id: "dsh-preview-more",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var m=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var A=Object.prototype.hasOwnProperty;var M=(e,t)=>{for(var r in t)m(e,r,{get:t[r],enumerable:!0})},V=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of T(t))!A.call(e,n)&&n!==r&&m(e,n,{get:()=>t[n],enumerable:!(o=E(t,n))||o.enumerable});return e};var j=e=>V(m({},"__esModule",{value:!0}),e);var N={};M(N,{boot:()=>_,clientPlugin:()=>F,default:()=>K,loadChunk:()=>w});module.exports=j(N);var u=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function g(){return u.flatMap(e=>[...e.extensions])}function h(){return u.map(e=>e.family)}function v(e){return u.find(t=>t.family===e)?.extensions??[]}function x(e){let t=e.slice(e.lastIndexOf("/")+1),r=t.lastIndexOf(".");if(r<=0)return null;let o=t.slice(r+1).toLowerCase();return u.find(n=>n.extensions.includes(o))?.family??null}var L="dsh-preview-more";function b(e,t){if(typeof e.inject!="function")return;let{React:r,t:o,family:n}=t,a=L+":"+n,i=r.lazy(async()=>({default:(await t.loadChunk(n)).Viewer})),d=function(s){return r.createElement(r.Suspense,{fallback:null},r.createElement(i,{...s,t:o,readFile:t.readFile}))};e.inject(["betterSidebar"],c=>{let s=c.get("betterSidebar");if(!(s===void 0||typeof s.registerFileViewer!="function"))return s.registerFileViewer({id:a,title:()=>o(n+".title"),exts:v(n),priority:10,fetchStrategy:"custom",load:async(l,S,R)=>({bytes:await t.readFile(S.sessionId,l,R??new AbortController().signal),path:l}),component:d})})}var f="previewMore";function k(){return{zh:{"scene3d.title":"3D \u6A21\u578B","raster.title":"\u56FE\u7247","cad.title":"CAD \u56FE\u7EB8","state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","state.retry":"\u91CD\u8BD5","state.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u5728\u6D4F\u89C8\u5668\u5185\u89E3\u7801","state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","state.empty":"\u6587\u4EF6\u91CC\u6CA1\u6709\u53EF\u663E\u793A\u7684\u51E0\u4F55\u4F53","scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","scene3d.wireframe":"\u7EBF\u6846","scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","raster.page":"\u7B2C {current} / {total} \u9875","raster.previous":"\u4E0A\u4E00\u9875","raster.next":"\u4E0B\u4E00\u9875","cad.fit":"\u9002\u5E94\u7A97\u53E3","cad.layers":"\u56FE\u5C42 {count}"},en:{"scene3d.title":"3D model","raster.title":"Image","cad.title":"CAD drawing","state.loading":"Reading\u2026","state.decoding":"Decoding\u2026","state.failed":"This file cannot be previewed","state.retry":"Retry","state.tooLarge":"The file is too large to decode in the browser","state.unsupported":"This format is not supported yet","state.empty":"The file contains no displayable geometry","scene3d.reset":"Reset view","scene3d.wireframe":"Wireframe","scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","raster.page":"Page {current} of {total}","raster.previous":"Previous page","raster.next":"Next page","cad.fit":"Fit view","cad.layers":"{count} layers"}}}var y="dsh-preview-more",I=`
.preview-more-scene,
.preview-more-raster {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
}

.preview-more-canvas {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  width: 100%;
  height: 100%;
  /* The drawing renders its own background, but the letterbox area around a
     raster page does not, and a white page on a white pane is invisible. */
  background: var(--dsh-surface-sunken, rgba(127, 127, 127, 0.08));
}

.preview-more-canvas > canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

/* A raster page keeps its aspect ratio inside the panel.
   object-fit does apply to a canvas, but only when both width and height are
   set: with max-width alone the computed value falls back to fill and the
   bitmap stretches. So the element is given the whole box and object-fit
   letterboxes the page inside it, which keeps a tall scan readable and does not
   distort a wide one. */
.preview-more-canvas-image,
.preview-more-image {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-more-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--dsh-text-secondary, currentColor);
  border-top: 1px solid var(--dsh-border-subtle, transparent);
}

.preview-more-facts {
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-more-action {
  flex: 0 0 auto;
  padding: 2px 8px;
  border: 1px solid var(--dsh-border-strong, currentColor);
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.preview-more-action:hover:not(:disabled) {
  background: var(--dsh-surface-hover, rgba(127, 127, 127, 0.12));
}

.preview-more-action:disabled {
  opacity: 0.45;
  cursor: default;
}

.preview-more-status {
  padding: 10px 12px;
  font-size: 12px;
  color: var(--dsh-text-secondary, currentColor);
  flex: 0 0 auto;
}

.preview-more-detail {
  margin: 4px 0 8px;
  font-family: var(--dsh-font-mono, monospace);
  font-size: 11px;
  opacity: 0.8;
  word-break: break-word;
}
`;function C(e){let t=`style[data-plugin-css="${y}"]`;if(e.querySelector(t)!==null)return()=>{};let r=e.createElement("style");return r.dataset.plugin=y,r.dataset.pluginCss=y,r.textContent=I,e.head.append(r),()=>r.remove()}var p=null,P=new Map;function w(e){let t=P.get(e);if(t!==void 0)return t;if(p===null)return Promise.reject(new Error("dsh-preview-more: the loader require was not handed over"));let r=p.async("./client."+e+".js").then(o=>{let n=o;if(typeof n.Body!="function"||typeof n.Viewer!="function")throw new Error("dsh-preview-more: chunk "+e+" is missing Body or Viewer");return n});return P.set(e,r),r}function z(){if(p===null)throw new Error("dsh-preview-more: the loader require was not handed over");return p("react")}var B="dsh-preview-more/";function D(e){return async(t,r,o)=>{let n=await e.remote.workspaceFiles.readBytes(t,r,{},o);if(!n.ok)throw new Error("read failed: "+O(n.error),{cause:n.error});return n.value.data}}function O(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e.code;if(typeof t=="string")return t}return"unknown error"}function q(e,t,r){let o=e.lazy(async()=>({default:r(await t())}));return function(a){return e.createElement(e.Suspense,{fallback:null},e.createElement(o,a))}}var F={name:"dsh-preview-more",inject:["documentPreviews","slots","locale","remote","remote.workspaceFiles"],apply(e){let t=z(),r=e.locale.bind(f),o=D(e),n=[],a=i=>{typeof e.effect=="function"?e.effect(i,"dsh-preview-more: registration"):n.push(i())};a(()=>e.locale.register(f,k())),a(()=>{let i=globalThis.document;return i===void 0?(()=>{}):C(i)});for(let i of h()){let d=g().filter(l=>x("x."+l)===i);if(d.length===0)continue;let c=B+i;a(()=>e.documentPreviews.register({id:c,extensions:d,binaryExtensions:d,priority:"extension",title:()=>r(i+".title"),loading:"renderer",wrap:!1}));let s=q(t,()=>w(i),l=>l.Body);a(()=>e.slots.inject("sidebar.right.tab.document",()=>e.slots.register({name:"sidebar.right.tab.document",key:c,locale:f,inject:()=>({readFile:o})},s))),b(e,{React:t,t:r,readFile:o,family:i,loadChunk:w})}return()=>{for(let i of n)i()}}};function _(e){p=e}var K=F;

module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
