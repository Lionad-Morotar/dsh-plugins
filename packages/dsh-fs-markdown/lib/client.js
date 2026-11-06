window.__ModuleLoader__.load({
  id: "dsh-fs-markdown",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var T=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var ne=Object.prototype.hasOwnProperty;var se=(e,t)=>{for(var r in t)T(e,r,{get:t[r],enumerable:!0})},ae=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of oe(t))!ne.call(e,n)&&n!==r&&T(e,n,{get:()=>t[n],enumerable:!(s=re(t,n))||s.enumerable});return e};var ie=e=>ae(T({},"__esModule",{value:!0}),e);var ye={};se(ye,{MARKDOWN_RENDERER:()=>Y,TEXT_RENDERER:()=>Z,apply:()=>J,boot:()=>q,clientPlugin:()=>Q,default:()=>ge,editorChunkRoute:()=>M,inject:()=>W,loadEditorChunk:()=>v});module.exports=ie(ye);var i=require("react");var u="dsh-fs-markdown",S="fs-markdown",B="client.editor.js";function M(){return{chunk:B,id:`${u}/${B}`}}var P=null,h=null;function q(e){P=e}function v(){if(h!==null)return h;let e=P;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${u}: the loader require was not handed over`));let t=M(),r=e.async(`./${t.chunk}`).then(s=>{let n=s;if(n===null||typeof n.EditorBody!="function"||n.renderer!=="codemirror")throw new Error(`${u}: chunk ${t.id} is missing its editor body`);return n});return h=r,r.catch(()=>{h===r&&(h=null)}),r}var F={"md.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u6863\u2026","md.retry":"\u91CD\u8BD5","md.unavailable.title":"\u6587\u6863\u901A\u9053\u4E0D\u53EF\u7528","md.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u6574\u7BC7\u6587\u6863\u901A\u9053\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\u3002","md.error.too-large":"\u6587\u4EF6\u8D85\u8FC7 2 MiB\uFF0C\u8BF7\u7528\u6E90\u7801\u5206\u9875\u9605\u8BFB","md.error.not-text":"\u8FD9\u4E0D\u662F\u6587\u672C\u6587\u4EF6\uFF0C\u65E0\u6CD5\u6309\u6587\u6863\u8BFB\u53D6","md.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u7F3A\u5C11\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u65E0\u6CD5\u5B9A\u4F4D\u8FD9\u4E2A\u6587\u4EF6","md.error.no-session":"\u6CA1\u6709\u4F1A\u8BDD\u4E0A\u4E0B\u6587\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6","md.error.unknown":"\u65E0\u6CD5\u8BFB\u53D6\u6587\u6863","md.readonly.note":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u4FDD\u5B58\u901A\u9053\uFF0C\u53EA\u80FD\u53EA\u8BFB\u9605\u8BFB","md.image":"\u56FE\u7247"},z={"md.loading":"Reading document\u2026","md.retry":"Retry","md.unavailable.title":"Document channel unavailable","md.unavailable.description":"This deployment does not expose the whole-document channel, so the file cannot be read.","md.error.too-large":"The file exceeds 2 MiB; read it in paged source view instead","md.error.not-text":"This is not a text file, so it cannot be read as a document","md.error.no-workspace":"The current session has no working directory","md.error.no-session":"There is no session context to read this file from","md.error.unknown":"The document could not be read","md.readonly.note":"This deployment has no save channel, so the file is read-only","md.image":"image"};function w(e){let t=typeof e=="string"&&e.toLowerCase().startsWith("zh")?F:z;return r=>t[r]??r}var o=require("react/jsx-runtime"),D={documents:()=>{},t:w(void 0)};function A(e){D=e}function de(e,t,r){switch(e){case"too-large":return r("md.error.too-large");case"not-text":return r("md.error.not-text");case"no-workspace":return r("md.error.no-workspace");case"no-session":return r("md.error.no-session");case"invalid-response":return r("md.error.unknown");default:return t===""?r("md.error.unknown"):t}}function le(e){let[t,r]=(0,i.useState)(null),[s,n]=(0,i.useState)(!1);return(0,i.useEffect)(()=>{if(!e||t!==null)return;let c=!0;return v().then(x=>{c&&r(x)},()=>{c&&n(!0)}),()=>{c=!1}},[e,t]),{chunk:t,failed:s}}function N({t:e}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-loading",role:"status",children:[(0,o.jsx)("span",{className:"fmd-spinner","aria-hidden":"true"}),e("md.loading")]})}function ce({t:e,onRetry:t}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-unavailable",children:[(0,o.jsx)("strong",{children:e("md.unavailable.title")}),(0,o.jsx)("p",{children:e("md.unavailable.description")}),(0,o.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:t,children:e("md.retry")})]})}function _({code:e,message:t,t:r,onRetry:s}){return(0,o.jsxs)("div",{className:"fmd-state","data-testid":"fs-md-error","data-code":e,children:[(0,o.jsx)("strong",{children:r("md.error.unknown")}),(0,o.jsx)("p",{children:de(e,t,r)}),(0,o.jsx)("button",{type:"button",className:"fmd-retry","data-testid":"fs-md-retry",onClick:s,children:r("md.retry")})]})}function j(e){return e.status!=="ready"?!1:e.saving!==void 0}function fe({text:e,testId:t,t:r}){return(0,o.jsxs)("div",{className:"fmd-readonly","data-testid":"fs-md-readonly",children:[(0,o.jsx)("p",{className:"fmd-readonly-note","data-testid":"fs-md-readonly-note",children:r("md.readonly.note")}),(0,o.jsx)("pre",{className:"fmd-source","data-testid":t,children:e})]})}function O(e){let{decorate:t,testId:r,fallbackTestId:s}=e;function n(c){let{path:x,sessionId:k,visible:L,mode:I}=c,m=D.t,[d,b]=(0,i.useState)({status:"pending"}),[a,E]=(0,i.useState)(null),[V,ee]=(0,i.useState)(0),p=(0,i.useRef)(null);(0,i.useEffect)(()=>{if(b({status:"pending"}),E(null),p.current=null,k===void 0){b({status:"failed",code:"no-session",message:""});return}let f=D.documents();if(f===void 0){b({status:"missing"});return}let l=f.acquire(k,x);p.current=l,b({status:"session",session:l}),E(l.getSnapshot());let te=l.subscribe(()=>E(l.getSnapshot()));return()=>{te(),l.dispose(),p.current===l&&(p.current=null)}},[x,k,V]),(0,i.useEffect)(()=>{L!==!1&&d.status==="session"&&(a===null||a.status!=="idle"||d.session.reload())},[d,a,L]);let C=()=>{let f=p.current;if(f!==null){f.reload();return}ee(l=>l+1)},R=le(d.status==="session"&&a?.status==="ready");if(d.status==="failed")return(0,o.jsx)(_,{code:d.code,message:d.message,t:m,onRetry:C});if(d.status==="missing")return(0,o.jsx)(ce,{t:m,onRetry:C});if(d.status!=="session")return(0,o.jsx)(N,{t:m});if(a===null||a.status==="idle"||a.status==="loading")return(0,o.jsx)(N,{t:m});if(a.status==="failed"){let f=a.error??{code:"io-error",message:""};return(0,o.jsx)(_,{code:f.code,message:f.message,t:m,onRetry:C})}return R.chunk!==null&&j(a)?(0,o.jsx)("div",{className:t?I==="source"?"fmd-source-editor":"fmd-read":"fmd-source-editor","data-testid":r(I),"data-renderer":"codemirror",children:(0,o.jsx)(R.chunk.EditorBody,{...c,text:a.text,decorate:t,onChange:l=>d.session.setDraft(l),onSave:()=>{d.session.save()}})}):j(a)?R.failed?(0,o.jsx)("pre",{className:"fmd-source","data-testid":s,children:a.text}):(0,o.jsx)(N,{t:m}):(0,o.jsx)(fe,{text:a.text,testId:s,t:m})}return n}var X=O({decorate:!0,testId:e=>e==="source"?"fs-md-source":"fs-md-reading",fallbackTestId:"fs-md-source"}),$=O({decorate:!1,testId:()=>"fs-text-editor",fallbackTestId:"fs-text-source"});var K=["txt","text","log","rst","adoc","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","ini","cfg","conf","env","properties","lock","diff","patch"],U=["makefile","dockerfile","license","readme","changelog"];var H="dsh-fs-markdown-styles",me=`
.fmd-read,
.fmd-source-editor {
  --fmd-font: var(--dsw-font-sans, inherit);
  --fmd-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  /* The editor is a document surface, so its prose follows the same role the
     conversation body uses and the desktop font-size shortcuts (\u2318+/\u2318-) scale
     both. Code points at the code role instead; inline code sits 1px above it,
     which is the host's own rule for the chat renderer. */
  --fmd-fs: var(--dsh-content-font-size, 14px);
  --fmd-fs-code: var(--dsh-code-font-size, 11px);
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* Fill the pane so CodeMirror's own scroller, not the pane, owns the
     overflow. Height must be definite here: the editor's height: 100% below
     resolves against this box, and a percentage of an auto height is auto,
     which let a long document grow the box instead of scrolling it. */
  height: 100%;
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
  font-size: var(--fmd-fs);
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
.fmd-source-editor .cm-scroller { font-family: var(--fmd-mono); font-size: calc(var(--fmd-fs-code) + 1px); line-height: 1.55; }
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
  font-size: calc(var(--fmd-fs-code) + 1px);
}
.fmd-link { color: var(--fmd-accent); text-decoration: none; }
.fmd-link:hover { text-decoration: underline; }
.fmd-quote { color: var(--fmd-text-2); font-style: italic; }
.fmd-list-marker { color: var(--fmd-accent); font-family: var(--fmd-mono); }
.fmd-code-block {
  background: var(--fmd-panel);
  font-family: var(--fmd-mono);
  font-size: var(--fmd-fs-code);
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
  font-size: calc(var(--fmd-fs-code) + 1px);
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
  font-size: calc(var(--fmd-fs) * 0.8571);
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
.fmd-state strong { color: var(--dsw-alias-label-primary, inherit); font-size: calc(var(--fmd-fs) * 0.9286); font-weight: 600; }
.fmd-state p { margin: 0; max-width: 56ch; line-height: 1.6; }
.fmd-retry {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 20%, transparent));
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: calc(var(--fmd-fs) * 0.7857);
  cursor: pointer;
}
.fmd-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.fmd-retry:focus-visible { outline: 2px solid var(--fmd-accent, currentColor); outline-offset: -2px; }
/* A rendered table replaces its source lines as one block widget. The wrapper
   owns horizontal overflow so a wide table scrolls inside the reading column
   instead of widening it, and the table keeps the chat renderer's table rhythm
   (a size below the prose size) so Markdown reads the same in both surfaces. */
.fmd-table-block {
  padding: 2px 0 12px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}
.fmd-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: max-content;
  max-width: 100%;
  font-size: var(--dsh-content-font-size-secondary, calc(var(--fmd-fs) - 1px));
  line-height: 1.55;
}
.fmd-table th,
.fmd-table td {
  padding: 5px 10px;
  border: 1px solid var(--fmd-border);
  vertical-align: top;
  text-align: left;
}
.fmd-table th {
  background: var(--fmd-panel);
  font-weight: 600;
}
/* Inline code is one token, not a place to break a package name at every
   slash and hyphen; the wide table scrolls instead of shredding identifiers. */
.fmd-table .fmd-code {
  white-space: nowrap;
}

/* The read-only degradation: the note sits above the text rather than over it,
   so a reader can still select and copy what they cannot edit. */
.fmd-readonly {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.fmd-readonly-note {
  flex: none;
  margin: 0;
  padding: 8px 16px;
  border-bottom: 1px solid var(--fmd-border, color-mix(in srgb, currentColor 12%, transparent));
  background: var(--fmd-panel, color-mix(in srgb, currentColor 4%, transparent));
  color: var(--fmd-caption, inherit);
  font-size: calc(var(--fmd-fs) * 0.7857);
}
.fmd-readonly .fmd-source { flex: 1; min-height: 0; }
`;function G(e=typeof document>"u"?void 0:document){if(e===void 0)return()=>{};if(e.getElementById(H)!==null)return()=>{};let t=e.createElement("style");return t.id=H,t.textContent=me,e.head.append(t),()=>{t.remove()}}var W=["fsExplorer","locale","remote"],Y={id:"markdown",label:"Markdown",match:{extensions:[".md",".markdown"]},priority:10,load:()=>Promise.resolve({Body:X,renderer:"markdown"})},ue=K.map(e=>`.${e}`),Z={id:"text-editor",label:"Text",match:{extensions:ue,names:U},priority:5,load:()=>Promise.resolve({Body:$,renderer:"text-editor"})},g=[],y;function pe(e){return()=>{try{return e.fsExplorer?.documents}catch{return}}}function he(e){let t=pe(e);if(e.locale===void 0)return A({documents:t,t:w(void 0)}),()=>{};let r=()=>{};try{r=e.locale.register(S,{zh:F,en:z})}catch{}return A({documents:t,t:e.locale.bind(S)}),r}function J(e){for(let c of g)c();g=[],y?.(),y=void 0;let t=e.fsExplorer;if(t===void 0)return e.logger?.warn?.(`${u}: fsExplorer service unavailable; the Markdown renderer was not registered`),()=>{};let r=G(),s=he(e);y=s;let n=[t.registerRenderer(Y),t.registerRenderer(Z)];return g=n,()=>{for(let c of n)c();g===n&&(g=[]),s(),y===s&&(y=void 0),r()}}var Q={name:u,inject:W,apply:J};var ge=Q;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
