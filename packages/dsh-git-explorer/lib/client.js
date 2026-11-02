window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Be=Object.defineProperty;var _t=Object.getOwnPropertyDescriptor;var qt=Object.getOwnPropertyNames;var Vt=Object.prototype.hasOwnProperty;var jt=(e,t)=>{for(var n in t)Be(e,n,{get:t[n],enumerable:!0})},Kt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of qt(t))!Vt.call(e,a)&&a!==n&&Be(e,a,{get:()=>t[a],enumerable:!(r=_t(t,a))||r.enumerable});return e};var Ut=e=>Kt(Be({},"__esModule",{value:!0}),e);var Tn={};jt(Tn,{__test:()=>zt,apply:()=>Wt,boot:()=>st,clientPlugin:()=>Ot,createRemoteResolver:()=>At,createRpcCall:()=>$t,default:()=>Mn,inject:()=>Ht});module.exports=Ut(Tn);var Xe={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},Ye={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var He="conversation.view",de="git-explorer";var Ae="conversation.session.header.actions",Je="git-branch";var ce="git-explorer",Qe="gitExplorer";var y=require("react");var Ze=Object.freeze([]);function et(e,t){let n=t.trim();if(n==="")return e.map(a=>({branch:a,ranges:Ze}));let r=[];return e.forEach((a,o)=>{let s=Xt(a.name,n);s!==void 0&&r.push({match:{branch:a,ranges:Yt(s)},order:o,run:Jt(s)})}),r.sort((a,o)=>o.run-a.run||a.order-o.order),r.map(a=>a.match)}function $e(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&We(n.branch))return t}return-1}function tt(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return $e(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let a=e[r];if(a!==void 0&&We(a.branch))return r}return t}function nt(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!We(n.branch)))return n.branch}function We(e){return e.worktreePath===void 0}function Xt(e,t){let n=[],r=0;for(let a=0;a<t.length;a+=1){let o=t.charAt(a).toLowerCase(),s=-1;for(let l=r;l<e.length;l+=1)if(e.charAt(l).toLowerCase()===o){s=l;break}if(s===-1)return;n.push(s),r=s+1}return n}function Yt(e){let t=e[0];if(t===void 0)return Ze;let n=[],r=t,a=t+1;for(let o=1;o<e.length;o+=1){let s=e[o];if(s!==void 0){if(s===a){a=s+1;continue}n.push([r,a]),r=s,a=s+1}}return n.push([r,a]),n}function Jt(e){let t=0,n=0,r=-2;for(let a of e)n=a===r+1?n+1:1,r=a,n>t&&(t=n);return t}function rt(e){let t=n=>(r,a)=>e(n,{args:{request:r}},a);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch")}}function Y(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function J(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var me="service-unavailable",Qt=Object.freeze({status:"idle",revision:0,sessionId:null}),ze;function Zt(e){let t=Qt,n=-1,r=0,a=new Set,o=i=>{t=i;for(let x of[...a])x()},s=i=>t.sessionId===i&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(i){return a.add(i),()=>{a.delete(i)}},getSnapshot:()=>t,load:async i=>{if(s(i))return;let x=e(),p=++r,u=t.revision,M=t.sessionId===i;o({status:"loading",...M&&t.list!==void 0?{list:t.list}:{},revision:u,sessionId:i});let k=()=>p!==r||t.revision!==u;if(typeof x?.branches!="function"){if(k())return;o({status:"error",error:me,revision:u,sessionId:i});return}try{let S=await x.branches({sessionId:i});if(k())return;let N=Y(S);if(!N.ok){o({status:"error",error:N.message,revision:u,sessionId:i});return}if(N.result.ok===!1){o({status:"error",error:N.result.error.message,revision:u,sessionId:i});return}n=u,o({status:"ready",list:N.result.list,revision:u,sessionId:i})}catch(S){if(k())return;o({status:"error",error:J(S),revision:u,sessionId:i})}},switchTo:async(i,x)=>{let p=()=>t.sessionId!==i,u=e();if(typeof u?.switchBranch!="function")return p()||o({...t,error:me}),{switched:!1};try{let M=await u.switchBranch({sessionId:i,name:x}),k=Y(M),S=k.ok?k.result.ok===!1?k.result.error.message:void 0:k.message;if(S!==void 0)return p()||o({...t,error:S}),{switched:!1};if(p())return{switched:!0};let N=k.ok&&k.result.ok===!0?k.result:void 0,T=N===void 0?x:N.branch,b=t.list;return o({status:b===void 0?t.status:"ready",...b===void 0?{}:{list:{...b,detached:!1,headHash:null,branches:b.branches.map(G=>({...G,current:G.name===T}))}},revision:t.revision+1,sessionId:i}),N===void 0||N.stash===void 0?{switched:!0}:{switched:!0,stash:N.stash}}catch(M){return p()||o({...t,error:J(M)}),{switched:!1}}},bump(){o({...t,revision:t.revision+1})}}}function en(e){return ze=Zt(e),ze}var at=en;function ot(){return ze}var j=require("react"),tn=Object.freeze({}),xe=null,Oe;function st(e){xe=e}function lt(){if(Oe!=null)return Oe;if(xe===null)return tn;let e=it(xe,"@deepseek-ai/dsh-client-ui-primitives"),t=it(xe,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,a=e?.useAnchoredPosition,o=e?.useDismissOnOutsidePointer,s=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof a=="function"?{useAnchoredPosition:a}:{},...typeof o=="function"?{useDismissOnOutsidePointer:o}:{},...typeof s=="function"?{createPortal:s}:{}}}function it(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var dt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},ct=e=>(0,j.createElement)("svg",{...dt,className:e.className},(0,j.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,j.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,j.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,j.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,j.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),ut=e=>(0,j.createElement)("svg",{...dt,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,j.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var w=require("react/jsx-runtime"),pt=320,nn="min(420px, 100vw - 32px)",ht=5,be=8;function rn(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:ht,margin:be})??void 0:an(t,n)}function an(e,t){let[n,r]=(0,y.useState)(void 0);return(0,y.useLayoutEffect)(()=>{if(!e){r(void 0);return}let a=()=>{let o=t.current;if(o===null)return;let s=o.getBoundingClientRect(),l=Math.min(pt,Math.max(160,window.innerWidth-be*2)),h=Math.min(Math.max(s.right-l,be),window.innerWidth-l-be);r({left:h,top:s.bottom+ht,width:l})};return a(),window.addEventListener("scroll",a,!0),window.addEventListener("resize",a),()=>{window.removeEventListener("scroll",a,!0),window.removeEventListener("resize",a)}},[e,t]),n}function on(e,t,n,r,a,o){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,a,o,r?n:void 0);return}sn(t,n,a,o)}function sn(e,t,n,r){(0,y.useEffect)(()=>{if(!n)return;let a=o=>{let s=o.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",a,!0),()=>document.removeEventListener("pointerdown",a,!0)},[n,r,e,t])}function ln(e,t){let n=[],r=0;return t.forEach((a,o)=>{let[s,l]=a;s>r&&n.push((0,w.jsx)("span",{children:e.slice(r,s)},`plain-${o}`)),n.push((0,w.jsx)("span",{className:"gx-branch-match",children:e.slice(s,l)},`hit-${o}`)),r=l}),r<e.length&&n.push((0,w.jsx)("span",{children:e.slice(r)},"tail")),n}function dn(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function cn(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let o=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${o}`)}if(e.untrackedFiles>0){let o=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${o}`)}let a=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[a,...r].join(t("branch.worktreeSep"))}}function gt({store:e,t}){function n({sessionId:r}){let a=(0,y.useSyncExternalStore)(e.subscribe,e.getSnapshot),[o,s]=(0,y.useState)(!1),[l,h]=(0,y.useState)(""),[i,x]=(0,y.useState)(-1),[p,u]=(0,y.useState)(null),[M,k]=(0,y.useState)(null),S=(0,y.useRef)(r);S.current=r;let N=(0,y.useRef)(null),T=(0,y.useRef)(null),b=(0,y.useRef)(null),G=(0,y.useRef)(null),D=(0,y.useRef)(null),K=(0,y.useRef)(!1),P=(0,y.useId)(),B=(0,y.useId)(),F=lt(),oe=F.createPortal!==void 0,pe=F.IconBranch??ct,Me=F.IconChevron??ut,E=a.list,O=E===void 0?void 0:dn(E.root),H=(0,y.useMemo)(()=>et(E?.branches??[],l),[E,l]),A=(0,y.useCallback)(()=>{s(!1),h(""),k(null)},[]),U=(0,y.useCallback)(()=>{K.current=!0,A(),T.current?.focus({preventScroll:!0})},[A]),X=(0,y.useCallback)(()=>{K.current=!0,A()},[A]);(0,y.useEffect)(()=>{A(),u(null),r!==void 0&&e.load(r)},[e,r,A]),(0,y.useLayoutEffect)(()=>{o&&G.current?.focus({preventScroll:!0})},[o]),(0,y.useLayoutEffect)(()=>{if(o||!K.current)return;K.current=!1;let v=document.activeElement;(v===null||v===document.body||v===T.current||N.current?.contains(v)===!0)&&T.current?.focus({preventScroll:!0})},[o]),(0,y.useEffect)(()=>{x($e(H))},[H]),(0,y.useEffect)(()=>{D.current?.scrollIntoView?.({block:"nearest"})},[i,H]),(0,y.useEffect)(()=>{if(!o)return;let v=d=>{d.key!=="Escape"||d.isComposing||(d.preventDefault(),U())};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[o,U]);let ee=rn(F,o,T,b);on(F,N,b,oe,o,X);let Te=()=>{if(o){A();return}s(!0),r!==void 0&&e.load(r)},Pe=()=>{r!==void 0&&e.load(r)},he=async v=>{if(p!==null||v.worktreePath!==void 0)return;if(v.current){U();return}if(r===void 0)return;u(v.name);let d=await e.switchTo(r,v.name);if(S.current===r&&(u(null),!!d.switched)){if(e.load(r),d.stash?.conflict===!0){k(d.stash);return}U()}},ie=()=>{let v=nt(H,i);v!==void 0&&he(v)},se=v=>{if(!(v.metaKey||v.ctrlKey||v.altKey)&&!v.nativeEvent.isComposing){if(v.key==="ArrowDown"||v.key==="ArrowUp"){v.preventDefault();let d=v.key==="ArrowDown"?1:-1;x(c=>tt(H,c,d));return}v.key==="Enter"&&(v.preventDefault(),ie())}};if(r===void 0)return null;let Ge=E?.branches.find(v=>v.current)?.name,ge=E===void 0?t("branch.loading"):E.detached?E.headHash??t("head.detached"):Ge??t("branch.unborn");if(!o&&E?.isRepository!==!0)return null;let I=`${t("head.detached")} ${E?.headHash??""}`.trim(),Q=E?.detached===!0?I:ge,te=E?.isRepository===!0?E.worktree:void 0,$=te===void 0?void 0:cn(te,t),De=t("branch.worktreeSep"),Fe=$===void 0?Q:$.description,Ie=$===void 0||te?.dirty!==!0?`${t("branch.title")}: ${Q}`:`${t("branch.title")}: ${Q}${De}${$.description}`,V=a.error===me?t("state.noService.title"):a.error,W=(0,w.jsxs)("div",{ref:b,id:B,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:pt,maxWidth:nn,...ee},children:[M?.conflict===!0?(0,w.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,w.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),M.message===void 0||M.message===""?null:(0,w.jsx)("span",{className:"gx-branch-warning-detail",children:M.message})]}):null,E===void 0||O===void 0?null:(0,w.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:E.root,children:[(0,w.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,w.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,w.jsx)("span",{className:"gx-branch-scope-parent",children:O.parent}),(0,w.jsx)("span",{className:"gx-branch-scope-name",children:O.name})]})]}),(0,w.jsx)("input",{ref:G,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:l,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":E===void 0?void 0:P,"aria-activedescendant":i>=0&&E!==void 0?`${P}-option-${i}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:v=>h(v.target.value),onKeyDown:se}),V!==void 0?(0,w.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,w.jsx)("span",{className:"gx-branch-error-text",children:V}),(0,w.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:Pe,children:t("action.retry")})]}):null,a.status==="loading"&&E===void 0?(0,w.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,E!==void 0?(0,w.jsxs)("div",{className:"gx-branch-list",id:P,role:"listbox","aria-label":t("branch.title"),children:[E.branches.length===0?(0,w.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,E.branches.length>0&&H.length===0?(0,w.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,H.map((v,d)=>{let c=v.branch,C=d===i;return(0,w.jsxs)("button",{ref:C?D:void 0,type:"button",role:"option",id:`${P}-option-${d}`,"aria-selected":C,"data-active":C?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${c.name}`,"data-current":c.current?"true":void 0,"aria-current":c.current?"true":void 0,title:c.worktreePath===void 0?c.name:`${c.name} ${t("branch.worktree")}: ${c.worktreePath}`,disabled:p!==null||c.worktreePath!==void 0,onClick:()=>{he(c)},children:[(0,w.jsx)("span",{className:"gx-branch-row-name",children:ln(c.name,v.ranges)}),c.current?(0,w.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},c.name)})]}):null]});return(0,w.jsxs)("div",{className:"gx-branch-action",ref:N,children:[(0,w.jsxs)("button",{ref:T,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Ie,"aria-haspopup":"dialog","aria-expanded":o,"aria-controls":o?B:void 0,title:Fe,onClick:Te,children:[(0,w.jsx)(pe,{className:"gx-branch-icon"}),(0,w.jsx)("span",{className:"gx-branch-name",title:Q,children:ge}),$===void 0||te?.dirty!==!0?null:(0,w.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:$.dot?t("branch.worktreeDirty"):void 0,children:[$.additions>0?(0,w.jsxs)("span",{className:"gx-branch-add",children:["+",$.additions]}):null,$.deletions>0?(0,w.jsxs)("span",{className:"gx-branch-del",children:["\u2212",$.deletions]}):null,$.dot?(0,w.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,w.jsx)(Me,{className:"gx-branch-chevron"})]}),o?F.createPortal===void 0?W:F.createPortal(W,document.body):null]})}return n}var un={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function ye(e){return un[e]}var ft={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function pn(e,t){return(ft[e]??0)>=(ft[t]??0)?e:t}function mt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function _e(e,t){let n=0;for(let r=0;r<t;r+=1){let a=e.indexOf(" ",n);if(a<0)return"";n=a+1}return e.slice(n)}function hn(e){let t=e.split("\0"),n=new Map,r=a=>{let o=n.get(a.path);if(o===void 0){n.set(a.path,a);return}n.set(a.path,{...o,status:pn(o.status,a.status),staged:o.staged||a.staged,isDirectory:o.isDirectory||a.isDirectory,...o.origPath===void 0&&a.origPath===void 0?{}:{origPath:o.origPath??a.origPath}})};for(let a=0;a<t.length;a+=1){let o=t[a];if(o===void 0||o===""||o.startsWith("#"))continue;let s=o[0];if(s==="1"){let l=o.slice(2),h=l.slice(0,2),i=_e(l,7);i!==""&&r({path:i,status:mt(h),staged:h[0]!==".",isDirectory:!1})}else if(s==="2"){let l=o.slice(2),h=l.slice(0,2),i=_e(l,8),x=t[a+1]??"";i!==""&&x!==""&&(a+=1,r({path:i,status:mt(h),staged:h[0]!==".",isDirectory:!1,origPath:x}))}else if(s==="u"){let l=o.slice(2),h=_e(l,9);h!==""&&r({path:h,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let l=o.slice(2);if(l==="")continue;let h=l.endsWith("/");r({path:h?l.slice(0,-1):l,status:"untracked",staged:!1,isDirectory:h})}}return[...n.values()]}function gn(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function qe(e){let t=new Map;for(let n of e){let r=gn(n.path),a=t.get(r);a===void 0?t.set(r,[n]):a.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((a,o)=>a.path.localeCompare(o.path))}))}function ve(e){return qe(hn(e))}function Ve(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let a=Math.floor(r/60);if(a<24)return`${a}h`;let o=Math.floor(a/24);if(o<7)return`${o}d`;let s=Math.floor(o/7);if(s<5)return`${s}w`;let l=Math.floor(o/30);return l<12?`${l}mo`:`${Math.floor(o/365)}y`}function we(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:Ve(e.time,t)}}function ke({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let a=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),o=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${a}:${o}`)}}var fn=/^commit:([0-9a-f]{4,64})$/iu;function xt(e){if(e===void 0)return;let t=fn.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function Se(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),a=Math.max(0,Math.trunc(t.overscan??6)),o=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-o-a*2),l=Math.floor(Math.max(0,t.scrollTop)/n)-a,h=Math.min(Math.max(l,0),s),i=Math.min(e.length,h+o+a*2);return{rows:e.slice(h,i),startIndex:h,endIndex:i}}function bt(e){let t=[],n=[],r=[],a=0,o=[],s=()=>r.length===0?a++:(r.sort((x,p)=>x-p),r.shift()??a++),l=i=>{i!==null&&!r.includes(i)&&r.push(i)},h=()=>{let i=t.indexOf(null);return i>=0?i:(t.push(null),n.push(null),t.length-1)};for(let i of e){let x=[...t],p=[...n],u=x.indexOf(i.hash),M=u>=0;M||(u=h());let k=M?n[u]??null:null;k===null&&(k=s(),n[u]=k);for(let b=0;b<x.length;b+=1)b!==u&&x[b]===i.hash&&(l(n[b]??null),t[b]=null,n[b]=null);let S=i.parents[0];S===void 0?(l(n[u]??null),t[u]=null,n[u]=null):(t[u]=S,n[u]=k);let N=[];for(let b=1;b<i.parents.length;b+=1){let G=i.parents[b];if(G===void 0)continue;let D=t.indexOf(G);D<0&&(D=h(),t[D]=G),n[D]===null&&(n[D]=s()),N.push(D)}let T=[];for(let b=0;b<x.length;b+=1){let G=x[b];if(G===null)continue;let D=p[b]??k;G===i.hash?T.push({kind:"into",from:b,to:u,color:D}):T.push({kind:"pass",from:b,to:b,color:D})}S!==void 0&&T.push({kind:"out",from:u,to:u,color:n[u]??k});for(let b of N)T.push({kind:"out",from:u,to:b,color:n[b]??k});for(o.push({lane:u,color:k,merge:i.parents.length>=2,segments:T});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return o}function yt(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,a)=>Math.max(r,a.from,a.to),0));return t+1}function ae(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var vt="dsh-git-explorer-styles",mn=`
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
`;function wt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${vt}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=vt,n.textContent=mn,e.head.appendChild(n),()=>{n.remove()}}var m=require("react");var Re=require("react");var L=require("react/jsx-runtime");function xn(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function bn({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,L.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,L.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function kt({groups:e,stats:t,t:n,onOpen:r,claimFocus:a,onFocusClaimed:o}){let s=e.reduce((h,i)=>h+i.files.length,0),l=(0,Re.useRef)(null);return(0,Re.useEffect)(()=>{a&&(o(),xn(l.current))},[a,o]),(0,L.jsxs)("section",{ref:l,className:"gx-pane","data-testid":"git-changes",children:[(0,L.jsxs)("header",{className:"gx-pane-head",children:[(0,L.jsx)("span",{children:n("changes.title")}),(0,L.jsx)("span",{className:"gx-count",children:s})]}),(0,L.jsx)("div",{className:"gx-scroll",children:s===0?(0,L.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,L.jsx)("strong",{children:n("changes.empty")})}):e.map(h=>(0,L.jsxs)("div",{children:[(0,L.jsxs)("div",{className:"gx-group-head",children:[(0,L.jsx)("span",{className:"gx-group-dir",children:h.dir===""?n("changes.root"):h.dir}),(0,L.jsx)("span",{className:"gx-count",children:h.files.length})]}),h.files.map(i=>{let x=t.get(i.path),p=n(`status.${i.status}`);return(0,L.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${p} \xB7 ${n("changes.directory")}`:`${p} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,L.jsx)("span",{className:"gx-badge","data-status":i.status,children:ye(i.status)}),(0,L.jsxs)("span",{className:"gx-file-name",children:[ae(i.path),i.origPath===void 0?null:(0,L.jsx)("span",{className:"gx-file-orig",children:ae(i.origPath)})]}),(0,L.jsx)("span",{className:"gx-file-stats",children:(0,L.jsx)(bn,{stat:x})})]},i.path)})]},h.dir===""?".":h.dir))})]})}var Z=require("react");var g=require("react/jsx-runtime");function yn({additions:e,deletions:t}){return e===null&&t===null?(0,g.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,g.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function St({sessionId:e,hash:t,remote:n,t:r,onSelect:a}){let[o,s]=(0,Z.useState)({kind:"idle"}),[l,h]=(0,Z.useState)(0),i=(0,Z.useRef)(new Map);(0,Z.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let p=i.current.get(t);if(p!==void 0){s({kind:"ready",detail:p});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let u=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(M=>{if(!u)return;let k=Y(M);if(!k.ok){s({kind:"failed",message:k.message});return}let S=k.result;S.ok?(i.current.set(t,S.detail),s({kind:"ready",detail:S.detail})):s({kind:"failed",message:S.error.message===""?S.error.code:S.error.message})}).catch(M=>{u&&s({kind:"failed",message:J(M)})}),()=>{u=!1}},[t,n,e,l,r]);let x=we(o.kind==="ready"?o.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,g.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,g.jsxs)("header",{className:"gx-detail-head",children:[(0,g.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,g.jsx)("span",{className:"gx-hash",children:x.shortHash}),(0,g.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,g.jsx)("div",{className:"gx-detail-body",children:o.kind==="idle"?(0,g.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):o.kind==="loading"?(0,g.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):o.kind==="failed"?(0,g.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,g.jsx)("strong",{children:r("detail.failed")}),(0,g.jsx)("span",{children:o.message}),(0,g.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>h(p=>p+1),children:r("action.retry")})]}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("div",{className:"gx-detail-subject",children:o.detail.subject}),(0,g.jsxs)("div",{className:"gx-detail-meta",children:[(0,g.jsx)("span",{className:"gx-author",children:o.detail.author}),(0,g.jsx)("span",{children:x.relative}),(0,g.jsx)("span",{title:new Date(o.detail.time*1e3).toLocaleString(),children:new Date(o.detail.time*1e3).toLocaleDateString()})]}),(0,g.jsxs)("div",{className:"gx-parents",children:[(0,g.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),o.detail.parents.length===0?(0,g.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):o.detail.parents.map(p=>(0,g.jsx)("button",{type:"button",className:"gx-parent",title:p,onClick:()=>a(p),children:p.slice(0,7)},p))]}),o.detail.body===""?null:(0,g.jsx)("pre",{className:"gx-body-text",children:o.detail.body}),(0,g.jsxs)("div",{className:"gx-detail-files",children:[(0,g.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(o.detail.files.length)}`}),o.detail.files.length===0?(0,g.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):qe(o.detail.files).map(p=>(0,g.jsxs)("div",{className:"gx-detail-group",children:[(0,g.jsx)("div",{className:"gx-detail-dir",children:p.dir===""?r("changes.root"):p.dir}),p.files.map(u=>(0,g.jsxs)("div",{className:"gx-detail-file",children:[(0,g.jsx)("span",{className:"gx-badge","data-status":u.status,children:ye(u.status)}),(0,g.jsxs)("span",{className:"gx-file-name",children:[ae(u.path),u.origPath===void 0?null:(0,g.jsx)("span",{className:"gx-file-orig",children:ae(u.origPath)})]}),(0,g.jsx)("span",{className:"gx-file-stats",children:(0,g.jsx)(yn,{additions:u.additions,deletions:u.deletions})})]},u.path))]},p.dir===""?".":p.dir))]})]})})]})}var q=require("react");var ue=require("react/jsx-runtime");function Rt(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Ct({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),a=r/Math.max(1,t),o=h=>h*a+a/2,s=n/2,l=e.segments.map((h,i)=>{let x=o(h.from),p=o(h.to),u=h.kind==="pass"?`M ${String(x)} 0 L ${String(p)} ${String(n)}`:h.kind==="into"?`M ${String(x)} 0 C ${String(x)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(s)}`:`M ${String(x)} ${String(s)} C ${String(x)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(n)}`;return(0,ue.jsx)("path",{d:u,fill:"none",stroke:Rt(h.color),strokeWidth:1.4,strokeLinecap:"round"},`${h.kind}-${String(h.from)}-${String(h.to)}-${String(i)}`)});return(0,ue.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[l,(0,ue.jsx)("circle",{cx:o(e.lane),cy:s,r:e.merge?4:3.2,fill:Rt(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var R=require("react/jsx-runtime"),Ce=24,Lt=100;function vn({commit:e,row:t,laneCount:n,top:r,selected:a,head:o,onSelect:s}){return(0,R.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":a?"true":"false","data-head":o?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,R.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,R.jsx)(Ct,{row:t,laneCount:n,height:Ce}),(0,R.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,R.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(l=>(0,R.jsxs)("span",{className:"gx-ref","data-kind":l.kind,children:[(0,R.jsx)("span",{className:"gx-ref-name",children:l.name}),(0,R.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:l.name})]},`${l.kind}:${l.name}`)),(0,R.jsx)("span",{className:"gx-author",children:e.author}),(0,R.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:Ve(e.time)})]})}function Et(e){let{commits:t,graph:n,selectedHash:r,headHash:a,total:o,hasMore:s,loadingMore:l,loadError:h,t:i,onSelect:x,onLoadMore:p}=e,u=(0,q.useRef)(null),[M,k]=(0,q.useState)(0),[S,N]=(0,q.useState)(0),T=(0,q.useRef)(!1);(0,q.useEffect)(()=>{let P=u.current;if(P===null)return;let B=()=>N(P.clientHeight);if(B(),typeof ResizeObserver>"u")return;let F=new ResizeObserver(B);return F.observe(P),()=>F.disconnect()},[]),(0,q.useEffect)(()=>{l||(T.current=!1)},[l]);let b=(0,q.useCallback)(()=>{!s||l||T.current||(T.current=!0,p())},[s,l,p]),G=P=>{let B=P.currentTarget;k(B.scrollTop),B.scrollTop+B.clientHeight>=B.scrollHeight-160&&b()},D=Se(t,{scrollTop:M,height:S===0?480:S,rowHeight:Ce}),K=Math.max(1,yt(n));return(0,R.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,R.jsxs)("header",{className:"gx-pane-head",children:[(0,R.jsx)("span",{children:i("history.title")}),(0,R.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(o)}`})]}),t.length===0?(0,R.jsxs)("div",{className:"gx-empty",children:[(0,R.jsx)("strong",{children:e.emptyTitle??i("history.empty")}),e.emptyDescription===void 0?null:(0,R.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,R.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??i("action.retry")})]}):(0,R.jsx)("div",{className:"gx-scroll",ref:u,onScroll:G,"data-testid":"git-history-scroll",children:(0,R.jsx)("div",{className:"gx-vlist",style:{height:t.length*Ce},children:D.rows.map((P,B)=>{let F=D.startIndex+B;return(0,R.jsx)(vn,{commit:P,row:n[F],laneCount:K,top:F*Ce,selected:P.hash===r,head:P.hash===a,onSelect:x},P.hash)})})}),(0,R.jsxs)("footer",{className:"gx-loadbar",children:[(0,R.jsx)("span",{children:`${i("history.loaded")} ${String(t.length)}`}),h===void 0?null:(0,R.jsx)("span",{className:"gx-del",children:h}),(0,R.jsx)("span",{className:"gx-spacer"}),s?(0,R.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:l,onClick:b,children:i(l?"history.loading":"history.loadMore")}):(0,R.jsx)("span",{children:t.length===0?"":i("history.noMore")})]})]})}var je="git-explorer.leftColumnWidth";function Ke(e){return Math.min(560,Math.max(240,e))}function Mt(e){if(e==null)return null;let t;try{t=e.getItem(je)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function Le(e,t){let n=Math.round(Ke(t));if(e!=null)try{e.setItem(je,String(n))}catch{}return n}function Tt(e){if(e!=null)try{e.removeItem(je)}catch{}}function Pt(e,t){return Math.round(e)===Math.round(t)}var Nt=16;function Gt(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Nt};case"ArrowRight":return{kind:"nudge",delta:Nt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var f=require("react/jsx-runtime");function wn(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Ft(e,t){let n=xt(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function kn(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var Sn={display:"flex",alignItems:"center",gap:8};function Rn(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Cn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function Ee({title:e,description:t,actionLabel:n,onAction:r}){return(0,f.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,f.jsx)("strong",{children:e}),t===void 0?null:(0,f.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Ln(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function It(e){let{workbench:t,version:n,t:r,remote:a}=e;function o(s){let l=s.sessionId??t.currentSessionId(),h=(0,m.useRef)(l);h.current=l;let i=(0,m.useMemo)(()=>a(),[a]),[x]=(0,m.useState)(ot),[p,u]=(0,m.useState)(()=>({kind:wn(l,i!==void 0)})),[M,k]=(0,m.useState)(0),[S,N]=(0,m.useState)([]),[T,b]=(0,m.useState)(!1),[G,D]=(0,m.useState)(!1),[K,P]=(0,m.useState)(void 0),[B,F]=(0,m.useState)(void 0),oe=(0,m.useRef)(void 0),pe=(0,m.useRef)(void 0),[Me,E]=(0,m.useState)(!0),O=(0,m.useMemo)(()=>Rn(),[]),[H,A]=(0,m.useState)(()=>Mt(O)),U=(0,m.useRef)(null),X=(0,m.useRef)(null),ee=(0,m.useCallback)(d=>{oe.current=d,F(d),E(!1)},[]),Te=(0,m.useCallback)(()=>{E(!1)},[]),Pe=(0,m.useCallback)(d=>{if(d.button!==0||X.current!==null||Cn())return;let c=U.current?.previousElementSibling;if(c instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}X.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:c.getBoundingClientRect().width,restWidth:H},document.body.classList.add("gx-pane-resizing")}},[H]),he=(0,m.useCallback)(d=>{let c=X.current;c===null||c.pointerId!==d.pointerId||A(Ke(c.baseWidth+d.clientX-c.startX))},[]),ie=(0,m.useCallback)(d=>{let c=X.current;if(c===null||c.pointerId!==d.pointerId)return;X.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let C=c.baseWidth+d.clientX-c.startX;if(Pt(C,c.baseWidth)){A(c.restWidth);return}A(Le(O,C))},[O]),se=(0,m.useCallback)(()=>{Tt(O),A(null)},[O]),Ge=(0,m.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let c=Gt(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(c===null)return;if(d.preventDefault(),d.stopPropagation(),c.kind==="reset"){se();return}if(c.kind==="min"||c.kind==="max"){let _=c.kind==="min"?240:560;A(Le(O,_));return}let C=U.current?.previousElementSibling,z=C instanceof HTMLElement?C.getBoundingClientRect().width:H??240;A(Le(O,z+c.delta))},[O,se,H]);(0,m.useEffect)(()=>()=>{X.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,m.useEffect)(()=>{if(l===void 0||s.openView===void 0)return;let d=t.views;if(d?.bind!==void 0)return d.bind(l,s.openView)},[l,s.openView,t]),(0,m.useEffect)(()=>{if(l===void 0){u({kind:"idle"});return}if(i===void 0){u({kind:"no-service"});return}let d=!0;return u({kind:"loading"}),P(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:l})).then(c=>{if(!d)return;let C=Y(c);if(!C.ok){u({kind:"failed",message:C.message});return}let z=C.result;if(!z.ok){u({kind:"failed",message:z.error.message===""?z.error.code:z.error.message});return}let _=z.snapshot;u({kind:"ready",snapshot:_}),N(_.commits),b(_.commits.length<_.counts.commits);let ne=oe.current;oe.current=void 0,F(le=>ne!==void 0?ne:le!==void 0&&_.commits.some(fe=>fe.hash===le)?le:_.commits[0]?.hash)}).catch(c=>{d&&u({kind:"failed",message:J(c)})}),()=>{d=!1}},[l,i,M]),(0,m.useEffect)(()=>{let d=s.viewRequest;if(d==null||d.view!==de)return;let c=`${d.view}:${d.focus}`;pe.current!==c&&(pe.current=c,Ft(d.focus,{select:ee,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,ee]),(0,m.useEffect)(()=>{let d=t.viewFocus;if(d===void 0||l===void 0)return;let c=()=>{let C=d.take(de);C!==void 0&&Ft(C,{select:ee})};return c(),d.subscribe(c)},[t,l,ee]);let ge=(0,m.useMemo)(()=>bt(S),[S]),I=p.kind==="ready"?p.snapshot:void 0,Q=(0,m.useMemo)(()=>I===void 0?[]:ve(I.status),[I]),te=(0,m.useMemo)(()=>{let d=new Map;for(let c of I?.stats??[])d.set(c.path,{additions:c.additions,deletions:c.deletions});return d},[I]),$=(0,m.useMemo)(()=>{let d=new Map;for(let c of I?.branches??[]){let C=d.get(c.hash);C===void 0?d.set(c.hash,[{kind:c.kind,name:c.name,head:c.head}]):C.push({kind:c.kind,name:c.name,head:c.head})}return d},[I]),De=(0,m.useCallback)(()=>{if(l===void 0||i===void 0||!T||G)return;let d=l;D(!0),P(void 0),Promise.resolve().then(()=>i.query({sessionId:l,skip:S.length,limit:Lt})).then(c=>{if(h.current!==d)return;let C=Y(c);if(!C.ok){P(C.message);return}let z=C.result;if(!z.ok){P(z.error.message===""?z.error.code:z.error.message);return}let _=z.page;N(ne=>{let le=new Set(ne.map(re=>re.hash)),fe=_.commits.filter(re=>!le.has(re.hash)).map(re=>({...re,refs:$.get(re.hash)??[]}));return fe.length===0?ne:[...ne,...fe]}),b(_.hasMore)}).catch(c=>P(J(c))).finally(()=>D(!1))},[l,i,T,G,S.length,$]),Fe=(0,m.useMemo)(()=>{let d=t.views??{open:(c,C)=>t.openView?.(c,C)??!1};return ke({views:d,sessionId:l??""})},[t,l]),Ie=(d,c=1)=>{l!==void 0&&Fe(d,c)},V=(0,m.useCallback)(()=>k(d=>d+1),[]);(0,m.useEffect)(()=>kn(x,V),[x,V]);let W=I?.head,v=Q.reduce((d,c)=>d+c.files.length,0);return(0,f.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":p.kind,"data-session":l??"","data-testid":"git-explorer-view",children:[(0,f.jsxs)("header",{className:"gx-head",children:[(0,f.jsxs)("div",{className:"gx-head-main",children:[(0,f.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,f.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,f.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,f.jsx)("span",{className:"gx-repo",title:I?.root??r("view.title"),children:I===void 0?r("view.title"):Ln(I.root)}),W?.branch===null||W?.branch===void 0?null:(0,f.jsx)("span",{className:"gx-branch",children:W.branch}),W?.detached===!0?(0,f.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,W?.ahead!==void 0&&W.ahead>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(W.ahead)}`}):null,W?.behind!==void 0&&W.behind>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(W.behind)}`}):null]}),(0,f.jsxs)("div",{className:"gx-head-meta",style:Sn,children:[I===void 0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("span",{children:[r("head.changes")," ",(0,f.jsx)("b",{children:v})]}),(0,f.jsxs)("span",{children:[r("head.commits")," ",(0,f.jsx)("b",{children:I.counts.commits})]}),(0,f.jsxs)("span",{children:[r("head.branches")," ",(0,f.jsx)("b",{children:I.counts.branches})]})]}),(0,f.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:p.kind==="loading",onClick:V,children:"\u21BB"})]})]}),l===void 0?(0,f.jsx)(Ee,{title:r("state.noSession.title"),description:r("state.noSession.description")}):p.kind==="no-service"?(0,f.jsx)(Ee,{title:r("state.noService.title"),description:r("state.noService.description")}):p.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):p.kind==="failed"?(0,f.jsx)(Ee,{title:r("state.failed.title"),description:p.message,actionLabel:r("action.retry"),onAction:V}):p.kind==="ready"&&!p.snapshot.isRepository?(0,f.jsx)(Ee,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:V}):p.kind==="ready"?(0,f.jsxs)("div",{className:"gx-body",style:H===null?void 0:{"--gx-left-col":`${H}px`},children:[(0,f.jsx)(kt,{groups:Q,stats:te,t:r,onOpen:Ie,claimFocus:Me,onFocusClaimed:Te}),(0,f.jsx)("div",{ref:U,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":H??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Pe,onPointerMove:he,onPointerUp:ie,onPointerCancel:ie,onLostPointerCapture:ie,onKeyDown:Ge,onDoubleClick:se}),(0,f.jsxs)("div",{className:"gx-col",children:[(0,f.jsx)(Et,{commits:S,graph:ge,selectedHash:B,headHash:p.snapshot.head?.hash??null,total:p.snapshot.counts.commits,hasMore:T,loadingMore:G,loadError:K,t:r,onSelect:F,onLoadMore:De,...p.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:V,retryLabel:r("action.retry")}:{}}),(0,f.jsx)(St,{sessionId:l,hash:B,remote:i,t:r,onSelect:F})]})]}):null]})}return o}var Ht=["slots","locale","workbench","remote"];function Bt(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function At(e){return()=>{try{let n=e.remote?.gitExplorer;if(Bt(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Bt(n))return n}catch{}let t=$t(e);return t===void 0?void 0:rt(t)}}function $t(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,a,o)=>n.call("/api",`${Qe}/${r}`,a,o)}var Ne;function Wt(e){let t=e.locale.bind(ce);Ne?.();let n=e.locale.register(ce,{zh:Xe,en:Ye});Ne=n;let r=wt(typeof document>"u"?void 0:document),a=At(e),o=gt({store:at(a),t});e.slots.inject(Ae,()=>e.slots.register({name:Ae,id:Je,order:30,locale:ce},o));let s=e.workbench;if(s!=null){let l=It({workbench:s,version:s.version,t,remote:a});e.slots.inject(He,()=>e.slots.register({name:He,id:de,order:110,label:()=>t("tab.label"),locale:ce},l))}return()=>{r(),n(),Ne===n&&(Ne=void 0)}}var zt={groupChanges:ve,formatCommitDetail:we,createJump:ke,computeWindow:Se},Ot={name:"dsh-git-explorer",inject:Ht,apply:Wt,__test:zt},Mn=Ot;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
