window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Sr=Object.defineProperty;var xd=Object.getOwnPropertyDescriptor;var kd=Object.getOwnPropertyNames;var bd=Object.prototype.hasOwnProperty;var vd=(e,n)=>{for(var t in n)Sr(e,t,{get:n[t],enumerable:!0})},wd=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of kd(n))!bd.call(e,o)&&o!==t&&Sr(e,o,{get:()=>n[o],enumerable:!(r=xd(n,o))||r.enumerable});return e};var Rd=e=>wd(Sr({},"__esModule",{value:!0}),e);var Ru={};vd(Ru,{__test:()=>Bs,apply:()=>Ls,boot:()=>vu,clientPlugin:()=>As,createReferenceResolver:()=>Is,default:()=>wu,inject:()=>Ms});module.exports=Rd(Ru);var Fn=require("react");var Jo="dsh-resource://file/";function Qo(e){try{return decodeURIComponent(e)}catch{return e}}function _n(e){if(!e.startsWith(Jo))return null;let n=e.slice(Jo.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Qo(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(Qo).join("/")}}function Ve(e){return e.slice(e.lastIndexOf("/")+1)}var ei=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title",claims:["workbench","sidebar"]},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title",claims:["workbench","sidebar"]},{family:"cad",extensions:["dxf"],titleKey:"cad.title",claims:["workbench","sidebar"]},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title",claims:["workbench"]},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title",claims:["workbench"]}];function ni(){return ei.flatMap(e=>[...e.extensions])}function Kn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return ei.find(o=>o.extensions.includes(r))?.family??null}var Ce="dsh-fs-explorer",Tr="conversation.view",te="fs-explorer";var Hn="fs-explorer",ti="fsExplorerDocuments",ri="fsExplorerWorkspace",oi="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function ii(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var Cr={chunk:"client.preview.js"},kt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};function ai(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function bt(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=ai(t);r===""||r==="."||n.add(r)}return n}function vt(e,n){if(n===void 0||n.size===0)return!1;let t=ai(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var Sd={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Td={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Cd=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function di(e){return typeof e=="string"&&Cd.has(e)}function si(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Pd(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function wt(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=si(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",u=a.rest;if(u===""||l.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:Pd(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=si(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function Gn(e){return di(e)?Sd[e]:"neutral"}function Rt(e){return di(e)?Td[e]:"?"}function Pr(e){return`status.${e}`}function St(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function li(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function ci(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function ui(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Ed=["conflicted","deleted","renamed","added","modified","untracked"];function Fd(e){return Gn(Ed.find(n=>e.has(n))??"modified")}function fi(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,u="";for(let d=0;d<l;d+=1){let c=a[d];if(c===void 0||c==="")continue;u=u===""?c:`${u}/${c}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Fd(o.present)});return t}var yi=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],gi=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Md(e){return gi.test(e)?e.slice(0,e.indexOf("/")):null}function Nd(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Id(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Nd(i[2]??"");a!==""&&gi.test(a)&&t.push(a)}return t}function Ld(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function pi(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function mi(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Tt(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of Ld(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of Id(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=pi(a);if(l!==void 0){let u=l.workspaces,d=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let c of mi(Array.isArray(u)?u:d))o.add(c)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let d=pi(u);if(d!==void 0)for(let c of mi(d.packages))o.add(c)}for(let l of o){let u=Md(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function Ct(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Bd=new Set([".git"]);function Ad(e){return Bd.has(e)}function Dd(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Pt(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Ad(r))continue;let o=Dd(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Od=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Wd=new Set(["md","mdx","markdown","mdown","rst","adoc"]),zd=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),$d=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),jd=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),_d=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Kd=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function hi(e){let n=Ve(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Cn(e,n="file"){if(n==="directory")return"folder";let t=Ve(e.toLowerCase());if(Kd.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=hi(t);return r===""?"file":Od.has(r)?"code":Wd.has(r)?"markdown":zd.has(r)?"data":$d.has(r)?"image":jd.has(r)?"style":_d.has(r)?"archive":"file"}var Hd={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Gd={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Pn(e){let n=Ve(e.toLowerCase()),t=Hd[n];if(t!==void 0)return t;let r=hi(n),o=Gd[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Vn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${oi} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Et(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),a),d=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function Fr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Ft(e){return e===""?".":e}function Mt(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function En(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function qn(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=En(r,o),t.push(r);return t}function Er(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Nt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let u=Er(t[2]),d=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return d===""||u<1?void 0:{path:d,line:u,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let u=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""?void 0:{path:u,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let u=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return u===""?void 0:{path:u,line:Er(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let l=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(l!=="")return{path:l,line:Er(i[2]),absolute:!1}}function xi(e){return e.selectionMoved?!0:e.cursorPath===void 0}function ki(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function It(e,n,t,r,o){let i=[],a=fi(t),l=o?.showIgnored===!1,u=o?.hiddenLabel??ii,d=(c,f)=>{let g=e.get(c);if(g===void 0||g.status!=="ready")return;let b=0;for(let w of g.nodes){let k=En(c,w.name),p=w.kind==="directory",F=vt(k,o?.ignored);if(F&&l){b+=1;continue}let R=p&&n.has(k),Y=p||t===void 0?void 0:t[k],H=Y?.status??(p?void 0:St(k,t)),O=Y===void 0?void 0:li(Y),M=p?a.get(k):void 0,q=p?Ct(r,k):void 0;if(i.push({type:"entry",path:k,name:w.name,kind:w.kind,depth:f,expanded:R,...w.size===void 0?{}:{size:w.size},...H===void 0?{}:{status:H},...M===void 0?{}:{statusCount:M.count,statusTone:M.tone},...O===void 0?{}:{diff:O},...q===void 0?{}:{tag:q},...F?{ignored:!0}:{}}),!R)continue;let B=e.get(k);if(B===void 0||B.status==="loading"){i.push({type:"status",key:`${k}:loading`,path:k,depth:f+1,state:"loading"});continue}if(B.status==="failed"){i.push({type:"status",key:`${k}:failed`,path:k,depth:f+1,state:"failed",message:B.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(B.nodes.length===0){i.push({type:"status",key:`${k}:empty`,path:k,depth:f+1,state:"empty"});continue}d(k,f+1),B.truncated&&i.push({type:"status",key:`${k}:truncated`,path:k,depth:f+1,state:"truncated",label:Vn({entries:B.nodes,truncated:!0,total:B.total}).label})}b>0&&g.nodes.length===b&&i.push({type:"status",key:`${c}:hidden`,path:c,depth:f,state:"empty",label:u(b)})};return d("",0),i}var Vd=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function qd(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Ud(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Vd.has(qd(n.path)))}function bi(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Ud(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Lt(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Mr="dsh-fs-explorer:bridge",Xd="fs-explorer-bridge",Si="dsh-resource://file/**",Nr="sidebar.right.pane.tab",Yd=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Zd=new Set(["docx","pptx","xlsx","xls","fods","csv","tsv","doc","ppt"]),Jd=new Set(["makefile","dockerfile","license","readme","changelog",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".browserslistrc",".env"]),Qd=new Set([...ni(),...Yd]);function el(e){let n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function Bt(e){if(typeof e!="string"||e==="")return!1;let n=Ve(e).toLowerCase();if(n==="")return!1;let t=el(n);return Zd.has(t)?!1:Jd.has(n)?!0:Qd.has(t)}function nl(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function tl(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Br(e,n){if(typeof e!="string")return;let t=_n(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=tl(n,nl(e));return`${Mt(r)?"abs:":"path:"}${r}:${String(o)}`}function Ar(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=_n(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Bt(r.path))return{action:"keep",reason:"refused"};let o=Br(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function qe(e,n){n===void 0?console.warn(`[${Ce}] ${e}`):console.warn(`[${Ce}] ${e}`,n)}function rl(e){console.debug(`[${Ce}] ${e}`)}function Ir(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Lr(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function pn(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function vi(e){return pn(()=>e.sidebarRightTabs,Ir)??pn(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Ir)}function wi(e){return pn(()=>e.sidebarRight,Lr)??pn(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Lr)}function Ri(e){return typeof e=="function"?e:()=>{}}var ol="dsh-resource://file/session/probe/src/main.ts";function il(e){let n=pn(()=>(typeof e.candidates=="function"?e.candidates(ol):[]).filter(r=>r.priority==="extension"&&r.id!==Mr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&qe(`another extension-band tab type already claims ${Si}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function al(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function sl(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function dl(e,n){let t=e.viewFocus;if(t?.request?.(te,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(te,n);return(!r.opened||r.focused)&&t?.take(te),r}return typeof e.openView=="function"&&e.openView(te,n)?(t?.take(te),{opened:!0,focused:!0}):(t?.take(te),{opened:!1,focused:!1})}function Dr(e,n,t,r){let o;try{o=dl(e,r)}catch(i){return qe("the file workbench threw while switching views",i),e.viewFocus?.take(te),!1}if(!o.opened)return qe(`the file workbench did not switch to ${te}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return qe("the forwarded tab could not be closed",i),!1}}function ll(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=al(i),u=sl(i),d=(0,Fn.useRef)(void 0);return(0,Fn.useEffect)(()=>{if(a===void 0){qe("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===a)return;d.current=a;let c=Ar(l,e.currentSessionId(),u);if(c.action!=="open"){qe(`left the forwarded tab standing (${c.reason})`,l);return}Dr(e,n,a,c.focus)},[a,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(qe(`the host did not inject useTabInfo into ${Nr}; the bridge cannot forward`),null):(0,Fn.createElement)(t,{useTabInfo:o.useTabInfo})}}function Or(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;il(l);let d;try{d=l.register({id:Mr,kind:Xd,patterns:[Si],priority:"extension",canOpen:g=>{let b=_n(g);return b!==null&&Bt(b.path)},title:g=>Ve(_n(g)?.path??g)||g})}catch(g){qe("the sidebar right refused the address bridge tab type",g);return}let c=ll(n,u),f;try{f=Ri(e.slots.inject(Nr,()=>e.slots.register({name:Nr,key:Mr},c)))}catch(g){d(),qe("the sidebar right refused the address bridge body",g);return}return()=>{f(),d()}},r=vi(e),o=wi(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return rl("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=pn(()=>l.get?.("sidebarRightTabs"),Ir)??vi(l),d=pn(()=>l.get?.("sidebarRight"),Lr)??wi(l);return t(u,d)});return Ri(a)}var Wr={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u662F\u5F53\u524D\u9884\u89C8\u7684\u6B63\u6587\uFF1A\u7F16\u8F91\u5668\u9762\u4E3A\u6574\u4EFD\u6587\u6863\uFF0C\u56DE\u9000\u9762\u4E3A\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","preview.surface.image.title":"\u56FE\u7247","preview.surface.pdf.title":"PDF \u6587\u6863","preview.surface.pdf.page":"\u7B2C {current} / {total} \u9875","preview.surface.pdf.previous":"\u4E0A\u4E00\u9875","preview.surface.pdf.next":"\u4E0B\u4E00\u9875","preview.surface.pdf.error.password":"\u8FD9\u4E2A PDF \u9700\u8981\u5BC6\u7801\u624D\u80FD\u6253\u5F00","preview.surface.pdf.error.invalid":"\u8FD9\u4E2A PDF \u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 PDF","preview.surface.pdf.error.missing":"\u627E\u4E0D\u5230\u8FD9\u4E2A PDF \u7684\u5185\u5BB9","preview.surface.pdf.error.unknown":"\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A PDF","preview.surface.pdf.error.render":"\u8FD9\u4E00\u9875\u65E0\u6CD5\u7ED8\u5236","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.reference":"\u5F15\u7528\u5230\u8F93\u5165\u6846","menu.reference.reason.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","menu.reference.reason.noReference":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","menu.reference.reason.noReferenceSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","menu.reference.reason.absolute":"\u5DE5\u4F5C\u533A\u5916\u7684\u7EDD\u5BF9\u8DEF\u5F84\u4E0D\u80FD\u5F15\u7528","menu.reference.reason.revision":"\u63D0\u4EA4\u7248\u672C\u7684\u6587\u4EF6\u4E0D\u5728\u5DE5\u4F5C\u533A\u91CC\uFF0C\u4E0D\u80FD\u5F15\u7528","notice.referenced":"\u5DF2\u5F15\u7528 {name}","notice.referenceFailed":"\u65E0\u6CD5\u63D2\u5165\u5F15\u7528\uFF0C\u8F93\u5165\u6846\u4E0D\u63A5\u53D7\u5199\u5165","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","menu.tab.close":"\u5173\u95ED","menu.tab.closeOthers":"\u5173\u95ED\u5176\u4ED6\u6807\u7B7E\u9875","menu.tab.closeOthers.reason":"\u53EA\u6709\u8FD9\u4E00\u4E2A\u6807\u7B7E\u9875","menu.tab.closeRight":"\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E\u9875","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},zr={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the preview text: the whole document in an editor body, the current page in a fallback body","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","preview.surface.image.title":"Image","preview.surface.pdf.title":"PDF document","preview.surface.pdf.page":"Page {current} of {total}","preview.surface.pdf.previous":"Previous page","preview.surface.pdf.next":"Next page","preview.surface.pdf.error.password":"This PDF is password protected","preview.surface.pdf.error.invalid":"This file is damaged or is not a valid PDF","preview.surface.pdf.error.missing":"The content of this PDF could not be found","preview.surface.pdf.error.unknown":"This PDF could not be opened","preview.surface.pdf.error.render":"This page could not be drawn","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.reference":"Reference in composer","menu.reference.reason.noSession":"No session to insert into","menu.reference.reason.noReference":"This host has no composer to insert into","menu.reference.reason.noReferenceSource":"The reference source is not registered, so the chip could not be sent","menu.reference.reason.absolute":"An absolute path outside the workspace cannot be referenced","menu.reference.reason.revision":"A commit-version file is not in the working tree, so it cannot be referenced","notice.referenced":"Referenced {name}","notice.referenceFailed":"Could not insert the reference: the composer refused the write","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","menu.tab.close":"Close","menu.tab.closeOthers":"Close other tabs","menu.tab.closeOthers.reason":"This is the only tab","menu.tab.closeRight":"Close tabs to the right","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function $r(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Wr:zr)["tab.label"]??"Files"}var Ei=require("react"),Fi=14,cl="--dsh-content-font-size",Ti=Fi;function ul(e,n){return Math.max(e,Math.round(e*n/Fi))}function fl(e,n){if(e===void 0)return n;let t=Number.parseFloat(e);return Number.isFinite(t)&&t>0?t:n}function Mi(){return typeof document>"u"||document.body===null?Ti:fl(document.body.style.getPropertyValue(cl),Ti)}var jr=Mi(),_r=new Set;function Ci(){return jr}function pl(e){return _r.add(e),()=>{_r.delete(e)}}function ml(e){if(e!==jr){jr=e;for(let n of[..._r])n()}}function Pi(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function yl(e){if(e===null||typeof e!="object")return;let n=e.fontSizes;if(n===null||typeof n!="object")return;let t=n.text;return typeof t=="number"&&Number.isFinite(t)&&t>0?t:void 0}function gl(e){try{let n=e.get?.("theme");if(Pi(n))return n}catch{}try{let n=e.theme;if(Pi(n))return n}catch{}}function Ni(e){let n=e.inject;if(typeof n!="function")return()=>{};let t,r;try{let o=n.call(e,["theme"],i=>{let a=gl(i);if(a===void 0)return;let l=()=>{try{let c=yl(a.getTheme());ml(c??Mi())}catch{}};l();let u=i.on?.("theme/change",l);if(typeof u!="function")return;let d=u;return t=d,d});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{t?.(),r?.()}}function Ii(e){let n=(0,Ei.useSyncExternalStore)(pl,Ci,Ci);return ul(e,n)}var hl=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function we(e){return e!==null&&typeof e=="object"}function Dt(e,n){return{ok:!1,code:e,message:n}}function Ot(e){let n=we(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Dt(t,r)}function Kr(){return Dt("invalid-response","the document service answered an invalid response")}function At(e){try{return e()}catch{return}}function xl(e){let n=we(e)?e:void 0;if(n===void 0)return Kr();if(n.ok===!1)return Ot(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=we(t)?t:void 0;if(r===void 0)return Kr();if(r.ok===!1)return Ot(r.error);let o=we(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Kr():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function kl(e){let n=we(e)?e:void 0;if(n===void 0)return Li();if(n.ok===!1)return Ot(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=we(t)?t:void 0;if(r===void 0)return Li();if(r.ok===!1)return Ot(r.error);let o=we(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Li(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Hr(e){return we(e)&&typeof e.open=="function"}function bl(e){let n=At(()=>typeof e.get=="function"?e.get("connection"):void 0),t=we(n)?n.rpc:void 0;if(!(!we(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${ti}/${r}`,o,i)}function vl(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function wl(e){let n=we(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=we(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=we(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function Bi(e,n){let t=Vr(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return wl(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function Vr(e){return()=>{let n=At(()=>e.fsExplorerDocuments);if(Hr(n))return n;let t=At(()=>we(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Hr(t))return t;let r=At(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Hr(r))return r;let o=bl(e);if(o!==void 0)return vl(o)}}function Ai(e){let n=Vr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Dt("unavailable","the document service is unavailable");try{return xl(await i.open({sessionId:t,path:r},o))}catch(a){return Dt("io-error",a instanceof Error?a.message:String(a))}}}function Di(e){let n=Vr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return kl(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function Oi(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let d=o(l,u),c=n.get(d);return c===void 0&&(c={session:new Gr(l,u,e.open,e.save,()=>{n.delete(d),i()},i)},n.set(d,c),i()),c.session.retain(),c.session},peek(l,u){return a(l,u)?.getSnapshot()},find:a,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var Gr=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=hl;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Wt=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function qr(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Wi(e,n,t=qr()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function zi(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Rl(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function zt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function $t(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Rl(n),e.onClose?.()}}function $i(e){return e.viewSessionId===void 0||e.viewSessionId!==e.currentSessionId||e.activePanel===null?"pass":e.confirming?"hold":"close"}function ji(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function jt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function _t(e){try{return e()}catch{return}}function _i(e){return()=>{let n=_t(()=>e.fileReferences);if(jt(n))return n;let t=_t(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(jt(t))return t;let r=_t(()=>e.remote?.fileReferences);if(jt(r))return r;let o=_t(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return jt(o)?o:void 0}}function Ki(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function Hi(e){let n=e.trim();return n===""?void 0:n}function Ur(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?St(i,n):void 0,u=Sl(i);t.push({type:"entry",path:i,name:ji(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...u===""?{}:{directory:u}})}return t}function Sl(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function Mn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:En(t,o.name),kind:o.kind});return n}function Gi(e,n){let t=n.toLowerCase();return e.filter(r=>ji(r.path).toLowerCase().includes(t))}function Vi(e){return qn(e)}var Nn=require("react");function Ht(e){let n=Ve(e);return n===""?e:n}function Kt(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Tl=Object.freeze({panels:Object.freeze([]),active:null});function qi(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Cl=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Ui(e,n,t){let r=e.findIndex(i=>i.key===n);return r<0?[]:(t==="others"?e.filter((i,a)=>a!==r):e.slice(r+1)).map(i=>i.key)}function Xr(){let e=[],n=null,t=Tl,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(c=>c.key===d),a=d=>e.findIndex(c=>c.revision===void 0&&c.key===d),l=d=>{if(typeof d!="string")return;if(i(d)>=0)return d;let c=Cl.exec(d);if(c!==null){let b=(c[1]??"").toLowerCase(),w=Kt(c[2]??"",!1);if(w===void 0)return;let k=qi(w,b);return i(k)>=0?k:void 0}let f=Kt(d,!0);if(f===void 0)return;if(a(f)>=0)return f;let g=Kt(d,!1);if(!(g===void 0||g===f))return a(g)>=0?g:void 0},u=d=>{if(e.length===0)return;let c=n===null?-1:i(n),f=e[(c+d+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(d,c=1,f=!1,g){let b=Kt(d,f);if(b===void 0)return;let w=typeof g=="string"&&g.trim()!==""?g.trim().toLowerCase():void 0,k=qi(b,w),p=Number.isFinite(c)&&c>0?Math.trunc(c):1,F=i(k);if(F>=0){let H=e[F],O=H!==void 0&&(H.line!==p||H.absolute!==f);if(O&&(e=e.map((M,q)=>q===F?{...M,line:p,absolute:f}:M)),n===k){O&&o();return}n=k,o();return}let R=n===null?e.length:i(n)+1,Y={key:k,path:b,line:p,absolute:f,...w===void 0?{}:{revision:w}};e=[...e.slice(0,R),Y,...e.slice(R)],n=k,o()},close(d){let c=d===void 0?n:l(d)??null;if(c===null)return;let f=i(c);f<0||(e=e.filter(g=>g.key!==c),n===c&&(n=(e[f]??e[f-1])?.key??null),o())},activate(d){let c=l(d);c===void 0||i(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let c=l(d);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(d=>d.key===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function Xi(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Xr();return e.set(t,o),o}}}function Gt(e,n){let t=Nt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var V=require("react/jsx-runtime"),Yr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Pl=()=>()=>{},El=()=>"";function Fl(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Yi({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,onTabMenu:a,documents:l,sessionId:u}){let d=(0,Nn.useRef)(null);(0,Nn.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let c=(0,Nn.useSyncExternalStore)(l?.subscribe??Pl,()=>Fl(l,u,e).join("\0"),El),f=new Set(c===""?[]:c.split("\0"));if(e.length===0)return null;let g=b=>{if(b.key==="ArrowRight"||b.key==="ArrowLeft"){b.preventDefault(),b.stopPropagation(),i(b.key==="ArrowRight"?1:-1);return}(b.key==="Delete"||b.key==="Backspace")&&n!==null&&(b.preventDefault(),b.stopPropagation(),o(n))};return(0,V.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((b,w)=>{let k=b.key===n,p=Ht(b.path),F=t("panel.close").replace("{name}",p);return(0,V.jsxs)("div",{className:"fx-tab","data-active":k?"true":"false","data-dirty":f.has(b.path)?"true":"false",role:"presentation",onContextMenu:a===void 0?void 0:R=>{R.preventDefault(),R.stopPropagation(),a(b.key,{x:R.clientX,y:R.clientY},R.currentTarget)},children:[(0,V.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${w}`,"aria-controls":`fx-panel-${w}`,"aria-selected":k,tabIndex:k?0:-1,title:b.path,"data-testid":"fs-tab","data-path":b.path,"data-key":b.key,ref:k?d:void 0,onClick:()=>r(b.key),children:[(0,V.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Cn(b.path),"aria-hidden":"true",children:Pn(b.path)}),(0,V.jsx)("span",{className:"fx-tab-name",children:p}),b.revision===void 0?null:(0,V.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:b.revision,children:b.revision.slice(0,7)}),f.has(b.path)?(0,V.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,V.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:k?0:-1,"aria-label":F,title:F,"data-testid":"fs-tab-close",onClick:()=>o(b.key),children:"\xD7"})]},b.key)})})}function Zi({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,V.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,V.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,V.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,V.jsx)("span",{className:"fx-spacer"}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Ml(){return(0,V.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,V.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,V.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,V.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Nl(){return typeof document<"u"&&document.documentElement.dataset.platform!==void 0&&qr()==="mac"?"\u2318W":"Ctrl+W"}function Ji({t:e}){return(0,V.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,V.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,V.jsx)(Ml,{})}),(0,V.jsx)("strong",{children:e("panel.empty.title")}),(0,V.jsx)("span",{children:e("panel.empty.description")}),(0,V.jsxs)("span",{className:"fx-empty-keys",children:[(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:Nl()}),(0,V.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Qi=require("react");function me(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Qi.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Il(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Ll=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function mn(e){let n=[],t=0;for(let r of e.matchAll(Ll)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(me("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(me("strong",null,...mn(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(me("del",null,...mn(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(me("em",null,...mn(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,u=a===null?void 0:Il(a[2]??"");n.push(u===void 0?l:me("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var ea=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,na=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,ta=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Zr=/^\s{0,3}>\s?(.*)$/u,Jr=/^\s{0,3}[-*+]\s+(.*)$/u,Qr=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Bl(e){return ea.test(e)||na.test(e)||ta.test(e)||Zr.test(e)||Jr.test(e)||Qr.test(e)}function ra(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=ea.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),c=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(me("pre",null,me("code",c===""?null:{className:`language-${c}`},f.join(`
`))));continue}let i=na.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(me(`h${String(d)}`,null,...mn(i[2]??""))),t+=1;continue}if(ta.test(r)){n.push(me("hr",null)),t+=1;continue}if(Zr.test(r)){let d=[];for(;t<e.length;){let c=Zr.exec(e[t]??"");if(c===null)break;d.push(c[1]??""),t+=1}n.push(me("blockquote",null,...ra(d)));continue}if(Jr.exec(r)!==null){let d=[];for(;t<e.length;){let c=Jr.exec(e[t]??"");if(c===null)break;d.push(me("li",null,...mn(c[1]??""))),t+=1}n.push(me("ul",null,...d));continue}if(Qr.exec(r)!==null){let d=[];for(;t<e.length;){let c=Qr.exec(e[t]??"");if(c===null)break;d.push(me("li",null,...mn(c[1]??""))),t+=1}n.push(me("ol",null,...d));continue}let u=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||Bl(d))break;u.push(d.trim()),t+=1}n.push(me("p",null,...mn(u.join(" "))))}return n}function Vt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return me("div",{className:"fx-md"},...ra(n))}var eo=200,Al={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Yn(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Al[t.slice(r+1)]??"plaintext"}function Zn(e){return Yn(e)==="markdown"}var xe=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Un(e){return e!==null&&typeof e=="object"}function Dl(e){return e===""?0:e.split(`
`).length}function In(e,n){if(!Un(e))throw new xe("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=Un(e.error)?e.error:{},f=typeof c.code=="string"?c.code:"preview/unknown",g=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",b=Un(c.details)?c.details:{},w=typeof b.kind=="string"?b.kind:"";throw new xe(f,g,w)}let t=e.ok===!0?e.value:e;if(!Un(t)||typeof t.text!="string")throw new xe("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Dl(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,d={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?d:{...d,totalLines:o}}function yn(e){let n=Un(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Xn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function qt({files:e,maxLines:n=eo}){let t=Math.max(1,Math.trunc(n)),r=Xn,o=0,i=null,a=[1],l=new Set,u=c=>{r=c;for(let f of l)f()},d=async(c,f)=>{o+=1;let g=o;i?.abort();let b=new AbortController;i=b,u({status:"loading",path:c,text:r.path===c?r.text:"",offset:f,lines:r.path===c?r.lines:0,...r.path===c&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===c&&r.source!==void 0?{source:r.source}:{},eof:r.path===c?r.eof:!1});try{let w=await e.read(c,f>1?{offset:f,limit:t}:{limit:t},b.signal);if(g!==o)return;let k=In(w,f);if(k.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let p={status:"ready",path:c,text:k.text,offset:k.offset,lines:k.lines,eof:k.eof,...k.source===void 0?{}:{source:k.source},...k.linkTarget===void 0?{}:{linkTarget:k.linkTarget,linkPath:c}};u(k.totalLines===void 0?p:{...p,totalLines:k.totalLines})}catch(w){if(g!==o||b.signal.aborted)return;u({status:"failed",path:c,text:"",offset:f,lines:0,eof:!1,failure:yn(w)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(c){return l.add(c),()=>{l.delete(c)}},async open(c){a=[1],await d(c,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let c=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&c>r.totalLines||(a.push(c),await d(r.path,c))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let c=a[a.length-1]??1;await d(r.path,c)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(Xn)}}}function Ut(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var no=Object.freeze({chunk:Cr.chunk,id:`${Ce}/${Cr.chunk}`}),to=null,Jn=null,Xt=new Map;function oa(e){to=e}function ia(){return no}function Ol(e){let n=kt[e];return{chunk:n,id:`${Ce}/${n}`}}function ro(){if(Jn!==null)return Jn;let e=to;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Ce}: the loader require was not handed over`));let n=e.async(`./${no.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Ce}: chunk ${no.id} is missing its preview renderers`);return r});return Jn=n,n.catch(()=>{Jn===n&&(Jn=null)}),n}function aa(e){let n=Xt.get(e);if(n!==void 0)return n;let t=to;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${Ce}: the loader require was not handed over`));let r=Ol(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${Ce}: chunk ${r.id} is not the ${e} view`);return a});return Xt.set(e,o),o.catch(()=>{Xt.get(e)===o&&Xt.delete(e)}),o}var sa=Object.freeze({}),Wl="@deepseek-ai/dsh-client-ui-primitives",io=null,oo;function da(e){io=e}function zl(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function Yt(){if(oo!=null)return oo;if(io===null)return sa;let e=zl(io,Wl);if(e===void 0)return sa;let n=c=>{let f=e[c];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=c=>{let f=e[c];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let d=t("useAnchoredPosition");return d!==void 0&&(r.useAnchoredPosition=d),r}var D=require("react");async function gn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}function $l(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function Zt(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp($l(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function la(e,n,t){return n<=0?0:((e+t)%n+n)%n}function ca(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function ao(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function ua(e){let n=t=>Zt(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var jl=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),_l=new Set(["SCRIPT","STYLE","TEMPLATE"]);function Kl(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let d=i.data;if(d==="")continue;let c=n.at(-1);c===void 0?n.push([d]):c.push(d),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(_l.has(l))continue;if(l==="BR"){n.push([]);continue}let u=jl.has(l);u&&n.push([]),r(a),u&&n.push([])}};return r(e),{layout:ca(n),nodes:t}}function fa(e){let n=()=>{let r=e();return r===null?void 0:Kl(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:Zt(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=Zt(i.layout.text,r)[o];if(l===void 0)return;let u=ao(i.layout,l.from),d=ao(i.layout,l.to);if(u===void 0||d===void 0)return;let c=i.nodes[u.node],f=i.nodes[d.node];if(c===void 0||f===void 0)return;let g=a.ownerDocument.createRange();try{g.setStart(c,Math.min(u.offset,c.data.length)),g.setEnd(f,Math.min(d.offset,f.data.length))}catch{return}let b=t();b!==void 0&&(b.removeAllRanges(),b.addRange(g));let w=g.startContainer.parentElement;w!==null&&typeof w.scrollIntoView=="function"&&w.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var Ue=require("react/jsx-runtime");function Hl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Gl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function so({failure:e,t:n,onRetry:t}){return(0,Ue.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Ue.jsx)("strong",{children:Hl(e,n)}),(0,Ue.jsx)("span",{children:Gl(e,n)}),e.message===""?null:(0,Ue.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Ue.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function lo({t:e}){return(0,Ue.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Ue.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Pe=require("react");var nn=require("react/jsx-runtime");function pa({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Pe.useState)(""),[a,l]=(0,Pe.useState)(0),[u,d]=(0,Pe.useState)(0),c=(0,Pe.useRef)(null);(0,Pe.useEffect)(()=>{c.current?.focus()},[]),(0,Pe.useEffect)(()=>{if(o===""){d(0),l(0);return}let k=n().count(o);d(k),l(p=>k===0?0:Math.min(p,k-1))},[o,t,n]),(0,Pe.useEffect)(()=>{o===""||u===0||n().reveal(o,a)},[o,a,u,n]);let f=(0,Pe.useCallback)(()=>{n().clear(),r()},[n,r]),g=(0,Pe.useCallback)(k=>{u!==0&&l(p=>la(p,u,k))},[u]),b=k=>{if(!k.nativeEvent.isComposing){if(k.key==="Escape"){k.preventDefault(),k.stopPropagation(),f();return}if(k.key==="Enter"){k.preventDefault(),g(k.shiftKey?-1:1);return}(k.key==="ArrowDown"||k.key==="ArrowUp")&&k.stopPropagation()}},w=o===""?e("preview.find.hint"):u===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(a+1)).replace("{count}",String(u));return(0,nn.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:b,children:[(0,nn.jsx)("input",{ref:c,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:k=>{i(k.currentTarget.value),l(0)}}),(0,nn.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":u===0?"empty":"ready",title:e("preview.find.scope"),children:w}),(0,nn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:u===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>g(-1),children:"\u2191"}),(0,nn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:u===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>g(1),children:"\u2193"}),(0,nn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:f,children:"\xD7"})]})}var co="fsExplorer",ma=1;function Vl(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function ql(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Ul(e){return e.slice(e.lastIndexOf("/")+1).toLowerCase()}function Xl(e,n,t,r){return e.extensions.length===0&&e.families.length===0&&e.names.length===0||n!==""&&e.extensions.includes(n)||t!==null&&e.families.includes(t)?!0:e.names.includes(r)}function Yl(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Jt(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(ql),families:[...i.match?.families??[]],names:(i.match?.names??[]).map(u=>u.toLowerCase())}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=Vl(i.path),l=Kn(i.path),u=Ul(i.path),d;for(let c of t.values())Xl(c,a,l,u)&&(d===void 0||Yl(c.contribution,d.contribution))&&(d=c);return d?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function ya(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Qt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function $e(e){try{return e()}catch{return}}function Ne(e){return e!==null&&typeof e=="object"}function ba(e){return()=>{let n=$e(()=>e.workspaceFiles);if(Qt(n))return n;let t=$e(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Qt(t))return t;let r=$e(()=>e.remote?.workspaceFiles);if(Qt(r))return r;let o=$e(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Qt(o))return o}}function va(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function wa(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return In(i,r.offset??1),i}catch(d){if(!(d instanceof xe)||yn(d).kind!=="symlink")throw d;a=d}let l=await n(t,o);if(l===void 0)throw a;return{...In(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function ga(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Zl(e){let n=$e(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ne(n)?n.rpc:void 0;if(!Ne(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Ra(e){return()=>{let n=$e(()=>e.remote?.gitExplorer);if(ga(n))return n;let t=$e(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return ga(t)?t:Zl(e)}}function Jl(e){return e===""?0:e.split(`
`).length}function ha(e){let n=Ne(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new xe(t,r)}function Sa(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Ne(l))throw new xe("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw ha(l.error);let u=l;if(l.ok===!0&&(u=l.value),!Ne(u))throw new xe("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw ha(u.error);let d=u;if(u.ok===!0&&(d=u.page),!Ne(d))throw new xe("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(d.kind==="submodule")throw new xe("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(d.binary===!0||d.kind==="binary")throw new xe("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof d.text!="string")throw new xe("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let c=typeof d.lines=="number"&&Number.isFinite(d.lines)?Math.max(0,Math.trunc(d.lines)):Jl(d.text),f=typeof d.offset=="number"&&Number.isFinite(d.offset)&&d.offset>0?Math.trunc(d.offset):o.offset??1,g=d.source==="first-parent"?"first-parent":d.source==="commit"?"commit":void 0;return{text:d.text,lines:c,offset:f,eof:d.eof===!0,...g===void 0?{}:{source:g}}}}}function Ql(e){if(!Ne(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Ne(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function ec(e){let n=Ne(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Ne(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new xe(t,r,i)}function po(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ql(await n.call(e,t,r,{},o));if(!i.ok)throw ec(i.error);return i.value.data}}function Qn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function uo(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function er(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Qn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?uo(r.value):{ok:!1,message:Qn(r.error)}}return uo(t)}return uo(n)}function Ta(e){return e instanceof Error?e.message:Qn(e)}function xa(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function nc(e){let n=$e(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ne(n)?n.rpc:void 0;if(!Ne(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function Ca(e){return()=>{let n=nc(e);if(n!==void 0)return n;let t=$e(()=>e.remote?.gitExplorer);if(xa(t))return t;let r=$e(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(xa(r))return r}}function ka(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function tc(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=ka(r.additions),i=ka(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function rc(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function oc(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function fo(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=tc(n.stats),r=rc(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=oc(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function nr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Qn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?fo(o.snapshot):{ok:!1,message:Qn(o.error)}}let r=e;return r.snapshot!==void 0?fo(r.snapshot):fo(t)}var E=require("react/jsx-runtime"),ho={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},ic=()=>()=>{},Pa=()=>{};function xo(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var mo={status:"idle"},ac=[".md",".mdx",".markdown",".mdown"],sc=-1e3;function go({t:e,revision:n}){return(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,E.jsx)("strong",{children:e("preview.unavailable.title")}),(0,E.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function Ea({chunk:e,text:n,path:t,offset:r,find:o}){let i=(0,D.useRef)(null),a=(0,D.useRef)(null),l=(0,D.useRef)(n);l.current=n;let[u,d]=(0,D.useState)(!1),c=Yn(t);return(0,D.useEffect)(()=>{d(!1)},[e,t]),(0,D.useEffect)(()=>{let f=i.current;if(!(e===null||f===null))try{let g=e.mountCodePreview(f,{text:n,language:c,path:t,offset:r});return a.current=g,()=>{g.destroy(),a.current=null}}catch{d(!0);return}},[e,t,c]),(0,D.useEffect)(()=>{a.current?.update(n,r)},[n,r,e]),(0,D.useEffect)(()=>{if(!(o===void 0||e===null||u))return o.register({text:()=>l.current,select:(f,g)=>a.current?.revealRange(f,g),clear:()=>a.current?.clearSelection()}),()=>o.register(null)},[o,e,u]),e===null||u?(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,E.jsx)("div",{className:"fx-code-host",ref:i,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function dc({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Zn(n)?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Vt(r)}):(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function lc(e){function n({page:t,path:r,mode:o,find:i}){return o==="reading"?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,E.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,E.jsx)(Ea,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:i})}return{Body:n,renderer:e.renderer}}function cc(e){function n({page:t,path:r,find:o}){return(0,E.jsx)(Ea,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:o})}return{Body:n,renderer:e.renderer}}function uc({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,D.useMemo)(()=>{let u=po(r);return u===void 0||t===void 0||a===void 0?u:async(d,c,f)=>{if(d!==t||c!==n)return u(d,c,f);let g=await a(c,f);return u(d,g?.absolutePath??c,f)}},[r,t,n,a]);return t===void 0||l===void 0?(0,E.jsx)(go,{t:o}):(0,E.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function fc(e){return{Body:n=>(0,E.jsx)(uc,{chunk:e,...n}),renderer:e.renderer}}function ko(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...ac]},priority:0,load:()=>ro().then(lc)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:sc,load:()=>ro().then(cc)},...Object.keys(kt).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>aa(e).then(fc)}))]}var yo;function pc(){if(yo!==void 0)return yo;let e=Jt();for(let n of ko())e.register(n);return yo=e,e}function Fa({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:u,locate:d}){let c=(0,D.useMemo)(()=>{let z=r===void 0?va(n,e):o===void 0||e===void 0?void 0:Sa(o,e,r);return z===void 0||r!==void 0||d===void 0?z:wa(z,d)},[n,e,r,o,d]),f=(0,D.useMemo)(()=>r===void 0?po(n):void 0,[n,r]),g=l??pc(),b=t===void 0?null:Kn(t),w=b!==null,k=r===void 0&&e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[p,F]=(0,D.useState)(null),[R,Y]=(0,D.useState)(Xn),[H,O]=(0,D.useState)(mo),[M,q]=(0,D.useState)(0),[B,Q]=(0,D.useState)(0),[Fe,T]=(0,D.useState)(0),[S,I]=(0,D.useState)("reading"),[K,U]=(0,D.useState)(!1),[ee,_]=(0,D.useState)(!1),[x,N]=(0,D.useState)(void 0),[P,Z]=(0,D.useState)(!1),[ue,Oe]=(0,D.useState)(!1),rn=(0,D.useRef)(null),ke=(0,D.useRef)(null),le=(0,D.useRef)(void 0),oe=(0,D.useRef)(void 0),W=(0,D.useSyncExternalStore)(u?.subscribe??ic,()=>u===void 0||e===void 0||t===void 0?Pa():u.peek(e,t),Pa),J=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,D.useEffect)(()=>{if(c===void 0){F(null);return}let z=qt({files:c,maxLines:eo});return F(z),()=>z.close()},[c]),(0,D.useEffect)(()=>{if(p===null){Y(Xn);return}return Y(p.getSnapshot()),p.subscribe(()=>Y(p.getSnapshot()))},[p]),(0,D.useEffect)(()=>{p===null||t===void 0||b!==null||p.open(t)},[p,t,b]),(0,D.useEffect)(()=>{if(!w||t===void 0||d===void 0){N(void 0);return}let z=new AbortController,he=!0;return(async()=>{let ce=await d(t,z.signal);he&&!z.signal.aborted&&N(ce?.absolutePath)})(),()=>{he=!1,z.abort()}},[w,t,d]),(0,D.useEffect)(()=>{I("reading"),U(!1),Z(!1)},[t]),(0,D.useEffect)(()=>()=>{le.current!==void 0&&clearTimeout(le.current),oe.current!==void 0&&clearTimeout(oe.current)},[]),(0,D.useEffect)(()=>{W?.conflict!==!0&&(_(!1),Z(!1),oe.current!==void 0&&clearTimeout(oe.current))},[W?.conflict]),(0,D.useEffect)(()=>g.subscribe(()=>q(z=>z+1)),[g]),(0,D.useEffect)(()=>{if(t===void 0||r!==void 0){O(mo);return}let z=ya(g,{path:t});if(z===void 0){O(mo);return}let{contribution:he}=z,ce=!0;return O(Be=>Be.status==="ready"&&Be.contribution.id===he.id?Be:{status:"loading",contribution:he}),z.module.then(Be=>{ce&&O({status:"ready",contribution:he,module:Be})},Be=>{ce&&O({status:"failed",contribution:he,failure:yn(Be)})}),()=>{ce=!1}},[g,t,r,M,B]),t===void 0)return(0,E.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,E.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,E.jsx)("strong",{children:i("preview.empty.title")}),(0,E.jsx)("span",{children:i("preview.empty.description")})]})});let Re=w&&r!==void 0,We=Ut(R),ge=R.linkPath??t,Se=w?x:R.linkTarget,Ze=!w&&Zn(t),Ke=w?!Re&&k!==null&&H.status!=="ready"&&H.status!=="failed":R.status==="loading",on=R.status==="ready",He=Ze&&S==="reading",st=w?Re||k===null?"unavailable":H.status==="failed"?"failed":H.status==="ready"?"ready":"loading":R.status,An=H.status==="ready"?H.module.renderer??H.contribution.id:w?"pending":He?"fallback":"plain",be=(0,D.useMemo)(()=>fa(()=>rn.current),[]),an=(0,D.useMemo)(()=>()=>ke.current??be,[be]),Te=(0,D.useMemo)(()=>({register:z=>{ke.current=z===null?null:ua(z),T(he=>he+1)}}),[]),$=[ge,String(S),R.offset,R.text.length,An,String(Fe)].join("|"),Me=!w&&on,Dn={path:Se??t,sessionId:e,files:n,t:i,visible:a,mode:S,...w?{}:{page:{text:R.text,offset:R.offset}},...d===void 0?{}:{locate:d},find:Te},sn=()=>{gn(Se??ge).then(z=>{z&&(U(!0),le.current!==void 0&&clearTimeout(le.current),le.current=setTimeout(()=>U(!1),1400))})},On=()=>{let z=J?.copyDraft();z!==void 0&&gn(z).then(he=>{he&&(_(!0),oe.current!==void 0&&clearTimeout(oe.current),oe.current=setTimeout(()=>_(!1),1400))})},Ge=W?.error,mr=Ge!=null&&W?.conflict!==!0,fe=W?.conflict===!0,Je=W?.discarded??null,bn=!fe&&Je!==null&&W?.dirty!==!0&&Je!==W?.text,ze;if(w){let z=H.status==="ready"?H.module.Body:void 0;ze=Re?(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,E.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,E.jsx)("span",{children:i("preview.commitBinary.description")})]}):k===null?(0,E.jsx)(go,{t:i,revision:r}):H.status==="failed"?(0,E.jsx)(so,{failure:H.failure,t:i,onRetry:()=>Q(he=>he+1)}):z===void 0?(0,E.jsx)(lo,{t:i}):(0,E.jsx)(z,{...Dn})}else if(c===void 0)ze=(0,E.jsx)(go,{t:i,revision:r});else if(R.status==="failed")ze=(0,E.jsx)(so,{failure:R.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{p?.retry()}});else if(!on)ze=(0,E.jsx)(lo,{t:i});else{let z=H.status==="ready"?H.module.Body:dc;ze=(0,E.jsx)(z,{...Dn})}return(0,E.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":st,"data-mode":w?"binary":He?"reading":"code","data-renderer":An,children:[(0,E.jsxs)("header",{className:"fx-preview-bar",children:[(0,E.jsxs)("span",{className:"fx-preview-path",title:Se===void 0?ge:`${ge} \u2192 ${Se}`,"data-testid":"fs-preview-path",...Se===void 0?{}:{"data-link":"followed"},children:[ge,Se===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",Se]})]}),w?null:(0,E.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[We.range,We.range==="\u2014"?null:(0,E.jsxs)(E.Fragment,{children:[" ",i("preview.lines")]}),We.total===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-total",children:[" / ",We.total," ",i("preview.lines")]})]}),(0,E.jsxs)("div",{className:"fx-preview-actions",children:[W===void 0?null:(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!W.dirty||W.saving||W.status!=="ready",onClick:()=>{J?.save()},children:W.saving?i("preview.saving"):i("preview.save")}),Ze?(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>I(z=>z==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(S==="reading"?"preview.source":"preview.reading")}):null,w?null:(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!on||Ke||R.offset<=1,onClick:()=>{p?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!on||Ke||R.eof,onClick:()=>{p?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),Me?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":ue?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":ue,onClick:()=>Oe(z=>!z),children:i("preview.find")}):null,(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:sn,"data-testid":"fs-preview-copy",children:i(K?"preview.copied":"preview.copyPath")}),Ke?(0,E.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),ue&&Me?(0,E.jsx)(pa,{t:i,surface:an,stamp:$,onClose:()=>Oe(!1)}):null,R.source==="first-parent"?(0,E.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,fe||bn?(0,E.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":fe?"conflict":"discarded",children:[(0,E.jsx)("strong",{children:i(fe?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,E.jsx)("span",{className:"fx-conflict-hint",children:i(fe?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,E.jsx)("span",{className:"fx-spacer"}),fe?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":P?"discard":void 0,onClick:()=>{if(!P&&W?.dirty===!0){Z(!0);return}Z(!1),J?.reload({force:!0})},children:i(P?"preview.conflict.discard":"preview.conflict.reload")}):null,bn?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Je!==null&&J?.setDraft(Je)},children:i("preview.conflict.restore")}):null,fe?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:On,children:i(ee?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,mr?(0,E.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",xo(Ge?.code??"io-error",Ge?.message??"",i))}):null,(0,E.jsx)("div",{className:"fx-preview-body","data-scroll":He?"y":"none",ref:rn,children:ze})]})}var Ma="dsh-fs-explorer-styles",mc=`
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
`;function Na(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Ma}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Ma,t.textContent=mc,e.head.appendChild(t),()=>{t.remove()}}var Ia="lionad.fs",yc="@";function bo(e){let n=e.replace(/\\/gu,"/").trim();for(;n.startsWith("./");)n=n.slice(2);return n.replace(/^\/+/u,"").replace(/\/+$/u,"")}function tr(e){let n=bo(e);if(n==="")return"";let t=n.lastIndexOf("/");return t<0?n:n.slice(t+1)}function vo(e){let n=e.kind==="directory"?"/":"";return`@${e.path}${n}`}function La(e,n,t){let r=bo(e),o=n.trim()===""?tr(r):n.trim(),i={path:r,label:o,kind:t},a=vo(i);return{kind:t==="directory"?"fs.directory":"fs.file",path:r,label:o,clipboardText:a,modelText:a,ref:JSON.stringify(i)}}function wo(e){let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(!(typeof t.path!="string"||t.path===""))return{path:t.path,label:typeof t.label=="string"?t.label:tr(t.path),kind:t.kind==="directory"?"directory":"file"}}function gc(e){let n=wo(e);return n===void 0?`@${e}`:vo(n)}function hc(e){let n=wo(e);return n===void 0?`@${e}`:vo(n)}function Ba(e,n){let t={source:Ia,ref:n.ref,label:n.label,clipboardText:n.clipboardText,appearance:n.kind==="fs.directory"?"folder":"file"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(t,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(t,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(n.clipboardText,r)?"text":"failed"}function Ro(e){if(e===void 0||!e.session)return"noSession";if(!e.insertReference)return"noReference";if(!e.source)return"noReferenceSource"}function Aa(e){if(e===null||typeof e!="object")return{};let n=e,t=n.views,r=t?.open,o=n.openView,i=n.viewFocus,a=i?.request,l=i?.take,u=n.openViewOrSwitch,d=n.currentSessionId;return{openView:typeof r=="function"?(c,f,g)=>r.call(t,c,f,g):typeof o=="function"?(c,f,g)=>o.call(n,f,g):void 0,requestFocus:typeof a=="function"?(c,f)=>{a.call(i,c,f)}:void 0,takeFocus:typeof l=="function"?c=>{l.call(i,c)}:void 0,openViewOrSwitch:typeof u=="function"?(c,f)=>u.call(n,c,f):void 0,currentSessionId:typeof d=="function"?()=>d.call(n):void 0}}function xc(e){if(e===null||typeof e!="object")return;let n=e;if(typeof n.id=="string"&&n.id!=="")return n.id;if(typeof n.sessionId=="string"&&n.sessionId!=="")return n.sessionId}function kc(e,n,t){let r=wo(t);if(r===void 0)return!1;let o=bo(r.path);if(o===""||n===void 0||n==="")return!1;let i=e.currentSessionId?.();if(i!==void 0&&i!==n)return!1;let a=`reveal:${o}`;return e.openView?.(n,te,a)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(te,a),e.openViewOrSwitch?.(te)?.opened===!0?!0:(e.takeFocus?.(te),!1)):e.openViewOrSwitch?.(te,a)?.focused===!0}function bc(e=()=>({})){return{trigger:yc,name:Ia,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:gc,async serialize(n){return hc(n)}},openReference(n,t){let r=t!==null&&typeof t=="object"?t.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=xc(n)??o.currentSessionId?.();return kc(o,i,r)}catch{return!1}}}}function vc(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function Da(e,n){let t=bc(n),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],a=>{a.effect(()=>(r=a.inputTriggers.registerSource(t),o),"dsh-fs-explorer: reference source")}),i}catch{}try{let a=e.get?.("inputTriggers");if(vc(a))return r=a.registerSource(t),i}catch{}return i}var y=require("react");var re={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark",reference:"reference.input"},Xe={close:"tab.close",closeOthers:"tab.close.others",closeRight:"tab.close.right",reference:re.reference};function Oa(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function wc(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function Wa(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,u=[{id:re.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:re.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let d=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,c={id:re.reveal,label:n(wc(o?.fileManager??null)),...d?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:re.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},g={id:re.copyRelative,label:n("menu.copy.relative")},b=Ro(e.inputTarget),w={id:re.reference,label:n("menu.reference"),...b===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${b}`)}},k=e.remoteLinks,p=k!==void 0&&k.length>0?{id:re.copyRemote,label:n("menu.copy.remote"),submenu:k.map(F=>({id:F.id,label:F.label}))}:{id:re.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,c,{id:"menu.copy",label:n("menu.copy"),submenu:[f,g]},p,w,{id:re.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}function Rc(e){if(e.revision!==void 0)return"revision";if(e.absolute)return"absolute"}function za(e,n){let t=e.panels.findIndex(u=>u.key===e.key);if(t<0)return[];let r=e.panels[t],o=Rc(r),i=Ro(e.inputTarget),a=o??i;return[{id:Xe.reference,label:n("menu.reference"),...a===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${a}`)}},{id:Xe.close,label:n("menu.tab.close")},{id:Xe.closeOthers,label:n("menu.tab.closeOthers"),...e.panels.length>1?{}:{disabled:!0,reason:n("menu.tab.closeOthers.reason")}},...t===e.panels.length-1?[]:[{id:Xe.closeRight,label:n("menu.tab.closeRight")}]]}var je=require("react");var Ee=require("react/jsx-runtime");function Sc(e){return new DOMRect(e.x,e.y,0,0)}function $a(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Ee.jsxs)(Ee.Fragment,{children:[e.label,(0,Ee.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function So({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=Yt();if(i.Menu!==void 0){let a=i.Menu;return(0,Ee.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:$a(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:$a(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>Sc(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Ee.jsx)(Tc,{entries:e,anchor:n,onSelect:t,onClose:r})}function Tc({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,je.useRef)(null),[i,a]=(0,je.useState)(null),[l,u]=(0,je.useState)({left:n.x,top:n.y});(0,je.useEffect)(()=>{let c=o.current;if(c===null)return;let f=8,g=c.offsetWidth,b=c.offsetHeight,w=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-g-f)),k=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-b-f));u({left:w,top:k})},[n.x,n.y]),(0,je.useEffect)(()=>{let c=g=>{g.target instanceof Node&&o.current?.contains(g.target)!==!0&&r()},f=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),r())};return document.addEventListener("pointerdown",c),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",c),document.removeEventListener("keydown",f,!0)}},[r]);let d=(0,je.useCallback)(c=>{if(c.disabled!==!0){if(c.submenu!==void 0){a(f=>f===c.id?null:c.id);return}t(c.id)}},[t]);return(0,Ee.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:c=>c.preventDefault(),children:e.map(c=>(0,Ee.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Ee.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":c.id,disabled:c.disabled===!0&&c.reason===void 0,"aria-disabled":c.disabled===!0?!0:void 0,"aria-haspopup":c.submenu===void 0?void 0:"menu","aria-expanded":c.submenu===void 0?void 0:i===c.id,title:c.disabled===!0?c.reason:void 0,onClick:()=>d(c),children:c.label}),c.submenu===void 0||i!==c.id?null:(0,Ee.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:c.submenu.map(f=>(0,Ee.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>d(f),children:f.label},f.id))})]},c.id))})}var ye=require("react"),G=require("react/jsx-runtime"),Cc=120,To=280,rr=8;function or(e){let n=typeof window>"u"?e:window.innerWidth-To;return Math.max(rr,Math.min(e,Math.max(rr,n)))}function Pc(e,n){if(e===void 0)return{left:rr,top:rr};if(n<=1)return{left:or(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+To<=window.innerWidth;return{left:or(r?t:e.left-To-4),top:e.top}}function ja(){return(0,G.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,G.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function _a({node:e,t:n,onOpen:t}){return(0,G.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,G.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function Ka({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:u}){let[d,c]=(0,ye.useState)([]),f=(0,ye.useRef)(null),[g,b]=(0,ye.useState)(null),[w,k]=(0,ye.useState)(null),p=(0,ye.useCallback)(()=>{f.current!==null&&(clearTimeout(f.current),f.current=null)},[]),F=(0,ye.useCallback)(()=>{p(),c([])},[p]),R=(0,ye.useCallback)(()=>{p(),f.current=setTimeout(()=>{f.current=null,c([])},Cc)},[p]);(0,ye.useEffect)(()=>()=>{f.current!==null&&clearTimeout(f.current)},[]),(0,ye.useEffect)(()=>{if(d.length===0||typeof document>"u")return;let T=S=>{S.key!=="Escape"||S.isComposing||(S.preventDefault(),S.stopPropagation(),F())};return document.addEventListener("keydown",T,!0),()=>document.removeEventListener("keydown",T,!0)},[F,d.length]);let Y=(0,ye.useCallback)((T,S,I)=>{p();let{left:K,top:U}=Pc(I?.getBoundingClientRect(),S);c(ee=>{let _=ee.slice(0,S);return _.length===S&&_[S-1]?.groupId===T?ee:[..._,{groupId:T,left:K,top:U,depth:S}]})},[p]),H=(0,ye.useCallback)(T=>{F(),T.kind==="file"?t(T.path):T.kind==="folder"&&r(T.path)},[F,t,r]),O=T=>{let S,I=K=>{for(let U of K)U.kind==="group"&&(U.id===T&&(S=U),I(U.children))};return I(e.roots),S},M=T=>{let S=(I,K)=>{if(I.some(U=>U.id===T))return{parentId:K,siblings:I};for(let U of I){if(U.kind!=="group")continue;let ee=S(U.children,U.id);if(ee!==void 0)return ee}};return S(e.roots,null)??{parentId:null,siblings:[]}},q=(T,S)=>{let I=S?.getBoundingClientRect(),{parentId:K,siblings:U}=M(T.id);b({node:T,parentId:K,siblings:U,left:or(I?.left??0),top:(I?.bottom??0)+4})},B=(T,S)=>{let{parentId:I,siblings:K}=M(T.id);b({node:T,parentId:I,siblings:K,left:or(S.clientX),top:S.clientY})},Q=(T,S)=>{let{parentId:I,siblings:K}=M(T.id),U=K.map(P=>P.id),ee=U.indexOf(T.id),_=ee+S;if(ee<0||_<0||_>=U.length)return;let x=[...U],[N]=x.splice(ee,1);N!==void 0&&(x.splice(_,0,N),b(null),u?.(I,x))},Fe=T=>{let S=w;if(k(null),S===null||S===T)return;let I=e.roots.map(x=>x.id),K=I.indexOf(S),U=I.indexOf(T);if(K<0||U<0)return;let ee=[...I],[_]=ee.splice(K,1);_!==void 0&&(ee.splice(U,0,_),u?.(null,ee))};return(0,ye.useEffect)(()=>{if(g===null||typeof document>"u")return;let T=I=>{I.target instanceof Node&&(I.target instanceof Element&&I.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||b(null))},S=I=>{I.key!=="Escape"||I.isComposing||(I.preventDefault(),I.stopPropagation(),b(null))};return document.addEventListener("pointerdown",T),document.addEventListener("keydown",S,!0),()=>{document.removeEventListener("pointerdown",T),document.removeEventListener("keydown",S,!0)}},[g]),(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,G.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(T=>(0,G.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":w===T.id?"true":void 0,draggable:!0,onDragStart:()=>k(T.id),onDragEnd:()=>k(null),onDragOver:S=>S.preventDefault(),onDrop:S=>{S.preventDefault(),Fe(T.id)},children:[T.kind==="group"?(0,G.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":d.some(S=>S.groupId===T.id),title:n("bookmarks.group"),onPointerEnter:S=>Y(T.id,1,S.currentTarget),onFocus:S=>Y(T.id,1,S.currentTarget),onPointerLeave:R,onContextMenu:S=>{S.preventDefault(),S.stopPropagation(),B(T,S)},children:[(0,G.jsx)("span",{className:"fx-bookmark-name",children:T.name}),(0,G.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,G.jsx)(ja,{})})]}):(0,G.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":T.kind,title:T.path,onClick:()=>H(T),onContextMenu:S=>{S.preventDefault(),S.stopPropagation(),B(T,S)},children:(0,G.jsx)("span",{className:"fx-bookmark-name",children:T.name})}),(0,G.jsx)(_a,{node:T,t:n,onOpen:q})]},T.id))}),g===null?null:(0,G.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:g.left,top:g.top},children:[(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{b(null),i?.(g.node)},children:n("bookmarks.rename")}),(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{b(null),a?.(g.node)},children:n("bookmarks.remove")}),(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:g.siblings[0]?.id===g.node.id,onClick:()=>Q(g.node,-1),children:n("bookmarks.moveUp")}),(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:g.siblings[g.siblings.length-1]?.id===g.node.id,onClick:()=>Q(g.node,1),children:n("bookmarks.moveDown")}),(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{b(null),l?.(g.node)},children:n("bookmarks.moveToGroup")})]}),d.map(T=>{let S=O(T.groupId);return S===void 0?null:(0,G.jsxs)("div",{className:T.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":T.depth,role:"menu","aria-label":S.name,style:{left:T.left,top:T.top},onPointerEnter:p,onPointerLeave:R,children:[S.children.length===0?null:S.children.map(I=>(0,G.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[I.kind==="group"?(0,G.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":d.some(K=>K.groupId===I.id),onPointerEnter:K=>Y(I.id,T.depth+1,K.currentTarget),onFocus:K=>Y(I.id,T.depth+1,K.currentTarget),onContextMenu:K=>{K.preventDefault(),K.stopPropagation(),B(I,K)},children:[(0,G.jsx)("span",{className:"fx-bookmark-name",children:I.name}),(0,G.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,G.jsx)(ja,{})})]}):(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":I.kind,role:"menuitem",title:I.path,onClick:()=>H(I),onContextMenu:K=>{K.preventDefault(),K.stopPropagation(),B(I,K)},children:(0,G.jsx)("span",{className:"fx-bookmark-name",children:I.name})}),(0,G.jsx)(_a,{node:I,t:n,onOpen:q})]},I.id)),(0,G.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(F(),o(S.id))},children:n("bookmarks.newGroup")})]},S.id)})]})}var Ae=require("react");var Ec="dsh_fs_explorer",Fc="bookmarks";function Ie(e){throw new Error(`bookmarks: ${e}`)}function Ha(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function ir(e,n,t){typeof e!="string"&&Ie(`${n} must be a string`);let r=e.trim();return r===""&&Ie(`${n} must not be empty`),r.length>t&&Ie(`${n} must be at most ${String(t)} characters`),r}function Ga(e,n,t,r){t>32&&Ie(`${n} is nested deeper than ${String(32)} levels`),Ha(e)||Ie(`${n} must be an object`);let o=ir(e.id,`${n}.id`,200);r.has(o)&&Ie(`duplicate id "${o}" at ${n}`),r.add(o);let i=ir(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Ie(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let u=e.children;return Array.isArray(u)||Ie(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((d,c)=>Ga(d,`${n}.children[${String(c)}]`,t+1,r))}}if(l==="file"||l==="folder"){let u=ir(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:u}}return Ie(`${n}.kind must be "group", "file" or "folder"`)}function Ln(e){Ha(e)||Ie("a bookmark tree must be an object"),e.version!==1&&Ie(`version must be 1, received ${JSON.stringify(e.version)}`);let n=ir(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Ie("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>Ga(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var jf={name:Ec,version:1,invalidRecords:"backup-and-skip",tables:{[Fc]:{valueSchema:{parse:Ln}}}};function de(e){throw new Error(`bookmarks: ${e}`)}function hn(e){return{version:1,roots:[],updatedAt:e}}function et(e,n){let t=n.name.trim();if(t===""&&de("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&de(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function Mc(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function qa(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,qa(r,n+1)),n)}function Ua(e,n){let t=Mc(e,n.id);t!==0&&qa(n,t)>32&&de(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function Co(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&Co(r.children,n,r.id)}function Ye(e,n){let t;return Co(e.roots,r=>{r.id===n&&(t=r)}),t}function Xa(e,n){let t;return Co(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function Ya(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&Ya(t,n))}function Po(e,n){if(n===null)return e.roots;let t=Ye(e,n);return t===void 0&&de(`no group with id "${n}"`),t.kind!=="group"&&de(`"${n}" is not a group`),t.children}function Za(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function Bn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:Bn(r.children,n,t)})}function nt(e,n,t){return{version:1,roots:n,updatedAt:t}}var tt=()=>new Date().toISOString();function rt(e,n,t,r,o=tt){let i=Po(e,n);Ye(e,t.id)!==void 0&&de(`a node with id "${t.id}" already exists`);let a=Za(r,i.length),l=Bn(e.roots,n,d=>[...d.slice(0,a),t,...d.slice(a)]),u=nt(e,l,o());return Ua(u,t),u}function Ja(e,n,t=tt){let r=Ye(e,n);r===void 0&&de(`no node with id "${n}"`);let o=Xa(e,n);o===void 0&&de(`no node with id "${n}"`);let i=Bn(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:nt(e,i,t()),removed:r}}function Qa(e,n,t,r=tt){let o=t.trim();o===""&&de("a node needs a non-empty name"),Ye(e,n)===void 0&&de(`no node with id "${n}"`);let i=a=>a.map(l=>{let u=l.id===n?{...l,name:o}:l;return u.kind==="group"?{...u,children:i(u.children)}:u});return nt(e,i(e.roots),r())}function es(e,n,t,r,o=tt){let i=Ye(e,n);i===void 0&&de(`no node with id "${n}"`);let a=Xa(e,n);if(a===void 0&&de(`no node with id "${n}"`),t!==null){let g=Ye(e,t);g===void 0&&de(`no group with id "${t}"`),g.kind!=="group"&&de(`"${t}" is not a group`),i.kind==="group"&&Ya(i,t)&&de(`cannot move "${n}" into itself or its own descendant`)}let l=Bn(e.roots,a,g=>g.filter(b=>b.id!==n)),u=Po({version:1,roots:l,updatedAt:e.updatedAt},t),d=Za(r,u.length),c=Bn(l,t,g=>[...g.slice(0,d),i,...g.slice(d)]),f=nt(e,c,o());return Ua(f,i),f}function ns(e,n,t,r=tt){let o=Po(e,n),i=new Set(o.map(d=>d.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&de(`the new order must name each of the ${String(o.length)} children exactly once`);for(let d of t)i.has(d)||de(`"${d}" is not a child of ${n??"the root"}`);let l=new Map(o.map(d=>[d.id,d])),u=Bn(e.roots,n,()=>t.map(d=>{let c=l.get(d);return c===void 0&&de(`"${d}" is not a child of ${n??"the root"}`),c}));return nt(e,u,r())}var _e=require("react");var Le=require("react/jsx-runtime"),Nc=200;function Ic(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>Nc?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function Lc(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function ot({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:u,submitKey:d}){let[c,f]=(0,_e.useState)(()=>l??Lc(e)),[g,b]=(0,_e.useState)(void 0),w=(0,_e.useRef)(null),k=Yt();(0,_e.useEffect)(()=>{l!==void 0&&(f(l),b(void 0))},[l]),(0,_e.useEffect)(()=>{let O=w.current;O!==null&&(O.focus(),O.select())},[]);let p=(0,_e.useCallback)(()=>{if(a)return;let O=Ic(c,e);if(!O.ok){b(t(`prompt.error.${O.reason}`));return}b(void 0),r(O.name)},[a,e,r,t,c]),F=O=>{if(!O.nativeEvent.isComposing){if(O.key==="Escape"){O.preventDefault(),O.stopPropagation(),o();return}O.key==="Enter"&&(O.preventDefault(),p())}},R=g??i,Y=k.Input,H=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Le.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(H),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:F,children:[(0,Le.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Le.jsx)("strong",{children:t(H)}),(0,Le.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),Y===void 0?(0,Le.jsx)("input",{ref:w,className:"fx-name-input",type:"text",value:c,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":R===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:O=>{f(O.target.value),b(void 0)}}):(0,Le.jsx)(Y,{ref:w,className:"fx-name-input",value:c,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":R===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:O=>{f(O.target.value),b(void 0)}}),R===void 0?null:(0,Le.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:R}),(0,Le.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Le.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Le.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:p,children:t(d??"prompt.submit")})]})]})}var ie=require("react/jsx-runtime");function ts(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function Bc(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function rs({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,u]=(0,Ae.useState)(null),[d,c]=(0,Ae.useState)(e),[f,g]=(0,Ae.useState)(!1),[b,w]=(0,Ae.useState)(void 0),k=(0,Ae.useRef)(null);(0,Ae.useEffect)(()=>{let M=B=>{B.target instanceof Node&&k.current?.contains(B.target)!==!0&&a()},q=B=>{B.key!=="Escape"||B.isComposing||f||(B.preventDefault(),B.stopPropagation(),a())};return document.addEventListener("pointerdown",M),document.addEventListener("keydown",q,!0),()=>{document.removeEventListener("pointerdown",M),document.removeEventListener("keydown",q,!0)}},[f,a]);let p=()=>(l===null?d.roots:Ye(d,l)?.kind==="group"?Ye(d,l).children:[]).filter(q=>q.kind==="group"),F=(0,Ae.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(es(d,o.id,l));return}if(n===void 0)return;let M=et(n.kind==="directory"?"folder":"file",{id:ts(),name:n.name,path:n.path,createdAt:Date.now()});i(rt(d,l,M))}catch(M){w(M instanceof Error?M.message:String(M))}},[l,d,r,o,i,n]),R=M=>{try{let q=et("group",{id:ts(),name:M,createdAt:Date.now()}),B=rt(d,l,q);c(B),g(!1),w(void 0),u(q.id)}catch(q){w(q instanceof Error?q.message:String(q))}},Y=Bc(d,l),H=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),O=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,ie.jsxs)("div",{ref:k,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":H,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,ie.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,ie.jsx)("strong",{children:H}),r==="add"&&n!==void 0?(0,ie.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,ie.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,ie.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,ie.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),Y.map(M=>(0,ie.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(M.id),children:M.name},M.id))]}),(0,ie.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:p().length===0?(0,ie.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):p().map(M=>(0,ie.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(M.id),children:(0,ie.jsx)("span",{className:"fx-bookmark-name",children:M.name})},M.id))}),b===void 0?null:(0,ie.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:b}),f?(0,ie.jsx)(ot,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:R,onCancel:()=>g(!1)}):(0,ie.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,ie.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>g(!0),children:t("bookmarks.newGroup")}),(0,ie.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:F,children:O})]})]})}function Eo(e){return`dsh-fs-explorer.bookmarks.${e}`}function Fo(e){return`${Eo(e)}.pending`}function ar(){try{return globalThis.localStorage??void 0}catch{return}}function os(e){let n=ar();if(n===void 0)return;let t;try{t=n.getItem(Eo(e))}catch{return}if(t!==null)try{return Ln(JSON.parse(t))}catch{return}}function Ac(e,n){let t=ar();if(t!==void 0)try{t.setItem(Eo(e),JSON.stringify(n)),t.setItem(Fo(e),"1")}catch{}}function Dc(e){let n=ar();if(n===void 0)return!1;try{return n.getItem(Fo(e))==="1"}catch{return!1}}function is(e){let n=ar();if(n!==void 0)try{n.removeItem(Fo(e))}catch{}}function as(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(is(n),r.tree):Dc(n)?os(n)??hn(new Date().toISOString()):hn(new Date().toISOString())}catch{}return os(n)??hn(new Date().toISOString())},async save(n,t){let r=Ln(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){is(n);return}}catch{}Ac(n,r)}}}var Mo="fs-explorer.treePaneWidth";function No(e){return Math.min(520,Math.max(180,e))}function ds(e){if(e==null)return null;let n;try{n=e.getItem(Mo)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function sr(e,n){let t=Math.round(No(n));if(e!=null)try{e.setItem(Mo,String(t))}catch{}return t}function ls(e){if(e!=null)try{e.removeItem(Mo)}catch{}}function cs(e,n){return Math.round(e)===Math.round(n)}var ss=16;function us(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-ss};case"ArrowRight":return{kind:"nudge",delta:ss};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var X=require("react");function ps(e,n,t,r=800){return t-n<=r?e:""}function ms(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function ys(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Oc(e,t+1,r.depth,r.depth+1)}function Oc(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Wc=/^.$/u;function gs(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Wc.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=fs(e.names,n),l=a.find(u=>u>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=fs(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function fs(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var A=require("react/jsx-runtime"),zc=22;function Io({open:e=!0,size:n=14}){return(0,A.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,A.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,A.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function $c(){return(0,A.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,A.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function hs(){return(0,A.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,A.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,A.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function xs(){return(0,A.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,A.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,A.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function ks(){return(0,A.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,A.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function jc({name:e}){return(0,A.jsx)("span",{className:"fx-badge","data-icon":Cn(e),"aria-hidden":"true",children:Pn(e)})}function _c({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:u}){let d=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,A.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:c,onClick:()=>{l(e.path),d?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,A.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,A.jsx)($c,{})}),d?(0,A.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,A.jsx)(Io,{open:e.expanded})}):(0,A.jsx)(jc,{name:e.name}),(0,A.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,A.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,A.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,A.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":Gn(e.status),"data-testid":"fx-file-status",title:o(Pr(e.status)),"aria-label":o(Pr(e.status)),children:Rt(e.status)}),e.statusCount===void 0?null:(0,A.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,A.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,A.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,A.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,A.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,A.jsx)("span",{className:"fx-size",children:Lt(e.size)})]})}function Kc({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,A.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,A.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,A.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,A.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,A.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Hc(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function bs({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:u,cursorRequest:d,onCursorMove:c}){let f=(0,X.useRef)(null),[g,b]=(0,X.useState)(0),[w,k]=(0,X.useState)(0),p=Ii(zc),[F,R]=(0,X.useState)(void 0),Y=(0,X.useRef)(void 0),H=(0,X.useRef)({query:"",at:0}),O=(0,X.useRef)(void 0),M=(0,X.useRef)(void 0),q=(0,X.useRef)(F);q.current=F;let B=(0,X.useMemo)(()=>e.flatMap((x,N)=>x.type==="entry"?[N]:[]),[e]);(0,X.useEffect)(()=>{let x=M.current!==n;if(M.current=n,O.current!==void 0||n===void 0)return;let N=q.current===void 0?void 0:e[q.current];if(!xi({cursorPath:N?.type==="entry"?N.path:void 0,selectionMoved:x}))return;let P=e.findIndex(Z=>Z.type==="entry"&&Z.path===n);P>=0&&R(P)},[n,e]),(0,X.useEffect)(()=>{let x=O.current;if(x===void 0)return;let N=e.findIndex(ue=>ue.type==="entry"&&ue.path===x),P=e[N];if(P?.type!=="entry"||P.kind!=="directory"||!P.expanded){O.current=void 0;return}let Z=ki(e,x);Z!==void 0&&(O.current=void 0,R(Z))},[e]),(0,X.useEffect)(()=>{F!==void 0&&e[F]?.type!=="entry"&&R(void 0)},[e,F]),(0,X.useEffect)(()=>{let x=f.current;if(F===void 0||x===null)return;let N=Fr({scrollTop:x.scrollTop,viewport:x.clientHeight,rowHeight:p,index:F});N!==x.scrollTop&&(x.scrollTop=N)},[F,p]);let Q=(0,X.useCallback)((x,N=!0)=>{R(x),N&&f.current?.focus({preventScroll:!0})},[]),Fe=(0,X.useRef)(void 0);(0,X.useEffect)(()=>{if(d===void 0||Fe.current===d.nonce)return;let x=B.at(-1);if(d.path!==void 0){let P=e.findIndex(Z=>Z.type==="entry"&&Z.path===d.path);Fe.current=d.nonce,P>=0&&Q(P,d.focus);return}if(d.delta===void 0){Fe.current=d.nonce;return}if(Fe.current=d.nonce,F===void 0){let P=d.delta>0?B[0]:x;P!==void 0&&Q(P,d.focus);return}let N=d.delta>0?B.find(P=>P>F):[...B].reverse().find(P=>P<F);N!==void 0&&Q(N,d.focus)},[d,F,B,Q,e]),(0,X.useEffect)(()=>{if(c===void 0)return;let x=F===void 0?void 0:e[F];c(x?.type==="entry"?x.path:void 0)},[F,e,c]);let T=(0,X.useCallback)(x=>{let N=e.findIndex(P=>P.type==="entry"&&P.path===x);N>=0&&R(N)},[e]),S=(0,X.useCallback)((x,N,P)=>{T(x.path),u(x,N,P)},[T,u]),I=(0,X.useCallback)(x=>{x.preventDefault(),u(void 0,{x:x.clientX,y:x.clientY},x.currentTarget)},[u]),K=(0,X.useCallback)(x=>{if(x.nativeEvent.isComposing||x.altKey||x.metaKey||x.ctrlKey)return;let N=B.at(-1);if(x.key==="ArrowDown"){if(x.preventDefault(),F===void 0){B[0]!==void 0&&Q(B[0]);return}let W=B.find(J=>J>F);W!==void 0&&Q(W);return}if(x.key==="ArrowUp"){if(x.preventDefault(),F===void 0){N!==void 0&&Q(N);return}let W=[...B].reverse().find(J=>J<F);W!==void 0&&Q(W);return}if(F===void 0)return;let P=e[F];if(P===void 0||P.type!=="entry")return;if(x.key==="ArrowRight"){if(x.preventDefault(),P.kind==="directory"&&!P.expanded)O.current=P.path,o(P.path);else{let W=B.find(J=>J>F);W!==void 0&&e[W]?.depth===P.depth+1&&Q(W)}return}if(x.key==="ArrowLeft"){if(x.preventDefault(),P.kind==="directory"&&P.expanded)o(P.path);else{let W=[...B].reverse().find(J=>J<F&&e[J]?.type==="entry"&&e[J].depth<P.depth);W!==void 0&&Q(W)}return}if(x.key==="Enter"&&P.kind!=="directory"){x.preventDefault(),i(P.path);return}if(x.key==="ContextMenu"||x.key==="F10"&&x.shiftKey){x.preventDefault();let W=f.current?.getBoundingClientRect(),J=W===void 0?0:W.top+F*p-(f.current?.scrollTop??0);S(P,{x:W?.left??0,y:J+p},f.current??void 0);return}if(x.key==="Home"){x.preventDefault(),B[0]!==void 0&&Q(B[0]);return}if(x.key==="End"){x.preventDefault(),N!==void 0&&Q(N);return}let Z=Date.now(),ue=ms(e,F),Oe=ys(e,ue),rn=Oe.map(W=>{let J=e[W];return J?.type==="entry"?J.name:""}),ke=gs({query:ps(H.current.query,H.current.at,Z),key:x.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:x.nativeEvent.repeat,names:rn,active:F===void 0?-1:Oe.indexOf(F)});if(ke.kind==="clear"){H.current={query:"",at:0};return}if(ke.kind!=="jump")return;let le=Oe[ke.index];if(le===void 0)return;let oe=e[le];oe?.type==="entry"&&(H.current={query:ke.query,at:Z},x.preventDefault(),Q(le),oe.kind!=="directory"&&i(oe.path))},[F,B,Q,o,i,S,p,e]);(0,X.useEffect)(()=>{let x=f.current;if(x===null)return;let N=()=>k(x.clientHeight);if(N(),typeof ResizeObserver>"u")return;let P=new ResizeObserver(N);return P.observe(x),()=>P.disconnect()},[]),(0,X.useEffect)(()=>{if(n===void 0)return;let x=f.current;if(x===null)return;let N=e.findIndex(Z=>Z.type==="entry"&&Z.path===n);if(N<0)return;let P=N*p;(P<x.scrollTop||P+p>x.scrollTop+x.clientHeight)&&(x.scrollTop=Math.max(0,P-x.clientHeight/2))},[n,e,p]),(0,X.useEffect)(()=>{if(t===void 0||Y.current===t)return;let x=f.current;if(x===null)return;let N=t.path===void 0?-1:e.findIndex(P=>P.type==="entry"&&P.path===t.path);if(!(t.path!==void 0&&N<0)){if(Y.current=t,N>=0){let P=Fr({scrollTop:x.scrollTop,viewport:x.clientHeight===0?480:x.clientHeight,rowHeight:p,index:N});P!==x.scrollTop&&(x.scrollTop=P,b(P)),R(N)}Hc(x),l?.()}},[t,e,l,p]);let U=x=>{b(x.currentTarget.scrollTop)},ee=Et(e,{scrollTop:g,height:w===0?480:w,rowHeight:p}),_={"--fx-row-h":`${String(p)}px`};return(0,A.jsx)("div",{className:"fx-scroll",ref:f,style:_,onScroll:U,onKeyDown:K,onContextMenu:I,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,A.jsx)("div",{className:"fx-vlist",style:{height:e.length*p},children:ee.rows.map((x,N)=>{let P=(ee.startIndex+N)*p;return x.type==="entry"?(0,A.jsx)(_c,{row:x,top:P,selected:x.path===n,cursor:F===ee.startIndex+N,t:r,onToggle:o,onSelect:i,onRowActivate:T,onContextMenu:(Z,ue)=>S(Z,{x:ue.clientX,y:ue.clientY},ue.currentTarget instanceof HTMLElement?ue.currentTarget:void 0)},x.path):(0,A.jsx)(Kc,{row:x,top:P,t:r,onRetry:a},x.key)})})})}var it=require("react"),tn=require("react/jsx-runtime");function vs({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:u,focusSignal:d}){let c=(0,it.useRef)(null),f=(0,it.useRef)(d);(0,it.useEffect)(()=>{f.current!==d&&(f.current=d,c.current?.focus())},[d]);let g=w=>{if(!w.nativeEvent.isComposing){if(w.key==="Escape"){w.preventDefault(),w.stopPropagation(),u();return}if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault(),a(w.key==="ArrowDown"?1:-1);return}w.key==="Enter"&&(w.preventDefault(),l())}},b=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,tn.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:g,children:[(0,tn.jsx)("input",{ref:c,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:w=>i(w.currentTarget.value)}),b===null?null:(0,tn.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[b,o?(0,tn.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,tn.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,tn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:u,children:"\xD7"})]})}function De(e){return e!==null&&typeof e=="object"}function dr(e){try{return e()}catch{return}}function Gc(e){let n=dr(()=>typeof e.get=="function"?e.get("connection"):void 0),t=De(n)?n.rpc:void 0;if(!(!De(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${ri}/${r}`,o,i)}function Vc(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function Lo(e){return De(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function qc(e){return()=>{let n=Gc(e);if(n!==void 0)return Vc(n);let t=dr(()=>e.fsExplorerWorkspace);if(Lo(t))return t;let r=dr(()=>De(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Lo(r))return r;let o=dr(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Lo(o))return o}}function xn(e){let n=De(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=De(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return De(t)?t:void 0}var Uc=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function kn(e){let n=De(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:Uc.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function Xc(e){let n=xn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};let t=De(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function Yc(e){let n=xn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};let t=De(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function Zc(e){let n=xn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:{ok:!0}}function Jc(e){let n=xn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function Qc(e){let n=xn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Ln(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function eu(e){let n=xn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:{ok:!0}}function nu(e){let n=xn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};let t=De(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var at={code:"unsupported",message:"the workspace service is unavailable"};function ws(e){let n=qc(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:at});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),Xc),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),Yc),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),Zc),create:(r,o,i,a,l)=>t(u=>{let d=u.create;return typeof d!="function"?{ok:!1,error:at}:d.call(u,{sessionId:r,parent:o,name:i,kind:a},l)},Jc),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:at}:a.call(i,{sessionId:r},o)},Qc),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:at}:l.call(a,{sessionId:r,tree:o},i)},eu),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:at}:a.call(i,{sessionId:r},o)},nu)}}var tu={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function ru(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var ou={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function iu(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",d=Rs(t[2]??"");return d===""?void 0:{base:`https://${u}/${d}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=Rs(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function Rs(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function au(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function su(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return du(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function du(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function lu(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function Ss(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=lu(t,r);if(a===void 0)return[];let l=su(i),u=au(a),d=[],c=new Set;for(let f of n){if(c.has(f.name))continue;let g=iu(f.url);if(g===void 0)continue;c.add(f.name);let b=ru(g.host),w=ou[b][o],k=u===""?"":`/${u}`;d.push({id:`copy.remote.${f.name}`,label:`${f.name} \xB7 ${tu[b]}`,url:`${g.base}/${w}/${l}${k}`})}return d}var C=require("react/jsx-runtime");function cu({open:e}){return(0,C.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,C.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,C.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function uu(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var fu=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ao(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Ps="dsh-fs-explorer.show-ignored";function pu(e){if(e==null)return!0;try{return e.getItem(Ps)!=="0"}catch{return!0}}function mu(e,n){if(n!=null)try{n.setItem(Ps,e?"1":"0")}catch{}}var yu=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Cs=new Map;function gu(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function lr({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,C.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,C.jsx)("strong",{children:e}),n===void 0?null:(0,C.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function hu(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Es({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:u,workspace:d,fileReferences:c,reference:f,referenceSourceAvailable:g}){let b=Xi();function w(k){let p=k.sessionId??e.currentSessionId(),F=(0,y.useRef)(p);F.current=p;let R=(0,y.useMemo)(()=>r(),[r]),Y=(0,y.useMemo)(()=>o(),[o]),H=(0,y.useMemo)(()=>i(),[i]),O=(0,y.useMemo)(()=>p===void 0||u===void 0?void 0:u(p),[u,p]),M=(0,y.useMemo)(()=>p===void 0||d===void 0?void 0:d(p),[d,p]),q=(0,y.useMemo)(()=>as(M),[M]),[B,Q]=(0,y.useState)(()=>hn(new Date().toISOString())),Fe=(0,y.useRef)(!1),[T,S]=(0,y.useState)(null),[I,K]=(0,y.useState)(null),U=(0,y.useRef)(!1),ee=(0,y.useRef)(!1),[_,x]=(0,y.useState)(null),[N,P]=(0,y.useState)(null),[Z,ue]=(0,y.useState)(void 0),[Oe,rn]=(0,y.useState)(null),ke=(0,y.useRef)(null),[le,oe]=(0,y.useState)(null),[W,J]=(0,y.useState)(()=>new Map),[Re,We]=(0,y.useState)(void 0),[ge,Se]=(0,y.useState)(void 0),[Ze,Ke]=(0,y.useState)(void 0),[on,He]=(0,y.useState)(void 0),[st,An]=(0,y.useState)(Cs),be=(0,y.useRef)(W);be.current=W;let[an,Te]=(0,y.useState)(()=>new Set),$=(0,y.useMemo)(()=>b.forSession(p),[b,p]),Me=(0,y.useSyncExternalStore)($.subscribe,$.snapshot,$.snapshot),Dn=Me.panels.find(s=>s.key===Me.active),sn=Dn?.path,On=Dn?.revision,[Ge,mr]=(0,y.useState)(0),fe=(0,y.useRef)(new Map),Je=(0,y.useRef)(void 0),[bn,ze]=(0,y.useState)([]),[z,he]=(0,y.useState)(()=>pu(Ao())),[ce,Be]=(0,y.useState)(null),[Ds,Wo]=(0,y.useState)(!1),[Os,vn]=(0,y.useState)(null),dt=(0,y.useRef)(null);dt.current=ce?.path??null;let Qe=(0,y.useMemo)(()=>Ao(),[]),[dn,wn]=(0,y.useState)(()=>ds(Qe)),yr=(0,y.useRef)(null),Rn=(0,y.useRef)(null),ae=W.get(""),lt=ae?.status==="ready",zo=(0,y.useCallback)((s,m,h,v)=>{$.open(s,m,h,v)},[$]),Sn=(0,y.useCallback)(s=>{let m=new Set($.snapshot().panels.map(L=>L.key)),h=[];for(let L of s){if(!m.has(L))continue;if((p===void 0?void 0:l?.peek(p,L))?.dirty===!0){h.push(L);continue}p!==void 0&&l?.forget(p,L),$.close(L)}let v=h[0];vn(null),Be(v===void 0?null:{path:v,rest:h.slice(1)})},[l,p,$]),ln=(0,y.useCallback)(s=>{Be(null),vn(null),s.length>0&&Sn(s)},[Sn]),cn=(0,y.useCallback)(s=>{let m=s??$.snapshot().active??void 0;m!==void 0&&Sn([m])},[Sn,$]);(0,y.useEffect)(()=>{let s=e.registerPageCloser;if(typeof s=="function")return s(()=>{let m=$i({viewSessionId:p,currentSessionId:e.currentSessionId(),activePanel:$.snapshot().active,confirming:dt.current!==null});return m==="close"&&cn(),m!=="pass"})},[cn,p,$,e]);let Ws=(0,y.useCallback)(()=>{let s=ce;if(s===null)return;let m=p===void 0?void 0:l?.find(p,s.path);if(m===void 0){p!==void 0&&l?.forget(p,s.path),$.close(s.path),ln(s.rest);return}Wo(!0),vn(null),m.save().then(h=>{if(Wo(!1),!h.ok){let v=m.getSnapshot().error;vn(t("panel.confirm.failed").replace("{message}",xo(h.code,v?.message??"",t)));return}p!==void 0&&l?.forget(p,s.path),$.close(s.path),ln(s.rest)})},[ln,l,ce,p,$,t]),zs=(0,y.useCallback)(()=>{let s=ce;if(vn(null),s===null){Be(null);return}p!==void 0&&l?.forget(p,s.path),$.close(s.path),ln(s.rest)},[ln,l,ce,p,$]),gr=(0,y.useCallback)(()=>{let s=ce;if(s===null){vn(null);return}ln(s.rest)},[ln,ce]),pe=(0,y.useCallback)(async(s,m,h)=>{fe.current.get(s)?.abort();let v=new AbortController;fe.current.set(s,v),J(L=>new Map(L).set(s,fu()));try{let L=await h.list(m,Ft(s),v.signal);if(v.signal.aborted||F.current!==m)return!1;let j=er(L);if(!j.ok)return J(se=>new Map(se).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:j.message})),!1;let ve=Pt(j.listing.entries);return J(se=>new Map(se).set(s,{status:"ready",nodes:ve,truncated:j.listing.truncated===!0,total:j.listing.entries.length})),!0}catch(L){return v.signal.aborted||J(j=>new Map(j).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:Ta(L)})),!1}finally{fe.current.get(s)===v&&fe.current.delete(s)}},[]);(0,y.useEffect)(()=>{for(let s of fe.current.values())s.abort();return fe.current.clear(),J(new Map),Te(new Set),Je.current=void 0,p!==void 0&&R!==void 0&&pe("",p,R),()=>{for(let s of fe.current.values())s.abort();fe.current.clear()}},[p,R,Ge,pe]),(0,y.useEffect)(()=>{if(p===void 0||Y===void 0){We(void 0),Se(void 0),Ke(void 0),He(void 0);return}let s=!0,m=new AbortController;return We(void 0),Se(void 0),Ke(void 0),He(void 0),Promise.resolve().then(()=>Y.snapshot({sessionId:p,maxCommits:1},m.signal)).then(h=>{if(!s)return;let v=nr(h);if(!v.ok){We(void 0),Se(void 0),Ke(void 0),He(void 0);return}We(ui(wt(v.status),v.stats)),Se(v.head),Ke(v.root),He(v.remotes)}).catch(()=>{s&&(We(void 0),Se(void 0),Ke(void 0),He(void 0))}),()=>{s=!1,m.abort()}},[p,Y,Ge]),(0,y.useEffect)(()=>{let s=R?.read;if(p===void 0||R===void 0||typeof s!="function"||!lt){An(Cs);return}let m=p,h=new AbortController,v=async(j,ve)=>{try{let se=gu(await s.call(R,m,ve,{},h.signal));return se===void 0?void 0:[j,se]}catch{return}},L=yi.filter(j=>j!==".gitmodules").map(j=>v(j,j));return Ze!==void 0&&L.push(v(".gitmodules",`${Ze.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(L).then(j=>{if(h.signal.aborted||F.current!==m)return;let ve=new Map;for(let fn of j)fn!==void 0&&ve.set(fn[0],fn[1]);let se=be.current.get(""),jn=new Set(se?.status==="ready"?se.nodes.filter(fn=>fn.kind==="directory").map(fn=>fn.name):[]);An(Tt(ve,jn))}),()=>h.abort()},[p,R,lt,Ze,Ge]);let[$s,js]=(0,y.useState)(void 0),hr=(0,y.useRef)(void 0),$o=(0,y.useRef)(0),xr=(0,y.useRef)(void 0),jo=(0,y.useRef)(!1),Wn=(0,y.useCallback)((s,m,h)=>{$o.current+=1,js({nonce:$o.current,...s===void 0?{}:{path:s},...m===void 0?{}:{delta:m},focus:h})},[]),Tn=(0,y.useCallback)((s,m)=>{let h=Vi(s);if(Te(v=>{let L=new Set(v);for(let j of h)L.add(j);return L}),!(p===void 0||R===void 0)){for(let v of h)be.current.get(v)===void 0&&pe(v,p,R);m==="directory"&&be.current.get(s)===void 0&&pe(s,p,R)}},[R,pe,p]),_o=(0,y.useCallback)(s=>{let m=Mn(be.current).find(h=>h.path===s);if(Tn(s,m?.kind),m?.kind==="directory"&&Te(h=>new Set(h).add(s)),jo.current=!0,m===void 0){xr.current=s;return}Wn(s,void 0,!0)},[Wn,Tn]),ct=(0,y.useCallback)(s=>{Gt(s,{open:zo,reveal:_o})},[zo,_o]);(0,y.useEffect)(()=>{let s=k.viewRequest;if(s==null||s.view!==te)return;let m=`${s.view}:${s.focus}`;Je.current!==m&&(Je.current=m,ct(s.focus),k.completeViewRequest?.())},[k.viewRequest,k.completeViewRequest,ct]),(0,y.useEffect)(()=>{let s=e.viewFocus;if(s===void 0||p===void 0)return;let m=()=>{let h=s.take(te);h!==void 0&&ct(h)};return m(),s.subscribe(m)},[e,p,ct]),(0,y.useEffect)(()=>{if(sn===void 0||On!==void 0||!lt||Mt(sn))return;let s=qn(sn);if(s.length===0||(Te(h=>s.every(v=>h.has(v))?h:new Set([...h,...s])),p===void 0||R===void 0))return;let m=s.filter(h=>be.current.get(h)?.status!=="ready");m.length!==0&&Promise.all(m.map(h=>pe(h,p,R)))},[sn,On,lt,p,R,pe]);let Ko=(0,y.useCallback)(()=>{if(typeof document>"u")return!1;let s=document.querySelector("[data-composer-input]");return s===null?!1:(s.focus(),!0)},[]),_s=(0,y.useCallback)(s=>{if(s.button!==0||Rn.current!==null||yu())return;let m=yr.current?.previousElementSibling;if(m instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}Rn.current={pointerId:s.pointerId,startX:s.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:dn},document.body.classList.add("fx-pane-resizing")}},[dn]),Ks=(0,y.useCallback)(s=>{let m=Rn.current;m===null||m.pointerId!==s.pointerId||wn(No(m.baseWidth+s.clientX-m.startX))},[]),kr=(0,y.useCallback)(s=>{let m=Rn.current;if(m===null||m.pointerId!==s.pointerId)return;Rn.current=null,document.body.classList.remove("fx-pane-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let h=m.baseWidth+s.clientX-m.startX;if(cs(h,m.baseWidth)){wn(m.restWidth);return}wn(sr(Qe,h))},[Qe]),br=(0,y.useCallback)(()=>{ls(Qe),wn(null)},[Qe]),Hs=(0,y.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let m=us(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(m===null)return;if(s.preventDefault(),s.stopPropagation(),m.kind==="reset"){br();return}if(m.kind==="min"||m.kind==="max"){let L=m.kind==="min"?180:520;wn(sr(Qe,L));return}let h=yr.current?.previousElementSibling,v=h instanceof HTMLElement?h.getBoundingClientRect().width:dn??180;wn(sr(Qe,v+m.delta))},[Qe,br,dn]);(0,y.useEffect)(()=>()=>{Rn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=m=>{if(!(m.isComposing||zi(m.target))){if(hu(m)){let h=$.snapshot().active,v=h===null||l===void 0||p===void 0?void 0:l.find(p,h);if(v===void 0)return;m.preventDefault(),m.stopPropagation(),v.save();return}for(let h of Wt)if(Wi(m,h)){if(h.action==="closePanel"&&$.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),h.action==="nextPanel"?$.next():h.action==="previousPanel"?$.previous():cn();return}}};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[l,cn,p,$]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=$t({focusComposer:Ko,hasModal:()=>dt.current!==null||U.current||ee.current||zt(document)}),m=h=>s(h);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Ko]),(0,y.useEffect)(()=>{if(ce===null||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),gr())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[ce,gr]);let Ho=(0,y.useMemo)(()=>bt(bn),[bn]),ut=(0,y.useMemo)(()=>It(W,an,Re,st,{ignored:Ho,showIgnored:z,hiddenLabel:s=>t("state.hiddenDirectory").replace("{count}",String(s))}),[W,an,Re,st,Ho,z,t]),[en,Go]=(0,y.useState)(""),[Vo,ft]=(0,y.useState)([]),[qo,pt]=(0,y.useState)(null),[Gs,zn]=(0,y.useState)(!1),[Vs,qs]=(0,y.useState)(0),Us=(0,y.useCallback)(()=>qs(s=>s+1),[]);(0,y.useEffect)(()=>{let s=Hi(en);if(s===void 0){ft([]),pt(null),zn(!1);return}let m=()=>{let L=Gi(Mn(be.current),s);ft(Ur(L.map(j=>({path:j.path,kind:j.kind==="directory"?"directory":"file"})),Re)),pt("loaded"),zn(!1)},h=c?.();if(h===void 0||p===void 0){m();return}let v=new AbortController;return zn(!0),Promise.resolve(h.list(p,s,v.signal)).then(L=>{if(v.signal.aborted)return;let j=Ki(L);ft(Ur(j,Re)),pt("index"),zn(!1)},L=>{v.signal.aborted||(console.debug(`[${Ce}] the file index failed, searching listed rows instead`,L),m())}),()=>v.abort()},[en,p,Re,c]);let vr=qo!==null,Xs=vr?Vo:ut;(0,y.useEffect)(()=>{let s=xr.current;if(s===void 0)return;let m=Mn(be.current).find(h=>h.path===s);m!==void 0&&(xr.current=void 0,m.kind==="directory"&&(Tn(s,m.kind),Te(h=>new Set(h).add(s))),Wn(s,void 0,!0))},[ut,Wn,Tn]);let[Ys,mt]=(0,y.useState)(void 0),Uo=(0,y.useRef)(!1);(0,y.useEffect)(()=>{if(Uo.current||typeof document>"u")return;let s=bi({rows:ut,panelCount:$.snapshot().panels.length,hasModal:zt(document)});s.kind!=="skip"&&(Uo.current=!0,!jo.current&&(s.open!==void 0&&$.open(s.open),mt({path:s.focus})))},[ut,$]);let Zs=(0,y.useCallback)(()=>mt(void 0),[]),$n=Re===void 0?void 0:Object.keys(Re).length,Js=Re===void 0?"neutral":Object.values(Re).some(s=>s.status==="conflicted")?"conflict":$n===0?"success":"warning",Xo=ci(ge),Qs=(0,y.useCallback)(s=>{if(p===void 0||R===void 0)return;if(an.has(s)){Te(h=>{let v=new Set(h);return v.delete(s),v});return}Te(h=>new Set(h).add(s));let m=W.get(s);(m===void 0||m.status==="failed")&&pe(s,p,R)},[an,W,p,R,pe]),Yo=(0,y.useCallback)(s=>{p===void 0||R===void 0||pe(s,p,R)},[p,R,pe]);(0,y.useEffect)(()=>{let s=!0;if(Fe.current=!1,p===void 0){Q(hn(new Date().toISOString()));return}return q.load(p).then(m=>{s&&!Fe.current&&Q(m)}).catch(()=>{}),()=>{s=!1}},[q,p]);let ed=(0,y.useCallback)(s=>{let m=[...qn(s),s];if(Te(h=>{let v=new Set(h);for(let L of m)v.add(L);return v}),p!==void 0&&R!==void 0){let h=m.filter(v=>be.current.get(v)?.status!=="ready");h.length>0&&Promise.all(h.map(v=>pe(v,p,R)))}mt({path:s})},[p,R,pe]),nd=(0,y.useCallback)(s=>{$.open(s)},[$]),ne=(0,y.useCallback)((s,m)=>{ke.current!==null&&clearTimeout(ke.current),rn({text:s,tone:m}),ke.current=setTimeout(()=>{ke.current=null,rn(null)},4e3)},[]);(0,y.useEffect)(()=>()=>{ke.current!==null&&clearTimeout(ke.current)},[]);let un=(0,y.useCallback)(s=>{Fe.current=!0,Q(s),p!==void 0&&q.save(p,s).catch(()=>{ne(t("bookmarks.saveFailed"),"error")})},[ne,q,p,t]),td=(0,y.useCallback)(s=>{try{un(Ja(B,s.id).tree),ne(t("bookmarks.removed"),"ok")}catch{}},[ne,B,un,t]),rd=(0,y.useCallback)((s,m)=>{try{un(ns(B,s,m))}catch{}},[B,un]);(0,y.useEffect)(()=>{if(M===void 0){ue(void 0);return}let s=!0;return M.capabilities(p??"").then(m=>{s&&ue(m.ok?m.capabilities:void 0)}),()=>{s=!1}},[M,p]),(0,y.useEffect)(()=>{let s=M?.ignored;if(p===void 0||M===void 0||typeof s!="function"){ze([]);return}let m=new AbortController,h=!0;return Promise.resolve().then(()=>s.call(M,p,m.signal)).then(v=>{h&&ze(v.ok?v.entries:[])}).catch(()=>{h&&ze([])}),()=>{h=!1,m.abort()}},[p,M,Ge]);let od=(0,y.useCallback)(()=>{he(s=>{let m=!s;return mu(m,Ao()),m})},[]),id=(0,y.useCallback)((s,m,h)=>{let v=s===void 0?"":s.kind==="directory"?s.path:Oa(s.path);if(x({row:s,anchor:m,absolutePath:void 0,trigger:h,createParent:v}),s===void 0||M===void 0)return;let L=s.path;M.info(p??"",L).then(j=>{x(ve=>ve===null||ve.row?.path!==L?ve:{...ve,absolutePath:j.ok?j.info.absolutePath:void 0})})},[p,M]),ad=(0,y.useCallback)(()=>x(null),[]),sd=(0,y.useCallback)((s,m,h)=>{P({key:s,anchor:m,trigger:h})},[]),dd=(0,y.useCallback)(()=>P(null),[]),yt=(0,y.useCallback)(()=>{let s=k.inputActions;return p===void 0||s===void 0?void 0:{session:!0,insertReference:typeof f?.(p)?.insertReference=="function",source:g?.()===!0}},[k.inputActions,g,f,p]),gt=(0,y.useCallback)((s,m,h)=>{let v=k.inputActions;if(p===void 0||v===void 0){ne(t("notice.referenceFailed"),"error");return}let L=f?.(p),j=La(s,m,h),ve=Ba({captureSpan:()=>{let se=v.captureInsertion?.();return se===void 0?void 0:{start:se.start,end:se.end,draftRev:se.draftRev}},insertReference:(se,jn)=>L?.insertReference?.(se,jn)??!1,insertText:(se,jn)=>v.insertText?.(se,jn)??!1,canInsertReference:g?.()===!0},j);if(ve==="failed"){ne(t("notice.referenceFailed"),"error"),L?.notify?.("error",t("notice.referenceFailed"));return}L?.focus?.(),ve==="text"&&ne(t("notice.referenced").replace("{name}",j.label),"ok")},[ne,k.inputActions,f,p,t]),ld=(0,y.useCallback)(s=>{let m=N;if(P(null),m===null)return;if(s===Xe.reference){let v=$.snapshot().panels.find(j=>j.key===m.key);if(v===void 0)return;let L=Mn(be.current).find(j=>j.path===v.path);gt(v.path,tr(v.path),L?.kind==="directory"?"directory":"file");return}if(s===Xe.close){cn(m.key);return}let h=s===Xe.closeOthers?"others":s===Xe.closeRight?"right":void 0;h!==void 0&&Sn(Ui($.snapshot().panels,m.key,h))},[Sn,gt,cn,$,N]);U.current=_!==null,ee.current=N!==null;let ht=(0,y.useMemo)(()=>Ss({remotes:on,root:Ze,absolutePath:_?.absolutePath,kind:_?.row?.kind??"file",head:ge}),[_?.absolutePath,_?.row?.kind,Ze,ge,on]),wr=(0,y.useCallback)(s=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${s.code}`)),[t]),cd=(0,y.useCallback)(s=>{let m=_;if(x(null),m===null)return;if(s===re.createFile||s===re.createFolder){let v=m.createParent;if(v===void 0)return;oe({kind:s===re.createFolder?"directory":"file",parent:v,error:void 0,busy:!1});return}let h=m.row;if(h!==void 0){if(s.startsWith(`${re.copyRemote}.`)){let v=ht.find(L=>L.id===s);if(v===void 0)return;gn(v.url).then(L=>{ne(L?t("notice.copiedRemote").replace("{remote}",v.label):t("notice.copyFailed"),L?"ok":"error")});return}if(s===re.copyRelative){gn(h.path).then(v=>{ne(t(v?"notice.copiedRelative":"notice.copyFailed"),v?"ok":"error")});return}if(s===re.copyAbsolute){let v=m.absolutePath;if(v===void 0)return;gn(v).then(L=>{ne(t(L?"notice.copiedAbsolute":"notice.copyFailed"),L?"ok":"error")});return}if(s===re.addBookmark){S({mode:"add",target:{name:h.name,path:h.path,kind:h.kind}});return}if(s===re.reference){gt(h.path,h.name,h.kind);return}if(s===re.reveal){if(M===void 0){ne(wr({code:"unsupported",message:""}),"error");return}M.reveal(p??"",h.path).then(v=>{if(!v.ok){ne(wr(v.error),"error");return}let L=t(`menu.manager.${Z?.fileManager??"directory"}`);ne(t("notice.revealed").replace("{manager}",L),"ok")})}}},[ne,Z,_,gt,ht,wr,p,t,M]),ud=(0,y.useCallback)(s=>{let m=le;if(m===null)return;if(M===void 0||M.create===void 0){oe({...m,error:t("prompt.error.unsupported"),busy:!1});return}let h=p;if(h===void 0){oe({...m,error:t("prompt.error.no-workspace"),busy:!1});return}oe({...m,busy:!0,error:void 0}),M.create(h,m.parent,s,m.kind).then(v=>{if(!v.ok){oe(j=>j===null?j:{...j,busy:!1,error:t(`prompt.error.${v.error.code}`)});return}oe(null);let L=v.path;if(R!==void 0&&pe(m.parent,h,R),m.kind==="file"){$.open(L),ne(t("notice.createdFile"),"ok");return}Te(j=>new Set(j).add(L)),R!==void 0&&pe(L,h,R),mt({path:L}),ne(t("notice.createdFolder"),"ok")})},[ne,R,pe,le,p,$,t,M]),fd=(0,y.useCallback)(()=>oe(null),[]),pd=(0,y.useMemo)(()=>_===null?[]:Wa({row:_.row,notices:{workspace:M!==void 0},capabilities:Z,absolutePath:_.absolutePath,createParent:_.createParent,remoteLinks:_.row===void 0?void 0:ht,bookmarkTarget:_.row===void 0?void 0:{name:_.row.name,path:_.row.path,kind:_.row.kind},inputTarget:yt()},t),[Z,_,yt,ht,t,M]),Zo=(0,y.useMemo)(()=>N===null?[]:za({panels:Me.panels,key:N.key,inputTarget:yt()},t),[Me.panels,yt,t,N]),Rr=(0,y.useCallback)(s=>{let m=Mn(be.current).find(h=>h.path===s);if(Tn(s,m?.kind),m?.kind==="directory"){Te(h=>new Set(h).add(s));return}$.open(s)},[Tn,$]),md=(0,y.useCallback)(()=>{hr.current!==void 0&&Rr(hr.current)},[Rr]),xt=(0,y.useCallback)(()=>{Go(""),ft([]),pt(null),zn(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,y.useEffect)(()=>{if(en===""||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||m.defaultPrevented||dt.current!==null||zt(document)||(m.preventDefault(),m.stopPropagation(),xt())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[en,xt]);let yd=()=>Te(new Set),gd=()=>mr(s=>s+1),hd=p===void 0?"no-session":R===void 0?"no-service":ae===void 0||ae.status==="loading"?"loading":ae.status==="failed"?"failed":ae.nodes.length===0?"empty":"tree";return(0,C.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":hd,"data-session":p??"","data-testid":"fs-explorer-view",children:[(0,C.jsxs)("header",{className:"fx-head",children:[(0,C.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,C.jsx)(Io,{open:!0})}),(0,C.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,C.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,C.jsx)(Ka,{tree:B,t,onOpenFile:nd,onOpenFolder:ed,onCreateGroup:s=>K({mode:"group",parentId:s}),onRename:s=>K({mode:"rename",node:s}),onRemove:td,onMove:s=>S({mode:"move",node:s}),onReorder:rd}),(0,C.jsxs)("div",{className:"fx-head-meta",children:[ae?.status==="ready"?(0,C.jsxs)("span",{children:[(0,C.jsx)("b",{children:ae.nodes.length})," ",t("head.entries")]}):null,bn.length===0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":z?"true":"false","aria-pressed":z,title:t(z?"head.hideIgnored":"head.showIgnored"),"aria-label":t(z?"head.hideIgnored":"head.showIgnored"),onClick:od,children:(0,C.jsx)(cu,{open:z})}),(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":en===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":en!=="",onClick:()=>{en!==""?xt():Us()},children:(0,C.jsx)(xs,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:an.size===0,onClick:yd,children:(0,C.jsx)(ks,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:p===void 0||R===void 0||ae?.status==="loading",onClick:gd,children:(0,C.jsx)(hs,{})})]})]}),Oe===null?null:(0,C.jsx)("div",{className:"fx-notice",role:"status","data-tone":Oe.tone,"data-testid":"fx-notice",children:Oe.text}),(0,C.jsx)("div",{className:"fx-main",children:p===void 0?(0,C.jsx)(lr,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):R===void 0?(0,C.jsx)(lr,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ae===void 0||ae.status==="loading"?(0,C.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ae.status==="failed"?(0,C.jsx)(lr,{title:t("state.failed.title"),description:ae.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Yo(""),testId:"fs-failed"}):ae.nodes.length===0?(0,C.jsx)(lr,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)("div",{className:"fx-tree-pane",style:dn===null?void 0:{"--fx-tree-width":`${dn}px`},children:[(0,C.jsx)(vs,{t,value:en,origin:qo,count:Vo.length,busy:Gs,onChange:Go,onStep:s=>Wn(void 0,s,!1),onActivate:md,onClose:xt,focusSignal:Vs}),(0,C.jsx)(bs,{rows:Xs,selectedPath:On===void 0?sn:void 0,entryFocus:vr?void 0:Ys,t,onToggle:Qs,onSelect:s=>vr?Rr(s):$.open(s),onRetry:Yo,onEntryFocusSettled:Zs,onContextMenu:id,cursorRequest:$s,onCursorMove:s=>{hr.current=s}})]}),(0,C.jsx)("div",{ref:yr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":dn??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:_s,onPointerMove:Ks,onPointerUp:kr,onPointerCancel:kr,onLostPointerCapture:kr,onKeyDown:Hs,onDoubleClick:br}),(0,C.jsxs)("div",{className:"fx-editor",children:[(0,C.jsx)(Yi,{panels:Me.panels,active:Me.active,t,onActivate:s=>$.activate(s),onClose:cn,onStep:s=>s===1?$.next():$.previous(),onTabMenu:sd,documents:l,sessionId:p}),ce===null?null:(0,C.jsx)(Zi,{name:Ht(ce.path),t,saving:Ds,error:Os,onSave:Ws,onDiscard:zs,onCancel:gr}),(0,C.jsx)("div",{className:"fx-editor-body",children:Me.panels.length===0?(0,C.jsx)(Ji,{t}):Me.panels.map((s,m)=>{let h=s.key===Me.active;return(0,C.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!h,"data-line":s.line,"data-testid":"fs-panel",children:(0,C.jsx)(Fa,{sessionId:p,files:R,path:s.path,revision:s.revision,git:H,t,visible:h,renderers:a,documents:l,locate:O})},s.key)})})]})]})}),_===null?null:(0,C.jsx)(So,{entries:pd,anchor:_.anchor,onSelect:cd,onClose:ad,..._.trigger===void 0?{}:{returnFocus:()=>_.trigger??null}}),N===null||Zo.length===0?null:(0,C.jsx)(So,{entries:Zo,anchor:N.anchor,onSelect:ld,onClose:dd,returnFocus:()=>N.trigger}),le===null?null:(0,C.jsx)(ot,{kind:le.kind,parent:le.parent,t,error:le.error,busy:le.busy,onSubmit:ud,onCancel:fd}),T===null?null:(0,C.jsx)(rs,{tree:B,target:T.mode==="add"?T.target:void 0,t,mode:T.mode,...T.mode==="move"?{node:T.node}:{},onCommit:s=>{let m=T.mode;un(s),S(null),ne(t(m==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>S(null)}),I===null?null:(0,C.jsx)(ot,{kind:"directory",parent:"",t,initialName:I.mode==="rename"?I.node.name:t("bookmarks.newGroup"),titleKey:I.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:s=>{let m=I;K(null);try{if(m.mode==="rename"){un(Qa(B,m.node.id,s)),ne(t("bookmarks.renamed"),"ok");return}let h=et("group",{id:uu(),name:s,createdAt:Date.now()});un(rt(B,m.parentId,h)),ne(t("bookmarks.groupCreated"),"ok")}catch{ne(t("bookmarks.saveFailed"),"error")}},onCancel:()=>K(null)}),ae?.status==="ready"?(0,C.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,C.jsxs)("span",{children:[t("view.scope")," ",(0,C.jsx)("b",{children:ae.nodes.length})," ",t("head.entries")]}),ae.truncated?(0,C.jsx)("span",{className:"fx-foot-warn",children:Vn({entries:ae.nodes,truncated:!0,total:ae.total}).label}):null,(0,C.jsxs)("span",{className:"fx-foot-git","data-state":$n===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,C.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Js,"aria-hidden":"true"}),$n===void 0?t("status.unavailable"):$n===0?t("status.clean"):t("status.summary").replace("{count}",String($n))]}),Xo===null?null:(0,C.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Xo,ge?.upstream!==void 0&&(ge.ahead??0)>0?(0,C.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(ge.ahead)}`}):null,ge?.upstream!==void 0&&(ge.behind??0)>0?(0,C.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(ge.behind)}`}):null]}),(0,C.jsx)("span",{className:"fx-spacer"}),(0,C.jsx)("span",{children:t("foot.order")})]}):null]})}return w}var Ms=["slots","locale","workbench","remote"];function ku(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var cr,ur,Do,fr,Oo,Ns;function Fs(e){return Oo=e,fr!==void 0||(fr=Oi({open:(n,t,r)=>{let o=Oo;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Ai(o)(n,t,r)},save:(n,t)=>{let r=Oo;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Di(r)(n,t)}})),fr}function bu(){if(Do!==void 0)return Do;let e=Jt({warn:n=>Ns?.(n)});for(let n of ko())e.register(n);return Do=e,e}var pr;function Is(e){return n=>{let t=e.get?.("sessions"),r=e.get?.("conversation");if(t?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=t.scope(n);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,a=o.focus,l=o.notify;return{...typeof i=="function"?{insertReference:(u,d)=>i.call(o,u,d)}:{},...typeof a=="function"?{focus:()=>a.call(o)}:{},...typeof l=="function"?{notify:(u,d)=>l.call(o,u,d)}:{}}}}function Ls(e){let n=e.workbench;if(n==null)return()=>{};Ns=g=>e.logger?.warn?.(g);let t=bu(),r={version:ma,renderers:t,registerRenderer:g=>t.register(g),documents:Fs(e)};ur?.();let o=e.provide?.(co,r);o===void 0&&e.logger?.warn?.(`${Hn}: ctx.provide unavailable, ${co} service not registered`),ur=o,cr?.();let i=e.locale.register(Hn,{zh:{...Wr,...Yr.zh,...ho.zh},en:{...zr,...Yr.en,...ho.en}});cr=i;let a=e.locale.bind(Hn),l=Na(typeof document>"u"?void 0:document),u=Ni(e),d=Da(e,()=>Aa(e.workbench)),c=Es({workbench:n,version:n.version,t:a,files:ba(e),status:Ca(e),git:Ra(e),renderers:t,documents:Fs(e),locate:g=>Bi(e,g),workspace:()=>ws(e),fileReferences:_i(e),reference:Is(e),referenceSourceAvailable:()=>d.available});pr?.();let f=Or(e,n);return pr=f,e.slots.inject(Tr,()=>e.slots.register({name:Tr,id:te,order:100,label:()=>$r(ku(e)),locale:Hn},c)),()=>{o?.(),ur===o&&(ur=void 0),f(),pr===f&&(pr=void 0),d.dispose(),l(),u(),i(),cr===i&&(cr=void 0)}}var Bs={buildTree:Pt,describeListing:Vn,iconFor:Cn,computeTreeWindow:Et,flattenTree:It,badgeFor:Pn,formatSize:Lt,joinPath:En,listingPath:Ft,parseFocus:Nt,consumeViewRequest:Gt,createPanelStack:Xr,createEscapeHandler:$t,KEYMAP:Wt,tabLabel:$r,indexIgnoredPaths:bt,isIgnoredPath:vt,normalizeListing:er,normalizeStatusSnapshot:nr,buildWorkspaceMap:Tt,workspaceTagFor:Ct,parseStatusZ:wt,statusTone:Gn,statusBadge:Rt,createPreviewLoader:qt,renderMarkdown:Vt,languageFor:Yn,isMarkdownFile:Zn,describePage:Ut,classifyPreviewFailure:yn,normalizePreviewPage:In,previewChunkRoute:ia,canBridgeFile:Bt,decideBridge:Ar,focusForFileAddress:Br,forwardFocus:Dr,registerAddressBridge:Or},As={name:"dsh-fs-explorer",inject:Ms,apply:Ls,__test:Bs};function vu(e){da(e),oa(e)}var wu=As;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
