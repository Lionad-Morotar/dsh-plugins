window.__ModuleLoader__.load({
  id: "dsh-fs-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Xe=Object.defineProperty;var Cn=Object.getOwnPropertyDescriptor;var Fn=Object.getOwnPropertyNames;var Tn=Object.prototype.hasOwnProperty;var En=(e,t)=>{for(var n in t)Xe(e,n,{get:t[n],enumerable:!0})},Ln=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Fn(t))!Tn.call(e,o)&&o!==n&&Xe(e,o,{get:()=>t[o],enumerable:!(r=Cn(t,o))||r.enumerable});return e};var Nn=e=>Ln(Xe({},"__esModule",{value:!0}),e);var Ar={};En(Ar,{__test:()=>bn,apply:()=>wn,boot:()=>Jt,clientPlugin:()=>kn,default:()=>jr,inject:()=>vn});module.exports=Nn(Ar);var de=require("react");var Pt="dsh-resource://file/";function Ct(e){try{return decodeURIComponent(e)}catch{return e}}function ce(e){if(!e.startsWith(Pt))return null;let t=e.slice(Pt.length);if(!t.startsWith("session/"))return null;let n=t.slice(8),r=n.indexOf("/");if(r<=0)return null;let o=Ct(n.slice(0,r)),i=n.slice(r+1),l=i.search(/[?#]/u),c=l<0?i:i.slice(0,l);return c.length===0?null:{sessionId:o,path:c.split("/").map(Ct).join("/")}}function G(e){return e.slice(e.lastIndexOf("/")+1)}var Ft=[{family:"scene3d",extensions:["glb","gltf","obj","stl","3mf"],titleKey:"scene3d.title"},{family:"raster",extensions:["tif","tiff","avif"],titleKey:"raster.title"},{family:"cad",extensions:["dxf"],titleKey:"cad.title"}];function Tt(){return Ft.flatMap(e=>[...e.extensions])}function Ye(e){let t=e.slice(e.lastIndexOf("/")+1),n=t.lastIndexOf(".");if(n<=0)return null;let r=t.slice(n+1).toLowerCase();return Ft.find(o=>o.extensions.includes(r))?.family??null}var $="dsh-fs-explorer",Ze="conversation.view",z="fs-explorer";var be="fs-explorer",Et="\u76EE\u5F55\u8FC7\u5927\uFF0C\u4EC5\u663E\u793A\u524D",Je={chunk:"client.preview.js"},Lt={scene3d:"client.scene3d.js",raster:"client.raster.js",cad:"client.cad.js"};var In={modified:"warning",added:"success",deleted:"danger",renamed:"accent",untracked:"info",conflicted:"conflict"},Mn={modified:"M",added:"A",deleted:"D",renamed:"R",untracked:"U",conflicted:"!"},jn=new Set(["modified","added","deleted","renamed","untracked","conflicted"]);function It(e){return typeof e=="string"&&jn.has(e)}function Nt(e,t){let n=[],r=0;for(let o=0;o<t;o+=1){let i=e.indexOf(" ",r);if(i<0)return null;n.push(e.slice(r,i)),r=i+1}return{fields:n,rest:e.slice(r)}}function An(e,t){return e==="D"||t==="D"?"deleted":e==="A"||t==="A"?"added":e==="R"||t==="R"||e==="C"||t==="C"?"renamed":e==="U"||t==="U"?"conflicted":"modified"}function ke(e){let t={};if(typeof e!="string"||e==="")return t;let n=e.split("\0");for(let r=0;r<n.length;r+=1){let o=n[r];if(o===void 0||o===""||o.startsWith("# "))continue;let i=o[0];if(i==="?"){if(o[1]!==" ")continue;let l=o.slice(2);l!==""&&(t[l]={status:"untracked"});continue}if(i!=="!"){if(i==="1"||i==="2"){let l=Nt(o.slice(2),i==="1"?7:8);if(l===null)continue;let c=l.fields[0]??"",a=l.rest;if(a===""||c.length<2)continue;if(i==="2"){let d=n[r+1];if(d===void 0||d==="")continue;r+=1,t[a]={status:"renamed"};continue}t[a]={status:An(c[0]??".",c[1]??".")};continue}if(i==="u"){let l=Nt(o.slice(2),9);if(l===null)continue;let c=l.rest;if(c==="")continue;t[c]={status:"conflicted"}}}}return t}function ue(e){return It(e)?In[e]:"neutral"}function Se(e){return It(e)?Mn[e]:"?"}function Qe(e){return`status.${e}`}function Mt(e,t){if(t===void 0||e==="")return;let n=t[e];return n!==void 0?n.status:t[`${e.replace(/\/+$/u,"")}/`]?.status}var zn=["conflicted","deleted","renamed","added","modified","untracked"];function Dn(e){return ue(zn.find(t=>e.has(t))??"modified")}function jt(e){let t=new Map;if(e!==void 0)for(let[r,o]of Object.entries(e)){let i=r.replace(/\/+$/u,"");if(i==="")continue;let l=i.split("/"),c=r.endsWith("/")?l.length:l.length-1,a="";for(let d=0;d<c;d+=1){let s=l[d];if(s===void 0||s==="")continue;a=a===""?s:`${a}/${s}`;let p=t.get(a);p===void 0?t.set(a,{count:1,present:new Set([o.status])}):(p.count+=1,p.present.add(o.status))}}let n=new Map;for(let[r,o]of t)n.set(r,{count:o.count,tone:Dn(o.present)});return n}var On=new Set(["node_modules",".git","dist","__pycache__"]);function Bn(e){return On.has(e)}function Wn(e){return e.kind==="directory"||e.type==="directory"?"directory":"file"}function Re(e){let t=[];for(let n of e){let r=typeof n?.name=="string"?n.name:"";if(r===""||Bn(r))continue;let o=Wn(n),i=typeof n.size=="number"&&Number.isFinite(n.size)?n.size:void 0;t.push(i===void 0?{name:r,kind:o}:{name:r,kind:o,size:i})}return t.sort((n,r)=>n.kind!==r.kind?n.kind==="directory"?-1:1:n.name.localeCompare(r.name,void 0,{numeric:!0,sensitivity:"base"})),t}var _n=new Set(["ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","sh","bash","zsh","fish","ps1","bat","cmd","lua","r","sql","graphql","gql","proto","asm","s","wat","wasm","dart","ex","exs"]),Kn=new Set(["md","mdx","markdown","mdown","rst","adoc"]),Vn=new Set(["json","jsonc","json5","yaml","yml","toml","xml","csv","tsv","ndjson","sqlite","db","parquet","avro","lock","map"]),$n=new Set(["png","jpg","jpeg","gif","webp","avif","svg","bmp","ico","tif","tiff","psd","heic","heif","raw","exr","hdr"]),Hn=new Set(["css","scss","sass","less","styl","stylus","pcss","postcss","tailwind"]),qn=new Set(["zip","tar","gz","tgz","bz2","xz","7z","rar","jar","war","dmg","iso","zst"]),Gn=new Set(["dockerfile","docker-compose.yml","docker-compose.yaml","makefile","cmakelists.txt","package.json","pnpm-workspace.yaml","tsconfig.json","jsconfig.json",".gitignore",".gitattributes",".gitmodules",".npmrc",".nvmrc",".editorconfig",".prettierrc",".eslintrc",".eslintignore",".prettierignore",".browserslistrc","vercel.json","netlify.toml","turbo.json","nx.json","lerna.json","biome.json","cargo.toml","go.mod","go.sum","requirements.txt","pyproject.toml","gemfile","rakefile"]);function zt(e){let t=G(e.toLowerCase()),n=t.lastIndexOf(".");return n<=0?"":t.slice(n+1)}function ae(e,t="file"){if(t==="directory")return"folder";let n=G(e.toLowerCase());if(Gn.has(n)||n.startsWith(".env"))return"config";if(n==="readme"||n==="changelog"||n==="license")return"markdown";let r=zt(n);return r===""?"file":_n.has(r)?"code":Kn.has(r)?"markdown":Vn.has(r)?"data":$n.has(r)?"image":Hn.has(r)?"style":qn.has(r)?"archive":"file"}var Un={dockerfile:"DK",makefile:"MK","package.json":"PKG","pnpm-workspace.yaml":"PNPM","tsconfig.json":"TS","jsconfig.json":"JS",".gitignore":"GIT",".gitattributes":"GIT",".npmrc":"NPM",".env":"ENV","readme.md":"MD",license:"LIC"},Xn={json:"{}",jsonc:"{}",json5:"{}",yaml:"{}",yml:"{}",toml:"{}",xml:"<>",csv:"CSV",ts:"TS",tsx:"TSX",js:"JS",jsx:"JSX",mjs:"JS",cjs:"JS",md:"MD",mdx:"MD",png:"IMG",jpg:"IMG",jpeg:"IMG",gif:"IMG",webp:"IMG",svg:"SVG",css:"#",scss:"#",sass:"#",less:"#",zip:"ZIP",tar:"TAR",gz:"GZ",py:"PY",rs:"RS",go:"GO",sh:"SH"};function se(e){let t=G(e.toLowerCase()),n=Un[t];if(n!==void 0)return n;let r=zt(t),o=Xn[r];return o!==void 0?o:r!==""?r.slice(0,3).toUpperCase():(t.replace(/[^A-Za-z0-9]/gu,"").slice(0,2)||"?").toUpperCase()}function fe(e){let t=Array.isArray(e.entries)?e.entries.length:0,n=e.truncated===!0,r=typeof e.total=="number"&&Number.isFinite(e.total)&&e.total>t?Math.trunc(e.total):t;return n?{truncated:!0,label:`${Et} ${String(t)} \u9879`,total:r}:{truncated:!1,label:`${String(t)} \u9879`,total:r}}function Pe(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),l=Math.max(0,e.length-i-o*2),c=Math.floor(Math.max(0,t.scrollTop)/n)-o,a=Math.min(Math.max(c,0),l),d=Math.min(e.length,a+i+o*2);return{rows:e.slice(a,d),startIndex:a,endIndex:d}}function Ce(e){return e===""?".":e}function Dt(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function pe(e,t){let n=e.replace(/\/+$/u,"");return n===""?t:`${n}/${t}`}function At(e){return e===void 0?1:Math.max(1,Number.parseInt(e,10))}function Fe(e){if(typeof e!="string")return;let t=e.trim(),n=/^abs:(.+?)(?::(\d+))?$/u.exec(t);if(n!==null){let l=(n[1]??"").replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");return l===""?void 0:{path:l,line:At(n[2]),absolute:!0}}let r=/^path:(.+?)(?::(\d+))?$/u.exec(t);if(r===null)return;let i=(r[1]??"").replace(/\\/gu,"/").replace(/^\.\//u,"").replace(/^\/+/u,"");if(i!=="")return{path:i,line:At(r[2]),absolute:!1}}function Te(e,t,n){let r=[],o=jt(n),i=(l,c)=>{let a=e.get(l);if(!(a===void 0||a.status!=="ready"))for(let d of a.nodes){let s=pe(l,d.name),p=d.kind==="directory",m=p&&t.has(s),w=p?void 0:Mt(s,n),b=p?o.get(s):void 0;if(r.push({type:"entry",path:s,name:d.name,kind:d.kind,depth:c,expanded:m,...d.size===void 0?{}:{size:d.size},...w===void 0?{}:{status:w},...b===void 0?{}:{statusCount:b.count,statusTone:b.tone}}),!m)continue;let v=e.get(s);if(v===void 0||v.status==="loading"){r.push({type:"status",key:`${s}:loading`,path:s,depth:c+1,state:"loading"});continue}if(v.status==="failed"){r.push({type:"status",key:`${s}:failed`,path:s,depth:c+1,state:"failed",message:v.message??"\u52A0\u8F7D\u5931\u8D25"});continue}if(v.nodes.length===0){r.push({type:"status",key:`${s}:empty`,path:s,depth:c+1,state:"empty"});continue}i(s,c+1),v.truncated&&r.push({type:"status",key:`${s}:truncated`,path:s,depth:c+1,state:"truncated",label:fe({entries:v.nodes,truncated:!0,total:v.total}).label})}};return i("",0),r}function Ee(e){if(!Number.isFinite(e)||e<0)return"";let t=["B","KB","MB","GB","TB"],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;let o=r===0||n>=10?0:1;return`${n.toFixed(o)} ${t[r]??"B"}`}var et="dsh-fs-explorer:bridge",Yn="fs-explorer-bridge",_t="dsh-resource://file/**",tt="sidebar.right.pane.tab",Zn=new Set(["md","markdown","mdx","mdown","rst","adoc","txt","text","log","json","jsonc","json5","jsonl","ndjson","yml","yaml","toml","xml","csv","tsv","ts","tsx","mts","cts","js","jsx","mjs","cjs","vue","svelte","astro","py","pyi","rb","go","rs","java","kt","kts","scala","clj","cljs","c","cc","cpp","cxx","h","hh","hpp","cs","fs","fsx","php","swift","m","mm","lua","r","pl","sql","graphql","gql","proto","sh","bash","zsh","fish","ps1","bat","cmd","css","scss","sass","less","styl","html","htm","svg","ini","cfg","conf","env","properties","gitignore","gitattributes","gitmodules","npmrc","nvmrc","editorconfig","prettierrc","eslintrc","browserslistrc","lock","diff","patch"]),Jn=new Set(["pdf","docx","pptx","xlsx","xls","fods","csv","tsv","png","jpg","jpeg","gif","webp","svg","bmp","ico","doc","ppt"]),Qn=new Set(["makefile","dockerfile","license","readme","changelog"]),er=new Set([...Tt(),...Zn]);function tr(e){let t=e.lastIndexOf(".");return t<0?"":e.slice(t+1).toLowerCase()}function Le(e){if(typeof e!="string"||e==="")return!1;let t=G(e).toLowerCase();if(t==="")return!1;let n=tr(t);return Jn.has(n)?!1:Qn.has(t)?!0:er.has(n)}function nr(e){let t=e.search(/[?#]/u);if(t<0)return;let n=/[?&#]line=(\d+)/u.exec(e.slice(t));if(n!==null)return Math.max(1,Number.parseInt(n[1]??"",10))}function rr(e,t){for(let n of[e,t])if(typeof n=="number"&&Number.isFinite(n)&&n>=1)return Math.trunc(n);return 1}function ot(e,t){if(typeof e!="string")return;let n=ce(e);if(n===null)return;let r=n.path.replace(/\\/gu,"/");if(r==="")return;let o=rr(t,nr(e));return`${Dt(r)?"abs:":"path:"}${r}:${String(o)}`}function it(e,t,n){if(e===void 0||e==="")return{action:"keep",reason:"no-address"};let r=ce(e);if(r===null)return{action:"keep",reason:"not-a-file-address"};if(t===void 0)return{action:"keep",reason:"no-session"};if(r.sessionId!==t)return{action:"keep",reason:"other-session"};if(!Le(r.path))return{action:"keep",reason:"refused"};let o=ot(e,n);return o===void 0?{action:"keep",reason:"not-a-file-address"}:{action:"open",focus:o}}function U(e,t){t===void 0?console.warn(`[${$}] ${e}`):console.warn(`[${$}] ${e}`,t)}function or(e){console.debug(`[${$}] ${e}`)}function nt(e){return e!==null&&typeof e=="object"&&typeof e.register=="function"}function rt(e){return e!==null&&typeof e=="object"&&typeof e.close=="function"}function ee(e,t){try{let n=e();return t(n)?n:void 0}catch{return}}function Ot(e){return ee(()=>e.sidebarRightTabs,nt)??ee(()=>typeof e.get=="function"?e.get("sidebarRightTabs"):void 0,nt)}function Bt(e){return ee(()=>e.sidebarRight,rt)??ee(()=>typeof e.get=="function"?e.get("sidebarRight"):void 0,rt)}function Wt(e){return typeof e=="function"?e:()=>{}}var ir="dsh-resource://file/session/probe/src/main.ts";function ar(e){let t=ee(()=>(typeof e.candidates=="function"?e.candidates(ir):[]).filter(r=>r.priority==="extension"&&r.id!==et),n=>Array.isArray(n)&&n.length>0);t!==void 0&&U(`another extension-band tab type already claims ${_t}: ${t.map(n=>String(n.id)).join(", ")}; ranking falls back to registration order, so a file link may still land there`)}function sr(e){for(let t of[e?.contentId,e?.record?.contentId,e?.address])if(typeof t=="string"&&t!=="")return t}function dr(e){let t=e?.navigation?.params?.line;if(typeof t=="number"&&Number.isFinite(t)&&t>=1)return Math.trunc(t);if(typeof t=="string"&&/^\d+$/u.test(t))return Math.max(1,Number.parseInt(t,10))}function lr(e,t){let n=e.viewFocus;if(n?.request?.(z,t),typeof e.openViewOrSwitch=="function"){let r=e.openViewOrSwitch(z,t);return(!r.opened||r.focused)&&n?.take(z),r}return typeof e.openView=="function"&&e.openView(z,t)?(n?.take(z),{opened:!0,focused:!0}):(n?.take(z),{opened:!1,focused:!1})}function at(e,t,n,r){let o;try{o=lr(e,r)}catch(i){return U("the file workbench threw while switching views",i),e.viewFocus?.take(z),!1}if(!o.opened)return U(`the file workbench did not switch to ${z}; the tab stays as the reader's only route to the file`),!1;try{return t.close(n),!0}catch(i){return U("the forwarded tab could not be closed",i),!1}}function cr(e,t){function n({useTabInfo:r}){let i=r()?.tab,l=typeof i?.id=="string"&&i.id!==""?i.id:void 0,c=sr(i),a=dr(i),d=(0,de.useRef)(void 0);return(0,de.useEffect)(()=>{if(l===void 0){U("a forwarded tab arrived without an id; it cannot be closed after the switch");return}if(d.current===l)return;d.current=l;let s=it(c,e.currentSessionId(),a);if(s.action!=="open"){U(`left the forwarded tab standing (${s.reason})`,c);return}at(e,t,l,s.focus)},[l,c,a]),null}return function(o){return typeof o.useTabInfo!="function"?(U(`the host did not inject useTabInfo into ${tt}; the bridge cannot forward`),null):(0,de.createElement)(n,{useTabInfo:o.useTabInfo})}}function st(e,t){let n=(c,a)=>{if(c===void 0||a===void 0)return;ar(c);let d;try{d=c.register({id:et,kind:Yn,patterns:[_t],priority:"extension",canOpen:m=>{let w=ce(m);return w!==null&&Le(w.path)},title:m=>G(ce(m)?.path??m)||m})}catch(m){U("the sidebar right refused the address bridge tab type",m);return}let s=cr(t,a),p;try{p=Wt(e.slots.inject(tt,()=>e.slots.register({name:tt,key:et},s)))}catch(m){d(),U("the sidebar right refused the address bridge body",m);return}return()=>{p(),d()}},r=Ot(e),o=Bt(e);if(r!==void 0&&o!==void 0)return n(r,o)??(()=>{});let i=e.inject;if(typeof i!="function")return or("the right sidebar is not mounted, so the address bridge stays unregistered"),()=>{};let l=i.call(e,["sidebarRightTabs","sidebarRight"],c=>{let a=ee(()=>c.get?.("sidebarRightTabs"),nt)??Ot(c),d=ee(()=>c.get?.("sidebarRight"),rt)??Bt(c);return n(a,d)});return Wt(l)}var dt={"tab.label":"\u6587\u4EF6","view.title":"\u6587\u4EF6","view.scope":"\u5DE5\u4F5C\u533A","view.tree":"\u5DE5\u4F5C\u533A\u6587\u4EF6\u6811","head.refresh":"\u5237\u65B0","head.refresh.disabled":"\u8BFB\u53D6\u4E2D\uFF0C\u6682\u65F6\u65E0\u6CD5\u5237\u65B0","head.collapseAll":"\u5168\u90E8\u6298\u53E0","head.entries":"\u9879","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0C\u6587\u4EF6\u6811\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"\u6587\u4EF6\u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D workspaceFiles \u670D\u52A1\uFF0C\u6587\u4EF6\u6811\u65E0\u6CD5\u8BFB\u53D6\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u533A\u2026","state.failed.title":"\u65E0\u6CD5\u8BFB\u53D6\u5DE5\u4F5C\u533A","state.failed.description":"\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u540E\u91CD\u8BD5\u3002","state.emptyWorkspace.title":"\u5DE5\u4F5C\u533A\u4E3A\u7A7A","state.emptyWorkspace.description":"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u4EF6\u3002","state.emptyDirectory":"\u7A7A\u76EE\u5F55","state.loadingDirectory":"\u6B63\u5728\u8BFB\u53D6\u2026","state.failedDirectory":"\u52A0\u8F7D\u5931\u8D25","state.truncated":"\u5DF2\u622A\u65AD","action.retry":"\u91CD\u8BD5","foot.order":"\u76EE\u5F55\u4F18\u5148","foot.truncated":"\u5217\u8868\u5DF2\u622A\u65AD","panel.tabs":"\u6253\u5F00\u7684\u6587\u4EF6","panel.close":"\u5173\u95ED {name}","panel.empty.title":"\u6253\u5F00\u6587\u4EF6\u5F00\u59CB","panel.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u4F1A\u5728\u8FD9\u91CC\u6253\u5F00\u4E00\u4E2A\u6807\u7B7E\u9875\u3002","panel.empty.keys":"\u5207\u6362\u9762\u677F\uFF0C\u5173\u95ED\u5F53\u524D\u9762\u677F","key.nextPanel":"\u4E0B\u4E00\u4E2A\u9762\u677F","key.previousPanel":"\u4E0A\u4E00\u4E2A\u9762\u677F","key.closePanel":"\u5173\u95ED\u5F53\u524D\u9762\u677F","row.open":"\u5C55\u5F00\u76EE\u5F55","row.close":"\u6298\u53E0\u76EE\u5F55","row.file":"\u6587\u4EF6","row.directory":"\u76EE\u5F55","status.modified":"\u5DF2\u4FEE\u6539","status.added":"\u5DF2\u65B0\u589E","status.deleted":"\u5DF2\u5220\u9664","status.renamed":"\u5DF2\u91CD\u547D\u540D","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u6709\u51B2\u7A81","status.directoryChanges":"{count} \u4E2A\u53D8\u66F4","status.summary":"{count} \u4E2A\u53D8\u66F4","status.clean":"\u65E0\u53D8\u66F4","status.unavailable":"\u65E0\u72B6\u6001","preview.empty.title":"\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6","preview.empty.description":"\u4ECE\u5DE6\u4FA7\u6587\u4EF6\u6811\u9009\u62E9\u6587\u4EF6\uFF0C\u8FD9\u91CC\u4F1A\u5206\u9875\u9884\u89C8\u5185\u5BB9\u3002","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6\u2026","preview.range":"\u5F53\u524D\u9875\u8303\u56F4","preview.lines":"\u884C","preview.prev":"\u4E0A\u4E00\u9875","preview.next":"\u4E0B\u4E00\u9875","preview.copyPath":"\u590D\u5236\u8DEF\u5F84","preview.copied":"\u5DF2\u590D\u5236","preview.reading":"\u9605\u8BFB","preview.source":"\u6E90\u7801","preview.retry":"\u91CD\u8BD5","preview.deleted.title":"\u6587\u4EF6\u5DF2\u88AB\u5220\u9664","preview.deleted.description":"\u5B83\u53EF\u80FD\u5DF2\u88AB\u79FB\u8D70\u6216\u5220\u9664\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.denied.title":"\u6CA1\u6709\u8BFB\u53D6\u6743\u9650","preview.denied.description":"\u5F53\u524D\u4F1A\u8BDD\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u5DE5\u4F5C\u533A\u6743\u9650\u3002","preview.symlink.title":"\u7B26\u53F7\u94FE\u63A5\u4E0D\u53EF\u8BFB","preview.symlink.description":"\u8FD9\u4E2A\u6587\u4EF6\u662F\u7B26\u53F7\u94FE\u63A5\uFF0C\u9884\u89C8\u53EA\u8BFB\u53D6\u5E38\u89C4\u6587\u4EF6\u3002","preview.binary.title":"\u4E0D\u662F\u6587\u672C\u6587\u4EF6","preview.binary.description":"\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u662F UTF-8 \u6587\u672C\uFF0C\u65E0\u6CD5\u5728\u9884\u89C8\u4E2D\u663E\u793A\u3002","preview.tooLarge.title":"\u8FD9\u4E00\u9875\u8D85\u51FA\u5927\u5C0F\u4E0A\u9650","preview.tooLarge.description":"\u6587\u4EF6\u7684\u4E00\u9875\u8D85\u8FC7\u4E86\u670D\u52A1\u7AEF\u7684\u5B57\u8282\u4E0A\u9650\uFF0C\u6682\u65F6\u65E0\u6CD5\u9884\u89C8\u3002","preview.unavailable.title":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.unavailable.description":"\u5F53\u524D\u90E8\u7F72\u7684 workspaceFiles \u670D\u52A1\u6CA1\u6709\u63D0\u4F9B\u8BFB\u53D6\u80FD\u529B\u3002","preview.unknown.title":"\u65E0\u6CD5\u9884\u89C8\u8FD9\u4E2A\u6587\u4EF6","preview.unknown.description":"\u8BFB\u53D6\u6587\u4EF6\u65F6\u51FA\u9519\uFF0C\u53EF\u4EE5\u91CD\u8BD5\u6216\u9009\u62E9\u5176\u5B83\u6587\u4EF6\u3002","preview.surface.state.loading":"\u6B63\u5728\u8BFB\u53D6\u2026","preview.surface.state.decoding":"\u6B63\u5728\u89E3\u7801\u2026","preview.surface.state.failed":"\u65E0\u6CD5\u9884\u89C8\u8BE5\u6587\u4EF6","preview.surface.state.retry":"\u91CD\u8BD5","preview.surface.state.unsupported":"\u8BE5\u683C\u5F0F\u6682\u4E0D\u652F\u6301","preview.surface.raster.title":"\u56FE\u7247","preview.surface.raster.noPages":"\u8FD9\u4E2A\u6587\u4EF6\u91CC\u6CA1\u6709\u9875\u9762","preview.surface.raster.pageMissing":"\u8FD9\u4E00\u9875\u5728\u6587\u4EF6\u91CC\u627E\u4E0D\u5230","preview.surface.raster.emptyPage":"\u8FD9\u4E00\u9875\u6CA1\u6709\u50CF\u7D20","preview.surface.raster.page":"\u7B2C {current} / {total} \u9875","preview.surface.raster.previous":"\u4E0A\u4E00\u9875","preview.surface.raster.next":"\u4E0B\u4E00\u9875","preview.surface.scene3d.reset":"\u91CD\u7F6E\u89C6\u89D2","preview.surface.scene3d.wireframe":"\u7EBF\u6846","preview.surface.scene3d.facts":"\u7F51\u683C\u6570 {meshes} \xB7 \u4E09\u89D2\u9762 {triangles}","preview.surface.cad.fit":"\u9002\u5E94\u7A97\u53E3","preview.surface.cad.layers":"\u56FE\u5C42 {count}"},lt={"tab.label":"Files","view.title":"Files","view.scope":"Workspace","view.tree":"Workspace file tree","head.refresh":"Refresh","head.refresh.disabled":"Reading, refresh unavailable","head.collapseAll":"Collapse all","head.entries":"items","state.noSession.title":"Select a conversation first","state.noSession.description":"The file tree opens here once a conversation is selected.","state.noService.title":"File service unavailable","state.noService.description":"This deployment has not mounted the workspaceFiles service, so the tree cannot read the workspace.","state.loading":"Reading the workspace\u2026","state.failed.title":"Cannot read the workspace","state.failed.description":"Check the workspace permissions and retry.","state.emptyWorkspace.title":"This workspace is empty","state.emptyWorkspace.description":"There are no files to show yet.","state.emptyDirectory":"Empty directory","state.loadingDirectory":"Reading\u2026","state.failedDirectory":"Failed to load","state.truncated":"Truncated","action.retry":"Retry","foot.order":"Folders first","foot.truncated":"Listing truncated","panel.tabs":"Open files","panel.close":"Close {name}","panel.empty.title":"Open a file to start","panel.empty.description":"Pick a file in the tree; each one opens as a tab here.","panel.empty.keys":"switch panels, close the current panel","key.nextPanel":"Next panel","key.previousPanel":"Previous panel","key.closePanel":"Close panel","row.open":"Expand directory","row.close":"Collapse directory","row.file":"File","row.directory":"Directory","status.modified":"Modified","status.added":"Added","status.deleted":"Deleted","status.renamed":"Renamed","status.untracked":"Untracked","status.conflicted":"Conflicted","status.directoryChanges":"{count} changes","status.summary":"{count} changes","status.clean":"No changes","status.unavailable":"No status","preview.empty.title":"Select a file","preview.empty.description":"Pick a file in the tree and its pages will preview here.","preview.loading":"Reading the file\u2026","preview.range":"Current page range","preview.lines":"lines","preview.prev":"Previous","preview.next":"Next","preview.copyPath":"Copy path","preview.copied":"Copied","preview.reading":"Reading","preview.source":"Source","preview.retry":"Retry","preview.deleted.title":"File was deleted","preview.deleted.description":"It may have been moved or removed. Retry or pick another file.","preview.denied.title":"No read permission","preview.denied.description":"This session cannot read that file. Check the workspace permissions.","preview.symlink.title":"Symlink cannot be read","preview.symlink.description":"This path is a symlink; the preview only reads regular files.","preview.binary.title":"Not a text file","preview.binary.description":"This file is not UTF-8 text and cannot be shown in the preview.","preview.tooLarge.title":"This page exceeds the size cap","preview.tooLarge.description":"One page of this file is over the server's byte cap, so it cannot be previewed yet.","preview.unavailable.title":"Preview unavailable","preview.unavailable.description":"This deployment's workspaceFiles service exposes no read method.","preview.unknown.title":"Cannot preview this file","preview.unknown.description":"Reading the file failed. Retry or pick another file.","preview.surface.state.loading":"Reading\u2026","preview.surface.state.decoding":"Decoding\u2026","preview.surface.state.failed":"This file cannot be previewed","preview.surface.state.retry":"Retry","preview.surface.state.unsupported":"This format is not supported yet","preview.surface.raster.title":"Image","preview.surface.raster.noPages":"This file has no pages","preview.surface.raster.pageMissing":"That page is not in this file","preview.surface.raster.emptyPage":"That page has no pixels","preview.surface.raster.page":"Page {current} of {total}","preview.surface.raster.previous":"Previous page","preview.surface.raster.next":"Next page","preview.surface.scene3d.reset":"Reset view","preview.surface.scene3d.wireframe":"Wireframe","preview.surface.scene3d.facts":"{meshes} meshes \xB7 {triangles} triangles","preview.surface.cad.fit":"Fit view","preview.surface.cad.layers":"{count} layers"};function ct(e){return(typeof e=="string"&&e.toLowerCase().startsWith("zh")?dt:lt)["tab.label"]??"Files"}var Ne=Object.freeze([{id:"fs.nextPanel",action:"nextPanel",code:"ArrowDown",modifiers:["primary","alt"],labelKey:"key.nextPanel",desktop:!0,web:!0},{id:"fs.previousPanel",action:"previousPanel",code:"ArrowUp",modifiers:["primary","alt"],labelKey:"key.previousPanel",desktop:!0,web:!0},{id:"fs.closePanel",action:"closePanel",code:"KeyW",modifiers:["control"],labelKey:"key.closePanel",desktop:!0,web:!1}]);function ur(){if(typeof navigator>"u")return"other";let e=typeof navigator.platform=="string"?navigator.platform:"",t=typeof navigator.userAgent=="string"?navigator.userAgent:"";return/mac|iphone|ipad|ipod/iu.test(e)||/mac os x|iphone|ipad/iu.test(t)?"mac":"other"}function Kt(e,t,n=ur()){if(e.isComposing===!0||e.code!==t.code)return!1;let r=t.modifiers,o=r.includes("meta")||r.includes("primary")&&n==="mac",i=r.includes("control")||r.includes("primary")&&n!=="mac",l=r.includes("alt"),c=r.includes("shift");return e.metaKey===!0===o&&e.ctrlKey===!0===i&&e.altKey===!0===l&&e.shiftKey===!0===c}function Vt(e){if(e===null||typeof e!="object")return!1;let t=e;if(t.isContentEditable===!0)return!0;if(typeof t.tagName!="string")return!1;let n=t.tagName.toLowerCase();return n==="input"||n==="textarea"||n==="select"}function fr(e){let t=e?.querySelector("[data-composer-input]");if(t==null||typeof t!="object")return!1;let n=t.focus;return typeof n!="function"?!1:(n.call(t),!0)}function $t(e){let t=e?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');return t!=null}function Ie(e){let t=e.doc??(typeof document>"u"?void 0:document);return n=>{if(n.key!=="Escape"||n.defaultPrevented===!0||n.isComposing===!0||e.hasModal())return;n.preventDefault(),e.focusComposer()!==!0&&fr(t),e.onClose?.()}}function Ht(e){let t=G(e);return t===""?e:t}function ut(e,t){if(typeof e!="string")return;let n=e.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,""),r=t?n:n.replace(/^\/+/u,"");return r===""?void 0:r}var pr=Object.freeze({panels:Object.freeze([]),active:null});function ft(){let e=[],t=null,n=pr,r=new Set,o=()=>{n=Object.freeze({panels:Object.freeze(e.slice()),active:t});for(let a of[...r])a()},i=a=>e.findIndex(d=>d.path===a),l=a=>{let d=ut(a,!0);if(d===void 0)return;if(i(d)>=0)return d;let s=ut(a,!1);if(!(s===void 0||s===d))return i(s)>=0?s:void 0},c=a=>{if(e.length===0)return;let d=t===null?-1:i(t),s=e[(d+a+e.length)%e.length];s===void 0||s.path===t||(t=s.path,o())};return{open(a,d=1,s=!1){let p=ut(a,s);if(p===void 0)return;let m=Number.isFinite(d)&&d>0?Math.trunc(d):1,w=i(p);if(w>=0){let v=e[w],W=v!==void 0&&(v.line!==m||v.absolute!==s);if(W&&(e=e.map((_,D)=>D===w?{path:p,line:m,absolute:s}:_)),t===p){W&&o();return}t=p,o();return}let b=t===null?e.length:i(t)+1;e=[...e.slice(0,b),{path:p,line:m,absolute:s},...e.slice(b)],t=p,o()},close(a){let d=a===void 0?t:l(a)??null;if(d===null)return;let s=i(d);s<0||(e=e.filter(p=>p.path!==d),t===d&&(t=(e[s]??e[s-1])?.path??null),o())},activate(a){let d=l(a);d===void 0||i(d)<0||t===d||(t=d,o())},next(){c(1)},previous(){c(-1)},reset(){e.length===0&&t===null||(e=[],t=null,o())},isOpen(a){let d=l(a);return d!==void 0&&i(d)>=0},activeEntry(){return e.find(a=>a.path===t)},snapshot:()=>n,subscribe(a){return r.add(a),()=>{r.delete(a)}}}}function qt(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o=ft();return e.set(n,o),o}}}function ge(e,t){let n=Fe(e);return n===void 0?!1:(t.open(n.path,n.line,n.absolute),!0)}var Gt=require("react");function I(e,t,...n){let r=n.filter(l=>l!=null&&l!==!1),o=(0,Gt.createElement)(e,t??void 0,...r);if(o!==null&&typeof o=="object")return o;let i={...t??{}};return r.length===1?i.children=r[0]:r.length>1&&(i.children=r),{type:e,props:i,key:null}}function gr(e){let t=e.trim();if(!(t===""||t.startsWith("//"))&&(/^(https?:|mailto:)/iu.test(t)||t.startsWith("/")||t.startsWith("#")||t.startsWith("./")||t.startsWith("../")))return t}var mr=/(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;function te(e){let t=[],n=0;for(let r of e.matchAll(mr)){let o=r.index??0;o>n&&t.push(e.slice(n,o));let i=r[0];if(i.startsWith("`"))t.push(I("code",null,i.slice(1,-1)));else if(i.startsWith("**")||i.startsWith("__"))t.push(I("strong",null,...te(i.slice(2,-2))));else if(i.startsWith("~~"))t.push(I("del",null,...te(i.slice(2,-2))));else if(i.startsWith("*")||i.startsWith("_"))t.push(I("em",null,...te(i.slice(1,-1))));else{let l=/^\[([^\]]+)\]\(([^)]+)\)$/u.exec(i),c=l?.[1]??i,a=l===null?void 0:gr(l[2]??"");t.push(a===void 0?c:I("a",{href:a,rel:"noreferrer noopener"},c))}n=o+i.length}return n<e.length&&t.push(e.slice(n)),t}var Ut=/^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u,Xt=/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u,Yt=/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u,pt=/^\s{0,3}>\s?(.*)$/u,gt=/^\s{0,3}[-*+]\s+(.*)$/u,mt=/^\s{0,3}\d+[.)]\s+(.*)$/u;function yr(e){return Ut.test(e)||Xt.test(e)||Yt.test(e)||pt.test(e)||gt.test(e)||mt.test(e)}function Zt(e){let t=[],n=0;for(;n<e.length;){let r=e[n]??"";if(r.trim()===""){n+=1;continue}let o=Ut.exec(r);if(o!==null){let d=(o[1]??"```").slice(0,1),s=o[2]??"",p=[];for(n+=1;n<e.length&&!new RegExp(`^\\s{0,3}${d}{3,}\\s*$`,"u").test(e[n]??"");)p.push(e[n]??""),n+=1;n+=1,t.push(I("pre",null,I("code",s===""?null:{className:`language-${s}`},p.join(`
`))));continue}let i=Xt.exec(r);if(i!==null){let d=(i[1]??"#").length;t.push(I(`h${String(d)}`,null,...te(i[2]??""))),n+=1;continue}if(Yt.test(r)){t.push(I("hr",null)),n+=1;continue}if(pt.test(r)){let d=[];for(;n<e.length;){let s=pt.exec(e[n]??"");if(s===null)break;d.push(s[1]??""),n+=1}t.push(I("blockquote",null,...Zt(d)));continue}if(gt.exec(r)!==null){let d=[];for(;n<e.length;){let s=gt.exec(e[n]??"");if(s===null)break;d.push(I("li",null,...te(s[1]??""))),n+=1}t.push(I("ul",null,...d));continue}if(mt.exec(r)!==null){let d=[];for(;n<e.length;){let s=mt.exec(e[n]??"");if(s===null)break;d.push(I("li",null,...te(s[1]??""))),n+=1}t.push(I("ol",null,...d));continue}let a=[r.trim()];for(n+=1;n<e.length;){let d=e[n]??"";if(d.trim()===""||yr(d))break;a.push(d.trim()),n+=1}t.push(I("p",null,...te(a.join(" "))))}return t}function Me(e){let t=e.replace(/\r\n?/gu,`
`).split(`
`);return I("div",{className:"fx-md"},...Zt(t))}var yt=200,xr={ts:"javascript",tsx:"javascript",mts:"javascript",cts:"javascript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",json5:"json",md:"markdown",mdx:"markdown",markdown:"markdown",mdown:"markdown",css:"css",scss:"css",sass:"css",less:"css",pcss:"css",postcss:"css",html:"html",htm:"html",xhtml:"html",vue:"html",svelte:"html",yml:"yaml",yaml:"yaml"};function xe(e){let t=e.toLowerCase(),n=t.slice(t.lastIndexOf("/")+1),r=n.lastIndexOf(".");return r<=0?"plaintext":xr[n.slice(r+1)]??"plaintext"}function je(e){return xe(e)==="markdown"}var ne=class extends Error{code;detail;constructor(t,n,r=""){super(n),this.name="PreviewReadError",this.code=t,this.detail=r}};function me(e){return e!==null&&typeof e=="object"}function hr(e){return e===""?0:e.split(`
`).length}function xt(e,t){if(!me(e))throw new ne("preview/unknown","\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94");if(e.ok===!1){let c=me(e.error)?e.error:{},a=typeof c.code=="string"?c.code:"preview/unknown",d=typeof c.message=="string"?c.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",s=me(c.details)?c.details:{},p=typeof s.kind=="string"?s.kind:"";throw new ne(a,d,p)}let n=e.ok===!0?e.value:e;if(!me(n)||typeof n.text!="string")throw new ne("preview/unknown","\u6587\u4EF6\u9875\u9762\u7F3A\u5C11 text");let r=typeof n.lines=="number"&&Number.isFinite(n.lines)?Math.max(0,Math.trunc(n.lines)):hr(n.text),o=typeof n.totalLines=="number"&&Number.isFinite(n.totalLines)&&n.totalLines>0?Math.trunc(n.totalLines):void 0,i=typeof n.offset=="number"&&Number.isFinite(n.offset)&&n.offset>0?Math.trunc(n.offset):t,l=n.eof===!0||o!==void 0&&r>0&&i+r-1>=o;return o===void 0?{text:n.text,lines:r,offset:i,eof:l}:{text:n.text,lines:r,offset:i,totalLines:o,eof:l}}function he(e){let t=me(e)?e:{},n=typeof t.code=="string"?t.code:"",r=typeof t.detail=="string"?t.detail:"",o=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",i=`${n} ${r} ${o}`.toLowerCase();return i.includes("symlink")?{kind:"symlink",code:n,message:o}:i.includes("eacces")||i.includes("eperm")||i.includes("permission")||i.includes("denied")||i.includes("forbidden")||i.includes("\u6743\u9650")?{kind:"denied",code:n,message:o}:i.includes("not-found")||i.includes("not_found")||i.includes("enoent")||i.includes("no such file")||i.includes("deleted")||i.includes("\u4E0D\u5B58\u5728")?{kind:"deleted",code:n,message:o}:i.includes("not-regular-file")||i.includes("not a regular file")?{kind:"binary",code:n,message:o}:i.includes("not-text")||i.includes("utf-8")||i.includes("binary")?{kind:"binary",code:n,message:o}:i.includes("too-large")||i.includes("too large")||i.includes("maxbytes")?{kind:"too-large",code:n,message:o}:i.includes("unavailable")?{kind:"unavailable",code:n,message:o}:{kind:"unknown",code:n,message:o}}var ye=Object.freeze({status:"idle",text:"",offset:1,lines:0,eof:!1});function Ae({files:e,maxLines:t=yt}){let n=Math.max(1,Math.trunc(t)),r=ye,o=0,i=null,l=[1],c=new Set,a=s=>{r=s;for(let p of c)p()},d=async(s,p)=>{o+=1;let m=o;i?.abort();let w=new AbortController;i=w,a({status:"loading",path:s,text:r.path===s?r.text:"",offset:p,lines:r.path===s?r.lines:0,...r.path===s&&r.totalLines!==void 0?{totalLines:r.totalLines}:{},eof:r.path===s?r.eof:!1});try{let b=await e.read(s,p>1?{offset:p,limit:n}:{limit:n},w.signal);if(m!==o)return;let v=xt(b,p);if(v.lines===0&&p>1){a({...r,status:"ready",eof:!0,text:"",lines:0});return}a(v.totalLines===void 0?{status:"ready",path:s,text:v.text,offset:v.offset,lines:v.lines,eof:v.eof}:{status:"ready",path:s,text:v.text,offset:v.offset,lines:v.lines,totalLines:v.totalLines,eof:v.eof})}catch(b){if(m!==o||w.signal.aborted)return;a({status:"failed",path:s,text:"",offset:p,lines:0,eof:!1,failure:he(b)})}};return{maxLines:n,getSnapshot:()=>r,subscribe(s){return c.add(s),()=>{c.delete(s)}},async open(s){l=[1],await d(s,1)},async next(){if(r.status!=="ready"||r.path===void 0||r.eof)return;let s=r.offset+Math.max(r.lines,1);r.totalLines!==void 0&&s>r.totalLines||(l.push(s),await d(r.path,s))},async prev(){if(r.path===void 0||l.length<=1)return;l=l.slice(0,-1);let s=l[l.length-1]??1;await d(r.path,s)},async retry(){r.path!==void 0&&await d(r.path,r.offset)},close(){o+=1,i?.abort(),i=null,l=[1],a(ye)}}}function ze(e){if(e.status!=="ready"||e.lines===0)return{range:"\u2014"};let t=e.offset+e.lines-1,n=`${String(e.offset)}\u2013${String(t)}`;return e.totalLines===void 0?{range:n}:{range:n,total:String(e.totalLines)}}var ht=Object.freeze({chunk:Je.chunk,id:`${$}/${Je.chunk}`}),vt=null,ve=null,De=new Map;function Jt(e){vt=e}function Qt(){return ht}function vr(e){let t=Lt[e];return{chunk:t,id:`${$}/${t}`}}function en(){if(ve!==null)return ve;let e=vt;if(e===null||typeof e.async!="function")return Promise.reject(new Error(`${$}: the loader require was not handed over`));let t=e.async(`./${ht.chunk}`).then(n=>{let r=n;if(r===null||typeof r.mountCodePreview!="function"||typeof r.MarkdownView!="function")throw new Error(`${$}: chunk ${ht.id} is missing its preview renderers`);return r});return ve=t,t.catch(()=>{ve===t&&(ve=null)}),t}function tn(e){let t=De.get(e);if(t!==void 0)return t;let n=vt;if(n===null||typeof n.async!="function")return Promise.reject(new Error(`${$}: the loader require was not handed over`));let r=vr(e),o=n.async(`./${r.chunk}`).then(i=>{let l=i;if(l===null||typeof l.FamilyView!="function"||l.renderer!==e)throw new Error(`${$}: chunk ${r.id} is not the ${e} view`);return l});return De.set(e,o),o.catch(()=>{De.get(e)===o&&De.delete(e)}),o}var nn="dsh-fs-explorer-styles",wr=`
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
  flex: 0 0 clamp(220px, 34%, 380px);
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--fx-border-soft);
}
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
}

@media (prefers-reduced-motion: reduce) {
  .fx-chevron { transition: none; }
  .fx-spinner { animation-duration: 1.6s; }
}
`;function rn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${nn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=nn,n.textContent=wr,e.head.appendChild(n),()=>{n.remove()}}var k=require("react");var Oe=require("react");var T=require("react/jsx-runtime");function on({panels:e,active:t,t:n,onActivate:r,onClose:o,onStep:i}){let l=(0,Oe.useRef)(null);if((0,Oe.useEffect)(()=>{l.current?.scrollIntoView?.({block:"nearest",inline:"nearest"})},[t]),e.length===0)return null;let c=a=>{if(a.key==="ArrowRight"||a.key==="ArrowLeft"){a.preventDefault(),a.stopPropagation(),i(a.key==="ArrowRight"?1:-1);return}(a.key==="Delete"||a.key==="Backspace")&&t!==null&&(a.preventDefault(),a.stopPropagation(),o(t))};return(0,T.jsx)("div",{className:"fx-tabs",role:"tablist","aria-label":n("panel.tabs"),onKeyDown:c,"data-testid":"fs-tabs",children:e.map((a,d)=>{let s=a.path===t,p=Ht(a.path),m=n("panel.close").replace("{name}",p);return(0,T.jsxs)("div",{className:"fx-tab","data-active":s?"true":"false",role:"presentation",children:[(0,T.jsxs)("button",{type:"button",className:"fx-tab-main",role:"tab",id:`fx-tab-${d}`,"aria-controls":`fx-panel-${d}`,"aria-selected":s,tabIndex:s?0:-1,title:a.path,"data-testid":"fs-tab","data-path":a.path,ref:s?l:void 0,onClick:()=>r(a.path),children:[(0,T.jsx)("span",{className:"fx-badge fx-tab-badge","data-icon":ae(a.path),"aria-hidden":"true",children:se(a.path)}),(0,T.jsx)("span",{className:"fx-tab-name",children:p})]}),(0,T.jsx)("button",{type:"button",className:"fx-tab-close",tabIndex:s?0:-1,"aria-label":m,title:m,"data-testid":"fs-tab-close",onClick:()=>o(a.path),children:"\xD7"})]},a.path)})})}function br(){return(0,T.jsxs)("svg",{width:"34",height:"34",viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,T.jsx)("path",{d:"M7.5 4.5h11l6 6v17h-17z"}),(0,T.jsx)("path",{d:"M18.5 4.5v6h6"}),(0,T.jsx)("path",{d:"M11 16h10M11 20h10M11 24h6"})]})}function an({t:e}){return(0,T.jsxs)("div",{className:"fx-editor-empty","data-testid":"fs-panel-empty",children:[(0,T.jsx)("span",{className:"fx-editor-glyph","aria-hidden":"true",children:(0,T.jsx)(br,{})}),(0,T.jsx)("strong",{children:e("panel.empty.title")}),(0,T.jsx)("span",{children:e("panel.empty.description")}),(0,T.jsxs)("span",{className:"fx-empty-keys",children:[(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2193"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"\u2318\u2325\u2191"}),(0,T.jsx)("kbd",{className:"fx-kbd",children:"Ctrl+W"}),(0,T.jsx)("span",{children:e("panel.empty.keys")})]})]})}var C=require("react");async function sn(e){let t=typeof navigator>"u"?void 0:navigator.clipboard;if(t!==void 0&&typeof t.writeText=="function")try{return await t.writeText(e),!0}catch{}if(typeof document>"u")return!1;let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.position="fixed",n.style.opacity="0",document.body.appendChild(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}var X=require("react/jsx-runtime");function kr(e,t){switch(e.kind){case"deleted":return t("preview.deleted.title");case"denied":return t("preview.denied.title");case"symlink":return t("preview.symlink.title");case"binary":return t("preview.binary.title");case"too-large":return t("preview.tooLarge.title");case"unavailable":return t("preview.unavailable.title");default:return t("preview.unknown.title")}}function Sr(e,t){switch(e.kind){case"deleted":return t("preview.deleted.description");case"denied":return t("preview.denied.description");case"symlink":return t("preview.symlink.description");case"binary":return t("preview.binary.description");case"too-large":return t("preview.tooLarge.description");case"unavailable":return t("preview.unavailable.description");default:return t("preview.unknown.description")}}function wt({failure:e,t,onRetry:n}){return(0,X.jsxs)("div",{className:"fx-empty","data-state":"failed","data-testid":"fs-preview-failed","data-kind":e.kind,children:[(0,X.jsx)("strong",{children:kr(e,t)}),(0,X.jsx)("span",{children:Sr(e,t)}),e.message===""?null:(0,X.jsx)("code",{className:"fx-preview-hint",children:e.message}),(0,X.jsx)("button",{type:"button",className:"fx-btn",onClick:n,"data-testid":"fs-preview-retry",children:t("preview.retry")})]})}function bt({t:e}){return(0,X.jsxs)("div",{className:"fx-loading","data-testid":"fs-preview-loading",children:[(0,X.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),e("preview.loading")]})}function Be(e){return e===null||typeof e!="object"?!1:typeof e.list=="function"}function le(e){try{return e()}catch{return}}function ln(e){return()=>{let t=le(()=>e.workspaceFiles);if(Be(t))return t;let n=le(()=>typeof e.get=="function"?e.get("workspaceFiles"):void 0);if(Be(n))return n;let r=le(()=>e.remote?.workspaceFiles);if(Be(r))return r;let o=le(()=>typeof e.get=="function"?e.get("remote.workspaceFiles"):void 0);if(Be(o))return o}}function cn(e,t){if(e===void 0||t===void 0)return;let n=e.read;if(typeof n=="function")return{read(r,o,i){return n.call(e,t,r,o,i)}}}function We(e){return e!==null&&typeof e=="object"}function Rr(e){if(!We(e))return{ok:!1,error:{code:"preview/unknown",message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"}};if(e.ok===!1)return{ok:!1,error:e.error};let t=e.ok===!0?e.value:e,n=We(t)?t.data:void 0;return n instanceof Uint8Array?{ok:!0,value:{data:n}}:{ok:!1,error:{code:"preview/unknown",message:"\u5B57\u8282\u8BFB\u53D6\u7F3A\u5C11 data"}}}function Pr(e){let t=We(e)?e:{},n=typeof t.code=="string"?t.code:"preview/unknown",r=typeof t.message=="string"&&t.message!==""?t.message:"\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25",o=We(t.details)?t.details:{},i=typeof o.kind=="string"?o.kind:"";return new ne(n,r,i)}function un(e){if(e===void 0)return;let t=e.readBytes;if(typeof t=="function")return async(n,r,o)=>{let i=Rr(await t.call(e,n,r,{},o));if(!i.ok)throw Pr(i.error);return i.value.data}}function we(e){if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string"&&t.code!=="")return t.code}return typeof e=="string"&&e!==""?e:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u9519\u8BEF"}function kt(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return Array.isArray(t.entries)?{ok:!0,listing:{entries:t.entries.filter(r=>r===null||typeof r!="object"?!1:typeof r.name=="string"),truncated:t.truncated===!0,...typeof t.path=="string"?{path:t.path}:{}}}:{ok:!1,message:"\u76EE\u5F55\u5217\u8868\u7F3A\u5C11 entries"}}function _e(e){if(e===null||typeof e!="object")return{ok:!1,message:"\u6587\u4EF6\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:we(t.error)};if(t.ok===!0){let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let r=n;return r.ok?kt(r.value):{ok:!1,message:we(r.error)}}return kt(n)}return kt(t)}function fn(e){return e instanceof Error?e.message:we(e)}function dn(e){return e===null||typeof e!="object"?!1:typeof e.snapshot=="function"}function pn(e){return()=>{let t=le(()=>e.remote?.gitExplorer);if(dn(t))return t;let n=le(()=>typeof e.get=="function"?e.get("remote.gitExplorer"):void 0);if(dn(n))return n}}function St(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;return typeof t.status!="string"?{ok:!1,message:"Git \u5FEB\u7167\u7F3A\u5C11 status"}:{ok:!0,status:t.isRepository===!1?"":t.status}}function Ke(e){if(e===null||typeof e!="object")return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let t=e;if(t.ok===!1)return{ok:!1,message:we(t.error)};if(t.ok!==!0)return{ok:!1,message:"Git \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u54CD\u5E94"};let n=t.value;if(n!==null&&typeof n=="object"&&typeof n.ok=="boolean"){let o=n;return o.ok?St(o.snapshot):{ok:!1,message:we(o.error)}}let r=e;return r.snapshot!==void 0?St(r.snapshot):St(n)}var y=require("react/jsx-runtime");function Cr({chunk:e,text:t,path:n,offset:r}){let o=(0,C.useRef)(null),i=(0,C.useRef)(null),[l,c]=(0,C.useState)(!1),a=xe(n);return(0,C.useEffect)(()=>{c(!1)},[e,n]),(0,C.useEffect)(()=>{let d=o.current;if(!(e===null||d===null))try{let s=e.mountCodePreview(d,{text:t,language:a,path:n,offset:r});return i.current=s,()=>{s.destroy(),i.current=null}}catch{c(!0);return}},[e,n,a]),(0,C.useEffect)(()=>{i.current?.update(t,r)},[t,r,e]),e===null||l?(0,y.jsx)("pre",{className:"fx-pre","data-testid":"fs-preview-plain",children:t}):(0,y.jsx)("div",{className:"fx-code-host",ref:o,"data-testid":"fs-preview-code","data-renderer":e.renderer})}function gn({sessionId:e,files:t,path:n,t:r,visible:o=!0}){let i=(0,C.useMemo)(()=>cn(t,e),[t,e]),l=(0,C.useMemo)(()=>un(t),[t]),c=n===void 0?null:Ye(n),[a,d]=(0,C.useState)(null),[s,p]=(0,C.useState)(ye),[m,w]=(0,C.useState)(null),[b,v]=(0,C.useState)(null),[W,_]=(0,C.useState)(null),[D,u]=(0,C.useState)(0),[h,R]=(0,C.useState)("reading"),[E,M]=(0,C.useState)(!1),K=(0,C.useRef)(void 0);if((0,C.useEffect)(()=>{if(i===void 0){d(null);return}let L=Ae({files:i,maxLines:yt});return d(L),()=>L.close()},[i]),(0,C.useEffect)(()=>{if(a===null){p(ye);return}return p(a.getSnapshot()),a.subscribe(()=>p(a.getSnapshot()))},[a]),(0,C.useEffect)(()=>{a===null||n===void 0||c!==null||a.open(n)},[a,n,c]),(0,C.useEffect)(()=>{R("reading"),M(!1)},[n]),(0,C.useEffect)(()=>()=>{K.current!==void 0&&clearTimeout(K.current)},[]),(0,C.useEffect)(()=>{if(n===void 0||c!==null)return;let L=!0;return en().then(Y=>{L&&w(Y)}).catch(()=>{L&&w(null)}),()=>{L=!1}},[n,c]),(0,C.useEffect)(()=>{if(c===null)return;let L=!0;return v(null),_(null),tn(c).then(Y=>{L&&v(Y)}).catch(Y=>{L&&_(he(Y))}),()=>{L=!1}},[c,D]),n===void 0)return(0,y.jsx)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":"empty",children:(0,y.jsxs)("div",{className:"fx-empty fx-preview-empty","data-testid":"fs-preview-empty",children:[(0,y.jsx)("strong",{children:r("preview.empty.title")}),(0,y.jsx)("span",{children:r("preview.empty.description")})]})});let O=c!==null,B=e!==void 0&&l!==void 0?{sessionId:e,readFile:l}:null,re=O&&B===null,H=ze(s),V=!O&&je(n),F=O?!re&&b===null&&W===null:s.status==="loading",oe=s.status==="ready",J=V&&h==="reading",qe=O?re?"unavailable":W!==null?"failed":b===null?"loading":"ready":s.status,Q=()=>{sn(n).then(L=>{L&&(M(!0),K.current!==void 0&&clearTimeout(K.current),K.current=setTimeout(()=>M(!1),1400))})},q;return O?q=B===null?(0,y.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,y.jsx)("strong",{children:r("preview.unavailable.title")}),(0,y.jsx)("span",{children:r("preview.unavailable.description")})]}):W!==null?(0,y.jsx)(wt,{failure:W,t:r,onRetry:()=>u(L=>L+1)}):b===null?(0,y.jsx)(bt,{t:r}):(0,y.jsx)(b.FamilyView,{path:n,sessionId:B.sessionId,readFile:B.readFile,t:r,visible:o}):i===void 0?q=(0,y.jsxs)("div",{className:"fx-empty","data-testid":"fs-preview-unavailable",children:[(0,y.jsx)("strong",{children:r("preview.unavailable.title")}),(0,y.jsx)("span",{children:r("preview.unavailable.description")})]}):s.status==="failed"?q=(0,y.jsx)(wt,{failure:s.failure??{kind:"unknown",code:"",message:""},t:r,onRetry:()=>{a?.retry()}}):oe?J?q=m===null?(0,y.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"fallback",children:Me(s.text)}):(0,y.jsx)("div",{className:"fx-preview-read","data-testid":"fs-preview-markdown","data-renderer":"gfm",children:(0,y.jsx)(m.MarkdownView,{text:s.text})}):q=(0,y.jsx)(Cr,{chunk:m,text:s.text,path:n,offset:s.offset}):q=(0,y.jsx)(bt,{t:r}),(0,y.jsxs)("section",{className:"fx-preview","data-testid":"fs-preview","data-state":qe,"data-mode":O?"binary":J?"reading":"code","data-renderer":O?b?.renderer??"pending":J?m===null?"fallback":"gfm":m?.renderer??"plain",children:[(0,y.jsxs)("header",{className:"fx-preview-bar",children:[(0,y.jsx)("span",{className:"fx-preview-path",title:n,"data-testid":"fs-preview-path",children:n}),O?null:(0,y.jsxs)("span",{className:"fx-preview-range","data-testid":"fs-preview-range",title:r("preview.range"),children:[H.range,H.range==="\u2014"?null:(0,y.jsxs)(y.Fragment,{children:[" ",r("preview.lines")]}),H.total===void 0?null:(0,y.jsxs)("span",{className:"fx-preview-total",children:[" / ",H.total," ",r("preview.lines")]})]}),(0,y.jsxs)("div",{className:"fx-preview-actions",children:[V?(0,y.jsx)("button",{type:"button",className:"fx-pbtn",onClick:()=>R(L=>L==="reading"?"source":"reading"),"data-testid":"fs-preview-mode",children:r(h==="reading"?"preview.source":"preview.reading")}):null,O?null:(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!oe||F||s.offset<=1,onClick:()=>{a?.prev()},"data-testid":"fs-preview-prev",children:r("preview.prev")}),(0,y.jsx)("button",{type:"button",className:"fx-pbtn",disabled:!oe||F||s.eof,onClick:()=>{a?.next()},"data-testid":"fs-preview-next",children:r("preview.next")})]}),(0,y.jsx)("button",{type:"button",className:"fx-pbtn",onClick:Q,"data-testid":"fs-preview-copy",children:r(E?"preview.copied":"preview.copyPath")}),F?(0,y.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null]})]}),(0,y.jsx)("div",{className:"fx-preview-body","data-scroll":J?"y":"none",children:q})]})}var N=require("react");var x=require("react/jsx-runtime"),Z=22;function Rt({open:e=!0,size:t=14}){return(0,x.jsx)("svg",{width:t,height:t,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"}),(0,x.jsx)("path",{d:"M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"})]}):(0,x.jsx)("path",{d:"M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"})})}function Fr(){return(0,x.jsx)("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,x.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5"})})}function mn(){return(0,x.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,x.jsx)("path",{d:"M13 6.2A5.3 5.3 0 1 0 13.1 10"}),(0,x.jsx)("path",{d:"M13 2.8v3.4H9.6"})]})}function yn(){return(0,x.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,x.jsx)("path",{d:"M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"})})}function Tr({name:e}){return(0,x.jsx)("span",{className:"fx-badge","data-icon":ae(e),"aria-hidden":"true",children:se(e)})}function Er({row:e,selected:t,cursor:n,top:r,t:o,onToggle:i,onSelect:l,onRowActivate:c}){let a=e.kind==="directory",d={top:r,paddingLeft:8+e.depth*12};return(0,x.jsxs)("button",{type:"button",className:"fx-row",role:"treeitem","aria-level":e.depth+1,"aria-selected":t,...a?{"aria-expanded":e.expanded}:{},"data-kind":e.kind,"data-selected":t?"true":"false","data-cursor":n?"true":"false","data-expanded":a?e.expanded?"true":"false":void 0,"data-status":e.status,"data-testid":"fx-row",title:e.path,style:d,onClick:()=>{c(e.path),a?i(e.path):l(e.path)},children:[(0,x.jsx)("span",{className:"fx-chevron","data-open":a&&e.expanded?"true":"false","data-visible":a?"true":"false","aria-hidden":"true",children:(0,x.jsx)(Fr,{})}),a?(0,x.jsx)("span",{className:"fx-folder","data-open":e.expanded?"true":"false","aria-hidden":"true",children:(0,x.jsx)(Rt,{open:e.expanded})}):(0,x.jsx)(Tr,{name:e.name}),(0,x.jsx)("span",{className:"fx-name",children:e.name}),e.status===void 0?null:(0,x.jsx)("span",{className:"fx-status-badge fx-tone","data-tone":ue(e.status),"data-testid":"fx-file-status",title:o(Qe(e.status)),"aria-label":o(Qe(e.status)),children:Se(e.status)}),e.statusCount===void 0?null:(0,x.jsx)("span",{className:"fx-dir-status fx-tone","data-tone":e.statusTone??"neutral","data-testid":"fx-dir-status",children:o("status.directoryChanges").replace("{count}",String(e.statusCount))}),(0,x.jsx)("span",{className:"fx-row-fill"}),e.size===void 0?null:(0,x.jsx)("span",{className:"fx-size",children:Ee(e.size)})]})}function Lr({row:e,top:t,t:n,onRetry:r}){let o=e.state==="loading"?n("state.loadingDirectory"):e.state==="empty"?n("state.emptyDirectory"):e.state==="failed"?e.message??n("state.failedDirectory"):e.label??n("state.truncated");return(0,x.jsxs)("div",{className:"fx-status","data-state":e.state,"data-testid":"fx-status",role:"note",style:{top:t,paddingLeft:8+e.depth*12+22},children:[e.state==="loading"?(0,x.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}):null,(0,x.jsx)("span",{className:"fx-status-text",title:o,children:o}),e.state==="truncated"?(0,x.jsx)("span",{className:"fx-status-note","aria-hidden":"true",children:"\u21A7"}):null,e.state==="failed"?(0,x.jsx)("button",{type:"button",className:"fx-linkbtn",onClick:()=>r(e.path),children:n("action.retry")}):null]})}function xn({rows:e,selectedPath:t,t:n,onToggle:r,onSelect:o,onRetry:i}){let l=(0,N.useRef)(null),[c,a]=(0,N.useState)(0),[d,s]=(0,N.useState)(0),[p,m]=(0,N.useState)(void 0),w=(0,N.useMemo)(()=>e.flatMap((u,h)=>u.type==="entry"?[h]:[]),[e]);(0,N.useEffect)(()=>{if(t===void 0)return;let u=e.findIndex(h=>h.type==="entry"&&h.path===t);u>=0&&m(u)},[t,e]),(0,N.useEffect)(()=>{p!==void 0&&e[p]?.type!=="entry"&&m(void 0)},[e,p]),(0,N.useEffect)(()=>{let u=l.current;if(p===void 0||u===null)return;let h=p*Z;h<u.scrollTop?u.scrollTop=h:h+Z>u.scrollTop+u.clientHeight&&(u.scrollTop=h+Z-u.clientHeight)},[p]);let b=(0,N.useCallback)(u=>{m(u),l.current?.focus({preventScroll:!0})},[]),v=(0,N.useCallback)(u=>{let h=e.findIndex(R=>R.type==="entry"&&R.path===u);h>=0&&m(h)},[e]),W=(0,N.useCallback)(u=>{if(u.nativeEvent.isComposing||u.altKey||u.metaKey||u.ctrlKey)return;let h=w.at(-1);if(u.key==="ArrowDown"){if(u.preventDefault(),p===void 0){w[0]!==void 0&&b(w[0]);return}let E=w.find(M=>M>p);E!==void 0&&b(E);return}if(u.key==="ArrowUp"){if(u.preventDefault(),p===void 0){h!==void 0&&b(h);return}let E=[...w].reverse().find(M=>M<p);E!==void 0&&b(E);return}if(p===void 0)return;let R=e[p];if(!(R===void 0||R.type!=="entry")){if(u.key==="ArrowRight"){if(u.preventDefault(),R.kind==="directory"&&!R.expanded)r(R.path);else{let E=w.find(M=>M>p);E!==void 0&&e[E]?.depth===R.depth+1&&b(E)}return}if(u.key==="ArrowLeft"){if(u.preventDefault(),R.kind==="directory"&&R.expanded)r(R.path);else{let E=[...w].reverse().find(M=>M<p&&e[M]?.type==="entry"&&e[M].depth<R.depth);E!==void 0&&b(E)}return}if(u.key==="Enter"&&R.kind!=="directory"){u.preventDefault(),o(R.path);return}if(u.key==="Home"){u.preventDefault(),w[0]!==void 0&&b(w[0]);return}u.key==="End"&&(u.preventDefault(),h!==void 0&&b(h))}},[p,w,b,r,o,e]);(0,N.useEffect)(()=>{let u=l.current;if(u===null)return;let h=()=>s(u.clientHeight);if(h(),typeof ResizeObserver>"u")return;let R=new ResizeObserver(h);return R.observe(u),()=>R.disconnect()},[]),(0,N.useEffect)(()=>{if(t===void 0)return;let u=l.current;if(u===null)return;let h=e.findIndex(E=>E.type==="entry"&&E.path===t);if(h<0)return;let R=h*Z;(R<u.scrollTop||R+Z>u.scrollTop+u.clientHeight)&&(u.scrollTop=Math.max(0,R-u.clientHeight/2))},[t,e]);let _=u=>{a(u.currentTarget.scrollTop)},D=Pe(e,{scrollTop:c,height:d===0?480:d,rowHeight:Z});return(0,x.jsx)("div",{className:"fx-scroll",ref:l,onScroll:_,onKeyDown:W,tabIndex:0,"data-testid":"fs-tree-scroll",role:"tree","aria-label":n("view.tree"),children:(0,x.jsx)("div",{className:"fx-vlist",style:{height:e.length*Z},children:D.rows.map((u,h)=>{let R=(D.startIndex+h)*Z;return u.type==="entry"?(0,x.jsx)(Er,{row:u,top:R,selected:u.path===t,cursor:p===D.startIndex+h,t:n,onToggle:r,onSelect:o,onRowActivate:v},u.path):(0,x.jsx)(Lr,{row:u,top:R,t:n,onRetry:i},u.key)})})})}var g=require("react/jsx-runtime");var Nr=()=>({status:"loading",nodes:[],truncated:!1,total:0});function Ve({title:e,description:t,actionLabel:n,onAction:r,testId:o}){return(0,g.jsxs)("div",{className:"fx-empty",role:"note","data-testid":o??"fs-state",children:[(0,g.jsx)("strong",{children:e}),t===void 0?null:(0,g.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,g.jsx)("button",{type:"button",className:"fx-btn",onClick:r,children:n})]})}function hn({workbench:e,version:t,t:n,files:r,status:o}){let i=qt();function l(c){let a=c.sessionId??e.currentSessionId(),d=(0,k.useRef)(a);d.current=a;let s=(0,k.useMemo)(()=>r(),[r]),p=(0,k.useMemo)(()=>o(),[o]),[m,w]=(0,k.useState)(()=>new Map),[b,v]=(0,k.useState)(void 0),W=(0,k.useRef)(m);W.current=m;let[_,D]=(0,k.useState)(()=>new Set),u=(0,k.useMemo)(()=>i.forSession(a),[i,a]),h=(0,k.useSyncExternalStore)(u.subscribe,u.snapshot,u.snapshot),R=h.active??void 0,[E,M]=(0,k.useState)(0),[K,O]=(0,k.useState)(void 0),B=(0,k.useRef)(new Map),re=(0,k.useRef)(void 0),H=(0,k.useCallback)((f,S,P)=>{u.open(f,S,P),P||O({path:f,line:S,absolute:P})},[u]),V=(0,k.useCallback)(async(f,S,P)=>{B.current.get(f)?.abort();let j=new AbortController;B.current.set(f,j),w(ie=>new Map(ie).set(f,Nr()));try{let ie=await P.list(S,Ce(f),j.signal);if(j.signal.aborted||d.current!==S)return!1;let A=_e(ie);if(!A.ok)return w(Ue=>new Map(Ue).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:A.message})),!1;let Ge=Re(A.listing.entries);return w(Ue=>new Map(Ue).set(f,{status:"ready",nodes:Ge,truncated:A.listing.truncated===!0,total:A.listing.entries.length})),!0}catch(ie){return j.signal.aborted||w(A=>new Map(A).set(f,{status:"failed",nodes:[],truncated:!1,total:0,message:fn(ie)})),!1}finally{B.current.get(f)===j&&B.current.delete(f)}},[]);(0,k.useEffect)(()=>{for(let f of B.current.values())f.abort();return B.current.clear(),w(new Map),D(new Set),O(void 0),re.current=void 0,a!==void 0&&s!==void 0&&V("",a,s),()=>{for(let f of B.current.values())f.abort();B.current.clear()}},[a,s,E,V]),(0,k.useEffect)(()=>{if(a===void 0||p===void 0){v(void 0);return}let f=!0,S=new AbortController;return v(void 0),Promise.resolve().then(()=>p.snapshot({sessionId:a,maxCommits:1},S.signal)).then(P=>{if(!f)return;let j=Ke(P);v(j.ok?ke(j.status):void 0)}).catch(()=>{f&&v(void 0)}),()=>{f=!1,S.abort()}},[a,p,E]),(0,k.useEffect)(()=>{let f=c.viewRequest;if(f==null||f.view!==z)return;let S=`${f.view}:${f.focus}`;re.current!==S&&(re.current=S,ge(f.focus,{open:H}),c.completeViewRequest?.())},[c.viewRequest,c.completeViewRequest,H]),(0,k.useEffect)(()=>{let f=e.viewFocus;if(f===void 0||a===void 0)return;let S=()=>{let P=f.take(z);P!==void 0&&ge(P,{open:H})};return S(),f.subscribe(S)},[e,a,H]);let F=m.get(""),oe=F?.status==="ready";(0,k.useEffect)(()=>{if(K===void 0||a===void 0||s===void 0||!oe)return;let f=!0,S=K.path.split("/").filter(Boolean),P=[],j="";for(let A of S.slice(0,-1))j=pe(j,A),P.push(j);return P.length>0&&D(A=>new Set([...A,...P])),(async()=>{for(let A of P){if(W.current.get(A)?.status==="ready")continue;let Ge=await V(A,a,s);if(!f||!Ge)return}f&&(u.open(K.path,K.line,K.absolute),O(void 0))})(),()=>{f=!1}},[K,a,s,oe,V,u]);let J=(0,k.useCallback)(()=>{if(typeof document>"u")return!1;let f=document.querySelector("[data-composer-input]");return f===null?!1:(f.focus(),!0)},[]);(0,k.useEffect)(()=>{if(typeof document>"u")return;let f=S=>{if(!(S.isComposing||Vt(S.target))){for(let P of Ne)if(Kt(S,P)){if(P.action==="closePanel"&&u.snapshot().active===null)return;S.preventDefault(),S.stopPropagation(),P.action==="nextPanel"?u.next():P.action==="previousPanel"?u.previous():u.close();return}}};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[u]),(0,k.useEffect)(()=>{if(typeof document>"u")return;let f=Ie({focusComposer:J,hasModal:()=>$t(document)}),S=P=>f(P);return document.addEventListener("keydown",S,!0),()=>document.removeEventListener("keydown",S,!0)},[J]);let qe=(0,k.useMemo)(()=>Te(m,_,b),[m,_,b]),Q=b===void 0?void 0:Object.keys(b).length,q=b===void 0?"neutral":Object.values(b).some(f=>f.status==="conflicted")?"conflict":Q===0?"success":"warning",L=(0,k.useCallback)(f=>{if(a===void 0||s===void 0)return;if(_.has(f)){D(P=>{let j=new Set(P);return j.delete(f),j});return}D(P=>new Set(P).add(f));let S=m.get(f);(S===void 0||S.status==="failed")&&V(f,a,s)},[_,m,a,s,V]),Y=(0,k.useCallback)(f=>{a===void 0||s===void 0||V(f,a,s)},[a,s,V]),Sn=()=>D(new Set),Rn=()=>M(f=>f+1),Pn=a===void 0?"no-session":s===void 0?"no-service":F===void 0||F.status==="loading"?"loading":F.status==="failed"?"failed":F.nodes.length===0?"empty":"tree";return(0,g.jsxs)("section",{className:"fx-root","data-workbench-view":"fs-explorer","data-core-version":t,"data-conversation-composer-overlay":!0,"data-state":Pn,"data-session":a??"","data-testid":"fs-explorer-view",children:[(0,g.jsxs)("header",{className:"fx-head",children:[(0,g.jsx)("span",{className:"fx-head-icon","aria-hidden":"true",children:(0,g.jsx)(Rt,{open:!0})}),(0,g.jsx)("h2",{className:"fx-title",children:n("view.title")}),(0,g.jsx)("span",{className:"fx-scope",children:n("view.scope")}),(0,g.jsxs)("div",{className:"fx-head-meta",children:[F?.status==="ready"?(0,g.jsxs)("span",{children:[(0,g.jsx)("b",{children:F.nodes.length})," ",n("head.entries")]}):null,(0,g.jsx)("button",{type:"button",className:"fx-btn",title:n("head.collapseAll"),"aria-label":n("head.collapseAll"),disabled:_.size===0,onClick:Sn,children:(0,g.jsx)(yn,{})}),(0,g.jsx)("button",{type:"button",className:"fx-btn",title:n("head.refresh"),"aria-label":n("head.refresh"),disabled:a===void 0||s===void 0||F?.status==="loading",onClick:Rn,children:(0,g.jsx)(mn,{})})]})]}),(0,g.jsx)("div",{className:"fx-main",children:a===void 0?(0,g.jsx)(Ve,{title:n("state.noSession.title"),description:n("state.noSession.description"),testId:"fs-no-session"}):s===void 0?(0,g.jsx)(Ve,{title:n("state.noService.title"),description:n("state.noService.description"),testId:"fs-no-service"}):F===void 0||F.status==="loading"?(0,g.jsxs)("div",{className:"fx-loading","data-testid":"fs-loading",children:[(0,g.jsx)("span",{className:"fx-spinner","aria-hidden":"true"}),n("state.loading")]}):F.status==="failed"?(0,g.jsx)(Ve,{title:n("state.failed.title"),description:F.message??n("state.failed.description"),actionLabel:n("action.retry"),onAction:()=>Y(""),testId:"fs-failed"}):F.nodes.length===0?(0,g.jsx)(Ve,{title:n("state.emptyWorkspace.title"),description:n("state.emptyWorkspace.description"),testId:"fs-empty"}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("div",{className:"fx-tree-pane",children:(0,g.jsx)(xn,{rows:qe,selectedPath:R,t:n,onToggle:L,onSelect:f=>u.open(f),onRetry:Y})}),(0,g.jsxs)("div",{className:"fx-editor",children:[(0,g.jsx)(on,{panels:h.panels,active:h.active,t:n,onActivate:f=>u.activate(f),onClose:f=>u.close(f),onStep:f=>f===1?u.next():u.previous()}),(0,g.jsx)("div",{className:"fx-editor-body",children:h.panels.length===0?(0,g.jsx)(an,{t:n}):h.panels.map((f,S)=>{let P=f.path===h.active;return(0,g.jsx)("div",{className:"fx-panel",id:`fx-panel-${S}`,role:"tabpanel","aria-labelledby":`fx-tab-${S}`,hidden:!P,"data-line":f.line,"data-testid":"fs-panel",children:(0,g.jsx)(gn,{sessionId:a,files:s,path:f.path,t:n,visible:P})},f.path)})})]})]})}),F?.status==="ready"?(0,g.jsxs)("footer",{className:"fx-foot","data-testid":"fs-foot",children:[(0,g.jsxs)("span",{children:[n("view.scope")," ",(0,g.jsx)("b",{children:F.nodes.length})," ",n("head.entries")]}),F.truncated?(0,g.jsx)("span",{className:"fx-foot-warn",children:fe({entries:F.nodes,truncated:!0,total:F.total}).label}):null,(0,g.jsxs)("span",{className:"fx-foot-git","data-state":Q===void 0?"none":"ready","data-testid":"fs-git-status",children:[(0,g.jsx)("span",{className:"fx-foot-dot fx-tone","data-tone":q,"aria-hidden":"true"}),Q===void 0?n("status.unavailable"):Q===0?n("status.clean"):n("status.summary").replace("{count}",String(Q))]}),(0,g.jsx)("span",{className:"fx-spacer"}),(0,g.jsx)("span",{children:n("foot.order")})]}):null]})}return l}var vn=["slots","locale","workbench","remote"];function Mr(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"en"}var $e,He;function wn(e){let t=e.workbench;if(t==null)return()=>{};$e?.();let n=e.locale.register(be,{zh:dt,en:lt});$e=n;let r=e.locale.bind(be),o=rn(typeof document>"u"?void 0:document),i=hn({workbench:t,version:t.version,t:r,files:ln(e),status:pn(e)});He?.();let l=st(e,t);return He=l,e.slots.inject(Ze,()=>e.slots.register({name:Ze,id:z,order:100,label:()=>ct(Mr(e)),locale:be},i)),()=>{l(),He===l&&(He=void 0),o(),n(),$e===n&&($e=void 0)}}var bn={buildTree:Re,describeListing:fe,iconFor:ae,computeTreeWindow:Pe,flattenTree:Te,badgeFor:se,formatSize:Ee,joinPath:pe,listingPath:Ce,parseFocus:Fe,consumeViewRequest:ge,createPanelStack:ft,createEscapeHandler:Ie,KEYMAP:Ne,tabLabel:ct,normalizeListing:_e,normalizeStatusSnapshot:Ke,parseStatusZ:ke,statusTone:ue,statusBadge:Se,createPreviewLoader:Ae,renderMarkdown:Me,languageFor:xe,isMarkdownFile:je,describePage:ze,classifyPreviewFailure:he,normalizePreviewPage:xt,previewChunkRoute:Qt,canBridgeFile:Le,decideBridge:it,focusForFileAddress:ot,forwardFocus:at,registerAddressBridge:st},kn={name:"dsh-fs-explorer",inject:vn,apply:wn,__test:bn};var jr=kn;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
