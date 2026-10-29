window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Y=Object.defineProperty;var Fe=Object.getOwnPropertyDescriptor;var Ce=Object.getOwnPropertyNames;var Ee=Object.prototype.hasOwnProperty;var Le=(e,n)=>{for(var t in n)Y(e,t,{get:n[t],enumerable:!0})},Ne=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ce(n))!Ee.call(e,o)&&o!==t&&Y(e,o,{get:()=>n[o],enumerable:!(r=Fe(n,o))||r.enumerable});return e};var Ie=e=>Ne(Y({},"__esModule",{value:!0}),e);var Ye={};Le(Ye,{__test:()=>he,apply:()=>me,clientPlugin:()=>ve,default:()=>Ue,inject:()=>ye});module.exports=Ie(Ye);var ae={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55"},ie={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory"};var Q="conversation.view",z="fs-explorer";var W="fs-explorer";var Me=new Set(["node_modules",".git","dist","__pycache__"]);function je(e){return Me.has(e)}function ze(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function A(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||je(r))continue;let o=ze(t),c=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(c===void 0?{name:r,kind:o}:{name:r,kind:o,size:c})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var We=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Ae=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Ve=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),De=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),_e=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Pe=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Oe=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function se(e){let n=e.toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function V(e,n="file"){if(n==="directory")return"folder";let t=e.toLowerCase();if(Oe.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=se(t);return r===""?"file":We.has(r)?"code":Ae.has(r)?"markdown":Ve.has(r)?"data":De.has(r)?"image":_e.has(r)?"style":Pe.has(r)?"archive":"file"}var He={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Be={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function D(e){let n=e.toLowerCase(),t=He[n];if(t!==void 0)return t;let r=se(n),o=Be[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function E(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`\u5DF2\u663E\u793A ${String(n)} \u9879\uFF0C\u7EE7\u7EED\u52A0\u8F7D`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function _(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),c=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-c-o*2),x=Math.floor(Math.max(0,n.scrollTop)/t)-o,i=Math.min(Math.max(x,0),a),g=Math.min(e.length,i+c+o*2);return{rows:e.slice(i,g),startIndex:i,endIndex:g}}function P(e){return e===""?".":e}function N(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function O(e){if(typeof e!="string")return;let n=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(n===null)return;let r=(n[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let o=n[2]===void 0?1:Math.max(1,Number.parseInt(n[2],10));return{path:r,line:o}}function H(e,n){let t=[],r=(o,c)=>{let a=e.get(o);if(!(a===void 0||a.status!=="ready"))for(let x of a.nodes){let i=N(o,x.name),w=x.kind==="directory"&&n.has(i);if(t.push({type:"entry",path:i,name:x.name,kind:x.kind,depth:c,expanded:w,...x.size===void 0?{}:{size:x.size}}),!w)continue;let m=e.get(i);if(m===void 0||m.status==="loading"){t.push({type:"status",key:`${i}:loading`,path:i,depth:c+1,state:"loading"});continue}if(m.status==="failed"){t.push({type:"status",key:`${i}:failed`,path:i,depth:c+1,state:"failed",message:m.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(m.nodes.length===0){t.push({type:"status",key:`${i}:empty`,path:i,depth:c+1,state:"empty"});continue}r(i,c+1),m.truncated&&t.push({type:"status",key:`${i}:truncated`,path:i,depth:c+1,state:"truncated",label:E({entries:m.nodes,truncated:!0,total:m.total}).label})}};return r("",0),t}function B(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var le="dsh-fs-explorer-styles",Ge=`
.fx-root {
  --fx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --fx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --fx-row-h: 22px;
  --fx-indent: 12px;
  --fx-text: var(--dsw-alias-label-primary, inherit);
  --fx-text-2: var(--dsw-alias-label-secondary, inherit);
  --fx-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fx-border: var(--dsw-alias-border-l2, color-mix(in srgb, currentColor 18%, transparent));
  --fx-border-soft: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 10%, transparent));
  --fx-panel: var(--dsw-alias-bg-layer-1, transparent);
  --fx-panel-2: var(--dsw-alias-bg-layer-2, transparent);
  --fx-hover: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent));
  --fx-active: var(--dsw-alias-interactive-bg-active, color-mix(in srgb, currentColor 12%, transparent));
  --fx-accent: var(--dsw-alias-brand-primary, currentColor);
  --fx-code: var(--dsw-alias-state-business-primary, currentColor);
  --fx-markdown: color-mix(in oklab, var(--dsw-alias-state-business-primary, currentColor) 52%, var(--dsw-alias-state-success-primary, currentColor));
  --fx-data: var(--dsw-alias-state-warn-primary, currentColor);
  --fx-image: color-mix(in oklab, var(--dsw-alias-state-business-primary, currentColor) 42%, var(--dsw-alias-state-error-primary, currentColor));
  --fx-style: var(--dsw-alias-state-error-primary, currentColor);
  --fx-config: var(--dsw-alias-label-secondary, currentColor);
  --fx-archive: color-mix(in oklab, var(--dsw-alias-state-warn-primary, currentColor) 55%, var(--dsw-alias-state-error-primary, currentColor));
  --fx-folder: var(--dsw-alias-state-business-primary, currentColor);
  --fx-file: var(--dsw-alias-label-tertiary, currentColor);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--fx-text);
  background: var(--dsw-alias-bg-base, transparent);
  font-family: var(--fx-font);
  font-size: 12px;
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.fx-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: 38px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-head-icon { display: inline-flex; color: var(--fx-folder); flex: none; }
.fx-title { margin: 0; font-size: 13px; font-weight: 600; white-space: nowrap; }
.fx-scope {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  border: 1px solid var(--fx-border);
  border-radius: 999px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 10.5px;
  white-space: nowrap;
  flex: none;
}
.fx-head-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  color: var(--fx-caption);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.fx-head-meta b { color: var(--fx-text-2); font-weight: 600; }
.fx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  cursor: pointer;
}
.fx-btn:hover:not(:disabled) { background: var(--fx-hover); color: var(--fx-text); border-color: var(--fx-border-soft); }
.fx-btn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }
.fx-btn:disabled { opacity: .4; cursor: default; }

.fx-main { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.fx-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent)) transparent;
}
.fx-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
.fx-scroll::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent));
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
.fx-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l2, color-mix(in srgb, currentColor 34%, transparent));
  background-clip: padding-box;
}
.fx-vlist { position: relative; width: 100%; }

.fx-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--fx-row-h);
  padding: 0 8px 0 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  text-align: left;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: pointer;
}
.fx-row:hover { background: var(--fx-hover); }
.fx-row:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; z-index: 1; }
.fx-row[data-selected="true"] {
  background: var(--fx-active);
  box-shadow: inset 2px 0 0 var(--fx-accent);
}
.fx-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex: none;
  color: var(--fx-caption);
  opacity: .75;
  transition: transform .12s ease, opacity .12s ease;
}
.fx-chevron[data-open="true"] { transform: rotate(90deg); }
.fx-chevron[data-visible="false"] { visibility: hidden; }
.fx-row:hover .fx-chevron { opacity: 1; }
.fx-folder { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex: none; color: var(--fx-folder); }
.fx-folder[data-open="false"] { color: color-mix(in oklab, var(--fx-folder) 78%, var(--fx-caption)); }

.fx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 15px;
  flex: none;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}
.fx-badge[data-icon="code"] { color: var(--fx-code); }
.fx-badge[data-icon="markdown"] { color: var(--fx-markdown); }
.fx-badge[data-icon="data"] { color: var(--fx-data); }
.fx-badge[data-icon="image"] { color: var(--fx-image); }
.fx-badge[data-icon="style"] { color: var(--fx-style); }
.fx-badge[data-icon="config"] { color: var(--fx-config); }
.fx-badge[data-icon="archive"] { color: var(--fx-archive); }
.fx-badge[data-icon="file"] { color: var(--fx-file); }

.fx-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
.fx-row[data-kind="directory"] .fx-name { font-weight: 500; }
.fx-size {
  flex: none;
  min-width: 5ch;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.fx-status {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--fx-row-h);
  padding-right: 8px;
  color: var(--fx-caption);
  font-size: 10.5px;
  white-space: nowrap;
  box-sizing: border-box;
}
.fx-status[data-state="failed"] { color: var(--dsw-alias-state-error-primary, currentColor); }
.fx-status-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.fx-status-note { color: var(--fx-caption); font-family: var(--fx-mono); font-variant-numeric: tabular-nums; }
.fx-spinner {
  width: 10px;
  height: 10px;
  flex: none;
  border: 1.5px solid color-mix(in srgb, currentColor 25%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: fx-spin .7s linear infinite;
}
@keyframes fx-spin { to { transform: rotate(360deg); } }
.fx-linkbtn {
  margin-left: 4px;
  padding: 1px 6px;
  border: 1px solid var(--fx-border);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: 10.5px;
  cursor: pointer;
}
.fx-linkbtn:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-linkbtn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }

.fx-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 24px;
  padding: 0 12px;
  border-top: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
}
.fx-foot b { color: var(--fx-text-2); font-weight: 600; }
.fx-foot .fx-spacer { flex: 1; }
.fx-foot-warn { color: var(--dsw-alias-state-warn-primary, currentColor); }

.fx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  min-height: 140px;
  margin: 12px;
  padding: 18px;
  border: 1px dashed var(--fx-border);
  border-radius: 10px;
  color: var(--fx-text-2);
  text-align: center;
}
.fx-empty strong { color: var(--fx-text); font-size: 13px; font-weight: 600; }
.fx-empty span { color: var(--fx-caption); font-size: 11px; max-width: 46ch; }
.fx-empty .fx-btn { margin-top: 4px; width: auto; padding: 0 10px; border-color: var(--fx-border); }
.fx-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 16px;
  color: var(--fx-caption);
  font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .fx-chevron { transition: none; }
  .fx-spinner { animation-duration: 1.6s; }
}
`;function de(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${le}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=le,t.textContent=Ge,e.head.appendChild(t),()=>{t.remove()}}var p=require("react");var C=require("react");var l=require("react/jsx-runtime"),I=22;function ee({open:e=!0,size:n=14}){return(0,l.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,l.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,l.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function qe(){return(0,l.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,l.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ce(){return(0,l.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,l.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,l.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function fe(){return(0,l.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,l.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function $e({name:e}){return(0,l.jsx)("span",{className:"fx-badge","data-icon":V(e),"aria-hidden":"true",children:D(e)})}function Ke({row:e,selected:n,top:t,t:r,onToggle:o,onSelect:c}){let a=e.kind==="directory",x={top:t,paddingLeft:8+e.depth*12};return(0,l.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-testid":"fx-row",title:e.path,style:x,onClick:()=>{a?o(e.path):c(e.path)},children:[(0,l.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,l.jsx)(qe,{})}),a?(0,l.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,l.jsx)(ee,{open:e.expanded})}):(0,l.jsx)($e,{name:e.name}),(0,l.jsx)("span",{className:"fx-name",children:e.name}),e.size===void 0?null:(0,l.jsx)("span",{className:"fx-size",children:B(e.size)})]})}function Xe({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??E({entries:[],truncated:!0}).label;return(0,l.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,l.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,l.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,l.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,l.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function pe({rows:e,selectedPath:n,t,onToggle:r,onSelect:o,onRetry:c}){let a=(0,C.useRef)(null),[x,i]=(0,C.useState)(0),[g,w]=(0,C.useState)(0);(0,C.useEffect)(()=>{let f=a.current;if(f===null)return;let S=()=>w(f.clientHeight);if(S(),typeof ResizeObserver>"u")return;let h=new ResizeObserver(S);return h.observe(f),()=>h.disconnect()},[]),(0,C.useEffect)(()=>{if(n===void 0)return;let f=a.current;if(f===null)return;let S=e.findIndex(M=>M.type==="entry"&&M.path===n);if(S<0)return;let h=S*I;(h<f.scrollTop||h+I>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,h-f.clientHeight/2))},[n,e]);let m=f=>{i(f.currentTarget.scrollTop)},T=_(e,{scrollTop:x,height:g===0?480:g,rowHeight:I});return(0,l.jsx)("div",{className:"fx-scroll",ref:a,onScroll:m,"data-testid":"fs-tree-scroll",role:"tree","aria-label":t("view.tree"),children:(0,l.jsx)("div",{className:"fx-vlist",style:{height:e.length*I},children:T.rows.map((f,S)=>{let h=(T.startIndex+S)*I;return f.type==="entry"?(0,l.jsx)(Ke,{row:f,top:h,selected:f.path===n,t,onToggle:r,onSelect:o},f.path):(0,l.jsx)(Xe,{row:f,top:h,t,onRetry:c},f.key)})})})}function G(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function q(e){try{return e()}catch{return}}function ue(e){return()=>{let n=q(()=>e.workspaceFiles);if(G(n))return n;let t=q(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(G(t))return t;let r=q(()=>e.remote?.workspaceFiles);if(G(r))return r;let o=q(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(G(o))return o}}function ne(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function te(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function $(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:ne(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?te(r.value):{ok:!1,message:ne(r.error)}}return te(t)}return te(n)}function xe(e){return e instanceof Error?e.message:ne(e)}var d=require("react/jsx-runtime");var Ze=()=>({status:"loading",nodes:[],truncated:!1,total:0});function K({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,d.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,d.jsx)("strong",{children:e}),n===void 0?null:(0,d.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,d.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ge({workbench:e,version:n,t,files:r}){function o(c){let a=c.sessionId??e.currentSessionId(),x=(0,p.useRef)(a);x.current=a;let i=(0,p.useMemo)(()=>r(),[r]),[g,w]=(0,p.useState)(()=>new Map),m=(0,p.useRef)(g);m.current=g;let[T,f]=(0,p.useState)(()=>new Set),[S,h]=(0,p.useState)(void 0),[M,be]=(0,p.useState)(0),[j,X]=(0,p.useState)(void 0),R=(0,p.useRef)(new Map),Z=(0,p.useRef)(void 0),F=(0,p.useCallback)(async(s,k,v)=>{R.current.get(s)?.abort();let b=new AbortController;R.current.set(s,b),w(L=>new Map(L).set(s,Ze()));try{let L=await v.list(k,P(s),b.signal);if(b.signal.aborted||x.current!==k)return!1;let y=$(L);if(!y.ok)return w(U=>new Map(U).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:y.message})),!1;let J=A(y.listing.entries);return w(U=>new Map(U).set(s,{status:"ready",nodes:J,truncated:y.listing.truncated===!0,total:y.listing.entries.length})),!0}catch(L){return b.signal.aborted||w(y=>new Map(y).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:xe(L)})),!1}finally{R.current.get(s)===b&&R.current.delete(s)}},[]);(0,p.useEffect)(()=>{for(let s of R.current.values())s.abort();return R.current.clear(),w(new Map),f(new Set),h(void 0),X(void 0),Z.current=void 0,a!==void 0&&i!==void 0&&F("",a,i),()=>{for(let s of R.current.values())s.abort();R.current.clear()}},[a,i,M,F]),(0,p.useEffect)(()=>{let s=c.viewRequest;if(s==null||s.view!==z)return;let k=`${s.view}:${s.focus}`;if(Z.current===k)return;Z.current=k;let v=O(s.focus);v!==void 0&&X(v),c.completeViewRequest?.()},[c.viewRequest,c.completeViewRequest]);let u=g.get(""),re=u?.status==="ready";(0,p.useEffect)(()=>{if(j===void 0||a===void 0||i===void 0||!re)return;let s=!0,k=j.path.split("/").filter(Boolean),v=[],b="";for(let y of k.slice(0,-1))b=N(b,y),v.push(b);return v.length>0&&f(y=>new Set([...y,...v])),(async()=>{for(let y of v){if(m.current.get(y)?.status==="ready")continue;let J=await F(y,a,i);if(!s||!J)return}s&&(h(j.path),X(void 0))})(),()=>{s=!1}},[j,a,i,re,F]);let we=(0,p.useMemo)(()=>H(g,T),[g,T]),ke=(0,p.useCallback)(s=>{if(a===void 0||i===void 0)return;if(T.has(s)){f(v=>{let b=new Set(v);return b.delete(s),b});return}f(v=>new Set(v).add(s));let k=g.get(s);(k===void 0||k.status==="failed")&&F(s,a,i)},[T,g,a,i,F]),oe=(0,p.useCallback)(s=>{a===void 0||i===void 0||F(s,a,i)},[a,i,F]),Se=()=>f(new Set),Te=()=>be(s=>s+1),Re=a===void 0?"no-session":i===void 0?"no-service":u===void 0||u.status==="loading"?"loading":u.status==="failed"?"failed":u.nodes.length===0?"empty":"tree";return(0,d.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Re,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,d.jsxs)("header",{className:"fx-head",children:[(0,d.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,d.jsx)(ee,{open:!0})}),(0,d.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,d.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,d.jsxs)("div",{className:"fx-head-meta",children:[u?.status==="ready"?(0,d.jsxs)("span",{children:[(0,d.jsx)("b",{children:u.nodes.length})," ",t("head.entries")]}):null,(0,d.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:T.size===0,onClick:Se,children:(0,d.jsx)(fe,{})}),(0,d.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:a===void 0||i===void 0||u?.status==="loading",onClick:Te,children:(0,d.jsx)(ce,{})})]})]}),(0,d.jsx)("div",{className:"fx-main",children:a===void 0?(0,d.jsx)(K,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):i===void 0?(0,d.jsx)(K,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):u===void 0||u.status==="loading"?(0,d.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,d.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):u.status==="failed"?(0,d.jsx)(K,{title:t("state.failed.title"),description:u.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>oe(""),testId:"fs-failed"}):u.nodes.length===0?(0,d.jsx)(K,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,d.jsx)(pe,{rows:we,selectedPath:S,t,onToggle:ke,onSelect:h,onRetry:oe})}),u?.status==="ready"?(0,d.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,d.jsxs)("span",{children:[t("view.scope")," ",(0,d.jsx)("b",{children:u.nodes.length})," ",t("head.entries")]}),u.truncated?(0,d.jsx)("span",{className:"fx-foot-warn",children:E({entries:u.nodes,truncated:!0,total:u.total}).label}):null,(0,d.jsx)("span",{className:"fx-spacer"}),(0,d.jsx)("span",{children:t("foot.order")})]}):null]})}return o}var ye=["slots","locale","workbench","remote"];function me(e){let n=e.workbench;if(n==null)return()=>{};let t=e.locale.bind(W),r=e.locale.register(W,{zh:ae,en:ie}),o=de(typeof document>"u"?void 0:document),c=ge({workbench:n,version:n.version,t,files:ue(e)});return e.slots.inject(Q,()=>e.slots.register({name:Q,id:z,order:100,label:()=>t("tab.label"),locale:W},c)),()=>{o(),r()}}var he={buildTree:A,describeListing:E,iconFor:V,computeTreeWindow:_,flattenTree:H,badgeFor:D,formatSize:B,joinPath:N,listingPath:P,parseFocus:O,normalizeListing:$},ve={name:"dsh-fs-explorer",inject:ye,apply:me,__test:he},Ue=ve;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
