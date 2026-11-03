window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Bn=Object.defineProperty;var Fo=Object.getOwnPropertyDescriptor;var Lo=Object.getOwnPropertyNames;var No=Object.prototype.hasOwnProperty;var Mo=(e,n)=>{for(var t in n)Bn(e,t,{get:n[t],enumerable:!0})},Io=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Lo(n))!No.call(e,o)&&o!==t&&Bn(e,o,{get:()=>n[o],enumerable:!(r=Fo(n,o))||r.enumerable});return e};var Do=e=>Io(Bn({},"__esModule",{value:!0}),e);var Pa={};Mo(Pa,{__test:()=>ho,apply:()=>xo,boot:()=>Lr,clientPlugin:()=>vo,default:()=>Ra,inject:()=>mo});module.exports=Do(Pa);var ze=require("react");var Bt="dsh-resource://file/";function $t(e){try{return decodeURIComponent(e)}catch{return e}}function Ge(e){if(!e.startsWith(Bt))return null;let n=e.slice(Bt.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=$t(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),d=a<0?i:i.slice(0,a);return d.length===0?null:{sessionId:o,path:d.split("/").map($t).join("/")}}function xe(e){return e.slice(e.lastIndexOf("/")+1)}var Kt=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Ht(){return Kt.flatMap(e=>[...e.extensions])}function Ve(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Kt.find(o=>o.extensions.includes(r))?.family??null}var ie="dsh-fs-explorer",$n="conversation.view",X="fs-explorer";var qe="fs-explorer",Gt="fsExplorerDocuments",Vt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Kn={chunk:"client.preview.js"},rn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Ao={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},jo={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Oo=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Ut(e){return typeof e=="string"&&Oo.has(e)}function qt(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Wo(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function on(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=qt(o.slice(2),i==="1"?7:8);if(a===null)continue;let d=a.fields[0]??"",l=a.rest;if(l===""||d.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[l]={status:"renamed"};continue}n[l]={status:Wo(d[0]??".",d[1]??".")};continue}if(i==="u"){let a=qt(o.slice(2),9);if(a===null)continue;let d=a.rest;if(d==="")continue;n[d]={status:"conflicted"}}}}return n}function Ue(e){return Ut(e)?Ao[e]:"neutral"}function an(e){return Ut(e)?jo[e]:"?"}function Hn(e){return`status.${e}`}function Xt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Yt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Zt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Jt(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var zo=["conflicted","deleted","renamed","added","modified","untracked"];function _o(e){return Ue(zo.find(n=>e.has(n))??"modified")}function Qt(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),d=r.endsWith("/")?a.length:a.length-1,l="";for(let s=0;s<d;s+=1){let c=a[s];if(c===void 0||c==="")continue;l=l===""?c:`${l}/${c}`;let p=n.get(l);p===void 0?n.set(l,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:_o(o.present)});return t}var tr=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],rr=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Bo(e){return rr.test(e)?e.slice(0,e.indexOf("/")):null}function $o(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ko(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=$o(i[2]??"");a!==""&&rr.test(a)&&t.push(a)}return t}function Ho(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let d=/^\[(.+)\]$/u.exec(a);if(d!==null){o(),r=/^submodule(\s|$)/u.test(d[1]??"");continue}if(!r)continue;let l=/^path\s*=\s*(.*)$/u.exec(a);l!==null&&(t=(l[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function er(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function nr(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function sn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let d of Ho(r))t.set(d,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let d of Ko(i))o.add(d);let a=e.get("package.json");if(typeof a=="string"){let d=er(a);if(d!==void 0){let l=d.workspaces,s=l!==null&&typeof l=="object"&&!Array.isArray(l)?l.packages:void 0;for(let c of nr(Array.isArray(l)?l:s))o.add(c)}}for(let d of["turbo.json","lerna.json"]){let l=e.get(d);if(typeof l!="string")continue;let s=er(l);if(s!==void 0)for(let c of nr(s.packages))o.add(c)}for(let d of o){let l=Bo(d);l!==null&&n.has(l)&&t.set(d,"package")}return t}function dn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Go=new Set(["node_modules",".git","dist","__pycache__"]);function Vo(e){return Go.has(e)}function qo(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ln(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Vo(r))continue;let o=qo(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Uo=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Xo=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Yo=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Zo=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Jo=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Qo=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),ei=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function or(e){let n=xe(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Oe(e,n="file"){if(n==="directory")return"folder";let t=xe(e.toLowerCase());if(ei.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=or(t);return r===""?"file":Uo.has(r)?"code":Xo.has(r)?"markdown":Yo.has(r)?"data":Zo.has(r)?"image":Jo.has(r)?"style":Qo.has(r)?"archive":"file"}var ni={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},ti={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function We(e){let n=xe(e.toLowerCase()),t=ni[n];if(t!==void 0)return t;let r=or(n),o=ti[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Xe(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Vt} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function cn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,n.scrollTop)/t)-o,l=Math.min(Math.max(d,0),a),s=Math.min(e.length,l+i+o*2);return{rows:e.slice(l,s),startIndex:l,endIndex:s}}function Vn(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function un(e){return e===""?".":e}function fn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function pn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function ir(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=pn(r,o),t.push(r);return t}function Gn(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function yn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let d=Gn(t[2]),l=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return l===""||d<1?void 0:{path:l,line:d,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let d=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:Gn(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let a=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:Gn(o[2]),absolute:!1}}function ar(e){return e.selectionMoved?!0:e.cursorPath===void 0}function sr(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function mn(e,n,t,r){let o=[],i=Qt(t),a=(d,l)=>{let s=e.get(d);if(!(s===void 0||s.status!=="ready"))for(let c of s.nodes){let p=pn(d,c.name),u=c.kind==="directory",v=u&&n.has(p),g=u||t===void 0?void 0:t[p],P=g?.status??(u?void 0:Xt(p,t)),F=g===void 0?void 0:Yt(g),W=u?i.get(p):void 0,I=u?dn(r,p):void 0;if(o.push({type:"entry",path:p,name:c.name,kind:c.kind,depth:l,expanded:v,...c.size===void 0?{}:{size:c.size},...P===void 0?{}:{status:P},...W===void 0?{}:{statusCount:W.count,statusTone:W.tone},...F===void 0?{}:{diff:F},...I===void 0?{}:{tag:I}}),!v)continue;let j=e.get(p);if(j===void 0||j.status==="loading"){o.push({type:"status",key:`${p}:loading`,path:p,depth:l+1,state:"loading"});continue}if(j.status==="failed"){o.push({type:"status",key:`${p}:failed`,path:p,depth:l+1,state:"failed",message:j.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(j.nodes.length===0){o.push({type:"status",key:`${p}:empty`,path:p,depth:l+1,state:"empty"});continue}a(p,l+1),j.truncated&&o.push({type:"status",key:`${p}:truncated`,path:p,depth:l+1,state:"truncated",label:Xe({entries:j.nodes,truncated:!0,total:j.total}).label})}};return a("",0),o}var ri=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function oi(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function ii(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&ri.has(oi(n.path)))}function dr(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=ii(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function gn(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var qn="dsh-fs-explorer:bridge",ai="fs-explorer-bridge",fr="dsh-resource://file/**",Un="sidebar.right.pane.tab",si=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),di=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),li=new Set(["makefile","dockerfile","license","readme","changelog"]),ci=new Set([...Ht(),...si]);function ui(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function xn(e){if(typeof e!="string"||e==="")return!1;let n=xe(e).toLowerCase();if(n==="")return!1;let t=ui(n);return di.has(t)?!1:li.has(n)?!0:ci.has(t)}function fi(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function pi(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Zn(e,n){if(typeof e!="string")return;let t=Ge(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=pi(n,fi(e));return`${fn(r)?"abs:":"path:"}${r}:${String(o)}`}function Jn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Ge(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!xn(r.path))return{action:"keep",reason:"refused"};let o=Zn(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function he(e,n){n===void 0?console.warn(`[${ie}] ${e}`):console.warn(`[${ie}] ${e}`,n)}function yi(e){console.debug(`[${ie}] ${e}`)}function Xn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Yn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Ce(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function lr(e){return Ce(()=>e.sidebarRightTabs,Xn)??Ce(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Xn)}function cr(e){return Ce(()=>e.sidebarRight,Yn)??Ce(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Yn)}function ur(e){return typeof e=="function"?e:()=>{}}var mi="dsh-resource://file/session/probe/src/main.ts";function gi(e){let n=Ce(()=>(typeof e.candidates=="function"?e.candidates(mi):[]).filter(r=>r.priority==="extension"&&r.id!==qn),t=>Array.isArray(t)&&t.length>0);n!==void 0&&he(`another extension-band tab type already claims ${fr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function xi(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function hi(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function vi(e,n){let t=e.viewFocus;if(t?.request?.(X,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(X,n);return(!r.opened||r.focused)&&t?.take(X),r}return typeof e.openView=="function"&&e.openView(X,n)?(t?.take(X),{opened:!0,focused:!0}):(t?.take(X),{opened:!1,focused:!1})}function Qn(e,n,t,r){let o;try{o=vi(e,r)}catch(i){return he("the file workbench threw while switching views",i),e.viewFocus?.take(X),!1}if(!o.opened)return he(`the file workbench did not switch to ${X}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return he("the forwarded tab could not be closed",i),!1}}function bi(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,d=xi(i),l=hi(i),s=(0,ze.useRef)(void 0);return(0,ze.useEffect)(()=>{if(a===void 0){he("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let c=Jn(d,e.currentSessionId(),l);if(c.action!=="open"){he(`left the forwarded tab standing (${c.reason})`,d);return}Qn(e,n,a,c.focus)},[a,d,l]),null}return function(o){return typeof o.useTabInfo!="function"?(he(`the host did not inject useTabInfo into ${Un}; the bridge cannot forward`),null):(0,ze.createElement)(t,{useTabInfo:o.useTabInfo})}}function et(e,n){let t=(d,l)=>{if(d===void 0||l===void 0)return;gi(d);let s;try{s=d.register({id:qn,kind:ai,patterns:[fr],priority:"extension",canOpen:u=>{let v=Ge(u);return v!==null&&xn(v.path)},title:u=>xe(Ge(u)?.path??u)||u})}catch(u){he("the sidebar right refused the address bridge tab type",u);return}let c=bi(n,l),p;try{p=ur(e.slots.inject(Un,()=>e.slots.register({name:Un,key:qn},c)))}catch(u){s(),he("the sidebar right refused the address bridge body",u);return}return()=>{p(),s()}},r=lr(e),o=cr(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return yi("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],d=>{let l=Ce(()=>d.get?.("sidebarRightTabs"),Xn)??lr(d),s=Ce(()=>d.get?.("sidebarRight"),Yn)??cr(d);return t(l,s)});return ur(a)}var nt={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},tt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function rt(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?nt:tt)["tab.label"]??"Files"}var wi=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function Y(e){return e!==null&&typeof e=="object"}function vn(e,n){return{ok:!1,code:e,message:n}}function bn(e){let n=Y(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return vn(t,r)}function ot(){return vn("invalid-response","the document service answered an invalid response")}function hn(e){try{return e()}catch{return}}function ki(e){let n=Y(e)?e:void 0;if(n===void 0)return ot();if(n.ok===!1)return bn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Y(t)?t:void 0;if(r===void 0)return ot();if(r.ok===!1)return bn(r.error);let o=Y(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?ot():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Si(e){let n=Y(e)?e:void 0;if(n===void 0)return pr();if(n.ok===!1)return bn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Y(t)?t:void 0;if(r===void 0)return pr();if(r.ok===!1)return bn(r.error);let o=Y(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function pr(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function it(e){return Y(e)&&typeof e.open=="function"}function Ri(e){let n=hn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Y(n)?n.rpc:void 0;if(!(!Y(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Gt}/${r}`,o,i)}function Pi(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Ci(e){let n=Y(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=Y(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=Y(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function yr(e,n){let t=st(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return Ci(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function st(e){return()=>{let n=hn(()=>e.fsExplorerDocuments);if(it(n))return n;let t=hn(()=>Y(e.remote)?e.remote.fsExplorerDocuments:void 0);if(it(t))return t;let r=hn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(it(r))return r;let o=Ri(e);if(o!==void 0)return Pi(o)}}function mr(e){let n=st(e);return async(t,r,o)=>{let i=n();if(i===void 0)return vn("unavailable","the document service is unavailable");try{return ki(await i.open({sessionId:t,path:r},o))}catch(a){return vn("io-error",a instanceof Error?a.message:String(a))}}}function gr(e){let n=st(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return Si(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function xr(e){let n=new Map,t=new Set,r=0,o=(d,l)=>`${d}\0${l}`,i=()=>{r+=1;for(let d of[...t])d()},a=(d,l)=>n.get(o(d,l))?.session;return{acquire(d,l){let s=o(d,l),c=n.get(s);return c===void 0&&(c={session:new at(d,l,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,c),i()),c.session.retain(),c.session},peek(d,l){return a(d,l)?.getSnapshot()},find:a,forget(d,l){n.get(o(d,l))?.session.abandon()},subscribe(d){return t.add(d),()=>{t.delete(d)}},revision:()=>r}}var at=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=wi;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var wn=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ei(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function hr(e,n,t=Ei()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===d}function vr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Ti(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function dt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function kn(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Ti(n),e.onClose?.()}}var _e=require("react");function Rn(e){let n=xe(e);return n===""?e:n}function Sn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Fi=Object.freeze({panels:Object.freeze([]),active:null});function br(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Li=/^git:([0-9a-f]{4,64}):(.+)$/iu;function lt(){let e=[],n=null,t=Fi,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(c=>c.key===s),a=s=>e.findIndex(c=>c.revision===void 0&&c.key===s),d=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let c=Li.exec(s);if(c!==null){let v=(c[1]??"").toLowerCase(),g=Sn(c[2]??"",!1);if(g===void 0)return;let P=br(g,v);return i(P)>=0?P:void 0}let p=Sn(s,!0);if(p===void 0)return;if(a(p)>=0)return p;let u=Sn(s,!1);if(!(u===void 0||u===p))return a(u)>=0?u:void 0},l=s=>{if(e.length===0)return;let c=n===null?-1:i(n),p=e[(c+s+e.length)%e.length];p===void 0||p.key===n||(n=p.key,o())};return{open(s,c=1,p=!1,u){let v=Sn(s,p);if(v===void 0)return;let g=typeof u=="string"&&u.trim()!==""?u.trim().toLowerCase():void 0,P=br(v,g),F=Number.isFinite(c)&&c>0?Math.trunc(c):1,W=i(P);if(W>=0){let E=e[W],A=E!==void 0&&(E.line!==F||E.absolute!==p);if(A&&(e=e.map((Q,le)=>le===W?{...Q,line:F,absolute:p}:Q)),n===P){A&&o();return}n=P,o();return}let I=n===null?e.length:i(n)+1,j={key:P,path:v,line:F,absolute:p,...g===void 0?{}:{revision:g}};e=[...e.slice(0,I),j,...e.slice(I)],n=P,o()},close(s){let c=s===void 0?n:d(s)??null;if(c===null)return;let p=i(c);p<0||(e=e.filter(u=>u.key!==c),n===c&&(n=(e[p]??e[p-1])?.key??null),o())},activate(s){let c=d(s);c===void 0||i(c)<0||n===c||(n=c,o())},next(){l(1)},previous(){l(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let c=d(s);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function wr(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=lt();return e.set(t,o),o}}}function Ye(e,n){let t=yn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var N=require("react/jsx-runtime"),ct={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Ni=()=>()=>{},Mi=()=>"";function Ii(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function kr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:d}){let l=(0,_e.useRef)(null);(0,_e.useEffect)(()=>{l.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,_e.useSyncExternalStore)(a?.subscribe??Ni,()=>Ii(a,d,e).join("\0"),Mi),c=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let p=u=>{if(u.key==="ArrowRight"||u.key==="ArrowLeft"){u.preventDefault(),u.stopPropagation(),i(u.key==="ArrowRight"?1:-1);return}(u.key==="Delete"||u.key==="Backspace")&&n!==null&&(u.preventDefault(),u.stopPropagation(),o(n))};return(0,N.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:p,"data-testid":"fs-tabs",children:e.map((u,v)=>{let g=u.key===n,P=Rn(u.path),F=t("panel.close").replace("{name}",P);return(0,N.jsxs)("div",{className:"fx-tab","data-active":g?"true":"false","data-dirty":c.has(u.path)?"true":"false",role:"presentation",children:[(0,N.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${v}`,"aria-controls":`fx-panel-${v}`,"aria-selected":g,tabIndex:g?0:-1,title:u.path,"data-testid":"fs-tab","data-path":u.path,"data-key":u.key,ref:g?l:void 0,onClick:()=>r(u.key),children:[(0,N.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Oe(u.path),"aria-hidden":"true",children:We(u.path)}),(0,N.jsx)("span",{className:"fx-tab-name",children:P}),u.revision===void 0?null:(0,N.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:u.revision,children:u.revision.slice(0,7)}),c.has(u.path)?(0,N.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,N.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:g?0:-1,"aria-label":F,title:F,"data-testid":"fs-tab-close",onClick:()=>o(u.key),children:"\xD7"})]},u.key)})})}function Sr({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,N.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,N.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,N.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,N.jsx)("span",{className:"fx-spacer"}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Di(){return(0,N.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,N.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,N.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,N.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Rr({t:e}){return(0,N.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,N.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,N.jsx)(Di,{})}),(0,N.jsx)("strong",{children:e("panel.empty.title")}),(0,N.jsx)("span",{children:e("panel.empty.description")}),(0,N.jsxs)("span",{className:"fx-empty-keys",children:[(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,N.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Pr=require("react");function H(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Pr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Ai(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var ji=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Ee(e){let n=[],t=0;for(let r of e.matchAll(ji)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(H("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(H("strong",null,...Ee(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(H("del",null,...Ee(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(H("em",null,...Ee(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=a?.[1]??i,l=a===null?void 0:Ai(a[2]??"");n.push(l===void 0?d:H("a",{href:l,rel:"noreferrer noopener"},d))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Cr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Er=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Tr=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,ut=/^\s{0,3}>\s?(.*)$/u,ft=/^\s{0,3}[-*+]\s+(.*)$/u,pt=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Oi(e){return Cr.test(e)||Er.test(e)||Tr.test(e)||ut.test(e)||ft.test(e)||pt.test(e)}function Fr(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Cr.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),c=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(H("pre",null,H("code",c===""?null:{className:`language-${c}`},p.join(`
`))));continue}let i=Er.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(H(`h${String(s)}`,null,...Ee(i[2]??""))),t+=1;continue}if(Tr.test(r)){n.push(H("hr",null)),t+=1;continue}if(ut.test(r)){let s=[];for(;t<e.length;){let c=ut.exec(e[t]??"");if(c===null)break;s.push(c[1]??""),t+=1}n.push(H("blockquote",null,...Fr(s)));continue}if(ft.exec(r)!==null){let s=[];for(;t<e.length;){let c=ft.exec(e[t]??"");if(c===null)break;s.push(H("li",null,...Ee(c[1]??""))),t+=1}n.push(H("ul",null,...s));continue}if(pt.exec(r)!==null){let s=[];for(;t<e.length;){let c=pt.exec(e[t]??"");if(c===null)break;s.push(H("li",null,...Ee(c[1]??""))),t+=1}n.push(H("ol",null,...s));continue}let l=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Oi(s))break;l.push(s.trim()),t+=1}n.push(H("p",null,...Ee(l.join(" "))))}return n}function Pn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return H("div",{className:"fx-md"},...Fr(n))}var yt=200,Wi={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Qe(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Wi[t.slice(r+1)]??"plaintext"}function en(e){return Qe(e)==="markdown"}var q=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Ze(e){return e!==null&&typeof e=="object"}function zi(e){return e===""?0:e.split(`
`).length}function Be(e,n){if(!Ze(e))throw new q("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=Ze(e.error)?e.error:{},p=typeof c.code=="string"?c.code:"preview/unknown",u=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",v=Ze(c.details)?c.details:{},g=typeof v.kind=="string"?v.kind:"";throw new q(p,u,g)}let t=e.ok===!0?e.value:e;if(!Ze(t)||typeof t.text!="string")throw new q("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):zi(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,d=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,l=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...d===void 0?{}:{source:d},...l===void 0?{}:{linkTarget:l}};return o===void 0?s:{...s,totalLines:o}}function Te(e){let n=Ze(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Je=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Cn({files:e,maxLines:n=yt}){let t=Math.max(1,Math.trunc(n)),r=Je,o=0,i=null,a=[1],d=new Set,l=c=>{r=c;for(let p of d)p()},s=async(c,p)=>{o+=1;let u=o;i?.abort();let v=new AbortController;i=v,l({status:"loading",path:c,text:r.path===c?r.text:"",offset:p,lines:r.path===c?r.lines:0,...r.path===c&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===c&&r.source!==void 0?{source:r.source}:{},eof:r.path===c?r.eof:!1});try{let g=await e.read(c,p>1?{offset:p,limit:t}:{limit:t},v.signal);if(u!==o)return;let P=Be(g,p);if(P.lines===0&&p>1){l({...r,status:"ready",eof:!0,text:"",lines:0});return}let F={status:"ready",path:c,text:P.text,offset:P.offset,lines:P.lines,eof:P.eof,...P.source===void 0?{}:{source:P.source},...P.linkTarget===void 0?{}:{linkTarget:P.linkTarget,linkPath:c}};l(P.totalLines===void 0?F:{...F,totalLines:P.totalLines})}catch(g){if(u!==o||v.signal.aborted)return;l({status:"failed",path:c,text:"",offset:p,lines:0,eof:!1,failure:Te(g)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(c){return d.add(c),()=>{d.delete(c)}},async open(c){a=[1],await s(c,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let c=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&c>r.totalLines||(a.push(c),await s(r.path,c))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let c=a[a.length-1]??1;await s(r.path,c)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],l(Je)}}}function En(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var mt=Object.freeze({chunk:Kn.chunk,id:`${ie}/${Kn.chunk}`}),gt=null,nn=null,Tn=new Map;function Lr(e){gt=e}function Nr(){return mt}function _i(e){let n=rn[e];return{chunk:n,id:`${ie}/${n}`}}function xt(){if(nn!==null)return nn;let e=gt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ie}: the loader require was not handed over`));let n=e.async(`./${mt.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ie}: chunk ${mt.id} is missing its preview renderers`);return r});return nn=n,n.catch(()=>{nn===n&&(nn=null)}),n}function Mr(e){let n=Tn.get(e);if(n!==void 0)return n;let t=gt;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ie}: the loader require was not handed over`));let r=_i(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${ie}: chunk ${r.id} is not the ${e} view`);return a});return Tn.set(e,o),o.catch(()=>{Tn.get(e)===o&&Tn.delete(e)}),o}var C=require("react");async function ht(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var ve=require("react/jsx-runtime");function Bi(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function $i(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function vt({failure:e,t:n,onRetry:t}){return(0,ve.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,ve.jsx)("strong",{children:Bi(e,n)}),(0,ve.jsx)("span",{children:$i(e,n)}),e.message===""?null:(0,ve.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,ve.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function bt({t:e}){return(0,ve.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,ve.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var wt="fsExplorer",Ir=1;function Ki(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Hi(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Gi(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function Vi(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Fn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Hi),families:[...i.match?.families??[]]}),o();let d=!0;return()=>{d&&(d=!1,t.delete(a),o())}},resolve(i){let a=Ki(i.path),d=Ve(i.path),l;for(let s of t.values())Gi(s,a,d)&&(l===void 0||Vi(s.contribution,l.contribution))&&(l=s);return l?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Dr(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Ln(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function be(e){try{return e()}catch{return}}function de(e){return e!==null&&typeof e=="object"}function zr(e){return()=>{let n=be(()=>e.workspaceFiles);if(Ln(n))return n;let t=be(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Ln(t))return t;let r=be(()=>e.remote?.workspaceFiles);if(Ln(r))return r;let o=be(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Ln(o))return o}}function _r(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Br(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Be(i,r.offset??1),i}catch(s){if(!(s instanceof q)||Te(s).kind!=="symlink")throw s;a=s}let d=await n(t,o);if(d===void 0)throw a;return{...Be(await e.read(d.absolutePath,r,o),r.offset??1),linkTarget:d.absolutePath}}}}function Ar(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function qi(e){let n=be(()=>typeof e.get=="function"?e.get("connection"):void 0),t=de(n)?n.rpc:void 0;if(!de(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function $r(e){return()=>{let n=be(()=>e.remote?.gitExplorer);if(Ar(n))return n;let t=be(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Ar(t)?t:qi(e)}}function Ui(e){return e===""?0:e.split(`
`).length}function jr(e){let n=de(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new q(t,r)}function Kr(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},d=await e.show(a,i);if(!de(d))throw new q("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(d.ok===!1)throw jr(d.error);let l=d;if(d.ok===!0&&(l=d.value),!de(l))throw new q("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw jr(l.error);let s=l;if(l.ok===!0&&(s=l.page),!de(s))throw new q("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new q("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new q("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new q("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let c=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):Ui(s.text),p=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,u=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:c,offset:p,eof:s.eof===!0,...u===void 0?{}:{source:u}}}}}function Xi(e){if(!de(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=de(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Yi(e){let n=de(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=de(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new q(t,r,i)}function Rt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Xi(await n.call(e,t,r,{},o));if(!i.ok)throw Yi(i.error);return i.value.data}}function tn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function kt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Nn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:tn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?kt(r.value):{ok:!1,message:tn(r.error)}}return kt(t)}return kt(n)}function Hr(e){return e instanceof Error?e.message:tn(e)}function Or(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Gr(e){return()=>{let n=be(()=>e.remote?.gitExplorer);if(Or(n))return n;let t=be(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Or(t))return t}}function Wr(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Zi(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Wr(r.additions),i=Wr(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function Ji(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function St(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Zi(n.stats),r=Ji(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function Mn(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:tn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?St(o.snapshot):{ok:!1,message:tn(o.error)}}let r=e;return r.snapshot!==void 0?St(r.snapshot):St(t)}var x=require("react/jsx-runtime"),Tt={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Qi=()=>()=>{},Vr=()=>{};function Ft(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Pt={status:"idle"},ea=[".md",".mdx",".markdown",".mdown"],na=-1e3;function Et({t:e,revision:n}){return(0,x.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,x.jsx)("strong",{children:e("preview.unavailable.title")}),(0,x.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function qr({chunk:e,text:n,path:t,offset:r}){let o=(0,C.useRef)(null),i=(0,C.useRef)(null),[a,d]=(0,C.useState)(!1),l=Qe(t);return(0,C.useEffect)(()=>{d(!1)},[e,t]),(0,C.useEffect)(()=>{let s=o.current;if(!(e===null||s===null))try{let c=e.mountCodePreview(s,{text:n,language:l,path:t,offset:r});return i.current=c,()=>{c.destroy(),i.current=null}}catch{d(!0);return}},[e,t,l]),(0,C.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,x.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,x.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function ta({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&en(n)?(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Pn(r)}):(0,x.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function ra(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,x.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,x.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,x.jsx)(qr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function oa(e){function n({page:t,path:r}){return(0,x.jsx)(qr,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ia({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let d=(0,C.useMemo)(()=>{let l=Rt(r);return l===void 0||t===void 0||a===void 0?l:async(s,c,p)=>{if(s!==t||c!==n)return l(s,c,p);let u=await a(c,p);return l(s,u?.absolutePath??c,p)}},[r,t,n,a]);return t===void 0||d===void 0?(0,x.jsx)(Et,{t:o}):(0,x.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:d,t:o,visible:i})}function aa(e){return{Body:n=>(0,x.jsx)(ia,{chunk:e,...n}),renderer:e.renderer}}function Lt(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...ea]},priority:0,load:()=>xt().then(ra)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:na,load:()=>xt().then(oa)},...Object.keys(rn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Mr(e).then(aa)}))]}var Ct;function sa(){if(Ct!==void 0)return Ct;let e=Fn();for(let n of Lt())e.register(n);return Ct=e,e}function Ur({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:d,documents:l,locate:s}){let c=(0,C.useMemo)(()=>{let L=r===void 0?_r(n,e):o===void 0||e===void 0?void 0:Kr(o,e,r);return L===void 0||r!==void 0||s===void 0?L:Br(L,s)},[n,e,r,o,s]),p=(0,C.useMemo)(()=>r===void 0?Rt(n):void 0,[n,r]),u=d??sa(),v=t===void 0?null:Ve(t),g=v!==null,P=r===void 0&&e!==void 0&&p!==void 0?{sessionId:e,readFile:p}:null,[F,W]=(0,C.useState)(null),[I,j]=(0,C.useState)(Je),[E,A]=(0,C.useState)(Pt),[Q,le]=(0,C.useState)(0),[ce,we]=(0,C.useState)(0),[y,R]=(0,C.useState)("reading"),[w,_]=(0,C.useState)(!1),[T,G]=(0,C.useState)(!1),[Le,Z]=(0,C.useState)(void 0),[te,ee]=(0,C.useState)(!1),z=(0,C.useRef)(void 0),M=(0,C.useRef)(void 0),$=(0,C.useSyncExternalStore)(l?.subscribe??Qi,()=>l===void 0||e===void 0||t===void 0?Vr():l.peek(e,t),Vr),U=l===void 0||e===void 0||t===void 0?void 0:l.find(e,t);if((0,C.useEffect)(()=>{if(c===void 0){W(null);return}let L=Cn({files:c,maxLines:yt});return W(L),()=>L.close()},[c]),(0,C.useEffect)(()=>{if(F===null){j(Je);return}return j(F.getSnapshot()),F.subscribe(()=>j(F.getSnapshot()))},[F]),(0,C.useEffect)(()=>{F===null||t===void 0||v!==null||F.open(t)},[F,t,v]),(0,C.useEffect)(()=>{if(!g||t===void 0||s===void 0){Z(void 0);return}let L=new AbortController,J=!0;return(async()=>{let Re=await s(t,L.signal);J&&!L.signal.aborted&&Z(Re?.absolutePath)})(),()=>{J=!1,L.abort()}},[g,t,s]),(0,C.useEffect)(()=>{R("reading"),_(!1),ee(!1)},[t]),(0,C.useEffect)(()=>()=>{z.current!==void 0&&clearTimeout(z.current),M.current!==void 0&&clearTimeout(M.current)},[]),(0,C.useEffect)(()=>{$?.conflict!==!0&&(G(!1),ee(!1),M.current!==void 0&&clearTimeout(M.current))},[$?.conflict]),(0,C.useEffect)(()=>u.subscribe(()=>le(L=>L+1)),[u]),(0,C.useEffect)(()=>{if(t===void 0||r!==void 0){A(Pt);return}let L=Dr(u,{path:t});if(L===void 0){A(Pt);return}let{contribution:J}=L,Re=!0;return A(oe=>oe.status==="ready"&&oe.contribution.id===J.id?oe:{status:"loading",contribution:J}),L.module.then(oe=>{Re&&A({status:"ready",contribution:J,module:oe})},oe=>{Re&&A({status:"failed",contribution:J,failure:Te(oe)})}),()=>{Re=!1}},[u,t,r,Q,ce]),t===void 0)return(0,x.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,x.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,x.jsx)("strong",{children:i("preview.empty.title")}),(0,x.jsx)("span",{children:i("preview.empty.description")})]})});let ae=g&&r!==void 0,Ne=En(I),Se=I.linkPath??t,ue=g?Le:I.linkTarget,fe=!g&&en(t),Me=g?!ae&&P!==null&&E.status!=="ready"&&E.status!=="failed":I.status==="loading",ne=I.status==="ready",re=fe&&y==="reading",ke=g?ae||P===null?"unavailable":E.status==="failed"?"failed":E.status==="ready"?"ready":"loading":I.status,$e=E.status==="ready"?E.module.renderer??E.contribution.id:g?"pending":re?"fallback":"plain",pe={path:ue??t,sessionId:e,files:n,t:i,visible:a,mode:y,...g?{}:{page:{text:I.text,offset:I.offset}},...s===void 0?{}:{locate:s}},B=()=>{ht(ue??Se).then(L=>{L&&(_(!0),z.current!==void 0&&clearTimeout(z.current),z.current=setTimeout(()=>_(!1),1400))})},Ie=()=>{let L=U?.copyDraft();L!==void 0&&ht(L).then(J=>{J&&(G(!0),M.current!==void 0&&clearTimeout(M.current),M.current=setTimeout(()=>G(!1),1400))})},ye=$?.error,Ke=ye!=null&&$?.conflict!==!0,me=$?.conflict===!0,De=$?.discarded??null,Ae=!me&&De!==null&&$?.dirty!==!0&&De!==$?.text,V;if(g){let L=E.status==="ready"?E.module.Body:void 0;V=ae?(0,x.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,x.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,x.jsx)("span",{children:i("preview.commitBinary.description")})]}):P===null?(0,x.jsx)(Et,{t:i,revision:r}):E.status==="failed"?(0,x.jsx)(vt,{failure:E.failure,t:i,onRetry:()=>we(J=>J+1)}):L===void 0?(0,x.jsx)(bt,{t:i}):(0,x.jsx)(L,{...pe})}else if(c===void 0)V=(0,x.jsx)(Et,{t:i,revision:r});else if(I.status==="failed")V=(0,x.jsx)(vt,{failure:I.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{F?.retry()}});else if(!ne)V=(0,x.jsx)(bt,{t:i});else{let L=E.status==="ready"?E.module.Body:ta;V=(0,x.jsx)(L,{...pe})}return(0,x.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":ke,"data-mode":g?"binary":re?"reading":"code","data-renderer":$e,children:[(0,x.jsxs)("header",{className:"fx-preview-bar",children:[(0,x.jsxs)("span",{className:"fx-preview-path",title:ue===void 0?Se:`${Se} \u2192 ${ue}`,"data-testid":"fs-preview-path",...ue===void 0?{}:{"data-link":"followed"},children:[Se,ue===void 0?null:(0,x.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",ue]})]}),g?null:(0,x.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Ne.range,Ne.range==="\u2014"?null:(0,x.jsxs)(x.Fragment,{children:[" ",i("preview.lines")]}),Ne.total===void 0?null:(0,x.jsxs)("span",{className:"fx-preview-total",children:[" / ",Ne.total," ",i("preview.lines")]})]}),(0,x.jsxs)("div",{className:"fx-preview-actions",children:[$===void 0?null:(0,x.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!$.dirty||$.saving||$.status!=="ready",onClick:()=>{U?.save()},children:$.saving?i("preview.saving"):i("preview.save")}),fe?(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>R(L=>L==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(y==="reading"?"preview.source":"preview.reading")}):null,g?null:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ne||Me||I.offset<=1,onClick:()=>{F?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!ne||Me||I.eof,onClick:()=>{F?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,x.jsx)("button",{type:"button",className:"fx-pbtn",onClick:B,"data-testid":"fs-preview-copy",children:i(w?"preview.copied":"preview.copyPath")}),Me?(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),I.source==="first-parent"?(0,x.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,me||Ae?(0,x.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":me?"conflict":"discarded",children:[(0,x.jsx)("strong",{children:i(me?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,x.jsx)("span",{className:"fx-conflict-hint",children:i(me?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,x.jsx)("span",{className:"fx-spacer"}),me?(0,x.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":te?"discard":void 0,onClick:()=>{if(!te&&$?.dirty===!0){ee(!0);return}ee(!1),U?.reload({force:!0})},children:i(te?"preview.conflict.discard":"preview.conflict.reload")}):null,Ae?(0,x.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{De!==null&&U?.setDraft(De)},children:i("preview.conflict.restore")}):null,me?(0,x.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Ie,children:i(T?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Ke?(0,x.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Ft(ye?.code??"io-error",ye?.message??"",i))}):null,(0,x.jsx)("div",{className:"fx-preview-body","data-scroll":re?"y":"none",children:V})]})}var Xr="dsh-fs-explorer-styles",da=`
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
`;function Yr(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Xr}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Xr,t.textContent=da,e.head.appendChild(t),()=>{t.remove()}}var h=require("react");var Nt="fs-explorer.treePaneWidth";function Mt(e){return Math.min(520,Math.max(180,e))}function Jr(e){if(e==null)return null;let n;try{n=e.getItem(Nt)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function In(e,n){let t=Math.round(Mt(n));if(e!=null)try{e.setItem(Nt,String(t))}catch{}return t}function Qr(e){if(e!=null)try{e.removeItem(Nt)}catch{}}function eo(e,n){return Math.round(e)===Math.round(n)}var Zr=16;function no(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Zr};case"ArrowRight":return{kind:"nudge",delta:Zr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var O=require("react");function ro(e,n,t,r=800){return t-n<=r?e:""}function oo(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function io(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:la(e,t+1,r.depth,r.depth+1)}function la(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var ca=/^.$/u;function ao(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!ca.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=to(e.names,n),d=a.find(l=>l>e.active)??a[0];return d===void 0?{kind:"miss"}:{kind:"jump",index:d,query:n}}let t=`${e.query}${n}`,r=to(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function to(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var S=require("react/jsx-runtime"),Fe=22;function It({open:e=!0,size:n=14}){return(0,S.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,S.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,S.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function ua(){return(0,S.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function so(){return(0,S.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,S.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,S.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function lo(){return(0,S.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,S.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function fa({name:e}){return(0,S.jsx)("span",{className:"fx-badge","data-icon":Oe(e),"aria-hidden":"true",children:We(e)})}function pa({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:d}){let l=e.kind==="directory",s={top:r,paddingLeft:8+e.depth*12};return(0,S.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...l?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":l?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:s,onClick:()=>{d(e.path),l?i(e.path):a(e.path)},children:[(0,S.jsx)("span",{className:"fx-chevron","data-open":l&&e.expanded?"true":"false","data-visible":l?"true":"false","aria-hidden":"true",children:(0,S.jsx)(ua,{})}),l?(0,S.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,S.jsx)(It,{open:e.expanded})}):(0,S.jsx)(fa,{name:e.name}),(0,S.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,S.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,S.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":Ue(e.status),"data-testid":"fx-file-status",title:o(Hn(e.status)),"aria-label":o(Hn(e.status)),children:an(e.status)}),e.statusCount===void 0?null:(0,S.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,S.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,S.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,S.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,S.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,S.jsx)("span",{className:"fx-size",children:gn(e.size)})]})}function ya({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,S.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,S.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,S.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,S.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function ma(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function co({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:d}){let l=(0,O.useRef)(null),[s,c]=(0,O.useState)(0),[p,u]=(0,O.useState)(0),[v,g]=(0,O.useState)(void 0),P=(0,O.useRef)(void 0),F=(0,O.useRef)({query:"",at:0}),W=(0,O.useRef)(void 0),I=(0,O.useRef)(void 0),j=(0,O.useRef)(v);j.current=v;let E=(0,O.useMemo)(()=>e.flatMap((y,R)=>y.type==="entry"?[R]:[]),[e]);(0,O.useEffect)(()=>{let y=I.current!==n;if(I.current=n,W.current!==void 0||n===void 0)return;let R=j.current===void 0?void 0:e[j.current];if(!ar({cursorPath:R?.type==="entry"?R.path:void 0,selectionMoved:y}))return;let w=e.findIndex(_=>_.type==="entry"&&_.path===n);w>=0&&g(w)},[n,e]),(0,O.useEffect)(()=>{let y=W.current;if(y===void 0)return;let R=e.findIndex(T=>T.type==="entry"&&T.path===y),w=e[R];if(w?.type!=="entry"||w.kind!=="directory"||!w.expanded){W.current=void 0;return}let _=sr(e,y);_!==void 0&&(W.current=void 0,g(_))},[e]),(0,O.useEffect)(()=>{v!==void 0&&e[v]?.type!=="entry"&&g(void 0)},[e,v]),(0,O.useEffect)(()=>{let y=l.current;if(v===void 0||y===null)return;let R=Vn({scrollTop:y.scrollTop,viewport:y.clientHeight,rowHeight:Fe,index:v});R!==y.scrollTop&&(y.scrollTop=R)},[v]);let A=(0,O.useCallback)(y=>{g(y),l.current?.focus({preventScroll:!0})},[]),Q=(0,O.useCallback)(y=>{let R=e.findIndex(w=>w.type==="entry"&&w.path===y);R>=0&&g(R)},[e]),le=(0,O.useCallback)(y=>{if(y.nativeEvent.isComposing||y.altKey||y.metaKey||y.ctrlKey)return;let R=E.at(-1);if(y.key==="ArrowDown"){if(y.preventDefault(),v===void 0){E[0]!==void 0&&A(E[0]);return}let z=E.find(M=>M>v);z!==void 0&&A(z);return}if(y.key==="ArrowUp"){if(y.preventDefault(),v===void 0){R!==void 0&&A(R);return}let z=[...E].reverse().find(M=>M<v);z!==void 0&&A(z);return}if(v===void 0)return;let w=e[v];if(w===void 0||w.type!=="entry")return;if(y.key==="ArrowRight"){if(y.preventDefault(),w.kind==="directory"&&!w.expanded)W.current=w.path,o(w.path);else{let z=E.find(M=>M>v);z!==void 0&&e[z]?.depth===w.depth+1&&A(z)}return}if(y.key==="ArrowLeft"){if(y.preventDefault(),w.kind==="directory"&&w.expanded)o(w.path);else{let z=[...E].reverse().find(M=>M<v&&e[M]?.type==="entry"&&e[M].depth<w.depth);z!==void 0&&A(z)}return}if(y.key==="Enter"&&w.kind!=="directory"){y.preventDefault(),i(w.path);return}if(y.key==="Home"){y.preventDefault(),E[0]!==void 0&&A(E[0]);return}if(y.key==="End"){y.preventDefault(),R!==void 0&&A(R);return}let _=Date.now(),T=oo(e,v),G=io(e,T),Le=G.map(z=>{let M=e[z];return M?.type==="entry"?M.name:""}),Z=ao({query:ro(F.current.query,F.current.at,_),key:y.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:y.nativeEvent.repeat,names:Le,active:v===void 0?-1:G.indexOf(v)});if(Z.kind==="clear"){F.current={query:"",at:0};return}if(Z.kind!=="jump")return;let te=G[Z.index];if(te===void 0)return;let ee=e[te];ee?.type==="entry"&&(F.current={query:Z.query,at:_},y.preventDefault(),A(te),ee.kind!=="directory"&&i(ee.path))},[v,E,A,o,i,e]);(0,O.useEffect)(()=>{let y=l.current;if(y===null)return;let R=()=>u(y.clientHeight);if(R(),typeof ResizeObserver>"u")return;let w=new ResizeObserver(R);return w.observe(y),()=>w.disconnect()},[]),(0,O.useEffect)(()=>{if(n===void 0)return;let y=l.current;if(y===null)return;let R=e.findIndex(_=>_.type==="entry"&&_.path===n);if(R<0)return;let w=R*Fe;(w<y.scrollTop||w+Fe>y.scrollTop+y.clientHeight)&&(y.scrollTop=Math.max(0,w-y.clientHeight/2))},[n,e]),(0,O.useEffect)(()=>{if(t===void 0||P.current===t)return;let y=l.current;if(y===null)return;let R=t.path===void 0?-1:e.findIndex(w=>w.type==="entry"&&w.path===t.path);if(!(t.path!==void 0&&R<0)){if(P.current=t,R>=0){let w=Vn({scrollTop:y.scrollTop,viewport:y.clientHeight===0?480:y.clientHeight,rowHeight:Fe,index:R});w!==y.scrollTop&&(y.scrollTop=w,c(w)),g(R)}ma(y),d?.()}},[t,e,d]);let ce=y=>{c(y.currentTarget.scrollTop)},we=cn(e,{scrollTop:s,height:p===0?480:p,rowHeight:Fe});return(0,S.jsx)("div",{className:"fx-scroll",ref:l,onScroll:ce,onKeyDown:le,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,S.jsx)("div",{className:"fx-vlist",style:{height:e.length*Fe},children:we.rows.map((y,R)=>{let w=(we.startIndex+R)*Fe;return y.type==="entry"?(0,S.jsx)(pa,{row:y,top:w,selected:y.path===n,cursor:v===we.startIndex+R,t:r,onToggle:o,onSelect:i,onRowActivate:Q},y.path):(0,S.jsx)(ya,{row:y,top:w,t:r,onRetry:a},y.key)})})})}var b=require("react/jsx-runtime");var ga=()=>({status:"loading",nodes:[],truncated:!1,total:0});function xa(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var ha=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,fo=new Map;function va(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Dn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,b.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,b.jsx)("strong",{children:e}),n===void 0?null:(0,b.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,b.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ba(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function po({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:d,locate:l}){let s=wr();function c(p){let u=p.sessionId??e.currentSessionId(),v=(0,h.useRef)(u);v.current=u;let g=(0,h.useMemo)(()=>r(),[r]),P=(0,h.useMemo)(()=>o(),[o]),F=(0,h.useMemo)(()=>i(),[i]),[W,I]=(0,h.useState)(()=>new Map),[j,E]=(0,h.useState)(void 0),[A,Q]=(0,h.useState)(void 0),[le,ce]=(0,h.useState)(void 0),[we,y]=(0,h.useState)(fo),R=(0,h.useRef)(W);R.current=W;let[w,_]=(0,h.useState)(()=>new Set),T=(0,h.useMemo)(()=>s.forSession(u),[s,u]),G=(0,h.useSyncExternalStore)(T.subscribe,T.snapshot,T.snapshot),Le=G.panels.find(f=>f.key===G.active),Z=Le?.path,te=Le?.revision,[ee,z]=(0,h.useState)(0),M=(0,h.useRef)(new Map),$=(0,h.useRef)(void 0),[U,ae]=(0,h.useState)(null),[Ne,Se]=(0,h.useState)(!1),[ue,fe]=(0,h.useState)(null),Me=(0,h.useRef)(null);Me.current=U?.path??null;let ne=(0,h.useMemo)(()=>xa(),[]),[re,ke]=(0,h.useState)(()=>Jr(ne)),$e=(0,h.useRef)(null),pe=(0,h.useRef)(null),B=W.get(""),Ie=B?.status==="ready",ye=(0,h.useCallback)((f,m,k,D)=>{T.open(f,m,k,D)},[T]),Ke=(0,h.useCallback)(f=>{let m=f??T.snapshot().active??void 0;if(m===void 0)return;if((u===void 0?void 0:d?.peek(u,m))?.dirty===!0){fe(null),ae({path:m});return}ae(null),fe(null),u!==void 0&&d?.forget(u,m),T.close(m)},[d,u,T]),me=(0,h.useCallback)(()=>{let f=U;if(f===null)return;let m=u===void 0?void 0:d?.find(u,f.path);if(m===void 0){ae(null),u!==void 0&&d?.forget(u,f.path),T.close(f.path);return}Se(!0),fe(null),m.save().then(k=>{if(Se(!1),!k.ok){let D=m.getSnapshot().error;fe(t("panel.confirm.failed").replace("{message}",Ft(k.code,D?.message??"",t)));return}ae(null),u!==void 0&&d?.forget(u,f.path),T.close(f.path)})},[d,U,u,T,t]),De=(0,h.useCallback)(()=>{let f=U;ae(null),fe(null),f!==null&&(u!==void 0&&d?.forget(u,f.path),T.close(f.path))},[d,U,u,T]),Ae=(0,h.useCallback)(()=>{ae(null),fe(null)},[]),V=(0,h.useCallback)(async(f,m,k)=>{M.current.get(f)?.abort();let D=new AbortController;M.current.set(f,D),I(se=>new Map(se).set(f,ga()));try{let se=await k.list(m,un(f),D.signal);if(D.signal.aborted||v.current!==m)return!1;let K=Nn(se);if(!K.ok)return I(ge=>new Map(ge).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:K.message})),!1;let je=ln(K.listing.entries);return I(ge=>new Map(ge).set(f,{status:"ready",nodes:je,truncated:K.listing.truncated===!0,total:K.listing.entries.length})),!0}catch(se){return D.signal.aborted||I(K=>new Map(K).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:Hr(se)})),!1}finally{M.current.get(f)===D&&M.current.delete(f)}},[]);(0,h.useEffect)(()=>{for(let f of M.current.values())f.abort();return M.current.clear(),I(new Map),_(new Set),$.current=void 0,u!==void 0&&g!==void 0&&V("",u,g),()=>{for(let f of M.current.values())f.abort();M.current.clear()}},[u,g,ee,V]),(0,h.useEffect)(()=>{if(u===void 0||P===void 0){E(void 0),Q(void 0),ce(void 0);return}let f=!0,m=new AbortController;return E(void 0),Q(void 0),ce(void 0),Promise.resolve().then(()=>P.snapshot({sessionId:u,maxCommits:1},m.signal)).then(k=>{if(!f)return;let D=Mn(k);if(!D.ok){E(void 0),Q(void 0),ce(void 0);return}E(Jt(on(D.status),D.stats)),Q(D.head),ce(D.root)}).catch(()=>{f&&(E(void 0),Q(void 0),ce(void 0))}),()=>{f=!1,m.abort()}},[u,P,ee]),(0,h.useEffect)(()=>{let f=g?.read;if(u===void 0||g===void 0||typeof f!="function"||!Ie){y(fo);return}let m=u,k=new AbortController,D=async(K,je)=>{try{let ge=va(await f.call(g,m,je,{},k.signal));return ge===void 0?void 0:[K,ge]}catch{return}},se=tr.filter(K=>K!==".gitmodules").map(K=>D(K,K));return le!==void 0&&se.push(D(".gitmodules",`${le.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(se).then(K=>{if(k.signal.aborted||v.current!==m)return;let je=new Map;for(let Pe of K)Pe!==void 0&&je.set(Pe[0],Pe[1]);let ge=R.current.get(""),To=new Set(ge?.status==="ready"?ge.nodes.filter(Pe=>Pe.kind==="directory").map(Pe=>Pe.name):[]);y(sn(je,To))}),()=>k.abort()},[u,g,Ie,le,ee]),(0,h.useEffect)(()=>{let f=p.viewRequest;if(f==null||f.view!==X)return;let m=`${f.view}:${f.focus}`;$.current!==m&&($.current=m,Ye(f.focus,{open:ye}),p.completeViewRequest?.())},[p.viewRequest,p.completeViewRequest,ye]),(0,h.useEffect)(()=>{let f=e.viewFocus;if(f===void 0||u===void 0)return;let m=()=>{let k=f.take(X);k!==void 0&&Ye(k,{open:ye})};return m(),f.subscribe(m)},[e,u,ye]),(0,h.useEffect)(()=>{if(Z===void 0||te!==void 0||!Ie||fn(Z))return;let f=ir(Z);if(f.length===0||(_(k=>f.every(D=>k.has(D))?k:new Set([...k,...f])),u===void 0||g===void 0))return;let m=f.filter(k=>R.current.get(k)?.status!=="ready");m.length!==0&&Promise.all(m.map(k=>V(k,u,g)))},[Z,te,Ie,u,g,V]);let L=(0,h.useCallback)(()=>{if(typeof document>"u")return!1;let f=document.querySelector("[data-composer-input]");return f===null?!1:(f.focus(),!0)},[]),J=(0,h.useCallback)(f=>{if(f.button!==0||pe.current!==null||ha())return;let m=$e.current?.previousElementSibling;if(m instanceof HTMLElement){try{f.currentTarget.setPointerCapture(f.pointerId)}catch{return}pe.current={pointerId:f.pointerId,startX:f.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:re},document.body.classList.add("fx-pane-resizing")}},[re]),Re=(0,h.useCallback)(f=>{let m=pe.current;m===null||m.pointerId!==f.pointerId||ke(Mt(m.baseWidth+f.clientX-m.startX))},[]),oe=(0,h.useCallback)(f=>{let m=pe.current;if(m===null||m.pointerId!==f.pointerId)return;pe.current=null,document.body.classList.remove("fx-pane-resizing");try{f.currentTarget.releasePointerCapture(f.pointerId)}catch{}let k=m.baseWidth+f.clientX-m.startX;if(eo(k,m.baseWidth)){ke(m.restWidth);return}ke(In(ne,k))},[ne]),zn=(0,h.useCallback)(()=>{Qr(ne),ke(null)},[ne]),bo=(0,h.useCallback)(f=>{if(f.nativeEvent.isComposing)return;let m=no(f.key,f.altKey||f.ctrlKey||f.metaKey||f.shiftKey);if(m===null)return;if(f.preventDefault(),f.stopPropagation(),m.kind==="reset"){zn();return}if(m.kind==="min"||m.kind==="max"){let se=m.kind==="min"?180:520;ke(In(ne,se));return}let k=$e.current?.previousElementSibling,D=k instanceof HTMLElement?k.getBoundingClientRect().width:re??180;ke(In(ne,D+m.delta))},[ne,zn,re]);(0,h.useEffect)(()=>()=>{pe.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,h.useEffect)(()=>{if(typeof document>"u")return;let f=m=>{if(!(m.isComposing||vr(m.target))){if(ba(m)){let k=T.snapshot().active,D=k===null||d===void 0||u===void 0?void 0:d.find(u,k);if(D===void 0)return;m.preventDefault(),m.stopPropagation(),D.save();return}for(let k of wn)if(hr(m,k)){if(k.action==="closePanel"&&T.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),k.action==="nextPanel"?T.next():k.action==="previousPanel"?T.previous():Ke();return}}};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[d,Ke,u,T]),(0,h.useEffect)(()=>{if(typeof document>"u")return;let f=kn({focusComposer:L,hasModal:()=>Me.current!==null||dt(document)}),m=k=>f(k);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[L]),(0,h.useEffect)(()=>{if(U===null||typeof document>"u")return;let f=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),Ae())};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[U,Ae]);let _n=(0,h.useMemo)(()=>mn(W,w,j,we),[W,w,j,we]),[wo,Ot]=(0,h.useState)(void 0),Wt=(0,h.useRef)(!1);(0,h.useEffect)(()=>{if(Wt.current||typeof document>"u")return;let f=dr({rows:_n,panelCount:T.snapshot().panels.length,hasModal:dt(document)});f.kind!=="skip"&&(Wt.current=!0,f.open!==void 0&&T.open(f.open),Ot({path:f.focus}))},[_n,T]);let ko=(0,h.useCallback)(()=>Ot(void 0),[]),He=j===void 0?void 0:Object.keys(j).length,So=j===void 0?"neutral":Object.values(j).some(f=>f.status==="conflicted")?"conflict":He===0?"success":"warning",zt=Zt(A),Ro=(0,h.useCallback)(f=>{if(u===void 0||g===void 0)return;if(w.has(f)){_(k=>{let D=new Set(k);return D.delete(f),D});return}_(k=>new Set(k).add(f));let m=W.get(f);(m===void 0||m.status==="failed")&&V(f,u,g)},[w,W,u,g,V]),_t=(0,h.useCallback)(f=>{u===void 0||g===void 0||V(f,u,g)},[u,g,V]),Po=()=>_(new Set),Co=()=>z(f=>f+1),Eo=u===void 0?"no-session":g===void 0?"no-service":B===void 0||B.status==="loading"?"loading":B.status==="failed"?"failed":B.nodes.length===0?"empty":"tree";return(0,b.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Eo,"data-session":u??"","data-testid":"fs-explorer-view",children:[(0,b.jsxs)("header",{className:"fx-head",children:[(0,b.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,b.jsx)(It,{open:!0})}),(0,b.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,b.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,b.jsxs)("div",{className:"fx-head-meta",children:[B?.status==="ready"?(0,b.jsxs)("span",{children:[(0,b.jsx)("b",{children:B.nodes.length})," ",t("head.entries")]}):null,(0,b.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:w.size===0,onClick:Po,children:(0,b.jsx)(lo,{})}),(0,b.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:u===void 0||g===void 0||B?.status==="loading",onClick:Co,children:(0,b.jsx)(so,{})})]})]}),(0,b.jsx)("div",{className:"fx-main",children:u===void 0?(0,b.jsx)(Dn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):g===void 0?(0,b.jsx)(Dn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):B===void 0||B.status==="loading"?(0,b.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,b.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):B.status==="failed"?(0,b.jsx)(Dn,{title:t("state.failed.title"),description:B.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>_t(""),testId:"fs-failed"}):B.nodes.length===0?(0,b.jsx)(Dn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"fx-tree-pane",style:re===null?void 0:{"--fx-tree-width":`${re}px`},children:(0,b.jsx)(co,{rows:_n,selectedPath:te===void 0?Z:void 0,entryFocus:wo,t,onToggle:Ro,onSelect:f=>T.open(f),onRetry:_t,onEntryFocusSettled:ko})}),(0,b.jsx)("div",{ref:$e,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":re??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:J,onPointerMove:Re,onPointerUp:oe,onPointerCancel:oe,onLostPointerCapture:oe,onKeyDown:bo,onDoubleClick:zn}),(0,b.jsxs)("div",{className:"fx-editor",children:[(0,b.jsx)(kr,{panels:G.panels,active:G.active,t,onActivate:f=>T.activate(f),onClose:Ke,onStep:f=>f===1?T.next():T.previous(),documents:d,sessionId:u}),U===null?null:(0,b.jsx)(Sr,{name:Rn(U.path),t,saving:Ne,error:ue,onSave:me,onDiscard:De,onCancel:Ae}),(0,b.jsx)("div",{className:"fx-editor-body",children:G.panels.length===0?(0,b.jsx)(Rr,{t}):G.panels.map((f,m)=>{let k=f.key===G.active;return(0,b.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!k,"data-line":f.line,"data-testid":"fs-panel",children:(0,b.jsx)(Ur,{sessionId:u,files:g,path:f.path,revision:f.revision,git:F,t,visible:k,renderers:a,documents:d,locate:u===void 0?void 0:l?.(u)})},f.key)})})]})]})}),B?.status==="ready"?(0,b.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,b.jsxs)("span",{children:[t("view.scope")," ",(0,b.jsx)("b",{children:B.nodes.length})," ",t("head.entries")]}),B.truncated?(0,b.jsx)("span",{className:"fx-foot-warn",children:Xe({entries:B.nodes,truncated:!0,total:B.total}).label}):null,(0,b.jsxs)("span",{className:"fx-foot-git","data-state":He===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,b.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":So,"aria-hidden":"true"}),He===void 0?t("status.unavailable"):He===0?t("status.clean"):t("status.summary").replace("{count}",String(He))]}),zt===null?null:(0,b.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[zt,A?.upstream!==void 0&&(A.ahead??0)>0?(0,b.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(A.ahead)}`}):null,A?.upstream!==void 0&&(A.behind??0)>0?(0,b.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(A.behind)}`}):null]}),(0,b.jsx)("span",{className:"fx-spacer"}),(0,b.jsx)("span",{children:t("foot.order")})]}):null]})}return c}var mo=["slots","locale","workbench","remote"];function ka(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var An,jn,At,On,jt,go;function yo(e){return jt=e,On!==void 0||(On=xr({open:(n,t,r)=>{let o=jt;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):mr(o)(n,t,r)},save:(n,t)=>{let r=jt;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):gr(r)(n,t)}})),On}function Sa(){if(At!==void 0)return At;let e=Fn({warn:n=>go?.(n)});for(let n of Lt())e.register(n);return At=e,e}var Wn;function xo(e){let n=e.workbench;if(n==null)return()=>{};go=c=>e.logger?.warn?.(c);let t=Sa(),r={version:Ir,renderers:t,registerRenderer:c=>t.register(c),documents:yo(e)};jn?.();let o=e.provide?.(wt,r);o===void 0&&e.logger?.warn?.(`${qe}: ctx.provide unavailable, ${wt} service not registered`),jn=o,An?.();let i=e.locale.register(qe,{zh:{...nt,...ct.zh,...Tt.zh},en:{...tt,...ct.en,...Tt.en}});An=i;let a=e.locale.bind(qe),d=Yr(typeof document>"u"?void 0:document),l=po({workbench:n,version:n.version,t:a,files:zr(e),status:Gr(e),git:$r(e),renderers:t,documents:yo(e),locate:c=>yr(e,c)});Wn?.();let s=et(e,n);return Wn=s,e.slots.inject($n,()=>e.slots.register({name:$n,id:X,order:100,label:()=>rt(ka(e)),locale:qe},l)),()=>{o?.(),jn===o&&(jn=void 0),s(),Wn===s&&(Wn=void 0),d(),i(),An===i&&(An=void 0)}}var ho={buildTree:ln,describeListing:Xe,iconFor:Oe,computeTreeWindow:cn,flattenTree:mn,badgeFor:We,formatSize:gn,joinPath:pn,listingPath:un,parseFocus:yn,consumeViewRequest:Ye,createPanelStack:lt,createEscapeHandler:kn,KEYMAP:wn,tabLabel:rt,normalizeListing:Nn,normalizeStatusSnapshot:Mn,buildWorkspaceMap:sn,workspaceTagFor:dn,parseStatusZ:on,statusTone:Ue,statusBadge:an,createPreviewLoader:Cn,renderMarkdown:Pn,languageFor:Qe,isMarkdownFile:en,describePage:En,classifyPreviewFailure:Te,normalizePreviewPage:Be,previewChunkRoute:Nr,canBridgeFile:xn,decideBridge:Jn,focusForFileAddress:Zn,forwardFocus:Qn,registerAddressBridge:et},vo={name:"dsh-fs-explorer",inject:mo,apply:xo,__test:ho};var Ra=vo;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
