window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Br=Object.defineProperty;var Bd=Object.getOwnPropertyDescriptor;var Ad=Object.getOwnPropertyNames;var Dd=Object.prototype.hasOwnProperty;var Od=(e,n)=>{for(var t in n)Br(e,t,{get:n[t],enumerable:!0})},Wd=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ad(n))!Dd.call(e,o)&&o!==t&&Br(e,o,{get:()=>n[o],enumerable:!(r=Bd(n,o))||r.enumerable});return e};var zd=e=>Wd(Br({},"__esModule",{value:!0}),e);var ju={};Od(ju,{__test:()=>Ys,apply:()=>Xs,boot:()=>_u,clientPlugin:()=>Zs,createReferenceResolver:()=>Us,default:()=>Ku,inject:()=>Vs});module.exports=zd(ju);var Wn=require("react");var li="dsh-resource://file/";function ci(e){try{return decodeURIComponent(e)}catch{return e}}function Zn(e){if(!e.startsWith(li))return null;let n=e.slice(li.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=ci(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(ci).join("/")}}function Xe(e){return e.slice(e.lastIndexOf("/")+1)}var ui=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title",claims:["workbench","sidebar"]},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title",claims:["workbench","sidebar"]},{family:"cad",extensions:["dxf"],titleKey:"cad.title",claims:["workbench","sidebar"]},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title",claims:["workbench"]},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title",claims:["workbench"]}];function fi(){return ui.flatMap(e=>[...e.extensions])}function Jn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return ui.find(o=>o.extensions.includes(r))?.family??null}var Fe="dsh-fs-explorer",Ar="conversation.view",te="fs-explorer";var Qn="fs-explorer",pi="fsExplorerDocuments",mi="fsExplorerWorkspace",gi="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function yi(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var Dr={chunk:"client.preview.js"},Nt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};function hi(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function It(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=hi(t);r===""||r==="."||n.add(r)}return n}function Lt(e,n){if(n===void 0||n.size===0)return!1;let t=hi(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var $d={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},_d={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Kd=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function bi(e){return typeof e=="string"&&Kd.has(e)}function xi(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function jd(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Bt(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=xi(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",u=a.rest;if(u===""||l.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:jd(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=xi(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function et(e){return bi(e)?$d[e]:"neutral"}function At(e){return bi(e)?_d[e]:"?"}function Or(e){return`status.${e}`}function Dt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function ki(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function vi(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function wi(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Hd=["conflicted","deleted","renamed","added","modified","untracked"];function Gd(e){return et(Hd.find(n=>e.has(n))??"modified")}function Ri(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,u="";for(let s=0;s<l;s+=1){let c=a[s];if(c===void 0||c==="")continue;u=u===""?c:`${u}/${c}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Gd(o.present)});return t}var Ci=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Pi=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Vd(e){return Pi.test(e)?e.slice(0,e.indexOf("/")):null}function qd(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ud(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=qd(i[2]??"");a!==""&&Pi.test(a)&&t.push(a)}return t}function Xd(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Si(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Ti(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Ot(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of Xd(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of Ud(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=Si(a);if(l!==void 0){let u=l.workspaces,s=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let c of Ti(Array.isArray(u)?u:s))o.add(c)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let s=Si(u);if(s!==void 0)for(let c of Ti(s.packages))o.add(c)}for(let l of o){let u=Vd(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function Wt(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Yd=new Set([".git"]);function Zd(e){return Yd.has(e)}function Jd(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Dn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Zd(r))continue;let o=Jd(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Qd=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),el=new Set(["md","mdx","markdown","mdown","rst","adoc"]),nl=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),tl=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),rl=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),ol=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),il=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Ei(e){let n=Xe(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function sn(e,n="file"){if(n==="directory")return"folder";let t=Xe(e.toLowerCase());if(il.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Ei(t);return r===""?"file":Qd.has(r)?"code":el.has(r)?"markdown":nl.has(r)?"data":tl.has(r)?"image":rl.has(r)?"style":ol.has(r)?"archive":"file"}var al={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},sl={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function dn(e){let n=Xe(e.toLowerCase()),t=al[n];if(t!==void 0)return t;let r=Ei(n),o=sl[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function nt(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${gi} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function zt(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),a),s=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,s),startIndex:u,endIndex:s}}function zr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Fi(e,n){let t=n>0?n:1;return Math.max(1,Math.floor(Math.max(0,e)/2/t))}function Mi(e,n,t,r){if(e.length===0)return;let o=Math.max(1,r);if(n===void 0)return t<0?e[e.length-1]:e[0];let i=t<0?e.filter(a=>a<n):e.filter(a=>a>n);if(i.length!==0)return t<0?i[i.length-o]??i[0]:i[o-1]??i[i.length-1]}function On(e){return e===""?".":e}function Ye(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ie(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function tt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Ie(r,o),t.push(r);return t}function Wr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function $t(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let s=Wr(t[2]),c=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return c===""||s<1?void 0:{path:c,line:s,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let s=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return s===""?void 0:{path:s,line:1,absolute:!1,reveal:!0}}let o=/^enter:(.+)$/u.exec(n);if(o!==null){let s=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return s===""?void 0:Ye(s)?{path:s,line:1,absolute:!0,enter:!0}:{path:s.replace(/^\/+/u,""),line:1,absolute:!1,enter:!0}}let i=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(i!==null){let s=(i[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return s===""?void 0:{path:s,line:Wr(i[2]),absolute:!0}}let a=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(a===null)return;let u=(a[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(u!=="")return{path:u,line:Wr(a[2]),absolute:!1}}function Ni(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Ii(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function _t(e,n,t,r,o){let i=[],a=Ri(t),l=o?.showIgnored===!1,u=o?.hiddenLabel??yi,s=(c,f)=>{let y=e.get(c);if(y===void 0||y.status!=="ready")return;let k=0;for(let T of y.nodes){let v=Ie(c,T.name),m=T.kind==="directory",w=Lt(v,o?.ignored);if(w&&l){k+=1;continue}let S=m&&n.has(v),H=m||t===void 0?void 0:t[v],Z=H?.status??(m?void 0:Dt(v,t)),L=H===void 0?void 0:ki(H),M=m?a.get(v):void 0,X=m?Wt(r,v):void 0;if(i.push({type:"entry",path:v,name:T.name,kind:T.kind,depth:f,expanded:S,...T.size===void 0?{}:{size:T.size},...Z===void 0?{}:{status:Z},...M===void 0?{}:{statusCount:M.count,statusTone:M.tone},...L===void 0?{}:{diff:L},...X===void 0?{}:{tag:X},...w?{ignored:!0}:{}}),!S)continue;let D=e.get(v);if(D===void 0||D.status==="loading"){i.push({type:"status",key:`${v}:loading`,path:v,depth:f+1,state:"loading"});continue}if(D.status==="failed"){i.push({type:"status",key:`${v}:failed`,path:v,depth:f+1,state:"failed",message:D.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(D.nodes.length===0){i.push({type:"status",key:`${v}:empty`,path:v,depth:f+1,state:"empty"});continue}s(v,f+1),D.truncated&&i.push({type:"status",key:`${v}:truncated`,path:v,depth:f+1,state:"truncated",label:nt({entries:D.nodes,truncated:!0,total:D.total}).label})}k>0&&y.nodes.length===k&&i.push({type:"status",key:`${c}:hidden`,path:c,depth:f,state:"empty",label:u(k)})};return s("",0),i}var Li=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function dl(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function ll(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Li.has(dl(n.path)))}var cl=[...Li,"index.md","index.markdown"];function Bi(e,n){for(let t of cl){let r=e.find(o=>o.kind==="file"&&o.name.toLowerCase()===t);if(r!==void 0)return Ie(n,r.name)}}function Ai(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=ll(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Kt(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var $r="dsh-fs-explorer:bridge",ul="fs-explorer-bridge",zi="dsh-resource://file/**",_r="sidebar.right.pane.tab",fl=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),pl=new Set(["docx","pptx","xlsx","xls","fods","csv","tsv","doc","ppt"]),ml=new Set(["makefile","dockerfile","license","readme","changelog",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".browserslistrc",".env"]),gl=new Set([...fi(),...fl]);function yl(e){let n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function jt(e){if(typeof e!="string"||e==="")return!1;let n=Xe(e).toLowerCase();if(n==="")return!1;let t=yl(n);return pl.has(t)?!1:ml.has(n)?!0:gl.has(t)}function hl(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function xl(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Hr(e,n){if(typeof e!="string")return;let t=Zn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=xl(n,hl(e));return`${Ye(r)?"abs:":"path:"}${r}:${String(o)}`}function Gr(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Zn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!jt(r.path))return{action:"keep",reason:"refused"};let o=Hr(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Ze(e,n){n===void 0?console.warn(`[${Fe}] ${e}`):console.warn(`[${Fe}] ${e}`,n)}function bl(e){console.debug(`[${Fe}] ${e}`)}function Kr(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function jr(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function kn(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Di(e){return kn(()=>e.sidebarRightTabs,Kr)??kn(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Kr)}function Oi(e){return kn(()=>e.sidebarRight,jr)??kn(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,jr)}function Wi(e){return typeof e=="function"?e:()=>{}}var kl="dsh-resource://file/session/probe/src/main.ts";function vl(e){let n=kn(()=>(typeof e.candidates=="function"?e.candidates(kl):[]).filter(r=>r.priority==="extension"&&r.id!==$r),t=>Array.isArray(t)&&t.length>0);n!==void 0&&Ze(`another extension-band tab type already claims ${zi}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function wl(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Rl(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Sl(e,n){let t=e.viewFocus;if(t?.request?.(te,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(te,n);return(!r.opened||r.focused)&&t?.take(te),r}return typeof e.openView=="function"&&e.openView(te,n)?(t?.take(te),{opened:!0,focused:!0}):(t?.take(te),{opened:!1,focused:!1})}function Vr(e,n,t,r){let o;try{o=Sl(e,r)}catch(i){return Ze("the file workbench threw while switching views",i),e.viewFocus?.take(te),!1}if(!o.opened)return Ze(`the file workbench did not switch to ${te}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return Ze("the forwarded tab could not be closed",i),!1}}function Tl(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=wl(i),u=Rl(i),s=(0,Wn.useRef)(void 0);return(0,Wn.useEffect)(()=>{if(a===void 0){Ze("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let c=Gr(l,e.currentSessionId(),u);if(c.action!=="open"){Ze(`left the forwarded tab standing (${c.reason})`,l);return}Vr(e,n,a,c.focus)},[a,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(Ze(`the host did not inject useTabInfo into ${_r}; the bridge cannot forward`),null):(0,Wn.createElement)(t,{useTabInfo:o.useTabInfo})}}function qr(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;vl(l);let s;try{s=l.register({id:$r,kind:ul,patterns:[zi],priority:"extension",canOpen:y=>{let k=Zn(y);return k!==null&&jt(k.path)},title:y=>Xe(Zn(y)?.path??y)||y})}catch(y){Ze("the sidebar right refused the address bridge tab type",y);return}let c=Tl(n,u),f;try{f=Wi(e.slots.inject(_r,()=>e.slots.register({name:_r,key:$r},c)))}catch(y){s(),Ze("the sidebar right refused the address bridge body",y);return}return()=>{f(),s()}},r=Di(e),o=Oi(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return bl("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=kn(()=>l.get?.("sidebarRightTabs"),Kr)??Di(l),s=kn(()=>l.get?.("sidebarRight"),jr)??Oi(l);return t(u,s)});return Wi(a)}var Ur={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u6B63\u6587\u4E2D\u67E5\u627E","preview.find.hint.page":"\u672C\u9875","preview.find.hint.document":"\u5168\u6587","preview.find.none.page":"\u672C\u9875\u65E0\u5339\u914D","preview.find.none.document":"\u5168\u6587\u65E0\u5339\u914D","preview.find.count.page":"\u672C\u9875 {index}/{count}","preview.find.count.document":"\u5168\u6587 {index}/{count}","preview.find.scope.page":"\u6309\u9884\u89C8\u5F53\u524D\u6E32\u67D3\u7684\u6587\u672C\u67E5\u627E","preview.find.scope.document":"\u6309\u7F16\u8F91\u5668\u7684\u6574\u4EFD\u6587\u6863\u67E5\u627E","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","preview.surface.image.title":"\u56FE\u7247","preview.surface.pdf.title":"PDF \u6587\u6863","preview.surface.pdf.page":"\u7B2C {current} / {total} \u9875","preview.surface.pdf.previous":"\u4E0A\u4E00\u9875","preview.surface.pdf.next":"\u4E0B\u4E00\u9875","preview.surface.pdf.error.password":"\u8FD9\u4E2A PDF \u9700\u8981\u5BC6\u7801\u624D\u80FD\u6253\u5F00","preview.surface.pdf.error.invalid":"\u8FD9\u4E2A PDF \u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 PDF","preview.surface.pdf.error.missing":"\u627E\u4E0D\u5230\u8FD9\u4E2A PDF \u7684\u5185\u5BB9","preview.surface.pdf.error.unknown":"\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A PDF","preview.surface.pdf.error.render":"\u8FD9\u4E00\u9875\u65E0\u6CD5\u7ED8\u5236","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.reference":"\u5F15\u7528\u5230\u8F93\u5165\u6846","menu.reference.reason.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","menu.reference.reason.noReference":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","menu.reference.reason.noReferenceSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","menu.reference.reason.absolute":"\u5DE5\u4F5C\u533A\u5916\u7684\u7EDD\u5BF9\u8DEF\u5F84\u4E0D\u80FD\u5F15\u7528","menu.reference.reason.revision":"\u63D0\u4EA4\u7248\u672C\u7684\u6587\u4EF6\u4E0D\u5728\u5DE5\u4F5C\u533A\u91CC\uFF0C\u4E0D\u80FD\u5F15\u7528","notice.referenced":"\u5DF2\u5F15\u7528 {name}","notice.referenceFailed":"\u65E0\u6CD5\u63D2\u5165\u5F15\u7528\uFF0C\u8F93\u5165\u6846\u4E0D\u63A5\u53D7\u5199\u5165","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","menu.tab.close":"\u5173\u95ED","menu.tab.closeOthers":"\u5173\u95ED\u5176\u4ED6\u6807\u7B7E\u9875","menu.tab.closeOthers.reason":"\u53EA\u6709\u8FD9\u4E00\u4E2A\u6807\u7B7E\u9875","menu.tab.closeRight":"\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E\u9875","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Xr={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in the preview text","preview.find.hint.page":"This page","preview.find.hint.document":"Whole file","preview.find.none.page":"No match on this page","preview.find.none.document":"No match in the whole file","preview.find.count.page":"{index}/{count} on this page","preview.find.count.document":"{index}/{count} in the whole file","preview.find.scope.page":"The search covers the text this preview renders","preview.find.scope.document":"The search covers the editor's whole document","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","preview.surface.image.title":"Image","preview.surface.pdf.title":"PDF document","preview.surface.pdf.page":"Page {current} of {total}","preview.surface.pdf.previous":"Previous page","preview.surface.pdf.next":"Next page","preview.surface.pdf.error.password":"This PDF is password protected","preview.surface.pdf.error.invalid":"This file is damaged or is not a valid PDF","preview.surface.pdf.error.missing":"The content of this PDF could not be found","preview.surface.pdf.error.unknown":"This PDF could not be opened","preview.surface.pdf.error.render":"This page could not be drawn","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.reference":"Reference in composer","menu.reference.reason.noSession":"No session to insert into","menu.reference.reason.noReference":"This host has no composer to insert into","menu.reference.reason.noReferenceSource":"The reference source is not registered, so the chip could not be sent","menu.reference.reason.absolute":"An absolute path outside the workspace cannot be referenced","menu.reference.reason.revision":"A commit-version file is not in the working tree, so it cannot be referenced","notice.referenced":"Referenced {name}","notice.referenceFailed":"Could not insert the reference: the composer refused the write","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","menu.tab.close":"Close","menu.tab.closeOthers":"Close other tabs","menu.tab.closeOthers.reason":"This is the only tab","menu.tab.closeRight":"Close tabs to the right","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Yr(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Ur:Xr)["tab.label"]??"Files"}var ji=require("react"),Hi=14,Cl="--dsh-content-font-size",$i=Hi;function Pl(e,n){return Math.max(e,Math.round(e*n/Hi))}function El(e,n){if(e===void 0)return n;let t=Number.parseFloat(e);return Number.isFinite(t)&&t>0?t:n}function Gi(){return typeof document>"u"||document.body===null?$i:El(document.body.style.getPropertyValue(Cl),$i)}var Zr=Gi(),Jr=new Set;function _i(){return Zr}function Fl(e){return Jr.add(e),()=>{Jr.delete(e)}}function Ml(e){if(e!==Zr){Zr=e;for(let n of[...Jr])n()}}function Ki(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function Nl(e){if(e===null||typeof e!="object")return;let n=e.fontSizes;if(n===null||typeof n!="object")return;let t=n.text;return typeof t=="number"&&Number.isFinite(t)&&t>0?t:void 0}function Il(e){try{let n=e.get?.("theme");if(Ki(n))return n}catch{}try{let n=e.theme;if(Ki(n))return n}catch{}}function Vi(e){let n=e.inject;if(typeof n!="function")return()=>{};let t,r;try{let o=n.call(e,["theme"],i=>{let a=Il(i);if(a===void 0)return;let l=()=>{try{let c=Nl(a.getTheme());Ml(c??Gi())}catch{}};l();let u=i.on?.("theme/change",l);if(typeof u!="function")return;let s=u;return t=s,s});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{t?.(),r?.()}}function qi(e){let n=(0,ji.useSyncExternalStore)(Fl,_i,_i);return Pl(e,n)}var Ll=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function Se(e){return e!==null&&typeof e=="object"}function Gt(e,n){return{ok:!1,code:e,message:n}}function Vt(e){let n=Se(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Gt(t,r)}function Qr(){return Gt("invalid-response","the document service answered an invalid response")}function Ht(e){try{return e()}catch{return}}function Bl(e){let n=Se(e)?e:void 0;if(n===void 0)return Qr();if(n.ok===!1)return Vt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Se(t)?t:void 0;if(r===void 0)return Qr();if(r.ok===!1)return Vt(r.error);let o=Se(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Qr():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Al(e){let n=Se(e)?e:void 0;if(n===void 0)return Ui();if(n.ok===!1)return Vt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Se(t)?t:void 0;if(r===void 0)return Ui();if(r.ok===!1)return Vt(r.error);let o=Se(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Ui(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function eo(e){return Se(e)&&typeof e.open=="function"}function Dl(e){let n=Ht(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Se(n)?n.rpc:void 0;if(!(!Se(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${pi}/${r}`,o,i)}function Ol(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Wl(e){let n=Se(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=Se(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=Se(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function Xi(e,n){let t=to(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return Wl(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function to(e){return()=>{let n=Ht(()=>e.fsExplorerDocuments);if(eo(n))return n;let t=Ht(()=>Se(e.remote)?e.remote.fsExplorerDocuments:void 0);if(eo(t))return t;let r=Ht(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(eo(r))return r;let o=Dl(e);if(o!==void 0)return Ol(o)}}function Yi(e){let n=to(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Gt("unavailable","the document service is unavailable");try{return Bl(await i.open({sessionId:t,path:r},o))}catch(a){return Gt("io-error",a instanceof Error?a.message:String(a))}}}function Zi(e){let n=to(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return Al(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function Ji(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let s=o(l,u),c=n.get(s);return c===void 0&&(c={session:new no(l,u,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,c),i()),c.session.retain(),c.session},peek(l,u){return a(l,u)?.getSnapshot()},find:a,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var no=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=Ll;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var qt=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function ro(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Qi(e,n,t=ro()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function ea(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function zl(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Ut(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Xt(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&zl(n),e.onClose?.()}}function na(e){return e.viewSessionId===void 0||e.viewSessionId!==e.currentSessionId||e.activePanel===null?"pass":e.confirming?"hold":"close"}function ta(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function Yt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Zt(e){try{return e()}catch{return}}function ra(e){return()=>{let n=Zt(()=>e.fileReferences);if(Yt(n))return n;let t=Zt(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(Yt(t))return t;let r=Zt(()=>e.remote?.fileReferences);if(Yt(r))return r;let o=Zt(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return Yt(o)?o:void 0}}function oa(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function ia(e){let n=e.trim();return n===""?void 0:n}function oo(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?Dt(i,n):void 0,u=$l(i);t.push({type:"entry",path:i,name:ta(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...u===""?{}:{directory:u}})}return t}function $l(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function zn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:Ie(t,o.name),kind:o.kind});return n}function aa(e,n){let t=n.toLowerCase();return e.filter(r=>ta(r.path).toLowerCase().includes(t))}function sa(e){return tt(e)}var $n=require("react");function Qt(e){let n=Xe(e);return n===""?e:n}function Jt(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var _l=Object.freeze({panels:Object.freeze([]),active:null});function da(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Kl=/^git:([0-9a-f]{4,64}):(.+)$/iu;function la(e,n,t){let r=e.findIndex(i=>i.key===n);return r<0?[]:(t==="others"?e.filter((i,a)=>a!==r):e.slice(r+1)).map(i=>i.key)}function io(){let e=[],n=null,t=_l,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(c=>c.key===s),a=s=>e.findIndex(c=>c.revision===void 0&&c.key===s),l=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let c=Kl.exec(s);if(c!==null){let k=(c[1]??"").toLowerCase(),T=Jt(c[2]??"",!1);if(T===void 0)return;let v=da(T,k);return i(v)>=0?v:void 0}let f=Jt(s,!0);if(f===void 0)return;if(a(f)>=0)return f;let y=Jt(s,!1);if(!(y===void 0||y===f))return a(y)>=0?y:void 0},u=s=>{if(e.length===0)return;let c=n===null?-1:i(n),f=e[(c+s+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(s,c=1,f=!1,y){let k=Jt(s,f);if(k===void 0)return;let T=typeof y=="string"&&y.trim()!==""?y.trim().toLowerCase():void 0,v=da(k,T),m=Number.isFinite(c)&&c>0?Math.trunc(c):1,w=i(v);if(w>=0){let Z=e[w],L=Z!==void 0&&(Z.line!==m||Z.absolute!==f);if(L&&(e=e.map((M,X)=>X===w?{...M,line:m,absolute:f}:M)),n===v){L&&o();return}n=v,o();return}let S=n===null?e.length:i(n)+1,H={key:v,path:k,line:m,absolute:f,...T===void 0?{}:{revision:T}};e=[...e.slice(0,S),H,...e.slice(S)],n=v,o()},close(s){let c=s===void 0?n:l(s)??null;if(c===null)return;let f=i(c);f<0||(e=e.filter(y=>y.key!==c),n===c&&(n=(e[f]??e[f-1])?.key??null),o())},activate(s){let c=l(s);c===void 0||i(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let c=l(s);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function ca(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=io();return e.set(t,o),o}}}function er(e,n){let t=$t(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):t.enter===!0?n.enter===void 0?!1:(n.enter(t.path,t.absolute),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var Y=require("react/jsx-runtime"),ao={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},jl=()=>()=>{},Hl=()=>"";function Gl(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function ua({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,onTabMenu:a,documents:l,sessionId:u}){let s=(0,$n.useRef)(null);(0,$n.useEffect)(()=>{s.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let c=(0,$n.useSyncExternalStore)(l?.subscribe??jl,()=>Gl(l,u,e).join("\0"),Hl),f=new Set(c===""?[]:c.split("\0"));if(e.length===0)return null;let y=k=>{if(k.key==="ArrowRight"||k.key==="ArrowLeft"){k.preventDefault(),k.stopPropagation(),i(k.key==="ArrowRight"?1:-1);return}(k.key==="Delete"||k.key==="Backspace")&&n!==null&&(k.preventDefault(),k.stopPropagation(),o(n))};return(0,Y.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:y,"data-testid":"fs-tabs",children:e.map((k,T)=>{let v=k.key===n,m=Qt(k.path),w=t("panel.close").replace("{name}",m);return(0,Y.jsxs)("div",{className:"fx-tab","data-active":v?"true":"false","data-dirty":f.has(k.path)?"true":"false",role:"presentation",onContextMenu:a===void 0?void 0:S=>{S.preventDefault(),S.stopPropagation(),a(k.key,{x:S.clientX,y:S.clientY},S.currentTarget)},children:[(0,Y.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${T}`,"aria-controls":`fx-panel-${T}`,"aria-selected":v,tabIndex:v?0:-1,title:k.path,"data-testid":"fs-tab","data-path":k.path,"data-key":k.key,ref:v?s:void 0,onClick:()=>r(k.key),children:[(0,Y.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":sn(k.path),"aria-hidden":"true",children:dn(k.path)}),(0,Y.jsx)("span",{className:"fx-tab-name",children:m}),k.revision===void 0?null:(0,Y.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:k.revision,children:k.revision.slice(0,7)}),f.has(k.path)?(0,Y.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,Y.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:v?0:-1,"aria-label":w,title:w,"data-testid":"fs-tab-close",onClick:()=>o(k.key),children:"\xD7"})]},k.key)})})}function fa({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,Y.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,Y.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,Y.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,Y.jsx)("span",{className:"fx-spacer"}),(0,Y.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,Y.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,Y.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Vl(){return(0,Y.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,Y.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,Y.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,Y.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function ql(){return typeof document<"u"&&document.documentElement.dataset.platform!==void 0&&ro()==="mac"?"\u2318W":"Ctrl+W"}function pa({t:e}){return(0,Y.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,Y.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,Y.jsx)(Vl,{})}),(0,Y.jsx)("strong",{children:e("panel.empty.title")}),(0,Y.jsx)("span",{children:e("panel.empty.description")}),(0,Y.jsxs)("span",{className:"fx-empty-keys",children:[(0,Y.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,Y.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,Y.jsx)("kbd",{className:"fx-kbd",children:ql()}),(0,Y.jsx)("span",{children:e("panel.empty.keys")})]})]})}var ma=require("react");function pe(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,ma.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Ul(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Xl=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function vn(e){let n=[],t=0;for(let r of e.matchAll(Xl)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(pe("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(pe("strong",null,...vn(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(pe("del",null,...vn(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(pe("em",null,...vn(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,u=a===null?void 0:Ul(a[2]??"");n.push(u===void 0?l:pe("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var ga=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,ya=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,ha=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,so=/^\s{0,3}>\s?(.*)$/u,lo=/^\s{0,3}[-*+]\s+(.*)$/u,co=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Yl(e){return ga.test(e)||ya.test(e)||ha.test(e)||so.test(e)||lo.test(e)||co.test(e)}function xa(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=ga.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),c=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(pe("pre",null,pe("code",c===""?null:{className:`language-${c}`},f.join(`
`))));continue}let i=ya.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(pe(`h${String(s)}`,null,...vn(i[2]??""))),t+=1;continue}if(ha.test(r)){n.push(pe("hr",null)),t+=1;continue}if(so.test(r)){let s=[];for(;t<e.length;){let c=so.exec(e[t]??"");if(c===null)break;s.push(c[1]??""),t+=1}n.push(pe("blockquote",null,...xa(s)));continue}if(lo.exec(r)!==null){let s=[];for(;t<e.length;){let c=lo.exec(e[t]??"");if(c===null)break;s.push(pe("li",null,...vn(c[1]??""))),t+=1}n.push(pe("ul",null,...s));continue}if(co.exec(r)!==null){let s=[];for(;t<e.length;){let c=co.exec(e[t]??"");if(c===null)break;s.push(pe("li",null,...vn(c[1]??""))),t+=1}n.push(pe("ol",null,...s));continue}let u=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Yl(s))break;u.push(s.trim()),t+=1}n.push(pe("p",null,...vn(u.join(" "))))}return n}function nr(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return pe("div",{className:"fx-md"},...xa(n))}var uo=200,Zl={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function it(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Zl[t.slice(r+1)]??"plaintext"}function at(e){return it(e)==="markdown"}var he=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function rt(e){return e!==null&&typeof e=="object"}function Jl(e){return e===""?0:e.split(`
`).length}function _n(e,n){if(!rt(e))throw new he("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=rt(e.error)?e.error:{},f=typeof c.code=="string"?c.code:"preview/unknown",y=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",k=rt(c.details)?c.details:{},T=typeof k.kind=="string"?k.kind:"";throw new he(f,y,T)}let t=e.ok===!0?e.value:e;if(!rt(t)||typeof t.text!="string")throw new he("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Jl(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?s:{...s,totalLines:o}}function wn(e){let n=rt(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var ot=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function tr({files:e,maxLines:n=uo}){let t=Math.max(1,Math.trunc(n)),r=ot,o=0,i=null,a=[1],l=new Set,u=c=>{r=c;for(let f of l)f()},s=async(c,f)=>{o+=1;let y=o;i?.abort();let k=new AbortController;i=k,u({status:"loading",path:c,text:r.path===c?r.text:"",offset:f,lines:r.path===c?r.lines:0,...r.path===c&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===c&&r.source!==void 0?{source:r.source}:{},eof:r.path===c?r.eof:!1});try{let T=await e.read(c,f>1?{offset:f,limit:t}:{limit:t},k.signal);if(y!==o)return;let v=_n(T,f);if(v.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let m={status:"ready",path:c,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof,...v.source===void 0?{}:{source:v.source},...v.linkTarget===void 0?{}:{linkTarget:v.linkTarget,linkPath:c}};u(v.totalLines===void 0?m:{...m,totalLines:v.totalLines})}catch(T){if(y!==o||k.signal.aborted)return;u({status:"failed",path:c,text:"",offset:f,lines:0,eof:!1,failure:wn(T)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(c){return l.add(c),()=>{l.delete(c)}},async open(c){a=[1],await s(c,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let c=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&c>r.totalLines||(a.push(c),await s(r.path,c))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let c=a[a.length-1]??1;await s(r.path,c)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(ot)}}}function rr(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var fo=Object.freeze({chunk:Dr.chunk,id:`${Fe}/${Dr.chunk}`}),po=null,st=null,or=new Map;function ba(e){po=e}function ka(){return fo}function Ql(e){let n=Nt[e];return{chunk:n,id:`${Fe}/${n}`}}function mo(){if(st!==null)return st;let e=po;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Fe}: the loader require was not handed over`));let n=e.async(`./${fo.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Fe}: chunk ${fo.id} is missing its preview renderers`);return r});return st=n,n.catch(()=>{st===n&&(st=null)}),n}function va(e){let n=or.get(e);if(n!==void 0)return n;let t=po;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${Fe}: the loader require was not handed over`));let r=Ql(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${Fe}: chunk ${r.id} is not the ${e} view`);return a});return or.set(e,o),o.catch(()=>{or.get(e)===o&&or.delete(e)}),o}var wa=Object.freeze({}),ec="@deepseek-ai/dsh-client-ui-primitives",yo=null,go;function Ra(e){yo=e}function nc(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function ir(){if(go!=null)return go;if(yo===null)return wa;let e=nc(yo,ec);if(e===void 0)return wa;let n=c=>{let f=e[c];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=c=>{let f=e[c];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var _=require("react");async function Rn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}function tc(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function ar(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(tc(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function Sa(e,n,t){return n<=0?0:((e+t)%n+n)%n}function Ta(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function ho(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function Ca(e){let n=null,t=null,r=[],o=i=>{let a=e.text();return(a!==n||i!==t)&&(n=a,t=i,r=ar(a,i)),r};return{scope:e.scope??"page",count:i=>o(i).length,reveal:(i,a)=>{let l=o(i)[a];l!==void 0&&e.select(l.from,l.to)},clear:e.clear}}var rc=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),oc=new Set(["SCRIPT","STYLE","TEMPLATE"]);function ic(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let s=i.data;if(s==="")continue;let c=n.at(-1);c===void 0?n.push([s]):c.push(s),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(oc.has(l))continue;if(l==="BR"){n.push([]);continue}let u=rc.has(l);u&&n.push([]),r(a),u&&n.push([])}};return r(e),{layout:Ta(n),nodes:t}}function Pa(e){let n=()=>{let r=e();return r===null?void 0:ic(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{scope:"page",count:r=>{let o=n();return o===void 0?0:ar(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=ar(i.layout.text,r)[o];if(l===void 0)return;let u=ho(i.layout,l.from),s=ho(i.layout,l.to);if(u===void 0||s===void 0)return;let c=i.nodes[u.node],f=i.nodes[s.node];if(c===void 0||f===void 0)return;let y=a.ownerDocument.createRange();try{y.setStart(c,Math.min(u.offset,c.data.length)),y.setEnd(f,Math.min(s.offset,f.data.length))}catch{return}let k=t();k!==void 0&&(k.removeAllRanges(),k.addRange(y));let T=y.startContainer.parentElement;T!==null&&typeof T.scrollIntoView=="function"&&T.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var Je=require("react/jsx-runtime");function ac(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function sc(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function xo({failure:e,t:n,onRetry:t}){return(0,Je.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Je.jsx)("strong",{children:ac(e,n)}),(0,Je.jsx)("span",{children:sc(e,n)}),e.message===""?null:(0,Je.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Je.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function bo({t:e}){return(0,Je.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Je.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Te=require("react");var ln=require("react/jsx-runtime");function Ea({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Te.useState)(""),[a,l]=(0,Te.useState)(0),[u,s]=(0,Te.useState)(0),c=(0,Te.useRef)(null),f=(0,Te.useRef)(null);(0,Te.useEffect)(()=>{c.current?.focus()},[]),(0,Te.useEffect)(()=>{if(o===""){s(0),l(0);return}let w=n().count(o);s(w),l(S=>w===0?0:Math.min(S,w-1))},[o,t,n]),(0,Te.useEffect)(()=>{if(o===""||u===0)return;let w=document.activeElement;f.current!==null&&w!==null&&!f.current.contains(w)||n().reveal(o,a)},[o,a,u,t,n]);let y=(0,Te.useCallback)(()=>{n().clear(),r()},[n,r]),k=(0,Te.useCallback)(w=>{u!==0&&l(S=>Sa(S,u,w))},[u]),T=w=>{if(!w.nativeEvent.isComposing){if(w.key==="Escape"){w.preventDefault(),w.stopPropagation(),y();return}if(w.key==="Enter"){w.preventDefault(),k(w.shiftKey?-1:1);return}(w.key==="ArrowDown"||w.key==="ArrowUp")&&w.stopPropagation()}},v=n().scope,m=o===""?e(`preview.find.hint.${v}`):u===0?e(`preview.find.none.${v}`):e(`preview.find.count.${v}`).replace("{index}",String(a+1)).replace("{count}",String(u));return(0,ln.jsxs)("div",{ref:f,className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:T,children:[(0,ln.jsx)("input",{ref:c,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:w=>{i(w.currentTarget.value),l(0)}}),(0,ln.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":u===0?"empty":"ready",title:e(`preview.find.scope.${v}`),children:m}),(0,ln.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:u===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>k(-1),children:"\u2191"}),(0,ln.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:u===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>k(1),children:"\u2193"}),(0,ln.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:y,children:"\xD7"})]})}var se=require("react");function dc(e){if(e.startsWith("//")){let t=e.slice(2).split("/"),r=t[0]??"",o=t[1]??"";return o===""?`//${r}`:`//${r}/${o}`}let n=/^[A-Za-z]:/u.exec(e);return n===null?"/":n[0]}function Fa(e){let t=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/(?<!^)\/{2,}/gu,"/").replace(/\/+$/u,"");if(t==="")return{absolute:!1,segments:[]};let r=Ye(t),o=r?dc(t):"",a=(r?t.slice(o.length):t).split("/").filter(s=>s!==""&&s!==".");if(a.length===0)return{absolute:!1,segments:[]};let l=[],u=o;for(let[s,c]of a.entries()){let f=u==="/"?`/${c}`:Ie(u,c);l.push({name:c,path:f,kind:s===a.length-1?"file":"directory",parent:u}),u=f}return{absolute:r,segments:l}}var J=require("react");function Na(e,n,t,r=800){return t-n<=r?e:""}function Ia(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function La(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:lc(e,t+1,r.depth,r.depth+1)}function lc(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var cc=/^.$/u;function Ba(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!cc.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ma(e.names,n),l=a.find(u=>u>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=Ma(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ma(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var z=require("react/jsx-runtime"),uc=22;function dt({open:e=!0,size:n=14}){return(0,z.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,z.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,z.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function fc(){return(0,z.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,z.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Aa(){return(0,z.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,z.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,z.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Da(){return(0,z.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,z.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,z.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function Oa(){return(0,z.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,z.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function pc({name:e}){return(0,z.jsx)("span",{className:"fx-badge","data-icon":sn(e),"aria-hidden":"true",children:dn(e)})}function mc({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:u}){let s=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,z.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:c,onClick:()=>{l(e.path),s?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,z.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,z.jsx)(fc,{})}),s?(0,z.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,z.jsx)(dt,{open:e.expanded})}):(0,z.jsx)(pc,{name:e.name}),(0,z.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,z.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,z.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,z.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":et(e.status),"data-testid":"fx-file-status",title:o(Or(e.status)),"aria-label":o(Or(e.status)),children:At(e.status)}),e.statusCount===void 0?null:(0,z.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,z.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,z.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,z.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,z.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,z.jsx)("span",{className:"fx-size",children:Kt(e.size)})]})}function gc({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,z.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,z.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,z.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,z.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,z.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function yc(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Wa({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:u,cursorRequest:s,onCursorMove:c}){let f=(0,J.useRef)(null),[y,k]=(0,J.useState)(0),[T,v]=(0,J.useState)(0),m=qi(uc),[w,S]=(0,J.useState)(void 0),H=(0,J.useRef)(void 0),Z=(0,J.useRef)({query:"",at:0}),L=(0,J.useRef)(void 0),M=(0,J.useRef)(void 0),X=(0,J.useRef)(w);X.current=w;let D=(0,J.useMemo)(()=>e.flatMap((h,B)=>h.type==="entry"?[B]:[]),[e]);(0,J.useEffect)(()=>{let h=M.current!==n;if(M.current=n,L.current!==void 0||n===void 0)return;let B=X.current===void 0?void 0:e[X.current];if(!Ni({cursorPath:B?.type==="entry"?B.path:void 0,selectionMoved:h}))return;let N=e.findIndex(ee=>ee.type==="entry"&&ee.path===n);N>=0&&S(N)},[n,e]),(0,J.useEffect)(()=>{let h=L.current;if(h===void 0)return;let B=e.findIndex(le=>le.type==="entry"&&le.path===h),N=e[B];if(N?.type!=="entry"||N.kind!=="directory"||!N.expanded){L.current=void 0;return}let ee=Ii(e,h);ee!==void 0&&(L.current=void 0,S(ee))},[e]),(0,J.useEffect)(()=>{w!==void 0&&e[w]?.type!=="entry"&&S(void 0)},[e,w]),(0,J.useEffect)(()=>{let h=f.current;if(w===void 0||h===null)return;let B=zr({scrollTop:h.scrollTop,viewport:h.clientHeight,rowHeight:m,index:w});B!==h.scrollTop&&(h.scrollTop=B)},[w,m]);let Q=(0,J.useCallback)((h,B=!0)=>{S(h),B&&f.current?.focus({preventScroll:!0})},[]),ye=(0,J.useRef)(void 0);(0,J.useEffect)(()=>{if(s===void 0||ye.current===s.nonce)return;let h=D.at(-1);if(s.path!==void 0){let N=e.findIndex(ee=>ee.type==="entry"&&ee.path===s.path);ye.current=s.nonce,N>=0&&Q(N,s.focus);return}if(s.delta===void 0){ye.current=s.nonce;return}if(ye.current=s.nonce,w===void 0){let N=s.delta>0?D[0]:h;N!==void 0&&Q(N,s.focus);return}let B=s.delta>0?D.find(N=>N>w):[...D].reverse().find(N=>N<w);B!==void 0&&Q(B,s.focus)},[s,w,D,Q,e]),(0,J.useEffect)(()=>{if(c===void 0)return;let h=w===void 0?void 0:e[w];c(h?.type==="entry"?h.path:void 0)},[w,e,c]);let C=(0,J.useCallback)(h=>{let B=e.findIndex(N=>N.type==="entry"&&N.path===h);B>=0&&S(B)},[e]),P=(0,J.useCallback)((h,B,N)=>{C(h.path),u(h,B,N)},[C,u]),b=(0,J.useCallback)(h=>{h.preventDefault(),u(void 0,{x:h.clientX,y:h.clientY},h.currentTarget)},[u]),E=(0,J.useCallback)(h=>{if(h.nativeEvent.isComposing||h.altKey||h.metaKey||h.ctrlKey)return;let B=D.at(-1);if(h.key==="ArrowDown"){if(h.preventDefault(),w===void 0){D[0]!==void 0&&Q(D[0]);return}let V=D.find(q=>q>w);V!==void 0&&Q(V);return}if(h.key==="ArrowUp"){if(h.preventDefault(),w===void 0){B!==void 0&&Q(B);return}let V=[...D].reverse().find(q=>q<w);V!==void 0&&Q(V);return}if(h.key==="PageDown"||h.key==="PageUp"){h.preventDefault();let V=f.current?.clientHeight||T||480,q=Mi(D,w,h.key==="PageUp"?-1:1,Fi(V,m));q!==void 0&&Q(q);return}if(w===void 0)return;let N=e[w];if(N===void 0||N.type!=="entry")return;if(h.key==="ArrowRight"){if(h.preventDefault(),N.kind==="directory"&&!N.expanded)L.current=N.path,o(N.path);else{let V=D.find(q=>q>w);V!==void 0&&e[V]?.depth===N.depth+1&&Q(V)}return}if(h.key==="ArrowLeft"){if(h.preventDefault(),N.kind==="directory"&&N.expanded)o(N.path);else{let V=[...D].reverse().find(q=>q<w&&e[q]?.type==="entry"&&e[q].depth<N.depth);V!==void 0&&Q(V)}return}if(h.key==="Enter"&&N.kind!=="directory"){h.preventDefault(),i(N.path);return}if(h.key==="ContextMenu"||h.key==="F10"&&h.shiftKey){h.preventDefault();let V=f.current?.getBoundingClientRect(),q=V===void 0?0:V.top+w*m-(f.current?.scrollTop??0);P(N,{x:V?.left??0,y:q+m},f.current??void 0);return}if(h.key==="Home"){h.preventDefault(),D[0]!==void 0&&Q(D[0]);return}if(h.key==="End"){h.preventDefault(),B!==void 0&&Q(B);return}let ee=Date.now(),le=Ia(e,w),De=La(e,le),un=De.map(V=>{let q=e[V];return q?.type==="entry"?q.name:""}),xe=Ba({query:Na(Z.current.query,Z.current.at,ee),key:h.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:h.nativeEvent.repeat,names:un,active:w===void 0?-1:De.indexOf(w)});if(xe.kind==="clear"){Z.current={query:"",at:0};return}if(xe.kind!=="jump")return;let be=De[xe.index];if(be===void 0)return;let ce=e[be];ce?.type==="entry"&&(Z.current={query:xe.query,at:ee},h.preventDefault(),Q(be),ce.kind!=="directory"&&i(ce.path))},[w,D,T,Q,o,i,P,m,e]);(0,J.useEffect)(()=>{let h=f.current;if(h===null)return;let B=()=>v(h.clientHeight);if(B(),typeof ResizeObserver>"u")return;let N=new ResizeObserver(B);return N.observe(h),()=>N.disconnect()},[]),(0,J.useEffect)(()=>{if(n===void 0)return;let h=f.current;if(h===null)return;let B=e.findIndex(ee=>ee.type==="entry"&&ee.path===n);if(B<0)return;let N=B*m;(N<h.scrollTop||N+m>h.scrollTop+h.clientHeight)&&(h.scrollTop=Math.max(0,N-h.clientHeight/2))},[n,e,m]),(0,J.useEffect)(()=>{if(t===void 0||H.current===t)return;let h=f.current;if(h===null)return;let B=t.path===void 0?-1:e.findIndex(N=>N.type==="entry"&&N.path===t.path);if(!(t.path!==void 0&&B<0)){if(H.current=t,B>=0){let N=zr({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:m,index:B});N!==h.scrollTop&&(h.scrollTop=N,k(N)),S(B)}yc(h),l?.()}},[t,e,l,m]);let W=h=>{k(h.currentTarget.scrollTop)},G=zt(e,{scrollTop:y,height:T===0?480:T,rowHeight:m}),O={"--fx-row-h":`${String(m)}px`};return(0,z.jsx)("div",{className:"fx-scroll",ref:f,style:O,onScroll:W,onKeyDown:E,onContextMenu:b,tabIndex:0,"data-testid":"fs-tree-scroll","data-page-keys":"own",role:"tree","aria-label":r("view.tree"),children:(0,z.jsx)("div",{className:"fx-vlist",style:{height:e.length*m},children:G.rows.map((h,B)=>{let N=(G.startIndex+B)*m;return h.type==="entry"?(0,z.jsx)(mc,{row:h,top:N,selected:h.path===n,cursor:w===G.startIndex+B,t:r,onToggle:o,onSelect:i,onRowActivate:C,onContextMenu:(ee,le)=>P(ee,{x:le.clientX,y:le.clientY},le.currentTarget instanceof HTMLElement?le.currentTarget:void 0)},h.path):(0,z.jsx)(gc,{row:h,top:N,t:r,onRetry:a},h.key)})})})}function sr(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function je(e){try{return e()}catch{return}}function Le(e){return e!==null&&typeof e=="object"}function ja(e){return()=>{let n=je(()=>e.workspaceFiles);if(sr(n))return n;let t=je(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(sr(t))return t;let r=je(()=>e.remote?.workspaceFiles);if(sr(r))return r;let o=je(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(sr(o))return o}}function Ha(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Ga(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return _n(i,r.offset??1),i}catch(s){if(!(s instanceof he)||wn(s).kind!=="symlink")throw s;a=s}let l=await n(t,o);if(l===void 0)throw a;return{..._n(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function za(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function hc(e){let n=je(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Le(n)?n.rpc:void 0;if(!Le(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Va(e){return()=>{let n=je(()=>e.remote?.gitExplorer);if(za(n))return n;let t=je(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return za(t)?t:hc(e)}}function xc(e){return e===""?0:e.split(`
`).length}function $a(e){let n=Le(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new he(t,r)}function qa(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Le(l))throw new he("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw $a(l.error);let u=l;if(l.ok===!0&&(u=l.value),!Le(u))throw new he("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw $a(u.error);let s=u;if(u.ok===!0&&(s=u.page),!Le(s))throw new he("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new he("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new he("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new he("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let c=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):xc(s.text),f=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,y=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:c,offset:f,eof:s.eof===!0,...y===void 0?{}:{source:y}}}}}function bc(e){if(!Le(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Le(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function kc(e){let n=Le(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Le(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new he(t,r,i)}function wo(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=bc(await n.call(e,t,r,{},o));if(!i.ok)throw kc(i.error);return i.value.data}}function lt(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function ko(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Sn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:lt(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?ko(r.value):{ok:!1,message:lt(r.error)}}return ko(t)}return ko(n)}function dr(e){return e instanceof Error?e.message:lt(e)}function _a(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function vc(e){let n=je(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Le(n)?n.rpc:void 0;if(!Le(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function Ua(e){return()=>{let n=vc(e);if(n!==void 0)return n;let t=je(()=>e.remote?.gitExplorer);if(_a(t))return t;let r=je(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(_a(r))return r}}function Ka(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function wc(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Ka(r.additions),i=Ka(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Rc(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Sc(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function vo(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=wc(n.stats),r=Rc(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=Sc(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function lr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:lt(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?vo(o.snapshot):{ok:!1,message:lt(o.error)}}let r=e;return r.snapshot!==void 0?vo(r.snapshot):vo(t)}var me=require("react/jsx-runtime"),To={zh:{"preview.crumbs.open":"\u6253\u5F00\u540C\u7EA7\u9762\u677F","preview.crumbs.loading":"\u8F7D\u5165\u4E2D\u2026","preview.crumbs.empty":"\u7A7A\u76EE\u5F55","preview.crumbs.failed":"\u8BFB\u53D6\u76EE\u5F55\u5931\u8D25","preview.crumbs.truncated":"\u4EC5\u663E\u793A\u524D {count} \u9879"},en:{"preview.crumbs.open":"Open the sibling panel","preview.crumbs.loading":"Loading\u2026","preview.crumbs.empty":"Empty directory","preview.crumbs.failed":"Could not read the directory","preview.crumbs.truncated":"Showing the first {count} items"}},Tc=4,Ro=8,Cc=220;function So(e,n){return{dir:e,status:"failed",nodes:[],prefix:e,truncated:!1,message:n}}function Xa(e){let{path:n,sessionId:t,files:r,t:o,interactive:i,unavailableReason:a,onOpenPeer:l}=e,u=Fa(n),[s,c]=(0,se.useState)(null),[f,y]=(0,se.useState)(null),[k,T]=(0,se.useState)(null),v=(0,se.useRef)(null),m=(0,se.useRef)(null),w=(0,se.useRef)([]),S=(0,se.useRef)(!0),H=(0,se.useRef)(0);(0,se.useEffect)(()=>(S.current=!0,()=>{S.current=!1}),[]);let Z=(0,se.useCallback)(async b=>{let E=++H.current,W=B=>{!S.current||E!==H.current||y(B)};if(y({dir:b,status:"loading",nodes:[],prefix:b,truncated:!1,message:""}),r===void 0||t===void 0){W(So(b,""));return}let G;try{G=await r.list(t,b)}catch(B){W(So(b,dr(B)));return}let O=Sn(G);if(!O.ok){W(So(b,O.message));return}let{listing:h}=O;W({dir:b,status:"ready",nodes:Dn(h.entries),prefix:typeof h.path=="string"?h.path:b,truncated:h.truncated===!0,message:""})},[r,t]),L=(0,se.useCallback)(b=>{let E=v.current;H.current+=1,c(null),y(null),T(null),b&&E?.focus()},[]),M=(0,se.useCallback)((b,E)=>{if(s===b){L(!1);return}v.current=E;let W=E.getBoundingClientRect(),G=typeof window>"u"?0:window.innerWidth,O=G>0?Math.max(Ro,Math.min(W.left,G-Cc-Ro)):Math.max(Ro,W.left);T({left:O,top:W.bottom+Tc}),c(b),Z(On(u.segments[b]?.parent??""))},[L,Z,u.segments,s]);(0,se.useEffect)(()=>{if(s===null||f===null||f.status!=="ready")return;let b=f.nodes.findIndex(E=>E.name===u.segments[s]?.name);w.current[b>=0?b:0]?.focus()},[u.segments,s,f]),(0,se.useEffect)(()=>{if(s===null)return;let b=W=>{W.key==="Escape"&&(W.preventDefault(),L(!0))},E=W=>{let G=W.target;!(G instanceof Node)||(G instanceof Element?G.closest(".fx-preview-crumbs")!==null:m.current?.contains(G)===!0)||L(!1)};return document.addEventListener("keydown",b,!0),document.addEventListener("pointerdown",E,!0),()=>{document.removeEventListener("keydown",b,!0),document.removeEventListener("pointerdown",E,!0)}},[L,s]);let X=b=>{let E=w.current.filter(h=>h!==null);if(E.length===0)return;let W=E.indexOf(document.activeElement),G=W>=0?W:0,O;switch(b.key){case"ArrowDown":O=Math.min(E.length-1,G+1);break;case"ArrowUp":O=Math.max(0,G-1);break;case"Home":O=0;break;case"End":O=E.length-1;break;default:return}b.preventDefault(),E[O]?.focus()},D=(b,E)=>{b.key==="ArrowDown"&&(b.preventDefault(),M(E,b.currentTarget))},Q=s===null?"":u.segments[s]?.name??"",ye=u.segments.length-1,C=f===null?"":f.dir===""||f.dir==="."?"./":f.dir,P=f===null?"":f.status==="loading"?o("preview.crumbs.loading"):f.status==="failed"?o("preview.crumbs.failed"):f.nodes.length===0?o("preview.crumbs.empty"):"";return(0,me.jsxs)("div",{className:"fx-preview-crumbs","data-dcp-ref-skip":"",title:i?void 0:a,"data-interactive":i?"true":"false",children:[u.segments.map((b,E)=>{let W=s===E,G=`${o("preview.crumbs.open")}: ${b.name}`;return(0,me.jsxs)("span",{className:"fx-crumb-slot",children:[E>0?(0,me.jsx)("span",{className:"fx-crumb-sep","aria-hidden":"true",children:">"}):null,i?(0,me.jsx)("button",{type:"button",className:"fx-crumb","data-testid":"fs-preview-crumb","data-crumb-name":b.name,"data-file":E===ye?"true":void 0,"aria-haspopup":"dialog","aria-expanded":W,"aria-label":G,title:b.path,onClick:O=>M(E,O.currentTarget),onKeyDown:O=>D(O,E),children:b.name}):(0,me.jsx)("span",{className:"fx-crumb","data-testid":"fs-preview-crumb","data-crumb-name":b.name,"data-file":E===ye?"true":void 0,title:b.path,children:b.name})]},`${b.path}:${E}`)}),i&&f!==null&&k!==null?(0,me.jsxs)("div",{className:"fx-peers","data-testid":"fs-preview-crumbs",role:"dialog","aria-label":o("preview.crumbs.open"),ref:m,style:{left:`${k.left}px`,top:`${k.top}px`},onKeyDown:X,children:[(0,me.jsx)("div",{className:"fx-peers-head","data-testid":"fs-preview-crumb-head",title:C,children:C}),f.nodes.map((b,E)=>{let W=b.name===Q;return(0,me.jsxs)("button",{type:"button",className:"fx-peers-row","data-testid":"fs-preview-crumb-peer","data-kind":b.kind,"data-current":W?"true":void 0,ref:G=>{w.current[E]=G},onClick:()=>{if(b.kind==="directory"){Z(Ie(f.prefix,b.name));return}l(Ie(f.prefix,b.name),"file"),L(!1)},children:[b.kind==="directory"?(0,me.jsx)(dt,{open:!1,size:13}):(0,me.jsx)("span",{className:"fx-badge","data-icon":sn(b.name),"aria-hidden":"true",children:dn(b.name)}),(0,me.jsx)("span",{className:"fx-peers-name",children:b.name}),b.kind==="directory"?(0,me.jsx)("span",{className:"fx-crumb-chevron","aria-hidden":"true",children:"\u203A"}):null]},`${b.kind}:${b.name}`)}),P===""?null:(0,me.jsx)("div",{className:"fx-peers-status","data-testid":"fs-preview-crumb-status",title:f.message===""?void 0:f.message,children:P}),f.status==="ready"&&f.truncated?(0,me.jsx)("div",{className:"fx-peers-status",children:o("preview.crumbs.truncated").replace("{count}",String(f.nodes.length))}):null]}):null]})}var Co="fsExplorer",Ya=1;function Pc(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Ec(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Fc(e){return e.slice(e.lastIndexOf("/")+1).toLowerCase()}function Mc(e,n,t,r){return e.extensions.length===0&&e.families.length===0&&e.names.length===0||n!==""&&e.extensions.includes(n)||t!==null&&e.families.includes(t)?!0:e.names.includes(r)}function Nc(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function cr(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Ec),families:[...i.match?.families??[]],names:(i.match?.names??[]).map(u=>u.toLowerCase())}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=Pc(i.path),l=Jn(i.path),u=Fc(i.path),s;for(let c of t.values())Mc(c,a,l,u)&&(s===void 0||Nc(c.contribution,s.contribution))&&(s=c);return s?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Za(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}var I=require("react/jsx-runtime"),Mo={zh:{...To.zh,"preview.crumbs.unavailable":"\u63D0\u4EA4\u7248\u672C\u4E0E\u5DE5\u4F5C\u533A\u5916\u7684\u8DEF\u5F84\u6CA1\u6709\u540C\u7EA7\u9762\u677F","preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{...To.en,"preview.crumbs.unavailable":"Commit versions and paths outside the workspace expose no sibling panels","preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Ic=()=>()=>{},Ja=()=>{},Lc=()=>{};function No(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Po={status:"idle"},Bc=[".md",".mdx",".markdown",".mdown"],Ac=-1e3;function Fo({t:e,revision:n}){return(0,I.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,I.jsx)("strong",{children:e("preview.unavailable.title")}),(0,I.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function Qa({chunk:e,text:n,path:t,offset:r,find:o}){let i=(0,_.useRef)(null),a=(0,_.useRef)(null),l=(0,_.useRef)(n);l.current=n;let[u,s]=(0,_.useState)(!1),c=it(t);return(0,_.useEffect)(()=>{s(!1)},[e,t]),(0,_.useEffect)(()=>{let f=i.current;if(!(e===null||f===null))try{let y=e.mountCodePreview(f,{text:n,language:c,path:t,offset:r});return a.current=y,()=>{y.destroy(),a.current=null}}catch{s(!0);return}},[e,t,c]),(0,_.useEffect)(()=>{a.current?.update(n,r)},[n,r,e]),(0,_.useEffect)(()=>{if(!(o===void 0||e===null||u))return o.register({scope:"page",text:()=>l.current,select:(f,y)=>a.current?.revealRange(f,y),clear:()=>a.current?.clearSelection()}),()=>o.register(null)},[o,e,u]),e===null||u?(0,I.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,I.jsx)("div",{className:"fx-code-host",ref:i,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Dc({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&at(n)?(0,I.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:nr(r)}):(0,I.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Oc(e){function n({page:t,path:r,mode:o,find:i}){return o==="reading"?(0,I.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,I.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,I.jsx)(Qa,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:i})}return{Body:n,renderer:e.renderer}}function Wc(e){function n({page:t,path:r,find:o}){return(0,I.jsx)(Qa,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:o})}return{Body:n,renderer:e.renderer}}function zc({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,_.useMemo)(()=>{let u=wo(r);return u===void 0||t===void 0||a===void 0?u:async(s,c,f)=>{if(s!==t||c!==n)return u(s,c,f);let y=await a(c,f);return u(s,y?.absolutePath??c,f)}},[r,t,n,a]);return t===void 0||l===void 0?(0,I.jsx)(Fo,{t:o}):(0,I.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function $c(e){return{Body:n=>(0,I.jsx)(zc,{chunk:e,...n}),renderer:e.renderer}}function Io(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Bc]},priority:0,load:()=>mo().then(Oc)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:Ac,load:()=>mo().then(Wc)},...Object.keys(Nt).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>va(e).then($c)}))]}var Eo;function _c(){if(Eo!==void 0)return Eo;let e=cr();for(let n of Io())e.register(n);return Eo=e,e}function es({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:u,locate:s,onOpenPeer:c}){let f=(0,_.useMemo)(()=>{let $=r===void 0?Ha(n,e):o===void 0||e===void 0?void 0:qa(o,e,r);return $===void 0||r!==void 0||s===void 0?$:Ga($,s)},[n,e,r,o,s]),y=(0,_.useMemo)(()=>r===void 0?wo(n):void 0,[n,r]),k=l??_c(),T=t===void 0?null:Jn(t),v=T!==null,m=r===void 0&&e!==void 0&&y!==void 0?{sessionId:e,readFile:y}:null,[w,S]=(0,_.useState)(null),[H,Z]=(0,_.useState)(ot),[L,M]=(0,_.useState)(Po),[X,D]=(0,_.useState)(0),[Q,ye]=(0,_.useState)(0),[C,P]=(0,_.useState)(0),[b,E]=(0,_.useState)("reading"),[W,G]=(0,_.useState)(!1),[O,h]=(0,_.useState)(!1),[B,N]=(0,_.useState)(void 0),[ee,le]=(0,_.useState)(!1),[De,un]=(0,_.useState)(!1),xe=(0,_.useRef)(null),be=(0,_.useRef)(null),ce=(0,_.useRef)(void 0),V=(0,_.useRef)(void 0),q=(0,_.useSyncExternalStore)(u?.subscribe??Ic,()=>u===void 0||e===void 0||t===void 0?Ja():u.peek(e,t),Ja),ke=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,_.useEffect)(()=>{if(f===void 0){S(null);return}let $=tr({files:f,maxLines:uo});return S($),()=>$.close()},[f]),(0,_.useEffect)(()=>{if(w===null){Z(ot);return}return Z(w.getSnapshot()),w.subscribe(()=>Z(w.getSnapshot()))},[w]),(0,_.useEffect)(()=>{w===null||t===void 0||T!==null||w.open(t)},[w,t,T]),(0,_.useEffect)(()=>{if(!v||t===void 0||s===void 0){N(void 0);return}let $=new AbortController,ue=!0;return(async()=>{let mn=await s(t,$.signal);ue&&!$.signal.aborted&&N(mn?.absolutePath)})(),()=>{ue=!1,$.abort()}},[v,t,s]),(0,_.useEffect)(()=>{E("reading"),G(!1),le(!1)},[t]),(0,_.useEffect)(()=>()=>{ce.current!==void 0&&clearTimeout(ce.current),V.current!==void 0&&clearTimeout(V.current)},[]),(0,_.useEffect)(()=>{q?.conflict!==!0&&(h(!1),le(!1),V.current!==void 0&&clearTimeout(V.current))},[q?.conflict]),(0,_.useEffect)(()=>k.subscribe(()=>D($=>$+1)),[k]),(0,_.useEffect)(()=>{if(t===void 0||r!==void 0){M(Po);return}let $=Za(k,{path:t});if($===void 0){M(Po);return}let{contribution:ue}=$,mn=!0;return M(Ke=>Ke.status==="ready"&&Ke.contribution.id===ue.id?Ke:{status:"loading",contribution:ue}),$.module.then(Ke=>{mn&&M({status:"ready",contribution:ue,module:Ke})},Ke=>{mn&&M({status:"failed",contribution:ue,failure:wn(Ke)})}),()=>{mn=!1}},[k,t,r,X,Q]),t===void 0)return(0,I.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,I.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,I.jsx)("strong",{children:i("preview.empty.title")}),(0,I.jsx)("span",{children:i("preview.empty.description")})]})});let Ve=v&&r!==void 0,ve=rr(H),Ne=H.linkPath??t,Ce=v?B:H.linkTarget,fn=r===void 0&&e!==void 0&&n!==void 0&&c!==void 0&&!Ye(Ne),Hn=!v&&at(t),qe=v?!Ve&&m!==null&&L.status!=="ready"&&L.status!=="failed":H.status==="loading",pn=H.status==="ready",En=Hn&&b==="reading",Pe=v?Ve||m===null?"unavailable":L.status==="failed"?"failed":L.status==="ready"?"ready":"loading":H.status,nn=L.status==="ready"?L.module.renderer??L.contribution.id:v?"pending":En?"fallback":"plain",we=(0,_.useMemo)(()=>Pa(()=>xe.current),[]),K=(0,_.useMemo)(()=>()=>be.current??we,[we]),Oe=(0,_.useMemo)(()=>({register:$=>{be.current=$===null?null:Ca($),P(ue=>ue+1)},invalidate:()=>P($=>$+1)}),[]),ht=[Ne,String(b),H.offset,H.text.length,nn,String(C)].join("|"),Ue=!v&&pn,Fn={path:Ce??t,sessionId:e,files:n,t:i,visible:a,mode:b,...v?{}:{page:{text:H.text,offset:H.offset}},...s===void 0?{}:{locate:s},...Ue?{find:Oe}:{}},Mn=()=>{Rn(Ce??Ne).then($=>{$&&(G(!0),ce.current!==void 0&&clearTimeout(ce.current),ce.current=setTimeout(()=>G(!1),1400))})},Rr=()=>{let $=ke?.copyDraft();$!==void 0&&Rn($).then(ue=>{ue&&(h(!0),V.current!==void 0&&clearTimeout(V.current),V.current=setTimeout(()=>h(!1),1400))})},Ee=q?.error,Gn=Ee!=null&&q?.conflict!==!0,We=q?.conflict===!0,tn=q?.discarded??null,_e=!We&&tn!==null&&q?.dirty!==!0&&tn!==q?.text,rn;if(v){let $=L.status==="ready"?L.module.Body:void 0;rn=Ve?(0,I.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,I.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,I.jsx)("span",{children:i("preview.commitBinary.description")})]}):m===null?(0,I.jsx)(Fo,{t:i,revision:r}):L.status==="failed"?(0,I.jsx)(xo,{failure:L.failure,t:i,onRetry:()=>ye(ue=>ue+1)}):$===void 0?(0,I.jsx)(bo,{t:i}):(0,I.jsx)($,{...Fn})}else if(f===void 0)rn=(0,I.jsx)(Fo,{t:i,revision:r});else if(H.status==="failed")rn=(0,I.jsx)(xo,{failure:H.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{w?.retry()}});else if(!pn)rn=(0,I.jsx)(bo,{t:i});else{let $=L.status==="ready"?L.module.Body:Dc;rn=(0,I.jsx)($,{...Fn})}return(0,I.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Pe,"data-mode":v?"binary":En?"reading":"code","data-renderer":nn,children:[(0,I.jsxs)("header",{className:"fx-preview-bar",children:[(0,I.jsxs)("div",{className:"fx-preview-path",title:Ce===void 0?Ne:`${Ne} \u2192 ${Ce}`,"data-testid":"fs-preview-path",...Ce===void 0?{}:{"data-link":"followed"},children:[(0,I.jsx)(Xa,{path:Ne,sessionId:e,files:n,t:i,interactive:fn,unavailableReason:i("preview.crumbs.unavailable"),onOpenPeer:c??Lc}),Ce===void 0?null:(0,I.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",Ce]})]}),v?null:(0,I.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[ve.range,ve.range==="\u2014"?null:(0,I.jsxs)(I.Fragment,{children:[" ",i("preview.lines")]}),ve.total===void 0?null:(0,I.jsxs)("span",{className:"fx-preview-total",children:[" / ",ve.total," ",i("preview.lines")]})]}),(0,I.jsxs)("div",{className:"fx-preview-actions",children:[q===void 0?null:(0,I.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!q.dirty||q.saving||q.status!=="ready",onClick:()=>{ke?.save()},children:q.saving?i("preview.saving"):i("preview.save")}),Hn?(0,I.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>E($=>$==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(b==="reading"?"preview.source":"preview.reading")}):null,v?null:(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!pn||qe||H.offset<=1,onClick:()=>{w?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,I.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!pn||qe||H.eof,onClick:()=>{w?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),Ue?(0,I.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":De?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":De,onClick:()=>un($=>!$),children:i("preview.find")}):null,(0,I.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Mn,"data-testid":"fs-preview-copy",children:i(W?"preview.copied":"preview.copyPath")}),qe?(0,I.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),De&&Ue?(0,I.jsx)(Ea,{t:i,surface:K,stamp:ht,onClose:()=>un(!1)}):null,H.source==="first-parent"?(0,I.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,We||_e?(0,I.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":We?"conflict":"discarded",children:[(0,I.jsx)("strong",{children:i(We?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,I.jsx)("span",{className:"fx-conflict-hint",children:i(We?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,I.jsx)("span",{className:"fx-spacer"}),We?(0,I.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":ee?"discard":void 0,onClick:()=>{if(!ee&&q?.dirty===!0){le(!0);return}le(!1),ke?.reload({force:!0})},children:i(ee?"preview.conflict.discard":"preview.conflict.reload")}):null,_e?(0,I.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{tn!==null&&ke?.setDraft(tn)},children:i("preview.conflict.restore")}):null,We?(0,I.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Rr,children:i(O?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Gn?(0,I.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",No(Ee?.code??"io-error",Ee?.message??"",i))}):null,(0,I.jsx)("div",{className:"fx-preview-body","data-scroll":En?"y":"none",ref:xe,children:rn})]})}var ns="dsh-fs-explorer-styles",Kc=`
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
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
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
  position: fixed; z-index: 75; min-width: 150px; padding: 4px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 1px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }

/* The destination picker: one card, one level at a time. */
.fx-bookmark-picker {
  position: absolute; z-index: 65; top: calc(var(--fx-fs) * 3.1429); left: 12px; width: 280px; max-height: 60vh; overflow-y: auto; padding: 10px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 8px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }
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
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
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
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
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
/* The crumb row is a block element and the link arrow sits beside it, so this
   container has to be flex: overflow: hidden does nothing on an inline box,
   and the arrow would otherwise wrap onto its own line. */
.fx-preview-path {
  display: flex;
  align-items: center;
  gap: 6px;
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
  flex: none;
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

/* The crumb row replaces one opaque path string, so it must never widen the
   toolbar: every segment ellipsizes and only the file name keeps its width. */
.fx-preview-crumbs {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  overflow: hidden;
  font-family: var(--fx-mono);
  font-size: var(--fx-fs-code);
}
.fx-crumb-slot { display: inline-flex; align-items: center; min-width: 0; }
.fx-crumb {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  padding: 1px 3px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.fx-crumb[data-file="true"] { flex-shrink: 0; color: var(--fx-text); }
.fx-crumb:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-crumb:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-preview-crumbs[data-interactive="false"] .fx-crumb { cursor: default; }
.fx-preview-crumbs[data-interactive="false"] .fx-crumb:hover { background: transparent; }
.fx-crumb-sep {
  flex: none;
  padding: 0 2px;
  color: var(--fx-caption);
  user-select: none;
}
.fx-crumb-chevron { flex: none; margin-left: auto; color: var(--fx-caption); }

/* Fixed, not absolute: .fx-root clips its overflow, so an anchored card would
   be cut off at the toolbar's edge. Coordinates come from the crumb's own rect. */
.fx-peers {
  position: fixed;
  z-index: 76;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 220px;
  max-width: 320px;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
/* Every child of the flyout is flex: none. The card is a column flex box with
   a max-height, so the default shrink factor would flatten the head and the
   status line once the rows overflowed, clipping their own text. */
.fx-peers-head {
  /* Sticky with an opaque fill: the head names the directory being listed, so
     it has to stay readable while the rows scroll under it. The -4px top
     cancels the card's own padding, which the head would otherwise scroll
     away from. */
  position: sticky;
  top: -4px;
  z-index: 1;
  flex: none;
  padding: 4px 8px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: var(--fx-fs-code);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fx-peers-row {
  display: flex;
  flex: none;
  align-items: center;
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
.fx-peers-row:hover { background: var(--fx-hover); }
.fx-peers-row:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-peers-row[data-current="true"] { background: var(--fx-hover); color: var(--fx-text); }
.fx-peers-row[data-current="true"]::before { content: "\u2713"; flex: none; color: var(--fx-accent); }
.fx-peers-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-peers-status { flex: none; padding: 5px 8px; color: var(--fx-caption); }
`;function ts(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${ns}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=ns,t.textContent=Kc,e.head.appendChild(t),()=>{t.remove()}}var rs="lionad.fs",jc="@";function Lo(e){let n=e.replace(/\\/gu,"/").trim();for(;n.startsWith("./");)n=n.slice(2);return n.replace(/^\/+/u,"").replace(/\/+$/u,"")}function ur(e){let n=Lo(e);if(n==="")return"";let t=n.lastIndexOf("/");return t<0?n:n.slice(t+1)}function Bo(e){let n=e.kind==="directory"?"/":"";return`@${e.path}${n}`}function os(e,n,t){let r=Lo(e),o=n.trim()===""?ur(r):n.trim(),i={path:r,label:o,kind:t},a=Bo(i);return{kind:t==="directory"?"fs.directory":"fs.file",path:r,label:o,clipboardText:a,modelText:a,ref:JSON.stringify(i)}}function Ao(e){let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(!(typeof t.path!="string"||t.path===""))return{path:t.path,label:typeof t.label=="string"?t.label:ur(t.path),kind:t.kind==="directory"?"directory":"file"}}function Hc(e){let n=Ao(e);return n===void 0?`@${e}`:Bo(n)}function Gc(e){let n=Ao(e);return n===void 0?`@${e}`:Bo(n)}function is(e,n){let t={source:rs,ref:n.ref,label:n.label,clipboardText:n.clipboardText,appearance:n.kind==="fs.directory"?"folder":"file"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(t,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(t,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(n.clipboardText,r)?"text":"failed"}function Do(e){if(e===void 0||!e.session)return"noSession";if(!e.insertReference)return"noReference";if(!e.source)return"noReferenceSource"}function as(e){if(e===null||typeof e!="object")return{};let n=e,t=n.views,r=t?.open,o=n.openView,i=n.viewFocus,a=i?.request,l=i?.take,u=n.openViewOrSwitch,s=n.currentSessionId;return{openView:typeof r=="function"?(c,f,y)=>r.call(t,c,f,y):typeof o=="function"?(c,f,y)=>o.call(n,f,y):void 0,requestFocus:typeof a=="function"?(c,f)=>{a.call(i,c,f)}:void 0,takeFocus:typeof l=="function"?c=>{l.call(i,c)}:void 0,openViewOrSwitch:typeof u=="function"?(c,f)=>u.call(n,c,f):void 0,currentSessionId:typeof s=="function"?()=>s.call(n):void 0}}function Vc(e){if(e===null||typeof e!="object")return;let n=e;if(typeof n.id=="string"&&n.id!=="")return n.id;if(typeof n.sessionId=="string"&&n.sessionId!=="")return n.sessionId}function qc(e,n,t){let r=Ao(t);if(r===void 0)return!1;let o=Lo(r.path);if(o===""||n===void 0||n==="")return!1;let i=e.currentSessionId?.();if(i!==void 0&&i!==n)return!1;let a=`reveal:${o}`;return e.openView?.(n,te,a)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(te,a),e.openViewOrSwitch?.(te)?.opened===!0?!0:(e.takeFocus?.(te),!1)):e.openViewOrSwitch?.(te,a)?.focused===!0}function Uc(e=()=>({})){return{trigger:jc,name:rs,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:Hc,async serialize(n){return Gc(n)}},openReference(n,t){let r=t!==null&&typeof t=="object"?t.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=Vc(n)??o.currentSessionId?.();return qc(o,i,r)}catch{return!1}}}}function Xc(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function ss(e,n){let t=Uc(n),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],a=>{a.effect(()=>(r=a.inputTriggers.registerSource(t),o),"dsh-fs-explorer: reference source")}),i}catch{}try{let a=e.get?.("inputTriggers");if(Xc(a))return r=a.registerSource(t),i}catch{}return i}var g=require("react");var re={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark",reference:"reference.input"},Qe={close:"tab.close",closeOthers:"tab.close.others",closeRight:"tab.close.right",reference:re.reference};function ds(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function Yc(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function ls(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,u=[{id:re.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:re.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,c={id:re.reveal,label:n(Yc(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:re.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},y={id:re.copyRelative,label:n("menu.copy.relative")},k=Do(e.inputTarget),T={id:re.reference,label:n("menu.reference"),...k===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${k}`)}},v=e.remoteLinks,m=v!==void 0&&v.length>0?{id:re.copyRemote,label:n("menu.copy.remote"),submenu:v.map(w=>({id:w.id,label:w.label}))}:{id:re.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,c,{id:"menu.copy",label:n("menu.copy"),submenu:[f,y]},m,T,{id:re.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}function Zc(e){if(e.revision!==void 0)return"revision";if(e.absolute)return"absolute"}function cs(e,n){let t=e.panels.findIndex(u=>u.key===e.key);if(t<0)return[];let r=e.panels[t],o=Zc(r),i=Do(e.inputTarget),a=o??i;return[{id:Qe.reference,label:n("menu.reference"),...a===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${a}`)}},{id:Qe.close,label:n("menu.tab.close")},{id:Qe.closeOthers,label:n("menu.tab.closeOthers"),...e.panels.length>1?{}:{disabled:!0,reason:n("menu.tab.closeOthers.reason")}},...t===e.panels.length-1?[]:[{id:Qe.closeRight,label:n("menu.tab.closeRight")}]]}var He=require("react");var Me=require("react/jsx-runtime");function Jc(e){return new DOMRect(e.x,e.y,0,0)}function us(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Me.jsxs)(Me.Fragment,{children:[e.label,(0,Me.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function Oo({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=ir();if(i.Menu!==void 0){let a=i.Menu;return(0,Me.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:us(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:us(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>Jc(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Me.jsx)(Qc,{entries:e,anchor:n,onSelect:t,onClose:r})}function Qc({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,He.useRef)(null),[i,a]=(0,He.useState)(null),[l,u]=(0,He.useState)({left:n.x,top:n.y});(0,He.useEffect)(()=>{let c=o.current;if(c===null)return;let f=8,y=c.offsetWidth,k=c.offsetHeight,T=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-y-f)),v=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-k-f));u({left:T,top:v})},[n.x,n.y]),(0,He.useEffect)(()=>{let c=y=>{y.target instanceof Node&&o.current?.contains(y.target)!==!0&&r()},f=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("pointerdown",c),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",c),document.removeEventListener("keydown",f,!0)}},[r]);let s=(0,He.useCallback)(c=>{if(c.disabled!==!0){if(c.submenu!==void 0){a(f=>f===c.id?null:c.id);return}t(c.id)}},[t]);return(0,Me.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:c=>c.preventDefault(),children:e.map(c=>(0,Me.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Me.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":c.id,disabled:c.disabled===!0&&c.reason===void 0,"aria-disabled":c.disabled===!0?!0:void 0,"aria-haspopup":c.submenu===void 0?void 0:"menu","aria-expanded":c.submenu===void 0?void 0:i===c.id,title:c.disabled===!0?c.reason:void 0,onClick:()=>s(c),children:c.label}),c.submenu===void 0||i!==c.id?null:(0,Me.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:c.submenu.map(f=>(0,Me.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>s(f),children:f.label},f.id))})]},c.id))})}var ge=require("react"),U=require("react/jsx-runtime"),eu=120,Wo=280,fr=8;function pr(e){let n=typeof window>"u"?e:window.innerWidth-Wo;return Math.max(fr,Math.min(e,Math.max(fr,n)))}function nu(e,n){if(e===void 0)return{left:fr,top:fr};if(n<=1)return{left:pr(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+Wo<=window.innerWidth;return{left:pr(r?t:e.left-Wo-4),top:e.top}}function fs(){return(0,U.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,U.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ps({node:e,t:n,onOpen:t}){return(0,U.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,U.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function ms({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:u}){let[s,c]=(0,ge.useState)([]),f=(0,ge.useRef)(null),[y,k]=(0,ge.useState)(null),[T,v]=(0,ge.useState)(null),m=(0,ge.useCallback)(()=>{f.current!==null&&(clearTimeout(f.current),f.current=null)},[]),w=(0,ge.useCallback)(()=>{m(),c([])},[m]),S=(0,ge.useCallback)(()=>{m(),f.current=setTimeout(()=>{f.current=null,c([])},eu)},[m]);(0,ge.useEffect)(()=>()=>{f.current!==null&&clearTimeout(f.current)},[]),(0,ge.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let C=P=>{P.key!=="Escape"||P.isComposing||(P.preventDefault(),P.stopPropagation(),w())};return document.addEventListener("keydown",C,!0),()=>document.removeEventListener("keydown",C,!0)},[w,s.length]);let H=(0,ge.useCallback)((C,P,b)=>{m();let{left:E,top:W}=nu(b?.getBoundingClientRect(),P);c(G=>{let O=G.slice(0,P);return O.length===P&&O[P-1]?.groupId===C?G:[...O,{groupId:C,left:E,top:W,depth:P}]})},[m]),Z=(0,ge.useCallback)(C=>{w(),C.kind==="file"?t(C.path):C.kind==="folder"&&r(C.path)},[w,t,r]),L=C=>{let P,b=E=>{for(let W of E)W.kind==="group"&&(W.id===C&&(P=W),b(W.children))};return b(e.roots),P},M=C=>{let P=(b,E)=>{if(b.some(W=>W.id===C))return{parentId:E,siblings:b};for(let W of b){if(W.kind!=="group")continue;let G=P(W.children,W.id);if(G!==void 0)return G}};return P(e.roots,null)??{parentId:null,siblings:[]}},X=(C,P)=>{let b=P?.getBoundingClientRect(),{parentId:E,siblings:W}=M(C.id);k({node:C,parentId:E,siblings:W,left:pr(b?.left??0),top:(b?.bottom??0)+4})},D=(C,P)=>{let{parentId:b,siblings:E}=M(C.id);k({node:C,parentId:b,siblings:E,left:pr(P.clientX),top:P.clientY})},Q=(C,P)=>{let{parentId:b,siblings:E}=M(C.id),W=E.map(N=>N.id),G=W.indexOf(C.id),O=G+P;if(G<0||O<0||O>=W.length)return;let h=[...W],[B]=h.splice(G,1);B!==void 0&&(h.splice(O,0,B),k(null),u?.(b,h))},ye=C=>{let P=T;if(v(null),P===null||P===C)return;let b=e.roots.map(h=>h.id),E=b.indexOf(P),W=b.indexOf(C);if(E<0||W<0)return;let G=[...b],[O]=G.splice(E,1);O!==void 0&&(G.splice(W,0,O),u?.(null,G))};return(0,ge.useEffect)(()=>{if(y===null||typeof document>"u")return;let C=b=>{b.target instanceof Node&&(b.target instanceof Element&&b.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||k(null))},P=b=>{b.key!=="Escape"||b.isComposing||(b.preventDefault(),b.stopPropagation(),k(null))};return document.addEventListener("pointerdown",C),document.addEventListener("keydown",P,!0),()=>{document.removeEventListener("pointerdown",C),document.removeEventListener("keydown",P,!0)}},[y]),(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,U.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(C=>(0,U.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":T===C.id?"true":void 0,draggable:!0,onDragStart:()=>v(C.id),onDragEnd:()=>v(null),onDragOver:P=>P.preventDefault(),onDrop:P=>{P.preventDefault(),ye(C.id)},children:[C.kind==="group"?(0,U.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(P=>P.groupId===C.id),title:n("bookmarks.group"),onPointerEnter:P=>H(C.id,1,P.currentTarget),onFocus:P=>H(C.id,1,P.currentTarget),onPointerLeave:S,onContextMenu:P=>{P.preventDefault(),P.stopPropagation(),D(C,P)},children:[(0,U.jsx)("span",{className:"fx-bookmark-name",children:C.name}),(0,U.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,U.jsx)(fs,{})})]}):(0,U.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":C.kind,title:C.path,onClick:()=>Z(C),onContextMenu:P=>{P.preventDefault(),P.stopPropagation(),D(C,P)},children:(0,U.jsx)("span",{className:"fx-bookmark-name",children:C.name})}),(0,U.jsx)(ps,{node:C,t:n,onOpen:X})]},C.id))}),y===null?null:(0,U.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:y.left,top:y.top},children:[(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{k(null),i?.(y.node)},children:n("bookmarks.rename")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{k(null),a?.(y.node)},children:n("bookmarks.remove")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:y.siblings[0]?.id===y.node.id,onClick:()=>Q(y.node,-1),children:n("bookmarks.moveUp")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:y.siblings[y.siblings.length-1]?.id===y.node.id,onClick:()=>Q(y.node,1),children:n("bookmarks.moveDown")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{k(null),l?.(y.node)},children:n("bookmarks.moveToGroup")})]}),s.map(C=>{let P=L(C.groupId);return P===void 0?null:(0,U.jsxs)("div",{className:C.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":C.depth,role:"menu","aria-label":P.name,style:{left:C.left,top:C.top},onPointerEnter:m,onPointerLeave:S,children:[P.children.length===0?null:P.children.map(b=>(0,U.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[b.kind==="group"?(0,U.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(E=>E.groupId===b.id),onPointerEnter:E=>H(b.id,C.depth+1,E.currentTarget),onFocus:E=>H(b.id,C.depth+1,E.currentTarget),onContextMenu:E=>{E.preventDefault(),E.stopPropagation(),D(b,E)},children:[(0,U.jsx)("span",{className:"fx-bookmark-name",children:b.name}),(0,U.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,U.jsx)(fs,{})})]}):(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":b.kind,role:"menuitem",title:b.path,onClick:()=>Z(b),onContextMenu:E=>{E.preventDefault(),E.stopPropagation(),D(b,E)},children:(0,U.jsx)("span",{className:"fx-bookmark-name",children:b.name})}),(0,U.jsx)(ps,{node:b,t:n,onOpen:X})]},b.id)),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(w(),o(P.id))},children:n("bookmarks.newGroup")})]},P.id)})]})}var ze=require("react");var tu="dsh_fs_explorer",ru="bookmarks";function Be(e){throw new Error(`bookmarks: ${e}`)}function gs(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function mr(e,n,t){typeof e!="string"&&Be(`${n} must be a string`);let r=e.trim();return r===""&&Be(`${n} must not be empty`),r.length>t&&Be(`${n} must be at most ${String(t)} characters`),r}function ys(e,n,t,r){t>32&&Be(`${n} is nested deeper than ${String(32)} levels`),gs(e)||Be(`${n} must be an object`);let o=mr(e.id,`${n}.id`,200);r.has(o)&&Be(`duplicate id "${o}" at ${n}`),r.add(o);let i=mr(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Be(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let u=e.children;return Array.isArray(u)||Be(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((s,c)=>ys(s,`${n}.children[${String(c)}]`,t+1,r))}}if(l==="file"||l==="folder"){let u=mr(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:u}}return Be(`${n}.kind must be "group", "file" or "folder"`)}function Kn(e){gs(e)||Be("a bookmark tree must be an object"),e.version!==1&&Be(`version must be 1, received ${JSON.stringify(e.version)}`);let n=mr(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Be("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>ys(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var wp={name:tu,version:1,invalidRecords:"backup-and-skip",tables:{[ru]:{valueSchema:{parse:Kn}}}};function de(e){throw new Error(`bookmarks: ${e}`)}function Tn(e){return{version:1,roots:[],updatedAt:e}}function ct(e,n){let t=n.name.trim();if(t===""&&de("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&de(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function ou(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function xs(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,xs(r,n+1)),n)}function bs(e,n){let t=ou(e,n.id);t!==0&&xs(n,t)>32&&de(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function zo(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&zo(r.children,n,r.id)}function en(e,n){let t;return zo(e.roots,r=>{r.id===n&&(t=r)}),t}function ks(e,n){let t;return zo(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function vs(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&vs(t,n))}function $o(e,n){if(n===null)return e.roots;let t=en(e,n);return t===void 0&&de(`no group with id "${n}"`),t.kind!=="group"&&de(`"${n}" is not a group`),t.children}function ws(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function jn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:jn(r.children,n,t)})}function ut(e,n,t){return{version:1,roots:n,updatedAt:t}}var ft=()=>new Date().toISOString();function pt(e,n,t,r,o=ft){let i=$o(e,n);en(e,t.id)!==void 0&&de(`a node with id "${t.id}" already exists`);let a=ws(r,i.length),l=jn(e.roots,n,s=>[...s.slice(0,a),t,...s.slice(a)]),u=ut(e,l,o());return bs(u,t),u}function Rs(e,n,t=ft){let r=en(e,n);r===void 0&&de(`no node with id "${n}"`);let o=ks(e,n);o===void 0&&de(`no node with id "${n}"`);let i=jn(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:ut(e,i,t()),removed:r}}function Ss(e,n,t,r=ft){let o=t.trim();o===""&&de("a node needs a non-empty name"),en(e,n)===void 0&&de(`no node with id "${n}"`);let i=a=>a.map(l=>{let u=l.id===n?{...l,name:o}:l;return u.kind==="group"?{...u,children:i(u.children)}:u});return ut(e,i(e.roots),r())}function Ts(e,n,t,r,o=ft){let i=en(e,n);i===void 0&&de(`no node with id "${n}"`);let a=ks(e,n);if(a===void 0&&de(`no node with id "${n}"`),t!==null){let y=en(e,t);y===void 0&&de(`no group with id "${t}"`),y.kind!=="group"&&de(`"${t}" is not a group`),i.kind==="group"&&vs(i,t)&&de(`cannot move "${n}" into itself or its own descendant`)}let l=jn(e.roots,a,y=>y.filter(k=>k.id!==n)),u=$o({version:1,roots:l,updatedAt:e.updatedAt},t),s=ws(r,u.length),c=jn(l,t,y=>[...y.slice(0,s),i,...y.slice(s)]),f=ut(e,c,o());return bs(f,i),f}function Cs(e,n,t,r=ft){let o=$o(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&de(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||de(`"${s}" is not a child of ${n??"the root"}`);let l=new Map(o.map(s=>[s.id,s])),u=jn(e.roots,n,()=>t.map(s=>{let c=l.get(s);return c===void 0&&de(`"${s}" is not a child of ${n??"the root"}`),c}));return ut(e,u,r())}var Ge=require("react");var Ae=require("react/jsx-runtime"),iu=200;function au(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>iu?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function su(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function mt({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:u,submitKey:s}){let[c,f]=(0,Ge.useState)(()=>l??su(e)),[y,k]=(0,Ge.useState)(void 0),T=(0,Ge.useRef)(null),v=ir();(0,Ge.useEffect)(()=>{l!==void 0&&(f(l),k(void 0))},[l]),(0,Ge.useEffect)(()=>{let L=T.current;L!==null&&(L.focus(),L.select())},[]);let m=(0,Ge.useCallback)(()=>{if(a)return;let L=au(c,e);if(!L.ok){k(t(`prompt.error.${L.reason}`));return}k(void 0),r(L.name)},[a,e,r,t,c]),w=L=>{if(!L.nativeEvent.isComposing){if(L.key==="Escape"){L.preventDefault(),L.stopPropagation(),o();return}L.key==="Enter"&&(L.preventDefault(),m())}},S=y??i,H=v.Input,Z=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Ae.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(Z),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:w,children:[(0,Ae.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Ae.jsx)("strong",{children:t(Z)}),(0,Ae.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),H===void 0?(0,Ae.jsx)("input",{ref:T,className:"fx-name-input",type:"text",value:c,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":S===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:L=>{f(L.target.value),k(void 0)}}):(0,Ae.jsx)(H,{ref:T,className:"fx-name-input",value:c,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":S===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:L=>{f(L.target.value),k(void 0)}}),S===void 0?null:(0,Ae.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:S}),(0,Ae.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Ae.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Ae.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:m,children:t(s??"prompt.submit")})]})]})}var oe=require("react/jsx-runtime");function Ps(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function du(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function Es({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,u]=(0,ze.useState)(null),[s,c]=(0,ze.useState)(e),[f,y]=(0,ze.useState)(!1),[k,T]=(0,ze.useState)(void 0),v=(0,ze.useRef)(null);(0,ze.useEffect)(()=>{let M=D=>{D.target instanceof Node&&v.current?.contains(D.target)!==!0&&a()},X=D=>{D.key!=="Escape"||D.isComposing||f||(D.preventDefault(),D.stopPropagation(),a())};return document.addEventListener("pointerdown",M),document.addEventListener("keydown",X,!0),()=>{document.removeEventListener("pointerdown",M),document.removeEventListener("keydown",X,!0)}},[f,a]);let m=()=>(l===null?s.roots:en(s,l)?.kind==="group"?en(s,l).children:[]).filter(X=>X.kind==="group"),w=(0,ze.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(Ts(s,o.id,l));return}if(n===void 0)return;let M=ct(n.kind==="directory"?"folder":"file",{id:Ps(),name:n.name,path:n.path,createdAt:Date.now()});i(pt(s,l,M))}catch(M){T(M instanceof Error?M.message:String(M))}},[l,s,r,o,i,n]),S=M=>{try{let X=ct("group",{id:Ps(),name:M,createdAt:Date.now()}),D=pt(s,l,X);c(D),y(!1),T(void 0),u(X.id)}catch(X){T(X instanceof Error?X.message:String(X))}},H=du(s,l),Z=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),L=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,oe.jsxs)("div",{ref:v,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":Z,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,oe.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,oe.jsx)("strong",{children:Z}),r==="add"&&n!==void 0?(0,oe.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,oe.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,oe.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),H.map(M=>(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(M.id),children:M.name},M.id))]}),(0,oe.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:m().length===0?(0,oe.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):m().map(M=>(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(M.id),children:(0,oe.jsx)("span",{className:"fx-bookmark-name",children:M.name})},M.id))}),k===void 0?null:(0,oe.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:k}),f?(0,oe.jsx)(mt,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:S,onCancel:()=>y(!1)}):(0,oe.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>y(!0),children:t("bookmarks.newGroup")}),(0,oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:w,children:L})]})]})}function _o(e){return`dsh-fs-explorer.bookmarks.${e}`}function Ko(e){return`${_o(e)}.pending`}function gr(){try{return globalThis.localStorage??void 0}catch{return}}function Fs(e){let n=gr();if(n===void 0)return;let t;try{t=n.getItem(_o(e))}catch{return}if(t!==null)try{return Kn(JSON.parse(t))}catch{return}}function lu(e,n){let t=gr();if(t!==void 0)try{t.setItem(_o(e),JSON.stringify(n)),t.setItem(Ko(e),"1")}catch{}}function cu(e){let n=gr();if(n===void 0)return!1;try{return n.getItem(Ko(e))==="1"}catch{return!1}}function Ms(e){let n=gr();if(n!==void 0)try{n.removeItem(Ko(e))}catch{}}function Ns(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(Ms(n),r.tree):cu(n)?Fs(n)??Tn(new Date().toISOString()):Tn(new Date().toISOString())}catch{}return Fs(n)??Tn(new Date().toISOString())},async save(n,t){let r=Kn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){Ms(n);return}}catch{}lu(n,r)}}}var jo="fs-explorer.treePaneWidth";function Ho(e){return Math.min(520,Math.max(180,e))}function Ls(e){if(e==null)return null;let n;try{n=e.getItem(jo)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function yr(e,n){let t=Math.round(Ho(n));if(e!=null)try{e.setItem(jo,String(t))}catch{}return t}function Bs(e){if(e!=null)try{e.removeItem(jo)}catch{}}function As(e,n){return Math.round(e)===Math.round(n)}var Is=16;function Ds(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Is};case"ArrowRight":return{kind:"nudge",delta:Is};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var gt=require("react"),cn=require("react/jsx-runtime");function Os({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:u,focusSignal:s}){let c=(0,gt.useRef)(null),f=(0,gt.useRef)(s);(0,gt.useEffect)(()=>{f.current!==s&&(f.current=s,c.current?.focus())},[s]);let y=T=>{if(!T.nativeEvent.isComposing){if(T.key==="Escape"){T.preventDefault(),T.stopPropagation(),u();return}if(T.key==="ArrowDown"||T.key==="ArrowUp"){T.preventDefault(),a(T.key==="ArrowDown"?1:-1);return}T.key==="Enter"&&(T.preventDefault(),l())}},k=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,cn.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:y,children:[(0,cn.jsx)("input",{ref:c,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:T=>i(T.currentTarget.value)}),k===null?null:(0,cn.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[k,o?(0,cn.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,cn.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,cn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:u,children:"\xD7"})]})}function $e(e){return e!==null&&typeof e=="object"}function hr(e){try{return e()}catch{return}}function uu(e){let n=hr(()=>typeof e.get=="function"?e.get("connection"):void 0),t=$e(n)?n.rpc:void 0;if(!(!$e(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${mi}/${r}`,o,i)}function fu(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function Go(e){return $e(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function pu(e){return()=>{let n=uu(e);if(n!==void 0)return fu(n);let t=hr(()=>e.fsExplorerWorkspace);if(Go(t))return t;let r=hr(()=>$e(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Go(r))return r;let o=hr(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Go(o))return o}}function Cn(e){let n=$e(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=$e(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return $e(t)?t:void 0}var mu=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function Pn(e){let n=$e(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:mu.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function gu(e){let n=Cn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Pn(n.error)};let t=$e(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function yu(e){let n=Cn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Pn(n.error)};let t=$e(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function hu(e){let n=Cn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Pn(n.error)}:{ok:!0}}function xu(e){let n=Cn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Pn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function bu(e){let n=Cn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Pn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Kn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function ku(e){let n=Cn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Pn(n.error)}:{ok:!0}}function vu(e){let n=Cn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Pn(n.error)};let t=$e(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var yt={code:"unsupported",message:"the workspace service is unavailable"};function Ws(e){let n=pu(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:yt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),gu),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),yu),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),hu),create:(r,o,i,a,l)=>t(u=>{let s=u.create;return typeof s!="function"?{ok:!1,error:yt}:s.call(u,{sessionId:r,parent:o,name:i,kind:a},l)},xu),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:yt}:a.call(i,{sessionId:r},o)},bu),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:yt}:l.call(a,{sessionId:r,tree:o},i)},ku),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:yt}:a.call(i,{sessionId:r},o)},vu)}}var wu={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function Ru(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var Su={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function Tu(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",s=zs(t[2]??"");return s===""?void 0:{base:`https://${u}/${s}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=zs(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function zs(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Cu(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Pu(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Eu(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Eu(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function Fu(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function $s(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=Fu(t,r);if(a===void 0)return[];let l=Pu(i),u=Cu(a),s=[],c=new Set;for(let f of n){if(c.has(f.name))continue;let y=Tu(f.url);if(y===void 0)continue;c.add(f.name);let k=Ru(y.host),T=Su[k][o],v=u===""?"":`/${u}`;s.push({id:`copy.remote.${f.name}`,label:`${f.name} \xB7 ${wu[k]}`,url:`${y.base}/${T}/${l}${v}`})}return s}var F=require("react/jsx-runtime");function Mu({open:e}){return(0,F.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,F.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,F.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,F.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function Nu(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Iu=()=>({status:"loading",nodes:[],truncated:!1,total:0});function qo(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var js="dsh-fs-explorer.show-ignored";function Lu(e){if(e==null)return!0;try{return e.getItem(js)!=="0"}catch{return!0}}function Bu(e,n){if(n!=null)try{n.setItem(js,e?"1":"0")}catch{}}var Au=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Ks=new Map;function Du(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function xr({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,F.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,F.jsx)("strong",{children:e}),n===void 0?null:(0,F.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,F.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Ou(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Hs({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:u,workspace:s,fileReferences:c,reference:f,referenceSourceAvailable:y}){let k=ca();function T(v){let m=v.sessionId??e.currentSessionId(),w=(0,g.useRef)(m);w.current=m;let S=(0,g.useMemo)(()=>r(),[r]),H=(0,g.useMemo)(()=>o(),[o]),Z=(0,g.useMemo)(()=>i(),[i]),L=(0,g.useMemo)(()=>m===void 0||u===void 0?void 0:u(m),[u,m]),M=(0,g.useMemo)(()=>m===void 0||s===void 0?void 0:s(m),[s,m]),X=(0,g.useMemo)(()=>Ns(M),[M]),[D,Q]=(0,g.useState)(()=>Tn(new Date().toISOString())),ye=(0,g.useRef)(!1),[C,P]=(0,g.useState)(null),[b,E]=(0,g.useState)(null),W=(0,g.useRef)(!1),G=(0,g.useRef)(!1),[O,h]=(0,g.useState)(null),[B,N]=(0,g.useState)(null),[ee,le]=(0,g.useState)(void 0),[De,un]=(0,g.useState)(null),xe=(0,g.useRef)(null),[be,ce]=(0,g.useState)(null),[V,q]=(0,g.useState)(()=>new Map),[ke,Ve]=(0,g.useState)(void 0),[ve,Ne]=(0,g.useState)(void 0),[Ce,fn]=(0,g.useState)(void 0),[Hn,qe]=(0,g.useState)(void 0),[pn,En]=(0,g.useState)(Ks),Pe=(0,g.useRef)(V);Pe.current=V;let[nn,we]=(0,g.useState)(()=>new Set),K=(0,g.useMemo)(()=>k.forSession(m),[k,m]),Oe=(0,g.useSyncExternalStore)(K.subscribe,K.snapshot,K.snapshot),ht=Oe.panels.find(d=>d.key===Oe.active),Ue=ht?.path,Fn=ht?.revision,[Mn,Rr]=(0,g.useState)(0),Ee=(0,g.useRef)(new Map),Gn=(0,g.useRef)(void 0),[We,tn]=(0,g.useState)([]),[_e,rn]=(0,g.useState)(()=>Lu(qo())),[$,ue]=(0,g.useState)(null),[mn,Ke]=(0,g.useState)(!1),[Js,Nn]=(0,g.useState)(null),xt=(0,g.useRef)(null);xt.current=$?.path??null;let on=(0,g.useMemo)(()=>qo(),[]),[gn,In]=(0,g.useState)(()=>Ls(on)),Sr=(0,g.useRef)(null),Ln=(0,g.useRef)(null),ie=V.get(""),bt=ie?.status==="ready",Yo=(0,g.useCallback)((d,p,x,R)=>{K.open(d,p,x,R)},[K]),Bn=(0,g.useCallback)(d=>{let p=new Set(K.snapshot().panels.map(A=>A.key)),x=[];for(let A of d){if(!p.has(A))continue;if((m===void 0?void 0:l?.peek(m,A))?.dirty===!0){x.push(A);continue}m!==void 0&&l?.forget(m,A),K.close(A)}let R=x[0];Nn(null),ue(R===void 0?null:{path:R,rest:x.slice(1)})},[l,m,K]),yn=(0,g.useCallback)(d=>{ue(null),Nn(null),d.length>0&&Bn(d)},[Bn]),hn=(0,g.useCallback)(d=>{let p=d??K.snapshot().active??void 0;p!==void 0&&Bn([p])},[Bn,K]);(0,g.useEffect)(()=>{let d=e.registerPageCloser;if(typeof d=="function")return d(()=>{let p=na({viewSessionId:m,currentSessionId:e.currentSessionId(),activePanel:K.snapshot().active,confirming:xt.current!==null});return p==="close"&&hn(),p!=="pass"})},[hn,m,K,e]);let Qs=(0,g.useCallback)(()=>{let d=$;if(d===null)return;let p=m===void 0?void 0:l?.find(m,d.path);if(p===void 0){m!==void 0&&l?.forget(m,d.path),K.close(d.path),yn(d.rest);return}Ke(!0),Nn(null),p.save().then(x=>{if(Ke(!1),!x.ok){let R=p.getSnapshot().error;Nn(t("panel.confirm.failed").replace("{message}",No(x.code,R?.message??"",t)));return}m!==void 0&&l?.forget(m,d.path),K.close(d.path),yn(d.rest)})},[yn,l,$,m,K,t]),ed=(0,g.useCallback)(()=>{let d=$;if(Nn(null),d===null){ue(null);return}m!==void 0&&l?.forget(m,d.path),K.close(d.path),yn(d.rest)},[yn,l,$,m,K]),Tr=(0,g.useCallback)(()=>{let d=$;if(d===null){Nn(null);return}yn(d.rest)},[yn,$]),fe=(0,g.useCallback)(async(d,p,x)=>{Ee.current.get(d)?.abort();let R=new AbortController;Ee.current.set(d,R),q(A=>new Map(A).set(d,Iu()));try{let A=await x.list(p,On(d),R.signal);if(R.signal.aborted||w.current!==p)return!1;let j=Sn(A);if(!j.ok)return q(ae=>new Map(ae).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:j.message})),!1;let Re=Dn(j.listing.entries);return q(ae=>new Map(ae).set(d,{status:"ready",nodes:Re,truncated:j.listing.truncated===!0,total:j.listing.entries.length})),!0}catch(A){return R.signal.aborted||q(j=>new Map(j).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:dr(A)})),!1}finally{Ee.current.get(d)===R&&Ee.current.delete(d)}},[]);(0,g.useEffect)(()=>{for(let d of Ee.current.values())d.abort();return Ee.current.clear(),q(new Map),we(new Set),Gn.current=void 0,m!==void 0&&S!==void 0&&fe("",m,S),()=>{for(let d of Ee.current.values())d.abort();Ee.current.clear()}},[m,S,Mn,fe]),(0,g.useEffect)(()=>{if(m===void 0||H===void 0){Ve(void 0),Ne(void 0),fn(void 0),qe(void 0);return}let d=!0,p=new AbortController;return Ve(void 0),Ne(void 0),fn(void 0),qe(void 0),Promise.resolve().then(()=>H.snapshot({sessionId:m,maxCommits:1},p.signal)).then(x=>{if(!d)return;let R=lr(x);if(!R.ok){Ve(void 0),Ne(void 0),fn(void 0),qe(void 0);return}Ve(wi(Bt(R.status),R.stats)),Ne(R.head),fn(R.root),qe(R.remotes)}).catch(()=>{d&&(Ve(void 0),Ne(void 0),fn(void 0),qe(void 0))}),()=>{d=!1,p.abort()}},[m,H,Mn]),(0,g.useEffect)(()=>{let d=S?.read;if(m===void 0||S===void 0||typeof d!="function"||!bt){En(Ks);return}let p=m,x=new AbortController,R=async(j,Re)=>{try{let ae=Du(await d.call(S,p,Re,{},x.signal));return ae===void 0?void 0:[j,ae]}catch{return}},A=Ci.filter(j=>j!==".gitmodules").map(j=>R(j,j));return Ce!==void 0&&A.push(R(".gitmodules",`${Ce.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(A).then(j=>{if(x.signal.aborted||w.current!==p)return;let Re=new Map;for(let bn of j)bn!==void 0&&Re.set(bn[0],bn[1]);let ae=Pe.current.get(""),Yn=new Set(ae?.status==="ready"?ae.nodes.filter(bn=>bn.kind==="directory").map(bn=>bn.name):[]);En(Ot(Re,Yn))}),()=>x.abort()},[m,S,bt,Ce,Mn]);let[nd,td]=(0,g.useState)(void 0),Cr=(0,g.useRef)(void 0),Zo=(0,g.useRef)(0),Pr=(0,g.useRef)(void 0),Er=(0,g.useRef)(!1),[kt,Jo]=(0,g.useState)(void 0),Vn=(0,g.useCallback)((d,p,x)=>{Zo.current+=1,td({nonce:Zo.current,...d===void 0?{}:{path:d},...p===void 0?{}:{delta:p},focus:x})},[]),An=(0,g.useCallback)((d,p)=>{let x=sa(d);if(we(R=>{let A=new Set(R);for(let j of x)A.add(j);return A}),!(m===void 0||S===void 0)){for(let R of x)Pe.current.get(R)===void 0&&fe(R,m,S);p==="directory"&&Pe.current.get(d)===void 0&&fe(d,m,S)}},[S,fe,m]),vt=(0,g.useCallback)(d=>{let p=zn(Pe.current).find(x=>x.path===d);if(An(d,p?.kind),p?.kind==="directory"&&we(x=>new Set(x).add(d)),Er.current=!0,p===void 0){Pr.current=d;return}Vn(d,void 0,!0)},[Vn,An]),qn=(0,g.useCallback)(d=>{d!==""&&(Jo({path:d}),vt(d))},[vt]),rd=(0,g.useCallback)((d,p)=>{if(p==="directory"){qn(d);return}K.open(d,1,!1)},[qn,K]),Qo=(0,g.useCallback)((d,p)=>{if(!p){qn(d);return}if(m===void 0||S===void 0)return;Er.current=!0;let x=m;Promise.resolve(S.list(x,d)).then(R=>{if(w.current!==x)return;let A=Sn(R),j=A.ok?A.listing.path:void 0;j===void 0||j===""||qn(j)},()=>{})},[qn,S,m]),wt=(0,g.useCallback)(d=>{er(d,{open:Yo,reveal:vt,enter:Qo})},[Yo,vt,Qo]);(0,g.useEffect)(()=>{let d=v.viewRequest;if(d==null||d.view!==te)return;let p=`${d.view}:${d.focus}`;Gn.current!==p&&(Gn.current=p,wt(d.focus),v.completeViewRequest?.())},[v.viewRequest,v.completeViewRequest,wt]),(0,g.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||m===void 0)return;let p=()=>{let x=d.take(te);x!==void 0&&wt(x)};return p(),d.subscribe(p)},[e,m,wt]),(0,g.useEffect)(()=>{if(Ue===void 0||Fn!==void 0||!bt||Ye(Ue))return;let d=tt(Ue);if(d.length===0||(we(x=>d.every(R=>x.has(R))?x:new Set([...x,...d])),m===void 0||S===void 0))return;let p=d.filter(x=>Pe.current.get(x)?.status!=="ready");p.length!==0&&Promise.all(p.map(x=>fe(x,m,S)))},[Ue,Fn,bt,m,S,fe]);let ei=(0,g.useCallback)(()=>{if(typeof document>"u")return!1;let d=document.querySelector("[data-composer-input]");return d===null?!1:(d.focus(),!0)},[]),od=(0,g.useCallback)(d=>{if(d.button!==0||Ln.current!==null||Au())return;let p=Sr.current?.previousElementSibling;if(p instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}Ln.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:gn},document.body.classList.add("fx-pane-resizing")}},[gn]),id=(0,g.useCallback)(d=>{let p=Ln.current;p===null||p.pointerId!==d.pointerId||In(Ho(p.baseWidth+d.clientX-p.startX))},[]),Fr=(0,g.useCallback)(d=>{let p=Ln.current;if(p===null||p.pointerId!==d.pointerId)return;Ln.current=null,document.body.classList.remove("fx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let x=p.baseWidth+d.clientX-p.startX;if(As(x,p.baseWidth)){In(p.restWidth);return}In(yr(on,x))},[on]),Mr=(0,g.useCallback)(()=>{Bs(on),In(null)},[on]),ad=(0,g.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let p=Ds(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(p===null)return;if(d.preventDefault(),d.stopPropagation(),p.kind==="reset"){Mr();return}if(p.kind==="min"||p.kind==="max"){let A=p.kind==="min"?180:520;In(yr(on,A));return}let x=Sr.current?.previousElementSibling,R=x instanceof HTMLElement?x.getBoundingClientRect().width:gn??180;In(yr(on,R+p.delta))},[on,Mr,gn]);(0,g.useEffect)(()=>()=>{Ln.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=p=>{if(!(p.isComposing||ea(p.target))){if(Ou(p)){let x=K.snapshot().active,R=x===null||l===void 0||m===void 0?void 0:l.find(m,x);if(R===void 0)return;p.preventDefault(),p.stopPropagation(),R.save();return}for(let x of qt)if(Qi(p,x)){if(x.action==="closePanel"&&K.snapshot().active===null)return;p.preventDefault(),p.stopPropagation(),x.action==="nextPanel"?K.next():x.action==="previousPanel"?K.previous():hn();return}}};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[l,hn,m,K]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=Xt({focusComposer:ei,hasModal:()=>xt.current!==null||W.current||G.current||Ut(document)}),p=x=>d(x);return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[ei]),(0,g.useEffect)(()=>{if($===null||typeof document>"u")return;let d=p=>{p.key!=="Escape"||p.isComposing||(p.preventDefault(),p.stopPropagation(),Tr())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[$,Tr]);let ni=(0,g.useMemo)(()=>It(We),[We]),Rt=(0,g.useMemo)(()=>_t(V,nn,ke,pn,{ignored:ni,showIgnored:_e,hiddenLabel:d=>t("state.hiddenDirectory").replace("{count}",String(d))}),[V,nn,ke,pn,ni,_e,t]),[an,ti]=(0,g.useState)(""),[ri,St]=(0,g.useState)([]),[oi,Tt]=(0,g.useState)(null),[sd,Un]=(0,g.useState)(!1),[dd,ld]=(0,g.useState)(0),cd=(0,g.useCallback)(()=>ld(d=>d+1),[]);(0,g.useEffect)(()=>{let d=ia(an);if(d===void 0){St([]),Tt(null),Un(!1);return}let p=()=>{let A=aa(zn(Pe.current),d);St(oo(A.map(j=>({path:j.path,kind:j.kind==="directory"?"directory":"file"})),ke)),Tt("loaded"),Un(!1)},x=c?.();if(x===void 0||m===void 0){p();return}let R=new AbortController;return Un(!0),Promise.resolve(x.list(m,d,R.signal)).then(A=>{if(R.signal.aborted)return;let j=oa(A);St(oo(j,ke)),Tt("index"),Un(!1)},A=>{R.signal.aborted||(console.debug(`[${Fe}] the file index failed, searching listed rows instead`,A),p())}),()=>R.abort()},[an,m,ke,c]);let Nr=oi!==null,ud=Nr?ri:Rt;(0,g.useEffect)(()=>{let d=Pr.current;if(d===void 0)return;let p=zn(Pe.current).find(x=>x.path===d);p!==void 0&&(Pr.current=void 0,p.kind==="directory"&&(An(d,p.kind),we(x=>new Set(x).add(d))),Vn(d,void 0,!0))},[Rt,Vn,An]),(0,g.useEffect)(()=>{if(kt===void 0)return;let d=V.get(kt.path);if(d===void 0||d.status==="loading"||(Jo(void 0),d.status!=="ready"))return;let p=Bi(d.nodes,kt.path);p!==void 0&&K.open(p,1,!1)},[kt,V,K]);let[fd,Ct]=(0,g.useState)(void 0),ii=(0,g.useRef)(!1);(0,g.useEffect)(()=>{if(ii.current||typeof document>"u")return;let d=Ai({rows:Rt,panelCount:K.snapshot().panels.length,hasModal:Ut(document)});d.kind!=="skip"&&(ii.current=!0,!Er.current&&(d.open!==void 0&&K.open(d.open),Ct({path:d.focus})))},[Rt,K]);let pd=(0,g.useCallback)(()=>Ct(void 0),[]),Xn=ke===void 0?void 0:Object.keys(ke).length,md=ke===void 0?"neutral":Object.values(ke).some(d=>d.status==="conflicted")?"conflict":Xn===0?"success":"warning",ai=vi(ve),gd=(0,g.useCallback)(d=>{if(m===void 0||S===void 0)return;if(nn.has(d)){we(x=>{let R=new Set(x);return R.delete(d),R});return}we(x=>new Set(x).add(d));let p=V.get(d);(p===void 0||p.status==="failed")&&fe(d,m,S)},[nn,V,m,S,fe]),si=(0,g.useCallback)(d=>{m===void 0||S===void 0||fe(d,m,S)},[m,S,fe]);(0,g.useEffect)(()=>{let d=!0;if(ye.current=!1,m===void 0){Q(Tn(new Date().toISOString()));return}return X.load(m).then(p=>{d&&!ye.current&&Q(p)}).catch(()=>{}),()=>{d=!1}},[X,m]);let yd=(0,g.useCallback)(d=>{let p=[...tt(d),d];if(we(x=>{let R=new Set(x);for(let A of p)R.add(A);return R}),m!==void 0&&S!==void 0){let x=p.filter(R=>Pe.current.get(R)?.status!=="ready");x.length>0&&Promise.all(x.map(R=>fe(R,m,S)))}Ct({path:d})},[m,S,fe]),hd=(0,g.useCallback)(d=>{K.open(d)},[K]),ne=(0,g.useCallback)((d,p)=>{xe.current!==null&&clearTimeout(xe.current),un({text:d,tone:p}),xe.current=setTimeout(()=>{xe.current=null,un(null)},4e3)},[]);(0,g.useEffect)(()=>()=>{xe.current!==null&&clearTimeout(xe.current)},[]);let xn=(0,g.useCallback)(d=>{ye.current=!0,Q(d),m!==void 0&&X.save(m,d).catch(()=>{ne(t("bookmarks.saveFailed"),"error")})},[ne,X,m,t]),xd=(0,g.useCallback)(d=>{try{xn(Rs(D,d.id).tree),ne(t("bookmarks.removed"),"ok")}catch{}},[ne,D,xn,t]),bd=(0,g.useCallback)((d,p)=>{try{xn(Cs(D,d,p))}catch{}},[D,xn]);(0,g.useEffect)(()=>{if(M===void 0){le(void 0);return}let d=!0;return M.capabilities(m??"").then(p=>{d&&le(p.ok?p.capabilities:void 0)}),()=>{d=!1}},[M,m]),(0,g.useEffect)(()=>{let d=M?.ignored;if(m===void 0||M===void 0||typeof d!="function"){tn([]);return}let p=new AbortController,x=!0;return Promise.resolve().then(()=>d.call(M,m,p.signal)).then(R=>{x&&tn(R.ok?R.entries:[])}).catch(()=>{x&&tn([])}),()=>{x=!1,p.abort()}},[m,M,Mn]);let kd=(0,g.useCallback)(()=>{rn(d=>{let p=!d;return Bu(p,qo()),p})},[]),vd=(0,g.useCallback)((d,p,x)=>{let R=d===void 0?"":d.kind==="directory"?d.path:ds(d.path);if(h({row:d,anchor:p,absolutePath:void 0,trigger:x,createParent:R}),d===void 0||M===void 0)return;let A=d.path;M.info(m??"",A).then(j=>{h(Re=>Re===null||Re.row?.path!==A?Re:{...Re,absolutePath:j.ok?j.info.absolutePath:void 0})})},[m,M]),wd=(0,g.useCallback)(()=>h(null),[]),Rd=(0,g.useCallback)((d,p,x)=>{N({key:d,anchor:p,trigger:x})},[]),Sd=(0,g.useCallback)(()=>N(null),[]),Pt=(0,g.useCallback)(()=>{let d=v.inputActions;return m===void 0||d===void 0?void 0:{session:!0,insertReference:typeof f?.(m)?.insertReference=="function",source:y?.()===!0}},[v.inputActions,y,f,m]),Et=(0,g.useCallback)((d,p,x)=>{let R=v.inputActions;if(m===void 0||R===void 0){ne(t("notice.referenceFailed"),"error");return}let A=f?.(m),j=os(d,p,x),Re=is({captureSpan:()=>{let ae=R.captureInsertion?.();return ae===void 0?void 0:{start:ae.start,end:ae.end,draftRev:ae.draftRev}},insertReference:(ae,Yn)=>A?.insertReference?.(ae,Yn)??!1,insertText:(ae,Yn)=>R.insertText?.(ae,Yn)??!1,canInsertReference:y?.()===!0},j);if(Re==="failed"){ne(t("notice.referenceFailed"),"error"),A?.notify?.("error",t("notice.referenceFailed"));return}A?.focus?.(),Re==="text"&&ne(t("notice.referenced").replace("{name}",j.label),"ok")},[ne,v.inputActions,f,m,t]),Td=(0,g.useCallback)(d=>{let p=B;if(N(null),p===null)return;if(d===Qe.reference){let R=K.snapshot().panels.find(j=>j.key===p.key);if(R===void 0)return;let A=zn(Pe.current).find(j=>j.path===R.path);Et(R.path,ur(R.path),A?.kind==="directory"?"directory":"file");return}if(d===Qe.close){hn(p.key);return}let x=d===Qe.closeOthers?"others":d===Qe.closeRight?"right":void 0;x!==void 0&&Bn(la(K.snapshot().panels,p.key,x))},[Bn,Et,hn,K,B]);W.current=O!==null,G.current=B!==null;let Ft=(0,g.useMemo)(()=>$s({remotes:Hn,root:Ce,absolutePath:O?.absolutePath,kind:O?.row?.kind??"file",head:ve}),[O?.absolutePath,O?.row?.kind,Ce,ve,Hn]),Ir=(0,g.useCallback)(d=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${d.code}`)),[t]),Cd=(0,g.useCallback)(d=>{let p=O;if(h(null),p===null)return;if(d===re.createFile||d===re.createFolder){let R=p.createParent;if(R===void 0)return;ce({kind:d===re.createFolder?"directory":"file",parent:R,error:void 0,busy:!1});return}let x=p.row;if(x!==void 0){if(d.startsWith(`${re.copyRemote}.`)){let R=Ft.find(A=>A.id===d);if(R===void 0)return;Rn(R.url).then(A=>{ne(A?t("notice.copiedRemote").replace("{remote}",R.label):t("notice.copyFailed"),A?"ok":"error")});return}if(d===re.copyRelative){Rn(x.path).then(R=>{ne(t(R?"notice.copiedRelative":"notice.copyFailed"),R?"ok":"error")});return}if(d===re.copyAbsolute){let R=p.absolutePath;if(R===void 0)return;Rn(R).then(A=>{ne(t(A?"notice.copiedAbsolute":"notice.copyFailed"),A?"ok":"error")});return}if(d===re.addBookmark){P({mode:"add",target:{name:x.name,path:x.path,kind:x.kind}});return}if(d===re.reference){Et(x.path,x.name,x.kind);return}if(d===re.reveal){if(M===void 0){ne(Ir({code:"unsupported",message:""}),"error");return}M.reveal(m??"",x.path).then(R=>{if(!R.ok){ne(Ir(R.error),"error");return}let A=t(`menu.manager.${ee?.fileManager??"directory"}`);ne(t("notice.revealed").replace("{manager}",A),"ok")})}}},[ne,ee,O,Et,Ft,Ir,m,t,M]),Pd=(0,g.useCallback)(d=>{let p=be;if(p===null)return;if(M===void 0||M.create===void 0){ce({...p,error:t("prompt.error.unsupported"),busy:!1});return}let x=m;if(x===void 0){ce({...p,error:t("prompt.error.no-workspace"),busy:!1});return}ce({...p,busy:!0,error:void 0}),M.create(x,p.parent,d,p.kind).then(R=>{if(!R.ok){ce(j=>j===null?j:{...j,busy:!1,error:t(`prompt.error.${R.error.code}`)});return}ce(null);let A=R.path;if(S!==void 0&&fe(p.parent,x,S),p.kind==="file"){K.open(A),ne(t("notice.createdFile"),"ok");return}we(j=>new Set(j).add(A)),S!==void 0&&fe(A,x,S),Ct({path:A}),ne(t("notice.createdFolder"),"ok")})},[ne,S,fe,be,m,K,t,M]),Ed=(0,g.useCallback)(()=>ce(null),[]),Fd=(0,g.useMemo)(()=>O===null?[]:ls({row:O.row,notices:{workspace:M!==void 0},capabilities:ee,absolutePath:O.absolutePath,createParent:O.createParent,remoteLinks:O.row===void 0?void 0:Ft,bookmarkTarget:O.row===void 0?void 0:{name:O.row.name,path:O.row.path,kind:O.row.kind},inputTarget:Pt()},t),[ee,O,Pt,Ft,t,M]),di=(0,g.useMemo)(()=>B===null?[]:cs({panels:Oe.panels,key:B.key,inputTarget:Pt()},t),[Oe.panels,Pt,t,B]),Lr=(0,g.useCallback)(d=>{let p=zn(Pe.current).find(x=>x.path===d);if(An(d,p?.kind),p?.kind==="directory"){we(x=>new Set(x).add(d));return}K.open(d)},[An,K]),Md=(0,g.useCallback)(()=>{Cr.current!==void 0&&Lr(Cr.current)},[Lr]),Mt=(0,g.useCallback)(()=>{ti(""),St([]),Tt(null),Un(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,g.useEffect)(()=>{if(an===""||typeof document>"u")return;let d=p=>{p.key!=="Escape"||p.isComposing||p.defaultPrevented||xt.current!==null||Ut(document)||(p.preventDefault(),p.stopPropagation(),Mt())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[an,Mt]);let Nd=()=>we(new Set),Id=()=>Rr(d=>d+1),Ld=m===void 0?"no-session":S===void 0?"no-service":ie===void 0||ie.status==="loading"?"loading":ie.status==="failed"?"failed":ie.nodes.length===0?"empty":"tree";return(0,F.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Ld,"data-session":m??"","data-testid":"fs-explorer-view",children:[(0,F.jsxs)("header",{className:"fx-head",children:[(0,F.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,F.jsx)(dt,{open:!0})}),(0,F.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,F.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,F.jsx)(ms,{tree:D,t,onOpenFile:hd,onOpenFolder:yd,onCreateGroup:d=>E({mode:"group",parentId:d}),onRename:d=>E({mode:"rename",node:d}),onRemove:xd,onMove:d=>P({mode:"move",node:d}),onReorder:bd}),(0,F.jsxs)("div",{className:"fx-head-meta",children:[ie?.status==="ready"?(0,F.jsxs)("span",{children:[(0,F.jsx)("b",{children:ie.nodes.length})," ",t("head.entries")]}):null,We.length===0?null:(0,F.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":_e?"true":"false","aria-pressed":_e,title:t(_e?"head.hideIgnored":"head.showIgnored"),"aria-label":t(_e?"head.hideIgnored":"head.showIgnored"),onClick:kd,children:(0,F.jsx)(Mu,{open:_e})}),(0,F.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":an===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":an!=="",onClick:()=>{an!==""?Mt():cd()},children:(0,F.jsx)(Da,{})}),(0,F.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:nn.size===0,onClick:Nd,children:(0,F.jsx)(Oa,{})}),(0,F.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:m===void 0||S===void 0||ie?.status==="loading",onClick:Id,children:(0,F.jsx)(Aa,{})})]})]}),De===null?null:(0,F.jsx)("div",{className:"fx-notice",role:"status","data-tone":De.tone,"data-testid":"fx-notice",children:De.text}),(0,F.jsx)("div",{className:"fx-main",children:m===void 0?(0,F.jsx)(xr,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):S===void 0?(0,F.jsx)(xr,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ie===void 0||ie.status==="loading"?(0,F.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,F.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ie.status==="failed"?(0,F.jsx)(xr,{title:t("state.failed.title"),description:ie.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>si(""),testId:"fs-failed"}):ie.nodes.length===0?(0,F.jsx)(xr,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsxs)("div",{className:"fx-tree-pane",style:gn===null?void 0:{"--fx-tree-width":`${gn}px`},children:[(0,F.jsx)(Os,{t,value:an,origin:oi,count:ri.length,busy:sd,onChange:ti,onStep:d=>Vn(void 0,d,!1),onActivate:Md,onClose:Mt,focusSignal:dd}),(0,F.jsx)(Wa,{rows:ud,selectedPath:Fn===void 0?Ue:void 0,entryFocus:Nr?void 0:fd,t,onToggle:gd,onSelect:d=>Nr?Lr(d):K.open(d),onRetry:si,onEntryFocusSettled:pd,onContextMenu:vd,cursorRequest:nd,onCursorMove:d=>{Cr.current=d}})]}),(0,F.jsx)("div",{ref:Sr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":gn??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:od,onPointerMove:id,onPointerUp:Fr,onPointerCancel:Fr,onLostPointerCapture:Fr,onKeyDown:ad,onDoubleClick:Mr}),(0,F.jsxs)("div",{className:"fx-editor",children:[(0,F.jsx)(ua,{panels:Oe.panels,active:Oe.active,t,onActivate:d=>K.activate(d),onClose:hn,onStep:d=>d===1?K.next():K.previous(),onTabMenu:Rd,documents:l,sessionId:m}),$===null?null:(0,F.jsx)(fa,{name:Qt($.path),t,saving:mn,error:Js,onSave:Qs,onDiscard:ed,onCancel:Tr}),(0,F.jsx)("div",{className:"fx-editor-body",children:Oe.panels.length===0?(0,F.jsx)(pa,{t}):Oe.panels.map((d,p)=>{let x=d.key===Oe.active;return(0,F.jsx)("div",{className:"fx-panel",id:`fx-panel-${p}`,role:"tabpanel","aria-labelledby":`fx-tab-${p}`,hidden:!x,"data-line":d.line,"data-testid":"fs-panel",children:(0,F.jsx)(es,{sessionId:m,files:S,path:d.path,revision:d.revision,git:Z,t,visible:x,renderers:a,documents:l,locate:L,onOpenPeer:rd})},d.key)})})]})]})}),O===null?null:(0,F.jsx)(Oo,{entries:Fd,anchor:O.anchor,onSelect:Cd,onClose:wd,...O.trigger===void 0?{}:{returnFocus:()=>O.trigger??null}}),B===null||di.length===0?null:(0,F.jsx)(Oo,{entries:di,anchor:B.anchor,onSelect:Td,onClose:Sd,returnFocus:()=>B.trigger}),be===null?null:(0,F.jsx)(mt,{kind:be.kind,parent:be.parent,t,error:be.error,busy:be.busy,onSubmit:Pd,onCancel:Ed}),C===null?null:(0,F.jsx)(Es,{tree:D,target:C.mode==="add"?C.target:void 0,t,mode:C.mode,...C.mode==="move"?{node:C.node}:{},onCommit:d=>{let p=C.mode;xn(d),P(null),ne(t(p==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>P(null)}),b===null?null:(0,F.jsx)(mt,{kind:"directory",parent:"",t,initialName:b.mode==="rename"?b.node.name:t("bookmarks.newGroup"),titleKey:b.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:d=>{let p=b;E(null);try{if(p.mode==="rename"){xn(Ss(D,p.node.id,d)),ne(t("bookmarks.renamed"),"ok");return}let x=ct("group",{id:Nu(),name:d,createdAt:Date.now()});xn(pt(D,p.parentId,x)),ne(t("bookmarks.groupCreated"),"ok")}catch{ne(t("bookmarks.saveFailed"),"error")}},onCancel:()=>E(null)}),ie?.status==="ready"?(0,F.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,F.jsxs)("span",{children:[t("view.scope")," ",(0,F.jsx)("b",{children:ie.nodes.length})," ",t("head.entries")]}),ie.truncated?(0,F.jsx)("span",{className:"fx-foot-warn",children:nt({entries:ie.nodes,truncated:!0,total:ie.total}).label}):null,(0,F.jsxs)("span",{className:"fx-foot-git","data-state":Xn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,F.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":md,"aria-hidden":"true"}),Xn===void 0?t("status.unavailable"):Xn===0?t("status.clean"):t("status.summary").replace("{count}",String(Xn))]}),ai===null?null:(0,F.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[ai,ve?.upstream!==void 0&&(ve.ahead??0)>0?(0,F.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(ve.ahead)}`}):null,ve?.upstream!==void 0&&(ve.behind??0)>0?(0,F.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(ve.behind)}`}):null]}),(0,F.jsx)("span",{className:"fx-spacer"}),(0,F.jsx)("span",{children:t("foot.order")})]}):null]})}return T}var Vs=["slots","locale","workbench","remote"];function zu(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var br,kr,Uo,vr,Xo,qs;function Gs(e){return Xo=e,vr!==void 0||(vr=Ji({open:(n,t,r)=>{let o=Xo;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Yi(o)(n,t,r)},save:(n,t)=>{let r=Xo;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Zi(r)(n,t)}})),vr}function $u(){if(Uo!==void 0)return Uo;let e=cr({warn:n=>qs?.(n)});for(let n of Io())e.register(n);return Uo=e,e}var wr;function Us(e){return n=>{let t=e.get?.("sessions"),r=e.get?.("conversation");if(t?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=t.scope(n);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,a=o.focus,l=o.notify;return{...typeof i=="function"?{insertReference:(u,s)=>i.call(o,u,s)}:{},...typeof a=="function"?{focus:()=>a.call(o)}:{},...typeof l=="function"?{notify:(u,s)=>l.call(o,u,s)}:{}}}}function Xs(e){let n=e.workbench;if(n==null)return()=>{};qs=y=>e.logger?.warn?.(y);let t=$u(),r={version:Ya,renderers:t,registerRenderer:y=>t.register(y),documents:Gs(e)};kr?.();let o=e.provide?.(Co,r);o===void 0&&e.logger?.warn?.(`${Qn}: ctx.provide unavailable, ${Co} service not registered`),kr=o,br?.();let i=e.locale.register(Qn,{zh:{...Ur,...ao.zh,...Mo.zh},en:{...Xr,...ao.en,...Mo.en}});br=i;let a=e.locale.bind(Qn),l=ts(typeof document>"u"?void 0:document),u=Vi(e),s=ss(e,()=>as(e.workbench)),c=Hs({workbench:n,version:n.version,t:a,files:ja(e),status:Ua(e),git:Va(e),renderers:t,documents:Gs(e),locate:y=>Xi(e,y),workspace:()=>Ws(e),fileReferences:ra(e),reference:Us(e),referenceSourceAvailable:()=>s.available});wr?.();let f=qr(e,n);return wr=f,e.slots.inject(Ar,()=>e.slots.register({name:Ar,id:te,order:100,label:()=>Yr(zu(e)),locale:Qn},c)),()=>{o?.(),kr===o&&(kr=void 0),f(),wr===f&&(wr=void 0),s.dispose(),l(),u(),i(),br===i&&(br=void 0)}}var Ys={buildTree:Dn,describeListing:nt,iconFor:sn,computeTreeWindow:zt,flattenTree:_t,badgeFor:dn,formatSize:Kt,joinPath:Ie,listingPath:On,parseFocus:$t,consumeViewRequest:er,createPanelStack:io,createEscapeHandler:Xt,KEYMAP:qt,tabLabel:Yr,indexIgnoredPaths:It,isIgnoredPath:Lt,normalizeListing:Sn,normalizeStatusSnapshot:lr,buildWorkspaceMap:Ot,workspaceTagFor:Wt,parseStatusZ:Bt,statusTone:et,statusBadge:At,createPreviewLoader:tr,renderMarkdown:nr,languageFor:it,isMarkdownFile:at,describePage:rr,classifyPreviewFailure:wn,normalizePreviewPage:_n,previewChunkRoute:ka,canBridgeFile:jt,decideBridge:Gr,focusForFileAddress:Hr,forwardFocus:Vr,registerAddressBridge:qr},Zs={name:"dsh-fs-explorer",inject:Vs,apply:Xs,__test:Ys};function _u(e){Ra(e),ba(e)}var Ku=Zs;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
