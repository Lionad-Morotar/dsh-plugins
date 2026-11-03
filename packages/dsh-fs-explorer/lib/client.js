window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var lt=Object.defineProperty;var vi=Object.getOwnPropertyDescriptor;var bi=Object.getOwnPropertyNames;var wi=Object.prototype.hasOwnProperty;var ki=(e,n)=>{for(var t in n)lt(e,t,{get:n[t],enumerable:!0})},Si=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of bi(n))!wi.call(e,o)&&o!==t&&lt(e,o,{get:()=>n[o],enumerable:!(r=vi(n,o))||r.enumerable});return e};var Ri=e=>Si(lt({},"__esModule",{value:!0}),e);var Ls={};ki(Ls,{__test:()=>Jo,apply:()=>Zo,boot:()=>Ms,clientPlugin:()=>Qo,default:()=>Ns,inject:()=>Xo});module.exports=Ri(Ls);var qe=require("react");var cr="dsh-resource://file/";function fr(e){try{return decodeURIComponent(e)}catch{return e}}function en(e){if(!e.startsWith(cr))return null;let n=e.slice(cr.length);if(!n.startsWith("session/"))return null;let t=n.slice(8),r=t.indexOf("/");if(r<=0)return null;let o=fr(t.slice(0,r)),i=t.slice(r+1),a=i.search(/[?#]/u),l=a<0?i:i.slice(0,a);return l.length===0?null:{sessionId:o,path:l.split("/").map(fr).join("/")}}function Te(e){return e.slice(e.lastIndexOf("/")+1)}var pr=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function mr(){return pr.flatMap(e=>[...e.extensions])}function nn(e){let n=e.slice(e.lastIndexOf("/")+1),t=n.lastIndexOf(".");if(t<=0)return null;let r=n.slice(t+1).toLowerCase();return pr.find(o=>o.extensions.includes(r))?.family??null}var ge="dsh-fs-explorer",ut="conversation.view",Q="fs-explorer";var tn="fs-explorer",yr="fsExplorerDocuments",gr="fsExplorerWorkspace",xr="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",ct={chunk:"client.preview.js"},yn={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var Ci={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Pi={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},Ei=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function vr(e){return typeof e=="string"&&Ei.has(e)}function hr(e,n){let t=[],r=0;for(let o=0;o<n;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;t.push(e.slice(r,i)),r=i+1}return{fields:t,rest:e.slice(r)}}function Ti(e,n){return e==="D"||n==="D"?"deleted":e==="A"||n==="A"?"added":e==="R"||n==="R"||e==="C"||n==="C"?"renamed":e==="U"||n==="U"?"conflicted":"modified"}function gn(e){let n={};if(typeof e!="string"||e==="")return n;let t=e.split("\0");for(let r=0;r<t.length;r+=1){let o=t[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let a=o.slice(2);a!==""&&(n[a]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let a=hr(o.slice(2),i==="1"?7:8);if(a===null)continue;let l=a.fields[0]??"",u=a.rest;if(u===""||l.length<2)continue;if(i==="2"){let d=t[r+1];if(d===void 0||d==="")continue;r+=1,n[u]={status:"renamed"};continue}n[u]={status:Ti(l[0]??".",l[1]??".")};continue}if(i==="u"){let a=hr(o.slice(2),9);if(a===null)continue;let l=a.rest;if(l==="")continue;n[l]={status:"conflicted"}}}}return n}function rn(e){return vr(e)?Ci[e]:"neutral"}function xn(e){return vr(e)?Pi[e]:"?"}function ft(e){return`status.${e}`}function br(e,n){if(n===void 0||e==="")return;let t=n[e];return t!==void 0?t.status:n[`${e.replace(/\/+$/u,"")}/`]?.status}function wr(e){let{additions:n,deletions:t}=e;if(!(n===void 0||t===void 0))return n===null||t===null?{binary:!0}:{additions:n,deletions:t}}function kr(e){return e===void 0?null:e.detached&&e.hash!==null?e.hash.slice(0,7):e.branch}function Sr(e,n){let t={...e};if(n===void 0)return t;for(let r of n){let o=t[r.path];o!==void 0&&(t[r.path]={...o,additions:r.additions,deletions:r.deletions})}return t}var Fi=["conflicted","deleted","renamed","added","modified","untracked"];function Mi(e){return rn(Fi.find(n=>e.has(n))??"modified")}function Rr(e){let n=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let a=i.split("/"),l=r.endsWith("/")?a.length:a.length-1,u="";for(let d=0;d<l;d+=1){let s=a[d];if(s===void 0||s==="")continue;u=u===""?s:`${u}/${s}`;let f=n.get(u);f===void 0?n.set(u,{count:1,present:new Set([o.status])}):(f.count+=1,f.present.add(o.status))}}let t=new Map;for(let[r,o]of n)t.set(r,{count:o.count,tone:Mi(o.present)});return t}var Er=[".gitmodules","pnpm-workspace.yaml","package.json","turbo.json","lerna.json"],Tr=/^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;function Ni(e){return Tr.test(e)?e.slice(0,e.indexOf("/")):null}function Li(e){let n=e.indexOf(" #"),t=(n>=0?e.slice(0,n):e).trim();if(t.length>=2){let r=t[0],o=t.at(-1);if(r==="'"&&o==="'"||r==='"'&&o==='"')return t.slice(1,-1)}return t}function Ii(e){let n=e.split(/\r?\n/u),t=[],r=0;for(;r<n.length&&!/^packages\s*:/u.test(n[r]??"");)r+=1;if(r===n.length)return t;for(r+=1;r<n.length;r+=1){let o=n[r]??"";if(o.trim()==="")continue;if(!/^\s/u.test(o))break;let i=/^(\s*)-\s+(.*)$/u.exec(o);if(i===null)continue;let a=Li(i[2]??"");a!==""&&Tr.test(a)&&t.push(a)}return t}function Di(e){let n=[],t,r=!1,o=()=>{r&&t!==void 0&&t!==""&&n.push(t),t=void 0};for(let i of e.split(/\r?\n/u)){let a=i.trim();if(a===""||a.startsWith("#")||a.startsWith(";"))continue;let l=/^\[(.+)\]$/u.exec(a);if(l!==null){o(),r=/^submodule(\s|$)/u.test(l[1]??"");continue}if(!r)continue;let u=/^path\s*=\s*(.*)$/u.exec(a);u!==null&&(t=(u[1]??"").trim().replace(/^\.\/+/u,"").replace(/\/+$/u,""))}return o(),[...new Set(n)]}function Cr(e){try{let n=JSON.parse(e);return n===null||typeof n!="object"||Array.isArray(n)?void 0:n}catch{return}}function Pr(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function hn(e,n){let t=new Map,r=e.get(".gitmodules");if(typeof r=="string")for(let l of Di(r))t.set(l,"submodule");let o=new Set,i=e.get("pnpm-workspace.yaml");if(typeof i=="string")for(let l of Ii(i))o.add(l);let a=e.get("package.json");if(typeof a=="string"){let l=Cr(a);if(l!==void 0){let u=l.workspaces,d=u!==null&&typeof u=="object"&&!Array.isArray(u)?u.packages:void 0;for(let s of Pr(Array.isArray(u)?u:d))o.add(s)}}for(let l of["turbo.json","lerna.json"]){let u=e.get(l);if(typeof u!="string")continue;let d=Cr(u);if(d!==void 0)for(let s of Pr(d.packages))o.add(s)}for(let l of o){let u=Ni(l);u!==null&&n.has(u)&&t.set(l,"package")}return t}function vn(e,n){if(e===void 0||n==="")return;let t=e.get(n);if(t!==void 0)return t;let r=n.lastIndexOf("/");if(r>0&&e.get(`${n.slice(0,r)}/*`)==="package")return"package";for(let o=n.indexOf("/");o>0;o=n.indexOf("/",o+1))if(e.get(`${n.slice(0,o)}/**`)==="package")return"package"}var Ai=new Set(["node_modules",".git","dist","__pycache__"]);function Wi(e){return Ai.has(e)}function Oi(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function bn(e){let n=[];for(let t of e){let r=typeof t?.name=="string"?t.name:"";if(r===""||Wi(r))continue;let o=Oi(t),i=typeof t.size=="number"&&Number.isFinite(t.size)?t.size:void 0;n.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return n.sort((t,r)=>t.kind!==r.kind?t.kind==="directory"?-1:1:t.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),n}var ji=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),zi=new Set(["md","mdx","markdown","mdown","rst","adoc"]),_i=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),Bi=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Ki=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),Hi=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),$i=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function Fr(e){let n=Te(e.toLowerCase()),t=n.lastIndexOf(".");return t<=0?"":n.slice(t+1)}function Ge(e,n="file"){if(n==="directory")return"folder";let t=Te(e.toLowerCase());if($i.has(t)||t.startsWith(".env"))return"config";if(t==="readme"||t==="changelog"||t==="license")return"markdown";let r=Fr(t);return r===""?"file":ji.has(r)?"code":zi.has(r)?"markdown":_i.has(r)?"data":Bi.has(r)?"image":Ki.has(r)?"style":Hi.has(r)?"archive":"file"}var Gi={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Vi={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function Ve(e){let n=Te(e.toLowerCase()),t=Gi[n];if(t!==void 0)return t;let r=Fr(n),o=Vi[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(n.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function on(e){let n=Array.isArray(e.entries)?e.entries.length:0,t=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>n?Math.trunc(e.total):n;return t?{truncated:!0,label:`${xr} ${String(n)} \u9879`,total:r}:{truncated:!1,label:`${String(n)} \u9879`,total:r}}function wn(e,n){let t=Math.max(1,n.rowHeight||1),r=Math.max(0,n.height||0),o=Math.max(0,Math.trunc(n.overscan??6)),i=Math.max(1,Math.ceil(r/t)),a=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,n.scrollTop)/t)-o,u=Math.min(Math.max(l,0),a),d=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function mt(e){let n=Math.max(1,e.rowHeight||1),t=Math.max(0,e.viewport||0),r=Math.max(0,e.scrollTop),o=Math.max(0,e.index)*n;return o<r?o:o+n>r+t?o+n-t:r}function kn(e){return e===""?".":e}function Sn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Rn(e,n){let t=e.replace(/\/+$/u,"");return t===""?n:`${t}/${n}`}function Mr(e){let n=e.replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").split("/").filter(Boolean),t=[],r="";for(let o of n.slice(0,-1))r=Rn(r,o),t.push(r);return t}function pt(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Cn(e){if(typeof e!="string")return;let n=e.trim(),t=/^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(n);if(t!==null){let l=pt(t[2]),u=(t[3]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"").replace(/^\/+/u,"");return u===""||l<1?void 0:{path:u,line:l,absolute:!1,revision:(t[1]??"").toLowerCase()}}let r=/^abs:(.+?)(?::(\d+))?$/u.exec(n);if(r!==null){let l=(r[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return l===""?void 0:{path:l,line:pt(r[2]),absolute:!0}}let o=/^path:(.+?)(?::(\d+))?$/u.exec(n);if(o===null)return;let a=(o[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(a!=="")return{path:a,line:pt(o[2]),absolute:!1}}function Nr(e){return e.selectionMoved?!0:e.cursorPath===void 0}function Lr(e,n){let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];if(!(r?.type!=="entry"||!r.expanded))for(let o=t+1;o<e.length;o+=1){let i=e[o];if(i?.type==="entry"){if(i.depth<=r.depth)return;if(i.depth===r.depth+1)return o}}}function Pn(e,n,t,r){let o=[],i=Rr(t),a=(l,u)=>{let d=e.get(l);if(!(d===void 0||d.status!=="ready"))for(let s of d.nodes){let f=Rn(l,s.name),y=s.kind==="directory",p=y&&n.has(f),v=y||t===void 0?void 0:t[f],h=v?.status??(y?void 0:br(f,t)),N=v===void 0?void 0:wr(v),T=y?i.get(f):void 0,A=y?vn(r,f):void 0;if(o.push({type:"entry",path:f,name:s.name,kind:s.kind,depth:u,expanded:p,...s.size===void 0?{}:{size:s.size},...h===void 0?{}:{status:h},...T===void 0?{}:{statusCount:T.count,statusTone:T.tone},...N===void 0?{}:{diff:N},...A===void 0?{}:{tag:A}}),!p)continue;let L=e.get(f);if(L===void 0||L.status==="loading"){o.push({type:"status",key:`${f}:loading`,path:f,depth:u+1,state:"loading"});continue}if(L.status==="failed"){o.push({type:"status",key:`${f}:failed`,path:f,depth:u+1,state:"failed",message:L.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(L.nodes.length===0){o.push({type:"status",key:`${f}:empty`,path:f,depth:u+1,state:"empty"});continue}a(f,u+1),L.truncated&&o.push({type:"status",key:`${f}:truncated`,path:f,depth:u+1,state:"truncated",label:on({entries:L.nodes,truncated:!0,total:L.total}).label})}};return a("",0),o}var qi=new Set(["readme","readme.md","readme.markdown","readme.mdx","readme.txt"]);function Ui(e){let n=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return(n<0?e:e.slice(n+1)).toLowerCase()}function Xi(e){return e.find(n=>n.type==="entry"&&n.depth===0&&n.kind==="file"&&qi.has(Ui(n.path)))}function Ir(e){if(e.hasModal)return{kind:"skip",reason:"modal"};if(e.rows.length===0)return{kind:"skip",reason:"no-rows"};if(e.panelCount>0)return{kind:"tree",open:void 0,focus:void 0};let n=Xi(e.rows);return n===void 0?{kind:"tree",open:void 0,focus:void 0}:{kind:"tree",open:n.path,focus:n.path}}function En(e){if(!Number.isFinite(e)||e<0)return"";let n=["B","KB","MB","GB","TB"],t=e,r=0;for(;t>=1024&&r<n.length-1;)t/=1024,r+=1;let o=r===0||t>=10?0:1;return`${t.toFixed(o)} ${n[r]??"B"}`}var yt="dsh-fs-explorer:bridge",Yi="fs-explorer-bridge",Or="dsh-resource://file/**",gt="sidebar.right.pane.tab",Zi=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Ji=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Qi=new Set(["makefile","dockerfile","license","readme","changelog"]),ea=new Set([...mr(),...Zi]);function na(e){let n=e.lastIndexOf(".");return n<0?"":e.slice(n+1).toLowerCase()}function Tn(e){if(typeof e!="string"||e==="")return!1;let n=Te(e).toLowerCase();if(n==="")return!1;let t=na(n);return Ji.has(t)?!1:Qi.has(n)?!0:ea.has(t)}function ta(e){let n=e.search(/[?#]/u);if(n<0)return;let t=/[?&#]line=(\d+)/u.exec(e.slice(n));if(t!==null)return Math.max(1,Number.parseInt(t[1]??"",10))}function ra(e,n){for(let t of[e,n])if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);return 1}function vt(e,n){if(typeof e!="string")return;let t=en(e);if(t===null)return;let r=t.path.replace(/\\/gu,"/");if(r==="")return;let o=ra(n,ta(e));return`${Sn(r)?"abs:":"path:"}${r}:${String(o)}`}function bt(e,n,t){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=en(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(n===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==n)return{action:"keep",reason:"other-session"};if(!Tn(r.path))return{action:"keep",reason:"refused"};let o=vt(e,t);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function Fe(e,n){n===void 0?console.warn(`[${ge}] ${e}`):console.warn(`[${ge}] ${e}`,n)}function oa(e){console.debug(`[${ge}] ${e}`)}function xt(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function ht(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ze(e,n){try{let t=e();return n(t)?t:void 0}catch{return}}function Dr(e){return ze(()=>e.sidebarRightTabs,xt)??ze(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,xt)}function Ar(e){return ze(()=>e.sidebarRight,ht)??ze(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,ht)}function Wr(e){return typeof e=="function"?e:()=>{}}var ia="dsh-resource://file/session/probe/src/main.ts";function aa(e){let n=ze(()=>(typeof e.candidates=="function"?e.candidates(ia):[]).filter(r=>r.priority==="extension"&&r.id!==yt),t=>Array.isArray(t)&&t.length>0);n!==void 0&&Fe(`another extension-band tab type already claims ${Or}: ${n.map(t=>String(t.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function sa(e){for(let n of[e?.contentId,e?.record?.contentId,e?.address])if(typeof n=="string"&&n!=="")return n}function da(e){let n=e?.navigation?.params?.line;if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);if(typeof n=="string"&&/^\d+$/u.test(n))return Math.max(1,Number.parseInt(n,10))}function la(e,n){let t=e.viewFocus;if(t?.request?.(Q,n),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(Q,n);return(!r.opened||r.focused)&&t?.take(Q),r}return typeof e.openView=="function"&&e.openView(Q,n)?(t?.take(Q),{opened:!0,focused:!0}):(t?.take(Q),{opened:!1,focused:!1})}function wt(e,n,t,r){let o;try{o=la(e,r)}catch(i){return Fe("the file workbench threw while switching views",i),e.viewFocus?.take(Q),!1}if(!o.opened)return Fe(`the file workbench did not switch to ${Q}; the tab stays as the reader's only route to the file`),!1;try{return n.close(t),!0}catch(i){return Fe("the forwarded tab could not be closed",i),!1}}function ua(e,n){function t({useTabInfo:r}){let i=r()?.tab,a=typeof i?.id=="string"&&i.id!==""?i.id:void 0,l=sa(i),u=da(i),d=(0,qe.useRef)(void 0);return(0,qe.useEffect)(()=>{if(a===void 0){Fe("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===a)return;d.current=a;let s=bt(l,e.currentSessionId(),u);if(s.action!=="open"){Fe(`left the forwarded tab standing (${s.reason})`,l);return}wt(e,n,a,s.focus)},[a,l,u]),null}return function(o){return typeof o.useTabInfo!="function"?(Fe(`the host did not inject useTabInfo into ${gt}; the bridge cannot forward`),null):(0,qe.createElement)(t,{useTabInfo:o.useTabInfo})}}function kt(e,n){let t=(l,u)=>{if(l===void 0||u===void 0)return;aa(l);let d;try{d=l.register({id:yt,kind:Yi,patterns:[Or],priority:"extension",canOpen:y=>{let p=en(y);return p!==null&&Tn(p.path)},title:y=>Te(en(y)?.path??y)||y})}catch(y){Fe("the sidebar right refused the address bridge tab type",y);return}let s=ua(n,u),f;try{f=Wr(e.slots.inject(gt,()=>e.slots.register({name:gt,key:yt},s)))}catch(y){d(),Fe("the sidebar right refused the address bridge body",y);return}return()=>{f(),d()}},r=Dr(e),o=Ar(e);if(r!==void 0&&o!==void 0)return t(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return oa("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let a=i.call(e,["sidebarRightTabs","sidebarRight"],l=>{let u=ze(()=>l.get?.("sidebarRightTabs"),xt)??Dr(l),d=ze(()=>l.get?.("sidebarRight"),ht)??Ar(l);return t(u,d)});return Wr(a)}var St={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","foot.branch":"\u5F53\u524D\u5206\u652F","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u6587\u4EF6\u6811\u5217\u5BBD","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","row.binary":"bin","tag.submodule":"git submodule\uFF08\u8BC6\u522B\u81EA .gitmodules\uFF09","tag.package":"workspace \u5B50\u5305\uFF08\u8BC6\u522B\u81EA\u5DE5\u4F5C\u533A\u6E05\u5355\uFF09","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.commitBinary.title":"\u63D0\u4EA4\u7248\u672C\u7684\u4E8C\u8FDB\u5236\u9884\u89C8\u6682\u4E0D\u652F\u6301","preview.commitBinary.description":"\u5F53\u524D\u9762\u677F\u53EA\u80FD\u663E\u793A\u8BE5\u63D0\u4EA4\u7248\u672C\u7684\u6587\u672C\u6587\u4EF6\u3002","preview.submodule.title":"\u5B50\u6A21\u5757\u4E0D\u53EF\u9884\u89C8","preview.submodule.description":"\u8FD9\u4E2A\u8DEF\u5F84\u6307\u5411\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u4E0D\u5305\u542B\u53EF\u9884\u89C8\u7684\u6587\u4EF6\u5185\u5BB9\u3002","preview.deletedCommit":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.commitUnavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 Git \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u63D0\u4EA4\u7248\u672C\u7684\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}","menu.reveal.finder":"\u5728 Finder \u4E2D\u663E\u793A","menu.reveal.explorer":"\u5728\u8D44\u6E90\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.directory":"\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A","menu.reveal.reason":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","menu.manager.finder":"Finder","menu.manager.explorer":"\u8D44\u6E90\u7BA1\u7406\u5668","menu.manager.directory":"\u6587\u4EF6\u7BA1\u7406\u5668","menu.copy":"\u590D\u5236\u8DEF\u5F84","menu.copy.absolute":"\u7EDD\u5BF9\u8DEF\u5F84","menu.copy.absolute.reason":"\u8FD8\u6CA1\u6709\u62FF\u5230\u8FD9\u4E2A\u8DEF\u5F84\u7684\u7EDD\u5BF9\u5730\u5740","menu.copy.relative":"\u76F8\u5BF9\u8DEF\u5F84\uFF08\u5DE5\u4F5C\u533A\uFF09","menu.blank":"\u8FD9\u91CC\u6CA1\u6709\u53EF\u64CD\u4F5C\u7684\u6587\u4EF6","menu.blank.reason":"\u5728\u6587\u4EF6\u6216\u76EE\u5F55\u4E0A\u53F3\u952E","notice.copiedAbsolute":"\u5DF2\u590D\u5236\u7EDD\u5BF9\u8DEF\u5F84","notice.copiedRelative":"\u5DF2\u590D\u5236\u76F8\u5BF9\u8DEF\u5F84","notice.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u526A\u8D34\u677F\u4E0D\u53EF\u7528","notice.revealed":"\u5DF2\u5728 {manager} \u4E2D\u663E\u793A","notice.revealFailed":"\u65E0\u6CD5\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\uFF1A{reason}","notice.reveal.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","notice.reveal.outside-workspace":"\u8FD9\u4E2A\u8DEF\u5F84\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","notice.reveal.not-found":"\u8FD9\u4E2A\u8DEF\u5F84\u5DF2\u7ECF\u4E0D\u5B58\u5728","notice.reveal.unsupported":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u53EF\u7528\u7684\u6587\u4EF6\u7BA1\u7406\u5668","notice.reveal.permission":"\u6CA1\u6709\u6743\u9650\u8BBF\u95EE\u8FD9\u4E2A\u8DEF\u5F84","notice.reveal.io-error":"\u8C03\u7528\u6587\u4EF6\u7BA1\u7406\u5668\u5931\u8D25","menu.create.file":"\u65B0\u5EFA\u6587\u4EF6","menu.create.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","menu.create.reason":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u5199\u5165\u5DE5\u4F5C\u533A","prompt.title.file":"\u65B0\u5EFA\u6587\u4EF6","prompt.title.folder":"\u65B0\u5EFA\u6587\u4EF6\u5939","prompt.input":"\u540D\u79F0","prompt.root":"\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55","prompt.submit":"\u521B\u5EFA","prompt.cancel":"\u53D6\u6D88","prompt.error.empty":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","prompt.error.dot":"\u540D\u79F0\u4E0D\u80FD\u662F . \u6216 ..","prompt.error.separator":"\u540D\u79F0\u4E0D\u80FD\u5305\u542B / \u6216 \\","prompt.error.too-long":"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 200 \u4E2A\u5B57\u7B26","prompt.error.exists":"\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728","prompt.error.invalid-name":"\u8FD9\u4E2A\u540D\u79F0\u4E0D\u53EF\u7528","prompt.error.not-directory":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u662F\u6587\u4EF6\u5939","prompt.error.not-found":"\u76EE\u6807\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728","prompt.error.permission":"\u6CA1\u6709\u5199\u5165\u6743\u9650","prompt.error.outside-workspace":"\u76EE\u6807\u4F4D\u7F6E\u4E0D\u5728\u5DE5\u4F5C\u533A\u5185","prompt.error.no-workspace":"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A\u76EE\u5F55","prompt.error.unsupported":"\u5F53\u524D\u90E8\u7F72\u65E0\u6CD5\u521B\u5EFA\u6761\u76EE","prompt.error.io-error":"\u521B\u5EFA\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","notice.createdFile":"\u5DF2\u65B0\u5EFA\u6587\u4EF6","notice.createdFolder":"\u5DF2\u65B0\u5EFA\u6587\u4EF6\u5939"},Rt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","foot.branch":"Current branch","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","pane.resize":"Drag or use arrow keys to resize the file tree column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","row.binary":"bin","tag.submodule":"git submodule (from .gitmodules)","tag.package":"workspace package (from workspace manifests)","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.commitBinary.title":"Binary commit versions are not previewable yet","preview.commitBinary.description":"This panel can show the text files of a commit version for now.","preview.submodule.title":"Submodule cannot be previewed","preview.submodule.description":"This path names a submodule and holds no previewable file content.","preview.deletedCommit":"This commit deleted the file; showing the first parent","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.commitUnavailable.description":"This deployment's Git service exposes no way to read a commit version.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers","menu.reveal.finder":"Reveal in Finder","menu.reveal.explorer":"Reveal in Explorer","menu.reveal.directory":"Reveal in file manager","menu.reveal.reason":"This deployment has no file manager available","menu.manager.finder":"Finder","menu.manager.explorer":"Explorer","menu.manager.directory":"the file manager","menu.copy":"Copy path","menu.copy.absolute":"Absolute path","menu.copy.absolute.reason":"The absolute path for this entry is not known yet","menu.copy.relative":"Relative path (workspace)","menu.blank":"Nothing to act on here","menu.blank.reason":"Right-click a file or a directory","notice.copiedAbsolute":"Copied the absolute path","notice.copiedRelative":"Copied the relative path","notice.copyFailed":"Copy failed: the clipboard is unavailable","notice.revealed":"Revealed in {manager}","notice.revealFailed":"Could not reveal in the file manager: {reason}","notice.reveal.no-workspace":"This session has no workspace directory","notice.reveal.outside-workspace":"That path is outside the workspace","notice.reveal.not-found":"That path no longer exists","notice.reveal.unsupported":"This deployment has no file manager available","notice.reveal.permission":"No permission to reach that path","notice.reveal.io-error":"The file manager call failed","menu.create.file":"New file","menu.create.folder":"New folder","menu.create.reason":"This deployment cannot write to the workspace","prompt.title.file":"New file","prompt.title.folder":"New folder","prompt.input":"Name","prompt.root":"Workspace root","prompt.submit":"Create","prompt.cancel":"Cancel","prompt.error.empty":"The name cannot be empty","prompt.error.dot":"The name cannot be . or ..","prompt.error.separator":"The name cannot contain / or \\","prompt.error.too-long":"The name cannot be longer than 200 characters","prompt.error.exists":"A file or folder with that name already exists","prompt.error.invalid-name":"That name cannot be used","prompt.error.not-directory":"The target is not a folder","prompt.error.not-found":"The target folder no longer exists","prompt.error.permission":"No permission to write there","prompt.error.outside-workspace":"The target is outside the workspace","prompt.error.no-workspace":"This session has no workspace directory","prompt.error.unsupported":"This deployment cannot create entries","prompt.error.io-error":"Creating it failed; try again","notice.createdFile":"Created the file","notice.createdFolder":"Created the folder"};function Ct(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?St:Rt)["tab.label"]??"Files"}var ca=Object.freeze({status:"idle",text:"",savedText:"",version:null,dirty:!1,saving:!1,conflict:!1,discarded:null,error:null});function ee(e){return e!==null&&typeof e=="object"}function Mn(e,n){return{ok:!1,code:e,message:n}}function Nn(e){let n=ee(e)?e:{},t=typeof n.code=="string"&&n.code!==""?n.code:"io-error",r=typeof n.message=="string"?n.message:"";return Mn(t,r)}function Pt(){return Mn("invalid-response","the document service answered an invalid response")}function Fn(e){try{return e()}catch{return}}function fa(e){let n=ee(e)?e:void 0;if(n===void 0)return Pt();if(n.ok===!1)return Nn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0)return Pt();if(r.ok===!1)return Nn(r.error);let o=ee(r.document)?r.document:typeof r.text=="string"?r:void 0;return o===void 0||typeof o.text!="string"?Pt():{ok:!0,text:o.text,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function pa(e){let n=ee(e)?e:void 0;if(n===void 0)return jr();if(n.ok===!1)return Nn(n.error);let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0)return jr();if(r.ok===!1)return Nn(r.error);let o=ee(r.document)?r.document:r;return{ok:!0,...typeof o.version=="string"?{version:o.version}:{},...typeof o.bytes=="number"?{bytes:o.bytes}:{}}}function jr(){return{ok:!1,code:"invalid-response",message:"the document service answered an invalid save response"}}function Et(e){return ee(e)&&typeof e.open=="function"}function ma(e){let n=Fn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ee(n)?n.rpc:void 0;if(!(!ee(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${yr}/${r}`,o,i)}function ya(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{open:n("open"),save:n("save"),locate:n("locate")}}function ga(e){let n=ee(e)?e:void 0;if(n===void 0||n.ok===!1)return;let t=n.ok===!0&&"value"in n?n.value:e,r=ee(t)?t:void 0;if(r===void 0||r.ok===!1)return;let o=ee(r.located)?r.located:void 0;if(!(o===void 0||o.symlink===!1))return typeof o.absolutePath=="string"&&o.absolutePath!==""?{absolutePath:o.absolutePath}:void 0}function zr(e,n){let t=Ft(e);return async(r,o)=>{let i=t(),a=i?.locate;if(typeof a=="function")try{return ga(await a.call(i,{sessionId:n,path:r},o))}catch{return}}}function Ft(e){return()=>{let n=Fn(()=>e.fsExplorerDocuments);if(Et(n))return n;let t=Fn(()=>ee(e.remote)?e.remote.fsExplorerDocuments:void 0);if(Et(t))return t;let r=Fn(()=>typeof e.get=="function"?e.get("remote.fsExplorerDocuments"):void 0);if(Et(r))return r;let o=ma(e);if(o!==void 0)return ya(o)}}function _r(e){let n=Ft(e);return async(t,r,o)=>{let i=n();if(i===void 0)return Mn("unavailable","the document service is unavailable");try{return fa(await i.open({sessionId:t,path:r},o))}catch(a){return Mn("io-error",a instanceof Error?a.message:String(a))}}}function Br(e){let n=Ft(e);return async(t,r)=>{let o=n(),i=o?.save;if(o===void 0||typeof i!="function")return{ok:!1,code:"unavailable",message:"the document service cannot save"};try{return pa(await i.call(o,t,r))}catch(a){return{ok:!1,code:"io-error",message:a instanceof Error?a.message:String(a)}}}}function Kr(e){let n=new Map,t=new Set,r=0,o=(l,u)=>`${l}\0${u}`,i=()=>{r+=1;for(let l of[...t])l()},a=(l,u)=>n.get(o(l,u))?.session;return{acquire(l,u){let d=o(l,u),s=n.get(d);return s===void 0&&(s={session:new Tt(l,u,e.open,e.save,()=>{n.delete(d),i()},i)},n.set(d,s),i()),s.session.retain(),s.session},peek(l,u){return a(l,u)?.getSnapshot()},find:a,forget(l,u){n.get(o(l,u))?.session.abandon()},subscribe(l){return t.add(l),()=>{t.delete(l)}},revision:()=>r}}var Tt=class{constructor(n,t,r,o,i,a){this.sessionId=n;this.path=t;this.open=r;this.saveTransport=o;this.onRelease=i;this.onChange=a}sessionId;path;open;saveTransport;onRelease;onChange;snapshot=ca;listeners=new Set;references=0;closed=!1;generation=0;retain(){this.closed||(this.references+=1)}getSnapshot(){return this.snapshot}subscribe(n){return this.listeners.add(n),()=>{this.listeners.delete(n)}}setDraft(n){this.closed||n===this.snapshot.text||this.publish({...this.snapshot,text:n,dirty:n!==this.snapshot.savedText})}copyDraft(){return this.snapshot.text}async save(){if(this.closed)return{ok:!1,code:"closed"};let n=this.snapshot;if(n.status!=="ready")return{ok:!1,code:"not-ready"};if(!n.dirty)return{ok:!0,version:n.version};if(n.saving)return{ok:!1,code:"busy"};let t=this.saveTransport;if(t===void 0)return this.publish({...n,error:{code:"unavailable",message:""}}),{ok:!1,code:"unavailable"};let r=n.text,o=n.version;this.publish({...n,saving:!0,error:null});try{let i=await t({sessionId:this.sessionId,path:this.path,text:r,expectedVersion:o});if(this.closed)return{ok:!1,code:"closed"};if(!i.ok)return this.publish({...this.snapshot,saving:!1,conflict:i.code==="stale-version"?!0:this.snapshot.conflict,error:{code:i.code,message:i.message}}),{ok:!1,code:i.code};let a=i.version??o;return this.publish({...this.snapshot,saving:!1,savedText:r,version:a,dirty:this.snapshot.text!==r,conflict:!1,error:null}),{ok:!0,version:a}}catch(i){if(this.closed)return{ok:!1,code:"closed"};let a=i instanceof Error?i.message:String(i);return this.publish({...this.snapshot,saving:!1,error:{code:"io-error",message:a}}),{ok:!1,code:"io-error"}}}async reload(n){if(this.closed||this.snapshot.dirty&&n?.force!==!0)return;let t=++this.generation,r=this.snapshot.status==="ready";this.publish({...this.snapshot,status:r?"ready":"loading",error:null});try{let o=await this.open(this.sessionId,this.path);if(this.closed||t!==this.generation)return;if(!o.ok){this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:o.code,message:o.message}});return}let i=n?.force===!0&&this.snapshot.text!==o.text?this.snapshot.text:null;this.publish({...this.snapshot,status:"ready",text:o.text,savedText:o.text,version:o.version??null,dirty:!1,saving:!1,conflict:!1,discarded:i,error:null})}catch(o){if(this.closed||t!==this.generation)return;this.publish({...this.snapshot,status:r?"ready":"failed",error:{code:"io-error",message:o instanceof Error?o.message:String(o)}})}}dispose(){this.closed||this.references<=0||(this.references-=1,!(this.references>0||this.snapshot.dirty)&&this.close())}abandon(){this.closed||this.close()}close(){this.closed=!0,this.listeners.clear(),this.onRelease()}publish(n){this.snapshot=Object.freeze(n);for(let t of[...this.listeners])t();this.onChange()}};var Ln=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function xa(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",n=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(n)?"mac":"other"}function Hr(e,n,t=xa()){if(e.isComposing===!0||e.code!==n.code)return!1;let r=n.modifiers,o=r.includes("meta")||r.includes("primary")&&t==="mac",i=r.includes("control")||r.includes("primary")&&t!=="mac",a=r.includes("alt"),l=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===a&&e.shiftKey===!0===l}function $r(e){if(e===null||typeof e!="object")return!1;let n=e;if(n.isContentEditable===!0)return!0;if(typeof n.tagName!="string")return!1;let t=n.tagName.toLowerCase();return t==="input"||t==="textarea"||t==="select"}function ha(e){let n=e?.querySelector("[data-composer-input]");if(n==null||typeof n!="object")return!1;let t=n.focus;return typeof t!="function"?!1:(t.call(n),!0)}function Mt(e){let n=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return n!=null}function In(e){let n=e.doc??(typeof document>"u"?void 0:document);return t=>{if(t.key!=="Escape"||t.defaultPrevented===!0||t.isComposing===!0||e.hasModal())return;t.preventDefault(),e.focusComposer()!==!0&&ha(n),e.onClose?.()}}var Ue=require("react");function An(e){let n=Te(e);return n===""?e:n}function Dn(e,n){if(typeof e!="string")return;let t=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=n?t:t.replace(/^\/+/u,"");return r===""?void 0:r}var va=Object.freeze({panels:Object.freeze([]),active:null});function Gr(e,n){return n===void 0?e:`git\0${n}\0${e}`}var ba=/^git:([0-9a-f]{4,64}):(.+)$/iu;function Nt(){let e=[],n=null,t=va,r=new Set,o=()=>{t=Object.freeze({panels:Object.freeze(e.slice()),active:n});for(let d of[...r])d()},i=d=>e.findIndex(s=>s.key===d),a=d=>e.findIndex(s=>s.revision===void 0&&s.key===d),l=d=>{if(typeof d!="string")return;if(i(d)>=0)return d;let s=ba.exec(d);if(s!==null){let p=(s[1]??"").toLowerCase(),v=Dn(s[2]??"",!1);if(v===void 0)return;let h=Gr(v,p);return i(h)>=0?h:void 0}let f=Dn(d,!0);if(f===void 0)return;if(a(f)>=0)return f;let y=Dn(d,!1);if(!(y===void 0||y===f))return a(y)>=0?y:void 0},u=d=>{if(e.length===0)return;let s=n===null?-1:i(n),f=e[(s+d+e.length)%e.length];f===void 0||f.key===n||(n=f.key,o())};return{open(d,s=1,f=!1,y){let p=Dn(d,f);if(p===void 0)return;let v=typeof y=="string"&&y.trim()!==""?y.trim().toLowerCase():void 0,h=Gr(p,v),N=Number.isFinite(s)&&s>0?Math.trunc(s):1,T=i(h);if(T>=0){let z=e[T],I=z!==void 0&&(z.line!==N||z.absolute!==f);if(I&&(e=e.map(($,re)=>re===T?{...$,line:N,absolute:f}:$)),n===h){I&&o();return}n=h,o();return}let A=n===null?e.length:i(n)+1,L={key:h,path:p,line:N,absolute:f,...v===void 0?{}:{revision:v}};e=[...e.slice(0,A),L,...e.slice(A)],n=h,o()},close(d){let s=d===void 0?n:l(d)??null;if(s===null)return;let f=i(s);f<0||(e=e.filter(y=>y.key!==s),n===s&&(n=(e[f]??e[f-1])?.key??null),o())},activate(d){let s=l(d);s===void 0||i(s)<0||n===s||(n=s,o())},next(){u(1)},previous(){u(-1)},reset(){e.length===0&&n===null||(e=[],n=null,o())},isOpen(d){let s=l(d);return s!==void 0&&i(s)>=0},activeEntry(){return e.find(d=>d.key===n)},snapshot:()=>t,subscribe(d){return r.add(d),()=>{r.delete(d)}}}}function Vr(){let e=new Map;return{forSession(n){let t=n??"",r=e.get(t);if(r!==void 0)return r;let o=Nt();return e.set(t,o),o}}}function an(e,n){let t=Cn(e);return t===void 0?!1:(n.open(t.path,t.line,t.absolute,t.revision),!0)}var D=require("react/jsx-runtime"),Lt={zh:{"panel.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.title":"\u300C{name}\u300D\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","panel.confirm.save":"\u4FDD\u5B58\u5E76\u5173\u95ED","panel.confirm.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","panel.confirm.discard":"\u653E\u5F03","panel.confirm.cancel":"\u53D6\u6D88","panel.confirm.failed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u9762\u677F\u4FDD\u6301\u6253\u5F00"},en:{"panel.dirty":"Unsaved changes","panel.confirm.title":'"{name}" has unsaved changes',"panel.confirm.save":"Save and close","panel.confirm.saving":"Saving\u2026","panel.confirm.discard":"Discard","panel.confirm.cancel":"Cancel","panel.confirm.failed":"Save failed; the panel stays open"}},wa=()=>()=>{},ka=()=>"";function Sa(e,n,t){return e===void 0||n===void 0?[]:t.filter(r=>e.peek(n,r.path)?.dirty===!0).map(r=>r.path)}function qr({panels:e,active:n,t,onActivate:r,onClose:o,onStep:i,documents:a,sessionId:l}){let u=(0,Ue.useRef)(null);(0,Ue.useEffect)(()=>{u.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[n]);let d=(0,Ue.useSyncExternalStore)(a?.subscribe??wa,()=>Sa(a,l,e).join("\0"),ka),s=new Set(d===""?[]:d.split("\0"));if(e.length===0)return null;let f=y=>{if(y.key==="ArrowRight"||y.key==="ArrowLeft"){y.preventDefault(),y.stopPropagation(),i(y.key==="ArrowRight"?1:-1);return}(y.key==="Delete"||y.key==="Backspace")&&n!==null&&(y.preventDefault(),y.stopPropagation(),o(n))};return(0,D.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":t("panel.tabs"),onKeyDown:f,"data-testid":"fs-tabs",children:e.map((y,p)=>{let v=y.key===n,h=An(y.path),N=t("panel.close").replace("{name}",h);return(0,D.jsxs)("div",{className:"fx-tab","data-active":v?"true":"false","data-dirty":s.has(y.path)?"true":"false",role:"presentation",children:[(0,D.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${p}`,"aria-controls":`fx-panel-${p}`,"aria-selected":v,tabIndex:v?0:-1,title:y.path,"data-testid":"fs-tab","data-path":y.path,"data-key":y.key,ref:v?u:void 0,onClick:()=>r(y.key),children:[(0,D.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":Ge(y.path),"aria-hidden":"true",children:Ve(y.path)}),(0,D.jsx)("span",{className:"fx-tab-name",children:h}),y.revision===void 0?null:(0,D.jsx)("span",{className:"fx-tab-rev","data-testid":"fs-tab-revision",title:y.revision,children:y.revision.slice(0,7)}),s.has(y.path)?(0,D.jsx)("span",{className:"fx-tab-dirty","data-testid":"fs-tab-dirty","data-dirty":"true",role:"img","aria-label":t("panel.dirty"),title:t("panel.dirty")}):null]}),(0,D.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:v?0:-1,"aria-label":N,title:N,"data-testid":"fs-tab-close",onClick:()=>o(y.key),children:"\xD7"})]},y.key)})})}function Ur({name:e,t:n,saving:t,error:r,onSave:o,onDiscard:i,onCancel:a}){return(0,D.jsxs)("div",{className:"fx-close-confirm","data-testid":"fs-close-confirm",role:"group","aria-label":n("panel.confirm.title").replace("{name}",e),children:[(0,D.jsx)("span",{className:"fx-close-confirm-text",children:n("panel.confirm.title").replace("{name}",e)}),r===null?null:(0,D.jsx)("span",{className:"fx-close-confirm-error","data-testid":"fs-close-error",children:r}),(0,D.jsx)("span",{className:"fx-spacer"}),(0,D.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-save",disabled:t,onClick:o,children:n(t?"panel.confirm.saving":"panel.confirm.save")}),(0,D.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-discard",disabled:t,onClick:i,children:n("panel.confirm.discard")}),(0,D.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-close-cancel",disabled:t,onClick:a,children:n("panel.confirm.cancel")})]})}function Ra(){return(0,D.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,D.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,D.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,D.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function Xr({t:e}){return(0,D.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,D.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,D.jsx)(Ra,{})}),(0,D.jsx)("strong",{children:e("panel.empty.title")}),(0,D.jsx)("span",{children:e("panel.empty.description")}),(0,D.jsxs)("span",{className:"fx-empty-keys",children:[(0,D.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,D.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,D.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,D.jsx)("span",{children:e("panel.empty.keys")})]})]})}var Yr=require("react");function X(e,n,...t){let r=t.filter(a=>a!=null&&a!==!1),o=(0,Yr.createElement)(e,n??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...n??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function Ca(e){let n=e.trim();if(!(n===""||n.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(n)||n.startsWith("/")||n.startsWith("#")||n.startsWith("./")||n.startsWith("../")))return n}var Pa=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function _e(e){let n=[],t=0;for(let r of e.matchAll(Pa)){let o=r.index??0;o>t&&n.push(e.slice(t,o));let i=r[0];if(i.startsWith("`"))n.push(X("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))n.push(X("strong",null,..._e(i.slice(2,-2))));else if(i.startsWith("~~"))n.push(X("del",null,..._e(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))n.push(X("em",null,..._e(i.slice(1,-1))));else{let a=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),l=a?.[1]??i,u=a===null?void 0:Ca(a[2]??"");n.push(u===void 0?l:X("a",{href:u,rel:"noreferrer noopener"},l))}t=o+i.length}return t<e.length&&n.push(e.slice(t)),n}var Zr=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Jr=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Qr=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,It=/^\s{0,3}>\s?(.*)$/u,Dt=/^\s{0,3}[-*+]\s+(.*)$/u,At=/^\s{0,3}\d+[.)]\s+(.*)$/u;function Ea(e){return Zr.test(e)||Jr.test(e)||Qr.test(e)||It.test(e)||Dt.test(e)||At.test(e)}function eo(e){let n=[],t=0;for(;t<e.length;){let r=e[t]??"";if(r.trim()===""){t+=1;continue}let o=Zr.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),s=o[2]??"",f=[];for(t+=1;t<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[t]??"");)f.push(e[t]??""),t+=1;t+=1,n.push(X("pre",null,X("code",s===""?null:{className:`language-${s}`},f.join(`
`))));continue}let i=Jr.exec(r);if(i!==null){let d=(i[1]??"#").length;n.push(X(`h${String(d)}`,null,..._e(i[2]??""))),t+=1;continue}if(Qr.test(r)){n.push(X("hr",null)),t+=1;continue}if(It.test(r)){let d=[];for(;t<e.length;){let s=It.exec(e[t]??"");if(s===null)break;d.push(s[1]??""),t+=1}n.push(X("blockquote",null,...eo(d)));continue}if(Dt.exec(r)!==null){let d=[];for(;t<e.length;){let s=Dt.exec(e[t]??"");if(s===null)break;d.push(X("li",null,..._e(s[1]??""))),t+=1}n.push(X("ul",null,...d));continue}if(At.exec(r)!==null){let d=[];for(;t<e.length;){let s=At.exec(e[t]??"");if(s===null)break;d.push(X("li",null,..._e(s[1]??""))),t+=1}n.push(X("ol",null,...d));continue}let u=[r.trim()];for(t+=1;t<e.length;){let d=e[t]??"";if(d.trim()===""||Ea(d))break;u.push(d.trim()),t+=1}n.push(X("p",null,..._e(u.join(" "))))}return n}function Wn(e){let n=e.replace(/\r\n?/gu,`
`).split(`
`);return X("div",{className:"fx-md"},...eo(n))}var Wt=200,Ta={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function ln(e){let n=e.toLowerCase(),t=n.slice(n.lastIndexOf("/")+1),r=t.lastIndexOf(".");return r<=0?"plaintext":Ta[t.slice(r+1)]??"plaintext"}function un(e){return ln(e)==="markdown"}var Z=class extends Error{code;detail;constructor(n,t,r=""){super(t),this.name="PreviewReadError",this.code=n,this.detail=r}};function sn(e){return e!==null&&typeof e=="object"}function Fa(e){return e===""?0:e.split(`
`).length}function Xe(e,n){if(!sn(e))throw new Z("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let s=sn(e.error)?e.error:{},f=typeof s.code=="string"?s.code:"preview/unknown",y=typeof s.message=="string"?s.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",p=sn(s.details)?s.details:{},v=typeof p.kind=="string"?p.kind:"";throw new Z(f,y,v)}let t=e.ok===!0?e.value:e;if(!sn(t)||typeof t.text!="string")throw new Z("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof t.lines=="number"&&Number.isFinite(t.lines)?Math.max(0,Math.trunc(t.lines)):Fa(t.text),o=typeof t.totalLines=="number"&&Number.isFinite(t.totalLines)&&t.totalLines>0?Math.trunc(t.totalLines):void 0,i=typeof t.offset=="number"&&Number.isFinite(t.offset)&&t.offset>0?Math.trunc(t.offset):n,a=t.eof===!0||o!==void 0&&r>0&&i+r-1>=o,l=t.source==="first-parent"?"first-parent":t.source==="commit"?"commit":void 0,u=typeof t.linkTarget=="string"&&t.linkTarget!==""?t.linkTarget:void 0,d={text:t.text,lines:r,offset:i,eof:a,...l===void 0?{}:{source:l},...u===void 0?{}:{linkTarget:u}};return o===void 0?d:{...d,totalLines:o}}function Be(e){let n=sn(e)?e:{},t=typeof n.code=="string"?n.code:"",r=typeof n.detail=="string"?n.detail:"",o=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${t} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:t,message:o}:i.includes("git/submodule")||i.includes("\u5B50\u6A21\u5757")?{kind:"submodule",code:t,message:o}:i.includes("git/binary")||i.includes("\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236")?{kind:"commit-binary",code:t,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:t,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:t,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:t,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:t,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:t,message:o}:i.includes("unavailable")?{kind:"unavailable",code:t,message:o}:{kind:"unknown",code:t,message:o}}var dn=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function On({files:e,maxLines:n=Wt}){let t=Math.max(1,Math.trunc(n)),r=dn,o=0,i=null,a=[1],l=new Set,u=s=>{r=s;for(let f of l)f()},d=async(s,f)=>{o+=1;let y=o;i?.abort();let p=new AbortController;i=p,u({status:"loading",path:s,text:r.path===s?r.text:"",offset:f,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},...r.path===s&&r.source!==void 0?{source:r.source}:{},eof:r.path===s?r.eof:!1});try{let v=await e.read(s,f>1?{offset:f,limit:t}:{limit:t},p.signal);if(y!==o)return;let h=Xe(v,f);if(h.lines===0&&f>1){u({...r,status:"ready",eof:!0,text:"",lines:0});return}let N={status:"ready",path:s,text:h.text,offset:h.offset,lines:h.lines,eof:h.eof,...h.source===void 0?{}:{source:h.source},...h.linkTarget===void 0?{}:{linkTarget:h.linkTarget,linkPath:s}};u(h.totalLines===void 0?N:{...N,totalLines:h.totalLines})}catch(v){if(y!==o||p.signal.aborted)return;u({status:"failed",path:s,text:"",offset:f,lines:0,eof:!1,failure:Be(v)})}};return{maxLines:t,getSnapshot:()=>r,subscribe(s){return l.add(s),()=>{l.delete(s)}},async open(s){a=[1],await d(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(a.push(s),await d(r.path,s))},async prev(){if(r.path===void 0||a.length<=1)return;a=a.slice(0,-1);let s=a[a.length-1]??1;await d(r.path,s)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,a=[1],u(dn)}}}function jn(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let n=e.offset+e.lines-1,t=`${String(e.offset)}\u2013${String(n)}`;return e.totalLines===void 0?{range:t}:{range:t,total:String(e.totalLines)}}var Ot=Object.freeze({chunk:ct.chunk,id:`${ge}/${ct.chunk}`}),jt=null,cn=null,zn=new Map;function no(e){jt=e}function to(){return Ot}function Ma(e){let n=yn[e];return{chunk:n,id:`${ge}/${n}`}}function zt(){if(cn!==null)return cn;let e=jt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${ge}: the loader require was not handed over`));let n=e.async(`./${Ot.chunk}`).then(t=>{let r=t;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${ge}: chunk ${Ot.id} is missing its preview renderers`);return r});return cn=n,n.catch(()=>{cn===n&&(cn=null)}),n}function ro(e){let n=zn.get(e);if(n!==void 0)return n;let t=jt;if(t===null||typeof t.async!="function")return Promise.reject(new Error(`${ge}: the loader require was not handed over`));let r=Ma(e),o=t.async(`./${r.chunk}`).then(i=>{let a=i;if(a===null||typeof a.FamilyView!="function"||a.renderer!==e)throw new Error(`${ge}: chunk ${r.id} is not the ${e} view`);return a});return zn.set(e,o),o.catch(()=>{zn.get(e)===o&&zn.delete(e)}),o}var oo=Object.freeze({}),Na="@deepseek-ai/dsh-client-ui-primitives",Bt=null,_t;function io(e){Bt=e}function La(e,n){try{let t=e(n);return t===null||typeof t!="object"&&typeof t!="function"?void 0:t}catch{return}}function _n(){if(_t!=null)return _t;if(Bt===null)return oo;let e=La(Bt,Na);if(e===void 0)return oo;let n=s=>{let f=e[s];if(typeof f=="function"||typeof f=="object"&&f!==null)return f},t=s=>{let f=e[s];return typeof f=="function"?f:void 0},r={},o=n("Menu");o!==void 0&&(r.Menu=o);let i=n("MenuSurface");i!==void 0&&(r.MenuSurface=i);let a=n("MenuItemButton");a!==void 0&&(r.MenuItemButton=a);let l=n("Input");l!==void 0&&(r.Input=l);let u=n("IconChevronDownOutlineRegular");u!==void 0&&(r.IconChevronDownOutlineRegular=u);let d=t("useAnchoredPosition");return d!==void 0&&(r.useAnchoredPosition=d),r}var F=require("react");async function Ye(e){let n=typeof navigator>"u"?void 0:navigator.clipboard;if(n!==void 0&&typeof n.writeText=="function")try{return await n.writeText(e),!0}catch{}if(typeof document>"u")return!1;let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();try{return document.execCommand("copy")}catch{return!1}finally{t.remove()}}var Me=require("react/jsx-runtime");function Ia(e,n){switch(e.kind){case"deleted":return n("preview.deleted.title");case"denied":return n("preview.denied.title");case"symlink":return n("preview.symlink.title");case"binary":return n("preview.binary.title");case"commit-binary":return n("preview.commitBinary.title");case"submodule":return n("preview.submodule.title");case"too-large":return n("preview.tooLarge.title");case"unavailable":return n("preview.unavailable.title");default:return n("preview.unknown.title")}}function Da(e,n){switch(e.kind){case"deleted":return n("preview.deleted.description");case"denied":return n("preview.denied.description");case"symlink":return n("preview.symlink.description");case"binary":return n("preview.binary.description");case"commit-binary":return n("preview.commitBinary.description");case"submodule":return n("preview.submodule.description");case"too-large":return n("preview.tooLarge.description");case"unavailable":return n("preview.unavailable.description");default:return n("preview.unknown.description")}}function Kt({failure:e,t:n,onRetry:t}){return(0,Me.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,Me.jsx)("strong",{children:Ia(e,n)}),(0,Me.jsx)("span",{children:Da(e,n)}),e.message===""?null:(0,Me.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,Me.jsx)("button",{type:"button",className:"fx-btn",onClick:t,"data-testid":"fs-preview-retry",children:n("preview.retry")})]})}function Ht({t:e}){return(0,Me.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,Me.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}var $t="fsExplorer",ao=1;function Aa(e){let n=e.slice(e.lastIndexOf("/")+1).toLowerCase(),t=n.lastIndexOf(".");return t<=0?"":n.slice(t)}function Wa(e){let n=e.toLowerCase();return n.startsWith(".")?n:`.${n}`}function Oa(e,n,t){return e.extensions.length===0&&e.families.length===0||n!==""&&e.extensions.includes(n)?!0:t!==null&&e.families.includes(t)}function ja(e,n){let t=(e.priority??0)-(n.priority??0);return t!==0?t>0:e.id<n.id}function Bn(e={}){let n=e.warn??(()=>{}),t=new Map,r=new Set,o=()=>{for(let i of[...r])i()};return{register(i){let a=i?.id;if(typeof a!="string"||a==="")return n("renderer registry: a contribution without an id was refused"),()=>{};if(typeof i.load!="function")return n(`renderer registry: "${a}" has no load(); it was refused`),()=>{};if(t.has(a))return n(`renderer registry: "${a}" is already registered; the first registration stays`),()=>{};t.set(a,{contribution:i,extensions:(i.match?.extensions??[]).map(Wa),families:[...i.match?.families??[]]}),o();let l=!0;return()=>{l&&(l=!1,t.delete(a),o())}},resolve(i){let a=Aa(i.path),l=nn(i.path),u;for(let d of t.values())Oa(d,a,l)&&(u===void 0||ja(d.contribution,u.contribution))&&(u=d);return u?.contribution},snapshot(){return Object.freeze([...t.values()].map(i=>i.contribution))},subscribe(i){return r.add(i),()=>{r.delete(i)}}}}function so(e,n){let t=e.resolve(n);if(t===void 0)return;let r=new Promise(o=>o(t.load()));return{contribution:t,module:r}}function Kn(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function Ne(e){try{return e()}catch{return}}function be(e){return e!==null&&typeof e=="object"}function po(e){return()=>{let n=Ne(()=>e.workspaceFiles);if(Kn(n))return n;let t=Ne(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Kn(t))return t;let r=Ne(()=>e.remote?.workspaceFiles);if(Kn(r))return r;let o=Ne(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Kn(o))return o}}function mo(e,n){if(e===void 0||n===void 0)return;let t=e.read;if(typeof t=="function")return{read(r,o,i){return t.call(e,n,r,o,i)}}}function yo(e,n){return{async read(t,r,o){let i=await e.read(t,r,o),a;try{return Xe(i,r.offset??1),i}catch(d){if(!(d instanceof Z)||Be(d).kind!=="symlink")throw d;a=d}let l=await n(t,o);if(l===void 0)throw a;return{...Xe(await e.read(l.absolutePath,r,o),r.offset??1),linkTarget:l.absolutePath}}}}function lo(e){return e===null||typeof e!="object"?!1:typeof e.show=="function"}function za(e){let n=Ne(()=>typeof e.get=="function"?e.get("connection"):void 0),t=be(n)?n.rpc:void 0;if(!be(t)||typeof t.call!="function")return;let r=t.call;return{show:(o,i)=>r.call(t,"/api","gitExplorer/show",{args:{request:o}},i)}}function go(e){return()=>{let n=Ne(()=>e.remote?.gitExplorer);if(lo(n))return n;let t=Ne(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);return lo(t)?t:za(e)}}function _a(e){return e===""?0:e.split(`
`).length}function uo(e){let n=be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u63D0\u4EA4\u7248\u672C\u5931\u8D25";return new Z(t,r)}function xo(e,n,t){return{async read(r,o,i){let a={sessionId:n,hash:t,path:r,...o.offset===void 0?{}:{offset:o.offset},...o.limit===void 0?{}:{limit:o.limit}},l=await e.show(a,i);if(!be(l))throw new Z("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(l.ok===!1)throw uo(l.error);let u=l;if(l.ok===!0&&(u=l.value),!be(u))throw new Z("preview/unknown","Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(u.ok===!1)throw uo(u.error);let d=u;if(u.ok===!0&&(d=u.page),!be(d))throw new Z("preview/unknown","\u63D0\u4EA4\u7248\u672C\u7F3A\u5C11\u9875\u9762\u6570\u636E");if(d.kind==="submodule")throw new Z("git/submodule","\u8FD9\u662F\u4E00\u4E2A\u5B50\u6A21\u5757\uFF0C\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u6587\u672C\u5185\u5BB9");if(d.binary===!0||d.kind==="binary")throw new Z("git/binary","\u8BE5\u63D0\u4EA4\u7248\u672C\u4E2D\u7684\u6587\u4EF6\u662F\u4E8C\u8FDB\u5236\uFF0C\u65E0\u6CD5\u9884\u89C8");if(typeof d.text!="string")throw new Z("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let s=typeof d.lines=="number"&&Number.isFinite(d.lines)?Math.max(0,Math.trunc(d.lines)):_a(d.text),f=typeof d.offset=="number"&&Number.isFinite(d.offset)&&d.offset>0?Math.trunc(d.offset):o.offset??1,y=d.source==="first-parent"?"first-parent":d.source==="commit"?"commit":void 0;return{text:d.text,lines:s,offset:f,eof:d.eof===!0,...y===void 0?{}:{source:y}}}}}function Ba(e){if(!be(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let n=e.ok===!0?e.value:e,t=be(n)?n.data:void 0;return t instanceof Uint8Array?{ok:!0,value:{data:t}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Ka(e){let n=be(e)?e:{},t=typeof n.code=="string"?n.code:"preview/unknown",r=typeof n.message=="string"&&n.message!==""?n.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=be(n.details)?n.details:{},i=typeof o.kind=="string"?o.kind:"";return new Z(t,r,i)}function qt(e){if(e===void 0)return;let n=e.readBytes;if(typeof n=="function")return async(t,r,o)=>{let i=Ba(await n.call(e,t,r,{},o));if(!i.ok)throw Ka(i.error);return i.value.data}}function fn(e){if(e!==null&&typeof e=="object"){let n=e;if(typeof n.message=="string"&&n.message!=="")return n.message;if(typeof n.code=="string"&&n.code!=="")return n.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function Gt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;return Array.isArray(n.entries)?{ok:!0,listing:{entries:n.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:n.truncated===!0,...typeof n.path=="string"?{path:n.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function Hn(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:fn(n.error)};if(n.ok===!0){let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let r=t;return r.ok?Gt(r.value):{ok:!1,message:fn(r.error)}}return Gt(t)}return Gt(n)}function ho(e){return e instanceof Error?e.message:fn(e)}function co(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function vo(e){return()=>{let n=Ne(()=>e.remote?.gitExplorer);if(co(n))return n;let t=Ne(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(co(t))return t}}function fo(e){if(e===null)return null;if(typeof e=="number"&&Number.isFinite(e)&&e>=0)return e}function Ha(e){if(!Array.isArray(e))return;let n=[];for(let t of e){if(t===null||typeof t!="object")continue;let r=t;if(typeof r.path!="string"||r.path==="")continue;let o=fo(r.additions),i=fo(r.deletions);o===void 0||i===void 0||n.push({path:r.path,additions:o,deletions:i})}return n}function $a(e){if(e===null||typeof e!="object")return;let n=e,t=a=>typeof a=="number"&&Number.isFinite(a)&&a>=0?a:void 0,r=typeof n.upstream=="string"&&n.upstream!==""?n.upstream:void 0,o=t(n.ahead),i=t(n.behind);return{hash:typeof n.hash=="string"&&n.hash!==""?n.hash:null,branch:typeof n.branch=="string"&&n.branch!==""?n.branch:null,detached:n.detached===!0,...r===void 0?{}:{upstream:r},...o===void 0?{}:{ahead:o},...i===void 0?{}:{behind:i}}}function Vt(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(typeof n.status!="string")return{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"};let t=Ha(n.stats),r=$a(n.head),o=typeof n.root=="string"&&n.root!==""?n.root:void 0;return{ok:!0,status:n.isRepository===!1?"":n.status,...t===void 0?{}:{stats:t},...r===void 0?{}:{head:r},...o===void 0?{}:{root:o}}}function $n(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=e;if(n.ok===!1)return{ok:!1,message:fn(n.error)};if(n.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=n.value;if(t!==null&&typeof t=="object"&&typeof t.ok=="boolean"){let o=t;return o.ok?Vt(o.snapshot):{ok:!1,message:fn(o.error)}}let r=e;return r.snapshot!==void 0?Vt(r.snapshot):Vt(t)}var b=require("react/jsx-runtime"),Zt={zh:{"preview.save":"\u4FDD\u5B58","preview.saving":"\u4FDD\u5B58\u4E2D\u2026","preview.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF1A{message}","preview.saveUnavailable":"\u5F53\u524D\u90E8\u7F72\u6CA1\u6709\u63D0\u4F9B\u4FDD\u5B58\u901A\u9053","preview.saveNotReady":"\u6587\u6863\u8FD8\u6CA1\u6709\u8BFB\u53D6\u5B8C\u6210","preview.saveBusy":"\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u5019","preview.conflict.title":"\u78C1\u76D8\u6587\u4EF6\u5DF2\u53D8\u5316","preview.conflict.hint":"\u4F60\u7684\u8349\u7A3F\u8FD8\u5728\u5185\u5B58\u91CC\uFF0C\u6CA1\u6709\u88AB\u8986\u76D6\u3002","preview.conflict.reload":"\u91CD\u65B0\u8F7D\u5165","preview.conflict.discard":"\u786E\u8BA4\u4E22\u5F03\u8349\u7A3F","preview.conflict.discardedTitle":"\u5DF2\u8F7D\u5165\u78C1\u76D8\u7248\u672C","preview.conflict.discardedHint":"\u88AB\u4E22\u5F03\u7684\u8349\u7A3F\u8FD8\u7559\u5728\u5185\u5B58\u91CC\uFF0C\u53EF\u4EE5\u6062\u590D\u3002","preview.conflict.restore":"\u6062\u590D\u8349\u7A3F","preview.conflict.copy":"\u590D\u5236\u8349\u7A3F","preview.conflict.copied":"\u5DF2\u590D\u5236"},en:{"preview.save":"Save","preview.saving":"Saving\u2026","preview.saveFailed":"Save failed: {message}","preview.saveUnavailable":"This deployment exposes no save channel","preview.saveNotReady":"The document has not been read yet","preview.saveBusy":"A save is already running","preview.conflict.title":"The file changed on disk","preview.conflict.hint":"Your draft is still in memory; it was not overwritten.","preview.conflict.reload":"Reload","preview.conflict.discard":"Discard draft","preview.conflict.discardedTitle":"The on-disk version is loaded","preview.conflict.discardedHint":"The discarded draft is still in memory; you can restore it.","preview.conflict.restore":"Restore draft","preview.conflict.copy":"Copy draft","preview.conflict.copied":"Copied"}},Ga=()=>()=>{},bo=()=>{};function Jt(e,n,t){switch(e){case"unavailable":return t("preview.saveUnavailable");case"not-ready":case"closed":return t("preview.saveNotReady");case"busy":return t("preview.saveBusy");default:return n===""?e:n}}var Ut={status:"idle"},Va=[".md",".mdx",".markdown",".mdown"],qa=-1e3;function Yt({t:e,revision:n}){return(0,b.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,b.jsx)("strong",{children:e("preview.unavailable.title")}),(0,b.jsx)("span",{children:e(n===void 0?"preview.unavailable.description":"preview.commitUnavailable.description")})]})}function wo({chunk:e,text:n,path:t,offset:r}){let o=(0,F.useRef)(null),i=(0,F.useRef)(null),[a,l]=(0,F.useState)(!1),u=ln(t);return(0,F.useEffect)(()=>{l(!1)},[e,t]),(0,F.useEffect)(()=>{let d=o.current;if(!(e===null||d===null))try{let s=e.mountCodePreview(d,{text:n,language:u,path:t,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{l(!0);return}},[e,t,u]),(0,F.useEffect)(()=>{i.current?.update(n,r)},[n,r,e]),e===null||a?(0,b.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:n}):(0,b.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function Ua({page:e,path:n,mode:t}){let r=e?.text??"";return t==="reading"&&un(n)?(0,b.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Wn(r)}):(0,b.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:r})}function Xa(e){function n({page:t,path:r,mode:o}){return o==="reading"?(0,b.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,b.jsx)(e.MarkdownView,{text:t?.text??""})}):(0,b.jsx)(wo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Ya(e){function n({page:t,path:r}){return(0,b.jsx)(wo,{chunk:e,text:t?.text??"",path:r,offset:t?.offset??1})}return{Body:n,renderer:e.renderer}}function Za({chunk:e,path:n,sessionId:t,files:r,t:o,visible:i,locate:a}){let l=(0,F.useMemo)(()=>{let u=qt(r);return u===void 0||t===void 0||a===void 0?u:async(d,s,f)=>{if(d!==t||s!==n)return u(d,s,f);let y=await a(s,f);return u(d,y?.absolutePath??s,f)}},[r,t,n,a]);return t===void 0||l===void 0?(0,b.jsx)(Yt,{t:o}):(0,b.jsx)(e.FamilyView,{path:n,sessionId:t,readFile:l,t:o,visible:i})}function Ja(e){return{Body:n=>(0,b.jsx)(Za,{chunk:e,...n}),renderer:e.renderer}}function Qt(){return[{id:"builtin.markdown",label:"Markdown",match:{extensions:[...Va]},priority:0,load:()=>zt().then(Xa)},{id:"builtin.source",label:"\u6E90\u7801",match:{},priority:qa,load:()=>zt().then(Ya)},...Object.keys(yn).map(e=>({id:`builtin.family.${e}`,label:e,match:{families:[e]},priority:0,load:()=>ro(e).then(Ja)}))]}var Xt;function Qa(){if(Xt!==void 0)return Xt;let e=Bn();for(let n of Qt())e.register(n);return Xt=e,e}function ko({sessionId:e,files:n,path:t,revision:r,git:o,t:i,visible:a=!0,renderers:l,documents:u,locate:d}){let s=(0,F.useMemo)(()=>{let E=r===void 0?mo(n,e):o===void 0||e===void 0?void 0:xo(o,e,r);return E===void 0||r!==void 0||d===void 0?E:yo(E,d)},[n,e,r,o,d]),f=(0,F.useMemo)(()=>r===void 0?qt(n):void 0,[n,r]),y=l??Qa(),p=t===void 0?null:nn(t),v=p!==null,h=r===void 0&&e!==void 0&&f!==void 0?{sessionId:e,readFile:f}:null,[N,T]=(0,F.useState)(null),[A,L]=(0,F.useState)(dn),[z,I]=(0,F.useState)(Ut),[$,re]=(0,F.useState)(0),[De,We]=(0,F.useState)(0),[Ae,de]=(0,F.useState)("reading"),[ne,g]=(0,F.useState)(!1),[P,k]=(0,F.useState)(!1),[B,V]=(0,F.useState)(void 0),[Y,oe]=(0,F.useState)(!1),J=(0,F.useRef)(void 0),U=(0,F.useRef)(void 0),H=(0,F.useSyncExternalStore)(u?.subscribe??Ga,()=>u===void 0||e===void 0||t===void 0?bo():u.peek(e,t),bo),O=u===void 0||e===void 0||t===void 0?void 0:u.find(e,t);if((0,F.useEffect)(()=>{if(s===void 0){T(null);return}let E=On({files:s,maxLines:Wt});return T(E),()=>E.close()},[s]),(0,F.useEffect)(()=>{if(N===null){L(dn);return}return L(N.getSnapshot()),N.subscribe(()=>L(N.getSnapshot()))},[N]),(0,F.useEffect)(()=>{N===null||t===void 0||p!==null||N.open(t)},[N,t,p]),(0,F.useEffect)(()=>{if(!v||t===void 0||d===void 0){V(void 0);return}let E=new AbortController,G=!0;return(async()=>{let ie=await d(t,E.signal);G&&!E.signal.aborted&&V(ie?.absolutePath)})(),()=>{G=!1,E.abort()}},[v,t,d]),(0,F.useEffect)(()=>{de("reading"),g(!1),oe(!1)},[t]),(0,F.useEffect)(()=>()=>{J.current!==void 0&&clearTimeout(J.current),U.current!==void 0&&clearTimeout(U.current)},[]),(0,F.useEffect)(()=>{H?.conflict!==!0&&(k(!1),oe(!1),U.current!==void 0&&clearTimeout(U.current))},[H?.conflict]),(0,F.useEffect)(()=>y.subscribe(()=>re(E=>E+1)),[y]),(0,F.useEffect)(()=>{if(t===void 0||r!==void 0){I(Ut);return}let E=so(y,{path:t});if(E===void 0){I(Ut);return}let{contribution:G}=E,ie=!0;return I(pe=>pe.status==="ready"&&pe.contribution.id===G.id?pe:{status:"loading",contribution:G}),E.module.then(pe=>{ie&&I({status:"ready",contribution:G,module:pe})},pe=>{ie&&I({status:"failed",contribution:G,failure:Be(pe)})}),()=>{ie=!1}},[y,t,r,$,De]),t===void 0)return(0,b.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,b.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,b.jsx)("strong",{children:i("preview.empty.title")}),(0,b.jsx)("span",{children:i("preview.empty.description")})]})});let K=v&&r!==void 0,xe=jn(A),le=A.linkPath??t,M=v?B:A.linkTarget,he=!v&&un(t),Ke=v?!K&&h!==null&&z.status!=="ready"&&z.status!=="failed":A.status==="loading",Se=A.status==="ready",Oe=he&&Ae==="reading",Ze=v?K||h===null?"unavailable":z.status==="failed"?"failed":z.status==="ready"?"ready":"loading":A.status,et=z.status==="ready"?z.module.renderer??z.contribution.id:v?"pending":Oe?"fallback":"plain",ue={path:M??t,sessionId:e,files:n,t:i,visible:a,mode:Ae,...v?{}:{page:{text:A.text,offset:A.offset}},...d===void 0?{}:{locate:d}},Je=()=>{Ye(M??le).then(E=>{E&&(g(!0),J.current!==void 0&&clearTimeout(J.current),J.current=setTimeout(()=>g(!1),1400))})},ce=()=>{let E=O?.copyDraft();E!==void 0&&Ye(E).then(G=>{G&&(k(!0),U.current!==void 0&&clearTimeout(U.current),U.current=setTimeout(()=>k(!1),1400))})},fe=H?.error,nt=fe!=null&&H?.conflict!==!0,ve=H?.conflict===!0,He=H?.discarded??null,Re=!ve&&He!==null&&H?.dirty!==!0&&He!==H?.text,Ce;if(v){let E=z.status==="ready"?z.module.Body:void 0;Ce=K?(0,b.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-commit-binary",children:[(0,b.jsx)("strong",{children:i("preview.commitBinary.title")}),(0,b.jsx)("span",{children:i("preview.commitBinary.description")})]}):h===null?(0,b.jsx)(Yt,{t:i,revision:r}):z.status==="failed"?(0,b.jsx)(Kt,{failure:z.failure,t:i,onRetry:()=>We(G=>G+1)}):E===void 0?(0,b.jsx)(Ht,{t:i}):(0,b.jsx)(E,{...ue})}else if(s===void 0)Ce=(0,b.jsx)(Yt,{t:i,revision:r});else if(A.status==="failed")Ce=(0,b.jsx)(Kt,{failure:A.failure??{kind:"unknown",code:"",message:""},t:i,onRetry:()=>{N?.retry()}});else if(!Se)Ce=(0,b.jsx)(Ht,{t:i});else{let E=z.status==="ready"?z.module.Body:Ua;Ce=(0,b.jsx)(E,{...ue})}return(0,b.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":Ze,"data-mode":v?"binary":Oe?"reading":"code","data-renderer":et,children:[(0,b.jsxs)("header",{className:"fx-preview-bar",children:[(0,b.jsxs)("span",{className:"fx-preview-path",title:M===void 0?le:`${le} \u2192 ${M}`,"data-testid":"fs-preview-path",...M===void 0?{}:{"data-link":"followed"},children:[le,M===void 0?null:(0,b.jsxs)("span",{className:"fx-preview-link","data-testid":"fs-preview-link-target",children:[" \u2192 ",M]})]}),v?null:(0,b.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:i("preview.range"),children:[xe.range,xe.range==="\u2014"?null:(0,b.jsxs)(b.Fragment,{children:[" ",i("preview.lines")]}),xe.total===void 0?null:(0,b.jsxs)("span",{className:"fx-preview-total",children:[" / ",xe.total," ",i("preview.lines")]})]}),(0,b.jsxs)("div",{className:"fx-preview-actions",children:[H===void 0?null:(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-preview-save",disabled:!H.dirty||H.saving||H.status!=="ready",onClick:()=>{O?.save()},children:H.saving?i("preview.saving"):i("preview.save")}),he?(0,b.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>de(E=>E==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:i(Ae==="reading"?"preview.source":"preview.reading")}):null,v?null:(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Se||Ke||A.offset<=1,onClick:()=>{N?.prev()},"data-testid":"fs-preview-prev",children:i("preview.prev")}),(0,b.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!Se||Ke||A.eof,onClick:()=>{N?.next()},"data-testid":"fs-preview-next",children:i("preview.next")})]}),(0,b.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Je,"data-testid":"fs-preview-copy",children:i(ne?"preview.copied":"preview.copyPath")}),Ke?(0,b.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),A.source==="first-parent"?(0,b.jsx)("div",{className:"fx-preview-notice","data-testid":"fs-preview-deleted",children:i("preview.deletedCommit")}):null,ve||Re?(0,b.jsxs)("div",{className:"fx-conflict",role:"alert","data-testid":"fs-preview-conflict","data-state":ve?"conflict":"discarded",children:[(0,b.jsx)("strong",{children:i(ve?"preview.conflict.title":"preview.conflict.discardedTitle")}),(0,b.jsx)("span",{className:"fx-conflict-hint",children:i(ve?"preview.conflict.hint":"preview.conflict.discardedHint")}),(0,b.jsx)("span",{className:"fx-spacer"}),ve?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-reload","data-confirm":Y?"discard":void 0,onClick:()=>{if(!Y&&H?.dirty===!0){oe(!0);return}oe(!1),O?.reload({force:!0})},children:i(Y?"preview.conflict.discard":"preview.conflict.reload")}):null,Re?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-restore",onClick:()=>{He!==null&&O?.setDraft(He)},children:i("preview.conflict.restore")}):null,ve?(0,b.jsx)("button",{type:"button",className:"fx-pbtn","data-testid":"fs-conflict-copy",onClick:ce,children:i(P?"preview.conflict.copied":"preview.conflict.copy")}):null]}):null,nt?(0,b.jsx)("div",{className:"fx-save-error",role:"alert","data-testid":"fs-preview-save-error",children:i("preview.saveFailed").replace("{message}",Jt(fe?.code??"io-error",fe?.message??"",i))}):null,(0,b.jsx)("div",{className:"fx-preview-body","data-scroll":Oe?"y":"none",children:Ce})]})}var So="dsh-fs-explorer-styles",es=`
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
`;function Ro(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${So}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.dshStyle=So,t.textContent=es,e.head.appendChild(t),()=>{t.remove()}}var x=require("react");var ae={createFile:"create.file",createFolder:"create.folder",reveal:"reveal",copyAbsolute:"copy.absolute",copyRelative:"copy.relative"};function Co(e){let n=e.replace(/\/+$/u,""),t=n.lastIndexOf("/");return t<0?"":n.slice(0,t)}function ns(e){return e==="finder"?"menu.reveal.finder":e==="explorer"?"menu.reveal.explorer":"menu.reveal.directory"}function Po(e,n){let{row:t,notices:r,capabilities:o,absolutePath:i,createParent:a}=e,l=r.workspace&&a!==void 0,u=[{id:ae.createFile,label:n("menu.create.file"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}},{id:ae.createFolder,label:n("menu.create.folder"),...l?{}:{disabled:!0,reason:n("menu.create.reason")}}];if(t===void 0)return u;let d=r.workspace&&o?.canReveal===!0&&o.fileManager!==null,s={id:ae.reveal,label:n(ns(o?.fileManager??null)),...d?{}:{disabled:!0,reason:n("menu.reveal.reason")}},f={id:ae.copyAbsolute,label:n("menu.copy.absolute"),...i===void 0?{disabled:!0,reason:n("menu.copy.absolute.reason")}:{}},y={id:ae.copyRelative,label:n("menu.copy.relative")};return[...u,s,{id:"menu.copy",label:n("menu.copy"),submenu:[f,y]}]}var we=require("react");var te=require("react/jsx-runtime");function ts(e){return new DOMRect(e.x,e.y,0,0)}function Eo(e){return e.disabled!==!0||e.reason===void 0?e.label:(0,te.jsxs)(te.Fragment,{children:[e.label,(0,te.jsx)("span",{className:"fx-menu-reason",children:e.reason})]})}function To({entries:e,anchor:n,onSelect:t,onClose:r,returnFocus:o}){let i=_n();if(i.Menu!==void 0){let a=i.Menu;return(0,te.jsx)(a,{open:!0,contextual:!0,portal:!0,autoFocus:!0,anchor:null,items:e.map(l=>({id:l.id,label:Eo(l),...l.disabled===!0?{disabled:!0}:{},...l.submenu===void 0?{}:{submenu:l.submenu.map(u=>({id:u.id,label:Eo(u),...u.disabled===!0?{disabled:!0}:{}}))}})),onSelect:t,onClose:r,getAnchorRect:()=>ts(n),...o===void 0?{}:{returnFocus:o},listClassName:"fx-menu-list"})}return(0,te.jsx)(rs,{entries:e,anchor:n,onSelect:t,onClose:r})}function rs({entries:e,anchor:n,onSelect:t,onClose:r}){let o=(0,we.useRef)(null),[i,a]=(0,we.useState)(null),[l,u]=(0,we.useState)({left:n.x,top:n.y});(0,we.useEffect)(()=>{let s=o.current;if(s===null)return;let f=8,y=s.offsetWidth,p=s.offsetHeight,v=Math.min(Math.max(n.x,f),Math.max(f,window.innerWidth-y-f)),h=Math.min(Math.max(n.y,f),Math.max(f,window.innerHeight-p-f));u({left:v,top:h})},[n.x,n.y]),(0,we.useEffect)(()=>{let s=y=>{y.target instanceof Node&&o.current?.contains(y.target)!==!0&&r()},f=y=>{y.key!=="Escape"||y.isComposing||(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("pointerdown",s),document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("pointerdown",s),document.removeEventListener("keydown",f,!0)}},[r]);let d=(0,we.useCallback)(s=>{if(s.disabled!==!0){if(s.submenu!==void 0){a(f=>f===s.id?null:s.id);return}t(s.id)}},[t]);return(0,te.jsx)("div",{ref:o,className:"fx-menu",role:"menu","data-testid":"fx-menu",style:l,onContextMenu:s=>s.preventDefault(),children:e.map(s=>(0,te.jsxs)("div",{className:"fx-menu-item-wrap",children:[(0,te.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":s.id,disabled:s.disabled===!0&&s.reason===void 0,"aria-disabled":s.disabled===!0?!0:void 0,"aria-haspopup":s.submenu===void 0?void 0:"menu","aria-expanded":s.submenu===void 0?void 0:i===s.id,title:s.disabled===!0?s.reason:void 0,onClick:()=>d(s),children:s.label}),s.submenu===void 0||i!==s.id?null:(0,te.jsx)("div",{className:"fx-menu fx-menu-sub",role:"menu",children:s.submenu.map(f=>(0,te.jsx)("button",{type:"button",role:"menuitem",className:"fx-menu-item","data-testid":"fx-menu-item","data-action":f.id,disabled:f.disabled===!0&&f.reason===void 0,"aria-disabled":f.disabled===!0?!0:void 0,title:f.disabled===!0?f.reason:void 0,onClick:()=>d(f),children:f.label},f.id))})]},s.id))})}var Le=require("react");var se=require("react/jsx-runtime"),os=200;function is(e,n){let t=e.trim();return t===""?{ok:!1,reason:"empty"}:t==="."||t===".."?{ok:!1,reason:"dot"}:t.includes("/")||t.includes("\\")||t.includes("\0")?{ok:!1,reason:"separator"}:t.length>os?{ok:!1,reason:"too-long"}:{ok:!0,name:t}}function as(e){return e==="directory"?"\u65B0\u5EFA\u6587\u4EF6\u5939":"untitled.md"}function Fo({kind:e,parent:n,t,onSubmit:r,onCancel:o,error:i,busy:a=!1}){let[l,u]=(0,Le.useState)(()=>as(e)),[d,s]=(0,Le.useState)(void 0),f=(0,Le.useRef)(null),y=_n();(0,Le.useEffect)(()=>{let T=f.current;T!==null&&(T.focus(),T.select())},[]);let p=(0,Le.useCallback)(()=>{if(a)return;let T=is(l,e);if(!T.ok){s(t(`prompt.error.${T.reason}`));return}s(void 0),r(T.name)},[a,e,r,t,l]),v=T=>{if(!T.nativeEvent.isComposing){if(T.key==="Escape"){T.preventDefault(),T.stopPropagation(),o();return}T.key==="Enter"&&(T.preventDefault(),p())}},h=d??i,N=y.Input;return(0,se.jsxs)("div",{className:"fx-name-prompt",role:"dialog","aria-modal":"false","aria-label":t(e==="directory"?"prompt.title.folder":"prompt.title.file"),"data-testid":"fx-name-prompt","data-kind":e,onKeyDown:v,children:[(0,se.jsxs)("div",{className:"fx-name-prompt-head",children:[(0,se.jsx)("strong",{children:t(e==="directory"?"prompt.title.folder":"prompt.title.file")}),(0,se.jsx)("span",{className:"fx-name-prompt-parent",children:n===""?t("prompt.root"):n})]}),N===void 0?(0,se.jsx)("input",{ref:f,className:"fx-name-input",type:"text",value:l,disabled:a,spellCheck:!1,autoComplete:"off","aria-label":t("prompt.input"),"aria-invalid":h===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:T=>{u(T.target.value),s(void 0)}}):(0,se.jsx)(N,{ref:f,className:"fx-name-input",value:l,disabled:a,"aria-label":t("prompt.input"),"aria-invalid":h===void 0?void 0:!0,"data-testid":"fx-name-input",onChange:T=>{u(T.target.value),s(void 0)}}),h===void 0?null:(0,se.jsx)("div",{className:"fx-name-prompt-error",role:"alert","data-testid":"fx-name-error",children:h}),(0,se.jsxs)("div",{className:"fx-name-prompt-actions",children:[(0,se.jsx)("button",{type:"button",className:"fx-btn fx-btn-text",disabled:a,onClick:o,children:t("prompt.cancel")}),(0,se.jsx)("button",{type:"button",className:"fx-btn fx-btn-primary",disabled:a,onClick:p,children:t("prompt.submit")})]})]})}var er="fs-explorer.treePaneWidth";function nr(e){return Math.min(520,Math.max(180,e))}function No(e){if(e==null)return null;let n;try{n=e.getItem(er)}catch{return null}if(n===null)return null;let t=Number(n);return!Number.isFinite(t)||t<180||t>520?null:t}function Gn(e,n){let t=Math.round(nr(n));if(e!=null)try{e.setItem(er,String(t))}catch{}return t}function Lo(e){if(e!=null)try{e.removeItem(er)}catch{}}function Io(e,n){return Math.round(e)===Math.round(n)}var Mo=16;function Do(e,n){if(n)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Mo};case"ArrowRight":return{kind:"nudge",delta:Mo};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var W=require("react");function Wo(e,n,t,r=800){return t-n<=r?e:""}function Oo(e,n){let t=n===void 0?void 0:e[n];if(t?.type==="entry"&&t.kind==="directory")return t.path;if(t?.type!=="entry"||n===void 0)return"";for(let r=n-1;r>=0;r-=1){let o=e[r];if(o?.type==="entry"&&o.depth<t.depth)return o.path}return""}function jo(e,n){if(n===""){let o=[];for(let i=0;i<e.length;i+=1){let a=e[i];a?.type==="entry"&&a.depth===0&&o.push(i)}return o}let t=e.findIndex(o=>o.type==="entry"&&o.path===n),r=e[t];return r?.type!=="entry"?[]:ss(e,t+1,r.depth,r.depth+1)}function ss(e,n,t,r){let o=[];for(let i=n;i<e.length;i+=1){let a=e[i];if(a?.type==="entry"){if(a.depth<=t)break;a.depth===r&&o.push(i)}}return o}var ds=/^.$/u;function zo(e){if(e.composing||e.alt||e.meta||e.ctrl||e.repeat)return{kind:"ignore"};if(e.key==="Escape")return{kind:"clear"};if(!ds.test(e.key))return{kind:"ignore"};let n=e.key.toLowerCase();if(e.query.length===1&&e.query.toLowerCase()===n){let a=Ao(e.names,n),l=a.find(u=>u>e.active)??a[0];return l===void 0?{kind:"miss"}:{kind:"jump",index:l,query:n}}let t=`${e.query}${n}`,r=Ao(e.names,t);if(r.length===0)return{kind:"miss"};let i=(r.includes(e.active)?e.active:void 0)??r.find(a=>a>e.active)??r[0];return i===void 0?{kind:"miss"}:{kind:"jump",index:i,query:t}}function Ao(e,n){let t=n.toLowerCase(),r=[];for(let o=0;o<e.length;o+=1){let i=e[o];i!==void 0&&i.toLowerCase().startsWith(t)&&r.push(o)}return r}var C=require("react/jsx-runtime"),Ie=22;function tr({open:e=!0,size:n=14}){return(0,C.jsx)("svg",{width:n,height:n,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,C.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,C.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function ls(){return(0,C.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,C.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function _o(){return(0,C.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,C.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function Bo(){return(0,C.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,C.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function us({name:e}){return(0,C.jsx)("span",{className:"fx-badge","data-icon":Ge(e),"aria-hidden":"true",children:Ve(e)})}function cs({row:e,selected:n,cursor:t,top:r,t:o,onToggle:i,onSelect:a,onRowActivate:l,onContextMenu:u}){let d=e.kind==="directory",s={top:r,paddingLeft:8+e.depth*12};return(0,C.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":n,...d?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":n?"true":"false","data-cursor":t?"true":"false","data-expanded":d?e.expanded?"true":"false":void 0,"data-status":e.status,"data-path":e.path,"data-testid":"fx-row",title:e.path,style:s,onClick:()=>{l(e.path),d?i(e.path):a(e.path)},onContextMenu:f=>{f.preventDefault(),f.stopPropagation(),u(e,f)},children:[(0,C.jsx)("span",{className:"fx-chevron","data-open":d&&e.expanded?"true":"false","data-visible":d?"true":"false","aria-hidden":"true",children:(0,C.jsx)(ls,{})}),d?(0,C.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,C.jsx)(tr,{open:e.expanded})}):(0,C.jsx)(us,{name:e.name}),(0,C.jsx)("span",{className:"fx-name",children:e.name}),e.tag===void 0?null:(0,C.jsx)("span",{className:"fx-tag","data-tag":e.tag,"data-testid":"fx-tag",title:o(`tag.${e.tag}`),"aria-label":o(`tag.${e.tag}`),children:e.tag==="submodule"?"SUB":"PKG"}),e.status===void 0?null:(0,C.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":rn(e.status),"data-testid":"fx-file-status",title:o(ft(e.status)),"aria-label":o(ft(e.status)),children:xn(e.status)}),e.statusCount===void 0?null:(0,C.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,C.jsx)("span",{className:"fx-row-fill"}),e.diff===void 0?null:(0,C.jsx)("span",{className:"fx-diff","data-testid":"fx-diff","aria-hidden":"true",children:"binary"in e.diff?(0,C.jsx)("span",{className:"fx-diff-bin",children:o("row.binary")}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("span",{className:"fx-diff-add",children:`+${String(e.diff.additions)}`}),(0,C.jsx)("span",{className:"fx-diff-del",children:`-${String(e.diff.deletions)}`})]})}),e.size===void 0?null:(0,C.jsx)("span",{className:"fx-size",children:En(e.size)})]})}function fs({row:e,top:n,t,onRetry:r}){let o=e.state==="loading"?t("state.loadingDirectory"):e.state==="empty"?t("state.emptyDirectory"):e.state==="failed"?e.message??t("state.failedDirectory"):e.label??t("state.truncated");return(0,C.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:n,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,C.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,C.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,C.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,C.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:t("action.retry")}):null]})}function ps(e){if(e===null)return;let n=e.ownerDocument;n.activeElement!==null&&e.contains(n.activeElement)||e.focus({preventScroll:!0})}function Ko({rows:e,selectedPath:n,entryFocus:t,t:r,onToggle:o,onSelect:i,onRetry:a,onEntryFocusSettled:l,onContextMenu:u}){let d=(0,W.useRef)(null),[s,f]=(0,W.useState)(0),[y,p]=(0,W.useState)(0),[v,h]=(0,W.useState)(void 0),N=(0,W.useRef)(void 0),T=(0,W.useRef)({query:"",at:0}),A=(0,W.useRef)(void 0),L=(0,W.useRef)(void 0),z=(0,W.useRef)(v);z.current=v;let I=(0,W.useMemo)(()=>e.flatMap((g,P)=>g.type==="entry"?[P]:[]),[e]);(0,W.useEffect)(()=>{let g=L.current!==n;if(L.current=n,A.current!==void 0||n===void 0)return;let P=z.current===void 0?void 0:e[z.current];if(!Nr({cursorPath:P?.type==="entry"?P.path:void 0,selectionMoved:g}))return;let k=e.findIndex(B=>B.type==="entry"&&B.path===n);k>=0&&h(k)},[n,e]),(0,W.useEffect)(()=>{let g=A.current;if(g===void 0)return;let P=e.findIndex(V=>V.type==="entry"&&V.path===g),k=e[P];if(k?.type!=="entry"||k.kind!=="directory"||!k.expanded){A.current=void 0;return}let B=Lr(e,g);B!==void 0&&(A.current=void 0,h(B))},[e]),(0,W.useEffect)(()=>{v!==void 0&&e[v]?.type!=="entry"&&h(void 0)},[e,v]),(0,W.useEffect)(()=>{let g=d.current;if(v===void 0||g===null)return;let P=mt({scrollTop:g.scrollTop,viewport:g.clientHeight,rowHeight:Ie,index:v});P!==g.scrollTop&&(g.scrollTop=P)},[v]);let $=(0,W.useCallback)(g=>{h(g),d.current?.focus({preventScroll:!0})},[]),re=(0,W.useCallback)(g=>{let P=e.findIndex(k=>k.type==="entry"&&k.path===g);P>=0&&h(P)},[e]),De=(0,W.useCallback)((g,P,k)=>{re(g.path),u(g,P,k)},[re,u]),We=(0,W.useCallback)(g=>{g.preventDefault(),u(void 0,{x:g.clientX,y:g.clientY},g.currentTarget)},[u]),Ae=(0,W.useCallback)(g=>{if(g.nativeEvent.isComposing||g.altKey||g.metaKey||g.ctrlKey)return;let P=I.at(-1);if(g.key==="ArrowDown"){if(g.preventDefault(),v===void 0){I[0]!==void 0&&$(I[0]);return}let O=I.find(K=>K>v);O!==void 0&&$(O);return}if(g.key==="ArrowUp"){if(g.preventDefault(),v===void 0){P!==void 0&&$(P);return}let O=[...I].reverse().find(K=>K<v);O!==void 0&&$(O);return}if(v===void 0)return;let k=e[v];if(k===void 0||k.type!=="entry")return;if(g.key==="ArrowRight"){if(g.preventDefault(),k.kind==="directory"&&!k.expanded)A.current=k.path,o(k.path);else{let O=I.find(K=>K>v);O!==void 0&&e[O]?.depth===k.depth+1&&$(O)}return}if(g.key==="ArrowLeft"){if(g.preventDefault(),k.kind==="directory"&&k.expanded)o(k.path);else{let O=[...I].reverse().find(K=>K<v&&e[K]?.type==="entry"&&e[K].depth<k.depth);O!==void 0&&$(O)}return}if(g.key==="Enter"&&k.kind!=="directory"){g.preventDefault(),i(k.path);return}if(g.key==="ContextMenu"||g.key==="F10"&&g.shiftKey){g.preventDefault();let O=d.current?.getBoundingClientRect(),K=O===void 0?0:O.top+v*Ie-(d.current?.scrollTop??0);De(k,{x:O?.left??0,y:K+Ie},d.current??void 0);return}if(g.key==="Home"){g.preventDefault(),I[0]!==void 0&&$(I[0]);return}if(g.key==="End"){g.preventDefault(),P!==void 0&&$(P);return}let B=Date.now(),V=Oo(e,v),Y=jo(e,V),oe=Y.map(O=>{let K=e[O];return K?.type==="entry"?K.name:""}),J=zo({query:Wo(T.current.query,T.current.at,B),key:g.key,composing:!1,alt:!1,meta:!1,ctrl:!1,repeat:g.nativeEvent.repeat,names:oe,active:v===void 0?-1:Y.indexOf(v)});if(J.kind==="clear"){T.current={query:"",at:0};return}if(J.kind!=="jump")return;let U=Y[J.index];if(U===void 0)return;let H=e[U];H?.type==="entry"&&(T.current={query:J.query,at:B},g.preventDefault(),$(U),H.kind!=="directory"&&i(H.path))},[v,I,$,o,i,De,e]);(0,W.useEffect)(()=>{let g=d.current;if(g===null)return;let P=()=>p(g.clientHeight);if(P(),typeof ResizeObserver>"u")return;let k=new ResizeObserver(P);return k.observe(g),()=>k.disconnect()},[]),(0,W.useEffect)(()=>{if(n===void 0)return;let g=d.current;if(g===null)return;let P=e.findIndex(B=>B.type==="entry"&&B.path===n);if(P<0)return;let k=P*Ie;(k<g.scrollTop||k+Ie>g.scrollTop+g.clientHeight)&&(g.scrollTop=Math.max(0,k-g.clientHeight/2))},[n,e]),(0,W.useEffect)(()=>{if(t===void 0||N.current===t)return;let g=d.current;if(g===null)return;let P=t.path===void 0?-1:e.findIndex(k=>k.type==="entry"&&k.path===t.path);if(!(t.path!==void 0&&P<0)){if(N.current=t,P>=0){let k=mt({scrollTop:g.scrollTop,viewport:g.clientHeight===0?480:g.clientHeight,rowHeight:Ie,index:P});k!==g.scrollTop&&(g.scrollTop=k,f(k)),h(P)}ps(g),l?.()}},[t,e,l]);let de=g=>{f(g.currentTarget.scrollTop)},ne=wn(e,{scrollTop:s,height:y===0?480:y,rowHeight:Ie});return(0,C.jsx)("div",{className:"fx-scroll",ref:d,onScroll:de,onKeyDown:Ae,onContextMenu:We,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":r("view.tree"),children:(0,C.jsx)("div",{className:"fx-vlist",style:{height:e.length*Ie},children:ne.rows.map((g,P)=>{let k=(ne.startIndex+P)*Ie;return g.type==="entry"?(0,C.jsx)(cs,{row:g,top:k,selected:g.path===n,cursor:v===ne.startIndex+P,t:r,onToggle:o,onSelect:i,onRowActivate:re,onContextMenu:(B,V)=>De(B,{x:V.clientX,y:V.clientY},V.currentTarget instanceof HTMLElement?V.currentTarget:void 0)},g.path):(0,C.jsx)(fs,{row:g,top:k,t:r,onRetry:a},g.key)})})})}function ke(e){return e!==null&&typeof e=="object"}function Vn(e){try{return e()}catch{return}}function ms(e){let n=Vn(()=>typeof e.get=="function"?e.get("connection"):void 0),t=ke(n)?n.rpc:void 0;if(!(!ke(t)||typeof t.call!="function"))return(r,o,i)=>t.call.call(t,"/api",`${gr}/${r}`,o,i)}function ys(e){let n=t=>(r,o)=>e(t,{args:{request:r}},o);return{capabilities:n("capabilities"),info:n("info"),reveal:n("reveal"),create:n("create")}}function rr(e){return ke(e)&&typeof e.info=="function"&&typeof e.reveal=="function"}function gs(e){return()=>{let n=Vn(()=>e.fsExplorerWorkspace);if(rr(n))return n;let t=Vn(()=>ke(e.remote)?e.remote.fsExplorerWorkspace:void 0);if(rr(t))return t;let r=Vn(()=>typeof e.get=="function"?e.get("remote.fsExplorerWorkspace"):void 0);if(rr(r))return r;let o=ms(e);if(o!==void 0)return ys(o)}}function qn(e){let n=ke(e)?e:void 0;if(n===void 0)return;if(n.ok===!1){let r=ke(n.error)?n.error:void 0;return{ok:!1,...r===void 0?{}:{error:r}}}let t=n.ok===!0&&"value"in n?n.value:e;return ke(t)?t:void 0}var xs=["no-workspace","outside-workspace","not-found","unsupported","permission","io-error"];function Un(e){let n=ke(e)?e:{},t=typeof n.code=="string"?n.code:"";return{code:xs.find(r=>r===t)??"io-error",message:typeof n.message=="string"?n.message:""}}function hs(e){let n=qn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Un(n.error)};let t=ke(n.capabilities)?n.capabilities:void 0;if(t===void 0)return{ok:!1,error:{code:"io-error",message:""}};let r=t.fileManager;return{ok:!0,capabilities:{fileManager:r==="finder"||r==="explorer"||r==="directory"?r:null,canReveal:t.canReveal===!0}}}function vs(e){let n=qn(e);if(n===void 0)return{ok:!1,error:{code:"io-error",message:""}};if(n.ok===!1)return{ok:!1,error:Un(n.error)};let t=ke(n.info)?n.info:void 0;return t===void 0||typeof t.absolutePath!="string"||t.absolutePath===""?{ok:!1,error:{code:"io-error",message:""}}:{ok:!0,info:{absolutePath:t.absolutePath,type:t.type==="file"||t.type==="directory"?t.type:"other",exists:t.exists===!0}}}function bs(e){let n=qn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Un(n.error)}:{ok:!0}}function ws(e){let n=qn(e);return n===void 0?{ok:!1,error:{code:"io-error",message:""}}:n.ok===!1?{ok:!1,error:Un(n.error)}:typeof n.path=="string"&&n.path!==""?{ok:!0,path:n.path}:{ok:!1,error:{code:"io-error",message:""}}}var Ho={code:"unsupported",message:"the workspace service is unavailable"};function $o(e){let n=gs(e),t=async(r,o)=>{let i=n();if(i===void 0)return o({ok:!1,error:Ho});try{return o(await r(i))}catch(a){return o({ok:!1,error:{code:"io-error",message:a instanceof Error?a.message:String(a)}})}};return{capabilities:(r,o)=>t(i=>i.capabilities({sessionId:r},o),hs),info:(r,o,i)=>t(a=>a.info({sessionId:r,path:o},i),vs),reveal:(r,o,i)=>t(a=>a.reveal({sessionId:r,path:o},i),bs),create:(r,o,i,a,l)=>t(u=>{let d=u.create;return typeof d!="function"?{ok:!1,error:Ho}:d.call(u,{sessionId:r,parent:o,name:i,kind:a},l)},ws)}}var S=require("react/jsx-runtime");var ks=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ss(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Rs=()=>typeof window>"u"||window.matchMedia("(max-width: 760px)").matches,Vo=new Map;function Cs(e){if(e===null||typeof e!="object")return;let n=e;if(n.ok===!1)return;let t=n.ok===!0?n.value:e;if(t===null||typeof t!="object")return;let r=t.text;return typeof r=="string"?r:void 0}function Xn({title:e,description:n,actionLabel:t,onAction:r,testId:o}){return(0,S.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,S.jsx)("strong",{children:e}),n===void 0?null:(0,S.jsx)("span",{children:n}),t===void 0||r===void 0?null:(0,S.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:t})]})}function Ps(e){return e.isComposing===!0||e.code!=="KeyS"?!1:(e.metaKey===!0||e.ctrlKey===!0)&&e.altKey!==!0&&e.shiftKey!==!0}function qo({workbench:e,version:n,t,files:r,status:o,git:i=()=>{},renderers:a,documents:l,locate:u,workspace:d}){let s=Vr();function f(y){let p=y.sessionId??e.currentSessionId(),v=(0,x.useRef)(p);v.current=p;let h=(0,x.useMemo)(()=>r(),[r]),N=(0,x.useMemo)(()=>o(),[o]),T=(0,x.useMemo)(()=>i(),[i]),A=(0,x.useMemo)(()=>p===void 0||u===void 0?void 0:u(p),[u,p]),L=(0,x.useMemo)(()=>p===void 0||d===void 0?void 0:d(p),[d,p]),z=(0,x.useRef)(!1),[I,$]=(0,x.useState)(null),[re,De]=(0,x.useState)(void 0),[We,Ae]=(0,x.useState)(null),de=(0,x.useRef)(null),[ne,g]=(0,x.useState)(null),[P,k]=(0,x.useState)(()=>new Map),[B,V]=(0,x.useState)(void 0),[Y,oe]=(0,x.useState)(void 0),[J,U]=(0,x.useState)(void 0),[H,O]=(0,x.useState)(Vo),K=(0,x.useRef)(P);K.current=P;let[xe,le]=(0,x.useState)(()=>new Set),M=(0,x.useMemo)(()=>s.forSession(p),[s,p]),he=(0,x.useSyncExternalStore)(M.subscribe,M.snapshot,M.snapshot),Ke=he.panels.find(c=>c.key===he.active),Se=Ke?.path,Oe=Ke?.revision,[Ze,et]=(0,x.useState)(0),ue=(0,x.useRef)(new Map),Je=(0,x.useRef)(void 0),[ce,fe]=(0,x.useState)(null),[nt,ve]=(0,x.useState)(!1),[He,Re]=(0,x.useState)(null),Ce=(0,x.useRef)(null);Ce.current=ce?.path??null;let E=(0,x.useMemo)(()=>Ss(),[]),[G,ie]=(0,x.useState)(()=>No(E)),pe=(0,x.useRef)(null),$e=(0,x.useRef)(null),q=P.get(""),pn=q?.status==="ready",mn=(0,x.useCallback)((c,m,w,R)=>{M.open(c,m,w,R)},[M]),tt=(0,x.useCallback)(c=>{let m=c??M.snapshot().active??void 0;if(m===void 0)return;if((p===void 0?void 0:l?.peek(p,m))?.dirty===!0){Re(null),fe({path:m});return}fe(null),Re(null),p!==void 0&&l?.forget(p,m),M.close(m)},[l,p,M]),ei=(0,x.useCallback)(()=>{let c=ce;if(c===null)return;let m=p===void 0?void 0:l?.find(p,c.path);if(m===void 0){fe(null),p!==void 0&&l?.forget(p,c.path),M.close(c.path);return}ve(!0),Re(null),m.save().then(w=>{if(ve(!1),!w.ok){let R=m.getSnapshot().error;Re(t("panel.confirm.failed").replace("{message}",Jt(w.code,R?.message??"",t)));return}fe(null),p!==void 0&&l?.forget(p,c.path),M.close(c.path)})},[l,ce,p,M,t]),ni=(0,x.useCallback)(()=>{let c=ce;fe(null),Re(null),c!==null&&(p!==void 0&&l?.forget(p,c.path),M.close(c.path))},[l,ce,p,M]),rt=(0,x.useCallback)(()=>{fe(null),Re(null)},[]),me=(0,x.useCallback)(async(c,m,w)=>{ue.current.get(c)?.abort();let R=new AbortController;ue.current.set(c,R),k(_=>new Map(_).set(c,ks()));try{let _=await w.list(m,kn(c),R.signal);if(R.signal.aborted||v.current!==m)return!1;let j=Hn(_);if(!j.ok)return k(Ee=>new Map(Ee).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:j.message})),!1;let ye=bn(j.listing.entries);return k(Ee=>new Map(Ee).set(c,{status:"ready",nodes:ye,truncated:j.listing.truncated===!0,total:j.listing.entries.length})),!0}catch(_){return R.signal.aborted||k(j=>new Map(j).set(c,{status:"failed",nodes:[],truncated:!1,total:0,message:ho(_)})),!1}finally{ue.current.get(c)===R&&ue.current.delete(c)}},[]);(0,x.useEffect)(()=>{for(let c of ue.current.values())c.abort();return ue.current.clear(),k(new Map),le(new Set),Je.current=void 0,p!==void 0&&h!==void 0&&me("",p,h),()=>{for(let c of ue.current.values())c.abort();ue.current.clear()}},[p,h,Ze,me]),(0,x.useEffect)(()=>{if(p===void 0||N===void 0){V(void 0),oe(void 0),U(void 0);return}let c=!0,m=new AbortController;return V(void 0),oe(void 0),U(void 0),Promise.resolve().then(()=>N.snapshot({sessionId:p,maxCommits:1},m.signal)).then(w=>{if(!c)return;let R=$n(w);if(!R.ok){V(void 0),oe(void 0),U(void 0);return}V(Sr(gn(R.status),R.stats)),oe(R.head),U(R.root)}).catch(()=>{c&&(V(void 0),oe(void 0),U(void 0))}),()=>{c=!1,m.abort()}},[p,N,Ze]),(0,x.useEffect)(()=>{let c=h?.read;if(p===void 0||h===void 0||typeof c!="function"||!pn){O(Vo);return}let m=p,w=new AbortController,R=async(j,ye)=>{try{let Ee=Cs(await c.call(h,m,ye,{},w.signal));return Ee===void 0?void 0:[j,Ee]}catch{return}},_=Er.filter(j=>j!==".gitmodules").map(j=>R(j,j));return J!==void 0&&_.push(R(".gitmodules",`${J.replace(/\/+$/u,"")}/.gitmodules`)),Promise.all(_).then(j=>{if(w.signal.aborted||v.current!==m)return;let ye=new Map;for(let je of j)je!==void 0&&ye.set(je[0],je[1]);let Ee=K.current.get(""),hi=new Set(Ee?.status==="ready"?Ee.nodes.filter(je=>je.kind==="directory").map(je=>je.name):[]);O(hn(ye,hi))}),()=>w.abort()},[p,h,pn,J,Ze]),(0,x.useEffect)(()=>{let c=y.viewRequest;if(c==null||c.view!==Q)return;let m=`${c.view}:${c.focus}`;Je.current!==m&&(Je.current=m,an(c.focus,{open:mn}),y.completeViewRequest?.())},[y.viewRequest,y.completeViewRequest,mn]),(0,x.useEffect)(()=>{let c=e.viewFocus;if(c===void 0||p===void 0)return;let m=()=>{let w=c.take(Q);w!==void 0&&an(w,{open:mn})};return m(),c.subscribe(m)},[e,p,mn]),(0,x.useEffect)(()=>{if(Se===void 0||Oe!==void 0||!pn||Sn(Se))return;let c=Mr(Se);if(c.length===0||(le(w=>c.every(R=>w.has(R))?w:new Set([...w,...c])),p===void 0||h===void 0))return;let m=c.filter(w=>K.current.get(w)?.status!=="ready");m.length!==0&&Promise.all(m.map(w=>me(w,p,h)))},[Se,Oe,pn,p,h,me]);let sr=(0,x.useCallback)(()=>{if(typeof document>"u")return!1;let c=document.querySelector("[data-composer-input]");return c===null?!1:(c.focus(),!0)},[]),ti=(0,x.useCallback)(c=>{if(c.button!==0||$e.current!==null||Rs())return;let m=pe.current?.previousElementSibling;if(m instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}$e.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:m.getBoundingClientRect().width,restWidth:G},document.body.classList.add("fx-pane-resizing")}},[G]),ri=(0,x.useCallback)(c=>{let m=$e.current;m===null||m.pointerId!==c.pointerId||ie(nr(m.baseWidth+c.clientX-m.startX))},[]),ot=(0,x.useCallback)(c=>{let m=$e.current;if(m===null||m.pointerId!==c.pointerId)return;$e.current=null,document.body.classList.remove("fx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let w=m.baseWidth+c.clientX-m.startX;if(Io(w,m.baseWidth)){ie(m.restWidth);return}ie(Gn(E,w))},[E]),it=(0,x.useCallback)(()=>{Lo(E),ie(null)},[E]),oi=(0,x.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let m=Do(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(m===null)return;if(c.preventDefault(),c.stopPropagation(),m.kind==="reset"){it();return}if(m.kind==="min"||m.kind==="max"){let _=m.kind==="min"?180:520;ie(Gn(E,_));return}let w=pe.current?.previousElementSibling,R=w instanceof HTMLElement?w.getBoundingClientRect().width:G??180;ie(Gn(E,R+m.delta))},[E,it,G]);(0,x.useEffect)(()=>()=>{$e.current!==null&&document.body.classList.remove("fx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=m=>{if(!(m.isComposing||$r(m.target))){if(Ps(m)){let w=M.snapshot().active,R=w===null||l===void 0||p===void 0?void 0:l.find(p,w);if(R===void 0)return;m.preventDefault(),m.stopPropagation(),R.save();return}for(let w of Ln)if(Hr(m,w)){if(w.action==="closePanel"&&M.snapshot().active===null)return;m.preventDefault(),m.stopPropagation(),w.action==="nextPanel"?M.next():w.action==="previousPanel"?M.previous():tt();return}}};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[l,tt,p,M]),(0,x.useEffect)(()=>{if(typeof document>"u")return;let c=In({focusComposer:sr,hasModal:()=>Ce.current!==null||z.current||Mt(document)}),m=w=>c(w);return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[sr]),(0,x.useEffect)(()=>{if(ce===null||typeof document>"u")return;let c=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),m.stopPropagation(),rt())};return document.addEventListener("keydown",c,!0),()=>document.removeEventListener("keydown",c,!0)},[ce,rt]);let at=(0,x.useMemo)(()=>Pn(P,xe,B,H),[P,xe,B,H]),[ii,st]=(0,x.useState)(void 0),dr=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(dr.current||typeof document>"u")return;let c=Ir({rows:at,panelCount:M.snapshot().panels.length,hasModal:Mt(document)});c.kind!=="skip"&&(dr.current=!0,c.open!==void 0&&M.open(c.open),st({path:c.focus}))},[at,M]);let ai=(0,x.useCallback)(()=>st(void 0),[]),Qe=B===void 0?void 0:Object.keys(B).length,si=B===void 0?"neutral":Object.values(B).some(c=>c.status==="conflicted")?"conflict":Qe===0?"success":"warning",lr=kr(Y),di=(0,x.useCallback)(c=>{if(p===void 0||h===void 0)return;if(xe.has(c)){le(w=>{let R=new Set(w);return R.delete(c),R});return}le(w=>new Set(w).add(c));let m=P.get(c);(m===void 0||m.status==="failed")&&me(c,p,h)},[xe,P,p,h,me]),ur=(0,x.useCallback)(c=>{p===void 0||h===void 0||me(c,p,h)},[p,h,me]),Pe=(0,x.useCallback)((c,m)=>{de.current!==null&&clearTimeout(de.current),Ae({text:c,tone:m}),de.current=setTimeout(()=>{de.current=null,Ae(null)},4e3)},[]);(0,x.useEffect)(()=>()=>{de.current!==null&&clearTimeout(de.current)},[]),(0,x.useEffect)(()=>{if(L===void 0){De(void 0);return}let c=!0;return L.capabilities(p??"").then(m=>{c&&De(m.ok?m.capabilities:void 0)}),()=>{c=!1}},[L,p]);let li=(0,x.useCallback)((c,m,w)=>{let R=c===void 0?"":c.kind==="directory"?c.path:Co(c.path);if($({row:c,anchor:m,absolutePath:void 0,trigger:w,createParent:R}),c===void 0||L===void 0)return;let _=c.path;L.info(p??"",_).then(j=>{$(ye=>ye===null||ye.row?.path!==_?ye:{...ye,absolutePath:j.ok?j.info.absolutePath:void 0})})},[p,L]),ui=(0,x.useCallback)(()=>$(null),[]);z.current=I!==null;let dt=(0,x.useCallback)(c=>t("notice.revealFailed").replace("{reason}",t(`notice.reveal.${c.code}`)),[t]),ci=(0,x.useCallback)(c=>{let m=I;if($(null),m===null)return;if(c===ae.createFile||c===ae.createFolder){let R=m.createParent;if(R===void 0)return;g({kind:c===ae.createFolder?"directory":"file",parent:R,error:void 0,busy:!1});return}let w=m.row;if(w!==void 0){if(c===ae.copyRelative){Ye(w.path).then(R=>{Pe(t(R?"notice.copiedRelative":"notice.copyFailed"),R?"ok":"error")});return}if(c===ae.copyAbsolute){let R=m.absolutePath;if(R===void 0)return;Ye(R).then(_=>{Pe(t(_?"notice.copiedAbsolute":"notice.copyFailed"),_?"ok":"error")});return}if(c===ae.reveal){if(L===void 0){Pe(dt({code:"unsupported",message:""}),"error");return}L.reveal(p??"",w.path).then(R=>{if(!R.ok){Pe(dt(R.error),"error");return}let _=t(`menu.manager.${re?.fileManager??"directory"}`);Pe(t("notice.revealed").replace("{manager}",_),"ok")})}}},[Pe,re,I,dt,p,t,L]),fi=(0,x.useCallback)(c=>{let m=ne;if(m===null)return;if(L===void 0||L.create===void 0){g({...m,error:t("prompt.error.unsupported"),busy:!1});return}let w=p;if(w===void 0){g({...m,error:t("prompt.error.no-workspace"),busy:!1});return}g({...m,busy:!0,error:void 0}),L.create(w,m.parent,c,m.kind).then(R=>{if(!R.ok){g(j=>j===null?j:{...j,busy:!1,error:t(`prompt.error.${R.error.code}`)});return}g(null);let _=R.path;if(h!==void 0&&me(m.parent,w,h),m.kind==="file"){M.open(_),Pe(t("notice.createdFile"),"ok");return}le(j=>new Set(j).add(_)),h!==void 0&&me(_,w,h),st({path:_}),Pe(t("notice.createdFolder"),"ok")})},[Pe,h,me,ne,p,M,t,L]),pi=(0,x.useCallback)(()=>g(null),[]),mi=(0,x.useMemo)(()=>I===null?[]:Po({row:I.row,notices:{workspace:L!==void 0},capabilities:re,absolutePath:I.absolutePath,createParent:I.createParent},t),[re,I,t,L]),yi=()=>le(new Set),gi=()=>et(c=>c+1),xi=p===void 0?"no-session":h===void 0?"no-service":q===void 0||q.status==="loading"?"loading":q.status==="failed"?"failed":q.nodes.length===0?"empty":"tree";return(0,S.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":xi,"data-session":p??"","data-testid":"fs-explorer-view",children:[(0,S.jsxs)("header",{className:"fx-head",children:[(0,S.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,S.jsx)(tr,{open:!0})}),(0,S.jsx)("h2",{className:"fx-title",children:t("view.title")}),(0,S.jsx)("span",{className:"fx-scope",children:t("view.scope")}),(0,S.jsxs)("div",{className:"fx-head-meta",children:[q?.status==="ready"?(0,S.jsxs)("span",{children:[(0,S.jsx)("b",{children:q.nodes.length})," ",t("head.entries")]}):null,(0,S.jsx)("button",{type:"button",className:"fx-btn",title:t("head.collapseAll"),"aria-label":t("head.collapseAll"),disabled:xe.size===0,onClick:yi,children:(0,S.jsx)(Bo,{})}),(0,S.jsx)("button",{type:"button",className:"fx-btn",title:t("head.refresh"),"aria-label":t("head.refresh"),disabled:p===void 0||h===void 0||q?.status==="loading",onClick:gi,children:(0,S.jsx)(_o,{})})]})]}),We===null?null:(0,S.jsx)("div",{className:"fx-notice",role:"status","data-tone":We.tone,"data-testid":"fx-notice",children:We.text}),(0,S.jsx)("div",{className:"fx-main",children:p===void 0?(0,S.jsx)(Xn,{title:t("state.noSession.title"),description:t("state.noSession.description"),testId:"fs-no-session"}):h===void 0?(0,S.jsx)(Xn,{title:t("state.noService.title"),description:t("state.noService.description"),testId:"fs-no-service"}):q===void 0||q.status==="loading"?(0,S.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,S.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),t("state.loading")]}):q.status==="failed"?(0,S.jsx)(Xn,{title:t("state.failed.title"),description:q.message??t("state.failed.description"),actionLabel:t("action.retry"),onAction:()=>ur(""),testId:"fs-failed"}):q.nodes.length===0?(0,S.jsx)(Xn,{title:t("state.emptyWorkspace.title"),description:t("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("div",{className:"fx-tree-pane",style:G===null?void 0:{"--fx-tree-width":`${G}px`},children:(0,S.jsx)(Ko,{rows:at,selectedPath:Oe===void 0?Se:void 0,entryFocus:ii,t,onToggle:di,onSelect:c=>M.open(c),onRetry:ur,onEntryFocusSettled:ai,onContextMenu:li})}),(0,S.jsx)("div",{ref:pe,className:"fx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":t("pane.resize"),"aria-valuemin":180,"aria-valuemax":520,"aria-valuenow":G??void 0,title:t("pane.resizeHint"),tabIndex:0,"data-testid":"fs-pane-handle",onPointerDown:ti,onPointerMove:ri,onPointerUp:ot,onPointerCancel:ot,onLostPointerCapture:ot,onKeyDown:oi,onDoubleClick:it}),(0,S.jsxs)("div",{className:"fx-editor",children:[(0,S.jsx)(qr,{panels:he.panels,active:he.active,t,onActivate:c=>M.activate(c),onClose:tt,onStep:c=>c===1?M.next():M.previous(),documents:l,sessionId:p}),ce===null?null:(0,S.jsx)(Ur,{name:An(ce.path),t,saving:nt,error:He,onSave:ei,onDiscard:ni,onCancel:rt}),(0,S.jsx)("div",{className:"fx-editor-body",children:he.panels.length===0?(0,S.jsx)(Xr,{t}):he.panels.map((c,m)=>{let w=c.key===he.active;return(0,S.jsx)("div",{className:"fx-panel",id:`fx-panel-${m}`,role:"tabpanel","aria-labelledby":`fx-tab-${m}`,hidden:!w,"data-line":c.line,"data-testid":"fs-panel",children:(0,S.jsx)(ko,{sessionId:p,files:h,path:c.path,revision:c.revision,git:T,t,visible:w,renderers:a,documents:l,locate:A})},c.key)})})]})]})}),I===null?null:(0,S.jsx)(To,{entries:mi,anchor:I.anchor,onSelect:ci,onClose:ui,...I.trigger===void 0?{}:{returnFocus:()=>I.trigger??null}}),ne===null?null:(0,S.jsx)(Fo,{kind:ne.kind,parent:ne.parent,t,error:ne.error,busy:ne.busy,onSubmit:fi,onCancel:pi}),q?.status==="ready"?(0,S.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,S.jsxs)("span",{children:[t("view.scope")," ",(0,S.jsx)("b",{children:q.nodes.length})," ",t("head.entries")]}),q.truncated?(0,S.jsx)("span",{className:"fx-foot-warn",children:on({entries:q.nodes,truncated:!0,total:q.total}).label}):null,(0,S.jsxs)("span",{className:"fx-foot-git","data-state":Qe===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,S.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":si,"aria-hidden":"true"}),Qe===void 0?t("status.unavailable"):Qe===0?t("status.clean"):t("status.summary").replace("{count}",String(Qe))]}),lr===null?null:(0,S.jsxs)("span",{className:"fx-foot-branch","data-testid":"fs-branch",title:t("foot.branch"),children:[lr,Y?.upstream!==void 0&&(Y.ahead??0)>0?(0,S.jsx)("span",{className:"fx-foot-ahead",children:`\u2191${String(Y.ahead)}`}):null,Y?.upstream!==void 0&&(Y.behind??0)>0?(0,S.jsx)("span",{className:"fx-foot-behind",children:`\u2193${String(Y.behind)}`}):null]}),(0,S.jsx)("span",{className:"fx-spacer"}),(0,S.jsx)("span",{children:t("foot.order")})]}):null]})}return f}var Xo=["slots","locale","workbench","remote"];function Ts(e){let n=e.locale.getSnapshot?.();return typeof n?.active=="string"?n.active:"en"}var Yn,Zn,ir,Jn,ar,Yo;function Uo(e){return ar=e,Jn!==void 0||(Jn=Kr({open:(n,t,r)=>{let o=ar;return o===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):_r(o)(n,t,r)},save:(n,t)=>{let r=ar;return r===void 0?Promise.resolve({ok:!1,code:"unavailable",message:"the client context is gone"}):Br(r)(n,t)}})),Jn}function Fs(){if(ir!==void 0)return ir;let e=Bn({warn:n=>Yo?.(n)});for(let n of Qt())e.register(n);return ir=e,e}var Qn;function Zo(e){let n=e.workbench;if(n==null)return()=>{};Yo=s=>e.logger?.warn?.(s);let t=Fs(),r={version:ao,renderers:t,registerRenderer:s=>t.register(s),documents:Uo(e)};Zn?.();let o=e.provide?.($t,r);o===void 0&&e.logger?.warn?.(`${tn}: ctx.provide unavailable, ${$t} service not registered`),Zn=o,Yn?.();let i=e.locale.register(tn,{zh:{...St,...Lt.zh,...Zt.zh},en:{...Rt,...Lt.en,...Zt.en}});Yn=i;let a=e.locale.bind(tn),l=Ro(typeof document>"u"?void 0:document),u=qo({workbench:n,version:n.version,t:a,files:po(e),status:vo(e),git:go(e),renderers:t,documents:Uo(e),locate:s=>zr(e,s),workspace:()=>$o(e)});Qn?.();let d=kt(e,n);return Qn=d,e.slots.inject(ut,()=>e.slots.register({name:ut,id:Q,order:100,label:()=>Ct(Ts(e)),locale:tn},u)),()=>{o?.(),Zn===o&&(Zn=void 0),d(),Qn===d&&(Qn=void 0),l(),i(),Yn===i&&(Yn=void 0)}}var Jo={buildTree:bn,describeListing:on,iconFor:Ge,computeTreeWindow:wn,flattenTree:Pn,badgeFor:Ve,formatSize:En,joinPath:Rn,listingPath:kn,parseFocus:Cn,consumeViewRequest:an,createPanelStack:Nt,createEscapeHandler:In,KEYMAP:Ln,tabLabel:Ct,normalizeListing:Hn,normalizeStatusSnapshot:$n,buildWorkspaceMap:hn,workspaceTagFor:vn,parseStatusZ:gn,statusTone:rn,statusBadge:xn,createPreviewLoader:On,renderMarkdown:Wn,languageFor:ln,isMarkdownFile:un,describePage:jn,classifyPreviewFailure:Be,normalizePreviewPage:Xe,previewChunkRoute:to,canBridgeFile:Tn,decideBridge:bt,focusForFileAddress:vt,forwardFocus:wt,registerAddressBridge:kt},Qo={name:"dsh-fs-explorer",inject:Xo,apply:Zo,__test:Jo};function Ms(e){io(e),no(e)}var Ns=Qo;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
