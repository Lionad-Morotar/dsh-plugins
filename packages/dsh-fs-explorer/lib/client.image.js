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
"use strict";var b=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var O=(r,e)=>{for(var t in e)b(r,t,{get:e[t],enumerable:!0})},V=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of I(e))!B.call(r,n)&&n!==t&&b(r,n,{get:()=>e[n],enumerable:!(o=j(e,n))||o.enumerable});return r};var U=r=>V(b({},"__esModule",{value:!0}),r);var Z={};O(Z,{FamilyView:()=>Y,renderer:()=>q});module.exports=U(Z);var s=require("react");var W=new Map([["png","image/png"],["jpg","image/jpeg"],["jpeg","image/jpeg"],["gif","image/gif"],["webp","image/webp"],["bmp","image/bmp"],["ico","image/x-icon"],["svg","image/svg+xml"]]);function z(r){let e=r.slice(r.lastIndexOf("/")+1),t=e.lastIndexOf(".");return t<=0?null:e.slice(t+1).toLowerCase()}function F(r){let e=z(r);return e===null?null:W.get(e)??null}var a=require("react/jsx-runtime");function G(r){let{bytes:e,path:t,t:o,onSettled:n}=r,[i,c]=(0,s.useState)({kind:"loading"}),[u,y]=(0,s.useState)(0),v=(0,s.useRef)(n);v.current=n;let m=(0,s.useMemo)(()=>F(t),[t]),f=(0,s.useMemo)(()=>m===null?null:URL.createObjectURL(new Blob([e],{type:m})),[m,e,u]);return(0,s.useEffect)(()=>()=>{f!==null&&URL.revokeObjectURL(f)},[f]),(0,s.useEffect)(()=>{m===null&&(c({kind:"failed",message:o("state.unsupported")}),v.current?.(!1,u))},[m,u,o]),i.kind==="failed"?(0,a.jsxs)("div",{className:"preview-more-status",role:"alert","data-testid":"preview-more-image-failed",children:[(0,a.jsx)("p",{children:o("state.failed")}),(0,a.jsx)("p",{className:"preview-more-detail",children:i.message}),(0,a.jsx)("button",{type:"button",className:"preview-more-action",onClick:()=>{c({kind:"loading"}),y(k=>k+1)},children:o("state.retry")})]}):f===null?(0,a.jsx)("p",{className:"preview-more-status",children:o("state.loading")}):(0,a.jsx)("div",{className:"preview-more-image-surface","data-testid":"preview-more-image",children:(0,a.jsx)("img",{className:"preview-more-image",src:f,alt:o("image.title"),onLoad:()=>{v.current?.(!0,u)},onError:()=>{c({kind:"failed",message:o("state.unsupported")}),v.current?.(!1,u)}},u)})}function T(r){let{t:e,customData:t,path:o}=r,n=t?.bytes,i=t?.path??o;return n===void 0?(0,a.jsx)("p",{className:"preview-more-status",children:e("state.loading")}):(0,a.jsx)(G,{bytes:n,path:i,t:e})}var p=require("react");var P="dsh-preview-more",H=`
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
`;function S(r){let e=`style[data-plugin-css="${P}"]`;if(r.querySelector(e)!==null)return R(r,!1);let t=r.createElement("style");t.dataset.pluginCss=P,t.textContent=H,r.head.append(t);let n=r.querySelectorAll(e)[0]??null,i=n!==t&&n!==null;return i&&t.remove(),R(r,!i)}var x=new WeakMap;function R(r,e){let t=x.get(r)??{count:0,tag:null};t.count+=1,e&&(t.tag=r.querySelector(`style[data-plugin-css="${P}"]`)),x.set(r,t);let o=!1;return()=>{o||(o=!0,t.count-=1,!(t.count>0)&&(x.delete(r),t.tag?.remove()))}}var _="preview.surface.";function L(r){return e=>r(_+e)}function $(r){return r!==null&&typeof r=="object"}function C(r){let e=$(r)?r:{},t=typeof e.code=="string"?e.code:"",o=typeof e.detail=="string"?e.detail:"",n=typeof e.message=="string"&&e.message!==""?e.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${o} ${n}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:n}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:n}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:n}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:n}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:n}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:n}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:n}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:n}:i.includes("unavailable")?{kind:"unavailable",code:t,message:n}:{kind:"unknown",code:t,message:n}}var we=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});var d=require("react/jsx-runtime");function K(r,e){switch(r.kind){case"deleted":return e("preview.deleted.title");case"denied":return e("preview.denied.title");case"symlink":return e("preview.symlink.title");case"binary":return e("preview.binary.title");case"commit-binary":return e("preview.commitBinary.title");case"submodule":return e("preview.submodule.title");case"too-large":return e("preview.tooLarge.title");case"unavailable":return e("preview.unavailable.title");default:return e("preview.unknown.title")}}function X(r,e){switch(r.kind){case"deleted":return e("preview.deleted.description");case"denied":return e("preview.denied.description");case"symlink":return e("preview.symlink.description");case"binary":return e("preview.binary.description");case"commit-binary":return e("preview.commitBinary.description");case"submodule":return e("preview.submodule.description");case"too-large":return e("preview.tooLarge.description");case"unavailable":return e("preview.unavailable.description");default:return e("preview.unknown.description")}}function N({failure:r,t:e,onRetry:t}){return(0,d.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":r.kind,children:[(0,d.jsx)("strong",{children:K(r,e)}),(0,d.jsx)("span",{children:X(r,e)}),r.message===""?null:(0,d.jsx)("code",{className:"fx-preview-hint",children:r.message}),(0,d.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:e("preview.retry")})]})}function E({t:r}){return(0,d.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,d.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]})}var w=require("react/jsx-runtime");function M(r,e){function t({path:o,sessionId:n,readFile:i,t:c,visible:u=!0}){let[y,v]=(0,p.useState)(null),[m,f]=(0,p.useState)(null),[k,A]=(0,p.useState)(0),D=(0,p.useMemo)(()=>L(c),[c]);return(0,p.useEffect)(()=>{let l=globalThis.document;if(l===void 0)return;let g=S(l);return()=>g()},[]),(0,p.useEffect)(()=>{let l=new AbortController,g=!1;return v(null),f(null),(async()=>{try{let h=await i(n,o,l.signal);if(g||l.signal.aborted)return;v(h)}catch(h){if(g||l.signal.aborted)return;f(C(h))}})(),()=>{g=!0,l.abort()}},[i,n,o,k]),m!==null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"failed",children:(0,w.jsx)(N,{failure:m,t:c,onRetry:()=>A(l=>l+1)})}):y===null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"loading",children:(0,w.jsx)(E,{t:c})}):(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":r,"data-state":"ready",children:(0,w.jsx)(e,{path:o,title:o,scope:{sessionId:n},customData:{bytes:y},t:D,readFile:i,visible:u})})}return t}var q="image",Y=M("image",T);

    return module.exports.default ?? module.exports;
  }
});
