window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var dn=Object.defineProperty;var xr=Object.getOwnPropertyDescriptor;var hr=Object.getOwnPropertyNames;var vr=Object.prototype.hasOwnProperty;var br=(e,n)=>{for(var t in n)dn(e,t,{get:n[t],enumerable:!0})},wr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of hr(n))!vr.call(e,o)&&o!==t&&dn(e,o,{get:()=>n[o],enumerable:!(r=xr(n,o))||r.enumerable});return e};var kr=e=>wr(dn({},"__esModule",{value:!0}),e);var Oo={};br(Oo,{__test:()=>or,apply:()=>rr,boot:()=>Ct,clientPlugin:()=>ir,default:()=>_o,inject:()=>tr});module.exports=kr(Oo);var fe=require("react");var Un="dsh-resource://file/";function Xn(e){try{return decodeURIComponent(e)}catch{return e}}function me(e){if(!e.startsWith(Un))return null;let n=e.slice(Un.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Xn(t.slice(0,r)),a=t.slice(r+1),d=a.search(/[?#]/u),u=d<0?a:a.slice(0,d);return u.length===0?null:{sessionId:o,path:u.split("/").map(Xn).join("/")}}function X(e){return e.slice(e.lastIndexOf("/")+1)}var Yn=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Zn(){return Yn.flatMap(e=>[...e.extensions])}function ln(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Yn.find(o=>o.extensions.includes(r))?.family??null}var H="dsh-fs-explorer",cn="conversation.view",_="fs-explorer";var Ce="fs-explorer",Jn="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",un={chunk:"client.preview.js"},Qn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Sr={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Rr={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Pr=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function nt(e){return typeof e=="string"&&Pr.has(e)}function et(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let a=e.indexOf(" ",r);if(a<0)return null;t.push(e.slice(r,a)),r=a+1}return{fields:t,rest:e.slice(r)}}function Tr(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function Fe(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let a=o[0];if(a==="?"){if(o[1]!==" ")continue;let d=o.slice(2);d!==""&&(n[d]={status:"untracked"});continue}if(a!=="!"){if(a==="1"||a==="2"){let d=et(o.slice(2),a==="1"?7:8);if(d===null)continue;let u=d.fields[0]??"",i=d.rest;if(i===""||u.length<2)continue;if(a==="2"){let c=t[r+1];if(c===void 0||c==="")continue;r+=1,n[i]={status:"renamed"};continue}n[i]={status:Tr(u[0]??".",u[1]??".")};continue}if(a==="u"){let d=et(o.slice(2),9);if(d===null)continue;let u=d.rest;if(u==="")continue;n[u]={status:"conflicted"}}}}return n}function ye(e){return nt(e)?Sr[e]:"neutral"}function Ne(e){return nt(e)?Rr[e]:"?"}function fn(e){return`status.${e}`}function tt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function rt(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function ot(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function it(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Er=["conflicted","deleted","renamed","added","modified","untracked"];function Cr(e){return ye(Er.find(n=>e.has(n))??"modified")}function at(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let a=r.replace(/\/+$/u,"");if(a==="")continue;let d=a.split("/"),u=r.endsWith("/")?d.length:d.length-1,i="";for(let c=0;c<u;c+=1){let s=d[c];if(s===void 0||s==="")continue;i=i===""?s:`${i}/${s}`;let p=n.get(i);p===void 0?n.set(i,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Cr(o.present)});return t}var lt=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],ct=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Fr(e){return ct.test(e)?e.slice(0,e.indexOf("/")):null}function Nr(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Mr(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let a=/^(\s*)-\s+(.*)$/u.exec(o);if(a===null)continue;let d=Nr(a[2]??"");d!==""&&ct.test(d)&&t.push(d)}return t}function Lr(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let a of e.split(/\r?\n/u)){let d=a.trim();if(d===""||d.startsWith("#")||d.startsWith(";"))continue;let u=/^\[(.+)\]$/u.exec(d);if(u!==null){o(),r=/^submodule(\s|$)/u.test(u[1]??"");continue}if(!r)continue;let i=/^path\s*=\s*(.*)$/u.exec(d);i!==null&&(t=(i[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function st(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function dt(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function Me(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let u of Lr(r))t.set(u,"submodule");let o=new Set,a=e.get("pnpm-workspace.yaml");if(typeof a=="string")for(let u of Mr(a))o.add(u);let d=e.get("package.json");if(typeof d=="string"){let u=st(d);if(u!==void 0){let i=u.workspaces,c=i!==null&&typeof i=="object"&&!Array.isArray(i)?i.packages:void 0;for(let s of dt(Array.isArray(i)?i:c))o.add(s)}}for(let u of["turbo.json","lerna.json"]){let i=e.get(u);if(typeof i!="string")continue;let c=st(i);if(c!==void 0)for(let s of dt(c.packages))o.add(s)}for(let u of o){let i=Fr(u);i!==null&&n.has(i)&&t.set(u,"package")}return t}function Le(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Ir=new Set(["node_modules",".git","dist","__pycache__"]);function Ar(e){return Ir.has(e)}function jr(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Ie(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Ar(r))continue;let o=jr(t),a=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(a===void 0?{name:r,kind:o}:{name:r,kind:o,size:a})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Dr=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Wr=new Set(["md","mdx","markdown","mdown","rst","adoc"]),zr=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),_r=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Or=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Br=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),$r=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function ft(e){let n=X(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function ce(e,n="file"){if(n==="directory")return"folder";let t=X(e.toLowerCase());if($r.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=ft(t);return r===""?"file":Dr.has(r)?"code":Wr.has(r)?"markdown":zr.has(r)?"data":_r.has(r)?"image":Or.has(r)?"style":Br.has(r)?"archive":"file"}var Kr={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Hr={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ue(e){let n=X(e.toLowerCase()),t=Kr[n];if(t!==void 0)return t;let r=ft(n),o=Hr[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function xe(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Jn} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Ae(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),a=Math.max(1,Math.ceil(r/t)),d=Math.max(0,e.length-a-o*2),u=Math.floor(Math.max(0,n.scrollTop)/t)-o,i=Math.min(Math.max(u,0),d),c=Math.min(e.length,i+a+o*2);return{rows:e.slice(i,c),startIndex:i,endIndex:c}}function pn(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function je(e){return e===""?".":e}function De(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function We(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function pt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=We(r,o),t.push(r);return t}function ut(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function ze(e){if(typeof e!="string")return;let n=e.trim(),t=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(t!==null){let d=(t[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:ut(t[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(r===null)return;let a=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:ut(r[2]),absolute:!1}}function _e(e,n,t,r){let o=[],a=at(t),d=(u,i)=>{let c=e.get(u);if(!(c===void 0||c.status!=="ready"))for(let s of c.nodes){let p=We(u,s.name),b=s.kind==="directory",S=b&&n.has(p),T=b||t===void 0?void 0:t[p],P=T?.status??(b?void 0:tt(p,t)),E=T===void 0?void 0:rt(T),F=b?a.get(p):void 0,B=b?Le(r,p):void 0;if(o.push({type:"entry",path:p,name:s.name,kind:s.kind,depth:i,expanded:S,...s.size===void 0?{}:{size:s.size},...P===void 0?{}:{status:P},...F===void 0?{}:{statusCount:F.count,statusTone:F.tone},...E===void 0?{}:{diff:E},...B===void 0?{}:{tag:B}}),!S)continue;let D=e.get(p);if(D===void 0||D.status==="loading"){o.push({type:"status",key:`${p}:loading`,path:p,depth:i+1,state:"loading"});continue}if(D.status==="failed"){o.push({type:"status",key:`${p}:failed`,path:p,depth:i+1,state:"failed",message:D.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(D.nodes.length===0){o.push({type:"status",key:`${p}:empty`,path:p,depth:i+1,state:"empty"});continue}d(p,i+1),D.truncated&&o.push({type:"status",key:`${p}:truncated`,path:p,depth:i+1,state:"truncated",label:xe({entries:D.nodes,truncated:!0,total:D.total}).label})}};return d("",0),o}var Vr=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Gr(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function qr(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Vr.has(Gr(n.path)))}function gt(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=qr(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Oe(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var gn="dsh-fs-explorer:bridge",Ur="fs-explorer-bridge",ht="dsh-resource://file/**",mn="sidebar.right.pane.tab",Xr=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Yr=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Zr=new Set(["makefile","dockerfile","license","readme","changelog"]),Jr=new Set([...Zn(),...Xr]);function Qr(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function Be(e){if(typeof e!="string"||e==="")return!1;let n=X(e).toLowerCase();if(n==="")return!1;let t=Qr(n);return Yr.has(t)?!1:Zr.has(n)?!0:Jr.has(t)}function eo(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function no(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function hn(e,n){if(typeof e!="string")return;let t=me(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=no(n,eo(e));return`${De(r)?"abs:":"path:"}${r}:${String(o)}`}function vn(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=me(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Be(r.path))return{action:"keep",reason:"refused"};let o=hn(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Y(e,n){n===void 0?console.warn(`[${H}] ${e}`):console.warn(`[${H}] ${e}`,n)}function to(e){console.debug(`[${H}] ${e}`)}function yn(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function xn(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ie(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function mt(e){return ie(()=>e.sidebarRightTabs,yn)??ie(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,yn)}function yt(e){return ie(()=>e.sidebarRight,xn)??ie(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,xn)}function xt(e){return typeof e=="function"?e:()=>{}}var ro="dsh-resource://file/session/probe/src/main.ts";function oo(e){let n=ie(()=>(typeof e.candidates=="function"?e.candidates(ro):[]).filter(r=>r.priority==="extension"&&r.id!==gn),t=>Array.isArray(t)&&t.length>0);n!==void 0&&Y(`another extension-band tab type already claims ${ht}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function io(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function ao(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function so(e,n){let t=e.viewFocus;if(t?.request?.(_,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(_,n);return(!r.opened||r.focused)&&t?.take(_),r}return typeof e.openView=="function"&&e.openView(_,n)?(t?.take(_),{opened:!0,focused:!0}):(t?.take(_),{opened:!1,focused:!1})}function bn(e,n,t,r){let o;try{o=so(e,r)}catch(a){return Y("the file workbench threw while switching views",a),e.viewFocus?.take(_),!1}if(!o.opened)return Y(`the file workbench did not switch to ${_}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(a){return Y("the forwarded tab could not be closed",a),!1}}function lo(e,n){function t({useTabInfo:r}){let a=r()?.tab,d=typeof a?.id=="string"&&a.id!==""?a.id:void 0,u=io(a),i=ao(a),c=(0,fe.useRef)(void 0);return(0,fe.useEffect)(()=>{if(d===void 0){Y("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(c.current===d)return;c.current=d;let s=vn(u,e.currentSessionId(),i);if(s.action!=="open"){Y(`left the forwarded tab standing (${s.reason})`,u);return}bn(e,n,d,s.focus)},[d,u,i]),null}return function(o){return typeof o.useTabInfo!="function"?(Y(`the host did not inject useTabInfo into ${mn}; the bridge cannot forward`),null):(0,fe.createElement)(t,{useTabInfo:o.useTabInfo})}}function wn(e,n){let t=(u,i)=>{if(u===void 0||i===void 0)return;oo(u);let c;try{c=u.register({id:gn,kind:Ur,patterns:[ht],priority:"extension",canOpen:b=>{let S=me(b);return S!==null&&Be(S.path)},title:b=>X(me(b)?.path??b)||b})}catch(b){Y("the sidebar right refused the address bridge tab type",b);return}let s=lo(n,i),p;try{p=xt(e.slots.inject(mn,()=>e.slots.register({name:mn,key:gn},s)))}catch(b){c(),Y("the sidebar right refused the address bridge body",b);return}return()=>{p(),c()}},r=mt(e),o=yt(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let a=e.inject;if(typeof a!="function")return to("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let d=a.call(e,["sidebarRightTabs","sidebarRight"],u=>{let i=ie(()=>u.get?.("sidebarRightTabs"),yn)??mt(u),c=ie(()=>u.get?.("sidebarRight"),xn)??yt(u);return t(i,c)});return xt(d)}var kn={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},Sn={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function Rn(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?kn:Sn)["tab.label"]??"Files"}var $e=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function co(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function vt(e,n,t=co()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",a=r.includes("control")||r.includes("primary")&&t!=="mac",d=r.includes("alt"),u=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===a&&e.altKey===!0===d&&e.shiftKey===!0===u}function bt(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function uo(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Pn(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Ke(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&uo(n),e.onClose?.()}}function wt(e){let n=X(e);return n===""?e:n}function Tn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var fo=Object.freeze({panels:Object.freeze([]),active:null});function En(){let e=[],n=null,t=fo,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let i of[...r])i()},a=i=>e.findIndex(c=>c.path===i),d=i=>{let c=Tn(i,!0);if(c===void 0)return;if(a(c)>=0)return c;let s=Tn(i,!1);if(!(s===void 0||s===c))return a(s)>=0?s:void 0},u=i=>{if(e.length===0)return;let c=n===null?-1:a(n),s=e[(c+i+e.length)%e.length];s===void 0||s.path===n||(n=s.path,o())};return{open(i,c=1,s=!1){let p=Tn(i,s);if(p===void 0)return;let b=Number.isFinite(c)&&c>0?Math.trunc(c):1,S=a(p);if(S>=0){let P=e[S],E=P!==void 0&&(P.line!==b||P.absolute!==s);if(E&&(e=e.map((F,B)=>B===S?{path:p,line:b,absolute:s}:F)),n===p){E&&o();return}n=p,o();return}let T=n===null?e.length:a(n)+1;e=[...e.slice(0,T),{path:p,line:b,absolute:s},...e.slice(T)],n=p,o()},close(i){let c=i===void 0?n:d(i)??null;if(c===null)return;let s=a(c);s<0||(e=e.filter(p=>p.path!==c),n===c&&(n=(e[s]??e[s-1])?.path??null),o())},activate(i){let c=d(i);c===void 0||a(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(i){let c=d(i);return c!==void 0&&a(c)>=0},activeEntry(){return e.find(i=>i.path===n)},snapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function kt(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=En();return e.set(t,o),o}}}function he(e,n){let t=ze(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute),!0)}var St=require("react");function z(e,n,...t){let r=t.filter(d=>d!=null&&d!==!1),o=(0,St.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let a={...n??{}};return r.length===1?a.children=r[0]:r.length>1&&(a.children=r),{type:e,props:a,key:null}}function po(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var go=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function ae(e){let n=[],t=0;for(let r of e.matchAll(go)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let a=r[0];if(a.startsWith("`"))n.push(z("code",null,a.slice(1,-1)));else if(a.startsWith("**")||a.startsWith("__"))n.push(z("strong",null,...ae(a.slice(2,-2))));else if(a.startsWith("~~"))n.push(z("del",null,...ae(a.slice(2,-2))));else if(a.startsWith("*")||a.startsWith("_"))n.push(z("em",null,...ae(a.slice(1,-1))));else{let d=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(a),u=d?.[1]??a,i=d===null?void 0:po(d[2]??"");n.push(i===void 0?u:z("a",{href:i,rel:"noreferrer noopener"},u))}t=o+a.length}return t<e.length&&n.push(e.slice(t)),n}var Rt=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Pt=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Tt=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Cn=/^\s{0,3}>\s?(.*)$/u,Fn=/^\s{0,3}[-*+]\s+(.*)$/u,Nn=/^\s{0,3}\d+[.)]\s+(.*)$/u;function mo(e){return Rt.test(e)||Pt.test(e)||Tt.test(e)||Cn.test(e)||Fn.test(e)||Nn.test(e)}function Et(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Rt.exec(r);if(o!==null){let c=(o[1]??"```").slice(0,1),s=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${c}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(z("pre",null,z("code",s===""?null:{className:`language-${s}`},p.join(`
`))));continue}let a=Pt.exec(r);if(a!==null){let c=(a[1]??"#").length;n.push(z(`h${String(c)}`,null,...ae(a[2]??""))),t+=1;continue}if(Tt.test(r)){n.push(z("hr",null)),t+=1;continue}if(Cn.test(r)){let c=[];for(;t<e.length;){let s=Cn.exec(e[t]??"");if(s===null)break;c.push(s[1]??""),t+=1}n.push(z("blockquote",null,...Et(c)));continue}if(Fn.exec(r)!==null){let c=[];for(;t<e.length;){let s=Fn.exec(e[t]??"");if(s===null)break;c.push(z("li",null,...ae(s[1]??""))),t+=1}n.push(z("ul",null,...c));continue}if(Nn.exec(r)!==null){let c=[];for(;t<e.length;){let s=Nn.exec(e[t]??"");if(s===null)break;c.push(z("li",null,...ae(s[1]??""))),t+=1}n.push(z("ol",null,...c));continue}let i=[r.trim()];for(t+=1;t<e.length;){let c=e[t]??"";if(c.trim()===""||mo(c))break;i.push(c.trim()),t+=1}n.push(z("p",null,...ae(i.join(" "))))}return n}function He(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return z("div",{className:"fx-md"},...Et(n))}var Mn=200,yo={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function we(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":yo[t.slice(r+1)]??"plaintext"}function Ve(e){return we(e)==="markdown"}var se=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function ve(e){return e!==null&&typeof e=="object"}function xo(e){return e===""?0:e.split(`
`).length}function Ln(e,n){if(!ve(e))throw new se("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=ve(e.error)?e.error:{},i=typeof u.code=="string"?u.code:"preview/unknown",c=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=ve(u.details)?u.details:{},p=typeof s.kind=="string"?s.kind:"";throw new se(i,c,p)}let t=e.ok===!0?e.value:e;if(!ve(t)||typeof t.text!="string")throw new se("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):xo(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,a=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,d=t.eof===!0||o!==void 0&&r>0&&a+r-1>=o;return o===void 0?{text:t.text,lines:r,offset:a,eof:d}:{text:t.text,lines:r,offset:a,totalLines:o,eof:d}}function ke(e){let n=ve(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",a=`${t} ${r} ${o}`.toLowerCase();return a.includes("symlink")?{kind:"symlink",code:t,message:o}:a.includes("eacces")||a.includes("eperm")||a.includes("permission")||a.includes("denied")||a.includes("forbidden")||a.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:a.includes("not-found")||a.includes("not_found")||a.includes("enoent")||a.includes("no such file")||a.includes("deleted")||a.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:a.includes("not-regular-file")||a.includes("not a regular file")?{kind:"binary",code:t,message:o}:a.includes("not-text")||a.includes("utf-8")||a.includes("binary")?{kind:"binary",code:t,message:o}:a.includes("too-large")||a.includes("too large")||a.includes("maxbytes")?{kind:"too-large",code:t,message:o}:a.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var be=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Ge({files:e,maxLines:n=Mn}){let t=Math.max(1,Math.trunc(n)),r=be,o=0,a=null,d=[1],u=new Set,i=s=>{r=s;for(let p of u)p()},c=async(s,p)=>{o+=1;let b=o;a?.abort();let S=new AbortController;a=S,i({status:"loading",path:s,text:r.path===s?r.text:"",offset:p,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let T=await e.read(s,p>1?{offset:p,limit:t}:{limit:t},S.signal);if(b!==o)return;let P=Ln(T,p);if(P.lines===0&&p>1){i({...r,status:"ready",eof:!0,text:"",lines:0});return}i(P.totalLines===void 0?{status:"ready",path:s,text:P.text,offset:P.offset,lines:P.lines,eof:P.eof}:{status:"ready",path:s,text:P.text,offset:P.offset,lines:P.lines,totalLines:P.totalLines,eof:P.eof})}catch(T){if(b!==o||S.signal.aborted)return;i({status:"failed",path:s,text:"",offset:p,lines:0,eof:!1,failure:ke(T)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(s){return u.add(s),()=>{u.delete(s)}},async open(s){d=[1],await c(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(d.push(s),await c(r.path,s))},async prev(){if(r.path===void 0||d.length<=1)return;d=d.slice(0,-1);let s=d[d.length-1]??1;await c(r.path,s)},async retry(){r.path!==void 0&&await c(r.path,r.offset)},close(){o+=1,a?.abort(),a=null,d=[1],i(be)}}}function qe(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var In=Object.freeze({chunk:un.chunk,id:`${H}/${un.chunk}`}),An=null,Se=null,Ue=new Map;function Ct(e){An=e}function Ft(){return In}function ho(e){let n=Qn[e];return{chunk:n,id:`${H}/${n}`}}function Nt(){if(Se!==null)return Se;let e=An;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${H}: the loader require was not handed over`));let n=e.async(`./${In.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${H}: chunk ${In.id} is missing its preview renderers`);return r});return Se=n,n.catch(()=>{Se===n&&(Se=null)}),n}function Mt(e){let n=Ue.get(e);if(n!==void 0)return n;let t=An;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${H}: the loader require was not handed over`));let r=ho(e),o=t.async(`./${r.chunk}`).then(a=>{let d=a;if(d===null||typeof d.FamilyView!="function"||d.renderer!==e)throw new Error(`${H}: chunk ${r.id} is not the ${e} view`);return d});return Ue.set(e,o),o.catch(()=>{Ue.get(e)===o&&Ue.delete(e)}),o}var Lt="dsh-fs-explorer-styles",vo=`
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
`;function It(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Lt}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Lt,t.textContent=vo,e.head.appendChild(t),()=>{t.remove()}}var y=require("react");var jn="fs-explorer.treePaneWidth";function Dn(e){return Math.min(520,Math.max(180,e))}function jt(e){if(e==null)return null;let n;try{n=e.getItem(jn)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Xe(e,n){let t=Math.round(Dn(n));if(e!=null)try{e.setItem(jn,String(t))}catch{}return t}function Dt(e){if(e!=null)try{e.removeItem(jn)}catch{}}function Wt(e,n){return Math.round(e)===Math.round(n)}var At=16;function zt(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-At};case"ArrowRight":return{kind:"nudge",delta:At};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Ye=require("react");var L=require("react/jsx-runtime");function _t({panels:e,active:n,t,onActivate:r,onClose:o,onStep:a}){let d=(0,Ye.useRef)(null);if((0,Ye.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]),e.length===0)return null;let u=i=>{if(i.key==="ArrowRight"||i.key==="ArrowLeft"){i.preventDefault(),i.stopPropagation(),a(i.key==="ArrowRight"?1:-1);return}(i.key==="Delete"||i.key==="Backspace")&&n!==null&&(i.preventDefault(),i.stopPropagation(),o(n))};return(0,L.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:u,"data-testid":"fs-tabs",children:e.map((i,c)=>{let s=i.path===n,p=wt(i.path),b=t("panel.close").replace("{name}",p);return(0,L.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,L.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${c}`,"aria-controls":`fx-panel-${c}`,"aria-selected":s,tabIndex:s?0:-1,title:i.path,"data-testid":"fs-tab","data-path":i.path,ref:s?d:void 0,onClick:()=>r(i.path),children:[(0,L.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":ce(i.path),"aria-hidden":"true",children:ue(i.path)}),(0,L.jsx)("span",{className:"fx-tab-name",children:p})]}),(0,L.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":b,title:b,"data-testid":"fs-tab-close",onClick:()=>o(i.path),children:"\xD7"})]},i.path)})})}function bo(){return(0,L.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,L.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,L.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,L.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Ot({t:e}){return(0,L.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,L.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,L.jsx)(bo,{})}),(0,L.jsx)("strong",{children:e("panel.empty.title")}),(0,L.jsx)("span",{children:e("panel.empty.description")}),(0,L.jsxs)("span",{className:"fx-empty-keys",children:[(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,L.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,L.jsx)("span",{children:e("panel.empty.keys")})]})]})}var C=require("react");async function Bt(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Z=require("react/jsx-runtime");function wo(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function ko(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Wn({failure:e,t:n,onRetry:t}){return(0,Z.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Z.jsx)("strong",{children:wo(e,n)}),(0,Z.jsx)("span",{children:ko(e,n)}),e.message===""?null:(0,Z.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Z.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function zn({t:e}){return(0,Z.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Z.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}function Ze(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function pe(e){try{return e()}catch{return}}function Ht(e){return()=>{let n=pe(()=>e.workspaceFiles);if(Ze(n))return n;let t=pe(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Ze(t))return t;let r=pe(()=>e.remote?.workspaceFiles);if(Ze(r))return r;let o=pe(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Ze(o))return o}}function Vt(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,a){return t.call(e,n,r,o,a)}}}function Je(e){return e!==null&&typeof e=="object"}function So(e){if(!Je(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Je(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Ro(e){let n=Je(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Je(n.details)?n.details:{},a=typeof o.kind=="string"?o.kind:"";return new se(t,r,a)}function Gt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let a=So(await n.call(e,t,r,{},o));if(!a.ok)throw Ro(a.error);return a.value.data}}function Re(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function _n(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Qe(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Re(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?_n(r.value):{ok:!1,message:Re(r.error)}}return _n(t)}return _n(n)}function qt(e){return e instanceof Error?e.message:Re(e)}function $t(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function Ut(e){return()=>{let n=pe(()=>e.remote?.gitExplorer);if($t(n))return n;let t=pe(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if($t(t))return t}}function Kt(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Po(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Kt(r.additions),a=Kt(r.deletions);o===void 0||a===void 0||n.push({path:r.path,additions:o,deletions:a})}return n}function To(e){if(e===null||typeof e!="object")return;let n=e,t=d=>typeof d=="number"&&Number.isFinite(d)&&d>=0?d:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),a=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...a===void 0?{}:{behind:a}}}function On(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Po(n.stats),r=To(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function en(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Re(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?On(o.snapshot):{ok:!1,message:Re(o.error)}}let r=e;return r.snapshot!==void 0?On(r.snapshot):On(t)}var k=require("react/jsx-runtime");function Eo({chunk:e,text:n,path:t,offset:r}){let o=(0,C.useRef)(null),a=(0,C.useRef)(null),[d,u]=(0,C.useState)(!1),i=we(t);return(0,C.useEffect)(()=>{u(!1)},[e,t]),(0,C.useEffect)(()=>{let c=o.current;if(!(e===null||c===null))try{let s=e.mountCodePreview(c,{text:n,language:i,path:t,offset:r});return a.current=s,()=>{s.destroy(),a.current=null}}catch{u(!0);return}},[e,t,i]),(0,C.useEffect)(()=>{a.current?.update(n,r)},[n,r,e]),e===null||d?(0,k.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,k.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Xt({sessionId:e,files:n,path:t,t:r,visible:o=!0}){let a=(0,C.useMemo)(()=>Vt(n,e),[n,e]),d=(0,C.useMemo)(()=>Gt(n),[n]),u=t===void 0?null:ln(t),[i,c]=(0,C.useState)(null),[s,p]=(0,C.useState)(be),[b,S]=(0,C.useState)(null),[T,P]=(0,C.useState)(null),[E,F]=(0,C.useState)(null),[B,D]=(0,C.useState)(0),[te,G]=(0,C.useState)("reading"),[f,R]=(0,C.useState)(!1),x=(0,C.useRef)(void 0);if((0,C.useEffect)(()=>{if(a===void 0){c(null);return}let M=Ge({files:a,maxLines:Mn});return c(M),()=>M.close()},[a]),(0,C.useEffect)(()=>{if(i===null){p(be);return}return p(i.getSnapshot()),i.subscribe(()=>p(i.getSnapshot()))},[i]),(0,C.useEffect)(()=>{i===null||t===void 0||u!==null||i.open(t)},[i,t,u]),(0,C.useEffect)(()=>{G("reading"),R(!1)},[t]),(0,C.useEffect)(()=>()=>{x.current!==void 0&&clearTimeout(x.current)},[]),(0,C.useEffect)(()=>{if(t===void 0||u!==null)return;let M=!0;return Nt().then(N=>{M&&S(N)}).catch(()=>{M&&S(null)}),()=>{M=!1}},[t,u]),(0,C.useEffect)(()=>{if(u===null)return;let M=!0;return P(null),F(null),Mt(u).then(N=>{M&&P(N)}).catch(N=>{M&&F(ke(N))}),()=>{M=!1}},[u,B]),t===void 0)return(0,k.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,k.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,k.jsx)("strong",{children:r("preview.empty.title")}),(0,k.jsx)("span",{children:r("preview.empty.description")})]})});let h=u!==null,I=e!==void 0&&d!==void 0?{sessionId:e,readFile:d}:null,J=h&&I===null,Q=qe(s),Pe=!h&&Ve(t),$=h?!J&&T===null&&E===null:s.status==="loading",re=s.status==="ready",O=Pe&&te==="reading",q=h?J?"unavailable":E!==null?"failed":T===null?"loading":"ready":s.status,ee=()=>{Bt(t).then(M=>{M&&(R(!0),x.current!==void 0&&clearTimeout(x.current),x.current=setTimeout(()=>R(!1),1400))})},K;return h?K=I===null?(0,k.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,k.jsx)("strong",{children:r("preview.unavailable.title")}),(0,k.jsx)("span",{children:r("preview.unavailable.description")})]}):E!==null?(0,k.jsx)(Wn,{failure:E,t:r,onRetry:()=>D(M=>M+1)}):T===null?(0,k.jsx)(zn,{t:r}):(0,k.jsx)(T.FamilyView,{path:t,sessionId:I.sessionId,readFile:I.readFile,t:r,visible:o}):a===void 0?K=(0,k.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,k.jsx)("strong",{children:r("preview.unavailable.title")}),(0,k.jsx)("span",{children:r("preview.unavailable.description")})]}):s.status==="failed"?K=(0,k.jsx)(Wn,{failure:s.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{i?.retry()}}):re?O?K=b===null?(0,k.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:He(s.text)}):(0,k.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,k.jsx)(b.MarkdownView,{text:s.text})}):K=(0,k.jsx)(Eo,{chunk:b,text:s.text,path:t,offset:s.offset}):K=(0,k.jsx)(zn,{t:r}),(0,k.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":q,"data-mode":h?"binary":O?"reading":"code","data-renderer":h?T?.renderer??"pending":O?b===null?"fallback":"gfm":b?.renderer??"plain",children:[(0,k.jsxs)("header",{className:"fx-preview-bar",children:[(0,k.jsx)("span",{className:"fx-preview-path",title:t,"data-testid":"fs-preview-path",children:t}),h?null:(0,k.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[Q.range,Q.range==="\u2014"?null:(0,k.jsxs)(k.Fragment,{children:[" ",r("preview.lines")]}),Q.total===void 0?null:(0,k.jsxs)("span",{className:"fx-preview-total",children:[" / ",Q.total," ",r("preview.lines")]})]}),(0,k.jsxs)("div",{className:"fx-preview-actions",children:[Pe?(0,k.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>G(M=>M==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(te==="reading"?"preview.source":"preview.reading")}):null,h?null:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!re||$||s.offset<=1,onClick:()=>{i?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,k.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!re||$||s.eof,onClick:()=>{i?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,k.jsx)("button",{type:"button",className:"fx-pbtn",onClick:ee,"data-testid":"fs-preview-copy",children:r(f?"preview.copied":"preview.copyPath")}),$?(0,k.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,k.jsx)("div",{className:"fx-preview-body","data-scroll":O?"y":"none",children:K})]})}var j=require("react");var v=require("react/jsx-runtime"),de=22;function Bn({open:e=!0,size:n=14}){return(0,v.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,v.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,v.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function Co(){return(0,v.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,v.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Yt(){return(0,v.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,v.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,v.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Zt(){return(0,v.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,v.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Fo({name:e}){return(0,v.jsx)("span",{className:"fx-badge","data-icon":ce(e),"aria-hidden":"true",children:ue(e)})}function No({row:e,selected:n,cursor:t,top:r,t:o,onToggle:a,onSelect:d,onRowActivate:u}){let i=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,v.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...i?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":i?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:c,onClick:()=>{u(e.path),i?a(e.path):d(e.path)},children:[(0,v.jsx)("span",{className:"fx-chevron","data-open":i&&e.expanded?"true":"false","data-visible":i?"true":"false","aria-hidden":"true",children:(0,v.jsx)(Co,{})}),i?(0,v.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,v.jsx)(Bn,{open:e.expanded})}):(0,v.jsx)(Fo,{name:e.name}),(0,v.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,v.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,v.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":ye(e.status),"data-testid":"fx-file-status",title:o(fn(e.status)),"aria-label":o(fn(e.status)),children:Ne(e.status)}),e.statusCount===void 0?null:(0,v.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,v.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,v.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,v.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,v.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,v.jsx)("span",{className:"fx-size",children:Oe(e.size)})]})}function Mo({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,v.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,v.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,v.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,v.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Lo(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Jt({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:a,onRetry:d,onEntryFocusSettled:u}){let i=(0,j.useRef)(null),[c,s]=(0,j.useState)(0),[p,b]=(0,j.useState)(0),[S,T]=(0,j.useState)(void 0),P=(0,j.useRef)(void 0),E=(0,j.useMemo)(()=>e.flatMap((f,R)=>f.type==="entry"?[R]:[]),[e]);(0,j.useEffect)(()=>{if(n===void 0)return;let f=e.findIndex(R=>R.type==="entry"&&R.path===n);f>=0&&T(f)},[n,e]),(0,j.useEffect)(()=>{S!==void 0&&e[S]?.type!=="entry"&&T(void 0)},[e,S]),(0,j.useEffect)(()=>{let f=i.current;if(S===void 0||f===null)return;let R=pn({scrollTop:f.scrollTop,viewport:f.clientHeight,rowHeight:de,index:S});R!==f.scrollTop&&(f.scrollTop=R)},[S]);let F=(0,j.useCallback)(f=>{T(f),i.current?.focus({preventScroll:!0})},[]),B=(0,j.useCallback)(f=>{let R=e.findIndex(x=>x.type==="entry"&&x.path===f);R>=0&&T(R)},[e]),D=(0,j.useCallback)(f=>{if(f.nativeEvent.isComposing||f.altKey||f.metaKey||f.ctrlKey)return;let R=E.at(-1);if(f.key==="ArrowDown"){if(f.preventDefault(),S===void 0){E[0]!==void 0&&F(E[0]);return}let h=E.find(I=>I>S);h!==void 0&&F(h);return}if(f.key==="ArrowUp"){if(f.preventDefault(),S===void 0){R!==void 0&&F(R);return}let h=[...E].reverse().find(I=>I<S);h!==void 0&&F(h);return}if(S===void 0)return;let x=e[S];if(!(x===void 0||x.type!=="entry")){if(f.key==="ArrowRight"){if(f.preventDefault(),x.kind==="directory"&&!x.expanded)o(x.path);else{let h=E.find(I=>I>S);h!==void 0&&e[h]?.depth===x.depth+1&&F(h)}return}if(f.key==="ArrowLeft"){if(f.preventDefault(),x.kind==="directory"&&x.expanded)o(x.path);else{let h=[...E].reverse().find(I=>I<S&&e[I]?.type==="entry"&&e[I].depth<x.depth);h!==void 0&&F(h)}return}if(f.key==="Enter"&&x.kind!=="directory"){f.preventDefault(),a(x.path);return}if(f.key==="Home"){f.preventDefault(),E[0]!==void 0&&F(E[0]);return}f.key==="End"&&(f.preventDefault(),R!==void 0&&F(R))}},[S,E,F,o,a,e]);(0,j.useEffect)(()=>{let f=i.current;if(f===null)return;let R=()=>b(f.clientHeight);if(R(),typeof ResizeObserver>"u")return;let x=new ResizeObserver(R);return x.observe(f),()=>x.disconnect()},[]),(0,j.useEffect)(()=>{if(n===void 0)return;let f=i.current;if(f===null)return;let R=e.findIndex(h=>h.type==="entry"&&h.path===n);if(R<0)return;let x=R*de;(x<f.scrollTop||x+de>f.scrollTop+f.clientHeight)&&(f.scrollTop=Math.max(0,x-f.clientHeight/2))},[n,e]),(0,j.useEffect)(()=>{if(t===void 0||P.current===t)return;let f=i.current;if(f===null)return;let R=t.path===void 0?-1:e.findIndex(x=>x.type==="entry"&&x.path===t.path);if(!(t.path!==void 0&&R<0)){if(P.current=t,R>=0){let x=pn({scrollTop:f.scrollTop,viewport:f.clientHeight===0?480:f.clientHeight,rowHeight:de,index:R});x!==f.scrollTop&&(f.scrollTop=x,s(x)),T(R)}Lo(f),u?.()}},[t,e,u]);let te=f=>{s(f.currentTarget.scrollTop)},G=Ae(e,{scrollTop:c,height:p===0?480:p,rowHeight:de});return(0,v.jsx)("div",{className:"fx-scroll",ref:i,onScroll:te,onKeyDown:D,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,v.jsx)("div",{className:"fx-vlist",style:{height:e.length*de},children:G.rows.map((f,R)=>{let x=(G.startIndex+R)*de;return f.type==="entry"?(0,v.jsx)(No,{row:f,top:x,selected:f.path===n,cursor:S===G.startIndex+R,t:r,onToggle:o,onSelect:a,onRowActivate:B},f.path):(0,v.jsx)(Mo,{row:f,top:x,t:r,onRetry:d},f.key)})})})}var m=require("react/jsx-runtime");var Io=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ao(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var jo=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,er=new Map;function Do(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function nn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,m.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,m.jsx)("strong",{children:e}),n===void 0?null:(0,m.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,m.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function nr({workbench:e,version:n,t,files:r,status:o}){let a=kt();function d(u){let i=u.sessionId??e.currentSessionId(),c=(0,y.useRef)(i);c.current=i;let s=(0,y.useMemo)(()=>r(),[r]),p=(0,y.useMemo)(()=>o(),[o]),[b,S]=(0,y.useState)(()=>new Map),[T,P]=(0,y.useState)(void 0),[E,F]=(0,y.useState)(void 0),[B,D]=(0,y.useState)(void 0),[te,G]=(0,y.useState)(er),f=(0,y.useRef)(b);f.current=b;let[R,x]=(0,y.useState)(()=>new Set),h=(0,y.useMemo)(()=>a.forSession(i),[a,i]),I=(0,y.useSyncExternalStore)(h.subscribe,h.snapshot,h.snapshot),J=I.active??void 0,[Q,Pe]=(0,y.useState)(0),$=(0,y.useRef)(new Map),re=(0,y.useRef)(void 0),O=(0,y.useMemo)(()=>Ao(),[]),[q,ee]=(0,y.useState)(()=>jt(O)),K=(0,y.useRef)(null),M=(0,y.useRef)(null),N=b.get(""),Te=N?.status==="ready",Ee=(0,y.useCallback)((l,g,w)=>{h.open(l,g,w)},[h]),ne=(0,y.useCallback)(async(l,g,w)=>{$.current.get(l)?.abort();let A=new AbortController;$.current.set(l,A),S(V=>new Map(V).set(l,Io()));try{let V=await w.list(g,je(l),A.signal);if(A.signal.aborted||c.current!==g)return!1;let W=Qe(V);if(!W.ok)return S(U=>new Map(U).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:W.message})),!1;let le=Ie(W.listing.entries);return S(U=>new Map(U).set(l,{status:"ready",nodes:le,truncated:W.listing.truncated===!0,total:W.listing.entries.length})),!0}catch(V){return A.signal.aborted||S(W=>new Map(W).set(l,{status:"failed",nodes:[],truncated:!1,total:0,message:qt(V)})),!1}finally{$.current.get(l)===A&&$.current.delete(l)}},[]);(0,y.useEffect)(()=>{for(let l of $.current.values())l.abort();return $.current.clear(),S(new Map),x(new Set),re.current=void 0,i!==void 0&&s!==void 0&&ne("",i,s),()=>{for(let l of $.current.values())l.abort();$.current.clear()}},[i,s,Q,ne]),(0,y.useEffect)(()=>{if(i===void 0||p===void 0){P(void 0),F(void 0),D(void 0);return}let l=!0,g=new AbortController;return P(void 0),F(void 0),D(void 0),Promise.resolve().then(()=>p.snapshot({sessionId:i,maxCommits:1},g.signal)).then(w=>{if(!l)return;let A=en(w);if(!A.ok){P(void 0),F(void 0),D(void 0);return}P(it(Fe(A.status),A.stats)),F(A.head),D(A.root)}).catch(()=>{l&&(P(void 0),F(void 0),D(void 0))}),()=>{l=!1,g.abort()}},[i,p,Q]),(0,y.useEffect)(()=>{let l=s?.read;if(i===void 0||s===void 0||typeof l!="function"||!Te){G(er);return}let g=i,w=new AbortController,A=async(W,le)=>{try{let U=Do(await l.call(s,g,le,{},w.signal));return U===void 0?void 0:[W,U]}catch{return}},V=lt.filter(W=>W!==".gitmodules").map(W=>A(W,W));return B!==void 0&&V.push(A(".gitmodules",`${B.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(V).then(W=>{if(w.signal.aborted||c.current!==g)return;let le=new Map;for(let oe of W)oe!==void 0&&le.set(oe[0],oe[1]);let U=f.current.get(""),yr=new Set(U?.status==="ready"?U.nodes.filter(oe=>oe.kind==="directory").map(oe=>oe.name):[]);G(Me(le,yr))}),()=>w.abort()},[i,s,Te,B,Q]),(0,y.useEffect)(()=>{let l=u.viewRequest;if(l==null||l.view!==_)return;let g=`${l.view}:${l.focus}`;re.current!==g&&(re.current=g,he(l.focus,{open:Ee}),u.completeViewRequest?.())},[u.viewRequest,u.completeViewRequest,Ee]),(0,y.useEffect)(()=>{let l=e.viewFocus;if(l===void 0||i===void 0)return;let g=()=>{let w=l.take(_);w!==void 0&&he(w,{open:Ee})};return g(),l.subscribe(g)},[e,i,Ee]),(0,y.useEffect)(()=>{if(J===void 0||!Te||De(J))return;let l=pt(J);if(l.length===0||(x(w=>l.every(A=>w.has(A))?w:new Set([...w,...l])),i===void 0||s===void 0))return;let g=l.filter(w=>f.current.get(w)?.status!=="ready");g.length!==0&&Promise.all(g.map(w=>ne(w,i,s)))},[J,Te,i,s,ne]);let Kn=(0,y.useCallback)(()=>{if(typeof document>"u")return!1;let l=document.querySelector("[data-composer-input]");return l===null?!1:(l.focus(),!0)},[]),ar=(0,y.useCallback)(l=>{if(l.button!==0||M.current!==null||jo())return;let g=K.current?.previousElementSibling;if(g instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}M.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:g.getBoundingClientRect().width,restWidth:q},document.body.classList.add("fx-pane-resizing")}},[q]),sr=(0,y.useCallback)(l=>{let g=M.current;g===null||g.pointerId!==l.pointerId||ee(Dn(g.baseWidth+l.clientX-g.startX))},[]),on=(0,y.useCallback)(l=>{let g=M.current;if(g===null||g.pointerId!==l.pointerId)return;M.current=null,document.body.classList.remove("fx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let w=g.baseWidth+l.clientX-g.startX;if(Wt(w,g.baseWidth)){ee(g.restWidth);return}ee(Xe(O,w))},[O]),an=(0,y.useCallback)(()=>{Dt(O),ee(null)},[O]),dr=(0,y.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let g=zt(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(g===null)return;if(l.preventDefault(),l.stopPropagation(),g.kind==="reset"){an();return}if(g.kind==="min"||g.kind==="max"){let V=g.kind==="min"?180:520;ee(Xe(O,V));return}let w=K.current?.previousElementSibling,A=w instanceof HTMLElement?w.getBoundingClientRect().width:q??180;ee(Xe(O,A+g.delta))},[O,an,q]);(0,y.useEffect)(()=>()=>{M.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let l=g=>{if(!(g.isComposing||bt(g.target))){for(let w of $e)if(vt(g,w)){if(w.action==="closePanel"&&h.snapshot().active===null)return;g.preventDefault(),g.stopPropagation(),w.action==="nextPanel"?h.next():w.action==="previousPanel"?h.previous():h.close();return}}};return document.addEventListener("keydown",l,!0),()=>document.removeEventListener("keydown",l,!0)},[h]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let l=Ke({focusComposer:Kn,hasModal:()=>Pn(document)}),g=w=>l(w);return document.addEventListener("keydown",g,!0),()=>document.removeEventListener("keydown",g,!0)},[Kn]);let sn=(0,y.useMemo)(()=>_e(b,R,T,te),[b,R,T,te]),[lr,Hn]=(0,y.useState)(void 0),Vn=(0,y.useRef)(!1);(0,y.useEffect)(()=>{if(Vn.current||typeof document>"u")return;let l=gt({rows:sn,panelCount:h.snapshot().panels.length,hasModal:Pn(document)});l.kind!=="skip"&&(Vn.current=!0,l.open!==void 0&&h.open(l.open),Hn({path:l.focus}))},[sn,h]);let cr=(0,y.useCallback)(()=>Hn(void 0),[]),ge=T===void 0?void 0:Object.keys(T).length,ur=T===void 0?"neutral":Object.values(T).some(l=>l.status==="conflicted")?"conflict":ge===0?"success":"warning",Gn=ot(E),fr=(0,y.useCallback)(l=>{if(i===void 0||s===void 0)return;if(R.has(l)){x(w=>{let A=new Set(w);return A.delete(l),A});return}x(w=>new Set(w).add(l));let g=b.get(l);(g===void 0||g.status==="failed")&&ne(l,i,s)},[R,b,i,s,ne]),qn=(0,y.useCallback)(l=>{i===void 0||s===void 0||ne(l,i,s)},[i,s,ne]),pr=()=>x(new Set),gr=()=>Pe(l=>l+1),mr=i===void 0?"no-session":s===void 0?"no-service":N===void 0||N.status==="loading"?"loading":N.status==="failed"?"failed":N.nodes.length===0?"empty":"tree";return(0,m.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":mr,"data-session":i??"","data-testid":"fs-explorer-view",children:[(0,m.jsxs)("header",{className:"fx-head",children:[(0,m.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,m.jsx)(Bn,{open:!0})}),(0,m.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,m.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,m.jsxs)("div",{className:"fx-head-meta",children:[N?.status==="ready"?(0,m.jsxs)("span",{children:[(0,m.jsx)("b",{children:N.nodes.length})," ",t("head.entries")]}):null,(0,m.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:R.size===0,onClick:pr,children:(0,m.jsx)(Zt,{})}),(0,m.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:i===void 0||s===void 0||N?.status==="loading",onClick:gr,children:(0,m.jsx)(Yt,{})})]})]}),(0,m.jsx)("div",{className:"fx-main",children:i===void 0?(0,m.jsx)(nn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,m.jsx)(nn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):N===void 0||N.status==="loading"?(0,m.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,m.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):N.status==="failed"?(0,m.jsx)(nn,{title:t("state.failed.title"),description:N.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>qn(""),testId:"fs-failed"}):N.nodes.length===0?(0,m.jsx)(nn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"fx-tree-pane",style:q===null?void 0:{"--fx-tree-width":`${q}px`},children:(0,m.jsx)(Jt,{rows:sn,selectedPath:J,entryFocus:lr,t,onToggle:fr,onSelect:l=>h.open(l),onRetry:qn,onEntryFocusSettled:cr})}),(0,m.jsx)("div",{ref:K,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":q??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:ar,onPointerMove:sr,onPointerUp:on,onPointerCancel:on,onLostPointerCapture:on,onKeyDown:dr,onDoubleClick:an}),(0,m.jsxs)("div",{className:"fx-editor",children:[(0,m.jsx)(_t,{panels:I.panels,active:I.active,t,onActivate:l=>h.activate(l),onClose:l=>h.close(l),onStep:l=>l===1?h.next():h.previous()}),(0,m.jsx)("div",{className:"fx-editor-body",children:I.panels.length===0?(0,m.jsx)(Ot,{t}):I.panels.map((l,g)=>{let w=l.path===I.active;return(0,m.jsx)("div",{className:"fx-panel",id:`fx-panel-${g}`,role:"tabpanel","aria-labelledby":`fx-tab-${g}`,hidden:!w,"data-line":l.line,"data-testid":"fs-panel",children:(0,m.jsx)(Xt,{sessionId:i,files:s,path:l.path,t,visible:w})},l.path)})})]})]})}),N?.status==="ready"?(0,m.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,m.jsxs)("span",{children:[t("view.scope")," ",(0,m.jsx)("b",{children:N.nodes.length})," ",t("head.entries")]}),N.truncated?(0,m.jsx)("span",{className:"fx-foot-warn",children:xe({entries:N.nodes,truncated:!0,total:N.total}).label}):null,(0,m.jsxs)("span",{className:"fx-foot-git","data-state":ge===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,m.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ur,"aria-hidden":"true"}),ge===void 0?t("status.unavailable"):ge===0?t("status.clean"):t("status.summary").replace("{count}",String(ge))]}),Gn===null?null:(0,m.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Gn,E?.upstream!==void 0&&(E.ahead??0)>0?(0,m.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(E.ahead)}`}):null,E?.upstream!==void 0&&(E.behind??0)>0?(0,m.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(E.behind)}`}):null]}),(0,m.jsx)("span",{className:"fx-spacer"}),(0,m.jsx)("span",{children:t("foot.order")})]}):null]})}return d}var tr=["slots","locale","workbench","remote"];function zo(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var tn,rn;function rr(e){let n=e.workbench;if(n==null)return()=>{};tn?.();let t=e.locale.register(Ce,{zh:kn,en:Sn});tn=t;let r=e.locale.bind(Ce),o=It(typeof document>"u"?void 0:document),a=nr({workbench:n,version:n.version,t:r,files:Ht(e),status:Ut(e)});rn?.();let d=wn(e,n);return rn=d,e.slots.inject(cn,()=>e.slots.register({name:cn,id:_,order:100,label:()=>Rn(zo(e)),locale:Ce},a)),()=>{d(),rn===d&&(rn=void 0),o(),t(),tn===t&&(tn=void 0)}}var or={buildTree:Ie,describeListing:xe,iconFor:ce,computeTreeWindow:Ae,flattenTree:_e,badgeFor:ue,formatSize:Oe,joinPath:We,listingPath:je,parseFocus:ze,consumeViewRequest:he,createPanelStack:En,createEscapeHandler:Ke,KEYMAP:$e,tabLabel:Rn,normalizeListing:Qe,normalizeStatusSnapshot:en,buildWorkspaceMap:Me,workspaceTagFor:Le,parseStatusZ:Fe,statusTone:ye,statusBadge:Ne,createPreviewLoader:Ge,renderMarkdown:He,languageFor:we,isMarkdownFile:Ve,describePage:qe,classifyPreviewFailure:ke,normalizePreviewPage:Ln,previewChunkRoute:Ft,canBridgeFile:Be,decideBridge:vn,focusForFileAddress:hn,forwardFocus:bn,registerAddressBridge:wn},ir={name:"dsh-fs-explorer",inject:tr,apply:rr,__test:or};var _o=ir;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
