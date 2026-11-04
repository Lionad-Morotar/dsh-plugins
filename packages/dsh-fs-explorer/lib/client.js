window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var ht=Object.defineProperty;var Pi=Object.getOwnPropertyDescriptor;var Fi=Object.getOwnPropertyNames;var Li=Object.prototype.hasOwnProperty;var Ni=(e,n)=>{for(var t in n)ht(e,t,{get:n[t],enumerable:!0})},Mi=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Fi(n))!Li.call(e,o)&&o!==t&&ht(e,o,{get:()=>n[o],enumerable:!(r=Pi(n,o))||r.enumerable});return e};var Di=e=>Mi(ht({},"__esModule",{value:!0}),e);var Fs={};Ni(Fs,{__test:()=>fi,apply:()=>ui,boot:()=>ho,clientPlugin:()=>pi,default:()=>Ps,inject:()=>li});module.exports=Di(Fs);var Ue=require("react");var Sr="dsh-resource://file/";function Rr(e){try{return decodeURIComponent(e)}catch{return e}}function tn(e){if(!e.startsWith(Sr))return null;let n=e.slice(Sr.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Rr(t.slice(0,r)),i=t.slice(r+1),s=i.search(/[?#]/u),c=s<0?i:i.slice(0,s);return c.length===0?null:{sessionId:o,path:c.split("/").map(Rr).join("/")}}function ve(e){return e.slice(e.lastIndexOf("/")+1)}var Tr=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Cr(){return Tr.flatMap(e=>[...e.extensions])}function rn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Tr.find(o=>o.extensions.includes(r))?.family??null}var ee="dsh-fs-explorer",xt="conversation.view",Z="fs-explorer";var on="fs-explorer",Er="fsExplorerDocuments",Pr="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",vt={chunk:"client.preview.js"},wn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Ii={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Ai={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Oi=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Lr(e){return typeof e=="string"&&Oi.has(e)}function Fr(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function ji(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function kn(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let s=o.slice(2);s!==""&&(n[s]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let s=Fr(o.slice(2),i==="1"?7:8);if(s===null)continue;let c=s.fields[0]??"",a=s.rest;if(a===""||c.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[a]={status:"renamed"};continue}n[a]={status:ji(c[0]??".",c[1]??".")};continue}if(i==="u"){let s=Fr(o.slice(2),9);if(s===null)continue;let c=s.rest;if(c==="")continue;n[c]={status:"conflicted"}}}}return n}function an(e){return Lr(e)?Ii[e]:"neutral"}function Sn(e){return Lr(e)?Ai[e]:"?"}function bt(e){return`status.${e}`}function Rn(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Nr(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Mr(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Dr(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var zi=["conflicted","deleted","renamed","added","modified","untracked"];function Bi(e){return an(zi.find(n=>e.has(n))??"modified")}function Ir(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let s=i.split("/"),c=r.endsWith("/")?s.length:s.length-1,a="";for(let d=0;d<c;d+=1){let u=s[d];if(u===void 0||u==="")continue;a=a===""?u:`${a}/${u}`;let g=n.get(a);g===void 0?n.set(a,{count:1,present:new Set([o.status])}):(g.count+=1,g.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Bi(o.present)});return t}var jr=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],zr=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Wi(e){return zr.test(e)?e.slice(0,e.indexOf("/")):null}function _i(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ki(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let s=_i(i[2]??"");s!==""&&zr.test(s)&&t.push(s)}return t}function $i(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let s=i.trim();if(s===""||s.startsWith("#")||s.startsWith(";"))continue;let c=/^\[(.+)\]$/u.exec(s);if(c!==null){o(),r=/^submodule(\s|$)/u.test(c[1]??"");continue}if(!r)continue;let a=/^path\s*=\s*(.*)$/u.exec(s);a!==null&&(t=(a[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Ar(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Or(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Tn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let c of $i(r))t.set(c,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let c of Ki(i))o.add(c);let s=e.get("package.json");if(typeof s=="string"){let c=Ar(s);if(c!==void 0){let a=c.workspaces,d=a!==null&&typeof a=="object"&&!Array.isArray(a)?a.packages:void 0;for(let u of Or(Array.isArray(a)?a:d))o.add(u)}}for(let c of["turbo.json","lerna.json"]){let a=e.get(c);if(typeof a!="string")continue;let d=Ar(a);if(d!==void 0)for(let u of Or(d.packages))o.add(u)}for(let c of o){let a=Wi(c);a!==null&&n.has(a)&&t.set(c,"package")}return t}function Cn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Hi=new Set(["node_modules",".git","dist","__pycache__"]);function Gi(e){return Hi.has(e)}function Vi(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function En(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Gi(r))continue;let o=Vi(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var qi=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Ui=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Xi=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Yi=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Zi=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Qi=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Ji=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Br(e){let n=ve(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Ge(e,n="file"){if(n==="directory")return"folder";let t=ve(e.toLowerCase());if(Ji.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Br(t);return r===""?"file":qi.has(r)?"code":Ui.has(r)?"markdown":Xi.has(r)?"data":Yi.has(r)?"image":Zi.has(r)?"style":Qi.has(r)?"archive":"file"}var ea={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},na={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Ve(e){let n=ve(e.toLowerCase()),t=ea[n];if(t!==void 0)return t;let r=Br(n),o=na[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function sn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Pr} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Pn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),s=Math.max(0,e.length-i-o*2),c=Math.floor(Math.max(0,n.scrollTop)/t)-o,a=Math.min(Math.max(c,0),s),d=Math.min(e.length,a+i+o*2);return{rows:e.slice(a,d),startIndex:a,endIndex:d}}function kt(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Fn(e){return e===""?".":e}function Ln(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function qe(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Nn(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=qe(r,o),t.push(r);return t}function wt(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Mn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let a=wt(t[2]),d=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return d===""||a<1?void 0:{path:d,line:a,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let a=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return a===""?void 0:{path:a,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let a=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return a===""?void 0:{path:a,line:wt(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let c=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(c!=="")return{path:c,line:wt(i[2]),absolute:!1}}function Wr(e){return e.selectionMoved?!0:e.cursorPath===void 0}function _r(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Dn(e,n,t,r){let o=[],i=Ir(t),s=(c,a)=>{let d=e.get(c);if(!(d===void 0||d.status!=="ready"))for(let u of d.nodes){let g=qe(c,u.name),f=u.kind==="directory",m=f&&n.has(g),S=f||t===void 0?void 0:t[g],p=S?.status??(f?void 0:Rn(g,t)),P=S===void 0?void 0:Nr(S),q=f?i.get(g):void 0,M=f?Cn(r,g):void 0;if(o.push({type:"entry",path:g,name:u.name,kind:u.kind,depth:a,expanded:m,...u.size===void 0?{}:{size:u.size},...p===void 0?{}:{status:p},...q===void 0?{}:{statusCount:q.count,statusTone:q.tone},...P===void 0?{}:{diff:P},...M===void 0?{}:{tag:M}}),!m)continue;let D=e.get(g);if(D===void 0||D.status==="loading"){o.push({type:"status",key:`${g}:loading`,path:g,depth:a+1,state:"loading"});continue}if(D.status==="failed"){o.push({type:"status",key:`${g}:failed`,path:g,depth:a+1,state:"failed",message:D.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(D.nodes.length===0){o.push({type:"status",key:`${g}:empty`,path:g,depth:a+1,state:"empty"});continue}s(g,a+1),D.truncated&&o.push({type:"status",key:`${g}:truncated`,path:g,depth:a+1,state:"truncated",label:sn({entries:D.nodes,truncated:!0,total:D.total}).label})}};return s("",0),o}var ta=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function ra(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function oa(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&ta.has(ra(n.path)))}function Kr(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=oa(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function In(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var St="dsh-fs-explorer:bridge",ia="fs-explorer-bridge",Vr="dsh-resource://file/**",Rt="sidebar.right.pane.tab",aa=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),sa=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),da=new Set(["makefile","dockerfile","license","readme","changelog"]),la=new Set([...Cr(),...aa]);function ca(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function An(e){if(typeof e!="string"||e==="")return!1;let n=ve(e).toLowerCase();if(n==="")return!1;let t=ca(n);return sa.has(t)?!1:da.has(n)?!0:la.has(t)}function ua(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function fa(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Et(e,n){if(typeof e!="string")return;let t=tn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=fa(n,ua(e));return`${Ln(r)?"abs:":"path:"}${r}:${String(o)}`}function Pt(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=tn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!An(r.path))return{action:"keep",reason:"refused"};let o=Et(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function be(e,n){n===void 0?console.warn(`[${ee}] ${e}`):console.warn(`[${ee}] ${e}`,n)}function pa(e){console.debug(`[${ee}] ${e}`)}function Tt(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Ct(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Ae(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function $r(e){return Ae(()=>e.sidebarRightTabs,Tt)??Ae(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Tt)}function Hr(e){return Ae(()=>e.sidebarRight,Ct)??Ae(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Ct)}function Gr(e){return typeof e=="function"?e:()=>{}}var ya="dsh-resource://file/session/probe/src/main.ts";function ma(e){let n=Ae(()=>(typeof e.candidates=="function"?e.candidates(ya):[]).filter(r=>r.priority==="extension"&&r.id!==St),t=>Array.isArray(t)&&t.length>0);n!==void 0&&be(`another extension-band tab type already claims ${Vr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function ga(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ha(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function xa(e,n){let t=e.viewFocus;if(t?.request?.(Z,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(Z,n);return(!r.opened||r.focused)&&t?.take(Z),r}return typeof e.openView=="function"&&e.openView(Z,n)?(t?.take(Z),{opened:!0,focused:!0}):(t?.take(Z),{opened:!1,focused:!1})}function Ft(e,n,t,r){let o;try{o=xa(e,r)}catch(i){return be("the file workbench threw while switching views",i),e.viewFocus?.take(Z),!1}if(!o.opened)return be(`the file workbench did not switch to ${Z}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return be("the forwarded tab could not be closed",i),!1}}function va(e,n){function t({useTabInfo:r}){let i=r()?.tab,s=typeof i?.id=="string"&&i.id!==""?i.id:void 0,c=ga(i),a=ha(i),d=(0,Ue.useRef)(void 0);return(0,Ue.useEffect)(()=>{if(s===void 0){be("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===s)return;d.current=s;let u=Pt(c,e.currentSessionId(),a);if(u.action!=="open"){be(`left the forwarded tab standing (${u.reason})`,c);return}Ft(e,n,s,u.focus)},[s,c,a]),null}return function(o){return typeof o.useTabInfo!="function"?(be(`the host did not inject useTabInfo into ${Rt}; the bridge cannot forward`),null):(0,Ue.createElement)(t,{useTabInfo:o.useTabInfo})}}function Lt(e,n){let t=(c,a)=>{if(c===void 0||a===void 0)return;ma(c);let d;try{d=c.register({id:St,kind:ia,patterns:[Vr],priority:"extension",canOpen:f=>{let m=tn(f);return m!==null&&An(m.path)},title:f=>ve(tn(f)?.path??f)||f})}catch(f){be("the sidebar right refused the address bridge tab type",f);return}let u=va(n,a),g;try{g=Gr(e.slots.inject(Rt,()=>e.slots.register({name:Rt,key:St},u)))}catch(f){d(),be("the sidebar right refused the address bridge body",f);return}return()=>{g(),d()}},r=$r(e),o=Hr(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return pa("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let s=i.call(e,["sidebarRightTabs","sidebarRight"],c=>{let a=Ae(()=>c.get?.("sidebarRightTabs"),Tt)??$r(c),d=Ae(()=>c.get?.("sidebarRight"),Ct)??Hr(c);return t(a,d)});return Gr(s)}var Nt={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u53EA\u6709\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Mt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the current page only","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function Dt(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Nt:Mt)["tab.label"]??"Files"}var ba=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function Q(e){return e!==null&&typeof e=="object"}function jn(e,n){return{ok:!1,code:e,message:n}}function zn(e){let n=Q(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return jn(t,r)}function It(){return jn("invalid-response","the document service answered an invalid response")}function On(e){try{return e()}catch{return}}function wa(e){let n=Q(e)?e:void 0;if(n===void 0)return It();if(n.ok===!1)return zn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Q(t)?t:void 0;if(r===void 0)return It();if(r.ok===!1)return zn(r.error);let o=Q(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?It():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function ka(e){let n=Q(e)?e:void 0;if(n===void 0)return qr();if(n.ok===!1)return zn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Q(t)?t:void 0;if(r===void 0)return qr();if(r.ok===!1)return zn(r.error);let o=Q(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function qr(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function At(e){return Q(e)&&typeof e.open=="function"}function Sa(e){let n=On(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Q(n)?n.rpc:void 0;if(!(!Q(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Er}/${r}`,o,i)}function Ra(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Ta(e){let n=Q(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=Q(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=Q(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function Ur(e,n){let t=jt(e);return async(r,o)=>{let i=t(),s=i?.locate;if(typeof s=="function")try{return Ta(await s.call(i,{sessionId:n,path:r},o))}catch{return}}}function jt(e){return()=>{let n=On(()=>e.fsExplorerDocuments);if(At(n))return n;let t=On(()=>Q(e.remote)?e.remote.fsExplorerDocuments:void 0);if(At(t))return t;let r=On(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(At(r))return r;let o=Sa(e);if(o!==void 0)return Ra(o)}}function Xr(e){let n=jt(e);return async(t,r,o)=>{let i=n();if(i===void 0)return jn("unavailable","the document service is unavailable");try{return wa(await i.open({sessionId:t,path:r},o))}catch(s){return jn("io-error",s instanceof Error?s.message:String(s))}}}function Yr(e){let n=jt(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return ka(await i.call(o,t,r))}catch(s){return{ok:!1,code:"io-error",message:s instanceof Error?s.message:String(s)}}}}function Zr(e){let n=new Map,t=new Set,r=0,o=(c,a)=>`${c}\0${a}`,i=()=>{r+=1;for(let c of[...t])c()},s=(c,a)=>n.get(o(c,a))?.session;return{acquire(c,a){let d=o(c,a),u=n.get(d);return u===void 0&&(u={session:new Ot(c,a,e.open,e.save,()=>{n.delete(d),i()},i)},n.set(d,u),i()),u.session.retain(),u.session},peek(c,a){return s(c,a)?.getSnapshot()},find:s,forget(c,a){n.get(o(c,a))?.session.abandon()},subscribe(c){return t.add(c),()=>{t.delete(c)}},revision:()=>r}}var Ot=class{constructor(n,t,r,o,i,s){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=s}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=ba;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let s=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:s,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:s}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let s=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:s}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Bn=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ca(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Qr(e,n,t=Ca()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",s=r.includes("alt"),c=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===s&&e.shiftKey===!0===c}function Jr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Ea(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Wn(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function _n(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Ea(n),e.onClose?.()}}function eo(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function Kn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function $n(e){try{return e()}catch{return}}function no(e){return()=>{let n=$n(()=>e.fileReferences);if(Kn(n))return n;let t=$n(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(Kn(t))return t;let r=$n(()=>e.remote?.fileReferences);if(Kn(r))return r;let o=$n(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return Kn(o)?o:void 0}}function to(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function ro(e){let n=e.trim();return n===""?void 0:n}function zt(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let s=o.kind,c=s==="file"?Rn(i,n):void 0,a=Pa(i);t.push({type:"entry",path:i,name:eo(i),kind:s,depth:0,expanded:!1,...c===void 0?{}:{status:c},...a===""?{}:{directory:a}})}return t}function Pa(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function dn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:qe(t,o.name),kind:o.kind});return n}function oo(e,n){let t=n.toLowerCase();return e.filter(r=>eo(r.path).toLowerCase().includes(t))}function io(e){return Nn(e)}var Xe=require("react");function Gn(e){let n=ve(e);return n===""?e:n}function Hn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Fa=Object.freeze({panels:Object.freeze([]),active:null});function ao(e,n){return n===void 0?e:`git\0${n}\0${e}`}var La=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Bt(){let e=[],n=null,t=Fa,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(u=>u.key===d),s=d=>e.findIndex(u=>u.revision===void 0&&u.key===d),c=d=>{if(typeof d!="string")return;if(i(d)>=0)return d;let u=La.exec(d);if(u!==null){let m=(u[1]??"").toLowerCase(),S=Hn(u[2]??"",!1);if(S===void 0)return;let p=ao(S,m);return i(p)>=0?p:void 0}let g=Hn(d,!0);if(g===void 0)return;if(s(g)>=0)return g;let f=Hn(d,!1);if(!(f===void 0||f===g))return s(f)>=0?f:void 0},a=d=>{if(e.length===0)return;let u=n===null?-1:i(n),g=e[(u+d+e.length)%e.length];g===void 0||g.key===n||(n=g.key,o())};return{open(d,u=1,g=!1,f){let m=Hn(d,g);if(m===void 0)return;let S=typeof f=="string"&&f.trim()!==""?f.trim().toLowerCase():void 0,p=ao(m,S),P=Number.isFinite(u)&&u>0?Math.trunc(u):1,q=i(p);if(q>=0){let A=e[q],W=A!==void 0&&(A.line!==P||A.absolute!==g);if(W&&(e=e.map((O,j)=>j===q?{...O,line:P,absolute:g}:O)),n===p){W&&o();return}n=p,o();return}let M=n===null?e.length:i(n)+1,D={key:p,path:m,line:P,absolute:g,...S===void 0?{}:{revision:S}};e=[...e.slice(0,M),D,...e.slice(M)],n=p,o()},close(d){let u=d===void 0?n:c(d)??null;if(u===null)return;let g=i(u);g<0||(e=e.filter(f=>f.key!==u),n===u&&(n=(e[g]??e[g-1])?.key??null),o())},activate(d){let u=c(d);u===void 0||i(u)<0||n===u||(n=u,o())},next(){a(1)},previous(){a(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let u=c(d);return u!==void 0&&i(u)>=0},activeEntry(){return e.find(d=>d.key===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function so(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Bt();return e.set(t,o),o}}}function Vn(e,n){let t=Mn(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var N=require("react/jsx-runtime"),Wt={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Na=()=>()=>{},Ma=()=>"";function Da(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function lo({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:s,sessionId:c}){let a=(0,Xe.useRef)(null);(0,Xe.useEffect)(()=>{a.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let d=(0,Xe.useSyncExternalStore)(s?.subscribe??Na,()=>Da(s,c,e).join("\0"),Ma),u=new Set(d===""?[]:d.split("\0"));if(e.length===0)return null;let g=f=>{if(f.key==="ArrowRight"||f.key==="ArrowLeft"){f.preventDefault(),f.stopPropagation(),i(f.key==="ArrowRight"?1:-1);return}(f.key==="Delete"||f.key==="Backspace")&&n!==null&&(f.preventDefault(),f.stopPropagation(),o(n))};return(0,N.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((f,m)=>{let S=f.key===n,p=Gn(f.path),P=t("panel.close").replace("{name}",p);return(0,N.jsxs)("div",{className:"fx-tab","data-active":S?"true":"false","data-dirty":u.has(f.path)?"true":"false",role:"presentation",children:[(0,N.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${m}`,"aria-controls":`fx-panel-${m}`,"aria-selected":S,tabIndex:S?0:-1,title:f.path,"data-testid":"fs-tab","data-path":f.path,"data-key":f.key,ref:S?a:void 0,onClick:()=>r(f.key),children:[(0,N.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Ge(f.path),"aria-hidden":"true",children:Ve(f.path)}),(0,N.jsx)("span",{className:"fx-tab-name",children:p}),f.revision===void 0?null:(0,N.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:f.revision,children:f.revision.slice(0,7)}),u.has(f.path)?(0,N.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,N.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:S?0:-1,"aria-label":P,title:P,"data-testid":"fs-tab-close",onClick:()=>o(f.key),children:"\xD7"})]},f.key)})})}function co({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:s}){return(0,N.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,N.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,N.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,N.jsx)("span",{className:"fx-spacer"}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:s,children:n("panel.confirm.cancel")})]})}function Ia(){return(0,N.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,N.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,N.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,N.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function uo({t:e}){return(0,N.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,N.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,N.jsx)(Ia,{})}),(0,N.jsx)("strong",{children:e("panel.empty.title")}),(0,N.jsx)("span",{children:e("panel.empty.description")}),(0,N.jsxs)("span",{className:"fx-empty-keys",children:[(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,N.jsx)("span",{children:e("panel.empty.keys")})]})]})}var fo=require("react");function V(e,n,...t){let r=t.filter(s=>s!=null&&s!==!1),o=(0,fo.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Aa(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Oa=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Oe(e){let n=[],t=0;for(let r of e.matchAll(Oa)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(V("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(V("strong",null,...Oe(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(V("del",null,...Oe(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(V("em",null,...Oe(i.slice(1,-1))));else{let s=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),c=s?.[1]??i,a=s===null?void 0:Aa(s[2]??"");n.push(a===void 0?c:V("a",{href:a,rel:"noreferrer noopener"},c))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var po=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,yo=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,mo=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,_t=/^\s{0,3}>\s?(.*)$/u,Kt=/^\s{0,3}[-*+]\s+(.*)$/u,$t=/^\s{0,3}\d+[.)]\s+(.*)$/u;function ja(e){return po.test(e)||yo.test(e)||mo.test(e)||_t.test(e)||Kt.test(e)||$t.test(e)}function go(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=po.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),u=o[2]??"",g=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)g.push(e[t]??""),t+=1;t+=1,n.push(V("pre",null,V("code",u===""?null:{className:`language-${u}`},g.join(`
`))));continue}let i=yo.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(V(`h${String(d)}`,null,...Oe(i[2]??""))),t+=1;continue}if(mo.test(r)){n.push(V("hr",null)),t+=1;continue}if(_t.test(r)){let d=[];for(;t<e.length;){let u=_t.exec(e[t]??"");if(u===null)break;d.push(u[1]??""),t+=1}n.push(V("blockquote",null,...go(d)));continue}if(Kt.exec(r)!==null){let d=[];for(;t<e.length;){let u=Kt.exec(e[t]??"");if(u===null)break;d.push(V("li",null,...Oe(u[1]??""))),t+=1}n.push(V("ul",null,...d));continue}if($t.exec(r)!==null){let d=[];for(;t<e.length;){let u=$t.exec(e[t]??"");if(u===null)break;d.push(V("li",null,...Oe(u[1]??""))),t+=1}n.push(V("ol",null,...d));continue}let a=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||ja(d))break;a.push(d.trim()),t+=1}n.push(V("p",null,...Oe(a.join(" "))))}return n}function qn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return V("div",{className:"fx-md"},...go(n))}var Ht=200,za={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function un(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":za[t.slice(r+1)]??"plaintext"}function fn(e){return un(e)==="markdown"}var X=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function ln(e){return e!==null&&typeof e=="object"}function Ba(e){return e===""?0:e.split(`
`).length}function Ye(e,n){if(!ln(e))throw new X("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=ln(e.error)?e.error:{},g=typeof u.code=="string"?u.code:"preview/unknown",f=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",m=ln(u.details)?u.details:{},S=typeof m.kind=="string"?m.kind:"";throw new X(g,f,S)}let t=e.ok===!0?e.value:e;if(!ln(t)||typeof t.text!="string")throw new X("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ba(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,s=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,c=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,a=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,d={text:t.text,lines:r,offset:i,eof:s,...c===void 0?{}:{source:c},...a===void 0?{}:{linkTarget:a}};return o===void 0?d:{...d,totalLines:o}}function je(e){let n=ln(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var cn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Un({files:e,maxLines:n=Ht}){let t=Math.max(1,Math.trunc(n)),r=cn,o=0,i=null,s=[1],c=new Set,a=u=>{r=u;for(let g of c)g()},d=async(u,g)=>{o+=1;let f=o;i?.abort();let m=new AbortController;i=m,a({status:"loading",path:u,text:r.path===u?r.text:"",offset:g,lines:r.path===u?r.lines:0,...r.path===u&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===u&&r.source!==void 0?{source:r.source}:{},eof:r.path===u?r.eof:!1});try{let S=await e.read(u,g>1?{offset:g,limit:t}:{limit:t},m.signal);if(f!==o)return;let p=Ye(S,g);if(p.lines===0&&g>1){a({...r,status:"ready",eof:!0,text:"",lines:0});return}let P={status:"ready",path:u,text:p.text,offset:p.offset,lines:p.lines,eof:p.eof,...p.source===void 0?{}:{source:p.source},...p.linkTarget===void 0?{}:{linkTarget:p.linkTarget,linkPath:u}};a(p.totalLines===void 0?P:{...P,totalLines:p.totalLines})}catch(S){if(f!==o||m.signal.aborted)return;a({status:"failed",path:u,text:"",offset:g,lines:0,eof:!1,failure:je(S)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(u){return c.add(u),()=>{c.delete(u)}},async open(u){s=[1],await d(u,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let u=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&u>r.totalLines||(s.push(u),await d(r.path,u))},async prev(){if(r.path===void 0||s.length<=1)return;s=s.slice(0,-1);let u=s[s.length-1]??1;await d(r.path,u)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,s=[1],a(cn)}}}function Xn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Gt=Object.freeze({chunk:vt.chunk,id:`${ee}/${vt.chunk}`}),Vt=null,pn=null,Yn=new Map;function ho(e){Vt=e}function xo(){return Gt}function Wa(e){let n=wn[e];return{chunk:n,id:`${ee}/${n}`}}function qt(){if(pn!==null)return pn;let e=Vt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let n=e.async(`./${Gt.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ee}: chunk ${Gt.id} is missing its preview renderers`);return r});return pn=n,n.catch(()=>{pn===n&&(pn=null)}),n}function vo(e){let n=Yn.get(e);if(n!==void 0)return n;let t=Vt;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let r=Wa(e),o=t.async(`./${r.chunk}`).then(i=>{let s=i;if(s===null||typeof s.FamilyView!="function"||s.renderer!==e)throw new Error(`${ee}: chunk ${r.id} is not the ${e} view`);return s});return Yn.set(e,o),o.catch(()=>{Yn.get(e)===o&&Yn.delete(e)}),o}var E=require("react");async function Ut(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Qn=require("react");function _a(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function Zn(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(_a(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function bo(e,n,t){return n<=0?0:((e+t)%n+n)%n}function wo(e){let n=[],t=[],r=0,o=0;return e.forEach((i,s)=>{s>0&&(n.push(`
`),r+=1);for(let c of i)c!==""&&t.push({node:o,start:r,length:c.length}),n.push(c),r+=c.length,o+=1}),{text:n.join(""),runs:t}}function Xt(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function ko(e){let n=t=>Zn(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var Ka=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),$a=new Set(["SCRIPT","STYLE","TEMPLATE"]);function Ha(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let d=i.data;if(d==="")continue;let u=n.at(-1);u===void 0?n.push([d]):u.push(d),t.push(i);continue}if(i.nodeType!==1)continue;let s=i,c=s.tagName.toUpperCase();if($a.has(c))continue;if(c==="BR"){n.push([]);continue}let a=Ka.has(c);a&&n.push([]),r(s),a&&n.push([])}};return r(e),{layout:wo(n),nodes:t}}function So(e){let n=()=>{let r=e();return r===null?void 0:Ha(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:Zn(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),s=e();if(i===void 0||s===null)return;let c=Zn(i.layout.text,r)[o];if(c===void 0)return;let a=Xt(i.layout,c.from),d=Xt(i.layout,c.to);if(a===void 0||d===void 0)return;let u=i.nodes[a.node],g=i.nodes[d.node];if(u===void 0||g===void 0)return;let f=s.ownerDocument.createRange();try{f.setStart(u,Math.min(a.offset,u.data.length)),f.setEnd(g,Math.min(d.offset,g.data.length))}catch{return}let m=t();m!==void 0&&(m.removeAllRanges(),m.addRange(f));let S=f.startContainer.parentElement;S!==null&&typeof S.scrollIntoView=="function"&&S.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var Yt=(0,Qn.createContext)(null);function Ro(){return(0,Qn.useContext)(Yt)}var we=require("react/jsx-runtime");function Ga(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Va(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Zt({failure:e,t:n,onRetry:t}){return(0,we.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,we.jsx)("strong",{children:Ga(e,n)}),(0,we.jsx)("span",{children:Va(e,n)}),e.message===""?null:(0,we.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,we.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function Qt({t:e}){return(0,we.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,we.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var ne=require("react");var Ee=require("react/jsx-runtime");function To({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,ne.useState)(""),[s,c]=(0,ne.useState)(0),[a,d]=(0,ne.useState)(0),u=(0,ne.useRef)(null);(0,ne.useEffect)(()=>{u.current?.focus()},[]),(0,ne.useEffect)(()=>{if(o===""){d(0),c(0);return}let p=n().count(o);d(p),c(P=>p===0?0:Math.min(P,p-1))},[o,t,n]),(0,ne.useEffect)(()=>{o===""||a===0||n().reveal(o,s)},[o,s,a,n]);let g=(0,ne.useCallback)(()=>{n().clear(),r()},[n,r]),f=(0,ne.useCallback)(p=>{a!==0&&c(P=>bo(P,a,p))},[a]),m=p=>{if(!p.nativeEvent.isComposing){if(p.key==="Escape"){p.preventDefault(),p.stopPropagation(),g();return}if(p.key==="Enter"){p.preventDefault(),f(p.shiftKey?-1:1);return}(p.key==="ArrowDown"||p.key==="ArrowUp")&&p.stopPropagation()}},S=o===""?e("preview.find.hint"):a===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(s+1)).replace("{count}",String(a));return(0,Ee.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:m,children:[(0,Ee.jsx)("input",{ref:u,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:p=>{i(p.currentTarget.value),c(0)}}),(0,Ee.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":a===0?"empty":"ready",title:e("preview.find.scope"),children:S}),(0,Ee.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:a===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>f(-1),children:"\u2191"}),(0,Ee.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:a===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>f(1),children:"\u2193"}),(0,Ee.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:g,children:"\xD7"})]})}var Jt="fsExplorer",Co=1;function qa(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Ua(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Xa(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Ya(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Jn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let s=i?.id;if(typeof s!="string"||s==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${s}" has no load(); it was refused`),()=>{};if(t.has(s))return n(`renderer registry: "${s}" is already registered; the first registration stays`),()=>{};t.set(s,{contribution:i,extensions:(i.match?.extensions??[]).map(Ua),families:[...i.match?.families??[]]}),o();let c=!0;return()=>{c&&(c=!1,t.delete(s),o())}},resolve(i){let s=qa(i.path),c=rn(i.path),a;for(let d of t.values())Xa(d,s,c)&&(a===void 0||Ya(d.contribution,a.contribution))&&(a=d);return a?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Eo(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function et(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function ke(e){try{return e()}catch{return}}function he(e){return e!==null&&typeof e=="object"}function Mo(e){return()=>{let n=ke(()=>e.workspaceFiles);if(et(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(et(t))return t;let r=ke(()=>e.remote?.workspaceFiles);if(et(r))return r;let o=ke(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(et(o))return o}}function Do(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Io(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),s;try{return Ye(i,r.offset??1),i}catch(d){if(!(d instanceof X)||je(d).kind!=="symlink")throw d;s=d}let c=await n(t,o);if(c===void 0)throw s;return{...Ye(await e.read(c.absolutePath,r,o),r.offset??1),linkTarget:c.absolutePath}}}}function Po(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Za(e){let n=ke(()=>typeof e.get=="function"?e.get("connection"):void 0),t=he(n)?n.rpc:void 0;if(!he(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Ao(e){return()=>{let n=ke(()=>e.remote?.gitExplorer);if(Po(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Po(t)?t:Za(e)}}function Qa(e){return e===""?0:e.split(`
`).length}function Fo(e){let n=he(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new X(t,r)}function Oo(e,n,t){return{async read(r,o,i){let s={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},c=await e.show(s,i);if(!he(c))throw new X("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(c.ok===!1)throw Fo(c.error);let a=c;if(c.ok===!0&&(a=c.value),!he(a))throw new X("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(a.ok===!1)throw Fo(a.error);let d=a;if(a.ok===!0&&(d=a.page),!he(d))throw new X("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(d.kind==="submodule")throw new X("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(d.binary===!0||d.kind==="binary")throw new X("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof d.text!="string")throw new X("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let u=typeof d.lines=="number"&&Number.isFinite(d.lines)?Math.max(0,Math.trunc(d.lines)):Qa(d.text),g=typeof d.offset=="number"&&Number.isFinite(d.offset)&&d.offset>0?Math.trunc(d.offset):o.offset??1,f=d.source==="first-parent"?"first-parent":d.source==="commit"?"commit":void 0;return{text:d.text,lines:u,offset:g,eof:d.eof===!0,...f===void 0?{}:{source:f}}}}}function Ja(e){if(!he(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=he(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function es(e){let n=he(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=he(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new X(t,r,i)}function tr(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ja(await n.call(e,t,r,{},o));if(!i.ok)throw es(i.error);return i.value.data}}function yn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function er(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function nt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:yn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?er(r.value):{ok:!1,message:yn(r.error)}}return er(t)}return er(n)}function jo(e){return e instanceof Error?e.message:yn(e)}function Lo(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function zo(e){return()=>{let n=ke(()=>e.remote?.gitExplorer);if(Lo(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Lo(t))return t}}function No(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function ns(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=No(r.additions),i=No(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function ts(e){if(e===null||typeof e!="object")return;let n=e,t=s=>typeof s=="number"&&Number.isFinite(s)&&s>=0?s:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function nr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=ns(n.stats),r=ts(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function tt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:yn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?nr(o.snapshot):{ok:!1,message:yn(o.error)}}let r=e;return r.snapshot!==void 0?nr(r.snapshot):nr(t)}var w=require("react/jsx-runtime"),ar={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},rs=()=>()=>{},Bo=()=>{};function sr(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var rr={status:"idle"},os=[".md",".mdx",".markdown",".mdown"],is=-1e3;function ir({t:e,revision:n}){return(0,w.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,w.jsx)("strong",{children:e("preview.unavailable.title")}),(0,w.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function Wo({chunk:e,text:n,path:t,offset:r}){let o=(0,E.useRef)(null),i=(0,E.useRef)(null),s=Ro(),c=(0,E.useRef)(n);c.current=n;let[a,d]=(0,E.useState)(!1),u=un(t);return(0,E.useEffect)(()=>{d(!1)},[e,t]),(0,E.useEffect)(()=>{let g=o.current;if(!(e===null||g===null))try{let f=e.mountCodePreview(g,{text:n,language:u,path:t,offset:r});return i.current=f,()=>{f.destroy(),i.current=null}}catch{d(!0);return}},[e,t,u]),(0,E.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),(0,E.useEffect)(()=>{if(!(s===null||e===null||a))return s.register(ko({text:()=>c.current,select:(g,f)=>i.current?.revealRange(g,f),clear:()=>i.current?.clearSelection()})),()=>s.register(null)},[s,e,a]),e===null||a?(0,w.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,w.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function as({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&fn(n)?(0,w.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:qn(r)}):(0,w.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function ss(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,w.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,w.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,w.jsx)(Wo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ds(e){function n({page:t,path:r}){return(0,w.jsx)(Wo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ls({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:s}){let c=(0,E.useMemo)(()=>{let a=tr(r);return a===void 0||t===void 0||s===void 0?a:async(d,u,g)=>{if(d!==t||u!==n)return a(d,u,g);let f=await s(u,g);return a(d,f?.absolutePath??u,g)}},[r,t,n,s]);return t===void 0||c===void 0?(0,w.jsx)(ir,{t:o}):(0,w.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:c,t:o,visible:i})}function cs(e){return{Body:n=>(0,w.jsx)(ls,{chunk:e,...n}),renderer:e.renderer}}function dr(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...os]},priority:0,load:()=>qt().then(ss)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:is,load:()=>qt().then(ds)},...Object.keys(wn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>vo(e).then(cs)}))]}var or;function us(){if(or!==void 0)return or;let e=Jn();for(let n of dr())e.register(n);return or=e,e}function _o({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:s=!0,renderers:c,documents:a,locate:d}){let u=(0,E.useMemo)(()=>{let F=r===void 0?Do(n,e):o===void 0||e===void 0?void 0:Oo(o,e,r);return F===void 0||r!==void 0||d===void 0?F:Io(F,d)},[n,e,r,o,d]),g=(0,E.useMemo)(()=>r===void 0?tr(n):void 0,[n,r]),f=c??us(),m=t===void 0?null:rn(t),S=m!==null,p=r===void 0&&e!==void 0&&g!==void 0?{sessionId:e,readFile:g}:null,[P,q]=(0,E.useState)(null),[M,D]=(0,E.useState)(cn),[A,W]=(0,E.useState)(rr),[O,j]=(0,E.useState)(0),[te,Fe]=(0,E.useState)(0),[re,Le]=(0,E.useState)("reading"),[Se,h]=(0,E.useState)(!1),[T,b]=(0,E.useState)(!1),[C,U]=(0,E.useState)(void 0),[fe,oe]=(0,E.useState)(!1),[ie,pe]=(0,E.useState)(!1),Re=(0,E.useRef)(null),z=(0,E.useRef)(null),_=(0,E.useRef)(void 0),G=(0,E.useRef)(void 0),K=(0,E.useSyncExternalStore)(a?.subscribe??rs,()=>a===void 0||e===void 0||t===void 0?Bo():a.peek(e,t),Bo),Be=a===void 0||e===void 0||t===void 0?void 0:a.find(e,t);if((0,E.useEffect)(()=>{if(u===void 0){q(null);return}let F=Un({files:u,maxLines:Ht});return q(F),()=>F.close()},[u]),(0,E.useEffect)(()=>{if(P===null){D(cn);return}return D(P.getSnapshot()),P.subscribe(()=>D(P.getSnapshot()))},[P]),(0,E.useEffect)(()=>{P===null||t===void 0||m!==null||P.open(t)},[P,t,m]),(0,E.useEffect)(()=>{if(!S||t===void 0||d===void 0){U(void 0);return}let F=new AbortController,Y=!0;return(async()=>{let me=await d(t,F.signal);Y&&!F.signal.aborted&&U(me?.absolutePath)})(),()=>{Y=!1,F.abort()}},[S,t,d]),(0,E.useEffect)(()=>{Le("reading"),h(!1),oe(!1)},[t]),(0,E.useEffect)(()=>()=>{_.current!==void 0&&clearTimeout(_.current),G.current!==void 0&&clearTimeout(G.current)},[]),(0,E.useEffect)(()=>{K?.conflict!==!0&&(b(!1),oe(!1),G.current!==void 0&&clearTimeout(G.current))},[K?.conflict]),(0,E.useEffect)(()=>f.subscribe(()=>j(F=>F+1)),[f]),(0,E.useEffect)(()=>{if(t===void 0||r!==void 0){W(rr);return}let F=Eo(f,{path:t});if(F===void 0){W(rr);return}let{contribution:Y}=F,me=!0;return W(ge=>ge.status==="ready"&&ge.contribution.id===Y.id?ge:{status:"loading",contribution:Y}),F.module.then(ge=>{me&&W({status:"ready",contribution:Y,module:ge})},ge=>{me&&W({status:"failed",contribution:Y,failure:je(ge)})}),()=>{me=!1}},[f,t,r,O,te]),t===void 0)return(0,w.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,w.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,w.jsx)("strong",{children:i("preview.empty.title")}),(0,w.jsx)("span",{children:i("preview.empty.description")})]})});let We=S&&r!==void 0,_e=Xn(M),ae=M.linkPath??t,de=S?C:M.linkTarget,le=!S&&fn(t),ce=S?!We&&p!==null&&A.status!=="ready"&&A.status!=="failed":M.status==="loading",ue=M.status==="ready",Ne=le&&re==="reading",Te=S?We||p===null?"unavailable":A.status==="failed"?"failed":A.status==="ready"?"ready":"loading":M.status,$=A.status==="ready"?A.module.renderer??A.contribution.id:S?"pending":Ne?"fallback":"plain",Me=(0,E.useMemo)(()=>So(()=>Re.current),[]),mn=(0,E.useMemo)(()=>()=>z.current??Me,[Me]),Ze=(0,E.useMemo)(()=>({register:F=>{z.current=F}}),[]),ct=[ae,String(re),M.offset,M.text.length,$].join("|"),gn=!S&&ue,Ke={path:de??t,sessionId:e,files:n,t:i,visible:s,mode:re,...S?{}:{page:{text:M.text,offset:M.offset}},...d===void 0?{}:{locate:d}},J=()=>{Ut(de??ae).then(F=>{F&&(h(!0),_.current!==void 0&&clearTimeout(_.current),_.current=setTimeout(()=>h(!1),1400))})},ut=()=>{let F=Be?.copyDraft();F!==void 0&&Ut(F).then(Y=>{Y&&(b(!0),G.current!==void 0&&clearTimeout(G.current),G.current=setTimeout(()=>b(!1),1400))})},$e=K?.error,Qe=$e!=null&&K?.conflict!==!0,ye=K?.conflict===!0,Ce=K?.discarded??null,Je=!ye&&Ce!==null&&K?.dirty!==!0&&Ce!==K?.text,se;if(S){let F=A.status==="ready"?A.module.Body:void 0;se=We?(0,w.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,w.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,w.jsx)("span",{children:i("preview.commitBinary.description")})]}):p===null?(0,w.jsx)(ir,{t:i,revision:r}):A.status==="failed"?(0,w.jsx)(Zt,{failure:A.failure,t:i,onRetry:()=>Fe(Y=>Y+1)}):F===void 0?(0,w.jsx)(Qt,{t:i}):(0,w.jsx)(F,{...Ke})}else if(u===void 0)se=(0,w.jsx)(ir,{t:i,revision:r});else if(M.status==="failed")se=(0,w.jsx)(Zt,{failure:M.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{P?.retry()}});else if(!ue)se=(0,w.jsx)(Qt,{t:i});else{let F=A.status==="ready"?A.module.Body:as;se=(0,w.jsx)(F,{...Ke})}return(0,w.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Te,"data-mode":S?"binary":Ne?"reading":"code","data-renderer":$,children:[(0,w.jsxs)("header",{className:"fx-preview-bar",children:[(0,w.jsxs)("span",{className:"fx-preview-path",title:de===void 0?ae:`${ae} \u2192 ${de}`,"data-testid":"fs-preview-path",...de===void 0?{}:{"data-link":"followed"},children:[ae,de===void 0?null:(0,w.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",de]})]}),S?null:(0,w.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[_e.range,_e.range==="\u2014"?null:(0,w.jsxs)(w.Fragment,{children:[" ",i("preview.lines")]}),_e.total===void 0?null:(0,w.jsxs)("span",{className:"fx-preview-total",children:[" / ",_e.total," ",i("preview.lines")]})]}),(0,w.jsxs)("div",{className:"fx-preview-actions",children:[K===void 0?null:(0,w.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!K.dirty||K.saving||K.status!=="ready",onClick:()=>{Be?.save()},children:K.saving?i("preview.saving"):i("preview.save")}),le?(0,w.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>Le(F=>F==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(re==="reading"?"preview.source":"preview.reading")}):null,S?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ue||ce||M.offset<=1,onClick:()=>{P?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,w.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ue||ce||M.eof,onClick:()=>{P?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),gn?(0,w.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":ie?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":ie,onClick:()=>pe(F=>!F),children:i("preview.find")}):null,(0,w.jsx)("button",{type:"button",className:"fx-pbtn",onClick:J,"data-testid":"fs-preview-copy",children:i(Se?"preview.copied":"preview.copyPath")}),ce?(0,w.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),ie&&gn?(0,w.jsx)(To,{t:i,surface:mn,stamp:ct,onClose:()=>pe(!1)}):null,M.source==="first-parent"?(0,w.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,ye||Je?(0,w.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":ye?"conflict":"discarded",children:[(0,w.jsx)("strong",{children:i(ye?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,w.jsx)("span",{className:"fx-conflict-hint",children:i(ye?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,w.jsx)("span",{className:"fx-spacer"}),ye?(0,w.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":fe?"discard":void 0,onClick:()=>{if(!fe&&K?.dirty===!0){oe(!0);return}oe(!1),Be?.reload({force:!0})},children:i(fe?"preview.conflict.discard":"preview.conflict.reload")}):null,Je?(0,w.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Ce!==null&&Be?.setDraft(Ce)},children:i("preview.conflict.restore")}):null,ye?(0,w.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:ut,children:i(T?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Qe?(0,w.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",sr($e?.code??"io-error",$e?.message??"",i))}):null,(0,w.jsx)("div",{className:"fx-preview-body","data-scroll":Ne?"y":"none",ref:Re,children:(0,w.jsx)(Yt.Provider,{value:Ze,children:se})})]})}var Ko="dsh-fs-explorer-styles",fs=`
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
/* The tree's search bar lives in the pane, above the scroller and outside it:
   the scroller owns the tree's key handler and its prefix jump, so an input
   nested there would lose every typed letter to the typeahead. */
.fx-search {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-height: 30px;
  padding: 0 8px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 22px;
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: 12px;
  outline: none;
}
.fx-search-input:focus-visible { border-color: var(--fx-accent); }
.fx-search-input::-webkit-search-cancel-button { display: none; }
.fx-search-scope {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: 16px;
  padding: 0 5px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 10%, transparent);
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 9.5px;
  white-space: nowrap;
}
/* The fallback answers a strictly smaller question than the reader asked, so it
   is the one state that gets a warning tone rather than the neutral one. */
.fx-search-scope[data-origin="loaded"] { color: var(--fx-modified); }
.fx-search-count {
  flex: none;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 10.5px;
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
  font-size: 10.5px;
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
.fx-pbtn[data-open="true"] { background: var(--fx-active); color: var(--fx-text); border-color: var(--fx-border); }
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
/* The find bar sits between the toolbar and the body, so it never covers the
   words it points at; it is not inside the scroller for the same reason. */
.fx-find {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  height: 30px;
  padding: 0 10px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-find-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 22px;
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: 12px;
  outline: none;
}
.fx-find-input:focus-visible { border-color: var(--fx-accent); }
.fx-find-input::-webkit-search-cancel-button { display: none; }
.fx-find-count {
  flex: none;
  min-width: 7ch;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.fx-find-count[data-state="empty"] { color: var(--fx-modified); }
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
`;function $o(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Ko}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Ko,t.textContent=fs,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var lr="fs-explorer.treePaneWidth";function cr(e){return Math.min(520,Math.max(180,e))}function Go(e){if(e==null)return null;let n;try{n=e.getItem(lr)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function rt(e,n){let t=Math.round(cr(n));if(e!=null)try{e.setItem(lr,String(t))}catch{}return t}function Vo(e){if(e!=null)try{e.removeItem(lr)}catch{}}function qo(e,n){return Math.round(e)===Math.round(n)}var Ho=16;function Uo(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ho};case"ArrowRight":return{kind:"nudge",delta:Ho};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var I=require("react");function Yo(e,n,t,r=800){return t-n<=r?e:""}function Zo(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Qo(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let s=e[i];s?.type==="entry"&&s.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:ps(e,t+1,r.depth,r.depth+1)}function ps(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let s=e[i];if(s?.type==="entry"){if(s.depth<=t)break;s.depth===r&&o.push(i)}}return o}var ys=/^.$/u;function Jo(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!ys.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let s=Xo(e.names,n),c=s.find(a=>a>e.active)??s[0];return c===void 0?{kind:"miss"}:{kind:"jump",index:c,query:n}}let t=`${e.query}${n}`,r=Xo(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(s=>s>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Xo(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var R=require("react/jsx-runtime"),ze=22;function ur({open:e=!0,size:n=14}){return(0,R.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,R.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,R.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function ms(){return(0,R.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,R.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ei(){return(0,R.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,R.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,R.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function ni(){return(0,R.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,R.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,R.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function ti(){return(0,R.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,R.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function gs({name:e}){return(0,R.jsx)("span",{className:"fx-badge","data-icon":Ge(e),"aria-hidden":"true",children:Ve(e)})}function hs({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:s,onRowActivate:c}){let a=e.kind==="directory",d={top:r,paddingLeft:8+e.depth*12};return(0,R.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:d,onClick:()=>{c(e.path),a?i(e.path):s(e.path)},children:[(0,R.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,R.jsx)(ms,{})}),a?(0,R.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,R.jsx)(ur,{open:e.expanded})}):(0,R.jsx)(gs,{name:e.name}),(0,R.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,R.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,R.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,R.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":an(e.status),"data-testid":"fx-file-status",title:o(bt(e.status)),"aria-label":o(bt(e.status)),children:Sn(e.status)}),e.statusCount===void 0?null:(0,R.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,R.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,R.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,R.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,R.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,R.jsx)("span",{className:"fx-size",children:In(e.size)})]})}function xs({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,R.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,R.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,R.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,R.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,R.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function vs(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function ri({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:s,onEntryFocusSettled:c,cursorRequest:a,onCursorMove:d}){let u=(0,I.useRef)(null),[g,f]=(0,I.useState)(0),[m,S]=(0,I.useState)(0),[p,P]=(0,I.useState)(void 0),q=(0,I.useRef)(void 0),M=(0,I.useRef)({query:"",at:0}),D=(0,I.useRef)(void 0),A=(0,I.useRef)(void 0),W=(0,I.useRef)(p);W.current=p;let O=(0,I.useMemo)(()=>e.flatMap((h,T)=>h.type==="entry"?[T]:[]),[e]);(0,I.useEffect)(()=>{let h=A.current!==n;if(A.current=n,D.current!==void 0||n===void 0)return;let T=W.current===void 0?void 0:e[W.current];if(!Wr({cursorPath:T?.type==="entry"?T.path:void 0,selectionMoved:h}))return;let b=e.findIndex(C=>C.type==="entry"&&C.path===n);b>=0&&P(b)},[n,e]),(0,I.useEffect)(()=>{let h=D.current;if(h===void 0)return;let T=e.findIndex(U=>U.type==="entry"&&U.path===h),b=e[T];if(b?.type!=="entry"||b.kind!=="directory"||!b.expanded){D.current=void 0;return}let C=_r(e,h);C!==void 0&&(D.current=void 0,P(C))},[e]),(0,I.useEffect)(()=>{p!==void 0&&e[p]?.type!=="entry"&&P(void 0)},[e,p]),(0,I.useEffect)(()=>{let h=u.current;if(p===void 0||h===null)return;let T=kt({scrollTop:h.scrollTop,viewport:h.clientHeight,rowHeight:ze,index:p});T!==h.scrollTop&&(h.scrollTop=T)},[p]);let j=(0,I.useCallback)((h,T=!0)=>{P(h),T&&u.current?.focus({preventScroll:!0})},[]),te=(0,I.useRef)(void 0);(0,I.useEffect)(()=>{if(a===void 0||te.current===a.nonce)return;let h=O.at(-1);if(a.path!==void 0){let b=e.findIndex(C=>C.type==="entry"&&C.path===a.path);te.current=a.nonce,b>=0&&j(b,a.focus);return}if(a.delta===void 0){te.current=a.nonce;return}if(te.current=a.nonce,p===void 0){let b=a.delta>0?O[0]:h;b!==void 0&&j(b,a.focus);return}let T=a.delta>0?O.find(b=>b>p):[...O].reverse().find(b=>b<p);T!==void 0&&j(T,a.focus)},[a,p,O,j,e]),(0,I.useEffect)(()=>{if(d===void 0)return;let h=p===void 0?void 0:e[p];d(h?.type==="entry"?h.path:void 0)},[p,e,d]);let Fe=(0,I.useCallback)(h=>{let T=e.findIndex(b=>b.type==="entry"&&b.path===h);T>=0&&P(T)},[e]),re=(0,I.useCallback)(h=>{if(h.nativeEvent.isComposing||h.altKey||h.metaKey||h.ctrlKey)return;let T=O.at(-1);if(h.key==="ArrowDown"){if(h.preventDefault(),p===void 0){O[0]!==void 0&&j(O[0]);return}let z=O.find(_=>_>p);z!==void 0&&j(z);return}if(h.key==="ArrowUp"){if(h.preventDefault(),p===void 0){T!==void 0&&j(T);return}let z=[...O].reverse().find(_=>_<p);z!==void 0&&j(z);return}if(p===void 0)return;let b=e[p];if(b===void 0||b.type!=="entry")return;if(h.key==="ArrowRight"){if(h.preventDefault(),b.kind==="directory"&&!b.expanded)D.current=b.path,o(b.path);else{let z=O.find(_=>_>p);z!==void 0&&e[z]?.depth===b.depth+1&&j(z)}return}if(h.key==="ArrowLeft"){if(h.preventDefault(),b.kind==="directory"&&b.expanded)o(b.path);else{let z=[...O].reverse().find(_=>_<p&&e[_]?.type==="entry"&&e[_].depth<b.depth);z!==void 0&&j(z)}return}if(h.key==="Enter"&&b.kind!=="directory"){h.preventDefault(),i(b.path);return}if(h.key==="Home"){h.preventDefault(),O[0]!==void 0&&j(O[0]);return}if(h.key==="End"){h.preventDefault(),T!==void 0&&j(T);return}let C=Date.now(),U=Zo(e,p),fe=Qo(e,U),oe=fe.map(z=>{let _=e[z];return _?.type==="entry"?_.name:""}),ie=Jo({query:Yo(M.current.query,M.current.at,C),key:h.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:h.nativeEvent.repeat,names:oe,active:p===void 0?-1:fe.indexOf(p)});if(ie.kind==="clear"){M.current={query:"",at:0};return}if(ie.kind!=="jump")return;let pe=fe[ie.index];if(pe===void 0)return;let Re=e[pe];Re?.type==="entry"&&(M.current={query:ie.query,at:C},h.preventDefault(),j(pe),Re.kind!=="directory"&&i(Re.path))},[p,O,j,o,i,e]);(0,I.useEffect)(()=>{let h=u.current;if(h===null)return;let T=()=>S(h.clientHeight);if(T(),typeof ResizeObserver>"u")return;let b=new ResizeObserver(T);return b.observe(h),()=>b.disconnect()},[]),(0,I.useEffect)(()=>{if(n===void 0)return;let h=u.current;if(h===null)return;let T=e.findIndex(C=>C.type==="entry"&&C.path===n);if(T<0)return;let b=T*ze;(b<h.scrollTop||b+ze>h.scrollTop+h.clientHeight)&&(h.scrollTop=Math.max(0,b-h.clientHeight/2))},[n,e]),(0,I.useEffect)(()=>{if(t===void 0||q.current===t)return;let h=u.current;if(h===null)return;let T=t.path===void 0?-1:e.findIndex(b=>b.type==="entry"&&b.path===t.path);if(!(t.path!==void 0&&T<0)){if(q.current=t,T>=0){let b=kt({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:ze,index:T});b!==h.scrollTop&&(h.scrollTop=b,f(b)),P(T)}vs(h),c?.()}},[t,e,c]);let Le=h=>{f(h.currentTarget.scrollTop)},Se=Pn(e,{scrollTop:g,height:m===0?480:m,rowHeight:ze});return(0,R.jsx)("div",{className:"fx-scroll",ref:u,onScroll:Le,onKeyDown:re,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,R.jsx)("div",{className:"fx-vlist",style:{height:e.length*ze},children:Se.rows.map((h,T)=>{let b=(Se.startIndex+T)*ze;return h.type==="entry"?(0,R.jsx)(hs,{row:h,top:b,selected:h.path===n,cursor:p===Se.startIndex+T,t:r,onToggle:o,onSelect:i,onRowActivate:Fe},h.path):(0,R.jsx)(xs,{row:h,top:b,t:r,onRetry:s},h.key)})})})}var ot=require("react"),Pe=require("react/jsx-runtime");function oi({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:s,onActivate:c,onClose:a}){let d=(0,ot.useRef)(null);(0,ot.useEffect)(()=>{d.current?.focus()},[]);let u=f=>{if(!f.nativeEvent.isComposing){if(f.key==="Escape"){f.preventDefault(),f.stopPropagation(),a();return}if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault(),s(f.key==="ArrowDown"?1:-1);return}f.key==="Enter"&&(f.preventDefault(),c())}},g=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,Pe.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:u,children:[(0,Pe.jsx)("input",{ref:d,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:f=>i(f.currentTarget.value)}),g===null?null:(0,Pe.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[g,o?(0,Pe.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,Pe.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),(0,Pe.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:a,children:"\xD7"})]})}var k=require("react/jsx-runtime");var bs=()=>({status:"loading",nodes:[],truncated:!1,total:0});function ws(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var ks=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,ai=new Map;function Ss(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function it({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,k.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,k.jsx)("strong",{children:e}),n===void 0?null:(0,k.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,k.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Rs(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function si({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:s,documents:c,locate:a,fileReferences:d}){let u=so();function g(f){let m=f.sessionId??e.currentSessionId(),S=(0,x.useRef)(m);S.current=m;let p=(0,x.useMemo)(()=>r(),[r]),P=(0,x.useMemo)(()=>o(),[o]),q=(0,x.useMemo)(()=>i(),[i]),M=(0,x.useMemo)(()=>m===void 0||a===void 0?void 0:a(m),[a,m]),[D,A]=(0,x.useState)(()=>new Map),[W,O]=(0,x.useState)(void 0),[j,te]=(0,x.useState)(void 0),[Fe,re]=(0,x.useState)(void 0),[Le,Se]=(0,x.useState)(ai),h=(0,x.useRef)(D);h.current=D;let[T,b]=(0,x.useState)(()=>new Set),C=(0,x.useMemo)(()=>u.forSession(m),[u,m]),U=(0,x.useSyncExternalStore)(C.subscribe,C.snapshot,C.snapshot),fe=U.panels.find(l=>l.key===U.active),oe=fe?.path,ie=fe?.revision,[pe,Re]=(0,x.useState)(0),z=(0,x.useRef)(new Map),_=(0,x.useRef)(void 0),[G,K]=(0,x.useState)(null),[Be,We]=(0,x.useState)(!1),[_e,ae]=(0,x.useState)(null),de=(0,x.useRef)(null);de.current=G?.path??null;let le=(0,x.useMemo)(()=>ws(),[]),[ce,ue]=(0,x.useState)(()=>Go(le)),Ne=(0,x.useRef)(null),Te=(0,x.useRef)(null),$=D.get(""),Me=$?.status==="ready",mn=(0,x.useCallback)((l,y,v,L)=>{C.open(l,y,v,L)},[C]),Ze=(0,x.useCallback)(l=>{let y=l??C.snapshot().active??void 0;if(y===void 0)return;if((m===void 0?void 0:c?.peek(m,y))?.dirty===!0){ae(null),K({path:y});return}K(null),ae(null),m!==void 0&&c?.forget(m,y),C.close(y)},[c,m,C]),ct=(0,x.useCallback)(()=>{let l=G;if(l===null)return;let y=m===void 0?void 0:c?.find(m,l.path);if(y===void 0){K(null),m!==void 0&&c?.forget(m,l.path),C.close(l.path);return}We(!0),ae(null),y.save().then(v=>{if(We(!1),!v.ok){let L=y.getSnapshot().error;ae(t("panel.confirm.failed").replace("{message}",sr(v.code,L?.message??"",t)));return}K(null),m!==void 0&&c?.forget(m,l.path),C.close(l.path)})},[c,G,m,C,t]),gn=(0,x.useCallback)(()=>{let l=G;K(null),ae(null),l!==null&&(m!==void 0&&c?.forget(m,l.path),C.close(l.path))},[c,G,m,C]),Ke=(0,x.useCallback)(()=>{K(null),ae(null)},[]),J=(0,x.useCallback)(async(l,y,v)=>{z.current.get(l)?.abort();let L=new AbortController;z.current.set(l,L),A(H=>new Map(H).set(l,bs()));try{let H=await v.list(y,Fn(l),L.signal);if(L.signal.aborted||S.current!==y)return!1;let B=nt(H);if(!B.ok)return A(xe=>new Map(xe).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:B.message})),!1;let He=En(B.listing.entries);return A(xe=>new Map(xe).set(l,{status:"ready",nodes:He,truncated:B.listing.truncated===!0,total:B.listing.entries.length})),!0}catch(H){return L.signal.aborted||A(B=>new Map(B).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:jo(H)})),!1}finally{z.current.get(l)===L&&z.current.delete(l)}},[]);(0,x.useEffect)(()=>{for(let l of z.current.values())l.abort();return z.current.clear(),A(new Map),b(new Set),_.current=void 0,m!==void 0&&p!==void 0&&J("",m,p),()=>{for(let l of z.current.values())l.abort();z.current.clear()}},[m,p,pe,J]),(0,x.useEffect)(()=>{if(m===void 0||P===void 0){O(void 0),te(void 0),re(void 0);return}let l=!0,y=new AbortController;return O(void 0),te(void 0),re(void 0),Promise.resolve().then(()=>P.snapshot({sessionId:m,maxCommits:1},y.signal)).then(v=>{if(!l)return;let L=tt(v);if(!L.ok){O(void 0),te(void 0),re(void 0);return}O(Dr(kn(L.status),L.stats)),te(L.head),re(L.root)}).catch(()=>{l&&(O(void 0),te(void 0),re(void 0))}),()=>{l=!1,y.abort()}},[m,P,pe]),(0,x.useEffect)(()=>{let l=p?.read;if(m===void 0||p===void 0||typeof l!="function"||!Me){Se(ai);return}let y=m,v=new AbortController,L=async(B,He)=>{try{let xe=Ss(await l.call(p,y,He,{},v.signal));return xe===void 0?void 0:[B,xe]}catch{return}},H=jr.filter(B=>B!==".gitmodules").map(B=>L(B,B));return Fe!==void 0&&H.push(L(".gitmodules",`${Fe.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(H).then(B=>{if(v.signal.aborted||S.current!==y)return;let He=new Map;for(let Ie of B)Ie!==void 0&&He.set(Ie[0],Ie[1]);let xe=h.current.get(""),Ei=new Set(xe?.status==="ready"?xe.nodes.filter(Ie=>Ie.kind==="directory").map(Ie=>Ie.name):[]);Se(Tn(He,Ei))}),()=>v.abort()},[m,p,Me,Fe,pe]);let[ut,$e]=(0,x.useState)(void 0),Qe=(0,x.useRef)(void 0),ye=(0,x.useRef)(0),Ce=(0,x.useRef)(void 0),Je=(0,x.useRef)(!1),se=(0,x.useCallback)((l,y,v)=>{ye.current+=1,$e({nonce:ye.current,...l===void 0?{}:{path:l},...y===void 0?{}:{delta:y},focus:v})},[]),F=(0,x.useCallback)((l,y)=>{let v=io(l);if(b(L=>{let H=new Set(L);for(let B of v)H.add(B);return H}),!(m===void 0||p===void 0)){for(let L of v)h.current.get(L)===void 0&&J(L,m,p);y==="directory"&&h.current.get(l)===void 0&&J(l,m,p)}},[p,J,m]),Y=(0,x.useCallback)(l=>{let y=dn(h.current).find(v=>v.path===l);if(F(l,y?.kind),y?.kind==="directory"&&b(v=>new Set(v).add(l)),Je.current=!0,y===void 0){Ce.current=l;return}se(l,void 0,!0)},[se,F]),me=(0,x.useCallback)(l=>{Vn(l,{open:mn,reveal:Y})},[mn,Y]);(0,x.useEffect)(()=>{let l=f.viewRequest;if(l==null||l.view!==Z)return;let y=`${l.view}:${l.focus}`;_.current!==y&&(_.current=y,me(l.focus),f.completeViewRequest?.())},[f.viewRequest,f.completeViewRequest,me]),(0,x.useEffect)(()=>{let l=e.viewFocus;if(l===void 0||m===void 0)return;let y=()=>{let v=l.take(Z);v!==void 0&&me(v)};return y(),l.subscribe(y)},[e,m,me]),(0,x.useEffect)(()=>{if(oe===void 0||ie!==void 0||!Me||Ln(oe))return;let l=Nn(oe);if(l.length===0||(b(v=>l.every(L=>v.has(L))?v:new Set([...v,...l])),m===void 0||p===void 0))return;let y=l.filter(v=>h.current.get(v)?.status!=="ready");y.length!==0&&Promise.all(y.map(v=>J(v,m,p)))},[oe,ie,Me,m,p,J]);let ge=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let l=document.querySelector("[data-composer-input]");return l===null?!1:(l.focus(),!0)},[]),yi=(0,x.useCallback)(l=>{if(l.button!==0||Te.current!==null||ks())return;let y=Ne.current?.previousElementSibling;if(y instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}Te.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:y.getBoundingClientRect().width,restWidth:ce},document.body.classList.add("fx-pane-resizing")}},[ce]),mi=(0,x.useCallback)(l=>{let y=Te.current;y===null||y.pointerId!==l.pointerId||ue(cr(y.baseWidth+l.clientX-y.startX))},[]),ft=(0,x.useCallback)(l=>{let y=Te.current;if(y===null||y.pointerId!==l.pointerId)return;Te.current=null,document.body.classList.remove("fx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let v=y.baseWidth+l.clientX-y.startX;if(qo(v,y.baseWidth)){ue(y.restWidth);return}ue(rt(le,v))},[le]),pt=(0,x.useCallback)(()=>{Vo(le),ue(null)},[le]),gi=(0,x.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let y=Uo(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(y===null)return;if(l.preventDefault(),l.stopPropagation(),y.kind==="reset"){pt();return}if(y.kind==="min"||y.kind==="max"){let H=y.kind==="min"?180:520;ue(rt(le,H));return}let v=Ne.current?.previousElementSibling,L=v instanceof HTMLElement?v.getBoundingClientRect().width:ce??180;ue(rt(le,L+y.delta))},[le,pt,ce]);(0,x.useEffect)(()=>()=>{Te.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let l=y=>{if(!(y.isComposing||Jr(y.target))){if(Rs(y)){let v=C.snapshot().active,L=v===null||c===void 0||m===void 0?void 0:c.find(m,v);if(L===void 0)return;y.preventDefault(),y.stopPropagation(),L.save();return}for(let v of Bn)if(Qr(y,v)){if(v.action==="closePanel"&&C.snapshot().active===null)return;y.preventDefault(),y.stopPropagation(),v.action==="nextPanel"?C.next():v.action==="previousPanel"?C.previous():Ze();return}}};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[c,Ze,m,C]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let l=_n({focusComposer:ge,hasModal:()=>de.current!==null||Wn(document)}),y=v=>l(v);return document.addEventListener("keydown",y,!0),()=>document.removeEventListener("keydown",y,!0)},[ge]),(0,x.useEffect)(()=>{if(G===null||typeof document>"u")return;let l=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),Ke())};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[G,Ke]);let hn=(0,x.useMemo)(()=>Dn(D,T,W,Le),[D,T,W,Le]),[De,mr]=(0,x.useState)(!1),[yt,gr]=(0,x.useState)(""),[hr,xn]=(0,x.useState)([]),[xr,vn]=(0,x.useState)(null),[hi,en]=(0,x.useState)(!1);(0,x.useEffect)(()=>{let l=ro(yt);if(l===void 0){xn([]),vn(null),en(!1);return}let y=()=>{let H=oo(dn(h.current),l);xn(zt(H.map(B=>({path:B.path,kind:B.kind==="directory"?"directory":"file"})),W)),vn("loaded"),en(!1)},v=d?.();if(v===void 0||m===void 0){y();return}let L=new AbortController;return en(!0),Promise.resolve(v.list(m,l,L.signal)).then(H=>{if(L.signal.aborted)return;let B=to(H);xn(zt(B,W)),vn("index"),en(!1)},H=>{L.signal.aborted||(console.debug(`[${ee}] the file index failed, searching listed rows instead`,H),y())}),()=>L.abort()},[yt,m,W,d]);let mt=De&&xr!==null,xi=mt?hr:hn;(0,x.useEffect)(()=>{let l=Ce.current;if(l===void 0)return;let y=dn(h.current).find(v=>v.path===l);y!==void 0&&(Ce.current=void 0,y.kind==="directory"&&(F(l,y.kind),b(v=>new Set(v).add(l))),se(l,void 0,!0))},[hn,se,F]);let[vi,vr]=(0,x.useState)(void 0),br=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(br.current||typeof document>"u")return;let l=Kr({rows:hn,panelCount:C.snapshot().panels.length,hasModal:Wn(document)});l.kind!=="skip"&&(br.current=!0,!Je.current&&(l.open!==void 0&&C.open(l.open),vr({path:l.focus})))},[hn,C]);let bi=(0,x.useCallback)(()=>vr(void 0),[]),nn=W===void 0?void 0:Object.keys(W).length,wi=W===void 0?"neutral":Object.values(W).some(l=>l.status==="conflicted")?"conflict":nn===0?"success":"warning",wr=Mr(j),ki=(0,x.useCallback)(l=>{if(m===void 0||p===void 0)return;if(T.has(l)){b(v=>{let L=new Set(v);return L.delete(l),L});return}b(v=>new Set(v).add(l));let y=D.get(l);(y===void 0||y.status==="failed")&&J(l,m,p)},[T,D,m,p,J]),kr=(0,x.useCallback)(l=>{m===void 0||p===void 0||J(l,m,p)},[m,p,J]),gt=(0,x.useCallback)(l=>{let y=dn(h.current).find(v=>v.path===l);if(F(l,y?.kind),y?.kind==="directory"){b(v=>new Set(v).add(l));return}C.open(l)},[F,C]),Si=(0,x.useCallback)(()=>{Qe.current!==void 0&&gt(Qe.current)},[gt]),bn=(0,x.useCallback)(()=>{mr(!1),gr(""),xn([]),vn(null),en(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,x.useEffect)(()=>{if(!De||typeof document>"u")return;let l=y=>{y.key!=="Escape"||y.isComposing||y.defaultPrevented||de.current!==null||Wn(document)||(y.preventDefault(),y.stopPropagation(),bn())};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[De,bn]);let Ri=()=>b(new Set),Ti=()=>Re(l=>l+1),Ci=m===void 0?"no-session":p===void 0?"no-service":$===void 0||$.status==="loading"?"loading":$.status==="failed"?"failed":$.nodes.length===0?"empty":"tree";return(0,k.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Ci,"data-session":m??"","data-testid":"fs-explorer-view",children:[(0,k.jsxs)("header",{className:"fx-head",children:[(0,k.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,k.jsx)(ur,{open:!0})}),(0,k.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,k.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,k.jsxs)("div",{className:"fx-head-meta",children:[$?.status==="ready"?(0,k.jsxs)("span",{children:[(0,k.jsx)("b",{children:$.nodes.length})," ",t("head.entries")]}):null,(0,k.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":De?"true":"false",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":De,onClick:()=>{De?bn():mr(!0)},children:(0,k.jsx)(ni,{})}),(0,k.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:T.size===0,onClick:Ri,children:(0,k.jsx)(ti,{})}),(0,k.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:m===void 0||p===void 0||$?.status==="loading",onClick:Ti,children:(0,k.jsx)(ei,{})})]})]}),(0,k.jsx)("div",{className:"fx-main",children:m===void 0?(0,k.jsx)(it,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):p===void 0?(0,k.jsx)(it,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):$===void 0||$.status==="loading"?(0,k.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,k.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):$.status==="failed"?(0,k.jsx)(it,{title:t("state.failed.title"),description:$.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>kr(""),testId:"fs-failed"}):$.nodes.length===0?(0,k.jsx)(it,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)("div",{className:"fx-tree-pane",style:ce===null?void 0:{"--fx-tree-width":`${ce}px`},children:[De?(0,k.jsx)(oi,{t,value:yt,origin:xr,count:hr.length,busy:hi,onChange:gr,onStep:l=>se(void 0,l,!1),onActivate:Si,onClose:bn}):null,(0,k.jsx)(ri,{rows:xi,selectedPath:ie===void 0?oe:void 0,entryFocus:mt?void 0:vi,t,onToggle:ki,onSelect:l=>mt?gt(l):C.open(l),onRetry:kr,onEntryFocusSettled:bi,cursorRequest:ut,onCursorMove:l=>{Qe.current=l}})]}),(0,k.jsx)("div",{ref:Ne,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":ce??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:yi,onPointerMove:mi,onPointerUp:ft,onPointerCancel:ft,onLostPointerCapture:ft,onKeyDown:gi,onDoubleClick:pt}),(0,k.jsxs)("div",{className:"fx-editor",children:[(0,k.jsx)(lo,{panels:U.panels,active:U.active,t,onActivate:l=>C.activate(l),onClose:Ze,onStep:l=>l===1?C.next():C.previous(),documents:c,sessionId:m}),G===null?null:(0,k.jsx)(co,{name:Gn(G.path),t,saving:Be,error:_e,onSave:ct,onDiscard:gn,onCancel:Ke}),(0,k.jsx)("div",{className:"fx-editor-body",children:U.panels.length===0?(0,k.jsx)(uo,{t}):U.panels.map((l,y)=>{let v=l.key===U.active;return(0,k.jsx)("div",{className:"fx-panel",id:`fx-panel-${y}`,role:"tabpanel","aria-labelledby":`fx-tab-${y}`,hidden:!v,"data-line":l.line,"data-testid":"fs-panel",children:(0,k.jsx)(_o,{sessionId:m,files:p,path:l.path,revision:l.revision,git:q,t,visible:v,renderers:s,documents:c,locate:M})},l.key)})})]})]})}),$?.status==="ready"?(0,k.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,k.jsxs)("span",{children:[t("view.scope")," ",(0,k.jsx)("b",{children:$.nodes.length})," ",t("head.entries")]}),$.truncated?(0,k.jsx)("span",{className:"fx-foot-warn",children:sn({entries:$.nodes,truncated:!0,total:$.total}).label}):null,(0,k.jsxs)("span",{className:"fx-foot-git","data-state":nn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,k.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":wi,"aria-hidden":"true"}),nn===void 0?t("status.unavailable"):nn===0?t("status.clean"):t("status.summary").replace("{count}",String(nn))]}),wr===null?null:(0,k.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[wr,j?.upstream!==void 0&&(j.ahead??0)>0?(0,k.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(j.ahead)}`}):null,j?.upstream!==void 0&&(j.behind??0)>0?(0,k.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(j.behind)}`}):null]}),(0,k.jsx)("span",{className:"fx-spacer"}),(0,k.jsx)("span",{children:t("foot.order")})]}):null]})}return g}var li=["slots","locale","workbench","remote"];function Cs(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var at,st,pr,dt,yr,ci;function di(e){return yr=e,dt!==void 0||(dt=Zr({open:(n,t,r)=>{let o=yr;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Xr(o)(n,t,r)},save:(n,t)=>{let r=yr;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Yr(r)(n,t)}})),dt}function Es(){if(pr!==void 0)return pr;let e=Jn({warn:n=>ci?.(n)});for(let n of dr())e.register(n);return pr=e,e}var lt;function ui(e){let n=e.workbench;if(n==null)return()=>{};ci=u=>e.logger?.warn?.(u);let t=Es(),r={version:Co,renderers:t,registerRenderer:u=>t.register(u),documents:di(e)};st?.();let o=e.provide?.(Jt,r);o===void 0&&e.logger?.warn?.(`${on}: ctx.provide unavailable, ${Jt} service not registered`),st=o,at?.();let i=e.locale.register(on,{zh:{...Nt,...Wt.zh,...ar.zh},en:{...Mt,...Wt.en,...ar.en}});at=i;let s=e.locale.bind(on),c=$o(typeof document>"u"?void 0:document),a=si({workbench:n,version:n.version,t:s,files:Mo(e),status:zo(e),git:Ao(e),renderers:t,documents:di(e),locate:u=>Ur(e,u),fileReferences:no(e)});lt?.();let d=Lt(e,n);return lt=d,e.slots.inject(xt,()=>e.slots.register({name:xt,id:Z,order:100,label:()=>Dt(Cs(e)),locale:on},a)),()=>{o?.(),st===o&&(st=void 0),d(),lt===d&&(lt=void 0),c(),i(),at===i&&(at=void 0)}}var fi={buildTree:En,describeListing:sn,iconFor:Ge,computeTreeWindow:Pn,flattenTree:Dn,badgeFor:Ve,formatSize:In,joinPath:qe,listingPath:Fn,parseFocus:Mn,consumeViewRequest:Vn,createPanelStack:Bt,createEscapeHandler:_n,KEYMAP:Bn,tabLabel:Dt,normalizeListing:nt,normalizeStatusSnapshot:tt,buildWorkspaceMap:Tn,workspaceTagFor:Cn,parseStatusZ:kn,statusTone:an,statusBadge:Sn,createPreviewLoader:Un,renderMarkdown:qn,languageFor:un,isMarkdownFile:fn,describePage:Xn,classifyPreviewFailure:je,normalizePreviewPage:Ye,previewChunkRoute:xo,canBridgeFile:An,decideBridge:Pt,focusForFileAddress:Et,forwardFocus:Ft,registerAddressBridge:Lt},pi={name:"dsh-fs-explorer",inject:li,apply:ui,__test:fi};var Ps=pi;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
