window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ne=Object.defineProperty;var Wt=Object.getOwnPropertyDescriptor;var _t=Object.getOwnPropertyNames;var Ot=Object.prototype.hasOwnProperty;var $t=(t,e)=>{for(var n in e)Ne(t,n,{get:e[n],enumerable:!0})},qt=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of _t(e))!Ot.call(t,o)&&o!==n&&Ne(t,o,{get:()=>e[o],enumerable:!(r=Wt(e,o))||r.enumerable});return t};var Vt=t=>qt(Ne({},"__esModule",{value:!0}),t);var kn={};$t(kn,{__test:()=>Gt,apply:()=>Pt,boot:()=>Ze,clientPlugin:()=>Dt,createRemoteResolver:()=>Mt,createRpcCall:()=>Tt,default:()=>wn,inject:()=>Nt});module.exports=Vt(kn);var Oe={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.search":"\u641C\u7D22\u5206\u652F","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},$e={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.search":"Search branches","branch.noMatch":"No matching branch","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var Me="conversation.view",ie="git-explorer";var Te="conversation.session.header.actions",qe="git-branch";var se="git-explorer",Ve="gitExplorer";var k=require("react");var je=Object.freeze([]);function Ke(t,e){let n=e.trim();if(n==="")return t.map(o=>({branch:o,ranges:je}));let r=[];return t.forEach((o,a)=>{let s=jt(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:Kt(s)},order:a,run:Ut(s)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function Pe(t){for(let e=0;e<t.length;e+=1){let n=t[e];if(n!==void 0&&Ge(n.branch))return e}return-1}function Ue(t,e,n){if(t.length===0)return-1;if(n===0)return e;if(e<0)return Pe(t);for(let r=e+n;r>=0&&r<t.length;r+=n){let o=t[r];if(o!==void 0&&Ge(o.branch))return r}return e}function Xe(t,e){if(e<0)return;let n=t[e];if(!(n===void 0||!Ge(n.branch)))return n.branch}function Ge(t){return t.worktreePath===void 0}function jt(t,e){let n=[],r=0;for(let o=0;o<e.length;o+=1){let a=e.charAt(o).toLowerCase(),s=-1;for(let l=r;l<t.length;l+=1)if(t.charAt(l).toLowerCase()===a){s=l;break}if(s===-1)return;n.push(s),r=s+1}return n}function Kt(t){let e=t[0];if(e===void 0)return je;let n=[],r=e,o=e+1;for(let a=1;a<t.length;a+=1){let s=t[a];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function Ut(t){let e=0,n=0,r=-2;for(let o of t)n=o===r+1?n+1:1,r=o,n>e&&(e=n);return e}function Ye(t){let e=n=>(r,o)=>t(n,{args:{request:r}},o);return{snapshot:e("snapshot"),query:e("query"),commit:e("commit"),branches:e("branches"),switchBranch:e("switchBranch")}}function X(t){if(t===null||typeof t!="object")return{ok:!1,message:"malformed remote response"};let e=t;if(e.ok!==!0){let r=e.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=e.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:e}}function Y(t){if(t instanceof Error)return t.message;if(typeof t=="string")return t;if(t!==null&&typeof t=="object"){let e=t;if(typeof e.message=="string"&&e.message!=="")return e.message;if(typeof e.code=="string")return e.code}return"unknown error"}var ge="service-unavailable",Xt=Object.freeze({status:"idle",revision:0,sessionId:null});function Je(t){let e=Xt,n=-1,r=0,o=new Set,a=i=>{e=i;for(let g of[...o])g()},s=i=>e.sessionId===i&&e.status==="ready"&&e.error===void 0&&e.list!==void 0&&n===e.revision;return{subscribe(i){return o.add(i),()=>{o.delete(i)}},getSnapshot:()=>e,load:async i=>{if(s(i))return;let g=t(),h=++r,u=e.revision,E=e.sessionId===i;a({status:"loading",...E&&e.list!==void 0?{list:e.list}:{},revision:u,sessionId:i});let v=()=>h!==r||e.revision!==u;if(typeof g?.branches!="function"){if(v())return;a({status:"error",error:ge,revision:u,sessionId:i});return}try{let C=await g.branches({sessionId:i});if(v())return;let L=X(C);if(!L.ok){a({status:"error",error:L.message,revision:u,sessionId:i});return}if(L.result.ok===!1){a({status:"error",error:L.result.error.message,revision:u,sessionId:i});return}n=u,a({status:"ready",list:L.result.list,revision:u,sessionId:i})}catch(C){if(v())return;a({status:"error",error:Y(C),revision:u,sessionId:i})}},switchTo:async(i,g)=>{let h=t();if(typeof h?.switchBranch!="function")return a({...e,error:ge}),!1;try{let u=await h.switchBranch({sessionId:i,name:g}),E=X(u),v=E.ok?E.result.ok===!1?E.result.error.message:void 0:E.message;if(v!==void 0)return a({...e,error:v}),!1;let C=E.ok&&E.result.ok===!0?E.result.branch:g,L=e.list;return a({status:L===void 0?e.status:"ready",...L===void 0?{}:{list:{...L,detached:!1,headHash:null,branches:L.branches.map(P=>({...P,current:P.name===C}))}},revision:e.revision+1,sessionId:i}),!0}catch(u){return a({...e,error:Y(u)}),!1}},bump(){a({...e,revision:e.revision+1})}}}var K=require("react"),Yt=Object.freeze({}),he=null,De;function Ze(t){he=t}function et(){if(De!=null)return De;if(he===null)return Yt;let t=Qe(he,"@deepseek-ai/dsh-client-ui-primitives"),e=Qe(he,"react-dom"),n=t?.IconBranchOutlineRegular,r=t?.IconChevronDownOutlineRegular,o=t?.useAnchoredPosition,a=t?.useDismissOnOutsidePointer,s=e?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof s=="function"?{createPortal:s}:{}}}function Qe(t,e){try{let n=t(e);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var tt={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},nt=t=>(0,K.createElement)("svg",{...tt,className:t.className},(0,K.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,K.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,K.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,K.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,K.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),rt=t=>(0,K.createElement)("svg",{...tt,width:12,height:12,viewBox:"0 0 12 12",className:t.className},(0,K.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var N=require("react/jsx-runtime"),Jt=320,ot=5,me=8;function Qt(t,e,n,r){return t.useAnchoredPosition!==void 0?t.useAnchoredPosition({open:e,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:ot,margin:me})??void 0:Zt(e,n)}function Zt(t,e){let[n,r]=(0,k.useState)(void 0);return(0,k.useLayoutEffect)(()=>{if(!t){r(void 0);return}let o=()=>{let a=e.current;if(a===null)return;let s=a.getBoundingClientRect(),l=Math.min(Jt,Math.max(160,window.innerWidth-me*2)),p=Math.min(Math.max(s.right-l,me),window.innerWidth-l-me);r({left:p,top:s.bottom+ot,width:l})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[t,e]),n}function en(t,e,n,r,o,a){if(t.useDismissOnOutsidePointer!==void 0){t.useDismissOnOutsidePointer(e,o,a,r?n:void 0);return}tn(e,n,o,a)}function tn(t,e,n,r){(0,k.useEffect)(()=>{if(!n)return;let o=a=>{let s=a.target;s instanceof Node&&t.current?.contains(s)!==!0&&e.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,t,e])}function nn(t,e){let n=[],r=0;return e.forEach((o,a)=>{let[s,l]=o;s>r&&n.push((0,N.jsx)("span",{children:t.slice(r,s)},`plain-${a}`)),n.push((0,N.jsx)("span",{className:"gx-branch-match",children:t.slice(s,l)},`hit-${a}`)),r=l}),r<t.length&&n.push((0,N.jsx)("span",{children:t.slice(r)},"tail")),n}function at({store:t,t:e}){function n({sessionId:r}){let o=(0,k.useSyncExternalStore)(t.subscribe,t.getSnapshot),[a,s]=(0,k.useState)(!1),[l,p]=(0,k.useState)(""),[i,g]=(0,k.useState)(-1),[h,u]=(0,k.useState)(null),E=(0,k.useRef)(null),v=(0,k.useRef)(null),C=(0,k.useRef)(null),L=(0,k.useRef)(null),P=(0,k.useRef)(null),b=(0,k.useId)(),T=et(),I=T.createPortal!==void 0,$=T.IconBranch??nt,H=T.IconChevron??rt,w=o.list,D=(0,k.useMemo)(()=>Ke(w?.branches??[],l),[w,l]),q=(0,k.useCallback)(()=>{s(!1),p("")},[]),Q=(0,k.useCallback)(()=>{q(),v.current?.focus()},[q]);(0,k.useEffect)(()=>{q(),u(null),r!==void 0&&t.load(r)},[t,r,q]),(0,k.useEffect)(()=>{a&&L.current?.focus()},[a]),(0,k.useEffect)(()=>{g(Pe(D))},[D]),(0,k.useEffect)(()=>{P.current?.scrollIntoView?.({block:"nearest"})},[i,D]),(0,k.useEffect)(()=>{if(!a)return;let y=_=>{_.key==="Escape"&&Q()};return document.addEventListener("keydown",y),()=>document.removeEventListener("keydown",y)},[a,Q]);let de=Qt(T,a,v,C);en(T,E,C,I,a,q);let W=()=>{if(a){q();return}s(!0),r!==void 0&&t.load(r)},V=()=>{r!==void 0&&t.load(r)},j=async y=>{if(h!==null||y.worktreePath!==void 0)return;if(y.current){Q();return}if(r===void 0)return;u(y.name);let _=await t.switchTo(r,y.name);u(null),_&&Q()},oe=()=>{let y=Xe(D,i);y!==void 0&&j(y)},U=y=>{if(!(y.metaKey||y.ctrlKey||y.altKey)&&!y.nativeEvent.isComposing){if(y.key==="ArrowDown"||y.key==="ArrowUp"){y.preventDefault();let _=y.key==="ArrowDown"?1:-1;g(A=>Ue(D,A,_));return}y.key==="Enter"&&(y.preventDefault(),oe())}};if(r===void 0)return null;let Z=w?.branches.find(y=>y.current)?.name,ce=w===void 0?e("branch.loading"):w.detached?w.headHash??e("head.detached"):Z??e("branch.unborn");if(!a&&w?.isRepository!==!0)return null;let Ee=`${e("head.detached")} ${w?.headHash??""}`.trim(),ue=o.error===ge?e("state.noService.title"):o.error,ee=(0,N.jsxs)("div",{ref:C,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":e("branch.title"),style:de,children:[(0,N.jsx)("input",{ref:L,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:l,placeholder:e("branch.search"),"aria-label":e("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":w===void 0?void 0:b,"aria-activedescendant":i>=0&&w!==void 0?`${b}-option-${i}`:void 0,autoComplete:"off",spellCheck:!1,onChange:y=>p(y.target.value),onKeyDown:U}),ue!==void 0?(0,N.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,N.jsx)("span",{className:"gx-branch-error-text",children:ue}),(0,N.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:V,children:e("action.retry")})]}):null,o.status==="loading"&&w===void 0?(0,N.jsx)("div",{className:"gx-branch-hint",children:e("branch.loading")}):null,w!==void 0?(0,N.jsxs)("div",{className:"gx-branch-list",id:b,role:"listbox","aria-label":e("branch.title"),children:[w.branches.length===0?(0,N.jsx)("div",{className:"gx-branch-hint",children:e("branch.empty")}):null,w.branches.length>0&&D.length===0?(0,N.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:e("branch.noMatch")}):null,D.map((y,_)=>{let A=y.branch,G=_===i;return(0,N.jsxs)("button",{ref:G?P:void 0,type:"button",role:"option",id:`${b}-option-${_}`,"aria-selected":G,"data-active":G?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${A.name}`,"data-current":A.current?"true":void 0,"aria-current":A.current?"true":void 0,title:A.worktreePath===void 0?void 0:`${e("branch.worktree")}: ${A.worktreePath}`,disabled:h!==null||A.worktreePath!==void 0,onClick:()=>{j(A)},children:[(0,N.jsx)("span",{className:"gx-branch-row-name",children:nn(A.name,y.ranges)}),A.current?(0,N.jsx)("span",{className:"gx-branch-tag",children:e("branch.current")}):null]},A.name)})]}):null]});return(0,N.jsxs)("div",{className:"gx-branch-action",ref:E,children:[(0,N.jsxs)("button",{ref:v,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-haspopup":"dialog","aria-expanded":a,title:w?.detached===!0?Ee:ce,onClick:W,children:[(0,N.jsx)($,{className:"gx-branch-icon"}),(0,N.jsx)("span",{className:"gx-branch-name",children:ce}),(0,N.jsx)(H,{className:"gx-branch-chevron"})]}),a?T.createPortal===void 0?ee:T.createPortal(ee,document.body):null]})}return n}var rn={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function fe(t){return rn[t]}var it={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function on(t,e){return(it[t]??0)>=(it[e]??0)?t:e}function st(t){if(t==="??")return"untracked";let e=t[0]??".",n=t[1]??".";return e==="U"||n==="U"?"conflicted":e==="R"||n==="R"?"renamed":e==="C"||n==="C"?"copied":e==="A"||n==="A"?"added":e==="D"||n==="D"?"deleted":e==="T"||n==="T"?"typechange":"modified"}function Ie(t,e){let n=0;for(let r=0;r<e;r+=1){let o=t.indexOf(" ",n);if(o<0)return"";n=o+1}return t.slice(n)}function an(t){let e=t.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:on(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<e.length;o+=1){let a=e[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let l=a.slice(2),p=l.slice(0,2),i=Ie(l,7);i!==""&&r({path:i,status:st(p),staged:p[0]!==".",isDirectory:!1})}else if(s==="2"){let l=a.slice(2),p=l.slice(0,2),i=Ie(l,8),g=e[o+1]??"";i!==""&&g!==""&&(o+=1,r({path:i,status:st(p),staged:p[0]!==".",isDirectory:!1,origPath:g}))}else if(s==="u"){let l=a.slice(2),p=Ie(l,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let l=a.slice(2);if(l==="")continue;let p=l.endsWith("/");r({path:p?l.slice(0,-1):l,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function sn(t){let e=t.lastIndexOf("/");return e<0?"":t.slice(0,e)}function He(t){let e=new Map;for(let n of t){let r=sn(n.path),o=e.get(r);o===void 0?e.set(r,[n]):o.push(n)}return[...e.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function xe(t){return He(an(t))}function Ae(t,e=Date.now()){let n=Math.max(0,Math.floor(e/1e3)-Math.trunc(t));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let l=Math.floor(a/30);return l<12?`${l}mo`:`${Math.floor(a/365)}y`}function be(t,e=Date.now()){return{shortHash:t.hash.slice(0,7),author:t.author,subject:t.subject,relative:Ae(t.time,e)}}function ye({views:t,sessionId:e}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;t.open(e,"fs-explorer",`path:${o}:${a}`)}}var ln=/^commit:([0-9a-f]{4,64})$/iu;function lt(t){if(t===void 0)return;let e=ln.exec(t);return e===null?void 0:{hash:(e[1]??"").toLowerCase()}}function ve(t,e){let n=Math.max(1,e.rowHeight||1),r=Math.max(0,e.height||0),o=Math.max(0,Math.trunc(e.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,t.length-a-o*2),l=Math.floor(Math.max(0,e.scrollTop)/n)-o,p=Math.min(Math.max(l,0),s),i=Math.min(t.length,p+a+o*2);return{rows:t.slice(p,i),startIndex:p,endIndex:i}}function dt(t){let e=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((g,h)=>g-h),r.shift()??o++),l=i=>{i!==null&&!r.includes(i)&&r.push(i)},p=()=>{let i=e.indexOf(null);return i>=0?i:(e.push(null),n.push(null),e.length-1)};for(let i of t){let g=[...e],h=[...n],u=g.indexOf(i.hash),E=u>=0;E||(u=p());let v=E?n[u]??null:null;v===null&&(v=s(),n[u]=v);for(let b=0;b<g.length;b+=1)b!==u&&g[b]===i.hash&&(l(n[b]??null),e[b]=null,n[b]=null);let C=i.parents[0];C===void 0?(l(n[u]??null),e[u]=null,n[u]=null):(e[u]=C,n[u]=v);let L=[];for(let b=1;b<i.parents.length;b+=1){let T=i.parents[b];if(T===void 0)continue;let I=e.indexOf(T);I<0&&(I=p(),e[I]=T),n[I]===null&&(n[I]=s()),L.push(I)}let P=[];for(let b=0;b<g.length;b+=1){let T=g[b];if(T===null)continue;let I=h[b]??v;T===i.hash?P.push({kind:"into",from:b,to:u,color:I}):P.push({kind:"pass",from:b,to:b,color:I})}C!==void 0&&P.push({kind:"out",from:u,to:u,color:n[u]??v});for(let b of L)P.push({kind:"out",from:u,to:b,color:n[b]??v});for(a.push({lane:u,color:v,merge:i.parents.length>=2,segments:P});e.length>0&&e[e.length-1]===null;)e.pop(),n.pop()}return a}function ct(t){let e=0;for(let n of t)e=Math.max(e,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return e+1}function re(t){let e=t.lastIndexOf("/");return e<0?t:t.slice(e+1)}var ut="dsh-git-explorer-styles",dn=`
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
/* The arrow-key cursor outlives the pointer leaving the row, so it reuses the
   hover wash instead of inventing a second selection colour. */
.gx-branch-row[data-active="true"]:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
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
`;function pt(t){if(t===void 0)return()=>{};if(t.querySelector(`style[data-dsh-style="${ut}"]`)!==null)return()=>{};let n=t.createElement("style");return n.dataset.dshStyle=ut,n.textContent=dn,t.head.appendChild(n),()=>{n.remove()}}var x=require("react");var we=require("react");var S=require("react/jsx-runtime");function cn(t){if(t===null)return;let e=t.ownerDocument;if(t.contains(e.activeElement))return;let n=t.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function un({stat:t}){return t===void 0?null:t.additions===null&&t.deletions===null?(0,S.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"gx-add",children:`+${String(t.additions??0)}`}),(0,S.jsx)("span",{className:"gx-del",children:`-${String(t.deletions??0)}`})]})}function gt({groups:t,stats:e,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let s=t.reduce((p,i)=>p+i.files.length,0),l=(0,we.useRef)(null);return(0,we.useEffect)(()=>{o&&(a(),cn(l.current))},[o,a]),(0,S.jsxs)("section",{ref:l,className:"gx-pane","data-testid":"git-changes",children:[(0,S.jsxs)("header",{className:"gx-pane-head",children:[(0,S.jsx)("span",{children:n("changes.title")}),(0,S.jsx)("span",{className:"gx-count",children:s})]}),(0,S.jsx)("div",{className:"gx-scroll",children:s===0?(0,S.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,S.jsx)("strong",{children:n("changes.empty")})}):t.map(p=>(0,S.jsxs)("div",{children:[(0,S.jsxs)("div",{className:"gx-group-head",children:[(0,S.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,S.jsx)("span",{className:"gx-count",children:p.files.length})]}),p.files.map(i=>{let g=e.get(i.path),h=n(`status.${i.status}`);return(0,S.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${h} \xB7 ${n("changes.directory")}`:`${h} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,S.jsx)("span",{className:"gx-badge","data-status":i.status,children:fe(i.status)}),(0,S.jsxs)("span",{className:"gx-file-name",children:[re(i.path),i.origPath===void 0?null:(0,S.jsx)("span",{className:"gx-file-orig",children:re(i.origPath)})]}),(0,S.jsx)("span",{className:"gx-file-stats",children:(0,S.jsx)(un,{stat:g})})]},i.path)})]},p.dir===""?".":p.dir))})]})}var J=require("react");var m=require("react/jsx-runtime");function pn({additions:t,deletions:e}){return t===null&&e===null?(0,m.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("span",{className:"gx-add",children:`+${String(t??0)}`}),(0,m.jsx)("span",{className:"gx-del",children:`-${String(e??0)}`})]})}function ht({sessionId:t,hash:e,remote:n,t:r,onSelect:o}){let[a,s]=(0,J.useState)({kind:"idle"}),[l,p]=(0,J.useState)(0),i=(0,J.useRef)(new Map);(0,J.useEffect)(()=>{if(e===void 0){s({kind:"idle"});return}let h=i.current.get(e);if(h!==void 0){s({kind:"ready",detail:h});return}if(n===void 0||t===void 0){s({kind:"failed",message:r("state.noService.description")});return}let u=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:t,hash:e})).then(E=>{if(!u)return;let v=X(E);if(!v.ok){s({kind:"failed",message:v.message});return}let C=v.result;C.ok?(i.current.set(e,C.detail),s({kind:"ready",detail:C.detail})):s({kind:"failed",message:C.error.message===""?C.error.code:C.error.message})}).catch(E=>{u&&s({kind:"failed",message:Y(E)})}),()=>{u=!1}},[e,n,t,l,r]);let g=be(a.kind==="ready"?a.detail:{hash:e??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,m.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,m.jsxs)("header",{className:"gx-detail-head",children:[(0,m.jsx)("span",{children:r("detail.title")}),e===void 0?null:(0,m.jsx)("span",{className:"gx-hash",children:g.shortHash}),(0,m.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,m.jsx)("div",{className:"gx-detail-body",children:a.kind==="idle"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,m.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,m.jsx)("strong",{children:r("detail.failed")}),(0,m.jsx)("span",{children:a.message}),(0,m.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>p(h=>h+1),children:r("action.retry")})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,m.jsxs)("div",{className:"gx-detail-meta",children:[(0,m.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,m.jsx)("span",{children:g.relative}),(0,m.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,m.jsxs)("div",{className:"gx-parents",children:[(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(h=>(0,m.jsx)("button",{type:"button",className:"gx-parent",title:h,onClick:()=>o(h),children:h.slice(0,7)},h))]}),a.detail.body===""?null:(0,m.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,m.jsxs)("div",{className:"gx-detail-files",children:[(0,m.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):He(a.detail.files).map(h=>(0,m.jsxs)("div",{className:"gx-detail-group",children:[(0,m.jsx)("div",{className:"gx-detail-dir",children:h.dir===""?r("changes.root"):h.dir}),h.files.map(u=>(0,m.jsxs)("div",{className:"gx-detail-file",children:[(0,m.jsx)("span",{className:"gx-badge","data-status":u.status,children:fe(u.status)}),(0,m.jsxs)("span",{className:"gx-file-name",children:[re(u.path),u.origPath===void 0?null:(0,m.jsx)("span",{className:"gx-file-orig",children:re(u.origPath)})]}),(0,m.jsx)("span",{className:"gx-file-stats",children:(0,m.jsx)(pn,{additions:u.additions,deletions:u.deletions})})]},u.path))]},h.dir===""?".":h.dir))]})]})})]})}var z=require("react");var le=require("react/jsx-runtime");function mt(t){return`var(--gx-lane-${String(Math.abs(t)%8)})`}function ft({row:t,laneCount:e,height:n}){let r=Math.min(116,Math.max(16,e*12)),o=r/Math.max(1,e),a=p=>p*o+o/2,s=n/2,l=t.segments.map((p,i)=>{let g=a(p.from),h=a(p.to),u=p.kind==="pass"?`M ${String(g)} 0 L ${String(h)} ${String(n)}`:p.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(s)}`:`M ${String(g)} ${String(s)} C ${String(g)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(n)}`;return(0,le.jsx)("path",{d:u,fill:"none",stroke:mt(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(i)}`)});return(0,le.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[l,(0,le.jsx)("circle",{cx:a(t.lane),cy:s,r:t.merge?4:3.2,fill:mt(t.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var R=require("react/jsx-runtime"),ke=24,xt=100;function gn({commit:t,row:e,laneCount:n,top:r,selected:o,head:a,onSelect:s}){return(0,R.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${t.hash.slice(0,7)} ${t.subject}`,onClick:()=>s(t.hash),children:[e===void 0?(0,R.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,R.jsx)(ft,{row:e,laneCount:n,height:ke}),(0,R.jsx)("span",{className:"gx-hash",children:t.hash.slice(0,7)}),(0,R.jsx)("span",{className:"gx-subject",children:t.subject}),t.refs.slice(0,2).map(l=>(0,R.jsxs)("span",{className:"gx-ref","data-kind":l.kind,children:[(0,R.jsx)("span",{className:"gx-ref-name",children:l.name}),(0,R.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:l.name})]},`${l.kind}:${l.name}`)),(0,R.jsx)("span",{className:"gx-author",children:t.author}),(0,R.jsx)("span",{className:"gx-time",title:new Date(t.time*1e3).toLocaleString(),children:Ae(t.time)})]})}function bt(t){let{commits:e,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:l,loadError:p,t:i,onSelect:g,onLoadMore:h}=t,u=(0,z.useRef)(null),[E,v]=(0,z.useState)(0),[C,L]=(0,z.useState)(0),P=(0,z.useRef)(!1);(0,z.useEffect)(()=>{let H=u.current;if(H===null)return;let w=()=>L(H.clientHeight);if(w(),typeof ResizeObserver>"u")return;let D=new ResizeObserver(w);return D.observe(H),()=>D.disconnect()},[]),(0,z.useEffect)(()=>{l||(P.current=!1)},[l]);let b=(0,z.useCallback)(()=>{!s||l||P.current||(P.current=!0,h())},[s,l,h]),T=H=>{let w=H.currentTarget;v(w.scrollTop),w.scrollTop+w.clientHeight>=w.scrollHeight-160&&b()},I=ve(e,{scrollTop:E,height:C===0?480:C,rowHeight:ke}),$=Math.max(1,ct(n));return(0,R.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,R.jsxs)("header",{className:"gx-pane-head",children:[(0,R.jsx)("span",{children:i("history.title")}),(0,R.jsx)("span",{className:"gx-count",children:`${String(e.length)} / ${String(a)}`})]}),e.length===0?(0,R.jsxs)("div",{className:"gx-empty",children:[(0,R.jsx)("strong",{children:t.emptyTitle??i("history.empty")}),t.emptyDescription===void 0?null:(0,R.jsx)("span",{children:t.emptyDescription}),t.onRetry===void 0?null:(0,R.jsx)("button",{type:"button",className:"gx-btn",onClick:t.onRetry,children:t.retryLabel??i("action.retry")})]}):(0,R.jsx)("div",{className:"gx-scroll",ref:u,onScroll:T,"data-testid":"git-history-scroll",children:(0,R.jsx)("div",{className:"gx-vlist",style:{height:e.length*ke},children:I.rows.map((H,w)=>{let D=I.startIndex+w;return(0,R.jsx)(gn,{commit:H,row:n[D],laneCount:$,top:D*ke,selected:H.hash===r,head:H.hash===o,onSelect:g},H.hash)})})}),(0,R.jsxs)("footer",{className:"gx-loadbar",children:[(0,R.jsx)("span",{children:`${i("history.loaded")} ${String(e.length)}`}),p===void 0?null:(0,R.jsx)("span",{className:"gx-del",children:p}),(0,R.jsx)("span",{className:"gx-spacer"}),s?(0,R.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:l,onClick:b,children:i(l?"history.loading":"history.loadMore")}):(0,R.jsx)("span",{children:e.length===0?"":i("history.noMore")})]})]})}var Be="git-explorer.leftColumnWidth";function Fe(t){return Math.min(560,Math.max(240,t))}function vt(t){if(t==null)return null;let e;try{e=t.getItem(Be)}catch{return null}if(e===null)return null;let n=Number(e);return!Number.isFinite(n)||n<240||n>560?null:n}function Re(t,e){let n=Math.round(Fe(e));if(t!=null)try{t.setItem(Be,String(n))}catch{}return n}function wt(t){if(t!=null)try{t.removeItem(Be)}catch{}}function kt(t,e){return Math.round(t)===Math.round(e)}var yt=16;function Rt(t,e){if(e)return null;switch(t){case"ArrowLeft":return{kind:"nudge",delta:-yt};case"ArrowRight":return{kind:"nudge",delta:yt};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var f=require("react/jsx-runtime");function hn(t,e){return t===void 0?"idle":e?"loading":"no-service"}function St(t,e){let n=lt(t);return n!==void 0&&e.select(n.hash),e.complete?.(),n!==void 0}var mn={display:"flex",alignItems:"center",gap:8};function fn(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var xn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function Ce({title:t,description:e,actionLabel:n,onAction:r}){return(0,f.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,f.jsx)("strong",{children:t}),e===void 0?null:(0,f.jsx)("span",{children:e}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function bn(t){return t.split(/[\\/]/u).filter(Boolean).at(-1)??t}function Et(t){let{workbench:e,version:n,t:r,remote:o}=t;function a(s){let l=s.sessionId??e.currentSessionId(),p=(0,x.useRef)(l);p.current=l;let i=(0,x.useMemo)(()=>o(),[o]),[g,h]=(0,x.useState)(()=>({kind:hn(l,i!==void 0)})),[u,E]=(0,x.useState)(0),[v,C]=(0,x.useState)([]),[L,P]=(0,x.useState)(!1),[b,T]=(0,x.useState)(!1),[I,$]=(0,x.useState)(void 0),[H,w]=(0,x.useState)(void 0),D=(0,x.useRef)(void 0),q=(0,x.useRef)(void 0),[Q,de]=(0,x.useState)(!0),W=(0,x.useMemo)(()=>fn(),[]),[V,j]=(0,x.useState)(()=>vt(W)),oe=(0,x.useRef)(null),U=(0,x.useRef)(null),Z=(0,x.useCallback)(d=>{D.current=d,w(d),de(!1)},[]),ce=(0,x.useCallback)(()=>{de(!1)},[]),Ee=(0,x.useCallback)(d=>{if(d.button!==0||U.current!==null||xn())return;let c=oe.current?.previousElementSibling;if(c instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}U.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:c.getBoundingClientRect().width,restWidth:V},document.body.classList.add("gx-pane-resizing")}},[V]),ue=(0,x.useCallback)(d=>{let c=U.current;c===null||c.pointerId!==d.pointerId||j(Fe(c.baseWidth+d.clientX-c.startX))},[]),ee=(0,x.useCallback)(d=>{let c=U.current;if(c===null||c.pointerId!==d.pointerId)return;U.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let M=c.baseWidth+d.clientX-c.startX;if(kt(M,c.baseWidth)){j(c.restWidth);return}j(Re(W,M))},[W]),y=(0,x.useCallback)(()=>{wt(W),j(null)},[W]),_=(0,x.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let c=Rt(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(c===null)return;if(d.preventDefault(),d.stopPropagation(),c.kind==="reset"){y();return}if(c.kind==="min"||c.kind==="max"){let F=c.kind==="min"?240:560;j(Re(W,F));return}let M=oe.current?.previousElementSibling,B=M instanceof HTMLElement?M.getBoundingClientRect().width:V??240;j(Re(W,B+c.delta))},[W,y,V]);(0,x.useEffect)(()=>()=>{U.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(l===void 0||s.openView===void 0)return;let d=e.views;if(d?.bind!==void 0)return d.bind(l,s.openView)},[l,s.openView,e]),(0,x.useEffect)(()=>{if(l===void 0){h({kind:"idle"});return}if(i===void 0){h({kind:"no-service"});return}let d=!0;return h({kind:"loading"}),$(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:l})).then(c=>{if(!d)return;let M=X(c);if(!M.ok){h({kind:"failed",message:M.message});return}let B=M.result;if(!B.ok){h({kind:"failed",message:B.error.message===""?B.error.code:B.error.message});return}let F=B.snapshot;h({kind:"ready",snapshot:F}),C(F.commits),P(F.commits.length<F.counts.commits);let te=D.current;D.current=void 0,w(ae=>te!==void 0?te:ae!==void 0&&F.commits.some(pe=>pe.hash===ae)?ae:F.commits[0]?.hash)}).catch(c=>{d&&h({kind:"failed",message:Y(c)})}),()=>{d=!1}},[l,i,u]),(0,x.useEffect)(()=>{let d=s.viewRequest;if(d==null||d.view!==ie)return;let c=`${d.view}:${d.focus}`;q.current!==c&&(q.current=c,St(d.focus,{select:Z,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,Z]),(0,x.useEffect)(()=>{let d=e.viewFocus;if(d===void 0||l===void 0)return;let c=()=>{let M=d.take(ie);M!==void 0&&St(M,{select:Z})};return c(),d.subscribe(c)},[e,l,Z]);let A=(0,x.useMemo)(()=>dt(v),[v]),G=g.kind==="ready"?g.snapshot:void 0,We=(0,x.useMemo)(()=>G===void 0?[]:xe(G.status),[G]),It=(0,x.useMemo)(()=>{let d=new Map;for(let c of G?.stats??[])d.set(c.path,{additions:c.additions,deletions:c.deletions});return d},[G]),_e=(0,x.useMemo)(()=>{let d=new Map;for(let c of G?.branches??[]){let M=d.get(c.hash);M===void 0?d.set(c.hash,[{kind:c.kind,name:c.name,head:c.head}]):M.push({kind:c.kind,name:c.name,head:c.head})}return d},[G]),Ht=(0,x.useCallback)(()=>{if(l===void 0||i===void 0||!L||b)return;let d=l;T(!0),$(void 0),Promise.resolve().then(()=>i.query({sessionId:l,skip:v.length,limit:xt})).then(c=>{if(p.current!==d)return;let M=X(c);if(!M.ok){$(M.message);return}let B=M.result;if(!B.ok){$(B.error.message===""?B.error.code:B.error.message);return}let F=B.page;C(te=>{let ae=new Set(te.map(ne=>ne.hash)),pe=F.commits.filter(ne=>!ae.has(ne.hash)).map(ne=>({...ne,refs:_e.get(ne.hash)??[]}));return pe.length===0?te:[...te,...pe]}),P(F.hasMore)}).catch(c=>$(Y(c))).finally(()=>T(!1))},[l,i,L,b,v.length,_e]),At=(0,x.useMemo)(()=>{let d=e.views??{open:(c,M)=>e.openView?.(c,M)??!1};return ye({views:d,sessionId:l??""})},[e,l]),Bt=(d,c=1)=>{l!==void 0&&At(d,c)},Ft=()=>E(d=>d+1),Le=()=>E(d=>d+1),O=G?.head,zt=We.reduce((d,c)=>d+c.files.length,0);return(0,f.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":l??"","data-testid":"git-explorer-view",children:[(0,f.jsxs)("header",{className:"gx-head",children:[(0,f.jsxs)("div",{className:"gx-head-main",children:[(0,f.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,f.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,f.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,f.jsx)("span",{className:"gx-repo",title:G?.root??r("view.title"),children:G===void 0?r("view.title"):bn(G.root)}),O?.branch===null||O?.branch===void 0?null:(0,f.jsx)("span",{className:"gx-branch",children:O.branch}),O?.detached===!0?(0,f.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,O?.ahead!==void 0&&O.ahead>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(O.ahead)}`}):null,O?.behind!==void 0&&O.behind>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(O.behind)}`}):null]}),(0,f.jsxs)("div",{className:"gx-head-meta",style:mn,children:[G===void 0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("span",{children:[r("head.changes")," ",(0,f.jsx)("b",{children:zt})]}),(0,f.jsxs)("span",{children:[r("head.commits")," ",(0,f.jsx)("b",{children:G.counts.commits})]}),(0,f.jsxs)("span",{children:[r("head.branches")," ",(0,f.jsx)("b",{children:G.counts.branches})]})]}),(0,f.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:Ft,children:"\u21BB"})]})]}),l===void 0?(0,f.jsx)(Ce,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,f.jsx)(Ce,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,f.jsx)(Ce,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:Le}):g.kind==="ready"&&!g.snapshot.isRepository?(0,f.jsx)(Ce,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Le}):g.kind==="ready"?(0,f.jsxs)("div",{className:"gx-body",style:V===null?void 0:{"--gx-left-col":`${V}px`},children:[(0,f.jsx)(gt,{groups:We,stats:It,t:r,onOpen:Bt,claimFocus:Q,onFocusClaimed:ce}),(0,f.jsx)("div",{ref:oe,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":V??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Ee,onPointerMove:ue,onPointerUp:ee,onPointerCancel:ee,onLostPointerCapture:ee,onKeyDown:_,onDoubleClick:y}),(0,f.jsxs)("div",{className:"gx-col",children:[(0,f.jsx)(bt,{commits:v,graph:A,selectedHash:H,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:L,loadingMore:b,loadError:I,t:r,onSelect:w,onLoadMore:Ht,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Le,retryLabel:r("action.retry")}:{}}),(0,f.jsx)(ht,{sessionId:l,hash:H,remote:i,t:r,onSelect:w})]})]}):null]})}return a}var Nt=["slots","locale","workbench","remote"];function Lt(t){if(t===null||typeof t!="object")return!1;let e=t;return typeof e.snapshot=="function"&&typeof e.query=="function"&&typeof e.commit=="function"}function Mt(t){return()=>{try{let n=t.remote?.gitExplorer;if(Lt(n))return n}catch{}try{let n=t.get?.("remote.gitExplorer");if(Lt(n))return n}catch{}let e=Tt(t);return e===void 0?void 0:Ye(e)}}function Tt(t){let n=t.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${Ve}/${r}`,o,a)}var Se;function Pt(t){let e=t.locale.bind(se);Se?.();let n=t.locale.register(se,{zh:Oe,en:$e});Se=n;let r=pt(typeof document>"u"?void 0:document),o=Mt(t),a=at({store:Je(o),t:e});t.slots.inject(Te,()=>t.slots.register({name:Te,id:qe,order:30,locale:se},a));let s=t.workbench;if(s!=null){let l=Et({workbench:s,version:s.version,t:e,remote:o});t.slots.inject(Me,()=>t.slots.register({name:Me,id:ie,order:110,label:()=>e("tab.label"),locale:se},l))}return()=>{r(),n(),Se===n&&(Se=void 0)}}var Gt={groupChanges:xe,formatCommitDetail:be,createJump:ye,computeWindow:ve},Dt={name:"dsh-git-explorer",inject:Nt,apply:Pt,__test:Gt},wn=Dt;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
