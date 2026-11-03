window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ot=Object.defineProperty;var Pa=Object.getOwnPropertyDescriptor;var Ta=Object.getOwnPropertyNames;var Ea=Object.prototype.hasOwnProperty;var Ma=(e,n)=>{for(var t in n)Ot(e,t,{get:n[t],enumerable:!0})},Na=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ta(n))!Ea.call(e,o)&&o!==t&&Ot(e,o,{get:()=>n[o],enumerable:!(r=Pa(n,o))||r.enumerable});return e};var Fa=e=>Na(Ot({},"__esModule",{value:!0}),e);var il={};Ma(il,{__test:()=>Qi,apply:()=>Ji,boot:()=>rl,clientPlugin:()=>ea,default:()=>ol,inject:()=>Yi});module.exports=Fa(il);var cn=require("react");var qr="dsh-resource://file/";function Ur(e){try{return decodeURIComponent(e)}catch{return e}}function hn(e){if(!e.startsWith(qr))return null;let n=e.slice(qr.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Ur(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),d=a<0?i:i.slice(0,a);return d.length===0?null:{sessionId:o,path:d.split("/").map(Ur).join("/")}}function We(e){return e.slice(e.lastIndexOf("/")+1)}var Xr=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Yr(){return Xr.flatMap(e=>[...e.extensions])}function bn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Xr.find(o=>o.extensions.includes(r))?.family??null}var we="dsh-fs-explorer",Wt="conversation.view",fe="fs-explorer";var vn="fs-explorer",Zr="fsExplorerDocuments",Jr="fsExplorerWorkspace",Qr="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",$t={chunk:"client.preview.js"},jn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Ba={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},La={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Ia=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function no(e){return typeof e=="string"&&Ia.has(e)}function eo(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Aa(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Kn(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=eo(o.slice(2),i==="1"?7:8);if(a===null)continue;let d=a.fields[0]??"",u=a.rest;if(u===""||d.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:Aa(d[0]??".",d[1]??".")};continue}if(i==="u"){let a=eo(o.slice(2),9);if(a===null)continue;let d=a.rest;if(d==="")continue;n[d]={status:"conflicted"}}}}return n}function wn(e){return no(e)?Ba[e]:"neutral"}function Hn(e){return no(e)?La[e]:"?"}function zt(e){return`status.${e}`}function to(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function ro(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function oo(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function io(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Da=["conflicted","deleted","renamed","added","modified","untracked"];function Oa(e){return wn(Da.find(n=>e.has(n))??"modified")}function ao(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),d=r.endsWith("/")?a.length:a.length-1,u="";for(let s=0;s<d;s+=1){let l=a[s];if(l===void 0||l==="")continue;u=u===""?l:`${u}/${l}`;let p=n.get(u);p===void 0?n.set(u,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Oa(o.present)});return t}var uo=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],co=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Wa(e){return co.test(e)?e.slice(0,e.indexOf("/")):null}function $a(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function za(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=$a(i[2]??"");a!==""&&co.test(a)&&t.push(a)}return t}function _a(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let d=/^\[(.+)\]$/u.exec(a);if(d!==null){o(),r=/^submodule(\s|$)/u.test(d[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function so(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function lo(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Gn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let d of _a(r))t.set(d,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let d of za(i))o.add(d);let a=e.get("package.json");if(typeof a=="string"){let d=so(a);if(d!==void 0){let u=d.workspaces,s=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let l of lo(Array.isArray(u)?u:s))o.add(l)}}for(let d of["turbo.json","lerna.json"]){let u=e.get(d);if(typeof u!="string")continue;let s=so(u);if(s!==void 0)for(let l of lo(s.packages))o.add(l)}for(let d of o){let u=Wa(d);u!==null&&n.has(u)&&t.set(d,"package")}return t}function Vn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var ja=new Set(["node_modules",".git","dist","__pycache__"]);function Ka(e){return ja.has(e)}function Ha(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function qn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Ka(r))continue;let o=Ha(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Ga=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Va=new Set(["md","mdx","markdown","mdown","rst","adoc"]),qa=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Ua=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Xa=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Ya=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Za=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function fo(e){let n=We(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function ln(e,n="file"){if(n==="directory")return"folder";let t=We(e.toLowerCase());if(Za.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=fo(t);return r===""?"file":Ga.has(r)?"code":Va.has(r)?"markdown":qa.has(r)?"data":Ua.has(r)?"image":Xa.has(r)?"style":Ya.has(r)?"archive":"file"}var Ja={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Qa={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function un(e){let n=We(e.toLowerCase()),t=Ja[n];if(t!==void 0)return t;let r=fo(n),o=Qa[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Rn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Qr} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Un(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(d,0),a),s=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,s),startIndex:u,endIndex:s}}function jt(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Xn(e){return e===""?".":e}function Yn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Zn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Kt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Zn(r,o),t.push(r);return t}function _t(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Jn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let d=_t(t[2]),u=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""||d<1?void 0:{path:u,line:d,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let d=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:_t(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let a=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:_t(o[2]),absolute:!1}}function po(e){return e.selectionMoved?!0:e.cursorPath===void 0}function mo(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Qn(e,n,t,r){let o=[],i=ao(t),a=(d,u)=>{let s=e.get(d);if(!(s===void 0||s.status!=="ready"))for(let l of s.nodes){let p=Zn(d,l.name),y=l.kind==="directory",m=y&&n.has(p),h=y||t===void 0?void 0:t[p],x=h?.status??(y?void 0:to(p,t)),M=h===void 0?void 0:ro(h),H=y?i.get(p):void 0,L=y?Vn(r,p):void 0;if(o.push({type:"entry",path:p,name:l.name,kind:l.kind,depth:u,expanded:m,...l.size===void 0?{}:{size:l.size},...x===void 0?{}:{status:x},...H===void 0?{}:{statusCount:H.count,statusTone:H.tone},...M===void 0?{}:{diff:M},...L===void 0?{}:{tag:L}}),!m)continue;let N=e.get(p);if(N===void 0||N.status==="loading"){o.push({type:"status",key:`${p}:loading`,path:p,depth:u+1,state:"loading"});continue}if(N.status==="failed"){o.push({type:"status",key:`${p}:failed`,path:p,depth:u+1,state:"failed",message:N.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(N.nodes.length===0){o.push({type:"status",key:`${p}:empty`,path:p,depth:u+1,state:"empty"});continue}a(p,u+1),N.truncated&&o.push({type:"status",key:`${p}:truncated`,path:p,depth:u+1,state:"truncated",label:Rn({entries:N.nodes,truncated:!0,total:N.total}).label})}};return a("",0),o}var es=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function ns(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function ts(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&es.has(ns(n.path)))}function yo(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=ts(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function et(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Ht="dsh-fs-explorer:bridge",rs="fs-explorer-bridge",ho="dsh-resource://file/**",Gt="sidebar.right.pane.tab",os=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),is=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),as=new Set(["makefile","dockerfile","license","readme","changelog"]),ss=new Set([...Yr(),...os]);function ds(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function nt(e){if(typeof e!="string"||e==="")return!1;let n=We(e).toLowerCase();if(n==="")return!1;let t=ds(n);return is.has(t)?!1:as.has(n)?!0:ss.has(t)}function ls(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function us(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Ut(e,n){if(typeof e!="string")return;let t=hn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=us(n,ls(e));return`${Yn(r)?"abs:":"path:"}${r}:${String(o)}`}function Xt(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=hn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!nt(r.path))return{action:"keep",reason:"refused"};let o=Ut(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function $e(e,n){n===void 0?console.warn(`[${we}] ${e}`):console.warn(`[${we}] ${e}`,n)}function cs(e){console.debug(`[${we}] ${e}`)}function Vt(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function qt(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Ze(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function go(e){return Ze(()=>e.sidebarRightTabs,Vt)??Ze(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Vt)}function ko(e){return Ze(()=>e.sidebarRight,qt)??Ze(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,qt)}function xo(e){return typeof e=="function"?e:()=>{}}var fs="dsh-resource://file/session/probe/src/main.ts";function ps(e){let n=Ze(()=>(typeof e.candidates=="function"?e.candidates(fs):[]).filter(r=>r.priority==="extension"&&r.id!==Ht),t=>Array.isArray(t)&&t.length>0);n!==void 0&&$e(`another extension-band tab type already claims ${ho}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function ms(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ys(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function gs(e,n){let t=e.viewFocus;if(t?.request?.(fe,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(fe,n);return(!r.opened||r.focused)&&t?.take(fe),r}return typeof e.openView=="function"&&e.openView(fe,n)?(t?.take(fe),{opened:!0,focused:!0}):(t?.take(fe),{opened:!1,focused:!1})}function Yt(e,n,t,r){let o;try{o=gs(e,r)}catch(i){return $e("the file workbench threw while switching views",i),e.viewFocus?.take(fe),!1}if(!o.opened)return $e(`the file workbench did not switch to ${fe}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return $e("the forwarded tab could not be closed",i),!1}}function ks(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,d=ms(i),u=ys(i),s=(0,cn.useRef)(void 0);return(0,cn.useEffect)(()=>{if(a===void 0){$e("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let l=Xt(d,e.currentSessionId(),u);if(l.action!=="open"){$e(`left the forwarded tab standing (${l.reason})`,d);return}Yt(e,n,a,l.focus)},[a,d,u]),null}return function(o){return typeof o.useTabInfo!="function"?($e(`the host did not inject useTabInfo into ${Gt}; the bridge cannot forward`),null):(0,cn.createElement)(t,{useTabInfo:o.useTabInfo})}}function Zt(e,n){let t=(d,u)=>{if(d===void 0||u===void 0)return;ps(d);let s;try{s=d.register({id:Ht,kind:rs,patterns:[ho],priority:"extension",canOpen:y=>{let m=hn(y);return m!==null&&nt(m.path)},title:y=>We(hn(y)?.path??y)||y})}catch(y){$e("the sidebar right refused the address bridge tab type",y);return}let l=ks(n,u),p;try{p=xo(e.slots.inject(Gt,()=>e.slots.register({name:Gt,key:Ht},l)))}catch(y){s(),$e("the sidebar right refused the address bridge body",y);return}return()=>{p(),s()}},r=go(e),o=ko(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return cs("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],d=>{let u=Ze(()=>d.get?.("sidebarRightTabs"),Vt)??go(d),s=Ze(()=>d.get?.("sidebarRight"),qt)??ko(d);return t(u,s)});return xo(a)}var Jt={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Qt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function er(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Jt:Qt)["tab.label"]??"Files"}var xs=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function pe(e){return e!==null&&typeof e=="object"}function rt(e,n){return{ok:!1,code:e,message:n}}function ot(e){let n=pe(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return rt(t,r)}function nr(){return rt("invalid-response","the document service answered an invalid response")}function tt(e){try{return e()}catch{return}}function hs(e){let n=pe(e)?e:void 0;if(n===void 0)return nr();if(n.ok===!1)return ot(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=pe(t)?t:void 0;if(r===void 0)return nr();if(r.ok===!1)return ot(r.error);let o=pe(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?nr():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function bs(e){let n=pe(e)?e:void 0;if(n===void 0)return bo();if(n.ok===!1)return ot(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=pe(t)?t:void 0;if(r===void 0)return bo();if(r.ok===!1)return ot(r.error);let o=pe(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function bo(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function tr(e){return pe(e)&&typeof e.open=="function"}function vs(e){let n=tt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=pe(n)?n.rpc:void 0;if(!(!pe(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Zr}/${r}`,o,i)}function ws(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Rs(e){let n=pe(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=pe(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=pe(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function vo(e,n){let t=or(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return Rs(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function or(e){return()=>{let n=tt(()=>e.fsExplorerDocuments);if(tr(n))return n;let t=tt(()=>pe(e.remote)?e.remote.fsExplorerDocuments:void 0);if(tr(t))return t;let r=tt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(tr(r))return r;let o=vs(e);if(o!==void 0)return ws(o)}}function wo(e){let n=or(e);return async(t,r,o)=>{let i=n();if(i===void 0)return rt("unavailable","the document service is unavailable");try{return hs(await i.open({sessionId:t,path:r},o))}catch(a){return rt("io-error",a instanceof Error?a.message:String(a))}}}function Ro(e){let n=or(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return bs(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function So(e){let n=new Map,t=new Set,r=0,o=(d,u)=>`${d}\0${u}`,i=()=>{r+=1;for(let d of[...t])d()},a=(d,u)=>n.get(o(d,u))?.session;return{acquire(d,u){let s=o(d,u),l=n.get(s);return l===void 0&&(l={session:new rr(d,u,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,l),i()),l.session.retain(),l.session},peek(d,u){return a(d,u)?.getSnapshot()},find:a,forget(d,u){n.get(o(d,u))?.session.abandon()},subscribe(d){return t.add(d),()=>{t.delete(d)}},revision:()=>r}}var rr=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=xs;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var it=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ss(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Co(e,n,t=Ss()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===d}function Po(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Cs(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function ir(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function at(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Cs(n),e.onClose?.()}}var fn=require("react");function dt(e){let n=We(e);return n===""?e:n}function st(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Ps=Object.freeze({panels:Object.freeze([]),active:null});function To(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Ts=/^git:([0-9a-f]{4,64}):(.+)$/iu;function ar(){let e=[],n=null,t=Ps,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(l=>l.key===s),a=s=>e.findIndex(l=>l.revision===void 0&&l.key===s),d=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let l=Ts.exec(s);if(l!==null){let m=(l[1]??"").toLowerCase(),h=st(l[2]??"",!1);if(h===void 0)return;let x=To(h,m);return i(x)>=0?x:void 0}let p=st(s,!0);if(p===void 0)return;if(a(p)>=0)return p;let y=st(s,!1);if(!(y===void 0||y===p))return a(y)>=0?y:void 0},u=s=>{if(e.length===0)return;let l=n===null?-1:i(n),p=e[(l+s+e.length)%e.length];p===void 0||p.key===n||(n=p.key,o())};return{open(s,l=1,p=!1,y){let m=st(s,p);if(m===void 0)return;let h=typeof y=="string"&&y.trim()!==""?y.trim().toLowerCase():void 0,x=To(m,h),M=Number.isFinite(l)&&l>0?Math.trunc(l):1,H=i(x);if(H>=0){let A=e[H],E=A!==void 0&&(A.line!==M||A.absolute!==p);if(E&&(e=e.map((B,q)=>q===H?{...B,line:M,absolute:p}:B)),n===x){E&&o();return}n=x,o();return}let L=n===null?e.length:i(n)+1,N={key:x,path:m,line:M,absolute:p,...h===void 0?{}:{revision:h}};e=[...e.slice(0,L),N,...e.slice(L)],n=x,o()},close(s){let l=s===void 0?n:d(s)??null;if(l===null)return;let p=i(l);p<0||(e=e.filter(y=>y.key!==l),n===l&&(n=(e[p]??e[p-1])?.key??null),o())},activate(s){let l=d(s);l===void 0||i(l)<0||n===l||(n=l,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let l=d(s);return l!==void 0&&i(l)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function Eo(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=ar();return e.set(t,o),o}}}function Sn(e,n){let t=Jn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var $=require("react/jsx-runtime"),sr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Es=()=>()=>{},Ms=()=>"";function Ns(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Mo({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:d}){let u=(0,fn.useRef)(null);(0,fn.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,fn.useSyncExternalStore)(a?.subscribe??Es,()=>Ns(a,d,e).join("\0"),Ms),l=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let p=y=>{if(y.key==="ArrowRight"||y.key==="ArrowLeft"){y.preventDefault(),y.stopPropagation(),i(y.key==="ArrowRight"?1:-1);return}(y.key==="Delete"||y.key==="Backspace")&&n!==null&&(y.preventDefault(),y.stopPropagation(),o(n))};return(0,$.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:p,"data-testid":"fs-tabs",children:e.map((y,m)=>{let h=y.key===n,x=dt(y.path),M=t("panel.close").replace("{name}",x);return(0,$.jsxs)("div",{className:"fx-tab","data-active":h?"true":"false","data-dirty":l.has(y.path)?"true":"false",role:"presentation",children:[(0,$.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${m}`,"aria-controls":`fx-panel-${m}`,"aria-selected":h,tabIndex:h?0:-1,title:y.path,"data-testid":"fs-tab","data-path":y.path,"data-key":y.key,ref:h?u:void 0,onClick:()=>r(y.key),children:[(0,$.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":ln(y.path),"aria-hidden":"true",children:un(y.path)}),(0,$.jsx)("span",{className:"fx-tab-name",children:x}),y.revision===void 0?null:(0,$.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:y.revision,children:y.revision.slice(0,7)}),l.has(y.path)?(0,$.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,$.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:h?0:-1,"aria-label":M,title:M,"data-testid":"fs-tab-close",onClick:()=>o(y.key),children:"\xD7"})]},y.key)})})}function No({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,$.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,$.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,$.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,$.jsx)("span",{className:"fx-spacer"}),(0,$.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,$.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,$.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Fs(){return(0,$.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,$.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,$.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,$.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Fo({t:e}){return(0,$.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,$.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,$.jsx)(Fs,{})}),(0,$.jsx)("strong",{children:e("panel.empty.title")}),(0,$.jsx)("span",{children:e("panel.empty.description")}),(0,$.jsxs)("span",{className:"fx-empty-keys",children:[(0,$.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,$.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,$.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,$.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Bo=require("react");function de(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Bo.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Bs(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Ls=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Je(e){let n=[],t=0;for(let r of e.matchAll(Ls)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(de("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(de("strong",null,...Je(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(de("del",null,...Je(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(de("em",null,...Je(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=a?.[1]??i,u=a===null?void 0:Bs(a[2]??"");n.push(u===void 0?d:de("a",{href:u,rel:"noreferrer noopener"},d))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Lo=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Io=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Ao=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,dr=/^\s{0,3}>\s?(.*)$/u,lr=/^\s{0,3}[-*+]\s+(.*)$/u,ur=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Is(e){return Lo.test(e)||Io.test(e)||Ao.test(e)||dr.test(e)||lr.test(e)||ur.test(e)}function Do(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Lo.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),l=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(de("pre",null,de("code",l===""?null:{className:`language-${l}`},p.join(`
`))));continue}let i=Io.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(de(`h${String(s)}`,null,...Je(i[2]??""))),t+=1;continue}if(Ao.test(r)){n.push(de("hr",null)),t+=1;continue}if(dr.test(r)){let s=[];for(;t<e.length;){let l=dr.exec(e[t]??"");if(l===null)break;s.push(l[1]??""),t+=1}n.push(de("blockquote",null,...Do(s)));continue}if(lr.exec(r)!==null){let s=[];for(;t<e.length;){let l=lr.exec(e[t]??"");if(l===null)break;s.push(de("li",null,...Je(l[1]??""))),t+=1}n.push(de("ul",null,...s));continue}if(ur.exec(r)!==null){let s=[];for(;t<e.length;){let l=ur.exec(e[t]??"");if(l===null)break;s.push(de("li",null,...Je(l[1]??""))),t+=1}n.push(de("ol",null,...s));continue}let u=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Is(s))break;u.push(s.trim()),t+=1}n.push(de("p",null,...Je(u.join(" "))))}return n}function lt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return de("div",{className:"fx-md"},...Do(n))}var cr=200,As={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Tn(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":As[t.slice(r+1)]??"plaintext"}function En(e){return Tn(e)==="markdown"}var ue=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Cn(e){return e!==null&&typeof e=="object"}function Ds(e){return e===""?0:e.split(`
`).length}function pn(e,n){if(!Cn(e))throw new ue("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let l=Cn(e.error)?e.error:{},p=typeof l.code=="string"?l.code:"preview/unknown",y=typeof l.message=="string"?l.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",m=Cn(l.details)?l.details:{},h=typeof m.kind=="string"?m.kind:"";throw new ue(p,y,h)}let t=e.ok===!0?e.value:e;if(!Cn(t)||typeof t.text!="string")throw new ue("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ds(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,d=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...d===void 0?{}:{source:d},...u===void 0?{}:{linkTarget:u}};return o===void 0?s:{...s,totalLines:o}}function Qe(e){let n=Cn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Pn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function ut({files:e,maxLines:n=cr}){let t=Math.max(1,Math.trunc(n)),r=Pn,o=0,i=null,a=[1],d=new Set,u=l=>{r=l;for(let p of d)p()},s=async(l,p)=>{o+=1;let y=o;i?.abort();let m=new AbortController;i=m,u({status:"loading",path:l,text:r.path===l?r.text:"",offset:p,lines:r.path===l?r.lines:0,...r.path===l&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===l&&r.source!==void 0?{source:r.source}:{},eof:r.path===l?r.eof:!1});try{let h=await e.read(l,p>1?{offset:p,limit:t}:{limit:t},m.signal);if(y!==o)return;let x=pn(h,p);if(x.lines===0&&p>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let M={status:"ready",path:l,text:x.text,offset:x.offset,lines:x.lines,eof:x.eof,...x.source===void 0?{}:{source:x.source},...x.linkTarget===void 0?{}:{linkTarget:x.linkTarget,linkPath:l}};u(x.totalLines===void 0?M:{...M,totalLines:x.totalLines})}catch(h){if(y!==o||m.signal.aborted)return;u({status:"failed",path:l,text:"",offset:p,lines:0,eof:!1,failure:Qe(h)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(l){return d.add(l),()=>{d.delete(l)}},async open(l){a=[1],await s(l,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let l=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&l>r.totalLines||(a.push(l),await s(r.path,l))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let l=a[a.length-1]??1;await s(r.path,l)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(Pn)}}}function ct(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var fr=Object.freeze({chunk:$t.chunk,id:`${we}/${$t.chunk}`}),pr=null,Mn=null,ft=new Map;function Oo(e){pr=e}function Wo(){return fr}function Os(e){let n=jn[e];return{chunk:n,id:`${we}/${n}`}}function mr(){if(Mn!==null)return Mn;let e=pr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${we}: the loader require was not handed over`));let n=e.async(`./${fr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${we}: chunk ${fr.id} is missing its preview renderers`);return r});return Mn=n,n.catch(()=>{Mn===n&&(Mn=null)}),n}function $o(e){let n=ft.get(e);if(n!==void 0)return n;let t=pr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${we}: the loader require was not handed over`));let r=Os(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${we}: chunk ${r.id} is not the ${e} view`);return a});return ft.set(e,o),o.catch(()=>{ft.get(e)===o&&ft.delete(e)}),o}var zo=Object.freeze({}),Ws="@deepseek-ai/dsh-client-ui-primitives",gr=null,yr;function _o(e){gr=e}function $s(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function pt(){if(yr!=null)return yr;if(gr===null)return zo;let e=$s(gr,Ws);if(e===void 0)return zo;let n=l=>{let p=e[l];if(typeof p=="function"||typeof p=="object"&&p!==null)return p},t=l=>{let p=e[l];return typeof p=="function"?p:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let d=n("Input");d!==void 0&&(r.Input=d);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var I=require("react");async function en(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var ze=require("react/jsx-runtime");function zs(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function _s(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function kr({failure:e,t:n,onRetry:t}){return(0,ze.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,ze.jsx)("strong",{children:zs(e,n)}),(0,ze.jsx)("span",{children:_s(e,n)}),e.message===""?null:(0,ze.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,ze.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function xr({t:e}){return(0,ze.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,ze.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var hr="fsExplorer",jo=1;function js(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Ks(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Hs(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Gs(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function mt(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Ks),families:[...i.match?.families??[]]}),o();let d=!0;return()=>{d&&(d=!1,t.delete(a),o())}},resolve(i){let a=js(i.path),d=bn(i.path),u;for(let s of t.values())Hs(s,a,d)&&(u===void 0||Gs(s.contribution,u.contribution))&&(u=s);return u?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Ko(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function yt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function _e(e){try{return e()}catch{return}}function Ee(e){return e!==null&&typeof e=="object"}function Uo(e){return()=>{let n=_e(()=>e.workspaceFiles);if(yt(n))return n;let t=_e(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(yt(t))return t;let r=_e(()=>e.remote?.workspaceFiles);if(yt(r))return r;let o=_e(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(yt(o))return o}}function Xo(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Yo(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return pn(i,r.offset??1),i}catch(s){if(!(s instanceof ue)||Qe(s).kind!=="symlink")throw s;a=s}let d=await n(t,o);if(d===void 0)throw a;return{...pn(await e.read(d.absolutePath,r,o),r.offset??1),linkTarget:d.absolutePath}}}}function Ho(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Vs(e){let n=_e(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ee(n)?n.rpc:void 0;if(!Ee(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Zo(e){return()=>{let n=_e(()=>e.remote?.gitExplorer);if(Ho(n))return n;let t=_e(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Ho(t)?t:Vs(e)}}function qs(e){return e===""?0:e.split(`
`).length}function Go(e){let n=Ee(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new ue(t,r)}function Jo(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},d=await e.show(a,i);if(!Ee(d))throw new ue("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(d.ok===!1)throw Go(d.error);let u=d;if(d.ok===!0&&(u=d.value),!Ee(u))throw new ue("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw Go(u.error);let s=u;if(u.ok===!0&&(s=u.page),!Ee(s))throw new ue("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new ue("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new ue("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new ue("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let l=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):qs(s.text),p=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,y=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:l,offset:p,eof:s.eof===!0,...y===void 0?{}:{source:y}}}}}function Us(e){if(!Ee(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Ee(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Xs(e){let n=Ee(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Ee(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new ue(t,r,i)}function wr(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Us(await n.call(e,t,r,{},o));if(!i.ok)throw Xs(i.error);return i.value.data}}function Nn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function br(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function gt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Nn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?br(r.value):{ok:!1,message:Nn(r.error)}}return br(t)}return br(n)}function Qo(e){return e instanceof Error?e.message:Nn(e)}function Vo(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function ei(e){return()=>{let n=_e(()=>e.remote?.gitExplorer);if(Vo(n))return n;let t=_e(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Vo(t))return t}}function qo(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Ys(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=qo(r.additions),i=qo(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Zs(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Js(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function vr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Ys(n.stats),r=Zs(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=Js(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function kt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Nn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?vr(o.snapshot):{ok:!1,message:Nn(o.error)}}let r=e;return r.snapshot!==void 0?vr(r.snapshot):vr(t)}var C=require("react/jsx-runtime"),Pr={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Qs=()=>()=>{},ni=()=>{};function Tr(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Rr={status:"idle"},ed=[".md",".mdx",".markdown",".mdown"],nd=-1e3;function Cr({t:e,revision:n}){return(0,C.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,C.jsx)("strong",{children:e("preview.unavailable.title")}),(0,C.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function ti({chunk:e,text:n,path:t,offset:r}){let o=(0,I.useRef)(null),i=(0,I.useRef)(null),[a,d]=(0,I.useState)(!1),u=Tn(t);return(0,I.useEffect)(()=>{d(!1)},[e,t]),(0,I.useEffect)(()=>{let s=o.current;if(!(e===null||s===null))try{let l=e.mountCodePreview(s,{text:n,language:u,path:t,offset:r});return i.current=l,()=>{l.destroy(),i.current=null}}catch{d(!0);return}},[e,t,u]),(0,I.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,C.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,C.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function td({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&En(n)?(0,C.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:lt(r)}):(0,C.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function rd(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,C.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,C.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,C.jsx)(ti,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function od(e){function n({page:t,path:r}){return(0,C.jsx)(ti,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function id({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let d=(0,I.useMemo)(()=>{let u=wr(r);return u===void 0||t===void 0||a===void 0?u:async(s,l,p)=>{if(s!==t||l!==n)return u(s,l,p);let y=await a(l,p);return u(s,y?.absolutePath??l,p)}},[r,t,n,a]);return t===void 0||d===void 0?(0,C.jsx)(Cr,{t:o}):(0,C.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:d,t:o,visible:i})}function ad(e){return{Body:n=>(0,C.jsx)(id,{chunk:e,...n}),renderer:e.renderer}}function Er(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...ed]},priority:0,load:()=>mr().then(rd)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:nd,load:()=>mr().then(od)},...Object.keys(jn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>$o(e).then(ad)}))]}var Sr;function sd(){if(Sr!==void 0)return Sr;let e=mt();for(let n of Er())e.register(n);return Sr=e,e}function ri({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:d,documents:u,locate:s}){let l=(0,I.useMemo)(()=>{let z=r===void 0?Xo(n,e):o===void 0||e===void 0?void 0:Jo(o,e,r);return z===void 0||r!==void 0||s===void 0?z:Yo(z,s)},[n,e,r,o,s]),p=(0,I.useMemo)(()=>r===void 0?wr(n):void 0,[n,r]),y=d??sd(),m=t===void 0?null:bn(t),h=m!==null,x=r===void 0&&e!==void 0&&p!==void 0?{sessionId:e,readFile:p}:null,[M,H]=(0,I.useState)(null),[L,N]=(0,I.useState)(Pn),[A,E]=(0,I.useState)(Rr),[B,q]=(0,I.useState)(0),[K,be]=(0,I.useState)(0),[me,R]=(0,I.useState)("reading"),[S,f]=(0,I.useState)(!1),[v,b]=(0,I.useState)(!1),[W,G]=(0,I.useState)(void 0),[ae,se]=(0,I.useState)(!1),Z=(0,I.useRef)(void 0),Q=(0,I.useRef)(void 0),U=(0,I.useSyncExternalStore)(u?.subscribe??Qs,()=>u===void 0||e===void 0||t===void 0?ni():u.peek(e,t),ni),j=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,I.useEffect)(()=>{if(l===void 0){H(null);return}let z=ut({files:l,maxLines:cr});return H(z),()=>z.close()},[l]),(0,I.useEffect)(()=>{if(M===null){N(Pn);return}return N(M.getSnapshot()),M.subscribe(()=>N(M.getSnapshot()))},[M]),(0,I.useEffect)(()=>{M===null||t===void 0||m!==null||M.open(t)},[M,t,m]),(0,I.useEffect)(()=>{if(!h||t===void 0||s===void 0){G(void 0);return}let z=new AbortController,J=!0;return(async()=>{let De=await s(t,z.signal);J&&!z.signal.aborted&&G(De?.absolutePath)})(),()=>{J=!1,z.abort()}},[h,t,s]),(0,I.useEffect)(()=>{R("reading"),f(!1),se(!1)},[t]),(0,I.useEffect)(()=>()=>{Z.current!==void 0&&clearTimeout(Z.current),Q.current!==void 0&&clearTimeout(Q.current)},[]),(0,I.useEffect)(()=>{U?.conflict!==!0&&(b(!1),se(!1),Q.current!==void 0&&clearTimeout(Q.current))},[U?.conflict]),(0,I.useEffect)(()=>y.subscribe(()=>q(z=>z+1)),[y]),(0,I.useEffect)(()=>{if(t===void 0||r!==void 0){E(Rr);return}let z=Ko(y,{path:t});if(z===void 0){E(Rr);return}let{contribution:J}=z,De=!0;return E(oe=>oe.status==="ready"&&oe.contribution.id===J.id?oe:{status:"loading",contribution:J}),z.module.then(oe=>{De&&E({status:"ready",contribution:J,module:oe})},oe=>{De&&E({status:"failed",contribution:J,failure:Qe(oe)})}),()=>{De=!1}},[y,t,r,B,K]),t===void 0)return(0,C.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,C.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,C.jsx)("strong",{children:i("preview.empty.title")}),(0,C.jsx)("span",{children:i("preview.empty.description")})]})});let X=h&&r!==void 0,Se=ct(L),ce=L.linkPath??t,ye=h?W:L.linkTarget,He=!h&&En(t),Be=h?!X&&x!==null&&A.status!=="ready"&&A.status!=="failed":L.status==="loading",tn=L.status==="ready",Le=He&&me==="reading",Dn=h?X||x===null?"unavailable":A.status==="failed"?"failed":A.status==="ready"?"ready":"loading":L.status,On=A.status==="ready"?A.module.renderer??A.contribution.id:h?"pending":Le?"fallback":"plain",Ve={path:ye??t,sessionId:e,files:n,t:i,visible:a,mode:me,...h?{}:{page:{text:L.text,offset:L.offset}},...s===void 0?{}:{locate:s}},qe=()=>{en(ye??ce).then(z=>{z&&(f(!0),Z.current!==void 0&&clearTimeout(Z.current),Z.current=setTimeout(()=>f(!1),1400))})},Ie=()=>{let z=j?.copyDraft();z!==void 0&&en(z).then(J=>{J&&(b(!0),Q.current!==void 0&&clearTimeout(Q.current),Q.current=setTimeout(()=>b(!1),1400))})},O=U?.error,Ae=O!=null&&U?.conflict!==!0,Ce=U?.conflict===!0,Pe=U?.discarded??null,rn=!Ce&&Pe!==null&&U?.dirty!==!0&&Pe!==U?.text,Te;if(h){let z=A.status==="ready"?A.module.Body:void 0;Te=X?(0,C.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,C.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,C.jsx)("span",{children:i("preview.commitBinary.description")})]}):x===null?(0,C.jsx)(Cr,{t:i,revision:r}):A.status==="failed"?(0,C.jsx)(kr,{failure:A.failure,t:i,onRetry:()=>be(J=>J+1)}):z===void 0?(0,C.jsx)(xr,{t:i}):(0,C.jsx)(z,{...Ve})}else if(l===void 0)Te=(0,C.jsx)(Cr,{t:i,revision:r});else if(L.status==="failed")Te=(0,C.jsx)(kr,{failure:L.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{M?.retry()}});else if(!tn)Te=(0,C.jsx)(xr,{t:i});else{let z=A.status==="ready"?A.module.Body:td;Te=(0,C.jsx)(z,{...Ve})}return(0,C.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Dn,"data-mode":h?"binary":Le?"reading":"code","data-renderer":On,children:[(0,C.jsxs)("header",{className:"fx-preview-bar",children:[(0,C.jsxs)("span",{className:"fx-preview-path",title:ye===void 0?ce:`${ce} \u2192 ${ye}`,"data-testid":"fs-preview-path",...ye===void 0?{}:{"data-link":"followed"},children:[ce,ye===void 0?null:(0,C.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",ye]})]}),h?null:(0,C.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Se.range,Se.range==="\u2014"?null:(0,C.jsxs)(C.Fragment,{children:[" ",i("preview.lines")]}),Se.total===void 0?null:(0,C.jsxs)("span",{className:"fx-preview-total",children:[" / ",Se.total," ",i("preview.lines")]})]}),(0,C.jsxs)("div",{className:"fx-preview-actions",children:[U===void 0?null:(0,C.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!U.dirty||U.saving||U.status!=="ready",onClick:()=>{j?.save()},children:U.saving?i("preview.saving"):i("preview.save")}),He?(0,C.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>R(z=>z==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(me==="reading"?"preview.source":"preview.reading")}):null,h?null:(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!tn||Be||L.offset<=1,onClick:()=>{M?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,C.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!tn||Be||L.eof,onClick:()=>{M?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,C.jsx)("button",{type:"button",className:"fx-pbtn",onClick:qe,"data-testid":"fs-preview-copy",children:i(S?"preview.copied":"preview.copyPath")}),Be?(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),L.source==="first-parent"?(0,C.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,Ce||rn?(0,C.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":Ce?"conflict":"discarded",children:[(0,C.jsx)("strong",{children:i(Ce?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,C.jsx)("span",{className:"fx-conflict-hint",children:i(Ce?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,C.jsx)("span",{className:"fx-spacer"}),Ce?(0,C.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":ae?"discard":void 0,onClick:()=>{if(!ae&&U?.dirty===!0){se(!0);return}se(!1),j?.reload({force:!0})},children:i(ae?"preview.conflict.discard":"preview.conflict.reload")}):null,rn?(0,C.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Pe!==null&&j?.setDraft(Pe)},children:i("preview.conflict.restore")}):null,Ce?(0,C.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Ie,children:i(v?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Ae?(0,C.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Tr(O?.code??"io-error",O?.message??"",i))}):null,(0,C.jsx)("div",{className:"fx-preview-body","data-scroll":Le?"y":"none",children:Te})]})}var oi="dsh-fs-explorer-styles",dd=`
.fx-root {
  /* The name card, the bookmark picker and the management menu are positioned
     against this panel. Without a containing block here they resolve against
     whatever positioned ancestor the host happens to provide, which is not
     something this package can rely on. */
  position: relative;
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
`;function ii(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${oi}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=oi,t.textContent=dd,e.head.appendChild(t),()=>{t.remove()}}var k=require("react");var ie={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"};function ai(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function ld(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function si(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,d=r.workspace&&a!==void 0,u=[{id:ie.createFile,label:n("menu.create.file"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:ie.createFolder,label:n("menu.create.folder"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,l={id:ie.reveal,label:n(ld(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},p={id:ie.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},y={id:ie.copyRelative,label:n("menu.copy.relative")},m=e.remoteLinks,h=m!==void 0&&m.length>0?{id:ie.copyRemote,label:n("menu.copy.remote"),submenu:m.map(x=>({id:x.id,label:x.label}))}:{id:ie.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,l,{id:"menu.copy",label:n("menu.copy"),submenu:[p,y]},h,{id:ie.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}var Me=require("react");var ke=require("react/jsx-runtime");function ud(e){return new DOMRect(e.x,e.y,0,0)}function di(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,ke.jsxs)(ke.Fragment,{children:[e.label,(0,ke.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function li({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=pt();if(i.Menu!==void 0){let a=i.Menu;return(0,ke.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(d=>({id:d.id,label:di(d),...d.disabled===!0?{disabled:!0}:{},...d.submenu===void 0?{}:{submenu:d.submenu.map(u=>({id:u.id,label:di(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>ud(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,ke.jsx)(cd,{entries:e,anchor:n,onSelect:t,onClose:r})}function cd({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,Me.useRef)(null),[i,a]=(0,Me.useState)(null),[d,u]=(0,Me.useState)({left:n.x,top:n.y});(0,Me.useEffect)(()=>{let l=o.current;if(l===null)return;let p=8,y=l.offsetWidth,m=l.offsetHeight,h=Math.min(Math.max(n.x,p),Math.max(p,window.innerWidth-y-p)),x=Math.min(Math.max(n.y,p),Math.max(p,window.innerHeight-m-p));u({left:h,top:x})},[n.x,n.y]),(0,Me.useEffect)(()=>{let l=y=>{y.target instanceof Node&&o.current?.contains(y.target)!==!0&&r()},p=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("pointerdown",l),document.addEventListener("keydown",p,!0),()=>{document.removeEventListener("pointerdown",l),document.removeEventListener("keydown",p,!0)}},[r]);let s=(0,Me.useCallback)(l=>{if(l.disabled!==!0){if(l.submenu!==void 0){a(p=>p===l.id?null:l.id);return}t(l.id)}},[t]);return(0,ke.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:d,onContextMenu:l=>l.preventDefault(),children:e.map(l=>(0,ke.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,ke.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":l.id,disabled:l.disabled===!0&&l.reason===void 0,"aria-disabled":l.disabled===!0?!0:void 0,"aria-haspopup":l.submenu===void 0?void 0:"menu","aria-expanded":l.submenu===void 0?void 0:i===l.id,title:l.disabled===!0?l.reason:void 0,onClick:()=>s(l),children:l.label}),l.submenu===void 0||i!==l.id?null:(0,ke.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:l.submenu.map(p=>(0,ke.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":p.id,disabled:p.disabled===!0&&p.reason===void 0,"aria-disabled":p.disabled===!0?!0:void 0,title:p.disabled===!0?p.reason:void 0,onClick:()=>s(p),children:p.label},p.id))})]},l.id))})}var le=require("react"),D=require("react/jsx-runtime"),fd=120,Mr=280,xt=8;function ht(e){let n=typeof window>"u"?e:window.innerWidth-Mr;return Math.max(xt,Math.min(e,Math.max(xt,n)))}function pd(e,n){if(e===void 0)return{left:xt,top:xt};if(n<=1)return{left:ht(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+Mr<=window.innerWidth;return{left:ht(r?t:e.left-Mr-4),top:e.top}}function ui(){return(0,D.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,D.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ci({node:e,t:n,onOpen:t}){return(0,D.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,D.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function fi({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:d,onReorder:u}){let[s,l]=(0,le.useState)([]),p=(0,le.useRef)(null),[y,m]=(0,le.useState)(null),[h,x]=(0,le.useState)(null),M=(0,le.useCallback)(()=>{p.current!==null&&(clearTimeout(p.current),p.current=null)},[]),H=(0,le.useCallback)(()=>{M(),l([])},[M]),L=(0,le.useCallback)(()=>{M(),p.current=setTimeout(()=>{p.current=null,l([])},fd)},[M]);(0,le.useEffect)(()=>()=>{p.current!==null&&clearTimeout(p.current)},[]),(0,le.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let R=S=>{S.key!=="Escape"||S.isComposing||(S.preventDefault(),S.stopPropagation(),H())};return document.addEventListener("keydown",R,!0),()=>document.removeEventListener("keydown",R,!0)},[H,s.length]);let N=(0,le.useCallback)((R,S,f)=>{M();let{left:v,top:b}=pd(f?.getBoundingClientRect(),S);l(W=>{let G=W.slice(0,S);return G.length===S&&G[S-1]?.groupId===R?W:[...G,{groupId:R,left:v,top:b,depth:S}]})},[M]),A=(0,le.useCallback)(R=>{H(),R.kind==="file"?t(R.path):R.kind==="folder"&&r(R.path)},[H,t,r]),E=R=>{let S,f=v=>{for(let b of v)b.kind==="group"&&(b.id===R&&(S=b),f(b.children))};return f(e.roots),S},B=R=>{let S=(f,v)=>{if(f.some(b=>b.id===R))return{parentId:v,siblings:f};for(let b of f){if(b.kind!=="group")continue;let W=S(b.children,b.id);if(W!==void 0)return W}};return S(e.roots,null)??{parentId:null,siblings:[]}},q=(R,S)=>{let f=S?.getBoundingClientRect(),{parentId:v,siblings:b}=B(R.id);m({node:R,parentId:v,siblings:b,left:ht(f?.left??0),top:(f?.bottom??0)+4})},K=(R,S)=>{let{parentId:f,siblings:v}=B(R.id);m({node:R,parentId:f,siblings:v,left:ht(S.clientX),top:S.clientY})},be=(R,S)=>{let{parentId:f,siblings:v}=B(R.id),b=v.map(Z=>Z.id),W=b.indexOf(R.id),G=W+S;if(W<0||G<0||G>=b.length)return;let ae=[...b],[se]=ae.splice(W,1);se!==void 0&&(ae.splice(G,0,se),m(null),u?.(f,ae))},me=R=>{let S=h;if(x(null),S===null||S===R)return;let f=e.roots.map(ae=>ae.id),v=f.indexOf(S),b=f.indexOf(R);if(v<0||b<0)return;let W=[...f],[G]=W.splice(v,1);G!==void 0&&(W.splice(b,0,G),u?.(null,W))};return(0,le.useEffect)(()=>{if(y===null||typeof document>"u")return;let R=f=>{f.target instanceof Node&&(f.target instanceof Element&&f.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||m(null))},S=f=>{f.key!=="Escape"||f.isComposing||(f.preventDefault(),f.stopPropagation(),m(null))};return document.addEventListener("pointerdown",R),document.addEventListener("keydown",S,!0),()=>{document.removeEventListener("pointerdown",R),document.removeEventListener("keydown",S,!0)}},[y]),(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,D.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(R=>(0,D.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":h===R.id?"true":void 0,draggable:!0,onDragStart:()=>x(R.id),onDragEnd:()=>x(null),onDragOver:S=>S.preventDefault(),onDrop:S=>{S.preventDefault(),me(R.id)},children:[R.kind==="group"?(0,D.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(S=>S.groupId===R.id),title:n("bookmarks.group"),onPointerEnter:S=>N(R.id,1,S.currentTarget),onFocus:S=>N(R.id,1,S.currentTarget),onPointerLeave:L,onContextMenu:S=>{S.preventDefault(),S.stopPropagation(),K(R,S)},children:[(0,D.jsx)("span",{className:"fx-bookmark-name",children:R.name}),(0,D.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,D.jsx)(ui,{})})]}):(0,D.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":R.kind,title:R.path,onClick:()=>A(R),onContextMenu:S=>{S.preventDefault(),S.stopPropagation(),K(R,S)},children:(0,D.jsx)("span",{className:"fx-bookmark-name",children:R.name})}),(0,D.jsx)(ci,{node:R,t:n,onOpen:q})]},R.id))}),y===null?null:(0,D.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:y.left,top:y.top},children:[(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{m(null),i?.(y.node)},children:n("bookmarks.rename")}),(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{m(null),a?.(y.node)},children:n("bookmarks.remove")}),(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:y.siblings[0]?.id===y.node.id,onClick:()=>be(y.node,-1),children:n("bookmarks.moveUp")}),(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:y.siblings[y.siblings.length-1]?.id===y.node.id,onClick:()=>be(y.node,1),children:n("bookmarks.moveDown")}),(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{m(null),d?.(y.node)},children:n("bookmarks.moveToGroup")})]}),s.map(R=>{let S=E(R.groupId);return S===void 0?null:(0,D.jsxs)("div",{className:R.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":R.depth,role:"menu","aria-label":S.name,style:{left:R.left,top:R.top},onPointerEnter:M,onPointerLeave:L,children:[S.children.length===0?null:S.children.map(f=>(0,D.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[f.kind==="group"?(0,D.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(v=>v.groupId===f.id),onPointerEnter:v=>N(f.id,R.depth+1,v.currentTarget),onFocus:v=>N(f.id,R.depth+1,v.currentTarget),onContextMenu:v=>{v.preventDefault(),v.stopPropagation(),K(f,v)},children:[(0,D.jsx)("span",{className:"fx-bookmark-name",children:f.name}),(0,D.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,D.jsx)(ui,{})})]}):(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":f.kind,role:"menuitem",title:f.path,onClick:()=>A(f),onContextMenu:v=>{v.preventDefault(),v.stopPropagation(),K(f,v)},children:(0,D.jsx)("span",{className:"fx-bookmark-name",children:f.name})}),(0,D.jsx)(ci,{node:f,t:n,onOpen:q})]},f.id)),(0,D.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(H(),o(S.id))},children:n("bookmarks.newGroup")})]},S.id)})]})}var Re=require("react");var md="dsh_fs_explorer",yd="bookmarks";function xe(e){throw new Error(`bookmarks: ${e}`)}function pi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function bt(e,n,t){typeof e!="string"&&xe(`${n} must be a string`);let r=e.trim();return r===""&&xe(`${n} must not be empty`),r.length>t&&xe(`${n} must be at most ${String(t)} characters`),r}function mi(e,n,t,r){t>32&&xe(`${n} is nested deeper than ${String(32)} levels`),pi(e)||xe(`${n} must be an object`);let o=bt(e.id,`${n}.id`,200);r.has(o)&&xe(`duplicate id "${o}" at ${n}`),r.add(o);let i=bt(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&xe(`${n}.createdAt must be a finite number`);let d=e.kind;if(d==="group"){let u=e.children;return Array.isArray(u)||xe(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((s,l)=>mi(s,`${n}.children[${String(l)}]`,t+1,r))}}if(d==="file"||d==="folder"){let u=bt(e.path,`${n}.path`,4096);return{id:o,kind:d,name:i,createdAt:a,path:u}}return xe(`${n}.kind must be "group", "file" or "folder"`)}function mn(e){pi(e)||xe("a bookmark tree must be an object"),e.version!==1&&xe(`version must be 1, received ${JSON.stringify(e.version)}`);let n=bt(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||xe("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>mi(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var iu={name:md,version:1,invalidRecords:"backup-and-skip",tables:{[yd]:{valueSchema:{parse:mn}}}};function re(e){throw new Error(`bookmarks: ${e}`)}function nn(e){return{version:1,roots:[],updatedAt:e}}function Fn(e,n){let t=n.name.trim();if(t===""&&re("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&re(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function gd(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function gi(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,gi(r,n+1)),n)}function ki(e,n){let t=gd(e,n.id);t!==0&&gi(n,t)>32&&re(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function Nr(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&Nr(r.children,n,r.id)}function je(e,n){let t;return Nr(e.roots,r=>{r.id===n&&(t=r)}),t}function xi(e,n){let t;return Nr(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function hi(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&hi(t,n))}function Fr(e,n){if(n===null)return e.roots;let t=je(e,n);return t===void 0&&re(`no group with id "${n}"`),t.kind!=="group"&&re(`"${n}" is not a group`),t.children}function bi(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function yn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:yn(r.children,n,t)})}function Bn(e,n,t){return{version:1,roots:n,updatedAt:t}}var Ln=()=>new Date().toISOString();function In(e,n,t,r,o=Ln){let i=Fr(e,n);je(e,t.id)!==void 0&&re(`a node with id "${t.id}" already exists`);let a=bi(r,i.length),d=yn(e.roots,n,s=>[...s.slice(0,a),t,...s.slice(a)]),u=Bn(e,d,o());return ki(u,t),u}function vi(e,n,t=Ln){let r=je(e,n);r===void 0&&re(`no node with id "${n}"`);let o=xi(e,n);o===void 0&&re(`no node with id "${n}"`);let i=yn(e.roots,o,a=>a.filter(d=>d.id!==n));return{tree:Bn(e,i,t()),removed:r}}function wi(e,n,t,r=Ln){let o=t.trim();o===""&&re("a node needs a non-empty name"),je(e,n)===void 0&&re(`no node with id "${n}"`);let i=a=>a.map(d=>{let u=d.id===n?{...d,name:o}:d;return u.kind==="group"?{...u,children:i(u.children)}:u});return Bn(e,i(e.roots),r())}function Ri(e,n,t,r,o=Ln){let i=je(e,n);i===void 0&&re(`no node with id "${n}"`);let a=xi(e,n);if(a===void 0&&re(`no node with id "${n}"`),t!==null){let y=je(e,t);y===void 0&&re(`no group with id "${t}"`),y.kind!=="group"&&re(`"${t}" is not a group`),i.kind==="group"&&hi(i,t)&&re(`cannot move "${n}" into itself or its own descendant`)}let d=yn(e.roots,a,y=>y.filter(m=>m.id!==n)),u=Fr({version:1,roots:d,updatedAt:e.updatedAt},t),s=bi(r,u.length),l=yn(d,t,y=>[...y.slice(0,s),i,...y.slice(s)]),p=Bn(e,l,o());return ki(p,i),p}function Si(e,n,t,r=Ln){let o=Fr(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&re(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||re(`"${s}" is not a child of ${n??"the root"}`);let d=new Map(o.map(s=>[s.id,s])),u=yn(e.roots,n,()=>t.map(s=>{let l=d.get(s);return l===void 0&&re(`"${s}" is not a child of ${n??"the root"}`),l}));return Bn(e,u,r())}var Ne=require("react");var he=require("react/jsx-runtime"),kd=200;function xd(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>kd?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function hd(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function An({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:d,titleKey:u,submitKey:s}){let[l,p]=(0,Ne.useState)(()=>d??hd(e)),[y,m]=(0,Ne.useState)(void 0),h=(0,Ne.useRef)(null),x=pt();(0,Ne.useEffect)(()=>{d!==void 0&&(p(d),m(void 0))},[d]),(0,Ne.useEffect)(()=>{let E=h.current;E!==null&&(E.focus(),E.select())},[]);let M=(0,Ne.useCallback)(()=>{if(a)return;let E=xd(l,e);if(!E.ok){m(t(`prompt.error.${E.reason}`));return}m(void 0),r(E.name)},[a,e,r,t,l]),H=E=>{if(!E.nativeEvent.isComposing){if(E.key==="Escape"){E.preventDefault(),E.stopPropagation(),o();return}E.key==="Enter"&&(E.preventDefault(),M())}},L=y??i,N=x.Input,A=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,he.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(A),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:H,children:[(0,he.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,he.jsx)("strong",{children:t(A)}),(0,he.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),N===void 0?(0,he.jsx)("input",{ref:h,className:"fx-name-input",type:"text",value:l,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":L===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:E=>{p(E.target.value),m(void 0)}}):(0,he.jsx)(N,{ref:h,className:"fx-name-input",value:l,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":L===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:E=>{p(E.target.value),m(void 0)}}),L===void 0?null:(0,he.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:L}),(0,he.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,he.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,he.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:M,children:t(s??"prompt.submit")})]})]})}var ee=require("react/jsx-runtime");function Ci(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function bd(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let d=[...i,a];if(a.id===n)return t.push(...d),!0;if(r(a.children,d))return!0}return!1};return r(e.roots,[]),t}function Pi({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[d,u]=(0,Re.useState)(null),[s,l]=(0,Re.useState)(e),[p,y]=(0,Re.useState)(!1),[m,h]=(0,Re.useState)(void 0),x=(0,Re.useRef)(null);(0,Re.useEffect)(()=>{let B=K=>{K.target instanceof Node&&x.current?.contains(K.target)!==!0&&a()},q=K=>{K.key!=="Escape"||K.isComposing||p||(K.preventDefault(),K.stopPropagation(),a())};return document.addEventListener("pointerdown",B),document.addEventListener("keydown",q,!0),()=>{document.removeEventListener("pointerdown",B),document.removeEventListener("keydown",q,!0)}},[p,a]);let M=()=>(d===null?s.roots:je(s,d)?.kind==="group"?je(s,d).children:[]).filter(q=>q.kind==="group"),H=(0,Re.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(Ri(s,o.id,d));return}if(n===void 0)return;let B=Fn(n.kind==="directory"?"folder":"file",{id:Ci(),name:n.name,path:n.path,createdAt:Date.now()});i(In(s,d,B))}catch(B){h(B instanceof Error?B.message:String(B))}},[d,s,r,o,i,n]),L=B=>{try{let q=Fn("group",{id:Ci(),name:B,createdAt:Date.now()}),K=In(s,d,q);l(K),y(!1),h(void 0),u(q.id)}catch(q){h(q instanceof Error?q.message:String(q))}},N=bd(s,d),A=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),E=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,ee.jsxs)("div",{ref:x,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":A,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,ee.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,ee.jsx)("strong",{children:A}),r==="add"&&n!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,ee.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),N.map(B=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(B.id),children:B.name},B.id))]}),(0,ee.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:M().length===0?(0,ee.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):M().map(B=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(B.id),children:(0,ee.jsx)("span",{className:"fx-bookmark-name",children:B.name})},B.id))}),m===void 0?null:(0,ee.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:m}),p?(0,ee.jsx)(An,{kind:"directory",parent:d??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:L,onCancel:()=>y(!1)}):(0,ee.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>y(!0),children:t("bookmarks.newGroup")}),(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:H,children:E})]})]})}function Br(e){return`dsh-fs-explorer.bookmarks.${e}`}function Lr(e){return`${Br(e)}.pending`}function vt(){try{return globalThis.localStorage??void 0}catch{return}}function Ti(e){let n=vt();if(n===void 0)return;let t;try{t=n.getItem(Br(e))}catch{return}if(t!==null)try{return mn(JSON.parse(t))}catch{return}}function vd(e,n){let t=vt();if(t!==void 0)try{t.setItem(Br(e),JSON.stringify(n)),t.setItem(Lr(e),"1")}catch{}}function wd(e){let n=vt();if(n===void 0)return!1;try{return n.getItem(Lr(e))==="1"}catch{return!1}}function Ei(e){let n=vt();if(n!==void 0)try{n.removeItem(Lr(e))}catch{}}function Mi(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(Ei(n),r.tree):wd(n)?Ti(n)??nn(new Date().toISOString()):nn(new Date().toISOString())}catch{}return Ti(n)??nn(new Date().toISOString())},async save(n,t){let r=mn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){Ei(n);return}}catch{}vd(n,r)}}}var Ir="fs-explorer.treePaneWidth";function Ar(e){return Math.min(520,Math.max(180,e))}function Fi(e){if(e==null)return null;let n;try{n=e.getItem(Ir)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function wt(e,n){let t=Math.round(Ar(n));if(e!=null)try{e.setItem(Ir,String(t))}catch{}return t}function Bi(e){if(e!=null)try{e.removeItem(Ir)}catch{}}function Li(e,n){return Math.round(e)===Math.round(n)}var Ni=16;function Ii(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ni};case"ArrowRight":return{kind:"nudge",delta:Ni};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var V=require("react");function Di(e,n,t,r=800){return t-n<=r?e:""}function Oi(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Wi(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Rd(e,t+1,r.depth,r.depth+1)}function Rd(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Sd=/^.$/u;function $i(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Sd.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ai(e.names,n),d=a.find(u=>u>e.active)??a[0];return d===void 0?{kind:"miss"}:{kind:"jump",index:d,query:n}}let t=`${e.query}${n}`,r=Ai(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ai(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var F=require("react/jsx-runtime"),Ke=22;function Dr({open:e=!0,size:n=14}){return(0,F.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,F.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,F.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function Cd(){return(0,F.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,F.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function zi(){return(0,F.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,F.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,F.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function _i(){return(0,F.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,F.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Pd({name:e}){return(0,F.jsx)("span",{className:"fx-badge","data-icon":ln(e),"aria-hidden":"true",children:un(e)})}function Td({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:d,onContextMenu:u}){let s=e.kind==="directory",l={top:r,paddingLeft:8+e.depth*12};return(0,F.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{d(e.path),s?i(e.path):a(e.path)},onContextMenu:p=>{p.preventDefault(),p.stopPropagation(),u(e,p)},children:[(0,F.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,F.jsx)(Cd,{})}),s?(0,F.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,F.jsx)(Dr,{open:e.expanded})}):(0,F.jsx)(Pd,{name:e.name}),(0,F.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,F.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,F.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":wn(e.status),"data-testid":"fx-file-status",title:o(zt(e.status)),"aria-label":o(zt(e.status)),children:Hn(e.status)}),e.statusCount===void 0?null:(0,F.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,F.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,F.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,F.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,F.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,F.jsx)("span",{className:"fx-size",children:et(e.size)})]})}function Ed({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,F.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,F.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,F.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,F.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,F.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Md(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function ji({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:d,onContextMenu:u}){let s=(0,V.useRef)(null),[l,p]=(0,V.useState)(0),[y,m]=(0,V.useState)(0),[h,x]=(0,V.useState)(void 0),M=(0,V.useRef)(void 0),H=(0,V.useRef)({query:"",at:0}),L=(0,V.useRef)(void 0),N=(0,V.useRef)(void 0),A=(0,V.useRef)(h);A.current=h;let E=(0,V.useMemo)(()=>e.flatMap((f,v)=>f.type==="entry"?[v]:[]),[e]);(0,V.useEffect)(()=>{let f=N.current!==n;if(N.current=n,L.current!==void 0||n===void 0)return;let v=A.current===void 0?void 0:e[A.current];if(!po({cursorPath:v?.type==="entry"?v.path:void 0,selectionMoved:f}))return;let b=e.findIndex(W=>W.type==="entry"&&W.path===n);b>=0&&x(b)},[n,e]),(0,V.useEffect)(()=>{let f=L.current;if(f===void 0)return;let v=e.findIndex(G=>G.type==="entry"&&G.path===f),b=e[v];if(b?.type!=="entry"||b.kind!=="directory"||!b.expanded){L.current=void 0;return}let W=mo(e,f);W!==void 0&&(L.current=void 0,x(W))},[e]),(0,V.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&x(void 0)},[e,h]),(0,V.useEffect)(()=>{let f=s.current;if(h===void 0||f===null)return;let v=jt({scrollTop:f.scrollTop,viewport:f.clientHeight,rowHeight:Ke,index:h});v!==f.scrollTop&&(f.scrollTop=v)},[h]);let B=(0,V.useCallback)(f=>{x(f),s.current?.focus({preventScroll:!0})},[]),q=(0,V.useCallback)(f=>{let v=e.findIndex(b=>b.type==="entry"&&b.path===f);v>=0&&x(v)},[e]),K=(0,V.useCallback)((f,v,b)=>{q(f.path),u(f,v,b)},[q,u]),be=(0,V.useCallback)(f=>{f.preventDefault(),u(void 0,{x:f.clientX,y:f.clientY},f.currentTarget)},[u]),me=(0,V.useCallback)(f=>{if(f.nativeEvent.isComposing||f.altKey||f.metaKey||f.ctrlKey)return;let v=E.at(-1);if(f.key==="ArrowDown"){if(f.preventDefault(),h===void 0){E[0]!==void 0&&B(E[0]);return}let j=E.find(X=>X>h);j!==void 0&&B(j);return}if(f.key==="ArrowUp"){if(f.preventDefault(),h===void 0){v!==void 0&&B(v);return}let j=[...E].reverse().find(X=>X<h);j!==void 0&&B(j);return}if(h===void 0)return;let b=e[h];if(b===void 0||b.type!=="entry")return;if(f.key==="ArrowRight"){if(f.preventDefault(),b.kind==="directory"&&!b.expanded)L.current=b.path,o(b.path);else{let j=E.find(X=>X>h);j!==void 0&&e[j]?.depth===b.depth+1&&B(j)}return}if(f.key==="ArrowLeft"){if(f.preventDefault(),b.kind==="directory"&&b.expanded)o(b.path);else{let j=[...E].reverse().find(X=>X<h&&e[X]?.type==="entry"&&e[X].depth<b.depth);j!==void 0&&B(j)}return}if(f.key==="Enter"&&b.kind!=="directory"){f.preventDefault(),i(b.path);return}if(f.key==="ContextMenu"||f.key==="F10"&&f.shiftKey){f.preventDefault();let j=s.current?.getBoundingClientRect(),X=j===void 0?0:j.top+h*Ke-(s.current?.scrollTop??0);K(b,{x:j?.left??0,y:X+Ke},s.current??void 0);return}if(f.key==="Home"){f.preventDefault(),E[0]!==void 0&&B(E[0]);return}if(f.key==="End"){f.preventDefault(),v!==void 0&&B(v);return}let W=Date.now(),G=Oi(e,h),ae=Wi(e,G),se=ae.map(j=>{let X=e[j];return X?.type==="entry"?X.name:""}),Z=$i({query:Di(H.current.query,H.current.at,W),key:f.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:f.nativeEvent.repeat,names:se,active:h===void 0?-1:ae.indexOf(h)});if(Z.kind==="clear"){H.current={query:"",at:0};return}if(Z.kind!=="jump")return;let Q=ae[Z.index];if(Q===void 0)return;let U=e[Q];U?.type==="entry"&&(H.current={query:Z.query,at:W},f.preventDefault(),B(Q),U.kind!=="directory"&&i(U.path))},[h,E,B,o,i,K,e]);(0,V.useEffect)(()=>{let f=s.current;if(f===null)return;let v=()=>m(f.clientHeight);if(v(),typeof ResizeObserver>"u")return;let b=new ResizeObserver(v);return b.observe(f),()=>b.disconnect()},[]),(0,V.useEffect)(()=>{if(n===void 0)return;let f=s.current;if(f===null)return;let v=e.findIndex(W=>W.type==="entry"&&W.path===n);if(v<0)return;let b=v*Ke;(b<f.scrollTop||b+Ke>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,b-f.clientHeight/2))},[n,e]),(0,V.useEffect)(()=>{if(t===void 0||M.current===t)return;let f=s.current;if(f===null)return;let v=t.path===void 0?-1:e.findIndex(b=>b.type==="entry"&&b.path===t.path);if(!(t.path!==void 0&&v<0)){if(M.current=t,v>=0){let b=jt({scrollTop:f.scrollTop,viewport:f.clientHeight===0?480:f.clientHeight,rowHeight:Ke,index:v});b!==f.scrollTop&&(f.scrollTop=b,p(b)),x(v)}Md(f),d?.()}},[t,e,d]);let R=f=>{p(f.currentTarget.scrollTop)},S=Un(e,{scrollTop:l,height:y===0?480:y,rowHeight:Ke});return(0,F.jsx)("div",{className:"fx-scroll",ref:s,onScroll:R,onKeyDown:me,onContextMenu:be,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,F.jsx)("div",{className:"fx-vlist",style:{height:e.length*Ke},children:S.rows.map((f,v)=>{let b=(S.startIndex+v)*Ke;return f.type==="entry"?(0,F.jsx)(Td,{row:f,top:b,selected:f.path===n,cursor:h===S.startIndex+v,t:r,onToggle:o,onSelect:i,onRowActivate:q,onContextMenu:(W,G)=>K(W,{x:G.clientX,y:G.clientY},G.currentTarget instanceof HTMLElement?G.currentTarget:void 0)},f.path):(0,F.jsx)(Ed,{row:f,top:b,t:r,onRetry:a},f.key)})})})}function Fe(e){return e!==null&&typeof e=="object"}function St(e){try{return e()}catch{return}}function Nd(e){let n=St(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Fe(n)?n.rpc:void 0;if(!(!Fe(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Jr}/${r}`,o,i)}function Fd(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks")}}function Or(e){return Fe(e)&&typeof e.info=="function"&&typeof e.reveal=="function"}function Bd(e){return()=>{let n=St(()=>e.fsExplorerWorkspace);if(Or(n))return n;let t=St(()=>Fe(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Or(t))return t;let r=St(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Or(r))return r;let o=Nd(e);if(o!==void 0)return Fd(o)}}function gn(e){let n=Fe(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Fe(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Fe(t)?t:void 0}var Ld=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function kn(e){let n=Fe(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:Ld.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function Id(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};let t=Fe(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function Ad(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};let t=Fe(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function Dd(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:{ok:!0}}function Od(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function Wd(e){let n=gn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:kn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:mn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function $d(e){let n=gn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:kn(n.error)}:{ok:!0}}var Rt={code:"unsupported",message:"the workspace service is unavailable"};function Ki(e){let n=Bd(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:Rt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),Id),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),Ad),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),Dd),create:(r,o,i,a,d)=>t(u=>{let s=u.create;return typeof s!="function"?{ok:!1,error:Rt}:s.call(u,{sessionId:r,parent:o,name:i,kind:a},d)},Od),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:Rt}:a.call(i,{sessionId:r},o)},Wd),saveBookmarks:(r,o,i)=>t(a=>{let d=a.saveBookmarks;return typeof d!="function"?{ok:!1,error:Rt}:d.call(a,{sessionId:r,tree:o},i)},$d)}}var zd={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function _d(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var jd={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function Kd(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",s=Hi(t[2]??"");return s===""?void 0:{base:`https://${u}/${s}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=Hi(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function Hi(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Hd(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Gd(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Vd(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Vd(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function qd(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function Gi(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=qd(t,r);if(a===void 0)return[];let d=Gd(i),u=Hd(a),s=[],l=new Set;for(let p of n){if(l.has(p.name))continue;let y=Kd(p.url);if(y===void 0)continue;l.add(p.name);let m=_d(y.host),h=jd[m][o],x=u===""?"":`/${u}`;s.push({id:`copy.remote.${p.name}`,label:`${p.name} \xB7 ${zd[m]}`,url:`${y.base}/${h}/${d}${x}`})}return s}var T=require("react/jsx-runtime");function Ud(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Xd=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Yd(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Zd=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,qi=new Map;function Jd(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Ct({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,T.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,T.jsx)("strong",{children:e}),n===void 0?null:(0,T.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,T.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Qd(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Ui({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:d,locate:u,workspace:s}){let l=Eo();function p(y){let m=y.sessionId??e.currentSessionId(),h=(0,k.useRef)(m);h.current=m;let x=(0,k.useMemo)(()=>r(),[r]),M=(0,k.useMemo)(()=>o(),[o]),H=(0,k.useMemo)(()=>i(),[i]),L=(0,k.useMemo)(()=>m===void 0||u===void 0?void 0:u(m),[u,m]),N=(0,k.useMemo)(()=>m===void 0||s===void 0?void 0:s(m),[s,m]),A=(0,k.useMemo)(()=>Mi(N),[N]),[E,B]=(0,k.useState)(()=>nn(new Date().toISOString())),q=(0,k.useRef)(!1),[K,be]=(0,k.useState)(null),[me,R]=(0,k.useState)(null),S=(0,k.useRef)(!1),[f,v]=(0,k.useState)(null),[b,W]=(0,k.useState)(void 0),[G,ae]=(0,k.useState)(null),se=(0,k.useRef)(null),[Z,Q]=(0,k.useState)(null),[U,j]=(0,k.useState)(()=>new Map),[X,Se]=(0,k.useState)(void 0),[ce,ye]=(0,k.useState)(void 0),[He,Be]=(0,k.useState)(void 0),[tn,Le]=(0,k.useState)(void 0),[Dn,On]=(0,k.useState)(qi),Ve=(0,k.useRef)(U);Ve.current=U;let[qe,Ie]=(0,k.useState)(()=>new Set),O=(0,k.useMemo)(()=>l.forSession(m),[l,m]),Ae=(0,k.useSyncExternalStore)(O.subscribe,O.snapshot,O.snapshot),Ce=Ae.panels.find(c=>c.key===Ae.active),Pe=Ce?.path,rn=Ce?.revision,[Te,z]=(0,k.useState)(0),J=(0,k.useRef)(new Map),De=(0,k.useRef)(void 0),[oe,on]=(0,k.useState)(null),[na,_r]=(0,k.useState)(!1),[ta,an]=(0,k.useState)(null),jr=(0,k.useRef)(null);jr.current=oe?.path??null;let Ge=(0,k.useMemo)(()=>Yd(),[]),[Ue,sn]=(0,k.useState)(()=>Fi(Ge)),Nt=(0,k.useRef)(null),dn=(0,k.useRef)(null),ne=U.get(""),Wn=ne?.status==="ready",$n=(0,k.useCallback)((c,g,w,P)=>{O.open(c,g,w,P)},[O]),Ft=(0,k.useCallback)(c=>{let g=c??O.snapshot().active??void 0;if(g===void 0)return;if((m===void 0?void 0:d?.peek(m,g))?.dirty===!0){an(null),on({path:g});return}on(null),an(null),m!==void 0&&d?.forget(m,g),O.close(g)},[d,m,O]),ra=(0,k.useCallback)(()=>{let c=oe;if(c===null)return;let g=m===void 0?void 0:d?.find(m,c.path);if(g===void 0){on(null),m!==void 0&&d?.forget(m,c.path),O.close(c.path);return}_r(!0),an(null),g.save().then(w=>{if(_r(!1),!w.ok){let P=g.getSnapshot().error;an(t("panel.confirm.failed").replace("{message}",Tr(w.code,P?.message??"",t)));return}on(null),m!==void 0&&d?.forget(m,c.path),O.close(c.path)})},[d,oe,m,O,t]),oa=(0,k.useCallback)(()=>{let c=oe;on(null),an(null),c!==null&&(m!==void 0&&d?.forget(m,c.path),O.close(c.path))},[d,oe,m,O]),Bt=(0,k.useCallback)(()=>{on(null),an(null)},[]),ge=(0,k.useCallback)(async(c,g,w)=>{J.current.get(c)?.abort();let P=new AbortController;J.current.set(c,P),j(_=>new Map(_).set(c,Xd()));try{let _=await w.list(g,Xn(c),P.signal);if(P.signal.aborted||h.current!==g)return!1;let Y=gt(_);if(!Y.ok)return j(Oe=>new Map(Oe).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:Y.message})),!1;let ve=qn(Y.listing.entries);return j(Oe=>new Map(Oe).set(c,{status:"ready",nodes:ve,truncated:Y.listing.truncated===!0,total:Y.listing.entries.length})),!0}catch(_){return P.signal.aborted||j(Y=>new Map(Y).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:Qo(_)})),!1}finally{J.current.get(c)===P&&J.current.delete(c)}},[]);(0,k.useEffect)(()=>{for(let c of J.current.values())c.abort();return J.current.clear(),j(new Map),Ie(new Set),De.current=void 0,m!==void 0&&x!==void 0&&ge("",m,x),()=>{for(let c of J.current.values())c.abort();J.current.clear()}},[m,x,Te,ge]),(0,k.useEffect)(()=>{if(m===void 0||M===void 0){Se(void 0),ye(void 0),Be(void 0),Le(void 0);return}let c=!0,g=new AbortController;return Se(void 0),ye(void 0),Be(void 0),Le(void 0),Promise.resolve().then(()=>M.snapshot({sessionId:m,maxCommits:1},g.signal)).then(w=>{if(!c)return;let P=kt(w);if(!P.ok){Se(void 0),ye(void 0),Be(void 0),Le(void 0);return}Se(io(Kn(P.status),P.stats)),ye(P.head),Be(P.root),Le(P.remotes)}).catch(()=>{c&&(Se(void 0),ye(void 0),Be(void 0),Le(void 0))}),()=>{c=!1,g.abort()}},[m,M,Te]),(0,k.useEffect)(()=>{let c=x?.read;if(m===void 0||x===void 0||typeof c!="function"||!Wn){On(qi);return}let g=m,w=new AbortController,P=async(Y,ve)=>{try{let Oe=Jd(await c.call(x,g,ve,{},w.signal));return Oe===void 0?void 0:[Y,Oe]}catch{return}},_=uo.filter(Y=>Y!==".gitmodules").map(Y=>P(Y,Y));return He!==void 0&&_.push(P(".gitmodules",`${He.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(_).then(Y=>{if(w.signal.aborted||h.current!==g)return;let ve=new Map;for(let Ye of Y)Ye!==void 0&&ve.set(Ye[0],Ye[1]);let Oe=Ve.current.get(""),Ca=new Set(Oe?.status==="ready"?Oe.nodes.filter(Ye=>Ye.kind==="directory").map(Ye=>Ye.name):[]);On(Gn(ve,Ca))}),()=>w.abort()},[m,x,Wn,He,Te]),(0,k.useEffect)(()=>{let c=y.viewRequest;if(c==null||c.view!==fe)return;let g=`${c.view}:${c.focus}`;De.current!==g&&(De.current=g,Sn(c.focus,{open:$n}),y.completeViewRequest?.())},[y.viewRequest,y.completeViewRequest,$n]),(0,k.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||m===void 0)return;let g=()=>{let w=c.take(fe);w!==void 0&&Sn(w,{open:$n})};return g(),c.subscribe(g)},[e,m,$n]),(0,k.useEffect)(()=>{if(Pe===void 0||rn!==void 0||!Wn||Yn(Pe))return;let c=Kt(Pe);if(c.length===0||(Ie(w=>c.every(P=>w.has(P))?w:new Set([...w,...c])),m===void 0||x===void 0))return;let g=c.filter(w=>Ve.current.get(w)?.status!=="ready");g.length!==0&&Promise.all(g.map(w=>ge(w,m,x)))},[Pe,rn,Wn,m,x,ge]);let Kr=(0,k.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),ia=(0,k.useCallback)(c=>{if(c.button!==0||dn.current!==null||Zd())return;let g=Nt.current?.previousElementSibling;if(g instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}dn.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:g.getBoundingClientRect().width,restWidth:Ue},document.body.classList.add("fx-pane-resizing")}},[Ue]),aa=(0,k.useCallback)(c=>{let g=dn.current;g===null||g.pointerId!==c.pointerId||sn(Ar(g.baseWidth+c.clientX-g.startX))},[]),Lt=(0,k.useCallback)(c=>{let g=dn.current;if(g===null||g.pointerId!==c.pointerId)return;dn.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let w=g.baseWidth+c.clientX-g.startX;if(Li(w,g.baseWidth)){sn(g.restWidth);return}sn(wt(Ge,w))},[Ge]),It=(0,k.useCallback)(()=>{Bi(Ge),sn(null)},[Ge]),sa=(0,k.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let g=Ii(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(g===null)return;if(c.preventDefault(),c.stopPropagation(),g.kind==="reset"){It();return}if(g.kind==="min"||g.kind==="max"){let _=g.kind==="min"?180:520;sn(wt(Ge,_));return}let w=Nt.current?.previousElementSibling,P=w instanceof HTMLElement?w.getBoundingClientRect().width:Ue??180;sn(wt(Ge,P+g.delta))},[Ge,It,Ue]);(0,k.useEffect)(()=>()=>{dn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,k.useEffect)(()=>{if(typeof document>"u")return;let c=g=>{if(!(g.isComposing||Po(g.target))){if(Qd(g)){let w=O.snapshot().active,P=w===null||d===void 0||m===void 0?void 0:d.find(m,w);if(P===void 0)return;g.preventDefault(),g.stopPropagation(),P.save();return}for(let w of it)if(Co(g,w)){if(w.action==="closePanel"&&O.snapshot().active===null)return;g.preventDefault(),g.stopPropagation(),w.action==="nextPanel"?O.next():w.action==="previousPanel"?O.previous():Ft();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[d,Ft,m,O]),(0,k.useEffect)(()=>{if(typeof document>"u")return;let c=at({focusComposer:Kr,hasModal:()=>jr.current!==null||S.current||ir(document)}),g=w=>c(w);return document.addEventListener("keydown",g,!0),()=>document.removeEventListener("keydown",g,!0)},[Kr]),(0,k.useEffect)(()=>{if(oe===null||typeof document>"u")return;let c=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),Bt())};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[oe,Bt]);let At=(0,k.useMemo)(()=>Qn(U,qe,X,Dn),[U,qe,X,Dn]),[da,zn]=(0,k.useState)(void 0),Hr=(0,k.useRef)(!1);(0,k.useEffect)(()=>{if(Hr.current||typeof document>"u")return;let c=yo({rows:At,panelCount:O.snapshot().panels.length,hasModal:ir(document)});c.kind!=="skip"&&(Hr.current=!0,c.open!==void 0&&O.open(c.open),zn({path:c.focus}))},[At,O]);let la=(0,k.useCallback)(()=>zn(void 0),[]),xn=X===void 0?void 0:Object.keys(X).length,ua=X===void 0?"neutral":Object.values(X).some(c=>c.status==="conflicted")?"conflict":xn===0?"success":"warning",Gr=oo(ce),ca=(0,k.useCallback)(c=>{if(m===void 0||x===void 0)return;if(qe.has(c)){Ie(w=>{let P=new Set(w);return P.delete(c),P});return}Ie(w=>new Set(w).add(c));let g=U.get(c);(g===void 0||g.status==="failed")&&ge(c,m,x)},[qe,U,m,x,ge]),Vr=(0,k.useCallback)(c=>{m===void 0||x===void 0||ge(c,m,x)},[m,x,ge]);(0,k.useEffect)(()=>{let c=!0;if(q.current=!1,m===void 0){B(nn(new Date().toISOString()));return}return A.load(m).then(g=>{c&&!q.current&&B(g)}).catch(()=>{}),()=>{c=!1}},[A,m]);let fa=(0,k.useCallback)(c=>{let g=[...Kt(c),c];if(Ie(w=>{let P=new Set(w);for(let _ of g)P.add(_);return P}),m!==void 0&&x!==void 0){let w=g.filter(P=>Ve.current.get(P)?.status!=="ready");w.length>0&&Promise.all(w.map(P=>ge(P,m,x)))}zn({path:c})},[m,x,ge]),pa=(0,k.useCallback)(c=>{O.open(c)},[O]),te=(0,k.useCallback)((c,g)=>{se.current!==null&&clearTimeout(se.current),ae({text:c,tone:g}),se.current=setTimeout(()=>{se.current=null,ae(null)},4e3)},[]);(0,k.useEffect)(()=>()=>{se.current!==null&&clearTimeout(se.current)},[]);let Xe=(0,k.useCallback)(c=>{q.current=!0,B(c),m!==void 0&&A.save(m,c).catch(()=>{te(t("bookmarks.saveFailed"),"error")})},[te,A,m,t]),ma=(0,k.useCallback)(c=>{try{Xe(vi(E,c.id).tree),te(t("bookmarks.removed"),"ok")}catch{}},[te,E,Xe,t]),ya=(0,k.useCallback)((c,g)=>{try{Xe(Si(E,c,g))}catch{}},[E,Xe]);(0,k.useEffect)(()=>{if(N===void 0){W(void 0);return}let c=!0;return N.capabilities(m??"").then(g=>{c&&W(g.ok?g.capabilities:void 0)}),()=>{c=!1}},[N,m]);let ga=(0,k.useCallback)((c,g,w)=>{let P=c===void 0?"":c.kind==="directory"?c.path:ai(c.path);if(v({row:c,anchor:g,absolutePath:void 0,trigger:w,createParent:P}),c===void 0||N===void 0)return;let _=c.path;N.info(m??"",_).then(Y=>{v(ve=>ve===null||ve.row?.path!==_?ve:{...ve,absolutePath:Y.ok?Y.info.absolutePath:void 0})})},[m,N]),ka=(0,k.useCallback)(()=>v(null),[]);S.current=f!==null;let _n=(0,k.useMemo)(()=>Gi({remotes:tn,root:He,absolutePath:f?.absolutePath,kind:f?.row?.kind??"file",head:ce}),[f?.absolutePath,f?.row?.kind,He,ce,tn]),Dt=(0,k.useCallback)(c=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${c.code}`)),[t]),xa=(0,k.useCallback)(c=>{let g=f;if(v(null),g===null)return;if(c===ie.createFile||c===ie.createFolder){let P=g.createParent;if(P===void 0)return;Q({kind:c===ie.createFolder?"directory":"file",parent:P,error:void 0,busy:!1});return}let w=g.row;if(w!==void 0){if(c.startsWith(`${ie.copyRemote}.`)){let P=_n.find(_=>_.id===c);if(P===void 0)return;en(P.url).then(_=>{te(_?t("notice.copiedRemote").replace("{remote}",P.label):t("notice.copyFailed"),_?"ok":"error")});return}if(c===ie.copyRelative){en(w.path).then(P=>{te(t(P?"notice.copiedRelative":"notice.copyFailed"),P?"ok":"error")});return}if(c===ie.copyAbsolute){let P=g.absolutePath;if(P===void 0)return;en(P).then(_=>{te(t(_?"notice.copiedAbsolute":"notice.copyFailed"),_?"ok":"error")});return}if(c===ie.addBookmark){be({mode:"add",target:{name:w.name,path:w.path,kind:w.kind}});return}if(c===ie.reveal){if(N===void 0){te(Dt({code:"unsupported",message:""}),"error");return}N.reveal(m??"",w.path).then(P=>{if(!P.ok){te(Dt(P.error),"error");return}let _=t(`menu.manager.${b?.fileManager??"directory"}`);te(t("notice.revealed").replace("{manager}",_),"ok")})}}},[te,b,f,_n,Dt,m,t,N]),ha=(0,k.useCallback)(c=>{let g=Z;if(g===null)return;if(N===void 0||N.create===void 0){Q({...g,error:t("prompt.error.unsupported"),busy:!1});return}let w=m;if(w===void 0){Q({...g,error:t("prompt.error.no-workspace"),busy:!1});return}Q({...g,busy:!0,error:void 0}),N.create(w,g.parent,c,g.kind).then(P=>{if(!P.ok){Q(Y=>Y===null?Y:{...Y,busy:!1,error:t(`prompt.error.${P.error.code}`)});return}Q(null);let _=P.path;if(x!==void 0&&ge(g.parent,w,x),g.kind==="file"){O.open(_),te(t("notice.createdFile"),"ok");return}Ie(Y=>new Set(Y).add(_)),x!==void 0&&ge(_,w,x),zn({path:_}),te(t("notice.createdFolder"),"ok")})},[te,x,ge,Z,m,O,t,N]),ba=(0,k.useCallback)(()=>Q(null),[]),va=(0,k.useMemo)(()=>f===null?[]:si({row:f.row,notices:{workspace:N!==void 0},capabilities:b,absolutePath:f.absolutePath,createParent:f.createParent,remoteLinks:f.row===void 0?void 0:_n,bookmarkTarget:f.row===void 0?void 0:{name:f.row.name,path:f.row.path,kind:f.row.kind}},t),[b,f,_n,t,N]),wa=()=>Ie(new Set),Ra=()=>z(c=>c+1),Sa=m===void 0?"no-session":x===void 0?"no-service":ne===void 0||ne.status==="loading"?"loading":ne.status==="failed"?"failed":ne.nodes.length===0?"empty":"tree";return(0,T.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Sa,"data-session":m??"","data-testid":"fs-explorer-view",children:[(0,T.jsxs)("header",{className:"fx-head",children:[(0,T.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,T.jsx)(Dr,{open:!0})}),(0,T.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,T.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,T.jsx)(fi,{tree:E,t,onOpenFile:pa,onOpenFolder:fa,onCreateGroup:c=>R({mode:"group",parentId:c}),onRename:c=>R({mode:"rename",node:c}),onRemove:ma,onMove:c=>be({mode:"move",node:c}),onReorder:ya}),(0,T.jsxs)("div",{className:"fx-head-meta",children:[ne?.status==="ready"?(0,T.jsxs)("span",{children:[(0,T.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}):null,(0,T.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:qe.size===0,onClick:wa,children:(0,T.jsx)(_i,{})}),(0,T.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:m===void 0||x===void 0||ne?.status==="loading",onClick:Ra,children:(0,T.jsx)(zi,{})})]})]}),G===null?null:(0,T.jsx)("div",{className:"fx-notice",role:"status","data-tone":G.tone,"data-testid":"fx-notice",children:G.text}),(0,T.jsx)("div",{className:"fx-main",children:m===void 0?(0,T.jsx)(Ct,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):x===void 0?(0,T.jsx)(Ct,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ne===void 0||ne.status==="loading"?(0,T.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,T.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ne.status==="failed"?(0,T.jsx)(Ct,{title:t("state.failed.title"),description:ne.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Vr(""),testId:"fs-failed"}):ne.nodes.length===0?(0,T.jsx)(Ct,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("div",{className:"fx-tree-pane",style:Ue===null?void 0:{"--fx-tree-width":`${Ue}px`},children:(0,T.jsx)(ji,{rows:At,selectedPath:rn===void 0?Pe:void 0,entryFocus:da,t,onToggle:ca,onSelect:c=>O.open(c),onRetry:Vr,onEntryFocusSettled:la,onContextMenu:ga})}),(0,T.jsx)("div",{ref:Nt,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":Ue??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:ia,onPointerMove:aa,onPointerUp:Lt,onPointerCancel:Lt,onLostPointerCapture:Lt,onKeyDown:sa,onDoubleClick:It}),(0,T.jsxs)("div",{className:"fx-editor",children:[(0,T.jsx)(Mo,{panels:Ae.panels,active:Ae.active,t,onActivate:c=>O.activate(c),onClose:Ft,onStep:c=>c===1?O.next():O.previous(),documents:d,sessionId:m}),oe===null?null:(0,T.jsx)(No,{name:dt(oe.path),t,saving:na,error:ta,onSave:ra,onDiscard:oa,onCancel:Bt}),(0,T.jsx)("div",{className:"fx-editor-body",children:Ae.panels.length===0?(0,T.jsx)(Fo,{t}):Ae.panels.map((c,g)=>{let w=c.key===Ae.active;return(0,T.jsx)("div",{className:"fx-panel",id:`fx-panel-${g}`,role:"tabpanel","aria-labelledby":`fx-tab-${g}`,hidden:!w,"data-line":c.line,"data-testid":"fs-panel",children:(0,T.jsx)(ri,{sessionId:m,files:x,path:c.path,revision:c.revision,git:H,t,visible:w,renderers:a,documents:d,locate:L})},c.key)})})]})]})}),f===null?null:(0,T.jsx)(li,{entries:va,anchor:f.anchor,onSelect:xa,onClose:ka,...f.trigger===void 0?{}:{returnFocus:()=>f.trigger??null}}),Z===null?null:(0,T.jsx)(An,{kind:Z.kind,parent:Z.parent,t,error:Z.error,busy:Z.busy,onSubmit:ha,onCancel:ba}),K===null?null:(0,T.jsx)(Pi,{tree:E,target:K.mode==="add"?K.target:void 0,t,mode:K.mode,...K.mode==="move"?{node:K.node}:{},onCommit:c=>{let g=K.mode;Xe(c),be(null),te(t(g==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>be(null)}),me===null?null:(0,T.jsx)(An,{kind:"directory",parent:"",t,initialName:me.mode==="rename"?me.node.name:t("bookmarks.newGroup"),titleKey:me.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:c=>{let g=me;R(null);try{if(g.mode==="rename"){Xe(wi(E,g.node.id,c)),te(t("bookmarks.renamed"),"ok");return}let w=Fn("group",{id:Ud(),name:c,createdAt:Date.now()});Xe(In(E,g.parentId,w)),te(t("bookmarks.groupCreated"),"ok")}catch{te(t("bookmarks.saveFailed"),"error")}},onCancel:()=>R(null)}),ne?.status==="ready"?(0,T.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,T.jsxs)("span",{children:[t("view.scope")," ",(0,T.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}),ne.truncated?(0,T.jsx)("span",{className:"fx-foot-warn",children:Rn({entries:ne.nodes,truncated:!0,total:ne.total}).label}):null,(0,T.jsxs)("span",{className:"fx-foot-git","data-state":xn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,T.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ua,"aria-hidden":"true"}),xn===void 0?t("status.unavailable"):xn===0?t("status.clean"):t("status.summary").replace("{count}",String(xn))]}),Gr===null?null:(0,T.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Gr,ce?.upstream!==void 0&&(ce.ahead??0)>0?(0,T.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(ce.ahead)}`}):null,ce?.upstream!==void 0&&(ce.behind??0)>0?(0,T.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(ce.behind)}`}):null]}),(0,T.jsx)("span",{className:"fx-spacer"}),(0,T.jsx)("span",{children:t("foot.order")})]}):null]})}return p}var Yi=["slots","locale","workbench","remote"];function nl(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Pt,Tt,$r,Et,zr,Zi;function Xi(e){return zr=e,Et!==void 0||(Et=So({open:(n,t,r)=>{let o=zr;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):wo(o)(n,t,r)},save:(n,t)=>{let r=zr;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Ro(r)(n,t)}})),Et}function tl(){if($r!==void 0)return $r;let e=mt({warn:n=>Zi?.(n)});for(let n of Er())e.register(n);return $r=e,e}var Mt;function Ji(e){let n=e.workbench;if(n==null)return()=>{};Zi=l=>e.logger?.warn?.(l);let t=tl(),r={version:jo,renderers:t,registerRenderer:l=>t.register(l),documents:Xi(e)};Tt?.();let o=e.provide?.(hr,r);o===void 0&&e.logger?.warn?.(`${vn}: ctx.provide unavailable, ${hr} service not registered`),Tt=o,Pt?.();let i=e.locale.register(vn,{zh:{...Jt,...sr.zh,...Pr.zh},en:{...Qt,...sr.en,...Pr.en}});Pt=i;let a=e.locale.bind(vn),d=ii(typeof document>"u"?void 0:document),u=Ui({workbench:n,version:n.version,t:a,files:Uo(e),status:ei(e),git:Zo(e),renderers:t,documents:Xi(e),locate:l=>vo(e,l),workspace:()=>Ki(e)});Mt?.();let s=Zt(e,n);return Mt=s,e.slots.inject(Wt,()=>e.slots.register({name:Wt,id:fe,order:100,label:()=>er(nl(e)),locale:vn},u)),()=>{o?.(),Tt===o&&(Tt=void 0),s(),Mt===s&&(Mt=void 0),d(),i(),Pt===i&&(Pt=void 0)}}var Qi={buildTree:qn,describeListing:Rn,iconFor:ln,computeTreeWindow:Un,flattenTree:Qn,badgeFor:un,formatSize:et,joinPath:Zn,listingPath:Xn,parseFocus:Jn,consumeViewRequest:Sn,createPanelStack:ar,createEscapeHandler:at,KEYMAP:it,tabLabel:er,normalizeListing:gt,normalizeStatusSnapshot:kt,buildWorkspaceMap:Gn,workspaceTagFor:Vn,parseStatusZ:Kn,statusTone:wn,statusBadge:Hn,createPreviewLoader:ut,renderMarkdown:lt,languageFor:Tn,isMarkdownFile:En,describePage:ct,classifyPreviewFailure:Qe,normalizePreviewPage:pn,previewChunkRoute:Wo,canBridgeFile:nt,decideBridge:Xt,focusForFileAddress:Ut,forwardFocus:Yt,registerAddressBridge:Zt},ea={name:"dsh-fs-explorer",inject:Yi,apply:Ji,__test:Qi};function rl(e){_o(e),Oo(e)}var ol=ea;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
