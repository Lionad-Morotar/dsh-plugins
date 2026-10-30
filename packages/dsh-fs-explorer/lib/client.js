window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var _e=Object.defineProperty;var Qt=Object.getOwnPropertyDescriptor;var en=Object.getOwnPropertyNames;var tn=Object.prototype.hasOwnProperty;var nn=(e,t)=>{for(var n in t)_e(e,n,{get:t[n],enumerable:!0})},rn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of en(t))!tn.call(e,o)&&o!==n&&_e(e,o,{get:()=>t[o],enumerable:!(r=Qt(t,o))||r.enumerable});return e};var on=e=>rn(_e({},"__esModule",{value:!0}),e);var Yn={};nn(Yn,{__test:()=>Ut,apply:()=>Gt,boot:()=>Rt,clientPlugin:()=>Yt,default:()=>Un,inject:()=>qt});module.exports=on(Yn);var Ve={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},$e={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function He(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Ve:$e)["tab.label"]??"Files"}var Z="dsh-fs-explorer",Be="conversation.view",oe="fs-explorer";var xe="fs-explorer",dt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",qe={chunk:"client.preview.js"},ct={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var ye=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function an(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",t=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(t)?"mac":"other"}function ut(e,t,n=an()){if(e.isComposing===!0||e.code!==t.code)return!1;let r=t.modifiers,o=r.includes("meta")||r.includes("primary")&&n==="mac",i=r.includes("control")||r.includes("primary")&&n!=="mac",u=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===u&&e.shiftKey===!0===d}function ft(e){if(e===null||typeof e!="object")return!1;let t=e;if(t.isContentEditable===!0)return!0;if(typeof t.tagName!="string")return!1;let n=t.tagName.toLowerCase();return n==="input"||n==="textarea"||n==="select"}function sn(e){let t=e?.querySelector("[data-composer-input]");if(t==null||typeof t!="object")return!1;let n=t.focus;return typeof n!="function"?!1:(n.call(t),!0)}function pt(e){let t=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return t!=null}function ge(e){let t=e.doc??(typeof document>"u"?void 0:document);return n=>{if(n.key!=="Escape"||n.defaultPrevented===!0||n.isComposing===!0||e.hasModal())return;n.preventDefault(),e.focusComposer()!==!0&&sn(t),e.onClose?.()}}var ln={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},dn={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},cn=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function xt(e){return typeof e=="string"&&cn.has(e)}function mt(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;n.push(e.slice(r,i)),r=i+1}return{fields:n,rest:e.slice(r)}}function un(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function ve(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let u=o.slice(2);u!==""&&(t[u]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let u=mt(o.slice(2),i==="1"?7:8);if(u===null)continue;let d=u.fields[0]??"",a=u.rest;if(a===""||d.length<2)continue;if(i==="2"){let l=n[r+1];if(l===void 0||l==="")continue;r+=1,t[a]={status:"renamed"};continue}t[a]={status:un(d[0]??".",d[1]??".")};continue}if(i==="u"){let u=mt(o.slice(2),9);if(u===null)continue;let d=u.rest;if(d==="")continue;t[d]={status:"conflicted"}}}}return t}function ie(e){return xt(e)?ln[e]:"neutral"}function he(e){return xt(e)?dn[e]:"?"}function Ge(e){return`status.${e}`}function yt(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}var fn=["conflicted","deleted","renamed","added","modified","untracked"];function pn(e){return ie(fn.find(t=>e.has(t))??"modified")}function gt(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let u=i.split("/"),d=r.endsWith("/")?u.length:u.length-1,a="";for(let l=0;l<d;l+=1){let s=u[l];if(s===void 0||s==="")continue;a=a===""?s:`${a}/${s}`;let p=t.get(a);p===void 0?t.set(a,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:pn(o.present)});return n}var mn=new Set(["node_modules",".git","dist","__pycache__"]);function xn(e){return mn.has(e)}function yn(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function we(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||xn(r))continue;let o=yn(n),i=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var gn=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),vn=new Set(["md","mdx","markdown","mdown","rst","adoc"]),hn=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),wn=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),bn=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),kn=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Sn=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function vt(e){let t=e.toLowerCase(),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function te(e,t="file"){if(t==="directory")return"folder";let n=e.toLowerCase();if(Sn.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=vt(n);return r===""?"file":gn.has(r)?"code":vn.has(r)?"markdown":hn.has(r)?"data":wn.has(r)?"image":bn.has(r)?"style":kn.has(r)?"archive":"file"}var Pn={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Cn={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ne(e){let t=e.toLowerCase(),n=Pn[t];if(n!==void 0)return n;let r=vt(t),o=Cn[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function ae(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${dt} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function be(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),u=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,t.scrollTop)/n)-o,a=Math.min(Math.max(d,0),u),l=Math.min(e.length,a+i+o*2);return{rows:e.slice(a,l),startIndex:a,endIndex:l}}function ke(e){return e===""?".":e}function se(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function Se(e){if(typeof e!="string")return;let t=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(t===null)return;let r=(t[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let o=t[2]===void 0?1:Math.max(1,Number.parseInt(t[2],10));return{path:r,line:o}}function Pe(e,t,n){let r=[],o=gt(n),i=(u,d)=>{let a=e.get(u);if(!(a===void 0||a.status!=="ready"))for(let l of a.nodes){let s=se(u,l.name),p=l.kind==="directory",C=p&&t.has(s),v=p?void 0:yt(s,n),b=p?o.get(s):void 0;if(r.push({type:"entry",path:s,name:l.name,kind:l.kind,depth:d,expanded:C,...l.size===void 0?{}:{size:l.size},...v===void 0?{}:{status:v},...b===void 0?{}:{statusCount:b.count,statusTone:b.tone}}),!C)continue;let h=e.get(s);if(h===void 0||h.status==="loading"){r.push({type:"status",key:`${s}:loading`,path:s,depth:d+1,state:"loading"});continue}if(h.status==="failed"){r.push({type:"status",key:`${s}:failed`,path:s,depth:d+1,state:"failed",message:h.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(h.nodes.length===0){r.push({type:"status",key:`${s}:empty`,path:s,depth:d+1,state:"empty"});continue}i(s,d+1),h.truncated&&r.push({type:"status",key:`${s}:truncated`,path:s,depth:d+1,state:"truncated",label:ae({entries:h.nodes,truncated:!0,total:h.total}).label})}};return i("",0),r}function Ce(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}function ht(e){let t=e.slice(e.lastIndexOf("/")+1);return t===""?e:t}function Ue(e){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");return t===""?void 0:t}var Rn=Object.freeze({panels:Object.freeze([]),active:null});function Ye(){let e=[],t=null,n=Rn,r=new Set,o=()=>{n=Object.freeze({panels:Object.freeze(e.slice()),active:t});for(let d of[...r])d()},i=d=>e.findIndex(a=>a.path===d),u=d=>{if(e.length===0)return;let a=t===null?-1:i(t),l=e[(a+d+e.length)%e.length];l===void 0||l.path===t||(t=l.path,o())};return{open(d,a=1){let l=Ue(d);if(l===void 0)return;let s=Number.isFinite(a)&&a>0?Math.trunc(a):1,p=i(l);if(p>=0){let v=e[p];if(v!==void 0&&v.line!==s&&(e=e.map((b,h)=>h===p?{path:l,line:s}:b)),t===l){v!==void 0&&v.line!==s&&o();return}t=l,o();return}let C=t===null?e.length:i(t)+1;e=[...e.slice(0,C),{path:l,line:s},...e.slice(C)],t=l,o()},close(d){let a=d??t;if(a===null)return;let l=i(a);l<0||(e=e.filter(s=>s.path!==a),t===a&&(t=(e[l]??e[l-1])?.path??null),o())},activate(d){let a=Ue(d);a===void 0||i(a)<0||t===a||(t=a,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&t===null||(e=[],t=null,o())},isOpen(d){let a=Ue(d);return a!==void 0&&i(a)>=0},activeEntry(){return e.find(d=>d.path===t)},snapshot:()=>n,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function wt(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o=Ye();return e.set(n,o),o}}}function le(e,t){let n=Se(e);return n===void 0?!1:(t.open(n.path,n.line),!0)}var bt=require("react");function j(e,t,...n){let r=n.filter(u=>u!=null&&u!==!1),o=(0,bt.createElement)(e,t??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...t??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Fn(e){let t=e.trim();if(!(t===""||t.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(t)||t.startsWith("/")||t.startsWith("#")||t.startsWith("./")||t.startsWith("../")))return t}var En=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function J(e){let t=[],n=0;for(let r of e.matchAll(En)){let o=r.index??0;o>n&&t.push(e.slice(n,o));let i=r[0];if(i.startsWith("`"))t.push(j("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))t.push(j("strong",null,...J(i.slice(2,-2))));else if(i.startsWith("~~"))t.push(j("del",null,...J(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))t.push(j("em",null,...J(i.slice(1,-1))));else{let u=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=u?.[1]??i,a=u===null?void 0:Fn(u[2]??"");t.push(a===void 0?d:j("a",{href:a,rel:"noreferrer noopener"},d))}n=o+i.length}return n<e.length&&t.push(e.slice(n)),t}var kt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,St=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Pt=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Xe=/^\s{0,3}>\s?(.*)$/u,Ze=/^\s{0,3}[-*+]\s+(.*)$/u,Je=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Tn(e){return kt.test(e)||St.test(e)||Pt.test(e)||Xe.test(e)||Ze.test(e)||Je.test(e)}function Ct(e){let t=[],n=0;for(;n<e.length;){let r=e[n]??"";if(r.trim()===""){n+=1;continue}let o=kt.exec(r);if(o!==null){let l=(o[1]??"```").slice(0,1),s=o[2]??"",p=[];for(n+=1;n<e.length&&!new RegExp(`^\\s{0,3}${l}{3,}\\s*$`,"u").test(e[n]??"");)p.push(e[n]??""),n+=1;n+=1,t.push(j("pre",null,j("code",s===""?null:{className:`language-${s}`},p.join(`
`))));continue}let i=St.exec(r);if(i!==null){let l=(i[1]??"#").length;t.push(j(`h${String(l)}`,null,...J(i[2]??""))),n+=1;continue}if(Pt.test(r)){t.push(j("hr",null)),n+=1;continue}if(Xe.test(r)){let l=[];for(;n<e.length;){let s=Xe.exec(e[n]??"");if(s===null)break;l.push(s[1]??""),n+=1}t.push(j("blockquote",null,...Ct(l)));continue}if(Ze.exec(r)!==null){let l=[];for(;n<e.length;){let s=Ze.exec(e[n]??"");if(s===null)break;l.push(j("li",null,...J(s[1]??""))),n+=1}t.push(j("ul",null,...l));continue}if(Je.exec(r)!==null){let l=[];for(;n<e.length;){let s=Je.exec(e[n]??"");if(s===null)break;l.push(j("li",null,...J(s[1]??""))),n+=1}t.push(j("ol",null,...l));continue}let a=[r.trim()];for(n+=1;n<e.length;){let l=e[n]??"";if(l.trim()===""||Tn(l))break;a.push(l.trim()),n+=1}t.push(j("p",null,...J(a.join(" "))))}return t}function Re(e){let t=e.replace(/\r\n?/gu,`
`).split(`
`);return j("div",{className:"fx-md"},...Ct(t))}var Ln=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Qe(e){let t=e.slice(e.lastIndexOf("/")+1),n=t.lastIndexOf(".");if(n<=0)return null;let r=t.slice(n+1).toLowerCase();return Ln.find(o=>o.extensions.includes(r))?.family??null}var et=200,Nn={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function ue(e){let t=e.toLowerCase(),n=t.slice(t.lastIndexOf("/")+1),r=n.lastIndexOf(".");return r<=0?"plaintext":Nn[n.slice(r+1)]??"plaintext"}function Fe(e){return ue(e)==="markdown"}var Q=class extends Error{code;detail;constructor(t,n,r=""){super(n),this.name="PreviewReadError",this.code=t,this.detail=r}};function de(e){return e!==null&&typeof e=="object"}function Mn(e){return e===""?0:e.split(`
`).length}function tt(e,t){if(!de(e))throw new Q("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let d=de(e.error)?e.error:{},a=typeof d.code=="string"?d.code:"preview/unknown",l=typeof d.message=="string"?d.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=de(d.details)?d.details:{},p=typeof s.kind=="string"?s.kind:"";throw new Q(a,l,p)}let n=e.ok===!0?e.value:e;if(!de(n)||typeof n.text!="string")throw new Q("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof n.lines=="number"&&Number.isFinite(n.lines)?Math.max(0,Math.trunc(n.lines)):Mn(n.text),o=typeof n.totalLines=="number"&&Number.isFinite(n.totalLines)&&n.totalLines>0?Math.trunc(n.totalLines):void 0,i=typeof n.offset=="number"&&Number.isFinite(n.offset)&&n.offset>0?Math.trunc(n.offset):t,u=n.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:n.text,lines:r,offset:i,eof:u}:{text:n.text,lines:r,offset:i,totalLines:o,eof:u}}function fe(e){let t=de(e)?e:{},n=typeof t.code=="string"?t.code:"",r=typeof t.detail=="string"?t.detail:"",o=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${n} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:n,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:n,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:n,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:n,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:n,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:n,message:o}:i.includes("unavailable")?{kind:"unavailable",code:n,message:o}:{kind:"unknown",code:n,message:o}}var ce=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Ee({files:e,maxLines:t=et}){let n=Math.max(1,Math.trunc(t)),r=ce,o=0,i=null,u=[1],d=new Set,a=s=>{r=s;for(let p of d)p()},l=async(s,p)=>{o+=1;let C=o;i?.abort();let v=new AbortController;i=v,a({status:"loading",path:s,text:r.path===s?r.text:"",offset:p,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let b=await e.read(s,p>1?{offset:p,limit:n}:{limit:n},v.signal);if(C!==o)return;let h=tt(b,p);if(h.lines===0&&p>1){a({...r,status:"ready",eof:!0,text:"",lines:0});return}a(h.totalLines===void 0?{status:"ready",path:s,text:h.text,offset:h.offset,lines:h.lines,eof:h.eof}:{status:"ready",path:s,text:h.text,offset:h.offset,lines:h.lines,totalLines:h.totalLines,eof:h.eof})}catch(b){if(C!==o||v.signal.aborted)return;a({status:"failed",path:s,text:"",offset:p,lines:0,eof:!1,failure:fe(b)})}};return{maxLines:n,getSnapshot:()=>r,subscribe(s){return d.add(s),()=>{d.delete(s)}},async open(s){u=[1],await l(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(u.push(s),await l(r.path,s))},async prev(){if(r.path===void 0||u.length<=1)return;u=u.slice(0,-1);let s=u[u.length-1]??1;await l(r.path,s)},async retry(){r.path!==void 0&&await l(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,u=[1],a(ce)}}}function Te(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let t=e.offset+e.lines-1,n=`${String(e.offset)}\u2013${String(t)}`;return e.totalLines===void 0?{range:n}:{range:n,total:String(e.totalLines)}}var nt=Object.freeze({chunk:qe.chunk,id:`${Z}/${qe.chunk}`}),rt=null,pe=null,Le=new Map;function Rt(e){rt=e}function Ft(){return nt}function In(e){let t=ct[e];return{chunk:t,id:`${Z}/${t}`}}function Et(){if(pe!==null)return pe;let e=rt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Z}: the loader require was not handed over`));let t=e.async(`./${nt.chunk}`).then(n=>{let r=n;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Z}: chunk ${nt.id} is missing its preview renderers`);return r});return pe=t,t.catch(()=>{pe===t&&(pe=null)}),t}function Tt(e){let t=Le.get(e);if(t!==void 0)return t;let n=rt;if(n===null||typeof n.async!="function")return Promise.reject(new Error(`${Z}: the loader require was not handed over`));let r=In(e),o=n.async(`./${r.chunk}`).then(i=>{let u=i;if(u===null||typeof u.FamilyView!="function"||u.renderer!==e)throw new Error(`${Z}: chunk ${r.id} is not the ${e} view`);return u});return Le.set(e,o),o.catch(()=>{Le.get(e)===o&&Le.delete(e)}),o}var Lt="dsh-fs-explorer-styles",jn=`
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
  --fx-syn-keyword: var(--dsw-alias-state-business-primary, currentColor);
  --fx-syn-string: var(--dsw-alias-state-success-primary, currentColor);
  --fx-syn-number: var(--dsw-alias-state-warn-primary, currentColor);
  --fx-syn-comment: var(--fx-caption);
  --fx-syn-function: color-mix(in oklab, var(--fx-accent) 65%, var(--dsw-alias-state-success-primary, currentColor));
  --fx-syn-type: var(--dsw-alias-state-error-primary, currentColor);
  --fx-syn-property: var(--dsw-alias-label-secondary, currentColor);
  --fx-syn-heading: var(--fx-text);
  --fx-syn-link: var(--fx-accent);
  --fx-syn-invalid: var(--dsw-alias-state-error-primary, currentColor);
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

.fx-main { display: flex; flex-direction: row; flex: 1; min-height: 0; }
.fx-tree-pane {
  display: flex;
  flex-direction: column;
  flex: 0 0 clamp(220px, 34%, 380px);
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--fx-border-soft);
}
.fx-editor {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}
.fx-tabs {
  display: flex;
  align-items: stretch;
  flex: none;
  height: 32px;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid var(--fx-border-soft);
  scrollbar-width: none;
}
.fx-tabs::-webkit-scrollbar { display: none; }
.fx-tab {
  position: relative;
  display: flex;
  align-items: center;
  flex: none;
  max-width: 220px;
  border-right: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
}
.fx-tab:hover { background: var(--fx-hover); }
.fx-tab[data-active="true"] { background: var(--fx-panel-2); color: var(--fx-text); }
.fx-tab[data-active="true"]::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--fx-accent);
}
.fx-tab-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 100%;
  padding: 0 2px 0 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.fx-tab-main:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }
.fx-tab-badge { width: 16px; height: 14px; }
.fx-tab-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
}
.fx-tab:hover .fx-tab-close,
.fx-tab[data-active="true"] .fx-tab-close,
.fx-tab-close:focus-visible { opacity: 1; }
.fx-tab-close:hover { background: var(--fx-active); color: var(--fx-text); }
.fx-tab-close:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-editor-body {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}
.fx-panel {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}
.fx-panel[hidden] { display: none; }
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
.fx-row[data-cursor="true"] { outline: 1.5px solid var(--fx-accent); outline-offset: -1.5px; z-index: 1; }
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
.fx-editor-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  margin: 12px;
  padding: 24px;
  border: 1px dashed var(--fx-border);
  border-radius: 10px;
  color: var(--fx-text-2);
  text-align: center;
}
.fx-editor-glyph { color: var(--fx-folder); opacity: .7; }
.fx-editor-empty strong { color: var(--fx-text); font-size: 13px; font-weight: 600; }
.fx-editor-empty > span { color: var(--fx-caption); font-size: 11px; max-width: 48ch; }
.fx-empty-keys {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 4px;
}
.fx-kbd {
  font-family: var(--fx-mono);
  font-size: 9.5px;
  line-height: 1.4;
  padding: 1px 5px;
  border: 1px solid var(--fx-border);
  border-radius: 4px;
  background: var(--fx-panel-2);
  color: var(--fx-text-2);
}
.fx-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 16px;
  color: var(--fx-caption);
  font-size: 11px;
}

.fx-preview {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
}
.fx-preview-empty { margin: 12px; }
.fx-preview-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 34px;
  padding: 0 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  min-width: 0;
}
.fx-preview-path {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--fx-mono);
  font-size: 11px;
  color: var(--fx-text-2);
}
.fx-preview-range {
  flex: none;
  font-family: var(--fx-mono);
  font-size: 10.5px;
  color: var(--fx-caption);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-preview-total { opacity: .7; }
.fx-preview-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.fx-pbtn {
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: 10.5px;
  white-space: nowrap;
  cursor: pointer;
}
.fx-pbtn:hover:not(:disabled) { background: var(--fx-hover); color: var(--fx-text); border-color: var(--fx-border); }
.fx-pbtn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }
.fx-pbtn:disabled { opacity: .35; cursor: default; }
.fx-preview-body { flex: 1; min-height: 0; position: relative; }
.fx-preview-body[data-scroll="y"] {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.fx-preview-body[data-scroll="none"] { overflow: hidden; }
.fx-preview-read { height: 100%; }
.fx-preview-hint {
  max-width: 60ch;
  font-family: var(--fx-mono);
  font-size: 10px;
  color: var(--fx-caption);
  overflow-wrap: anywhere;
}
.fx-code-host { height: 100%; min-height: 0; }
.fx-code-host .cm-editor { height: 100%; }
.fx-code-host .cm-editor .cm-line { padding-left: 4px; }
/* The family renderers size themselves against a parent with a definite height,
   and their own stylesheet (claimed by the chunk) only gives the surface
   height: 100% \u2014 so this box is what turns the preview body into that height. */
.fx-family { height: 100%; min-height: 0; display: flex; flex-direction: column; }
.fx-pre {
  margin: 0;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding: 12px 16px 40px;
  font-family: var(--fx-mono);
  font-size: 12px;
  line-height: 1.55;
  white-space: pre;
  tab-size: 4;
}

.fx-md {
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px 24px 64px;
  font-size: 13px;
  line-height: 1.72;
  color: var(--fx-text);
  overflow-wrap: anywhere;
}
.fx-md > :first-child { margin-top: 0; }
.fx-md h1, .fx-md h2, .fx-md h3, .fx-md h4, .fx-md h5, .fx-md h6 {
  margin: 1.5em 0 .6em;
  line-height: 1.3;
  font-weight: 600;
}
.fx-md h1 { font-size: 1.55em; padding-bottom: .3em; border-bottom: 1px solid var(--fx-border-soft); }
.fx-md h2 { font-size: 1.3em; }
.fx-md h3 { font-size: 1.12em; }
.fx-md p { margin: .8em 0; }
.fx-md ul, .fx-md ol { margin: .8em 0; padding-left: 1.5em; }
.fx-md li { margin: .25em 0; }
.fx-md li > ul, .fx-md li > ol { margin: .25em 0; }
.fx-md a { color: var(--fx-accent); text-decoration: none; }
.fx-md a:hover { text-decoration: underline; }
.fx-md code {
  font-family: var(--fx-mono);
  font-size: .92em;
}
.fx-md :not(pre) > code {
  padding: 1px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 9%, transparent);
}
.fx-md pre {
  overflow-x: auto;
  margin: 1em 0;
  padding: 10px 14px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 8px;
  background: var(--fx-panel-2);
  line-height: 1.55;
}
.fx-md pre code { display: block; white-space: pre; }
.fx-md blockquote {
  margin: 1em 0;
  padding: .2em 1em;
  border-left: 3px solid var(--fx-border);
  color: var(--fx-text-2);
}
.fx-md hr { margin: 1.6em 0; border: 0; border-top: 1px solid var(--fx-border-soft); }
.fx-md table { display: block; overflow-x: auto; margin: 1em 0; border-collapse: collapse; }
.fx-md th, .fx-md td { padding: 4px 10px; border: 1px solid var(--fx-border-soft); }
.fx-md th { background: var(--fx-panel-2); font-weight: 600; }
.fx-md img { max-width: 100%; }
.fx-md-img {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 10.5px;
}
.fx-md input[type="checkbox"] { margin-right: .45em; vertical-align: middle; }

@media (max-width: 760px) {
  .fx-main { flex-direction: column; }
  .fx-tree-pane {
    flex: 0 0 45%;
    border-right: 0;
    border-bottom: 1px solid var(--fx-border-soft);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fx-chevron { transition: none; }
  .fx-spinner { animation-duration: 1.6s; }
}
`;function Nt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Lt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Lt,n.textContent=jn,e.head.appendChild(n),()=>{n.remove()}}var w=require("react");var Ne=require("react");var T=require("react/jsx-runtime");function Mt({panels:e,active:t,t:n,onActivate:r,onClose:o,onStep:i}){let u=(0,Ne.useRef)(null);if((0,Ne.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[t]),e.length===0)return null;let d=a=>{if(a.key==="ArrowRight"||a.key==="ArrowLeft"){a.preventDefault(),a.stopPropagation(),i(a.key==="ArrowRight"?1:-1);return}(a.key==="Delete"||a.key==="Backspace")&&t!==null&&(a.preventDefault(),a.stopPropagation(),o(t))};return(0,T.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":n("panel.tabs"),onKeyDown:d,"data-testid":"fs-tabs",children:e.map((a,l)=>{let s=a.path===t,p=ht(a.path),C=n("panel.close").replace("{name}",p);return(0,T.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,T.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${l}`,"aria-controls":`fx-panel-${l}`,"aria-selected":s,tabIndex:s?0:-1,title:a.path,"data-testid":"fs-tab","data-path":a.path,ref:s?u:void 0,onClick:()=>r(a.path),children:[(0,T.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":te(a.path),"aria-hidden":"true",children:ne(a.path)}),(0,T.jsx)("span",{className:"fx-tab-name",children:p})]}),(0,T.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":C,title:C,"data-testid":"fs-tab-close",onClick:()=>o(a.path),children:"\xD7"})]},a.path)})})}function zn(){return(0,T.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,T.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,T.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function It({t:e}){return(0,T.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,T.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,T.jsx)(zn,{})}),(0,T.jsx)("strong",{children:e("panel.empty.title")}),(0,T.jsx)("span",{children:e("panel.empty.description")}),(0,T.jsxs)("span",{className:"fx-empty-keys",children:[(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,T.jsx)("span",{children:e("panel.empty.keys")})]})]})}var P=require("react");async function jt(e){let t=typeof navigator>"u"?void 0:navigator.clipboard;if(t!==void 0&&typeof t.writeText=="function")try{return await t.writeText(e),!0}catch{}if(typeof document>"u")return!1;let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}var H=require("react/jsx-runtime");function An(e,t){switch(e.kind){case"deleted":return t("preview.deleted.title");case"denied":return t("preview.denied.title");case"symlink":return t("preview.symlink.title");case"binary":return t("preview.binary.title");case"too-large":return t("preview.tooLarge.title");case"unavailable":return t("preview.unavailable.title");default:return t("preview.unknown.title")}}function Dn(e,t){switch(e.kind){case"deleted":return t("preview.deleted.description");case"denied":return t("preview.denied.description");case"symlink":return t("preview.symlink.description");case"binary":return t("preview.binary.description");case"too-large":return t("preview.tooLarge.description");case"unavailable":return t("preview.unavailable.description");default:return t("preview.unknown.description")}}function ot({failure:e,t,onRetry:n}){return(0,H.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,H.jsx)("strong",{children:An(e,t)}),(0,H.jsx)("span",{children:Dn(e,t)}),e.message===""?null:(0,H.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,H.jsx)("button",{type:"button",className:"fx-btn",onClick:n,"data-testid":"fs-preview-retry",children:t("preview.retry")})]})}function it({t:e}){return(0,H.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,H.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}function Me(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function re(e){try{return e()}catch{return}}function At(e){return()=>{let t=re(()=>e.workspaceFiles);if(Me(t))return t;let n=re(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Me(n))return n;let r=re(()=>e.remote?.workspaceFiles);if(Me(r))return r;let o=re(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Me(o))return o}}function Dt(e,t){if(e===void 0||t===void 0)return;let n=e.read;if(typeof n=="function")return{read(r,o,i){return n.call(e,t,r,o,i)}}}function Ie(e){return e!==null&&typeof e=="object"}function On(e){if(!Ie(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let t=e.ok===!0?e.value:e,n=Ie(t)?t.data:void 0;return n instanceof Uint8Array?{ok:!0,value:{data:n}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Wn(e){let t=Ie(e)?e:{},n=typeof t.code=="string"?t.code:"preview/unknown",r=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Ie(t.details)?t.details:{},i=typeof o.kind=="string"?o.kind:"";return new Q(n,r,i)}function Ot(e){if(e===void 0)return;let t=e.readBytes;if(typeof t=="function")return async(n,r,o)=>{let i=On(await t.call(e,n,r,{},o));if(!i.ok)throw Wn(i.error);return i.value.data}}function me(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function at(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function je(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:me(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?at(r.value):{ok:!1,message:me(r.error)}}return at(n)}return at(t)}function Wt(e){return e instanceof Error?e.message:me(e)}function zt(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Kt(e){return()=>{let t=re(()=>e.remote?.gitExplorer);if(zt(t))return t;let n=re(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(zt(n))return n}}function st(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return typeof t.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:t.isRepository===!1?"":t.status}}function ze(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:me(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?st(o.snapshot):{ok:!1,message:me(o.error)}}let r=e;return r.snapshot!==void 0?st(r.snapshot):st(n)}var x=require("react/jsx-runtime");function Kn({chunk:e,text:t,path:n,offset:r}){let o=(0,P.useRef)(null),i=(0,P.useRef)(null),[u,d]=(0,P.useState)(!1),a=ue(n);return(0,P.useEffect)(()=>{d(!1)},[e,n]),(0,P.useEffect)(()=>{let l=o.current;if(!(e===null||l===null))try{let s=e.mountCodePreview(l,{text:t,language:a,path:n,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{d(!0);return}},[e,n,a]),(0,P.useEffect)(()=>{i.current?.update(t,r)},[t,r,e]),e===null||u?(0,x.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:t}):(0,x.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function _t({sessionId:e,files:t,path:n,t:r}){let o=(0,P.useMemo)(()=>Dt(t,e),[t,e]),i=(0,P.useMemo)(()=>Ot(t),[t]),u=n===void 0?null:Qe(n),[d,a]=(0,P.useState)(null),[l,s]=(0,P.useState)(ce),[p,C]=(0,P.useState)(null),[v,b]=(0,P.useState)(null),[h,U]=(0,P.useState)(null),[K,D]=(0,P.useState)(0),[c,g]=(0,P.useState)("reading"),[k,F]=(0,P.useState)(!1),I=(0,P.useRef)(void 0);if((0,P.useEffect)(()=>{if(o===void 0){a(null);return}let N=Ee({files:o,maxLines:et});return a(N),()=>N.close()},[o]),(0,P.useEffect)(()=>{if(d===null){s(ce);return}return s(d.getSnapshot()),d.subscribe(()=>s(d.getSnapshot()))},[d]),(0,P.useEffect)(()=>{d===null||n===void 0||u!==null||d.open(n)},[d,n,u]),(0,P.useEffect)(()=>{g("reading"),F(!1)},[n]),(0,P.useEffect)(()=>()=>{I.current!==void 0&&clearTimeout(I.current)},[]),(0,P.useEffect)(()=>{if(n===void 0||u!==null)return;let N=!0;return Et().then(q=>{N&&C(q)}).catch(()=>{N&&C(null)}),()=>{N=!1}},[n,u]),(0,P.useEffect)(()=>{if(u===null)return;let N=!0;return b(null),U(null),Tt(u).then(q=>{N&&b(q)}).catch(q=>{N&&U(fe(q))}),()=>{N=!1}},[u,K]),n===void 0)return(0,x.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,x.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,x.jsx)("strong",{children:r("preview.empty.title")}),(0,x.jsx)("span",{children:r("preview.empty.description")})]})});let z=u!==null,_=e!==void 0&&i!==void 0?{sessionId:e,readFile:i}:null,O=z&&_===null,B=Te(l),W=!z&&Fe(n),E=z?!O&&v===null&&h===null:l.status==="loading",ee=l.status==="ready",Y=W&&c==="reading",Oe=z?O?"unavailable":h!==null?"failed":v===null?"loading":"ready":l.status,X=()=>{jt(n).then(N=>{N&&(F(!0),I.current!==void 0&&clearTimeout(I.current),I.current=setTimeout(()=>F(!1),1400))})},V;return z?V=_===null?(0,x.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,x.jsx)("strong",{children:r("preview.unavailable.title")}),(0,x.jsx)("span",{children:r("preview.unavailable.description")})]}):h!==null?(0,x.jsx)(ot,{failure:h,t:r,onRetry:()=>D(N=>N+1)}):v===null?(0,x.jsx)(it,{t:r}):(0,x.jsx)(v.FamilyView,{path:n,sessionId:_.sessionId,readFile:_.readFile,t:r}):o===void 0?V=(0,x.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,x.jsx)("strong",{children:r("preview.unavailable.title")}),(0,x.jsx)("span",{children:r("preview.unavailable.description")})]}):l.status==="failed"?V=(0,x.jsx)(ot,{failure:l.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{d?.retry()}}):ee?Y?V=p===null?(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Re(l.text)}):(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,x.jsx)(p.MarkdownView,{text:l.text})}):V=(0,x.jsx)(Kn,{chunk:p,text:l.text,path:n,offset:l.offset}):V=(0,x.jsx)(it,{t:r}),(0,x.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Oe,"data-mode":z?"binary":Y?"reading":"code","data-renderer":z?v?.renderer??"pending":Y?p===null?"fallback":"gfm":p?.renderer??"plain",children:[(0,x.jsxs)("header",{className:"fx-preview-bar",children:[(0,x.jsx)("span",{className:"fx-preview-path",title:n,"data-testid":"fs-preview-path",children:n}),z?null:(0,x.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[B.range,B.range==="\u2014"?null:(0,x.jsxs)(x.Fragment,{children:[" ",r("preview.lines")]}),B.total===void 0?null:(0,x.jsxs)("span",{className:"fx-preview-total",children:[" / ",B.total," ",r("preview.lines")]})]}),(0,x.jsxs)("div",{className:"fx-preview-actions",children:[W?(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>g(N=>N==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(c==="reading"?"preview.source":"preview.reading")}):null,z?null:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ee||E||l.offset<=1,onClick:()=>{d?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ee||E||l.eof,onClick:()=>{d?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:X,"data-testid":"fs-preview-copy",children:r(k?"preview.copied":"preview.copyPath")}),E?(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,x.jsx)("div",{className:"fx-preview-body","data-scroll":Y?"y":"none",children:V})]})}var M=require("react");var y=require("react/jsx-runtime"),G=22;function lt({open:e=!0,size:t=14}){return(0,y.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,y.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function _n(){return(0,y.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Vt(){return(0,y.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,y.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,y.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function $t(){return(0,y.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Vn({name:e}){return(0,y.jsx)("span",{className:"fx-badge","data-icon":te(e),"aria-hidden":"true",children:ne(e)})}function $n({row:e,selected:t,cursor:n,top:r,t:o,onToggle:i,onSelect:u,onRowActivate:d}){let a=e.kind==="directory",l={top:r,paddingLeft:8+e.depth*12};return(0,y.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-cursor":n?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{d(e.path),a?i(e.path):u(e.path)},children:[(0,y.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,y.jsx)(_n,{})}),a?(0,y.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,y.jsx)(lt,{open:e.expanded})}):(0,y.jsx)(Vn,{name:e.name}),(0,y.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,y.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":ie(e.status),"data-testid":"fx-file-status",title:o(Ge(e.status)),"aria-label":o(Ge(e.status)),children:he(e.status)}),e.statusCount===void 0?null:(0,y.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,y.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,y.jsx)("span",{className:"fx-size",children:Ce(e.size)})]})}function Hn({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,y.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,y.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,y.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,y.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,y.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function Ht({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:i}){let u=(0,M.useRef)(null),[d,a]=(0,M.useState)(0),[l,s]=(0,M.useState)(0),[p,C]=(0,M.useState)(void 0),v=(0,M.useMemo)(()=>e.flatMap((c,g)=>c.type==="entry"?[g]:[]),[e]);(0,M.useEffect)(()=>{if(t===void 0)return;let c=e.findIndex(g=>g.type==="entry"&&g.path===t);c>=0&&C(c)},[t,e]),(0,M.useEffect)(()=>{p!==void 0&&e[p]?.type!=="entry"&&C(void 0)},[e,p]),(0,M.useEffect)(()=>{let c=u.current;if(p===void 0||c===null)return;let g=p*G;g<c.scrollTop?c.scrollTop=g:g+G>c.scrollTop+c.clientHeight&&(c.scrollTop=g+G-c.clientHeight)},[p]);let b=(0,M.useCallback)(c=>{C(c),u.current?.focus({preventScroll:!0})},[]),h=(0,M.useCallback)(c=>{let g=e.findIndex(k=>k.type==="entry"&&k.path===c);g>=0&&C(g)},[e]),U=(0,M.useCallback)(c=>{if(c.nativeEvent.isComposing||c.altKey||c.metaKey||c.ctrlKey)return;let g=v.at(-1);if(c.key==="ArrowDown"){if(c.preventDefault(),p===void 0){v[0]!==void 0&&b(v[0]);return}let F=v.find(I=>I>p);F!==void 0&&b(F);return}if(c.key==="ArrowUp"){if(c.preventDefault(),p===void 0){g!==void 0&&b(g);return}let F=[...v].reverse().find(I=>I<p);F!==void 0&&b(F);return}if(p===void 0)return;let k=e[p];if(!(k===void 0||k.type!=="entry")){if(c.key==="ArrowRight"){if(c.preventDefault(),k.kind==="directory"&&!k.expanded)r(k.path);else{let F=v.find(I=>I>p);F!==void 0&&e[F]?.depth===k.depth+1&&b(F)}return}if(c.key==="ArrowLeft"){if(c.preventDefault(),k.kind==="directory"&&k.expanded)r(k.path);else{let F=[...v].reverse().find(I=>I<p&&e[I]?.type==="entry"&&e[I].depth<k.depth);F!==void 0&&b(F)}return}if(c.key==="Enter"&&k.kind!=="directory"){c.preventDefault(),o(k.path);return}if(c.key==="Home"){c.preventDefault(),v[0]!==void 0&&b(v[0]);return}c.key==="End"&&(c.preventDefault(),g!==void 0&&b(g))}},[p,v,b,r,o,e]);(0,M.useEffect)(()=>{let c=u.current;if(c===null)return;let g=()=>s(c.clientHeight);if(g(),typeof ResizeObserver>"u")return;let k=new ResizeObserver(g);return k.observe(c),()=>k.disconnect()},[]),(0,M.useEffect)(()=>{if(t===void 0)return;let c=u.current;if(c===null)return;let g=e.findIndex(F=>F.type==="entry"&&F.path===t);if(g<0)return;let k=g*G;(k<c.scrollTop||k+G>c.scrollTop+c.clientHeight)&&(c.scrollTop=Math.max(0,k-c.clientHeight/2))},[t,e]);let K=c=>{a(c.currentTarget.scrollTop)},D=be(e,{scrollTop:d,height:l===0?480:l,rowHeight:G});return(0,y.jsx)("div",{className:"fx-scroll",ref:u,onScroll:K,onKeyDown:U,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,y.jsx)("div",{className:"fx-vlist",style:{height:e.length*G},children:D.rows.map((c,g)=>{let k=(D.startIndex+g)*G;return c.type==="entry"?(0,y.jsx)($n,{row:c,top:k,selected:c.path===t,cursor:p===D.startIndex+g,t:n,onToggle:r,onSelect:o,onRowActivate:h},c.path):(0,y.jsx)(Hn,{row:c,top:k,t:n,onRetry:i},c.key)})})})}var m=require("react/jsx-runtime");var Bn=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ae({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,m.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,m.jsx)("strong",{children:e}),t===void 0?null:(0,m.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,m.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function Bt({workbench:e,version:t,t:n,files:r,status:o}){let i=wt();function u(d){let a=d.sessionId??e.currentSessionId(),l=(0,w.useRef)(a);l.current=a;let s=(0,w.useMemo)(()=>r(),[r]),p=(0,w.useMemo)(()=>o(),[o]),[C,v]=(0,w.useState)(()=>new Map),[b,h]=(0,w.useState)(void 0),U=(0,w.useRef)(C);U.current=C;let[K,D]=(0,w.useState)(()=>new Set),c=(0,w.useMemo)(()=>i.forSession(a),[i,a]),g=(0,w.useSyncExternalStore)(c.subscribe,c.snapshot,c.snapshot),k=g.active??void 0,[F,I]=(0,w.useState)(0),[z,_]=(0,w.useState)(void 0),O=(0,w.useRef)(new Map),B=(0,w.useRef)(void 0),W=(0,w.useCallback)(async(f,S,R)=>{O.current.get(f)?.abort();let L=new AbortController;O.current.set(f,L),v($=>new Map($).set(f,Bn()));try{let $=await R.list(S,ke(f),L.signal);if(L.signal.aborted||l.current!==S)return!1;let A=je($);if(!A.ok)return v(Ke=>new Map(Ke).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:A.message})),!1;let We=we(A.listing.entries);return v(Ke=>new Map(Ke).set(f,{status:"ready",nodes:We,truncated:A.listing.truncated===!0,total:A.listing.entries.length})),!0}catch($){return L.signal.aborted||v(A=>new Map(A).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:Wt($)})),!1}finally{O.current.get(f)===L&&O.current.delete(f)}},[]);(0,w.useEffect)(()=>{for(let f of O.current.values())f.abort();return O.current.clear(),v(new Map),D(new Set),_(void 0),B.current=void 0,a!==void 0&&s!==void 0&&W("",a,s),()=>{for(let f of O.current.values())f.abort();O.current.clear()}},[a,s,F,W]),(0,w.useEffect)(()=>{if(a===void 0||p===void 0){h(void 0);return}let f=!0,S=new AbortController;return h(void 0),Promise.resolve().then(()=>p.snapshot({sessionId:a,maxCommits:1},S.signal)).then(R=>{if(!f)return;let L=ze(R);h(L.ok?ve(L.status):void 0)}).catch(()=>{f&&h(void 0)}),()=>{f=!1,S.abort()}},[a,p,F]),(0,w.useEffect)(()=>{let f=d.viewRequest;if(f==null||f.view!==oe)return;let S=`${f.view}:${f.focus}`;B.current!==S&&(B.current=S,le(f.focus,{open:(R,L)=>{c.open(R,L),_({path:R,line:L})}}),d.completeViewRequest?.())},[d.viewRequest,d.completeViewRequest,c]),(0,w.useEffect)(()=>{let f=e.viewFocus;if(f===void 0||a===void 0)return;let S=()=>{let R=f.take(oe);R!==void 0&&le(R,{open:(L,$)=>{c.open(L,$),_({path:L,line:$})}})};return S(),f.subscribe(S)},[e,a,c]);let E=C.get(""),ee=E?.status==="ready";(0,w.useEffect)(()=>{if(z===void 0||a===void 0||s===void 0||!ee)return;let f=!0,S=z.path.split("/").filter(Boolean),R=[],L="";for(let A of S.slice(0,-1))L=se(L,A),R.push(L);return R.length>0&&D(A=>new Set([...A,...R])),(async()=>{for(let A of R){if(U.current.get(A)?.status==="ready")continue;let We=await W(A,a,s);if(!f||!We)return}f&&(c.open(z.path,z.line),_(void 0))})(),()=>{f=!1}},[z,a,s,ee,W,c]);let Y=(0,w.useCallback)(()=>{if(typeof document>"u")return!1;let f=document.querySelector("[data-composer-input]");return f===null?!1:(f.focus(),!0)},[]);(0,w.useEffect)(()=>{if(typeof document>"u")return;let f=S=>{if(!(S.isComposing||ft(S.target))){for(let R of ye)if(ut(S,R)){if(R.action==="closePanel"&&c.snapshot().active===null)return;S.preventDefault(),S.stopPropagation(),R.action==="nextPanel"?c.next():R.action==="previousPanel"?c.previous():c.close();return}}};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[c]),(0,w.useEffect)(()=>{if(typeof document>"u")return;let f=ge({focusComposer:Y,hasModal:()=>pt(document)}),S=R=>f(R);return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[Y]);let Oe=(0,w.useMemo)(()=>Pe(C,K,b),[C,K,b]),X=b===void 0?void 0:Object.keys(b).length,V=b===void 0?"neutral":Object.values(b).some(f=>f.status==="conflicted")?"conflict":X===0?"success":"warning",N=(0,w.useCallback)(f=>{if(a===void 0||s===void 0)return;if(K.has(f)){D(R=>{let L=new Set(R);return L.delete(f),L});return}D(R=>new Set(R).add(f));let S=C.get(f);(S===void 0||S.status==="failed")&&W(f,a,s)},[K,C,a,s,W]),q=(0,w.useCallback)(f=>{a===void 0||s===void 0||W(f,a,s)},[a,s,W]),Xt=()=>D(new Set),Zt=()=>I(f=>f+1),Jt=a===void 0?"no-session":s===void 0?"no-service":E===void 0||E.status==="loading"?"loading":E.status==="failed"?"failed":E.nodes.length===0?"empty":"tree";return(0,m.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":Jt,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,m.jsxs)("header",{className:"fx-head",children:[(0,m.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,m.jsx)(lt,{open:!0})}),(0,m.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,m.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,m.jsxs)("div",{className:"fx-head-meta",children:[E?.status==="ready"?(0,m.jsxs)("span",{children:[(0,m.jsx)("b",{children:E.nodes.length})," ",n("head.entries")]}):null,(0,m.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:K.size===0,onClick:Xt,children:(0,m.jsx)($t,{})}),(0,m.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:a===void 0||s===void 0||E?.status==="loading",onClick:Zt,children:(0,m.jsx)(Vt,{})})]})]}),(0,m.jsx)("div",{className:"fx-main",children:a===void 0?(0,m.jsx)(Ae,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,m.jsx)(Ae,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):E===void 0||E.status==="loading"?(0,m.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,m.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):E.status==="failed"?(0,m.jsx)(Ae,{title:n("state.failed.title"),description:E.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>q(""),testId:"fs-failed"}):E.nodes.length===0?(0,m.jsx)(Ae,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"fx-tree-pane",children:(0,m.jsx)(Ht,{rows:Oe,selectedPath:k,t:n,onToggle:N,onSelect:f=>c.open(f),onRetry:q})}),(0,m.jsxs)("div",{className:"fx-editor",children:[(0,m.jsx)(Mt,{panels:g.panels,active:g.active,t:n,onActivate:f=>c.activate(f),onClose:f=>c.close(f),onStep:f=>f===1?c.next():c.previous()}),(0,m.jsx)("div",{className:"fx-editor-body",children:g.panels.length===0?(0,m.jsx)(It,{t:n}):g.panels.map((f,S)=>(0,m.jsx)("div",{className:"fx-panel",id:`fx-panel-${S}`,role:"tabpanel","aria-labelledby":`fx-tab-${S}`,hidden:f.path!==g.active,"data-line":f.line,"data-testid":"fs-panel",children:(0,m.jsx)(_t,{sessionId:a,files:s,path:f.path,t:n})},f.path))})]})]})}),E?.status==="ready"?(0,m.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,m.jsxs)("span",{children:[n("view.scope")," ",(0,m.jsx)("b",{children:E.nodes.length})," ",n("head.entries")]}),E.truncated?(0,m.jsx)("span",{className:"fx-foot-warn",children:ae({entries:E.nodes,truncated:!0,total:E.total}).label}):null,(0,m.jsxs)("span",{className:"fx-foot-git","data-state":X===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,m.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":V,"aria-hidden":"true"}),X===void 0?n("status.unavailable"):X===0?n("status.clean"):n("status.summary").replace("{count}",String(X))]}),(0,m.jsx)("span",{className:"fx-spacer"}),(0,m.jsx)("span",{children:n("foot.order")})]}):null]})}return u}var qt=["slots","locale","workbench","remote"];function Gn(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"en"}var De;function Gt(e){let t=e.workbench;if(t==null)return()=>{};De?.();let n=e.locale.register(xe,{zh:Ve,en:$e});De=n;let r=e.locale.bind(xe),o=Nt(typeof document>"u"?void 0:document),i=Bt({workbench:t,version:t.version,t:r,files:At(e),status:Kt(e)});return e.slots.inject(Be,()=>e.slots.register({name:Be,id:oe,order:100,label:()=>He(Gn(e)),locale:xe},i)),()=>{o(),n(),De===n&&(De=void 0)}}var Ut={buildTree:we,describeListing:ae,iconFor:te,computeTreeWindow:be,flattenTree:Pe,badgeFor:ne,formatSize:Ce,joinPath:se,listingPath:ke,parseFocus:Se,consumeViewRequest:le,createPanelStack:Ye,createEscapeHandler:ge,KEYMAP:ye,tabLabel:He,normalizeListing:je,normalizeStatusSnapshot:ze,parseStatusZ:ve,statusTone:ie,statusBadge:he,createPreviewLoader:Ee,renderMarkdown:Re,languageFor:ue,isMarkdownFile:Fe,describePage:Te,classifyPreviewFailure:fe,normalizePreviewPage:tt,previewChunkRoute:Ft},Yt={name:"dsh-fs-explorer",inject:qt,apply:Gt,__test:Ut};var Un=Yt;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
