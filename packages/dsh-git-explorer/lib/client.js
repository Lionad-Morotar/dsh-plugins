window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var $e=Object.defineProperty;var Yt=Object.getOwnPropertyDescriptor;var Qt=Object.getOwnPropertyNames;var Zt=Object.prototype.hasOwnProperty;var en=(e,t)=>{for(var n in t)$e(e,n,{get:t[n],enumerable:!0})},tn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Qt(t))!Zt.call(e,o)&&o!==n&&$e(e,o,{get:()=>t[o],enumerable:!(r=Yt(t,o))||r.enumerable});return e};var nn=e=>tn($e({},"__esModule",{value:!0}),e);var qn={};en(qn,{__test:()=>Jt,apply:()=>Ut,boot:()=>ct,clientPlugin:()=>Xt,createRemoteResolver:()=>jt,createRpcCall:()=>Kt,default:()=>Vn,inject:()=>qt});module.exports=nn(qn);var Qe={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Ze={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var ze="conversation.view",pe="git-explorer";var Oe="conversation.session.header.actions",et="git-branch";var he="git-explorer",tt="gitExplorer";var k=require("react");var nt=Object.freeze([]);function rt(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:nt}));let r=[];return e.forEach((o,a)=>{let i=rn(o.name,n);i!==void 0&&r.push({match:{branch:o,ranges:on(i)},order:a,run:an(i)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function We(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&_e(n.branch))return t}return-1}function ot(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return We(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&_e(o.branch))return r}return t}function at(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!_e(n.branch)))return n.branch}function _e(e){return e.worktreePath===void 0}function rn(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),i=-1;for(let s=r;s<e.length;s+=1)if(e.charAt(s).toLowerCase()===a){i=s;break}if(i===-1)return;n.push(i),r=i+1}return n}function on(e){let t=e[0];if(t===void 0)return nt;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let i=e[a];if(i!==void 0){if(i===o){o=i+1;continue}n.push([r,o]),r=i,o=i+1}}return n.push([r,o]),n}function an(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function it(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function X(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Y(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var we="service-unavailable",sn=Object.freeze({status:"idle",revision:0,sessionId:null}),Ve;function ln(e){let t=sn,n=-1,r=0,o=new Set,a=l=>{t=l;for(let m of[...o])m()},i=l=>t.sessionId===l&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(l){return o.add(l),()=>{o.delete(l)}},getSnapshot:()=>t,load:async l=>{if(i(l))return;let m=e(),g=++r,h=t.revision,A=t.sessionId===l;a({status:"loading",...A&&t.list!==void 0?{list:t.list}:{},revision:h,sessionId:l});let S=()=>g!==r||t.revision!==h;if(typeof m?.branches!="function"){if(S())return;a({status:"error",error:we,revision:h,sessionId:l});return}try{let R=await m.branches({sessionId:l});if(S())return;let E=X(R);if(!E.ok){a({status:"error",error:E.message,revision:h,sessionId:l});return}if(E.result.ok===!1){a({status:"error",error:E.result.error.message,revision:h,sessionId:l});return}n=h,a({status:"ready",list:E.result.list,revision:h,sessionId:l})}catch(R){if(S())return;a({status:"error",error:Y(R),revision:h,sessionId:l})}},switchTo:async(l,m)=>{let g=()=>t.sessionId!==l,h=e();if(typeof h?.switchBranch!="function")return g()||a({...t,error:we}),{switched:!1};try{let A=await h.switchBranch({sessionId:l,name:m}),S=X(A),R=S.ok?S.result.ok===!1?S.result.error.message:void 0:S.message;if(R!==void 0)return g()||a({...t,error:R}),{switched:!1};if(g())return{switched:!0};let E=S.ok&&S.result.ok===!0?S.result:void 0,D=E===void 0?m:E.branch,f=t.list;return a({status:f===void 0?t.status:"ready",...f===void 0?{}:{list:{...f,detached:!1,headHash:null,branches:f.branches.map($=>({...$,current:$.name===D}))}},revision:t.revision+1,sessionId:l}),E===void 0||E.stash===void 0?{switched:!0}:{switched:!0,stash:E.stash}}catch(A){return g()||a({...t,error:Y(A)}),{switched:!1}}},bump(){a({...t,revision:t.revision+1})}}}function dn(e){return Ve=ln(e),Ve}var st=dn;function lt(){return Ve}var Q=require("react"),cn=Object.freeze({}),ke=null,qe;function ct(e){ke=e}function ut(){if(qe!=null)return qe;if(ke===null)return cn;let e=dt(ke,"@deepseek-ai/dsh-client-ui-primitives"),t=dt(ke,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,i=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof i=="function"?{createPortal:i}:{}}}function dt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var pt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},ht=e=>(0,Q.createElement)("svg",{...pt,className:e.className},(0,Q.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,Q.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,Q.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,Q.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,Q.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),gt=e=>(0,Q.createElement)("svg",{...pt,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,Q.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var C=require("react/jsx-runtime"),ft=320,un="min(420px, 100vw - 32px)",mt=5,Se=8;function pn(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:mt,margin:Se})??void 0:hn(t,n)}function hn(e,t){let[n,r]=(0,k.useState)(void 0);return(0,k.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let i=a.getBoundingClientRect(),s=Math.min(ft,Math.max(160,window.innerWidth-Se*2)),c=Math.min(Math.max(i.right-s,Se),window.innerWidth-s-Se);r({left:c,top:i.bottom+mt,width:s})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function gn(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}fn(t,n,o,a)}function fn(e,t,n,r){(0,k.useEffect)(()=>{if(!n)return;let o=a=>{let i=a.target;i instanceof Node&&e.current?.contains(i)!==!0&&t.current?.contains(i)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function mn(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[i,s]=o;i>r&&n.push((0,C.jsx)("span",{children:e.slice(r,i)},`plain-${a}`)),n.push((0,C.jsx)("span",{className:"gx-branch-match",children:e.slice(i,s)},`hit-${a}`)),r=s}),r<e.length&&n.push((0,C.jsx)("span",{children:e.slice(r)},"tail")),n}function xn(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function bn(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let a=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${a}`)}if(e.untrackedFiles>0){let a=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${a}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function xt({store:e,t}){function n({sessionId:r}){let o=(0,k.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,i]=(0,k.useState)(!1),[s,c]=(0,k.useState)(""),[l,m]=(0,k.useState)(-1),[g,h]=(0,k.useState)(null),[A,S]=(0,k.useState)(null),R=(0,k.useRef)(r);R.current=r;let E=(0,k.useRef)(null),D=(0,k.useRef)(null),f=(0,k.useRef)(null),$=(0,k.useRef)(null),H=(0,k.useRef)(null),x=(0,k.useRef)(!1),b=(0,k.useId)(),P=(0,k.useId)(),L=ut(),z=L.createPortal!==void 0,te=L.IconBranch??ht,J=L.IconChevron??gt,M=o.list,O=M===void 0?void 0:xn(M.root),B=(0,k.useMemo)(()=>rt(M?.branches??[],s),[M,s]),_=(0,k.useCallback)(()=>{i(!1),c(""),S(null)},[]),Z=(0,k.useCallback)(()=>{x.current=!0,_(),D.current?.focus({preventScroll:!0})},[_]),ee=(0,k.useCallback)(()=>{x.current=!0,_()},[_]);(0,k.useEffect)(()=>{_(),h(null),r!==void 0&&e.load(r)},[e,r,_]),(0,k.useLayoutEffect)(()=>{a&&$.current?.focus({preventScroll:!0})},[a]),(0,k.useLayoutEffect)(()=>{if(a||!x.current)return;x.current=!1;let w=document.activeElement;(w===null||w===document.body||w===D.current||E.current?.contains(w)===!0)&&D.current?.focus({preventScroll:!0})},[a]),(0,k.useEffect)(()=>{m(We(B))},[B]),(0,k.useEffect)(()=>{H.current?.scrollIntoView?.({block:"nearest"})},[l,B]),(0,k.useEffect)(()=>{if(!a)return;let w=q=>{q.key!=="Escape"||q.isComposing||(q.preventDefault(),Z())};return document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[a,Z]);let oe=pn(L,a,D,f);gn(L,E,f,z,a,ee);let Fe=()=>{if(a){_();return}i(!0),r!==void 0&&e.load(r)},De=()=>{r!==void 0&&e.load(r)},me=async w=>{if(g!==null||w.worktreePath!==void 0)return;if(w.current){Z();return}if(r===void 0)return;h(w.name);let q=await e.switchTo(r,w.name);if(R.current===r&&(h(null),!!q.switched)){if(e.load(r),q.stash?.conflict===!0){S(q.stash);return}Z()}},le=()=>{let w=at(B,l);w!==void 0&&me(w)},de=w=>{if(!(w.metaKey||w.ctrlKey||w.altKey)&&!w.nativeEvent.isComposing){if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let q=w.key==="ArrowDown"?1:-1;m(G=>ot(B,G,q));return}w.key==="Enter"&&(w.preventDefault(),le())}};if(r===void 0)return null;let Ie=M?.branches.find(w=>w.current)?.name,xe=M===void 0?t("branch.loading"):M.detached?M.headHash??t("head.detached"):Ie??t("branch.unborn");if(!a&&M?.isRepository!==!0)return null;let W=`${t("head.detached")} ${M?.headHash??""}`.trim(),ne=M?.detached===!0?W:xe,ae=M?.isRepository===!0?M.worktree:void 0,V=ae===void 0?void 0:bn(ae,t),He=t("branch.worktreeSep"),Be=V===void 0?ne:V.description,Ae=V===void 0||ae?.dirty!==!0?`${t("branch.title")}: ${ne}`:`${t("branch.title")}: ${ne}${He}${V.description}`,be=o.error===we?t("state.noService.title"):o.error,ve=(0,C.jsxs)("div",{ref:f,id:P,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:ft,maxWidth:un,...oe},children:[A?.conflict===!0?(0,C.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,C.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),A.message===void 0||A.message===""?null:(0,C.jsx)("span",{className:"gx-branch-warning-detail",children:A.message})]}):null,M===void 0||O===void 0?null:(0,C.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:M.root,children:[(0,C.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,C.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,C.jsx)("span",{className:"gx-branch-scope-parent",children:O.parent}),(0,C.jsx)("span",{className:"gx-branch-scope-name",children:O.name})]})]}),(0,C.jsx)("input",{ref:$,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:s,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":M===void 0?void 0:b,"aria-activedescendant":l>=0&&M!==void 0?`${b}-option-${l}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:w=>c(w.target.value),onKeyDown:de}),be!==void 0?(0,C.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,C.jsx)("span",{className:"gx-branch-error-text",children:be}),(0,C.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:De,children:t("action.retry")})]}):null,o.status==="loading"&&M===void 0?(0,C.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,M!==void 0?(0,C.jsxs)("div",{className:"gx-branch-list",id:b,role:"listbox","aria-label":t("branch.title"),children:[M.branches.length===0?(0,C.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,M.branches.length>0&&B.length===0?(0,C.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,B.map((w,q)=>{let G=w.branch,ce=q===l;return(0,C.jsxs)("button",{ref:ce?H:void 0,type:"button",role:"option",id:`${b}-option-${q}`,"aria-selected":ce,"data-active":ce?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${G.name}`,"data-current":G.current?"true":void 0,"aria-current":G.current?"true":void 0,title:G.worktreePath===void 0?G.name:`${G.name} ${t("branch.worktree")}: ${G.worktreePath}`,disabled:g!==null||G.worktreePath!==void 0,onClick:()=>{me(G)},children:[(0,C.jsx)("span",{className:"gx-branch-row-name",children:mn(G.name,w.ranges)}),G.current?(0,C.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},G.name)})]}):null]});return(0,C.jsxs)("div",{className:"gx-branch-action",ref:E,children:[(0,C.jsxs)("button",{ref:D,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Ae,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?P:void 0,title:Be,onClick:Fe,children:[(0,C.jsx)(te,{className:"gx-branch-icon"}),(0,C.jsx)("span",{className:"gx-branch-name",title:ne,children:xe}),V===void 0||ae?.dirty!==!0?null:(0,C.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:V.dot?t("branch.worktreeDirty"):void 0,children:[V.additions>0?(0,C.jsxs)("span",{className:"gx-branch-add",children:["+",V.additions]}):null,V.deletions>0?(0,C.jsxs)("span",{className:"gx-branch-del",children:["\u2212",V.deletions]}):null,V.dot?(0,C.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,C.jsx)(J,{className:"gx-branch-chevron"})]}),a?L.createPortal===void 0?ve:L.createPortal(ve,document.body):null]})}return n}var vn={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function ge(e){return vn[e]}var bt={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function yn(e,t){return(bt[e]??0)>=(bt[t]??0)?e:t}function vt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function je(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function wn(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:yn(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let i=a[0];if(i==="1"){let s=a.slice(2),c=s.slice(0,2),l=je(s,7);l!==""&&r({path:l,status:vt(c),staged:c[0]!==".",isDirectory:!1})}else if(i==="2"){let s=a.slice(2),c=s.slice(0,2),l=je(s,8),m=t[o+1]??"";l!==""&&m!==""&&(o+=1,r({path:l,status:vt(c),staged:c[0]!==".",isDirectory:!1,origPath:m}))}else if(i==="u"){let s=a.slice(2),c=je(s,9);c!==""&&r({path:c,status:"conflicted",staged:!1,isDirectory:!1})}else if(i==="?"){let s=a.slice(2);if(s==="")continue;let c=s.endsWith("/");r({path:c?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:c})}}return[...n.values()]}function kn(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function Ke(e){let t=new Map;for(let n of e){let r=kn(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function Ce(e){return Ke(wn(e))}function Ue(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let i=Math.floor(a/7);if(i<5)return`${i}w`;let s=Math.floor(a/30);return s<12?`${s}mo`:`${Math.floor(a/365)}y`}function Re(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:Ue(e.time,t)}}function Ee({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function yt({seam:e,sessionId:t}){return(n,r,o=1)=>{let a=typeof n=="string"?n.trim().toLowerCase():"";if(a===""||typeof r!="string")return;let i=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(i==="")return;let s=Number.isFinite(o)&&o>0?Math.floor(o):1,c=`git:${a}:${String(s)}:${i}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",c);let l=e.openViewOrSwitch("fs-explorer",c);if(l.focused){e.viewFocus?.take?.("fs-explorer");return}if(l.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",c)!==!0&&e.openView?.("fs-explorer",c)!==!0&&e.viewFocus?.request?.("fs-explorer",c)}}var Sn=/^commit:([0-9a-f]{4,64})$/iu;function wt(e){if(e===void 0)return;let t=Sn.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function Le(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),i=Math.max(0,e.length-a-o*2),s=Math.floor(Math.max(0,t.scrollTop)/n)-o,c=Math.min(Math.max(s,0),i),l=Math.min(e.length,c+a+o*2);return{rows:e.slice(c,l),startIndex:c,endIndex:l}}function kt(e){let t=[],n=[],r=[],o=0,a=[],i=()=>r.length===0?o++:(r.sort((m,g)=>m-g),r.shift()??o++),s=l=>{l!==null&&!r.includes(l)&&r.push(l)},c=()=>{let l=t.indexOf(null);return l>=0?l:(t.push(null),n.push(null),t.length-1)};for(let l of e){let m=[...t],g=[...n],h=m.indexOf(l.hash),A=h>=0;A||(h=c());let S=A?n[h]??null:null;S===null&&(S=i(),n[h]=S);for(let f=0;f<m.length;f+=1)f!==h&&m[f]===l.hash&&(s(n[f]??null),t[f]=null,n[f]=null);let R=l.parents[0];R===void 0?(s(n[h]??null),t[h]=null,n[h]=null):(t[h]=R,n[h]=S);let E=[];for(let f=1;f<l.parents.length;f+=1){let $=l.parents[f];if($===void 0)continue;let H=t.indexOf($);H<0&&(H=c(),t[H]=$),n[H]===null&&(n[H]=i()),E.push(H)}let D=[];for(let f=0;f<m.length;f+=1){let $=m[f];if($===null)continue;let H=g[f]??S;$===l.hash?D.push({kind:"into",from:f,to:h,color:H}):D.push({kind:"pass",from:f,to:f,color:H})}R!==void 0&&D.push({kind:"out",from:h,to:h,color:n[h]??S});for(let f of E)D.push({kind:"out",from:h,to:f,color:n[f]??S});for(a.push({lane:h,color:S,merge:l.parents.length>=2,segments:D});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function St(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function re(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Ct(e,t){return`${e.trim().toLowerCase()}\0${t}`}function Rt(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let a=n.keys().next();a.done||n.delete(a.value)}},get size(){return n.size}}}function Et(e,t,n,r=10,o=8){let a=Math.max(o,n.width-t.width-o),i=e.right+r;i>a&&(i=e.left-t.width-r,i<o&&(i=Math.min(a,Math.max(o,e.left))));let s=Math.max(o,n.height-t.height-o),c=e.bottom+r,l=e.top-t.height-r,m;return c<=s?m=Math.max(o,c):l>=o?m=l:m=Math.min(s,Math.max(o,e.top)),{left:i,top:m}}var Lt="dsh-git-explorer-styles",Cn=`
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
  background: var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-1, transparent));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px color-mix(in srgb, var(--dsw-alias-label-primary, currentColor) 16%, transparent));
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
.gx-branch-search:focus-visible { border-bottom-color: var(--dsw-alias-brand-primary, currentColor); }
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
`;function Nt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Lt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Lt,n.textContent=Cn,e.head.appendChild(n),()=>{n.remove()}}var v=require("react");var Ne=require("react");var F=require("react/jsx-runtime");function Rn(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function En({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,F.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,F.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Pt({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let i=e.reduce((c,l)=>c+l.files.length,0),s=(0,Ne.useRef)(null);return(0,Ne.useEffect)(()=>{o&&(a(),Rn(s.current))},[o,a]),(0,F.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,F.jsxs)("header",{className:"gx-pane-head",children:[(0,F.jsx)("span",{children:n("changes.title")}),(0,F.jsx)("span",{className:"gx-count",children:i})]}),(0,F.jsx)("div",{className:"gx-scroll",children:i===0?(0,F.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,F.jsx)("strong",{children:n("changes.empty")})}):e.map(c=>(0,F.jsxs)("div",{children:[(0,F.jsxs)("div",{className:"gx-group-head",children:[(0,F.jsx)("span",{className:"gx-group-dir",children:c.dir===""?n("changes.root"):c.dir}),(0,F.jsx)("span",{className:"gx-count",children:c.files.length})]}),c.files.map(l=>{let m=t.get(l.path),g=n(`status.${l.status}`);return(0,F.jsxs)("button",{type:"button",className:"gx-file","data-status":l.status,"data-directory":l.isDirectory?"true":"false","data-renamed":l.origPath===void 0?"false":"true","data-testid":"git-change-file",title:l.isDirectory?`${g} \xB7 ${n("changes.directory")}`:`${g} \xB7 ${n("changes.jump")}`,onClick:()=>{l.isDirectory||r(l.path,1)},children:[(0,F.jsx)("span",{className:"gx-badge","data-status":l.status,children:ge(l.status)}),(0,F.jsxs)("span",{className:"gx-file-name",children:[re(l.path),l.origPath===void 0?null:(0,F.jsx)("span",{className:"gx-file-orig",children:re(l.origPath)})]}),(0,F.jsx)("span",{className:"gx-file-stats",children:(0,F.jsx)(En,{stat:m})})]},l.path)})]},c.dir===""?".":c.dir))})]})}var T=require("react"),Mt=require("react-dom");var u=require("react/jsx-runtime"),Ln=200,Nn=40,Pn=24,Mn=7;function Tn({additions:e,deletions:t}){return e===null&&t===null?(0,u.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,u.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Gn(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Fn({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,u.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,u.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,u.jsx)("strong",{children:t("preview.unavailable")}),(0,u.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,u.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,u.jsx)("strong",{children:t("preview.unavailable")}),(0,u.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,u.jsxs)(u.Fragment,{children:[r.text===""?(0,u.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,u.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,u.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,u.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function Dn({preview:e,hash:t,t:n}){let r=(0,T.useRef)(null),o=(0,T.useRef)(null),[a,i]=(0,T.useState)(null),[s,c]=(0,T.useState)(!1);return(0,T.useLayoutEffect)(()=>{let l=r.current;if(l===null)return;let m=l.getBoundingClientRect();i(Et(e.anchor,{width:m.width,height:m.height},{width:window.innerWidth,height:window.innerHeight}));let g=o.current;c(g!==null&&g.scrollHeight>g.clientHeight+1)},[e]),typeof document>"u"?null:(0,Mt.createPortal)((0,u.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":s?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:a?.left??0,top:a?.top??0,visibility:a===null?"hidden":"visible"},children:[(0,u.jsxs)("div",{className:"gx-preview-head",children:[(0,u.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:ge(e.file.status)}),(0,u.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:re(e.file.path)}),(0,u.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Mn)} \xB7 ${n("preview.revision")}`})]}),(0,u.jsx)("div",{className:"gx-preview-body",children:(0,u.jsx)(Fn,{preview:e,t:n,textRef:o})})]}),document.body)}function Tt({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:a}){let[i,s]=(0,T.useState)({kind:"idle"}),[c,l]=(0,T.useState)(0),m=(0,T.useRef)(new Map),[g,h]=(0,T.useState)({kind:"idle"}),A=(0,T.useRef)(Rt(Pn)),S=(0,T.useRef)(void 0),R=(0,T.useRef)(void 0),E=(0,T.useRef)(void 0),D=(0,T.useRef)(null),f=(0,T.useCallback)(()=>{S.current=void 0,R.current!==void 0&&(window.clearTimeout(R.current),R.current=void 0),E.current?.abort(),E.current=void 0,h(x=>x.kind==="idle"?x:{kind:"idle"})},[]),$=(0,T.useCallback)((x,b)=>{if(f(),t===void 0)return;let P=b.getBoundingClientRect(),L={left:P.left,top:P.top,right:P.right,bottom:P.bottom},z=Ct(t,x.path);S.current=z,R.current=window.setTimeout(()=>{if(R.current=void 0,S.current!==z)return;let te=A.current.get(z);if(te!==void 0){h({kind:"ready",file:x,anchor:L,page:te});return}if(e===void 0||n===void 0||typeof n.show!="function"){h({kind:"unavailable",file:x,anchor:L,message:r("preview.noService")});return}let J=new AbortController;E.current=J,h({kind:"loading",file:x,anchor:L}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:x.path,offset:1,limit:Nn},J.signal)).then(M=>{if(J.signal.aborted||S.current!==z)return;let O=X(M);if(!O.ok){h({kind:"unavailable",file:x,anchor:L,message:O.message});return}let B=O.result;if(!B.ok){h({kind:"unavailable",file:x,anchor:L,message:Gn(B.error.code,B.error.message,r)});return}A.current.set(z,B.page),h({kind:"ready",file:x,anchor:L,page:B.page})}).catch(M=>{J.signal.aborted||S.current!==z||h({kind:"unavailable",file:x,anchor:L,message:Y(M)})}).finally(()=>{E.current===J&&(E.current=void 0)})},Ln)},[f,t,n,e,r]);(0,T.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let x=m.current.get(t);if(x!==void 0){s({kind:"ready",detail:x});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let b=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(P=>{if(!b)return;let L=X(P);if(!L.ok){s({kind:"failed",message:L.message});return}let z=L.result;z.ok?(m.current.set(t,z.detail),s({kind:"ready",detail:z.detail})):s({kind:"failed",message:z.error.message===""?z.error.code:z.error.message})}).catch(P=>{b&&s({kind:"failed",message:Y(P)})}),()=>{b=!1}},[t,n,e,c,r]),(0,T.useEffect)(()=>{if(g.kind==="idle")return;let x=b=>{b.key==="Escape"&&f()};return document.addEventListener("keydown",x),()=>document.removeEventListener("keydown",x)},[g.kind,f]),(0,T.useEffect)(()=>{let x=D.current;if(x===null)return;let b=()=>f();return x.addEventListener("scroll",b,{passive:!0}),()=>x.removeEventListener("scroll",b)},[f]),(0,T.useEffect)(()=>{f()},[t,c,e,n,f]),(0,T.useEffect)(()=>()=>{S.current=void 0,R.current!==void 0&&window.clearTimeout(R.current),E.current?.abort()},[]);let H=Re(i.kind==="ready"?i.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,u.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,u.jsxs)("header",{className:"gx-detail-head",children:[(0,u.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,u.jsx)("span",{className:"gx-hash",children:H.shortHash}),(0,u.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,u.jsx)("div",{className:"gx-detail-body",ref:D,children:i.kind==="idle"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):i.kind==="loading"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):i.kind==="failed"?(0,u.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,u.jsx)("strong",{children:r("detail.failed")}),(0,u.jsx)("span",{children:i.message}),(0,u.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>l(x=>x+1),children:r("action.retry")})]}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"gx-detail-subject",children:i.detail.subject}),(0,u.jsxs)("div",{className:"gx-detail-meta",children:[(0,u.jsx)("span",{className:"gx-author",children:i.detail.author}),(0,u.jsx)("span",{children:H.relative}),(0,u.jsx)("span",{title:new Date(i.detail.time*1e3).toLocaleString(),children:new Date(i.detail.time*1e3).toLocaleDateString()})]}),(0,u.jsxs)("div",{className:"gx-parents",children:[(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),i.detail.parents.length===0?(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):i.detail.parents.map(x=>(0,u.jsx)("button",{type:"button",className:"gx-parent",title:x,onClick:()=>o(x),children:x.slice(0,7)},x))]}),i.detail.body===""?null:(0,u.jsx)("pre",{className:"gx-body-text",children:i.detail.body}),(0,u.jsxs)("div",{className:"gx-detail-files",children:[(0,u.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(i.detail.files.length)}`}),i.detail.files.length===0?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Ke(i.detail.files).map(x=>(0,u.jsxs)("div",{className:"gx-detail-group",children:[(0,u.jsx)("div",{className:"gx-detail-dir",children:x.dir===""?r("changes.root"):x.dir}),x.files.map(b=>(0,u.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:b.path,onClick:()=>a?.(b.path),onMouseEnter:P=>$(b,P.currentTarget),onMouseLeave:f,children:[(0,u.jsx)("span",{className:"gx-badge","data-status":b.status,children:ge(b.status)}),(0,u.jsxs)("span",{className:"gx-file-name",children:[re(b.path),b.origPath===void 0?null:(0,u.jsx)("span",{className:"gx-file-orig",children:re(b.origPath)})]}),(0,u.jsx)("span",{className:"gx-file-stats",children:(0,u.jsx)(Tn,{additions:b.additions,deletions:b.deletions})})]},b.path))]},x.dir===""?".":x.dir))]})]})}),g.kind==="idle"?null:(0,u.jsx)(Dn,{preview:g,hash:t??"",t:r})]})}var U=require("react");var fe=require("react/jsx-runtime");function Gt(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Ft({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=c=>c*o+o/2,i=n/2,s=e.segments.map((c,l)=>{let m=a(c.from),g=a(c.to),h=c.kind==="pass"?`M ${String(m)} 0 L ${String(g)} ${String(n)}`:c.kind==="into"?`M ${String(m)} 0 C ${String(m)} ${String(n*.55)}, ${String(g)} ${String(n*.45)}, ${String(g)} ${String(i)}`:`M ${String(m)} ${String(i)} C ${String(m)} ${String(n*.55)}, ${String(g)} ${String(n*.45)}, ${String(g)} ${String(n)}`;return(0,fe.jsx)("path",{d:h,fill:"none",stroke:Gt(c.color),strokeWidth:1.4,strokeLinecap:"round"},`${c.kind}-${String(c.from)}-${String(c.to)}-${String(l)}`)});return(0,fe.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,fe.jsx)("circle",{cx:a(e.lane),cy:i,r:e.merge?4:3.2,fill:Gt(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var N=require("react/jsx-runtime"),Pe=24,Dt=100;function In({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,onSelect:i}){return(0,N.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>i(e.hash),children:[t===void 0?(0,N.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,N.jsx)(Ft,{row:t,laneCount:n,height:Pe}),(0,N.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,N.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(s=>(0,N.jsxs)("span",{className:"gx-ref","data-kind":s.kind,children:[(0,N.jsx)("span",{className:"gx-ref-name",children:s.name}),(0,N.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:s.name})]},`${s.kind}:${s.name}`)),(0,N.jsx)("span",{className:"gx-author",children:e.author}),(0,N.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:Ue(e.time)})]})}function It(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:i,loadingMore:s,loadError:c,t:l,onSelect:m,onLoadMore:g}=e,h=(0,U.useRef)(null),[A,S]=(0,U.useState)(0),[R,E]=(0,U.useState)(0),D=(0,U.useRef)(!1);(0,U.useEffect)(()=>{let b=h.current;if(b===null)return;let P=()=>E(b.clientHeight);if(P(),typeof ResizeObserver>"u")return;let L=new ResizeObserver(P);return L.observe(b),()=>L.disconnect()},[]),(0,U.useEffect)(()=>{s||(D.current=!1)},[s]);let f=(0,U.useCallback)(()=>{!i||s||D.current||(D.current=!0,g())},[i,s,g]),$=b=>{let P=b.currentTarget;S(P.scrollTop),P.scrollTop+P.clientHeight>=P.scrollHeight-160&&f()},H=Le(t,{scrollTop:A,height:R===0?480:R,rowHeight:Pe}),x=Math.max(1,St(n));return(0,N.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,N.jsxs)("header",{className:"gx-pane-head",children:[(0,N.jsx)("span",{children:l("history.title")}),(0,N.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`})]}),t.length===0?(0,N.jsxs)("div",{className:"gx-empty",children:[(0,N.jsx)("strong",{children:e.emptyTitle??l("history.empty")}),e.emptyDescription===void 0?null:(0,N.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,N.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??l("action.retry")})]}):(0,N.jsx)("div",{className:"gx-scroll",ref:h,onScroll:$,"data-testid":"git-history-scroll",children:(0,N.jsx)("div",{className:"gx-vlist",style:{height:t.length*Pe},children:H.rows.map((b,P)=>{let L=H.startIndex+P;return(0,N.jsx)(In,{commit:b,row:n[L],laneCount:x,top:L*Pe,selected:b.hash===r,head:b.hash===o,onSelect:m},b.hash)})})}),(0,N.jsxs)("footer",{className:"gx-loadbar",children:[(0,N.jsx)("span",{children:`${l("history.loaded")} ${String(t.length)}`}),c===void 0?null:(0,N.jsx)("span",{className:"gx-del",children:c}),(0,N.jsx)("span",{className:"gx-spacer"}),i?(0,N.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:f,children:l(s?"history.loading":"history.loadMore")}):(0,N.jsx)("span",{children:t.length===0?"":l("history.noMore")})]})]})}var Je="git-explorer.leftColumnWidth";function Xe(e){return Math.min(560,Math.max(240,e))}function Bt(e){if(e==null)return null;let t;try{t=e.getItem(Je)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function Me(e,t){let n=Math.round(Xe(t));if(e!=null)try{e.setItem(Je,String(n))}catch{}return n}function At(e){if(e!=null)try{e.removeItem(Je)}catch{}}function $t(e,t){return Math.round(e)===Math.round(t)}var Ht=16;function zt(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ht};case"ArrowRight":return{kind:"nudge",delta:Ht};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var y=require("react/jsx-runtime");function Hn(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Wt(e,t){let n=wt(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function Bn(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var An={display:"flex",alignItems:"center",gap:8};function $n(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var zn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function Te({title:e,description:t,actionLabel:n,onAction:r}){return(0,y.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,y.jsx)("strong",{children:e}),t===void 0?null:(0,y.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,y.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function On(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function _t(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(i){let s=i.sessionId??t.currentSessionId(),c=(0,v.useRef)(s);c.current=s;let l=(0,v.useMemo)(()=>o(),[o]),[m]=(0,v.useState)(lt),[g,h]=(0,v.useState)(()=>({kind:Hn(s,l!==void 0)})),[A,S]=(0,v.useState)(0),[R,E]=(0,v.useState)([]),[D,f]=(0,v.useState)(!1),[$,H]=(0,v.useState)(!1),[x,b]=(0,v.useState)(void 0),[P,L]=(0,v.useState)(void 0),z=(0,v.useRef)(void 0),te=(0,v.useRef)(void 0),[J,M]=(0,v.useState)(!0),O=(0,v.useMemo)(()=>$n(),[]),[B,_]=(0,v.useState)(()=>Bt(O)),Z=(0,v.useRef)(null),ee=(0,v.useRef)(null),oe=(0,v.useCallback)(d=>{z.current=d,L(d),M(!1)},[]),Fe=(0,v.useCallback)(()=>{M(!1)},[]),De=(0,v.useCallback)(d=>{if(d.button!==0||ee.current!==null||zn())return;let p=Z.current?.previousElementSibling;if(p instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}ee.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:B},document.body.classList.add("gx-pane-resizing")}},[B]),me=(0,v.useCallback)(d=>{let p=ee.current;p===null||p.pointerId!==d.pointerId||_(Xe(p.baseWidth+d.clientX-p.startX))},[]),le=(0,v.useCallback)(d=>{let p=ee.current;if(p===null||p.pointerId!==d.pointerId)return;ee.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let I=p.baseWidth+d.clientX-p.startX;if($t(I,p.baseWidth)){_(p.restWidth);return}_(Me(O,I))},[O]),de=(0,v.useCallback)(()=>{At(O),_(null)},[O]),Ie=(0,v.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let p=zt(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(p===null)return;if(d.preventDefault(),d.stopPropagation(),p.kind==="reset"){de();return}if(p.kind==="min"||p.kind==="max"){let K=p.kind==="min"?240:560;_(Me(O,K));return}let I=Z.current?.previousElementSibling,j=I instanceof HTMLElement?I.getBoundingClientRect().width:B??240;_(Me(O,j+p.delta))},[O,de,B]);(0,v.useEffect)(()=>()=>{ee.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,v.useEffect)(()=>{if(s===void 0||i.openView===void 0)return;let d=t.views;if(d?.bind!==void 0)return d.bind(s,i.openView)},[s,i.openView,t]),(0,v.useEffect)(()=>{if(s===void 0){h({kind:"idle"});return}if(l===void 0){h({kind:"no-service"});return}let d=!0;return h({kind:"loading"}),b(void 0),Promise.resolve().then(()=>l.snapshot({sessionId:s})).then(p=>{if(!d)return;let I=X(p);if(!I.ok){h({kind:"failed",message:I.message});return}let j=I.result;if(!j.ok){h({kind:"failed",message:j.error.message===""?j.error.code:j.error.message});return}let K=j.snapshot;h({kind:"ready",snapshot:K}),E(K.commits),f(K.commits.length<K.counts.commits);let ie=z.current;z.current=void 0,L(ue=>ie!==void 0?ie:ue!==void 0&&K.commits.some(ye=>ye.hash===ue)?ue:K.commits[0]?.hash)}).catch(p=>{d&&h({kind:"failed",message:Y(p)})}),()=>{d=!1}},[s,l,A]),(0,v.useEffect)(()=>{let d=i.viewRequest;if(d==null||d.view!==pe)return;let p=`${d.view}:${d.focus}`;te.current!==p&&(te.current=p,Wt(d.focus,{select:oe,complete:()=>i.completeViewRequest?.()}))},[i.viewRequest,i.completeViewRequest,oe]),(0,v.useEffect)(()=>{let d=t.viewFocus;if(d===void 0||s===void 0)return;let p=()=>{let I=d.take(pe);I!==void 0&&Wt(I,{select:oe})};return p(),d.subscribe(p)},[t,s,oe]);let xe=(0,v.useMemo)(()=>kt(R),[R]),W=g.kind==="ready"?g.snapshot:void 0,ne=(0,v.useMemo)(()=>W===void 0?[]:Ce(W.status),[W]),ae=(0,v.useMemo)(()=>{let d=new Map;for(let p of W?.stats??[])d.set(p.path,{additions:p.additions,deletions:p.deletions});return d},[W]),V=(0,v.useMemo)(()=>{let d=new Map;for(let p of W?.branches??[]){let I=d.get(p.hash);I===void 0?d.set(p.hash,[{kind:p.kind,name:p.name,head:p.head}]):I.push({kind:p.kind,name:p.name,head:p.head})}return d},[W]),He=(0,v.useCallback)(()=>{if(s===void 0||l===void 0||!D||$)return;let d=s;H(!0),b(void 0),Promise.resolve().then(()=>l.query({sessionId:s,skip:R.length,limit:Dt})).then(p=>{if(c.current!==d)return;let I=X(p);if(!I.ok){b(I.message);return}let j=I.result;if(!j.ok){b(j.error.message===""?j.error.code:j.error.message);return}let K=j.page;E(ie=>{let ue=new Set(ie.map(se=>se.hash)),ye=K.commits.filter(se=>!ue.has(se.hash)).map(se=>({...se,refs:V.get(se.hash)??[]}));return ye.length===0?ie:[...ie,...ye]}),f(K.hasMore)}).catch(p=>b(Y(p))).finally(()=>H(!1))},[s,l,D,$,R.length,V]),Be=(0,v.useMemo)(()=>{let d=t.views??{open:(p,I)=>t.openView?.(p,I)??!1};return Ee({views:d,sessionId:s??""})},[t,s]),Ae=(d,p=1)=>{s!==void 0&&Be(d,p)},be=(0,v.useMemo)(()=>{let d={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(p,I)=>t.openViewOrSwitch?.(p,I)??{opened:!1,focused:!1}}};return yt({seam:d,sessionId:s??""})},[t,s]),ve=(d,p=1)=>{s!==void 0&&P!==void 0&&be(P,d,p)},w=(0,v.useCallback)(()=>S(d=>d+1),[]),q=()=>S(d=>d+1);(0,v.useEffect)(()=>Bn(m,w),[m,w]);let G=W?.head,ce=ne.reduce((d,p)=>d+p.files.length,0);return(0,y.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,y.jsxs)("header",{className:"gx-head",children:[(0,y.jsxs)("div",{className:"gx-head-main",children:[(0,y.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,y.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,y.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,y.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,y.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,y.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,y.jsx)("span",{className:"gx-repo",title:W?.root??r("view.title"),children:W===void 0?r("view.title"):On(W.root)}),G?.branch===null||G?.branch===void 0?null:(0,y.jsx)("span",{className:"gx-branch",children:G.branch}),G?.detached===!0?(0,y.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,G?.ahead!==void 0&&G.ahead>0?(0,y.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(G.ahead)}`}):null,G?.behind!==void 0&&G.behind>0?(0,y.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(G.behind)}`}):null]}),(0,y.jsxs)("div",{className:"gx-head-meta",style:An,children:[W===void 0?null:(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)("span",{children:[r("head.changes")," ",(0,y.jsx)("b",{children:ce})]}),(0,y.jsxs)("span",{children:[r("head.commits")," ",(0,y.jsx)("b",{children:W.counts.commits})]}),(0,y.jsxs)("span",{children:[r("head.branches")," ",(0,y.jsx)("b",{children:W.counts.branches})]})]}),(0,y.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:w,children:"\u21BB"})]})]}),s===void 0?(0,y.jsx)(Te,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,y.jsx)(Te,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,y.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,y.jsx)(Te,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:w}):g.kind==="ready"&&!g.snapshot.isRepository?(0,y.jsx)(Te,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:w}):g.kind==="ready"?(0,y.jsxs)("div",{className:"gx-body",style:B===null?void 0:{"--gx-left-col":`${B}px`},children:[(0,y.jsx)(Pt,{groups:ne,stats:ae,t:r,onOpen:Ae,claimFocus:J,onFocusClaimed:Fe}),(0,y.jsx)("div",{ref:Z,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":B??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:De,onPointerMove:me,onPointerUp:le,onPointerCancel:le,onLostPointerCapture:le,onKeyDown:Ie,onDoubleClick:de}),(0,y.jsxs)("div",{className:"gx-col",children:[(0,y.jsx)(It,{commits:R,graph:xe,selectedHash:P,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:D,loadingMore:$,loadError:x,t:r,onSelect:L,onLoadMore:He,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:w,retryLabel:r("action.retry")}:{}}),(0,y.jsx)(Tt,{sessionId:s,hash:P,remote:l,t:r,onSelect:L,onOpenFile:ve})]})]}):null]})}return a}var qt=["slots","locale","workbench","remote"];function Vt(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function jt(e){return()=>{try{let n=e.remote?.gitExplorer;if(Vt(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Vt(n))return n}catch{}let t=Kt(e);return t===void 0?void 0:it(t)}}function Kt(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${tt}/${r}`,o,a)}var Ge;function Ut(e){let t=e.locale.bind(he);Ge?.();let n=e.locale.register(he,{zh:Qe,en:Ze});Ge=n;let r=Nt(typeof document>"u"?void 0:document),o=jt(e),a=xt({store:st(o),t});e.slots.inject(Oe,()=>e.slots.register({name:Oe,id:et,order:30,locale:he},a));let i=e.workbench;if(i!=null){let s=_t({workbench:i,version:i.version,t,remote:o});e.slots.inject(ze,()=>e.slots.register({name:ze,id:pe,order:110,label:()=>t("tab.label"),locale:he},s))}return()=>{r(),n(),Ge===n&&(Ge=void 0)}}var Jt={groupChanges:Ce,formatCommitDetail:Re,createJump:Ee,computeWindow:Le},Xt={name:"dsh-git-explorer",inject:qt,apply:Ut,__test:Jt},Vn=Xt;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
