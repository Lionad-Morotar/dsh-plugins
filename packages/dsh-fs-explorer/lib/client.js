window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var pn=Object.defineProperty;var Ir=Object.getOwnPropertyDescriptor;var Ar=Object.getOwnPropertyNames;var jr=Object.prototype.hasOwnProperty;var Dr=(e,n)=>{for(var t in n)pn(e,t,{get:n[t],enumerable:!0})},Wr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of Ar(n))!jr.call(e,i)&&i!==t&&pn(e,i,{get:()=>n[i],enumerable:!(r=Ir(n,i))||r.enumerable});return e};var zr=e=>Wr(pn({},"__esModule",{value:!0}),e);var oo={};Dr(oo,{__test:()=>br,apply:()=>vr,boot:()=>jt,clientPlugin:()=>wr,default:()=>io,inject:()=>hr});module.exports=zr(oo);var ve=require("react");var Qn="dsh-resource://file/";function et(e){try{return decodeURIComponent(e)}catch{return e}}function we(e){if(!e.startsWith(Qn))return null;let n=e.slice(Qn.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let i=et(t.slice(0,r)),o=t.slice(r+1),l=o.search(/[?#]/u),u=l<0?o:o.slice(0,l);return u.length===0?null:{sessionId:i,path:u.split("/").map(et).join("/")}}function ie(e){return e.slice(e.lastIndexOf("/")+1)}var nt=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function tt(){return nt.flatMap(e=>[...e.extensions])}function mn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return nt.find(i=>i.extensions.includes(r))?.family??null}var J="dsh-fs-explorer",gn="conversation.view",G="fs-explorer";var Ie="fs-explorer",rt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",yn={chunk:"client.preview.js"},it={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var _r={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Or={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Br=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function at(e){return typeof e=="string"&&Br.has(e)}function ot(e,n){let t=[],r=0;for(let i=0;i<n;i+=1){let o=e.indexOf(" ",r);if(o<0)return null;t.push(e.slice(r,o)),r=o+1}return{fields:t,rest:e.slice(r)}}function $r(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Ae(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let i=t[r];if(i===void 0||i===""||i.startsWith("# "))continue;let o=i[0];if(o==="?"){if(i[1]!==" ")continue;let l=i.slice(2);l!==""&&(n[l]={status:"untracked"});continue}if(o!=="!"){if(o==="1"||o==="2"){let l=ot(i.slice(2),o==="1"?7:8);if(l===null)continue;let u=l.fields[0]??"",s=l.rest;if(s===""||u.length<2)continue;if(o==="2"){let a=t[r+1];if(a===void 0||a==="")continue;r+=1,n[s]={status:"renamed"};continue}n[s]={status:$r(u[0]??".",u[1]??".")};continue}if(o==="u"){let l=ot(i.slice(2),9);if(l===null)continue;let u=l.rest;if(u==="")continue;n[u]={status:"conflicted"}}}}return n}function ke(e){return at(e)?_r[e]:"neutral"}function je(e){return at(e)?Or[e]:"?"}function xn(e){return`status.${e}`}function st(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function dt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function lt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function ct(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let i=t[r.path];i!==void 0&&(t[r.path]={...i,additions:r.additions,deletions:r.deletions})}return t}var Kr=["conflicted","deleted","renamed","added","modified","untracked"];function Hr(e){return ke(Kr.find(n=>e.has(n))??"modified")}function ut(e){let n=new Map;if(e!==void 0)for(let[r,i]of Object.entries(e)){let o=r.replace(/\/+$/u,"");if(o==="")continue;let l=o.split("/"),u=r.endsWith("/")?l.length:l.length-1,s="";for(let a=0;a<u;a+=1){let d=l[a];if(d===void 0||d==="")continue;s=s===""?d:`${s}/${d}`;let f=n.get(s);f===void 0?n.set(s,{count:1,present:new Set([i.status])}):(f.count+=1,f.present.add(i.status))}}let t=new Map;for(let[r,i]of n)t.set(r,{count:i.count,tone:Hr(i.present)});return t}var mt=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],gt=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Gr(e){return gt.test(e)?e.slice(0,e.indexOf("/")):null}function Vr(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],i=t.at(-1);if(r==="'"&&i==="'"||r==='"'&&i==='"')return t.slice(1,-1)}return t}function qr(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let i=n[r]??"";if(i.trim()==="")continue;if(!/^\s/u.test(i))break;let o=/^(\s*)-\s+(.*)$/u.exec(i);if(o===null)continue;let l=Vr(o[2]??"");l!==""&&gt.test(l)&&t.push(l)}return t}function Ur(e){let n=[],t,r=!1,i=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let o of e.split(/\r?\n/u)){let l=o.trim();if(l===""||l.startsWith("#")||l.startsWith(";"))continue;let u=/^\[(.+)\]$/u.exec(l);if(u!==null){i(),r=/^submodule(\s|$)/u.test(u[1]??"");continue}if(!r)continue;let s=/^path\s*=\s*(.*)$/u.exec(l);s!==null&&(t=(s[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return i(),[...new Set(n)]}function ft(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function pt(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function De(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let u of Ur(r))t.set(u,"submodule");let i=new Set,o=e.get("pnpm-workspace.yaml");if(typeof o=="string")for(let u of qr(o))i.add(u);let l=e.get("package.json");if(typeof l=="string"){let u=ft(l);if(u!==void 0){let s=u.workspaces,a=s!==null&&typeof s=="object"&&!Array.isArray(s)?s.packages:void 0;for(let d of pt(Array.isArray(s)?s:a))i.add(d)}}for(let u of["turbo.json","lerna.json"]){let s=e.get(u);if(typeof s!="string")continue;let a=ft(s);if(a!==void 0)for(let d of pt(a.packages))i.add(d)}for(let u of i){let s=Gr(u);s!==null&&n.has(s)&&t.set(u,"package")}return t}function We(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let i=n.indexOf("/");i>0;i=n.indexOf("/",i+1))if(e.get(`${n.slice(0,i)}/**`)==="package")return"package"}var Xr=new Set(["node_modules",".git","dist","__pycache__"]);function Yr(e){return Xr.has(e)}function Zr(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ze(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Yr(r))continue;let i=Zr(t),o=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(o===void 0?{name:r,kind:i}:{name:r,kind:i,size:o})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Jr=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Qr=new Set(["md","mdx","markdown","mdown","rst","adoc"]),ei=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),ni=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),ti=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),ri=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),ii=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function yt(e){let n=ie(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function xe(e,n="file"){if(n==="directory")return"folder";let t=ie(e.toLowerCase());if(ii.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=yt(t);return r===""?"file":Jr.has(r)?"code":Qr.has(r)?"markdown":ei.has(r)?"data":ni.has(r)?"image":ti.has(r)?"style":ri.has(r)?"archive":"file"}var oi={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},ai={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function he(e){let n=ie(e.toLowerCase()),t=oi[n];if(t!==void 0)return t;let r=yt(n),i=ai[r];return i!==void 0?i:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Se(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${rt} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function _e(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),i=Math.max(0,Math.trunc(n.overscan??6)),o=Math.max(1,Math.ceil(r/t)),l=Math.max(0,e.length-o-i*2),u=Math.floor(Math.max(0,n.scrollTop)/t)-i,s=Math.min(Math.max(u,0),l),a=Math.min(e.length,s+o+i*2);return{rows:e.slice(s,a),startIndex:s,endIndex:a}}function vn(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),i=Math.max(0,e.index)*n;return i<r?i:i+n>r+t?i+n-t:r}function Oe(e){return e===""?".":e}function Be(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function $e(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function xt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let i of n.slice(0,-1))r=$e(r,i),t.push(r);return t}function hn(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Ke(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let u=hn(t[2]),s=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return s===""||u<1?void 0:{path:s,line:u,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let u=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return u===""?void 0:{path:u,line:hn(r[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let l=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(l!=="")return{path:l,line:hn(i[2]),absolute:!1}}function ht(e){return e.selectionMoved?!0:e.cursorPath===void 0}function vt(e,n){let t=e.findIndex(i=>i.type==="entry"&&i.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let i=t+1;i<e.length;i+=1){let o=e[i];if(o?.type==="entry"){if(o.depth<=r.depth)return;if(o.depth===r.depth+1)return i}}}function He(e,n,t,r){let i=[],o=ut(t),l=(u,s)=>{let a=e.get(u);if(!(a===void 0||a.status!=="ready"))for(let d of a.nodes){let f=$e(u,d.name),g=d.kind==="directory",b=g&&n.has(f),R=g||t===void 0?void 0:t[f],T=R?.status??(g?void 0:st(f,t)),E=R===void 0?void 0:dt(R),I=g?o.get(f):void 0,j=g?We(r,f):void 0;if(i.push({type:"entry",path:f,name:d.name,kind:d.kind,depth:s,expanded:b,...d.size===void 0?{}:{size:d.size},...T===void 0?{}:{status:T},...I===void 0?{}:{statusCount:I.count,statusTone:I.tone},...E===void 0?{}:{diff:E},...j===void 0?{}:{tag:j}}),!b)continue;let L=e.get(f);if(L===void 0||L.status==="loading"){i.push({type:"status",key:`${f}:loading`,path:f,depth:s+1,state:"loading"});continue}if(L.status==="failed"){i.push({type:"status",key:`${f}:failed`,path:f,depth:s+1,state:"failed",message:L.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(L.nodes.length===0){i.push({type:"status",key:`${f}:empty`,path:f,depth:s+1,state:"empty"});continue}l(f,s+1),L.truncated&&i.push({type:"status",key:`${f}:truncated`,path:f,depth:s+1,state:"truncated",label:Se({entries:L.nodes,truncated:!0,total:L.total}).label})}};return l("",0),i}var si=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function di(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function li(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&si.has(di(n.path)))}function bt(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=li(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Ge(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let i=r===0||t>=10?0:1;return`${t.toFixed(i)} ${n[r]??"B"}`}var bn="dsh-fs-explorer:bridge",ci="fs-explorer-bridge",Rt="dsh-resource://file/**",wn="sidebar.right.pane.tab",ui=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),fi=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),pi=new Set(["makefile","dockerfile","license","readme","changelog"]),mi=new Set([...tt(),...ui]);function gi(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function Ve(e){if(typeof e!="string"||e==="")return!1;let n=ie(e).toLowerCase();if(n==="")return!1;let t=gi(n);return fi.has(t)?!1:pi.has(n)?!0:mi.has(t)}function yi(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function xi(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Rn(e,n){if(typeof e!="string")return;let t=we(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let i=xi(n,yi(e));return`${Be(r)?"abs:":"path:"}${r}:${String(i)}`}function Tn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=we(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Ve(r.path))return{action:"keep",reason:"refused"};let i=Rn(e,t);return i===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:i}}function oe(e,n){n===void 0?console.warn(`[${J}] ${e}`):console.warn(`[${J}] ${e}`,n)}function hi(e){console.debug(`[${J}] ${e}`)}function kn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Sn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function pe(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function wt(e){return pe(()=>e.sidebarRightTabs,kn)??pe(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,kn)}function kt(e){return pe(()=>e.sidebarRight,Sn)??pe(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Sn)}function St(e){return typeof e=="function"?e:()=>{}}var vi="dsh-resource://file/session/probe/src/main.ts";function bi(e){let n=pe(()=>(typeof e.candidates=="function"?e.candidates(vi):[]).filter(r=>r.priority==="extension"&&r.id!==bn),t=>Array.isArray(t)&&t.length>0);n!==void 0&&oe(`another extension-band tab type already claims ${Rt}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function wi(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ki(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Si(e,n){let t=e.viewFocus;if(t?.request?.(G,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(G,n);return(!r.opened||r.focused)&&t?.take(G),r}return typeof e.openView=="function"&&e.openView(G,n)?(t?.take(G),{opened:!0,focused:!0}):(t?.take(G),{opened:!1,focused:!1})}function Pn(e,n,t,r){let i;try{i=Si(e,r)}catch(o){return oe("the file workbench threw while switching views",o),e.viewFocus?.take(G),!1}if(!i.opened)return oe(`the file workbench did not switch to ${G}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(o){return oe("the forwarded tab could not be closed",o),!1}}function Ri(e,n){function t({useTabInfo:r}){let o=r()?.tab,l=typeof o?.id=="string"&&o.id!==""?o.id:void 0,u=wi(o),s=ki(o),a=(0,ve.useRef)(void 0);return(0,ve.useEffect)(()=>{if(l===void 0){oe("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(a.current===l)return;a.current=l;let d=Tn(u,e.currentSessionId(),s);if(d.action!=="open"){oe(`left the forwarded tab standing (${d.reason})`,u);return}Pn(e,n,l,d.focus)},[l,u,s]),null}return function(i){return typeof i.useTabInfo!="function"?(oe(`the host did not inject useTabInfo into ${wn}; the bridge cannot forward`),null):(0,ve.createElement)(t,{useTabInfo:i.useTabInfo})}}function En(e,n){let t=(u,s)=>{if(u===void 0||s===void 0)return;bi(u);let a;try{a=u.register({id:bn,kind:ci,patterns:[Rt],priority:"extension",canOpen:g=>{let b=we(g);return b!==null&&Ve(b.path)},title:g=>ie(we(g)?.path??g)||g})}catch(g){oe("the sidebar right refused the address bridge tab type",g);return}let d=Ri(n,s),f;try{f=St(e.slots.inject(wn,()=>e.slots.register({name:wn,key:bn},d)))}catch(g){a(),oe("the sidebar right refused the address bridge body",g);return}return()=>{f(),a()}},r=wt(e),i=kt(e);if(r!==void 0&&i!==void 0)return t(r,i)??(()=>{});let o=e.inject;if(typeof o!="function")return hi("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let l=o.call(e,["sidebarRightTabs","sidebarRight"],u=>{let s=pe(()=>u.get?.("sidebarRightTabs"),kn)??wt(u),a=pe(()=>u.get?.("sidebarRight"),Sn)??kt(u);return t(s,a)});return St(l)}var Cn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Fn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function Ln(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Cn:Fn)["tab.label"]??"Files"}var qe=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ti(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Tt(e,n,t=Ti()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,i=r.includes("meta")||r.includes("primary")&&t==="mac",o=r.includes("control")||r.includes("primary")&&t!=="mac",l=r.includes("alt"),u=r.includes("shift");return e.metaKey===!0===i&&e.ctrlKey===!0===o&&e.altKey===!0===l&&e.shiftKey===!0===u}function Pt(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Pi(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Nn(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Ue(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Pi(n),e.onClose?.()}}function Ct(e){let n=ie(e);return n===""?e:n}function Xe(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Ei=Object.freeze({panels:Object.freeze([]),active:null});function Et(e,n){return n===void 0?e:`git:${n}:${e}`}var Ci=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Mn(){let e=[],n=null,t=Ei,r=new Set,i=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let a of[...r])a()},o=a=>e.findIndex(d=>d.key===a),l=a=>e.findIndex(d=>d.revision===void 0&&d.key===a),u=a=>{if(typeof a!="string")return;if(o(a)>=0)return a;let d=Ci.exec(a);if(d!==null){let b=(d[1]??"").toLowerCase(),R=Xe(d[2]??"",!1);if(R===void 0)return;let T=Et(R,b);return o(T)>=0?T:void 0}let f=Xe(a,!0);if(f===void 0)return;if(l(f)>=0)return f;let g=Xe(a,!1);if(!(g===void 0||g===f))return l(g)>=0?g:void 0},s=a=>{if(e.length===0)return;let d=n===null?-1:o(n),f=e[(d+a+e.length)%e.length];f===void 0||f.key===n||(n=f.key,i())};return{open(a,d=1,f=!1,g){let b=Xe(a,f);if(b===void 0)return;let R=typeof g=="string"&&g.trim()!==""?g.trim().toLowerCase():void 0,T=Et(b,R),E=Number.isFinite(d)&&d>0?Math.trunc(d):1,I=o(T);if(I>=0){let W=e[I],D=W!==void 0&&(W.line!==E||W.absolute!==f);if(D&&(e=e.map((Q,te)=>te===I?{...Q,line:E,absolute:f}:Q)),n===T){D&&i();return}n=T,i();return}let j=n===null?e.length:o(n)+1,L={key:T,path:b,line:E,absolute:f,...R===void 0?{}:{revision:R}};e=[...e.slice(0,j),L,...e.slice(j)],n=T,i()},close(a){let d=a===void 0?n:u(a)??null;if(d===null)return;let f=o(d);f<0||(e=e.filter(g=>g.key!==d),n===d&&(n=(e[f]??e[f-1])?.key??null),i())},activate(a){let d=u(a);d===void 0||o(d)<0||n===d||(n=d,i())},next(){s(1)},previous(){s(-1)},reset(){e.length===0&&n===null||(e=[],n=null,i())},isOpen(a){let d=u(a);return d!==void 0&&o(d)>=0},activeEntry(){return e.find(a=>a.key===n)},snapshot:()=>t,subscribe(a){return r.add(a),()=>{r.delete(a)}}}}function Ft(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let i=Mn();return e.set(t,i),i}}}function Re(e,n){let t=Ke(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var Lt=require("react");function K(e,n,...t){let r=t.filter(l=>l!=null&&l!==!1),i=(0,Lt.createElement)(e,n??void 0,...r);if(i!==null&&typeof i=="object")return i;let o={...n??{}};return r.length===1?o.children=r[0]:r.length>1&&(o.children=r),{type:e,props:o,key:null}}function Fi(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Li=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function me(e){let n=[],t=0;for(let r of e.matchAll(Li)){let i=r.index??0;i>t&&n.push(e.slice(t,i));let o=r[0];if(o.startsWith("`"))n.push(K("code",null,o.slice(1,-1)));else if(o.startsWith("**")||o.startsWith("__"))n.push(K("strong",null,...me(o.slice(2,-2))));else if(o.startsWith("~~"))n.push(K("del",null,...me(o.slice(2,-2))));else if(o.startsWith("*")||o.startsWith("_"))n.push(K("em",null,...me(o.slice(1,-1))));else{let l=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(o),u=l?.[1]??o,s=l===null?void 0:Fi(l[2]??"");n.push(s===void 0?u:K("a",{href:s,rel:"noreferrer noopener"},u))}t=i+o.length}return t<e.length&&n.push(e.slice(t)),n}var Nt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Mt=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,It=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,In=/^\s{0,3}>\s?(.*)$/u,An=/^\s{0,3}[-*+]\s+(.*)$/u,jn=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Ni(e){return Nt.test(e)||Mt.test(e)||It.test(e)||In.test(e)||An.test(e)||jn.test(e)}function At(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let i=Nt.exec(r);if(i!==null){let a=(i[1]??"```").slice(0,1),d=i[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${a}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(K("pre",null,K("code",d===""?null:{className:`language-${d}`},f.join(`
`))));continue}let o=Mt.exec(r);if(o!==null){let a=(o[1]??"#").length;n.push(K(`h${String(a)}`,null,...me(o[2]??""))),t+=1;continue}if(It.test(r)){n.push(K("hr",null)),t+=1;continue}if(In.test(r)){let a=[];for(;t<e.length;){let d=In.exec(e[t]??"");if(d===null)break;a.push(d[1]??""),t+=1}n.push(K("blockquote",null,...At(a)));continue}if(An.exec(r)!==null){let a=[];for(;t<e.length;){let d=An.exec(e[t]??"");if(d===null)break;a.push(K("li",null,...me(d[1]??""))),t+=1}n.push(K("ul",null,...a));continue}if(jn.exec(r)!==null){let a=[];for(;t<e.length;){let d=jn.exec(e[t]??"");if(d===null)break;a.push(K("li",null,...me(d[1]??""))),t+=1}n.push(K("ol",null,...a));continue}let s=[r.trim()];for(t+=1;t<e.length;){let a=e[t]??"";if(a.trim()===""||Ni(a))break;s.push(a.trim()),t+=1}n.push(K("p",null,...me(s.join(" "))))}return n}function Ye(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return K("div",{className:"fx-md"},...At(n))}var Dn=200,Mi={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Ee(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Mi[t.slice(r+1)]??"plaintext"}function Ze(e){return Ee(e)==="markdown"}var V=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Te(e){return e!==null&&typeof e=="object"}function Ii(e){return e===""?0:e.split(`
`).length}function Wn(e,n){if(!Te(e))throw new V("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let a=Te(e.error)?e.error:{},d=typeof a.code=="string"?a.code:"preview/unknown",f=typeof a.message=="string"?a.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",g=Te(a.details)?a.details:{},b=typeof g.kind=="string"?g.kind:"";throw new V(d,f,b)}let t=e.ok===!0?e.value:e;if(!Te(t)||typeof t.text!="string")throw new V("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ii(t.text),i=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,o=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,l=t.eof===!0||i!==void 0&&r>0&&o+r-1>=i,u=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,s={text:t.text,lines:r,offset:o,eof:l,...u===void 0?{}:{source:u}};return i===void 0?s:{...s,totalLines:i}}function Ce(e){let n=Te(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",i=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=`${t} ${r} ${i}`.toLowerCase();return o.includes("symlink")?{kind:"symlink",code:t,message:i}:o.includes("git/submodule")||o.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:i}:o.includes("git/binary")||o.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:i}:o.includes("eacces")||o.includes("eperm")||o.includes("permission")||o.includes("denied")||o.includes("forbidden")||o.includes("\u6743\u9650")?{kind:"denied",code:t,message:i}:o.includes("not-found")||o.includes("not_found")||o.includes("enoent")||o.includes("no such file")||o.includes("deleted")||o.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:i}:o.includes("not-regular-file")||o.includes("not a regular file")?{kind:"binary",code:t,message:i}:o.includes("not-text")||o.includes("utf-8")||o.includes("binary")?{kind:"binary",code:t,message:i}:o.includes("too-large")||o.includes("too large")||o.includes("maxbytes")?{kind:"too-large",code:t,message:i}:o.includes("unavailable")?{kind:"unavailable",code:t,message:i}:{kind:"unknown",code:t,message:i}}var Pe=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Je({files:e,maxLines:n=Dn}){let t=Math.max(1,Math.trunc(n)),r=Pe,i=0,o=null,l=[1],u=new Set,s=d=>{r=d;for(let f of u)f()},a=async(d,f)=>{i+=1;let g=i;o?.abort();let b=new AbortController;o=b,s({status:"loading",path:d,text:r.path===d?r.text:"",offset:f,lines:r.path===d?r.lines:0,...r.path===d&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===d&&r.source!==void 0?{source:r.source}:{},eof:r.path===d?r.eof:!1});try{let R=await e.read(d,f>1?{offset:f,limit:t}:{limit:t},b.signal);if(g!==i)return;let T=Wn(R,f);if(T.lines===0&&f>1){s({...r,status:"ready",eof:!0,text:"",lines:0});return}let E={status:"ready",path:d,text:T.text,offset:T.offset,lines:T.lines,eof:T.eof,...T.source===void 0?{}:{source:T.source}};s(T.totalLines===void 0?E:{...E,totalLines:T.totalLines})}catch(R){if(g!==i||b.signal.aborted)return;s({status:"failed",path:d,text:"",offset:f,lines:0,eof:!1,failure:Ce(R)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(d){return u.add(d),()=>{u.delete(d)}},async open(d){l=[1],await a(d,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let d=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&d>r.totalLines||(l.push(d),await a(r.path,d))},async prev(){if(r.path===void 0||l.length<=1)return;l=l.slice(0,-1);let d=l[l.length-1]??1;await a(r.path,d)},async retry(){r.path!==void 0&&await a(r.path,r.offset)},close(){i+=1,o?.abort(),o=null,l=[1],s(Pe)}}}function Qe(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var zn=Object.freeze({chunk:yn.chunk,id:`${J}/${yn.chunk}`}),_n=null,Fe=null,en=new Map;function jt(e){_n=e}function Dt(){return zn}function Ai(e){let n=it[e];return{chunk:n,id:`${J}/${n}`}}function Wt(){if(Fe!==null)return Fe;let e=_n;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${J}: the loader require was not handed over`));let n=e.async(`./${zn.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${J}: chunk ${zn.id} is missing its preview renderers`);return r});return Fe=n,n.catch(()=>{Fe===n&&(Fe=null)}),n}function zt(e){let n=en.get(e);if(n!==void 0)return n;let t=_n;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${J}: the loader require was not handed over`));let r=Ai(e),i=t.async(`./${r.chunk}`).then(o=>{let l=o;if(l===null||typeof l.FamilyView!="function"||l.renderer!==e)throw new Error(`${J}: chunk ${r.id} is not the ${e} view`);return l});return en.set(e,i),i.catch(()=>{en.get(e)===i&&en.delete(e)}),i}var _t="dsh-fs-explorer-styles",ji=`
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
`;function Ot(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${_t}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=_t,t.textContent=ji,e.head.appendChild(t),()=>{t.remove()}}var h=require("react");var On="fs-explorer.treePaneWidth";function Bn(e){return Math.min(520,Math.max(180,e))}function $t(e){if(e==null)return null;let n;try{n=e.getItem(On)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function nn(e,n){let t=Math.round(Bn(n));if(e!=null)try{e.setItem(On,String(t))}catch{}return t}function Kt(e){if(e!=null)try{e.removeItem(On)}catch{}}function Ht(e,n){return Math.round(e)===Math.round(n)}var Bt=16;function Gt(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Bt};case"ArrowRight":return{kind:"nudge",delta:Bt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var tn=require("react");var M=require("react/jsx-runtime");function Vt({panels:e,active:n,t,onActivate:r,onClose:i,onStep:o}){let l=(0,tn.useRef)(null);if((0,tn.useEffect)(()=>{l.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]),e.length===0)return null;let u=s=>{if(s.key==="ArrowRight"||s.key==="ArrowLeft"){s.preventDefault(),s.stopPropagation(),o(s.key==="ArrowRight"?1:-1);return}(s.key==="Delete"||s.key==="Backspace")&&n!==null&&(s.preventDefault(),s.stopPropagation(),i(n))};return(0,M.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:u,"data-testid":"fs-tabs",children:e.map((s,a)=>{let d=s.key===n,f=Ct(s.path),g=t("panel.close").replace("{name}",f);return(0,M.jsxs)("div",{className:"fx-tab","data-active":d?"true":"false",role:"presentation",children:[(0,M.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${a}`,"aria-controls":`fx-panel-${a}`,"aria-selected":d,tabIndex:d?0:-1,title:s.path,"data-testid":"fs-tab","data-path":s.path,"data-key":s.key,ref:d?l:void 0,onClick:()=>r(s.key),children:[(0,M.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":xe(s.path),"aria-hidden":"true",children:he(s.path)}),(0,M.jsx)("span",{className:"fx-tab-name",children:f}),s.revision===void 0?null:(0,M.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:s.revision,children:s.revision.slice(0,7)})]}),(0,M.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:d?0:-1,"aria-label":g,title:g,"data-testid":"fs-tab-close",onClick:()=>i(s.key),children:"\xD7"})]},s.key)})})}function Di(){return(0,M.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,M.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,M.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,M.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function qt({t:e}){return(0,M.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,M.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,M.jsx)(Di,{})}),(0,M.jsx)("strong",{children:e("panel.empty.title")}),(0,M.jsx)("span",{children:e("panel.empty.description")}),(0,M.jsxs)("span",{className:"fx-empty-keys",children:[(0,M.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,M.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,M.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,M.jsx)("span",{children:e("panel.empty.keys")})]})]})}var P=require("react");async function Ut(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var ae=require("react/jsx-runtime");function Wi(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function zi(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function $n({failure:e,t:n,onRetry:t}){return(0,ae.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,ae.jsx)("strong",{children:Wi(e,n)}),(0,ae.jsx)("span",{children:zi(e,n)}),e.message===""?null:(0,ae.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,ae.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function Kn({t:e}){return(0,ae.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,ae.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}function rn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function le(e){try{return e()}catch{return}}function Qt(e){return()=>{let n=le(()=>e.workspaceFiles);if(rn(n))return n;let t=le(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(rn(t))return t;let r=le(()=>e.remote?.workspaceFiles);if(rn(r))return r;let i=le(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(rn(i))return i}}function er(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,i,o){return t.call(e,n,r,i,o)}}}function Xt(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function nr(e){return()=>{let n=le(()=>e.remote?.gitExplorer);if(Xt(n))return n;let t=le(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Xt(t)?t:void 0}}function _i(e){return e===""?0:e.split(`
`).length}function Yt(e){let n=ce(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new V(t,r)}function tr(e,n,t){return{async read(r,i,o){let l={sessionId:n,hash:t,path:r,...i.offset===void 0?{}:{offset:i.offset},...i.limit===void 0?{}:{limit:i.limit}},u=await e.show(l,o);if(!ce(u))throw new V("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw Yt(u.error);let s=u;if(u.ok===!0&&(s=u.value),!ce(s))throw new V("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(s.ok===!1)throw Yt(s.error);let a=s;if(s.ok===!0&&(a=s.page),!ce(a))throw new V("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(a.kind==="submodule")throw new V("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(a.binary===!0||a.kind==="binary")throw new V("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof a.text!="string")throw new V("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let d=typeof a.lines=="number"&&Number.isFinite(a.lines)?Math.max(0,Math.trunc(a.lines)):_i(a.text),f=typeof a.offset=="number"&&Number.isFinite(a.offset)&&a.offset>0?Math.trunc(a.offset):i.offset??1,g=a.source==="first-parent"?"first-parent":a.source==="commit"?"commit":void 0;return{text:a.text,lines:d,offset:f,eof:a.eof===!0,...g===void 0?{}:{source:g}}}}}function ce(e){return e!==null&&typeof e=="object"}function Oi(e){if(!ce(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=ce(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Bi(e){let n=ce(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=ce(n.details)?n.details:{},o=typeof i.kind=="string"?i.kind:"";return new V(t,r,o)}function rr(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,i)=>{let o=Oi(await n.call(e,t,r,{},i));if(!o.ok)throw Bi(o.error);return o.value.data}}function Le(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Hn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function on(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Le(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Hn(r.value):{ok:!1,message:Le(r.error)}}return Hn(t)}return Hn(n)}function ir(e){return e instanceof Error?e.message:Le(e)}function Zt(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function or(e){return()=>{let n=le(()=>e.remote?.gitExplorer);if(Zt(n))return n;let t=le(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Zt(t))return t}}function Jt(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function $i(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let i=Jt(r.additions),o=Jt(r.deletions);i===void 0||o===void 0||n.push({path:r.path,additions:i,deletions:o})}return n}function Ki(e){if(e===null||typeof e!="object")return;let n=e,t=l=>typeof l=="number"&&Number.isFinite(l)&&l>=0?l:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,i=t(n.ahead),o=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...i===void 0?{}:{ahead:i},...o===void 0?{}:{behind:o}}}function Gn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=$i(n.stats),r=Ki(n.head),i=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...i===void 0?{}:{root:i}}}function an(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Le(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let i=t;return i.ok?Gn(i.snapshot):{ok:!1,message:Le(i.error)}}let r=e;return r.snapshot!==void 0?Gn(r.snapshot):Gn(t)}var w=require("react/jsx-runtime");function Hi({chunk:e,text:n,path:t,offset:r}){let i=(0,P.useRef)(null),o=(0,P.useRef)(null),[l,u]=(0,P.useState)(!1),s=Ee(t);return(0,P.useEffect)(()=>{u(!1)},[e,t]),(0,P.useEffect)(()=>{let a=i.current;if(!(e===null||a===null))try{let d=e.mountCodePreview(a,{text:n,language:s,path:t,offset:r});return o.current=d,()=>{d.destroy(),o.current=null}}catch{u(!0);return}},[e,t,s]),(0,P.useEffect)(()=>{o.current?.update(n,r)},[n,r,e]),e===null||l?(0,w.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,w.jsx)("div",{className:"fx-code-host",ref:i,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function ar({sessionId:e,files:n,path:t,revision:r,git:i,t:o,visible:l=!0}){let u=(0,P.useMemo)(()=>r===void 0?er(n,e):i===void 0||e===void 0?void 0:tr(i,e,r),[n,e,r,i]),s=(0,P.useMemo)(()=>r===void 0?rr(n):void 0,[n,r]),a=t===void 0?null:mn(t),[d,f]=(0,P.useState)(null),[g,b]=(0,P.useState)(Pe),[R,T]=(0,P.useState)(null),[E,I]=(0,P.useState)(null),[j,L]=(0,P.useState)(null),[W,D]=(0,P.useState)(0),[Q,te]=(0,P.useState)("reading"),[ue,q]=(0,P.useState)(!1),p=(0,P.useRef)(void 0);if((0,P.useEffect)(()=>{if(u===void 0){f(null);return}let z=Je({files:u,maxLines:Dn});return f(z),()=>z.close()},[u]),(0,P.useEffect)(()=>{if(d===null){b(Pe);return}return b(d.getSnapshot()),d.subscribe(()=>b(d.getSnapshot()))},[d]),(0,P.useEffect)(()=>{d===null||t===void 0||a!==null||d.open(t)},[d,t,a]),(0,P.useEffect)(()=>{te("reading"),q(!1)},[t]),(0,P.useEffect)(()=>()=>{p.current!==void 0&&clearTimeout(p.current)},[]),(0,P.useEffect)(()=>{if(t===void 0||a!==null)return;let z=!0;return Wt().then(Z=>{z&&T(Z)}).catch(()=>{z&&T(null)}),()=>{z=!1}},[t,a]),(0,P.useEffect)(()=>{if(a===null||r!==void 0)return;let z=!0;return I(null),L(null),zt(a).then(Z=>{z&&I(Z)}).catch(Z=>{z&&L(Ce(Z))}),()=>{z=!1}},[a,W]),t===void 0)return(0,w.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,w.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,w.jsx)("strong",{children:o("preview.empty.title")}),(0,w.jsx)("span",{children:o("preview.empty.description")})]})});let m=a!==null,x=m&&r!==void 0,_=r===void 0&&e!==void 0&&s!==void 0?{sessionId:e,readFile:s}:null,U=m&&!x&&_===null,X=Qe(g),se=!m&&Ze(t),ee=m?!x&&!U&&E===null&&j===null:g.status==="loading",B=g.status==="ready",Y=se&&Q==="reading",C=m?x||U?"unavailable":j!==null?"failed":E===null?"loading":"ready":g.status,A=()=>{Ut(t).then(z=>{z&&(q(!0),p.current!==void 0&&clearTimeout(p.current),p.current=setTimeout(()=>q(!1),1400))})},H;return m?H=x?(0,w.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,w.jsx)("strong",{children:o("preview.commitBinary.title")}),(0,w.jsx)("span",{children:o("preview.commitBinary.description")})]}):_===null?(0,w.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,w.jsx)("strong",{children:o("preview.unavailable.title")}),(0,w.jsx)("span",{children:o("preview.unavailable.description")})]}):j!==null?(0,w.jsx)($n,{failure:j,t:o,onRetry:()=>D(z=>z+1)}):E===null?(0,w.jsx)(Kn,{t:o}):(0,w.jsx)(E.FamilyView,{path:t,sessionId:_.sessionId,readFile:_.readFile,t:o,visible:l}):u===void 0?H=(0,w.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,w.jsx)("strong",{children:o("preview.unavailable.title")}),(0,w.jsx)("span",{children:o("preview.unavailable.description")})]}):g.status==="failed"?H=(0,w.jsx)($n,{failure:g.failure??{kind:"unknown",code:"",message:""},t:o,onRetry:()=>{d?.retry()}}):B?Y?H=R===null?(0,w.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Ye(g.text)}):(0,w.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,w.jsx)(R.MarkdownView,{text:g.text})}):H=(0,w.jsx)(Hi,{chunk:R,text:g.text,path:t,offset:g.offset}):H=(0,w.jsx)(Kn,{t:o}),(0,w.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":C,"data-mode":m?"binary":Y?"reading":"code","data-renderer":m?E?.renderer??"pending":Y?R===null?"fallback":"gfm":R?.renderer??"plain",children:[(0,w.jsxs)("header",{className:"fx-preview-bar",children:[(0,w.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),m?null:(0,w.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:o("preview.range"),children:[X.range,X.range==="\u2014"?null:(0,w.jsxs)(w.Fragment,{children:[" ",o("preview.lines")]}),X.total===void 0?null:(0,w.jsxs)("span",{className:"fx-preview-total",children:[" / ",X.total," ",o("preview.lines")]})]}),(0,w.jsxs)("div",{className:"fx-preview-actions",children:[se?(0,w.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>te(z=>z==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:o(Q==="reading"?"preview.source":"preview.reading")}):null,m?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!B||ee||g.offset<=1,onClick:()=>{d?.prev()},"data-testid":"fs-preview-prev",children:o("preview.prev")}),(0,w.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!B||ee||g.eof,onClick:()=>{d?.next()},"data-testid":"fs-preview-next",children:o("preview.next")})]}),(0,w.jsx)("button",{type:"button",className:"fx-pbtn",onClick:A,"data-testid":"fs-preview-copy",children:o(ue?"preview.copied":"preview.copyPath")}),ee?(0,w.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),g.source==="first-parent"?(0,w.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:o("preview.deletedCommit")}):null,(0,w.jsx)("div",{className:"fx-preview-body","data-scroll":Y?"y":"none",children:H})]})}var F=require("react");function dr(e,n,t,r=800){return t-n<=r?e:""}function lr(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let i=e[r];if(i?.type==="entry"&&i.depth<t.depth)return i.path}return""}function cr(e,n){if(n===""){let i=[];for(let o=0;o<e.length;o+=1){let l=e[o];l?.type==="entry"&&l.depth===0&&i.push(o)}return i}let t=e.findIndex(i=>i.type==="entry"&&i.path===n),r=e[t];return r?.type!=="entry"?[]:Gi(e,t+1,r.depth,r.depth+1)}function Gi(e,n,t,r){let i=[];for(let o=n;o<e.length;o+=1){let l=e[o];if(l?.type==="entry"){if(l.depth<=t)break;l.depth===r&&i.push(o)}}return i}var Vi=/^.$/u;function ur(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Vi.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let l=sr(e.names,n),u=l.find(s=>s>e.active)??l[0];return u===void 0?{kind:"miss"}:{kind:"jump",index:u,query:n}}let t=`${e.query}${n}`,r=sr(e.names,t);if(r.length===0)return{kind:"miss"};let o=(r.includes(e.active)?e.active:void 0)??r.find(l=>l>e.active)??r[0];return o===void 0?{kind:"miss"}:{kind:"jump",index:o,query:t}}function sr(e,n){let t=n.toLowerCase(),r=[];for(let i=0;i<e.length;i+=1){let o=e[i];o!==void 0&&o.toLowerCase().startsWith(t)&&r.push(i)}return r}var k=require("react/jsx-runtime"),ge=22;function Vn({open:e=!0,size:n=14}){return(0,k.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,k.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,k.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function qi(){return(0,k.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,k.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function fr(){return(0,k.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,k.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,k.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function pr(){return(0,k.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,k.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Ui({name:e}){return(0,k.jsx)("span",{className:"fx-badge","data-icon":xe(e),"aria-hidden":"true",children:he(e)})}function Xi({row:e,selected:n,cursor:t,top:r,t:i,onToggle:o,onSelect:l,onRowActivate:u}){let s=e.kind==="directory",a={top:r,paddingLeft:8+e.depth*12};return(0,k.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:a,onClick:()=>{u(e.path),s?o(e.path):l(e.path)},children:[(0,k.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,k.jsx)(qi,{})}),s?(0,k.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,k.jsx)(Vn,{open:e.expanded})}):(0,k.jsx)(Ui,{name:e.name}),(0,k.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,k.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:i(`tag.${e.tag}`),"aria-label":i(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,k.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":ke(e.status),"data-testid":"fx-file-status",title:i(xn(e.status)),"aria-label":i(xn(e.status)),children:je(e.status)}),e.statusCount===void 0?null:(0,k.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:i("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,k.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,k.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,k.jsx)("span",{className:"fx-diff-bin",children:i("row.binary")}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,k.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,k.jsx)("span",{className:"fx-size",children:Ge(e.size)})]})}function Yi({row:e,top:n,t,onRetry:r}){let i=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,k.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,k.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,k.jsx)("span",{className:"fx-status-text",title:i,children:i}),e.state==="truncated"?(0,k.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,k.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Zi(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function mr({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:i,onSelect:o,onRetry:l,onEntryFocusSettled:u}){let s=(0,F.useRef)(null),[a,d]=(0,F.useState)(0),[f,g]=(0,F.useState)(0),[b,R]=(0,F.useState)(void 0),T=(0,F.useRef)(void 0),E=(0,F.useRef)({query:"",at:0}),I=(0,F.useRef)(void 0),j=(0,F.useRef)(void 0),L=(0,F.useRef)(b);L.current=b;let W=(0,F.useMemo)(()=>e.flatMap((p,m)=>p.type==="entry"?[m]:[]),[e]);(0,F.useEffect)(()=>{let p=j.current!==n;if(j.current=n,I.current!==void 0||n===void 0)return;let m=L.current===void 0?void 0:e[L.current];if(!ht({cursorPath:m?.type==="entry"?m.path:void 0,selectionMoved:p}))return;let x=e.findIndex(_=>_.type==="entry"&&_.path===n);x>=0&&R(x)},[n,e]),(0,F.useEffect)(()=>{let p=I.current;if(p===void 0)return;let m=e.findIndex(U=>U.type==="entry"&&U.path===p),x=e[m];if(x?.type!=="entry"||x.kind!=="directory"||!x.expanded){I.current=void 0;return}let _=vt(e,p);_!==void 0&&(I.current=void 0,R(_))},[e]),(0,F.useEffect)(()=>{b!==void 0&&e[b]?.type!=="entry"&&R(void 0)},[e,b]),(0,F.useEffect)(()=>{let p=s.current;if(b===void 0||p===null)return;let m=vn({scrollTop:p.scrollTop,viewport:p.clientHeight,rowHeight:ge,index:b});m!==p.scrollTop&&(p.scrollTop=m)},[b]);let D=(0,F.useCallback)(p=>{R(p),s.current?.focus({preventScroll:!0})},[]),Q=(0,F.useCallback)(p=>{let m=e.findIndex(x=>x.type==="entry"&&x.path===p);m>=0&&R(m)},[e]),te=(0,F.useCallback)(p=>{if(p.nativeEvent.isComposing||p.altKey||p.metaKey||p.ctrlKey)return;let m=W.at(-1);if(p.key==="ArrowDown"){if(p.preventDefault(),b===void 0){W[0]!==void 0&&D(W[0]);return}let C=W.find(A=>A>b);C!==void 0&&D(C);return}if(p.key==="ArrowUp"){if(p.preventDefault(),b===void 0){m!==void 0&&D(m);return}let C=[...W].reverse().find(A=>A<b);C!==void 0&&D(C);return}if(b===void 0)return;let x=e[b];if(x===void 0||x.type!=="entry")return;if(p.key==="ArrowRight"){if(p.preventDefault(),x.kind==="directory"&&!x.expanded)I.current=x.path,i(x.path);else{let C=W.find(A=>A>b);C!==void 0&&e[C]?.depth===x.depth+1&&D(C)}return}if(p.key==="ArrowLeft"){if(p.preventDefault(),x.kind==="directory"&&x.expanded)i(x.path);else{let C=[...W].reverse().find(A=>A<b&&e[A]?.type==="entry"&&e[A].depth<x.depth);C!==void 0&&D(C)}return}if(p.key==="Enter"&&x.kind!=="directory"){p.preventDefault(),o(x.path);return}if(p.key==="Home"){p.preventDefault(),W[0]!==void 0&&D(W[0]);return}if(p.key==="End"){p.preventDefault(),m!==void 0&&D(m);return}let _=Date.now(),U=lr(e,b),X=cr(e,U),se=X.map(C=>{let A=e[C];return A?.type==="entry"?A.name:""}),ee=ur({query:dr(E.current.query,E.current.at,_),key:p.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:p.nativeEvent.repeat,names:se,active:b===void 0?-1:X.indexOf(b)});if(ee.kind==="clear"){E.current={query:"",at:0};return}if(ee.kind!=="jump")return;let B=X[ee.index];if(B===void 0)return;let Y=e[B];Y?.type==="entry"&&(E.current={query:ee.query,at:_},p.preventDefault(),D(B),Y.kind!=="directory"&&o(Y.path))},[b,W,D,i,o,e]);(0,F.useEffect)(()=>{let p=s.current;if(p===null)return;let m=()=>g(p.clientHeight);if(m(),typeof ResizeObserver>"u")return;let x=new ResizeObserver(m);return x.observe(p),()=>x.disconnect()},[]),(0,F.useEffect)(()=>{if(n===void 0)return;let p=s.current;if(p===null)return;let m=e.findIndex(_=>_.type==="entry"&&_.path===n);if(m<0)return;let x=m*ge;(x<p.scrollTop||x+ge>p.scrollTop+p.clientHeight)&&(p.scrollTop=Math.max(0,x-p.clientHeight/2))},[n,e]),(0,F.useEffect)(()=>{if(t===void 0||T.current===t)return;let p=s.current;if(p===null)return;let m=t.path===void 0?-1:e.findIndex(x=>x.type==="entry"&&x.path===t.path);if(!(t.path!==void 0&&m<0)){if(T.current=t,m>=0){let x=vn({scrollTop:p.scrollTop,viewport:p.clientHeight===0?480:p.clientHeight,rowHeight:ge,index:m});x!==p.scrollTop&&(p.scrollTop=x,d(x)),R(m)}Zi(p),u?.()}},[t,e,u]);let ue=p=>{d(p.currentTarget.scrollTop)},q=_e(e,{scrollTop:a,height:f===0?480:f,rowHeight:ge});return(0,k.jsx)("div",{className:"fx-scroll",ref:s,onScroll:ue,onKeyDown:te,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,k.jsx)("div",{className:"fx-vlist",style:{height:e.length*ge},children:q.rows.map((p,m)=>{let x=(q.startIndex+m)*ge;return p.type==="entry"?(0,k.jsx)(Xi,{row:p,top:x,selected:p.path===n,cursor:b===q.startIndex+m,t:r,onToggle:i,onSelect:o,onRowActivate:Q},p.path):(0,k.jsx)(Yi,{row:p,top:x,t:r,onRetry:l},p.key)})})})}var v=require("react/jsx-runtime");var Ji=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Qi(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var eo=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,yr=new Map;function no(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function sn({title:e,description:n,actionLabel:t,onAction:r,testId:i}){return(0,v.jsxs)("div",{className:"fx-empty",role:"note","data-testid":i??"fs-state",children:[(0,v.jsx)("strong",{children:e}),n===void 0?null:(0,v.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,v.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function xr({workbench:e,version:n,t,files:r,status:i,git:o=()=>{}}){let l=Ft();function u(s){let a=s.sessionId??e.currentSessionId(),d=(0,h.useRef)(a);d.current=a;let f=(0,h.useMemo)(()=>r(),[r]),g=(0,h.useMemo)(()=>i(),[i]),b=(0,h.useMemo)(()=>o(),[o]),[R,T]=(0,h.useState)(()=>new Map),[E,I]=(0,h.useState)(void 0),[j,L]=(0,h.useState)(void 0),[W,D]=(0,h.useState)(void 0),[Q,te]=(0,h.useState)(yr),ue=(0,h.useRef)(R);ue.current=R;let[q,p]=(0,h.useState)(()=>new Set),m=(0,h.useMemo)(()=>l.forSession(a),[l,a]),x=(0,h.useSyncExternalStore)(m.subscribe,m.snapshot,m.snapshot),_=x.panels.find(c=>c.key===x.active),U=_?.path,X=_?.revision,[se,ee]=(0,h.useState)(0),B=(0,h.useRef)(new Map),Y=(0,h.useRef)(void 0),C=(0,h.useMemo)(()=>Qi(),[]),[A,H]=(0,h.useState)(()=>$t(C)),z=(0,h.useRef)(null),Z=(0,h.useRef)(null),O=R.get(""),Ne=O?.status==="ready",Me=(0,h.useCallback)((c,y,S,N)=>{m.open(c,y,S,N)},[m]),de=(0,h.useCallback)(async(c,y,S)=>{B.current.get(c)?.abort();let N=new AbortController;B.current.set(c,N),T(ne=>new Map(ne).set(c,Ji()));try{let ne=await S.list(y,Oe(c),N.signal);if(N.signal.aborted||d.current!==y)return!1;let $=on(ne);if(!$.ok)return T(re=>new Map(re).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:$.message})),!1;let ye=ze($.listing.entries);return T(re=>new Map(re).set(c,{status:"ready",nodes:ye,truncated:$.listing.truncated===!0,total:$.listing.entries.length})),!0}catch(ne){return N.signal.aborted||T($=>new Map($).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:ir(ne)})),!1}finally{B.current.get(c)===N&&B.current.delete(c)}},[]);(0,h.useEffect)(()=>{for(let c of B.current.values())c.abort();return B.current.clear(),T(new Map),p(new Set),Y.current=void 0,a!==void 0&&f!==void 0&&de("",a,f),()=>{for(let c of B.current.values())c.abort();B.current.clear()}},[a,f,se,de]),(0,h.useEffect)(()=>{if(a===void 0||g===void 0){I(void 0),L(void 0),D(void 0);return}let c=!0,y=new AbortController;return I(void 0),L(void 0),D(void 0),Promise.resolve().then(()=>g.snapshot({sessionId:a,maxCommits:1},y.signal)).then(S=>{if(!c)return;let N=an(S);if(!N.ok){I(void 0),L(void 0),D(void 0);return}I(ct(Ae(N.status),N.stats)),L(N.head),D(N.root)}).catch(()=>{c&&(I(void 0),L(void 0),D(void 0))}),()=>{c=!1,y.abort()}},[a,g,se]),(0,h.useEffect)(()=>{let c=f?.read;if(a===void 0||f===void 0||typeof c!="function"||!Ne){te(yr);return}let y=a,S=new AbortController,N=async($,ye)=>{try{let re=no(await c.call(f,y,ye,{},S.signal));return re===void 0?void 0:[$,re]}catch{return}},ne=mt.filter($=>$!==".gitmodules").map($=>N($,$));return W!==void 0&&ne.push(N(".gitmodules",`${W.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(ne).then($=>{if(S.signal.aborted||d.current!==y)return;let ye=new Map;for(let fe of $)fe!==void 0&&ye.set(fe[0],fe[1]);let re=ue.current.get(""),Mr=new Set(re?.status==="ready"?re.nodes.filter(fe=>fe.kind==="directory").map(fe=>fe.name):[]);te(De(ye,Mr))}),()=>S.abort()},[a,f,Ne,W,se]),(0,h.useEffect)(()=>{let c=s.viewRequest;if(c==null||c.view!==G)return;let y=`${c.view}:${c.focus}`;Y.current!==y&&(Y.current=y,Re(c.focus,{open:Me}),s.completeViewRequest?.())},[s.viewRequest,s.completeViewRequest,Me]),(0,h.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||a===void 0)return;let y=()=>{let S=c.take(G);S!==void 0&&Re(S,{open:Me})};return y(),c.subscribe(y)},[e,a,Me]),(0,h.useEffect)(()=>{if(U===void 0||X!==void 0||!Ne||Be(U))return;let c=xt(U);if(c.length===0||(p(S=>c.every(N=>S.has(N))?S:new Set([...S,...c])),a===void 0||f===void 0))return;let y=c.filter(S=>ue.current.get(S)?.status!=="ready");y.length!==0&&Promise.all(y.map(S=>de(S,a,f)))},[U,X,Ne,a,f,de]);let Un=(0,h.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),kr=(0,h.useCallback)(c=>{if(c.button!==0||Z.current!==null||eo())return;let y=z.current?.previousElementSibling;if(y instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}Z.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:y.getBoundingClientRect().width,restWidth:A},document.body.classList.add("fx-pane-resizing")}},[A]),Sr=(0,h.useCallback)(c=>{let y=Z.current;y===null||y.pointerId!==c.pointerId||H(Bn(y.baseWidth+c.clientX-y.startX))},[]),cn=(0,h.useCallback)(c=>{let y=Z.current;if(y===null||y.pointerId!==c.pointerId)return;Z.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let S=y.baseWidth+c.clientX-y.startX;if(Ht(S,y.baseWidth)){H(y.restWidth);return}H(nn(C,S))},[C]),un=(0,h.useCallback)(()=>{Kt(C),H(null)},[C]),Rr=(0,h.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let y=Gt(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(y===null)return;if(c.preventDefault(),c.stopPropagation(),y.kind==="reset"){un();return}if(y.kind==="min"||y.kind==="max"){let ne=y.kind==="min"?180:520;H(nn(C,ne));return}let S=z.current?.previousElementSibling,N=S instanceof HTMLElement?S.getBoundingClientRect().width:A??180;H(nn(C,N+y.delta))},[C,un,A]);(0,h.useEffect)(()=>()=>{Z.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,h.useEffect)(()=>{if(typeof document>"u")return;let c=y=>{if(!(y.isComposing||Pt(y.target))){for(let S of qe)if(Tt(y,S)){if(S.action==="closePanel"&&m.snapshot().active===null)return;y.preventDefault(),y.stopPropagation(),S.action==="nextPanel"?m.next():S.action==="previousPanel"?m.previous():m.close();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[m]),(0,h.useEffect)(()=>{if(typeof document>"u")return;let c=Ue({focusComposer:Un,hasModal:()=>Nn(document)}),y=S=>c(S);return document.addEventListener("keydown",y,!0),()=>document.removeEventListener("keydown",y,!0)},[Un]);let fn=(0,h.useMemo)(()=>He(R,q,E,Q),[R,q,E,Q]),[Tr,Xn]=(0,h.useState)(void 0),Yn=(0,h.useRef)(!1);(0,h.useEffect)(()=>{if(Yn.current||typeof document>"u")return;let c=bt({rows:fn,panelCount:m.snapshot().panels.length,hasModal:Nn(document)});c.kind!=="skip"&&(Yn.current=!0,c.open!==void 0&&m.open(c.open),Xn({path:c.focus}))},[fn,m]);let Pr=(0,h.useCallback)(()=>Xn(void 0),[]),be=E===void 0?void 0:Object.keys(E).length,Er=E===void 0?"neutral":Object.values(E).some(c=>c.status==="conflicted")?"conflict":be===0?"success":"warning",Zn=lt(j),Cr=(0,h.useCallback)(c=>{if(a===void 0||f===void 0)return;if(q.has(c)){p(S=>{let N=new Set(S);return N.delete(c),N});return}p(S=>new Set(S).add(c));let y=R.get(c);(y===void 0||y.status==="failed")&&de(c,a,f)},[q,R,a,f,de]),Jn=(0,h.useCallback)(c=>{a===void 0||f===void 0||de(c,a,f)},[a,f,de]),Fr=()=>p(new Set),Lr=()=>ee(c=>c+1),Nr=a===void 0?"no-session":f===void 0?"no-service":O===void 0||O.status==="loading"?"loading":O.status==="failed"?"failed":O.nodes.length===0?"empty":"tree";return(0,v.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Nr,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,v.jsxs)("header",{className:"fx-head",children:[(0,v.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,v.jsx)(Vn,{open:!0})}),(0,v.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,v.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,v.jsxs)("div",{className:"fx-head-meta",children:[O?.status==="ready"?(0,v.jsxs)("span",{children:[(0,v.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}):null,(0,v.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:q.size===0,onClick:Fr,children:(0,v.jsx)(pr,{})}),(0,v.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:a===void 0||f===void 0||O?.status==="loading",onClick:Lr,children:(0,v.jsx)(fr,{})})]})]}),(0,v.jsx)("div",{className:"fx-main",children:a===void 0?(0,v.jsx)(sn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):f===void 0?(0,v.jsx)(sn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):O===void 0||O.status==="loading"?(0,v.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):O.status==="failed"?(0,v.jsx)(sn,{title:t("state.failed.title"),description:O.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Jn(""),testId:"fs-failed"}):O.nodes.length===0?(0,v.jsx)(sn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("div",{className:"fx-tree-pane",style:A===null?void 0:{"--fx-tree-width":`${A}px`},children:(0,v.jsx)(mr,{rows:fn,selectedPath:X===void 0?U:void 0,entryFocus:Tr,t,onToggle:Cr,onSelect:c=>m.open(c),onRetry:Jn,onEntryFocusSettled:Pr})}),(0,v.jsx)("div",{ref:z,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":A??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:kr,onPointerMove:Sr,onPointerUp:cn,onPointerCancel:cn,onLostPointerCapture:cn,onKeyDown:Rr,onDoubleClick:un}),(0,v.jsxs)("div",{className:"fx-editor",children:[(0,v.jsx)(Vt,{panels:x.panels,active:x.active,t,onActivate:c=>m.activate(c),onClose:c=>m.close(c),onStep:c=>c===1?m.next():m.previous()}),(0,v.jsx)("div",{className:"fx-editor-body",children:x.panels.length===0?(0,v.jsx)(qt,{t}):x.panels.map((c,y)=>{let S=c.key===x.active;return(0,v.jsx)("div",{className:"fx-panel",id:`fx-panel-${y}`,role:"tabpanel","aria-labelledby":`fx-tab-${y}`,hidden:!S,"data-line":c.line,"data-testid":"fs-panel",children:(0,v.jsx)(ar,{sessionId:a,files:f,path:c.path,revision:c.revision,git:b,t,visible:S})},c.key)})})]})]})}),O?.status==="ready"?(0,v.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,v.jsxs)("span",{children:[t("view.scope")," ",(0,v.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}),O.truncated?(0,v.jsx)("span",{className:"fx-foot-warn",children:Se({entries:O.nodes,truncated:!0,total:O.total}).label}):null,(0,v.jsxs)("span",{className:"fx-foot-git","data-state":be===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,v.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Er,"aria-hidden":"true"}),be===void 0?t("status.unavailable"):be===0?t("status.clean"):t("status.summary").replace("{count}",String(be))]}),Zn===null?null:(0,v.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Zn,j?.upstream!==void 0&&(j.ahead??0)>0?(0,v.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(j.ahead)}`}):null,j?.upstream!==void 0&&(j.behind??0)>0?(0,v.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(j.behind)}`}):null]}),(0,v.jsx)("span",{className:"fx-spacer"}),(0,v.jsx)("span",{children:t("foot.order")})]}):null]})}return u}var hr=["slots","locale","workbench","remote"];function ro(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var dn,ln;function vr(e){let n=e.workbench;if(n==null)return()=>{};dn?.();let t=e.locale.register(Ie,{zh:Cn,en:Fn});dn=t;let r=e.locale.bind(Ie),i=Ot(typeof document>"u"?void 0:document),o=xr({workbench:n,version:n.version,t:r,files:Qt(e),status:or(e),git:nr(e)});ln?.();let l=En(e,n);return ln=l,e.slots.inject(gn,()=>e.slots.register({name:gn,id:G,order:100,label:()=>Ln(ro(e)),locale:Ie},o)),()=>{l(),ln===l&&(ln=void 0),i(),t(),dn===t&&(dn=void 0)}}var br={buildTree:ze,describeListing:Se,iconFor:xe,computeTreeWindow:_e,flattenTree:He,badgeFor:he,formatSize:Ge,joinPath:$e,listingPath:Oe,parseFocus:Ke,consumeViewRequest:Re,createPanelStack:Mn,createEscapeHandler:Ue,KEYMAP:qe,tabLabel:Ln,normalizeListing:on,normalizeStatusSnapshot:an,buildWorkspaceMap:De,workspaceTagFor:We,parseStatusZ:Ae,statusTone:ke,statusBadge:je,createPreviewLoader:Je,renderMarkdown:Ye,languageFor:Ee,isMarkdownFile:Ze,describePage:Qe,classifyPreviewFailure:Ce,normalizePreviewPage:Wn,previewChunkRoute:Dt,canBridgeFile:Ve,decideBridge:Tn,focusForFileAddress:Rn,forwardFocus:Pn,registerAddressBridge:En},wr={name:"dsh-fs-explorer",inject:hr,apply:vr,__test:br};var io=wr;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
