window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var se=Object.defineProperty;var He=Object.getOwnPropertyDescriptor;var qe=Object.getOwnPropertyNames;var Ke=Object.prototype.hasOwnProperty;var Ue=(e,t)=>{for(var n in t)se(e,n,{get:t[n],enumerable:!0})},Xe=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of qe(t))!Ke.call(e,o)&&o!==n&&se(e,o,{get:()=>t[o],enumerable:!(r=He(t,o))||r.enumerable});return e};var Ze=e=>Xe(se({},"__esModule",{value:!0}),e);var St={};Ue(St,{__test:()=>Ae,apply:()=>je,clientPlugin:()=>De,default:()=>kt,inject:()=>ze});module.exports=Ze(St);var ge={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001"},me={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status"};var ie="conversation.view",V="fs-explorer";var O="fs-explorer",ye="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";var Ye={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Je={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Qe=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function be(e){return typeof e=="string"&&Qe.has(e)}function he(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let u=e.indexOf(" ",r);if(u<0)return null;n.push(e.slice(r,u)),r=u+1}return{fields:n,rest:e.slice(r)}}function et(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function G(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let u=o[0];if(u==="?"){if(o[1]!==" ")continue;let l=o.slice(2);l!==""&&(t[l]={status:"untracked"});continue}if(u!=="!"){if(u==="1"||u==="2"){let l=he(o.slice(2),u==="1"?7:8);if(l===null)continue;let a=l.fields[0]??"",g=l.rest;if(g===""||a.length<2)continue;if(u==="2"){let d=n[r+1];if(d===void 0||d==="")continue;r+=1,t[g]={status:"renamed"};continue}t[g]={status:et(a[0]??".",a[1]??".")};continue}if(u==="u"){let l=he(o.slice(2),9);if(l===null)continue;let a=l.rest;if(a==="")continue;t[a]={status:"conflicted"}}}}return t}function z(e){return be(e)?Ye[e]:"neutral"}function P(e){return be(e)?Je[e]:"?"}function le(e){return`status.${e}`}function ve(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}var tt=["conflicted","deleted","renamed","added","modified","untracked"];function nt(e){return z(tt.find(t=>e.has(t))??"modified")}function we(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let u=r.replace(/\/+$/u,"");if(u==="")continue;let l=u.split("/"),a=r.endsWith("/")?l.length:l.length-1,g="";for(let d=0;d<a;d+=1){let p=l[d];if(p===void 0||p==="")continue;g=g===""?p:`${g}/${p}`;let h=t.get(g);h===void 0?t.set(g,{count:1,present:new Set([o.status])}):(h.count+=1,h.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:nt(o.present)});return n}var rt=new Set(["node_modules",".git","dist","__pycache__"]);function ot(e){return rt.has(e)}function at(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function B(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||ot(r))continue;let o=at(n),u=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(u===void 0?{name:r,kind:o}:{name:r,kind:o,size:u})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var st=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),it=new Set(["md","mdx","markdown","mdown","rst","adoc"]),lt=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),dt=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),ct=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),ut=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),ft=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function ke(e){let t=e.toLowerCase(),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function $(e,t="file"){if(t==="directory")return"folder";let n=e.toLowerCase();if(ft.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=ke(n);return r===""?"file":st.has(r)?"code":it.has(r)?"markdown":lt.has(r)?"data":dt.has(r)?"image":ct.has(r)?"style":ut.has(r)?"archive":"file"}var pt={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},xt={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function H(e){let t=e.toLowerCase(),n=pt[t];if(n!==void 0)return n;let r=ke(t),o=xt[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function j(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${ye} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function q(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),u=Math.max(1,Math.ceil(r/n)),l=Math.max(0,e.length-u-o*2),a=Math.floor(Math.max(0,t.scrollTop)/n)-o,g=Math.min(Math.max(a,0),l),d=Math.min(e.length,g+u+o*2);return{rows:e.slice(g,d),startIndex:g,endIndex:d}}function K(e){return e===""?".":e}function A(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function U(e){if(typeof e!="string")return;let t=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(t===null)return;let r=(t[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let o=t[2]===void 0?1:Math.max(1,Number.parseInt(t[2],10));return{path:r,line:o}}function X(e,t,n){let r=[],o=we(n),u=(l,a)=>{let g=e.get(l);if(!(g===void 0||g.status!=="ready"))for(let d of g.nodes){let p=A(l,d.name),h=d.kind==="directory",C=h&&t.has(p),f=h?void 0:ve(p,n),b=h?o.get(p):void 0;if(r.push({type:"entry",path:p,name:d.name,kind:d.kind,depth:a,expanded:C,...d.size===void 0?{}:{size:d.size},...f===void 0?{}:{status:f},...b===void 0?{}:{statusCount:b.count,statusTone:b.tone}}),!C)continue;let m=e.get(p);if(m===void 0||m.status==="loading"){r.push({type:"status",key:`${p}:loading`,path:p,depth:a+1,state:"loading"});continue}if(m.status==="failed"){r.push({type:"status",key:`${p}:failed`,path:p,depth:a+1,state:"failed",message:m.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(m.nodes.length===0){r.push({type:"status",key:`${p}:empty`,path:p,depth:a+1,state:"empty"});continue}u(p,a+1),m.truncated&&r.push({type:"status",key:`${p}:truncated`,path:p,depth:a+1,state:"truncated",label:j({entries:m.nodes,truncated:!0,total:m.total}).label})}};return u("",0),r}function Z(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}var Se="dsh-fs-explorer-styles",gt=`
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
  --fx-modified: var(--dsw-alias-state-warn-primary, currentColor);
  --fx-added: var(--dsw-alias-state-success-primary, currentColor);
  --fx-deleted: var(--dsw-alias-state-error-primary, currentColor);
  --fx-untracked: var(--dsw-alias-state-business-primary, currentColor);
  --fx-renamed: color-mix(in oklab, var(--dsw-alias-state-business-primary, currentColor) 55%, var(--dsw-alias-state-success-primary, currentColor));
  --fx-conflicted: color-mix(in oklab, var(--dsw-alias-state-error-primary, currentColor) 58%, var(--dsw-alias-state-business-primary, currentColor));
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

.fx-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
.fx-row[data-kind="directory"] .fx-name { font-weight: 500; }
.fx-row-fill { flex: 1 1 0; min-width: 4px; }
.fx-tone { color: var(--fx-tone, currentColor); }
.fx-tone[data-tone="warning"] { --fx-tone: var(--fx-modified); }
.fx-tone[data-tone="success"] { --fx-tone: var(--fx-added); }
.fx-tone[data-tone="danger"] { --fx-tone: var(--fx-deleted); }
.fx-tone[data-tone="info"] { --fx-tone: var(--fx-untracked); }
.fx-tone[data-tone="accent"] { --fx-tone: var(--fx-renamed); }
.fx-tone[data-tone="conflict"] { --fx-tone: var(--fx-conflicted); }
.fx-tone[data-tone="neutral"] { --fx-tone: var(--fx-caption); }
.fx-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 15%, transparent);
  font-family: var(--fx-mono);
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
}
.fx-dir-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  margin-left: 2px;
  font-family: var(--fx-mono);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-dir-status::before {
  content: "";
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
}
.fx-row[data-status="deleted"] .fx-name { text-decoration: line-through; text-decoration-thickness: 1px; opacity: .75; }
.fx-row[data-status="conflicted"] .fx-name { font-weight: 600; }
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
.fx-foot-git { display: inline-flex; align-items: center; gap: 5px; }
.fx-foot-git[data-state="none"] { color: var(--fx-caption); }
.fx-foot-dot { width: 6px; height: 6px; flex: none; border-radius: 50%; background: currentColor; }

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
`;function Ce(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Se}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Se,n.textContent=gt,e.head.appendChild(n),()=>{n.remove()}}var x=require("react");var E=require("react");var i=require("react/jsx-runtime"),D=22;function de({open:e=!0,size:t=14}){return(0,i.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,i.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,i.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function mt(){return(0,i.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,i.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Te(){return(0,i.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,i.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,i.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Re(){return(0,i.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,i.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function yt({name:e}){return(0,i.jsx)("span",{className:"fx-badge","data-icon":$(e),"aria-hidden":"true",children:H(e)})}function ht({row:e,selected:t,top:n,t:r,onToggle:o,onSelect:u}){let l=e.kind==="directory",a={top:n,paddingLeft:8+e.depth*12};return(0,i.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...l?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-expanded":l?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:a,onClick:()=>{l?o(e.path):u(e.path)},children:[(0,i.jsx)("span",{className:"fx-chevron","data-open":l&&e.expanded?"true":"false","data-visible":l?"true":"false","aria-hidden":"true",children:(0,i.jsx)(mt,{})}),l?(0,i.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,i.jsx)(de,{open:e.expanded})}):(0,i.jsx)(yt,{name:e.name}),(0,i.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,i.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":z(e.status),"data-testid":"fx-file-status",title:r(le(e.status)),"aria-label":r(le(e.status)),children:P(e.status)}),e.statusCount===void 0?null:(0,i.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:r("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,i.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,i.jsx)("span",{className:"fx-size",children:Z(e.size)})]})}function bt({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,i.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,i.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,i.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,i.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,i.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function Fe({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:u}){let l=(0,E.useRef)(null),[a,g]=(0,E.useState)(0),[d,p]=(0,E.useState)(0);(0,E.useEffect)(()=>{let f=l.current;if(f===null)return;let b=()=>p(f.clientHeight);if(b(),typeof ResizeObserver>"u")return;let m=new ResizeObserver(b);return m.observe(f),()=>m.disconnect()},[]),(0,E.useEffect)(()=>{if(t===void 0)return;let f=l.current;if(f===null)return;let b=e.findIndex(T=>T.type==="entry"&&T.path===t);if(b<0)return;let m=b*D;(m<f.scrollTop||m+D>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,m-f.clientHeight/2))},[t,e]);let h=f=>{g(f.currentTarget.scrollTop)},C=q(e,{scrollTop:a,height:d===0?480:d,rowHeight:D});return(0,i.jsx)("div",{className:"fx-scroll",ref:l,onScroll:h,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,i.jsx)("div",{className:"fx-vlist",style:{height:e.length*D},children:C.rows.map((f,b)=>{let m=(C.startIndex+b)*D;return f.type==="entry"?(0,i.jsx)(ht,{row:f,top:m,selected:f.path===t,t:n,onToggle:r,onSelect:o},f.path):(0,i.jsx)(bt,{row:f,top:m,t:n,onRetry:u},f.key)})})})}function Y(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function L(e){try{return e()}catch{return}}function Ne(e){return()=>{let t=L(()=>e.workspaceFiles);if(Y(t))return t;let n=L(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Y(n))return n;let r=L(()=>e.remote?.workspaceFiles);if(Y(r))return r;let o=L(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Y(o))return o}}function W(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function ce(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function J(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:W(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?ce(r.value):{ok:!1,message:W(r.error)}}return ce(n)}return ce(t)}function Le(e){return e instanceof Error?e.message:W(e)}function Ee(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Me(e){return()=>{let t=L(()=>e.remote?.gitExplorer);if(Ee(t))return t;let n=L(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Ee(n))return n}}function ue(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return typeof t.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:t.isRepository===!1?"":t.status}}function Q(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:W(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?ue(o.snapshot):{ok:!1,message:W(o.error)}}let r=e;return r.snapshot!==void 0?ue(r.snapshot):ue(n)}var c=require("react/jsx-runtime");var vt=()=>({status:"loading",nodes:[],truncated:!1,total:0});function ee({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,c.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,c.jsx)("strong",{children:e}),t===void 0?null:(0,c.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,c.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function Ie({workbench:e,version:t,t:n,files:r,status:o}){function u(l){let a=l.sessionId??e.currentSessionId(),g=(0,x.useRef)(a);g.current=a;let d=(0,x.useMemo)(()=>r(),[r]),p=(0,x.useMemo)(()=>o(),[o]),[h,C]=(0,x.useState)(()=>new Map),[f,b]=(0,x.useState)(void 0),m=(0,x.useRef)(h);m.current=h;let[T,M]=(0,x.useState)(()=>new Set),[We,te]=(0,x.useState)(void 0),[fe,_e]=(0,x.useState)(0),[_,ne]=(0,x.useState)(void 0),R=(0,x.useRef)(new Map),re=(0,x.useRef)(void 0),F=(0,x.useCallback)(async(s,S,v)=>{R.current.get(s)?.abort();let w=new AbortController;R.current.set(s,w),C(N=>new Map(N).set(s,vt()));try{let N=await v.list(S,K(s),w.signal);if(w.signal.aborted||g.current!==S)return!1;let k=J(N);if(!k.ok)return C(ae=>new Map(ae).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:k.message})),!1;let oe=B(k.listing.entries);return C(ae=>new Map(ae).set(s,{status:"ready",nodes:oe,truncated:k.listing.truncated===!0,total:k.listing.entries.length})),!0}catch(N){return w.signal.aborted||C(k=>new Map(k).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:Le(N)})),!1}finally{R.current.get(s)===w&&R.current.delete(s)}},[]);(0,x.useEffect)(()=>{for(let s of R.current.values())s.abort();return R.current.clear(),C(new Map),M(new Set),te(void 0),ne(void 0),re.current=void 0,a!==void 0&&d!==void 0&&F("",a,d),()=>{for(let s of R.current.values())s.abort();R.current.clear()}},[a,d,fe,F]),(0,x.useEffect)(()=>{if(a===void 0||p===void 0){b(void 0);return}let s=!0,S=new AbortController;return b(void 0),Promise.resolve().then(()=>p.snapshot(a,{maxCommits:1},S.signal)).then(v=>{if(!s)return;let w=Q(v);b(w.ok?G(w.status):void 0)}).catch(()=>{s&&b(void 0)}),()=>{s=!1,S.abort()}},[a,p,fe]),(0,x.useEffect)(()=>{let s=l.viewRequest;if(s==null||s.view!==V)return;let S=`${s.view}:${s.focus}`;if(re.current===S)return;re.current=S;let v=U(s.focus);v!==void 0&&ne(v),l.completeViewRequest?.()},[l.viewRequest,l.completeViewRequest]);let y=h.get(""),pe=y?.status==="ready";(0,x.useEffect)(()=>{if(_===void 0||a===void 0||d===void 0||!pe)return;let s=!0,S=_.path.split("/").filter(Boolean),v=[],w="";for(let k of S.slice(0,-1))w=A(w,k),v.push(w);return v.length>0&&M(k=>new Set([...k,...v])),(async()=>{for(let k of v){if(m.current.get(k)?.status==="ready")continue;let oe=await F(k,a,d);if(!s||!oe)return}s&&(te(_.path),ne(void 0))})(),()=>{s=!1}},[_,a,d,pe,F]);let Ve=(0,x.useMemo)(()=>X(h,T,f),[h,T,f]),I=f===void 0?void 0:Object.keys(f).length,Oe=f===void 0?"neutral":Object.values(f).some(s=>s.status==="conflicted")?"conflict":I===0?"success":"warning",Ge=(0,x.useCallback)(s=>{if(a===void 0||d===void 0)return;if(T.has(s)){M(v=>{let w=new Set(v);return w.delete(s),w});return}M(v=>new Set(v).add(s));let S=h.get(s);(S===void 0||S.status==="failed")&&F(s,a,d)},[T,h,a,d,F]),xe=(0,x.useCallback)(s=>{a===void 0||d===void 0||F(s,a,d)},[a,d,F]),Pe=()=>M(new Set),Be=()=>_e(s=>s+1),$e=a===void 0?"no-session":d===void 0?"no-service":y===void 0||y.status==="loading"?"loading":y.status==="failed"?"failed":y.nodes.length===0?"empty":"tree";return(0,c.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":$e,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,c.jsxs)("header",{className:"fx-head",children:[(0,c.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,c.jsx)(de,{open:!0})}),(0,c.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,c.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,c.jsxs)("div",{className:"fx-head-meta",children:[y?.status==="ready"?(0,c.jsxs)("span",{children:[(0,c.jsx)("b",{children:y.nodes.length})," ",n("head.entries")]}):null,(0,c.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:T.size===0,onClick:Pe,children:(0,c.jsx)(Re,{})}),(0,c.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:a===void 0||d===void 0||y?.status==="loading",onClick:Be,children:(0,c.jsx)(Te,{})})]})]}),(0,c.jsx)("div",{className:"fx-main",children:a===void 0?(0,c.jsx)(ee,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):d===void 0?(0,c.jsx)(ee,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):y===void 0||y.status==="loading"?(0,c.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,c.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):y.status==="failed"?(0,c.jsx)(ee,{title:n("state.failed.title"),description:y.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>xe(""),testId:"fs-failed"}):y.nodes.length===0?(0,c.jsx)(ee,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,c.jsx)(Fe,{rows:Ve,selectedPath:We,t:n,onToggle:Ge,onSelect:te,onRetry:xe})}),y?.status==="ready"?(0,c.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,c.jsxs)("span",{children:[n("view.scope")," ",(0,c.jsx)("b",{children:y.nodes.length})," ",n("head.entries")]}),y.truncated?(0,c.jsx)("span",{className:"fx-foot-warn",children:j({entries:y.nodes,truncated:!0,total:y.total}).label}):null,(0,c.jsxs)("span",{className:"fx-foot-git","data-state":I===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,c.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Oe,"aria-hidden":"true"}),I===void 0?n("status.unavailable"):I===0?n("status.clean"):n("status.summary").replace("{count}",String(I))]}),(0,c.jsx)("span",{className:"fx-spacer"}),(0,c.jsx)("span",{children:n("foot.order")})]}):null]})}return u}var ze=["slots","locale","workbench","remote"];function je(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(O),r=e.locale.register(O,{zh:ge,en:me}),o=Ce(typeof document>"u"?void 0:document),u=Ie({workbench:t,version:t.version,t:n,files:Ne(e),status:Me(e)});return e.slots.inject(ie,()=>e.slots.register({name:ie,id:V,order:100,label:()=>n("tab.label"),locale:O},u)),()=>{o(),r()}}var Ae={buildTree:B,describeListing:j,iconFor:$,computeTreeWindow:q,flattenTree:X,badgeFor:H,formatSize:Z,joinPath:A,listingPath:K,parseFocus:U,normalizeListing:J,normalizeStatusSnapshot:Q,parseStatusZ:G,statusTone:z,statusBadge:P},De={name:"dsh-fs-explorer",inject:ze,apply:je,__test:Ae},kt=De;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
