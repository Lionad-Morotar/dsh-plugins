window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var ct=Object.defineProperty;var ir=Object.getOwnPropertyDescriptor;var sr=Object.getOwnPropertyNames;var lr=Object.prototype.hasOwnProperty;var dr=(e,t)=>{for(var n in t)ct(e,n,{get:t[n],enumerable:!0})},cr=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of sr(t))!lr.call(e,o)&&o!==n&&ct(e,o,{get:()=>t[o],enumerable:!(r=ir(t,o))||r.enumerable});return e};var ur=e=>cr(ct({},"__esModule",{value:!0}),e);var ko={};dr(ko,{__test:()=>Qn,apply:()=>Jn,boot:()=>Qt,clientPlugin:()=>Zn,createRemoteResolver:()=>Xn,createRpcCall:()=>Yn,default:()=>wo,inject:()=>Un});module.exports=ur(ko);var Ht={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Dt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var At=require("react"),zt=14,hr="--dsh-content-font-size",It=zt;function pr(e,t){return Math.max(e,Math.round(e*t/zt))}function gr(e,t){if(e===void 0)return t;let n=Number.parseFloat(e);return Number.isFinite(n)&&n>0?n:t}function _t(){return typeof document>"u"||document.body===null?It:gr(document.body.style.getPropertyValue(hr),It)}var ut=_t(),ht=new Set;function Ft(){return ut}function fr(e){return ht.add(e),()=>{ht.delete(e)}}function mr(e){if(e!==ut){ut=e;for(let t of[...ht])t()}}function Gt(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function xr(e){if(e===null||typeof e!="object")return;let t=e.fontSizes;if(t===null||typeof t!="object")return;let n=t.text;return typeof n=="number"&&Number.isFinite(n)&&n>0?n:void 0}function br(e){try{let t=e.get?.("theme");if(Gt(t))return t}catch{}try{let t=e.theme;if(Gt(t))return t}catch{}}function Wt(e){let t=e.inject;if(typeof t!="function")return()=>{};let n,r;try{let o=t.call(e,["theme"],a=>{let s=br(a);if(s===void 0)return;let i=()=>{try{let m=xr(s.getTheme());mr(m??_t())}catch{}};i();let f=a.on?.("theme/change",i);if(typeof f!="function")return;let l=f;return n=l,l});if(o!==void 0&&typeof o.dispose=="function"){let a=o.dispose.bind(o);r=()=>{a()}}}catch{}return()=>{n?.(),r?.()}}function Ot(e){let t=(0,At.useSyncExternalStore)(fr,Ft,Ft);return pr(e,t)}var pt="conversation.view",ze="git-explorer";var gt="conversation.session.header.actions",$t="git-branch";var _e="git-explorer",Bt="gitExplorer";var P=require("react");var Kt=Object.freeze([]);function Vt(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:Kt}));let r=[];return e.forEach((o,a)=>{let s=yr(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:vr(s)},order:a,run:wr(s)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function ft(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&mt(n.branch))return t}return-1}function jt(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return ft(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&mt(o.branch))return r}return t}function qt(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!mt(n.branch)))return n.branch}function mt(e){return e.worktreePath===void 0}function yr(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),s=-1;for(let i=r;i<e.length;i+=1)if(e.charAt(i).toLowerCase()===a){s=i;break}if(s===-1)return;n.push(s),r=s+1}return n}function vr(e){let t=e[0];if(t===void 0)return Kt;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let s=e[a];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function wr(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function Ut(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function ke(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Ce(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Xe="service-unavailable",kr=Object.freeze({status:"idle",revision:0,sessionId:null}),xt;function Cr(e){let t=kr,n=-1,r=0,o=new Set,a=l=>{t=l;for(let m of[...o])m()},s=l=>t.sessionId===l&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(l){return o.add(l),()=>{o.delete(l)}},getSnapshot:()=>t,load:async l=>{if(s(l))return;let m=e(),u=++r,b=t.revision,A=t.sessionId===l;a({status:"loading",...A&&t.list!==void 0?{list:t.list}:{},revision:b,sessionId:l});let M=()=>u!==r||t.revision!==b;if(typeof m?.branches!="function"){if(M())return;a({status:"error",error:Xe,revision:b,sessionId:l});return}try{let H=await m.branches({sessionId:l});if(M())return;let C=ke(H);if(!C.ok){a({status:"error",error:C.message,revision:b,sessionId:l});return}if(C.result.ok===!1){a({status:"error",error:C.result.error.message,revision:b,sessionId:l});return}n=b,a({status:"ready",list:C.result.list,revision:b,sessionId:l})}catch(H){if(M())return;a({status:"error",error:Ce(H),revision:b,sessionId:l})}},switchTo:async(l,m)=>{let u=()=>t.sessionId!==l,b=e();if(typeof b?.switchBranch!="function")return u()||a({...t,error:Xe}),{switched:!1};try{let A=await b.switchBranch({sessionId:l,name:m}),M=ke(A),H=M.ok?M.result.ok===!1?M.result.error.message:void 0:M.message;if(H!==void 0)return u()||a({...t,error:H}),{switched:!1};if(u())return{switched:!0};let C=M.ok&&M.result.ok===!0?M.result:void 0,_=C===void 0?m:C.branch,y=t.list;return a({status:y===void 0?t.status:"ready",...y===void 0?{}:{list:{...y,detached:!1,headHash:null,branches:y.branches.map(V=>({...V,current:V.name===_}))}},revision:t.revision+1,sessionId:l}),C===void 0||C.stash===void 0?{switched:!0}:{switched:!0,stash:C.stash}}catch(A){return u()||a({...t,error:Ce(A)}),{switched:!1}}},bump(){a({...t,revision:t.revision+1})}}}function Sr(e){return xt=Cr(e),xt}var Xt=Sr;function Yt(){return xt}var Te=require("react"),Rr=Object.freeze({}),Ye=null,bt;function Qt(e){Ye=e}function Zt(){if(bt!=null)return bt;if(Ye===null)return Rr;let e=Jt(Ye,"@deepseek-ai/dsh-client-ui-primitives"),t=Jt(Ye,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,s=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof s=="function"?{createPortal:s}:{}}}function Jt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var en={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},tn=e=>(0,Te.createElement)("svg",{...en,className:e.className},(0,Te.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,Te.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,Te.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,Te.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,Te.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),nn=e=>(0,Te.createElement)("svg",{...en,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,Te.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var D=require("react/jsx-runtime"),rn=320,Tr="min(420px, 100vw - 32px)",on=5,Je=8;function Er(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:on,margin:Je})??void 0:Mr(t,n)}function Mr(e,t){let[n,r]=(0,P.useState)(void 0);return(0,P.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let s=a.getBoundingClientRect(),i=Math.min(rn,Math.max(160,window.innerWidth-Je*2)),f=Math.min(Math.max(s.right-i,Je),window.innerWidth-i-Je);r({left:f,top:s.bottom+on,width:i})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function Nr(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}Lr(t,n,o,a)}function Lr(e,t,n,r){(0,P.useEffect)(()=>{if(!n)return;let o=a=>{let s=a.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function Pr(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[s,i]=o;s>r&&n.push((0,D.jsx)("span",{children:e.slice(r,s)},`plain-${a}`)),n.push((0,D.jsx)("span",{className:"gx-branch-match",children:e.slice(s,i)},`hit-${a}`)),r=i}),r<e.length&&n.push((0,D.jsx)("span",{children:e.slice(r)},"tail")),n}function Hr(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function Dr(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let a=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${a}`)}if(e.untrackedFiles>0){let a=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${a}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function an({store:e,t}){function n({sessionId:r}){let o=(0,P.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,s]=(0,P.useState)(!1),[i,f]=(0,P.useState)(""),[l,m]=(0,P.useState)(-1),[u,b]=(0,P.useState)(null),[A,M]=(0,P.useState)(null),H=(0,P.useRef)(r);H.current=r;let C=(0,P.useRef)(null),_=(0,P.useRef)(null),y=(0,P.useRef)(null),V=(0,P.useRef)(null),j=(0,P.useRef)(null),k=(0,P.useRef)(!1),S=(0,P.useId)(),p=(0,P.useId)(),R=Zt(),q=R.createPortal!==void 0,ae=R.IconBranch??tn,Y=R.IconChevron??nn,L=o.list,I=L===void 0?void 0:Hr(L.root),F=(0,P.useMemo)(()=>Vt(L?.branches??[],i),[L,i]),Z=(0,P.useCallback)(()=>{s(!1),f(""),M(null)},[]),Q=(0,P.useCallback)(()=>{k.current=!0,Z(),_.current?.focus({preventScroll:!0})},[Z]),re=(0,P.useCallback)(()=>{k.current=!0,Z()},[Z]);(0,P.useEffect)(()=>{Z(),b(null),r!==void 0&&e.load(r)},[e,r,Z]),(0,P.useLayoutEffect)(()=>{a&&V.current?.focus({preventScroll:!0})},[a]),(0,P.useLayoutEffect)(()=>{if(a||!k.current)return;k.current=!1;let N=document.activeElement;(N===null||N===document.body||N===_.current||C.current?.contains(N)===!0)&&_.current?.focus({preventScroll:!0})},[a]),(0,P.useEffect)(()=>{m(ft(F))},[F]),(0,P.useEffect)(()=>{j.current?.scrollIntoView?.({block:"nearest"})},[l,F]),(0,P.useEffect)(()=>{if(!a)return;let N=h=>{h.key!=="Escape"||h.isComposing||(h.preventDefault(),Q())};return document.addEventListener("keydown",N),()=>document.removeEventListener("keydown",N)},[a,Q]);let ce=Er(R,a,_,y);Nr(R,C,y,q,a,re);let O=()=>{if(a){Z();return}s(!0),r!==void 0&&e.load(r)},se=()=>{r!==void 0&&e.load(r)},le=async N=>{if(u!==null||N.worktreePath!==void 0)return;if(N.current){Q();return}if(r===void 0)return;b(N.name);let h=await e.switchTo(r,N.name);if(H.current===r&&(b(null),!!h.switched)){if(e.load(r),h.stash?.conflict===!0){M(h.stash);return}Q()}},me=()=>{let N=qt(F,l);N!==void 0&&le(N)},xe=N=>{if(!(N.metaKey||N.ctrlKey||N.altKey)&&!N.nativeEvent.isComposing){if(N.key==="ArrowDown"||N.key==="ArrowUp"){N.preventDefault();let h=N.key==="ArrowDown"?1:-1;m(g=>jt(F,g,h));return}N.key==="Enter"&&(N.preventDefault(),me())}};if(r===void 0)return null;let de=L?.branches.find(N=>N.current)?.name,ue=L===void 0?t("branch.loading"):L.detached?L.headHash??t("head.detached"):de??t("branch.unborn");if(!a&&L?.isRepository!==!0)return null;let he=`${t("head.detached")} ${L?.headHash??""}`.trim(),ie=L?.detached===!0?he:ue,pe=L?.isRepository===!0?L.worktree:void 0,te=pe===void 0?void 0:Dr(pe,t),Ne=t("branch.worktreeSep"),Fe=te===void 0?ie:te.description,Le=te===void 0||pe?.dirty!==!0?`${t("branch.title")}: ${ie}`:`${t("branch.title")}: ${ie}${Ne}${te.description}`,be=o.error===Xe?t("state.noService.title"):o.error,De=(0,D.jsxs)("div",{ref:y,id:p,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:rn,maxWidth:Tr,...ce},children:[A?.conflict===!0?(0,D.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,D.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),A.message===void 0||A.message===""?null:(0,D.jsx)("span",{className:"gx-branch-warning-detail",children:A.message})]}):null,L===void 0||I===void 0?null:(0,D.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:L.root,children:[(0,D.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,D.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,D.jsx)("span",{className:"gx-branch-scope-parent",children:I.parent}),(0,D.jsx)("span",{className:"gx-branch-scope-name",children:I.name})]})]}),(0,D.jsx)("input",{ref:V,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:i,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":L===void 0?void 0:S,"aria-activedescendant":l>=0&&L!==void 0?`${S}-option-${l}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:N=>f(N.target.value),onKeyDown:xe}),be!==void 0?(0,D.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,D.jsx)("span",{className:"gx-branch-error-text",children:be}),(0,D.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:se,children:t("action.retry")})]}):null,o.status==="loading"&&L===void 0?(0,D.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,L!==void 0?(0,D.jsxs)("div",{className:"gx-branch-list",id:S,role:"listbox","aria-label":t("branch.title"),children:[L.branches.length===0?(0,D.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,L.branches.length>0&&F.length===0?(0,D.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,F.map((N,h)=>{let g=N.branch,$=h===l;return(0,D.jsxs)("button",{ref:$?j:void 0,type:"button",role:"option",id:`${S}-option-${h}`,"aria-selected":$,"data-active":$?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${g.name}`,"data-current":g.current?"true":void 0,"aria-current":g.current?"true":void 0,title:g.worktreePath===void 0?g.name:`${g.name} ${t("branch.worktree")}: ${g.worktreePath}`,disabled:u!==null||g.worktreePath!==void 0,onClick:()=>{le(g)},children:[(0,D.jsx)("span",{className:"gx-branch-row-name",children:Pr(g.name,N.ranges)}),g.worktreePath===void 0?null:(0,D.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),g.current?(0,D.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},g.name)})]}):null]});return(0,D.jsxs)("div",{className:"gx-branch-action",ref:C,children:[(0,D.jsxs)("button",{ref:_,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Le,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?p:void 0,title:Fe,onClick:O,children:[(0,D.jsx)(ae,{className:"gx-branch-icon"}),(0,D.jsx)("span",{className:"gx-branch-name",title:ie,children:ue}),te===void 0||pe?.dirty!==!0?null:(0,D.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:te.dot?t("branch.worktreeDirty"):void 0,children:[te.additions>0?(0,D.jsxs)("span",{className:"gx-branch-add",children:["+",te.additions]}):null,te.deletions>0?(0,D.jsxs)("span",{className:"gx-branch-del",children:["\u2212",te.deletions]}):null,te.dot?(0,D.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,D.jsx)(Y,{className:"gx-branch-chevron"})]}),a?R.createPortal===void 0?De:R.createPortal(De,document.body):null]})}return n}function sn(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function Qe(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function Ze(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function ln(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var Ir={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Pe(e){return Ir[e]}var dn={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Fr(e,t){return(dn[e]??0)>=(dn[t]??0)?e:t}function cn(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function yt(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function Gr(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:Fr(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let i=a.slice(2),f=i.slice(0,2),l=yt(i,7);l!==""&&r({path:l,status:cn(f),staged:f[0]!==".",isDirectory:!1})}else if(s==="2"){let i=a.slice(2),f=i.slice(0,2),l=yt(i,8),m=t[o+1]??"";l!==""&&m!==""&&(o+=1,r({path:l,status:cn(f),staged:f[0]!==".",isDirectory:!1,origPath:m}))}else if(s==="u"){let i=a.slice(2),f=yt(i,9);f!==""&&r({path:f,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let i=a.slice(2);if(i==="")continue;let f=i.endsWith("/");r({path:f?i.slice(0,-1):i,status:"untracked",staged:!1,isDirectory:f})}}return[...n.values()]}function Ar(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function vt(e){let t=new Map;for(let n of e){let r=Ar(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function We(e){return vt(Gr(e))}function wt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let i=Math.floor(a/30);return i<12?`${i}mo`:`${Math.floor(a/365)}y`}function et(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:wt(e.time,t)}}function tt({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function un({seam:e,sessionId:t}){return(n,r,o=1)=>{let a=typeof n=="string"?n.trim().toLowerCase():"";if(a===""||typeof r!="string")return;let s=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(s==="")return;let i=Number.isFinite(o)&&o>0?Math.floor(o):1,f=`git:${a}:${String(i)}:${s}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",f);let l=e.openViewOrSwitch("fs-explorer",f);if(l.focused){e.viewFocus?.take?.("fs-explorer");return}if(l.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",f)!==!0&&e.openView?.("fs-explorer",f)!==!0&&e.viewFocus?.request?.("fs-explorer",f)}}var zr=/^commit:([0-9a-f]{4,64})$/iu;function hn(e){if(e===void 0)return;let t=zr.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var pn=24;function nt(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-a-o*2),i=Math.floor(Math.max(0,t.scrollTop)/n)-o,f=Math.min(Math.max(i,0),s),l=Math.min(e.length,f+a+o*2);return{rows:e.slice(f,l),startIndex:f,endIndex:l}}function gn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return sn({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function fn(e){let t=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((m,u)=>m-u),r.shift()??o++),i=l=>{l!==null&&!r.includes(l)&&r.push(l)},f=()=>{let l=t.indexOf(null);return l>=0?l:(t.push(null),n.push(null),t.length-1)};for(let l of e){let m=[...t],u=[...n],b=m.indexOf(l.hash),A=b>=0;A||(b=f());let M=A?n[b]??null:null;M===null&&(M=s(),n[b]=M);for(let y=0;y<m.length;y+=1)y!==b&&m[y]===l.hash&&(i(n[y]??null),t[y]=null,n[y]=null);let H=l.parents[0];H===void 0?(i(n[b]??null),t[b]=null,n[b]=null):(t[b]=H,n[b]=M);let C=[];for(let y=1;y<l.parents.length;y+=1){let V=l.parents[y];if(V===void 0)continue;let j=t.indexOf(V);j<0&&(j=f(),t[j]=V),n[j]===null&&(n[j]=s()),C.push(j)}let _=[];for(let y=0;y<m.length;y+=1){let V=m[y];if(V===null)continue;let j=u[y]??M;V===l.hash?_.push({kind:"into",from:y,to:b,color:j}):_.push({kind:"pass",from:y,to:y,color:j})}H!==void 0&&_.push({kind:"out",from:b,to:b,color:n[b]??M});for(let y of C)_.push({kind:"out",from:b,to:y,color:n[y]??M});for(a.push({lane:b,color:M,merge:l.parents.length>=2,segments:_});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function mn(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function Se(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function xn(e,t){return`${e.trim().toLowerCase()}\0${t}`}function bn(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let a=n.keys().next();a.done||n.delete(a.value)}},get size(){return n.size}}}function yn(e,t,n,r=10,o=8){let a=Math.max(o,n.width-t.width-o),s=e.right+r;s>a&&(s=e.left-t.width-r,s<o&&(s=Math.min(a,Math.max(o,e.left))));let i=Math.max(o,n.height-t.height-o),f=e.bottom+r,l=e.top-t.height-r,m;return f<=i?m=Math.max(o,f):l>=o?m=l:m=Math.min(i,Math.max(o,e.top)),{left:s,top:m}}var vn="dsh-git-explorer-styles",_r=`
/* The token block is shared with the hover card because the card portals out of
   .gx-root and would otherwise lose the theme variables with it. */
.gx-root, .gx-preview {
  --gx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --gx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  /* The host's own axes: body text for the interface, code size for monospace
     text. Both keep the design baseline as their fallback so a host that
     writes neither still gets the sizes this panel shipped with. */
  --gx-fs: var(--dsh-content-font-size, 14px);
  --gx-fs-code: var(--dsh-code-font-size, 11px);
  /* The one row height the virtual window and this sheet share; the floor
     keeps a row clickable below the design baseline, matching the TS helper. */
  --gx-row-h: max(24px, calc(var(--gx-fs) * 1.7143));
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
  font-size: calc(var(--gx-fs) * 0.8571);
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.gx-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  min-height: calc(var(--gx-fs) * 2.7143);
  padding: 6px 12px;
  border-bottom: 1px solid var(--gx-border-soft);
}
.gx-head-main { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
.gx-head-icon { display: inline-flex; color: var(--gx-accent); flex: none; }
.gx-repo {
  font-weight: 600;
  font-size: calc(var(--gx-fs) * 0.9286);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 34ch;
}
.gx-branch, .gx-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: calc(var(--gx-fs-code) * 1.6364);
  padding: 0 7px;
  border: 1px solid var(--gx-border);
  border-radius: 999px;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: calc(var(--gx-fs-code) * 0.9545);
  white-space: nowrap;
  flex: none;
}
.gx-branch { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 40%, transparent); }
.gx-head-meta { display: flex; align-items: center; gap: 8px; flex: none; color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7857); }
.gx-head-meta b { color: var(--gx-text-2); font-weight: 600; font-variant-numeric: tabular-nums; }
.gx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--gx-fs) * 1.7143);
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
  height: calc(var(--gx-fs) * 2.1429);
  padding: 0 10px;
  border-bottom: 1px solid var(--gx-border-soft);
  color: var(--gx-text-2);
  font-size: calc(var(--gx-fs) * 0.7857);
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
  height: calc(var(--gx-fs) * 1.4286);
  padding: 0 6px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 5px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  color: var(--gx-text);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.7857);
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
  height: calc(var(--gx-fs) * 1.5714);
  padding: 0 10px;
  background: var(--gx-panel-2);
  color: var(--gx-caption);
  font-size: calc(var(--gx-fs) * 0.75);
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
  /* The status badge scales with the code axis, so its track has to as well. */
  grid-template-columns: calc(var(--gx-fs-code) * 1.4545) minmax(0, 1fr) auto;
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
.gx-file-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--gx-fs) * 0.8571); }
.gx-file-name .gx-file-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9545); margin-right: 4px; }
.gx-file[data-renamed="true"] .gx-file-name { color: var(--gx-text-2); }
.gx-file-orig { color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7143); margin-left: 4px; text-decoration: line-through; }
.gx-file-stats { display: inline-flex; align-items: center; gap: 5px; font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9545); font-variant-numeric: tabular-nums; }
.gx-add { color: var(--gx-added); }
.gx-del { color: var(--gx-deleted); }
.gx-stat-muted { color: var(--gx-caption); }

.gx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--gx-fs-code) * 1.3636);
  height: calc(var(--gx-fs-code) * 1.3636);
  border-radius: 4px;
  font-family: var(--gx-mono);
  font-size: calc(var(--gx-fs-code) * 0.8636);
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
.gx-hash { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--gx-caption); font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9545); text-align: right; }
.gx-subject { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: calc(var(--gx-fs) * 0.8571); }
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
  font-size: calc(var(--gx-fs-code) * 0.8636);
  line-height: calc(var(--gx-fs-code) * 1.3636);
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
  font-size: calc(var(--gx-fs) * 0.75);
  line-height: calc(var(--gx-fs) * 1.1429);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--gx-text) 16%, transparent);
  pointer-events: none;
}
.gx-ref:hover .gx-ref-tip { display: block; }
.gx-ref[data-kind="tag"] { color: var(--gx-modified); border-color: color-mix(in srgb, var(--gx-modified) 35%, transparent); }
.gx-author, .gx-time { min-width: 0; color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.75); }
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
  /* The header labels the cells under it, so it takes the row height itself
     rather than a second expression that could round differently. */
  height: var(--gx-row-h);
  padding: 0 10px 0 4px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--gx-border-soft);
  color: var(--gx-caption);
  font-size: calc(var(--gx-fs) * 0.7143);
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
  height: calc(var(--gx-fs) * 2);
  padding: 0 10px;
  border-top: 1px solid var(--gx-border-soft);
  color: var(--gx-caption);
  font-size: calc(var(--gx-fs) * 0.75);
}
.gx-loadbar .gx-spacer { flex: 1; }
.gx-loadbar .gx-del { max-width: 42ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-linkbtn {
  border: 0;
  background: transparent;
  color: var(--gx-accent);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.7857);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}
.gx-linkbtn:hover:not(:disabled) { background: var(--gx-hover); }
.gx-linkbtn:disabled { opacity: .45; cursor: default; }

.gx-detail { display: flex; flex-direction: column; flex: none; height: var(--gx-detail-h, 38%); min-height: 180px; border: 1px solid var(--gx-border); border-radius: 10px; background: var(--gx-panel); overflow: hidden; }
.gx-detail-head { display: flex; align-items: center; gap: 8px; flex: none; height: calc(var(--gx-fs) * 2); padding: 0 10px; border-bottom: 1px solid var(--gx-border-soft); color: var(--gx-text-2); font-size: calc(var(--gx-fs) * 0.7857); font-weight: 600; }
.gx-detail-head .gx-hash { color: var(--gx-text-2); }
.gx-detail-body { flex: 1; min-height: 0; overflow: auto; padding: 8px 10px 10px; box-sizing: border-box; }
.gx-detail-subject { font-size: calc(var(--gx-fs) * 0.9286); font-weight: 600; line-height: 1.4; word-break: break-word; }
.gx-detail-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.75); }
.gx-detail-meta .gx-author { max-width: none; }
.gx-parents { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.gx-parents-label { color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7143); }
.gx-parent {
  border: 1px solid var(--gx-border);
  border-radius: 5px;
  background: transparent;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: calc(var(--gx-fs-code) * 0.9091);
  padding: 1px 5px;
  cursor: pointer;
}
.gx-parent:hover { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 45%, transparent); }
.gx-body-text { margin: 8px 0 0; padding: 6px 8px; border-radius: 6px; background: var(--gx-panel-2); color: var(--gx-text-2); font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9545); line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.gx-detail-files { margin-top: 10px; }
.gx-detail-files-title { color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7143); letter-spacing: .02em; margin-bottom: 2px; }
.gx-detail-group { margin-top: 4px; }
.gx-detail-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9091); }
.gx-detail-file {
  display: grid;
  grid-template-columns: calc(var(--gx-fs-code) * 1.3636) minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: calc(var(--gx-fs) * 1.4286);
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
.gx-detail-file .gx-file-name { font-size: calc(var(--gx-fs) * 0.7857); }

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
  font-size: calc(var(--gx-fs) * 0.7857);
  line-height: 1.45;
}
.gx-preview-head {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
  height: calc(var(--gx-fs) * 1.8571);
  padding: 0 10px;
  border-bottom: 1px solid var(--gx-border-soft);
  background: var(--gx-panel);
}
.gx-preview-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.gx-preview-rev { margin-left: auto; flex: none; color: var(--gx-caption); font-family: var(--gx-mono); font-size: calc(var(--gx-fs-code) * 0.9091); }
.gx-preview-body { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; padding: 8px 10px; overflow: hidden; }
.gx-preview-text {
  margin: 0;
  flex: 1 1 auto;
  min-height: 0;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: calc(var(--gx-fs-code) * 0.9545);
  line-height: 1.5;
  white-space: pre;
  overflow: hidden;
}
.gx-preview-note { flex: none; margin-top: 6px; color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7143); }
/* A capped card can clip the fortieth line; fading the last rows tells the
   reader the text continues without pretending the card is the full file. */
.gx-preview[data-clipped="true"] .gx-preview-text {
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
}
.gx-preview-unavailable { display: flex; flex-direction: column; gap: 3px; color: var(--gx-text-2); }
.gx-preview-unavailable strong { color: var(--gx-text); font-size: calc(var(--gx-fs) * 0.8214); }

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
.gx-empty strong { color: var(--gx-text); font-size: calc(var(--gx-fs) * 0.9286); font-weight: 600; }
.gx-empty span { color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7857); max-width: 46ch; }
.gx-empty .gx-btn { margin-top: 4px; border-color: var(--gx-border); }
.gx-empty-inline { min-height: 80px; margin: 8px; padding: 10px; }
.gx-skeleton { padding: 12px; color: var(--gx-caption); font-size: calc(var(--gx-fs) * 0.7857); }

/* Session header branch action. It renders outside .gx-root, so it cannot use
   the panel variables above: every value is an alias token with a readable
   fallback, which keeps light and dark themes on the shell's own colours. */
.gx-branch-action, .gx-branch-panel {
  /* Outside .gx-root: the trigger lives in the session header and the panel
     portals to body, so neither inherits the root's font axes. */
  --gx-fs: var(--dsh-content-font-size, 14px);
  --gx-fs-code: var(--dsh-code-font-size, 11px);
}
.gx-branch-action { position: relative; display: inline-flex; align-items: center; }
.gx-branch-trigger {
  align-items: center;
  display: inline-flex;
  gap: 4px;
  min-height: calc(var(--gx-fs) * 2);
  max-width: min(320px, 40vw);
  padding: 3px 2px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 6px);
  background: 0 0;
  color: var(--dsw-alias-label-tertiary, inherit);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.8571);
  line-height: calc(var(--gx-fs) * 1.2857);
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
  font-size: calc(var(--gx-fs) * 0.7857);
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
  font-size: calc(var(--gx-fs) * 0.9286);
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
  font-size: calc(var(--gx-fs) * 0.7857);
  line-height: calc(var(--gx-fs) * 1.1429);
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
  height: calc(var(--gx-fs) * 2);
  padding: 4px 8px;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 10%, transparent));
  border-radius: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary, inherit);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.9286);
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
  min-height: calc(var(--gx-fs) * 2.1429);
  padding: 5px 8px;
  box-sizing: border-box;
  border: 0;
  border-radius: var(--dsw-radius-md, 8px);
  background: transparent;
  color: var(--dsw-alias-label-primary, inherit);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.9286);
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
  font-size: calc(var(--gx-fs) * 0.7143);
  line-height: calc(var(--gx-fs) * 1.0714);
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
  font-size: calc(var(--gx-fs) * 0.7143);
  line-height: calc(var(--gx-fs) * 1.0714);
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
  font-size: calc(var(--gx-fs) * 0.8571);
}
.gx-branch-warning-text { font-weight: 500; }
.gx-branch-warning-detail {
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: var(--gx-fs-code);
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
  font-size: calc(var(--gx-fs) * 0.8571);
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
  font-size: calc(var(--gx-fs) * 0.7857);
  cursor: pointer;
}
.gx-branch-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 10%, transparent)); }
.gx-branch-hint { padding: 8px 9px; color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); font-size: calc(var(--gx-fs) * 0.8571); }
.gx-branch-nomatch { padding: 12px 9px; color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); font-size: calc(var(--gx-fs) * 0.8571); text-align: center; }


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
`;function wn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${vn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=vn,n.textContent=_r,e.head.appendChild(n),()=>{n.remove()}}var v=require("react");var U=require("react");function kn(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let a=o.files.filter(s=>s.path.toLowerCase().includes(n));a.length>0&&r.push({dir:o.dir,files:a})}return r}var z=require("react/jsx-runtime");function Me(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function Wr(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function Or(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function $r({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,z.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,z.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Cn({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let s=(0,U.useRef)(null),i=(0,U.useRef)(null),[f,l]=(0,U.useState)(""),m=(0,U.useMemo)(()=>kn(e,f),[e,f]),u=(0,U.useMemo)(()=>Wr(m),[m]),b=(0,U.useMemo)(()=>u.map(Me),[u]),A=e.reduce((p,R)=>p+R.files.length,0),M=(0,U.useMemo)(()=>m.reduce((p,R)=>p+R.files.length,0),[m]),H=f.trim()!=="",[C,_]=(0,U.useState)(void 0),y=(0,U.useMemo)(()=>C===void 0?-1:b.indexOf(C),[C,b]),V=(0,U.useRef)(0);(0,U.useEffect)(()=>{y>=0&&(V.current=y)},[y]);let j=(0,U.useRef)(u);j.current=u,(0,U.useEffect)(()=>{if(!o)return;a(),Or(s.current);let p=j.current.find(R=>R.kind==="file");p!==void 0&&_(Me(p))},[o,a]),(0,U.useEffect)(()=>{if(C===void 0||y>=0||u.length===0)return;let p=u[Math.min(V.current,u.length-1)];p!==void 0&&_(Me(p))},[y,C,u]);let k=(0,U.useCallback)(p=>{let R=b[p];R!==void 0&&(_(R),i.current?.focus({preventScroll:!0}))},[b]);(0,U.useEffect)(()=>{if(y<0)return;i.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[y,C]);let S=(0,U.useCallback)(p=>{let R=Qe({key:p.key,composing:p.nativeEvent.isComposing,alt:p.altKey,ctrl:p.ctrlKey,meta:p.metaKey,shift:p.shiftKey});if(R===null)return;if(p.preventDefault(),R==="activate"){let ae=y<0?void 0:u[y];ae?.kind==="file"&&!ae.file.isDirectory&&r(ae.file.path,1);return}let q=Ze(y<0?void 0:y,R,u.length);q!==void 0&&k(q)},[y,k,r,u]);return(0,z.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,z.jsxs)("header",{className:"gx-pane-head",children:[(0,z.jsx)("span",{children:n("changes.title")}),(0,z.jsx)("span",{className:"gx-count",children:H?`${String(M)} / ${String(A)}`:A}),(0,z.jsx)("span",{className:"gx-spacer"}),(0,z.jsx)("input",{className:"gx-filter",type:"search",value:f,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:p=>l(p.currentTarget.value)})]}),(0,z.jsx)("div",{className:"gx-scroll",ref:i,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:S,children:A===0?(0,z.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,z.jsx)("strong",{children:n("changes.empty")})}):u.length===0?(0,z.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,z.jsx)("strong",{children:n("changes.noMatch")})}):u.map(p=>p.kind==="group"?(0,z.jsxs)("div",{className:"gx-group-head","data-cursor":Me(p)===C?"true":"false",children:[(0,z.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,z.jsx)("span",{className:"gx-count",children:p.count})]},Me(p)):(0,z.jsxs)("button",{type:"button",className:"gx-file","data-status":p.file.status,"data-directory":p.file.isDirectory?"true":"false","data-renamed":p.file.origPath===void 0?"false":"true","data-cursor":Me(p)===C?"true":"false","data-testid":"git-change-file",title:p.file.isDirectory?`${n(`status.${p.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${p.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{_(Me(p)),i.current?.focus({preventScroll:!0}),p.file.isDirectory||r(p.file.path,1)},children:[(0,z.jsx)("span",{className:"gx-badge","data-status":p.file.status,children:Pe(p.file.status)}),(0,z.jsxs)("span",{className:"gx-file-name",children:[Se(p.file.path),p.file.origPath===void 0?null:(0,z.jsx)("span",{className:"gx-file-orig",children:Se(p.file.origPath)})]}),(0,z.jsx)("span",{className:"gx-file-stats",children:(0,z.jsx)($r,{stat:t.get(p.file.path)})})]},Me(p)))})]})}var B=require("react"),Sn=require("react-dom");var x=require("react/jsx-runtime"),Br=200,Kr=40,Vr=24,jr=7;function qr({additions:e,deletions:t}){return e===null&&t===null?(0,x.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,x.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Ur(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Xr({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,x.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,x.jsx)("strong",{children:t("preview.unavailable")}),(0,x.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,x.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,x.jsx)("strong",{children:t("preview.unavailable")}),(0,x.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,x.jsxs)(x.Fragment,{children:[r.text===""?(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,x.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function Yr({preview:e,hash:t,t:n}){let r=(0,B.useRef)(null),o=(0,B.useRef)(null),[a,s]=(0,B.useState)(null),[i,f]=(0,B.useState)(!1);return(0,B.useLayoutEffect)(()=>{let l=r.current;if(l===null)return;let m=l.getBoundingClientRect();s(yn(e.anchor,{width:m.width,height:m.height},{width:window.innerWidth,height:window.innerHeight}));let u=o.current;f(u!==null&&u.scrollHeight>u.clientHeight+1)},[e]),typeof document>"u"?null:(0,Sn.createPortal)((0,x.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":i?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:a?.left??0,top:a?.top??0,visibility:a===null?"hidden":"visible"},children:[(0,x.jsxs)("div",{className:"gx-preview-head",children:[(0,x.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Pe(e.file.status)}),(0,x.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:Se(e.file.path)}),(0,x.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,jr)} \xB7 ${n("preview.revision")}`})]}),(0,x.jsx)("div",{className:"gx-preview-body",children:(0,x.jsx)(Xr,{preview:e,t:n,textRef:o})})]}),document.body)}function Rn({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:a}){let[s,i]=(0,B.useState)({kind:"idle"}),[f,l]=(0,B.useState)(0),m=(0,B.useRef)(new Map),[u,b]=(0,B.useState)({kind:"idle"}),A=(0,B.useRef)(bn(Vr)),M=(0,B.useRef)(void 0),H=(0,B.useRef)(void 0),C=(0,B.useRef)(void 0),_=(0,B.useRef)(null),y=(0,B.useCallback)(()=>{M.current=void 0,H.current!==void 0&&(window.clearTimeout(H.current),H.current=void 0),C.current?.abort(),C.current=void 0,b(k=>k.kind==="idle"?k:{kind:"idle"})},[]),V=(0,B.useCallback)((k,S)=>{if(y(),t===void 0)return;let p=S.getBoundingClientRect(),R={left:p.left,top:p.top,right:p.right,bottom:p.bottom},q=xn(t,k.path);M.current=q,H.current=window.setTimeout(()=>{if(H.current=void 0,M.current!==q)return;let ae=A.current.get(q);if(ae!==void 0){b({kind:"ready",file:k,anchor:R,page:ae});return}if(e===void 0||n===void 0||typeof n.show!="function"){b({kind:"unavailable",file:k,anchor:R,message:r("preview.noService")});return}let Y=new AbortController;C.current=Y,b({kind:"loading",file:k,anchor:R}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:k.path,offset:1,limit:Kr},Y.signal)).then(L=>{if(Y.signal.aborted||M.current!==q)return;let I=ke(L);if(!I.ok){b({kind:"unavailable",file:k,anchor:R,message:I.message});return}let F=I.result;if(!F.ok){b({kind:"unavailable",file:k,anchor:R,message:Ur(F.error.code,F.error.message,r)});return}A.current.set(q,F.page),b({kind:"ready",file:k,anchor:R,page:F.page})}).catch(L=>{Y.signal.aborted||M.current!==q||b({kind:"unavailable",file:k,anchor:R,message:Ce(L)})}).finally(()=>{C.current===Y&&(C.current=void 0)})},Br)},[y,t,n,e,r]);(0,B.useEffect)(()=>{if(t===void 0){i({kind:"idle"});return}let k=m.current.get(t);if(k!==void 0){i({kind:"ready",detail:k});return}if(n===void 0||e===void 0){i({kind:"failed",message:r("state.noService.description")});return}let S=!0;return i({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(p=>{if(!S)return;let R=ke(p);if(!R.ok){i({kind:"failed",message:R.message});return}let q=R.result;q.ok?(m.current.set(t,q.detail),i({kind:"ready",detail:q.detail})):i({kind:"failed",message:q.error.message===""?q.error.code:q.error.message})}).catch(p=>{S&&i({kind:"failed",message:Ce(p)})}),()=>{S=!1}},[t,n,e,f,r]),(0,B.useEffect)(()=>{if(u.kind==="idle")return;let k=S=>{S.key==="Escape"&&y()};return document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[u.kind,y]),(0,B.useEffect)(()=>{let k=_.current;if(k===null)return;let S=()=>y();return k.addEventListener("scroll",S,{passive:!0}),()=>k.removeEventListener("scroll",S)},[y]),(0,B.useEffect)(()=>{y()},[t,f,e,n,y]),(0,B.useEffect)(()=>()=>{M.current=void 0,H.current!==void 0&&window.clearTimeout(H.current),C.current?.abort()},[]);let j=et(s.kind==="ready"?s.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,x.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,x.jsxs)("header",{className:"gx-detail-head",children:[(0,x.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,x.jsx)("span",{className:"gx-hash",children:j.shortHash}),(0,x.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,x.jsx)("div",{className:"gx-detail-body",ref:_,children:s.kind==="idle"?(0,x.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):s.kind==="loading"?(0,x.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):s.kind==="failed"?(0,x.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,x.jsx)("strong",{children:r("detail.failed")}),(0,x.jsx)("span",{children:s.message}),(0,x.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>l(k=>k+1),children:r("action.retry")})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("div",{className:"gx-detail-subject",children:s.detail.subject}),(0,x.jsxs)("div",{className:"gx-detail-meta",children:[(0,x.jsx)("span",{className:"gx-author",children:s.detail.author}),(0,x.jsx)("span",{children:j.relative}),(0,x.jsx)("span",{title:new Date(s.detail.time*1e3).toLocaleString(),children:new Date(s.detail.time*1e3).toLocaleDateString()})]}),(0,x.jsxs)("div",{className:"gx-parents",children:[(0,x.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),s.detail.parents.length===0?(0,x.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):s.detail.parents.map(k=>(0,x.jsx)("button",{type:"button",className:"gx-parent",title:k,onClick:()=>o(k),children:k.slice(0,7)},k))]}),s.detail.body===""?null:(0,x.jsx)("pre",{className:"gx-body-text",children:s.detail.body}),(0,x.jsxs)("div",{className:"gx-detail-files",children:[(0,x.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(s.detail.files.length)}`}),s.detail.files.length===0?(0,x.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):vt(s.detail.files).map(k=>(0,x.jsxs)("div",{className:"gx-detail-group",children:[(0,x.jsx)("div",{className:"gx-detail-dir",children:k.dir===""?r("changes.root"):k.dir}),k.files.map(S=>(0,x.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:S.path,onClick:()=>a?.(S.path),onMouseEnter:p=>V(S,p.currentTarget),onMouseLeave:y,children:[(0,x.jsx)("span",{className:"gx-badge","data-status":S.status,children:Pe(S.status)}),(0,x.jsxs)("span",{className:"gx-file-name",children:[Se(S.path),S.origPath===void 0?null:(0,x.jsx)("span",{className:"gx-file-orig",children:Se(S.origPath)})]}),(0,x.jsx)("span",{className:"gx-file-stats",children:(0,x.jsx)(qr,{additions:S.additions,deletions:S.deletions})})]},S.path))]},k.dir===""?".":k.dir))]})]})}),u.kind==="idle"?null:(0,x.jsx)(Yr,{preview:u,hash:t??"",t:r})]})}var W=require("react/jsx-runtime");function Jr(e,t){let n=0,r=0,o=0;for(let a of e)for(let s of a.files){let i=t.get(s.path);i!==void 0&&(n+=i.additions??0,r+=i.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function Tn({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((s,i)=>s+i.files.length,0),a=Jr(e,t);return(0,W.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,W.jsxs)("header",{className:"gx-detail-head",children:[(0,W.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,W.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,W.jsx)("span",{className:"gx-spacer"}),a.counted===0?null:(0,W.jsxs)("span",{className:"gx-detail-stats",children:[(0,W.jsx)("span",{className:"gx-add",children:`+${String(a.additions)}`}),(0,W.jsx)("span",{className:"gx-del",children:`-${String(a.deletions)}`})]})]}),(0,W.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(s=>(0,W.jsxs)("div",{className:"gx-detail-group",children:[(0,W.jsxs)("div",{className:"gx-group-head",children:[(0,W.jsx)("span",{className:"gx-group-dir",children:s.dir===""?n("changes.root"):s.dir}),(0,W.jsx)("span",{className:"gx-count",children:s.files.length})]}),s.files.map(i=>(0,W.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-testid":"git-change-file",title:i.isDirectory?`${n(`status.${i.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${i.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,W.jsx)("span",{className:"gx-badge","data-status":i.status,children:Pe(i.status)}),(0,W.jsxs)("span",{className:"gx-file-name",children:[Se(i.path),i.origPath===void 0?null:(0,W.jsx)("span",{className:"gx-file-orig",children:Se(i.origPath)})]}),(0,W.jsx)("span",{className:"gx-file-stats",children:(0,W.jsx)(Qr,{stat:t.get(i.path)})})]},i.path))]},s.dir))})]})}function Qr({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,W.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,W.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var G=require("react");var Oe=require("react/jsx-runtime");function En(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Mn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(36,t*12)),o=r/Math.max(1,t),a=f=>f*o+o/2,s=n/2,i=e.segments.map((f,l)=>{let m=a(f.from),u=a(f.to),b=f.kind==="pass"?`M ${String(m)} 0 L ${String(u)} ${String(n)}`:f.kind==="into"?`M ${String(m)} 0 C ${String(m)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(s)}`:`M ${String(m)} ${String(s)} C ${String(m)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(n)}`;return(0,Oe.jsx)("path",{d:b,fill:"none",stroke:En(f.color),strokeWidth:1.4,strokeLinecap:"round"},`${f.kind}-${String(f.from)}-${String(f.to)}-${String(l)}`)});return(0,Oe.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[i,(0,Oe.jsx)("circle",{cx:a(e.lane),cy:s,r:e.merge?4:3.2,fill:En(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var kt="git-explorer.leftColumnWidth";function Ct(e){return Math.min(560,Math.max(240,e))}function Ln(e){if(e==null)return null;let t;try{t=e.getItem(kt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function rt(e,t){let n=Math.round(Ct(t));if(e!=null)try{e.setItem(kt,String(n))}catch{}return n}function Pn(e){if(e!=null)try{e.removeItem(kt)}catch{}}function $e(e,t){return Math.round(e)===Math.round(t)}var Nn=16;function Hn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Nn};case"ArrowRight":return{kind:"nudge",delta:Nn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Be=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],St="git-explorer.historyColumns",Dn=16,fe={refs:168,time:84,author:96,hash:68};function In(e){return Be.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function Rt(e,t){let n=In(e);return Math.min(n.max,Math.max(n.min,t))}function ot(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=In(t);return n<r.min||n>r.max?null:n}function Zr(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Tt(e){if(e==null)return fe;let t;try{t=e.getItem(St)}catch{return fe}if(t===null)return fe;let n=Zr(t);return n===null?fe:{refs:ot(n,"refs")??fe.refs,time:ot(n,"time")??fe.time,author:ot(n,"author")??fe.author,hash:ot(n,"hash")??fe.hash}}function eo(e,t){if(e==null)return;let n={};for(let r of Be){let o=t[r.id];o!==fe[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(St):e.setItem(St,JSON.stringify(n))}catch{}}function at(e,t,n){let r=Math.round(Rt(t,n)),o={...Tt(e),[t]:r};return eo(e,o),o}function Fn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Dn};case"ArrowRight":return{kind:"nudge",delta:Dn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function Gn(e,t){return $e(e,t)}var w=require("react/jsx-runtime");var to=12,Re="uncommitted";function Et(e){return Math.min(116,Math.max(36,e*12))}function no(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function ro({commit:e,row:t,laneCount:n,rowHeight:r,top:o,selected:a,head:s,cursor:i,onSelect:f}){return(0,w.jsxs)("button",{type:"button",className:"gx-row",style:{top:o},"data-selected":a?"true":"false","data-head":s?"true":"false","data-cursor":i?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>f(e.hash),children:[t===void 0?(0,w.jsx)("span",{className:"gx-graph",style:{width:Et(n)}}):(0,w.jsx)(Mn,{row:t,laneCount:n,height:r}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(l=>(0,w.jsxs)("span",{className:"gx-ref","data-kind":l.kind,children:[(0,w.jsx)("span",{className:"gx-ref-name",children:l.name}),(0,w.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:l.name})]},`${l.kind}:${l.name}`))}),(0,w.jsx)("span",{className:"gx-subject",children:e.subject}),(0,w.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:wt(e.time)}),(0,w.jsx)("span",{className:"gx-author",children:e.author}),(0,w.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function oo({summary:e,laneCount:t,rowHeight:n,top:r,selected:o,cursor:a,t:s,onSelect:i}){let f=Et(t),m=f/Math.max(1,t)/2,u=0,b=0,A=0;for(let M of e.groups)for(let H of M.files){let C=e.stats.get(H.path);C!==void 0&&(u+=C.additions??0,b+=C.deletions??0,A+=1)}return(0,w.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:r},"data-selected":o?"true":"false","data-cursor":a?"true":"false","data-testid":"git-uncommitted-row",title:s("uncommitted.hint"),"aria-label":s("uncommitted.hint"),onClick:i,children:[(0,w.jsx)("svg",{className:"gx-graph",width:f,height:n,viewBox:`0 0 ${String(f)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:(0,w.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:m,cy:n/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,w.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${s("uncommitted.label")} (${String(e.fileCount)})`}),(0,w.jsx)("span",{className:"gx-time",children:A===0?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("span",{className:"gx-add",children:`+${String(u)}`})," ",(0,w.jsx)("span",{className:"gx-del",children:`-${String(b)}`})]})}),(0,w.jsx)("span",{className:"gx-author"}),(0,w.jsx)("span",{className:"gx-hash"})]})}var ao=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function io({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:a,onKeyDown:s,onReset:i}){let f=l=>Be.find(m=>m.id===l);return(0,w.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:ao.map(l=>{let m=l.id==="graph"||l.id==="subject"?void 0:f(l.id);return(0,w.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${l.id}`,children:[(0,w.jsx)("span",{className:"gx-colhead-label",children:n(l.key)}),m===void 0?null:(0,w.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(l.key)}`,"aria-valuemin":m.min,"aria-valuemax":m.max,"aria-valuenow":e[m.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${m.id}`,onPointerDown:u=>r(m.id,u),onPointerMove:o,onPointerUp:a,onPointerCancel:a,onLostPointerCapture:a,onKeyDown:u=>s(m.id,u),onDoubleClick:()=>i(m.id)})]},l.id)})})}function An(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:i,loadError:f,searching:l,search:m,t:u,onSelect:b,onLoadMore:A,onSearch:M,onSelectUncommitted:H}=e,C=(0,G.useRef)(null),[_,y]=(0,G.useState)(0),[V,j]=(0,G.useState)(0),k=(0,G.useRef)(!1),[S]=(0,G.useState)(()=>e.columnStorage===void 0?no():e.columnStorage),[p,R]=(0,G.useState)(()=>Tt(S)),[q,ae]=(0,G.useState)(0),Y=Ot(pn),L=(0,G.useRef)(null),[I,F]=(0,G.useState)(void 0),Z=e.workingTree,Q=Z!==void 0&&Z.fileCount>0,re=Q?1:0,ce=t.length+re,O=r===void 0?-1:r===Re?Q?0:-1:t.findIndex(h=>h.hash===r)+(Q?1:0),se=I===void 0?void 0:I<re?Re:t[I-re]?.hash,le=(0,G.useRef)(void 0);(0,G.useEffect)(()=>{let h=C.current;if(h===null)return;let g=()=>{j(h.clientHeight),ae(Math.max(0,h.offsetWidth-h.clientWidth))};if(g(),typeof ResizeObserver>"u")return;let $=new ResizeObserver(g);return $.observe(h),()=>$.disconnect()},[t.length]),(0,G.useEffect)(()=>{i||(k.current=!1)},[i]);let me=(0,G.useCallback)(()=>{!s||i||k.current||(k.current=!0,A())},[s,i,A]),xe=h=>{let g=h.currentTarget;y(g.scrollTop),g.scrollTop+g.clientHeight>=g.scrollHeight-160&&me()};(0,G.useEffect)(()=>{let h=se;if(h===void 0)return;let g=h===Re?Q?0:-1:t.findIndex($=>$.hash===h)+re;g!==I&&g>=0?F(g):g<0&&F(void 0)},[t,I,se,Q,re]),(0,G.useEffect)(()=>{let h=le.current!==r;le.current=r,!(!h||I===void 0||r===void 0)&&O>=0&&O!==I&&F(O)},[r,t,I,O]),(0,G.useEffect)(()=>{if(I===void 0)return;let h=C.current;if(h===null)return;let g=gn({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:Y,index:I,rowCount:ce});g!==h.scrollTop&&(h.scrollTop=g,y(g))},[I,ce,Y]),(0,G.useEffect)(()=>{if(I===void 0)return;let h=I-re;h<0||!ln(h,t.length,to)||me()},[I,t.length,me,re]);let de=(0,G.useCallback)(h=>{let g=Qe({key:h.key,composing:h.nativeEvent.isComposing,alt:h.altKey,ctrl:h.ctrlKey,meta:h.metaKey,shift:h.shiftKey});if(g===null)return;h.preventDefault();let $=I??(O>=0?O:void 0),X=Ze($,g,ce);if(X===void 0)return;if(F(X),X===0&&Q){H?.();return}let ye=t[X-re];ye!==void 0&&b(ye.hash)},[t,I,Q,b,H,ce,re,O]),ue=nt(Array.from({length:ce},(h,g)=>g),{scrollTop:_,height:V===0?480:V,rowHeight:Y}),he=Math.max(1,mn(n)),ie=(0,G.useCallback)((h,g)=>{if(!(g.button!==0||L.current!==null)){g.preventDefault(),g.stopPropagation();try{g.currentTarget.setPointerCapture(g.pointerId)}catch{return}L.current={pointerId:g.pointerId,startX:g.clientX,baseWidth:p[h],restWidth:p[h],id:h},document.body.classList.add("gx-col-resizing")}},[p]),pe=(0,G.useCallback)(h=>{let g=L.current;if(g===null||g.pointerId!==h.pointerId)return;let $=Rt(g.id,g.baseWidth+h.clientX-g.startX);R(X=>({...X,[g.id]:$}))},[]),te=(0,G.useCallback)(h=>{let g=L.current;if(g===null||g.pointerId!==h.pointerId)return;L.current=null,document.body.classList.remove("gx-col-resizing");try{h.currentTarget.releasePointerCapture(h.pointerId)}catch{}let $=g.baseWidth+h.clientX-g.startX;if(Gn($,g.baseWidth)){R(X=>({...X,[g.id]:g.restWidth}));return}R(at(S,g.id,$))},[S]),Ne=(0,G.useCallback)(h=>{R(at(S,h,fe[h]))},[S]),Fe=(0,G.useCallback)((h,g)=>{if(g.nativeEvent.isComposing)return;let $=Fn(g.key,g.altKey||g.ctrlKey||g.metaKey||g.shiftKey);if($===null)return;if(g.preventDefault(),g.stopPropagation(),$.kind==="reset"){Ne(h);return}let X=Be.find(Ge=>Ge.id===h);if(X===void 0)return;let ye=$.kind==="nudge"?p[h]+$.delta:$.kind==="min"?X.min:X.max;R(at(S,h,ye))},[Ne,S,p]),Le=(0,G.useMemo)(()=>({"--gx-col-graph":`${String(Et(he))}px`,"--gx-col-refs":`${String(p.refs)}px`,"--gx-col-time":`${String(p.time)}px`,"--gx-col-author":`${String(p.author)}px`,"--gx-col-hash":`${String(p.hash)}px`,"--gx-row-h":`${String(Y)}px`}),[he,Y,p]),be=m.trim()!=="",De=be?u("history.noMatch"):e.emptyTitle??u("history.empty"),N=be?void 0:e.emptyDescription;return(0,w.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:Le,children:[(0,w.jsxs)("header",{className:"gx-pane-head",children:[(0,w.jsx)("span",{children:u("history.title")}),(0,w.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`}),(0,w.jsx)("span",{className:"gx-spacer"}),(0,w.jsx)("input",{className:"gx-filter",type:"search",value:m,spellCheck:!1,placeholder:u("history.search"),"aria-label":u("history.search"),"data-testid":"gx-history-search",onChange:h=>M(h.currentTarget.value)})]}),t.length===0&&!(Q&&!be)?(0,w.jsxs)("div",{className:"gx-empty",children:[(0,w.jsx)("strong",{children:De}),N===void 0?null:(0,w.jsx)("span",{children:N}),e.onRetry===void 0?null:(0,w.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??u("action.retry")})]}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(io,{widths:p,gutter:q,t:u,onPointerDown:ie,onPointerMove:pe,onPointerEnd:te,onKeyDown:Fe,onReset:Ne}),(0,w.jsx)("div",{className:"gx-scroll",ref:C,tabIndex:0,"data-testid":"git-history-scroll",onScroll:xe,onKeyDown:de,children:(0,w.jsx)("div",{className:"gx-vlist",style:{height:ce*Y},children:ue.rows.map(h=>{let g=h*Y;if(h===0&&Q&&Z!==void 0)return(0,w.jsx)(oo,{summary:Z,laneCount:he,rowHeight:Y,top:g,selected:r===Re,cursor:I===0,t:u,onSelect:()=>{F(0),H?.()}},"uncommitted");let $=h-re,X=t[$];return X===void 0?null:(0,w.jsx)(ro,{commit:X,row:n[$],laneCount:he,rowHeight:Y,top:g,selected:X.hash===r,head:X.hash===o,cursor:h===I,onSelect:ye=>{F(h),b(ye)}},X.hash)})})})]}),(0,w.jsxs)("footer",{className:"gx-loadbar",children:[(0,w.jsx)("span",{children:`${u("history.loaded")} ${String(t.length)}`}),f===void 0?null:(0,w.jsx)("span",{className:"gx-del",children:f}),l?(0,w.jsx)("span",{className:"gx-search-status",children:u("history.searching")}):null,(0,w.jsx)("span",{className:"gx-spacer"}),s?(0,w.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:i,onClick:me,children:u(i?"history.loading":"history.loadMore")}):(0,w.jsx)("span",{children:t.length===0?"":u("history.noMore")})]})]})}function Mt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var Nt="git-explorer.detailHeight";function zn(e){return Math.min(88,Math.max(6,e))}function He(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function Ke(e,t){let n=t>0?t:600;return zn(Math.round(e/n*1e3)/10)}function _n(e,t){let n=t>0?t:600;return e/100*n}function Wn(e){if(e==null)return null;let t;try{t=e.getItem(Nt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function it(e,t){let n=Math.round(zn(t)*10)/10;if(e!=null)try{e.setItem(Nt,String(n))}catch{}return n}function On(e){if(e!=null)try{e.removeItem(Nt)}catch{}}function $n(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var T=require("react/jsx-runtime"),ho=250;function po(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Vn(e,t){let n=hn(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function go(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var fo={display:"flex",alignItems:"center",gap:8};function mo(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var xo=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function st({title:e,description:t,actionLabel:n,onAction:r}){return(0,T.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,T.jsx)("strong",{children:e}),t===void 0?null:(0,T.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,T.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function bo(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function jn(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(s){let i=s.sessionId??t.currentSessionId(),f=(0,v.useRef)(i);f.current=i;let l=(0,v.useMemo)(()=>o(),[o]),[m]=(0,v.useState)(Yt),[u,b]=(0,v.useState)(()=>({kind:po(i,l!==void 0)})),[A,M]=(0,v.useState)(0),[H,C]=(0,v.useState)([]),[_,y]=(0,v.useState)(!1),[V,j]=(0,v.useState)(!1),[k,S]=(0,v.useState)(void 0),[p,R]=(0,v.useState)(void 0),[q,ae]=(0,v.useState)(""),[Y,L]=(0,v.useState)(!1),I=(0,v.useRef)(""),F=(0,v.useRef)(0),Z=(0,v.useRef)(void 0),Q=(0,v.useRef)(void 0),[re,ce]=(0,v.useState)(!0),O=(0,v.useMemo)(()=>mo(),[]),[se,le]=(0,v.useState)(()=>Ln(O)),me=(0,v.useRef)(null),xe=(0,v.useRef)(null),[de,ue]=(0,v.useState)(()=>Wn(O)),he=(0,v.useRef)(null),ie=(0,v.useRef)(null),pe=(0,v.useCallback)(d=>{Z.current=d,R(d),ce(!1)},[]),te=(0,v.useCallback)(()=>{ce(!1)},[]),Ne=(0,v.useCallback)(d=>{if(d.button!==0||xe.current!==null||xo())return;let c=me.current?.previousElementSibling;if(c instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}xe.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:c.getBoundingClientRect().width,restWidth:se},document.body.classList.add("gx-pane-resizing")}},[se]),Fe=(0,v.useCallback)(d=>{let c=xe.current;c===null||c.pointerId!==d.pointerId||le(Ct(c.baseWidth+d.clientX-c.startX))},[]),Le=(0,v.useCallback)(d=>{let c=xe.current;if(c===null||c.pointerId!==d.pointerId)return;xe.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let E=c.baseWidth+d.clientX-c.startX;if($e(E,c.baseWidth)){le(c.restWidth);return}le(rt(O,E))},[O]),be=(0,v.useCallback)(()=>{Pn(O),le(null)},[O]),De=(0,v.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let c=Hn(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(c===null)return;if(d.preventDefault(),d.stopPropagation(),c.kind==="reset"){be();return}if(c.kind==="min"||c.kind==="max"){let K=c.kind==="min"?240:560;le(rt(O,K));return}let E=me.current?.previousElementSibling,ne=E instanceof HTMLElement?E.getBoundingClientRect().width:se??240;le(rt(O,ne+c.delta))},[O,be,se]),N=(0,v.useCallback)(()=>{let d=he.current?.parentElement;return d instanceof HTMLElement?d.getBoundingClientRect().height:0},[]),h=(0,v.useCallback)(()=>N()||600,[N]),g=(0,v.useCallback)(()=>{let d=h();return He(_n(de===null?38:de,d),d)},[h,de]),$=(0,v.useCallback)(d=>{if(d.button!==0||ie.current!==null)return;let c=he.current?.parentElement;if(!(c instanceof HTMLElement))return;let E=he.current?.nextElementSibling;if(E instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}ie.current={pointerId:d.pointerId,startY:d.clientY,baseHeight:E.getBoundingClientRect().height,columnHeight:c.getBoundingClientRect().height||600,restHeight:de},document.body.classList.add("gx-row-resizing")}},[de]),X=(0,v.useCallback)(d=>{let c=ie.current;if(c===null||c.pointerId!==d.pointerId)return;let E=He(c.baseHeight-(d.clientY-c.startY),c.columnHeight);ue(Ke(E,c.columnHeight))},[]),ye=(0,v.useCallback)(d=>{let c=ie.current;if(c===null||c.pointerId!==d.pointerId)return;ie.current=null,document.body.classList.remove("gx-row-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let E=He(c.baseHeight-(d.clientY-c.startY),c.columnHeight);if($e(E,c.baseHeight)){ue(c.restHeight);return}ue(it(O,Ke(E,c.columnHeight)))},[O]),Ge=(0,v.useCallback)(()=>{On(O),ue(null)},[O]),er=(0,v.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let c=$n(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(c===null)return;if(d.preventDefault(),d.stopPropagation(),c.kind==="reset"){Ge();return}let E=h();if(c.kind==="min"||c.kind==="max"){let K=c.kind==="min"?He(180,E):He(E,E);ue(it(O,Ke(K,E)));return}let ne=He(g()+c.delta,E);ue(it(O,Ke(ne,E)))},[h,g,O,Ge]);(0,v.useEffect)(()=>()=>{xe.current!==null&&document.body.classList.remove("gx-pane-resizing"),ie.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,v.useEffect)(()=>{if(i===void 0||s.openView===void 0)return;let d=t.views;if(d?.bind!==void 0)return d.bind(i,s.openView)},[i,s.openView,t]),(0,v.useEffect)(()=>{if(i===void 0){b({kind:"idle"});return}if(l===void 0){b({kind:"no-service"});return}let d=!0;return b({kind:"loading"}),S(void 0),F.current+=1,I.current="",ae(""),L(!1),Promise.resolve().then(()=>l.snapshot({sessionId:i})).then(c=>{if(!d)return;let E=ke(c);if(!E.ok){b({kind:"failed",message:E.message});return}let ne=E.result;if(!ne.ok){b({kind:"failed",message:ne.error.message===""?ne.error.code:ne.error.message});return}let K=ne.snapshot;b({kind:"ready",snapshot:K}),C(K.commits),y(K.commits.length<K.counts.commits);let J=Z.current;Z.current=void 0,R(ee=>{if(J!==void 0)return J;let we=We(K.status).length>0;return ee===Re?we?ee:K.commits[0]?.hash:ee!==void 0&&K.commits.some(Ae=>Ae.hash===ee)?ee:K.commits[0]?.hash})}).catch(c=>{d&&b({kind:"failed",message:Ce(c)})}),()=>{d=!1}},[i,l,A]),(0,v.useEffect)(()=>{let d=s.viewRequest;if(d==null||d.view!==ze)return;let c=`${d.view}:${d.focus}`;Q.current!==c&&(Q.current=c,Vn(d.focus,{select:pe,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,pe]),(0,v.useEffect)(()=>{let d=t.viewFocus;if(d===void 0||i===void 0)return;let c=()=>{let E=d.take(ze);E!==void 0&&Vn(E,{select:pe})};return c(),d.subscribe(c)},[t,i,pe]);let tr=(0,v.useMemo)(()=>fn(H),[H]),oe=u.kind==="ready"?u.snapshot:void 0,Ve=(0,v.useMemo)(()=>oe===void 0?[]:We(oe.status),[oe]),dt=(0,v.useMemo)(()=>{let d=new Map;for(let c of oe?.stats??[])d.set(c.path,{additions:c.additions,deletions:c.deletions});return d},[oe]),je=(0,v.useMemo)(()=>{let d=new Map;for(let c of oe?.branches??[]){let E=d.get(c.hash);E===void 0?d.set(c.hash,[{kind:c.kind,name:c.name,head:c.head}]):E.push({kind:c.kind,name:c.name,head:c.head})}return d},[oe]);(0,v.useEffect)(()=>{if(i===void 0||l===void 0||u.kind!=="ready")return;let d=q.trim();if(d===I.current)return;let c=i,E=F.current+1;if(F.current=E,S(void 0),j(!1),d===""){I.current="",L(!1);let K=u.snapshot.commits;C(K),y(K.length<u.snapshot.counts.commits),R(J=>J===Re||J!==void 0&&K.some(ee=>ee.hash===J)?J:K[0]?.hash);return}L(!0);let ne=setTimeout(()=>{I.current=d,Promise.resolve().then(()=>l.query(Mt(i,d,0))).then(K=>{if(F.current!==E||f.current!==c)return;let J=ke(K);if(!J.ok){S(J.message);return}let ee=J.result;if(!ee.ok){S(ee.error.message===""?ee.error.code:ee.error.message);return}let we=ee.page,Ae=je;C(we.commits.map(ge=>({...ge,refs:Ae.get(ge.hash)??[]}))),y(we.hasMore),R(ge=>ge===Re||ge!==void 0&&we.commits.some(Ee=>Ee.hash===ge)?ge:we.commits[0]?.hash)}).catch(K=>{F.current===E&&S(Ce(K))}).finally(()=>{F.current===E&&L(!1)})},ho);return()=>{clearTimeout(ne)}},[q,i,l,u.kind,je]);let nr=(0,v.useCallback)(()=>{if(i===void 0||l===void 0||!_||V)return;let d=i,c=I.current,E=F.current;j(!0),S(void 0),Promise.resolve().then(()=>l.query(Mt(i,c,H.length))).then(ne=>{if(f.current!==d||F.current!==E)return;let K=ke(ne);if(!K.ok){S(K.message);return}let J=K.result;if(!J.ok){S(J.error.message===""?J.error.code:J.error.message);return}let ee=J.page;C(we=>{let Ae=new Set(we.map(Ee=>Ee.hash)),ge=ee.commits.filter(Ee=>!Ae.has(Ee.hash)).map(Ee=>({...Ee,refs:je.get(Ee.hash)??[]}));return ge.length===0?we:[...we,...ge]}),y(ee.hasMore)}).catch(ne=>S(Ce(ne))).finally(()=>j(!1))},[i,l,_,V,H.length,je]),rr=(0,v.useMemo)(()=>{let d=t.views??{open:(c,E)=>t.openView?.(c,E)??!1};return tt({views:d,sessionId:i??""})},[t,i]),Pt=(d,c=1)=>{i!==void 0&&rr(d,c)},or=(0,v.useMemo)(()=>{let d={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(c,E)=>t.openViewOrSwitch?.(c,E)??{opened:!1,focused:!1}}};return un({seam:d,sessionId:i??""})},[t,i]),ar=(d,c=1)=>{i!==void 0&&p!==void 0&&or(p,d,c)},Ie=(0,v.useCallback)(()=>M(d=>d+1),[]),Co=()=>M(d=>d+1);(0,v.useEffect)(()=>go(m,Ie),[m,Ie]);let ve=oe?.head,qe=Ve.reduce((d,c)=>d+c.files.length,0),Ue=(0,v.useMemo)(()=>qe===0?void 0:{groups:Ve,stats:dt,fileCount:qe},[qe,Ve,dt]);return(0,T.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":u.kind,"data-session":i??"","data-testid":"git-explorer-view",children:[(0,T.jsxs)("header",{className:"gx-head",children:[(0,T.jsxs)("div",{className:"gx-head-main",children:[(0,T.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,T.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,T.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,T.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,T.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,T.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,T.jsx)("span",{className:"gx-repo",title:oe?.root??r("view.title"),children:oe===void 0?r("view.title"):bo(oe.root)}),ve?.branch===null||ve?.branch===void 0?null:(0,T.jsx)("span",{className:"gx-branch",children:ve.branch}),ve?.detached===!0?(0,T.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,ve?.ahead!==void 0&&ve.ahead>0?(0,T.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(ve.ahead)}`}):null,ve?.behind!==void 0&&ve.behind>0?(0,T.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(ve.behind)}`}):null]}),(0,T.jsxs)("div",{className:"gx-head-meta",style:fo,children:[oe===void 0?null:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("span",{children:[r("head.changes")," ",(0,T.jsx)("b",{children:qe})]}),(0,T.jsxs)("span",{children:[r("head.commits")," ",(0,T.jsx)("b",{children:oe.counts.commits})]}),(0,T.jsxs)("span",{children:[r("head.branches")," ",(0,T.jsx)("b",{children:oe.counts.branches})]})]}),(0,T.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:u.kind==="loading",onClick:Ie,children:"\u21BB"})]})]}),i===void 0?(0,T.jsx)(st,{title:r("state.noSession.title"),description:r("state.noSession.description")}):u.kind==="no-service"?(0,T.jsx)(st,{title:r("state.noService.title"),description:r("state.noService.description")}):u.kind==="loading"?(0,T.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):u.kind==="failed"?(0,T.jsx)(st,{title:r("state.failed.title"),description:u.message,actionLabel:r("action.retry"),onAction:Ie}):u.kind==="ready"&&!u.snapshot.isRepository?(0,T.jsx)(st,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Ie}):u.kind==="ready"?(0,T.jsxs)("div",{className:"gx-body",style:se===null?void 0:{"--gx-left-col":`${se}px`},children:[(0,T.jsx)(Cn,{groups:Ve,stats:dt,t:r,onOpen:Pt,claimFocus:re,onFocusClaimed:te}),(0,T.jsx)("div",{ref:me,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":se??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ne,onPointerMove:Fe,onPointerUp:Le,onPointerCancel:Le,onLostPointerCapture:Le,onKeyDown:De,onDoubleClick:be}),(0,T.jsxs)("div",{className:"gx-col",style:de===null?void 0:{"--gx-detail-h":`${String(de)}%`},children:[(0,T.jsx)(An,{commits:H,graph:tr,selectedHash:p,headHash:u.snapshot.head?.hash??null,total:u.snapshot.counts.commits,hasMore:_,loadingMore:V,loadError:k,searching:Y,search:q,t:r,onSelect:R,onLoadMore:nr,onSearch:ae,workingTree:Ue,onSelectUncommitted:()=>R(Re),...u.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Ie,retryLabel:r("action.retry")}:{}}),(0,T.jsx)("div",{ref:he,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":de??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:$,onPointerMove:X,onPointerUp:ye,onPointerCancel:ye,onLostPointerCapture:ye,onKeyDown:er,onDoubleClick:Ge}),p===Re&&Ue!==void 0?(0,T.jsx)(Tn,{groups:Ue.groups,stats:Ue.stats,t:r,onOpen:Pt}):(0,T.jsx)(Rn,{sessionId:i,hash:p,remote:l,t:r,onSelect:R,onOpenFile:ar})]})]}):null]})}return a}var Un=["slots","locale","workbench","remote"];function qn(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function Xn(e){return()=>{try{let n=e.remote?.gitExplorer;if(qn(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(qn(n))return n}catch{}let t=Yn(e);return t===void 0?void 0:Ut(t)}}function Yn(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${Bt}/${r}`,o,a)}var lt;function Jn(e){let t=e.locale.bind(_e);lt?.();let n=e.locale.register(_e,{zh:Ht,en:Dt});lt=n;let r=wn(typeof document>"u"?void 0:document),o=Wt(e),a=Xn(e),s=an({store:Xt(a),t});e.slots.inject(gt,()=>e.slots.register({name:gt,id:$t,order:30,locale:_e},s));let i=e.workbench;if(i!=null){let f=jn({workbench:i,version:i.version,t,remote:a});e.slots.inject(pt,()=>e.slots.register({name:pt,id:ze,order:110,label:()=>t("tab.label"),locale:_e},f))}return()=>{r(),o(),n(),lt===n&&(lt=void 0)}}var Qn={groupChanges:We,formatCommitDetail:et,createJump:tt,computeWindow:nt},Zn={name:"dsh-git-explorer",inject:Un,apply:Jn,__test:Qn},wo=Zn;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
