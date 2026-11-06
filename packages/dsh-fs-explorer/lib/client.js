window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var kr=Object.defineProperty;var ad=Object.getOwnPropertyDescriptor;var sd=Object.getOwnPropertyNames;var dd=Object.prototype.hasOwnProperty;var ld=(e,n)=>{for(var t in n)kr(e,t,{get:n[t],enumerable:!0})},cd=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of sd(n))!dd.call(e,o)&&o!==t&&kr(e,o,{get:()=>n[o],enumerable:!(r=ad(n,o))||r.enumerable});return e};var ud=e=>cd(kr({},"__esModule",{value:!0}),e);var ru={};ld(ru,{__test:()=>vs,apply:()=>bs,boot:()=>nu,clientPlugin:()=>ws,default:()=>tu,inject:()=>xs});module.exports=ud(ru);var Pn=require("react");var Ho="dsh-resource://file/";function Go(e){try{return decodeURIComponent(e)}catch{return e}}function Wn(e){if(!e.startsWith(Ho))return null;let n=e.slice(Ho.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Go(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(Go).join("/")}}function Ge(e){return e.slice(e.lastIndexOf("/")+1)}var Vo=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title",claims:["workbench","sidebar"]},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title",claims:["workbench","sidebar"]},{family:"cad",extensions:["dxf"],titleKey:"cad.title",claims:["workbench","sidebar"]},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title",claims:["workbench"]},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title",claims:["workbench"]}];function qo(){return Vo.flatMap(e=>[...e.extensions])}function zn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Vo.find(o=>o.extensions.includes(r))?.family??null}var Te="dsh-fs-explorer",br="conversation.view",ke="fs-explorer";var $n="fs-explorer",Uo="fsExplorerDocuments",Xo="fsExplorerWorkspace",Yo="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function Zo(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var vr={chunk:"client.preview.js"},mt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};function Qo(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function yt(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=Qo(t);r===""||r==="."||n.add(r)}return n}function gt(e,n){if(n===void 0||n.size===0)return!1;let t=Qo(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var fd={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},pd={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},md=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function ei(e){return typeof e=="string"&&md.has(e)}function Jo(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function yd(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function ht(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Jo(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",u=a.rest;if(u===""||l.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:yd(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=Jo(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function jn(e){return ei(e)?fd[e]:"neutral"}function xt(e){return ei(e)?pd[e]:"?"}function wr(e){return`status.${e}`}function kt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function ni(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function ti(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function ri(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var gd=["conflicted","deleted","renamed","added","modified","untracked"];function hd(e){return jn(gd.find(n=>e.has(n))??"modified")}function oi(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,u="";for(let d=0;d<l;d+=1){let c=a[d];if(c===void 0||c==="")continue;u=u===""?c:`${u}/${c}`;let p=n.get(u);p===void 0?n.set(u,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:hd(o.present)});return t}var si=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],di=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function xd(e){return di.test(e)?e.slice(0,e.indexOf("/")):null}function kd(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function bd(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=kd(i[2]??"");a!==""&&di.test(a)&&t.push(a)}return t}function vd(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function ii(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function ai(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function bt(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of vd(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of bd(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=ii(a);if(l!==void 0){let u=l.workspaces,d=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let c of ai(Array.isArray(u)?u:d))o.add(c)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let d=ii(u);if(d!==void 0)for(let c of ai(d.packages))o.add(c)}for(let l of o){let u=xd(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function vt(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var wd=new Set([".git"]);function Sd(e){return wd.has(e)}function Rd(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function wt(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Sd(r))continue;let o=Rd(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Cd=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Td=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Pd=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Ed=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Fd=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Md=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Nd=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function li(e){let n=Ge(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Rn(e,n="file"){if(n==="directory")return"folder";let t=Ge(e.toLowerCase());if(Nd.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=li(t);return r===""?"file":Cd.has(r)?"code":Td.has(r)?"markdown":Pd.has(r)?"data":Ed.has(r)?"image":Fd.has(r)?"style":Md.has(r)?"archive":"file"}var Id={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Ld={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Cn(e){let n=Ge(e.toLowerCase()),t=Id[n];if(t!==void 0)return t;let r=li(n),o=Ld[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Kn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Yo} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function St(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),a),d=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function Rr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Rt(e){return e===""?".":e}function Ct(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Tn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function _n(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Tn(r,o),t.push(r);return t}function Sr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Tt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let u=Sr(t[2]),d=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return d===""||u<1?void 0:{path:d,line:u,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let u=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""?void 0:{path:u,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let u=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return u===""?void 0:{path:u,line:Sr(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let l=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(l!=="")return{path:l,line:Sr(i[2]),absolute:!1}}function ci(e){return e.selectionMoved?!0:e.cursorPath===void 0}function ui(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Pt(e,n,t,r,o){let i=[],a=oi(t),l=o?.showIgnored===!1,u=o?.hiddenLabel??Zo,d=(c,p)=>{let g=e.get(c);if(g===void 0||g.status!=="ready")return;let x=0;for(let f of g.nodes){let v=Tn(c,f.name),b=f.kind==="directory",E=gt(v,o?.ignored);if(E&&l){x+=1;continue}let A=b&&n.has(v),J=b||t===void 0?void 0:t[v],F=J?.status??(b?void 0:kt(v,t)),D=J===void 0?void 0:ni(J),W=b?a.get(v):void 0,U=b?vt(r,v):void 0;if(i.push({type:"entry",path:v,name:f.name,kind:f.kind,depth:p,expanded:A,...f.size===void 0?{}:{size:f.size},...F===void 0?{}:{status:F},...W===void 0?{}:{statusCount:W.count,statusTone:W.tone},...D===void 0?{}:{diff:D},...U===void 0?{}:{tag:U},...E?{ignored:!0}:{}}),!A)continue;let O=e.get(v);if(O===void 0||O.status==="loading"){i.push({type:"status",key:`${v}:loading`,path:v,depth:p+1,state:"loading"});continue}if(O.status==="failed"){i.push({type:"status",key:`${v}:failed`,path:v,depth:p+1,state:"failed",message:O.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(O.nodes.length===0){i.push({type:"status",key:`${v}:empty`,path:v,depth:p+1,state:"empty"});continue}d(v,p+1),O.truncated&&i.push({type:"status",key:`${v}:truncated`,path:v,depth:p+1,state:"truncated",label:Kn({entries:O.nodes,truncated:!0,total:O.total}).label})}x>0&&g.nodes.length===x&&i.push({type:"status",key:`${c}:hidden`,path:c,depth:p,state:"empty",label:u(x)})};return d("",0),i}var Bd=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Ad(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Dd(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Bd.has(Ad(n.path)))}function fi(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Dd(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Et(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Cr="dsh-fs-explorer:bridge",Od="fs-explorer-bridge",gi="dsh-resource://file/**",Tr="sidebar.right.pane.tab",Wd=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),zd=new Set(["docx","pptx","xlsx","xls","fods","csv","tsv","doc","ppt"]),$d=new Set(["makefile","dockerfile","license","readme","changelog",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".browserslistrc",".env"]),jd=new Set([...qo(),...Wd]);function Kd(e){let n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function Ft(e){if(typeof e!="string"||e==="")return!1;let n=Ge(e).toLowerCase();if(n==="")return!1;let t=Kd(n);return zd.has(t)?!1:$d.has(n)?!0:jd.has(t)}function _d(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function Hd(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Fr(e,n){if(typeof e!="string")return;let t=Wn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=Hd(n,_d(e));return`${Ct(r)?"abs:":"path:"}${r}:${String(o)}`}function Mr(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Wn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Ft(r.path))return{action:"keep",reason:"refused"};let o=Fr(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Ve(e,n){n===void 0?console.warn(`[${Te}] ${e}`):console.warn(`[${Te}] ${e}`,n)}function Gd(e){console.debug(`[${Te}] ${e}`)}function Pr(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Er(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function cn(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function pi(e){return cn(()=>e.sidebarRightTabs,Pr)??cn(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Pr)}function mi(e){return cn(()=>e.sidebarRight,Er)??cn(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Er)}function yi(e){return typeof e=="function"?e:()=>{}}var Vd="dsh-resource://file/session/probe/src/main.ts";function qd(e){let n=cn(()=>(typeof e.candidates=="function"?e.candidates(Vd):[]).filter(r=>r.priority==="extension"&&r.id!==Cr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&Ve(`another extension-band tab type already claims ${gi}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Ud(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Xd(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Yd(e,n){let t=e.viewFocus;if(t?.request?.(ke,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(ke,n);return(!r.opened||r.focused)&&t?.take(ke),r}return typeof e.openView=="function"&&e.openView(ke,n)?(t?.take(ke),{opened:!0,focused:!0}):(t?.take(ke),{opened:!1,focused:!1})}function Nr(e,n,t,r){let o;try{o=Yd(e,r)}catch(i){return Ve("the file workbench threw while switching views",i),e.viewFocus?.take(ke),!1}if(!o.opened)return Ve(`the file workbench did not switch to ${ke}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return Ve("the forwarded tab could not be closed",i),!1}}function Zd(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=Ud(i),u=Xd(i),d=(0,Pn.useRef)(void 0);return(0,Pn.useEffect)(()=>{if(a===void 0){Ve("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===a)return;d.current=a;let c=Mr(l,e.currentSessionId(),u);if(c.action!=="open"){Ve(`left the forwarded tab standing (${c.reason})`,l);return}Nr(e,n,a,c.focus)},[a,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(Ve(`the host did not inject useTabInfo into ${Tr}; the bridge cannot forward`),null):(0,Pn.createElement)(t,{useTabInfo:o.useTabInfo})}}function Ir(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;qd(l);let d;try{d=l.register({id:Cr,kind:Od,patterns:[gi],priority:"extension",canOpen:g=>{let x=Wn(g);return x!==null&&Ft(x.path)},title:g=>Ge(Wn(g)?.path??g)||g})}catch(g){Ve("the sidebar right refused the address bridge tab type",g);return}let c=Zd(n,u),p;try{p=yi(e.slots.inject(Tr,()=>e.slots.register({name:Tr,key:Cr},c)))}catch(g){d(),Ve("the sidebar right refused the address bridge body",g);return}return()=>{p(),d()}},r=pi(e),o=mi(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return Gd("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=cn(()=>l.get?.("sidebarRightTabs"),Pr)??pi(l),d=cn(()=>l.get?.("sidebarRight"),Er)??mi(l);return t(u,d)});return yi(a)}var Lr={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u53EA\u6709\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","preview.surface.image.title":"\u56FE\u7247","preview.surface.pdf.title":"PDF \u6587\u6863","preview.surface.pdf.page":"\u7B2C {current} / {total} \u9875","preview.surface.pdf.previous":"\u4E0A\u4E00\u9875","preview.surface.pdf.next":"\u4E0B\u4E00\u9875","preview.surface.pdf.error.password":"\u8FD9\u4E2A PDF \u9700\u8981\u5BC6\u7801\u624D\u80FD\u6253\u5F00","preview.surface.pdf.error.invalid":"\u8FD9\u4E2A PDF \u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 PDF","preview.surface.pdf.error.missing":"\u627E\u4E0D\u5230\u8FD9\u4E2A PDF \u7684\u5185\u5BB9","preview.surface.pdf.error.unknown":"\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A PDF","preview.surface.pdf.error.render":"\u8FD9\u4E00\u9875\u65E0\u6CD5\u7ED8\u5236","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","menu.tab.close":"\u5173\u95ED","menu.tab.closeOthers":"\u5173\u95ED\u5176\u4ED6\u6807\u7B7E\u9875","menu.tab.closeOthers.reason":"\u53EA\u6709\u8FD9\u4E00\u4E2A\u6807\u7B7E\u9875","menu.tab.closeRight":"\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E\u9875","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Br={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the current page only","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","preview.surface.image.title":"Image","preview.surface.pdf.title":"PDF document","preview.surface.pdf.page":"Page {current} of {total}","preview.surface.pdf.previous":"Previous page","preview.surface.pdf.next":"Next page","preview.surface.pdf.error.password":"This PDF is password protected","preview.surface.pdf.error.invalid":"This file is damaged or is not a valid PDF","preview.surface.pdf.error.missing":"The content of this PDF could not be found","preview.surface.pdf.error.unknown":"This PDF could not be opened","preview.surface.pdf.error.render":"This page could not be drawn","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","menu.tab.close":"Close","menu.tab.closeOthers":"Close other tabs","menu.tab.closeOthers.reason":"This is the only tab","menu.tab.closeRight":"Close tabs to the right","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Ar(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Lr:Br)["tab.label"]??"Files"}var bi=require("react"),vi=14,Qd="--dsh-content-font-size",hi=vi;function Jd(e,n){return Math.max(e,Math.round(e*n/vi))}function el(e,n){if(e===void 0)return n;let t=Number.parseFloat(e);return Number.isFinite(t)&&t>0?t:n}function wi(){return typeof document>"u"||document.body===null?hi:el(document.body.style.getPropertyValue(Qd),hi)}var Dr=wi(),Or=new Set;function xi(){return Dr}function nl(e){return Or.add(e),()=>{Or.delete(e)}}function tl(e){if(e!==Dr){Dr=e;for(let n of[...Or])n()}}function ki(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function rl(e){if(e===null||typeof e!="object")return;let n=e.fontSizes;if(n===null||typeof n!="object")return;let t=n.text;return typeof t=="number"&&Number.isFinite(t)&&t>0?t:void 0}function ol(e){try{let n=e.get?.("theme");if(ki(n))return n}catch{}try{let n=e.theme;if(ki(n))return n}catch{}}function Si(e){let n=e.inject;if(typeof n!="function")return()=>{};let t,r;try{let o=n.call(e,["theme"],i=>{let a=ol(i);if(a===void 0)return;let l=()=>{try{let c=rl(a.getTheme());tl(c??wi())}catch{}};l();let u=i.on?.("theme/change",l);if(typeof u!="function")return;let d=u;return t=d,d});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{t?.(),r?.()}}function Ri(e){let n=(0,bi.useSyncExternalStore)(nl,xi,xi);return Jd(e,n)}var il=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function be(e){return e!==null&&typeof e=="object"}function Nt(e,n){return{ok:!1,code:e,message:n}}function It(e){let n=be(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Nt(t,r)}function Wr(){return Nt("invalid-response","the document service answered an invalid response")}function Mt(e){try{return e()}catch{return}}function al(e){let n=be(e)?e:void 0;if(n===void 0)return Wr();if(n.ok===!1)return It(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=be(t)?t:void 0;if(r===void 0)return Wr();if(r.ok===!1)return It(r.error);let o=be(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Wr():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function sl(e){let n=be(e)?e:void 0;if(n===void 0)return Ci();if(n.ok===!1)return It(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=be(t)?t:void 0;if(r===void 0)return Ci();if(r.ok===!1)return It(r.error);let o=be(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Ci(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function zr(e){return be(e)&&typeof e.open=="function"}function dl(e){let n=Mt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=be(n)?n.rpc:void 0;if(!(!be(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Uo}/${r}`,o,i)}function ll(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function cl(e){let n=be(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=be(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=be(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function Ti(e,n){let t=jr(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return cl(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function jr(e){return()=>{let n=Mt(()=>e.fsExplorerDocuments);if(zr(n))return n;let t=Mt(()=>be(e.remote)?e.remote.fsExplorerDocuments:void 0);if(zr(t))return t;let r=Mt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(zr(r))return r;let o=dl(e);if(o!==void 0)return ll(o)}}function Pi(e){let n=jr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Nt("unavailable","the document service is unavailable");try{return al(await i.open({sessionId:t,path:r},o))}catch(a){return Nt("io-error",a instanceof Error?a.message:String(a))}}}function Ei(e){let n=jr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return sl(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function Fi(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let d=o(l,u),c=n.get(d);return c===void 0&&(c={session:new $r(l,u,e.open,e.save,()=>{n.delete(d),i()},i)},n.set(d,c),i()),c.session.retain(),c.session},peek(l,u){return a(l,u)?.getSnapshot()},find:a,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var $r=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=il;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Lt=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Kr(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Mi(e,n,t=Kr()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function Ni(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function ul(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Bt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function At(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&ul(n),e.onClose?.()}}function Ii(e){return e.viewSessionId===void 0||e.viewSessionId!==e.currentSessionId||e.activePanel===null?"pass":e.confirming?"hold":"close"}function Li(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function Dt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Ot(e){try{return e()}catch{return}}function Bi(e){return()=>{let n=Ot(()=>e.fileReferences);if(Dt(n))return n;let t=Ot(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(Dt(t))return t;let r=Ot(()=>e.remote?.fileReferences);if(Dt(r))return r;let o=Ot(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return Dt(o)?o:void 0}}function Ai(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function Di(e){let n=e.trim();return n===""?void 0:n}function _r(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?kt(i,n):void 0,u=fl(i);t.push({type:"entry",path:i,name:Li(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...u===""?{}:{directory:u}})}return t}function fl(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function Hn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:Tn(t,o.name),kind:o.kind});return n}function Oi(e,n){let t=n.toLowerCase();return e.filter(r=>Li(r.path).toLowerCase().includes(t))}function Wi(e){return _n(e)}var En=require("react");function zt(e){let n=Ge(e);return n===""?e:n}function Wt(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var pl=Object.freeze({panels:Object.freeze([]),active:null});function zi(e,n){return n===void 0?e:`git\0${n}\0${e}`}var ml=/^git:([0-9a-f]{4,64}):(.+)$/iu;function $i(e,n,t){let r=e.findIndex(i=>i.key===n);return r<0?[]:(t==="others"?e.filter((i,a)=>a!==r):e.slice(r+1)).map(i=>i.key)}function Hr(){let e=[],n=null,t=pl,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(c=>c.key===d),a=d=>e.findIndex(c=>c.revision===void 0&&c.key===d),l=d=>{if(typeof d!="string")return;if(i(d)>=0)return d;let c=ml.exec(d);if(c!==null){let x=(c[1]??"").toLowerCase(),f=Wt(c[2]??"",!1);if(f===void 0)return;let v=zi(f,x);return i(v)>=0?v:void 0}let p=Wt(d,!0);if(p===void 0)return;if(a(p)>=0)return p;let g=Wt(d,!1);if(!(g===void 0||g===p))return a(g)>=0?g:void 0},u=d=>{if(e.length===0)return;let c=n===null?-1:i(n),p=e[(c+d+e.length)%e.length];p===void 0||p.key===n||(n=p.key,o())};return{open(d,c=1,p=!1,g){let x=Wt(d,p);if(x===void 0)return;let f=typeof g=="string"&&g.trim()!==""?g.trim().toLowerCase():void 0,v=zi(x,f),b=Number.isFinite(c)&&c>0?Math.trunc(c):1,E=i(v);if(E>=0){let F=e[E],D=F!==void 0&&(F.line!==b||F.absolute!==p);if(D&&(e=e.map((W,U)=>U===E?{...W,line:b,absolute:p}:W)),n===v){D&&o();return}n=v,o();return}let A=n===null?e.length:i(n)+1,J={key:v,path:x,line:b,absolute:p,...f===void 0?{}:{revision:f}};e=[...e.slice(0,A),J,...e.slice(A)],n=v,o()},close(d){let c=d===void 0?n:l(d)??null;if(c===null)return;let p=i(c);p<0||(e=e.filter(g=>g.key!==c),n===c&&(n=(e[p]??e[p-1])?.key??null),o())},activate(d){let c=l(d);c===void 0||i(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let c=l(d);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(d=>d.key===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function ji(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Hr();return e.set(t,o),o}}}function $t(e,n){let t=Tt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var V=require("react/jsx-runtime"),Gr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},yl=()=>()=>{},gl=()=>"";function hl(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Ki({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,onTabMenu:a,documents:l,sessionId:u}){let d=(0,En.useRef)(null);(0,En.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let c=(0,En.useSyncExternalStore)(l?.subscribe??yl,()=>hl(l,u,e).join("\0"),gl),p=new Set(c===""?[]:c.split("\0"));if(e.length===0)return null;let g=x=>{if(x.key==="ArrowRight"||x.key==="ArrowLeft"){x.preventDefault(),x.stopPropagation(),i(x.key==="ArrowRight"?1:-1);return}(x.key==="Delete"||x.key==="Backspace")&&n!==null&&(x.preventDefault(),x.stopPropagation(),o(n))};return(0,V.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((x,f)=>{let v=x.key===n,b=zt(x.path),E=t("panel.close").replace("{name}",b);return(0,V.jsxs)("div",{className:"fx-tab","data-active":v?"true":"false","data-dirty":p.has(x.path)?"true":"false",role:"presentation",onContextMenu:a===void 0?void 0:A=>{A.preventDefault(),A.stopPropagation(),a(x.key,{x:A.clientX,y:A.clientY},A.currentTarget)},children:[(0,V.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${f}`,"aria-controls":`fx-panel-${f}`,"aria-selected":v,tabIndex:v?0:-1,title:x.path,"data-testid":"fs-tab","data-path":x.path,"data-key":x.key,ref:v?d:void 0,onClick:()=>r(x.key),children:[(0,V.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Rn(x.path),"aria-hidden":"true",children:Cn(x.path)}),(0,V.jsx)("span",{className:"fx-tab-name",children:b}),x.revision===void 0?null:(0,V.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:x.revision,children:x.revision.slice(0,7)}),p.has(x.path)?(0,V.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,V.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:v?0:-1,"aria-label":E,title:E,"data-testid":"fs-tab-close",onClick:()=>o(x.key),children:"\xD7"})]},x.key)})})}function _i({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,V.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,V.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,V.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,V.jsx)("span",{className:"fx-spacer"}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function xl(){return(0,V.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,V.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,V.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,V.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function kl(){return typeof document<"u"&&document.documentElement.dataset.platform!==void 0&&Kr()==="mac"?"\u2318W":"Ctrl+W"}function Hi({t:e}){return(0,V.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,V.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,V.jsx)(xl,{})}),(0,V.jsx)("strong",{children:e("panel.empty.title")}),(0,V.jsx)("span",{children:e("panel.empty.description")}),(0,V.jsxs)("span",{className:"fx-empty-keys",children:[(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:kl()}),(0,V.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Gi=require("react");function fe(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Gi.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function bl(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var vl=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function un(e){let n=[],t=0;for(let r of e.matchAll(vl)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(fe("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(fe("strong",null,...un(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(fe("del",null,...un(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(fe("em",null,...un(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,u=a===null?void 0:bl(a[2]??"");n.push(u===void 0?l:fe("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Vi=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,qi=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Ui=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Vr=/^\s{0,3}>\s?(.*)$/u,qr=/^\s{0,3}[-*+]\s+(.*)$/u,Ur=/^\s{0,3}\d+[.)]\s+(.*)$/u;function wl(e){return Vi.test(e)||qi.test(e)||Ui.test(e)||Vr.test(e)||qr.test(e)||Ur.test(e)}function Xi(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Vi.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),c=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(fe("pre",null,fe("code",c===""?null:{className:`language-${c}`},p.join(`
`))));continue}let i=qi.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(fe(`h${String(d)}`,null,...un(i[2]??""))),t+=1;continue}if(Ui.test(r)){n.push(fe("hr",null)),t+=1;continue}if(Vr.test(r)){let d=[];for(;t<e.length;){let c=Vr.exec(e[t]??"");if(c===null)break;d.push(c[1]??""),t+=1}n.push(fe("blockquote",null,...Xi(d)));continue}if(qr.exec(r)!==null){let d=[];for(;t<e.length;){let c=qr.exec(e[t]??"");if(c===null)break;d.push(fe("li",null,...un(c[1]??""))),t+=1}n.push(fe("ul",null,...d));continue}if(Ur.exec(r)!==null){let d=[];for(;t<e.length;){let c=Ur.exec(e[t]??"");if(c===null)break;d.push(fe("li",null,...un(c[1]??""))),t+=1}n.push(fe("ol",null,...d));continue}let u=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||wl(d))break;u.push(d.trim()),t+=1}n.push(fe("p",null,...un(u.join(" "))))}return n}function jt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return fe("div",{className:"fx-md"},...Xi(n))}var Xr=200,Sl={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function qn(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Sl[t.slice(r+1)]??"plaintext"}function Un(e){return qn(e)==="markdown"}var he=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Gn(e){return e!==null&&typeof e=="object"}function Rl(e){return e===""?0:e.split(`
`).length}function Fn(e,n){if(!Gn(e))throw new he("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=Gn(e.error)?e.error:{},p=typeof c.code=="string"?c.code:"preview/unknown",g=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",x=Gn(c.details)?c.details:{},f=typeof x.kind=="string"?x.kind:"";throw new he(p,g,f)}let t=e.ok===!0?e.value:e;if(!Gn(t)||typeof t.text!="string")throw new he("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Rl(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,d={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?d:{...d,totalLines:o}}function fn(e){let n=Gn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Vn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Kt({files:e,maxLines:n=Xr}){let t=Math.max(1,Math.trunc(n)),r=Vn,o=0,i=null,a=[1],l=new Set,u=c=>{r=c;for(let p of l)p()},d=async(c,p)=>{o+=1;let g=o;i?.abort();let x=new AbortController;i=x,u({status:"loading",path:c,text:r.path===c?r.text:"",offset:p,lines:r.path===c?r.lines:0,...r.path===c&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===c&&r.source!==void 0?{source:r.source}:{},eof:r.path===c?r.eof:!1});try{let f=await e.read(c,p>1?{offset:p,limit:t}:{limit:t},x.signal);if(g!==o)return;let v=Fn(f,p);if(v.lines===0&&p>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let b={status:"ready",path:c,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof,...v.source===void 0?{}:{source:v.source},...v.linkTarget===void 0?{}:{linkTarget:v.linkTarget,linkPath:c}};u(v.totalLines===void 0?b:{...b,totalLines:v.totalLines})}catch(f){if(g!==o||x.signal.aborted)return;u({status:"failed",path:c,text:"",offset:p,lines:0,eof:!1,failure:fn(f)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(c){return l.add(c),()=>{l.delete(c)}},async open(c){a=[1],await d(c,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let c=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&c>r.totalLines||(a.push(c),await d(r.path,c))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let c=a[a.length-1]??1;await d(r.path,c)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(Vn)}}}function _t(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Yr=Object.freeze({chunk:vr.chunk,id:`${Te}/${vr.chunk}`}),Zr=null,Xn=null,Ht=new Map;function Yi(e){Zr=e}function Zi(){return Yr}function Cl(e){let n=mt[e];return{chunk:n,id:`${Te}/${n}`}}function Qr(){if(Xn!==null)return Xn;let e=Zr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Te}: the loader require was not handed over`));let n=e.async(`./${Yr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Te}: chunk ${Yr.id} is missing its preview renderers`);return r});return Xn=n,n.catch(()=>{Xn===n&&(Xn=null)}),n}function Qi(e){let n=Ht.get(e);if(n!==void 0)return n;let t=Zr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${Te}: the loader require was not handed over`));let r=Cl(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${Te}: chunk ${r.id} is not the ${e} view`);return a});return Ht.set(e,o),o.catch(()=>{Ht.get(e)===o&&Ht.delete(e)}),o}var Ji=Object.freeze({}),Tl="@deepseek-ai/dsh-client-ui-primitives",eo=null,Jr;function ea(e){eo=e}function Pl(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function Gt(){if(Jr!=null)return Jr;if(eo===null)return Ji;let e=Pl(eo,Tl);if(e===void 0)return Ji;let n=c=>{let p=e[c];if(typeof p=="function"||typeof p=="object"&&p!==null)return p},t=c=>{let p=e[c];return typeof p=="function"?p:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let d=t("useAnchoredPosition");return d!==void 0&&(r.useAnchoredPosition=d),r}var z=require("react");async function pn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var qt=require("react");function El(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function Vt(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(El(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function na(e,n,t){return n<=0?0:((e+t)%n+n)%n}function ta(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function no(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function ra(e){let n=t=>Vt(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var Fl=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),Ml=new Set(["SCRIPT","STYLE","TEMPLATE"]);function Nl(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let d=i.data;if(d==="")continue;let c=n.at(-1);c===void 0?n.push([d]):c.push(d),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(Ml.has(l))continue;if(l==="BR"){n.push([]);continue}let u=Fl.has(l);u&&n.push([]),r(a),u&&n.push([])}};return r(e),{layout:ta(n),nodes:t}}function oa(e){let n=()=>{let r=e();return r===null?void 0:Nl(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:Vt(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=Vt(i.layout.text,r)[o];if(l===void 0)return;let u=no(i.layout,l.from),d=no(i.layout,l.to);if(u===void 0||d===void 0)return;let c=i.nodes[u.node],p=i.nodes[d.node];if(c===void 0||p===void 0)return;let g=a.ownerDocument.createRange();try{g.setStart(c,Math.min(u.offset,c.data.length)),g.setEnd(p,Math.min(d.offset,p.data.length))}catch{return}let x=t();x!==void 0&&(x.removeAllRanges(),x.addRange(g));let f=g.startContainer.parentElement;f!==null&&typeof f.scrollIntoView=="function"&&f.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var to=(0,qt.createContext)(null);function ia(){return(0,qt.useContext)(to)}var qe=require("react/jsx-runtime");function Il(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Ll(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function ro({failure:e,t:n,onRetry:t}){return(0,qe.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,qe.jsx)("strong",{children:Il(e,n)}),(0,qe.jsx)("span",{children:Ll(e,n)}),e.message===""?null:(0,qe.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,qe.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function oo({t:e}){return(0,qe.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,qe.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Pe=require("react");var Je=require("react/jsx-runtime");function aa({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Pe.useState)(""),[a,l]=(0,Pe.useState)(0),[u,d]=(0,Pe.useState)(0),c=(0,Pe.useRef)(null);(0,Pe.useEffect)(()=>{c.current?.focus()},[]),(0,Pe.useEffect)(()=>{if(o===""){d(0),l(0);return}let v=n().count(o);d(v),l(b=>v===0?0:Math.min(b,v-1))},[o,t,n]),(0,Pe.useEffect)(()=>{o===""||u===0||n().reveal(o,a)},[o,a,u,n]);let p=(0,Pe.useCallback)(()=>{n().clear(),r()},[n,r]),g=(0,Pe.useCallback)(v=>{u!==0&&l(b=>na(b,u,v))},[u]),x=v=>{if(!v.nativeEvent.isComposing){if(v.key==="Escape"){v.preventDefault(),v.stopPropagation(),p();return}if(v.key==="Enter"){v.preventDefault(),g(v.shiftKey?-1:1);return}(v.key==="ArrowDown"||v.key==="ArrowUp")&&v.stopPropagation()}},f=o===""?e("preview.find.hint"):u===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(a+1)).replace("{count}",String(u));return(0,Je.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:x,children:[(0,Je.jsx)("input",{ref:c,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:v=>{i(v.currentTarget.value),l(0)}}),(0,Je.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":u===0?"empty":"ready",title:e("preview.find.scope"),children:f}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:u===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>g(-1),children:"\u2191"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:u===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>g(1),children:"\u2193"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:p,children:"\xD7"})]})}var io="fsExplorer",sa=1;function Bl(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Al(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Dl(e){return e.slice(e.lastIndexOf("/")+1).toLowerCase()}function Ol(e,n,t,r){return e.extensions.length===0&&e.families.length===0&&e.names.length===0||n!==""&&e.extensions.includes(n)||t!==null&&e.families.includes(t)?!0:e.names.includes(r)}function Wl(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Ut(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Al),families:[...i.match?.families??[]],names:(i.match?.names??[]).map(u=>u.toLowerCase())}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=Bl(i.path),l=zn(i.path),u=Dl(i.path),d;for(let c of t.values())Ol(c,a,l,u)&&(d===void 0||Wl(c.contribution,d.contribution))&&(d=c);return d?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function da(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Xt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function We(e){try{return e()}catch{return}}function Me(e){return e!==null&&typeof e=="object"}function pa(e){return()=>{let n=We(()=>e.workspaceFiles);if(Xt(n))return n;let t=We(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Xt(t))return t;let r=We(()=>e.remote?.workspaceFiles);if(Xt(r))return r;let o=We(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Xt(o))return o}}function ma(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function ya(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Fn(i,r.offset??1),i}catch(d){if(!(d instanceof he)||fn(d).kind!=="symlink")throw d;a=d}let l=await n(t,o);if(l===void 0)throw a;return{...Fn(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function la(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function zl(e){let n=We(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Me(n)?n.rpc:void 0;if(!Me(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function ga(e){return()=>{let n=We(()=>e.remote?.gitExplorer);if(la(n))return n;let t=We(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return la(t)?t:zl(e)}}function $l(e){return e===""?0:e.split(`
`).length}function ca(e){let n=Me(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new he(t,r)}function ha(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Me(l))throw new he("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw ca(l.error);let u=l;if(l.ok===!0&&(u=l.value),!Me(u))throw new he("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw ca(u.error);let d=u;if(u.ok===!0&&(d=u.page),!Me(d))throw new he("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(d.kind==="submodule")throw new he("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(d.binary===!0||d.kind==="binary")throw new he("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof d.text!="string")throw new he("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let c=typeof d.lines=="number"&&Number.isFinite(d.lines)?Math.max(0,Math.trunc(d.lines)):$l(d.text),p=typeof d.offset=="number"&&Number.isFinite(d.offset)&&d.offset>0?Math.trunc(d.offset):o.offset??1,g=d.source==="first-parent"?"first-parent":d.source==="commit"?"commit":void 0;return{text:d.text,lines:c,offset:p,eof:d.eof===!0,...g===void 0?{}:{source:g}}}}}function jl(e){if(!Me(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Me(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Kl(e){let n=Me(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Me(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new he(t,r,i)}function lo(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=jl(await n.call(e,t,r,{},o));if(!i.ok)throw Kl(i.error);return i.value.data}}function Yn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function ao(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Yt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Yn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?ao(r.value):{ok:!1,message:Yn(r.error)}}return ao(t)}return ao(n)}function xa(e){return e instanceof Error?e.message:Yn(e)}function ua(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function _l(e){let n=We(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Me(n)?n.rpc:void 0;if(!Me(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function ka(e){return()=>{let n=_l(e);if(n!==void 0)return n;let t=We(()=>e.remote?.gitExplorer);if(ua(t))return t;let r=We(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(ua(r))return r}}function fa(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Hl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=fa(r.additions),i=fa(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Gl(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Vl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function so(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Hl(n.stats),r=Gl(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=Vl(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function Zt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Yn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?so(o.snapshot):{ok:!1,message:Yn(o.error)}}let r=e;return r.snapshot!==void 0?so(r.snapshot):so(t)}var P=require("react/jsx-runtime"),po={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},ql=()=>()=>{},ba=()=>{};function mo(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var co={status:"idle"},Ul=[".md",".mdx",".markdown",".mdown"],Xl=-1e3;function fo({t:e,revision:n}){return(0,P.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,P.jsx)("strong",{children:e("preview.unavailable.title")}),(0,P.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function va({chunk:e,text:n,path:t,offset:r}){let o=(0,z.useRef)(null),i=(0,z.useRef)(null),a=ia(),l=(0,z.useRef)(n);l.current=n;let[u,d]=(0,z.useState)(!1),c=qn(t);return(0,z.useEffect)(()=>{d(!1)},[e,t]),(0,z.useEffect)(()=>{let p=o.current;if(!(e===null||p===null))try{let g=e.mountCodePreview(p,{text:n,language:c,path:t,offset:r});return i.current=g,()=>{g.destroy(),i.current=null}}catch{d(!0);return}},[e,t,c]),(0,z.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),(0,z.useEffect)(()=>{if(!(a===null||e===null||u))return a.register(ra({text:()=>l.current,select:(p,g)=>i.current?.revealRange(p,g),clear:()=>i.current?.clearSelection()})),()=>a.register(null)},[a,e,u]),e===null||u?(0,P.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,P.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Yl({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Un(n)?(0,P.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:jt(r)}):(0,P.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Zl(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,P.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,P.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,P.jsx)(va,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Ql(e){function n({page:t,path:r}){return(0,P.jsx)(va,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Jl({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,z.useMemo)(()=>{let u=lo(r);return u===void 0||t===void 0||a===void 0?u:async(d,c,p)=>{if(d!==t||c!==n)return u(d,c,p);let g=await a(c,p);return u(d,g?.absolutePath??c,p)}},[r,t,n,a]);return t===void 0||l===void 0?(0,P.jsx)(fo,{t:o}):(0,P.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function ec(e){return{Body:n=>(0,P.jsx)(Jl,{chunk:e,...n}),renderer:e.renderer}}function yo(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Ul]},priority:0,load:()=>Qr().then(Zl)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:Xl,load:()=>Qr().then(Ql)},...Object.keys(mt).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Qi(e).then(ec)}))]}var uo;function nc(){if(uo!==void 0)return uo;let e=Ut();for(let n of yo())e.register(n);return uo=e,e}function wa({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:u,locate:d}){let c=(0,z.useMemo)(()=>{let $=r===void 0?ma(n,e):o===void 0||e===void 0?void 0:ha(o,e,r);return $===void 0||r!==void 0||d===void 0?$:ya($,d)},[n,e,r,o,d]),p=(0,z.useMemo)(()=>r===void 0?lo(n):void 0,[n,r]),g=l??nc(),x=t===void 0?null:zn(t),f=x!==null,v=r===void 0&&e!==void 0&&p!==void 0?{sessionId:e,readFile:p}:null,[b,E]=(0,z.useState)(null),[A,J]=(0,z.useState)(Vn),[F,D]=(0,z.useState)(co),[W,U]=(0,z.useState)(0),[O,X]=(0,z.useState)(0),[le,S]=(0,z.useState)("reading"),[R,M]=(0,z.useState)(!1),[K,I]=(0,z.useState)(!1),[ee,Z]=(0,z.useState)(void 0),[k,N]=(0,z.useState)(!1),[T,ne]=(0,z.useState)(!1),me=(0,z.useRef)(null),ve=(0,z.useRef)(null),ye=(0,z.useRef)(void 0),te=(0,z.useRef)(void 0),Y=(0,z.useSyncExternalStore)(u?.subscribe??ql,()=>u===void 0||e===void 0||t===void 0?ba():u.peek(e,t),ba),xe=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,z.useEffect)(()=>{if(c===void 0){E(null);return}let $=Kt({files:c,maxLines:Xr});return E($),()=>$.close()},[c]),(0,z.useEffect)(()=>{if(b===null){J(Vn);return}return J(b.getSnapshot()),b.subscribe(()=>J(b.getSnapshot()))},[b]),(0,z.useEffect)(()=>{b===null||t===void 0||x!==null||b.open(t)},[b,t,x]),(0,z.useEffect)(()=>{if(!f||t===void 0||d===void 0){Z(void 0);return}let $=new AbortController,Ce=!0;return(async()=>{let se=await d(t,$.signal);Ce&&!$.signal.aborted&&Z(se?.absolutePath)})(),()=>{Ce=!1,$.abort()}},[f,t,d]),(0,z.useEffect)(()=>{S("reading"),M(!1),N(!1)},[t]),(0,z.useEffect)(()=>()=>{ye.current!==void 0&&clearTimeout(ye.current),te.current!==void 0&&clearTimeout(te.current)},[]),(0,z.useEffect)(()=>{Y?.conflict!==!0&&(I(!1),N(!1),te.current!==void 0&&clearTimeout(te.current))},[Y?.conflict]),(0,z.useEffect)(()=>g.subscribe(()=>U($=>$+1)),[g]),(0,z.useEffect)(()=>{if(t===void 0||r!==void 0){D(co);return}let $=da(g,{path:t});if($===void 0){D(co);return}let{contribution:Ce}=$,se=!0;return D(Le=>Le.status==="ready"&&Le.contribution.id===Ce.id?Le:{status:"loading",contribution:Ce}),$.module.then(Le=>{se&&D({status:"ready",contribution:Ce,module:Le})},Le=>{se&&D({status:"failed",contribution:Ce,failure:fn(Le)})}),()=>{se=!1}},[g,t,r,W,O]),t===void 0)return(0,P.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,P.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,P.jsx)("strong",{children:i("preview.empty.title")}),(0,P.jsx)("span",{children:i("preview.empty.description")})]})});let G=f&&r!==void 0,Q=_t(A),ge=A.linkPath??t,we=f?ee:A.linkTarget,Xe=!f&&Un(t),je=f?!G&&v!==null&&F.status!=="ready"&&F.status!=="failed":A.status==="loading",nn=A.status==="ready",Ke=Xe&&le==="reading",ot=f?G||v===null?"unavailable":F.status==="failed"?"failed":F.status==="ready"?"ready":"loading":A.status,In=F.status==="ready"?F.module.renderer??F.contribution.id:f?"pending":Ke?"fallback":"plain",Se=(0,z.useMemo)(()=>oa(()=>me.current),[]),tn=(0,z.useMemo)(()=>()=>ve.current??Se,[Se]),Re=(0,z.useMemo)(()=>({register:$=>{ve.current=$}}),[]),j=[ge,String(le),A.offset,A.text.length,In].join("|"),Fe=!f&&nn,Ln={path:we??t,sessionId:e,files:n,t:i,visible:a,mode:le,...f?{}:{page:{text:A.text,offset:A.offset}},...d===void 0?{}:{locate:d}},rn=()=>{pn(we??ge).then($=>{$&&(M(!0),ye.current!==void 0&&clearTimeout(ye.current),ye.current=setTimeout(()=>M(!1),1400))})},Bn=()=>{let $=xe?.copyDraft();$!==void 0&&pn($).then(Ce=>{Ce&&(I(!0),te.current!==void 0&&clearTimeout(te.current),te.current=setTimeout(()=>I(!1),1400))})},_e=Y?.error,lr=_e!=null&&Y?.conflict!==!0,ce=Y?.conflict===!0,Ye=Y?.discarded??null,xn=!ce&&Ye!==null&&Y?.dirty!==!0&&Ye!==Y?.text,Oe;if(f){let $=F.status==="ready"?F.module.Body:void 0;Oe=G?(0,P.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,P.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,P.jsx)("span",{children:i("preview.commitBinary.description")})]}):v===null?(0,P.jsx)(fo,{t:i,revision:r}):F.status==="failed"?(0,P.jsx)(ro,{failure:F.failure,t:i,onRetry:()=>X(Ce=>Ce+1)}):$===void 0?(0,P.jsx)(oo,{t:i}):(0,P.jsx)($,{...Ln})}else if(c===void 0)Oe=(0,P.jsx)(fo,{t:i,revision:r});else if(A.status==="failed")Oe=(0,P.jsx)(ro,{failure:A.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{b?.retry()}});else if(!nn)Oe=(0,P.jsx)(oo,{t:i});else{let $=F.status==="ready"?F.module.Body:Yl;Oe=(0,P.jsx)($,{...Ln})}return(0,P.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":ot,"data-mode":f?"binary":Ke?"reading":"code","data-renderer":In,children:[(0,P.jsxs)("header",{className:"fx-preview-bar",children:[(0,P.jsxs)("span",{className:"fx-preview-path",title:we===void 0?ge:`${ge} \u2192 ${we}`,"data-testid":"fs-preview-path",...we===void 0?{}:{"data-link":"followed"},children:[ge,we===void 0?null:(0,P.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",we]})]}),f?null:(0,P.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Q.range,Q.range==="\u2014"?null:(0,P.jsxs)(P.Fragment,{children:[" ",i("preview.lines")]}),Q.total===void 0?null:(0,P.jsxs)("span",{className:"fx-preview-total",children:[" / ",Q.total," ",i("preview.lines")]})]}),(0,P.jsxs)("div",{className:"fx-preview-actions",children:[Y===void 0?null:(0,P.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!Y.dirty||Y.saving||Y.status!=="ready",onClick:()=>{xe?.save()},children:Y.saving?i("preview.saving"):i("preview.save")}),Xe?(0,P.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>S($=>$==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(le==="reading"?"preview.source":"preview.reading")}):null,f?null:(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!nn||je||A.offset<=1,onClick:()=>{b?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,P.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!nn||je||A.eof,onClick:()=>{b?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),Fe?(0,P.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":T?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":T,onClick:()=>ne($=>!$),children:i("preview.find")}):null,(0,P.jsx)("button",{type:"button",className:"fx-pbtn",onClick:rn,"data-testid":"fs-preview-copy",children:i(R?"preview.copied":"preview.copyPath")}),je?(0,P.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),T&&Fe?(0,P.jsx)(aa,{t:i,surface:tn,stamp:j,onClose:()=>ne(!1)}):null,A.source==="first-parent"?(0,P.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,ce||xn?(0,P.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":ce?"conflict":"discarded",children:[(0,P.jsx)("strong",{children:i(ce?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,P.jsx)("span",{className:"fx-conflict-hint",children:i(ce?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,P.jsx)("span",{className:"fx-spacer"}),ce?(0,P.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":k?"discard":void 0,onClick:()=>{if(!k&&Y?.dirty===!0){N(!0);return}N(!1),xe?.reload({force:!0})},children:i(k?"preview.conflict.discard":"preview.conflict.reload")}):null,xn?(0,P.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Ye!==null&&xe?.setDraft(Ye)},children:i("preview.conflict.restore")}):null,ce?(0,P.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Bn,children:i(K?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,lr?(0,P.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",mo(_e?.code??"io-error",_e?.message??"",i))}):null,(0,P.jsx)("div",{className:"fx-preview-body","data-scroll":Ke?"y":"none",ref:me,children:(0,P.jsx)(to.Provider,{value:Re,children:Oe})})]})}var Sa="dsh-fs-explorer-styles",tc=`
.fx-root {
  /* The name card, the bookmark picker and the management menu are positioned
     against this panel. Without a containing block here they resolve against
     whatever positioned ancestor the host happens to provide, which is not
     something this package can rely on. */
  position: relative;
  --fx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --fx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  /* The host's own axes: body text for the interface, code size for monospace
     text. Both keep the design baseline as their fallback so a host that
     writes neither still gets the sizes this panel shipped with. */
  --fx-fs: var(--dsh-content-font-size, 14px);
  --fx-fs-code: var(--dsh-code-font-size, 11px);
  /* The one row height the virtual window and this sheet share; the floor
     keeps a row clickable below the design baseline, matching the TS helper. */
  --fx-row-h: max(22px, calc(var(--fx-fs) * 1.5714));
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
  --fx-tag-submodule: var(--dsw-alias-state-business-primary, currentColor);
  --fx-tag-package: var(--dsw-alias-state-warn-primary, currentColor);
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
  font-size: calc(var(--fx-fs) * 0.8571);
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.fx-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.7143);
  padding: 6px 12px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-head-icon { display: inline-flex; color: var(--fx-folder); flex: none; }
.fx-title { margin: 0; font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; white-space: nowrap; }
.fx-scope {
  display: inline-flex;
  align-items: center;
  height: calc(var(--fx-fs-code) * 1.6364);
  padding: 0 7px;
  border: 1px solid var(--fx-border);
  border-radius: 999px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  white-space: nowrap;
  flex: none;
}

/* The bookmark bar takes the header's elastic middle. It scrolls horizontally
   rather than wrapping, because a second row would change the header's height
   and push the whole panel down when a reader adds one bookmark too many. The
   scrollbar is hidden for the same reason: a 38px header has no room for one. */
.fx-bookmarks {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}
.fx-bookmarks::-webkit-scrollbar { display: none; }
.fx-bookmark {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: calc(var(--fx-fs) * 1.7143);
  max-width: 160px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8214);
  white-space: nowrap;
  cursor: pointer;
}
.fx-bookmark:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-bookmark:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-bookmark[aria-expanded="true"] { background: var(--fx-active); color: var(--fx-text); }
.fx-bookmark-name { overflow: hidden; text-overflow: ellipsis; }
.fx-bookmark-chevron { display: inline-flex; color: var(--fx-caption); flex: none; }
.fx-bookmark-empty { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); white-space: nowrap; }

/* Flyouts are fixed and placed from the chip's own rect: .fx-root sets
   overflow: hidden, so an absolutely positioned card would be clipped at the
   panel edge. The nested card hangs off its parent row instead. */
.fx-bookmark-flyout {
  position: fixed;
  z-index: 70;
  min-width: 180px;
  max-width: 280px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
/* A nested card is fixed and placed from its own row's rect, exactly like the
   first level: the inline px coordinates are the whole position, so there is no
   percentage offset to keep in sync. */
.fx-bookmark-flyout-sub { position: fixed; }
.fx-bookmark-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 5px 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.fx-bookmark-item:hover:not(:disabled) { background: var(--fx-hover); }
.fx-bookmark-item:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-bookmark-item:disabled { color: var(--fx-caption); cursor: default; }
.fx-bookmark-item[aria-disabled="true"] { color: var(--fx-caption); }
.fx-bookmark-new { border-top: 1px solid var(--fx-border-soft); border-radius: 0 0 5px 5px; color: var(--fx-text-2); }

/* A chip and its management button share one slot, so the button can sit beside
   the chip without becoming a second navigation target. */
.fx-bookmark-slot { position: relative; display: inline-flex; align-items: center; flex: none; }
.fx-bookmark-slot[data-dragging="true"] { opacity: 0.45; }
.fx-bookmark-item-wrap { position: relative; display: flex; align-items: center; }
.fx-bookmark-manage {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--fx-fs) * 1.2857);
  height: calc(var(--fx-fs) * 1.2857);
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
  line-height: 1;
  cursor: pointer;
  opacity: 0;
}
.fx-bookmark-slot:hover .fx-bookmark-manage,
.fx-bookmark-slot:focus-within .fx-bookmark-manage,
.fx-bookmark-item-wrap:hover .fx-bookmark-manage,
.fx-bookmark-item-wrap:focus-within .fx-bookmark-manage { opacity: 1; }
.fx-bookmark-manage:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-bookmark-manage:focus-visible { opacity: 1; outline: 2px solid var(--fx-accent); outline-offset: -1px; }

/* The management menu is fixed and placed from its button's rect, for the same
   reason the flyouts are: the header clips its overflow. */
.fx-bookmark-manage-menu {
  position: fixed; z-index: 75; min-width: 150px; padding: 4px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 1px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }

/* The destination picker: one card, one level at a time. */
.fx-bookmark-picker {
  position: absolute; z-index: 65; top: calc(var(--fx-fs) * 3.1429); left: 12px; width: 280px; max-height: 60vh; overflow-y: auto; padding: 10px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 8px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }
.fx-bookmark-picker-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.fx-bookmark-picker-head strong { font-size: calc(var(--fx-fs) * 0.8571); font-weight: 600; }
.fx-bookmark-picker-target { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-bookmark-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; }
.fx-bookmark-crumb {
  padding: 2px 6px; border: 0; border-radius: 4px; background: transparent; color: var(--fx-text-2); font: inherit; font-size: calc(var(--fx-fs) * 0.7857); cursor: pointer; }
.fx-bookmark-crumb:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-bookmark-crumb + .fx-bookmark-crumb::before { content: "/"; color: var(--fx-caption); margin-right: 4px; }
.fx-bookmark-picker-list {
  display: flex; flex-direction: column; gap: 1px; max-height: 30vh; overflow-y: auto; padding: 2px 0; border-top: 1px solid var(--fx-border-soft); border-bottom: 1px solid var(--fx-border-soft); }
.fx-bookmark-picker-actions { display: flex; justify-content: flex-end; gap: 6px; }
.fx-head-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.7857);
  font-variant-numeric: tabular-nums;
}
.fx-head-meta b { color: var(--fx-text-2); font-weight: 600; }

/* One transient sentence about what the last action did. It sits between the
   header and the panes rather than floating over them: a toast would cover the
   tree row the reader just acted on, which is exactly what they are looking at. */
.fx-notice {
  flex: none;
  padding: 4px 12px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: var(--fx-panel-2);
  color: var(--fx-text-2);
  font-size: calc(var(--fx-fs) * 0.7857);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fx-notice[data-tone="ok"] { color: var(--dsw-alias-state-success-primary, var(--fx-text-2)); }
.fx-notice[data-tone="error"] { color: var(--dsw-alias-state-error-primary, var(--fx-text-2)); }

/* The context menu's own card, used only when the host seeds no primitive kit.
   The host's Menu brings its own material; this exists so right-click still
   works on a host that has none, not as a second menu design. */
.fx-menu {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  padding: 4px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2));
  box-shadow: 0 8px 24px color-mix(in srgb, currentColor 16%, transparent);
  color: var(--fx-text);
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
.fx-menu-sub {
  position: absolute;
  left: 100%;
  top: -5px;
  margin-left: 2px;
}
.fx-menu-item-wrap { position: relative; }
.fx-menu-item {
  display: block;
  width: 100%;
  padding: 5px 10px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.fx-menu-item:hover:not(:disabled) { background: var(--fx-hover); }
.fx-menu-item:disabled { color: var(--fx-caption); cursor: default; }
.fx-menu-item[aria-disabled="true"] { color: var(--fx-caption); }
.fx-menu-item[aria-haspopup="menu"]::after { content: " \u203A"; float: right; color: var(--fx-caption); }
/* The reason a row cannot run, shown on the row itself: the host Menu's data rows
   have no disabledReason, and a greyed row with no explanation reads as broken. */
.fx-menu-reason { display: block; color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); line-height: 1.4; }

/* The name card. Anchored to the tree rather than centered on the page: the
   reader right-clicked a row, and a modal would take the tree away at exactly
   the moment they need to see which directory they are creating in. */
.fx-name-prompt {
  position: absolute;
  z-index: 55;
  top: calc(var(--fx-fs) * 3.1429);
  left: 12px;
  width: 268px;
  padding: 10px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
.fx-name-prompt-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.fx-name-prompt-head strong { font-size: calc(var(--fx-fs) * 0.8571); font-weight: 600; }
.fx-name-prompt-parent {
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.7857);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fx-name-input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border: 1px solid var(--fx-border);
  border-radius: 6px;
  background: var(--dsw-alias-bg-base, transparent);
  color: var(--fx-text);
  font: inherit;
}
.fx-name-input:focus { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-name-input[aria-invalid="true"] { border-color: var(--dsw-alias-state-error-primary, var(--fx-border)); }
.fx-name-prompt-error { color: var(--dsw-alias-state-error-primary, var(--fx-text-2)); font-size: calc(var(--fx-fs) * 0.7857); line-height: 1.4; }
.fx-name-prompt-actions { display: flex; justify-content: flex-end; gap: 6px; }
.fx-btn-text, .fx-btn-primary { width: auto; padding: 0 10px; height: calc(var(--fx-fs) * 1.7143); }
.fx-btn-primary {
  border-color: var(--fx-accent);
  background: var(--fx-accent);
  color: var(--dsw-alias-bg-base, #fff);
}
.fx-btn-primary:disabled, .fx-btn-text:disabled { opacity: 0.55; cursor: default; }
.fx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: calc(var(--fx-fs) * 1.7143);
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
/* The ignored-entries toggle in its "rows are hidden" state: the glyph already
   carries the strike-through, so the button only steps back to read as off. */
.fx-btn[data-on="false"] { opacity: .6; }
.fx-btn[data-on="false"]:hover:not(:disabled) { opacity: 1; }

.fx-main { display: flex; flex-direction: row; flex: 1; min-height: 0; }
.fx-tree-pane {
  display: flex;
  flex-direction: column;
  /* A user-dragged width arrives as the --fx-tree-width inline variable; the
     fallback keeps the shipped fluid clamp for everyone who never dragged. */
  flex: 0 0 var(--fx-tree-width, clamp(220px, 34%, 380px));
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--fx-border-soft);
}
/* The tree's search bar lives in the pane, above the scroller and outside it:
   the scroller owns the tree's key handler and its prefix jump, so an input
   nested there would lose every typed letter to the typeahead. */
.fx-search {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.1429);
  padding: 0 8px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
  outline: none;
}
.fx-search-input:focus-visible { border-color: var(--fx-accent); }
.fx-search-input::-webkit-search-cancel-button { display: none; }
.fx-search-scope {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: calc(var(--fx-fs-code) * 1.4545);
  padding: 0 5px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 10%, transparent);
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.8636);
  white-space: nowrap;
}
/* The fallback answers a strictly smaller question than the reader asked, so it
   is the one state that gets a warning tone rather than the neutral one. */
.fx-search-scope[data-origin="loaded"] { color: var(--fx-modified); }
.fx-search-count {
  flex: none;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-search-count[data-state="empty"] { color: var(--fx-modified); }
/* A result row's dimmed directory prefix; the name itself stays full strength. */
.fx-row-dir {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
  white-space: nowrap;
}
.fx-pane-handle {
  position: relative;
  z-index: 1;
  flex: 0 0 6px;
  /* Centre the hit zone on the tree pane's border so the grabbable band sits
     on the line the eye follows, half of it overlapping the pane. */
  margin-left: -3px;
  cursor: col-resize;
  touch-action: none;
}
.fx-pane-handle::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-.5px);
  background: var(--fx-accent);
  opacity: 0;
}
.fx-pane-handle:hover::before { opacity: .55; }
/* The handle is 6px wide, so the default focus ring collapses into noise;
   the keyboard focus reuses the hover line instead. */
.fx-pane-handle:focus-visible { outline: none; }
.fx-pane-handle:focus-visible::before { opacity: .55; }
/* Applied to the document body while a drag is live: no text selection under a
   moving pointer and a stable cursor wherever it travels. */
body.fx-pane-resizing { user-select: none; cursor: col-resize; }
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
  height: calc(var(--fx-fs) * 2.2857);
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
  font-size: calc(var(--fx-fs) * 0.7857);
  cursor: pointer;
}
.fx-tab-main:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }
.fx-tab-badge { width: 16px; height: 14px; }
.fx-tab-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-tab-rev {
  flex: none;
  padding: 0 3px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 4px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.8182);
  line-height: calc(var(--fx-fs-code) * 1.1818);
}
/* The unsaved dot sits where an editor puts it: after the caption, before the
   close button, so sweeping for the close target does not land on it. */
.fx-tab-dirty {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--fx-modified);
}
.fx-tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: calc(var(--fx-fs) * 1.2857);
  height: calc(var(--fx-fs) * 1.2857);
  margin-right: 4px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: var(--fx-fs);
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
  /* The keyboard cursor lives here, so the container itself must not grow a
     second ring on top of the row it already outlines. */
  outline: none;
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
/* An ignored entry stays listed but reads as background: dimmed enough to sort
   itself behind tracked files, lifted on hover and on the keyboard cursor so the
   row the reader is on is always legible. Opacity rather than a colour so the
   dimming works on every theme and keeps the row's own status colours. */
.fx-row[data-ignored="true"] { opacity: .55; }
.fx-row[data-ignored="true"]:hover,
.fx-row[data-ignored="true"][data-cursor="true"],
.fx-row[data-ignored="true"][data-selected="true"] { opacity: .8; }
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
  width: calc(var(--fx-fs-code) * 1.6364);
  height: calc(var(--fx-fs-code) * 1.3636);
  flex: none;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.7727);
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

.fx-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: calc(var(--fx-fs) * 0.8571); }
.fx-row[data-kind="directory"] .fx-name { font-weight: 500; }
.fx-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--fx-fs-code) * 1.2727);
  padding: 0 4px;
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.7727);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}
.fx-tag[data-tag="submodule"] { color: var(--fx-tag-submodule); }
.fx-tag[data-tag="package"] { color: var(--fx-tag-package); }
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
  width: calc(var(--fx-fs-code) * 1.3636);
  height: calc(var(--fx-fs-code) * 1.3636);
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 15%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.8182);
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
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
.fx-diff {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9091);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-diff-add { color: var(--fx-added); }
.fx-diff-del { color: var(--fx-deleted); }
.fx-diff-bin { color: var(--fx-caption); }
.fx-size {
  flex: none;
  min-width: 5ch;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs) * 0.75);
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
  font-size: calc(var(--fx-fs) * 0.75);
  cursor: pointer;
}
.fx-linkbtn:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-linkbtn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }

.fx-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: calc(var(--fx-fs) * 1.7143);
  padding: 0 12px;
  border-top: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
  font-variant-numeric: tabular-nums;
}
.fx-foot b { color: var(--fx-text-2); font-weight: 600; }
.fx-foot .fx-spacer { flex: 1; }
.fx-foot-warn { color: var(--dsw-alias-state-warn-primary, currentColor); }
.fx-foot-git { display: inline-flex; align-items: center; gap: 5px; }
.fx-foot-git[data-state="none"] { color: var(--fx-caption); }
.fx-foot-dot { width: 6px; height: 6px; flex: none; border-radius: 50%; background: currentColor; }
.fx-foot-branch {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--fx-mono);
  white-space: nowrap;
}
.fx-foot-ahead { color: var(--fx-added); }
.fx-foot-behind { color: var(--fx-deleted); }

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
.fx-empty strong { color: var(--fx-text); font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; }
.fx-empty span { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); max-width: 46ch; }
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
.fx-editor-empty strong { color: var(--fx-text); font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; }
.fx-editor-empty > span { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); max-width: 48ch; }
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
  font-size: calc(var(--fx-fs-code) * 0.8636);
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
  font-size: calc(var(--fx-fs) * 0.7857);
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
  height: calc(var(--fx-fs) * 2.4286);
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
  font-size: var(--fx-fs-code);
  color: var(--fx-text-2);
}
.fx-preview-link {
  color: var(--fx-caption);
}
.fx-preview-range {
  flex: none;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  color: var(--fx-caption);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-preview-total { opacity: .7; }
.fx-preview-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.fx-pbtn {
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.75);
  white-space: nowrap;
  cursor: pointer;
}
.fx-pbtn:hover:not(:disabled) { background: var(--fx-hover); color: var(--fx-text); border-color: var(--fx-border); }
.fx-pbtn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }
.fx-pbtn:disabled { opacity: .35; cursor: default; }
.fx-pbtn[data-open="true"] { background: var(--fx-active); color: var(--fx-text); border-color: var(--fx-border); }
.fx-preview-notice {
  flex: none;
  padding: 6px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
}
.fx-conflict {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.1429);
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: color-mix(in oklab, var(--fx-modified) 14%, transparent);
  color: var(--fx-text);
  font-size: calc(var(--fx-fs) * 0.7857);
}
.fx-conflict strong { font-weight: 600; }
.fx-conflict-hint { color: var(--fx-text-2); }
.fx-save-error {
  flex: none;
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  color: var(--fx-deleted);
  font-size: calc(var(--fx-fs) * 0.75);
}
.fx-close-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.4286);
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: var(--fx-panel-2);
  color: var(--fx-text);
  font-size: calc(var(--fx-fs) * 0.7857);
}
.fx-close-confirm-text,
.fx-close-confirm-error {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fx-close-confirm-error { color: var(--fx-deleted); }
.fx-conflict .fx-spacer,
.fx-close-confirm .fx-spacer { flex: 1; }
.fx-preview-body { flex: 1; min-height: 0; position: relative; }
.fx-preview-body[data-scroll="y"] {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.fx-preview-body[data-scroll="none"] { overflow: hidden; }
/* The find bar sits between the toolbar and the body, so it never covers the
   words it points at; it is not inside the scroller for the same reason. */
.fx-find {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  height: calc(var(--fx-fs) * 2.1429);
  padding: 0 10px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-find-input {
  flex: 1 1 auto;
  min-width: 0;
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
  outline: none;
}
.fx-find-input:focus-visible { border-color: var(--fx-accent); }
.fx-find-input::-webkit-search-cancel-button { display: none; }
.fx-find-count {
  flex: none;
  min-width: 7ch;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.fx-find-count[data-state="empty"] { color: var(--fx-modified); }
.fx-preview-read { height: 100%; }
.fx-preview-hint {
  max-width: 60ch;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs-code) * 1.0909);
  line-height: 1.55;
  white-space: pre;
  tab-size: 4;
}

.fx-md {
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px 24px 64px;
  font-size: calc(var(--fx-fs) * 0.9286);
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
  height: calc(var(--fx-fs-code) * 1.8182);
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
}
.fx-md input[type="checkbox"] { margin-right: .45em; vertical-align: middle; }

@media (max-width: 760px) {
  .fx-main { flex-direction: column; }
  .fx-tree-pane {
    flex: 0 0 45%;
    border-right: 0;
    border-bottom: 1px solid var(--fx-border-soft);
  }
  /* Stacked panes have no horizontal split to resize, so the handle and any
     persisted width (the media rule above wins the cascade over the variable)
     both go inert. */
  .fx-pane-handle { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .fx-chevron { transition: none; }
  .fx-spinner { animation-duration: 1.6s; }
}
`;function Ra(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Sa}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Sa,t.textContent=tc,e.head.appendChild(t),()=>{t.remove()}}var y=require("react");var de={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"},mn={close:"tab.close",closeOthers:"tab.close.others",closeRight:"tab.close.right"};function Ca(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function rc(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function Ta(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,u=[{id:de.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:de.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let d=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,c={id:de.reveal,label:n(rc(o?.fileManager??null)),...d?{}:{disabled:!0,reason:n("menu.reveal.reason")}},p={id:de.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},g={id:de.copyRelative,label:n("menu.copy.relative")},x=e.remoteLinks,f=x!==void 0&&x.length>0?{id:de.copyRemote,label:n("menu.copy.remote"),submenu:x.map(v=>({id:v.id,label:v.label}))}:{id:de.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,c,{id:"menu.copy",label:n("menu.copy"),submenu:[p,g]},f,{id:de.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}function Pa(e,n){let t=e.panels.findIndex(r=>r.key===e.key);return t<0?[]:[{id:mn.close,label:n("menu.tab.close")},{id:mn.closeOthers,label:n("menu.tab.closeOthers"),...e.panels.length>1?{}:{disabled:!0,reason:n("menu.tab.closeOthers.reason")}},...t===e.panels.length-1?[]:[{id:mn.closeRight,label:n("menu.tab.closeRight")}]]}var ze=require("react");var Ee=require("react/jsx-runtime");function oc(e){return new DOMRect(e.x,e.y,0,0)}function Ea(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Ee.jsxs)(Ee.Fragment,{children:[e.label,(0,Ee.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function go({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=Gt();if(i.Menu!==void 0){let a=i.Menu;return(0,Ee.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:Ea(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:Ea(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>oc(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Ee.jsx)(ic,{entries:e,anchor:n,onSelect:t,onClose:r})}function ic({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,ze.useRef)(null),[i,a]=(0,ze.useState)(null),[l,u]=(0,ze.useState)({left:n.x,top:n.y});(0,ze.useEffect)(()=>{let c=o.current;if(c===null)return;let p=8,g=c.offsetWidth,x=c.offsetHeight,f=Math.min(Math.max(n.x,p),Math.max(p,window.innerWidth-g-p)),v=Math.min(Math.max(n.y,p),Math.max(p,window.innerHeight-x-p));u({left:f,top:v})},[n.x,n.y]),(0,ze.useEffect)(()=>{let c=g=>{g.target instanceof Node&&o.current?.contains(g.target)!==!0&&r()},p=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),r())};return document.addEventListener("pointerdown",c),document.addEventListener("keydown",p,!0),()=>{document.removeEventListener("pointerdown",c),document.removeEventListener("keydown",p,!0)}},[r]);let d=(0,ze.useCallback)(c=>{if(c.disabled!==!0){if(c.submenu!==void 0){a(p=>p===c.id?null:c.id);return}t(c.id)}},[t]);return(0,Ee.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:c=>c.preventDefault(),children:e.map(c=>(0,Ee.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Ee.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":c.id,disabled:c.disabled===!0&&c.reason===void 0,"aria-disabled":c.disabled===!0?!0:void 0,"aria-haspopup":c.submenu===void 0?void 0:"menu","aria-expanded":c.submenu===void 0?void 0:i===c.id,title:c.disabled===!0?c.reason:void 0,onClick:()=>d(c),children:c.label}),c.submenu===void 0||i!==c.id?null:(0,Ee.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:c.submenu.map(p=>(0,Ee.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":p.id,disabled:p.disabled===!0&&p.reason===void 0,"aria-disabled":p.disabled===!0?!0:void 0,title:p.disabled===!0?p.reason:void 0,onClick:()=>d(p),children:p.label},p.id))})]},c.id))})}var pe=require("react"),_=require("react/jsx-runtime"),ac=120,ho=280,Qt=8;function Jt(e){let n=typeof window>"u"?e:window.innerWidth-ho;return Math.max(Qt,Math.min(e,Math.max(Qt,n)))}function sc(e,n){if(e===void 0)return{left:Qt,top:Qt};if(n<=1)return{left:Jt(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+ho<=window.innerWidth;return{left:Jt(r?t:e.left-ho-4),top:e.top}}function Fa(){return(0,_.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,_.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Ma({node:e,t:n,onOpen:t}){return(0,_.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,_.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function Na({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:u}){let[d,c]=(0,pe.useState)([]),p=(0,pe.useRef)(null),[g,x]=(0,pe.useState)(null),[f,v]=(0,pe.useState)(null),b=(0,pe.useCallback)(()=>{p.current!==null&&(clearTimeout(p.current),p.current=null)},[]),E=(0,pe.useCallback)(()=>{b(),c([])},[b]),A=(0,pe.useCallback)(()=>{b(),p.current=setTimeout(()=>{p.current=null,c([])},ac)},[b]);(0,pe.useEffect)(()=>()=>{p.current!==null&&clearTimeout(p.current)},[]),(0,pe.useEffect)(()=>{if(d.length===0||typeof document>"u")return;let S=R=>{R.key!=="Escape"||R.isComposing||(R.preventDefault(),R.stopPropagation(),E())};return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[E,d.length]);let J=(0,pe.useCallback)((S,R,M)=>{b();let{left:K,top:I}=sc(M?.getBoundingClientRect(),R);c(ee=>{let Z=ee.slice(0,R);return Z.length===R&&Z[R-1]?.groupId===S?ee:[...Z,{groupId:S,left:K,top:I,depth:R}]})},[b]),F=(0,pe.useCallback)(S=>{E(),S.kind==="file"?t(S.path):S.kind==="folder"&&r(S.path)},[E,t,r]),D=S=>{let R,M=K=>{for(let I of K)I.kind==="group"&&(I.id===S&&(R=I),M(I.children))};return M(e.roots),R},W=S=>{let R=(M,K)=>{if(M.some(I=>I.id===S))return{parentId:K,siblings:M};for(let I of M){if(I.kind!=="group")continue;let ee=R(I.children,I.id);if(ee!==void 0)return ee}};return R(e.roots,null)??{parentId:null,siblings:[]}},U=(S,R)=>{let M=R?.getBoundingClientRect(),{parentId:K,siblings:I}=W(S.id);x({node:S,parentId:K,siblings:I,left:Jt(M?.left??0),top:(M?.bottom??0)+4})},O=(S,R)=>{let{parentId:M,siblings:K}=W(S.id);x({node:S,parentId:M,siblings:K,left:Jt(R.clientX),top:R.clientY})},X=(S,R)=>{let{parentId:M,siblings:K}=W(S.id),I=K.map(T=>T.id),ee=I.indexOf(S.id),Z=ee+R;if(ee<0||Z<0||Z>=I.length)return;let k=[...I],[N]=k.splice(ee,1);N!==void 0&&(k.splice(Z,0,N),x(null),u?.(M,k))},le=S=>{let R=f;if(v(null),R===null||R===S)return;let M=e.roots.map(k=>k.id),K=M.indexOf(R),I=M.indexOf(S);if(K<0||I<0)return;let ee=[...M],[Z]=ee.splice(K,1);Z!==void 0&&(ee.splice(I,0,Z),u?.(null,ee))};return(0,pe.useEffect)(()=>{if(g===null||typeof document>"u")return;let S=M=>{M.target instanceof Node&&(M.target instanceof Element&&M.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||x(null))},R=M=>{M.key!=="Escape"||M.isComposing||(M.preventDefault(),M.stopPropagation(),x(null))};return document.addEventListener("pointerdown",S),document.addEventListener("keydown",R,!0),()=>{document.removeEventListener("pointerdown",S),document.removeEventListener("keydown",R,!0)}},[g]),(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,_.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(S=>(0,_.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":f===S.id?"true":void 0,draggable:!0,onDragStart:()=>v(S.id),onDragEnd:()=>v(null),onDragOver:R=>R.preventDefault(),onDrop:R=>{R.preventDefault(),le(S.id)},children:[S.kind==="group"?(0,_.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":d.some(R=>R.groupId===S.id),title:n("bookmarks.group"),onPointerEnter:R=>J(S.id,1,R.currentTarget),onFocus:R=>J(S.id,1,R.currentTarget),onPointerLeave:A,onContextMenu:R=>{R.preventDefault(),R.stopPropagation(),O(S,R)},children:[(0,_.jsx)("span",{className:"fx-bookmark-name",children:S.name}),(0,_.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,_.jsx)(Fa,{})})]}):(0,_.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":S.kind,title:S.path,onClick:()=>F(S),onContextMenu:R=>{R.preventDefault(),R.stopPropagation(),O(S,R)},children:(0,_.jsx)("span",{className:"fx-bookmark-name",children:S.name})}),(0,_.jsx)(Ma,{node:S,t:n,onOpen:U})]},S.id))}),g===null?null:(0,_.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:g.left,top:g.top},children:[(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{x(null),i?.(g.node)},children:n("bookmarks.rename")}),(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{x(null),a?.(g.node)},children:n("bookmarks.remove")}),(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:g.siblings[0]?.id===g.node.id,onClick:()=>X(g.node,-1),children:n("bookmarks.moveUp")}),(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:g.siblings[g.siblings.length-1]?.id===g.node.id,onClick:()=>X(g.node,1),children:n("bookmarks.moveDown")}),(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{x(null),l?.(g.node)},children:n("bookmarks.moveToGroup")})]}),d.map(S=>{let R=D(S.groupId);return R===void 0?null:(0,_.jsxs)("div",{className:S.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":S.depth,role:"menu","aria-label":R.name,style:{left:S.left,top:S.top},onPointerEnter:b,onPointerLeave:A,children:[R.children.length===0?null:R.children.map(M=>(0,_.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[M.kind==="group"?(0,_.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":d.some(K=>K.groupId===M.id),onPointerEnter:K=>J(M.id,S.depth+1,K.currentTarget),onFocus:K=>J(M.id,S.depth+1,K.currentTarget),onContextMenu:K=>{K.preventDefault(),K.stopPropagation(),O(M,K)},children:[(0,_.jsx)("span",{className:"fx-bookmark-name",children:M.name}),(0,_.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,_.jsx)(Fa,{})})]}):(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":M.kind,role:"menuitem",title:M.path,onClick:()=>F(M),onContextMenu:K=>{K.preventDefault(),K.stopPropagation(),O(M,K)},children:(0,_.jsx)("span",{className:"fx-bookmark-name",children:M.name})}),(0,_.jsx)(Ma,{node:M,t:n,onOpen:U})]},M.id)),(0,_.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(E(),o(R.id))},children:n("bookmarks.newGroup")})]},R.id)})]})}var Ae=require("react");var dc="dsh_fs_explorer",lc="bookmarks";function Ne(e){throw new Error(`bookmarks: ${e}`)}function Ia(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function er(e,n,t){typeof e!="string"&&Ne(`${n} must be a string`);let r=e.trim();return r===""&&Ne(`${n} must not be empty`),r.length>t&&Ne(`${n} must be at most ${String(t)} characters`),r}function La(e,n,t,r){t>32&&Ne(`${n} is nested deeper than ${String(32)} levels`),Ia(e)||Ne(`${n} must be an object`);let o=er(e.id,`${n}.id`,200);r.has(o)&&Ne(`duplicate id "${o}" at ${n}`),r.add(o);let i=er(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Ne(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let u=e.children;return Array.isArray(u)||Ne(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((d,c)=>La(d,`${n}.children[${String(c)}]`,t+1,r))}}if(l==="file"||l==="folder"){let u=er(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:u}}return Ne(`${n}.kind must be "group", "file" or "folder"`)}function Mn(e){Ia(e)||Ne("a bookmark tree must be an object"),e.version!==1&&Ne(`version must be 1, received ${JSON.stringify(e.version)}`);let n=er(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Ne("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>La(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var xf={name:dc,version:1,invalidRecords:"backup-and-skip",tables:{[lc]:{valueSchema:{parse:Mn}}}};function ae(e){throw new Error(`bookmarks: ${e}`)}function yn(e){return{version:1,roots:[],updatedAt:e}}function Zn(e,n){let t=n.name.trim();if(t===""&&ae("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&ae(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function cc(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function Aa(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,Aa(r,n+1)),n)}function Da(e,n){let t=cc(e,n.id);t!==0&&Aa(n,t)>32&&ae(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function xo(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&xo(r.children,n,r.id)}function Ue(e,n){let t;return xo(e.roots,r=>{r.id===n&&(t=r)}),t}function Oa(e,n){let t;return xo(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function Wa(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&Wa(t,n))}function ko(e,n){if(n===null)return e.roots;let t=Ue(e,n);return t===void 0&&ae(`no group with id "${n}"`),t.kind!=="group"&&ae(`"${n}" is not a group`),t.children}function za(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function Nn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:Nn(r.children,n,t)})}function Qn(e,n,t){return{version:1,roots:n,updatedAt:t}}var Jn=()=>new Date().toISOString();function et(e,n,t,r,o=Jn){let i=ko(e,n);Ue(e,t.id)!==void 0&&ae(`a node with id "${t.id}" already exists`);let a=za(r,i.length),l=Nn(e.roots,n,d=>[...d.slice(0,a),t,...d.slice(a)]),u=Qn(e,l,o());return Da(u,t),u}function $a(e,n,t=Jn){let r=Ue(e,n);r===void 0&&ae(`no node with id "${n}"`);let o=Oa(e,n);o===void 0&&ae(`no node with id "${n}"`);let i=Nn(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:Qn(e,i,t()),removed:r}}function ja(e,n,t,r=Jn){let o=t.trim();o===""&&ae("a node needs a non-empty name"),Ue(e,n)===void 0&&ae(`no node with id "${n}"`);let i=a=>a.map(l=>{let u=l.id===n?{...l,name:o}:l;return u.kind==="group"?{...u,children:i(u.children)}:u});return Qn(e,i(e.roots),r())}function Ka(e,n,t,r,o=Jn){let i=Ue(e,n);i===void 0&&ae(`no node with id "${n}"`);let a=Oa(e,n);if(a===void 0&&ae(`no node with id "${n}"`),t!==null){let g=Ue(e,t);g===void 0&&ae(`no group with id "${t}"`),g.kind!=="group"&&ae(`"${t}" is not a group`),i.kind==="group"&&Wa(i,t)&&ae(`cannot move "${n}" into itself or its own descendant`)}let l=Nn(e.roots,a,g=>g.filter(x=>x.id!==n)),u=ko({version:1,roots:l,updatedAt:e.updatedAt},t),d=za(r,u.length),c=Nn(l,t,g=>[...g.slice(0,d),i,...g.slice(d)]),p=Qn(e,c,o());return Da(p,i),p}function _a(e,n,t,r=Jn){let o=ko(e,n),i=new Set(o.map(d=>d.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&ae(`the new order must name each of the ${String(o.length)} children exactly once`);for(let d of t)i.has(d)||ae(`"${d}" is not a child of ${n??"the root"}`);let l=new Map(o.map(d=>[d.id,d])),u=Nn(e.roots,n,()=>t.map(d=>{let c=l.get(d);return c===void 0&&ae(`"${d}" is not a child of ${n??"the root"}`),c}));return Qn(e,u,r())}var $e=require("react");var Ie=require("react/jsx-runtime"),uc=200;function fc(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>uc?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function pc(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function nt({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:u,submitKey:d}){let[c,p]=(0,$e.useState)(()=>l??pc(e)),[g,x]=(0,$e.useState)(void 0),f=(0,$e.useRef)(null),v=Gt();(0,$e.useEffect)(()=>{l!==void 0&&(p(l),x(void 0))},[l]),(0,$e.useEffect)(()=>{let D=f.current;D!==null&&(D.focus(),D.select())},[]);let b=(0,$e.useCallback)(()=>{if(a)return;let D=fc(c,e);if(!D.ok){x(t(`prompt.error.${D.reason}`));return}x(void 0),r(D.name)},[a,e,r,t,c]),E=D=>{if(!D.nativeEvent.isComposing){if(D.key==="Escape"){D.preventDefault(),D.stopPropagation(),o();return}D.key==="Enter"&&(D.preventDefault(),b())}},A=g??i,J=v.Input,F=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Ie.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(F),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:E,children:[(0,Ie.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Ie.jsx)("strong",{children:t(F)}),(0,Ie.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),J===void 0?(0,Ie.jsx)("input",{ref:f,className:"fx-name-input",type:"text",value:c,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":A===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:D=>{p(D.target.value),x(void 0)}}):(0,Ie.jsx)(J,{ref:f,className:"fx-name-input",value:c,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":A===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:D=>{p(D.target.value),x(void 0)}}),A===void 0?null:(0,Ie.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:A}),(0,Ie.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Ie.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Ie.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:b,children:t(d??"prompt.submit")})]})]})}var re=require("react/jsx-runtime");function Ha(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function mc(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function Ga({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,u]=(0,Ae.useState)(null),[d,c]=(0,Ae.useState)(e),[p,g]=(0,Ae.useState)(!1),[x,f]=(0,Ae.useState)(void 0),v=(0,Ae.useRef)(null);(0,Ae.useEffect)(()=>{let W=O=>{O.target instanceof Node&&v.current?.contains(O.target)!==!0&&a()},U=O=>{O.key!=="Escape"||O.isComposing||p||(O.preventDefault(),O.stopPropagation(),a())};return document.addEventListener("pointerdown",W),document.addEventListener("keydown",U,!0),()=>{document.removeEventListener("pointerdown",W),document.removeEventListener("keydown",U,!0)}},[p,a]);let b=()=>(l===null?d.roots:Ue(d,l)?.kind==="group"?Ue(d,l).children:[]).filter(U=>U.kind==="group"),E=(0,Ae.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(Ka(d,o.id,l));return}if(n===void 0)return;let W=Zn(n.kind==="directory"?"folder":"file",{id:Ha(),name:n.name,path:n.path,createdAt:Date.now()});i(et(d,l,W))}catch(W){f(W instanceof Error?W.message:String(W))}},[l,d,r,o,i,n]),A=W=>{try{let U=Zn("group",{id:Ha(),name:W,createdAt:Date.now()}),O=et(d,l,U);c(O),g(!1),f(void 0),u(U.id)}catch(U){f(U instanceof Error?U.message:String(U))}},J=mc(d,l),F=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),D=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,re.jsxs)("div",{ref:v,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":F,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,re.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,re.jsx)("strong",{children:F}),r==="add"&&n!==void 0?(0,re.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,re.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,re.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,re.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),J.map(W=>(0,re.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(W.id),children:W.name},W.id))]}),(0,re.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:b().length===0?(0,re.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):b().map(W=>(0,re.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(W.id),children:(0,re.jsx)("span",{className:"fx-bookmark-name",children:W.name})},W.id))}),x===void 0?null:(0,re.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:x}),p?(0,re.jsx)(nt,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:A,onCancel:()=>g(!1)}):(0,re.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,re.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>g(!0),children:t("bookmarks.newGroup")}),(0,re.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:E,children:D})]})]})}function bo(e){return`dsh-fs-explorer.bookmarks.${e}`}function vo(e){return`${bo(e)}.pending`}function nr(){try{return globalThis.localStorage??void 0}catch{return}}function Va(e){let n=nr();if(n===void 0)return;let t;try{t=n.getItem(bo(e))}catch{return}if(t!==null)try{return Mn(JSON.parse(t))}catch{return}}function yc(e,n){let t=nr();if(t!==void 0)try{t.setItem(bo(e),JSON.stringify(n)),t.setItem(vo(e),"1")}catch{}}function gc(e){let n=nr();if(n===void 0)return!1;try{return n.getItem(vo(e))==="1"}catch{return!1}}function qa(e){let n=nr();if(n!==void 0)try{n.removeItem(vo(e))}catch{}}function Ua(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(qa(n),r.tree):gc(n)?Va(n)??yn(new Date().toISOString()):yn(new Date().toISOString())}catch{}return Va(n)??yn(new Date().toISOString())},async save(n,t){let r=Mn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){qa(n);return}}catch{}yc(n,r)}}}var wo="fs-explorer.treePaneWidth";function So(e){return Math.min(520,Math.max(180,e))}function Ya(e){if(e==null)return null;let n;try{n=e.getItem(wo)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function tr(e,n){let t=Math.round(So(n));if(e!=null)try{e.setItem(wo,String(t))}catch{}return t}function Za(e){if(e!=null)try{e.removeItem(wo)}catch{}}function Qa(e,n){return Math.round(e)===Math.round(n)}var Xa=16;function Ja(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Xa};case"ArrowRight":return{kind:"nudge",delta:Xa};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var q=require("react");function ns(e,n,t,r=800){return t-n<=r?e:""}function ts(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function rs(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:hc(e,t+1,r.depth,r.depth+1)}function hc(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var xc=/^.$/u;function os(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!xc.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=es(e.names,n),l=a.find(u=>u>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=es(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function es(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var L=require("react/jsx-runtime"),kc=22;function Ro({open:e=!0,size:n=14}){return(0,L.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,L.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,L.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function bc(){return(0,L.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,L.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function is(){return(0,L.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,L.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,L.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function as(){return(0,L.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,L.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,L.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function ss(){return(0,L.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,L.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function vc({name:e}){return(0,L.jsx)("span",{className:"fx-badge","data-icon":Rn(e),"aria-hidden":"true",children:Cn(e)})}function wc({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:u}){let d=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,L.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:c,onClick:()=>{l(e.path),d?i(e.path):a(e.path)},onContextMenu:p=>{p.preventDefault(),p.stopPropagation(),u(e,p)},children:[(0,L.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,L.jsx)(bc,{})}),d?(0,L.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,L.jsx)(Ro,{open:e.expanded})}):(0,L.jsx)(vc,{name:e.name}),(0,L.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,L.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,L.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,L.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":jn(e.status),"data-testid":"fx-file-status",title:o(wr(e.status)),"aria-label":o(wr(e.status)),children:xt(e.status)}),e.statusCount===void 0?null:(0,L.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,L.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,L.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,L.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,L.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,L.jsx)("span",{className:"fx-size",children:Et(e.size)})]})}function Sc({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,L.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,L.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,L.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,L.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,L.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Rc(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function ds({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:u,cursorRequest:d,onCursorMove:c}){let p=(0,q.useRef)(null),[g,x]=(0,q.useState)(0),[f,v]=(0,q.useState)(0),b=Ri(kc),[E,A]=(0,q.useState)(void 0),J=(0,q.useRef)(void 0),F=(0,q.useRef)({query:"",at:0}),D=(0,q.useRef)(void 0),W=(0,q.useRef)(void 0),U=(0,q.useRef)(E);U.current=E;let O=(0,q.useMemo)(()=>e.flatMap((k,N)=>k.type==="entry"?[N]:[]),[e]);(0,q.useEffect)(()=>{let k=W.current!==n;if(W.current=n,D.current!==void 0||n===void 0)return;let N=U.current===void 0?void 0:e[U.current];if(!ci({cursorPath:N?.type==="entry"?N.path:void 0,selectionMoved:k}))return;let T=e.findIndex(ne=>ne.type==="entry"&&ne.path===n);T>=0&&A(T)},[n,e]),(0,q.useEffect)(()=>{let k=D.current;if(k===void 0)return;let N=e.findIndex(me=>me.type==="entry"&&me.path===k),T=e[N];if(T?.type!=="entry"||T.kind!=="directory"||!T.expanded){D.current=void 0;return}let ne=ui(e,k);ne!==void 0&&(D.current=void 0,A(ne))},[e]),(0,q.useEffect)(()=>{E!==void 0&&e[E]?.type!=="entry"&&A(void 0)},[e,E]),(0,q.useEffect)(()=>{let k=p.current;if(E===void 0||k===null)return;let N=Rr({scrollTop:k.scrollTop,viewport:k.clientHeight,rowHeight:b,index:E});N!==k.scrollTop&&(k.scrollTop=N)},[E,b]);let X=(0,q.useCallback)((k,N=!0)=>{A(k),N&&p.current?.focus({preventScroll:!0})},[]),le=(0,q.useRef)(void 0);(0,q.useEffect)(()=>{if(d===void 0||le.current===d.nonce)return;let k=O.at(-1);if(d.path!==void 0){let T=e.findIndex(ne=>ne.type==="entry"&&ne.path===d.path);le.current=d.nonce,T>=0&&X(T,d.focus);return}if(d.delta===void 0){le.current=d.nonce;return}if(le.current=d.nonce,E===void 0){let T=d.delta>0?O[0]:k;T!==void 0&&X(T,d.focus);return}let N=d.delta>0?O.find(T=>T>E):[...O].reverse().find(T=>T<E);N!==void 0&&X(N,d.focus)},[d,E,O,X,e]),(0,q.useEffect)(()=>{if(c===void 0)return;let k=E===void 0?void 0:e[E];c(k?.type==="entry"?k.path:void 0)},[E,e,c]);let S=(0,q.useCallback)(k=>{let N=e.findIndex(T=>T.type==="entry"&&T.path===k);N>=0&&A(N)},[e]),R=(0,q.useCallback)((k,N,T)=>{S(k.path),u(k,N,T)},[S,u]),M=(0,q.useCallback)(k=>{k.preventDefault(),u(void 0,{x:k.clientX,y:k.clientY},k.currentTarget)},[u]),K=(0,q.useCallback)(k=>{if(k.nativeEvent.isComposing||k.altKey||k.metaKey||k.ctrlKey)return;let N=O.at(-1);if(k.key==="ArrowDown"){if(k.preventDefault(),E===void 0){O[0]!==void 0&&X(O[0]);return}let G=O.find(Q=>Q>E);G!==void 0&&X(G);return}if(k.key==="ArrowUp"){if(k.preventDefault(),E===void 0){N!==void 0&&X(N);return}let G=[...O].reverse().find(Q=>Q<E);G!==void 0&&X(G);return}if(E===void 0)return;let T=e[E];if(T===void 0||T.type!=="entry")return;if(k.key==="ArrowRight"){if(k.preventDefault(),T.kind==="directory"&&!T.expanded)D.current=T.path,o(T.path);else{let G=O.find(Q=>Q>E);G!==void 0&&e[G]?.depth===T.depth+1&&X(G)}return}if(k.key==="ArrowLeft"){if(k.preventDefault(),T.kind==="directory"&&T.expanded)o(T.path);else{let G=[...O].reverse().find(Q=>Q<E&&e[Q]?.type==="entry"&&e[Q].depth<T.depth);G!==void 0&&X(G)}return}if(k.key==="Enter"&&T.kind!=="directory"){k.preventDefault(),i(T.path);return}if(k.key==="ContextMenu"||k.key==="F10"&&k.shiftKey){k.preventDefault();let G=p.current?.getBoundingClientRect(),Q=G===void 0?0:G.top+E*b-(p.current?.scrollTop??0);R(T,{x:G?.left??0,y:Q+b},p.current??void 0);return}if(k.key==="Home"){k.preventDefault(),O[0]!==void 0&&X(O[0]);return}if(k.key==="End"){k.preventDefault(),N!==void 0&&X(N);return}let ne=Date.now(),me=ts(e,E),ve=rs(e,me),ye=ve.map(G=>{let Q=e[G];return Q?.type==="entry"?Q.name:""}),te=os({query:ns(F.current.query,F.current.at,ne),key:k.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:k.nativeEvent.repeat,names:ye,active:E===void 0?-1:ve.indexOf(E)});if(te.kind==="clear"){F.current={query:"",at:0};return}if(te.kind!=="jump")return;let Y=ve[te.index];if(Y===void 0)return;let xe=e[Y];xe?.type==="entry"&&(F.current={query:te.query,at:ne},k.preventDefault(),X(Y),xe.kind!=="directory"&&i(xe.path))},[E,O,X,o,i,R,b,e]);(0,q.useEffect)(()=>{let k=p.current;if(k===null)return;let N=()=>v(k.clientHeight);if(N(),typeof ResizeObserver>"u")return;let T=new ResizeObserver(N);return T.observe(k),()=>T.disconnect()},[]),(0,q.useEffect)(()=>{if(n===void 0)return;let k=p.current;if(k===null)return;let N=e.findIndex(ne=>ne.type==="entry"&&ne.path===n);if(N<0)return;let T=N*b;(T<k.scrollTop||T+b>k.scrollTop+k.clientHeight)&&(k.scrollTop=Math.max(0,T-k.clientHeight/2))},[n,e,b]),(0,q.useEffect)(()=>{if(t===void 0||J.current===t)return;let k=p.current;if(k===null)return;let N=t.path===void 0?-1:e.findIndex(T=>T.type==="entry"&&T.path===t.path);if(!(t.path!==void 0&&N<0)){if(J.current=t,N>=0){let T=Rr({scrollTop:k.scrollTop,viewport:k.clientHeight===0?480:k.clientHeight,rowHeight:b,index:N});T!==k.scrollTop&&(k.scrollTop=T,x(T)),A(N)}Rc(k),l?.()}},[t,e,l,b]);let I=k=>{x(k.currentTarget.scrollTop)},ee=St(e,{scrollTop:g,height:f===0?480:f,rowHeight:b}),Z={"--fx-row-h":`${String(b)}px`};return(0,L.jsx)("div",{className:"fx-scroll",ref:p,style:Z,onScroll:I,onKeyDown:K,onContextMenu:M,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,L.jsx)("div",{className:"fx-vlist",style:{height:e.length*b},children:ee.rows.map((k,N)=>{let T=(ee.startIndex+N)*b;return k.type==="entry"?(0,L.jsx)(wc,{row:k,top:T,selected:k.path===n,cursor:E===ee.startIndex+N,t:r,onToggle:o,onSelect:i,onRowActivate:S,onContextMenu:(ne,me)=>R(ne,{x:me.clientX,y:me.clientY},me.currentTarget instanceof HTMLElement?me.currentTarget:void 0)},k.path):(0,L.jsx)(Sc,{row:k,top:T,t:r,onRetry:a},k.key)})})})}var tt=require("react"),en=require("react/jsx-runtime");function ls({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:u,focusSignal:d}){let c=(0,tt.useRef)(null),p=(0,tt.useRef)(d);(0,tt.useEffect)(()=>{p.current!==d&&(p.current=d,c.current?.focus())},[d]);let g=f=>{if(!f.nativeEvent.isComposing){if(f.key==="Escape"){f.preventDefault(),f.stopPropagation(),u();return}if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault(),a(f.key==="ArrowDown"?1:-1);return}f.key==="Enter"&&(f.preventDefault(),l())}},x=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,en.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:g,children:[(0,en.jsx)("input",{ref:c,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:f=>i(f.currentTarget.value)}),x===null?null:(0,en.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[x,o?(0,en.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,en.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,en.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:u,children:"\xD7"})]})}function De(e){return e!==null&&typeof e=="object"}function rr(e){try{return e()}catch{return}}function Cc(e){let n=rr(()=>typeof e.get=="function"?e.get("connection"):void 0),t=De(n)?n.rpc:void 0;if(!(!De(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Xo}/${r}`,o,i)}function Tc(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function Co(e){return De(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function Pc(e){return()=>{let n=Cc(e);if(n!==void 0)return Tc(n);let t=rr(()=>e.fsExplorerWorkspace);if(Co(t))return t;let r=rr(()=>De(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Co(r))return r;let o=rr(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Co(o))return o}}function gn(e){let n=De(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=De(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return De(t)?t:void 0}var Ec=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function hn(e){let n=De(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:Ec.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function Fc(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:hn(n.error)};let t=De(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function Mc(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:hn(n.error)};let t=De(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function Nc(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:hn(n.error)}:{ok:!0}}function Ic(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:hn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function Lc(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:hn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Mn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function Bc(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:hn(n.error)}:{ok:!0}}function Ac(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:hn(n.error)};let t=De(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var rt={code:"unsupported",message:"the workspace service is unavailable"};function cs(e){let n=Pc(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:rt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),Fc),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),Mc),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),Nc),create:(r,o,i,a,l)=>t(u=>{let d=u.create;return typeof d!="function"?{ok:!1,error:rt}:d.call(u,{sessionId:r,parent:o,name:i,kind:a},l)},Ic),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:rt}:a.call(i,{sessionId:r},o)},Lc),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:rt}:l.call(a,{sessionId:r,tree:o},i)},Bc),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:rt}:a.call(i,{sessionId:r},o)},Ac)}}var Dc={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function Oc(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var Wc={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function zc(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",d=us(t[2]??"");return d===""?void 0:{base:`https://${u}/${d}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=us(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function us(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function $c(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function jc(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Kc(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Kc(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function _c(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function fs(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=_c(t,r);if(a===void 0)return[];let l=jc(i),u=$c(a),d=[],c=new Set;for(let p of n){if(c.has(p.name))continue;let g=zc(p.url);if(g===void 0)continue;c.add(p.name);let x=Oc(g.host),f=Wc[x][o],v=u===""?"":`/${u}`;d.push({id:`copy.remote.${p.name}`,label:`${p.name} \xB7 ${Dc[x]}`,url:`${g.base}/${f}/${l}${v}`})}return d}var C=require("react/jsx-runtime");function Hc({open:e}){return(0,C.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,C.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,C.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function Gc(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Vc=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Po(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var ys="dsh-fs-explorer.show-ignored";function qc(e){if(e==null)return!0;try{return e.getItem(ys)!=="0"}catch{return!0}}function Uc(e,n){if(n!=null)try{n.setItem(ys,e?"1":"0")}catch{}}var Xc=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,ms=new Map;function Yc(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function or({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,C.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,C.jsx)("strong",{children:e}),n===void 0?null:(0,C.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Zc(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function gs({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:u,workspace:d,fileReferences:c}){let p=ji();function g(x){let f=x.sessionId??e.currentSessionId(),v=(0,y.useRef)(f);v.current=f;let b=(0,y.useMemo)(()=>r(),[r]),E=(0,y.useMemo)(()=>o(),[o]),A=(0,y.useMemo)(()=>i(),[i]),J=(0,y.useMemo)(()=>f===void 0||u===void 0?void 0:u(f),[u,f]),F=(0,y.useMemo)(()=>f===void 0||d===void 0?void 0:d(f),[d,f]),D=(0,y.useMemo)(()=>Ua(F),[F]),[W,U]=(0,y.useState)(()=>yn(new Date().toISOString())),O=(0,y.useRef)(!1),[X,le]=(0,y.useState)(null),[S,R]=(0,y.useState)(null),M=(0,y.useRef)(!1),K=(0,y.useRef)(!1),[I,ee]=(0,y.useState)(null),[Z,k]=(0,y.useState)(null),[N,T]=(0,y.useState)(void 0),[ne,me]=(0,y.useState)(null),ve=(0,y.useRef)(null),[ye,te]=(0,y.useState)(null),[Y,xe]=(0,y.useState)(()=>new Map),[G,Q]=(0,y.useState)(void 0),[ge,we]=(0,y.useState)(void 0),[Xe,je]=(0,y.useState)(void 0),[nn,Ke]=(0,y.useState)(void 0),[ot,In]=(0,y.useState)(ms),Se=(0,y.useRef)(Y);Se.current=Y;let[tn,Re]=(0,y.useState)(()=>new Set),j=(0,y.useMemo)(()=>p.forSession(f),[p,f]),Fe=(0,y.useSyncExternalStore)(j.subscribe,j.snapshot,j.snapshot),Ln=Fe.panels.find(s=>s.key===Fe.active),rn=Ln?.path,Bn=Ln?.revision,[_e,lr]=(0,y.useState)(0),ce=(0,y.useRef)(new Map),Ye=(0,y.useRef)(void 0),[xn,Oe]=(0,y.useState)([]),[$,Ce]=(0,y.useState)(()=>qc(Po())),[se,Le]=(0,y.useState)(null),[Ss,Mo]=(0,y.useState)(!1),[Rs,kn]=(0,y.useState)(null),it=(0,y.useRef)(null);it.current=se?.path??null;let Ze=(0,y.useMemo)(()=>Po(),[]),[on,bn]=(0,y.useState)(()=>Ya(Ze)),cr=(0,y.useRef)(null),vn=(0,y.useRef)(null),oe=Y.get(""),at=oe?.status==="ready",No=(0,y.useCallback)((s,m,h,w)=>{j.open(s,m,h,w)},[j]),wn=(0,y.useCallback)(s=>{let m=new Set(j.snapshot().panels.map(B=>B.key)),h=[];for(let B of s){if(!m.has(B))continue;if((f===void 0?void 0:l?.peek(f,B))?.dirty===!0){h.push(B);continue}f!==void 0&&l?.forget(f,B),j.close(B)}let w=h[0];kn(null),Le(w===void 0?null:{path:w,rest:h.slice(1)})},[l,f,j]),an=(0,y.useCallback)(s=>{Le(null),kn(null),s.length>0&&wn(s)},[wn]),sn=(0,y.useCallback)(s=>{let m=s??j.snapshot().active??void 0;m!==void 0&&wn([m])},[wn,j]);(0,y.useEffect)(()=>{let s=e.registerPageCloser;if(typeof s=="function")return s(()=>{let m=Ii({viewSessionId:f,currentSessionId:e.currentSessionId(),activePanel:j.snapshot().active,confirming:it.current!==null});return m==="close"&&sn(),m!=="pass"})},[sn,f,j,e]);let Cs=(0,y.useCallback)(()=>{let s=se;if(s===null)return;let m=f===void 0?void 0:l?.find(f,s.path);if(m===void 0){f!==void 0&&l?.forget(f,s.path),j.close(s.path),an(s.rest);return}Mo(!0),kn(null),m.save().then(h=>{if(Mo(!1),!h.ok){let w=m.getSnapshot().error;kn(t("panel.confirm.failed").replace("{message}",mo(h.code,w?.message??"",t)));return}f!==void 0&&l?.forget(f,s.path),j.close(s.path),an(s.rest)})},[an,l,se,f,j,t]),Ts=(0,y.useCallback)(()=>{let s=se;if(kn(null),s===null){Le(null);return}f!==void 0&&l?.forget(f,s.path),j.close(s.path),an(s.rest)},[an,l,se,f,j]),ur=(0,y.useCallback)(()=>{let s=se;if(s===null){kn(null);return}an(s.rest)},[an,se]),ue=(0,y.useCallback)(async(s,m,h)=>{ce.current.get(s)?.abort();let w=new AbortController;ce.current.set(s,w),xe(B=>new Map(B).set(s,Vc()));try{let B=await h.list(m,Rt(s),w.signal);if(w.signal.aborted||v.current!==m)return!1;let H=Yt(B);if(!H.ok)return xe(He=>new Map(He).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:H.message})),!1;let Be=wt(H.listing.entries);return xe(He=>new Map(He).set(s,{status:"ready",nodes:Be,truncated:H.listing.truncated===!0,total:H.listing.entries.length})),!0}catch(B){return w.signal.aborted||xe(H=>new Map(H).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:xa(B)})),!1}finally{ce.current.get(s)===w&&ce.current.delete(s)}},[]);(0,y.useEffect)(()=>{for(let s of ce.current.values())s.abort();return ce.current.clear(),xe(new Map),Re(new Set),Ye.current=void 0,f!==void 0&&b!==void 0&&ue("",f,b),()=>{for(let s of ce.current.values())s.abort();ce.current.clear()}},[f,b,_e,ue]),(0,y.useEffect)(()=>{if(f===void 0||E===void 0){Q(void 0),we(void 0),je(void 0),Ke(void 0);return}let s=!0,m=new AbortController;return Q(void 0),we(void 0),je(void 0),Ke(void 0),Promise.resolve().then(()=>E.snapshot({sessionId:f,maxCommits:1},m.signal)).then(h=>{if(!s)return;let w=Zt(h);if(!w.ok){Q(void 0),we(void 0),je(void 0),Ke(void 0);return}Q(ri(ht(w.status),w.stats)),we(w.head),je(w.root),Ke(w.remotes)}).catch(()=>{s&&(Q(void 0),we(void 0),je(void 0),Ke(void 0))}),()=>{s=!1,m.abort()}},[f,E,_e]),(0,y.useEffect)(()=>{let s=b?.read;if(f===void 0||b===void 0||typeof s!="function"||!at){In(ms);return}let m=f,h=new AbortController,w=async(H,Be)=>{try{let He=Yc(await s.call(b,m,Be,{},h.signal));return He===void 0?void 0:[H,He]}catch{return}},B=si.filter(H=>H!==".gitmodules").map(H=>w(H,H));return Xe!==void 0&&B.push(w(".gitmodules",`${Xe.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(B).then(H=>{if(h.signal.aborted||v.current!==m)return;let Be=new Map;for(let ln of H)ln!==void 0&&Be.set(ln[0],ln[1]);let He=Se.current.get(""),id=new Set(He?.status==="ready"?He.nodes.filter(ln=>ln.kind==="directory").map(ln=>ln.name):[]);In(bt(Be,id))}),()=>h.abort()},[f,b,at,Xe,_e]);let[Ps,Es]=(0,y.useState)(void 0),fr=(0,y.useRef)(void 0),Io=(0,y.useRef)(0),pr=(0,y.useRef)(void 0),Lo=(0,y.useRef)(!1),An=(0,y.useCallback)((s,m,h)=>{Io.current+=1,Es({nonce:Io.current,...s===void 0?{}:{path:s},...m===void 0?{}:{delta:m},focus:h})},[]),Sn=(0,y.useCallback)((s,m)=>{let h=Wi(s);if(Re(w=>{let B=new Set(w);for(let H of h)B.add(H);return B}),!(f===void 0||b===void 0)){for(let w of h)Se.current.get(w)===void 0&&ue(w,f,b);m==="directory"&&Se.current.get(s)===void 0&&ue(s,f,b)}},[b,ue,f]),Bo=(0,y.useCallback)(s=>{let m=Hn(Se.current).find(h=>h.path===s);if(Sn(s,m?.kind),m?.kind==="directory"&&Re(h=>new Set(h).add(s)),Lo.current=!0,m===void 0){pr.current=s;return}An(s,void 0,!0)},[An,Sn]),st=(0,y.useCallback)(s=>{$t(s,{open:No,reveal:Bo})},[No,Bo]);(0,y.useEffect)(()=>{let s=x.viewRequest;if(s==null||s.view!==ke)return;let m=`${s.view}:${s.focus}`;Ye.current!==m&&(Ye.current=m,st(s.focus),x.completeViewRequest?.())},[x.viewRequest,x.completeViewRequest,st]),(0,y.useEffect)(()=>{let s=e.viewFocus;if(s===void 0||f===void 0)return;let m=()=>{let h=s.take(ke);h!==void 0&&st(h)};return m(),s.subscribe(m)},[e,f,st]),(0,y.useEffect)(()=>{if(rn===void 0||Bn!==void 0||!at||Ct(rn))return;let s=_n(rn);if(s.length===0||(Re(h=>s.every(w=>h.has(w))?h:new Set([...h,...s])),f===void 0||b===void 0))return;let m=s.filter(h=>Se.current.get(h)?.status!=="ready");m.length!==0&&Promise.all(m.map(h=>ue(h,f,b)))},[rn,Bn,at,f,b,ue]);let Ao=(0,y.useCallback)(()=>{if(typeof document>"u")return!1;let s=document.querySelector("[data-composer-input]");return s===null?!1:(s.focus(),!0)},[]),Fs=(0,y.useCallback)(s=>{if(s.button!==0||vn.current!==null||Xc())return;let m=cr.current?.previousElementSibling;if(m instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}vn.current={pointerId:s.pointerId,startX:s.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:on},document.body.classList.add("fx-pane-resizing")}},[on]),Ms=(0,y.useCallback)(s=>{let m=vn.current;m===null||m.pointerId!==s.pointerId||bn(So(m.baseWidth+s.clientX-m.startX))},[]),mr=(0,y.useCallback)(s=>{let m=vn.current;if(m===null||m.pointerId!==s.pointerId)return;vn.current=null,document.body.classList.remove("fx-pane-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let h=m.baseWidth+s.clientX-m.startX;if(Qa(h,m.baseWidth)){bn(m.restWidth);return}bn(tr(Ze,h))},[Ze]),yr=(0,y.useCallback)(()=>{Za(Ze),bn(null)},[Ze]),Ns=(0,y.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let m=Ja(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(m===null)return;if(s.preventDefault(),s.stopPropagation(),m.kind==="reset"){yr();return}if(m.kind==="min"||m.kind==="max"){let B=m.kind==="min"?180:520;bn(tr(Ze,B));return}let h=cr.current?.previousElementSibling,w=h instanceof HTMLElement?h.getBoundingClientRect().width:on??180;bn(tr(Ze,w+m.delta))},[Ze,yr,on]);(0,y.useEffect)(()=>()=>{vn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=m=>{if(!(m.isComposing||Ni(m.target))){if(Zc(m)){let h=j.snapshot().active,w=h===null||l===void 0||f===void 0?void 0:l.find(f,h);if(w===void 0)return;m.preventDefault(),m.stopPropagation(),w.save();return}for(let h of Lt)if(Mi(m,h)){if(h.action==="closePanel"&&j.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),h.action==="nextPanel"?j.next():h.action==="previousPanel"?j.previous():sn();return}}};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[l,sn,f,j]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=At({focusComposer:Ao,hasModal:()=>it.current!==null||M.current||K.current||Bt(document)}),m=h=>s(h);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Ao]),(0,y.useEffect)(()=>{if(se===null||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),ur())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[se,ur]);let Do=(0,y.useMemo)(()=>yt(xn),[xn]),dt=(0,y.useMemo)(()=>Pt(Y,tn,G,ot,{ignored:Do,showIgnored:$,hiddenLabel:s=>t("state.hiddenDirectory").replace("{count}",String(s))}),[Y,tn,G,ot,Do,$,t]),[Qe,Oo]=(0,y.useState)(""),[Wo,lt]=(0,y.useState)([]),[zo,ct]=(0,y.useState)(null),[Is,Dn]=(0,y.useState)(!1),[Ls,Bs]=(0,y.useState)(0),As=(0,y.useCallback)(()=>Bs(s=>s+1),[]);(0,y.useEffect)(()=>{let s=Di(Qe);if(s===void 0){lt([]),ct(null),Dn(!1);return}let m=()=>{let B=Oi(Hn(Se.current),s);lt(_r(B.map(H=>({path:H.path,kind:H.kind==="directory"?"directory":"file"})),G)),ct("loaded"),Dn(!1)},h=c?.();if(h===void 0||f===void 0){m();return}let w=new AbortController;return Dn(!0),Promise.resolve(h.list(f,s,w.signal)).then(B=>{if(w.signal.aborted)return;let H=Ai(B);lt(_r(H,G)),ct("index"),Dn(!1)},B=>{w.signal.aborted||(console.debug(`[${Te}] the file index failed, searching listed rows instead`,B),m())}),()=>w.abort()},[Qe,f,G,c]);let gr=zo!==null,Ds=gr?Wo:dt;(0,y.useEffect)(()=>{let s=pr.current;if(s===void 0)return;let m=Hn(Se.current).find(h=>h.path===s);m!==void 0&&(pr.current=void 0,m.kind==="directory"&&(Sn(s,m.kind),Re(h=>new Set(h).add(s))),An(s,void 0,!0))},[dt,An,Sn]);let[Os,ut]=(0,y.useState)(void 0),$o=(0,y.useRef)(!1);(0,y.useEffect)(()=>{if($o.current||typeof document>"u")return;let s=fi({rows:dt,panelCount:j.snapshot().panels.length,hasModal:Bt(document)});s.kind!=="skip"&&($o.current=!0,!Lo.current&&(s.open!==void 0&&j.open(s.open),ut({path:s.focus})))},[dt,j]);let Ws=(0,y.useCallback)(()=>ut(void 0),[]),On=G===void 0?void 0:Object.keys(G).length,zs=G===void 0?"neutral":Object.values(G).some(s=>s.status==="conflicted")?"conflict":On===0?"success":"warning",jo=ti(ge),$s=(0,y.useCallback)(s=>{if(f===void 0||b===void 0)return;if(tn.has(s)){Re(h=>{let w=new Set(h);return w.delete(s),w});return}Re(h=>new Set(h).add(s));let m=Y.get(s);(m===void 0||m.status==="failed")&&ue(s,f,b)},[tn,Y,f,b,ue]),Ko=(0,y.useCallback)(s=>{f===void 0||b===void 0||ue(s,f,b)},[f,b,ue]);(0,y.useEffect)(()=>{let s=!0;if(O.current=!1,f===void 0){U(yn(new Date().toISOString()));return}return D.load(f).then(m=>{s&&!O.current&&U(m)}).catch(()=>{}),()=>{s=!1}},[D,f]);let js=(0,y.useCallback)(s=>{let m=[..._n(s),s];if(Re(h=>{let w=new Set(h);for(let B of m)w.add(B);return w}),f!==void 0&&b!==void 0){let h=m.filter(w=>Se.current.get(w)?.status!=="ready");h.length>0&&Promise.all(h.map(w=>ue(w,f,b)))}ut({path:s})},[f,b,ue]),Ks=(0,y.useCallback)(s=>{j.open(s)},[j]),ie=(0,y.useCallback)((s,m)=>{ve.current!==null&&clearTimeout(ve.current),me({text:s,tone:m}),ve.current=setTimeout(()=>{ve.current=null,me(null)},4e3)},[]);(0,y.useEffect)(()=>()=>{ve.current!==null&&clearTimeout(ve.current)},[]);let dn=(0,y.useCallback)(s=>{O.current=!0,U(s),f!==void 0&&D.save(f,s).catch(()=>{ie(t("bookmarks.saveFailed"),"error")})},[ie,D,f,t]),_s=(0,y.useCallback)(s=>{try{dn($a(W,s.id).tree),ie(t("bookmarks.removed"),"ok")}catch{}},[ie,W,dn,t]),Hs=(0,y.useCallback)((s,m)=>{try{dn(_a(W,s,m))}catch{}},[W,dn]);(0,y.useEffect)(()=>{if(F===void 0){T(void 0);return}let s=!0;return F.capabilities(f??"").then(m=>{s&&T(m.ok?m.capabilities:void 0)}),()=>{s=!1}},[F,f]),(0,y.useEffect)(()=>{let s=F?.ignored;if(f===void 0||F===void 0||typeof s!="function"){Oe([]);return}let m=new AbortController,h=!0;return Promise.resolve().then(()=>s.call(F,f,m.signal)).then(w=>{h&&Oe(w.ok?w.entries:[])}).catch(()=>{h&&Oe([])}),()=>{h=!1,m.abort()}},[f,F,_e]);let Gs=(0,y.useCallback)(()=>{Ce(s=>{let m=!s;return Uc(m,Po()),m})},[]),Vs=(0,y.useCallback)((s,m,h)=>{let w=s===void 0?"":s.kind==="directory"?s.path:Ca(s.path);if(ee({row:s,anchor:m,absolutePath:void 0,trigger:h,createParent:w}),s===void 0||F===void 0)return;let B=s.path;F.info(f??"",B).then(H=>{ee(Be=>Be===null||Be.row?.path!==B?Be:{...Be,absolutePath:H.ok?H.info.absolutePath:void 0})})},[f,F]),qs=(0,y.useCallback)(()=>ee(null),[]),Us=(0,y.useCallback)((s,m,h)=>{k({key:s,anchor:m,trigger:h})},[]),Xs=(0,y.useCallback)(()=>k(null),[]),Ys=(0,y.useCallback)(s=>{let m=Z;if(k(null),m===null)return;if(s===mn.close){sn(m.key);return}let h=s===mn.closeOthers?"others":s===mn.closeRight?"right":void 0;h!==void 0&&wn($i(j.snapshot().panels,m.key,h))},[wn,sn,j,Z]);M.current=I!==null,K.current=Z!==null;let ft=(0,y.useMemo)(()=>fs({remotes:nn,root:Xe,absolutePath:I?.absolutePath,kind:I?.row?.kind??"file",head:ge}),[I?.absolutePath,I?.row?.kind,Xe,ge,nn]),hr=(0,y.useCallback)(s=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${s.code}`)),[t]),Zs=(0,y.useCallback)(s=>{let m=I;if(ee(null),m===null)return;if(s===de.createFile||s===de.createFolder){let w=m.createParent;if(w===void 0)return;te({kind:s===de.createFolder?"directory":"file",parent:w,error:void 0,busy:!1});return}let h=m.row;if(h!==void 0){if(s.startsWith(`${de.copyRemote}.`)){let w=ft.find(B=>B.id===s);if(w===void 0)return;pn(w.url).then(B=>{ie(B?t("notice.copiedRemote").replace("{remote}",w.label):t("notice.copyFailed"),B?"ok":"error")});return}if(s===de.copyRelative){pn(h.path).then(w=>{ie(t(w?"notice.copiedRelative":"notice.copyFailed"),w?"ok":"error")});return}if(s===de.copyAbsolute){let w=m.absolutePath;if(w===void 0)return;pn(w).then(B=>{ie(t(B?"notice.copiedAbsolute":"notice.copyFailed"),B?"ok":"error")});return}if(s===de.addBookmark){le({mode:"add",target:{name:h.name,path:h.path,kind:h.kind}});return}if(s===de.reveal){if(F===void 0){ie(hr({code:"unsupported",message:""}),"error");return}F.reveal(f??"",h.path).then(w=>{if(!w.ok){ie(hr(w.error),"error");return}let B=t(`menu.manager.${N?.fileManager??"directory"}`);ie(t("notice.revealed").replace("{manager}",B),"ok")})}}},[ie,N,I,ft,hr,f,t,F]),Qs=(0,y.useCallback)(s=>{let m=ye;if(m===null)return;if(F===void 0||F.create===void 0){te({...m,error:t("prompt.error.unsupported"),busy:!1});return}let h=f;if(h===void 0){te({...m,error:t("prompt.error.no-workspace"),busy:!1});return}te({...m,busy:!0,error:void 0}),F.create(h,m.parent,s,m.kind).then(w=>{if(!w.ok){te(H=>H===null?H:{...H,busy:!1,error:t(`prompt.error.${w.error.code}`)});return}te(null);let B=w.path;if(b!==void 0&&ue(m.parent,h,b),m.kind==="file"){j.open(B),ie(t("notice.createdFile"),"ok");return}Re(H=>new Set(H).add(B)),b!==void 0&&ue(B,h,b),ut({path:B}),ie(t("notice.createdFolder"),"ok")})},[ie,b,ue,ye,f,j,t,F]),Js=(0,y.useCallback)(()=>te(null),[]),ed=(0,y.useMemo)(()=>I===null?[]:Ta({row:I.row,notices:{workspace:F!==void 0},capabilities:N,absolutePath:I.absolutePath,createParent:I.createParent,remoteLinks:I.row===void 0?void 0:ft,bookmarkTarget:I.row===void 0?void 0:{name:I.row.name,path:I.row.path,kind:I.row.kind}},t),[N,I,ft,t,F]),_o=(0,y.useMemo)(()=>Z===null?[]:Pa({panels:Fe.panels,key:Z.key},t),[Fe.panels,t,Z]),xr=(0,y.useCallback)(s=>{let m=Hn(Se.current).find(h=>h.path===s);if(Sn(s,m?.kind),m?.kind==="directory"){Re(h=>new Set(h).add(s));return}j.open(s)},[Sn,j]),nd=(0,y.useCallback)(()=>{fr.current!==void 0&&xr(fr.current)},[xr]),pt=(0,y.useCallback)(()=>{Oo(""),lt([]),ct(null),Dn(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,y.useEffect)(()=>{if(Qe===""||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||m.defaultPrevented||it.current!==null||Bt(document)||(m.preventDefault(),m.stopPropagation(),pt())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[Qe,pt]);let td=()=>Re(new Set),rd=()=>lr(s=>s+1),od=f===void 0?"no-session":b===void 0?"no-service":oe===void 0||oe.status==="loading"?"loading":oe.status==="failed"?"failed":oe.nodes.length===0?"empty":"tree";return(0,C.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":od,"data-session":f??"","data-testid":"fs-explorer-view",children:[(0,C.jsxs)("header",{className:"fx-head",children:[(0,C.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,C.jsx)(Ro,{open:!0})}),(0,C.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,C.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,C.jsx)(Na,{tree:W,t,onOpenFile:Ks,onOpenFolder:js,onCreateGroup:s=>R({mode:"group",parentId:s}),onRename:s=>R({mode:"rename",node:s}),onRemove:_s,onMove:s=>le({mode:"move",node:s}),onReorder:Hs}),(0,C.jsxs)("div",{className:"fx-head-meta",children:[oe?.status==="ready"?(0,C.jsxs)("span",{children:[(0,C.jsx)("b",{children:oe.nodes.length})," ",t("head.entries")]}):null,xn.length===0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":$?"true":"false","aria-pressed":$,title:t($?"head.hideIgnored":"head.showIgnored"),"aria-label":t($?"head.hideIgnored":"head.showIgnored"),onClick:Gs,children:(0,C.jsx)(Hc,{open:$})}),(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":Qe===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":Qe!=="",onClick:()=>{Qe!==""?pt():As()},children:(0,C.jsx)(as,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:tn.size===0,onClick:td,children:(0,C.jsx)(ss,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:f===void 0||b===void 0||oe?.status==="loading",onClick:rd,children:(0,C.jsx)(is,{})})]})]}),ne===null?null:(0,C.jsx)("div",{className:"fx-notice",role:"status","data-tone":ne.tone,"data-testid":"fx-notice",children:ne.text}),(0,C.jsx)("div",{className:"fx-main",children:f===void 0?(0,C.jsx)(or,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):b===void 0?(0,C.jsx)(or,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):oe===void 0||oe.status==="loading"?(0,C.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):oe.status==="failed"?(0,C.jsx)(or,{title:t("state.failed.title"),description:oe.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Ko(""),testId:"fs-failed"}):oe.nodes.length===0?(0,C.jsx)(or,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)("div",{className:"fx-tree-pane",style:on===null?void 0:{"--fx-tree-width":`${on}px`},children:[(0,C.jsx)(ls,{t,value:Qe,origin:zo,count:Wo.length,busy:Is,onChange:Oo,onStep:s=>An(void 0,s,!1),onActivate:nd,onClose:pt,focusSignal:Ls}),(0,C.jsx)(ds,{rows:Ds,selectedPath:Bn===void 0?rn:void 0,entryFocus:gr?void 0:Os,t,onToggle:$s,onSelect:s=>gr?xr(s):j.open(s),onRetry:Ko,onEntryFocusSettled:Ws,onContextMenu:Vs,cursorRequest:Ps,onCursorMove:s=>{fr.current=s}})]}),(0,C.jsx)("div",{ref:cr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":on??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Fs,onPointerMove:Ms,onPointerUp:mr,onPointerCancel:mr,onLostPointerCapture:mr,onKeyDown:Ns,onDoubleClick:yr}),(0,C.jsxs)("div",{className:"fx-editor",children:[(0,C.jsx)(Ki,{panels:Fe.panels,active:Fe.active,t,onActivate:s=>j.activate(s),onClose:sn,onStep:s=>s===1?j.next():j.previous(),onTabMenu:Us,documents:l,sessionId:f}),se===null?null:(0,C.jsx)(_i,{name:zt(se.path),t,saving:Ss,error:Rs,onSave:Cs,onDiscard:Ts,onCancel:ur}),(0,C.jsx)("div",{className:"fx-editor-body",children:Fe.panels.length===0?(0,C.jsx)(Hi,{t}):Fe.panels.map((s,m)=>{let h=s.key===Fe.active;return(0,C.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!h,"data-line":s.line,"data-testid":"fs-panel",children:(0,C.jsx)(wa,{sessionId:f,files:b,path:s.path,revision:s.revision,git:A,t,visible:h,renderers:a,documents:l,locate:J})},s.key)})})]})]})}),I===null?null:(0,C.jsx)(go,{entries:ed,anchor:I.anchor,onSelect:Zs,onClose:qs,...I.trigger===void 0?{}:{returnFocus:()=>I.trigger??null}}),Z===null||_o.length===0?null:(0,C.jsx)(go,{entries:_o,anchor:Z.anchor,onSelect:Ys,onClose:Xs,returnFocus:()=>Z.trigger}),ye===null?null:(0,C.jsx)(nt,{kind:ye.kind,parent:ye.parent,t,error:ye.error,busy:ye.busy,onSubmit:Qs,onCancel:Js}),X===null?null:(0,C.jsx)(Ga,{tree:W,target:X.mode==="add"?X.target:void 0,t,mode:X.mode,...X.mode==="move"?{node:X.node}:{},onCommit:s=>{let m=X.mode;dn(s),le(null),ie(t(m==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>le(null)}),S===null?null:(0,C.jsx)(nt,{kind:"directory",parent:"",t,initialName:S.mode==="rename"?S.node.name:t("bookmarks.newGroup"),titleKey:S.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:s=>{let m=S;R(null);try{if(m.mode==="rename"){dn(ja(W,m.node.id,s)),ie(t("bookmarks.renamed"),"ok");return}let h=Zn("group",{id:Gc(),name:s,createdAt:Date.now()});dn(et(W,m.parentId,h)),ie(t("bookmarks.groupCreated"),"ok")}catch{ie(t("bookmarks.saveFailed"),"error")}},onCancel:()=>R(null)}),oe?.status==="ready"?(0,C.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,C.jsxs)("span",{children:[t("view.scope")," ",(0,C.jsx)("b",{children:oe.nodes.length})," ",t("head.entries")]}),oe.truncated?(0,C.jsx)("span",{className:"fx-foot-warn",children:Kn({entries:oe.nodes,truncated:!0,total:oe.total}).label}):null,(0,C.jsxs)("span",{className:"fx-foot-git","data-state":On===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,C.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":zs,"aria-hidden":"true"}),On===void 0?t("status.unavailable"):On===0?t("status.clean"):t("status.summary").replace("{count}",String(On))]}),jo===null?null:(0,C.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[jo,ge?.upstream!==void 0&&(ge.ahead??0)>0?(0,C.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(ge.ahead)}`}):null,ge?.upstream!==void 0&&(ge.behind??0)>0?(0,C.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(ge.behind)}`}):null]}),(0,C.jsx)("span",{className:"fx-spacer"}),(0,C.jsx)("span",{children:t("foot.order")})]}):null]})}return g}var xs=["slots","locale","workbench","remote"];function Jc(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var ir,ar,Eo,sr,Fo,ks;function hs(e){return Fo=e,sr!==void 0||(sr=Fi({open:(n,t,r)=>{let o=Fo;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Pi(o)(n,t,r)},save:(n,t)=>{let r=Fo;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Ei(r)(n,t)}})),sr}function eu(){if(Eo!==void 0)return Eo;let e=Ut({warn:n=>ks?.(n)});for(let n of yo())e.register(n);return Eo=e,e}var dr;function bs(e){let n=e.workbench;if(n==null)return()=>{};ks=p=>e.logger?.warn?.(p);let t=eu(),r={version:sa,renderers:t,registerRenderer:p=>t.register(p),documents:hs(e)};ar?.();let o=e.provide?.(io,r);o===void 0&&e.logger?.warn?.(`${$n}: ctx.provide unavailable, ${io} service not registered`),ar=o,ir?.();let i=e.locale.register($n,{zh:{...Lr,...Gr.zh,...po.zh},en:{...Br,...Gr.en,...po.en}});ir=i;let a=e.locale.bind($n),l=Ra(typeof document>"u"?void 0:document),u=Si(e),d=gs({workbench:n,version:n.version,t:a,files:pa(e),status:ka(e),git:ga(e),renderers:t,documents:hs(e),locate:p=>Ti(e,p),workspace:()=>cs(e),fileReferences:Bi(e)});dr?.();let c=Ir(e,n);return dr=c,e.slots.inject(br,()=>e.slots.register({name:br,id:ke,order:100,label:()=>Ar(Jc(e)),locale:$n},d)),()=>{o?.(),ar===o&&(ar=void 0),c(),dr===c&&(dr=void 0),l(),u(),i(),ir===i&&(ir=void 0)}}var vs={buildTree:wt,describeListing:Kn,iconFor:Rn,computeTreeWindow:St,flattenTree:Pt,badgeFor:Cn,formatSize:Et,joinPath:Tn,listingPath:Rt,parseFocus:Tt,consumeViewRequest:$t,createPanelStack:Hr,createEscapeHandler:At,KEYMAP:Lt,tabLabel:Ar,indexIgnoredPaths:yt,isIgnoredPath:gt,normalizeListing:Yt,normalizeStatusSnapshot:Zt,buildWorkspaceMap:bt,workspaceTagFor:vt,parseStatusZ:ht,statusTone:jn,statusBadge:xt,createPreviewLoader:Kt,renderMarkdown:jt,languageFor:qn,isMarkdownFile:Un,describePage:_t,classifyPreviewFailure:fn,normalizePreviewPage:Fn,previewChunkRoute:Zi,canBridgeFile:Ft,decideBridge:Mr,focusForFileAddress:Fr,forwardFocus:Nr,registerAddressBridge:Ir},ws={name:"dsh-fs-explorer",inject:xs,apply:bs,__test:vs};function nu(e){ea(e),Yi(e)}var tu=ws;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
