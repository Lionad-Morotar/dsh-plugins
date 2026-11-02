window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var In=Object.defineProperty;var mo=Object.getOwnPropertyDescriptor;var xo=Object.getOwnPropertyNames;var ho=Object.prototype.hasOwnProperty;var vo=(e,n)=>{for(var t in n)In(e,t,{get:n[t],enumerable:!0})},bo=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of xo(n))!ho.call(e,o)&&o!==t&&In(e,o,{get:()=>n[o],enumerable:!(r=mo(n,o))||r.enumerable});return e};var wo=e=>bo(In({},"__esModule",{value:!0}),e);var aa={};vo(aa,{__test:()=>to,apply:()=>no,boot:()=>br,clientPlugin:()=>ro,default:()=>ia,inject:()=>Qr});module.exports=wo(aa);var Pe=require("react");var Mt="dsh-resource://file/";function Lt(e){try{return decodeURIComponent(e)}catch{return e}}function Le(e){if(!e.startsWith(Mt))return null;let n=e.slice(Mt.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Lt(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),u=a<0?i:i.slice(0,a);return u.length===0?null:{sessionId:o,path:u.split("/").map(Lt).join("/")}}function de(e){return e.slice(e.lastIndexOf("/")+1)}var Dt=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function At(){return Dt.flatMap(e=>[...e.extensions])}function De(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Dt.find(o=>o.extensions.includes(r))?.family??null}var ne="dsh-fs-explorer",Mn="conversation.view",G="fs-explorer";var Ae="fs-explorer";var jt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Ln={chunk:"client.preview.js"},Ge={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var ko={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},So={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Ro=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Wt(e){return typeof e=="string"&&Ro.has(e)}function Ot(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Co(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Ue(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Ot(o.slice(2),i==="1"?7:8);if(a===null)continue;let u=a.fields[0]??"",d=a.rest;if(d===""||u.length<2)continue;if(i==="2"){let c=t[r+1];if(c===void 0||c==="")continue;r+=1,n[d]={status:"renamed"};continue}n[d]={status:Co(u[0]??".",u[1]??".")};continue}if(i==="u"){let a=Ot(o.slice(2),9);if(a===null)continue;let u=a.rest;if(u==="")continue;n[u]={status:"conflicted"}}}}return n}function je(e){return Wt(e)?ko[e]:"neutral"}function Xe(e){return Wt(e)?So[e]:"?"}function Dn(e){return`status.${e}`}function zt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function _t(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Bt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Kt(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Eo=["conflicted","deleted","renamed","added","modified","untracked"];function Po(e){return je(Eo.find(n=>e.has(n))??"modified")}function $t(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),u=r.endsWith("/")?a.length:a.length-1,d="";for(let c=0;c<u;c+=1){let s=a[c];if(s===void 0||s==="")continue;d=d===""?s:`${d}/${s}`;let g=n.get(d);g===void 0?n.set(d,{count:1,present:new Set([o.status])}):(g.count+=1,g.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Po(o.present)});return t}var qt=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Gt=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function To(e){return Gt.test(e)?e.slice(0,e.indexOf("/")):null}function Fo(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function No(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Fo(i[2]??"");a!==""&&Gt.test(a)&&t.push(a)}return t}function Io(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let u=/^\[(.+)\]$/u.exec(a);if(u!==null){o(),r=/^submodule(\s|$)/u.test(u[1]??"");continue}if(!r)continue;let d=/^path\s*=\s*(.*)$/u.exec(a);d!==null&&(t=(d[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Ht(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Vt(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Ye(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let u of Io(r))t.set(u,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let u of No(i))o.add(u);let a=e.get("package.json");if(typeof a=="string"){let u=Ht(a);if(u!==void 0){let d=u.workspaces,c=d!==null&&typeof d=="object"&&!Array.isArray(d)?d.packages:void 0;for(let s of Vt(Array.isArray(d)?d:c))o.add(s)}}for(let u of["turbo.json","lerna.json"]){let d=e.get(u);if(typeof d!="string")continue;let c=Ht(d);if(c!==void 0)for(let s of Vt(c.packages))o.add(s)}for(let u of o){let d=To(u);d!==null&&n.has(d)&&t.set(u,"package")}return t}function Ze(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Mo=new Set(["node_modules",".git","dist","__pycache__"]);function Lo(e){return Mo.has(e)}function Do(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Je(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Lo(r))continue;let o=Do(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Ao=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),jo=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Oo=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Wo=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),zo=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),_o=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Bo=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Xt(e){let n=de(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Ce(e,n="file"){if(n==="directory")return"folder";let t=de(e.toLowerCase());if(Bo.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Xt(t);return r===""?"file":Ao.has(r)?"code":jo.has(r)?"markdown":Oo.has(r)?"data":Wo.has(r)?"image":zo.has(r)?"style":_o.has(r)?"archive":"file"}var Ko={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},$o={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Ee(e){let n=de(e.toLowerCase()),t=Ko[n];if(t!==void 0)return t;let r=Xt(n),o=$o[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Oe(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${jt} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Qe(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),u=Math.floor(Math.max(0,n.scrollTop)/t)-o,d=Math.min(Math.max(u,0),a),c=Math.min(e.length,d+i+o*2);return{rows:e.slice(d,c),startIndex:d,endIndex:c}}function An(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function en(e){return e===""?".":e}function nn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function tn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Yt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=tn(r,o),t.push(r);return t}function Ut(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function rn(e){if(typeof e!="string")return;let n=e.trim(),t=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(t!==null){let a=(t[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return a===""?void 0:{path:a,line:Ut(t[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(r===null)return;let i=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(i!=="")return{path:i,line:Ut(r[2]),absolute:!1}}function Zt(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Jt(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function on(e,n,t,r){let o=[],i=$t(t),a=(u,d)=>{let c=e.get(u);if(!(c===void 0||c.status!=="ready"))for(let s of c.nodes){let g=tn(u,s.name),y=s.kind==="directory",h=y&&n.has(g),C=y||t===void 0?void 0:t[g],R=C?.status??(y?void 0:zt(g,t)),I=C===void 0?void 0:_t(C),P=y?i.get(g):void 0,D=y?Ze(r,g):void 0;if(o.push({type:"entry",path:g,name:s.name,kind:s.kind,depth:d,expanded:h,...s.size===void 0?{}:{size:s.size},...R===void 0?{}:{status:R},...P===void 0?{}:{statusCount:P.count,statusTone:P.tone},...I===void 0?{}:{diff:I},...D===void 0?{}:{tag:D}}),!h)continue;let j=e.get(g);if(j===void 0||j.status==="loading"){o.push({type:"status",key:`${g}:loading`,path:g,depth:d+1,state:"loading"});continue}if(j.status==="failed"){o.push({type:"status",key:`${g}:failed`,path:g,depth:d+1,state:"failed",message:j.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(j.nodes.length===0){o.push({type:"status",key:`${g}:empty`,path:g,depth:d+1,state:"empty"});continue}a(g,d+1),j.truncated&&o.push({type:"status",key:`${g}:truncated`,path:g,depth:d+1,state:"truncated",label:Oe({entries:j.nodes,truncated:!0,total:j.total}).label})}};return a("",0),o}var Ho=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Vo(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function qo(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Ho.has(Vo(n.path)))}function Qt(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=qo(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function an(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var jn="dsh-fs-explorer:bridge",Go="fs-explorer-bridge",rr="dsh-resource://file/**",On="sidebar.right.pane.tab",Uo=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Xo=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Yo=new Set(["makefile","dockerfile","license","readme","changelog"]),Zo=new Set([...At(),...Uo]);function Jo(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function sn(e){if(typeof e!="string"||e==="")return!1;let n=de(e).toLowerCase();if(n==="")return!1;let t=Jo(n);return Xo.has(t)?!1:Yo.has(n)?!0:Zo.has(t)}function Qo(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function ei(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function _n(e,n){if(typeof e!="string")return;let t=Le(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=ei(n,Qo(e));return`${nn(r)?"abs:":"path:"}${r}:${String(o)}`}function Bn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Le(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!sn(r.path))return{action:"keep",reason:"refused"};let o=_n(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function le(e,n){n===void 0?console.warn(`[${ne}] ${e}`):console.warn(`[${ne}] ${e}`,n)}function ni(e){console.debug(`[${ne}] ${e}`)}function Wn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function zn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function he(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function er(e){return he(()=>e.sidebarRightTabs,Wn)??he(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Wn)}function nr(e){return he(()=>e.sidebarRight,zn)??he(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,zn)}function tr(e){return typeof e=="function"?e:()=>{}}var ti="dsh-resource://file/session/probe/src/main.ts";function ri(e){let n=he(()=>(typeof e.candidates=="function"?e.candidates(ti):[]).filter(r=>r.priority==="extension"&&r.id!==jn),t=>Array.isArray(t)&&t.length>0);n!==void 0&&le(`another extension-band tab type already claims ${rr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function oi(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ii(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function ai(e,n){let t=e.viewFocus;if(t?.request?.(G,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(G,n);return(!r.opened||r.focused)&&t?.take(G),r}return typeof e.openView=="function"&&e.openView(G,n)?(t?.take(G),{opened:!0,focused:!0}):(t?.take(G),{opened:!1,focused:!1})}function Kn(e,n,t,r){let o;try{o=ai(e,r)}catch(i){return le("the file workbench threw while switching views",i),e.viewFocus?.take(G),!1}if(!o.opened)return le(`the file workbench did not switch to ${G}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return le("the forwarded tab could not be closed",i),!1}}function si(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,u=oi(i),d=ii(i),c=(0,Pe.useRef)(void 0);return(0,Pe.useEffect)(()=>{if(a===void 0){le("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(c.current===a)return;c.current=a;let s=Bn(u,e.currentSessionId(),d);if(s.action!=="open"){le(`left the forwarded tab standing (${s.reason})`,u);return}Kn(e,n,a,s.focus)},[a,u,d]),null}return function(o){return typeof o.useTabInfo!="function"?(le(`the host did not inject useTabInfo into ${On}; the bridge cannot forward`),null):(0,Pe.createElement)(t,{useTabInfo:o.useTabInfo})}}function $n(e,n){let t=(u,d)=>{if(u===void 0||d===void 0)return;ri(u);let c;try{c=u.register({id:jn,kind:Go,patterns:[rr],priority:"extension",canOpen:y=>{let h=Le(y);return h!==null&&sn(h.path)},title:y=>de(Le(y)?.path??y)||y})}catch(y){le("the sidebar right refused the address bridge tab type",y);return}let s=si(n,d),g;try{g=tr(e.slots.inject(On,()=>e.slots.register({name:On,key:jn},s)))}catch(y){c(),le("the sidebar right refused the address bridge body",y);return}return()=>{g(),c()}},r=er(e),o=nr(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return ni("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],u=>{let d=he(()=>u.get?.("sidebarRightTabs"),Wn)??er(u),c=he(()=>u.get?.("sidebarRight"),zn)??nr(u);return t(d,c)});return tr(a)}var Hn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Vn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function qn(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Hn:Vn)["tab.label"]??"Files"}var di=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ce(e){return e!==null&&typeof e=="object"}function dn(e,n){return{ok:!1,code:e,message:n}}function ln(e){let n=ce(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return dn(t,r)}function Gn(){return dn("invalid-response","the document service answered an invalid response")}function Un(e){try{return e()}catch{return}}function li(e){let n=ce(e)?e:void 0;if(n===void 0)return Gn();if(n.ok===!1)return ln(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ce(t)?t:void 0;if(r===void 0)return Gn();if(r.ok===!1)return ln(r.error);let o=ce(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Gn():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function ci(e){let n=ce(e)?e:void 0;if(n===void 0)return or();if(n.ok===!1)return ln(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ce(t)?t:void 0;if(r===void 0)return or();if(r.ok===!1)return ln(r.error);let o=ce(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function or(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Xn(e){return ce(e)&&typeof e.open=="function"}function ir(e){return()=>{let n=Un(()=>e.fsExplorerDocuments);if(Xn(n))return n;let t=Un(()=>ce(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Xn(t))return t;let r=Un(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Xn(r))return r}}function ar(e){let n=ir(e);return async(t,r,o)=>{let i=n();if(i===void 0)return dn("unavailable","the document service is unavailable");try{return li(await i.open({sessionId:t,path:r},o))}catch(a){return dn("io-error",a instanceof Error?a.message:String(a))}}}function sr(e){let n=ir(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return ci(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function dr(e){let n=new Map,t=new Set,r=0,o=(u,d)=>`${u}\0${d}`,i=()=>{r+=1;for(let u of[...t])u()},a=(u,d)=>n.get(o(u,d))?.session;return{acquire(u,d){let c=o(u,d),s=n.get(c);return s===void 0&&(s={session:new Yn(u,d,e.open,e.save,()=>{n.delete(c),i()},i)},n.set(c,s),i()),s.session.retain(),s.session},peek(u,d){return a(u,d)?.getSnapshot()},find:a,forget(u,d){n.get(o(u,d))?.session.abandon()},subscribe(u){return t.add(u),()=>{t.delete(u)}},revision:()=>r}}var Yn=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=di;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var cn=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function ui(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function lr(e,n,t=ui()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),u=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===u}function cr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function fi(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Zn(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function un(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&fi(n),e.onClose?.()}}var Te=require("react");function fn(e){let n=de(e);return n===""?e:n}function Jn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var pi=Object.freeze({panels:Object.freeze([]),active:null});function Qn(){let e=[],n=null,t=pi,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(c=>c.path===d),a=d=>{let c=Jn(d,!0);if(c===void 0)return;if(i(c)>=0)return c;let s=Jn(d,!1);if(!(s===void 0||s===c))return i(s)>=0?s:void 0},u=d=>{if(e.length===0)return;let c=n===null?-1:i(n),s=e[(c+d+e.length)%e.length];s===void 0||s.path===n||(n=s.path,o())};return{open(d,c=1,s=!1){let g=Jn(d,s);if(g===void 0)return;let y=Number.isFinite(c)&&c>0?Math.trunc(c):1,h=i(g);if(h>=0){let R=e[h],I=R!==void 0&&(R.line!==y||R.absolute!==s);if(I&&(e=e.map((P,D)=>D===h?{path:g,line:y,absolute:s}:P)),n===g){I&&o();return}n=g,o();return}let C=n===null?e.length:i(n)+1;e=[...e.slice(0,C),{path:g,line:y,absolute:s},...e.slice(C)],n=g,o()},close(d){let c=d===void 0?n:a(d)??null;if(c===null)return;let s=i(c);s<0||(e=e.filter(g=>g.path!==c),n===c&&(n=(e[s]??e[s-1])?.path??null),o())},activate(d){let c=a(d);c===void 0||i(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let c=a(d);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(d=>d.path===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function ur(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Qn();return e.set(t,o),o}}}function We(e,n){let t=rn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute),!0)}var T=require("react/jsx-runtime"),et={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},yi=()=>()=>{},gi=()=>"";function mi(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function fr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:u}){let d=(0,Te.useRef)(null);(0,Te.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let c=(0,Te.useSyncExternalStore)(a?.subscribe??yi,()=>mi(a,u,e).join("\0"),gi),s=new Set(c===""?[]:c.split("\0"));if(e.length===0)return null;let g=y=>{if(y.key==="ArrowRight"||y.key==="ArrowLeft"){y.preventDefault(),y.stopPropagation(),i(y.key==="ArrowRight"?1:-1);return}(y.key==="Delete"||y.key==="Backspace")&&n!==null&&(y.preventDefault(),y.stopPropagation(),o(n))};return(0,T.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((y,h)=>{let C=y.path===n,R=fn(y.path),I=t("panel.close").replace("{name}",R);return(0,T.jsxs)("div",{className:"fx-tab","data-active":C?"true":"false","data-dirty":s.has(y.path)?"true":"false",role:"presentation",children:[(0,T.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${h}`,"aria-controls":`fx-panel-${h}`,"aria-selected":C,tabIndex:C?0:-1,title:y.path,"data-testid":"fs-tab","data-path":y.path,ref:C?d:void 0,onClick:()=>r(y.path),children:[(0,T.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Ce(y.path),"aria-hidden":"true",children:Ee(y.path)}),(0,T.jsx)("span",{className:"fx-tab-name",children:R}),s.has(y.path)?(0,T.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,T.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:C?0:-1,"aria-label":I,title:I,"data-testid":"fs-tab-close",onClick:()=>o(y.path),children:"\xD7"})]},y.path)})})}function pr({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,T.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,T.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,T.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,T.jsx)("span",{className:"fx-spacer"}),(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function xi(){return(0,T.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,T.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,T.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function yr({t:e}){return(0,T.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,T.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,T.jsx)(xi,{})}),(0,T.jsx)("strong",{children:e("panel.empty.title")}),(0,T.jsx)("span",{children:e("panel.empty.description")}),(0,T.jsxs)("span",{className:"fx-empty-keys",children:[(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,T.jsx)("span",{children:e("panel.empty.keys")})]})]})}var gr=require("react");function V(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,gr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function hi(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var vi=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function ve(e){let n=[],t=0;for(let r of e.matchAll(vi)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(V("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(V("strong",null,...ve(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(V("del",null,...ve(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(V("em",null,...ve(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),u=a?.[1]??i,d=a===null?void 0:hi(a[2]??"");n.push(d===void 0?u:V("a",{href:d,rel:"noreferrer noopener"},u))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var mr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,xr=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,hr=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,nt=/^\s{0,3}>\s?(.*)$/u,tt=/^\s{0,3}[-*+]\s+(.*)$/u,rt=/^\s{0,3}\d+[.)]\s+(.*)$/u;function bi(e){return mr.test(e)||xr.test(e)||hr.test(e)||nt.test(e)||tt.test(e)||rt.test(e)}function vr(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=mr.exec(r);if(o!==null){let c=(o[1]??"```").slice(0,1),s=o[2]??"",g=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${c}{3,}\\s*$`,"u").test(e[t]??"");)g.push(e[t]??""),t+=1;t+=1,n.push(V("pre",null,V("code",s===""?null:{className:`language-${s}`},g.join(`
`))));continue}let i=xr.exec(r);if(i!==null){let c=(i[1]??"#").length;n.push(V(`h${String(c)}`,null,...ve(i[2]??""))),t+=1;continue}if(hr.test(r)){n.push(V("hr",null)),t+=1;continue}if(nt.test(r)){let c=[];for(;t<e.length;){let s=nt.exec(e[t]??"");if(s===null)break;c.push(s[1]??""),t+=1}n.push(V("blockquote",null,...vr(c)));continue}if(tt.exec(r)!==null){let c=[];for(;t<e.length;){let s=tt.exec(e[t]??"");if(s===null)break;c.push(V("li",null,...ve(s[1]??""))),t+=1}n.push(V("ul",null,...c));continue}if(rt.exec(r)!==null){let c=[];for(;t<e.length;){let s=rt.exec(e[t]??"");if(s===null)break;c.push(V("li",null,...ve(s[1]??""))),t+=1}n.push(V("ol",null,...c));continue}let d=[r.trim()];for(t+=1;t<e.length;){let c=e[t]??"";if(c.trim()===""||bi(c))break;d.push(c.trim()),t+=1}n.push(V("p",null,...ve(d.join(" "))))}return n}function pn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return V("div",{className:"fx-md"},...vr(n))}var ot=200,wi={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Be(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":wi[t.slice(r+1)]??"plaintext"}function Ke(e){return Be(e)==="markdown"}var be=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function ze(e){return e!==null&&typeof e=="object"}function ki(e){return e===""?0:e.split(`
`).length}function it(e,n){if(!ze(e))throw new be("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=ze(e.error)?e.error:{},d=typeof u.code=="string"?u.code:"preview/unknown",c=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=ze(u.details)?u.details:{},g=typeof s.kind=="string"?s.kind:"";throw new be(d,c,g)}let t=e.ok===!0?e.value:e;if(!ze(t)||typeof t.text!="string")throw new be("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):ki(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:t.text,lines:r,offset:i,eof:a}:{text:t.text,lines:r,offset:i,totalLines:o,eof:a}}function $e(e){let n=ze(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var _e=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function yn({files:e,maxLines:n=ot}){let t=Math.max(1,Math.trunc(n)),r=_e,o=0,i=null,a=[1],u=new Set,d=s=>{r=s;for(let g of u)g()},c=async(s,g)=>{o+=1;let y=o;i?.abort();let h=new AbortController;i=h,d({status:"loading",path:s,text:r.path===s?r.text:"",offset:g,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let C=await e.read(s,g>1?{offset:g,limit:t}:{limit:t},h.signal);if(y!==o)return;let R=it(C,g);if(R.lines===0&&g>1){d({...r,status:"ready",eof:!0,text:"",lines:0});return}d(R.totalLines===void 0?{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,eof:R.eof}:{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,totalLines:R.totalLines,eof:R.eof})}catch(C){if(y!==o||h.signal.aborted)return;d({status:"failed",path:s,text:"",offset:g,lines:0,eof:!1,failure:$e(C)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(s){return u.add(s),()=>{u.delete(s)}},async open(s){a=[1],await c(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(a.push(s),await c(r.path,s))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let s=a[a.length-1]??1;await c(r.path,s)},async retry(){r.path!==void 0&&await c(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],d(_e)}}}function gn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var at=Object.freeze({chunk:Ln.chunk,id:`${ne}/${Ln.chunk}`}),st=null,He=null,mn=new Map;function br(e){st=e}function wr(){return at}function Si(e){let n=Ge[e];return{chunk:n,id:`${ne}/${n}`}}function dt(){if(He!==null)return He;let e=st;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ne}: the loader require was not handed over`));let n=e.async(`./${at.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ne}: chunk ${at.id} is missing its preview renderers`);return r});return He=n,n.catch(()=>{He===n&&(He=null)}),n}function kr(e){let n=mn.get(e);if(n!==void 0)return n;let t=st;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ne}: the loader require was not handed over`));let r=Si(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${ne}: chunk ${r.id} is not the ${e} view`);return a});return mn.set(e,o),o.catch(()=>{mn.get(e)===o&&mn.delete(e)}),o}var E=require("react");async function lt(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var ue=require("react/jsx-runtime");function Ri(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Ci(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function ct({failure:e,t:n,onRetry:t}){return(0,ue.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,ue.jsx)("strong",{children:Ri(e,n)}),(0,ue.jsx)("span",{children:Ci(e,n)}),e.message===""?null:(0,ue.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,ue.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function ut({t:e}){return(0,ue.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,ue.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var ft="fsExplorer",Sr=1;function Ei(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Pi(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Ti(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Fi(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function xn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Pi),families:[...i.match?.families??[]]}),o();let u=!0;return()=>{u&&(u=!1,t.delete(a),o())}},resolve(i){let a=Ei(i.path),u=De(i.path),d;for(let c of t.values())Ti(c,a,u)&&(d===void 0||Fi(c.contribution,d.contribution))&&(d=c);return d?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Rr(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function hn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Fe(e){try{return e()}catch{return}}function Pr(e){return()=>{let n=Fe(()=>e.workspaceFiles);if(hn(n))return n;let t=Fe(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(hn(t))return t;let r=Fe(()=>e.remote?.workspaceFiles);if(hn(r))return r;let o=Fe(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(hn(o))return o}}function Tr(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function vn(e){return e!==null&&typeof e=="object"}function Ni(e){if(!vn(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=vn(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Ii(e){let n=vn(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=vn(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new be(t,r,i)}function gt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ni(await n.call(e,t,r,{},o));if(!i.ok)throw Ii(i.error);return i.value.data}}function Ve(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function pt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function bn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Ve(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?pt(r.value):{ok:!1,message:Ve(r.error)}}return pt(t)}return pt(n)}function Fr(e){return e instanceof Error?e.message:Ve(e)}function Cr(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Nr(e){return()=>{let n=Fe(()=>e.remote?.gitExplorer);if(Cr(n))return n;let t=Fe(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Cr(t))return t}}function Er(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Mi(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Er(r.additions),i=Er(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Li(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function yt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Mi(n.stats),r=Li(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function wn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Ve(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?yt(o.snapshot):{ok:!1,message:Ve(o.error)}}let r=e;return r.snapshot!==void 0?yt(r.snapshot):yt(t)}var v=require("react/jsx-runtime"),vt={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Di=()=>()=>{},Ir=()=>{};function bt(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var mt={status:"idle"},Ai=[".md",".mdx",".markdown",".mdown"],ji=-1e3;function ht({t:e}){return(0,v.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,v.jsx)("strong",{children:e("preview.unavailable.title")}),(0,v.jsx)("span",{children:e("preview.unavailable.description")})]})}function Mr({chunk:e,text:n,path:t,offset:r}){let o=(0,E.useRef)(null),i=(0,E.useRef)(null),[a,u]=(0,E.useState)(!1),d=Be(t);return(0,E.useEffect)(()=>{u(!1)},[e,t]),(0,E.useEffect)(()=>{let c=o.current;if(!(e===null||c===null))try{let s=e.mountCodePreview(c,{text:n,language:d,path:t,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{u(!0);return}},[e,t,d]),(0,E.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,v.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Oi({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Ke(n)?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:pn(r)}):(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Wi(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,v.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,v.jsx)(Mr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function zi(e){function n({page:t,path:r}){return(0,v.jsx)(Mr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function _i({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i}){let a=(0,E.useMemo)(()=>gt(r),[r]);return t===void 0||a===void 0?(0,v.jsx)(ht,{t:o}):(0,v.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:a,t:o,visible:i})}function Bi(e){return{Body:n=>(0,v.jsx)(_i,{chunk:e,...n}),renderer:e.renderer}}function wt(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Ai]},priority:0,load:()=>dt().then(Wi)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:ji,load:()=>dt().then(zi)},...Object.keys(Ge).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>kr(e).then(Bi)}))]}var xt;function Ki(){if(xt!==void 0)return xt;let e=xn();for(let n of wt())e.register(n);return xt=e,e}function Lr({sessionId:e,files:n,path:t,t:r,visible:o=!0,renderers:i,documents:a}){let u=(0,E.useMemo)(()=>Tr(n,e),[n,e]),d=(0,E.useMemo)(()=>gt(n),[n]),c=i??Ki(),s=t===void 0?null:De(t),g=s!==null,y=e!==void 0&&d!==void 0?{sessionId:e,readFile:d}:null,[h,C]=(0,E.useState)(null),[R,I]=(0,E.useState)(_e),[P,D]=(0,E.useState)(mt),[j,$]=(0,E.useState)(0),[_,ke]=(0,E.useState)(0),[fe,pe]=(0,E.useState)("reading"),[J,f]=(0,E.useState)(!1),[m,b]=(0,E.useState)(!1),[A,U]=(0,E.useState)(!1),Q=(0,E.useRef)(void 0),B=(0,E.useRef)(void 0),M=(0,E.useSyncExternalStore)(a?.subscribe??Di,()=>a===void 0||e===void 0||t===void 0?Ir():a.peek(e,t),Ir),K=a===void 0||e===void 0||t===void 0?void 0:a.find(e,t);if((0,E.useEffect)(()=>{if(u===void 0){C(null);return}let L=yn({files:u,maxLines:ot});return C(L),()=>L.close()},[u]),(0,E.useEffect)(()=>{if(h===null){I(_e);return}return I(h.getSnapshot()),h.subscribe(()=>I(h.getSnapshot()))},[h]),(0,E.useEffect)(()=>{h===null||t===void 0||s!==null||h.open(t)},[h,t,s]),(0,E.useEffect)(()=>{pe("reading"),f(!1),U(!1)},[t]),(0,E.useEffect)(()=>()=>{Q.current!==void 0&&clearTimeout(Q.current),B.current!==void 0&&clearTimeout(B.current)},[]),(0,E.useEffect)(()=>{M?.conflict!==!0&&(b(!1),U(!1),B.current!==void 0&&clearTimeout(B.current))},[M?.conflict]),(0,E.useEffect)(()=>c.subscribe(()=>$(L=>L+1)),[c]),(0,E.useEffect)(()=>{if(t===void 0){D(mt);return}let L=Rr(c,{path:t});if(L===void 0){D(mt);return}let{contribution:Y}=L,Z=!0;return D(ie=>ie.status==="ready"&&ie.contribution.id===Y.id?ie:{status:"loading",contribution:Y}),L.module.then(ie=>{Z&&D({status:"ready",contribution:Y,module:ie})},ie=>{Z&&D({status:"failed",contribution:Y,failure:$e(ie)})}),()=>{Z=!1}},[c,t,j,_]),t===void 0)return(0,v.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,v.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,v.jsx)("strong",{children:r("preview.empty.title")}),(0,v.jsx)("span",{children:r("preview.empty.description")})]})});let q=gn(R),W=!g&&Ke(t),z=g?y!==null&&P.status!=="ready"&&P.status!=="failed":R.status==="loading",Ne=R.status==="ready",te=W&&fe==="reading",qe=g?y===null?"unavailable":P.status==="failed"?"failed":P.status==="ready"?"ready":"loading":R.status,re=P.status==="ready"?P.module.renderer??P.contribution.id:g?"pending":te?"fallback":"plain",oe={path:t,sessionId:e,files:n,t:r,visible:o,mode:fe,...g?{}:{page:{text:R.text,offset:R.offset}}},ye=()=>{lt(t).then(L=>{L&&(f(!0),Q.current!==void 0&&clearTimeout(Q.current),Q.current=setTimeout(()=>f(!1),1400))})},Ie=()=>{let L=K?.copyDraft();L!==void 0&&lt(L).then(Y=>{Y&&(b(!0),B.current!==void 0&&clearTimeout(B.current),B.current=setTimeout(()=>b(!1),1400))})},ee=M?.error,O=ee!=null&&M?.conflict!==!0,X=M?.conflict===!0,ge=M?.discarded??null,Se=!X&&ge!==null&&M?.dirty!==!0,me;if(g){let L=P.status==="ready"?P.module.Body:void 0;me=y===null?(0,v.jsx)(ht,{t:r}):P.status==="failed"?(0,v.jsx)(ct,{failure:P.failure,t:r,onRetry:()=>ke(Y=>Y+1)}):L===void 0?(0,v.jsx)(ut,{t:r}):(0,v.jsx)(L,{...oe})}else if(u===void 0)me=(0,v.jsx)(ht,{t:r});else if(R.status==="failed")me=(0,v.jsx)(ct,{failure:R.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{h?.retry()}});else if(!Ne)me=(0,v.jsx)(ut,{t:r});else{let L=P.status==="ready"?P.module.Body:Oi;me=(0,v.jsx)(L,{...oe})}return(0,v.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":qe,"data-mode":g?"binary":te?"reading":"code","data-renderer":re,children:[(0,v.jsxs)("header",{className:"fx-preview-bar",children:[(0,v.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),g?null:(0,v.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[q.range,q.range==="\u2014"?null:(0,v.jsxs)(v.Fragment,{children:[" ",r("preview.lines")]}),q.total===void 0?null:(0,v.jsxs)("span",{className:"fx-preview-total",children:[" / ",q.total," ",r("preview.lines")]})]}),(0,v.jsxs)("div",{className:"fx-preview-actions",children:[M===void 0?null:(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!M.dirty||M.saving||M.status!=="ready",onClick:()=>{K?.save()},children:M.saving?r("preview.saving"):r("preview.save")}),W?(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>pe(L=>L==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(fe==="reading"?"preview.source":"preview.reading")}):null,g?null:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Ne||z||R.offset<=1,onClick:()=>{h?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Ne||z||R.eof,onClick:()=>{h?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:ye,"data-testid":"fs-preview-copy",children:r(J?"preview.copied":"preview.copyPath")}),z?(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),X||Se?(0,v.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":X?"conflict":"discarded",children:[(0,v.jsx)("strong",{children:r(X?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,v.jsx)("span",{className:"fx-conflict-hint",children:r(X?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,v.jsx)("span",{className:"fx-spacer"}),X?(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":A?"discard":void 0,onClick:()=>{if(!A&&M?.dirty===!0){U(!0);return}U(!1),K?.reload({force:!0})},children:r(A?"preview.conflict.discard":"preview.conflict.reload")}):null,Se?(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{ge!==null&&K?.setDraft(ge)},children:r("preview.conflict.restore")}):null,X?(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Ie,children:r(m?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,O?(0,v.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:r("preview.saveFailed").replace("{message}",bt(ee?.code??"io-error",ee?.message??"",r))}):null,(0,v.jsx)("div",{className:"fx-preview-body","data-scroll":te?"y":"none",children:me})]})}var Dr="dsh-fs-explorer-styles",$i=`
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
`;function Ar(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Dr}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Dr,t.textContent=$i,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var kt="fs-explorer.treePaneWidth";function St(e){return Math.min(520,Math.max(180,e))}function Or(e){if(e==null)return null;let n;try{n=e.getItem(kt)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function kn(e,n){let t=Math.round(St(n));if(e!=null)try{e.setItem(kt,String(t))}catch{}return t}function Wr(e){if(e!=null)try{e.removeItem(kt)}catch{}}function zr(e,n){return Math.round(e)===Math.round(n)}var jr=16;function _r(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-jr};case"ArrowRight":return{kind:"nudge",delta:jr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var N=require("react");function Kr(e,n,t,r=800){return t-n<=r?e:""}function $r(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Hr(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Hi(e,t+1,r.depth,r.depth+1)}function Hi(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Vi=/^.$/u;function Vr(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Vi.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Br(e.names,n),u=a.find(d=>d>e.active)??a[0];return u===void 0?{kind:"miss"}:{kind:"jump",index:u,query:n}}let t=`${e.query}${n}`,r=Br(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Br(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var S=require("react/jsx-runtime"),we=22;function Rt({open:e=!0,size:n=14}){return(0,S.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,S.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function qi(){return(0,S.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function qr(){return(0,S.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,S.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,S.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Gr(){return(0,S.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Gi({name:e}){return(0,S.jsx)("span",{className:"fx-badge","data-icon":Ce(e),"aria-hidden":"true",children:Ee(e)})}function Ui({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:u}){let d=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,S.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:c,onClick:()=>{u(e.path),d?i(e.path):a(e.path)},children:[(0,S.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,S.jsx)(qi,{})}),d?(0,S.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,S.jsx)(Rt,{open:e.expanded})}):(0,S.jsx)(Gi,{name:e.name}),(0,S.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,S.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,S.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":je(e.status),"data-testid":"fx-file-status",title:o(Dn(e.status)),"aria-label":o(Dn(e.status)),children:Xe(e.status)}),e.statusCount===void 0?null:(0,S.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,S.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,S.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,S.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,S.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,S.jsx)("span",{className:"fx-size",children:an(e.size)})]})}function Xi({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,S.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,S.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,S.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,S.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Yi(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Ur({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:u}){let d=(0,N.useRef)(null),[c,s]=(0,N.useState)(0),[g,y]=(0,N.useState)(0),[h,C]=(0,N.useState)(void 0),R=(0,N.useRef)(void 0),I=(0,N.useRef)({query:"",at:0}),P=(0,N.useRef)(void 0),D=(0,N.useRef)(void 0),j=(0,N.useRef)(h);j.current=h;let $=(0,N.useMemo)(()=>e.flatMap((f,m)=>f.type==="entry"?[m]:[]),[e]);(0,N.useEffect)(()=>{let f=D.current!==n;if(D.current=n,P.current!==void 0||n===void 0)return;let m=j.current===void 0?void 0:e[j.current];if(!Zt({cursorPath:m?.type==="entry"?m.path:void 0,selectionMoved:f}))return;let b=e.findIndex(A=>A.type==="entry"&&A.path===n);b>=0&&C(b)},[n,e]),(0,N.useEffect)(()=>{let f=P.current;if(f===void 0)return;let m=e.findIndex(U=>U.type==="entry"&&U.path===f),b=e[m];if(b?.type!=="entry"||b.kind!=="directory"||!b.expanded){P.current=void 0;return}let A=Jt(e,f);A!==void 0&&(P.current=void 0,C(A))},[e]),(0,N.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&C(void 0)},[e,h]),(0,N.useEffect)(()=>{let f=d.current;if(h===void 0||f===null)return;let m=An({scrollTop:f.scrollTop,viewport:f.clientHeight,rowHeight:we,index:h});m!==f.scrollTop&&(f.scrollTop=m)},[h]);let _=(0,N.useCallback)(f=>{C(f),d.current?.focus({preventScroll:!0})},[]),ke=(0,N.useCallback)(f=>{let m=e.findIndex(b=>b.type==="entry"&&b.path===f);m>=0&&C(m)},[e]),fe=(0,N.useCallback)(f=>{if(f.nativeEvent.isComposing||f.altKey||f.metaKey||f.ctrlKey)return;let m=$.at(-1);if(f.key==="ArrowDown"){if(f.preventDefault(),h===void 0){$[0]!==void 0&&_($[0]);return}let W=$.find(z=>z>h);W!==void 0&&_(W);return}if(f.key==="ArrowUp"){if(f.preventDefault(),h===void 0){m!==void 0&&_(m);return}let W=[...$].reverse().find(z=>z<h);W!==void 0&&_(W);return}if(h===void 0)return;let b=e[h];if(b===void 0||b.type!=="entry")return;if(f.key==="ArrowRight"){if(f.preventDefault(),b.kind==="directory"&&!b.expanded)P.current=b.path,o(b.path);else{let W=$.find(z=>z>h);W!==void 0&&e[W]?.depth===b.depth+1&&_(W)}return}if(f.key==="ArrowLeft"){if(f.preventDefault(),b.kind==="directory"&&b.expanded)o(b.path);else{let W=[...$].reverse().find(z=>z<h&&e[z]?.type==="entry"&&e[z].depth<b.depth);W!==void 0&&_(W)}return}if(f.key==="Enter"&&b.kind!=="directory"){f.preventDefault(),i(b.path);return}if(f.key==="Home"){f.preventDefault(),$[0]!==void 0&&_($[0]);return}if(f.key==="End"){f.preventDefault(),m!==void 0&&_(m);return}let A=Date.now(),U=$r(e,h),Q=Hr(e,U),B=Q.map(W=>{let z=e[W];return z?.type==="entry"?z.name:""}),M=Vr({query:Kr(I.current.query,I.current.at,A),key:f.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:f.nativeEvent.repeat,names:B,active:h===void 0?-1:Q.indexOf(h)});if(M.kind==="clear"){I.current={query:"",at:0};return}if(M.kind!=="jump")return;let K=Q[M.index];if(K===void 0)return;let q=e[K];q?.type==="entry"&&(I.current={query:M.query,at:A},f.preventDefault(),_(K),q.kind!=="directory"&&i(q.path))},[h,$,_,o,i,e]);(0,N.useEffect)(()=>{let f=d.current;if(f===null)return;let m=()=>y(f.clientHeight);if(m(),typeof ResizeObserver>"u")return;let b=new ResizeObserver(m);return b.observe(f),()=>b.disconnect()},[]),(0,N.useEffect)(()=>{if(n===void 0)return;let f=d.current;if(f===null)return;let m=e.findIndex(A=>A.type==="entry"&&A.path===n);if(m<0)return;let b=m*we;(b<f.scrollTop||b+we>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,b-f.clientHeight/2))},[n,e]),(0,N.useEffect)(()=>{if(t===void 0||R.current===t)return;let f=d.current;if(f===null)return;let m=t.path===void 0?-1:e.findIndex(b=>b.type==="entry"&&b.path===t.path);if(!(t.path!==void 0&&m<0)){if(R.current=t,m>=0){let b=An({scrollTop:f.scrollTop,viewport:f.clientHeight===0?480:f.clientHeight,rowHeight:we,index:m});b!==f.scrollTop&&(f.scrollTop=b,s(b)),C(m)}Yi(f),u?.()}},[t,e,u]);let pe=f=>{s(f.currentTarget.scrollTop)},J=Qe(e,{scrollTop:c,height:g===0?480:g,rowHeight:we});return(0,S.jsx)("div",{className:"fx-scroll",ref:d,onScroll:pe,onKeyDown:fe,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,S.jsx)("div",{className:"fx-vlist",style:{height:e.length*we},children:J.rows.map((f,m)=>{let b=(J.startIndex+m)*we;return f.type==="entry"?(0,S.jsx)(Ui,{row:f,top:b,selected:f.path===n,cursor:h===J.startIndex+m,t:r,onToggle:o,onSelect:i,onRowActivate:ke},f.path):(0,S.jsx)(Xi,{row:f,top:b,t:r,onRetry:a},f.key)})})})}var w=require("react/jsx-runtime");var Zi=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ji(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Qi=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Yr=new Map;function ea(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Sn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,w.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,w.jsx)("strong",{children:e}),n===void 0?null:(0,w.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,w.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function na(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Zr({workbench:e,version:n,t,files:r,status:o,renderers:i,documents:a}){let u=ur();function d(c){let s=c.sessionId??e.currentSessionId(),g=(0,x.useRef)(s);g.current=s;let y=(0,x.useMemo)(()=>r(),[r]),h=(0,x.useMemo)(()=>o(),[o]),[C,R]=(0,x.useState)(()=>new Map),[I,P]=(0,x.useState)(void 0),[D,j]=(0,x.useState)(void 0),[$,_]=(0,x.useState)(void 0),[ke,fe]=(0,x.useState)(Yr),pe=(0,x.useRef)(C);pe.current=C;let[J,f]=(0,x.useState)(()=>new Set),m=(0,x.useMemo)(()=>u.forSession(s),[u,s]),b=(0,x.useSyncExternalStore)(m.subscribe,m.snapshot,m.snapshot),A=b.active??void 0,[U,Q]=(0,x.useState)(0),B=(0,x.useRef)(new Map),M=(0,x.useRef)(void 0),[K,q]=(0,x.useState)(null),[W,z]=(0,x.useState)(!1),[Ne,te]=(0,x.useState)(null),qe=(0,x.useRef)(null);qe.current=K?.path??null;let re=(0,x.useMemo)(()=>Ji(),[]),[oe,ye]=(0,x.useState)(()=>Or(re)),Ie=(0,x.useRef)(null),ee=(0,x.useRef)(null),O=C.get(""),X=O?.status==="ready",ge=(0,x.useCallback)((l,p,k)=>{m.open(l,p,k)},[m]),Se=(0,x.useCallback)(l=>{let p=l??m.snapshot().active??void 0;if(p===void 0)return;if((s===void 0?void 0:a?.peek(s,p))?.dirty===!0){te(null),q({path:p});return}q(null),te(null),s!==void 0&&a?.forget(s,p),m.close(p)},[a,s,m]),me=(0,x.useCallback)(()=>{let l=K;if(l===null)return;let p=s===void 0?void 0:a?.find(s,l.path);if(p===void 0){q(null),s!==void 0&&a?.forget(s,l.path),m.close(l.path);return}z(!0),te(null),p.save().then(k=>{if(z(!1),!k.ok){let F=p.getSnapshot().error;te(t("panel.confirm.failed").replace("{message}",bt(k.code,F?.message??"",t)));return}q(null),s!==void 0&&a?.forget(s,l.path),m.close(l.path)})},[a,K,s,m,t]),L=(0,x.useCallback)(()=>{let l=K;q(null),te(null),l!==null&&(s!==void 0&&a?.forget(s,l.path),m.close(l.path))},[a,K,s,m]),Y=(0,x.useCallback)(()=>{q(null),te(null)},[]),Z=(0,x.useCallback)(async(l,p,k)=>{B.current.get(l)?.abort();let F=new AbortController;B.current.set(l,F),R(ae=>new Map(ae).set(l,Zi()));try{let ae=await k.list(p,en(l),F.signal);if(F.signal.aborted||g.current!==p)return!1;let H=bn(ae);if(!H.ok)return R(se=>new Map(se).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:H.message})),!1;let Re=Je(H.listing.entries);return R(se=>new Map(se).set(l,{status:"ready",nodes:Re,truncated:H.listing.truncated===!0,total:H.listing.entries.length})),!0}catch(ae){return F.signal.aborted||R(H=>new Map(H).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:Fr(ae)})),!1}finally{B.current.get(l)===F&&B.current.delete(l)}},[]);(0,x.useEffect)(()=>{for(let l of B.current.values())l.abort();return B.current.clear(),R(new Map),f(new Set),M.current=void 0,s!==void 0&&y!==void 0&&Z("",s,y),()=>{for(let l of B.current.values())l.abort();B.current.clear()}},[s,y,U,Z]),(0,x.useEffect)(()=>{if(s===void 0||h===void 0){P(void 0),j(void 0),_(void 0);return}let l=!0,p=new AbortController;return P(void 0),j(void 0),_(void 0),Promise.resolve().then(()=>h.snapshot({sessionId:s,maxCommits:1},p.signal)).then(k=>{if(!l)return;let F=wn(k);if(!F.ok){P(void 0),j(void 0),_(void 0);return}P(Kt(Ue(F.status),F.stats)),j(F.head),_(F.root)}).catch(()=>{l&&(P(void 0),j(void 0),_(void 0))}),()=>{l=!1,p.abort()}},[s,h,U]),(0,x.useEffect)(()=>{let l=y?.read;if(s===void 0||y===void 0||typeof l!="function"||!X){fe(Yr);return}let p=s,k=new AbortController,F=async(H,Re)=>{try{let se=ea(await l.call(y,p,Re,{},k.signal));return se===void 0?void 0:[H,se]}catch{return}},ae=qt.filter(H=>H!==".gitmodules").map(H=>F(H,H));return $!==void 0&&ae.push(F(".gitmodules",`${$.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(ae).then(H=>{if(k.signal.aborted||g.current!==p)return;let Re=new Map;for(let xe of H)xe!==void 0&&Re.set(xe[0],xe[1]);let se=pe.current.get(""),go=new Set(se?.status==="ready"?se.nodes.filter(xe=>xe.kind==="directory").map(xe=>xe.name):[]);fe(Ye(Re,go))}),()=>k.abort()},[s,y,X,$,U]),(0,x.useEffect)(()=>{let l=c.viewRequest;if(l==null||l.view!==G)return;let p=`${l.view}:${l.focus}`;M.current!==p&&(M.current=p,We(l.focus,{open:ge}),c.completeViewRequest?.())},[c.viewRequest,c.completeViewRequest,ge]),(0,x.useEffect)(()=>{let l=e.viewFocus;if(l===void 0||s===void 0)return;let p=()=>{let k=l.take(G);k!==void 0&&We(k,{open:ge})};return p(),l.subscribe(p)},[e,s,ge]),(0,x.useEffect)(()=>{if(A===void 0||!X||nn(A))return;let l=Yt(A);if(l.length===0||(f(k=>l.every(F=>k.has(F))?k:new Set([...k,...l])),s===void 0||y===void 0))return;let p=l.filter(k=>pe.current.get(k)?.status!=="ready");p.length!==0&&Promise.all(p.map(k=>Z(k,s,y)))},[A,X,s,y,Z]);let ie=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let l=document.querySelector("[data-composer-input]");return l===null?!1:(l.focus(),!0)},[]),oo=(0,x.useCallback)(l=>{if(l.button!==0||ee.current!==null||Qi())return;let p=Ie.current?.previousElementSibling;if(p instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}ee.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:oe},document.body.classList.add("fx-pane-resizing")}},[oe]),io=(0,x.useCallback)(l=>{let p=ee.current;p===null||p.pointerId!==l.pointerId||ye(St(p.baseWidth+l.clientX-p.startX))},[]),Tn=(0,x.useCallback)(l=>{let p=ee.current;if(p===null||p.pointerId!==l.pointerId)return;ee.current=null,document.body.classList.remove("fx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let k=p.baseWidth+l.clientX-p.startX;if(zr(k,p.baseWidth)){ye(p.restWidth);return}ye(kn(re,k))},[re]),Fn=(0,x.useCallback)(()=>{Wr(re),ye(null)},[re]),ao=(0,x.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let p=_r(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(p===null)return;if(l.preventDefault(),l.stopPropagation(),p.kind==="reset"){Fn();return}if(p.kind==="min"||p.kind==="max"){let ae=p.kind==="min"?180:520;ye(kn(re,ae));return}let k=Ie.current?.previousElementSibling,F=k instanceof HTMLElement?k.getBoundingClientRect().width:oe??180;ye(kn(re,F+p.delta))},[re,Fn,oe]);(0,x.useEffect)(()=>()=>{ee.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let l=p=>{if(!(p.isComposing||cr(p.target))){if(na(p)){let k=m.snapshot().active,F=k===null||a===void 0||s===void 0?void 0:a.find(s,k);if(F===void 0)return;p.preventDefault(),p.stopPropagation(),F.save();return}for(let k of cn)if(lr(p,k)){if(k.action==="closePanel"&&m.snapshot().active===null)return;p.preventDefault(),p.stopPropagation(),k.action==="nextPanel"?m.next():k.action==="previousPanel"?m.previous():Se();return}}};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[a,Se,s,m]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let l=un({focusComposer:ie,hasModal:()=>qe.current!==null||Zn(document)}),p=k=>l(k);return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[ie]),(0,x.useEffect)(()=>{if(K===null||typeof document>"u")return;let l=p=>{p.key!=="Escape"||p.isComposing||(p.preventDefault(),p.stopPropagation(),Y())};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[K,Y]);let Nn=(0,x.useMemo)(()=>on(C,J,I,ke),[C,J,I,ke]),[so,Tt]=(0,x.useState)(void 0),Ft=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(Ft.current||typeof document>"u")return;let l=Qt({rows:Nn,panelCount:m.snapshot().panels.length,hasModal:Zn(document)});l.kind!=="skip"&&(Ft.current=!0,l.open!==void 0&&m.open(l.open),Tt({path:l.focus}))},[Nn,m]);let lo=(0,x.useCallback)(()=>Tt(void 0),[]),Me=I===void 0?void 0:Object.keys(I).length,co=I===void 0?"neutral":Object.values(I).some(l=>l.status==="conflicted")?"conflict":Me===0?"success":"warning",Nt=Bt(D),uo=(0,x.useCallback)(l=>{if(s===void 0||y===void 0)return;if(J.has(l)){f(k=>{let F=new Set(k);return F.delete(l),F});return}f(k=>new Set(k).add(l));let p=C.get(l);(p===void 0||p.status==="failed")&&Z(l,s,y)},[J,C,s,y,Z]),It=(0,x.useCallback)(l=>{s===void 0||y===void 0||Z(l,s,y)},[s,y,Z]),fo=()=>f(new Set),po=()=>Q(l=>l+1),yo=s===void 0?"no-session":y===void 0?"no-service":O===void 0||O.status==="loading"?"loading":O.status==="failed"?"failed":O.nodes.length===0?"empty":"tree";return(0,w.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":yo,"data-session":s??"","data-testid":"fs-explorer-view",children:[(0,w.jsxs)("header",{className:"fx-head",children:[(0,w.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,w.jsx)(Rt,{open:!0})}),(0,w.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,w.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,w.jsxs)("div",{className:"fx-head-meta",children:[O?.status==="ready"?(0,w.jsxs)("span",{children:[(0,w.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}):null,(0,w.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:J.size===0,onClick:fo,children:(0,w.jsx)(Gr,{})}),(0,w.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:s===void 0||y===void 0||O?.status==="loading",onClick:po,children:(0,w.jsx)(qr,{})})]})]}),(0,w.jsx)("div",{className:"fx-main",children:s===void 0?(0,w.jsx)(Sn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):y===void 0?(0,w.jsx)(Sn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):O===void 0||O.status==="loading"?(0,w.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,w.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):O.status==="failed"?(0,w.jsx)(Sn,{title:t("state.failed.title"),description:O.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>It(""),testId:"fs-failed"}):O.nodes.length===0?(0,w.jsx)(Sn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("div",{className:"fx-tree-pane",style:oe===null?void 0:{"--fx-tree-width":`${oe}px`},children:(0,w.jsx)(Ur,{rows:Nn,selectedPath:A,entryFocus:so,t,onToggle:uo,onSelect:l=>m.open(l),onRetry:It,onEntryFocusSettled:lo})}),(0,w.jsx)("div",{ref:Ie,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":oe??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:oo,onPointerMove:io,onPointerUp:Tn,onPointerCancel:Tn,onLostPointerCapture:Tn,onKeyDown:ao,onDoubleClick:Fn}),(0,w.jsxs)("div",{className:"fx-editor",children:[(0,w.jsx)(fr,{panels:b.panels,active:b.active,t,onActivate:l=>m.activate(l),onClose:Se,onStep:l=>l===1?m.next():m.previous(),documents:a,sessionId:s}),K===null?null:(0,w.jsx)(pr,{name:fn(K.path),t,saving:W,error:Ne,onSave:me,onDiscard:L,onCancel:Y}),(0,w.jsx)("div",{className:"fx-editor-body",children:b.panels.length===0?(0,w.jsx)(yr,{t}):b.panels.map((l,p)=>{let k=l.path===b.active;return(0,w.jsx)("div",{className:"fx-panel",id:`fx-panel-${p}`,role:"tabpanel","aria-labelledby":`fx-tab-${p}`,hidden:!k,"data-line":l.line,"data-testid":"fs-panel",children:(0,w.jsx)(Lr,{sessionId:s,files:y,path:l.path,t,visible:k,renderers:i,documents:a})},l.path)})})]})]})}),O?.status==="ready"?(0,w.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,w.jsxs)("span",{children:[t("view.scope")," ",(0,w.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}),O.truncated?(0,w.jsx)("span",{className:"fx-foot-warn",children:Oe({entries:O.nodes,truncated:!0,total:O.total}).label}):null,(0,w.jsxs)("span",{className:"fx-foot-git","data-state":Me===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,w.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":co,"aria-hidden":"true"}),Me===void 0?t("status.unavailable"):Me===0?t("status.clean"):t("status.summary").replace("{count}",String(Me))]}),Nt===null?null:(0,w.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Nt,D?.upstream!==void 0&&(D.ahead??0)>0?(0,w.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(D.ahead)}`}):null,D?.upstream!==void 0&&(D.behind??0)>0?(0,w.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(D.behind)}`}):null]}),(0,w.jsx)("span",{className:"fx-spacer"}),(0,w.jsx)("span",{children:t("foot.order")})]}):null]})}return d}var Qr=["slots","locale","workbench","remote"];function ra(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Rn,Cn,Et,En,Pt,eo;function Jr(e){return Pt=e,En!==void 0||(En=dr({open:(n,t,r)=>{let o=Pt;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ar(o)(n,t,r)},save:(n,t)=>{let r=Pt;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):sr(r)(n,t)}})),En}function oa(){if(Et!==void 0)return Et;let e=xn({warn:n=>eo?.(n)});for(let n of wt())e.register(n);return Et=e,e}var Pn;function no(e){let n=e.workbench;if(n==null)return()=>{};eo=s=>e.logger?.warn?.(s);let t=oa(),r={version:Sr,renderers:t,registerRenderer:s=>t.register(s),documents:Jr(e)};Cn?.();let o=e.provide?.(ft,r);o===void 0&&e.logger?.warn?.(`${Ae}: ctx.provide unavailable, ${ft} service not registered`),Cn=o,Rn?.();let i=e.locale.register(Ae,{zh:{...Hn,...et.zh,...vt.zh},en:{...Vn,...et.en,...vt.en}});Rn=i;let a=e.locale.bind(Ae),u=Ar(typeof document>"u"?void 0:document),d=Zr({workbench:n,version:n.version,t:a,files:Pr(e),status:Nr(e),renderers:t,documents:Jr(e)});Pn?.();let c=$n(e,n);return Pn=c,e.slots.inject(Mn,()=>e.slots.register({name:Mn,id:G,order:100,label:()=>qn(ra(e)),locale:Ae},d)),()=>{o?.(),Cn===o&&(Cn=void 0),c(),Pn===c&&(Pn=void 0),u(),i(),Rn===i&&(Rn=void 0)}}var to={buildTree:Je,describeListing:Oe,iconFor:Ce,computeTreeWindow:Qe,flattenTree:on,badgeFor:Ee,formatSize:an,joinPath:tn,listingPath:en,parseFocus:rn,consumeViewRequest:We,createPanelStack:Qn,createEscapeHandler:un,KEYMAP:cn,tabLabel:qn,normalizeListing:bn,normalizeStatusSnapshot:wn,buildWorkspaceMap:Ye,workspaceTagFor:Ze,parseStatusZ:Ue,statusTone:je,statusBadge:Xe,createPreviewLoader:yn,renderMarkdown:pn,languageFor:Be,isMarkdownFile:Ke,describePage:gn,classifyPreviewFailure:$e,normalizePreviewPage:it,previewChunkRoute:wr,canBridgeFile:sn,decideBridge:Bn,focusForFileAddress:_n,forwardFocus:Kn,registerAddressBridge:$n},ro={name:"dsh-fs-explorer",inject:Qr,apply:no,__test:to};var ia=ro;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
