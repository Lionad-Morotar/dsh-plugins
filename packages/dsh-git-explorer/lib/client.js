window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var St=Object.defineProperty;var Kr=Object.getOwnPropertyDescriptor;var Vr=Object.getOwnPropertyNames;var jr=Object.prototype.hasOwnProperty;var qr=(e,t)=>{for(var n in t)St(e,n,{get:t[n],enumerable:!0})},Ur=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Vr(t))!jr.call(e,o)&&o!==n&&St(e,o,{get:()=>t[o],enumerable:!(r=Kr(t,o))||r.enumerable});return e};var Xr=e=>Ur(St({},"__esModule",{value:!0}),e);var Ti={};qr(Ti,{__test:()=>Pr,apply:()=>Nr,boot:()=>mn,clientPlugin:()=>Hr,createReferenceResolver:()=>Mr,createRemoteResolver:()=>Tr,createRpcCall:()=>Er,createWorkspaceSwitch:()=>Ir,createWorkspaceWatch:()=>Lr,default:()=>Ri,inject:()=>Rr});module.exports=Xr(Ti);var Xt={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","workspace.title":"\u5207\u6362\u5DE5\u4F5C\u533A","workspace.search":"\u641C\u7D22\u5DE5\u4F5C\u533A","workspace.empty":"\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A","workspace.none":"\u8FD8\u6CA1\u6709\u6CE8\u518C\u5DE5\u4F5C\u533A","workspace.failed":"\u5207\u6362\u5DE5\u4F5C\u533A\u5931\u8D25","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","compare.action":"\u4E0E HEAD \u5BF9\u6BD4","compare.hint":"\u5728\u8BC4\u5BA1\u89C6\u56FE\u91CC\u5BF9\u6BD4\u8FD9\u4E2A\u63D0\u4EA4\u4E0E HEAD","reference.action":"\u5F15\u7528","reference.hint":"\u628A\u8FD9\u4E2A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","reference.disabled.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","reference.disabled.noComposer":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","reference.disabled.busy":"\u8F93\u5165\u6846\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u8BD5","reference.disabled.noSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","reference.failed":"\u65E0\u6CD5\u628A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Jt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","workspace.title":"Switch workspace","workspace.search":"Search workspaces","workspace.empty":"No matching workspace","workspace.none":"No workspace registered yet","workspace.failed":"Could not switch workspace","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","compare.action":"Compare to HEAD","compare.hint":"Compare this commit against HEAD in the review view","reference.action":"Reference","reference.hint":"Insert this commit into the composer","reference.disabled.noSession":"No session to insert into","reference.disabled.noComposer":"This host has no composer to insert into","reference.disabled.busy":"The composer is sending; try again in a moment","reference.disabled.noSource":"The reference source is not registered, so the chip could not be sent","reference.failed":"Could not insert the commit into the composer","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var en=require("react"),tn=14,Jr="--dsh-content-font-size",Yt=tn;function Yr(e,t){return Math.max(e,Math.round(e*t/tn))}function Qr(e,t){if(e===void 0)return t;let n=Number.parseFloat(e);return Number.isFinite(n)&&n>0?n:t}function nn(){return typeof document>"u"||document.body===null?Yt:Qr(document.body.style.getPropertyValue(Jr),Yt)}var Ct=nn(),Rt=new Set;function Qt(){return Ct}function Zr(e){return Rt.add(e),()=>{Rt.delete(e)}}function eo(e){if(e!==Ct){Ct=e;for(let t of[...Rt])t()}}function Zt(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function to(e){if(e===null||typeof e!="object")return;let t=e.fontSizes;if(t===null||typeof t!="object")return;let n=t.text;return typeof n=="number"&&Number.isFinite(n)&&n>0?n:void 0}function no(e){try{let t=e.get?.("theme");if(Zt(t))return t}catch{}try{let t=e.theme;if(Zt(t))return t}catch{}}function rn(e){let t=e.inject;if(typeof t!="function")return()=>{};let n,r;try{let o=t.call(e,["theme"],i=>{let a=no(i);if(a===void 0)return;let c=()=>{try{let g=to(a.getTheme());eo(g??nn())}catch{}};c();let u=i.on?.("theme/change",c);if(typeof u!="function")return;let d=u;return n=d,d});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{n?.(),r?.()}}function on(e){let t=(0,en.useSyncExternalStore)(Zr,Qt,Qt);return Yr(e,t)}var Tt="conversation.view",Ce="git-explorer";var Et="conversation.session.header.actions",an="git-branch";var Ke="git-explorer",sn="gitExplorer";var W=require("react");var ln=Object.freeze([]);function cn(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:ln}));let r=[];return e.forEach((o,i)=>{let a=ro(o.name,n);a!==void 0&&r.push({match:{branch:o,ranges:oo(a)},order:i,run:io(a)})}),r.sort((o,i)=>i.run-o.run||o.order-i.order),r.map(o=>o.match)}function Mt(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&It(n.branch))return t}return-1}function dn(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return Mt(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&It(o.branch))return r}return t}function un(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!It(n.branch)))return n.branch}function It(e){return e.worktreePath===void 0}function ro(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let i=t.charAt(o).toLowerCase(),a=-1;for(let c=r;c<e.length;c+=1)if(e.charAt(c).toLowerCase()===i){a=c;break}if(a===-1)return;n.push(a),r=a+1}return n}function oo(e){let t=e[0];if(t===void 0)return ln;let n=[],r=t,o=t+1;for(let i=1;i<e.length;i+=1){let a=e[i];if(a!==void 0){if(a===o){o=a+1;continue}n.push([r,o]),r=a,o=a+1}}return n.push([r,o]),n}function io(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function pn(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function Ie(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Le(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var nt="service-unavailable",ao=Object.freeze({status:"idle",revision:0,sessionId:null}),Lt;function so(e){let t=ao,n=-1,r=0,o=new Set,i=d=>{t=d;for(let g of[...o])g()},a=d=>t.sessionId===d&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(d){return o.add(d),()=>{o.delete(d)}},getSnapshot:()=>t,load:async d=>{if(a(d))return;let g=e(),f=++r,s=t.revision,D=t.sessionId===d;i({status:"loading",...D&&t.list!==void 0?{list:t.list}:{},revision:s,sessionId:d});let R=()=>f!==r||t.revision!==s;if(typeof g?.branches!="function"){if(R())return;i({status:"error",error:nt,revision:s,sessionId:d});return}try{let X=await g.branches({sessionId:d});if(R())return;let E=Ie(X);if(!E.ok){i({status:"error",error:E.message,revision:s,sessionId:d});return}if(E.result.ok===!1){i({status:"error",error:E.result.error.message,revision:s,sessionId:d});return}n=s,i({status:"ready",list:E.result.list,revision:s,sessionId:d})}catch(X){if(R())return;i({status:"error",error:Le(X),revision:s,sessionId:d})}},switchTo:async(d,g)=>{let f=()=>t.sessionId!==d,s=e();if(typeof s?.switchBranch!="function")return f()||i({...t,error:nt}),{switched:!1};try{let D=await s.switchBranch({sessionId:d,name:g}),R=Ie(D),X=R.ok?R.result.ok===!1?R.result.error.message:void 0:R.message;if(X!==void 0)return f()||i({...t,error:X}),{switched:!1};if(f())return{switched:!0};let E=R.ok&&R.result.ok===!0?R.result:void 0,M=E===void 0?g:E.branch,I=t.list;return i({status:I===void 0?t.status:"ready",...I===void 0?{}:{list:{...I,detached:!1,headHash:null,branches:I.branches.map(w=>({...w,current:w.name===M}))}},revision:t.revision+1,sessionId:d}),E===void 0||E.stash===void 0?{switched:!0}:{switched:!0,stash:E.stash}}catch(D){return f()||i({...t,error:Le(D)}),{switched:!1}}},bump(){i({...t,revision:t.revision+1})}}}function lo(e){return Lt=so(e),Lt}var fn=lo;function hn(){return Lt}var De=require("react"),co=Object.freeze({}),rt=null,Nt;function mn(e){rt=e}function ot(){if(Nt!=null)return Nt;if(rt===null)return co;let e=gn(rt,"@deepseek-ai/dsh-client-ui-primitives"),t=gn(rt,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,i=e?.useDismissOnOutsidePointer,a=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof i=="function"?{useDismissOnOutsidePointer:i}:{},...typeof a=="function"?{createPortal:a}:{}}}function gn(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var xn={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},yn=e=>(0,De.createElement)("svg",{...xn,className:e.className},(0,De.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,De.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,De.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,De.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,De.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),bn=e=>(0,De.createElement)("svg",{...xn,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,De.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var G=require("react/jsx-runtime"),vn=320,uo="min(420px, 100vw - 32px)",wn=5,it=8;function po(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:wn,margin:it})??void 0:fo(t,n)}function fo(e,t){let[n,r]=(0,W.useState)(void 0);return(0,W.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let i=t.current;if(i===null)return;let a=i.getBoundingClientRect(),c=Math.min(vn,Math.max(160,window.innerWidth-it*2)),u=Math.min(Math.max(a.right-c,it),window.innerWidth-c-it);r({left:u,top:a.bottom+wn,width:c})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function ho(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}go(t,n,o,i)}function go(e,t,n,r){(0,W.useEffect)(()=>{if(!n)return;let o=i=>{let a=i.target;a instanceof Node&&e.current?.contains(a)!==!0&&t.current?.contains(a)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function mo(e,t){let n=[],r=0;return t.forEach((o,i)=>{let[a,c]=o;a>r&&n.push((0,G.jsx)("span",{children:e.slice(r,a)},`plain-${i}`)),n.push((0,G.jsx)("span",{className:"gx-branch-match",children:e.slice(a,c)},`hit-${i}`)),r=c}),r<e.length&&n.push((0,G.jsx)("span",{children:e.slice(r)},"tail")),n}function xo(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function yo(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let i=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${i}`)}if(e.untrackedFiles>0){let i=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${i}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function kn({store:e,t}){function n({sessionId:r}){let o=(0,W.useSyncExternalStore)(e.subscribe,e.getSnapshot),[i,a]=(0,W.useState)(!1),[c,u]=(0,W.useState)(""),[d,g]=(0,W.useState)(-1),[f,s]=(0,W.useState)(null),[D,R]=(0,W.useState)(null),X=(0,W.useRef)(r);X.current=r;let E=(0,W.useRef)(null),M=(0,W.useRef)(null),I=(0,W.useRef)(null),w=(0,W.useRef)(null),A=(0,W.useRef)(null),re=(0,W.useRef)(!1),Q=(0,W.useId)(),z=(0,W.useId)(),$=ot(),q=$.createPortal!==void 0,pe=$.IconBranch??yn,x=$.IconChevron??bn,m=o.list,oe=m===void 0?void 0:xo(m.root),L=(0,W.useMemo)(()=>cn(m?.branches??[],c),[m,c]),K=(0,W.useCallback)(()=>{a(!1),u(""),R(null)},[]),S=(0,W.useCallback)(()=>{re.current=!0,K(),M.current?.focus({preventScroll:!0})},[K]),T=(0,W.useCallback)(()=>{re.current=!0,K()},[K]);(0,W.useEffect)(()=>{K(),s(null),r!==void 0&&e.load(r)},[e,r,K]),(0,W.useLayoutEffect)(()=>{i&&w.current?.focus({preventScroll:!0})},[i]),(0,W.useLayoutEffect)(()=>{if(i||!re.current)return;re.current=!1;let H=document.activeElement;(H===null||H===document.body||H===M.current||E.current?.contains(H)===!0)&&M.current?.focus({preventScroll:!0})},[i]),(0,W.useEffect)(()=>{g(Mt(L))},[L]),(0,W.useEffect)(()=>{A.current?.scrollIntoView?.({block:"nearest"})},[d,L]),(0,W.useEffect)(()=>{if(!i)return;let H=de=>{de.key!=="Escape"||de.isComposing||(de.preventDefault(),S())};return document.addEventListener("keydown",H),()=>document.removeEventListener("keydown",H)},[i,S]);let _=po($,i,M,I);ho($,E,I,q,i,T);let te=()=>{if(i){K();return}a(!0),r!==void 0&&e.load(r)},V=()=>{r!==void 0&&e.load(r)},fe=async H=>{if(f!==null||H.worktreePath!==void 0)return;if(H.current){S();return}if(r===void 0)return;s(H.name);let de=await e.switchTo(r,H.name);if(X.current===r&&(s(null),!!de.switched)){if(e.load(r),de.stash?.conflict===!0){R(de.stash);return}S()}},ie=()=>{let H=un(L,d);H!==void 0&&fe(H)},k=H=>{if(!(H.metaKey||H.ctrlKey||H.altKey)&&!H.nativeEvent.isComposing){if(H.key==="ArrowDown"||H.key==="ArrowUp"){H.preventDefault();let de=H.key==="ArrowDown"?1:-1;g(Z=>dn(L,Z,de));return}H.key==="Enter"&&(H.preventDefault(),ie())}};if(r===void 0)return null;let ne=m?.branches.find(H=>H.current)?.name,ce=m===void 0?t("branch.loading"):m.detached?m.headHash??t("head.detached"):ne??t("branch.unborn");if(!i&&m?.isRepository!==!0)return null;let Pe=`${t("head.detached")} ${m?.headHash??""}`.trim(),Ae=m?.detached===!0?Pe:ce,He=m?.isRepository===!0?m.worktree:void 0,j=He===void 0?void 0:yo(He,t),xe=t("branch.worktreeSep"),Te=j===void 0?Ae:j.description,Ge=j===void 0||He?.dirty!==!0?`${t("branch.title")}: ${Ae}`:`${t("branch.title")}: ${Ae}${xe}${j.description}`,ke=o.error===nt?t("state.noService.title"):o.error,he=(0,G.jsxs)("div",{ref:I,id:z,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:vn,maxWidth:uo,..._},children:[D?.conflict===!0?(0,G.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,G.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),D.message===void 0||D.message===""?null:(0,G.jsx)("span",{className:"gx-branch-warning-detail",children:D.message})]}):null,m===void 0||oe===void 0?null:(0,G.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:m.root,children:[(0,G.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,G.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,G.jsx)("span",{className:"gx-branch-scope-parent",children:oe.parent}),(0,G.jsx)("span",{className:"gx-branch-scope-name",children:oe.name})]})]}),(0,G.jsx)("input",{ref:w,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:c,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":m===void 0?void 0:Q,"aria-activedescendant":d>=0&&m!==void 0?`${Q}-option-${d}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:H=>u(H.target.value),onKeyDown:k}),ke!==void 0?(0,G.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,G.jsx)("span",{className:"gx-branch-error-text",children:ke}),(0,G.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:V,children:t("action.retry")})]}):null,o.status==="loading"&&m===void 0?(0,G.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,m!==void 0?(0,G.jsxs)("div",{className:"gx-branch-list",id:Q,role:"listbox","aria-label":t("branch.title"),children:[m.branches.length===0?(0,G.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,m.branches.length>0&&L.length===0?(0,G.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,L.map((H,de)=>{let Z=H.branch,Se=de===d;return(0,G.jsxs)("button",{ref:Se?A:void 0,type:"button",role:"option",id:`${Q}-option-${de}`,"aria-selected":Se,"data-active":Se?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${Z.name}`,"data-current":Z.current?"true":void 0,"aria-current":Z.current?"true":void 0,title:Z.worktreePath===void 0?Z.name:`${Z.name} ${t("branch.worktree")}: ${Z.worktreePath}`,disabled:f!==null||Z.worktreePath!==void 0,onClick:()=>{fe(Z)},children:[(0,G.jsx)("span",{className:"gx-branch-row-name",children:mo(Z.name,H.ranges)}),Z.worktreePath===void 0?null:(0,G.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),Z.current?(0,G.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},Z.name)})]}):null]});return(0,G.jsxs)("div",{className:"gx-branch-action",ref:E,children:[(0,G.jsxs)("button",{ref:M,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Ge,"aria-haspopup":"dialog","aria-expanded":i,"aria-controls":i?z:void 0,title:Te,onClick:te,children:[(0,G.jsx)(pe,{className:"gx-branch-icon"}),(0,G.jsx)("span",{className:"gx-branch-name",title:Ae,children:ce}),j===void 0||He?.dirty!==!0?null:(0,G.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:j.dot?t("branch.worktreeDirty"):void 0,children:[j.additions>0?(0,G.jsxs)("span",{className:"gx-branch-add",children:["+",j.additions]}):null,j.deletions>0?(0,G.jsxs)("span",{className:"gx-branch-del",children:["\u2212",j.deletions]}):null,j.dot?(0,G.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,G.jsx)(x,{className:"gx-branch-chevron"})]}),i?$.createPortal===void 0?he:$.createPortal(he,document.body):null]})}return n}function Sn(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function at(e,t){let n=t>0?t:1;return Math.max(1,Math.floor(Math.max(0,e)/2/n))}function st(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"PageDown":return"pageDown";case"PageUp":return"pageUp";case"Enter":return"activate";default:return null}}function lt(e,t,n,r=10){if(n<=0)return;let o=n-1,i=Math.max(1,Math.floor(r));switch(t){case"down":return e===void 0?0:Math.min(e+1,o);case"up":return e===void 0?o:Math.max(e-1,0);case"first":return 0;case"last":return o;case"pageDown":return Math.min(e===void 0?i:e+i,o);case"pageUp":return Math.max(e===void 0?o-i:e-i,0);default:return e===void 0?0:Math.min(Math.max(e,0),o)}}function Cn(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var bo={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Oe(e){return bo[e]}var Rn={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function vo(e,t){return(Rn[e]??0)>=(Rn[t]??0)?e:t}function Tn(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function Pt(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function wo(e){let t=e.split("\0"),n=new Map,r=o=>{let i=n.get(o.path);if(i===void 0){n.set(o.path,o);return}n.set(o.path,{...i,status:vo(i.status,o.status),staged:i.staged||o.staged,isDirectory:i.isDirectory||o.isDirectory,...i.origPath===void 0&&o.origPath===void 0?{}:{origPath:i.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let i=t[o];if(i===void 0||i===""||i.startsWith("#"))continue;let a=i[0];if(a==="1"){let c=i.slice(2),u=c.slice(0,2),d=Pt(c,7);d!==""&&r({path:d,status:Tn(u),staged:u[0]!==".",isDirectory:!1})}else if(a==="2"){let c=i.slice(2),u=c.slice(0,2),d=Pt(c,8),g=t[o+1]??"";d!==""&&g!==""&&(o+=1,r({path:d,status:Tn(u),staged:u[0]!==".",isDirectory:!1,origPath:g}))}else if(a==="u"){let c=i.slice(2),u=Pt(c,9);u!==""&&r({path:u,status:"conflicted",staged:!1,isDirectory:!1})}else if(a==="?"){let c=i.slice(2);if(c==="")continue;let u=c.endsWith("/");r({path:u?c.slice(0,-1):c,status:"untracked",staged:!1,isDirectory:u})}}return[...n.values()]}function ko(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function Ht(e){let t=new Map;for(let n of e){let r=ko(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,i)=>o.path.localeCompare(i.path))}))}function Ve(e){return Ht(wo(e))}function Dt(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let i=Math.floor(o/24);if(i<7)return`${i}d`;let a=Math.floor(i/7);if(a<5)return`${a}w`;let c=Math.floor(i/30);return c<12?`${c}mo`:`${Math.floor(i/365)}y`}function ct(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:Dt(e.time,t)}}function dt({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),i=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${i}`)}}function En({seam:e,sessionId:t}){return(n,r,o=1)=>{let i=typeof n=="string"?n.trim().toLowerCase():"";if(i===""||typeof r!="string")return;let a=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(a==="")return;let c=Number.isFinite(o)&&o>0?Math.floor(o):1,u=`git:${i}:${String(c)}:${a}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",u);let d=e.openViewOrSwitch("fs-explorer",u);if(d.focused){e.viewFocus?.take?.("fs-explorer");return}if(d.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",u)!==!0&&e.openView?.("fs-explorer",u)!==!0&&e.viewFocus?.request?.("fs-explorer",u)}}function Mn({seam:e,sessionId:t}){return n=>{let r=typeof n=="string"?n.trim().toLowerCase():"";if(r==="")return;let o=`compare:${r}:HEAD`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("pr-explorer",o);let i=e.openViewOrSwitch("pr-explorer",o);if(i.focused){e.viewFocus?.take?.("pr-explorer");return}if(i.opened)return;e.viewFocus?.take?.("pr-explorer")}e.views?.open(t,"pr-explorer",o)!==!0&&e.openView?.("pr-explorer",o)!==!0&&e.viewFocus?.request?.("pr-explorer",o)}}var So=/^commit:([0-9a-f]{4,64})$/iu;function In(e){if(e===void 0)return;let t=So.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var Ln=24;function ut(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),a=Math.max(0,e.length-i-o*2),c=Math.floor(Math.max(0,t.scrollTop)/n)-o,u=Math.min(Math.max(c,0),a),d=Math.min(e.length,u+i+o*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function Nn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return Sn({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function Pn(e){let t=[],n=[],r=[],o=0,i=[],a=()=>r.length===0?o++:(r.sort((g,f)=>g-f),r.shift()??o++),c=d=>{d!==null&&!r.includes(d)&&r.push(d)},u=()=>{let d=t.indexOf(null);return d>=0?d:(t.push(null),n.push(null),t.length-1)};for(let d of e){let g=[...t],f=[...n],s=g.indexOf(d.hash),D=s>=0;D||(s=u());let R=D?n[s]??null:null;R===null&&(R=a(),n[s]=R);for(let I=0;I<g.length;I+=1)I!==s&&g[I]===d.hash&&(c(n[I]??null),t[I]=null,n[I]=null);let X=d.parents[0];X===void 0?(c(n[s]??null),t[s]=null,n[s]=null):(t[s]=X,n[s]=R);let E=[];for(let I=1;I<d.parents.length;I+=1){let w=d.parents[I];if(w===void 0)continue;let A=t.indexOf(w);A<0&&(A=u(),t[A]=w),n[A]===null&&(n[A]=a()),E.push(A)}let M=[];for(let I=0;I<g.length;I+=1){let w=g[I];if(w===null)continue;let A=f[I]??R;w===d.hash?M.push({kind:"into",from:I,to:s,color:A}):M.push({kind:"pass",from:I,to:I,color:A})}X!==void 0&&M.push({kind:"out",from:s,to:s,color:n[s]??R});for(let I of E)M.push({kind:"out",from:s,to:I,color:n[I]??R});for(i.push({lane:s,color:R,merge:d.parents.length>=2,segments:M});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return i}function Hn(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function Ne(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Dn(e,t){return`${e.trim().toLowerCase()}\0${t}`}function An(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let i=n.keys().next();i.done||n.delete(i.value)}},get size(){return n.size}}}function Wn(e,t,n,r=10,o=8){let i=Math.max(o,n.width-t.width-o),a=e.right+r;a>i&&(a=e.left-t.width-r,a<o&&(a=Math.min(i,Math.max(o,e.left))));let c=Math.max(o,n.height-t.height-o),u=e.bottom+r,d=e.top-t.height-r,g;return u<=c?g=Math.max(o,u):d>=o?g=d:g=Math.min(c,Math.max(o,e.top)),{left:a,top:g}}var Fn="dsh-git-explorer-styles",Co=`
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
  /* The hover card portals out of the panel and can be read over another
     surface, so its fallback must be opaque: Canvas is the system surface
     colour, which keeps the card solid on a host that publishes no layer-2. */
  --gx-panel-2: var(--dsw-alias-bg-layer-2, Canvas);
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
  /* The card floats over other rows, so it must be opaque: a skin may publish
     layer-2 as a translucent ground colour, so the raised surface is restated
     at alpha 1 instead of trusting the token's alpha. Canvas is the system
     surface colour, which keeps the card solid on a host that publishes no
     layer-2 at all. */
  background: var(--gx-panel-2);
  background: rgb(from var(--gx-panel-2) r g b / 1);
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
  /* A popup is opaque: a frosted fill only reads as glass while the surface
     behind it is opaque, and a skin may publish the sidebar's fill as a
     translucent ground colour so its picture shows through the shell. The
     sidebar's own colour is therefore restated at alpha 1 (keeping the skin's
     hue), with a top-light gradient on top so the pane still reads as a raised
     sheet rather than a flat tint. A browser without relative-colour syntax
     drops the second declaration and keeps the first. */
  background-color: var(--dsw-specific-sidebar-fill, var(--dsw-menu-surface-fill, #f8f9fa));
  background-color: rgb(from var(--dsw-specific-sidebar-fill, var(--dsw-menu-surface-fill, #f8f9fa)) r g b / 1);
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--dsw-alias-label-primary, #000) 4%, transparent),
    transparent 42%
  );
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

/* The Workspace switch reuses the branch popover's solid surface and metrics:
   the two sit in the same header and open the same way, so a second visual
   language would read as a different kind of control. */
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
  background-color: var(--dsw-specific-sidebar-fill, var(--dsw-menu-surface-fill, #f8f9fa));
  background-color: rgb(from var(--dsw-specific-sidebar-fill, var(--dsw-menu-surface-fill, #f8f9fa)) r g b / 1);
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--dsw-alias-label-primary, #000) 4%, transparent),
    transparent 42%
  );
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
`;function Gn(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Fn}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Fn,n.textContent=Co,e.head.appendChild(n),()=>{n.remove()}}var zn="lionad.git",Ro="@",At=60;function To(e){let t=e.replace(/\s+/gu," ").trim();if(t.length<=At)return t;let n=t.slice(0,At),r=n.lastIndexOf(" ");return`${(r>At*.75?n.slice(0,r):n).trimEnd()}\u2026`}function Eo(e){if(!Number.isFinite(e))return"";let t=new Date(e*1e3);if(Number.isNaN(t.getTime()))return"";let n=r=>String(r).padStart(2,"0");return`${String(t.getFullYear())}-${n(t.getMonth()+1)}-${n(t.getDate())}`}function On(e){let n=[e.subject===""?`[git commit ${e.hash}]`:`[git commit ${e.hash}] ${e.subject}`],r=e.refs.filter(o=>o.trim()!=="").join(", ");return r!==""&&n.push(r),e.author!==""&&n.push(e.author),e.date!==""&&n.push(e.date),n.join(" \xB7 ")}function Mo(e,t,n){return{hash:e.hash,subject:To(e.subject),refs:n.filter(r=>r.trim()!==""),author:e.author,date:Eo(e.time),short:t}}function _n(e,t,n=[]){let r=Mo(e,t,n);return{kind:"git.commit",id:e.hash,label:r.subject===""?t:`${t} ${r.subject}`,clipboardText:`[git commit ${t}]`,modelText:On(r),ref:JSON.stringify(r)}}function Io(e){let t;try{t=JSON.parse(e)}catch{return`[git commit ${e}]`}if(t===null||typeof t!="object")return`[git commit ${e}]`;let n=t;return typeof n.hash!="string"||n.hash===""?`[git commit ${e}]`:On({hash:n.hash,subject:typeof n.subject=="string"?n.subject:"",refs:Array.isArray(n.refs)?n.refs.filter(r=>typeof r=="string"):[],author:typeof n.author=="string"?n.author:"",date:typeof n.date=="string"?n.date:"",short:typeof n.short=="string"?n.short:""})}function Lo(e){try{let t=JSON.parse(e);if(typeof t.short=="string"&&t.short!=="")return`[git commit ${t.short}]`}catch{}return`[git commit ${e}]`}function $n(e,t){let n={source:zn,ref:t.ref,label:t.label,clipboardText:t.clipboardText,appearance:"session"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(n,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(n,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(t.clipboardText,r)?"text":"failed"}function Bn(e){return e.sessionId===void 0?{enabled:!1,reasonKey:"reference.disabled.noSession"}:e.hasComposer?e.sourceAvailable?e.phase!==void 0&&e.phase!=="plain"?{enabled:!1,reasonKey:"reference.disabled.busy"}:{enabled:!0}:{enabled:!1,reasonKey:"reference.disabled.noSource"}:{enabled:!1,reasonKey:"reference.disabled.noComposer"}}function Kn(e){if(e===null||typeof e!="object")return{};let t=e,n=t.views,r=n?.open,o=t.openView,i=t.viewFocus,a=i?.request,c=i?.take,u=t.openViewOrSwitch,d=t.currentSessionId;return{openView:typeof r=="function"?(g,f,s)=>r.call(n,g,f,s)===!0:typeof o=="function"?(g,f,s)=>o.call(t,f,s):void 0,requestFocus:typeof a=="function"?(g,f)=>{a.call(i,g,f)}:void 0,takeFocus:typeof c=="function"?g=>{c.call(i,g)}:void 0,openViewOrSwitch:typeof u=="function"?(g,f)=>u.call(t,g,f):void 0,currentSessionId:typeof d=="function"?()=>d.call(t):void 0}}function No(e){if(e===null||typeof e!="object")return;let t=e;if(typeof t.id=="string"&&t.id!=="")return t.id;if(typeof t.sessionId=="string"&&t.sessionId!=="")return t.sessionId}function Po(e){let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t.hash;if(typeof n!="string")return;let r=n.trim().toLowerCase();return/^[0-9a-f]{4,64}$/u.test(r)?r:void 0}function Ho(e,t,n){let r=Po(n);if(r===void 0||t===void 0||t==="")return!1;let o=e.currentSessionId?.();if(o!==void 0&&o!==t)return!1;let i=`commit:${r}`;return e.openView?.(t,Ce,i)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(Ce,i),e.openViewOrSwitch?.(Ce)?.opened===!0?!0:(e.takeFocus?.(Ce),!1)):e.openViewOrSwitch?.(Ce,i)?.focused===!0}function Do(e=()=>({})){return{trigger:Ro,name:zn,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:Lo,async serialize(t){return Io(t)}},openReference(t,n){let r=n!==null&&typeof n=="object"?n.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=No(t)??o.currentSessionId?.();return Ho(o,i,r)}catch{return!1}}}}function Ao(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function Vn(e,t){let n=Do(t),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],a=>{a.effect(()=>(r=a.inputTriggers.registerSource(n),o),"dsh-git-explorer: commit reference source")}),i}catch{}try{let a=e.get?.("inputTriggers");if(Ao(a))return r=a.registerSource(n),i}catch{}return i}var y=require("react");var ee=require("react");function jn(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let i=o.files.filter(a=>a.path.toLowerCase().includes(n));i.length>0&&r.push({dir:o.dir,files:i})}return r}var U=require("react/jsx-runtime");function Fe(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function Wo(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function Fo(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Go(e,t){if(e===null||t<0)return;let n=e.querySelectorAll(".gx-file, .gx-group-head")[t];n!==void 0&&(n.tagName==="BUTTON"?n.focus({preventScroll:!0}):e.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function zo({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,U.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,U.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function qn({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:i,memory:a}){let c=(0,ee.useRef)(null),u=(0,ee.useRef)(null),[d,g]=(0,ee.useState)(()=>a?.query??""),f=(0,ee.useMemo)(()=>jn(e,d),[e,d]),s=(0,ee.useMemo)(()=>Wo(f),[f]),D=(0,ee.useMemo)(()=>s.map(Fe),[s]),R=e.reduce((x,m)=>x+m.files.length,0),X=(0,ee.useMemo)(()=>f.reduce((x,m)=>x+m.files.length,0),[f]),E=d.trim()!=="",[M,I]=(0,ee.useState)(()=>a?.cursor),w=(0,ee.useMemo)(()=>M===void 0?-1:D.indexOf(M),[M,D]),A=(0,ee.useCallback)(x=>{a!==void 0&&(x===void 0?delete a.cursor:a.cursor=x),I(x)},[a]),re=(0,ee.useRef)(0);(0,ee.useEffect)(()=>{w>=0&&(re.current=w)},[w]);let Q=(0,ee.useRef)(s);Q.current=s;let z=(0,ee.useRef)(!1);(0,ee.useEffect)(()=>{if(!o||z.current)return;if(z.current=!0,i(),w>=0){Go(u.current,w);return}Fo(c.current);let x=Q.current.find(m=>m.kind==="file");x!==void 0&&A(Fe(x))},[o,w,i]);let $=(0,ee.useRef)(a?.scrollTop);(0,ee.useEffect)(()=>{let x=u.current,m=$.current;x===null||m===void 0||($.current=void 0,x.scrollTop=m)},[]),(0,ee.useEffect)(()=>{if(M===void 0||w>=0||s.length===0)return;let x=s[Math.min(re.current,s.length-1)];x!==void 0&&A(Fe(x))},[w,M,s]);let q=(0,ee.useCallback)(x=>{let m=D[x];m!==void 0&&(A(m),u.current?.focus({preventScroll:!0}))},[D]);(0,ee.useEffect)(()=>{if(w<0)return;u.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[w,M]);let pe=(0,ee.useCallback)(x=>{let m=st({key:x.key,composing:x.nativeEvent.isComposing,alt:x.altKey,ctrl:x.ctrlKey,meta:x.metaKey,shift:x.shiftKey});if(m===null)return;if(x.preventDefault(),m==="activate"){let T=w<0?void 0:s[w];T?.kind==="file"&&!T.file.isDirectory&&r(T.file.path,1);return}let oe=u.current?.clientHeight??480,K=u.current?.querySelector(".gx-file, .gx-group-head")?.getBoundingClientRect().height??26,S=lt(w<0?void 0:w,m,s.length,at(oe,K));S!==void 0&&q(S)},[w,q,r,s]);return(0,U.jsxs)("section",{ref:c,className:"gx-pane","data-testid":"git-changes",children:[(0,U.jsxs)("header",{className:"gx-pane-head",children:[(0,U.jsx)("span",{children:n("changes.title")}),(0,U.jsx)("span",{className:"gx-count",children:E?`${String(X)} / ${String(R)}`:R}),(0,U.jsx)("span",{className:"gx-spacer"}),(0,U.jsx)("input",{className:"gx-filter",type:"search",value:d,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:x=>{let m=x.currentTarget.value;a!==void 0&&(m===""?delete a.query:a.query=m),g(m)}})]}),(0,U.jsx)("div",{className:"gx-scroll",ref:u,tabIndex:0,"data-testid":"git-changes-scroll","data-page-keys":"own",onKeyDown:pe,onScroll:x=>{a!==void 0&&(a.scrollTop=x.currentTarget.scrollTop)},children:R===0?(0,U.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,U.jsx)("strong",{children:n("changes.empty")})}):s.length===0?(0,U.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,U.jsx)("strong",{children:n("changes.noMatch")})}):s.map(x=>x.kind==="group"?(0,U.jsxs)("div",{className:"gx-group-head","data-cursor":Fe(x)===M?"true":"false",children:[(0,U.jsx)("span",{className:"gx-group-dir",children:x.dir===""?n("changes.root"):x.dir}),(0,U.jsx)("span",{className:"gx-count",children:x.count})]},Fe(x)):(0,U.jsxs)("button",{type:"button",className:"gx-file","data-status":x.file.status,"data-directory":x.file.isDirectory?"true":"false","data-renamed":x.file.origPath===void 0?"false":"true","data-cursor":Fe(x)===M?"true":"false","data-testid":"git-change-file",title:x.file.isDirectory?`${n(`status.${x.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${x.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{A(Fe(x)),u.current?.focus({preventScroll:!0}),x.file.isDirectory||r(x.file.path,1)},children:[(0,U.jsx)("span",{className:"gx-badge","data-status":x.file.status,children:Oe(x.file.status)}),(0,U.jsxs)("span",{className:"gx-file-name",children:[Ne(x.file.path),x.file.origPath===void 0?null:(0,U.jsx)("span",{className:"gx-file-orig",children:Ne(x.file.origPath)})]}),(0,U.jsx)("span",{className:"gx-file-stats",children:(0,U.jsx)(zo,{stat:t.get(x.file.path)})})]},Fe(x)))})]})}var J=require("react"),Un=require("react-dom");var v=require("react/jsx-runtime"),Oo=200,_o=40,$o=24,Bo=7;function Ko({additions:e,deletions:t}){return e===null&&t===null?(0,v.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,v.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Vo(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function jo({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,v.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,v.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,v.jsx)("strong",{children:t("preview.unavailable")}),(0,v.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,v.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,v.jsx)("strong",{children:t("preview.unavailable")}),(0,v.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,v.jsxs)(v.Fragment,{children:[r.text===""?(0,v.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,v.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,v.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,v.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function qo({preview:e,hash:t,t:n}){let r=(0,J.useRef)(null),o=(0,J.useRef)(null),[i,a]=(0,J.useState)(null),[c,u]=(0,J.useState)(!1);return(0,J.useLayoutEffect)(()=>{let d=r.current;if(d===null)return;let g=d.getBoundingClientRect();a(Wn(e.anchor,{width:g.width,height:g.height},{width:window.innerWidth,height:window.innerHeight}));let f=o.current;u(f!==null&&f.scrollHeight>f.clientHeight+1)},[e]),typeof document>"u"?null:(0,Un.createPortal)((0,v.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":c?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:i?.left??0,top:i?.top??0,visibility:i===null?"hidden":"visible"},children:[(0,v.jsxs)("div",{className:"gx-preview-head",children:[(0,v.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Oe(e.file.status)}),(0,v.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:Ne(e.file.path)}),(0,v.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Bo)} \xB7 ${n("preview.revision")}`})]}),(0,v.jsx)("div",{className:"gx-preview-body",children:(0,v.jsx)(jo,{preview:e,t:n,textRef:o})})]}),document.body)}function Xn({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:i,onCompareToHead:a,refs:c,inputActions:u,phase:d,sourceAvailable:g,onReference:f}){let[s,D]=(0,J.useState)({kind:"idle"}),[R,X]=(0,J.useState)(0),E=(0,J.useRef)(new Map),M=(0,J.useRef)(!1),[I,w]=(0,J.useState)({kind:"idle"}),A=(0,J.useRef)(An($o)),re=(0,J.useRef)(void 0),Q=(0,J.useRef)(void 0),z=(0,J.useRef)(void 0),$=(0,J.useRef)(null),q=(0,J.useCallback)(()=>{re.current=void 0,Q.current!==void 0&&(window.clearTimeout(Q.current),Q.current=void 0),z.current?.abort(),z.current=void 0,w(S=>S.kind==="idle"?S:{kind:"idle"})},[]),pe=(0,J.useCallback)((S,T)=>{if(q(),t===void 0)return;let _=T.getBoundingClientRect(),te={left:_.left,top:_.top,right:_.right,bottom:_.bottom},V=Dn(t,S.path);re.current=V,Q.current=window.setTimeout(()=>{if(Q.current=void 0,re.current!==V)return;let fe=A.current.get(V);if(fe!==void 0){w({kind:"ready",file:S,anchor:te,page:fe});return}if(e===void 0||n===void 0||typeof n.show!="function"){w({kind:"unavailable",file:S,anchor:te,message:r("preview.noService")});return}let ie=new AbortController;z.current=ie,w({kind:"loading",file:S,anchor:te}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:S.path,offset:1,limit:_o},ie.signal)).then(k=>{if(ie.signal.aborted||re.current!==V)return;let ne=Ie(k);if(!ne.ok){w({kind:"unavailable",file:S,anchor:te,message:ne.message});return}let ce=ne.result;if(!ce.ok){w({kind:"unavailable",file:S,anchor:te,message:Vo(ce.error.code,ce.error.message,r)});return}A.current.set(V,ce.page),w({kind:"ready",file:S,anchor:te,page:ce.page})}).catch(k=>{ie.signal.aborted||re.current!==V||w({kind:"unavailable",file:S,anchor:te,message:Le(k)})}).finally(()=>{z.current===ie&&(z.current=void 0)})},Oo)},[q,t,n,e,r]);(0,J.useEffect)(()=>{if(t===void 0){D({kind:"idle"});return}let S=E.current.get(t);if(S!==void 0){D({kind:"ready",detail:S});return}if(n===void 0||e===void 0){D({kind:"failed",message:r("state.noService.description")});return}let T=!0;return D({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(_=>{if(!T)return;let te=Ie(_);if(!te.ok){D({kind:"failed",message:te.message});return}let V=te.result;V.ok?(E.current.set(t,V.detail),D({kind:"ready",detail:V.detail})):D({kind:"failed",message:V.error.message===""?V.error.code:V.error.message})}).catch(_=>{T&&D({kind:"failed",message:Le(_)})}),()=>{T=!1}},[t,n,e,R,r]),(0,J.useEffect)(()=>{if(I.kind==="idle")return;let S=T=>{T.key==="Escape"&&q()};return document.addEventListener("keydown",S),()=>document.removeEventListener("keydown",S)},[I.kind,q]),(0,J.useEffect)(()=>{let S=$.current;if(S===null)return;let T=()=>q();return S.addEventListener("scroll",T,{passive:!0}),()=>S.removeEventListener("scroll",T)},[q]),(0,J.useEffect)(()=>{q()},[t,R,e,n,q]),(0,J.useEffect)(()=>()=>{re.current=void 0,Q.current!==void 0&&window.clearTimeout(Q.current),z.current?.abort()},[]);let x=ct(s.kind==="ready"?s.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""}),m=Bn({sessionId:e,hasComposer:u!==void 0&&typeof u.captureInsertion=="function",phase:d,sourceAvailable:g===!0}),oe=m.enabled&&s.kind==="ready"&&f!==void 0,L=m.enabled?s.kind==="ready"?void 0:r("detail.empty"):r(m.reasonKey),K=()=>{if(!(!oe||M.current||s.kind!=="ready"||f===void 0)){M.current=!0;try{f(_n(s.detail,x.shortHash,c??[]))==="failed"&&window.console?.warn?.(`[dsh-git-explorer] ${r("reference.failed")}`)}finally{M.current=!1}}};return(0,v.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,v.jsxs)("header",{className:"gx-detail-head",children:[(0,v.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,v.jsx)("span",{className:"gx-hash",children:x.shortHash}),(0,v.jsx)("span",{className:"gx-spacer",style:{flex:1}}),a===void 0||t===void 0?null:(0,v.jsx)("button",{type:"button",className:"gx-refbtn","data-testid":"gx-compare-head",title:r("compare.hint"),onClick:()=>a(t),children:r("compare.action")}),(0,v.jsx)("button",{type:"button",className:"gx-refbtn",disabled:!oe,"aria-disabled":!oe,title:L??r("reference.hint"),"data-testid":"gx-reference-commit",onClick:K,children:r("reference.action")})]}),(0,v.jsx)("div",{className:"gx-detail-body",ref:$,children:s.kind==="idle"?(0,v.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):s.kind==="loading"?(0,v.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):s.kind==="failed"?(0,v.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,v.jsx)("strong",{children:r("detail.failed")}),(0,v.jsx)("span",{children:s.message}),(0,v.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>X(S=>S+1),children:r("action.retry")})]}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("div",{className:"gx-detail-subject",children:s.detail.subject}),(0,v.jsxs)("div",{className:"gx-detail-meta",children:[(0,v.jsx)("span",{className:"gx-author",children:s.detail.author}),(0,v.jsx)("span",{children:x.relative}),(0,v.jsx)("span",{title:new Date(s.detail.time*1e3).toLocaleString(),children:new Date(s.detail.time*1e3).toLocaleDateString()})]}),(0,v.jsxs)("div",{className:"gx-parents",children:[(0,v.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),s.detail.parents.length===0?(0,v.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):s.detail.parents.map(S=>(0,v.jsx)("button",{type:"button",className:"gx-parent",title:S,onClick:()=>o(S),children:S.slice(0,7)},S))]}),s.detail.body===""?null:(0,v.jsx)("pre",{className:"gx-body-text",children:s.detail.body}),(0,v.jsxs)("div",{className:"gx-detail-files",children:[(0,v.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(s.detail.files.length)}`}),s.detail.files.length===0?(0,v.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Ht(s.detail.files).map(S=>(0,v.jsxs)("div",{className:"gx-detail-group",children:[(0,v.jsx)("div",{className:"gx-detail-dir",children:S.dir===""?r("changes.root"):S.dir}),S.files.map(T=>(0,v.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:T.path,onClick:()=>i?.(T.path),onMouseEnter:_=>pe(T,_.currentTarget),onMouseLeave:q,children:[(0,v.jsx)("span",{className:"gx-badge","data-status":T.status,children:Oe(T.status)}),(0,v.jsxs)("span",{className:"gx-file-name",children:[Ne(T.path),T.origPath===void 0?null:(0,v.jsx)("span",{className:"gx-file-orig",children:Ne(T.origPath)})]}),(0,v.jsx)("span",{className:"gx-file-stats",children:(0,v.jsx)(Ko,{additions:T.additions,deletions:T.deletions})})]},T.path))]},S.dir===""?".":S.dir))]})]})}),I.kind==="idle"?null:(0,v.jsx)(qo,{preview:I,hash:t??"",t:r})]})}var Y=require("react/jsx-runtime");function Uo(e,t){let n=0,r=0,o=0;for(let i of e)for(let a of i.files){let c=t.get(a.path);c!==void 0&&(n+=c.additions??0,r+=c.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function Jn({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((a,c)=>a+c.files.length,0),i=Uo(e,t);return(0,Y.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,Y.jsxs)("header",{className:"gx-detail-head",children:[(0,Y.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,Y.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,Y.jsx)("span",{className:"gx-spacer"}),i.counted===0?null:(0,Y.jsxs)("span",{className:"gx-detail-stats",children:[(0,Y.jsx)("span",{className:"gx-add",children:`+${String(i.additions)}`}),(0,Y.jsx)("span",{className:"gx-del",children:`-${String(i.deletions)}`})]})]}),(0,Y.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(a=>(0,Y.jsxs)("div",{className:"gx-detail-group",children:[(0,Y.jsxs)("div",{className:"gx-group-head",children:[(0,Y.jsx)("span",{className:"gx-group-dir",children:a.dir===""?n("changes.root"):a.dir}),(0,Y.jsx)("span",{className:"gx-count",children:a.files.length})]}),a.files.map(c=>(0,Y.jsxs)("button",{type:"button",className:"gx-file","data-status":c.status,"data-directory":c.isDirectory?"true":"false","data-testid":"git-change-file",title:c.isDirectory?`${n(`status.${c.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${c.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{c.isDirectory||r(c.path,1)},children:[(0,Y.jsx)("span",{className:"gx-badge","data-status":c.status,children:Oe(c.status)}),(0,Y.jsxs)("span",{className:"gx-file-name",children:[Ne(c.path),c.origPath===void 0?null:(0,Y.jsx)("span",{className:"gx-file-orig",children:Ne(c.origPath)})]}),(0,Y.jsx)("span",{className:"gx-file-stats",children:(0,Y.jsx)(Xo,{stat:t.get(c.path)})})]},c.path))]},a.dir))})]})}function Xo({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,Y.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,Y.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var O=require("react");var je=require("react/jsx-runtime");function Yn(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Qn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(36,t*12)),o=r/Math.max(1,t),i=u=>u*o+o/2,a=n/2,c=e.segments.map((u,d)=>{let g=i(u.from),f=i(u.to),s=u.kind==="pass"?`M ${String(g)} 0 L ${String(f)} ${String(n)}`:u.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(f)} ${String(n*.45)}, ${String(f)} ${String(a)}`:`M ${String(g)} ${String(a)} C ${String(g)} ${String(n*.55)}, ${String(f)} ${String(n*.45)}, ${String(f)} ${String(n)}`;return(0,je.jsx)("path",{d:s,fill:"none",stroke:Yn(u.color),strokeWidth:1.4,strokeLinecap:"round"},`${u.kind}-${String(u.from)}-${String(u.to)}-${String(d)}`)});return(0,je.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[c,(0,je.jsx)("circle",{cx:i(e.lane),cy:a,r:e.merge?4:3.2,fill:Yn(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var Wt="git-explorer.leftColumnWidth";function Ft(e){return Math.min(560,Math.max(240,e))}function er(e){if(e==null)return null;let t;try{t=e.getItem(Wt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function pt(e,t){let n=Math.round(Ft(t));if(e!=null)try{e.setItem(Wt,String(n))}catch{}return n}function tr(e){if(e!=null)try{e.removeItem(Wt)}catch{}}function qe(e,t){return Math.round(e)===Math.round(t)}var Zn=16;function nr(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Zn};case"ArrowRight":return{kind:"nudge",delta:Zn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Ue=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],Gt="git-explorer.historyColumns",rr=16,Re={refs:168,time:84,author:96,hash:68};function or(e){return Ue.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function zt(e,t){let n=or(e);return Math.min(n.max,Math.max(n.min,t))}function ft(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=or(t);return n<r.min||n>r.max?null:n}function Jo(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Ot(e){if(e==null)return Re;let t;try{t=e.getItem(Gt)}catch{return Re}if(t===null)return Re;let n=Jo(t);return n===null?Re:{refs:ft(n,"refs")??Re.refs,time:ft(n,"time")??Re.time,author:ft(n,"author")??Re.author,hash:ft(n,"hash")??Re.hash}}function Yo(e,t){if(e==null)return;let n={};for(let r of Ue){let o=t[r.id];o!==Re[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(Gt):e.setItem(Gt,JSON.stringify(n))}catch{}}function ht(e,t,n){let r=Math.round(zt(t,n)),o={...Ot(e),[t]:r};return Yo(e,o),o}function ir(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-rr};case"ArrowRight":return{kind:"nudge",delta:rr};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function ar(e,t){return qe(e,t)}var C=require("react/jsx-runtime");var Qo=12,ve="uncommitted";function Zo(e,t,n,r){if(e===void 0)return;if(e===ve)return n?0:void 0;let o=t.findIndex(i=>i.hash===e);return o<0?void 0:o+r}function _t(e){return Math.min(116,Math.max(36,e*12))}function ei(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function ti({commit:e,row:t,laneCount:n,rowHeight:r,top:o,selected:i,head:a,cursor:c,onSelect:u}){return(0,C.jsxs)("button",{type:"button",className:"gx-row",style:{top:o},"data-selected":i?"true":"false","data-head":a?"true":"false","data-cursor":c?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>u(e.hash),children:[t===void 0?(0,C.jsx)("span",{className:"gx-graph",style:{width:_t(n)}}):(0,C.jsx)(Qn,{row:t,laneCount:n,height:r}),(0,C.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(d=>(0,C.jsxs)("span",{className:"gx-ref","data-kind":d.kind,children:[(0,C.jsx)("span",{className:"gx-ref-name",children:d.name}),(0,C.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:d.name})]},`${d.kind}:${d.name}`))}),(0,C.jsx)("span",{className:"gx-subject",children:e.subject}),(0,C.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:Dt(e.time)}),(0,C.jsx)("span",{className:"gx-author",children:e.author}),(0,C.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function ni({summary:e,laneCount:t,rowHeight:n,top:r,selected:o,cursor:i,t:a,onSelect:c}){let u=_t(t),g=u/Math.max(1,t)/2,f=0,s=0,D=0;for(let R of e.groups)for(let X of R.files){let E=e.stats.get(X.path);E!==void 0&&(f+=E.additions??0,s+=E.deletions??0,D+=1)}return(0,C.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:r},"data-selected":o?"true":"false","data-cursor":i?"true":"false","data-testid":"git-uncommitted-row",title:a("uncommitted.hint"),"aria-label":a("uncommitted.hint"),onClick:c,children:[(0,C.jsx)("svg",{className:"gx-graph",width:u,height:n,viewBox:`0 0 ${String(u)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:(0,C.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:g,cy:n/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,C.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,C.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${a("uncommitted.label")} (${String(e.fileCount)})`}),(0,C.jsx)("span",{className:"gx-time",children:D===0?null:(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("span",{className:"gx-add",children:`+${String(f)}`})," ",(0,C.jsx)("span",{className:"gx-del",children:`-${String(s)}`})]})}),(0,C.jsx)("span",{className:"gx-author"}),(0,C.jsx)("span",{className:"gx-hash"})]})}var ri=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function oi({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:i,onKeyDown:a,onReset:c}){let u=d=>Ue.find(g=>g.id===d);return(0,C.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:ri.map(d=>{let g=d.id==="graph"||d.id==="subject"?void 0:u(d.id);return(0,C.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${d.id}`,children:[(0,C.jsx)("span",{className:"gx-colhead-label",children:n(d.key)}),g===void 0?null:(0,C.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(d.key)}`,"aria-valuemin":g.min,"aria-valuemax":g.max,"aria-valuenow":e[g.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${g.id}`,onPointerDown:f=>r(g.id,f),onPointerMove:o,onPointerUp:i,onPointerCancel:i,onLostPointerCapture:i,onKeyDown:f=>a(g.id,f),onDoubleClick:()=>c(g.id)})]},d.id)})})}function sr(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:i,hasMore:a,loadingMore:c,loadError:u,searching:d,search:g,t:f,onSelect:s,onLoadMore:D,onSearch:R,onSelectUncommitted:X,memory:E}=e,M=(0,O.useRef)(null),[I,w]=(0,O.useState)(0),[A,re]=(0,O.useState)(0),Q=(0,O.useRef)(!1),[z]=(0,O.useState)(()=>e.columnStorage===void 0?ei():e.columnStorage),[$,q]=(0,O.useState)(()=>Ot(z)),[pe,x]=(0,O.useState)(0),m=on(Ln),oe=(0,O.useRef)(null),[L,K]=(0,O.useState)(void 0),S=e.workingTree,T=S!==void 0&&S.fileCount>0,_=T?1:0,te=t.length+_,V=r===void 0?-1:r===ve?T?0:-1:t.findIndex(h=>h.hash===r)+(T?1:0),fe=L===void 0?void 0:L<_?ve:t[L-_]?.hash,ie=(0,O.useRef)(void 0),k=(0,O.useCallback)(h=>{if(E!==void 0){let b=h===void 0?void 0:h<_?ve:t[h-_]?.hash;b===void 0?delete E.cursor:E.cursor=b}K(h)},[E,t,_]),ne=(0,O.useRef)(E?.cursor),ce=(0,O.useRef)(E?.scrollTop);(0,O.useEffect)(()=>{if(ne.current===void 0)return;if(L!==void 0){ne.current=void 0;return}let h=Zo(ne.current,t,T,_);h!==void 0&&(ne.current=void 0,k(h))},[t,L,T,_]),(0,O.useEffect)(()=>{let h=M.current,b=ce.current;h===null||b===void 0||(ce.current=void 0,h.scrollTop=b,w(h.scrollTop))},[]),(0,O.useEffect)(()=>{let h=M.current;if(h===null)return;let b=()=>{re(h.clientHeight),x(Math.max(0,h.offsetWidth-h.clientWidth))};if(b(),typeof ResizeObserver>"u")return;let ae=new ResizeObserver(b);return ae.observe(h),()=>ae.disconnect()},[t.length]),(0,O.useEffect)(()=>{c||(Q.current=!1)},[c]);let Pe=(0,O.useCallback)(()=>{!a||c||Q.current||(Q.current=!0,D())},[a,c,D]),Ae=h=>{let b=h.currentTarget;w(b.scrollTop),E!==void 0&&(E.scrollTop=b.scrollTop),b.scrollTop+b.clientHeight>=b.scrollHeight-160&&Pe()};(0,O.useEffect)(()=>{let h=fe;if(h===void 0)return;let b=h===ve?T?0:-1:t.findIndex(ae=>ae.hash===h)+_;b!==L&&b>=0?k(b):b<0&&k(void 0)},[t,L,fe,T,_]),(0,O.useEffect)(()=>{let h=ie.current!==r;ie.current=r,!(!h||L===void 0||r===void 0)&&V>=0&&V!==L&&k(V)},[r,t,L,V]),(0,O.useEffect)(()=>{if(L===void 0)return;let h=M.current;if(h===null)return;let b=Nn({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:m,index:L,rowCount:te});b!==h.scrollTop&&(h.scrollTop=b,w(b),E!==void 0&&(E.scrollTop=b))},[L,te,m,E]),(0,O.useEffect)(()=>{if(L===void 0)return;let h=L-_;h<0||!Cn(h,t.length,Qo)||Pe()},[L,t.length,Pe,_]);let He=(0,O.useCallback)(h=>{let b=st({key:h.key,composing:h.nativeEvent.isComposing,alt:h.altKey,ctrl:h.ctrlKey,meta:h.metaKey,shift:h.shiftKey});if(b===null)return;h.preventDefault();let ae=L??(V>=0?V:void 0),se=lt(ae,b,te,at(A===0?480:A,m));if(se===void 0)return;if(k(se),se===0&&T){X?.();return}let Ee=t[se-_];Ee!==void 0&&s(Ee.hash)},[t,L,T,A,s,X,te,m,_,V]),j=ut(Array.from({length:te},(h,b)=>b),{scrollTop:I,height:A===0?480:A,rowHeight:m}),xe=Math.max(1,Hn(n)),Te=(0,O.useCallback)((h,b)=>{if(!(b.button!==0||oe.current!==null)){b.preventDefault(),b.stopPropagation();try{b.currentTarget.setPointerCapture(b.pointerId)}catch{return}oe.current={pointerId:b.pointerId,startX:b.clientX,baseWidth:$[h],restWidth:$[h],id:h},document.body.classList.add("gx-col-resizing")}},[$]),Ge=(0,O.useCallback)(h=>{let b=oe.current;if(b===null||b.pointerId!==h.pointerId)return;let ae=zt(b.id,b.baseWidth+h.clientX-b.startX);q(se=>({...se,[b.id]:ae}))},[]),ke=(0,O.useCallback)(h=>{let b=oe.current;if(b===null||b.pointerId!==h.pointerId)return;oe.current=null,document.body.classList.remove("gx-col-resizing");try{h.currentTarget.releasePointerCapture(h.pointerId)}catch{}let ae=b.baseWidth+h.clientX-b.startX;if(ar(ae,b.baseWidth)){q(se=>({...se,[b.id]:b.restWidth}));return}q(ht(z,b.id,ae))},[z]),he=(0,O.useCallback)(h=>{q(ht(z,h,Re[h]))},[z]),H=(0,O.useCallback)((h,b)=>{if(b.nativeEvent.isComposing)return;let ae=ir(b.key,b.altKey||b.ctrlKey||b.metaKey||b.shiftKey);if(ae===null)return;if(b.preventDefault(),b.stopPropagation(),ae.kind==="reset"){he(h);return}let se=Ue.find(bt=>bt.id===h);if(se===void 0)return;let Ee=ae.kind==="nudge"?$[h]+ae.delta:ae.kind==="min"?se.min:se.max;q(ht(z,h,Ee))},[he,z,$]),de=(0,O.useMemo)(()=>({"--gx-col-graph":`${String(_t(xe))}px`,"--gx-col-refs":`${String($.refs)}px`,"--gx-col-time":`${String($.time)}px`,"--gx-col-author":`${String($.author)}px`,"--gx-col-hash":`${String($.hash)}px`,"--gx-row-h":`${String(m)}px`}),[xe,m,$]),Z=g.trim()!=="",Se=Z?f("history.noMatch"):e.emptyTitle??f("history.empty"),ze=Z?void 0:e.emptyDescription;return(0,C.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:de,children:[(0,C.jsxs)("header",{className:"gx-pane-head",children:[(0,C.jsx)("span",{children:f("history.title")}),(0,C.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(i)}`}),(0,C.jsx)("span",{className:"gx-spacer"}),(0,C.jsx)("input",{className:"gx-filter",type:"search",value:g,spellCheck:!1,placeholder:f("history.search"),"aria-label":f("history.search"),"data-testid":"gx-history-search",onChange:h=>R(h.currentTarget.value)})]}),t.length===0&&!(T&&!Z)?(0,C.jsxs)("div",{className:"gx-empty",children:[(0,C.jsx)("strong",{children:Se}),ze===void 0?null:(0,C.jsx)("span",{children:ze}),e.onRetry===void 0?null:(0,C.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??f("action.retry")})]}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(oi,{widths:$,gutter:pe,t:f,onPointerDown:Te,onPointerMove:Ge,onPointerEnd:ke,onKeyDown:H,onReset:he}),(0,C.jsx)("div",{className:"gx-scroll",ref:M,tabIndex:0,"data-testid":"git-history-scroll","data-page-keys":"own",onScroll:Ae,onKeyDown:He,children:(0,C.jsx)("div",{className:"gx-vlist",style:{height:te*m},children:j.rows.map(h=>{let b=h*m;if(h===0&&T&&S!==void 0)return(0,C.jsx)(ni,{summary:S,laneCount:xe,rowHeight:m,top:b,selected:r===ve,cursor:L===0,t:f,onSelect:()=>{k(0),X?.()}},"uncommitted");let ae=h-_,se=t[ae];return se===void 0?null:(0,C.jsx)(ti,{commit:se,row:n[ae],laneCount:xe,rowHeight:m,top:b,selected:se.hash===r,head:se.hash===o,cursor:h===L,onSelect:Ee=>{k(h),s(Ee)}},se.hash)})})})]}),(0,C.jsxs)("footer",{className:"gx-loadbar",children:[(0,C.jsx)("span",{children:`${f("history.loaded")} ${String(t.length)}`}),u===void 0?null:(0,C.jsx)("span",{className:"gx-del",children:u}),d?(0,C.jsx)("span",{className:"gx-search-status",children:f("history.searching")}):null,(0,C.jsx)("span",{className:"gx-spacer"}),a?(0,C.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:c,onClick:Pe,children:f(c?"history.loading":"history.loadMore")}):(0,C.jsx)("span",{children:t.length===0?"":f("history.noMore")})]})]})}function $t(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}function lr(){let e=new Map;return{forSession(t){let n=t??"",r=e.get(n);if(r!==void 0)return r;let o={history:{},changes:{}};return e.set(n,o),o}}}var Bt="git-explorer.detailHeight";function cr(e){return Math.min(88,Math.max(6,e))}function _e(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function Xe(e,t){let n=t>0?t:600;return cr(Math.round(e/n*1e3)/10)}function dr(e,t){let n=t>0?t:600;return e/100*n}function ur(e){if(e==null)return null;let t;try{t=e.getItem(Bt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function gt(e,t){let n=Math.round(cr(t)*10)/10;if(e!=null)try{e.setItem(Bt,String(n))}catch{}return n}function pr(e){if(e!=null)try{e.removeItem(Bt)}catch{}}function fr(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var B=require("react");function Je(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function hr(e){let t=e.length;for(;t>0;){let n=e.charAt(t-1);if(n!=="/"&&n!=="\\")break;t-=1}return e.slice(0,t)}function gr(e,t){let n=hr(e);if(n!==""){for(let r of t)if(hr(r.path)===n)return r.workspaceId}}function mr(e,t){let n=t.trim().toLowerCase();return n===""?e:e.filter(r=>r.title.toLowerCase().includes(n)||r.path.toLowerCase().includes(n))}var we=require("react/jsx-runtime"),xr=320,ii="min(420px, 100vw - 32px)",yr=5,mt=8,ai=Object.freeze([]);function si(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,gap:yr,margin:mt}):li(t,n)}function li(e,t){let[n,r]=(0,B.useState)(void 0);return(0,B.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=t.current;if(o===null)return;let i=o.getBoundingClientRect(),a=typeof window>"u"?void 0:window,c=Math.min(xr,(a?.innerWidth??xr)-mt*2),u=Math.max(mt,Math.min(i.left,(a?.innerWidth??c)-c-mt));r({position:"fixed",left:u,top:i.bottom+yr,width:c,maxWidth:ii})},[e,t]),n}function ci(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}di(t,n,o,i)}function di(e,t,n,r){(0,B.useEffect)(()=>{if(!n)return;let o=i=>{let a=i.target;a instanceof Node&&e.current?.contains(a)!==!0&&t.current?.contains(a)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[e,t,n,r])}function ui(e,t,n){if(e===0)return-1;if(t<0)return 0;let r=t+n;return r<0?0:r>e-1?e-1:r}function br(e){let{t,available:n,watch:r,list:o,startSession:i}=e;function a({root:c}){let[u,d]=(0,B.useState)(!1),[g,f]=(0,B.useState)(""),[s,D]=(0,B.useState)(-1),[R,X]=(0,B.useState)(null),E=(0,B.useRef)(null),M=(0,B.useRef)(null),I=(0,B.useRef)(null),w=(0,B.useRef)(null),A=(0,B.useRef)(null),re=(0,B.useRef)(!1),Q=(0,B.useId)(),z=ot(),$=z.createPortal!==void 0,q=o===void 0?ai:o(),pe=i!==void 0&&(n===void 0||n()),[,x]=(0,B.useState)(0);(0,B.useEffect)(()=>{if(!(pe||r===void 0))return r(()=>x(k=>k+1))},[pe,r]);let m=(0,B.useMemo)(()=>mr(q,g),[q,g]),oe=gr(c,q),L=(0,B.useCallback)(()=>{d(!1),f(""),X(null)},[]),K=(0,B.useCallback)(()=>{re.current=!0,L(),E.current?.focus({preventScroll:!0})},[L]),S=(0,B.useCallback)(()=>{re.current=!0,L()},[L]);(0,B.useLayoutEffect)(()=>{u&&w.current?.focus({preventScroll:!0})},[u]),(0,B.useLayoutEffect)(()=>{if(u||!re.current)return;re.current=!1;let k=document.activeElement;(k===null||k===document.body||k===E.current||M.current?.contains(k)===!0)&&E.current?.focus({preventScroll:!0})},[u]),(0,B.useEffect)(()=>{if(m.length===0){D(-1);return}let k=m.findIndex(ne=>ne.workspaceId===oe);D(k===-1?0:k)},[m,oe]),(0,B.useEffect)(()=>{A.current?.scrollIntoView?.({block:"nearest"})},[s,m]),(0,B.useEffect)(()=>{if(!u)return;let k=ne=>{ne.key!=="Escape"||ne.isComposing||(ne.preventDefault(),K())};return document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[u,K]);let T=si(z,u,E,I);ci(z,M,I,$,u,S);let _=()=>{if(u){L();return}d(!0)},te=k=>{if(k.workspaceId===oe){K();return}if(i!==void 0){try{i(k.workspaceId)}catch{X(t("workspace.failed"));return}K()}},V=()=>{let k=s<0?void 0:m[s];k!==void 0&&te(k)},fe=k=>{if(!(k.metaKey||k.ctrlKey||k.altKey)&&!k.nativeEvent.isComposing){if(k.key==="ArrowDown"||k.key==="ArrowUp"){k.preventDefault();let ne=k.key==="ArrowDown"?1:-1;D(ce=>ui(m.length,ce,ne));return}k.key==="Enter"&&(k.preventDefault(),V())}},ie=(0,we.jsxs)("div",{className:"gx-workspace-panel","data-testid":"gx-workspace-panel",ref:I,style:T??void 0,role:"listbox",id:Q,"aria-label":t("workspace.title"),children:[(0,we.jsx)("input",{className:"gx-workspace-search","data-testid":"gx-workspace-search",ref:w,type:"text",value:g,placeholder:t("workspace.search"),"aria-label":t("workspace.search"),"aria-controls":Q,onChange:k=>f(k.target.value),onKeyDown:fe}),R===null?null:(0,we.jsx)("div",{className:"gx-workspace-failure",role:"alert",children:R}),(0,we.jsx)("div",{className:"gx-workspace-list",children:m.length===0?(0,we.jsx)("div",{className:"gx-workspace-empty",role:"note",children:q.length===0?t("workspace.none"):t("workspace.empty")}):m.map((k,ne)=>{let ce=k.workspaceId===oe;return(0,we.jsxs)("button",{type:"button",className:"gx-workspace-row","data-testid":`gx-workspace-row-${k.workspaceId}`,"data-current":ce?"true":void 0,"data-active":ne===s?"true":void 0,ref:ne===s?A:void 0,role:"option","aria-selected":ce,title:k.path,onClick:()=>te(k),children:[(0,we.jsx)("span",{className:"gx-workspace-row-title",children:k.title}),(0,we.jsx)("span",{className:"gx-workspace-row-path",children:k.path})]},k.workspaceId)})})]});return pe?(0,we.jsxs)("div",{className:"gx-workspace-switch",ref:M,children:[(0,we.jsx)("button",{type:"button",className:"gx-repo gx-repo-switch","data-testid":"gx-workspace-switch",ref:E,title:c,"aria-haspopup":"listbox","aria-expanded":u,"aria-controls":u?Q:void 0,onClick:_,children:Je(c)}),u?z.createPortal===void 0?ie:z.createPortal(ie,document.body):null]}):(0,we.jsx)("span",{className:"gx-repo",title:c,children:Je(c)})}return a}var N=require("react/jsx-runtime"),mi=250;function xi(e,t){return e===void 0?"idle":t?"loading":"no-service"}function kr(e,t){let n=In(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function yi(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var bi={display:"flex",alignItems:"center",gap:8};function vi(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var wi=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function xt({title:e,description:t,actionLabel:n,onAction:r}){return(0,N.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,N.jsx)("strong",{children:e}),t===void 0?null:(0,N.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,N.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Sr(e){let{workbench:t,version:n,t:r,remote:o,reference:i,referenceSourceAvailable:a,workspaces:c}=e,u=c===void 0?void 0:br({t:r,...c}),d=lr();function g(f){let s=f.sessionId??t.currentSessionId(),D=(0,y.useRef)(s);D.current=s;let R=(0,y.useMemo)(()=>d.forSession(s),[d,s]),E=(f.useInput??(()=>{}))(l=>l.phase),M=(0,y.useMemo)(()=>o(),[o]),[I]=(0,y.useState)(hn),[w,A]=(0,y.useState)(()=>({kind:xi(s,M!==void 0)})),[re,Q]=(0,y.useState)(0),[z,$]=(0,y.useState)([]),[q,pe]=(0,y.useState)(!1),[x,m]=(0,y.useState)(!1),[oe,L]=(0,y.useState)(void 0),[K,S]=(0,y.useState)(()=>R.history.selected),[T,_]=(0,y.useState)(()=>R.history.search??""),[te,V]=(0,y.useState)(!1),fe=(0,y.useRef)(""),ie=(0,y.useRef)(0),k=(0,y.useRef)(void 0),ne=(0,y.useRef)(R.history.selected),ce=(0,y.useRef)(R.history.search!==void 0&&R.history.search!==""),Pe=(0,y.useRef)(void 0),[Ae,He]=(0,y.useState)(!0),j=(0,y.useMemo)(()=>vi(),[]),[xe,Te]=(0,y.useState)(()=>er(j)),Ge=(0,y.useRef)(null),ke=(0,y.useRef)(null),[he,H]=(0,y.useState)(()=>ur(j)),de=(0,y.useRef)(null),Z=(0,y.useRef)(null),Se=(0,y.useCallback)(l=>{R.history.selected=l,S(l)},[R]),ze=(0,y.useCallback)(l=>{k.current=l,Se(l),He(!1)},[Se]),h=(0,y.useCallback)(()=>{He(!1)},[]),b=(0,y.useCallback)(l=>{if(l.button!==0||ke.current!==null||wi())return;let p=Ge.current?.previousElementSibling;if(p instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}ke.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:xe},document.body.classList.add("gx-pane-resizing")}},[xe]),ae=(0,y.useCallback)(l=>{let p=ke.current;p===null||p.pointerId!==l.pointerId||Te(Ft(p.baseWidth+l.clientX-p.startX))},[]),se=(0,y.useCallback)(l=>{let p=ke.current;if(p===null||p.pointerId!==l.pointerId)return;ke.current=null,document.body.classList.remove("gx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let P=p.baseWidth+l.clientX-p.startX;if(qe(P,p.baseWidth)){Te(p.restWidth);return}Te(pt(j,P))},[j]),Ee=(0,y.useCallback)(()=>{tr(j),Te(null)},[j]),bt=(0,y.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let p=nr(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(p===null)return;if(l.preventDefault(),l.stopPropagation(),p.kind==="reset"){Ee();return}if(p.kind==="min"||p.kind==="max"){let F=p.kind==="min"?240:560;Te(pt(j,F));return}let P=Ge.current?.previousElementSibling,ue=P instanceof HTMLElement?P.getBoundingClientRect().width:xe??240;Te(pt(j,ue+p.delta))},[j,Ee,xe]),Vt=(0,y.useCallback)(()=>{let l=de.current?.parentElement;return l instanceof HTMLElement?l.getBoundingClientRect().height:0},[]),Ye=(0,y.useCallback)(()=>Vt()||600,[Vt]),jt=(0,y.useCallback)(()=>{let l=Ye();return _e(dr(he===null?38:he,l),l)},[Ye,he]),Dr=(0,y.useCallback)(l=>{if(l.button!==0||Z.current!==null)return;let p=de.current?.parentElement;if(!(p instanceof HTMLElement))return;let P=de.current?.nextElementSibling;if(P instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}Z.current={pointerId:l.pointerId,startY:l.clientY,baseHeight:P.getBoundingClientRect().height,columnHeight:p.getBoundingClientRect().height||600,restHeight:he},document.body.classList.add("gx-row-resizing")}},[he]),Ar=(0,y.useCallback)(l=>{let p=Z.current;if(p===null||p.pointerId!==l.pointerId)return;let P=_e(p.baseHeight-(l.clientY-p.startY),p.columnHeight);H(Xe(P,p.columnHeight))},[]),vt=(0,y.useCallback)(l=>{let p=Z.current;if(p===null||p.pointerId!==l.pointerId)return;Z.current=null,document.body.classList.remove("gx-row-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let P=_e(p.baseHeight-(l.clientY-p.startY),p.columnHeight);if(qe(P,p.baseHeight)){H(p.restHeight);return}H(gt(j,Xe(P,p.columnHeight)))},[j]),wt=(0,y.useCallback)(()=>{pr(j),H(null)},[j]),Wr=(0,y.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let p=fr(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(p===null)return;if(l.preventDefault(),l.stopPropagation(),p.kind==="reset"){wt();return}let P=Ye();if(p.kind==="min"||p.kind==="max"){let F=p.kind==="min"?_e(180,P):_e(P,P);H(gt(j,Xe(F,P)));return}let ue=_e(jt()+p.delta,P);H(gt(j,Xe(ue,P)))},[Ye,jt,j,wt]);(0,y.useEffect)(()=>()=>{ke.current!==null&&document.body.classList.remove("gx-pane-resizing"),Z.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,y.useEffect)(()=>{if(s===void 0||f.openView===void 0)return;let l=t.views;if(l?.bind!==void 0)return l.bind(s,f.openView)},[s,f.openView,t]),(0,y.useEffect)(()=>{if(s===void 0){A({kind:"idle"});return}if(M===void 0){A({kind:"no-service"});return}let l=!0;return A({kind:"loading"}),L(void 0),ie.current+=1,fe.current="",ce.current?ce.current=!1:_(""),V(!1),Promise.resolve().then(()=>M.snapshot({sessionId:s})).then(p=>{if(!l)return;let P=Ie(p);if(!P.ok){A({kind:"failed",message:P.message});return}let ue=P.result;if(!ue.ok){A({kind:"failed",message:ue.error.message===""?ue.error.code:ue.error.message});return}let F=ue.snapshot;A({kind:"ready",snapshot:F}),$(F.commits),pe(F.commits.length<F.counts.commits);let le=k.current;k.current=void 0;let me=ne.current;ne.current=void 0,S(ye=>{if(le!==void 0)return le;let Be=Ve(F.status).length>0;return me!==void 0?me===ve?Be?me:F.commits[0]?.hash:me:ye===ve?Be?ye:F.commits[0]?.hash:ye!==void 0&&F.commits.some(be=>be.hash===ye)?ye:F.commits[0]?.hash})}).catch(p=>{l&&A({kind:"failed",message:Le(p)})}),()=>{l=!1}},[s,M,re]),(0,y.useEffect)(()=>{K!==void 0&&(R.history.selected=K)},[R,K]),(0,y.useEffect)(()=>{T===""?delete R.history.search:R.history.search=T},[R,T]),(0,y.useEffect)(()=>{let l=f.viewRequest;if(l==null||l.view!==Ce)return;let p=`${l.view}:${l.focus}`;Pe.current!==p&&(Pe.current=p,kr(l.focus,{select:ze,complete:()=>f.completeViewRequest?.()}))},[f.viewRequest,f.completeViewRequest,ze]),(0,y.useEffect)(()=>{let l=t.viewFocus;if(l===void 0||s===void 0)return;let p=()=>{let P=l.take(Ce);P!==void 0&&kr(P,{select:ze})};return p(),l.subscribe(p)},[t,s,ze]);let Fr=(0,y.useMemo)(()=>Pn(z),[z]),ge=w.kind==="ready"?w.snapshot:void 0,Qe=(0,y.useMemo)(()=>ge===void 0?[]:Ve(ge.status),[ge]),kt=(0,y.useMemo)(()=>{let l=new Map;for(let p of ge?.stats??[])l.set(p.path,{additions:p.additions,deletions:p.deletions});return l},[ge]),Ze=(0,y.useMemo)(()=>{let l=new Map;for(let p of ge?.branches??[]){let P=l.get(p.hash);P===void 0?l.set(p.hash,[{kind:p.kind,name:p.name,head:p.head}]):P.push({kind:p.kind,name:p.name,head:p.head})}return l},[ge]);(0,y.useEffect)(()=>{if(s===void 0||M===void 0||w.kind!=="ready")return;let l=T.trim();if(l===fe.current)return;let p=s,P=ie.current+1;if(ie.current=P,L(void 0),m(!1),l===""){fe.current="",V(!1);let F=w.snapshot.commits;$(F),pe(F.length<w.snapshot.counts.commits),S(le=>le===ve||le!==void 0&&F.some(me=>me.hash===le)?le:F[0]?.hash);return}V(!0);let ue=setTimeout(()=>{fe.current=l,Promise.resolve().then(()=>M.query($t(s,l,0))).then(F=>{if(ie.current!==P||D.current!==p)return;let le=Ie(F);if(!le.ok){L(le.message);return}let me=le.result;if(!me.ok){L(me.error.message===""?me.error.code:me.error.message);return}let ye=me.page,Be=Ze;$(ye.commits.map(be=>({...be,refs:Be.get(be.hash)??[]}))),pe(ye.hasMore),S(be=>be===ve||be!==void 0&&ye.commits.some(We=>We.hash===be)?be:ye.commits[0]?.hash)}).catch(F=>{ie.current===P&&L(Le(F))}).finally(()=>{ie.current===P&&V(!1)})},mi);return()=>{clearTimeout(ue)}},[T,s,M,w.kind,Ze]);let Gr=(0,y.useCallback)(()=>{if(s===void 0||M===void 0||!q||x)return;let l=s,p=fe.current,P=ie.current;m(!0),L(void 0),Promise.resolve().then(()=>M.query($t(s,p,z.length))).then(ue=>{if(D.current!==l||ie.current!==P)return;let F=Ie(ue);if(!F.ok){L(F.message);return}let le=F.result;if(!le.ok){L(le.error.message===""?le.error.code:le.error.message);return}let me=le.page;$(ye=>{let Be=new Set(ye.map(We=>We.hash)),be=me.commits.filter(We=>!Be.has(We.hash)).map(We=>({...We,refs:Ze.get(We.hash)??[]}));return be.length===0?ye:[...ye,...be]}),pe(me.hasMore)}).catch(ue=>L(Le(ue))).finally(()=>m(!1))},[s,M,q,x,z.length,Ze]),zr=(0,y.useMemo)(()=>{let l=t.views??{open:(p,P)=>t.openView?.(p,P)??!1};return dt({views:l,sessionId:s??""})},[t,s]),qt=(l,p=1)=>{s!==void 0&&zr(l,p)},Or=(0,y.useMemo)(()=>{let l={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(p,P)=>t.openViewOrSwitch?.(p,P)??{opened:!1,focused:!1}}};return En({seam:l,sessionId:s??""})},[t,s]),_r=(l,p=1)=>{s!==void 0&&K!==void 0&&Or(K,l,p)},Ut=(0,y.useMemo)(()=>{if(!(t.openViewOrSwitch!==void 0||t.openView!==void 0||t.views!==void 0))return;let p={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:t.openViewOrSwitch},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus}};return Mn({seam:p,sessionId:s??""})},[t,s]),$r=l=>{let p=f.inputActions;if(s===void 0||p===void 0)return"failed";let P=i?.(s),ue=$n({captureSpan:()=>{let F=p.captureInsertion?.();return F===void 0?void 0:{start:F.start,end:F.end,draftRev:F.draftRev}},insertReference:(F,le)=>P?.insertReference?.(F,le)??!1,insertText:(F,le)=>p.insertText?.(F,le)??!1,canInsertReference:a?.()===!0},l);return ue!=="failed"?P?.focus?.():P?.notify?.("error",r("reference.failed")),ue},$e=(0,y.useCallback)(()=>Q(l=>l+1),[]),Ei=()=>Q(l=>l+1);(0,y.useEffect)(()=>yi(I,$e),[I,$e]);let Me=ge?.head,et=Qe.reduce((l,p)=>l+p.files.length,0),tt=(0,y.useMemo)(()=>et===0?void 0:{groups:Qe,stats:kt,fileCount:et},[et,Qe,kt]),Br=(0,y.useMemo)(()=>{if(K===void 0)return;let l=z.find(p=>p.hash===K);return l===void 0?void 0:l.refs.map(p=>p.name)},[z,K]);return(0,N.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":w.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,N.jsxs)("header",{className:"gx-head",children:[(0,N.jsxs)("div",{className:"gx-head-main",children:[(0,N.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,N.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,N.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,N.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,N.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,N.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),ge===void 0?(0,N.jsx)("span",{className:"gx-repo",title:r("view.title"),children:r("view.title")}):u===void 0?(0,N.jsx)("span",{className:"gx-repo",title:ge.root,children:Je(ge.root)}):(0,N.jsx)(u,{root:ge.root}),Me?.branch===null||Me?.branch===void 0?null:(0,N.jsx)("span",{className:"gx-branch",children:Me.branch}),Me?.detached===!0?(0,N.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,Me?.ahead!==void 0&&Me.ahead>0?(0,N.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(Me.ahead)}`}):null,Me?.behind!==void 0&&Me.behind>0?(0,N.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(Me.behind)}`}):null]}),(0,N.jsxs)("div",{className:"gx-head-meta",style:bi,children:[ge===void 0?null:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)("span",{children:[r("head.changes")," ",(0,N.jsx)("b",{children:et})]}),(0,N.jsxs)("span",{children:[r("head.commits")," ",(0,N.jsx)("b",{children:ge.counts.commits})]}),(0,N.jsxs)("span",{children:[r("head.branches")," ",(0,N.jsx)("b",{children:ge.counts.branches})]})]}),(0,N.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:w.kind==="loading",onClick:$e,children:"\u21BB"})]})]}),s===void 0?(0,N.jsx)(xt,{title:r("state.noSession.title"),description:r("state.noSession.description")}):w.kind==="no-service"?(0,N.jsx)(xt,{title:r("state.noService.title"),description:r("state.noService.description")}):w.kind==="loading"?(0,N.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):w.kind==="failed"?(0,N.jsx)(xt,{title:r("state.failed.title"),description:w.message,actionLabel:r("action.retry"),onAction:$e}):w.kind==="ready"&&!w.snapshot.isRepository?(0,N.jsx)(xt,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:$e}):w.kind==="ready"?(0,N.jsxs)("div",{className:"gx-body",style:xe===null?void 0:{"--gx-left-col":`${xe}px`},children:[(0,N.jsx)(qn,{groups:Qe,stats:kt,t:r,onOpen:qt,claimFocus:Ae,onFocusClaimed:h,memory:R.changes}),(0,N.jsx)("div",{ref:Ge,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":xe??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:b,onPointerMove:ae,onPointerUp:se,onPointerCancel:se,onLostPointerCapture:se,onKeyDown:bt,onDoubleClick:Ee}),(0,N.jsxs)("div",{className:"gx-col",style:he===null?void 0:{"--gx-detail-h":`${String(he)}%`},children:[(0,N.jsx)(sr,{commits:z,graph:Fr,selectedHash:K,headHash:w.snapshot.head?.hash??null,total:w.snapshot.counts.commits,hasMore:q,loadingMore:x,loadError:oe,searching:te,search:T,t:r,onSelect:Se,onLoadMore:Gr,onSearch:_,workingTree:tt,onSelectUncommitted:()=>Se(ve),memory:R.history,...w.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:$e,retryLabel:r("action.retry")}:{}}),(0,N.jsx)("div",{ref:de,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":he??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:Dr,onPointerMove:Ar,onPointerUp:vt,onPointerCancel:vt,onLostPointerCapture:vt,onKeyDown:Wr,onDoubleClick:wt}),K===ve&&tt!==void 0?(0,N.jsx)(Jn,{groups:tt.groups,stats:tt.stats,t:r,onOpen:qt}):(0,N.jsx)(Xn,{sessionId:s,hash:K,remote:M,t:r,onSelect:Se,onOpenFile:_r,...Ut===void 0?{}:{onCompareToHead:Ut},refs:Br,...f.inputActions===void 0?{}:{inputActions:f.inputActions},...E===void 0?{}:{phase:E},sourceAvailable:a?.()===!0,onReference:$r})]})]}):null]})}return g}var Rr=["slots","locale","workbench","remote"];function Cr(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function Tr(e){return()=>{try{let n=e.remote?.gitExplorer;if(Cr(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Cr(n))return n}catch{}let t=Er(e);return t===void 0?void 0:pn(t)}}function Er(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,i)=>n.call("/api",`${sn}/${r}`,o,i)}function Mr(e){return t=>{let n=e.get?.("sessions"),r=e.get?.("conversation");if(n?.scope===void 0||r?.input?.for===void 0)return;let o;try{let u=n.scope(t);if(u===void 0)return;o=r.input.for(u)}catch{return}if(o==null)return;let i=o.insertReference,a=o.focus,c=o.notify;return{...typeof i=="function"?{insertReference:(u,d)=>i.call(o,u,d)}:{},...typeof a=="function"?{focus:()=>a.call(o)}:{},...typeof c=="function"?{notify:(u,d)=>c.call(o,u,d)}:{}}}}function Ir(e){let t=()=>{try{let o=e.get?.("workspaces")?.list?.getSnapshot().items;return Array.isArray(o)?o:[]}catch{return[]}},n=r=>{let o=e.get?.("uiWorkspace");typeof o?.startSession=="function"&&o.startSession(r)};return{available:()=>Ci(e),watch:Lr(e),list:t,startSession:n}}function Lr(e){let t=e.inject;return typeof t!="function"?()=>()=>{}:n=>{try{let r=t.call(e,["workspaces","uiWorkspace"],()=>(n(),()=>{}));if(r===void 0||typeof r.dispose!="function")return()=>{};let o=r.dispose.bind(r);return()=>{o()}}catch{return()=>{}}}}function Ci(e){try{return typeof e.get?.("workspaces")?.list?.getSnapshot!="function"?!1:typeof e.get?.("uiWorkspace")?.startSession=="function"}catch{return!1}}var yt;function Nr(e){let t=e.locale.bind(Ke);yt?.();let n=e.locale.register(Ke,{zh:Xt,en:Jt});yt=n;let r=Gn(typeof document>"u"?void 0:document),o=rn(e),i=Tr(e),a=Mr(e),c=Vn(e,()=>Kn(e.workbench)),u=kn({store:fn(i),t});e.slots.inject(Et,()=>e.slots.register({name:Et,id:an,order:30,locale:Ke},u));let d=e.workbench;if(d!=null){let g=Ir(e),f=Sr({workbench:d,version:d.version,t,remote:i,reference:a,referenceSourceAvailable:()=>c.available,workspaces:g});e.slots.inject(Tt,()=>e.slots.register({name:Tt,id:Ce,order:110,label:()=>t("tab.label"),locale:Ke},f))}return()=>{r(),o(),c.dispose(),n(),yt===n&&(yt=void 0)}}var Pr={groupChanges:Ve,formatCommitDetail:ct,createJump:dt,computeWindow:ut},Hr={name:"dsh-git-explorer",inject:Rr,apply:Nr,__test:Pr},Ri=Hr;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
