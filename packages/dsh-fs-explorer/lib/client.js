window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ne=Object.defineProperty;var Vt=Object.getOwnPropertyDescriptor;var $t=Object.getOwnPropertyNames;var Ht=Object.prototype.hasOwnProperty;var qt=(e,t)=>{for(var n in t)Ne(e,n,{get:t[n],enumerable:!0})},Gt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of $t(t))!Ht.call(e,o)&&o!==n&&Ne(e,o,{get:()=>t[o],enumerable:!(r=Vt(t,o))||r.enumerable});return e};var Bt=e=>Gt(Ne({},"__esModule",{value:!0}),e);var zn={};qt(zn,{__test:()=>jt,apply:()=>It,boot:()=>xt,clientPlugin:()=>zt,default:()=>jn,inject:()=>Mt});module.exports=Bt(zn);var Fe={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002"},Me={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file."};function Ie(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Fe:Me)["tab.label"]??"Files"}var ae="dsh-fs-explorer",je="conversation.view",G="fs-explorer";var ie="fs-explorer",Ze="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",ze={chunk:"client.preview.js"};var se=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ut(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",t=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(t)?"mac":"other"}function Je(e,t,n=Ut()){if(e.isComposing===!0||e.code!==t.code)return!1;let r=t.modifiers,o=r.includes("meta")||r.includes("primary")&&n==="mac",a=r.includes("control")||r.includes("primary")&&n!=="mac",c=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===a&&e.altKey===!0===c&&e.shiftKey===!0===l}function Qe(e){if(e===null||typeof e!="object")return!1;let t=e;if(t.isContentEditable===!0)return!0;if(typeof t.tagName!="string")return!1;let n=t.tagName.toLowerCase();return n==="input"||n==="textarea"||n==="select"}function Xt(e){let t=e?.querySelector("[data-composer-input]");if(t==null||typeof t!="object")return!1;let n=t.focus;return typeof n!="function"?!1:(n.call(t),!0)}function et(e){let t=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return t!=null}function le(e){let t=e.doc??(typeof document>"u"?void 0:document);return n=>{if(n.key!=="Escape"||n.defaultPrevented===!0||n.isComposing===!0||e.hasModal())return;n.preventDefault(),e.focusComposer()!==!0&&Xt(t),e.onClose?.()}}var Yt={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Zt={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Jt=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function nt(e){return typeof e=="string"&&Jt.has(e)}function tt(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let a=e.indexOf(" ",r);if(a<0)return null;n.push(e.slice(r,a)),r=a+1}return{fields:n,rest:e.slice(r)}}function Qt(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function de(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let a=o[0];if(a==="?"){if(o[1]!==" ")continue;let c=o.slice(2);c!==""&&(t[c]={status:"untracked"});continue}if(a!=="!"){if(a==="1"||a==="2"){let c=tt(o.slice(2),a==="1"?7:8);if(c===null)continue;let l=c.fields[0]??"",i=c.rest;if(i===""||l.length<2)continue;if(a==="2"){let d=n[r+1];if(d===void 0||d==="")continue;r+=1,t[i]={status:"renamed"};continue}t[i]={status:Qt(l[0]??".",l[1]??".")};continue}if(a==="u"){let c=tt(o.slice(2),9);if(c===null)continue;let l=c.rest;if(l==="")continue;t[l]={status:"conflicted"}}}}return t}function B(e){return nt(e)?Yt[e]:"neutral"}function ce(e){return nt(e)?Zt[e]:"?"}function Ae(e){return`status.${e}`}function rt(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}var en=["conflicted","deleted","renamed","added","modified","untracked"];function tn(e){return B(en.find(t=>e.has(t))??"modified")}function ot(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let a=r.replace(/\/+$/u,"");if(a==="")continue;let c=a.split("/"),l=r.endsWith("/")?c.length:c.length-1,i="";for(let d=0;d<l;d+=1){let s=c[d];if(s===void 0||s==="")continue;i=i===""?s:`${i}/${s}`;let m=t.get(i);m===void 0?t.set(i,{count:1,present:new Set([o.status])}):(m.count+=1,m.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:tn(o.present)});return n}var nn=new Set(["node_modules",".git","dist","__pycache__"]);function rn(e){return nn.has(e)}function on(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ue(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||rn(r))continue;let o=on(n),a=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(a===void 0?{name:r,kind:o}:{name:r,kind:o,size:a})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var an=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),sn=new Set(["md","mdx","markdown","mdown","rst","adoc"]),ln=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),dn=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),cn=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),un=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),fn=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function at(e){let t=e.toLowerCase(),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function V(e,t="file"){if(t==="directory")return"folder";let n=e.toLowerCase();if(fn.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=at(n);return r===""?"file":an.has(r)?"code":sn.has(r)?"markdown":ln.has(r)?"data":dn.has(r)?"image":cn.has(r)?"style":un.has(r)?"archive":"file"}var pn={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},xn={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function $(e){let t=e.toLowerCase(),n=pn[t];if(n!==void 0)return n;let r=at(t),o=xn[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function U(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${Ze} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function fe(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),c=Math.max(0,e.length-a-o*2),l=Math.floor(Math.max(0,t.scrollTop)/n)-o,i=Math.min(Math.max(l,0),c),d=Math.min(e.length,i+a+o*2);return{rows:e.slice(i,d),startIndex:i,endIndex:d}}function pe(e){return e===""?".":e}function X(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function xe(e){if(typeof e!="string")return;let t=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(t===null)return;let r=(t[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let o=t[2]===void 0?1:Math.max(1,Number.parseInt(t[2],10));return{path:r,line:o}}function me(e,t,n){let r=[],o=ot(n),a=(c,l)=>{let i=e.get(c);if(!(i===void 0||i.status!=="ready"))for(let d of i.nodes){let s=X(c,d.name),m=d.kind==="directory",b=m&&t.has(s),x=m?void 0:rt(s,n),v=m?o.get(s):void 0;if(r.push({type:"entry",path:s,name:d.name,kind:d.kind,depth:l,expanded:b,...d.size===void 0?{}:{size:d.size},...x===void 0?{}:{status:x},...v===void 0?{}:{statusCount:v.count,statusTone:v.tone}}),!b)continue;let p=e.get(s);if(p===void 0||p.status==="loading"){r.push({type:"status",key:`${s}:loading`,path:s,depth:l+1,state:"loading"});continue}if(p.status==="failed"){r.push({type:"status",key:`${s}:failed`,path:s,depth:l+1,state:"failed",message:p.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(p.nodes.length===0){r.push({type:"status",key:`${s}:empty`,path:s,depth:l+1,state:"empty"});continue}a(s,l+1),p.truncated&&r.push({type:"status",key:`${s}:truncated`,path:s,depth:l+1,state:"truncated",label:U({entries:p.nodes,truncated:!0,total:p.total}).label})}};return a("",0),r}function ge(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}function it(e){let t=e.slice(e.lastIndexOf("/")+1);return t===""?e:t}function De(e){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");return t===""?void 0:t}var mn=Object.freeze({panels:Object.freeze([]),active:null});function We(){let e=[],t=null,n=mn,r=new Set,o=()=>{n=Object.freeze({panels:Object.freeze(e.slice()),active:t});for(let l of[...r])l()},a=l=>e.findIndex(i=>i.path===l),c=l=>{if(e.length===0)return;let i=t===null?-1:a(t),d=e[(i+l+e.length)%e.length];d===void 0||d.path===t||(t=d.path,o())};return{open(l,i=1){let d=De(l);if(d===void 0)return;let s=Number.isFinite(i)&&i>0?Math.trunc(i):1,m=a(d);if(m>=0){let x=e[m];if(x!==void 0&&x.line!==s&&(e=e.map((v,p)=>p===m?{path:d,line:s}:v)),t===d){x!==void 0&&x.line!==s&&o();return}t=d,o();return}let b=t===null?e.length:a(t)+1;e=[...e.slice(0,b),{path:d,line:s},...e.slice(b)],t=d,o()},close(l){let i=l??t;if(i===null)return;let d=a(i);d<0||(e=e.filter(s=>s.path!==i),t===i&&(t=(e[d]??e[d-1])?.path??null),o())},activate(l){let i=De(l);i===void 0||a(i)<0||t===i||(t=i,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&t===null||(e=[],t=null,o())},isOpen(l){let i=De(l);return i!==void 0&&a(i)>=0},activeEntry(){return e.find(l=>l.path===t)},snapshot:()=>n,subscribe(l){return r.add(l),()=>{r.delete(l)}}}}function st(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o=We();return e.set(n,o),o}}}function Y(e,t){let n=xe(e);return n===void 0?!1:(t.open(n.path,n.line),!0)}var lt=require("react");function L(e,t,...n){let r=n.filter(c=>c!=null&&c!==!1),o=(0,lt.createElement)(e,t??void 0,...r);if(o!==null&&typeof o=="object")return o;let a={...t??{}};return r.length===1?a.children=r[0]:r.length>1&&(a.children=r),{type:e,props:a,key:null}}function gn(e){let t=e.trim();if(!(t===""||t.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(t)||t.startsWith("/")||t.startsWith("#")||t.startsWith("./")||t.startsWith("../")))return t}var yn=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function K(e){let t=[],n=0;for(let r of e.matchAll(yn)){let o=r.index??0;o>n&&t.push(e.slice(n,o));let a=r[0];if(a.startsWith("`"))t.push(L("code",null,a.slice(1,-1)));else if(a.startsWith("**")||a.startsWith("__"))t.push(L("strong",null,...K(a.slice(2,-2))));else if(a.startsWith("~~"))t.push(L("del",null,...K(a.slice(2,-2))));else if(a.startsWith("*")||a.startsWith("_"))t.push(L("em",null,...K(a.slice(1,-1))));else{let c=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(a),l=c?.[1]??a,i=c===null?void 0:gn(c[2]??"");t.push(i===void 0?l:L("a",{href:i,rel:"noreferrer noopener"},l))}n=o+a.length}return n<e.length&&t.push(e.slice(n)),t}var dt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,ct=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,ut=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,_e=/^\s{0,3}>\s?(.*)$/u,Oe=/^\s{0,3}[-*+]\s+(.*)$/u,Ke=/^\s{0,3}\d+[.)]\s+(.*)$/u;function hn(e){return dt.test(e)||ct.test(e)||ut.test(e)||_e.test(e)||Oe.test(e)||Ke.test(e)}function ft(e){let t=[],n=0;for(;n<e.length;){let r=e[n]??"";if(r.trim()===""){n+=1;continue}let o=dt.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),s=o[2]??"",m=[];for(n+=1;n<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[n]??"");)m.push(e[n]??""),n+=1;n+=1,t.push(L("pre",null,L("code",s===""?null:{className:`language-${s}`},m.join(`
`))));continue}let a=ct.exec(r);if(a!==null){let d=(a[1]??"#").length;t.push(L(`h${String(d)}`,null,...K(a[2]??""))),n+=1;continue}if(ut.test(r)){t.push(L("hr",null)),n+=1;continue}if(_e.test(r)){let d=[];for(;n<e.length;){let s=_e.exec(e[n]??"");if(s===null)break;d.push(s[1]??""),n+=1}t.push(L("blockquote",null,...ft(d)));continue}if(Oe.exec(r)!==null){let d=[];for(;n<e.length;){let s=Oe.exec(e[n]??"");if(s===null)break;d.push(L("li",null,...K(s[1]??""))),n+=1}t.push(L("ul",null,...d));continue}if(Ke.exec(r)!==null){let d=[];for(;n<e.length;){let s=Ke.exec(e[n]??"");if(s===null)break;d.push(L("li",null,...K(s[1]??""))),n+=1}t.push(L("ol",null,...d));continue}let i=[r.trim()];for(n+=1;n<e.length;){let d=e[n]??"";if(d.trim()===""||hn(d))break;i.push(d.trim()),n+=1}t.push(L("p",null,...K(i.join(" "))))}return t}function ye(e){let t=e.replace(/\r\n?/gu,`
`).split(`
`);return L("div",{className:"fx-md"},...ft(t))}var vn={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function ee(e){let t=e.toLowerCase(),n=t.slice(t.lastIndexOf("/")+1),r=n.lastIndexOf(".");return r<=0?"plaintext":vn[n.slice(r+1)]??"plaintext"}function he(e){return ee(e)==="markdown"}var J=class extends Error{code;detail;constructor(t,n,r=""){super(n),this.name="PreviewReadError",this.code=t,this.detail=r}};function Z(e){return e!==null&&typeof e=="object"}function wn(e){return e===""?0:e.split(`
`).length}function Ve(e,t){if(!Z(e))throw new J("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let l=Z(e.error)?e.error:{},i=typeof l.code=="string"?l.code:"preview/unknown",d=typeof l.message=="string"?l.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=Z(l.details)?l.details:{},m=typeof s.kind=="string"?s.kind:"";throw new J(i,d,m)}let n=e.ok===!0?e.value:e;if(!Z(n)||typeof n.text!="string")throw new J("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof n.lines=="number"&&Number.isFinite(n.lines)?Math.max(0,Math.trunc(n.lines)):wn(n.text),o=typeof n.totalLines=="number"&&Number.isFinite(n.totalLines)&&n.totalLines>0?Math.trunc(n.totalLines):void 0,a=typeof n.offset=="number"&&Number.isFinite(n.offset)&&n.offset>0?Math.trunc(n.offset):t,c=n.eof===!0||o!==void 0&&r>0&&a+r-1>=o;return o===void 0?{text:n.text,lines:r,offset:a,eof:c}:{text:n.text,lines:r,offset:a,totalLines:o,eof:c}}function $e(e){let t=Z(e)?e:{},n=typeof t.code=="string"?t.code:"",r=typeof t.detail=="string"?t.detail:"",o=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",a=`${n} ${r} ${o}`.toLowerCase();return a.includes("symlink")?{kind:"symlink",code:n,message:o}:a.includes("eacces")||a.includes("eperm")||a.includes("permission")||a.includes("denied")||a.includes("forbidden")||a.includes("\u6743\u9650")?{kind:"denied",code:n,message:o}:a.includes("not-found")||a.includes("not_found")||a.includes("enoent")||a.includes("no such file")||a.includes("deleted")||a.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:n,message:o}:a.includes("not-regular-file")||a.includes("not a regular file")?{kind:"binary",code:n,message:o}:a.includes("not-text")||a.includes("utf-8")||a.includes("binary")?{kind:"binary",code:n,message:o}:a.includes("too-large")||a.includes("too large")||a.includes("maxbytes")?{kind:"too-large",code:n,message:o}:a.includes("unavailable")?{kind:"unavailable",code:n,message:o}:{kind:"unknown",code:n,message:o}}var Q=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function ve({files:e,maxLines:t=200}){let n=Math.max(1,Math.trunc(t)),r=Q,o=0,a=null,c=[1],l=new Set,i=s=>{r=s;for(let m of l)m()},d=async(s,m)=>{o+=1;let b=o;a?.abort();let x=new AbortController;a=x,i({status:"loading",path:s,text:r.path===s?r.text:"",offset:m,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let v=await e.read(s,m>1?{offset:m,limit:n}:{limit:n},x.signal);if(b!==o)return;let p=Ve(v,m);if(p.lines===0&&m>1){i({...r,status:"ready",eof:!0,text:"",lines:0});return}i(p.totalLines===void 0?{status:"ready",path:s,text:p.text,offset:p.offset,lines:p.lines,eof:p.eof}:{status:"ready",path:s,text:p.text,offset:p.offset,lines:p.lines,totalLines:p.totalLines,eof:p.eof})}catch(v){if(b!==o||x.signal.aborted)return;i({status:"failed",path:s,text:"",offset:m,lines:0,eof:!1,failure:$e(v)})}};return{maxLines:n,getSnapshot:()=>r,subscribe(s){return l.add(s),()=>{l.delete(s)}},async open(s){c=[1],await d(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(c.push(s),await d(r.path,s))},async prev(){if(r.path===void 0||c.length<=1)return;c=c.slice(0,-1);let s=c[c.length-1]??1;await d(r.path,s)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,a?.abort(),a=null,c=[1],i(Q)}}}function we(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let t=e.offset+e.lines-1,n=`${String(e.offset)}\u2013${String(t)}`;return e.totalLines===void 0?{range:n}:{range:n,total:String(e.totalLines)}}var He=Object.freeze({chunk:ze.chunk,id:`${ae}/${ze.chunk}`}),pt=null,te=null;function xt(e){pt=e}function mt(){return He}function gt(){if(te!==null)return te;let e=pt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ae}: the loader require was not handed over`));let t=e.async(`./${He.chunk}`).then(n=>{let r=n;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ae}: chunk ${He.id} is missing its preview renderers`);return r});return te=t,t.catch(()=>{te===t&&(te=null)}),t}var yt="dsh-fs-explorer-styles",bn=`
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
`;function ht(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${yt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=yt,n.textContent=bn,e.head.appendChild(n),()=>{n.remove()}}var h=require("react");var be=require("react");var P=require("react/jsx-runtime");function vt({panels:e,active:t,t:n,onActivate:r,onClose:o,onStep:a}){let c=(0,be.useRef)(null);if((0,be.useEffect)(()=>{c.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[t]),e.length===0)return null;let l=i=>{if(i.key==="ArrowRight"||i.key==="ArrowLeft"){i.preventDefault(),i.stopPropagation(),a(i.key==="ArrowRight"?1:-1);return}(i.key==="Delete"||i.key==="Backspace")&&t!==null&&(i.preventDefault(),i.stopPropagation(),o(t))};return(0,P.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":n("panel.tabs"),onKeyDown:l,"data-testid":"fs-tabs",children:e.map((i,d)=>{let s=i.path===t,m=it(i.path),b=n("panel.close").replace("{name}",m);return(0,P.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,P.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${d}`,"aria-controls":`fx-panel-${d}`,"aria-selected":s,tabIndex:s?0:-1,title:i.path,"data-testid":"fs-tab","data-path":i.path,ref:s?c:void 0,onClick:()=>r(i.path),children:[(0,P.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":V(i.path),"aria-hidden":"true",children:$(i.path)}),(0,P.jsx)("span",{className:"fx-tab-name",children:m})]}),(0,P.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":b,title:b,"data-testid":"fs-tab-close",onClick:()=>o(i.path),children:"\xD7"})]},i.path)})})}function kn(){return(0,P.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,P.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,P.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,P.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function wt({t:e}){return(0,P.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,P.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,P.jsx)(kn,{})}),(0,P.jsx)("strong",{children:e("panel.empty.title")}),(0,P.jsx)("span",{children:e("panel.empty.description")}),(0,P.jsxs)("span",{className:"fx-empty-keys",children:[(0,P.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,P.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,P.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,P.jsx)("span",{children:e("panel.empty.keys")})]})]})}var C=require("react");async function bt(e){let t=typeof navigator>"u"?void 0:navigator.clipboard;if(t!==void 0&&typeof t.writeText=="function")try{return await t.writeText(e),!0}catch{}if(typeof document>"u")return!1;let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}function ke(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function H(e){try{return e()}catch{return}}function St(e){return()=>{let t=H(()=>e.workspaceFiles);if(ke(t))return t;let n=H(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(ke(n))return n;let r=H(()=>e.remote?.workspaceFiles);if(ke(r))return r;let o=H(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(ke(o))return o}}function Ct(e,t){if(e===void 0||t===void 0)return;let n=e.read;if(typeof n=="function")return{read(r,o,a){return n.call(e,t,r,o,a)}}}function ne(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function qe(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Se(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:ne(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?qe(r.value):{ok:!1,message:ne(r.error)}}return qe(n)}return qe(t)}function Pt(e){return e instanceof Error?e.message:ne(e)}function kt(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Rt(e){return()=>{let t=H(()=>e.remote?.gitExplorer);if(kt(t))return t;let n=H(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(kt(n))return n}}function Ge(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return typeof t.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:t.isRepository===!1?"":t.status}}function Ce(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:ne(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?Ge(o.snapshot):{ok:!1,message:ne(o.error)}}let r=e;return r.snapshot!==void 0?Ge(r.snapshot):Ge(n)}var g=require("react/jsx-runtime");function Cn(e,t){switch(e.kind){case"deleted":return t("preview.deleted.title");case"denied":return t("preview.denied.title");case"symlink":return t("preview.symlink.title");case"binary":return t("preview.binary.title");case"too-large":return t("preview.tooLarge.title");case"unavailable":return t("preview.unavailable.title");default:return t("preview.unknown.title")}}function Pn(e,t){switch(e.kind){case"deleted":return t("preview.deleted.description");case"denied":return t("preview.denied.description");case"symlink":return t("preview.symlink.description");case"binary":return t("preview.binary.description");case"too-large":return t("preview.tooLarge.description");case"unavailable":return t("preview.unavailable.description");default:return t("preview.unknown.description")}}function Rn({chunk:e,text:t,path:n,offset:r}){let o=(0,C.useRef)(null),a=(0,C.useRef)(null),[c,l]=(0,C.useState)(!1),i=ee(n);return(0,C.useEffect)(()=>{l(!1)},[e,n]),(0,C.useEffect)(()=>{let d=o.current;if(!(e===null||d===null))try{let s=e.mountCodePreview(d,{text:t,language:i,path:n,offset:r});return a.current=s,()=>{s.destroy(),a.current=null}}catch{l(!0);return}},[e,n,i]),(0,C.useEffect)(()=>{a.current?.update(t,r)},[t,r,e]),e===null||c?(0,g.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:t}):(0,g.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Et({sessionId:e,files:t,path:n,t:r}){let o=(0,C.useMemo)(()=>Ct(t,e),[t,e]),[a,c]=(0,C.useState)(null),[l,i]=(0,C.useState)(Q),[d,s]=(0,C.useState)(null),[m,b]=(0,C.useState)("reading"),[x,v]=(0,C.useState)(!1),p=(0,C.useRef)(void 0);if((0,C.useEffect)(()=>{if(o===void 0){c(null);return}let E=ve({files:o,maxLines:200});return c(E),()=>E.close()},[o]),(0,C.useEffect)(()=>{if(a===null){i(Q);return}return i(a.getSnapshot()),a.subscribe(()=>i(a.getSnapshot()))},[a]),(0,C.useEffect)(()=>{a===null||n===void 0||a.open(n)},[a,n]),(0,C.useEffect)(()=>{b("reading"),v(!1)},[n]),(0,C.useEffect)(()=>()=>{p.current!==void 0&&clearTimeout(p.current)},[]),(0,C.useEffect)(()=>{if(n===void 0)return;let E=!0;return gt().then(O=>{E&&s(O)}).catch(()=>{E&&s(null)}),()=>{E=!1}},[n]),n===void 0)return(0,g.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,g.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,g.jsx)("strong",{children:r("preview.empty.title")}),(0,g.jsx)("span",{children:r("preview.empty.description")})]})});let M=we(l),A=he(n),I=l.status==="loading",S=l.status==="ready",F=A&&m==="reading",Re=()=>{bt(n).then(E=>{E&&(v(!0),p.current!==void 0&&clearTimeout(p.current),p.current=setTimeout(()=>v(!1),1400))})},j;if(o===void 0)j=(0,g.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,g.jsx)("strong",{children:r("preview.unavailable.title")}),(0,g.jsx)("span",{children:r("preview.unavailable.description")})]});else if(l.status==="failed"){let E=l.failure??{kind:"unknown",code:"",message:""};j=(0,g.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":E.kind,children:[(0,g.jsx)("strong",{children:Cn(E,r)}),(0,g.jsx)("span",{children:Pn(E,r)}),E.message===""?null:(0,g.jsx)("code",{className:"fx-preview-hint",children:E.message}),(0,g.jsx)("button",{type:"button",className:"fx-btn",onClick:()=>{a?.retry()},"data-testid":"fs-preview-retry",children:r("preview.retry")})]})}else S?F?j=d===null?(0,g.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:ye(l.text)}):(0,g.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,g.jsx)(d.MarkdownView,{text:l.text})}):j=(0,g.jsx)(Rn,{chunk:d,text:l.text,path:n,offset:l.offset}):j=(0,g.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]});return(0,g.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":l.status,"data-mode":F?"reading":"code","data-renderer":F?d===null?"fallback":"gfm":d?.renderer??"plain",children:[(0,g.jsxs)("header",{className:"fx-preview-bar",children:[(0,g.jsx)("span",{className:"fx-preview-path",title:n,"data-testid":"fs-preview-path",children:n}),(0,g.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[M.range,M.range==="\u2014"?null:(0,g.jsxs)(g.Fragment,{children:[" ",r("preview.lines")]}),M.total===void 0?null:(0,g.jsxs)("span",{className:"fx-preview-total",children:[" / ",M.total," ",r("preview.lines")]})]}),(0,g.jsxs)("div",{className:"fx-preview-actions",children:[A?(0,g.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>b(E=>E==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(m==="reading"?"preview.source":"preview.reading")}):null,(0,g.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!S||I||l.offset<=1,onClick:()=>{a?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,g.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!S||I||l.eof,onClick:()=>{a?.next()},"data-testid":"fs-preview-next",children:r("preview.next")}),(0,g.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Re,"data-testid":"fs-preview-copy",children:r(x?"preview.copied":"preview.copyPath")}),I?(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,g.jsx)("div",{className:"fx-preview-body","data-scroll":F?"y":"none",children:j})]})}var _=require("react");var y=require("react/jsx-runtime"),re=22;function Be({open:e=!0,size:t=14}){return(0,y.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,y.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function En(){return(0,y.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Tt(){return(0,y.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,y.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,y.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Lt(){return(0,y.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Tn({name:e}){return(0,y.jsx)("span",{className:"fx-badge","data-icon":V(e),"aria-hidden":"true",children:$(e)})}function Ln({row:e,selected:t,top:n,t:r,onToggle:o,onSelect:a}){let c=e.kind==="directory",l={top:n,paddingLeft:8+e.depth*12};return(0,y.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...c?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-expanded":c?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{c?o(e.path):a(e.path)},children:[(0,y.jsx)("span",{className:"fx-chevron","data-open":c&&e.expanded?"true":"false","data-visible":c?"true":"false","aria-hidden":"true",children:(0,y.jsx)(En,{})}),c?(0,y.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,y.jsx)(Be,{open:e.expanded})}):(0,y.jsx)(Tn,{name:e.name}),(0,y.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,y.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":B(e.status),"data-testid":"fx-file-status",title:r(Ae(e.status)),"aria-label":r(Ae(e.status)),children:ce(e.status)}),e.statusCount===void 0?null:(0,y.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:r("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,y.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,y.jsx)("span",{className:"fx-size",children:ge(e.size)})]})}function Nn({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,y.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,y.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,y.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,y.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,y.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function Nt({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:a}){let c=(0,_.useRef)(null),[l,i]=(0,_.useState)(0),[d,s]=(0,_.useState)(0);(0,_.useEffect)(()=>{let x=c.current;if(x===null)return;let v=()=>s(x.clientHeight);if(v(),typeof ResizeObserver>"u")return;let p=new ResizeObserver(v);return p.observe(x),()=>p.disconnect()},[]),(0,_.useEffect)(()=>{if(t===void 0)return;let x=c.current;if(x===null)return;let v=e.findIndex(M=>M.type==="entry"&&M.path===t);if(v<0)return;let p=v*re;(p<x.scrollTop||p+re>x.scrollTop+x.clientHeight)&&(x.scrollTop=Math.max(0,p-x.clientHeight/2))},[t,e]);let m=x=>{i(x.currentTarget.scrollTop)},b=fe(e,{scrollTop:l,height:d===0?480:d,rowHeight:re});return(0,y.jsx)("div",{className:"fx-scroll",ref:c,onScroll:m,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,y.jsx)("div",{className:"fx-vlist",style:{height:e.length*re},children:b.rows.map((x,v)=>{let p=(b.startIndex+v)*re;return x.type==="entry"?(0,y.jsx)(Ln,{row:x,top:p,selected:x.path===t,t:n,onToggle:r,onSelect:o},x.path):(0,y.jsx)(Nn,{row:x,top:p,t:n,onRetry:a},x.key)})})})}var f=require("react/jsx-runtime");var Fn=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Pe({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,f.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,f.jsx)("strong",{children:e}),t===void 0?null:(0,f.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function Ft({workbench:e,version:t,t:n,files:r,status:o}){let a=st();function c(l){let i=l.sessionId??e.currentSessionId(),d=(0,h.useRef)(i);d.current=i;let s=(0,h.useMemo)(()=>r(),[r]),m=(0,h.useMemo)(()=>o(),[o]),[b,x]=(0,h.useState)(()=>new Map),[v,p]=(0,h.useState)(void 0),M=(0,h.useRef)(b);M.current=b;let[A,I]=(0,h.useState)(()=>new Set),S=(0,h.useMemo)(()=>a.forSession(i),[a,i]),F=(0,h.useSyncExternalStore)(S.subscribe,S.snapshot,S.snapshot),Re=F.active??void 0,[j,E]=(0,h.useState)(0),[O,oe]=(0,h.useState)(void 0),D=(0,h.useRef)(new Map),Ee=(0,h.useRef)(void 0),W=(0,h.useCallback)(async(u,w,k)=>{D.current.get(u)?.abort();let R=new AbortController;D.current.set(u,R),x(z=>new Map(z).set(u,Fn()));try{let z=await k.list(w,pe(u),R.signal);if(R.signal.aborted||d.current!==w)return!1;let N=Se(z);if(!N.ok)return x(Le=>new Map(Le).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:N.message})),!1;let Te=ue(N.listing.entries);return x(Le=>new Map(Le).set(u,{status:"ready",nodes:Te,truncated:N.listing.truncated===!0,total:N.listing.entries.length})),!0}catch(z){return R.signal.aborted||x(N=>new Map(N).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:Pt(z)})),!1}finally{D.current.get(u)===R&&D.current.delete(u)}},[]);(0,h.useEffect)(()=>{for(let u of D.current.values())u.abort();return D.current.clear(),x(new Map),I(new Set),oe(void 0),Ee.current=void 0,i!==void 0&&s!==void 0&&W("",i,s),()=>{for(let u of D.current.values())u.abort();D.current.clear()}},[i,s,j,W]),(0,h.useEffect)(()=>{if(i===void 0||m===void 0){p(void 0);return}let u=!0,w=new AbortController;return p(void 0),Promise.resolve().then(()=>m.snapshot({sessionId:i,maxCommits:1},w.signal)).then(k=>{if(!u)return;let R=Ce(k);p(R.ok?de(R.status):void 0)}).catch(()=>{u&&p(void 0)}),()=>{u=!1,w.abort()}},[i,m,j]),(0,h.useEffect)(()=>{let u=l.viewRequest;if(u==null||u.view!==G)return;let w=`${u.view}:${u.focus}`;Ee.current!==w&&(Ee.current=w,Y(u.focus,{open:(k,R)=>{S.open(k,R),oe({path:k,line:R})}}),l.completeViewRequest?.())},[l.viewRequest,l.completeViewRequest,S]),(0,h.useEffect)(()=>{let u=e.viewFocus;if(u===void 0||i===void 0)return;let w=()=>{let k=u.take(G);k!==void 0&&Y(k,{open:(R,z)=>{S.open(R,z),oe({path:R,line:z})}})};return w(),u.subscribe(w)},[e,i,S]);let T=b.get(""),Ue=T?.status==="ready";(0,h.useEffect)(()=>{if(O===void 0||i===void 0||s===void 0||!Ue)return;let u=!0,w=O.path.split("/").filter(Boolean),k=[],R="";for(let N of w.slice(0,-1))R=X(R,N),k.push(R);return k.length>0&&I(N=>new Set([...N,...k])),(async()=>{for(let N of k){if(M.current.get(N)?.status==="ready")continue;let Te=await W(N,i,s);if(!u||!Te)return}u&&(S.open(O.path,O.line),oe(void 0))})(),()=>{u=!1}},[O,i,s,Ue,W,S]);let Xe=(0,h.useCallback)(()=>{if(typeof document>"u")return!1;let u=document.querySelector("[data-composer-input]");return u===null?!1:(u.focus(),!0)},[]);(0,h.useEffect)(()=>{if(typeof document>"u")return;let u=w=>{if(!(w.isComposing||Qe(w.target))){for(let k of se)if(Je(w,k)){if(k.action==="closePanel"&&S.snapshot().active===null)return;w.preventDefault(),w.stopPropagation(),k.action==="nextPanel"?S.next():k.action==="previousPanel"?S.previous():S.close();return}}};return document.addEventListener("keydown",u,!0),()=>document.removeEventListener("keydown",u,!0)},[S]),(0,h.useEffect)(()=>{if(typeof document>"u")return;let u=le({focusComposer:Xe,hasModal:()=>et(document)}),w=k=>u(k);return document.addEventListener("keydown",w,!0),()=>document.removeEventListener("keydown",w,!0)},[Xe]);let At=(0,h.useMemo)(()=>me(b,A,v),[b,A,v]),q=v===void 0?void 0:Object.keys(v).length,Dt=v===void 0?"neutral":Object.values(v).some(u=>u.status==="conflicted")?"conflict":q===0?"success":"warning",Wt=(0,h.useCallback)(u=>{if(i===void 0||s===void 0)return;if(A.has(u)){I(k=>{let R=new Set(k);return R.delete(u),R});return}I(k=>new Set(k).add(u));let w=b.get(u);(w===void 0||w.status==="failed")&&W(u,i,s)},[A,b,i,s,W]),Ye=(0,h.useCallback)(u=>{i===void 0||s===void 0||W(u,i,s)},[i,s,W]),_t=()=>I(new Set),Ot=()=>E(u=>u+1),Kt=i===void 0?"no-session":s===void 0?"no-service":T===void 0||T.status==="loading"?"loading":T.status==="failed"?"failed":T.nodes.length===0?"empty":"tree";return(0,f.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":Kt,"data-session":i??"","data-testid":"fs-explorer-view",children:[(0,f.jsxs)("header",{className:"fx-head",children:[(0,f.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,f.jsx)(Be,{open:!0})}),(0,f.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,f.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,f.jsxs)("div",{className:"fx-head-meta",children:[T?.status==="ready"?(0,f.jsxs)("span",{children:[(0,f.jsx)("b",{children:T.nodes.length})," ",n("head.entries")]}):null,(0,f.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:A.size===0,onClick:_t,children:(0,f.jsx)(Lt,{})}),(0,f.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:i===void 0||s===void 0||T?.status==="loading",onClick:Ot,children:(0,f.jsx)(Tt,{})})]})]}),(0,f.jsx)("div",{className:"fx-main",children:i===void 0?(0,f.jsx)(Pe,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,f.jsx)(Pe,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):T===void 0||T.status==="loading"?(0,f.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,f.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):T.status==="failed"?(0,f.jsx)(Pe,{title:n("state.failed.title"),description:T.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>Ye(""),testId:"fs-failed"}):T.nodes.length===0?(0,f.jsx)(Pe,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:"fx-tree-pane",children:(0,f.jsx)(Nt,{rows:At,selectedPath:Re,t:n,onToggle:Wt,onSelect:u=>S.open(u),onRetry:Ye})}),(0,f.jsxs)("div",{className:"fx-editor",children:[(0,f.jsx)(vt,{panels:F.panels,active:F.active,t:n,onActivate:u=>S.activate(u),onClose:u=>S.close(u),onStep:u=>u===1?S.next():S.previous()}),(0,f.jsx)("div",{className:"fx-editor-body",children:F.panels.length===0?(0,f.jsx)(wt,{t:n}):F.panels.map((u,w)=>(0,f.jsx)("div",{className:"fx-panel",id:`fx-panel-${w}`,role:"tabpanel","aria-labelledby":`fx-tab-${w}`,hidden:u.path!==F.active,"data-line":u.line,"data-testid":"fs-panel",children:(0,f.jsx)(Et,{sessionId:i,files:s,path:u.path,t:n})},u.path))})]})]})}),T?.status==="ready"?(0,f.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,f.jsxs)("span",{children:[n("view.scope")," ",(0,f.jsx)("b",{children:T.nodes.length})," ",n("head.entries")]}),T.truncated?(0,f.jsx)("span",{className:"fx-foot-warn",children:U({entries:T.nodes,truncated:!0,total:T.total}).label}):null,(0,f.jsxs)("span",{className:"fx-foot-git","data-state":q===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,f.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Dt,"aria-hidden":"true"}),q===void 0?n("status.unavailable"):q===0?n("status.clean"):n("status.summary").replace("{count}",String(q))]}),(0,f.jsx)("span",{className:"fx-spacer"}),(0,f.jsx)("span",{children:n("foot.order")})]}):null]})}return c}var Mt=["slots","locale","workbench","remote"];function In(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"en"}function It(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.register(ie,{zh:Fe,en:Me}),r=e.locale.bind(ie),o=ht(typeof document>"u"?void 0:document),a=Ft({workbench:t,version:t.version,t:r,files:St(e),status:Rt(e)});return e.slots.inject(je,()=>e.slots.register({name:je,id:G,order:100,label:()=>Ie(In(e)),locale:ie},a)),()=>{o(),n()}}var jt={buildTree:ue,describeListing:U,iconFor:V,computeTreeWindow:fe,flattenTree:me,badgeFor:$,formatSize:ge,joinPath:X,listingPath:pe,parseFocus:xe,consumeViewRequest:Y,createPanelStack:We,createEscapeHandler:le,KEYMAP:se,tabLabel:Ie,normalizeListing:Se,normalizeStatusSnapshot:Ce,parseStatusZ:de,statusTone:B,statusBadge:ce,createPreviewLoader:ve,renderMarkdown:ye,languageFor:ee,isMarkdownFile:he,describePage:we,classifyPreviewFailure:$e,normalizePreviewPage:Ve,previewChunkRoute:mt},zt={name:"dsh-fs-explorer",inject:Mt,apply:It,__test:jt};var jn=zt;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
