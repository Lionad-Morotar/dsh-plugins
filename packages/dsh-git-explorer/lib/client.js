window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var qe=Object.defineProperty;var pn=Object.getOwnPropertyDescriptor;var hn=Object.getOwnPropertyNames;var gn=Object.prototype.hasOwnProperty;var fn=(e,t)=>{for(var n in t)qe(e,n,{get:t[n],enumerable:!0})},mn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of hn(t))!gn.call(e,o)&&o!==n&&qe(e,o,{get:()=>t[o],enumerable:!(r=pn(t,o))||r.enumerable});return e};var xn=e=>mn(qe({},"__esModule",{value:!0}),e);var lr={};fn(lr,{__test:()=>sn,apply:()=>an,boot:()=>bt,clientPlugin:()=>ln,createRemoteResolver:()=>rn,createRpcCall:()=>on,default:()=>sr,inject:()=>nn});module.exports=xn(lr);var it={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},st={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var je="conversation.view",Se="git-explorer";var Ue="conversation.session.header.actions",lt="git-branch";var Re="git-explorer",dt="gitExplorer";var M=require("react");var ct=Object.freeze([]);function ut(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:ct}));let r=[];return e.forEach((o,a)=>{let i=bn(o.name,n);i!==void 0&&r.push({match:{branch:o,ranges:yn(i)},order:a,run:vn(i)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function Je(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&Xe(n.branch))return t}return-1}function pt(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return Je(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&Xe(o.branch))return r}return t}function ht(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!Xe(n.branch)))return n.branch}function Xe(e){return e.worktreePath===void 0}function bn(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),i=-1;for(let s=r;s<e.length;s+=1)if(e.charAt(s).toLowerCase()===a){i=s;break}if(i===-1)return;n.push(i),r=i+1}return n}function yn(e){let t=e[0];if(t===void 0)return ct;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let i=e[a];if(i!==void 0){if(i===o){o=i+1;continue}n.push([r,o]),r=i,o=i+1}}return n.push([r,o]),n}function vn(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function gt(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function le(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function de(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Ne="service-unavailable",wn=Object.freeze({status:"idle",revision:0,sessionId:null}),Qe;function kn(e){let t=wn,n=-1,r=0,o=new Set,a=l=>{t=l;for(let b of[...o])b()},i=l=>t.sessionId===l&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(l){return o.add(l),()=>{o.delete(l)}},getSnapshot:()=>t,load:async l=>{if(i(l))return;let b=e(),d=++r,m=t.revision,z=t.sessionId===l;a({status:"loading",...z&&t.list!==void 0?{list:t.list}:{},revision:m,sessionId:l});let R=()=>d!==r||t.revision!==m;if(typeof b?.branches!="function"){if(R())return;a({status:"error",error:Ne,revision:m,sessionId:l});return}try{let L=await b.branches({sessionId:l});if(R())return;let C=le(L);if(!C.ok){a({status:"error",error:C.message,revision:m,sessionId:l});return}if(C.result.ok===!1){a({status:"error",error:C.result.error.message,revision:m,sessionId:l});return}n=m,a({status:"ready",list:C.result.list,revision:m,sessionId:l})}catch(L){if(R())return;a({status:"error",error:de(L),revision:m,sessionId:l})}},switchTo:async(l,b)=>{let d=()=>t.sessionId!==l,m=e();if(typeof m?.switchBranch!="function")return d()||a({...t,error:Ne}),{switched:!1};try{let z=await m.switchBranch({sessionId:l,name:b}),R=le(z),L=R.ok?R.result.ok===!1?R.result.error.message:void 0:R.message;if(L!==void 0)return d()||a({...t,error:L}),{switched:!1};if(d())return{switched:!0};let C=R.ok&&R.result.ok===!0?R.result:void 0,D=C===void 0?b:C.branch,g=t.list;return a({status:g===void 0?t.status:"ready",...g===void 0?{}:{list:{...g,detached:!1,headHash:null,branches:g.branches.map(W=>({...W,current:W.name===D}))}},revision:t.revision+1,sessionId:l}),C===void 0||C.stash===void 0?{switched:!0}:{switched:!0,stash:C.stash}}catch(z){return d()||a({...t,error:de(z)}),{switched:!1}}},bump(){a({...t,revision:t.revision+1})}}}function Cn(e){return Qe=kn(e),Qe}var ft=Cn;function mt(){return Qe}var ue=require("react"),Sn=Object.freeze({}),Pe=null,Ye;function bt(e){Pe=e}function yt(){if(Ye!=null)return Ye;if(Pe===null)return Sn;let e=xt(Pe,"@deepseek-ai/dsh-client-ui-primitives"),t=xt(Pe,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,i=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof i=="function"?{createPortal:i}:{}}}function xt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var vt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},wt=e=>(0,ue.createElement)("svg",{...vt,className:e.className},(0,ue.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,ue.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,ue.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,ue.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,ue.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),kt=e=>(0,ue.createElement)("svg",{...vt,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,ue.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var T=require("react/jsx-runtime"),Ct=320,Rn="min(420px, 100vw - 32px)",St=5,Ge=8;function En(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:St,margin:Ge})??void 0:Mn(t,n)}function Mn(e,t){let[n,r]=(0,M.useState)(void 0);return(0,M.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let i=a.getBoundingClientRect(),s=Math.min(Ct,Math.max(160,window.innerWidth-Ge*2)),p=Math.min(Math.max(i.right-s,Ge),window.innerWidth-s-Ge);r({left:p,top:i.bottom+St,width:s})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function Tn(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}Ln(t,n,o,a)}function Ln(e,t,n,r){(0,M.useEffect)(()=>{if(!n)return;let o=a=>{let i=a.target;i instanceof Node&&e.current?.contains(i)!==!0&&t.current?.contains(i)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function Nn(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[i,s]=o;i>r&&n.push((0,T.jsx)("span",{children:e.slice(r,i)},`plain-${a}`)),n.push((0,T.jsx)("span",{className:"gx-branch-match",children:e.slice(i,s)},`hit-${a}`)),r=s}),r<e.length&&n.push((0,T.jsx)("span",{children:e.slice(r)},"tail")),n}function Pn(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function Gn(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let a=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${a}`)}if(e.untrackedFiles>0){let a=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${a}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function Rt({store:e,t}){function n({sessionId:r}){let o=(0,M.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,i]=(0,M.useState)(!1),[s,p]=(0,M.useState)(""),[l,b]=(0,M.useState)(-1),[d,m]=(0,M.useState)(null),[z,R]=(0,M.useState)(null),L=(0,M.useRef)(r);L.current=r;let C=(0,M.useRef)(null),D=(0,M.useRef)(null),g=(0,M.useRef)(null),W=(0,M.useRef)(null),I=(0,M.useRef)(null),f=(0,M.useRef)(!1),v=(0,M.useId)(),u=(0,M.useId)(),w=yt(),H=w.createPortal!==void 0,ee=w.IconBranch??wt,oe=w.IconChevron??kt,N=o.list,J=N===void 0?void 0:Pn(N.root),$=(0,M.useMemo)(()=>ut(N?.branches??[],s),[N,s]),te=(0,M.useCallback)(()=>{i(!1),p(""),R(null)},[]),ae=(0,M.useCallback)(()=>{f.current=!0,te(),D.current?.focus({preventScroll:!0})},[te]),E=(0,M.useCallback)(()=>{f.current=!0,te()},[te]);(0,M.useEffect)(()=>{te(),m(null),r!==void 0&&e.load(r)},[e,r,te]),(0,M.useLayoutEffect)(()=>{a&&W.current?.focus({preventScroll:!0})},[a]),(0,M.useLayoutEffect)(()=>{if(a||!f.current)return;f.current=!1;let S=document.activeElement;(S===null||S===document.body||S===D.current||C.current?.contains(S)===!0)&&D.current?.focus({preventScroll:!0})},[a]),(0,M.useEffect)(()=>{b(Je($))},[$]),(0,M.useEffect)(()=>{I.current?.scrollIntoView?.({block:"nearest"})},[l,$]),(0,M.useEffect)(()=>{if(!a)return;let S=Y=>{Y.key!=="Escape"||Y.isComposing||(Y.preventDefault(),ae())};return document.addEventListener("keydown",S),()=>document.removeEventListener("keydown",S)},[a,ae]);let G=En(w,a,D,g);Tn(w,C,g,H,a,E);let O=()=>{if(a){te();return}i(!0),r!==void 0&&e.load(r)},X=()=>{r!==void 0&&e.load(r)},re=async S=>{if(d!==null||S.worktreePath!==void 0)return;if(S.current){ae();return}if(r===void 0)return;m(S.name);let Y=await e.switchTo(r,S.name);if(L.current===r&&(m(null),!!Y.switched)){if(e.load(r),Y.stash?.conflict===!0){R(Y.stash);return}ae()}},me=()=>{let S=ht($,l);S!==void 0&&re(S)},pe=S=>{if(!(S.metaKey||S.ctrlKey||S.altKey)&&!S.nativeEvent.isComposing){if(S.key==="ArrowDown"||S.key==="ArrowUp"){S.preventDefault();let Y=S.key==="ArrowDown"?1:-1;b(q=>pt($,q,Y));return}S.key==="Enter"&&(S.preventDefault(),me())}};if(r===void 0)return null;let be=N?.branches.find(S=>S.current)?.name,Te=N===void 0?t("branch.loading"):N.detached?N.headHash??t("head.detached"):be??t("branch.unborn");if(!a&&N?.isRepository!==!0)return null;let We=`${t("head.detached")} ${N?.headHash??""}`.trim(),ye=N?.detached===!0?We:Te,he=N?.isRepository===!0?N.worktree:void 0,Q=he===void 0?void 0:Gn(he,t),_e=t("branch.worktreeSep"),Ke=Q===void 0?ye:Q.description,j=Q===void 0||he?.dirty!==!0?`${t("branch.title")}: ${ye}`:`${t("branch.title")}: ${ye}${_e}${Q.description}`,ke=o.error===Ne?t("state.noService.title"):o.error,Le=(0,T.jsxs)("div",{ref:g,id:u,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:Ct,maxWidth:Rn,...G},children:[z?.conflict===!0?(0,T.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,T.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),z.message===void 0||z.message===""?null:(0,T.jsx)("span",{className:"gx-branch-warning-detail",children:z.message})]}):null,N===void 0||J===void 0?null:(0,T.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:N.root,children:[(0,T.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,T.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,T.jsx)("span",{className:"gx-branch-scope-parent",children:J.parent}),(0,T.jsx)("span",{className:"gx-branch-scope-name",children:J.name})]})]}),(0,T.jsx)("input",{ref:W,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:s,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":N===void 0?void 0:v,"aria-activedescendant":l>=0&&N!==void 0?`${v}-option-${l}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:S=>p(S.target.value),onKeyDown:pe}),ke!==void 0?(0,T.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,T.jsx)("span",{className:"gx-branch-error-text",children:ke}),(0,T.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:X,children:t("action.retry")})]}):null,o.status==="loading"&&N===void 0?(0,T.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,N!==void 0?(0,T.jsxs)("div",{className:"gx-branch-list",id:v,role:"listbox","aria-label":t("branch.title"),children:[N.branches.length===0?(0,T.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,N.branches.length>0&&$.length===0?(0,T.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,$.map((S,Y)=>{let q=S.branch,Ce=Y===l;return(0,T.jsxs)("button",{ref:Ce?I:void 0,type:"button",role:"option",id:`${v}-option-${Y}`,"aria-selected":Ce,"data-active":Ce?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${q.name}`,"data-current":q.current?"true":void 0,"aria-current":q.current?"true":void 0,title:q.worktreePath===void 0?q.name:`${q.name} ${t("branch.worktree")}: ${q.worktreePath}`,disabled:d!==null||q.worktreePath!==void 0,onClick:()=>{re(q)},children:[(0,T.jsx)("span",{className:"gx-branch-row-name",children:Nn(q.name,S.ranges)}),q.worktreePath===void 0?null:(0,T.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),q.current?(0,T.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},q.name)})]}):null]});return(0,T.jsxs)("div",{className:"gx-branch-action",ref:C,children:[(0,T.jsxs)("button",{ref:D,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":j,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?u:void 0,title:Ke,onClick:O,children:[(0,T.jsx)(ee,{className:"gx-branch-icon"}),(0,T.jsx)("span",{className:"gx-branch-name",title:ye,children:Te}),Q===void 0||he?.dirty!==!0?null:(0,T.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:Q.dot?t("branch.worktreeDirty"):void 0,children:[Q.additions>0?(0,T.jsxs)("span",{className:"gx-branch-add",children:["+",Q.additions]}):null,Q.deletions>0?(0,T.jsxs)("span",{className:"gx-branch-del",children:["\u2212",Q.deletions]}):null,Q.dot?(0,T.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,T.jsx)(oe,{className:"gx-branch-chevron"})]}),a?w.createPortal===void 0?Le:w.createPortal(Le,document.body):null]})}return n}function Et(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function De(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function Fe(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function Mt(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var Dn={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Ee(e){return Dn[e]}var Tt={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Fn(e,t){return(Tt[e]??0)>=(Tt[t]??0)?e:t}function Lt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function Ze(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function Hn(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:Fn(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let i=a[0];if(i==="1"){let s=a.slice(2),p=s.slice(0,2),l=Ze(s,7);l!==""&&r({path:l,status:Lt(p),staged:p[0]!==".",isDirectory:!1})}else if(i==="2"){let s=a.slice(2),p=s.slice(0,2),l=Ze(s,8),b=t[o+1]??"";l!==""&&b!==""&&(o+=1,r({path:l,status:Lt(p),staged:p[0]!==".",isDirectory:!1,origPath:b}))}else if(i==="u"){let s=a.slice(2),p=Ze(s,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(i==="?"){let s=a.slice(2);if(s==="")continue;let p=s.endsWith("/");r({path:p?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function In(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function et(e){let t=new Map;for(let n of e){let r=In(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function He(e){return et(Hn(e))}function tt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let i=Math.floor(a/7);if(i<5)return`${i}w`;let s=Math.floor(a/30);return s<12?`${s}mo`:`${Math.floor(a/365)}y`}function Ie(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:tt(e.time,t)}}function Ae({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function Nt({seam:e,sessionId:t}){return(n,r,o=1)=>{let a=typeof n=="string"?n.trim().toLowerCase():"";if(a===""||typeof r!="string")return;let i=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i==="")return;let s=Number.isFinite(o)&&o>0?Math.floor(o):1,p=`git:${a}:${String(s)}:${i}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",p);let l=e.openViewOrSwitch("fs-explorer",p);if(l.focused){e.viewFocus?.take?.("fs-explorer");return}if(l.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",p)!==!0&&e.openView?.("fs-explorer",p)!==!0&&e.viewFocus?.request?.("fs-explorer",p)}}var An=/^commit:([0-9a-f]{4,64})$/iu;function Pt(e){if(e===void 0)return;let t=An.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var we=24;function Be(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),i=Math.max(0,e.length-a-o*2),s=Math.floor(Math.max(0,t.scrollTop)/n)-o,p=Math.min(Math.max(s,0),i),l=Math.min(e.length,p+a+o*2);return{rows:e.slice(p,l),startIndex:p,endIndex:l}}function Gt(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return Et({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function Dt(e){let t=[],n=[],r=[],o=0,a=[],i=()=>r.length===0?o++:(r.sort((b,d)=>b-d),r.shift()??o++),s=l=>{l!==null&&!r.includes(l)&&r.push(l)},p=()=>{let l=t.indexOf(null);return l>=0?l:(t.push(null),n.push(null),t.length-1)};for(let l of e){let b=[...t],d=[...n],m=b.indexOf(l.hash),z=m>=0;z||(m=p());let R=z?n[m]??null:null;R===null&&(R=i(),n[m]=R);for(let g=0;g<b.length;g+=1)g!==m&&b[g]===l.hash&&(s(n[g]??null),t[g]=null,n[g]=null);let L=l.parents[0];L===void 0?(s(n[m]??null),t[m]=null,n[m]=null):(t[m]=L,n[m]=R);let C=[];for(let g=1;g<l.parents.length;g+=1){let W=l.parents[g];if(W===void 0)continue;let I=t.indexOf(W);I<0&&(I=p(),t[I]=W),n[I]===null&&(n[I]=i()),C.push(I)}let D=[];for(let g=0;g<b.length;g+=1){let W=b[g];if(W===null)continue;let I=d[g]??R;W===l.hash?D.push({kind:"into",from:g,to:m,color:I}):D.push({kind:"pass",from:g,to:g,color:I})}L!==void 0&&D.push({kind:"out",from:m,to:m,color:n[m]??R});for(let g of C)D.push({kind:"out",from:m,to:g,color:n[g]??R});for(a.push({lane:m,color:R,merge:l.parents.length>=2,segments:D});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function Ft(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function xe(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Ht(e,t){return`${e.trim().toLowerCase()}\0${t}`}function It(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let a=n.keys().next();a.done||n.delete(a.value)}},get size(){return n.size}}}function At(e,t,n,r=10,o=8){let a=Math.max(o,n.width-t.width-o),i=e.right+r;i>a&&(i=e.left-t.width-r,i<o&&(i=Math.min(a,Math.max(o,e.left))));let s=Math.max(o,n.height-t.height-o),p=e.bottom+r,l=e.top-t.height-r,b;return p<=s?b=Math.max(o,p):l>=o?b=l:b=Math.min(s,Math.max(o,e.top)),{left:i,top:b}}var Bt="dsh-git-explorer-styles",Bn=`
/* The token block is shared with the hover card because the card portals out of
   .gx-root and would otherwise lose the theme variables with it. */
.gx-root, .gx-preview {
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
}
.gx-root {
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
/* The filter seat sits in the header, so it keeps the header's type scale and
   only grows a hairline: a full input chrome would outweigh the row list. */
.gx-filter {
  flex: none;
  width: 132px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 5px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  color: var(--gx-text);
  font: inherit;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  outline: none;
}
.gx-filter::placeholder { color: var(--gx-caption); }
.gx-filter:hover { background: color-mix(in srgb, currentColor 11%, transparent); }
.gx-filter:focus { border-color: var(--gx-accent); background: transparent; }
/* The search reads as an input rather than as a text field with a control bar:
   the native cancel affordance is the only chrome the seat needs. */
.gx-filter::-webkit-search-cancel-button { cursor: pointer; }
/* The in-flight note lives in the footer, where the row count already reports
   progress; it is caption-weight so it never competes with a load error. */
.gx-search-status { color: var(--gx-caption); }
.gx-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  /* The keyboard cursor lives here, so the container must not grow a second ring
     on top of the row it already outlines. */
  outline: none;
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
/* A group header is a cursor stop too, so it needs the same stroke the file rows
   use. -2px rather than -1.5px because the header is only 22px tall and is
   already separated by hairlines; the softer inset keeps the stroke off them. */
.gx-group-head[data-cursor="true"] { outline: 1.5px solid var(--gx-accent); outline-offset: -2px; }

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
/* The keyboard cursor, in the same language as the file tree: a 1.5px inset
   stroke that reads as "this row" without competing with the selection wash. */
.gx-file[data-cursor="true"] { outline: 1.5px solid var(--gx-accent); outline-offset: -1.5px; z-index: 1; }
/* The cursor outlives the pointer leaving the row, so it reuses the hover wash
   instead of inventing a second selection colour. */
.gx-file[data-cursor="true"]:hover { background: var(--gx-hover); }
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
/* Same cursor language as the changes pane and the file tree. z-index keeps
   the stroke above the neighbouring rows, which are absolutely positioned and
   would otherwise paint over its edge. */
.gx-row[data-cursor="true"] { outline: 1.5px solid var(--gx-accent); outline-offset: -1.5px; z-index: 1; }
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
.gx-detail-file {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 20px;
  padding: 0 2px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.gx-detail-file:hover { background: var(--gx-hover); }
.gx-detail-file:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-detail-file .gx-file-name { font-size: 11px; }

/* The hover card portals out of .gx-root, so it declares the shared token block
   above and carries its own fixed frame; pointer-events none keeps it from ever
   sitting between the reader and the row that owns the click. */
.gx-preview {
  display: flex;
  flex-direction: column;
  width: min(420px, calc(100vw - 16px));
  max-height: min(420px, calc(100vh - 16px));
  z-index: 40;
  border: 1px solid var(--gx-border);
  border-radius: 8px;
  background: var(--gx-panel-2);
  color: var(--gx-text);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--gx-text) 22%, transparent);
  overflow: hidden;
  font-family: var(--gx-font);
  font-size: 11px;
  line-height: 1.45;
}
.gx-preview-head {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
  height: 26px;
  padding: 0 10px;
  border-bottom: 1px solid var(--gx-border-soft);
  background: var(--gx-panel);
}
.gx-preview-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.gx-preview-rev { margin-left: auto; flex: none; color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10px; }
.gx-preview-body { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; padding: 8px 10px; overflow: hidden; }
.gx-preview-text {
  margin: 0;
  flex: 1 1 auto;
  min-height: 0;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: 10.5px;
  line-height: 1.5;
  white-space: pre;
  overflow: hidden;
}
.gx-preview-note { flex: none; margin-top: 6px; color: var(--gx-caption); font-size: 10px; }
/* A capped card can clip the fortieth line; fading the last rows tells the
   reader the text continues without pretending the card is the full file. */
.gx-preview[data-clipped="true"] .gx-preview-text {
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
}
.gx-preview-unavailable { display: flex; flex-direction: column; gap: 3px; color: var(--gx-text-2); }
.gx-preview-unavailable strong { color: var(--gx-text); font-size: 11.5px; }

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
  max-width: min(320px, 40vw);
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
/* The worktree reading sits right after the name; the trigger's 4px gap is the
   separation, so the numbers keep their space even when the name ellipsizes.
   Zero sides are not rendered at all, which leaves +128 or \u221234 alone. */
.gx-branch-dirty {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  flex: none;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.gx-branch-add { color: var(--dsw-alias-state-success-primary, inherit); }
.gx-branch-del { color: var(--dsw-alias-state-error-primary, inherit); }
.gx-branch-dot { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); }

.gx-branch-panel {
  position: fixed;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 320px;
  max-width: min(420px, 100vw - 32px);
  max-height: min(420px, calc(100vh - 24px));
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: var(--dsw-radius-lg, 10px);
  /* Frosted glass: the sidebar's own fill kept slightly translucent over a
     blurred backdrop, plus a top-light gradient so the pane reads as a sheet
     of glass rather than a flat tint. Both colours come from theme tokens, so
     the light and dark themes each get their own version of the material. */
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--dsw-alias-label-primary, #000) 4%, transparent),
      transparent 42%
    ),
    color-mix(
      in srgb,
      var(--dsw-specific-sidebar-fill, var(--dsw-menu-surface-fill, #f8f9fa)) 84%,
      transparent
    );
  backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  -webkit-backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  box-shadow:
    var(--dsw-elevation-prominent, 0 8px 24px color-mix(in srgb, var(--dsw-alias-label-primary, currentColor) 16%, transparent)),
    inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-label-primary, #fff) 6%, transparent);
  color: var(--dsw-alias-label-primary, inherit);
  font-size: 13px;
  line-height: 1.45;
}
.gx-branch-list { display: flex; flex-direction: column; gap: 0; min-width: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; scrollbar-width: thin; }
/* The scope line names the worktree the switch lands in. The parent chain is
   the part that clips, so the repository or worktree name survives any width;
   the full path stays on the row's title. */
.gx-branch-scope {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-width: 0;
  padding: 4px 8px 5px;
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  font-size: 11px;
  line-height: 16px;
}
.gx-branch-scope-label { flex: none; }
.gx-branch-scope-path { display: flex; flex: 1; min-width: 0; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; }
.gx-branch-scope-parent { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-branch-scope-name { flex: none; max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-secondary, inherit); }
/* The search seat keeps the row's horizontal padding so the caret lines up with
   the names below; a single hairline separates it without adding a second
   surface inside the popover. */
.gx-branch-search {
  flex: none;
  width: 100%;
  height: 28px;
  padding: 4px 8px;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 10%, transparent));
  border-radius: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary, inherit);
  font: inherit;
  font-size: 13px;
  outline: none;
}
.gx-branch-search::placeholder { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); }
.gx-branch-search:focus-visible { border-bottom-color: var(--dsw-alias-link, var(--dsw-alias-state-business-primary, currentColor)); }
.gx-branch-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-width: 0;
  min-height: 30px;
  padding: 5px 8px;
  box-sizing: border-box;
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
/* The arrow-key cursor outlives the pointer leaving the row, so it reuses the
   hover wash instead of inventing a second selection colour. */
.gx-branch-row[data-active="true"]:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.gx-branch-row:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: -2px; }
.gx-branch-row[data-current="true"] { color: var(--dsw-alias-brand-primary, inherit); }
.gx-branch-row:disabled { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); opacity: .55; cursor: default; }
/* A disabled row only greys out, which reads as a rendering glitch; the tag
   names the reason without needing the title tooltip. */
.gx-branch-taken {
  flex: none;
  padding: 0 6px;
  border: 1px dashed color-mix(in srgb, currentColor 45%, transparent);
  border-radius: 999px;
  color: inherit;
  font-size: 10px;
  line-height: 15px;
  white-space: nowrap;
}
.gx-branch-row-name {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
.gx-branch-match { color: var(--dsw-alias-label-primary, inherit); font-weight: 500; }
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
/* The automatic stash can leave changes parked when applying them back hit a
   conflict. This notice owns the top of the popover until it closes, and the
   git stderr summary wraps underneath instead of widening the panel. */
.gx-branch-warning {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: none;
  margin-bottom: 2px;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-md, 8px);
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, currentColor) 12%, transparent);
  color: var(--dsw-alias-state-warn-primary, currentColor);
  font-size: 12px;
}
.gx-branch-warning-text { font-weight: 500; }
.gx-branch-warning-detail {
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 11px;
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
.gx-branch-nomatch { padding: 12px 9px; color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); font-size: 12px; text-align: center; }


@media (max-width: 720px) {
  .gx-body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(140px, 34%) minmax(0, 1fr); }
  /* Stacked columns have no horizontal split to resize, so the handle and any
     persisted width (this rule wins the cascade over the variable) both go
     inert. */
  .gx-pane-handle { display: none; }
  .gx-author { display: none; }
}
`;function zt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Bt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Bt,n.textContent=Bn,e.head.appendChild(n),()=>{n.remove()}}var y=require("react");var _=require("react");function $t(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let a=o.files.filter(i=>i.path.toLowerCase().includes(n));a.length>0&&r.push({dir:o.dir,files:a})}return r}var F=require("react/jsx-runtime");function fe(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function zn(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function $n(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function On({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,F.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,F.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Ot({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let i=(0,_.useRef)(null),s=(0,_.useRef)(null),[p,l]=(0,_.useState)(""),b=(0,_.useMemo)(()=>$t(e,p),[e,p]),d=(0,_.useMemo)(()=>zn(b),[b]),m=(0,_.useMemo)(()=>d.map(fe),[d]),z=e.reduce((u,w)=>u+w.files.length,0),R=(0,_.useMemo)(()=>b.reduce((u,w)=>u+w.files.length,0),[b]),L=p.trim()!=="",[C,D]=(0,_.useState)(void 0),g=(0,_.useMemo)(()=>C===void 0?-1:m.indexOf(C),[C,m]),W=(0,_.useRef)(0);(0,_.useEffect)(()=>{g>=0&&(W.current=g)},[g]);let I=(0,_.useRef)(d);I.current=d,(0,_.useEffect)(()=>{if(!o)return;a(),$n(i.current);let u=I.current.find(w=>w.kind==="file");u!==void 0&&D(fe(u))},[o,a]),(0,_.useEffect)(()=>{if(C===void 0||g>=0||d.length===0)return;let u=d[Math.min(W.current,d.length-1)];u!==void 0&&D(fe(u))},[g,C,d]);let f=(0,_.useCallback)(u=>{let w=m[u];w!==void 0&&(D(w),s.current?.focus({preventScroll:!0}))},[m]);(0,_.useEffect)(()=>{if(g<0)return;s.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[g,C]);let v=(0,_.useCallback)(u=>{let w=De({key:u.key,composing:u.nativeEvent.isComposing,alt:u.altKey,ctrl:u.ctrlKey,meta:u.metaKey,shift:u.shiftKey});if(w===null)return;if(u.preventDefault(),w==="activate"){let ee=g<0?void 0:d[g];ee?.kind==="file"&&!ee.file.isDirectory&&r(ee.file.path,1);return}let H=Fe(g<0?void 0:g,w,d.length);H!==void 0&&f(H)},[g,f,r,d]);return(0,F.jsxs)("section",{ref:i,className:"gx-pane","data-testid":"git-changes",children:[(0,F.jsxs)("header",{className:"gx-pane-head",children:[(0,F.jsx)("span",{children:n("changes.title")}),(0,F.jsx)("span",{className:"gx-count",children:L?`${String(R)} / ${String(z)}`:z}),(0,F.jsx)("span",{className:"gx-spacer"}),(0,F.jsx)("input",{className:"gx-filter",type:"search",value:p,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:u=>l(u.currentTarget.value)})]}),(0,F.jsx)("div",{className:"gx-scroll",ref:s,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:v,children:z===0?(0,F.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,F.jsx)("strong",{children:n("changes.empty")})}):d.length===0?(0,F.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,F.jsx)("strong",{children:n("changes.noMatch")})}):d.map(u=>u.kind==="group"?(0,F.jsxs)("div",{className:"gx-group-head","data-cursor":fe(u)===C?"true":"false",children:[(0,F.jsx)("span",{className:"gx-group-dir",children:u.dir===""?n("changes.root"):u.dir}),(0,F.jsx)("span",{className:"gx-count",children:u.count})]},fe(u)):(0,F.jsxs)("button",{type:"button",className:"gx-file","data-status":u.file.status,"data-directory":u.file.isDirectory?"true":"false","data-renamed":u.file.origPath===void 0?"false":"true","data-cursor":fe(u)===C?"true":"false","data-testid":"git-change-file",title:u.file.isDirectory?`${n(`status.${u.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${u.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{D(fe(u)),s.current?.focus({preventScroll:!0}),u.file.isDirectory||r(u.file.path,1)},children:[(0,F.jsx)("span",{className:"gx-badge","data-status":u.file.status,children:Ee(u.file.status)}),(0,F.jsxs)("span",{className:"gx-file-name",children:[xe(u.file.path),u.file.origPath===void 0?null:(0,F.jsx)("span",{className:"gx-file-orig",children:xe(u.file.origPath)})]}),(0,F.jsx)("span",{className:"gx-file-stats",children:(0,F.jsx)(On,{stat:t.get(u.file.path)})})]},fe(u)))})]})}var B=require("react"),Wt=require("react-dom");var h=require("react/jsx-runtime"),Wn=200,_n=40,Kn=24,Vn=7;function qn({additions:e,deletions:t}){return e===null&&t===null?(0,h.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,h.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function jn(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Un({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,h.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,h.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,h.jsx)("strong",{children:t("preview.unavailable")}),(0,h.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,h.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,h.jsx)("strong",{children:t("preview.unavailable")}),(0,h.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,h.jsxs)(h.Fragment,{children:[r.text===""?(0,h.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,h.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,h.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,h.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function Jn({preview:e,hash:t,t:n}){let r=(0,B.useRef)(null),o=(0,B.useRef)(null),[a,i]=(0,B.useState)(null),[s,p]=(0,B.useState)(!1);return(0,B.useLayoutEffect)(()=>{let l=r.current;if(l===null)return;let b=l.getBoundingClientRect();i(At(e.anchor,{width:b.width,height:b.height},{width:window.innerWidth,height:window.innerHeight}));let d=o.current;p(d!==null&&d.scrollHeight>d.clientHeight+1)},[e]),typeof document>"u"?null:(0,Wt.createPortal)((0,h.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":s?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:a?.left??0,top:a?.top??0,visibility:a===null?"hidden":"visible"},children:[(0,h.jsxs)("div",{className:"gx-preview-head",children:[(0,h.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Ee(e.file.status)}),(0,h.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:xe(e.file.path)}),(0,h.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Vn)} \xB7 ${n("preview.revision")}`})]}),(0,h.jsx)("div",{className:"gx-preview-body",children:(0,h.jsx)(Un,{preview:e,t:n,textRef:o})})]}),document.body)}function _t({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:a}){let[i,s]=(0,B.useState)({kind:"idle"}),[p,l]=(0,B.useState)(0),b=(0,B.useRef)(new Map),[d,m]=(0,B.useState)({kind:"idle"}),z=(0,B.useRef)(It(Kn)),R=(0,B.useRef)(void 0),L=(0,B.useRef)(void 0),C=(0,B.useRef)(void 0),D=(0,B.useRef)(null),g=(0,B.useCallback)(()=>{R.current=void 0,L.current!==void 0&&(window.clearTimeout(L.current),L.current=void 0),C.current?.abort(),C.current=void 0,m(f=>f.kind==="idle"?f:{kind:"idle"})},[]),W=(0,B.useCallback)((f,v)=>{if(g(),t===void 0)return;let u=v.getBoundingClientRect(),w={left:u.left,top:u.top,right:u.right,bottom:u.bottom},H=Ht(t,f.path);R.current=H,L.current=window.setTimeout(()=>{if(L.current=void 0,R.current!==H)return;let ee=z.current.get(H);if(ee!==void 0){m({kind:"ready",file:f,anchor:w,page:ee});return}if(e===void 0||n===void 0||typeof n.show!="function"){m({kind:"unavailable",file:f,anchor:w,message:r("preview.noService")});return}let oe=new AbortController;C.current=oe,m({kind:"loading",file:f,anchor:w}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:f.path,offset:1,limit:_n},oe.signal)).then(N=>{if(oe.signal.aborted||R.current!==H)return;let J=le(N);if(!J.ok){m({kind:"unavailable",file:f,anchor:w,message:J.message});return}let $=J.result;if(!$.ok){m({kind:"unavailable",file:f,anchor:w,message:jn($.error.code,$.error.message,r)});return}z.current.set(H,$.page),m({kind:"ready",file:f,anchor:w,page:$.page})}).catch(N=>{oe.signal.aborted||R.current!==H||m({kind:"unavailable",file:f,anchor:w,message:de(N)})}).finally(()=>{C.current===oe&&(C.current=void 0)})},Wn)},[g,t,n,e,r]);(0,B.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let f=b.current.get(t);if(f!==void 0){s({kind:"ready",detail:f});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let v=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(u=>{if(!v)return;let w=le(u);if(!w.ok){s({kind:"failed",message:w.message});return}let H=w.result;H.ok?(b.current.set(t,H.detail),s({kind:"ready",detail:H.detail})):s({kind:"failed",message:H.error.message===""?H.error.code:H.error.message})}).catch(u=>{v&&s({kind:"failed",message:de(u)})}),()=>{v=!1}},[t,n,e,p,r]),(0,B.useEffect)(()=>{if(d.kind==="idle")return;let f=v=>{v.key==="Escape"&&g()};return document.addEventListener("keydown",f),()=>document.removeEventListener("keydown",f)},[d.kind,g]),(0,B.useEffect)(()=>{let f=D.current;if(f===null)return;let v=()=>g();return f.addEventListener("scroll",v,{passive:!0}),()=>f.removeEventListener("scroll",v)},[g]),(0,B.useEffect)(()=>{g()},[t,p,e,n,g]),(0,B.useEffect)(()=>()=>{R.current=void 0,L.current!==void 0&&window.clearTimeout(L.current),C.current?.abort()},[]);let I=Ie(i.kind==="ready"?i.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,h.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,h.jsxs)("header",{className:"gx-detail-head",children:[(0,h.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,h.jsx)("span",{className:"gx-hash",children:I.shortHash}),(0,h.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,h.jsx)("div",{className:"gx-detail-body",ref:D,children:i.kind==="idle"?(0,h.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):i.kind==="loading"?(0,h.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):i.kind==="failed"?(0,h.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,h.jsx)("strong",{children:r("detail.failed")}),(0,h.jsx)("span",{children:i.message}),(0,h.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>l(f=>f+1),children:r("action.retry")})]}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"gx-detail-subject",children:i.detail.subject}),(0,h.jsxs)("div",{className:"gx-detail-meta",children:[(0,h.jsx)("span",{className:"gx-author",children:i.detail.author}),(0,h.jsx)("span",{children:I.relative}),(0,h.jsx)("span",{title:new Date(i.detail.time*1e3).toLocaleString(),children:new Date(i.detail.time*1e3).toLocaleDateString()})]}),(0,h.jsxs)("div",{className:"gx-parents",children:[(0,h.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),i.detail.parents.length===0?(0,h.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):i.detail.parents.map(f=>(0,h.jsx)("button",{type:"button",className:"gx-parent",title:f,onClick:()=>o(f),children:f.slice(0,7)},f))]}),i.detail.body===""?null:(0,h.jsx)("pre",{className:"gx-body-text",children:i.detail.body}),(0,h.jsxs)("div",{className:"gx-detail-files",children:[(0,h.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(i.detail.files.length)}`}),i.detail.files.length===0?(0,h.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):et(i.detail.files).map(f=>(0,h.jsxs)("div",{className:"gx-detail-group",children:[(0,h.jsx)("div",{className:"gx-detail-dir",children:f.dir===""?r("changes.root"):f.dir}),f.files.map(v=>(0,h.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:v.path,onClick:()=>a?.(v.path),onMouseEnter:u=>W(v,u.currentTarget),onMouseLeave:g,children:[(0,h.jsx)("span",{className:"gx-badge","data-status":v.status,children:Ee(v.status)}),(0,h.jsxs)("span",{className:"gx-file-name",children:[xe(v.path),v.origPath===void 0?null:(0,h.jsx)("span",{className:"gx-file-orig",children:xe(v.origPath)})]}),(0,h.jsx)("span",{className:"gx-file-stats",children:(0,h.jsx)(qn,{additions:v.additions,deletions:v.deletions})})]},v.path))]},f.dir===""?".":f.dir))]})]})}),d.kind==="idle"?null:(0,h.jsx)(Jn,{preview:d,hash:t??"",t:r})]})}var V=require("react");var Me=require("react/jsx-runtime");function Kt(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Vt({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=p=>p*o+o/2,i=n/2,s=e.segments.map((p,l)=>{let b=a(p.from),d=a(p.to),m=p.kind==="pass"?`M ${String(b)} 0 L ${String(d)} ${String(n)}`:p.kind==="into"?`M ${String(b)} 0 C ${String(b)} ${String(n*.55)}, ${String(d)} ${String(n*.45)}, ${String(d)} ${String(i)}`:`M ${String(b)} ${String(i)} C ${String(b)} ${String(n*.55)}, ${String(d)} ${String(n*.45)}, ${String(d)} ${String(n)}`;return(0,Me.jsx)("path",{d:m,fill:"none",stroke:Kt(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(l)}`)});return(0,Me.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,Me.jsx)("circle",{cx:a(e.lane),cy:i,r:e.merge?4:3.2,fill:Kt(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var P=require("react/jsx-runtime");var Xn=12;function Qn({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,cursor:i,onSelect:s}){return(0,P.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-cursor":i?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,P.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,P.jsx)(Vt,{row:t,laneCount:n,height:we}),(0,P.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,P.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(p=>(0,P.jsxs)("span",{className:"gx-ref","data-kind":p.kind,children:[(0,P.jsx)("span",{className:"gx-ref-name",children:p.name}),(0,P.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:p.name})]},`${p.kind}:${p.name}`)),(0,P.jsx)("span",{className:"gx-author",children:e.author}),(0,P.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:tt(e.time)})]})}function qt(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:i,loadingMore:s,loadError:p,searching:l,search:b,t:d,onSelect:m,onLoadMore:z,onSearch:R}=e,L=(0,V.useRef)(null),[C,D]=(0,V.useState)(0),[g,W]=(0,V.useState)(0),I=(0,V.useRef)(!1),[f,v]=(0,V.useState)(void 0),u=f===void 0?void 0:t[f]?.hash,w=(0,V.useRef)(void 0);(0,V.useEffect)(()=>{let E=L.current;if(E===null)return;let G=()=>W(E.clientHeight);if(G(),typeof ResizeObserver>"u")return;let O=new ResizeObserver(G);return O.observe(E),()=>O.disconnect()},[]),(0,V.useEffect)(()=>{s||(I.current=!1)},[s]);let H=(0,V.useCallback)(()=>{!i||s||I.current||(I.current=!0,z())},[i,s,z]),ee=E=>{let G=E.currentTarget;D(G.scrollTop),G.scrollTop+G.clientHeight>=G.scrollHeight-160&&H()};(0,V.useEffect)(()=>{let E=u;if(E===void 0)return;let G=t.findIndex(O=>O.hash===E);G!==f&&G>=0?v(G):G<0&&v(void 0)},[t,f,u]),(0,V.useEffect)(()=>{let E=w.current!==r;if(w.current=r,!E||f===void 0||r===void 0)return;let G=t.findIndex(O=>O.hash===r);G>=0&&G!==f&&v(G)},[r,t,f]),(0,V.useEffect)(()=>{if(f===void 0)return;let E=L.current;if(E===null)return;let G=Gt({scrollTop:E.scrollTop,viewport:E.clientHeight===0?480:E.clientHeight,rowHeight:we,index:f,rowCount:t.length});G!==E.scrollTop&&(E.scrollTop=G,D(G))},[f,t.length]),(0,V.useEffect)(()=>{f===void 0||!Mt(f,t.length,Xn)||H()},[f,t.length,H]);let oe=(0,V.useCallback)(E=>{let G=De({key:E.key,composing:E.nativeEvent.isComposing,alt:E.altKey,ctrl:E.ctrlKey,meta:E.metaKey,shift:E.shiftKey});if(G===null)return;E.preventDefault();let O=f??t.findIndex(me=>me.hash===r),X=Fe(O<0?void 0:O,G,t.length);if(X===void 0)return;v(X);let re=t[X];re!==void 0&&m(re.hash)},[t,f,m,r]),N=Be(t,{scrollTop:C,height:g===0?480:g,rowHeight:we}),J=Math.max(1,Ft(n)),$=b.trim()!=="",te=$?d("history.noMatch"):e.emptyTitle??d("history.empty"),ae=$?void 0:e.emptyDescription;return(0,P.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,P.jsxs)("header",{className:"gx-pane-head",children:[(0,P.jsx)("span",{children:d("history.title")}),(0,P.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`}),(0,P.jsx)("span",{className:"gx-spacer"}),(0,P.jsx)("input",{className:"gx-filter",type:"search",value:b,spellCheck:!1,placeholder:d("history.search"),"aria-label":d("history.search"),"data-testid":"gx-history-search",onChange:E=>R(E.currentTarget.value)})]}),t.length===0?(0,P.jsxs)("div",{className:"gx-empty",children:[(0,P.jsx)("strong",{children:te}),ae===void 0?null:(0,P.jsx)("span",{children:ae}),e.onRetry===void 0?null:(0,P.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??d("action.retry")})]}):(0,P.jsx)("div",{className:"gx-scroll",ref:L,tabIndex:0,"data-testid":"git-history-scroll",onScroll:ee,onKeyDown:oe,children:(0,P.jsx)("div",{className:"gx-vlist",style:{height:t.length*we},children:N.rows.map((E,G)=>{let O=N.startIndex+G;return(0,P.jsx)(Qn,{commit:E,row:n[O],laneCount:J,top:O*we,selected:E.hash===r,head:E.hash===o,cursor:E.hash===u,onSelect:X=>{v(O),m(X)}},E.hash)})})}),(0,P.jsxs)("footer",{className:"gx-loadbar",children:[(0,P.jsx)("span",{children:`${d("history.loaded")} ${String(t.length)}`}),p===void 0?null:(0,P.jsx)("span",{className:"gx-del",children:p}),l?(0,P.jsx)("span",{className:"gx-search-status",children:d("history.searching")}):null,(0,P.jsx)("span",{className:"gx-spacer"}),i?(0,P.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:H,children:d(s?"history.loading":"history.loadMore")}):(0,P.jsx)("span",{children:t.length===0?"":d("history.noMore")})]})]})}function nt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var rt="git-explorer.leftColumnWidth";function ot(e){return Math.min(560,Math.max(240,e))}function Ut(e){if(e==null)return null;let t;try{t=e.getItem(rt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function ze(e,t){let n=Math.round(ot(t));if(e!=null)try{e.setItem(rt,String(n))}catch{}return n}function Jt(e){if(e!=null)try{e.removeItem(rt)}catch{}}function Xt(e,t){return Math.round(e)===Math.round(t)}var jt=16;function Qt(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-jt};case"ArrowRight":return{kind:"nudge",delta:jt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var k=require("react/jsx-runtime"),Yn=250;function Zn(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Zt(e,t){let n=Pt(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function er(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var tr={display:"flex",alignItems:"center",gap:8};function nr(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var rr=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function $e({title:e,description:t,actionLabel:n,onAction:r}){return(0,k.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,k.jsx)("strong",{children:e}),t===void 0?null:(0,k.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,k.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function or(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function en(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(i){let s=i.sessionId??t.currentSessionId(),p=(0,y.useRef)(s);p.current=s;let l=(0,y.useMemo)(()=>o(),[o]),[b]=(0,y.useState)(mt),[d,m]=(0,y.useState)(()=>({kind:Zn(s,l!==void 0)})),[z,R]=(0,y.useState)(0),[L,C]=(0,y.useState)([]),[D,g]=(0,y.useState)(!1),[W,I]=(0,y.useState)(!1),[f,v]=(0,y.useState)(void 0),[u,w]=(0,y.useState)(void 0),[H,ee]=(0,y.useState)(""),[oe,N]=(0,y.useState)(!1),J=(0,y.useRef)(""),$=(0,y.useRef)(0),te=(0,y.useRef)(void 0),ae=(0,y.useRef)(void 0),[E,G]=(0,y.useState)(!0),O=(0,y.useMemo)(()=>nr(),[]),[X,re]=(0,y.useState)(()=>Ut(O)),me=(0,y.useRef)(null),pe=(0,y.useRef)(null),be=(0,y.useCallback)(c=>{te.current=c,w(c),G(!1)},[]),Te=(0,y.useCallback)(()=>{G(!1)},[]),We=(0,y.useCallback)(c=>{if(c.button!==0||pe.current!==null||rr())return;let x=me.current?.previousElementSibling;if(x instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}pe.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:x.getBoundingClientRect().width,restWidth:X},document.body.classList.add("gx-pane-resizing")}},[X]),ye=(0,y.useCallback)(c=>{let x=pe.current;x===null||x.pointerId!==c.pointerId||re(ot(x.baseWidth+c.clientX-x.startX))},[]),he=(0,y.useCallback)(c=>{let x=pe.current;if(x===null||x.pointerId!==c.pointerId)return;pe.current=null,document.body.classList.remove("gx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let A=x.baseWidth+c.clientX-x.startX;if(Xt(A,x.baseWidth)){re(x.restWidth);return}re(ze(O,A))},[O]),Q=(0,y.useCallback)(()=>{Jt(O),re(null)},[O]),_e=(0,y.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let x=Qt(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(x===null)return;if(c.preventDefault(),c.stopPropagation(),x.kind==="reset"){Q();return}if(x.kind==="min"||x.kind==="max"){let K=x.kind==="min"?240:560;re(ze(O,K));return}let A=me.current?.previousElementSibling,ne=A instanceof HTMLElement?A.getBoundingClientRect().width:X??240;re(ze(O,ne+x.delta))},[O,Q,X]);(0,y.useEffect)(()=>()=>{pe.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,y.useEffect)(()=>{if(s===void 0||i.openView===void 0)return;let c=t.views;if(c?.bind!==void 0)return c.bind(s,i.openView)},[s,i.openView,t]),(0,y.useEffect)(()=>{if(s===void 0){m({kind:"idle"});return}if(l===void 0){m({kind:"no-service"});return}let c=!0;return m({kind:"loading"}),v(void 0),$.current+=1,J.current="",ee(""),N(!1),Promise.resolve().then(()=>l.snapshot({sessionId:s})).then(x=>{if(!c)return;let A=le(x);if(!A.ok){m({kind:"failed",message:A.message});return}let ne=A.result;if(!ne.ok){m({kind:"failed",message:ne.error.message===""?ne.error.code:ne.error.message});return}let K=ne.snapshot;m({kind:"ready",snapshot:K}),C(K.commits),g(K.commits.length<K.counts.commits);let U=te.current;te.current=void 0,w(Z=>U!==void 0?U:Z!==void 0&&K.commits.some(se=>se.hash===Z)?Z:K.commits[0]?.hash)}).catch(x=>{c&&m({kind:"failed",message:de(x)})}),()=>{c=!1}},[s,l,z]),(0,y.useEffect)(()=>{let c=i.viewRequest;if(c==null||c.view!==Se)return;let x=`${c.view}:${c.focus}`;ae.current!==x&&(ae.current=x,Zt(c.focus,{select:be,complete:()=>i.completeViewRequest?.()}))},[i.viewRequest,i.completeViewRequest,be]),(0,y.useEffect)(()=>{let c=t.viewFocus;if(c===void 0||s===void 0)return;let x=()=>{let A=c.take(Se);A!==void 0&&Zt(A,{select:be})};return x(),c.subscribe(x)},[t,s,be]);let Ke=(0,y.useMemo)(()=>Dt(L),[L]),j=d.kind==="ready"?d.snapshot:void 0,ke=(0,y.useMemo)(()=>j===void 0?[]:He(j.status),[j]),Le=(0,y.useMemo)(()=>{let c=new Map;for(let x of j?.stats??[])c.set(x.path,{additions:x.additions,deletions:x.deletions});return c},[j]),S=(0,y.useMemo)(()=>{let c=new Map;for(let x of j?.branches??[]){let A=c.get(x.hash);A===void 0?c.set(x.hash,[{kind:x.kind,name:x.name,head:x.head}]):A.push({kind:x.kind,name:x.name,head:x.head})}return c},[j]);(0,y.useEffect)(()=>{if(s===void 0||l===void 0||d.kind!=="ready")return;let c=H.trim();if(c===J.current)return;let x=s,A=$.current+1;if($.current=A,v(void 0),I(!1),c===""){J.current="",N(!1);let K=d.snapshot.commits;C(K),g(K.length<d.snapshot.counts.commits),w(U=>U!==void 0&&K.some(Z=>Z.hash===U)?U:K[0]?.hash);return}N(!0);let ne=setTimeout(()=>{J.current=c,Promise.resolve().then(()=>l.query(nt(s,c,0))).then(K=>{if($.current!==A||p.current!==x)return;let U=le(K);if(!U.ok){v(U.message);return}let Z=U.result;if(!Z.ok){v(Z.error.message===""?Z.error.code:Z.error.message);return}let se=Z.page,Ve=S;C(se.commits.map(ce=>({...ce,refs:Ve.get(ce.hash)??[]}))),g(se.hasMore),w(ce=>ce!==void 0&&se.commits.some(ge=>ge.hash===ce)?ce:se.commits[0]?.hash)}).catch(K=>{$.current===A&&v(de(K))}).finally(()=>{$.current===A&&N(!1)})},Yn);return()=>{clearTimeout(ne)}},[H,s,l,d.kind,S]);let Y=(0,y.useCallback)(()=>{if(s===void 0||l===void 0||!D||W)return;let c=s,x=J.current,A=$.current;I(!0),v(void 0),Promise.resolve().then(()=>l.query(nt(s,x,L.length))).then(ne=>{if(p.current!==c||$.current!==A)return;let K=le(ne);if(!K.ok){v(K.message);return}let U=K.result;if(!U.ok){v(U.error.message===""?U.error.code:U.error.message);return}let Z=U.page;C(se=>{let Ve=new Set(se.map(ge=>ge.hash)),ce=Z.commits.filter(ge=>!Ve.has(ge.hash)).map(ge=>({...ge,refs:S.get(ge.hash)??[]}));return ce.length===0?se:[...se,...ce]}),g(Z.hasMore)}).catch(ne=>v(de(ne))).finally(()=>I(!1))},[s,l,D,W,L.length,S]),q=(0,y.useMemo)(()=>{let c=t.views??{open:(x,A)=>t.openView?.(x,A)??!1};return Ae({views:c,sessionId:s??""})},[t,s]),Ce=(c,x=1)=>{s!==void 0&&q(c,x)},dn=(0,y.useMemo)(()=>{let c={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(x,A)=>t.openViewOrSwitch?.(x,A)??{opened:!1,focused:!1}}};return Nt({seam:c,sessionId:s??""})},[t,s]),cn=(c,x=1)=>{s!==void 0&&u!==void 0&&dn(u,c,x)},ve=(0,y.useCallback)(()=>R(c=>c+1),[]),dr=()=>R(c=>c+1);(0,y.useEffect)(()=>er(b,ve),[b,ve]);let ie=j?.head,un=ke.reduce((c,x)=>c+x.files.length,0);return(0,k.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":d.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,k.jsxs)("header",{className:"gx-head",children:[(0,k.jsxs)("div",{className:"gx-head-main",children:[(0,k.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,k.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,k.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,k.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,k.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,k.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,k.jsx)("span",{className:"gx-repo",title:j?.root??r("view.title"),children:j===void 0?r("view.title"):or(j.root)}),ie?.branch===null||ie?.branch===void 0?null:(0,k.jsx)("span",{className:"gx-branch",children:ie.branch}),ie?.detached===!0?(0,k.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,ie?.ahead!==void 0&&ie.ahead>0?(0,k.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(ie.ahead)}`}):null,ie?.behind!==void 0&&ie.behind>0?(0,k.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(ie.behind)}`}):null]}),(0,k.jsxs)("div",{className:"gx-head-meta",style:tr,children:[j===void 0?null:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)("span",{children:[r("head.changes")," ",(0,k.jsx)("b",{children:un})]}),(0,k.jsxs)("span",{children:[r("head.commits")," ",(0,k.jsx)("b",{children:j.counts.commits})]}),(0,k.jsxs)("span",{children:[r("head.branches")," ",(0,k.jsx)("b",{children:j.counts.branches})]})]}),(0,k.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:d.kind==="loading",onClick:ve,children:"\u21BB"})]})]}),s===void 0?(0,k.jsx)($e,{title:r("state.noSession.title"),description:r("state.noSession.description")}):d.kind==="no-service"?(0,k.jsx)($e,{title:r("state.noService.title"),description:r("state.noService.description")}):d.kind==="loading"?(0,k.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):d.kind==="failed"?(0,k.jsx)($e,{title:r("state.failed.title"),description:d.message,actionLabel:r("action.retry"),onAction:ve}):d.kind==="ready"&&!d.snapshot.isRepository?(0,k.jsx)($e,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:ve}):d.kind==="ready"?(0,k.jsxs)("div",{className:"gx-body",style:X===null?void 0:{"--gx-left-col":`${X}px`},children:[(0,k.jsx)(Ot,{groups:ke,stats:Le,t:r,onOpen:Ce,claimFocus:E,onFocusClaimed:Te}),(0,k.jsx)("div",{ref:me,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":X??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:We,onPointerMove:ye,onPointerUp:he,onPointerCancel:he,onLostPointerCapture:he,onKeyDown:_e,onDoubleClick:Q}),(0,k.jsxs)("div",{className:"gx-col",children:[(0,k.jsx)(qt,{commits:L,graph:Ke,selectedHash:u,headHash:d.snapshot.head?.hash??null,total:d.snapshot.counts.commits,hasMore:D,loadingMore:W,loadError:f,searching:oe,search:H,t:r,onSelect:w,onLoadMore:Y,onSearch:ee,...d.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:ve,retryLabel:r("action.retry")}:{}}),(0,k.jsx)(_t,{sessionId:s,hash:u,remote:l,t:r,onSelect:w,onOpenFile:cn})]})]}):null]})}return a}var nn=["slots","locale","workbench","remote"];function tn(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function rn(e){return()=>{try{let n=e.remote?.gitExplorer;if(tn(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(tn(n))return n}catch{}let t=on(e);return t===void 0?void 0:gt(t)}}function on(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${dt}/${r}`,o,a)}var Oe;function an(e){let t=e.locale.bind(Re);Oe?.();let n=e.locale.register(Re,{zh:it,en:st});Oe=n;let r=zt(typeof document>"u"?void 0:document),o=rn(e),a=Rt({store:ft(o),t});e.slots.inject(Ue,()=>e.slots.register({name:Ue,id:lt,order:30,locale:Re},a));let i=e.workbench;if(i!=null){let s=en({workbench:i,version:i.version,t,remote:o});e.slots.inject(je,()=>e.slots.register({name:je,id:Se,order:110,label:()=>t("tab.label"),locale:Re},s))}return()=>{r(),n(),Oe===n&&(Oe=void 0)}}var sn={groupChanges:He,formatCommitDetail:Ie,createJump:Ae,computeWindow:Be},ln={name:"dsh-git-explorer",inject:nn,apply:an,__test:sn},sr=ln;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
