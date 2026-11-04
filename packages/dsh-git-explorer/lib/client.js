window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ze=Object.defineProperty;var In=Object.getOwnPropertyDescriptor;var Gn=Object.getOwnPropertyNames;var An=Object.prototype.hasOwnProperty;var Fn=(e,t)=>{for(var n in t)Ze(e,n,{get:t[n],enumerable:!0})},_n=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Gn(t))!An.call(e,o)&&o!==n&&Ze(e,o,{get:()=>t[o],enumerable:!(r=In(t,o))||r.enumerable});return e};var Bn=e=>_n(Ze({},"__esModule",{value:!0}),e);var Ir={};Fn(Ir,{__test:()=>kn,apply:()=>wn,boot:()=>Mt,clientPlugin:()=>Cn,createRemoteResolver:()=>yn,createRpcCall:()=>vn,default:()=>Hr,inject:()=>bn});module.exports=Bn(Ir);var mt={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},xt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var et="conversation.view",Me="git-explorer";var tt="conversation.session.header.actions",bt="git-branch";var Le="git-explorer",yt="gitExplorer";var M=require("react");var vt=Object.freeze([]);function wt(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:vt}));let r=[];return e.forEach((o,a)=>{let i=zn(o.name,n);i!==void 0&&r.push({match:{branch:o,ranges:On(i)},order:a,run:$n(i)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function nt(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&rt(n.branch))return t}return-1}function kt(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return nt(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&rt(o.branch))return r}return t}function Ct(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!rt(n.branch)))return n.branch}function rt(e){return e.worktreePath===void 0}function zn(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),i=-1;for(let s=r;s<e.length;s+=1)if(e.charAt(s).toLowerCase()===a){i=s;break}if(i===-1)return;n.push(i),r=i+1}return n}function On(e){let t=e[0];if(t===void 0)return vt;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let i=e[a];if(i!==void 0){if(i===o){o=i+1;continue}n.push([r,o]),r=i,o=i+1}}return n.push([r,o]),n}function $n(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function Rt(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function ce(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function ue(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Ge="service-unavailable",Wn=Object.freeze({status:"idle",revision:0,sessionId:null}),ot;function Kn(e){let t=Wn,n=-1,r=0,o=new Set,a=c=>{t=c;for(let y of[...o])y()},i=c=>t.sessionId===c&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(c){return o.add(c),()=>{o.delete(c)}},getSnapshot:()=>t,load:async c=>{if(i(c))return;let y=e(),u=++r,x=t.revision,z=t.sessionId===c;a({status:"loading",...z&&t.list!==void 0?{list:t.list}:{},revision:x,sessionId:c});let S=()=>u!==r||t.revision!==x;if(typeof y?.branches!="function"){if(S())return;a({status:"error",error:Ge,revision:x,sessionId:c});return}try{let N=await y.branches({sessionId:c});if(S())return;let C=ce(N);if(!C.ok){a({status:"error",error:C.message,revision:x,sessionId:c});return}if(C.result.ok===!1){a({status:"error",error:C.result.error.message,revision:x,sessionId:c});return}n=x,a({status:"ready",list:C.result.list,revision:x,sessionId:c})}catch(N){if(S())return;a({status:"error",error:ue(N),revision:x,sessionId:c})}},switchTo:async(c,y)=>{let u=()=>t.sessionId!==c,x=e();if(typeof x?.switchBranch!="function")return u()||a({...t,error:Ge}),{switched:!1};try{let z=await x.switchBranch({sessionId:c,name:y}),S=ce(z),N=S.ok?S.result.ok===!1?S.result.error.message:void 0:S.message;if(N!==void 0)return u()||a({...t,error:N}),{switched:!1};if(u())return{switched:!0};let C=S.ok&&S.result.ok===!0?S.result:void 0,G=C===void 0?y:C.branch,f=t.list;return a({status:f===void 0?t.status:"ready",...f===void 0?{}:{list:{...f,detached:!1,headHash:null,branches:f.branches.map($=>({...$,current:$.name===G}))}},revision:t.revision+1,sessionId:c}),C===void 0||C.stash===void 0?{switched:!0}:{switched:!0,stash:C.stash}}catch(z){return u()||a({...t,error:ue(z)}),{switched:!1}}},bump(){a({...t,revision:t.revision+1})}}}function Vn(e){return ot=Kn(e),ot}var St=Vn;function Et(){return ot}var fe=require("react"),qn=Object.freeze({}),Ae=null,at;function Mt(e){Ae=e}function Lt(){if(at!=null)return at;if(Ae===null)return qn;let e=Tt(Ae,"@deepseek-ai/dsh-client-ui-primitives"),t=Tt(Ae,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,i=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof i=="function"?{createPortal:i}:{}}}function Tt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var Nt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},Pt=e=>(0,fe.createElement)("svg",{...Nt,className:e.className},(0,fe.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,fe.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,fe.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,fe.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,fe.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),Dt=e=>(0,fe.createElement)("svg",{...Nt,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,fe.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var L=require("react/jsx-runtime"),Ht=320,jn="min(420px, 100vw - 32px)",It=5,Fe=8;function Un(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:It,margin:Fe})??void 0:Yn(t,n)}function Yn(e,t){let[n,r]=(0,M.useState)(void 0);return(0,M.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let i=a.getBoundingClientRect(),s=Math.min(Ht,Math.max(160,window.innerWidth-Fe*2)),h=Math.min(Math.max(i.right-s,Fe),window.innerWidth-s-Fe);r({left:h,top:i.bottom+It,width:s})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function Xn(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}Jn(t,n,o,a)}function Jn(e,t,n,r){(0,M.useEffect)(()=>{if(!n)return;let o=a=>{let i=a.target;i instanceof Node&&e.current?.contains(i)!==!0&&t.current?.contains(i)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function Qn(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[i,s]=o;i>r&&n.push((0,L.jsx)("span",{children:e.slice(r,i)},`plain-${a}`)),n.push((0,L.jsx)("span",{className:"gx-branch-match",children:e.slice(i,s)},`hit-${a}`)),r=s}),r<e.length&&n.push((0,L.jsx)("span",{children:e.slice(r)},"tail")),n}function Zn(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function er(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let a=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${a}`)}if(e.untrackedFiles>0){let a=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${a}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function Gt({store:e,t}){function n({sessionId:r}){let o=(0,M.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,i]=(0,M.useState)(!1),[s,h]=(0,M.useState)(""),[c,y]=(0,M.useState)(-1),[u,x]=(0,M.useState)(null),[z,S]=(0,M.useState)(null),N=(0,M.useRef)(r);N.current=r;let C=(0,M.useRef)(null),G=(0,M.useRef)(null),f=(0,M.useRef)(null),$=(0,M.useRef)(null),_=(0,M.useRef)(null),m=(0,M.useRef)(!1),v=(0,M.useId)(),p=(0,M.useId)(),k=Lt(),F=k.createPortal!==void 0,ee=k.IconBranch??Pt,oe=k.IconChevron??Dt,P=o.list,Y=P===void 0?void 0:Zn(P.root),O=(0,M.useMemo)(()=>wt(P?.branches??[],s),[P,s]),te=(0,M.useCallback)(()=>{i(!1),h(""),S(null)},[]),ie=(0,M.useCallback)(()=>{m.current=!0,te(),G.current?.focus({preventScroll:!0})},[te]),E=(0,M.useCallback)(()=>{m.current=!0,te()},[te]);(0,M.useEffect)(()=>{te(),x(null),r!==void 0&&e.load(r)},[e,r,te]),(0,M.useLayoutEffect)(()=>{a&&$.current?.focus({preventScroll:!0})},[a]),(0,M.useLayoutEffect)(()=>{if(a||!m.current)return;m.current=!1;let T=document.activeElement;(T===null||T===document.body||T===G.current||C.current?.contains(T)===!0)&&G.current?.focus({preventScroll:!0})},[a]),(0,M.useEffect)(()=>{y(nt(O))},[O]),(0,M.useEffect)(()=>{_.current?.scrollIntoView?.({block:"nearest"})},[c,O]),(0,M.useEffect)(()=>{if(!a)return;let T=j=>{j.key!=="Escape"||j.isComposing||(j.preventDefault(),ie())};return document.addEventListener("keydown",T),()=>document.removeEventListener("keydown",T)},[a,ie]);let I=Un(k,a,G,f);Xn(k,C,f,F,a,E);let D=()=>{if(a){te();return}i(!0),r!==void 0&&e.load(r)},X=()=>{r!==void 0&&e.load(r)},re=async T=>{if(u!==null||T.worktreePath!==void 0)return;if(T.current){ie();return}if(r===void 0)return;x(T.name);let j=await e.switchTo(r,T.name);if(N.current===r&&(x(null),!!j.switched)){if(e.load(r),j.stash?.conflict===!0){S(j.stash);return}ie()}},ye=()=>{let T=Ct(O,c);T!==void 0&&re(T)},me=T=>{if(!(T.metaKey||T.ctrlKey||T.altKey)&&!T.nativeEvent.isComposing){if(T.key==="ArrowDown"||T.key==="ArrowUp"){T.preventDefault();let j=T.key==="ArrowDown"?1:-1;y(V=>kt(O,V,j));return}T.key==="Enter"&&(T.preventDefault(),ye())}};if(r===void 0)return null;let se=P?.branches.find(T=>T.current)?.name,pe=P===void 0?t("branch.loading"):P.detached?P.headHash??t("head.detached"):se??t("branch.unborn");if(!a&&P?.isRepository!==!0)return null;let ke=`${t("head.detached")} ${P?.headHash??""}`.trim(),ae=P?.detached===!0?ke:pe,he=P?.isRepository===!0?P.worktree:void 0,ne=he===void 0?void 0:er(he,t),Ue=t("branch.worktreeSep"),Ye=ne===void 0?ae:ne.description,Ee=ne===void 0||he?.dirty!==!0?`${t("branch.title")}: ${ae}`:`${t("branch.title")}: ${ae}${Ue}${ne.description}`,Ce=o.error===Ge?t("state.noService.title"):o.error,He=(0,L.jsxs)("div",{ref:f,id:p,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:Ht,maxWidth:jn,...I},children:[z?.conflict===!0?(0,L.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,L.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),z.message===void 0||z.message===""?null:(0,L.jsx)("span",{className:"gx-branch-warning-detail",children:z.message})]}):null,P===void 0||Y===void 0?null:(0,L.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:P.root,children:[(0,L.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,L.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,L.jsx)("span",{className:"gx-branch-scope-parent",children:Y.parent}),(0,L.jsx)("span",{className:"gx-branch-scope-name",children:Y.name})]})]}),(0,L.jsx)("input",{ref:$,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:s,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":P===void 0?void 0:v,"aria-activedescendant":c>=0&&P!==void 0?`${v}-option-${c}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:T=>h(T.target.value),onKeyDown:me}),Ce!==void 0?(0,L.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,L.jsx)("span",{className:"gx-branch-error-text",children:Ce}),(0,L.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:X,children:t("action.retry")})]}):null,o.status==="loading"&&P===void 0?(0,L.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,P!==void 0?(0,L.jsxs)("div",{className:"gx-branch-list",id:v,role:"listbox","aria-label":t("branch.title"),children:[P.branches.length===0?(0,L.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,P.branches.length>0&&O.length===0?(0,L.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,O.map((T,j)=>{let V=T.branch,Te=j===c;return(0,L.jsxs)("button",{ref:Te?_:void 0,type:"button",role:"option",id:`${v}-option-${j}`,"aria-selected":Te,"data-active":Te?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${V.name}`,"data-current":V.current?"true":void 0,"aria-current":V.current?"true":void 0,title:V.worktreePath===void 0?V.name:`${V.name} ${t("branch.worktree")}: ${V.worktreePath}`,disabled:u!==null||V.worktreePath!==void 0,onClick:()=>{re(V)},children:[(0,L.jsx)("span",{className:"gx-branch-row-name",children:Qn(V.name,T.ranges)}),V.worktreePath===void 0?null:(0,L.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),V.current?(0,L.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},V.name)})]}):null]});return(0,L.jsxs)("div",{className:"gx-branch-action",ref:C,children:[(0,L.jsxs)("button",{ref:G,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Ee,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?p:void 0,title:Ye,onClick:D,children:[(0,L.jsx)(ee,{className:"gx-branch-icon"}),(0,L.jsx)("span",{className:"gx-branch-name",title:ae,children:pe}),ne===void 0||he?.dirty!==!0?null:(0,L.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:ne.dot?t("branch.worktreeDirty"):void 0,children:[ne.additions>0?(0,L.jsxs)("span",{className:"gx-branch-add",children:["+",ne.additions]}):null,ne.deletions>0?(0,L.jsxs)("span",{className:"gx-branch-del",children:["\u2212",ne.deletions]}):null,ne.dot?(0,L.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,L.jsx)(oe,{className:"gx-branch-chevron"})]}),a?k.createPortal===void 0?He:k.createPortal(He,document.body):null]})}return n}function At(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function _e(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function Be(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function Ft(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var tr={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Ne(e){return tr[e]}var _t={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function nr(e,t){return(_t[e]??0)>=(_t[t]??0)?e:t}function Bt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function it(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function rr(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:nr(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let i=a[0];if(i==="1"){let s=a.slice(2),h=s.slice(0,2),c=it(s,7);c!==""&&r({path:c,status:Bt(h),staged:h[0]!==".",isDirectory:!1})}else if(i==="2"){let s=a.slice(2),h=s.slice(0,2),c=it(s,8),y=t[o+1]??"";c!==""&&y!==""&&(o+=1,r({path:c,status:Bt(h),staged:h[0]!==".",isDirectory:!1,origPath:y}))}else if(i==="u"){let s=a.slice(2),h=it(s,9);h!==""&&r({path:h,status:"conflicted",staged:!1,isDirectory:!1})}else if(i==="?"){let s=a.slice(2);if(s==="")continue;let h=s.endsWith("/");r({path:h?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:h})}}return[...n.values()]}function or(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function st(e){let t=new Map;for(let n of e){let r=or(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function ze(e){return st(rr(e))}function lt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let i=Math.floor(a/7);if(i<5)return`${i}w`;let s=Math.floor(a/30);return s<12?`${s}mo`:`${Math.floor(a/365)}y`}function Oe(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:lt(e.time,t)}}function $e({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function zt({seam:e,sessionId:t}){return(n,r,o=1)=>{let a=typeof n=="string"?n.trim().toLowerCase():"";if(a===""||typeof r!="string")return;let i=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i==="")return;let s=Number.isFinite(o)&&o>0?Math.floor(o):1,h=`git:${a}:${String(s)}:${i}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",h);let c=e.openViewOrSwitch("fs-explorer",h);if(c.focused){e.viewFocus?.take?.("fs-explorer");return}if(c.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",h)!==!0&&e.openView?.("fs-explorer",h)!==!0&&e.viewFocus?.request?.("fs-explorer",h)}}var ar=/^commit:([0-9a-f]{4,64})$/iu;function Ot(e){if(e===void 0)return;let t=ar.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var Se=24;function We(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),i=Math.max(0,e.length-a-o*2),s=Math.floor(Math.max(0,t.scrollTop)/n)-o,h=Math.min(Math.max(s,0),i),c=Math.min(e.length,h+a+o*2);return{rows:e.slice(h,c),startIndex:h,endIndex:c}}function $t(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return At({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function Wt(e){let t=[],n=[],r=[],o=0,a=[],i=()=>r.length===0?o++:(r.sort((y,u)=>y-u),r.shift()??o++),s=c=>{c!==null&&!r.includes(c)&&r.push(c)},h=()=>{let c=t.indexOf(null);return c>=0?c:(t.push(null),n.push(null),t.length-1)};for(let c of e){let y=[...t],u=[...n],x=y.indexOf(c.hash),z=x>=0;z||(x=h());let S=z?n[x]??null:null;S===null&&(S=i(),n[x]=S);for(let f=0;f<y.length;f+=1)f!==x&&y[f]===c.hash&&(s(n[f]??null),t[f]=null,n[f]=null);let N=c.parents[0];N===void 0?(s(n[x]??null),t[x]=null,n[x]=null):(t[x]=N,n[x]=S);let C=[];for(let f=1;f<c.parents.length;f+=1){let $=c.parents[f];if($===void 0)continue;let _=t.indexOf($);_<0&&(_=h(),t[_]=$),n[_]===null&&(n[_]=i()),C.push(_)}let G=[];for(let f=0;f<y.length;f+=1){let $=y[f];if($===null)continue;let _=u[f]??S;$===c.hash?G.push({kind:"into",from:f,to:x,color:_}):G.push({kind:"pass",from:f,to:f,color:_})}N!==void 0&&G.push({kind:"out",from:x,to:x,color:n[x]??S});for(let f of C)G.push({kind:"out",from:x,to:f,color:n[f]??S});for(a.push({lane:x,color:S,merge:c.parents.length>=2,segments:G});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function Kt(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function ve(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Vt(e,t){return`${e.trim().toLowerCase()}\0${t}`}function qt(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let a=n.keys().next();a.done||n.delete(a.value)}},get size(){return n.size}}}function jt(e,t,n,r=10,o=8){let a=Math.max(o,n.width-t.width-o),i=e.right+r;i>a&&(i=e.left-t.width-r,i<o&&(i=Math.min(a,Math.max(o,e.left))));let s=Math.max(o,n.height-t.height-o),h=e.bottom+r,c=e.top-t.height-r,y;return h<=s?y=Math.max(o,h):c>=o?y=c:y=Math.min(s,Math.max(o,e.top)),{left:i,top:y}}var Ut="dsh-git-explorer-styles",ir=`
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
  .gx-author { display: none; }
}
`;function Yt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Ut}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Ut,n.textContent=ir,e.head.appendChild(n),()=>{n.remove()}}var b=require("react");var K=require("react");function Xt(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let a=o.files.filter(i=>i.path.toLowerCase().includes(n));a.length>0&&r.push({dir:o.dir,files:a})}return r}var A=require("react/jsx-runtime");function be(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function sr(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function lr(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function dr({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,A.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,A.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Jt({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let i=(0,K.useRef)(null),s=(0,K.useRef)(null),[h,c]=(0,K.useState)(""),y=(0,K.useMemo)(()=>Xt(e,h),[e,h]),u=(0,K.useMemo)(()=>sr(y),[y]),x=(0,K.useMemo)(()=>u.map(be),[u]),z=e.reduce((p,k)=>p+k.files.length,0),S=(0,K.useMemo)(()=>y.reduce((p,k)=>p+k.files.length,0),[y]),N=h.trim()!=="",[C,G]=(0,K.useState)(void 0),f=(0,K.useMemo)(()=>C===void 0?-1:x.indexOf(C),[C,x]),$=(0,K.useRef)(0);(0,K.useEffect)(()=>{f>=0&&($.current=f)},[f]);let _=(0,K.useRef)(u);_.current=u,(0,K.useEffect)(()=>{if(!o)return;a(),lr(i.current);let p=_.current.find(k=>k.kind==="file");p!==void 0&&G(be(p))},[o,a]),(0,K.useEffect)(()=>{if(C===void 0||f>=0||u.length===0)return;let p=u[Math.min($.current,u.length-1)];p!==void 0&&G(be(p))},[f,C,u]);let m=(0,K.useCallback)(p=>{let k=x[p];k!==void 0&&(G(k),s.current?.focus({preventScroll:!0}))},[x]);(0,K.useEffect)(()=>{if(f<0)return;s.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[f,C]);let v=(0,K.useCallback)(p=>{let k=_e({key:p.key,composing:p.nativeEvent.isComposing,alt:p.altKey,ctrl:p.ctrlKey,meta:p.metaKey,shift:p.shiftKey});if(k===null)return;if(p.preventDefault(),k==="activate"){let ee=f<0?void 0:u[f];ee?.kind==="file"&&!ee.file.isDirectory&&r(ee.file.path,1);return}let F=Be(f<0?void 0:f,k,u.length);F!==void 0&&m(F)},[f,m,r,u]);return(0,A.jsxs)("section",{ref:i,className:"gx-pane","data-testid":"git-changes",children:[(0,A.jsxs)("header",{className:"gx-pane-head",children:[(0,A.jsx)("span",{children:n("changes.title")}),(0,A.jsx)("span",{className:"gx-count",children:N?`${String(S)} / ${String(z)}`:z}),(0,A.jsx)("span",{className:"gx-spacer"}),(0,A.jsx)("input",{className:"gx-filter",type:"search",value:h,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:p=>c(p.currentTarget.value)})]}),(0,A.jsx)("div",{className:"gx-scroll",ref:s,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:v,children:z===0?(0,A.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,A.jsx)("strong",{children:n("changes.empty")})}):u.length===0?(0,A.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,A.jsx)("strong",{children:n("changes.noMatch")})}):u.map(p=>p.kind==="group"?(0,A.jsxs)("div",{className:"gx-group-head","data-cursor":be(p)===C?"true":"false",children:[(0,A.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,A.jsx)("span",{className:"gx-count",children:p.count})]},be(p)):(0,A.jsxs)("button",{type:"button",className:"gx-file","data-status":p.file.status,"data-directory":p.file.isDirectory?"true":"false","data-renamed":p.file.origPath===void 0?"false":"true","data-cursor":be(p)===C?"true":"false","data-testid":"git-change-file",title:p.file.isDirectory?`${n(`status.${p.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${p.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{G(be(p)),s.current?.focus({preventScroll:!0}),p.file.isDirectory||r(p.file.path,1)},children:[(0,A.jsx)("span",{className:"gx-badge","data-status":p.file.status,children:Ne(p.file.status)}),(0,A.jsxs)("span",{className:"gx-file-name",children:[ve(p.file.path),p.file.origPath===void 0?null:(0,A.jsx)("span",{className:"gx-file-orig",children:ve(p.file.origPath)})]}),(0,A.jsx)("span",{className:"gx-file-stats",children:(0,A.jsx)(dr,{stat:t.get(p.file.path)})})]},be(p)))})]})}var B=require("react"),Qt=require("react-dom");var g=require("react/jsx-runtime"),cr=200,ur=40,pr=24,hr=7;function gr({additions:e,deletions:t}){return e===null&&t===null?(0,g.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,g.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function fr(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function mr({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,g.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,g.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,g.jsx)("strong",{children:t("preview.unavailable")}),(0,g.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,g.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,g.jsx)("strong",{children:t("preview.unavailable")}),(0,g.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,g.jsxs)(g.Fragment,{children:[r.text===""?(0,g.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,g.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,g.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,g.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function xr({preview:e,hash:t,t:n}){let r=(0,B.useRef)(null),o=(0,B.useRef)(null),[a,i]=(0,B.useState)(null),[s,h]=(0,B.useState)(!1);return(0,B.useLayoutEffect)(()=>{let c=r.current;if(c===null)return;let y=c.getBoundingClientRect();i(jt(e.anchor,{width:y.width,height:y.height},{width:window.innerWidth,height:window.innerHeight}));let u=o.current;h(u!==null&&u.scrollHeight>u.clientHeight+1)},[e]),typeof document>"u"?null:(0,Qt.createPortal)((0,g.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":s?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:a?.left??0,top:a?.top??0,visibility:a===null?"hidden":"visible"},children:[(0,g.jsxs)("div",{className:"gx-preview-head",children:[(0,g.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Ne(e.file.status)}),(0,g.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:ve(e.file.path)}),(0,g.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,hr)} \xB7 ${n("preview.revision")}`})]}),(0,g.jsx)("div",{className:"gx-preview-body",children:(0,g.jsx)(mr,{preview:e,t:n,textRef:o})})]}),document.body)}function Zt({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:a}){let[i,s]=(0,B.useState)({kind:"idle"}),[h,c]=(0,B.useState)(0),y=(0,B.useRef)(new Map),[u,x]=(0,B.useState)({kind:"idle"}),z=(0,B.useRef)(qt(pr)),S=(0,B.useRef)(void 0),N=(0,B.useRef)(void 0),C=(0,B.useRef)(void 0),G=(0,B.useRef)(null),f=(0,B.useCallback)(()=>{S.current=void 0,N.current!==void 0&&(window.clearTimeout(N.current),N.current=void 0),C.current?.abort(),C.current=void 0,x(m=>m.kind==="idle"?m:{kind:"idle"})},[]),$=(0,B.useCallback)((m,v)=>{if(f(),t===void 0)return;let p=v.getBoundingClientRect(),k={left:p.left,top:p.top,right:p.right,bottom:p.bottom},F=Vt(t,m.path);S.current=F,N.current=window.setTimeout(()=>{if(N.current=void 0,S.current!==F)return;let ee=z.current.get(F);if(ee!==void 0){x({kind:"ready",file:m,anchor:k,page:ee});return}if(e===void 0||n===void 0||typeof n.show!="function"){x({kind:"unavailable",file:m,anchor:k,message:r("preview.noService")});return}let oe=new AbortController;C.current=oe,x({kind:"loading",file:m,anchor:k}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:m.path,offset:1,limit:ur},oe.signal)).then(P=>{if(oe.signal.aborted||S.current!==F)return;let Y=ce(P);if(!Y.ok){x({kind:"unavailable",file:m,anchor:k,message:Y.message});return}let O=Y.result;if(!O.ok){x({kind:"unavailable",file:m,anchor:k,message:fr(O.error.code,O.error.message,r)});return}z.current.set(F,O.page),x({kind:"ready",file:m,anchor:k,page:O.page})}).catch(P=>{oe.signal.aborted||S.current!==F||x({kind:"unavailable",file:m,anchor:k,message:ue(P)})}).finally(()=>{C.current===oe&&(C.current=void 0)})},cr)},[f,t,n,e,r]);(0,B.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let m=y.current.get(t);if(m!==void 0){s({kind:"ready",detail:m});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let v=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(p=>{if(!v)return;let k=ce(p);if(!k.ok){s({kind:"failed",message:k.message});return}let F=k.result;F.ok?(y.current.set(t,F.detail),s({kind:"ready",detail:F.detail})):s({kind:"failed",message:F.error.message===""?F.error.code:F.error.message})}).catch(p=>{v&&s({kind:"failed",message:ue(p)})}),()=>{v=!1}},[t,n,e,h,r]),(0,B.useEffect)(()=>{if(u.kind==="idle")return;let m=v=>{v.key==="Escape"&&f()};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[u.kind,f]),(0,B.useEffect)(()=>{let m=G.current;if(m===null)return;let v=()=>f();return m.addEventListener("scroll",v,{passive:!0}),()=>m.removeEventListener("scroll",v)},[f]),(0,B.useEffect)(()=>{f()},[t,h,e,n,f]),(0,B.useEffect)(()=>()=>{S.current=void 0,N.current!==void 0&&window.clearTimeout(N.current),C.current?.abort()},[]);let _=Oe(i.kind==="ready"?i.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,g.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,g.jsxs)("header",{className:"gx-detail-head",children:[(0,g.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,g.jsx)("span",{className:"gx-hash",children:_.shortHash}),(0,g.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,g.jsx)("div",{className:"gx-detail-body",ref:G,children:i.kind==="idle"?(0,g.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):i.kind==="loading"?(0,g.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):i.kind==="failed"?(0,g.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,g.jsx)("strong",{children:r("detail.failed")}),(0,g.jsx)("span",{children:i.message}),(0,g.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>c(m=>m+1),children:r("action.retry")})]}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("div",{className:"gx-detail-subject",children:i.detail.subject}),(0,g.jsxs)("div",{className:"gx-detail-meta",children:[(0,g.jsx)("span",{className:"gx-author",children:i.detail.author}),(0,g.jsx)("span",{children:_.relative}),(0,g.jsx)("span",{title:new Date(i.detail.time*1e3).toLocaleString(),children:new Date(i.detail.time*1e3).toLocaleDateString()})]}),(0,g.jsxs)("div",{className:"gx-parents",children:[(0,g.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),i.detail.parents.length===0?(0,g.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):i.detail.parents.map(m=>(0,g.jsx)("button",{type:"button",className:"gx-parent",title:m,onClick:()=>o(m),children:m.slice(0,7)},m))]}),i.detail.body===""?null:(0,g.jsx)("pre",{className:"gx-body-text",children:i.detail.body}),(0,g.jsxs)("div",{className:"gx-detail-files",children:[(0,g.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(i.detail.files.length)}`}),i.detail.files.length===0?(0,g.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):st(i.detail.files).map(m=>(0,g.jsxs)("div",{className:"gx-detail-group",children:[(0,g.jsx)("div",{className:"gx-detail-dir",children:m.dir===""?r("changes.root"):m.dir}),m.files.map(v=>(0,g.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:v.path,onClick:()=>a?.(v.path),onMouseEnter:p=>$(v,p.currentTarget),onMouseLeave:f,children:[(0,g.jsx)("span",{className:"gx-badge","data-status":v.status,children:Ne(v.status)}),(0,g.jsxs)("span",{className:"gx-file-name",children:[ve(v.path),v.origPath===void 0?null:(0,g.jsx)("span",{className:"gx-file-orig",children:ve(v.origPath)})]}),(0,g.jsx)("span",{className:"gx-file-stats",children:(0,g.jsx)(gr,{additions:v.additions,deletions:v.deletions})})]},v.path))]},m.dir===""?".":m.dir))]})]})}),u.kind==="idle"?null:(0,g.jsx)(xr,{preview:u,hash:t??"",t:r})]})}var q=require("react");var Pe=require("react/jsx-runtime");function en(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function tn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=h=>h*o+o/2,i=n/2,s=e.segments.map((h,c)=>{let y=a(h.from),u=a(h.to),x=h.kind==="pass"?`M ${String(y)} 0 L ${String(u)} ${String(n)}`:h.kind==="into"?`M ${String(y)} 0 C ${String(y)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(i)}`:`M ${String(y)} ${String(i)} C ${String(y)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(n)}`;return(0,Pe.jsx)("path",{d:x,fill:"none",stroke:en(h.color),strokeWidth:1.4,strokeLinecap:"round"},`${h.kind}-${String(h.from)}-${String(h.to)}-${String(c)}`)});return(0,Pe.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,Pe.jsx)("circle",{cx:a(e.lane),cy:i,r:e.merge?4:3.2,fill:en(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var H=require("react/jsx-runtime");var br=12;function yr({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,cursor:i,onSelect:s}){return(0,H.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-cursor":i?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,H.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,H.jsx)(tn,{row:t,laneCount:n,height:Se}),(0,H.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,H.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(h=>(0,H.jsxs)("span",{className:"gx-ref","data-kind":h.kind,children:[(0,H.jsx)("span",{className:"gx-ref-name",children:h.name}),(0,H.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:h.name})]},`${h.kind}:${h.name}`)),(0,H.jsx)("span",{className:"gx-author",children:e.author}),(0,H.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:lt(e.time)})]})}function nn(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:i,loadingMore:s,loadError:h,searching:c,search:y,t:u,onSelect:x,onLoadMore:z,onSearch:S}=e,N=(0,q.useRef)(null),[C,G]=(0,q.useState)(0),[f,$]=(0,q.useState)(0),_=(0,q.useRef)(!1),[m,v]=(0,q.useState)(void 0),p=m===void 0?void 0:t[m]?.hash,k=(0,q.useRef)(void 0);(0,q.useEffect)(()=>{let E=N.current;if(E===null)return;let I=()=>$(E.clientHeight);if(I(),typeof ResizeObserver>"u")return;let D=new ResizeObserver(I);return D.observe(E),()=>D.disconnect()},[]),(0,q.useEffect)(()=>{s||(_.current=!1)},[s]);let F=(0,q.useCallback)(()=>{!i||s||_.current||(_.current=!0,z())},[i,s,z]),ee=E=>{let I=E.currentTarget;G(I.scrollTop),I.scrollTop+I.clientHeight>=I.scrollHeight-160&&F()};(0,q.useEffect)(()=>{let E=p;if(E===void 0)return;let I=t.findIndex(D=>D.hash===E);I!==m&&I>=0?v(I):I<0&&v(void 0)},[t,m,p]),(0,q.useEffect)(()=>{let E=k.current!==r;if(k.current=r,!E||m===void 0||r===void 0)return;let I=t.findIndex(D=>D.hash===r);I>=0&&I!==m&&v(I)},[r,t,m]),(0,q.useEffect)(()=>{if(m===void 0)return;let E=N.current;if(E===null)return;let I=$t({scrollTop:E.scrollTop,viewport:E.clientHeight===0?480:E.clientHeight,rowHeight:Se,index:m,rowCount:t.length});I!==E.scrollTop&&(E.scrollTop=I,G(I))},[m,t.length]),(0,q.useEffect)(()=>{m===void 0||!Ft(m,t.length,br)||F()},[m,t.length,F]);let oe=(0,q.useCallback)(E=>{let I=_e({key:E.key,composing:E.nativeEvent.isComposing,alt:E.altKey,ctrl:E.ctrlKey,meta:E.metaKey,shift:E.shiftKey});if(I===null)return;E.preventDefault();let D=m??t.findIndex(ye=>ye.hash===r),X=Be(D<0?void 0:D,I,t.length);if(X===void 0)return;v(X);let re=t[X];re!==void 0&&x(re.hash)},[t,m,x,r]),P=We(t,{scrollTop:C,height:f===0?480:f,rowHeight:Se}),Y=Math.max(1,Kt(n)),O=y.trim()!=="",te=O?u("history.noMatch"):e.emptyTitle??u("history.empty"),ie=O?void 0:e.emptyDescription;return(0,H.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,H.jsxs)("header",{className:"gx-pane-head",children:[(0,H.jsx)("span",{children:u("history.title")}),(0,H.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`}),(0,H.jsx)("span",{className:"gx-spacer"}),(0,H.jsx)("input",{className:"gx-filter",type:"search",value:y,spellCheck:!1,placeholder:u("history.search"),"aria-label":u("history.search"),"data-testid":"gx-history-search",onChange:E=>S(E.currentTarget.value)})]}),t.length===0?(0,H.jsxs)("div",{className:"gx-empty",children:[(0,H.jsx)("strong",{children:te}),ie===void 0?null:(0,H.jsx)("span",{children:ie}),e.onRetry===void 0?null:(0,H.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??u("action.retry")})]}):(0,H.jsx)("div",{className:"gx-scroll",ref:N,tabIndex:0,"data-testid":"git-history-scroll",onScroll:ee,onKeyDown:oe,children:(0,H.jsx)("div",{className:"gx-vlist",style:{height:t.length*Se},children:P.rows.map((E,I)=>{let D=P.startIndex+I;return(0,H.jsx)(yr,{commit:E,row:n[D],laneCount:Y,top:D*Se,selected:E.hash===r,head:E.hash===o,cursor:E.hash===p,onSelect:X=>{v(D),x(X)}},E.hash)})})}),(0,H.jsxs)("footer",{className:"gx-loadbar",children:[(0,H.jsx)("span",{children:`${u("history.loaded")} ${String(t.length)}`}),h===void 0?null:(0,H.jsx)("span",{className:"gx-del",children:h}),c?(0,H.jsx)("span",{className:"gx-search-status",children:u("history.searching")}):null,(0,H.jsx)("span",{className:"gx-spacer"}),i?(0,H.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:F,children:u(s?"history.loading":"history.loadMore")}):(0,H.jsx)("span",{children:t.length===0?"":u("history.noMore")})]})]})}function dt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var ct="git-explorer.leftColumnWidth";function ut(e){return Math.min(560,Math.max(240,e))}function on(e){if(e==null)return null;let t;try{t=e.getItem(ct)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function Ke(e,t){let n=Math.round(ut(t));if(e!=null)try{e.setItem(ct,String(n))}catch{}return n}function an(e){if(e!=null)try{e.removeItem(ct)}catch{}}function pt(e,t){return Math.round(e)===Math.round(t)}var rn=16;function sn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-rn};case"ArrowRight":return{kind:"nudge",delta:rn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var ht="git-explorer.detailHeight";function ln(e){return Math.min(88,Math.max(6,e))}function we(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function De(e,t){let n=t>0?t:600;return ln(Math.round(e/n*1e3)/10)}function dn(e,t){let n=t>0?t:600;return e/100*n}function cn(e){if(e==null)return null;let t;try{t=e.getItem(ht)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function Ve(e,t){let n=Math.round(ln(t)*10)/10;if(e!=null)try{e.setItem(ht,String(n))}catch{}return n}function un(e){if(e!=null)try{e.removeItem(ht)}catch{}}function pn(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var w=require("react/jsx-runtime"),Rr=250;function Sr(e,t){return e===void 0?"idle":t?"loading":"no-service"}function fn(e,t){let n=Ot(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function Er(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var Tr={display:"flex",alignItems:"center",gap:8};function Mr(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Lr=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function qe({title:e,description:t,actionLabel:n,onAction:r}){return(0,w.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,w.jsx)("strong",{children:e}),t===void 0?null:(0,w.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,w.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Nr(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function mn(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(i){let s=i.sessionId??t.currentSessionId(),h=(0,b.useRef)(s);h.current=s;let c=(0,b.useMemo)(()=>o(),[o]),[y]=(0,b.useState)(Et),[u,x]=(0,b.useState)(()=>({kind:Sr(s,c!==void 0)})),[z,S]=(0,b.useState)(0),[N,C]=(0,b.useState)([]),[G,f]=(0,b.useState)(!1),[$,_]=(0,b.useState)(!1),[m,v]=(0,b.useState)(void 0),[p,k]=(0,b.useState)(void 0),[F,ee]=(0,b.useState)(""),[oe,P]=(0,b.useState)(!1),Y=(0,b.useRef)(""),O=(0,b.useRef)(0),te=(0,b.useRef)(void 0),ie=(0,b.useRef)(void 0),[E,I]=(0,b.useState)(!0),D=(0,b.useMemo)(()=>Mr(),[]),[X,re]=(0,b.useState)(()=>on(D)),ye=(0,b.useRef)(null),me=(0,b.useRef)(null),[se,pe]=(0,b.useState)(()=>cn(D)),ke=(0,b.useRef)(null),ae=(0,b.useRef)(null),he=(0,b.useCallback)(l=>{te.current=l,k(l),I(!1)},[]),ne=(0,b.useCallback)(()=>{I(!1)},[]),Ue=(0,b.useCallback)(l=>{if(l.button!==0||me.current!==null||Lr())return;let d=ye.current?.previousElementSibling;if(d instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}me.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:d.getBoundingClientRect().width,restWidth:X},document.body.classList.add("gx-pane-resizing")}},[X]),Ye=(0,b.useCallback)(l=>{let d=me.current;d===null||d.pointerId!==l.pointerId||re(ut(d.baseWidth+l.clientX-d.startX))},[]),Ee=(0,b.useCallback)(l=>{let d=me.current;if(d===null||d.pointerId!==l.pointerId)return;me.current=null,document.body.classList.remove("gx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let R=d.baseWidth+l.clientX-d.startX;if(pt(R,d.baseWidth)){re(d.restWidth);return}re(Ke(D,R))},[D]),Ce=(0,b.useCallback)(()=>{an(D),re(null)},[D]),He=(0,b.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let d=sn(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(d===null)return;if(l.preventDefault(),l.stopPropagation(),d.kind==="reset"){Ce();return}if(d.kind==="min"||d.kind==="max"){let W=d.kind==="min"?240:560;re(Ke(D,W));return}let R=ye.current?.previousElementSibling,J=R instanceof HTMLElement?R.getBoundingClientRect().width:X??240;re(Ke(D,J+d.delta))},[D,Ce,X]),T=(0,b.useCallback)(()=>{let l=ke.current?.parentElement;return l instanceof HTMLElement?l.getBoundingClientRect().height:0},[]),j=(0,b.useCallback)(()=>T()||600,[T]),V=(0,b.useCallback)(()=>{let l=j();return we(dn(se===null?38:se,l),l)},[j,se]),Te=(0,b.useCallback)(l=>{if(l.button!==0||ae.current!==null)return;let d=ke.current?.parentElement;if(!(d instanceof HTMLElement))return;let R=ke.current?.nextElementSibling;if(R instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}ae.current={pointerId:l.pointerId,startY:l.clientY,baseHeight:R.getBoundingClientRect().height,columnHeight:d.getBoundingClientRect().height||600,restHeight:se},document.body.classList.add("gx-row-resizing")}},[se]),Rn=(0,b.useCallback)(l=>{let d=ae.current;if(d===null||d.pointerId!==l.pointerId)return;let R=we(d.baseHeight-(l.clientY-d.startY),d.columnHeight);pe(De(R,d.columnHeight))},[]),Xe=(0,b.useCallback)(l=>{let d=ae.current;if(d===null||d.pointerId!==l.pointerId)return;ae.current=null,document.body.classList.remove("gx-row-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let R=we(d.baseHeight-(l.clientY-d.startY),d.columnHeight);if(pt(R,d.baseHeight)){pe(d.restHeight);return}pe(Ve(D,De(R,d.columnHeight)))},[D]),Je=(0,b.useCallback)(()=>{un(D),pe(null)},[D]),Sn=(0,b.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let d=pn(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(d===null)return;if(l.preventDefault(),l.stopPropagation(),d.kind==="reset"){Je();return}let R=j();if(d.kind==="min"||d.kind==="max"){let W=d.kind==="min"?we(180,R):we(R,R);pe(Ve(D,De(W,R)));return}let J=we(V()+d.delta,R);pe(Ve(D,De(J,R)))},[j,V,D,Je]);(0,b.useEffect)(()=>()=>{me.current!==null&&document.body.classList.remove("gx-pane-resizing"),ae.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,b.useEffect)(()=>{if(s===void 0||i.openView===void 0)return;let l=t.views;if(l?.bind!==void 0)return l.bind(s,i.openView)},[s,i.openView,t]),(0,b.useEffect)(()=>{if(s===void 0){x({kind:"idle"});return}if(c===void 0){x({kind:"no-service"});return}let l=!0;return x({kind:"loading"}),v(void 0),O.current+=1,Y.current="",ee(""),P(!1),Promise.resolve().then(()=>c.snapshot({sessionId:s})).then(d=>{if(!l)return;let R=ce(d);if(!R.ok){x({kind:"failed",message:R.message});return}let J=R.result;if(!J.ok){x({kind:"failed",message:J.error.message===""?J.error.code:J.error.message});return}let W=J.snapshot;x({kind:"ready",snapshot:W}),C(W.commits),f(W.commits.length<W.counts.commits);let U=te.current;te.current=void 0,k(Z=>U!==void 0?U:Z!==void 0&&W.commits.some(de=>de.hash===Z)?Z:W.commits[0]?.hash)}).catch(d=>{l&&x({kind:"failed",message:ue(d)})}),()=>{l=!1}},[s,c,z]),(0,b.useEffect)(()=>{let l=i.viewRequest;if(l==null||l.view!==Me)return;let d=`${l.view}:${l.focus}`;ie.current!==d&&(ie.current=d,fn(l.focus,{select:he,complete:()=>i.completeViewRequest?.()}))},[i.viewRequest,i.completeViewRequest,he]),(0,b.useEffect)(()=>{let l=t.viewFocus;if(l===void 0||s===void 0)return;let d=()=>{let R=l.take(Me);R!==void 0&&fn(R,{select:he})};return d(),l.subscribe(d)},[t,s,he]);let En=(0,b.useMemo)(()=>Wt(N),[N]),Q=u.kind==="ready"?u.snapshot:void 0,ft=(0,b.useMemo)(()=>Q===void 0?[]:ze(Q.status),[Q]),Tn=(0,b.useMemo)(()=>{let l=new Map;for(let d of Q?.stats??[])l.set(d.path,{additions:d.additions,deletions:d.deletions});return l},[Q]),Ie=(0,b.useMemo)(()=>{let l=new Map;for(let d of Q?.branches??[]){let R=l.get(d.hash);R===void 0?l.set(d.hash,[{kind:d.kind,name:d.name,head:d.head}]):R.push({kind:d.kind,name:d.name,head:d.head})}return l},[Q]);(0,b.useEffect)(()=>{if(s===void 0||c===void 0||u.kind!=="ready")return;let l=F.trim();if(l===Y.current)return;let d=s,R=O.current+1;if(O.current=R,v(void 0),_(!1),l===""){Y.current="",P(!1);let W=u.snapshot.commits;C(W),f(W.length<u.snapshot.counts.commits),k(U=>U!==void 0&&W.some(Z=>Z.hash===U)?U:W[0]?.hash);return}P(!0);let J=setTimeout(()=>{Y.current=l,Promise.resolve().then(()=>c.query(dt(s,l,0))).then(W=>{if(O.current!==R||h.current!==d)return;let U=ce(W);if(!U.ok){v(U.message);return}let Z=U.result;if(!Z.ok){v(Z.error.message===""?Z.error.code:Z.error.message);return}let de=Z.page,Qe=Ie;C(de.commits.map(ge=>({...ge,refs:Qe.get(ge.hash)??[]}))),f(de.hasMore),k(ge=>ge!==void 0&&de.commits.some(xe=>xe.hash===ge)?ge:de.commits[0]?.hash)}).catch(W=>{O.current===R&&v(ue(W))}).finally(()=>{O.current===R&&P(!1)})},Rr);return()=>{clearTimeout(J)}},[F,s,c,u.kind,Ie]);let Mn=(0,b.useCallback)(()=>{if(s===void 0||c===void 0||!G||$)return;let l=s,d=Y.current,R=O.current;_(!0),v(void 0),Promise.resolve().then(()=>c.query(dt(s,d,N.length))).then(J=>{if(h.current!==l||O.current!==R)return;let W=ce(J);if(!W.ok){v(W.message);return}let U=W.result;if(!U.ok){v(U.error.message===""?U.error.code:U.error.message);return}let Z=U.page;C(de=>{let Qe=new Set(de.map(xe=>xe.hash)),ge=Z.commits.filter(xe=>!Qe.has(xe.hash)).map(xe=>({...xe,refs:Ie.get(xe.hash)??[]}));return ge.length===0?de:[...de,...ge]}),f(Z.hasMore)}).catch(J=>v(ue(J))).finally(()=>_(!1))},[s,c,G,$,N.length,Ie]),Ln=(0,b.useMemo)(()=>{let l=t.views??{open:(d,R)=>t.openView?.(d,R)??!1};return $e({views:l,sessionId:s??""})},[t,s]),Nn=(l,d=1)=>{s!==void 0&&Ln(l,d)},Pn=(0,b.useMemo)(()=>{let l={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(d,R)=>t.openViewOrSwitch?.(d,R)??{opened:!1,focused:!1}}};return zt({seam:l,sessionId:s??""})},[t,s]),Dn=(l,d=1)=>{s!==void 0&&p!==void 0&&Pn(p,l,d)},Re=(0,b.useCallback)(()=>S(l=>l+1),[]),Gr=()=>S(l=>l+1);(0,b.useEffect)(()=>Er(y,Re),[y,Re]);let le=Q?.head,Hn=ft.reduce((l,d)=>l+d.files.length,0);return(0,w.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":u.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,w.jsxs)("header",{className:"gx-head",children:[(0,w.jsxs)("div",{className:"gx-head-main",children:[(0,w.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,w.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,w.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,w.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,w.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,w.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,w.jsx)("span",{className:"gx-repo",title:Q?.root??r("view.title"),children:Q===void 0?r("view.title"):Nr(Q.root)}),le?.branch===null||le?.branch===void 0?null:(0,w.jsx)("span",{className:"gx-branch",children:le.branch}),le?.detached===!0?(0,w.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,le?.ahead!==void 0&&le.ahead>0?(0,w.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(le.ahead)}`}):null,le?.behind!==void 0&&le.behind>0?(0,w.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(le.behind)}`}):null]}),(0,w.jsxs)("div",{className:"gx-head-meta",style:Tr,children:[Q===void 0?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsxs)("span",{children:[r("head.changes")," ",(0,w.jsx)("b",{children:Hn})]}),(0,w.jsxs)("span",{children:[r("head.commits")," ",(0,w.jsx)("b",{children:Q.counts.commits})]}),(0,w.jsxs)("span",{children:[r("head.branches")," ",(0,w.jsx)("b",{children:Q.counts.branches})]})]}),(0,w.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:u.kind==="loading",onClick:Re,children:"\u21BB"})]})]}),s===void 0?(0,w.jsx)(qe,{title:r("state.noSession.title"),description:r("state.noSession.description")}):u.kind==="no-service"?(0,w.jsx)(qe,{title:r("state.noService.title"),description:r("state.noService.description")}):u.kind==="loading"?(0,w.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):u.kind==="failed"?(0,w.jsx)(qe,{title:r("state.failed.title"),description:u.message,actionLabel:r("action.retry"),onAction:Re}):u.kind==="ready"&&!u.snapshot.isRepository?(0,w.jsx)(qe,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Re}):u.kind==="ready"?(0,w.jsxs)("div",{className:"gx-body",style:X===null?void 0:{"--gx-left-col":`${X}px`},children:[(0,w.jsx)(Jt,{groups:ft,stats:Tn,t:r,onOpen:Nn,claimFocus:E,onFocusClaimed:ne}),(0,w.jsx)("div",{ref:ye,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":X??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ue,onPointerMove:Ye,onPointerUp:Ee,onPointerCancel:Ee,onLostPointerCapture:Ee,onKeyDown:He,onDoubleClick:Ce}),(0,w.jsxs)("div",{className:"gx-col",style:se===null?void 0:{"--gx-detail-h":`${String(se)}%`},children:[(0,w.jsx)(nn,{commits:N,graph:En,selectedHash:p,headHash:u.snapshot.head?.hash??null,total:u.snapshot.counts.commits,hasMore:G,loadingMore:$,loadError:m,searching:oe,search:F,t:r,onSelect:k,onLoadMore:Mn,onSearch:ee,...u.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Re,retryLabel:r("action.retry")}:{}}),(0,w.jsx)("div",{ref:ke,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":se??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:Te,onPointerMove:Rn,onPointerUp:Xe,onPointerCancel:Xe,onLostPointerCapture:Xe,onKeyDown:Sn,onDoubleClick:Je}),(0,w.jsx)(Zt,{sessionId:s,hash:p,remote:c,t:r,onSelect:k,onOpenFile:Dn})]})]}):null]})}return a}var bn=["slots","locale","workbench","remote"];function xn(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function yn(e){return()=>{try{let n=e.remote?.gitExplorer;if(xn(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(xn(n))return n}catch{}let t=vn(e);return t===void 0?void 0:Rt(t)}}function vn(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${yt}/${r}`,o,a)}var je;function wn(e){let t=e.locale.bind(Le);je?.();let n=e.locale.register(Le,{zh:mt,en:xt});je=n;let r=Yt(typeof document>"u"?void 0:document),o=yn(e),a=Gt({store:St(o),t});e.slots.inject(tt,()=>e.slots.register({name:tt,id:bt,order:30,locale:Le},a));let i=e.workbench;if(i!=null){let s=mn({workbench:i,version:i.version,t,remote:o});e.slots.inject(et,()=>e.slots.register({name:et,id:Me,order:110,label:()=>t("tab.label"),locale:Le},s))}return()=>{r(),n(),je===n&&(je=void 0)}}var kn={groupChanges:ze,formatCommitDetail:Oe,createJump:$e,computeWindow:We},Cn={name:"dsh-git-explorer",inject:bn,apply:wn,__test:kn},Hr=Cn;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
