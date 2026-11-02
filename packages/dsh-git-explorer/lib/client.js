window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Re=Object.defineProperty;var It=Object.getOwnPropertyDescriptor;var Ht=Object.getOwnPropertyNames;var Ft=Object.prototype.hasOwnProperty;var At=(t,e)=>{for(var n in e)Re(t,n,{get:e[n],enumerable:!0})},Bt=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of Ht(e))!Ft.call(t,a)&&a!==n&&Re(t,a,{get:()=>e[a],enumerable:!(r=It(e,a))||r.enumerable});return t};var Wt=t=>Bt(Re({},"__esModule",{value:!0}),t);var pn={};At(pn,{__test:()=>wt,apply:()=>vt,boot:()=>Oe,clientPlugin:()=>kt,createRemoteResolver:()=>yt,createRpcCall:()=>bt,default:()=>un,inject:()=>xt});module.exports=Wt(pn);var He={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},Fe={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var Ce="conversation.view",ee="git-explorer";var Se="conversation.session.header.actions",Ae="git-branch";var te="git-explorer",Be="gitExplorer";var N=require("react");function We(t){let e=n=>(r,a)=>t(n,{args:{request:r}},a);return{snapshot:e("snapshot"),query:e("query"),commit:e("commit"),branches:e("branches"),switchBranch:e("switchBranch")}}function $(t){if(t===null||typeof t!="object")return{ok:!1,message:"malformed remote response"};let e=t;if(e.ok!==!0){let r=e.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=e.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:e}}function V(t){if(t instanceof Error)return t.message;if(typeof t=="string")return t;if(t!==null&&typeof t=="object"){let e=t;if(typeof e.message=="string"&&e.message!=="")return e.message;if(typeof e.code=="string")return e.code}return"unknown error"}var ie="service-unavailable",_t=Object.freeze({status:"idle",revision:0,sessionId:null});function _e(t){let e=_t,n=-1,r=0,a=new Set,o=i=>{e=i;for(let g of[...a])g()},l=i=>e.sessionId===i&&e.status==="ready"&&e.error===void 0&&e.list!==void 0&&n===e.revision;return{subscribe(i){return a.add(i),()=>{a.delete(i)}},getSnapshot:()=>e,load:async i=>{if(l(i))return;let g=t(),h=++r,c=e.revision,R=e.sessionId===i;o({status:"loading",...R&&e.list!==void 0?{list:e.list}:{},revision:c,sessionId:i});let b=()=>h!==r||e.revision!==c;if(typeof g?.branches!="function"){if(b())return;o({status:"error",error:ie,revision:c,sessionId:i});return}try{let k=await g.branches({sessionId:i});if(b())return;let S=$(k);if(!S.ok){o({status:"error",error:S.message,revision:c,sessionId:i});return}if(S.result.ok===!1){o({status:"error",error:S.result.error.message,revision:c,sessionId:i});return}n=c,o({status:"ready",list:S.result.list,revision:c,sessionId:i})}catch(k){if(b())return;o({status:"error",error:V(k),revision:c,sessionId:i})}},switchTo:async(i,g)=>{let h=t();if(typeof h?.switchBranch!="function")return o({...e,error:ie}),!1;try{let c=await h.switchBranch({sessionId:i,name:g}),R=$(c),b=R.ok?R.result.ok===!1?R.result.error.message:void 0:R.message;if(b!==void 0)return o({...e,error:b}),!1;let k=R.ok&&R.result.ok===!0?R.result.branch:g,S=e.list;return o({status:S===void 0?e.status:"ready",...S===void 0?{}:{list:{...S,detached:!1,headHash:null,branches:S.branches.map(M=>({...M,current:M.name===k}))}},revision:e.revision+1,sessionId:i}),!0}catch(c){return o({...e,error:V(c)}),!1}},bump(){o({...e,revision:e.revision+1})}}}var O=require("react"),zt=Object.freeze({}),se=null,Le;function Oe(t){se=t}function $e(){if(Le!=null)return Le;if(se===null)return zt;let t=ze(se,"@deepseek-ai/dsh-client-ui-primitives"),e=ze(se,"react-dom"),n=t?.IconBranchOutlineRegular,r=t?.IconChevronDownOutlineRegular,a=t?.useAnchoredPosition,o=t?.useDismissOnOutsidePointer,l=e?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof a=="function"?{useAnchoredPosition:a}:{},...typeof o=="function"?{useDismissOnOutsidePointer:o}:{},...typeof l=="function"?{createPortal:l}:{}}}function ze(t,e){try{let n=t(e);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var Ve={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},qe=t=>(0,O.createElement)("svg",{...Ve,className:t.className},(0,O.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,O.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,O.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,O.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,O.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),je=t=>(0,O.createElement)("svg",{...Ve,width:12,height:12,viewBox:"0 0 12 12",className:t.className},(0,O.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var T=require("react/jsx-runtime"),Ot=320,Ke=5,le=8;function $t(t,e,n,r){return t.useAnchoredPosition!==void 0?t.useAnchoredPosition({open:e,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:Ke,margin:le})??void 0:Vt(e,n)}function Vt(t,e){let[n,r]=(0,N.useState)(void 0);return(0,N.useLayoutEffect)(()=>{if(!t){r(void 0);return}let a=()=>{let o=e.current;if(o===null)return;let l=o.getBoundingClientRect(),s=Math.min(Ot,Math.max(160,window.innerWidth-le*2)),p=Math.min(Math.max(l.right-s,le),window.innerWidth-s-le);r({left:p,top:l.bottom+Ke,width:s})};return a(),window.addEventListener("scroll",a,!0),window.addEventListener("resize",a),()=>{window.removeEventListener("scroll",a,!0),window.removeEventListener("resize",a)}},[t,e]),n}function qt(t,e,n,r,a,o){if(t.useDismissOnOutsidePointer!==void 0){t.useDismissOnOutsidePointer(e,a,o,r?n:void 0);return}jt(e,n,a,o)}function jt(t,e,n,r){(0,N.useEffect)(()=>{if(!n)return;let a=o=>{let l=o.target;l instanceof Node&&t.current?.contains(l)!==!0&&e.current?.contains(l)!==!0&&r()};return document.addEventListener("pointerdown",a,!0),()=>document.removeEventListener("pointerdown",a,!0)},[n,r,t,e])}function Ue({store:t,t:e}){function n({sessionId:r}){let a=(0,N.useSyncExternalStore)(t.subscribe,t.getSnapshot),[o,l]=(0,N.useState)(!1),[s,p]=(0,N.useState)(null),i=(0,N.useRef)(null),g=(0,N.useRef)(null),h=(0,N.useRef)(null),c=$e(),R=c.createPortal!==void 0,b=c.IconBranch??qe,k=c.IconChevron??je,S=(0,N.useCallback)(()=>{l(!1)},[]);(0,N.useEffect)(()=>{l(!1),p(null),r!==void 0&&t.load(r)},[t,r]),(0,N.useEffect)(()=>{if(!o)return;let C=A=>{A.key==="Escape"&&(l(!1),g.current?.focus())};return document.addEventListener("keydown",C),()=>document.removeEventListener("keydown",C)},[o]);let M=$t(c,o,g,h);qt(c,i,h,R,o,S);let y=()=>{if(o){l(!1);return}l(!0),r!==void 0&&t.load(r)},H=()=>{r!==void 0&&t.load(r)},G=async C=>{if(C.worktreePath!==void 0)return;if(C.current){l(!1);return}if(r===void 0)return;p(C.name);let A=await t.switchTo(r,C.name);p(null),A&&l(!1)};if(r===void 0)return null;let E=a.list,D=E?.branches.find(C=>C.current)?.name,P=E===void 0?e("branch.loading"):E.detached?E.headHash??e("head.detached"):D??e("branch.unborn");if(!o&&E?.isRepository!==!0)return null;let B=`${e("head.detached")} ${E?.headHash??""}`.trim(),Q=a.error===ie?e("state.noService.title"):a.error,re=(0,T.jsxs)("div",{ref:h,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":e("branch.title"),style:M,children:[Q!==void 0?(0,T.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,T.jsx)("span",{className:"gx-branch-error-text",children:Q}),(0,T.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:H,children:e("action.retry")})]}):null,a.status==="loading"&&E===void 0?(0,T.jsx)("div",{className:"gx-branch-hint",children:e("branch.loading")}):null,E!==void 0?(0,T.jsxs)("div",{className:"gx-branch-list",children:[E.branches.length===0?(0,T.jsx)("div",{className:"gx-branch-hint",children:e("branch.empty")}):null,E.branches.map(C=>(0,T.jsxs)("button",{type:"button",className:"gx-branch-row","data-testid":`gx-branch-row-${C.name}`,"data-current":C.current?"true":void 0,"aria-current":C.current?"true":void 0,title:C.worktreePath===void 0?void 0:`${e("branch.worktree")}: ${C.worktreePath}`,disabled:s!==null||C.worktreePath!==void 0,onClick:()=>{G(C)},children:[(0,T.jsx)("span",{className:"gx-branch-row-name",children:C.name}),C.current?(0,T.jsx)("span",{className:"gx-branch-tag",children:e("branch.current")}):null]},C.name))]}):null]});return(0,T.jsxs)("div",{className:"gx-branch-action",ref:i,children:[(0,T.jsxs)("button",{ref:g,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-haspopup":"dialog","aria-expanded":o,title:E?.detached===!0?B:P,onClick:y,children:[(0,T.jsx)(b,{className:"gx-branch-icon"}),(0,T.jsx)("span",{className:"gx-branch-name",children:P}),(0,T.jsx)(k,{className:"gx-branch-chevron"})]}),o?c.createPortal===void 0?re:c.createPortal(re,document.body):null]})}return n}var Kt={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function de(t){return Kt[t]}var Xe={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Ut(t,e){return(Xe[t]??0)>=(Xe[e]??0)?t:e}function Ye(t){if(t==="??")return"untracked";let e=t[0]??".",n=t[1]??".";return e==="U"||n==="U"?"conflicted":e==="R"||n==="R"?"renamed":e==="C"||n==="C"?"copied":e==="A"||n==="A"?"added":e==="D"||n==="D"?"deleted":e==="T"||n==="T"?"typechange":"modified"}function Ee(t,e){let n=0;for(let r=0;r<e;r+=1){let a=t.indexOf(" ",n);if(a<0)return"";n=a+1}return t.slice(n)}function Xt(t){let e=t.split("\0"),n=new Map,r=a=>{let o=n.get(a.path);if(o===void 0){n.set(a.path,a);return}n.set(a.path,{...o,status:Ut(o.status,a.status),staged:o.staged||a.staged,isDirectory:o.isDirectory||a.isDirectory,...o.origPath===void 0&&a.origPath===void 0?{}:{origPath:o.origPath??a.origPath}})};for(let a=0;a<e.length;a+=1){let o=e[a];if(o===void 0||o===""||o.startsWith("#"))continue;let l=o[0];if(l==="1"){let s=o.slice(2),p=s.slice(0,2),i=Ee(s,7);i!==""&&r({path:i,status:Ye(p),staged:p[0]!==".",isDirectory:!1})}else if(l==="2"){let s=o.slice(2),p=s.slice(0,2),i=Ee(s,8),g=e[a+1]??"";i!==""&&g!==""&&(a+=1,r({path:i,status:Ye(p),staged:p[0]!==".",isDirectory:!1,origPath:g}))}else if(l==="u"){let s=o.slice(2),p=Ee(s,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(l==="?"){let s=o.slice(2);if(s==="")continue;let p=s.endsWith("/");r({path:p?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function Yt(t){let e=t.lastIndexOf("/");return e<0?"":t.slice(0,e)}function Ne(t){let e=new Map;for(let n of t){let r=Yt(n.path),a=e.get(r);a===void 0?e.set(r,[n]):a.push(n)}return[...e.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((a,o)=>a.path.localeCompare(o.path))}))}function ce(t){return Ne(Xt(t))}function Me(t,e=Date.now()){let n=Math.max(0,Math.floor(e/1e3)-Math.trunc(t));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let a=Math.floor(r/60);if(a<24)return`${a}h`;let o=Math.floor(a/24);if(o<7)return`${o}d`;let l=Math.floor(o/7);if(l<5)return`${l}w`;let s=Math.floor(o/30);return s<12?`${s}mo`:`${Math.floor(o/365)}y`}function ue(t,e=Date.now()){return{shortHash:t.hash.slice(0,7),author:t.author,subject:t.subject,relative:Me(t.time,e)}}function pe({views:t,sessionId:e}){return(n,r=1)=>{if(n==="")return;let a=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),o=Number.isFinite(r)&&r>0?Math.floor(r):1;t.open(e,"fs-explorer",`path:${a}:${o}`)}}var Jt=/^commit:([0-9a-f]{4,64})$/iu;function Je(t){if(t===void 0)return;let e=Jt.exec(t);return e===null?void 0:{hash:(e[1]??"").toLowerCase()}}function ge(t,e){let n=Math.max(1,e.rowHeight||1),r=Math.max(0,e.height||0),a=Math.max(0,Math.trunc(e.overscan??6)),o=Math.max(1,Math.ceil(r/n)),l=Math.max(0,t.length-o-a*2),s=Math.floor(Math.max(0,e.scrollTop)/n)-a,p=Math.min(Math.max(s,0),l),i=Math.min(t.length,p+o+a*2);return{rows:t.slice(p,i),startIndex:p,endIndex:i}}function Qe(t){let e=[],n=[],r=[],a=0,o=[],l=()=>r.length===0?a++:(r.sort((g,h)=>g-h),r.shift()??a++),s=i=>{i!==null&&!r.includes(i)&&r.push(i)},p=()=>{let i=e.indexOf(null);return i>=0?i:(e.push(null),n.push(null),e.length-1)};for(let i of t){let g=[...e],h=[...n],c=g.indexOf(i.hash),R=c>=0;R||(c=p());let b=R?n[c]??null:null;b===null&&(b=l(),n[c]=b);for(let y=0;y<g.length;y+=1)y!==c&&g[y]===i.hash&&(s(n[y]??null),e[y]=null,n[y]=null);let k=i.parents[0];k===void 0?(s(n[c]??null),e[c]=null,n[c]=null):(e[c]=k,n[c]=b);let S=[];for(let y=1;y<i.parents.length;y+=1){let H=i.parents[y];if(H===void 0)continue;let G=e.indexOf(H);G<0&&(G=p(),e[G]=H),n[G]===null&&(n[G]=l()),S.push(G)}let M=[];for(let y=0;y<g.length;y+=1){let H=g[y];if(H===null)continue;let G=h[y]??b;H===i.hash?M.push({kind:"into",from:y,to:c,color:G}):M.push({kind:"pass",from:y,to:y,color:G})}k!==void 0&&M.push({kind:"out",from:c,to:c,color:n[c]??b});for(let y of S)M.push({kind:"out",from:c,to:y,color:n[y]??b});for(o.push({lane:c,color:b,merge:i.parents.length>=2,segments:M});e.length>0&&e[e.length-1]===null;)e.pop(),n.pop()}return o}function Ze(t){let e=0;for(let n of t)e=Math.max(e,n.lane,n.segments.reduce((r,a)=>Math.max(r,a.from,a.to),0));return e+1}function J(t){let e=t.lastIndexOf("/");return e<0?t:t.slice(e+1)}var et="dsh-git-explorer-styles",Qt=`
.gx-root {
  --gx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --gx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --gx-row-h: 24px;
  --gx-text: var(--dsw-alias-label-primary, inherit);
  --gx-text-2: var(--dsw-alias-label-secondary, inherit);
  --gx-text-3: var(--dsw-alias-label-tertiary, inherit);
  --gx-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --gx-border: var(--dsw-alias-border-l2, color-mix(in srgb, currentColor 18%, transparent));
  --gx-border-soft: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 10%, transparent));
  --gx-panel: var(--dsw-alias-bg-layer-1, transparent);
  --gx-panel-2: var(--dsw-alias-bg-layer-2, transparent);
  --gx-hover: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent));
  --gx-active: var(--dsw-alias-interactive-bg-active, color-mix(in srgb, currentColor 12%, transparent));
  --gx-accent: var(--dsw-alias-brand-primary, currentColor);
  --gx-added: var(--dsw-alias-state-success-primary, currentColor);
  --gx-deleted: var(--dsw-alias-state-error-primary, currentColor);
  --gx-modified: var(--dsw-alias-state-warn-primary, currentColor);
  --gx-renamed: var(--dsw-alias-state-business-primary, currentColor);
  --gx-untracked: var(--dsw-alias-state-success-primary, currentColor);
  --gx-conflict: var(--dsw-alias-state-error-primary, currentColor);
  --gx-lane-0: var(--dsw-alias-brand-primary, currentColor);
  --gx-lane-1: var(--dsw-alias-state-success-primary, currentColor);
  --gx-lane-2: var(--dsw-alias-state-warn-primary, currentColor);
  --gx-lane-3: var(--dsw-alias-state-business-primary, currentColor);
  --gx-lane-4: color-mix(in oklab, var(--dsw-alias-brand-primary, currentColor) 55%, var(--dsw-alias-state-success-primary, currentColor));
  --gx-lane-5: color-mix(in oklab, var(--dsw-alias-state-warn-primary, currentColor) 60%, var(--dsw-alias-brand-primary, currentColor));
  --gx-lane-6: color-mix(in oklab, var(--dsw-alias-state-error-primary, currentColor) 55%, var(--dsw-alias-state-business-primary, currentColor));
  --gx-lane-7: var(--dsw-alias-label-tertiary, currentColor);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--gx-text);
  background: var(--dsw-alias-bg-base, transparent);
  font-family: var(--gx-font);
  font-size: 12px;
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.gx-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  min-height: 38px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--gx-border-soft);
}
.gx-head-main { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
.gx-head-icon { display: inline-flex; color: var(--gx-accent); flex: none; }
.gx-repo {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 34ch;
}
.gx-branch, .gx-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 18px;
  padding: 0 7px;
  border: 1px solid var(--gx-border);
  border-radius: 999px;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: 10.5px;
  white-space: nowrap;
  flex: none;
}
.gx-branch { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 40%, transparent); }
.gx-head-meta { display: flex; align-items: center; gap: 8px; flex: none; color: var(--gx-caption); font-size: 11px; }
.gx-head-meta b { color: var(--gx-text-2); font-weight: 600; font-variant-numeric: tabular-nums; }
.gx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 24px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--gx-text-2);
  font: inherit;
  cursor: pointer;
}
.gx-btn:hover:not(:disabled) { background: var(--gx-hover); color: var(--gx-text); border-color: var(--gx-border-soft); }
.gx-btn:disabled { opacity: .45; cursor: default; }
.gx-btn:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }

.gx-body {
  display: grid;
  /* A user-dragged width arrives as the --gx-left-col inline variable; the
     fallback keeps the shipped fluid track for everyone who never dragged. The
     middle track carries the divider and replaces the old column gap, so the
     gutter between the columns stays 10px. */
  grid-template-columns: var(--gx-left-col, minmax(240px, 31%)) 10px minmax(0, 1fr);
  row-gap: 10px;
  column-gap: 0;
  flex: 1;
  min-height: 0;
  padding: 10px 12px 0;
  box-sizing: border-box;
}
.gx-pane-handle {
  position: relative;
  width: 6px;
  justify-self: center;
  cursor: col-resize;
  touch-action: none;
}
.gx-pane-handle::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-.5px);
  background: var(--gx-accent);
  opacity: 0;
}
.gx-pane-handle:hover::before { opacity: .55; }
/* The handle is 6px wide, so the default focus ring collapses into noise;
   the keyboard focus reuses the hover line instead. */
.gx-pane-handle:focus-visible { outline: none; }
.gx-pane-handle:focus-visible::before { opacity: .55; }
/* Applied to the document body while a drag is live: no text selection under a
   moving pointer and a stable cursor wherever it travels. */
body.gx-pane-resizing { user-select: none; cursor: col-resize; }
.gx-col { display: flex; flex-direction: column; min-width: 0; min-height: 0; gap: 10px; }
.gx-col > .gx-pane { flex: 1; }
.gx-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  background: var(--gx-panel);
  overflow: hidden;
}
.gx-pane-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 30px;
  padding: 0 10px;
  border-bottom: 1px solid var(--gx-border-soft);
  color: var(--gx-text-2);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
}
.gx-pane-head .gx-count { color: var(--gx-caption); font-weight: 400; font-variant-numeric: tabular-nums; }
.gx-pane-head .gx-spacer { flex: 1; }
.gx-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent)) transparent;
}
.gx-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
.gx-scroll::-webkit-scrollbar-thumb { background: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent)); border-radius: 999px; border: 3px solid transparent; background-clip: padding-box; }
.gx-scroll::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-scrollbar-hover-l2, color-mix(in srgb, currentColor 34%, transparent)); background-clip: padding-box; }

.gx-group-head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 10px;
  background: var(--gx-panel-2);
  color: var(--gx-caption);
  font-size: 10.5px;
  border-bottom: 1px solid var(--gx-border-soft);
}
.gx-group-head .gx-group-dir { font-family: var(--gx-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-group-head .gx-count { margin-left: auto; font-variant-numeric: tabular-nums; }

.gx-file {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) auto;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: var(--gx-row-h);
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--gx-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
}
.gx-file:hover { background: var(--gx-hover); }
.gx-file:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-file[data-directory="true"] { cursor: default; color: var(--gx-text-2); }
.gx-file-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.gx-file-name .gx-file-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10.5px; margin-right: 4px; }
.gx-file[data-renamed="true"] .gx-file-name { color: var(--gx-text-2); }
.gx-file-orig { color: var(--gx-caption); font-size: 10px; margin-left: 4px; text-decoration: line-through; }
.gx-file-stats { display: inline-flex; align-items: center; gap: 5px; font-family: var(--gx-mono); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.gx-add { color: var(--gx-added); }
.gx-del { color: var(--gx-deleted); }
.gx-stat-muted { color: var(--gx-caption); }

.gx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 4px;
  font-family: var(--gx-mono);
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1;
  background: color-mix(in oklab, currentColor 16%, transparent);
  color: var(--gx-text-2);
}
.gx-badge[data-status="added"] { color: var(--gx-added); }
.gx-badge[data-status="modified"] { color: var(--gx-modified); }
.gx-badge[data-status="deleted"] { color: var(--gx-deleted); }
.gx-badge[data-status="renamed"] { color: var(--gx-renamed); }
.gx-badge[data-status="copied"] { color: var(--gx-renamed); }
.gx-badge[data-status="typechange"] { color: var(--gx-modified); }
.gx-badge[data-status="untracked"] { color: var(--gx-untracked); }
.gx-badge[data-status="conflicted"] { color: var(--gx-conflict); }

.gx-vlist { position: relative; width: 100%; }
.gx-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--gx-row-h);
  padding: 0 10px 0 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--gx-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  white-space: nowrap;
}
.gx-row:hover { background: var(--gx-hover); }
.gx-row[data-selected="true"] { background: var(--gx-active); box-shadow: inset 2px 0 0 var(--gx-accent); }
.gx-row:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-graph { flex: none; display: block; overflow: visible; }
.gx-hash { flex: none; color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10.5px; }
.gx-subject { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
.gx-ref {
  position: relative;
  flex: none;
  max-width: 12ch;
  padding: 0 5px;
  border: 1px solid color-mix(in srgb, var(--gx-accent) 35%, transparent);
  border-radius: 999px;
  color: var(--gx-accent);
  font-family: var(--gx-mono);
  font-size: 9.5px;
  line-height: 15px;
}
.gx-ref-name { display: block; overflow: hidden; text-overflow: ellipsis; }
/* The chip lives inside the row button, whose title suppresses a child's native
   tooltip, so the full ref name is a hover label of its own. */
.gx-ref-tip {
  display: none;
  position: absolute;
  z-index: 5;
  top: calc(100% + 4px);
  right: 0;
  max-width: 48ch;
  padding: 2px 6px;
  border: 1px solid var(--gx-border);
  border-radius: 6px;
  background: var(--gx-panel-2);
  color: var(--gx-text);
  font-size: 10.5px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--gx-text) 16%, transparent);
  pointer-events: none;
}
.gx-ref:hover .gx-ref-tip { display: block; }
.gx-ref[data-kind="tag"] { color: var(--gx-modified); border-color: color-mix(in srgb, var(--gx-modified) 35%, transparent); }
.gx-author, .gx-time { flex: none; color: var(--gx-caption); font-size: 10.5px; }
.gx-author { max-width: 12ch; overflow: hidden; text-overflow: ellipsis; }
.gx-time { font-family: var(--gx-mono); font-variant-numeric: tabular-nums; min-width: 3ch; text-align: right; }

.gx-loadbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-top: 1px solid var(--gx-border-soft);
  color: var(--gx-caption);
  font-size: 10.5px;
}
.gx-loadbar .gx-spacer { flex: 1; }
.gx-loadbar .gx-del { max-width: 42ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-linkbtn {
  border: 0;
  background: transparent;
  color: var(--gx-accent);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}
.gx-linkbtn:hover:not(:disabled) { background: var(--gx-hover); }
.gx-linkbtn:disabled { opacity: .45; cursor: default; }

.gx-detail { display: flex; flex-direction: column; flex: none; height: 38%; min-height: 180px; border: 1px solid var(--gx-border); border-radius: 10px; background: var(--gx-panel); overflow: hidden; }
.gx-detail-head { display: flex; align-items: center; gap: 8px; flex: none; height: 28px; padding: 0 10px; border-bottom: 1px solid var(--gx-border-soft); color: var(--gx-text-2); font-size: 11px; font-weight: 600; }
.gx-detail-head .gx-hash { color: var(--gx-text-2); }
.gx-detail-body { flex: 1; min-height: 0; overflow: auto; padding: 8px 10px 10px; box-sizing: border-box; }
.gx-detail-subject { font-size: 13px; font-weight: 600; line-height: 1.4; word-break: break-word; }
.gx-detail-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; color: var(--gx-caption); font-size: 10.5px; }
.gx-detail-meta .gx-author { max-width: none; }
.gx-parents { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.gx-parents-label { color: var(--gx-caption); font-size: 10px; }
.gx-parent {
  border: 1px solid var(--gx-border);
  border-radius: 5px;
  background: transparent;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: 10px;
  padding: 1px 5px;
  cursor: pointer;
}
.gx-parent:hover { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 45%, transparent); }
.gx-body-text { margin: 8px 0 0; padding: 6px 8px; border-radius: 6px; background: var(--gx-panel-2); color: var(--gx-text-2); font-family: var(--gx-mono); font-size: 10.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.gx-detail-files { margin-top: 10px; }
.gx-detail-files-title { color: var(--gx-caption); font-size: 10px; letter-spacing: .02em; margin-bottom: 2px; }
.gx-detail-group { margin-top: 4px; }
.gx-detail-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10px; }
.gx-detail-file { display: grid; grid-template-columns: 15px minmax(0, 1fr) auto; align-items: center; gap: 6px; height: 20px; padding: 0 2px; }
.gx-detail-file .gx-file-name { font-size: 11px; }

.gx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  min-height: 120px;
  margin: 12px;
  padding: 18px;
  border: 1px dashed var(--gx-border);
  border-radius: 10px;
  color: var(--gx-text-2);
  text-align: center;
}
.gx-empty strong { color: var(--gx-text); font-size: 13px; font-weight: 600; }
.gx-empty span { color: var(--gx-caption); font-size: 11px; max-width: 46ch; }
.gx-empty .gx-btn { margin-top: 4px; border-color: var(--gx-border); }
.gx-empty-inline { min-height: 80px; margin: 8px; padding: 10px; }
.gx-skeleton { padding: 12px; color: var(--gx-caption); font-size: 11px; }

/* Session header branch action. It renders outside .gx-root, so it cannot use
   the panel variables above: every value is an alias token with a readable
   fallback, which keeps light and dark themes on the shell's own colours. */
.gx-branch-action { position: relative; display: inline-flex; align-items: center; }
.gx-branch-trigger {
  align-items: center;
  display: inline-flex;
  gap: 4px;
  min-height: 28px;
  max-width: 28ch;
  padding: 3px 2px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 6px);
  background: 0 0;
  color: var(--dsw-alias-label-tertiary, inherit);
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}
.gx-branch-trigger:hover,
.gx-branch-trigger:focus-visible,
.gx-branch-trigger[aria-expanded="true"] { color: var(--dsw-alias-label-primary, inherit); }
.gx-branch-trigger:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: -2px; }
.gx-branch-icon, .gx-branch-chevron { flex: none; display: block; }
.gx-branch-chevron { transition: transform .12s; }
.gx-branch-trigger[aria-expanded="true"] .gx-branch-chevron { transform: rotate(180deg); }
.gx-branch-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.gx-branch-panel {
  position: fixed;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 320px;
  max-width: calc(100vw - 16px);
  max-height: min(420px, calc(100vh - 24px));
  padding: 4px;
  box-sizing: border-box;
  border-radius: var(--dsw-radius-lg, 10px);
  background: var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-1, transparent));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px color-mix(in srgb, var(--dsw-alias-label-primary, currentColor) 16%, transparent));
  color: var(--dsw-alias-label-primary, inherit);
  font-size: 13px;
  line-height: 1.45;
}
.gx-branch-list { display: flex; flex-direction: column; gap: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.gx-branch-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 30px;
  padding: 5px 8px;
  border: 0;
  border-radius: var(--dsw-radius-md, 8px);
  background: transparent;
  color: var(--dsw-alias-label-primary, inherit);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.gx-branch-row:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.gx-branch-row:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: -2px; }
.gx-branch-row[data-current="true"] { color: var(--dsw-alias-brand-primary, inherit); }
.gx-branch-row:disabled { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); opacity: .55; cursor: default; }
.gx-branch-row-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
.gx-branch-tag {
  flex: none;
  padding: 0 6px;
  border: 1px solid color-mix(in srgb, currentColor 40%, transparent);
  border-radius: 999px;
  color: inherit;
  font-size: 10px;
  line-height: 15px;
  opacity: .85;
}
.gx-branch-error {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  margin-bottom: 2px;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-md, 8px);
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, currentColor) 12%, transparent);
  color: var(--dsw-alias-state-error-primary, currentColor);
  font-size: 12px;
}
.gx-branch-error-text { flex: 1; min-width: 0; word-break: break-word; }
.gx-branch-retry {
  flex: none;
  padding: 1px 6px;
  border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.gx-branch-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 10%, transparent)); }
.gx-branch-hint { padding: 8px 9px; color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); font-size: 12px; }


@media (max-width: 720px) {
  .gx-body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(140px, 34%) minmax(0, 1fr); }
  /* Stacked columns have no horizontal split to resize, so the handle and any
     persisted width (this rule wins the cascade over the variable) both go
     inert. */
  .gx-pane-handle { display: none; }
  .gx-author { display: none; }
}
`;function tt(t){if(t===void 0)return()=>{};if(t.querySelector(`style[data-dsh-style="${et}"]`)!==null)return()=>{};let n=t.createElement("style");return n.dataset.dshStyle=et,n.textContent=Qt,t.head.appendChild(n),()=>{n.remove()}}var x=require("react");var he=require("react");var w=require("react/jsx-runtime");function Zt(t){if(t===null)return;let e=t.ownerDocument;if(t.contains(e.activeElement))return;let n=t.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function en({stat:t}){return t===void 0?null:t.additions===null&&t.deletions===null?(0,w.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("span",{className:"gx-add",children:`+${String(t.additions??0)}`}),(0,w.jsx)("span",{className:"gx-del",children:`-${String(t.deletions??0)}`})]})}function nt({groups:t,stats:e,t:n,onOpen:r,claimFocus:a,onFocusClaimed:o}){let l=t.reduce((p,i)=>p+i.files.length,0),s=(0,he.useRef)(null);return(0,he.useEffect)(()=>{a&&(o(),Zt(s.current))},[a,o]),(0,w.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,w.jsxs)("header",{className:"gx-pane-head",children:[(0,w.jsx)("span",{children:n("changes.title")}),(0,w.jsx)("span",{className:"gx-count",children:l})]}),(0,w.jsx)("div",{className:"gx-scroll",children:l===0?(0,w.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,w.jsx)("strong",{children:n("changes.empty")})}):t.map(p=>(0,w.jsxs)("div",{children:[(0,w.jsxs)("div",{className:"gx-group-head",children:[(0,w.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,w.jsx)("span",{className:"gx-count",children:p.files.length})]}),p.files.map(i=>{let g=e.get(i.path),h=n(`status.${i.status}`);return(0,w.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${h} \xB7 ${n("changes.directory")}`:`${h} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,w.jsx)("span",{className:"gx-badge","data-status":i.status,children:de(i.status)}),(0,w.jsxs)("span",{className:"gx-file-name",children:[J(i.path),i.origPath===void 0?null:(0,w.jsx)("span",{className:"gx-file-orig",children:J(i.origPath)})]}),(0,w.jsx)("span",{className:"gx-file-stats",children:(0,w.jsx)(en,{stat:g})})]},i.path)})]},p.dir===""?".":p.dir))})]})}var j=require("react");var m=require("react/jsx-runtime");function tn({additions:t,deletions:e}){return t===null&&e===null?(0,m.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("span",{className:"gx-add",children:`+${String(t??0)}`}),(0,m.jsx)("span",{className:"gx-del",children:`-${String(e??0)}`})]})}function rt({sessionId:t,hash:e,remote:n,t:r,onSelect:a}){let[o,l]=(0,j.useState)({kind:"idle"}),[s,p]=(0,j.useState)(0),i=(0,j.useRef)(new Map);(0,j.useEffect)(()=>{if(e===void 0){l({kind:"idle"});return}let h=i.current.get(e);if(h!==void 0){l({kind:"ready",detail:h});return}if(n===void 0||t===void 0){l({kind:"failed",message:r("state.noService.description")});return}let c=!0;return l({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:t,hash:e})).then(R=>{if(!c)return;let b=$(R);if(!b.ok){l({kind:"failed",message:b.message});return}let k=b.result;k.ok?(i.current.set(e,k.detail),l({kind:"ready",detail:k.detail})):l({kind:"failed",message:k.error.message===""?k.error.code:k.error.message})}).catch(R=>{c&&l({kind:"failed",message:V(R)})}),()=>{c=!1}},[e,n,t,s,r]);let g=ue(o.kind==="ready"?o.detail:{hash:e??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,m.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,m.jsxs)("header",{className:"gx-detail-head",children:[(0,m.jsx)("span",{children:r("detail.title")}),e===void 0?null:(0,m.jsx)("span",{className:"gx-hash",children:g.shortHash}),(0,m.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,m.jsx)("div",{className:"gx-detail-body",children:o.kind==="idle"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):o.kind==="loading"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):o.kind==="failed"?(0,m.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,m.jsx)("strong",{children:r("detail.failed")}),(0,m.jsx)("span",{children:o.message}),(0,m.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>p(h=>h+1),children:r("action.retry")})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"gx-detail-subject",children:o.detail.subject}),(0,m.jsxs)("div",{className:"gx-detail-meta",children:[(0,m.jsx)("span",{className:"gx-author",children:o.detail.author}),(0,m.jsx)("span",{children:g.relative}),(0,m.jsx)("span",{title:new Date(o.detail.time*1e3).toLocaleString(),children:new Date(o.detail.time*1e3).toLocaleDateString()})]}),(0,m.jsxs)("div",{className:"gx-parents",children:[(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),o.detail.parents.length===0?(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):o.detail.parents.map(h=>(0,m.jsx)("button",{type:"button",className:"gx-parent",title:h,onClick:()=>a(h),children:h.slice(0,7)},h))]}),o.detail.body===""?null:(0,m.jsx)("pre",{className:"gx-body-text",children:o.detail.body}),(0,m.jsxs)("div",{className:"gx-detail-files",children:[(0,m.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(o.detail.files.length)}`}),o.detail.files.length===0?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Ne(o.detail.files).map(h=>(0,m.jsxs)("div",{className:"gx-detail-group",children:[(0,m.jsx)("div",{className:"gx-detail-dir",children:h.dir===""?r("changes.root"):h.dir}),h.files.map(c=>(0,m.jsxs)("div",{className:"gx-detail-file",children:[(0,m.jsx)("span",{className:"gx-badge","data-status":c.status,children:de(c.status)}),(0,m.jsxs)("span",{className:"gx-file-name",children:[J(c.path),c.origPath===void 0?null:(0,m.jsx)("span",{className:"gx-file-orig",children:J(c.origPath)})]}),(0,m.jsx)("span",{className:"gx-file-stats",children:(0,m.jsx)(tn,{additions:c.additions,deletions:c.deletions})})]},c.path))]},h.dir===""?".":h.dir))]})]})})]})}var _=require("react");var ne=require("react/jsx-runtime");function ot(t){return`var(--gx-lane-${String(Math.abs(t)%8)})`}function at({row:t,laneCount:e,height:n}){let r=Math.min(116,Math.max(16,e*12)),a=r/Math.max(1,e),o=p=>p*a+a/2,l=n/2,s=t.segments.map((p,i)=>{let g=o(p.from),h=o(p.to),c=p.kind==="pass"?`M ${String(g)} 0 L ${String(h)} ${String(n)}`:p.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(l)}`:`M ${String(g)} ${String(l)} C ${String(g)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(n)}`;return(0,ne.jsx)("path",{d:c,fill:"none",stroke:ot(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(i)}`)});return(0,ne.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,ne.jsx)("circle",{cx:o(t.lane),cy:l,r:t.merge?4:3.2,fill:ot(t.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var v=require("react/jsx-runtime"),me=24,it=100;function nn({commit:t,row:e,laneCount:n,top:r,selected:a,head:o,onSelect:l}){return(0,v.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":a?"true":"false","data-head":o?"true":"false","data-testid":"git-history-row",title:`${t.hash.slice(0,7)} ${t.subject}`,onClick:()=>l(t.hash),children:[e===void 0?(0,v.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,v.jsx)(at,{row:e,laneCount:n,height:me}),(0,v.jsx)("span",{className:"gx-hash",children:t.hash.slice(0,7)}),(0,v.jsx)("span",{className:"gx-subject",children:t.subject}),t.refs.slice(0,2).map(s=>(0,v.jsxs)("span",{className:"gx-ref","data-kind":s.kind,children:[(0,v.jsx)("span",{className:"gx-ref-name",children:s.name}),(0,v.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:s.name})]},`${s.kind}:${s.name}`)),(0,v.jsx)("span",{className:"gx-author",children:t.author}),(0,v.jsx)("span",{className:"gx-time",title:new Date(t.time*1e3).toLocaleString(),children:Me(t.time)})]})}function st(t){let{commits:e,graph:n,selectedHash:r,headHash:a,total:o,hasMore:l,loadingMore:s,loadError:p,t:i,onSelect:g,onLoadMore:h}=t,c=(0,_.useRef)(null),[R,b]=(0,_.useState)(0),[k,S]=(0,_.useState)(0),M=(0,_.useRef)(!1);(0,_.useEffect)(()=>{let D=c.current;if(D===null)return;let P=()=>S(D.clientHeight);if(P(),typeof ResizeObserver>"u")return;let B=new ResizeObserver(P);return B.observe(D),()=>B.disconnect()},[]),(0,_.useEffect)(()=>{s||(M.current=!1)},[s]);let y=(0,_.useCallback)(()=>{!l||s||M.current||(M.current=!0,h())},[l,s,h]),H=D=>{let P=D.currentTarget;b(P.scrollTop),P.scrollTop+P.clientHeight>=P.scrollHeight-160&&y()},G=ge(e,{scrollTop:R,height:k===0?480:k,rowHeight:me}),E=Math.max(1,Ze(n));return(0,v.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,v.jsxs)("header",{className:"gx-pane-head",children:[(0,v.jsx)("span",{children:i("history.title")}),(0,v.jsx)("span",{className:"gx-count",children:`${String(e.length)} / ${String(o)}`})]}),e.length===0?(0,v.jsxs)("div",{className:"gx-empty",children:[(0,v.jsx)("strong",{children:t.emptyTitle??i("history.empty")}),t.emptyDescription===void 0?null:(0,v.jsx)("span",{children:t.emptyDescription}),t.onRetry===void 0?null:(0,v.jsx)("button",{type:"button",className:"gx-btn",onClick:t.onRetry,children:t.retryLabel??i("action.retry")})]}):(0,v.jsx)("div",{className:"gx-scroll",ref:c,onScroll:H,"data-testid":"git-history-scroll",children:(0,v.jsx)("div",{className:"gx-vlist",style:{height:e.length*me},children:G.rows.map((D,P)=>{let B=G.startIndex+P;return(0,v.jsx)(nn,{commit:D,row:n[B],laneCount:E,top:B*me,selected:D.hash===r,head:D.hash===a,onSelect:g},D.hash)})})}),(0,v.jsxs)("footer",{className:"gx-loadbar",children:[(0,v.jsx)("span",{children:`${i("history.loaded")} ${String(e.length)}`}),p===void 0?null:(0,v.jsx)("span",{className:"gx-del",children:p}),(0,v.jsx)("span",{className:"gx-spacer"}),l?(0,v.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:y,children:i(s?"history.loading":"history.loadMore")}):(0,v.jsx)("span",{children:e.length===0?"":i("history.noMore")})]})]})}var Pe="git-explorer.leftColumnWidth";function Te(t){return Math.min(560,Math.max(240,t))}function dt(t){if(t==null)return null;let e;try{e=t.getItem(Pe)}catch{return null}if(e===null)return null;let n=Number(e);return!Number.isFinite(n)||n<240||n>560?null:n}function fe(t,e){let n=Math.round(Te(e));if(t!=null)try{t.setItem(Pe,String(n))}catch{}return n}function ct(t){if(t!=null)try{t.removeItem(Pe)}catch{}}function ut(t,e){return Math.round(t)===Math.round(e)}var lt=16;function pt(t,e){if(e)return null;switch(t){case"ArrowLeft":return{kind:"nudge",delta:-lt};case"ArrowRight":return{kind:"nudge",delta:lt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var f=require("react/jsx-runtime");function rn(t,e){return t===void 0?"idle":e?"loading":"no-service"}function ht(t,e){let n=Je(t);return n!==void 0&&e.select(n.hash),e.complete?.(),n!==void 0}var on={display:"flex",alignItems:"center",gap:8};function an(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var sn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function xe({title:t,description:e,actionLabel:n,onAction:r}){return(0,f.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,f.jsx)("strong",{children:t}),e===void 0?null:(0,f.jsx)("span",{children:e}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function ln(t){return t.split(/[\\/]/u).filter(Boolean).at(-1)??t}function mt(t){let{workbench:e,version:n,t:r,remote:a}=t;function o(l){let s=l.sessionId??e.currentSessionId(),p=(0,x.useRef)(s);p.current=s;let i=(0,x.useMemo)(()=>a(),[a]),[g,h]=(0,x.useState)(()=>({kind:rn(s,i!==void 0)})),[c,R]=(0,x.useState)(0),[b,k]=(0,x.useState)([]),[S,M]=(0,x.useState)(!1),[y,H]=(0,x.useState)(!1),[G,E]=(0,x.useState)(void 0),[D,P]=(0,x.useState)(void 0),B=(0,x.useRef)(void 0),Q=(0,x.useRef)(void 0),[re,C]=(0,x.useState)(!0),A=(0,x.useMemo)(()=>an(),[]),[q,K]=(0,x.useState)(()=>dt(A)),be=(0,x.useRef)(null),U=(0,x.useRef)(null),oe=(0,x.useCallback)(d=>{B.current=d,P(d),C(!1)},[]),Rt=(0,x.useCallback)(()=>{C(!1)},[]),Ct=(0,x.useCallback)(d=>{if(d.button!==0||U.current!==null||sn())return;let u=be.current?.previousElementSibling;if(u instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}U.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:u.getBoundingClientRect().width,restWidth:q},document.body.classList.add("gx-pane-resizing")}},[q]),St=(0,x.useCallback)(d=>{let u=U.current;u===null||u.pointerId!==d.pointerId||K(Te(u.baseWidth+d.clientX-u.startX))},[]),ve=(0,x.useCallback)(d=>{let u=U.current;if(u===null||u.pointerId!==d.pointerId)return;U.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let L=u.baseWidth+d.clientX-u.startX;if(ut(L,u.baseWidth)){K(u.restWidth);return}K(fe(A,L))},[A]),we=(0,x.useCallback)(()=>{ct(A),K(null)},[A]),Lt=(0,x.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let u=pt(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(u===null)return;if(d.preventDefault(),d.stopPropagation(),u.kind==="reset"){we();return}if(u.kind==="min"||u.kind==="max"){let W=u.kind==="min"?240:560;K(fe(A,W));return}let L=be.current?.previousElementSibling,F=L instanceof HTMLElement?L.getBoundingClientRect().width:q??240;K(fe(A,F+u.delta))},[A,we,q]);(0,x.useEffect)(()=>()=>{U.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(s===void 0||l.openView===void 0)return;let d=e.views;if(d?.bind!==void 0)return d.bind(s,l.openView)},[s,l.openView,e]),(0,x.useEffect)(()=>{if(s===void 0){h({kind:"idle"});return}if(i===void 0){h({kind:"no-service"});return}let d=!0;return h({kind:"loading"}),E(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:s})).then(u=>{if(!d)return;let L=$(u);if(!L.ok){h({kind:"failed",message:L.message});return}let F=L.result;if(!F.ok){h({kind:"failed",message:F.error.message===""?F.error.code:F.error.message});return}let W=F.snapshot;h({kind:"ready",snapshot:W}),k(W.commits),M(W.commits.length<W.counts.commits);let X=B.current;B.current=void 0,P(Z=>X!==void 0?X:Z!==void 0&&W.commits.some(ae=>ae.hash===Z)?Z:W.commits[0]?.hash)}).catch(u=>{d&&h({kind:"failed",message:V(u)})}),()=>{d=!1}},[s,i,c]),(0,x.useEffect)(()=>{let d=l.viewRequest;if(d==null||d.view!==ee)return;let u=`${d.view}:${d.focus}`;Q.current!==u&&(Q.current=u,ht(d.focus,{select:oe,complete:()=>l.completeViewRequest?.()}))},[l.viewRequest,l.completeViewRequest,oe]),(0,x.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||s===void 0)return;let u=()=>{let L=d.take(ee);L!==void 0&&ht(L,{select:oe})};return u(),d.subscribe(u)},[e,s,oe]);let Et=(0,x.useMemo)(()=>Qe(b),[b]),I=g.kind==="ready"?g.snapshot:void 0,De=(0,x.useMemo)(()=>I===void 0?[]:ce(I.status),[I]),Nt=(0,x.useMemo)(()=>{let d=new Map;for(let u of I?.stats??[])d.set(u.path,{additions:u.additions,deletions:u.deletions});return d},[I]),Ie=(0,x.useMemo)(()=>{let d=new Map;for(let u of I?.branches??[]){let L=d.get(u.hash);L===void 0?d.set(u.hash,[{kind:u.kind,name:u.name,head:u.head}]):L.push({kind:u.kind,name:u.name,head:u.head})}return d},[I]),Mt=(0,x.useCallback)(()=>{if(s===void 0||i===void 0||!S||y)return;let d=s;H(!0),E(void 0),Promise.resolve().then(()=>i.query({sessionId:s,skip:b.length,limit:it})).then(u=>{if(p.current!==d)return;let L=$(u);if(!L.ok){E(L.message);return}let F=L.result;if(!F.ok){E(F.error.message===""?F.error.code:F.error.message);return}let W=F.page;k(X=>{let Z=new Set(X.map(Y=>Y.hash)),ae=W.commits.filter(Y=>!Z.has(Y.hash)).map(Y=>({...Y,refs:Ie.get(Y.hash)??[]}));return ae.length===0?X:[...X,...ae]}),M(W.hasMore)}).catch(u=>E(V(u))).finally(()=>H(!1))},[s,i,S,y,b.length,Ie]),Pt=(0,x.useMemo)(()=>{let d=e.views??{open:(u,L)=>e.openView?.(u,L)??!1};return pe({views:d,sessionId:s??""})},[e,s]),Tt=(d,u=1)=>{s!==void 0&&Pt(d,u)},Gt=()=>R(d=>d+1),ke=()=>R(d=>d+1),z=I?.head,Dt=De.reduce((d,u)=>d+u.files.length,0);return(0,f.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,f.jsxs)("header",{className:"gx-head",children:[(0,f.jsxs)("div",{className:"gx-head-main",children:[(0,f.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,f.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,f.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,f.jsx)("span",{className:"gx-repo",title:I?.root??r("view.title"),children:I===void 0?r("view.title"):ln(I.root)}),z?.branch===null||z?.branch===void 0?null:(0,f.jsx)("span",{className:"gx-branch",children:z.branch}),z?.detached===!0?(0,f.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,z?.ahead!==void 0&&z.ahead>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(z.ahead)}`}):null,z?.behind!==void 0&&z.behind>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(z.behind)}`}):null]}),(0,f.jsxs)("div",{className:"gx-head-meta",style:on,children:[I===void 0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("span",{children:[r("head.changes")," ",(0,f.jsx)("b",{children:Dt})]}),(0,f.jsxs)("span",{children:[r("head.commits")," ",(0,f.jsx)("b",{children:I.counts.commits})]}),(0,f.jsxs)("span",{children:[r("head.branches")," ",(0,f.jsx)("b",{children:I.counts.branches})]})]}),(0,f.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:Gt,children:"\u21BB"})]})]}),s===void 0?(0,f.jsx)(xe,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,f.jsx)(xe,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,f.jsx)(xe,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:ke}):g.kind==="ready"&&!g.snapshot.isRepository?(0,f.jsx)(xe,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:ke}):g.kind==="ready"?(0,f.jsxs)("div",{className:"gx-body",style:q===null?void 0:{"--gx-left-col":`${q}px`},children:[(0,f.jsx)(nt,{groups:De,stats:Nt,t:r,onOpen:Tt,claimFocus:re,onFocusClaimed:Rt}),(0,f.jsx)("div",{ref:be,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":q??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ct,onPointerMove:St,onPointerUp:ve,onPointerCancel:ve,onLostPointerCapture:ve,onKeyDown:Lt,onDoubleClick:we}),(0,f.jsxs)("div",{className:"gx-col",children:[(0,f.jsx)(st,{commits:b,graph:Et,selectedHash:D,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:S,loadingMore:y,loadError:G,t:r,onSelect:P,onLoadMore:Mt,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:ke,retryLabel:r("action.retry")}:{}}),(0,f.jsx)(rt,{sessionId:s,hash:D,remote:i,t:r,onSelect:P})]})]}):null]})}return o}var xt=["slots","locale","workbench","remote"];function ft(t){if(t===null||typeof t!="object")return!1;let e=t;return typeof e.snapshot=="function"&&typeof e.query=="function"&&typeof e.commit=="function"}function yt(t){return()=>{try{let n=t.remote?.gitExplorer;if(ft(n))return n}catch{}try{let n=t.get?.("remote.gitExplorer");if(ft(n))return n}catch{}let e=bt(t);return e===void 0?void 0:We(e)}}function bt(t){let n=t.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,a,o)=>n.call("/api",`${Be}/${r}`,a,o)}var ye;function vt(t){let e=t.locale.bind(te);ye?.();let n=t.locale.register(te,{zh:He,en:Fe});ye=n;let r=tt(typeof document>"u"?void 0:document),a=yt(t),o=Ue({store:_e(a),t:e});t.slots.inject(Se,()=>t.slots.register({name:Se,id:Ae,order:30,locale:te},o));let l=t.workbench;if(l!=null){let s=mt({workbench:l,version:l.version,t:e,remote:a});t.slots.inject(Ce,()=>t.slots.register({name:Ce,id:ee,order:110,label:()=>e("tab.label"),locale:te},s))}return()=>{r(),n(),ye===n&&(ye=void 0)}}var wt={groupChanges:ce,formatCommitDetail:ue,createJump:pe,computeWindow:ge},kt={name:"dsh-git-explorer",inject:xt,apply:vt,__test:wt},un=kt;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
