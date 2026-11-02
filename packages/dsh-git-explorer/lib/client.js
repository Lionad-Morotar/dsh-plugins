window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Pe=Object.defineProperty;var _t=Object.getOwnPropertyDescriptor;var $t=Object.getOwnPropertyNames;var Ot=Object.prototype.hasOwnProperty;var qt=(t,e)=>{for(var n in e)Pe(t,n,{get:e[n],enumerable:!0})},Vt=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of $t(e))!Ot.call(t,o)&&o!==n&&Pe(t,o,{get:()=>e[o],enumerable:!(r=_t(e,o))||r.enumerable});return t};var jt=t=>Vt(Pe({},"__esModule",{value:!0}),t);var Rn={};qt(Rn,{__test:()=>It,apply:()=>Dt,boot:()=>et,clientPlugin:()=>Ht,createRemoteResolver:()=>Pt,createRpcCall:()=>Gt,default:()=>kn,inject:()=>Tt});module.exports=jt(Rn);var Oe={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.search":"\u641C\u7D22\u5206\u652F","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},qe={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.search":"Search branches","branch.noMatch":"No matching branch","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var Ge="conversation.view",le="git-explorer";var De="conversation.session.header.actions",Ve="git-branch";var de="git-explorer",je="gitExplorer";var v=require("react");var Ke=Object.freeze([]);function Ue(t,e){let n=e.trim();if(n==="")return t.map(o=>({branch:o,ranges:Ke}));let r=[];return t.forEach((o,a)=>{let s=Kt(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:Ut(s)},order:a,run:Xt(s)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function Ie(t){for(let e=0;e<t.length;e+=1){let n=t[e];if(n!==void 0&&He(n.branch))return e}return-1}function Xe(t,e,n){if(t.length===0)return-1;if(n===0)return e;if(e<0)return Ie(t);for(let r=e+n;r>=0&&r<t.length;r+=n){let o=t[r];if(o!==void 0&&He(o.branch))return r}return e}function Ye(t,e){if(e<0)return;let n=t[e];if(!(n===void 0||!He(n.branch)))return n.branch}function He(t){return t.worktreePath===void 0}function Kt(t,e){let n=[],r=0;for(let o=0;o<e.length;o+=1){let a=e.charAt(o).toLowerCase(),s=-1;for(let l=r;l<t.length;l+=1)if(t.charAt(l).toLowerCase()===a){s=l;break}if(s===-1)return;n.push(s),r=s+1}return n}function Ut(t){let e=t[0];if(e===void 0)return Ke;let n=[],r=e,o=e+1;for(let a=1;a<t.length;a+=1){let s=t[a];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function Xt(t){let e=0,n=0,r=-2;for(let o of t)n=o===r+1?n+1:1,r=o,n>e&&(e=n);return e}function Je(t){let e=n=>(r,o)=>t(n,{args:{request:r}},o);return{snapshot:e("snapshot"),query:e("query"),commit:e("commit"),branches:e("branches"),switchBranch:e("switchBranch")}}function Y(t){if(t===null||typeof t!="object")return{ok:!1,message:"malformed remote response"};let e=t;if(e.ok!==!0){let r=e.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=e.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:e}}function J(t){if(t instanceof Error)return t.message;if(typeof t=="string")return t;if(t!==null&&typeof t=="object"){let e=t;if(typeof e.message=="string"&&e.message!=="")return e.message;if(typeof e.code=="string")return e.code}return"unknown error"}var he="service-unavailable",Yt=Object.freeze({status:"idle",revision:0,sessionId:null});function Qe(t){let e=Yt,n=-1,r=0,o=new Set,a=i=>{e=i;for(let g of[...o])g()},s=i=>e.sessionId===i&&e.status==="ready"&&e.error===void 0&&e.list!==void 0&&n===e.revision;return{subscribe(i){return o.add(i),()=>{o.delete(i)}},getSnapshot:()=>e,load:async i=>{if(s(i))return;let g=t(),m=++r,u=e.revision,C=e.sessionId===i;a({status:"loading",...C&&e.list!==void 0?{list:e.list}:{},revision:u,sessionId:i});let w=()=>m!==r||e.revision!==u;if(typeof g?.branches!="function"){if(w())return;a({status:"error",error:he,revision:u,sessionId:i});return}try{let R=await g.branches({sessionId:i});if(w())return;let E=Y(R);if(!E.ok){a({status:"error",error:E.message,revision:u,sessionId:i});return}if(E.result.ok===!1){a({status:"error",error:E.result.error.message,revision:u,sessionId:i});return}n=u,a({status:"ready",list:E.result.list,revision:u,sessionId:i})}catch(R){if(w())return;a({status:"error",error:J(R),revision:u,sessionId:i})}},switchTo:async(i,g)=>{let m=t();if(typeof m?.switchBranch!="function")return a({...e,error:he}),!1;try{let u=await m.switchBranch({sessionId:i,name:g}),C=Y(u),w=C.ok?C.result.ok===!1?C.result.error.message:void 0:C.message;if(w!==void 0)return a({...e,error:w}),!1;let R=C.ok&&C.result.ok===!0?C.result.branch:g,E=e.list;return a({status:E===void 0?e.status:"ready",...E===void 0?{}:{list:{...E,detached:!1,headHash:null,branches:E.branches.map(T=>({...T,current:T.name===R}))}},revision:e.revision+1,sessionId:i}),!0}catch(u){return a({...e,error:J(u)}),!1}},bump(){a({...e,revision:e.revision+1})}}}var K=require("react"),Jt=Object.freeze({}),me=null,Ae;function et(t){me=t}function tt(){if(Ae!=null)return Ae;if(me===null)return Jt;let t=Ze(me,"@deepseek-ai/dsh-client-ui-primitives"),e=Ze(me,"react-dom"),n=t?.IconBranchOutlineRegular,r=t?.IconChevronDownOutlineRegular,o=t?.useAnchoredPosition,a=t?.useDismissOnOutsidePointer,s=e?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof s=="function"?{createPortal:s}:{}}}function Ze(t,e){try{let n=t(e);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var nt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},rt=t=>(0,K.createElement)("svg",{...nt,className:t.className},(0,K.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,K.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,K.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,K.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,K.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),ot=t=>(0,K.createElement)("svg",{...nt,width:12,height:12,viewBox:"0 0 12 12",className:t.className},(0,K.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var L=require("react/jsx-runtime"),at=320,Qt="min(420px, 100vw - 32px)",it=5,fe=8;function Zt(t,e,n,r){return t.useAnchoredPosition!==void 0?t.useAnchoredPosition({open:e,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:it,margin:fe})??void 0:en(e,n)}function en(t,e){let[n,r]=(0,v.useState)(void 0);return(0,v.useLayoutEffect)(()=>{if(!t){r(void 0);return}let o=()=>{let a=e.current;if(a===null)return;let s=a.getBoundingClientRect(),l=Math.min(at,Math.max(160,window.innerWidth-fe*2)),p=Math.min(Math.max(s.right-l,fe),window.innerWidth-l-fe);r({left:p,top:s.bottom+it,width:l})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[t,e]),n}function tn(t,e,n,r,o,a){if(t.useDismissOnOutsidePointer!==void 0){t.useDismissOnOutsidePointer(e,o,a,r?n:void 0);return}nn(e,n,o,a)}function nn(t,e,n,r){(0,v.useEffect)(()=>{if(!n)return;let o=a=>{let s=a.target;s instanceof Node&&t.current?.contains(s)!==!0&&e.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,t,e])}function rn(t,e){let n=[],r=0;return e.forEach((o,a)=>{let[s,l]=o;s>r&&n.push((0,L.jsx)("span",{children:t.slice(r,s)},`plain-${a}`)),n.push((0,L.jsx)("span",{className:"gx-branch-match",children:t.slice(s,l)},`hit-${a}`)),r=l}),r<t.length&&n.push((0,L.jsx)("span",{children:t.slice(r)},"tail")),n}function st({store:t,t:e}){function n({sessionId:r}){let o=(0,v.useSyncExternalStore)(t.subscribe,t.getSnapshot),[a,s]=(0,v.useState)(!1),[l,p]=(0,v.useState)(""),[i,g]=(0,v.useState)(-1),[m,u]=(0,v.useState)(null),C=(0,v.useRef)(null),w=(0,v.useRef)(null),R=(0,v.useRef)(null),E=(0,v.useRef)(null),T=(0,v.useRef)(null),y=(0,v.useRef)(!1),G=(0,v.useId)(),P=(0,v.useId)(),H=tt(),A=H.createPortal!==void 0,D=H.IconBranch??rt,W=H.IconChevron??ot,M=o.list,V=(0,v.useMemo)(()=>Ue(M?.branches??[],l),[M,l]),O=(0,v.useCallback)(()=>{s(!1),p("")},[]),F=(0,v.useCallback)(()=>{y.current=!0,O(),w.current?.focus({preventScroll:!0})},[O]),j=(0,v.useCallback)(()=>{y.current=!0,O()},[O]);(0,v.useEffect)(()=>{O(),u(null),r!==void 0&&t.load(r)},[t,r,O]),(0,v.useLayoutEffect)(()=>{a&&E.current?.focus({preventScroll:!0})},[a]),(0,v.useLayoutEffect)(()=>{if(a||!y.current)return;y.current=!1;let h=document.activeElement;(h===null||h===document.body||h===w.current||C.current?.contains(h)===!0)&&w.current?.focus({preventScroll:!0})},[a]),(0,v.useEffect)(()=>{g(Ie(V))},[V]),(0,v.useEffect)(()=>{T.current?.scrollIntoView?.({block:"nearest"})},[i,V]),(0,v.useEffect)(()=>{if(!a)return;let h=B=>{B.key!=="Escape"||B.isComposing||(B.preventDefault(),F())};return document.addEventListener("keydown",h),()=>document.removeEventListener("keydown",h)},[a,F]);let U=Zt(H,a,w,R);tn(H,C,R,A,a,j);let ie=()=>{if(a){O();return}s(!0),r!==void 0&&t.load(r)},X=()=>{r!==void 0&&t.load(r)},Q=async h=>{if(m!==null||h.worktreePath!==void 0)return;if(h.current){F();return}if(r===void 0)return;u(h.name);let B=await t.switchTo(r,h.name);u(null),B&&F()},Le=()=>{let h=Ye(V,i);h!==void 0&&Q(h)},Ne=h=>{if(!(h.metaKey||h.ctrlKey||h.altKey)&&!h.nativeEvent.isComposing){if(h.key==="ArrowDown"||h.key==="ArrowUp"){h.preventDefault();let B=h.key==="ArrowDown"?1:-1;g(I=>Xe(V,I,B));return}h.key==="Enter"&&(h.preventDefault(),Le())}};if(r===void 0)return null;let Me=M?.branches.find(h=>h.current)?.name,Z=M===void 0?e("branch.loading"):M.detached?M.headHash??e("head.detached"):Me??e("branch.unborn");if(!a&&M?.isRepository!==!0)return null;let te=`${e("head.detached")} ${M?.headHash??""}`.trim(),ue=o.error===he?e("state.noService.title"):o.error,pe=(0,L.jsxs)("div",{ref:R,id:P,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":e("branch.title"),style:{width:at,maxWidth:Qt,...U},children:[(0,L.jsx)("input",{ref:E,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:l,placeholder:e("branch.search"),"aria-label":e("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":M===void 0?void 0:G,"aria-activedescendant":i>=0&&M!==void 0?`${G}-option-${i}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:h=>p(h.target.value),onKeyDown:Ne}),ue!==void 0?(0,L.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,L.jsx)("span",{className:"gx-branch-error-text",children:ue}),(0,L.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:X,children:e("action.retry")})]}):null,o.status==="loading"&&M===void 0?(0,L.jsx)("div",{className:"gx-branch-hint",children:e("branch.loading")}):null,M!==void 0?(0,L.jsxs)("div",{className:"gx-branch-list",id:G,role:"listbox","aria-label":e("branch.title"),children:[M.branches.length===0?(0,L.jsx)("div",{className:"gx-branch-hint",children:e("branch.empty")}):null,M.branches.length>0&&V.length===0?(0,L.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:e("branch.noMatch")}):null,V.map((h,B)=>{let I=h.branch,ne=B===i;return(0,L.jsxs)("button",{ref:ne?T:void 0,type:"button",role:"option",id:`${G}-option-${B}`,"aria-selected":ne,"data-active":ne?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${I.name}`,"data-current":I.current?"true":void 0,"aria-current":I.current?"true":void 0,title:I.worktreePath===void 0?I.name:`${I.name} ${e("branch.worktree")}: ${I.worktreePath}`,disabled:m!==null||I.worktreePath!==void 0,onClick:()=>{Q(I)},children:[(0,L.jsx)("span",{className:"gx-branch-row-name",children:rn(I.name,h.ranges)}),I.current?(0,L.jsx)("span",{className:"gx-branch-tag",children:e("branch.current")}):null]},I.name)})]}):null]});return(0,L.jsxs)("div",{className:"gx-branch-action",ref:C,children:[(0,L.jsxs)("button",{ref:w,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":`${e("branch.title")}: ${M?.detached===!0?te:Z}`,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?P:void 0,title:M?.detached===!0?te:Z,onClick:ie,children:[(0,L.jsx)(D,{className:"gx-branch-icon"}),(0,L.jsx)("span",{className:"gx-branch-name",children:Z}),(0,L.jsx)(W,{className:"gx-branch-chevron"})]}),a?H.createPortal===void 0?pe:H.createPortal(pe,document.body):null]})}return n}var on={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function xe(t){return on[t]}var lt={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function an(t,e){return(lt[t]??0)>=(lt[e]??0)?t:e}function dt(t){if(t==="??")return"untracked";let e=t[0]??".",n=t[1]??".";return e==="U"||n==="U"?"conflicted":e==="R"||n==="R"?"renamed":e==="C"||n==="C"?"copied":e==="A"||n==="A"?"added":e==="D"||n==="D"?"deleted":e==="T"||n==="T"?"typechange":"modified"}function Fe(t,e){let n=0;for(let r=0;r<e;r+=1){let o=t.indexOf(" ",n);if(o<0)return"";n=o+1}return t.slice(n)}function sn(t){let e=t.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:an(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<e.length;o+=1){let a=e[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let l=a.slice(2),p=l.slice(0,2),i=Fe(l,7);i!==""&&r({path:i,status:dt(p),staged:p[0]!==".",isDirectory:!1})}else if(s==="2"){let l=a.slice(2),p=l.slice(0,2),i=Fe(l,8),g=e[o+1]??"";i!==""&&g!==""&&(o+=1,r({path:i,status:dt(p),staged:p[0]!==".",isDirectory:!1,origPath:g}))}else if(s==="u"){let l=a.slice(2),p=Fe(l,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let l=a.slice(2);if(l==="")continue;let p=l.endsWith("/");r({path:p?l.slice(0,-1):l,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function ln(t){let e=t.lastIndexOf("/");return e<0?"":t.slice(0,e)}function Be(t){let e=new Map;for(let n of t){let r=ln(n.path),o=e.get(r);o===void 0?e.set(r,[n]):o.push(n)}return[...e.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function be(t){return Be(sn(t))}function ze(t,e=Date.now()){let n=Math.max(0,Math.floor(e/1e3)-Math.trunc(t));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let l=Math.floor(a/30);return l<12?`${l}mo`:`${Math.floor(a/365)}y`}function ye(t,e=Date.now()){return{shortHash:t.hash.slice(0,7),author:t.author,subject:t.subject,relative:ze(t.time,e)}}function ve({views:t,sessionId:e}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;t.open(e,"fs-explorer",`path:${o}:${a}`)}}var dn=/^commit:([0-9a-f]{4,64})$/iu;function ct(t){if(t===void 0)return;let e=dn.exec(t);return e===null?void 0:{hash:(e[1]??"").toLowerCase()}}function we(t,e){let n=Math.max(1,e.rowHeight||1),r=Math.max(0,e.height||0),o=Math.max(0,Math.trunc(e.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,t.length-a-o*2),l=Math.floor(Math.max(0,e.scrollTop)/n)-o,p=Math.min(Math.max(l,0),s),i=Math.min(t.length,p+a+o*2);return{rows:t.slice(p,i),startIndex:p,endIndex:i}}function ut(t){let e=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((g,m)=>g-m),r.shift()??o++),l=i=>{i!==null&&!r.includes(i)&&r.push(i)},p=()=>{let i=e.indexOf(null);return i>=0?i:(e.push(null),n.push(null),e.length-1)};for(let i of t){let g=[...e],m=[...n],u=g.indexOf(i.hash),C=u>=0;C||(u=p());let w=C?n[u]??null:null;w===null&&(w=s(),n[u]=w);for(let y=0;y<g.length;y+=1)y!==u&&g[y]===i.hash&&(l(n[y]??null),e[y]=null,n[y]=null);let R=i.parents[0];R===void 0?(l(n[u]??null),e[u]=null,n[u]=null):(e[u]=R,n[u]=w);let E=[];for(let y=1;y<i.parents.length;y+=1){let G=i.parents[y];if(G===void 0)continue;let P=e.indexOf(G);P<0&&(P=p(),e[P]=G),n[P]===null&&(n[P]=s()),E.push(P)}let T=[];for(let y=0;y<g.length;y+=1){let G=g[y];if(G===null)continue;let P=m[y]??w;G===i.hash?T.push({kind:"into",from:y,to:u,color:P}):T.push({kind:"pass",from:y,to:y,color:P})}R!==void 0&&T.push({kind:"out",from:u,to:u,color:n[u]??w});for(let y of E)T.push({kind:"out",from:u,to:y,color:n[y]??w});for(a.push({lane:u,color:w,merge:i.parents.length>=2,segments:T});e.length>0&&e[e.length-1]===null;)e.pop(),n.pop()}return a}function pt(t){let e=0;for(let n of t)e=Math.max(e,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return e+1}function ae(t){let e=t.lastIndexOf("/");return e<0?t:t.slice(e+1)}var gt="dsh-git-explorer-styles",cn=`
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
`;function ht(t){if(t===void 0)return()=>{};if(t.querySelector(`style[data-dsh-style="${gt}"]`)!==null)return()=>{};let n=t.createElement("style");return n.dataset.dshStyle=gt,n.textContent=cn,t.head.appendChild(n),()=>{n.remove()}}var b=require("react");var ke=require("react");var S=require("react/jsx-runtime");function un(t){if(t===null)return;let e=t.ownerDocument;if(t.contains(e.activeElement))return;let n=t.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function pn({stat:t}){return t===void 0?null:t.additions===null&&t.deletions===null?(0,S.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"gx-add",children:`+${String(t.additions??0)}`}),(0,S.jsx)("span",{className:"gx-del",children:`-${String(t.deletions??0)}`})]})}function mt({groups:t,stats:e,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let s=t.reduce((p,i)=>p+i.files.length,0),l=(0,ke.useRef)(null);return(0,ke.useEffect)(()=>{o&&(a(),un(l.current))},[o,a]),(0,S.jsxs)("section",{ref:l,className:"gx-pane","data-testid":"git-changes",children:[(0,S.jsxs)("header",{className:"gx-pane-head",children:[(0,S.jsx)("span",{children:n("changes.title")}),(0,S.jsx)("span",{className:"gx-count",children:s})]}),(0,S.jsx)("div",{className:"gx-scroll",children:s===0?(0,S.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,S.jsx)("strong",{children:n("changes.empty")})}):t.map(p=>(0,S.jsxs)("div",{children:[(0,S.jsxs)("div",{className:"gx-group-head",children:[(0,S.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,S.jsx)("span",{className:"gx-count",children:p.files.length})]}),p.files.map(i=>{let g=e.get(i.path),m=n(`status.${i.status}`);return(0,S.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${m} \xB7 ${n("changes.directory")}`:`${m} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,S.jsx)("span",{className:"gx-badge","data-status":i.status,children:xe(i.status)}),(0,S.jsxs)("span",{className:"gx-file-name",children:[ae(i.path),i.origPath===void 0?null:(0,S.jsx)("span",{className:"gx-file-orig",children:ae(i.origPath)})]}),(0,S.jsx)("span",{className:"gx-file-stats",children:(0,S.jsx)(pn,{stat:g})})]},i.path)})]},p.dir===""?".":p.dir))})]})}var ee=require("react");var f=require("react/jsx-runtime");function gn({additions:t,deletions:e}){return t===null&&e===null?(0,f.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("span",{className:"gx-add",children:`+${String(t??0)}`}),(0,f.jsx)("span",{className:"gx-del",children:`-${String(e??0)}`})]})}function ft({sessionId:t,hash:e,remote:n,t:r,onSelect:o}){let[a,s]=(0,ee.useState)({kind:"idle"}),[l,p]=(0,ee.useState)(0),i=(0,ee.useRef)(new Map);(0,ee.useEffect)(()=>{if(e===void 0){s({kind:"idle"});return}let m=i.current.get(e);if(m!==void 0){s({kind:"ready",detail:m});return}if(n===void 0||t===void 0){s({kind:"failed",message:r("state.noService.description")});return}let u=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:t,hash:e})).then(C=>{if(!u)return;let w=Y(C);if(!w.ok){s({kind:"failed",message:w.message});return}let R=w.result;R.ok?(i.current.set(e,R.detail),s({kind:"ready",detail:R.detail})):s({kind:"failed",message:R.error.message===""?R.error.code:R.error.message})}).catch(C=>{u&&s({kind:"failed",message:J(C)})}),()=>{u=!1}},[e,n,t,l,r]);let g=ye(a.kind==="ready"?a.detail:{hash:e??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,f.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,f.jsxs)("header",{className:"gx-detail-head",children:[(0,f.jsx)("span",{children:r("detail.title")}),e===void 0?null:(0,f.jsx)("span",{className:"gx-hash",children:g.shortHash}),(0,f.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,f.jsx)("div",{className:"gx-detail-body",children:a.kind==="idle"?(0,f.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,f.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,f.jsx)("strong",{children:r("detail.failed")}),(0,f.jsx)("span",{children:a.message}),(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>p(m=>m+1),children:r("action.retry")})]}):(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,f.jsxs)("div",{className:"gx-detail-meta",children:[(0,f.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,f.jsx)("span",{children:g.relative}),(0,f.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,f.jsxs)("div",{className:"gx-parents",children:[(0,f.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,f.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(m=>(0,f.jsx)("button",{type:"button",className:"gx-parent",title:m,onClick:()=>o(m),children:m.slice(0,7)},m))]}),a.detail.body===""?null:(0,f.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,f.jsxs)("div",{className:"gx-detail-files",children:[(0,f.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,f.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Be(a.detail.files).map(m=>(0,f.jsxs)("div",{className:"gx-detail-group",children:[(0,f.jsx)("div",{className:"gx-detail-dir",children:m.dir===""?r("changes.root"):m.dir}),m.files.map(u=>(0,f.jsxs)("div",{className:"gx-detail-file",children:[(0,f.jsx)("span",{className:"gx-badge","data-status":u.status,children:xe(u.status)}),(0,f.jsxs)("span",{className:"gx-file-name",children:[ae(u.path),u.origPath===void 0?null:(0,f.jsx)("span",{className:"gx-file-orig",children:ae(u.origPath)})]}),(0,f.jsx)("span",{className:"gx-file-stats",children:(0,f.jsx)(gn,{additions:u.additions,deletions:u.deletions})})]},u.path))]},m.dir===""?".":m.dir))]})]})})]})}var $=require("react");var ce=require("react/jsx-runtime");function xt(t){return`var(--gx-lane-${String(Math.abs(t)%8)})`}function bt({row:t,laneCount:e,height:n}){let r=Math.min(116,Math.max(16,e*12)),o=r/Math.max(1,e),a=p=>p*o+o/2,s=n/2,l=t.segments.map((p,i)=>{let g=a(p.from),m=a(p.to),u=p.kind==="pass"?`M ${String(g)} 0 L ${String(m)} ${String(n)}`:p.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(m)} ${String(n*.45)}, ${String(m)} ${String(s)}`:`M ${String(g)} ${String(s)} C ${String(g)} ${String(n*.55)}, ${String(m)} ${String(n*.45)}, ${String(m)} ${String(n)}`;return(0,ce.jsx)("path",{d:u,fill:"none",stroke:xt(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(i)}`)});return(0,ce.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[l,(0,ce.jsx)("circle",{cx:a(t.lane),cy:s,r:t.merge?4:3.2,fill:xt(t.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var k=require("react/jsx-runtime"),Re=24,yt=100;function hn({commit:t,row:e,laneCount:n,top:r,selected:o,head:a,onSelect:s}){return(0,k.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${t.hash.slice(0,7)} ${t.subject}`,onClick:()=>s(t.hash),children:[e===void 0?(0,k.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,k.jsx)(bt,{row:e,laneCount:n,height:Re}),(0,k.jsx)("span",{className:"gx-hash",children:t.hash.slice(0,7)}),(0,k.jsx)("span",{className:"gx-subject",children:t.subject}),t.refs.slice(0,2).map(l=>(0,k.jsxs)("span",{className:"gx-ref","data-kind":l.kind,children:[(0,k.jsx)("span",{className:"gx-ref-name",children:l.name}),(0,k.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:l.name})]},`${l.kind}:${l.name}`)),(0,k.jsx)("span",{className:"gx-author",children:t.author}),(0,k.jsx)("span",{className:"gx-time",title:new Date(t.time*1e3).toLocaleString(),children:ze(t.time)})]})}function vt(t){let{commits:e,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:l,loadError:p,t:i,onSelect:g,onLoadMore:m}=t,u=(0,$.useRef)(null),[C,w]=(0,$.useState)(0),[R,E]=(0,$.useState)(0),T=(0,$.useRef)(!1);(0,$.useEffect)(()=>{let A=u.current;if(A===null)return;let D=()=>E(A.clientHeight);if(D(),typeof ResizeObserver>"u")return;let W=new ResizeObserver(D);return W.observe(A),()=>W.disconnect()},[]),(0,$.useEffect)(()=>{l||(T.current=!1)},[l]);let y=(0,$.useCallback)(()=>{!s||l||T.current||(T.current=!0,m())},[s,l,m]),G=A=>{let D=A.currentTarget;w(D.scrollTop),D.scrollTop+D.clientHeight>=D.scrollHeight-160&&y()},P=we(e,{scrollTop:C,height:R===0?480:R,rowHeight:Re}),H=Math.max(1,pt(n));return(0,k.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,k.jsxs)("header",{className:"gx-pane-head",children:[(0,k.jsx)("span",{children:i("history.title")}),(0,k.jsx)("span",{className:"gx-count",children:`${String(e.length)} / ${String(a)}`})]}),e.length===0?(0,k.jsxs)("div",{className:"gx-empty",children:[(0,k.jsx)("strong",{children:t.emptyTitle??i("history.empty")}),t.emptyDescription===void 0?null:(0,k.jsx)("span",{children:t.emptyDescription}),t.onRetry===void 0?null:(0,k.jsx)("button",{type:"button",className:"gx-btn",onClick:t.onRetry,children:t.retryLabel??i("action.retry")})]}):(0,k.jsx)("div",{className:"gx-scroll",ref:u,onScroll:G,"data-testid":"git-history-scroll",children:(0,k.jsx)("div",{className:"gx-vlist",style:{height:e.length*Re},children:P.rows.map((A,D)=>{let W=P.startIndex+D;return(0,k.jsx)(hn,{commit:A,row:n[W],laneCount:H,top:W*Re,selected:A.hash===r,head:A.hash===o,onSelect:g},A.hash)})})}),(0,k.jsxs)("footer",{className:"gx-loadbar",children:[(0,k.jsx)("span",{children:`${i("history.loaded")} ${String(e.length)}`}),p===void 0?null:(0,k.jsx)("span",{className:"gx-del",children:p}),(0,k.jsx)("span",{className:"gx-spacer"}),s?(0,k.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:l,onClick:y,children:i(l?"history.loading":"history.loadMore")}):(0,k.jsx)("span",{children:e.length===0?"":i("history.noMore")})]})]})}var We="git-explorer.leftColumnWidth";function _e(t){return Math.min(560,Math.max(240,t))}function kt(t){if(t==null)return null;let e;try{e=t.getItem(We)}catch{return null}if(e===null)return null;let n=Number(e);return!Number.isFinite(n)||n<240||n>560?null:n}function Ce(t,e){let n=Math.round(_e(e));if(t!=null)try{t.setItem(We,String(n))}catch{}return n}function Rt(t){if(t!=null)try{t.removeItem(We)}catch{}}function Ct(t,e){return Math.round(t)===Math.round(e)}var wt=16;function St(t,e){if(e)return null;switch(t){case"ArrowLeft":return{kind:"nudge",delta:-wt};case"ArrowRight":return{kind:"nudge",delta:wt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var x=require("react/jsx-runtime");function mn(t,e){return t===void 0?"idle":e?"loading":"no-service"}function Lt(t,e){let n=ct(t);return n!==void 0&&e.select(n.hash),e.complete?.(),n!==void 0}var fn={display:"flex",alignItems:"center",gap:8};function xn(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var bn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function Se({title:t,description:e,actionLabel:n,onAction:r}){return(0,x.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,x.jsx)("strong",{children:t}),e===void 0?null:(0,x.jsx)("span",{children:e}),n===void 0||r===void 0?null:(0,x.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function yn(t){return t.split(/[\\/]/u).filter(Boolean).at(-1)??t}function Nt(t){let{workbench:e,version:n,t:r,remote:o}=t;function a(s){let l=s.sessionId??e.currentSessionId(),p=(0,b.useRef)(l);p.current=l;let i=(0,b.useMemo)(()=>o(),[o]),[g,m]=(0,b.useState)(()=>({kind:mn(l,i!==void 0)})),[u,C]=(0,b.useState)(0),[w,R]=(0,b.useState)([]),[E,T]=(0,b.useState)(!1),[y,G]=(0,b.useState)(!1),[P,H]=(0,b.useState)(void 0),[A,D]=(0,b.useState)(void 0),W=(0,b.useRef)(void 0),M=(0,b.useRef)(void 0),[V,O]=(0,b.useState)(!0),F=(0,b.useMemo)(()=>xn(),[]),[j,U]=(0,b.useState)(()=>kt(F)),ie=(0,b.useRef)(null),X=(0,b.useRef)(null),Q=(0,b.useCallback)(d=>{W.current=d,D(d),O(!1)},[]),Le=(0,b.useCallback)(()=>{O(!1)},[]),Ne=(0,b.useCallback)(d=>{if(d.button!==0||X.current!==null||bn())return;let c=ie.current?.previousElementSibling;if(c instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}X.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:c.getBoundingClientRect().width,restWidth:j},document.body.classList.add("gx-pane-resizing")}},[j]),Me=(0,b.useCallback)(d=>{let c=X.current;c===null||c.pointerId!==d.pointerId||U(_e(c.baseWidth+d.clientX-c.startX))},[]),Z=(0,b.useCallback)(d=>{let c=X.current;if(c===null||c.pointerId!==d.pointerId)return;X.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let N=c.baseWidth+d.clientX-c.startX;if(Ct(N,c.baseWidth)){U(c.restWidth);return}U(Ce(F,N))},[F]),te=(0,b.useCallback)(()=>{Rt(F),U(null)},[F]),ue=(0,b.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let c=St(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(c===null)return;if(d.preventDefault(),d.stopPropagation(),c.kind==="reset"){te();return}if(c.kind==="min"||c.kind==="max"){let _=c.kind==="min"?240:560;U(Ce(F,_));return}let N=ie.current?.previousElementSibling,z=N instanceof HTMLElement?N.getBoundingClientRect().width:j??240;U(Ce(F,z+c.delta))},[F,te,j]);(0,b.useEffect)(()=>()=>{X.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,b.useEffect)(()=>{if(l===void 0||s.openView===void 0)return;let d=e.views;if(d?.bind!==void 0)return d.bind(l,s.openView)},[l,s.openView,e]),(0,b.useEffect)(()=>{if(l===void 0){m({kind:"idle"});return}if(i===void 0){m({kind:"no-service"});return}let d=!0;return m({kind:"loading"}),H(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:l})).then(c=>{if(!d)return;let N=Y(c);if(!N.ok){m({kind:"failed",message:N.message});return}let z=N.result;if(!z.ok){m({kind:"failed",message:z.error.message===""?z.error.code:z.error.message});return}let _=z.snapshot;m({kind:"ready",snapshot:_}),R(_.commits),T(_.commits.length<_.counts.commits);let re=W.current;W.current=void 0,D(se=>re!==void 0?re:se!==void 0&&_.commits.some(ge=>ge.hash===se)?se:_.commits[0]?.hash)}).catch(c=>{d&&m({kind:"failed",message:J(c)})}),()=>{d=!1}},[l,i,u]),(0,b.useEffect)(()=>{let d=s.viewRequest;if(d==null||d.view!==le)return;let c=`${d.view}:${d.focus}`;M.current!==c&&(M.current=c,Lt(d.focus,{select:Q,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,Q]),(0,b.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||l===void 0)return;let c=()=>{let N=d.take(le);N!==void 0&&Lt(N,{select:Q})};return c(),d.subscribe(c)},[e,l,Q]);let pe=(0,b.useMemo)(()=>ut(w),[w]),h=g.kind==="ready"?g.snapshot:void 0,B=(0,b.useMemo)(()=>h===void 0?[]:be(h.status),[h]),I=(0,b.useMemo)(()=>{let d=new Map;for(let c of h?.stats??[])d.set(c.path,{additions:c.additions,deletions:c.deletions});return d},[h]),ne=(0,b.useMemo)(()=>{let d=new Map;for(let c of h?.branches??[]){let N=d.get(c.hash);N===void 0?d.set(c.hash,[{kind:c.kind,name:c.name,head:c.head}]):N.push({kind:c.kind,name:c.name,head:c.head})}return d},[h]),At=(0,b.useCallback)(()=>{if(l===void 0||i===void 0||!E||y)return;let d=l;G(!0),H(void 0),Promise.resolve().then(()=>i.query({sessionId:l,skip:w.length,limit:yt})).then(c=>{if(p.current!==d)return;let N=Y(c);if(!N.ok){H(N.message);return}let z=N.result;if(!z.ok){H(z.error.message===""?z.error.code:z.error.message);return}let _=z.page;R(re=>{let se=new Set(re.map(oe=>oe.hash)),ge=_.commits.filter(oe=>!se.has(oe.hash)).map(oe=>({...oe,refs:ne.get(oe.hash)??[]}));return ge.length===0?re:[...re,...ge]}),T(_.hasMore)}).catch(c=>H(J(c))).finally(()=>G(!1))},[l,i,E,y,w.length,ne]),Ft=(0,b.useMemo)(()=>{let d=e.views??{open:(c,N)=>e.openView?.(c,N)??!1};return ve({views:d,sessionId:l??""})},[e,l]),Bt=(d,c=1)=>{l!==void 0&&Ft(d,c)},zt=()=>C(d=>d+1),Te=()=>C(d=>d+1),q=h?.head,Wt=B.reduce((d,c)=>d+c.files.length,0);return(0,x.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":l??"","data-testid":"git-explorer-view",children:[(0,x.jsxs)("header",{className:"gx-head",children:[(0,x.jsxs)("div",{className:"gx-head-main",children:[(0,x.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,x.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,x.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,x.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,x.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,x.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,x.jsx)("span",{className:"gx-repo",title:h?.root??r("view.title"),children:h===void 0?r("view.title"):yn(h.root)}),q?.branch===null||q?.branch===void 0?null:(0,x.jsx)("span",{className:"gx-branch",children:q.branch}),q?.detached===!0?(0,x.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,q?.ahead!==void 0&&q.ahead>0?(0,x.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(q.ahead)}`}):null,q?.behind!==void 0&&q.behind>0?(0,x.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(q.behind)}`}):null]}),(0,x.jsxs)("div",{className:"gx-head-meta",style:fn,children:[h===void 0?null:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("span",{children:[r("head.changes")," ",(0,x.jsx)("b",{children:Wt})]}),(0,x.jsxs)("span",{children:[r("head.commits")," ",(0,x.jsx)("b",{children:h.counts.commits})]}),(0,x.jsxs)("span",{children:[r("head.branches")," ",(0,x.jsx)("b",{children:h.counts.branches})]})]}),(0,x.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:zt,children:"\u21BB"})]})]}),l===void 0?(0,x.jsx)(Se,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,x.jsx)(Se,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,x.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,x.jsx)(Se,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:Te}):g.kind==="ready"&&!g.snapshot.isRepository?(0,x.jsx)(Se,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Te}):g.kind==="ready"?(0,x.jsxs)("div",{className:"gx-body",style:j===null?void 0:{"--gx-left-col":`${j}px`},children:[(0,x.jsx)(mt,{groups:B,stats:I,t:r,onOpen:Bt,claimFocus:V,onFocusClaimed:Le}),(0,x.jsx)("div",{ref:ie,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":j??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ne,onPointerMove:Me,onPointerUp:Z,onPointerCancel:Z,onLostPointerCapture:Z,onKeyDown:ue,onDoubleClick:te}),(0,x.jsxs)("div",{className:"gx-col",children:[(0,x.jsx)(vt,{commits:w,graph:pe,selectedHash:A,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:E,loadingMore:y,loadError:P,t:r,onSelect:D,onLoadMore:At,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Te,retryLabel:r("action.retry")}:{}}),(0,x.jsx)(ft,{sessionId:l,hash:A,remote:i,t:r,onSelect:D})]})]}):null]})}return a}var Tt=["slots","locale","workbench","remote"];function Mt(t){if(t===null||typeof t!="object")return!1;let e=t;return typeof e.snapshot=="function"&&typeof e.query=="function"&&typeof e.commit=="function"}function Pt(t){return()=>{try{let n=t.remote?.gitExplorer;if(Mt(n))return n}catch{}try{let n=t.get?.("remote.gitExplorer");if(Mt(n))return n}catch{}let e=Gt(t);return e===void 0?void 0:Je(e)}}function Gt(t){let n=t.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${je}/${r}`,o,a)}var Ee;function Dt(t){let e=t.locale.bind(de);Ee?.();let n=t.locale.register(de,{zh:Oe,en:qe});Ee=n;let r=ht(typeof document>"u"?void 0:document),o=Pt(t),a=st({store:Qe(o),t:e});t.slots.inject(De,()=>t.slots.register({name:De,id:Ve,order:30,locale:de},a));let s=t.workbench;if(s!=null){let l=Nt({workbench:s,version:s.version,t:e,remote:o});t.slots.inject(Ge,()=>t.slots.register({name:Ge,id:le,order:110,label:()=>e("tab.label"),locale:de},l))}return()=>{r(),n(),Ee===n&&(Ee=void 0)}}var It={groupChanges:be,formatCommitDetail:ye,createJump:ve,computeWindow:we},Ht={name:"dsh-git-explorer",inject:Tt,apply:Dt,__test:It},kn=Ht;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
