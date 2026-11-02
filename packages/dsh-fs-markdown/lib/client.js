window.__ModuleLoader__.load({
  id: "dsh-fs-markdown",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var C=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var re=Object.prototype.hasOwnProperty;var ne=(e,r)=>{for(var n in r)C(e,n,{get:r[n],enumerable:!0})},te=(e,r,n,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of ee(r))!re.call(e,t)&&t!==n&&C(e,t,{get:()=>r[t],enumerable:!(o=X(r,t))||o.enumerable});return e};var oe=e=>te(C({},"__esModule",{value:!0}),e);var ce={};ne(ce,{MARKDOWN_RENDERER:()=>Y,apply:()=>Z,boot:()=>_,clientPlugin:()=>I,default:()=>me,inject:()=>V,loadMarkdownChunk:()=>x,markdownChunkRoute:()=>E});module.exports=oe(ce);var d=require("react");var l="dsh-fs-markdown",R="fs-markdown",M="client.markdown.js";function E(){return{chunk:M,id:`${l}/${M}`}}var q=null,p=null;function _(e){q=e}function x(){if(p!==null)return p;let e=q;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${l}: the loader require was not handed over`));let r=E(),n=e.async(`./${r.chunk}`).then(o=>{let t=o;if(t===null||typeof t.MarkdownView!="function"||t.renderer!=="markdown")throw new Error(`${l}: chunk ${r.id} is missing its Markdown view`);return t});return p=n,n.catch(()=>{p===n&&(p=null)}),n}var D={"md.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u6863\u2026","md.retry":"\u91CD\u8BD5","md.unavailable.title":"\u6587\u6863\u901A\u9053\u4E0D\u53EF\u7528","md.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u6574\u7BC7\u6587\u6863\u901A\u9053\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\u3002","md.error.too-large":"\u6587\u4EF6\u8D85\u8FC7 2 MiB\uFF0C\u8BF7\u7528\u6E90\u7801\u5206\u9875\u9605\u8BFB","md.error.not-text":"\u8FD9\u4E0D\u662F\u6587\u672C\u6587\u4EF6\uFF0C\u65E0\u6CD5\u6309\u6587\u6863\u8BFB\u53D6","md.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u7F3A\u5C11\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u65E0\u6CD5\u5B9A\u4F4D\u8FD9\u4E2A\u6587\u4EF6","md.error.no-session":"\u6CA1\u6709\u4F1A\u8BDD\u4E0A\u4E0B\u6587\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6","md.error.unknown":"\u65E0\u6CD5\u8BFB\u53D6\u6587\u6863","md.image":"\u56FE\u7247"},L={"md.loading":"Reading document\u2026","md.retry":"Retry","md.unavailable.title":"Document channel unavailable","md.unavailable.description":"This deployment does not expose the whole-document channel, so the file cannot be read.","md.error.too-large":"The file exceeds 2 MiB; read it in paged source view instead","md.error.not-text":"This is not a text file, so it cannot be read as a document","md.error.no-workspace":"The current session has no working directory","md.error.no-session":"There is no session context to read this file from","md.error.unknown":"The document could not be read","md.image":"image"};function h(e){let r=typeof e=="string"&&e.toLowerCase().startsWith("zh")?D:L;return n=>r[n]??n}function c(e){return e!==null&&typeof e=="object"}function K(e){try{return e()}catch{return}}function O(e){return c(e)?typeof e.open=="function":!1}function A(e){return()=>{let r=K(()=>c(e.remote)?e.remote.fsExplorerDocuments:void 0);if(O(r))return r;let n=K(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(O(n))return n}}function N(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid response"}}function $(e){let r=c(e)?e:{},n=typeof r.code=="string"&&r.code!==""?r.code:"io-error",o=typeof r.message=="string"?r.message:"";return{ok:!1,code:n,message:o}}function W(e){let r=c(e)?e:void 0;if(r===void 0)return N();if(r.ok===!1)return $(r.error);let n=r.ok===!0&&"value"in r?r.value:e,o=c(n)?n:void 0;if(o===void 0)return N();if(o.ok===!1)return $(o.error);let t=c(o.document)?o.document:typeof o.text=="string"?o:void 0;return t===void 0||typeof t.text!="string"?N():{ok:!0,text:t.text,...typeof t.bytes=="number"?{bytes:t.bytes}:{},...typeof t.version=="string"?{version:t.version}:{}}}function T(e){return e instanceof Error?e.message:typeof e=="string"?e:"the document request failed"}var a=require("react/jsx-runtime"),S={documents:()=>{},t:h(void 0)};function B(e){S=e}function ae(e,r,n){switch(e){case"too-large":return n("md.error.too-large");case"not-text":return n("md.error.not-text");case"no-workspace":return n("md.error.no-workspace");case"no-session":return n("md.error.no-session");case"invalid-response":return n("md.error.unknown");default:return r===""?n("md.error.unknown"):r}}function ie(e){let[r,n]=(0,d.useState)(null),[o,t]=(0,d.useState)(!1);return(0,d.useEffect)(()=>{if(!e||r!==null)return;let u=!0;return x().then(i=>{u&&n(i)},()=>{u&&t(!0)}),()=>{u=!1}},[e,r]),{chunk:r,failed:o}}function G({t:e}){return(0,a.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-loading",role:"status",children:[(0,a.jsx)("span",{className:"fmd-spinner","aria-hidden":"true"}),e("md.loading")]})}function de({t:e,onRetry:r}){return(0,a.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-unavailable",children:[(0,a.jsx)("strong",{children:e("md.unavailable.title")}),(0,a.jsx)("p",{children:e("md.unavailable.description")}),(0,a.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:r,children:e("md.retry")})]})}function se({code:e,message:r,t:n,onRetry:o}){return(0,a.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-error","data-code":e,children:[(0,a.jsx)("strong",{children:n("md.error.unknown")}),(0,a.jsx)("p",{children:ae(e,r,n)}),(0,a.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:o,children:n("md.retry")})]})}function H({path:e,sessionId:r,visible:n,mode:o}){let t=S.t,u=(0,d.useRef)(null),[i,s]=(0,d.useState)({status:"loading"}),[J,Q]=(0,d.useState)(0);(0,d.useEffect)(()=>{if(n===!1)return;let m=u.current;if(m!==null&&m.path===e&&m.sessionId===r){s({status:"ready",text:m.text});return}let F=S.documents();if(F===void 0){s({status:"unavailable"});return}if(r===void 0){s({status:"failed",code:"no-session",message:""});return}let P=new AbortController,k=!0;s({status:"loading"});try{let w=F.open({sessionId:r,path:e},P.signal);Promise.resolve(w).then(v=>{if(!k)return;let f=W(v);if(!f.ok){s({status:"failed",code:f.code,message:f.message});return}u.current={sessionId:r,path:e,text:f.text},s({status:"ready",text:f.text})},v=>{k&&s({status:"failed",code:"io-error",message:T(v)})})}catch(w){s({status:"failed",code:"io-error",message:T(w)})}return()=>{k=!1,P.abort()}},[e,n,r,J]);let z=()=>Q(m=>m+1),b=ie(o==="reading"&&i.status==="ready");return i.status==="loading"?(0,a.jsx)(G,{t}):i.status==="unavailable"?(0,a.jsx)(de,{t,onRetry:z}):i.status==="failed"?(0,a.jsx)(se,{code:i.code,message:i.message,t,onRetry:z}):o==="source"?(0,a.jsx)("pre",{className:"fmd-source","data-testid":"fs-md-source",children:i.text}):b.chunk!==null?(0,a.jsx)("div",{className:"fmd-read","data-testid":"fs-md-reading",children:(0,a.jsx)(b.chunk.MarkdownView,{text:i.text,imageLabel:t("md.image")})}):b.failed?(0,a.jsx)("pre",{className:"fmd-source","data-testid":"fs-md-source",children:i.text}):(0,a.jsx)(G,{t})}var j="dsh-fs-markdown-styles",le=`
.fmd-read {
  --fmd-font: var(--dsw-font-sans, inherit);
  --fmd-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* The pane owns the scroll container in reading mode; this box only fills it
     so the empty space below a short document stays part of the same surface. */
  min-height: 100%;
  box-sizing: border-box;
}
.fmd {
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px 24px 64px;
  color: var(--fmd-text);
  font-family: var(--fmd-font);
  font-size: 13px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}
.fmd > :first-child { margin-top: 0; }
.fmd h1, .fmd h2, .fmd h3, .fmd h4, .fmd h5, .fmd h6 {
  margin: 1.5em 0 .6em;
  line-height: 1.3;
  font-weight: 600;
}
.fmd h1 { font-size: 1.55em; padding-bottom: .3em; border-bottom: 1px solid var(--fmd-border); }
.fmd h2 { font-size: 1.3em; }
.fmd h3 { font-size: 1.12em; }
.fmd p { margin: .8em 0; }
.fmd ul, .fmd ol { margin: .8em 0; padding-left: 1.5em; }
.fmd li { margin: .25em 0; }
.fmd li > ul, .fmd li > ol { margin: .25em 0; }
.fmd a { color: var(--fmd-accent); text-decoration: none; }
.fmd a:hover { text-decoration: underline; }
.fmd code { font-family: var(--fmd-mono); font-size: .92em; }
.fmd :not(pre) > code {
  padding: 1px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 9%, transparent);
}
.fmd pre {
  overflow-x: auto;
  margin: 1em 0;
  padding: 10px 14px;
  border: 1px solid var(--fmd-border);
  border-radius: 8px;
  background: var(--fmd-panel);
  line-height: 1.55;
}
.fmd pre code { display: block; white-space: pre; }
.fmd blockquote {
  margin: 1em 0;
  padding: .2em 1em;
  border-left: 3px solid var(--fmd-border);
  color: var(--fmd-text-2);
}
.fmd hr { margin: 1.6em 0; border: 0; border-top: 1px solid var(--fmd-border); }
.fmd table { display: block; overflow-x: auto; margin: 1em 0; border-collapse: collapse; }
.fmd th, .fmd td { padding: 4px 10px; border: 1px solid var(--fmd-border); }
.fmd th { background: var(--fmd-panel); font-weight: 600; }
.fmd img { max-width: 100%; }
.fmd-img {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border: 1px solid var(--fmd-border);
  border-radius: 5px;
  color: var(--fmd-caption);
  font-family: var(--fmd-mono);
  font-size: 10.5px;
}
.fmd input[type="checkbox"] { margin-right: .45em; vertical-align: middle; }
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
`;function U(e=typeof document>"u"?void 0:document){if(e===void 0)return()=>{};if(e.getElementById(j)!==null)return()=>{};let r=e.createElement("style");return r.id=j,r.textContent=le,e.head.append(r),()=>{r.remove()}}var V=["fsExplorer","locale","remote"],Y={id:"markdown",label:"Markdown",match:{extensions:[".md",".markdown"]},priority:10,load:()=>Promise.resolve({Body:H,renderer:"markdown"})},g,y;function ue(e){let r=e.locale;if(r===void 0)return B({documents:A(e),t:h(void 0)}),()=>{};let n=()=>{};try{n=r.register(R,{zh:D,en:L})}catch{}return B({documents:A(e),t:r.bind(R)}),n}function Z(e){g?.(),g=void 0,y?.(),y=void 0;let r=e.fsExplorer;if(r===void 0)return e.logger?.warn?.(`${l}: fsExplorer service unavailable; the Markdown renderer was not registered`),()=>{};let n=U(),o=ue(e);y=o;let t=r.registerRenderer(Y);return g=t,()=>{t(),g===t&&(g=void 0),o(),y===o&&(y=void 0),n()}}var I={name:l,inject:V,apply:Z};var me=I;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
