window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Lt=Object.defineProperty;var ga=Object.getOwnPropertyDescriptor;var ka=Object.getOwnPropertyNames;var xa=Object.prototype.hasOwnProperty;var ba=(e,n)=>{for(var t in n)Lt(e,t,{get:n[t],enumerable:!0})},ha=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ka(n))!xa.call(e,o)&&o!==t&&Lt(e,o,{get:()=>n[o],enumerable:!(r=ga(n,o))||r.enumerable});return e};var va=e=>ha(Lt({},"__esModule",{value:!0}),e);var Vd={};ba(Vd,{__test:()=>Ki,apply:()=>_i,boot:()=>Hd,clientPlugin:()=>Hi,default:()=>Gd,inject:()=>zi});module.exports=va(Vd);var ln=require("react");var zr="dsh-resource://file/";function jr(e){try{return decodeURIComponent(e)}catch{return e}}function kn(e){if(!e.startsWith(zr))return null;let n=e.slice(zr.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=jr(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),d=a<0?i:i.slice(0,a);return d.length===0?null:{sessionId:o,path:d.split("/").map(jr).join("/")}}function Ae(e){return e.slice(e.lastIndexOf("/")+1)}var _r=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Kr(){return _r.flatMap(e=>[...e.extensions])}function xn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return _r.find(o=>o.extensions.includes(r))?.family??null}var Ce="dsh-fs-explorer",It="conversation.view",me="fs-explorer";var bn="fs-explorer",Hr="fsExplorerDocuments",Gr="fsExplorerWorkspace",Vr="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",At={chunk:"client.preview.js"},jn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var wa={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Ra={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Sa=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Ur(e){return typeof e=="string"&&Sa.has(e)}function qr(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Ca(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function _n(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=qr(o.slice(2),i==="1"?7:8);if(a===null)continue;let d=a.fields[0]??"",u=a.rest;if(u===""||d.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:Ca(d[0]??".",d[1]??".")};continue}if(i==="u"){let a=qr(o.slice(2),9);if(a===null)continue;let d=a.rest;if(d==="")continue;n[d]={status:"conflicted"}}}}return n}function hn(e){return Ur(e)?wa[e]:"neutral"}function Kn(e){return Ur(e)?Ra[e]:"?"}function Dt(e){return`status.${e}`}function Xr(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Yr(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Zr(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Jr(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Pa=["conflicted","deleted","renamed","added","modified","untracked"];function Ta(e){return hn(Pa.find(n=>e.has(n))??"modified")}function Qr(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),d=r.endsWith("/")?a.length:a.length-1,u="";for(let s=0;s<d;s+=1){let l=a[s];if(l===void 0||l==="")continue;u=u===""?l:`${u}/${l}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Ta(o.present)});return t}var to=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],ro=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Ea(e){return ro.test(e)?e.slice(0,e.indexOf("/")):null}function Na(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Fa(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Na(i[2]??"");a!==""&&ro.test(a)&&t.push(a)}return t}function Ma(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let d=/^\[(.+)\]$/u.exec(a);if(d!==null){o(),r=/^submodule(\s|$)/u.test(d[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function eo(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function no(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Hn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let d of Ma(r))t.set(d,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let d of Fa(i))o.add(d);let a=e.get("package.json");if(typeof a=="string"){let d=eo(a);if(d!==void 0){let u=d.workspaces,s=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let l of no(Array.isArray(u)?u:s))o.add(l)}}for(let d of["turbo.json","lerna.json"]){let u=e.get(d);if(typeof u!="string")continue;let s=eo(u);if(s!==void 0)for(let l of no(s.packages))o.add(l)}for(let d of o){let u=Ea(d);u!==null&&n.has(u)&&t.set(d,"package")}return t}function Gn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Ba=new Set(["node_modules",".git","dist","__pycache__"]);function La(e){return Ba.has(e)}function Ia(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Vn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||La(r))continue;let o=Ia(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Aa=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Da=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Oa=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Wa=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),$a=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),za=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),ja=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function oo(e){let n=Ae(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function sn(e,n="file"){if(n==="directory")return"folder";let t=Ae(e.toLowerCase());if(ja.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=oo(t);return r===""?"file":Aa.has(r)?"code":Da.has(r)?"markdown":Oa.has(r)?"data":Wa.has(r)?"image":$a.has(r)?"style":za.has(r)?"archive":"file"}var _a={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Ka={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function dn(e){let n=Ae(e.toLowerCase()),t=_a[n];if(t!==void 0)return t;let r=oo(n),o=Ka[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function vn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Vr} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function qn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(d,0),a),s=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,s),startIndex:u,endIndex:s}}function Wt(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Un(e){return e===""?".":e}function Xn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Yn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function $t(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Yn(r,o),t.push(r);return t}function Ot(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Zn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let d=Ot(t[2]),u=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""||d<1?void 0:{path:u,line:d,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let d=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:Ot(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let a=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:Ot(o[2]),absolute:!1}}function io(e){return e.selectionMoved?!0:e.cursorPath===void 0}function ao(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Jn(e,n,t,r){let o=[],i=Qr(t),a=(d,u)=>{let s=e.get(d);if(!(s===void 0||s.status!=="ready"))for(let l of s.nodes){let f=Yn(d,l.name),m=l.kind==="directory",p=m&&n.has(f),b=m||t===void 0?void 0:t[f],x=b?.status??(m?void 0:Xr(f,t)),F=b===void 0?void 0:Yr(b),G=m?i.get(f):void 0,I=m?Gn(r,f):void 0;if(o.push({type:"entry",path:f,name:l.name,kind:l.kind,depth:u,expanded:p,...l.size===void 0?{}:{size:l.size},...x===void 0?{}:{status:x},...G===void 0?{}:{statusCount:G.count,statusTone:G.tone},...F===void 0?{}:{diff:F},...I===void 0?{}:{tag:I}}),!p)continue;let M=e.get(f);if(M===void 0||M.status==="loading"){o.push({type:"status",key:`${f}:loading`,path:f,depth:u+1,state:"loading"});continue}if(M.status==="failed"){o.push({type:"status",key:`${f}:failed`,path:f,depth:u+1,state:"failed",message:M.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(M.nodes.length===0){o.push({type:"status",key:`${f}:empty`,path:f,depth:u+1,state:"empty"});continue}a(f,u+1),M.truncated&&o.push({type:"status",key:`${f}:truncated`,path:f,depth:u+1,state:"truncated",label:vn({entries:M.nodes,truncated:!0,total:M.total}).label})}};return a("",0),o}var Ha=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Ga(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Va(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Ha.has(Ga(n.path)))}function so(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Va(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Qn(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var zt="dsh-fs-explorer:bridge",qa="fs-explorer-bridge",fo="dsh-resource://file/**",jt="sidebar.right.pane.tab",Ua=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Xa=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Ya=new Set(["makefile","dockerfile","license","readme","changelog"]),Za=new Set([...Kr(),...Ua]);function Ja(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function et(e){if(typeof e!="string"||e==="")return!1;let n=Ae(e).toLowerCase();if(n==="")return!1;let t=Ja(n);return Xa.has(t)?!1:Ya.has(n)?!0:Za.has(t)}function Qa(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function es(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Ht(e,n){if(typeof e!="string")return;let t=kn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=es(n,Qa(e));return`${Xn(r)?"abs:":"path:"}${r}:${String(o)}`}function Gt(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=kn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!et(r.path))return{action:"keep",reason:"refused"};let o=Ht(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function De(e,n){n===void 0?console.warn(`[${Ce}] ${e}`):console.warn(`[${Ce}] ${e}`,n)}function ns(e){console.debug(`[${Ce}] ${e}`)}function _t(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Kt(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Xe(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function lo(e){return Xe(()=>e.sidebarRightTabs,_t)??Xe(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,_t)}function uo(e){return Xe(()=>e.sidebarRight,Kt)??Xe(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Kt)}function co(e){return typeof e=="function"?e:()=>{}}var ts="dsh-resource://file/session/probe/src/main.ts";function rs(e){let n=Xe(()=>(typeof e.candidates=="function"?e.candidates(ts):[]).filter(r=>r.priority==="extension"&&r.id!==zt),t=>Array.isArray(t)&&t.length>0);n!==void 0&&De(`another extension-band tab type already claims ${fo}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function os(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function is(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function as(e,n){let t=e.viewFocus;if(t?.request?.(me,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(me,n);return(!r.opened||r.focused)&&t?.take(me),r}return typeof e.openView=="function"&&e.openView(me,n)?(t?.take(me),{opened:!0,focused:!0}):(t?.take(me),{opened:!1,focused:!1})}function Vt(e,n,t,r){let o;try{o=as(e,r)}catch(i){return De("the file workbench threw while switching views",i),e.viewFocus?.take(me),!1}if(!o.opened)return De(`the file workbench did not switch to ${me}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return De("the forwarded tab could not be closed",i),!1}}function ss(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,d=os(i),u=is(i),s=(0,ln.useRef)(void 0);return(0,ln.useEffect)(()=>{if(a===void 0){De("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let l=Gt(d,e.currentSessionId(),u);if(l.action!=="open"){De(`left the forwarded tab standing (${l.reason})`,d);return}Vt(e,n,a,l.focus)},[a,d,u]),null}return function(o){return typeof o.useTabInfo!="function"?(De(`the host did not inject useTabInfo into ${jt}; the bridge cannot forward`),null):(0,ln.createElement)(t,{useTabInfo:o.useTabInfo})}}function qt(e,n){let t=(d,u)=>{if(d===void 0||u===void 0)return;rs(d);let s;try{s=d.register({id:zt,kind:qa,patterns:[fo],priority:"extension",canOpen:m=>{let p=kn(m);return p!==null&&et(p.path)},title:m=>Ae(kn(m)?.path??m)||m})}catch(m){De("the sidebar right refused the address bridge tab type",m);return}let l=ss(n,u),f;try{f=co(e.slots.inject(jt,()=>e.slots.register({name:jt,key:zt},l)))}catch(m){s(),De("the sidebar right refused the address bridge body",m);return}return()=>{f(),s()}},r=lo(e),o=uo(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return ns("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],d=>{let u=Xe(()=>d.get?.("sidebarRightTabs"),_t)??lo(d),s=Xe(()=>d.get?.("sidebarRight"),Kt)??uo(d);return t(u,s)});return co(a)}var Ut={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Xt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Yt(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Ut:Xt)["tab.label"]??"Files"}var ds=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ye(e){return e!==null&&typeof e=="object"}function tt(e,n){return{ok:!1,code:e,message:n}}function rt(e){let n=ye(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return tt(t,r)}function Zt(){return tt("invalid-response","the document service answered an invalid response")}function nt(e){try{return e()}catch{return}}function ls(e){let n=ye(e)?e:void 0;if(n===void 0)return Zt();if(n.ok===!1)return rt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ye(t)?t:void 0;if(r===void 0)return Zt();if(r.ok===!1)return rt(r.error);let o=ye(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Zt():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function us(e){let n=ye(e)?e:void 0;if(n===void 0)return po();if(n.ok===!1)return rt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ye(t)?t:void 0;if(r===void 0)return po();if(r.ok===!1)return rt(r.error);let o=ye(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function po(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Jt(e){return ye(e)&&typeof e.open=="function"}function cs(e){let n=nt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ye(n)?n.rpc:void 0;if(!(!ye(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Hr}/${r}`,o,i)}function fs(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function ps(e){let n=ye(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=ye(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=ye(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function mo(e,n){let t=er(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return ps(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function er(e){return()=>{let n=nt(()=>e.fsExplorerDocuments);if(Jt(n))return n;let t=nt(()=>ye(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Jt(t))return t;let r=nt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Jt(r))return r;let o=cs(e);if(o!==void 0)return fs(o)}}function yo(e){let n=er(e);return async(t,r,o)=>{let i=n();if(i===void 0)return tt("unavailable","the document service is unavailable");try{return ls(await i.open({sessionId:t,path:r},o))}catch(a){return tt("io-error",a instanceof Error?a.message:String(a))}}}function go(e){let n=er(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return us(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function ko(e){let n=new Map,t=new Set,r=0,o=(d,u)=>`${d}\0${u}`,i=()=>{r+=1;for(let d of[...t])d()},a=(d,u)=>n.get(o(d,u))?.session;return{acquire(d,u){let s=o(d,u),l=n.get(s);return l===void 0&&(l={session:new Qt(d,u,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,l),i()),l.session.retain(),l.session},peek(d,u){return a(d,u)?.getSnapshot()},find:a,forget(d,u){n.get(o(d,u))?.session.abandon()},subscribe(d){return t.add(d),()=>{t.delete(d)}},revision:()=>r}}var Qt=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=ds;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var ot=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function ms(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function xo(e,n,t=ms()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===d}function bo(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function ys(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function nr(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function it(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&ys(n),e.onClose?.()}}var un=require("react");function st(e){let n=Ae(e);return n===""?e:n}function at(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var gs=Object.freeze({panels:Object.freeze([]),active:null});function ho(e,n){return n===void 0?e:`git\0${n}\0${e}`}var ks=/^git:([0-9a-f]{4,64}):(.+)$/iu;function tr(){let e=[],n=null,t=gs,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(l=>l.key===s),a=s=>e.findIndex(l=>l.revision===void 0&&l.key===s),d=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let l=ks.exec(s);if(l!==null){let p=(l[1]??"").toLowerCase(),b=at(l[2]??"",!1);if(b===void 0)return;let x=ho(b,p);return i(x)>=0?x:void 0}let f=at(s,!0);if(f===void 0)return;if(a(f)>=0)return f;let m=at(s,!1);if(!(m===void 0||m===f))return a(m)>=0?m:void 0},u=s=>{if(e.length===0)return;let l=n===null?-1:i(n),f=e[(l+s+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(s,l=1,f=!1,m){let p=at(s,f);if(p===void 0)return;let b=typeof m=="string"&&m.trim()!==""?m.trim().toLowerCase():void 0,x=ho(p,b),F=Number.isFinite(l)&&l>0?Math.trunc(l):1,G=i(x);if(G>=0){let O=e[G],E=O!==void 0&&(O.line!==F||O.absolute!==f);if(E&&(e=e.map((L,j)=>j===G?{...L,line:F,absolute:f}:L)),n===x){E&&o();return}n=x,o();return}let I=n===null?e.length:i(n)+1,M={key:x,path:p,line:F,absolute:f,...b===void 0?{}:{revision:b}};e=[...e.slice(0,I),M,...e.slice(I)],n=x,o()},close(s){let l=s===void 0?n:d(s)??null;if(l===null)return;let f=i(l);f<0||(e=e.filter(m=>m.key!==l),n===l&&(n=(e[f]??e[f-1])?.key??null),o())},activate(s){let l=d(s);l===void 0||i(l)<0||n===l||(n=l,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let l=d(s);return l!==void 0&&i(l)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function vo(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=tr();return e.set(t,o),o}}}function wn(e,n){let t=Zn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var z=require("react/jsx-runtime"),rr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},xs=()=>()=>{},bs=()=>"";function hs(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function wo({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:d}){let u=(0,un.useRef)(null);(0,un.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,un.useSyncExternalStore)(a?.subscribe??xs,()=>hs(a,d,e).join("\0"),bs),l=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let f=m=>{if(m.key==="ArrowRight"||m.key==="ArrowLeft"){m.preventDefault(),m.stopPropagation(),i(m.key==="ArrowRight"?1:-1);return}(m.key==="Delete"||m.key==="Backspace")&&n!==null&&(m.preventDefault(),m.stopPropagation(),o(n))};return(0,z.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:f,"data-testid":"fs-tabs",children:e.map((m,p)=>{let b=m.key===n,x=st(m.path),F=t("panel.close").replace("{name}",x);return(0,z.jsxs)("div",{className:"fx-tab","data-active":b?"true":"false","data-dirty":l.has(m.path)?"true":"false",role:"presentation",children:[(0,z.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${p}`,"aria-controls":`fx-panel-${p}`,"aria-selected":b,tabIndex:b?0:-1,title:m.path,"data-testid":"fs-tab","data-path":m.path,"data-key":m.key,ref:b?u:void 0,onClick:()=>r(m.key),children:[(0,z.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":sn(m.path),"aria-hidden":"true",children:dn(m.path)}),(0,z.jsx)("span",{className:"fx-tab-name",children:x}),m.revision===void 0?null:(0,z.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:m.revision,children:m.revision.slice(0,7)}),l.has(m.path)?(0,z.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,z.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:b?0:-1,"aria-label":F,title:F,"data-testid":"fs-tab-close",onClick:()=>o(m.key),children:"\xD7"})]},m.key)})})}function Ro({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,z.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,z.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,z.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,z.jsx)("span",{className:"fx-spacer"}),(0,z.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,z.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,z.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function vs(){return(0,z.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,z.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,z.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,z.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function So({t:e}){return(0,z.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,z.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,z.jsx)(vs,{})}),(0,z.jsx)("strong",{children:e("panel.empty.title")}),(0,z.jsx)("span",{children:e("panel.empty.description")}),(0,z.jsxs)("span",{className:"fx-empty-keys",children:[(0,z.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,z.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,z.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,z.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Co=require("react");function se(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Co.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function ws(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Rs=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Ye(e){let n=[],t=0;for(let r of e.matchAll(Rs)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(se("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(se("strong",null,...Ye(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(se("del",null,...Ye(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(se("em",null,...Ye(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=a?.[1]??i,u=a===null?void 0:ws(a[2]??"");n.push(u===void 0?d:se("a",{href:u,rel:"noreferrer noopener"},d))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Po=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,To=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Eo=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,or=/^\s{0,3}>\s?(.*)$/u,ir=/^\s{0,3}[-*+]\s+(.*)$/u,ar=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Ss(e){return Po.test(e)||To.test(e)||Eo.test(e)||or.test(e)||ir.test(e)||ar.test(e)}function No(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Po.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),l=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(se("pre",null,se("code",l===""?null:{className:`language-${l}`},f.join(`
`))));continue}let i=To.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(se(`h${String(s)}`,null,...Ye(i[2]??""))),t+=1;continue}if(Eo.test(r)){n.push(se("hr",null)),t+=1;continue}if(or.test(r)){let s=[];for(;t<e.length;){let l=or.exec(e[t]??"");if(l===null)break;s.push(l[1]??""),t+=1}n.push(se("blockquote",null,...No(s)));continue}if(ir.exec(r)!==null){let s=[];for(;t<e.length;){let l=ir.exec(e[t]??"");if(l===null)break;s.push(se("li",null,...Ye(l[1]??""))),t+=1}n.push(se("ul",null,...s));continue}if(ar.exec(r)!==null){let s=[];for(;t<e.length;){let l=ar.exec(e[t]??"");if(l===null)break;s.push(se("li",null,...Ye(l[1]??""))),t+=1}n.push(se("ol",null,...s));continue}let u=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Ss(s))break;u.push(s.trim()),t+=1}n.push(se("p",null,...Ye(u.join(" "))))}return n}function dt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return se("div",{className:"fx-md"},...No(n))}var sr=200,Cs={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Cn(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Cs[t.slice(r+1)]??"plaintext"}function Pn(e){return Cn(e)==="markdown"}var ce=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Rn(e){return e!==null&&typeof e=="object"}function Ps(e){return e===""?0:e.split(`
`).length}function cn(e,n){if(!Rn(e))throw new ce("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let l=Rn(e.error)?e.error:{},f=typeof l.code=="string"?l.code:"preview/unknown",m=typeof l.message=="string"?l.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",p=Rn(l.details)?l.details:{},b=typeof p.kind=="string"?p.kind:"";throw new ce(f,m,b)}let t=e.ok===!0?e.value:e;if(!Rn(t)||typeof t.text!="string")throw new ce("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ps(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,d=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...d===void 0?{}:{source:d},...u===void 0?{}:{linkTarget:u}};return o===void 0?s:{...s,totalLines:o}}function Ze(e){let n=Rn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Sn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function lt({files:e,maxLines:n=sr}){let t=Math.max(1,Math.trunc(n)),r=Sn,o=0,i=null,a=[1],d=new Set,u=l=>{r=l;for(let f of d)f()},s=async(l,f)=>{o+=1;let m=o;i?.abort();let p=new AbortController;i=p,u({status:"loading",path:l,text:r.path===l?r.text:"",offset:f,lines:r.path===l?r.lines:0,...r.path===l&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===l&&r.source!==void 0?{source:r.source}:{},eof:r.path===l?r.eof:!1});try{let b=await e.read(l,f>1?{offset:f,limit:t}:{limit:t},p.signal);if(m!==o)return;let x=cn(b,f);if(x.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let F={status:"ready",path:l,text:x.text,offset:x.offset,lines:x.lines,eof:x.eof,...x.source===void 0?{}:{source:x.source},...x.linkTarget===void 0?{}:{linkTarget:x.linkTarget,linkPath:l}};u(x.totalLines===void 0?F:{...F,totalLines:x.totalLines})}catch(b){if(m!==o||p.signal.aborted)return;u({status:"failed",path:l,text:"",offset:f,lines:0,eof:!1,failure:Ze(b)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(l){return d.add(l),()=>{d.delete(l)}},async open(l){a=[1],await s(l,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let l=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&l>r.totalLines||(a.push(l),await s(r.path,l))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let l=a[a.length-1]??1;await s(r.path,l)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(Sn)}}}function ut(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var dr=Object.freeze({chunk:At.chunk,id:`${Ce}/${At.chunk}`}),lr=null,Tn=null,ct=new Map;function Fo(e){lr=e}function Mo(){return dr}function Ts(e){let n=jn[e];return{chunk:n,id:`${Ce}/${n}`}}function ur(){if(Tn!==null)return Tn;let e=lr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Ce}: the loader require was not handed over`));let n=e.async(`./${dr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Ce}: chunk ${dr.id} is missing its preview renderers`);return r});return Tn=n,n.catch(()=>{Tn===n&&(Tn=null)}),n}function Bo(e){let n=ct.get(e);if(n!==void 0)return n;let t=lr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${Ce}: the loader require was not handed over`));let r=Ts(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${Ce}: chunk ${r.id} is not the ${e} view`);return a});return ct.set(e,o),o.catch(()=>{ct.get(e)===o&&ct.delete(e)}),o}var Lo=Object.freeze({}),Es="@deepseek-ai/dsh-client-ui-primitives",fr=null,cr;function Io(e){fr=e}function Ns(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function ft(){if(cr!=null)return cr;if(fr===null)return Lo;let e=Ns(fr,Es);if(e===void 0)return Lo;let n=l=>{let f=e[l];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=l=>{let f=e[l];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let d=n("Input");d!==void 0&&(r.Input=d);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var D=require("react");async function Je(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Oe=require("react/jsx-runtime");function Fs(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Ms(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function pr({failure:e,t:n,onRetry:t}){return(0,Oe.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Oe.jsx)("strong",{children:Fs(e,n)}),(0,Oe.jsx)("span",{children:Ms(e,n)}),e.message===""?null:(0,Oe.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Oe.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function mr({t:e}){return(0,Oe.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Oe.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var yr="fsExplorer",Ao=1;function Bs(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Ls(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Is(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function As(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function pt(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Ls),families:[...i.match?.families??[]]}),o();let d=!0;return()=>{d&&(d=!1,t.delete(a),o())}},resolve(i){let a=Bs(i.path),d=xn(i.path),u;for(let s of t.values())Is(s,a,d)&&(u===void 0||As(s.contribution,u.contribution))&&(u=s);return u?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Do(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function mt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function We(e){try{return e()}catch{return}}function Ee(e){return e!==null&&typeof e=="object"}function jo(e){return()=>{let n=We(()=>e.workspaceFiles);if(mt(n))return n;let t=We(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(mt(t))return t;let r=We(()=>e.remote?.workspaceFiles);if(mt(r))return r;let o=We(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(mt(o))return o}}function _o(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Ko(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return cn(i,r.offset??1),i}catch(s){if(!(s instanceof ce)||Ze(s).kind!=="symlink")throw s;a=s}let d=await n(t,o);if(d===void 0)throw a;return{...cn(await e.read(d.absolutePath,r,o),r.offset??1),linkTarget:d.absolutePath}}}}function Oo(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Ds(e){let n=We(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ee(n)?n.rpc:void 0;if(!Ee(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Ho(e){return()=>{let n=We(()=>e.remote?.gitExplorer);if(Oo(n))return n;let t=We(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Oo(t)?t:Ds(e)}}function Os(e){return e===""?0:e.split(`
`).length}function Wo(e){let n=Ee(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new ce(t,r)}function Go(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},d=await e.show(a,i);if(!Ee(d))throw new ce("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(d.ok===!1)throw Wo(d.error);let u=d;if(d.ok===!0&&(u=d.value),!Ee(u))throw new ce("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw Wo(u.error);let s=u;if(u.ok===!0&&(s=u.page),!Ee(s))throw new ce("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new ce("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new ce("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new ce("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let l=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):Os(s.text),f=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,m=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:l,offset:f,eof:s.eof===!0,...m===void 0?{}:{source:m}}}}}function Ws(e){if(!Ee(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Ee(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function $s(e){let n=Ee(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Ee(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new ce(t,r,i)}function xr(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ws(await n.call(e,t,r,{},o));if(!i.ok)throw $s(i.error);return i.value.data}}function En(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function gr(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function yt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:En(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?gr(r.value):{ok:!1,message:En(r.error)}}return gr(t)}return gr(n)}function Vo(e){return e instanceof Error?e.message:En(e)}function $o(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function qo(e){return()=>{let n=We(()=>e.remote?.gitExplorer);if($o(n))return n;let t=We(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if($o(t))return t}}function zo(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function zs(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=zo(r.additions),i=zo(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function js(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function _s(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function kr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=zs(n.stats),r=js(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=_s(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function gt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:En(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?kr(o.snapshot):{ok:!1,message:En(o.error)}}let r=e;return r.snapshot!==void 0?kr(r.snapshot):kr(t)}var S=require("react/jsx-runtime"),wr={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Ks=()=>()=>{},Uo=()=>{};function Rr(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var br={status:"idle"},Hs=[".md",".mdx",".markdown",".mdown"],Gs=-1e3;function vr({t:e,revision:n}){return(0,S.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,S.jsx)("strong",{children:e("preview.unavailable.title")}),(0,S.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function Xo({chunk:e,text:n,path:t,offset:r}){let o=(0,D.useRef)(null),i=(0,D.useRef)(null),[a,d]=(0,D.useState)(!1),u=Cn(t);return(0,D.useEffect)(()=>{d(!1)},[e,t]),(0,D.useEffect)(()=>{let s=o.current;if(!(e===null||s===null))try{let l=e.mountCodePreview(s,{text:n,language:u,path:t,offset:r});return i.current=l,()=>{l.destroy(),i.current=null}}catch{d(!0);return}},[e,t,u]),(0,D.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,S.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,S.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Vs({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Pn(n)?(0,S.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:dt(r)}):(0,S.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function qs(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,S.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,S.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,S.jsx)(Xo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Us(e){function n({page:t,path:r}){return(0,S.jsx)(Xo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Xs({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let d=(0,D.useMemo)(()=>{let u=xr(r);return u===void 0||t===void 0||a===void 0?u:async(s,l,f)=>{if(s!==t||l!==n)return u(s,l,f);let m=await a(l,f);return u(s,m?.absolutePath??l,f)}},[r,t,n,a]);return t===void 0||d===void 0?(0,S.jsx)(vr,{t:o}):(0,S.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:d,t:o,visible:i})}function Ys(e){return{Body:n=>(0,S.jsx)(Xs,{chunk:e,...n}),renderer:e.renderer}}function Sr(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Hs]},priority:0,load:()=>ur().then(qs)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:Gs,load:()=>ur().then(Us)},...Object.keys(jn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Bo(e).then(Ys)}))]}var hr;function Zs(){if(hr!==void 0)return hr;let e=pt();for(let n of Sr())e.register(n);return hr=e,e}function Yo({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:d,documents:u,locate:s}){let l=(0,D.useMemo)(()=>{let A=r===void 0?_o(n,e):o===void 0||e===void 0?void 0:Go(o,e,r);return A===void 0||r!==void 0||s===void 0?A:Ko(A,s)},[n,e,r,o,s]),f=(0,D.useMemo)(()=>r===void 0?xr(n):void 0,[n,r]),m=d??Zs(),p=t===void 0?null:xn(t),b=p!==null,x=r===void 0&&e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[F,G]=(0,D.useState)(null),[I,M]=(0,D.useState)(Sn),[O,E]=(0,D.useState)(br),[L,j]=(0,D.useState)(0),[Z,Re]=(0,D.useState)(0),[w,N]=(0,D.useState)("reading"),[P,y]=(0,D.useState)(!1),[h,R]=(0,D.useState)(!1),[H,q]=(0,D.useState)(void 0),[re,ae]=(0,D.useState)(!1),ee=(0,D.useRef)(void 0),J=(0,D.useRef)(void 0),X=(0,D.useSyncExternalStore)(u?.subscribe??Ks,()=>u===void 0||e===void 0||t===void 0?Uo():u.peek(e,t),Uo),_=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,D.useEffect)(()=>{if(l===void 0){G(null);return}let A=lt({files:l,maxLines:sr});return G(A),()=>A.close()},[l]),(0,D.useEffect)(()=>{if(F===null){M(Sn);return}return M(F.getSnapshot()),F.subscribe(()=>M(F.getSnapshot()))},[F]),(0,D.useEffect)(()=>{F===null||t===void 0||p!==null||F.open(t)},[F,t,p]),(0,D.useEffect)(()=>{if(!b||t===void 0||s===void 0){q(void 0);return}let A=new AbortController,le=!0;return(async()=>{let ue=await s(t,A.signal);le&&!A.signal.aborted&&q(ue?.absolutePath)})(),()=>{le=!1,A.abort()}},[b,t,s]),(0,D.useEffect)(()=>{N("reading"),y(!1),ae(!1)},[t]),(0,D.useEffect)(()=>()=>{ee.current!==void 0&&clearTimeout(ee.current),J.current!==void 0&&clearTimeout(J.current)},[]),(0,D.useEffect)(()=>{X?.conflict!==!0&&(R(!1),ae(!1),J.current!==void 0&&clearTimeout(J.current))},[X?.conflict]),(0,D.useEffect)(()=>m.subscribe(()=>j(A=>A+1)),[m]),(0,D.useEffect)(()=>{if(t===void 0||r!==void 0){E(br);return}let A=Do(m,{path:t});if(A===void 0){E(br);return}let{contribution:le}=A,ue=!0;return E(pe=>pe.status==="ready"&&pe.contribution.id===le.id?pe:{status:"loading",contribution:le}),A.module.then(pe=>{ue&&E({status:"ready",contribution:le,module:pe})},pe=>{ue&&E({status:"failed",contribution:le,failure:Ze(pe)})}),()=>{ue=!1}},[m,t,r,L,Z]),t===void 0)return(0,S.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,S.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,S.jsx)("strong",{children:i("preview.empty.title")}),(0,S.jsx)("span",{children:i("preview.empty.description")})]})});let Y=b&&r!==void 0,fe=ut(I),Te=I.linkPath??t,ge=b?H:I.linkTarget,je=!b&&Pn(t),Qe=b?!Y&&x!==null&&O.status!=="ready"&&O.status!=="failed":I.status==="loading",Be=I.status==="ready",en=je&&w==="reading",An=b?Y||x===null?"unavailable":O.status==="failed"?"failed":O.status==="ready"?"ready":"loading":I.status,nn=O.status==="ready"?O.module.renderer??O.contribution.id:b?"pending":en?"fallback":"plain",_e={path:ge??t,sessionId:e,files:n,t:i,visible:a,mode:w,...b?{}:{page:{text:I.text,offset:I.offset}},...s===void 0?{}:{locate:s}},Le=()=>{Je(ge??Te).then(A=>{A&&(y(!0),ee.current!==void 0&&clearTimeout(ee.current),ee.current=setTimeout(()=>y(!1),1400))})},$=()=>{let A=_?.copyDraft();A!==void 0&&Je(A).then(le=>{le&&(R(!0),J.current!==void 0&&clearTimeout(J.current),J.current=setTimeout(()=>R(!1),1400))})},he=X?.error,Dn=he!=null&&X?.conflict!==!0,ke=X?.conflict===!0,Ke=X?.discarded??null,tn=!ke&&Ke!==null&&X?.dirty!==!0&&Ke!==X?.text,He;if(b){let A=O.status==="ready"?O.module.Body:void 0;He=Y?(0,S.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,S.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,S.jsx)("span",{children:i("preview.commitBinary.description")})]}):x===null?(0,S.jsx)(vr,{t:i,revision:r}):O.status==="failed"?(0,S.jsx)(pr,{failure:O.failure,t:i,onRetry:()=>Re(le=>le+1)}):A===void 0?(0,S.jsx)(mr,{t:i}):(0,S.jsx)(A,{..._e})}else if(l===void 0)He=(0,S.jsx)(vr,{t:i,revision:r});else if(I.status==="failed")He=(0,S.jsx)(pr,{failure:I.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{F?.retry()}});else if(!Be)He=(0,S.jsx)(mr,{t:i});else{let A=O.status==="ready"?O.module.Body:Vs;He=(0,S.jsx)(A,{..._e})}return(0,S.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":An,"data-mode":b?"binary":en?"reading":"code","data-renderer":nn,children:[(0,S.jsxs)("header",{className:"fx-preview-bar",children:[(0,S.jsxs)("span",{className:"fx-preview-path",title:ge===void 0?Te:`${Te} \u2192 ${ge}`,"data-testid":"fs-preview-path",...ge===void 0?{}:{"data-link":"followed"},children:[Te,ge===void 0?null:(0,S.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",ge]})]}),b?null:(0,S.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[fe.range,fe.range==="\u2014"?null:(0,S.jsxs)(S.Fragment,{children:[" ",i("preview.lines")]}),fe.total===void 0?null:(0,S.jsxs)("span",{className:"fx-preview-total",children:[" / ",fe.total," ",i("preview.lines")]})]}),(0,S.jsxs)("div",{className:"fx-preview-actions",children:[X===void 0?null:(0,S.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!X.dirty||X.saving||X.status!=="ready",onClick:()=>{_?.save()},children:X.saving?i("preview.saving"):i("preview.save")}),je?(0,S.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>N(A=>A==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(w==="reading"?"preview.source":"preview.reading")}):null,b?null:(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Be||Qe||I.offset<=1,onClick:()=>{F?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,S.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Be||Qe||I.eof,onClick:()=>{F?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,S.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Le,"data-testid":"fs-preview-copy",children:i(P?"preview.copied":"preview.copyPath")}),Qe?(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),I.source==="first-parent"?(0,S.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,ke||tn?(0,S.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":ke?"conflict":"discarded",children:[(0,S.jsx)("strong",{children:i(ke?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,S.jsx)("span",{className:"fx-conflict-hint",children:i(ke?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,S.jsx)("span",{className:"fx-spacer"}),ke?(0,S.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":re?"discard":void 0,onClick:()=>{if(!re&&X?.dirty===!0){ae(!0);return}ae(!1),_?.reload({force:!0})},children:i(re?"preview.conflict.discard":"preview.conflict.reload")}):null,tn?(0,S.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Ke!==null&&_?.setDraft(Ke)},children:i("preview.conflict.restore")}):null,ke?(0,S.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:$,children:i(h?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Dn?(0,S.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Rr(he?.code??"io-error",he?.message??"",i))}):null,(0,S.jsx)("div",{className:"fx-preview-body","data-scroll":en?"y":"none",children:He})]})}var Zo="dsh-fs-explorer-styles",Js=`
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
  height: 24px;
  max-width: 160px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: 11.5px;
  white-space: nowrap;
  cursor: pointer;
}
.fx-bookmark:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-bookmark:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-bookmark[aria-expanded="true"] { background: var(--fx-active); color: var(--fx-text); }
.fx-bookmark-name { overflow: hidden; text-overflow: ellipsis; }
.fx-bookmark-chevron { display: inline-flex; color: var(--fx-caption); flex: none; }
.fx-bookmark-empty { color: var(--fx-caption); font-size: 11px; white-space: nowrap; }

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
  font-size: 12px;
}
.fx-bookmark-flyout-sub { position: absolute; left: 100%; top: 0; margin-left: 2px; }
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
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: 12px;
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
  position: fixed; z-index: 75; min-width: 150px; padding: 4px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 1px; font-family: var(--fx-font); font-size: 12px; }

/* The destination picker: one card, one level at a time. */
.fx-bookmark-picker {
  position: absolute; z-index: 65; top: 44px; left: 12px; width: 280px; max-height: 60vh; overflow-y: auto; padding: 10px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-2, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 8px; font-family: var(--fx-font); font-size: 12px; }
.fx-bookmark-picker-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.fx-bookmark-picker-head strong { font-size: 12px; font-weight: 600; }
.fx-bookmark-picker-target { color: var(--fx-caption); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-bookmark-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; }
.fx-bookmark-crumb {
  padding: 2px 6px; border: 0; border-radius: 4px; background: transparent; color: var(--fx-text-2); font: inherit; font-size: 11px; cursor: pointer; }
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
  font-size: 11px;
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
  font-size: 11px;
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
  font-size: 12px;
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
.fx-menu-reason { display: block; color: var(--fx-caption); font-size: 11px; line-height: 1.4; }

/* The name card. Anchored to the tree rather than centered on the page: the
   reader right-clicked a row, and a modal would take the tree away at exactly
   the moment they need to see which directory they are creating in. */
.fx-name-prompt {
  position: absolute;
  z-index: 55;
  top: 44px;
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
  font-size: 12px;
}
.fx-name-prompt-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.fx-name-prompt-head strong { font-size: 12px; font-weight: 600; }
.fx-name-prompt-parent {
  color: var(--fx-caption);
  font-size: 11px;
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
.fx-name-prompt-error { color: var(--dsw-alias-state-error-primary, var(--fx-text-2)); font-size: 11px; line-height: 1.4; }
.fx-name-prompt-actions { display: flex; justify-content: flex-end; gap: 6px; }
.fx-btn-text, .fx-btn-primary { width: auto; padding: 0 10px; height: 24px; }
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
  /* A user-dragged width arrives as the --fx-tree-width inline variable; the
     fallback keeps the shipped fluid clamp for everyone who never dragged. */
  flex: 0 0 var(--fx-tree-width, clamp(220px, 34%, 380px));
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--fx-border-soft);
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
.fx-tab-rev {
  flex: none;
  padding: 0 3px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 4px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 9px;
  line-height: 13px;
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
.fx-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 14px;
  padding: 0 4px;
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: 8.5px;
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
.fx-diff {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-family: var(--fx-mono);
  font-size: 10px;
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
.fx-preview-link {
  color: var(--fx-caption);
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
.fx-preview-notice {
  flex: none;
  padding: 6px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  font-size: 10.5px;
}
.fx-conflict {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: 30px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: color-mix(in oklab, var(--fx-modified) 14%, transparent);
  color: var(--fx-text);
  font-size: 11px;
}
.fx-conflict strong { font-weight: 600; }
.fx-conflict-hint { color: var(--fx-text-2); }
.fx-save-error {
  flex: none;
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  color: var(--fx-deleted);
  font-size: 10.5px;
}
.fx-close-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: 34px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: var(--fx-panel-2);
  color: var(--fx-text);
  font-size: 11px;
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
  /* Stacked panes have no horizontal split to resize, so the handle and any
     persisted width (the media rule above wins the cascade over the variable)
     both go inert. */
  .fx-pane-handle { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .fx-chevron { transition: none; }
  .fx-spinner { animation-duration: 1.6s; }
}
`;function Jo(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Zo}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Zo,t.textContent=Js,e.head.appendChild(t),()=>{t.remove()}}var k=require("react");var oe={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"};function Qo(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function Qs(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function ei(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,d=r.workspace&&a!==void 0,u=[{id:oe.createFile,label:n("menu.create.file"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:oe.createFolder,label:n("menu.create.folder"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,l={id:oe.reveal,label:n(Qs(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:oe.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},m={id:oe.copyRelative,label:n("menu.copy.relative")},p=e.remoteLinks,b=p!==void 0&&p.length>0?{id:oe.copyRemote,label:n("menu.copy.remote"),submenu:p.map(x=>({id:x.id,label:x.label}))}:{id:oe.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,l,{id:"menu.copy",label:n("menu.copy"),submenu:[f,m]},b,{id:oe.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}var Ne=require("react");var be=require("react/jsx-runtime");function ed(e){return new DOMRect(e.x,e.y,0,0)}function ni(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,be.jsxs)(be.Fragment,{children:[e.label,(0,be.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function ti({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=ft();if(i.Menu!==void 0){let a=i.Menu;return(0,be.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(d=>({id:d.id,label:ni(d),...d.disabled===!0?{disabled:!0}:{},...d.submenu===void 0?{}:{submenu:d.submenu.map(u=>({id:u.id,label:ni(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>ed(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,be.jsx)(nd,{entries:e,anchor:n,onSelect:t,onClose:r})}function nd({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,Ne.useRef)(null),[i,a]=(0,Ne.useState)(null),[d,u]=(0,Ne.useState)({left:n.x,top:n.y});(0,Ne.useEffect)(()=>{let l=o.current;if(l===null)return;let f=8,m=l.offsetWidth,p=l.offsetHeight,b=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-m-f)),x=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-p-f));u({left:b,top:x})},[n.x,n.y]),(0,Ne.useEffect)(()=>{let l=m=>{m.target instanceof Node&&o.current?.contains(m.target)!==!0&&r()},f=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),r())};return document.addEventListener("pointerdown",l),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",l),document.removeEventListener("keydown",f,!0)}},[r]);let s=(0,Ne.useCallback)(l=>{if(l.disabled!==!0){if(l.submenu!==void 0){a(f=>f===l.id?null:l.id);return}t(l.id)}},[t]);return(0,be.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:d,onContextMenu:l=>l.preventDefault(),children:e.map(l=>(0,be.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,be.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":l.id,disabled:l.disabled===!0&&l.reason===void 0,"aria-disabled":l.disabled===!0?!0:void 0,"aria-haspopup":l.submenu===void 0?void 0:"menu","aria-expanded":l.submenu===void 0?void 0:i===l.id,title:l.disabled===!0?l.reason:void 0,onClick:()=>s(l),children:l.label}),l.submenu===void 0||i!==l.id?null:(0,be.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:l.submenu.map(f=>(0,be.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>s(f),children:f.label},f.id))})]},l.id))})}var de=require("react"),W=require("react/jsx-runtime"),td=120;function ri(){return(0,W.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,W.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function oi({node:e,t:n,onOpen:t}){return(0,W.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,W.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function ii({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:d,onReorder:u}){let[s,l]=(0,de.useState)([]),f=(0,de.useRef)(null),[m,p]=(0,de.useState)(null),[b,x]=(0,de.useState)(null),F=(0,de.useCallback)(()=>{f.current!==null&&(clearTimeout(f.current),f.current=null)},[]),G=(0,de.useCallback)(()=>{F(),l([])},[F]),I=(0,de.useCallback)(()=>{F(),f.current=setTimeout(()=>{f.current=null,l([])},td)},[F]);(0,de.useEffect)(()=>()=>{f.current!==null&&clearTimeout(f.current)},[]),(0,de.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let w=N=>{N.key!=="Escape"||N.isComposing||(N.preventDefault(),N.stopPropagation(),G())};return document.addEventListener("keydown",w,!0),()=>document.removeEventListener("keydown",w,!0)},[G,s.length]);let M=(0,de.useCallback)((w,N,P)=>{F();let y=P?.getBoundingClientRect(),h=y===void 0?0:y.left,R=y===void 0?0:y.bottom+4;l(H=>{let q=H.slice(0,N);return q.length===N&&q[N-1]?.groupId===w?H:[...q,{groupId:w,left:h,top:R,depth:N}]})},[F]),O=(0,de.useCallback)(w=>{G(),w.kind==="file"?t(w.path):w.kind==="folder"&&r(w.path)},[G,t,r]),E=w=>{let N,P=y=>{for(let h of y)h.kind==="group"&&(h.id===w&&(N=h),P(h.children))};return P(e.roots),N},L=w=>{let N=(P,y)=>{if(P.some(h=>h.id===w))return{parentId:y,siblings:P};for(let h of P){if(h.kind!=="group")continue;let R=N(h.children,h.id);if(R!==void 0)return R}};return N(e.roots,null)??{parentId:null,siblings:[]}},j=(w,N)=>{let P=N?.getBoundingClientRect(),{parentId:y,siblings:h}=L(w.id);p({node:w,parentId:y,siblings:h,left:P?.left??0,top:(P?.bottom??0)+4})},Z=(w,N)=>{let{parentId:P,siblings:y}=L(w.id),h=y.map(ae=>ae.id),R=h.indexOf(w.id),H=R+N;if(R<0||H<0||H>=h.length)return;let q=[...h],[re]=q.splice(R,1);re!==void 0&&(q.splice(H,0,re),p(null),u?.(P,q))},Re=w=>{let N=b;if(x(null),N===null||N===w)return;let P=e.roots.map(q=>q.id),y=P.indexOf(N),h=P.indexOf(w);if(y<0||h<0)return;let R=[...P],[H]=R.splice(y,1);H!==void 0&&(R.splice(h,0,H),u?.(null,R))};return(0,de.useEffect)(()=>{if(m===null||typeof document>"u")return;let w=P=>{P.target instanceof Node&&(P.target instanceof Element&&P.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||p(null))},N=P=>{P.key!=="Escape"||P.isComposing||(P.preventDefault(),P.stopPropagation(),p(null))};return document.addEventListener("pointerdown",w),document.addEventListener("keydown",N,!0),()=>{document.removeEventListener("pointerdown",w),document.removeEventListener("keydown",N,!0)}},[m]),(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,W.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(w=>(0,W.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":b===w.id?"true":void 0,draggable:!0,onDragStart:()=>x(w.id),onDragEnd:()=>x(null),onDragOver:N=>N.preventDefault(),onDrop:N=>{N.preventDefault(),Re(w.id)},children:[w.kind==="group"?(0,W.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(N=>N.groupId===w.id),title:n("bookmarks.group"),onPointerEnter:N=>M(w.id,1,N.currentTarget),onFocus:N=>M(w.id,1,N.currentTarget),onPointerLeave:I,children:[(0,W.jsx)("span",{className:"fx-bookmark-name",children:w.name}),(0,W.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,W.jsx)(ri,{})})]}):(0,W.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":w.kind,title:w.path,onClick:()=>O(w),children:(0,W.jsx)("span",{className:"fx-bookmark-name",children:w.name})}),(0,W.jsx)(oi,{node:w,t:n,onOpen:j})]},w.id))}),m===null?null:(0,W.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:m.left,top:m.top},children:[(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{p(null),i?.(m.node)},children:n("bookmarks.rename")}),(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{p(null),a?.(m.node)},children:n("bookmarks.remove")}),(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:m.siblings[0]?.id===m.node.id,onClick:()=>Z(m.node,-1),children:n("bookmarks.moveUp")}),(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:m.siblings[m.siblings.length-1]?.id===m.node.id,onClick:()=>Z(m.node,1),children:n("bookmarks.moveDown")}),(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{p(null),d?.(m.node)},children:n("bookmarks.moveToGroup")})]}),s.map(w=>{let N=E(w.groupId);if(N===void 0)return null;let P=w.depth===1?{left:w.left,top:w.top}:{left:w.left,top:w.top};return(0,W.jsxs)("div",{className:w.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":w.depth,role:"menu","aria-label":N.name,style:P,onPointerEnter:F,onPointerLeave:I,children:[N.children.length===0?null:N.children.map(y=>(0,W.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[y.kind==="group"?(0,W.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(h=>h.groupId===y.id),onPointerEnter:h=>M(y.id,w.depth+1,h.currentTarget),onFocus:h=>M(y.id,w.depth+1,h.currentTarget),children:[(0,W.jsx)("span",{className:"fx-bookmark-name",children:y.name}),(0,W.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,W.jsx)(ri,{})})]}):(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":y.kind,role:"menuitem",title:y.path,onClick:()=>O(y),children:(0,W.jsx)("span",{className:"fx-bookmark-name",children:y.name})}),(0,W.jsx)(oi,{node:y,t:n,onOpen:j})]},y.id)),(0,W.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(G(),o(N.id))},children:n("bookmarks.newGroup")})]},N.id)})]})}var Pe=require("react");function ie(e){throw new Error(`bookmarks: ${e}`)}function Nn(e){return{version:1,roots:[],updatedAt:e}}function Fn(e,n){let t=n.name.trim();if(t===""&&ie("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&ie(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function Cr(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&Cr(r.children,n,r.id)}function $e(e,n){let t;return Cr(e.roots,r=>{r.id===n&&(t=r)}),t}function ai(e,n){let t;return Cr(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function si(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&si(t,n))}function Pr(e,n){if(n===null)return e.roots;let t=$e(e,n);return t===void 0&&ie(`no group with id "${n}"`),t.kind!=="group"&&ie(`"${n}" is not a group`),t.children}function di(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function fn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:fn(r.children,n,t)})}function Mn(e,n,t){return{version:1,roots:n,updatedAt:t}}var Bn=()=>new Date().toISOString();function Ln(e,n,t,r,o=Bn){let i=Pr(e,n);$e(e,t.id)!==void 0&&ie(`a node with id "${t.id}" already exists`);let a=di(r,i.length),d=fn(e.roots,n,u=>[...u.slice(0,a),t,...u.slice(a)]);return Mn(e,d,o())}function li(e,n,t=Bn){let r=$e(e,n);r===void 0&&ie(`no node with id "${n}"`);let o=ai(e,n);o===void 0&&ie(`no node with id "${n}"`);let i=fn(e.roots,o,a=>a.filter(d=>d.id!==n));return{tree:Mn(e,i,t()),removed:r}}function ui(e,n,t,r=Bn){let o=t.trim();o===""&&ie("a node needs a non-empty name"),$e(e,n)===void 0&&ie(`no node with id "${n}"`);let i=a=>a.map(d=>{let u=d.id===n?{...d,name:o}:d;return u.kind==="group"?{...u,children:i(u.children)}:u});return Mn(e,i(e.roots),r())}function ci(e,n,t,r,o=Bn){let i=$e(e,n);i===void 0&&ie(`no node with id "${n}"`);let a=ai(e,n);if(a===void 0&&ie(`no node with id "${n}"`),t!==null){let f=$e(e,t);f===void 0&&ie(`no group with id "${t}"`),f.kind!=="group"&&ie(`"${t}" is not a group`),i.kind==="group"&&si(i,t)&&ie(`cannot move "${n}" into itself or its own descendant`)}let d=fn(e.roots,a,f=>f.filter(m=>m.id!==n)),u=Pr({version:1,roots:d,updatedAt:e.updatedAt},t),s=di(r,u.length),l=fn(d,t,f=>[...f.slice(0,s),i,...f.slice(s)]);return Mn(e,l,o())}function fi(e,n,t,r=Bn){let o=Pr(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&ie(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||ie(`"${s}" is not a child of ${n??"the root"}`);let d=new Map(o.map(s=>[s.id,s])),u=fn(e.roots,n,()=>t.map(s=>{let l=d.get(s);return l===void 0&&ie(`"${s}" is not a child of ${n??"the root"}`),l}));return Mn(e,u,r())}var Fe=require("react");var ve=require("react/jsx-runtime"),rd=200;function od(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>rd?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function id(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function In({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:d,titleKey:u,submitKey:s}){let[l,f]=(0,Fe.useState)(()=>d??id(e)),[m,p]=(0,Fe.useState)(void 0),b=(0,Fe.useRef)(null),x=ft();(0,Fe.useEffect)(()=>{d!==void 0&&(f(d),p(void 0))},[d]),(0,Fe.useEffect)(()=>{let E=b.current;E!==null&&(E.focus(),E.select())},[]);let F=(0,Fe.useCallback)(()=>{if(a)return;let E=od(l,e);if(!E.ok){p(t(`prompt.error.${E.reason}`));return}p(void 0),r(E.name)},[a,e,r,t,l]),G=E=>{if(!E.nativeEvent.isComposing){if(E.key==="Escape"){E.preventDefault(),E.stopPropagation(),o();return}E.key==="Enter"&&(E.preventDefault(),F())}},I=m??i,M=x.Input,O=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,ve.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(O),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:G,children:[(0,ve.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,ve.jsx)("strong",{children:t(O)}),(0,ve.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),M===void 0?(0,ve.jsx)("input",{ref:b,className:"fx-name-input",type:"text",value:l,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":I===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:E=>{f(E.target.value),p(void 0)}}):(0,ve.jsx)(M,{ref:b,className:"fx-name-input",value:l,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":I===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:E=>{f(E.target.value),p(void 0)}}),I===void 0?null:(0,ve.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:I}),(0,ve.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,ve.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,ve.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:F,children:t(s??"prompt.submit")})]})]})}var Q=require("react/jsx-runtime");function pi(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function ad(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let d=[...i,a];if(a.id===n)return t.push(...d),!0;if(r(a.children,d))return!0}return!1};return r(e.roots,[]),t}function mi({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[d,u]=(0,Pe.useState)(null),[s,l]=(0,Pe.useState)(e),[f,m]=(0,Pe.useState)(!1),[p,b]=(0,Pe.useState)(void 0),x=(0,Pe.useRef)(null);(0,Pe.useEffect)(()=>{let L=Z=>{Z.target instanceof Node&&x.current?.contains(Z.target)!==!0&&a()},j=Z=>{Z.key!=="Escape"||Z.isComposing||f||(Z.preventDefault(),Z.stopPropagation(),a())};return document.addEventListener("pointerdown",L),document.addEventListener("keydown",j,!0),()=>{document.removeEventListener("pointerdown",L),document.removeEventListener("keydown",j,!0)}},[f,a]);let F=()=>(d===null?s.roots:$e(s,d)?.kind==="group"?$e(s,d).children:[]).filter(j=>j.kind==="group"),G=(0,Pe.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(ci(s,o.id,d));return}if(n===void 0)return;let L=Fn(n.kind==="directory"?"folder":"file",{id:pi(),name:n.name,path:n.path,createdAt:Date.now()});i(Ln(s,d,L))}catch(L){b(L instanceof Error?L.message:String(L))}},[d,s,r,o,i,n]),I=L=>{try{let j=Fn("group",{id:pi(),name:L,createdAt:Date.now()}),Z=Ln(s,d,j);l(Z),m(!1),b(void 0),u(j.id)}catch(j){b(j instanceof Error?j.message:String(j))}},M=ad(s,d),O=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),E=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,Q.jsxs)("div",{ref:x,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":O,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,Q.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,Q.jsx)("strong",{children:O}),r==="add"&&n!==void 0?(0,Q.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,Q.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,Q.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,Q.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),M.map(L=>(0,Q.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(L.id),children:L.name},L.id))]}),(0,Q.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:F().length===0?(0,Q.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):F().map(L=>(0,Q.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(L.id),children:(0,Q.jsx)("span",{className:"fx-bookmark-name",children:L.name})},L.id))}),p===void 0?null:(0,Q.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:p}),f?(0,Q.jsx)(In,{kind:"directory",parent:d??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:I,onCancel:()=>m(!1)}):(0,Q.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,Q.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>m(!0),children:t("bookmarks.newGroup")}),(0,Q.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:G,children:E})]})]})}var sd="dsh_fs_explorer",dd="bookmarks";function we(e){throw new Error(`bookmarks: ${e}`)}function yi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function kt(e,n,t){typeof e!="string"&&we(`${n} must be a string`);let r=e.trim();return r===""&&we(`${n} must not be empty`),r.length>t&&we(`${n} must be at most ${String(t)} characters`),r}function gi(e,n,t,r){t>32&&we(`${n} is nested deeper than ${String(32)} levels`),yi(e)||we(`${n} must be an object`);let o=kt(e.id,`${n}.id`,200);r.has(o)&&we(`duplicate id "${o}" at ${n}`),r.add(o);let i=kt(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&we(`${n}.createdAt must be a finite number`);let d=e.kind;if(d==="group"){let u=e.children;return Array.isArray(u)||we(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((s,l)=>gi(s,`${n}.children[${String(l)}]`,t+1,r))}}if(d==="file"||d==="folder"){let u=kt(e.path,`${n}.path`,4096);return{id:o,kind:d,name:i,createdAt:a,path:u}}return we(`${n}.kind must be "group", "file" or "folder"`)}function pn(e){yi(e)||we("a bookmark tree must be an object"),e.version!==1&&we(`version must be 1, received ${JSON.stringify(e.version)}`);let n=kt(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||we("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>gi(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var Jl={name:sd,version:1,invalidRecords:"backup-and-skip",tables:{[dd]:{valueSchema:{parse:pn}}}};function ki(e){return`dsh-fs-explorer.bookmarks.${e}`}function xi(){try{return globalThis.localStorage??void 0}catch{return}}function ld(e){let n=xi();if(n===void 0)return;let t;try{t=n.getItem(ki(e))}catch{return}if(t!==null)try{return pn(JSON.parse(t))}catch{return}}function ud(e,n){let t=xi();if(t!==void 0)try{t.setItem(ki(e),JSON.stringify(n))}catch{}}function bi(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree??Nn(new Date().toISOString())}catch{}return ld(n)??Nn(new Date().toISOString())},async save(n,t){let r=pn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok)return}catch{}ud(n,r)}}}var Tr="fs-explorer.treePaneWidth";function Er(e){return Math.min(520,Math.max(180,e))}function vi(e){if(e==null)return null;let n;try{n=e.getItem(Tr)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function xt(e,n){let t=Math.round(Er(n));if(e!=null)try{e.setItem(Tr,String(t))}catch{}return t}function wi(e){if(e!=null)try{e.removeItem(Tr)}catch{}}function Ri(e,n){return Math.round(e)===Math.round(n)}var hi=16;function Si(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-hi};case"ArrowRight":return{kind:"nudge",delta:hi};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var V=require("react");function Pi(e,n,t,r=800){return t-n<=r?e:""}function Ti(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Ei(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:cd(e,t+1,r.depth,r.depth+1)}function cd(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var fd=/^.$/u;function Ni(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!fd.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ci(e.names,n),d=a.find(u=>u>e.active)??a[0];return d===void 0?{kind:"miss"}:{kind:"jump",index:d,query:n}}let t=`${e.query}${n}`,r=Ci(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ci(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var B=require("react/jsx-runtime"),ze=22;function Nr({open:e=!0,size:n=14}){return(0,B.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,B.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,B.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function pd(){return(0,B.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,B.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Fi(){return(0,B.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,B.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,B.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Mi(){return(0,B.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,B.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function md({name:e}){return(0,B.jsx)("span",{className:"fx-badge","data-icon":sn(e),"aria-hidden":"true",children:dn(e)})}function yd({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:d,onContextMenu:u}){let s=e.kind==="directory",l={top:r,paddingLeft:8+e.depth*12};return(0,B.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{d(e.path),s?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,B.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,B.jsx)(pd,{})}),s?(0,B.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,B.jsx)(Nr,{open:e.expanded})}):(0,B.jsx)(md,{name:e.name}),(0,B.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,B.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,B.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":hn(e.status),"data-testid":"fx-file-status",title:o(Dt(e.status)),"aria-label":o(Dt(e.status)),children:Kn(e.status)}),e.statusCount===void 0?null:(0,B.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,B.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,B.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,B.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,B.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,B.jsx)("span",{className:"fx-size",children:Qn(e.size)})]})}function gd({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,B.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,B.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,B.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,B.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,B.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function kd(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Bi({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:d,onContextMenu:u}){let s=(0,V.useRef)(null),[l,f]=(0,V.useState)(0),[m,p]=(0,V.useState)(0),[b,x]=(0,V.useState)(void 0),F=(0,V.useRef)(void 0),G=(0,V.useRef)({query:"",at:0}),I=(0,V.useRef)(void 0),M=(0,V.useRef)(void 0),O=(0,V.useRef)(b);O.current=b;let E=(0,V.useMemo)(()=>e.flatMap((y,h)=>y.type==="entry"?[h]:[]),[e]);(0,V.useEffect)(()=>{let y=M.current!==n;if(M.current=n,I.current!==void 0||n===void 0)return;let h=O.current===void 0?void 0:e[O.current];if(!io({cursorPath:h?.type==="entry"?h.path:void 0,selectionMoved:y}))return;let R=e.findIndex(H=>H.type==="entry"&&H.path===n);R>=0&&x(R)},[n,e]),(0,V.useEffect)(()=>{let y=I.current;if(y===void 0)return;let h=e.findIndex(q=>q.type==="entry"&&q.path===y),R=e[h];if(R?.type!=="entry"||R.kind!=="directory"||!R.expanded){I.current=void 0;return}let H=ao(e,y);H!==void 0&&(I.current=void 0,x(H))},[e]),(0,V.useEffect)(()=>{b!==void 0&&e[b]?.type!=="entry"&&x(void 0)},[e,b]),(0,V.useEffect)(()=>{let y=s.current;if(b===void 0||y===null)return;let h=Wt({scrollTop:y.scrollTop,viewport:y.clientHeight,rowHeight:ze,index:b});h!==y.scrollTop&&(y.scrollTop=h)},[b]);let L=(0,V.useCallback)(y=>{x(y),s.current?.focus({preventScroll:!0})},[]),j=(0,V.useCallback)(y=>{let h=e.findIndex(R=>R.type==="entry"&&R.path===y);h>=0&&x(h)},[e]),Z=(0,V.useCallback)((y,h,R)=>{j(y.path),u(y,h,R)},[j,u]),Re=(0,V.useCallback)(y=>{y.preventDefault(),u(void 0,{x:y.clientX,y:y.clientY},y.currentTarget)},[u]),w=(0,V.useCallback)(y=>{if(y.nativeEvent.isComposing||y.altKey||y.metaKey||y.ctrlKey)return;let h=E.at(-1);if(y.key==="ArrowDown"){if(y.preventDefault(),b===void 0){E[0]!==void 0&&L(E[0]);return}let _=E.find(Y=>Y>b);_!==void 0&&L(_);return}if(y.key==="ArrowUp"){if(y.preventDefault(),b===void 0){h!==void 0&&L(h);return}let _=[...E].reverse().find(Y=>Y<b);_!==void 0&&L(_);return}if(b===void 0)return;let R=e[b];if(R===void 0||R.type!=="entry")return;if(y.key==="ArrowRight"){if(y.preventDefault(),R.kind==="directory"&&!R.expanded)I.current=R.path,o(R.path);else{let _=E.find(Y=>Y>b);_!==void 0&&e[_]?.depth===R.depth+1&&L(_)}return}if(y.key==="ArrowLeft"){if(y.preventDefault(),R.kind==="directory"&&R.expanded)o(R.path);else{let _=[...E].reverse().find(Y=>Y<b&&e[Y]?.type==="entry"&&e[Y].depth<R.depth);_!==void 0&&L(_)}return}if(y.key==="Enter"&&R.kind!=="directory"){y.preventDefault(),i(R.path);return}if(y.key==="ContextMenu"||y.key==="F10"&&y.shiftKey){y.preventDefault();let _=s.current?.getBoundingClientRect(),Y=_===void 0?0:_.top+b*ze-(s.current?.scrollTop??0);Z(R,{x:_?.left??0,y:Y+ze},s.current??void 0);return}if(y.key==="Home"){y.preventDefault(),E[0]!==void 0&&L(E[0]);return}if(y.key==="End"){y.preventDefault(),h!==void 0&&L(h);return}let H=Date.now(),q=Ti(e,b),re=Ei(e,q),ae=re.map(_=>{let Y=e[_];return Y?.type==="entry"?Y.name:""}),ee=Ni({query:Pi(G.current.query,G.current.at,H),key:y.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:y.nativeEvent.repeat,names:ae,active:b===void 0?-1:re.indexOf(b)});if(ee.kind==="clear"){G.current={query:"",at:0};return}if(ee.kind!=="jump")return;let J=re[ee.index];if(J===void 0)return;let X=e[J];X?.type==="entry"&&(G.current={query:ee.query,at:H},y.preventDefault(),L(J),X.kind!=="directory"&&i(X.path))},[b,E,L,o,i,Z,e]);(0,V.useEffect)(()=>{let y=s.current;if(y===null)return;let h=()=>p(y.clientHeight);if(h(),typeof ResizeObserver>"u")return;let R=new ResizeObserver(h);return R.observe(y),()=>R.disconnect()},[]),(0,V.useEffect)(()=>{if(n===void 0)return;let y=s.current;if(y===null)return;let h=e.findIndex(H=>H.type==="entry"&&H.path===n);if(h<0)return;let R=h*ze;(R<y.scrollTop||R+ze>y.scrollTop+y.clientHeight)&&(y.scrollTop=Math.max(0,R-y.clientHeight/2))},[n,e]),(0,V.useEffect)(()=>{if(t===void 0||F.current===t)return;let y=s.current;if(y===null)return;let h=t.path===void 0?-1:e.findIndex(R=>R.type==="entry"&&R.path===t.path);if(!(t.path!==void 0&&h<0)){if(F.current=t,h>=0){let R=Wt({scrollTop:y.scrollTop,viewport:y.clientHeight===0?480:y.clientHeight,rowHeight:ze,index:h});R!==y.scrollTop&&(y.scrollTop=R,f(R)),x(h)}kd(y),d?.()}},[t,e,d]);let N=y=>{f(y.currentTarget.scrollTop)},P=qn(e,{scrollTop:l,height:m===0?480:m,rowHeight:ze});return(0,B.jsx)("div",{className:"fx-scroll",ref:s,onScroll:N,onKeyDown:w,onContextMenu:Re,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,B.jsx)("div",{className:"fx-vlist",style:{height:e.length*ze},children:P.rows.map((y,h)=>{let R=(P.startIndex+h)*ze;return y.type==="entry"?(0,B.jsx)(yd,{row:y,top:R,selected:y.path===n,cursor:b===P.startIndex+h,t:r,onToggle:o,onSelect:i,onRowActivate:j,onContextMenu:(H,q)=>Z(H,{x:q.clientX,y:q.clientY},q.currentTarget instanceof HTMLElement?q.currentTarget:void 0)},y.path):(0,B.jsx)(gd,{row:y,top:R,t:r,onRetry:a},y.key)})})})}function Me(e){return e!==null&&typeof e=="object"}function ht(e){try{return e()}catch{return}}function xd(e){let n=ht(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Me(n)?n.rpc:void 0;if(!(!Me(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Gr}/${r}`,o,i)}function bd(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks")}}function Fr(e){return Me(e)&&typeof e.info=="function"&&typeof e.reveal=="function"}function hd(e){return()=>{let n=ht(()=>e.fsExplorerWorkspace);if(Fr(n))return n;let t=ht(()=>Me(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Fr(t))return t;let r=ht(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Fr(r))return r;let o=xd(e);if(o!==void 0)return bd(o)}}function mn(e){let n=Me(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Me(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Me(t)?t:void 0}var vd=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function yn(e){let n=Me(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:vd.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function wd(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};let t=Me(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function Rd(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};let t=Me(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function Sd(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:{ok:!0}}function Cd(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function Pd(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:pn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function Td(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:{ok:!0}}var bt={code:"unsupported",message:"the workspace service is unavailable"};function Li(e){let n=hd(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:bt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),wd),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),Rd),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),Sd),create:(r,o,i,a,d)=>t(u=>{let s=u.create;return typeof s!="function"?{ok:!1,error:bt}:s.call(u,{sessionId:r,parent:o,name:i,kind:a},d)},Cd),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:bt}:a.call(i,{sessionId:r},o)},Pd),saveBookmarks:(r,o,i)=>t(a=>{let d=a.saveBookmarks;return typeof d!="function"?{ok:!1,error:bt}:d.call(a,{sessionId:r,tree:o},i)},Td)}}var Ed={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function Nd(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var Fd={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function Md(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",s=Ii(t[2]??"");return s===""?void 0:{base:`https://${u}/${s}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=Ii(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function Ii(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Bd(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Ld(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return n;let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Id(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function Ai(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=Id(t,r);if(a===void 0)return[];let d=Ld(i),u=Bd(a),s=[],l=new Set;for(let f of n){if(l.has(f.name))continue;let m=Md(f.url);if(m===void 0)continue;l.add(f.name);let p=Nd(m.host),b=Fd[p][o],x=u===""?"":`/${u}`;s.push({id:`copy.remote.${f.name}`,label:`${f.name} \xB7 ${Ed[p]}`,url:`${m.base}/${b}/${d}${x}`})}return s}var T=require("react/jsx-runtime");function Ad(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Dd=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Od(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Wd=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Oi=new Map;function $d(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function vt({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,T.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,T.jsx)("strong",{children:e}),n===void 0?null:(0,T.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,T.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function zd(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Wi({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:d,locate:u,workspace:s}){let l=vo();function f(m){let p=m.sessionId??e.currentSessionId(),b=(0,k.useRef)(p);b.current=p;let x=(0,k.useMemo)(()=>r(),[r]),F=(0,k.useMemo)(()=>o(),[o]),G=(0,k.useMemo)(()=>i(),[i]),I=(0,k.useMemo)(()=>p===void 0||u===void 0?void 0:u(p),[u,p]),M=(0,k.useMemo)(()=>p===void 0||s===void 0?void 0:s(p),[s,p]),O=(0,k.useMemo)(()=>bi(M),[M]),[E,L]=(0,k.useState)(()=>Nn(new Date().toISOString())),[j,Z]=(0,k.useState)(null),[Re,w]=(0,k.useState)(null),N=(0,k.useRef)(!1),[P,y]=(0,k.useState)(null),[h,R]=(0,k.useState)(void 0),[H,q]=(0,k.useState)(null),re=(0,k.useRef)(null),[ae,ee]=(0,k.useState)(null),[J,X]=(0,k.useState)(()=>new Map),[_,Y]=(0,k.useState)(void 0),[fe,Te]=(0,k.useState)(void 0),[ge,je]=(0,k.useState)(void 0),[Qe,Be]=(0,k.useState)(void 0),[en,An]=(0,k.useState)(Oi),nn=(0,k.useRef)(J);nn.current=J;let[_e,Le]=(0,k.useState)(()=>new Set),$=(0,k.useMemo)(()=>l.forSession(p),[l,p]),he=(0,k.useSyncExternalStore)($.subscribe,$.snapshot,$.snapshot),Dn=he.panels.find(c=>c.key===he.active),ke=Dn?.path,Ke=Dn?.revision,[tn,He]=(0,k.useState)(0),A=(0,k.useRef)(new Map),le=(0,k.useRef)(void 0),[ue,pe]=(0,k.useState)(null),[Gi,Ir]=(0,k.useState)(!1),[Vi,rn]=(0,k.useState)(null),Ar=(0,k.useRef)(null);Ar.current=ue?.path??null;let Ge=(0,k.useMemo)(()=>Od(),[]),[Ve,on]=(0,k.useState)(()=>vi(Ge)),Pt=(0,k.useRef)(null),an=(0,k.useRef)(null),ne=J.get(""),On=ne?.status==="ready",Wn=(0,k.useCallback)((c,g,v,C)=>{$.open(c,g,v,C)},[$]),Tt=(0,k.useCallback)(c=>{let g=c??$.snapshot().active??void 0;if(g===void 0)return;if((p===void 0?void 0:d?.peek(p,g))?.dirty===!0){rn(null),pe({path:g});return}pe(null),rn(null),p!==void 0&&d?.forget(p,g),$.close(g)},[d,p,$]),qi=(0,k.useCallback)(()=>{let c=ue;if(c===null)return;let g=p===void 0?void 0:d?.find(p,c.path);if(g===void 0){pe(null),p!==void 0&&d?.forget(p,c.path),$.close(c.path);return}Ir(!0),rn(null),g.save().then(v=>{if(Ir(!1),!v.ok){let C=g.getSnapshot().error;rn(t("panel.confirm.failed").replace("{message}",Rr(v.code,C?.message??"",t)));return}pe(null),p!==void 0&&d?.forget(p,c.path),$.close(c.path)})},[d,ue,p,$,t]),Ui=(0,k.useCallback)(()=>{let c=ue;pe(null),rn(null),c!==null&&(p!==void 0&&d?.forget(p,c.path),$.close(c.path))},[d,ue,p,$]),Et=(0,k.useCallback)(()=>{pe(null),rn(null)},[]),xe=(0,k.useCallback)(async(c,g,v)=>{A.current.get(c)?.abort();let C=new AbortController;A.current.set(c,C),X(K=>new Map(K).set(c,Dd()));try{let K=await v.list(g,Un(c),C.signal);if(C.signal.aborted||b.current!==g)return!1;let U=yt(K);if(!U.ok)return X(Ie=>new Map(Ie).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:U.message})),!1;let Se=Vn(U.listing.entries);return X(Ie=>new Map(Ie).set(c,{status:"ready",nodes:Se,truncated:U.listing.truncated===!0,total:U.listing.entries.length})),!0}catch(K){return C.signal.aborted||X(U=>new Map(U).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:Vo(K)})),!1}finally{A.current.get(c)===C&&A.current.delete(c)}},[]);(0,k.useEffect)(()=>{for(let c of A.current.values())c.abort();return A.current.clear(),X(new Map),Le(new Set),le.current=void 0,p!==void 0&&x!==void 0&&xe("",p,x),()=>{for(let c of A.current.values())c.abort();A.current.clear()}},[p,x,tn,xe]),(0,k.useEffect)(()=>{if(p===void 0||F===void 0){Y(void 0),Te(void 0),je(void 0),Be(void 0);return}let c=!0,g=new AbortController;return Y(void 0),Te(void 0),je(void 0),Be(void 0),Promise.resolve().then(()=>F.snapshot({sessionId:p,maxCommits:1},g.signal)).then(v=>{if(!c)return;let C=gt(v);if(!C.ok){Y(void 0),Te(void 0),je(void 0),Be(void 0);return}Y(Jr(_n(C.status),C.stats)),Te(C.head),je(C.root),Be(C.remotes)}).catch(()=>{c&&(Y(void 0),Te(void 0),je(void 0),Be(void 0))}),()=>{c=!1,g.abort()}},[p,F,tn]),(0,k.useEffect)(()=>{let c=x?.read;if(p===void 0||x===void 0||typeof c!="function"||!On){An(Oi);return}let g=p,v=new AbortController,C=async(U,Se)=>{try{let Ie=$d(await c.call(x,g,Se,{},v.signal));return Ie===void 0?void 0:[U,Ie]}catch{return}},K=to.filter(U=>U!==".gitmodules").map(U=>C(U,U));return ge!==void 0&&K.push(C(".gitmodules",`${ge.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(K).then(U=>{if(v.signal.aborted||b.current!==g)return;let Se=new Map;for(let Ue of U)Ue!==void 0&&Se.set(Ue[0],Ue[1]);let Ie=nn.current.get(""),ya=new Set(Ie?.status==="ready"?Ie.nodes.filter(Ue=>Ue.kind==="directory").map(Ue=>Ue.name):[]);An(Hn(Se,ya))}),()=>v.abort()},[p,x,On,ge,tn]),(0,k.useEffect)(()=>{let c=m.viewRequest;if(c==null||c.view!==me)return;let g=`${c.view}:${c.focus}`;le.current!==g&&(le.current=g,wn(c.focus,{open:Wn}),m.completeViewRequest?.())},[m.viewRequest,m.completeViewRequest,Wn]),(0,k.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||p===void 0)return;let g=()=>{let v=c.take(me);v!==void 0&&wn(v,{open:Wn})};return g(),c.subscribe(g)},[e,p,Wn]),(0,k.useEffect)(()=>{if(ke===void 0||Ke!==void 0||!On||Xn(ke))return;let c=$t(ke);if(c.length===0||(Le(v=>c.every(C=>v.has(C))?v:new Set([...v,...c])),p===void 0||x===void 0))return;let g=c.filter(v=>nn.current.get(v)?.status!=="ready");g.length!==0&&Promise.all(g.map(v=>xe(v,p,x)))},[ke,Ke,On,p,x,xe]);let Dr=(0,k.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),Xi=(0,k.useCallback)(c=>{if(c.button!==0||an.current!==null||Wd())return;let g=Pt.current?.previousElementSibling;if(g instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}an.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:g.getBoundingClientRect().width,restWidth:Ve},document.body.classList.add("fx-pane-resizing")}},[Ve]),Yi=(0,k.useCallback)(c=>{let g=an.current;g===null||g.pointerId!==c.pointerId||on(Er(g.baseWidth+c.clientX-g.startX))},[]),Nt=(0,k.useCallback)(c=>{let g=an.current;if(g===null||g.pointerId!==c.pointerId)return;an.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let v=g.baseWidth+c.clientX-g.startX;if(Ri(v,g.baseWidth)){on(g.restWidth);return}on(xt(Ge,v))},[Ge]),Ft=(0,k.useCallback)(()=>{wi(Ge),on(null)},[Ge]),Zi=(0,k.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let g=Si(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(g===null)return;if(c.preventDefault(),c.stopPropagation(),g.kind==="reset"){Ft();return}if(g.kind==="min"||g.kind==="max"){let K=g.kind==="min"?180:520;on(xt(Ge,K));return}let v=Pt.current?.previousElementSibling,C=v instanceof HTMLElement?v.getBoundingClientRect().width:Ve??180;on(xt(Ge,C+g.delta))},[Ge,Ft,Ve]);(0,k.useEffect)(()=>()=>{an.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,k.useEffect)(()=>{if(typeof document>"u")return;let c=g=>{if(!(g.isComposing||bo(g.target))){if(zd(g)){let v=$.snapshot().active,C=v===null||d===void 0||p===void 0?void 0:d.find(p,v);if(C===void 0)return;g.preventDefault(),g.stopPropagation(),C.save();return}for(let v of ot)if(xo(g,v)){if(v.action==="closePanel"&&$.snapshot().active===null)return;g.preventDefault(),g.stopPropagation(),v.action==="nextPanel"?$.next():v.action==="previousPanel"?$.previous():Tt();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[d,Tt,p,$]),(0,k.useEffect)(()=>{if(typeof document>"u")return;let c=it({focusComposer:Dr,hasModal:()=>Ar.current!==null||N.current||nr(document)}),g=v=>c(v);return document.addEventListener("keydown",g,!0),()=>document.removeEventListener("keydown",g,!0)},[Dr]),(0,k.useEffect)(()=>{if(ue===null||typeof document>"u")return;let c=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),Et())};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[ue,Et]);let Mt=(0,k.useMemo)(()=>Jn(J,_e,_,en),[J,_e,_,en]),[Ji,$n]=(0,k.useState)(void 0),Or=(0,k.useRef)(!1);(0,k.useEffect)(()=>{if(Or.current||typeof document>"u")return;let c=so({rows:Mt,panelCount:$.snapshot().panels.length,hasModal:nr(document)});c.kind!=="skip"&&(Or.current=!0,c.open!==void 0&&$.open(c.open),$n({path:c.focus}))},[Mt,$]);let Qi=(0,k.useCallback)(()=>$n(void 0),[]),gn=_===void 0?void 0:Object.keys(_).length,ea=_===void 0?"neutral":Object.values(_).some(c=>c.status==="conflicted")?"conflict":gn===0?"success":"warning",Wr=Zr(fe),na=(0,k.useCallback)(c=>{if(p===void 0||x===void 0)return;if(_e.has(c)){Le(v=>{let C=new Set(v);return C.delete(c),C});return}Le(v=>new Set(v).add(c));let g=J.get(c);(g===void 0||g.status==="failed")&&xe(c,p,x)},[_e,J,p,x,xe]),$r=(0,k.useCallback)(c=>{p===void 0||x===void 0||xe(c,p,x)},[p,x,xe]);(0,k.useEffect)(()=>{let c=!0;return O.load(p??"").then(g=>{c&&L(g)}).catch(()=>{}),()=>{c=!1}},[O,p]);let ta=(0,k.useCallback)(c=>{let g=[...$t(c),c];if(Le(v=>{let C=new Set(v);for(let K of g)C.add(K);return C}),p!==void 0&&x!==void 0){let v=g.filter(C=>nn.current.get(C)?.status!=="ready");v.length>0&&Promise.all(v.map(C=>xe(C,p,x)))}$n({path:c})},[p,x,xe]),ra=(0,k.useCallback)(c=>{$.open(c)},[$]),te=(0,k.useCallback)((c,g)=>{re.current!==null&&clearTimeout(re.current),q({text:c,tone:g}),re.current=setTimeout(()=>{re.current=null,q(null)},4e3)},[]);(0,k.useEffect)(()=>()=>{re.current!==null&&clearTimeout(re.current)},[]);let qe=(0,k.useCallback)(c=>{L(c),O.save(p??"",c).catch(()=>{te(t("bookmarks.saveFailed"),"error")})},[te,O,p,t]),oa=(0,k.useCallback)(c=>{try{qe(li(E,c.id).tree),te(t("bookmarks.removed"),"ok")}catch{}},[te,E,qe,t]),ia=(0,k.useCallback)((c,g)=>{try{qe(fi(E,c,g))}catch{}},[E,qe]);(0,k.useEffect)(()=>{if(M===void 0){R(void 0);return}let c=!0;return M.capabilities(p??"").then(g=>{c&&R(g.ok?g.capabilities:void 0)}),()=>{c=!1}},[M,p]);let aa=(0,k.useCallback)((c,g,v)=>{let C=c===void 0?"":c.kind==="directory"?c.path:Qo(c.path);if(y({row:c,anchor:g,absolutePath:void 0,trigger:v,createParent:C}),c===void 0||M===void 0)return;let K=c.path;M.info(p??"",K).then(U=>{y(Se=>Se===null||Se.row?.path!==K?Se:{...Se,absolutePath:U.ok?U.info.absolutePath:void 0})})},[p,M]),sa=(0,k.useCallback)(()=>y(null),[]);N.current=P!==null;let zn=(0,k.useMemo)(()=>Ai({remotes:Qe,root:ge,absolutePath:P?.absolutePath,kind:P?.row?.kind??"file",head:fe}),[P?.absolutePath,P?.row?.kind,ge,fe,Qe]),Bt=(0,k.useCallback)(c=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${c.code}`)),[t]),da=(0,k.useCallback)(c=>{let g=P;if(y(null),g===null)return;if(c===oe.createFile||c===oe.createFolder){let C=g.createParent;if(C===void 0)return;ee({kind:c===oe.createFolder?"directory":"file",parent:C,error:void 0,busy:!1});return}let v=g.row;if(v!==void 0){if(c.startsWith(`${oe.copyRemote}.`)){let C=zn.find(K=>K.id===c);if(C===void 0)return;Je(C.url).then(K=>{te(K?t("notice.copiedRemote").replace("{remote}",C.label):t("notice.copyFailed"),K?"ok":"error")});return}if(c===oe.copyRelative){Je(v.path).then(C=>{te(t(C?"notice.copiedRelative":"notice.copyFailed"),C?"ok":"error")});return}if(c===oe.copyAbsolute){let C=g.absolutePath;if(C===void 0)return;Je(C).then(K=>{te(t(K?"notice.copiedAbsolute":"notice.copyFailed"),K?"ok":"error")});return}if(c===oe.addBookmark){Z({mode:"add",target:{name:v.name,path:v.path,kind:v.kind}});return}if(c===oe.reveal){if(M===void 0){te(Bt({code:"unsupported",message:""}),"error");return}M.reveal(p??"",v.path).then(C=>{if(!C.ok){te(Bt(C.error),"error");return}let K=t(`menu.manager.${h?.fileManager??"directory"}`);te(t("notice.revealed").replace("{manager}",K),"ok")})}}},[te,h,P,zn,Bt,p,t,M]),la=(0,k.useCallback)(c=>{let g=ae;if(g===null)return;if(M===void 0||M.create===void 0){ee({...g,error:t("prompt.error.unsupported"),busy:!1});return}let v=p;if(v===void 0){ee({...g,error:t("prompt.error.no-workspace"),busy:!1});return}ee({...g,busy:!0,error:void 0}),M.create(v,g.parent,c,g.kind).then(C=>{if(!C.ok){ee(U=>U===null?U:{...U,busy:!1,error:t(`prompt.error.${C.error.code}`)});return}ee(null);let K=C.path;if(x!==void 0&&xe(g.parent,v,x),g.kind==="file"){$.open(K),te(t("notice.createdFile"),"ok");return}Le(U=>new Set(U).add(K)),x!==void 0&&xe(K,v,x),$n({path:K}),te(t("notice.createdFolder"),"ok")})},[te,x,xe,ae,p,$,t,M]),ua=(0,k.useCallback)(()=>ee(null),[]),ca=(0,k.useMemo)(()=>P===null?[]:ei({row:P.row,notices:{workspace:M!==void 0},capabilities:h,absolutePath:P.absolutePath,createParent:P.createParent,remoteLinks:P.row===void 0?void 0:zn,bookmarkTarget:P.row===void 0?void 0:{name:P.row.name,path:P.row.path,kind:P.row.kind}},t),[h,P,zn,t,M]),fa=()=>Le(new Set),pa=()=>He(c=>c+1),ma=p===void 0?"no-session":x===void 0?"no-service":ne===void 0||ne.status==="loading"?"loading":ne.status==="failed"?"failed":ne.nodes.length===0?"empty":"tree";return(0,T.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":ma,"data-session":p??"","data-testid":"fs-explorer-view",children:[(0,T.jsxs)("header",{className:"fx-head",children:[(0,T.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,T.jsx)(Nr,{open:!0})}),(0,T.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,T.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,T.jsx)(ii,{tree:E,t,onOpenFile:ra,onOpenFolder:ta,onCreateGroup:c=>w({mode:"group",parentId:c}),onRename:c=>w({mode:"rename",node:c}),onRemove:oa,onMove:c=>Z({mode:"move",node:c}),onReorder:ia}),(0,T.jsxs)("div",{className:"fx-head-meta",children:[ne?.status==="ready"?(0,T.jsxs)("span",{children:[(0,T.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}):null,(0,T.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:_e.size===0,onClick:fa,children:(0,T.jsx)(Mi,{})}),(0,T.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:p===void 0||x===void 0||ne?.status==="loading",onClick:pa,children:(0,T.jsx)(Fi,{})})]})]}),H===null?null:(0,T.jsx)("div",{className:"fx-notice",role:"status","data-tone":H.tone,"data-testid":"fx-notice",children:H.text}),(0,T.jsx)("div",{className:"fx-main",children:p===void 0?(0,T.jsx)(vt,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):x===void 0?(0,T.jsx)(vt,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ne===void 0||ne.status==="loading"?(0,T.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,T.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ne.status==="failed"?(0,T.jsx)(vt,{title:t("state.failed.title"),description:ne.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>$r(""),testId:"fs-failed"}):ne.nodes.length===0?(0,T.jsx)(vt,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("div",{className:"fx-tree-pane",style:Ve===null?void 0:{"--fx-tree-width":`${Ve}px`},children:(0,T.jsx)(Bi,{rows:Mt,selectedPath:Ke===void 0?ke:void 0,entryFocus:Ji,t,onToggle:na,onSelect:c=>$.open(c),onRetry:$r,onEntryFocusSettled:Qi,onContextMenu:aa})}),(0,T.jsx)("div",{ref:Pt,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":Ve??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Xi,onPointerMove:Yi,onPointerUp:Nt,onPointerCancel:Nt,onLostPointerCapture:Nt,onKeyDown:Zi,onDoubleClick:Ft}),(0,T.jsxs)("div",{className:"fx-editor",children:[(0,T.jsx)(wo,{panels:he.panels,active:he.active,t,onActivate:c=>$.activate(c),onClose:Tt,onStep:c=>c===1?$.next():$.previous(),documents:d,sessionId:p}),ue===null?null:(0,T.jsx)(Ro,{name:st(ue.path),t,saving:Gi,error:Vi,onSave:qi,onDiscard:Ui,onCancel:Et}),(0,T.jsx)("div",{className:"fx-editor-body",children:he.panels.length===0?(0,T.jsx)(So,{t}):he.panels.map((c,g)=>{let v=c.key===he.active;return(0,T.jsx)("div",{className:"fx-panel",id:`fx-panel-${g}`,role:"tabpanel","aria-labelledby":`fx-tab-${g}`,hidden:!v,"data-line":c.line,"data-testid":"fs-panel",children:(0,T.jsx)(Yo,{sessionId:p,files:x,path:c.path,revision:c.revision,git:G,t,visible:v,renderers:a,documents:d,locate:I})},c.key)})})]})]})}),P===null?null:(0,T.jsx)(ti,{entries:ca,anchor:P.anchor,onSelect:da,onClose:sa,...P.trigger===void 0?{}:{returnFocus:()=>P.trigger??null}}),ae===null?null:(0,T.jsx)(In,{kind:ae.kind,parent:ae.parent,t,error:ae.error,busy:ae.busy,onSubmit:la,onCancel:ua}),j===null?null:(0,T.jsx)(mi,{tree:E,target:j.mode==="add"?j.target:void 0,t,mode:j.mode,...j.mode==="move"?{node:j.node}:{},onCommit:c=>{let g=j.mode;qe(c),Z(null),te(t(g==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>Z(null)}),Re===null?null:(0,T.jsx)(In,{kind:"directory",parent:"",t,initialName:Re.mode==="rename"?Re.node.name:t("bookmarks.newGroup"),titleKey:Re.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:c=>{let g=Re;w(null);try{if(g.mode==="rename"){qe(ui(E,g.node.id,c)),te(t("bookmarks.renamed"),"ok");return}let v=Fn("group",{id:Ad(),name:c,createdAt:Date.now()});qe(Ln(E,g.parentId,v)),te(t("bookmarks.groupCreated"),"ok")}catch{te(t("bookmarks.saveFailed"),"error")}},onCancel:()=>w(null)}),ne?.status==="ready"?(0,T.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,T.jsxs)("span",{children:[t("view.scope")," ",(0,T.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}),ne.truncated?(0,T.jsx)("span",{className:"fx-foot-warn",children:vn({entries:ne.nodes,truncated:!0,total:ne.total}).label}):null,(0,T.jsxs)("span",{className:"fx-foot-git","data-state":gn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,T.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ea,"aria-hidden":"true"}),gn===void 0?t("status.unavailable"):gn===0?t("status.clean"):t("status.summary").replace("{count}",String(gn))]}),Wr===null?null:(0,T.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Wr,fe?.upstream!==void 0&&(fe.ahead??0)>0?(0,T.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(fe.ahead)}`}):null,fe?.upstream!==void 0&&(fe.behind??0)>0?(0,T.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(fe.behind)}`}):null]}),(0,T.jsx)("span",{className:"fx-spacer"}),(0,T.jsx)("span",{children:t("foot.order")})]}):null]})}return f}var zi=["slots","locale","workbench","remote"];function _d(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var wt,Rt,Br,St,Lr,ji;function $i(e){return Lr=e,St!==void 0||(St=ko({open:(n,t,r)=>{let o=Lr;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):yo(o)(n,t,r)},save:(n,t)=>{let r=Lr;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):go(r)(n,t)}})),St}function Kd(){if(Br!==void 0)return Br;let e=pt({warn:n=>ji?.(n)});for(let n of Sr())e.register(n);return Br=e,e}var Ct;function _i(e){let n=e.workbench;if(n==null)return()=>{};ji=l=>e.logger?.warn?.(l);let t=Kd(),r={version:Ao,renderers:t,registerRenderer:l=>t.register(l),documents:$i(e)};Rt?.();let o=e.provide?.(yr,r);o===void 0&&e.logger?.warn?.(`${bn}: ctx.provide unavailable, ${yr} service not registered`),Rt=o,wt?.();let i=e.locale.register(bn,{zh:{...Ut,...rr.zh,...wr.zh},en:{...Xt,...rr.en,...wr.en}});wt=i;let a=e.locale.bind(bn),d=Jo(typeof document>"u"?void 0:document),u=Wi({workbench:n,version:n.version,t:a,files:jo(e),status:qo(e),git:Ho(e),renderers:t,documents:$i(e),locate:l=>mo(e,l),workspace:()=>Li(e)});Ct?.();let s=qt(e,n);return Ct=s,e.slots.inject(It,()=>e.slots.register({name:It,id:me,order:100,label:()=>Yt(_d(e)),locale:bn},u)),()=>{o?.(),Rt===o&&(Rt=void 0),s(),Ct===s&&(Ct=void 0),d(),i(),wt===i&&(wt=void 0)}}var Ki={buildTree:Vn,describeListing:vn,iconFor:sn,computeTreeWindow:qn,flattenTree:Jn,badgeFor:dn,formatSize:Qn,joinPath:Yn,listingPath:Un,parseFocus:Zn,consumeViewRequest:wn,createPanelStack:tr,createEscapeHandler:it,KEYMAP:ot,tabLabel:Yt,normalizeListing:yt,normalizeStatusSnapshot:gt,buildWorkspaceMap:Hn,workspaceTagFor:Gn,parseStatusZ:_n,statusTone:hn,statusBadge:Kn,createPreviewLoader:lt,renderMarkdown:dt,languageFor:Cn,isMarkdownFile:Pn,describePage:ut,classifyPreviewFailure:Ze,normalizePreviewPage:cn,previewChunkRoute:Mo,canBridgeFile:et,decideBridge:Gt,focusForFileAddress:Ht,forwardFocus:Vt,registerAddressBridge:qt},Hi={name:"dsh-fs-explorer",inject:zi,apply:_i,__test:Ki};function Hd(e){Io(e),Fo(e)}var Gd=Hi;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
