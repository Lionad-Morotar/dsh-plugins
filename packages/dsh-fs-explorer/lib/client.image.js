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
"use strict";var b=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var O=Object.prototype.hasOwnProperty;var V=(t,e)=>{for(var r in e)b(t,r,{get:e[r],enumerable:!0})},D=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of B(e))!O.call(t,n)&&n!==r&&b(t,n,{get:()=>e[n],enumerable:!(o=I(e,n))||o.enumerable});return t};var U=t=>D(b({},"__esModule",{value:!0}),t);var Z={};V(Z,{FamilyView:()=>Y,renderer:()=>q});module.exports=U(Z);var s=require("react");var W=new Map([["png","image/png"],["jpg","image/jpeg"],["jpeg","image/jpeg"],["gif","image/gif"],["webp","image/webp"],["bmp","image/bmp"],["ico","image/x-icon"],["svg","image/svg+xml"]]);function z(t){let e=t.slice(t.lastIndexOf("/")+1),r=e.lastIndexOf(".");return r<=0?null:e.slice(r+1).toLowerCase()}function F(t){let e=z(t);return e===null?null:W.get(e)??null}var a=require("react/jsx-runtime");function G(t){let{bytes:e,path:r,t:o,onSettled:n}=t,[i,c]=(0,s.useState)({kind:"loading"}),[u,g]=(0,s.useState)(0),v=(0,s.useRef)(n);v.current=n;let m=(0,s.useMemo)(()=>F(r),[r]),f=(0,s.useMemo)(()=>m===null?null:URL.createObjectURL(new Blob([e],{type:m})),[m,e,u]);return(0,s.useEffect)(()=>()=>{f!==null&&URL.revokeObjectURL(f)},[f]),(0,s.useEffect)(()=>{m===null&&(c({kind:"failed",message:o("state.unsupported")}),v.current?.(!1,u))},[m,u,o]),i.kind==="failed"?(0,a.jsxs)("div",{className:"preview-more-status",role:"alert","data-testid":"preview-more-image-failed",children:[(0,a.jsx)("p",{children:o("state.failed")}),(0,a.jsx)("p",{className:"preview-more-detail",children:i.message}),(0,a.jsx)("button",{type:"button",className:"preview-more-action",onClick:()=>{c({kind:"loading"}),g(k=>k+1)},children:o("state.retry")})]}):f===null?(0,a.jsx)("p",{className:"preview-more-status",children:o("state.loading")}):(0,a.jsx)("div",{className:"preview-more-image-surface","data-testid":"preview-more-image",children:(0,a.jsx)("img",{className:"preview-more-image",src:f,alt:o("image.title"),onLoad:()=>{v.current?.(!0,u)},onError:()=>{c({kind:"failed",message:o("state.unsupported")}),v.current?.(!1,u)}},u)})}function T(t){let{t:e,customData:r,path:o}=t,n=r?.bytes,i=r?.path??o;return n===void 0?(0,a.jsx)("p",{className:"preview-more-status",children:e("state.loading")}):(0,a.jsx)(G,{bytes:n,path:i,t:e})}var p=require("react");var P="dsh-preview-more",H=`
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
`;function S(t){let e=`style[data-plugin-css="${P}"]`;if(t.querySelector(e)!==null)return R(t,!1);let r=t.createElement("style");r.dataset.pluginCss=P,r.textContent=H,t.head.append(r);let n=t.querySelectorAll(e)[0]??null,i=n!==r&&n!==null;return i&&r.remove(),R(t,!i)}var x=new WeakMap;function R(t,e){let r=x.get(t)??{count:0,tag:null};r.count+=1,e&&(r.tag=t.querySelector(`style[data-plugin-css="${P}"]`)),x.set(t,r);let o=!1;return()=>{o||(o=!0,r.count-=1,!(r.count>0)&&(x.delete(t),r.tag?.remove()))}}var _="preview.surface.";function L(t){return e=>t(_+e)}function $(t){return t!==null&&typeof t=="object"}function C(t){let e=$(t)?t:{},r=typeof e.code=="string"?e.code:"",o=typeof e.detail=="string"?e.detail:"",n=typeof e.message=="string"&&e.message!==""?e.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${r} ${o} ${n}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:r,message:n}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:r,message:n}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:r,message:n}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:r,message:n}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:r,message:n}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:r,message:n}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:r,message:n}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:r,message:n}:i.includes("unavailable")?{kind:"unavailable",code:r,message:n}:{kind:"unknown",code:r,message:n}}var we=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});var d=require("react/jsx-runtime");function K(t,e){switch(t.kind){case"deleted":return e("preview.deleted.title");case"denied":return e("preview.denied.title");case"symlink":return e("preview.symlink.title");case"binary":return e("preview.binary.title");case"commit-binary":return e("preview.commitBinary.title");case"submodule":return e("preview.submodule.title");case"too-large":return e("preview.tooLarge.title");case"unavailable":return e("preview.unavailable.title");default:return e("preview.unknown.title")}}function X(t,e){switch(t.kind){case"deleted":return e("preview.deleted.description");case"denied":return e("preview.denied.description");case"symlink":return e("preview.symlink.description");case"binary":return e("preview.binary.description");case"commit-binary":return e("preview.commitBinary.description");case"submodule":return e("preview.submodule.description");case"too-large":return e("preview.tooLarge.description");case"unavailable":return e("preview.unavailable.description");default:return e("preview.unknown.description")}}function N({failure:t,t:e,onRetry:r}){return(0,d.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":t.kind,children:[(0,d.jsx)("strong",{children:K(t,e)}),(0,d.jsx)("span",{children:X(t,e)}),t.message===""?null:(0,d.jsx)("code",{className:"fx-preview-hint",children:t.message}),(0,d.jsx)("button",{type:"button",className:"fx-btn",onClick:r,"data-testid":"fs-preview-retry",children:e("preview.retry")})]})}function E({t}){return(0,d.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,d.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("preview.loading")]})}var w=require("react/jsx-runtime");function M(t,e){function r({path:o,sessionId:n,readFile:i,t:c,visible:u=!0}){let[g,v]=(0,p.useState)(null),[m,f]=(0,p.useState)(null),[k,A]=(0,p.useState)(0),j=(0,p.useMemo)(()=>L(c),[c]);return(0,p.useEffect)(()=>{let l=globalThis.document;if(l===void 0)return;let y=S(l);return()=>y()},[]),(0,p.useEffect)(()=>{let l=new AbortController,y=!1;return v(null),f(null),(async()=>{try{let h=await i(n,o,l.signal);if(y||l.signal.aborted)return;v(h)}catch(h){if(y||l.signal.aborted)return;f(C(h))}})(),()=>{y=!0,l.abort()}},[i,n,o,k]),m!==null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":t,"data-state":"failed",children:(0,w.jsx)(N,{failure:m,t:c,onRetry:()=>A(l=>l+1)})}):g===null?(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":t,"data-state":"loading",children:(0,w.jsx)(E,{t:c})}):(0,w.jsx)("div",{className:"fx-family","data-testid":"fs-preview-family","data-family":t,"data-state":"ready",children:(0,w.jsx)(e,{path:o,title:o,scope:{sessionId:n},customData:{bytes:g},t:j,readFile:i,visible:u})})}return r}var q="image",Y=M("image",T);

    return module.exports.default ?? module.exports;
  }
});
