window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  chunk: "client.image.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
/*! dsh-fs-explorer | MIT
 * Bundles third-party code through dsh-preview-viewers: three.js and utif (MIT),
 * dxf-viewer (MPL-2.0), Google Draco and pdf.js (Apache-2.0).
 * Full license texts: see THIRD-PARTY-NOTICES.md in this package.
 */
"use strict";var b=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var V=Object.prototype.hasOwnProperty;var U=(r,e)=>{for(var t in e)b(r,t,{get:e[t],enumerable:!0})},G=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of I(e))!V.call(r,i)&&i!==t&&b(r,i,{get:()=>e[i],enumerable:!(n=L(e,i))||n.enumerable});return r};var O=r=>G(b({},"__esModule",{value:!0}),r);var Z={};U(Z,{FamilyView:()=>Y,renderer:()=>X});module.exports=O(Z);var s=require("react");var W=new Map([["png","image/png"],["jpg","image/jpeg"],["jpeg","image/jpeg"],["gif","image/gif"],["webp","image/webp"],["bmp","image/bmp"],["ico","image/x-icon"],["svg","image/svg+xml"]]);function H(r){let e=r.slice(r.lastIndexOf("/")+1),t=e.lastIndexOf(".");return t<=0?null:e.slice(t+1).toLowerCase()}function T(r){let e=H(r);return e===null?null:W.get(e)??null}var a=require("react/jsx-runtime");function z(r){let{bytes:e,path:t,t:n,onSettled:i}=r,[o,c]=(0,s.useState)({kind:"loading"}),[u,g]=(0,s.useState)(0),v=(0,s.useRef)(i);v.current=i;let m=(0,s.useMemo)(()=>T(t),[t]),f=(0,s.useMemo)(()=>m===null?null:URL.createObjectURL(new Blob([e],{type:m})),[m,e,u]);return(0,s.useEffect)(()=>()=>{f!==null&&URL.revokeObjectURL(f)},[f]),(0,s.useEffect)(()=>{m===null&&(c({kind:"failed",message:n("state.unsupported")}),v.current?.(!1,u))},[m,u,n]),o.kind==="failed"?(0,a.jsxs)("div",{className:"preview-more-status",role:"alert","data-testid":"preview-more-image-failed",children:[(0,a.jsx)("p",{children:n("state.failed")}),(0,a.jsx)("p",{className:"preview-more-detail",children:o.message}),(0,a.jsx)("button",{type:"button",className:"preview-more-action",onClick:()=>{c({kind:"loading"}),g(k=>k+1)},children:n("state.retry")})]}):f===null?(0,a.jsx)("p",{className:"preview-more-status",children:n("state.loading")}):(0,a.jsx)("div",{className:"preview-more-image-surface","data-testid":"preview-more-image",children:(0,a.jsx)("img",{className:"preview-more-image",src:f,alt:n("image.title"),onLoad:()=>{v.current?.(!0,u)},onError:()=>{c({kind:"failed",message:n("state.unsupported")}),v.current?.(!1,u)}},u)})}function R(r){let{t:e,customData:t,path:n}=r,i=t?.bytes,o=t?.path??n;return i===void 0?(0,a.jsx)("p",{className:"preview-more-status",children:e("state.loading")}):(0,a.jsx)(z,{bytes:i,path:o,t:e})}var d=require("react");var F="dsh-preview-more",j=`
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
  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.08));
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
  color: var(--dsw-alias-label-secondary, currentColor);
  border-top: 1px solid var(--dsw-alias-border-l2, transparent);
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
  border: 1px solid var(--dsw-alias-border-l3, currentColor);
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.preview-more-action:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.12));
}

.preview-more-action:disabled {
  opacity: 0.45;
  cursor: default;
}

.preview-more-status {
  padding: 10px 12px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, currentColor);
  flex: 0 0 auto;
}

.preview-more-detail {
  margin: 4px 0 8px;
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  opacity: 0.8;
  word-break: break-word;
}
`;function S(r){let e=`style[data-plugin-css="${F}"]`;if(r.querySelector(e)!==null)return P(r,!1);let t=r.createElement("style");t.dataset.pluginCss=F,t.textContent=j,r.head.append(t);let i=r.querySelectorAll(e)[0]??null,o=i!==t&&i!==null;return o&&t.remove(),P(r,!o)}var x=new WeakMap;function P(r,e){let t=x.get(r)??{count:0,tag:null};t.count+=1,e&&(t.tag=r.querySelector(`style[data-plugin-css="${F}"]`)),x.set(r,t);let n=!1;return()=>{n||(n=!0,t.count-=1,!(t.count>0)&&(x.delete(r),t.tag?.remove()))}}var $="preview.surface.";function C(r){return e=>r($+e)}function _(r){return r!==null&&typeof r=="object"}function N(r){let e=_(r)?r:{},t=typeof e.code=="string"?e.code:"",n=typeof e.detail=="string"?e.detail:"",i=typeof e.message=="string"&&e.message!==""?e.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=`${t} ${n} ${i}`.toLowerCase();return o.includes("symlink")?{kind:"symlink",code:t,message:i}:o.includes("git/submodule")||o.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:i}:o.includes("git/binary")||o.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:i}:o.includes("eacces")||o.includes("eperm")||o.includes("permission")||o.includes("denied")||o.includes("forbidden")||o.includes("\u6743\u9650")?{kind:"denied",code:t,message:i}:o.includes("not-found")||o.includes("not_found")||o.includes("enoent")||o.includes("no such file")||o.includes("deleted")||o.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:i}:o.includes("not-regular-file")||o.includes("not a regular file")?{kind:"binary",code:t,message:i}:o.includes("not-text")||o.includes("utf-8")||o.includes("binary")?{kind:"binary",code:t,message:i}:o.includes("too-large")||o.includes("too large")||o.includes("maxbytes")?{kind:"too-large",code:t,message:i}:o.includes("unavailable")?{kind:"unavailable",code:t,message:i}:{kind:"unknown",code:t,message:i}}var p=require("react/jsx-runtime");function q(r,e){switch(r.kind){case"deleted":return e("preview.deleted.title");case"denied":return e("preview.denied.title");case"symlink":return e("preview.symlink.title");case"binary":return e("preview.binary.title");case"commit-binary":return e("preview.commitBinary.title");case"submodule":return e("preview.submodule.title");case"too-large":return e("preview.tooLarge.title");case"unavailable":return e("preview.unavailable.title");default:return e("preview.unknown.title")}}function K(r,e){switch(r.kind){case"deleted":return e("preview.deleted.description");case"denied":return e("preview.denied.description");case"symlink":return e("preview.symlink.description");case"binary":return e("preview.binary.description");case"commit-binary":return e("preview.commitBinary.description");case"submodule":return e("preview.submodule.description");case"too-large":return e("preview.tooLarge.description");case"unavailable":return e("preview.unavailable.description");default:return e("preview.unknown.description")}}function D({failure:r,t:e,onRetry:t}){return(0,p.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":r.kind,children:[(0,p.jsx)("strong",{children:q(r,e)}),(0,p.jsx)("span",{children:K(r,e)}),r.message===""?null:(0,p.jsx)("code",{className:"fx-preview-hint",children:r.message}),(0,p.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:e("preview.retry")})]})}function A({t:r}){return(0,p.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,p.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]})}var w=require("react/jsx-runtime");function E(r,e){function t({path:n,sessionId:i,readFile:o,t:c,visible:u=!0}){let[g,v]=(0,d.useState)(null),[m,f]=(0,d.useState)(null),[k,M]=(0,d.useState)(0),B=(0,d.useMemo)(()=>C(c),[c]);return(0,d.useEffect)(()=>{let l=globalThis.document;if(l===void 0)return;let h=S(l);return()=>h()},[]),(0,d.useEffect)(()=>{let l=new AbortController,h=!1;return v(null),f(null),(async()=>{try{let y=await o(i,n,l.signal);if(h||l.signal.aborted)return;v(y)}catch(y){if(h||l.signal.aborted)return;f(N(y))}})(),()=>{h=!0,l.abort()}},[o,i,n,k]),m!==null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"failed",children:(0,w.jsx)(D,{failure:m,t:c,onRetry:()=>M(l=>l+1)})}):g===null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"loading",children:(0,w.jsx)(A,{t:c})}):(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"ready",children:(0,w.jsx)(e,{path:n,title:n,scope:{sessionId:i},customData:{bytes:g},t:B,readFile:o,visible:u})})}return t}var X="image",Y=E("image",R);

    return module.exports.default ?? module.exports;
  }
});
