window.__ModuleLoader__.load({
  id: "dsh-fs-markdown",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var E=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var W=Object.getOwnPropertyNames;var j=Object.prototype.hasOwnProperty;var Y=(e,r)=>{for(var t in r)E(e,t,{get:r[t],enumerable:!0})},Z=(e,r,t,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of W(r))!j.call(e,n)&&n!==t&&E(e,n,{get:()=>r[n],enumerable:!(i=U(r,n))||i.enumerable});return e};var J=e=>Z(E({},"__esModule",{value:!0}),e);var ne={};Y(ne,{MARKDOWN_RENDERER:()=>K,apply:()=>$,boot:()=>N,clientPlugin:()=>O,default:()=>oe,editorChunkRoute:()=>S,inject:()=>_,loadEditorChunk:()=>x});module.exports=J(ne);var a=require("react");var m="dsh-fs-markdown",C="fs-markdown",R="client.editor.js";function S(){return{chunk:R,id:`${m}/${R}`}}var L=null,p=null;function N(e){L=e}function x(){if(p!==null)return p;let e=L;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${m}: the loader require was not handed over`));let r=S(),t=e.async(`./${r.chunk}`).then(i=>{let n=i;if(n===null||typeof n.EditorBody!="function"||n.renderer!=="codemirror")throw new Error(`${m}: chunk ${r.id} is missing its editor body`);return n});return p=t,t.catch(()=>{p===t&&(p=null)}),t}var M={"md.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u6863\u2026","md.retry":"\u91CD\u8BD5","md.unavailable.title":"\u6587\u6863\u901A\u9053\u4E0D\u53EF\u7528","md.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u6574\u7BC7\u6587\u6863\u901A\u9053\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\u3002","md.error.too-large":"\u6587\u4EF6\u8D85\u8FC7 2 MiB\uFF0C\u8BF7\u7528\u6E90\u7801\u5206\u9875\u9605\u8BFB","md.error.not-text":"\u8FD9\u4E0D\u662F\u6587\u672C\u6587\u4EF6\uFF0C\u65E0\u6CD5\u6309\u6587\u6863\u8BFB\u53D6","md.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u7F3A\u5C11\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u65E0\u6CD5\u5B9A\u4F4D\u8FD9\u4E2A\u6587\u4EF6","md.error.no-session":"\u6CA1\u6709\u4F1A\u8BDD\u4E0A\u4E0B\u6587\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6","md.error.unknown":"\u65E0\u6CD5\u8BFB\u53D6\u6587\u6863","md.image":"\u56FE\u7247"},T={"md.loading":"Reading document\u2026","md.retry":"Retry","md.unavailable.title":"Document channel unavailable","md.unavailable.description":"This deployment does not expose the whole-document channel, so the file cannot be read.","md.error.too-large":"The file exceeds 2 MiB; read it in paged source view instead","md.error.not-text":"This is not a text file, so it cannot be read as a document","md.error.no-workspace":"The current session has no working directory","md.error.no-session":"There is no session context to read this file from","md.error.unknown":"The document could not be read","md.image":"image"};function v(e){let r=typeof e=="string"&&e.toLowerCase().startsWith("zh")?M:T;return t=>r[t]??t}var o=require("react/jsx-runtime"),A={documents:()=>{},t:v(void 0)};function D(e){A=e}function Q(e,r,t){switch(e){case"too-large":return t("md.error.too-large");case"not-text":return t("md.error.not-text");case"no-workspace":return t("md.error.no-workspace");case"no-session":return t("md.error.no-session");case"invalid-response":return t("md.error.unknown");default:return r===""?t("md.error.unknown"):r}}function V(e){let[r,t]=(0,a.useState)(null),[i,n]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{if(!e||r!==null)return;let l=!0;return x().then(s=>{l&&t(s)},()=>{l&&n(!0)}),()=>{l=!1}},[e,r]),{chunk:r,failed:i}}function B({t:e}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-loading",role:"status",children:[(0,o.jsx)("span",{className:"fmd-spinner","aria-hidden":"true"}),e("md.loading")]})}function X({t:e,onRetry:r}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-unavailable",children:[(0,o.jsx)("strong",{children:e("md.unavailable.title")}),(0,o.jsx)("p",{children:e("md.unavailable.description")}),(0,o.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:r,children:e("md.retry")})]})}function F({code:e,message:r,t,onRetry:i}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-error","data-code":e,children:[(0,o.jsx)("strong",{children:t("md.error.unknown")}),(0,o.jsx)("p",{children:Q(e,r,t)}),(0,o.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:i,children:t("md.retry")})]})}function z(e){let{path:r,sessionId:t,visible:i,mode:n}=e,l=A.t,[s,y]=(0,a.useState)({status:"pending"}),[d,b]=(0,a.useState)(null),[I,H]=(0,a.useState)(0),f=(0,a.useRef)(null);(0,a.useEffect)(()=>{if(y({status:"pending"}),b(null),f.current=null,t===void 0){y({status:"failed",code:"no-session",message:""});return}let c=A.documents();if(c===void 0){y({status:"missing"});return}let u=c.acquire(t,r);f.current=u,y({status:"session",session:u}),b(u.getSnapshot());let G=u.subscribe(()=>b(u.getSnapshot()));return()=>{G(),u.dispose(),f.current===u&&(f.current=null)}},[r,t,I]),(0,a.useEffect)(()=>{i!==!1&&s.status==="session"&&(d===null||d.status!=="idle"||s.session.reload())},[s,d,i]);let k=()=>{let c=f.current;if(c!==null){c.reload();return}H(u=>u+1)},w=V(s.status==="session"&&d?.status==="ready");if(s.status==="failed")return(0,o.jsx)(F,{code:s.code,message:s.message,t:l,onRetry:k});if(s.status==="missing")return(0,o.jsx)(X,{t:l,onRetry:k});if(s.status!=="session")return(0,o.jsx)(B,{t:l});if(d===null||d.status==="idle"||d.status==="loading")return(0,o.jsx)(B,{t:l});if(d.status==="failed"){let c=d.error??{code:"io-error",message:""};return(0,o.jsx)(F,{code:c.code,message:c.message,t:l,onRetry:k})}return w.chunk!==null?(0,o.jsx)("div",{className:n==="source"?"fmd-source-editor":"fmd-read","data-testid":n==="source"?"fs-md-source":"fs-md-reading","data-renderer":"codemirror",children:(0,o.jsx)(w.chunk.EditorBody,{...e,text:d.text,onChange:c=>s.session.setDraft(c)})}):w.failed?(0,o.jsx)("pre",{className:"fmd-source","data-testid":"fs-md-source",children:d.text}):(0,o.jsx)(B,{t:l})}var P="dsh-fs-markdown-styles",ee=`
.fmd-read,
.fmd-source-editor {
  --fmd-font: var(--dsw-font-sans, inherit);
  --fmd-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* The pane owns the scroll container; this box only fills it so the empty
     space below a short document stays part of the same surface. */
  min-height: 100%;
  box-sizing: border-box;
}
.fmd-editor { height: 100%; min-height: 100%; }
.fmd-editor .cm-editor {
  height: 100%;
  background: transparent;
  color: var(--fmd-text);
}
.fmd-editor .cm-scroller {
  overflow: auto;
  overscroll-behavior: contain;
  padding: 18px 24px 64px;
  font-family: var(--fmd-font);
  font-size: 13px;
  line-height: 1.72;
  scrollbar-width: thin;
}
.fmd-editor .cm-content {
  box-sizing: border-box;
  width: 100%;
  max-width: 72ch;
  margin: 0 auto;
  padding: 0;
  caret-color: var(--fmd-text);
}
.fmd-editor .cm-line { padding: 0; }
.fmd-editor .cm-cursor { border-left-color: var(--fmd-text); }
.fmd-editor .cm-selectionBackground,
.fmd-editor .cm-focused .cm-selectionBackground {
  background: color-mix(in srgb, var(--fmd-accent) 22%, transparent);
}
.fmd-source-editor .cm-scroller { font-family: var(--fmd-mono); font-size: 12px; line-height: 1.55; }
.fmd-h1, .fmd-h2, .fmd-h3, .fmd-h4, .fmd-h5, .fmd-h6 {
  font-weight: 600;
  line-height: 1.3;
}
.fmd-h1 { font-size: 1.55em; }
.fmd-h2 { font-size: 1.3em; }
.fmd-h3 { font-size: 1.12em; }
.fmd-h4, .fmd-h5, .fmd-h6 { font-size: 1em; }
.fmd-strong { font-weight: 600; }
.fmd-em { font-style: italic; }
.fmd-code {
  padding: 1px 4px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font-family: var(--fmd-mono);
  font-size: .92em;
}
.fmd-link { color: var(--fmd-accent); text-decoration: none; }
.fmd-link:hover { text-decoration: underline; }
.fmd-quote { color: var(--fmd-text-2); font-style: italic; }
.fmd-list-marker { color: var(--fmd-accent); font-family: var(--fmd-mono); }
.fmd-code-block {
  background: var(--fmd-panel);
  font-family: var(--fmd-mono);
  font-size: .94em;
}
.fmd-source {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 12px 16px 48px;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--fmd-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 12px;
  line-height: 1.55;
  white-space: pre;
  tab-size: 4;
}
.fmd-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 18px 24px;
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 12px;
}
.fmd-state[role="status"] { flex-direction: row; align-items: center; gap: 8px; }
.fmd-spinner {
  flex: none;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: .7;
  animation: fmd-spin .8s linear infinite;
}
@keyframes fmd-spin { to { transform: rotate(360deg); } }
.fmd-state strong { color: var(--dsw-alias-label-primary, inherit); font-size: 13px; font-weight: 600; }
.fmd-state p { margin: 0; max-width: 56ch; line-height: 1.6; }
.fmd-retry {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 20%, transparent));
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.fmd-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.fmd-retry:focus-visible { outline: 2px solid var(--fmd-accent, currentColor); outline-offset: -2px; }
`;function q(e=typeof document>"u"?void 0:document){if(e===void 0)return()=>{};if(e.getElementById(P)!==null)return()=>{};let r=e.createElement("style");return r.id=P,r.textContent=ee,e.head.append(r),()=>{r.remove()}}var _=["fsExplorer","locale","remote"],K={id:"markdown",label:"Markdown",match:{extensions:[".md",".markdown"]},priority:10,load:()=>Promise.resolve({Body:z,renderer:"markdown"})},g,h;function re(e){return()=>{try{return e.fsExplorer?.documents}catch{return}}}function te(e){let r=re(e);if(e.locale===void 0)return D({documents:r,t:v(void 0)}),()=>{};let t=()=>{};try{t=e.locale.register(C,{zh:M,en:T})}catch{}return D({documents:r,t:e.locale.bind(C)}),t}function $(e){g?.(),g=void 0,h?.(),h=void 0;let r=e.fsExplorer;if(r===void 0)return e.logger?.warn?.(`${m}: fsExplorer service unavailable; the Markdown renderer was not registered`),()=>{};let t=q(),i=te(e);h=i;let n=r.registerRenderer(K);return g=n,()=>{n(),g===n&&(g=void 0),i(),h===i&&(h=void 0),t()}}var O={name:m,inject:_,apply:$};var oe=O;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
