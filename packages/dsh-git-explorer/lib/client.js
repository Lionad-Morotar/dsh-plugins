window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var yt=Object.defineProperty;var Fr=Object.getOwnPropertyDescriptor;var Gr=Object.getOwnPropertyNames;var zr=Object.prototype.hasOwnProperty;var Or=(e,t)=>{for(var n in t)yt(e,n,{get:t[n],enumerable:!0})},_r=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Gr(t))!zr.call(e,o)&&o!==n&&yt(e,o,{get:()=>t[o],enumerable:!(r=Fr(t,o))||r.enumerable});return e};var $r=e=>_r(yt({},"__esModule",{value:!0}),e);var xi={};Or(xi,{__test:()=>Cr,apply:()=>Rr,boot:()=>pn,clientPlugin:()=>Tr,createReferenceResolver:()=>wr,createRemoteResolver:()=>yr,createRpcCall:()=>vr,createWorkspaceSwitch:()=>kr,createWorkspaceWatch:()=>Sr,default:()=>mi,inject:()=>br});module.exports=$r(xi);var jt={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","workspace.title":"\u5207\u6362\u5DE5\u4F5C\u533A","workspace.search":"\u641C\u7D22\u5DE5\u4F5C\u533A","workspace.empty":"\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A","workspace.none":"\u8FD8\u6CA1\u6709\u6CE8\u518C\u5DE5\u4F5C\u533A","workspace.failed":"\u5207\u6362\u5DE5\u4F5C\u533A\u5931\u8D25","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","compare.action":"\u4E0E HEAD \u5BF9\u6BD4","compare.hint":"\u5728\u8BC4\u5BA1\u89C6\u56FE\u91CC\u5BF9\u6BD4\u8FD9\u4E2A\u63D0\u4EA4\u4E0E HEAD","reference.action":"\u5F15\u7528","reference.hint":"\u628A\u8FD9\u4E2A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","reference.disabled.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","reference.disabled.noComposer":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","reference.disabled.busy":"\u8F93\u5165\u6846\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u8BD5","reference.disabled.noSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","reference.failed":"\u65E0\u6CD5\u628A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Vt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","workspace.title":"Switch workspace","workspace.search":"Search workspaces","workspace.empty":"No matching workspace","workspace.none":"No workspace registered yet","workspace.failed":"Could not switch workspace","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","compare.action":"Compare to HEAD","compare.hint":"Compare this commit against HEAD in the review view","reference.action":"Reference","reference.hint":"Insert this commit into the composer","reference.disabled.noSession":"No session to insert into","reference.disabled.noComposer":"This host has no composer to insert into","reference.disabled.busy":"The composer is sending; try again in a moment","reference.disabled.noSource":"The reference source is not registered, so the chip could not be sent","reference.failed":"Could not insert the commit into the composer","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var Yt=require("react"),Jt=14,Br="--dsh-content-font-size",qt=Jt;function Kr(e,t){return Math.max(e,Math.round(e*t/Jt))}function jr(e,t){if(e===void 0)return t;let n=Number.parseFloat(e);return Number.isFinite(n)&&n>0?n:t}function Qt(){return typeof document>"u"||document.body===null?qt:jr(document.body.style.getPropertyValue(Br),qt)}var vt=Qt(),wt=new Set;function Ut(){return vt}function Vr(e){return wt.add(e),()=>{wt.delete(e)}}function qr(e){if(e!==vt){vt=e;for(let t of[...wt])t()}}function Xt(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function Ur(e){if(e===null||typeof e!="object")return;let t=e.fontSizes;if(t===null||typeof t!="object")return;let n=t.text;return typeof n=="number"&&Number.isFinite(n)&&n>0?n:void 0}function Xr(e){try{let t=e.get?.("theme");if(Xt(t))return t}catch{}try{let t=e.theme;if(Xt(t))return t}catch{}}function Zt(e){let t=e.inject;if(typeof t!="function")return()=>{};let n,r;try{let o=t.call(e,["theme"],i=>{let a=Xr(i);if(a===void 0)return;let s=()=>{try{let f=Ur(a.getTheme());qr(f??Qt())}catch{}};s();let u=i.on?.("theme/change",s);if(typeof u!="function")return;let d=u;return n=d,d});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{n?.(),r?.()}}function en(e){let t=(0,Yt.useSyncExternalStore)(Vr,Ut,Ut);return Kr(e,t)}var kt="conversation.view",ve="git-explorer";var St="conversation.session.header.actions",tn="git-branch";var Oe="git-explorer",nn="gitExplorer";var F=require("react");var rn=Object.freeze([]);function on(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:rn}));let r=[];return e.forEach((o,i)=>{let a=Yr(o.name,n);a!==void 0&&r.push({match:{branch:o,ranges:Jr(a)},order:i,run:Qr(a)})}),r.sort((o,i)=>i.run-o.run||o.order-i.order),r.map(o=>o.match)}function Rt(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&Ct(n.branch))return t}return-1}function an(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return Rt(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&Ct(o.branch))return r}return t}function sn(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!Ct(n.branch)))return n.branch}function Ct(e){return e.worktreePath===void 0}function Yr(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let i=t.charAt(o).toLowerCase(),a=-1;for(let s=r;s<e.length;s+=1)if(e.charAt(s).toLowerCase()===i){a=s;break}if(a===-1)return;n.push(a),r=a+1}return n}function Jr(e){let t=e[0];if(t===void 0)return rn;let n=[],r=t,o=t+1;for(let i=1;i<e.length;i+=1){let a=e[i];if(a!==void 0){if(a===o){o=a+1;continue}n.push([r,o]),r=a,o=a+1}}return n.push([r,o]),n}function Qr(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function ln(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function Te(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Ee(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Ze="service-unavailable",Zr=Object.freeze({status:"idle",revision:0,sessionId:null}),Tt;function eo(e){let t=Zr,n=-1,r=0,o=new Set,i=d=>{t=d;for(let f of[...o])f()},a=d=>t.sessionId===d&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(d){return o.add(d),()=>{o.delete(d)}},getSnapshot:()=>t,load:async d=>{if(a(d))return;let f=e(),l=++r,h=t.revision,D=t.sessionId===d;i({status:"loading",...D&&t.list!==void 0?{list:t.list}:{},revision:h,sessionId:d});let P=()=>l!==r||t.revision!==h;if(typeof f?.branches!="function"){if(P())return;i({status:"error",error:Ze,revision:h,sessionId:d});return}try{let N=await f.branches({sessionId:d});if(P())return;let C=Te(N);if(!C.ok){i({status:"error",error:C.message,revision:h,sessionId:d});return}if(C.result.ok===!1){i({status:"error",error:C.result.error.message,revision:h,sessionId:d});return}n=h,i({status:"ready",list:C.result.list,revision:h,sessionId:d})}catch(N){if(P())return;i({status:"error",error:Ee(N),revision:h,sessionId:d})}},switchTo:async(d,f)=>{let l=()=>t.sessionId!==d,h=e();if(typeof h?.switchBranch!="function")return l()||i({...t,error:Ze}),{switched:!1};try{let D=await h.switchBranch({sessionId:d,name:f}),P=Te(D),N=P.ok?P.result.ok===!1?P.result.error.message:void 0:P.message;if(N!==void 0)return l()||i({...t,error:N}),{switched:!1};if(l())return{switched:!0};let C=P.ok&&P.result.ok===!0?P.result:void 0,T=C===void 0?f:C.branch,y=t.list;return i({status:y===void 0?t.status:"ready",...y===void 0?{}:{list:{...y,detached:!1,headHash:null,branches:y.branches.map(G=>({...G,current:G.name===T}))}},revision:t.revision+1,sessionId:d}),C===void 0||C.stash===void 0?{switched:!0}:{switched:!0,stash:C.stash}}catch(D){return l()||i({...t,error:Ee(D)}),{switched:!1}}},bump(){i({...t,revision:t.revision+1})}}}function to(e){return Tt=eo(e),Tt}var cn=to;function dn(){return Tt}var Pe=require("react"),no=Object.freeze({}),et=null,Et;function pn(e){et=e}function tt(){if(Et!=null)return Et;if(et===null)return no;let e=un(et,"@deepseek-ai/dsh-client-ui-primitives"),t=un(et,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,i=e?.useDismissOnOutsidePointer,a=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof i=="function"?{useDismissOnOutsidePointer:i}:{},...typeof a=="function"?{createPortal:a}:{}}}function un(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var fn={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},hn=e=>(0,Pe.createElement)("svg",{...fn,className:e.className},(0,Pe.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,Pe.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,Pe.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,Pe.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,Pe.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),gn=e=>(0,Pe.createElement)("svg",{...fn,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,Pe.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var z=require("react/jsx-runtime"),mn=320,ro="min(420px, 100vw - 32px)",xn=5,nt=8;function oo(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:xn,margin:nt})??void 0:io(t,n)}function io(e,t){let[n,r]=(0,F.useState)(void 0);return(0,F.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let i=t.current;if(i===null)return;let a=i.getBoundingClientRect(),s=Math.min(mn,Math.max(160,window.innerWidth-nt*2)),u=Math.min(Math.max(a.right-s,nt),window.innerWidth-s-nt);r({left:u,top:a.bottom+xn,width:s})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function ao(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}so(t,n,o,i)}function so(e,t,n,r){(0,F.useEffect)(()=>{if(!n)return;let o=i=>{let a=i.target;a instanceof Node&&e.current?.contains(a)!==!0&&t.current?.contains(a)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function lo(e,t){let n=[],r=0;return t.forEach((o,i)=>{let[a,s]=o;a>r&&n.push((0,z.jsx)("span",{children:e.slice(r,a)},`plain-${i}`)),n.push((0,z.jsx)("span",{className:"gx-branch-match",children:e.slice(a,s)},`hit-${i}`)),r=s}),r<e.length&&n.push((0,z.jsx)("span",{children:e.slice(r)},"tail")),n}function co(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function uo(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let i=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${i}`)}if(e.untrackedFiles>0){let i=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${i}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function bn({store:e,t}){function n({sessionId:r}){let o=(0,F.useSyncExternalStore)(e.subscribe,e.getSnapshot),[i,a]=(0,F.useState)(!1),[s,u]=(0,F.useState)(""),[d,f]=(0,F.useState)(-1),[l,h]=(0,F.useState)(null),[D,P]=(0,F.useState)(null),N=(0,F.useRef)(r);N.current=r;let C=(0,F.useRef)(null),T=(0,F.useRef)(null),y=(0,F.useRef)(null),G=(0,F.useRef)(null),Q=(0,F.useRef)(null),$=(0,F.useRef)(!1),B=(0,F.useId)(),g=(0,F.useId)(),W=tt(),ee=W.createPortal!==void 0,pe=W.IconBranch??hn,te=W.IconChevron??gn,S=o.list,L=S===void 0?void 0:co(S.root),K=(0,F.useMemo)(()=>on(S?.branches??[],s),[S,s]),ne=(0,F.useCallback)(()=>{a(!1),u(""),P(null)},[]),w=(0,F.useCallback)(()=>{$.current=!0,ne(),T.current?.focus({preventScroll:!0})},[ne]),I=(0,F.useCallback)(()=>{$.current=!0,ne()},[ne]);(0,F.useEffect)(()=>{ne(),h(null),r!==void 0&&e.load(r)},[e,r,ne]),(0,F.useLayoutEffect)(()=>{i&&G.current?.focus({preventScroll:!0})},[i]),(0,F.useLayoutEffect)(()=>{if(i||!$.current)return;$.current=!1;let H=document.activeElement;(H===null||H===document.body||H===T.current||C.current?.contains(H)===!0)&&T.current?.focus({preventScroll:!0})},[i]),(0,F.useEffect)(()=>{f(Rt(K))},[K]),(0,F.useEffect)(()=>{Q.current?.scrollIntoView?.({block:"nearest"})},[d,K]),(0,F.useEffect)(()=>{if(!i)return;let H=m=>{m.key!=="Escape"||m.isComposing||(m.preventDefault(),w())};return document.addEventListener("keydown",H),()=>document.removeEventListener("keydown",H)},[i,w]);let Z=oo(W,i,T,y);ao(W,C,y,ee,i,I);let j=()=>{if(i){ne();return}a(!0),r!==void 0&&e.load(r)},V=()=>{r!==void 0&&e.load(r)},fe=async H=>{if(l!==null||H.worktreePath!==void 0)return;if(H.current){w();return}if(r===void 0)return;h(H.name);let m=await e.switchTo(r,H.name);if(N.current===r&&(h(null),!!m.switched)){if(e.load(r),m.stash?.conflict===!0){P(m.stash);return}w()}},ce=()=>{let H=sn(K,d);H!==void 0&&fe(H)},R=H=>{if(!(H.metaKey||H.ctrlKey||H.altKey)&&!H.nativeEvent.isComposing){if(H.key==="ArrowDown"||H.key==="ArrowUp"){H.preventDefault();let m=H.key==="ArrowDown"?1:-1;f(x=>an(K,x,m));return}H.key==="Enter"&&(H.preventDefault(),ce())}};if(r===void 0)return null;let ae=S?.branches.find(H=>H.current)?.name,O=S===void 0?t("branch.loading"):S.detached?S.headHash??t("head.detached"):ae??t("branch.unborn");if(!i&&S?.isRepository!==!0)return null;let he=`${t("head.detached")} ${S?.headHash??""}`.trim(),me=S?.detached===!0?he:O,ke=S?.isRepository===!0?S.worktree:void 0,se=ke===void 0?void 0:uo(ke,t),ge=t("branch.worktreeSep"),Se=se===void 0?me:se.description,Ne=se===void 0||ke?.dirty!==!0?`${t("branch.title")}: ${me}`:`${t("branch.title")}: ${me}${ge}${se.description}`,xe=o.error===Ze?t("state.noService.title"):o.error,Ie=(0,z.jsxs)("div",{ref:y,id:g,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:mn,maxWidth:ro,...Z},children:[D?.conflict===!0?(0,z.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,z.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),D.message===void 0||D.message===""?null:(0,z.jsx)("span",{className:"gx-branch-warning-detail",children:D.message})]}):null,S===void 0||L===void 0?null:(0,z.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:S.root,children:[(0,z.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,z.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,z.jsx)("span",{className:"gx-branch-scope-parent",children:L.parent}),(0,z.jsx)("span",{className:"gx-branch-scope-name",children:L.name})]})]}),(0,z.jsx)("input",{ref:G,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:s,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":S===void 0?void 0:B,"aria-activedescendant":d>=0&&S!==void 0?`${B}-option-${d}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:H=>u(H.target.value),onKeyDown:R}),xe!==void 0?(0,z.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,z.jsx)("span",{className:"gx-branch-error-text",children:xe}),(0,z.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:V,children:t("action.retry")})]}):null,o.status==="loading"&&S===void 0?(0,z.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,S!==void 0?(0,z.jsxs)("div",{className:"gx-branch-list",id:B,role:"listbox","aria-label":t("branch.title"),children:[S.branches.length===0?(0,z.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,S.branches.length>0&&K.length===0?(0,z.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,K.map((H,m)=>{let x=H.branch,U=m===d;return(0,z.jsxs)("button",{ref:U?Q:void 0,type:"button",role:"option",id:`${B}-option-${m}`,"aria-selected":U,"data-active":U?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${x.name}`,"data-current":x.current?"true":void 0,"aria-current":x.current?"true":void 0,title:x.worktreePath===void 0?x.name:`${x.name} ${t("branch.worktree")}: ${x.worktreePath}`,disabled:l!==null||x.worktreePath!==void 0,onClick:()=>{fe(x)},children:[(0,z.jsx)("span",{className:"gx-branch-row-name",children:lo(x.name,H.ranges)}),x.worktreePath===void 0?null:(0,z.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),x.current?(0,z.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},x.name)})]}):null]});return(0,z.jsxs)("div",{className:"gx-branch-action",ref:C,children:[(0,z.jsxs)("button",{ref:T,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Ne,"aria-haspopup":"dialog","aria-expanded":i,"aria-controls":i?g:void 0,title:Se,onClick:j,children:[(0,z.jsx)(pe,{className:"gx-branch-icon"}),(0,z.jsx)("span",{className:"gx-branch-name",title:me,children:O}),se===void 0||ke?.dirty!==!0?null:(0,z.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:se.dot?t("branch.worktreeDirty"):void 0,children:[se.additions>0?(0,z.jsxs)("span",{className:"gx-branch-add",children:["+",se.additions]}):null,se.deletions>0?(0,z.jsxs)("span",{className:"gx-branch-del",children:["\u2212",se.deletions]}):null,se.dot?(0,z.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,z.jsx)(te,{className:"gx-branch-chevron"})]}),i?W.createPortal===void 0?Ie:W.createPortal(Ie,document.body):null]})}return n}function yn(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function rt(e,t){let n=t>0?t:1;return Math.max(1,Math.floor(Math.max(0,e)/2/n))}function ot(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"PageDown":return"pageDown";case"PageUp":return"pageUp";case"Enter":return"activate";default:return null}}function it(e,t,n,r=10){if(n<=0)return;let o=n-1,i=Math.max(1,Math.floor(r));switch(t){case"down":return e===void 0?0:Math.min(e+1,o);case"up":return e===void 0?o:Math.max(e-1,0);case"first":return 0;case"last":return o;case"pageDown":return Math.min(e===void 0?i:e+i,o);case"pageUp":return Math.max(e===void 0?o-i:e-i,0);default:return e===void 0?0:Math.min(Math.max(e,0),o)}}function vn(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var po={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function We(e){return po[e]}var wn={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function fo(e,t){return(wn[e]??0)>=(wn[t]??0)?e:t}function kn(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function Mt(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function ho(e){let t=e.split("\0"),n=new Map,r=o=>{let i=n.get(o.path);if(i===void 0){n.set(o.path,o);return}n.set(o.path,{...i,status:fo(i.status,o.status),staged:i.staged||o.staged,isDirectory:i.isDirectory||o.isDirectory,...i.origPath===void 0&&o.origPath===void 0?{}:{origPath:i.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let i=t[o];if(i===void 0||i===""||i.startsWith("#"))continue;let a=i[0];if(a==="1"){let s=i.slice(2),u=s.slice(0,2),d=Mt(s,7);d!==""&&r({path:d,status:kn(u),staged:u[0]!==".",isDirectory:!1})}else if(a==="2"){let s=i.slice(2),u=s.slice(0,2),d=Mt(s,8),f=t[o+1]??"";d!==""&&f!==""&&(o+=1,r({path:d,status:kn(u),staged:u[0]!==".",isDirectory:!1,origPath:f}))}else if(a==="u"){let s=i.slice(2),u=Mt(s,9);u!==""&&r({path:u,status:"conflicted",staged:!1,isDirectory:!1})}else if(a==="?"){let s=i.slice(2);if(s==="")continue;let u=s.endsWith("/");r({path:u?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:u})}}return[...n.values()]}function go(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function Lt(e){let t=new Map;for(let n of e){let r=go(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,i)=>o.path.localeCompare(i.path))}))}function _e(e){return Lt(ho(e))}function It(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let i=Math.floor(o/24);if(i<7)return`${i}d`;let a=Math.floor(i/7);if(a<5)return`${a}w`;let s=Math.floor(i/30);return s<12?`${s}mo`:`${Math.floor(i/365)}y`}function at(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:It(e.time,t)}}function st({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),i=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${i}`)}}function Pt({seam:e,sessionId:t}){return(n,r,o=1)=>{let i=typeof n=="string"?n.trim().toLowerCase():"";if(i===""||typeof r!="string")return;let a=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(a==="")return;let s=Number.isFinite(o)&&o>0?Math.floor(o):1,u=`git:${i}:${String(s)}:${a}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",u);let d=e.openViewOrSwitch("fs-explorer",u);if(d.focused){e.viewFocus?.take?.("fs-explorer");return}if(d.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",u)!==!0&&e.openView?.("fs-explorer",u)!==!0&&e.viewFocus?.request?.("fs-explorer",u)}}var mo=/^commit:([0-9a-f]{4,64})$/iu;function Sn(e){if(e===void 0)return;let t=mo.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var Rn=24;function lt(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),a=Math.max(0,e.length-i-o*2),s=Math.floor(Math.max(0,t.scrollTop)/n)-o,u=Math.min(Math.max(s,0),a),d=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function Cn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return yn({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function Tn(e){let t=[],n=[],r=[],o=0,i=[],a=()=>r.length===0?o++:(r.sort((f,l)=>f-l),r.shift()??o++),s=d=>{d!==null&&!r.includes(d)&&r.push(d)},u=()=>{let d=t.indexOf(null);return d>=0?d:(t.push(null),n.push(null),t.length-1)};for(let d of e){let f=[...t],l=[...n],h=f.indexOf(d.hash),D=h>=0;D||(h=u());let P=D?n[h]??null:null;P===null&&(P=a(),n[h]=P);for(let y=0;y<f.length;y+=1)y!==h&&f[y]===d.hash&&(s(n[y]??null),t[y]=null,n[y]=null);let N=d.parents[0];N===void 0?(s(n[h]??null),t[h]=null,n[h]=null):(t[h]=N,n[h]=P);let C=[];for(let y=1;y<d.parents.length;y+=1){let G=d.parents[y];if(G===void 0)continue;let Q=t.indexOf(G);Q<0&&(Q=u(),t[Q]=G),n[Q]===null&&(n[Q]=a()),C.push(Q)}let T=[];for(let y=0;y<f.length;y+=1){let G=f[y];if(G===null)continue;let Q=l[y]??P;G===d.hash?T.push({kind:"into",from:y,to:h,color:Q}):T.push({kind:"pass",from:y,to:y,color:Q})}N!==void 0&&T.push({kind:"out",from:h,to:h,color:n[h]??P});for(let y of C)T.push({kind:"out",from:h,to:y,color:n[y]??P});for(i.push({lane:h,color:P,merge:d.parents.length>=2,segments:T});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return i}function En(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function Me(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Mn(e,t){return`${e.trim().toLowerCase()}\0${t}`}function Ln(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let i=n.keys().next();i.done||n.delete(i.value)}},get size(){return n.size}}}function In(e,t,n,r=10,o=8){let i=Math.max(o,n.width-t.width-o),a=e.right+r;a>i&&(a=e.left-t.width-r,a<o&&(a=Math.min(i,Math.max(o,e.left))));let s=Math.max(o,n.height-t.height-o),u=e.bottom+r,d=e.top-t.height-r,f;return u<=s?f=Math.max(o,u):d>=o?f=d:f=Math.min(s,Math.max(o,e.top)),{left:a,top:f}}var Pn="dsh-git-explorer-styles",xo=`
/* The token block is shared with the hover card because the card portals out of
   .gx-root and would otherwise lose the theme variables with it. */
.gx-root, .gx-preview, .gx-workspace-panel {
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
/* The switchable name keeps the label's metrics so the header does not reflow
   when the host gains the Workspace services; only the affordance is new. */
.gx-repo-switch {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  margin: -1px -5px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  font-size: calc(var(--gx-fs) * 0.9286);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 34ch;
  cursor: pointer;
}
.gx-repo-switch:hover { background: var(--gx-hover); }
.gx-repo-switch:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-repo-switch[aria-expanded="true"] { background: var(--gx-active); }
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

/* The Workspace switch reuses the branch popover's material and metrics: the
   two sit in the same header and open the same way, so a second visual language
   would read as a different kind of control. */
.gx-workspace-panel {
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
.gx-workspace-search {
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
.gx-workspace-search::placeholder { color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit)); }
.gx-workspace-search:focus-visible { border-bottom-color: var(--dsw-alias-link, var(--dsw-alias-state-business-primary, currentColor)); }
.gx-workspace-list { display: flex; flex-direction: column; gap: 0; min-width: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.gx-workspace-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  min-width: 0;
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
.gx-workspace-row:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
/* The arrow-key cursor outlives the pointer leaving the row, so it reuses the
   hover wash instead of inventing a second selection colour. */
.gx-workspace-row[data-active="true"] { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.gx-workspace-row:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, currentColor); outline-offset: -2px; }
.gx-workspace-row[data-current="true"] .gx-workspace-row-title { color: var(--dsw-alias-brand-primary, inherit); }
.gx-workspace-row-title {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}
.gx-workspace-row-path {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: calc(var(--gx-fs-code) * 0.9091);
}
.gx-workspace-empty {
  padding: 8px;
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  font-size: calc(var(--gx-fs) * 0.8571);
}
.gx-workspace-failure {
  flex: none;
  padding: 4px 8px;
  color: var(--dsw-alias-state-error-primary, inherit);
  font-size: calc(var(--gx-fs) * 0.8571);
}
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
`;function Nn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Pn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Pn,n.textContent=xo,e.head.appendChild(n),()=>{n.remove()}}var Hn="lionad.git",bo="@",Nt=60;function yo(e){let t=e.replace(/\s+/gu," ").trim();if(t.length<=Nt)return t;let n=t.slice(0,Nt),r=n.lastIndexOf(" ");return`${(r>Nt*.75?n.slice(0,r):n).trimEnd()}\u2026`}function vo(e){if(!Number.isFinite(e))return"";let t=new Date(e*1e3);if(Number.isNaN(t.getTime()))return"";let n=r=>String(r).padStart(2,"0");return`${String(t.getFullYear())}-${n(t.getMonth()+1)}-${n(t.getDate())}`}function Dn(e){let n=[e.subject===""?`[git commit ${e.hash}]`:`[git commit ${e.hash}] ${e.subject}`],r=e.refs.filter(o=>o.trim()!=="").join(", ");return r!==""&&n.push(r),e.author!==""&&n.push(e.author),e.date!==""&&n.push(e.date),n.join(" \xB7 ")}function wo(e,t,n){return{hash:e.hash,subject:yo(e.subject),refs:n.filter(r=>r.trim()!==""),author:e.author,date:vo(e.time),short:t}}function An(e,t,n=[]){let r=wo(e,t,n);return{kind:"git.commit",id:e.hash,label:r.subject===""?t:`${t} ${r.subject}`,clipboardText:`[git commit ${t}]`,modelText:Dn(r),ref:JSON.stringify(r)}}function ko(e){let t;try{t=JSON.parse(e)}catch{return`[git commit ${e}]`}if(t===null||typeof t!="object")return`[git commit ${e}]`;let n=t;return typeof n.hash!="string"||n.hash===""?`[git commit ${e}]`:Dn({hash:n.hash,subject:typeof n.subject=="string"?n.subject:"",refs:Array.isArray(n.refs)?n.refs.filter(r=>typeof r=="string"):[],author:typeof n.author=="string"?n.author:"",date:typeof n.date=="string"?n.date:"",short:typeof n.short=="string"?n.short:""})}function So(e){try{let t=JSON.parse(e);if(typeof t.short=="string"&&t.short!=="")return`[git commit ${t.short}]`}catch{}return`[git commit ${e}]`}function Wn(e,t){let n={source:Hn,ref:t.ref,label:t.label,clipboardText:t.clipboardText,appearance:"session"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(n,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(n,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(t.clipboardText,r)?"text":"failed"}function Fn(e){return e.sessionId===void 0?{enabled:!1,reasonKey:"reference.disabled.noSession"}:e.hasComposer?e.sourceAvailable?e.phase!==void 0&&e.phase!=="plain"?{enabled:!1,reasonKey:"reference.disabled.busy"}:{enabled:!0}:{enabled:!1,reasonKey:"reference.disabled.noSource"}:{enabled:!1,reasonKey:"reference.disabled.noComposer"}}function Gn(e){if(e===null||typeof e!="object")return{};let t=e,n=t.views,r=n?.open,o=t.openView,i=t.viewFocus,a=i?.request,s=i?.take,u=t.openViewOrSwitch,d=t.currentSessionId;return{openView:typeof r=="function"?(f,l,h)=>r.call(n,f,l,h)===!0:typeof o=="function"?(f,l,h)=>o.call(t,l,h):void 0,requestFocus:typeof a=="function"?(f,l)=>{a.call(i,f,l)}:void 0,takeFocus:typeof s=="function"?f=>{s.call(i,f)}:void 0,openViewOrSwitch:typeof u=="function"?(f,l)=>u.call(t,f,l):void 0,currentSessionId:typeof d=="function"?()=>d.call(t):void 0}}function Ro(e){if(e===null||typeof e!="object")return;let t=e;if(typeof t.id=="string"&&t.id!=="")return t.id;if(typeof t.sessionId=="string"&&t.sessionId!=="")return t.sessionId}function Co(e){let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t.hash;if(typeof n!="string")return;let r=n.trim().toLowerCase();return/^[0-9a-f]{4,64}$/u.test(r)?r:void 0}function To(e,t,n){let r=Co(n);if(r===void 0||t===void 0||t==="")return!1;let o=e.currentSessionId?.();if(o!==void 0&&o!==t)return!1;let i=`commit:${r}`;return e.openView?.(t,ve,i)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(ve,i),e.openViewOrSwitch?.(ve)?.opened===!0?!0:(e.takeFocus?.(ve),!1)):e.openViewOrSwitch?.(ve,i)?.focused===!0}function Eo(e=()=>({})){return{trigger:bo,name:Hn,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:So,async serialize(t){return ko(t)}},openReference(t,n){let r=n!==null&&typeof n=="object"?n.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=Ro(t)??o.currentSessionId?.();return To(o,i,r)}catch{return!1}}}}function Mo(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function zn(e,t){let n=Eo(t),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],a=>{a.effect(()=>(r=a.inputTriggers.registerSource(n),o),"dsh-git-explorer: commit reference source")}),i}catch{}try{let a=e.get?.("inputTriggers");if(Mo(a))return r=a.registerSource(n),i}catch{}return i}var v=require("react");var ie=require("react");function On(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let i=o.files.filter(a=>a.path.toLowerCase().includes(n));i.length>0&&r.push({dir:o.dir,files:i})}return r}var X=require("react/jsx-runtime");function Ae(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function Lo(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function Io(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Po({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,X.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,X.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function _n({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:i}){let a=(0,ie.useRef)(null),s=(0,ie.useRef)(null),[u,d]=(0,ie.useState)(""),f=(0,ie.useMemo)(()=>On(e,u),[e,u]),l=(0,ie.useMemo)(()=>Lo(f),[f]),h=(0,ie.useMemo)(()=>l.map(Ae),[l]),D=e.reduce((g,W)=>g+W.files.length,0),P=(0,ie.useMemo)(()=>f.reduce((g,W)=>g+W.files.length,0),[f]),N=u.trim()!=="",[C,T]=(0,ie.useState)(void 0),y=(0,ie.useMemo)(()=>C===void 0?-1:h.indexOf(C),[C,h]),G=(0,ie.useRef)(0);(0,ie.useEffect)(()=>{y>=0&&(G.current=y)},[y]);let Q=(0,ie.useRef)(l);Q.current=l,(0,ie.useEffect)(()=>{if(!o)return;i(),Io(a.current);let g=Q.current.find(W=>W.kind==="file");g!==void 0&&T(Ae(g))},[o,i]),(0,ie.useEffect)(()=>{if(C===void 0||y>=0||l.length===0)return;let g=l[Math.min(G.current,l.length-1)];g!==void 0&&T(Ae(g))},[y,C,l]);let $=(0,ie.useCallback)(g=>{let W=h[g];W!==void 0&&(T(W),s.current?.focus({preventScroll:!0}))},[h]);(0,ie.useEffect)(()=>{if(y<0)return;s.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[y,C]);let B=(0,ie.useCallback)(g=>{let W=ot({key:g.key,composing:g.nativeEvent.isComposing,alt:g.altKey,ctrl:g.ctrlKey,meta:g.metaKey,shift:g.shiftKey});if(W===null)return;if(g.preventDefault(),W==="activate"){let L=y<0?void 0:l[y];L?.kind==="file"&&!L.file.isDirectory&&r(L.file.path,1);return}let ee=s.current?.clientHeight??480,te=s.current?.querySelector(".gx-file, .gx-group-head")?.getBoundingClientRect().height??26,S=it(y<0?void 0:y,W,l.length,rt(ee,te));S!==void 0&&$(S)},[y,$,r,l]);return(0,X.jsxs)("section",{ref:a,className:"gx-pane","data-testid":"git-changes",children:[(0,X.jsxs)("header",{className:"gx-pane-head",children:[(0,X.jsx)("span",{children:n("changes.title")}),(0,X.jsx)("span",{className:"gx-count",children:N?`${String(P)} / ${String(D)}`:D}),(0,X.jsx)("span",{className:"gx-spacer"}),(0,X.jsx)("input",{className:"gx-filter",type:"search",value:u,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:g=>d(g.currentTarget.value)})]}),(0,X.jsx)("div",{className:"gx-scroll",ref:s,tabIndex:0,"data-testid":"git-changes-scroll","data-page-keys":"own",onKeyDown:B,children:D===0?(0,X.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,X.jsx)("strong",{children:n("changes.empty")})}):l.length===0?(0,X.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,X.jsx)("strong",{children:n("changes.noMatch")})}):l.map(g=>g.kind==="group"?(0,X.jsxs)("div",{className:"gx-group-head","data-cursor":Ae(g)===C?"true":"false",children:[(0,X.jsx)("span",{className:"gx-group-dir",children:g.dir===""?n("changes.root"):g.dir}),(0,X.jsx)("span",{className:"gx-count",children:g.count})]},Ae(g)):(0,X.jsxs)("button",{type:"button",className:"gx-file","data-status":g.file.status,"data-directory":g.file.isDirectory?"true":"false","data-renamed":g.file.origPath===void 0?"false":"true","data-cursor":Ae(g)===C?"true":"false","data-testid":"git-change-file",title:g.file.isDirectory?`${n(`status.${g.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${g.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{T(Ae(g)),s.current?.focus({preventScroll:!0}),g.file.isDirectory||r(g.file.path,1)},children:[(0,X.jsx)("span",{className:"gx-badge","data-status":g.file.status,children:We(g.file.status)}),(0,X.jsxs)("span",{className:"gx-file-name",children:[Me(g.file.path),g.file.origPath===void 0?null:(0,X.jsx)("span",{className:"gx-file-orig",children:Me(g.file.origPath)})]}),(0,X.jsx)("span",{className:"gx-file-stats",children:(0,X.jsx)(Po,{stat:t.get(g.file.path)})})]},Ae(g)))})]})}var Y=require("react"),$n=require("react-dom");var b=require("react/jsx-runtime"),No=200,Ho=40,Do=24,Ao=7;function Wo({additions:e,deletions:t}){return e===null&&t===null?(0,b.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,b.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Fo(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Go({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,b.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,b.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,b.jsx)("strong",{children:t("preview.unavailable")}),(0,b.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,b.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,b.jsx)("strong",{children:t("preview.unavailable")}),(0,b.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,b.jsxs)(b.Fragment,{children:[r.text===""?(0,b.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,b.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,b.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,b.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function zo({preview:e,hash:t,t:n}){let r=(0,Y.useRef)(null),o=(0,Y.useRef)(null),[i,a]=(0,Y.useState)(null),[s,u]=(0,Y.useState)(!1);return(0,Y.useLayoutEffect)(()=>{let d=r.current;if(d===null)return;let f=d.getBoundingClientRect();a(In(e.anchor,{width:f.width,height:f.height},{width:window.innerWidth,height:window.innerHeight}));let l=o.current;u(l!==null&&l.scrollHeight>l.clientHeight+1)},[e]),typeof document>"u"?null:(0,$n.createPortal)((0,b.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":s?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:i?.left??0,top:i?.top??0,visibility:i===null?"hidden":"visible"},children:[(0,b.jsxs)("div",{className:"gx-preview-head",children:[(0,b.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:We(e.file.status)}),(0,b.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:Me(e.file.path)}),(0,b.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Ao)} \xB7 ${n("preview.revision")}`})]}),(0,b.jsx)("div",{className:"gx-preview-body",children:(0,b.jsx)(Go,{preview:e,t:n,textRef:o})})]}),document.body)}function Bn({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:i,onCompareToHead:a,refs:s,inputActions:u,phase:d,sourceAvailable:f,onReference:l}){let[h,D]=(0,Y.useState)({kind:"idle"}),[P,N]=(0,Y.useState)(0),C=(0,Y.useRef)(new Map),T=(0,Y.useRef)(!1),[y,G]=(0,Y.useState)({kind:"idle"}),Q=(0,Y.useRef)(Ln(Do)),$=(0,Y.useRef)(void 0),B=(0,Y.useRef)(void 0),g=(0,Y.useRef)(void 0),W=(0,Y.useRef)(null),ee=(0,Y.useCallback)(()=>{$.current=void 0,B.current!==void 0&&(window.clearTimeout(B.current),B.current=void 0),g.current?.abort(),g.current=void 0,G(w=>w.kind==="idle"?w:{kind:"idle"})},[]),pe=(0,Y.useCallback)((w,I)=>{if(ee(),t===void 0)return;let Z=I.getBoundingClientRect(),j={left:Z.left,top:Z.top,right:Z.right,bottom:Z.bottom},V=Mn(t,w.path);$.current=V,B.current=window.setTimeout(()=>{if(B.current=void 0,$.current!==V)return;let fe=Q.current.get(V);if(fe!==void 0){G({kind:"ready",file:w,anchor:j,page:fe});return}if(e===void 0||n===void 0||typeof n.show!="function"){G({kind:"unavailable",file:w,anchor:j,message:r("preview.noService")});return}let ce=new AbortController;g.current=ce,G({kind:"loading",file:w,anchor:j}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:w.path,offset:1,limit:Ho},ce.signal)).then(R=>{if(ce.signal.aborted||$.current!==V)return;let ae=Te(R);if(!ae.ok){G({kind:"unavailable",file:w,anchor:j,message:ae.message});return}let O=ae.result;if(!O.ok){G({kind:"unavailable",file:w,anchor:j,message:Fo(O.error.code,O.error.message,r)});return}Q.current.set(V,O.page),G({kind:"ready",file:w,anchor:j,page:O.page})}).catch(R=>{ce.signal.aborted||$.current!==V||G({kind:"unavailable",file:w,anchor:j,message:Ee(R)})}).finally(()=>{g.current===ce&&(g.current=void 0)})},No)},[ee,t,n,e,r]);(0,Y.useEffect)(()=>{if(t===void 0){D({kind:"idle"});return}let w=C.current.get(t);if(w!==void 0){D({kind:"ready",detail:w});return}if(n===void 0||e===void 0){D({kind:"failed",message:r("state.noService.description")});return}let I=!0;return D({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(Z=>{if(!I)return;let j=Te(Z);if(!j.ok){D({kind:"failed",message:j.message});return}let V=j.result;V.ok?(C.current.set(t,V.detail),D({kind:"ready",detail:V.detail})):D({kind:"failed",message:V.error.message===""?V.error.code:V.error.message})}).catch(Z=>{I&&D({kind:"failed",message:Ee(Z)})}),()=>{I=!1}},[t,n,e,P,r]),(0,Y.useEffect)(()=>{if(y.kind==="idle")return;let w=I=>{I.key==="Escape"&&ee()};return document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[y.kind,ee]),(0,Y.useEffect)(()=>{let w=W.current;if(w===null)return;let I=()=>ee();return w.addEventListener("scroll",I,{passive:!0}),()=>w.removeEventListener("scroll",I)},[ee]),(0,Y.useEffect)(()=>{ee()},[t,P,e,n,ee]),(0,Y.useEffect)(()=>()=>{$.current=void 0,B.current!==void 0&&window.clearTimeout(B.current),g.current?.abort()},[]);let te=at(h.kind==="ready"?h.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""}),S=Fn({sessionId:e,hasComposer:u!==void 0&&typeof u.captureInsertion=="function",phase:d,sourceAvailable:f===!0}),L=S.enabled&&h.kind==="ready"&&l!==void 0,K=S.enabled?h.kind==="ready"?void 0:r("detail.empty"):r(S.reasonKey),ne=()=>{if(!(!L||T.current||h.kind!=="ready"||l===void 0)){T.current=!0;try{l(An(h.detail,te.shortHash,s??[]))==="failed"&&window.console?.warn?.(`[dsh-git-explorer] ${r("reference.failed")}`)}finally{T.current=!1}}};return(0,b.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,b.jsxs)("header",{className:"gx-detail-head",children:[(0,b.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,b.jsx)("span",{className:"gx-hash",children:te.shortHash}),(0,b.jsx)("span",{className:"gx-spacer",style:{flex:1}}),a===void 0||t===void 0?null:(0,b.jsx)("button",{type:"button",className:"gx-refbtn","data-testid":"gx-compare-head",title:r("compare.hint"),onClick:()=>a(t),children:r("compare.action")}),(0,b.jsx)("button",{type:"button",className:"gx-refbtn",disabled:!L,"aria-disabled":!L,title:K??r("reference.hint"),"data-testid":"gx-reference-commit",onClick:ne,children:r("reference.action")})]}),(0,b.jsx)("div",{className:"gx-detail-body",ref:W,children:h.kind==="idle"?(0,b.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):h.kind==="loading"?(0,b.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):h.kind==="failed"?(0,b.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,b.jsx)("strong",{children:r("detail.failed")}),(0,b.jsx)("span",{children:h.message}),(0,b.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>N(w=>w+1),children:r("action.retry")})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"gx-detail-subject",children:h.detail.subject}),(0,b.jsxs)("div",{className:"gx-detail-meta",children:[(0,b.jsx)("span",{className:"gx-author",children:h.detail.author}),(0,b.jsx)("span",{children:te.relative}),(0,b.jsx)("span",{title:new Date(h.detail.time*1e3).toLocaleString(),children:new Date(h.detail.time*1e3).toLocaleDateString()})]}),(0,b.jsxs)("div",{className:"gx-parents",children:[(0,b.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),h.detail.parents.length===0?(0,b.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):h.detail.parents.map(w=>(0,b.jsx)("button",{type:"button",className:"gx-parent",title:w,onClick:()=>o(w),children:w.slice(0,7)},w))]}),h.detail.body===""?null:(0,b.jsx)("pre",{className:"gx-body-text",children:h.detail.body}),(0,b.jsxs)("div",{className:"gx-detail-files",children:[(0,b.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(h.detail.files.length)}`}),h.detail.files.length===0?(0,b.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Lt(h.detail.files).map(w=>(0,b.jsxs)("div",{className:"gx-detail-group",children:[(0,b.jsx)("div",{className:"gx-detail-dir",children:w.dir===""?r("changes.root"):w.dir}),w.files.map(I=>(0,b.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:I.path,onClick:()=>i?.(I.path),onMouseEnter:Z=>pe(I,Z.currentTarget),onMouseLeave:ee,children:[(0,b.jsx)("span",{className:"gx-badge","data-status":I.status,children:We(I.status)}),(0,b.jsxs)("span",{className:"gx-file-name",children:[Me(I.path),I.origPath===void 0?null:(0,b.jsx)("span",{className:"gx-file-orig",children:Me(I.origPath)})]}),(0,b.jsx)("span",{className:"gx-file-stats",children:(0,b.jsx)(Wo,{additions:I.additions,deletions:I.deletions})})]},I.path))]},w.dir===""?".":w.dir))]})]})}),y.kind==="idle"?null:(0,b.jsx)(zo,{preview:y,hash:t??"",t:r})]})}var J=require("react/jsx-runtime");function Oo(e,t){let n=0,r=0,o=0;for(let i of e)for(let a of i.files){let s=t.get(a.path);s!==void 0&&(n+=s.additions??0,r+=s.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function Kn({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((a,s)=>a+s.files.length,0),i=Oo(e,t);return(0,J.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,J.jsxs)("header",{className:"gx-detail-head",children:[(0,J.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,J.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,J.jsx)("span",{className:"gx-spacer"}),i.counted===0?null:(0,J.jsxs)("span",{className:"gx-detail-stats",children:[(0,J.jsx)("span",{className:"gx-add",children:`+${String(i.additions)}`}),(0,J.jsx)("span",{className:"gx-del",children:`-${String(i.deletions)}`})]})]}),(0,J.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(a=>(0,J.jsxs)("div",{className:"gx-detail-group",children:[(0,J.jsxs)("div",{className:"gx-group-head",children:[(0,J.jsx)("span",{className:"gx-group-dir",children:a.dir===""?n("changes.root"):a.dir}),(0,J.jsx)("span",{className:"gx-count",children:a.files.length})]}),a.files.map(s=>(0,J.jsxs)("button",{type:"button",className:"gx-file","data-status":s.status,"data-directory":s.isDirectory?"true":"false","data-testid":"git-change-file",title:s.isDirectory?`${n(`status.${s.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${s.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{s.isDirectory||r(s.path,1)},children:[(0,J.jsx)("span",{className:"gx-badge","data-status":s.status,children:We(s.status)}),(0,J.jsxs)("span",{className:"gx-file-name",children:[Me(s.path),s.origPath===void 0?null:(0,J.jsx)("span",{className:"gx-file-orig",children:Me(s.origPath)})]}),(0,J.jsx)("span",{className:"gx-file-stats",children:(0,J.jsx)(_o,{stat:t.get(s.path)})})]},s.path))]},a.dir))})]})}function _o({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,J.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,J.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var q=require("react");var $e=require("react/jsx-runtime");function jn(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Vn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(36,t*12)),o=r/Math.max(1,t),i=u=>u*o+o/2,a=n/2,s=e.segments.map((u,d)=>{let f=i(u.from),l=i(u.to),h=u.kind==="pass"?`M ${String(f)} 0 L ${String(l)} ${String(n)}`:u.kind==="into"?`M ${String(f)} 0 C ${String(f)} ${String(n*.55)}, ${String(l)} ${String(n*.45)}, ${String(l)} ${String(a)}`:`M ${String(f)} ${String(a)} C ${String(f)} ${String(n*.55)}, ${String(l)} ${String(n*.45)}, ${String(l)} ${String(n)}`;return(0,$e.jsx)("path",{d:h,fill:"none",stroke:jn(u.color),strokeWidth:1.4,strokeLinecap:"round"},`${u.kind}-${String(u.from)}-${String(u.to)}-${String(d)}`)});return(0,$e.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,$e.jsx)("circle",{cx:i(e.lane),cy:a,r:e.merge?4:3.2,fill:jn(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var Ht="git-explorer.leftColumnWidth";function Dt(e){return Math.min(560,Math.max(240,e))}function Un(e){if(e==null)return null;let t;try{t=e.getItem(Ht)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function ct(e,t){let n=Math.round(Dt(t));if(e!=null)try{e.setItem(Ht,String(n))}catch{}return n}function Xn(e){if(e!=null)try{e.removeItem(Ht)}catch{}}function Be(e,t){return Math.round(e)===Math.round(t)}var qn=16;function Yn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-qn};case"ArrowRight":return{kind:"nudge",delta:qn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Ke=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],At="git-explorer.historyColumns",Jn=16,we={refs:168,time:84,author:96,hash:68};function Qn(e){return Ke.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function Wt(e,t){let n=Qn(e);return Math.min(n.max,Math.max(n.min,t))}function dt(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=Qn(t);return n<r.min||n>r.max?null:n}function $o(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Ft(e){if(e==null)return we;let t;try{t=e.getItem(At)}catch{return we}if(t===null)return we;let n=$o(t);return n===null?we:{refs:dt(n,"refs")??we.refs,time:dt(n,"time")??we.time,author:dt(n,"author")??we.author,hash:dt(n,"hash")??we.hash}}function Bo(e,t){if(e==null)return;let n={};for(let r of Ke){let o=t[r.id];o!==we[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(At):e.setItem(At,JSON.stringify(n))}catch{}}function ut(e,t,n){let r=Math.round(Wt(t,n)),o={...Ft(e),[t]:r};return Bo(e,o),o}function Zn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Jn};case"ArrowRight":return{kind:"nudge",delta:Jn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function er(e,t){return Be(e,t)}var k=require("react/jsx-runtime");var Ko=12,Le="uncommitted";function Gt(e){return Math.min(116,Math.max(36,e*12))}function jo(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function Vo({commit:e,row:t,laneCount:n,rowHeight:r,top:o,selected:i,head:a,cursor:s,onSelect:u}){return(0,k.jsxs)("button",{type:"button",className:"gx-row",style:{top:o},"data-selected":i?"true":"false","data-head":a?"true":"false","data-cursor":s?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>u(e.hash),children:[t===void 0?(0,k.jsx)("span",{className:"gx-graph",style:{width:Gt(n)}}):(0,k.jsx)(Vn,{row:t,laneCount:n,height:r}),(0,k.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(d=>(0,k.jsxs)("span",{className:"gx-ref","data-kind":d.kind,children:[(0,k.jsx)("span",{className:"gx-ref-name",children:d.name}),(0,k.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:d.name})]},`${d.kind}:${d.name}`))}),(0,k.jsx)("span",{className:"gx-subject",children:e.subject}),(0,k.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:It(e.time)}),(0,k.jsx)("span",{className:"gx-author",children:e.author}),(0,k.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function qo({summary:e,laneCount:t,rowHeight:n,top:r,selected:o,cursor:i,t:a,onSelect:s}){let u=Gt(t),f=u/Math.max(1,t)/2,l=0,h=0,D=0;for(let P of e.groups)for(let N of P.files){let C=e.stats.get(N.path);C!==void 0&&(l+=C.additions??0,h+=C.deletions??0,D+=1)}return(0,k.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:r},"data-selected":o?"true":"false","data-cursor":i?"true":"false","data-testid":"git-uncommitted-row",title:a("uncommitted.hint"),"aria-label":a("uncommitted.hint"),onClick:s,children:[(0,k.jsx)("svg",{className:"gx-graph",width:u,height:n,viewBox:`0 0 ${String(u)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:(0,k.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:f,cy:n/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,k.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,k.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${a("uncommitted.label")} (${String(e.fileCount)})`}),(0,k.jsx)("span",{className:"gx-time",children:D===0?null:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("span",{className:"gx-add",children:`+${String(l)}`})," ",(0,k.jsx)("span",{className:"gx-del",children:`-${String(h)}`})]})}),(0,k.jsx)("span",{className:"gx-author"}),(0,k.jsx)("span",{className:"gx-hash"})]})}var Uo=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function Xo({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:i,onKeyDown:a,onReset:s}){let u=d=>Ke.find(f=>f.id===d);return(0,k.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:Uo.map(d=>{let f=d.id==="graph"||d.id==="subject"?void 0:u(d.id);return(0,k.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${d.id}`,children:[(0,k.jsx)("span",{className:"gx-colhead-label",children:n(d.key)}),f===void 0?null:(0,k.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(d.key)}`,"aria-valuemin":f.min,"aria-valuemax":f.max,"aria-valuenow":e[f.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${f.id}`,onPointerDown:l=>r(f.id,l),onPointerMove:o,onPointerUp:i,onPointerCancel:i,onLostPointerCapture:i,onKeyDown:l=>a(f.id,l),onDoubleClick:()=>s(f.id)})]},d.id)})})}function tr(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:i,hasMore:a,loadingMore:s,loadError:u,searching:d,search:f,t:l,onSelect:h,onLoadMore:D,onSearch:P,onSelectUncommitted:N}=e,C=(0,q.useRef)(null),[T,y]=(0,q.useState)(0),[G,Q]=(0,q.useState)(0),$=(0,q.useRef)(!1),[B]=(0,q.useState)(()=>e.columnStorage===void 0?jo():e.columnStorage),[g,W]=(0,q.useState)(()=>Ft(B)),[ee,pe]=(0,q.useState)(0),te=en(Rn),S=(0,q.useRef)(null),[L,K]=(0,q.useState)(void 0),ne=e.workingTree,w=ne!==void 0&&ne.fileCount>0,I=w?1:0,Z=t.length+I,j=r===void 0?-1:r===Le?w?0:-1:t.findIndex(m=>m.hash===r)+(w?1:0),V=L===void 0?void 0:L<I?Le:t[L-I]?.hash,fe=(0,q.useRef)(void 0);(0,q.useEffect)(()=>{let m=C.current;if(m===null)return;let x=()=>{Q(m.clientHeight),pe(Math.max(0,m.offsetWidth-m.clientWidth))};if(x(),typeof ResizeObserver>"u")return;let U=new ResizeObserver(x);return U.observe(m),()=>U.disconnect()},[t.length]),(0,q.useEffect)(()=>{s||($.current=!1)},[s]);let ce=(0,q.useCallback)(()=>{!a||s||$.current||($.current=!0,D())},[a,s,D]),R=m=>{let x=m.currentTarget;y(x.scrollTop),x.scrollTop+x.clientHeight>=x.scrollHeight-160&&ce()};(0,q.useEffect)(()=>{let m=V;if(m===void 0)return;let x=m===Le?w?0:-1:t.findIndex(U=>U.hash===m)+I;x!==L&&x>=0?K(x):x<0&&K(void 0)},[t,L,V,w,I]),(0,q.useEffect)(()=>{let m=fe.current!==r;fe.current=r,!(!m||L===void 0||r===void 0)&&j>=0&&j!==L&&K(j)},[r,t,L,j]),(0,q.useEffect)(()=>{if(L===void 0)return;let m=C.current;if(m===null)return;let x=Cn({scrollTop:m.scrollTop,viewport:m.clientHeight===0?480:m.clientHeight,rowHeight:te,index:L,rowCount:Z});x!==m.scrollTop&&(m.scrollTop=x,y(x))},[L,Z,te]),(0,q.useEffect)(()=>{if(L===void 0)return;let m=L-I;m<0||!vn(m,t.length,Ko)||ce()},[L,t.length,ce,I]);let ae=(0,q.useCallback)(m=>{let x=ot({key:m.key,composing:m.nativeEvent.isComposing,alt:m.altKey,ctrl:m.ctrlKey,meta:m.metaKey,shift:m.shiftKey});if(x===null)return;m.preventDefault();let U=L??(j>=0?j:void 0),re=it(U,x,Z,rt(G===0?480:G,te));if(re===void 0)return;if(K(re),re===0&&w){N?.();return}let He=t[re-I];He!==void 0&&h(He.hash)},[t,L,w,G,h,N,Z,te,I,j]),O=lt(Array.from({length:Z},(m,x)=>x),{scrollTop:T,height:G===0?480:G,rowHeight:te}),he=Math.max(1,En(n)),me=(0,q.useCallback)((m,x)=>{if(!(x.button!==0||S.current!==null)){x.preventDefault(),x.stopPropagation();try{x.currentTarget.setPointerCapture(x.pointerId)}catch{return}S.current={pointerId:x.pointerId,startX:x.clientX,baseWidth:g[m],restWidth:g[m],id:m},document.body.classList.add("gx-col-resizing")}},[g]),ke=(0,q.useCallback)(m=>{let x=S.current;if(x===null||x.pointerId!==m.pointerId)return;let U=Wt(x.id,x.baseWidth+m.clientX-x.startX);W(re=>({...re,[x.id]:U}))},[]),se=(0,q.useCallback)(m=>{let x=S.current;if(x===null||x.pointerId!==m.pointerId)return;S.current=null,document.body.classList.remove("gx-col-resizing");try{m.currentTarget.releasePointerCapture(m.pointerId)}catch{}let U=x.baseWidth+m.clientX-x.startX;if(er(U,x.baseWidth)){W(re=>({...re,[x.id]:x.restWidth}));return}W(ut(B,x.id,U))},[B]),ge=(0,q.useCallback)(m=>{W(ut(B,m,we[m]))},[B]),Se=(0,q.useCallback)((m,x)=>{if(x.nativeEvent.isComposing)return;let U=Zn(x.key,x.altKey||x.ctrlKey||x.metaKey||x.shiftKey);if(U===null)return;if(x.preventDefault(),x.stopPropagation(),U.kind==="reset"){ge(m);return}let re=Ke.find(qe=>qe.id===m);if(re===void 0)return;let He=U.kind==="nudge"?g[m]+U.delta:U.kind==="min"?re.min:re.max;W(ut(B,m,He))},[ge,B,g]),Ne=(0,q.useMemo)(()=>({"--gx-col-graph":`${String(Gt(he))}px`,"--gx-col-refs":`${String(g.refs)}px`,"--gx-col-time":`${String(g.time)}px`,"--gx-col-author":`${String(g.author)}px`,"--gx-col-hash":`${String(g.hash)}px`,"--gx-row-h":`${String(te)}px`}),[he,te,g]),xe=f.trim()!=="",Ie=xe?l("history.noMatch"):e.emptyTitle??l("history.empty"),H=xe?void 0:e.emptyDescription;return(0,k.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:Ne,children:[(0,k.jsxs)("header",{className:"gx-pane-head",children:[(0,k.jsx)("span",{children:l("history.title")}),(0,k.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(i)}`}),(0,k.jsx)("span",{className:"gx-spacer"}),(0,k.jsx)("input",{className:"gx-filter",type:"search",value:f,spellCheck:!1,placeholder:l("history.search"),"aria-label":l("history.search"),"data-testid":"gx-history-search",onChange:m=>P(m.currentTarget.value)})]}),t.length===0&&!(w&&!xe)?(0,k.jsxs)("div",{className:"gx-empty",children:[(0,k.jsx)("strong",{children:Ie}),H===void 0?null:(0,k.jsx)("span",{children:H}),e.onRetry===void 0?null:(0,k.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??l("action.retry")})]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(Xo,{widths:g,gutter:ee,t:l,onPointerDown:me,onPointerMove:ke,onPointerEnd:se,onKeyDown:Se,onReset:ge}),(0,k.jsx)("div",{className:"gx-scroll",ref:C,tabIndex:0,"data-testid":"git-history-scroll","data-page-keys":"own",onScroll:R,onKeyDown:ae,children:(0,k.jsx)("div",{className:"gx-vlist",style:{height:Z*te},children:O.rows.map(m=>{let x=m*te;if(m===0&&w&&ne!==void 0)return(0,k.jsx)(qo,{summary:ne,laneCount:he,rowHeight:te,top:x,selected:r===Le,cursor:L===0,t:l,onSelect:()=>{K(0),N?.()}},"uncommitted");let U=m-I,re=t[U];return re===void 0?null:(0,k.jsx)(Vo,{commit:re,row:n[U],laneCount:he,rowHeight:te,top:x,selected:re.hash===r,head:re.hash===o,cursor:m===L,onSelect:He=>{K(m),h(He)}},re.hash)})})})]}),(0,k.jsxs)("footer",{className:"gx-loadbar",children:[(0,k.jsx)("span",{children:`${l("history.loaded")} ${String(t.length)}`}),u===void 0?null:(0,k.jsx)("span",{className:"gx-del",children:u}),d?(0,k.jsx)("span",{className:"gx-search-status",children:l("history.searching")}):null,(0,k.jsx)("span",{className:"gx-spacer"}),a?(0,k.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:ce,children:l(s?"history.loading":"history.loadMore")}):(0,k.jsx)("span",{children:t.length===0?"":l("history.noMore")})]})]})}function zt(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var Ot="git-explorer.detailHeight";function nr(e){return Math.min(88,Math.max(6,e))}function Fe(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function je(e,t){let n=t>0?t:600;return nr(Math.round(e/n*1e3)/10)}function rr(e,t){let n=t>0?t:600;return e/100*n}function or(e){if(e==null)return null;let t;try{t=e.getItem(Ot)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function pt(e,t){let n=Math.round(nr(t)*10)/10;if(e!=null)try{e.setItem(Ot,String(n))}catch{}return n}function ir(e){if(e!=null)try{e.removeItem(Ot)}catch{}}function ar(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var _=require("react");function Ve(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function sr(e){let t=e.length;for(;t>0;){let n=e.charAt(t-1);if(n!=="/"&&n!=="\\")break;t-=1}return e.slice(0,t)}function lr(e,t){let n=sr(e);if(n!==""){for(let r of t)if(sr(r.path)===n)return r.workspaceId}}function cr(e,t){let n=t.trim().toLowerCase();return n===""?e:e.filter(r=>r.title.toLowerCase().includes(n)||r.path.toLowerCase().includes(n))}var be=require("react/jsx-runtime"),dr=320,Yo="min(420px, 100vw - 32px)",ur=5,ft=8,Jo=Object.freeze([]);function Qo(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,gap:ur,margin:ft}):Zo(t,n)}function Zo(e,t){let[n,r]=(0,_.useState)(void 0);return(0,_.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=t.current;if(o===null)return;let i=o.getBoundingClientRect(),a=typeof window>"u"?void 0:window,s=Math.min(dr,(a?.innerWidth??dr)-ft*2),u=Math.max(ft,Math.min(i.left,(a?.innerWidth??s)-s-ft));r({position:"fixed",left:u,top:i.bottom+ur,width:s,maxWidth:Yo})},[e,t]),n}function ei(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}ti(t,n,o,i)}function ti(e,t,n,r){(0,_.useEffect)(()=>{if(!n)return;let o=i=>{let a=i.target;a instanceof Node&&e.current?.contains(a)!==!0&&t.current?.contains(a)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[e,t,n,r])}function ni(e,t,n){if(e===0)return-1;if(t<0)return 0;let r=t+n;return r<0?0:r>e-1?e-1:r}function pr(e){let{t,available:n,watch:r,list:o,startSession:i}=e;function a({root:s}){let[u,d]=(0,_.useState)(!1),[f,l]=(0,_.useState)(""),[h,D]=(0,_.useState)(-1),[P,N]=(0,_.useState)(null),C=(0,_.useRef)(null),T=(0,_.useRef)(null),y=(0,_.useRef)(null),G=(0,_.useRef)(null),Q=(0,_.useRef)(null),$=(0,_.useRef)(!1),B=(0,_.useId)(),g=tt(),W=g.createPortal!==void 0,ee=o===void 0?Jo:o(),pe=i!==void 0&&(n===void 0||n()),[,te]=(0,_.useState)(0);(0,_.useEffect)(()=>{if(!(pe||r===void 0))return r(()=>te(R=>R+1))},[pe,r]);let S=(0,_.useMemo)(()=>cr(ee,f),[ee,f]),L=lr(s,ee),K=(0,_.useCallback)(()=>{d(!1),l(""),N(null)},[]),ne=(0,_.useCallback)(()=>{$.current=!0,K(),C.current?.focus({preventScroll:!0})},[K]),w=(0,_.useCallback)(()=>{$.current=!0,K()},[K]);(0,_.useLayoutEffect)(()=>{u&&G.current?.focus({preventScroll:!0})},[u]),(0,_.useLayoutEffect)(()=>{if(u||!$.current)return;$.current=!1;let R=document.activeElement;(R===null||R===document.body||R===C.current||T.current?.contains(R)===!0)&&C.current?.focus({preventScroll:!0})},[u]),(0,_.useEffect)(()=>{if(S.length===0){D(-1);return}let R=S.findIndex(ae=>ae.workspaceId===L);D(R===-1?0:R)},[S,L]),(0,_.useEffect)(()=>{Q.current?.scrollIntoView?.({block:"nearest"})},[h,S]),(0,_.useEffect)(()=>{if(!u)return;let R=ae=>{ae.key!=="Escape"||ae.isComposing||(ae.preventDefault(),ne())};return document.addEventListener("keydown",R),()=>document.removeEventListener("keydown",R)},[u,ne]);let I=Qo(g,u,C,y);ei(g,T,y,W,u,w);let Z=()=>{if(u){K();return}d(!0)},j=R=>{if(R.workspaceId===L){ne();return}if(i!==void 0){try{i(R.workspaceId)}catch{N(t("workspace.failed"));return}ne()}},V=()=>{let R=h<0?void 0:S[h];R!==void 0&&j(R)},fe=R=>{if(!(R.metaKey||R.ctrlKey||R.altKey)&&!R.nativeEvent.isComposing){if(R.key==="ArrowDown"||R.key==="ArrowUp"){R.preventDefault();let ae=R.key==="ArrowDown"?1:-1;D(O=>ni(S.length,O,ae));return}R.key==="Enter"&&(R.preventDefault(),V())}},ce=(0,be.jsxs)("div",{className:"gx-workspace-panel","data-testid":"gx-workspace-panel",ref:y,style:I??void 0,role:"listbox",id:B,"aria-label":t("workspace.title"),children:[(0,be.jsx)("input",{className:"gx-workspace-search","data-testid":"gx-workspace-search",ref:G,type:"text",value:f,placeholder:t("workspace.search"),"aria-label":t("workspace.search"),"aria-controls":B,onChange:R=>l(R.target.value),onKeyDown:fe}),P===null?null:(0,be.jsx)("div",{className:"gx-workspace-failure",role:"alert",children:P}),(0,be.jsx)("div",{className:"gx-workspace-list",children:S.length===0?(0,be.jsx)("div",{className:"gx-workspace-empty",role:"note",children:ee.length===0?t("workspace.none"):t("workspace.empty")}):S.map((R,ae)=>{let O=R.workspaceId===L;return(0,be.jsxs)("button",{type:"button",className:"gx-workspace-row","data-testid":`gx-workspace-row-${R.workspaceId}`,"data-current":O?"true":void 0,"data-active":ae===h?"true":void 0,ref:ae===h?Q:void 0,role:"option","aria-selected":O,title:R.path,onClick:()=>j(R),children:[(0,be.jsx)("span",{className:"gx-workspace-row-title",children:R.title}),(0,be.jsx)("span",{className:"gx-workspace-row-path",children:R.path})]},R.workspaceId)})})]});return pe?(0,be.jsxs)("div",{className:"gx-workspace-switch",ref:T,children:[(0,be.jsx)("button",{type:"button",className:"gx-repo gx-repo-switch","data-testid":"gx-workspace-switch",ref:C,title:s,"aria-haspopup":"listbox","aria-expanded":u,"aria-controls":u?B:void 0,onClick:Z,children:Ve(s)}),u?g.createPortal===void 0?ce:g.createPortal(ce,document.body):null]}):(0,be.jsx)("span",{className:"gx-repo",title:s,children:Ve(s)})}return a}var M=require("react/jsx-runtime"),si=250;function li(e,t){return e===void 0?"idle":t?"loading":"no-service"}function gr(e,t){let n=Sn(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function ci(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var di={display:"flex",alignItems:"center",gap:8};function ui(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var pi=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function ht({title:e,description:t,actionLabel:n,onAction:r}){return(0,M.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,M.jsx)("strong",{children:e}),t===void 0?null:(0,M.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,M.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function mr(e){let{workbench:t,version:n,t:r,remote:o,reference:i,referenceSourceAvailable:a,workspaces:s}=e,u=s===void 0?void 0:pr({t:r,...s});function d(f){let l=f.sessionId??t.currentSessionId(),h=(0,v.useRef)(l);h.current=l;let P=(f.useInput??(()=>{}))(c=>c.phase),N=(0,v.useMemo)(()=>o(),[o]),[C]=(0,v.useState)(dn),[T,y]=(0,v.useState)(()=>({kind:li(l,N!==void 0)})),[G,Q]=(0,v.useState)(0),[$,B]=(0,v.useState)([]),[g,W]=(0,v.useState)(!1),[ee,pe]=(0,v.useState)(!1),[te,S]=(0,v.useState)(void 0),[L,K]=(0,v.useState)(void 0),[ne,w]=(0,v.useState)(""),[I,Z]=(0,v.useState)(!1),j=(0,v.useRef)(""),V=(0,v.useRef)(0),fe=(0,v.useRef)(void 0),ce=(0,v.useRef)(void 0),[R,ae]=(0,v.useState)(!0),O=(0,v.useMemo)(()=>ui(),[]),[he,me]=(0,v.useState)(()=>Un(O)),ke=(0,v.useRef)(null),se=(0,v.useRef)(null),[ge,Se]=(0,v.useState)(()=>or(O)),Ne=(0,v.useRef)(null),xe=(0,v.useRef)(null),Ie=(0,v.useCallback)(c=>{fe.current=c,K(c),ae(!1)},[]),H=(0,v.useCallback)(()=>{ae(!1)},[]),m=(0,v.useCallback)(c=>{if(c.button!==0||se.current!==null||pi())return;let p=ke.current?.previousElementSibling;if(p instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}se.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:he},document.body.classList.add("gx-pane-resizing")}},[he]),x=(0,v.useCallback)(c=>{let p=se.current;p===null||p.pointerId!==c.pointerId||me(Dt(p.baseWidth+c.clientX-p.startX))},[]),U=(0,v.useCallback)(c=>{let p=se.current;if(p===null||p.pointerId!==c.pointerId)return;se.current=null,document.body.classList.remove("gx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let E=p.baseWidth+c.clientX-p.startX;if(Be(E,p.baseWidth)){me(p.restWidth);return}me(ct(O,E))},[O]),re=(0,v.useCallback)(()=>{Xn(O),me(null)},[O]),He=(0,v.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let p=Yn(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(p===null)return;if(c.preventDefault(),c.stopPropagation(),p.kind==="reset"){re();return}if(p.kind==="min"||p.kind==="max"){let A=p.kind==="min"?240:560;me(ct(O,A));return}let E=ke.current?.previousElementSibling,le=E instanceof HTMLElement?E.getBoundingClientRect().width:he??240;me(ct(O,le+p.delta))},[O,re,he]),qe=(0,v.useCallback)(()=>{let c=Ne.current?.parentElement;return c instanceof HTMLElement?c.getBoundingClientRect().height:0},[]),Ue=(0,v.useCallback)(()=>qe()||600,[qe]),$t=(0,v.useCallback)(()=>{let c=Ue();return Fe(rr(ge===null?38:ge,c),c)},[Ue,ge]),Er=(0,v.useCallback)(c=>{if(c.button!==0||xe.current!==null)return;let p=Ne.current?.parentElement;if(!(p instanceof HTMLElement))return;let E=Ne.current?.nextElementSibling;if(E instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}xe.current={pointerId:c.pointerId,startY:c.clientY,baseHeight:E.getBoundingClientRect().height,columnHeight:p.getBoundingClientRect().height||600,restHeight:ge},document.body.classList.add("gx-row-resizing")}},[ge]),Mr=(0,v.useCallback)(c=>{let p=xe.current;if(p===null||p.pointerId!==c.pointerId)return;let E=Fe(p.baseHeight-(c.clientY-p.startY),p.columnHeight);Se(je(E,p.columnHeight))},[]),mt=(0,v.useCallback)(c=>{let p=xe.current;if(p===null||p.pointerId!==c.pointerId)return;xe.current=null,document.body.classList.remove("gx-row-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let E=Fe(p.baseHeight-(c.clientY-p.startY),p.columnHeight);if(Be(E,p.baseHeight)){Se(p.restHeight);return}Se(pt(O,je(E,p.columnHeight)))},[O]),xt=(0,v.useCallback)(()=>{ir(O),Se(null)},[O]),Lr=(0,v.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let p=ar(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(p===null)return;if(c.preventDefault(),c.stopPropagation(),p.kind==="reset"){xt();return}let E=Ue();if(p.kind==="min"||p.kind==="max"){let A=p.kind==="min"?Fe(180,E):Fe(E,E);Se(pt(O,je(A,E)));return}let le=Fe($t()+p.delta,E);Se(pt(O,je(le,E)))},[Ue,$t,O,xt]);(0,v.useEffect)(()=>()=>{se.current!==null&&document.body.classList.remove("gx-pane-resizing"),xe.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,v.useEffect)(()=>{if(l===void 0||f.openView===void 0)return;let c=t.views;if(c?.bind!==void 0)return c.bind(l,f.openView)},[l,f.openView,t]),(0,v.useEffect)(()=>{if(l===void 0){y({kind:"idle"});return}if(N===void 0){y({kind:"no-service"});return}let c=!0;return y({kind:"loading"}),S(void 0),V.current+=1,j.current="",w(""),Z(!1),Promise.resolve().then(()=>N.snapshot({sessionId:l})).then(p=>{if(!c)return;let E=Te(p);if(!E.ok){y({kind:"failed",message:E.message});return}let le=E.result;if(!le.ok){y({kind:"failed",message:le.error.message===""?le.error.code:le.error.message});return}let A=le.snapshot;y({kind:"ready",snapshot:A}),B(A.commits),W(A.commits.length<A.counts.commits);let oe=fe.current;fe.current=void 0,K(de=>{if(oe!==void 0)return oe;let Ce=_e(A.status).length>0;return de===Le?Ce?de:A.commits[0]?.hash:de!==void 0&&A.commits.some(ze=>ze.hash===de)?de:A.commits[0]?.hash})}).catch(p=>{c&&y({kind:"failed",message:Ee(p)})}),()=>{c=!1}},[l,N,G]),(0,v.useEffect)(()=>{let c=f.viewRequest;if(c==null||c.view!==ve)return;let p=`${c.view}:${c.focus}`;ce.current!==p&&(ce.current=p,gr(c.focus,{select:Ie,complete:()=>f.completeViewRequest?.()}))},[f.viewRequest,f.completeViewRequest,Ie]),(0,v.useEffect)(()=>{let c=t.viewFocus;if(c===void 0||l===void 0)return;let p=()=>{let E=c.take(ve);E!==void 0&&gr(E,{select:Ie})};return p(),c.subscribe(p)},[t,l,Ie]);let Ir=(0,v.useMemo)(()=>Tn($),[$]),ue=T.kind==="ready"?T.snapshot:void 0,Xe=(0,v.useMemo)(()=>ue===void 0?[]:_e(ue.status),[ue]),bt=(0,v.useMemo)(()=>{let c=new Map;for(let p of ue?.stats??[])c.set(p.path,{additions:p.additions,deletions:p.deletions});return c},[ue]),Ye=(0,v.useMemo)(()=>{let c=new Map;for(let p of ue?.branches??[]){let E=c.get(p.hash);E===void 0?c.set(p.hash,[{kind:p.kind,name:p.name,head:p.head}]):E.push({kind:p.kind,name:p.name,head:p.head})}return c},[ue]);(0,v.useEffect)(()=>{if(l===void 0||N===void 0||T.kind!=="ready")return;let c=ne.trim();if(c===j.current)return;let p=l,E=V.current+1;if(V.current=E,S(void 0),pe(!1),c===""){j.current="",Z(!1);let A=T.snapshot.commits;B(A),W(A.length<T.snapshot.counts.commits),K(oe=>oe===Le||oe!==void 0&&A.some(de=>de.hash===oe)?oe:A[0]?.hash);return}Z(!0);let le=setTimeout(()=>{j.current=c,Promise.resolve().then(()=>N.query(zt(l,c,0))).then(A=>{if(V.current!==E||h.current!==p)return;let oe=Te(A);if(!oe.ok){S(oe.message);return}let de=oe.result;if(!de.ok){S(de.error.message===""?de.error.code:de.error.message);return}let Ce=de.page,ze=Ye;B(Ce.commits.map(ye=>({...ye,refs:ze.get(ye.hash)??[]}))),W(Ce.hasMore),K(ye=>ye===Le||ye!==void 0&&Ce.commits.some(De=>De.hash===ye)?ye:Ce.commits[0]?.hash)}).catch(A=>{V.current===E&&S(Ee(A))}).finally(()=>{V.current===E&&Z(!1)})},si);return()=>{clearTimeout(le)}},[ne,l,N,T.kind,Ye]);let Pr=(0,v.useCallback)(()=>{if(l===void 0||N===void 0||!g||ee)return;let c=l,p=j.current,E=V.current;pe(!0),S(void 0),Promise.resolve().then(()=>N.query(zt(l,p,$.length))).then(le=>{if(h.current!==c||V.current!==E)return;let A=Te(le);if(!A.ok){S(A.message);return}let oe=A.result;if(!oe.ok){S(oe.error.message===""?oe.error.code:oe.error.message);return}let de=oe.page;B(Ce=>{let ze=new Set(Ce.map(De=>De.hash)),ye=de.commits.filter(De=>!ze.has(De.hash)).map(De=>({...De,refs:Ye.get(De.hash)??[]}));return ye.length===0?Ce:[...Ce,...ye]}),W(de.hasMore)}).catch(le=>S(Ee(le))).finally(()=>pe(!1))},[l,N,g,ee,$.length,Ye]),Nr=(0,v.useMemo)(()=>{let c=t.views??{open:(p,E)=>t.openView?.(p,E)??!1};return st({views:c,sessionId:l??""})},[t,l]),Bt=(c,p=1)=>{l!==void 0&&Nr(c,p)},Hr=(0,v.useMemo)(()=>{let c={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(p,E)=>t.openViewOrSwitch?.(p,E)??{opened:!1,focused:!1}}};return Pt({seam:c,sessionId:l??""})},[t,l]),Dr=(c,p=1)=>{l!==void 0&&L!==void 0&&Hr(L,c,p)},Kt=(0,v.useMemo)(()=>{if(!(t.openViewOrSwitch!==void 0||t.openView!==void 0||t.views!==void 0))return;let p={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:t.openViewOrSwitch},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus}},E=Pt({seam:p,sessionId:l??""});return le=>{let A=le.trim().toLowerCase();A!==""&&E(A,"HEAD")}},[t,l]),Ar=c=>{let p=f.inputActions;if(l===void 0||p===void 0)return"failed";let E=i?.(l),le=Wn({captureSpan:()=>{let A=p.captureInsertion?.();return A===void 0?void 0:{start:A.start,end:A.end,draftRev:A.draftRev}},insertReference:(A,oe)=>E?.insertReference?.(A,oe)??!1,insertText:(A,oe)=>p.insertText?.(A,oe)??!1,canInsertReference:a?.()===!0},c);return le!=="failed"?E?.focus?.():E?.notify?.("error",r("reference.failed")),le},Ge=(0,v.useCallback)(()=>Q(c=>c+1),[]),bi=()=>Q(c=>c+1);(0,v.useEffect)(()=>ci(C,Ge),[C,Ge]);let Re=ue?.head,Je=Xe.reduce((c,p)=>c+p.files.length,0),Qe=(0,v.useMemo)(()=>Je===0?void 0:{groups:Xe,stats:bt,fileCount:Je},[Je,Xe,bt]),Wr=(0,v.useMemo)(()=>{if(L===void 0)return;let c=$.find(p=>p.hash===L);return c===void 0?void 0:c.refs.map(p=>p.name)},[$,L]);return(0,M.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":T.kind,"data-session":l??"","data-testid":"git-explorer-view",children:[(0,M.jsxs)("header",{className:"gx-head",children:[(0,M.jsxs)("div",{className:"gx-head-main",children:[(0,M.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,M.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,M.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,M.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,M.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,M.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),ue===void 0?(0,M.jsx)("span",{className:"gx-repo",title:r("view.title"),children:r("view.title")}):u===void 0?(0,M.jsx)("span",{className:"gx-repo",title:ue.root,children:Ve(ue.root)}):(0,M.jsx)(u,{root:ue.root}),Re?.branch===null||Re?.branch===void 0?null:(0,M.jsx)("span",{className:"gx-branch",children:Re.branch}),Re?.detached===!0?(0,M.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,Re?.ahead!==void 0&&Re.ahead>0?(0,M.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(Re.ahead)}`}):null,Re?.behind!==void 0&&Re.behind>0?(0,M.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(Re.behind)}`}):null]}),(0,M.jsxs)("div",{className:"gx-head-meta",style:di,children:[ue===void 0?null:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)("span",{children:[r("head.changes")," ",(0,M.jsx)("b",{children:Je})]}),(0,M.jsxs)("span",{children:[r("head.commits")," ",(0,M.jsx)("b",{children:ue.counts.commits})]}),(0,M.jsxs)("span",{children:[r("head.branches")," ",(0,M.jsx)("b",{children:ue.counts.branches})]})]}),(0,M.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:T.kind==="loading",onClick:Ge,children:"\u21BB"})]})]}),l===void 0?(0,M.jsx)(ht,{title:r("state.noSession.title"),description:r("state.noSession.description")}):T.kind==="no-service"?(0,M.jsx)(ht,{title:r("state.noService.title"),description:r("state.noService.description")}):T.kind==="loading"?(0,M.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):T.kind==="failed"?(0,M.jsx)(ht,{title:r("state.failed.title"),description:T.message,actionLabel:r("action.retry"),onAction:Ge}):T.kind==="ready"&&!T.snapshot.isRepository?(0,M.jsx)(ht,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Ge}):T.kind==="ready"?(0,M.jsxs)("div",{className:"gx-body",style:he===null?void 0:{"--gx-left-col":`${he}px`},children:[(0,M.jsx)(_n,{groups:Xe,stats:bt,t:r,onOpen:Bt,claimFocus:R,onFocusClaimed:H}),(0,M.jsx)("div",{ref:ke,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":he??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:m,onPointerMove:x,onPointerUp:U,onPointerCancel:U,onLostPointerCapture:U,onKeyDown:He,onDoubleClick:re}),(0,M.jsxs)("div",{className:"gx-col",style:ge===null?void 0:{"--gx-detail-h":`${String(ge)}%`},children:[(0,M.jsx)(tr,{commits:$,graph:Ir,selectedHash:L,headHash:T.snapshot.head?.hash??null,total:T.snapshot.counts.commits,hasMore:g,loadingMore:ee,loadError:te,searching:I,search:ne,t:r,onSelect:K,onLoadMore:Pr,onSearch:w,workingTree:Qe,onSelectUncommitted:()=>K(Le),...T.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Ge,retryLabel:r("action.retry")}:{}}),(0,M.jsx)("div",{ref:Ne,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":ge??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:Er,onPointerMove:Mr,onPointerUp:mt,onPointerCancel:mt,onLostPointerCapture:mt,onKeyDown:Lr,onDoubleClick:xt}),L===Le&&Qe!==void 0?(0,M.jsx)(Kn,{groups:Qe.groups,stats:Qe.stats,t:r,onOpen:Bt}):(0,M.jsx)(Bn,{sessionId:l,hash:L,remote:N,t:r,onSelect:K,onOpenFile:Dr,...Kt===void 0?{}:{onCompareToHead:Kt},refs:Wr,...f.inputActions===void 0?{}:{inputActions:f.inputActions},...P===void 0?{}:{phase:P},sourceAvailable:a?.()===!0,onReference:Ar})]})]}):null]})}return d}var br=["slots","locale","workbench","remote"];function xr(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function yr(e){return()=>{try{let n=e.remote?.gitExplorer;if(xr(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(xr(n))return n}catch{}let t=vr(e);return t===void 0?void 0:ln(t)}}function vr(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,i)=>n.call("/api",`${nn}/${r}`,o,i)}function wr(e){return t=>{let n=e.get?.("sessions"),r=e.get?.("conversation");if(n?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=n.scope(t);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,a=o.focus,s=o.notify;return{...typeof i=="function"?{insertReference:(u,d)=>i.call(o,u,d)}:{},...typeof a=="function"?{focus:()=>a.call(o)}:{},...typeof s=="function"?{notify:(u,d)=>s.call(o,u,d)}:{}}}}function kr(e){let t=()=>{try{let o=e.get?.("workspaces")?.list?.getSnapshot().items;return Array.isArray(o)?o:[]}catch{return[]}},n=r=>{let o=e.get?.("uiWorkspace");typeof o?.startSession=="function"&&o.startSession(r)};return{available:()=>gi(e),watch:Sr(e),list:t,startSession:n}}function Sr(e){let t=e.inject;return typeof t!="function"?()=>()=>{}:n=>{try{let r=t.call(e,["workspaces","uiWorkspace"],()=>(n(),()=>{}));if(r===void 0||typeof r.dispose!="function")return()=>{};let o=r.dispose.bind(r);return()=>{o()}}catch{return()=>{}}}}function gi(e){try{return typeof e.get?.("workspaces")?.list?.getSnapshot!="function"?!1:typeof e.get?.("uiWorkspace")?.startSession=="function"}catch{return!1}}var gt;function Rr(e){let t=e.locale.bind(Oe);gt?.();let n=e.locale.register(Oe,{zh:jt,en:Vt});gt=n;let r=Nn(typeof document>"u"?void 0:document),o=Zt(e),i=yr(e),a=wr(e),s=zn(e,()=>Gn(e.workbench)),u=bn({store:cn(i),t});e.slots.inject(St,()=>e.slots.register({name:St,id:tn,order:30,locale:Oe},u));let d=e.workbench;if(d!=null){let f=kr(e),l=mr({workbench:d,version:d.version,t,remote:i,reference:a,referenceSourceAvailable:()=>s.available,workspaces:f});e.slots.inject(kt,()=>e.slots.register({name:kt,id:ve,order:110,label:()=>t("tab.label"),locale:Oe},l))}return()=>{r(),o(),s.dispose(),n(),gt===n&&(gt=void 0)}}var Cr={groupChanges:_e,formatCommitDetail:at,createJump:st,computeWindow:lt},Tr={name:"dsh-git-explorer",inject:br,apply:Rr,__test:Cr},mi=Tr;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
