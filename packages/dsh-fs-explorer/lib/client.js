window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var br=Object.defineProperty;var Zs=Object.getOwnPropertyDescriptor;var Qs=Object.getOwnPropertyNames;var Js=Object.prototype.hasOwnProperty;var ed=(e,n)=>{for(var t in n)br(e,t,{get:n[t],enumerable:!0})},nd=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Qs(n))!Js.call(e,o)&&o!==t&&br(e,o,{get:()=>n[o],enumerable:!(r=Zs(n,o))||r.enumerable});return e};var td=e=>nd(br({},"__esModule",{value:!0}),e);var zu={};ed(zu,{__test:()=>fs,apply:()=>cs,boot:()=>Wu,clientPlugin:()=>ps,default:()=>$u,inject:()=>ls});module.exports=td(zu);var En=require("react");var _o="dsh-resource://file/";function Ho(e){try{return decodeURIComponent(e)}catch{return e}}function $n(e){if(!e.startsWith(_o))return null;let n=e.slice(_o.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Ho(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(Ho).join("/")}}function He(e){return e.slice(e.lastIndexOf("/")+1)}var Go=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title",claims:["workbench","sidebar"]},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title",claims:["workbench","sidebar"]},{family:"cad",extensions:["dxf"],titleKey:"cad.title",claims:["workbench","sidebar"]},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title",claims:["workbench"]},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title",claims:["workbench"]}];function Vo(){return Go.flatMap(e=>[...e.extensions])}function zn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Go.find(o=>o.extensions.includes(r))?.family??null}var Se="dsh-fs-explorer",vr="conversation.view",ge="fs-explorer";var Kn="fs-explorer",qo="fsExplorerDocuments",Uo="fsExplorerWorkspace",Xo="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function Yo(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var wr={chunk:"client.preview.js"},yt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};function Zo(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function gt(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=Zo(t);r===""||r==="."||n.add(r)}return n}function ht(e,n){if(n===void 0||n.size===0)return!1;let t=Zo(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var rd={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},od={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},id=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Jo(e){return typeof e=="string"&&id.has(e)}function Qo(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function ad(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function xt(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Qo(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",c=a.rest;if(c===""||l.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[c]={status:"renamed"};continue}n[c]={status:ad(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=Qo(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function jn(e){return Jo(e)?rd[e]:"neutral"}function kt(e){return Jo(e)?od[e]:"?"}function Sr(e){return`status.${e}`}function bt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function ei(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function ni(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function ti(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var sd=["conflicted","deleted","renamed","added","modified","untracked"];function dd(e){return jn(sd.find(n=>e.has(n))??"modified")}function ri(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,c="";for(let d=0;d<l;d+=1){let u=a[d];if(u===void 0||u==="")continue;c=c===""?u:`${c}/${u}`;let p=n.get(c);p===void 0?n.set(c,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:dd(o.present)});return t}var ai=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],si=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function ld(e){return si.test(e)?e.slice(0,e.indexOf("/")):null}function ud(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function cd(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=ud(i[2]??"");a!==""&&si.test(a)&&t.push(a)}return t}function fd(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let c=/^path\s*=\s*(.*)$/u.exec(a);c!==null&&(t=(c[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function oi(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function ii(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function vt(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of fd(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of cd(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=oi(a);if(l!==void 0){let c=l.workspaces,d=c!==null&&typeof c=="object"&&!Array.isArray(c)?c.packages:void 0;for(let u of ii(Array.isArray(c)?c:d))o.add(u)}}for(let l of["turbo.json","lerna.json"]){let c=e.get(l);if(typeof c!="string")continue;let d=oi(c);if(d!==void 0)for(let u of ii(d.packages))o.add(u)}for(let l of o){let c=ld(l);c!==null&&n.has(c)&&t.set(l,"package")}return t}function wt(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var pd=new Set([".git"]);function md(e){return pd.has(e)}function yd(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function St(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||md(r))continue;let o=yd(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var gd=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),hd=new Set(["md","mdx","markdown","mdown","rst","adoc"]),xd=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),kd=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),bd=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),vd=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),wd=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function di(e){let n=He(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Cn(e,n="file"){if(n==="directory")return"folder";let t=He(e.toLowerCase());if(wd.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=di(t);return r===""?"file":gd.has(r)?"code":hd.has(r)?"markdown":xd.has(r)?"data":kd.has(r)?"image":bd.has(r)?"style":vd.has(r)?"archive":"file"}var Sd={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Rd={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Tn(e){let n=He(e.toLowerCase()),t=Sd[n];if(t!==void 0)return t;let r=di(n),o=Rd[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function _n(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Xo} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Rt(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,c=Math.min(Math.max(l,0),a),d=Math.min(e.length,c+i+o*2);return{rows:e.slice(c,d),startIndex:c,endIndex:d}}function Cr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function Ct(e){return e===""?".":e}function Tt(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Pn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Hn(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Pn(r,o),t.push(r);return t}function Rr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Pt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let c=Rr(t[2]),d=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return d===""||c<1?void 0:{path:d,line:c,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let c=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return c===""?void 0:{path:c,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let c=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return c===""?void 0:{path:c,line:Rr(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let l=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(l!=="")return{path:l,line:Rr(i[2]),absolute:!1}}function li(e){return e.selectionMoved?!0:e.cursorPath===void 0}function ui(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Et(e,n,t,r,o){let i=[],a=ri(t),l=o?.showIgnored===!1,c=o?.hiddenLabel??Yo,d=(u,p)=>{let g=e.get(u);if(g===void 0||g.status!=="ready")return;let b=0;for(let f of g.nodes){let v=Pn(u,f.name),h=f.kind==="directory",G=ht(v,o?.ignored);if(G&&l){b+=1;continue}let O=h&&n.has(v),Y=h||t===void 0?void 0:t[v],F=Y?.status??(h?void 0:bt(v,t)),W=Y===void 0?void 0:ei(Y),B=h?a.get(v):void 0,$=h?wt(r,v):void 0;if(i.push({type:"entry",path:v,name:f.name,kind:f.kind,depth:p,expanded:O,...f.size===void 0?{}:{size:f.size},...F===void 0?{}:{status:F},...B===void 0?{}:{statusCount:B.count,statusTone:B.tone},...W===void 0?{}:{diff:W},...$===void 0?{}:{tag:$},...G?{ignored:!0}:{}}),!O)continue;let A=e.get(v);if(A===void 0||A.status==="loading"){i.push({type:"status",key:`${v}:loading`,path:v,depth:p+1,state:"loading"});continue}if(A.status==="failed"){i.push({type:"status",key:`${v}:failed`,path:v,depth:p+1,state:"failed",message:A.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(A.nodes.length===0){i.push({type:"status",key:`${v}:empty`,path:v,depth:p+1,state:"empty"});continue}d(v,p+1),A.truncated&&i.push({type:"status",key:`${v}:truncated`,path:v,depth:p+1,state:"truncated",label:_n({entries:A.nodes,truncated:!0,total:A.total}).label})}b>0&&g.nodes.length===b&&i.push({type:"status",key:`${u}:hidden`,path:u,depth:p,state:"empty",label:c(b)})};return d("",0),i}var Cd=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Td(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Pd(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Cd.has(Td(n.path)))}function ci(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Pd(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Ft(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Tr="dsh-fs-explorer:bridge",Ed="fs-explorer-bridge",yi="dsh-resource://file/**",Pr="sidebar.right.pane.tab",Fd=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Md=new Set(["docx","pptx","xlsx","xls","fods","csv","tsv","doc","ppt"]),Nd=new Set(["makefile","dockerfile","license","readme","changelog",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".browserslistrc",".env"]),Id=new Set([...Vo(),...Fd]);function Ld(e){let n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function Mt(e){if(typeof e!="string"||e==="")return!1;let n=He(e).toLowerCase();if(n==="")return!1;let t=Ld(n);return Md.has(t)?!1:Nd.has(n)?!0:Id.has(t)}function Bd(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function Ad(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Mr(e,n){if(typeof e!="string")return;let t=$n(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=Ad(n,Bd(e));return`${Tt(r)?"abs:":"path:"}${r}:${String(o)}`}function Nr(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=$n(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Mt(r.path))return{action:"keep",reason:"refused"};let o=Mr(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Ge(e,n){n===void 0?console.warn(`[${Se}] ${e}`):console.warn(`[${Se}] ${e}`,n)}function Dd(e){console.debug(`[${Se}] ${e}`)}function Er(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Fr(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function cn(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function fi(e){return cn(()=>e.sidebarRightTabs,Er)??cn(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Er)}function pi(e){return cn(()=>e.sidebarRight,Fr)??cn(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Fr)}function mi(e){return typeof e=="function"?e:()=>{}}var Od="dsh-resource://file/session/probe/src/main.ts";function Wd(e){let n=cn(()=>(typeof e.candidates=="function"?e.candidates(Od):[]).filter(r=>r.priority==="extension"&&r.id!==Tr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&Ge(`another extension-band tab type already claims ${yi}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function $d(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function zd(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Kd(e,n){let t=e.viewFocus;if(t?.request?.(ge,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(ge,n);return(!r.opened||r.focused)&&t?.take(ge),r}return typeof e.openView=="function"&&e.openView(ge,n)?(t?.take(ge),{opened:!0,focused:!0}):(t?.take(ge),{opened:!1,focused:!1})}function Ir(e,n,t,r){let o;try{o=Kd(e,r)}catch(i){return Ge("the file workbench threw while switching views",i),e.viewFocus?.take(ge),!1}if(!o.opened)return Ge(`the file workbench did not switch to ${ge}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return Ge("the forwarded tab could not be closed",i),!1}}function jd(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=$d(i),c=zd(i),d=(0,En.useRef)(void 0);return(0,En.useEffect)(()=>{if(a===void 0){Ge("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===a)return;d.current=a;let u=Nr(l,e.currentSessionId(),c);if(u.action!=="open"){Ge(`left the forwarded tab standing (${u.reason})`,l);return}Ir(e,n,a,u.focus)},[a,l,c]),null}return function(o){return typeof o.useTabInfo!="function"?(Ge(`the host did not inject useTabInfo into ${Pr}; the bridge cannot forward`),null):(0,En.createElement)(t,{useTabInfo:o.useTabInfo})}}function Lr(e,n){let t=(l,c)=>{if(l===void 0||c===void 0)return;Wd(l);let d;try{d=l.register({id:Tr,kind:Ed,patterns:[yi],priority:"extension",canOpen:g=>{let b=$n(g);return b!==null&&Mt(b.path)},title:g=>He($n(g)?.path??g)||g})}catch(g){Ge("the sidebar right refused the address bridge tab type",g);return}let u=jd(n,c),p;try{p=mi(e.slots.inject(Pr,()=>e.slots.register({name:Pr,key:Tr},u)))}catch(g){d(),Ge("the sidebar right refused the address bridge body",g);return}return()=>{p(),d()}},r=fi(e),o=pi(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return Dd("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let c=cn(()=>l.get?.("sidebarRightTabs"),Er)??fi(l),d=cn(()=>l.get?.("sidebarRight"),Fr)??pi(l);return t(c,d)});return mi(a)}var Br={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u53EA\u6709\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","preview.surface.image.title":"\u56FE\u7247","preview.surface.pdf.title":"PDF \u6587\u6863","preview.surface.pdf.page":"\u7B2C {current} / {total} \u9875","preview.surface.pdf.previous":"\u4E0A\u4E00\u9875","preview.surface.pdf.next":"\u4E0B\u4E00\u9875","preview.surface.pdf.error.password":"\u8FD9\u4E2A PDF \u9700\u8981\u5BC6\u7801\u624D\u80FD\u6253\u5F00","preview.surface.pdf.error.invalid":"\u8FD9\u4E2A PDF \u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 PDF","preview.surface.pdf.error.missing":"\u627E\u4E0D\u5230\u8FD9\u4E2A PDF \u7684\u5185\u5BB9","preview.surface.pdf.error.unknown":"\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A PDF","preview.surface.pdf.error.render":"\u8FD9\u4E00\u9875\u65E0\u6CD5\u7ED8\u5236","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","menu.tab.close":"\u5173\u95ED","menu.tab.closeOthers":"\u5173\u95ED\u5176\u4ED6\u6807\u7B7E\u9875","menu.tab.closeOthers.reason":"\u53EA\u6709\u8FD9\u4E00\u4E2A\u6807\u7B7E\u9875","menu.tab.closeRight":"\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E\u9875","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Ar={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the current page only","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","preview.surface.image.title":"Image","preview.surface.pdf.title":"PDF document","preview.surface.pdf.page":"Page {current} of {total}","preview.surface.pdf.previous":"Previous page","preview.surface.pdf.next":"Next page","preview.surface.pdf.error.password":"This PDF is password protected","preview.surface.pdf.error.invalid":"This file is damaged or is not a valid PDF","preview.surface.pdf.error.missing":"The content of this PDF could not be found","preview.surface.pdf.error.unknown":"This PDF could not be opened","preview.surface.pdf.error.render":"This page could not be drawn","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","menu.tab.close":"Close","menu.tab.closeOthers":"Close other tabs","menu.tab.closeOthers.reason":"This is the only tab","menu.tab.closeRight":"Close tabs to the right","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Dr(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Br:Ar)["tab.label"]??"Files"}var _d=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function he(e){return e!==null&&typeof e=="object"}function It(e,n){return{ok:!1,code:e,message:n}}function Lt(e){let n=he(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return It(t,r)}function Or(){return It("invalid-response","the document service answered an invalid response")}function Nt(e){try{return e()}catch{return}}function Hd(e){let n=he(e)?e:void 0;if(n===void 0)return Or();if(n.ok===!1)return Lt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0)return Or();if(r.ok===!1)return Lt(r.error);let o=he(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Or():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Gd(e){let n=he(e)?e:void 0;if(n===void 0)return gi();if(n.ok===!1)return Lt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0)return gi();if(r.ok===!1)return Lt(r.error);let o=he(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function gi(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Wr(e){return he(e)&&typeof e.open=="function"}function Vd(e){let n=Nt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=he(n)?n.rpc:void 0;if(!(!he(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${qo}/${r}`,o,i)}function qd(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Ud(e){let n=he(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=he(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function hi(e,n){let t=zr(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return Ud(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function zr(e){return()=>{let n=Nt(()=>e.fsExplorerDocuments);if(Wr(n))return n;let t=Nt(()=>he(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Wr(t))return t;let r=Nt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Wr(r))return r;let o=Vd(e);if(o!==void 0)return qd(o)}}function xi(e){let n=zr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return It("unavailable","the document service is unavailable");try{return Hd(await i.open({sessionId:t,path:r},o))}catch(a){return It("io-error",a instanceof Error?a.message:String(a))}}}function ki(e){let n=zr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return Gd(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function bi(e){let n=new Map,t=new Set,r=0,o=(l,c)=>`${l}\0${c}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,c)=>n.get(o(l,c))?.session;return{acquire(l,c){let d=o(l,c),u=n.get(d);return u===void 0&&(u={session:new $r(l,c,e.open,e.save,()=>{n.delete(d),i()},i)},n.set(d,u),i()),u.session.retain(),u.session},peek(l,c){return a(l,c)?.getSnapshot()},find:a,forget(l,c){n.get(o(l,c))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var $r=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=_d;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Bt=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Kr(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function vi(e,n,t=Kr()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function wi(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Xd(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function At(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Dt(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Xd(n),e.onClose?.()}}function Si(e){return e.viewSessionId===void 0||e.viewSessionId!==e.currentSessionId||e.activePanel===null?"pass":e.confirming?"hold":"close"}function Ri(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function Ot(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Wt(e){try{return e()}catch{return}}function Ci(e){return()=>{let n=Wt(()=>e.fileReferences);if(Ot(n))return n;let t=Wt(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(Ot(t))return t;let r=Wt(()=>e.remote?.fileReferences);if(Ot(r))return r;let o=Wt(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return Ot(o)?o:void 0}}function Ti(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function Pi(e){let n=e.trim();return n===""?void 0:n}function jr(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?bt(i,n):void 0,c=Yd(i);t.push({type:"entry",path:i,name:Ri(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...c===""?{}:{directory:c}})}return t}function Yd(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function Gn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:Pn(t,o.name),kind:o.kind});return n}function Ei(e,n){let t=n.toLowerCase();return e.filter(r=>Ri(r.path).toLowerCase().includes(t))}function Fi(e){return Hn(e)}var Fn=require("react");function zt(e){let n=He(e);return n===""?e:n}function $t(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Zd=Object.freeze({panels:Object.freeze([]),active:null});function Mi(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Qd=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Ni(e,n,t){let r=e.findIndex(i=>i.key===n);return r<0?[]:(t==="others"?e.filter((i,a)=>a!==r):e.slice(r+1)).map(i=>i.key)}function _r(){let e=[],n=null,t=Zd,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(u=>u.key===d),a=d=>e.findIndex(u=>u.revision===void 0&&u.key===d),l=d=>{if(typeof d!="string")return;if(i(d)>=0)return d;let u=Qd.exec(d);if(u!==null){let b=(u[1]??"").toLowerCase(),f=$t(u[2]??"",!1);if(f===void 0)return;let v=Mi(f,b);return i(v)>=0?v:void 0}let p=$t(d,!0);if(p===void 0)return;if(a(p)>=0)return p;let g=$t(d,!1);if(!(g===void 0||g===p))return a(g)>=0?g:void 0},c=d=>{if(e.length===0)return;let u=n===null?-1:i(n),p=e[(u+d+e.length)%e.length];p===void 0||p.key===n||(n=p.key,o())};return{open(d,u=1,p=!1,g){let b=$t(d,p);if(b===void 0)return;let f=typeof g=="string"&&g.trim()!==""?g.trim().toLowerCase():void 0,v=Mi(b,f),h=Number.isFinite(u)&&u>0?Math.trunc(u):1,G=i(v);if(G>=0){let F=e[G],W=F!==void 0&&(F.line!==h||F.absolute!==p);if(W&&(e=e.map((B,$)=>$===G?{...B,line:h,absolute:p}:B)),n===v){W&&o();return}n=v,o();return}let O=n===null?e.length:i(n)+1,Y={key:v,path:b,line:h,absolute:p,...f===void 0?{}:{revision:f}};e=[...e.slice(0,O),Y,...e.slice(O)],n=v,o()},close(d){let u=d===void 0?n:l(d)??null;if(u===null)return;let p=i(u);p<0||(e=e.filter(g=>g.key!==u),n===u&&(n=(e[p]??e[p-1])?.key??null),o())},activate(d){let u=l(d);u===void 0||i(u)<0||n===u||(n=u,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let u=l(d);return u!==void 0&&i(u)>=0},activeEntry(){return e.find(d=>d.key===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function Ii(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=_r();return e.set(t,o),o}}}function Kt(e,n){let t=Pt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var q=require("react/jsx-runtime"),Hr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Jd=()=>()=>{},el=()=>"";function nl(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Li({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,onTabMenu:a,documents:l,sessionId:c}){let d=(0,Fn.useRef)(null);(0,Fn.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let u=(0,Fn.useSyncExternalStore)(l?.subscribe??Jd,()=>nl(l,c,e).join("\0"),el),p=new Set(u===""?[]:u.split("\0"));if(e.length===0)return null;let g=b=>{if(b.key==="ArrowRight"||b.key==="ArrowLeft"){b.preventDefault(),b.stopPropagation(),i(b.key==="ArrowRight"?1:-1);return}(b.key==="Delete"||b.key==="Backspace")&&n!==null&&(b.preventDefault(),b.stopPropagation(),o(n))};return(0,q.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:g,"data-testid":"fs-tabs",children:e.map((b,f)=>{let v=b.key===n,h=zt(b.path),G=t("panel.close").replace("{name}",h);return(0,q.jsxs)("div",{className:"fx-tab","data-active":v?"true":"false","data-dirty":p.has(b.path)?"true":"false",role:"presentation",onContextMenu:a===void 0?void 0:O=>{O.preventDefault(),O.stopPropagation(),a(b.key,{x:O.clientX,y:O.clientY},O.currentTarget)},children:[(0,q.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${f}`,"aria-controls":`fx-panel-${f}`,"aria-selected":v,tabIndex:v?0:-1,title:b.path,"data-testid":"fs-tab","data-path":b.path,"data-key":b.key,ref:v?d:void 0,onClick:()=>r(b.key),children:[(0,q.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Cn(b.path),"aria-hidden":"true",children:Tn(b.path)}),(0,q.jsx)("span",{className:"fx-tab-name",children:h}),b.revision===void 0?null:(0,q.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:b.revision,children:b.revision.slice(0,7)}),p.has(b.path)?(0,q.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,q.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:v?0:-1,"aria-label":G,title:G,"data-testid":"fs-tab-close",onClick:()=>o(b.key),children:"\xD7"})]},b.key)})})}function Bi({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,q.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,q.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,q.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,q.jsx)("span",{className:"fx-spacer"}),(0,q.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,q.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,q.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function tl(){return(0,q.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,q.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,q.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,q.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function rl(){return typeof document<"u"&&document.documentElement.dataset.platform!==void 0&&Kr()==="mac"?"\u2318W":"Ctrl+W"}function Ai({t:e}){return(0,q.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,q.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,q.jsx)(tl,{})}),(0,q.jsx)("strong",{children:e("panel.empty.title")}),(0,q.jsx)("span",{children:e("panel.empty.description")}),(0,q.jsxs)("span",{className:"fx-empty-keys",children:[(0,q.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,q.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,q.jsx)("kbd",{className:"fx-kbd",children:rl()}),(0,q.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Di=require("react");function ue(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Di.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function ol(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var il=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function fn(e){let n=[],t=0;for(let r of e.matchAll(il)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(ue("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(ue("strong",null,...fn(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(ue("del",null,...fn(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(ue("em",null,...fn(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,c=a===null?void 0:ol(a[2]??"");n.push(c===void 0?l:ue("a",{href:c,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Oi=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Wi=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,$i=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Gr=/^\s{0,3}>\s?(.*)$/u,Vr=/^\s{0,3}[-*+]\s+(.*)$/u,qr=/^\s{0,3}\d+[.)]\s+(.*)$/u;function al(e){return Oi.test(e)||Wi.test(e)||$i.test(e)||Gr.test(e)||Vr.test(e)||qr.test(e)}function zi(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Oi.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),u=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(ue("pre",null,ue("code",u===""?null:{className:`language-${u}`},p.join(`
`))));continue}let i=Wi.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(ue(`h${String(d)}`,null,...fn(i[2]??""))),t+=1;continue}if($i.test(r)){n.push(ue("hr",null)),t+=1;continue}if(Gr.test(r)){let d=[];for(;t<e.length;){let u=Gr.exec(e[t]??"");if(u===null)break;d.push(u[1]??""),t+=1}n.push(ue("blockquote",null,...zi(d)));continue}if(Vr.exec(r)!==null){let d=[];for(;t<e.length;){let u=Vr.exec(e[t]??"");if(u===null)break;d.push(ue("li",null,...fn(u[1]??""))),t+=1}n.push(ue("ul",null,...d));continue}if(qr.exec(r)!==null){let d=[];for(;t<e.length;){let u=qr.exec(e[t]??"");if(u===null)break;d.push(ue("li",null,...fn(u[1]??""))),t+=1}n.push(ue("ol",null,...d));continue}let c=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||al(d))break;c.push(d.trim()),t+=1}n.push(ue("p",null,...fn(c.join(" "))))}return n}function jt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return ue("div",{className:"fx-md"},...zi(n))}var Ur=200,sl={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Un(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":sl[t.slice(r+1)]??"plaintext"}function Xn(e){return Un(e)==="markdown"}var me=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Vn(e){return e!==null&&typeof e=="object"}function dl(e){return e===""?0:e.split(`
`).length}function Mn(e,n){if(!Vn(e))throw new me("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=Vn(e.error)?e.error:{},p=typeof u.code=="string"?u.code:"preview/unknown",g=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",b=Vn(u.details)?u.details:{},f=typeof b.kind=="string"?b.kind:"";throw new me(p,g,f)}let t=e.ok===!0?e.value:e;if(!Vn(t)||typeof t.text!="string")throw new me("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):dl(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,c=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,d={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...c===void 0?{}:{linkTarget:c}};return o===void 0?d:{...d,totalLines:o}}function pn(e){let n=Vn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var qn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function _t({files:e,maxLines:n=Ur}){let t=Math.max(1,Math.trunc(n)),r=qn,o=0,i=null,a=[1],l=new Set,c=u=>{r=u;for(let p of l)p()},d=async(u,p)=>{o+=1;let g=o;i?.abort();let b=new AbortController;i=b,c({status:"loading",path:u,text:r.path===u?r.text:"",offset:p,lines:r.path===u?r.lines:0,...r.path===u&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===u&&r.source!==void 0?{source:r.source}:{},eof:r.path===u?r.eof:!1});try{let f=await e.read(u,p>1?{offset:p,limit:t}:{limit:t},b.signal);if(g!==o)return;let v=Mn(f,p);if(v.lines===0&&p>1){c({...r,status:"ready",eof:!0,text:"",lines:0});return}let h={status:"ready",path:u,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof,...v.source===void 0?{}:{source:v.source},...v.linkTarget===void 0?{}:{linkTarget:v.linkTarget,linkPath:u}};c(v.totalLines===void 0?h:{...h,totalLines:v.totalLines})}catch(f){if(g!==o||b.signal.aborted)return;c({status:"failed",path:u,text:"",offset:p,lines:0,eof:!1,failure:pn(f)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(u){return l.add(u),()=>{l.delete(u)}},async open(u){a=[1],await d(u,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let u=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&u>r.totalLines||(a.push(u),await d(r.path,u))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let u=a[a.length-1]??1;await d(r.path,u)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],c(qn)}}}function Ht(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Xr=Object.freeze({chunk:wr.chunk,id:`${Se}/${wr.chunk}`}),Yr=null,Yn=null,Gt=new Map;function Ki(e){Yr=e}function ji(){return Xr}function ll(e){let n=yt[e];return{chunk:n,id:`${Se}/${n}`}}function Zr(){if(Yn!==null)return Yn;let e=Yr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${Se}: the loader require was not handed over`));let n=e.async(`./${Xr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${Se}: chunk ${Xr.id} is missing its preview renderers`);return r});return Yn=n,n.catch(()=>{Yn===n&&(Yn=null)}),n}function _i(e){let n=Gt.get(e);if(n!==void 0)return n;let t=Yr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${Se}: the loader require was not handed over`));let r=ll(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${Se}: chunk ${r.id} is not the ${e} view`);return a});return Gt.set(e,o),o.catch(()=>{Gt.get(e)===o&&Gt.delete(e)}),o}var Hi=Object.freeze({}),ul="@deepseek-ai/dsh-client-ui-primitives",Jr=null,Qr;function Gi(e){Jr=e}function cl(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function Vt(){if(Qr!=null)return Qr;if(Jr===null)return Hi;let e=cl(Jr,ul);if(e===void 0)return Hi;let n=u=>{let p=e[u];if(typeof p=="function"||typeof p=="object"&&p!==null)return p},t=u=>{let p=e[u];return typeof p=="function"?p:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let c=n("IconChevronDownOutlineRegular");c!==void 0&&(r.IconChevronDownOutlineRegular=c);let d=t("useAnchoredPosition");return d!==void 0&&(r.useAnchoredPosition=d),r}var D=require("react");async function mn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Ut=require("react");function fl(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function qt(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(fl(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function Vi(e,n,t){return n<=0?0:((e+t)%n+n)%n}function qi(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function eo(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function Ui(e){let n=t=>qt(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var pl=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),ml=new Set(["SCRIPT","STYLE","TEMPLATE"]);function yl(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let d=i.data;if(d==="")continue;let u=n.at(-1);u===void 0?n.push([d]):u.push(d),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(ml.has(l))continue;if(l==="BR"){n.push([]);continue}let c=pl.has(l);c&&n.push([]),r(a),c&&n.push([])}};return r(e),{layout:qi(n),nodes:t}}function Xi(e){let n=()=>{let r=e();return r===null?void 0:yl(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:qt(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=qt(i.layout.text,r)[o];if(l===void 0)return;let c=eo(i.layout,l.from),d=eo(i.layout,l.to);if(c===void 0||d===void 0)return;let u=i.nodes[c.node],p=i.nodes[d.node];if(u===void 0||p===void 0)return;let g=a.ownerDocument.createRange();try{g.setStart(u,Math.min(c.offset,u.data.length)),g.setEnd(p,Math.min(d.offset,p.data.length))}catch{return}let b=t();b!==void 0&&(b.removeAllRanges(),b.addRange(g));let f=g.startContainer.parentElement;f!==null&&typeof f.scrollIntoView=="function"&&f.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var no=(0,Ut.createContext)(null);function Yi(){return(0,Ut.useContext)(no)}var Ve=require("react/jsx-runtime");function gl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function hl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function to({failure:e,t:n,onRetry:t}){return(0,Ve.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Ve.jsx)("strong",{children:gl(e,n)}),(0,Ve.jsx)("span",{children:hl(e,n)}),e.message===""?null:(0,Ve.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Ve.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function ro({t:e}){return(0,Ve.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Ve.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Re=require("react");var Je=require("react/jsx-runtime");function Zi({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Re.useState)(""),[a,l]=(0,Re.useState)(0),[c,d]=(0,Re.useState)(0),u=(0,Re.useRef)(null);(0,Re.useEffect)(()=>{u.current?.focus()},[]),(0,Re.useEffect)(()=>{if(o===""){d(0),l(0);return}let v=n().count(o);d(v),l(h=>v===0?0:Math.min(h,v-1))},[o,t,n]),(0,Re.useEffect)(()=>{o===""||c===0||n().reveal(o,a)},[o,a,c,n]);let p=(0,Re.useCallback)(()=>{n().clear(),r()},[n,r]),g=(0,Re.useCallback)(v=>{c!==0&&l(h=>Vi(h,c,v))},[c]),b=v=>{if(!v.nativeEvent.isComposing){if(v.key==="Escape"){v.preventDefault(),v.stopPropagation(),p();return}if(v.key==="Enter"){v.preventDefault(),g(v.shiftKey?-1:1);return}(v.key==="ArrowDown"||v.key==="ArrowUp")&&v.stopPropagation()}},f=o===""?e("preview.find.hint"):c===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(a+1)).replace("{count}",String(c));return(0,Je.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:b,children:[(0,Je.jsx)("input",{ref:u,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:v=>{i(v.currentTarget.value),l(0)}}),(0,Je.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":c===0?"empty":"ready",title:e("preview.find.scope"),children:f}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:c===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>g(-1),children:"\u2191"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:c===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>g(1),children:"\u2193"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:p,children:"\xD7"})]})}var oo="fsExplorer",Qi=1;function xl(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function kl(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function bl(e){return e.slice(e.lastIndexOf("/")+1).toLowerCase()}function vl(e,n,t,r){return e.extensions.length===0&&e.families.length===0&&e.names.length===0||n!==""&&e.extensions.includes(n)||t!==null&&e.families.includes(t)?!0:e.names.includes(r)}function wl(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Xt(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(kl),families:[...i.match?.families??[]],names:(i.match?.names??[]).map(c=>c.toLowerCase())}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=xl(i.path),l=zn(i.path),c=bl(i.path),d;for(let u of t.values())vl(u,a,l,c)&&(d===void 0||wl(u.contribution,d.contribution))&&(d=u);return d?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Ji(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Yt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Oe(e){try{return e()}catch{return}}function Pe(e){return e!==null&&typeof e=="object"}function oa(e){return()=>{let n=Oe(()=>e.workspaceFiles);if(Yt(n))return n;let t=Oe(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Yt(t))return t;let r=Oe(()=>e.remote?.workspaceFiles);if(Yt(r))return r;let o=Oe(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Yt(o))return o}}function ia(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function aa(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Mn(i,r.offset??1),i}catch(d){if(!(d instanceof me)||pn(d).kind!=="symlink")throw d;a=d}let l=await n(t,o);if(l===void 0)throw a;return{...Mn(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function ea(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Sl(e){let n=Oe(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Pe(n)?n.rpc:void 0;if(!Pe(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function sa(e){return()=>{let n=Oe(()=>e.remote?.gitExplorer);if(ea(n))return n;let t=Oe(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return ea(t)?t:Sl(e)}}function Rl(e){return e===""?0:e.split(`
`).length}function na(e){let n=Pe(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new me(t,r)}function da(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Pe(l))throw new me("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw na(l.error);let c=l;if(l.ok===!0&&(c=l.value),!Pe(c))throw new me("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(c.ok===!1)throw na(c.error);let d=c;if(c.ok===!0&&(d=c.page),!Pe(d))throw new me("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(d.kind==="submodule")throw new me("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(d.binary===!0||d.kind==="binary")throw new me("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof d.text!="string")throw new me("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let u=typeof d.lines=="number"&&Number.isFinite(d.lines)?Math.max(0,Math.trunc(d.lines)):Rl(d.text),p=typeof d.offset=="number"&&Number.isFinite(d.offset)&&d.offset>0?Math.trunc(d.offset):o.offset??1,g=d.source==="first-parent"?"first-parent":d.source==="commit"?"commit":void 0;return{text:d.text,lines:u,offset:p,eof:d.eof===!0,...g===void 0?{}:{source:g}}}}}function Cl(e){if(!Pe(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Pe(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Tl(e){let n=Pe(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Pe(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new me(t,r,i)}function so(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Cl(await n.call(e,t,r,{},o));if(!i.ok)throw Tl(i.error);return i.value.data}}function Zn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function io(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Zt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Zn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?io(r.value):{ok:!1,message:Zn(r.error)}}return io(t)}return io(n)}function la(e){return e instanceof Error?e.message:Zn(e)}function ta(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Pl(e){let n=Oe(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Pe(n)?n.rpc:void 0;if(!Pe(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function ua(e){return()=>{let n=Pl(e);if(n!==void 0)return n;let t=Oe(()=>e.remote?.gitExplorer);if(ta(t))return t;let r=Oe(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(ta(r))return r}}function ra(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function El(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=ra(r.additions),i=ra(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Fl(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Ml(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function ao(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=El(n.stats),r=Fl(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=Ml(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function Qt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Zn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?ao(o.snapshot):{ok:!1,message:Zn(o.error)}}let r=e;return r.snapshot!==void 0?ao(r.snapshot):ao(t)}var E=require("react/jsx-runtime"),fo={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Nl=()=>()=>{},ca=()=>{};function po(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var lo={status:"idle"},Il=[".md",".mdx",".markdown",".mdown"],Ll=-1e3;function co({t:e,revision:n}){return(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,E.jsx)("strong",{children:e("preview.unavailable.title")}),(0,E.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function fa({chunk:e,text:n,path:t,offset:r}){let o=(0,D.useRef)(null),i=(0,D.useRef)(null),a=Yi(),l=(0,D.useRef)(n);l.current=n;let[c,d]=(0,D.useState)(!1),u=Un(t);return(0,D.useEffect)(()=>{d(!1)},[e,t]),(0,D.useEffect)(()=>{let p=o.current;if(!(e===null||p===null))try{let g=e.mountCodePreview(p,{text:n,language:u,path:t,offset:r});return i.current=g,()=>{g.destroy(),i.current=null}}catch{d(!0);return}},[e,t,u]),(0,D.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),(0,D.useEffect)(()=>{if(!(a===null||e===null||c))return a.register(Ui({text:()=>l.current,select:(p,g)=>i.current?.revealRange(p,g),clear:()=>i.current?.clearSelection()})),()=>a.register(null)},[a,e,c]),e===null||c?(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,E.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Bl({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Xn(n)?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:jt(r)}):(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Al(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,E.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,E.jsx)(fa,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Dl(e){function n({page:t,path:r}){return(0,E.jsx)(fa,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Ol({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,D.useMemo)(()=>{let c=so(r);return c===void 0||t===void 0||a===void 0?c:async(d,u,p)=>{if(d!==t||u!==n)return c(d,u,p);let g=await a(u,p);return c(d,g?.absolutePath??u,p)}},[r,t,n,a]);return t===void 0||l===void 0?(0,E.jsx)(co,{t:o}):(0,E.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function Wl(e){return{Body:n=>(0,E.jsx)(Ol,{chunk:e,...n}),renderer:e.renderer}}function mo(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Il]},priority:0,load:()=>Zr().then(Al)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:Ll,load:()=>Zr().then(Dl)},...Object.keys(yt).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>_i(e).then(Wl)}))]}var uo;function $l(){if(uo!==void 0)return uo;let e=Xt();for(let n of mo())e.register(n);return uo=e,e}function pa({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:c,locate:d}){let u=(0,D.useMemo)(()=>{let K=r===void 0?ia(n,e):o===void 0||e===void 0?void 0:da(o,e,r);return K===void 0||r!==void 0||d===void 0?K:aa(K,d)},[n,e,r,o,d]),p=(0,D.useMemo)(()=>r===void 0?so(n):void 0,[n,r]),g=l??$l(),b=t===void 0?null:zn(t),f=b!==null,v=r===void 0&&e!==void 0&&p!==void 0?{sessionId:e,readFile:p}:null,[h,G]=(0,D.useState)(null),[O,Y]=(0,D.useState)(qn),[F,W]=(0,D.useState)(lo),[B,$]=(0,D.useState)(0),[A,oe]=(0,D.useState)(0),[fe,S]=(0,D.useState)("reading"),[T,M]=(0,D.useState)(!1),[_,N]=(0,D.useState)(!1),[x,P]=(0,D.useState)(void 0),[R,X]=(0,D.useState)(!1),[ee,Be]=(0,D.useState)(!1),nn=(0,D.useRef)(null),ye=(0,D.useRef)(null),ie=(0,D.useRef)(void 0),Q=(0,D.useRef)(void 0),z=(0,D.useSyncExternalStore)(c?.subscribe??Nl,()=>c===void 0||e===void 0||t===void 0?ca():c.peek(e,t),ca),Z=c===void 0||e===void 0||t===void 0?void 0:c.find(e,t);if((0,D.useEffect)(()=>{if(u===void 0){G(null);return}let K=_t({files:u,maxLines:Ur});return G(K),()=>K.close()},[u]),(0,D.useEffect)(()=>{if(h===null){Y(qn);return}return Y(h.getSnapshot()),h.subscribe(()=>Y(h.getSnapshot()))},[h]),(0,D.useEffect)(()=>{h===null||t===void 0||b!==null||h.open(t)},[h,t,b]),(0,D.useEffect)(()=>{if(!f||t===void 0||d===void 0){P(void 0);return}let K=new AbortController,we=!0;return(async()=>{let ae=await d(t,K.signal);we&&!K.signal.aborted&&P(ae?.absolutePath)})(),()=>{we=!1,K.abort()}},[f,t,d]),(0,D.useEffect)(()=>{S("reading"),M(!1),X(!1)},[t]),(0,D.useEffect)(()=>()=>{ie.current!==void 0&&clearTimeout(ie.current),Q.current!==void 0&&clearTimeout(Q.current)},[]),(0,D.useEffect)(()=>{z?.conflict!==!0&&(N(!1),X(!1),Q.current!==void 0&&clearTimeout(Q.current))},[z?.conflict]),(0,D.useEffect)(()=>g.subscribe(()=>$(K=>K+1)),[g]),(0,D.useEffect)(()=>{if(t===void 0||r!==void 0){W(lo);return}let K=Ji(g,{path:t});if(K===void 0){W(lo);return}let{contribution:we}=K,ae=!0;return W(Me=>Me.status==="ready"&&Me.contribution.id===we.id?Me:{status:"loading",contribution:we}),K.module.then(Me=>{ae&&W({status:"ready",contribution:we,module:Me})},Me=>{ae&&W({status:"failed",contribution:we,failure:pn(Me)})}),()=>{ae=!1}},[g,t,r,B,A]),t===void 0)return(0,E.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,E.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,E.jsx)("strong",{children:i("preview.empty.title")}),(0,E.jsx)("span",{children:i("preview.empty.description")})]})});let xe=f&&r!==void 0,Ae=Ht(O),pe=O.linkPath??t,ke=f?x:O.linkTarget,Xe=!f&&Xn(t),ze=f?!xe&&v!==null&&F.status!=="ready"&&F.status!=="failed":O.status==="loading",tn=O.status==="ready",Ke=Xe&&fe==="reading",it=f?xe||v===null?"unavailable":F.status==="failed"?"failed":F.status==="ready"?"ready":"loading":O.status,Ln=F.status==="ready"?F.module.renderer??F.contribution.id:f?"pending":Ke?"fallback":"plain",be=(0,D.useMemo)(()=>Xi(()=>nn.current),[]),rn=(0,D.useMemo)(()=>()=>ye.current??be,[be]),ve=(0,D.useMemo)(()=>({register:K=>{ye.current=K}}),[]),j=[pe,String(fe),O.offset,O.text.length,Ln].join("|"),Te=!f&&tn,Bn={path:ke??t,sessionId:e,files:n,t:i,visible:a,mode:fe,...f?{}:{page:{text:O.text,offset:O.offset}},...d===void 0?{}:{locate:d}},on=()=>{mn(ke??pe).then(K=>{K&&(M(!0),ie.current!==void 0&&clearTimeout(ie.current),ie.current=setTimeout(()=>M(!1),1400))})},An=()=>{let K=Z?.copyDraft();K!==void 0&&mn(K).then(we=>{we&&(N(!0),Q.current!==void 0&&clearTimeout(Q.current),Q.current=setTimeout(()=>N(!1),1400))})},je=z?.error,ur=je!=null&&z?.conflict!==!0,de=z?.conflict===!0,Ye=z?.discarded??null,kn=!de&&Ye!==null&&z?.dirty!==!0&&Ye!==z?.text,De;if(f){let K=F.status==="ready"?F.module.Body:void 0;De=xe?(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,E.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,E.jsx)("span",{children:i("preview.commitBinary.description")})]}):v===null?(0,E.jsx)(co,{t:i,revision:r}):F.status==="failed"?(0,E.jsx)(to,{failure:F.failure,t:i,onRetry:()=>oe(we=>we+1)}):K===void 0?(0,E.jsx)(ro,{t:i}):(0,E.jsx)(K,{...Bn})}else if(u===void 0)De=(0,E.jsx)(co,{t:i,revision:r});else if(O.status==="failed")De=(0,E.jsx)(to,{failure:O.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{h?.retry()}});else if(!tn)De=(0,E.jsx)(ro,{t:i});else{let K=F.status==="ready"?F.module.Body:Bl;De=(0,E.jsx)(K,{...Bn})}return(0,E.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":it,"data-mode":f?"binary":Ke?"reading":"code","data-renderer":Ln,children:[(0,E.jsxs)("header",{className:"fx-preview-bar",children:[(0,E.jsxs)("span",{className:"fx-preview-path",title:ke===void 0?pe:`${pe} \u2192 ${ke}`,"data-testid":"fs-preview-path",...ke===void 0?{}:{"data-link":"followed"},children:[pe,ke===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",ke]})]}),f?null:(0,E.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Ae.range,Ae.range==="\u2014"?null:(0,E.jsxs)(E.Fragment,{children:[" ",i("preview.lines")]}),Ae.total===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-total",children:[" / ",Ae.total," ",i("preview.lines")]})]}),(0,E.jsxs)("div",{className:"fx-preview-actions",children:[z===void 0?null:(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!z.dirty||z.saving||z.status!=="ready",onClick:()=>{Z?.save()},children:z.saving?i("preview.saving"):i("preview.save")}),Xe?(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>S(K=>K==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(fe==="reading"?"preview.source":"preview.reading")}):null,f?null:(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!tn||ze||O.offset<=1,onClick:()=>{h?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!tn||ze||O.eof,onClick:()=>{h?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),Te?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":ee?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":ee,onClick:()=>Be(K=>!K),children:i("preview.find")}):null,(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:on,"data-testid":"fs-preview-copy",children:i(T?"preview.copied":"preview.copyPath")}),ze?(0,E.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),ee&&Te?(0,E.jsx)(Zi,{t:i,surface:rn,stamp:j,onClose:()=>Be(!1)}):null,O.source==="first-parent"?(0,E.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,de||kn?(0,E.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":de?"conflict":"discarded",children:[(0,E.jsx)("strong",{children:i(de?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,E.jsx)("span",{className:"fx-conflict-hint",children:i(de?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,E.jsx)("span",{className:"fx-spacer"}),de?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":R?"discard":void 0,onClick:()=>{if(!R&&z?.dirty===!0){X(!0);return}X(!1),Z?.reload({force:!0})},children:i(R?"preview.conflict.discard":"preview.conflict.reload")}):null,kn?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Ye!==null&&Z?.setDraft(Ye)},children:i("preview.conflict.restore")}):null,de?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:An,children:i(_?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,ur?(0,E.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",po(je?.code??"io-error",je?.message??"",i))}):null,(0,E.jsx)("div",{className:"fx-preview-body","data-scroll":Ke?"y":"none",ref:nn,children:(0,E.jsx)(no.Provider,{value:ve,children:De})})]})}var ma="dsh-fs-explorer-styles",zl=`
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
`;function ya(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${ma}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=ma,t.textContent=zl,e.head.appendChild(t),()=>{t.remove()}}var y=require("react");var se={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"},yn={close:"tab.close",closeOthers:"tab.close.others",closeRight:"tab.close.right"};function ga(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function Kl(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function ha(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,c=[{id:se.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:se.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return c;let d=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,u={id:se.reveal,label:n(Kl(o?.fileManager??null)),...d?{}:{disabled:!0,reason:n("menu.reveal.reason")}},p={id:se.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},g={id:se.copyRelative,label:n("menu.copy.relative")},b=e.remoteLinks,f=b!==void 0&&b.length>0?{id:se.copyRemote,label:n("menu.copy.remote"),submenu:b.map(v=>({id:v.id,label:v.label}))}:{id:se.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...c,u,{id:"menu.copy",label:n("menu.copy"),submenu:[p,g]},f,{id:se.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}function xa(e,n){let t=e.panels.findIndex(r=>r.key===e.key);return t<0?[]:[{id:yn.close,label:n("menu.tab.close")},{id:yn.closeOthers,label:n("menu.tab.closeOthers"),...e.panels.length>1?{}:{disabled:!0,reason:n("menu.tab.closeOthers.reason")}},...t===e.panels.length-1?[]:[{id:yn.closeRight,label:n("menu.tab.closeRight")}]]}var We=require("react");var Ce=require("react/jsx-runtime");function jl(e){return new DOMRect(e.x,e.y,0,0)}function ka(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Ce.jsxs)(Ce.Fragment,{children:[e.label,(0,Ce.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function yo({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=Vt();if(i.Menu!==void 0){let a=i.Menu;return(0,Ce.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:ka(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(c=>({id:c.id,label:ka(c),...c.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>jl(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Ce.jsx)(_l,{entries:e,anchor:n,onSelect:t,onClose:r})}function _l({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,We.useRef)(null),[i,a]=(0,We.useState)(null),[l,c]=(0,We.useState)({left:n.x,top:n.y});(0,We.useEffect)(()=>{let u=o.current;if(u===null)return;let p=8,g=u.offsetWidth,b=u.offsetHeight,f=Math.min(Math.max(n.x,p),Math.max(p,window.innerWidth-g-p)),v=Math.min(Math.max(n.y,p),Math.max(p,window.innerHeight-b-p));c({left:f,top:v})},[n.x,n.y]),(0,We.useEffect)(()=>{let u=g=>{g.target instanceof Node&&o.current?.contains(g.target)!==!0&&r()},p=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),r())};return document.addEventListener("pointerdown",u),document.addEventListener("keydown",p,!0),()=>{document.removeEventListener("pointerdown",u),document.removeEventListener("keydown",p,!0)}},[r]);let d=(0,We.useCallback)(u=>{if(u.disabled!==!0){if(u.submenu!==void 0){a(p=>p===u.id?null:u.id);return}t(u.id)}},[t]);return(0,Ce.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:u=>u.preventDefault(),children:e.map(u=>(0,Ce.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Ce.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":u.id,disabled:u.disabled===!0&&u.reason===void 0,"aria-disabled":u.disabled===!0?!0:void 0,"aria-haspopup":u.submenu===void 0?void 0:"menu","aria-expanded":u.submenu===void 0?void 0:i===u.id,title:u.disabled===!0?u.reason:void 0,onClick:()=>d(u),children:u.label}),u.submenu===void 0||i!==u.id?null:(0,Ce.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:u.submenu.map(p=>(0,Ce.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":p.id,disabled:p.disabled===!0&&p.reason===void 0,"aria-disabled":p.disabled===!0?!0:void 0,title:p.disabled===!0?p.reason:void 0,onClick:()=>d(p),children:p.label},p.id))})]},u.id))})}var ce=require("react"),H=require("react/jsx-runtime"),Hl=120,go=280,Jt=8;function er(e){let n=typeof window>"u"?e:window.innerWidth-go;return Math.max(Jt,Math.min(e,Math.max(Jt,n)))}function Gl(e,n){if(e===void 0)return{left:Jt,top:Jt};if(n<=1)return{left:er(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+go<=window.innerWidth;return{left:er(r?t:e.left-go-4),top:e.top}}function ba(){return(0,H.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,H.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function va({node:e,t:n,onOpen:t}){return(0,H.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,H.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function wa({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:c}){let[d,u]=(0,ce.useState)([]),p=(0,ce.useRef)(null),[g,b]=(0,ce.useState)(null),[f,v]=(0,ce.useState)(null),h=(0,ce.useCallback)(()=>{p.current!==null&&(clearTimeout(p.current),p.current=null)},[]),G=(0,ce.useCallback)(()=>{h(),u([])},[h]),O=(0,ce.useCallback)(()=>{h(),p.current=setTimeout(()=>{p.current=null,u([])},Hl)},[h]);(0,ce.useEffect)(()=>()=>{p.current!==null&&clearTimeout(p.current)},[]),(0,ce.useEffect)(()=>{if(d.length===0||typeof document>"u")return;let S=T=>{T.key!=="Escape"||T.isComposing||(T.preventDefault(),T.stopPropagation(),G())};return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[G,d.length]);let Y=(0,ce.useCallback)((S,T,M)=>{h();let{left:_,top:N}=Gl(M?.getBoundingClientRect(),T);u(x=>{let P=x.slice(0,T);return P.length===T&&P[T-1]?.groupId===S?x:[...P,{groupId:S,left:_,top:N,depth:T}]})},[h]),F=(0,ce.useCallback)(S=>{G(),S.kind==="file"?t(S.path):S.kind==="folder"&&r(S.path)},[G,t,r]),W=S=>{let T,M=_=>{for(let N of _)N.kind==="group"&&(N.id===S&&(T=N),M(N.children))};return M(e.roots),T},B=S=>{let T=(M,_)=>{if(M.some(N=>N.id===S))return{parentId:_,siblings:M};for(let N of M){if(N.kind!=="group")continue;let x=T(N.children,N.id);if(x!==void 0)return x}};return T(e.roots,null)??{parentId:null,siblings:[]}},$=(S,T)=>{let M=T?.getBoundingClientRect(),{parentId:_,siblings:N}=B(S.id);b({node:S,parentId:_,siblings:N,left:er(M?.left??0),top:(M?.bottom??0)+4})},A=(S,T)=>{let{parentId:M,siblings:_}=B(S.id);b({node:S,parentId:M,siblings:_,left:er(T.clientX),top:T.clientY})},oe=(S,T)=>{let{parentId:M,siblings:_}=B(S.id),N=_.map(ee=>ee.id),x=N.indexOf(S.id),P=x+T;if(x<0||P<0||P>=N.length)return;let R=[...N],[X]=R.splice(x,1);X!==void 0&&(R.splice(P,0,X),b(null),c?.(M,R))},fe=S=>{let T=f;if(v(null),T===null||T===S)return;let M=e.roots.map(R=>R.id),_=M.indexOf(T),N=M.indexOf(S);if(_<0||N<0)return;let x=[...M],[P]=x.splice(_,1);P!==void 0&&(x.splice(N,0,P),c?.(null,x))};return(0,ce.useEffect)(()=>{if(g===null||typeof document>"u")return;let S=M=>{M.target instanceof Node&&(M.target instanceof Element&&M.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||b(null))},T=M=>{M.key!=="Escape"||M.isComposing||(M.preventDefault(),M.stopPropagation(),b(null))};return document.addEventListener("pointerdown",S),document.addEventListener("keydown",T,!0),()=>{document.removeEventListener("pointerdown",S),document.removeEventListener("keydown",T,!0)}},[g]),(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,H.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(S=>(0,H.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":f===S.id?"true":void 0,draggable:!0,onDragStart:()=>v(S.id),onDragEnd:()=>v(null),onDragOver:T=>T.preventDefault(),onDrop:T=>{T.preventDefault(),fe(S.id)},children:[S.kind==="group"?(0,H.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":d.some(T=>T.groupId===S.id),title:n("bookmarks.group"),onPointerEnter:T=>Y(S.id,1,T.currentTarget),onFocus:T=>Y(S.id,1,T.currentTarget),onPointerLeave:O,onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),A(S,T)},children:[(0,H.jsx)("span",{className:"fx-bookmark-name",children:S.name}),(0,H.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,H.jsx)(ba,{})})]}):(0,H.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":S.kind,title:S.path,onClick:()=>F(S),onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),A(S,T)},children:(0,H.jsx)("span",{className:"fx-bookmark-name",children:S.name})}),(0,H.jsx)(va,{node:S,t:n,onOpen:$})]},S.id))}),g===null?null:(0,H.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:g.left,top:g.top},children:[(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{b(null),i?.(g.node)},children:n("bookmarks.rename")}),(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{b(null),a?.(g.node)},children:n("bookmarks.remove")}),(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:g.siblings[0]?.id===g.node.id,onClick:()=>oe(g.node,-1),children:n("bookmarks.moveUp")}),(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:g.siblings[g.siblings.length-1]?.id===g.node.id,onClick:()=>oe(g.node,1),children:n("bookmarks.moveDown")}),(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{b(null),l?.(g.node)},children:n("bookmarks.moveToGroup")})]}),d.map(S=>{let T=W(S.groupId);return T===void 0?null:(0,H.jsxs)("div",{className:S.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":S.depth,role:"menu","aria-label":T.name,style:{left:S.left,top:S.top},onPointerEnter:h,onPointerLeave:O,children:[T.children.length===0?null:T.children.map(M=>(0,H.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[M.kind==="group"?(0,H.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":d.some(_=>_.groupId===M.id),onPointerEnter:_=>Y(M.id,S.depth+1,_.currentTarget),onFocus:_=>Y(M.id,S.depth+1,_.currentTarget),onContextMenu:_=>{_.preventDefault(),_.stopPropagation(),A(M,_)},children:[(0,H.jsx)("span",{className:"fx-bookmark-name",children:M.name}),(0,H.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,H.jsx)(ba,{})})]}):(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":M.kind,role:"menuitem",title:M.path,onClick:()=>F(M),onContextMenu:_=>{_.preventDefault(),_.stopPropagation(),A(M,_)},children:(0,H.jsx)("span",{className:"fx-bookmark-name",children:M.name})}),(0,H.jsx)(va,{node:M,t:n,onOpen:$})]},M.id)),(0,H.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(G(),o(T.id))},children:n("bookmarks.newGroup")})]},T.id)})]})}var Ie=require("react");var Vl="dsh_fs_explorer",ql="bookmarks";function Ee(e){throw new Error(`bookmarks: ${e}`)}function Sa(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function nr(e,n,t){typeof e!="string"&&Ee(`${n} must be a string`);let r=e.trim();return r===""&&Ee(`${n} must not be empty`),r.length>t&&Ee(`${n} must be at most ${String(t)} characters`),r}function Ra(e,n,t,r){t>32&&Ee(`${n} is nested deeper than ${String(32)} levels`),Sa(e)||Ee(`${n} must be an object`);let o=nr(e.id,`${n}.id`,200);r.has(o)&&Ee(`duplicate id "${o}" at ${n}`),r.add(o);let i=nr(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Ee(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let c=e.children;return Array.isArray(c)||Ee(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:c.map((d,u)=>Ra(d,`${n}.children[${String(u)}]`,t+1,r))}}if(l==="file"||l==="folder"){let c=nr(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:c}}return Ee(`${n}.kind must be "group", "file" or "folder"`)}function Nn(e){Sa(e)||Ee("a bookmark tree must be an object"),e.version!==1&&Ee(`version must be 1, received ${JSON.stringify(e.version)}`);let n=nr(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Ee("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>Ra(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var Jc={name:Vl,version:1,invalidRecords:"backup-and-skip",tables:{[ql]:{valueSchema:{parse:Nn}}}};function re(e){throw new Error(`bookmarks: ${e}`)}function gn(e){return{version:1,roots:[],updatedAt:e}}function Qn(e,n){let t=n.name.trim();if(t===""&&re("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&re(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function Ul(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function Ta(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,Ta(r,n+1)),n)}function Pa(e,n){let t=Ul(e,n.id);t!==0&&Ta(n,t)>32&&re(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function ho(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&ho(r.children,n,r.id)}function qe(e,n){let t;return ho(e.roots,r=>{r.id===n&&(t=r)}),t}function Ea(e,n){let t;return ho(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function Fa(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&Fa(t,n))}function xo(e,n){if(n===null)return e.roots;let t=qe(e,n);return t===void 0&&re(`no group with id "${n}"`),t.kind!=="group"&&re(`"${n}" is not a group`),t.children}function Ma(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function In(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:In(r.children,n,t)})}function Jn(e,n,t){return{version:1,roots:n,updatedAt:t}}var et=()=>new Date().toISOString();function nt(e,n,t,r,o=et){let i=xo(e,n);qe(e,t.id)!==void 0&&re(`a node with id "${t.id}" already exists`);let a=Ma(r,i.length),l=In(e.roots,n,d=>[...d.slice(0,a),t,...d.slice(a)]),c=Jn(e,l,o());return Pa(c,t),c}function Na(e,n,t=et){let r=qe(e,n);r===void 0&&re(`no node with id "${n}"`);let o=Ea(e,n);o===void 0&&re(`no node with id "${n}"`);let i=In(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:Jn(e,i,t()),removed:r}}function Ia(e,n,t,r=et){let o=t.trim();o===""&&re("a node needs a non-empty name"),qe(e,n)===void 0&&re(`no node with id "${n}"`);let i=a=>a.map(l=>{let c=l.id===n?{...l,name:o}:l;return c.kind==="group"?{...c,children:i(c.children)}:c});return Jn(e,i(e.roots),r())}function La(e,n,t,r,o=et){let i=qe(e,n);i===void 0&&re(`no node with id "${n}"`);let a=Ea(e,n);if(a===void 0&&re(`no node with id "${n}"`),t!==null){let g=qe(e,t);g===void 0&&re(`no group with id "${t}"`),g.kind!=="group"&&re(`"${t}" is not a group`),i.kind==="group"&&Fa(i,t)&&re(`cannot move "${n}" into itself or its own descendant`)}let l=In(e.roots,a,g=>g.filter(b=>b.id!==n)),c=xo({version:1,roots:l,updatedAt:e.updatedAt},t),d=Ma(r,c.length),u=In(l,t,g=>[...g.slice(0,d),i,...g.slice(d)]),p=Jn(e,u,o());return Pa(p,i),p}function Ba(e,n,t,r=et){let o=xo(e,n),i=new Set(o.map(d=>d.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&re(`the new order must name each of the ${String(o.length)} children exactly once`);for(let d of t)i.has(d)||re(`"${d}" is not a child of ${n??"the root"}`);let l=new Map(o.map(d=>[d.id,d])),c=In(e.roots,n,()=>t.map(d=>{let u=l.get(d);return u===void 0&&re(`"${d}" is not a child of ${n??"the root"}`),u}));return Jn(e,c,r())}var $e=require("react");var Fe=require("react/jsx-runtime"),Xl=200;function Yl(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>Xl?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function Zl(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function tt({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:c,submitKey:d}){let[u,p]=(0,$e.useState)(()=>l??Zl(e)),[g,b]=(0,$e.useState)(void 0),f=(0,$e.useRef)(null),v=Vt();(0,$e.useEffect)(()=>{l!==void 0&&(p(l),b(void 0))},[l]),(0,$e.useEffect)(()=>{let W=f.current;W!==null&&(W.focus(),W.select())},[]);let h=(0,$e.useCallback)(()=>{if(a)return;let W=Yl(u,e);if(!W.ok){b(t(`prompt.error.${W.reason}`));return}b(void 0),r(W.name)},[a,e,r,t,u]),G=W=>{if(!W.nativeEvent.isComposing){if(W.key==="Escape"){W.preventDefault(),W.stopPropagation(),o();return}W.key==="Enter"&&(W.preventDefault(),h())}},O=g??i,Y=v.Input,F=c??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Fe.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(F),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:G,children:[(0,Fe.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Fe.jsx)("strong",{children:t(F)}),(0,Fe.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),Y===void 0?(0,Fe.jsx)("input",{ref:f,className:"fx-name-input",type:"text",value:u,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":O===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:W=>{p(W.target.value),b(void 0)}}):(0,Fe.jsx)(Y,{ref:f,className:"fx-name-input",value:u,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":O===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:W=>{p(W.target.value),b(void 0)}}),O===void 0?null:(0,Fe.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:O}),(0,Fe.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Fe.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Fe.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:h,children:t(d??"prompt.submit")})]})]})}var J=require("react/jsx-runtime");function Aa(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function Ql(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function Da({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,c]=(0,Ie.useState)(null),[d,u]=(0,Ie.useState)(e),[p,g]=(0,Ie.useState)(!1),[b,f]=(0,Ie.useState)(void 0),v=(0,Ie.useRef)(null);(0,Ie.useEffect)(()=>{let B=A=>{A.target instanceof Node&&v.current?.contains(A.target)!==!0&&a()},$=A=>{A.key!=="Escape"||A.isComposing||p||(A.preventDefault(),A.stopPropagation(),a())};return document.addEventListener("pointerdown",B),document.addEventListener("keydown",$,!0),()=>{document.removeEventListener("pointerdown",B),document.removeEventListener("keydown",$,!0)}},[p,a]);let h=()=>(l===null?d.roots:qe(d,l)?.kind==="group"?qe(d,l).children:[]).filter($=>$.kind==="group"),G=(0,Ie.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(La(d,o.id,l));return}if(n===void 0)return;let B=Qn(n.kind==="directory"?"folder":"file",{id:Aa(),name:n.name,path:n.path,createdAt:Date.now()});i(nt(d,l,B))}catch(B){f(B instanceof Error?B.message:String(B))}},[l,d,r,o,i,n]),O=B=>{try{let $=Qn("group",{id:Aa(),name:B,createdAt:Date.now()}),A=nt(d,l,$);u(A),g(!1),f(void 0),c($.id)}catch($){f($ instanceof Error?$.message:String($))}},Y=Ql(d,l),F=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),W=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,J.jsxs)("div",{ref:v,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":F,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,J.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,J.jsx)("strong",{children:F}),r==="add"&&n!==void 0?(0,J.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,J.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,J.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,J.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(null),children:t("bookmarks.picker.root")}),Y.map(B=>(0,J.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(B.id),children:B.name},B.id))]}),(0,J.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:h().length===0?(0,J.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):h().map(B=>(0,J.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>c(B.id),children:(0,J.jsx)("span",{className:"fx-bookmark-name",children:B.name})},B.id))}),b===void 0?null:(0,J.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:b}),p?(0,J.jsx)(tt,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:O,onCancel:()=>g(!1)}):(0,J.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,J.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>g(!0),children:t("bookmarks.newGroup")}),(0,J.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:G,children:W})]})]})}function ko(e){return`dsh-fs-explorer.bookmarks.${e}`}function bo(e){return`${ko(e)}.pending`}function tr(){try{return globalThis.localStorage??void 0}catch{return}}function Oa(e){let n=tr();if(n===void 0)return;let t;try{t=n.getItem(ko(e))}catch{return}if(t!==null)try{return Nn(JSON.parse(t))}catch{return}}function Jl(e,n){let t=tr();if(t!==void 0)try{t.setItem(ko(e),JSON.stringify(n)),t.setItem(bo(e),"1")}catch{}}function eu(e){let n=tr();if(n===void 0)return!1;try{return n.getItem(bo(e))==="1"}catch{return!1}}function Wa(e){let n=tr();if(n!==void 0)try{n.removeItem(bo(e))}catch{}}function $a(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(Wa(n),r.tree):eu(n)?Oa(n)??gn(new Date().toISOString()):gn(new Date().toISOString())}catch{}return Oa(n)??gn(new Date().toISOString())},async save(n,t){let r=Nn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){Wa(n);return}}catch{}Jl(n,r)}}}var vo="fs-explorer.treePaneWidth";function wo(e){return Math.min(520,Math.max(180,e))}function Ka(e){if(e==null)return null;let n;try{n=e.getItem(vo)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function rr(e,n){let t=Math.round(wo(n));if(e!=null)try{e.setItem(vo,String(t))}catch{}return t}function ja(e){if(e!=null)try{e.removeItem(vo)}catch{}}function _a(e,n){return Math.round(e)===Math.round(n)}var za=16;function Ha(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-za};case"ArrowRight":return{kind:"nudge",delta:za};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var U=require("react");function Va(e,n,t,r=800){return t-n<=r?e:""}function qa(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Ua(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:nu(e,t+1,r.depth,r.depth+1)}function nu(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var tu=/^.$/u;function Xa(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!tu.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ga(e.names,n),l=a.find(c=>c>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=Ga(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ga(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var I=require("react/jsx-runtime"),Ue=22;function So({open:e=!0,size:n=14}){return(0,I.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,I.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,I.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function ru(){return(0,I.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,I.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Ya(){return(0,I.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,I.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,I.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Za(){return(0,I.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,I.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,I.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function Qa(){return(0,I.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,I.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function ou({name:e}){return(0,I.jsx)("span",{className:"fx-badge","data-icon":Cn(e),"aria-hidden":"true",children:Tn(e)})}function iu({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:c}){let d=e.kind==="directory",u={top:r,paddingLeft:8+e.depth*12};return(0,I.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:u,onClick:()=>{l(e.path),d?i(e.path):a(e.path)},onContextMenu:p=>{p.preventDefault(),p.stopPropagation(),c(e,p)},children:[(0,I.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,I.jsx)(ru,{})}),d?(0,I.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,I.jsx)(So,{open:e.expanded})}):(0,I.jsx)(ou,{name:e.name}),(0,I.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,I.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,I.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,I.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":jn(e.status),"data-testid":"fx-file-status",title:o(Sr(e.status)),"aria-label":o(Sr(e.status)),children:kt(e.status)}),e.statusCount===void 0?null:(0,I.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,I.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,I.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,I.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,I.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,I.jsx)("span",{className:"fx-size",children:Ft(e.size)})]})}function au({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,I.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,I.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,I.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,I.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,I.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function su(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Ja({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:c,cursorRequest:d,onCursorMove:u}){let p=(0,U.useRef)(null),[g,b]=(0,U.useState)(0),[f,v]=(0,U.useState)(0),[h,G]=(0,U.useState)(void 0),O=(0,U.useRef)(void 0),Y=(0,U.useRef)({query:"",at:0}),F=(0,U.useRef)(void 0),W=(0,U.useRef)(void 0),B=(0,U.useRef)(h);B.current=h;let $=(0,U.useMemo)(()=>e.flatMap((x,P)=>x.type==="entry"?[P]:[]),[e]);(0,U.useEffect)(()=>{let x=W.current!==n;if(W.current=n,F.current!==void 0||n===void 0)return;let P=B.current===void 0?void 0:e[B.current];if(!li({cursorPath:P?.type==="entry"?P.path:void 0,selectionMoved:x}))return;let R=e.findIndex(X=>X.type==="entry"&&X.path===n);R>=0&&G(R)},[n,e]),(0,U.useEffect)(()=>{let x=F.current;if(x===void 0)return;let P=e.findIndex(ee=>ee.type==="entry"&&ee.path===x),R=e[P];if(R?.type!=="entry"||R.kind!=="directory"||!R.expanded){F.current=void 0;return}let X=ui(e,x);X!==void 0&&(F.current=void 0,G(X))},[e]),(0,U.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&G(void 0)},[e,h]),(0,U.useEffect)(()=>{let x=p.current;if(h===void 0||x===null)return;let P=Cr({scrollTop:x.scrollTop,viewport:x.clientHeight,rowHeight:Ue,index:h});P!==x.scrollTop&&(x.scrollTop=P)},[h]);let A=(0,U.useCallback)((x,P=!0)=>{G(x),P&&p.current?.focus({preventScroll:!0})},[]),oe=(0,U.useRef)(void 0);(0,U.useEffect)(()=>{if(d===void 0||oe.current===d.nonce)return;let x=$.at(-1);if(d.path!==void 0){let R=e.findIndex(X=>X.type==="entry"&&X.path===d.path);oe.current=d.nonce,R>=0&&A(R,d.focus);return}if(d.delta===void 0){oe.current=d.nonce;return}if(oe.current=d.nonce,h===void 0){let R=d.delta>0?$[0]:x;R!==void 0&&A(R,d.focus);return}let P=d.delta>0?$.find(R=>R>h):[...$].reverse().find(R=>R<h);P!==void 0&&A(P,d.focus)},[d,h,$,A,e]),(0,U.useEffect)(()=>{if(u===void 0)return;let x=h===void 0?void 0:e[h];u(x?.type==="entry"?x.path:void 0)},[h,e,u]);let fe=(0,U.useCallback)(x=>{let P=e.findIndex(R=>R.type==="entry"&&R.path===x);P>=0&&G(P)},[e]),S=(0,U.useCallback)((x,P,R)=>{fe(x.path),c(x,P,R)},[fe,c]),T=(0,U.useCallback)(x=>{x.preventDefault(),c(void 0,{x:x.clientX,y:x.clientY},x.currentTarget)},[c]),M=(0,U.useCallback)(x=>{if(x.nativeEvent.isComposing||x.altKey||x.metaKey||x.ctrlKey)return;let P=$.at(-1);if(x.key==="ArrowDown"){if(x.preventDefault(),h===void 0){$[0]!==void 0&&A($[0]);return}let z=$.find(Z=>Z>h);z!==void 0&&A(z);return}if(x.key==="ArrowUp"){if(x.preventDefault(),h===void 0){P!==void 0&&A(P);return}let z=[...$].reverse().find(Z=>Z<h);z!==void 0&&A(z);return}if(h===void 0)return;let R=e[h];if(R===void 0||R.type!=="entry")return;if(x.key==="ArrowRight"){if(x.preventDefault(),R.kind==="directory"&&!R.expanded)F.current=R.path,o(R.path);else{let z=$.find(Z=>Z>h);z!==void 0&&e[z]?.depth===R.depth+1&&A(z)}return}if(x.key==="ArrowLeft"){if(x.preventDefault(),R.kind==="directory"&&R.expanded)o(R.path);else{let z=[...$].reverse().find(Z=>Z<h&&e[Z]?.type==="entry"&&e[Z].depth<R.depth);z!==void 0&&A(z)}return}if(x.key==="Enter"&&R.kind!=="directory"){x.preventDefault(),i(R.path);return}if(x.key==="ContextMenu"||x.key==="F10"&&x.shiftKey){x.preventDefault();let z=p.current?.getBoundingClientRect(),Z=z===void 0?0:z.top+h*Ue-(p.current?.scrollTop??0);S(R,{x:z?.left??0,y:Z+Ue},p.current??void 0);return}if(x.key==="Home"){x.preventDefault(),$[0]!==void 0&&A($[0]);return}if(x.key==="End"){x.preventDefault(),P!==void 0&&A(P);return}let X=Date.now(),ee=qa(e,h),Be=Ua(e,ee),nn=Be.map(z=>{let Z=e[z];return Z?.type==="entry"?Z.name:""}),ye=Xa({query:Va(Y.current.query,Y.current.at,X),key:x.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:x.nativeEvent.repeat,names:nn,active:h===void 0?-1:Be.indexOf(h)});if(ye.kind==="clear"){Y.current={query:"",at:0};return}if(ye.kind!=="jump")return;let ie=Be[ye.index];if(ie===void 0)return;let Q=e[ie];Q?.type==="entry"&&(Y.current={query:ye.query,at:X},x.preventDefault(),A(ie),Q.kind!=="directory"&&i(Q.path))},[h,$,A,o,i,S,e]);(0,U.useEffect)(()=>{let x=p.current;if(x===null)return;let P=()=>v(x.clientHeight);if(P(),typeof ResizeObserver>"u")return;let R=new ResizeObserver(P);return R.observe(x),()=>R.disconnect()},[]),(0,U.useEffect)(()=>{if(n===void 0)return;let x=p.current;if(x===null)return;let P=e.findIndex(X=>X.type==="entry"&&X.path===n);if(P<0)return;let R=P*Ue;(R<x.scrollTop||R+Ue>x.scrollTop+x.clientHeight)&&(x.scrollTop=Math.max(0,R-x.clientHeight/2))},[n,e]),(0,U.useEffect)(()=>{if(t===void 0||O.current===t)return;let x=p.current;if(x===null)return;let P=t.path===void 0?-1:e.findIndex(R=>R.type==="entry"&&R.path===t.path);if(!(t.path!==void 0&&P<0)){if(O.current=t,P>=0){let R=Cr({scrollTop:x.scrollTop,viewport:x.clientHeight===0?480:x.clientHeight,rowHeight:Ue,index:P});R!==x.scrollTop&&(x.scrollTop=R,b(R)),G(P)}su(x),l?.()}},[t,e,l]);let _=x=>{b(x.currentTarget.scrollTop)},N=Rt(e,{scrollTop:g,height:f===0?480:f,rowHeight:Ue});return(0,I.jsx)("div",{className:"fx-scroll",ref:p,onScroll:_,onKeyDown:M,onContextMenu:T,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,I.jsx)("div",{className:"fx-vlist",style:{height:e.length*Ue},children:N.rows.map((x,P)=>{let R=(N.startIndex+P)*Ue;return x.type==="entry"?(0,I.jsx)(iu,{row:x,top:R,selected:x.path===n,cursor:h===N.startIndex+P,t:r,onToggle:o,onSelect:i,onRowActivate:fe,onContextMenu:(X,ee)=>S(X,{x:ee.clientX,y:ee.clientY},ee.currentTarget instanceof HTMLElement?ee.currentTarget:void 0)},x.path):(0,I.jsx)(au,{row:x,top:R,t:r,onRetry:a},x.key)})})})}var rt=require("react"),en=require("react/jsx-runtime");function es({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:c,focusSignal:d}){let u=(0,rt.useRef)(null),p=(0,rt.useRef)(d);(0,rt.useEffect)(()=>{p.current!==d&&(p.current=d,u.current?.focus())},[d]);let g=f=>{if(!f.nativeEvent.isComposing){if(f.key==="Escape"){f.preventDefault(),f.stopPropagation(),c();return}if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault(),a(f.key==="ArrowDown"?1:-1);return}f.key==="Enter"&&(f.preventDefault(),l())}},b=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,en.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:g,children:[(0,en.jsx)("input",{ref:u,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:f=>i(f.currentTarget.value)}),b===null?null:(0,en.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[b,o?(0,en.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,en.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,en.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:c,children:"\xD7"})]})}function Le(e){return e!==null&&typeof e=="object"}function or(e){try{return e()}catch{return}}function du(e){let n=or(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Le(n)?n.rpc:void 0;if(!(!Le(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Uo}/${r}`,o,i)}function lu(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function Ro(e){return Le(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function uu(e){return()=>{let n=du(e);if(n!==void 0)return lu(n);let t=or(()=>e.fsExplorerWorkspace);if(Ro(t))return t;let r=or(()=>Le(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Ro(r))return r;let o=or(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Ro(o))return o}}function hn(e){let n=Le(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Le(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Le(t)?t:void 0}var cu=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function xn(e){let n=Le(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:cu.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function fu(e){let n=hn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:xn(n.error)};let t=Le(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function pu(e){let n=hn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:xn(n.error)};let t=Le(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function mu(e){let n=hn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:xn(n.error)}:{ok:!0}}function yu(e){let n=hn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:xn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function gu(e){let n=hn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:xn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Nn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function hu(e){let n=hn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:xn(n.error)}:{ok:!0}}function xu(e){let n=hn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:xn(n.error)};let t=Le(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var ot={code:"unsupported",message:"the workspace service is unavailable"};function ns(e){let n=uu(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:ot});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),fu),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),pu),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),mu),create:(r,o,i,a,l)=>t(c=>{let d=c.create;return typeof d!="function"?{ok:!1,error:ot}:d.call(c,{sessionId:r,parent:o,name:i,kind:a},l)},yu),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:ot}:a.call(i,{sessionId:r},o)},gu),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:ot}:l.call(a,{sessionId:r,tree:o},i)},hu),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:ot}:a.call(i,{sessionId:r},o)},xu)}}var ku={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function bu(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var vu={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function wu(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let c=t[1]??"",d=ts(t[2]??"");return d===""?void 0:{base:`https://${c}/${d}`,host:c}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=ts(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function ts(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Su(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Ru(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Cu(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Cu(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function Tu(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function rs(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=Tu(t,r);if(a===void 0)return[];let l=Ru(i),c=Su(a),d=[],u=new Set;for(let p of n){if(u.has(p.name))continue;let g=wu(p.url);if(g===void 0)continue;u.add(p.name);let b=bu(g.host),f=vu[b][o],v=c===""?"":`/${c}`;d.push({id:`copy.remote.${p.name}`,label:`${p.name} \xB7 ${ku[b]}`,url:`${g.base}/${f}/${l}${v}`})}return d}var C=require("react/jsx-runtime");function Pu({open:e}){return(0,C.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,C.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,C.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function Eu(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Fu=()=>({status:"loading",nodes:[],truncated:!1,total:0});function To(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var as="dsh-fs-explorer.show-ignored";function Mu(e){if(e==null)return!0;try{return e.getItem(as)!=="0"}catch{return!0}}function Nu(e,n){if(n!=null)try{n.setItem(as,e?"1":"0")}catch{}}var Iu=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,is=new Map;function Lu(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function ir({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,C.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,C.jsx)("strong",{children:e}),n===void 0?null:(0,C.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Bu(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function ss({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:c,workspace:d,fileReferences:u}){let p=Ii();function g(b){let f=b.sessionId??e.currentSessionId(),v=(0,y.useRef)(f);v.current=f;let h=(0,y.useMemo)(()=>r(),[r]),G=(0,y.useMemo)(()=>o(),[o]),O=(0,y.useMemo)(()=>i(),[i]),Y=(0,y.useMemo)(()=>f===void 0||c===void 0?void 0:c(f),[c,f]),F=(0,y.useMemo)(()=>f===void 0||d===void 0?void 0:d(f),[d,f]),W=(0,y.useMemo)(()=>$a(F),[F]),[B,$]=(0,y.useState)(()=>gn(new Date().toISOString())),A=(0,y.useRef)(!1),[oe,fe]=(0,y.useState)(null),[S,T]=(0,y.useState)(null),M=(0,y.useRef)(!1),_=(0,y.useRef)(!1),[N,x]=(0,y.useState)(null),[P,R]=(0,y.useState)(null),[X,ee]=(0,y.useState)(void 0),[Be,nn]=(0,y.useState)(null),ye=(0,y.useRef)(null),[ie,Q]=(0,y.useState)(null),[z,Z]=(0,y.useState)(()=>new Map),[xe,Ae]=(0,y.useState)(void 0),[pe,ke]=(0,y.useState)(void 0),[Xe,ze]=(0,y.useState)(void 0),[tn,Ke]=(0,y.useState)(void 0),[it,Ln]=(0,y.useState)(is),be=(0,y.useRef)(z);be.current=z;let[rn,ve]=(0,y.useState)(()=>new Set),j=(0,y.useMemo)(()=>p.forSession(f),[p,f]),Te=(0,y.useSyncExternalStore)(j.subscribe,j.snapshot,j.snapshot),Bn=Te.panels.find(s=>s.key===Te.active),on=Bn?.path,An=Bn?.revision,[je,ur]=(0,y.useState)(0),de=(0,y.useRef)(new Map),Ye=(0,y.useRef)(void 0),[kn,De]=(0,y.useState)([]),[K,we]=(0,y.useState)(()=>Mu(To())),[ae,Me]=(0,y.useState)(null),[ms,Fo]=(0,y.useState)(!1),[ys,bn]=(0,y.useState)(null),at=(0,y.useRef)(null);at.current=ae?.path??null;let Ze=(0,y.useMemo)(()=>To(),[]),[an,vn]=(0,y.useState)(()=>Ka(Ze)),cr=(0,y.useRef)(null),wn=(0,y.useRef)(null),ne=z.get(""),st=ne?.status==="ready",Mo=(0,y.useCallback)((s,m,k,w)=>{j.open(s,m,k,w)},[j]),Sn=(0,y.useCallback)(s=>{let m=new Set(j.snapshot().panels.map(L=>L.key)),k=[];for(let L of s){if(!m.has(L))continue;if((f===void 0?void 0:l?.peek(f,L))?.dirty===!0){k.push(L);continue}f!==void 0&&l?.forget(f,L),j.close(L)}let w=k[0];bn(null),Me(w===void 0?null:{path:w,rest:k.slice(1)})},[l,f,j]),sn=(0,y.useCallback)(s=>{Me(null),bn(null),s.length>0&&Sn(s)},[Sn]),dn=(0,y.useCallback)(s=>{let m=s??j.snapshot().active??void 0;m!==void 0&&Sn([m])},[Sn,j]);(0,y.useEffect)(()=>{let s=e.registerPageCloser;if(typeof s=="function")return s(()=>{let m=Si({viewSessionId:f,currentSessionId:e.currentSessionId(),activePanel:j.snapshot().active,confirming:at.current!==null});return m==="close"&&dn(),m!=="pass"})},[dn,f,j,e]);let gs=(0,y.useCallback)(()=>{let s=ae;if(s===null)return;let m=f===void 0?void 0:l?.find(f,s.path);if(m===void 0){f!==void 0&&l?.forget(f,s.path),j.close(s.path),sn(s.rest);return}Fo(!0),bn(null),m.save().then(k=>{if(Fo(!1),!k.ok){let w=m.getSnapshot().error;bn(t("panel.confirm.failed").replace("{message}",po(k.code,w?.message??"",t)));return}f!==void 0&&l?.forget(f,s.path),j.close(s.path),sn(s.rest)})},[sn,l,ae,f,j,t]),hs=(0,y.useCallback)(()=>{let s=ae;if(bn(null),s===null){Me(null);return}f!==void 0&&l?.forget(f,s.path),j.close(s.path),sn(s.rest)},[sn,l,ae,f,j]),fr=(0,y.useCallback)(()=>{let s=ae;if(s===null){bn(null);return}sn(s.rest)},[sn,ae]),le=(0,y.useCallback)(async(s,m,k)=>{de.current.get(s)?.abort();let w=new AbortController;de.current.set(s,w),Z(L=>new Map(L).set(s,Fu()));try{let L=await k.list(m,Ct(s),w.signal);if(w.signal.aborted||v.current!==m)return!1;let V=Zt(L);if(!V.ok)return Z(_e=>new Map(_e).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:V.message})),!1;let Ne=St(V.listing.entries);return Z(_e=>new Map(_e).set(s,{status:"ready",nodes:Ne,truncated:V.listing.truncated===!0,total:V.listing.entries.length})),!0}catch(L){return w.signal.aborted||Z(V=>new Map(V).set(s,{status:"failed",nodes:[],truncated:!1,total:0,message:la(L)})),!1}finally{de.current.get(s)===w&&de.current.delete(s)}},[]);(0,y.useEffect)(()=>{for(let s of de.current.values())s.abort();return de.current.clear(),Z(new Map),ve(new Set),Ye.current=void 0,f!==void 0&&h!==void 0&&le("",f,h),()=>{for(let s of de.current.values())s.abort();de.current.clear()}},[f,h,je,le]),(0,y.useEffect)(()=>{if(f===void 0||G===void 0){Ae(void 0),ke(void 0),ze(void 0),Ke(void 0);return}let s=!0,m=new AbortController;return Ae(void 0),ke(void 0),ze(void 0),Ke(void 0),Promise.resolve().then(()=>G.snapshot({sessionId:f,maxCommits:1},m.signal)).then(k=>{if(!s)return;let w=Qt(k);if(!w.ok){Ae(void 0),ke(void 0),ze(void 0),Ke(void 0);return}Ae(ti(xt(w.status),w.stats)),ke(w.head),ze(w.root),Ke(w.remotes)}).catch(()=>{s&&(Ae(void 0),ke(void 0),ze(void 0),Ke(void 0))}),()=>{s=!1,m.abort()}},[f,G,je]),(0,y.useEffect)(()=>{let s=h?.read;if(f===void 0||h===void 0||typeof s!="function"||!st){Ln(is);return}let m=f,k=new AbortController,w=async(V,Ne)=>{try{let _e=Lu(await s.call(h,m,Ne,{},k.signal));return _e===void 0?void 0:[V,_e]}catch{return}},L=ai.filter(V=>V!==".gitmodules").map(V=>w(V,V));return Xe!==void 0&&L.push(w(".gitmodules",`${Xe.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(L).then(V=>{if(k.signal.aborted||v.current!==m)return;let Ne=new Map;for(let un of V)un!==void 0&&Ne.set(un[0],un[1]);let _e=be.current.get(""),Ys=new Set(_e?.status==="ready"?_e.nodes.filter(un=>un.kind==="directory").map(un=>un.name):[]);Ln(vt(Ne,Ys))}),()=>k.abort()},[f,h,st,Xe,je]);let[xs,ks]=(0,y.useState)(void 0),pr=(0,y.useRef)(void 0),No=(0,y.useRef)(0),mr=(0,y.useRef)(void 0),Io=(0,y.useRef)(!1),Dn=(0,y.useCallback)((s,m,k)=>{No.current+=1,ks({nonce:No.current,...s===void 0?{}:{path:s},...m===void 0?{}:{delta:m},focus:k})},[]),Rn=(0,y.useCallback)((s,m)=>{let k=Fi(s);if(ve(w=>{let L=new Set(w);for(let V of k)L.add(V);return L}),!(f===void 0||h===void 0)){for(let w of k)be.current.get(w)===void 0&&le(w,f,h);m==="directory"&&be.current.get(s)===void 0&&le(s,f,h)}},[h,le,f]),Lo=(0,y.useCallback)(s=>{let m=Gn(be.current).find(k=>k.path===s);if(Rn(s,m?.kind),m?.kind==="directory"&&ve(k=>new Set(k).add(s)),Io.current=!0,m===void 0){mr.current=s;return}Dn(s,void 0,!0)},[Dn,Rn]),dt=(0,y.useCallback)(s=>{Kt(s,{open:Mo,reveal:Lo})},[Mo,Lo]);(0,y.useEffect)(()=>{let s=b.viewRequest;if(s==null||s.view!==ge)return;let m=`${s.view}:${s.focus}`;Ye.current!==m&&(Ye.current=m,dt(s.focus),b.completeViewRequest?.())},[b.viewRequest,b.completeViewRequest,dt]),(0,y.useEffect)(()=>{let s=e.viewFocus;if(s===void 0||f===void 0)return;let m=()=>{let k=s.take(ge);k!==void 0&&dt(k)};return m(),s.subscribe(m)},[e,f,dt]),(0,y.useEffect)(()=>{if(on===void 0||An!==void 0||!st||Tt(on))return;let s=Hn(on);if(s.length===0||(ve(k=>s.every(w=>k.has(w))?k:new Set([...k,...s])),f===void 0||h===void 0))return;let m=s.filter(k=>be.current.get(k)?.status!=="ready");m.length!==0&&Promise.all(m.map(k=>le(k,f,h)))},[on,An,st,f,h,le]);let Bo=(0,y.useCallback)(()=>{if(typeof document>"u")return!1;let s=document.querySelector("[data-composer-input]");return s===null?!1:(s.focus(),!0)},[]),bs=(0,y.useCallback)(s=>{if(s.button!==0||wn.current!==null||Iu())return;let m=cr.current?.previousElementSibling;if(m instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}wn.current={pointerId:s.pointerId,startX:s.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:an},document.body.classList.add("fx-pane-resizing")}},[an]),vs=(0,y.useCallback)(s=>{let m=wn.current;m===null||m.pointerId!==s.pointerId||vn(wo(m.baseWidth+s.clientX-m.startX))},[]),yr=(0,y.useCallback)(s=>{let m=wn.current;if(m===null||m.pointerId!==s.pointerId)return;wn.current=null,document.body.classList.remove("fx-pane-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let k=m.baseWidth+s.clientX-m.startX;if(_a(k,m.baseWidth)){vn(m.restWidth);return}vn(rr(Ze,k))},[Ze]),gr=(0,y.useCallback)(()=>{ja(Ze),vn(null)},[Ze]),ws=(0,y.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let m=Ha(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(m===null)return;if(s.preventDefault(),s.stopPropagation(),m.kind==="reset"){gr();return}if(m.kind==="min"||m.kind==="max"){let L=m.kind==="min"?180:520;vn(rr(Ze,L));return}let k=cr.current?.previousElementSibling,w=k instanceof HTMLElement?k.getBoundingClientRect().width:an??180;vn(rr(Ze,w+m.delta))},[Ze,gr,an]);(0,y.useEffect)(()=>()=>{wn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=m=>{if(!(m.isComposing||wi(m.target))){if(Bu(m)){let k=j.snapshot().active,w=k===null||l===void 0||f===void 0?void 0:l.find(f,k);if(w===void 0)return;m.preventDefault(),m.stopPropagation(),w.save();return}for(let k of Bt)if(vi(m,k)){if(k.action==="closePanel"&&j.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),k.action==="nextPanel"?j.next():k.action==="previousPanel"?j.previous():dn();return}}};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[l,dn,f,j]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let s=Dt({focusComposer:Bo,hasModal:()=>at.current!==null||M.current||_.current||At(document)}),m=k=>s(k);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Bo]),(0,y.useEffect)(()=>{if(ae===null||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),fr())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[ae,fr]);let Ao=(0,y.useMemo)(()=>gt(kn),[kn]),lt=(0,y.useMemo)(()=>Et(z,rn,xe,it,{ignored:Ao,showIgnored:K,hiddenLabel:s=>t("state.hiddenDirectory").replace("{count}",String(s))}),[z,rn,xe,it,Ao,K,t]),[Qe,Do]=(0,y.useState)(""),[Oo,ut]=(0,y.useState)([]),[Wo,ct]=(0,y.useState)(null),[Ss,On]=(0,y.useState)(!1),[Rs,Cs]=(0,y.useState)(0),Ts=(0,y.useCallback)(()=>Cs(s=>s+1),[]);(0,y.useEffect)(()=>{let s=Pi(Qe);if(s===void 0){ut([]),ct(null),On(!1);return}let m=()=>{let L=Ei(Gn(be.current),s);ut(jr(L.map(V=>({path:V.path,kind:V.kind==="directory"?"directory":"file"})),xe)),ct("loaded"),On(!1)},k=u?.();if(k===void 0||f===void 0){m();return}let w=new AbortController;return On(!0),Promise.resolve(k.list(f,s,w.signal)).then(L=>{if(w.signal.aborted)return;let V=Ti(L);ut(jr(V,xe)),ct("index"),On(!1)},L=>{w.signal.aborted||(console.debug(`[${Se}] the file index failed, searching listed rows instead`,L),m())}),()=>w.abort()},[Qe,f,xe,u]);let hr=Wo!==null,Ps=hr?Oo:lt;(0,y.useEffect)(()=>{let s=mr.current;if(s===void 0)return;let m=Gn(be.current).find(k=>k.path===s);m!==void 0&&(mr.current=void 0,m.kind==="directory"&&(Rn(s,m.kind),ve(k=>new Set(k).add(s))),Dn(s,void 0,!0))},[lt,Dn,Rn]);let[Es,ft]=(0,y.useState)(void 0),$o=(0,y.useRef)(!1);(0,y.useEffect)(()=>{if($o.current||typeof document>"u")return;let s=ci({rows:lt,panelCount:j.snapshot().panels.length,hasModal:At(document)});s.kind!=="skip"&&($o.current=!0,!Io.current&&(s.open!==void 0&&j.open(s.open),ft({path:s.focus})))},[lt,j]);let Fs=(0,y.useCallback)(()=>ft(void 0),[]),Wn=xe===void 0?void 0:Object.keys(xe).length,Ms=xe===void 0?"neutral":Object.values(xe).some(s=>s.status==="conflicted")?"conflict":Wn===0?"success":"warning",zo=ni(pe),Ns=(0,y.useCallback)(s=>{if(f===void 0||h===void 0)return;if(rn.has(s)){ve(k=>{let w=new Set(k);return w.delete(s),w});return}ve(k=>new Set(k).add(s));let m=z.get(s);(m===void 0||m.status==="failed")&&le(s,f,h)},[rn,z,f,h,le]),Ko=(0,y.useCallback)(s=>{f===void 0||h===void 0||le(s,f,h)},[f,h,le]);(0,y.useEffect)(()=>{let s=!0;if(A.current=!1,f===void 0){$(gn(new Date().toISOString()));return}return W.load(f).then(m=>{s&&!A.current&&$(m)}).catch(()=>{}),()=>{s=!1}},[W,f]);let Is=(0,y.useCallback)(s=>{let m=[...Hn(s),s];if(ve(k=>{let w=new Set(k);for(let L of m)w.add(L);return w}),f!==void 0&&h!==void 0){let k=m.filter(w=>be.current.get(w)?.status!=="ready");k.length>0&&Promise.all(k.map(w=>le(w,f,h)))}ft({path:s})},[f,h,le]),Ls=(0,y.useCallback)(s=>{j.open(s)},[j]),te=(0,y.useCallback)((s,m)=>{ye.current!==null&&clearTimeout(ye.current),nn({text:s,tone:m}),ye.current=setTimeout(()=>{ye.current=null,nn(null)},4e3)},[]);(0,y.useEffect)(()=>()=>{ye.current!==null&&clearTimeout(ye.current)},[]);let ln=(0,y.useCallback)(s=>{A.current=!0,$(s),f!==void 0&&W.save(f,s).catch(()=>{te(t("bookmarks.saveFailed"),"error")})},[te,W,f,t]),Bs=(0,y.useCallback)(s=>{try{ln(Na(B,s.id).tree),te(t("bookmarks.removed"),"ok")}catch{}},[te,B,ln,t]),As=(0,y.useCallback)((s,m)=>{try{ln(Ba(B,s,m))}catch{}},[B,ln]);(0,y.useEffect)(()=>{if(F===void 0){ee(void 0);return}let s=!0;return F.capabilities(f??"").then(m=>{s&&ee(m.ok?m.capabilities:void 0)}),()=>{s=!1}},[F,f]),(0,y.useEffect)(()=>{let s=F?.ignored;if(f===void 0||F===void 0||typeof s!="function"){De([]);return}let m=new AbortController,k=!0;return Promise.resolve().then(()=>s.call(F,f,m.signal)).then(w=>{k&&De(w.ok?w.entries:[])}).catch(()=>{k&&De([])}),()=>{k=!1,m.abort()}},[f,F,je]);let Ds=(0,y.useCallback)(()=>{we(s=>{let m=!s;return Nu(m,To()),m})},[]),Os=(0,y.useCallback)((s,m,k)=>{let w=s===void 0?"":s.kind==="directory"?s.path:ga(s.path);if(x({row:s,anchor:m,absolutePath:void 0,trigger:k,createParent:w}),s===void 0||F===void 0)return;let L=s.path;F.info(f??"",L).then(V=>{x(Ne=>Ne===null||Ne.row?.path!==L?Ne:{...Ne,absolutePath:V.ok?V.info.absolutePath:void 0})})},[f,F]),Ws=(0,y.useCallback)(()=>x(null),[]),$s=(0,y.useCallback)((s,m,k)=>{R({key:s,anchor:m,trigger:k})},[]),zs=(0,y.useCallback)(()=>R(null),[]),Ks=(0,y.useCallback)(s=>{let m=P;if(R(null),m===null)return;if(s===yn.close){dn(m.key);return}let k=s===yn.closeOthers?"others":s===yn.closeRight?"right":void 0;k!==void 0&&Sn(Ni(j.snapshot().panels,m.key,k))},[Sn,dn,j,P]);M.current=N!==null,_.current=P!==null;let pt=(0,y.useMemo)(()=>rs({remotes:tn,root:Xe,absolutePath:N?.absolutePath,kind:N?.row?.kind??"file",head:pe}),[N?.absolutePath,N?.row?.kind,Xe,pe,tn]),xr=(0,y.useCallback)(s=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${s.code}`)),[t]),js=(0,y.useCallback)(s=>{let m=N;if(x(null),m===null)return;if(s===se.createFile||s===se.createFolder){let w=m.createParent;if(w===void 0)return;Q({kind:s===se.createFolder?"directory":"file",parent:w,error:void 0,busy:!1});return}let k=m.row;if(k!==void 0){if(s.startsWith(`${se.copyRemote}.`)){let w=pt.find(L=>L.id===s);if(w===void 0)return;mn(w.url).then(L=>{te(L?t("notice.copiedRemote").replace("{remote}",w.label):t("notice.copyFailed"),L?"ok":"error")});return}if(s===se.copyRelative){mn(k.path).then(w=>{te(t(w?"notice.copiedRelative":"notice.copyFailed"),w?"ok":"error")});return}if(s===se.copyAbsolute){let w=m.absolutePath;if(w===void 0)return;mn(w).then(L=>{te(t(L?"notice.copiedAbsolute":"notice.copyFailed"),L?"ok":"error")});return}if(s===se.addBookmark){fe({mode:"add",target:{name:k.name,path:k.path,kind:k.kind}});return}if(s===se.reveal){if(F===void 0){te(xr({code:"unsupported",message:""}),"error");return}F.reveal(f??"",k.path).then(w=>{if(!w.ok){te(xr(w.error),"error");return}let L=t(`menu.manager.${X?.fileManager??"directory"}`);te(t("notice.revealed").replace("{manager}",L),"ok")})}}},[te,X,N,pt,xr,f,t,F]),_s=(0,y.useCallback)(s=>{let m=ie;if(m===null)return;if(F===void 0||F.create===void 0){Q({...m,error:t("prompt.error.unsupported"),busy:!1});return}let k=f;if(k===void 0){Q({...m,error:t("prompt.error.no-workspace"),busy:!1});return}Q({...m,busy:!0,error:void 0}),F.create(k,m.parent,s,m.kind).then(w=>{if(!w.ok){Q(V=>V===null?V:{...V,busy:!1,error:t(`prompt.error.${w.error.code}`)});return}Q(null);let L=w.path;if(h!==void 0&&le(m.parent,k,h),m.kind==="file"){j.open(L),te(t("notice.createdFile"),"ok");return}ve(V=>new Set(V).add(L)),h!==void 0&&le(L,k,h),ft({path:L}),te(t("notice.createdFolder"),"ok")})},[te,h,le,ie,f,j,t,F]),Hs=(0,y.useCallback)(()=>Q(null),[]),Gs=(0,y.useMemo)(()=>N===null?[]:ha({row:N.row,notices:{workspace:F!==void 0},capabilities:X,absolutePath:N.absolutePath,createParent:N.createParent,remoteLinks:N.row===void 0?void 0:pt,bookmarkTarget:N.row===void 0?void 0:{name:N.row.name,path:N.row.path,kind:N.row.kind}},t),[X,N,pt,t,F]),jo=(0,y.useMemo)(()=>P===null?[]:xa({panels:Te.panels,key:P.key},t),[Te.panels,t,P]),kr=(0,y.useCallback)(s=>{let m=Gn(be.current).find(k=>k.path===s);if(Rn(s,m?.kind),m?.kind==="directory"){ve(k=>new Set(k).add(s));return}j.open(s)},[Rn,j]),Vs=(0,y.useCallback)(()=>{pr.current!==void 0&&kr(pr.current)},[kr]),mt=(0,y.useCallback)(()=>{Do(""),ut([]),ct(null),On(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,y.useEffect)(()=>{if(Qe===""||typeof document>"u")return;let s=m=>{m.key!=="Escape"||m.isComposing||m.defaultPrevented||at.current!==null||At(document)||(m.preventDefault(),m.stopPropagation(),mt())};return document.addEventListener("keydown",s,!0),()=>document.removeEventListener("keydown",s,!0)},[Qe,mt]);let qs=()=>ve(new Set),Us=()=>ur(s=>s+1),Xs=f===void 0?"no-session":h===void 0?"no-service":ne===void 0||ne.status==="loading"?"loading":ne.status==="failed"?"failed":ne.nodes.length===0?"empty":"tree";return(0,C.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Xs,"data-session":f??"","data-testid":"fs-explorer-view",children:[(0,C.jsxs)("header",{className:"fx-head",children:[(0,C.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,C.jsx)(So,{open:!0})}),(0,C.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,C.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,C.jsx)(wa,{tree:B,t,onOpenFile:Ls,onOpenFolder:Is,onCreateGroup:s=>T({mode:"group",parentId:s}),onRename:s=>T({mode:"rename",node:s}),onRemove:Bs,onMove:s=>fe({mode:"move",node:s}),onReorder:As}),(0,C.jsxs)("div",{className:"fx-head-meta",children:[ne?.status==="ready"?(0,C.jsxs)("span",{children:[(0,C.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}):null,kn.length===0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":K?"true":"false","aria-pressed":K,title:t(K?"head.hideIgnored":"head.showIgnored"),"aria-label":t(K?"head.hideIgnored":"head.showIgnored"),onClick:Ds,children:(0,C.jsx)(Pu,{open:K})}),(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":Qe===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":Qe!=="",onClick:()=>{Qe!==""?mt():Ts()},children:(0,C.jsx)(Za,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:rn.size===0,onClick:qs,children:(0,C.jsx)(Qa,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:f===void 0||h===void 0||ne?.status==="loading",onClick:Us,children:(0,C.jsx)(Ya,{})})]})]}),Be===null?null:(0,C.jsx)("div",{className:"fx-notice",role:"status","data-tone":Be.tone,"data-testid":"fx-notice",children:Be.text}),(0,C.jsx)("div",{className:"fx-main",children:f===void 0?(0,C.jsx)(ir,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):h===void 0?(0,C.jsx)(ir,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ne===void 0||ne.status==="loading"?(0,C.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ne.status==="failed"?(0,C.jsx)(ir,{title:t("state.failed.title"),description:ne.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Ko(""),testId:"fs-failed"}):ne.nodes.length===0?(0,C.jsx)(ir,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)("div",{className:"fx-tree-pane",style:an===null?void 0:{"--fx-tree-width":`${an}px`},children:[(0,C.jsx)(es,{t,value:Qe,origin:Wo,count:Oo.length,busy:Ss,onChange:Do,onStep:s=>Dn(void 0,s,!1),onActivate:Vs,onClose:mt,focusSignal:Rs}),(0,C.jsx)(Ja,{rows:Ps,selectedPath:An===void 0?on:void 0,entryFocus:hr?void 0:Es,t,onToggle:Ns,onSelect:s=>hr?kr(s):j.open(s),onRetry:Ko,onEntryFocusSettled:Fs,onContextMenu:Os,cursorRequest:xs,onCursorMove:s=>{pr.current=s}})]}),(0,C.jsx)("div",{ref:cr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":an??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:bs,onPointerMove:vs,onPointerUp:yr,onPointerCancel:yr,onLostPointerCapture:yr,onKeyDown:ws,onDoubleClick:gr}),(0,C.jsxs)("div",{className:"fx-editor",children:[(0,C.jsx)(Li,{panels:Te.panels,active:Te.active,t,onActivate:s=>j.activate(s),onClose:dn,onStep:s=>s===1?j.next():j.previous(),onTabMenu:$s,documents:l,sessionId:f}),ae===null?null:(0,C.jsx)(Bi,{name:zt(ae.path),t,saving:ms,error:ys,onSave:gs,onDiscard:hs,onCancel:fr}),(0,C.jsx)("div",{className:"fx-editor-body",children:Te.panels.length===0?(0,C.jsx)(Ai,{t}):Te.panels.map((s,m)=>{let k=s.key===Te.active;return(0,C.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!k,"data-line":s.line,"data-testid":"fs-panel",children:(0,C.jsx)(pa,{sessionId:f,files:h,path:s.path,revision:s.revision,git:O,t,visible:k,renderers:a,documents:l,locate:Y})},s.key)})})]})]})}),N===null?null:(0,C.jsx)(yo,{entries:Gs,anchor:N.anchor,onSelect:js,onClose:Ws,...N.trigger===void 0?{}:{returnFocus:()=>N.trigger??null}}),P===null||jo.length===0?null:(0,C.jsx)(yo,{entries:jo,anchor:P.anchor,onSelect:Ks,onClose:zs,returnFocus:()=>P.trigger}),ie===null?null:(0,C.jsx)(tt,{kind:ie.kind,parent:ie.parent,t,error:ie.error,busy:ie.busy,onSubmit:_s,onCancel:Hs}),oe===null?null:(0,C.jsx)(Da,{tree:B,target:oe.mode==="add"?oe.target:void 0,t,mode:oe.mode,...oe.mode==="move"?{node:oe.node}:{},onCommit:s=>{let m=oe.mode;ln(s),fe(null),te(t(m==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>fe(null)}),S===null?null:(0,C.jsx)(tt,{kind:"directory",parent:"",t,initialName:S.mode==="rename"?S.node.name:t("bookmarks.newGroup"),titleKey:S.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:s=>{let m=S;T(null);try{if(m.mode==="rename"){ln(Ia(B,m.node.id,s)),te(t("bookmarks.renamed"),"ok");return}let k=Qn("group",{id:Eu(),name:s,createdAt:Date.now()});ln(nt(B,m.parentId,k)),te(t("bookmarks.groupCreated"),"ok")}catch{te(t("bookmarks.saveFailed"),"error")}},onCancel:()=>T(null)}),ne?.status==="ready"?(0,C.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,C.jsxs)("span",{children:[t("view.scope")," ",(0,C.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}),ne.truncated?(0,C.jsx)("span",{className:"fx-foot-warn",children:_n({entries:ne.nodes,truncated:!0,total:ne.total}).label}):null,(0,C.jsxs)("span",{className:"fx-foot-git","data-state":Wn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,C.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Ms,"aria-hidden":"true"}),Wn===void 0?t("status.unavailable"):Wn===0?t("status.clean"):t("status.summary").replace("{count}",String(Wn))]}),zo===null?null:(0,C.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[zo,pe?.upstream!==void 0&&(pe.ahead??0)>0?(0,C.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(pe.ahead)}`}):null,pe?.upstream!==void 0&&(pe.behind??0)>0?(0,C.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(pe.behind)}`}):null]}),(0,C.jsx)("span",{className:"fx-spacer"}),(0,C.jsx)("span",{children:t("foot.order")})]}):null]})}return g}var ls=["slots","locale","workbench","remote"];function Du(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var ar,sr,Po,dr,Eo,us;function ds(e){return Eo=e,dr!==void 0||(dr=bi({open:(n,t,r)=>{let o=Eo;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):xi(o)(n,t,r)},save:(n,t)=>{let r=Eo;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ki(r)(n,t)}})),dr}function Ou(){if(Po!==void 0)return Po;let e=Xt({warn:n=>us?.(n)});for(let n of mo())e.register(n);return Po=e,e}var lr;function cs(e){let n=e.workbench;if(n==null)return()=>{};us=u=>e.logger?.warn?.(u);let t=Ou(),r={version:Qi,renderers:t,registerRenderer:u=>t.register(u),documents:ds(e)};sr?.();let o=e.provide?.(oo,r);o===void 0&&e.logger?.warn?.(`${Kn}: ctx.provide unavailable, ${oo} service not registered`),sr=o,ar?.();let i=e.locale.register(Kn,{zh:{...Br,...Hr.zh,...fo.zh},en:{...Ar,...Hr.en,...fo.en}});ar=i;let a=e.locale.bind(Kn),l=ya(typeof document>"u"?void 0:document),c=ss({workbench:n,version:n.version,t:a,files:oa(e),status:ua(e),git:sa(e),renderers:t,documents:ds(e),locate:u=>hi(e,u),workspace:()=>ns(e),fileReferences:Ci(e)});lr?.();let d=Lr(e,n);return lr=d,e.slots.inject(vr,()=>e.slots.register({name:vr,id:ge,order:100,label:()=>Dr(Du(e)),locale:Kn},c)),()=>{o?.(),sr===o&&(sr=void 0),d(),lr===d&&(lr=void 0),l(),i(),ar===i&&(ar=void 0)}}var fs={buildTree:St,describeListing:_n,iconFor:Cn,computeTreeWindow:Rt,flattenTree:Et,badgeFor:Tn,formatSize:Ft,joinPath:Pn,listingPath:Ct,parseFocus:Pt,consumeViewRequest:Kt,createPanelStack:_r,createEscapeHandler:Dt,KEYMAP:Bt,tabLabel:Dr,indexIgnoredPaths:gt,isIgnoredPath:ht,normalizeListing:Zt,normalizeStatusSnapshot:Qt,buildWorkspaceMap:vt,workspaceTagFor:wt,parseStatusZ:xt,statusTone:jn,statusBadge:kt,createPreviewLoader:_t,renderMarkdown:jt,languageFor:Un,isMarkdownFile:Xn,describePage:Ht,classifyPreviewFailure:pn,normalizePreviewPage:Mn,previewChunkRoute:ji,canBridgeFile:Mt,decideBridge:Nr,focusForFileAddress:Mr,forwardFocus:Ir,registerAddressBridge:Lr},ps={name:"dsh-fs-explorer",inject:ls,apply:cs,__test:fs};function Wu(e){Gi(e),Ki(e)}var $u=ps;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
