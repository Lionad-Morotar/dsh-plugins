window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  chunk: "client.image.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
/*! dsh-fs-explorer | MIT
 * Bundles third-party code through dsh-preview-viewers: three.js and utif (MIT),
 * dxf-viewer (MPL-2.0), Google Draco (Apache-2.0).
 * Full license texts: see THIRD-PARTY-NOTICES.md in this package.
 */
"use strict";var f=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var V=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var D=(r,e)=>{for(var t in e)f(r,t,{get:e[t],enumerable:!0})},O=(r,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of V(e))!B.call(r,o)&&o!==t&&f(r,o,{get:()=>e[o],enumerable:!(a=M(e,o))||a.enumerable});return r};var I=r=>O(f({},"__esModule",{value:!0}),r);var $={};D($,{FamilyView:()=>H,marker:()=>L,renderer:()=>C});module.exports=I($);var l=require("react");var w="dsh-preview-more",z=`
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
`;function x(r){let e=`style[data-plugin-css="${w}"]`;if(r.querySelector(e)!==null)return b(r,!1);let t=r.createElement("style");t.dataset.pluginCss=w,t.textContent=z,r.head.append(t);let o=r.querySelectorAll(e)[0]??null,i=o!==t&&o!==null;return i&&t.remove(),b(r,!i)}var v=new WeakMap;function b(r,e){let t=v.get(r)??{count:0,tag:null};t.count+=1,e&&(t.tag=r.querySelector(`style[data-plugin-css="${w}"]`)),v.set(r,t);let a=!1;return()=>{a||(a=!0,t.count-=1,!(t.count>0)&&(v.delete(r),t.tag?.remove()))}}var W="preview.surface.";function P(r){return e=>r(W+e)}function G(r){return r!==null&&typeof r=="object"}function F(r){let e=G(r)?r:{},t=typeof e.code=="string"?e.code:"",a=typeof e.detail=="string"?e.detail:"",o=typeof e.message=="string"&&e.message!==""?e.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${a} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var re=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});var s=require("react/jsx-runtime");function U(r,e){switch(r.kind){case"deleted":return e("preview.deleted.title");case"denied":return e("preview.denied.title");case"symlink":return e("preview.symlink.title");case"binary":return e("preview.binary.title");case"commit-binary":return e("preview.commitBinary.title");case"submodule":return e("preview.submodule.title");case"too-large":return e("preview.tooLarge.title");case"unavailable":return e("preview.unavailable.title");default:return e("preview.unknown.title")}}function _(r,e){switch(r.kind){case"deleted":return e("preview.deleted.description");case"denied":return e("preview.denied.description");case"symlink":return e("preview.symlink.description");case"binary":return e("preview.binary.description");case"commit-binary":return e("preview.commitBinary.description");case"submodule":return e("preview.submodule.description");case"too-large":return e("preview.tooLarge.description");case"unavailable":return e("preview.unavailable.description");default:return e("preview.unknown.description")}}function T({failure:r,t:e,onRetry:t}){return(0,s.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":r.kind,children:[(0,s.jsx)("strong",{children:U(r,e)}),(0,s.jsx)("span",{children:_(r,e)}),r.message===""?null:(0,s.jsx)("code",{className:"fx-preview-hint",children:r.message}),(0,s.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:e("preview.retry")})]})}function S({t:r}){return(0,s.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,s.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]})}var d=require("react/jsx-runtime");function R(r,e){function t({path:a,sessionId:o,readFile:i,t:m,visible:N=!0}){let[y,k]=(0,l.useState)(null),[g,h]=(0,l.useState)(null),[E,j]=(0,l.useState)(0),A=(0,l.useMemo)(()=>P(m),[m]);return(0,l.useEffect)(()=>{let n=globalThis.document;if(n===void 0)return;let p=x(n);return()=>p()},[]),(0,l.useEffect)(()=>{let n=new AbortController,p=!1;return k(null),h(null),(async()=>{try{let u=await i(o,a,n.signal);if(p||n.signal.aborted)return;k(u)}catch(u){if(p||n.signal.aborted)return;h(F(u))}})(),()=>{p=!0,n.abort()}},[i,o,a,E]),g!==null?(0,d.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"failed",children:(0,d.jsx)(T,{failure:g,t:m,onRetry:()=>j(n=>n+1)})}):y===null?(0,d.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"loading",children:(0,d.jsx)(S,{t:m})}):(0,d.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"ready",children:(0,d.jsx)(e,{path:a,title:a,scope:{sessionId:o},customData:{bytes:y},t:A,readFile:i,visible:N})})}return t}var c=require("react/jsx-runtime"),C="image",L="createObjectURL";function K(r){return(0,c.jsxs)("div",{className:"fx-family-pending","data-testid":"fs-preview-pending","data-family":C,children:[(0,c.jsx)("p",{children:"\u8BE5\u7C7B\u9884\u89C8\u5C1A\u672A\u63A5\u5165"}),(0,c.jsx)("p",{children:L})]})}var H=R("image",K);

    return module.exports.default ?? module.exports;
  }
});
