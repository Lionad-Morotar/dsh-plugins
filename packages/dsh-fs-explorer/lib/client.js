window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var nt=Object.defineProperty;var ui=Object.getOwnPropertyDescriptor;var ci=Object.getOwnPropertyNames;var fi=Object.prototype.hasOwnProperty;var pi=(e,n)=>{for(var t in n)nt(e,t,{get:n[t],enumerable:!0})},yi=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ci(n))!fi.call(e,o)&&o!==t&&nt(e,o,{get:()=>n[o],enumerable:!(r=ui(n,o))||r.enumerable});return e};var mi=e=>yi(nt({},"__esModule",{value:!0}),e);var bs={};pi(bs,{__test:()=>Go,apply:()=>$o,boot:()=>hs,clientPlugin:()=>Vo,default:()=>vs,inject:()=>Ko});module.exports=mi(bs);var He=require("react");var ar="dsh-resource://file/";function sr(e){try{return decodeURIComponent(e)}catch{return e}}function Ye(e){if(!e.startsWith(ar))return null;let n=e.slice(ar.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=sr(t.slice(0,r)),i=t.slice(r+1),d=i.search(/[?#]/u),l=d<0?i:i.slice(0,d);return l.length===0?null:{sessionId:o,path:l.split("/").map(sr).join("/")}}function ve(e){return e.slice(e.lastIndexOf("/")+1)}var dr=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function lr(){return dr.flatMap(e=>[...e.extensions])}function Ze(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return dr.find(o=>o.extensions.includes(r))?.family??null}var fe="dsh-fs-explorer",tt="conversation.view",Q="fs-explorer";var Je="fs-explorer",ur="fsExplorerDocuments",cr="fsExplorerWorkspace",fr="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",rt={chunk:"client.preview.js"},cn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var gi={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},xi={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},hi=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function yr(e){return typeof e=="string"&&hi.has(e)}function pr(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function vi(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function fn(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let d=o.slice(2);d!==""&&(n[d]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let d=pr(o.slice(2),i==="1"?7:8);if(d===null)continue;let l=d.fields[0]??"",u=d.rest;if(u===""||l.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:vi(l[0]??".",l[1]??".")};continue}if(i==="u"){let d=pr(o.slice(2),9);if(d===null)continue;let l=d.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function Qe(e){return yr(e)?gi[e]:"neutral"}function pn(e){return yr(e)?xi[e]:"?"}function ot(e){return`status.${e}`}function mr(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function gr(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function xr(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function hr(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var bi=["conflicted","deleted","renamed","added","modified","untracked"];function wi(e){return Qe(bi.find(n=>e.has(n))??"modified")}function vr(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let d=i.split("/"),l=r.endsWith("/")?d.length:d.length-1,u="";for(let s=0;s<l;s+=1){let a=d[s];if(a===void 0||a==="")continue;u=u===""?a:`${u}/${a}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:wi(o.present)});return t}var kr=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Sr=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function ki(e){return Sr.test(e)?e.slice(0,e.indexOf("/")):null}function Si(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ri(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let d=Si(i[2]??"");d!==""&&Sr.test(d)&&t.push(d)}return t}function Ci(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let d=i.trim();if(d===""||d.startsWith("#")||d.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(d);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(d);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function br(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function wr(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function yn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of Ci(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of Ri(i))o.add(l);let d=e.get("package.json");if(typeof d=="string"){let l=br(d);if(l!==void 0){let u=l.workspaces,s=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let a of wr(Array.isArray(u)?u:s))o.add(a)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let s=br(u);if(s!==void 0)for(let a of wr(s.packages))o.add(a)}for(let l of o){let u=ki(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function mn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Pi=new Set(["node_modules",".git","dist","__pycache__"]);function Ei(e){return Pi.has(e)}function Ti(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function gn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Ei(r))continue;let o=Ti(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Fi=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Mi=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Li=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Ni=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Ii=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Di=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Ai=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Rr(e){let n=ve(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Be(e,n="file"){if(n==="directory")return"folder";let t=ve(e.toLowerCase());if(Ai.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Rr(t);return r===""?"file":Fi.has(r)?"code":Mi.has(r)?"markdown":Li.has(r)?"data":Ni.has(r)?"image":Ii.has(r)?"style":Di.has(r)?"archive":"file"}var Wi={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Oi={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Ke(e){let n=ve(e.toLowerCase()),t=Wi[n];if(t!==void 0)return t;let r=Rr(n),o=Oi[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function en(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${fr} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function xn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),d=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),d),s=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,s),startIndex:u,endIndex:s}}function at(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function hn(e){return e===""?".":e}function vn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function bn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Cr(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=bn(r,o),t.push(r);return t}function it(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function wn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let l=it(t[2]),u=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""||l<1?void 0:{path:u,line:l,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let l=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return l===""?void 0:{path:l,line:it(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let d=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(d!=="")return{path:d,line:it(o[2]),absolute:!1}}function Pr(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Er(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function kn(e,n,t,r){let o=[],i=vr(t),d=(l,u)=>{let s=e.get(l);if(!(s===void 0||s.status!=="ready"))for(let a of s.nodes){let f=bn(l,a.name),m=a.kind==="directory",p=m&&n.has(f),h=m||t===void 0?void 0:t[f],v=h?.status??(m?void 0:mr(f,t)),F=h===void 0?void 0:gr(h),V=m?i.get(f):void 0,A=m?mn(r,f):void 0;if(o.push({type:"entry",path:f,name:a.name,kind:a.kind,depth:u,expanded:p,...a.size===void 0?{}:{size:a.size},...v===void 0?{}:{status:v},...V===void 0?{}:{statusCount:V.count,statusTone:V.tone},...F===void 0?{}:{diff:F},...A===void 0?{}:{tag:A}}),!p)continue;let I=e.get(f);if(I===void 0||I.status==="loading"){o.push({type:"status",key:`${f}:loading`,path:f,depth:u+1,state:"loading"});continue}if(I.status==="failed"){o.push({type:"status",key:`${f}:failed`,path:f,depth:u+1,state:"failed",message:I.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(I.nodes.length===0){o.push({type:"status",key:`${f}:empty`,path:f,depth:u+1,state:"empty"});continue}d(f,u+1),I.truncated&&o.push({type:"status",key:`${f}:truncated`,path:f,depth:u+1,state:"truncated",label:en({entries:I.nodes,truncated:!0,total:I.total}).label})}};return d("",0),o}var ji=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function zi(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function _i(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&ji.has(zi(n.path)))}function Tr(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=_i(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Sn(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var st="dsh-fs-explorer:bridge",Bi="fs-explorer-bridge",Nr="dsh-resource://file/**",dt="sidebar.right.pane.tab",Ki=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Hi=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),$i=new Set(["makefile","dockerfile","license","readme","changelog"]),Gi=new Set([...lr(),...Ki]);function Vi(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function Rn(e){if(typeof e!="string"||e==="")return!1;let n=ve(e).toLowerCase();if(n==="")return!1;let t=Vi(n);return Hi.has(t)?!1:$i.has(n)?!0:Gi.has(t)}function qi(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function Ui(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function ct(e,n){if(typeof e!="string")return;let t=Ye(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=Ui(n,qi(e));return`${vn(r)?"abs:":"path:"}${r}:${String(o)}`}function ft(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Ye(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Rn(r.path))return{action:"keep",reason:"refused"};let o=ct(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function be(e,n){n===void 0?console.warn(`[${fe}] ${e}`):console.warn(`[${fe}] ${e}`,n)}function Xi(e){console.debug(`[${fe}] ${e}`)}function lt(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function ut(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Ae(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Fr(e){return Ae(()=>e.sidebarRightTabs,lt)??Ae(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,lt)}function Mr(e){return Ae(()=>e.sidebarRight,ut)??Ae(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,ut)}function Lr(e){return typeof e=="function"?e:()=>{}}var Yi="dsh-resource://file/session/probe/src/main.ts";function Zi(e){let n=Ae(()=>(typeof e.candidates=="function"?e.candidates(Yi):[]).filter(r=>r.priority==="extension"&&r.id!==st),t=>Array.isArray(t)&&t.length>0);n!==void 0&&be(`another extension-band tab type already claims ${Nr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Ji(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Qi(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function ea(e,n){let t=e.viewFocus;if(t?.request?.(Q,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(Q,n);return(!r.opened||r.focused)&&t?.take(Q),r}return typeof e.openView=="function"&&e.openView(Q,n)?(t?.take(Q),{opened:!0,focused:!0}):(t?.take(Q),{opened:!1,focused:!1})}function pt(e,n,t,r){let o;try{o=ea(e,r)}catch(i){return be("the file workbench threw while switching views",i),e.viewFocus?.take(Q),!1}if(!o.opened)return be(`the file workbench did not switch to ${Q}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return be("the forwarded tab could not be closed",i),!1}}function na(e,n){function t({useTabInfo:r}){let i=r()?.tab,d=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=Ji(i),u=Qi(i),s=(0,He.useRef)(void 0);return(0,He.useEffect)(()=>{if(d===void 0){be("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===d)return;s.current=d;let a=ft(l,e.currentSessionId(),u);if(a.action!=="open"){be(`left the forwarded tab standing (${a.reason})`,l);return}pt(e,n,d,a.focus)},[d,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(be(`the host did not inject useTabInfo into ${dt}; the bridge cannot forward`),null):(0,He.createElement)(t,{useTabInfo:o.useTabInfo})}}function yt(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;Zi(l);let s;try{s=l.register({id:st,kind:Bi,patterns:[Nr],priority:"extension",canOpen:m=>{let p=Ye(m);return p!==null&&Rn(p.path)},title:m=>ve(Ye(m)?.path??m)||m})}catch(m){be("the sidebar right refused the address bridge tab type",m);return}let a=na(n,u),f;try{f=Lr(e.slots.inject(dt,()=>e.slots.register({name:dt,key:st},a)))}catch(m){s(),be("the sidebar right refused the address bridge body",m);return}return()=>{f(),s()}},r=Fr(e),o=Mr(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return Xi("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let d=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=Ae(()=>l.get?.("sidebarRightTabs"),lt)??Fr(l),s=Ae(()=>l.get?.("sidebarRight"),ut)??Mr(l);return t(u,s)});return Lr(d)}var mt={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25"},gt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed"};function xt(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?mt:gt)["tab.label"]??"Files"}var ta=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ee(e){return e!==null&&typeof e=="object"}function Pn(e,n){return{ok:!1,code:e,message:n}}function En(e){let n=ee(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Pn(t,r)}function ht(){return Pn("invalid-response","the document service answered an invalid response")}function Cn(e){try{return e()}catch{return}}function ra(e){let n=ee(e)?e:void 0;if(n===void 0)return ht();if(n.ok===!1)return En(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0)return ht();if(r.ok===!1)return En(r.error);let o=ee(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?ht():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function oa(e){let n=ee(e)?e:void 0;if(n===void 0)return Ir();if(n.ok===!1)return En(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0)return Ir();if(r.ok===!1)return En(r.error);let o=ee(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Ir(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function vt(e){return ee(e)&&typeof e.open=="function"}function ia(e){let n=Cn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ee(n)?n.rpc:void 0;if(!(!ee(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${ur}/${r}`,o,i)}function aa(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function sa(e){let n=ee(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=ee(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function Dr(e,n){let t=wt(e);return async(r,o)=>{let i=t(),d=i?.locate;if(typeof d=="function")try{return sa(await d.call(i,{sessionId:n,path:r},o))}catch{return}}}function wt(e){return()=>{let n=Cn(()=>e.fsExplorerDocuments);if(vt(n))return n;let t=Cn(()=>ee(e.remote)?e.remote.fsExplorerDocuments:void 0);if(vt(t))return t;let r=Cn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(vt(r))return r;let o=ia(e);if(o!==void 0)return aa(o)}}function Ar(e){let n=wt(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Pn("unavailable","the document service is unavailable");try{return ra(await i.open({sessionId:t,path:r},o))}catch(d){return Pn("io-error",d instanceof Error?d.message:String(d))}}}function Wr(e){let n=wt(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return oa(await i.call(o,t,r))}catch(d){return{ok:!1,code:"io-error",message:d instanceof Error?d.message:String(d)}}}}function Or(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},d=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let s=o(l,u),a=n.get(s);return a===void 0&&(a={session:new bt(l,u,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,a),i()),a.session.retain(),a.session},peek(l,u){return d(l,u)?.getSnapshot()},find:d,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var bt=class{constructor(n,t,r,o,i,d){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=d}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=ta;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let d=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:d,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:d}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let d=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:d}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Tn=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function da(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function jr(e,n,t=da()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",d=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===d&&e.shiftKey===!0===l}function zr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function la(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function kt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Fn(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&la(n),e.onClose?.()}}var $e=require("react");function Ln(e){let n=ve(e);return n===""?e:n}function Mn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var ua=Object.freeze({panels:Object.freeze([]),active:null});function _r(e,n){return n===void 0?e:`git\0${n}\0${e}`}var ca=/^git:([0-9a-f]{4,64}):(.+)$/iu;function St(){let e=[],n=null,t=ua,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(a=>a.key===s),d=s=>e.findIndex(a=>a.revision===void 0&&a.key===s),l=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let a=ca.exec(s);if(a!==null){let p=(a[1]??"").toLowerCase(),h=Mn(a[2]??"",!1);if(h===void 0)return;let v=_r(h,p);return i(v)>=0?v:void 0}let f=Mn(s,!0);if(f===void 0)return;if(d(f)>=0)return f;let m=Mn(s,!1);if(!(m===void 0||m===f))return d(m)>=0?m:void 0},u=s=>{if(e.length===0)return;let a=n===null?-1:i(n),f=e[(a+s+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(s,a=1,f=!1,m){let p=Mn(s,f);if(p===void 0)return;let h=typeof m=="string"&&m.trim()!==""?m.trim().toLowerCase():void 0,v=_r(p,h),F=Number.isFinite(a)&&a>0?Math.trunc(a):1,V=i(v);if(V>=0){let j=e[V],M=j!==void 0&&(j.line!==F||j.absolute!==f);if(M&&(e=e.map((H,oe)=>oe===V?{...H,line:F,absolute:f}:H)),n===v){M&&o();return}n=v,o();return}let A=n===null?e.length:i(n)+1,I={key:v,path:p,line:F,absolute:f,...h===void 0?{}:{revision:h}};e=[...e.slice(0,A),I,...e.slice(A)],n=v,o()},close(s){let a=s===void 0?n:l(s)??null;if(a===null)return;let f=i(a);f<0||(e=e.filter(m=>m.key!==a),n===a&&(n=(e[f]??e[f-1])?.key??null),o())},activate(s){let a=l(s);a===void 0||i(a)<0||n===a||(n=a,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let a=l(s);return a!==void 0&&i(a)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function Br(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=St();return e.set(t,o),o}}}function nn(e,n){let t=wn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var L=require("react/jsx-runtime"),Rt={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},fa=()=>()=>{},pa=()=>"";function ya(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Kr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:d,sessionId:l}){let u=(0,$e.useRef)(null);(0,$e.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,$e.useSyncExternalStore)(d?.subscribe??fa,()=>ya(d,l,e).join("\0"),pa),a=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let f=m=>{if(m.key==="ArrowRight"||m.key==="ArrowLeft"){m.preventDefault(),m.stopPropagation(),i(m.key==="ArrowRight"?1:-1);return}(m.key==="Delete"||m.key==="Backspace")&&n!==null&&(m.preventDefault(),m.stopPropagation(),o(n))};return(0,L.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:f,"data-testid":"fs-tabs",children:e.map((m,p)=>{let h=m.key===n,v=Ln(m.path),F=t("panel.close").replace("{name}",v);return(0,L.jsxs)("div",{className:"fx-tab","data-active":h?"true":"false","data-dirty":a.has(m.path)?"true":"false",role:"presentation",children:[(0,L.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${p}`,"aria-controls":`fx-panel-${p}`,"aria-selected":h,tabIndex:h?0:-1,title:m.path,"data-testid":"fs-tab","data-path":m.path,"data-key":m.key,ref:h?u:void 0,onClick:()=>r(m.key),children:[(0,L.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Be(m.path),"aria-hidden":"true",children:Ke(m.path)}),(0,L.jsx)("span",{className:"fx-tab-name",children:v}),m.revision===void 0?null:(0,L.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:m.revision,children:m.revision.slice(0,7)}),a.has(m.path)?(0,L.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,L.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:h?0:-1,"aria-label":F,title:F,"data-testid":"fs-tab-close",onClick:()=>o(m.key),children:"\xD7"})]},m.key)})})}function Hr({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:d}){return(0,L.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,L.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,L.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,L.jsx)("span",{className:"fx-spacer"}),(0,L.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,L.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,L.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:d,children:n("panel.confirm.cancel")})]})}function ma(){return(0,L.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,L.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,L.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,L.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function $r({t:e}){return(0,L.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,L.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,L.jsx)(ma,{})}),(0,L.jsx)("strong",{children:e("panel.empty.title")}),(0,L.jsx)("span",{children:e("panel.empty.description")}),(0,L.jsxs)("span",{className:"fx-empty-keys",children:[(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,L.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Gr=require("react");function q(e,n,...t){let r=t.filter(d=>d!=null&&d!==!1),o=(0,Gr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function ga(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var xa=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function We(e){let n=[],t=0;for(let r of e.matchAll(xa)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(q("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(q("strong",null,...We(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(q("del",null,...We(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(q("em",null,...We(i.slice(1,-1))));else{let d=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=d?.[1]??i,u=d===null?void 0:ga(d[2]??"");n.push(u===void 0?l:q("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Vr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,qr=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Ur=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Ct=/^\s{0,3}>\s?(.*)$/u,Pt=/^\s{0,3}[-*+]\s+(.*)$/u,Et=/^\s{0,3}\d+[.)]\s+(.*)$/u;function ha(e){return Vr.test(e)||qr.test(e)||Ur.test(e)||Ct.test(e)||Pt.test(e)||Et.test(e)}function Xr(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Vr.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),a=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(q("pre",null,q("code",a===""?null:{className:`language-${a}`},f.join(`
`))));continue}let i=qr.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(q(`h${String(s)}`,null,...We(i[2]??""))),t+=1;continue}if(Ur.test(r)){n.push(q("hr",null)),t+=1;continue}if(Ct.test(r)){let s=[];for(;t<e.length;){let a=Ct.exec(e[t]??"");if(a===null)break;s.push(a[1]??""),t+=1}n.push(q("blockquote",null,...Xr(s)));continue}if(Pt.exec(r)!==null){let s=[];for(;t<e.length;){let a=Pt.exec(e[t]??"");if(a===null)break;s.push(q("li",null,...We(a[1]??""))),t+=1}n.push(q("ul",null,...s));continue}if(Et.exec(r)!==null){let s=[];for(;t<e.length;){let a=Et.exec(e[t]??"");if(a===null)break;s.push(q("li",null,...We(a[1]??""))),t+=1}n.push(q("ol",null,...s));continue}let u=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||ha(s))break;u.push(s.trim()),t+=1}n.push(q("p",null,...We(u.join(" "))))}return n}function Nn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return q("div",{className:"fx-md"},...Xr(n))}var Tt=200,va={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function on(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":va[t.slice(r+1)]??"plaintext"}function an(e){return on(e)==="markdown"}var X=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function tn(e){return e!==null&&typeof e=="object"}function ba(e){return e===""?0:e.split(`
`).length}function Ge(e,n){if(!tn(e))throw new X("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let a=tn(e.error)?e.error:{},f=typeof a.code=="string"?a.code:"preview/unknown",m=typeof a.message=="string"?a.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",p=tn(a.details)?a.details:{},h=typeof p.kind=="string"?p.kind:"";throw new X(f,m,h)}let t=e.ok===!0?e.value:e;if(!tn(t)||typeof t.text!="string")throw new X("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):ba(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,d=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:d,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?s:{...s,totalLines:o}}function Oe(e){let n=tn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var rn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function In({files:e,maxLines:n=Tt}){let t=Math.max(1,Math.trunc(n)),r=rn,o=0,i=null,d=[1],l=new Set,u=a=>{r=a;for(let f of l)f()},s=async(a,f)=>{o+=1;let m=o;i?.abort();let p=new AbortController;i=p,u({status:"loading",path:a,text:r.path===a?r.text:"",offset:f,lines:r.path===a?r.lines:0,...r.path===a&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===a&&r.source!==void 0?{source:r.source}:{},eof:r.path===a?r.eof:!1});try{let h=await e.read(a,f>1?{offset:f,limit:t}:{limit:t},p.signal);if(m!==o)return;let v=Ge(h,f);if(v.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let F={status:"ready",path:a,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof,...v.source===void 0?{}:{source:v.source},...v.linkTarget===void 0?{}:{linkTarget:v.linkTarget,linkPath:a}};u(v.totalLines===void 0?F:{...F,totalLines:v.totalLines})}catch(h){if(m!==o||p.signal.aborted)return;u({status:"failed",path:a,text:"",offset:f,lines:0,eof:!1,failure:Oe(h)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(a){return l.add(a),()=>{l.delete(a)}},async open(a){d=[1],await s(a,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let a=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&a>r.totalLines||(d.push(a),await s(r.path,a))},async prev(){if(r.path===void 0||d.length<=1)return;d=d.slice(0,-1);let a=d[d.length-1]??1;await s(r.path,a)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,d=[1],u(rn)}}}function Dn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Ft=Object.freeze({chunk:rt.chunk,id:`${fe}/${rt.chunk}`}),Mt=null,sn=null,An=new Map;function Yr(e){Mt=e}function Zr(){return Ft}function wa(e){let n=cn[e];return{chunk:n,id:`${fe}/${n}`}}function Lt(){if(sn!==null)return sn;let e=Mt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${fe}: the loader require was not handed over`));let n=e.async(`./${Ft.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${fe}: chunk ${Ft.id} is missing its preview renderers`);return r});return sn=n,n.catch(()=>{sn===n&&(sn=null)}),n}function Jr(e){let n=An.get(e);if(n!==void 0)return n;let t=Mt;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${fe}: the loader require was not handed over`));let r=wa(e),o=t.async(`./${r.chunk}`).then(i=>{let d=i;if(d===null||typeof d.FamilyView!="function"||d.renderer!==e)throw new Error(`${fe}: chunk ${r.id} is not the ${e} view`);return d});return An.set(e,o),o.catch(()=>{An.get(e)===o&&An.delete(e)}),o}var Qr=Object.freeze({}),ka="@deepseek-ai/dsh-client-ui-primitives",It=null,Nt;function eo(e){It=e}function Sa(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function no(){if(Nt!=null)return Nt;if(It===null)return Qr;let e=Sa(It,ka);if(e===void 0)return Qr;let n=s=>{let a=e[s];if(typeof a=="function"||typeof a=="object"&&a!==null)return a},t=s=>{let a=e[s];return typeof a=="function"?a:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let d=n("MenuItemButton");d!==void 0&&(r.MenuItemButton=d);let l=n("IconChevronDownOutlineRegular");l!==void 0&&(r.IconChevronDownOutlineRegular=l);let u=t("useAnchoredPosition");return u!==void 0&&(r.useAnchoredPosition=u),r}var E=require("react");async function Ve(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var we=require("react/jsx-runtime");function Ra(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Ca(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Dt({failure:e,t:n,onRetry:t}){return(0,we.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,we.jsx)("strong",{children:Ra(e,n)}),(0,we.jsx)("span",{children:Ca(e,n)}),e.message===""?null:(0,we.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,we.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function At({t:e}){return(0,we.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,we.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Wt="fsExplorer",to=1;function Pa(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Ea(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Ta(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Fa(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Wn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let d=i?.id;if(typeof d!="string"||d==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${d}" has no load(); it was refused`),()=>{};if(t.has(d))return n(`renderer registry: "${d}" is already registered; the first registration stays`),()=>{};t.set(d,{contribution:i,extensions:(i.match?.extensions??[]).map(Ea),families:[...i.match?.families??[]]}),o();let l=!0;return()=>{l&&(l=!1,t.delete(d),o())}},resolve(i){let d=Pa(i.path),l=Ze(i.path),u;for(let s of t.values())Ta(s,d,l)&&(u===void 0||Fa(s.contribution,u.contribution))&&(u=s);return u?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function ro(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function On(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function ke(e){try{return e()}catch{return}}function me(e){return e!==null&&typeof e=="object"}function lo(e){return()=>{let n=ke(()=>e.workspaceFiles);if(On(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(On(t))return t;let r=ke(()=>e.remote?.workspaceFiles);if(On(r))return r;let o=ke(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(On(o))return o}}function uo(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function co(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),d;try{return Ge(i,r.offset??1),i}catch(s){if(!(s instanceof X)||Oe(s).kind!=="symlink")throw s;d=s}let l=await n(t,o);if(l===void 0)throw d;return{...Ge(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function oo(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Ma(e){let n=ke(()=>typeof e.get=="function"?e.get("connection"):void 0),t=me(n)?n.rpc:void 0;if(!me(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function fo(e){return()=>{let n=ke(()=>e.remote?.gitExplorer);if(oo(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return oo(t)?t:Ma(e)}}function La(e){return e===""?0:e.split(`
`).length}function io(e){let n=me(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new X(t,r)}function po(e,n,t){return{async read(r,o,i){let d={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(d,i);if(!me(l))throw new X("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw io(l.error);let u=l;if(l.ok===!0&&(u=l.value),!me(u))throw new X("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw io(u.error);let s=u;if(u.ok===!0&&(s=u.page),!me(s))throw new X("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new X("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new X("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new X("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let a=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):La(s.text),f=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,m=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:a,offset:f,eof:s.eof===!0,...m===void 0?{}:{source:m}}}}}function Na(e){if(!me(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=me(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Ia(e){let n=me(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=me(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new X(t,r,i)}function zt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Na(await n.call(e,t,r,{},o));if(!i.ok)throw Ia(i.error);return i.value.data}}function dn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Ot(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function jn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:dn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Ot(r.value):{ok:!1,message:dn(r.error)}}return Ot(t)}return Ot(n)}function yo(e){return e instanceof Error?e.message:dn(e)}function ao(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function mo(e){return()=>{let n=ke(()=>e.remote?.gitExplorer);if(ao(n))return n;let t=ke(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(ao(t))return t}}function so(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Da(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=so(r.additions),i=so(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Aa(e){if(e===null||typeof e!="object")return;let n=e,t=d=>typeof d=="number"&&Number.isFinite(d)&&d>=0?d:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function jt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Da(n.stats),r=Aa(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function zn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:dn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?jt(o.snapshot):{ok:!1,message:dn(o.error)}}let r=e;return r.snapshot!==void 0?jt(r.snapshot):jt(t)}var b=require("react/jsx-runtime"),Ht={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Wa=()=>()=>{},go=()=>{};function $t(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var _t={status:"idle"},Oa=[".md",".mdx",".markdown",".mdown"],ja=-1e3;function Kt({t:e,revision:n}){return(0,b.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,b.jsx)("strong",{children:e("preview.unavailable.title")}),(0,b.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function xo({chunk:e,text:n,path:t,offset:r}){let o=(0,E.useRef)(null),i=(0,E.useRef)(null),[d,l]=(0,E.useState)(!1),u=on(t);return(0,E.useEffect)(()=>{l(!1)},[e,t]),(0,E.useEffect)(()=>{let s=o.current;if(!(e===null||s===null))try{let a=e.mountCodePreview(s,{text:n,language:u,path:t,offset:r});return i.current=a,()=>{a.destroy(),i.current=null}}catch{l(!0);return}},[e,t,u]),(0,E.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||d?(0,b.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,b.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function za({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&an(n)?(0,b.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Nn(r)}):(0,b.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function _a(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,b.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,b.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,b.jsx)(xo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Ba(e){function n({page:t,path:r}){return(0,b.jsx)(xo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Ka({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:d}){let l=(0,E.useMemo)(()=>{let u=zt(r);return u===void 0||t===void 0||d===void 0?u:async(s,a,f)=>{if(s!==t||a!==n)return u(s,a,f);let m=await d(a,f);return u(s,m?.absolutePath??a,f)}},[r,t,n,d]);return t===void 0||l===void 0?(0,b.jsx)(Kt,{t:o}):(0,b.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function Ha(e){return{Body:n=>(0,b.jsx)(Ka,{chunk:e,...n}),renderer:e.renderer}}function Gt(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Oa]},priority:0,load:()=>Lt().then(_a)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:ja,load:()=>Lt().then(Ba)},...Object.keys(cn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Jr(e).then(Ha)}))]}var Bt;function $a(){if(Bt!==void 0)return Bt;let e=Wn();for(let n of Gt())e.register(n);return Bt=e,e}function ho({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:d=!0,renderers:l,documents:u,locate:s}){let a=(0,E.useMemo)(()=>{let T=r===void 0?uo(n,e):o===void 0||e===void 0?void 0:po(o,e,r);return T===void 0||r!==void 0||s===void 0?T:co(T,s)},[n,e,r,o,s]),f=(0,E.useMemo)(()=>r===void 0?zt(n):void 0,[n,r]),m=l??$a(),p=t===void 0?null:Ze(t),h=p!==null,v=r===void 0&&e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[F,V]=(0,E.useState)(null),[A,I]=(0,E.useState)(rn),[j,M]=(0,E.useState)(_t),[H,oe]=(0,E.useState)(0),[Re,Fe]=(0,E.useState)(0),[Ce,le]=(0,E.useState)("reading"),[ne,y]=(0,E.useState)(!1),[C,w]=(0,E.useState)(!1),[_,$]=(0,E.useState)(void 0),[ue,ie]=(0,E.useState)(!1),te=(0,E.useRef)(void 0),Y=(0,E.useRef)(void 0),B=(0,E.useSyncExternalStore)(u?.subscribe??Wa,()=>u===void 0||e===void 0||t===void 0?go():u.peek(e,t),go),D=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,E.useEffect)(()=>{if(a===void 0){V(null);return}let T=In({files:a,maxLines:Tt});return V(T),()=>T.close()},[a]),(0,E.useEffect)(()=>{if(F===null){I(rn);return}return I(F.getSnapshot()),F.subscribe(()=>I(F.getSnapshot()))},[F]),(0,E.useEffect)(()=>{F===null||t===void 0||p!==null||F.open(t)},[F,t,p]),(0,E.useEffect)(()=>{if(!h||t===void 0||s===void 0){$(void 0);return}let T=new AbortController,U=!0;return(async()=>{let de=await s(t,T.signal);U&&!T.signal.aborted&&$(de?.absolutePath)})(),()=>{U=!1,T.abort()}},[h,t,s]),(0,E.useEffect)(()=>{le("reading"),y(!1),ie(!1)},[t]),(0,E.useEffect)(()=>()=>{te.current!==void 0&&clearTimeout(te.current),Y.current!==void 0&&clearTimeout(Y.current)},[]),(0,E.useEffect)(()=>{B?.conflict!==!0&&(w(!1),ie(!1),Y.current!==void 0&&clearTimeout(Y.current))},[B?.conflict]),(0,E.useEffect)(()=>m.subscribe(()=>oe(T=>T+1)),[m]),(0,E.useEffect)(()=>{if(t===void 0||r!==void 0){M(_t);return}let T=ro(m,{path:t});if(T===void 0){M(_t);return}let{contribution:U}=T,de=!0;return M(O=>O.status==="ready"&&O.contribution.id===U.id?O:{status:"loading",contribution:U}),T.module.then(O=>{de&&M({status:"ready",contribution:U,module:O})},O=>{de&&M({status:"failed",contribution:U,failure:Oe(O)})}),()=>{de=!1}},[m,t,r,H,Re]),t===void 0)return(0,b.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,b.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,b.jsx)("strong",{children:i("preview.empty.title")}),(0,b.jsx)("span",{children:i("preview.empty.description")})]})});let z=h&&r!==void 0,N=Dn(A),ae=A.linkPath??t,pe=h?_:A.linkTarget,Pe=!h&&an(t),Me=h?!z&&v!==null&&j.status!=="ready"&&j.status!=="failed":A.status==="loading",Le=A.status==="ready",qe=Pe&&Ce==="reading",ye=h?z||v===null?"unavailable":j.status==="failed"?"failed":j.status==="ready"?"ready":"loading":A.status,Ue=j.status==="ready"?j.module.renderer??j.contribution.id:h?"pending":qe?"fallback":"plain",se={path:pe??t,sessionId:e,files:n,t:i,visible:d,mode:Ce,...h?{}:{page:{text:A.text,offset:A.offset}},...s===void 0?{}:{locate:s}},Ee=()=>{Ve(pe??ae).then(T=>{T&&(y(!0),te.current!==void 0&&clearTimeout(te.current),te.current=setTimeout(()=>y(!1),1400))})},qn=()=>{let T=D?.copyDraft();T!==void 0&&Ve(T).then(U=>{U&&(w(!0),Y.current!==void 0&&clearTimeout(Y.current),Y.current=setTimeout(()=>w(!1),1400))})},Ne=B?.error,Un=Ne!=null&&B?.conflict!==!0,Z=B?.conflict===!0,Ie=B?.discarded??null,ce=!Z&&Ie!==null&&B?.dirty!==!0&&Ie!==B?.text,J;if(h){let T=j.status==="ready"?j.module.Body:void 0;J=z?(0,b.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,b.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,b.jsx)("span",{children:i("preview.commitBinary.description")})]}):v===null?(0,b.jsx)(Kt,{t:i,revision:r}):j.status==="failed"?(0,b.jsx)(Dt,{failure:j.failure,t:i,onRetry:()=>Fe(U=>U+1)}):T===void 0?(0,b.jsx)(At,{t:i}):(0,b.jsx)(T,{...se})}else if(a===void 0)J=(0,b.jsx)(Kt,{t:i,revision:r});else if(A.status==="failed")J=(0,b.jsx)(Dt,{failure:A.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{F?.retry()}});else if(!Le)J=(0,b.jsx)(At,{t:i});else{let T=j.status==="ready"?j.module.Body:za;J=(0,b.jsx)(T,{...se})}return(0,b.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":ye,"data-mode":h?"binary":qe?"reading":"code","data-renderer":Ue,children:[(0,b.jsxs)("header",{className:"fx-preview-bar",children:[(0,b.jsxs)("span",{className:"fx-preview-path",title:pe===void 0?ae:`${ae} \u2192 ${pe}`,"data-testid":"fs-preview-path",...pe===void 0?{}:{"data-link":"followed"},children:[ae,pe===void 0?null:(0,b.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",pe]})]}),h?null:(0,b.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[N.range,N.range==="\u2014"?null:(0,b.jsxs)(b.Fragment,{children:[" ",i("preview.lines")]}),N.total===void 0?null:(0,b.jsxs)("span",{className:"fx-preview-total",children:[" / ",N.total," ",i("preview.lines")]})]}),(0,b.jsxs)("div",{className:"fx-preview-actions",children:[B===void 0?null:(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!B.dirty||B.saving||B.status!=="ready",onClick:()=>{D?.save()},children:B.saving?i("preview.saving"):i("preview.save")}),Pe?(0,b.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>le(T=>T==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(Ce==="reading"?"preview.source":"preview.reading")}):null,h?null:(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Le||Me||A.offset<=1,onClick:()=>{F?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,b.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Le||Me||A.eof,onClick:()=>{F?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,b.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Ee,"data-testid":"fs-preview-copy",children:i(ne?"preview.copied":"preview.copyPath")}),Me?(0,b.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),A.source==="first-parent"?(0,b.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,Z||ce?(0,b.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":Z?"conflict":"discarded",children:[(0,b.jsx)("strong",{children:i(Z?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,b.jsx)("span",{className:"fx-conflict-hint",children:i(Z?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,b.jsx)("span",{className:"fx-spacer"}),Z?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":ue?"discard":void 0,onClick:()=>{if(!ue&&B?.dirty===!0){ie(!0);return}ie(!1),D?.reload({force:!0})},children:i(ue?"preview.conflict.discard":"preview.conflict.reload")}):null,ce?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Ie!==null&&D?.setDraft(Ie)},children:i("preview.conflict.restore")}):null,Z?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:qn,children:i(C?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Un?(0,b.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",$t(Ne?.code??"io-error",Ne?.message??"",i))}):null,(0,b.jsx)("div",{className:"fx-preview-body","data-scroll":qe?"y":"none",children:J})]})}var vo="dsh-fs-explorer-styles",Ga=`
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
`;function bo(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${vo}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=vo,t.textContent=Ga,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var je={reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative"};function Va(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function wo(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i}=e;if(t===void 0)return[{id:"menu.blank",label:n("menu.blank"),disabled:!0,reason:n("menu.blank.reason")}];let d=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,l={id:je.reveal,label:n(Va(o?.fileManager??null)),...d?{}:{disabled:!0,reason:n("menu.reveal.reason")}},u={id:je.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},s={id:je.copyRelative,label:n("menu.copy.relative")};return[l,{id:"menu.copy",label:n("menu.copy"),submenu:[u,s]}]}var ge=require("react");var re=require("react/jsx-runtime");function qa(e){return new DOMRect(e.x,e.y,0,0)}function ko(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,re.jsxs)(re.Fragment,{children:[e.label,(0,re.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function So({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=no();if(i.Menu!==void 0){let d=i.Menu;return(0,re.jsx)(d,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:ko(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:ko(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>qa(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,re.jsx)(Ua,{entries:e,anchor:n,onSelect:t,onClose:r})}function Ua({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,ge.useRef)(null),[i,d]=(0,ge.useState)(null),[l,u]=(0,ge.useState)({left:n.x,top:n.y});(0,ge.useEffect)(()=>{let a=o.current;if(a===null)return;let f=8,m=a.offsetWidth,p=a.offsetHeight,h=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-m-f)),v=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-p-f));u({left:h,top:v})},[n.x,n.y]),(0,ge.useEffect)(()=>{let a=m=>{m.target instanceof Node&&o.current?.contains(m.target)!==!0&&r()},f=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),r())};return document.addEventListener("pointerdown",a),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",a),document.removeEventListener("keydown",f,!0)}},[r]);let s=(0,ge.useCallback)(a=>{if(a.disabled!==!0){if(a.submenu!==void 0){d(f=>f===a.id?null:a.id);return}t(a.id)}},[t]);return(0,re.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:a=>a.preventDefault(),children:e.map(a=>(0,re.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,re.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":a.id,disabled:a.disabled===!0&&a.reason===void 0,"aria-disabled":a.disabled===!0?!0:void 0,"aria-haspopup":a.submenu===void 0?void 0:"menu","aria-expanded":a.submenu===void 0?void 0:i===a.id,title:a.disabled===!0?a.reason:void 0,onClick:()=>s(a),children:a.label}),a.submenu===void 0||i!==a.id?null:(0,re.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:a.submenu.map(f=>(0,re.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>s(f),children:f.label},f.id))})]},a.id))})}var Vt="fs-explorer.treePaneWidth";function qt(e){return Math.min(520,Math.max(180,e))}function Co(e){if(e==null)return null;let n;try{n=e.getItem(Vt)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function _n(e,n){let t=Math.round(qt(n));if(e!=null)try{e.setItem(Vt,String(t))}catch{}return t}function Po(e){if(e!=null)try{e.removeItem(Vt)}catch{}}function Eo(e,n){return Math.round(e)===Math.round(n)}var Ro=16;function To(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ro};case"ArrowRight":return{kind:"nudge",delta:Ro};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var W=require("react");function Mo(e,n,t,r=800){return t-n<=r?e:""}function Lo(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function No(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let d=e[i];d?.type==="entry"&&d.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Xa(e,t+1,r.depth,r.depth+1)}function Xa(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let d=e[i];if(d?.type==="entry"){if(d.depth<=t)break;d.depth===r&&o.push(i)}}return o}var Ya=/^.$/u;function Io(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Ya.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let d=Fo(e.names,n),l=d.find(u=>u>e.active)??d[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=Fo(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(d=>d>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Fo(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var R=require("react/jsx-runtime"),Se=22;function Ut({open:e=!0,size:n=14}){return(0,R.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,R.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,R.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function Za(){return(0,R.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,R.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Do(){return(0,R.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,R.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,R.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Ao(){return(0,R.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,R.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Ja({name:e}){return(0,R.jsx)("span",{className:"fx-badge","data-icon":Be(e),"aria-hidden":"true",children:Ke(e)})}function Qa({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:d,onRowActivate:l,onContextMenu:u}){let s=e.kind==="directory",a={top:r,paddingLeft:8+e.depth*12};return(0,R.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",title:e.path,style:a,onClick:()=>{l(e.path),s?i(e.path):d(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,R.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,R.jsx)(Za,{})}),s?(0,R.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,R.jsx)(Ut,{open:e.expanded})}):(0,R.jsx)(Ja,{name:e.name}),(0,R.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,R.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,R.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":Qe(e.status),"data-testid":"fx-file-status",title:o(ot(e.status)),"aria-label":o(ot(e.status)),children:pn(e.status)}),e.statusCount===void 0?null:(0,R.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,R.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,R.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,R.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,R.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,R.jsx)("span",{className:"fx-size",children:Sn(e.size)})]})}function es({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,R.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,R.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,R.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,R.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,R.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function ns(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Wo({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:d,onEntryFocusSettled:l,onContextMenu:u}){let s=(0,W.useRef)(null),[a,f]=(0,W.useState)(0),[m,p]=(0,W.useState)(0),[h,v]=(0,W.useState)(void 0),F=(0,W.useRef)(void 0),V=(0,W.useRef)({query:"",at:0}),A=(0,W.useRef)(void 0),I=(0,W.useRef)(void 0),j=(0,W.useRef)(h);j.current=h;let M=(0,W.useMemo)(()=>e.flatMap((y,C)=>y.type==="entry"?[C]:[]),[e]);(0,W.useEffect)(()=>{let y=I.current!==n;if(I.current=n,A.current!==void 0||n===void 0)return;let C=j.current===void 0?void 0:e[j.current];if(!Pr({cursorPath:C?.type==="entry"?C.path:void 0,selectionMoved:y}))return;let w=e.findIndex(_=>_.type==="entry"&&_.path===n);w>=0&&v(w)},[n,e]),(0,W.useEffect)(()=>{let y=A.current;if(y===void 0)return;let C=e.findIndex($=>$.type==="entry"&&$.path===y),w=e[C];if(w?.type!=="entry"||w.kind!=="directory"||!w.expanded){A.current=void 0;return}let _=Er(e,y);_!==void 0&&(A.current=void 0,v(_))},[e]),(0,W.useEffect)(()=>{h!==void 0&&e[h]?.type!=="entry"&&v(void 0)},[e,h]),(0,W.useEffect)(()=>{let y=s.current;if(h===void 0||y===null)return;let C=at({scrollTop:y.scrollTop,viewport:y.clientHeight,rowHeight:Se,index:h});C!==y.scrollTop&&(y.scrollTop=C)},[h]);let H=(0,W.useCallback)(y=>{v(y),s.current?.focus({preventScroll:!0})},[]),oe=(0,W.useCallback)(y=>{let C=e.findIndex(w=>w.type==="entry"&&w.path===y);C>=0&&v(C)},[e]),Re=(0,W.useCallback)((y,C,w)=>{oe(y.path),u(y,C,w)},[oe,u]),Fe=(0,W.useCallback)(y=>{y.preventDefault(),u(void 0,{x:y.clientX,y:y.clientY},y.currentTarget)},[u]),Ce=(0,W.useCallback)(y=>{if(y.nativeEvent.isComposing||y.altKey||y.metaKey||y.ctrlKey)return;let C=M.at(-1);if(y.key==="ArrowDown"){if(y.preventDefault(),h===void 0){M[0]!==void 0&&H(M[0]);return}let D=M.find(z=>z>h);D!==void 0&&H(D);return}if(y.key==="ArrowUp"){if(y.preventDefault(),h===void 0){C!==void 0&&H(C);return}let D=[...M].reverse().find(z=>z<h);D!==void 0&&H(D);return}if(h===void 0)return;let w=e[h];if(w===void 0||w.type!=="entry")return;if(y.key==="ArrowRight"){if(y.preventDefault(),w.kind==="directory"&&!w.expanded)A.current=w.path,o(w.path);else{let D=M.find(z=>z>h);D!==void 0&&e[D]?.depth===w.depth+1&&H(D)}return}if(y.key==="ArrowLeft"){if(y.preventDefault(),w.kind==="directory"&&w.expanded)o(w.path);else{let D=[...M].reverse().find(z=>z<h&&e[z]?.type==="entry"&&e[z].depth<w.depth);D!==void 0&&H(D)}return}if(y.key==="Enter"&&w.kind!=="directory"){y.preventDefault(),i(w.path);return}if(y.key==="ContextMenu"||y.key==="F10"&&y.shiftKey){y.preventDefault();let D=s.current?.getBoundingClientRect(),z=D===void 0?0:D.top+h*Se-(s.current?.scrollTop??0);Re(w,{x:D?.left??0,y:z+Se},s.current??void 0);return}if(y.key==="Home"){y.preventDefault(),M[0]!==void 0&&H(M[0]);return}if(y.key==="End"){y.preventDefault(),C!==void 0&&H(C);return}let _=Date.now(),$=Lo(e,h),ue=No(e,$),ie=ue.map(D=>{let z=e[D];return z?.type==="entry"?z.name:""}),te=Io({query:Mo(V.current.query,V.current.at,_),key:y.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:y.nativeEvent.repeat,names:ie,active:h===void 0?-1:ue.indexOf(h)});if(te.kind==="clear"){V.current={query:"",at:0};return}if(te.kind!=="jump")return;let Y=ue[te.index];if(Y===void 0)return;let B=e[Y];B?.type==="entry"&&(V.current={query:te.query,at:_},y.preventDefault(),H(Y),B.kind!=="directory"&&i(B.path))},[h,M,H,o,i,Re,e]);(0,W.useEffect)(()=>{let y=s.current;if(y===null)return;let C=()=>p(y.clientHeight);if(C(),typeof ResizeObserver>"u")return;let w=new ResizeObserver(C);return w.observe(y),()=>w.disconnect()},[]),(0,W.useEffect)(()=>{if(n===void 0)return;let y=s.current;if(y===null)return;let C=e.findIndex(_=>_.type==="entry"&&_.path===n);if(C<0)return;let w=C*Se;(w<y.scrollTop||w+Se>y.scrollTop+y.clientHeight)&&(y.scrollTop=Math.max(0,w-y.clientHeight/2))},[n,e]),(0,W.useEffect)(()=>{if(t===void 0||F.current===t)return;let y=s.current;if(y===null)return;let C=t.path===void 0?-1:e.findIndex(w=>w.type==="entry"&&w.path===t.path);if(!(t.path!==void 0&&C<0)){if(F.current=t,C>=0){let w=at({scrollTop:y.scrollTop,viewport:y.clientHeight===0?480:y.clientHeight,rowHeight:Se,index:C});w!==y.scrollTop&&(y.scrollTop=w,f(w)),v(C)}ns(y),l?.()}},[t,e,l]);let le=y=>{f(y.currentTarget.scrollTop)},ne=xn(e,{scrollTop:a,height:m===0?480:m,rowHeight:Se});return(0,R.jsx)("div",{className:"fx-scroll",ref:s,onScroll:le,onKeyDown:Ce,onContextMenu:Fe,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,R.jsx)("div",{className:"fx-vlist",style:{height:e.length*Se},children:ne.rows.map((y,C)=>{let w=(ne.startIndex+C)*Se;return y.type==="entry"?(0,R.jsx)(Qa,{row:y,top:w,selected:y.path===n,cursor:h===ne.startIndex+C,t:r,onToggle:o,onSelect:i,onRowActivate:oe,onContextMenu:(_,$)=>Re(_,{x:$.clientX,y:$.clientY},$.currentTarget instanceof HTMLElement?$.currentTarget:void 0)},y.path):(0,R.jsx)(es,{row:y,top:w,t:r,onRetry:d},y.key)})})})}function xe(e){return e!==null&&typeof e=="object"}function Bn(e){try{return e()}catch{return}}function ts(e){let n=Bn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=xe(n)?n.rpc:void 0;if(!(!xe(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${cr}/${r}`,o,i)}function rs(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal")}}function Xt(e){return xe(e)&&typeof e.info=="function"&&typeof e.reveal=="function"}function os(e){return()=>{let n=Bn(()=>e.fsExplorerWorkspace);if(Xt(n))return n;let t=Bn(()=>xe(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(Xt(t))return t;let r=Bn(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(Xt(r))return r;let o=ts(e);if(o!==void 0)return rs(o)}}function Yt(e){let n=xe(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=xe(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return xe(t)?t:void 0}var is=["no-workspace","outside-workspace","not-found","unsupported","permission","io-error"];function Zt(e){let n=xe(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:is.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function as(e){let n=Yt(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Zt(n.error)};let t=xe(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function ss(e){let n=Yt(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Zt(n.error)};let t=xe(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function ds(e){let n=Yt(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Zt(n.error)}:{ok:!0}}var ls={code:"unsupported",message:"the workspace service is unavailable"};function Oo(e){let n=os(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:ls});try{return o(await r(i))}catch(d){return o({ok:!1,error:{code:"io-error",message:d instanceof Error?d.message:String(d)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),as),info:(r,o,i)=>t(d=>d.info({sessionId:r,path:o},i),ss),reveal:(r,o,i)=>t(d=>d.reveal({sessionId:r,path:o},i),ds)}}var S=require("react/jsx-runtime");var us=()=>({status:"loading",nodes:[],truncated:!1,total:0});function cs(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var fs=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,zo=new Map;function ps(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Kn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,S.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,S.jsx)("strong",{children:e}),n===void 0?null:(0,S.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,S.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ys(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function _o({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:d,documents:l,locate:u,workspace:s}){let a=Br();function f(m){let p=m.sessionId??e.currentSessionId(),h=(0,x.useRef)(p);h.current=p;let v=(0,x.useMemo)(()=>r(),[r]),F=(0,x.useMemo)(()=>o(),[o]),V=(0,x.useMemo)(()=>i(),[i]),A=(0,x.useMemo)(()=>p===void 0||u===void 0?void 0:u(p),[u,p]),I=(0,x.useMemo)(()=>p===void 0||s===void 0?void 0:s(p),[s,p]),j=(0,x.useRef)(!1),[M,H]=(0,x.useState)(null),[oe,Re]=(0,x.useState)(void 0),[Fe,Ce]=(0,x.useState)(null),le=(0,x.useRef)(null),[ne,y]=(0,x.useState)(()=>new Map),[C,w]=(0,x.useState)(void 0),[_,$]=(0,x.useState)(void 0),[ue,ie]=(0,x.useState)(void 0),[te,Y]=(0,x.useState)(zo),B=(0,x.useRef)(ne);B.current=ne;let[D,z]=(0,x.useState)(()=>new Set),N=(0,x.useMemo)(()=>a.forSession(p),[a,p]),ae=(0,x.useSyncExternalStore)(N.subscribe,N.snapshot,N.snapshot),pe=ae.panels.find(c=>c.key===ae.active),Pe=pe?.path,Me=pe?.revision,[Le,qe]=(0,x.useState)(0),ye=(0,x.useRef)(new Map),Ue=(0,x.useRef)(void 0),[se,Ee]=(0,x.useState)(null),[qn,Ne]=(0,x.useState)(!1),[Un,Z]=(0,x.useState)(null),Ie=(0,x.useRef)(null);Ie.current=se?.path??null;let ce=(0,x.useMemo)(()=>cs(),[]),[J,T]=(0,x.useState)(()=>Co(ce)),U=(0,x.useRef)(null),de=(0,x.useRef)(null),O=ne.get(""),ln=O?.status==="ready",un=(0,x.useCallback)((c,g,k,P)=>{N.open(c,g,k,P)},[N]),Xn=(0,x.useCallback)(c=>{let g=c??N.snapshot().active??void 0;if(g===void 0)return;if((p===void 0?void 0:l?.peek(p,g))?.dirty===!0){Z(null),Ee({path:g});return}Ee(null),Z(null),p!==void 0&&l?.forget(p,g),N.close(g)},[l,p,N]),qo=(0,x.useCallback)(()=>{let c=se;if(c===null)return;let g=p===void 0?void 0:l?.find(p,c.path);if(g===void 0){Ee(null),p!==void 0&&l?.forget(p,c.path),N.close(c.path);return}Ne(!0),Z(null),g.save().then(k=>{if(Ne(!1),!k.ok){let P=g.getSnapshot().error;Z(t("panel.confirm.failed").replace("{message}",$t(k.code,P?.message??"",t)));return}Ee(null),p!==void 0&&l?.forget(p,c.path),N.close(c.path)})},[l,se,p,N,t]),Uo=(0,x.useCallback)(()=>{let c=se;Ee(null),Z(null),c!==null&&(p!==void 0&&l?.forget(p,c.path),N.close(c.path))},[l,se,p,N]),Yn=(0,x.useCallback)(()=>{Ee(null),Z(null)},[]),Te=(0,x.useCallback)(async(c,g,k)=>{ye.current.get(c)?.abort();let P=new AbortController;ye.current.set(c,P),y(G=>new Map(G).set(c,us()));try{let G=await k.list(g,hn(c),P.signal);if(P.signal.aborted||h.current!==g)return!1;let K=jn(G);if(!K.ok)return y(he=>new Map(he).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:K.message})),!1;let _e=gn(K.listing.entries);return y(he=>new Map(he).set(c,{status:"ready",nodes:_e,truncated:K.listing.truncated===!0,total:K.listing.entries.length})),!0}catch(G){return P.signal.aborted||y(K=>new Map(K).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:yo(G)})),!1}finally{ye.current.get(c)===P&&ye.current.delete(c)}},[]);(0,x.useEffect)(()=>{for(let c of ye.current.values())c.abort();return ye.current.clear(),y(new Map),z(new Set),Ue.current=void 0,p!==void 0&&v!==void 0&&Te("",p,v),()=>{for(let c of ye.current.values())c.abort();ye.current.clear()}},[p,v,Le,Te]),(0,x.useEffect)(()=>{if(p===void 0||F===void 0){w(void 0),$(void 0),ie(void 0);return}let c=!0,g=new AbortController;return w(void 0),$(void 0),ie(void 0),Promise.resolve().then(()=>F.snapshot({sessionId:p,maxCommits:1},g.signal)).then(k=>{if(!c)return;let P=zn(k);if(!P.ok){w(void 0),$(void 0),ie(void 0);return}w(hr(fn(P.status),P.stats)),$(P.head),ie(P.root)}).catch(()=>{c&&(w(void 0),$(void 0),ie(void 0))}),()=>{c=!1,g.abort()}},[p,F,Le]),(0,x.useEffect)(()=>{let c=v?.read;if(p===void 0||v===void 0||typeof c!="function"||!ln){Y(zo);return}let g=p,k=new AbortController,P=async(K,_e)=>{try{let he=ps(await c.call(v,g,_e,{},k.signal));return he===void 0?void 0:[K,he]}catch{return}},G=kr.filter(K=>K!==".gitmodules").map(K=>P(K,K));return ue!==void 0&&G.push(P(".gitmodules",`${ue.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(G).then(K=>{if(k.signal.aborted||h.current!==g)return;let _e=new Map;for(let De of K)De!==void 0&&_e.set(De[0],De[1]);let he=B.current.get(""),li=new Set(he?.status==="ready"?he.nodes.filter(De=>De.kind==="directory").map(De=>De.name):[]);Y(yn(_e,li))}),()=>k.abort()},[p,v,ln,ue,Le]),(0,x.useEffect)(()=>{let c=m.viewRequest;if(c==null||c.view!==Q)return;let g=`${c.view}:${c.focus}`;Ue.current!==g&&(Ue.current=g,nn(c.focus,{open:un}),m.completeViewRequest?.())},[m.viewRequest,m.completeViewRequest,un]),(0,x.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||p===void 0)return;let g=()=>{let k=c.take(Q);k!==void 0&&nn(k,{open:un})};return g(),c.subscribe(g)},[e,p,un]),(0,x.useEffect)(()=>{if(Pe===void 0||Me!==void 0||!ln||vn(Pe))return;let c=Cr(Pe);if(c.length===0||(z(k=>c.every(P=>k.has(P))?k:new Set([...k,...c])),p===void 0||v===void 0))return;let g=c.filter(k=>B.current.get(k)?.status!=="ready");g.length!==0&&Promise.all(g.map(k=>Te(k,p,v)))},[Pe,Me,ln,p,v,Te]);let nr=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),Xo=(0,x.useCallback)(c=>{if(c.button!==0||de.current!==null||fs())return;let g=U.current?.previousElementSibling;if(g instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}de.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:g.getBoundingClientRect().width,restWidth:J},document.body.classList.add("fx-pane-resizing")}},[J]),Yo=(0,x.useCallback)(c=>{let g=de.current;g===null||g.pointerId!==c.pointerId||T(qt(g.baseWidth+c.clientX-g.startX))},[]),Zn=(0,x.useCallback)(c=>{let g=de.current;if(g===null||g.pointerId!==c.pointerId)return;de.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let k=g.baseWidth+c.clientX-g.startX;if(Eo(k,g.baseWidth)){T(g.restWidth);return}T(_n(ce,k))},[ce]),Jn=(0,x.useCallback)(()=>{Po(ce),T(null)},[ce]),Zo=(0,x.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let g=To(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(g===null)return;if(c.preventDefault(),c.stopPropagation(),g.kind==="reset"){Jn();return}if(g.kind==="min"||g.kind==="max"){let G=g.kind==="min"?180:520;T(_n(ce,G));return}let k=U.current?.previousElementSibling,P=k instanceof HTMLElement?k.getBoundingClientRect().width:J??180;T(_n(ce,P+g.delta))},[ce,Jn,J]);(0,x.useEffect)(()=>()=>{de.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=g=>{if(!(g.isComposing||zr(g.target))){if(ys(g)){let k=N.snapshot().active,P=k===null||l===void 0||p===void 0?void 0:l.find(p,k);if(P===void 0)return;g.preventDefault(),g.stopPropagation(),P.save();return}for(let k of Tn)if(jr(g,k)){if(k.action==="closePanel"&&N.snapshot().active===null)return;g.preventDefault(),g.stopPropagation(),k.action==="nextPanel"?N.next():k.action==="previousPanel"?N.previous():Xn();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[l,Xn,p,N]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=Fn({focusComposer:nr,hasModal:()=>Ie.current!==null||j.current||kt(document)}),g=k=>c(k);return document.addEventListener("keydown",g,!0),()=>document.removeEventListener("keydown",g,!0)},[nr]),(0,x.useEffect)(()=>{if(se===null||typeof document>"u")return;let c=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),g.stopPropagation(),Yn())};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[se,Yn]);let Qn=(0,x.useMemo)(()=>kn(ne,D,C,te),[ne,D,C,te]),[Jo,tr]=(0,x.useState)(void 0),rr=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(rr.current||typeof document>"u")return;let c=Tr({rows:Qn,panelCount:N.snapshot().panels.length,hasModal:kt(document)});c.kind!=="skip"&&(rr.current=!0,c.open!==void 0&&N.open(c.open),tr({path:c.focus}))},[Qn,N]);let Qo=(0,x.useCallback)(()=>tr(void 0),[]),Xe=C===void 0?void 0:Object.keys(C).length,ei=C===void 0?"neutral":Object.values(C).some(c=>c.status==="conflicted")?"conflict":Xe===0?"success":"warning",or=xr(_),ni=(0,x.useCallback)(c=>{if(p===void 0||v===void 0)return;if(D.has(c)){z(k=>{let P=new Set(k);return P.delete(c),P});return}z(k=>new Set(k).add(c));let g=ne.get(c);(g===void 0||g.status==="failed")&&Te(c,p,v)},[D,ne,p,v,Te]),ir=(0,x.useCallback)(c=>{p===void 0||v===void 0||Te(c,p,v)},[p,v,Te]),ze=(0,x.useCallback)((c,g)=>{le.current!==null&&clearTimeout(le.current),Ce({text:c,tone:g}),le.current=setTimeout(()=>{le.current=null,Ce(null)},4e3)},[]);(0,x.useEffect)(()=>()=>{le.current!==null&&clearTimeout(le.current)},[]),(0,x.useEffect)(()=>{if(I===void 0){Re(void 0);return}let c=!0;return I.capabilities(p??"").then(g=>{c&&Re(g.ok?g.capabilities:void 0)}),()=>{c=!1}},[I,p]);let ti=(0,x.useCallback)((c,g,k)=>{if(H({row:c,anchor:g,absolutePath:void 0,trigger:k}),c===void 0||I===void 0)return;let P=c.path;I.info(p??"",P).then(G=>{H(K=>K===null||K.row?.path!==P?K:{...K,absolutePath:G.ok?G.info.absolutePath:void 0})})},[p,I]),ri=(0,x.useCallback)(()=>H(null),[]);j.current=M!==null;let et=(0,x.useCallback)(c=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${c.code}`)),[t]),oi=(0,x.useCallback)(c=>{let g=M;if(H(null),g===null||g.row===void 0)return;let k=g.row;if(c===je.copyRelative){Ve(k.path).then(P=>{ze(t(P?"notice.copiedRelative":"notice.copyFailed"),P?"ok":"error")});return}if(c===je.copyAbsolute){let P=g.absolutePath;if(P===void 0)return;Ve(P).then(G=>{ze(t(G?"notice.copiedAbsolute":"notice.copyFailed"),G?"ok":"error")});return}if(c===je.reveal){if(I===void 0){ze(et({code:"unsupported",message:""}),"error");return}I.reveal(p??"",k.path).then(P=>{if(!P.ok){ze(et(P.error),"error");return}let G=t(`menu.manager.${oe?.fileManager??"directory"}`);ze(t("notice.revealed").replace("{manager}",G),"ok")})}},[ze,oe,M,et,p,t,I]),ii=(0,x.useMemo)(()=>M===null?[]:wo({row:M.row,notices:{workspace:I!==void 0},capabilities:oe,absolutePath:M.absolutePath},t),[oe,M,t,I]),ai=()=>z(new Set),si=()=>qe(c=>c+1),di=p===void 0?"no-session":v===void 0?"no-service":O===void 0||O.status==="loading"?"loading":O.status==="failed"?"failed":O.nodes.length===0?"empty":"tree";return(0,S.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":di,"data-session":p??"","data-testid":"fs-explorer-view",children:[(0,S.jsxs)("header",{className:"fx-head",children:[(0,S.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,S.jsx)(Ut,{open:!0})}),(0,S.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,S.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,S.jsxs)("div",{className:"fx-head-meta",children:[O?.status==="ready"?(0,S.jsxs)("span",{children:[(0,S.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}):null,(0,S.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:D.size===0,onClick:ai,children:(0,S.jsx)(Ao,{})}),(0,S.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:p===void 0||v===void 0||O?.status==="loading",onClick:si,children:(0,S.jsx)(Do,{})})]})]}),Fe===null?null:(0,S.jsx)("div",{className:"fx-notice",role:"status","data-tone":Fe.tone,"data-testid":"fx-notice",children:Fe.text}),(0,S.jsx)("div",{className:"fx-main",children:p===void 0?(0,S.jsx)(Kn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):v===void 0?(0,S.jsx)(Kn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):O===void 0||O.status==="loading"?(0,S.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):O.status==="failed"?(0,S.jsx)(Kn,{title:t("state.failed.title"),description:O.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>ir(""),testId:"fs-failed"}):O.nodes.length===0?(0,S.jsx)(Kn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("div",{className:"fx-tree-pane",style:J===null?void 0:{"--fx-tree-width":`${J}px`},children:(0,S.jsx)(Wo,{rows:Qn,selectedPath:Me===void 0?Pe:void 0,entryFocus:Jo,t,onToggle:ni,onSelect:c=>N.open(c),onRetry:ir,onEntryFocusSettled:Qo,onContextMenu:ti})}),(0,S.jsx)("div",{ref:U,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":J??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Xo,onPointerMove:Yo,onPointerUp:Zn,onPointerCancel:Zn,onLostPointerCapture:Zn,onKeyDown:Zo,onDoubleClick:Jn}),(0,S.jsxs)("div",{className:"fx-editor",children:[(0,S.jsx)(Kr,{panels:ae.panels,active:ae.active,t,onActivate:c=>N.activate(c),onClose:Xn,onStep:c=>c===1?N.next():N.previous(),documents:l,sessionId:p}),se===null?null:(0,S.jsx)(Hr,{name:Ln(se.path),t,saving:qn,error:Un,onSave:qo,onDiscard:Uo,onCancel:Yn}),(0,S.jsx)("div",{className:"fx-editor-body",children:ae.panels.length===0?(0,S.jsx)($r,{t}):ae.panels.map((c,g)=>{let k=c.key===ae.active;return(0,S.jsx)("div",{className:"fx-panel",id:`fx-panel-${g}`,role:"tabpanel","aria-labelledby":`fx-tab-${g}`,hidden:!k,"data-line":c.line,"data-testid":"fs-panel",children:(0,S.jsx)(ho,{sessionId:p,files:v,path:c.path,revision:c.revision,git:V,t,visible:k,renderers:d,documents:l,locate:A})},c.key)})})]})]})}),M===null?null:(0,S.jsx)(So,{entries:ii,anchor:M.anchor,onSelect:oi,onClose:ri,...M.trigger===void 0?{}:{returnFocus:()=>M.trigger??null}}),O?.status==="ready"?(0,S.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,S.jsxs)("span",{children:[t("view.scope")," ",(0,S.jsx)("b",{children:O.nodes.length})," ",t("head.entries")]}),O.truncated?(0,S.jsx)("span",{className:"fx-foot-warn",children:en({entries:O.nodes,truncated:!0,total:O.total}).label}):null,(0,S.jsxs)("span",{className:"fx-foot-git","data-state":Xe===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,S.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ei,"aria-hidden":"true"}),Xe===void 0?t("status.unavailable"):Xe===0?t("status.clean"):t("status.summary").replace("{count}",String(Xe))]}),or===null?null:(0,S.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[or,_?.upstream!==void 0&&(_.ahead??0)>0?(0,S.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(_.ahead)}`}):null,_?.upstream!==void 0&&(_.behind??0)>0?(0,S.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(_.behind)}`}):null]}),(0,S.jsx)("span",{className:"fx-spacer"}),(0,S.jsx)("span",{children:t("foot.order")})]}):null]})}return f}var Ko=["slots","locale","workbench","remote"];function gs(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Hn,$n,Qt,Gn,er,Ho;function Bo(e){return er=e,Gn!==void 0||(Gn=Or({open:(n,t,r)=>{let o=er;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Ar(o)(n,t,r)},save:(n,t)=>{let r=er;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Wr(r)(n,t)}})),Gn}function xs(){if(Qt!==void 0)return Qt;let e=Wn({warn:n=>Ho?.(n)});for(let n of Gt())e.register(n);return Qt=e,e}var Vn;function $o(e){let n=e.workbench;if(n==null)return()=>{};Ho=a=>e.logger?.warn?.(a);let t=xs(),r={version:to,renderers:t,registerRenderer:a=>t.register(a),documents:Bo(e)};$n?.();let o=e.provide?.(Wt,r);o===void 0&&e.logger?.warn?.(`${Je}: ctx.provide unavailable, ${Wt} service not registered`),$n=o,Hn?.();let i=e.locale.register(Je,{zh:{...mt,...Rt.zh,...Ht.zh},en:{...gt,...Rt.en,...Ht.en}});Hn=i;let d=e.locale.bind(Je),l=bo(typeof document>"u"?void 0:document),u=_o({workbench:n,version:n.version,t:d,files:lo(e),status:mo(e),git:fo(e),renderers:t,documents:Bo(e),locate:a=>Dr(e,a),workspace:()=>Oo(e)});Vn?.();let s=yt(e,n);return Vn=s,e.slots.inject(tt,()=>e.slots.register({name:tt,id:Q,order:100,label:()=>xt(gs(e)),locale:Je},u)),()=>{o?.(),$n===o&&($n=void 0),s(),Vn===s&&(Vn=void 0),l(),i(),Hn===i&&(Hn=void 0)}}var Go={buildTree:gn,describeListing:en,iconFor:Be,computeTreeWindow:xn,flattenTree:kn,badgeFor:Ke,formatSize:Sn,joinPath:bn,listingPath:hn,parseFocus:wn,consumeViewRequest:nn,createPanelStack:St,createEscapeHandler:Fn,KEYMAP:Tn,tabLabel:xt,normalizeListing:jn,normalizeStatusSnapshot:zn,buildWorkspaceMap:yn,workspaceTagFor:mn,parseStatusZ:fn,statusTone:Qe,statusBadge:pn,createPreviewLoader:In,renderMarkdown:Nn,languageFor:on,isMarkdownFile:an,describePage:Dn,classifyPreviewFailure:Oe,normalizePreviewPage:Ge,previewChunkRoute:Zr,canBridgeFile:Rn,decideBridge:ft,focusForFileAddress:ct,forwardFocus:pt,registerAddressBridge:yt},Vo={name:"dsh-fs-explorer",inject:Ko,apply:$o,__test:Go};function hs(e){eo(e),Yr(e)}var vs=Vo;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
