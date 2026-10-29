window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Se=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var Rt=Object.getOwnPropertyNames;var Tt=Object.prototype.hasOwnProperty;var Pt=(e,n)=>{for(var t in n)Se(e,t,{get:n[t],enumerable:!0})},Ft=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of Rt(n))!Tt.call(e,i)&&i!==t&&Se(e,i,{get:()=>n[i],enumerable:!(r=Ct(n,i))||r.enumerable});return e};var Et=e=>Ft(Se({},"__esModule",{value:!0}),e);var fn={};Pt(fn,{__test:()=>gt,apply:()=>mt,boot:()=>Je,clientPlugin:()=>yt,default:()=>un,inject:()=>xt});module.exports=Et(fn);var _e={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002"},De={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file."};var J="dsh-fs-explorer",Ce="conversation.view",Q="fs-explorer";var ee="fs-explorer",Oe="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Re={chunk:"client.preview.js"};var Lt={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Nt={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Mt=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function $e(e){return typeof e=="string"&&Mt.has(e)}function Ve(e,n){let t=[],r=0;for(let i=0;i<n;i+=1){let o=e.indexOf(" ",r);if(o<0)return null;t.push(e.slice(r,o)),r=o+1}return{fields:t,rest:e.slice(r)}}function It(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function te(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let i=t[r];if(i===void 0||i===""||i.startsWith("# "))continue;let o=i[0];if(o==="?"){if(i[1]!==" ")continue;let d=i.slice(2);d!==""&&(n[d]={status:"untracked"});continue}if(o!=="!"){if(o==="1"||o==="2"){let d=Ve(i.slice(2),o==="1"?7:8);if(d===null)continue;let a=d.fields[0]??"",c=d.rest;if(c===""||a.length<2)continue;if(o==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[c]={status:"renamed"};continue}n[c]={status:It(a[0]??".",a[1]??".")};continue}if(o==="u"){let d=Ve(i.slice(2),9);if(d===null)continue;let a=d.rest;if(a==="")continue;n[a]={status:"conflicted"}}}}return n}function $(e){return $e(e)?Lt[e]:"neutral"}function ne(e){return $e(e)?Nt[e]:"?"}function Te(e){return`status.${e}`}function Ge(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}var jt=["conflicted","deleted","renamed","added","modified","untracked"];function zt(e){return $(jt.find(n=>e.has(n))??"modified")}function He(e){let n=new Map;if(e!==void 0)for(let[r,i]of Object.entries(e)){let o=r.replace(/\/+$/u,"");if(o==="")continue;let d=o.split("/"),a=r.endsWith("/")?d.length:d.length-1,c="";for(let s=0;s<a;s+=1){let l=d[s];if(l===void 0||l==="")continue;c=c===""?l:`${c}/${l}`;let y=n.get(c);y===void 0?n.set(c,{count:1,present:new Set([i.status])}):(y.count+=1,y.present.add(i.status))}}let t=new Map;for(let[r,i]of n)t.set(r,{count:i.count,tone:zt(i.present)});return t}var Wt=new Set(["node_modules",".git","dist","__pycache__"]);function At(e){return Wt.has(e)}function _t(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function re(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||At(r))continue;let i=_t(t),o=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(o===void 0?{name:r,kind:i}:{name:r,kind:i,size:o})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Dt=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Ot=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Vt=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),$t=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Gt=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Ht=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Bt=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Be(e){let n=e.toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function oe(e,n="file"){if(n==="directory")return"folder";let t=e.toLowerCase();if(Bt.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Be(t);return r===""?"file":Dt.has(r)?"code":Ot.has(r)?"markdown":Vt.has(r)?"data":$t.has(r)?"image":Gt.has(r)?"style":Ht.has(r)?"archive":"file"}var qt={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Ut={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ie(e){let n=e.toLowerCase(),t=qt[n];if(t!==void 0)return t;let r=Be(n),i=Ut[r];return i!==void 0?i:r!==""?r.slice(0,3).toUpperCase():(e.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function G(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Oe} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function ae(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),i=Math.max(0,Math.trunc(n.overscan??6)),o=Math.max(1,Math.ceil(r/t)),d=Math.max(0,e.length-o-i*2),a=Math.floor(Math.max(0,n.scrollTop)/t)-i,c=Math.min(Math.max(a,0),d),s=Math.min(e.length,c+o+i*2);return{rows:e.slice(c,s),startIndex:c,endIndex:s}}function se(e){return e===""?".":e}function H(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function le(e){if(typeof e!="string")return;let n=/^path:(.+?)(?::(\d+))?$/u.exec(e.trim());if(n===null)return;let r=(n[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(r==="")return;let i=n[2]===void 0?1:Math.max(1,Number.parseInt(n[2],10));return{path:r,line:i}}function de(e,n,t){let r=[],i=He(t),o=(d,a)=>{let c=e.get(d);if(!(c===void 0||c.status!=="ready"))for(let s of c.nodes){let l=H(d,s.name),y=s.kind==="directory",S=y&&n.has(l),g=y?void 0:Ge(l,t),h=y?i.get(l):void 0;if(r.push({type:"entry",path:l,name:s.name,kind:s.kind,depth:a,expanded:S,...s.size===void 0?{}:{size:s.size},...g===void 0?{}:{status:g},...h===void 0?{}:{statusCount:h.count,statusTone:h.tone}}),!S)continue;let p=e.get(l);if(p===void 0||p.status==="loading"){r.push({type:"status",key:`${l}:loading`,path:l,depth:a+1,state:"loading"});continue}if(p.status==="failed"){r.push({type:"status",key:`${l}:failed`,path:l,depth:a+1,state:"failed",message:p.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(p.nodes.length===0){r.push({type:"status",key:`${l}:empty`,path:l,depth:a+1,state:"empty"});continue}o(l,a+1),p.truncated&&r.push({type:"status",key:`${l}:truncated`,path:l,depth:a+1,state:"truncated",label:G({entries:p.nodes,truncated:!0,total:p.total}).label})}};return o("",0),r}function ce(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let i=r===0||t>=10?0:1;return`${t.toFixed(i)} ${n[r]??"B"}`}var qe=require("react");function C(e,n,...t){let r=t.filter(d=>d!=null&&d!==!1),i=(0,qe.createElement)(e,n??void 0,...r);if(i!==null&&typeof i=="object")return i;let o={...n??{}};return r.length===1?o.children=r[0]:r.length>1&&(o.children=r),{type:e,props:o,key:null}}function Kt(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Xt=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function A(e){let n=[],t=0;for(let r of e.matchAll(Xt)){let i=r.index??0;i>t&&n.push(e.slice(t,i));let o=r[0];if(o.startsWith("`"))n.push(C("code",null,o.slice(1,-1)));else if(o.startsWith("**")||o.startsWith("__"))n.push(C("strong",null,...A(o.slice(2,-2))));else if(o.startsWith("~~"))n.push(C("del",null,...A(o.slice(2,-2))));else if(o.startsWith("*")||o.startsWith("_"))n.push(C("em",null,...A(o.slice(1,-1))));else{let d=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(o),a=d?.[1]??o,c=d===null?void 0:Kt(d[2]??"");n.push(c===void 0?a:C("a",{href:c,rel:"noreferrer noopener"},a))}t=i+o.length}return t<e.length&&n.push(e.slice(t)),n}var Ue=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Ke=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Xe=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Pe=/^\s{0,3}>\s?(.*)$/u,Fe=/^\s{0,3}[-*+]\s+(.*)$/u,Ee=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Zt(e){return Ue.test(e)||Ke.test(e)||Xe.test(e)||Pe.test(e)||Fe.test(e)||Ee.test(e)}function Ze(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let i=Ue.exec(r);if(i!==null){let s=(i[1]??"```").slice(0,1),l=i[2]??"",y=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)y.push(e[t]??""),t+=1;t+=1,n.push(C("pre",null,C("code",l===""?null:{className:`language-${l}`},y.join(`
`))));continue}let o=Ke.exec(r);if(o!==null){let s=(o[1]??"#").length;n.push(C(`h${String(s)}`,null,...A(o[2]??""))),t+=1;continue}if(Xe.test(r)){n.push(C("hr",null)),t+=1;continue}if(Pe.test(r)){let s=[];for(;t<e.length;){let l=Pe.exec(e[t]??"");if(l===null)break;s.push(l[1]??""),t+=1}n.push(C("blockquote",null,...Ze(s)));continue}if(Fe.exec(r)!==null){let s=[];for(;t<e.length;){let l=Fe.exec(e[t]??"");if(l===null)break;s.push(C("li",null,...A(l[1]??""))),t+=1}n.push(C("ul",null,...s));continue}if(Ee.exec(r)!==null){let s=[];for(;t<e.length;){let l=Ee.exec(e[t]??"");if(l===null)break;s.push(C("li",null,...A(l[1]??""))),t+=1}n.push(C("ol",null,...s));continue}let c=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Zt(s))break;c.push(s.trim()),t+=1}n.push(C("p",null,...A(c.join(" "))))}return n}function ue(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return C("div",{className:"fx-md"},...Ze(n))}var Yt={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function K(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Yt[t.slice(r+1)]??"plaintext"}function fe(e){return K(e)==="markdown"}var q=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function B(e){return e!==null&&typeof e=="object"}function Jt(e){return e===""?0:e.split(`
`).length}function Le(e,n){if(!B(e))throw new q("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let a=B(e.error)?e.error:{},c=typeof a.code=="string"?a.code:"preview/unknown",s=typeof a.message=="string"?a.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",l=B(a.details)?a.details:{},y=typeof l.kind=="string"?l.kind:"";throw new q(c,s,y)}let t=e.ok===!0?e.value:e;if(!B(t)||typeof t.text!="string")throw new q("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Jt(t.text),i=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,o=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,d=t.eof===!0||i!==void 0&&r>0&&o+r-1>=i;return i===void 0?{text:t.text,lines:r,offset:o,eof:d}:{text:t.text,lines:r,offset:o,totalLines:i,eof:d}}function Ne(e){let n=B(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",i=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=`${t} ${r} ${i}`.toLowerCase();return o.includes("symlink")?{kind:"symlink",code:t,message:i}:o.includes("eacces")||o.includes("eperm")||o.includes("permission")||o.includes("denied")||o.includes("forbidden")||o.includes("\u6743\u9650")?{kind:"denied",code:t,message:i}:o.includes("not-found")||o.includes("not_found")||o.includes("enoent")||o.includes("no such file")||o.includes("deleted")||o.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:i}:o.includes("not-regular-file")||o.includes("not a regular file")?{kind:"binary",code:t,message:i}:o.includes("not-text")||o.includes("utf-8")||o.includes("binary")?{kind:"binary",code:t,message:i}:o.includes("too-large")||o.includes("too large")||o.includes("maxbytes")?{kind:"too-large",code:t,message:i}:o.includes("unavailable")?{kind:"unavailable",code:t,message:i}:{kind:"unknown",code:t,message:i}}var U=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function pe({files:e,maxLines:n=200}){let t=Math.max(1,Math.trunc(n)),r=U,i=0,o=null,d=[1],a=new Set,c=l=>{r=l;for(let y of a)y()},s=async(l,y)=>{i+=1;let S=i;o?.abort();let g=new AbortController;o=g,c({status:"loading",path:l,text:r.path===l?r.text:"",offset:y,lines:r.path===l?r.lines:0,...r.path===l&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===l?r.eof:!1});try{let h=await e.read(l,y>1?{offset:y,limit:t}:{limit:t},g.signal);if(S!==i)return;let p=Le(h,y);if(p.lines===0&&y>1){c({...r,status:"ready",eof:!0,text:"",lines:0});return}c(p.totalLines===void 0?{status:"ready",path:l,text:p.text,offset:p.offset,lines:p.lines,eof:p.eof}:{status:"ready",path:l,text:p.text,offset:p.offset,lines:p.lines,totalLines:p.totalLines,eof:p.eof})}catch(h){if(S!==i||g.signal.aborted)return;c({status:"failed",path:l,text:"",offset:y,lines:0,eof:!1,failure:Ne(h)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(l){return a.add(l),()=>{a.delete(l)}},async open(l){d=[1],await s(l,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let l=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&l>r.totalLines||(d.push(l),await s(r.path,l))},async prev(){if(r.path===void 0||d.length<=1)return;d=d.slice(0,-1);let l=d[d.length-1]??1;await s(r.path,l)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){i+=1,o?.abort(),o=null,d=[1],c(U)}}}function xe(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Me=Object.freeze({chunk:Re.chunk,id:`${J}/${Re.chunk}`}),Ye=null,X=null;function Je(e){Ye=e}function Qe(){return Me}function et(){if(X!==null)return X;let e=Ye;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${J}: the loader require was not handed over`));let n=e.async(`./${Me.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${J}: chunk ${Me.id} is missing its preview renderers`);return r});return X=n,n.catch(()=>{X===n&&(X=null)}),n}var tt="dsh-fs-explorer-styles",Qt=`
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
`;function nt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${tt}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=tt,t.textContent=Qt,e.head.appendChild(t),()=>{t.remove()}}var v=require("react");var w=require("react");async function rt(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}function me(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function O(e){try{return e()}catch{return}}function it(e){return()=>{let n=O(()=>e.workspaceFiles);if(me(n))return n;let t=O(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(me(t))return t;let r=O(()=>e.remote?.workspaceFiles);if(me(r))return r;let i=O(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(me(i))return i}}function at(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,i,o){return t.call(e,n,r,i,o)}}}function Z(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Ie(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function ge(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Z(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Ie(r.value):{ok:!1,message:Z(r.error)}}return Ie(t)}return Ie(n)}function st(e){return e instanceof Error?e.message:Z(e)}function ot(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function lt(e){return()=>{let n=O(()=>e.remote?.gitExplorer);if(ot(n))return n;let t=O(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(ot(t))return t}}function je(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return typeof n.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:n.isRepository===!1?"":n.status}}function ye(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Z(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let i=t;return i.ok?je(i.snapshot):{ok:!1,message:Z(i.error)}}let r=e;return r.snapshot!==void 0?je(r.snapshot):je(t)}var x=require("react/jsx-runtime");function tn(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function nn(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function rn({chunk:e,text:n,path:t,offset:r}){let i=(0,w.useRef)(null),o=(0,w.useRef)(null),[d,a]=(0,w.useState)(!1),c=K(t);return(0,w.useEffect)(()=>{a(!1)},[e,t]),(0,w.useEffect)(()=>{let s=i.current;if(!(e===null||s===null))try{let l=e.mountCodePreview(s,{text:n,language:c,path:t,offset:r});return o.current=l,()=>{l.destroy(),o.current=null}}catch{a(!0);return}},[e,t,c]),(0,w.useEffect)(()=>{o.current?.update(n,r)},[n,r,e]),e===null||d?(0,x.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,x.jsx)("div",{className:"fx-code-host",ref:i,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function dt({sessionId:e,files:n,path:t,t:r}){let i=(0,w.useMemo)(()=>at(n,e),[n,e]),[o,d]=(0,w.useState)(null),[a,c]=(0,w.useState)(U),[s,l]=(0,w.useState)(null),[y,S]=(0,w.useState)("reading"),[g,h]=(0,w.useState)(!1),p=(0,w.useRef)(void 0);if((0,w.useEffect)(()=>{if(i===void 0){d(null);return}let b=pe({files:i,maxLines:200});return d(b),()=>b.close()},[i]),(0,w.useEffect)(()=>{if(o===null){c(U);return}return c(o.getSnapshot()),o.subscribe(()=>c(o.getSnapshot()))},[o]),(0,w.useEffect)(()=>{o===null||t===void 0||o.open(t)},[o,t]),(0,w.useEffect)(()=>{S("reading"),h(!1)},[t]),(0,w.useEffect)(()=>()=>{p.current!==void 0&&clearTimeout(p.current)},[]),(0,w.useEffect)(()=>{if(t===void 0)return;let b=!0;return et().then(N=>{b&&l(N)}).catch(()=>{b&&l(null)}),()=>{b=!1}},[t]),t===void 0)return(0,x.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,x.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,x.jsx)("strong",{children:r("preview.empty.title")}),(0,x.jsx)("span",{children:r("preview.empty.description")})]})});let F=xe(a),M=fe(t),_=a.status==="loading",z=a.status==="ready",W=M&&y==="reading",he=()=>{rt(t).then(b=>{b&&(h(!0),p.current!==void 0&&clearTimeout(p.current),p.current=setTimeout(()=>h(!1),1400))})},L;if(i===void 0)L=(0,x.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,x.jsx)("strong",{children:r("preview.unavailable.title")}),(0,x.jsx)("span",{children:r("preview.unavailable.description")})]});else if(a.status==="failed"){let b=a.failure??{kind:"unknown",code:"",message:""};L=(0,x.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":b.kind,children:[(0,x.jsx)("strong",{children:tn(b,r)}),(0,x.jsx)("span",{children:nn(b,r)}),b.message===""?null:(0,x.jsx)("code",{className:"fx-preview-hint",children:b.message}),(0,x.jsx)("button",{type:"button",className:"fx-btn",onClick:()=>{o?.retry()},"data-testid":"fs-preview-retry",children:r("preview.retry")})]})}else z?W?L=s===null?(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:ue(a.text)}):(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,x.jsx)(s.MarkdownView,{text:a.text})}):L=(0,x.jsx)(rn,{chunk:s,text:a.text,path:t,offset:a.offset}):L=(0,x.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),r("preview.loading")]});return(0,x.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":a.status,"data-mode":W?"reading":"code","data-renderer":W?s===null?"fallback":"gfm":s?.renderer??"plain",children:[(0,x.jsxs)("header",{className:"fx-preview-bar",children:[(0,x.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),(0,x.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[F.range,F.range==="\u2014"?null:(0,x.jsxs)(x.Fragment,{children:[" ",r("preview.lines")]}),F.total===void 0?null:(0,x.jsxs)("span",{className:"fx-preview-total",children:[" / ",F.total," ",r("preview.lines")]})]}),(0,x.jsxs)("div",{className:"fx-preview-actions",children:[M?(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>S(b=>b==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(y==="reading"?"preview.source":"preview.reading")}):null,(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!z||_||a.offset<=1,onClick:()=>{o?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!z||_||a.eof,onClick:()=>{o?.next()},"data-testid":"fs-preview-next",children:r("preview.next")}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:he,"data-testid":"fs-preview-copy",children:r(g?"preview.copied":"preview.copyPath")}),_?(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,x.jsx)("div",{className:"fx-preview-body","data-scroll":W?"y":"none",children:L})]})}var j=require("react");var m=require("react/jsx-runtime"),Y=22;function ze({open:e=!0,size:n=14}){return(0,m.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,m.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,m.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function on(){return(0,m.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,m.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ct(){return(0,m.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,m.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,m.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function ut(){return(0,m.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,m.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function an({name:e}){return(0,m.jsx)("span",{className:"fx-badge","data-icon":oe(e),"aria-hidden":"true",children:ie(e)})}function sn({row:e,selected:n,top:t,t:r,onToggle:i,onSelect:o}){let d=e.kind==="directory",a={top:t,paddingLeft:8+e.depth*12};return(0,m.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:a,onClick:()=>{d?i(e.path):o(e.path)},children:[(0,m.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,m.jsx)(on,{})}),d?(0,m.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,m.jsx)(ze,{open:e.expanded})}):(0,m.jsx)(an,{name:e.name}),(0,m.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,m.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":$(e.status),"data-testid":"fx-file-status",title:r(Te(e.status)),"aria-label":r(Te(e.status)),children:ne(e.status)}),e.statusCount===void 0?null:(0,m.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:r("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,m.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,m.jsx)("span",{className:"fx-size",children:ce(e.size)})]})}function ln({row:e,top:n,t,onRetry:r}){let i=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,m.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,m.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,m.jsx)("span",{className:"fx-status-text",title:i,children:i}),e.state==="truncated"?(0,m.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,m.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function ft({rows:e,selectedPath:n,t,onToggle:r,onSelect:i,onRetry:o}){let d=(0,j.useRef)(null),[a,c]=(0,j.useState)(0),[s,l]=(0,j.useState)(0);(0,j.useEffect)(()=>{let g=d.current;if(g===null)return;let h=()=>l(g.clientHeight);if(h(),typeof ResizeObserver>"u")return;let p=new ResizeObserver(h);return p.observe(g),()=>p.disconnect()},[]),(0,j.useEffect)(()=>{if(n===void 0)return;let g=d.current;if(g===null)return;let h=e.findIndex(F=>F.type==="entry"&&F.path===n);if(h<0)return;let p=h*Y;(p<g.scrollTop||p+Y>g.scrollTop+g.clientHeight)&&(g.scrollTop=Math.max(0,p-g.clientHeight/2))},[n,e]);let y=g=>{c(g.currentTarget.scrollTop)},S=ae(e,{scrollTop:a,height:s===0?480:s,rowHeight:Y});return(0,m.jsx)("div",{className:"fx-scroll",ref:d,onScroll:y,"data-testid":"fs-tree-scroll",role:"tree","aria-label":t("view.tree"),children:(0,m.jsx)("div",{className:"fx-vlist",style:{height:e.length*Y},children:S.rows.map((g,h)=>{let p=(S.startIndex+h)*Y;return g.type==="entry"?(0,m.jsx)(sn,{row:g,top:p,selected:g.path===n,t,onToggle:r,onSelect:i},g.path):(0,m.jsx)(ln,{row:g,top:p,t,onRetry:o},g.key)})})})}var f=require("react/jsx-runtime");var dn=()=>({status:"loading",nodes:[],truncated:!1,total:0});function ve({title:e,description:n,actionLabel:t,onAction:r,testId:i}){return(0,f.jsxs)("div",{className:"fx-empty",role:"note","data-testid":i??"fs-state",children:[(0,f.jsx)("strong",{children:e}),n===void 0?null:(0,f.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function pt({workbench:e,version:n,t,files:r,status:i}){function o(d){let a=d.sessionId??e.currentSessionId(),c=(0,v.useRef)(a);c.current=a;let s=(0,v.useMemo)(()=>r(),[r]),l=(0,v.useMemo)(()=>i(),[i]),[y,S]=(0,v.useState)(()=>new Map),[g,h]=(0,v.useState)(void 0),p=(0,v.useRef)(y);p.current=y;let[F,M]=(0,v.useState)(()=>new Set),[_,z]=(0,v.useState)(void 0),[W,he]=(0,v.useState)(0),[L,b]=(0,v.useState)(void 0),N=(0,v.useRef)(new Map),we=(0,v.useRef)(void 0),I=(0,v.useCallback)(async(u,E,R)=>{N.current.get(u)?.abort();let T=new AbortController;N.current.set(u,T),S(D=>new Map(D).set(u,dn()));try{let D=await R.list(E,se(u),T.signal);if(T.signal.aborted||c.current!==E)return!1;let P=ge(D);if(!P.ok)return S(ke=>new Map(ke).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:P.message})),!1;let be=re(P.listing.entries);return S(ke=>new Map(ke).set(u,{status:"ready",nodes:be,truncated:P.listing.truncated===!0,total:P.listing.entries.length})),!0}catch(D){return T.signal.aborted||S(P=>new Map(P).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:st(D)})),!1}finally{N.current.get(u)===T&&N.current.delete(u)}},[]);(0,v.useEffect)(()=>{for(let u of N.current.values())u.abort();return N.current.clear(),S(new Map),M(new Set),z(void 0),b(void 0),we.current=void 0,a!==void 0&&s!==void 0&&I("",a,s),()=>{for(let u of N.current.values())u.abort();N.current.clear()}},[a,s,W,I]),(0,v.useEffect)(()=>{if(a===void 0||l===void 0){h(void 0);return}let u=!0,E=new AbortController;return h(void 0),Promise.resolve().then(()=>l.snapshot(a,{maxCommits:1},E.signal)).then(R=>{if(!u)return;let T=ye(R);h(T.ok?te(T.status):void 0)}).catch(()=>{u&&h(void 0)}),()=>{u=!1,E.abort()}},[a,l,W]),(0,v.useEffect)(()=>{let u=d.viewRequest;if(u==null||u.view!==Q)return;let E=`${u.view}:${u.focus}`;if(we.current===E)return;we.current=E;let R=le(u.focus);R!==void 0&&b(R),d.completeViewRequest?.()},[d.viewRequest,d.completeViewRequest]);let k=y.get(""),We=k?.status==="ready";(0,v.useEffect)(()=>{if(L===void 0||a===void 0||s===void 0||!We)return;let u=!0,E=L.path.split("/").filter(Boolean),R=[],T="";for(let P of E.slice(0,-1))T=H(T,P),R.push(T);return R.length>0&&M(P=>new Set([...P,...R])),(async()=>{for(let P of R){if(p.current.get(P)?.status==="ready")continue;let be=await I(P,a,s);if(!u||!be)return}u&&(z(L.path),b(void 0))})(),()=>{u=!1}},[L,a,s,We,I]);let vt=(0,v.useMemo)(()=>de(y,F,g),[y,F,g]),V=g===void 0?void 0:Object.keys(g).length,ht=g===void 0?"neutral":Object.values(g).some(u=>u.status==="conflicted")?"conflict":V===0?"success":"warning",wt=(0,v.useCallback)(u=>{if(a===void 0||s===void 0)return;if(F.has(u)){M(R=>{let T=new Set(R);return T.delete(u),T});return}M(R=>new Set(R).add(u));let E=y.get(u);(E===void 0||E.status==="failed")&&I(u,a,s)},[F,y,a,s,I]),Ae=(0,v.useCallback)(u=>{a===void 0||s===void 0||I(u,a,s)},[a,s,I]),bt=()=>M(new Set),kt=()=>he(u=>u+1),St=a===void 0?"no-session":s===void 0?"no-service":k===void 0||k.status==="loading"?"loading":k.status==="failed"?"failed":k.nodes.length===0?"empty":"tree";return(0,f.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":St,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,f.jsxs)("header",{className:"fx-head",children:[(0,f.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,f.jsx)(ze,{open:!0})}),(0,f.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,f.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,f.jsxs)("div",{className:"fx-head-meta",children:[k?.status==="ready"?(0,f.jsxs)("span",{children:[(0,f.jsx)("b",{children:k.nodes.length})," ",t("head.entries")]}):null,(0,f.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:F.size===0,onClick:bt,children:(0,f.jsx)(ut,{})}),(0,f.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:a===void 0||s===void 0||k?.status==="loading",onClick:kt,children:(0,f.jsx)(ct,{})})]})]}),(0,f.jsx)("div",{className:"fx-main",children:a===void 0?(0,f.jsx)(ve,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,f.jsx)(ve,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):k===void 0||k.status==="loading"?(0,f.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,f.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):k.status==="failed"?(0,f.jsx)(ve,{title:t("state.failed.title"),description:k.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Ae(""),testId:"fs-failed"}):k.nodes.length===0?(0,f.jsx)(ve,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:"fx-tree-pane",children:(0,f.jsx)(ft,{rows:vt,selectedPath:_,t,onToggle:wt,onSelect:z,onRetry:Ae})}),(0,f.jsx)(dt,{sessionId:a,files:s,path:_,t})]})}),k?.status==="ready"?(0,f.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,f.jsxs)("span",{children:[t("view.scope")," ",(0,f.jsx)("b",{children:k.nodes.length})," ",t("head.entries")]}),k.truncated?(0,f.jsx)("span",{className:"fx-foot-warn",children:G({entries:k.nodes,truncated:!0,total:k.total}).label}):null,(0,f.jsxs)("span",{className:"fx-foot-git","data-state":V===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,f.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ht,"aria-hidden":"true"}),V===void 0?t("status.unavailable"):V===0?t("status.clean"):t("status.summary").replace("{count}",String(V))]}),(0,f.jsx)("span",{className:"fx-spacer"}),(0,f.jsx)("span",{children:t("foot.order")})]}):null]})}return o}var xt=["slots","locale","workbench","remote"];function mt(e){let n=e.workbench;if(n==null)return()=>{};let t=e.locale.bind(ee),r=e.locale.register(ee,{zh:_e,en:De}),i=nt(typeof document>"u"?void 0:document),o=pt({workbench:n,version:n.version,t,files:it(e),status:lt(e)});return e.slots.inject(Ce,()=>e.slots.register({name:Ce,id:Q,order:100,label:()=>t("tab.label"),locale:ee},o)),()=>{i(),r()}}var gt={buildTree:re,describeListing:G,iconFor:oe,computeTreeWindow:ae,flattenTree:de,badgeFor:ie,formatSize:ce,joinPath:H,listingPath:se,parseFocus:le,normalizeListing:ge,normalizeStatusSnapshot:ye,parseStatusZ:te,statusTone:$,statusBadge:ne,createPreviewLoader:pe,renderMarkdown:ue,languageFor:K,isMarkdownFile:fe,describePage:xe,classifyPreviewFailure:Ne,normalizePreviewPage:Le,previewChunkRoute:Qe},yt={name:"dsh-fs-explorer",inject:xt,apply:mt,__test:gt};var un=yt;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
