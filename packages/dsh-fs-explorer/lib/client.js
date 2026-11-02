window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var jn=Object.defineProperty;var Eo=Object.getOwnPropertyDescriptor;var Po=Object.getOwnPropertyNames;var To=Object.prototype.hasOwnProperty;var Fo=(e,n)=>{for(var t in n)jn(e,t,{get:n[t],enumerable:!0})},No=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Po(n))!To.call(e,o)&&o!==t&&jn(e,o,{get:()=>n[o],enumerable:!(r=Eo(n,o))||r.enumerable});return e};var Lo=e=>No(jn({},"__esModule",{value:!0}),e);var ba={};Fo(ba,{__test:()=>po,apply:()=>fo,boot:()=>Er,clientPlugin:()=>yo,default:()=>va,inject:()=>co});module.exports=Lo(ba);var Me=require("react");var Ot="dsh-resource://file/";function Wt(e){try{return decodeURIComponent(e)}catch{return e}}function Oe(e){if(!e.startsWith(Ot))return null;let n=e.slice(Ot.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Wt(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),d=a<0?i:i.slice(0,a);return d.length===0?null:{sessionId:o,path:d.split("/").map(Wt).join("/")}}function fe(e){return e.slice(e.lastIndexOf("/")+1)}var zt=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function _t(){return zt.flatMap(e=>[...e.extensions])}function We(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return zt.find(o=>o.extensions.includes(r))?.family??null}var ee="dsh-fs-explorer",On="conversation.view",X="fs-explorer";var ze="fs-explorer",Bt="fsExplorerDocuments",$t="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Wn={chunk:"client.preview.js"},Ze={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Mo={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Io={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Do=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Ht(e){return typeof e=="string"&&Do.has(e)}function Kt(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Ao(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Je(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Kt(o.slice(2),i==="1"?7:8);if(a===null)continue;let d=a.fields[0]??"",l=a.rest;if(l===""||d.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[l]={status:"renamed"};continue}n[l]={status:Ao(d[0]??".",d[1]??".")};continue}if(i==="u"){let a=Kt(o.slice(2),9);if(a===null)continue;let d=a.rest;if(d==="")continue;n[d]={status:"conflicted"}}}}return n}function _e(e){return Ht(e)?Mo[e]:"neutral"}function Qe(e){return Ht(e)?Io[e]:"?"}function zn(e){return`status.${e}`}function Vt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Gt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function qt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Ut(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var jo=["conflicted","deleted","renamed","added","modified","untracked"];function Oo(e){return _e(jo.find(n=>e.has(n))??"modified")}function Xt(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),d=r.endsWith("/")?a.length:a.length-1,l="";for(let s=0;s<d;s+=1){let u=a[s];if(u===void 0||u==="")continue;l=l===""?u:`${l}/${u}`;let c=n.get(l);c===void 0?n.set(l,{count:1,present:new Set([o.status])}):(c.count+=1,c.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Oo(o.present)});return t}var Jt=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Qt=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Wo(e){return Qt.test(e)?e.slice(0,e.indexOf("/")):null}function zo(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function _o(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=zo(i[2]??"");a!==""&&Qt.test(a)&&t.push(a)}return t}function Bo(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let d=/^\[(.+)\]$/u.exec(a);if(d!==null){o(),r=/^submodule(\s|$)/u.test(d[1]??"");continue}if(!r)continue;let l=/^path\s*=\s*(.*)$/u.exec(a);l!==null&&(t=(l[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Yt(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Zt(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function en(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let d of Bo(r))t.set(d,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let d of _o(i))o.add(d);let a=e.get("package.json");if(typeof a=="string"){let d=Yt(a);if(d!==void 0){let l=d.workspaces,s=l!==null&&typeof l=="object"&&!Array.isArray(l)?l.packages:void 0;for(let u of Zt(Array.isArray(l)?l:s))o.add(u)}}for(let d of["turbo.json","lerna.json"]){let l=e.get(d);if(typeof l!="string")continue;let s=Yt(l);if(s!==void 0)for(let u of Zt(s.packages))o.add(u)}for(let d of o){let l=Wo(d);l!==null&&n.has(l)&&t.set(d,"package")}return t}function nn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var $o=new Set(["node_modules",".git","dist","__pycache__"]);function Ko(e){return $o.has(e)}function Ho(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function tn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Ko(r))continue;let o=Ho(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Vo=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Go=new Set(["md","mdx","markdown","mdown","rst","adoc"]),qo=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Uo=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Xo=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Yo=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Zo=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function er(e){let n=fe(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Ne(e,n="file"){if(n==="directory")return"folder";let t=fe(e.toLowerCase());if(Zo.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=er(t);return r===""?"file":Vo.has(r)?"code":Go.has(r)?"markdown":qo.has(r)?"data":Uo.has(r)?"image":Xo.has(r)?"style":Yo.has(r)?"archive":"file"}var Jo={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Qo={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Le(e){let n=fe(e.toLowerCase()),t=Jo[n];if(t!==void 0)return t;let r=er(n),o=Qo[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Be(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${$t} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function rn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),d=Math.floor(Math.max(0,n.scrollTop)/t)-o,l=Math.min(Math.max(d,0),a),s=Math.min(e.length,l+i+o*2);return{rows:e.slice(l,s),startIndex:l,endIndex:s}}function Bn(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function on(e){return e===""?".":e}function an(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function sn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function nr(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=sn(r,o),t.push(r);return t}function _n(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function dn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let d=_n(t[2]),l=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return l===""||d<1?void 0:{path:l,line:d,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let d=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:_n(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let a=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:_n(o[2]),absolute:!1}}function tr(e){return e.selectionMoved?!0:e.cursorPath===void 0}function rr(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function ln(e,n,t,r){let o=[],i=Xt(t),a=(d,l)=>{let s=e.get(d);if(!(s===void 0||s.status!=="ready"))for(let u of s.nodes){let c=sn(d,u.name),g=u.kind==="directory",p=g&&n.has(c),E=g||t===void 0?void 0:t[c],S=E?.status??(g?void 0:Vt(c,t)),L=E===void 0?void 0:Gt(E),F=g?i.get(c):void 0,B=g?nn(r,c):void 0;if(o.push({type:"entry",path:c,name:u.name,kind:u.kind,depth:l,expanded:p,...u.size===void 0?{}:{size:u.size},...S===void 0?{}:{status:S},...F===void 0?{}:{statusCount:F.count,statusTone:F.tone},...L===void 0?{}:{diff:L},...B===void 0?{}:{tag:B}}),!p)continue;let P=e.get(c);if(P===void 0||P.status==="loading"){o.push({type:"status",key:`${c}:loading`,path:c,depth:l+1,state:"loading"});continue}if(P.status==="failed"){o.push({type:"status",key:`${c}:failed`,path:c,depth:l+1,state:"failed",message:P.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(P.nodes.length===0){o.push({type:"status",key:`${c}:empty`,path:c,depth:l+1,state:"empty"});continue}a(c,l+1),P.truncated&&o.push({type:"status",key:`${c}:truncated`,path:c,depth:l+1,state:"truncated",label:Be({entries:P.nodes,truncated:!0,total:P.total}).label})}};return a("",0),o}var ei=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function ni(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function ti(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&ei.has(ni(n.path)))}function or(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=ti(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function cn(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var $n="dsh-fs-explorer:bridge",ri="fs-explorer-bridge",dr="dsh-resource://file/**",Kn="sidebar.right.pane.tab",oi=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),ii=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),ai=new Set(["makefile","dockerfile","license","readme","changelog"]),si=new Set([..._t(),...oi]);function di(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function un(e){if(typeof e!="string"||e==="")return!1;let n=fe(e).toLowerCase();if(n==="")return!1;let t=di(n);return ii.has(t)?!1:ai.has(n)?!0:si.has(t)}function li(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function ci(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Gn(e,n){if(typeof e!="string")return;let t=Oe(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=ci(n,li(e));return`${an(r)?"abs:":"path:"}${r}:${String(o)}`}function qn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Oe(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!un(r.path))return{action:"keep",reason:"refused"};let o=Gn(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function pe(e,n){n===void 0?console.warn(`[${ee}] ${e}`):console.warn(`[${ee}] ${e}`,n)}function ui(e){console.debug(`[${ee}] ${e}`)}function Hn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Vn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Re(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function ir(e){return Re(()=>e.sidebarRightTabs,Hn)??Re(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Hn)}function ar(e){return Re(()=>e.sidebarRight,Vn)??Re(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Vn)}function sr(e){return typeof e=="function"?e:()=>{}}var fi="dsh-resource://file/session/probe/src/main.ts";function pi(e){let n=Re(()=>(typeof e.candidates=="function"?e.candidates(fi):[]).filter(r=>r.priority==="extension"&&r.id!==$n),t=>Array.isArray(t)&&t.length>0);n!==void 0&&pe(`another extension-band tab type already claims ${dr}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function yi(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function mi(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function gi(e,n){let t=e.viewFocus;if(t?.request?.(X,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(X,n);return(!r.opened||r.focused)&&t?.take(X),r}return typeof e.openView=="function"&&e.openView(X,n)?(t?.take(X),{opened:!0,focused:!0}):(t?.take(X),{opened:!1,focused:!1})}function Un(e,n,t,r){let o;try{o=gi(e,r)}catch(i){return pe("the file workbench threw while switching views",i),e.viewFocus?.take(X),!1}if(!o.opened)return pe(`the file workbench did not switch to ${X}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return pe("the forwarded tab could not be closed",i),!1}}function xi(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,d=yi(i),l=mi(i),s=(0,Me.useRef)(void 0);return(0,Me.useEffect)(()=>{if(a===void 0){pe("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let u=qn(d,e.currentSessionId(),l);if(u.action!=="open"){pe(`left the forwarded tab standing (${u.reason})`,d);return}Un(e,n,a,u.focus)},[a,d,l]),null}return function(o){return typeof o.useTabInfo!="function"?(pe(`the host did not inject useTabInfo into ${Kn}; the bridge cannot forward`),null):(0,Me.createElement)(t,{useTabInfo:o.useTabInfo})}}function Xn(e,n){let t=(d,l)=>{if(d===void 0||l===void 0)return;pi(d);let s;try{s=d.register({id:$n,kind:ri,patterns:[dr],priority:"extension",canOpen:g=>{let p=Oe(g);return p!==null&&un(p.path)},title:g=>fe(Oe(g)?.path??g)||g})}catch(g){pe("the sidebar right refused the address bridge tab type",g);return}let u=xi(n,l),c;try{c=sr(e.slots.inject(Kn,()=>e.slots.register({name:Kn,key:$n},u)))}catch(g){s(),pe("the sidebar right refused the address bridge body",g);return}return()=>{c(),s()}},r=ir(e),o=ar(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return ui("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],d=>{let l=Re(()=>d.get?.("sidebarRightTabs"),Hn)??ir(d),s=Re(()=>d.get?.("sidebarRight"),Vn)??ar(d);return t(l,s)});return sr(a)}var Yn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Zn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function Jn(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Yn:Zn)["tab.label"]??"Files"}var hi=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ne(e){return e!==null&&typeof e=="object"}function pn(e,n){return{ok:!1,code:e,message:n}}function yn(e){let n=ne(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return pn(t,r)}function Qn(){return pn("invalid-response","the document service answered an invalid response")}function fn(e){try{return e()}catch{return}}function vi(e){let n=ne(e)?e:void 0;if(n===void 0)return Qn();if(n.ok===!1)return yn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ne(t)?t:void 0;if(r===void 0)return Qn();if(r.ok===!1)return yn(r.error);let o=ne(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Qn():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function bi(e){let n=ne(e)?e:void 0;if(n===void 0)return lr();if(n.ok===!1)return yn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ne(t)?t:void 0;if(r===void 0)return lr();if(r.ok===!1)return yn(r.error);let o=ne(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function lr(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function et(e){return ne(e)&&typeof e.open=="function"}function wi(e){let n=fn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ne(n)?n.rpc:void 0;if(!(!ne(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Bt}/${r}`,o,i)}function ki(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save")}}function cr(e){return()=>{let n=fn(()=>e.fsExplorerDocuments);if(et(n))return n;let t=fn(()=>ne(e.remote)?e.remote.fsExplorerDocuments:void 0);if(et(t))return t;let r=fn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(et(r))return r;let o=wi(e);if(o!==void 0)return ki(o)}}function ur(e){let n=cr(e);return async(t,r,o)=>{let i=n();if(i===void 0)return pn("unavailable","the document service is unavailable");try{return vi(await i.open({sessionId:t,path:r},o))}catch(a){return pn("io-error",a instanceof Error?a.message:String(a))}}}function fr(e){let n=cr(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return bi(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function pr(e){let n=new Map,t=new Set,r=0,o=(d,l)=>`${d}\0${l}`,i=()=>{r+=1;for(let d of[...t])d()},a=(d,l)=>n.get(o(d,l))?.session;return{acquire(d,l){let s=o(d,l),u=n.get(s);return u===void 0&&(u={session:new nt(d,l,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,u),i()),u.session.retain(),u.session},peek(d,l){return a(d,l)?.getSnapshot()},find:a,forget(d,l){n.get(o(d,l))?.session.abandon()},subscribe(d){return t.add(d),()=>{t.delete(d)}},revision:()=>r}}var nt=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=hi;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var mn=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Si(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function yr(e,n,t=Si()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),d=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===d}function mr(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Ri(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function tt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function gn(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Ri(n),e.onClose?.()}}var Ie=require("react");function hn(e){let n=fe(e);return n===""?e:n}function xn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Ci=Object.freeze({panels:Object.freeze([]),active:null});function gr(e,n){return n===void 0?e:`git\0${n}\0${e}`}var Ei=/^git:([0-9a-f]{4,64}):(.+)$/iu;function rt(){let e=[],n=null,t=Ci,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(u=>u.key===s),a=s=>e.findIndex(u=>u.revision===void 0&&u.key===s),d=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let u=Ei.exec(s);if(u!==null){let p=(u[1]??"").toLowerCase(),E=xn(u[2]??"",!1);if(E===void 0)return;let S=gr(E,p);return i(S)>=0?S:void 0}let c=xn(s,!0);if(c===void 0)return;if(a(c)>=0)return c;let g=xn(s,!1);if(!(g===void 0||g===c))return a(g)>=0?g:void 0},l=s=>{if(e.length===0)return;let u=n===null?-1:i(n),c=e[(u+s+e.length)%e.length];c===void 0||c.key===n||(n=c.key,o())};return{open(s,u=1,c=!1,g){let p=xn(s,c);if(p===void 0)return;let E=typeof g=="string"&&g.trim()!==""?g.trim().toLowerCase():void 0,S=gr(p,E),L=Number.isFinite(u)&&u>0?Math.trunc(u):1,F=i(S);if(F>=0){let M=e[F],W=M!==void 0&&(M.line!==L||M.absolute!==c);if(W&&(e=e.map((te,J)=>J===F?{...te,line:L,absolute:c}:te)),n===S){W&&o();return}n=S,o();return}let B=n===null?e.length:i(n)+1,P={key:S,path:p,line:L,absolute:c,...E===void 0?{}:{revision:E}};e=[...e.slice(0,B),P,...e.slice(B)],n=S,o()},close(s){let u=s===void 0?n:d(s)??null;if(u===null)return;let c=i(u);c<0||(e=e.filter(g=>g.key!==u),n===u&&(n=(e[c]??e[c-1])?.key??null),o())},activate(s){let u=d(s);u===void 0||i(u)<0||n===u||(n=u,o())},next(){l(1)},previous(){l(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let u=d(s);return u!==void 0&&i(u)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function xr(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=rt();return e.set(t,o),o}}}function $e(e,n){let t=dn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var N=require("react/jsx-runtime"),ot={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},Pi=()=>()=>{},Ti=()=>"";function Fi(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function hr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:d}){let l=(0,Ie.useRef)(null);(0,Ie.useEffect)(()=>{l.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,Ie.useSyncExternalStore)(a?.subscribe??Pi,()=>Fi(a,d,e).join("\0"),Ti),u=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let c=g=>{if(g.key==="ArrowRight"||g.key==="ArrowLeft"){g.preventDefault(),g.stopPropagation(),i(g.key==="ArrowRight"?1:-1);return}(g.key==="Delete"||g.key==="Backspace")&&n!==null&&(g.preventDefault(),g.stopPropagation(),o(n))};return(0,N.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:c,"data-testid":"fs-tabs",children:e.map((g,p)=>{let E=g.key===n,S=hn(g.path),L=t("panel.close").replace("{name}",S);return(0,N.jsxs)("div",{className:"fx-tab","data-active":E?"true":"false","data-dirty":u.has(g.path)?"true":"false",role:"presentation",children:[(0,N.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${p}`,"aria-controls":`fx-panel-${p}`,"aria-selected":E,tabIndex:E?0:-1,title:g.path,"data-testid":"fs-tab","data-path":g.path,"data-key":g.key,ref:E?l:void 0,onClick:()=>r(g.key),children:[(0,N.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Ne(g.path),"aria-hidden":"true",children:Le(g.path)}),(0,N.jsx)("span",{className:"fx-tab-name",children:S}),g.revision===void 0?null:(0,N.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:g.revision,children:g.revision.slice(0,7)}),u.has(g.path)?(0,N.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,N.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:E?0:-1,"aria-label":L,title:L,"data-testid":"fs-tab-close",onClick:()=>o(g.key),children:"\xD7"})]},g.key)})})}function vr({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,N.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,N.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,N.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,N.jsx)("span",{className:"fx-spacer"}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,N.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Ni(){return(0,N.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,N.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,N.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,N.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function br({t:e}){return(0,N.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,N.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,N.jsx)(Ni,{})}),(0,N.jsx)("strong",{children:e("panel.empty.title")}),(0,N.jsx)("span",{children:e("panel.empty.description")}),(0,N.jsxs)("span",{className:"fx-empty-keys",children:[(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,N.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,N.jsx)("span",{children:e("panel.empty.keys")})]})]})}var wr=require("react");function V(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,wr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Li(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Mi=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Ce(e){let n=[],t=0;for(let r of e.matchAll(Mi)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(V("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(V("strong",null,...Ce(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(V("del",null,...Ce(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(V("em",null,...Ce(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),d=a?.[1]??i,l=a===null?void 0:Li(a[2]??"");n.push(l===void 0?d:V("a",{href:l,rel:"noreferrer noopener"},d))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var kr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Sr=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Rr=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,it=/^\s{0,3}>\s?(.*)$/u,at=/^\s{0,3}[-*+]\s+(.*)$/u,st=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Ii(e){return kr.test(e)||Sr.test(e)||Rr.test(e)||it.test(e)||at.test(e)||st.test(e)}function Cr(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=kr.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),u=o[2]??"",c=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)c.push(e[t]??""),t+=1;t+=1,n.push(V("pre",null,V("code",u===""?null:{className:`language-${u}`},c.join(`
`))));continue}let i=Sr.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(V(`h${String(s)}`,null,...Ce(i[2]??""))),t+=1;continue}if(Rr.test(r)){n.push(V("hr",null)),t+=1;continue}if(it.test(r)){let s=[];for(;t<e.length;){let u=it.exec(e[t]??"");if(u===null)break;s.push(u[1]??""),t+=1}n.push(V("blockquote",null,...Cr(s)));continue}if(at.exec(r)!==null){let s=[];for(;t<e.length;){let u=at.exec(e[t]??"");if(u===null)break;s.push(V("li",null,...Ce(u[1]??""))),t+=1}n.push(V("ul",null,...s));continue}if(st.exec(r)!==null){let s=[];for(;t<e.length;){let u=st.exec(e[t]??"");if(u===null)break;s.push(V("li",null,...Ce(u[1]??""))),t+=1}n.push(V("ol",null,...s));continue}let l=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Ii(s))break;l.push(s.trim()),t+=1}n.push(V("p",null,...Ce(l.join(" "))))}return n}function vn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return V("div",{className:"fx-md"},...Cr(n))}var dt=200,Di={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Ve(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Di[t.slice(r+1)]??"plaintext"}function Ge(e){return Ve(e)==="markdown"}var Y=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Ke(e){return e!==null&&typeof e=="object"}function Ai(e){return e===""?0:e.split(`
`).length}function lt(e,n){if(!Ke(e))throw new Y("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let s=Ke(e.error)?e.error:{},u=typeof s.code=="string"?s.code:"preview/unknown",c=typeof s.message=="string"?s.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",g=Ke(s.details)?s.details:{},p=typeof g.kind=="string"?g.kind:"";throw new Y(u,c,p)}let t=e.ok===!0?e.value:e;if(!Ke(t)||typeof t.text!="string")throw new Y("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ai(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,d=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,l={text:t.text,lines:r,offset:i,eof:a,...d===void 0?{}:{source:d}};return o===void 0?l:{...l,totalLines:o}}function qe(e){let n=Ke(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var He=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function bn({files:e,maxLines:n=dt}){let t=Math.max(1,Math.trunc(n)),r=He,o=0,i=null,a=[1],d=new Set,l=u=>{r=u;for(let c of d)c()},s=async(u,c)=>{o+=1;let g=o;i?.abort();let p=new AbortController;i=p,l({status:"loading",path:u,text:r.path===u?r.text:"",offset:c,lines:r.path===u?r.lines:0,...r.path===u&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===u&&r.source!==void 0?{source:r.source}:{},eof:r.path===u?r.eof:!1});try{let E=await e.read(u,c>1?{offset:c,limit:t}:{limit:t},p.signal);if(g!==o)return;let S=lt(E,c);if(S.lines===0&&c>1){l({...r,status:"ready",eof:!0,text:"",lines:0});return}let L={status:"ready",path:u,text:S.text,offset:S.offset,lines:S.lines,eof:S.eof,...S.source===void 0?{}:{source:S.source}};l(S.totalLines===void 0?L:{...L,totalLines:S.totalLines})}catch(E){if(g!==o||p.signal.aborted)return;l({status:"failed",path:u,text:"",offset:c,lines:0,eof:!1,failure:qe(E)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(u){return d.add(u),()=>{d.delete(u)}},async open(u){a=[1],await s(u,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let u=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&u>r.totalLines||(a.push(u),await s(r.path,u))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let u=a[a.length-1]??1;await s(r.path,u)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],l(He)}}}function wn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var ct=Object.freeze({chunk:Wn.chunk,id:`${ee}/${Wn.chunk}`}),ut=null,Ue=null,kn=new Map;function Er(e){ut=e}function Pr(){return ct}function ji(e){let n=Ze[e];return{chunk:n,id:`${ee}/${n}`}}function ft(){if(Ue!==null)return Ue;let e=ut;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let n=e.async(`./${ct.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ee}: chunk ${ct.id} is missing its preview renderers`);return r});return Ue=n,n.catch(()=>{Ue===n&&(Ue=null)}),n}function Tr(e){let n=kn.get(e);if(n!==void 0)return n;let t=ut;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ee}: the loader require was not handed over`));let r=ji(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${ee}: chunk ${r.id} is not the ${e} view`);return a});return kn.set(e,o),o.catch(()=>{kn.get(e)===o&&kn.delete(e)}),o}var T=require("react");async function pt(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var ye=require("react/jsx-runtime");function Oi(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Wi(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function yt({failure:e,t:n,onRetry:t}){return(0,ye.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,ye.jsx)("strong",{children:Oi(e,n)}),(0,ye.jsx)("span",{children:Wi(e,n)}),e.message===""?null:(0,ye.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,ye.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function mt({t:e}){return(0,ye.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,ye.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var gt="fsExplorer",Fr=1;function zi(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function _i(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Bi(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function $i(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Sn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(_i),families:[...i.match?.families??[]]}),o();let d=!0;return()=>{d&&(d=!1,t.delete(a),o())}},resolve(i){let a=zi(i.path),d=We(i.path),l;for(let s of t.values())Bi(s,a,d)&&(l===void 0||$i(s.contribution,l.contribution))&&(l=s);return l?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Nr(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Rn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function ve(e){try{return e()}catch{return}}function Ar(e){return()=>{let n=ve(()=>e.workspaceFiles);if(Rn(n))return n;let t=ve(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Rn(t))return t;let r=ve(()=>e.remote?.workspaceFiles);if(Rn(r))return r;let o=ve(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Rn(o))return o}}function jr(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Lr(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function Or(e){return()=>{let n=ve(()=>e.remote?.gitExplorer);if(Lr(n))return n;let t=ve(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Lr(t)?t:void 0}}function Ki(e){return e===""?0:e.split(`
`).length}function Mr(e){let n=be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new Y(t,r)}function Wr(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},d=await e.show(a,i);if(!be(d))throw new Y("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(d.ok===!1)throw Mr(d.error);let l=d;if(d.ok===!0&&(l=d.value),!be(l))throw new Y("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw Mr(l.error);let s=l;if(l.ok===!0&&(s=l.page),!be(s))throw new Y("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new Y("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new Y("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new Y("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let u=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):Ki(s.text),c=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,g=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:u,offset:c,eof:s.eof===!0,...g===void 0?{}:{source:g}}}}}function be(e){return e!==null&&typeof e=="object"}function Hi(e){if(!be(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=be(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Vi(e){let n=be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=be(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new Y(t,r,i)}function vt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Hi(await n.call(e,t,r,{},o));if(!i.ok)throw Vi(i.error);return i.value.data}}function Xe(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function xt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Cn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Xe(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?xt(r.value):{ok:!1,message:Xe(r.error)}}return xt(t)}return xt(n)}function zr(e){return e instanceof Error?e.message:Xe(e)}function Ir(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function _r(e){return()=>{let n=ve(()=>e.remote?.gitExplorer);if(Ir(n))return n;let t=ve(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(Ir(t))return t}}function Dr(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Gi(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Dr(r.additions),i=Dr(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function qi(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function ht(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Gi(n.stats),r=qi(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function En(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Xe(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?ht(o.snapshot):{ok:!1,message:Xe(o.error)}}let r=e;return r.snapshot!==void 0?ht(r.snapshot):ht(t)}var h=require("react/jsx-runtime"),St={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Ui=()=>()=>{},Br=()=>{};function Rt(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var bt={status:"idle"},Xi=[".md",".mdx",".markdown",".mdown"],Yi=-1e3;function kt({t:e}){return(0,h.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,h.jsx)("strong",{children:e("preview.unavailable.title")}),(0,h.jsx)("span",{children:e("preview.unavailable.description")})]})}function $r({chunk:e,text:n,path:t,offset:r}){let o=(0,T.useRef)(null),i=(0,T.useRef)(null),[a,d]=(0,T.useState)(!1),l=Ve(t);return(0,T.useEffect)(()=>{d(!1)},[e,t]),(0,T.useEffect)(()=>{let s=o.current;if(!(e===null||s===null))try{let u=e.mountCodePreview(s,{text:n,language:l,path:t,offset:r});return i.current=u,()=>{u.destroy(),i.current=null}}catch{d(!0);return}},[e,t,l]),(0,T.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,h.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,h.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Zi({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Ge(n)?(0,h.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:vn(r)}):(0,h.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Ji(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,h.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,h.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,h.jsx)($r,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Qi(e){function n({page:t,path:r}){return(0,h.jsx)($r,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function ea({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i}){let a=(0,T.useMemo)(()=>vt(r),[r]);return t===void 0||a===void 0?(0,h.jsx)(kt,{t:o}):(0,h.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:a,t:o,visible:i})}function na(e){return{Body:n=>(0,h.jsx)(ea,{chunk:e,...n}),renderer:e.renderer}}function Ct(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Xi]},priority:0,load:()=>ft().then(Ji)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:Yi,load:()=>ft().then(Qi)},...Object.keys(Ze).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Tr(e).then(na)}))]}var wt;function ta(){if(wt!==void 0)return wt;let e=Sn();for(let n of Ct())e.register(n);return wt=e,e}function Kr({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:d,documents:l}){let s=(0,T.useMemo)(()=>r===void 0?jr(n,e):o===void 0||e===void 0?void 0:Wr(o,e,r),[n,e,r,o]),u=(0,T.useMemo)(()=>r===void 0?vt(n):void 0,[n,r]),c=d??ta(),g=t===void 0?null:We(t),p=g!==null,E=r===void 0&&e!==void 0&&u!==void 0?{sessionId:e,readFile:u}:null,[S,L]=(0,T.useState)(null),[F,B]=(0,T.useState)(He),[P,M]=(0,T.useState)(bt),[W,te]=(0,T.useState)(0),[J,Pe]=(0,T.useState)(0),[re,y]=(0,T.useState)("reading"),[R,v]=(0,T.useState)(!1),[C,$]=(0,T.useState)(!1),[oe,Z]=(0,T.useState)(!1),q=(0,T.useRef)(void 0),G=(0,T.useRef)(void 0),z=(0,T.useSyncExternalStore)(l?.subscribe??Ui,()=>l===void 0||e===void 0||t===void 0?Br():l.peek(e,t),Br),I=l===void 0||e===void 0||t===void 0?void 0:l.find(e,t);if((0,T.useEffect)(()=>{if(s===void 0){L(null);return}let O=bn({files:s,maxLines:dt});return L(O),()=>O.close()},[s]),(0,T.useEffect)(()=>{if(S===null){B(He);return}return B(S.getSnapshot()),S.subscribe(()=>B(S.getSnapshot()))},[S]),(0,T.useEffect)(()=>{S===null||t===void 0||g!==null||S.open(t)},[S,t,g]),(0,T.useEffect)(()=>{y("reading"),v(!1),Z(!1)},[t]),(0,T.useEffect)(()=>()=>{q.current!==void 0&&clearTimeout(q.current),G.current!==void 0&&clearTimeout(G.current)},[]),(0,T.useEffect)(()=>{z?.conflict!==!0&&($(!1),Z(!1),G.current!==void 0&&clearTimeout(G.current))},[z?.conflict]),(0,T.useEffect)(()=>c.subscribe(()=>te(O=>O+1)),[c]),(0,T.useEffect)(()=>{if(t===void 0||r!==void 0){M(bt);return}let O=Nr(c,{path:t});if(O===void 0){M(bt);return}let{contribution:ae}=O,ke=!0;return M(K=>K.status==="ready"&&K.contribution.id===ae.id?K:{status:"loading",contribution:ae}),O.module.then(K=>{ke&&M({status:"ready",contribution:ae,module:K})},K=>{ke&&M({status:"failed",contribution:ae,failure:qe(K)})}),()=>{ke=!1}},[c,t,r,W,J]),t===void 0)return(0,h.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,h.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,h.jsx)("strong",{children:i("preview.empty.title")}),(0,h.jsx)("span",{children:i("preview.empty.description")})]})});let _=p&&r!==void 0,U=wn(F),de=!p&&Ge(t),De=p?!_&&E!==null&&P.status!=="ready"&&P.status!=="failed":F.status==="loading",Te=F.status==="ready",Ae=de&&re==="reading",me=p?_||E===null?"unavailable":P.status==="failed"?"failed":P.status==="ready"?"ready":"loading":F.status,Ye=P.status==="ready"?P.module.renderer??P.contribution.id:p?"pending":Ae?"fallback":"plain",Q={path:t,sessionId:e,files:n,t:i,visible:a,mode:re,...p?{}:{page:{text:F.text,offset:F.offset}}},le=()=>{pt(t).then(O=>{O&&(v(!0),q.current!==void 0&&clearTimeout(q.current),q.current=setTimeout(()=>v(!1),1400))})},ge=()=>{let O=I?.copyDraft();O!==void 0&&pt(O).then(ae=>{ae&&($(!0),G.current!==void 0&&clearTimeout(G.current),G.current=setTimeout(()=>$(!1),1400))})},xe=z?.error,he=xe!=null&&z?.conflict!==!0,A=z?.conflict===!0,ce=z?.discarded??null,we=!A&&ce!==null&&z?.dirty!==!0&&ce!==z?.text,ie;if(p){let O=P.status==="ready"?P.module.Body:void 0;ie=_?(0,h.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,h.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,h.jsx)("span",{children:i("preview.commitBinary.description")})]}):E===null?(0,h.jsx)(kt,{t:i}):P.status==="failed"?(0,h.jsx)(yt,{failure:P.failure,t:i,onRetry:()=>Pe(ae=>ae+1)}):O===void 0?(0,h.jsx)(mt,{t:i}):(0,h.jsx)(O,{...Q})}else if(s===void 0)ie=(0,h.jsx)(kt,{t:i});else if(F.status==="failed")ie=(0,h.jsx)(yt,{failure:F.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{S?.retry()}});else if(!Te)ie=(0,h.jsx)(mt,{t:i});else{let O=P.status==="ready"?P.module.Body:Zi;ie=(0,h.jsx)(O,{...Q})}return(0,h.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":me,"data-mode":p?"binary":Ae?"reading":"code","data-renderer":Ye,children:[(0,h.jsxs)("header",{className:"fx-preview-bar",children:[(0,h.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),p?null:(0,h.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[U.range,U.range==="\u2014"?null:(0,h.jsxs)(h.Fragment,{children:[" ",i("preview.lines")]}),U.total===void 0?null:(0,h.jsxs)("span",{className:"fx-preview-total",children:[" / ",U.total," ",i("preview.lines")]})]}),(0,h.jsxs)("div",{className:"fx-preview-actions",children:[z===void 0?null:(0,h.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!z.dirty||z.saving||z.status!=="ready",onClick:()=>{I?.save()},children:z.saving?i("preview.saving"):i("preview.save")}),de?(0,h.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>y(O=>O==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(re==="reading"?"preview.source":"preview.reading")}):null,p?null:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Te||De||F.offset<=1,onClick:()=>{S?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,h.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Te||De||F.eof,onClick:()=>{S?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,h.jsx)("button",{type:"button",className:"fx-pbtn",onClick:le,"data-testid":"fs-preview-copy",children:i(R?"preview.copied":"preview.copyPath")}),De?(0,h.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),F.source==="first-parent"?(0,h.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,A||we?(0,h.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":A?"conflict":"discarded",children:[(0,h.jsx)("strong",{children:i(A?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,h.jsx)("span",{className:"fx-conflict-hint",children:i(A?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,h.jsx)("span",{className:"fx-spacer"}),A?(0,h.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":oe?"discard":void 0,onClick:()=>{if(!oe&&z?.dirty===!0){Z(!0);return}Z(!1),I?.reload({force:!0})},children:i(oe?"preview.conflict.discard":"preview.conflict.reload")}):null,we?(0,h.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{ce!==null&&I?.setDraft(ce)},children:i("preview.conflict.restore")}):null,A?(0,h.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:ge,children:i(C?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,he?(0,h.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Rt(xe?.code??"io-error",xe?.message??"",i))}):null,(0,h.jsx)("div",{className:"fx-preview-body","data-scroll":Ae?"y":"none",children:ie})]})}var Hr="dsh-fs-explorer-styles",ra=`
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
`;function Vr(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Hr}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Hr,t.textContent=ra,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var Et="fs-explorer.treePaneWidth";function Pt(e){return Math.min(520,Math.max(180,e))}function qr(e){if(e==null)return null;let n;try{n=e.getItem(Et)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Pn(e,n){let t=Math.round(Pt(n));if(e!=null)try{e.setItem(Et,String(t))}catch{}return t}function Ur(e){if(e!=null)try{e.removeItem(Et)}catch{}}function Xr(e,n){return Math.round(e)===Math.round(n)}var Gr=16;function Yr(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Gr};case"ArrowRight":return{kind:"nudge",delta:Gr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var j=require("react");function Jr(e,n,t,r=800){return t-n<=r?e:""}function Qr(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function eo(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:oa(e,t+1,r.depth,r.depth+1)}function oa(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var ia=/^.$/u;function no(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!ia.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Zr(e.names,n),d=a.find(l=>l>e.active)??a[0];return d===void 0?{kind:"miss"}:{kind:"jump",index:d,query:n}}let t=`${e.query}${n}`,r=Zr(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Zr(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var k=require("react/jsx-runtime"),Ee=22;function Tt({open:e=!0,size:n=14}){return(0,k.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,k.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,k.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function aa(){return(0,k.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,k.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function to(){return(0,k.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,k.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,k.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function ro(){return(0,k.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,k.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function sa({name:e}){return(0,k.jsx)("span",{className:"fx-badge","data-icon":Ne(e),"aria-hidden":"true",children:Le(e)})}function da({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:d}){let l=e.kind==="directory",s={top:r,paddingLeft:8+e.depth*12};return(0,k.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...l?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":l?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:s,onClick:()=>{d(e.path),l?i(e.path):a(e.path)},children:[(0,k.jsx)("span",{className:"fx-chevron","data-open":l&&e.expanded?"true":"false","data-visible":l?"true":"false","aria-hidden":"true",children:(0,k.jsx)(aa,{})}),l?(0,k.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,k.jsx)(Tt,{open:e.expanded})}):(0,k.jsx)(sa,{name:e.name}),(0,k.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,k.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,k.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":_e(e.status),"data-testid":"fx-file-status",title:o(zn(e.status)),"aria-label":o(zn(e.status)),children:Qe(e.status)}),e.statusCount===void 0?null:(0,k.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,k.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,k.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,k.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,k.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,k.jsx)("span",{className:"fx-size",children:cn(e.size)})]})}function la({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,k.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,k.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,k.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,k.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,k.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function ca(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function oo({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:d}){let l=(0,j.useRef)(null),[s,u]=(0,j.useState)(0),[c,g]=(0,j.useState)(0),[p,E]=(0,j.useState)(void 0),S=(0,j.useRef)(void 0),L=(0,j.useRef)({query:"",at:0}),F=(0,j.useRef)(void 0),B=(0,j.useRef)(void 0),P=(0,j.useRef)(p);P.current=p;let M=(0,j.useMemo)(()=>e.flatMap((y,R)=>y.type==="entry"?[R]:[]),[e]);(0,j.useEffect)(()=>{let y=B.current!==n;if(B.current=n,F.current!==void 0||n===void 0)return;let R=P.current===void 0?void 0:e[P.current];if(!tr({cursorPath:R?.type==="entry"?R.path:void 0,selectionMoved:y}))return;let v=e.findIndex(C=>C.type==="entry"&&C.path===n);v>=0&&E(v)},[n,e]),(0,j.useEffect)(()=>{let y=F.current;if(y===void 0)return;let R=e.findIndex($=>$.type==="entry"&&$.path===y),v=e[R];if(v?.type!=="entry"||v.kind!=="directory"||!v.expanded){F.current=void 0;return}let C=rr(e,y);C!==void 0&&(F.current=void 0,E(C))},[e]),(0,j.useEffect)(()=>{p!==void 0&&e[p]?.type!=="entry"&&E(void 0)},[e,p]),(0,j.useEffect)(()=>{let y=l.current;if(p===void 0||y===null)return;let R=Bn({scrollTop:y.scrollTop,viewport:y.clientHeight,rowHeight:Ee,index:p});R!==y.scrollTop&&(y.scrollTop=R)},[p]);let W=(0,j.useCallback)(y=>{E(y),l.current?.focus({preventScroll:!0})},[]),te=(0,j.useCallback)(y=>{let R=e.findIndex(v=>v.type==="entry"&&v.path===y);R>=0&&E(R)},[e]),J=(0,j.useCallback)(y=>{if(y.nativeEvent.isComposing||y.altKey||y.metaKey||y.ctrlKey)return;let R=M.at(-1);if(y.key==="ArrowDown"){if(y.preventDefault(),p===void 0){M[0]!==void 0&&W(M[0]);return}let I=M.find(_=>_>p);I!==void 0&&W(I);return}if(y.key==="ArrowUp"){if(y.preventDefault(),p===void 0){R!==void 0&&W(R);return}let I=[...M].reverse().find(_=>_<p);I!==void 0&&W(I);return}if(p===void 0)return;let v=e[p];if(v===void 0||v.type!=="entry")return;if(y.key==="ArrowRight"){if(y.preventDefault(),v.kind==="directory"&&!v.expanded)F.current=v.path,o(v.path);else{let I=M.find(_=>_>p);I!==void 0&&e[I]?.depth===v.depth+1&&W(I)}return}if(y.key==="ArrowLeft"){if(y.preventDefault(),v.kind==="directory"&&v.expanded)o(v.path);else{let I=[...M].reverse().find(_=>_<p&&e[_]?.type==="entry"&&e[_].depth<v.depth);I!==void 0&&W(I)}return}if(y.key==="Enter"&&v.kind!=="directory"){y.preventDefault(),i(v.path);return}if(y.key==="Home"){y.preventDefault(),M[0]!==void 0&&W(M[0]);return}if(y.key==="End"){y.preventDefault(),R!==void 0&&W(R);return}let C=Date.now(),$=Qr(e,p),oe=eo(e,$),Z=oe.map(I=>{let _=e[I];return _?.type==="entry"?_.name:""}),q=no({query:Jr(L.current.query,L.current.at,C),key:y.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:y.nativeEvent.repeat,names:Z,active:p===void 0?-1:oe.indexOf(p)});if(q.kind==="clear"){L.current={query:"",at:0};return}if(q.kind!=="jump")return;let G=oe[q.index];if(G===void 0)return;let z=e[G];z?.type==="entry"&&(L.current={query:q.query,at:C},y.preventDefault(),W(G),z.kind!=="directory"&&i(z.path))},[p,M,W,o,i,e]);(0,j.useEffect)(()=>{let y=l.current;if(y===null)return;let R=()=>g(y.clientHeight);if(R(),typeof ResizeObserver>"u")return;let v=new ResizeObserver(R);return v.observe(y),()=>v.disconnect()},[]),(0,j.useEffect)(()=>{if(n===void 0)return;let y=l.current;if(y===null)return;let R=e.findIndex(C=>C.type==="entry"&&C.path===n);if(R<0)return;let v=R*Ee;(v<y.scrollTop||v+Ee>y.scrollTop+y.clientHeight)&&(y.scrollTop=Math.max(0,v-y.clientHeight/2))},[n,e]),(0,j.useEffect)(()=>{if(t===void 0||S.current===t)return;let y=l.current;if(y===null)return;let R=t.path===void 0?-1:e.findIndex(v=>v.type==="entry"&&v.path===t.path);if(!(t.path!==void 0&&R<0)){if(S.current=t,R>=0){let v=Bn({scrollTop:y.scrollTop,viewport:y.clientHeight===0?480:y.clientHeight,rowHeight:Ee,index:R});v!==y.scrollTop&&(y.scrollTop=v,u(v)),E(R)}ca(y),d?.()}},[t,e,d]);let Pe=y=>{u(y.currentTarget.scrollTop)},re=rn(e,{scrollTop:s,height:c===0?480:c,rowHeight:Ee});return(0,k.jsx)("div",{className:"fx-scroll",ref:l,onScroll:Pe,onKeyDown:J,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,k.jsx)("div",{className:"fx-vlist",style:{height:e.length*Ee},children:re.rows.map((y,R)=>{let v=(re.startIndex+R)*Ee;return y.type==="entry"?(0,k.jsx)(da,{row:y,top:v,selected:y.path===n,cursor:p===re.startIndex+R,t:r,onToggle:o,onSelect:i,onRowActivate:te},y.path):(0,k.jsx)(la,{row:y,top:v,t:r,onRetry:a},y.key)})})})}var b=require("react/jsx-runtime");var ua=()=>({status:"loading",nodes:[],truncated:!1,total:0});function fa(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var pa=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,ao=new Map;function ya(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Tn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,b.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,b.jsx)("strong",{children:e}),n===void 0?null:(0,b.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,b.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ma(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function so({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:d}){let l=xr();function s(u){let c=u.sessionId??e.currentSessionId(),g=(0,x.useRef)(c);g.current=c;let p=(0,x.useMemo)(()=>r(),[r]),E=(0,x.useMemo)(()=>o(),[o]),S=(0,x.useMemo)(()=>i(),[i]),[L,F]=(0,x.useState)(()=>new Map),[B,P]=(0,x.useState)(void 0),[M,W]=(0,x.useState)(void 0),[te,J]=(0,x.useState)(void 0),[Pe,re]=(0,x.useState)(ao),y=(0,x.useRef)(L);y.current=L;let[R,v]=(0,x.useState)(()=>new Set),C=(0,x.useMemo)(()=>l.forSession(c),[l,c]),$=(0,x.useSyncExternalStore)(C.subscribe,C.snapshot,C.snapshot),oe=$.panels.find(f=>f.key===$.active),Z=oe?.path,q=oe?.revision,[G,z]=(0,x.useState)(0),I=(0,x.useRef)(new Map),_=(0,x.useRef)(void 0),[U,de]=(0,x.useState)(null),[De,Te]=(0,x.useState)(!1),[Ae,me]=(0,x.useState)(null),Ye=(0,x.useRef)(null);Ye.current=U?.path??null;let Q=(0,x.useMemo)(()=>fa(),[]),[le,ge]=(0,x.useState)(()=>qr(Q)),xe=(0,x.useRef)(null),he=(0,x.useRef)(null),A=L.get(""),ce=A?.status==="ready",we=(0,x.useCallback)((f,m,w,D)=>{C.open(f,m,w,D)},[C]),ie=(0,x.useCallback)(f=>{let m=f??C.snapshot().active??void 0;if(m===void 0)return;if((c===void 0?void 0:d?.peek(c,m))?.dirty===!0){me(null),de({path:m});return}de(null),me(null),c!==void 0&&d?.forget(c,m),C.close(m)},[d,c,C]),O=(0,x.useCallback)(()=>{let f=U;if(f===null)return;let m=c===void 0?void 0:d?.find(c,f.path);if(m===void 0){de(null),c!==void 0&&d?.forget(c,f.path),C.close(f.path);return}Te(!0),me(null),m.save().then(w=>{if(Te(!1),!w.ok){let D=m.getSnapshot().error;me(t("panel.confirm.failed").replace("{message}",Rt(w.code,D?.message??"",t)));return}de(null),c!==void 0&&d?.forget(c,f.path),C.close(f.path)})},[d,U,c,C,t]),ae=(0,x.useCallback)(()=>{let f=U;de(null),me(null),f!==null&&(c!==void 0&&d?.forget(c,f.path),C.close(f.path))},[d,U,c,C]),ke=(0,x.useCallback)(()=>{de(null),me(null)},[]),K=(0,x.useCallback)(async(f,m,w)=>{I.current.get(f)?.abort();let D=new AbortController;I.current.set(f,D),F(se=>new Map(se).set(f,ua()));try{let se=await w.list(m,on(f),D.signal);if(D.signal.aborted||g.current!==m)return!1;let H=Cn(se);if(!H.ok)return F(ue=>new Map(ue).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:H.message})),!1;let Fe=tn(H.listing.entries);return F(ue=>new Map(ue).set(f,{status:"ready",nodes:Fe,truncated:H.listing.truncated===!0,total:H.listing.entries.length})),!0}catch(se){return D.signal.aborted||F(H=>new Map(H).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:zr(se)})),!1}finally{I.current.get(f)===D&&I.current.delete(f)}},[]);(0,x.useEffect)(()=>{for(let f of I.current.values())f.abort();return I.current.clear(),F(new Map),v(new Set),_.current=void 0,c!==void 0&&p!==void 0&&K("",c,p),()=>{for(let f of I.current.values())f.abort();I.current.clear()}},[c,p,G,K]),(0,x.useEffect)(()=>{if(c===void 0||E===void 0){P(void 0),W(void 0),J(void 0);return}let f=!0,m=new AbortController;return P(void 0),W(void 0),J(void 0),Promise.resolve().then(()=>E.snapshot({sessionId:c,maxCommits:1},m.signal)).then(w=>{if(!f)return;let D=En(w);if(!D.ok){P(void 0),W(void 0),J(void 0);return}P(Ut(Je(D.status),D.stats)),W(D.head),J(D.root)}).catch(()=>{f&&(P(void 0),W(void 0),J(void 0))}),()=>{f=!1,m.abort()}},[c,E,G]),(0,x.useEffect)(()=>{let f=p?.read;if(c===void 0||p===void 0||typeof f!="function"||!ce){re(ao);return}let m=c,w=new AbortController,D=async(H,Fe)=>{try{let ue=ya(await f.call(p,m,Fe,{},w.signal));return ue===void 0?void 0:[H,ue]}catch{return}},se=Jt.filter(H=>H!==".gitmodules").map(H=>D(H,H));return te!==void 0&&se.push(D(".gitmodules",`${te.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(se).then(H=>{if(w.signal.aborted||g.current!==m)return;let Fe=new Map;for(let Se of H)Se!==void 0&&Fe.set(Se[0],Se[1]);let ue=y.current.get(""),Co=new Set(ue?.status==="ready"?ue.nodes.filter(Se=>Se.kind==="directory").map(Se=>Se.name):[]);re(en(Fe,Co))}),()=>w.abort()},[c,p,ce,te,G]),(0,x.useEffect)(()=>{let f=u.viewRequest;if(f==null||f.view!==X)return;let m=`${f.view}:${f.focus}`;_.current!==m&&(_.current=m,$e(f.focus,{open:we}),u.completeViewRequest?.())},[u.viewRequest,u.completeViewRequest,we]),(0,x.useEffect)(()=>{let f=e.viewFocus;if(f===void 0||c===void 0)return;let m=()=>{let w=f.take(X);w!==void 0&&$e(w,{open:we})};return m(),f.subscribe(m)},[e,c,we]),(0,x.useEffect)(()=>{if(Z===void 0||q!==void 0||!ce||an(Z))return;let f=nr(Z);if(f.length===0||(v(w=>f.every(D=>w.has(D))?w:new Set([...w,...f])),c===void 0||p===void 0))return;let m=f.filter(w=>y.current.get(w)?.status!=="ready");m.length!==0&&Promise.all(m.map(w=>K(w,c,p)))},[Z,q,ce,c,p,K]);let Mt=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let f=document.querySelector("[data-composer-input]");return f===null?!1:(f.focus(),!0)},[]),mo=(0,x.useCallback)(f=>{if(f.button!==0||he.current!==null||pa())return;let m=xe.current?.previousElementSibling;if(m instanceof HTMLElement){try{f.currentTarget.setPointerCapture(f.pointerId)}catch{return}he.current={pointerId:f.pointerId,startX:f.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:le},document.body.classList.add("fx-pane-resizing")}},[le]),go=(0,x.useCallback)(f=>{let m=he.current;m===null||m.pointerId!==f.pointerId||ge(Pt(m.baseWidth+f.clientX-m.startX))},[]),In=(0,x.useCallback)(f=>{let m=he.current;if(m===null||m.pointerId!==f.pointerId)return;he.current=null,document.body.classList.remove("fx-pane-resizing");try{f.currentTarget.releasePointerCapture(f.pointerId)}catch{}let w=m.baseWidth+f.clientX-m.startX;if(Xr(w,m.baseWidth)){ge(m.restWidth);return}ge(Pn(Q,w))},[Q]),Dn=(0,x.useCallback)(()=>{Ur(Q),ge(null)},[Q]),xo=(0,x.useCallback)(f=>{if(f.nativeEvent.isComposing)return;let m=Yr(f.key,f.altKey||f.ctrlKey||f.metaKey||f.shiftKey);if(m===null)return;if(f.preventDefault(),f.stopPropagation(),m.kind==="reset"){Dn();return}if(m.kind==="min"||m.kind==="max"){let se=m.kind==="min"?180:520;ge(Pn(Q,se));return}let w=xe.current?.previousElementSibling,D=w instanceof HTMLElement?w.getBoundingClientRect().width:le??180;ge(Pn(Q,D+m.delta))},[Q,Dn,le]);(0,x.useEffect)(()=>()=>{he.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let f=m=>{if(!(m.isComposing||mr(m.target))){if(ma(m)){let w=C.snapshot().active,D=w===null||d===void 0||c===void 0?void 0:d.find(c,w);if(D===void 0)return;m.preventDefault(),m.stopPropagation(),D.save();return}for(let w of mn)if(yr(m,w)){if(w.action==="closePanel"&&C.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),w.action==="nextPanel"?C.next():w.action==="previousPanel"?C.previous():ie();return}}};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[d,ie,c,C]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let f=gn({focusComposer:Mt,hasModal:()=>Ye.current!==null||tt(document)}),m=w=>f(w);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Mt]),(0,x.useEffect)(()=>{if(U===null||typeof document>"u")return;let f=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),ke())};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[U,ke]);let An=(0,x.useMemo)(()=>ln(L,R,B,Pe),[L,R,B,Pe]),[ho,It]=(0,x.useState)(void 0),Dt=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(Dt.current||typeof document>"u")return;let f=or({rows:An,panelCount:C.snapshot().panels.length,hasModal:tt(document)});f.kind!=="skip"&&(Dt.current=!0,f.open!==void 0&&C.open(f.open),It({path:f.focus}))},[An,C]);let vo=(0,x.useCallback)(()=>It(void 0),[]),je=B===void 0?void 0:Object.keys(B).length,bo=B===void 0?"neutral":Object.values(B).some(f=>f.status==="conflicted")?"conflict":je===0?"success":"warning",At=qt(M),wo=(0,x.useCallback)(f=>{if(c===void 0||p===void 0)return;if(R.has(f)){v(w=>{let D=new Set(w);return D.delete(f),D});return}v(w=>new Set(w).add(f));let m=L.get(f);(m===void 0||m.status==="failed")&&K(f,c,p)},[R,L,c,p,K]),jt=(0,x.useCallback)(f=>{c===void 0||p===void 0||K(f,c,p)},[c,p,K]),ko=()=>v(new Set),So=()=>z(f=>f+1),Ro=c===void 0?"no-session":p===void 0?"no-service":A===void 0||A.status==="loading"?"loading":A.status==="failed"?"failed":A.nodes.length===0?"empty":"tree";return(0,b.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":Ro,"data-session":c??"","data-testid":"fs-explorer-view",children:[(0,b.jsxs)("header",{className:"fx-head",children:[(0,b.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,b.jsx)(Tt,{open:!0})}),(0,b.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,b.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,b.jsxs)("div",{className:"fx-head-meta",children:[A?.status==="ready"?(0,b.jsxs)("span",{children:[(0,b.jsx)("b",{children:A.nodes.length})," ",t("head.entries")]}):null,(0,b.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:R.size===0,onClick:ko,children:(0,b.jsx)(ro,{})}),(0,b.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:c===void 0||p===void 0||A?.status==="loading",onClick:So,children:(0,b.jsx)(to,{})})]})]}),(0,b.jsx)("div",{className:"fx-main",children:c===void 0?(0,b.jsx)(Tn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):p===void 0?(0,b.jsx)(Tn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):A===void 0||A.status==="loading"?(0,b.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,b.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):A.status==="failed"?(0,b.jsx)(Tn,{title:t("state.failed.title"),description:A.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>jt(""),testId:"fs-failed"}):A.nodes.length===0?(0,b.jsx)(Tn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"fx-tree-pane",style:le===null?void 0:{"--fx-tree-width":`${le}px`},children:(0,b.jsx)(oo,{rows:An,selectedPath:q===void 0?Z:void 0,entryFocus:ho,t,onToggle:wo,onSelect:f=>C.open(f),onRetry:jt,onEntryFocusSettled:vo})}),(0,b.jsx)("div",{ref:xe,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":le??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:mo,onPointerMove:go,onPointerUp:In,onPointerCancel:In,onLostPointerCapture:In,onKeyDown:xo,onDoubleClick:Dn}),(0,b.jsxs)("div",{className:"fx-editor",children:[(0,b.jsx)(hr,{panels:$.panels,active:$.active,t,onActivate:f=>C.activate(f),onClose:ie,onStep:f=>f===1?C.next():C.previous(),documents:d,sessionId:c}),U===null?null:(0,b.jsx)(vr,{name:hn(U.path),t,saving:De,error:Ae,onSave:O,onDiscard:ae,onCancel:ke}),(0,b.jsx)("div",{className:"fx-editor-body",children:$.panels.length===0?(0,b.jsx)(br,{t}):$.panels.map((f,m)=>{let w=f.key===$.active;return(0,b.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!w,"data-line":f.line,"data-testid":"fs-panel",children:(0,b.jsx)(Kr,{sessionId:c,files:p,path:f.path,revision:f.revision,git:S,t,visible:w,renderers:a,documents:d})},f.key)})})]})]})}),A?.status==="ready"?(0,b.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,b.jsxs)("span",{children:[t("view.scope")," ",(0,b.jsx)("b",{children:A.nodes.length})," ",t("head.entries")]}),A.truncated?(0,b.jsx)("span",{className:"fx-foot-warn",children:Be({entries:A.nodes,truncated:!0,total:A.total}).label}):null,(0,b.jsxs)("span",{className:"fx-foot-git","data-state":je===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,b.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":bo,"aria-hidden":"true"}),je===void 0?t("status.unavailable"):je===0?t("status.clean"):t("status.summary").replace("{count}",String(je))]}),At===null?null:(0,b.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[At,M?.upstream!==void 0&&(M.ahead??0)>0?(0,b.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(M.ahead)}`}):null,M?.upstream!==void 0&&(M.behind??0)>0?(0,b.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(M.behind)}`}):null]}),(0,b.jsx)("span",{className:"fx-spacer"}),(0,b.jsx)("span",{children:t("foot.order")})]}):null]})}return s}var co=["slots","locale","workbench","remote"];function xa(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Fn,Nn,Nt,Ln,Lt,uo;function lo(e){return Lt=e,Ln!==void 0||(Ln=pr({open:(n,t,r)=>{let o=Lt;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ur(o)(n,t,r)},save:(n,t)=>{let r=Lt;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):fr(r)(n,t)}})),Ln}function ha(){if(Nt!==void 0)return Nt;let e=Sn({warn:n=>uo?.(n)});for(let n of Ct())e.register(n);return Nt=e,e}var Mn;function fo(e){let n=e.workbench;if(n==null)return()=>{};uo=u=>e.logger?.warn?.(u);let t=ha(),r={version:Fr,renderers:t,registerRenderer:u=>t.register(u),documents:lo(e)};Nn?.();let o=e.provide?.(gt,r);o===void 0&&e.logger?.warn?.(`${ze}: ctx.provide unavailable, ${gt} service not registered`),Nn=o,Fn?.();let i=e.locale.register(ze,{zh:{...Yn,...ot.zh,...St.zh},en:{...Zn,...ot.en,...St.en}});Fn=i;let a=e.locale.bind(ze),d=Vr(typeof document>"u"?void 0:document),l=so({workbench:n,version:n.version,t:a,files:Ar(e),status:_r(e),git:Or(e),renderers:t,documents:lo(e)});Mn?.();let s=Xn(e,n);return Mn=s,e.slots.inject(On,()=>e.slots.register({name:On,id:X,order:100,label:()=>Jn(xa(e)),locale:ze},l)),()=>{o?.(),Nn===o&&(Nn=void 0),s(),Mn===s&&(Mn=void 0),d(),i(),Fn===i&&(Fn=void 0)}}var po={buildTree:tn,describeListing:Be,iconFor:Ne,computeTreeWindow:rn,flattenTree:ln,badgeFor:Le,formatSize:cn,joinPath:sn,listingPath:on,parseFocus:dn,consumeViewRequest:$e,createPanelStack:rt,createEscapeHandler:gn,KEYMAP:mn,tabLabel:Jn,normalizeListing:Cn,normalizeStatusSnapshot:En,buildWorkspaceMap:en,workspaceTagFor:nn,parseStatusZ:Je,statusTone:_e,statusBadge:Qe,createPreviewLoader:bn,renderMarkdown:vn,languageFor:Ve,isMarkdownFile:Ge,describePage:wn,classifyPreviewFailure:qe,normalizePreviewPage:lt,previewChunkRoute:Pr,canBridgeFile:un,decideBridge:qn,focusForFileAddress:Gn,forwardFocus:Un,registerAddressBridge:Xn},yo={name:"dsh-fs-explorer",inject:co,apply:fo,__test:po};var va=yo;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
