window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Tn=Object.defineProperty;var mo=Object.getOwnPropertyDescriptor;var xo=Object.getOwnPropertyNames;var ho=Object.prototype.hasOwnProperty;var vo=(e,n)=>{for(var t in n)Tn(e,t,{get:n[t],enumerable:!0})},bo=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of xo(n))!ho.call(e,o)&&o!==t&&Tn(e,o,{get:()=>n[o],enumerable:!(r=mo(n,o))||r.enumerable});return e};var wo=e=>bo(Tn({},"__esModule",{value:!0}),e);var aa={};vo(aa,{__test:()=>eo,apply:()=>Qr,boot:()=>hr,clientPlugin:()=>no,default:()=>ia,inject:()=>Zr});module.exports=wo(aa);var Se=require("react");var Nt="dsh-resource://file/";function Mt(e){try{return decodeURIComponent(e)}catch{return e}}function Fe(e){if(!e.startsWith(Nt))return null;let n=e.slice(Nt.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Mt(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),u=a<0?i:i.slice(0,a);return u.length===0?null:{sessionId:o,path:u.split("/").map(Mt).join("/")}}function ie(e){return e.slice(e.lastIndexOf("/")+1)}var It=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Lt(){return It.flatMap(e=>[...e.extensions])}function Ne(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return It.find(o=>o.extensions.includes(r))?.family??null}var ee="dsh-fs-explorer",Fn="conversation.view",G="fs-explorer";var Me="fs-explorer";var Dt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Nn={chunk:"client.preview.js"},Ke={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var ko={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},So={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Ro=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function jt(e){return typeof e=="string"&&Ro.has(e)}function At(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Co(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function $e(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=At(o.slice(2),i==="1"?7:8);if(a===null)continue;let u=a.fields[0]??"",d=a.rest;if(d===""||u.length<2)continue;if(i==="2"){let l=t[r+1];if(l===void 0||l==="")continue;r+=1,n[d]={status:"renamed"};continue}n[d]={status:Co(u[0]??".",u[1]??".")};continue}if(i==="u"){let a=At(o.slice(2),9);if(a===null)continue;let u=a.rest;if(u==="")continue;n[u]={status:"conflicted"}}}}return n}function Ie(e){return jt(e)?ko[e]:"neutral"}function He(e){return jt(e)?So[e]:"?"}function Mn(e){return`status.${e}`}function Ot(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Wt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function zt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function _t(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Eo=["conflicted","deleted","renamed","added","modified","untracked"];function Po(e){return Ie(Eo.find(n=>e.has(n))??"modified")}function Bt(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),u=r.endsWith("/")?a.length:a.length-1,d="";for(let l=0;l<u;l+=1){let s=a[l];if(s===void 0||s==="")continue;d=d===""?s:`${d}/${s}`;let g=n.get(d);g===void 0?n.set(d,{count:1,present:new Set([o.status])}):(g.count+=1,g.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Po(o.present)});return t}var Ht=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Vt=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function To(e){return Vt.test(e)?e.slice(0,e.indexOf("/")):null}function Fo(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function No(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Fo(i[2]??"");a!==""&&Vt.test(a)&&t.push(a)}return t}function Mo(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let u=/^\[(.+)\]$/u.exec(a);if(u!==null){o(),r=/^submodule(\s|$)/u.test(u[1]??"");continue}if(!r)continue;let d=/^path\s*=\s*(.*)$/u.exec(a);d!==null&&(t=(d[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Kt(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function $t(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Ve(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let u of Mo(r))t.set(u,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let u of No(i))o.add(u);let a=e.get("package.json");if(typeof a=="string"){let u=Kt(a);if(u!==void 0){let d=u.workspaces,l=d!==null&&typeof d=="object"&&!Array.isArray(d)?d.packages:void 0;for(let s of $t(Array.isArray(d)?d:l))o.add(s)}}for(let u of["turbo.json","lerna.json"]){let d=e.get(u);if(typeof d!="string")continue;let l=Kt(d);if(l!==void 0)for(let s of $t(l.packages))o.add(s)}for(let u of o){let d=To(u);d!==null&&n.has(d)&&t.set(u,"package")}return t}function qe(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Io=new Set(["node_modules",".git","dist","__pycache__"]);function Lo(e){return Io.has(e)}function Do(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Ge(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Lo(r))continue;let o=Do(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Ao=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),jo=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Oo=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Wo=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),zo=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),_o=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Bo=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Gt(e){let n=ie(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function we(e,n="file"){if(n==="directory")return"folder";let t=ie(e.toLowerCase());if(Bo.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Gt(t);return r===""?"file":Ao.has(r)?"code":jo.has(r)?"markdown":Oo.has(r)?"data":Wo.has(r)?"image":zo.has(r)?"style":_o.has(r)?"archive":"file"}var Ko={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},$o={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ke(e){let n=ie(e.toLowerCase()),t=Ko[n];if(t!==void 0)return t;let r=Gt(n),o=$o[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Le(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Dt} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Ue(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),u=Math.floor(Math.max(0,n.scrollTop)/t)-o,d=Math.min(Math.max(u,0),a),l=Math.min(e.length,d+i+o*2);return{rows:e.slice(d,l),startIndex:d,endIndex:l}}function In(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Xe(e){return e===""?".":e}function Ye(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ze(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Ut(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Ze(r,o),t.push(r);return t}function qt(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Je(e){if(typeof e!="string")return;let n=e.trim(),t=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(t!==null){let a=(t[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return a===""?void 0:{path:a,line:qt(t[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(r===null)return;let i=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(i!=="")return{path:i,line:qt(r[2]),absolute:!1}}function Xt(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Yt(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Qe(e,n,t,r){let o=[],i=Bt(t),a=(u,d)=>{let l=e.get(u);if(!(l===void 0||l.status!=="ready"))for(let s of l.nodes){let g=Ze(u,s.name),y=s.kind==="directory",h=y&&n.has(g),E=y||t===void 0?void 0:t[g],R=E?.status??(y?void 0:Ot(g,t)),I=E===void 0?void 0:Wt(E),T=y?i.get(g):void 0,D=y?qe(r,g):void 0;if(o.push({type:"entry",path:g,name:s.name,kind:s.kind,depth:d,expanded:h,...s.size===void 0?{}:{size:s.size},...R===void 0?{}:{status:R},...T===void 0?{}:{statusCount:T.count,statusTone:T.tone},...I===void 0?{}:{diff:I},...D===void 0?{}:{tag:D}}),!h)continue;let A=e.get(g);if(A===void 0||A.status==="loading"){o.push({type:"status",key:`${g}:loading`,path:g,depth:d+1,state:"loading"});continue}if(A.status==="failed"){o.push({type:"status",key:`${g}:failed`,path:g,depth:d+1,state:"failed",message:A.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(A.nodes.length===0){o.push({type:"status",key:`${g}:empty`,path:g,depth:d+1,state:"empty"});continue}a(g,d+1),A.truncated&&o.push({type:"status",key:`${g}:truncated`,path:g,depth:d+1,state:"truncated",label:Le({entries:A.nodes,truncated:!0,total:A.total}).label})}};return a("",0),o}var Ho=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Vo(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function qo(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Ho.has(Vo(n.path)))}function Zt(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=qo(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function en(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Ln="dsh-fs-explorer:bridge",Go="fs-explorer-bridge",nr="dsh-resource://file/**",Dn="sidebar.right.pane.tab",Uo=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Xo=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Yo=new Set(["makefile","dockerfile","license","readme","changelog"]),Zo=new Set([...Lt(),...Uo]);function Jo(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function nn(e){if(typeof e!="string"||e==="")return!1;let n=ie(e).toLowerCase();if(n==="")return!1;let t=Jo(n);return Xo.has(t)?!1:Yo.has(n)?!0:Zo.has(t)}function Qo(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function ei(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function On(e,n){if(typeof e!="string")return;let t=Fe(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=ei(n,Qo(e));return`${Ye(r)?"abs:":"path:"}${r}:${String(o)}`}function Wn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Fe(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!nn(r.path))return{action:"keep",reason:"refused"};let o=On(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function ae(e,n){n===void 0?console.warn(`[${ee}] ${e}`):console.warn(`[${ee}] ${e}`,n)}function ni(e){console.debug(`[${ee}] ${e}`)}function An(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function jn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ge(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Jt(e){return ge(()=>e.sidebarRightTabs,An)??ge(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,An)}function Qt(e){return ge(()=>e.sidebarRight,jn)??ge(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,jn)}function er(e){return typeof e=="function"?e:()=>{}}var ti="dsh-resource://file/session/probe/src/main.ts";function ri(e){let n=ge(()=>(typeof e.candidates=="function"?e.candidates(ti):[]).filter(r=>r.priority==="extension"&&r.id!==Ln),t=>Array.isArray(t)&&t.length>0);n!==void 0&&ae(`another extension-band tab type already claims ${nr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function oi(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ii(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function ai(e,n){let t=e.viewFocus;if(t?.request?.(G,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(G,n);return(!r.opened||r.focused)&&t?.take(G),r}return typeof e.openView=="function"&&e.openView(G,n)?(t?.take(G),{opened:!0,focused:!0}):(t?.take(G),{opened:!1,focused:!1})}function zn(e,n,t,r){let o;try{o=ai(e,r)}catch(i){return ae("the file workbench threw while switching views",i),e.viewFocus?.take(G),!1}if(!o.opened)return ae(`the file workbench did not switch to ${G}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return ae("the forwarded tab could not be closed",i),!1}}function si(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,u=oi(i),d=ii(i),l=(0,Se.useRef)(void 0);return(0,Se.useEffect)(()=>{if(a===void 0){ae("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(l.current===a)return;l.current=a;let s=Wn(u,e.currentSessionId(),d);if(s.action!=="open"){ae(`left the forwarded tab standing (${s.reason})`,u);return}zn(e,n,a,s.focus)},[a,u,d]),null}return function(o){return typeof o.useTabInfo!="function"?(ae(`the host did not inject useTabInfo into ${Dn}; the bridge cannot forward`),null):(0,Se.createElement)(t,{useTabInfo:o.useTabInfo})}}function _n(e,n){let t=(u,d)=>{if(u===void 0||d===void 0)return;ri(u);let l;try{l=u.register({id:Ln,kind:Go,patterns:[nr],priority:"extension",canOpen:y=>{let h=Fe(y);return h!==null&&nn(h.path)},title:y=>ie(Fe(y)?.path??y)||y})}catch(y){ae("the sidebar right refused the address bridge tab type",y);return}let s=si(n,d),g;try{g=er(e.slots.inject(Dn,()=>e.slots.register({name:Dn,key:Ln},s)))}catch(y){l(),ae("the sidebar right refused the address bridge body",y);return}return()=>{g(),l()}},r=Jt(e),o=Qt(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return ni("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],u=>{let d=ge(()=>u.get?.("sidebarRightTabs"),An)??Jt(u),l=ge(()=>u.get?.("sidebarRight"),jn)??Qt(u);return t(d,l)});return er(a)}var Bn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Kn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function $n(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Bn:Kn)["tab.label"]??"Files"}var di=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,error:null});function se(e){return e!==null&&typeof e=="object"}function tn(e,n){return{ok:!1,code:e,message:n}}function rn(e){let n=se(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return tn(t,r)}function Hn(){return tn("invalid-response","the document service answered an invalid response")}function Vn(e){try{return e()}catch{return}}function li(e){let n=se(e)?e:void 0;if(n===void 0)return Hn();if(n.ok===!1)return rn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=se(t)?t:void 0;if(r===void 0)return Hn();if(r.ok===!1)return rn(r.error);let o=se(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Hn():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function ci(e){let n=se(e)?e:void 0;if(n===void 0)return tr();if(n.ok===!1)return rn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=se(t)?t:void 0;if(r===void 0)return tr();if(r.ok===!1)return rn(r.error);let o=se(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function tr(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function qn(e){return se(e)&&typeof e.open=="function"}function rr(e){return()=>{let n=Vn(()=>e.fsExplorerDocuments);if(qn(n))return n;let t=Vn(()=>se(e.remote)?e.remote.fsExplorerDocuments:void 0);if(qn(t))return t;let r=Vn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(qn(r))return r}}function or(e){let n=rr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return tn("unavailable","the document service is unavailable");try{return li(await i.open({sessionId:t,path:r},o))}catch(a){return tn("io-error",a instanceof Error?a.message:String(a))}}}function ir(e){let n=rr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return ci(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function ar(e){let n=new Map,t=new Set,r=0,o=(u,d)=>`${u}\0${d}`,i=()=>{r+=1;for(let u of[...t])u()},a=(u,d)=>n.get(o(u,d))?.session;return{acquire(u,d){let l=o(u,d),s=n.get(l);return s===void 0&&(s={session:new Gn(u,d,e.open,e.save,()=>{n.delete(l),i()},i)},n.set(l,s),i()),s.session.retain(),s.session},peek(u,d){return a(u,d)?.getSnapshot()},find:a,subscribe(u){return t.add(u),()=>{t.delete(u)}},revision:()=>r}}var Gn=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=di;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(){if(this.closed)return;let n=++this.generation,t=this.snapshot.status==="ready";this.publish({...this.snapshot,status:t?"ready":"loading",error:null});try{let r=await this.open(this.sessionId,this.path);if(this.closed||n!==this.generation)return;if(!r.ok){this.publish({...this.snapshot,status:t?"ready":"failed",error:{code:r.code,message:r.message}});return}this.publish({...this.snapshot,status:"ready",text:r.text,savedText:r.text,version:r.version??null,dirty:!1,saving:!1,conflict:!1,error:null})}catch(r){if(this.closed||n!==this.generation)return;this.publish({...this.snapshot,status:t?"ready":"failed",error:{code:"io-error",message:r instanceof Error?r.message:String(r)}})}}dispose(){this.closed||(this.references-=1,!(this.references>0)&&(this.closed=!0,this.listeners.clear(),this.onRelease()))}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var on=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function ui(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function sr(e,n,t=ui()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),u=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===u}function dr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function fi(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Un(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function an(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&fi(n),e.onClose?.()}}var Re=require("react");function sn(e){let n=ie(e);return n===""?e:n}function Xn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var pi=Object.freeze({panels:Object.freeze([]),active:null});function Yn(){let e=[],n=null,t=pi,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(l=>l.path===d),a=d=>{let l=Xn(d,!0);if(l===void 0)return;if(i(l)>=0)return l;let s=Xn(d,!1);if(!(s===void 0||s===l))return i(s)>=0?s:void 0},u=d=>{if(e.length===0)return;let l=n===null?-1:i(n),s=e[(l+d+e.length)%e.length];s===void 0||s.path===n||(n=s.path,o())};return{open(d,l=1,s=!1){let g=Xn(d,s);if(g===void 0)return;let y=Number.isFinite(l)&&l>0?Math.trunc(l):1,h=i(g);if(h>=0){let R=e[h],I=R!==void 0&&(R.line!==y||R.absolute!==s);if(I&&(e=e.map((T,D)=>D===h?{path:g,line:y,absolute:s}:T)),n===g){I&&o();return}n=g,o();return}let E=n===null?e.length:i(n)+1;e=[...e.slice(0,E),{path:g,line:y,absolute:s},...e.slice(E)],n=g,o()},close(d){let l=d===void 0?n:a(d)??null;if(l===null)return;let s=i(l);s<0||(e=e.filter(g=>g.path!==l),n===l&&(n=(e[s]??e[s-1])?.path??null),o())},activate(d){let l=a(d);l===void 0||i(l)<0||n===l||(n=l,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let l=a(d);return l!==void 0&&i(l)>=0},activeEntry(){return e.find(d=>d.path===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function lr(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Yn();return e.set(t,o),o}}}function De(e,n){let t=Je(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute),!0)}var F=require("react/jsx-runtime"),Zn={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},yi=()=>()=>{},gi=()=>"";function mi(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function cr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:u}){let d=(0,Re.useRef)(null);(0,Re.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let l=(0,Re.useSyncExternalStore)(a?.subscribe??yi,()=>mi(a,u,e).join("\0"),gi),s=new Set(l===""?[]:l.split("\0"));if(e.length===0)return null;let g=y=>{if(y.key==="ArrowRight"||y.key==="ArrowLeft"){y.preventDefault(),y.stopPropagation(),i(y.key==="ArrowRight"?1:-1);return}(y.key==="Delete"||y.key==="Backspace")&&n!==null&&(y.preventDefault(),y.stopPropagation(),o(n))};return(0,F.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((y,h)=>{let E=y.path===n,R=sn(y.path),I=t("panel.close").replace("{name}",R);return(0,F.jsxs)("div",{className:"fx-tab","data-active":E?"true":"false","data-dirty":s.has(y.path)?"true":"false",role:"presentation",children:[(0,F.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${h}`,"aria-controls":`fx-panel-${h}`,"aria-selected":E,tabIndex:E?0:-1,title:y.path,"data-testid":"fs-tab","data-path":y.path,ref:E?d:void 0,onClick:()=>r(y.path),children:[(0,F.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":we(y.path),"aria-hidden":"true",children:ke(y.path)}),(0,F.jsx)("span",{className:"fx-tab-name",children:R}),s.has(y.path)?(0,F.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,F.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:E?0:-1,"aria-label":I,title:I,"data-testid":"fs-tab-close",onClick:()=>o(y.path),children:"\xD7"})]},y.path)})})}function ur({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,F.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,F.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,F.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,F.jsx)("span",{className:"fx-spacer"}),(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function xi(){return(0,F.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,F.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,F.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,F.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function fr({t:e}){return(0,F.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,F.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,F.jsx)(xi,{})}),(0,F.jsx)("strong",{children:e("panel.empty.title")}),(0,F.jsx)("span",{children:e("panel.empty.description")}),(0,F.jsxs)("span",{className:"fx-empty-keys",children:[(0,F.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,F.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,F.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,F.jsx)("span",{children:e("panel.empty.keys")})]})]})}var pr=require("react");function H(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,pr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function hi(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var vi=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function me(e){let n=[],t=0;for(let r of e.matchAll(vi)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(H("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(H("strong",null,...me(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(H("del",null,...me(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(H("em",null,...me(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),u=a?.[1]??i,d=a===null?void 0:hi(a[2]??"");n.push(d===void 0?u:H("a",{href:d,rel:"noreferrer noopener"},u))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var yr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,gr=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,mr=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Jn=/^\s{0,3}>\s?(.*)$/u,Qn=/^\s{0,3}[-*+]\s+(.*)$/u,et=/^\s{0,3}\d+[.)]\s+(.*)$/u;function bi(e){return yr.test(e)||gr.test(e)||mr.test(e)||Jn.test(e)||Qn.test(e)||et.test(e)}function xr(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=yr.exec(r);if(o!==null){let l=(o[1]??"```").slice(0,1),s=o[2]??"",g=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${l}{3,}\\s*$`,"u").test(e[t]??"");)g.push(e[t]??""),t+=1;t+=1,n.push(H("pre",null,H("code",s===""?null:{className:`language-${s}`},g.join(`
`))));continue}let i=gr.exec(r);if(i!==null){let l=(i[1]??"#").length;n.push(H(`h${String(l)}`,null,...me(i[2]??""))),t+=1;continue}if(mr.test(r)){n.push(H("hr",null)),t+=1;continue}if(Jn.test(r)){let l=[];for(;t<e.length;){let s=Jn.exec(e[t]??"");if(s===null)break;l.push(s[1]??""),t+=1}n.push(H("blockquote",null,...xr(l)));continue}if(Qn.exec(r)!==null){let l=[];for(;t<e.length;){let s=Qn.exec(e[t]??"");if(s===null)break;l.push(H("li",null,...me(s[1]??""))),t+=1}n.push(H("ul",null,...l));continue}if(et.exec(r)!==null){let l=[];for(;t<e.length;){let s=et.exec(e[t]??"");if(s===null)break;l.push(H("li",null,...me(s[1]??""))),t+=1}n.push(H("ol",null,...l));continue}let d=[r.trim()];for(t+=1;t<e.length;){let l=e[t]??"";if(l.trim()===""||bi(l))break;d.push(l.trim()),t+=1}n.push(H("p",null,...me(d.join(" "))))}return n}function dn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return H("div",{className:"fx-md"},...xr(n))}var nt=200,wi={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Oe(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":wi[t.slice(r+1)]??"plaintext"}function We(e){return Oe(e)==="markdown"}var xe=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Ae(e){return e!==null&&typeof e=="object"}function ki(e){return e===""?0:e.split(`
`).length}function tt(e,n){if(!Ae(e))throw new xe("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=Ae(e.error)?e.error:{},d=typeof u.code=="string"?u.code:"preview/unknown",l=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=Ae(u.details)?u.details:{},g=typeof s.kind=="string"?s.kind:"";throw new xe(d,l,g)}let t=e.ok===!0?e.value:e;if(!Ae(t)||typeof t.text!="string")throw new xe("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):ki(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:t.text,lines:r,offset:i,eof:a}:{text:t.text,lines:r,offset:i,totalLines:o,eof:a}}function ze(e){let n=Ae(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var je=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function ln({files:e,maxLines:n=nt}){let t=Math.max(1,Math.trunc(n)),r=je,o=0,i=null,a=[1],u=new Set,d=s=>{r=s;for(let g of u)g()},l=async(s,g)=>{o+=1;let y=o;i?.abort();let h=new AbortController;i=h,d({status:"loading",path:s,text:r.path===s?r.text:"",offset:g,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let E=await e.read(s,g>1?{offset:g,limit:t}:{limit:t},h.signal);if(y!==o)return;let R=tt(E,g);if(R.lines===0&&g>1){d({...r,status:"ready",eof:!0,text:"",lines:0});return}d(R.totalLines===void 0?{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,eof:R.eof}:{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,totalLines:R.totalLines,eof:R.eof})}catch(E){if(y!==o||h.signal.aborted)return;d({status:"failed",path:s,text:"",offset:g,lines:0,eof:!1,failure:ze(E)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(s){return u.add(s),()=>{u.delete(s)}},async open(s){a=[1],await l(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(a.push(s),await l(r.path,s))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let s=a[a.length-1]??1;await l(r.path,s)},async retry(){r.path!==void 0&&await l(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],d(je)}}}function cn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var rt=Object.freeze({chunk:Nn.chunk,id:`${ee}/${Nn.chunk}`}),ot=null,_e=null,un=new Map;function hr(e){ot=e}function vr(){return rt}function Si(e){let n=Ke[e];return{chunk:n,id:`${ee}/${n}`}}function it(){if(_e!==null)return _e;let e=ot;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let n=e.async(`./${rt.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ee}: chunk ${rt.id} is missing its preview renderers`);return r});return _e=n,n.catch(()=>{_e===n&&(_e=null)}),n}function br(e){let n=un.get(e);if(n!==void 0)return n;let t=ot;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let r=Si(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${ee}: chunk ${r.id} is not the ${e} view`);return a});return un.set(e,o),o.catch(()=>{un.get(e)===o&&un.delete(e)}),o}var P=require("react");async function at(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var de=require("react/jsx-runtime");function Ri(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Ci(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function st({failure:e,t:n,onRetry:t}){return(0,de.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,de.jsx)("strong",{children:Ri(e,n)}),(0,de.jsx)("span",{children:Ci(e,n)}),e.message===""?null:(0,de.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,de.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function dt({t:e}){return(0,de.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,de.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var lt="fsExplorer",wr=1;function Ei(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Pi(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Ti(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Fi(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function fn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Pi),families:[...i.match?.families??[]]}),o();let u=!0;return()=>{u&&(u=!1,t.delete(a),o())}},resolve(i){let a=Ei(i.path),u=Ne(i.path),d;for(let l of t.values())Ti(l,a,u)&&(d===void 0||Fi(l.contribution,d.contribution))&&(d=l);return d?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function kr(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function pn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Ce(e){try{return e()}catch{return}}function Cr(e){return()=>{let n=Ce(()=>e.workspaceFiles);if(pn(n))return n;let t=Ce(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(pn(t))return t;let r=Ce(()=>e.remote?.workspaceFiles);if(pn(r))return r;let o=Ce(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(pn(o))return o}}function Er(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function yn(e){return e!==null&&typeof e=="object"}function Ni(e){if(!yn(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=yn(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Mi(e){let n=yn(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=yn(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new xe(t,r,i)}function ft(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ni(await n.call(e,t,r,{},o));if(!i.ok)throw Mi(i.error);return i.value.data}}function Be(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function ct(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function gn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Be(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?ct(r.value):{ok:!1,message:Be(r.error)}}return ct(t)}return ct(n)}function Pr(e){return e instanceof Error?e.message:Be(e)}function Sr(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Tr(e){return()=>{let n=Ce(()=>e.remote?.gitExplorer);if(Sr(n))return n;let t=Ce(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Sr(t))return t}}function Rr(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Ii(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Rr(r.additions),i=Rr(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Li(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function ut(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Ii(n.stats),r=Li(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function mn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Be(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?ut(o.snapshot):{ok:!1,message:Be(o.error)}}let r=e;return r.snapshot!==void 0?ut(r.snapshot):ut(t)}var v=require("react/jsx-runtime"),mt={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Di=()=>()=>{},Fr=()=>{};function xt(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var pt={status:"idle"},Ai=[".md",".mdx",".markdown",".mdown"],ji=-1e3;function gt({t:e}){return(0,v.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,v.jsx)("strong",{children:e("preview.unavailable.title")}),(0,v.jsx)("span",{children:e("preview.unavailable.description")})]})}function Nr({chunk:e,text:n,path:t,offset:r}){let o=(0,P.useRef)(null),i=(0,P.useRef)(null),[a,u]=(0,P.useState)(!1),d=Oe(t);return(0,P.useEffect)(()=>{u(!1)},[e,t]),(0,P.useEffect)(()=>{let l=o.current;if(!(e===null||l===null))try{let s=e.mountCodePreview(l,{text:n,language:d,path:t,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{u(!0);return}},[e,t,d]),(0,P.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,v.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Oi({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&We(n)?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:dn(r)}):(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Wi(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,v.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,v.jsx)(Nr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function zi(e){function n({page:t,path:r}){return(0,v.jsx)(Nr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function _i({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i}){let a=(0,P.useMemo)(()=>ft(r),[r]);return t===void 0||a===void 0?(0,v.jsx)(gt,{t:o}):(0,v.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:a,t:o,visible:i})}function Bi(e){return{Body:n=>(0,v.jsx)(_i,{chunk:e,...n}),renderer:e.renderer}}function ht(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Ai]},priority:0,load:()=>it().then(Wi)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:ji,load:()=>it().then(zi)},...Object.keys(Ke).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>br(e).then(Bi)}))]}var yt;function Ki(){if(yt!==void 0)return yt;let e=fn();for(let n of ht())e.register(n);return yt=e,e}function Mr({sessionId:e,files:n,path:t,t:r,visible:o=!0,renderers:i,documents:a}){let u=(0,P.useMemo)(()=>Er(n,e),[n,e]),d=(0,P.useMemo)(()=>ft(n),[n]),l=i??Ki(),s=t===void 0?null:Ne(t),g=s!==null,y=e!==void 0&&d!==void 0?{sessionId:e,readFile:d}:null,[h,E]=(0,P.useState)(null),[R,I]=(0,P.useState)(je),[T,D]=(0,P.useState)(pt),[A,z]=(0,P.useState)(0),[W,ve]=(0,P.useState)(0),[le,ce]=(0,P.useState)("reading"),[Z,f]=(0,P.useState)(!1),[m,b]=(0,P.useState)(!1),L=(0,P.useRef)(void 0),_=(0,P.useRef)(void 0),B=(0,P.useSyncExternalStore)(a?.subscribe??Di,()=>a===void 0||e===void 0||t===void 0?Fr():a.peek(e,t),Fr),V=a===void 0||e===void 0||t===void 0?void 0:a.find(e,t);if((0,P.useEffect)(()=>{if(u===void 0){E(null);return}let C=ln({files:u,maxLines:nt});return E(C),()=>C.close()},[u]),(0,P.useEffect)(()=>{if(h===null){I(je);return}return I(h.getSnapshot()),h.subscribe(()=>I(h.getSnapshot()))},[h]),(0,P.useEffect)(()=>{h===null||t===void 0||s!==null||h.open(t)},[h,t,s]),(0,P.useEffect)(()=>{ce("reading"),f(!1)},[t]),(0,P.useEffect)(()=>()=>{L.current!==void 0&&clearTimeout(L.current),_.current!==void 0&&clearTimeout(_.current)},[]),(0,P.useEffect)(()=>{B?.conflict!==!0&&(b(!1),_.current!==void 0&&clearTimeout(_.current))},[B?.conflict]),(0,P.useEffect)(()=>l.subscribe(()=>z(C=>C+1)),[l]),(0,P.useEffect)(()=>{if(t===void 0){D(pt);return}let C=kr(l,{path:t});if(C===void 0){D(pt);return}let{contribution:Y}=C,fe=!0;return D(Q=>Q.status==="ready"&&Q.contribution.id===Y.id?Q:{status:"loading",contribution:Y}),C.module.then(Q=>{fe&&D({status:"ready",contribution:Y,module:Q})},Q=>{fe&&D({status:"failed",contribution:Y,failure:ze(Q)})}),()=>{fe=!1}},[l,t,A,W]),t===void 0)return(0,v.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,v.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,v.jsx)("strong",{children:r("preview.empty.title")}),(0,v.jsx)("span",{children:r("preview.empty.description")})]})});let U=cn(R),K=!g&&We(t),q=g?y!==null&&T.status!=="ready"&&T.status!=="failed":R.status==="loading",j=R.status==="ready",O=K&&le==="reading",Sn=g?y===null?"unavailable":T.status==="failed"?"failed":T.status==="ready"?"ready":"loading":R.status,ue=T.status==="ready"?O?"gfm":T.module.renderer??T.contribution.id:g?"pending":O?"fallback":"plain",Ee={path:t,sessionId:e,files:n,t:r,visible:o,mode:le,...g?{}:{page:{text:R.text,offset:R.offset}}},ne=()=>{at(t).then(C=>{C&&(f(!0),L.current!==void 0&&clearTimeout(L.current),L.current=setTimeout(()=>f(!1),1400))})},re=()=>{let C=V?.copyDraft();C!==void 0&&at(C).then(Y=>{Y&&(b(!0),_.current!==void 0&&clearTimeout(_.current),_.current=setTimeout(()=>b(!1),1400))})},J=B?.error,Pe=J!=null&&B?.conflict!==!0,X;if(g){let C=T.status==="ready"?T.module.Body:void 0;X=y===null?(0,v.jsx)(gt,{t:r}):T.status==="failed"?(0,v.jsx)(st,{failure:T.failure,t:r,onRetry:()=>ve(Y=>Y+1)}):C===void 0?(0,v.jsx)(dt,{t:r}):(0,v.jsx)(C,{...Ee})}else if(u===void 0)X=(0,v.jsx)(gt,{t:r});else if(R.status==="failed")X=(0,v.jsx)(st,{failure:R.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{h?.retry()}});else if(!j)X=(0,v.jsx)(dt,{t:r});else{let C=T.status==="ready"?T.module.Body:Oi;X=(0,v.jsx)(C,{...Ee})}return(0,v.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Sn,"data-mode":g?"binary":O?"reading":"code","data-renderer":ue,children:[(0,v.jsxs)("header",{className:"fx-preview-bar",children:[(0,v.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),g?null:(0,v.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[U.range,U.range==="\u2014"?null:(0,v.jsxs)(v.Fragment,{children:[" ",r("preview.lines")]}),U.total===void 0?null:(0,v.jsxs)("span",{className:"fx-preview-total",children:[" / ",U.total," ",r("preview.lines")]})]}),(0,v.jsxs)("div",{className:"fx-preview-actions",children:[B===void 0?null:(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!B.dirty||B.saving||B.status!=="ready",onClick:()=>{V?.save()},children:B.saving?r("preview.saving"):r("preview.save")}),K?(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>ce(C=>C==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(le==="reading"?"preview.source":"preview.reading")}):null,g?null:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!j||q||R.offset<=1,onClick:()=>{h?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!j||q||R.eof,onClick:()=>{h?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:ne,"data-testid":"fs-preview-copy",children:r(Z?"preview.copied":"preview.copyPath")}),q?(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),B?.conflict===!0?(0,v.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict",children:[(0,v.jsx)("strong",{children:r("preview.conflict.title")}),(0,v.jsx)("span",{className:"fx-conflict-hint",children:r("preview.conflict.hint")}),(0,v.jsx)("span",{className:"fx-spacer"}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload",onClick:()=>{V?.reload()},children:r("preview.conflict.reload")}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:re,children:r(m?"preview.conflict.copied":"preview.conflict.copy")})]}):null,Pe?(0,v.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:r("preview.saveFailed").replace("{message}",xt(J?.code??"io-error",J?.message??"",r))}):null,(0,v.jsx)("div",{className:"fx-preview-body","data-scroll":O?"y":"none",children:X})]})}var Ir="dsh-fs-explorer-styles",$i=`
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
`;function Lr(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Ir}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Ir,t.textContent=$i,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var vt="fs-explorer.treePaneWidth";function bt(e){return Math.min(520,Math.max(180,e))}function Ar(e){if(e==null)return null;let n;try{n=e.getItem(vt)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function xn(e,n){let t=Math.round(bt(n));if(e!=null)try{e.setItem(vt,String(t))}catch{}return t}function jr(e){if(e!=null)try{e.removeItem(vt)}catch{}}function Or(e,n){return Math.round(e)===Math.round(n)}var Dr=16;function Wr(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Dr};case"ArrowRight":return{kind:"nudge",delta:Dr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var M=require("react");function _r(e,n,t,r=800){return t-n<=r?e:""}function Br(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Kr(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Hi(e,t+1,r.depth,r.depth+1)}function Hi(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Vi=/^.$/u;function $r(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Vi.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=zr(e.names,n),u=a.find(d=>d>e.active)??a[0];return u===void 0?{kind:"miss"}:{kind:"jump",index:u,query:n}}let t=`${e.query}${n}`,r=zr(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function zr(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var S=require("react/jsx-runtime"),he=22;function wt({open:e=!0,size:n=14}){return(0,S.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,S.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function qi(){return(0,S.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Hr(){return(0,S.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,S.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,S.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Vr(){return(0,S.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Gi({name:e}){return(0,S.jsx)("span",{className:"fx-badge","data-icon":we(e),"aria-hidden":"true",children:ke(e)})}function Ui({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:u}){let d=e.kind==="directory",l={top:r,paddingLeft:8+e.depth*12};return(0,S.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{u(e.path),d?i(e.path):a(e.path)},children:[(0,S.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,S.jsx)(qi,{})}),d?(0,S.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,S.jsx)(wt,{open:e.expanded})}):(0,S.jsx)(Gi,{name:e.name}),(0,S.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,S.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,S.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":Ie(e.status),"data-testid":"fx-file-status",title:o(Mn(e.status)),"aria-label":o(Mn(e.status)),children:He(e.status)}),e.statusCount===void 0?null:(0,S.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,S.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,S.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,S.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,S.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,S.jsx)("span",{className:"fx-size",children:en(e.size)})]})}function Xi({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,S.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,S.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,S.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,S.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Yi(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function qr({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:u}){let d=(0,M.useRef)(null),[l,s]=(0,M.useState)(0),[g,y]=(0,M.useState)(0),[h,E]=(0,M.useState)(void 0),R=(0,M.useRef)(void 0),I=(0,M.useRef)({query:"",at:0}),T=(0,M.useRef)(void 0),D=(0,M.useRef)(void 0),A=(0,M.useRef)(h);A.current=h;let z=(0,M.useMemo)(()=>e.flatMap((f,m)=>f.type==="entry"?[m]:[]),[e]);(0,M.useEffect)(()=>{let f=D.current!==n;if(D.current=n,T.current!==void 0||n===void 0)return;let m=A.current===void 0?void 0:e[A.current];if(!Xt({cursorPath:m?.type==="entry"?m.path:void 0,selectionMoved:f}))return;let b=e.findIndex(L=>L.type==="entry"&&L.path===n);b>=0&&E(b)},[n,e]),(0,M.useEffect)(()=>{let f=T.current;if(f===void 0)return;let m=e.findIndex(_=>_.type==="entry"&&_.path===f),b=e[m];if(b?.type!=="entry"||b.kind!=="directory"||!b.expanded){T.current=void 0;return}let L=Yt(e,f);L!==void 0&&(T.current=void 0,E(L))},[e]),(0,M.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&E(void 0)},[e,h]),(0,M.useEffect)(()=>{let f=d.current;if(h===void 0||f===null)return;let m=In({scrollTop:f.scrollTop,viewport:f.clientHeight,rowHeight:he,index:h});m!==f.scrollTop&&(f.scrollTop=m)},[h]);let W=(0,M.useCallback)(f=>{E(f),d.current?.focus({preventScroll:!0})},[]),ve=(0,M.useCallback)(f=>{let m=e.findIndex(b=>b.type==="entry"&&b.path===f);m>=0&&E(m)},[e]),le=(0,M.useCallback)(f=>{if(f.nativeEvent.isComposing||f.altKey||f.metaKey||f.ctrlKey)return;let m=z.at(-1);if(f.key==="ArrowDown"){if(f.preventDefault(),h===void 0){z[0]!==void 0&&W(z[0]);return}let j=z.find(O=>O>h);j!==void 0&&W(j);return}if(f.key==="ArrowUp"){if(f.preventDefault(),h===void 0){m!==void 0&&W(m);return}let j=[...z].reverse().find(O=>O<h);j!==void 0&&W(j);return}if(h===void 0)return;let b=e[h];if(b===void 0||b.type!=="entry")return;if(f.key==="ArrowRight"){if(f.preventDefault(),b.kind==="directory"&&!b.expanded)T.current=b.path,o(b.path);else{let j=z.find(O=>O>h);j!==void 0&&e[j]?.depth===b.depth+1&&W(j)}return}if(f.key==="ArrowLeft"){if(f.preventDefault(),b.kind==="directory"&&b.expanded)o(b.path);else{let j=[...z].reverse().find(O=>O<h&&e[O]?.type==="entry"&&e[O].depth<b.depth);j!==void 0&&W(j)}return}if(f.key==="Enter"&&b.kind!=="directory"){f.preventDefault(),i(b.path);return}if(f.key==="Home"){f.preventDefault(),z[0]!==void 0&&W(z[0]);return}if(f.key==="End"){f.preventDefault(),m!==void 0&&W(m);return}let L=Date.now(),_=Br(e,h),B=Kr(e,_),V=B.map(j=>{let O=e[j];return O?.type==="entry"?O.name:""}),U=$r({query:_r(I.current.query,I.current.at,L),key:f.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:f.nativeEvent.repeat,names:V,active:h===void 0?-1:B.indexOf(h)});if(U.kind==="clear"){I.current={query:"",at:0};return}if(U.kind!=="jump")return;let K=B[U.index];if(K===void 0)return;let q=e[K];q?.type==="entry"&&(I.current={query:U.query,at:L},f.preventDefault(),W(K),q.kind!=="directory"&&i(q.path))},[h,z,W,o,i,e]);(0,M.useEffect)(()=>{let f=d.current;if(f===null)return;let m=()=>y(f.clientHeight);if(m(),typeof ResizeObserver>"u")return;let b=new ResizeObserver(m);return b.observe(f),()=>b.disconnect()},[]),(0,M.useEffect)(()=>{if(n===void 0)return;let f=d.current;if(f===null)return;let m=e.findIndex(L=>L.type==="entry"&&L.path===n);if(m<0)return;let b=m*he;(b<f.scrollTop||b+he>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,b-f.clientHeight/2))},[n,e]),(0,M.useEffect)(()=>{if(t===void 0||R.current===t)return;let f=d.current;if(f===null)return;let m=t.path===void 0?-1:e.findIndex(b=>b.type==="entry"&&b.path===t.path);if(!(t.path!==void 0&&m<0)){if(R.current=t,m>=0){let b=In({scrollTop:f.scrollTop,viewport:f.clientHeight===0?480:f.clientHeight,rowHeight:he,index:m});b!==f.scrollTop&&(f.scrollTop=b,s(b)),E(m)}Yi(f),u?.()}},[t,e,u]);let ce=f=>{s(f.currentTarget.scrollTop)},Z=Ue(e,{scrollTop:l,height:g===0?480:g,rowHeight:he});return(0,S.jsx)("div",{className:"fx-scroll",ref:d,onScroll:ce,onKeyDown:le,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,S.jsx)("div",{className:"fx-vlist",style:{height:e.length*he},children:Z.rows.map((f,m)=>{let b=(Z.startIndex+m)*he;return f.type==="entry"?(0,S.jsx)(Ui,{row:f,top:b,selected:f.path===n,cursor:h===Z.startIndex+m,t:r,onToggle:o,onSelect:i,onRowActivate:ve},f.path):(0,S.jsx)(Xi,{row:f,top:b,t:r,onRetry:a},f.key)})})})}var w=require("react/jsx-runtime");var Zi=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ji(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Qi=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Ur=new Map;function ea(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function hn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,w.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,w.jsx)("strong",{children:e}),n===void 0?null:(0,w.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,w.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function na(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Xr({workbench:e,version:n,t,files:r,status:o,renderers:i,documents:a}){let u=lr();function d(l){let s=l.sessionId??e.currentSessionId(),g=(0,x.useRef)(s);g.current=s;let y=(0,x.useMemo)(()=>r(),[r]),h=(0,x.useMemo)(()=>o(),[o]),[E,R]=(0,x.useState)(()=>new Map),[I,T]=(0,x.useState)(void 0),[D,A]=(0,x.useState)(void 0),[z,W]=(0,x.useState)(void 0),[ve,le]=(0,x.useState)(Ur),ce=(0,x.useRef)(E);ce.current=E;let[Z,f]=(0,x.useState)(()=>new Set),m=(0,x.useMemo)(()=>u.forSession(s),[u,s]),b=(0,x.useSyncExternalStore)(m.subscribe,m.snapshot,m.snapshot),L=b.active??void 0,[_,B]=(0,x.useState)(0),V=(0,x.useRef)(new Map),U=(0,x.useRef)(void 0),[K,q]=(0,x.useState)(null),[j,O]=(0,x.useState)(!1),[Sn,ue]=(0,x.useState)(null),Ee=(0,x.useRef)(null);Ee.current=K?.path??null;let ne=(0,x.useMemo)(()=>Ji(),[]),[re,J]=(0,x.useState)(()=>Ar(ne)),Pe=(0,x.useRef)(null),X=(0,x.useRef)(null),C=E.get(""),Y=C?.status==="ready",fe=(0,x.useCallback)((c,p,k)=>{m.open(c,p,k)},[m]),Q=(0,x.useCallback)(c=>{let p=c??m.snapshot().active??void 0;if(p===void 0)return;if((s===void 0?void 0:a?.peek(s,p))?.dirty===!0){ue(null),q({path:p});return}q(null),ue(null),m.close(p)},[a,s,m]),to=(0,x.useCallback)(()=>{let c=K;if(c===null)return;let p=s===void 0?void 0:a?.find(s,c.path);if(p===void 0){q(null),m.close(c.path);return}O(!0),ue(null),p.save().then(k=>{if(O(!1),!k.ok){let N=p.getSnapshot().error;ue(t("panel.confirm.failed").replace("{message}",xt(k.code,N?.message??"",t)));return}q(null),m.close(c.path)})},[a,K,s,m,t]),ro=(0,x.useCallback)(()=>{let c=K;q(null),ue(null),c!==null&&m.close(c.path)},[K,m]),Rn=(0,x.useCallback)(()=>{q(null),ue(null)},[]),pe=(0,x.useCallback)(async(c,p,k)=>{V.current.get(c)?.abort();let N=new AbortController;V.current.set(c,N),R(te=>new Map(te).set(c,Zi()));try{let te=await k.list(p,Xe(c),N.signal);if(N.signal.aborted||g.current!==p)return!1;let $=gn(te);if(!$.ok)return R(oe=>new Map(oe).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:$.message})),!1;let be=Ge($.listing.entries);return R(oe=>new Map(oe).set(c,{status:"ready",nodes:be,truncated:$.listing.truncated===!0,total:$.listing.entries.length})),!0}catch(te){return N.signal.aborted||R($=>new Map($).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:Pr(te)})),!1}finally{V.current.get(c)===N&&V.current.delete(c)}},[]);(0,x.useEffect)(()=>{for(let c of V.current.values())c.abort();return V.current.clear(),R(new Map),f(new Set),U.current=void 0,s!==void 0&&y!==void 0&&pe("",s,y),()=>{for(let c of V.current.values())c.abort();V.current.clear()}},[s,y,_,pe]),(0,x.useEffect)(()=>{if(s===void 0||h===void 0){T(void 0),A(void 0),W(void 0);return}let c=!0,p=new AbortController;return T(void 0),A(void 0),W(void 0),Promise.resolve().then(()=>h.snapshot({sessionId:s,maxCommits:1},p.signal)).then(k=>{if(!c)return;let N=mn(k);if(!N.ok){T(void 0),A(void 0),W(void 0);return}T(_t($e(N.status),N.stats)),A(N.head),W(N.root)}).catch(()=>{c&&(T(void 0),A(void 0),W(void 0))}),()=>{c=!1,p.abort()}},[s,h,_]),(0,x.useEffect)(()=>{let c=y?.read;if(s===void 0||y===void 0||typeof c!="function"||!Y){le(Ur);return}let p=s,k=new AbortController,N=async($,be)=>{try{let oe=ea(await c.call(y,p,be,{},k.signal));return oe===void 0?void 0:[$,oe]}catch{return}},te=Ht.filter($=>$!==".gitmodules").map($=>N($,$));return z!==void 0&&te.push(N(".gitmodules",`${z.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(te).then($=>{if(k.signal.aborted||g.current!==p)return;let be=new Map;for(let ye of $)ye!==void 0&&be.set(ye[0],ye[1]);let oe=ce.current.get(""),go=new Set(oe?.status==="ready"?oe.nodes.filter(ye=>ye.kind==="directory").map(ye=>ye.name):[]);le(Ve(be,go))}),()=>k.abort()},[s,y,Y,z,_]),(0,x.useEffect)(()=>{let c=l.viewRequest;if(c==null||c.view!==G)return;let p=`${c.view}:${c.focus}`;U.current!==p&&(U.current=p,De(c.focus,{open:fe}),l.completeViewRequest?.())},[l.viewRequest,l.completeViewRequest,fe]),(0,x.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||s===void 0)return;let p=()=>{let k=c.take(G);k!==void 0&&De(k,{open:fe})};return p(),c.subscribe(p)},[e,s,fe]),(0,x.useEffect)(()=>{if(L===void 0||!Y||Ye(L))return;let c=Ut(L);if(c.length===0||(f(k=>c.every(N=>k.has(N))?k:new Set([...k,...c])),s===void 0||y===void 0))return;let p=c.filter(k=>ce.current.get(k)?.status!=="ready");p.length!==0&&Promise.all(p.map(k=>pe(k,s,y)))},[L,Y,s,y,pe]);let Ct=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),oo=(0,x.useCallback)(c=>{if(c.button!==0||X.current!==null||Qi())return;let p=Pe.current?.previousElementSibling;if(p instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}X.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:re},document.body.classList.add("fx-pane-resizing")}},[re]),io=(0,x.useCallback)(c=>{let p=X.current;p===null||p.pointerId!==c.pointerId||J(bt(p.baseWidth+c.clientX-p.startX))},[]),Cn=(0,x.useCallback)(c=>{let p=X.current;if(p===null||p.pointerId!==c.pointerId)return;X.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let k=p.baseWidth+c.clientX-p.startX;if(Or(k,p.baseWidth)){J(p.restWidth);return}J(xn(ne,k))},[ne]),En=(0,x.useCallback)(()=>{jr(ne),J(null)},[ne]),ao=(0,x.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let p=Wr(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(p===null)return;if(c.preventDefault(),c.stopPropagation(),p.kind==="reset"){En();return}if(p.kind==="min"||p.kind==="max"){let te=p.kind==="min"?180:520;J(xn(ne,te));return}let k=Pe.current?.previousElementSibling,N=k instanceof HTMLElement?k.getBoundingClientRect().width:re??180;J(xn(ne,N+p.delta))},[ne,En,re]);(0,x.useEffect)(()=>()=>{X.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=p=>{if(!(p.isComposing||dr(p.target))){if(na(p)){let k=m.snapshot().active,N=k===null||a===void 0||s===void 0?void 0:a.find(s,k);if(N===void 0)return;p.preventDefault(),p.stopPropagation(),N.save();return}for(let k of on)if(sr(p,k)){if(k.action==="closePanel"&&m.snapshot().active===null)return;p.preventDefault(),p.stopPropagation(),k.action==="nextPanel"?m.next():k.action==="previousPanel"?m.previous():Q();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[a,Q,s,m]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=an({focusComposer:Ct,hasModal:()=>Ee.current!==null||Un(document)}),p=k=>c(k);return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[Ct]),(0,x.useEffect)(()=>{if(K===null||typeof document>"u")return;let c=p=>{p.key!=="Escape"||p.isComposing||(p.preventDefault(),p.stopPropagation(),Rn())};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[K,Rn]);let Pn=(0,x.useMemo)(()=>Qe(E,Z,I,ve),[E,Z,I,ve]),[so,Et]=(0,x.useState)(void 0),Pt=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(Pt.current||typeof document>"u")return;let c=Zt({rows:Pn,panelCount:m.snapshot().panels.length,hasModal:Un(document)});c.kind!=="skip"&&(Pt.current=!0,c.open!==void 0&&m.open(c.open),Et({path:c.focus}))},[Pn,m]);let lo=(0,x.useCallback)(()=>Et(void 0),[]),Te=I===void 0?void 0:Object.keys(I).length,co=I===void 0?"neutral":Object.values(I).some(c=>c.status==="conflicted")?"conflict":Te===0?"success":"warning",Tt=zt(D),uo=(0,x.useCallback)(c=>{if(s===void 0||y===void 0)return;if(Z.has(c)){f(k=>{let N=new Set(k);return N.delete(c),N});return}f(k=>new Set(k).add(c));let p=E.get(c);(p===void 0||p.status==="failed")&&pe(c,s,y)},[Z,E,s,y,pe]),Ft=(0,x.useCallback)(c=>{s===void 0||y===void 0||pe(c,s,y)},[s,y,pe]),fo=()=>f(new Set),po=()=>B(c=>c+1),yo=s===void 0?"no-session":y===void 0?"no-service":C===void 0||C.status==="loading"?"loading":C.status==="failed"?"failed":C.nodes.length===0?"empty":"tree";return(0,w.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":yo,"data-session":s??"","data-testid":"fs-explorer-view",children:[(0,w.jsxs)("header",{className:"fx-head",children:[(0,w.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,w.jsx)(wt,{open:!0})}),(0,w.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,w.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,w.jsxs)("div",{className:"fx-head-meta",children:[C?.status==="ready"?(0,w.jsxs)("span",{children:[(0,w.jsx)("b",{children:C.nodes.length})," ",t("head.entries")]}):null,(0,w.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:Z.size===0,onClick:fo,children:(0,w.jsx)(Vr,{})}),(0,w.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:s===void 0||y===void 0||C?.status==="loading",onClick:po,children:(0,w.jsx)(Hr,{})})]})]}),(0,w.jsx)("div",{className:"fx-main",children:s===void 0?(0,w.jsx)(hn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):y===void 0?(0,w.jsx)(hn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):C===void 0||C.status==="loading"?(0,w.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,w.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):C.status==="failed"?(0,w.jsx)(hn,{title:t("state.failed.title"),description:C.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Ft(""),testId:"fs-failed"}):C.nodes.length===0?(0,w.jsx)(hn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("div",{className:"fx-tree-pane",style:re===null?void 0:{"--fx-tree-width":`${re}px`},children:(0,w.jsx)(qr,{rows:Pn,selectedPath:L,entryFocus:so,t,onToggle:uo,onSelect:c=>m.open(c),onRetry:Ft,onEntryFocusSettled:lo})}),(0,w.jsx)("div",{ref:Pe,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":re??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:oo,onPointerMove:io,onPointerUp:Cn,onPointerCancel:Cn,onLostPointerCapture:Cn,onKeyDown:ao,onDoubleClick:En}),(0,w.jsxs)("div",{className:"fx-editor",children:[(0,w.jsx)(cr,{panels:b.panels,active:b.active,t,onActivate:c=>m.activate(c),onClose:Q,onStep:c=>c===1?m.next():m.previous(),documents:a,sessionId:s}),K===null?null:(0,w.jsx)(ur,{name:sn(K.path),t,saving:j,error:Sn,onSave:to,onDiscard:ro,onCancel:Rn}),(0,w.jsx)("div",{className:"fx-editor-body",children:b.panels.length===0?(0,w.jsx)(fr,{t}):b.panels.map((c,p)=>{let k=c.path===b.active;return(0,w.jsx)("div",{className:"fx-panel",id:`fx-panel-${p}`,role:"tabpanel","aria-labelledby":`fx-tab-${p}`,hidden:!k,"data-line":c.line,"data-testid":"fs-panel",children:(0,w.jsx)(Mr,{sessionId:s,files:y,path:c.path,t,visible:k,renderers:i,documents:a})},c.path)})})]})]})}),C?.status==="ready"?(0,w.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,w.jsxs)("span",{children:[t("view.scope")," ",(0,w.jsx)("b",{children:C.nodes.length})," ",t("head.entries")]}),C.truncated?(0,w.jsx)("span",{className:"fx-foot-warn",children:Le({entries:C.nodes,truncated:!0,total:C.total}).label}):null,(0,w.jsxs)("span",{className:"fx-foot-git","data-state":Te===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,w.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":co,"aria-hidden":"true"}),Te===void 0?t("status.unavailable"):Te===0?t("status.clean"):t("status.summary").replace("{count}",String(Te))]}),Tt===null?null:(0,w.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Tt,D?.upstream!==void 0&&(D.ahead??0)>0?(0,w.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(D.ahead)}`}):null,D?.upstream!==void 0&&(D.behind??0)>0?(0,w.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(D.behind)}`}):null]}),(0,w.jsx)("span",{className:"fx-spacer"}),(0,w.jsx)("span",{children:t("foot.order")})]}):null]})}return d}var Zr=["slots","locale","workbench","remote"];function ra(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var vn,bn,St,wn,Rt,Jr;function Yr(e){return Rt=e,wn!==void 0||(wn=ar({open:(n,t,r)=>{let o=Rt;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):or(o)(n,t,r)},save:(n,t)=>{let r=Rt;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ir(r)(n,t)}})),wn}function oa(){if(St!==void 0)return St;let e=fn({warn:n=>Jr?.(n)});for(let n of ht())e.register(n);return St=e,e}var kn;function Qr(e){let n=e.workbench;if(n==null)return()=>{};Jr=s=>e.logger?.warn?.(s);let t=oa(),r={version:wr,renderers:t,registerRenderer:s=>t.register(s),documents:Yr(e)};bn?.();let o=e.provide?.(lt,r);o===void 0&&e.logger?.warn?.(`${Me}: ctx.provide unavailable, ${lt} service not registered`),bn=o,vn?.();let i=e.locale.register(Me,{zh:{...Bn,...Zn.zh,...mt.zh},en:{...Kn,...Zn.en,...mt.en}});vn=i;let a=e.locale.bind(Me),u=Lr(typeof document>"u"?void 0:document),d=Xr({workbench:n,version:n.version,t:a,files:Cr(e),status:Tr(e),renderers:t,documents:Yr(e)});kn?.();let l=_n(e,n);return kn=l,e.slots.inject(Fn,()=>e.slots.register({name:Fn,id:G,order:100,label:()=>$n(ra(e)),locale:Me},d)),()=>{o?.(),bn===o&&(bn=void 0),l(),kn===l&&(kn=void 0),u(),i(),vn===i&&(vn=void 0)}}var eo={buildTree:Ge,describeListing:Le,iconFor:we,computeTreeWindow:Ue,flattenTree:Qe,badgeFor:ke,formatSize:en,joinPath:Ze,listingPath:Xe,parseFocus:Je,consumeViewRequest:De,createPanelStack:Yn,createEscapeHandler:an,KEYMAP:on,tabLabel:$n,normalizeListing:gn,normalizeStatusSnapshot:mn,buildWorkspaceMap:Ve,workspaceTagFor:qe,parseStatusZ:$e,statusTone:Ie,statusBadge:He,createPreviewLoader:ln,renderMarkdown:dn,languageFor:Oe,isMarkdownFile:We,describePage:cn,classifyPreviewFailure:ze,normalizePreviewPage:tt,previewChunkRoute:vr,canBridgeFile:nn,decideBridge:Wn,focusForFileAddress:On,forwardFocus:zn,registerAddressBridge:_n},no={name:"dsh-fs-explorer",inject:Zr,apply:Qr,__test:eo};var ia=no;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
