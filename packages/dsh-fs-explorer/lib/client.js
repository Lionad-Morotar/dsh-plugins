window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Gr=Object.defineProperty;var al=Object.getOwnPropertyDescriptor;var sl=Object.getOwnPropertyNames;var dl=Object.prototype.hasOwnProperty;var ll=(e,n)=>{for(var t in n)Gr(e,t,{get:n[t],enumerable:!0})},cl=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of sl(n))!dl.call(e,o)&&o!==t&&Gr(e,o,{get:()=>n[o],enumerable:!(r=al(n,o))||r.enumerable});return e};var ul=e=>cl(Gr({},"__esModule",{value:!0}),e);var Wf={};ll(Wf,{__test:()=>Sd,apply:()=>wd,boot:()=>jf,clientPlugin:()=>Rd,createReferenceResolver:()=>vd,default:()=>_f,inject:()=>bd});module.exports=ul(Wf);var _n=require("react");var wi="dsh-resource://file/";function Si(e){try{return decodeURIComponent(e)}catch{return e}}function ot(e){if(!e.startsWith(wi))return null;let n=e.slice(wi.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=Si(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(Si).join("/")}}function en(e){return e.slice(e.lastIndexOf("/")+1)}var Ri=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title",claims:["workbench","sidebar"]},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title",claims:["workbench","sidebar"]},{family:"cad",extensions:["dxf"],titleKey:"cad.title",claims:["workbench","sidebar"]},{family:"image",extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg"],titleKey:"image.title",claims:["workbench"]},{family:"pdf",extensions:["pdf"],titleKey:"pdf.title",claims:["workbench"]}];function Pi(){return Ri.flatMap(e=>[...e.extensions])}function it(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return Ri.find(o=>o.extensions.includes(r))?.family??null}var se="dsh-fs-explorer",Vr="conversation.view",te="fs-explorer";var at="fs-explorer",Ci="fsExplorerDocuments",Ti="fsExplorerWorkspace",Ei="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D";function Fi(e){return`\u5DF2\u9690\u85CF ${String(e)} \u4E2A\u5FFD\u7565\u9879`}var qr={chunk:"client.preview.js"};var Dt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js",image:"client.image.js",pdf:"client.pdf.js"};function Mi(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return n.trim()===""?"":n}function Ot(e){let n=new Set;if(!Array.isArray(e))return n;for(let t of e){if(typeof t!="string")continue;let r=Mi(t);r===""||r==="."||n.add(r)}return n}function jt(e,n){if(n===void 0||n.size===0)return!1;let t=Mi(e);if(t===""||t===".")return!1;if(n.has(t))return!0;let r=t.lastIndexOf("/");for(;r>0;){let o=t.slice(0,r);if(n.has(o))return!0;r=o.lastIndexOf("/")}return!1}var fl={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},pl={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},ml=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function Ni(e){return typeof e=="string"&&ml.has(e)}function Li(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function gl(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function _t(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=Li(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",u=a.rest;if(u===""||l.length<2)continue;if(i==="2"){let s=t[r+1];if(s===void 0||s==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:gl(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=Li(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function st(e){return Ni(e)?fl[e]:"neutral"}function Wt(e){return Ni(e)?pl[e]:"?"}function Ur(e){return`status.${e}`}function $t(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function Ii(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function Ai(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Bi(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var yl=["conflicted","deleted","renamed","added","modified","untracked"];function hl(e){return st(yl.find(n=>e.has(n))??"modified")}function Di(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,u="";for(let s=0;s<l;s+=1){let c=a[s];if(c===void 0||c==="")continue;u=u===""?c:`${u}/${c}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:hl(o.present)});return t}var _i=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Wi=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function xl(e){return Wi.test(e)?e.slice(0,e.indexOf("/")):null}function bl(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function kl(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=bl(i[2]??"");a!==""&&Wi.test(a)&&t.push(a)}return t}function vl(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Oi(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function ji(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function zt(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of vl(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of kl(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=Oi(a);if(l!==void 0){let u=l.workspaces,s=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let c of ji(Array.isArray(u)?u:s))o.add(c)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let s=Oi(u);if(s!==void 0)for(let c of ji(s.packages))o.add(c)}for(let l of o){let u=xl(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function Kt(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var wl=new Set([".git"]);function Sl(e){return wl.has(e)}function Rl(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function On(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Sl(r))continue;let o=Rl(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var Pl=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Cl=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Tl=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),El=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Fl=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Ml=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Ll=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function $i(e){let n=en(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function pn(e,n="file"){if(n==="directory")return"folder";let t=en(e.toLowerCase());if(Ll.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=$i(t);return r===""?"file":Pl.has(r)?"code":Cl.has(r)?"markdown":Tl.has(r)?"data":El.has(r)?"image":Fl.has(r)?"style":Ml.has(r)?"archive":"file"}var Nl={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Il={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function mn(e){let n=en(e.toLowerCase()),t=Nl[n];if(t!==void 0)return t;let r=$i(n),o=Il[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function dt(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${Ei} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function Ht(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),a),s=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,s),startIndex:u,endIndex:s}}function Yr(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function zi(e,n){let t=n>0?n:1;return Math.max(1,Math.floor(Math.max(0,e)/2/t))}function Ki(e,n,t,r){if(e.length===0)return;let o=Math.max(1,r);if(n===void 0)return t<0?e[e.length-1]:e[0];let i=t<0?e.filter(a=>a<n):e.filter(a=>a>n);if(i.length!==0)return t<0?i[i.length-o]??i[0]:i[o-1]??i[i.length-1]}function jn(e){return e===""?".":e}function nn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ae(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function lt(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Ae(r,o),t.push(r);return t}function Xr(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Gt(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let s=Xr(t[2]),c=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return c===""||s<1?void 0:{path:c,line:s,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^reveal:(.+)$/u.exec(n);if(r!==null){let s=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return s===""?void 0:{path:s,line:1,absolute:!1,reveal:!0}}let o=/^enter:(.+)$/u.exec(n);if(o!==null){let s=(o[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/\/+$/u,"");return s===""?void 0:nn(s)?{path:s,line:1,absolute:!0,enter:!0}:{path:s.replace(/^\/+/u,""),line:1,absolute:!1,enter:!0}}let i=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(i!==null){let s=(i[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return s===""?void 0:{path:s,line:Xr(i[2]),absolute:!0}}let a=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(a===null)return;let u=(a[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(u!=="")return{path:u,line:Xr(a[2]),absolute:!1}}function Hi(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Gi(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Vt(e,n,t,r,o){let i=[],a=Di(t),l=o?.showIgnored===!1,u=o?.hiddenLabel??Fi,s=(c,f)=>{let y=e.get(c);if(y===void 0||y.status!=="ready")return;let h=0;for(let R of y.nodes){let w=Ae(c,R.name),m=R.kind==="directory",k=jt(w,o?.ignored);if(k&&l){h+=1;continue}let P=m&&n.has(w),j=m||t===void 0?void 0:t[w],Y=j?.status??(m?void 0:$t(w,t)),I=j===void 0?void 0:Ii(j),L=m?a.get(w):void 0,X=m?Kt(r,w):void 0;if(i.push({type:"entry",path:w,name:R.name,kind:R.kind,depth:f,expanded:P,...R.size===void 0?{}:{size:R.size},...Y===void 0?{}:{status:Y},...L===void 0?{}:{statusCount:L.count,statusTone:L.tone},...I===void 0?{}:{diff:I},...X===void 0?{}:{tag:X},...k?{ignored:!0}:{}}),!P)continue;let D=e.get(w);if(D===void 0||D.status==="loading"){i.push({type:"status",key:`${w}:loading`,path:w,depth:f+1,state:"loading"});continue}if(D.status==="failed"){i.push({type:"status",key:`${w}:failed`,path:w,depth:f+1,state:"failed",message:D.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(D.nodes.length===0){i.push({type:"status",key:`${w}:empty`,path:w,depth:f+1,state:"empty"});continue}s(w,f+1),D.truncated&&i.push({type:"status",key:`${w}:truncated`,path:w,depth:f+1,state:"truncated",label:dt({entries:D.nodes,truncated:!0,total:D.total}).label})}h>0&&y.nodes.length===h&&i.push({type:"status",key:`${c}:hidden`,path:c,depth:f,state:"empty",label:u(h)})};return s("",0),i}var Vi=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Al(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Bl(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&Vi.has(Al(n.path)))}var Dl=[...Vi,"index.md","index.markdown"];function qi(e,n){for(let t of Dl){let r=e.find(o=>o.kind==="file"&&o.name.toLowerCase()===t);if(r!==void 0)return Ae(n,r.name)}}function Ui(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Bl(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function qt(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var Jr="dsh-fs-explorer:bridge",Ol="fs-explorer-bridge",Zi="dsh-resource://file/**",Zr="sidebar.right.pane.tab",jl=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),_l=new Set(["docx","pptx","xlsx","xls","fods","csv","tsv","doc","ppt"]),Wl=new Set(["makefile","dockerfile","license","readme","changelog",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".browserslistrc",".env"]),$l=new Set([...Pi(),...jl]);function zl(e){let n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function Ut(e){if(typeof e!="string"||e==="")return!1;let n=en(e).toLowerCase();if(n==="")return!1;let t=zl(n);return _l.has(t)?!1:Wl.has(n)?!0:$l.has(t)}function Kl(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function Hl(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function no(e,n){if(typeof e!="string")return;let t=ot(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=Hl(n,Kl(e));return`${nn(r)?"abs:":"path:"}${r}:${String(o)}`}function to(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=ot(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Ut(r.path))return{action:"keep",reason:"refused"};let o=no(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function tn(e,n){n===void 0?console.warn(`[${se}] ${e}`):console.warn(`[${se}] ${e}`,n)}function Gl(e){console.debug(`[${se}] ${e}`)}function Qr(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function eo(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function Rn(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Xi(e){return Rn(()=>e.sidebarRightTabs,Qr)??Rn(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,Qr)}function Yi(e){return Rn(()=>e.sidebarRight,eo)??Rn(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,eo)}function Ji(e){return typeof e=="function"?e:()=>{}}var Vl="dsh-resource://file/session/probe/src/main.ts";function ql(e){let n=Rn(()=>(typeof e.candidates=="function"?e.candidates(Vl):[]).filter(r=>r.priority==="extension"&&r.id!==Jr),t=>Array.isArray(t)&&t.length>0);n!==void 0&&tn(`another extension-band tab type already claims ${Zi}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function Ul(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function Xl(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function Yl(e,n){let t=e.viewFocus;if(t?.request?.(te,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(te,n);return(!r.opened||r.focused)&&t?.take(te),r}return typeof e.openView=="function"&&e.openView(te,n)?(t?.take(te),{opened:!0,focused:!0}):(t?.take(te),{opened:!1,focused:!1})}function ro(e,n,t,r){let o;try{o=Yl(e,r)}catch(i){return tn("the file workbench threw while switching views",i),e.viewFocus?.take(te),!1}if(!o.opened)return tn(`the file workbench did not switch to ${te}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return tn("the forwarded tab could not be closed",i),!1}}function Jl(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=Ul(i),u=Xl(i),s=(0,_n.useRef)(void 0);return(0,_n.useEffect)(()=>{if(a===void 0){tn("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(s.current===a)return;s.current=a;let c=to(l,e.currentSessionId(),u);if(c.action!=="open"){tn(`left the forwarded tab standing (${c.reason})`,l);return}ro(e,n,a,c.focus)},[a,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(tn(`the host did not inject useTabInfo into ${Zr}; the bridge cannot forward`),null):(0,_n.createElement)(t,{useTabInfo:o.useTabInfo})}}function oo(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;ql(l);let s;try{s=l.register({id:Jr,kind:Ol,patterns:[Zi],priority:"extension",canOpen:y=>{let h=ot(y);return h!==null&&Ut(h.path)},title:y=>en(ot(y)?.path??y)||y})}catch(y){tn("the sidebar right refused the address bridge tab type",y);return}let c=Jl(n,u),f;try{f=Ji(e.slots.inject(Zr,()=>e.slots.register({name:Zr,key:Jr},c)))}catch(y){s(),tn("the sidebar right refused the address bridge body",y);return}return()=>{f(),s()}},r=Xi(e),o=Yi(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return Gl("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=Rn(()=>l.get?.("sidebarRightTabs"),Qr)??Xi(l),s=Rn(()=>l.get?.("sidebarRight"),eo)??Yi(l);return t(u,s)});return Ji(a)}var io={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","bookmarks.label":"\u4E66\u7B7E","bookmarks.empty":"\u8FD8\u6CA1\u6709\u4E66\u7B7E","bookmarks.newGroup":"\u65B0\u5EFA\u7EC4\u2026","bookmarks.newGroup.reason":"\u5F53\u524D\u7248\u672C\u8FD8\u4E0D\u80FD\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.group":"\u4E66\u7B7E\u7EC4","bookmarks.file":"\u4E66\u7B7E\u6587\u4EF6","bookmarks.folder":"\u4E66\u7B7E\u76EE\u5F55","bookmarks.picker.add":"\u6DFB\u52A0\u4E66\u7B7E","bookmarks.picker.move":"\u79FB\u52A8\u5230\u7EC4","bookmarks.picker.addHere":"\u6DFB\u52A0\u5230\u8FD9\u91CC","bookmarks.picker.moveHere":"\u79FB\u5230\u8FD9\u91CC","bookmarks.picker.root":"\u6839\u76EE\u5F55","bookmarks.picker.empty":"\u8FD9\u4E00\u5C42\u8FD8\u6CA1\u6709\u7EC4","bookmarks.rename":"\u91CD\u547D\u540D","bookmarks.remove":"\u79FB\u9664","bookmarks.moveUp":"\u4E0A\u79FB","bookmarks.moveDown":"\u4E0B\u79FB","bookmarks.moveToGroup":"\u79FB\u5230\u7EC4\u2026","bookmarks.manage":"\u4E66\u7B7E\u64CD\u4F5C","bookmarks.added":"\u5DF2\u6DFB\u52A0\u4E66\u7B7E","bookmarks.moved":"\u5DF2\u79FB\u52A8\u4E66\u7B7E","bookmarks.removed":"\u5DF2\u79FB\u9664\u4E66\u7B7E","bookmarks.renamed":"\u5DF2\u91CD\u547D\u540D\u4E66\u7B7E","bookmarks.groupCreated":"\u5DF2\u65B0\u5EFA\u4E66\u7B7E\u7EC4","bookmarks.saveFailed":"\u4E66\u7B7E\u4FDD\u5B58\u5931\u8D25","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","head.showIgnored":"\u663E\u793A Git \u5FFD\u7565\u9879","head.hideIgnored":"\u9690\u85CF Git \u5FFD\u7565\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.hiddenDirectory":"\u5DF2\u9690\u85CF {count} \u4E2A\u5FFD\u7565\u9879","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","status.ignored":"Git \u5FFD\u7565","search.placeholder":"\u641C\u7D22\u5DE5\u4F5C\u533A\u6587\u4EF6","search.title":"\u641C\u7D22","search.scope":"\u641C\u7D22\u7ED3\u679C\u6765\u6E90","search.scope.index":"\u7D22\u5F15","search.scope.loaded":"\u5DF2\u52A0\u8F7D","search.count":"{count} \u4E2A\u7ED3\u679C","search.none":"\u65E0\u5339\u914D","search.close":"\u9000\u51FA\u641C\u7D22","search.open":"\u641C\u7D22\u6587\u4EF6","search.results":"\u641C\u7D22\u7ED3\u679C","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.find":"\u67E5\u627E","preview.find.placeholder":"\u5728\u5F53\u524D\u6B63\u6587\u4E2D\u67E5\u627E","preview.find.hint.page":"\u672C\u9875","preview.find.hint.document":"\u5168\u6587","preview.find.none.page":"\u672C\u9875\u65E0\u5339\u914D","preview.find.none.document":"\u5168\u6587\u65E0\u5339\u914D","preview.find.count.page":"\u672C\u9875 {index}/{count}","preview.find.count.document":"\u5168\u6587 {index}/{count}","preview.find.scope.page":"\u6309\u9884\u89C8\u5F53\u524D\u6E32\u67D3\u7684\u6587\u672C\u67E5\u627E","preview.find.scope.document":"\u6309\u7F16\u8F91\u5668\u7684\u6574\u4EFD\u6587\u6863\u67E5\u627E","preview.find.prev":"\u4E0A\u4E00\u4E2A","preview.find.next":"\u4E0B\u4E00\u4E2A","preview.find.close":"\u5173\u95ED\u67E5\u627E","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","preview.surface.image.title":"\u56FE\u7247","preview.surface.pdf.title":"PDF \u6587\u6863","preview.surface.pdf.page":"\u7B2C {current} / {total} \u9875","preview.surface.pdf.previous":"\u4E0A\u4E00\u9875","preview.surface.pdf.next":"\u4E0B\u4E00\u9875","preview.surface.pdf.error.password":"\u8FD9\u4E2A PDF \u9700\u8981\u5BC6\u7801\u624D\u80FD\u6253\u5F00","preview.surface.pdf.error.invalid":"\u8FD9\u4E2A PDF \u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 PDF","preview.surface.pdf.error.missing":"\u627E\u4E0D\u5230\u8FD9\u4E2A PDF \u7684\u5185\u5BB9","preview.surface.pdf.error.unknown":"\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A PDF","preview.surface.pdf.error.render":"\u8FD9\u4E00\u9875\u65E0\u6CD5\u7ED8\u5236","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.copy.remote":"\u590D\u5236\u8FDC\u7AEF\u5730\u5740","menu.copy.remote.reason":"\u5F53\u524D\u4ED3\u5E93\u6CA1\u6709\u53EF\u7528\u7684\u8FDC\u7AEF","menu.addBookmark":"\u6DFB\u52A0\u4E66\u7B7E","menu.addBookmark.reason":"\u8FD9\u4E00\u884C\u6CA1\u6709\u53EF\u6536\u85CF\u7684\u8DEF\u5F84","menu.reference":"\u5F15\u7528\u5230\u8F93\u5165\u6846","menu.reference.reason.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","menu.reference.reason.noReference":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","menu.reference.reason.noReferenceSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","menu.reference.reason.absolute":"\u5DE5\u4F5C\u533A\u5916\u7684\u7EDD\u5BF9\u8DEF\u5F84\u4E0D\u80FD\u5F15\u7528","menu.reference.reason.revision":"\u63D0\u4EA4\u7248\u672C\u7684\u6587\u4EF6\u4E0D\u5728\u5DE5\u4F5C\u533A\u91CC\uFF0C\u4E0D\u80FD\u5F15\u7528","notice.referenced":"\u5DF2\u5F15\u7528 {name}","notice.referenceFailed":"\u65E0\u6CD5\u63D2\u5165\u5F15\u7528\uFF0C\u8F93\u5165\u6846\u4E0D\u63A5\u53D7\u5199\u5165","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","menu.tab.close":"\u5173\u95ED","menu.tab.closeOthers":"\u5173\u95ED\u5176\u4ED6\u6807\u7B7E\u9875","menu.tab.closeOthers.reason":"\u53EA\u6709\u8FD9\u4E00\u4E2A\u6807\u7B7E\u9875","menu.tab.closeRight":"\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E\u9875","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copiedRemote":"\u5DF2\u590D\u5236 {remote} \u7684\u8FDC\u7AEF\u5730\u5740","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},ao={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","bookmarks.label":"Bookmarks","bookmarks.empty":"No bookmarks yet","bookmarks.newGroup":"New group\u2026","bookmarks.newGroup.reason":"This build cannot create bookmark groups yet","bookmarks.group":"Bookmark group","bookmarks.file":"File bookmark","bookmarks.folder":"Folder bookmark","bookmarks.picker.add":"Add bookmark","bookmarks.picker.move":"Move to group","bookmarks.picker.addHere":"Add here","bookmarks.picker.moveHere":"Move here","bookmarks.picker.root":"Root","bookmarks.picker.empty":"No groups at this level","bookmarks.rename":"Rename","bookmarks.remove":"Remove","bookmarks.moveUp":"Move up","bookmarks.moveDown":"Move down","bookmarks.moveToGroup":"Move to group\u2026","bookmarks.manage":"Bookmark actions","bookmarks.added":"Bookmark added","bookmarks.moved":"Bookmark moved","bookmarks.removed":"Bookmark removed","bookmarks.renamed":"Bookmark renamed","bookmarks.groupCreated":"Bookmark group created","bookmarks.saveFailed":"Could not save bookmarks","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","head.showIgnored":"Show Git-ignored entries","head.hideIgnored":"Hide Git-ignored entries","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.hiddenDirectory":"Hidden {count} ignored items","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","status.ignored":"Git-ignored","search.placeholder":"Search workspace files","search.title":"Search","search.scope":"Where the results come from","search.scope.index":"Index","search.scope.loaded":"Listed","search.count":"{count} results","search.none":"No match","search.close":"Exit search","search.open":"Search files","search.results":"Search results","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.find":"Find","preview.find.placeholder":"Find in the preview text","preview.find.hint.page":"This page","preview.find.hint.document":"Whole file","preview.find.none.page":"No match on this page","preview.find.none.document":"No match in the whole file","preview.find.count.page":"{index}/{count} on this page","preview.find.count.document":"{index}/{count} in the whole file","preview.find.scope.page":"The search covers the text this preview renders","preview.find.scope.document":"The search covers the editor's whole document","preview.find.prev":"Previous match","preview.find.next":"Next match","preview.find.close":"Close find","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","preview.surface.image.title":"Image","preview.surface.pdf.title":"PDF document","preview.surface.pdf.page":"Page {current} of {total}","preview.surface.pdf.previous":"Previous page","preview.surface.pdf.next":"Next page","preview.surface.pdf.error.password":"This PDF is password protected","preview.surface.pdf.error.invalid":"This file is damaged or is not a valid PDF","preview.surface.pdf.error.missing":"The content of this PDF could not be found","preview.surface.pdf.error.unknown":"This PDF could not be opened","preview.surface.pdf.error.render":"This page could not be drawn","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.copy.remote":"Copy remote address","menu.copy.remote.reason":"This repository has no usable remote","menu.addBookmark":"Add bookmark","menu.addBookmark.reason":"This row has no path to bookmark","menu.reference":"Reference in composer","menu.reference.reason.noSession":"No session to insert into","menu.reference.reason.noReference":"This host has no composer to insert into","menu.reference.reason.noReferenceSource":"The reference source is not registered, so the chip could not be sent","menu.reference.reason.absolute":"An absolute path outside the workspace cannot be referenced","menu.reference.reason.revision":"A commit-version file is not in the working tree, so it cannot be referenced","notice.referenced":"Referenced {name}","notice.referenceFailed":"Could not insert the reference: the composer refused the write","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","menu.tab.close":"Close","menu.tab.closeOthers":"Close other tabs","menu.tab.closeOthers.reason":"This is the only tab","menu.tab.closeRight":"Close tabs to the right","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copiedRemote":"Copied the {remote} remote address","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function so(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?io:ao)["tab.label"]??"Files"}var ta=require("react"),ra=14,Zl="--dsh-content-font-size",Qi=ra;function Ql(e,n){return Math.max(e,Math.round(e*n/ra))}function ec(e,n){if(e===void 0)return n;let t=Number.parseFloat(e);return Number.isFinite(t)&&t>0?t:n}function oa(){return typeof document>"u"||document.body===null?Qi:ec(document.body.style.getPropertyValue(Zl),Qi)}var lo=oa(),co=new Set;function ea(){return lo}function nc(e){return co.add(e),()=>{co.delete(e)}}function tc(e){if(e!==lo){lo=e;for(let n of[...co])n()}}function na(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function rc(e){if(e===null||typeof e!="object")return;let n=e.fontSizes;if(n===null||typeof n!="object")return;let t=n.text;return typeof t=="number"&&Number.isFinite(t)&&t>0?t:void 0}function oc(e){try{let n=e.get?.("theme");if(na(n))return n}catch{}try{let n=e.theme;if(na(n))return n}catch{}}function ia(e){let n=e.inject;if(typeof n!="function")return()=>{};let t,r;try{let o=n.call(e,["theme"],i=>{let a=oc(i);if(a===void 0)return;let l=()=>{try{let c=rc(a.getTheme());tc(c??oa())}catch{}};l();let u=i.on?.("theme/change",l);if(typeof u!="function")return;let s=u;return t=s,s});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{t?.(),r?.()}}function aa(e){let n=(0,ta.useSyncExternalStore)(nc,ea,ea);return Ql(e,n)}var ic=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function Te(e){return e!==null&&typeof e=="object"}function Yt(e,n){return{ok:!1,code:e,message:n}}function Jt(e){let n=Te(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Yt(t,r)}function uo(){return Yt("invalid-response","the document service answered an invalid response")}function Xt(e){try{return e()}catch{return}}function ac(e){let n=Te(e)?e:void 0;if(n===void 0)return uo();if(n.ok===!1)return Jt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Te(t)?t:void 0;if(r===void 0)return uo();if(r.ok===!1)return Jt(r.error);let o=Te(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?uo():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function sc(e){let n=Te(e)?e:void 0;if(n===void 0)return sa();if(n.ok===!1)return Jt(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=Te(t)?t:void 0;if(r===void 0)return sa();if(r.ok===!1)return Jt(r.error);let o=Te(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function sa(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function fo(e){return Te(e)&&typeof e.open=="function"}function dc(e){let n=Xt(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Te(n)?n.rpc:void 0;if(!(!Te(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Ci}/${r}`,o,i)}function lc(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function cc(e){let n=Te(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=Te(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=Te(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function da(e,n){let t=mo(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return cc(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function mo(e){return()=>{let n=Xt(()=>e.fsExplorerDocuments);if(fo(n))return n;let t=Xt(()=>Te(e.remote)?e.remote.fsExplorerDocuments:void 0);if(fo(t))return t;let r=Xt(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(fo(r))return r;let o=dc(e);if(o!==void 0)return lc(o)}}function la(e){let n=mo(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Yt("unavailable","the document service is unavailable");try{return ac(await i.open({sessionId:t,path:r},o))}catch(a){return Yt("io-error",a instanceof Error?a.message:String(a))}}}function ca(e){let n=mo(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return sc(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function ua(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let s=o(l,u),c=n.get(s);return c===void 0&&(c={session:new po(l,u,e.open,e.save,()=>{n.delete(s),i()},i)},n.set(s,c),i()),c.session.retain(),c.session},peek(l,u){return a(l,u)?.getSnapshot()},find:a,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var po=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=ic;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Zt=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function go(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function fa(e,n,t=go()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function pa(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function uc(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Qt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function er(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&uc(n),e.onClose?.()}}function ma(e){return e.viewSessionId===void 0||e.viewSessionId!==e.currentSessionId||e.activePanel===null?"pass":e.confirming?"hold":"close"}function ga(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return n<0?e:e.slice(n+1)}function nr(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function tr(e){try{return e()}catch{return}}function ya(e){return()=>{let n=tr(()=>e.fileReferences);if(nr(n))return n;let t=tr(()=>typeof e.get=="function"?e.get("fileReferences"):void 0);if(nr(t))return t;let r=tr(()=>e.remote?.fileReferences);if(nr(r))return r;let o=tr(()=>typeof e.get=="function"?e.get("remote.fileReferences"):void 0);return nr(o)?o:void 0}}function ha(e){if(e===null||typeof e!="object")return[];let n=e;if(n.ok===!1)return[];let t=n.ok===!0?n.value:e;if(!Array.isArray(t))return[];let r=[];for(let o of t){if(o===null||typeof o!="object")continue;let i=o;typeof i.path!="string"||i.path===""||i.kind!=="file"&&i.kind!=="directory"||r.push({path:i.path,kind:i.kind})}return r}function xa(e){let n=e.trim();return n===""?void 0:n}function yo(e,n){let t=[],r=new Set;for(let o of e){let i=o.path.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i===""||r.has(i))continue;r.add(i);let a=o.kind,l=a==="file"?$t(i,n):void 0,u=fc(i);t.push({type:"entry",path:i,name:ga(i),kind:a,depth:0,expanded:!1,...l===void 0?{}:{status:l},...u===""?{}:{directory:u}})}return t}function fc(e){let n=e.replace(/\\/gu,"/"),t=n.lastIndexOf("/");return t<=0?"":n.slice(0,t)}function Wn(e){let n=[];for(let[t,r]of e)for(let o of r.nodes)n.push({path:Ae(t,o.name),kind:o.kind});return n}function ba(e,n){let t=n.toLowerCase();return e.filter(r=>ga(r.path).toLowerCase().includes(t))}function ka(e){return lt(e)}var $n=require("react");function or(e){let n=en(e);return n===""?e:n}function rr(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var pc=Object.freeze({panels:Object.freeze([]),active:null});function va(e,n){return n===void 0?e:`git\0${n}\0${e}`}var mc=/^git:([0-9a-f]{4,64}):(.+)$/iu;function wa(e,n,t){let r=e.findIndex(i=>i.key===n);return r<0?[]:(t==="others"?e.filter((i,a)=>a!==r):e.slice(r+1)).map(i=>i.key)}function ho(){let e=[],n=null,t=pc,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let s of[...r])s()},i=s=>e.findIndex(c=>c.key===s),a=s=>e.findIndex(c=>c.revision===void 0&&c.key===s),l=s=>{if(typeof s!="string")return;if(i(s)>=0)return s;let c=mc.exec(s);if(c!==null){let h=(c[1]??"").toLowerCase(),R=rr(c[2]??"",!1);if(R===void 0)return;let w=va(R,h);return i(w)>=0?w:void 0}let f=rr(s,!0);if(f===void 0)return;if(a(f)>=0)return f;let y=rr(s,!1);if(!(y===void 0||y===f))return a(y)>=0?y:void 0},u=s=>{if(e.length===0)return;let c=n===null?-1:i(n),f=e[(c+s+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(s,c=1,f=!1,y){let h=rr(s,f);if(h===void 0)return;let R=typeof y=="string"&&y.trim()!==""?y.trim().toLowerCase():void 0,w=va(h,R),m=Number.isFinite(c)&&c>0?Math.trunc(c):1,k=i(w);if(k>=0){let Y=e[k],I=Y!==void 0&&(Y.line!==m||Y.absolute!==f);if(I&&(e=e.map((L,X)=>X===k?{...L,line:m,absolute:f}:L)),n===w){I&&o();return}n=w,o();return}let P=n===null?e.length:i(n)+1,j={key:w,path:h,line:m,absolute:f,...R===void 0?{}:{revision:R}};e=[...e.slice(0,P),j,...e.slice(P)],n=w,o()},close(s){let c=s===void 0?n:l(s)??null;if(c===null)return;let f=i(c);f<0||(e=e.filter(y=>y.key!==c),n===c&&(n=(e[f]??e[f-1])?.key??null),o())},activate(s){let c=l(s);c===void 0||i(c)<0||n===c||(n=c,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(s){let c=l(s);return c!==void 0&&i(c)>=0},activeEntry(){return e.find(s=>s.key===n)},snapshot:()=>t,subscribe(s){return r.add(s),()=>{r.delete(s)}}}}function Sa(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=ho();return e.set(t,o),o}}}function ir(e,n){let t=Gt(e);return t===void 0?!1:t.reveal===!0?n.reveal===void 0?!1:(n.reveal(t.path),!0):t.enter===!0?n.enter===void 0?!1:(n.enter(t.path,t.absolute),!0):(n.open(t.path,t.line,t.absolute,t.revision),!0)}var J=require("react/jsx-runtime"),xo={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},gc=()=>()=>{},yc=()=>"";function hc(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function Ra({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,onTabMenu:a,documents:l,sessionId:u}){let s=(0,$n.useRef)(null);(0,$n.useEffect)(()=>{s.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let c=(0,$n.useSyncExternalStore)(l?.subscribe??gc,()=>hc(l,u,e).join("\0"),yc),f=new Set(c===""?[]:c.split("\0"));if(e.length===0)return null;let y=h=>{if(h.key==="ArrowRight"||h.key==="ArrowLeft"){h.preventDefault(),h.stopPropagation(),i(h.key==="ArrowRight"?1:-1);return}(h.key==="Delete"||h.key==="Backspace")&&n!==null&&(h.preventDefault(),h.stopPropagation(),o(n))};return(0,J.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:y,"data-testid":"fs-tabs",children:e.map((h,R)=>{let w=h.key===n,m=or(h.path),k=t("panel.close").replace("{name}",m);return(0,J.jsxs)("div",{className:"fx-tab","data-active":w?"true":"false","data-dirty":f.has(h.path)?"true":"false",role:"presentation",onContextMenu:a===void 0?void 0:P=>{P.preventDefault(),P.stopPropagation(),a(h.key,{x:P.clientX,y:P.clientY},P.currentTarget)},children:[(0,J.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${R}`,"aria-controls":`fx-panel-${R}`,"aria-selected":w,tabIndex:w?0:-1,title:h.path,"data-testid":"fs-tab","data-path":h.path,"data-key":h.key,ref:w?s:void 0,onClick:()=>r(h.key),children:[(0,J.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":pn(h.path),"aria-hidden":"true",children:mn(h.path)}),(0,J.jsx)("span",{className:"fx-tab-name",children:m}),h.revision===void 0?null:(0,J.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:h.revision,children:h.revision.slice(0,7)}),f.has(h.path)?(0,J.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,J.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:w?0:-1,"aria-label":k,title:k,"data-testid":"fs-tab-close",onClick:()=>o(h.key),children:"\xD7"})]},h.key)})})}function Pa({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,J.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,J.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,J.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,J.jsx)("span",{className:"fx-spacer"}),(0,J.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,J.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,J.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function xc(){return(0,J.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,J.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,J.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,J.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function bc(){return typeof document<"u"&&document.documentElement.dataset.platform!==void 0&&go()==="mac"?"\u2318W":"Ctrl+W"}function Ca({t:e}){return(0,J.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,J.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,J.jsx)(xc,{})}),(0,J.jsx)("strong",{children:e("panel.empty.title")}),(0,J.jsx)("span",{children:e("panel.empty.description")}),(0,J.jsxs)("span",{className:"fx-empty-keys",children:[(0,J.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,J.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,J.jsx)("kbd",{className:"fx-kbd",children:bc()}),(0,J.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Ta=require("react");function me(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Ta.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function kc(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var vc=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function Pn(e){let n=[],t=0;for(let r of e.matchAll(vc)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(me("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(me("strong",null,...Pn(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(me("del",null,...Pn(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(me("em",null,...Pn(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,u=a===null?void 0:kc(a[2]??"");n.push(u===void 0?l:me("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Ea=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Fa=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Ma=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,bo=/^\s{0,3}>\s?(.*)$/u,ko=/^\s{0,3}[-*+]\s+(.*)$/u,vo=/^\s{0,3}\d+[.)]\s+(.*)$/u;function wc(e){return Ea.test(e)||Fa.test(e)||Ma.test(e)||bo.test(e)||ko.test(e)||vo.test(e)}function La(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Ea.exec(r);if(o!==null){let s=(o[1]??"```").slice(0,1),c=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${s}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(me("pre",null,me("code",c===""?null:{className:`language-${c}`},f.join(`
`))));continue}let i=Fa.exec(r);if(i!==null){let s=(i[1]??"#").length;n.push(me(`h${String(s)}`,null,...Pn(i[2]??""))),t+=1;continue}if(Ma.test(r)){n.push(me("hr",null)),t+=1;continue}if(bo.test(r)){let s=[];for(;t<e.length;){let c=bo.exec(e[t]??"");if(c===null)break;s.push(c[1]??""),t+=1}n.push(me("blockquote",null,...La(s)));continue}if(ko.exec(r)!==null){let s=[];for(;t<e.length;){let c=ko.exec(e[t]??"");if(c===null)break;s.push(me("li",null,...Pn(c[1]??""))),t+=1}n.push(me("ul",null,...s));continue}if(vo.exec(r)!==null){let s=[];for(;t<e.length;){let c=vo.exec(e[t]??"");if(c===null)break;s.push(me("li",null,...Pn(c[1]??""))),t+=1}n.push(me("ol",null,...s));continue}let u=[r.trim()];for(t+=1;t<e.length;){let s=e[t]??"";if(s.trim()===""||wc(s))break;u.push(s.trim()),t+=1}n.push(me("p",null,...Pn(u.join(" "))))}return n}function ar(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return me("div",{className:"fx-md"},...La(n))}var Na=[{id:"bat",extensions:[".bat",".cmd"],filenames:[],filenamePatterns:[],aliases:["Batch","bat"],firstLine:null,disposition:"backlog"},{id:"clojure",extensions:[".clj",".cljs",".cljc",".cljx",".clojure",".edn"],filenames:[],filenamePatterns:[],aliases:["Clojure","clojure"],firstLine:null,disposition:"approx"},{id:"coffeescript",extensions:[".coffee",".cson",".iced"],filenames:[],filenamePatterns:[],aliases:["CoffeeScript","coffeescript","coffee"],firstLine:null,disposition:"approx"},{id:"jsonc",extensions:[".code-workspace","language-configuration.json","icon-theme.json","color-theme.json",".jsonc",".eslintrc",".eslintrc.json",".jsfmtrc",".jshintrc",".swcrc",".hintrc",".babelrc",".toolset.jsonc"],filenames:["settings.json","launch.json","tasks.json","mcp.json","keybindings.json","extensions.json","argv.json","profiles.json","devcontainer.json",".devcontainer.json","babel.config.json","bun.lock",".babelrc.json",".ember-cli","typedoc.json","tsconfig.json","jsconfig.json"],filenamePatterns:["**/.github/hooks/*.json","tsconfig.*.json","jsconfig.*.json","tsconfig-*.json","jsconfig-*.json"],aliases:["JSON with Comments"],firstLine:null,disposition:"approx"},{id:"json",extensions:[".code-profile",".json",".bowerrc",".jscsrc",".webmanifest",".js.map",".css.map",".ts.map",".har",".jslintrc",".jsonld",".geojson",".ipynb",".vuerc",".tsbuildinfo"],filenames:["composer.lock",".watchmanconfig"],filenamePatterns:[],aliases:["JSON","json"],firstLine:null,disposition:"exact",chunk:!0},{id:"ignore",extensions:[".gitignore_global",".gitignore",".git-blame-ignore-revs",".npmignore"],filenames:[".vscodeignore"],filenamePatterns:[".copilotignore"],aliases:["Ignore","ignore"],firstLine:null,disposition:"approx"},{id:"markdown",extensions:[".copilotmd",".md",".mkd",".mkdn",".mdwn",".mdown",".markdown",".markdn",".mdtxt",".mdtext",".litcoffee",".ron",".ronn",".workbook"],filenames:[],filenamePatterns:["**/.cursor/**/*.mdc"],aliases:["Markdown","markdown"],firstLine:null,disposition:"exact",chunk:!0},{id:"c",extensions:[".c",".i"],filenames:[],filenamePatterns:[],aliases:["C","c"],firstLine:null,disposition:"exact"},{id:"cpp",extensions:[".cpp",".cppm",".cc",".ccm",".cxx",".cxxm",".c++",".c++m",".hpp",".hh",".hxx",".h++",".h",".ii",".ino",".inl",".ipp",".ixx",".mpp",".mxx",".tpp",".txx",".hpp.in",".h.in"],filenames:[],filenamePatterns:[],aliases:["C++","Cpp","cpp"],firstLine:null,disposition:"exact"},{id:"cuda-cpp",extensions:[".cu",".cuh"],filenames:[],filenamePatterns:[],aliases:["CUDA C++"],firstLine:null,disposition:"approx"},{id:"csharp",extensions:[".cs",".csx",".cake"],filenames:[],filenamePatterns:[],aliases:["C#","csharp"],firstLine:null,disposition:"approx"},{id:"css",extensions:[".css"],filenames:[],filenamePatterns:[],aliases:["CSS","css"],firstLine:null,disposition:"exact",chunk:!0},{id:"dart",extensions:[".dart"],filenames:[],filenamePatterns:[],aliases:["Dart"],firstLine:null,disposition:"approx"},{id:"diff",extensions:[".diff",".patch",".rej"],filenames:[],filenamePatterns:[],aliases:["Diff","diff"],firstLine:null,disposition:"approx"},{id:"dockerfile",extensions:[".dockerfile",".containerfile"],filenames:["Dockerfile","Containerfile"],filenamePatterns:["Dockerfile.*","Containerfile.*"],aliases:["Docker","Dockerfile","Containerfile"],firstLine:null,disposition:"approx"},{id:"dotenv",extensions:[".env"],filenames:[".env",".flaskenv","user-dirs.dirs"],filenamePatterns:[".env.*"],aliases:["Dotenv"],firstLine:null,disposition:"approx"},{id:"fsharp",extensions:[".fs",".fsi",".fsx",".fsscript"],filenames:[],filenamePatterns:[],aliases:["F#","FSharp","fsharp"],firstLine:null,disposition:"approx"},{id:"git-commit",extensions:[],filenames:["COMMIT_EDITMSG","MERGE_MSG"],filenamePatterns:[],aliases:["Git Commit Message","git-commit"],firstLine:null,disposition:"backlog"},{id:"git-rebase",extensions:[],filenames:["git-rebase-todo"],filenamePatterns:["**/rebase-merge/done"],aliases:["Git Rebase Message","git-rebase"],firstLine:null,disposition:"backlog"},{id:"go",extensions:[".go"],filenames:[],filenamePatterns:[],aliases:["Go"],firstLine:null,disposition:"exact"},{id:"groovy",extensions:[".groovy",".gvy",".gradle",".jenkinsfile",".nf"],filenames:["Jenkinsfile"],filenamePatterns:["Jenkinsfile*"],aliases:["Groovy","groovy"],firstLine:"^#!.*\\bgroovy\\b",disposition:"approx"},{id:"handlebars",extensions:[".handlebars",".hbs",".hjs"],filenames:[],filenamePatterns:[],aliases:["Handlebars","handlebars"],firstLine:null,disposition:"exact"},{id:"hlsl",extensions:[".hlsl",".hlsli",".fx",".fxh",".vsh",".psh",".cginc",".compute"],filenames:[],filenamePatterns:[],aliases:["HLSL","hlsl"],firstLine:null,disposition:"approx"},{id:"html",extensions:[".html",".htm",".shtml",".xhtml",".xht",".mdoc",".jsp",".asp",".aspx",".jshtm",".volt",".ejs",".rhtml"],filenames:[],filenamePatterns:[],aliases:["HTML","htm","html","xhtml"],firstLine:null,disposition:"exact",chunk:!0},{id:"ini",extensions:[".ini"],filenames:[],filenamePatterns:[],aliases:["Ini","ini"],firstLine:null,disposition:"approx"},{id:"properties",extensions:[".conf",".properties",".cfg",".directory",".gitattributes",".gitconfig",".gitmodules",".editorconfig",".repo",".npmrc"],filenames:["gitconfig"],filenamePatterns:["**/.config/git/config","**/.git/config"],aliases:["Properties","properties"],firstLine:null,disposition:"approx"},{id:"java",extensions:[".java",".jav"],filenames:[],filenamePatterns:[],aliases:["Java","java"],firstLine:null,disposition:"exact"},{id:"javascriptreact",extensions:[".jsx"],filenames:[],filenamePatterns:[],aliases:["JavaScript JSX","JavaScript React","jsx"],firstLine:null,disposition:"exact",chunk:!0},{id:"javascript",extensions:[".js",".es6",".mjs",".cjs",".pac"],filenames:["jakefile"],filenamePatterns:[],aliases:["JavaScript","javascript","js"],firstLine:"^#!.*\\bnode",disposition:"exact",chunk:!0},{id:"jsx-tags",extensions:[],filenames:[],filenamePatterns:[],aliases:[],firstLine:null,disposition:"excluded"},{id:"jsonl",extensions:[".jsonl",".ndjson"],filenames:[],filenamePatterns:[],aliases:["JSON Lines"],firstLine:null,disposition:"approx"},{id:"snippets",extensions:[".code-snippets"],filenames:[],filenamePatterns:["**/User/snippets/*.json","**/User/profiles/*/snippets/*.json","**/snippets*.json"],aliases:["Code Snippets"],firstLine:null,disposition:"approx"},{id:"julia",extensions:[".jl"],filenames:[],filenamePatterns:[],aliases:["Julia","julia"],firstLine:"^#!\\s*/.*\\bjulia[0-9.-]*\\b",disposition:"approx"},{id:"juliamarkdown",extensions:[".jmd"],filenames:[],filenamePatterns:[],aliases:["Julia Markdown","juliamarkdown"],firstLine:null,disposition:"approx"},{id:"tex",extensions:[".sty",".cls",".bbx",".cbx"],filenames:[],filenamePatterns:[],aliases:["TeX","tex"],firstLine:null,disposition:"approx"},{id:"latex",extensions:[".tex",".ltx",".ctx"],filenames:[],filenamePatterns:[],aliases:["LaTeX","latex"],firstLine:null,disposition:"approx"},{id:"bibtex",extensions:[".bib"],filenames:[],filenamePatterns:[],aliases:["BibTeX","bibtex"],firstLine:null,disposition:"backlog"},{id:"cpp_embedded_latex",extensions:[],filenames:[],filenamePatterns:[],aliases:[],firstLine:null,disposition:"excluded"},{id:"markdown_latex_combined",extensions:[],filenames:[],filenamePatterns:[],aliases:[],firstLine:null,disposition:"excluded"},{id:"less",extensions:[".less"],filenames:[],filenamePatterns:[],aliases:["Less","less"],firstLine:null,disposition:"exact"},{id:"log",extensions:[".log","*.log.?"],filenames:[],filenamePatterns:[],aliases:["Log"],firstLine:null,disposition:"backlog"},{id:"lua",extensions:[".lua"],filenames:[],filenamePatterns:[],aliases:["Lua","lua"],firstLine:null,disposition:"approx"},{id:"makefile",extensions:[".mak",".mk"],filenames:["Makefile","makefile","GNUmakefile","OCamlMakefile"],filenamePatterns:[],aliases:["Makefile","makefile"],firstLine:"^#!\\s*/usr/bin/make",disposition:"backlog"},{id:"markdown-math",extensions:[],filenames:[],filenamePatterns:[],aliases:[],firstLine:null,disposition:"excluded"},{id:"objective-c",extensions:[".m"],filenames:[],filenamePatterns:[],aliases:["Objective-C"],firstLine:null,disposition:"approx"},{id:"objective-cpp",extensions:[".mm"],filenames:[],filenamePatterns:[],aliases:["Objective-C++"],firstLine:null,disposition:"approx"},{id:"perl",extensions:[".pl",".pm",".pod",".t",".PL",".psgi"],filenames:[],filenamePatterns:[],aliases:["Perl","perl"],firstLine:"^#!.*\\bperl\\b",disposition:"approx"},{id:"raku",extensions:[".raku",".rakumod",".rakutest",".rakudoc",".nqp",".p6",".pl6",".pm6"],filenames:[],filenamePatterns:[],aliases:["Raku","Perl6","perl6"],firstLine:"(^#!.*\\bperl6\\b)|use\\s+v6|raku|=begin\\spod|my\\sclass",disposition:"approx"},{id:"php",extensions:[".php",".php4",".php5",".phtml",".ctp"],filenames:[],filenamePatterns:[],aliases:["PHP","php"],firstLine:"^#!\\s*/.*\\bphp\\b",disposition:"exact"},{id:"powershell",extensions:[".ps1",".psm1",".psd1",".pssc",".psrc"],filenames:[],filenamePatterns:[],aliases:["PowerShell","powershell","ps","ps1","pwsh"],firstLine:"^#!\\s*/.*\\bpwsh\\b",disposition:"approx"},{id:"prompt",extensions:[".prompt.md"],filenames:[],filenamePatterns:[],aliases:["Prompt","prompt"],firstLine:null,disposition:"approx"},{id:"instructions",extensions:[".instructions.md","copilot-instructions.md"],filenames:[],filenamePatterns:["**/.claude/rules/**/*.md"],aliases:["Instructions","instructions"],firstLine:null,disposition:"approx"},{id:"chatagent",extensions:[".agent.md",".chatmode.md"],filenames:[],filenamePatterns:["**/.github/agents/*.md","**/.claude/agents/*.md"],aliases:["Agent","chat agent"],firstLine:null,disposition:"approx"},{id:"skill",extensions:[],filenames:["SKILL.md"],filenamePatterns:[],aliases:["Skill","skill"],firstLine:null,disposition:"approx"},{id:"jade",extensions:[".pug",".jade"],filenames:[],filenamePatterns:[],aliases:["Pug","Jade","jade"],firstLine:null,disposition:"approx"},{id:"python",extensions:[".py",".rpy",".pyw",".cpy",".gyp",".gypi",".pyi",".ipy",".pyt"],filenames:["SConstruct","SConscript"],filenamePatterns:[],aliases:["Python","py"],firstLine:"^#!\\s*/?.*\\bpython[0-9.-]*\\b",disposition:"exact",chunk:!0},{id:"r",extensions:[".R",".Rhistory",".Rprofile",".rt"],filenames:[],filenamePatterns:[],aliases:["R","r"],firstLine:null,disposition:"approx"},{id:"razor",extensions:[".cshtml",".razor"],filenames:[],filenamePatterns:[],aliases:["Razor","razor"],firstLine:null,disposition:"approx"},{id:"restructuredtext",extensions:[".rst"],filenames:[],filenamePatterns:[],aliases:["reStructuredText"],firstLine:null,disposition:"backlog"},{id:"ruby",extensions:[".rb",".rbx",".rjs",".gemspec",".rake",".ru",".erb",".podspec",".rbi"],filenames:["rakefile","gemfile","guardfile","podfile","capfile","cheffile","hobofile","vagrantfile","appraisals","rantfile","berksfile","berksfile.lock","thorfile","puppetfile","dangerfile","brewfile","fastfile","appfile","deliverfile","matchfile","scanfile","snapfile","gymfile"],filenamePatterns:[],aliases:["Ruby","rb"],firstLine:"^#!\\s*/.*\\bruby\\b",disposition:"approx"},{id:"rust",extensions:[".rs"],filenames:[],filenamePatterns:[],aliases:["Rust","rust"],firstLine:null,disposition:"exact"},{id:"scss",extensions:[".scss"],filenames:[],filenamePatterns:[],aliases:["SCSS","scss"],firstLine:null,disposition:"exact"},{id:"search-result",extensions:[".code-search"],filenames:[],filenamePatterns:[],aliases:["Search Result"],firstLine:null,disposition:"backlog"},{id:"shaderlab",extensions:[".shader"],filenames:[],filenamePatterns:[],aliases:["ShaderLab","shaderlab"],firstLine:null,disposition:"approx"},{id:"shellscript",extensions:[".sh",".bash",".bashrc",".bash_aliases",".bash_profile",".bash_login",".ebuild",".eclass",".profile",".bash_logout",".xprofile",".xsession",".xsessionrc",".Xsession",".zsh",".zshrc",".zprofile",".zlogin",".zlogout",".zshenv",".zsh-theme",".fish",".ksh",".csh",".cshrc",".tcshrc",".yashrc",".yash_profile"],filenames:["APKBUILD","PKGBUILD",".envrc",".hushlogin","zshrc","zshenv","zlogin","zprofile","zlogout","bashrc_Apple_Terminal","zshrc_Apple_Terminal"],filenamePatterns:[],aliases:["Shell Script","shellscript","bash","fish","sh","zsh","ksh","csh"],firstLine:"^#!.*\\b(bash|fish|zsh|sh|ksh|dtksh|pdksh|mksh|ash|dash|yash|sh|csh|jcsh|tcsh|itcsh).*|^#\\s*-\\*-[^*]*mode:\\s*shell-script[^*]*-\\*-",disposition:"approx"},{id:"sql",extensions:[".sql",".dsql"],filenames:[],filenamePatterns:[],aliases:["MS SQL","T-SQL"],firstLine:null,disposition:"exact"},{id:"swift",extensions:[".swift"],filenames:[],filenamePatterns:[],aliases:["Swift","swift"],firstLine:null,disposition:"approx"},{id:"typescript",extensions:[".ts",".cts",".mts"],filenames:[],filenamePatterns:[],aliases:["TypeScript","ts","typescript"],firstLine:"^#!.*\\b(deno|bun|ts-node)\\b",disposition:"exact",chunk:!0},{id:"typescriptreact",extensions:[".tsx"],filenames:[],filenamePatterns:[],aliases:["TypeScript JSX","TypeScript React","tsx"],firstLine:null,disposition:"exact",chunk:!0},{id:"vb",extensions:[".vb",".brs",".vbs",".bas",".vba"],filenames:[],filenamePatterns:[],aliases:["Visual Basic","vb"],firstLine:null,disposition:"approx"},{id:"xml",extensions:[".xml",".xsd",".ascx",".atom",".axml",".axaml",".bpmn",".cpt",".csl",".csproj",".csproj.user",".dita",".ditamap",".dtd",".ent",".mod",".dtml",".fsproj",".fxml",".iml",".isml",".jmx",".launch",".menu",".mxml",".nuspec",".opml",".owl",".proj",".props",".pt",".publishsettings",".pubxml",".pubxml.user",".rbxlx",".rbxmx",".rdf",".rng",".rss",".shproj",".slnx",".storyboard",".svg",".targets",".tld",".tmx",".vbproj",".vbproj.user",".vcxproj",".vcxproj.filters",".wixproj",".wsdl",".wxi",".wxl",".wxs",".xaml",".xbl",".xib",".xlf",".xliff",".xpdl",".xul",".xoml"],filenames:[],filenamePatterns:[],aliases:["XML","xml"],firstLine:"(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)",disposition:"exact"},{id:"xsl",extensions:[".xsl",".xslt"],filenames:[],filenamePatterns:[],aliases:["XSL","xsl"],firstLine:null,disposition:"exact"},{id:"dockercompose",extensions:[],filenames:[],filenamePatterns:["compose.yml","compose.yaml","compose.*.yml","compose.*.yaml","*docker*compose*.yml","*docker*compose*.yaml"],aliases:["Compose","compose"],firstLine:null,disposition:"approx"},{id:"yaml",extensions:[".yaml",".yml",".eyaml",".eyml",".cff",".yaml-tmlanguage",".yaml-tmpreferences",".yaml-tmtheme",".winget"],filenames:[],filenamePatterns:[],aliases:["YAML","yaml"],firstLine:"^#cloud-config",disposition:"exact",chunk:!0}];var wo=[{suffix:".h",from:"cpp",to:"c",reason:"VS Code associates a bare .h with C; the C++ grammar mis-colours plain C headers"},{suffix:".cfg",from:"properties",to:"plaintext",reason:"the properties grammar is an ini scheme, so generic .cfg files would be painted in the wrong colours"}],Ia=[{suffix:".mdx",to:"markdown",reason:"upstream has no row for .mdx; the read-only surface already reads it as markdown, and unknown would drop markdown reading mode"},{suffix:".json5",to:"json",reason:"the old hardcoded table coloured .json5 as json; upstream has no row, so this keeps it coloured"},{suffix:".sass",to:"css",reason:"the old hardcoded table coloured .sass as css; upstream has no row, so this keeps it coloured"},{suffix:".pcss",to:"css",reason:"the old hardcoded table coloured .pcss as css; upstream has no row, so this keeps it coloured"},{suffix:".postcss",to:"css",reason:"the old hardcoded table coloured .postcss as css; upstream has no row, so this keeps it coloured"}],Sc=[{id:"vue",extensions:[".vue"],filenames:[],filenamePatterns:[],aliases:["Vue","vue"],firstLine:null,disposition:"approx",chunk:"html",nonBuiltin:!0,reason:"not a VS Code builtin; the official Vue grammar is html-based and both surfaces already mapped it to html"},{id:"svelte",extensions:[".svelte"],filenames:[],filenamePatterns:[],aliases:["Svelte","svelte"],firstLine:null,disposition:"approx",chunk:"html",nonBuiltin:!0,reason:"not a VS Code builtin; the official Svelte grammar is html-based and both surfaces already mapped it to html"}],Aa={id:"plaintext",extensions:[".txt",".text"],filenames:["LICENSE","README","CHANGELOG"],filenamePatterns:[],aliases:["Plain Text","plaintext"],firstLine:null,disposition:"exact",nonBuiltin:!0,reason:"repo-owned row: upstream has no plaintext language, and this row carries the suffixes and filenames this repo decided are monochrome"},ct={css:"css",html:"html",javascript:"javascript",javascriptreact:"javascriptreact",json:"json",markdown:"markdown",python:"python",typescript:"typescript",typescriptreact:"typescriptreact",yaml:"yaml",vue:"html",svelte:"html",razor:"html",juliamarkdown:"markdown",prompt:"markdown",instructions:"markdown",chatagent:"markdown",skill:"markdown",dockercompose:"yaml",c:"batch-systems",cpp:"batch-systems","objective-c":"batch-systems","objective-cpp":"batch-systems","cuda-cpp":"batch-systems",hlsl:"batch-systems",shaderlab:"batch-systems",csharp:"batch-systems",dart:"batch-systems",fsharp:"batch-systems",vb:"batch-systems",go:"batch-script",rust:"batch-script",swift:"batch-script",java:"batch-script",groovy:"batch-script",clojure:"batch-script",ruby:"batch-script",perl:"batch-script",raku:"batch-script",lua:"batch-script",r:"batch-script",julia:"batch-script",powershell:"batch-script",shellscript:"batch-script",coffeescript:"batch-script",php:"batch-webstyle",handlebars:"batch-webstyle",less:"batch-webstyle",scss:"batch-webstyle",properties:"batch-webstyle",ini:"batch-webstyle",ignore:"batch-webstyle",dotenv:"batch-webstyle",jade:"batch-webstyle",sql:"batch-datadoc",xml:"batch-datadoc",xsl:"batch-datadoc",jsonc:"batch-datadoc",jsonl:"batch-datadoc",snippets:"batch-datadoc",diff:"batch-datadoc",dockerfile:"batch-datadoc",tex:"batch-datadoc",latex:"batch-datadoc"};function Rc(e){let n={id:e.id,extensions:e.extensions,filenames:e.filenames,filenamePatterns:e.filenamePatterns,aliases:e.aliases,firstLine:e.firstLine,disposition:e.disposition,nonBuiltin:!1},t=ct[e.id],r=t===void 0?n:{...n,chunk:t};if(e.disposition==="exact")return r;let o=Pc[e.id],i=Cc[e.id];if(o===void 0&&i===void 0)throw new Error(`non-exact row without a grammar or a reason: ${e.id}`);return{...r,...o===void 0?{}:{grammar:o},reason:i??`approximated by ${o}`}}var Pc={clojure:"mode/clojure",coffeescript:"mode/coffeescript",csharp:"mode/clike#csharp",dart:"mode/clike#dart",diff:"mode/diff",dockerfile:"mode/dockerfile",fsharp:"mode/mllike#fsharp",groovy:"mode/groovy",ini:"mode/properties",properties:"mode/properties",julia:"mode/julia",tex:"mode/stex",latex:"mode/stex",lua:"mode/lua","objective-c":"mode/clike#objective-c","objective-cpp":"mode/clike#objective-cpp",perl:"mode/perl",powershell:"mode/powershell",jade:"mode/pug",r:"mode/r",ruby:"mode/ruby",shellscript:"mode/shell",swift:"mode/swift",vb:"mode/vb",jsonc:"mode/javascript",jsonl:"mode/javascript",snippets:"mode/javascript",ignore:"mode/properties",dotenv:"mode/properties",raku:"mode/perl","cuda-cpp":"mode/clike#cpp",hlsl:"mode/clike#cpp",shaderlab:"mode/clike#cpp",razor:"lang-html",juliamarkdown:"lang-markdown",prompt:"lang-markdown",instructions:"lang-markdown",chatagent:"lang-markdown",skill:"lang-markdown",dockercompose:"lang-yaml"},Cc={bat:"no grammar or mode covers batch files; a forced approximation would mis-colour","git-commit":"no grammar covers commit messages; the file is a filename-only entry","git-rebase":"no grammar covers rebase todos; the file is a filename-only entry",log:"no grammar covers log files; the wildcard entry is not a suffix claim",bibtex:"no grammar or mode covers bibtex",makefile:"no grammar covers makefiles; kept as a filename row so the mechanism is visible",restructuredtext:"no grammar or mode covers reStructuredText","search-result":"no grammar covers VS Code search output","jsx-tags":"injected inside the javascript grammar; there is no file that opens as this language",cpp_embedded_latex:"a combined grammar inside the latex extension; no file opens as this language",markdown_latex_combined:"a combined grammar inside the latex extension; no file opens as this language","markdown-math":"injected inside the markdown grammar; there is no file that opens as this language"};function Tc(e){let n=new Map;for(let o of wo)n.set(o.suffix,o);let t=e.map(o=>{let i=o.extensions.filter(a=>{let l=n.get(a.toLowerCase());return l===void 0||l.from!==o.id});return i.length===o.extensions.length?o:{...o,extensions:i}});for(let o of wo){let i=t.find(a=>a.id===o.to);if(i===void 0)throw new Error(`suffix move target missing: ${o.to}`);if(i.extensions.some(a=>a.toLowerCase()===o.suffix))throw new Error(`suffix move target already owns ${o.suffix}: ${o.to}`)}let r=t.map(o=>{let i=wo.filter(a=>a.to===o.id).map(a=>a.suffix);return i.length===0?o:{...o,extensions:[...o.extensions,...i]}});for(let o of Ia){let i=r.find(a=>a.extensions.some(l=>l.toLowerCase()===o.suffix));if(i!==void 0)throw new Error(`suffix addition ${o.suffix} is already owned by ${i.id}`)}return r.map(o=>{let i=Ia.filter(a=>a.to===o.id).map(a=>a.suffix);return i.length===0?o:{...o,extensions:[...o.extensions,...i]}})}var So=Tc([...Na.map(Rc),Aa]),gn=[...So,...Sc],Ba=Aa.id;function Da(e){return/[*?[\]]/.test(e)}function Ec(e){return!e.startsWith(".")&&!Da(e)}function Fc(e=gn){let n=new Map,t=[],r=[];for(let o of e)for(let i of o.extensions){if(Da(i)){t.push({id:o.id,entry:i});continue}if(Ec(i)){r.push({id:o.id,entry:i});continue}let a=i.toLowerCase(),l=n.get(a);if(l!==void 0&&l!==o.id)throw new Error(`suffix ${a} claimed by both ${l} and ${o.id}`);n.set(a,o.id)}return{bySuffix:n,wildcards:t,bareNames:r}}var sr=Fc(),Oa=[...sr.bySuffix.keys()].sort((e,n)=>n.length-e.length),ut=new Map(gn.map(e=>[e.id,e]));var Mc="(?:[^/]+/)*";function Lc(e){return/[.*+?^${}()|[\]\\]/.test(e)?"\\"+e:e}function Nc(e,n){let t=n+1,r="[";for((e[t]==="!"||e[t]==="^")&&(r+="^",t++),e[t]==="]"&&(r+="\\]",t++);t<e.length;t++){let o=e[t];if(o==="]")return{source:r+"]",next:t+1};r+=o==="\\"?"\\\\":o}return{source:"\\[",next:n+1}}function ja(e){let n="^",t=0;for(;t<e.length;){let o=e[t];if(o==="*"){if(e[t+1]==="*"){e[t+2]==="/"?(n+=Mc,t+=3):(n+=".*",t+=2);continue}n+="[^/]*",t++;continue}if(o==="?"){n+="[^/]",t++;continue}if(o==="["){let i=Nc(e,t);n+=i.source,t=i.next;continue}n+=Lc(o),t++}n+="$";let r=new RegExp(n);return o=>r.test(o)}function Wa(e){let n=e.replace(/\\/g,"/"),t=n.lastIndexOf("/");return t===-1?n:n.slice(t+1)}var Ic=gn.flatMap(e=>e.filenamePatterns.map(n=>{let t=ja(n),r=n.includes("/");return{id:e.id,match:o=>t(r?o.replace(/\\/g,"/"):Wa(o))}})),Ac=new Map(gn.flatMap(e=>[...e.filenames.map(n=>[n,e.id]),...sr.bareNames.filter(n=>n.id===e.id).map(n=>[n.entry,e.id])])),_a=new Map;function Bc(e){let n=_a.get(e);if(n!==void 0)return n;let t=null;try{t=new RegExp(e)}catch{t=null}return _a.set(e,t),t}var Dc=So.filter(e=>e.firstLine!==null);function Oc(e){let n=Wa(e),t=Ac.get(n);if(t!==void 0)return t;for(let o of Ic)if(o.match(e))return o.id;let r=n.toLowerCase();for(let o of Oa)if(r.endsWith(o))return sr.bySuffix.get(o)??null;return null}function jc(e){let n=e.split(/\r?\n/,1)[0]??"";for(let t of Dc){let r=Bc(t.firstLine);if(r!==null&&r.test(n))return t.id}return null}function zn(e,n){let t=Oc(e);if(t!==null)return ut.get(t)??null;if(n!==void 0&&n!==""){let r=jc(n);if(r!==null)return ut.get(r)??null}return null}function dr(e){return zn(e)?.id??Ba}var lr=Object.freeze(Object.fromEntries(gn.filter(e=>e.chunk!==void 0).map(e=>[e.id,`client.lang-${e.chunk}.js`]))),Tp=Object.freeze(Object.fromEntries([...new Set(Object.values(ct))].map(e=>[e,Object.freeze(Object.keys(ct).filter(n=>ct[n]===e))])));function _c(e){return e!==null&&typeof e=="object"}function rn(e){let n=_c(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var Ro=200;function pt(e){return dr(e)==="markdown"}var ke=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function cr(e){return e!==null&&typeof e=="object"}function Wc(e){return e===""?0:e.split(`
`).length}function Kn(e,n){if(!cr(e))throw new ke("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=cr(e.error)?e.error:{},f=typeof c.code=="string"?c.code:"preview/unknown",y=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",h=cr(c.details)?c.details:{},R=typeof h.kind=="string"?h.kind:"";throw new ke(f,y,R)}let t=e.ok===!0?e.value:e;if(!cr(t)||typeof t.text!="string")throw new ke("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Wc(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,s={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?s:{...s,totalLines:o}}var ft=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function ur({files:e,maxLines:n=Ro}){let t=Math.max(1,Math.trunc(n)),r=ft,o=0,i=null,a=[1],l=new Set,u=c=>{r=c;for(let f of l)f()},s=async(c,f)=>{o+=1;let y=o;i?.abort();let h=new AbortController;i=h,u({status:"loading",path:c,text:r.path===c?r.text:"",offset:f,lines:r.path===c?r.lines:0,...r.path===c&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===c&&r.source!==void 0?{source:r.source}:{},eof:r.path===c?r.eof:!1});try{let R=await e.read(c,f>1?{offset:f,limit:t}:{limit:t},h.signal);if(y!==o)return;let w=Kn(R,f);if(w.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let m={status:"ready",path:c,text:w.text,offset:w.offset,lines:w.lines,eof:w.eof,...w.source===void 0?{}:{source:w.source},...w.linkTarget===void 0?{}:{linkTarget:w.linkTarget,linkPath:c}};u(w.totalLines===void 0?m:{...m,totalLines:w.totalLines})}catch(R){if(y!==o||h.signal.aborted)return;u({status:"failed",path:c,text:"",offset:f,lines:0,eof:!1,failure:rn(R)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(c){return l.add(c),()=>{l.delete(c)}},async open(c){a=[1],await s(c,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let c=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&c>r.totalLines||(a.push(c),await s(r.path,c))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let c=a[a.length-1]??1;await s(r.path,c)},async retry(){r.path!==void 0&&await s(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(ft)}}}function fr(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Po=Object.freeze({chunk:qr.chunk,id:`${se}/${qr.chunk}`}),gr=null,mt=null,pr=new Map,mr=new Map,Kp=Object.freeze([...new Set(Object.values(lr))].map(e=>e.replace(/^client\.lang-/u,"").replace(/\.js$/u,"")));function $a(e){gr=e}function za(){return Po}function $c(e){let n=Dt[e];return{chunk:n,id:`${se}/${n}`}}function zc(e){let n=lr[e];return n===void 0?null:{chunk:n,id:`${se}/${n}`}}function Co(e){return lr[e]!==void 0}function Ka(e){let n=zc(e);if(n===null)return Promise.reject(new Error(`${se}: no language chunk for ${e}`));let t=mr.get(n.chunk);if(t!==void 0)return t;let r=gr;if(r===null||typeof r.async!="function")return Promise.reject(new Error(`${se}: the loader require was not handed over`));let o=n.chunk.replace(/^client\.lang-/u,"").replace(/\.js$/u,""),i=r.async(`./${n.chunk}`).then(a=>{let l=a;if(l===null||typeof l.mount!="function"||l.renderer!==o)throw new Error(`${se}: chunk ${n.id} is not the ${o} renderer`);return l});return mr.set(n.chunk,i),i.catch(()=>{mr.get(n.chunk)===i&&mr.delete(n.chunk)}),i}function To(){if(mt!==null)return mt;let e=gr;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${se}: the loader require was not handed over`));let n=e.async(`./${Po.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${se}: chunk ${Po.id} is missing its preview renderers`);return r.boot?.(e),r});return mt=n,n.catch(()=>{mt===n&&(mt=null)}),n}function Ha(e){let n=pr.get(e);if(n!==void 0)return n;let t=gr;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${se}: the loader require was not handed over`));let r=$c(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${se}: chunk ${r.id} is not the ${e} view`);return a});return pr.set(e,o),o.catch(()=>{pr.get(e)===o&&pr.delete(e)}),o}var Ga=Object.freeze({}),Kc="@deepseek-ai/dsh-client-ui-primitives",Fo=null,Eo;function Va(e){Fo=e}function Hc(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function yr(){if(Eo!=null)return Eo;if(Fo===null)return Ga;let e=Hc(Fo,Kc);if(e===void 0)return Ga;let n=c=>{let f=e[c];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=c=>{let f=e[c];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let s=t("useAnchoredPosition");return s!==void 0&&(r.useAnchoredPosition=s),r}var W=require("react");async function Cn(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}function Gc(e){return e.replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function hr(e,n){if(e===""||n==="")return[];let t=[];for(let r of e.matchAll(new RegExp(Gc(n),"giu"))){let o=r.index;if(o===void 0)continue;let i=o+r[0].length;i>o&&t.push({from:o,to:i})}return t}function qa(e,n,t){return n<=0?0:((e+t)%n+n)%n}function Ua(e){let n=[],t=[],r=0,o=0;return e.forEach((i,a)=>{a>0&&(n.push(`
`),r+=1);for(let l of i)l!==""&&t.push({node:o,start:r,length:l.length}),n.push(l),r+=l.length,o+=1}),{text:n.join(""),runs:t}}function Mo(e,n){let t=Math.max(0,Math.min(n,e.text.length)),r;for(let o of e.runs){if(o.start>t)break;r=o}if(r!==void 0)return{node:r.node,offset:Math.min(t-r.start,r.length)}}function Xa(e){let n=null,t=null,r=[],o=i=>{let a=e.text();return(a!==n||i!==t)&&(n=a,t=i,r=hr(a,i)),r};return{scope:e.scope??"page",count:i=>o(i).length,reveal:(i,a)=>{let l=o(i)[a];l!==void 0&&e.select(l.from,l.to)},clear:e.clear}}var Vc=new Set(["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","BR","DD","DIV","DL","DT","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"]),qc=new Set(["SCRIPT","STYLE","TEMPLATE"]);function Uc(e){let n=[],t=[],r=o=>{for(let i of Array.from(o.childNodes)){if(i.nodeType===3){let s=i.data;if(s==="")continue;let c=n.at(-1);c===void 0?n.push([s]):c.push(s),t.push(i);continue}if(i.nodeType!==1)continue;let a=i,l=a.tagName.toUpperCase();if(qc.has(l))continue;if(l==="BR"){n.push([]);continue}let u=Vc.has(l);u&&n.push([]),r(a),u&&n.push([])}};return r(e),{layout:Ua(n),nodes:t}}function Ya(e){let n=()=>{let r=e();return r===null?void 0:Uc(r)},t=()=>e()?.ownerDocument.defaultView?.getSelection()??void 0;return{scope:"page",count:r=>{let o=n();return o===void 0?0:hr(o.layout.text,r).length},reveal:(r,o)=>{let i=n(),a=e();if(i===void 0||a===null)return;let l=hr(i.layout.text,r)[o];if(l===void 0)return;let u=Mo(i.layout,l.from),s=Mo(i.layout,l.to);if(u===void 0||s===void 0)return;let c=i.nodes[u.node],f=i.nodes[s.node];if(c===void 0||f===void 0)return;let y=a.ownerDocument.createRange();try{y.setStart(c,Math.min(u.offset,c.data.length)),y.setEnd(f,Math.min(s.offset,f.data.length))}catch{return}let h=t();h!==void 0&&(h.removeAllRanges(),h.addRange(y));let R=y.startContainer.parentElement;R!==null&&typeof R.scrollIntoView=="function"&&R.scrollIntoView({block:"center"})},clear:()=>t()?.removeAllRanges()}}var on=require("react/jsx-runtime");function Xc(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Yc(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Lo({failure:e,t:n,onRetry:t}){return(0,on.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,on.jsx)("strong",{children:Xc(e,n)}),(0,on.jsx)("span",{children:Yc(e,n)}),e.message===""?null:(0,on.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,on.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function No({t:e}){return(0,on.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,on.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var Ee=require("react");var yn=require("react/jsx-runtime");function Ja({t:e,surface:n,stamp:t,onClose:r}){let[o,i]=(0,Ee.useState)(""),[a,l]=(0,Ee.useState)(0),[u,s]=(0,Ee.useState)(0),c=(0,Ee.useRef)(null),f=(0,Ee.useRef)(null);(0,Ee.useEffect)(()=>{c.current?.focus()},[]),(0,Ee.useEffect)(()=>{if(o===""){s(0),l(0);return}let k=n().count(o);s(k),l(P=>k===0?0:Math.min(P,k-1))},[o,t,n]),(0,Ee.useEffect)(()=>{if(o===""||u===0)return;let k=document.activeElement;f.current!==null&&k!==null&&!f.current.contains(k)||n().reveal(o,a)},[o,a,u,t,n]);let y=(0,Ee.useCallback)(()=>{n().clear(),r()},[n,r]),h=(0,Ee.useCallback)(k=>{u!==0&&l(P=>qa(P,u,k))},[u]),R=k=>{if(!k.nativeEvent.isComposing){if(k.key==="Escape"){k.preventDefault(),k.stopPropagation(),y();return}if(k.key==="Enter"){k.preventDefault(),h(k.shiftKey?-1:1);return}(k.key==="ArrowDown"||k.key==="ArrowUp")&&k.stopPropagation()}},w=n().scope,m=o===""?e(`preview.find.hint.${w}`):u===0?e(`preview.find.none.${w}`):e(`preview.find.count.${w}`).replace("{index}",String(a+1)).replace("{count}",String(u));return(0,yn.jsxs)("div",{ref:f,className:"fx-find","data-testid":"fs-preview-find-bar",onKeyDown:R,children:[(0,yn.jsx)("input",{ref:c,type:"search",className:"fx-find-input","data-testid":"fs-preview-find-input",value:o,spellCheck:!1,autoComplete:"off",placeholder:e("preview.find.placeholder"),"aria-label":e("preview.find.placeholder"),onChange:k=>{i(k.currentTarget.value),l(0)}}),(0,yn.jsx)("span",{className:"fx-find-count","data-testid":"fs-preview-find-count","data-state":u===0?"empty":"ready",title:e(`preview.find.scope.${w}`),children:m}),(0,yn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-prev",disabled:u===0,title:e("preview.find.prev"),"aria-label":e("preview.find.prev"),onClick:()=>h(-1),children:"\u2191"}),(0,yn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-next",disabled:u===0,title:e("preview.find.next"),"aria-label":e("preview.find.next"),onClick:()=>h(1),children:"\u2193"}),(0,yn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find-close",title:e("preview.find.close"),"aria-label":e("preview.find.close"),onClick:y,children:"\xD7"})]})}var de=require("react");function Jc(e){if(e.startsWith("//")){let t=e.slice(2).split("/"),r=t[0]??"",o=t[1]??"";return o===""?`//${r}`:`//${r}/${o}`}let n=/^[A-Za-z]:/u.exec(e);return n===null?"/":n[0]}function Za(e){let t=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/(?<!^)\/{2,}/gu,"/").replace(/\/+$/u,"");if(t==="")return{absolute:!1,segments:[]};let r=nn(t),o=r?Jc(t):"",a=(r?t.slice(o.length):t).split("/").filter(s=>s!==""&&s!==".");if(a.length===0)return{absolute:!1,segments:[]};let l=[],u=o;for(let[s,c]of a.entries()){let f=u==="/"?`/${c}`:Ae(u,c);l.push({name:c,path:f,kind:s===a.length-1?"file":"directory",parent:u}),u=f}return{absolute:r,segments:l}}var Z=require("react");var Tn=require("react/jsx-runtime");function Qa(e,n){let t=Array.isArray(n)?n:[n];return(0,Tn.jsx)("svg",{width:e,height:e,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:t.map((r,o)=>(0,Tn.jsx)("path",{...r},o))})}function Hn({open:e=!0,size:n=14}){return e?Qa(n,[{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"},{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"}]):Qa(n,{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})}function Zc({name:e}){return(0,Tn.jsx)("span",{className:"fx-badge","data-icon":pn(e),"aria-hidden":"true",children:mn(e)})}function es({name:e,kind:n,open:t=!1}){return n==="directory"?(0,Tn.jsx)("span",{className:"fx-folder","data-open":t?"true":"false","aria-hidden":"true",children:(0,Tn.jsx)(Hn,{open:t})}):(0,Tn.jsx)(Zc,{name:e})}var ns=`
.fx-folder { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex: none; color: var(--fx-folder); }
.fx-folder[data-open="false"] { color: color-mix(in oklab, var(--fx-folder) 78%, var(--fx-caption)); }
.fx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--fx-fs-code) * 1.6364);
  height: calc(var(--fx-fs-code) * 1.3636);
  flex: none;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.7727);
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
.fx-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--fx-fs) * 0.8571); }
.fx-row-dir {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
  white-space: nowrap;
}
`;function rs(e,n,t,r=800){return t-n<=r?e:""}function os(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function is(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:Qc(e,t+1,r.depth,r.depth+1)}function Qc(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var eu=/^.$/u;function as(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!eu.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=ts(e.names,n),l=a.find(u=>u>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=ts(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function ts(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var H=require("react/jsx-runtime"),nu=22;function tu(){return(0,H.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,H.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function ss(){return(0,H.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,H.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,H.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function ds(){return(0,H.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,H.jsx)("circle",{cx:"7",cy:"7",r:"4.2"}),(0,H.jsx)("path",{d:"m10.2 10.2 3.3 3.3"})]})}function ls(){return(0,H.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,H.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function ru({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:u}){let s=e.kind==="directory",c={top:r,paddingLeft:8+e.depth*12};return(0,H.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...s?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":s?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",...e.ignored===!0?{"data-ignored":"true"}:{},title:e.ignored===!0?`${e.path} \xB7 ${o("status.ignored")}`:e.path,style:c,onClick:()=>{l(e.path),s?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,H.jsx)("span",{className:"fx-chevron","data-open":s&&e.expanded?"true":"false","data-visible":s?"true":"false","aria-hidden":"true",children:(0,H.jsx)(tu,{})}),(0,H.jsx)(es,{name:e.name,kind:e.kind,open:s&&e.expanded}),(0,H.jsx)("span",{className:"fx-name",children:e.name}),e.directory===void 0||e.directory===""?null:(0,H.jsx)("span",{className:"fx-row-dir","data-testid":"fx-row-dir",children:e.directory}),e.tag===void 0?null:(0,H.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,H.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":st(e.status),"data-testid":"fx-file-status",title:o(Ur(e.status)),"aria-label":o(Ur(e.status)),children:Wt(e.status)}),e.statusCount===void 0?null:(0,H.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,H.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,H.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,H.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,H.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,H.jsx)("span",{className:"fx-size",children:qt(e.size)})]})}function ou({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?e.label??t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,H.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,H.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,H.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,H.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,H.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function iu(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function cs({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:u,cursorRequest:s,onCursorMove:c}){let f=(0,Z.useRef)(null),[y,h]=(0,Z.useState)(0),[R,w]=(0,Z.useState)(0),m=aa(nu),[k,P]=(0,Z.useState)(void 0),j=(0,Z.useRef)(void 0),Y=(0,Z.useRef)({query:"",at:0}),I=(0,Z.useRef)(void 0),L=(0,Z.useRef)(void 0),X=(0,Z.useRef)(k);X.current=k;let D=(0,Z.useMemo)(()=>e.flatMap((x,A)=>x.type==="entry"?[A]:[]),[e]);(0,Z.useEffect)(()=>{let x=L.current!==n;if(L.current=n,I.current!==void 0||n===void 0)return;let A=X.current===void 0?void 0:e[X.current];if(!Hi({cursorPath:A?.type==="entry"?A.path:void 0,selectionMoved:x}))return;let N=e.findIndex(ee=>ee.type==="entry"&&ee.path===n);N>=0&&P(N)},[n,e]),(0,Z.useEffect)(()=>{let x=I.current;if(x===void 0)return;let A=e.findIndex(ce=>ce.type==="entry"&&ce.path===x),N=e[A];if(N?.type!=="entry"||N.kind!=="directory"||!N.expanded){I.current=void 0;return}let ee=Gi(e,x);ee!==void 0&&(I.current=void 0,P(ee))},[e]),(0,Z.useEffect)(()=>{k!==void 0&&e[k]?.type!=="entry"&&P(void 0)},[e,k]),(0,Z.useEffect)(()=>{let x=f.current;if(k===void 0||x===null)return;let A=Yr({scrollTop:x.scrollTop,viewport:x.clientHeight,rowHeight:m,index:k});A!==x.scrollTop&&(x.scrollTop=A)},[k,m]);let Q=(0,Z.useCallback)((x,A=!0)=>{P(x),A&&f.current?.focus({preventScroll:!0})},[]),he=(0,Z.useRef)(void 0);(0,Z.useEffect)(()=>{if(s===void 0||he.current===s.nonce)return;let x=D.at(-1);if(s.path!==void 0){let N=e.findIndex(ee=>ee.type==="entry"&&ee.path===s.path);he.current=s.nonce,N>=0&&Q(N,s.focus);return}if(s.delta===void 0){he.current=s.nonce;return}if(he.current=s.nonce,k===void 0){let N=s.delta>0?D[0]:x;N!==void 0&&Q(N,s.focus);return}let A=s.delta>0?D.find(N=>N>k):[...D].reverse().find(N=>N<k);A!==void 0&&Q(A,s.focus)},[s,k,D,Q,e]),(0,Z.useEffect)(()=>{if(c===void 0)return;let x=k===void 0?void 0:e[k];c(x?.type==="entry"?x.path:void 0)},[k,e,c]);let C=(0,Z.useCallback)(x=>{let A=e.findIndex(N=>N.type==="entry"&&N.path===x);A>=0&&P(A)},[e]),T=(0,Z.useCallback)((x,A,N)=>{C(x.path),u(x,A,N)},[C,u]),v=(0,Z.useCallback)(x=>{x.preventDefault(),u(void 0,{x:x.clientX,y:x.clientY},x.currentTarget)},[u]),E=(0,Z.useCallback)(x=>{if(x.nativeEvent.isComposing||x.altKey||x.metaKey||x.ctrlKey)return;let A=D.at(-1);if(x.key==="ArrowDown"){if(x.preventDefault(),k===void 0){D[0]!==void 0&&Q(D[0]);return}let G=D.find(V=>V>k);G!==void 0&&Q(G);return}if(x.key==="ArrowUp"){if(x.preventDefault(),k===void 0){A!==void 0&&Q(A);return}let G=[...D].reverse().find(V=>V<k);G!==void 0&&Q(G);return}if(x.key==="PageDown"||x.key==="PageUp"){x.preventDefault();let G=f.current?.clientHeight||R||480,V=Ki(D,k,x.key==="PageUp"?-1:1,zi(G,m));V!==void 0&&Q(V);return}if(k===void 0)return;let N=e[k];if(N===void 0||N.type!=="entry")return;if(x.key==="ArrowRight"){if(x.preventDefault(),N.kind==="directory"&&!N.expanded)I.current=N.path,o(N.path);else{let G=D.find(V=>V>k);G!==void 0&&e[G]?.depth===N.depth+1&&Q(G)}return}if(x.key==="ArrowLeft"){if(x.preventDefault(),N.kind==="directory"&&N.expanded)o(N.path);else{let G=[...D].reverse().find(V=>V<k&&e[V]?.type==="entry"&&e[V].depth<N.depth);G!==void 0&&Q(G)}return}if(x.key==="Enter"&&N.kind!=="directory"){x.preventDefault(),i(N.path);return}if(x.key==="ContextMenu"||x.key==="F10"&&x.shiftKey){x.preventDefault();let G=f.current?.getBoundingClientRect(),V=G===void 0?0:G.top+k*m-(f.current?.scrollTop??0);T(N,{x:G?.left??0,y:V+m},f.current??void 0);return}if(x.key==="Home"){x.preventDefault(),D[0]!==void 0&&Q(D[0]);return}if(x.key==="End"){x.preventDefault(),A!==void 0&&Q(A);return}let ee=Date.now(),ce=os(e,k),je=is(e,ce),xn=je.map(G=>{let V=e[G];return V?.type==="entry"?V.name:""}),ve=as({query:rs(Y.current.query,Y.current.at,ee),key:x.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:x.nativeEvent.repeat,names:xn,active:k===void 0?-1:je.indexOf(k)});if(ve.kind==="clear"){Y.current={query:"",at:0};return}if(ve.kind!=="jump")return;let we=je[ve.index];if(we===void 0)return;let ue=e[we];ue?.type==="entry"&&(Y.current={query:ve.query,at:ee},x.preventDefault(),Q(we),ue.kind!=="directory"&&i(ue.path))},[k,D,R,Q,o,i,T,m,e]);(0,Z.useEffect)(()=>{let x=f.current;if(x===null)return;let A=()=>w(x.clientHeight);if(A(),typeof ResizeObserver>"u")return;let N=new ResizeObserver(A);return N.observe(x),()=>N.disconnect()},[]),(0,Z.useEffect)(()=>{if(n===void 0)return;let x=f.current;if(x===null)return;let A=e.findIndex(ee=>ee.type==="entry"&&ee.path===n);if(A<0)return;let N=A*m;(N<x.scrollTop||N+m>x.scrollTop+x.clientHeight)&&(x.scrollTop=Math.max(0,N-x.clientHeight/2))},[n,e,m]),(0,Z.useEffect)(()=>{if(t===void 0||j.current===t)return;let x=f.current;if(x===null)return;let A=t.path===void 0?-1:e.findIndex(N=>N.type==="entry"&&N.path===t.path);if(!(t.path!==void 0&&A<0)){if(j.current=t,A>=0){let N=Yr({scrollTop:x.scrollTop,viewport:x.clientHeight===0?480:x.clientHeight,rowHeight:m,index:A});N!==x.scrollTop&&(x.scrollTop=N,h(N)),P(A)}iu(x),l?.()}},[t,e,l,m]);let _=x=>{h(x.currentTarget.scrollTop)},K=Ht(e,{scrollTop:y,height:R===0?480:R,rowHeight:m}),O={"--fx-row-h":`${String(m)}px`};return(0,H.jsx)("div",{className:"fx-scroll",ref:f,style:O,onScroll:_,onKeyDown:E,onContextMenu:v,tabIndex:0,"data-testid":"fs-tree-scroll","data-page-keys":"own",role:"tree","aria-label":r("view.tree"),children:(0,H.jsx)("div",{className:"fx-vlist",style:{height:e.length*m},children:K.rows.map((x,A)=>{let N=(K.startIndex+A)*m;return x.type==="entry"?(0,H.jsx)(ru,{row:x,top:N,selected:x.path===n,cursor:k===K.startIndex+A,t:r,onToggle:o,onSelect:i,onRowActivate:C,onContextMenu:(ee,ce)=>T(ee,{x:ce.clientX,y:ce.clientY},ce.currentTarget instanceof HTMLElement?ce.currentTarget:void 0)},x.path):(0,H.jsx)(ou,{row:x,top:N,t:r,onRetry:a},x.key)})})})}function xr(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Ve(e){try{return e()}catch{return}}function Be(e){return e!==null&&typeof e=="object"}function gs(e){return()=>{let n=Ve(()=>e.workspaceFiles);if(xr(n))return n;let t=Ve(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(xr(t))return t;let r=Ve(()=>e.remote?.workspaceFiles);if(xr(r))return r;let o=Ve(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(xr(o))return o}}function ys(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function hs(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Kn(i,r.offset??1),i}catch(s){if(!(s instanceof ke)||rn(s).kind!=="symlink")throw s;a=s}let l=await n(t,o);if(l===void 0)throw a;return{...Kn(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function us(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function au(e){let n=Ve(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Be(n)?n.rpc:void 0;if(!Be(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function xs(e){return()=>{let n=Ve(()=>e.remote?.gitExplorer);if(us(n))return n;let t=Ve(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return us(t)?t:au(e)}}function su(e){return e===""?0:e.split(`
`).length}function fs(e){let n=Be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new ke(t,r)}function bs(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!Be(l))throw new ke("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw fs(l.error);let u=l;if(l.ok===!0&&(u=l.value),!Be(u))throw new ke("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw fs(u.error);let s=u;if(u.ok===!0&&(s=u.page),!Be(s))throw new ke("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(s.kind==="submodule")throw new ke("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(s.binary===!0||s.kind==="binary")throw new ke("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof s.text!="string")throw new ke("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let c=typeof s.lines=="number"&&Number.isFinite(s.lines)?Math.max(0,Math.trunc(s.lines)):su(s.text),f=typeof s.offset=="number"&&Number.isFinite(s.offset)&&s.offset>0?Math.trunc(s.offset):o.offset??1,y=s.source==="first-parent"?"first-parent":s.source==="commit"?"commit":void 0;return{text:s.text,lines:c,offset:f,eof:s.eof===!0,...y===void 0?{}:{source:y}}}}}function du(e){if(!Be(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=Be(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function lu(e){let n=Be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=Be(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new ke(t,r,i)}function Bo(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=du(await n.call(e,t,r,{},o));if(!i.ok)throw lu(i.error);return i.value.data}}function gt(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Io(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function En(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:gt(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Io(r.value):{ok:!1,message:gt(r.error)}}return Io(t)}return Io(n)}function br(e){return e instanceof Error?e.message:gt(e)}function ps(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function cu(e){let n=Ve(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Be(n)?n.rpc:void 0;if(!Be(t)||typeof t.call!="function")return;let r=t.call;return{snapshot:(o,i)=>r.call(t,"/api","gitExplorer/snapshot",{args:{request:o}},i)}}function ks(e){return()=>{let n=cu(e);if(n!==void 0)return n;let t=Ve(()=>e.remote?.gitExplorer);if(ps(t))return t;let r=Ve(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(ps(r))return r}}function ms(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function uu(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=ms(r.additions),i=ms(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function fu(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function pu(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;typeof r.name!="string"||r.name===""||typeof r.url!="string"||r.url===""||n.push({name:r.name,url:r.url})}return n}function Ao(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=uu(n.stats),r=fu(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0,i=pu(n.remotes);return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o},...i===void 0?{}:{remotes:i}}}function kr(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:gt(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?Ao(o.snapshot):{ok:!1,message:gt(o.error)}}let r=e;return r.snapshot!==void 0?Ao(r.snapshot):Ao(t)}var ge=require("react/jsx-runtime"),jo={zh:{"preview.crumbs.open":"\u6253\u5F00\u540C\u7EA7\u9762\u677F","preview.crumbs.loading":"\u8F7D\u5165\u4E2D\u2026","preview.crumbs.empty":"\u7A7A\u76EE\u5F55","preview.crumbs.failed":"\u8BFB\u53D6\u76EE\u5F55\u5931\u8D25","preview.crumbs.truncated":"\u4EC5\u663E\u793A\u524D {count} \u9879"},en:{"preview.crumbs.open":"Open the sibling panel","preview.crumbs.loading":"Loading\u2026","preview.crumbs.empty":"Empty directory","preview.crumbs.failed":"Could not read the directory","preview.crumbs.truncated":"Showing the first {count} items"}},mu=4,Do=8,gu=220;function Oo(e,n){return{dir:e,status:"failed",nodes:[],prefix:e,truncated:!1,message:n}}function vs(e){let{path:n,sessionId:t,files:r,t:o,interactive:i,unavailableReason:a,onOpenPeer:l}=e,u=Za(n),[s,c]=(0,de.useState)(null),[f,y]=(0,de.useState)(null),[h,R]=(0,de.useState)(null),w=(0,de.useRef)(null),m=(0,de.useRef)(null),k=(0,de.useRef)([]),P=(0,de.useRef)(!0),j=(0,de.useRef)(0);(0,de.useEffect)(()=>(P.current=!0,()=>{P.current=!1}),[]);let Y=(0,de.useCallback)(async v=>{let E=++j.current,_=A=>{!P.current||E!==j.current||y(A)};if(y({dir:v,status:"loading",nodes:[],prefix:v,truncated:!1,message:""}),r===void 0||t===void 0){_(Oo(v,""));return}let K;try{K=await r.list(t,v)}catch(A){_(Oo(v,br(A)));return}let O=En(K);if(!O.ok){_(Oo(v,O.message));return}let{listing:x}=O;_({dir:v,status:"ready",nodes:On(x.entries),prefix:typeof x.path=="string"?x.path:v,truncated:x.truncated===!0,message:""})},[r,t]),I=(0,de.useCallback)(v=>{let E=w.current;j.current+=1,c(null),y(null),R(null),v&&E?.focus()},[]),L=(0,de.useCallback)((v,E)=>{if(s===v){I(!1);return}w.current=E;let _=E.getBoundingClientRect(),K=typeof window>"u"?0:window.innerWidth,O=K>0?Math.max(Do,Math.min(_.left,K-gu-Do)):Math.max(Do,_.left);R({left:O,top:_.bottom+mu}),c(v),Y(jn(u.segments[v]?.parent??""))},[I,Y,u.segments,s]);(0,de.useEffect)(()=>{if(s===null||f===null||f.status!=="ready")return;let v=f.nodes.findIndex(E=>E.name===u.segments[s]?.name);k.current[v>=0?v:0]?.focus()},[u.segments,s,f]),(0,de.useEffect)(()=>{if(s===null)return;let v=_=>{_.key==="Escape"&&(_.preventDefault(),I(!0))},E=_=>{let K=_.target;!(K instanceof Node)||(K instanceof Element?K.closest(".fx-preview-crumbs")!==null:m.current?.contains(K)===!0)||I(!1)};return document.addEventListener("keydown",v,!0),document.addEventListener("pointerdown",E,!0),()=>{document.removeEventListener("keydown",v,!0),document.removeEventListener("pointerdown",E,!0)}},[I,s]);let X=v=>{let E=k.current.filter(x=>x!==null);if(E.length===0)return;let _=E.indexOf(document.activeElement),K=_>=0?_:0,O;switch(v.key){case"ArrowDown":O=Math.min(E.length-1,K+1);break;case"ArrowUp":O=Math.max(0,K-1);break;case"Home":O=0;break;case"End":O=E.length-1;break;default:return}v.preventDefault(),E[O]?.focus()},D=(v,E)=>{v.key==="ArrowDown"&&(v.preventDefault(),L(E,v.currentTarget))},Q=s===null?"":u.segments[s]?.name??"",he=u.segments.length-1,C=f===null?"":f.dir===""||f.dir==="."?"./":f.dir,T=f===null?"":f.status==="loading"?o("preview.crumbs.loading"):f.status==="failed"?o("preview.crumbs.failed"):f.nodes.length===0?o("preview.crumbs.empty"):"";return(0,ge.jsxs)("div",{className:"fx-preview-crumbs","data-dcp-ref-skip":"",title:i?void 0:a,"data-interactive":i?"true":"false",children:[u.segments.map((v,E)=>{let _=s===E,K=`${o("preview.crumbs.open")}: ${v.name}`;return(0,ge.jsxs)("span",{className:"fx-crumb-slot",children:[E>0?(0,ge.jsx)("span",{className:"fx-crumb-sep","aria-hidden":"true",children:">"}):null,i?(0,ge.jsx)("button",{type:"button",className:"fx-crumb","data-testid":"fs-preview-crumb","data-crumb-name":v.name,"data-file":E===he?"true":void 0,"aria-haspopup":"dialog","aria-expanded":_,"aria-label":K,title:v.path,onClick:O=>L(E,O.currentTarget),onKeyDown:O=>D(O,E),children:v.name}):(0,ge.jsx)("span",{className:"fx-crumb","data-testid":"fs-preview-crumb","data-crumb-name":v.name,"data-file":E===he?"true":void 0,title:v.path,children:v.name})]},`${v.path}:${E}`)}),i&&f!==null&&h!==null?(0,ge.jsxs)("div",{className:"fx-peers","data-testid":"fs-preview-crumbs",role:"dialog","aria-label":o("preview.crumbs.open"),ref:m,style:{left:`${h.left}px`,top:`${h.top}px`},onKeyDown:X,children:[(0,ge.jsx)("div",{className:"fx-peers-head","data-testid":"fs-preview-crumb-head",title:C,children:C}),f.nodes.map((v,E)=>{let _=v.name===Q;return(0,ge.jsxs)("button",{type:"button",className:"fx-peers-row","data-testid":"fs-preview-crumb-peer","data-kind":v.kind,"data-current":_?"true":void 0,ref:K=>{k.current[E]=K},onClick:()=>{if(v.kind==="directory"){Y(Ae(f.prefix,v.name));return}l(Ae(f.prefix,v.name),"file"),I(!1)},children:[v.kind==="directory"?(0,ge.jsx)(Hn,{open:!1,size:13}):(0,ge.jsx)("span",{className:"fx-badge","data-icon":pn(v.name),"aria-hidden":"true",children:mn(v.name)}),(0,ge.jsx)("span",{className:"fx-peers-name",children:v.name}),v.kind==="directory"?(0,ge.jsx)("span",{className:"fx-crumb-chevron","aria-hidden":"true",children:"\u203A"}):null]},`${v.kind}:${v.name}`)}),T===""?null:(0,ge.jsx)("div",{className:"fx-peers-status","data-testid":"fs-preview-crumb-status",title:f.message===""?void 0:f.message,children:T}),f.status==="ready"&&f.truncated?(0,ge.jsx)("div",{className:"fx-peers-status",children:o("preview.crumbs.truncated").replace("{count}",String(f.nodes.length))}):null]}):null]})}var _o="fsExplorer",ws=1;function yu(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function hu(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function xu(e){return e.slice(e.lastIndexOf("/")+1).toLowerCase()}function bu(e,n,t,r){return e.extensions.length===0&&e.families.length===0&&e.names.length===0||n!==""&&e.extensions.includes(n)||t!==null&&e.families.includes(t)?!0:e.names.includes(r)}function ku(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function vr(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(hu),families:[...i.match?.families??[]],names:(i.match?.names??[]).map(u=>u.toLowerCase())}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=yu(i.path),l=it(i.path),u=xu(i.path),s;for(let c of t.values())bu(c,a,l,u)&&(s===void 0||ku(c.contribution,s.contribution))&&(s=c);return s?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function Ss(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}var F=require("react/jsx-runtime"),Ko={zh:{...jo.zh,"preview.crumbs.unavailable":"\u63D0\u4EA4\u7248\u672C\u4E0E\u5DE5\u4F5C\u533A\u5916\u7684\u8DEF\u5F84\u6CA1\u6709\u540C\u7EA7\u9762\u677F","preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{...jo.en,"preview.crumbs.unavailable":"Commit versions and paths outside the workspace expose no sibling panels","preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},vu=()=>()=>{},Rs=()=>{},wu=()=>{};function Ho(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Wo={status:"idle"},Su=(ut.get("markdown")?.extensions??[]).filter(e=>e.startsWith(".")&&!/[*?[\]]/u.test(e)),Ps=gn.filter(e=>e.id==="plaintext"||e.disposition==="backlog"),Ru=[...new Set(Ps.flatMap(e=>e.extensions).filter(e=>!/[*?[\]]/u.test(e)))],Pu=[...new Set(Ps.flatMap(e=>e.filenames))],Cu=-100,Tu=-1e3,Cs="builtin.source";function zo({t:e,revision:n}){return(0,F.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,F.jsx)("strong",{children:e("preview.unavailable.title")}),(0,F.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function Eu(e){if(e.offset===1)return e.text.split(/\r?\n/u,1)[0]}function Go({chunk:e,text:n,path:t,offset:r,find:o}){let i=(0,W.useRef)(null),a=(0,W.useRef)(null),l=(0,W.useRef)(n);l.current=n;let u=(0,W.useRef)(r);u.current=r;let[s,c]=(0,W.useState)(!1),f=r===1?n.split(/\r?\n/u,1)[0]:void 0,h=zn(t,f)?.id??null,R=h!==null&&Co(h);return(0,W.useEffect)(()=>{c(!1)},[e,t]),(0,W.useEffect)(()=>{let m=i.current;if(!(e===null||m===null||R))try{let k=e.mountCodePreview(m,{text:n,path:t,offset:r});return a.current=k,()=>{k.destroy(),a.current===k&&(a.current=null)}}catch{c(!0);return}},[e,t,R]),(0,W.useEffect)(()=>{let m=i.current;if(m===null||!R)return;let k=!0,P=null;return Ka(h).then(j=>{if(!(!k||zn(t,u.current===1?l.current.split(/\r?\n/u,1)[0]:void 0)?.id!==h))try{let I=j.mount(m,{text:l.current,path:t,offset:u.current},h);P=I,a.current?.destroy(),a.current=I}catch{c(!0)}},()=>{k&&c(!0)}),()=>{k=!1,P?.destroy(),a.current===P&&(a.current=null)}},[R,h,t]),(0,W.useEffect)(()=>{a.current?.update(n,r)},[n,r,e]),(0,W.useEffect)(()=>{if(!(o===void 0||s))return o.register({scope:"page",text:()=>l.current,select:(m,k)=>a.current?.revealRange(m,k),clear:()=>a.current?.clearSelection()}),()=>o.register(null)},[o,s]),!s&&(R||e!==null)?(0,F.jsx)("div",{className:"fx-code-host",ref:i,"data-testid":"fs-preview-code","data-renderer":R?h:e?.renderer??"plain"}):(0,F.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n})}function Fu({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&pt(n)?(0,F.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:ar(r)}):(0,F.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Mu(e){function n({page:t,path:r,mode:o,find:i}){return o==="reading"?(0,F.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,F.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,F.jsx)(Go,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:i})}return{Body:n,renderer:e.renderer}}function Lu({page:e,find:n}){let t=e?.text??"",r=e?.offset??1,o=t===""?[]:t.replace(/\n$/u,"").split(`
`),i=(0,W.useRef)(t);return i.current=t,(0,W.useEffect)(()=>{if(n!==void 0)return n.register({scope:"page",text:()=>i.current,select:()=>{},clear:()=>{}}),()=>n.register(null)},[n]),(0,F.jsxs)("div",{className:"fx-plaintext","data-testid":"fs-preview-plaintext",children:[(0,F.jsx)("div",{className:"fx-plaintext-gutter","data-testid":"fs-preview-plaintext-gutter","aria-hidden":"true",children:o.map((a,l)=>(0,F.jsx)("span",{children:r+l},l))}),(0,F.jsx)("pre",{className:"fx-plaintext-body",children:t})]})}function Nu(){return{renderer:"plaintext",Body:Lu}}function Iu(e){function n({page:t,path:r,find:o}){return(0,F.jsx)(Go,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1,find:o})}return{Body:n,renderer:e.renderer}}var Au={Body:({page:e,path:n,find:t})=>(0,F.jsx)(Go,{chunk:null,text:e?.text??"",path:n,offset:e?.offset??1,find:t}),renderer:"plain"};function Bu({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,W.useMemo)(()=>{let u=Bo(r);return u===void 0||t===void 0||a===void 0?u:async(s,c,f)=>{if(s!==t||c!==n)return u(s,c,f);let y=await a(c,f);return u(s,y?.absolutePath??c,f)}},[r,t,n,a]);return t===void 0||l===void 0?(0,F.jsx)(zo,{t:o}):(0,F.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function Du(e){return{Body:n=>(0,F.jsx)(Bu,{chunk:e,...n}),renderer:e.renderer}}function wr(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Su]},priority:0,load:()=>To().then(Mu)},{id:"builtin.plaintext",label:"\u7EAF\u6587\u672C",match:{extensions:[...Ru],names:[...Pu]},priority:Cu,load:()=>Promise.resolve(Nu())},{id:Cs,label:"\u6E90\u7801",match:{},priority:Tu,load:()=>To().then(Iu)},...Object.keys(Dt).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>Ha(e).then(Du)}))]}var $o;function Ou(){if($o!==void 0)return $o;let e=vr();for(let n of wr())e.register(n);return $o=e,e}function Ts({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:u,locate:s,onOpenPeer:c}){let f=(0,W.useMemo)(()=>{let q=r===void 0?ys(n,e):o===void 0||e===void 0?void 0:bs(o,e,r);return q===void 0||r!==void 0||s===void 0?q:hs(q,s)},[n,e,r,o,s]),y=(0,W.useMemo)(()=>r===void 0?Bo(n):void 0,[n,r]),h=l??Ou(),R=t===void 0?null:it(t),w=R!==null,m=r===void 0&&e!==void 0&&y!==void 0?{sessionId:e,readFile:y}:null,[k,P]=(0,W.useState)(null),[j,Y]=(0,W.useState)(ft),[I,L]=(0,W.useState)(Wo),[X,D]=(0,W.useState)(0),[Q,he]=(0,W.useState)(0),[C,T]=(0,W.useState)(0),[v,E]=(0,W.useState)("reading"),[_,K]=(0,W.useState)(!1),[O,x]=(0,W.useState)(!1),[A,N]=(0,W.useState)(void 0),[ee,ce]=(0,W.useState)(!1),[je,xn]=(0,W.useState)(!1),ve=(0,W.useRef)(null),we=(0,W.useRef)(null),ue=(0,W.useRef)(void 0),G=(0,W.useRef)(void 0),V=(0,W.useSyncExternalStore)(u?.subscribe??vu,()=>u===void 0||e===void 0||t===void 0?Rs():u.peek(e,t),Rs),Se=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);(0,W.useEffect)(()=>{if(f===void 0){P(null);return}let q=ur({files:f,maxLines:Ro});return P(q),()=>q.close()},[f]),(0,W.useEffect)(()=>{if(k===null){Y(ft);return}return Y(k.getSnapshot()),k.subscribe(()=>Y(k.getSnapshot()))},[k]),(0,W.useEffect)(()=>{k===null||t===void 0||R!==null||k.open(t)},[k,t,R]),(0,W.useEffect)(()=>{if(!w||t===void 0||s===void 0){N(void 0);return}let q=new AbortController,Re=!0;return(async()=>{let We=await s(t,q.signal);Re&&!q.signal.aborted&&N(We?.absolutePath)})(),()=>{Re=!1,q.abort()}},[w,t,s]),(0,W.useEffect)(()=>{E("reading"),K(!1),ce(!1)},[t]),(0,W.useEffect)(()=>()=>{ue.current!==void 0&&clearTimeout(ue.current),G.current!==void 0&&clearTimeout(G.current)},[]),(0,W.useEffect)(()=>{V?.conflict!==!0&&(x(!1),ce(!1),G.current!==void 0&&clearTimeout(G.current))},[V?.conflict]),(0,W.useEffect)(()=>h.subscribe(()=>D(q=>q+1)),[h]);let Xe=j.path===t?Eu(j):void 0,Ne=Xe===void 0||Xe===""?void 0:Xe,dn=j.path===t&&(j.status==="ready"||j.status==="failed");if((0,W.useEffect)(()=>{if(t===void 0||r!==void 0){L(Wo);return}if(!/[^/]\.[^/]+$/u.test(t)&&!dn)return;let Re=h.resolve({path:t}),We=zn(t,Ne);if(Re!==void 0&&Re.id===Cs&&We!==null&&Co(We.id)){L({status:"ready",contribution:Re,module:Au});return}let un=Ss(h,{path:t});if(un===void 0){L(Wo);return}let{contribution:Me}=un,$e=!0;return L(Pe=>Pe.status==="ready"&&Pe.contribution.id===Me.id?Pe:{status:"loading",contribution:Me}),un.module.then(Pe=>{$e&&L({status:"ready",contribution:Me,module:Pe})},Pe=>{$e&&L({status:"failed",contribution:Me,failure:rn(Pe)})}),()=>{$e=!1}},[h,t,r,X,Q,Ne,dn]),t===void 0)return(0,F.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,F.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,F.jsx)("strong",{children:i("preview.empty.title")}),(0,F.jsx)("span",{children:i("preview.empty.description")})]})});let Ye=w&&r!==void 0,He=fr(j),Je=j.linkPath??t,Fe=w?A:j.linkTarget,St=r===void 0&&e!==void 0&&n!==void 0&&c!==void 0&&!nn(Je),qn=!w&&pt(t),xe=w?!Ye&&m!==null&&I.status!=="ready"&&I.status!=="failed":j.status==="loading",Ge=j.status==="ready",be=qn&&v==="reading",$=w?Ye||m===null?"unavailable":I.status==="failed"?"failed":I.status==="ready"?"ready":"loading":j.status,Ie=I.status==="ready"?I.module.renderer??I.contribution.id:w?"pending":be?"fallback":"plain",Un=(0,W.useMemo)(()=>Ya(()=>ve.current),[]),bn=(0,W.useMemo)(()=>()=>we.current??Un,[Un]),Xn=(0,W.useMemo)(()=>({register:q=>{we.current=q===null?null:Xa(q),T(Re=>Re+1)},invalidate:()=>T(q=>q+1)}),[]),Nn=[Je,String(v),j.offset,j.text.length,Ie,String(C)].join("|"),Yn=!w&&Ge,_e={path:Fe??t,sessionId:e,files:n,t:i,visible:a,mode:v,...w?{}:{page:{text:j.text,offset:j.offset}},...s===void 0?{}:{locate:s},...Yn?{find:Xn}:{}},Jn=()=>{Cn(Fe??Je).then(q=>{q&&(K(!0),ue.current!==void 0&&clearTimeout(ue.current),ue.current=setTimeout(()=>K(!1),1400))})},Zn=()=>{let q=Se?.copyDraft();q!==void 0&&Cn(q).then(Re=>{Re&&(x(!0),G.current!==void 0&&clearTimeout(G.current),G.current=setTimeout(()=>x(!1),1400))})},ln=V?.error,Ze=ln!=null&&V?.conflict!==!0,Qe=V?.conflict===!0,fe=V?.discarded??null,In=!Qe&&fe!==null&&V?.dirty!==!0&&fe!==V?.text,cn;if(w){let q=I.status==="ready"?I.module.Body:void 0;cn=Ye?(0,F.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,F.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,F.jsx)("span",{children:i("preview.commitBinary.description")})]}):m===null?(0,F.jsx)(zo,{t:i,revision:r}):I.status==="failed"?(0,F.jsx)(Lo,{failure:I.failure,t:i,onRetry:()=>he(Re=>Re+1)}):q===void 0?(0,F.jsx)(No,{t:i}):(0,F.jsx)(q,{..._e})}else if(f===void 0)cn=(0,F.jsx)(zo,{t:i,revision:r});else if(j.status==="failed")cn=(0,F.jsx)(Lo,{failure:j.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{k?.retry()}});else if(!Ge)cn=(0,F.jsx)(No,{t:i});else{let q=I.status==="ready"?I.module.Body:Fu;cn=(0,F.jsx)(q,{..._e})}return(0,F.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":$,"data-mode":w?"binary":be?"reading":"code","data-renderer":Ie,children:[(0,F.jsxs)("header",{className:"fx-preview-bar",children:[(0,F.jsxs)("div",{className:"fx-preview-path",title:Fe===void 0?Je:`${Je} \u2192 ${Fe}`,"data-testid":"fs-preview-path",...Fe===void 0?{}:{"data-link":"followed"},children:[(0,F.jsx)(vs,{path:Je,sessionId:e,files:n,t:i,interactive:St,unavailableReason:i("preview.crumbs.unavailable"),onOpenPeer:c??wu}),Fe===void 0?null:(0,F.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",Fe]})]}),w?null:(0,F.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[He.range,He.range==="\u2014"?null:(0,F.jsxs)(F.Fragment,{children:[" ",i("preview.lines")]}),He.total===void 0?null:(0,F.jsxs)("span",{className:"fx-preview-total",children:[" / ",He.total," ",i("preview.lines")]})]}),(0,F.jsxs)("div",{className:"fx-preview-actions",children:[V===void 0?null:(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!V.dirty||V.saving||V.status!=="ready",onClick:()=>{Se?.save()},children:V.saving?i("preview.saving"):i("preview.save")}),qn?(0,F.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>E(q=>q==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(v==="reading"?"preview.source":"preview.reading")}):null,w?null:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Ge||xe||j.offset<=1,onClick:()=>{k?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,F.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Ge||xe||j.eof,onClick:()=>{k?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),Yn?(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-find","data-open":je?"true":"false",title:i("preview.find"),"aria-label":i("preview.find"),"aria-pressed":je,onClick:()=>xn(q=>!q),children:i("preview.find")}):null,(0,F.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Jn,"data-testid":"fs-preview-copy",children:i(_?"preview.copied":"preview.copyPath")}),xe?(0,F.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),je&&Yn?(0,F.jsx)(Ja,{t:i,surface:bn,stamp:Nn,onClose:()=>xn(!1)}):null,j.source==="first-parent"?(0,F.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,Qe||In?(0,F.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":Qe?"conflict":"discarded",children:[(0,F.jsx)("strong",{children:i(Qe?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,F.jsx)("span",{className:"fx-conflict-hint",children:i(Qe?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,F.jsx)("span",{className:"fx-spacer"}),Qe?(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":ee?"discard":void 0,onClick:()=>{if(!ee&&V?.dirty===!0){ce(!0);return}ce(!1),Se?.reload({force:!0})},children:i(ee?"preview.conflict.discard":"preview.conflict.reload")}):null,In?(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{fe!==null&&Se?.setDraft(fe)},children:i("preview.conflict.restore")}):null,Qe?(0,F.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:Zn,children:i(O?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,Ze?(0,F.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Ho(ln?.code??"io-error",ln?.message??"",i))}):null,(0,F.jsx)("div",{className:"fx-preview-body","data-scroll":be?"y":"none",ref:ve,children:cn})]})}var Es="dsh-fs-explorer-styles",ju=`
.fx-root {
  /* The name card, the bookmark picker and the management menu are positioned
     against this panel. Without a containing block here they resolve against
     whatever positioned ancestor the host happens to provide, which is not
     something this package can rely on. */
  position: relative;
  --fx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --fx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  /* The host's own axes: body text for the interface, code size for monospace
     text. Both keep the design baseline as their fallback so a host that
     writes neither still gets the sizes this panel shipped with. */
  --fx-fs: var(--dsh-content-font-size, 14px);
  --fx-fs-code: var(--dsh-code-font-size, 11px);
  /* The one row height the virtual window and this sheet share; the floor
     keeps a row clickable below the design baseline, matching the TS helper. */
  --fx-row-h: max(22px, calc(var(--fx-fs) * 1.5714));
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
  font-size: calc(var(--fx-fs) * 0.8571);
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.fx-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.7143);
  padding: 6px 12px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-head-icon { display: inline-flex; color: var(--fx-folder); flex: none; }
.fx-title { margin: 0; font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; white-space: nowrap; }
.fx-scope {
  display: inline-flex;
  align-items: center;
  height: calc(var(--fx-fs-code) * 1.6364);
  padding: 0 7px;
  border: 1px solid var(--fx-border);
  border-radius: 999px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
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
  height: calc(var(--fx-fs) * 1.7143);
  max-width: 160px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8214);
  white-space: nowrap;
  cursor: pointer;
}
.fx-bookmark:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-bookmark:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-bookmark[aria-expanded="true"] { background: var(--fx-active); color: var(--fx-text); }
.fx-bookmark-name { overflow: hidden; text-overflow: ellipsis; }
.fx-bookmark-chevron { display: inline-flex; color: var(--fx-caption); flex: none; }
.fx-bookmark-empty { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); white-space: nowrap; }

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
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
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
  width: calc(var(--fx-fs) * 1.2857);
  height: calc(var(--fx-fs) * 1.2857);
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
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
  position: fixed; z-index: 75; min-width: 150px; padding: 4px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 1px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }

/* The destination picker: one card, one level at a time. */
.fx-bookmark-picker {
  position: absolute; z-index: 65; top: calc(var(--fx-fs) * 3.1429); left: 12px; width: 280px; max-height: 60vh; overflow-y: auto; padding: 10px; border: 1px solid var(--fx-border); border-radius: 8px; background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2)); box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent); display: flex; flex-direction: column; gap: 8px; font-family: var(--fx-font); font-size: calc(var(--fx-fs) * 0.8571); }
.fx-bookmark-picker-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.fx-bookmark-picker-head strong { font-size: calc(var(--fx-fs) * 0.8571); font-weight: 600; }
.fx-bookmark-picker-target { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-bookmark-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; }
.fx-bookmark-crumb {
  padding: 2px 6px; border: 0; border-radius: 4px; background: transparent; color: var(--fx-text-2); font: inherit; font-size: calc(var(--fx-fs) * 0.7857); cursor: pointer; }
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
  font-size: calc(var(--fx-fs) * 0.7857);
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
  font-size: calc(var(--fx-fs) * 0.7857);
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
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  box-shadow: 0 8px 24px color-mix(in srgb, currentColor 16%, transparent);
  color: var(--fx-text);
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
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
.fx-menu-reason { display: block; color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); line-height: 1.4; }

/* The name card. Anchored to the tree rather than centered on the page: the
   reader right-clicked a row, and a modal would take the tree away at exactly
   the moment they need to see which directory they are creating in. */
.fx-name-prompt {
  position: absolute;
  z-index: 55;
  top: calc(var(--fx-fs) * 3.1429);
  left: 12px;
  width: 268px;
  padding: 10px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
.fx-name-prompt-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.fx-name-prompt-head strong { font-size: calc(var(--fx-fs) * 0.8571); font-weight: 600; }
.fx-name-prompt-parent {
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.7857);
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
.fx-name-prompt-error { color: var(--dsw-alias-state-error-primary, var(--fx-text-2)); font-size: calc(var(--fx-fs) * 0.7857); line-height: 1.4; }
.fx-name-prompt-actions { display: flex; justify-content: flex-end; gap: 6px; }
.fx-btn-text, .fx-btn-primary { width: auto; padding: 0 10px; height: calc(var(--fx-fs) * 1.7143); }
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
  height: calc(var(--fx-fs) * 1.7143);
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
  min-height: calc(var(--fx-fs) * 2.1429);
  padding: 0 8px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
  outline: none;
}
.fx-search-input:focus-visible { border-color: var(--fx-accent); }
.fx-search-input::-webkit-search-cancel-button { display: none; }
.fx-search-scope {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: calc(var(--fx-fs-code) * 1.4545);
  padding: 0 5px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 10%, transparent);
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.8636);
  white-space: nowrap;
}
/* The fallback answers a strictly smaller question than the reader asked, so it
   is the one state that gets a warning tone rather than the neutral one. */
.fx-search-scope[data-origin="loaded"] { color: var(--fx-modified); }
.fx-search-count {
  flex: none;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-search-count[data-state="empty"] { color: var(--fx-modified); }
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
  height: calc(var(--fx-fs) * 2.2857);
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
  font-size: calc(var(--fx-fs) * 0.7857);
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
  font-size: calc(var(--fx-fs-code) * 0.8182);
  line-height: calc(var(--fx-fs-code) * 1.1818);
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
  width: calc(var(--fx-fs) * 1.2857);
  height: calc(var(--fx-fs) * 1.2857);
  margin-right: 4px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-caption);
  font: inherit;
  font-size: var(--fx-fs);
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
${ns}
.fx-row[data-kind="directory"] .fx-name { font-weight: 500; }
.fx-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--fx-fs-code) * 1.2727);
  padding: 0 4px;
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.7727);
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
  width: calc(var(--fx-fs-code) * 1.3636);
  height: calc(var(--fx-fs-code) * 1.3636);
  flex: none;
  margin-left: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 15%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.8182);
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
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs) * 0.75);
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
  font-size: calc(var(--fx-fs) * 0.75);
  cursor: pointer;
}
.fx-linkbtn:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-linkbtn:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -2px; }

.fx-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: calc(var(--fx-fs) * 1.7143);
  padding: 0 12px;
  border-top: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
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
.fx-empty strong { color: var(--fx-text); font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; }
.fx-empty span { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); max-width: 46ch; }
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
.fx-editor-empty strong { color: var(--fx-text); font-size: calc(var(--fx-fs) * 0.9286); font-weight: 600; }
.fx-editor-empty > span { color: var(--fx-caption); font-size: calc(var(--fx-fs) * 0.7857); max-width: 48ch; }
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
  font-size: calc(var(--fx-fs-code) * 0.8636);
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
  font-size: calc(var(--fx-fs) * 0.7857);
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
  height: calc(var(--fx-fs) * 2.4286);
  padding: 0 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  min-width: 0;
}
/* The crumb row is a block element and the link arrow sits beside it, so this
   container has to be flex: overflow: hidden does nothing on an inline box,
   and the arrow would otherwise wrap onto its own line. */
.fx-preview-path {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--fx-mono);
  font-size: var(--fx-fs-code);
  color: var(--fx-text-2);
}
.fx-preview-link {
  flex: none;
  color: var(--fx-caption);
}
.fx-preview-range {
  flex: none;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  color: var(--fx-caption);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fx-preview-total { opacity: .7; }
.fx-preview-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.fx-pbtn {
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.75);
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
  font-size: calc(var(--fx-fs) * 0.75);
}
.fx-conflict {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.1429);
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: color-mix(in oklab, var(--fx-modified) 14%, transparent);
  color: var(--fx-text);
  font-size: calc(var(--fx-fs) * 0.7857);
}
.fx-conflict strong { font-weight: 600; }
.fx-conflict-hint { color: var(--fx-text-2); }
.fx-save-error {
  flex: none;
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  color: var(--fx-deleted);
  font-size: calc(var(--fx-fs) * 0.75);
}
.fx-close-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: calc(var(--fx-fs) * 2.4286);
  padding: 4px 10px;
  border-bottom: 1px solid var(--fx-border-soft);
  background: var(--fx-panel-2);
  color: var(--fx-text);
  font-size: calc(var(--fx-fs) * 0.7857);
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
  height: calc(var(--fx-fs) * 2.1429);
  padding: 0 10px;
  border-bottom: 1px solid var(--fx-border-soft);
}
.fx-find-input {
  flex: 1 1 auto;
  min-width: 0;
  height: calc(var(--fx-fs) * 1.5714);
  padding: 0 6px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--fx-text);
  font: inherit;
  font-size: calc(var(--fx-fs) * 0.8571);
  outline: none;
}
.fx-find-input:focus-visible { border-color: var(--fx-accent); }
.fx-find-input::-webkit-search-cancel-button { display: none; }
.fx-find-count {
  flex: none;
  min-width: 7ch;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.fx-find-count[data-state="empty"] { color: var(--fx-modified); }
.fx-preview-read { height: 100%; }
.fx-preview-hint {
  max-width: 60ch;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9091);
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
  font-size: calc(var(--fx-fs-code) * 1.0909);
  line-height: 1.55;
  white-space: pre;
  tab-size: 4;
}

/* The plaintext renderer: a gutter and the page, side by side.
   The gutter is a column of numbers that scrolls with the text, so both live in
   one scroll box; the numbers are not selectable, because copying a page should
   give the reader the text and not the line numbers. */
.fx-plaintext {
  display: flex;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: auto;
  padding: 12px 16px 40px;
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 1.0909);
  line-height: 1.55;
}
.fx-plaintext-gutter {
  flex: none;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  border-right: 1px solid var(--fx-border-soft);
  color: var(--fx-caption);
  text-align: right;
  user-select: none;
  min-width: 3ch;
}
.fx-plaintext-body {
  margin: 0;
  padding-left: 12px;
  font: inherit;
  white-space: pre;
  tab-size: 4;
  color: var(--fx-text);
}

.fx-md {
  padding: 18px 24px 64px;
  font-size: calc(var(--fx-fs) * 0.9286);
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
  height: calc(var(--fx-fs-code) * 1.8182);
  padding: 0 8px;
  border: 1px solid var(--fx-border-soft);
  border-radius: 5px;
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.9545);
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

/* The crumb row replaces one opaque path string, so it must never widen the
   toolbar: every segment ellipsizes and only the file name keeps its width. */
.fx-preview-crumbs {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  overflow: hidden;
  font-family: var(--fx-mono);
  font-size: var(--fx-fs-code);
}
.fx-crumb-slot { display: inline-flex; align-items: center; min-width: 0; }
.fx-crumb {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  padding: 1px 3px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--fx-text-2);
  font: inherit;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.fx-crumb[data-file="true"] { flex-shrink: 0; color: var(--fx-text); }
.fx-crumb:hover { background: var(--fx-hover); color: var(--fx-text); }
.fx-crumb:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-preview-crumbs[data-interactive="false"] .fx-crumb { cursor: default; }
.fx-preview-crumbs[data-interactive="false"] .fx-crumb:hover { background: transparent; }
.fx-crumb-sep {
  flex: none;
  padding: 0 2px;
  color: var(--fx-caption);
  user-select: none;
}
.fx-crumb-chevron { flex: none; margin-left: auto; color: var(--fx-caption); }

/* Fixed, not absolute: .fx-root clips its overflow, so an anchored card would
   be cut off at the toolbar's edge. Coordinates come from the crumb's own rect. */
.fx-peers {
  position: fixed;
  z-index: 76;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 220px;
  max-width: 320px;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--fx-border);
  border-radius: 8px;
  /* A floating card sits on the host's top layer, not the panel's own layer:
     skins that make the workspace translucent (layer-1 / layer-2 with alpha)
     keep layer-3 opaque so raised surfaces still read as solid. */
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  box-shadow: 0 10px 28px color-mix(in srgb, currentColor 18%, transparent);
  font-family: var(--fx-font);
  font-size: calc(var(--fx-fs) * 0.8571);
}
/* Every child of the flyout is flex: none. The card is a column flex box with
   a max-height, so the default shrink factor would flatten the head and the
   status line once the rows overflowed, clipping their own text. */
.fx-peers-head {
  /* Sticky with an opaque fill: the head names the directory being listed, so
     it has to stay readable while the rows scroll under it. The -4px top
     cancels the card's own padding, which the head would otherwise scroll
     away from. */
  position: sticky;
  top: -4px;
  z-index: 1;
  flex: none;
  padding: 4px 8px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-3, var(--fx-panel-2));
  color: var(--fx-caption);
  font-family: var(--fx-mono);
  font-size: var(--fx-fs-code);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fx-peers-row {
  display: flex;
  flex: none;
  align-items: center;
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
.fx-peers-row:hover { background: var(--fx-hover); }
.fx-peers-row:focus-visible { outline: 2px solid var(--fx-accent); outline-offset: -1px; }
.fx-peers-row[data-current="true"] { background: var(--fx-hover); color: var(--fx-text); }
.fx-peers-row[data-current="true"]::before { content: "\u2713"; flex: none; color: var(--fx-accent); }
.fx-peers-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fx-peers-status { flex: none; padding: 5px 8px; color: var(--fx-caption); }
`;function Fs(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Es}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=Es,t.textContent=ju,e.head.appendChild(t),()=>{t.remove()}}var Ms="lionad.fs",_u="@";function Vo(e){let n=e.replace(/\\/gu,"/").trim();for(;n.startsWith("./");)n=n.slice(2);return n.replace(/^\/+/u,"").replace(/\/+$/u,"")}function Sr(e){let n=Vo(e);if(n==="")return"";let t=n.lastIndexOf("/");return t<0?n:n.slice(t+1)}function qo(e){let n=e.kind==="directory"?"/":"";return`@${e.path}${n}`}function Ls(e,n,t){let r=Vo(e),o=n.trim()===""?Sr(r):n.trim(),i={path:r,label:o,kind:t},a=qo(i);return{kind:t==="directory"?"fs.directory":"fs.file",path:r,label:o,clipboardText:a,modelText:a,ref:JSON.stringify(i)}}function Uo(e){let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(!(typeof t.path!="string"||t.path===""))return{path:t.path,label:typeof t.label=="string"?t.label:Sr(t.path),kind:t.kind==="directory"?"directory":"file"}}function Wu(e){let n=Uo(e);return n===void 0?`@${e}`:qo(n)}function $u(e){let n=Uo(e);return n===void 0?`@${e}`:qo(n)}function Ns(e,n){let t={source:Ms,ref:n.ref,label:n.label,clipboardText:n.clipboardText,appearance:n.kind==="fs.directory"?"folder":"file"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(t,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(t,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(n.clipboardText,r)?"text":"failed"}function Xo(e){if(e===void 0||!e.session)return"noSession";if(!e.insertReference)return"noReference";if(!e.source)return"noReferenceSource"}function Is(e){if(e===null||typeof e!="object")return{};let n=e,t=n.views,r=t?.open,o=n.openView,i=n.viewFocus,a=i?.request,l=i?.take,u=n.openViewOrSwitch,s=n.currentSessionId;return{openView:typeof r=="function"?(c,f,y)=>r.call(t,c,f,y):typeof o=="function"?(c,f,y)=>o.call(n,f,y):void 0,requestFocus:typeof a=="function"?(c,f)=>{a.call(i,c,f)}:void 0,takeFocus:typeof l=="function"?c=>{l.call(i,c)}:void 0,openViewOrSwitch:typeof u=="function"?(c,f)=>u.call(n,c,f):void 0,currentSessionId:typeof s=="function"?()=>s.call(n):void 0}}function zu(e){if(e===null||typeof e!="object")return;let n=e;if(typeof n.id=="string"&&n.id!=="")return n.id;if(typeof n.sessionId=="string"&&n.sessionId!=="")return n.sessionId}function Ku(e,n,t){let r=Uo(t);if(r===void 0)return!1;let o=Vo(r.path);if(o===""||n===void 0||n==="")return!1;let i=e.currentSessionId?.();if(i!==void 0&&i!==n)return!1;let a=`reveal:${o}`;return e.openView?.(n,te,a)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(te,a),e.openViewOrSwitch?.(te)?.opened===!0?!0:(e.takeFocus?.(te),!1)):e.openViewOrSwitch?.(te,a)?.focused===!0}function Hu(e=()=>({})){return{trigger:_u,name:Ms,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:Wu,async serialize(n){return $u(n)}},openReference(n,t){let r=t!==null&&typeof t=="object"?t.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=zu(n)??o.currentSessionId?.();return Ku(o,i,r)}catch{return!1}}}}function Gu(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function As(e,n){let t=Hu(n),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],a=>{a.effect(()=>(r=a.inputTriggers.registerSource(t),o),"dsh-fs-explorer: reference source")}),i}catch{}try{let a=e.get?.("inputTriggers");if(Gu(a))return r=a.registerSource(t),i}catch{}return i}var g=require("react");var re={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative",copyRemote:"copy.remote",addBookmark:"add.bookmark",reference:"reference.input"},an={close:"tab.close",closeOthers:"tab.close.others",closeRight:"tab.close.right",reference:re.reference};function Bs(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function Vu(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function Ds(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,u=[{id:re.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:re.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let s=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,c={id:re.reveal,label:n(Vu(o?.fileManager??null)),...s?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:re.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},y={id:re.copyRelative,label:n("menu.copy.relative")},h=Xo(e.inputTarget),R={id:re.reference,label:n("menu.reference"),...h===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${h}`)}},w=e.remoteLinks,m=w!==void 0&&w.length>0?{id:re.copyRemote,label:n("menu.copy.remote"),submenu:w.map(k=>({id:k.id,label:k.label}))}:{id:re.copyRemote,label:n("menu.copy.remote"),disabled:!0,reason:n("menu.copy.remote.reason")};return[...u,c,{id:"menu.copy",label:n("menu.copy"),submenu:[f,y]},m,R,{id:re.addBookmark,label:n("menu.addBookmark"),...r.workspace&&e.bookmarkTarget!==void 0?{}:{disabled:!0,reason:n("menu.addBookmark.reason")}}]}function qu(e){if(e.revision!==void 0)return"revision";if(e.absolute)return"absolute"}function Os(e,n){let t=e.panels.findIndex(u=>u.key===e.key);if(t<0)return[];let r=e.panels[t],o=qu(r),i=Xo(e.inputTarget),a=o??i;return[{id:an.reference,label:n("menu.reference"),...a===void 0?{}:{disabled:!0,reason:n(`menu.reference.reason.${a}`)}},{id:an.close,label:n("menu.tab.close")},{id:an.closeOthers,label:n("menu.tab.closeOthers"),...e.panels.length>1?{}:{disabled:!0,reason:n("menu.tab.closeOthers.reason")}},...t===e.panels.length-1?[]:[{id:an.closeRight,label:n("menu.tab.closeRight")}]]}var qe=require("react");var Le=require("react/jsx-runtime");function Uu(e){return new DOMRect(e.x,e.y,0,0)}function js(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,Le.jsxs)(Le.Fragment,{children:[e.label,(0,Le.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function Yo({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=yr();if(i.Menu!==void 0){let a=i.Menu;return(0,Le.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:js(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:js(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,anchorPoint:{x:n.x,y:n.y},getAnchorRect:()=>Uu(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,Le.jsx)(Xu,{entries:e,anchor:n,onSelect:t,onClose:r})}function Xu({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,qe.useRef)(null),[i,a]=(0,qe.useState)(null),[l,u]=(0,qe.useState)({left:n.x,top:n.y});(0,qe.useEffect)(()=>{let c=o.current;if(c===null)return;let f=8,y=c.offsetWidth,h=c.offsetHeight,R=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-y-f)),w=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-h-f));u({left:R,top:w})},[n.x,n.y]),(0,qe.useEffect)(()=>{let c=y=>{y.target instanceof Node&&o.current?.contains(y.target)!==!0&&r()},f=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("pointerdown",c),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",c),document.removeEventListener("keydown",f,!0)}},[r]);let s=(0,qe.useCallback)(c=>{if(c.disabled!==!0){if(c.submenu!==void 0){a(f=>f===c.id?null:c.id);return}t(c.id)}},[t]);return(0,Le.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:c=>c.preventDefault(),children:e.map(c=>(0,Le.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,Le.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":c.id,disabled:c.disabled===!0&&c.reason===void 0,"aria-disabled":c.disabled===!0?!0:void 0,"aria-haspopup":c.submenu===void 0?void 0:"menu","aria-expanded":c.submenu===void 0?void 0:i===c.id,title:c.disabled===!0?c.reason:void 0,onClick:()=>s(c),children:c.label}),c.submenu===void 0||i!==c.id?null:(0,Le.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:c.submenu.map(f=>(0,Le.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>s(f),children:f.label},f.id))})]},c.id))})}var ye=require("react"),U=require("react/jsx-runtime"),Yu=120,Jo=280,Rr=8;function Pr(e){let n=typeof window>"u"?e:window.innerWidth-Jo;return Math.max(Rr,Math.min(e,Math.max(Rr,n)))}function Ju(e,n){if(e===void 0)return{left:Rr,top:Rr};if(n<=1)return{left:Pr(e.left),top:e.bottom+4};let t=e.right+4,r=typeof window>"u"||t+Jo<=window.innerWidth;return{left:Pr(r?t:e.left-Jo-4),top:e.top}}function _s(){return(0,U.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,U.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function Ws({node:e,t:n,onOpen:t}){return(0,U.jsx)("button",{type:"button",className:"fx-bookmark-manage","data-testid":"fx-bookmark-manage","aria-haspopup":"menu","aria-label":n("bookmarks.manage"),title:n("bookmarks.manage"),onClick:r=>{r.stopPropagation(),t(e,r.currentTarget)},children:(0,U.jsx)("span",{"aria-hidden":"true",children:"\u22EF"})})}function $s({tree:e,t:n,onOpenFile:t,onOpenFolder:r,onCreateGroup:o,onRename:i,onRemove:a,onMove:l,onReorder:u}){let[s,c]=(0,ye.useState)([]),f=(0,ye.useRef)(null),[y,h]=(0,ye.useState)(null),[R,w]=(0,ye.useState)(null),m=(0,ye.useCallback)(()=>{f.current!==null&&(clearTimeout(f.current),f.current=null)},[]),k=(0,ye.useCallback)(()=>{m(),c([])},[m]),P=(0,ye.useCallback)(()=>{m(),f.current=setTimeout(()=>{f.current=null,c([])},Yu)},[m]);(0,ye.useEffect)(()=>()=>{f.current!==null&&clearTimeout(f.current)},[]),(0,ye.useEffect)(()=>{if(s.length===0||typeof document>"u")return;let C=T=>{T.key!=="Escape"||T.isComposing||(T.preventDefault(),T.stopPropagation(),k())};return document.addEventListener("keydown",C,!0),()=>document.removeEventListener("keydown",C,!0)},[k,s.length]);let j=(0,ye.useCallback)((C,T,v)=>{m();let{left:E,top:_}=Ju(v?.getBoundingClientRect(),T);c(K=>{let O=K.slice(0,T);return O.length===T&&O[T-1]?.groupId===C?K:[...O,{groupId:C,left:E,top:_,depth:T}]})},[m]),Y=(0,ye.useCallback)(C=>{k(),C.kind==="file"?t(C.path):C.kind==="folder"&&r(C.path)},[k,t,r]),I=C=>{let T,v=E=>{for(let _ of E)_.kind==="group"&&(_.id===C&&(T=_),v(_.children))};return v(e.roots),T},L=C=>{let T=(v,E)=>{if(v.some(_=>_.id===C))return{parentId:E,siblings:v};for(let _ of v){if(_.kind!=="group")continue;let K=T(_.children,_.id);if(K!==void 0)return K}};return T(e.roots,null)??{parentId:null,siblings:[]}},X=(C,T)=>{let v=T?.getBoundingClientRect(),{parentId:E,siblings:_}=L(C.id);h({node:C,parentId:E,siblings:_,left:Pr(v?.left??0),top:(v?.bottom??0)+4})},D=(C,T)=>{let{parentId:v,siblings:E}=L(C.id);h({node:C,parentId:v,siblings:E,left:Pr(T.clientX),top:T.clientY})},Q=(C,T)=>{let{parentId:v,siblings:E}=L(C.id),_=E.map(N=>N.id),K=_.indexOf(C.id),O=K+T;if(K<0||O<0||O>=_.length)return;let x=[..._],[A]=x.splice(K,1);A!==void 0&&(x.splice(O,0,A),h(null),u?.(v,x))},he=C=>{let T=R;if(w(null),T===null||T===C)return;let v=e.roots.map(x=>x.id),E=v.indexOf(T),_=v.indexOf(C);if(E<0||_<0)return;let K=[...v],[O]=K.splice(E,1);O!==void 0&&(K.splice(_,0,O),u?.(null,K))};return(0,ye.useEffect)(()=>{if(y===null||typeof document>"u")return;let C=v=>{v.target instanceof Node&&(v.target instanceof Element&&v.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']")!==null||h(null))},T=v=>{v.key!=="Escape"||v.isComposing||(v.preventDefault(),v.stopPropagation(),h(null))};return document.addEventListener("pointerdown",C),document.addEventListener("keydown",T,!0),()=>{document.removeEventListener("pointerdown",C),document.removeEventListener("keydown",T,!0)}},[y]),(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)("nav",{className:"fx-bookmarks","data-testid":"fx-bookmarks","aria-label":n("bookmarks.label"),children:e.roots.length===0?(0,U.jsx)("span",{className:"fx-bookmark-empty","data-testid":"fx-bookmark-empty",children:n("bookmarks.empty")}):e.roots.map(C=>(0,U.jsxs)("span",{className:"fx-bookmark-slot","data-dragging":R===C.id?"true":void 0,draggable:!0,onDragStart:()=>w(C.id),onDragEnd:()=>w(null),onDragOver:T=>T.preventDefault(),onDrop:T=>{T.preventDefault(),he(C.id)},children:[C.kind==="group"?(0,U.jsxs)("button",{type:"button",className:"fx-bookmark fx-bookmark-group","data-testid":"fx-bookmark","data-kind":"group","aria-haspopup":"menu","aria-expanded":s.some(T=>T.groupId===C.id),title:n("bookmarks.group"),onPointerEnter:T=>j(C.id,1,T.currentTarget),onFocus:T=>j(C.id,1,T.currentTarget),onPointerLeave:P,onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),D(C,T)},children:[(0,U.jsx)("span",{className:"fx-bookmark-name",children:C.name}),(0,U.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,U.jsx)(_s,{})})]}):(0,U.jsx)("button",{type:"button",className:"fx-bookmark","data-testid":"fx-bookmark","data-kind":C.kind,title:C.path,onClick:()=>Y(C),onContextMenu:T=>{T.preventDefault(),T.stopPropagation(),D(C,T)},children:(0,U.jsx)("span",{className:"fx-bookmark-name",children:C.name})}),(0,U.jsx)(Ws,{node:C,t:n,onOpen:X})]},C.id))}),y===null?null:(0,U.jsxs)("div",{className:"fx-bookmark-manage-menu","data-testid":"fx-bookmark-manage-menu",role:"menu","aria-label":n("bookmarks.manage"),style:{left:y.left,top:y.top},children:[(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-rename",onClick:()=>{h(null),i?.(y.node)},children:n("bookmarks.rename")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-remove",onClick:()=>{h(null),a?.(y.node)},children:n("bookmarks.remove")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-up",disabled:y.siblings[0]?.id===y.node.id,onClick:()=>Q(y.node,-1),children:n("bookmarks.moveUp")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-down",disabled:y.siblings[y.siblings.length-1]?.id===y.node.id,onClick:()=>Q(y.node,1),children:n("bookmarks.moveDown")}),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item",role:"menuitem","data-testid":"fx-bookmark-manage-move",onClick:()=>{h(null),l?.(y.node)},children:n("bookmarks.moveToGroup")})]}),s.map(C=>{let T=I(C.groupId);return T===void 0?null:(0,U.jsxs)("div",{className:C.depth===1?"fx-bookmark-flyout":"fx-bookmark-flyout fx-bookmark-flyout-sub","data-testid":"fx-bookmark-flyout","data-depth":C.depth,role:"menu","aria-label":T.name,style:{left:C.left,top:C.top},onPointerEnter:m,onPointerLeave:P,children:[T.children.length===0?null:T.children.map(v=>(0,U.jsxs)("span",{className:"fx-bookmark-item-wrap",children:[v.kind==="group"?(0,U.jsxs)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":"group",role:"menuitem","aria-haspopup":"menu","aria-expanded":s.some(E=>E.groupId===v.id),onPointerEnter:E=>j(v.id,C.depth+1,E.currentTarget),onFocus:E=>j(v.id,C.depth+1,E.currentTarget),onContextMenu:E=>{E.preventDefault(),E.stopPropagation(),D(v,E)},children:[(0,U.jsx)("span",{className:"fx-bookmark-name",children:v.name}),(0,U.jsx)("span",{className:"fx-bookmark-chevron","aria-hidden":"true",children:(0,U.jsx)(_s,{})})]}):(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-item","data-kind":v.kind,role:"menuitem",title:v.path,onClick:()=>Y(v),onContextMenu:E=>{E.preventDefault(),E.stopPropagation(),D(v,E)},children:(0,U.jsx)("span",{className:"fx-bookmark-name",children:v.name})}),(0,U.jsx)(Ws,{node:v,t:n,onOpen:X})]},v.id)),(0,U.jsx)("button",{type:"button",className:"fx-bookmark-item fx-bookmark-new","data-testid":"fx-bookmark-item","data-kind":"new-group",role:"menuitem",disabled:o===void 0,"aria-disabled":o===void 0?!0:void 0,title:o===void 0?n("bookmarks.newGroup.reason"):void 0,onClick:()=>{o!==void 0&&(k(),o(T.id))},children:n("bookmarks.newGroup")})]},T.id)})]})}var ze=require("react");var Zu="dsh_fs_explorer",Qu="bookmarks";function De(e){throw new Error(`bookmarks: ${e}`)}function zs(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Cr(e,n,t){typeof e!="string"&&De(`${n} must be a string`);let r=e.trim();return r===""&&De(`${n} must not be empty`),r.length>t&&De(`${n} must be at most ${String(t)} characters`),r}function Ks(e,n,t,r){t>32&&De(`${n} is nested deeper than ${String(32)} levels`),zs(e)||De(`${n} must be an object`);let o=Cr(e.id,`${n}.id`,200);r.has(o)&&De(`duplicate id "${o}" at ${n}`),r.add(o);let i=Cr(e.name,`${n}.name`,200),a=e.createdAt;(typeof a!="number"||!Number.isFinite(a))&&De(`${n}.createdAt must be a finite number`);let l=e.kind;if(l==="group"){let u=e.children;return Array.isArray(u)||De(`${n}.children must be an array`),{id:o,kind:"group",name:i,createdAt:a,children:u.map((s,c)=>Ks(s,`${n}.children[${String(c)}]`,t+1,r))}}if(l==="file"||l==="folder"){let u=Cr(e.path,`${n}.path`,4096);return{id:o,kind:l,name:i,createdAt:a,path:u}}return De(`${n}.kind must be "group", "file" or "folder"`)}function Gn(e){zs(e)||De("a bookmark tree must be an object"),e.version!==1&&De(`version must be 1, received ${JSON.stringify(e.version)}`);let n=Cr(e.updatedAt,"updatedAt",4096),t=e.roots;Array.isArray(t)||De("roots must be an array");let r=new Set;return{version:1,roots:t.map((o,i)=>Ks(o,`roots[${String(i)}]`,1,r)),updatedAt:n}}var Km={name:Zu,version:1,invalidRecords:"backup-and-skip",tables:{[Qu]:{valueSchema:{parse:Gn}}}};function le(e){throw new Error(`bookmarks: ${e}`)}function Fn(e){return{version:1,roots:[],updatedAt:e}}function yt(e,n){let t=n.name.trim();if(t===""&&le("a node needs a non-empty name"),e==="group")return{id:n.id,kind:"group",name:t,createdAt:n.createdAt,children:[]};let r=typeof n.path=="string"?n.path.trim():"";return r===""&&le(`a ${e} bookmark needs a non-empty path`),{id:n.id,kind:e,name:t,createdAt:n.createdAt,path:r}}function ef(e,n){let t=0,r=(o,i)=>{for(let a of o){if(a.id===n)return t=i,!0;if(a.kind==="group"&&r(a.children,i+1))return!0}return!1};return r(e.roots,1),t}function Gs(e,n){return e.kind!=="group"?n:e.children.reduce((t,r)=>Math.max(t,Gs(r,n+1)),n)}function Vs(e,n){let t=ef(e,n.id);t!==0&&Gs(n,t)>32&&le(`a bookmark cannot be nested deeper than ${String(32)} levels`)}function Zo(e,n,t=null){for(let r of e)n(r,t),r.kind==="group"&&Zo(r.children,n,r.id)}function sn(e,n){let t;return Zo(e.roots,r=>{r.id===n&&(t=r)}),t}function qs(e,n){let t;return Zo(e.roots,(r,o)=>{r.id===n&&(t=o)}),t}function Us(e,n){return e.id===n?!0:e.children.some(t=>t.kind==="group"&&Us(t,n))}function Qo(e,n){if(n===null)return e.roots;let t=sn(e,n);return t===void 0&&le(`no group with id "${n}"`),t.kind!=="group"&&le(`"${n}" is not a group`),t.children}function Xs(e,n){return e===void 0||!Number.isFinite(e)?n:Math.min(Math.max(0,Math.trunc(e)),n)}function Vn(e,n,t){return n===null?t(e):e.map(r=>r.kind!=="group"?r:r.id===n?{...r,children:t(r.children)}:{...r,children:Vn(r.children,n,t)})}function ht(e,n,t){return{version:1,roots:n,updatedAt:t}}var xt=()=>new Date().toISOString();function bt(e,n,t,r,o=xt){let i=Qo(e,n);sn(e,t.id)!==void 0&&le(`a node with id "${t.id}" already exists`);let a=Xs(r,i.length),l=Vn(e.roots,n,s=>[...s.slice(0,a),t,...s.slice(a)]),u=ht(e,l,o());return Vs(u,t),u}function Ys(e,n,t=xt){let r=sn(e,n);r===void 0&&le(`no node with id "${n}"`);let o=qs(e,n);o===void 0&&le(`no node with id "${n}"`);let i=Vn(e.roots,o,a=>a.filter(l=>l.id!==n));return{tree:ht(e,i,t()),removed:r}}function Js(e,n,t,r=xt){let o=t.trim();o===""&&le("a node needs a non-empty name"),sn(e,n)===void 0&&le(`no node with id "${n}"`);let i=a=>a.map(l=>{let u=l.id===n?{...l,name:o}:l;return u.kind==="group"?{...u,children:i(u.children)}:u});return ht(e,i(e.roots),r())}function Zs(e,n,t,r,o=xt){let i=sn(e,n);i===void 0&&le(`no node with id "${n}"`);let a=qs(e,n);if(a===void 0&&le(`no node with id "${n}"`),t!==null){let y=sn(e,t);y===void 0&&le(`no group with id "${t}"`),y.kind!=="group"&&le(`"${t}" is not a group`),i.kind==="group"&&Us(i,t)&&le(`cannot move "${n}" into itself or its own descendant`)}let l=Vn(e.roots,a,y=>y.filter(h=>h.id!==n)),u=Qo({version:1,roots:l,updatedAt:e.updatedAt},t),s=Xs(r,u.length),c=Vn(l,t,y=>[...y.slice(0,s),i,...y.slice(s)]),f=ht(e,c,o());return Vs(f,i),f}function Qs(e,n,t,r=xt){let o=Qo(e,n),i=new Set(o.map(s=>s.id)),a=new Set(t);(t.length!==o.length||a.size!==t.length)&&le(`the new order must name each of the ${String(o.length)} children exactly once`);for(let s of t)i.has(s)||le(`"${s}" is not a child of ${n??"the root"}`);let l=new Map(o.map(s=>[s.id,s])),u=Vn(e.roots,n,()=>t.map(s=>{let c=l.get(s);return c===void 0&&le(`"${s}" is not a child of ${n??"the root"}`),c}));return ht(e,u,r())}var Ue=require("react");var Oe=require("react/jsx-runtime"),nf=200;function tf(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>nf?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function rf(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function kt({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1,initialName:l,titleKey:u,submitKey:s}){let[c,f]=(0,Ue.useState)(()=>l??rf(e)),[y,h]=(0,Ue.useState)(void 0),R=(0,Ue.useRef)(null),w=yr();(0,Ue.useEffect)(()=>{l!==void 0&&(f(l),h(void 0))},[l]),(0,Ue.useEffect)(()=>{let I=R.current;I!==null&&(I.focus(),I.select())},[]);let m=(0,Ue.useCallback)(()=>{if(a)return;let I=tf(c,e);if(!I.ok){h(t(`prompt.error.${I.reason}`));return}h(void 0),r(I.name)},[a,e,r,t,c]),k=I=>{if(!I.nativeEvent.isComposing){if(I.key==="Escape"){I.preventDefault(),I.stopPropagation(),o();return}I.key==="Enter"&&(I.preventDefault(),m())}},P=y??i,j=w.Input,Y=u??(e==="directory"?"prompt.title.folder":"prompt.title.file");return(0,Oe.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(Y),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:k,children:[(0,Oe.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,Oe.jsx)("strong",{children:t(Y)}),(0,Oe.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),j===void 0?(0,Oe.jsx)("input",{ref:R,className:"fx-name-input",type:"text",value:c,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":P===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:I=>{f(I.target.value),h(void 0)}}):(0,Oe.jsx)(j,{ref:R,className:"fx-name-input",value:c,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":P===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:I=>{f(I.target.value),h(void 0)}}),P===void 0?null:(0,Oe.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:P}),(0,Oe.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,Oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,Oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:m,children:t(s??"prompt.submit")})]})]})}var oe=require("react/jsx-runtime");function ed(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}function of(e,n){if(n===null)return[];let t=[],r=(o,i)=>{for(let a of o){if(a.kind!=="group")continue;let l=[...i,a];if(a.id===n)return t.push(...l),!0;if(r(a.children,l))return!0}return!1};return r(e.roots,[]),t}function nd({tree:e,target:n,t,mode:r,node:o,onCommit:i,onClose:a}){let[l,u]=(0,ze.useState)(null),[s,c]=(0,ze.useState)(e),[f,y]=(0,ze.useState)(!1),[h,R]=(0,ze.useState)(void 0),w=(0,ze.useRef)(null);(0,ze.useEffect)(()=>{let L=D=>{D.target instanceof Node&&w.current?.contains(D.target)!==!0&&a()},X=D=>{D.key!=="Escape"||D.isComposing||f||(D.preventDefault(),D.stopPropagation(),a())};return document.addEventListener("pointerdown",L),document.addEventListener("keydown",X,!0),()=>{document.removeEventListener("pointerdown",L),document.removeEventListener("keydown",X,!0)}},[f,a]);let m=()=>(l===null?s.roots:sn(s,l)?.kind==="group"?sn(s,l).children:[]).filter(X=>X.kind==="group"),k=(0,ze.useCallback)(()=>{try{if(r==="move"){if(o===void 0)return;i(Zs(s,o.id,l));return}if(n===void 0)return;let L=yt(n.kind==="directory"?"folder":"file",{id:ed(),name:n.name,path:n.path,createdAt:Date.now()});i(bt(s,l,L))}catch(L){R(L instanceof Error?L.message:String(L))}},[l,s,r,o,i,n]),P=L=>{try{let X=yt("group",{id:ed(),name:L,createdAt:Date.now()}),D=bt(s,l,X);c(D),y(!1),R(void 0),u(X.id)}catch(X){R(X instanceof Error?X.message:String(X))}},j=of(s,l),Y=t(r==="move"?"bookmarks.picker.move":"bookmarks.picker.add"),I=t(r==="move"?"bookmarks.picker.moveHere":"bookmarks.picker.addHere");return(0,oe.jsxs)("div",{ref:w,className:"fx-bookmark-picker",role:"dialog","aria-modal":"false","aria-label":Y,"data-testid":"fx-bookmark-picker","data-mode":r,children:[(0,oe.jsxs)("div",{className:"fx-bookmark-picker-head",children:[(0,oe.jsx)("strong",{children:Y}),r==="add"&&n!==void 0?(0,oe.jsx)("span",{className:"fx-bookmark-picker-target",children:n.name}):null,r==="move"&&o!==void 0?(0,oe.jsx)("span",{className:"fx-bookmark-picker-target",children:o.name}):null]}),(0,oe.jsxs)("nav",{className:"fx-bookmark-crumbs","aria-label":t("bookmarks.picker.root"),children:[(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(null),children:t("bookmarks.picker.root")}),j.map(L=>(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-crumb","data-testid":"fx-bookmark-crumb",onClick:()=>u(L.id),children:L.name},L.id))]}),(0,oe.jsx)("div",{className:"fx-bookmark-picker-list",role:"group",children:m().length===0?(0,oe.jsx)("span",{className:"fx-bookmark-empty",children:t("bookmarks.picker.empty")}):m().map(L=>(0,oe.jsx)("button",{type:"button",className:"fx-bookmark-item","data-testid":"fx-bookmark-picker-group",onClick:()=>u(L.id),children:(0,oe.jsx)("span",{className:"fx-bookmark-name",children:L.name})},L.id))}),h===void 0?null:(0,oe.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-bookmark-picker-error",children:h}),f?(0,oe.jsx)(kt,{kind:"directory",parent:l??"",t,initialName:t("bookmarks.newGroup"),titleKey:"bookmarks.newGroup",onSubmit:P,onCancel:()=>y(!1)}):(0,oe.jsxs)("div",{className:"fx-bookmark-picker-actions",children:[(0,oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",onClick:()=>y(!0),children:t("bookmarks.newGroup")}),(0,oe.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary","data-testid":"fx-bookmark-picker-commit",onClick:k,children:I})]})]})}function ei(e){return`dsh-fs-explorer.bookmarks.${e}`}function ni(e){return`${ei(e)}.pending`}function Tr(){try{return globalThis.localStorage??void 0}catch{return}}function td(e){let n=Tr();if(n===void 0)return;let t;try{t=n.getItem(ei(e))}catch{return}if(t!==null)try{return Gn(JSON.parse(t))}catch{return}}function af(e,n){let t=Tr();if(t!==void 0)try{t.setItem(ei(e),JSON.stringify(n)),t.setItem(ni(e),"1")}catch{}}function sf(e){let n=Tr();if(n===void 0)return!1;try{return n.getItem(ni(e))==="1"}catch{return!1}}function rd(e){let n=Tr();if(n!==void 0)try{n.removeItem(ni(e))}catch{}}function od(e){return{async load(n){let t=e?.loadBookmarks;if(t!==void 0)try{let r=await t.call(e,n);if(r.ok)return r.tree!==null?(rd(n),r.tree):sf(n)?td(n)??Fn(new Date().toISOString()):Fn(new Date().toISOString())}catch{}return td(n)??Fn(new Date().toISOString())},async save(n,t){let r=Gn(t),o=e?.saveBookmarks;if(o!==void 0)try{if((await o.call(e,n,r)).ok){rd(n);return}}catch{}af(n,r)}}}var ti="fs-explorer.treePaneWidth";function ri(e){return Math.min(520,Math.max(180,e))}function ad(e){if(e==null)return null;let n;try{n=e.getItem(ti)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Er(e,n){let t=Math.round(ri(n));if(e!=null)try{e.setItem(ti,String(t))}catch{}return t}function sd(e){if(e!=null)try{e.removeItem(ti)}catch{}}function dd(e,n){return Math.round(e)===Math.round(n)}var id=16;function ld(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-id};case"ArrowRight":return{kind:"nudge",delta:id};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var vt=require("react"),hn=require("react/jsx-runtime");function cd({t:e,value:n,origin:t,count:r,busy:o,onChange:i,onStep:a,onActivate:l,onClose:u,focusSignal:s}){let c=(0,vt.useRef)(null),f=(0,vt.useRef)(s);(0,vt.useEffect)(()=>{f.current!==s&&(f.current=s,c.current?.focus())},[s]);let y=R=>{if(!R.nativeEvent.isComposing){if(R.key==="Escape"){R.preventDefault(),R.stopPropagation(),u();return}if(R.key==="ArrowDown"||R.key==="ArrowUp"){R.preventDefault(),a(R.key==="ArrowDown"?1:-1);return}R.key==="Enter"&&(R.preventDefault(),l())}},h=t===null?null:e(t==="index"?"search.scope.index":"search.scope.loaded");return(0,hn.jsxs)("div",{className:"fx-search","data-testid":"fs-tree-search",onKeyDown:y,children:[(0,hn.jsx)("input",{ref:c,type:"search",className:"fx-search-input","data-testid":"fs-tree-search-input",value:n,spellCheck:!1,autoComplete:"off",placeholder:e("search.placeholder"),"aria-label":e("search.placeholder"),onChange:R=>i(R.currentTarget.value)}),h===null?null:(0,hn.jsxs)("span",{className:"fx-search-scope","data-testid":"fs-tree-search-scope","data-origin":t,title:e("search.scope"),children:[h,o?(0,hn.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]}),t===null?null:(0,hn.jsx)("span",{className:"fx-search-count","data-testid":"fs-tree-search-count","data-state":r===0?"empty":"ready",children:r===0?e("search.none"):e("search.count").replace("{count}",String(r))}),n===""?null:(0,hn.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-tree-search-close",title:e("search.close"),"aria-label":e("search.close"),onClick:u,children:"\xD7"})]})}function Ke(e){return e!==null&&typeof e=="object"}function Fr(e){try{return e()}catch{return}}function df(e){let n=Fr(()=>typeof e.get=="function"?e.get("connection"):void 0),t=Ke(n)?n.rpc:void 0;if(!(!Ke(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${Ti}/${r}`,o,i)}function lf(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create"),loadBookmarks:n("loadBookmarks"),saveBookmarks:n("saveBookmarks"),ignored:n("ignored")}}function oi(e){return Ke(e)&&typeof e.capabilities=="function"&&typeof e.info=="function"&&typeof e.reveal=="function"}function cf(e){return()=>{let n=df(e);if(n!==void 0)return lf(n);let t=Fr(()=>e.fsExplorerWorkspace);if(oi(t))return t;let r=Fr(()=>Ke(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(oi(r))return r;let o=Fr(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(oi(o))return o}}function Mn(e){let n=Ke(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=Ke(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return Ke(t)?t:void 0}var uf=["no-workspace","outside-workspace","not-found","not-directory","exists","invalid-name","unsupported","permission","no-storage","io-error"];function Ln(e){let n=Ke(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:uf.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function ff(e){let n=Mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Ln(n.error)};let t=Ke(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function pf(e){let n=Mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Ln(n.error)};let t=Ke(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function mf(e){let n=Mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Ln(n.error)}:{ok:!0}}function gf(e){let n=Mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Ln(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}function yf(e){let n=Mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Ln(n.error)};if(n.tree===null||n.tree===void 0)return{ok:!0,tree:null};try{return{ok:!0,tree:Gn(n.tree)}}catch(t){return{ok:!1,error:{code:"io-error",message:t instanceof Error?t.message:""}}}}function hf(e){let n=Mn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Ln(n.error)}:{ok:!0}}function xf(e){let n=Mn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Ln(n.error)};let t=Ke(n.ignored)?n.ignored:void 0;return t===void 0?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,entries:(Array.isArray(t.entries)?t.entries:[]).filter(i=>typeof i=="string"&&i!==""),truncated:t.truncated===!0}}var wt={code:"unsupported",message:"the workspace service is unavailable"};function ud(e){let n=cf(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:wt});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),ff),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),pf),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),mf),create:(r,o,i,a,l)=>t(u=>{let s=u.create;return typeof s!="function"?{ok:!1,error:wt}:s.call(u,{sessionId:r,parent:o,name:i,kind:a},l)},gf),loadBookmarks:(r,o)=>t(i=>{let a=i.loadBookmarks;return typeof a!="function"?{ok:!1,error:wt}:a.call(i,{sessionId:r},o)},yf),saveBookmarks:(r,o,i)=>t(a=>{let l=a.saveBookmarks;return typeof l!="function"?{ok:!1,error:wt}:l.call(a,{sessionId:r,tree:o},i)},hf),ignored:(r,o)=>t(i=>{let a=i.ignored;return typeof a!="function"?{ok:!1,error:wt}:a.call(i,{sessionId:r},o)},xf)}}var bf={github:"GitHub",gitlab:"GitLab",gitee:"Gitee",bitbucket:"Bitbucket",codeberg:"Codeberg",generic:"Git"};function kf(e){let n=e.toLowerCase();return n==="github.com"?"github":n==="gitee.com"?"gitee":n==="bitbucket.org"?"bitbucket":n==="codeberg.org"?"codeberg":n.includes("gitlab")?"gitlab":"generic"}var vf={github:{file:"blob",directory:"tree"},gitlab:{file:"-/blob",directory:"-/tree"},gitee:{file:"blob",directory:"tree"},bitbucket:{file:"src",directory:"src"},codeberg:{file:"src/branch",directory:"src/branch"},generic:{file:"blob",directory:"tree"}};function wf(e){let n=e.trim();if(n==="")return;let t=/^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(n);if(t!==null&&!n.includes("://")){let u=t[1]??"",s=fd(t[2]??"");return s===""?void 0:{base:`https://${u}/${s}`,host:u}}if(/^([a-z][a-z0-9+.-]*):\/\//iu.exec(n)===null)return;let o;try{o=new URL(n)}catch{return}let i=o.protocol.toLowerCase();if(i!=="http:"&&i!=="https:"&&i!=="ssh:"&&i!=="git:"||o.hostname==="")return;let a=fd(o.pathname);return a===""?void 0:{base:`${i==="http:"?"http":"https"}://${o.hostname}/${a}`,host:o.hostname}}function fd(e){return e.replace(/^\/+/u,"").replace(/\/+$/u,"").replace(/\.git$/u,"").replace(/\/+$/u,"")}function Sf(e){return e.split("/").filter(n=>n!=="").map(n=>encodeURIComponent(n)).join("/")}function Rf(e){let n=e?.branch;if(typeof n=="string"&&n!=="")return Pf(n);let t=e?.hash;return typeof t=="string"&&t!==""?t:"HEAD"}function Pf(e){return e.split("/").map(n=>encodeURIComponent(n)).join("/")}function Cf(e,n){let t=e.replace(/\/+$/u,"");if(t!==""){if(n===t)return"";if(n.startsWith(`${t}/`))return n.slice(t.length+1)}}function pd(e){let{remotes:n,root:t,absolutePath:r,kind:o,head:i}=e;if(n===void 0||n.length===0)return[];if(t===void 0||r===void 0)return[];let a=Cf(t,r);if(a===void 0)return[];let l=Rf(i),u=Sf(a),s=[],c=new Set;for(let f of n){if(c.has(f.name))continue;let y=wf(f.url);if(y===void 0)continue;c.add(f.name);let h=kf(y.host),R=vf[h][o],w=u===""?"":`/${u}`;s.push({id:`copy.remote.${f.name}`,label:`${f.name} \xB7 ${bf[h]}`,url:`${y.base}/${R}/${l}${w}`})}return s}var M=require("react/jsx-runtime");function Tf({open:e}){return(0,M.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,M.jsx)("path",{d:"M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z"}),(0,M.jsx)("circle",{cx:"8",cy:"8",r:"1.9"}),e?null:(0,M.jsx)("path",{d:"M2.6 13.4 13.4 2.6"})]})}function Ef(){let e=globalThis.crypto?.randomUUID;return typeof e=="function"?e.call(globalThis.crypto):`bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`}var Ff=()=>({status:"loading",nodes:[],truncated:!1,total:0});function ai(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var yd="dsh-fs-explorer.show-ignored";function Mf(e){if(e==null)return!0;try{return e.getItem(yd)!=="0"}catch{return!0}}function Lf(e,n){if(n!=null)try{n.setItem(yd,e?"1":"0")}catch{}}var Nf=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,gd=new Map;function If(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Mr({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,M.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,M.jsx)("strong",{children:e}),n===void 0?null:(0,M.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,M.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Af(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function hd({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:u,workspace:s,fileReferences:c,reference:f,referenceSourceAvailable:y}){let h=Sa();function R(w){let m=w.sessionId??e.currentSessionId(),k=(0,g.useRef)(m);k.current=m;let P=(0,g.useMemo)(()=>r(),[r]),j=(0,g.useMemo)(()=>o(),[o]),Y=(0,g.useMemo)(()=>i(),[i]),I=(0,g.useMemo)(()=>m===void 0||u===void 0?void 0:u(m),[u,m]),L=(0,g.useMemo)(()=>m===void 0||s===void 0?void 0:s(m),[s,m]),X=(0,g.useMemo)(()=>od(L),[L]),[D,Q]=(0,g.useState)(()=>Fn(new Date().toISOString())),he=(0,g.useRef)(!1),[C,T]=(0,g.useState)(null),[v,E]=(0,g.useState)(null),_=(0,g.useRef)(!1),K=(0,g.useRef)(!1),[O,x]=(0,g.useState)(null),[A,N]=(0,g.useState)(null),[ee,ce]=(0,g.useState)(void 0),[je,xn]=(0,g.useState)(null),ve=(0,g.useRef)(null),[we,ue]=(0,g.useState)(null),[G,V]=(0,g.useState)(()=>new Map),[Se,Xe]=(0,g.useState)(void 0),[Ne,dn]=(0,g.useState)(void 0),[Ye,He]=(0,g.useState)(void 0),[Je,Fe]=(0,g.useState)(void 0),[St,qn]=(0,g.useState)(gd),xe=(0,g.useRef)(G);xe.current=G;let[Ge,be]=(0,g.useState)(()=>new Set),$=(0,g.useMemo)(()=>h.forSession(m),[h,m]),Ie=(0,g.useSyncExternalStore)($.subscribe,$.snapshot,$.snapshot),Un=Ie.panels.find(d=>d.key===Ie.active),bn=Un?.path,Xn=Un?.revision,[Nn,Yn]=(0,g.useState)(0),_e=(0,g.useRef)(new Map),Jn=(0,g.useRef)(void 0),[Zn,ln]=(0,g.useState)([]),[Ze,Qe]=(0,g.useState)(()=>Mf(ai())),[fe,In]=(0,g.useState)(null),[cn,q]=(0,g.useState)(!1),[Re,We]=(0,g.useState)(null),un=(0,g.useRef)(null);un.current=fe?.path??null;let Me=(0,g.useMemo)(()=>ai(),[]),[$e,Pe]=(0,g.useState)(()=>ad(Me)),Br=(0,g.useRef)(null),An=(0,g.useRef)(null),ie=G.get(""),Rt=ie?.status==="ready",li=(0,g.useCallback)((d,p,b,S)=>{$.open(d,p,b,S)},[$]),Bn=(0,g.useCallback)(d=>{let p=new Set($.snapshot().panels.map(B=>B.key)),b=[];for(let B of d){if(!p.has(B))continue;if((m===void 0?void 0:l?.peek(m,B))?.dirty===!0){b.push(B);continue}m!==void 0&&l?.forget(m,B),$.close(B)}let S=b[0];We(null),In(S===void 0?null:{path:S,rest:b.slice(1)})},[l,m,$]),kn=(0,g.useCallback)(d=>{In(null),We(null),d.length>0&&Bn(d)},[Bn]),vn=(0,g.useCallback)(d=>{let p=d??$.snapshot().active??void 0;p!==void 0&&Bn([p])},[Bn,$]);(0,g.useEffect)(()=>{let d=e.registerPageCloser;if(typeof d=="function")return d(()=>{let p=ma({viewSessionId:m,currentSessionId:e.currentSessionId(),activePanel:$.snapshot().active,confirming:un.current!==null});return p==="close"&&vn(),p!=="pass"})},[vn,m,$,e]);let Pd=(0,g.useCallback)(()=>{let d=fe;if(d===null)return;let p=m===void 0?void 0:l?.find(m,d.path);if(p===void 0){m!==void 0&&l?.forget(m,d.path),$.close(d.path),kn(d.rest);return}q(!0),We(null),p.save().then(b=>{if(q(!1),!b.ok){let S=p.getSnapshot().error;We(t("panel.confirm.failed").replace("{message}",Ho(b.code,S?.message??"",t)));return}m!==void 0&&l?.forget(m,d.path),$.close(d.path),kn(d.rest)})},[kn,l,fe,m,$,t]),Cd=(0,g.useCallback)(()=>{let d=fe;if(We(null),d===null){In(null);return}m!==void 0&&l?.forget(m,d.path),$.close(d.path),kn(d.rest)},[kn,l,fe,m,$]),Dr=(0,g.useCallback)(()=>{let d=fe;if(d===null){We(null);return}kn(d.rest)},[kn,fe]),pe=(0,g.useCallback)(async(d,p,b)=>{_e.current.get(d)?.abort();let S=new AbortController;_e.current.set(d,S),V(B=>new Map(B).set(d,Ff()));try{let B=await b.list(p,jn(d),S.signal);if(S.signal.aborted||k.current!==p)return!1;let z=En(B);if(!z.ok)return V(ae=>new Map(ae).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:z.message})),!1;let Ce=On(z.listing.entries);return V(ae=>new Map(ae).set(d,{status:"ready",nodes:Ce,truncated:z.listing.truncated===!0,total:z.listing.entries.length})),!0}catch(B){return S.signal.aborted||V(z=>new Map(z).set(d,{status:"failed",nodes:[],truncated:!1,total:0,message:br(B)})),!1}finally{_e.current.get(d)===S&&_e.current.delete(d)}},[]);(0,g.useEffect)(()=>{for(let d of _e.current.values())d.abort();return _e.current.clear(),V(new Map),be(new Set),Jn.current=void 0,m!==void 0&&P!==void 0&&pe("",m,P),()=>{for(let d of _e.current.values())d.abort();_e.current.clear()}},[m,P,Nn,pe]),(0,g.useEffect)(()=>{if(m===void 0||j===void 0){Xe(void 0),dn(void 0),He(void 0),Fe(void 0);return}let d=!0,p=new AbortController;return Xe(void 0),dn(void 0),He(void 0),Fe(void 0),Promise.resolve().then(()=>j.snapshot({sessionId:m,maxCommits:1},p.signal)).then(b=>{if(!d)return;let S=kr(b);if(!S.ok){Xe(void 0),dn(void 0),He(void 0),Fe(void 0);return}Xe(Bi(_t(S.status),S.stats)),dn(S.head),He(S.root),Fe(S.remotes)}).catch(()=>{d&&(Xe(void 0),dn(void 0),He(void 0),Fe(void 0))}),()=>{d=!1,p.abort()}},[m,j,Nn]),(0,g.useEffect)(()=>{let d=P?.read;if(m===void 0||P===void 0||typeof d!="function"||!Rt){qn(gd);return}let p=m,b=new AbortController,S=async(z,Ce)=>{try{let ae=If(await d.call(P,p,Ce,{},b.signal));return ae===void 0?void 0:[z,ae]}catch{return}},B=_i.filter(z=>z!==".gitmodules").map(z=>S(z,z));return Ye!==void 0&&B.push(S(".gitmodules",`${Ye.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(B).then(z=>{if(b.signal.aborted||k.current!==p)return;let Ce=new Map;for(let Sn of z)Sn!==void 0&&Ce.set(Sn[0],Sn[1]);let ae=xe.current.get(""),rt=new Set(ae?.status==="ready"?ae.nodes.filter(Sn=>Sn.kind==="directory").map(Sn=>Sn.name):[]);qn(zt(Ce,rt))}),()=>b.abort()},[m,P,Rt,Ye,Nn]);let[Td,Ed]=(0,g.useState)(void 0),Or=(0,g.useRef)(void 0),ci=(0,g.useRef)(0),jr=(0,g.useRef)(void 0),_r=(0,g.useRef)(!1),[Pt,ui]=(0,g.useState)(void 0),Qn=(0,g.useCallback)((d,p,b)=>{ci.current+=1,Ed({nonce:ci.current,...d===void 0?{}:{path:d},...p===void 0?{}:{delta:p},focus:b})},[]),Dn=(0,g.useCallback)((d,p)=>{let b=ka(d);if(be(S=>{let B=new Set(S);for(let z of b)B.add(z);return B}),!(m===void 0||P===void 0)){for(let S of b)xe.current.get(S)===void 0&&pe(S,m,P);p==="directory"&&xe.current.get(d)===void 0&&pe(d,m,P)}},[P,pe,m]),Ct=(0,g.useCallback)(d=>{let p=Wn(xe.current).find(b=>b.path===d);if(Dn(d,p?.kind),p?.kind==="directory"&&be(b=>new Set(b).add(d)),_r.current=!0,p===void 0){jr.current=d;return}Qn(d,void 0,!0)},[Qn,Dn]),et=(0,g.useCallback)(d=>{d!==""&&(ui({path:d}),Ct(d))},[Ct]),Fd=(0,g.useCallback)((d,p)=>{if(p==="directory"){et(d);return}$.open(d,1,!1)},[et,$]),fi=(0,g.useCallback)((d,p)=>{if(!p){et(d);return}if(m===void 0||P===void 0)return;_r.current=!0;let b=m;Promise.resolve(P.list(b,d)).then(S=>{if(k.current!==b)return;let B=En(S),z=B.ok?B.listing.path:void 0;z===void 0||z===""||et(z)},()=>{})},[et,P,m]),Tt=(0,g.useCallback)(d=>{ir(d,{open:li,reveal:Ct,enter:fi})},[li,Ct,fi]);(0,g.useEffect)(()=>{let d=w.viewRequest;if(d==null||d.view!==te)return;let p=`${d.view}:${d.focus}`;Jn.current!==p&&(Jn.current=p,Tt(d.focus),w.completeViewRequest?.())},[w.viewRequest,w.completeViewRequest,Tt]),(0,g.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||m===void 0)return;let p=()=>{let b=d.take(te);b!==void 0&&Tt(b)};return p(),d.subscribe(p)},[e,m,Tt]),(0,g.useEffect)(()=>{if(bn===void 0||Xn!==void 0||!Rt||nn(bn))return;let d=lt(bn);if(d.length===0||(be(b=>d.every(S=>b.has(S))?b:new Set([...b,...d])),m===void 0||P===void 0))return;let p=d.filter(b=>xe.current.get(b)?.status!=="ready");p.length!==0&&Promise.all(p.map(b=>pe(b,m,P)))},[bn,Xn,Rt,m,P,pe]);let pi=(0,g.useCallback)(()=>{if(typeof document>"u")return!1;let d=document.querySelector("[data-composer-input]");return d===null?!1:(d.focus(),!0)},[]),Md=(0,g.useCallback)(d=>{if(d.button!==0||An.current!==null||Nf())return;let p=Br.current?.previousElementSibling;if(p instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}An.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:$e},document.body.classList.add("fx-pane-resizing")}},[$e]),Ld=(0,g.useCallback)(d=>{let p=An.current;p===null||p.pointerId!==d.pointerId||Pe(ri(p.baseWidth+d.clientX-p.startX))},[]),Wr=(0,g.useCallback)(d=>{let p=An.current;if(p===null||p.pointerId!==d.pointerId)return;An.current=null,document.body.classList.remove("fx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let b=p.baseWidth+d.clientX-p.startX;if(dd(b,p.baseWidth)){Pe(p.restWidth);return}Pe(Er(Me,b))},[Me]),$r=(0,g.useCallback)(()=>{sd(Me),Pe(null)},[Me]),Nd=(0,g.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let p=ld(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(p===null)return;if(d.preventDefault(),d.stopPropagation(),p.kind==="reset"){$r();return}if(p.kind==="min"||p.kind==="max"){let B=p.kind==="min"?180:520;Pe(Er(Me,B));return}let b=Br.current?.previousElementSibling,S=b instanceof HTMLElement?b.getBoundingClientRect().width:$e??180;Pe(Er(Me,S+p.delta))},[Me,$r,$e]);(0,g.useEffect)(()=>()=>{An.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=p=>{if(!(p.isComposing||pa(p.target))){if(Af(p)){let b=$.snapshot().active,S=b===null||l===void 0||m===void 0?void 0:l.find(m,b);if(S===void 0)return;p.preventDefault(),p.stopPropagation(),S.save();return}for(let b of Zt)if(fa(p,b)){if(b.action==="closePanel"&&$.snapshot().active===null)return;p.preventDefault(),p.stopPropagation(),b.action==="nextPanel"?$.next():b.action==="previousPanel"?$.previous():vn();return}}};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[l,vn,m,$]),(0,g.useEffect)(()=>{if(typeof document>"u")return;let d=er({focusComposer:pi,hasModal:()=>un.current!==null||_.current||K.current||Qt(document)}),p=b=>d(b);return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[pi]),(0,g.useEffect)(()=>{if(fe===null||typeof document>"u")return;let d=p=>{p.key!=="Escape"||p.isComposing||(p.preventDefault(),p.stopPropagation(),Dr())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[fe,Dr]);let mi=(0,g.useMemo)(()=>Ot(Zn),[Zn]),Et=(0,g.useMemo)(()=>Vt(G,Ge,Se,St,{ignored:mi,showIgnored:Ze,hiddenLabel:d=>t("state.hiddenDirectory").replace("{count}",String(d))}),[G,Ge,Se,St,mi,Ze,t]),[fn,gi]=(0,g.useState)(""),[yi,Ft]=(0,g.useState)([]),[hi,Mt]=(0,g.useState)(null),[Id,nt]=(0,g.useState)(!1),[Ad,Bd]=(0,g.useState)(0),Dd=(0,g.useCallback)(()=>Bd(d=>d+1),[]);(0,g.useEffect)(()=>{let d=xa(fn);if(d===void 0){Ft([]),Mt(null),nt(!1);return}let p=()=>{let B=ba(Wn(xe.current),d);Ft(yo(B.map(z=>({path:z.path,kind:z.kind==="directory"?"directory":"file"})),Se)),Mt("loaded"),nt(!1)},b=c?.();if(b===void 0||m===void 0){p();return}let S=new AbortController;return nt(!0),Promise.resolve(b.list(m,d,S.signal)).then(B=>{if(S.signal.aborted)return;let z=ha(B);Ft(yo(z,Se)),Mt("index"),nt(!1)},B=>{S.signal.aborted||(console.debug(`[${se}] the file index failed, searching listed rows instead`,B),p())}),()=>S.abort()},[fn,m,Se,c]);let zr=hi!==null,Od=zr?yi:Et;(0,g.useEffect)(()=>{let d=jr.current;if(d===void 0)return;let p=Wn(xe.current).find(b=>b.path===d);p!==void 0&&(jr.current=void 0,p.kind==="directory"&&(Dn(d,p.kind),be(b=>new Set(b).add(d))),Qn(d,void 0,!0))},[Et,Qn,Dn]),(0,g.useEffect)(()=>{if(Pt===void 0)return;let d=G.get(Pt.path);if(d===void 0||d.status==="loading"||(ui(void 0),d.status!=="ready"))return;let p=qi(d.nodes,Pt.path);p!==void 0&&$.open(p,1,!1)},[Pt,G,$]);let[jd,Lt]=(0,g.useState)(void 0),xi=(0,g.useRef)(!1);(0,g.useEffect)(()=>{if(xi.current||typeof document>"u")return;let d=Ui({rows:Et,panelCount:$.snapshot().panels.length,hasModal:Qt(document)});d.kind!=="skip"&&(xi.current=!0,!_r.current&&(d.open!==void 0&&$.open(d.open),Lt({path:d.focus})))},[Et,$]);let _d=(0,g.useCallback)(()=>Lt(void 0),[]),tt=Se===void 0?void 0:Object.keys(Se).length,Wd=Se===void 0?"neutral":Object.values(Se).some(d=>d.status==="conflicted")?"conflict":tt===0?"success":"warning",bi=Ai(Ne),$d=(0,g.useCallback)(d=>{if(m===void 0||P===void 0)return;if(Ge.has(d)){be(b=>{let S=new Set(b);return S.delete(d),S});return}be(b=>new Set(b).add(d));let p=G.get(d);(p===void 0||p.status==="failed")&&pe(d,m,P)},[Ge,G,m,P,pe]),ki=(0,g.useCallback)(d=>{m===void 0||P===void 0||pe(d,m,P)},[m,P,pe]);(0,g.useEffect)(()=>{let d=!0;if(he.current=!1,m===void 0){Q(Fn(new Date().toISOString()));return}return X.load(m).then(p=>{d&&!he.current&&Q(p)}).catch(()=>{}),()=>{d=!1}},[X,m]);let zd=(0,g.useCallback)(d=>{let p=[...lt(d),d];if(be(b=>{let S=new Set(b);for(let B of p)S.add(B);return S}),m!==void 0&&P!==void 0){let b=p.filter(S=>xe.current.get(S)?.status!=="ready");b.length>0&&Promise.all(b.map(S=>pe(S,m,P)))}Lt({path:d})},[m,P,pe]),Kd=(0,g.useCallback)(d=>{$.open(d)},[$]),ne=(0,g.useCallback)((d,p)=>{ve.current!==null&&clearTimeout(ve.current),xn({text:d,tone:p}),ve.current=setTimeout(()=>{ve.current=null,xn(null)},4e3)},[]);(0,g.useEffect)(()=>()=>{ve.current!==null&&clearTimeout(ve.current)},[]);let wn=(0,g.useCallback)(d=>{he.current=!0,Q(d),m!==void 0&&X.save(m,d).catch(()=>{ne(t("bookmarks.saveFailed"),"error")})},[ne,X,m,t]),Hd=(0,g.useCallback)(d=>{try{wn(Ys(D,d.id).tree),ne(t("bookmarks.removed"),"ok")}catch{}},[ne,D,wn,t]),Gd=(0,g.useCallback)((d,p)=>{try{wn(Qs(D,d,p))}catch{}},[D,wn]);(0,g.useEffect)(()=>{if(L===void 0){ce(void 0);return}let d=!0;return L.capabilities(m??"").then(p=>{d&&ce(p.ok?p.capabilities:void 0)}),()=>{d=!1}},[L,m]),(0,g.useEffect)(()=>{let d=L?.ignored;if(m===void 0||L===void 0||typeof d!="function"){ln([]);return}let p=new AbortController,b=!0;return Promise.resolve().then(()=>d.call(L,m,p.signal)).then(S=>{b&&ln(S.ok?S.entries:[])}).catch(()=>{b&&ln([])}),()=>{b=!1,p.abort()}},[m,L,Nn]);let Vd=(0,g.useCallback)(()=>{Qe(d=>{let p=!d;return Lf(p,ai()),p})},[]),qd=(0,g.useCallback)((d,p,b)=>{let S=d===void 0?"":d.kind==="directory"?d.path:Bs(d.path);if(x({row:d,anchor:p,absolutePath:void 0,trigger:b,createParent:S}),d===void 0||L===void 0)return;let B=d.path;L.info(m??"",B).then(z=>{x(Ce=>Ce===null||Ce.row?.path!==B?Ce:{...Ce,absolutePath:z.ok?z.info.absolutePath:void 0})})},[m,L]),Ud=(0,g.useCallback)(()=>x(null),[]),Xd=(0,g.useCallback)((d,p,b)=>{N({key:d,anchor:p,trigger:b})},[]),Yd=(0,g.useCallback)(()=>N(null),[]),Nt=(0,g.useCallback)(()=>{let d=w.inputActions;return m===void 0||d===void 0?void 0:{session:!0,insertReference:typeof f?.(m)?.insertReference=="function",source:y?.()===!0}},[w.inputActions,y,f,m]),It=(0,g.useCallback)((d,p,b)=>{let S=w.inputActions;if(m===void 0||S===void 0){ne(t("notice.referenceFailed"),"error");return}let B=f?.(m),z=Ls(d,p,b),Ce=Ns({captureSpan:()=>{let ae=S.captureInsertion?.();return ae===void 0?void 0:{start:ae.start,end:ae.end,draftRev:ae.draftRev}},insertReference:(ae,rt)=>B?.insertReference?.(ae,rt)??!1,insertText:(ae,rt)=>S.insertText?.(ae,rt)??!1,canInsertReference:y?.()===!0},z);if(Ce==="failed"){ne(t("notice.referenceFailed"),"error"),B?.notify?.("error",t("notice.referenceFailed"));return}B?.focus?.(),Ce==="text"&&ne(t("notice.referenced").replace("{name}",z.label),"ok")},[ne,w.inputActions,f,m,t]),Jd=(0,g.useCallback)(d=>{let p=A;if(N(null),p===null)return;if(d===an.reference){let S=$.snapshot().panels.find(z=>z.key===p.key);if(S===void 0)return;let B=Wn(xe.current).find(z=>z.path===S.path);It(S.path,Sr(S.path),B?.kind==="directory"?"directory":"file");return}if(d===an.close){vn(p.key);return}let b=d===an.closeOthers?"others":d===an.closeRight?"right":void 0;b!==void 0&&Bn(wa($.snapshot().panels,p.key,b))},[Bn,It,vn,$,A]);_.current=O!==null,K.current=A!==null;let At=(0,g.useMemo)(()=>pd({remotes:Je,root:Ye,absolutePath:O?.absolutePath,kind:O?.row?.kind??"file",head:Ne}),[O?.absolutePath,O?.row?.kind,Ye,Ne,Je]),Kr=(0,g.useCallback)(d=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${d.code}`)),[t]),Zd=(0,g.useCallback)(d=>{let p=O;if(x(null),p===null)return;if(d===re.createFile||d===re.createFolder){let S=p.createParent;if(S===void 0)return;ue({kind:d===re.createFolder?"directory":"file",parent:S,error:void 0,busy:!1});return}let b=p.row;if(b!==void 0){if(d.startsWith(`${re.copyRemote}.`)){let S=At.find(B=>B.id===d);if(S===void 0)return;Cn(S.url).then(B=>{ne(B?t("notice.copiedRemote").replace("{remote}",S.label):t("notice.copyFailed"),B?"ok":"error")});return}if(d===re.copyRelative){Cn(b.path).then(S=>{ne(t(S?"notice.copiedRelative":"notice.copyFailed"),S?"ok":"error")});return}if(d===re.copyAbsolute){let S=p.absolutePath;if(S===void 0)return;Cn(S).then(B=>{ne(t(B?"notice.copiedAbsolute":"notice.copyFailed"),B?"ok":"error")});return}if(d===re.addBookmark){T({mode:"add",target:{name:b.name,path:b.path,kind:b.kind}});return}if(d===re.reference){It(b.path,b.name,b.kind);return}if(d===re.reveal){if(L===void 0){ne(Kr({code:"unsupported",message:""}),"error");return}L.reveal(m??"",b.path).then(S=>{if(!S.ok){ne(Kr(S.error),"error");return}let B=t(`menu.manager.${ee?.fileManager??"directory"}`);ne(t("notice.revealed").replace("{manager}",B),"ok")})}}},[ne,ee,O,It,At,Kr,m,t,L]),Qd=(0,g.useCallback)(d=>{let p=we;if(p===null)return;if(L===void 0||L.create===void 0){ue({...p,error:t("prompt.error.unsupported"),busy:!1});return}let b=m;if(b===void 0){ue({...p,error:t("prompt.error.no-workspace"),busy:!1});return}ue({...p,busy:!0,error:void 0}),L.create(b,p.parent,d,p.kind).then(S=>{if(!S.ok){ue(z=>z===null?z:{...z,busy:!1,error:t(`prompt.error.${S.error.code}`)});return}ue(null);let B=S.path;if(P!==void 0&&pe(p.parent,b,P),p.kind==="file"){$.open(B),ne(t("notice.createdFile"),"ok");return}be(z=>new Set(z).add(B)),P!==void 0&&pe(B,b,P),Lt({path:B}),ne(t("notice.createdFolder"),"ok")})},[ne,P,pe,we,m,$,t,L]),el=(0,g.useCallback)(()=>ue(null),[]),nl=(0,g.useMemo)(()=>O===null?[]:Ds({row:O.row,notices:{workspace:L!==void 0},capabilities:ee,absolutePath:O.absolutePath,createParent:O.createParent,remoteLinks:O.row===void 0?void 0:At,bookmarkTarget:O.row===void 0?void 0:{name:O.row.name,path:O.row.path,kind:O.row.kind},inputTarget:Nt()},t),[ee,O,Nt,At,t,L]),vi=(0,g.useMemo)(()=>A===null?[]:Os({panels:Ie.panels,key:A.key,inputTarget:Nt()},t),[Ie.panels,Nt,t,A]),Hr=(0,g.useCallback)(d=>{let p=Wn(xe.current).find(b=>b.path===d);if(Dn(d,p?.kind),p?.kind==="directory"){be(b=>new Set(b).add(d));return}$.open(d)},[Dn,$]),tl=(0,g.useCallback)(()=>{Or.current!==void 0&&Hr(Or.current)},[Hr]),Bt=(0,g.useCallback)(()=>{gi(""),Ft([]),Mt(null),nt(!1),document.querySelector('[data-testid="fs-tree-scroll"]')?.focus({preventScroll:!0})},[]);(0,g.useEffect)(()=>{if(fn===""||typeof document>"u")return;let d=p=>{p.key!=="Escape"||p.isComposing||p.defaultPrevented||un.current!==null||Qt(document)||(p.preventDefault(),p.stopPropagation(),Bt())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[fn,Bt]);let rl=()=>be(new Set),ol=()=>Yn(d=>d+1),il=m===void 0?"no-session":P===void 0?"no-service":ie===void 0||ie.status==="loading"?"loading":ie.status==="failed"?"failed":ie.nodes.length===0?"empty":"tree";return(0,M.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":il,"data-session":m??"","data-testid":"fs-explorer-view",children:[(0,M.jsxs)("header",{className:"fx-head",children:[(0,M.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,M.jsx)(Hn,{open:!0})}),(0,M.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,M.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,M.jsx)($s,{tree:D,t,onOpenFile:Kd,onOpenFolder:zd,onCreateGroup:d=>E({mode:"group",parentId:d}),onRename:d=>E({mode:"rename",node:d}),onRemove:Hd,onMove:d=>T({mode:"move",node:d}),onReorder:Gd}),(0,M.jsxs)("div",{className:"fx-head-meta",children:[ie?.status==="ready"?(0,M.jsxs)("span",{children:[(0,M.jsx)("b",{children:ie.nodes.length})," ",t("head.entries")]}):null,Zn.length===0?null:(0,M.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-toggle-ignored","data-on":Ze?"true":"false","aria-pressed":Ze,title:t(Ze?"head.hideIgnored":"head.showIgnored"),"aria-label":t(Ze?"head.hideIgnored":"head.showIgnored"),onClick:Vd,children:(0,M.jsx)(Tf,{open:Ze})}),(0,M.jsx)("button",{type:"button",className:"fx-btn","data-testid":"fs-search-open","data-open":fn===""?"false":"true",title:t("search.open"),"aria-label":t("search.open"),"aria-pressed":fn!=="",onClick:()=>{fn!==""?Bt():Dd()},children:(0,M.jsx)(ds,{})}),(0,M.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:Ge.size===0,onClick:rl,children:(0,M.jsx)(ls,{})}),(0,M.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:m===void 0||P===void 0||ie?.status==="loading",onClick:ol,children:(0,M.jsx)(ss,{})})]})]}),je===null?null:(0,M.jsx)("div",{className:"fx-notice",role:"status","data-tone":je.tone,"data-testid":"fx-notice",children:je.text}),(0,M.jsx)("div",{className:"fx-main",children:m===void 0?(0,M.jsx)(Mr,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):P===void 0?(0,M.jsx)(Mr,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):ie===void 0||ie.status==="loading"?(0,M.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,M.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):ie.status==="failed"?(0,M.jsx)(Mr,{title:t("state.failed.title"),description:ie.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>ki(""),testId:"fs-failed"}):ie.nodes.length===0?(0,M.jsx)(Mr,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)("div",{className:"fx-tree-pane",style:$e===null?void 0:{"--fx-tree-width":`${$e}px`},children:[(0,M.jsx)(cd,{t,value:fn,origin:hi,count:yi.length,busy:Id,onChange:gi,onStep:d=>Qn(void 0,d,!1),onActivate:tl,onClose:Bt,focusSignal:Ad}),(0,M.jsx)(cs,{rows:Od,selectedPath:Xn===void 0?bn:void 0,entryFocus:zr?void 0:jd,t,onToggle:$d,onSelect:d=>zr?Hr(d):$.open(d),onRetry:ki,onEntryFocusSettled:_d,onContextMenu:qd,cursorRequest:Td,onCursorMove:d=>{Or.current=d}})]}),(0,M.jsx)("div",{ref:Br,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":$e??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:Md,onPointerMove:Ld,onPointerUp:Wr,onPointerCancel:Wr,onLostPointerCapture:Wr,onKeyDown:Nd,onDoubleClick:$r}),(0,M.jsxs)("div",{className:"fx-editor",children:[(0,M.jsx)(Ra,{panels:Ie.panels,active:Ie.active,t,onActivate:d=>$.activate(d),onClose:vn,onStep:d=>d===1?$.next():$.previous(),onTabMenu:Xd,documents:l,sessionId:m}),fe===null?null:(0,M.jsx)(Pa,{name:or(fe.path),t,saving:cn,error:Re,onSave:Pd,onDiscard:Cd,onCancel:Dr}),(0,M.jsx)("div",{className:"fx-editor-body",children:Ie.panels.length===0?(0,M.jsx)(Ca,{t}):Ie.panels.map((d,p)=>{let b=d.key===Ie.active;return(0,M.jsx)("div",{className:"fx-panel",id:`fx-panel-${p}`,role:"tabpanel","aria-labelledby":`fx-tab-${p}`,hidden:!b,"data-line":d.line,"data-testid":"fs-panel",children:(0,M.jsx)(Ts,{sessionId:m,files:P,path:d.path,revision:d.revision,git:Y,t,visible:b,renderers:a,documents:l,locate:I,onOpenPeer:Fd})},d.key)})})]})]})}),O===null?null:(0,M.jsx)(Yo,{entries:nl,anchor:O.anchor,onSelect:Zd,onClose:Ud,...O.trigger===void 0?{}:{returnFocus:()=>O.trigger??null}}),A===null||vi.length===0?null:(0,M.jsx)(Yo,{entries:vi,anchor:A.anchor,onSelect:Jd,onClose:Yd,returnFocus:()=>A.trigger}),we===null?null:(0,M.jsx)(kt,{kind:we.kind,parent:we.parent,t,error:we.error,busy:we.busy,onSubmit:Qd,onCancel:el}),C===null?null:(0,M.jsx)(nd,{tree:D,target:C.mode==="add"?C.target:void 0,t,mode:C.mode,...C.mode==="move"?{node:C.node}:{},onCommit:d=>{let p=C.mode;wn(d),T(null),ne(t(p==="move"?"bookmarks.moved":"bookmarks.added"),"ok")},onClose:()=>T(null)}),v===null?null:(0,M.jsx)(kt,{kind:"directory",parent:"",t,initialName:v.mode==="rename"?v.node.name:t("bookmarks.newGroup"),titleKey:v.mode==="rename"?"bookmarks.rename":"bookmarks.newGroup",onSubmit:d=>{let p=v;E(null);try{if(p.mode==="rename"){wn(Js(D,p.node.id,d)),ne(t("bookmarks.renamed"),"ok");return}let b=yt("group",{id:Ef(),name:d,createdAt:Date.now()});wn(bt(D,p.parentId,b)),ne(t("bookmarks.groupCreated"),"ok")}catch{ne(t("bookmarks.saveFailed"),"error")}},onCancel:()=>E(null)}),ie?.status==="ready"?(0,M.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,M.jsxs)("span",{children:[t("view.scope")," ",(0,M.jsx)("b",{children:ie.nodes.length})," ",t("head.entries")]}),ie.truncated?(0,M.jsx)("span",{className:"fx-foot-warn",children:dt({entries:ie.nodes,truncated:!0,total:ie.total}).label}):null,(0,M.jsxs)("span",{className:"fx-foot-git","data-state":tt===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,M.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":Wd,"aria-hidden":"true"}),tt===void 0?t("status.unavailable"):tt===0?t("status.clean"):t("status.summary").replace("{count}",String(tt))]}),bi===null?null:(0,M.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[bi,Ne?.upstream!==void 0&&(Ne.ahead??0)>0?(0,M.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(Ne.ahead)}`}):null,Ne?.upstream!==void 0&&(Ne.behind??0)>0?(0,M.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(Ne.behind)}`}):null]}),(0,M.jsx)("span",{className:"fx-spacer"}),(0,M.jsx)("span",{children:t("foot.order")})]}):null]})}return R}var bd=["slots","locale","workbench","remote"];function Df(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Lr,Nr,si,Ir,di,kd;function xd(e){return di=e,Ir!==void 0||(Ir=ua({open:(n,t,r)=>{let o=di;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):la(o)(n,t,r)},save:(n,t)=>{let r=di;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):ca(r)(n,t)}})),Ir}function Of(){if(si!==void 0)return si;let e=vr({warn:n=>kd?.(n)});for(let n of wr())e.register(n);return si=e,e}var Ar;function vd(e){return n=>{let t=e.get?.("sessions"),r=e.get?.("conversation");if(t?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=t.scope(n);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,a=o.focus,l=o.notify;return{...typeof i=="function"?{insertReference:(u,s)=>i.call(o,u,s)}:{},...typeof a=="function"?{focus:()=>a.call(o)}:{},...typeof l=="function"?{notify:(u,s)=>l.call(o,u,s)}:{}}}}function wd(e){let n=e.workbench;if(n==null)return()=>{};kd=y=>e.logger?.warn?.(y);let t=Of(),r={version:ws,renderers:t,registerRenderer:y=>t.register(y),documents:xd(e)};Nr?.();let o=e.provide?.(_o,r);o===void 0&&e.logger?.warn?.(`${at}: ctx.provide unavailable, ${_o} service not registered`),Nr=o,Lr?.();let i=e.locale.register(at,{zh:{...io,...xo.zh,...Ko.zh},en:{...ao,...xo.en,...Ko.en}});Lr=i;let a=e.locale.bind(at),l=Fs(typeof document>"u"?void 0:document),u=ia(e),s=As(e,()=>Is(e.workbench)),c=hd({workbench:n,version:n.version,t:a,files:gs(e),status:ks(e),git:xs(e),renderers:t,documents:xd(e),locate:y=>da(e,y),workspace:()=>ud(e),fileReferences:ya(e),reference:vd(e),referenceSourceAvailable:()=>s.available});Ar?.();let f=oo(e,n);return Ar=f,e.slots.inject(Vr,()=>e.slots.register({name:Vr,id:te,order:100,label:()=>so(Df(e)),locale:at},c)),()=>{o?.(),Nr===o&&(Nr=void 0),f(),Ar===f&&(Ar=void 0),s.dispose(),l(),u(),i(),Lr===i&&(Lr=void 0)}}var Sd={createBuiltinRenderers:wr,buildTree:On,describeListing:dt,iconFor:pn,computeTreeWindow:Ht,flattenTree:Vt,badgeFor:mn,formatSize:qt,joinPath:Ae,listingPath:jn,parseFocus:Gt,consumeViewRequest:ir,createPanelStack:ho,createEscapeHandler:er,KEYMAP:Zt,tabLabel:so,indexIgnoredPaths:Ot,isIgnoredPath:jt,normalizeListing:En,normalizeStatusSnapshot:kr,buildWorkspaceMap:zt,workspaceTagFor:Kt,parseStatusZ:_t,statusTone:st,statusBadge:Wt,createPreviewLoader:ur,renderMarkdown:ar,languageFor:dr,isMarkdownFile:pt,describePage:fr,classifyPreviewFailure:rn,normalizePreviewPage:Kn,previewChunkRoute:za,canBridgeFile:Ut,decideBridge:to,focusForFileAddress:no,forwardFocus:ro,registerAddressBridge:oo},Rd={name:"dsh-fs-explorer",inject:bd,apply:wd,__test:Sd};function jf(e){Va(e),$a(e)}var _f=Rd;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
