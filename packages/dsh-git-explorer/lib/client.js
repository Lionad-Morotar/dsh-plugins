window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var pt=Object.defineProperty;var yr=Object.getOwnPropertyDescriptor;var vr=Object.getOwnPropertyNames;var wr=Object.prototype.hasOwnProperty;var kr=(e,t)=>{for(var n in t)pt(e,n,{get:t[n],enumerable:!0})},Rr=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of vr(t))!wr.call(e,o)&&o!==n&&pt(e,o,{get:()=>t[o],enumerable:!(r=yr(t,o))||r.enumerable});return e};var Sr=e=>Rr(pt({},"__esModule",{value:!0}),e);var Oo={};kr(Oo,{__test:()=>sr,apply:()=>ar,boot:()=>en,clientPlugin:()=>lr,createReferenceResolver:()=>ir,createRemoteResolver:()=>rr,createRpcCall:()=>or,default:()=>$o,inject:()=>nr});module.exports=Sr(Oo);var Dt={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","reference.action":"\u5F15\u7528","reference.hint":"\u628A\u8FD9\u4E2A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","reference.disabled.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","reference.disabled.noComposer":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","reference.disabled.busy":"\u8F93\u5165\u6846\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u8BD5","reference.disabled.noSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","reference.failed":"\u65E0\u6CD5\u628A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},At={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","reference.action":"Reference","reference.hint":"Insert this commit into the composer","reference.disabled.noSession":"No session to insert into","reference.disabled.noComposer":"This host has no composer to insert into","reference.disabled.busy":"The composer is sending; try again in a moment","reference.disabled.noSource":"The reference source is not registered, so the chip could not be sent","reference.failed":"Could not insert the commit into the composer","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var zt=require("react"),Wt=14,Cr="--dsh-content-font-size",Gt=Wt;function Tr(e,t){return Math.max(e,Math.round(e*t/Wt))}function Er(e,t){if(e===void 0)return t;let n=Number.parseFloat(e);return Number.isFinite(n)&&n>0?n:t}function $t(){return typeof document>"u"||document.body===null?Gt:Er(document.body.style.getPropertyValue(Cr),Gt)}var ht=$t(),ft=new Set;function Ft(){return ht}function Lr(e){return ft.add(e),()=>{ft.delete(e)}}function Mr(e){if(e!==ht){ht=e;for(let t of[...ft])t()}}function _t(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function Nr(e){if(e===null||typeof e!="object")return;let t=e.fontSizes;if(t===null||typeof t!="object")return;let n=t.text;return typeof n=="number"&&Number.isFinite(n)&&n>0?n:void 0}function Pr(e){try{let t=e.get?.("theme");if(_t(t))return t}catch{}try{let t=e.theme;if(_t(t))return t}catch{}}function Ot(e){let t=e.inject;if(typeof t!="function")return()=>{};let n,r;try{let o=t.call(e,["theme"],i=>{let l=Pr(i);if(l===void 0)return;let c=()=>{try{let g=Nr(l.getTheme());Mr(g??$t())}catch{}};c();let u=i.on?.("theme/change",c);if(typeof u!="function")return;let a=u;return n=a,a});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{n?.(),r?.()}}function Bt(e){let t=(0,zt.useSyncExternalStore)(Lr,Ft,Ft);return Tr(e,t)}var gt="conversation.view",Fe="git-explorer";var mt="conversation.session.header.actions",Kt="git-branch";var _e="git-explorer",jt="gitExplorer";var I=require("react");var Vt=Object.freeze([]);function Ut(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:Vt}));let r=[];return e.forEach((o,i)=>{let l=Ir(o.name,n);l!==void 0&&r.push({match:{branch:o,ranges:Hr(l)},order:i,run:Dr(l)})}),r.sort((o,i)=>i.run-o.run||o.order-i.order),r.map(o=>o.match)}function xt(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&bt(n.branch))return t}return-1}function qt(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return xt(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&bt(o.branch))return r}return t}function Xt(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!bt(n.branch)))return n.branch}function bt(e){return e.worktreePath===void 0}function Ir(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let i=t.charAt(o).toLowerCase(),l=-1;for(let c=r;c<e.length;c+=1)if(e.charAt(c).toLowerCase()===i){l=c;break}if(l===-1)return;n.push(l),r=l+1}return n}function Hr(e){let t=e[0];if(t===void 0)return Vt;let n=[],r=t,o=t+1;for(let i=1;i<e.length;i+=1){let l=e[i];if(l!==void 0){if(l===o){o=l+1;continue}n.push([r,o]),r=l,o=l+1}}return n.push([r,o]),n}function Dr(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function Yt(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function Re(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Se(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Xe="service-unavailable",Ar=Object.freeze({status:"idle",revision:0,sessionId:null}),yt;function Gr(e){let t=Ar,n=-1,r=0,o=new Set,i=a=>{t=a;for(let g of[...o])g()},l=a=>t.sessionId===a&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(a){return o.add(a),()=>{o.delete(a)}},getSnapshot:()=>t,load:async a=>{if(l(a))return;let g=e(),p=++r,v=t.revision,N=t.sessionId===a;i({status:"loading",...N&&t.list!==void 0?{list:t.list}:{},revision:v,sessionId:a});let D=()=>p!==r||t.revision!==v;if(typeof g?.branches!="function"){if(D())return;i({status:"error",error:Xe,revision:v,sessionId:a});return}try{let T=await g.branches({sessionId:a});if(D())return;let R=Re(T);if(!R.ok){i({status:"error",error:R.message,revision:v,sessionId:a});return}if(R.result.ok===!1){i({status:"error",error:R.result.error.message,revision:v,sessionId:a});return}n=v,i({status:"ready",list:R.result.list,revision:v,sessionId:a})}catch(T){if(D())return;i({status:"error",error:Se(T),revision:v,sessionId:a})}},switchTo:async(a,g)=>{let p=()=>t.sessionId!==a,v=e();if(typeof v?.switchBranch!="function")return p()||i({...t,error:Xe}),{switched:!1};try{let N=await v.switchBranch({sessionId:a,name:g}),D=Re(N),T=D.ok?D.result.ok===!1?D.result.error.message:void 0:D.message;if(T!==void 0)return p()||i({...t,error:T}),{switched:!1};if(p())return{switched:!0};let R=D.ok&&D.result.ok===!0?D.result:void 0,B=R===void 0?g:R.branch,y=t.list;return i({status:y===void 0?t.status:"ready",...y===void 0?{}:{list:{...y,detached:!1,headHash:null,branches:y.branches.map(G=>({...G,current:G.name===B}))}},revision:t.revision+1,sessionId:a}),R===void 0||R.stash===void 0?{switched:!0}:{switched:!0,stash:R.stash}}catch(N){return p()||i({...t,error:Se(N)}),{switched:!1}}},bump(){i({...t,revision:t.revision+1})}}}function Fr(e){return yt=Gr(e),yt}var Jt=Fr;function Qt(){return yt}var Ee=require("react"),_r=Object.freeze({}),Ye=null,vt;function en(e){Ye=e}function tn(){if(vt!=null)return vt;if(Ye===null)return _r;let e=Zt(Ye,"@deepseek-ai/dsh-client-ui-primitives"),t=Zt(Ye,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,i=e?.useDismissOnOutsidePointer,l=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof i=="function"?{useDismissOnOutsidePointer:i}:{},...typeof l=="function"?{createPortal:l}:{}}}function Zt(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var nn={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},rn=e=>(0,Ee.createElement)("svg",{...nn,className:e.className},(0,Ee.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,Ee.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,Ee.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,Ee.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,Ee.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),on=e=>(0,Ee.createElement)("svg",{...nn,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,Ee.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var H=require("react/jsx-runtime"),an=320,zr="min(420px, 100vw - 32px)",sn=5,Je=8;function Wr(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:sn,margin:Je})??void 0:$r(t,n)}function $r(e,t){let[n,r]=(0,I.useState)(void 0);return(0,I.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let i=t.current;if(i===null)return;let l=i.getBoundingClientRect(),c=Math.min(an,Math.max(160,window.innerWidth-Je*2)),u=Math.min(Math.max(l.right-c,Je),window.innerWidth-c-Je);r({left:u,top:l.bottom+sn,width:c})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function Or(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}Br(t,n,o,i)}function Br(e,t,n,r){(0,I.useEffect)(()=>{if(!n)return;let o=i=>{let l=i.target;l instanceof Node&&e.current?.contains(l)!==!0&&t.current?.contains(l)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function Kr(e,t){let n=[],r=0;return t.forEach((o,i)=>{let[l,c]=o;l>r&&n.push((0,H.jsx)("span",{children:e.slice(r,l)},`plain-${i}`)),n.push((0,H.jsx)("span",{className:"gx-branch-match",children:e.slice(l,c)},`hit-${i}`)),r=c}),r<e.length&&n.push((0,H.jsx)("span",{children:e.slice(r)},"tail")),n}function jr(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function Vr(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let i=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${i}`)}if(e.untrackedFiles>0){let i=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${i}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function ln({store:e,t}){function n({sessionId:r}){let o=(0,I.useSyncExternalStore)(e.subscribe,e.getSnapshot),[i,l]=(0,I.useState)(!1),[c,u]=(0,I.useState)(""),[a,g]=(0,I.useState)(-1),[p,v]=(0,I.useState)(null),[N,D]=(0,I.useState)(null),T=(0,I.useRef)(r);T.current=r;let R=(0,I.useRef)(null),B=(0,I.useRef)(null),y=(0,I.useRef)(null),G=(0,I.useRef)(null),F=(0,I.useRef)(null),J=(0,I.useRef)(!1),U=(0,I.useId)(),m=(0,I.useId)(),L=tn(),me=L.createPortal!==void 0,ee=L.IconBranch??rn,X=L.IconChevron??on,M=o.list,$=M===void 0?void 0:jr(M.root),re=(0,I.useMemo)(()=>Ut(M?.branches??[],c),[M,c]),k=(0,I.useCallback)(()=>{l(!1),u(""),D(null)},[]),E=(0,I.useCallback)(()=>{J.current=!0,k(),B.current?.focus({preventScroll:!0})},[k]),_=(0,I.useCallback)(()=>{J.current=!0,k()},[k]);(0,I.useEffect)(()=>{k(),v(null),r!==void 0&&e.load(r)},[e,r,k]),(0,I.useLayoutEffect)(()=>{i&&G.current?.focus({preventScroll:!0})},[i]),(0,I.useLayoutEffect)(()=>{if(i||!J.current)return;J.current=!1;let P=document.activeElement;(P===null||P===document.body||P===B.current||R.current?.contains(P)===!0)&&B.current?.focus({preventScroll:!0})},[i]),(0,I.useEffect)(()=>{g(xt(re))},[re]),(0,I.useEffect)(()=>{F.current?.scrollIntoView?.({block:"nearest"})},[a,re]),(0,I.useEffect)(()=>{if(!i)return;let P=h=>{h.key!=="Escape"||h.isComposing||(h.preventDefault(),E())};return document.addEventListener("keydown",P),()=>document.removeEventListener("keydown",P)},[i,E]);let z=Wr(L,i,B,y);Or(L,R,y,me,i,_);let K=()=>{if(i){k();return}l(!0),r!==void 0&&e.load(r)},xe=()=>{r!==void 0&&e.load(r)},ce=async P=>{if(p!==null||P.worktreePath!==void 0)return;if(P.current){E();return}if(r===void 0)return;v(P.name);let h=await e.switchTo(r,P.name);if(T.current===r&&(v(null),!!h.switched)){if(e.load(r),h.stash?.conflict===!0){D(h.stash);return}E()}},de=()=>{let P=Xt(re,a);P!==void 0&&ce(P)},Y=P=>{if(!(P.metaKey||P.ctrlKey||P.altKey)&&!P.nativeEvent.isComposing){if(P.key==="ArrowDown"||P.key==="ArrowUp"){P.preventDefault();let h=P.key==="ArrowDown"?1:-1;g(f=>qt(re,f,h));return}P.key==="Enter"&&(P.preventDefault(),de())}};if(r===void 0)return null;let ie=M?.branches.find(P=>P.current)?.name,pe=M===void 0?t("branch.loading"):M.detached?M.headHash??t("head.detached"):ie??t("branch.unborn");if(!i&&M?.isRepository!==!0)return null;let be=`${t("head.detached")} ${M?.headHash??""}`.trim(),ue=M?.detached===!0?be:pe,se=M?.isRepository===!0?M.worktree:void 0,ne=se===void 0?void 0:Vr(se,t),ye=t("branch.worktreeSep"),ve=ne===void 0?ue:ne.description,Le=ne===void 0||se?.dirty!==!0?`${t("branch.title")}: ${ue}`:`${t("branch.title")}: ${ue}${ye}${ne.description}`,Me=o.error===Xe?t("state.noService.title"):o.error,De=(0,H.jsxs)("div",{ref:y,id:m,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:an,maxWidth:zr,...z},children:[N?.conflict===!0?(0,H.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,H.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),N.message===void 0||N.message===""?null:(0,H.jsx)("span",{className:"gx-branch-warning-detail",children:N.message})]}):null,M===void 0||$===void 0?null:(0,H.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:M.root,children:[(0,H.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,H.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,H.jsx)("span",{className:"gx-branch-scope-parent",children:$.parent}),(0,H.jsx)("span",{className:"gx-branch-scope-name",children:$.name})]})]}),(0,H.jsx)("input",{ref:G,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:c,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":M===void 0?void 0:U,"aria-activedescendant":a>=0&&M!==void 0?`${U}-option-${a}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:P=>u(P.target.value),onKeyDown:Y}),Me!==void 0?(0,H.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,H.jsx)("span",{className:"gx-branch-error-text",children:Me}),(0,H.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:xe,children:t("action.retry")})]}):null,o.status==="loading"&&M===void 0?(0,H.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,M!==void 0?(0,H.jsxs)("div",{className:"gx-branch-list",id:U,role:"listbox","aria-label":t("branch.title"),children:[M.branches.length===0?(0,H.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,M.branches.length>0&&re.length===0?(0,H.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,re.map((P,h)=>{let f=P.branch,q=h===a;return(0,H.jsxs)("button",{ref:q?F:void 0,type:"button",role:"option",id:`${U}-option-${h}`,"aria-selected":q,"data-active":q?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${f.name}`,"data-current":f.current?"true":void 0,"aria-current":f.current?"true":void 0,title:f.worktreePath===void 0?f.name:`${f.name} ${t("branch.worktree")}: ${f.worktreePath}`,disabled:p!==null||f.worktreePath!==void 0,onClick:()=>{ce(f)},children:[(0,H.jsx)("span",{className:"gx-branch-row-name",children:Kr(f.name,P.ranges)}),f.worktreePath===void 0?null:(0,H.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),f.current?(0,H.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},f.name)})]}):null]});return(0,H.jsxs)("div",{className:"gx-branch-action",ref:R,children:[(0,H.jsxs)("button",{ref:B,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Le,"aria-haspopup":"dialog","aria-expanded":i,"aria-controls":i?m:void 0,title:ve,onClick:K,children:[(0,H.jsx)(ee,{className:"gx-branch-icon"}),(0,H.jsx)("span",{className:"gx-branch-name",title:ue,children:pe}),ne===void 0||se?.dirty!==!0?null:(0,H.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:ne.dot?t("branch.worktreeDirty"):void 0,children:[ne.additions>0?(0,H.jsxs)("span",{className:"gx-branch-add",children:["+",ne.additions]}):null,ne.deletions>0?(0,H.jsxs)("span",{className:"gx-branch-del",children:["\u2212",ne.deletions]}):null,ne.dot?(0,H.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,H.jsx)(X,{className:"gx-branch-chevron"})]}),i?L.createPortal===void 0?De:L.createPortal(De,document.body):null]})}return n}function cn(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function Qe(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function Ze(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function dn(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var Ur={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Ie(e){return Ur[e]}var un={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function qr(e,t){return(un[e]??0)>=(un[t]??0)?e:t}function pn(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function wt(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function Xr(e){let t=e.split("\0"),n=new Map,r=o=>{let i=n.get(o.path);if(i===void 0){n.set(o.path,o);return}n.set(o.path,{...i,status:qr(i.status,o.status),staged:i.staged||o.staged,isDirectory:i.isDirectory||o.isDirectory,...i.origPath===void 0&&o.origPath===void 0?{}:{origPath:i.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let i=t[o];if(i===void 0||i===""||i.startsWith("#"))continue;let l=i[0];if(l==="1"){let c=i.slice(2),u=c.slice(0,2),a=wt(c,7);a!==""&&r({path:a,status:pn(u),staged:u[0]!==".",isDirectory:!1})}else if(l==="2"){let c=i.slice(2),u=c.slice(0,2),a=wt(c,8),g=t[o+1]??"";a!==""&&g!==""&&(o+=1,r({path:a,status:pn(u),staged:u[0]!==".",isDirectory:!1,origPath:g}))}else if(l==="u"){let c=i.slice(2),u=wt(c,9);u!==""&&r({path:u,status:"conflicted",staged:!1,isDirectory:!1})}else if(l==="?"){let c=i.slice(2);if(c==="")continue;let u=c.endsWith("/");r({path:u?c.slice(0,-1):c,status:"untracked",staged:!1,isDirectory:u})}}return[...n.values()]}function Yr(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function kt(e){let t=new Map;for(let n of e){let r=Yr(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,i)=>o.path.localeCompare(i.path))}))}function ze(e){return kt(Xr(e))}function Rt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let i=Math.floor(o/24);if(i<7)return`${i}d`;let l=Math.floor(i/7);if(l<5)return`${l}w`;let c=Math.floor(i/30);return c<12?`${c}mo`:`${Math.floor(i/365)}y`}function et(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:Rt(e.time,t)}}function tt({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),i=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${i}`)}}function hn({seam:e,sessionId:t}){return(n,r,o=1)=>{let i=typeof n=="string"?n.trim().toLowerCase():"";if(i===""||typeof r!="string")return;let l=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(l==="")return;let c=Number.isFinite(o)&&o>0?Math.floor(o):1,u=`git:${i}:${String(c)}:${l}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",u);let a=e.openViewOrSwitch("fs-explorer",u);if(a.focused){e.viewFocus?.take?.("fs-explorer");return}if(a.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",u)!==!0&&e.openView?.("fs-explorer",u)!==!0&&e.viewFocus?.request?.("fs-explorer",u)}}var Jr=/^commit:([0-9a-f]{4,64})$/iu;function fn(e){if(e===void 0)return;let t=Jr.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var gn=24;function nt(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),l=Math.max(0,e.length-i-o*2),c=Math.floor(Math.max(0,t.scrollTop)/n)-o,u=Math.min(Math.max(c,0),l),a=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,a),startIndex:u,endIndex:a}}function mn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return cn({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function xn(e){let t=[],n=[],r=[],o=0,i=[],l=()=>r.length===0?o++:(r.sort((g,p)=>g-p),r.shift()??o++),c=a=>{a!==null&&!r.includes(a)&&r.push(a)},u=()=>{let a=t.indexOf(null);return a>=0?a:(t.push(null),n.push(null),t.length-1)};for(let a of e){let g=[...t],p=[...n],v=g.indexOf(a.hash),N=v>=0;N||(v=u());let D=N?n[v]??null:null;D===null&&(D=l(),n[v]=D);for(let y=0;y<g.length;y+=1)y!==v&&g[y]===a.hash&&(c(n[y]??null),t[y]=null,n[y]=null);let T=a.parents[0];T===void 0?(c(n[v]??null),t[v]=null,n[v]=null):(t[v]=T,n[v]=D);let R=[];for(let y=1;y<a.parents.length;y+=1){let G=a.parents[y];if(G===void 0)continue;let F=t.indexOf(G);F<0&&(F=u(),t[F]=G),n[F]===null&&(n[F]=l()),R.push(F)}let B=[];for(let y=0;y<g.length;y+=1){let G=g[y];if(G===null)continue;let F=p[y]??D;G===a.hash?B.push({kind:"into",from:y,to:v,color:F}):B.push({kind:"pass",from:y,to:y,color:F})}T!==void 0&&B.push({kind:"out",from:v,to:v,color:n[v]??D});for(let y of R)B.push({kind:"out",from:v,to:y,color:n[y]??D});for(i.push({lane:v,color:D,merge:a.parents.length>=2,segments:B});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return i}function bn(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function Ce(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function yn(e,t){return`${e.trim().toLowerCase()}\0${t}`}function vn(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let i=n.keys().next();i.done||n.delete(i.value)}},get size(){return n.size}}}function wn(e,t,n,r=10,o=8){let i=Math.max(o,n.width-t.width-o),l=e.right+r;l>i&&(l=e.left-t.width-r,l<o&&(l=Math.min(i,Math.max(o,e.left))));let c=Math.max(o,n.height-t.height-o),u=e.bottom+r,a=e.top-t.height-r,g;return u<=c?g=Math.max(o,u):a>=o?g=a:g=Math.min(c,Math.max(o,e.top)),{left:l,top:g}}var kn="dsh-git-explorer-styles",Qr=`
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
/* The reference button rides the header's own height instead of the generic
   .gx-btn box, so it lines up with the hash beside it and does not grow the
   header when the label is long. */
.gx-refbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  height: calc(var(--gx-fs) * 1.5714);
  padding: 0 7px;
  border: 1px solid var(--gx-border-soft);
  border-radius: 5px;
  background: transparent;
  color: var(--gx-text-2);
  font: inherit;
  font-size: calc(var(--gx-fs) * 0.7857);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
}
.gx-refbtn:hover:not(:disabled) { background: var(--gx-hover); color: var(--gx-text); border-color: var(--gx-border); }
.gx-refbtn:disabled { opacity: .45; cursor: default; }
.gx-refbtn:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
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
`;function Rn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${kn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=kn,n.textContent=Qr,e.head.appendChild(n),()=>{n.remove()}}var Sn="lionad.git";function Zr(e){let t=e.replace(/\s+/gu," ").trim();if(t.length<=60)return t;let n=t.slice(0,60),r=n.lastIndexOf(" ");return`${(r>60*.75?n.slice(0,r):n).trimEnd()}\u2026`}function eo(e){if(!Number.isFinite(e))return"";let t=new Date(e*1e3);if(Number.isNaN(t.getTime()))return"";let n=r=>String(r).padStart(2,"0");return`${String(t.getFullYear())}-${n(t.getMonth()+1)}-${n(t.getDate())}`}function Cn(e){let n=[e.subject===""?`[git commit ${e.hash}]`:`[git commit ${e.hash}] ${e.subject}`],r=e.refs.filter(o=>o.trim()!=="").join(", ");return r!==""&&n.push(r),e.author!==""&&n.push(e.author),e.date!==""&&n.push(e.date),n.join(" \xB7 ")}function to(e,t,n){return{hash:e.hash,subject:Zr(e.subject),refs:n.filter(r=>r.trim()!==""),author:e.author,date:eo(e.time),short:t}}function Tn(e,t,n=[]){let r=to(e,t,n);return{kind:"git.commit",id:e.hash,label:r.subject===""?t:`${t} ${r.subject}`,clipboardText:`[git commit ${t}]`,modelText:Cn(r),ref:JSON.stringify(r)}}function no(e){let t;try{t=JSON.parse(e)}catch{return`[git commit ${e}]`}if(t===null||typeof t!="object")return`[git commit ${e}]`;let n=t;return typeof n.hash!="string"||n.hash===""?`[git commit ${e}]`:Cn({hash:n.hash,subject:typeof n.subject=="string"?n.subject:"",refs:Array.isArray(n.refs)?n.refs.filter(r=>typeof r=="string"):[],author:typeof n.author=="string"?n.author:"",date:typeof n.date=="string"?n.date:"",short:typeof n.short=="string"?n.short:""})}function ro(e){try{let t=JSON.parse(e);if(typeof t.short=="string"&&t.short!=="")return`[git commit ${t.short}]`}catch{}return`[git commit ${e}]`}function En(e,t){let n={source:Sn,ref:t.ref,label:t.label,clipboardText:t.clipboardText,appearance:"session"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(n,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(n,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(t.clipboardText,r)?"text":"failed"}function Ln(e){return e.sessionId===void 0?{enabled:!1,reasonKey:"reference.disabled.noSession"}:e.hasComposer?e.sourceAvailable?e.phase!==void 0&&e.phase!=="plain"?{enabled:!1,reasonKey:"reference.disabled.busy"}:{enabled:!0}:{enabled:!1,reasonKey:"reference.disabled.noSource"}:{enabled:!1,reasonKey:"reference.disabled.noComposer"}}function oo(){return{trigger:"@",name:Sn,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:ro,async serialize(e){return no(e)}}}}function io(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function Mn(e){let t=oo(),n,r=()=>{n?.(),n=void 0},o={get available(){return n!==void 0},dispose:r};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],i=>{i.effect(()=>(n=i.inputTriggers.registerSource(t),r),"dsh-git-explorer: commit reference source")}),o}catch{}try{let i=e.get?.("inputTriggers");if(io(i))return n=i.registerSource(t),o}catch{}return o}var b=require("react");var Z=require("react");function Nn(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let i=o.files.filter(l=>l.path.toLowerCase().includes(n));i.length>0&&r.push({dir:o.dir,files:i})}return r}var O=require("react/jsx-runtime");function Pe(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function ao(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function so(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function lo({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,O.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,O.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Pn({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:i}){let l=(0,Z.useRef)(null),c=(0,Z.useRef)(null),[u,a]=(0,Z.useState)(""),g=(0,Z.useMemo)(()=>Nn(e,u),[e,u]),p=(0,Z.useMemo)(()=>ao(g),[g]),v=(0,Z.useMemo)(()=>p.map(Pe),[p]),N=e.reduce((m,L)=>m+L.files.length,0),D=(0,Z.useMemo)(()=>g.reduce((m,L)=>m+L.files.length,0),[g]),T=u.trim()!=="",[R,B]=(0,Z.useState)(void 0),y=(0,Z.useMemo)(()=>R===void 0?-1:v.indexOf(R),[R,v]),G=(0,Z.useRef)(0);(0,Z.useEffect)(()=>{y>=0&&(G.current=y)},[y]);let F=(0,Z.useRef)(p);F.current=p,(0,Z.useEffect)(()=>{if(!o)return;i(),so(l.current);let m=F.current.find(L=>L.kind==="file");m!==void 0&&B(Pe(m))},[o,i]),(0,Z.useEffect)(()=>{if(R===void 0||y>=0||p.length===0)return;let m=p[Math.min(G.current,p.length-1)];m!==void 0&&B(Pe(m))},[y,R,p]);let J=(0,Z.useCallback)(m=>{let L=v[m];L!==void 0&&(B(L),c.current?.focus({preventScroll:!0}))},[v]);(0,Z.useEffect)(()=>{if(y<0)return;c.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[y,R]);let U=(0,Z.useCallback)(m=>{let L=Qe({key:m.key,composing:m.nativeEvent.isComposing,alt:m.altKey,ctrl:m.ctrlKey,meta:m.metaKey,shift:m.shiftKey});if(L===null)return;if(m.preventDefault(),L==="activate"){let ee=y<0?void 0:p[y];ee?.kind==="file"&&!ee.file.isDirectory&&r(ee.file.path,1);return}let me=Ze(y<0?void 0:y,L,p.length);me!==void 0&&J(me)},[y,J,r,p]);return(0,O.jsxs)("section",{ref:l,className:"gx-pane","data-testid":"git-changes",children:[(0,O.jsxs)("header",{className:"gx-pane-head",children:[(0,O.jsx)("span",{children:n("changes.title")}),(0,O.jsx)("span",{className:"gx-count",children:T?`${String(D)} / ${String(N)}`:N}),(0,O.jsx)("span",{className:"gx-spacer"}),(0,O.jsx)("input",{className:"gx-filter",type:"search",value:u,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:m=>a(m.currentTarget.value)})]}),(0,O.jsx)("div",{className:"gx-scroll",ref:c,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:U,children:N===0?(0,O.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,O.jsx)("strong",{children:n("changes.empty")})}):p.length===0?(0,O.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,O.jsx)("strong",{children:n("changes.noMatch")})}):p.map(m=>m.kind==="group"?(0,O.jsxs)("div",{className:"gx-group-head","data-cursor":Pe(m)===R?"true":"false",children:[(0,O.jsx)("span",{className:"gx-group-dir",children:m.dir===""?n("changes.root"):m.dir}),(0,O.jsx)("span",{className:"gx-count",children:m.count})]},Pe(m)):(0,O.jsxs)("button",{type:"button",className:"gx-file","data-status":m.file.status,"data-directory":m.file.isDirectory?"true":"false","data-renamed":m.file.origPath===void 0?"false":"true","data-cursor":Pe(m)===R?"true":"false","data-testid":"git-change-file",title:m.file.isDirectory?`${n(`status.${m.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${m.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{B(Pe(m)),c.current?.focus({preventScroll:!0}),m.file.isDirectory||r(m.file.path,1)},children:[(0,O.jsx)("span",{className:"gx-badge","data-status":m.file.status,children:Ie(m.file.status)}),(0,O.jsxs)("span",{className:"gx-file-name",children:[Ce(m.file.path),m.file.origPath===void 0?null:(0,O.jsx)("span",{className:"gx-file-orig",children:Ce(m.file.origPath)})]}),(0,O.jsx)("span",{className:"gx-file-stats",children:(0,O.jsx)(lo,{stat:t.get(m.file.path)})})]},Pe(m)))})]})}var j=require("react"),In=require("react-dom");var x=require("react/jsx-runtime"),co=200,uo=40,po=24,ho=7;function fo({additions:e,deletions:t}){return e===null&&t===null?(0,x.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,x.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function go(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function mo({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,x.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,x.jsx)("strong",{children:t("preview.unavailable")}),(0,x.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,x.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,x.jsx)("strong",{children:t("preview.unavailable")}),(0,x.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,x.jsxs)(x.Fragment,{children:[r.text===""?(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,x.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,x.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function xo({preview:e,hash:t,t:n}){let r=(0,j.useRef)(null),o=(0,j.useRef)(null),[i,l]=(0,j.useState)(null),[c,u]=(0,j.useState)(!1);return(0,j.useLayoutEffect)(()=>{let a=r.current;if(a===null)return;let g=a.getBoundingClientRect();l(wn(e.anchor,{width:g.width,height:g.height},{width:window.innerWidth,height:window.innerHeight}));let p=o.current;u(p!==null&&p.scrollHeight>p.clientHeight+1)},[e]),typeof document>"u"?null:(0,In.createPortal)((0,x.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":c?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:i?.left??0,top:i?.top??0,visibility:i===null?"hidden":"visible"},children:[(0,x.jsxs)("div",{className:"gx-preview-head",children:[(0,x.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Ie(e.file.status)}),(0,x.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:Ce(e.file.path)}),(0,x.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,ho)} \xB7 ${n("preview.revision")}`})]}),(0,x.jsx)("div",{className:"gx-preview-body",children:(0,x.jsx)(mo,{preview:e,t:n,textRef:o})})]}),document.body)}function Hn({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:i,refs:l,inputActions:c,phase:u,sourceAvailable:a,onReference:g}){let[p,v]=(0,j.useState)({kind:"idle"}),[N,D]=(0,j.useState)(0),T=(0,j.useRef)(new Map),R=(0,j.useRef)(!1),[B,y]=(0,j.useState)({kind:"idle"}),G=(0,j.useRef)(vn(po)),F=(0,j.useRef)(void 0),J=(0,j.useRef)(void 0),U=(0,j.useRef)(void 0),m=(0,j.useRef)(null),L=(0,j.useCallback)(()=>{F.current=void 0,J.current!==void 0&&(window.clearTimeout(J.current),J.current=void 0),U.current?.abort(),U.current=void 0,y(k=>k.kind==="idle"?k:{kind:"idle"})},[]),me=(0,j.useCallback)((k,E)=>{if(L(),t===void 0)return;let _=E.getBoundingClientRect(),z={left:_.left,top:_.top,right:_.right,bottom:_.bottom},K=yn(t,k.path);F.current=K,J.current=window.setTimeout(()=>{if(J.current=void 0,F.current!==K)return;let xe=G.current.get(K);if(xe!==void 0){y({kind:"ready",file:k,anchor:z,page:xe});return}if(e===void 0||n===void 0||typeof n.show!="function"){y({kind:"unavailable",file:k,anchor:z,message:r("preview.noService")});return}let ce=new AbortController;U.current=ce,y({kind:"loading",file:k,anchor:z}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:k.path,offset:1,limit:uo},ce.signal)).then(de=>{if(ce.signal.aborted||F.current!==K)return;let Y=Re(de);if(!Y.ok){y({kind:"unavailable",file:k,anchor:z,message:Y.message});return}let ie=Y.result;if(!ie.ok){y({kind:"unavailable",file:k,anchor:z,message:go(ie.error.code,ie.error.message,r)});return}G.current.set(K,ie.page),y({kind:"ready",file:k,anchor:z,page:ie.page})}).catch(de=>{ce.signal.aborted||F.current!==K||y({kind:"unavailable",file:k,anchor:z,message:Se(de)})}).finally(()=>{U.current===ce&&(U.current=void 0)})},co)},[L,t,n,e,r]);(0,j.useEffect)(()=>{if(t===void 0){v({kind:"idle"});return}let k=T.current.get(t);if(k!==void 0){v({kind:"ready",detail:k});return}if(n===void 0||e===void 0){v({kind:"failed",message:r("state.noService.description")});return}let E=!0;return v({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(_=>{if(!E)return;let z=Re(_);if(!z.ok){v({kind:"failed",message:z.message});return}let K=z.result;K.ok?(T.current.set(t,K.detail),v({kind:"ready",detail:K.detail})):v({kind:"failed",message:K.error.message===""?K.error.code:K.error.message})}).catch(_=>{E&&v({kind:"failed",message:Se(_)})}),()=>{E=!1}},[t,n,e,N,r]),(0,j.useEffect)(()=>{if(B.kind==="idle")return;let k=E=>{E.key==="Escape"&&L()};return document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[B.kind,L]),(0,j.useEffect)(()=>{let k=m.current;if(k===null)return;let E=()=>L();return k.addEventListener("scroll",E,{passive:!0}),()=>k.removeEventListener("scroll",E)},[L]),(0,j.useEffect)(()=>{L()},[t,N,e,n,L]),(0,j.useEffect)(()=>()=>{F.current=void 0,J.current!==void 0&&window.clearTimeout(J.current),U.current?.abort()},[]);let ee=et(p.kind==="ready"?p.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""}),X=Ln({sessionId:e,hasComposer:c!==void 0&&typeof c.captureInsertion=="function",phase:u,sourceAvailable:a===!0}),M=X.enabled&&p.kind==="ready"&&g!==void 0,$=X.enabled?p.kind==="ready"?void 0:r("detail.empty"):r(X.reasonKey),re=()=>{if(!(!M||R.current||p.kind!=="ready"||g===void 0)){R.current=!0;try{g(Tn(p.detail,ee.shortHash,l??[]))==="failed"&&window.console?.warn?.(`[dsh-git-explorer] ${r("reference.failed")}`)}finally{R.current=!1}}};return(0,x.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,x.jsxs)("header",{className:"gx-detail-head",children:[(0,x.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,x.jsx)("span",{className:"gx-hash",children:ee.shortHash}),(0,x.jsx)("span",{className:"gx-spacer",style:{flex:1}}),(0,x.jsx)("button",{type:"button",className:"gx-refbtn",disabled:!M,"aria-disabled":!M,title:$??r("reference.hint"),"data-testid":"gx-reference-commit",onClick:re,children:r("reference.action")})]}),(0,x.jsx)("div",{className:"gx-detail-body",ref:m,children:p.kind==="idle"?(0,x.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):p.kind==="loading"?(0,x.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):p.kind==="failed"?(0,x.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,x.jsx)("strong",{children:r("detail.failed")}),(0,x.jsx)("span",{children:p.message}),(0,x.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>D(k=>k+1),children:r("action.retry")})]}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("div",{className:"gx-detail-subject",children:p.detail.subject}),(0,x.jsxs)("div",{className:"gx-detail-meta",children:[(0,x.jsx)("span",{className:"gx-author",children:p.detail.author}),(0,x.jsx)("span",{children:ee.relative}),(0,x.jsx)("span",{title:new Date(p.detail.time*1e3).toLocaleString(),children:new Date(p.detail.time*1e3).toLocaleDateString()})]}),(0,x.jsxs)("div",{className:"gx-parents",children:[(0,x.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),p.detail.parents.length===0?(0,x.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):p.detail.parents.map(k=>(0,x.jsx)("button",{type:"button",className:"gx-parent",title:k,onClick:()=>o(k),children:k.slice(0,7)},k))]}),p.detail.body===""?null:(0,x.jsx)("pre",{className:"gx-body-text",children:p.detail.body}),(0,x.jsxs)("div",{className:"gx-detail-files",children:[(0,x.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(p.detail.files.length)}`}),p.detail.files.length===0?(0,x.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):kt(p.detail.files).map(k=>(0,x.jsxs)("div",{className:"gx-detail-group",children:[(0,x.jsx)("div",{className:"gx-detail-dir",children:k.dir===""?r("changes.root"):k.dir}),k.files.map(E=>(0,x.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:E.path,onClick:()=>i?.(E.path),onMouseEnter:_=>me(E,_.currentTarget),onMouseLeave:L,children:[(0,x.jsx)("span",{className:"gx-badge","data-status":E.status,children:Ie(E.status)}),(0,x.jsxs)("span",{className:"gx-file-name",children:[Ce(E.path),E.origPath===void 0?null:(0,x.jsx)("span",{className:"gx-file-orig",children:Ce(E.origPath)})]}),(0,x.jsx)("span",{className:"gx-file-stats",children:(0,x.jsx)(fo,{additions:E.additions,deletions:E.deletions})})]},E.path))]},k.dir===""?".":k.dir))]})]})}),B.kind==="idle"?null:(0,x.jsx)(xo,{preview:B,hash:t??"",t:r})]})}var V=require("react/jsx-runtime");function bo(e,t){let n=0,r=0,o=0;for(let i of e)for(let l of i.files){let c=t.get(l.path);c!==void 0&&(n+=c.additions??0,r+=c.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function Dn({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((l,c)=>l+c.files.length,0),i=bo(e,t);return(0,V.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,V.jsxs)("header",{className:"gx-detail-head",children:[(0,V.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,V.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,V.jsx)("span",{className:"gx-spacer"}),i.counted===0?null:(0,V.jsxs)("span",{className:"gx-detail-stats",children:[(0,V.jsx)("span",{className:"gx-add",children:`+${String(i.additions)}`}),(0,V.jsx)("span",{className:"gx-del",children:`-${String(i.deletions)}`})]})]}),(0,V.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(l=>(0,V.jsxs)("div",{className:"gx-detail-group",children:[(0,V.jsxs)("div",{className:"gx-group-head",children:[(0,V.jsx)("span",{className:"gx-group-dir",children:l.dir===""?n("changes.root"):l.dir}),(0,V.jsx)("span",{className:"gx-count",children:l.files.length})]}),l.files.map(c=>(0,V.jsxs)("button",{type:"button",className:"gx-file","data-status":c.status,"data-directory":c.isDirectory?"true":"false","data-testid":"git-change-file",title:c.isDirectory?`${n(`status.${c.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${c.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{c.isDirectory||r(c.path,1)},children:[(0,V.jsx)("span",{className:"gx-badge","data-status":c.status,children:Ie(c.status)}),(0,V.jsxs)("span",{className:"gx-file-name",children:[Ce(c.path),c.origPath===void 0?null:(0,V.jsx)("span",{className:"gx-file-orig",children:Ce(c.origPath)})]}),(0,V.jsx)("span",{className:"gx-file-stats",children:(0,V.jsx)(yo,{stat:t.get(c.path)})})]},c.path))]},l.dir))})]})}function yo({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,V.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,V.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var W=require("react");var We=require("react/jsx-runtime");function An(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Gn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(36,t*12)),o=r/Math.max(1,t),i=u=>u*o+o/2,l=n/2,c=e.segments.map((u,a)=>{let g=i(u.from),p=i(u.to),v=u.kind==="pass"?`M ${String(g)} 0 L ${String(p)} ${String(n)}`:u.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(l)}`:`M ${String(g)} ${String(l)} C ${String(g)} ${String(n*.55)}, ${String(p)} ${String(n*.45)}, ${String(p)} ${String(n)}`;return(0,We.jsx)("path",{d:v,fill:"none",stroke:An(u.color),strokeWidth:1.4,strokeLinecap:"round"},`${u.kind}-${String(u.from)}-${String(u.to)}-${String(a)}`)});return(0,We.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[c,(0,We.jsx)("circle",{cx:i(e.lane),cy:l,r:e.merge?4:3.2,fill:An(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var St="git-explorer.leftColumnWidth";function Ct(e){return Math.min(560,Math.max(240,e))}function _n(e){if(e==null)return null;let t;try{t=e.getItem(St)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function rt(e,t){let n=Math.round(Ct(t));if(e!=null)try{e.setItem(St,String(n))}catch{}return n}function zn(e){if(e!=null)try{e.removeItem(St)}catch{}}function $e(e,t){return Math.round(e)===Math.round(t)}var Fn=16;function Wn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Fn};case"ArrowRight":return{kind:"nudge",delta:Fn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Oe=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],Tt="git-explorer.historyColumns",$n=16,ge={refs:168,time:84,author:96,hash:68};function On(e){return Oe.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function Et(e,t){let n=On(e);return Math.min(n.max,Math.max(n.min,t))}function ot(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=On(t);return n<r.min||n>r.max?null:n}function vo(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Lt(e){if(e==null)return ge;let t;try{t=e.getItem(Tt)}catch{return ge}if(t===null)return ge;let n=vo(t);return n===null?ge:{refs:ot(n,"refs")??ge.refs,time:ot(n,"time")??ge.time,author:ot(n,"author")??ge.author,hash:ot(n,"hash")??ge.hash}}function wo(e,t){if(e==null)return;let n={};for(let r of Oe){let o=t[r.id];o!==ge[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(Tt):e.setItem(Tt,JSON.stringify(n))}catch{}}function it(e,t,n){let r=Math.round(Et(t,n)),o={...Lt(e),[t]:r};return wo(e,o),o}function Bn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-$n};case"ArrowRight":return{kind:"nudge",delta:$n};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function Kn(e,t){return $e(e,t)}var w=require("react/jsx-runtime");var ko=12,Te="uncommitted";function Mt(e){return Math.min(116,Math.max(36,e*12))}function Ro(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function So({commit:e,row:t,laneCount:n,rowHeight:r,top:o,selected:i,head:l,cursor:c,onSelect:u}){return(0,w.jsxs)("button",{type:"button",className:"gx-row",style:{top:o},"data-selected":i?"true":"false","data-head":l?"true":"false","data-cursor":c?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>u(e.hash),children:[t===void 0?(0,w.jsx)("span",{className:"gx-graph",style:{width:Mt(n)}}):(0,w.jsx)(Gn,{row:t,laneCount:n,height:r}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(a=>(0,w.jsxs)("span",{className:"gx-ref","data-kind":a.kind,children:[(0,w.jsx)("span",{className:"gx-ref-name",children:a.name}),(0,w.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:a.name})]},`${a.kind}:${a.name}`))}),(0,w.jsx)("span",{className:"gx-subject",children:e.subject}),(0,w.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:Rt(e.time)}),(0,w.jsx)("span",{className:"gx-author",children:e.author}),(0,w.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function Co({summary:e,laneCount:t,rowHeight:n,top:r,selected:o,cursor:i,t:l,onSelect:c}){let u=Mt(t),g=u/Math.max(1,t)/2,p=0,v=0,N=0;for(let D of e.groups)for(let T of D.files){let R=e.stats.get(T.path);R!==void 0&&(p+=R.additions??0,v+=R.deletions??0,N+=1)}return(0,w.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:r},"data-selected":o?"true":"false","data-cursor":i?"true":"false","data-testid":"git-uncommitted-row",title:l("uncommitted.hint"),"aria-label":l("uncommitted.hint"),onClick:c,children:[(0,w.jsx)("svg",{className:"gx-graph",width:u,height:n,viewBox:`0 0 ${String(u)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:(0,w.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:g,cy:n/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,w.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,w.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${l("uncommitted.label")} (${String(e.fileCount)})`}),(0,w.jsx)("span",{className:"gx-time",children:N===0?null:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("span",{className:"gx-add",children:`+${String(p)}`})," ",(0,w.jsx)("span",{className:"gx-del",children:`-${String(v)}`})]})}),(0,w.jsx)("span",{className:"gx-author"}),(0,w.jsx)("span",{className:"gx-hash"})]})}var To=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function Eo({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:i,onKeyDown:l,onReset:c}){let u=a=>Oe.find(g=>g.id===a);return(0,w.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:To.map(a=>{let g=a.id==="graph"||a.id==="subject"?void 0:u(a.id);return(0,w.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${a.id}`,children:[(0,w.jsx)("span",{className:"gx-colhead-label",children:n(a.key)}),g===void 0?null:(0,w.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(a.key)}`,"aria-valuemin":g.min,"aria-valuemax":g.max,"aria-valuenow":e[g.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${g.id}`,onPointerDown:p=>r(g.id,p),onPointerMove:o,onPointerUp:i,onPointerCancel:i,onLostPointerCapture:i,onKeyDown:p=>l(g.id,p),onDoubleClick:()=>c(g.id)})]},a.id)})})}function jn(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:i,hasMore:l,loadingMore:c,loadError:u,searching:a,search:g,t:p,onSelect:v,onLoadMore:N,onSearch:D,onSelectUncommitted:T}=e,R=(0,W.useRef)(null),[B,y]=(0,W.useState)(0),[G,F]=(0,W.useState)(0),J=(0,W.useRef)(!1),[U]=(0,W.useState)(()=>e.columnStorage===void 0?Ro():e.columnStorage),[m,L]=(0,W.useState)(()=>Lt(U)),[me,ee]=(0,W.useState)(0),X=Bt(gn),M=(0,W.useRef)(null),[$,re]=(0,W.useState)(void 0),k=e.workingTree,E=k!==void 0&&k.fileCount>0,_=E?1:0,z=t.length+_,K=r===void 0?-1:r===Te?E?0:-1:t.findIndex(h=>h.hash===r)+(E?1:0),xe=$===void 0?void 0:$<_?Te:t[$-_]?.hash,ce=(0,W.useRef)(void 0);(0,W.useEffect)(()=>{let h=R.current;if(h===null)return;let f=()=>{F(h.clientHeight),ee(Math.max(0,h.offsetWidth-h.clientWidth))};if(f(),typeof ResizeObserver>"u")return;let q=new ResizeObserver(f);return q.observe(h),()=>q.disconnect()},[t.length]),(0,W.useEffect)(()=>{c||(J.current=!1)},[c]);let de=(0,W.useCallback)(()=>{!l||c||J.current||(J.current=!0,N())},[l,c,N]),Y=h=>{let f=h.currentTarget;y(f.scrollTop),f.scrollTop+f.clientHeight>=f.scrollHeight-160&&de()};(0,W.useEffect)(()=>{let h=xe;if(h===void 0)return;let f=h===Te?E?0:-1:t.findIndex(q=>q.hash===h)+_;f!==$&&f>=0?re(f):f<0&&re(void 0)},[t,$,xe,E,_]),(0,W.useEffect)(()=>{let h=ce.current!==r;ce.current=r,!(!h||$===void 0||r===void 0)&&K>=0&&K!==$&&re(K)},[r,t,$,K]),(0,W.useEffect)(()=>{if($===void 0)return;let h=R.current;if(h===null)return;let f=mn({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:X,index:$,rowCount:z});f!==h.scrollTop&&(h.scrollTop=f,y(f))},[$,z,X]),(0,W.useEffect)(()=>{if($===void 0)return;let h=$-_;h<0||!dn(h,t.length,ko)||de()},[$,t.length,de,_]);let ie=(0,W.useCallback)(h=>{let f=Qe({key:h.key,composing:h.nativeEvent.isComposing,alt:h.altKey,ctrl:h.ctrlKey,meta:h.metaKey,shift:h.shiftKey});if(f===null)return;h.preventDefault();let q=$??(K>=0?K:void 0),te=Ze(q,f,z);if(te===void 0)return;if(re(te),te===0&&E){T?.();return}let he=t[te-_];he!==void 0&&v(he.hash)},[t,$,E,v,T,z,_,K]),pe=nt(Array.from({length:z},(h,f)=>f),{scrollTop:B,height:G===0?480:G,rowHeight:X}),be=Math.max(1,bn(n)),ue=(0,W.useCallback)((h,f)=>{if(!(f.button!==0||M.current!==null)){f.preventDefault(),f.stopPropagation();try{f.currentTarget.setPointerCapture(f.pointerId)}catch{return}M.current={pointerId:f.pointerId,startX:f.clientX,baseWidth:m[h],restWidth:m[h],id:h},document.body.classList.add("gx-col-resizing")}},[m]),se=(0,W.useCallback)(h=>{let f=M.current;if(f===null||f.pointerId!==h.pointerId)return;let q=Et(f.id,f.baseWidth+h.clientX-f.startX);L(te=>({...te,[f.id]:q}))},[]),ne=(0,W.useCallback)(h=>{let f=M.current;if(f===null||f.pointerId!==h.pointerId)return;M.current=null,document.body.classList.remove("gx-col-resizing");try{h.currentTarget.releasePointerCapture(h.pointerId)}catch{}let q=f.baseWidth+h.clientX-f.startX;if(Kn(q,f.baseWidth)){L(te=>({...te,[f.id]:f.restWidth}));return}L(it(U,f.id,q))},[U]),ye=(0,W.useCallback)(h=>{L(it(U,h,ge[h]))},[U]),ve=(0,W.useCallback)((h,f)=>{if(f.nativeEvent.isComposing)return;let q=Bn(f.key,f.altKey||f.ctrlKey||f.metaKey||f.shiftKey);if(q===null)return;if(f.preventDefault(),f.stopPropagation(),q.kind==="reset"){ye(h);return}let te=Oe.find(Ke=>Ke.id===h);if(te===void 0)return;let he=q.kind==="nudge"?m[h]+q.delta:q.kind==="min"?te.min:te.max;L(it(U,h,he))},[ye,U,m]),Le=(0,W.useMemo)(()=>({"--gx-col-graph":`${String(Mt(be))}px`,"--gx-col-refs":`${String(m.refs)}px`,"--gx-col-time":`${String(m.time)}px`,"--gx-col-author":`${String(m.author)}px`,"--gx-col-hash":`${String(m.hash)}px`,"--gx-row-h":`${String(X)}px`}),[be,X,m]),Me=g.trim()!=="",De=Me?p("history.noMatch"):e.emptyTitle??p("history.empty"),P=Me?void 0:e.emptyDescription;return(0,w.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:Le,children:[(0,w.jsxs)("header",{className:"gx-pane-head",children:[(0,w.jsx)("span",{children:p("history.title")}),(0,w.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(i)}`}),(0,w.jsx)("span",{className:"gx-spacer"}),(0,w.jsx)("input",{className:"gx-filter",type:"search",value:g,spellCheck:!1,placeholder:p("history.search"),"aria-label":p("history.search"),"data-testid":"gx-history-search",onChange:h=>D(h.currentTarget.value)})]}),t.length===0&&!(E&&!Me)?(0,w.jsxs)("div",{className:"gx-empty",children:[(0,w.jsx)("strong",{children:De}),P===void 0?null:(0,w.jsx)("span",{children:P}),e.onRetry===void 0?null:(0,w.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??p("action.retry")})]}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(Eo,{widths:m,gutter:me,t:p,onPointerDown:ue,onPointerMove:se,onPointerEnd:ne,onKeyDown:ve,onReset:ye}),(0,w.jsx)("div",{className:"gx-scroll",ref:R,tabIndex:0,"data-testid":"git-history-scroll",onScroll:Y,onKeyDown:ie,children:(0,w.jsx)("div",{className:"gx-vlist",style:{height:z*X},children:pe.rows.map(h=>{let f=h*X;if(h===0&&E&&k!==void 0)return(0,w.jsx)(Co,{summary:k,laneCount:be,rowHeight:X,top:f,selected:r===Te,cursor:$===0,t:p,onSelect:()=>{re(0),T?.()}},"uncommitted");let q=h-_,te=t[q];return te===void 0?null:(0,w.jsx)(So,{commit:te,row:n[q],laneCount:be,rowHeight:X,top:f,selected:te.hash===r,head:te.hash===o,cursor:h===$,onSelect:he=>{re(h),v(he)}},te.hash)})})})]}),(0,w.jsxs)("footer",{className:"gx-loadbar",children:[(0,w.jsx)("span",{children:`${p("history.loaded")} ${String(t.length)}`}),u===void 0?null:(0,w.jsx)("span",{className:"gx-del",children:u}),a?(0,w.jsx)("span",{className:"gx-search-status",children:p("history.searching")}):null,(0,w.jsx)("span",{className:"gx-spacer"}),l?(0,w.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:c,onClick:de,children:p(c?"history.loading":"history.loadMore")}):(0,w.jsx)("span",{children:t.length===0?"":p("history.noMore")})]})]})}function Nt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var Pt="git-explorer.detailHeight";function Vn(e){return Math.min(88,Math.max(6,e))}function He(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function Be(e,t){let n=t>0?t:600;return Vn(Math.round(e/n*1e3)/10)}function Un(e,t){let n=t>0?t:600;return e/100*n}function qn(e){if(e==null)return null;let t;try{t=e.getItem(Pt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function at(e,t){let n=Math.round(Vn(t)*10)/10;if(e!=null)try{e.setItem(Pt,String(n))}catch{}return n}function Xn(e){if(e!=null)try{e.removeItem(Pt)}catch{}}function Yn(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var C=require("react/jsx-runtime"),Io=250;function Ho(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Zn(e,t){let n=fn(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function Do(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var Ao={display:"flex",alignItems:"center",gap:8};function Go(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Fo=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function st({title:e,description:t,actionLabel:n,onAction:r}){return(0,C.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,C.jsx)("strong",{children:e}),t===void 0?null:(0,C.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,C.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function _o(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function er(e){let{workbench:t,version:n,t:r,remote:o,reference:i,referenceSourceAvailable:l}=e;function c(u){let a=u.sessionId??t.currentSessionId(),g=(0,b.useRef)(a);g.current=a;let v=(u.useInput??(()=>{}))(s=>s.phase),N=(0,b.useMemo)(()=>o(),[o]),[D]=(0,b.useState)(Qt),[T,R]=(0,b.useState)(()=>({kind:Ho(a,N!==void 0)})),[B,y]=(0,b.useState)(0),[G,F]=(0,b.useState)([]),[J,U]=(0,b.useState)(!1),[m,L]=(0,b.useState)(!1),[me,ee]=(0,b.useState)(void 0),[X,M]=(0,b.useState)(void 0),[$,re]=(0,b.useState)(""),[k,E]=(0,b.useState)(!1),_=(0,b.useRef)(""),z=(0,b.useRef)(0),K=(0,b.useRef)(void 0),xe=(0,b.useRef)(void 0),[ce,de]=(0,b.useState)(!0),Y=(0,b.useMemo)(()=>Go(),[]),[ie,pe]=(0,b.useState)(()=>_n(Y)),be=(0,b.useRef)(null),ue=(0,b.useRef)(null),[se,ne]=(0,b.useState)(()=>qn(Y)),ye=(0,b.useRef)(null),ve=(0,b.useRef)(null),Le=(0,b.useCallback)(s=>{K.current=s,M(s),de(!1)},[]),Me=(0,b.useCallback)(()=>{de(!1)},[]),De=(0,b.useCallback)(s=>{if(s.button!==0||ue.current!==null||Fo())return;let d=be.current?.previousElementSibling;if(d instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}ue.current={pointerId:s.pointerId,startX:s.clientX,baseWidth:d.getBoundingClientRect().width,restWidth:ie},document.body.classList.add("gx-pane-resizing")}},[ie]),P=(0,b.useCallback)(s=>{let d=ue.current;d===null||d.pointerId!==s.pointerId||pe(Ct(d.baseWidth+s.clientX-d.startX))},[]),h=(0,b.useCallback)(s=>{let d=ue.current;if(d===null||d.pointerId!==s.pointerId)return;ue.current=null,document.body.classList.remove("gx-pane-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let S=d.baseWidth+s.clientX-d.startX;if($e(S,d.baseWidth)){pe(d.restWidth);return}pe(rt(Y,S))},[Y]),f=(0,b.useCallback)(()=>{zn(Y),pe(null)},[Y]),q=(0,b.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let d=Wn(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(d===null)return;if(s.preventDefault(),s.stopPropagation(),d.kind==="reset"){f();return}if(d.kind==="min"||d.kind==="max"){let A=d.kind==="min"?240:560;pe(rt(Y,A));return}let S=be.current?.previousElementSibling,oe=S instanceof HTMLElement?S.getBoundingClientRect().width:ie??240;pe(rt(Y,oe+d.delta))},[Y,f,ie]),te=(0,b.useCallback)(()=>{let s=ye.current?.parentElement;return s instanceof HTMLElement?s.getBoundingClientRect().height:0},[]),he=(0,b.useCallback)(()=>te()||600,[te]),Ke=(0,b.useCallback)(()=>{let s=he();return He(Un(se===null?38:se,s),s)},[he,se]),cr=(0,b.useCallback)(s=>{if(s.button!==0||ve.current!==null)return;let d=ye.current?.parentElement;if(!(d instanceof HTMLElement))return;let S=ye.current?.nextElementSibling;if(S instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}ve.current={pointerId:s.pointerId,startY:s.clientY,baseHeight:S.getBoundingClientRect().height,columnHeight:d.getBoundingClientRect().height||600,restHeight:se},document.body.classList.add("gx-row-resizing")}},[se]),dr=(0,b.useCallback)(s=>{let d=ve.current;if(d===null||d.pointerId!==s.pointerId)return;let S=He(d.baseHeight-(s.clientY-d.startY),d.columnHeight);ne(Be(S,d.columnHeight))},[]),ct=(0,b.useCallback)(s=>{let d=ve.current;if(d===null||d.pointerId!==s.pointerId)return;ve.current=null,document.body.classList.remove("gx-row-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let S=He(d.baseHeight-(s.clientY-d.startY),d.columnHeight);if($e(S,d.baseHeight)){ne(d.restHeight);return}ne(at(Y,Be(S,d.columnHeight)))},[Y]),dt=(0,b.useCallback)(()=>{Xn(Y),ne(null)},[Y]),ur=(0,b.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let d=Yn(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(d===null)return;if(s.preventDefault(),s.stopPropagation(),d.kind==="reset"){dt();return}let S=he();if(d.kind==="min"||d.kind==="max"){let A=d.kind==="min"?He(180,S):He(S,S);ne(at(Y,Be(A,S)));return}let oe=He(Ke()+d.delta,S);ne(at(Y,Be(oe,S)))},[he,Ke,Y,dt]);(0,b.useEffect)(()=>()=>{ue.current!==null&&document.body.classList.remove("gx-pane-resizing"),ve.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,b.useEffect)(()=>{if(a===void 0||u.openView===void 0)return;let s=t.views;if(s?.bind!==void 0)return s.bind(a,u.openView)},[a,u.openView,t]),(0,b.useEffect)(()=>{if(a===void 0){R({kind:"idle"});return}if(N===void 0){R({kind:"no-service"});return}let s=!0;return R({kind:"loading"}),ee(void 0),z.current+=1,_.current="",re(""),E(!1),Promise.resolve().then(()=>N.snapshot({sessionId:a})).then(d=>{if(!s)return;let S=Re(d);if(!S.ok){R({kind:"failed",message:S.message});return}let oe=S.result;if(!oe.ok){R({kind:"failed",message:oe.error.message===""?oe.error.code:oe.error.message});return}let A=oe.snapshot;R({kind:"ready",snapshot:A}),F(A.commits),U(A.commits.length<A.counts.commits);let Q=K.current;K.current=void 0,M(ae=>{if(Q!==void 0)return Q;let ke=ze(A.status).length>0;return ae===Te?ke?ae:A.commits[0]?.hash:ae!==void 0&&A.commits.some(Ge=>Ge.hash===ae)?ae:A.commits[0]?.hash})}).catch(d=>{s&&R({kind:"failed",message:Se(d)})}),()=>{s=!1}},[a,N,B]),(0,b.useEffect)(()=>{let s=u.viewRequest;if(s==null||s.view!==Fe)return;let d=`${s.view}:${s.focus}`;xe.current!==d&&(xe.current=d,Zn(s.focus,{select:Le,complete:()=>u.completeViewRequest?.()}))},[u.viewRequest,u.completeViewRequest,Le]),(0,b.useEffect)(()=>{let s=t.viewFocus;if(s===void 0||a===void 0)return;let d=()=>{let S=s.take(Fe);S!==void 0&&Zn(S,{select:Le})};return d(),s.subscribe(d)},[t,a,Le]);let pr=(0,b.useMemo)(()=>xn(G),[G]),le=T.kind==="ready"?T.snapshot:void 0,je=(0,b.useMemo)(()=>le===void 0?[]:ze(le.status),[le]),ut=(0,b.useMemo)(()=>{let s=new Map;for(let d of le?.stats??[])s.set(d.path,{additions:d.additions,deletions:d.deletions});return s},[le]),Ve=(0,b.useMemo)(()=>{let s=new Map;for(let d of le?.branches??[]){let S=s.get(d.hash);S===void 0?s.set(d.hash,[{kind:d.kind,name:d.name,head:d.head}]):S.push({kind:d.kind,name:d.name,head:d.head})}return s},[le]);(0,b.useEffect)(()=>{if(a===void 0||N===void 0||T.kind!=="ready")return;let s=$.trim();if(s===_.current)return;let d=a,S=z.current+1;if(z.current=S,ee(void 0),L(!1),s===""){_.current="",E(!1);let A=T.snapshot.commits;F(A),U(A.length<T.snapshot.counts.commits),M(Q=>Q===Te||Q!==void 0&&A.some(ae=>ae.hash===Q)?Q:A[0]?.hash);return}E(!0);let oe=setTimeout(()=>{_.current=s,Promise.resolve().then(()=>N.query(Nt(a,s,0))).then(A=>{if(z.current!==S||g.current!==d)return;let Q=Re(A);if(!Q.ok){ee(Q.message);return}let ae=Q.result;if(!ae.ok){ee(ae.error.message===""?ae.error.code:ae.error.message);return}let ke=ae.page,Ge=Ve;F(ke.commits.map(fe=>({...fe,refs:Ge.get(fe.hash)??[]}))),U(ke.hasMore),M(fe=>fe===Te||fe!==void 0&&ke.commits.some(Ne=>Ne.hash===fe)?fe:ke.commits[0]?.hash)}).catch(A=>{z.current===S&&ee(Se(A))}).finally(()=>{z.current===S&&E(!1)})},Io);return()=>{clearTimeout(oe)}},[$,a,N,T.kind,Ve]);let hr=(0,b.useCallback)(()=>{if(a===void 0||N===void 0||!J||m)return;let s=a,d=_.current,S=z.current;L(!0),ee(void 0),Promise.resolve().then(()=>N.query(Nt(a,d,G.length))).then(oe=>{if(g.current!==s||z.current!==S)return;let A=Re(oe);if(!A.ok){ee(A.message);return}let Q=A.result;if(!Q.ok){ee(Q.error.message===""?Q.error.code:Q.error.message);return}let ae=Q.page;F(ke=>{let Ge=new Set(ke.map(Ne=>Ne.hash)),fe=ae.commits.filter(Ne=>!Ge.has(Ne.hash)).map(Ne=>({...Ne,refs:Ve.get(Ne.hash)??[]}));return fe.length===0?ke:[...ke,...fe]}),U(ae.hasMore)}).catch(oe=>ee(Se(oe))).finally(()=>L(!1))},[a,N,J,m,G.length,Ve]),fr=(0,b.useMemo)(()=>{let s=t.views??{open:(d,S)=>t.openView?.(d,S)??!1};return tt({views:s,sessionId:a??""})},[t,a]),Ht=(s,d=1)=>{a!==void 0&&fr(s,d)},gr=(0,b.useMemo)(()=>{let s={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(d,S)=>t.openViewOrSwitch?.(d,S)??{opened:!1,focused:!1}}};return hn({seam:s,sessionId:a??""})},[t,a]),mr=(s,d=1)=>{a!==void 0&&X!==void 0&&gr(X,s,d)},xr=s=>{let d=u.inputActions;if(a===void 0||d===void 0)return"failed";let S=i?.(a),oe=En({captureSpan:()=>{let A=d.captureInsertion?.();return A===void 0?void 0:{start:A.start,end:A.end,draftRev:A.draftRev}},insertReference:(A,Q)=>S?.insertReference?.(A,Q)??!1,insertText:(A,Q)=>d.insertText?.(A,Q)??!1,canInsertReference:l?.()===!0},s);return oe!=="failed"?S?.focus?.():S?.notify?.("error",r("reference.failed")),oe},Ae=(0,b.useCallback)(()=>y(s=>s+1),[]),Bo=()=>y(s=>s+1);(0,b.useEffect)(()=>Do(D,Ae),[D,Ae]);let we=le?.head,Ue=je.reduce((s,d)=>s+d.files.length,0),qe=(0,b.useMemo)(()=>Ue===0?void 0:{groups:je,stats:ut,fileCount:Ue},[Ue,je,ut]),br=(0,b.useMemo)(()=>{if(X===void 0)return;let s=G.find(d=>d.hash===X);return s===void 0?void 0:s.refs.map(d=>d.name)},[G,X]);return(0,C.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":T.kind,"data-session":a??"","data-testid":"git-explorer-view",children:[(0,C.jsxs)("header",{className:"gx-head",children:[(0,C.jsxs)("div",{className:"gx-head-main",children:[(0,C.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,C.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,C.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,C.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,C.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,C.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,C.jsx)("span",{className:"gx-repo",title:le?.root??r("view.title"),children:le===void 0?r("view.title"):_o(le.root)}),we?.branch===null||we?.branch===void 0?null:(0,C.jsx)("span",{className:"gx-branch",children:we.branch}),we?.detached===!0?(0,C.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,we?.ahead!==void 0&&we.ahead>0?(0,C.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(we.ahead)}`}):null,we?.behind!==void 0&&we.behind>0?(0,C.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(we.behind)}`}):null]}),(0,C.jsxs)("div",{className:"gx-head-meta",style:Ao,children:[le===void 0?null:(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)("span",{children:[r("head.changes")," ",(0,C.jsx)("b",{children:Ue})]}),(0,C.jsxs)("span",{children:[r("head.commits")," ",(0,C.jsx)("b",{children:le.counts.commits})]}),(0,C.jsxs)("span",{children:[r("head.branches")," ",(0,C.jsx)("b",{children:le.counts.branches})]})]}),(0,C.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:T.kind==="loading",onClick:Ae,children:"\u21BB"})]})]}),a===void 0?(0,C.jsx)(st,{title:r("state.noSession.title"),description:r("state.noSession.description")}):T.kind==="no-service"?(0,C.jsx)(st,{title:r("state.noService.title"),description:r("state.noService.description")}):T.kind==="loading"?(0,C.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):T.kind==="failed"?(0,C.jsx)(st,{title:r("state.failed.title"),description:T.message,actionLabel:r("action.retry"),onAction:Ae}):T.kind==="ready"&&!T.snapshot.isRepository?(0,C.jsx)(st,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Ae}):T.kind==="ready"?(0,C.jsxs)("div",{className:"gx-body",style:ie===null?void 0:{"--gx-left-col":`${ie}px`},children:[(0,C.jsx)(Pn,{groups:je,stats:ut,t:r,onOpen:Ht,claimFocus:ce,onFocusClaimed:Me}),(0,C.jsx)("div",{ref:be,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":ie??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:De,onPointerMove:P,onPointerUp:h,onPointerCancel:h,onLostPointerCapture:h,onKeyDown:q,onDoubleClick:f}),(0,C.jsxs)("div",{className:"gx-col",style:se===null?void 0:{"--gx-detail-h":`${String(se)}%`},children:[(0,C.jsx)(jn,{commits:G,graph:pr,selectedHash:X,headHash:T.snapshot.head?.hash??null,total:T.snapshot.counts.commits,hasMore:J,loadingMore:m,loadError:me,searching:k,search:$,t:r,onSelect:M,onLoadMore:hr,onSearch:re,workingTree:qe,onSelectUncommitted:()=>M(Te),...T.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Ae,retryLabel:r("action.retry")}:{}}),(0,C.jsx)("div",{ref:ye,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":se??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:cr,onPointerMove:dr,onPointerUp:ct,onPointerCancel:ct,onLostPointerCapture:ct,onKeyDown:ur,onDoubleClick:dt}),X===Te&&qe!==void 0?(0,C.jsx)(Dn,{groups:qe.groups,stats:qe.stats,t:r,onOpen:Ht}):(0,C.jsx)(Hn,{sessionId:a,hash:X,remote:N,t:r,onSelect:M,onOpenFile:mr,refs:br,...u.inputActions===void 0?{}:{inputActions:u.inputActions},...v===void 0?{}:{phase:v},sourceAvailable:l?.()===!0,onReference:xr})]})]}):null]})}return c}var nr=["slots","locale","workbench","remote"];function tr(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function rr(e){return()=>{try{let n=e.remote?.gitExplorer;if(tr(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(tr(n))return n}catch{}let t=or(e);return t===void 0?void 0:Yt(t)}}function or(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,i)=>n.call("/api",`${jt}/${r}`,o,i)}function ir(e){return t=>{let n=e.get?.("sessions"),r=e.get?.("conversation");if(n?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=n.scope(t);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,l=o.focus,c=o.notify;return{...typeof i=="function"?{insertReference:(u,a)=>i.call(o,u,a)}:{},...typeof l=="function"?{focus:()=>l.call(o)}:{},...typeof c=="function"?{notify:(u,a)=>c.call(o,u,a)}:{}}}}var lt;function ar(e){let t=e.locale.bind(_e);lt?.();let n=e.locale.register(_e,{zh:Dt,en:At});lt=n;let r=Rn(typeof document>"u"?void 0:document),o=Ot(e),i=rr(e),l=ir(e),c=Mn(e),u=ln({store:Jt(i),t});e.slots.inject(mt,()=>e.slots.register({name:mt,id:Kt,order:30,locale:_e},u));let a=e.workbench;if(a!=null){let g=er({workbench:a,version:a.version,t,remote:i,reference:l,referenceSourceAvailable:()=>c.available});e.slots.inject(gt,()=>e.slots.register({name:gt,id:Fe,order:110,label:()=>t("tab.label"),locale:_e},g))}return()=>{r(),o(),c.dispose(),n(),lt===n&&(lt=void 0)}}var sr={groupChanges:ze,formatCommitDetail:et,createJump:tt,computeWindow:nt},lr={name:"dsh-git-explorer",inject:nr,apply:ar,__test:sr},$o=lr;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
