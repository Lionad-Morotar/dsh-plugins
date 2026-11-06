window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var ut=Object.defineProperty;var Xn=Object.getOwnPropertyDescriptor;var Jn=Object.getOwnPropertyNames;var Qn=Object.prototype.hasOwnProperty;var Zn=(e,t)=>{for(var n in t)ut(e,n,{get:t[n],enumerable:!0})},er=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Jn(t))!Qn.call(e,o)&&o!==n&&ut(e,o,{get:()=>t[o],enumerable:!(r=Xn(t,o))||r.enumerable});return e};var tr=e=>er(ut({},"__esModule",{value:!0}),e);var oo={};Zn(oo,{__test:()=>$n,apply:()=>On,boot:()=>$t,clientPlugin:()=>Bn,createRemoteResolver:()=>_n,createRpcCall:()=>zn,default:()=>ro,inject:()=>Wn});module.exports=tr(oo);var Pt={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Lt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var pt="conversation.view",We="git-explorer";var ht="conversation.session.header.actions",Ht="git-branch";var _e="git-explorer",Dt="gitExplorer";var H=require("react");var It=Object.freeze([]);function Gt(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:It}));let r=[];return e.forEach((o,a)=>{let s=nr(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:rr(s)},order:a,run:or(s)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function gt(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&mt(n.branch))return t}return-1}function At(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return gt(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&mt(o.branch))return r}return t}function Ft(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!mt(n.branch)))return n.branch}function mt(e){return e.worktreePath===void 0}function nr(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),s=-1;for(let i=r;i<e.length;i+=1)if(e.charAt(i).toLowerCase()===a){s=i;break}if(s===-1)return;n.push(s),r=s+1}return n}function rr(e){let t=e[0];if(t===void 0)return It;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let s=e[a];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function or(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function Wt(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function xe(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function be(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Ye="service-unavailable",ar=Object.freeze({status:"idle",revision:0,sessionId:null}),ft;function ir(e){let t=ar,n=-1,r=0,o=new Set,a=c=>{t=c;for(let x of[...o])x()},s=c=>t.sessionId===c&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(c){return o.add(c),()=>{o.delete(c)}},getSnapshot:()=>t,load:async c=>{if(s(c))return;let x=e(),p=++r,b=t.revision,A=t.sessionId===c;a({status:"loading",...A&&t.list!==void 0?{list:t.list}:{},revision:b,sessionId:c});let N=()=>p!==r||t.revision!==b;if(typeof x?.branches!="function"){if(N())return;a({status:"error",error:Ye,revision:b,sessionId:c});return}try{let L=await x.branches({sessionId:c});if(N())return;let E=xe(L);if(!E.ok){a({status:"error",error:E.message,revision:b,sessionId:c});return}if(E.result.ok===!1){a({status:"error",error:E.result.error.message,revision:b,sessionId:c});return}n=b,a({status:"ready",list:E.result.list,revision:b,sessionId:c})}catch(L){if(N())return;a({status:"error",error:be(L),revision:b,sessionId:c})}},switchTo:async(c,x)=>{let p=()=>t.sessionId!==c,b=e();if(typeof b?.switchBranch!="function")return p()||a({...t,error:Ye}),{switched:!1};try{let A=await b.switchBranch({sessionId:c,name:x}),N=xe(A),L=N.ok?N.result.ok===!1?N.result.error.message:void 0:N.message;if(L!==void 0)return p()||a({...t,error:L}),{switched:!1};if(p())return{switched:!0};let E=N.ok&&N.result.ok===!0?N.result:void 0,F=E===void 0?x:E.branch,y=t.list;return a({status:y===void 0?t.status:"ready",...y===void 0?{}:{list:{...y,detached:!1,headHash:null,branches:y.branches.map($=>({...$,current:$.name===F}))}},revision:t.revision+1,sessionId:c}),E===void 0||E.stash===void 0?{switched:!0}:{switched:!0,stash:E.stash}}catch(A){return p()||a({...t,error:be(A)}),{switched:!1}}},bump(){a({...t,revision:t.revision+1})}}}function sr(e){return ft=ir(e),ft}var _t=sr;function zt(){return ft}var ke=require("react"),lr=Object.freeze({}),Xe=null,xt;function $t(e){Xe=e}function Bt(){if(xt!=null)return xt;if(Xe===null)return lr;let e=Ot(Xe,"@deepseek-ai/dsh-client-ui-primitives"),t=Ot(Xe,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,s=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof s=="function"?{createPortal:s}:{}}}function Ot(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var Kt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},Vt=e=>(0,ke.createElement)("svg",{...Kt,className:e.className},(0,ke.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,ke.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,ke.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,ke.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,ke.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),qt=e=>(0,ke.createElement)("svg",{...Kt,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,ke.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var D=require("react/jsx-runtime"),Ut=320,dr="min(420px, 100vw - 32px)",jt=5,Je=8;function cr(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:jt,margin:Je})??void 0:ur(t,n)}function ur(e,t){let[n,r]=(0,H.useState)(void 0);return(0,H.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let s=a.getBoundingClientRect(),i=Math.min(Ut,Math.max(160,window.innerWidth-Je*2)),m=Math.min(Math.max(s.right-i,Je),window.innerWidth-i-Je);r({left:m,top:s.bottom+jt,width:i})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function pr(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}hr(t,n,o,a)}function hr(e,t,n,r){(0,H.useEffect)(()=>{if(!n)return;let o=a=>{let s=a.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function gr(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[s,i]=o;s>r&&n.push((0,D.jsx)("span",{children:e.slice(r,s)},`plain-${a}`)),n.push((0,D.jsx)("span",{className:"gx-branch-match",children:e.slice(s,i)},`hit-${a}`)),r=i}),r<e.length&&n.push((0,D.jsx)("span",{children:e.slice(r)},"tail")),n}function mr(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function fr(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let a=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${a}`)}if(e.untrackedFiles>0){let a=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${a}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function Yt({store:e,t}){function n({sessionId:r}){let o=(0,H.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,s]=(0,H.useState)(!1),[i,m]=(0,H.useState)(""),[c,x]=(0,H.useState)(-1),[p,b]=(0,H.useState)(null),[A,N]=(0,H.useState)(null),L=(0,H.useRef)(r);L.current=r;let E=(0,H.useRef)(null),F=(0,H.useRef)(null),y=(0,H.useRef)(null),$=(0,H.useRef)(null),B=(0,H.useRef)(null),k=(0,H.useRef)(!1),S=(0,H.useId)(),h=(0,H.useId)(),R=Bt(),K=R.createPortal!==void 0,ae=R.IconBranch??Vt,ee=R.IconChevron??qt,C=o.list,Y=C===void 0?void 0:mr(C.root),W=(0,H.useMemo)(()=>Gt(C?.branches??[],i),[C,i]),U=(0,H.useCallback)(()=>{s(!1),m(""),N(null)},[]),X=(0,H.useCallback)(()=>{k.current=!0,U(),F.current?.focus({preventScroll:!0})},[U]),he=(0,H.useCallback)(()=>{k.current=!0,U()},[U]);(0,H.useEffect)(()=>{U(),b(null),r!==void 0&&e.load(r)},[e,r,U]),(0,H.useLayoutEffect)(()=>{a&&$.current?.focus({preventScroll:!0})},[a]),(0,H.useLayoutEffect)(()=>{if(a||!k.current)return;k.current=!1;let d=document.activeElement;(d===null||d===document.body||d===F.current||E.current?.contains(d)===!0)&&F.current?.focus({preventScroll:!0})},[a]),(0,H.useEffect)(()=>{x(gt(W))},[W]),(0,H.useEffect)(()=>{B.current?.scrollIntoView?.({block:"nearest"})},[c,W]),(0,H.useEffect)(()=>{if(!a)return;let d=g=>{g.key!=="Escape"||g.isComposing||(g.preventDefault(),X())};return document.addEventListener("keydown",d),()=>document.removeEventListener("keydown",d)},[a,X]);let se=cr(R,a,F,y);pr(R,E,y,K,a,he);let j=()=>{if(a){U();return}s(!0),r!==void 0&&e.load(r)},le=()=>{r!==void 0&&e.load(r)},ne=async d=>{if(p!==null||d.worktreePath!==void 0)return;if(d.current){X();return}if(r===void 0)return;b(d.name);let g=await e.switchTo(r,d.name);if(L.current===r&&(b(null),!!g.switched)){if(e.load(r),g.stash?.conflict===!0){N(g.stash);return}X()}},Ne=()=>{let d=Ft(W,c);d!==void 0&&ne(d)},ge=d=>{if(!(d.metaKey||d.ctrlKey||d.altKey)&&!d.nativeEvent.isComposing){if(d.key==="ArrowDown"||d.key==="ArrowUp"){d.preventDefault();let g=d.key==="ArrowDown"?1:-1;x(P=>At(W,P,g));return}d.key==="Enter"&&(d.preventDefault(),Ne())}};if(r===void 0)return null;let de=C?.branches.find(d=>d.current)?.name,re=C===void 0?t("branch.loading"):C.detached?C.headHash??t("head.detached"):de??t("branch.unborn");if(!a&&C?.isRepository!==!0)return null;let Se=`${t("head.detached")} ${C?.headHash??""}`.trim(),ie=C?.detached===!0?Se:re,ce=C?.isRepository===!0?C.worktree:void 0,Q=ce===void 0?void 0:fr(ce,t),Ie=t("branch.worktreeSep"),Ge=Q===void 0?ie:Q.description,we=Q===void 0||ce?.dirty!==!0?`${t("branch.title")}: ${ie}`:`${t("branch.title")}: ${ie}${Ie}${Q.description}`,Re=o.error===Ye?t("state.noService.title"):o.error,Pe=(0,D.jsxs)("div",{ref:y,id:h,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:Ut,maxWidth:dr,...se},children:[A?.conflict===!0?(0,D.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,D.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),A.message===void 0||A.message===""?null:(0,D.jsx)("span",{className:"gx-branch-warning-detail",children:A.message})]}):null,C===void 0||Y===void 0?null:(0,D.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:C.root,children:[(0,D.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,D.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,D.jsx)("span",{className:"gx-branch-scope-parent",children:Y.parent}),(0,D.jsx)("span",{className:"gx-branch-scope-name",children:Y.name})]})]}),(0,D.jsx)("input",{ref:$,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:i,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":C===void 0?void 0:S,"aria-activedescendant":c>=0&&C!==void 0?`${S}-option-${c}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:d=>m(d.target.value),onKeyDown:ge}),Re!==void 0?(0,D.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,D.jsx)("span",{className:"gx-branch-error-text",children:Re}),(0,D.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:le,children:t("action.retry")})]}):null,o.status==="loading"&&C===void 0?(0,D.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,C!==void 0?(0,D.jsxs)("div",{className:"gx-branch-list",id:S,role:"listbox","aria-label":t("branch.title"),children:[C.branches.length===0?(0,D.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,C.branches.length>0&&W.length===0?(0,D.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,W.map((d,g)=>{let P=d.branch,V=g===c;return(0,D.jsxs)("button",{ref:V?B:void 0,type:"button",role:"option",id:`${S}-option-${g}`,"aria-selected":V,"data-active":V?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${P.name}`,"data-current":P.current?"true":void 0,"aria-current":P.current?"true":void 0,title:P.worktreePath===void 0?P.name:`${P.name} ${t("branch.worktree")}: ${P.worktreePath}`,disabled:p!==null||P.worktreePath!==void 0,onClick:()=>{ne(P)},children:[(0,D.jsx)("span",{className:"gx-branch-row-name",children:gr(P.name,d.ranges)}),P.worktreePath===void 0?null:(0,D.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),P.current?(0,D.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},P.name)})]}):null]});return(0,D.jsxs)("div",{className:"gx-branch-action",ref:E,children:[(0,D.jsxs)("button",{ref:F,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":we,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?h:void 0,title:Ge,onClick:j,children:[(0,D.jsx)(ae,{className:"gx-branch-icon"}),(0,D.jsx)("span",{className:"gx-branch-name",title:ie,children:re}),Q===void 0||ce?.dirty!==!0?null:(0,D.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:Q.dot?t("branch.worktreeDirty"):void 0,children:[Q.additions>0?(0,D.jsxs)("span",{className:"gx-branch-add",children:["+",Q.additions]}):null,Q.deletions>0?(0,D.jsxs)("span",{className:"gx-branch-del",children:["\u2212",Q.deletions]}):null,Q.dot?(0,D.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,D.jsx)(ee,{className:"gx-branch-chevron"})]}),a?R.createPortal===void 0?Pe:R.createPortal(Pe,document.body):null]})}return n}function Xt(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function Qe(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function Ze(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function Jt(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var xr={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Le(e){return xr[e]}var Qt={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function br(e,t){return(Qt[e]??0)>=(Qt[t]??0)?e:t}function Zt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function bt(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function yr(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:br(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let i=a.slice(2),m=i.slice(0,2),c=bt(i,7);c!==""&&r({path:c,status:Zt(m),staged:m[0]!==".",isDirectory:!1})}else if(s==="2"){let i=a.slice(2),m=i.slice(0,2),c=bt(i,8),x=t[o+1]??"";c!==""&&x!==""&&(o+=1,r({path:c,status:Zt(m),staged:m[0]!==".",isDirectory:!1,origPath:x}))}else if(s==="u"){let i=a.slice(2),m=bt(i,9);m!==""&&r({path:m,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let i=a.slice(2);if(i==="")continue;let m=i.endsWith("/");r({path:m?i.slice(0,-1):i,status:"untracked",staged:!1,isDirectory:m})}}return[...n.values()]}function vr(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function yt(e){let t=new Map;for(let n of e){let r=vr(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function ze(e){return yt(yr(e))}function vt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let i=Math.floor(a/30);return i<12?`${i}mo`:`${Math.floor(a/365)}y`}function et(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:vt(e.time,t)}}function tt({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function en({seam:e,sessionId:t}){return(n,r,o=1)=>{let a=typeof n=="string"?n.trim().toLowerCase():"";if(a===""||typeof r!="string")return;let s=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(s==="")return;let i=Number.isFinite(o)&&o>0?Math.floor(o):1,m=`git:${a}:${String(i)}:${s}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",m);let c=e.openViewOrSwitch("fs-explorer",m);if(c.focused){e.viewFocus?.take?.("fs-explorer");return}if(c.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",m)!==!0&&e.openView?.("fs-explorer",m)!==!0&&e.viewFocus?.request?.("fs-explorer",m)}}var wr=/^commit:([0-9a-f]{4,64})$/iu;function tn(e){if(e===void 0)return;let t=wr.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var Ce=24;function nt(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-a-o*2),i=Math.floor(Math.max(0,t.scrollTop)/n)-o,m=Math.min(Math.max(i,0),s),c=Math.min(e.length,m+a+o*2);return{rows:e.slice(m,c),startIndex:m,endIndex:c}}function nn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return Xt({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function rn(e){let t=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((x,p)=>x-p),r.shift()??o++),i=c=>{c!==null&&!r.includes(c)&&r.push(c)},m=()=>{let c=t.indexOf(null);return c>=0?c:(t.push(null),n.push(null),t.length-1)};for(let c of e){let x=[...t],p=[...n],b=x.indexOf(c.hash),A=b>=0;A||(b=m());let N=A?n[b]??null:null;N===null&&(N=s(),n[b]=N);for(let y=0;y<x.length;y+=1)y!==b&&x[y]===c.hash&&(i(n[y]??null),t[y]=null,n[y]=null);let L=c.parents[0];L===void 0?(i(n[b]??null),t[b]=null,n[b]=null):(t[b]=L,n[b]=N);let E=[];for(let y=1;y<c.parents.length;y+=1){let $=c.parents[y];if($===void 0)continue;let B=t.indexOf($);B<0&&(B=m(),t[B]=$),n[B]===null&&(n[B]=s()),E.push(B)}let F=[];for(let y=0;y<x.length;y+=1){let $=x[y];if($===null)continue;let B=p[y]??N;$===c.hash?F.push({kind:"into",from:y,to:b,color:B}):F.push({kind:"pass",from:y,to:y,color:B})}L!==void 0&&F.push({kind:"out",from:b,to:b,color:n[b]??N});for(let y of E)F.push({kind:"out",from:b,to:y,color:n[y]??N});for(a.push({lane:b,color:N,merge:c.parents.length>=2,segments:F});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function on(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function ye(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function an(e,t){return`${e.trim().toLowerCase()}\0${t}`}function sn(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let a=n.keys().next();a.done||n.delete(a.value)}},get size(){return n.size}}}function ln(e,t,n,r=10,o=8){let a=Math.max(o,n.width-t.width-o),s=e.right+r;s>a&&(s=e.left-t.width-r,s<o&&(s=Math.min(a,Math.max(o,e.left))));let i=Math.max(o,n.height-t.height-o),m=e.bottom+r,c=e.top-t.height-r,x;return m<=i?x=Math.max(o,m):c>=o?x=c:x=Math.min(i,Math.max(o,e.top)),{left:s,top:x}}var dn="dsh-git-explorer-styles",kr=`
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
/* The right column is history, a row separator, then the detail pane. The
   separator is the gutter itself, so the column keeps the 10px rhythm it had
   when the two panes were simply spaced, and the vertical divider above stays
   the only element that owns a grid track. */
.gx-col { display: flex; flex-direction: column; min-width: 0; min-height: 0; gap: 0; }
.gx-col > .gx-pane { flex: 1; }
.gx-row-handle {
  position: relative;
  flex: 0 0 10px;
  cursor: row-resize;
  touch-action: none;
}
.gx-row-handle::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-.5px);
  background: var(--gx-accent);
  opacity: 0;
}
.gx-row-handle:hover::before { opacity: .55; }
/* 10px tall, so the default focus ring collapses into noise; the keyboard
   focus reuses the hover line instead, exactly like the column divider. */
.gx-row-handle:focus-visible { outline: none; }
.gx-row-handle:focus-visible::before { opacity: .55; }
body.gx-row-resizing { user-select: none; cursor: row-resize; }
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
/* The row and the header share one grid template, built from the column
   variables the pane root publishes. Two templates would drift the moment a
   column is dragged, and the header would stop labelling the cells under it. */
.gx-row {
  position: absolute;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: var(--gx-col-graph, 16px) var(--gx-col-refs, 168px) minmax(140px, 1fr) var(--gx-col-time, 84px) var(--gx-col-author, 96px) var(--gx-col-hash, 68px);
  align-items: center;
  column-gap: 8px;
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
/* The hash column moved to the end, where it reads as the commit's identity
   rather than as a prefix in front of the subject. */
.gx-hash { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10.5px; text-align: right; }
.gx-subject { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
/* The refs cell clips its own chips: a column narrower than the names has to
   truncate them rather than push the subject off its track. */
.gx-refs { display: flex; align-items: center; gap: 4px; min-width: 0; overflow: hidden; }
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
.gx-author, .gx-time { min-width: 0; color: var(--gx-caption); font-size: 10.5px; }
.gx-author { overflow: hidden; text-overflow: ellipsis; }
.gx-time { font-family: var(--gx-mono); font-variant-numeric: tabular-nums; text-align: right; }

/* The header is the row grid without a row: same template, same gap, same
   horizontal padding, so every label sits over the cells it names. It stays
   outside the scroller, so the pane pads it by the scrollbar gutter instead. */
.gx-colhead {
  display: grid;
  grid-template-columns: var(--gx-col-graph, 16px) var(--gx-col-refs, 168px) minmax(140px, 1fr) var(--gx-col-time, 84px) var(--gx-col-author, 96px) var(--gx-col-hash, 68px);
  align-items: center;
  column-gap: 8px;
  flex: none;
  height: 24px;
  padding: 0 10px 0 4px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--gx-border-soft);
  color: var(--gx-caption);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .02em;
  white-space: nowrap;
}
/* The cell stretches the full header height and centres its label. It must not
   clip: the handle hangs across the column boundary, and overflow hidden here
   would cut off the half that sits over the next column, leaving a 4px sliver
   to grab. The label below is what truncates the text instead. */
.gx-colhead-cell {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: visible;
}
.gx-colhead-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Right alignment moves to the flex container now that the text is a child box
   rather than the cell's own inline content. */
.gx-colhead-time, .gx-colhead-hash { justify-content: flex-end; }
/* The working-tree row carries a resting band, not just a selected one. The
   reference graph reads this line as a summary header above the commits: the
   reader scans for "is anything uncommitted" before reading any single row, and
   a row that only differs once selected is invisible during that scan. The band
   is the layer-2 panel colour rather than a literal grey, so it keeps its
   contrast in both themes.
   It is deliberately a single-class rule placed after .gx-row: that puts it
   over the row's own transparent while staying under .gx-row:hover and
   .gx-row[data-selected="true"], which both outrank it on specificity, so
   hover and selection still paint over the band without any !important. The
   cursor's outline is a separate property and is untouched. */
.gx-uncommitted { background: var(--gx-panel-2); }
/* The working-tree row reads as a peer of the commits, but its label is what
   says so: the row carries no hash, so the weight has to do the work. */
.gx-uncommitted-label { font-weight: 600; color: var(--gx-text); }
/* The line totals sit in the date column, where a commit shows its age. */
.gx-uncommitted .gx-time { display: flex; justify-content: flex-end; gap: 4px; }
.gx-uncommitted .gx-add { color: var(--gx-added); }
.gx-uncommitted .gx-del { color: var(--gx-deleted); }
/* The handle sits on the column's right edge and overhangs it, so the hit area
   straddles the boundary the pointer is aiming at. It spans the header's full
   height: a handle only as tall as the text line would leave the top and bottom
   of the boundary dead, and the reader aims at the boundary, not at the glyphs. */
.gx-col-handle {
  position: absolute;
  top: 0;
  right: -5px;
  bottom: 0;
  width: 11px;
  cursor: col-resize;
  touch-action: none;
}
.gx-col-handle::before {
  content: "";
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 50%;
  width: 1px;
  transform: translateX(-.5px);
  background: var(--gx-accent);
  opacity: 0;
}
.gx-col-handle:hover::before { opacity: .55; }
/* The handle is 11px wide, so the default focus ring collapses into noise; the
   keyboard focus reuses the hover line instead, like the column divider. */
.gx-col-handle:focus-visible { outline: none; }
.gx-col-handle:focus-visible::before { opacity: .55; }
/* Applied to the document body while a column drag is live: no text selection
   under a moving pointer and a stable cursor wherever it travels. */
body.gx-col-resizing { user-select: none; cursor: col-resize; }

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

.gx-detail { display: flex; flex-direction: column; flex: none; height: var(--gx-detail-h, 38%); min-height: 180px; border: 1px solid var(--gx-border); border-radius: 10px; background: var(--gx-panel); overflow: hidden; }
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
  /* The author column leaves the row and the header together: dropping it from
     one template only would shift every later label off its cells. */
  .gx-author, .gx-colhead-author { display: none; }
  .gx-row, .gx-colhead {
    grid-template-columns: var(--gx-col-graph, 16px) var(--gx-col-refs, 168px) minmax(140px, 1fr) var(--gx-col-time, 84px) var(--gx-col-hash, 68px);
  }
}
`;function cn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${dn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=dn,n.textContent=kr,e.head.appendChild(n),()=>{n.remove()}}var v=require("react");var q=require("react");function un(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let a=o.files.filter(s=>s.path.toLowerCase().includes(n));a.length>0&&r.push({dir:o.dir,files:a})}return r}var G=require("react/jsx-runtime");function Me(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function Cr(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function Sr(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Rr({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,G.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,G.jsxs)(G.Fragment,{children:[(0,G.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,G.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function pn({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let s=(0,q.useRef)(null),i=(0,q.useRef)(null),[m,c]=(0,q.useState)(""),x=(0,q.useMemo)(()=>un(e,m),[e,m]),p=(0,q.useMemo)(()=>Cr(x),[x]),b=(0,q.useMemo)(()=>p.map(Me),[p]),A=e.reduce((h,R)=>h+R.files.length,0),N=(0,q.useMemo)(()=>x.reduce((h,R)=>h+R.files.length,0),[x]),L=m.trim()!=="",[E,F]=(0,q.useState)(void 0),y=(0,q.useMemo)(()=>E===void 0?-1:b.indexOf(E),[E,b]),$=(0,q.useRef)(0);(0,q.useEffect)(()=>{y>=0&&($.current=y)},[y]);let B=(0,q.useRef)(p);B.current=p,(0,q.useEffect)(()=>{if(!o)return;a(),Sr(s.current);let h=B.current.find(R=>R.kind==="file");h!==void 0&&F(Me(h))},[o,a]),(0,q.useEffect)(()=>{if(E===void 0||y>=0||p.length===0)return;let h=p[Math.min($.current,p.length-1)];h!==void 0&&F(Me(h))},[y,E,p]);let k=(0,q.useCallback)(h=>{let R=b[h];R!==void 0&&(F(R),i.current?.focus({preventScroll:!0}))},[b]);(0,q.useEffect)(()=>{if(y<0)return;i.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[y,E]);let S=(0,q.useCallback)(h=>{let R=Qe({key:h.key,composing:h.nativeEvent.isComposing,alt:h.altKey,ctrl:h.ctrlKey,meta:h.metaKey,shift:h.shiftKey});if(R===null)return;if(h.preventDefault(),R==="activate"){let ae=y<0?void 0:p[y];ae?.kind==="file"&&!ae.file.isDirectory&&r(ae.file.path,1);return}let K=Ze(y<0?void 0:y,R,p.length);K!==void 0&&k(K)},[y,k,r,p]);return(0,G.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,G.jsxs)("header",{className:"gx-pane-head",children:[(0,G.jsx)("span",{children:n("changes.title")}),(0,G.jsx)("span",{className:"gx-count",children:L?`${String(N)} / ${String(A)}`:A}),(0,G.jsx)("span",{className:"gx-spacer"}),(0,G.jsx)("input",{className:"gx-filter",type:"search",value:m,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:h=>c(h.currentTarget.value)})]}),(0,G.jsx)("div",{className:"gx-scroll",ref:i,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:S,children:A===0?(0,G.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,G.jsx)("strong",{children:n("changes.empty")})}):p.length===0?(0,G.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,G.jsx)("strong",{children:n("changes.noMatch")})}):p.map(h=>h.kind==="group"?(0,G.jsxs)("div",{className:"gx-group-head","data-cursor":Me(h)===E?"true":"false",children:[(0,G.jsx)("span",{className:"gx-group-dir",children:h.dir===""?n("changes.root"):h.dir}),(0,G.jsx)("span",{className:"gx-count",children:h.count})]},Me(h)):(0,G.jsxs)("button",{type:"button",className:"gx-file","data-status":h.file.status,"data-directory":h.file.isDirectory?"true":"false","data-renamed":h.file.origPath===void 0?"false":"true","data-cursor":Me(h)===E?"true":"false","data-testid":"git-change-file",title:h.file.isDirectory?`${n(`status.${h.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${h.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{F(Me(h)),i.current?.focus({preventScroll:!0}),h.file.isDirectory||r(h.file.path,1)},children:[(0,G.jsx)("span",{className:"gx-badge","data-status":h.file.status,children:Le(h.file.status)}),(0,G.jsxs)("span",{className:"gx-file-name",children:[ye(h.file.path),h.file.origPath===void 0?null:(0,G.jsx)("span",{className:"gx-file-orig",children:ye(h.file.origPath)})]}),(0,G.jsx)("span",{className:"gx-file-stats",children:(0,G.jsx)(Rr,{stat:t.get(h.file.path)})})]},Me(h)))})]})}var z=require("react"),hn=require("react-dom");var f=require("react/jsx-runtime"),Tr=200,Er=40,Mr=24,Nr=7;function Pr({additions:e,deletions:t}){return e===null&&t===null?(0,f.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,f.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Lr(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Hr({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,f.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,f.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,f.jsx)("strong",{children:t("preview.unavailable")}),(0,f.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,f.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,f.jsx)("strong",{children:t("preview.unavailable")}),(0,f.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,f.jsxs)(f.Fragment,{children:[r.text===""?(0,f.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,f.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,f.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,f.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function Dr({preview:e,hash:t,t:n}){let r=(0,z.useRef)(null),o=(0,z.useRef)(null),[a,s]=(0,z.useState)(null),[i,m]=(0,z.useState)(!1);return(0,z.useLayoutEffect)(()=>{let c=r.current;if(c===null)return;let x=c.getBoundingClientRect();s(ln(e.anchor,{width:x.width,height:x.height},{width:window.innerWidth,height:window.innerHeight}));let p=o.current;m(p!==null&&p.scrollHeight>p.clientHeight+1)},[e]),typeof document>"u"?null:(0,hn.createPortal)((0,f.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":i?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:a?.left??0,top:a?.top??0,visibility:a===null?"hidden":"visible"},children:[(0,f.jsxs)("div",{className:"gx-preview-head",children:[(0,f.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Le(e.file.status)}),(0,f.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:ye(e.file.path)}),(0,f.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Nr)} \xB7 ${n("preview.revision")}`})]}),(0,f.jsx)("div",{className:"gx-preview-body",children:(0,f.jsx)(Hr,{preview:e,t:n,textRef:o})})]}),document.body)}function gn({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:a}){let[s,i]=(0,z.useState)({kind:"idle"}),[m,c]=(0,z.useState)(0),x=(0,z.useRef)(new Map),[p,b]=(0,z.useState)({kind:"idle"}),A=(0,z.useRef)(sn(Mr)),N=(0,z.useRef)(void 0),L=(0,z.useRef)(void 0),E=(0,z.useRef)(void 0),F=(0,z.useRef)(null),y=(0,z.useCallback)(()=>{N.current=void 0,L.current!==void 0&&(window.clearTimeout(L.current),L.current=void 0),E.current?.abort(),E.current=void 0,b(k=>k.kind==="idle"?k:{kind:"idle"})},[]),$=(0,z.useCallback)((k,S)=>{if(y(),t===void 0)return;let h=S.getBoundingClientRect(),R={left:h.left,top:h.top,right:h.right,bottom:h.bottom},K=an(t,k.path);N.current=K,L.current=window.setTimeout(()=>{if(L.current=void 0,N.current!==K)return;let ae=A.current.get(K);if(ae!==void 0){b({kind:"ready",file:k,anchor:R,page:ae});return}if(e===void 0||n===void 0||typeof n.show!="function"){b({kind:"unavailable",file:k,anchor:R,message:r("preview.noService")});return}let ee=new AbortController;E.current=ee,b({kind:"loading",file:k,anchor:R}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:k.path,offset:1,limit:Er},ee.signal)).then(C=>{if(ee.signal.aborted||N.current!==K)return;let Y=xe(C);if(!Y.ok){b({kind:"unavailable",file:k,anchor:R,message:Y.message});return}let W=Y.result;if(!W.ok){b({kind:"unavailable",file:k,anchor:R,message:Lr(W.error.code,W.error.message,r)});return}A.current.set(K,W.page),b({kind:"ready",file:k,anchor:R,page:W.page})}).catch(C=>{ee.signal.aborted||N.current!==K||b({kind:"unavailable",file:k,anchor:R,message:be(C)})}).finally(()=>{E.current===ee&&(E.current=void 0)})},Tr)},[y,t,n,e,r]);(0,z.useEffect)(()=>{if(t===void 0){i({kind:"idle"});return}let k=x.current.get(t);if(k!==void 0){i({kind:"ready",detail:k});return}if(n===void 0||e===void 0){i({kind:"failed",message:r("state.noService.description")});return}let S=!0;return i({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(h=>{if(!S)return;let R=xe(h);if(!R.ok){i({kind:"failed",message:R.message});return}let K=R.result;K.ok?(x.current.set(t,K.detail),i({kind:"ready",detail:K.detail})):i({kind:"failed",message:K.error.message===""?K.error.code:K.error.message})}).catch(h=>{S&&i({kind:"failed",message:be(h)})}),()=>{S=!1}},[t,n,e,m,r]),(0,z.useEffect)(()=>{if(p.kind==="idle")return;let k=S=>{S.key==="Escape"&&y()};return document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[p.kind,y]),(0,z.useEffect)(()=>{let k=F.current;if(k===null)return;let S=()=>y();return k.addEventListener("scroll",S,{passive:!0}),()=>k.removeEventListener("scroll",S)},[y]),(0,z.useEffect)(()=>{y()},[t,m,e,n,y]),(0,z.useEffect)(()=>()=>{N.current=void 0,L.current!==void 0&&window.clearTimeout(L.current),E.current?.abort()},[]);let B=et(s.kind==="ready"?s.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,f.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,f.jsxs)("header",{className:"gx-detail-head",children:[(0,f.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,f.jsx)("span",{className:"gx-hash",children:B.shortHash}),(0,f.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,f.jsx)("div",{className:"gx-detail-body",ref:F,children:s.kind==="idle"?(0,f.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):s.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):s.kind==="failed"?(0,f.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,f.jsx)("strong",{children:r("detail.failed")}),(0,f.jsx)("span",{children:s.message}),(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>c(k=>k+1),children:r("action.retry")})]}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:"gx-detail-subject",children:s.detail.subject}),(0,f.jsxs)("div",{className:"gx-detail-meta",children:[(0,f.jsx)("span",{className:"gx-author",children:s.detail.author}),(0,f.jsx)("span",{children:B.relative}),(0,f.jsx)("span",{title:new Date(s.detail.time*1e3).toLocaleString(),children:new Date(s.detail.time*1e3).toLocaleDateString()})]}),(0,f.jsxs)("div",{className:"gx-parents",children:[(0,f.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),s.detail.parents.length===0?(0,f.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):s.detail.parents.map(k=>(0,f.jsx)("button",{type:"button",className:"gx-parent",title:k,onClick:()=>o(k),children:k.slice(0,7)},k))]}),s.detail.body===""?null:(0,f.jsx)("pre",{className:"gx-body-text",children:s.detail.body}),(0,f.jsxs)("div",{className:"gx-detail-files",children:[(0,f.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(s.detail.files.length)}`}),s.detail.files.length===0?(0,f.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):yt(s.detail.files).map(k=>(0,f.jsxs)("div",{className:"gx-detail-group",children:[(0,f.jsx)("div",{className:"gx-detail-dir",children:k.dir===""?r("changes.root"):k.dir}),k.files.map(S=>(0,f.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:S.path,onClick:()=>a?.(S.path),onMouseEnter:h=>$(S,h.currentTarget),onMouseLeave:y,children:[(0,f.jsx)("span",{className:"gx-badge","data-status":S.status,children:Le(S.status)}),(0,f.jsxs)("span",{className:"gx-file-name",children:[ye(S.path),S.origPath===void 0?null:(0,f.jsx)("span",{className:"gx-file-orig",children:ye(S.origPath)})]}),(0,f.jsx)("span",{className:"gx-file-stats",children:(0,f.jsx)(Pr,{additions:S.additions,deletions:S.deletions})})]},S.path))]},k.dir===""?".":k.dir))]})]})}),p.kind==="idle"?null:(0,f.jsx)(Dr,{preview:p,hash:t??"",t:r})]})}var _=require("react/jsx-runtime");function Ir(e,t){let n=0,r=0,o=0;for(let a of e)for(let s of a.files){let i=t.get(s.path);i!==void 0&&(n+=i.additions??0,r+=i.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function mn({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((s,i)=>s+i.files.length,0),a=Ir(e,t);return(0,_.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,_.jsxs)("header",{className:"gx-detail-head",children:[(0,_.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,_.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,_.jsx)("span",{className:"gx-spacer"}),a.counted===0?null:(0,_.jsxs)("span",{className:"gx-detail-stats",children:[(0,_.jsx)("span",{className:"gx-add",children:`+${String(a.additions)}`}),(0,_.jsx)("span",{className:"gx-del",children:`-${String(a.deletions)}`})]})]}),(0,_.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(s=>(0,_.jsxs)("div",{className:"gx-detail-group",children:[(0,_.jsxs)("div",{className:"gx-group-head",children:[(0,_.jsx)("span",{className:"gx-group-dir",children:s.dir===""?n("changes.root"):s.dir}),(0,_.jsx)("span",{className:"gx-count",children:s.files.length})]}),s.files.map(i=>(0,_.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-testid":"git-change-file",title:i.isDirectory?`${n(`status.${i.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${i.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,_.jsx)("span",{className:"gx-badge","data-status":i.status,children:Le(i.status)}),(0,_.jsxs)("span",{className:"gx-file-name",children:[ye(i.path),i.origPath===void 0?null:(0,_.jsx)("span",{className:"gx-file-orig",children:ye(i.origPath)})]}),(0,_.jsx)("span",{className:"gx-file-stats",children:(0,_.jsx)(Gr,{stat:t.get(i.path)})})]},i.path))]},s.dir))})]})}function Gr({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,_.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,_.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var I=require("react");var Oe=require("react/jsx-runtime");function fn(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function xn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=m=>m*o+o/2,s=n/2,i=e.segments.map((m,c)=>{let x=a(m.from),p=a(m.to),b=m.kind==="pass"?`M ${String(x)} 0 L ${String(p)} ${String(n)}`:m.kind==="into"?`M ${String(x)} 0 C ${String(x)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(s)}`:`M ${String(x)} ${String(s)} C ${String(x)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(n)}`;return(0,Oe.jsx)("path",{d:b,fill:"none",stroke:fn(m.color),strokeWidth:1.4,strokeLinecap:"round"},`${m.kind}-${String(m.from)}-${String(m.to)}-${String(c)}`)});return(0,Oe.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[i,(0,Oe.jsx)("circle",{cx:a(e.lane),cy:s,r:e.merge?4:3.2,fill:fn(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var wt="git-explorer.leftColumnWidth";function kt(e){return Math.min(560,Math.max(240,e))}function yn(e){if(e==null)return null;let t;try{t=e.getItem(wt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function rt(e,t){let n=Math.round(kt(t));if(e!=null)try{e.setItem(wt,String(n))}catch{}return n}function vn(e){if(e!=null)try{e.removeItem(wt)}catch{}}function $e(e,t){return Math.round(e)===Math.round(t)}var bn=16;function wn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-bn};case"ArrowRight":return{kind:"nudge",delta:bn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Be=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],Ct="git-explorer.historyColumns",kn=16,pe={refs:168,time:84,author:96,hash:68};function Cn(e){return Be.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function St(e,t){let n=Cn(e);return Math.min(n.max,Math.max(n.min,t))}function ot(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=Cn(t);return n<r.min||n>r.max?null:n}function Ar(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Rt(e){if(e==null)return pe;let t;try{t=e.getItem(Ct)}catch{return pe}if(t===null)return pe;let n=Ar(t);return n===null?pe:{refs:ot(n,"refs")??pe.refs,time:ot(n,"time")??pe.time,author:ot(n,"author")??pe.author,hash:ot(n,"hash")??pe.hash}}function Fr(e,t){if(e==null)return;let n={};for(let r of Be){let o=t[r.id];o!==pe[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(Ct):e.setItem(Ct,JSON.stringify(n))}catch{}}function at(e,t,n){let r=Math.round(St(t,n)),o={...Rt(e),[t]:r};return Fr(e,o),o}function Sn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-kn};case"ArrowRight":return{kind:"nudge",delta:kn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function Rn(e,t){return $e(e,t)}var w=require("react/jsx-runtime");var Wr=12,ve="uncommitted";function Tn(e){return Math.min(116,Math.max(16,e*12))}function _r(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function zr({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,cursor:s,onSelect:i}){return(0,w.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-cursor":s?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>i(e.hash),children:[t===void 0?(0,w.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,w.jsx)(xn,{row:t,laneCount:n,height:Ce}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(m=>(0,w.jsxs)("span",{className:"gx-ref","data-kind":m.kind,children:[(0,w.jsx)("span",{className:"gx-ref-name",children:m.name}),(0,w.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:m.name})]},`${m.kind}:${m.name}`))}),(0,w.jsx)("span",{className:"gx-subject",children:e.subject}),(0,w.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:vt(e.time)}),(0,w.jsx)("span",{className:"gx-author",children:e.author}),(0,w.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function Or({summary:e,laneCount:t,top:n,selected:r,cursor:o,t:a,onSelect:s}){let i=Tn(t),c=i/Math.max(1,t)/2,x=0,p=0,b=0;for(let A of e.groups)for(let N of A.files){let L=e.stats.get(N.path);L!==void 0&&(x+=L.additions??0,p+=L.deletions??0,b+=1)}return(0,w.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:n},"data-selected":r?"true":"false","data-cursor":o?"true":"false","data-testid":"git-uncommitted-row",title:a("uncommitted.hint"),"aria-label":a("uncommitted.hint"),onClick:s,children:[(0,w.jsx)("svg",{className:"gx-graph",width:i,height:Ce,viewBox:`0 0 ${String(i)} ${String(Ce)}`,"aria-hidden":"true",focusable:"false",children:(0,w.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:c,cy:Ce/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,w.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${a("uncommitted.label")} (${String(e.fileCount)})`}),(0,w.jsx)("span",{className:"gx-time",children:b===0?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("span",{className:"gx-add",children:`+${String(x)}`})," ",(0,w.jsx)("span",{className:"gx-del",children:`-${String(p)}`})]})}),(0,w.jsx)("span",{className:"gx-author"}),(0,w.jsx)("span",{className:"gx-hash"})]})}var $r=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function Br({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:a,onKeyDown:s,onReset:i}){let m=c=>Be.find(x=>x.id===c);return(0,w.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:$r.map(c=>{let x=c.id==="graph"||c.id==="subject"?void 0:m(c.id);return(0,w.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${c.id}`,children:[(0,w.jsx)("span",{className:"gx-colhead-label",children:n(c.key)}),x===void 0?null:(0,w.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(c.key)}`,"aria-valuemin":x.min,"aria-valuemax":x.max,"aria-valuenow":e[x.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${x.id}`,onPointerDown:p=>r(x.id,p),onPointerMove:o,onPointerUp:a,onPointerCancel:a,onLostPointerCapture:a,onKeyDown:p=>s(x.id,p),onDoubleClick:()=>i(x.id)})]},c.id)})})}function En(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:i,loadError:m,searching:c,search:x,t:p,onSelect:b,onLoadMore:A,onSearch:N,onSelectUncommitted:L}=e,E=(0,I.useRef)(null),[F,y]=(0,I.useState)(0),[$,B]=(0,I.useState)(0),k=(0,I.useRef)(!1),[S]=(0,I.useState)(()=>e.columnStorage===void 0?_r():e.columnStorage),[h,R]=(0,I.useState)(()=>Rt(S)),[K,ae]=(0,I.useState)(0),ee=(0,I.useRef)(null),[C,Y]=(0,I.useState)(void 0),W=e.workingTree,U=W!==void 0&&W.fileCount>0,X=U?1:0,he=t.length+X,se=r===void 0?-1:r===ve?U?0:-1:t.findIndex(d=>d.hash===r)+(U?1:0),j=C===void 0?void 0:C<X?ve:t[C-X]?.hash,le=(0,I.useRef)(void 0);(0,I.useEffect)(()=>{let d=E.current;if(d===null)return;let g=()=>{B(d.clientHeight),ae(Math.max(0,d.offsetWidth-d.clientWidth))};if(g(),typeof ResizeObserver>"u")return;let P=new ResizeObserver(g);return P.observe(d),()=>P.disconnect()},[t.length]),(0,I.useEffect)(()=>{i||(k.current=!1)},[i]);let ne=(0,I.useCallback)(()=>{!s||i||k.current||(k.current=!0,A())},[s,i,A]),Ne=d=>{let g=d.currentTarget;y(g.scrollTop),g.scrollTop+g.clientHeight>=g.scrollHeight-160&&ne()};(0,I.useEffect)(()=>{let d=j;if(d===void 0)return;let g=d===ve?U?0:-1:t.findIndex(P=>P.hash===d)+X;g!==C&&g>=0?Y(g):g<0&&Y(void 0)},[t,C,j,U,X]),(0,I.useEffect)(()=>{let d=le.current!==r;le.current=r,!(!d||C===void 0||r===void 0)&&se>=0&&se!==C&&Y(se)},[r,t,C,se]),(0,I.useEffect)(()=>{if(C===void 0)return;let d=E.current;if(d===null)return;let g=nn({scrollTop:d.scrollTop,viewport:d.clientHeight===0?480:d.clientHeight,rowHeight:Ce,index:C,rowCount:he});g!==d.scrollTop&&(d.scrollTop=g,y(g))},[C,he]),(0,I.useEffect)(()=>{if(C===void 0)return;let d=C-X;d<0||!Jt(d,t.length,Wr)||ne()},[C,t.length,ne,X]);let ge=(0,I.useCallback)(d=>{let g=Qe({key:d.key,composing:d.nativeEvent.isComposing,alt:d.altKey,ctrl:d.ctrlKey,meta:d.metaKey,shift:d.shiftKey});if(g===null)return;d.preventDefault();let P=C??(se>=0?se:void 0),V=Ze(P,g,he);if(V===void 0)return;if(Y(V),V===0&&U){L?.();return}let Te=t[V-X];Te!==void 0&&b(Te.hash)},[t,C,U,b,L,he,X,se]),de=nt(Array.from({length:he},(d,g)=>g),{scrollTop:F,height:$===0?480:$,rowHeight:Ce}),re=Math.max(1,on(n)),Se=(0,I.useCallback)((d,g)=>{if(!(g.button!==0||ee.current!==null)){g.preventDefault(),g.stopPropagation();try{g.currentTarget.setPointerCapture(g.pointerId)}catch{return}ee.current={pointerId:g.pointerId,startX:g.clientX,baseWidth:h[d],restWidth:h[d],id:d},document.body.classList.add("gx-col-resizing")}},[h]),ie=(0,I.useCallback)(d=>{let g=ee.current;if(g===null||g.pointerId!==d.pointerId)return;let P=St(g.id,g.baseWidth+d.clientX-g.startX);R(V=>({...V,[g.id]:P}))},[]),ce=(0,I.useCallback)(d=>{let g=ee.current;if(g===null||g.pointerId!==d.pointerId)return;ee.current=null,document.body.classList.remove("gx-col-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let P=g.baseWidth+d.clientX-g.startX;if(Rn(P,g.baseWidth)){R(V=>({...V,[g.id]:g.restWidth}));return}R(at(S,g.id,P))},[S]),Q=(0,I.useCallback)(d=>{R(at(S,d,pe[d]))},[S]),Ie=(0,I.useCallback)((d,g)=>{if(g.nativeEvent.isComposing)return;let P=Sn(g.key,g.altKey||g.ctrlKey||g.metaKey||g.shiftKey);if(P===null)return;if(g.preventDefault(),g.stopPropagation(),P.kind==="reset"){Q(d);return}let V=Be.find(Ae=>Ae.id===d);if(V===void 0)return;let Te=P.kind==="nudge"?h[d]+P.delta:P.kind==="min"?V.min:V.max;R(at(S,d,Te))},[Q,S,h]),Ge=(0,I.useMemo)(()=>({"--gx-col-graph":`${String(Tn(re))}px`,"--gx-col-refs":`${String(h.refs)}px`,"--gx-col-time":`${String(h.time)}px`,"--gx-col-author":`${String(h.author)}px`,"--gx-col-hash":`${String(h.hash)}px`}),[re,h]),we=x.trim()!=="",Re=we?p("history.noMatch"):e.emptyTitle??p("history.empty"),Pe=we?void 0:e.emptyDescription;return(0,w.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:Ge,children:[(0,w.jsxs)("header",{className:"gx-pane-head",children:[(0,w.jsx)("span",{children:p("history.title")}),(0,w.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`}),(0,w.jsx)("span",{className:"gx-spacer"}),(0,w.jsx)("input",{className:"gx-filter",type:"search",value:x,spellCheck:!1,placeholder:p("history.search"),"aria-label":p("history.search"),"data-testid":"gx-history-search",onChange:d=>N(d.currentTarget.value)})]}),t.length===0&&!(U&&!we)?(0,w.jsxs)("div",{className:"gx-empty",children:[(0,w.jsx)("strong",{children:Re}),Pe===void 0?null:(0,w.jsx)("span",{children:Pe}),e.onRetry===void 0?null:(0,w.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??p("action.retry")})]}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(Br,{widths:h,gutter:K,t:p,onPointerDown:Se,onPointerMove:ie,onPointerEnd:ce,onKeyDown:Ie,onReset:Q}),(0,w.jsx)("div",{className:"gx-scroll",ref:E,tabIndex:0,"data-testid":"git-history-scroll",onScroll:Ne,onKeyDown:ge,children:(0,w.jsx)("div",{className:"gx-vlist",style:{height:he*Ce},children:de.rows.map(d=>{let g=d*Ce;if(d===0&&U&&W!==void 0)return(0,w.jsx)(Or,{summary:W,laneCount:re,top:g,selected:r===ve,cursor:C===0,t:p,onSelect:()=>{Y(0),L?.()}},"uncommitted");let P=d-X,V=t[P];return V===void 0?null:(0,w.jsx)(zr,{commit:V,row:n[P],laneCount:re,top:g,selected:V.hash===r,head:V.hash===o,cursor:d===C,onSelect:Te=>{Y(d),b(Te)}},V.hash)})})})]}),(0,w.jsxs)("footer",{className:"gx-loadbar",children:[(0,w.jsx)("span",{children:`${p("history.loaded")} ${String(t.length)}`}),m===void 0?null:(0,w.jsx)("span",{className:"gx-del",children:m}),c?(0,w.jsx)("span",{className:"gx-search-status",children:p("history.searching")}):null,(0,w.jsx)("span",{className:"gx-spacer"}),s?(0,w.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:i,onClick:ne,children:p(i?"history.loading":"history.loadMore")}):(0,w.jsx)("span",{children:t.length===0?"":p("history.noMore")})]})]})}function Tt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var Et="git-explorer.detailHeight";function Mn(e){return Math.min(88,Math.max(6,e))}function He(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function Ke(e,t){let n=t>0?t:600;return Mn(Math.round(e/n*1e3)/10)}function Nn(e,t){let n=t>0?t:600;return e/100*n}function Pn(e){if(e==null)return null;let t;try{t=e.getItem(Et)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function it(e,t){let n=Math.round(Mn(t)*10)/10;if(e!=null)try{e.setItem(Et,String(n))}catch{}return n}function Ln(e){if(e!=null)try{e.removeItem(Et)}catch{}}function Hn(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var T=require("react/jsx-runtime"),jr=250;function Yr(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Gn(e,t){let n=tn(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function Xr(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var Jr={display:"flex",alignItems:"center",gap:8};function Qr(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Zr=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function st({title:e,description:t,actionLabel:n,onAction:r}){return(0,T.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,T.jsx)("strong",{children:e}),t===void 0?null:(0,T.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,T.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function eo(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function An(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(s){let i=s.sessionId??t.currentSessionId(),m=(0,v.useRef)(i);m.current=i;let c=(0,v.useMemo)(()=>o(),[o]),[x]=(0,v.useState)(zt),[p,b]=(0,v.useState)(()=>({kind:Yr(i,c!==void 0)})),[A,N]=(0,v.useState)(0),[L,E]=(0,v.useState)([]),[F,y]=(0,v.useState)(!1),[$,B]=(0,v.useState)(!1),[k,S]=(0,v.useState)(void 0),[h,R]=(0,v.useState)(void 0),[K,ae]=(0,v.useState)(""),[ee,C]=(0,v.useState)(!1),Y=(0,v.useRef)(""),W=(0,v.useRef)(0),U=(0,v.useRef)(void 0),X=(0,v.useRef)(void 0),[he,se]=(0,v.useState)(!0),j=(0,v.useMemo)(()=>Qr(),[]),[le,ne]=(0,v.useState)(()=>yn(j)),Ne=(0,v.useRef)(null),ge=(0,v.useRef)(null),[de,re]=(0,v.useState)(()=>Pn(j)),Se=(0,v.useRef)(null),ie=(0,v.useRef)(null),ce=(0,v.useCallback)(l=>{U.current=l,R(l),se(!1)},[]),Q=(0,v.useCallback)(()=>{se(!1)},[]),Ie=(0,v.useCallback)(l=>{if(l.button!==0||ge.current!==null||Zr())return;let u=Ne.current?.previousElementSibling;if(u instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}ge.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:u.getBoundingClientRect().width,restWidth:le},document.body.classList.add("gx-pane-resizing")}},[le]),Ge=(0,v.useCallback)(l=>{let u=ge.current;u===null||u.pointerId!==l.pointerId||ne(kt(u.baseWidth+l.clientX-u.startX))},[]),we=(0,v.useCallback)(l=>{let u=ge.current;if(u===null||u.pointerId!==l.pointerId)return;ge.current=null,document.body.classList.remove("gx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let M=u.baseWidth+l.clientX-u.startX;if($e(M,u.baseWidth)){ne(u.restWidth);return}ne(rt(j,M))},[j]),Re=(0,v.useCallback)(()=>{vn(j),ne(null)},[j]),Pe=(0,v.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let u=wn(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(u===null)return;if(l.preventDefault(),l.stopPropagation(),u.kind==="reset"){Re();return}if(u.kind==="min"||u.kind==="max"){let O=u.kind==="min"?240:560;ne(rt(j,O));return}let M=Ne.current?.previousElementSibling,te=M instanceof HTMLElement?M.getBoundingClientRect().width:le??240;ne(rt(j,te+u.delta))},[j,Re,le]),d=(0,v.useCallback)(()=>{let l=Se.current?.parentElement;return l instanceof HTMLElement?l.getBoundingClientRect().height:0},[]),g=(0,v.useCallback)(()=>d()||600,[d]),P=(0,v.useCallback)(()=>{let l=g();return He(Nn(de===null?38:de,l),l)},[g,de]),V=(0,v.useCallback)(l=>{if(l.button!==0||ie.current!==null)return;let u=Se.current?.parentElement;if(!(u instanceof HTMLElement))return;let M=Se.current?.nextElementSibling;if(M instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}ie.current={pointerId:l.pointerId,startY:l.clientY,baseHeight:M.getBoundingClientRect().height,columnHeight:u.getBoundingClientRect().height||600,restHeight:de},document.body.classList.add("gx-row-resizing")}},[de]),Te=(0,v.useCallback)(l=>{let u=ie.current;if(u===null||u.pointerId!==l.pointerId)return;let M=He(u.baseHeight-(l.clientY-u.startY),u.columnHeight);re(Ke(M,u.columnHeight))},[]),Ae=(0,v.useCallback)(l=>{let u=ie.current;if(u===null||u.pointerId!==l.pointerId)return;ie.current=null,document.body.classList.remove("gx-row-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let M=He(u.baseHeight-(l.clientY-u.startY),u.columnHeight);if($e(M,u.baseHeight)){re(u.restHeight);return}re(it(j,Ke(M,u.columnHeight)))},[j]),dt=(0,v.useCallback)(()=>{Ln(j),re(null)},[j]),Kn=(0,v.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let u=Hn(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(u===null)return;if(l.preventDefault(),l.stopPropagation(),u.kind==="reset"){dt();return}let M=g();if(u.kind==="min"||u.kind==="max"){let O=u.kind==="min"?He(180,M):He(M,M);re(it(j,Ke(O,M)));return}let te=He(P()+u.delta,M);re(it(j,Ke(te,M)))},[g,P,j,dt]);(0,v.useEffect)(()=>()=>{ge.current!==null&&document.body.classList.remove("gx-pane-resizing"),ie.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,v.useEffect)(()=>{if(i===void 0||s.openView===void 0)return;let l=t.views;if(l?.bind!==void 0)return l.bind(i,s.openView)},[i,s.openView,t]),(0,v.useEffect)(()=>{if(i===void 0){b({kind:"idle"});return}if(c===void 0){b({kind:"no-service"});return}let l=!0;return b({kind:"loading"}),S(void 0),W.current+=1,Y.current="",ae(""),C(!1),Promise.resolve().then(()=>c.snapshot({sessionId:i})).then(u=>{if(!l)return;let M=xe(u);if(!M.ok){b({kind:"failed",message:M.message});return}let te=M.result;if(!te.ok){b({kind:"failed",message:te.error.message===""?te.error.code:te.error.message});return}let O=te.snapshot;b({kind:"ready",snapshot:O}),E(O.commits),y(O.commits.length<O.counts.commits);let J=U.current;U.current=void 0,R(Z=>{if(J!==void 0)return J;let fe=ze(O.status).length>0;return Z===ve?fe?Z:O.commits[0]?.hash:Z!==void 0&&O.commits.some(Fe=>Fe.hash===Z)?Z:O.commits[0]?.hash})}).catch(u=>{l&&b({kind:"failed",message:be(u)})}),()=>{l=!1}},[i,c,A]),(0,v.useEffect)(()=>{let l=s.viewRequest;if(l==null||l.view!==We)return;let u=`${l.view}:${l.focus}`;X.current!==u&&(X.current=u,Gn(l.focus,{select:ce,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,ce]),(0,v.useEffect)(()=>{let l=t.viewFocus;if(l===void 0||i===void 0)return;let u=()=>{let M=l.take(We);M!==void 0&&Gn(M,{select:ce})};return u(),l.subscribe(u)},[t,i,ce]);let Vn=(0,v.useMemo)(()=>rn(L),[L]),oe=p.kind==="ready"?p.snapshot:void 0,Ve=(0,v.useMemo)(()=>oe===void 0?[]:ze(oe.status),[oe]),ct=(0,v.useMemo)(()=>{let l=new Map;for(let u of oe?.stats??[])l.set(u.path,{additions:u.additions,deletions:u.deletions});return l},[oe]),qe=(0,v.useMemo)(()=>{let l=new Map;for(let u of oe?.branches??[]){let M=l.get(u.hash);M===void 0?l.set(u.hash,[{kind:u.kind,name:u.name,head:u.head}]):M.push({kind:u.kind,name:u.name,head:u.head})}return l},[oe]);(0,v.useEffect)(()=>{if(i===void 0||c===void 0||p.kind!=="ready")return;let l=K.trim();if(l===Y.current)return;let u=i,M=W.current+1;if(W.current=M,S(void 0),B(!1),l===""){Y.current="",C(!1);let O=p.snapshot.commits;E(O),y(O.length<p.snapshot.counts.commits),R(J=>J===ve||J!==void 0&&O.some(Z=>Z.hash===J)?J:O[0]?.hash);return}C(!0);let te=setTimeout(()=>{Y.current=l,Promise.resolve().then(()=>c.query(Tt(i,l,0))).then(O=>{if(W.current!==M||m.current!==u)return;let J=xe(O);if(!J.ok){S(J.message);return}let Z=J.result;if(!Z.ok){S(Z.error.message===""?Z.error.code:Z.error.message);return}let fe=Z.page,Fe=qe;E(fe.commits.map(ue=>({...ue,refs:Fe.get(ue.hash)??[]}))),y(fe.hasMore),R(ue=>ue===ve||ue!==void 0&&fe.commits.some(Ee=>Ee.hash===ue)?ue:fe.commits[0]?.hash)}).catch(O=>{W.current===M&&S(be(O))}).finally(()=>{W.current===M&&C(!1)})},jr);return()=>{clearTimeout(te)}},[K,i,c,p.kind,qe]);let qn=(0,v.useCallback)(()=>{if(i===void 0||c===void 0||!F||$)return;let l=i,u=Y.current,M=W.current;B(!0),S(void 0),Promise.resolve().then(()=>c.query(Tt(i,u,L.length))).then(te=>{if(m.current!==l||W.current!==M)return;let O=xe(te);if(!O.ok){S(O.message);return}let J=O.result;if(!J.ok){S(J.error.message===""?J.error.code:J.error.message);return}let Z=J.page;E(fe=>{let Fe=new Set(fe.map(Ee=>Ee.hash)),ue=Z.commits.filter(Ee=>!Fe.has(Ee.hash)).map(Ee=>({...Ee,refs:qe.get(Ee.hash)??[]}));return ue.length===0?fe:[...fe,...ue]}),y(Z.hasMore)}).catch(te=>S(be(te))).finally(()=>B(!1))},[i,c,F,$,L.length,qe]),Un=(0,v.useMemo)(()=>{let l=t.views??{open:(u,M)=>t.openView?.(u,M)??!1};return tt({views:l,sessionId:i??""})},[t,i]),Nt=(l,u=1)=>{i!==void 0&&Un(l,u)},jn=(0,v.useMemo)(()=>{let l={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(u,M)=>t.openViewOrSwitch?.(u,M)??{opened:!1,focused:!1}}};return en({seam:l,sessionId:i??""})},[t,i]),Yn=(l,u=1)=>{i!==void 0&&h!==void 0&&jn(h,l,u)},De=(0,v.useCallback)(()=>N(l=>l+1),[]),ao=()=>N(l=>l+1);(0,v.useEffect)(()=>Xr(x,De),[x,De]);let me=oe?.head,Ue=Ve.reduce((l,u)=>l+u.files.length,0),je=(0,v.useMemo)(()=>Ue===0?void 0:{groups:Ve,stats:ct,fileCount:Ue},[Ue,Ve,ct]);return(0,T.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":p.kind,"data-session":i??"","data-testid":"git-explorer-view",children:[(0,T.jsxs)("header",{className:"gx-head",children:[(0,T.jsxs)("div",{className:"gx-head-main",children:[(0,T.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,T.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,T.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,T.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,T.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,T.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,T.jsx)("span",{className:"gx-repo",title:oe?.root??r("view.title"),children:oe===void 0?r("view.title"):eo(oe.root)}),me?.branch===null||me?.branch===void 0?null:(0,T.jsx)("span",{className:"gx-branch",children:me.branch}),me?.detached===!0?(0,T.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,me?.ahead!==void 0&&me.ahead>0?(0,T.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(me.ahead)}`}):null,me?.behind!==void 0&&me.behind>0?(0,T.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(me.behind)}`}):null]}),(0,T.jsxs)("div",{className:"gx-head-meta",style:Jr,children:[oe===void 0?null:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("span",{children:[r("head.changes")," ",(0,T.jsx)("b",{children:Ue})]}),(0,T.jsxs)("span",{children:[r("head.commits")," ",(0,T.jsx)("b",{children:oe.counts.commits})]}),(0,T.jsxs)("span",{children:[r("head.branches")," ",(0,T.jsx)("b",{children:oe.counts.branches})]})]}),(0,T.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:p.kind==="loading",onClick:De,children:"\u21BB"})]})]}),i===void 0?(0,T.jsx)(st,{title:r("state.noSession.title"),description:r("state.noSession.description")}):p.kind==="no-service"?(0,T.jsx)(st,{title:r("state.noService.title"),description:r("state.noService.description")}):p.kind==="loading"?(0,T.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):p.kind==="failed"?(0,T.jsx)(st,{title:r("state.failed.title"),description:p.message,actionLabel:r("action.retry"),onAction:De}):p.kind==="ready"&&!p.snapshot.isRepository?(0,T.jsx)(st,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:De}):p.kind==="ready"?(0,T.jsxs)("div",{className:"gx-body",style:le===null?void 0:{"--gx-left-col":`${le}px`},children:[(0,T.jsx)(pn,{groups:Ve,stats:ct,t:r,onOpen:Nt,claimFocus:he,onFocusClaimed:Q}),(0,T.jsx)("div",{ref:Ne,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":le??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ie,onPointerMove:Ge,onPointerUp:we,onPointerCancel:we,onLostPointerCapture:we,onKeyDown:Pe,onDoubleClick:Re}),(0,T.jsxs)("div",{className:"gx-col",style:de===null?void 0:{"--gx-detail-h":`${String(de)}%`},children:[(0,T.jsx)(En,{commits:L,graph:Vn,selectedHash:h,headHash:p.snapshot.head?.hash??null,total:p.snapshot.counts.commits,hasMore:F,loadingMore:$,loadError:k,searching:ee,search:K,t:r,onSelect:R,onLoadMore:qn,onSearch:ae,workingTree:je,onSelectUncommitted:()=>R(ve),...p.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:De,retryLabel:r("action.retry")}:{}}),(0,T.jsx)("div",{ref:Se,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":de??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:V,onPointerMove:Te,onPointerUp:Ae,onPointerCancel:Ae,onLostPointerCapture:Ae,onKeyDown:Kn,onDoubleClick:dt}),h===ve&&je!==void 0?(0,T.jsx)(mn,{groups:je.groups,stats:je.stats,t:r,onOpen:Nt}):(0,T.jsx)(gn,{sessionId:i,hash:h,remote:c,t:r,onSelect:R,onOpenFile:Yn})]})]}):null]})}return a}var Wn=["slots","locale","workbench","remote"];function Fn(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function _n(e){return()=>{try{let n=e.remote?.gitExplorer;if(Fn(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Fn(n))return n}catch{}let t=zn(e);return t===void 0?void 0:Wt(t)}}function zn(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${Dt}/${r}`,o,a)}var lt;function On(e){let t=e.locale.bind(_e);lt?.();let n=e.locale.register(_e,{zh:Pt,en:Lt});lt=n;let r=cn(typeof document>"u"?void 0:document),o=_n(e),a=Yt({store:_t(o),t});e.slots.inject(ht,()=>e.slots.register({name:ht,id:Ht,order:30,locale:_e},a));let s=e.workbench;if(s!=null){let i=An({workbench:s,version:s.version,t,remote:o});e.slots.inject(pt,()=>e.slots.register({name:pt,id:We,order:110,label:()=>t("tab.label"),locale:_e},i))}return()=>{r(),n(),lt===n&&(lt=void 0)}}var $n={groupChanges:ze,formatCommitDetail:et,createJump:tt,computeWindow:nt},Bn={name:"dsh-git-explorer",inject:Wn,apply:On,__test:$n},ro=Bn;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
