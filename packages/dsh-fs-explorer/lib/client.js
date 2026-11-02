window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var mn=Object.defineProperty;var Ur=Object.getOwnPropertyDescriptor;var Xr=Object.getOwnPropertyNames;var Yr=Object.prototype.hasOwnProperty;var Zr=(e,n)=>{for(var t in n)mn(e,t,{get:n[t],enumerable:!0})},Jr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Xr(n))!Yr.call(e,o)&&o!==t&&mn(e,o,{get:()=>n[o],enumerable:!(r=Ur(n,o))||r.enumerable});return e};var Qr=e=>Jr(mn({},"__esModule",{value:!0}),e);var Ai={};Zr(Ai,{__test:()=>Ar,apply:()=>Dr,boot:()=>Zt,clientPlugin:()=>jr,default:()=>Di,inject:()=>Lr});module.exports=Qr(Ai);var me=require("react");var pt="dsh-resource://file/";function yt(e){try{return decodeURIComponent(e)}catch{return e}}function be(e){if(!e.startsWith(pt))return null;let n=e.slice(pt.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=yt(t.slice(0,r)),i=t.slice(r+1),s=i.search(/[?#]/u),f=s<0?i:i.slice(0,s);return f.length===0?null:{sessionId:o,path:f.split("/").map(yt).join("/")}}function ee(e){return e.slice(e.lastIndexOf("/")+1)}var gt=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function mt(){return gt.flatMap(e=>[...e.extensions])}function we(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return gt.find(o=>o.extensions.includes(r))?.family??null}var X="dsh-fs-explorer",xn="conversation.view",V="fs-explorer";var ke="fs-explorer";var xt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",hn={chunk:"client.preview.js"},Ne={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var eo={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},no={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},to=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function vt(e){return typeof e=="string"&&to.has(e)}function ht(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function ro(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function De(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let s=o.slice(2);s!==""&&(n[s]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let s=ht(o.slice(2),i==="1"?7:8);if(s===null)continue;let f=s.fields[0]??"",a=s.rest;if(a===""||f.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[a]={status:"renamed"};continue}n[a]={status:ro(f[0]??".",f[1]??".")};continue}if(i==="u"){let s=ht(o.slice(2),9);if(s===null)continue;let f=s.rest;if(f==="")continue;n[f]={status:"conflicted"}}}}return n}function Re(e){return vt(e)?eo[e]:"neutral"}function Ae(e){return vt(e)?no[e]:"?"}function vn(e){return`status.${e}`}function bt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function wt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function kt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Rt(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var oo=["conflicted","deleted","renamed","added","modified","untracked"];function io(e){return Re(oo.find(n=>e.has(n))??"modified")}function St(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let s=i.split("/"),f=r.endsWith("/")?s.length:s.length-1,a="";for(let d=0;d<f;d+=1){let l=s[d];if(l===void 0||l==="")continue;a=a===""?l:`${a}/${l}`;let p=n.get(a);p===void 0?n.set(a,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:io(o.present)});return t}var Tt=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Ct=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function ao(e){return Ct.test(e)?e.slice(0,e.indexOf("/")):null}function so(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function lo(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let s=so(i[2]??"");s!==""&&Ct.test(s)&&t.push(s)}return t}function co(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let s=i.trim();if(s===""||s.startsWith("#")||s.startsWith(";"))continue;let f=/^\[(.+)\]$/u.exec(s);if(f!==null){o(),r=/^submodule(\s|$)/u.test(f[1]??"");continue}if(!r)continue;let a=/^path\s*=\s*(.*)$/u.exec(s);a!==null&&(t=(a[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Et(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Pt(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function je(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let f of co(r))t.set(f,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let f of lo(i))o.add(f);let s=e.get("package.json");if(typeof s=="string"){let f=Et(s);if(f!==void 0){let a=f.workspaces,d=a!==null&&typeof a=="object"&&!Array.isArray(a)?a.packages:void 0;for(let l of Pt(Array.isArray(a)?a:d))o.add(l)}}for(let f of["turbo.json","lerna.json"]){let a=e.get(f);if(typeof a!="string")continue;let d=Et(a);if(d!==void 0)for(let l of Pt(d.packages))o.add(l)}for(let f of o){let a=ao(f);a!==null&&n.has(a)&&t.set(f,"package")}return t}function Oe(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var uo=new Set(["node_modules",".git","dist","__pycache__"]);function fo(e){return uo.has(e)}function po(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function We(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||fo(r))continue;let o=po(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var yo=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),go=new Set(["md","mdx","markdown","mdown","rst","adoc"]),mo=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),xo=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),ho=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),vo=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),bo=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Mt(e){let n=ee(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function ye(e,n="file"){if(n==="directory")return"folder";let t=ee(e.toLowerCase());if(bo.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Mt(t);return r===""?"file":yo.has(r)?"code":go.has(r)?"markdown":mo.has(r)?"data":xo.has(r)?"image":ho.has(r)?"style":vo.has(r)?"archive":"file"}var wo={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},ko={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ge(e){let n=ee(e.toLowerCase()),t=wo[n];if(t!==void 0)return t;let r=Mt(n),o=ko[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Se(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${xt} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function ze(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),s=Math.max(0,e.length-i-o*2),f=Math.floor(Math.max(0,n.scrollTop)/t)-o,a=Math.min(Math.max(f,0),s),d=Math.min(e.length,a+i+o*2);return{rows:e.slice(a,d),startIndex:a,endIndex:d}}function bn(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function _e(e){return e===""?".":e}function Be(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function $e(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function It(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=$e(r,o),t.push(r);return t}function Ft(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Ke(e){if(typeof e!="string")return;let n=e.trim(),t=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(t!==null){let s=(t[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return s===""?void 0:{path:s,line:Ft(t[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(r===null)return;let i=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(i!=="")return{path:i,line:Ft(r[2]),absolute:!1}}function Lt(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Nt(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function He(e,n,t,r){let o=[],i=St(t),s=(f,a)=>{let d=e.get(f);if(!(d===void 0||d.status!=="ready"))for(let l of d.nodes){let p=$e(f,l.name),w=l.kind==="directory",h=w&&n.has(p),E=w||t===void 0?void 0:t[p],P=E?.status??(w?void 0:bt(p,t)),T=E===void 0?void 0:wt(E),F=w?i.get(p):void 0,B=w?Oe(r,p):void 0;if(o.push({type:"entry",path:p,name:l.name,kind:l.kind,depth:a,expanded:h,...l.size===void 0?{}:{size:l.size},...P===void 0?{}:{status:P},...F===void 0?{}:{statusCount:F.count,statusTone:F.tone},...T===void 0?{}:{diff:T},...B===void 0?{}:{tag:B}}),!h)continue;let j=e.get(p);if(j===void 0||j.status==="loading"){o.push({type:"status",key:`${p}:loading`,path:p,depth:a+1,state:"loading"});continue}if(j.status==="failed"){o.push({type:"status",key:`${p}:failed`,path:p,depth:a+1,state:"failed",message:j.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(j.nodes.length===0){o.push({type:"status",key:`${p}:empty`,path:p,depth:a+1,state:"empty"});continue}s(p,a+1),j.truncated&&o.push({type:"status",key:`${p}:truncated`,path:p,depth:a+1,state:"truncated",label:Se({entries:j.nodes,truncated:!0,total:j.total}).label})}};return s("",0),o}var Ro=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function So(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Eo(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Ro.has(So(n.path)))}function Dt(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Eo(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Ve(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var wn="dsh-fs-explorer:bridge",Po="fs-explorer-bridge",Wt="dsh-resource://file/**",kn="sidebar.right.pane.tab",To=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Co=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Fo=new Set(["makefile","dockerfile","license","readme","changelog"]),Mo=new Set([...mt(),...To]);function Io(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function qe(e){if(typeof e!="string"||e==="")return!1;let n=ee(e).toLowerCase();if(n==="")return!1;let t=Io(n);return Co.has(t)?!1:Fo.has(n)?!0:Mo.has(t)}function Lo(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function No(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function En(e,n){if(typeof e!="string")return;let t=be(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=No(n,Lo(e));return`${Be(r)?"abs:":"path:"}${r}:${String(o)}`}function Pn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=be(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!qe(r.path))return{action:"keep",reason:"refused"};let o=En(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function ne(e,n){n===void 0?console.warn(`[${X}] ${e}`):console.warn(`[${X}] ${e}`,n)}function Do(e){console.debug(`[${X}] ${e}`)}function Rn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Sn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function le(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function At(e){return le(()=>e.sidebarRightTabs,Rn)??le(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Rn)}function jt(e){return le(()=>e.sidebarRight,Sn)??le(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Sn)}function Ot(e){return typeof e=="function"?e:()=>{}}var Ao="dsh-resource://file/session/probe/src/main.ts";function jo(e){let n=le(()=>(typeof e.candidates=="function"?e.candidates(Ao):[]).filter(r=>r.priority==="extension"&&r.id!==wn),t=>Array.isArray(t)&&t.length>0);n!==void 0&&ne(`another extension-band tab type already claims ${Wt}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Oo(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Wo(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function zo(e,n){let t=e.viewFocus;if(t?.request?.(V,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(V,n);return(!r.opened||r.focused)&&t?.take(V),r}return typeof e.openView=="function"&&e.openView(V,n)?(t?.take(V),{opened:!0,focused:!0}):(t?.take(V),{opened:!1,focused:!1})}function Tn(e,n,t,r){let o;try{o=zo(e,r)}catch(i){return ne("the file workbench threw while switching views",i),e.viewFocus?.take(V),!1}if(!o.opened)return ne(`the file workbench did not switch to ${V}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return ne("the forwarded tab could not be closed",i),!1}}function _o(e,n){function t({useTabInfo:r}){let i=r()?.tab,s=typeof i?.id=="string"&&i.id!==""?i.id:void 0,f=Oo(i),a=Wo(i),d=(0,me.useRef)(void 0);return(0,me.useEffect)(()=>{if(s===void 0){ne("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===s)return;d.current=s;let l=Pn(f,e.currentSessionId(),a);if(l.action!=="open"){ne(`left the forwarded tab standing (${l.reason})`,f);return}Tn(e,n,s,l.focus)},[s,f,a]),null}return function(o){return typeof o.useTabInfo!="function"?(ne(`the host did not inject useTabInfo into ${kn}; the bridge cannot forward`),null):(0,me.createElement)(t,{useTabInfo:o.useTabInfo})}}function Cn(e,n){let t=(f,a)=>{if(f===void 0||a===void 0)return;jo(f);let d;try{d=f.register({id:wn,kind:Po,patterns:[Wt],priority:"extension",canOpen:w=>{let h=be(w);return h!==null&&qe(h.path)},title:w=>ee(be(w)?.path??w)||w})}catch(w){ne("the sidebar right refused the address bridge tab type",w);return}let l=_o(n,a),p;try{p=Ot(e.slots.inject(kn,()=>e.slots.register({name:kn,key:wn},l)))}catch(w){d(),ne("the sidebar right refused the address bridge body",w);return}return()=>{p(),d()}},r=At(e),o=jt(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return Do("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let s=i.call(e,["sidebarRightTabs","sidebarRight"],f=>{let a=le(()=>f.get?.("sidebarRightTabs"),Rn)??At(f),d=le(()=>f.get?.("sidebarRight"),Sn)??jt(f);return t(a,d)});return Ot(s)}var Fn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Mn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function In(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Fn:Mn)["tab.label"]??"Files"}var Bo=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,error:null});function xe(e){return e!==null&&typeof e=="object"}function Ge(e,n){return{ok:!1,code:e,message:n}}function Ln(){return Ge("invalid-response","the document service answered an invalid response")}function zt(e){let n=xe(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Ge(t,r)}function Nn(e){try{return e()}catch{return}}function $o(e){let n=xe(e)?e:void 0;if(n===void 0)return Ln();if(n.ok===!1)return zt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=xe(t)?t:void 0;if(r===void 0)return Ln();if(r.ok===!1)return zt(r.error);let o=xe(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Ln():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Dn(e){return xe(e)&&typeof e.open=="function"}function Ko(e){return()=>{let n=Nn(()=>e.fsExplorerDocuments);if(Dn(n))return n;let t=Nn(()=>xe(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Dn(t))return t;let r=Nn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Dn(r))return r}}function _t(e){let n=Ko(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Ge("unavailable","the document service is unavailable");try{return $o(await i.open({sessionId:t,path:r},o))}catch(s){return Ge("io-error",s instanceof Error?s.message:String(s))}}}function Bt(e){let n=new Map,t=(r,o)=>`${r}\0${o}`;return{acquire(r,o){let i=t(r,o),s=n.get(i);return s===void 0&&(s={session:new An(r,o,e.open,()=>{n.delete(i)})},n.set(i,s)),s.session.retain(),s.session}}}var An=class{constructor(n,t,r,o){this.sessionId=n;this.path=t;this.open=r;this.onRelease=o}sessionId;path;open;onRelease;snapshot=Bo;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}async save(){if(this.closed)return;let n=this.snapshot.text;await Promise.resolve(),!this.closed&&this.publish({...this.snapshot,savedText:n,dirty:this.snapshot.text!==n})}async reload(){if(this.closed)return;let n=++this.generation;this.publish({...this.snapshot,status:"loading",error:null});try{let t=await this.open(this.sessionId,this.path);if(this.closed||n!==this.generation)return;if(!t.ok){this.publish({...this.snapshot,status:"failed",error:{code:t.code,message:t.message}});return}this.publish({...this.snapshot,status:"ready",text:t.text,savedText:t.text,version:t.version??null,dirty:!1,error:null})}catch(t){if(this.closed||n!==this.generation)return;this.publish({...this.snapshot,status:"failed",error:{code:"io-error",message:t instanceof Error?t.message:String(t)}})}}dispose(){this.closed||(this.references-=1,!(this.references>0)&&(this.closed=!0,this.listeners.clear(),this.onRelease()))}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t()}};var Ue=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ho(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function $t(e,n,t=Ho()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",s=r.includes("alt"),f=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===s&&e.shiftKey===!0===f}function Kt(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Vo(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function jn(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Xe(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Vo(n),e.onClose?.()}}function Ht(e){let n=ee(e);return n===""?e:n}function On(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var qo=Object.freeze({panels:Object.freeze([]),active:null});function Wn(){let e=[],n=null,t=qo,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let a of[...r])a()},i=a=>e.findIndex(d=>d.path===a),s=a=>{let d=On(a,!0);if(d===void 0)return;if(i(d)>=0)return d;let l=On(a,!1);if(!(l===void 0||l===d))return i(l)>=0?l:void 0},f=a=>{if(e.length===0)return;let d=n===null?-1:i(n),l=e[(d+a+e.length)%e.length];l===void 0||l.path===n||(n=l.path,o())};return{open(a,d=1,l=!1){let p=On(a,l);if(p===void 0)return;let w=Number.isFinite(d)&&d>0?Math.trunc(d):1,h=i(p);if(h>=0){let P=e[h],T=P!==void 0&&(P.line!==w||P.absolute!==l);if(T&&(e=e.map((F,B)=>B===h?{path:p,line:w,absolute:l}:F)),n===p){T&&o();return}n=p,o();return}let E=n===null?e.length:i(n)+1;e=[...e.slice(0,E),{path:p,line:w,absolute:l},...e.slice(E)],n=p,o()},close(a){let d=a===void 0?n:s(a)??null;if(d===null)return;let l=i(d);l<0||(e=e.filter(p=>p.path!==d),n===d&&(n=(e[l]??e[l-1])?.path??null),o())},activate(a){let d=s(a);d===void 0||i(d)<0||n===d||(n=d,o())},next(){f(1)},previous(){f(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(a){let d=s(a);return d!==void 0&&i(d)>=0},activeEntry(){return e.find(a=>a.path===n)},snapshot:()=>t,subscribe(a){return r.add(a),()=>{r.delete(a)}}}}function Vt(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Wn();return e.set(t,o),o}}}function Ee(e,n){let t=Ke(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute),!0)}var qt=require("react");function _(e,n,...t){let r=t.filter(s=>s!=null&&s!==!1),o=(0,qt.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Go(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Uo=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function ce(e){let n=[],t=0;for(let r of e.matchAll(Uo)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(_("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(_("strong",null,...ce(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(_("del",null,...ce(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(_("em",null,...ce(i.slice(1,-1))));else{let s=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),f=s?.[1]??i,a=s===null?void 0:Go(s[2]??"");n.push(a===void 0?f:_("a",{href:a,rel:"noreferrer noopener"},f))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Gt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Ut=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Xt=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,zn=/^\s{0,3}>\s?(.*)$/u,_n=/^\s{0,3}[-*+]\s+(.*)$/u,Bn=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Xo(e){return Gt.test(e)||Ut.test(e)||Xt.test(e)||zn.test(e)||_n.test(e)||Bn.test(e)}function Yt(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Gt.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),l=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(_("pre",null,_("code",l===""?null:{className:`language-${l}`},p.join(`
`))));continue}let i=Ut.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(_(`h${String(d)}`,null,...ce(i[2]??""))),t+=1;continue}if(Xt.test(r)){n.push(_("hr",null)),t+=1;continue}if(zn.test(r)){let d=[];for(;t<e.length;){let l=zn.exec(e[t]??"");if(l===null)break;d.push(l[1]??""),t+=1}n.push(_("blockquote",null,...Yt(d)));continue}if(_n.exec(r)!==null){let d=[];for(;t<e.length;){let l=_n.exec(e[t]??"");if(l===null)break;d.push(_("li",null,...ce(l[1]??""))),t+=1}n.push(_("ul",null,...d));continue}if(Bn.exec(r)!==null){let d=[];for(;t<e.length;){let l=Bn.exec(e[t]??"");if(l===null)break;d.push(_("li",null,...ce(l[1]??""))),t+=1}n.push(_("ol",null,...d));continue}let a=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||Xo(d))break;a.push(d.trim()),t+=1}n.push(_("p",null,...ce(a.join(" "))))}return n}function Ye(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return _("div",{className:"fx-md"},...Yt(n))}var $n=200,Yo={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Ce(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Yo[t.slice(r+1)]??"plaintext"}function Fe(e){return Ce(e)==="markdown"}var ue=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Pe(e){return e!==null&&typeof e=="object"}function Zo(e){return e===""?0:e.split(`
`).length}function Kn(e,n){if(!Pe(e))throw new ue("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let f=Pe(e.error)?e.error:{},a=typeof f.code=="string"?f.code:"preview/unknown",d=typeof f.message=="string"?f.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",l=Pe(f.details)?f.details:{},p=typeof l.kind=="string"?l.kind:"";throw new ue(a,d,p)}let t=e.ok===!0?e.value:e;if(!Pe(t)||typeof t.text!="string")throw new ue("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Zo(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,s=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:t.text,lines:r,offset:i,eof:s}:{text:t.text,lines:r,offset:i,totalLines:o,eof:s}}function Me(e){let n=Pe(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Te=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Ze({files:e,maxLines:n=$n}){let t=Math.max(1,Math.trunc(n)),r=Te,o=0,i=null,s=[1],f=new Set,a=l=>{r=l;for(let p of f)p()},d=async(l,p)=>{o+=1;let w=o;i?.abort();let h=new AbortController;i=h,a({status:"loading",path:l,text:r.path===l?r.text:"",offset:p,lines:r.path===l?r.lines:0,...r.path===l&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===l?r.eof:!1});try{let E=await e.read(l,p>1?{offset:p,limit:t}:{limit:t},h.signal);if(w!==o)return;let P=Kn(E,p);if(P.lines===0&&p>1){a({...r,status:"ready",eof:!0,text:"",lines:0});return}a(P.totalLines===void 0?{status:"ready",path:l,text:P.text,offset:P.offset,lines:P.lines,eof:P.eof}:{status:"ready",path:l,text:P.text,offset:P.offset,lines:P.lines,totalLines:P.totalLines,eof:P.eof})}catch(E){if(w!==o||h.signal.aborted)return;a({status:"failed",path:l,text:"",offset:p,lines:0,eof:!1,failure:Me(E)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(l){return f.add(l),()=>{f.delete(l)}},async open(l){s=[1],await d(l,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let l=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&l>r.totalLines||(s.push(l),await d(r.path,l))},async prev(){if(r.path===void 0||s.length<=1)return;s=s.slice(0,-1);let l=s[s.length-1]??1;await d(r.path,l)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,s=[1],a(Te)}}}function Je(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Hn=Object.freeze({chunk:hn.chunk,id:`${X}/${hn.chunk}`}),Vn=null,Ie=null,Qe=new Map;function Zt(e){Vn=e}function Jt(){return Hn}function Jo(e){let n=Ne[e];return{chunk:n,id:`${X}/${n}`}}function qn(){if(Ie!==null)return Ie;let e=Vn;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${X}: the loader require was not handed over`));let n=e.async(`./${Hn.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${X}: chunk ${Hn.id} is missing its preview renderers`);return r});return Ie=n,n.catch(()=>{Ie===n&&(Ie=null)}),n}function Qt(e){let n=Qe.get(e);if(n!==void 0)return n;let t=Vn;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${X}: the loader require was not handed over`));let r=Jo(e),o=t.async(`./${r.chunk}`).then(i=>{let s=i;if(s===null||typeof s.FamilyView!="function"||s.renderer!==e)throw new Error(`${X}: chunk ${r.id} is not the ${e} view`);return s});return Qe.set(e,o),o.catch(()=>{Qe.get(e)===o&&Qe.delete(e)}),o}var C=require("react");async function er(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var te=require("react/jsx-runtime");function Qo(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function ei(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Gn({failure:e,t:n,onRetry:t}){return(0,te.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,te.jsx)("strong",{children:Qo(e,n)}),(0,te.jsx)("span",{children:ei(e,n)}),e.message===""?null:(0,te.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,te.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function Un({t:e}){return(0,te.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,te.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Xn="fsExplorer",nr=1;function ni(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function ti(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function ri(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function oi(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function en(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let s=i?.id;if(typeof s!="string"||s==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${s}" has no load(); it was refused`),()=>{};if(t.has(s))return n(`renderer registry: "${s}" is already registered; the first registration stays`),()=>{};t.set(s,{contribution:i,extensions:(i.match?.extensions??[]).map(ti),families:[...i.match?.families??[]]}),o();let f=!0;return()=>{f&&(f=!1,t.delete(s),o())}},resolve(i){let s=ni(i.path),f=we(i.path),a;for(let d of t.values())ri(d,s,f)&&(a===void 0||oi(d.contribution,a.contribution))&&(a=d);return a?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function tr(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function nn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function he(e){try{return e()}catch{return}}function ir(e){return()=>{let n=he(()=>e.workspaceFiles);if(nn(n))return n;let t=he(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(nn(t))return t;let r=he(()=>e.remote?.workspaceFiles);if(nn(r))return r;let o=he(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(nn(o))return o}}function ar(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function tn(e){return e!==null&&typeof e=="object"}function ii(e){if(!tn(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=tn(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function ai(e){let n=tn(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=tn(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new ue(t,r,i)}function Jn(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=ii(await n.call(e,t,r,{},o));if(!i.ok)throw ai(i.error);return i.value.data}}function Le(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Yn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function rn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Le(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Yn(r.value):{ok:!1,message:Le(r.error)}}return Yn(t)}return Yn(n)}function sr(e){return e instanceof Error?e.message:Le(e)}function rr(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function dr(e){return()=>{let n=he(()=>e.remote?.gitExplorer);if(rr(n))return n;let t=he(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(rr(t))return t}}function or(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function si(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=or(r.additions),i=or(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function di(e){if(e===null||typeof e!="object")return;let n=e,t=s=>typeof s=="number"&&Number.isFinite(s)&&s>=0?s:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Zn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=si(n.stats),r=di(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function on(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Le(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?Zn(o.snapshot):{ok:!1,message:Le(o.error)}}let r=e;return r.snapshot!==void 0?Zn(r.snapshot):Zn(t)}var v=require("react/jsx-runtime"),Qn={status:"idle"},li=[".md",".mdx",".markdown",".mdown"],ci=-1e3;function nt({t:e}){return(0,v.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,v.jsx)("strong",{children:e("preview.unavailable.title")}),(0,v.jsx)("span",{children:e("preview.unavailable.description")})]})}function lr({chunk:e,text:n,path:t,offset:r}){let o=(0,C.useRef)(null),i=(0,C.useRef)(null),[s,f]=(0,C.useState)(!1),a=Ce(t);return(0,C.useEffect)(()=>{f(!1)},[e,t]),(0,C.useEffect)(()=>{let d=o.current;if(!(e===null||d===null))try{let l=e.mountCodePreview(d,{text:n,language:a,path:t,offset:r});return i.current=l,()=>{l.destroy(),i.current=null}}catch{f(!0);return}},[e,t,a]),(0,C.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||s?(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,v.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function ui({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Fe(n)?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Ye(r)}):(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function fi(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,v.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,v.jsx)(lr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function pi(e){function n({page:t,path:r}){return(0,v.jsx)(lr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function yi({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i}){let s=(0,C.useMemo)(()=>Jn(r),[r]);return t===void 0||s===void 0?(0,v.jsx)(nt,{t:o}):(0,v.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:s,t:o,visible:i})}function gi(e){return{Body:n=>(0,v.jsx)(yi,{chunk:e,...n}),renderer:e.renderer}}function tt(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...li]},priority:0,load:()=>qn().then(fi)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:ci,load:()=>qn().then(pi)},...Object.keys(Ne).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Qt(e).then(gi)}))]}var et;function mi(){if(et!==void 0)return et;let e=en();for(let n of tt())e.register(n);return et=e,e}function cr({sessionId:e,files:n,path:t,t:r,visible:o=!0,renderers:i}){let s=(0,C.useMemo)(()=>ar(n,e),[n,e]),f=(0,C.useMemo)(()=>Jn(n),[n]),a=i??mi(),d=t===void 0?null:we(t),l=d!==null,p=e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[w,h]=(0,C.useState)(null),[E,P]=(0,C.useState)(Te),[T,F]=(0,C.useState)(Qn),[B,j]=(0,C.useState)(0),[O,$]=(0,C.useState)(0),[re,oe]=(0,C.useState)("reading"),[J,q]=(0,C.useState)(!1),u=(0,C.useRef)(void 0);if((0,C.useEffect)(()=>{if(s===void 0){h(null);return}let S=Ze({files:s,maxLines:$n});return h(S),()=>S.close()},[s]),(0,C.useEffect)(()=>{if(w===null){P(Te);return}return P(w.getSnapshot()),w.subscribe(()=>P(w.getSnapshot()))},[w]),(0,C.useEffect)(()=>{w===null||t===void 0||d!==null||w.open(t)},[w,t,d]),(0,C.useEffect)(()=>{oe("reading"),q(!1)},[t]),(0,C.useEffect)(()=>()=>{u.current!==void 0&&clearTimeout(u.current)},[]),(0,C.useEffect)(()=>a.subscribe(()=>j(S=>S+1)),[a]),(0,C.useEffect)(()=>{if(t===void 0){F(Qn);return}let S=tr(a,{path:t});if(S===void 0){F(Qn);return}let{contribution:I}=S,ie=!0;return F(U=>U.status==="ready"&&U.contribution.id===I.id?U:{status:"loading",contribution:I}),S.module.then(U=>{ie&&F({status:"ready",contribution:I,module:U})},U=>{ie&&F({status:"failed",contribution:I,failure:Me(U)})}),()=>{ie=!1}},[a,t,B,O]),t===void 0)return(0,v.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,v.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,v.jsx)("strong",{children:r("preview.empty.title")}),(0,v.jsx)("span",{children:r("preview.empty.description")})]})});let k=Je(E),g=!l&&Fe(t),A=l?p!==null&&T.status!=="ready"&&T.status!=="failed":E.status==="loading",Y=E.status==="ready",W=g&&re==="reading",se=l?p===null?"unavailable":T.status==="failed"?"failed":T.status==="ready"?"ready":"loading":E.status,K=T.status==="ready"?W?"gfm":T.module.renderer??T.contribution.id:l?"pending":W?"fallback":"plain",H={path:t,sessionId:e,files:n,t:r,visible:o,mode:re,...l?{}:{page:{text:E.text,offset:E.offset}}},G=()=>{er(t).then(S=>{S&&(q(!0),u.current!==void 0&&clearTimeout(u.current),u.current=setTimeout(()=>q(!1),1400))})},M;if(l){let S=T.status==="ready"?T.module.Body:void 0;M=p===null?(0,v.jsx)(nt,{t:r}):T.status==="failed"?(0,v.jsx)(Gn,{failure:T.failure,t:r,onRetry:()=>$(I=>I+1)}):S===void 0?(0,v.jsx)(Un,{t:r}):(0,v.jsx)(S,{...H})}else if(s===void 0)M=(0,v.jsx)(nt,{t:r});else if(E.status==="failed")M=(0,v.jsx)(Gn,{failure:E.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{w?.retry()}});else if(!Y)M=(0,v.jsx)(Un,{t:r});else{let S=T.status==="ready"?T.module.Body:ui;M=(0,v.jsx)(S,{...H})}return(0,v.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":se,"data-mode":l?"binary":W?"reading":"code","data-renderer":K,children:[(0,v.jsxs)("header",{className:"fx-preview-bar",children:[(0,v.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),l?null:(0,v.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[k.range,k.range==="\u2014"?null:(0,v.jsxs)(v.Fragment,{children:[" ",r("preview.lines")]}),k.total===void 0?null:(0,v.jsxs)("span",{className:"fx-preview-total",children:[" / ",k.total," ",r("preview.lines")]})]}),(0,v.jsxs)("div",{className:"fx-preview-actions",children:[g?(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>oe(S=>S==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(re==="reading"?"preview.source":"preview.reading")}):null,l?null:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Y||A||E.offset<=1,onClick:()=>{w?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Y||A||E.eof,onClick:()=>{w?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:G,"data-testid":"fs-preview-copy",children:r(J?"preview.copied":"preview.copyPath")}),A?(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,v.jsx)("div",{className:"fx-preview-body","data-scroll":W?"y":"none",children:M})]})}var ur="dsh-fs-explorer-styles",xi=`
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
`;function fr(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${ur}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=ur,t.textContent=xi,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var rt="fs-explorer.treePaneWidth";function ot(e){return Math.min(520,Math.max(180,e))}function yr(e){if(e==null)return null;let n;try{n=e.getItem(rt)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function an(e,n){let t=Math.round(ot(n));if(e!=null)try{e.setItem(rt,String(t))}catch{}return t}function gr(e){if(e!=null)try{e.removeItem(rt)}catch{}}function mr(e,n){return Math.round(e)===Math.round(n)}var pr=16;function xr(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-pr};case"ArrowRight":return{kind:"nudge",delta:pr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var sn=require("react");var N=require("react/jsx-runtime");function hr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i}){let s=(0,sn.useRef)(null);if((0,sn.useEffect)(()=>{s.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]),e.length===0)return null;let f=a=>{if(a.key==="ArrowRight"||a.key==="ArrowLeft"){a.preventDefault(),a.stopPropagation(),i(a.key==="ArrowRight"?1:-1);return}(a.key==="Delete"||a.key==="Backspace")&&n!==null&&(a.preventDefault(),a.stopPropagation(),o(n))};return(0,N.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:f,"data-testid":"fs-tabs",children:e.map((a,d)=>{let l=a.path===n,p=Ht(a.path),w=t("panel.close").replace("{name}",p);return(0,N.jsxs)("div",{className:"fx-tab","data-active":l?"true":"false",role:"presentation",children:[(0,N.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${d}`,"aria-controls":`fx-panel-${d}`,"aria-selected":l,tabIndex:l?0:-1,title:a.path,"data-testid":"fs-tab","data-path":a.path,ref:l?s:void 0,onClick:()=>r(a.path),children:[(0,N.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":ye(a.path),"aria-hidden":"true",children:ge(a.path)}),(0,N.jsx)("span",{className:"fx-tab-name",children:p})]}),(0,N.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:l?0:-1,"aria-label":w,title:w,"data-testid":"fs-tab-close",onClick:()=>o(a.path),children:"\xD7"})]},a.path)})})}function hi(){return(0,N.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,N.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,N.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,N.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function vr({t:e}){return(0,N.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,N.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,N.jsx)(hi,{})}),(0,N.jsx)("strong",{children:e("panel.empty.title")}),(0,N.jsx)("span",{children:e("panel.empty.description")}),(0,N.jsxs)("span",{className:"fx-empty-keys",children:[(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,N.jsx)("span",{children:e("panel.empty.keys")})]})]})}var L=require("react");function wr(e,n,t,r=800){return t-n<=r?e:""}function kr(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Rr(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let s=e[i];s?.type==="entry"&&s.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:vi(e,t+1,r.depth,r.depth+1)}function vi(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let s=e[i];if(s?.type==="entry"){if(s.depth<=t)break;s.depth===r&&o.push(i)}}return o}var bi=/^.$/u;function Sr(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!bi.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let s=br(e.names,n),f=s.find(a=>a>e.active)??s[0];return f===void 0?{kind:"miss"}:{kind:"jump",index:f,query:n}}let t=`${e.query}${n}`,r=br(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(s=>s>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function br(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var b=require("react/jsx-runtime"),fe=22;function it({open:e=!0,size:n=14}){return(0,b.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,b.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,b.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function wi(){return(0,b.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Er(){return(0,b.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,b.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,b.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Pr(){return(0,b.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function ki({name:e}){return(0,b.jsx)("span",{className:"fx-badge","data-icon":ye(e),"aria-hidden":"true",children:ge(e)})}function Ri({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:s,onRowActivate:f}){let a=e.kind==="directory",d={top:r,paddingLeft:8+e.depth*12};return(0,b.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:d,onClick:()=>{f(e.path),a?i(e.path):s(e.path)},children:[(0,b.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,b.jsx)(wi,{})}),a?(0,b.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,b.jsx)(it,{open:e.expanded})}):(0,b.jsx)(ki,{name:e.name}),(0,b.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,b.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,b.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":Re(e.status),"data-testid":"fx-file-status",title:o(vn(e.status)),"aria-label":o(vn(e.status)),children:Ae(e.status)}),e.statusCount===void 0?null:(0,b.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,b.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,b.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,b.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,b.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,b.jsx)("span",{className:"fx-size",children:Ve(e.size)})]})}function Si({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,b.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,b.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,b.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,b.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,b.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Ei(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Tr({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:s,onEntryFocusSettled:f}){let a=(0,L.useRef)(null),[d,l]=(0,L.useState)(0),[p,w]=(0,L.useState)(0),[h,E]=(0,L.useState)(void 0),P=(0,L.useRef)(void 0),T=(0,L.useRef)({query:"",at:0}),F=(0,L.useRef)(void 0),B=(0,L.useRef)(void 0),j=(0,L.useRef)(h);j.current=h;let O=(0,L.useMemo)(()=>e.flatMap((u,k)=>u.type==="entry"?[k]:[]),[e]);(0,L.useEffect)(()=>{let u=B.current!==n;if(B.current=n,F.current!==void 0||n===void 0)return;let k=j.current===void 0?void 0:e[j.current];if(!Lt({cursorPath:k?.type==="entry"?k.path:void 0,selectionMoved:u}))return;let g=e.findIndex(A=>A.type==="entry"&&A.path===n);g>=0&&E(g)},[n,e]),(0,L.useEffect)(()=>{let u=F.current;if(u===void 0)return;let k=e.findIndex(Y=>Y.type==="entry"&&Y.path===u),g=e[k];if(g?.type!=="entry"||g.kind!=="directory"||!g.expanded){F.current=void 0;return}let A=Nt(e,u);A!==void 0&&(F.current=void 0,E(A))},[e]),(0,L.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&E(void 0)},[e,h]),(0,L.useEffect)(()=>{let u=a.current;if(h===void 0||u===null)return;let k=bn({scrollTop:u.scrollTop,viewport:u.clientHeight,rowHeight:fe,index:h});k!==u.scrollTop&&(u.scrollTop=k)},[h]);let $=(0,L.useCallback)(u=>{E(u),a.current?.focus({preventScroll:!0})},[]),re=(0,L.useCallback)(u=>{let k=e.findIndex(g=>g.type==="entry"&&g.path===u);k>=0&&E(k)},[e]),oe=(0,L.useCallback)(u=>{if(u.nativeEvent.isComposing||u.altKey||u.metaKey||u.ctrlKey)return;let k=O.at(-1);if(u.key==="ArrowDown"){if(u.preventDefault(),h===void 0){O[0]!==void 0&&$(O[0]);return}let M=O.find(S=>S>h);M!==void 0&&$(M);return}if(u.key==="ArrowUp"){if(u.preventDefault(),h===void 0){k!==void 0&&$(k);return}let M=[...O].reverse().find(S=>S<h);M!==void 0&&$(M);return}if(h===void 0)return;let g=e[h];if(g===void 0||g.type!=="entry")return;if(u.key==="ArrowRight"){if(u.preventDefault(),g.kind==="directory"&&!g.expanded)F.current=g.path,o(g.path);else{let M=O.find(S=>S>h);M!==void 0&&e[M]?.depth===g.depth+1&&$(M)}return}if(u.key==="ArrowLeft"){if(u.preventDefault(),g.kind==="directory"&&g.expanded)o(g.path);else{let M=[...O].reverse().find(S=>S<h&&e[S]?.type==="entry"&&e[S].depth<g.depth);M!==void 0&&$(M)}return}if(u.key==="Enter"&&g.kind!=="directory"){u.preventDefault(),i(g.path);return}if(u.key==="Home"){u.preventDefault(),O[0]!==void 0&&$(O[0]);return}if(u.key==="End"){u.preventDefault(),k!==void 0&&$(k);return}let A=Date.now(),Y=kr(e,h),W=Rr(e,Y),se=W.map(M=>{let S=e[M];return S?.type==="entry"?S.name:""}),K=Sr({query:wr(T.current.query,T.current.at,A),key:u.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:u.nativeEvent.repeat,names:se,active:h===void 0?-1:W.indexOf(h)});if(K.kind==="clear"){T.current={query:"",at:0};return}if(K.kind!=="jump")return;let H=W[K.index];if(H===void 0)return;let G=e[H];G?.type==="entry"&&(T.current={query:K.query,at:A},u.preventDefault(),$(H),G.kind!=="directory"&&i(G.path))},[h,O,$,o,i,e]);(0,L.useEffect)(()=>{let u=a.current;if(u===null)return;let k=()=>w(u.clientHeight);if(k(),typeof ResizeObserver>"u")return;let g=new ResizeObserver(k);return g.observe(u),()=>g.disconnect()},[]),(0,L.useEffect)(()=>{if(n===void 0)return;let u=a.current;if(u===null)return;let k=e.findIndex(A=>A.type==="entry"&&A.path===n);if(k<0)return;let g=k*fe;(g<u.scrollTop||g+fe>u.scrollTop+u.clientHeight)&&(u.scrollTop=Math.max(0,g-u.clientHeight/2))},[n,e]),(0,L.useEffect)(()=>{if(t===void 0||P.current===t)return;let u=a.current;if(u===null)return;let k=t.path===void 0?-1:e.findIndex(g=>g.type==="entry"&&g.path===t.path);if(!(t.path!==void 0&&k<0)){if(P.current=t,k>=0){let g=bn({scrollTop:u.scrollTop,viewport:u.clientHeight===0?480:u.clientHeight,rowHeight:fe,index:k});g!==u.scrollTop&&(u.scrollTop=g,l(g)),E(k)}Ei(u),f?.()}},[t,e,f]);let J=u=>{l(u.currentTarget.scrollTop)},q=ze(e,{scrollTop:d,height:p===0?480:p,rowHeight:fe});return(0,b.jsx)("div",{className:"fx-scroll",ref:a,onScroll:J,onKeyDown:oe,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,b.jsx)("div",{className:"fx-vlist",style:{height:e.length*fe},children:q.rows.map((u,k)=>{let g=(q.startIndex+k)*fe;return u.type==="entry"?(0,b.jsx)(Ri,{row:u,top:g,selected:u.path===n,cursor:h===q.startIndex+k,t:r,onToggle:o,onSelect:i,onRowActivate:re},u.path):(0,b.jsx)(Si,{row:u,top:g,t:r,onRetry:s},u.key)})})})}var m=require("react/jsx-runtime");var Pi=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ti(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Ci=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Fr=new Map;function Fi(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function dn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,m.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,m.jsx)("strong",{children:e}),n===void 0?null:(0,m.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,m.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Mr({workbench:e,version:n,t,files:r,status:o,renderers:i}){let s=Vt();function f(a){let d=a.sessionId??e.currentSessionId(),l=(0,x.useRef)(d);l.current=d;let p=(0,x.useMemo)(()=>r(),[r]),w=(0,x.useMemo)(()=>o(),[o]),[h,E]=(0,x.useState)(()=>new Map),[P,T]=(0,x.useState)(void 0),[F,B]=(0,x.useState)(void 0),[j,O]=(0,x.useState)(void 0),[$,re]=(0,x.useState)(Fr),oe=(0,x.useRef)(h);oe.current=h;let[J,q]=(0,x.useState)(()=>new Set),u=(0,x.useMemo)(()=>s.forSession(d),[s,d]),k=(0,x.useSyncExternalStore)(u.subscribe,u.snapshot,u.snapshot),g=k.active??void 0,[A,Y]=(0,x.useState)(0),W=(0,x.useRef)(new Map),se=(0,x.useRef)(void 0),K=(0,x.useMemo)(()=>Ti(),[]),[H,G]=(0,x.useState)(()=>yr(K)),M=(0,x.useRef)(null),S=(0,x.useRef)(null),I=h.get(""),ie=I?.status==="ready",U=(0,x.useCallback)((c,y,R)=>{u.open(c,y,R)},[u]),ae=(0,x.useCallback)(async(c,y,R)=>{W.current.get(c)?.abort();let D=new AbortController;W.current.set(c,D),E(Z=>new Map(Z).set(c,Pi()));try{let Z=await R.list(y,_e(c),D.signal);if(D.signal.aborted||l.current!==y)return!1;let z=rn(Z);if(!z.ok)return E(Q=>new Map(Q).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:z.message})),!1;let pe=We(z.listing.entries);return E(Q=>new Map(Q).set(c,{status:"ready",nodes:pe,truncated:z.listing.truncated===!0,total:z.listing.entries.length})),!0}catch(Z){return D.signal.aborted||E(z=>new Map(z).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:sr(Z)})),!1}finally{W.current.get(c)===D&&W.current.delete(c)}},[]);(0,x.useEffect)(()=>{for(let c of W.current.values())c.abort();return W.current.clear(),E(new Map),q(new Set),se.current=void 0,d!==void 0&&p!==void 0&&ae("",d,p),()=>{for(let c of W.current.values())c.abort();W.current.clear()}},[d,p,A,ae]),(0,x.useEffect)(()=>{if(d===void 0||w===void 0){T(void 0),B(void 0),O(void 0);return}let c=!0,y=new AbortController;return T(void 0),B(void 0),O(void 0),Promise.resolve().then(()=>w.snapshot({sessionId:d,maxCommits:1},y.signal)).then(R=>{if(!c)return;let D=on(R);if(!D.ok){T(void 0),B(void 0),O(void 0);return}T(Rt(De(D.status),D.stats)),B(D.head),O(D.root)}).catch(()=>{c&&(T(void 0),B(void 0),O(void 0))}),()=>{c=!1,y.abort()}},[d,w,A]),(0,x.useEffect)(()=>{let c=p?.read;if(d===void 0||p===void 0||typeof c!="function"||!ie){re(Fr);return}let y=d,R=new AbortController,D=async(z,pe)=>{try{let Q=Fi(await c.call(p,y,pe,{},R.signal));return Q===void 0?void 0:[z,Q]}catch{return}},Z=Tt.filter(z=>z!==".gitmodules").map(z=>D(z,z));return j!==void 0&&Z.push(D(".gitmodules",`${j.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(Z).then(z=>{if(R.signal.aborted||l.current!==y)return;let pe=new Map;for(let de of z)de!==void 0&&pe.set(de[0],de[1]);let Q=oe.current.get(""),Gr=new Set(Q?.status==="ready"?Q.nodes.filter(de=>de.kind==="directory").map(de=>de.name):[]);re(je(pe,Gr))}),()=>R.abort()},[d,p,ie,j,A]),(0,x.useEffect)(()=>{let c=a.viewRequest;if(c==null||c.view!==V)return;let y=`${c.view}:${c.focus}`;se.current!==y&&(se.current=y,Ee(c.focus,{open:U}),a.completeViewRequest?.())},[a.viewRequest,a.completeViewRequest,U]),(0,x.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||d===void 0)return;let y=()=>{let R=c.take(V);R!==void 0&&Ee(R,{open:U})};return y(),c.subscribe(y)},[e,d,U]),(0,x.useEffect)(()=>{if(g===void 0||!ie||Be(g))return;let c=It(g);if(c.length===0||(q(R=>c.every(D=>R.has(D))?R:new Set([...R,...c])),d===void 0||p===void 0))return;let y=c.filter(R=>oe.current.get(R)?.status!=="ready");y.length!==0&&Promise.all(y.map(R=>ae(R,d,p)))},[g,ie,d,p,ae]);let dt=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),Or=(0,x.useCallback)(c=>{if(c.button!==0||S.current!==null||Ci())return;let y=M.current?.previousElementSibling;if(y instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}S.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:y.getBoundingClientRect().width,restWidth:H},document.body.classList.add("fx-pane-resizing")}},[H]),Wr=(0,x.useCallback)(c=>{let y=S.current;y===null||y.pointerId!==c.pointerId||G(ot(y.baseWidth+c.clientX-y.startX))},[]),pn=(0,x.useCallback)(c=>{let y=S.current;if(y===null||y.pointerId!==c.pointerId)return;S.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let R=y.baseWidth+c.clientX-y.startX;if(mr(R,y.baseWidth)){G(y.restWidth);return}G(an(K,R))},[K]),yn=(0,x.useCallback)(()=>{gr(K),G(null)},[K]),zr=(0,x.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let y=xr(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(y===null)return;if(c.preventDefault(),c.stopPropagation(),y.kind==="reset"){yn();return}if(y.kind==="min"||y.kind==="max"){let Z=y.kind==="min"?180:520;G(an(K,Z));return}let R=M.current?.previousElementSibling,D=R instanceof HTMLElement?R.getBoundingClientRect().width:H??180;G(an(K,D+y.delta))},[K,yn,H]);(0,x.useEffect)(()=>()=>{S.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=y=>{if(!(y.isComposing||Kt(y.target))){for(let R of Ue)if($t(y,R)){if(R.action==="closePanel"&&u.snapshot().active===null)return;y.preventDefault(),y.stopPropagation(),R.action==="nextPanel"?u.next():R.action==="previousPanel"?u.previous():u.close();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[u]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=Xe({focusComposer:dt,hasModal:()=>jn(document)}),y=R=>c(R);return document.addEventListener("keydown",y,!0),()=>document.removeEventListener("keydown",y,!0)},[dt]);let gn=(0,x.useMemo)(()=>He(h,J,P,$),[h,J,P,$]),[_r,lt]=(0,x.useState)(void 0),ct=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(ct.current||typeof document>"u")return;let c=Dt({rows:gn,panelCount:u.snapshot().panels.length,hasModal:jn(document)});c.kind!=="skip"&&(ct.current=!0,c.open!==void 0&&u.open(c.open),lt({path:c.focus}))},[gn,u]);let Br=(0,x.useCallback)(()=>lt(void 0),[]),ve=P===void 0?void 0:Object.keys(P).length,$r=P===void 0?"neutral":Object.values(P).some(c=>c.status==="conflicted")?"conflict":ve===0?"success":"warning",ut=kt(F),Kr=(0,x.useCallback)(c=>{if(d===void 0||p===void 0)return;if(J.has(c)){q(R=>{let D=new Set(R);return D.delete(c),D});return}q(R=>new Set(R).add(c));let y=h.get(c);(y===void 0||y.status==="failed")&&ae(c,d,p)},[J,h,d,p,ae]),ft=(0,x.useCallback)(c=>{d===void 0||p===void 0||ae(c,d,p)},[d,p,ae]),Hr=()=>q(new Set),Vr=()=>Y(c=>c+1),qr=d===void 0?"no-session":p===void 0?"no-service":I===void 0||I.status==="loading"?"loading":I.status==="failed"?"failed":I.nodes.length===0?"empty":"tree";return(0,m.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":qr,"data-session":d??"","data-testid":"fs-explorer-view",children:[(0,m.jsxs)("header",{className:"fx-head",children:[(0,m.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,m.jsx)(it,{open:!0})}),(0,m.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,m.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,m.jsxs)("div",{className:"fx-head-meta",children:[I?.status==="ready"?(0,m.jsxs)("span",{children:[(0,m.jsx)("b",{children:I.nodes.length})," ",t("head.entries")]}):null,(0,m.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:J.size===0,onClick:Hr,children:(0,m.jsx)(Pr,{})}),(0,m.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:d===void 0||p===void 0||I?.status==="loading",onClick:Vr,children:(0,m.jsx)(Er,{})})]})]}),(0,m.jsx)("div",{className:"fx-main",children:d===void 0?(0,m.jsx)(dn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):p===void 0?(0,m.jsx)(dn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):I===void 0||I.status==="loading"?(0,m.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,m.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):I.status==="failed"?(0,m.jsx)(dn,{title:t("state.failed.title"),description:I.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>ft(""),testId:"fs-failed"}):I.nodes.length===0?(0,m.jsx)(dn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"fx-tree-pane",style:H===null?void 0:{"--fx-tree-width":`${H}px`},children:(0,m.jsx)(Tr,{rows:gn,selectedPath:g,entryFocus:_r,t,onToggle:Kr,onSelect:c=>u.open(c),onRetry:ft,onEntryFocusSettled:Br})}),(0,m.jsx)("div",{ref:M,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":H??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Or,onPointerMove:Wr,onPointerUp:pn,onPointerCancel:pn,onLostPointerCapture:pn,onKeyDown:zr,onDoubleClick:yn}),(0,m.jsxs)("div",{className:"fx-editor",children:[(0,m.jsx)(hr,{panels:k.panels,active:k.active,t,onActivate:c=>u.activate(c),onClose:c=>u.close(c),onStep:c=>c===1?u.next():u.previous()}),(0,m.jsx)("div",{className:"fx-editor-body",children:k.panels.length===0?(0,m.jsx)(vr,{t}):k.panels.map((c,y)=>{let R=c.path===k.active;return(0,m.jsx)("div",{className:"fx-panel",id:`fx-panel-${y}`,role:"tabpanel","aria-labelledby":`fx-tab-${y}`,hidden:!R,"data-line":c.line,"data-testid":"fs-panel",children:(0,m.jsx)(cr,{sessionId:d,files:p,path:c.path,t,visible:R,renderers:i})},c.path)})})]})]})}),I?.status==="ready"?(0,m.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,m.jsxs)("span",{children:[t("view.scope")," ",(0,m.jsx)("b",{children:I.nodes.length})," ",t("head.entries")]}),I.truncated?(0,m.jsx)("span",{className:"fx-foot-warn",children:Se({entries:I.nodes,truncated:!0,total:I.total}).label}):null,(0,m.jsxs)("span",{className:"fx-foot-git","data-state":ve===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,m.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":$r,"aria-hidden":"true"}),ve===void 0?t("status.unavailable"):ve===0?t("status.clean"):t("status.summary").replace("{count}",String(ve))]}),ut===null?null:(0,m.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[ut,F?.upstream!==void 0&&(F.ahead??0)>0?(0,m.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(F.ahead)}`}):null,F?.upstream!==void 0&&(F.behind??0)>0?(0,m.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(F.behind)}`}):null]}),(0,m.jsx)("span",{className:"fx-spacer"}),(0,m.jsx)("span",{children:t("foot.order")})]}):null]})}return f}var Lr=["slots","locale","workbench","remote"];function Ii(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var ln,cn,st,un,Ir,Nr;function Li(e){return Ir=e,un!==void 0||(un=Bt({open:(n,t,r)=>{let o=Ir;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):_t(o)(n,t,r)}})),un}function Ni(){if(st!==void 0)return st;let e=en({warn:n=>Nr?.(n)});for(let n of tt())e.register(n);return st=e,e}var fn;function Dr(e){let n=e.workbench;if(n==null)return()=>{};Nr=l=>e.logger?.warn?.(l);let t=Ni(),r={version:nr,renderers:t,registerRenderer:l=>t.register(l),documents:Li(e)};cn?.();let o=e.provide?.(Xn,r);o===void 0&&e.logger?.warn?.(`${ke}: ctx.provide unavailable, ${Xn} service not registered`),cn=o,ln?.();let i=e.locale.register(ke,{zh:Fn,en:Mn});ln=i;let s=e.locale.bind(ke),f=fr(typeof document>"u"?void 0:document),a=Mr({workbench:n,version:n.version,t:s,files:ir(e),status:dr(e),renderers:t});fn?.();let d=Cn(e,n);return fn=d,e.slots.inject(xn,()=>e.slots.register({name:xn,id:V,order:100,label:()=>In(Ii(e)),locale:ke},a)),()=>{o?.(),cn===o&&(cn=void 0),d(),fn===d&&(fn=void 0),f(),i(),ln===i&&(ln=void 0)}}var Ar={buildTree:We,describeListing:Se,iconFor:ye,computeTreeWindow:ze,flattenTree:He,badgeFor:ge,formatSize:Ve,joinPath:$e,listingPath:_e,parseFocus:Ke,consumeViewRequest:Ee,createPanelStack:Wn,createEscapeHandler:Xe,KEYMAP:Ue,tabLabel:In,normalizeListing:rn,normalizeStatusSnapshot:on,buildWorkspaceMap:je,workspaceTagFor:Oe,parseStatusZ:De,statusTone:Re,statusBadge:Ae,createPreviewLoader:Ze,renderMarkdown:Ye,languageFor:Ce,isMarkdownFile:Fe,describePage:Je,classifyPreviewFailure:Me,normalizePreviewPage:Kn,previewChunkRoute:Jt,canBridgeFile:qe,decideBridge:Pn,focusForFileAddress:En,forwardFocus:Tn,registerAddressBridge:Cn},jr={name:"dsh-fs-explorer",inject:Lr,apply:Dr,__test:Ar};var Di=jr;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
