window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var it=Object.defineProperty;var ar=Object.getOwnPropertyDescriptor;var sr=Object.getOwnPropertyNames;var dr=Object.prototype.hasOwnProperty;var lr=(e,t)=>{for(var n in t)it(e,n,{get:t[n],enumerable:!0})},cr=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of sr(t))!dr.call(e,o)&&o!==n&&it(e,o,{get:()=>t[o],enumerable:!(r=ar(t,o))||r.enumerable});return e};var ur=e=>cr(it({},"__esModule",{value:!0}),e);var Ro={};lr(Ro,{__test:()=>Un,apply:()=>qn,boot:()=>wn,clientPlugin:()=>Xn,default:()=>Po,inject:()=>Gn});module.exports=ur(Ro);var fe=require("react");var Ot="dsh-resource://file/";function Bt(e){try{return decodeURIComponent(e)}catch{return e}}function ye(e){if(!e.startsWith(Ot))return null;let t=e.slice(Ot.length);if(!t.startsWith("session/"))return null;let n=t.slice(8),r=n.indexOf("/");if(r<=0)return null;let o=Bt(n.slice(0,r)),a=n.slice(r+1),d=a.search(/[?#]/u),c=d<0?a:a.slice(0,d);return c.length===0?null:{sessionId:o,path:c.split("/").map(Bt).join("/")}}function X(e){return e.slice(e.lastIndexOf("/")+1)}var $t=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Kt(){return $t.flatMap(e=>[...e.extensions])}function at(e){let t=e.slice(e.lastIndexOf("/")+1),n=t.lastIndexOf(".");if(n<=0)return null;let r=t.slice(n+1).toLowerCase();return $t.find(o=>o.extensions.includes(r))?.family??null}var V="dsh-fs-explorer",st="conversation.view",O="fs-explorer";var Le="fs-explorer",Vt="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",dt={chunk:"client.preview.js"},Ht={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var fr={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},pr={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},gr=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function qt(e){return typeof e=="string"&&gr.has(e)}function Gt(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let a=e.indexOf(" ",r);if(a<0)return null;n.push(e.slice(r,a)),r=a+1}return{fields:n,rest:e.slice(r)}}function mr(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function Me(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let a=o[0];if(a==="?"){if(o[1]!==" ")continue;let d=o.slice(2);d!==""&&(t[d]={status:"untracked"});continue}if(a!=="!"){if(a==="1"||a==="2"){let d=Gt(o.slice(2),a==="1"?7:8);if(d===null)continue;let c=d.fields[0]??"",i=d.rest;if(i===""||c.length<2)continue;if(a==="2"){let l=n[r+1];if(l===void 0||l==="")continue;r+=1,t[i]={status:"renamed"};continue}t[i]={status:mr(c[0]??".",c[1]??".")};continue}if(a==="u"){let d=Gt(o.slice(2),9);if(d===null)continue;let c=d.rest;if(c==="")continue;t[c]={status:"conflicted"}}}}return t}function xe(e){return qt(e)?fr[e]:"neutral"}function Ie(e){return qt(e)?pr[e]:"?"}function lt(e){return`status.${e}`}function Ut(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}function Xt(e){let{additions:t,deletions:n}=e;if(!(t===void 0||n===void 0))return t===null||n===null?{binary:!0}:{additions:t,deletions:n}}function Yt(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Zt(e,t){let n={...e};if(t===void 0)return n;for(let r of t){let o=n[r.path];o!==void 0&&(n[r.path]={...o,additions:r.additions,deletions:r.deletions})}return n}var yr=["conflicted","deleted","renamed","added","modified","untracked"];function xr(e){return xe(yr.find(t=>e.has(t))??"modified")}function Jt(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let a=r.replace(/\/+$/u,"");if(a==="")continue;let d=a.split("/"),c=r.endsWith("/")?d.length:d.length-1,i="";for(let l=0;l<c;l+=1){let s=d[l];if(s===void 0||s==="")continue;i=i===""?s:`${i}/${s}`;let f=t.get(i);f===void 0?t.set(i,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:xr(o.present)});return n}var tn=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],nn=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function hr(e){return nn.test(e)?e.slice(0,e.indexOf("/")):null}function vr(e){let t=e.indexOf(" #"),n=(t>=0?e.slice(0,t):e).trim();if(n.length>=2){let r=n[0],o=n.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return n.slice(1,-1)}return n}function br(e){let t=e.split(/\r?\n/u),n=[],r=0;for(;r<t.length&&!/^packages\s*:/u.test(t[r]??"");)r+=1;if(r===t.length)return n;for(r+=1;r<t.length;r+=1){let o=t[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let a=/^(\s*)-\s+(.*)$/u.exec(o);if(a===null)continue;let d=vr(a[2]??"");d!==""&&nn.test(d)&&n.push(d)}return n}function wr(e){let t=[],n,r=!1,o=()=>{r&&n!==void 0&&n!==""&&t.push(n),n=void 0};for(let a of e.split(/\r?\n/u)){let d=a.trim();if(d===""||d.startsWith("#")||d.startsWith(";"))continue;let c=/^\[(.+)\]$/u.exec(d);if(c!==null){o(),r=/^submodule(\s|$)/u.test(c[1]??"");continue}if(!r)continue;let i=/^path\s*=\s*(.*)$/u.exec(d);i!==null&&(n=(i[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(t)]}function Qt(e){try{let t=JSON.parse(e);return t===null||typeof t!="object"||Array.isArray(t)?void 0:t}catch{return}}function en(e){return Array.isArray(e)?e.filter(t=>typeof t=="string"):[]}function je(e,t){let n=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let c of wr(r))n.set(c,"submodule");let o=new Set,a=e.get("pnpm-workspace.yaml");if(typeof a=="string")for(let c of br(a))o.add(c);let d=e.get("package.json");if(typeof d=="string"){let c=Qt(d);if(c!==void 0){let i=c.workspaces,l=i!==null&&typeof i=="object"&&!Array.isArray(i)?i.packages:void 0;for(let s of en(Array.isArray(i)?i:l))o.add(s)}}for(let c of["turbo.json","lerna.json"]){let i=e.get(c);if(typeof i!="string")continue;let l=Qt(i);if(l!==void 0)for(let s of en(l.packages))o.add(s)}for(let c of o){let i=hr(c);i!==null&&t.has(i)&&n.set(c,"package")}return n}function Ae(e,t){if(e===void 0||t==="")return;let n=e.get(t);if(n!==void 0)return n;let r=t.lastIndexOf("/");if(r>0&&e.get(`${t.slice(0,r)}/*`)==="package")return"package";for(let o=t.indexOf("/");o>0;o=t.indexOf("/",o+1))if(e.get(`${t.slice(0,o)}/**`)==="package")return"package"}var kr=new Set(["node_modules",".git","dist","__pycache__"]);function Sr(e){return kr.has(e)}function Pr(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function We(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||Sr(r))continue;let o=Pr(n),a=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(a===void 0?{name:r,kind:o}:{name:r,kind:o,size:a})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var Rr=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Cr=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Tr=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Fr=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Er=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Nr=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Lr=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function on(e){let t=X(e.toLowerCase()),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function ce(e,t="file"){if(t==="directory")return"folder";let n=X(e.toLowerCase());if(Lr.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=on(n);return r===""?"file":Rr.has(r)?"code":Cr.has(r)?"markdown":Tr.has(r)?"data":Fr.has(r)?"image":Er.has(r)?"style":Nr.has(r)?"archive":"file"}var Mr={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Ir={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function ue(e){let t=X(e.toLowerCase()),n=Mr[t];if(n!==void 0)return n;let r=on(t),o=Ir[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(t.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function he(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${Vt} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function De(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),d=Math.max(0,e.length-a-o*2),c=Math.floor(Math.max(0,t.scrollTop)/n)-o,i=Math.min(Math.max(c,0),d),l=Math.min(e.length,i+a+o*2);return{rows:e.slice(i,l),startIndex:i,endIndex:l}}function ze(e){return e===""?".":e}function an(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function ve(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function rn(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function _e(e){if(typeof e!="string")return;let t=e.trim(),n=/^abs:(.+?)(?::(\d+))?$/u.exec(t);if(n!==null){let d=(n[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return d===""?void 0:{path:d,line:rn(n[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(t);if(r===null)return;let a=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:rn(r[2]),absolute:!1}}function Oe(e,t,n,r){let o=[],a=Jt(n),d=(c,i)=>{let l=e.get(c);if(!(l===void 0||l.status!=="ready"))for(let s of l.nodes){let f=ve(c,s.name),x=s.kind==="directory",w=x&&t.has(f),k=x||n===void 0?void 0:n[f],R=k?.status??(x?void 0:Ut(f,n)),M=k===void 0?void 0:Xt(k),D=x?a.get(f):void 0,_=x?Ae(r,f):void 0;if(o.push({type:"entry",path:f,name:s.name,kind:s.kind,depth:i,expanded:w,...s.size===void 0?{}:{size:s.size},...R===void 0?{}:{status:R},...D===void 0?{}:{statusCount:D.count,statusTone:D.tone},...M===void 0?{}:{diff:M},..._===void 0?{}:{tag:_}}),!w)continue;let p=e.get(f);if(p===void 0||p.status==="loading"){o.push({type:"status",key:`${f}:loading`,path:f,depth:i+1,state:"loading"});continue}if(p.status==="failed"){o.push({type:"status",key:`${f}:failed`,path:f,depth:i+1,state:"failed",message:p.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(p.nodes.length===0){o.push({type:"status",key:`${f}:empty`,path:f,depth:i+1,state:"empty"});continue}d(f,i+1),p.truncated&&o.push({type:"status",key:`${f}:truncated`,path:f,depth:i+1,state:"truncated",label:he({entries:p.nodes,truncated:!0,total:p.total}).label})}};return d("",0),o}function Be(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}var ct="dsh-fs-explorer:bridge",jr="fs-explorer-bridge",cn="dsh-resource://file/**",ut="sidebar.right.pane.tab",Ar=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Wr=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Dr=new Set(["makefile","dockerfile","license","readme","changelog"]),zr=new Set([...Kt(),...Ar]);function _r(e){let t=e.lastIndexOf(".");return t<0?"":e.slice(t+1).toLowerCase()}function $e(e){if(typeof e!="string"||e==="")return!1;let t=X(e).toLowerCase();if(t==="")return!1;let n=_r(t);return Wr.has(n)?!1:Dr.has(t)?!0:zr.has(n)}function Or(e){let t=e.search(/[?#]/u);if(t<0)return;let n=/[?&#]line=(\d+)/u.exec(e.slice(t));if(n!==null)return Math.max(1,Number.parseInt(n[1]??"",10))}function Br(e,t){for(let n of[e,t])if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);return 1}function gt(e,t){if(typeof e!="string")return;let n=ye(e);if(n===null)return;let r=n.path.replace(/\\/gu,"/");if(r==="")return;let o=Br(t,Or(e));return`${an(r)?"abs:":"path:"}${r}:${String(o)}`}function mt(e,t,n){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=ye(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(t===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==t)return{action:"keep",reason:"other-session"};if(!$e(r.path))return{action:"keep",reason:"refused"};let o=gt(e,n);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Y(e,t){t===void 0?console.warn(`[${V}] ${e}`):console.warn(`[${V}] ${e}`,t)}function $r(e){console.debug(`[${V}] ${e}`)}function ft(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function pt(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ae(e,t){try{let n=e();return t(n)?n:void 0}catch{return}}function sn(e){return ae(()=>e.sidebarRightTabs,ft)??ae(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,ft)}function dn(e){return ae(()=>e.sidebarRight,pt)??ae(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,pt)}function ln(e){return typeof e=="function"?e:()=>{}}var Kr="dsh-resource://file/session/probe/src/main.ts";function Vr(e){let t=ae(()=>(typeof e.candidates=="function"?e.candidates(Kr):[]).filter(r=>r.priority==="extension"&&r.id!==ct),n=>Array.isArray(n)&&n.length>0);t!==void 0&&Y(`another extension-band tab type already claims ${cn}: ${t.map(n=>String(n.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Hr(e){for(let t of[e?.contentId,e?.record?.contentId,e?.address])if(typeof t=="string"&&t!=="")return t}function Gr(e){let t=e?.navigation?.params?.line;if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);if(typeof t=="string"&&/^\d+$/u.test(t))return Math.max(1,Number.parseInt(t,10))}function qr(e,t){let n=e.viewFocus;if(n?.request?.(O,t),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(O,t);return(!r.opened||r.focused)&&n?.take(O),r}return typeof e.openView=="function"&&e.openView(O,t)?(n?.take(O),{opened:!0,focused:!0}):(n?.take(O),{opened:!1,focused:!1})}function yt(e,t,n,r){let o;try{o=qr(e,r)}catch(a){return Y("the file workbench threw while switching views",a),e.viewFocus?.take(O),!1}if(!o.opened)return Y(`the file workbench did not switch to ${O}; the tab stays as the reader's only route to the file`),!1;try{return t.close(n),!0}catch(a){return Y("the forwarded tab could not be closed",a),!1}}function Ur(e,t){function n({useTabInfo:r}){let a=r()?.tab,d=typeof a?.id=="string"&&a.id!==""?a.id:void 0,c=Hr(a),i=Gr(a),l=(0,fe.useRef)(void 0);return(0,fe.useEffect)(()=>{if(d===void 0){Y("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(l.current===d)return;l.current=d;let s=mt(c,e.currentSessionId(),i);if(s.action!=="open"){Y(`left the forwarded tab standing (${s.reason})`,c);return}yt(e,t,d,s.focus)},[d,c,i]),null}return function(o){return typeof o.useTabInfo!="function"?(Y(`the host did not inject useTabInfo into ${ut}; the bridge cannot forward`),null):(0,fe.createElement)(n,{useTabInfo:o.useTabInfo})}}function xt(e,t){let n=(c,i)=>{if(c===void 0||i===void 0)return;Vr(c);let l;try{l=c.register({id:ct,kind:jr,patterns:[cn],priority:"extension",canOpen:x=>{let w=ye(x);return w!==null&&$e(w.path)},title:x=>X(ye(x)?.path??x)||x})}catch(x){Y("the sidebar right refused the address bridge tab type",x);return}let s=Ur(t,i),f;try{f=ln(e.slots.inject(ut,()=>e.slots.register({name:ut,key:ct},s)))}catch(x){l(),Y("the sidebar right refused the address bridge body",x);return}return()=>{f(),l()}},r=sn(e),o=dn(e);if(r!==void 0&&o!==void 0)return n(r,o)??(()=>{});let a=e.inject;if(typeof a!="function")return $r("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let d=a.call(e,["sidebarRightTabs","sidebarRight"],c=>{let i=ae(()=>c.get?.("sidebarRightTabs"),ft)??sn(c),l=ae(()=>c.get?.("sidebarRight"),pt)??dn(c);return n(i,l)});return ln(d)}var ht={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},vt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag to resize the file tree column","pane.resizeHint":"Drag to resize; double-click to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function bt(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?ht:vt)["tab.label"]??"Files"}var Ke=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Xr(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",t=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(t)?"mac":"other"}function un(e,t,n=Xr()){if(e.isComposing===!0||e.code!==t.code)return!1;let r=t.modifiers,o=r.includes("meta")||r.includes("primary")&&n==="mac",a=r.includes("control")||r.includes("primary")&&n!=="mac",d=r.includes("alt"),c=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===a&&e.altKey===!0===d&&e.shiftKey===!0===c}function fn(e){if(e===null||typeof e!="object")return!1;let t=e;if(t.isContentEditable===!0)return!0;if(typeof t.tagName!="string")return!1;let n=t.tagName.toLowerCase();return n==="input"||n==="textarea"||n==="select"}function Yr(e){let t=e?.querySelector("[data-composer-input]");if(t==null||typeof t!="object")return!1;let n=t.focus;return typeof n!="function"?!1:(n.call(t),!0)}function pn(e){let t=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return t!=null}function Ve(e){let t=e.doc??(typeof document>"u"?void 0:document);return n=>{if(n.key!=="Escape"||n.defaultPrevented===!0||n.isComposing===!0||e.hasModal())return;n.preventDefault(),e.focusComposer()!==!0&&Yr(t),e.onClose?.()}}function gn(e){let t=X(e);return t===""?e:t}function wt(e,t){if(typeof e!="string")return;let n=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=t?n:n.replace(/^\/+/u,"");return r===""?void 0:r}var Zr=Object.freeze({panels:Object.freeze([]),active:null});function kt(){let e=[],t=null,n=Zr,r=new Set,o=()=>{n=Object.freeze({panels:Object.freeze(e.slice()),active:t});for(let i of[...r])i()},a=i=>e.findIndex(l=>l.path===i),d=i=>{let l=wt(i,!0);if(l===void 0)return;if(a(l)>=0)return l;let s=wt(i,!1);if(!(s===void 0||s===l))return a(s)>=0?s:void 0},c=i=>{if(e.length===0)return;let l=t===null?-1:a(t),s=e[(l+i+e.length)%e.length];s===void 0||s.path===t||(t=s.path,o())};return{open(i,l=1,s=!1){let f=wt(i,s);if(f===void 0)return;let x=Number.isFinite(l)&&l>0?Math.trunc(l):1,w=a(f);if(w>=0){let R=e[w],M=R!==void 0&&(R.line!==x||R.absolute!==s);if(M&&(e=e.map((D,_)=>_===w?{path:f,line:x,absolute:s}:D)),t===f){M&&o();return}t=f,o();return}let k=t===null?e.length:a(t)+1;e=[...e.slice(0,k),{path:f,line:x,absolute:s},...e.slice(k)],t=f,o()},close(i){let l=i===void 0?t:d(i)??null;if(l===null)return;let s=a(l);s<0||(e=e.filter(f=>f.path!==l),t===l&&(t=(e[s]??e[s-1])?.path??null),o())},activate(i){let l=d(i);l===void 0||a(l)<0||t===l||(t=l,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&t===null||(e=[],t=null,o())},isOpen(i){let l=d(i);return l!==void 0&&a(l)>=0},activeEntry(){return e.find(i=>i.path===t)},snapshot:()=>n,subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function mn(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o=kt();return e.set(n,o),o}}}function be(e,t){let n=_e(e);return n===void 0?!1:(t.open(n.path,n.line,n.absolute),!0)}var yn=require("react");function z(e,t,...n){let r=n.filter(d=>d!=null&&d!==!1),o=(0,yn.createElement)(e,t??void 0,...r);if(o!==null&&typeof o=="object")return o;let a={...t??{}};return r.length===1?a.children=r[0]:r.length>1&&(a.children=r),{type:e,props:a,key:null}}function Jr(e){let t=e.trim();if(!(t===""||t.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(t)||t.startsWith("/")||t.startsWith("#")||t.startsWith("./")||t.startsWith("../")))return t}var Qr=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function se(e){let t=[],n=0;for(let r of e.matchAll(Qr)){let o=r.index??0;o>n&&t.push(e.slice(n,o));let a=r[0];if(a.startsWith("`"))t.push(z("code",null,a.slice(1,-1)));else if(a.startsWith("**")||a.startsWith("__"))t.push(z("strong",null,...se(a.slice(2,-2))));else if(a.startsWith("~~"))t.push(z("del",null,...se(a.slice(2,-2))));else if(a.startsWith("*")||a.startsWith("_"))t.push(z("em",null,...se(a.slice(1,-1))));else{let d=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(a),c=d?.[1]??a,i=d===null?void 0:Jr(d[2]??"");t.push(i===void 0?c:z("a",{href:i,rel:"noreferrer noopener"},c))}n=o+a.length}return n<e.length&&t.push(e.slice(n)),t}var xn=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,hn=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,vn=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,St=/^\s{0,3}>\s?(.*)$/u,Pt=/^\s{0,3}[-*+]\s+(.*)$/u,Rt=/^\s{0,3}\d+[.)]\s+(.*)$/u;function eo(e){return xn.test(e)||hn.test(e)||vn.test(e)||St.test(e)||Pt.test(e)||Rt.test(e)}function bn(e){let t=[],n=0;for(;n<e.length;){let r=e[n]??"";if(r.trim()===""){n+=1;continue}let o=xn.exec(r);if(o!==null){let l=(o[1]??"```").slice(0,1),s=o[2]??"",f=[];for(n+=1;n<e.length&&!new RegExp(`^\\s{0,3}${l}{3,}\\s*$`,"u").test(e[n]??"");)f.push(e[n]??""),n+=1;n+=1,t.push(z("pre",null,z("code",s===""?null:{className:`language-${s}`},f.join(`
`))));continue}let a=hn.exec(r);if(a!==null){let l=(a[1]??"#").length;t.push(z(`h${String(l)}`,null,...se(a[2]??""))),n+=1;continue}if(vn.test(r)){t.push(z("hr",null)),n+=1;continue}if(St.test(r)){let l=[];for(;n<e.length;){let s=St.exec(e[n]??"");if(s===null)break;l.push(s[1]??""),n+=1}t.push(z("blockquote",null,...bn(l)));continue}if(Pt.exec(r)!==null){let l=[];for(;n<e.length;){let s=Pt.exec(e[n]??"");if(s===null)break;l.push(z("li",null,...se(s[1]??""))),n+=1}t.push(z("ul",null,...l));continue}if(Rt.exec(r)!==null){let l=[];for(;n<e.length;){let s=Rt.exec(e[n]??"");if(s===null)break;l.push(z("li",null,...se(s[1]??""))),n+=1}t.push(z("ol",null,...l));continue}let i=[r.trim()];for(n+=1;n<e.length;){let l=e[n]??"";if(l.trim()===""||eo(l))break;i.push(l.trim()),n+=1}t.push(z("p",null,...se(i.join(" "))))}return t}function He(e){let t=e.replace(/\r\n?/gu,`
`).split(`
`);return z("div",{className:"fx-md"},...bn(t))}var Ct=200,to={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function Se(e){let t=e.toLowerCase(),n=t.slice(t.lastIndexOf("/")+1),r=n.lastIndexOf(".");return r<=0?"plaintext":to[n.slice(r+1)]??"plaintext"}function Ge(e){return Se(e)==="markdown"}var de=class extends Error{code;detail;constructor(t,n,r=""){super(n),this.name="PreviewReadError",this.code=t,this.detail=r}};function we(e){return e!==null&&typeof e=="object"}function no(e){return e===""?0:e.split(`
`).length}function Tt(e,t){if(!we(e))throw new de("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=we(e.error)?e.error:{},i=typeof c.code=="string"?c.code:"preview/unknown",l=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=we(c.details)?c.details:{},f=typeof s.kind=="string"?s.kind:"";throw new de(i,l,f)}let n=e.ok===!0?e.value:e;if(!we(n)||typeof n.text!="string")throw new de("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof n.lines=="number"&&Number.isFinite(n.lines)?Math.max(0,Math.trunc(n.lines)):no(n.text),o=typeof n.totalLines=="number"&&Number.isFinite(n.totalLines)&&n.totalLines>0?Math.trunc(n.totalLines):void 0,a=typeof n.offset=="number"&&Number.isFinite(n.offset)&&n.offset>0?Math.trunc(n.offset):t,d=n.eof===!0||o!==void 0&&r>0&&a+r-1>=o;return o===void 0?{text:n.text,lines:r,offset:a,eof:d}:{text:n.text,lines:r,offset:a,totalLines:o,eof:d}}function Pe(e){let t=we(e)?e:{},n=typeof t.code=="string"?t.code:"",r=typeof t.detail=="string"?t.detail:"",o=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",a=`${n} ${r} ${o}`.toLowerCase();return a.includes("symlink")?{kind:"symlink",code:n,message:o}:a.includes("eacces")||a.includes("eperm")||a.includes("permission")||a.includes("denied")||a.includes("forbidden")||a.includes("\u6743\u9650")?{kind:"denied",code:n,message:o}:a.includes("not-found")||a.includes("not_found")||a.includes("enoent")||a.includes("no such file")||a.includes("deleted")||a.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:n,message:o}:a.includes("not-regular-file")||a.includes("not a regular file")?{kind:"binary",code:n,message:o}:a.includes("not-text")||a.includes("utf-8")||a.includes("binary")?{kind:"binary",code:n,message:o}:a.includes("too-large")||a.includes("too large")||a.includes("maxbytes")?{kind:"too-large",code:n,message:o}:a.includes("unavailable")?{kind:"unavailable",code:n,message:o}:{kind:"unknown",code:n,message:o}}var ke=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function qe({files:e,maxLines:t=Ct}){let n=Math.max(1,Math.trunc(t)),r=ke,o=0,a=null,d=[1],c=new Set,i=s=>{r=s;for(let f of c)f()},l=async(s,f)=>{o+=1;let x=o;a?.abort();let w=new AbortController;a=w,i({status:"loading",path:s,text:r.path===s?r.text:"",offset:f,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let k=await e.read(s,f>1?{offset:f,limit:n}:{limit:n},w.signal);if(x!==o)return;let R=Tt(k,f);if(R.lines===0&&f>1){i({...r,status:"ready",eof:!0,text:"",lines:0});return}i(R.totalLines===void 0?{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,eof:R.eof}:{status:"ready",path:s,text:R.text,offset:R.offset,lines:R.lines,totalLines:R.totalLines,eof:R.eof})}catch(k){if(x!==o||w.signal.aborted)return;i({status:"failed",path:s,text:"",offset:f,lines:0,eof:!1,failure:Pe(k)})}};return{maxLines:n,getSnapshot:()=>r,subscribe(s){return c.add(s),()=>{c.delete(s)}},async open(s){d=[1],await l(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(d.push(s),await l(r.path,s))},async prev(){if(r.path===void 0||d.length<=1)return;d=d.slice(0,-1);let s=d[d.length-1]??1;await l(r.path,s)},async retry(){r.path!==void 0&&await l(r.path,r.offset)},close(){o+=1,a?.abort(),a=null,d=[1],i(ke)}}}function Ue(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let t=e.offset+e.lines-1,n=`${String(e.offset)}\u2013${String(t)}`;return e.totalLines===void 0?{range:n}:{range:n,total:String(e.totalLines)}}var Ft=Object.freeze({chunk:dt.chunk,id:`${V}/${dt.chunk}`}),Et=null,Re=null,Xe=new Map;function wn(e){Et=e}function kn(){return Ft}function ro(e){let t=Ht[e];return{chunk:t,id:`${V}/${t}`}}function Sn(){if(Re!==null)return Re;let e=Et;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${V}: the loader require was not handed over`));let t=e.async(`./${Ft.chunk}`).then(n=>{let r=n;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${V}: chunk ${Ft.id} is missing its preview renderers`);return r});return Re=t,t.catch(()=>{Re===t&&(Re=null)}),t}function Pn(e){let t=Xe.get(e);if(t!==void 0)return t;let n=Et;if(n===null||typeof n.async!="function")return Promise.reject(new Error(`${V}: the loader require was not handed over`));let r=ro(e),o=n.async(`./${r.chunk}`).then(a=>{let d=a;if(d===null||typeof d.FamilyView!="function"||d.renderer!==e)throw new Error(`${V}: chunk ${r.id} is not the ${e} view`);return d});return Xe.set(e,o),o.catch(()=>{Xe.get(e)===o&&Xe.delete(e)}),o}var Rn="dsh-fs-explorer-styles",oo=`
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
`;function Cn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Rn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Rn,n.textContent=oo,e.head.appendChild(n),()=>{n.remove()}}var y=require("react");var Nt="fs-explorer.treePaneWidth";function Lt(e){return Math.min(520,Math.max(180,e))}function Tn(e){if(e==null)return null;let t;try{t=e.getItem(Nt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<180||n>520?null:n}function Fn(e,t){let n=Math.round(Lt(t));if(e!=null)try{e.setItem(Nt,String(n))}catch{}return n}function En(e){if(e!=null)try{e.removeItem(Nt)}catch{}}var Ye=require("react");var E=require("react/jsx-runtime");function Nn({panels:e,active:t,t:n,onActivate:r,onClose:o,onStep:a}){let d=(0,Ye.useRef)(null);if((0,Ye.useEffect)(()=>{d.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[t]),e.length===0)return null;let c=i=>{if(i.key==="ArrowRight"||i.key==="ArrowLeft"){i.preventDefault(),i.stopPropagation(),a(i.key==="ArrowRight"?1:-1);return}(i.key==="Delete"||i.key==="Backspace")&&t!==null&&(i.preventDefault(),i.stopPropagation(),o(t))};return(0,E.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":n("panel.tabs"),onKeyDown:c,"data-testid":"fs-tabs",children:e.map((i,l)=>{let s=i.path===t,f=gn(i.path),x=n("panel.close").replace("{name}",f);return(0,E.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,E.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${l}`,"aria-controls":`fx-panel-${l}`,"aria-selected":s,tabIndex:s?0:-1,title:i.path,"data-testid":"fs-tab","data-path":i.path,ref:s?d:void 0,onClick:()=>r(i.path),children:[(0,E.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":ce(i.path),"aria-hidden":"true",children:ue(i.path)}),(0,E.jsx)("span",{className:"fx-tab-name",children:f})]}),(0,E.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":x,title:x,"data-testid":"fs-tab-close",onClick:()=>o(i.path),children:"\xD7"})]},i.path)})})}function io(){return(0,E.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,E.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,E.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,E.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Ln({t:e}){return(0,E.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,E.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,E.jsx)(io,{})}),(0,E.jsx)("strong",{children:e("panel.empty.title")}),(0,E.jsx)("span",{children:e("panel.empty.description")}),(0,E.jsxs)("span",{className:"fx-empty-keys",children:[(0,E.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,E.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,E.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,E.jsx)("span",{children:e("panel.empty.keys")})]})]})}var C=require("react");async function Mn(e){let t=typeof navigator>"u"?void 0:navigator.clipboard;if(t!==void 0&&typeof t.writeText=="function")try{return await t.writeText(e),!0}catch{}if(typeof document>"u")return!1;let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}var Z=require("react/jsx-runtime");function ao(e,t){switch(e.kind){case"deleted":return t("preview.deleted.title");case"denied":return t("preview.denied.title");case"symlink":return t("preview.symlink.title");case"binary":return t("preview.binary.title");case"too-large":return t("preview.tooLarge.title");case"unavailable":return t("preview.unavailable.title");default:return t("preview.unknown.title")}}function so(e,t){switch(e.kind){case"deleted":return t("preview.deleted.description");case"denied":return t("preview.denied.description");case"symlink":return t("preview.symlink.description");case"binary":return t("preview.binary.description");case"too-large":return t("preview.tooLarge.description");case"unavailable":return t("preview.unavailable.description");default:return t("preview.unknown.description")}}function Mt({failure:e,t,onRetry:n}){return(0,Z.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Z.jsx)("strong",{children:ao(e,t)}),(0,Z.jsx)("span",{children:so(e,t)}),e.message===""?null:(0,Z.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Z.jsx)("button",{type:"button",className:"fx-btn",onClick:n,"data-testid":"fs-preview-retry",children:t("preview.retry")})]})}function It({t:e}){return(0,Z.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Z.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}function Ze(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function pe(e){try{return e()}catch{return}}function An(e){return()=>{let t=pe(()=>e.workspaceFiles);if(Ze(t))return t;let n=pe(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Ze(n))return n;let r=pe(()=>e.remote?.workspaceFiles);if(Ze(r))return r;let o=pe(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Ze(o))return o}}function Wn(e,t){if(e===void 0||t===void 0)return;let n=e.read;if(typeof n=="function")return{read(r,o,a){return n.call(e,t,r,o,a)}}}function Je(e){return e!==null&&typeof e=="object"}function lo(e){if(!Je(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let t=e.ok===!0?e.value:e,n=Je(t)?t.data:void 0;return n instanceof Uint8Array?{ok:!0,value:{data:n}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function co(e){let t=Je(e)?e:{},n=typeof t.code=="string"?t.code:"preview/unknown",r=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Je(t.details)?t.details:{},a=typeof o.kind=="string"?o.kind:"";return new de(n,r,a)}function Dn(e){if(e===void 0)return;let t=e.readBytes;if(typeof t=="function")return async(n,r,o)=>{let a=lo(await t.call(e,n,r,{},o));if(!a.ok)throw co(a.error);return a.value.data}}function Ce(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function jt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Qe(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:Ce(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?jt(r.value):{ok:!1,message:Ce(r.error)}}return jt(n)}return jt(t)}function zn(e){return e instanceof Error?e.message:Ce(e)}function In(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function _n(e){return()=>{let t=pe(()=>e.remote?.gitExplorer);if(In(t))return t;let n=pe(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(In(n))return n}}function jn(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function uo(e){if(!Array.isArray(e))return;let t=[];for(let n of e){if(n===null||typeof n!="object")continue;let r=n;if(typeof r.path!="string"||r.path==="")continue;let o=jn(r.additions),a=jn(r.deletions);o===void 0||a===void 0||t.push({path:r.path,additions:o,deletions:a})}return t}function fo(e){if(e===null||typeof e!="object")return;let t=e,n=d=>typeof d=="number"&&Number.isFinite(d)&&d>=0?d:void 0,r=typeof t.upstream=="string"&&t.upstream!==""?t.upstream:void 0,o=n(t.ahead),a=n(t.behind);return{hash:typeof t.hash=="string"&&t.hash!==""?t.hash:null,branch:typeof t.branch=="string"&&t.branch!==""?t.branch:null,detached:t.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...a===void 0?{}:{behind:a}}}function At(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(typeof t.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let n=uo(t.stats),r=fo(t.head),o=typeof t.root=="string"&&t.root!==""?t.root:void 0;return{ok:!0,status:t.isRepository===!1?"":t.status,...n===void 0?{}:{stats:n},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function et(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:Ce(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?At(o.snapshot):{ok:!1,message:Ce(o.error)}}let r=e;return r.snapshot!==void 0?At(r.snapshot):At(n)}var v=require("react/jsx-runtime");function po({chunk:e,text:t,path:n,offset:r}){let o=(0,C.useRef)(null),a=(0,C.useRef)(null),[d,c]=(0,C.useState)(!1),i=Se(n);return(0,C.useEffect)(()=>{c(!1)},[e,n]),(0,C.useEffect)(()=>{let l=o.current;if(!(e===null||l===null))try{let s=e.mountCodePreview(l,{text:t,language:i,path:n,offset:r});return a.current=s,()=>{s.destroy(),a.current=null}}catch{c(!0);return}},[e,n,i]),(0,C.useEffect)(()=>{a.current?.update(t,r)},[t,r,e]),e===null||d?(0,v.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:t}):(0,v.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function On({sessionId:e,files:t,path:n,t:r,visible:o=!0}){let a=(0,C.useMemo)(()=>Wn(t,e),[t,e]),d=(0,C.useMemo)(()=>Dn(t),[t]),c=n===void 0?null:at(n),[i,l]=(0,C.useState)(null),[s,f]=(0,C.useState)(ke),[x,w]=(0,C.useState)(null),[k,R]=(0,C.useState)(null),[M,D]=(0,C.useState)(null),[_,p]=(0,C.useState)(0),[S,P]=(0,C.useState)("reading"),[N,j]=(0,C.useState)(!1),$=(0,C.useRef)(void 0);if((0,C.useEffect)(()=>{if(a===void 0){l(null);return}let I=qe({files:a,maxLines:Ct});return l(I),()=>I.close()},[a]),(0,C.useEffect)(()=>{if(i===null){f(ke);return}return f(i.getSnapshot()),i.subscribe(()=>f(i.getSnapshot()))},[i]),(0,C.useEffect)(()=>{i===null||n===void 0||c!==null||i.open(n)},[i,n,c]),(0,C.useEffect)(()=>{P("reading"),j(!1)},[n]),(0,C.useEffect)(()=>()=>{$.current!==void 0&&clearTimeout($.current)},[]),(0,C.useEffect)(()=>{if(n===void 0||c!==null)return;let I=!0;return Sn().then(Q=>{I&&w(Q)}).catch(()=>{I&&w(null)}),()=>{I=!1}},[n,c]),(0,C.useEffect)(()=>{if(c===null)return;let I=!0;return R(null),D(null),Pn(c).then(Q=>{I&&R(Q)}).catch(Q=>{I&&D(Pe(Q))}),()=>{I=!1}},[c,_]),n===void 0)return(0,v.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,v.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,v.jsx)("strong",{children:r("preview.empty.title")}),(0,v.jsx)("span",{children:r("preview.empty.description")})]})});let T=c!==null,K=e!==void 0&&d!==void 0?{sessionId:e,readFile:d}:null,Te=T&&K===null,J=Ue(s),Fe=!T&&Ge(n),H=T?!Te&&k===null&&M===null:s.status==="loading",re=s.status==="ready",B=Fe&&S==="reading",ge=T?Te?"unavailable":M!==null?"failed":k===null?"loading":"ready":s.status,oe=()=>{Mn(n).then(I=>{I&&(j(!0),$.current!==void 0&&clearTimeout($.current),$.current=setTimeout(()=>j(!1),1400))})},G;return T?G=K===null?(0,v.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,v.jsx)("strong",{children:r("preview.unavailable.title")}),(0,v.jsx)("span",{children:r("preview.unavailable.description")})]}):M!==null?(0,v.jsx)(Mt,{failure:M,t:r,onRetry:()=>p(I=>I+1)}):k===null?(0,v.jsx)(It,{t:r}):(0,v.jsx)(k.FamilyView,{path:n,sessionId:K.sessionId,readFile:K.readFile,t:r,visible:o}):a===void 0?G=(0,v.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,v.jsx)("strong",{children:r("preview.unavailable.title")}),(0,v.jsx)("span",{children:r("preview.unavailable.description")})]}):s.status==="failed"?G=(0,v.jsx)(Mt,{failure:s.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{i?.retry()}}):re?B?G=x===null?(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:He(s.text)}):(0,v.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,v.jsx)(x.MarkdownView,{text:s.text})}):G=(0,v.jsx)(po,{chunk:x,text:s.text,path:n,offset:s.offset}):G=(0,v.jsx)(It,{t:r}),(0,v.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":ge,"data-mode":T?"binary":B?"reading":"code","data-renderer":T?k?.renderer??"pending":B?x===null?"fallback":"gfm":x?.renderer??"plain",children:[(0,v.jsxs)("header",{className:"fx-preview-bar",children:[(0,v.jsx)("span",{className:"fx-preview-path",title:n,"data-testid":"fs-preview-path",children:n}),T?null:(0,v.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[J.range,J.range==="\u2014"?null:(0,v.jsxs)(v.Fragment,{children:[" ",r("preview.lines")]}),J.total===void 0?null:(0,v.jsxs)("span",{className:"fx-preview-total",children:[" / ",J.total," ",r("preview.lines")]})]}),(0,v.jsxs)("div",{className:"fx-preview-actions",children:[Fe?(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>P(I=>I==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(S==="reading"?"preview.source":"preview.reading")}):null,T?null:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!re||H||s.offset<=1,onClick:()=>{i?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!re||H||s.eof,onClick:()=>{i?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,v.jsx)("button",{type:"button",className:"fx-pbtn",onClick:oe,"data-testid":"fs-preview-copy",children:r(N?"preview.copied":"preview.copyPath")}),H?(0,v.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,v.jsx)("div",{className:"fx-preview-body","data-scroll":B?"y":"none",children:G})]})}var W=require("react");var h=require("react/jsx-runtime"),ne=22;function Wt({open:e=!0,size:t=14}){return(0,h.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,h.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,h.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function go(){return(0,h.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,h.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Bn(){return(0,h.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,h.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,h.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function $n(){return(0,h.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,h.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function mo({name:e}){return(0,h.jsx)("span",{className:"fx-badge","data-icon":ce(e),"aria-hidden":"true",children:ue(e)})}function yo({row:e,selected:t,cursor:n,top:r,t:o,onToggle:a,onSelect:d,onRowActivate:c}){let i=e.kind==="directory",l={top:r,paddingLeft:8+e.depth*12};return(0,h.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...i?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-cursor":n?"true":"false","data-expanded":i?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:l,onClick:()=>{c(e.path),i?a(e.path):d(e.path)},children:[(0,h.jsx)("span",{className:"fx-chevron","data-open":i&&e.expanded?"true":"false","data-visible":i?"true":"false","aria-hidden":"true",children:(0,h.jsx)(go,{})}),i?(0,h.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,h.jsx)(Wt,{open:e.expanded})}):(0,h.jsx)(mo,{name:e.name}),(0,h.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,h.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,h.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":xe(e.status),"data-testid":"fx-file-status",title:o(lt(e.status)),"aria-label":o(lt(e.status)),children:Ie(e.status)}),e.statusCount===void 0?null:(0,h.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,h.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,h.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,h.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,h.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,h.jsx)("span",{className:"fx-size",children:Be(e.size)})]})}function xo({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,h.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,h.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,h.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,h.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,h.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function Kn({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:a}){let d=(0,W.useRef)(null),[c,i]=(0,W.useState)(0),[l,s]=(0,W.useState)(0),[f,x]=(0,W.useState)(void 0),w=(0,W.useMemo)(()=>e.flatMap((p,S)=>p.type==="entry"?[S]:[]),[e]);(0,W.useEffect)(()=>{if(t===void 0)return;let p=e.findIndex(S=>S.type==="entry"&&S.path===t);p>=0&&x(p)},[t,e]),(0,W.useEffect)(()=>{f!==void 0&&e[f]?.type!=="entry"&&x(void 0)},[e,f]),(0,W.useEffect)(()=>{let p=d.current;if(f===void 0||p===null)return;let S=f*ne;S<p.scrollTop?p.scrollTop=S:S+ne>p.scrollTop+p.clientHeight&&(p.scrollTop=S+ne-p.clientHeight)},[f]);let k=(0,W.useCallback)(p=>{x(p),d.current?.focus({preventScroll:!0})},[]),R=(0,W.useCallback)(p=>{let S=e.findIndex(P=>P.type==="entry"&&P.path===p);S>=0&&x(S)},[e]),M=(0,W.useCallback)(p=>{if(p.nativeEvent.isComposing||p.altKey||p.metaKey||p.ctrlKey)return;let S=w.at(-1);if(p.key==="ArrowDown"){if(p.preventDefault(),f===void 0){w[0]!==void 0&&k(w[0]);return}let N=w.find(j=>j>f);N!==void 0&&k(N);return}if(p.key==="ArrowUp"){if(p.preventDefault(),f===void 0){S!==void 0&&k(S);return}let N=[...w].reverse().find(j=>j<f);N!==void 0&&k(N);return}if(f===void 0)return;let P=e[f];if(!(P===void 0||P.type!=="entry")){if(p.key==="ArrowRight"){if(p.preventDefault(),P.kind==="directory"&&!P.expanded)r(P.path);else{let N=w.find(j=>j>f);N!==void 0&&e[N]?.depth===P.depth+1&&k(N)}return}if(p.key==="ArrowLeft"){if(p.preventDefault(),P.kind==="directory"&&P.expanded)r(P.path);else{let N=[...w].reverse().find(j=>j<f&&e[j]?.type==="entry"&&e[j].depth<P.depth);N!==void 0&&k(N)}return}if(p.key==="Enter"&&P.kind!=="directory"){p.preventDefault(),o(P.path);return}if(p.key==="Home"){p.preventDefault(),w[0]!==void 0&&k(w[0]);return}p.key==="End"&&(p.preventDefault(),S!==void 0&&k(S))}},[f,w,k,r,o,e]);(0,W.useEffect)(()=>{let p=d.current;if(p===null)return;let S=()=>s(p.clientHeight);if(S(),typeof ResizeObserver>"u")return;let P=new ResizeObserver(S);return P.observe(p),()=>P.disconnect()},[]),(0,W.useEffect)(()=>{if(t===void 0)return;let p=d.current;if(p===null)return;let S=e.findIndex(N=>N.type==="entry"&&N.path===t);if(S<0)return;let P=S*ne;(P<p.scrollTop||P+ne>p.scrollTop+p.clientHeight)&&(p.scrollTop=Math.max(0,P-p.clientHeight/2))},[t,e]);let D=p=>{i(p.currentTarget.scrollTop)},_=De(e,{scrollTop:c,height:l===0?480:l,rowHeight:ne});return(0,h.jsx)("div",{className:"fx-scroll",ref:d,onScroll:D,onKeyDown:M,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,h.jsx)("div",{className:"fx-vlist",style:{height:e.length*ne},children:_.rows.map((p,S)=>{let P=(_.startIndex+S)*ne;return p.type==="entry"?(0,h.jsx)(yo,{row:p,top:P,selected:p.path===t,cursor:f===_.startIndex+S,t:n,onToggle:r,onSelect:o,onRowActivate:R},p.path):(0,h.jsx)(xo,{row:p,top:P,t:n,onRetry:a},p.key)})})})}var g=require("react/jsx-runtime");var ho=()=>({status:"loading",nodes:[],truncated:!1,total:0});function vo(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var bo=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Vn=new Map;function wo(e){if(e===null||typeof e!="object")return;let t=e;if(t.ok===!1)return;let n=t.ok===!0?t.value:e;if(n===null||typeof n!="object")return;let r=n.text;return typeof r=="string"?r:void 0}function tt({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,g.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,g.jsx)("strong",{children:e}),t===void 0?null:(0,g.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,g.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function Hn({workbench:e,version:t,t:n,files:r,status:o}){let a=mn();function d(c){let i=c.sessionId??e.currentSessionId(),l=(0,y.useRef)(i);l.current=i;let s=(0,y.useMemo)(()=>r(),[r]),f=(0,y.useMemo)(()=>o(),[o]),[x,w]=(0,y.useState)(()=>new Map),[k,R]=(0,y.useState)(void 0),[M,D]=(0,y.useState)(void 0),[_,p]=(0,y.useState)(void 0),[S,P]=(0,y.useState)(Vn),N=(0,y.useRef)(x);N.current=x;let[j,$]=(0,y.useState)(()=>new Set),T=(0,y.useMemo)(()=>a.forSession(i),[a,i]),K=(0,y.useSyncExternalStore)(T.subscribe,T.snapshot,T.snapshot),Te=K.active??void 0,[J,Fe]=(0,y.useState)(0),[H,re]=(0,y.useState)(void 0),B=(0,y.useRef)(new Map),ge=(0,y.useRef)(void 0),oe=(0,y.useMemo)(()=>vo(),[]),[G,I]=(0,y.useState)(()=>Tn(oe)),Q=(0,y.useRef)(null),le=(0,y.useRef)(null),A=x.get(""),Ee=A?.status==="ready",Ne=(0,y.useCallback)((u,m,b)=>{T.open(u,m,b),b||re({path:u,line:m,absolute:b})},[T]),ee=(0,y.useCallback)(async(u,m,b)=>{B.current.get(u)?.abort();let L=new AbortController;B.current.set(u,L),w(q=>new Map(q).set(u,ho()));try{let q=await b.list(m,ze(u),L.signal);if(L.signal.aborted||l.current!==m)return!1;let F=Qe(q);if(!F.ok)return w(U=>new Map(U).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:F.message})),!1;let te=We(F.listing.entries);return w(U=>new Map(U).set(u,{status:"ready",nodes:te,truncated:F.listing.truncated===!0,total:F.listing.entries.length})),!0}catch(q){return L.signal.aborted||w(F=>new Map(F).set(u,{status:"failed",nodes:[],truncated:!1,total:0,message:zn(q)})),!1}finally{B.current.get(u)===L&&B.current.delete(u)}},[]);(0,y.useEffect)(()=>{for(let u of B.current.values())u.abort();return B.current.clear(),w(new Map),$(new Set),re(void 0),ge.current=void 0,i!==void 0&&s!==void 0&&ee("",i,s),()=>{for(let u of B.current.values())u.abort();B.current.clear()}},[i,s,J,ee]),(0,y.useEffect)(()=>{if(i===void 0||f===void 0){R(void 0),D(void 0),p(void 0);return}let u=!0,m=new AbortController;return R(void 0),D(void 0),p(void 0),Promise.resolve().then(()=>f.snapshot({sessionId:i,maxCommits:1},m.signal)).then(b=>{if(!u)return;let L=et(b);if(!L.ok){R(void 0),D(void 0),p(void 0);return}R(Zt(Me(L.status),L.stats)),D(L.head),p(L.root)}).catch(()=>{u&&(R(void 0),D(void 0),p(void 0))}),()=>{u=!1,m.abort()}},[i,f,J]),(0,y.useEffect)(()=>{let u=s?.read;if(i===void 0||s===void 0||typeof u!="function"||!Ee){P(Vn);return}let m=i,b=new AbortController,L=async(F,te)=>{try{let U=wo(await u.call(s,m,te,{},b.signal));return U===void 0?void 0:[F,U]}catch{return}},q=tn.filter(F=>F!==".gitmodules").map(F=>L(F,F));return _!==void 0&&q.push(L(".gitmodules",`${_.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(q).then(F=>{if(b.signal.aborted||l.current!==m)return;let te=new Map;for(let ie of F)ie!==void 0&&te.set(ie[0],ie[1]);let U=N.current.get(""),ir=new Set(U?.status==="ready"?U.nodes.filter(ie=>ie.kind==="directory").map(ie=>ie.name):[]);P(je(te,ir))}),()=>b.abort()},[i,s,Ee,_,J]),(0,y.useEffect)(()=>{let u=c.viewRequest;if(u==null||u.view!==O)return;let m=`${u.view}:${u.focus}`;ge.current!==m&&(ge.current=m,be(u.focus,{open:Ne}),c.completeViewRequest?.())},[c.viewRequest,c.completeViewRequest,Ne]),(0,y.useEffect)(()=>{let u=e.viewFocus;if(u===void 0||i===void 0)return;let m=()=>{let b=u.take(O);b!==void 0&&be(b,{open:Ne})};return m(),u.subscribe(m)},[e,i,Ne]),(0,y.useEffect)(()=>{if(H===void 0||i===void 0||s===void 0||!Ee)return;let u=!0,m=H.path.split("/").filter(Boolean),b=[],L="";for(let F of m.slice(0,-1))L=ve(L,F),b.push(L);return b.length>0&&$(F=>new Set([...F,...b])),(async()=>{for(let F of b){if(N.current.get(F)?.status==="ready")continue;let te=await ee(F,i,s);if(!u||!te)return}u&&(T.open(H.path,H.line,H.absolute),re(void 0))})(),()=>{u=!1}},[H,i,s,Ee,ee,T]);let Dt=(0,y.useCallback)(()=>{if(typeof document>"u")return!1;let u=document.querySelector("[data-composer-input]");return u===null?!1:(u.focus(),!0)},[]),Yn=(0,y.useCallback)(u=>{if(u.button!==0||le.current!==null||bo())return;let m=Q.current?.previousElementSibling;if(m instanceof HTMLElement){try{u.currentTarget.setPointerCapture(u.pointerId)}catch{return}le.current={pointerId:u.pointerId,startX:u.clientX,baseWidth:m.getBoundingClientRect().width},document.body.classList.add("fx-pane-resizing")}},[]),Zn=(0,y.useCallback)(u=>{let m=le.current;m===null||m.pointerId!==u.pointerId||I(Lt(m.baseWidth+u.clientX-m.startX))},[]),ot=(0,y.useCallback)(u=>{let m=le.current;if(m===null||m.pointerId!==u.pointerId)return;le.current=null,document.body.classList.remove("fx-pane-resizing");try{u.currentTarget.releasePointerCapture(u.pointerId)}catch{}let b=m.baseWidth+u.clientX-m.startX;Math.round(b)!==Math.round(m.baseWidth)&&I(Fn(oe,b))},[oe]),Jn=(0,y.useCallback)(()=>{En(oe),I(null)},[oe]);(0,y.useEffect)(()=>()=>{le.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let u=m=>{if(!(m.isComposing||fn(m.target))){for(let b of Ke)if(un(m,b)){if(b.action==="closePanel"&&T.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),b.action==="nextPanel"?T.next():b.action==="previousPanel"?T.previous():T.close();return}}};return document.addEventListener("keydown",u,!0),()=>document.removeEventListener("keydown",u,!0)},[T]),(0,y.useEffect)(()=>{if(typeof document>"u")return;let u=Ve({focusComposer:Dt,hasModal:()=>pn(document)}),m=b=>u(b);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Dt]);let Qn=(0,y.useMemo)(()=>Oe(x,j,k,S),[x,j,k,S]),me=k===void 0?void 0:Object.keys(k).length,er=k===void 0?"neutral":Object.values(k).some(u=>u.status==="conflicted")?"conflict":me===0?"success":"warning",zt=Yt(M),tr=(0,y.useCallback)(u=>{if(i===void 0||s===void 0)return;if(j.has(u)){$(b=>{let L=new Set(b);return L.delete(u),L});return}$(b=>new Set(b).add(u));let m=x.get(u);(m===void 0||m.status==="failed")&&ee(u,i,s)},[j,x,i,s,ee]),_t=(0,y.useCallback)(u=>{i===void 0||s===void 0||ee(u,i,s)},[i,s,ee]),nr=()=>$(new Set),rr=()=>Fe(u=>u+1),or=i===void 0?"no-session":s===void 0?"no-service":A===void 0||A.status==="loading"?"loading":A.status==="failed"?"failed":A.nodes.length===0?"empty":"tree";return(0,g.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":or,"data-session":i??"","data-testid":"fs-explorer-view",children:[(0,g.jsxs)("header",{className:"fx-head",children:[(0,g.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,g.jsx)(Wt,{open:!0})}),(0,g.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,g.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,g.jsxs)("div",{className:"fx-head-meta",children:[A?.status==="ready"?(0,g.jsxs)("span",{children:[(0,g.jsx)("b",{children:A.nodes.length})," ",n("head.entries")]}):null,(0,g.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:j.size===0,onClick:nr,children:(0,g.jsx)($n,{})}),(0,g.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:i===void 0||s===void 0||A?.status==="loading",onClick:rr,children:(0,g.jsx)(Bn,{})})]})]}),(0,g.jsx)("div",{className:"fx-main",children:i===void 0?(0,g.jsx)(tt,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,g.jsx)(tt,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):A===void 0||A.status==="loading"?(0,g.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):A.status==="failed"?(0,g.jsx)(tt,{title:n("state.failed.title"),description:A.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>_t(""),testId:"fs-failed"}):A.nodes.length===0?(0,g.jsx)(tt,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("div",{className:"fx-tree-pane",style:G===null?void 0:{"--fx-tree-width":`${G}px`},children:(0,g.jsx)(Kn,{rows:Qn,selectedPath:Te,t:n,onToggle:tr,onSelect:u=>T.open(u),onRetry:_t})}),(0,g.jsx)("div",{ref:Q,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":n("pane.resize"),title:n("pane.resizeHint"),"data-testid":"fs-pane-handle",onPointerDown:Yn,onPointerMove:Zn,onPointerUp:ot,onPointerCancel:ot,onLostPointerCapture:ot,onDoubleClick:Jn}),(0,g.jsxs)("div",{className:"fx-editor",children:[(0,g.jsx)(Nn,{panels:K.panels,active:K.active,t:n,onActivate:u=>T.activate(u),onClose:u=>T.close(u),onStep:u=>u===1?T.next():T.previous()}),(0,g.jsx)("div",{className:"fx-editor-body",children:K.panels.length===0?(0,g.jsx)(Ln,{t:n}):K.panels.map((u,m)=>{let b=u.path===K.active;return(0,g.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!b,"data-line":u.line,"data-testid":"fs-panel",children:(0,g.jsx)(On,{sessionId:i,files:s,path:u.path,t:n,visible:b})},u.path)})})]})]})}),A?.status==="ready"?(0,g.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,g.jsxs)("span",{children:[n("view.scope")," ",(0,g.jsx)("b",{children:A.nodes.length})," ",n("head.entries")]}),A.truncated?(0,g.jsx)("span",{className:"fx-foot-warn",children:he({entries:A.nodes,truncated:!0,total:A.total}).label}):null,(0,g.jsxs)("span",{className:"fx-foot-git","data-state":me===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,g.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":er,"aria-hidden":"true"}),me===void 0?n("status.unavailable"):me===0?n("status.clean"):n("status.summary").replace("{count}",String(me))]}),zt===null?null:(0,g.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:n("foot.branch"),children:[zt,M?.upstream!==void 0&&(M.ahead??0)>0?(0,g.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(M.ahead)}`}):null,M?.upstream!==void 0&&(M.behind??0)>0?(0,g.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(M.behind)}`}):null]}),(0,g.jsx)("span",{className:"fx-spacer"}),(0,g.jsx)("span",{children:n("foot.order")})]}):null]})}return d}var Gn=["slots","locale","workbench","remote"];function So(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"en"}var nt,rt;function qn(e){let t=e.workbench;if(t==null)return()=>{};nt?.();let n=e.locale.register(Le,{zh:ht,en:vt});nt=n;let r=e.locale.bind(Le),o=Cn(typeof document>"u"?void 0:document),a=Hn({workbench:t,version:t.version,t:r,files:An(e),status:_n(e)});rt?.();let d=xt(e,t);return rt=d,e.slots.inject(st,()=>e.slots.register({name:st,id:O,order:100,label:()=>bt(So(e)),locale:Le},a)),()=>{d(),rt===d&&(rt=void 0),o(),n(),nt===n&&(nt=void 0)}}var Un={buildTree:We,describeListing:he,iconFor:ce,computeTreeWindow:De,flattenTree:Oe,badgeFor:ue,formatSize:Be,joinPath:ve,listingPath:ze,parseFocus:_e,consumeViewRequest:be,createPanelStack:kt,createEscapeHandler:Ve,KEYMAP:Ke,tabLabel:bt,normalizeListing:Qe,normalizeStatusSnapshot:et,buildWorkspaceMap:je,workspaceTagFor:Ae,parseStatusZ:Me,statusTone:xe,statusBadge:Ie,createPreviewLoader:qe,renderMarkdown:He,languageFor:Se,isMarkdownFile:Ge,describePage:Ue,classifyPreviewFailure:Pe,normalizePreviewPage:Tt,previewChunkRoute:kn,canBridgeFile:$e,decideBridge:mt,focusForFileAddress:gt,forwardFocus:yt,registerAddressBridge:xt},Xn={name:"dsh-fs-explorer",inject:Gn,apply:qn,__test:Un};var Po=Xn;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
