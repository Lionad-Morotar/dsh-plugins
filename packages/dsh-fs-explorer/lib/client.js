window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ne=Object.defineProperty;var Vt=Object.getOwnPropertyDescriptor;var $t=Object.getOwnPropertyNames;var Ht=Object.prototype.hasOwnProperty;var qt=(e,t)=>{for(var n in t)Ne(e,n,{get:t[n],enumerable:!0})},Gt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of $t(t))!Ht.call(e,o)&&o!==n&&Ne(e,o,{get:()=>t[o],enumerable:!(r=Vt(t,o))||r.enumerable});return e};var Bt=e=>Gt(Ne({},"__esModule",{value:!0}),e);var zn={};qt(zn,{__test:()=>jt,apply:()=>It,boot:()=>xt,clientPlugin:()=>zt,default:()=>jn,inject:()=>Mt});module.exports=Bt(zn);var Fe={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002"},Me={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file."};function Ie(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Fe:Me)["tab.label"]??"Files"}var ae="dsh-fs-explorer",je="conversation.view",U="fs-explorer";var se="fs-explorer",Ze="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",ze={chunk:"client.preview.js"};var le=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ut(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",t=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(t)?"mac":"other"}function Je(e,t,n=Ut()){if(e.isComposing===!0||e.code!==t.code)return!1;let r=t.modifiers,o=r.includes("meta")||r.includes("primary")&&n==="mac",i=r.includes("control")||r.includes("primary")&&n!=="mac",u=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===u&&e.shiftKey===!0===l}function Qe(e){if(e===null||typeof e!="object")return!1;let t=e;if(t.isContentEditable===!0)return!0;if(typeof t.tagName!="string")return!1;let n=t.tagName.toLowerCase();return n==="input"||n==="textarea"||n==="select"}function Xt(e){let t=e?.querySelector("[data-composer-input]");if(t==null||typeof t!="object")return!1;let n=t.focus;return typeof n!="function"?!1:(n.call(t),!0)}function et(e){let t=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return t!=null}function de(e){let t=e.doc??(typeof document>"u"?void 0:document);return n=>{if(n.key!=="Escape"||n.defaultPrevented===!0||n.isComposing===!0||e.hasModal())return;n.preventDefault(),e.focusComposer()!==!0&&Xt(t),e.onClose?.()}}var Yt={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Zt={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Jt=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function nt(e){return typeof e=="string"&&Jt.has(e)}function tt(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;n.push(e.slice(r,i)),r=i+1}return{fields:n,rest:e.slice(r)}}function Qt(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function ce(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let u=o.slice(2);u!==""&&(t[u]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let u=tt(o.slice(2),i==="1"?7:8);if(u===null)continue;let l=u.fields[0]??"",a=u.rest;if(a===""||l.length<2)continue;if(i==="2"){let c=n[r+1];if(c===void 0||c==="")continue;r+=1,t[a]={status:"renamed"};continue}t[a]={status:Qt(l[0]??".",l[1]??".")};continue}if(i==="u"){let u=tt(o.slice(2),9);if(u===null)continue;let l=u.rest;if(l==="")continue;t[l]={status:"conflicted"}}}}return t}function X(e){return nt(e)?Yt[e]:"neutral"}function fe(e){return nt(e)?Zt[e]:"?"}function De(e){return`status.${e}`}function rt(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}var en=["conflicted","deleted","renamed","added","modified","untracked"];function tn(e){return X(en.find(t=>e.has(t))??"modified")}function ot(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let u=i.split("/"),l=r.endsWith("/")?u.length:u.length-1,a="";for(let c=0;c<l;c+=1){let s=u[c];if(s===void 0||s==="")continue;a=a===""?s:`${a}/${s}`;let p=t.get(a);p===void 0?t.set(a,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:tn(o.present)});return n}var nn=new Set(["node_modules",".git","dist","__pycache__"]);function rn(e){return nn.has(e)}function on(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ue(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||rn(r))continue;let o=on(n),i=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var an=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),sn=new Set(["md","mdx","markdown","mdown","rst","adoc"]),ln=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),dn=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),cn=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),fn=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),un=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function it(e){let t=e.toLowerCase(),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function H(e,t="file"){if(t==="directory")return"folder";let n=e.toLowerCase();if(un.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=it(n);return r===""?"file":an.has(r)?"code":sn.has(r)?"markdown":ln.has(r)?"data":dn.has(r)?"image":cn.has(r)?"style":fn.has(r)?"archive":"file"}var pn={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},xn={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function q(e){let t=e.toLowerCase(),n=pn[t];if(n!==void 0)return n;let r=it(t),o=xn[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Y(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${Ze} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function pe(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),u=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,t.scrollTop)/n)-o,a=Math.min(Math.max(l,0),u),c=Math.min(e.length,a+i+o*2);return{rows:e.slice(a,c),startIndex:a,endIndex:c}}function xe(e){return e===""?".":e}function Z(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function me(e){if(typeof e!="string")return;let t=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(t===null)return;let r=(t[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let o=t[2]===void 0?1:Math.max(1,Number.parseInt(t[2],10));return{path:r,line:o}}function ge(e,t,n){let r=[],o=ot(n),i=(u,l)=>{let a=e.get(u);if(!(a===void 0||a.status!=="ready"))for(let c of a.nodes){let s=Z(u,c.name),p=c.kind==="directory",P=p&&t.has(s),w=p?void 0:rt(s,n),b=p?o.get(s):void 0;if(r.push({type:"entry",path:s,name:c.name,kind:c.kind,depth:l,expanded:P,...c.size===void 0?{}:{size:c.size},...w===void 0?{}:{status:w},...b===void 0?{}:{statusCount:b.count,statusTone:b.tone}}),!P)continue;let h=e.get(s);if(h===void 0||h.status==="loading"){r.push({type:"status",key:`${s}:loading`,path:s,depth:l+1,state:"loading"});continue}if(h.status==="failed"){r.push({type:"status",key:`${s}:failed`,path:s,depth:l+1,state:"failed",message:h.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(h.nodes.length===0){r.push({type:"status",key:`${s}:empty`,path:s,depth:l+1,state:"empty"});continue}i(s,l+1),h.truncated&&r.push({type:"status",key:`${s}:truncated`,path:s,depth:l+1,state:"truncated",label:Y({entries:h.nodes,truncated:!0,total:h.total}).label})}};return i("",0),r}function ye(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}function at(e){let t=e.slice(e.lastIndexOf("/")+1);return t===""?e:t}function Ae(e){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");return t===""?void 0:t}var mn=Object.freeze({panels:Object.freeze([]),active:null});function We(){let e=[],t=null,n=mn,r=new Set,o=()=>{n=Object.freeze({panels:Object.freeze(e.slice()),active:t});for(let l of[...r])l()},i=l=>e.findIndex(a=>a.path===l),u=l=>{if(e.length===0)return;let a=t===null?-1:i(t),c=e[(a+l+e.length)%e.length];c===void 0||c.path===t||(t=c.path,o())};return{open(l,a=1){let c=Ae(l);if(c===void 0)return;let s=Number.isFinite(a)&&a>0?Math.trunc(a):1,p=i(c);if(p>=0){let w=e[p];if(w!==void 0&&w.line!==s&&(e=e.map((b,h)=>h===p?{path:c,line:s}:b)),t===c){w!==void 0&&w.line!==s&&o();return}t=c,o();return}let P=t===null?e.length:i(t)+1;e=[...e.slice(0,P),{path:c,line:s},...e.slice(P)],t=c,o()},close(l){let a=l??t;if(a===null)return;let c=i(a);c<0||(e=e.filter(s=>s.path!==a),t===a&&(t=(e[c]??e[c-1])?.path??null),o())},activate(l){let a=Ae(l);a===void 0||i(a)<0||t===a||(t=a,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&t===null||(e=[],t=null,o())},isOpen(l){let a=Ae(l);return a!==void 0&&i(a)>=0},activeEntry(){return e.find(l=>l.path===t)},snapshot:()=>n,subscribe(l){return r.add(l),()=>{r.delete(l)}}}}function st(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o=We();return e.set(n,o),o}}}function J(e,t){let n=me(e);return n===void 0?!1:(t.open(n.path,n.line),!0)}var lt=require("react");function I(e,t,...n){let r=n.filter(u=>u!=null&&u!==!1),o=(0,lt.createElement)(e,t??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...t??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function gn(e){let t=e.trim();if(!(t===""||t.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(t)||t.startsWith("/")||t.startsWith("#")||t.startsWith("./")||t.startsWith("../")))return t}var yn=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function $(e){let t=[],n=0;for(let r of e.matchAll(yn)){let o=r.index??0;o>n&&t.push(e.slice(n,o));let i=r[0];if(i.startsWith("`"))t.push(I("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))t.push(I("strong",null,...$(i.slice(2,-2))));else if(i.startsWith("~~"))t.push(I("del",null,...$(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))t.push(I("em",null,...$(i.slice(1,-1))));else{let u=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=u?.[1]??i,a=u===null?void 0:gn(u[2]??"");t.push(a===void 0?l:I("a",{href:a,rel:"noreferrer noopener"},l))}n=o+i.length}return n<e.length&&t.push(e.slice(n)),t}var dt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,ct=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,ft=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Ke=/^\s{0,3}>\s?(.*)$/u,_e=/^\s{0,3}[-*+]\s+(.*)$/u,Oe=/^\s{0,3}\d+[.)]\s+(.*)$/u;function hn(e){return dt.test(e)||ct.test(e)||ft.test(e)||Ke.test(e)||_e.test(e)||Oe.test(e)}function ut(e){let t=[],n=0;for(;n<e.length;){let r=e[n]??"";if(r.trim()===""){n+=1;continue}let o=dt.exec(r);if(o!==null){let c=(o[1]??"```").slice(0,1),s=o[2]??"",p=[];for(n+=1;n<e.length&&!new RegExp(`^\\s{0,3}${c}{3,}\\s*$`,"u").test(e[n]??"");)p.push(e[n]??""),n+=1;n+=1,t.push(I("pre",null,I("code",s===""?null:{className:`language-${s}`},p.join(`
`))));continue}let i=ct.exec(r);if(i!==null){let c=(i[1]??"#").length;t.push(I(`h${String(c)}`,null,...$(i[2]??""))),n+=1;continue}if(ft.test(r)){t.push(I("hr",null)),n+=1;continue}if(Ke.test(r)){let c=[];for(;n<e.length;){let s=Ke.exec(e[n]??"");if(s===null)break;c.push(s[1]??""),n+=1}t.push(I("blockquote",null,...ut(c)));continue}if(_e.exec(r)!==null){let c=[];for(;n<e.length;){let s=_e.exec(e[n]??"");if(s===null)break;c.push(I("li",null,...$(s[1]??""))),n+=1}t.push(I("ul",null,...c));continue}if(Oe.exec(r)!==null){let c=[];for(;n<e.length;){let s=Oe.exec(e[n]??"");if(s===null)break;c.push(I("li",null,...$(s[1]??""))),n+=1}t.push(I("ol",null,...c));continue}let a=[r.trim()];for(n+=1;n<e.length;){let c=e[n]??"";if(c.trim()===""||hn(c))break;a.push(c.trim()),n+=1}t.push(I("p",null,...$(a.join(" "))))}return t}function he(e){let t=e.replace(/\r\n?/gu,`
`).split(`
`);return I("div",{className:"fx-md"},...ut(t))}var vn={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function ne(e){let t=e.toLowerCase(),n=t.slice(t.lastIndexOf("/")+1),r=n.lastIndexOf(".");return r<=0?"plaintext":vn[n.slice(r+1)]??"plaintext"}function ve(e){return ne(e)==="markdown"}var ee=class extends Error{code;detail;constructor(t,n,r=""){super(n),this.name="PreviewReadError",this.code=t,this.detail=r}};function Q(e){return e!==null&&typeof e=="object"}function wn(e){return e===""?0:e.split(`
`).length}function Ve(e,t){if(!Q(e))throw new ee("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let l=Q(e.error)?e.error:{},a=typeof l.code=="string"?l.code:"preview/unknown",c=typeof l.message=="string"?l.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=Q(l.details)?l.details:{},p=typeof s.kind=="string"?s.kind:"";throw new ee(a,c,p)}let n=e.ok===!0?e.value:e;if(!Q(n)||typeof n.text!="string")throw new ee("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof n.lines=="number"&&Number.isFinite(n.lines)?Math.max(0,Math.trunc(n.lines)):wn(n.text),o=typeof n.totalLines=="number"&&Number.isFinite(n.totalLines)&&n.totalLines>0?Math.trunc(n.totalLines):void 0,i=typeof n.offset=="number"&&Number.isFinite(n.offset)&&n.offset>0?Math.trunc(n.offset):t,u=n.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:n.text,lines:r,offset:i,eof:u}:{text:n.text,lines:r,offset:i,totalLines:o,eof:u}}function $e(e){let t=Q(e)?e:{},n=typeof t.code=="string"?t.code:"",r=typeof t.detail=="string"?t.detail:"",o=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${n} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:n,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:n,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:n,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:n,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:n,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:n,message:o}:i.includes("unavailable")?{kind:"unavailable",code:n,message:o}:{kind:"unknown",code:n,message:o}}var te=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function we({files:e,maxLines:t=200}){let n=Math.max(1,Math.trunc(t)),r=te,o=0,i=null,u=[1],l=new Set,a=s=>{r=s;for(let p of l)p()},c=async(s,p)=>{o+=1;let P=o;i?.abort();let w=new AbortController;i=w,a({status:"loading",path:s,text:r.path===s?r.text:"",offset:p,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let b=await e.read(s,p>1?{offset:p,limit:n}:{limit:n},w.signal);if(P!==o)return;let h=Ve(b,p);if(h.lines===0&&p>1){a({...r,status:"ready",eof:!0,text:"",lines:0});return}a(h.totalLines===void 0?{status:"ready",path:s,text:h.text,offset:h.offset,lines:h.lines,eof:h.eof}:{status:"ready",path:s,text:h.text,offset:h.offset,lines:h.lines,totalLines:h.totalLines,eof:h.eof})}catch(b){if(P!==o||w.signal.aborted)return;a({status:"failed",path:s,text:"",offset:p,lines:0,eof:!1,failure:$e(b)})}};return{maxLines:n,getSnapshot:()=>r,subscribe(s){return l.add(s),()=>{l.delete(s)}},async open(s){u=[1],await c(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(u.push(s),await c(r.path,s))},async prev(){if(r.path===void 0||u.length<=1)return;u=u.slice(0,-1);let s=u[u.length-1]??1;await c(r.path,s)},async retry(){r.path!==void 0&&await c(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,u=[1],a(te)}}}function be(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let t=e.offset+e.lines-1,n=`${String(e.offset)}\u2013${String(t)}`;return e.totalLines===void 0?{range:n}:{range:n,total:String(e.totalLines)}}var He=Object.freeze({chunk:ze.chunk,id:`${ae}/${ze.chunk}`}),pt=null,re=null;function xt(e){pt=e}function mt(){return He}function gt(){if(re!==null)return re;let e=pt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ae}: the loader require was not handed over`));let t=e.async(`./${He.chunk}`).then(n=>{let r=n;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ae}: chunk ${He.id} is missing its preview renderers`);return r});return re=t,t.catch(()=>{re===t&&(re=null)}),t}var yt="dsh-fs-explorer-styles",bn=`
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
`;function ht(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${yt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=yt,n.textContent=bn,e.head.appendChild(n),()=>{n.remove()}}var v=require("react");var ke=require("react");var L=require("react/jsx-runtime");function vt({panels:e,active:t,t:n,onActivate:r,onClose:o,onStep:i}){let u=(0,ke.useRef)(null);if((0,ke.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[t]),e.length===0)return null;let l=a=>{if(a.key==="ArrowRight"||a.key==="ArrowLeft"){a.preventDefault(),a.stopPropagation(),i(a.key==="ArrowRight"?1:-1);return}(a.key==="Delete"||a.key==="Backspace")&&t!==null&&(a.preventDefault(),a.stopPropagation(),o(t))};return(0,L.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":n("panel.tabs"),onKeyDown:l,"data-testid":"fs-tabs",children:e.map((a,c)=>{let s=a.path===t,p=at(a.path),P=n("panel.close").replace("{name}",p);return(0,L.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,L.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${c}`,"aria-controls":`fx-panel-${c}`,"aria-selected":s,tabIndex:s?0:-1,title:a.path,"data-testid":"fs-tab","data-path":a.path,ref:s?u:void 0,onClick:()=>r(a.path),children:[(0,L.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":H(a.path),"aria-hidden":"true",children:q(a.path)}),(0,L.jsx)("span",{className:"fx-tab-name",children:p})]}),(0,L.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":P,title:P,"data-testid":"fs-tab-close",onClick:()=>o(a.path),children:"\xD7"})]},a.path)})})}function kn(){return(0,L.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,L.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,L.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,L.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function wt({t:e}){return(0,L.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,L.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,L.jsx)(kn,{})}),(0,L.jsx)("strong",{children:e("panel.empty.title")}),(0,L.jsx)("span",{children:e("panel.empty.description")}),(0,L.jsxs)("span",{className:"fx-empty-keys",children:[(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,L.jsx)("span",{children:e("panel.empty.keys")})]})]})}var T=require("react");async function bt(e){let t=typeof navigator>"u"?void 0:navigator.clipboard;if(t!==void 0&&typeof t.writeText=="function")try{return await t.writeText(e),!0}catch{}if(typeof document>"u")return!1;let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}function Se(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function G(e){try{return e()}catch{return}}function St(e){return()=>{let t=G(()=>e.workspaceFiles);if(Se(t))return t;let n=G(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Se(n))return n;let r=G(()=>e.remote?.workspaceFiles);if(Se(r))return r;let o=G(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Se(o))return o}}function Ct(e,t){if(e===void 0||t===void 0)return;let n=e.read;if(typeof n=="function")return{read(r,o,i){return n.call(e,t,r,o,i)}}}function oe(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function qe(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Ce(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:oe(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?qe(r.value):{ok:!1,message:oe(r.error)}}return qe(n)}return qe(t)}function Pt(e){return e instanceof Error?e.message:oe(e)}function kt(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Rt(e){return()=>{let t=G(()=>e.remote?.gitExplorer);if(kt(t))return t;let n=G(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(kt(n))return n}}function Ge(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return typeof t.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:t.isRepository===!1?"":t.status}}function Pe(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:oe(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?Ge(o.snapshot):{ok:!1,message:oe(o.error)}}let r=e;return r.snapshot!==void 0?Ge(r.snapshot):Ge(n)}var g=require("react/jsx-runtime");function Cn(e,t){switch(e.kind){case"deleted":return t("preview.deleted.title");case"denied":return t("preview.denied.title");case"symlink":return t("preview.symlink.title");case"binary":return t("preview.binary.title");case"too-large":return t("preview.tooLarge.title");case"unavailable":return t("preview.unavailable.title");default:return t("preview.unknown.title")}}function Pn(e,t){switch(e.kind){case"deleted":return t("preview.deleted.description");case"denied":return t("preview.denied.description");case"symlink":return t("preview.symlink.description");case"binary":return t("preview.binary.description");case"too-large":return t("preview.tooLarge.description");case"unavailable":return t("preview.unavailable.description");default:return t("preview.unknown.description")}}function Rn({chunk:e,text:t,path:n,offset:r}){let o=(0,T.useRef)(null),i=(0,T.useRef)(null),[u,l]=(0,T.useState)(!1),a=ne(n);return(0,T.useEffect)(()=>{l(!1)},[e,n]),(0,T.useEffect)(()=>{let c=o.current;if(!(e===null||c===null))try{let s=e.mountCodePreview(c,{text:t,language:a,path:n,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{l(!0);return}},[e,n,a]),(0,T.useEffect)(()=>{i.current?.update(t,r)},[t,r,e]),e===null||u?(0,g.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:t}):(0,g.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Et({sessionId:e,files:t,path:n,t:r}){let o=(0,T.useMemo)(()=>Ct(t,e),[t,e]),[i,u]=(0,T.useState)(null),[l,a]=(0,T.useState)(te),[c,s]=(0,T.useState)(null),[p,P]=(0,T.useState)("reading"),[w,b]=(0,T.useState)(!1),h=(0,T.useRef)(void 0);if((0,T.useEffect)(()=>{if(o===void 0){u(null);return}let S=we({files:o,maxLines:200});return u(S),()=>S.close()},[o]),(0,T.useEffect)(()=>{if(i===null){a(te);return}return a(i.getSnapshot()),i.subscribe(()=>a(i.getSnapshot()))},[i]),(0,T.useEffect)(()=>{i===null||n===void 0||i.open(n)},[i,n]),(0,T.useEffect)(()=>{P("reading"),b(!1)},[n]),(0,T.useEffect)(()=>()=>{h.current!==void 0&&clearTimeout(h.current)},[]),(0,T.useEffect)(()=>{if(n===void 0)return;let S=!0;return gt().then(V=>{S&&s(V)}).catch(()=>{S&&s(null)}),()=>{S=!1}},[n]),n===void 0)return(0,g.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,g.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,g.jsx)("strong",{children:r("preview.empty.title")}),(0,g.jsx)("span",{children:r("preview.empty.description")})]})});let A=be(l),D=ve(n),z=l.status==="loading",d=l.status==="ready",m=D&&p==="reading",k=()=>{bt(n).then(S=>{S&&(b(!0),h.current!==void 0&&clearTimeout(h.current),h.current=setTimeout(()=>b(!1),1400))})},R;if(o===void 0)R=(0,g.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,g.jsx)("strong",{children:r("preview.unavailable.title")}),(0,g.jsx)("span",{children:r("preview.unavailable.description")})]});else if(l.status==="failed"){let S=l.failure??{kind:"unknown",code:"",message:""};R=(0,g.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":S.kind,children:[(0,g.jsx)("strong",{children:Cn(S,r)}),(0,g.jsx)("span",{children:Pn(S,r)}),S.message===""?null:(0,g.jsx)("code",{className:"fx-preview-hint",children:S.message}),(0,g.jsx)("button",{type:"button",className:"fx-btn",onClick:()=>{i?.retry()},"data-testid":"fs-preview-retry",children:r("preview.retry")})]})}else d?m?R=c===null?(0,g.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:he(l.text)}):(0,g.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,g.jsx)(c.MarkdownView,{text:l.text})}):R=(0,g.jsx)(Rn,{chunk:c,text:l.text,path:n,offset:l.offset}):R=(0,g.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]});return(0,g.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":l.status,"data-mode":m?"reading":"code","data-renderer":m?c===null?"fallback":"gfm":c?.renderer??"plain",children:[(0,g.jsxs)("header",{className:"fx-preview-bar",children:[(0,g.jsx)("span",{className:"fx-preview-path",title:n,"data-testid":"fs-preview-path",children:n}),(0,g.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[A.range,A.range==="\u2014"?null:(0,g.jsxs)(g.Fragment,{children:[" ",r("preview.lines")]}),A.total===void 0?null:(0,g.jsxs)("span",{className:"fx-preview-total",children:[" / ",A.total," ",r("preview.lines")]})]}),(0,g.jsxs)("div",{className:"fx-preview-actions",children:[D?(0,g.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>P(S=>S==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(p==="reading"?"preview.source":"preview.reading")}):null,(0,g.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!d||z||l.offset<=1,onClick:()=>{i?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,g.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!d||z||l.eof,onClick:()=>{i?.next()},"data-testid":"fs-preview-next",children:r("preview.next")}),(0,g.jsx)("button",{type:"button",className:"fx-pbtn",onClick:k,"data-testid":"fs-preview-copy",children:r(w?"preview.copied":"preview.copyPath")}),z?(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,g.jsx)("div",{className:"fx-preview-body","data-scroll":m?"y":"none",children:R})]})}var M=require("react");var y=require("react/jsx-runtime"),O=22;function Be({open:e=!0,size:t=14}){return(0,y.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,y.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,y.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function En(){return(0,y.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Tt(){return(0,y.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,y.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,y.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Lt(){return(0,y.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,y.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Tn({name:e}){return(0,y.jsx)("span",{className:"fx-badge","data-icon":H(e),"aria-hidden":"true",children:q(e)})}function Ln({row:e,selected:t,cursor:n,top:r,t:o,onToggle:i,onSelect:u,onRowActivate:l}){let a=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,y.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-cursor":n?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:c,onClick:()=>{l(e.path),a?i(e.path):u(e.path)},children:[(0,y.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,y.jsx)(En,{})}),a?(0,y.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,y.jsx)(Be,{open:e.expanded})}):(0,y.jsx)(Tn,{name:e.name}),(0,y.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,y.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":X(e.status),"data-testid":"fx-file-status",title:o(De(e.status)),"aria-label":o(De(e.status)),children:fe(e.status)}),e.statusCount===void 0?null:(0,y.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,y.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,y.jsx)("span",{className:"fx-size",children:ye(e.size)})]})}function Nn({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,y.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,y.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,y.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,y.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,y.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function Nt({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:i}){let u=(0,M.useRef)(null),[l,a]=(0,M.useState)(0),[c,s]=(0,M.useState)(0),[p,P]=(0,M.useState)(void 0),w=(0,M.useMemo)(()=>e.flatMap((d,m)=>d.type==="entry"?[m]:[]),[e]);(0,M.useEffect)(()=>{if(t===void 0)return;let d=e.findIndex(m=>m.type==="entry"&&m.path===t);d>=0&&P(d)},[t,e]),(0,M.useEffect)(()=>{p!==void 0&&e[p]?.type!=="entry"&&P(void 0)},[e,p]),(0,M.useEffect)(()=>{let d=u.current;if(p===void 0||d===null)return;let m=p*O;m<d.scrollTop?d.scrollTop=m:m+O>d.scrollTop+d.clientHeight&&(d.scrollTop=m+O-d.clientHeight)},[p]);let b=(0,M.useCallback)(d=>{P(d),u.current?.focus({preventScroll:!0})},[]),h=(0,M.useCallback)(d=>{let m=e.findIndex(k=>k.type==="entry"&&k.path===d);m>=0&&P(m)},[e]),A=(0,M.useCallback)(d=>{if(d.nativeEvent.isComposing||d.altKey||d.metaKey||d.ctrlKey)return;let m=w.at(-1);if(d.key==="ArrowDown"){if(d.preventDefault(),p===void 0){w[0]!==void 0&&b(w[0]);return}let R=w.find(S=>S>p);R!==void 0&&b(R);return}if(d.key==="ArrowUp"){if(d.preventDefault(),p===void 0){m!==void 0&&b(m);return}let R=[...w].reverse().find(S=>S<p);R!==void 0&&b(R);return}if(p===void 0)return;let k=e[p];if(!(k===void 0||k.type!=="entry")){if(d.key==="ArrowRight"){if(d.preventDefault(),k.kind==="directory"&&!k.expanded)r(k.path);else{let R=w.find(S=>S>p);R!==void 0&&e[R]?.depth===k.depth+1&&b(R)}return}if(d.key==="ArrowLeft"){if(d.preventDefault(),k.kind==="directory"&&k.expanded)r(k.path);else{let R=[...w].reverse().find(S=>S<p&&e[S]?.type==="entry"&&e[S].depth<k.depth);R!==void 0&&b(R)}return}if(d.key==="Enter"&&k.kind!=="directory"){d.preventDefault(),o(k.path);return}if(d.key==="Home"){d.preventDefault(),w[0]!==void 0&&b(w[0]);return}d.key==="End"&&(d.preventDefault(),m!==void 0&&b(m))}},[p,w,b,r,o,e]);(0,M.useEffect)(()=>{let d=u.current;if(d===null)return;let m=()=>s(d.clientHeight);if(m(),typeof ResizeObserver>"u")return;let k=new ResizeObserver(m);return k.observe(d),()=>k.disconnect()},[]),(0,M.useEffect)(()=>{if(t===void 0)return;let d=u.current;if(d===null)return;let m=e.findIndex(R=>R.type==="entry"&&R.path===t);if(m<0)return;let k=m*O;(k<d.scrollTop||k+O>d.scrollTop+d.clientHeight)&&(d.scrollTop=Math.max(0,k-d.clientHeight/2))},[t,e]);let D=d=>{a(d.currentTarget.scrollTop)},z=pe(e,{scrollTop:l,height:c===0?480:c,rowHeight:O});return(0,y.jsx)("div",{className:"fx-scroll",ref:u,onScroll:D,onKeyDown:A,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,y.jsx)("div",{className:"fx-vlist",style:{height:e.length*O},children:z.rows.map((d,m)=>{let k=(z.startIndex+m)*O;return d.type==="entry"?(0,y.jsx)(Ln,{row:d,top:k,selected:d.path===t,cursor:p===z.startIndex+m,t:n,onToggle:r,onSelect:o,onRowActivate:h},d.path):(0,y.jsx)(Nn,{row:d,top:k,t:n,onRetry:i},d.key)})})})}var x=require("react/jsx-runtime");var Fn=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Re({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,x.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,x.jsx)("strong",{children:e}),t===void 0?null:(0,x.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,x.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function Ft({workbench:e,version:t,t:n,files:r,status:o}){let i=st();function u(l){let a=l.sessionId??e.currentSessionId(),c=(0,v.useRef)(a);c.current=a;let s=(0,v.useMemo)(()=>r(),[r]),p=(0,v.useMemo)(()=>o(),[o]),[P,w]=(0,v.useState)(()=>new Map),[b,h]=(0,v.useState)(void 0),A=(0,v.useRef)(P);A.current=P;let[D,z]=(0,v.useState)(()=>new Set),d=(0,v.useMemo)(()=>i.forSession(a),[i,a]),m=(0,v.useSyncExternalStore)(d.subscribe,d.snapshot,d.snapshot),k=m.active??void 0,[R,S]=(0,v.useState)(0),[V,ie]=(0,v.useState)(void 0),K=(0,v.useRef)(new Map),Ee=(0,v.useRef)(void 0),_=(0,v.useCallback)(async(f,C,E)=>{K.current.get(f)?.abort();let N=new AbortController;K.current.set(f,N),w(W=>new Map(W).set(f,Fn()));try{let W=await E.list(C,xe(f),N.signal);if(N.signal.aborted||c.current!==C)return!1;let j=Ce(W);if(!j.ok)return w(Le=>new Map(Le).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:j.message})),!1;let Te=ue(j.listing.entries);return w(Le=>new Map(Le).set(f,{status:"ready",nodes:Te,truncated:j.listing.truncated===!0,total:j.listing.entries.length})),!0}catch(W){return N.signal.aborted||w(j=>new Map(j).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:Pt(W)})),!1}finally{K.current.get(f)===N&&K.current.delete(f)}},[]);(0,v.useEffect)(()=>{for(let f of K.current.values())f.abort();return K.current.clear(),w(new Map),z(new Set),ie(void 0),Ee.current=void 0,a!==void 0&&s!==void 0&&_("",a,s),()=>{for(let f of K.current.values())f.abort();K.current.clear()}},[a,s,R,_]),(0,v.useEffect)(()=>{if(a===void 0||p===void 0){h(void 0);return}let f=!0,C=new AbortController;return h(void 0),Promise.resolve().then(()=>p.snapshot({sessionId:a,maxCommits:1},C.signal)).then(E=>{if(!f)return;let N=Pe(E);h(N.ok?ce(N.status):void 0)}).catch(()=>{f&&h(void 0)}),()=>{f=!1,C.abort()}},[a,p,R]),(0,v.useEffect)(()=>{let f=l.viewRequest;if(f==null||f.view!==U)return;let C=`${f.view}:${f.focus}`;Ee.current!==C&&(Ee.current=C,J(f.focus,{open:(E,N)=>{d.open(E,N),ie({path:E,line:N})}}),l.completeViewRequest?.())},[l.viewRequest,l.completeViewRequest,d]),(0,v.useEffect)(()=>{let f=e.viewFocus;if(f===void 0||a===void 0)return;let C=()=>{let E=f.take(U);E!==void 0&&J(E,{open:(N,W)=>{d.open(N,W),ie({path:N,line:W})}})};return C(),f.subscribe(C)},[e,a,d]);let F=P.get(""),Ue=F?.status==="ready";(0,v.useEffect)(()=>{if(V===void 0||a===void 0||s===void 0||!Ue)return;let f=!0,C=V.path.split("/").filter(Boolean),E=[],N="";for(let j of C.slice(0,-1))N=Z(N,j),E.push(N);return E.length>0&&z(j=>new Set([...j,...E])),(async()=>{for(let j of E){if(A.current.get(j)?.status==="ready")continue;let Te=await _(j,a,s);if(!f||!Te)return}f&&(d.open(V.path,V.line),ie(void 0))})(),()=>{f=!1}},[V,a,s,Ue,_,d]);let Xe=(0,v.useCallback)(()=>{if(typeof document>"u")return!1;let f=document.querySelector("[data-composer-input]");return f===null?!1:(f.focus(),!0)},[]);(0,v.useEffect)(()=>{if(typeof document>"u")return;let f=C=>{if(!(C.isComposing||Qe(C.target))){for(let E of le)if(Je(C,E)){if(E.action==="closePanel"&&d.snapshot().active===null)return;C.preventDefault(),C.stopPropagation(),E.action==="nextPanel"?d.next():E.action==="previousPanel"?d.previous():d.close();return}}};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[d]),(0,v.useEffect)(()=>{if(typeof document>"u")return;let f=de({focusComposer:Xe,hasModal:()=>et(document)}),C=E=>f(E);return document.addEventListener("keydown",C,!0),()=>document.removeEventListener("keydown",C,!0)},[Xe]);let Dt=(0,v.useMemo)(()=>ge(P,D,b),[P,D,b]),B=b===void 0?void 0:Object.keys(b).length,At=b===void 0?"neutral":Object.values(b).some(f=>f.status==="conflicted")?"conflict":B===0?"success":"warning",Wt=(0,v.useCallback)(f=>{if(a===void 0||s===void 0)return;if(D.has(f)){z(E=>{let N=new Set(E);return N.delete(f),N});return}z(E=>new Set(E).add(f));let C=P.get(f);(C===void 0||C.status==="failed")&&_(f,a,s)},[D,P,a,s,_]),Ye=(0,v.useCallback)(f=>{a===void 0||s===void 0||_(f,a,s)},[a,s,_]),Kt=()=>z(new Set),_t=()=>S(f=>f+1),Ot=a===void 0?"no-session":s===void 0?"no-service":F===void 0||F.status==="loading"?"loading":F.status==="failed"?"failed":F.nodes.length===0?"empty":"tree";return(0,x.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":Ot,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,x.jsxs)("header",{className:"fx-head",children:[(0,x.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,x.jsx)(Be,{open:!0})}),(0,x.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,x.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,x.jsxs)("div",{className:"fx-head-meta",children:[F?.status==="ready"?(0,x.jsxs)("span",{children:[(0,x.jsx)("b",{children:F.nodes.length})," ",n("head.entries")]}):null,(0,x.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:D.size===0,onClick:Kt,children:(0,x.jsx)(Lt,{})}),(0,x.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:a===void 0||s===void 0||F?.status==="loading",onClick:_t,children:(0,x.jsx)(Tt,{})})]})]}),(0,x.jsx)("div",{className:"fx-main",children:a===void 0?(0,x.jsx)(Re,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,x.jsx)(Re,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):F===void 0||F.status==="loading"?(0,x.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):F.status==="failed"?(0,x.jsx)(Re,{title:n("state.failed.title"),description:F.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>Ye(""),testId:"fs-failed"}):F.nodes.length===0?(0,x.jsx)(Re,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("div",{className:"fx-tree-pane",children:(0,x.jsx)(Nt,{rows:Dt,selectedPath:k,t:n,onToggle:Wt,onSelect:f=>d.open(f),onRetry:Ye})}),(0,x.jsxs)("div",{className:"fx-editor",children:[(0,x.jsx)(vt,{panels:m.panels,active:m.active,t:n,onActivate:f=>d.activate(f),onClose:f=>d.close(f),onStep:f=>f===1?d.next():d.previous()}),(0,x.jsx)("div",{className:"fx-editor-body",children:m.panels.length===0?(0,x.jsx)(wt,{t:n}):m.panels.map((f,C)=>(0,x.jsx)("div",{className:"fx-panel",id:`fx-panel-${C}`,role:"tabpanel","aria-labelledby":`fx-tab-${C}`,hidden:f.path!==m.active,"data-line":f.line,"data-testid":"fs-panel",children:(0,x.jsx)(Et,{sessionId:a,files:s,path:f.path,t:n})},f.path))})]})]})}),F?.status==="ready"?(0,x.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,x.jsxs)("span",{children:[n("view.scope")," ",(0,x.jsx)("b",{children:F.nodes.length})," ",n("head.entries")]}),F.truncated?(0,x.jsx)("span",{className:"fx-foot-warn",children:Y({entries:F.nodes,truncated:!0,total:F.total}).label}):null,(0,x.jsxs)("span",{className:"fx-foot-git","data-state":B===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,x.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":At,"aria-hidden":"true"}),B===void 0?n("status.unavailable"):B===0?n("status.clean"):n("status.summary").replace("{count}",String(B))]}),(0,x.jsx)("span",{className:"fx-spacer"}),(0,x.jsx)("span",{children:n("foot.order")})]}):null]})}return u}var Mt=["slots","locale","workbench","remote"];function In(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"en"}function It(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.register(se,{zh:Fe,en:Me}),r=e.locale.bind(se),o=ht(typeof document>"u"?void 0:document),i=Ft({workbench:t,version:t.version,t:r,files:St(e),status:Rt(e)});return e.slots.inject(je,()=>e.slots.register({name:je,id:U,order:100,label:()=>Ie(In(e)),locale:se},i)),()=>{o(),n()}}var jt={buildTree:ue,describeListing:Y,iconFor:H,computeTreeWindow:pe,flattenTree:ge,badgeFor:q,formatSize:ye,joinPath:Z,listingPath:xe,parseFocus:me,consumeViewRequest:J,createPanelStack:We,createEscapeHandler:de,KEYMAP:le,tabLabel:Ie,normalizeListing:Ce,normalizeStatusSnapshot:Pe,parseStatusZ:ce,statusTone:X,statusBadge:fe,createPreviewLoader:we,renderMarkdown:he,languageFor:ne,isMarkdownFile:ve,describePage:be,classifyPreviewFailure:$e,normalizePreviewPage:Ve,previewChunkRoute:mt},zt={name:"dsh-fs-explorer",inject:Mt,apply:It,__test:jt};var jn=zt;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
