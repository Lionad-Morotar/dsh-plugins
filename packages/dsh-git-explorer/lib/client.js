window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ge=Object.defineProperty;var Ot=Object.getOwnPropertyDescriptor;var qt=Object.getOwnPropertyNames;var Vt=Object.prototype.hasOwnProperty;var jt=(e,t)=>{for(var n in t)Ge(e,n,{get:t[n],enumerable:!0})},Kt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of qt(t))!Vt.call(e,o)&&o!==n&&Ge(e,o,{get:()=>t[o],enumerable:!(r=Ot(t,o))||r.enumerable});return e};var Ut=e=>Kt(Ge({},"__esModule",{value:!0}),e);var Mn={};jt(Mn,{__test:()=>Ft,apply:()=>Ht,boot:()=>rt,clientPlugin:()=>At,createRemoteResolver:()=>It,createRpcCall:()=>Bt,default:()=>Nn,inject:()=>Dt});module.exports=Ut(Mn);var Ve={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},je={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var De="conversation.view",ce="git-explorer";var Ie="conversation.session.header.actions",Ke="git-branch";var ue="git-explorer",Ue="gitExplorer";var y=require("react");var Xe=Object.freeze([]);function Ye(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:Xe}));let r=[];return e.forEach((o,a)=>{let s=Xt(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:Yt(s)},order:a,run:Jt(s)})}),r.sort((o,a)=>a.run-o.run||o.order-a.order),r.map(o=>o.match)}function Be(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&He(n.branch))return t}return-1}function Je(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return Be(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&He(o.branch))return r}return t}function Qe(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!He(n.branch)))return n.branch}function He(e){return e.worktreePath===void 0}function Xt(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let a=t.charAt(o).toLowerCase(),s=-1;for(let l=r;l<e.length;l+=1)if(e.charAt(l).toLowerCase()===a){s=l;break}if(s===-1)return;n.push(s),r=s+1}return n}function Yt(e){let t=e[0];if(t===void 0)return Xe;let n=[],r=t,o=t+1;for(let a=1;a<e.length;a+=1){let s=e[a];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function Jt(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function Ze(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch")}}function Y(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function J(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var fe="service-unavailable",Qt=Object.freeze({status:"idle",revision:0,sessionId:null}),Fe;function Zt(e){let t=Qt,n=-1,r=0,o=new Set,a=i=>{t=i;for(let b of[...o])b()},s=i=>t.sessionId===i&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(i){return o.add(i),()=>{o.delete(i)}},getSnapshot:()=>t,load:async i=>{if(s(i))return;let b=e(),u=++r,c=t.revision,E=t.sessionId===i;a({status:"loading",...E&&t.list!==void 0?{list:t.list}:{},revision:c,sessionId:i});let w=()=>u!==r||t.revision!==c;if(typeof b?.branches!="function"){if(w())return;a({status:"error",error:fe,revision:c,sessionId:i});return}try{let k=await b.branches({sessionId:i});if(w())return;let N=Y(k);if(!N.ok){a({status:"error",error:N.message,revision:c,sessionId:i});return}if(N.result.ok===!1){a({status:"error",error:N.result.error.message,revision:c,sessionId:i});return}n=c,a({status:"ready",list:N.result.list,revision:c,sessionId:i})}catch(k){if(w())return;a({status:"error",error:J(k),revision:c,sessionId:i})}},switchTo:async(i,b)=>{let u=e();if(typeof u?.switchBranch!="function")return a({...t,error:fe}),!1;try{let c=await u.switchBranch({sessionId:i,name:b}),E=Y(c),w=E.ok?E.result.ok===!1?E.result.error.message:void 0:E.message;if(w!==void 0)return a({...t,error:w}),!1;let k=E.ok&&E.result.ok===!0?E.result.branch:b,N=t.list;return a({status:N===void 0?t.status:"ready",...N===void 0?{}:{list:{...N,detached:!1,headHash:null,branches:N.branches.map(T=>({...T,current:T.name===k}))}},revision:t.revision+1,sessionId:i}),!0}catch(c){return a({...t,error:J(c)}),!1}},bump(){a({...t,revision:t.revision+1})}}}function en(e){return Fe=Zt(e),Fe}var et=en;function tt(){return Fe}var K=require("react"),tn=Object.freeze({}),xe=null,Ae;function rt(e){xe=e}function ot(){if(Ae!=null)return Ae;if(xe===null)return tn;let e=nt(xe,"@deepseek-ai/dsh-client-ui-primitives"),t=nt(xe,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,a=e?.useDismissOnOutsidePointer,s=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof a=="function"?{useDismissOnOutsidePointer:a}:{},...typeof s=="function"?{createPortal:s}:{}}}function nt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var at={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},it=e=>(0,K.createElement)("svg",{...at,className:e.className},(0,K.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,K.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,K.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,K.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,K.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),st=e=>(0,K.createElement)("svg",{...at,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,K.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var S=require("react/jsx-runtime"),lt=320,nn="min(420px, 100vw - 32px)",dt=5,be=8;function rn(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:dt,margin:be})??void 0:on(t,n)}function on(e,t){let[n,r]=(0,y.useState)(void 0);return(0,y.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let a=t.current;if(a===null)return;let s=a.getBoundingClientRect(),l=Math.min(lt,Math.max(160,window.innerWidth-be*2)),g=Math.min(Math.max(s.right-l,be),window.innerWidth-l-be);r({left:g,top:s.bottom+dt,width:l})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function an(e,t,n,r,o,a){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,a,r?n:void 0);return}sn(t,n,o,a)}function sn(e,t,n,r){(0,y.useEffect)(()=>{if(!n)return;let o=a=>{let s=a.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function ln(e,t){let n=[],r=0;return t.forEach((o,a)=>{let[s,l]=o;s>r&&n.push((0,S.jsx)("span",{children:e.slice(r,s)},`plain-${a}`)),n.push((0,S.jsx)("span",{className:"gx-branch-match",children:e.slice(s,l)},`hit-${a}`)),r=l}),r<e.length&&n.push((0,S.jsx)("span",{children:e.slice(r)},"tail")),n}function dn(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function ct({store:e,t}){function n({sessionId:r}){let o=(0,y.useSyncExternalStore)(e.subscribe,e.getSnapshot),[a,s]=(0,y.useState)(!1),[l,g]=(0,y.useState)(""),[i,b]=(0,y.useState)(-1),[u,c]=(0,y.useState)(null),E=(0,y.useRef)(null),w=(0,y.useRef)(null),k=(0,y.useRef)(null),N=(0,y.useRef)(null),T=(0,y.useRef)(null),v=(0,y.useRef)(!1),D=(0,y.useId)(),P=(0,y.useId)(),W=ot(),G=W.createPortal!==void 0,B=W.IconBranch??it,z=W.IconChevron??st,L=o.list,te=L===void 0?void 0:dn(L.root),V=(0,y.useMemo)(()=>Ye(L?.branches??[],l),[L,l]),O=(0,y.useCallback)(()=>{s(!1),g("")},[]),H=(0,y.useCallback)(()=>{v.current=!0,O(),w.current?.focus({preventScroll:!0})},[O]),j=(0,y.useCallback)(()=>{v.current=!0,O()},[O]);(0,y.useEffect)(()=>{O(),c(null),r!==void 0&&e.load(r)},[e,r,O]),(0,y.useLayoutEffect)(()=>{a&&N.current?.focus({preventScroll:!0})},[a]),(0,y.useLayoutEffect)(()=>{if(a||!v.current)return;v.current=!1;let h=document.activeElement;(h===null||h===document.body||h===w.current||E.current?.contains(h)===!0)&&w.current?.focus({preventScroll:!0})},[a]),(0,y.useEffect)(()=>{b(Be(V))},[V]),(0,y.useEffect)(()=>{T.current?.scrollIntoView?.({block:"nearest"})},[i,V]),(0,y.useEffect)(()=>{if(!a)return;let h=F=>{F.key!=="Escape"||F.isComposing||(F.preventDefault(),H())};return document.addEventListener("keydown",h),()=>document.removeEventListener("keydown",h)},[a,H]);let U=rn(W,a,w,k);an(W,E,k,G,a,j);let le=()=>{if(a){O();return}s(!0),r!==void 0&&e.load(r)},X=()=>{r!==void 0&&e.load(r)},Q=async h=>{if(u!==null||h.worktreePath!==void 0)return;if(h.current){H();return}if(r===void 0)return;c(h.name);let F=await e.switchTo(r,h.name);c(null),F&&H()},Me=()=>{let h=Qe(V,i);h!==void 0&&Q(h)},Te=h=>{if(!(h.metaKey||h.ctrlKey||h.altKey)&&!h.nativeEvent.isComposing){if(h.key==="ArrowDown"||h.key==="ArrowUp"){h.preventDefault();let F=h.key==="ArrowDown"?1:-1;b(I=>Je(V,I,F));return}h.key==="Enter"&&(h.preventDefault(),Me())}};if(r===void 0)return null;let Pe=L?.branches.find(h=>h.current)?.name,Z=L===void 0?t("branch.loading"):L.detached?L.headHash??t("head.detached"):Pe??t("branch.unborn");if(!a&&L?.isRepository!==!0)return null;let ne=`${t("head.detached")} ${L?.headHash??""}`.trim(),ge=o.error===fe?t("state.noService.title"):o.error,he=(0,S.jsxs)("div",{ref:k,id:P,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:lt,maxWidth:nn,...U},children:[L===void 0||te===void 0?null:(0,S.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:L.root,children:[(0,S.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,S.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,S.jsx)("span",{className:"gx-branch-scope-parent",children:te.parent}),(0,S.jsx)("span",{className:"gx-branch-scope-name",children:te.name})]})]}),(0,S.jsx)("input",{ref:N,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:l,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":L===void 0?void 0:D,"aria-activedescendant":i>=0&&L!==void 0?`${D}-option-${i}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:h=>g(h.target.value),onKeyDown:Te}),ge!==void 0?(0,S.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,S.jsx)("span",{className:"gx-branch-error-text",children:ge}),(0,S.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:X,children:t("action.retry")})]}):null,o.status==="loading"&&L===void 0?(0,S.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,L!==void 0?(0,S.jsxs)("div",{className:"gx-branch-list",id:D,role:"listbox","aria-label":t("branch.title"),children:[L.branches.length===0?(0,S.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,L.branches.length>0&&V.length===0?(0,S.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,V.map((h,F)=>{let I=h.branch,re=F===i;return(0,S.jsxs)("button",{ref:re?T:void 0,type:"button",role:"option",id:`${D}-option-${F}`,"aria-selected":re,"data-active":re?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${I.name}`,"data-current":I.current?"true":void 0,"aria-current":I.current?"true":void 0,title:I.worktreePath===void 0?I.name:`${I.name} ${t("branch.worktree")}: ${I.worktreePath}`,disabled:u!==null||I.worktreePath!==void 0,onClick:()=>{Q(I)},children:[(0,S.jsx)("span",{className:"gx-branch-row-name",children:ln(I.name,h.ranges)}),I.current?(0,S.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},I.name)})]}):null]});return(0,S.jsxs)("div",{className:"gx-branch-action",ref:E,children:[(0,S.jsxs)("button",{ref:w,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":`${t("branch.title")}: ${L?.detached===!0?ne:Z}`,"aria-haspopup":"dialog","aria-expanded":a,"aria-controls":a?P:void 0,title:L?.detached===!0?ne:Z,onClick:le,children:[(0,S.jsx)(B,{className:"gx-branch-icon"}),(0,S.jsx)("span",{className:"gx-branch-name",children:Z}),(0,S.jsx)(z,{className:"gx-branch-chevron"})]}),a?W.createPortal===void 0?he:W.createPortal(he,document.body):null]})}return n}var cn={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function ye(e){return cn[e]}var ut={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function un(e,t){return(ut[e]??0)>=(ut[t]??0)?e:t}function pt(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function ze(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function pn(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:un(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let l=a.slice(2),g=l.slice(0,2),i=ze(l,7);i!==""&&r({path:i,status:pt(g),staged:g[0]!==".",isDirectory:!1})}else if(s==="2"){let l=a.slice(2),g=l.slice(0,2),i=ze(l,8),b=t[o+1]??"";i!==""&&b!==""&&(o+=1,r({path:i,status:pt(g),staged:g[0]!==".",isDirectory:!1,origPath:b}))}else if(s==="u"){let l=a.slice(2),g=ze(l,9);g!==""&&r({path:g,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let l=a.slice(2);if(l==="")continue;let g=l.endsWith("/");r({path:g?l.slice(0,-1):l,status:"untracked",staged:!1,isDirectory:g})}}return[...n.values()]}function gn(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function We(e){let t=new Map;for(let n of e){let r=gn(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function ve(e){return We(pn(e))}function _e(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let l=Math.floor(a/30);return l<12?`${l}mo`:`${Math.floor(a/365)}y`}function we(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:_e(e.time,t)}}function ke({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}var hn=/^commit:([0-9a-f]{4,64})$/iu;function gt(e){if(e===void 0)return;let t=hn.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function Re(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-a-o*2),l=Math.floor(Math.max(0,t.scrollTop)/n)-o,g=Math.min(Math.max(l,0),s),i=Math.min(e.length,g+a+o*2);return{rows:e.slice(g,i),startIndex:g,endIndex:i}}function ht(e){let t=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((b,u)=>b-u),r.shift()??o++),l=i=>{i!==null&&!r.includes(i)&&r.push(i)},g=()=>{let i=t.indexOf(null);return i>=0?i:(t.push(null),n.push(null),t.length-1)};for(let i of e){let b=[...t],u=[...n],c=b.indexOf(i.hash),E=c>=0;E||(c=g());let w=E?n[c]??null:null;w===null&&(w=s(),n[c]=w);for(let v=0;v<b.length;v+=1)v!==c&&b[v]===i.hash&&(l(n[v]??null),t[v]=null,n[v]=null);let k=i.parents[0];k===void 0?(l(n[c]??null),t[c]=null,n[c]=null):(t[c]=k,n[c]=w);let N=[];for(let v=1;v<i.parents.length;v+=1){let D=i.parents[v];if(D===void 0)continue;let P=t.indexOf(D);P<0&&(P=g(),t[P]=D),n[P]===null&&(n[P]=s()),N.push(P)}let T=[];for(let v=0;v<b.length;v+=1){let D=b[v];if(D===null)continue;let P=u[v]??w;D===i.hash?T.push({kind:"into",from:v,to:c,color:P}):T.push({kind:"pass",from:v,to:v,color:P})}k!==void 0&&T.push({kind:"out",from:c,to:c,color:n[c]??w});for(let v of N)T.push({kind:"out",from:c,to:v,color:n[v]??w});for(a.push({lane:c,color:w,merge:i.parents.length>=2,segments:T});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function mt(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function se(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var ft="dsh-git-explorer-styles",mn=`
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
`;function xt(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${ft}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=ft,n.textContent=mn,e.head.appendChild(n),()=>{n.remove()}}var x=require("react");var Se=require("react");var C=require("react/jsx-runtime");function fn(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function xn({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,C.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,C.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function bt({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let s=e.reduce((g,i)=>g+i.files.length,0),l=(0,Se.useRef)(null);return(0,Se.useEffect)(()=>{o&&(a(),fn(l.current))},[o,a]),(0,C.jsxs)("section",{ref:l,className:"gx-pane","data-testid":"git-changes",children:[(0,C.jsxs)("header",{className:"gx-pane-head",children:[(0,C.jsx)("span",{children:n("changes.title")}),(0,C.jsx)("span",{className:"gx-count",children:s})]}),(0,C.jsx)("div",{className:"gx-scroll",children:s===0?(0,C.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,C.jsx)("strong",{children:n("changes.empty")})}):e.map(g=>(0,C.jsxs)("div",{children:[(0,C.jsxs)("div",{className:"gx-group-head",children:[(0,C.jsx)("span",{className:"gx-group-dir",children:g.dir===""?n("changes.root"):g.dir}),(0,C.jsx)("span",{className:"gx-count",children:g.files.length})]}),g.files.map(i=>{let b=t.get(i.path),u=n(`status.${i.status}`);return(0,C.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${u} \xB7 ${n("changes.directory")}`:`${u} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,C.jsx)("span",{className:"gx-badge","data-status":i.status,children:ye(i.status)}),(0,C.jsxs)("span",{className:"gx-file-name",children:[se(i.path),i.origPath===void 0?null:(0,C.jsx)("span",{className:"gx-file-orig",children:se(i.origPath)})]}),(0,C.jsx)("span",{className:"gx-file-stats",children:(0,C.jsx)(xn,{stat:b})})]},i.path)})]},g.dir===""?".":g.dir))})]})}var ee=require("react");var m=require("react/jsx-runtime");function bn({additions:e,deletions:t}){return e===null&&t===null?(0,m.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,m.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function yt({sessionId:e,hash:t,remote:n,t:r,onSelect:o}){let[a,s]=(0,ee.useState)({kind:"idle"}),[l,g]=(0,ee.useState)(0),i=(0,ee.useRef)(new Map);(0,ee.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let u=i.current.get(t);if(u!==void 0){s({kind:"ready",detail:u});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let c=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(E=>{if(!c)return;let w=Y(E);if(!w.ok){s({kind:"failed",message:w.message});return}let k=w.result;k.ok?(i.current.set(t,k.detail),s({kind:"ready",detail:k.detail})):s({kind:"failed",message:k.error.message===""?k.error.code:k.error.message})}).catch(E=>{c&&s({kind:"failed",message:J(E)})}),()=>{c=!1}},[t,n,e,l,r]);let b=we(a.kind==="ready"?a.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,m.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,m.jsxs)("header",{className:"gx-detail-head",children:[(0,m.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,m.jsx)("span",{className:"gx-hash",children:b.shortHash}),(0,m.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,m.jsx)("div",{className:"gx-detail-body",children:a.kind==="idle"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,m.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,m.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,m.jsx)("strong",{children:r("detail.failed")}),(0,m.jsx)("span",{children:a.message}),(0,m.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>g(u=>u+1),children:r("action.retry")})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,m.jsxs)("div",{className:"gx-detail-meta",children:[(0,m.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,m.jsx)("span",{children:b.relative}),(0,m.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,m.jsxs)("div",{className:"gx-parents",children:[(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,m.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(u=>(0,m.jsx)("button",{type:"button",className:"gx-parent",title:u,onClick:()=>o(u),children:u.slice(0,7)},u))]}),a.detail.body===""?null:(0,m.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,m.jsxs)("div",{className:"gx-detail-files",children:[(0,m.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,m.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):We(a.detail.files).map(u=>(0,m.jsxs)("div",{className:"gx-detail-group",children:[(0,m.jsx)("div",{className:"gx-detail-dir",children:u.dir===""?r("changes.root"):u.dir}),u.files.map(c=>(0,m.jsxs)("div",{className:"gx-detail-file",children:[(0,m.jsx)("span",{className:"gx-badge","data-status":c.status,children:ye(c.status)}),(0,m.jsxs)("span",{className:"gx-file-name",children:[se(c.path),c.origPath===void 0?null:(0,m.jsx)("span",{className:"gx-file-orig",children:se(c.origPath)})]}),(0,m.jsx)("span",{className:"gx-file-stats",children:(0,m.jsx)(bn,{additions:c.additions,deletions:c.deletions})})]},c.path))]},u.dir===""?".":u.dir))]})]})})]})}var $=require("react");var pe=require("react/jsx-runtime");function vt(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function wt({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=g=>g*o+o/2,s=n/2,l=e.segments.map((g,i)=>{let b=a(g.from),u=a(g.to),c=g.kind==="pass"?`M ${String(b)} 0 L ${String(u)} ${String(n)}`:g.kind==="into"?`M ${String(b)} 0 C ${String(b)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(s)}`:`M ${String(b)} ${String(s)} C ${String(b)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(n)}`;return(0,pe.jsx)("path",{d:c,fill:"none",stroke:vt(g.color),strokeWidth:1.4,strokeLinecap:"round"},`${g.kind}-${String(g.from)}-${String(g.to)}-${String(i)}`)});return(0,pe.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[l,(0,pe.jsx)("circle",{cx:a(e.lane),cy:s,r:e.merge?4:3.2,fill:vt(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var R=require("react/jsx-runtime"),Ce=24,kt=100;function yn({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,onSelect:s}){return(0,R.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,R.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,R.jsx)(wt,{row:t,laneCount:n,height:Ce}),(0,R.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,R.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(l=>(0,R.jsxs)("span",{className:"gx-ref","data-kind":l.kind,children:[(0,R.jsx)("span",{className:"gx-ref-name",children:l.name}),(0,R.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:l.name})]},`${l.kind}:${l.name}`)),(0,R.jsx)("span",{className:"gx-author",children:e.author}),(0,R.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:_e(e.time)})]})}function Rt(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:l,loadError:g,t:i,onSelect:b,onLoadMore:u}=e,c=(0,$.useRef)(null),[E,w]=(0,$.useState)(0),[k,N]=(0,$.useState)(0),T=(0,$.useRef)(!1);(0,$.useEffect)(()=>{let G=c.current;if(G===null)return;let B=()=>N(G.clientHeight);if(B(),typeof ResizeObserver>"u")return;let z=new ResizeObserver(B);return z.observe(G),()=>z.disconnect()},[]),(0,$.useEffect)(()=>{l||(T.current=!1)},[l]);let v=(0,$.useCallback)(()=>{!s||l||T.current||(T.current=!0,u())},[s,l,u]),D=G=>{let B=G.currentTarget;w(B.scrollTop),B.scrollTop+B.clientHeight>=B.scrollHeight-160&&v()},P=Re(t,{scrollTop:E,height:k===0?480:k,rowHeight:Ce}),W=Math.max(1,mt(n));return(0,R.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,R.jsxs)("header",{className:"gx-pane-head",children:[(0,R.jsx)("span",{children:i("history.title")}),(0,R.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`})]}),t.length===0?(0,R.jsxs)("div",{className:"gx-empty",children:[(0,R.jsx)("strong",{children:e.emptyTitle??i("history.empty")}),e.emptyDescription===void 0?null:(0,R.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,R.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??i("action.retry")})]}):(0,R.jsx)("div",{className:"gx-scroll",ref:c,onScroll:D,"data-testid":"git-history-scroll",children:(0,R.jsx)("div",{className:"gx-vlist",style:{height:t.length*Ce},children:P.rows.map((G,B)=>{let z=P.startIndex+B;return(0,R.jsx)(yn,{commit:G,row:n[z],laneCount:W,top:z*Ce,selected:G.hash===r,head:G.hash===o,onSelect:b},G.hash)})})}),(0,R.jsxs)("footer",{className:"gx-loadbar",children:[(0,R.jsx)("span",{children:`${i("history.loaded")} ${String(t.length)}`}),g===void 0?null:(0,R.jsx)("span",{className:"gx-del",children:g}),(0,R.jsx)("span",{className:"gx-spacer"}),s?(0,R.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:l,onClick:v,children:i(l?"history.loading":"history.loadMore")}):(0,R.jsx)("span",{children:t.length===0?"":i("history.noMore")})]})]})}var $e="git-explorer.leftColumnWidth";function Oe(e){return Math.min(560,Math.max(240,e))}function Ct(e){if(e==null)return null;let t;try{t=e.getItem($e)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function Ee(e,t){let n=Math.round(Oe(t));if(e!=null)try{e.setItem($e,String(n))}catch{}return n}function Et(e){if(e!=null)try{e.removeItem($e)}catch{}}function Lt(e,t){return Math.round(e)===Math.round(t)}var St=16;function Nt(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-St};case"ArrowRight":return{kind:"nudge",delta:St};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var f=require("react/jsx-runtime");function vn(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Tt(e,t){let n=gt(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function wn(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var kn={display:"flex",alignItems:"center",gap:8};function Rn(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Sn=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function Le({title:e,description:t,actionLabel:n,onAction:r}){return(0,f.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,f.jsx)("strong",{children:e}),t===void 0?null:(0,f.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Cn(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function Pt(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(s){let l=s.sessionId??t.currentSessionId(),g=(0,x.useRef)(l);g.current=l;let i=(0,x.useMemo)(()=>o(),[o]),[b]=(0,x.useState)(tt),[u,c]=(0,x.useState)(()=>({kind:vn(l,i!==void 0)})),[E,w]=(0,x.useState)(0),[k,N]=(0,x.useState)([]),[T,v]=(0,x.useState)(!1),[D,P]=(0,x.useState)(!1),[W,G]=(0,x.useState)(void 0),[B,z]=(0,x.useState)(void 0),L=(0,x.useRef)(void 0),te=(0,x.useRef)(void 0),[V,O]=(0,x.useState)(!0),H=(0,x.useMemo)(()=>Rn(),[]),[j,U]=(0,x.useState)(()=>Ct(H)),le=(0,x.useRef)(null),X=(0,x.useRef)(null),Q=(0,x.useCallback)(d=>{L.current=d,z(d),O(!1)},[]),Me=(0,x.useCallback)(()=>{O(!1)},[]),Te=(0,x.useCallback)(d=>{if(d.button!==0||X.current!==null||Sn())return;let p=le.current?.previousElementSibling;if(p instanceof HTMLElement){try{d.currentTarget.setPointerCapture(d.pointerId)}catch{return}X.current={pointerId:d.pointerId,startX:d.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:j},document.body.classList.add("gx-pane-resizing")}},[j]),Pe=(0,x.useCallback)(d=>{let p=X.current;p===null||p.pointerId!==d.pointerId||U(Oe(p.baseWidth+d.clientX-p.startX))},[]),Z=(0,x.useCallback)(d=>{let p=X.current;if(p===null||p.pointerId!==d.pointerId)return;X.current=null,document.body.classList.remove("gx-pane-resizing");try{d.currentTarget.releasePointerCapture(d.pointerId)}catch{}let M=p.baseWidth+d.clientX-p.startX;if(Lt(M,p.baseWidth)){U(p.restWidth);return}U(Ee(H,M))},[H]),ne=(0,x.useCallback)(()=>{Et(H),U(null)},[H]),ge=(0,x.useCallback)(d=>{if(d.nativeEvent.isComposing)return;let p=Nt(d.key,d.altKey||d.ctrlKey||d.metaKey||d.shiftKey);if(p===null)return;if(d.preventDefault(),d.stopPropagation(),p.kind==="reset"){ne();return}if(p.kind==="min"||p.kind==="max"){let _=p.kind==="min"?240:560;U(Ee(H,_));return}let M=le.current?.previousElementSibling,A=M instanceof HTMLElement?M.getBoundingClientRect().width:j??240;U(Ee(H,A+p.delta))},[H,ne,j]);(0,x.useEffect)(()=>()=>{X.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(l===void 0||s.openView===void 0)return;let d=t.views;if(d?.bind!==void 0)return d.bind(l,s.openView)},[l,s.openView,t]),(0,x.useEffect)(()=>{if(l===void 0){c({kind:"idle"});return}if(i===void 0){c({kind:"no-service"});return}let d=!0;return c({kind:"loading"}),G(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:l})).then(p=>{if(!d)return;let M=Y(p);if(!M.ok){c({kind:"failed",message:M.message});return}let A=M.result;if(!A.ok){c({kind:"failed",message:A.error.message===""?A.error.code:A.error.message});return}let _=A.snapshot;c({kind:"ready",snapshot:_}),N(_.commits),v(_.commits.length<_.counts.commits);let ae=L.current;L.current=void 0,z(de=>ae!==void 0?ae:de!==void 0&&_.commits.some(me=>me.hash===de)?de:_.commits[0]?.hash)}).catch(p=>{d&&c({kind:"failed",message:J(p)})}),()=>{d=!1}},[l,i,E]),(0,x.useEffect)(()=>{let d=s.viewRequest;if(d==null||d.view!==ce)return;let p=`${d.view}:${d.focus}`;te.current!==p&&(te.current=p,Tt(d.focus,{select:Q,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,Q]),(0,x.useEffect)(()=>{let d=t.viewFocus;if(d===void 0||l===void 0)return;let p=()=>{let M=d.take(ce);M!==void 0&&Tt(M,{select:Q})};return p(),d.subscribe(p)},[t,l,Q]);let he=(0,x.useMemo)(()=>ht(k),[k]),h=u.kind==="ready"?u.snapshot:void 0,F=(0,x.useMemo)(()=>h===void 0?[]:ve(h.status),[h]),I=(0,x.useMemo)(()=>{let d=new Map;for(let p of h?.stats??[])d.set(p.path,{additions:p.additions,deletions:p.deletions});return d},[h]),re=(0,x.useMemo)(()=>{let d=new Map;for(let p of h?.branches??[]){let M=d.get(p.hash);M===void 0?d.set(p.hash,[{kind:p.kind,name:p.name,head:p.head}]):M.push({kind:p.kind,name:p.name,head:p.head})}return d},[h]),zt=(0,x.useCallback)(()=>{if(l===void 0||i===void 0||!T||D)return;let d=l;P(!0),G(void 0),Promise.resolve().then(()=>i.query({sessionId:l,skip:k.length,limit:kt})).then(p=>{if(g.current!==d)return;let M=Y(p);if(!M.ok){G(M.message);return}let A=M.result;if(!A.ok){G(A.error.message===""?A.error.code:A.error.message);return}let _=A.page;N(ae=>{let de=new Set(ae.map(ie=>ie.hash)),me=_.commits.filter(ie=>!de.has(ie.hash)).map(ie=>({...ie,refs:re.get(ie.hash)??[]}));return me.length===0?ae:[...ae,...me]}),v(_.hasMore)}).catch(p=>G(J(p))).finally(()=>P(!1))},[l,i,T,D,k.length,re]),Wt=(0,x.useMemo)(()=>{let d=t.views??{open:(p,M)=>t.openView?.(p,M)??!1};return ke({views:d,sessionId:l??""})},[t,l]),_t=(d,p=1)=>{l!==void 0&&Wt(d,p)},oe=(0,x.useCallback)(()=>w(d=>d+1),[]);(0,x.useEffect)(()=>wn(b,oe),[b,oe]);let q=h?.head,$t=F.reduce((d,p)=>d+p.files.length,0);return(0,f.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":u.kind,"data-session":l??"","data-testid":"git-explorer-view",children:[(0,f.jsxs)("header",{className:"gx-head",children:[(0,f.jsxs)("div",{className:"gx-head-main",children:[(0,f.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,f.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,f.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,f.jsx)("span",{className:"gx-repo",title:h?.root??r("view.title"),children:h===void 0?r("view.title"):Cn(h.root)}),q?.branch===null||q?.branch===void 0?null:(0,f.jsx)("span",{className:"gx-branch",children:q.branch}),q?.detached===!0?(0,f.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,q?.ahead!==void 0&&q.ahead>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(q.ahead)}`}):null,q?.behind!==void 0&&q.behind>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(q.behind)}`}):null]}),(0,f.jsxs)("div",{className:"gx-head-meta",style:kn,children:[h===void 0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("span",{children:[r("head.changes")," ",(0,f.jsx)("b",{children:$t})]}),(0,f.jsxs)("span",{children:[r("head.commits")," ",(0,f.jsx)("b",{children:h.counts.commits})]}),(0,f.jsxs)("span",{children:[r("head.branches")," ",(0,f.jsx)("b",{children:h.counts.branches})]})]}),(0,f.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:u.kind==="loading",onClick:oe,children:"\u21BB"})]})]}),l===void 0?(0,f.jsx)(Le,{title:r("state.noSession.title"),description:r("state.noSession.description")}):u.kind==="no-service"?(0,f.jsx)(Le,{title:r("state.noService.title"),description:r("state.noService.description")}):u.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):u.kind==="failed"?(0,f.jsx)(Le,{title:r("state.failed.title"),description:u.message,actionLabel:r("action.retry"),onAction:oe}):u.kind==="ready"&&!u.snapshot.isRepository?(0,f.jsx)(Le,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:oe}):u.kind==="ready"?(0,f.jsxs)("div",{className:"gx-body",style:j===null?void 0:{"--gx-left-col":`${j}px`},children:[(0,f.jsx)(bt,{groups:F,stats:I,t:r,onOpen:_t,claimFocus:V,onFocusClaimed:Me}),(0,f.jsx)("div",{ref:le,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":j??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:Te,onPointerMove:Pe,onPointerUp:Z,onPointerCancel:Z,onLostPointerCapture:Z,onKeyDown:ge,onDoubleClick:ne}),(0,f.jsxs)("div",{className:"gx-col",children:[(0,f.jsx)(Rt,{commits:k,graph:he,selectedHash:B,headHash:u.snapshot.head?.hash??null,total:u.snapshot.counts.commits,hasMore:T,loadingMore:D,loadError:W,t:r,onSelect:z,onLoadMore:zt,...u.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:oe,retryLabel:r("action.retry")}:{}}),(0,f.jsx)(yt,{sessionId:l,hash:B,remote:i,t:r,onSelect:z})]})]}):null]})}return a}var Dt=["slots","locale","workbench","remote"];function Gt(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function It(e){return()=>{try{let n=e.remote?.gitExplorer;if(Gt(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Gt(n))return n}catch{}let t=Bt(e);return t===void 0?void 0:Ze(t)}}function Bt(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${Ue}/${r}`,o,a)}var Ne;function Ht(e){let t=e.locale.bind(ue);Ne?.();let n=e.locale.register(ue,{zh:Ve,en:je});Ne=n;let r=xt(typeof document>"u"?void 0:document),o=It(e),a=ct({store:et(o),t});e.slots.inject(Ie,()=>e.slots.register({name:Ie,id:Ke,order:30,locale:ue},a));let s=e.workbench;if(s!=null){let l=Pt({workbench:s,version:s.version,t,remote:o});e.slots.inject(De,()=>e.slots.register({name:De,id:ce,order:110,label:()=>t("tab.label"),locale:ue},l))}return()=>{r(),n(),Ne===n&&(Ne=void 0)}}var Ft={groupChanges:ve,formatCommitDetail:we,createJump:ke,computeWindow:Re},At={name:"dsh-git-explorer",inject:Dt,apply:Ht,__test:Ft},Nn=At;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
