window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var cr=Object.defineProperty;var Cs=Object.getOwnPropertyDescriptor;var Ts=Object.getOwnPropertyNames;var Es=Object.prototype.hasOwnProperty;var Ps=(e,n)=>{for(var t in n)cr(e,t,{get:n[t],enumerable:!0})},Fs=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ts(n))!Es.call(e,o)&&o!==t&&cr(e,o,{get:()=>n[o],enumerable:!(r=Cs(n,o))||r.enumerable});return e};var Ns=e=>Fs(cr({},"__esModule",{value:!0}),e);var uu={};Ps(uu,{__test:()=>Va,apply:()=>Ga,boot:()=>du,clientPlugin:()=>qa,default:()=>lu,inject:()=>_a});module.exports=Ns(uu);var vn=require("react");var Po="dsh-resource://file/";function Fo(e){try{return decodeURIComponent(e)}catch{return e}}function Bn(e){if(!e.startsWith(Po))return null;let n=e.slice(Po.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Fo(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),d=a<0?i:i.slice(0,a);return d.length===0?null:{sessionId:o,path:d.split("/").map(Fo).join("/")}}function _e(e){return e.slice(e.lastIndexOf("/")+1)}var No=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title"},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title"}];function Mo(){return No.flatMap(e=>[...e.extensions])}function Ln(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return No.find(o=>o.extensions.includes(r))?.family??null}var we="dsh-fs-explorer",fr="conversation.view",be="fs-explorer";var An="fs-explorer",Bo="fsExplorerDocuments",Lo="fsExplorerWorkspace",Ao="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",pr={chunk:"client.preview.js"},at={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};var Ms={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Bs={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Ls=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Do(e){return typeof e=="string"&&Ls.has(e)}function Io(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function As(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function st(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Io(o.slice(2),i==="1"?7:8);if(a===null)continue;let d=a.fields[0]??"",c=a.rest;if(c===""||d.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[c]={status:"renamed"};continue}n[c]={status:As(d[0]??".",d[1]??".")};continue}if(i==="u"){let a=Io(o.slice(2),9);if(a===null)continue;let d=a.rest;if(d==="")continue;n[d]={status:"conflicted"}}}}return n}function In(e){return Do(e)?Ms[e]:"neutral"}function dt(e){return Do(e)?Bs[e]:"?"}function mr(e){return`status.${e}`}function lt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Oo(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Wo(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Ko(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Is=["conflicted","deleted","renamed","added","modified","untracked"];function Ds(e){return In(Is.find(n=>e.has(n))??"modified")}function zo(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),d=r.endsWith("/")?a.length:a.length-1,c="";for(let s=0;s<d;s+=1){let u=a[s];if(u===void 0||u==="")continue;c=c===""?u:`${c}/${u}`;let f=n.get(c);f===void 0?n.set(c,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Ds(o.present)});return t}var _o=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Ho=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Os(e){return Ho.test(e)?e.slice(0,e.indexOf("/")):null}function Ws(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ks(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Ws(i[2]??"");a!==""&&Ho.test(a)&&t.push(a)}return t}function zs(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let d=/^\[(.+)\]$/u.exec(a);if(d!==null){o(),r=/^submodule(\s|$)/u.test(d[1]??"");continue}if(!r)continue;let c=/^path\s*=\s*(.*)$/u.exec(a);c!==null&&(t=(c[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function jo(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function $o(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function ut(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let d of zs(r))t.set(d,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let d of Ks(i))o.add(d);let a=e.get("package.json");if(typeof a=="string"){let d=jo(a);if(d!==void 0){let c=d.workspaces,s=c!==null&&typeof c=="object"&&!Array.isArray(c)?c.packages:void 0;for(let u of $o(Array.isArray(c)?c:s))o.add(u)}}for(let d of["turbo.json","lerna.json"]){let c=e.get(d);if(typeof c!="string")continue;let s=jo(c);if(s!==void 0)for(let u of $o(s.packages))o.add(u)}for(let d of o){let c=Os(d);c!==null&&n.has(c)&&t.set(d,"package")}return t}function ct(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var js=new Set(["node_modules",".git","dist","__pycache__"]);function $s(e){return js.has(e)}function _s(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ft(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||$s(r))continue;let o=_s(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Hs=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Gs=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Vs=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),qs=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Us=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Xs=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Ys=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Go(e){let n=_e(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function kn(e,n="file"){if(n==="directory")return"folder";let t=_e(e.toLowerCase());if(Ys.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Go(t);return r===""?"file":Hs.has(r)?"code":Gs.has(r)?"markdown":Vs.has(r)?"data":qs.has(r)?"image":Us.has(r)?"style":Xs.has(r)?"archive":"file"}var Zs={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Qs={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function hn(e){let n=_e(e.toLowerCase()),t=Zs[n];if(t!==void 0)return t;let r=Go(n),o=Qs[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Dn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Ao} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function pt(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,n.scrollTop)/t)-o,c=Math.min(Math.max(d,0),a),s=Math.min(e.length,c+i+o*2);return{rows:e.slice(c,s),startIndex:c,endIndex:s}}function gr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function mt(e){return e===""?".":e}function yt(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function bn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function On(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=bn(r,o),t.push(r);return t}function yr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function gt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let c=yr(t[2]),s=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return s===""||c<1?void 0:{path:s,line:c,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let c=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return c===""?void 0:{path:c,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let c=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return c===""?void 0:{path:c,line:yr(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let d=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(d!=="")return{path:d,line:yr(i[2]),absolute:!1}}function Vo(e){return e.selectionMoved?!0:e.cursorPath===void 0}function qo(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function xt(e,n,t,r){let o=[],i=zo(t),a=(d,c)=>{let s=e.get(d);if(!(s===void 0||s.status!=="ready"))for(let u of s.nodes){let f=bn(d,u.name),m=u.kind==="directory",b=m&&n.has(f),p=m||t===void 0?void 0:t[f],v=p?.status??(m?void 0:lt(f,t)),x=p===void 0?void 0:Oo(p),V=m?i.get(f):void 0,z=m?ct(r,f):void 0;if(o.push({type:"entry",path:f,name:u.name,kind:u.kind,depth:c,expanded:b,...u.size===void 0?{}:{size:u.size},...v===void 0?{}:{status:v},...V===void 0?{}:{statusCount:V.count,statusTone:V.tone},...x===void 0?{}:{diff:x},...z===void 0?{}:{tag:z}}),!b)continue;let q=e.get(f);if(q===void 0||q.status==="loading"){o.push({type:"status",key:`${f}:loading`,path:f,depth:c+1,state:"loading"});continue}if(q.status==="failed"){o.push({type:"status",key:`${f}:failed`,path:f,depth:c+1,state:"failed",message:q.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(q.nodes.length===0){o.push({type:"status",key:`${f}:empty`,path:f,depth:c+1,state:"empty"});continue}a(f,c+1),q.truncated&&o.push({type:"status",key:`${f}:truncated`,path:f,depth:c+1,state:"truncated",label:Dn({entries:q.nodes,truncated:!0,total:q.total}).label})}};return a("",0),o}var Js=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function ed(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function nd(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Js.has(ed(n.path)))}function Uo(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=nd(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function kt(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var xr="dsh-fs-explorer:bridge",td="fs-explorer-bridge",Qo="dsh-resource://file/**",kr="sidebar.right.pane.tab",rd=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),od=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),id=new Set(["makefile","dockerfile","license","readme","changelog"]),ad=new Set([...Mo(),...rd]);function sd(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function ht(e){if(typeof e!="string"||e==="")return!1;let n=_e(e).toLowerCase();if(n==="")return!1;let t=sd(n);return od.has(t)?!1:id.has(n)?!0:ad.has(t)}function dd(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function ld(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function vr(e,n){if(typeof e!="string")return;let t=Bn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=ld(n,dd(e));return`${yt(r)?"abs:":"path:"}${r}:${String(o)}`}function wr(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Bn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!ht(r.path))return{action:"keep",reason:"refused"};let o=vr(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function He(e,n){n===void 0?console.warn(`[${we}] ${e}`):console.warn(`[${we}] ${e}`,n)}function ud(e){console.debug(`[${we}] ${e}`)}function hr(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function br(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function an(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Xo(e){return an(()=>e.sidebarRightTabs,hr)??an(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,hr)}function Yo(e){return an(()=>e.sidebarRight,br)??an(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,br)}function Zo(e){return typeof e=="function"?e:()=>{}}var cd="dsh-resource://file/session/probe/src/main.ts";function fd(e){let n=an(()=>(typeof e.candidates=="function"?e.candidates(cd):[]).filter(r=>r.priority==="extension"&&r.id!==xr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&He(`another extension-band tab type already claims ${Qo}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function pd(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function md(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function yd(e,n){let t=e.viewFocus;if(t?.request?.(be,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(be,n);return(!r.opened||r.focused)&&t?.take(be),r}return typeof e.openView=="function"&&e.openView(be,n)?(t?.take(be),{opened:!0,focused:!0}):(t?.take(be),{opened:!1,focused:!1})}function Sr(e,n,t,r){let o;try{o=yd(e,r)}catch(i){return He("the file workbench threw while switching views",i),e.viewFocus?.take(be),!1}if(!o.opened)return He(`the file workbench did not switch to ${be}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return He("the forwarded tab could not be closed",i),!1}}function gd(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,d=pd(i),c=md(i),s=(0,vn.useRef)(void 0);return(0,vn.useEffect)(()=>{if(a===void 0){He("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let u=wr(d,e.currentSessionId(),c);if(u.action!=="open"){He(`left the forwarded tab standing (${u.reason})`,d);return}Sr(e,n,a,u.focus)},[a,d,c]),null}return function(o){return typeof o.useTabInfo!="function"?(He(`the host did not inject useTabInfo into ${kr}; the bridge cannot forward`),null):(0,vn.createElement)(t,{useTabInfo:o.useTabInfo})}}function Rr(e,n){let t=(d,c)=>{if(d===void 0||c===void 0)return;fd(d);let s;try{s=d.register({id:xr,kind:td,patterns:[Qo],priority:"extension",canOpen:m=>{let b=Bn(m);return b!==null&&ht(b.path)},title:m=>_e(Bn(m)?.path??m)||m})}catch(m){He("the sidebar right refused the address bridge tab type",m);return}let u=gd(n,c),f;try{f=Zo(e.slots.inject(kr,()=>e.slots.register({name:kr,key:xr},u)))}catch(m){s(),He("the sidebar right refused the address bridge body",m);return}return()=>{f(),s()}},r=Xo(e),o=Yo(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return ud("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],d=>{let c=an(()=>d.get?.("sidebarRightTabs"),hr)??Xo(d),s=an(()=>d.get?.("sidebarRight"),br)??Yo(d);return t(c,s)});return Zo(a)}var Cr={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u53EA\u6709\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Tr={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the current page only","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Er(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Cr:Tr)["tab.label"]??"Files"}var xd=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ve(e){return e!==null&&typeof e=="object"}function vt(e,n){return{ok:!1,code:e,message:n}}function wt(e){let n=ve(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return vt(t,r)}function Pr(){return vt("invalid-response","the document service answered an invalid response")}function bt(e){try{return e()}catch{return}}function kd(e){let n=ve(e)?e:void 0;if(n===void 0)return Pr();if(n.ok===!1)return wt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ve(t)?t:void 0;if(r===void 0)return Pr();if(r.ok===!1)return wt(r.error);let o=ve(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Pr():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function hd(e){let n=ve(e)?e:void 0;if(n===void 0)return Jo();if(n.ok===!1)return wt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ve(t)?t:void 0;if(r===void 0)return Jo();if(r.ok===!1)return wt(r.error);let o=ve(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Jo(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Fr(e){return ve(e)&&typeof e.open=="function"}function bd(e){let n=bt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ve(n)?n.rpc:void 0;if(!(!ve(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Bo}/${r}`,o,i)}function vd(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function wd(e){let n=ve(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=ve(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=ve(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function ei(e,n){let t=Mr(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return wd(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function Mr(e){return()=>{let n=bt(()=>e.fsExplorerDocuments);if(Fr(n))return n;let t=bt(()=>ve(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Fr(t))return t;let r=bt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Fr(r))return r;let o=bd(e);if(o!==void 0)return vd(o)}}function ni(e){let n=Mr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return vt("unavailable","the document service is unavailable");try{return kd(await i.open({sessionId:t,path:r},o))}catch(a){return vt("io-error",a instanceof Error?a.message:String(a))}}}function ti(e){let n=Mr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return hd(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function ri(e){let n=new Map,t=new Set,r=0,o=(d,c)=>`${d}\0${c}`,i=()=>{r+=1;for(let d of[...t])d()},a=(d,c)=>n.get(o(d,c))?.session;return{acquire(d,c){let s=o(d,c),u=n.get(s);return u===void 0&&(u={session:new Nr(d,c,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,u),i()),u.session.retain(),u.session},peek(d,c){return a(d,c)?.getSnapshot()},find:a,forget(d,c){n.get(o(d,c))?.session.abandon()},subscribe(d){return t.add(d),()=>{t.delete(d)}},revision:()=>r}}var Nr=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=xd;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var St=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Sd(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function oi(e,n,t=Sd()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===d}function ii(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Rd(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Rt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Ct(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Rd(n),e.onClose?.()}}function ai(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function Tt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Et(e){try{return e()}catch{return}}function si(e){return()=>{let n=Et(()=>e.fileReferences);if(Tt(n))return n;let t=Et(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(Tt(t))return t;let r=Et(()=>e.remote?.fileReferences);if(Tt(r))return r;let o=Et(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return Tt(o)?o:void 0}}function di(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function li(e){let n=e.trim();return n===""?void 0:n}function Br(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,d=a==="file"?lt(i,n):void 0,c=Cd(i);t.push({type:"entry",path:i,name:ai(i),kind:a,depth:0,expanded:!1,...d===void 0?{}:{status:d},...c===""?{}:{directory:c}})}return t}function Cd(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function Wn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:bn(t,o.name),kind:o.kind});return n}function ui(e,n){let t=n.toLowerCase();return e.filter(r=>ai(r.path).toLowerCase().includes(t))}function ci(e){return On(e)}var wn=require("react");function Ft(e){let n=_e(e);return n===""?e:n}function Pt(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Td=Object.freeze({panels:Object.freeze([]),active:null});function fi(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Ed=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Lr(){let e=[],n=null,t=Td,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(u=>u.key===s),a=s=>e.findIndex(u=>u.revision===void 0&&u.key===s),d=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let u=Ed.exec(s);if(u!==null){let b=(u[1]??"").toLowerCase(),p=Pt(u[2]??"",!1);if(p===void 0)return;let v=fi(p,b);return i(v)>=0?v:void 0}let f=Pt(s,!0);if(f===void 0)return;if(a(f)>=0)return f;let m=Pt(s,!1);if(!(m===void 0||m===f))return a(m)>=0?m:void 0},c=s=>{if(e.length===0)return;let u=n===null?-1:i(n),f=e[(u+s+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(s,u=1,f=!1,m){let b=Pt(s,f);if(b===void 0)return;let p=typeof m=="string"&&m.trim()!==""?m.trim().toLowerCase():void 0,v=fi(b,p),x=Number.isFinite(u)&&u>0?Math.trunc(u):1,V=i(v);if(V>=0){let M=e[V],I=M!==void 0&&(M.line!==x||M.absolute!==f);if(I&&(e=e.map((A,K)=>K===V?{...A,line:x,absolute:f}:A)),n===v){I&&o();return}n=v,o();return}let z=n===null?e.length:i(n)+1,q={key:v,path:b,line:x,absolute:f,...p===void 0?{}:{revision:p}};e=[...e.slice(0,z),q,...e.slice(z)],n=v,o()},close(s){let u=s===void 0?n:d(s)??null;if(u===null)return;let f=i(u);f<0||(e=e.filter(m=>m.key!==u),n===u&&(n=(e[f]??e[f-1])?.key??null),o())},activate(s){let u=d(s);u===void 0||i(u)<0||n===u||(n=u,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let u=d(s);return u!==void 0&&i(u)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function pi(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Lr();return e.set(t,o),o}}}function Nt(e,n){let t=gt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var U=require("react/jsx-runtime"),Ar={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Pd=()=>()=>{},Fd=()=>"";function Nd(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function mi({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:d}){let c=(0,wn.useRef)(null);(0,wn.useEffect)(()=>{c.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,wn.useSyncExternalStore)(a?.subscribe??Pd,()=>Nd(a,d,e).join("\0"),Fd),u=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let f=m=>{if(m.key==="ArrowRight"||m.key==="ArrowLeft"){m.preventDefault(),m.stopPropagation(),i(m.key==="ArrowRight"?1:-1);return}(m.key==="Delete"||m.key==="Backspace")&&n!==null&&(m.preventDefault(),m.stopPropagation(),o(n))};return(0,U.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:f,"data-testid":"fs-tabs",children:e.map((m,b)=>{let p=m.key===n,v=Ft(m.path),x=t("panel.close").replace("{name}",v);return(0,U.jsxs)("div",{className:"fx-tab","data-active":p?"true":"false","data-dirty":u.has(m.path)?"true":"false",role:"presentation",children:[(0,U.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${b}`,"aria-controls":`fx-panel-${b}`,"aria-selected":p,tabIndex:p?0:-1,title:m.path,"data-testid":"fs-tab","data-path":m.path,"data-key":m.key,ref:p?c:void 0,onClick:()=>r(m.key),children:[(0,U.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":kn(m.path),"aria-hidden":"true",children:hn(m.path)}),(0,U.jsx)("span",{className:"fx-tab-name",children:v}),m.revision===void 0?null:(0,U.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:m.revision,children:m.revision.slice(0,7)}),u.has(m.path)?(0,U.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,U.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:p?0:-1,"aria-label":x,title:x,"data-testid":"fs-tab-close",onClick:()=>o(m.key),children:"\xD7"})]},m.key)})})}function yi({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,U.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,U.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,U.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,U.jsx)("span",{className:"fx-spacer"}),(0,U.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,U.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,U.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Md(){return(0,U.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,U.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,U.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,U.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function gi({t:e}){return(0,U.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,U.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,U.jsx)(Md,{})}),(0,U.jsx)("strong",{children:e("panel.empty.title")}),(0,U.jsx)("span",{children:e("panel.empty.description")}),(0,U.jsxs)("span",{className:"fx-empty-keys",children:[(0,U.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,U.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,U.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,U.jsx)("span",{children:e("panel.empty.keys")})]})]})}var xi=require("react");function se(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,xi.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Bd(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Ld=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function sn(e){let n=[],t=0;for(let r of e.matchAll(Ld)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(se("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(se("strong",null,...sn(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(se("del",null,...sn(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(se("em",null,...sn(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=a?.[1]??i,c=a===null?void 0:Bd(a[2]??"");n.push(c===void 0?d:se("a",{href:c,rel:"noreferrer noopener"},d))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var ki=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,hi=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,bi=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Ir=/^\s{0,3}>\s?(.*)$/u,Dr=/^\s{0,3}[-*+]\s+(.*)$/u,Or=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Ad(e){return ki.test(e)||hi.test(e)||bi.test(e)||Ir.test(e)||Dr.test(e)||Or.test(e)}function vi(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=ki.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),u=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(se("pre",null,se("code",u===""?null:{className:`language-${u}`},f.join(`
`))));continue}let i=hi.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(se(`h${String(s)}`,null,...sn(i[2]??""))),t+=1;continue}if(bi.test(r)){n.push(se("hr",null)),t+=1;continue}if(Ir.test(r)){let s=[];for(;t<e.length;){let u=Ir.exec(e[t]??"");if(u===null)break;s.push(u[1]??""),t+=1}n.push(se("blockquote",null,...vi(s)));continue}if(Dr.exec(r)!==null){let s=[];for(;t<e.length;){let u=Dr.exec(e[t]??"");if(u===null)break;s.push(se("li",null,...sn(u[1]??""))),t+=1}n.push(se("ul",null,...s));continue}if(Or.exec(r)!==null){let s=[];for(;t<e.length;){let u=Or.exec(e[t]??"");if(u===null)break;s.push(se("li",null,...sn(u[1]??""))),t+=1}n.push(se("ol",null,...s));continue}let c=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Ad(s))break;c.push(s.trim()),t+=1}n.push(se("p",null,...sn(c.join(" "))))}return n}function Mt(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return se("div",{className:"fx-md"},...vi(n))}var Wr=200,Id={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function jn(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Id[t.slice(r+1)]??"plaintext"}function $n(e){return jn(e)==="markdown"}var me=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Kn(e){return e!==null&&typeof e=="object"}function Dd(e){return e===""?0:e.split(`
`).length}function Sn(e,n){if(!Kn(e))throw new me("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=Kn(e.error)?e.error:{},f=typeof u.code=="string"?u.code:"preview/unknown",m=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",b=Kn(u.details)?u.details:{},p=typeof b.kind=="string"?b.kind:"";throw new me(f,m,p)}let t=e.ok===!0?e.value:e;if(!Kn(t)||typeof t.text!="string")throw new me("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Dd(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,d=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,c=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...d===void 0?{}:{source:d},...c===void 0?{}:{linkTarget:c}};return o===void 0?s:{...s,totalLines:o}}function dn(e){let n=Kn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var zn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Bt({files:e,maxLines:n=Wr}){let t=Math.max(1,Math.trunc(n)),r=zn,o=0,i=null,a=[1],d=new Set,c=u=>{r=u;for(let f of d)f()},s=async(u,f)=>{o+=1;let m=o;i?.abort();let b=new AbortController;i=b,c({status:"loading",path:u,text:r.path===u?r.text:"",offset:f,lines:r.path===u?r.lines:0,...r.path===u&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===u&&r.source!==void 0?{source:r.source}:{},eof:r.path===u?r.eof:!1});try{let p=await e.read(u,f>1?{offset:f,limit:t}:{limit:t},b.signal);if(m!==o)return;let v=Sn(p,f);if(v.lines===0&&f>1){c({...r,status:"ready",eof:!0,text:"",lines:0});return}let x={status:"ready",path:u,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof,...v.source===void 0?{}:{source:v.source},...v.linkTarget===void 0?{}:{linkTarget:v.linkTarget,linkPath:u}};c(v.totalLines===void 0?x:{...x,totalLines:v.totalLines})}catch(p){if(m!==o||b.signal.aborted)return;c({status:"failed",path:u,text:"",offset:f,lines:0,eof:!1,failure:dn(p)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(u){return d.add(u),()=>{d.delete(u)}},async open(u){a=[1],await s(u,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let u=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&u>r.totalLines||(a.push(u),await s(r.path,u))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let u=a[a.length-1]??1;await s(r.path,u)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],c(zn)}}}function Lt(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Kr=Object.freeze({chunk:pr.chunk,id:`${we}/${pr.chunk}`}),zr=null,_n=null,At=new Map;function wi(e){zr=e}function Si(){return Kr}function Od(e){let n=at[e];return{chunk:n,id:`${we}/${n}`}}function jr(){if(_n!==null)return _n;let e=zr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${we}: the loader require was not handed over`));let n=e.async(`./${Kr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${we}: chunk ${Kr.id} is missing its preview renderers`);return r});return _n=n,n.catch(()=>{_n===n&&(_n=null)}),n}function Ri(e){let n=At.get(e);if(n!==void 0)return n;let t=zr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${we}: the loader require was not handed over`));let r=Od(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${we}: chunk ${r.id} is not the ${e} view`);return a});return At.set(e,o),o.catch(()=>{At.get(e)===o&&At.delete(e)}),o}var Ci=Object.freeze({}),Wd="@deepseek-ai/dsh-client-ui-primitives",_r=null,$r;function Ti(e){_r=e}function Kd(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function It(){if($r!=null)return $r;if(_r===null)return Ci;let e=Kd(_r,Wd);if(e===void 0)return Ci;let n=u=>{let f=e[u];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=u=>{let f=e[u];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let d=n("Input");d!==void 0&&(r.Input=d);let c=n("IconChevronDownOutlineRegular");c!==void 0&&(r.IconChevronDownOutlineRegular=c);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var L=require("react");async function ln(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Ot=require("react");function zd(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function Dt(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(zd(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function Ei(e,n,t){return n<=0?0:((e+t)%n+n)%n}function Pi(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let d of i)d!==""&&t.push({node:o,start:r,length:d.length}),n.push(d),r+=d.length,o+=1}),{text:n.join(""),runs:t}}function Hr(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function Fi(e){let n=t=>Dt(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var jd=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),$d=new Set(["SCRIPT","STYLE","TEMPLATE"]);function _d(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let s=i.data;if(s==="")continue;let u=n.at(-1);u===void 0?n.push([s]):u.push(s),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,d=a.tagName.toUpperCase();if($d.has(d))continue;if(d==="BR"){n.push([]);continue}let c=jd.has(d);c&&n.push([]),r(a),c&&n.push([])}};return r(e),{layout:Pi(n),nodes:t}}function Ni(e){let n=()=>{let r=e();return r===null?void 0:_d(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:Dt(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let d=Dt(i.layout.text,r)[o];if(d===void 0)return;let c=Hr(i.layout,d.from),s=Hr(i.layout,d.to);if(c===void 0||s===void 0)return;let u=i.nodes[c.node],f=i.nodes[s.node];if(u===void 0||f===void 0)return;let m=a.ownerDocument.createRange();try{m.setStart(u,Math.min(c.offset,u.data.length)),m.setEnd(f,Math.min(s.offset,f.data.length))}catch{return}let b=t();b!==void 0&&(b.removeAllRanges(),b.addRange(m));let p=m.startContainer.parentElement;p!==null&&typeof p.scrollIntoView=="function"&&p.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var Gr=(0,Ot.createContext)(null);function Mi(){return(0,Ot.useContext)(Gr)}var Ge=require("react/jsx-runtime");function Hd(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Gd(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Vr({failure:e,t:n,onRetry:t}){return(0,Ge.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Ge.jsx)("strong",{children:Hd(e,n)}),(0,Ge.jsx)("span",{children:Gd(e,n)}),e.message===""?null:(0,Ge.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Ge.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function qr({t:e}){return(0,Ge.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Ge.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Se=require("react");var Qe=require("react/jsx-runtime");function Bi({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Se.useState)(""),[a,d]=(0,Se.useState)(0),[c,s]=(0,Se.useState)(0),u=(0,Se.useRef)(null);(0,Se.useEffect)(()=>{u.current?.focus()},[]),(0,Se.useEffect)(()=>{if(o===""){s(0),d(0);return}let v=n().count(o);s(v),d(x=>v===0?0:Math.min(x,v-1))},[o,t,n]),(0,Se.useEffect)(()=>{o===""||c===0||n().reveal(o,a)},[o,a,c,n]);let f=(0,Se.useCallback)(()=>{n().clear(),r()},[n,r]),m=(0,Se.useCallback)(v=>{c!==0&&d(x=>Ei(x,c,v))},[c]),b=v=>{if(!v.nativeEvent.isComposing){if(v.key==="Escape"){v.preventDefault(),v.stopPropagation(),f();return}if(v.key==="Enter"){v.preventDefault(),m(v.shiftKey?-1:1);return}(v.key==="ArrowDown"||v.key==="ArrowUp")&&v.stopPropagation()}},p=o===""?e("preview.find.hint"):c===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(a+1)).replace("{count}",String(c));return(0,Qe.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:b,children:[(0,Qe.jsx)("input",{ref:u,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:v=>{i(v.currentTarget.value),d(0)}}),(0,Qe.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":c===0?"empty":"ready",title:e("preview.find.scope"),children:p}),(0,Qe.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:c===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>m(-1),children:"\u2191"}),(0,Qe.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:c===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>m(1),children:"\u2193"}),(0,Qe.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:f,children:"\xD7"})]})}var Ur="fsExplorer",Li=1;function Vd(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function qd(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Ud(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Xd(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Wt(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(qd),families:[...i.match?.families??[]]}),o();let d=!0;return()=>{d&&(d=!1,t.delete(a),o())}},resolve(i){let a=Vd(i.path),d=Ln(i.path),c;for(let s of t.values())Ud(s,a,d)&&(c===void 0||Xd(s.contribution,c.contribution))&&(c=s);return c?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Ai(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Kt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function De(e){try{return e()}catch{return}}function Te(e){return e!==null&&typeof e=="object"}function Ki(e){return()=>{let n=De(()=>e.workspaceFiles);if(Kt(n))return n;let t=De(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Kt(t))return t;let r=De(()=>e.remote?.workspaceFiles);if(Kt(r))return r;let o=De(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Kt(o))return o}}function zi(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function ji(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Sn(i,r.offset??1),i}catch(s){if(!(s instanceof me)||dn(s).kind!=="symlink")throw s;a=s}let d=await n(t,o);if(d===void 0)throw a;return{...Sn(await e.read(d.absolutePath,r,o),r.offset??1),linkTarget:d.absolutePath}}}}function Ii(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Yd(e){let n=De(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Te(n)?n.rpc:void 0;if(!Te(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function $i(e){return()=>{let n=De(()=>e.remote?.gitExplorer);if(Ii(n))return n;let t=De(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Ii(t)?t:Yd(e)}}function Zd(e){return e===""?0:e.split(`
`).length}function Di(e){let n=Te(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new me(t,r)}function _i(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},d=await e.show(a,i);if(!Te(d))throw new me("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(d.ok===!1)throw Di(d.error);let c=d;if(d.ok===!0&&(c=d.value),!Te(c))throw new me("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(c.ok===!1)throw Di(c.error);let s=c;if(c.ok===!0&&(s=c.page),!Te(s))throw new me("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new me("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new me("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new me("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let u=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):Zd(s.text),f=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,m=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:u,offset:f,eof:s.eof===!0,...m===void 0?{}:{source:m}}}}}function Qd(e){if(!Te(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Te(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Jd(e){let n=Te(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Te(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new me(t,r,i)}function Zr(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Qd(await n.call(e,t,r,{},o));if(!i.ok)throw Jd(i.error);return i.value.data}}function Hn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Xr(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function zt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Hn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Xr(r.value):{ok:!1,message:Hn(r.error)}}return Xr(t)}return Xr(n)}function Hi(e){return e instanceof Error?e.message:Hn(e)}function Oi(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function el(e){let n=De(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Te(n)?n.rpc:void 0;if(!Te(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function Gi(e){return()=>{let n=el(e);if(n!==void 0)return n;let t=De(()=>e.remote?.gitExplorer);if(Oi(t))return t;let r=De(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Oi(r))return r}}function Wi(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function nl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Wi(r.additions),i=Wi(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function tl(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function rl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function Yr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=nl(n.stats),r=tl(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=rl(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function jt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Hn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?Yr(o.snapshot):{ok:!1,message:Hn(o.error)}}let r=e;return r.snapshot!==void 0?Yr(r.snapshot):Yr(t)}var T=require("react/jsx-runtime"),no={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},ol=()=>()=>{},Vi=()=>{};function to(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Qr={status:"idle"},il=[".md",".mdx",".markdown",".mdown"],al=-1e3;function eo({t:e,revision:n}){return(0,T.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,T.jsx)("strong",{children:e("preview.unavailable.title")}),(0,T.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function qi({chunk:e,text:n,path:t,offset:r}){let o=(0,L.useRef)(null),i=(0,L.useRef)(null),a=Mi(),d=(0,L.useRef)(n);d.current=n;let[c,s]=(0,L.useState)(!1),u=jn(t);return(0,L.useEffect)(()=>{s(!1)},[e,t]),(0,L.useEffect)(()=>{let f=o.current;if(!(e===null||f===null))try{let m=e.mountCodePreview(f,{text:n,language:u,path:t,offset:r});return i.current=m,()=>{m.destroy(),i.current=null}}catch{s(!0);return}},[e,t,u]),(0,L.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),(0,L.useEffect)(()=>{if(!(a===null||e===null||c))return a.register(Fi({text:()=>d.current,select:(f,m)=>i.current?.revealRange(f,m),clear:()=>i.current?.clearSelection()})),()=>a.register(null)},[a,e,c]),e===null||c?(0,T.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,T.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function sl({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&$n(n)?(0,T.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Mt(r)}):(0,T.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function dl(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,T.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,T.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,T.jsx)(qi,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ll(e){function n({page:t,path:r}){return(0,T.jsx)(qi,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ul({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let d=(0,L.useMemo)(()=>{let c=Zr(r);return c===void 0||t===void 0||a===void 0?c:async(s,u,f)=>{if(s!==t||u!==n)return c(s,u,f);let m=await a(u,f);return c(s,m?.absolutePath??u,f)}},[r,t,n,a]);return t===void 0||d===void 0?(0,T.jsx)(eo,{t:o}):(0,T.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:d,t:o,visible:i})}function cl(e){return{Body:n=>(0,T.jsx)(ul,{chunk:e,...n}),renderer:e.renderer}}function ro(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...il]},priority:0,load:()=>jr().then(dl)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:al,load:()=>jr().then(ll)},...Object.keys(at).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Ri(e).then(cl)}))]}var Jr;function fl(){if(Jr!==void 0)return Jr;let e=Wt();for(let n of ro())e.register(n);return Jr=e,e}function Ui({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:d,documents:c,locate:s}){let u=(0,L.useMemo)(()=>{let O=r===void 0?zi(n,e):o===void 0||e===void 0?void 0:_i(o,e,r);return O===void 0||r!==void 0||s===void 0?O:ji(O,s)},[n,e,r,o,s]),f=(0,L.useMemo)(()=>r===void 0?Zr(n):void 0,[n,r]),m=d??fl(),b=t===void 0?null:Ln(t),p=b!==null,v=r===void 0&&e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[x,V]=(0,L.useState)(null),[z,q]=(0,L.useState)(zn),[M,I]=(0,L.useState)(Qr),[A,K]=(0,L.useState)(0),[j,oe]=(0,L.useState)(0),[le,S]=(0,L.useState)("reading"),[C,N]=(0,L.useState)(!1),[F,_]=(0,L.useState)(!1),[k,P]=(0,L.useState)(void 0),[R,Z]=(0,L.useState)(!1),[Q,ye]=(0,L.useState)(!1),Ce=(0,L.useRef)(null),ue=(0,L.useRef)(null),ce=(0,L.useRef)(void 0),J=(0,L.useRef)(void 0),D=(0,L.useSyncExternalStore)(c?.subscribe??ol,()=>c===void 0||e===void 0||t===void 0?Vi():c.peek(e,t),Vi),Y=c===void 0||e===void 0||t===void 0?void 0:c.find(e,t);if((0,L.useEffect)(()=>{if(u===void 0){V(null);return}let O=Bt({files:u,maxLines:Wr});return V(O),()=>O.close()},[u]),(0,L.useEffect)(()=>{if(x===null){q(zn);return}return q(x.getSnapshot()),x.subscribe(()=>q(x.getSnapshot()))},[x]),(0,L.useEffect)(()=>{x===null||t===void 0||b!==null||x.open(t)},[x,t,b]),(0,L.useEffect)(()=>{if(!p||t===void 0||s===void 0){P(void 0);return}let O=new AbortController,fe=!0;return(async()=>{let he=await s(t,O.signal);fe&&!O.signal.aborted&&P(he?.absolutePath)})(),()=>{fe=!1,O.abort()}},[p,t,s]),(0,L.useEffect)(()=>{S("reading"),N(!1),Z(!1)},[t]),(0,L.useEffect)(()=>()=>{ce.current!==void 0&&clearTimeout(ce.current),J.current!==void 0&&clearTimeout(J.current)},[]),(0,L.useEffect)(()=>{D?.conflict!==!0&&(_(!1),Z(!1),J.current!==void 0&&clearTimeout(J.current))},[D?.conflict]),(0,L.useEffect)(()=>m.subscribe(()=>K(O=>O+1)),[m]),(0,L.useEffect)(()=>{if(t===void 0||r!==void 0){I(Qr);return}let O=Ai(m,{path:t});if(O===void 0){I(Qr);return}let{contribution:fe}=O,he=!0;return I(pe=>pe.status==="ready"&&pe.contribution.id===fe.id?pe:{status:"loading",contribution:fe}),O.module.then(pe=>{he&&I({status:"ready",contribution:fe,module:pe})},pe=>{he&&I({status:"failed",contribution:fe,failure:dn(pe)})}),()=>{he=!1}},[m,t,r,A,j]),t===void 0)return(0,T.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,T.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,T.jsx)("strong",{children:i("preview.empty.title")}),(0,T.jsx)("span",{children:i("preview.empty.description")})]})});let ze=p&&r!==void 0,Le=Lt(z),Fe=z.linkPath??t,Ae=p?k:z.linkTarget,Ue=!p&&$n(t),cn=p?!ze&&v!==null&&M.status!=="ready"&&M.status!=="failed":z.status==="loading",en=z.status==="ready",ge=Ue&&le==="reading",nn=p?ze||v===null?"unavailable":M.status==="failed"?"failed":M.status==="ready"?"ready":"loading":z.status,xe=M.status==="ready"?M.module.renderer??M.contribution.id:p?"pending":ge?"fallback":"plain",H=(0,L.useMemo)(()=>Ni(()=>Ce.current),[]),je=(0,L.useMemo)(()=>()=>ue.current??H,[H]),Zn=(0,L.useMemo)(()=>({register:O=>{ue.current=O}}),[]),tn=[Fe,String(le),z.offset,z.text.length,xe].join("|"),fn=!p&&en,pn={path:Ae??t,sessionId:e,files:n,t:i,visible:a,mode:le,...p?{}:{page:{text:z.text,offset:z.offset}},...s===void 0?{}:{locate:s}},er=()=>{ln(Ae??Fe).then(O=>{O&&(N(!0),ce.current!==void 0&&clearTimeout(ce.current),ce.current=setTimeout(()=>N(!1),1400))})},Ie=()=>{let O=Y?.copyDraft();O!==void 0&&ln(O).then(fe=>{fe&&(_(!0),J.current!==void 0&&clearTimeout(J.current),J.current=setTimeout(()=>_(!1),1400))})},Xe=D?.error,Ne=Xe!=null&&D?.conflict!==!0,ke=D?.conflict===!0,mn=D?.discarded??null,Pn=!ke&&mn!==null&&D?.dirty!==!0&&mn!==D?.text,Ye;if(p){let O=M.status==="ready"?M.module.Body:void 0;Ye=ze?(0,T.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,T.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,T.jsx)("span",{children:i("preview.commitBinary.description")})]}):v===null?(0,T.jsx)(eo,{t:i,revision:r}):M.status==="failed"?(0,T.jsx)(Vr,{failure:M.failure,t:i,onRetry:()=>oe(fe=>fe+1)}):O===void 0?(0,T.jsx)(qr,{t:i}):(0,T.jsx)(O,{...pn})}else if(u===void 0)Ye=(0,T.jsx)(eo,{t:i,revision:r});else if(z.status==="failed")Ye=(0,T.jsx)(Vr,{failure:z.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{x?.retry()}});else if(!en)Ye=(0,T.jsx)(qr,{t:i});else{let O=M.status==="ready"?M.module.Body:sl;Ye=(0,T.jsx)(O,{...pn})}return(0,T.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":nn,"data-mode":p?"binary":ge?"reading":"code","data-renderer":xe,children:[(0,T.jsxs)("header",{className:"fx-preview-bar",children:[(0,T.jsxs)("span",{className:"fx-preview-path",title:Ae===void 0?Fe:`${Fe} \u2192 ${Ae}`,"data-testid":"fs-preview-path",...Ae===void 0?{}:{"data-link":"followed"},children:[Fe,Ae===void 0?null:(0,T.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",Ae]})]}),p?null:(0,T.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Le.range,Le.range==="\u2014"?null:(0,T.jsxs)(T.Fragment,{children:[" ",i("preview.lines")]}),Le.total===void 0?null:(0,T.jsxs)("span",{className:"fx-preview-total",children:[" / ",Le.total," ",i("preview.lines")]})]}),(0,T.jsxs)("div",{className:"fx-preview-actions",children:[D===void 0?null:(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!D.dirty||D.saving||D.status!=="ready",onClick:()=>{Y?.save()},children:D.saving?i("preview.saving"):i("preview.save")}),Ue?(0,T.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>S(O=>O==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(le==="reading"?"preview.source":"preview.reading")}):null,p?null:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!en||cn||z.offset<=1,onClick:()=>{x?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,T.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!en||cn||z.eof,onClick:()=>{x?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),fn?(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":Q?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":Q,onClick:()=>ye(O=>!O),children:i("preview.find")}):null,(0,T.jsx)("button",{type:"button",className:"fx-pbtn",onClick:er,"data-testid":"fs-preview-copy",children:i(C?"preview.copied":"preview.copyPath")}),cn?(0,T.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),Q&&fn?(0,T.jsx)(Bi,{t:i,surface:je,stamp:tn,onClose:()=>ye(!1)}):null,z.source==="first-parent"?(0,T.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,ke||Pn?(0,T.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":ke?"conflict":"discarded",children:[(0,T.jsx)("strong",{children:i(ke?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,T.jsx)("span",{className:"fx-conflict-hint",children:i(ke?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,T.jsx)("span",{className:"fx-spacer"}),ke?(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":R?"discard":void 0,onClick:()=>{if(!R&&D?.dirty===!0){Z(!0);return}Z(!1),Y?.reload({force:!0})},children:i(R?"preview.conflict.discard":"preview.conflict.reload")}):null,Pn?(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{mn!==null&&Y?.setDraft(mn)},children:i("preview.conflict.restore")}):null,ke?(0,T.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Ie,children:i(F?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Ne?(0,T.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",to(Xe?.code??"io-error",Xe?.message??"",i))}):null,(0,T.jsx)("div",{className:"fx-preview-body","data-scroll":ge?"y":"none",ref:Ce,children:(0,T.jsx)(Gr.Provider,{value:Zn,children:Ye})})]})}var Xi="dsh-fs-explorer-styles",pl=`
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
`;function Yi(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Xi}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Xi,t.textContent=pl,e.head.appendChild(t),()=>{t.remove()}}var g=require("react");var ie={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"};function Zi(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function ml(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function Qi(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,d=r.workspace&&a!==void 0,c=[{id:ie.createFile,label:n("menu.create.file"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:ie.createFolder,label:n("menu.create.folder"),...d?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return c;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,u={id:ie.reveal,label:n(ml(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:ie.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},m={id:ie.copyRelative,label:n("menu.copy.relative")},b=e.remoteLinks,p=b!==void 0&&b.length>0?{id:ie.copyRemote,label:n("menu.copy.remote"),submenu:b.map(v=>({id:v.id,label:v.label}))}:{id:ie.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...c,u,{id:"menu.copy",label:n("menu.copy"),submenu:[f,m]},p,{id:ie.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}var Oe=require("react");var Re=require("react/jsx-runtime");function yl(e){return new DOMRect(e.x,e.y,0,0)}function Ji(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Re.jsxs)(Re.Fragment,{children:[e.label,(0,Re.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function ea({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=It();if(i.Menu!==void 0){let a=i.Menu;return(0,Re.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(d=>({id:d.id,label:Ji(d),...d.disabled===!0?{disabled:!0}:{},...d.submenu===void 0?{}:{submenu:d.submenu.map(c=>({id:c.id,label:Ji(c),...c.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>yl(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Re.jsx)(gl,{entries:e,anchor:n,onSelect:t,onClose:r})}function gl({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,Oe.useRef)(null),[i,a]=(0,Oe.useState)(null),[d,c]=(0,Oe.useState)({left:n.x,top:n.y});(0,Oe.useEffect)(()=>{let u=o.current;if(u===null)return;let f=8,m=u.offsetWidth,b=u.offsetHeight,p=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-m-f)),v=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-b-f));c({left:p,top:v})},[n.x,n.y]),(0,Oe.useEffect)(()=>{let u=m=>{m.target instanceof Node&&o.current?.contains(m.target)!==!0&&r()},f=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),r())};return document.addEventListener("pointerdown",u),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",u),document.removeEventListener("keydown",f,!0)}},[r]);let s=(0,Oe.useCallback)(u=>{if(u.disabled!==!0){if(u.submenu!==void 0){a(f=>f===u.id?null:u.id);return}t(u.id)}},[t]);return(0,Re.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:d,onContextMenu:u=>u.preventDefault(),children:e.map(u=>(0,Re.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Re.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":u.id,disabled:u.disabled===!0&&u.reason===void 0,"aria-disabled":u.disabled===!0?!0:void 0,"aria-haspopup":u.submenu===void 0?void 0:"menu","aria-expanded":u.submenu===void 0?void 0:i===u.id,title:u.disabled===!0?u.reason:void 0,onClick:()=>s(u),children:u.label}),u.submenu===void 0||i!==u.id?null:(0,Re.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:u.submenu.map(f=>(0,Re.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>s(f),children:f.label},f.id))})]},u.id))})}var de=require("react"),$=require("react/jsx-runtime"),xl=120,oo=280,$t=8;function _t(e){let n=typeof window>"u"?e:window.innerWidth-oo;return Math.max($t,Math.min(e,Math.max($t,n)))}function kl(e,n){if(e===void 0)return{left:$t,top:$t};if(n<=1)return{left:_t(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+oo<=window.innerWidth;return{left:_t(r?t:e.left-oo-4),top:e.top}}function na(){return(0,$.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,$.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ta({node:e,t:n,onOpen:t}){return(0,$.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,$.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function ra({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:d,onReorder:c}){let[s,u]=(0,de.useState)([]),f=(0,de.useRef)(null),[m,b]=(0,de.useState)(null),[p,v]=(0,de.useState)(null),x=(0,de.useCallback)(()=>{f.current!==null&&(clearTimeout(f.current),f.current=null)},[]),V=(0,de.useCallback)(()=>{x(),u([])},[x]),z=(0,de.useCallback)(()=>{x(),f.current=setTimeout(()=>{f.current=null,u([])},xl)},[x]);(0,de.useEffect)(()=>()=>{f.current!==null&&clearTimeout(f.current)},[]),(0,de.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let S=C=>{C.key!=="Escape"||C.isComposing||(C.preventDefault(),C.stopPropagation(),V())};return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[V,s.length]);let q=(0,de.useCallback)((S,C,N)=>{x();let{left:F,top:_}=kl(N?.getBoundingClientRect(),C);u(k=>{let P=k.slice(0,C);return P.length===C&&P[C-1]?.groupId===S?k:[...P,{groupId:S,left:F,top:_,depth:C}]})},[x]),M=(0,de.useCallback)(S=>{V(),S.kind==="file"?t(S.path):S.kind==="folder"&&r(S.path)},[V,t,r]),I=S=>{let C,N=F=>{for(let _ of F)_.kind==="group"&&(_.id===S&&(C=_),N(_.children))};return N(e.roots),C},A=S=>{let C=(N,F)=>{if(N.some(_=>_.id===S))return{parentId:F,siblings:N};for(let _ of N){if(_.kind!=="group")continue;let k=C(_.children,_.id);if(k!==void 0)return k}};return C(e.roots,null)??{parentId:null,siblings:[]}},K=(S,C)=>{let N=C?.getBoundingClientRect(),{parentId:F,siblings:_}=A(S.id);b({node:S,parentId:F,siblings:_,left:_t(N?.left??0),top:(N?.bottom??0)+4})},j=(S,C)=>{let{parentId:N,siblings:F}=A(S.id);b({node:S,parentId:N,siblings:F,left:_t(C.clientX),top:C.clientY})},oe=(S,C)=>{let{parentId:N,siblings:F}=A(S.id),_=F.map(Q=>Q.id),k=_.indexOf(S.id),P=k+C;if(k<0||P<0||P>=_.length)return;let R=[..._],[Z]=R.splice(k,1);Z!==void 0&&(R.splice(P,0,Z),b(null),c?.(N,R))},le=S=>{let C=p;if(v(null),C===null||C===S)return;let N=e.roots.map(R=>R.id),F=N.indexOf(C),_=N.indexOf(S);if(F<0||_<0)return;let k=[...N],[P]=k.splice(F,1);P!==void 0&&(k.splice(_,0,P),c?.(null,k))};return(0,de.useEffect)(()=>{if(m===null||typeof document>"u")return;let S=N=>{N.target instanceof Node&&(N.target instanceof Element&&N.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||b(null))},C=N=>{N.key!=="Escape"||N.isComposing||(N.preventDefault(),N.stopPropagation(),b(null))};return document.addEventListener("pointerdown",S),document.addEventListener("keydown",C,!0),()=>{document.removeEventListener("pointerdown",S),document.removeEventListener("keydown",C,!0)}},[m]),(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,$.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(S=>(0,$.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":p===S.id?"true":void 0,draggable:!0,onDragStart:()=>v(S.id),onDragEnd:()=>v(null),onDragOver:C=>C.preventDefault(),onDrop:C=>{C.preventDefault(),le(S.id)},children:[S.kind==="group"?(0,$.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(C=>C.groupId===S.id),title:n("bookmarks.group"),onPointerEnter:C=>q(S.id,1,C.currentTarget),onFocus:C=>q(S.id,1,C.currentTarget),onPointerLeave:z,onContextMenu:C=>{C.preventDefault(),C.stopPropagation(),j(S,C)},children:[(0,$.jsx)("span",{className:"fx-bookmark-name",children:S.name}),(0,$.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,$.jsx)(na,{})})]}):(0,$.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":S.kind,title:S.path,onClick:()=>M(S),onContextMenu:C=>{C.preventDefault(),C.stopPropagation(),j(S,C)},children:(0,$.jsx)("span",{className:"fx-bookmark-name",children:S.name})}),(0,$.jsx)(ta,{node:S,t:n,onOpen:K})]},S.id))}),m===null?null:(0,$.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:m.left,top:m.top},children:[(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{b(null),i?.(m.node)},children:n("bookmarks.rename")}),(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{b(null),a?.(m.node)},children:n("bookmarks.remove")}),(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:m.siblings[0]?.id===m.node.id,onClick:()=>oe(m.node,-1),children:n("bookmarks.moveUp")}),(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:m.siblings[m.siblings.length-1]?.id===m.node.id,onClick:()=>oe(m.node,1),children:n("bookmarks.moveDown")}),(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{b(null),d?.(m.node)},children:n("bookmarks.moveToGroup")})]}),s.map(S=>{let C=I(S.groupId);return C===void 0?null:(0,$.jsxs)("div",{className:S.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":S.depth,role:"menu","aria-label":C.name,style:{left:S.left,top:S.top},onPointerEnter:x,onPointerLeave:z,children:[C.children.length===0?null:C.children.map(N=>(0,$.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[N.kind==="group"?(0,$.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(F=>F.groupId===N.id),onPointerEnter:F=>q(N.id,S.depth+1,F.currentTarget),onFocus:F=>q(N.id,S.depth+1,F.currentTarget),onContextMenu:F=>{F.preventDefault(),F.stopPropagation(),j(N,F)},children:[(0,$.jsx)("span",{className:"fx-bookmark-name",children:N.name}),(0,$.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,$.jsx)(na,{})})]}):(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":N.kind,role:"menuitem",title:N.path,onClick:()=>M(N),onContextMenu:F=>{F.preventDefault(),F.stopPropagation(),j(N,F)},children:(0,$.jsx)("span",{className:"fx-bookmark-name",children:N.name})}),(0,$.jsx)(ta,{node:N,t:n,onOpen:K})]},N.id)),(0,$.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(V(),o(C.id))},children:n("bookmarks.newGroup")})]},C.id)})]})}var Be=require("react");var hl="dsh_fs_explorer",bl="bookmarks";function Ee(e){throw new Error(`bookmarks: ${e}`)}function oa(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Ht(e,n,t){typeof e!="string"&&Ee(`${n} must be a string`);let r=e.trim();return r===""&&Ee(`${n} must not be empty`),r.length>t&&Ee(`${n} must be at most ${String(t)} characters`),r}function ia(e,n,t,r){t>32&&Ee(`${n} is nested deeper than ${String(32)} levels`),oa(e)||Ee(`${n} must be an object`);let o=Ht(e.id,`${n}.id`,200);r.has(o)&&Ee(`duplicate id "${o}" at ${n}`),r.add(o);let i=Ht(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Ee(`${n}.createdAt must be a finite number`);let d=e.kind;if(d==="group"){let c=e.children;return Array.isArray(c)||Ee(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:c.map((s,u)=>ia(s,`${n}.children[${String(u)}]`,t+1,r))}}if(d==="file"||d==="folder"){let c=Ht(e.path,`${n}.path`,4096);return{id:o,kind:d,name:i,createdAt:a,path:c}}return Ee(`${n}.kind must be "group", "file" or "folder"`)}function Rn(e){oa(e)||Ee("a bookmark tree must be an object"),e.version!==1&&Ee(`version must be 1, received ${JSON.stringify(e.version)}`);let n=Ht(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Ee("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>ia(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var bc={name:hl,version:1,invalidRecords:"backup-and-skip",tables:{[bl]:{valueSchema:{parse:Rn}}}};function re(e){throw new Error(`bookmarks: ${e}`)}function un(e){return{version:1,roots:[],updatedAt:e}}function Gn(e,n){let t=n.name.trim();if(t===""&&re("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&re(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function vl(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function sa(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,sa(r,n+1)),n)}function da(e,n){let t=vl(e,n.id);t!==0&&sa(n,t)>32&&re(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function io(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&io(r.children,n,r.id)}function Ve(e,n){let t;return io(e.roots,r=>{r.id===n&&(t=r)}),t}function la(e,n){let t;return io(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function ua(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&ua(t,n))}function ao(e,n){if(n===null)return e.roots;let t=Ve(e,n);return t===void 0&&re(`no group with id "${n}"`),t.kind!=="group"&&re(`"${n}" is not a group`),t.children}function ca(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function Cn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:Cn(r.children,n,t)})}function Vn(e,n,t){return{version:1,roots:n,updatedAt:t}}var qn=()=>new Date().toISOString();function Un(e,n,t,r,o=qn){let i=ao(e,n);Ve(e,t.id)!==void 0&&re(`a node with id "${t.id}" already exists`);let a=ca(r,i.length),d=Cn(e.roots,n,s=>[...s.slice(0,a),t,...s.slice(a)]),c=Vn(e,d,o());return da(c,t),c}function fa(e,n,t=qn){let r=Ve(e,n);r===void 0&&re(`no node with id "${n}"`);let o=la(e,n);o===void 0&&re(`no node with id "${n}"`);let i=Cn(e.roots,o,a=>a.filter(d=>d.id!==n));return{tree:Vn(e,i,t()),removed:r}}function pa(e,n,t,r=qn){let o=t.trim();o===""&&re("a node needs a non-empty name"),Ve(e,n)===void 0&&re(`no node with id "${n}"`);let i=a=>a.map(d=>{let c=d.id===n?{...d,name:o}:d;return c.kind==="group"?{...c,children:i(c.children)}:c});return Vn(e,i(e.roots),r())}function ma(e,n,t,r,o=qn){let i=Ve(e,n);i===void 0&&re(`no node with id "${n}"`);let a=la(e,n);if(a===void 0&&re(`no node with id "${n}"`),t!==null){let m=Ve(e,t);m===void 0&&re(`no group with id "${t}"`),m.kind!=="group"&&re(`"${t}" is not a group`),i.kind==="group"&&ua(i,t)&&re(`cannot move "${n}" into itself or its own descendant`)}let d=Cn(e.roots,a,m=>m.filter(b=>b.id!==n)),c=ao({version:1,roots:d,updatedAt:e.updatedAt},t),s=ca(r,c.length),u=Cn(d,t,m=>[...m.slice(0,s),i,...m.slice(s)]),f=Vn(e,u,o());return da(f,i),f}function ya(e,n,t,r=qn){let o=ao(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&re(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||re(`"${s}" is not a child of ${n??"the root"}`);let d=new Map(o.map(s=>[s.id,s])),c=Cn(e.roots,n,()=>t.map(s=>{let u=d.get(s);return u===void 0&&re(`"${s}" is not a child of ${n??"the root"}`),u}));return Vn(e,c,r())}var We=require("react");var Pe=require("react/jsx-runtime"),wl=200;function Sl(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>wl?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function Rl(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function Xn({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:d,titleKey:c,submitKey:s}){let[u,f]=(0,We.useState)(()=>d??Rl(e)),[m,b]=(0,We.useState)(void 0),p=(0,We.useRef)(null),v=It();(0,We.useEffect)(()=>{d!==void 0&&(f(d),b(void 0))},[d]),(0,We.useEffect)(()=>{let I=p.current;I!==null&&(I.focus(),I.select())},[]);let x=(0,We.useCallback)(()=>{if(a)return;let I=Sl(u,e);if(!I.ok){b(t(`prompt.error.${I.reason}`));return}b(void 0),r(I.name)},[a,e,r,t,u]),V=I=>{if(!I.nativeEvent.isComposing){if(I.key==="Escape"){I.preventDefault(),I.stopPropagation(),o();return}I.key==="Enter"&&(I.preventDefault(),x())}},z=m??i,q=v.Input,M=c??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Pe.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(M),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:V,children:[(0,Pe.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Pe.jsx)("strong",{children:t(M)}),(0,Pe.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),q===void 0?(0,Pe.jsx)("input",{ref:p,className:"fx-name-input",type:"text",value:u,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":z===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:I=>{f(I.target.value),b(void 0)}}):(0,Pe.jsx)(q,{ref:p,className:"fx-name-input",value:u,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":z===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:I=>{f(I.target.value),b(void 0)}}),z===void 0?null:(0,Pe.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:z}),(0,Pe.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Pe.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Pe.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:x,children:t(s??"prompt.submit")})]})]})}var ee=require("react/jsx-runtime");function ga(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function Cl(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let d=[...i,a];if(a.id===n)return t.push(...d),!0;if(r(a.children,d))return!0}return!1};return r(e.roots,[]),t}function xa({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[d,c]=(0,Be.useState)(null),[s,u]=(0,Be.useState)(e),[f,m]=(0,Be.useState)(!1),[b,p]=(0,Be.useState)(void 0),v=(0,Be.useRef)(null);(0,Be.useEffect)(()=>{let A=j=>{j.target instanceof Node&&v.current?.contains(j.target)!==!0&&a()},K=j=>{j.key!=="Escape"||j.isComposing||f||(j.preventDefault(),j.stopPropagation(),a())};return document.addEventListener("pointerdown",A),document.addEventListener("keydown",K,!0),()=>{document.removeEventListener("pointerdown",A),document.removeEventListener("keydown",K,!0)}},[f,a]);let x=()=>(d===null?s.roots:Ve(s,d)?.kind==="group"?Ve(s,d).children:[]).filter(K=>K.kind==="group"),V=(0,Be.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(ma(s,o.id,d));return}if(n===void 0)return;let A=Gn(n.kind==="directory"?"folder":"file",{id:ga(),name:n.name,path:n.path,createdAt:Date.now()});i(Un(s,d,A))}catch(A){p(A instanceof Error?A.message:String(A))}},[d,s,r,o,i,n]),z=A=>{try{let K=Gn("group",{id:ga(),name:A,createdAt:Date.now()}),j=Un(s,d,K);u(j),m(!1),p(void 0),c(K.id)}catch(K){p(K instanceof Error?K.message:String(K))}},q=Cl(s,d),M=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),I=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,ee.jsxs)("div",{ref:v,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":M,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,ee.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,ee.jsx)("strong",{children:M}),r==="add"&&n!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,ee.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(null),children:t("bookmarks.picker.root")}),q.map(A=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(A.id),children:A.name},A.id))]}),(0,ee.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:x().length===0?(0,ee.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):x().map(A=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>c(A.id),children:(0,ee.jsx)("span",{className:"fx-bookmark-name",children:A.name})},A.id))}),b===void 0?null:(0,ee.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:b}),f?(0,ee.jsx)(Xn,{kind:"directory",parent:d??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:z,onCancel:()=>m(!1)}):(0,ee.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>m(!0),children:t("bookmarks.newGroup")}),(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:V,children:I})]})]})}function so(e){return`dsh-fs-explorer.bookmarks.${e}`}function lo(e){return`${so(e)}.pending`}function Gt(){try{return globalThis.localStorage??void 0}catch{return}}function ka(e){let n=Gt();if(n===void 0)return;let t;try{t=n.getItem(so(e))}catch{return}if(t!==null)try{return Rn(JSON.parse(t))}catch{return}}function Tl(e,n){let t=Gt();if(t!==void 0)try{t.setItem(so(e),JSON.stringify(n)),t.setItem(lo(e),"1")}catch{}}function El(e){let n=Gt();if(n===void 0)return!1;try{return n.getItem(lo(e))==="1"}catch{return!1}}function ha(e){let n=Gt();if(n!==void 0)try{n.removeItem(lo(e))}catch{}}function ba(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(ha(n),r.tree):El(n)?ka(n)??un(new Date().toISOString()):un(new Date().toISOString())}catch{}return ka(n)??un(new Date().toISOString())},async save(n,t){let r=Rn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){ha(n);return}}catch{}Tl(n,r)}}}var uo="fs-explorer.treePaneWidth";function co(e){return Math.min(520,Math.max(180,e))}function wa(e){if(e==null)return null;let n;try{n=e.getItem(uo)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Vt(e,n){let t=Math.round(co(n));if(e!=null)try{e.setItem(uo,String(t))}catch{}return t}function Sa(e){if(e!=null)try{e.removeItem(uo)}catch{}}function Ra(e,n){return Math.round(e)===Math.round(n)}var va=16;function Ca(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-va};case"ArrowRight":return{kind:"nudge",delta:va};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var X=require("react");function Ea(e,n,t,r=800){return t-n<=r?e:""}function Pa(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function Fa(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Pl(e,t+1,r.depth,r.depth+1)}function Pl(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Fl=/^.$/u;function Na(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Fl.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ta(e.names,n),d=a.find(c=>c>e.active)??a[0];return d===void 0?{kind:"miss"}:{kind:"jump",index:d,query:n}}let t=`${e.query}${n}`,r=Ta(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ta(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var B=require("react/jsx-runtime"),qe=22;function fo({open:e=!0,size:n=14}){return(0,B.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,B.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,B.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function Nl(){return(0,B.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,B.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Ma(){return(0,B.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,B.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,B.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Ba(){return(0,B.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,B.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,B.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function La(){return(0,B.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,B.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Ml({name:e}){return(0,B.jsx)("span",{className:"fx-badge","data-icon":kn(e),"aria-hidden":"true",children:hn(e)})}function Bl({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:d,onContextMenu:c}){let s=e.kind==="directory",u={top:r,paddingLeft:8+e.depth*12};return(0,B.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",title:e.path,style:u,onClick:()=>{d(e.path),s?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),c(e,f)},children:[(0,B.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,B.jsx)(Nl,{})}),s?(0,B.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,B.jsx)(fo,{open:e.expanded})}):(0,B.jsx)(Ml,{name:e.name}),(0,B.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,B.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,B.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,B.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":In(e.status),"data-testid":"fx-file-status",title:o(mr(e.status)),"aria-label":o(mr(e.status)),children:dt(e.status)}),e.statusCount===void 0?null:(0,B.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,B.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,B.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,B.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,B.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,B.jsx)("span",{className:"fx-size",children:kt(e.size)})]})}function Ll({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,B.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,B.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,B.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,B.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,B.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Al(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Aa({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:d,onContextMenu:c,cursorRequest:s,onCursorMove:u}){let f=(0,X.useRef)(null),[m,b]=(0,X.useState)(0),[p,v]=(0,X.useState)(0),[x,V]=(0,X.useState)(void 0),z=(0,X.useRef)(void 0),q=(0,X.useRef)({query:"",at:0}),M=(0,X.useRef)(void 0),I=(0,X.useRef)(void 0),A=(0,X.useRef)(x);A.current=x;let K=(0,X.useMemo)(()=>e.flatMap((k,P)=>k.type==="entry"?[P]:[]),[e]);(0,X.useEffect)(()=>{let k=I.current!==n;if(I.current=n,M.current!==void 0||n===void 0)return;let P=A.current===void 0?void 0:e[A.current];if(!Vo({cursorPath:P?.type==="entry"?P.path:void 0,selectionMoved:k}))return;let R=e.findIndex(Z=>Z.type==="entry"&&Z.path===n);R>=0&&V(R)},[n,e]),(0,X.useEffect)(()=>{let k=M.current;if(k===void 0)return;let P=e.findIndex(Q=>Q.type==="entry"&&Q.path===k),R=e[P];if(R?.type!=="entry"||R.kind!=="directory"||!R.expanded){M.current=void 0;return}let Z=qo(e,k);Z!==void 0&&(M.current=void 0,V(Z))},[e]),(0,X.useEffect)(()=>{x!==void 0&&e[x]?.type!=="entry"&&V(void 0)},[e,x]),(0,X.useEffect)(()=>{let k=f.current;if(x===void 0||k===null)return;let P=gr({scrollTop:k.scrollTop,viewport:k.clientHeight,rowHeight:qe,index:x});P!==k.scrollTop&&(k.scrollTop=P)},[x]);let j=(0,X.useCallback)((k,P=!0)=>{V(k),P&&f.current?.focus({preventScroll:!0})},[]),oe=(0,X.useRef)(void 0);(0,X.useEffect)(()=>{if(s===void 0||oe.current===s.nonce)return;let k=K.at(-1);if(s.path!==void 0){let R=e.findIndex(Z=>Z.type==="entry"&&Z.path===s.path);oe.current=s.nonce,R>=0&&j(R,s.focus);return}if(s.delta===void 0){oe.current=s.nonce;return}if(oe.current=s.nonce,x===void 0){let R=s.delta>0?K[0]:k;R!==void 0&&j(R,s.focus);return}let P=s.delta>0?K.find(R=>R>x):[...K].reverse().find(R=>R<x);P!==void 0&&j(P,s.focus)},[s,x,K,j,e]),(0,X.useEffect)(()=>{if(u===void 0)return;let k=x===void 0?void 0:e[x];u(k?.type==="entry"?k.path:void 0)},[x,e,u]);let le=(0,X.useCallback)(k=>{let P=e.findIndex(R=>R.type==="entry"&&R.path===k);P>=0&&V(P)},[e]),S=(0,X.useCallback)((k,P,R)=>{le(k.path),c(k,P,R)},[le,c]),C=(0,X.useCallback)(k=>{k.preventDefault(),c(void 0,{x:k.clientX,y:k.clientY},k.currentTarget)},[c]),N=(0,X.useCallback)(k=>{if(k.nativeEvent.isComposing||k.altKey||k.metaKey||k.ctrlKey)return;let P=K.at(-1);if(k.key==="ArrowDown"){if(k.preventDefault(),x===void 0){K[0]!==void 0&&j(K[0]);return}let D=K.find(Y=>Y>x);D!==void 0&&j(D);return}if(k.key==="ArrowUp"){if(k.preventDefault(),x===void 0){P!==void 0&&j(P);return}let D=[...K].reverse().find(Y=>Y<x);D!==void 0&&j(D);return}if(x===void 0)return;let R=e[x];if(R===void 0||R.type!=="entry")return;if(k.key==="ArrowRight"){if(k.preventDefault(),R.kind==="directory"&&!R.expanded)M.current=R.path,o(R.path);else{let D=K.find(Y=>Y>x);D!==void 0&&e[D]?.depth===R.depth+1&&j(D)}return}if(k.key==="ArrowLeft"){if(k.preventDefault(),R.kind==="directory"&&R.expanded)o(R.path);else{let D=[...K].reverse().find(Y=>Y<x&&e[Y]?.type==="entry"&&e[Y].depth<R.depth);D!==void 0&&j(D)}return}if(k.key==="Enter"&&R.kind!=="directory"){k.preventDefault(),i(R.path);return}if(k.key==="ContextMenu"||k.key==="F10"&&k.shiftKey){k.preventDefault();let D=f.current?.getBoundingClientRect(),Y=D===void 0?0:D.top+x*qe-(f.current?.scrollTop??0);S(R,{x:D?.left??0,y:Y+qe},f.current??void 0);return}if(k.key==="Home"){k.preventDefault(),K[0]!==void 0&&j(K[0]);return}if(k.key==="End"){k.preventDefault(),P!==void 0&&j(P);return}let Z=Date.now(),Q=Pa(e,x),ye=Fa(e,Q),Ce=ye.map(D=>{let Y=e[D];return Y?.type==="entry"?Y.name:""}),ue=Na({query:Ea(q.current.query,q.current.at,Z),key:k.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:k.nativeEvent.repeat,names:Ce,active:x===void 0?-1:ye.indexOf(x)});if(ue.kind==="clear"){q.current={query:"",at:0};return}if(ue.kind!=="jump")return;let ce=ye[ue.index];if(ce===void 0)return;let J=e[ce];J?.type==="entry"&&(q.current={query:ue.query,at:Z},k.preventDefault(),j(ce),J.kind!=="directory"&&i(J.path))},[x,K,j,o,i,S,e]);(0,X.useEffect)(()=>{let k=f.current;if(k===null)return;let P=()=>v(k.clientHeight);if(P(),typeof ResizeObserver>"u")return;let R=new ResizeObserver(P);return R.observe(k),()=>R.disconnect()},[]),(0,X.useEffect)(()=>{if(n===void 0)return;let k=f.current;if(k===null)return;let P=e.findIndex(Z=>Z.type==="entry"&&Z.path===n);if(P<0)return;let R=P*qe;(R<k.scrollTop||R+qe>k.scrollTop+k.clientHeight)&&(k.scrollTop=Math.max(0,R-k.clientHeight/2))},[n,e]),(0,X.useEffect)(()=>{if(t===void 0||z.current===t)return;let k=f.current;if(k===null)return;let P=t.path===void 0?-1:e.findIndex(R=>R.type==="entry"&&R.path===t.path);if(!(t.path!==void 0&&P<0)){if(z.current=t,P>=0){let R=gr({scrollTop:k.scrollTop,viewport:k.clientHeight===0?480:k.clientHeight,rowHeight:qe,index:P});R!==k.scrollTop&&(k.scrollTop=R,b(R)),V(P)}Al(k),d?.()}},[t,e,d]);let F=k=>{b(k.currentTarget.scrollTop)},_=pt(e,{scrollTop:m,height:p===0?480:p,rowHeight:qe});return(0,B.jsx)("div",{className:"fx-scroll",ref:f,onScroll:F,onKeyDown:N,onContextMenu:C,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,B.jsx)("div",{className:"fx-vlist",style:{height:e.length*qe},children:_.rows.map((k,P)=>{let R=(_.startIndex+P)*qe;return k.type==="entry"?(0,B.jsx)(Bl,{row:k,top:R,selected:k.path===n,cursor:x===_.startIndex+P,t:r,onToggle:o,onSelect:i,onRowActivate:le,onContextMenu:(Z,Q)=>S(Z,{x:Q.clientX,y:Q.clientY},Q.currentTarget instanceof HTMLElement?Q.currentTarget:void 0)},k.path):(0,B.jsx)(Ll,{row:k,top:R,t:r,onRetry:a},k.key)})})})}var Yn=require("react"),Je=require("react/jsx-runtime");function Ia({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:d,onClose:c,focusSignal:s}){let u=(0,Yn.useRef)(null),f=(0,Yn.useRef)(s);(0,Yn.useEffect)(()=>{f.current!==s&&(f.current=s,u.current?.focus())},[s]);let m=p=>{if(!p.nativeEvent.isComposing){if(p.key==="Escape"){p.preventDefault(),p.stopPropagation(),c();return}if(p.key==="ArrowDown"||p.key==="ArrowUp"){p.preventDefault(),a(p.key==="ArrowDown"?1:-1);return}p.key==="Enter"&&(p.preventDefault(),d())}},b=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,Je.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:m,children:[(0,Je.jsx)("input",{ref:u,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:p=>i(p.currentTarget.value)}),b===null?null:(0,Je.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[b,o?(0,Je.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,Je.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:c,children:"\xD7"})]})}function Ke(e){return e!==null&&typeof e=="object"}function Ut(e){try{return e()}catch{return}}function Il(e){let n=Ut(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ke(n)?n.rpc:void 0;if(!(!Ke(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Lo}/${r}`,o,i)}function Dl(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks")}}function po(e){return Ke(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function Ol(e){return()=>{let n=Il(e);if(n!==void 0)return Dl(n);let t=Ut(()=>e.fsExplorerWorkspace);if(po(t))return t;let r=Ut(()=>Ke(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(po(r))return r;let o=Ut(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(po(o))return o}}function Tn(e){let n=Ke(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Ke(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Ke(t)?t:void 0}var Wl=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function En(e){let n=Ke(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:Wl.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function Kl(e){let n=Tn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:En(n.error)};let t=Ke(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function zl(e){let n=Tn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:En(n.error)};let t=Ke(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function jl(e){let n=Tn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:En(n.error)}:{ok:!0}}function $l(e){let n=Tn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:En(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function _l(e){let n=Tn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:En(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Rn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function Hl(e){let n=Tn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:En(n.error)}:{ok:!0}}var qt={code:"unsupported",message:"the workspace service is unavailable"};function Da(e){let n=Ol(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:qt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),Kl),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),zl),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),jl),create:(r,o,i,a,d)=>t(c=>{let s=c.create;return typeof s!="function"?{ok:!1,error:qt}:s.call(c,{sessionId:r,parent:o,name:i,kind:a},d)},$l),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:qt}:a.call(i,{sessionId:r},o)},_l),saveBookmarks:(r,o,i)=>t(a=>{let d=a.saveBookmarks;return typeof d!="function"?{ok:!1,error:qt}:d.call(a,{sessionId:r,tree:o},i)},Hl)}}var Gl={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function Vl(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var ql={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function Ul(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let c=t[1]??"",s=Oa(t[2]??"");return s===""?void 0:{base:`https://${c}/${s}`,host:c}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=Oa(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function Oa(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Xl(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Yl(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Zl(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Zl(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function Ql(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function Wa(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=Ql(t,r);if(a===void 0)return[];let d=Yl(i),c=Xl(a),s=[],u=new Set;for(let f of n){if(u.has(f.name))continue;let m=Ul(f.url);if(m===void 0)continue;u.add(f.name);let b=Vl(m.host),p=ql[b][o],v=c===""?"":`/${c}`;s.push({id:`copy.remote.${f.name}`,label:`${f.name} \xB7 ${Gl[b]}`,url:`${m.base}/${p}/${d}${v}`})}return s}var E=require("react/jsx-runtime");function Jl(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var eu=()=>({status:"loading",nodes:[],truncated:!1,total:0});function nu(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var tu=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,za=new Map;function ru(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Xt({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,E.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,E.jsx)("strong",{children:e}),n===void 0?null:(0,E.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,E.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ou(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function ja({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:d,locate:c,workspace:s,fileReferences:u}){let f=pi();function m(b){let p=b.sessionId??e.currentSessionId(),v=(0,g.useRef)(p);v.current=p;let x=(0,g.useMemo)(()=>r(),[r]),V=(0,g.useMemo)(()=>o(),[o]),z=(0,g.useMemo)(()=>i(),[i]),q=(0,g.useMemo)(()=>p===void 0||c===void 0?void 0:c(p),[c,p]),M=(0,g.useMemo)(()=>p===void 0||s===void 0?void 0:s(p),[s,p]),I=(0,g.useMemo)(()=>ba(M),[M]),[A,K]=(0,g.useState)(()=>un(new Date().toISOString())),j=(0,g.useRef)(!1),[oe,le]=(0,g.useState)(null),[S,C]=(0,g.useState)(null),N=(0,g.useRef)(!1),[F,_]=(0,g.useState)(null),[k,P]=(0,g.useState)(void 0),[R,Z]=(0,g.useState)(null),Q=(0,g.useRef)(null),[ye,Ce]=(0,g.useState)(null),[ue,ce]=(0,g.useState)(()=>new Map),[J,D]=(0,g.useState)(void 0),[Y,ze]=(0,g.useState)(void 0),[Le,Fe]=(0,g.useState)(void 0),[Ae,Ue]=(0,g.useState)(void 0),[cn,en]=(0,g.useState)(za),ge=(0,g.useRef)(ue);ge.current=ue;let[nn,xe]=(0,g.useState)(()=>new Set),H=(0,g.useMemo)(()=>f.forSession(p),[f,p]),je=(0,g.useSyncExternalStore)(H.subscribe,H.snapshot,H.snapshot),Zn=je.panels.find(l=>l.key===je.active),tn=Zn?.path,fn=Zn?.revision,[pn,er]=(0,g.useState)(0),Ie=(0,g.useRef)(new Map),Xe=(0,g.useRef)(void 0),[Ne,ke]=(0,g.useState)(null),[mn,Pn]=(0,g.useState)(!1),[Ye,O]=(0,g.useState)(null),fe=(0,g.useRef)(null);fe.current=Ne?.path??null;let he=(0,g.useMemo)(()=>nu(),[]),[pe,yn]=(0,g.useState)(()=>wa(he)),nr=(0,g.useRef)(null),gn=(0,g.useRef)(null),ne=ue.get(""),Qn=ne?.status==="ready",xo=(0,g.useCallback)((l,y,h,w)=>{H.open(l,y,h,w)},[H]),tr=(0,g.useCallback)(l=>{let y=l??H.snapshot().active??void 0;if(y===void 0)return;if((p===void 0?void 0:d?.peek(p,y))?.dirty===!0){O(null),ke({path:y});return}ke(null),O(null),p!==void 0&&d?.forget(p,y),H.close(y)},[d,p,H]),Ua=(0,g.useCallback)(()=>{let l=Ne;if(l===null)return;let y=p===void 0?void 0:d?.find(p,l.path);if(y===void 0){ke(null),p!==void 0&&d?.forget(p,l.path),H.close(l.path);return}Pn(!0),O(null),y.save().then(h=>{if(Pn(!1),!h.ok){let w=y.getSnapshot().error;O(t("panel.confirm.failed").replace("{message}",to(h.code,w?.message??"",t)));return}ke(null),p!==void 0&&d?.forget(p,l.path),H.close(l.path)})},[d,Ne,p,H,t]),Xa=(0,g.useCallback)(()=>{let l=Ne;ke(null),O(null),l!==null&&(p!==void 0&&d?.forget(p,l.path),H.close(l.path))},[d,Ne,p,H]),rr=(0,g.useCallback)(()=>{ke(null),O(null)},[]),ae=(0,g.useCallback)(async(l,y,h)=>{Ie.current.get(l)?.abort();let w=new AbortController;Ie.current.set(l,w),ce(W=>new Map(W).set(l,eu()));try{let W=await h.list(y,mt(l),w.signal);if(w.signal.aborted||v.current!==y)return!1;let G=zt(W);if(!G.ok)return ce($e=>new Map($e).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:G.message})),!1;let Me=ft(G.listing.entries);return ce($e=>new Map($e).set(l,{status:"ready",nodes:Me,truncated:G.listing.truncated===!0,total:G.listing.entries.length})),!0}catch(W){return w.signal.aborted||ce(G=>new Map(G).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:Hi(W)})),!1}finally{Ie.current.get(l)===w&&Ie.current.delete(l)}},[]);(0,g.useEffect)(()=>{for(let l of Ie.current.values())l.abort();return Ie.current.clear(),ce(new Map),xe(new Set),Xe.current=void 0,p!==void 0&&x!==void 0&&ae("",p,x),()=>{for(let l of Ie.current.values())l.abort();Ie.current.clear()}},[p,x,pn,ae]),(0,g.useEffect)(()=>{if(p===void 0||V===void 0){D(void 0),ze(void 0),Fe(void 0),Ue(void 0);return}let l=!0,y=new AbortController;return D(void 0),ze(void 0),Fe(void 0),Ue(void 0),Promise.resolve().then(()=>V.snapshot({sessionId:p,maxCommits:1},y.signal)).then(h=>{if(!l)return;let w=jt(h);if(!w.ok){D(void 0),ze(void 0),Fe(void 0),Ue(void 0);return}D(Ko(st(w.status),w.stats)),ze(w.head),Fe(w.root),Ue(w.remotes)}).catch(()=>{l&&(D(void 0),ze(void 0),Fe(void 0),Ue(void 0))}),()=>{l=!1,y.abort()}},[p,V,pn]),(0,g.useEffect)(()=>{let l=x?.read;if(p===void 0||x===void 0||typeof l!="function"||!Qn){en(za);return}let y=p,h=new AbortController,w=async(G,Me)=>{try{let $e=ru(await l.call(x,y,Me,{},h.signal));return $e===void 0?void 0:[G,$e]}catch{return}},W=_o.filter(G=>G!==".gitmodules").map(G=>w(G,G));return Le!==void 0&&W.push(w(".gitmodules",`${Le.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(W).then(G=>{if(h.signal.aborted||v.current!==y)return;let Me=new Map;for(let on of G)on!==void 0&&Me.set(on[0],on[1]);let $e=ge.current.get(""),Rs=new Set($e?.status==="ready"?$e.nodes.filter(on=>on.kind==="directory").map(on=>on.name):[]);en(ut(Me,Rs))}),()=>h.abort()},[p,x,Qn,Le,pn]);let[Ya,Za]=(0,g.useState)(void 0),or=(0,g.useRef)(void 0),ko=(0,g.useRef)(0),ir=(0,g.useRef)(void 0),ho=(0,g.useRef)(!1),Fn=(0,g.useCallback)((l,y,h)=>{ko.current+=1,Za({nonce:ko.current,...l===void 0?{}:{path:l},...y===void 0?{}:{delta:y},focus:h})},[]),xn=(0,g.useCallback)((l,y)=>{let h=ci(l);if(xe(w=>{let W=new Set(w);for(let G of h)W.add(G);return W}),!(p===void 0||x===void 0)){for(let w of h)ge.current.get(w)===void 0&&ae(w,p,x);y==="directory"&&ge.current.get(l)===void 0&&ae(l,p,x)}},[x,ae,p]),bo=(0,g.useCallback)(l=>{let y=Wn(ge.current).find(h=>h.path===l);if(xn(l,y?.kind),y?.kind==="directory"&&xe(h=>new Set(h).add(l)),ho.current=!0,y===void 0){ir.current=l;return}Fn(l,void 0,!0)},[Fn,xn]),Jn=(0,g.useCallback)(l=>{Nt(l,{open:xo,reveal:bo})},[xo,bo]);(0,g.useEffect)(()=>{let l=b.viewRequest;if(l==null||l.view!==be)return;let y=`${l.view}:${l.focus}`;Xe.current!==y&&(Xe.current=y,Jn(l.focus),b.completeViewRequest?.())},[b.viewRequest,b.completeViewRequest,Jn]),(0,g.useEffect)(()=>{let l=e.viewFocus;if(l===void 0||p===void 0)return;let y=()=>{let h=l.take(be);h!==void 0&&Jn(h)};return y(),l.subscribe(y)},[e,p,Jn]),(0,g.useEffect)(()=>{if(tn===void 0||fn!==void 0||!Qn||yt(tn))return;let l=On(tn);if(l.length===0||(xe(h=>l.every(w=>h.has(w))?h:new Set([...h,...l])),p===void 0||x===void 0))return;let y=l.filter(h=>ge.current.get(h)?.status!=="ready");y.length!==0&&Promise.all(y.map(h=>ae(h,p,x)))},[tn,fn,Qn,p,x,ae]);let vo=(0,g.useCallback)(()=>{if(typeof document>"u")return!1;let l=document.querySelector("[data-composer-input]");return l===null?!1:(l.focus(),!0)},[]),Qa=(0,g.useCallback)(l=>{if(l.button!==0||gn.current!==null||tu())return;let y=nr.current?.previousElementSibling;if(y instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}gn.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:y.getBoundingClientRect().width,restWidth:pe},document.body.classList.add("fx-pane-resizing")}},[pe]),Ja=(0,g.useCallback)(l=>{let y=gn.current;y===null||y.pointerId!==l.pointerId||yn(co(y.baseWidth+l.clientX-y.startX))},[]),ar=(0,g.useCallback)(l=>{let y=gn.current;if(y===null||y.pointerId!==l.pointerId)return;gn.current=null,document.body.classList.remove("fx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let h=y.baseWidth+l.clientX-y.startX;if(Ra(h,y.baseWidth)){yn(y.restWidth);return}yn(Vt(he,h))},[he]),sr=(0,g.useCallback)(()=>{Sa(he),yn(null)},[he]),es=(0,g.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let y=Ca(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(y===null)return;if(l.preventDefault(),l.stopPropagation(),y.kind==="reset"){sr();return}if(y.kind==="min"||y.kind==="max"){let W=y.kind==="min"?180:520;yn(Vt(he,W));return}let h=nr.current?.previousElementSibling,w=h instanceof HTMLElement?h.getBoundingClientRect().width:pe??180;yn(Vt(he,w+y.delta))},[he,sr,pe]);(0,g.useEffect)(()=>()=>{gn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let l=y=>{if(!(y.isComposing||ii(y.target))){if(ou(y)){let h=H.snapshot().active,w=h===null||d===void 0||p===void 0?void 0:d.find(p,h);if(w===void 0)return;y.preventDefault(),y.stopPropagation(),w.save();return}for(let h of St)if(oi(y,h)){if(h.action==="closePanel"&&H.snapshot().active===null)return;y.preventDefault(),y.stopPropagation(),h.action==="nextPanel"?H.next():h.action==="previousPanel"?H.previous():tr();return}}};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[d,tr,p,H]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let l=Ct({focusComposer:vo,hasModal:()=>fe.current!==null||N.current||Rt(document)}),y=h=>l(h);return document.addEventListener("keydown",y,!0),()=>document.removeEventListener("keydown",y,!0)},[vo]),(0,g.useEffect)(()=>{if(Ne===null||typeof document>"u")return;let l=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),rr())};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[Ne,rr]);let et=(0,g.useMemo)(()=>xt(ue,nn,J,cn),[ue,nn,J,cn]),[Ze,wo]=(0,g.useState)(""),[So,nt]=(0,g.useState)([]),[Ro,tt]=(0,g.useState)(null),[ns,Nn]=(0,g.useState)(!1),[ts,rs]=(0,g.useState)(0),os=(0,g.useCallback)(()=>rs(l=>l+1),[]);(0,g.useEffect)(()=>{let l=li(Ze);if(l===void 0){nt([]),tt(null),Nn(!1);return}let y=()=>{let W=ui(Wn(ge.current),l);nt(Br(W.map(G=>({path:G.path,kind:G.kind==="directory"?"directory":"file"})),J)),tt("loaded"),Nn(!1)},h=u?.();if(h===void 0||p===void 0){y();return}let w=new AbortController;return Nn(!0),Promise.resolve(h.list(p,l,w.signal)).then(W=>{if(w.signal.aborted)return;let G=di(W);nt(Br(G,J)),tt("index"),Nn(!1)},W=>{w.signal.aborted||(console.debug(`[${we}] the file index failed, searching listed rows instead`,W),y())}),()=>w.abort()},[Ze,p,J,u]);let dr=Ro!==null,is=dr?So:et;(0,g.useEffect)(()=>{let l=ir.current;if(l===void 0)return;let y=Wn(ge.current).find(h=>h.path===l);y!==void 0&&(ir.current=void 0,y.kind==="directory"&&(xn(l,y.kind),xe(h=>new Set(h).add(l))),Fn(l,void 0,!0))},[et,Fn,xn]);let[as,rt]=(0,g.useState)(void 0),Co=(0,g.useRef)(!1);(0,g.useEffect)(()=>{if(Co.current||typeof document>"u")return;let l=Uo({rows:et,panelCount:H.snapshot().panels.length,hasModal:Rt(document)});l.kind!=="skip"&&(Co.current=!0,!ho.current&&(l.open!==void 0&&H.open(l.open),rt({path:l.focus})))},[et,H]);let ss=(0,g.useCallback)(()=>rt(void 0),[]),Mn=J===void 0?void 0:Object.keys(J).length,ds=J===void 0?"neutral":Object.values(J).some(l=>l.status==="conflicted")?"conflict":Mn===0?"success":"warning",To=Wo(Y),ls=(0,g.useCallback)(l=>{if(p===void 0||x===void 0)return;if(nn.has(l)){xe(h=>{let w=new Set(h);return w.delete(l),w});return}xe(h=>new Set(h).add(l));let y=ue.get(l);(y===void 0||y.status==="failed")&&ae(l,p,x)},[nn,ue,p,x,ae]),Eo=(0,g.useCallback)(l=>{p===void 0||x===void 0||ae(l,p,x)},[p,x,ae]);(0,g.useEffect)(()=>{let l=!0;if(j.current=!1,p===void 0){K(un(new Date().toISOString()));return}return I.load(p).then(y=>{l&&!j.current&&K(y)}).catch(()=>{}),()=>{l=!1}},[I,p]);let us=(0,g.useCallback)(l=>{let y=[...On(l),l];if(xe(h=>{let w=new Set(h);for(let W of y)w.add(W);return w}),p!==void 0&&x!==void 0){let h=y.filter(w=>ge.current.get(w)?.status!=="ready");h.length>0&&Promise.all(h.map(w=>ae(w,p,x)))}rt({path:l})},[p,x,ae]),cs=(0,g.useCallback)(l=>{H.open(l)},[H]),te=(0,g.useCallback)((l,y)=>{Q.current!==null&&clearTimeout(Q.current),Z({text:l,tone:y}),Q.current=setTimeout(()=>{Q.current=null,Z(null)},4e3)},[]);(0,g.useEffect)(()=>()=>{Q.current!==null&&clearTimeout(Q.current)},[]);let rn=(0,g.useCallback)(l=>{j.current=!0,K(l),p!==void 0&&I.save(p,l).catch(()=>{te(t("bookmarks.saveFailed"),"error")})},[te,I,p,t]),fs=(0,g.useCallback)(l=>{try{rn(fa(A,l.id).tree),te(t("bookmarks.removed"),"ok")}catch{}},[te,A,rn,t]),ps=(0,g.useCallback)((l,y)=>{try{rn(ya(A,l,y))}catch{}},[A,rn]);(0,g.useEffect)(()=>{if(M===void 0){P(void 0);return}let l=!0;return M.capabilities(p??"").then(y=>{l&&P(y.ok?y.capabilities:void 0)}),()=>{l=!1}},[M,p]);let ms=(0,g.useCallback)((l,y,h)=>{let w=l===void 0?"":l.kind==="directory"?l.path:Zi(l.path);if(_({row:l,anchor:y,absolutePath:void 0,trigger:h,createParent:w}),l===void 0||M===void 0)return;let W=l.path;M.info(p??"",W).then(G=>{_(Me=>Me===null||Me.row?.path!==W?Me:{...Me,absolutePath:G.ok?G.info.absolutePath:void 0})})},[p,M]),ys=(0,g.useCallback)(()=>_(null),[]);N.current=F!==null;let ot=(0,g.useMemo)(()=>Wa({remotes:Ae,root:Le,absolutePath:F?.absolutePath,kind:F?.row?.kind??"file",head:Y}),[F?.absolutePath,F?.row?.kind,Le,Y,Ae]),lr=(0,g.useCallback)(l=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${l.code}`)),[t]),gs=(0,g.useCallback)(l=>{let y=F;if(_(null),y===null)return;if(l===ie.createFile||l===ie.createFolder){let w=y.createParent;if(w===void 0)return;Ce({kind:l===ie.createFolder?"directory":"file",parent:w,error:void 0,busy:!1});return}let h=y.row;if(h!==void 0){if(l.startsWith(`${ie.copyRemote}.`)){let w=ot.find(W=>W.id===l);if(w===void 0)return;ln(w.url).then(W=>{te(W?t("notice.copiedRemote").replace("{remote}",w.label):t("notice.copyFailed"),W?"ok":"error")});return}if(l===ie.copyRelative){ln(h.path).then(w=>{te(t(w?"notice.copiedRelative":"notice.copyFailed"),w?"ok":"error")});return}if(l===ie.copyAbsolute){let w=y.absolutePath;if(w===void 0)return;ln(w).then(W=>{te(t(W?"notice.copiedAbsolute":"notice.copyFailed"),W?"ok":"error")});return}if(l===ie.addBookmark){le({mode:"add",target:{name:h.name,path:h.path,kind:h.kind}});return}if(l===ie.reveal){if(M===void 0){te(lr({code:"unsupported",message:""}),"error");return}M.reveal(p??"",h.path).then(w=>{if(!w.ok){te(lr(w.error),"error");return}let W=t(`menu.manager.${k?.fileManager??"directory"}`);te(t("notice.revealed").replace("{manager}",W),"ok")})}}},[te,k,F,ot,lr,p,t,M]),xs=(0,g.useCallback)(l=>{let y=ye;if(y===null)return;if(M===void 0||M.create===void 0){Ce({...y,error:t("prompt.error.unsupported"),busy:!1});return}let h=p;if(h===void 0){Ce({...y,error:t("prompt.error.no-workspace"),busy:!1});return}Ce({...y,busy:!0,error:void 0}),M.create(h,y.parent,l,y.kind).then(w=>{if(!w.ok){Ce(G=>G===null?G:{...G,busy:!1,error:t(`prompt.error.${w.error.code}`)});return}Ce(null);let W=w.path;if(x!==void 0&&ae(y.parent,h,x),y.kind==="file"){H.open(W),te(t("notice.createdFile"),"ok");return}xe(G=>new Set(G).add(W)),x!==void 0&&ae(W,h,x),rt({path:W}),te(t("notice.createdFolder"),"ok")})},[te,x,ae,ye,p,H,t,M]),ks=(0,g.useCallback)(()=>Ce(null),[]),hs=(0,g.useMemo)(()=>F===null?[]:Qi({row:F.row,notices:{workspace:M!==void 0},capabilities:k,absolutePath:F.absolutePath,createParent:F.createParent,remoteLinks:F.row===void 0?void 0:ot,bookmarkTarget:F.row===void 0?void 0:{name:F.row.name,path:F.row.path,kind:F.row.kind}},t),[k,F,ot,t,M]),ur=(0,g.useCallback)(l=>{let y=Wn(ge.current).find(h=>h.path===l);if(xn(l,y?.kind),y?.kind==="directory"){xe(h=>new Set(h).add(l));return}H.open(l)},[xn,H]),bs=(0,g.useCallback)(()=>{or.current!==void 0&&ur(or.current)},[ur]),it=(0,g.useCallback)(()=>{wo(""),nt([]),tt(null),Nn(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,g.useEffect)(()=>{if(Ze===""||typeof document>"u")return;let l=y=>{y.key!=="Escape"||y.isComposing||y.defaultPrevented||fe.current!==null||Rt(document)||(y.preventDefault(),y.stopPropagation(),it())};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[Ze,it]);let vs=()=>xe(new Set),ws=()=>er(l=>l+1),Ss=p===void 0?"no-session":x===void 0?"no-service":ne===void 0||ne.status==="loading"?"loading":ne.status==="failed"?"failed":ne.nodes.length===0?"empty":"tree";return(0,E.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Ss,"data-session":p??"","data-testid":"fs-explorer-view",children:[(0,E.jsxs)("header",{className:"fx-head",children:[(0,E.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,E.jsx)(fo,{open:!0})}),(0,E.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,E.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,E.jsx)(ra,{tree:A,t,onOpenFile:cs,onOpenFolder:us,onCreateGroup:l=>C({mode:"group",parentId:l}),onRename:l=>C({mode:"rename",node:l}),onRemove:fs,onMove:l=>le({mode:"move",node:l}),onReorder:ps}),(0,E.jsxs)("div",{className:"fx-head-meta",children:[ne?.status==="ready"?(0,E.jsxs)("span",{children:[(0,E.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}):null,(0,E.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":Ze===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":Ze!=="",onClick:()=>{Ze!==""?it():os()},children:(0,E.jsx)(Ba,{})}),(0,E.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:nn.size===0,onClick:vs,children:(0,E.jsx)(La,{})}),(0,E.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:p===void 0||x===void 0||ne?.status==="loading",onClick:ws,children:(0,E.jsx)(Ma,{})})]})]}),R===null?null:(0,E.jsx)("div",{className:"fx-notice",role:"status","data-tone":R.tone,"data-testid":"fx-notice",children:R.text}),(0,E.jsx)("div",{className:"fx-main",children:p===void 0?(0,E.jsx)(Xt,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):x===void 0?(0,E.jsx)(Xt,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ne===void 0||ne.status==="loading"?(0,E.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,E.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ne.status==="failed"?(0,E.jsx)(Xt,{title:t("state.failed.title"),description:ne.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Eo(""),testId:"fs-failed"}):ne.nodes.length===0?(0,E.jsx)(Xt,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)("div",{className:"fx-tree-pane",style:pe===null?void 0:{"--fx-tree-width":`${pe}px`},children:[(0,E.jsx)(Ia,{t,value:Ze,origin:Ro,count:So.length,busy:ns,onChange:wo,onStep:l=>Fn(void 0,l,!1),onActivate:bs,onClose:it,focusSignal:ts}),(0,E.jsx)(Aa,{rows:is,selectedPath:fn===void 0?tn:void 0,entryFocus:dr?void 0:as,t,onToggle:ls,onSelect:l=>dr?ur(l):H.open(l),onRetry:Eo,onEntryFocusSettled:ss,onContextMenu:ms,cursorRequest:Ya,onCursorMove:l=>{or.current=l}})]}),(0,E.jsx)("div",{ref:nr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":pe??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Qa,onPointerMove:Ja,onPointerUp:ar,onPointerCancel:ar,onLostPointerCapture:ar,onKeyDown:es,onDoubleClick:sr}),(0,E.jsxs)("div",{className:"fx-editor",children:[(0,E.jsx)(mi,{panels:je.panels,active:je.active,t,onActivate:l=>H.activate(l),onClose:tr,onStep:l=>l===1?H.next():H.previous(),documents:d,sessionId:p}),Ne===null?null:(0,E.jsx)(yi,{name:Ft(Ne.path),t,saving:mn,error:Ye,onSave:Ua,onDiscard:Xa,onCancel:rr}),(0,E.jsx)("div",{className:"fx-editor-body",children:je.panels.length===0?(0,E.jsx)(gi,{t}):je.panels.map((l,y)=>{let h=l.key===je.active;return(0,E.jsx)("div",{className:"fx-panel",id:`fx-panel-${y}`,role:"tabpanel","aria-labelledby":`fx-tab-${y}`,hidden:!h,"data-line":l.line,"data-testid":"fs-panel",children:(0,E.jsx)(Ui,{sessionId:p,files:x,path:l.path,revision:l.revision,git:z,t,visible:h,renderers:a,documents:d,locate:q})},l.key)})})]})]})}),F===null?null:(0,E.jsx)(ea,{entries:hs,anchor:F.anchor,onSelect:gs,onClose:ys,...F.trigger===void 0?{}:{returnFocus:()=>F.trigger??null}}),ye===null?null:(0,E.jsx)(Xn,{kind:ye.kind,parent:ye.parent,t,error:ye.error,busy:ye.busy,onSubmit:xs,onCancel:ks}),oe===null?null:(0,E.jsx)(xa,{tree:A,target:oe.mode==="add"?oe.target:void 0,t,mode:oe.mode,...oe.mode==="move"?{node:oe.node}:{},onCommit:l=>{let y=oe.mode;rn(l),le(null),te(t(y==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>le(null)}),S===null?null:(0,E.jsx)(Xn,{kind:"directory",parent:"",t,initialName:S.mode==="rename"?S.node.name:t("bookmarks.newGroup"),titleKey:S.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:l=>{let y=S;C(null);try{if(y.mode==="rename"){rn(pa(A,y.node.id,l)),te(t("bookmarks.renamed"),"ok");return}let h=Gn("group",{id:Jl(),name:l,createdAt:Date.now()});rn(Un(A,y.parentId,h)),te(t("bookmarks.groupCreated"),"ok")}catch{te(t("bookmarks.saveFailed"),"error")}},onCancel:()=>C(null)}),ne?.status==="ready"?(0,E.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,E.jsxs)("span",{children:[t("view.scope")," ",(0,E.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}),ne.truncated?(0,E.jsx)("span",{className:"fx-foot-warn",children:Dn({entries:ne.nodes,truncated:!0,total:ne.total}).label}):null,(0,E.jsxs)("span",{className:"fx-foot-git","data-state":Mn===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,E.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ds,"aria-hidden":"true"}),Mn===void 0?t("status.unavailable"):Mn===0?t("status.clean"):t("status.summary").replace("{count}",String(Mn))]}),To===null?null:(0,E.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[To,Y?.upstream!==void 0&&(Y.ahead??0)>0?(0,E.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(Y.ahead)}`}):null,Y?.upstream!==void 0&&(Y.behind??0)>0?(0,E.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(Y.behind)}`}):null]}),(0,E.jsx)("span",{className:"fx-spacer"}),(0,E.jsx)("span",{children:t("foot.order")})]}):null]})}return m}var _a=["slots","locale","workbench","remote"];function au(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Yt,Zt,yo,Qt,go,Ha;function $a(e){return go=e,Qt!==void 0||(Qt=ri({open:(n,t,r)=>{let o=go;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ni(o)(n,t,r)},save:(n,t)=>{let r=go;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ti(r)(n,t)}})),Qt}function su(){if(yo!==void 0)return yo;let e=Wt({warn:n=>Ha?.(n)});for(let n of ro())e.register(n);return yo=e,e}var Jt;function Ga(e){let n=e.workbench;if(n==null)return()=>{};Ha=u=>e.logger?.warn?.(u);let t=su(),r={version:Li,renderers:t,registerRenderer:u=>t.register(u),documents:$a(e)};Zt?.();let o=e.provide?.(Ur,r);o===void 0&&e.logger?.warn?.(`${An}: ctx.provide unavailable, ${Ur} service not registered`),Zt=o,Yt?.();let i=e.locale.register(An,{zh:{...Cr,...Ar.zh,...no.zh},en:{...Tr,...Ar.en,...no.en}});Yt=i;let a=e.locale.bind(An),d=Yi(typeof document>"u"?void 0:document),c=ja({workbench:n,version:n.version,t:a,files:Ki(e),status:Gi(e),git:$i(e),renderers:t,documents:$a(e),locate:u=>ei(e,u),workspace:()=>Da(e),fileReferences:si(e)});Jt?.();let s=Rr(e,n);return Jt=s,e.slots.inject(fr,()=>e.slots.register({name:fr,id:be,order:100,label:()=>Er(au(e)),locale:An},c)),()=>{o?.(),Zt===o&&(Zt=void 0),s(),Jt===s&&(Jt=void 0),d(),i(),Yt===i&&(Yt=void 0)}}var Va={buildTree:ft,describeListing:Dn,iconFor:kn,computeTreeWindow:pt,flattenTree:xt,badgeFor:hn,formatSize:kt,joinPath:bn,listingPath:mt,parseFocus:gt,consumeViewRequest:Nt,createPanelStack:Lr,createEscapeHandler:Ct,KEYMAP:St,tabLabel:Er,normalizeListing:zt,normalizeStatusSnapshot:jt,buildWorkspaceMap:ut,workspaceTagFor:ct,parseStatusZ:st,statusTone:In,statusBadge:dt,createPreviewLoader:Bt,renderMarkdown:Mt,languageFor:jn,isMarkdownFile:$n,describePage:Lt,classifyPreviewFailure:dn,normalizePreviewPage:Sn,previewChunkRoute:Si,canBridgeFile:ht,decideBridge:wr,focusForFileAddress:vr,forwardFocus:Sr,registerAddressBridge:Rr},qa={name:"dsh-fs-explorer",inject:_a,apply:Ga,__test:Va};function du(e){Ti(e),wi(e)}var lu=qa;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
