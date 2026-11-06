window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var xr=Object.defineProperty;var Os=Object.getOwnPropertyDescriptor;var Ws=Object.getOwnPropertyNames;var $s=Object.prototype.hasOwnProperty;var zs=(e,n)=>{for(var t in n)xr(e,t,{get:n[t],enumerable:!0})},Ks=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ws(n))!$s.call(e,o)&&o!==t&&xr(e,o,{get:()=>n[o],enumerable:!(r=Os(n,o))||r.enumerable});return e};var js=e=>Ks(xr({},"__esModule",{value:!0}),e);var Cu={};zs(Cu,{__test:()=>rs,apply:()=>ts,boot:()=>Su,clientPlugin:()=>os,default:()=>Ru,inject:()=>es});module.exports=js(Cu);var Cn=require("react");var Do="dsh-resource://file/";function Oo(e){try{return decodeURIComponent(e)}catch{return e}}function Bn(e){if(!e.startsWith(Do))return null;let n=e.slice(Do.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Oo(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(Oo).join("/")}}function _e(e){return e.slice(e.lastIndexOf("/")+1)}var Wo=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function $o(){return Wo.flatMap(e=>[...e.extensions])}function An(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Wo.find(o=>o.extensions.includes(r))?.family??null}var be="dsh-fs-explorer",hr="conversation.view",xe="fs-explorer";var Dn="fs-explorer",zo="fsExplorerDocuments",Ko="fsExplorerWorkspace",jo="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function _o(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var kr={chunk:"client.preview.js"},ut={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};function Ho(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function ct(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=Ho(t);r===""||r==="."||n.add(r)}return n}function ft(e,n){if(n===void 0||n.size===0)return!1;let t=Ho(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var _s={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Hs={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Gs=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Vo(e){return typeof e=="string"&&Gs.has(e)}function Go(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Vs(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function pt(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Go(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",c=a.rest;if(c===""||l.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[c]={status:"renamed"};continue}n[c]={status:Vs(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=Go(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function On(e){return Vo(e)?_s[e]:"neutral"}function mt(e){return Vo(e)?Hs[e]:"?"}function br(e){return`status.${e}`}function yt(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function qo(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Uo(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Xo(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var qs=["conflicted","deleted","renamed","added","modified","untracked"];function Us(e){return On(qs.find(n=>e.has(n))??"modified")}function Yo(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,c="";for(let s=0;s<l;s+=1){let u=a[s];if(u===void 0||u==="")continue;c=c===""?u:`${c}/${u}`;let p=n.get(c);p===void 0?n.set(c,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Us(o.present)});return t}var Jo=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],ei=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Xs(e){return ei.test(e)?e.slice(0,e.indexOf("/")):null}function Ys(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Zs(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Ys(i[2]??"");a!==""&&ei.test(a)&&t.push(a)}return t}function Qs(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let c=/^path\s*=\s*(.*)$/u.exec(a);c!==null&&(t=(c[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Zo(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Qo(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function gt(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of Qs(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of Zs(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=Zo(a);if(l!==void 0){let c=l.workspaces,s=c!==null&&typeof c=="object"&&!Array.isArray(c)?c.packages:void 0;for(let u of Qo(Array.isArray(c)?c:s))o.add(u)}}for(let l of["turbo.json","lerna.json"]){let c=e.get(l);if(typeof c!="string")continue;let s=Zo(c);if(s!==void 0)for(let u of Qo(s.packages))o.add(u)}for(let l of o){let c=Xs(l);c!==null&&n.has(c)&&t.set(l,"package")}return t}function xt(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Js=new Set([".git"]);function ed(e){return Js.has(e)}function nd(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function ht(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||ed(r))continue;let o=nd(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var td=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),rd=new Set(["md","mdx","markdown","mdown","rst","adoc"]),od=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),id=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),ad=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),sd=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),dd=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function ni(e){let n=_e(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function wn(e,n="file"){if(n==="directory")return"folder";let t=_e(e.toLowerCase());if(dd.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=ni(t);return r===""?"file":td.has(r)?"code":rd.has(r)?"markdown":od.has(r)?"data":id.has(r)?"image":ad.has(r)?"style":sd.has(r)?"archive":"file"}var ld={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},ud={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Sn(e){let n=_e(e.toLowerCase()),t=ld[n];if(t!==void 0)return t;let r=ni(n),o=ud[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function Wn(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${jo} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function kt(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,c=Math.min(Math.max(l,0),a),s=Math.min(e.length,c+i+o*2);return{rows:e.slice(c,s),startIndex:c,endIndex:s}}function wr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function bt(e){return e===""?".":e}function vt(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Rn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function $n(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Rn(r,o),t.push(r);return t}function vr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function wt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let c=vr(t[2]),s=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return s===""||c<1?void 0:{path:s,line:c,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let c=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return c===""?void 0:{path:c,line:1,absolute:!1,reveal:!0}}let o=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(o!==null){let c=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return c===""?void 0:{path:c,line:vr(o[2]),absolute:!0}}let i=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(i===null)return;let l=(i[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(l!=="")return{path:l,line:vr(i[2]),absolute:!1}}function ti(e){return e.selectionMoved?!0:e.cursorPath===void 0}function ri(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function St(e,n,t,r,o){let i=[],a=Yo(t),l=o?.showIgnored===!1,c=o?.hiddenLabel??_o,s=(u,p)=>{let y=e.get(u);if(y===void 0||y.status!=="ready")return;let v=0;for(let f of y.nodes){let b=Rn(u,f.name),x=f.kind==="directory",q=ft(b,o?.ignored);if(q&&l){v+=1;continue}let K=x&&n.has(b),Z=x||t===void 0?void 0:t[b],P=Z?.status??(x?void 0:yt(b,t)),D=Z===void 0?void 0:qo(Z),L=x?a.get(b):void 0,O=x?xt(r,b):void 0;if(i.push({type:"entry",path:b,name:f.name,kind:f.kind,depth:p,expanded:K,...f.size===void 0?{}:{size:f.size},...P===void 0?{}:{status:P},...L===void 0?{}:{statusCount:L.count,statusTone:L.tone},...D===void 0?{}:{diff:D},...O===void 0?{}:{tag:O},...q?{ignored:!0}:{}}),!K)continue;let B=e.get(b);if(B===void 0||B.status==="loading"){i.push({type:"status",key:`${b}:loading`,path:b,depth:p+1,state:"loading"});continue}if(B.status==="failed"){i.push({type:"status",key:`${b}:failed`,path:b,depth:p+1,state:"failed",message:B.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(B.nodes.length===0){i.push({type:"status",key:`${b}:empty`,path:b,depth:p+1,state:"empty"});continue}s(b,p+1),B.truncated&&i.push({type:"status",key:`${b}:truncated`,path:b,depth:p+1,state:"truncated",label:Wn({entries:B.nodes,truncated:!0,total:B.total}).label})}v>0&&y.nodes.length===v&&i.push({type:"status",key:`${u}:hidden`,path:u,depth:p,state:"empty",label:c(v)})};return s("",0),i}var cd=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function fd(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function pd(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&cd.has(fd(n.path)))}function oi(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=pd(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function Rt(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Sr="dsh-fs-explorer:bridge",md="fs-explorer-bridge",di="dsh-resource://file/**",Rr="sidebar.right.pane.tab",yd=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),gd=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),xd=new Set(["makefile","dockerfile","license","readme","changelog"]),hd=new Set([...$o(),...yd]);function kd(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function Ct(e){if(typeof e!="string"||e==="")return!1;let n=_e(e).toLowerCase();if(n==="")return!1;let t=kd(n);return gd.has(t)?!1:xd.has(n)?!0:hd.has(t)}function bd(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function vd(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function Er(e,n){if(typeof e!="string")return;let t=Bn(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=vd(n,bd(e));return`${vt(r)?"abs:":"path:"}${r}:${String(o)}`}function Pr(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=Bn(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Ct(r.path))return{action:"keep",reason:"refused"};let o=Er(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function He(e,n){n===void 0?console.warn(`[${be}] ${e}`):console.warn(`[${be}] ${e}`,n)}function wd(e){console.debug(`[${be}] ${e}`)}function Cr(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function Tr(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ln(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function ii(e){return ln(()=>e.sidebarRightTabs,Cr)??ln(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Cr)}function ai(e){return ln(()=>e.sidebarRight,Tr)??ln(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,Tr)}function si(e){return typeof e=="function"?e:()=>{}}var Sd="dsh-resource://file/session/probe/src/main.ts";function Rd(e){let n=ln(()=>(typeof e.candidates=="function"?e.candidates(Sd):[]).filter(r=>r.priority==="extension"&&r.id!==Sr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&He(`another extension-band tab type already claims ${di}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Cd(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Td(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Ed(e,n){let t=e.viewFocus;if(t?.request?.(xe,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(xe,n);return(!r.opened||r.focused)&&t?.take(xe),r}return typeof e.openView=="function"&&e.openView(xe,n)?(t?.take(xe),{opened:!0,focused:!0}):(t?.take(xe),{opened:!1,focused:!1})}function Fr(e,n,t,r){let o;try{o=Ed(e,r)}catch(i){return He("the file workbench threw while switching views",i),e.viewFocus?.take(xe),!1}if(!o.opened)return He(`the file workbench did not switch to ${xe}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return He("the forwarded tab could not be closed",i),!1}}function Pd(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=Cd(i),c=Td(i),s=(0,Cn.useRef)(void 0);return(0,Cn.useEffect)(()=>{if(a===void 0){He("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let u=Pr(l,e.currentSessionId(),c);if(u.action!=="open"){He(`left the forwarded tab standing (${u.reason})`,l);return}Fr(e,n,a,u.focus)},[a,l,c]),null}return function(o){return typeof o.useTabInfo!="function"?(He(`the host did not inject useTabInfo into ${Rr}; the bridge cannot forward`),null):(0,Cn.createElement)(t,{useTabInfo:o.useTabInfo})}}function Nr(e,n){let t=(l,c)=>{if(l===void 0||c===void 0)return;Rd(l);let s;try{s=l.register({id:Sr,kind:md,patterns:[di],priority:"extension",canOpen:y=>{let v=Bn(y);return v!==null&&Ct(v.path)},title:y=>_e(Bn(y)?.path??y)||y})}catch(y){He("the sidebar right refused the address bridge tab type",y);return}let u=Pd(n,c),p;try{p=si(e.slots.inject(Rr,()=>e.slots.register({name:Rr,key:Sr},u)))}catch(y){s(),He("the sidebar right refused the address bridge body",y);return}return()=>{p(),s()}},r=ii(e),o=ai(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return wd("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let c=ln(()=>l.get?.("sidebarRightTabs"),Cr)??ii(l),s=ln(()=>l.get?.("sidebarRight"),Tr)??ai(l);return t(c,s)});return si(a)}var Mr={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u9875\u67E5\u627E","preview.find.hint":"\u672C\u9875","preview.find.none":"\u672C\u9875\u65E0\u5339\u914D","preview.find.count":"\u672C\u9875 {index}/{count}","preview.find.scope":"\u67E5\u627E\u8303\u56F4\u53EA\u6709\u5F53\u524D\u9875","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Ir={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in this page","preview.find.hint":"This page","preview.find.none":"No match on this page","preview.find.count":"{index}/{count} on this page","preview.find.scope":"The search covers the current page only","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Lr(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?Mr:Ir)["tab.label"]??"Files"}var Fd=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function he(e){return e!==null&&typeof e=="object"}function Et(e,n){return{ok:!1,code:e,message:n}}function Pt(e){let n=he(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Et(t,r)}function Br(){return Et("invalid-response","the document service answered an invalid response")}function Tt(e){try{return e()}catch{return}}function Nd(e){let n=he(e)?e:void 0;if(n===void 0)return Br();if(n.ok===!1)return Pt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0)return Br();if(r.ok===!1)return Pt(r.error);let o=he(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Br():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function Md(e){let n=he(e)?e:void 0;if(n===void 0)return li();if(n.ok===!1)return Pt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0)return li();if(r.ok===!1)return Pt(r.error);let o=he(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function li(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Ar(e){return he(e)&&typeof e.open=="function"}function Id(e){let n=Tt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=he(n)?n.rpc:void 0;if(!(!he(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${zo}/${r}`,o,i)}function Ld(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function Bd(e){let n=he(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=he(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=he(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function ui(e,n){let t=Or(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return Bd(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function Or(e){return()=>{let n=Tt(()=>e.fsExplorerDocuments);if(Ar(n))return n;let t=Tt(()=>he(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Ar(t))return t;let r=Tt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Ar(r))return r;let o=Id(e);if(o!==void 0)return Ld(o)}}function ci(e){let n=Or(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Et("unavailable","the document service is unavailable");try{return Nd(await i.open({sessionId:t,path:r},o))}catch(a){return Et("io-error",a instanceof Error?a.message:String(a))}}}function fi(e){let n=Or(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return Md(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function pi(e){let n=new Map,t=new Set,r=0,o=(l,c)=>`${l}\0${c}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,c)=>n.get(o(l,c))?.session;return{acquire(l,c){let s=o(l,c),u=n.get(s);return u===void 0&&(u={session:new Dr(l,c,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,u),i()),u.session.retain(),u.session},peek(l,c){return a(l,c)?.getSnapshot()},find:a,forget(l,c){n.get(o(l,c))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var Dr=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=Fd;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Ft=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function Ad(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function mi(e,n,t=Ad()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function yi(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function Dd(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Nt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function Mt(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&Dd(n),e.onClose?.()}}function gi(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function It(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Lt(e){try{return e()}catch{return}}function xi(e){return()=>{let n=Lt(()=>e.fileReferences);if(It(n))return n;let t=Lt(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(It(t))return t;let r=Lt(()=>e.remote?.fileReferences);if(It(r))return r;let o=Lt(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return It(o)?o:void 0}}function hi(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function ki(e){let n=e.trim();return n===""?void 0:n}function Wr(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?yt(i,n):void 0,c=Od(i);t.push({type:"entry",path:i,name:gi(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...c===""?{}:{directory:c}})}return t}function Od(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function zn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:Rn(t,o.name),kind:o.kind});return n}function bi(e,n){let t=n.toLowerCase();return e.filter(r=>gi(r.path).toLowerCase().includes(t))}function vi(e){return $n(e)}var Tn=require("react");function At(e){let n=_e(e);return n===""?e:n}function Bt(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var Wd=Object.freeze({panels:Object.freeze([]),active:null});function wi(e,n){return n===void 0?e:`git\0${n}\0${e}`}var $d=/^git:([0-9a-f]{4,64}):(.+)$/iu;function $r(){let e=[],n=null,t=Wd,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(u=>u.key===s),a=s=>e.findIndex(u=>u.revision===void 0&&u.key===s),l=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let u=$d.exec(s);if(u!==null){let v=(u[1]??"").toLowerCase(),f=Bt(u[2]??"",!1);if(f===void 0)return;let b=wi(f,v);return i(b)>=0?b:void 0}let p=Bt(s,!0);if(p===void 0)return;if(a(p)>=0)return p;let y=Bt(s,!1);if(!(y===void 0||y===p))return a(y)>=0?y:void 0},c=s=>{if(e.length===0)return;let u=n===null?-1:i(n),p=e[(u+s+e.length)%e.length];p===void 0||p.key===n||(n=p.key,o())};return{open(s,u=1,p=!1,y){let v=Bt(s,p);if(v===void 0)return;let f=typeof y=="string"&&y.trim()!==""?y.trim().toLowerCase():void 0,b=wi(v,f),x=Number.isFinite(u)&&u>0?Math.trunc(u):1,q=i(b);if(q>=0){let P=e[q],D=P!==void 0&&(P.line!==x||P.absolute!==p);if(D&&(e=e.map((L,O)=>O===q?{...L,line:x,absolute:p}:L)),n===b){D&&o();return}n=b,o();return}let K=n===null?e.length:i(n)+1,Z={key:b,path:v,line:x,absolute:p,...f===void 0?{}:{revision:f}};e=[...e.slice(0,K),Z,...e.slice(K)],n=b,o()},close(s){let u=s===void 0?n:l(s)??null;if(u===null)return;let p=i(u);p<0||(e=e.filter(y=>y.key!==u),n===u&&(n=(e[p]??e[p-1])?.key??null),o())},activate(s){let u=l(s);u===void 0||i(u)<0||n===u||(n=u,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let u=l(s);return u!==void 0&&i(u)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function Si(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=$r();return e.set(t,o),o}}}function Dt(e,n){let t=wt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var V=require("react/jsx-runtime"),zr={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},zd=()=>()=>{},Kd=()=>"";function jd(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Ri({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:l}){let c=(0,Tn.useRef)(null);(0,Tn.useEffect)(()=>{c.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let s=(0,Tn.useSyncExternalStore)(a?.subscribe??zd,()=>jd(a,l,e).join("\0"),Kd),u=new Set(s===""?[]:s.split("\0"));if(e.length===0)return null;let p=y=>{if(y.key==="ArrowRight"||y.key==="ArrowLeft"){y.preventDefault(),y.stopPropagation(),i(y.key==="ArrowRight"?1:-1);return}(y.key==="Delete"||y.key==="Backspace")&&n!==null&&(y.preventDefault(),y.stopPropagation(),o(n))};return(0,V.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:p,"data-testid":"fs-tabs",children:e.map((y,v)=>{let f=y.key===n,b=At(y.path),x=t("panel.close").replace("{name}",b);return(0,V.jsxs)("div",{className:"fx-tab","data-active":f?"true":"false","data-dirty":u.has(y.path)?"true":"false",role:"presentation",children:[(0,V.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${v}`,"aria-controls":`fx-panel-${v}`,"aria-selected":f,tabIndex:f?0:-1,title:y.path,"data-testid":"fs-tab","data-path":y.path,"data-key":y.key,ref:f?c:void 0,onClick:()=>r(y.key),children:[(0,V.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":wn(y.path),"aria-hidden":"true",children:Sn(y.path)}),(0,V.jsx)("span",{className:"fx-tab-name",children:b}),y.revision===void 0?null:(0,V.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:y.revision,children:y.revision.slice(0,7)}),u.has(y.path)?(0,V.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,V.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:f?0:-1,"aria-label":x,title:x,"data-testid":"fs-tab-close",onClick:()=>o(y.key),children:"\xD7"})]},y.key)})})}function Ci({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,V.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,V.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,V.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,V.jsx)("span",{className:"fx-spacer"}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,V.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function _d(){return(0,V.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,V.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,V.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,V.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Ti({t:e}){return(0,V.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,V.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,V.jsx)(_d,{})}),(0,V.jsx)("strong",{children:e("panel.empty.title")}),(0,V.jsx)("span",{children:e("panel.empty.description")}),(0,V.jsxs)("span",{className:"fx-empty-keys",children:[(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,V.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,V.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Ei=require("react");function de(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Ei.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Hd(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Gd=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function un(e){let n=[],t=0;for(let r of e.matchAll(Gd)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(de("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(de("strong",null,...un(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(de("del",null,...un(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(de("em",null,...un(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,c=a===null?void 0:Hd(a[2]??"");n.push(c===void 0?l:de("a",{href:c,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Pi=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Fi=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Ni=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,Kr=/^\s{0,3}>\s?(.*)$/u,jr=/^\s{0,3}[-*+]\s+(.*)$/u,_r=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Vd(e){return Pi.test(e)||Fi.test(e)||Ni.test(e)||Kr.test(e)||jr.test(e)||_r.test(e)}function Mi(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Pi.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),u=o[2]??"",p=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)p.push(e[t]??""),t+=1;t+=1,n.push(de("pre",null,de("code",u===""?null:{className:`language-${u}`},p.join(`
`))));continue}let i=Fi.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(de(`h${String(s)}`,null,...un(i[2]??""))),t+=1;continue}if(Ni.test(r)){n.push(de("hr",null)),t+=1;continue}if(Kr.test(r)){let s=[];for(;t<e.length;){let u=Kr.exec(e[t]??"");if(u===null)break;s.push(u[1]??""),t+=1}n.push(de("blockquote",null,...Mi(s)));continue}if(jr.exec(r)!==null){let s=[];for(;t<e.length;){let u=jr.exec(e[t]??"");if(u===null)break;s.push(de("li",null,...un(u[1]??""))),t+=1}n.push(de("ul",null,...s));continue}if(_r.exec(r)!==null){let s=[];for(;t<e.length;){let u=_r.exec(e[t]??"");if(u===null)break;s.push(de("li",null,...un(u[1]??""))),t+=1}n.push(de("ol",null,...s));continue}let c=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||Vd(s))break;c.push(s.trim()),t+=1}n.push(de("p",null,...un(c.join(" "))))}return n}function Ot(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return de("div",{className:"fx-md"},...Mi(n))}var Hr=200,qd={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function _n(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":qd[t.slice(r+1)]??"plaintext"}function Hn(e){return _n(e)==="markdown"}var pe=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function Kn(e){return e!==null&&typeof e=="object"}function Ud(e){return e===""?0:e.split(`
`).length}function En(e,n){if(!Kn(e))throw new pe("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let u=Kn(e.error)?e.error:{},p=typeof u.code=="string"?u.code:"preview/unknown",y=typeof u.message=="string"?u.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",v=Kn(u.details)?u.details:{},f=typeof v.kind=="string"?v.kind:"";throw new pe(p,y,f)}let t=e.ok===!0?e.value:e;if(!Kn(t)||typeof t.text!="string")throw new pe("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Ud(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,c=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...c===void 0?{}:{linkTarget:c}};return o===void 0?s:{...s,totalLines:o}}function cn(e){let n=Kn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var jn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Wt({files:e,maxLines:n=Hr}){let t=Math.max(1,Math.trunc(n)),r=jn,o=0,i=null,a=[1],l=new Set,c=u=>{r=u;for(let p of l)p()},s=async(u,p)=>{o+=1;let y=o;i?.abort();let v=new AbortController;i=v,c({status:"loading",path:u,text:r.path===u?r.text:"",offset:p,lines:r.path===u?r.lines:0,...r.path===u&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===u&&r.source!==void 0?{source:r.source}:{},eof:r.path===u?r.eof:!1});try{let f=await e.read(u,p>1?{offset:p,limit:t}:{limit:t},v.signal);if(y!==o)return;let b=En(f,p);if(b.lines===0&&p>1){c({...r,status:"ready",eof:!0,text:"",lines:0});return}let x={status:"ready",path:u,text:b.text,offset:b.offset,lines:b.lines,eof:b.eof,...b.source===void 0?{}:{source:b.source},...b.linkTarget===void 0?{}:{linkTarget:b.linkTarget,linkPath:u}};c(b.totalLines===void 0?x:{...x,totalLines:b.totalLines})}catch(f){if(y!==o||v.signal.aborted)return;c({status:"failed",path:u,text:"",offset:p,lines:0,eof:!1,failure:cn(f)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(u){return l.add(u),()=>{l.delete(u)}},async open(u){a=[1],await s(u,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let u=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&u>r.totalLines||(a.push(u),await s(r.path,u))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let u=a[a.length-1]??1;await s(r.path,u)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],c(jn)}}}function $t(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Gr=Object.freeze({chunk:kr.chunk,id:`${be}/${kr.chunk}`}),Vr=null,Gn=null,zt=new Map;function Ii(e){Vr=e}function Li(){return Gr}function Xd(e){let n=ut[e];return{chunk:n,id:`${be}/${n}`}}function qr(){if(Gn!==null)return Gn;let e=Vr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${be}: the loader require was not handed over`));let n=e.async(`./${Gr.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${be}: chunk ${Gr.id} is missing its preview renderers`);return r});return Gn=n,n.catch(()=>{Gn===n&&(Gn=null)}),n}function Bi(e){let n=zt.get(e);if(n!==void 0)return n;let t=Vr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${be}: the loader require was not handed over`));let r=Xd(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${be}: chunk ${r.id} is not the ${e} view`);return a});return zt.set(e,o),o.catch(()=>{zt.get(e)===o&&zt.delete(e)}),o}var Ai=Object.freeze({}),Yd="@deepseek-ai/dsh-client-ui-primitives",Xr=null,Ur;function Di(e){Xr=e}function Zd(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function Kt(){if(Ur!=null)return Ur;if(Xr===null)return Ai;let e=Zd(Xr,Yd);if(e===void 0)return Ai;let n=u=>{let p=e[u];if(typeof p=="function"||typeof p=="object"&&p!==null)return p},t=u=>{let p=e[u];return typeof p=="function"?p:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let c=n("IconChevronDownOutlineRegular");c!==void 0&&(r.IconChevronDownOutlineRegular=c);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var A=require("react");async function fn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var _t=require("react");function Qd(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function jt(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(Qd(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function Oi(e,n,t){return n<=0?0:((e+t)%n+n)%n}function Wi(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function Yr(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function $i(e){let n=t=>jt(e.text(),t);return{count:t=>n(t).length,reveal:(t,r)=>{let o=n(t)[r];o!==void 0&&e.select(o.from,o.to)},clear:e.clear}}var Jd=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),el=new Set(["SCRIPT","STYLE","TEMPLATE"]);function nl(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let s=i.data;if(s==="")continue;let u=n.at(-1);u===void 0?n.push([s]):u.push(s),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(el.has(l))continue;if(l==="BR"){n.push([]);continue}let c=Jd.has(l);c&&n.push([]),r(a),c&&n.push([])}};return r(e),{layout:Wi(n),nodes:t}}function zi(e){let n=()=>{let r=e();return r===null?void 0:nl(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{count:r=>{let o=n();return o===void 0?0:jt(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=jt(i.layout.text,r)[o];if(l===void 0)return;let c=Yr(i.layout,l.from),s=Yr(i.layout,l.to);if(c===void 0||s===void 0)return;let u=i.nodes[c.node],p=i.nodes[s.node];if(u===void 0||p===void 0)return;let y=a.ownerDocument.createRange();try{y.setStart(u,Math.min(c.offset,u.data.length)),y.setEnd(p,Math.min(s.offset,p.data.length))}catch{return}let v=t();v!==void 0&&(v.removeAllRanges(),v.addRange(y));let f=y.startContainer.parentElement;f!==null&&typeof f.scrollIntoView=="function"&&f.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var Zr=(0,_t.createContext)(null);function Ki(){return(0,_t.useContext)(Zr)}var Ge=require("react/jsx-runtime");function tl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function rl(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Qr({failure:e,t:n,onRetry:t}){return(0,Ge.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Ge.jsx)("strong",{children:tl(e,n)}),(0,Ge.jsx)("span",{children:rl(e,n)}),e.message===""?null:(0,Ge.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Ge.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function Jr({t:e}){return(0,Ge.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Ge.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var ve=require("react");var Je=require("react/jsx-runtime");function ji({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,ve.useState)(""),[a,l]=(0,ve.useState)(0),[c,s]=(0,ve.useState)(0),u=(0,ve.useRef)(null);(0,ve.useEffect)(()=>{u.current?.focus()},[]),(0,ve.useEffect)(()=>{if(o===""){s(0),l(0);return}let b=n().count(o);s(b),l(x=>b===0?0:Math.min(x,b-1))},[o,t,n]),(0,ve.useEffect)(()=>{o===""||c===0||n().reveal(o,a)},[o,a,c,n]);let p=(0,ve.useCallback)(()=>{n().clear(),r()},[n,r]),y=(0,ve.useCallback)(b=>{c!==0&&l(x=>Oi(x,c,b))},[c]),v=b=>{if(!b.nativeEvent.isComposing){if(b.key==="Escape"){b.preventDefault(),b.stopPropagation(),p();return}if(b.key==="Enter"){b.preventDefault(),y(b.shiftKey?-1:1);return}(b.key==="ArrowDown"||b.key==="ArrowUp")&&b.stopPropagation()}},f=o===""?e("preview.find.hint"):c===0?e("preview.find.none"):e("preview.find.count").replace("{index}",String(a+1)).replace("{count}",String(c));return(0,Je.jsxs)("div",{className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:v,children:[(0,Je.jsx)("input",{ref:u,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:b=>{i(b.currentTarget.value),l(0)}}),(0,Je.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":c===0?"empty":"ready",title:e("preview.find.scope"),children:f}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:c===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>y(-1),children:"\u2191"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:c===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>y(1),children:"\u2193"}),(0,Je.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:p,children:"\xD7"})]})}var eo="fsExplorer",_i=1;function ol(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function il(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function al(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function sl(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Ht(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(il),families:[...i.match?.families??[]]}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=ol(i.path),l=An(i.path),c;for(let s of t.values())al(s,a,l)&&(c===void 0||sl(s.contribution,c.contribution))&&(c=s);return c?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Hi(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Gt(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function De(e){try{return e()}catch{return}}function Ce(e){return e!==null&&typeof e=="object"}function Xi(e){return()=>{let n=De(()=>e.workspaceFiles);if(Gt(n))return n;let t=De(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Gt(t))return t;let r=De(()=>e.remote?.workspaceFiles);if(Gt(r))return r;let o=De(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Gt(o))return o}}function Yi(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function Zi(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return En(i,r.offset??1),i}catch(s){if(!(s instanceof pe)||cn(s).kind!=="symlink")throw s;a=s}let l=await n(t,o);if(l===void 0)throw a;return{...En(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function Gi(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function dl(e){let n=De(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ce(n)?n.rpc:void 0;if(!Ce(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function Qi(e){return()=>{let n=De(()=>e.remote?.gitExplorer);if(Gi(n))return n;let t=De(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return Gi(t)?t:dl(e)}}function ll(e){return e===""?0:e.split(`
`).length}function Vi(e){let n=Ce(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new pe(t,r)}function Ji(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Ce(l))throw new pe("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw Vi(l.error);let c=l;if(l.ok===!0&&(c=l.value),!Ce(c))throw new pe("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(c.ok===!1)throw Vi(c.error);let s=c;if(c.ok===!0&&(s=c.page),!Ce(s))throw new pe("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new pe("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new pe("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new pe("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let u=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):ll(s.text),p=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,y=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:u,offset:p,eof:s.eof===!0,...y===void 0?{}:{source:y}}}}}function ul(e){if(!Ce(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Ce(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function cl(e){let n=Ce(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Ce(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new pe(t,r,i)}function ro(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=ul(await n.call(e,t,r,{},o));if(!i.ok)throw cl(i.error);return i.value.data}}function Vn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function no(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Vt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Vn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?no(r.value):{ok:!1,message:Vn(r.error)}}return no(t)}return no(n)}function ea(e){return e instanceof Error?e.message:Vn(e)}function qi(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function fl(e){let n=De(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ce(n)?n.rpc:void 0;if(!Ce(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function na(e){return()=>{let n=fl(e);if(n!==void 0)return n;let t=De(()=>e.remote?.gitExplorer);if(qi(t))return t;let r=De(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(qi(r))return r}}function Ui(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function pl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=Ui(r.additions),i=Ui(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function ml(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function yl(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function to(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=pl(n.stats),r=ml(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=yl(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function qt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:Vn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?to(o.snapshot):{ok:!1,message:Vn(o.error)}}let r=e;return r.snapshot!==void 0?to(r.snapshot):to(t)}var E=require("react/jsx-runtime"),so={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},gl=()=>()=>{},ta=()=>{};function lo(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var oo={status:"idle"},xl=[".md",".mdx",".markdown",".mdown"],hl=-1e3;function ao({t:e,revision:n}){return(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,E.jsx)("strong",{children:e("preview.unavailable.title")}),(0,E.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function ra({chunk:e,text:n,path:t,offset:r}){let o=(0,A.useRef)(null),i=(0,A.useRef)(null),a=Ki(),l=(0,A.useRef)(n);l.current=n;let[c,s]=(0,A.useState)(!1),u=_n(t);return(0,A.useEffect)(()=>{s(!1)},[e,t]),(0,A.useEffect)(()=>{let p=o.current;if(!(e===null||p===null))try{let y=e.mountCodePreview(p,{text:n,language:u,path:t,offset:r});return i.current=y,()=>{y.destroy(),i.current=null}}catch{s(!0);return}},[e,t,u]),(0,A.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),(0,A.useEffect)(()=>{if(!(a===null||e===null||c))return a.register($i({text:()=>l.current,select:(p,y)=>i.current?.revealRange(p,y),clear:()=>i.current?.clearSelection()})),()=>a.register(null)},[a,e,c]),e===null||c?(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,E.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function kl({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&Hn(n)?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Ot(r)}):(0,E.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function bl(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,E.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,E.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,E.jsx)(ra,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function vl(e){function n({page:t,path:r}){return(0,E.jsx)(ra,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function wl({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,A.useMemo)(()=>{let c=ro(r);return c===void 0||t===void 0||a===void 0?c:async(s,u,p)=>{if(s!==t||u!==n)return c(s,u,p);let y=await a(u,p);return c(s,y?.absolutePath??u,p)}},[r,t,n,a]);return t===void 0||l===void 0?(0,E.jsx)(ao,{t:o}):(0,E.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function Sl(e){return{Body:n=>(0,E.jsx)(wl,{chunk:e,...n}),renderer:e.renderer}}function uo(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...xl]},priority:0,load:()=>qr().then(bl)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:hl,load:()=>qr().then(vl)},...Object.keys(ut).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Bi(e).then(Sl)}))]}var io;function Rl(){if(io!==void 0)return io;let e=Ht();for(let n of uo())e.register(n);return io=e,e}function oa({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:c,locate:s}){let u=(0,A.useMemo)(()=>{let $=r===void 0?Yi(n,e):o===void 0||e===void 0?void 0:Ji(o,e,r);return $===void 0||r!==void 0||s===void 0?$:Zi($,s)},[n,e,r,o,s]),p=(0,A.useMemo)(()=>r===void 0?ro(n):void 0,[n,r]),y=l??Rl(),v=t===void 0?null:An(t),f=v!==null,b=r===void 0&&e!==void 0&&p!==void 0?{sessionId:e,readFile:p}:null,[x,q]=(0,A.useState)(null),[K,Z]=(0,A.useState)(jn),[P,D]=(0,A.useState)(oo),[L,O]=(0,A.useState)(0),[B,oe]=(0,A.useState)(0),[ue,S]=(0,A.useState)("reading"),[T,M]=(0,A.useState)(!1),[N,_]=(0,A.useState)(!1),[h,F]=(0,A.useState)(void 0),[R,Y]=(0,A.useState)(!1),[Q,me]=(0,A.useState)(!1),Se=(0,A.useRef)(null),ce=(0,A.useRef)(null),fe=(0,A.useRef)(void 0),J=(0,A.useRef)(void 0),W=(0,A.useSyncExternalStore)(c?.subscribe??gl,()=>c===void 0||e===void 0||t===void 0?ta():c.peek(e,t),ta),X=c===void 0||e===void 0||t===void 0?void 0:c.find(e,t);if((0,A.useEffect)(()=>{if(u===void 0){q(null);return}let $=Wt({files:u,maxLines:Hr});return q($),()=>$.close()},[u]),(0,A.useEffect)(()=>{if(x===null){Z(jn);return}return Z(x.getSnapshot()),x.subscribe(()=>Z(x.getSnapshot()))},[x]),(0,A.useEffect)(()=>{x===null||t===void 0||v!==null||x.open(t)},[x,t,v]),(0,A.useEffect)(()=>{if(!f||t===void 0||s===void 0){F(void 0);return}let $=new AbortController,ke=!0;return(async()=>{let Ye=await s(t,$.signal);ke&&!$.signal.aborted&&F(Ye?.absolutePath)})(),()=>{ke=!1,$.abort()}},[f,t,s]),(0,A.useEffect)(()=>{S("reading"),M(!1),Y(!1)},[t]),(0,A.useEffect)(()=>()=>{fe.current!==void 0&&clearTimeout(fe.current),J.current!==void 0&&clearTimeout(J.current)},[]),(0,A.useEffect)(()=>{W?.conflict!==!0&&(_(!1),Y(!1),J.current!==void 0&&clearTimeout(J.current))},[W?.conflict]),(0,A.useEffect)(()=>y.subscribe(()=>O($=>$+1)),[y]),(0,A.useEffect)(()=>{if(t===void 0||r!==void 0){D(oo);return}let $=Hi(y,{path:t});if($===void 0){D(oo);return}let{contribution:ke}=$,Ye=!0;return D(Ke=>Ke.status==="ready"&&Ke.contribution.id===ke.id?Ke:{status:"loading",contribution:ke}),$.module.then(Ke=>{Ye&&D({status:"ready",contribution:ke,module:Ke})},Ke=>{Ye&&D({status:"failed",contribution:ke,failure:cn(Ke)})}),()=>{Ye=!1}},[y,t,r,L,B]),t===void 0)return(0,E.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,E.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,E.jsx)("strong",{children:i("preview.empty.title")}),(0,E.jsx)("span",{children:i("preview.empty.description")})]})});let $e=f&&r!==void 0,Le=$t(K),Pe=K.linkPath??t,Be=f?h:K.linkTarget,Ue=!f&&Hn(t),gn=f?!$e&&b!==null&&P.status!=="ready"&&P.status!=="failed":K.status==="loading",nn=K.status==="ready",ye=Ue&&ue==="reading",tn=f?$e||b===null?"unavailable":P.status==="failed"?"failed":P.status==="ready"?"ready":"loading":K.status,ge=P.status==="ready"?P.module.renderer??P.contribution.id:f?"pending":ye?"fallback":"plain",H=(0,A.useMemo)(()=>zi(()=>Se.current),[]),ze=(0,A.useMemo)(()=>()=>ce.current??H,[H]),et=(0,A.useMemo)(()=>({register:$=>{ce.current=$}}),[]),rn=[Pe,String(ue),K.offset,K.text.length,ge].join("|"),xn=!f&&nn,on={path:Be??t,sessionId:e,files:n,t:i,visible:a,mode:ue,...f?{}:{page:{text:K.text,offset:K.offset}},...s===void 0?{}:{locate:s}},ir=()=>{fn(Be??Pe).then($=>{$&&(M(!0),fe.current!==void 0&&clearTimeout(fe.current),fe.current=setTimeout(()=>M(!1),1400))})},Ae=()=>{let $=X?.copyDraft();$!==void 0&&fn($).then(ke=>{ke&&(_(!0),J.current!==void 0&&clearTimeout(J.current),J.current=setTimeout(()=>_(!1),1400))})},Xe=W?.error,Nn=Xe!=null&&W?.conflict!==!0,Fe=W?.conflict===!0,Re=W?.discarded??null,nt=!Fe&&Re!==null&&W?.dirty!==!0&&Re!==W?.text,ae;if(f){let $=P.status==="ready"?P.module.Body:void 0;ae=$e?(0,E.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,E.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,E.jsx)("span",{children:i("preview.commitBinary.description")})]}):b===null?(0,E.jsx)(ao,{t:i,revision:r}):P.status==="failed"?(0,E.jsx)(Qr,{failure:P.failure,t:i,onRetry:()=>oe(ke=>ke+1)}):$===void 0?(0,E.jsx)(Jr,{t:i}):(0,E.jsx)($,{...on})}else if(u===void 0)ae=(0,E.jsx)(ao,{t:i,revision:r});else if(K.status==="failed")ae=(0,E.jsx)(Qr,{failure:K.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{x?.retry()}});else if(!nn)ae=(0,E.jsx)(Jr,{t:i});else{let $=P.status==="ready"?P.module.Body:kl;ae=(0,E.jsx)($,{...on})}return(0,E.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":tn,"data-mode":f?"binary":ye?"reading":"code","data-renderer":ge,children:[(0,E.jsxs)("header",{className:"fx-preview-bar",children:[(0,E.jsxs)("span",{className:"fx-preview-path",title:Be===void 0?Pe:`${Pe} \u2192 ${Be}`,"data-testid":"fs-preview-path",...Be===void 0?{}:{"data-link":"followed"},children:[Pe,Be===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",Be]})]}),f?null:(0,E.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[Le.range,Le.range==="\u2014"?null:(0,E.jsxs)(E.Fragment,{children:[" ",i("preview.lines")]}),Le.total===void 0?null:(0,E.jsxs)("span",{className:"fx-preview-total",children:[" / ",Le.total," ",i("preview.lines")]})]}),(0,E.jsxs)("div",{className:"fx-preview-actions",children:[W===void 0?null:(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!W.dirty||W.saving||W.status!=="ready",onClick:()=>{X?.save()},children:W.saving?i("preview.saving"):i("preview.save")}),Ue?(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>S($=>$==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(ue==="reading"?"preview.source":"preview.reading")}):null,f?null:(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!nn||gn||K.offset<=1,onClick:()=>{x?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,E.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!nn||gn||K.eof,onClick:()=>{x?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),xn?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":Q?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":Q,onClick:()=>me($=>!$),children:i("preview.find")}):null,(0,E.jsx)("button",{type:"button",className:"fx-pbtn",onClick:ir,"data-testid":"fs-preview-copy",children:i(T?"preview.copied":"preview.copyPath")}),gn?(0,E.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),Q&&xn?(0,E.jsx)(ji,{t:i,surface:ze,stamp:rn,onClose:()=>me(!1)}):null,K.source==="first-parent"?(0,E.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,Fe||nt?(0,E.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":Fe?"conflict":"discarded",children:[(0,E.jsx)("strong",{children:i(Fe?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,E.jsx)("span",{className:"fx-conflict-hint",children:i(Fe?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,E.jsx)("span",{className:"fx-spacer"}),Fe?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":R?"discard":void 0,onClick:()=>{if(!R&&W?.dirty===!0){Y(!0);return}Y(!1),X?.reload({force:!0})},children:i(R?"preview.conflict.discard":"preview.conflict.reload")}):null,nt?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{Re!==null&&X?.setDraft(Re)},children:i("preview.conflict.restore")}):null,Fe?(0,E.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Ae,children:i(N?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Nn?(0,E.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",lo(Xe?.code??"io-error",Xe?.message??"",i))}):null,(0,E.jsx)("div",{className:"fx-preview-body","data-scroll":ye?"y":"none",ref:Se,children:(0,E.jsx)(Zr.Provider,{value:et,children:ae})})]})}var ia="dsh-fs-explorer-styles",Cl=`
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
`;function aa(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${ia}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=ia,t.textContent=Cl,e.head.appendChild(t),()=>{t.remove()}}var g=require("react");var ie={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark"};function sa(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function Tl(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function da(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,c=[{id:ie.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:ie.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return c;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,u={id:ie.reveal,label:n(Tl(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},p={id:ie.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},y={id:ie.copyRelative,label:n("menu.copy.relative")},v=e.remoteLinks,f=v!==void 0&&v.length>0?{id:ie.copyRemote,label:n("menu.copy.remote"),submenu:v.map(b=>({id:b.id,label:b.label}))}:{id:ie.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...c,u,{id:"menu.copy",label:n("menu.copy"),submenu:[p,y]},f,{id:ie.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}var Oe=require("react");var we=require("react/jsx-runtime");function El(e){return new DOMRect(e.x,e.y,0,0)}function la(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,we.jsxs)(we.Fragment,{children:[e.label,(0,we.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function ua({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=Kt();if(i.Menu!==void 0){let a=i.Menu;return(0,we.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:la(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(c=>({id:c.id,label:la(c),...c.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>El(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,we.jsx)(Pl,{entries:e,anchor:n,onSelect:t,onClose:r})}function Pl({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,Oe.useRef)(null),[i,a]=(0,Oe.useState)(null),[l,c]=(0,Oe.useState)({left:n.x,top:n.y});(0,Oe.useEffect)(()=>{let u=o.current;if(u===null)return;let p=8,y=u.offsetWidth,v=u.offsetHeight,f=Math.min(Math.max(n.x,p),Math.max(p,window.innerWidth-y-p)),b=Math.min(Math.max(n.y,p),Math.max(p,window.innerHeight-v-p));c({left:f,top:b})},[n.x,n.y]),(0,Oe.useEffect)(()=>{let u=y=>{y.target instanceof Node&&o.current?.contains(y.target)!==!0&&r()},p=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("pointerdown",u),document.addEventListener("keydown",p,!0),()=>{document.removeEventListener("pointerdown",u),document.removeEventListener("keydown",p,!0)}},[r]);let s=(0,Oe.useCallback)(u=>{if(u.disabled!==!0){if(u.submenu!==void 0){a(p=>p===u.id?null:u.id);return}t(u.id)}},[t]);return(0,we.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:u=>u.preventDefault(),children:e.map(u=>(0,we.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,we.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":u.id,disabled:u.disabled===!0&&u.reason===void 0,"aria-disabled":u.disabled===!0?!0:void 0,"aria-haspopup":u.submenu===void 0?void 0:"menu","aria-expanded":u.submenu===void 0?void 0:i===u.id,title:u.disabled===!0?u.reason:void 0,onClick:()=>s(u),children:u.label}),u.submenu===void 0||i!==u.id?null:(0,we.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:u.submenu.map(p=>(0,we.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":p.id,disabled:p.disabled===!0&&p.reason===void 0,"aria-disabled":p.disabled===!0?!0:void 0,title:p.disabled===!0?p.reason:void 0,onClick:()=>s(p),children:p.label},p.id))})]},u.id))})}var le=require("react"),j=require("react/jsx-runtime"),Fl=120,co=280,Ut=8;function Xt(e){let n=typeof window>"u"?e:window.innerWidth-co;return Math.max(Ut,Math.min(e,Math.max(Ut,n)))}function Nl(e,n){if(e===void 0)return{left:Ut,top:Ut};if(n<=1)return{left:Xt(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+co<=window.innerWidth;return{left:Xt(r?t:e.left-co-4),top:e.top}}function ca(){return(0,j.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,j.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function fa({node:e,t:n,onOpen:t}){return(0,j.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,j.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function pa({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:c}){let[s,u]=(0,le.useState)([]),p=(0,le.useRef)(null),[y,v]=(0,le.useState)(null),[f,b]=(0,le.useState)(null),x=(0,le.useCallback)(()=>{p.current!==null&&(clearTimeout(p.current),p.current=null)},[]),q=(0,le.useCallback)(()=>{x(),u([])},[x]),K=(0,le.useCallback)(()=>{x(),p.current=setTimeout(()=>{p.current=null,u([])},Fl)},[x]);(0,le.useEffect)(()=>()=>{p.current!==null&&clearTimeout(p.current)},[]),(0,le.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let S=T=>{T.key!=="Escape"||T.isComposing||(T.preventDefault(),T.stopPropagation(),q())};return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[q,s.length]);let Z=(0,le.useCallback)((S,T,M)=>{x();let{left:N,top:_}=Nl(M?.getBoundingClientRect(),T);u(h=>{let F=h.slice(0,T);return F.length===T&&F[T-1]?.groupId===S?h:[...F,{groupId:S,left:N,top:_,depth:T}]})},[x]),P=(0,le.useCallback)(S=>{q(),S.kind==="file"?t(S.path):S.kind==="folder"&&r(S.path)},[q,t,r]),D=S=>{let T,M=N=>{for(let _ of N)_.kind==="group"&&(_.id===S&&(T=_),M(_.children))};return M(e.roots),T},L=S=>{let T=(M,N)=>{if(M.some(_=>_.id===S))return{parentId:N,siblings:M};for(let _ of M){if(_.kind!=="group")continue;let h=T(_.children,_.id);if(h!==void 0)return h}};return T(e.roots,null)??{parentId:null,siblings:[]}},O=(S,T)=>{let M=T?.getBoundingClientRect(),{parentId:N,siblings:_}=L(S.id);v({node:S,parentId:N,siblings:_,left:Xt(M?.left??0),top:(M?.bottom??0)+4})},B=(S,T)=>{let{parentId:M,siblings:N}=L(S.id);v({node:S,parentId:M,siblings:N,left:Xt(T.clientX),top:T.clientY})},oe=(S,T)=>{let{parentId:M,siblings:N}=L(S.id),_=N.map(Q=>Q.id),h=_.indexOf(S.id),F=h+T;if(h<0||F<0||F>=_.length)return;let R=[..._],[Y]=R.splice(h,1);Y!==void 0&&(R.splice(F,0,Y),v(null),c?.(M,R))},ue=S=>{let T=f;if(b(null),T===null||T===S)return;let M=e.roots.map(R=>R.id),N=M.indexOf(T),_=M.indexOf(S);if(N<0||_<0)return;let h=[...M],[F]=h.splice(N,1);F!==void 0&&(h.splice(_,0,F),c?.(null,h))};return(0,le.useEffect)(()=>{if(y===null||typeof document>"u")return;let S=M=>{M.target instanceof Node&&(M.target instanceof Element&&M.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||v(null))},T=M=>{M.key!=="Escape"||M.isComposing||(M.preventDefault(),M.stopPropagation(),v(null))};return document.addEventListener("pointerdown",S),document.addEventListener("keydown",T,!0),()=>{document.removeEventListener("pointerdown",S),document.removeEventListener("keydown",T,!0)}},[y]),(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,j.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(S=>(0,j.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":f===S.id?"true":void 0,draggable:!0,onDragStart:()=>b(S.id),onDragEnd:()=>b(null),onDragOver:T=>T.preventDefault(),onDrop:T=>{T.preventDefault(),ue(S.id)},children:[S.kind==="group"?(0,j.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(T=>T.groupId===S.id),title:n("bookmarks.group"),onPointerEnter:T=>Z(S.id,1,T.currentTarget),onFocus:T=>Z(S.id,1,T.currentTarget),onPointerLeave:K,onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),B(S,T)},children:[(0,j.jsx)("span",{className:"fx-bookmark-name",children:S.name}),(0,j.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,j.jsx)(ca,{})})]}):(0,j.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":S.kind,title:S.path,onClick:()=>P(S),onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),B(S,T)},children:(0,j.jsx)("span",{className:"fx-bookmark-name",children:S.name})}),(0,j.jsx)(fa,{node:S,t:n,onOpen:O})]},S.id))}),y===null?null:(0,j.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:y.left,top:y.top},children:[(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{v(null),i?.(y.node)},children:n("bookmarks.rename")}),(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{v(null),a?.(y.node)},children:n("bookmarks.remove")}),(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:y.siblings[0]?.id===y.node.id,onClick:()=>oe(y.node,-1),children:n("bookmarks.moveUp")}),(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:y.siblings[y.siblings.length-1]?.id===y.node.id,onClick:()=>oe(y.node,1),children:n("bookmarks.moveDown")}),(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{v(null),l?.(y.node)},children:n("bookmarks.moveToGroup")})]}),s.map(S=>{let T=D(S.groupId);return T===void 0?null:(0,j.jsxs)("div",{className:S.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":S.depth,role:"menu","aria-label":T.name,style:{left:S.left,top:S.top},onPointerEnter:x,onPointerLeave:K,children:[T.children.length===0?null:T.children.map(M=>(0,j.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[M.kind==="group"?(0,j.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(N=>N.groupId===M.id),onPointerEnter:N=>Z(M.id,S.depth+1,N.currentTarget),onFocus:N=>Z(M.id,S.depth+1,N.currentTarget),onContextMenu:N=>{N.preventDefault(),N.stopPropagation(),B(M,N)},children:[(0,j.jsx)("span",{className:"fx-bookmark-name",children:M.name}),(0,j.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,j.jsx)(ca,{})})]}):(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":M.kind,role:"menuitem",title:M.path,onClick:()=>P(M),onContextMenu:N=>{N.preventDefault(),N.stopPropagation(),B(M,N)},children:(0,j.jsx)("span",{className:"fx-bookmark-name",children:M.name})}),(0,j.jsx)(fa,{node:M,t:n,onOpen:O})]},M.id)),(0,j.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(q(),o(T.id))},children:n("bookmarks.newGroup")})]},T.id)})]})}var Me=require("react");var Ml="dsh_fs_explorer",Il="bookmarks";function Te(e){throw new Error(`bookmarks: ${e}`)}function ma(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Yt(e,n,t){typeof e!="string"&&Te(`${n} must be a string`);let r=e.trim();return r===""&&Te(`${n} must not be empty`),r.length>t&&Te(`${n} must be at most ${String(t)} characters`),r}function ya(e,n,t,r){t>32&&Te(`${n} is nested deeper than ${String(32)} levels`),ma(e)||Te(`${n} must be an object`);let o=Yt(e.id,`${n}.id`,200);r.has(o)&&Te(`duplicate id "${o}" at ${n}`),r.add(o);let i=Yt(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&Te(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let c=e.children;return Array.isArray(c)||Te(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:c.map((s,u)=>ya(s,`${n}.children[${String(u)}]`,t+1,r))}}if(l==="file"||l==="folder"){let c=Yt(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:c}}return Te(`${n}.kind must be "group", "file" or "folder"`)}function Pn(e){ma(e)||Te("a bookmark tree must be an object"),e.version!==1&&Te(`version must be 1, received ${JSON.stringify(e.version)}`);let n=Yt(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||Te("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>ya(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var Oc={name:Ml,version:1,invalidRecords:"backup-and-skip",tables:{[Il]:{valueSchema:{parse:Pn}}}};function re(e){throw new Error(`bookmarks: ${e}`)}function pn(e){return{version:1,roots:[],updatedAt:e}}function qn(e,n){let t=n.name.trim();if(t===""&&re("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&re(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function Ll(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function xa(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,xa(r,n+1)),n)}function ha(e,n){let t=Ll(e,n.id);t!==0&&xa(n,t)>32&&re(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function fo(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&fo(r.children,n,r.id)}function Ve(e,n){let t;return fo(e.roots,r=>{r.id===n&&(t=r)}),t}function ka(e,n){let t;return fo(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function ba(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&ba(t,n))}function po(e,n){if(n===null)return e.roots;let t=Ve(e,n);return t===void 0&&re(`no group with id "${n}"`),t.kind!=="group"&&re(`"${n}" is not a group`),t.children}function va(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function Fn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:Fn(r.children,n,t)})}function Un(e,n,t){return{version:1,roots:n,updatedAt:t}}var Xn=()=>new Date().toISOString();function Yn(e,n,t,r,o=Xn){let i=po(e,n);Ve(e,t.id)!==void 0&&re(`a node with id "${t.id}" already exists`);let a=va(r,i.length),l=Fn(e.roots,n,s=>[...s.slice(0,a),t,...s.slice(a)]),c=Un(e,l,o());return ha(c,t),c}function wa(e,n,t=Xn){let r=Ve(e,n);r===void 0&&re(`no node with id "${n}"`);let o=ka(e,n);o===void 0&&re(`no node with id "${n}"`);let i=Fn(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:Un(e,i,t()),removed:r}}function Sa(e,n,t,r=Xn){let o=t.trim();o===""&&re("a node needs a non-empty name"),Ve(e,n)===void 0&&re(`no node with id "${n}"`);let i=a=>a.map(l=>{let c=l.id===n?{...l,name:o}:l;return c.kind==="group"?{...c,children:i(c.children)}:c});return Un(e,i(e.roots),r())}function Ra(e,n,t,r,o=Xn){let i=Ve(e,n);i===void 0&&re(`no node with id "${n}"`);let a=ka(e,n);if(a===void 0&&re(`no node with id "${n}"`),t!==null){let y=Ve(e,t);y===void 0&&re(`no group with id "${t}"`),y.kind!=="group"&&re(`"${t}" is not a group`),i.kind==="group"&&ba(i,t)&&re(`cannot move "${n}" into itself or its own descendant`)}let l=Fn(e.roots,a,y=>y.filter(v=>v.id!==n)),c=po({version:1,roots:l,updatedAt:e.updatedAt},t),s=va(r,c.length),u=Fn(l,t,y=>[...y.slice(0,s),i,...y.slice(s)]),p=Un(e,u,o());return ha(p,i),p}function Ca(e,n,t,r=Xn){let o=po(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&re(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||re(`"${s}" is not a child of ${n??"the root"}`);let l=new Map(o.map(s=>[s.id,s])),c=Fn(e.roots,n,()=>t.map(s=>{let u=l.get(s);return u===void 0&&re(`"${s}" is not a child of ${n??"the root"}`),u}));return Un(e,c,r())}var We=require("react");var Ee=require("react/jsx-runtime"),Bl=200;function Al(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>Bl?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function Dl(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function Zn({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:c,submitKey:s}){let[u,p]=(0,We.useState)(()=>l??Dl(e)),[y,v]=(0,We.useState)(void 0),f=(0,We.useRef)(null),b=Kt();(0,We.useEffect)(()=>{l!==void 0&&(p(l),v(void 0))},[l]),(0,We.useEffect)(()=>{let D=f.current;D!==null&&(D.focus(),D.select())},[]);let x=(0,We.useCallback)(()=>{if(a)return;let D=Al(u,e);if(!D.ok){v(t(`prompt.error.${D.reason}`));return}v(void 0),r(D.name)},[a,e,r,t,u]),q=D=>{if(!D.nativeEvent.isComposing){if(D.key==="Escape"){D.preventDefault(),D.stopPropagation(),o();return}D.key==="Enter"&&(D.preventDefault(),x())}},K=y??i,Z=b.Input,P=c??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Ee.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(P),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:q,children:[(0,Ee.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Ee.jsx)("strong",{children:t(P)}),(0,Ee.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),Z===void 0?(0,Ee.jsx)("input",{ref:f,className:"fx-name-input",type:"text",value:u,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":K===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:D=>{p(D.target.value),v(void 0)}}):(0,Ee.jsx)(Z,{ref:f,className:"fx-name-input",value:u,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":K===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:D=>{p(D.target.value),v(void 0)}}),K===void 0?null:(0,Ee.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:K}),(0,Ee.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:x,children:t(s??"prompt.submit")})]})]})}var ee=require("react/jsx-runtime");function Ta(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function Ol(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function Ea({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,c]=(0,Me.useState)(null),[s,u]=(0,Me.useState)(e),[p,y]=(0,Me.useState)(!1),[v,f]=(0,Me.useState)(void 0),b=(0,Me.useRef)(null);(0,Me.useEffect)(()=>{let L=B=>{B.target instanceof Node&&b.current?.contains(B.target)!==!0&&a()},O=B=>{B.key!=="Escape"||B.isComposing||p||(B.preventDefault(),B.stopPropagation(),a())};return document.addEventListener("pointerdown",L),document.addEventListener("keydown",O,!0),()=>{document.removeEventListener("pointerdown",L),document.removeEventListener("keydown",O,!0)}},[p,a]);let x=()=>(l===null?s.roots:Ve(s,l)?.kind==="group"?Ve(s,l).children:[]).filter(O=>O.kind==="group"),q=(0,Me.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(Ra(s,o.id,l));return}if(n===void 0)return;let L=qn(n.kind==="directory"?"folder":"file",{id:Ta(),name:n.name,path:n.path,createdAt:Date.now()});i(Yn(s,l,L))}catch(L){f(L instanceof Error?L.message:String(L))}},[l,s,r,o,i,n]),K=L=>{try{let O=qn("group",{id:Ta(),name:L,createdAt:Date.now()}),B=Yn(s,l,O);u(B),y(!1),f(void 0),c(O.id)}catch(O){f(O instanceof Error?O.message:String(O))}},Z=Ol(s,l),P=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),D=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,ee.jsxs)("div",{ref:b,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":P,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,ee.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,ee.jsx)("strong",{children:P}),r==="add"&&n!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,ee.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,ee.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(null),children:t("bookmarks.picker.root")}),Z.map(L=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>c(L.id),children:L.name},L.id))]}),(0,ee.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:x().length===0?(0,ee.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):x().map(L=>(0,ee.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>c(L.id),children:(0,ee.jsx)("span",{className:"fx-bookmark-name",children:L.name})},L.id))}),v===void 0?null:(0,ee.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:v}),p?(0,ee.jsx)(Zn,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:K,onCancel:()=>y(!1)}):(0,ee.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>y(!0),children:t("bookmarks.newGroup")}),(0,ee.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:q,children:D})]})]})}function mo(e){return`dsh-fs-explorer.bookmarks.${e}`}function yo(e){return`${mo(e)}.pending`}function Zt(){try{return globalThis.localStorage??void 0}catch{return}}function Pa(e){let n=Zt();if(n===void 0)return;let t;try{t=n.getItem(mo(e))}catch{return}if(t!==null)try{return Pn(JSON.parse(t))}catch{return}}function Wl(e,n){let t=Zt();if(t!==void 0)try{t.setItem(mo(e),JSON.stringify(n)),t.setItem(yo(e),"1")}catch{}}function $l(e){let n=Zt();if(n===void 0)return!1;try{return n.getItem(yo(e))==="1"}catch{return!1}}function Fa(e){let n=Zt();if(n!==void 0)try{n.removeItem(yo(e))}catch{}}function Na(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(Fa(n),r.tree):$l(n)?Pa(n)??pn(new Date().toISOString()):pn(new Date().toISOString())}catch{}return Pa(n)??pn(new Date().toISOString())},async save(n,t){let r=Pn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){Fa(n);return}}catch{}Wl(n,r)}}}var go="fs-explorer.treePaneWidth";function xo(e){return Math.min(520,Math.max(180,e))}function Ia(e){if(e==null)return null;let n;try{n=e.getItem(go)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Qt(e,n){let t=Math.round(xo(n));if(e!=null)try{e.setItem(go,String(t))}catch{}return t}function La(e){if(e!=null)try{e.removeItem(go)}catch{}}function Ba(e,n){return Math.round(e)===Math.round(n)}var Ma=16;function Aa(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ma};case"ArrowRight":return{kind:"nudge",delta:Ma};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var U=require("react");function Oa(e,n,t,r=800){return t-n<=r?e:""}function Wa(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function $a(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:zl(e,t+1,r.depth,r.depth+1)}function zl(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var Kl=/^.$/u;function za(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!Kl.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Da(e.names,n),l=a.find(c=>c>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=Da(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Da(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var I=require("react/jsx-runtime"),qe=22;function ho({open:e=!0,size:n=14}){return(0,I.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,I.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,I.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function jl(){return(0,I.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,I.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Ka(){return(0,I.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,I.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,I.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function ja(){return(0,I.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,I.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,I.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function _a(){return(0,I.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,I.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function _l({name:e}){return(0,I.jsx)("span",{className:"fx-badge","data-icon":wn(e),"aria-hidden":"true",children:Sn(e)})}function Hl({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:c}){let s=e.kind==="directory",u={top:r,paddingLeft:8+e.depth*12};return(0,I.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:u,onClick:()=>{l(e.path),s?i(e.path):a(e.path)},onContextMenu:p=>{p.preventDefault(),p.stopPropagation(),c(e,p)},children:[(0,I.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,I.jsx)(jl,{})}),s?(0,I.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,I.jsx)(ho,{open:e.expanded})}):(0,I.jsx)(_l,{name:e.name}),(0,I.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,I.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,I.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,I.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":On(e.status),"data-testid":"fx-file-status",title:o(br(e.status)),"aria-label":o(br(e.status)),children:mt(e.status)}),e.statusCount===void 0?null:(0,I.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,I.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,I.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,I.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,I.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,I.jsx)("span",{className:"fx-size",children:Rt(e.size)})]})}function Gl({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,I.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,I.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,I.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,I.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,I.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function Vl(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Ha({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:c,cursorRequest:s,onCursorMove:u}){let p=(0,U.useRef)(null),[y,v]=(0,U.useState)(0),[f,b]=(0,U.useState)(0),[x,q]=(0,U.useState)(void 0),K=(0,U.useRef)(void 0),Z=(0,U.useRef)({query:"",at:0}),P=(0,U.useRef)(void 0),D=(0,U.useRef)(void 0),L=(0,U.useRef)(x);L.current=x;let O=(0,U.useMemo)(()=>e.flatMap((h,F)=>h.type==="entry"?[F]:[]),[e]);(0,U.useEffect)(()=>{let h=D.current!==n;if(D.current=n,P.current!==void 0||n===void 0)return;let F=L.current===void 0?void 0:e[L.current];if(!ti({cursorPath:F?.type==="entry"?F.path:void 0,selectionMoved:h}))return;let R=e.findIndex(Y=>Y.type==="entry"&&Y.path===n);R>=0&&q(R)},[n,e]),(0,U.useEffect)(()=>{let h=P.current;if(h===void 0)return;let F=e.findIndex(Q=>Q.type==="entry"&&Q.path===h),R=e[F];if(R?.type!=="entry"||R.kind!=="directory"||!R.expanded){P.current=void 0;return}let Y=ri(e,h);Y!==void 0&&(P.current=void 0,q(Y))},[e]),(0,U.useEffect)(()=>{x!==void 0&&e[x]?.type!=="entry"&&q(void 0)},[e,x]),(0,U.useEffect)(()=>{let h=p.current;if(x===void 0||h===null)return;let F=wr({scrollTop:h.scrollTop,viewport:h.clientHeight,rowHeight:qe,index:x});F!==h.scrollTop&&(h.scrollTop=F)},[x]);let B=(0,U.useCallback)((h,F=!0)=>{q(h),F&&p.current?.focus({preventScroll:!0})},[]),oe=(0,U.useRef)(void 0);(0,U.useEffect)(()=>{if(s===void 0||oe.current===s.nonce)return;let h=O.at(-1);if(s.path!==void 0){let R=e.findIndex(Y=>Y.type==="entry"&&Y.path===s.path);oe.current=s.nonce,R>=0&&B(R,s.focus);return}if(s.delta===void 0){oe.current=s.nonce;return}if(oe.current=s.nonce,x===void 0){let R=s.delta>0?O[0]:h;R!==void 0&&B(R,s.focus);return}let F=s.delta>0?O.find(R=>R>x):[...O].reverse().find(R=>R<x);F!==void 0&&B(F,s.focus)},[s,x,O,B,e]),(0,U.useEffect)(()=>{if(u===void 0)return;let h=x===void 0?void 0:e[x];u(h?.type==="entry"?h.path:void 0)},[x,e,u]);let ue=(0,U.useCallback)(h=>{let F=e.findIndex(R=>R.type==="entry"&&R.path===h);F>=0&&q(F)},[e]),S=(0,U.useCallback)((h,F,R)=>{ue(h.path),c(h,F,R)},[ue,c]),T=(0,U.useCallback)(h=>{h.preventDefault(),c(void 0,{x:h.clientX,y:h.clientY},h.currentTarget)},[c]),M=(0,U.useCallback)(h=>{if(h.nativeEvent.isComposing||h.altKey||h.metaKey||h.ctrlKey)return;let F=O.at(-1);if(h.key==="ArrowDown"){if(h.preventDefault(),x===void 0){O[0]!==void 0&&B(O[0]);return}let W=O.find(X=>X>x);W!==void 0&&B(W);return}if(h.key==="ArrowUp"){if(h.preventDefault(),x===void 0){F!==void 0&&B(F);return}let W=[...O].reverse().find(X=>X<x);W!==void 0&&B(W);return}if(x===void 0)return;let R=e[x];if(R===void 0||R.type!=="entry")return;if(h.key==="ArrowRight"){if(h.preventDefault(),R.kind==="directory"&&!R.expanded)P.current=R.path,o(R.path);else{let W=O.find(X=>X>x);W!==void 0&&e[W]?.depth===R.depth+1&&B(W)}return}if(h.key==="ArrowLeft"){if(h.preventDefault(),R.kind==="directory"&&R.expanded)o(R.path);else{let W=[...O].reverse().find(X=>X<x&&e[X]?.type==="entry"&&e[X].depth<R.depth);W!==void 0&&B(W)}return}if(h.key==="Enter"&&R.kind!=="directory"){h.preventDefault(),i(R.path);return}if(h.key==="ContextMenu"||h.key==="F10"&&h.shiftKey){h.preventDefault();let W=p.current?.getBoundingClientRect(),X=W===void 0?0:W.top+x*qe-(p.current?.scrollTop??0);S(R,{x:W?.left??0,y:X+qe},p.current??void 0);return}if(h.key==="Home"){h.preventDefault(),O[0]!==void 0&&B(O[0]);return}if(h.key==="End"){h.preventDefault(),F!==void 0&&B(F);return}let Y=Date.now(),Q=Wa(e,x),me=$a(e,Q),Se=me.map(W=>{let X=e[W];return X?.type==="entry"?X.name:""}),ce=za({query:Oa(Z.current.query,Z.current.at,Y),key:h.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:h.nativeEvent.repeat,names:Se,active:x===void 0?-1:me.indexOf(x)});if(ce.kind==="clear"){Z.current={query:"",at:0};return}if(ce.kind!=="jump")return;let fe=me[ce.index];if(fe===void 0)return;let J=e[fe];J?.type==="entry"&&(Z.current={query:ce.query,at:Y},h.preventDefault(),B(fe),J.kind!=="directory"&&i(J.path))},[x,O,B,o,i,S,e]);(0,U.useEffect)(()=>{let h=p.current;if(h===null)return;let F=()=>b(h.clientHeight);if(F(),typeof ResizeObserver>"u")return;let R=new ResizeObserver(F);return R.observe(h),()=>R.disconnect()},[]),(0,U.useEffect)(()=>{if(n===void 0)return;let h=p.current;if(h===null)return;let F=e.findIndex(Y=>Y.type==="entry"&&Y.path===n);if(F<0)return;let R=F*qe;(R<h.scrollTop||R+qe>h.scrollTop+h.clientHeight)&&(h.scrollTop=Math.max(0,R-h.clientHeight/2))},[n,e]),(0,U.useEffect)(()=>{if(t===void 0||K.current===t)return;let h=p.current;if(h===null)return;let F=t.path===void 0?-1:e.findIndex(R=>R.type==="entry"&&R.path===t.path);if(!(t.path!==void 0&&F<0)){if(K.current=t,F>=0){let R=wr({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:qe,index:F});R!==h.scrollTop&&(h.scrollTop=R,v(R)),q(F)}Vl(h),l?.()}},[t,e,l]);let N=h=>{v(h.currentTarget.scrollTop)},_=kt(e,{scrollTop:y,height:f===0?480:f,rowHeight:qe});return(0,I.jsx)("div",{className:"fx-scroll",ref:p,onScroll:N,onKeyDown:M,onContextMenu:T,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,I.jsx)("div",{className:"fx-vlist",style:{height:e.length*qe},children:_.rows.map((h,F)=>{let R=(_.startIndex+F)*qe;return h.type==="entry"?(0,I.jsx)(Hl,{row:h,top:R,selected:h.path===n,cursor:x===_.startIndex+F,t:r,onToggle:o,onSelect:i,onRowActivate:ue,onContextMenu:(Y,Q)=>S(Y,{x:Q.clientX,y:Q.clientY},Q.currentTarget instanceof HTMLElement?Q.currentTarget:void 0)},h.path):(0,I.jsx)(Gl,{row:h,top:R,t:r,onRetry:a},h.key)})})})}var Qn=require("react"),en=require("react/jsx-runtime");function Ga({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:c,focusSignal:s}){let u=(0,Qn.useRef)(null),p=(0,Qn.useRef)(s);(0,Qn.useEffect)(()=>{p.current!==s&&(p.current=s,u.current?.focus())},[s]);let y=f=>{if(!f.nativeEvent.isComposing){if(f.key==="Escape"){f.preventDefault(),f.stopPropagation(),c();return}if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault(),a(f.key==="ArrowDown"?1:-1);return}f.key==="Enter"&&(f.preventDefault(),l())}},v=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,en.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:y,children:[(0,en.jsx)("input",{ref:u,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:f=>i(f.currentTarget.value)}),v===null?null:(0,en.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[v,o?(0,en.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,en.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,en.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:c,children:"\xD7"})]})}function Ie(e){return e!==null&&typeof e=="object"}function Jt(e){try{return e()}catch{return}}function ql(e){let n=Jt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ie(n)?n.rpc:void 0;if(!(!Ie(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Ko}/${r}`,o,i)}function Ul(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function ko(e){return Ie(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function Xl(e){return()=>{let n=ql(e);if(n!==void 0)return Ul(n);let t=Jt(()=>e.fsExplorerWorkspace);if(ko(t))return t;let r=Jt(()=>Ie(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(ko(r))return r;let o=Jt(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(ko(o))return o}}function mn(e){let n=Ie(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Ie(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Ie(t)?t:void 0}var Yl=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function yn(e){let n=Ie(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:Yl.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function Zl(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};let t=Ie(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function Ql(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};let t=Ie(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function Jl(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:{ok:!0}}function eu(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function nu(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Pn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function tu(e){let n=mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:yn(n.error)}:{ok:!0}}function ru(e){let n=mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:yn(n.error)};let t=Ie(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var Jn={code:"unsupported",message:"the workspace service is unavailable"};function Va(e){let n=Xl(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:Jn});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),Zl),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),Ql),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),Jl),create:(r,o,i,a,l)=>t(c=>{let s=c.create;return typeof s!="function"?{ok:!1,error:Jn}:s.call(c,{sessionId:r,parent:o,name:i,kind:a},l)},eu),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:Jn}:a.call(i,{sessionId:r},o)},nu),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:Jn}:l.call(a,{sessionId:r,tree:o},i)},tu),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:Jn}:a.call(i,{sessionId:r},o)},ru)}}var ou={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function iu(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var au={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function su(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let c=t[1]??"",s=qa(t[2]??"");return s===""?void 0:{base:`https://${c}/${s}`,host:c}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=qa(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function qa(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function du(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function lu(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return uu(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function uu(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function cu(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function Ua(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=cu(t,r);if(a===void 0)return[];let l=lu(i),c=du(a),s=[],u=new Set;for(let p of n){if(u.has(p.name))continue;let y=su(p.url);if(y===void 0)continue;u.add(p.name);let v=iu(y.host),f=au[v][o],b=c===""?"":`/${c}`;s.push({id:`copy.remote.${p.name}`,label:`${p.name} \xB7 ${ou[v]}`,url:`${y.base}/${f}/${l}${b}`})}return s}var C=require("react/jsx-runtime");function fu({open:e}){return(0,C.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,C.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,C.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function pu(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var mu=()=>({status:"loading",nodes:[],truncated:!1,total:0});function vo(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Za="dsh-fs-explorer.show-ignored";function yu(e){if(e==null)return!0;try{return e.getItem(Za)!=="0"}catch{return!0}}function gu(e,n){if(n!=null)try{n.setItem(Za,e?"1":"0")}catch{}}var xu=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Ya=new Map;function hu(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function er({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,C.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,C.jsx)("strong",{children:e}),n===void 0?null:(0,C.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function ku(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function Qa({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:c,workspace:s,fileReferences:u}){let p=Si();function y(v){let f=v.sessionId??e.currentSessionId(),b=(0,g.useRef)(f);b.current=f;let x=(0,g.useMemo)(()=>r(),[r]),q=(0,g.useMemo)(()=>o(),[o]),K=(0,g.useMemo)(()=>i(),[i]),Z=(0,g.useMemo)(()=>f===void 0||c===void 0?void 0:c(f),[c,f]),P=(0,g.useMemo)(()=>f===void 0||s===void 0?void 0:s(f),[s,f]),D=(0,g.useMemo)(()=>Na(P),[P]),[L,O]=(0,g.useState)(()=>pn(new Date().toISOString())),B=(0,g.useRef)(!1),[oe,ue]=(0,g.useState)(null),[S,T]=(0,g.useState)(null),M=(0,g.useRef)(!1),[N,_]=(0,g.useState)(null),[h,F]=(0,g.useState)(void 0),[R,Y]=(0,g.useState)(null),Q=(0,g.useRef)(null),[me,Se]=(0,g.useState)(null),[ce,fe]=(0,g.useState)(()=>new Map),[J,W]=(0,g.useState)(void 0),[X,$e]=(0,g.useState)(void 0),[Le,Pe]=(0,g.useState)(void 0),[Be,Ue]=(0,g.useState)(void 0),[gn,nn]=(0,g.useState)(Ya),ye=(0,g.useRef)(ce);ye.current=ce;let[tn,ge]=(0,g.useState)(()=>new Set),H=(0,g.useMemo)(()=>p.forSession(f),[p,f]),ze=(0,g.useSyncExternalStore)(H.subscribe,H.snapshot,H.snapshot),et=ze.panels.find(d=>d.key===ze.active),rn=et?.path,xn=et?.revision,[on,ir]=(0,g.useState)(0),Ae=(0,g.useRef)(new Map),Xe=(0,g.useRef)(void 0),[Nn,Fe]=(0,g.useState)([]),[Re,nt]=(0,g.useState)(()=>yu(vo())),[ae,$]=(0,g.useState)(null),[ke,Ye]=(0,g.useState)(!1),[Ke,hn]=(0,g.useState)(null),ar=(0,g.useRef)(null);ar.current=ae?.path??null;let Ze=(0,g.useMemo)(()=>vo(),[]),[an,kn]=(0,g.useState)(()=>Ia(Ze)),sr=(0,g.useRef)(null),bn=(0,g.useRef)(null),ne=ce.get(""),tt=ne?.status==="ready",Ro=(0,g.useCallback)((d,m,k,w)=>{H.open(d,m,k,w)},[H]),dr=(0,g.useCallback)(d=>{let m=d??H.snapshot().active??void 0;if(m===void 0)return;if((f===void 0?void 0:l?.peek(f,m))?.dirty===!0){hn(null),$({path:m});return}$(null),hn(null),f!==void 0&&l?.forget(f,m),H.close(m)},[l,f,H]),is=(0,g.useCallback)(()=>{let d=ae;if(d===null)return;let m=f===void 0?void 0:l?.find(f,d.path);if(m===void 0){$(null),f!==void 0&&l?.forget(f,d.path),H.close(d.path);return}Ye(!0),hn(null),m.save().then(k=>{if(Ye(!1),!k.ok){let w=m.getSnapshot().error;hn(t("panel.confirm.failed").replace("{message}",lo(k.code,w?.message??"",t)));return}$(null),f!==void 0&&l?.forget(f,d.path),H.close(d.path)})},[l,ae,f,H,t]),as=(0,g.useCallback)(()=>{let d=ae;$(null),hn(null),d!==null&&(f!==void 0&&l?.forget(f,d.path),H.close(d.path))},[l,ae,f,H]),lr=(0,g.useCallback)(()=>{$(null),hn(null)},[]),se=(0,g.useCallback)(async(d,m,k)=>{Ae.current.get(d)?.abort();let w=new AbortController;Ae.current.set(d,w),fe(z=>new Map(z).set(d,mu()));try{let z=await k.list(m,bt(d),w.signal);if(w.signal.aborted||b.current!==m)return!1;let G=Vt(z);if(!G.ok)return fe(je=>new Map(je).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:G.message})),!1;let Ne=ht(G.listing.entries);return fe(je=>new Map(je).set(d,{status:"ready",nodes:Ne,truncated:G.listing.truncated===!0,total:G.listing.entries.length})),!0}catch(z){return w.signal.aborted||fe(G=>new Map(G).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:ea(z)})),!1}finally{Ae.current.get(d)===w&&Ae.current.delete(d)}},[]);(0,g.useEffect)(()=>{for(let d of Ae.current.values())d.abort();return Ae.current.clear(),fe(new Map),ge(new Set),Xe.current=void 0,f!==void 0&&x!==void 0&&se("",f,x),()=>{for(let d of Ae.current.values())d.abort();Ae.current.clear()}},[f,x,on,se]),(0,g.useEffect)(()=>{if(f===void 0||q===void 0){W(void 0),$e(void 0),Pe(void 0),Ue(void 0);return}let d=!0,m=new AbortController;return W(void 0),$e(void 0),Pe(void 0),Ue(void 0),Promise.resolve().then(()=>q.snapshot({sessionId:f,maxCommits:1},m.signal)).then(k=>{if(!d)return;let w=qt(k);if(!w.ok){W(void 0),$e(void 0),Pe(void 0),Ue(void 0);return}W(Xo(pt(w.status),w.stats)),$e(w.head),Pe(w.root),Ue(w.remotes)}).catch(()=>{d&&(W(void 0),$e(void 0),Pe(void 0),Ue(void 0))}),()=>{d=!1,m.abort()}},[f,q,on]),(0,g.useEffect)(()=>{let d=x?.read;if(f===void 0||x===void 0||typeof d!="function"||!tt){nn(Ya);return}let m=f,k=new AbortController,w=async(G,Ne)=>{try{let je=hu(await d.call(x,m,Ne,{},k.signal));return je===void 0?void 0:[G,je]}catch{return}},z=Jo.filter(G=>G!==".gitmodules").map(G=>w(G,G));return Le!==void 0&&z.push(w(".gitmodules",`${Le.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(z).then(G=>{if(k.signal.aborted||b.current!==m)return;let Ne=new Map;for(let dn of G)dn!==void 0&&Ne.set(dn[0],dn[1]);let je=ye.current.get(""),Ds=new Set(je?.status==="ready"?je.nodes.filter(dn=>dn.kind==="directory").map(dn=>dn.name):[]);nn(gt(Ne,Ds))}),()=>k.abort()},[f,x,tt,Le,on]);let[ss,ds]=(0,g.useState)(void 0),ur=(0,g.useRef)(void 0),Co=(0,g.useRef)(0),cr=(0,g.useRef)(void 0),To=(0,g.useRef)(!1),Mn=(0,g.useCallback)((d,m,k)=>{Co.current+=1,ds({nonce:Co.current,...d===void 0?{}:{path:d},...m===void 0?{}:{delta:m},focus:k})},[]),vn=(0,g.useCallback)((d,m)=>{let k=vi(d);if(ge(w=>{let z=new Set(w);for(let G of k)z.add(G);return z}),!(f===void 0||x===void 0)){for(let w of k)ye.current.get(w)===void 0&&se(w,f,x);m==="directory"&&ye.current.get(d)===void 0&&se(d,f,x)}},[x,se,f]),Eo=(0,g.useCallback)(d=>{let m=zn(ye.current).find(k=>k.path===d);if(vn(d,m?.kind),m?.kind==="directory"&&ge(k=>new Set(k).add(d)),To.current=!0,m===void 0){cr.current=d;return}Mn(d,void 0,!0)},[Mn,vn]),rt=(0,g.useCallback)(d=>{Dt(d,{open:Ro,reveal:Eo})},[Ro,Eo]);(0,g.useEffect)(()=>{let d=v.viewRequest;if(d==null||d.view!==xe)return;let m=`${d.view}:${d.focus}`;Xe.current!==m&&(Xe.current=m,rt(d.focus),v.completeViewRequest?.())},[v.viewRequest,v.completeViewRequest,rt]),(0,g.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||f===void 0)return;let m=()=>{let k=d.take(xe);k!==void 0&&rt(k)};return m(),d.subscribe(m)},[e,f,rt]),(0,g.useEffect)(()=>{if(rn===void 0||xn!==void 0||!tt||vt(rn))return;let d=$n(rn);if(d.length===0||(ge(k=>d.every(w=>k.has(w))?k:new Set([...k,...d])),f===void 0||x===void 0))return;let m=d.filter(k=>ye.current.get(k)?.status!=="ready");m.length!==0&&Promise.all(m.map(k=>se(k,f,x)))},[rn,xn,tt,f,x,se]);let Po=(0,g.useCallback)(()=>{if(typeof document>"u")return!1;let d=document.querySelector("[data-composer-input]");return d===null?!1:(d.focus(),!0)},[]),ls=(0,g.useCallback)(d=>{if(d.button!==0||bn.current!==null||xu())return;let m=sr.current?.previousElementSibling;if(m instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}bn.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:an},document.body.classList.add("fx-pane-resizing")}},[an]),us=(0,g.useCallback)(d=>{let m=bn.current;m===null||m.pointerId!==d.pointerId||kn(xo(m.baseWidth+d.clientX-m.startX))},[]),fr=(0,g.useCallback)(d=>{let m=bn.current;if(m===null||m.pointerId!==d.pointerId)return;bn.current=null,document.body.classList.remove("fx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let k=m.baseWidth+d.clientX-m.startX;if(Ba(k,m.baseWidth)){kn(m.restWidth);return}kn(Qt(Ze,k))},[Ze]),pr=(0,g.useCallback)(()=>{La(Ze),kn(null)},[Ze]),cs=(0,g.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let m=Aa(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(m===null)return;if(d.preventDefault(),d.stopPropagation(),m.kind==="reset"){pr();return}if(m.kind==="min"||m.kind==="max"){let z=m.kind==="min"?180:520;kn(Qt(Ze,z));return}let k=sr.current?.previousElementSibling,w=k instanceof HTMLElement?k.getBoundingClientRect().width:an??180;kn(Qt(Ze,w+m.delta))},[Ze,pr,an]);(0,g.useEffect)(()=>()=>{bn.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=m=>{if(!(m.isComposing||yi(m.target))){if(ku(m)){let k=H.snapshot().active,w=k===null||l===void 0||f===void 0?void 0:l.find(f,k);if(w===void 0)return;m.preventDefault(),m.stopPropagation(),w.save();return}for(let k of Ft)if(mi(m,k)){if(k.action==="closePanel"&&H.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),k.action==="nextPanel"?H.next():k.action==="previousPanel"?H.previous():dr();return}}};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[l,dr,f,H]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=Mt({focusComposer:Po,hasModal:()=>ar.current!==null||M.current||Nt(document)}),m=k=>d(k);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[Po]),(0,g.useEffect)(()=>{if(ae===null||typeof document>"u")return;let d=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),lr())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[ae,lr]);let Fo=(0,g.useMemo)(()=>ct(Nn),[Nn]),ot=(0,g.useMemo)(()=>St(ce,tn,J,gn,{ignored:Fo,showIgnored:Re,hiddenLabel:d=>t("state.hiddenDirectory").replace("{count}",String(d))}),[ce,tn,J,gn,Fo,Re,t]),[Qe,No]=(0,g.useState)(""),[Mo,it]=(0,g.useState)([]),[Io,at]=(0,g.useState)(null),[fs,In]=(0,g.useState)(!1),[ps,ms]=(0,g.useState)(0),ys=(0,g.useCallback)(()=>ms(d=>d+1),[]);(0,g.useEffect)(()=>{let d=ki(Qe);if(d===void 0){it([]),at(null),In(!1);return}let m=()=>{let z=bi(zn(ye.current),d);it(Wr(z.map(G=>({path:G.path,kind:G.kind==="directory"?"directory":"file"})),J)),at("loaded"),In(!1)},k=u?.();if(k===void 0||f===void 0){m();return}let w=new AbortController;return In(!0),Promise.resolve(k.list(f,d,w.signal)).then(z=>{if(w.signal.aborted)return;let G=hi(z);it(Wr(G,J)),at("index"),In(!1)},z=>{w.signal.aborted||(console.debug(`[${be}] the file index failed, searching listed rows instead`,z),m())}),()=>w.abort()},[Qe,f,J,u]);let mr=Io!==null,gs=mr?Mo:ot;(0,g.useEffect)(()=>{let d=cr.current;if(d===void 0)return;let m=zn(ye.current).find(k=>k.path===d);m!==void 0&&(cr.current=void 0,m.kind==="directory"&&(vn(d,m.kind),ge(k=>new Set(k).add(d))),Mn(d,void 0,!0))},[ot,Mn,vn]);let[xs,st]=(0,g.useState)(void 0),Lo=(0,g.useRef)(!1);(0,g.useEffect)(()=>{if(Lo.current||typeof document>"u")return;let d=oi({rows:ot,panelCount:H.snapshot().panels.length,hasModal:Nt(document)});d.kind!=="skip"&&(Lo.current=!0,!To.current&&(d.open!==void 0&&H.open(d.open),st({path:d.focus})))},[ot,H]);let hs=(0,g.useCallback)(()=>st(void 0),[]),Ln=J===void 0?void 0:Object.keys(J).length,ks=J===void 0?"neutral":Object.values(J).some(d=>d.status==="conflicted")?"conflict":Ln===0?"success":"warning",Bo=Uo(X),bs=(0,g.useCallback)(d=>{if(f===void 0||x===void 0)return;if(tn.has(d)){ge(k=>{let w=new Set(k);return w.delete(d),w});return}ge(k=>new Set(k).add(d));let m=ce.get(d);(m===void 0||m.status==="failed")&&se(d,f,x)},[tn,ce,f,x,se]),Ao=(0,g.useCallback)(d=>{f===void 0||x===void 0||se(d,f,x)},[f,x,se]);(0,g.useEffect)(()=>{let d=!0;if(B.current=!1,f===void 0){O(pn(new Date().toISOString()));return}return D.load(f).then(m=>{d&&!B.current&&O(m)}).catch(()=>{}),()=>{d=!1}},[D,f]);let vs=(0,g.useCallback)(d=>{let m=[...$n(d),d];if(ge(k=>{let w=new Set(k);for(let z of m)w.add(z);return w}),f!==void 0&&x!==void 0){let k=m.filter(w=>ye.current.get(w)?.status!=="ready");k.length>0&&Promise.all(k.map(w=>se(w,f,x)))}st({path:d})},[f,x,se]),ws=(0,g.useCallback)(d=>{H.open(d)},[H]),te=(0,g.useCallback)((d,m)=>{Q.current!==null&&clearTimeout(Q.current),Y({text:d,tone:m}),Q.current=setTimeout(()=>{Q.current=null,Y(null)},4e3)},[]);(0,g.useEffect)(()=>()=>{Q.current!==null&&clearTimeout(Q.current)},[]);let sn=(0,g.useCallback)(d=>{B.current=!0,O(d),f!==void 0&&D.save(f,d).catch(()=>{te(t("bookmarks.saveFailed"),"error")})},[te,D,f,t]),Ss=(0,g.useCallback)(d=>{try{sn(wa(L,d.id).tree),te(t("bookmarks.removed"),"ok")}catch{}},[te,L,sn,t]),Rs=(0,g.useCallback)((d,m)=>{try{sn(Ca(L,d,m))}catch{}},[L,sn]);(0,g.useEffect)(()=>{if(P===void 0){F(void 0);return}let d=!0;return P.capabilities(f??"").then(m=>{d&&F(m.ok?m.capabilities:void 0)}),()=>{d=!1}},[P,f]),(0,g.useEffect)(()=>{let d=P?.ignored;if(f===void 0||P===void 0||typeof d!="function"){Fe([]);return}let m=new AbortController,k=!0;return Promise.resolve().then(()=>d.call(P,f,m.signal)).then(w=>{k&&Fe(w.ok?w.entries:[])}).catch(()=>{k&&Fe([])}),()=>{k=!1,m.abort()}},[f,P,on]);let Cs=(0,g.useCallback)(()=>{nt(d=>{let m=!d;return gu(m,vo()),m})},[]),Ts=(0,g.useCallback)((d,m,k)=>{let w=d===void 0?"":d.kind==="directory"?d.path:sa(d.path);if(_({row:d,anchor:m,absolutePath:void 0,trigger:k,createParent:w}),d===void 0||P===void 0)return;let z=d.path;P.info(f??"",z).then(G=>{_(Ne=>Ne===null||Ne.row?.path!==z?Ne:{...Ne,absolutePath:G.ok?G.info.absolutePath:void 0})})},[f,P]),Es=(0,g.useCallback)(()=>_(null),[]);M.current=N!==null;let dt=(0,g.useMemo)(()=>Ua({remotes:Be,root:Le,absolutePath:N?.absolutePath,kind:N?.row?.kind??"file",head:X}),[N?.absolutePath,N?.row?.kind,Le,X,Be]),yr=(0,g.useCallback)(d=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${d.code}`)),[t]),Ps=(0,g.useCallback)(d=>{let m=N;if(_(null),m===null)return;if(d===ie.createFile||d===ie.createFolder){let w=m.createParent;if(w===void 0)return;Se({kind:d===ie.createFolder?"directory":"file",parent:w,error:void 0,busy:!1});return}let k=m.row;if(k!==void 0){if(d.startsWith(`${ie.copyRemote}.`)){let w=dt.find(z=>z.id===d);if(w===void 0)return;fn(w.url).then(z=>{te(z?t("notice.copiedRemote").replace("{remote}",w.label):t("notice.copyFailed"),z?"ok":"error")});return}if(d===ie.copyRelative){fn(k.path).then(w=>{te(t(w?"notice.copiedRelative":"notice.copyFailed"),w?"ok":"error")});return}if(d===ie.copyAbsolute){let w=m.absolutePath;if(w===void 0)return;fn(w).then(z=>{te(t(z?"notice.copiedAbsolute":"notice.copyFailed"),z?"ok":"error")});return}if(d===ie.addBookmark){ue({mode:"add",target:{name:k.name,path:k.path,kind:k.kind}});return}if(d===ie.reveal){if(P===void 0){te(yr({code:"unsupported",message:""}),"error");return}P.reveal(f??"",k.path).then(w=>{if(!w.ok){te(yr(w.error),"error");return}let z=t(`menu.manager.${h?.fileManager??"directory"}`);te(t("notice.revealed").replace("{manager}",z),"ok")})}}},[te,h,N,dt,yr,f,t,P]),Fs=(0,g.useCallback)(d=>{let m=me;if(m===null)return;if(P===void 0||P.create===void 0){Se({...m,error:t("prompt.error.unsupported"),busy:!1});return}let k=f;if(k===void 0){Se({...m,error:t("prompt.error.no-workspace"),busy:!1});return}Se({...m,busy:!0,error:void 0}),P.create(k,m.parent,d,m.kind).then(w=>{if(!w.ok){Se(G=>G===null?G:{...G,busy:!1,error:t(`prompt.error.${w.error.code}`)});return}Se(null);let z=w.path;if(x!==void 0&&se(m.parent,k,x),m.kind==="file"){H.open(z),te(t("notice.createdFile"),"ok");return}ge(G=>new Set(G).add(z)),x!==void 0&&se(z,k,x),st({path:z}),te(t("notice.createdFolder"),"ok")})},[te,x,se,me,f,H,t,P]),Ns=(0,g.useCallback)(()=>Se(null),[]),Ms=(0,g.useMemo)(()=>N===null?[]:da({row:N.row,notices:{workspace:P!==void 0},capabilities:h,absolutePath:N.absolutePath,createParent:N.createParent,remoteLinks:N.row===void 0?void 0:dt,bookmarkTarget:N.row===void 0?void 0:{name:N.row.name,path:N.row.path,kind:N.row.kind}},t),[h,N,dt,t,P]),gr=(0,g.useCallback)(d=>{let m=zn(ye.current).find(k=>k.path===d);if(vn(d,m?.kind),m?.kind==="directory"){ge(k=>new Set(k).add(d));return}H.open(d)},[vn,H]),Is=(0,g.useCallback)(()=>{ur.current!==void 0&&gr(ur.current)},[gr]),lt=(0,g.useCallback)(()=>{No(""),it([]),at(null),In(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,g.useEffect)(()=>{if(Qe===""||typeof document>"u")return;let d=m=>{m.key!=="Escape"||m.isComposing||m.defaultPrevented||ar.current!==null||Nt(document)||(m.preventDefault(),m.stopPropagation(),lt())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[Qe,lt]);let Ls=()=>ge(new Set),Bs=()=>ir(d=>d+1),As=f===void 0?"no-session":x===void 0?"no-service":ne===void 0||ne.status==="loading"?"loading":ne.status==="failed"?"failed":ne.nodes.length===0?"empty":"tree";return(0,C.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":As,"data-session":f??"","data-testid":"fs-explorer-view",children:[(0,C.jsxs)("header",{className:"fx-head",children:[(0,C.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,C.jsx)(ho,{open:!0})}),(0,C.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,C.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,C.jsx)(pa,{tree:L,t,onOpenFile:ws,onOpenFolder:vs,onCreateGroup:d=>T({mode:"group",parentId:d}),onRename:d=>T({mode:"rename",node:d}),onRemove:Ss,onMove:d=>ue({mode:"move",node:d}),onReorder:Rs}),(0,C.jsxs)("div",{className:"fx-head-meta",children:[ne?.status==="ready"?(0,C.jsxs)("span",{children:[(0,C.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}):null,Nn.length===0?null:(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":Re?"true":"false","aria-pressed":Re,title:t(Re?"head.hideIgnored":"head.showIgnored"),"aria-label":t(Re?"head.hideIgnored":"head.showIgnored"),onClick:Cs,children:(0,C.jsx)(fu,{open:Re})}),(0,C.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":Qe===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":Qe!=="",onClick:()=>{Qe!==""?lt():ys()},children:(0,C.jsx)(ja,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:tn.size===0,onClick:Ls,children:(0,C.jsx)(_a,{})}),(0,C.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:f===void 0||x===void 0||ne?.status==="loading",onClick:Bs,children:(0,C.jsx)(Ka,{})})]})]}),R===null?null:(0,C.jsx)("div",{className:"fx-notice",role:"status","data-tone":R.tone,"data-testid":"fx-notice",children:R.text}),(0,C.jsx)("div",{className:"fx-main",children:f===void 0?(0,C.jsx)(er,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):x===void 0?(0,C.jsx)(er,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ne===void 0||ne.status==="loading"?(0,C.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ne.status==="failed"?(0,C.jsx)(er,{title:t("state.failed.title"),description:ne.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>Ao(""),testId:"fs-failed"}):ne.nodes.length===0?(0,C.jsx)(er,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)("div",{className:"fx-tree-pane",style:an===null?void 0:{"--fx-tree-width":`${an}px`},children:[(0,C.jsx)(Ga,{t,value:Qe,origin:Io,count:Mo.length,busy:fs,onChange:No,onStep:d=>Mn(void 0,d,!1),onActivate:Is,onClose:lt,focusSignal:ps}),(0,C.jsx)(Ha,{rows:gs,selectedPath:xn===void 0?rn:void 0,entryFocus:mr?void 0:xs,t,onToggle:bs,onSelect:d=>mr?gr(d):H.open(d),onRetry:Ao,onEntryFocusSettled:hs,onContextMenu:Ts,cursorRequest:ss,onCursorMove:d=>{ur.current=d}})]}),(0,C.jsx)("div",{ref:sr,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":an??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:ls,onPointerMove:us,onPointerUp:fr,onPointerCancel:fr,onLostPointerCapture:fr,onKeyDown:cs,onDoubleClick:pr}),(0,C.jsxs)("div",{className:"fx-editor",children:[(0,C.jsx)(Ri,{panels:ze.panels,active:ze.active,t,onActivate:d=>H.activate(d),onClose:dr,onStep:d=>d===1?H.next():H.previous(),documents:l,sessionId:f}),ae===null?null:(0,C.jsx)(Ci,{name:At(ae.path),t,saving:ke,error:Ke,onSave:is,onDiscard:as,onCancel:lr}),(0,C.jsx)("div",{className:"fx-editor-body",children:ze.panels.length===0?(0,C.jsx)(Ti,{t}):ze.panels.map((d,m)=>{let k=d.key===ze.active;return(0,C.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!k,"data-line":d.line,"data-testid":"fs-panel",children:(0,C.jsx)(oa,{sessionId:f,files:x,path:d.path,revision:d.revision,git:K,t,visible:k,renderers:a,documents:l,locate:Z})},d.key)})})]})]})}),N===null?null:(0,C.jsx)(ua,{entries:Ms,anchor:N.anchor,onSelect:Ps,onClose:Es,...N.trigger===void 0?{}:{returnFocus:()=>N.trigger??null}}),me===null?null:(0,C.jsx)(Zn,{kind:me.kind,parent:me.parent,t,error:me.error,busy:me.busy,onSubmit:Fs,onCancel:Ns}),oe===null?null:(0,C.jsx)(Ea,{tree:L,target:oe.mode==="add"?oe.target:void 0,t,mode:oe.mode,...oe.mode==="move"?{node:oe.node}:{},onCommit:d=>{let m=oe.mode;sn(d),ue(null),te(t(m==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>ue(null)}),S===null?null:(0,C.jsx)(Zn,{kind:"directory",parent:"",t,initialName:S.mode==="rename"?S.node.name:t("bookmarks.newGroup"),titleKey:S.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:d=>{let m=S;T(null);try{if(m.mode==="rename"){sn(Sa(L,m.node.id,d)),te(t("bookmarks.renamed"),"ok");return}let k=qn("group",{id:pu(),name:d,createdAt:Date.now()});sn(Yn(L,m.parentId,k)),te(t("bookmarks.groupCreated"),"ok")}catch{te(t("bookmarks.saveFailed"),"error")}},onCancel:()=>T(null)}),ne?.status==="ready"?(0,C.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,C.jsxs)("span",{children:[t("view.scope")," ",(0,C.jsx)("b",{children:ne.nodes.length})," ",t("head.entries")]}),ne.truncated?(0,C.jsx)("span",{className:"fx-foot-warn",children:Wn({entries:ne.nodes,truncated:!0,total:ne.total}).label}):null,(0,C.jsxs)("span",{className:"fx-foot-git","data-state":Ln===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,C.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":ks,"aria-hidden":"true"}),Ln===void 0?t("status.unavailable"):Ln===0?t("status.clean"):t("status.summary").replace("{count}",String(Ln))]}),Bo===null?null:(0,C.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[Bo,X?.upstream!==void 0&&(X.ahead??0)>0?(0,C.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(X.ahead)}`}):null,X?.upstream!==void 0&&(X.behind??0)>0?(0,C.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(X.behind)}`}):null]}),(0,C.jsx)("span",{className:"fx-spacer"}),(0,C.jsx)("span",{children:t("foot.order")})]}):null]})}return y}var es=["slots","locale","workbench","remote"];function vu(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var nr,tr,wo,rr,So,ns;function Ja(e){return So=e,rr!==void 0||(rr=pi({open:(n,t,r)=>{let o=So;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ci(o)(n,t,r)},save:(n,t)=>{let r=So;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):fi(r)(n,t)}})),rr}function wu(){if(wo!==void 0)return wo;let e=Ht({warn:n=>ns?.(n)});for(let n of uo())e.register(n);return wo=e,e}var or;function ts(e){let n=e.workbench;if(n==null)return()=>{};ns=u=>e.logger?.warn?.(u);let t=wu(),r={version:_i,renderers:t,registerRenderer:u=>t.register(u),documents:Ja(e)};tr?.();let o=e.provide?.(eo,r);o===void 0&&e.logger?.warn?.(`${Dn}: ctx.provide unavailable, ${eo} service not registered`),tr=o,nr?.();let i=e.locale.register(Dn,{zh:{...Mr,...zr.zh,...so.zh},en:{...Ir,...zr.en,...so.en}});nr=i;let a=e.locale.bind(Dn),l=aa(typeof document>"u"?void 0:document),c=Qa({workbench:n,version:n.version,t:a,files:Xi(e),status:na(e),git:Qi(e),renderers:t,documents:Ja(e),locate:u=>ui(e,u),workspace:()=>Va(e),fileReferences:xi(e)});or?.();let s=Nr(e,n);return or=s,e.slots.inject(hr,()=>e.slots.register({name:hr,id:xe,order:100,label:()=>Lr(vu(e)),locale:Dn},c)),()=>{o?.(),tr===o&&(tr=void 0),s(),or===s&&(or=void 0),l(),i(),nr===i&&(nr=void 0)}}var rs={buildTree:ht,describeListing:Wn,iconFor:wn,computeTreeWindow:kt,flattenTree:St,badgeFor:Sn,formatSize:Rt,joinPath:Rn,listingPath:bt,parseFocus:wt,consumeViewRequest:Dt,createPanelStack:$r,createEscapeHandler:Mt,KEYMAP:Ft,tabLabel:Lr,indexIgnoredPaths:ct,isIgnoredPath:ft,normalizeListing:Vt,normalizeStatusSnapshot:qt,buildWorkspaceMap:gt,workspaceTagFor:xt,parseStatusZ:pt,statusTone:On,statusBadge:mt,createPreviewLoader:Wt,renderMarkdown:Ot,languageFor:_n,isMarkdownFile:Hn,describePage:$t,classifyPreviewFailure:cn,normalizePreviewPage:En,previewChunkRoute:Li,canBridgeFile:Ct,decideBridge:Pr,focusForFileAddress:Er,forwardFocus:Fr,registerAddressBridge:Nr},os={name:"dsh-fs-explorer",inject:es,apply:ts,__test:rs};function Su(e){Di(e),Ii(e)}var Ru=os;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
