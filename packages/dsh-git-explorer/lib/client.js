window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var bt=Object.defineProperty;var Dr=Object.getOwnPropertyDescriptor;var Ar=Object.getOwnPropertyNames;var Wr=Object.prototype.hasOwnProperty;var Fr=(e,t)=>{for(var n in t)bt(e,n,{get:t[n],enumerable:!0})},Gr=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ar(t))!Wr.call(e,o)&&o!==n&&bt(e,o,{get:()=>t[o],enumerable:!(r=Dr(t,o))||r.enumerable});return e};var zr=e=>Gr(bt({},"__esModule",{value:!0}),e);var hi={};Fr(hi,{__test:()=>kr,apply:()=>wr,boot:()=>cn,clientPlugin:()=>Sr,createReferenceResolver:()=>yr,createRemoteResolver:()=>xr,createRpcCall:()=>br,createWorkspaceSwitch:()=>vr,default:()=>fi,inject:()=>mr});module.exports=zr(hi);var $t={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","workspace.title":"\u5207\u6362\u5DE5\u4F5C\u533A","workspace.search":"\u641C\u7D22\u5DE5\u4F5C\u533A","workspace.empty":"\u6CA1\u6709\u5339\u914D\u7684\u5DE5\u4F5C\u533A","workspace.none":"\u8FD8\u6CA1\u6709\u6CE8\u518C\u5DE5\u4F5C\u533A","workspace.failed":"\u5207\u6362\u5DE5\u4F5C\u533A\u5931\u8D25","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","branch.title":"\u5207\u6362\u5206\u652F","branch.loading":"\u52A0\u8F7D\u4E2D","branch.empty":"\u8FD8\u6CA1\u6709\u672C\u5730\u5206\u652F","branch.unborn":"\u7A7A\u4ED3\u5E93","branch.current":"\u5F53\u524D","branch.worktree":"\u5DF2\u5728\u5176\u4ED6\u5DE5\u4F5C\u6811\u68C0\u51FA","branch.taken":"\u5176\u4ED6\u5DE5\u4F5C\u6811","branch.search":"\u641C\u7D22\u5206\u652F","branch.scope":"\u5207\u6362\u4F5C\u7528\u4E8E","branch.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u5206\u652F","branch.worktreePrefix":"\u5DE5\u4F5C\u533A","branch.worktreeSep":"\uFF0C","branch.worktreeClean":"\u5DE5\u4F5C\u533A\u5E72\u51C0","branch.worktreeDirty":"\u5DE5\u4F5C\u533A\u6709\u672A\u63D0\u4EA4\u6539\u52A8","branch.worktreeFile":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeFiles":"\u4E2A\u6587\u4EF6\u53D8\u66F4","branch.worktreeUntracked":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.worktreeUntrackedFiles":"\u4E2A\u672A\u8DDF\u8E2A\u6587\u4EF6","branch.stashConflict":"\u6539\u52A8\u5DF2\u4FDD\u5B58\u5728 stash\uFF0C\u6062\u590D\u65F6\u53D1\u751F\u51B2\u7A81","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","detail.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u63D0\u4EA4\u8BE6\u60C5\u9AD8\u5EA6","detail.resizeHint":"\u62D6\u62FD\u6216 \u2191/\u2193 \u8C03\u6574\u9AD8\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","changes.filter":"\u8FC7\u6EE4\u6587\u4EF6","changes.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u6587\u4EF6","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","history.search":"\u641C\u7D22\u63D0\u4EA4\u4FE1\u606F","history.searching":"\u6B63\u5728\u641C\u7D22\u2026","history.noMatch":"\u6CA1\u6709\u5339\u914D\u7684\u63D0\u4EA4","history.col.graph":"\u56FE\u8868","history.col.refs":"\u5F15\u7528","history.col.subject":"\u63CF\u8FF0","history.col.time":"\u65E5\u671F","history.col.author":"\u4F5C\u8005","history.col.hash":"\u63D0\u4EA4","history.col.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5217\u5BBD","history.col.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5217\u5BBD\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","uncommitted.title":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.label":"\u672A\u63D0\u4EA4\u7684\u53D8\u66F4","uncommitted.hint":"\u67E5\u770B\u5DE5\u4F5C\u533A\u53D8\u66F4","uncommitted.files":"\u4E2A\u6587\u4EF6","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","reference.action":"\u5F15\u7528","reference.hint":"\u628A\u8FD9\u4E2A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","reference.disabled.noSession":"\u6CA1\u6709\u53EF\u5199\u5165\u7684\u4F1A\u8BDD","reference.disabled.noComposer":"\u5F53\u524D\u5BBF\u4E3B\u6CA1\u6709\u53EF\u5199\u5165\u7684\u8F93\u5165\u6846","reference.disabled.busy":"\u8F93\u5165\u6846\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u8BD5","reference.disabled.noSource":"\u5F15\u7528\u6765\u6E90\u672A\u6CE8\u518C\uFF0C\u63D2\u5165\u540E\u65E0\u6CD5\u53D1\u9001","reference.failed":"\u65E0\u6CD5\u628A\u63D0\u4EA4\u63D2\u5165\u8F93\u5165\u6846","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Bt={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","workspace.title":"Switch workspace","workspace.search":"Search workspaces","workspace.empty":"No matching workspace","workspace.none":"No workspace registered yet","workspace.failed":"Could not switch workspace","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","branch.title":"Switch branch","branch.loading":"Loading","branch.empty":"No local branches","branch.unborn":"Empty repository","branch.current":"current","branch.worktree":"Checked out in another worktree","branch.taken":"Other worktree","branch.search":"Search branches","branch.scope":"Switch applies to","branch.noMatch":"No matching branch","branch.worktreePrefix":"Working tree","branch.worktreeSep":", ","branch.worktreeClean":"Working tree clean","branch.worktreeDirty":"Uncommitted changes in the working tree","branch.worktreeFile":"file changed","branch.worktreeFiles":"files changed","branch.worktreeUntracked":"untracked file","branch.worktreeUntrackedFiles":"untracked files","branch.stashConflict":"Changes are kept in the stash; applying them back hit a conflict","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","detail.resize":"Drag or use arrow keys to resize the commit detail","detail.resizeHint":"Drag or \u2191/\u2193 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","changes.filter":"Filter files","changes.noMatch":"No matching file","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","history.search":"Search commit messages","history.searching":"Searching\u2026","history.noMatch":"No matching commit","history.col.graph":"Graph","history.col.refs":"Refs","history.col.subject":"Subject","history.col.time":"Date","history.col.author":"Author","history.col.hash":"Commit","history.col.resize":"Drag or use arrow keys to resize the column","history.col.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","uncommitted.title":"Uncommitted Changes","uncommitted.label":"Uncommitted changes","uncommitted.hint":"View working tree changes","uncommitted.files":"files","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","reference.action":"Reference","reference.hint":"Insert this commit into the composer","reference.disabled.noSession":"No session to insert into","reference.disabled.noComposer":"This host has no composer to insert into","reference.disabled.busy":"The composer is sending; try again in a moment","reference.disabled.noSource":"The reference source is not registered, so the chip could not be sent","reference.failed":"Could not insert the commit into the composer","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var qt=require("react"),Ut=14,_r="--dsh-content-font-size",Kt=Ut;function Or(e,t){return Math.max(e,Math.round(e*t/Ut))}function $r(e,t){if(e===void 0)return t;let n=Number.parseFloat(e);return Number.isFinite(n)&&n>0?n:t}function Xt(){return typeof document>"u"||document.body===null?Kt:$r(document.body.style.getPropertyValue(_r),Kt)}var yt=Xt(),vt=new Set;function jt(){return yt}function Br(e){return vt.add(e),()=>{vt.delete(e)}}function Kr(e){if(e!==yt){yt=e;for(let t of[...vt])t()}}function Vt(e){return e!==null&&typeof e=="object"&&typeof e.getTheme=="function"}function jr(e){if(e===null||typeof e!="object")return;let t=e.fontSizes;if(t===null||typeof t!="object")return;let n=t.text;return typeof n=="number"&&Number.isFinite(n)&&n>0?n:void 0}function Vr(e){try{let t=e.get?.("theme");if(Vt(t))return t}catch{}try{let t=e.theme;if(Vt(t))return t}catch{}}function Yt(e){let t=e.inject;if(typeof t!="function")return()=>{};let n,r;try{let o=t.call(e,["theme"],i=>{let s=Vr(i);if(s===void 0)return;let l=()=>{try{let p=jr(s.getTheme());Kr(p??Xt())}catch{}};l();let f=i.on?.("theme/change",l);if(typeof f!="function")return;let d=f;return n=d,d});if(o!==void 0&&typeof o.dispose=="function"){let i=o.dispose.bind(o);r=()=>{i()}}}catch{}return()=>{n?.(),r?.()}}function Jt(e){let t=(0,qt.useSyncExternalStore)(Br,jt,jt);return Or(e,t)}var wt="conversation.view",ve="git-explorer";var kt="conversation.session.header.actions",Qt="git-branch";var _e="git-explorer",Zt="gitExplorer";var A=require("react");var en=Object.freeze([]);function tn(e,t){let n=t.trim();if(n==="")return e.map(o=>({branch:o,ranges:en}));let r=[];return e.forEach((o,i)=>{let s=qr(o.name,n);s!==void 0&&r.push({match:{branch:o,ranges:Ur(s)},order:i,run:Xr(s)})}),r.sort((o,i)=>i.run-o.run||o.order-i.order),r.map(o=>o.match)}function St(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(n!==void 0&&Rt(n.branch))return t}return-1}function nn(e,t,n){if(e.length===0)return-1;if(n===0)return t;if(t<0)return St(e);for(let r=t+n;r>=0&&r<e.length;r+=n){let o=e[r];if(o!==void 0&&Rt(o.branch))return r}return t}function rn(e,t){if(t<0)return;let n=e[t];if(!(n===void 0||!Rt(n.branch)))return n.branch}function Rt(e){return e.worktreePath===void 0}function qr(e,t){let n=[],r=0;for(let o=0;o<t.length;o+=1){let i=t.charAt(o).toLowerCase(),s=-1;for(let l=r;l<e.length;l+=1)if(e.charAt(l).toLowerCase()===i){s=l;break}if(s===-1)return;n.push(s),r=s+1}return n}function Ur(e){let t=e[0];if(t===void 0)return en;let n=[],r=t,o=t+1;for(let i=1;i<e.length;i+=1){let s=e[i];if(s!==void 0){if(s===o){o=s+1;continue}n.push([r,o]),r=s,o=s+1}}return n.push([r,o]),n}function Xr(e){let t=0,n=0,r=-2;for(let o of e)n=o===r+1?n+1:1,r=o,n>t&&(t=n);return t}function on(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),branches:t("branches"),switchBranch:t("switchBranch"),show:t("show")}}function Te(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function Ee(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var Ze="service-unavailable",Yr=Object.freeze({status:"idle",revision:0,sessionId:null}),Ct;function Jr(e){let t=Yr,n=-1,r=0,o=new Set,i=d=>{t=d;for(let p of[...o])p()},s=d=>t.sessionId===d&&t.status==="ready"&&t.error===void 0&&t.list!==void 0&&n===t.revision;return{subscribe(d){return o.add(d),()=>{o.delete(d)}},getSnapshot:()=>t,load:async d=>{if(s(d))return;let p=e(),a=++r,x=t.revision,$=t.sessionId===d;i({status:"loading",...$&&t.list!==void 0?{list:t.list}:{},revision:x,sessionId:d});let D=()=>a!==r||t.revision!==x;if(typeof p?.branches!="function"){if(D())return;i({status:"error",error:Ze,revision:x,sessionId:d});return}try{let L=await p.branches({sessionId:d});if(D())return;let T=Te(L);if(!T.ok){i({status:"error",error:T.message,revision:x,sessionId:d});return}if(T.result.ok===!1){i({status:"error",error:T.result.error.message,revision:x,sessionId:d});return}n=x,i({status:"ready",list:T.result.list,revision:x,sessionId:d})}catch(L){if(D())return;i({status:"error",error:Ee(L),revision:x,sessionId:d})}},switchTo:async(d,p)=>{let a=()=>t.sessionId!==d,x=e();if(typeof x?.switchBranch!="function")return a()||i({...t,error:Ze}),{switched:!1};try{let $=await x.switchBranch({sessionId:d,name:p}),D=Te($),L=D.ok?D.result.ok===!1?D.result.error.message:void 0:D.message;if(L!==void 0)return a()||i({...t,error:L}),{switched:!1};if(a())return{switched:!0};let T=D.ok&&D.result.ok===!0?D.result:void 0,R=T===void 0?p:T.branch,b=t.list;return i({status:b===void 0?t.status:"ready",...b===void 0?{}:{list:{...b,detached:!1,headHash:null,branches:b.branches.map(J=>({...J,current:J.name===R}))}},revision:t.revision+1,sessionId:d}),T===void 0||T.stash===void 0?{switched:!0}:{switched:!0,stash:T.stash}}catch($){return a()||i({...t,error:Ee($)}),{switched:!1}}},bump(){i({...t,revision:t.revision+1})}}}function Qr(e){return Ct=Jr(e),Ct}var an=Qr;function sn(){return Ct}var Ne=require("react"),Zr=Object.freeze({}),et=null,Tt;function cn(e){et=e}function tt(){if(Tt!=null)return Tt;if(et===null)return Zr;let e=ln(et,"@deepseek-ai/dsh-client-ui-primitives"),t=ln(et,"react-dom"),n=e?.IconBranchOutlineRegular,r=e?.IconChevronDownOutlineRegular,o=e?.useAnchoredPosition,i=e?.useDismissOnOutsidePointer,s=t?.createPortal;return{...typeof n=="function"?{IconBranch:n}:{},...typeof r=="function"?{IconChevron:r}:{},...typeof o=="function"?{useAnchoredPosition:o}:{},...typeof i=="function"?{useDismissOnOutsidePointer:i}:{},...typeof s=="function"?{createPortal:s}:{}}}function ln(e,t){try{let n=e(t);return n===null||typeof n!="object"&&typeof n!="function"?void 0:n}catch{return}}var dn={width:14,height:14,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1},un=e=>(0,Ne.createElement)("svg",{...dn,className:e.className},(0,Ne.createElement)("circle",{key:"root",cx:4.5,cy:3.6,r:1.6}),(0,Ne.createElement)("circle",{key:"tip",cx:11.5,cy:6.2,r:1.6}),(0,Ne.createElement)("circle",{key:"base",cx:4.5,cy:12.4,r:1.6}),(0,Ne.createElement)("path",{key:"trunk",d:"M4.5 5.2v5.6"}),(0,Ne.createElement)("path",{key:"fork",d:"M11.5 7.8c0 2.4-2.6 2.4-5.4 3"})),pn=e=>(0,Ne.createElement)("svg",{...dn,width:12,height:12,viewBox:"0 0 12 12",className:e.className},(0,Ne.createElement)("path",{key:"chevron",d:"M3 4.75 6 7.75l3-3"}));var W=require("react/jsx-runtime"),fn=320,eo="min(420px, 100vw - 32px)",hn=5,nt=8;function to(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,side:"bottom",align:"end",gap:hn,margin:nt})??void 0:no(t,n)}function no(e,t){let[n,r]=(0,A.useState)(void 0);return(0,A.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=()=>{let i=t.current;if(i===null)return;let s=i.getBoundingClientRect(),l=Math.min(fn,Math.max(160,window.innerWidth-nt*2)),f=Math.min(Math.max(s.right-l,nt),window.innerWidth-l-nt);r({left:f,top:s.bottom+hn,width:l})};return o(),window.addEventListener("scroll",o,!0),window.addEventListener("resize",o),()=>{window.removeEventListener("scroll",o,!0),window.removeEventListener("resize",o)}},[e,t]),n}function ro(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}oo(t,n,o,i)}function oo(e,t,n,r){(0,A.useEffect)(()=>{if(!n)return;let o=i=>{let s=i.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[n,r,e,t])}function io(e,t){let n=[],r=0;return t.forEach((o,i)=>{let[s,l]=o;s>r&&n.push((0,W.jsx)("span",{children:e.slice(r,s)},`plain-${i}`)),n.push((0,W.jsx)("span",{className:"gx-branch-match",children:e.slice(s,l)},`hit-${i}`)),r=l}),r<e.length&&n.push((0,W.jsx)("span",{children:e.slice(r)},"tail")),n}function ao(e){let t=Math.max(e.lastIndexOf("/"),e.lastIndexOf("\\"));return t<0?{parent:"",name:e}:{parent:e.slice(0,t+1),name:e.slice(t+1)}}function so(e,t){if(!e.dirty)return{additions:0,deletions:0,dot:!1,description:t("branch.worktreeClean")};let n=[];e.additions>0&&n.push(`+${e.additions}`),e.deletions>0&&n.push(`\u2212${e.deletions}`);let r=[];if(e.trackedFiles>0){let i=e.trackedFiles===1?t("branch.worktreeFile"):t("branch.worktreeFiles");r.push(`${e.trackedFiles} ${i}`)}if(e.untrackedFiles>0){let i=e.untrackedFiles===1?t("branch.worktreeUntracked"):t("branch.worktreeUntrackedFiles");r.push(`${e.untrackedFiles} ${i}`)}let o=n.length===0?t("branch.worktreeDirty"):`${t("branch.worktreePrefix")} ${n.join(" ")}`;return{additions:e.additions,deletions:e.deletions,dot:n.length===0,description:[o,...r].join(t("branch.worktreeSep"))}}function gn({store:e,t}){function n({sessionId:r}){let o=(0,A.useSyncExternalStore)(e.subscribe,e.getSnapshot),[i,s]=(0,A.useState)(!1),[l,f]=(0,A.useState)(""),[d,p]=(0,A.useState)(-1),[a,x]=(0,A.useState)(null),[$,D]=(0,A.useState)(null),L=(0,A.useRef)(r);L.current=r;let T=(0,A.useRef)(null),R=(0,A.useRef)(null),b=(0,A.useRef)(null),J=(0,A.useRef)(null),G=(0,A.useRef)(null),_=(0,A.useRef)(!1),z=(0,A.useId)(),m=(0,A.useId)(),E=tt(),ue=E.createPortal!==void 0,Z=E.IconBranch??un,te=E.IconChevron??pn,C=o.list,P=C===void 0?void 0:ao(C.root),Q=(0,A.useMemo)(()=>tn(C?.branches??[],l),[C,l]),w=(0,A.useCallback)(()=>{s(!1),f(""),D(null)},[]),N=(0,A.useCallback)(()=>{_.current=!0,w(),R.current?.focus({preventScroll:!0})},[w]),j=(0,A.useCallback)(()=>{_.current=!0,w()},[w]);(0,A.useEffect)(()=>{w(),x(null),r!==void 0&&e.load(r)},[e,r,w]),(0,A.useLayoutEffect)(()=>{i&&J.current?.focus({preventScroll:!0})},[i]),(0,A.useLayoutEffect)(()=>{if(i||!_.current)return;_.current=!1;let H=document.activeElement;(H===null||H===document.body||H===R.current||T.current?.contains(H)===!0)&&R.current?.focus({preventScroll:!0})},[i]),(0,A.useEffect)(()=>{p(St(Q))},[Q]),(0,A.useEffect)(()=>{G.current?.scrollIntoView?.({block:"nearest"})},[d,Q]),(0,A.useEffect)(()=>{if(!i)return;let H=h=>{h.key!=="Escape"||h.isComposing||(h.preventDefault(),N())};return document.addEventListener("keydown",H),()=>document.removeEventListener("keydown",H)},[i,N]);let U=to(E,i,R,b);ro(E,T,b,ue,i,j);let O=()=>{if(i){w();return}s(!0),r!==void 0&&e.load(r)},se=()=>{r!==void 0&&e.load(r)},S=async H=>{if(a!==null||H.worktreePath!==void 0)return;if(H.current){N();return}if(r===void 0)return;x(H.name);let h=await e.switchTo(r,H.name);if(L.current===r&&(x(null),!!h.switched)){if(e.load(r),h.stash?.conflict===!0){D(h.stash);return}N()}},ee=()=>{let H=rn(Q,d);H!==void 0&&S(H)},pe=H=>{if(!(H.metaKey||H.ctrlKey||H.altKey)&&!H.nativeEvent.isComposing){if(H.key==="ArrowDown"||H.key==="ArrowUp"){H.preventDefault();let h=H.key==="ArrowDown"?1:-1;p(g=>nn(Q,g,h));return}H.key==="Enter"&&(H.preventDefault(),ee())}};if(r===void 0)return null;let be=C?.branches.find(H=>H.current)?.name,ie=C===void 0?t("branch.loading"):C.detached?C.headHash??t("head.detached"):be??t("branch.unborn");if(!i&&C?.isRepository!==!0)return null;let fe=`${t("head.detached")} ${C?.headHash??""}`.trim(),ge=C?.detached===!0?fe:ie,ke=C?.isRepository===!0?C.worktree:void 0,ae=ke===void 0?void 0:so(ke,t),he=t("branch.worktreeSep"),Se=ae===void 0?ge:ae.description,Pe=ae===void 0||ke?.dirty!==!0?`${t("branch.title")}: ${ge}`:`${t("branch.title")}: ${ge}${he}${ae.description}`,me=o.error===Ze?t("state.noService.title"):o.error,Le=(0,W.jsxs)("div",{ref:b,id:m,className:"gx-branch-panel","data-testid":"gx-branch-panel",role:"dialog","aria-label":t("branch.title"),style:{width:fn,maxWidth:eo,...U},children:[$?.conflict===!0?(0,W.jsxs)("div",{className:"gx-branch-warning","data-testid":"gx-branch-stash-warning",role:"alert",children:[(0,W.jsx)("span",{className:"gx-branch-warning-text",children:t("branch.stashConflict")}),$.message===void 0||$.message===""?null:(0,W.jsx)("span",{className:"gx-branch-warning-detail",children:$.message})]}):null,C===void 0||P===void 0?null:(0,W.jsxs)("div",{className:"gx-branch-scope","data-testid":"gx-branch-scope",title:C.root,children:[(0,W.jsx)("span",{className:"gx-branch-scope-label",children:t("branch.scope")}),(0,W.jsxs)("span",{className:"gx-branch-scope-path",children:[(0,W.jsx)("span",{className:"gx-branch-scope-parent",children:P.parent}),(0,W.jsx)("span",{className:"gx-branch-scope-name",children:P.name})]})]}),(0,W.jsx)("input",{ref:J,type:"text",className:"gx-branch-search","data-testid":"gx-branch-search",value:l,placeholder:t("branch.search"),"aria-label":t("branch.search"),role:"combobox","aria-haspopup":"listbox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":C===void 0?void 0:z,"aria-activedescendant":d>=0&&C!==void 0?`${z}-option-${d}`:void 0,autoComplete:"off",autoFocus:!0,spellCheck:!1,onChange:H=>f(H.target.value),onKeyDown:pe}),me!==void 0?(0,W.jsxs)("div",{className:"gx-branch-error","data-testid":"gx-branch-error",role:"alert",children:[(0,W.jsx)("span",{className:"gx-branch-error-text",children:me}),(0,W.jsx)("button",{type:"button",className:"gx-branch-retry",onClick:se,children:t("action.retry")})]}):null,o.status==="loading"&&C===void 0?(0,W.jsx)("div",{className:"gx-branch-hint",children:t("branch.loading")}):null,C!==void 0?(0,W.jsxs)("div",{className:"gx-branch-list",id:z,role:"listbox","aria-label":t("branch.title"),children:[C.branches.length===0?(0,W.jsx)("div",{className:"gx-branch-hint",children:t("branch.empty")}):null,C.branches.length>0&&Q.length===0?(0,W.jsx)("div",{className:"gx-branch-nomatch","data-testid":"gx-branch-no-match",children:t("branch.noMatch")}):null,Q.map((H,h)=>{let g=H.branch,V=h===d;return(0,W.jsxs)("button",{ref:V?G:void 0,type:"button",role:"option",id:`${z}-option-${h}`,"aria-selected":V,"data-active":V?"true":void 0,className:"gx-branch-row","data-testid":`gx-branch-row-${g.name}`,"data-current":g.current?"true":void 0,"aria-current":g.current?"true":void 0,title:g.worktreePath===void 0?g.name:`${g.name} ${t("branch.worktree")}: ${g.worktreePath}`,disabled:a!==null||g.worktreePath!==void 0,onClick:()=>{S(g)},children:[(0,W.jsx)("span",{className:"gx-branch-row-name",children:io(g.name,H.ranges)}),g.worktreePath===void 0?null:(0,W.jsx)("span",{className:"gx-branch-taken","data-testid":"gx-branch-row-taken",children:t("branch.taken")}),g.current?(0,W.jsx)("span",{className:"gx-branch-tag",children:t("branch.current")}):null]},g.name)})]}):null]});return(0,W.jsxs)("div",{className:"gx-branch-action",ref:T,children:[(0,W.jsxs)("button",{ref:R,type:"button",className:"gx-branch-trigger","data-testid":"gx-branch-trigger","aria-label":Pe,"aria-haspopup":"dialog","aria-expanded":i,"aria-controls":i?m:void 0,title:Se,onClick:O,children:[(0,W.jsx)(Z,{className:"gx-branch-icon"}),(0,W.jsx)("span",{className:"gx-branch-name",title:ge,children:ie}),ae===void 0||ke?.dirty!==!0?null:(0,W.jsxs)("span",{className:"gx-branch-dirty","data-testid":"gx-branch-dirty","aria-hidden":"true",title:ae.dot?t("branch.worktreeDirty"):void 0,children:[ae.additions>0?(0,W.jsxs)("span",{className:"gx-branch-add",children:["+",ae.additions]}):null,ae.deletions>0?(0,W.jsxs)("span",{className:"gx-branch-del",children:["\u2212",ae.deletions]}):null,ae.dot?(0,W.jsx)("span",{className:"gx-branch-dot",children:"\u2022"}):null]}),(0,W.jsx)(te,{className:"gx-branch-chevron"})]}),i?E.createPortal===void 0?Le:E.createPortal(Le,document.body):null]})}return n}function mn(e){let t=Math.max(0,e.scrollTop),n=Math.max(0,e.viewport),r=Math.max(0,e.height),o=Math.max(0,e.top);return o<t?o:o+r>t+n?Math.max(0,o+r-n):t}function rt(e){if(e.composing||e.alt||e.ctrl||e.meta||e.shift)return null;switch(e.key){case"ArrowDown":return"down";case"ArrowUp":return"up";case"Home":return"first";case"End":return"last";case"Enter":return"activate";default:return null}}function ot(e,t,n){if(n<=0)return;let r=n-1;switch(t){case"down":return e===void 0?0:Math.min(e+1,r);case"up":return e===void 0?r:Math.max(e-1,0);case"first":return 0;case"last":return r;default:return e===void 0?0:Math.min(Math.max(e,0),r)}}function xn(e,t,n){return e===void 0||t<=0?!1:e>=t-Math.max(1,Math.trunc(n))}var lo={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function We(e){return lo[e]}var bn={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function co(e,t){return(bn[e]??0)>=(bn[t]??0)?e:t}function yn(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function Et(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function uo(e){let t=e.split("\0"),n=new Map,r=o=>{let i=n.get(o.path);if(i===void 0){n.set(o.path,o);return}n.set(o.path,{...i,status:co(i.status,o.status),staged:i.staged||o.staged,isDirectory:i.isDirectory||o.isDirectory,...i.origPath===void 0&&o.origPath===void 0?{}:{origPath:i.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let i=t[o];if(i===void 0||i===""||i.startsWith("#"))continue;let s=i[0];if(s==="1"){let l=i.slice(2),f=l.slice(0,2),d=Et(l,7);d!==""&&r({path:d,status:yn(f),staged:f[0]!==".",isDirectory:!1})}else if(s==="2"){let l=i.slice(2),f=l.slice(0,2),d=Et(l,8),p=t[o+1]??"";d!==""&&p!==""&&(o+=1,r({path:d,status:yn(f),staged:f[0]!==".",isDirectory:!1,origPath:p}))}else if(s==="u"){let l=i.slice(2),f=Et(l,9);f!==""&&r({path:f,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let l=i.slice(2);if(l==="")continue;let f=l.endsWith("/");r({path:f?l.slice(0,-1):l,status:"untracked",staged:!1,isDirectory:f})}}return[...n.values()]}function po(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function Mt(e){let t=new Map;for(let n of e){let r=po(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,i)=>o.path.localeCompare(i.path))}))}function Oe(e){return Mt(uo(e))}function It(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let i=Math.floor(o/24);if(i<7)return`${i}d`;let s=Math.floor(i/7);if(s<5)return`${s}w`;let l=Math.floor(i/30);return l<12?`${l}mo`:`${Math.floor(i/365)}y`}function it(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:It(e.time,t)}}function at({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),i=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${i}`)}}function vn({seam:e,sessionId:t}){return(n,r,o=1)=>{let i=typeof n=="string"?n.trim().toLowerCase():"";if(i===""||typeof r!="string")return;let s=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(s==="")return;let l=Number.isFinite(o)&&o>0?Math.floor(o):1,f=`git:${i}:${String(l)}:${s}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",f);let d=e.openViewOrSwitch("fs-explorer",f);if(d.focused){e.viewFocus?.take?.("fs-explorer");return}if(d.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",f)!==!0&&e.openView?.("fs-explorer",f)!==!0&&e.viewFocus?.request?.("fs-explorer",f)}}var fo=/^commit:([0-9a-f]{4,64})$/iu;function wn(e){if(e===void 0)return;let t=fo.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}var kn=24;function st(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),i=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-i-o*2),l=Math.floor(Math.max(0,t.scrollTop)/n)-o,f=Math.min(Math.max(l,0),s),d=Math.min(e.length,f+i+o*2);return{rows:e.slice(f,d),startIndex:f,endIndex:d}}function Sn(e){let t=Math.max(1,e.rowHeight||1),n=Math.max(0,Math.trunc(e.rowCount)-1),r=Math.min(Math.max(0,Math.trunc(e.index)),n);return mn({scrollTop:e.scrollTop,viewport:e.viewport,top:r*t,height:t})}function Rn(e){let t=[],n=[],r=[],o=0,i=[],s=()=>r.length===0?o++:(r.sort((p,a)=>p-a),r.shift()??o++),l=d=>{d!==null&&!r.includes(d)&&r.push(d)},f=()=>{let d=t.indexOf(null);return d>=0?d:(t.push(null),n.push(null),t.length-1)};for(let d of e){let p=[...t],a=[...n],x=p.indexOf(d.hash),$=x>=0;$||(x=f());let D=$?n[x]??null:null;D===null&&(D=s(),n[x]=D);for(let b=0;b<p.length;b+=1)b!==x&&p[b]===d.hash&&(l(n[b]??null),t[b]=null,n[b]=null);let L=d.parents[0];L===void 0?(l(n[x]??null),t[x]=null,n[x]=null):(t[x]=L,n[x]=D);let T=[];for(let b=1;b<d.parents.length;b+=1){let J=d.parents[b];if(J===void 0)continue;let G=t.indexOf(J);G<0&&(G=f(),t[G]=J),n[G]===null&&(n[G]=s()),T.push(G)}let R=[];for(let b=0;b<p.length;b+=1){let J=p[b];if(J===null)continue;let G=a[b]??D;J===d.hash?R.push({kind:"into",from:b,to:x,color:G}):R.push({kind:"pass",from:b,to:b,color:G})}L!==void 0&&R.push({kind:"out",from:x,to:x,color:n[x]??D});for(let b of T)R.push({kind:"out",from:x,to:b,color:n[b]??D});for(i.push({lane:x,color:D,merge:d.parents.length>=2,segments:R});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return i}function Cn(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function Me(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function Tn(e,t){return`${e.trim().toLowerCase()}\0${t}`}function En(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let i=n.keys().next();i.done||n.delete(i.value)}},get size(){return n.size}}}function Mn(e,t,n,r=10,o=8){let i=Math.max(o,n.width-t.width-o),s=e.right+r;s>i&&(s=e.left-t.width-r,s<o&&(s=Math.min(i,Math.max(o,e.left))));let l=Math.max(o,n.height-t.height-o),f=e.bottom+r,d=e.top-t.height-r,p;return f<=l?p=Math.max(o,f):d>=o?p=d:p=Math.min(l,Math.max(o,e.top)),{left:s,top:p}}var In="dsh-git-explorer-styles",ho=`
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
`;function Ln(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${In}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=In,n.textContent=ho,e.head.appendChild(n),()=>{n.remove()}}var Nn="lionad.git",go="@",Lt=60;function mo(e){let t=e.replace(/\s+/gu," ").trim();if(t.length<=Lt)return t;let n=t.slice(0,Lt),r=n.lastIndexOf(" ");return`${(r>Lt*.75?n.slice(0,r):n).trimEnd()}\u2026`}function xo(e){if(!Number.isFinite(e))return"";let t=new Date(e*1e3);if(Number.isNaN(t.getTime()))return"";let n=r=>String(r).padStart(2,"0");return`${String(t.getFullYear())}-${n(t.getMonth()+1)}-${n(t.getDate())}`}function Pn(e){let n=[e.subject===""?`[git commit ${e.hash}]`:`[git commit ${e.hash}] ${e.subject}`],r=e.refs.filter(o=>o.trim()!=="").join(", ");return r!==""&&n.push(r),e.author!==""&&n.push(e.author),e.date!==""&&n.push(e.date),n.join(" \xB7 ")}function bo(e,t,n){return{hash:e.hash,subject:mo(e.subject),refs:n.filter(r=>r.trim()!==""),author:e.author,date:xo(e.time),short:t}}function Hn(e,t,n=[]){let r=bo(e,t,n);return{kind:"git.commit",id:e.hash,label:r.subject===""?t:`${t} ${r.subject}`,clipboardText:`[git commit ${t}]`,modelText:Pn(r),ref:JSON.stringify(r)}}function yo(e){let t;try{t=JSON.parse(e)}catch{return`[git commit ${e}]`}if(t===null||typeof t!="object")return`[git commit ${e}]`;let n=t;return typeof n.hash!="string"||n.hash===""?`[git commit ${e}]`:Pn({hash:n.hash,subject:typeof n.subject=="string"?n.subject:"",refs:Array.isArray(n.refs)?n.refs.filter(r=>typeof r=="string"):[],author:typeof n.author=="string"?n.author:"",date:typeof n.date=="string"?n.date:"",short:typeof n.short=="string"?n.short:""})}function vo(e){try{let t=JSON.parse(e);if(typeof t.short=="string"&&t.short!=="")return`[git commit ${t.short}]`}catch{}return`[git commit ${e}]`}function Dn(e,t){let n={source:Nn,ref:t.ref,label:t.label,clipboardText:t.clipboardText,appearance:"session"};if(e.canInsertReference){let o=e.captureSpan();if(o!==void 0){if(e.insertReference(n,o))return"reference";let i=e.captureSpan();if(i!==void 0&&e.insertReference(n,i))return"reference"}}let r=e.captureSpan();return r===void 0?"failed":e.insertText(t.clipboardText,r)?"text":"failed"}function An(e){return e.sessionId===void 0?{enabled:!1,reasonKey:"reference.disabled.noSession"}:e.hasComposer?e.sourceAvailable?e.phase!==void 0&&e.phase!=="plain"?{enabled:!1,reasonKey:"reference.disabled.busy"}:{enabled:!0}:{enabled:!1,reasonKey:"reference.disabled.noSource"}:{enabled:!1,reasonKey:"reference.disabled.noComposer"}}function Wn(e){if(e===null||typeof e!="object")return{};let t=e,n=t.views,r=n?.open,o=t.openView,i=t.viewFocus,s=i?.request,l=i?.take,f=t.openViewOrSwitch,d=t.currentSessionId;return{openView:typeof r=="function"?(p,a,x)=>r.call(n,p,a,x)===!0:typeof o=="function"?(p,a,x)=>o.call(t,a,x):void 0,requestFocus:typeof s=="function"?(p,a)=>{s.call(i,p,a)}:void 0,takeFocus:typeof l=="function"?p=>{l.call(i,p)}:void 0,openViewOrSwitch:typeof f=="function"?(p,a)=>f.call(t,p,a):void 0,currentSessionId:typeof d=="function"?()=>d.call(t):void 0}}function wo(e){if(e===null||typeof e!="object")return;let t=e;if(typeof t.id=="string"&&t.id!=="")return t.id;if(typeof t.sessionId=="string"&&t.sessionId!=="")return t.sessionId}function ko(e){let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t.hash;if(typeof n!="string")return;let r=n.trim().toLowerCase();return/^[0-9a-f]{4,64}$/u.test(r)?r:void 0}function So(e,t,n){let r=ko(n);if(r===void 0||t===void 0||t==="")return!1;let o=e.currentSessionId?.();if(o!==void 0&&o!==t)return!1;let i=`commit:${r}`;return e.openView?.(t,ve,i)===!0?!0:e.requestFocus!==void 0?(e.requestFocus(ve,i),e.openViewOrSwitch?.(ve)?.opened===!0?!0:(e.takeFocus?.(ve),!1)):e.openViewOrSwitch?.(ve,i)?.focused===!0}function Ro(e=()=>({})){return{trigger:go,name:Nn,showGroupTitle:!1,async candidates(){return[]},onPick(){},codec:{clipboardText:vo,async serialize(t){return yo(t)}},openReference(t,n){let r=n!==null&&typeof n=="object"?n.ref:void 0;if(typeof r!="string")return!1;try{let o=e(),i=wo(t)??o.currentSessionId?.();return So(o,i,r)}catch{return!1}}}}function Co(e){return e===null||typeof e!="object"?!1:typeof e.registerSource=="function"}function Fn(e,t){let n=Ro(t),r,o=()=>{r?.(),r=void 0},i={get available(){return r!==void 0},dispose:o};if(typeof e.inject=="function")try{return e.inject(["inputTriggers"],s=>{s.effect(()=>(r=s.inputTriggers.registerSource(n),o),"dsh-git-explorer: commit reference source")}),i}catch{}try{let s=e.get?.("inputTriggers");if(Co(s))return r=s.registerSource(n),i}catch{}return i}var v=require("react");var oe=require("react");function Gn(e,t){let n=t.trim().toLowerCase();if(n==="")return[...e];let r=[];for(let o of e){let i=o.files.filter(s=>s.path.toLowerCase().includes(n));i.length>0&&r.push({dir:o.dir,files:i})}return r}var q=require("react/jsx-runtime");function Ae(e){return e.kind==="group"?`group:${e.dir}`:`file:${e.file.path}`}function To(e){let t=[];for(let n of e){t.push({kind:"group",dir:n.dir,count:n.files.length});for(let r of n.files)t.push({kind:"file",file:r})}return t}function Eo(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Mo({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,q.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,q.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function zn({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:i}){let s=(0,oe.useRef)(null),l=(0,oe.useRef)(null),[f,d]=(0,oe.useState)(""),p=(0,oe.useMemo)(()=>Gn(e,f),[e,f]),a=(0,oe.useMemo)(()=>To(p),[p]),x=(0,oe.useMemo)(()=>a.map(Ae),[a]),$=e.reduce((m,E)=>m+E.files.length,0),D=(0,oe.useMemo)(()=>p.reduce((m,E)=>m+E.files.length,0),[p]),L=f.trim()!=="",[T,R]=(0,oe.useState)(void 0),b=(0,oe.useMemo)(()=>T===void 0?-1:x.indexOf(T),[T,x]),J=(0,oe.useRef)(0);(0,oe.useEffect)(()=>{b>=0&&(J.current=b)},[b]);let G=(0,oe.useRef)(a);G.current=a,(0,oe.useEffect)(()=>{if(!o)return;i(),Eo(s.current);let m=G.current.find(E=>E.kind==="file");m!==void 0&&R(Ae(m))},[o,i]),(0,oe.useEffect)(()=>{if(T===void 0||b>=0||a.length===0)return;let m=a[Math.min(J.current,a.length-1)];m!==void 0&&R(Ae(m))},[b,T,a]);let _=(0,oe.useCallback)(m=>{let E=x[m];E!==void 0&&(R(E),l.current?.focus({preventScroll:!0}))},[x]);(0,oe.useEffect)(()=>{if(b<0)return;l.current?.querySelector('[data-cursor="true"]')?.scrollIntoView?.({block:"nearest"})},[b,T]);let z=(0,oe.useCallback)(m=>{let E=rt({key:m.key,composing:m.nativeEvent.isComposing,alt:m.altKey,ctrl:m.ctrlKey,meta:m.metaKey,shift:m.shiftKey});if(E===null)return;if(m.preventDefault(),E==="activate"){let Z=b<0?void 0:a[b];Z?.kind==="file"&&!Z.file.isDirectory&&r(Z.file.path,1);return}let ue=ot(b<0?void 0:b,E,a.length);ue!==void 0&&_(ue)},[b,_,r,a]);return(0,q.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,q.jsxs)("header",{className:"gx-pane-head",children:[(0,q.jsx)("span",{children:n("changes.title")}),(0,q.jsx)("span",{className:"gx-count",children:L?`${String(D)} / ${String($)}`:$}),(0,q.jsx)("span",{className:"gx-spacer"}),(0,q.jsx)("input",{className:"gx-filter",type:"search",value:f,spellCheck:!1,placeholder:n("changes.filter"),"aria-label":n("changes.filter"),"data-testid":"gx-changes-filter",onChange:m=>d(m.currentTarget.value)})]}),(0,q.jsx)("div",{className:"gx-scroll",ref:l,tabIndex:0,"data-testid":"git-changes-scroll",onKeyDown:z,children:$===0?(0,q.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,q.jsx)("strong",{children:n("changes.empty")})}):a.length===0?(0,q.jsx)("div",{className:"gx-empty gx-empty-inline","data-testid":"git-changes-no-match",children:(0,q.jsx)("strong",{children:n("changes.noMatch")})}):a.map(m=>m.kind==="group"?(0,q.jsxs)("div",{className:"gx-group-head","data-cursor":Ae(m)===T?"true":"false",children:[(0,q.jsx)("span",{className:"gx-group-dir",children:m.dir===""?n("changes.root"):m.dir}),(0,q.jsx)("span",{className:"gx-count",children:m.count})]},Ae(m)):(0,q.jsxs)("button",{type:"button",className:"gx-file","data-status":m.file.status,"data-directory":m.file.isDirectory?"true":"false","data-renamed":m.file.origPath===void 0?"false":"true","data-cursor":Ae(m)===T?"true":"false","data-testid":"git-change-file",title:m.file.isDirectory?`${n(`status.${m.file.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${m.file.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{R(Ae(m)),l.current?.focus({preventScroll:!0}),m.file.isDirectory||r(m.file.path,1)},children:[(0,q.jsx)("span",{className:"gx-badge","data-status":m.file.status,children:We(m.file.status)}),(0,q.jsxs)("span",{className:"gx-file-name",children:[Me(m.file.path),m.file.origPath===void 0?null:(0,q.jsx)("span",{className:"gx-file-orig",children:Me(m.file.origPath)})]}),(0,q.jsx)("span",{className:"gx-file-stats",children:(0,q.jsx)(Mo,{stat:t.get(m.file.path)})})]},Ae(m)))})]})}var X=require("react"),_n=require("react-dom");var y=require("react/jsx-runtime"),Io=200,Lo=40,No=24,Po=7;function Ho({additions:e,deletions:t}){return e===null&&t===null?(0,y.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,y.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Do(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Ao({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,y.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,y.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,y.jsx)("strong",{children:t("preview.unavailable")}),(0,y.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,y.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,y.jsx)("strong",{children:t("preview.unavailable")}),(0,y.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,y.jsxs)(y.Fragment,{children:[r.text===""?(0,y.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,y.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,y.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,y.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function Wo({preview:e,hash:t,t:n}){let r=(0,X.useRef)(null),o=(0,X.useRef)(null),[i,s]=(0,X.useState)(null),[l,f]=(0,X.useState)(!1);return(0,X.useLayoutEffect)(()=>{let d=r.current;if(d===null)return;let p=d.getBoundingClientRect();s(Mn(e.anchor,{width:p.width,height:p.height},{width:window.innerWidth,height:window.innerHeight}));let a=o.current;f(a!==null&&a.scrollHeight>a.clientHeight+1)},[e]),typeof document>"u"?null:(0,_n.createPortal)((0,y.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":l?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:i?.left??0,top:i?.top??0,visibility:i===null?"hidden":"visible"},children:[(0,y.jsxs)("div",{className:"gx-preview-head",children:[(0,y.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:We(e.file.status)}),(0,y.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:Me(e.file.path)}),(0,y.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,Po)} \xB7 ${n("preview.revision")}`})]}),(0,y.jsx)("div",{className:"gx-preview-body",children:(0,y.jsx)(Ao,{preview:e,t:n,textRef:o})})]}),document.body)}function On({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:i,refs:s,inputActions:l,phase:f,sourceAvailable:d,onReference:p}){let[a,x]=(0,X.useState)({kind:"idle"}),[$,D]=(0,X.useState)(0),L=(0,X.useRef)(new Map),T=(0,X.useRef)(!1),[R,b]=(0,X.useState)({kind:"idle"}),J=(0,X.useRef)(En(No)),G=(0,X.useRef)(void 0),_=(0,X.useRef)(void 0),z=(0,X.useRef)(void 0),m=(0,X.useRef)(null),E=(0,X.useCallback)(()=>{G.current=void 0,_.current!==void 0&&(window.clearTimeout(_.current),_.current=void 0),z.current?.abort(),z.current=void 0,b(w=>w.kind==="idle"?w:{kind:"idle"})},[]),ue=(0,X.useCallback)((w,N)=>{if(E(),t===void 0)return;let j=N.getBoundingClientRect(),U={left:j.left,top:j.top,right:j.right,bottom:j.bottom},O=Tn(t,w.path);G.current=O,_.current=window.setTimeout(()=>{if(_.current=void 0,G.current!==O)return;let se=J.current.get(O);if(se!==void 0){b({kind:"ready",file:w,anchor:U,page:se});return}if(e===void 0||n===void 0||typeof n.show!="function"){b({kind:"unavailable",file:w,anchor:U,message:r("preview.noService")});return}let S=new AbortController;z.current=S,b({kind:"loading",file:w,anchor:U}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:w.path,offset:1,limit:Lo},S.signal)).then(ee=>{if(S.signal.aborted||G.current!==O)return;let pe=Te(ee);if(!pe.ok){b({kind:"unavailable",file:w,anchor:U,message:pe.message});return}let be=pe.result;if(!be.ok){b({kind:"unavailable",file:w,anchor:U,message:Do(be.error.code,be.error.message,r)});return}J.current.set(O,be.page),b({kind:"ready",file:w,anchor:U,page:be.page})}).catch(ee=>{S.signal.aborted||G.current!==O||b({kind:"unavailable",file:w,anchor:U,message:Ee(ee)})}).finally(()=>{z.current===S&&(z.current=void 0)})},Io)},[E,t,n,e,r]);(0,X.useEffect)(()=>{if(t===void 0){x({kind:"idle"});return}let w=L.current.get(t);if(w!==void 0){x({kind:"ready",detail:w});return}if(n===void 0||e===void 0){x({kind:"failed",message:r("state.noService.description")});return}let N=!0;return x({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(j=>{if(!N)return;let U=Te(j);if(!U.ok){x({kind:"failed",message:U.message});return}let O=U.result;O.ok?(L.current.set(t,O.detail),x({kind:"ready",detail:O.detail})):x({kind:"failed",message:O.error.message===""?O.error.code:O.error.message})}).catch(j=>{N&&x({kind:"failed",message:Ee(j)})}),()=>{N=!1}},[t,n,e,$,r]),(0,X.useEffect)(()=>{if(R.kind==="idle")return;let w=N=>{N.key==="Escape"&&E()};return document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[R.kind,E]),(0,X.useEffect)(()=>{let w=m.current;if(w===null)return;let N=()=>E();return w.addEventListener("scroll",N,{passive:!0}),()=>w.removeEventListener("scroll",N)},[E]),(0,X.useEffect)(()=>{E()},[t,$,e,n,E]),(0,X.useEffect)(()=>()=>{G.current=void 0,_.current!==void 0&&window.clearTimeout(_.current),z.current?.abort()},[]);let Z=it(a.kind==="ready"?a.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""}),te=An({sessionId:e,hasComposer:l!==void 0&&typeof l.captureInsertion=="function",phase:f,sourceAvailable:d===!0}),C=te.enabled&&a.kind==="ready"&&p!==void 0,P=te.enabled?a.kind==="ready"?void 0:r("detail.empty"):r(te.reasonKey),Q=()=>{if(!(!C||T.current||a.kind!=="ready"||p===void 0)){T.current=!0;try{p(Hn(a.detail,Z.shortHash,s??[]))==="failed"&&window.console?.warn?.(`[dsh-git-explorer] ${r("reference.failed")}`)}finally{T.current=!1}}};return(0,y.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,y.jsxs)("header",{className:"gx-detail-head",children:[(0,y.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,y.jsx)("span",{className:"gx-hash",children:Z.shortHash}),(0,y.jsx)("span",{className:"gx-spacer",style:{flex:1}}),(0,y.jsx)("button",{type:"button",className:"gx-refbtn",disabled:!C,"aria-disabled":!C,title:P??r("reference.hint"),"data-testid":"gx-reference-commit",onClick:Q,children:r("reference.action")})]}),(0,y.jsx)("div",{className:"gx-detail-body",ref:m,children:a.kind==="idle"?(0,y.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,y.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,y.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,y.jsx)("strong",{children:r("detail.failed")}),(0,y.jsx)("span",{children:a.message}),(0,y.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>D(w=>w+1),children:r("action.retry")})]}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,y.jsxs)("div",{className:"gx-detail-meta",children:[(0,y.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,y.jsx)("span",{children:Z.relative}),(0,y.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,y.jsxs)("div",{className:"gx-parents",children:[(0,y.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,y.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(w=>(0,y.jsx)("button",{type:"button",className:"gx-parent",title:w,onClick:()=>o(w),children:w.slice(0,7)},w))]}),a.detail.body===""?null:(0,y.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,y.jsxs)("div",{className:"gx-detail-files",children:[(0,y.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,y.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):Mt(a.detail.files).map(w=>(0,y.jsxs)("div",{className:"gx-detail-group",children:[(0,y.jsx)("div",{className:"gx-detail-dir",children:w.dir===""?r("changes.root"):w.dir}),w.files.map(N=>(0,y.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:N.path,onClick:()=>i?.(N.path),onMouseEnter:j=>ue(N,j.currentTarget),onMouseLeave:E,children:[(0,y.jsx)("span",{className:"gx-badge","data-status":N.status,children:We(N.status)}),(0,y.jsxs)("span",{className:"gx-file-name",children:[Me(N.path),N.origPath===void 0?null:(0,y.jsx)("span",{className:"gx-file-orig",children:Me(N.origPath)})]}),(0,y.jsx)("span",{className:"gx-file-stats",children:(0,y.jsx)(Ho,{additions:N.additions,deletions:N.deletions})})]},N.path))]},w.dir===""?".":w.dir))]})]})}),R.kind==="idle"?null:(0,y.jsx)(Wo,{preview:R,hash:t??"",t:r})]})}var Y=require("react/jsx-runtime");function Fo(e,t){let n=0,r=0,o=0;for(let i of e)for(let s of i.files){let l=t.get(s.path);l!==void 0&&(n+=l.additions??0,r+=l.deletions??0,o+=1)}return{additions:n,deletions:r,counted:o}}function $n({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((s,l)=>s+l.files.length,0),i=Fo(e,t);return(0,Y.jsxs)("section",{className:"gx-detail","data-testid":"git-working-tree",children:[(0,Y.jsxs)("header",{className:"gx-detail-head",children:[(0,Y.jsx)("strong",{className:"gx-detail-subject",children:n("uncommitted.title")}),(0,Y.jsx)("span",{className:"gx-count",children:`${String(o)} ${n("uncommitted.files")}`}),(0,Y.jsx)("span",{className:"gx-spacer"}),i.counted===0?null:(0,Y.jsxs)("span",{className:"gx-detail-stats",children:[(0,Y.jsx)("span",{className:"gx-add",children:`+${String(i.additions)}`}),(0,Y.jsx)("span",{className:"gx-del",children:`-${String(i.deletions)}`})]})]}),(0,Y.jsx)("div",{className:"gx-detail-body","data-testid":"git-working-tree-body",children:e.map(s=>(0,Y.jsxs)("div",{className:"gx-detail-group",children:[(0,Y.jsxs)("div",{className:"gx-group-head",children:[(0,Y.jsx)("span",{className:"gx-group-dir",children:s.dir===""?n("changes.root"):s.dir}),(0,Y.jsx)("span",{className:"gx-count",children:s.files.length})]}),s.files.map(l=>(0,Y.jsxs)("button",{type:"button",className:"gx-file","data-status":l.status,"data-directory":l.isDirectory?"true":"false","data-testid":"git-change-file",title:l.isDirectory?`${n(`status.${l.status}`)} \xB7 ${n("changes.directory")}`:`${n(`status.${l.status}`)} \xB7 ${n("changes.jump")}`,onClick:()=>{l.isDirectory||r(l.path,1)},children:[(0,Y.jsx)("span",{className:"gx-badge","data-status":l.status,children:We(l.status)}),(0,Y.jsxs)("span",{className:"gx-file-name",children:[Me(l.path),l.origPath===void 0?null:(0,Y.jsx)("span",{className:"gx-file-orig",children:Me(l.origPath)})]}),(0,Y.jsx)("span",{className:"gx-file-stats",children:(0,Y.jsx)(Go,{stat:t.get(l.path)})})]},l.path))]},s.dir))})]})}function Go({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,Y.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,Y.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}var K=require("react");var $e=require("react/jsx-runtime");function Bn(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Kn({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(36,t*12)),o=r/Math.max(1,t),i=f=>f*o+o/2,s=n/2,l=e.segments.map((f,d)=>{let p=i(f.from),a=i(f.to),x=f.kind==="pass"?`M ${String(p)} 0 L ${String(a)} ${String(n)}`:f.kind==="into"?`M ${String(p)} 0 C ${String(p)} ${String(n*.55)}, ${String(a)} ${String(n*.45)}, ${String(a)} ${String(s)}`:`M ${String(p)} ${String(s)} C ${String(p)} ${String(n*.55)}, ${String(a)} ${String(n*.45)}, ${String(a)} ${String(n)}`;return(0,$e.jsx)("path",{d:x,fill:"none",stroke:Bn(f.color),strokeWidth:1.4,strokeLinecap:"round"},`${f.kind}-${String(f.from)}-${String(f.to)}-${String(d)}`)});return(0,$e.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[l,(0,$e.jsx)("circle",{cx:i(e.lane),cy:s,r:e.merge?4:3.2,fill:Bn(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var Nt="git-explorer.leftColumnWidth";function Pt(e){return Math.min(560,Math.max(240,e))}function Vn(e){if(e==null)return null;let t;try{t=e.getItem(Nt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function lt(e,t){let n=Math.round(Pt(t));if(e!=null)try{e.setItem(Nt,String(n))}catch{}return n}function qn(e){if(e!=null)try{e.removeItem(Nt)}catch{}}function Be(e,t){return Math.round(e)===Math.round(t)}var jn=16;function Un(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-jn};case"ArrowRight":return{kind:"nudge",delta:jn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var Ke=[{id:"refs",min:64,max:400,fallback:168},{id:"time",min:56,max:160,fallback:84},{id:"author",min:56,max:200,fallback:96},{id:"hash",min:48,max:120,fallback:68}],Ht="git-explorer.historyColumns",Xn=16,we={refs:168,time:84,author:96,hash:68};function Yn(e){return Ke.find(n=>n.id===e)??{id:e,min:48,max:400,fallback:96}}function Dt(e,t){let n=Yn(e);return Math.min(n.max,Math.max(n.min,t))}function ct(e,t){let n=e[t];if(typeof n!="number"||!Number.isFinite(n))return null;let r=Yn(t);return n<r.min||n>r.max?null:n}function zo(e){let t;try{t=JSON.parse(e)}catch{return null}return typeof t!="object"||t===null||Array.isArray(t)?null:t}function At(e){if(e==null)return we;let t;try{t=e.getItem(Ht)}catch{return we}if(t===null)return we;let n=zo(t);return n===null?we:{refs:ct(n,"refs")??we.refs,time:ct(n,"time")??we.time,author:ct(n,"author")??we.author,hash:ct(n,"hash")??we.hash}}function _o(e,t){if(e==null)return;let n={};for(let r of Ke){let o=t[r.id];o!==we[r.id]&&(n[r.id]=o)}try{Object.keys(n).length===0?e.removeItem(Ht):e.setItem(Ht,JSON.stringify(n))}catch{}}function dt(e,t,n){let r=Math.round(Dt(t,n)),o={...At(e),[t]:r};return _o(e,o),o}function Jn(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Xn};case"ArrowRight":return{kind:"nudge",delta:Xn};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}function Qn(e,t){return Be(e,t)}var k=require("react/jsx-runtime");var Oo=12,Ie="uncommitted";function Wt(e){return Math.min(116,Math.max(36,e*12))}function $o(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}function Bo({commit:e,row:t,laneCount:n,rowHeight:r,top:o,selected:i,head:s,cursor:l,onSelect:f}){return(0,k.jsxs)("button",{type:"button",className:"gx-row",style:{top:o},"data-selected":i?"true":"false","data-head":s?"true":"false","data-cursor":l?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>f(e.hash),children:[t===void 0?(0,k.jsx)("span",{className:"gx-graph",style:{width:Wt(n)}}):(0,k.jsx)(Kn,{row:t,laneCount:n,height:r}),(0,k.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs",children:e.refs.slice(0,2).map(d=>(0,k.jsxs)("span",{className:"gx-ref","data-kind":d.kind,children:[(0,k.jsx)("span",{className:"gx-ref-name",children:d.name}),(0,k.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:d.name})]},`${d.kind}:${d.name}`))}),(0,k.jsx)("span",{className:"gx-subject",children:e.subject}),(0,k.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:It(e.time)}),(0,k.jsx)("span",{className:"gx-author",children:e.author}),(0,k.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)})]})}function Ko({summary:e,laneCount:t,rowHeight:n,top:r,selected:o,cursor:i,t:s,onSelect:l}){let f=Wt(t),p=f/Math.max(1,t)/2,a=0,x=0,$=0;for(let D of e.groups)for(let L of D.files){let T=e.stats.get(L.path);T!==void 0&&(a+=T.additions??0,x+=T.deletions??0,$+=1)}return(0,k.jsxs)("button",{type:"button",className:"gx-row gx-uncommitted",style:{top:r},"data-selected":o?"true":"false","data-cursor":i?"true":"false","data-testid":"git-uncommitted-row",title:s("uncommitted.hint"),"aria-label":s("uncommitted.hint"),onClick:l,children:[(0,k.jsx)("svg",{className:"gx-graph",width:f,height:n,viewBox:`0 0 ${String(f)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:(0,k.jsx)("circle",{"data-testid":"git-uncommitted-node",cx:p,cy:n/2,r:3.6,fill:"none",stroke:"var(--gx-accent)",strokeWidth:1.6,"aria-hidden":"true"})}),(0,k.jsx)("span",{className:"gx-refs","data-testid":"git-history-refs"}),(0,k.jsx)("span",{className:"gx-subject gx-uncommitted-label",children:`${s("uncommitted.label")} (${String(e.fileCount)})`}),(0,k.jsx)("span",{className:"gx-time",children:$===0?null:(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)("span",{className:"gx-add",children:`+${String(a)}`})," ",(0,k.jsx)("span",{className:"gx-del",children:`-${String(x)}`})]})}),(0,k.jsx)("span",{className:"gx-author"}),(0,k.jsx)("span",{className:"gx-hash"})]})}var jo=[{id:"graph",key:"history.col.graph"},{id:"refs",key:"history.col.refs"},{id:"subject",key:"history.col.subject"},{id:"time",key:"history.col.time"},{id:"author",key:"history.col.author"},{id:"hash",key:"history.col.hash"}];function Vo({widths:e,gutter:t,t:n,onPointerDown:r,onPointerMove:o,onPointerEnd:i,onKeyDown:s,onReset:l}){let f=d=>Ke.find(p=>p.id===d);return(0,k.jsx)("div",{className:"gx-colhead","data-testid":"git-history-colhead",style:{paddingRight:t===0?void 0:t},children:jo.map(d=>{let p=d.id==="graph"||d.id==="subject"?void 0:f(d.id);return(0,k.jsxs)("span",{className:`gx-colhead-cell gx-colhead-${d.id}`,children:[(0,k.jsx)("span",{className:"gx-colhead-label",children:n(d.key)}),p===void 0?null:(0,k.jsx)("span",{className:"gx-col-handle",role:"separator","aria-orientation":"vertical","aria-label":`${n("history.col.resize")}: ${n(d.key)}`,"aria-valuemin":p.min,"aria-valuemax":p.max,"aria-valuenow":e[p.id],title:n("history.col.resizeHint"),tabIndex:0,"data-testid":`gx-col-handle-${p.id}`,onPointerDown:a=>r(p.id,a),onPointerMove:o,onPointerUp:i,onPointerCancel:i,onLostPointerCapture:i,onKeyDown:a=>s(p.id,a),onDoubleClick:()=>l(p.id)})]},d.id)})})}function Zn(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:i,hasMore:s,loadingMore:l,loadError:f,searching:d,search:p,t:a,onSelect:x,onLoadMore:$,onSearch:D,onSelectUncommitted:L}=e,T=(0,K.useRef)(null),[R,b]=(0,K.useState)(0),[J,G]=(0,K.useState)(0),_=(0,K.useRef)(!1),[z]=(0,K.useState)(()=>e.columnStorage===void 0?$o():e.columnStorage),[m,E]=(0,K.useState)(()=>At(z)),[ue,Z]=(0,K.useState)(0),te=Jt(kn),C=(0,K.useRef)(null),[P,Q]=(0,K.useState)(void 0),w=e.workingTree,N=w!==void 0&&w.fileCount>0,j=N?1:0,U=t.length+j,O=r===void 0?-1:r===Ie?N?0:-1:t.findIndex(h=>h.hash===r)+(N?1:0),se=P===void 0?void 0:P<j?Ie:t[P-j]?.hash,S=(0,K.useRef)(void 0);(0,K.useEffect)(()=>{let h=T.current;if(h===null)return;let g=()=>{G(h.clientHeight),Z(Math.max(0,h.offsetWidth-h.clientWidth))};if(g(),typeof ResizeObserver>"u")return;let V=new ResizeObserver(g);return V.observe(h),()=>V.disconnect()},[t.length]),(0,K.useEffect)(()=>{l||(_.current=!1)},[l]);let ee=(0,K.useCallback)(()=>{!s||l||_.current||(_.current=!0,$())},[s,l,$]),pe=h=>{let g=h.currentTarget;b(g.scrollTop),g.scrollTop+g.clientHeight>=g.scrollHeight-160&&ee()};(0,K.useEffect)(()=>{let h=se;if(h===void 0)return;let g=h===Ie?N?0:-1:t.findIndex(V=>V.hash===h)+j;g!==P&&g>=0?Q(g):g<0&&Q(void 0)},[t,P,se,N,j]),(0,K.useEffect)(()=>{let h=S.current!==r;S.current=r,!(!h||P===void 0||r===void 0)&&O>=0&&O!==P&&Q(O)},[r,t,P,O]),(0,K.useEffect)(()=>{if(P===void 0)return;let h=T.current;if(h===null)return;let g=Sn({scrollTop:h.scrollTop,viewport:h.clientHeight===0?480:h.clientHeight,rowHeight:te,index:P,rowCount:U});g!==h.scrollTop&&(h.scrollTop=g,b(g))},[P,U,te]),(0,K.useEffect)(()=>{if(P===void 0)return;let h=P-j;h<0||!xn(h,t.length,Oo)||ee()},[P,t.length,ee,j]);let be=(0,K.useCallback)(h=>{let g=rt({key:h.key,composing:h.nativeEvent.isComposing,alt:h.altKey,ctrl:h.ctrlKey,meta:h.metaKey,shift:h.shiftKey});if(g===null)return;h.preventDefault();let V=P??(O>=0?O:void 0),ne=ot(V,g,U);if(ne===void 0)return;if(Q(ne),ne===0&&N){L?.();return}let He=t[ne-j];He!==void 0&&x(He.hash)},[t,P,N,x,L,U,j,O]),ie=st(Array.from({length:U},(h,g)=>g),{scrollTop:R,height:J===0?480:J,rowHeight:te}),fe=Math.max(1,Cn(n)),ge=(0,K.useCallback)((h,g)=>{if(!(g.button!==0||C.current!==null)){g.preventDefault(),g.stopPropagation();try{g.currentTarget.setPointerCapture(g.pointerId)}catch{return}C.current={pointerId:g.pointerId,startX:g.clientX,baseWidth:m[h],restWidth:m[h],id:h},document.body.classList.add("gx-col-resizing")}},[m]),ke=(0,K.useCallback)(h=>{let g=C.current;if(g===null||g.pointerId!==h.pointerId)return;let V=Dt(g.id,g.baseWidth+h.clientX-g.startX);E(ne=>({...ne,[g.id]:V}))},[]),ae=(0,K.useCallback)(h=>{let g=C.current;if(g===null||g.pointerId!==h.pointerId)return;C.current=null,document.body.classList.remove("gx-col-resizing");try{h.currentTarget.releasePointerCapture(h.pointerId)}catch{}let V=g.baseWidth+h.clientX-g.startX;if(Qn(V,g.baseWidth)){E(ne=>({...ne,[g.id]:g.restWidth}));return}E(dt(z,g.id,V))},[z]),he=(0,K.useCallback)(h=>{E(dt(z,h,we[h]))},[z]),Se=(0,K.useCallback)((h,g)=>{if(g.nativeEvent.isComposing)return;let V=Jn(g.key,g.altKey||g.ctrlKey||g.metaKey||g.shiftKey);if(V===null)return;if(g.preventDefault(),g.stopPropagation(),V.kind==="reset"){he(h);return}let ne=Ke.find(qe=>qe.id===h);if(ne===void 0)return;let He=V.kind==="nudge"?m[h]+V.delta:V.kind==="min"?ne.min:ne.max;E(dt(z,h,He))},[he,z,m]),Pe=(0,K.useMemo)(()=>({"--gx-col-graph":`${String(Wt(fe))}px`,"--gx-col-refs":`${String(m.refs)}px`,"--gx-col-time":`${String(m.time)}px`,"--gx-col-author":`${String(m.author)}px`,"--gx-col-hash":`${String(m.hash)}px`,"--gx-row-h":`${String(te)}px`}),[fe,te,m]),me=p.trim()!=="",Le=me?a("history.noMatch"):e.emptyTitle??a("history.empty"),H=me?void 0:e.emptyDescription;return(0,k.jsxs)("section",{className:"gx-pane","data-testid":"git-history",style:Pe,children:[(0,k.jsxs)("header",{className:"gx-pane-head",children:[(0,k.jsx)("span",{children:a("history.title")}),(0,k.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(i)}`}),(0,k.jsx)("span",{className:"gx-spacer"}),(0,k.jsx)("input",{className:"gx-filter",type:"search",value:p,spellCheck:!1,placeholder:a("history.search"),"aria-label":a("history.search"),"data-testid":"gx-history-search",onChange:h=>D(h.currentTarget.value)})]}),t.length===0&&!(N&&!me)?(0,k.jsxs)("div",{className:"gx-empty",children:[(0,k.jsx)("strong",{children:Le}),H===void 0?null:(0,k.jsx)("span",{children:H}),e.onRetry===void 0?null:(0,k.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??a("action.retry")})]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(Vo,{widths:m,gutter:ue,t:a,onPointerDown:ge,onPointerMove:ke,onPointerEnd:ae,onKeyDown:Se,onReset:he}),(0,k.jsx)("div",{className:"gx-scroll",ref:T,tabIndex:0,"data-testid":"git-history-scroll",onScroll:pe,onKeyDown:be,children:(0,k.jsx)("div",{className:"gx-vlist",style:{height:U*te},children:ie.rows.map(h=>{let g=h*te;if(h===0&&N&&w!==void 0)return(0,k.jsx)(Ko,{summary:w,laneCount:fe,rowHeight:te,top:g,selected:r===Ie,cursor:P===0,t:a,onSelect:()=>{Q(0),L?.()}},"uncommitted");let V=h-j,ne=t[V];return ne===void 0?null:(0,k.jsx)(Bo,{commit:ne,row:n[V],laneCount:fe,rowHeight:te,top:g,selected:ne.hash===r,head:ne.hash===o,cursor:h===P,onSelect:He=>{Q(h),x(He)}},ne.hash)})})})]}),(0,k.jsxs)("footer",{className:"gx-loadbar",children:[(0,k.jsx)("span",{children:`${a("history.loaded")} ${String(t.length)}`}),f===void 0?null:(0,k.jsx)("span",{className:"gx-del",children:f}),d?(0,k.jsx)("span",{className:"gx-search-status",children:a("history.searching")}):null,(0,k.jsx)("span",{className:"gx-spacer"}),s?(0,k.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:l,onClick:ee,children:a(l?"history.loading":"history.loadMore")}):(0,k.jsx)("span",{children:t.length===0?"":a("history.noMore")})]})]})}function Ft(e,t,n){let r=t.trim();return{sessionId:e,skip:Math.max(0,Math.trunc(n)),limit:100,...r===""?{}:{search:r}}}var Gt="git-explorer.detailHeight";function er(e){return Math.min(88,Math.max(6,e))}function Fe(e,t){let n=Math.max(180,t-120);return Math.min(n,Math.max(180,e))}function je(e,t){let n=t>0?t:600;return er(Math.round(e/n*1e3)/10)}function tr(e,t){let n=t>0?t:600;return e/100*n}function nr(e){if(e==null)return null;let t;try{t=e.getItem(Gt)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<6||n>88?null:n}function ut(e,t){let n=Math.round(er(t)*10)/10;if(e!=null)try{e.setItem(Gt,String(n))}catch{}return n}function rr(e){if(e!=null)try{e.removeItem(Gt)}catch{}}function or(e,t){if(t)return null;switch(e){case"ArrowUp":return{kind:"nudge",delta:16};case"ArrowDown":return{kind:"nudge",delta:-16};case"Home":return{kind:"max"};case"End":return{kind:"min"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var B=require("react");function Ve(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function ir(e){let t=e.length;for(;t>0;){let n=e.charAt(t-1);if(n!=="/"&&n!=="\\")break;t-=1}return e.slice(0,t)}function ar(e,t){let n=ir(e);if(n!==""){for(let r of t)if(ir(r.path)===n)return r.workspaceId}}function sr(e,t){let n=t.trim().toLowerCase();return n===""?e:e.filter(r=>r.title.toLowerCase().includes(n)||r.path.toLowerCase().includes(n))}var xe=require("react/jsx-runtime"),lr=320,qo="min(420px, 100vw - 32px)",cr=5,pt=8,Uo=Object.freeze([]);function Xo(e,t,n,r){return e.useAnchoredPosition!==void 0?e.useAnchoredPosition({open:t,anchorRef:n,panelRef:r,gap:cr,margin:pt}):Yo(t,n)}function Yo(e,t){let[n,r]=(0,B.useState)(void 0);return(0,B.useLayoutEffect)(()=>{if(!e){r(void 0);return}let o=t.current;if(o===null)return;let i=o.getBoundingClientRect(),s=typeof window>"u"?void 0:window,l=Math.min(lr,(s?.innerWidth??lr)-pt*2),f=Math.max(pt,Math.min(i.left,(s?.innerWidth??l)-l-pt));r({position:"fixed",left:f,top:i.bottom+cr,width:l,maxWidth:qo})},[e,t]),n}function Jo(e,t,n,r,o,i){if(e.useDismissOnOutsidePointer!==void 0){e.useDismissOnOutsidePointer(t,o,i,r?n:void 0);return}Qo(t,n,o,i)}function Qo(e,t,n,r){(0,B.useEffect)(()=>{if(!n)return;let o=i=>{let s=i.target;s instanceof Node&&e.current?.contains(s)!==!0&&t.current?.contains(s)!==!0&&r()};return document.addEventListener("pointerdown",o,!0),()=>document.removeEventListener("pointerdown",o,!0)},[e,t,n,r])}function Zo(e,t,n){if(e===0)return-1;if(t<0)return 0;let r=t+n;return r<0?0:r>e-1?e-1:r}function dr(e){let{t,available:n,list:r,startSession:o}=e;function i({root:s}){let[l,f]=(0,B.useState)(!1),[d,p]=(0,B.useState)(""),[a,x]=(0,B.useState)(-1),[$,D]=(0,B.useState)(null),L=(0,B.useRef)(null),T=(0,B.useRef)(null),R=(0,B.useRef)(null),b=(0,B.useRef)(null),J=(0,B.useRef)(null),G=(0,B.useRef)(!1),_=(0,B.useId)(),z=tt(),m=z.createPortal!==void 0,E=r===void 0?Uo:r(),ue=o!==void 0&&(n===void 0||n()),Z=(0,B.useMemo)(()=>sr(E,d),[E,d]),te=ar(s,E),C=(0,B.useCallback)(()=>{f(!1),p(""),D(null)},[]),P=(0,B.useCallback)(()=>{G.current=!0,C(),L.current?.focus({preventScroll:!0})},[C]),Q=(0,B.useCallback)(()=>{G.current=!0,C()},[C]);(0,B.useLayoutEffect)(()=>{l&&b.current?.focus({preventScroll:!0})},[l]),(0,B.useLayoutEffect)(()=>{if(l||!G.current)return;G.current=!1;let S=document.activeElement;(S===null||S===document.body||S===L.current||T.current?.contains(S)===!0)&&L.current?.focus({preventScroll:!0})},[l]),(0,B.useEffect)(()=>{if(Z.length===0){x(-1);return}let S=Z.findIndex(ee=>ee.workspaceId===te);x(S===-1?0:S)},[Z,te]),(0,B.useEffect)(()=>{J.current?.scrollIntoView?.({block:"nearest"})},[a,Z]),(0,B.useEffect)(()=>{if(!l)return;let S=ee=>{ee.key!=="Escape"||ee.isComposing||(ee.preventDefault(),P())};return document.addEventListener("keydown",S),()=>document.removeEventListener("keydown",S)},[l,P]);let w=Xo(z,l,L,R);Jo(z,T,R,m,l,Q);let N=()=>{if(l){C();return}f(!0)},j=S=>{if(S.workspaceId===te){P();return}if(o!==void 0){try{o(S.workspaceId)}catch{D(t("workspace.failed"));return}P()}},U=()=>{let S=a<0?void 0:Z[a];S!==void 0&&j(S)},O=S=>{if(!(S.metaKey||S.ctrlKey||S.altKey)&&!S.nativeEvent.isComposing){if(S.key==="ArrowDown"||S.key==="ArrowUp"){S.preventDefault();let ee=S.key==="ArrowDown"?1:-1;x(pe=>Zo(Z.length,pe,ee));return}S.key==="Enter"&&(S.preventDefault(),U())}},se=(0,xe.jsxs)("div",{className:"gx-workspace-panel","data-testid":"gx-workspace-panel",ref:R,style:w??void 0,role:"listbox",id:_,"aria-label":t("workspace.title"),children:[(0,xe.jsx)("input",{className:"gx-workspace-search","data-testid":"gx-workspace-search",ref:b,type:"text",value:d,placeholder:t("workspace.search"),"aria-label":t("workspace.search"),"aria-controls":_,onChange:S=>p(S.target.value),onKeyDown:O}),$===null?null:(0,xe.jsx)("div",{className:"gx-workspace-failure",role:"alert",children:$}),(0,xe.jsx)("div",{className:"gx-workspace-list",children:Z.length===0?(0,xe.jsx)("div",{className:"gx-workspace-empty",role:"note",children:E.length===0?t("workspace.none"):t("workspace.empty")}):Z.map((S,ee)=>{let pe=S.workspaceId===te;return(0,xe.jsxs)("button",{type:"button",className:"gx-workspace-row","data-testid":`gx-workspace-row-${S.workspaceId}`,"data-current":pe?"true":void 0,"data-active":ee===a?"true":void 0,ref:ee===a?J:void 0,role:"option","aria-selected":pe,title:S.path,onClick:()=>j(S),children:[(0,xe.jsx)("span",{className:"gx-workspace-row-title",children:S.title}),(0,xe.jsx)("span",{className:"gx-workspace-row-path",children:S.path})]},S.workspaceId)})})]});return ue?(0,xe.jsxs)("div",{className:"gx-workspace-switch",ref:T,children:[(0,xe.jsx)("button",{type:"button",className:"gx-repo gx-repo-switch","data-testid":"gx-workspace-switch",ref:L,title:s,"aria-haspopup":"listbox","aria-expanded":l,"aria-controls":l?_:void 0,onClick:N,children:Ve(s)}),l?z.createPortal===void 0?se:z.createPortal(se,document.body):null]}):(0,xe.jsx)("span",{className:"gx-repo",title:s,children:Ve(s)})}return i}var M=require("react/jsx-runtime"),oi=250;function ii(e,t){return e===void 0?"idle":t?"loading":"no-service"}function fr(e,t){let n=wn(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}function ai(e,t){if(e===void 0)return()=>{};let n=e.getSnapshot().revision;return e.subscribe(()=>{let r=e.getSnapshot().revision;r!==n&&(n=r,t())})}var si={display:"flex",alignItems:"center",gap:8};function li(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var ci=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function ft({title:e,description:t,actionLabel:n,onAction:r}){return(0,M.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,M.jsx)("strong",{children:e}),t===void 0?null:(0,M.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,M.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function hr(e){let{workbench:t,version:n,t:r,remote:o,reference:i,referenceSourceAvailable:s,workspaces:l}=e,f=l===void 0?void 0:dr({t:r,...l});function d(p){let a=p.sessionId??t.currentSessionId(),x=(0,v.useRef)(a);x.current=a;let D=(p.useInput??(()=>{}))(c=>c.phase),L=(0,v.useMemo)(()=>o(),[o]),[T]=(0,v.useState)(sn),[R,b]=(0,v.useState)(()=>({kind:ii(a,L!==void 0)})),[J,G]=(0,v.useState)(0),[_,z]=(0,v.useState)([]),[m,E]=(0,v.useState)(!1),[ue,Z]=(0,v.useState)(!1),[te,C]=(0,v.useState)(void 0),[P,Q]=(0,v.useState)(void 0),[w,N]=(0,v.useState)(""),[j,U]=(0,v.useState)(!1),O=(0,v.useRef)(""),se=(0,v.useRef)(0),S=(0,v.useRef)(void 0),ee=(0,v.useRef)(void 0),[pe,be]=(0,v.useState)(!0),ie=(0,v.useMemo)(()=>li(),[]),[fe,ge]=(0,v.useState)(()=>Vn(ie)),ke=(0,v.useRef)(null),ae=(0,v.useRef)(null),[he,Se]=(0,v.useState)(()=>nr(ie)),Pe=(0,v.useRef)(null),me=(0,v.useRef)(null),Le=(0,v.useCallback)(c=>{S.current=c,Q(c),be(!1)},[]),H=(0,v.useCallback)(()=>{be(!1)},[]),h=(0,v.useCallback)(c=>{if(c.button!==0||ae.current!==null||ci())return;let u=ke.current?.previousElementSibling;if(u instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}ae.current={pointerId:c.pointerId,startX:c.clientX,baseWidth:u.getBoundingClientRect().width,restWidth:fe},document.body.classList.add("gx-pane-resizing")}},[fe]),g=(0,v.useCallback)(c=>{let u=ae.current;u===null||u.pointerId!==c.pointerId||ge(Pt(u.baseWidth+c.clientX-u.startX))},[]),V=(0,v.useCallback)(c=>{let u=ae.current;if(u===null||u.pointerId!==c.pointerId)return;ae.current=null,document.body.classList.remove("gx-pane-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let I=u.baseWidth+c.clientX-u.startX;if(Be(I,u.baseWidth)){ge(u.restWidth);return}ge(lt(ie,I))},[ie]),ne=(0,v.useCallback)(()=>{qn(ie),ge(null)},[ie]),He=(0,v.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let u=Un(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(u===null)return;if(c.preventDefault(),c.stopPropagation(),u.kind==="reset"){ne();return}if(u.kind==="min"||u.kind==="max"){let F=u.kind==="min"?240:560;ge(lt(ie,F));return}let I=ke.current?.previousElementSibling,le=I instanceof HTMLElement?I.getBoundingClientRect().width:fe??240;ge(lt(ie,le+u.delta))},[ie,ne,fe]),qe=(0,v.useCallback)(()=>{let c=Pe.current?.parentElement;return c instanceof HTMLElement?c.getBoundingClientRect().height:0},[]),Ue=(0,v.useCallback)(()=>qe()||600,[qe]),_t=(0,v.useCallback)(()=>{let c=Ue();return Fe(tr(he===null?38:he,c),c)},[Ue,he]),Rr=(0,v.useCallback)(c=>{if(c.button!==0||me.current!==null)return;let u=Pe.current?.parentElement;if(!(u instanceof HTMLElement))return;let I=Pe.current?.nextElementSibling;if(I instanceof HTMLElement){try{c.currentTarget.setPointerCapture(c.pointerId)}catch{return}me.current={pointerId:c.pointerId,startY:c.clientY,baseHeight:I.getBoundingClientRect().height,columnHeight:u.getBoundingClientRect().height||600,restHeight:he},document.body.classList.add("gx-row-resizing")}},[he]),Cr=(0,v.useCallback)(c=>{let u=me.current;if(u===null||u.pointerId!==c.pointerId)return;let I=Fe(u.baseHeight-(c.clientY-u.startY),u.columnHeight);Se(je(I,u.columnHeight))},[]),gt=(0,v.useCallback)(c=>{let u=me.current;if(u===null||u.pointerId!==c.pointerId)return;me.current=null,document.body.classList.remove("gx-row-resizing");try{c.currentTarget.releasePointerCapture(c.pointerId)}catch{}let I=Fe(u.baseHeight-(c.clientY-u.startY),u.columnHeight);if(Be(I,u.baseHeight)){Se(u.restHeight);return}Se(ut(ie,je(I,u.columnHeight)))},[ie]),mt=(0,v.useCallback)(()=>{rr(ie),Se(null)},[ie]),Tr=(0,v.useCallback)(c=>{if(c.nativeEvent.isComposing)return;let u=or(c.key,c.altKey||c.ctrlKey||c.metaKey||c.shiftKey);if(u===null)return;if(c.preventDefault(),c.stopPropagation(),u.kind==="reset"){mt();return}let I=Ue();if(u.kind==="min"||u.kind==="max"){let F=u.kind==="min"?Fe(180,I):Fe(I,I);Se(ut(ie,je(F,I)));return}let le=Fe(_t()+u.delta,I);Se(ut(ie,je(le,I)))},[Ue,_t,ie,mt]);(0,v.useEffect)(()=>()=>{ae.current!==null&&document.body.classList.remove("gx-pane-resizing"),me.current!==null&&document.body.classList.remove("gx-row-resizing")},[]),(0,v.useEffect)(()=>{if(a===void 0||p.openView===void 0)return;let c=t.views;if(c?.bind!==void 0)return c.bind(a,p.openView)},[a,p.openView,t]),(0,v.useEffect)(()=>{if(a===void 0){b({kind:"idle"});return}if(L===void 0){b({kind:"no-service"});return}let c=!0;return b({kind:"loading"}),C(void 0),se.current+=1,O.current="",N(""),U(!1),Promise.resolve().then(()=>L.snapshot({sessionId:a})).then(u=>{if(!c)return;let I=Te(u);if(!I.ok){b({kind:"failed",message:I.message});return}let le=I.result;if(!le.ok){b({kind:"failed",message:le.error.message===""?le.error.code:le.error.message});return}let F=le.snapshot;b({kind:"ready",snapshot:F}),z(F.commits),E(F.commits.length<F.counts.commits);let re=S.current;S.current=void 0,Q(ce=>{if(re!==void 0)return re;let Ce=Oe(F.status).length>0;return ce===Ie?Ce?ce:F.commits[0]?.hash:ce!==void 0&&F.commits.some(ze=>ze.hash===ce)?ce:F.commits[0]?.hash})}).catch(u=>{c&&b({kind:"failed",message:Ee(u)})}),()=>{c=!1}},[a,L,J]),(0,v.useEffect)(()=>{let c=p.viewRequest;if(c==null||c.view!==ve)return;let u=`${c.view}:${c.focus}`;ee.current!==u&&(ee.current=u,fr(c.focus,{select:Le,complete:()=>p.completeViewRequest?.()}))},[p.viewRequest,p.completeViewRequest,Le]),(0,v.useEffect)(()=>{let c=t.viewFocus;if(c===void 0||a===void 0)return;let u=()=>{let I=c.take(ve);I!==void 0&&fr(I,{select:Le})};return u(),c.subscribe(u)},[t,a,Le]);let Er=(0,v.useMemo)(()=>Rn(_),[_]),de=R.kind==="ready"?R.snapshot:void 0,Xe=(0,v.useMemo)(()=>de===void 0?[]:Oe(de.status),[de]),xt=(0,v.useMemo)(()=>{let c=new Map;for(let u of de?.stats??[])c.set(u.path,{additions:u.additions,deletions:u.deletions});return c},[de]),Ye=(0,v.useMemo)(()=>{let c=new Map;for(let u of de?.branches??[]){let I=c.get(u.hash);I===void 0?c.set(u.hash,[{kind:u.kind,name:u.name,head:u.head}]):I.push({kind:u.kind,name:u.name,head:u.head})}return c},[de]);(0,v.useEffect)(()=>{if(a===void 0||L===void 0||R.kind!=="ready")return;let c=w.trim();if(c===O.current)return;let u=a,I=se.current+1;if(se.current=I,C(void 0),Z(!1),c===""){O.current="",U(!1);let F=R.snapshot.commits;z(F),E(F.length<R.snapshot.counts.commits),Q(re=>re===Ie||re!==void 0&&F.some(ce=>ce.hash===re)?re:F[0]?.hash);return}U(!0);let le=setTimeout(()=>{O.current=c,Promise.resolve().then(()=>L.query(Ft(a,c,0))).then(F=>{if(se.current!==I||x.current!==u)return;let re=Te(F);if(!re.ok){C(re.message);return}let ce=re.result;if(!ce.ok){C(ce.error.message===""?ce.error.code:ce.error.message);return}let Ce=ce.page,ze=Ye;z(Ce.commits.map(ye=>({...ye,refs:ze.get(ye.hash)??[]}))),E(Ce.hasMore),Q(ye=>ye===Ie||ye!==void 0&&Ce.commits.some(De=>De.hash===ye)?ye:Ce.commits[0]?.hash)}).catch(F=>{se.current===I&&C(Ee(F))}).finally(()=>{se.current===I&&U(!1)})},oi);return()=>{clearTimeout(le)}},[w,a,L,R.kind,Ye]);let Mr=(0,v.useCallback)(()=>{if(a===void 0||L===void 0||!m||ue)return;let c=a,u=O.current,I=se.current;Z(!0),C(void 0),Promise.resolve().then(()=>L.query(Ft(a,u,_.length))).then(le=>{if(x.current!==c||se.current!==I)return;let F=Te(le);if(!F.ok){C(F.message);return}let re=F.result;if(!re.ok){C(re.error.message===""?re.error.code:re.error.message);return}let ce=re.page;z(Ce=>{let ze=new Set(Ce.map(De=>De.hash)),ye=ce.commits.filter(De=>!ze.has(De.hash)).map(De=>({...De,refs:Ye.get(De.hash)??[]}));return ye.length===0?Ce:[...Ce,...ye]}),E(ce.hasMore)}).catch(le=>C(Ee(le))).finally(()=>Z(!1))},[a,L,m,ue,_.length,Ye]),Ir=(0,v.useMemo)(()=>{let c=t.views??{open:(u,I)=>t.openView?.(u,I)??!1};return at({views:c,sessionId:a??""})},[t,a]),Ot=(c,u=1)=>{a!==void 0&&Ir(c,u)},Lr=(0,v.useMemo)(()=>{let c={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(u,I)=>t.openViewOrSwitch?.(u,I)??{opened:!1,focused:!1}}};return vn({seam:c,sessionId:a??""})},[t,a]),Nr=(c,u=1)=>{a!==void 0&&P!==void 0&&Lr(P,c,u)},Pr=c=>{let u=p.inputActions;if(a===void 0||u===void 0)return"failed";let I=i?.(a),le=Dn({captureSpan:()=>{let F=u.captureInsertion?.();return F===void 0?void 0:{start:F.start,end:F.end,draftRev:F.draftRev}},insertReference:(F,re)=>I?.insertReference?.(F,re)??!1,insertText:(F,re)=>u.insertText?.(F,re)??!1,canInsertReference:s?.()===!0},c);return le!=="failed"?I?.focus?.():I?.notify?.("error",r("reference.failed")),le},Ge=(0,v.useCallback)(()=>G(c=>c+1),[]),gi=()=>G(c=>c+1);(0,v.useEffect)(()=>ai(T,Ge),[T,Ge]);let Re=de?.head,Je=Xe.reduce((c,u)=>c+u.files.length,0),Qe=(0,v.useMemo)(()=>Je===0?void 0:{groups:Xe,stats:xt,fileCount:Je},[Je,Xe,xt]),Hr=(0,v.useMemo)(()=>{if(P===void 0)return;let c=_.find(u=>u.hash===P);return c===void 0?void 0:c.refs.map(u=>u.name)},[_,P]);return(0,M.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":R.kind,"data-session":a??"","data-testid":"git-explorer-view",children:[(0,M.jsxs)("header",{className:"gx-head",children:[(0,M.jsxs)("div",{className:"gx-head-main",children:[(0,M.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,M.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,M.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,M.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,M.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,M.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),de===void 0?(0,M.jsx)("span",{className:"gx-repo",title:r("view.title"),children:r("view.title")}):f===void 0?(0,M.jsx)("span",{className:"gx-repo",title:de.root,children:Ve(de.root)}):(0,M.jsx)(f,{root:de.root}),Re?.branch===null||Re?.branch===void 0?null:(0,M.jsx)("span",{className:"gx-branch",children:Re.branch}),Re?.detached===!0?(0,M.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,Re?.ahead!==void 0&&Re.ahead>0?(0,M.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(Re.ahead)}`}):null,Re?.behind!==void 0&&Re.behind>0?(0,M.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(Re.behind)}`}):null]}),(0,M.jsxs)("div",{className:"gx-head-meta",style:si,children:[de===void 0?null:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)("span",{children:[r("head.changes")," ",(0,M.jsx)("b",{children:Je})]}),(0,M.jsxs)("span",{children:[r("head.commits")," ",(0,M.jsx)("b",{children:de.counts.commits})]}),(0,M.jsxs)("span",{children:[r("head.branches")," ",(0,M.jsx)("b",{children:de.counts.branches})]})]}),(0,M.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:R.kind==="loading",onClick:Ge,children:"\u21BB"})]})]}),a===void 0?(0,M.jsx)(ft,{title:r("state.noSession.title"),description:r("state.noSession.description")}):R.kind==="no-service"?(0,M.jsx)(ft,{title:r("state.noService.title"),description:r("state.noService.description")}):R.kind==="loading"?(0,M.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):R.kind==="failed"?(0,M.jsx)(ft,{title:r("state.failed.title"),description:R.message,actionLabel:r("action.retry"),onAction:Ge}):R.kind==="ready"&&!R.snapshot.isRepository?(0,M.jsx)(ft,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:Ge}):R.kind==="ready"?(0,M.jsxs)("div",{className:"gx-body",style:fe===null?void 0:{"--gx-left-col":`${fe}px`},children:[(0,M.jsx)(zn,{groups:Xe,stats:xt,t:r,onOpen:Ot,claimFocus:pe,onFocusClaimed:H}),(0,M.jsx)("div",{ref:ke,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":fe??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:h,onPointerMove:g,onPointerUp:V,onPointerCancel:V,onLostPointerCapture:V,onKeyDown:He,onDoubleClick:ne}),(0,M.jsxs)("div",{className:"gx-col",style:he===null?void 0:{"--gx-detail-h":`${String(he)}%`},children:[(0,M.jsx)(Zn,{commits:_,graph:Er,selectedHash:P,headHash:R.snapshot.head?.hash??null,total:R.snapshot.counts.commits,hasMore:m,loadingMore:ue,loadError:te,searching:j,search:w,t:r,onSelect:Q,onLoadMore:Mr,onSearch:N,workingTree:Qe,onSelectUncommitted:()=>Q(Ie),...R.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:Ge,retryLabel:r("action.retry")}:{}}),(0,M.jsx)("div",{ref:Pe,className:"gx-row-handle",role:"separator","aria-orientation":"horizontal","aria-label":r("detail.resize"),"aria-valuemin":6,"aria-valuemax":88,"aria-valuenow":he??void 0,title:r("detail.resizeHint"),tabIndex:0,"data-testid":"gx-row-handle",onPointerDown:Rr,onPointerMove:Cr,onPointerUp:gt,onPointerCancel:gt,onLostPointerCapture:gt,onKeyDown:Tr,onDoubleClick:mt}),P===Ie&&Qe!==void 0?(0,M.jsx)($n,{groups:Qe.groups,stats:Qe.stats,t:r,onOpen:Ot}):(0,M.jsx)(On,{sessionId:a,hash:P,remote:L,t:r,onSelect:Q,onOpenFile:Nr,refs:Hr,...p.inputActions===void 0?{}:{inputActions:p.inputActions},...D===void 0?{}:{phase:D},sourceAvailable:s?.()===!0,onReference:Pr})]})]}):null]})}return d}var mr=["slots","locale","workbench","remote"];function gr(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function xr(e){return()=>{try{let n=e.remote?.gitExplorer;if(gr(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(gr(n))return n}catch{}let t=br(e);return t===void 0?void 0:on(t)}}function br(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,i)=>n.call("/api",`${Zt}/${r}`,o,i)}function yr(e){return t=>{let n=e.get?.("sessions"),r=e.get?.("conversation");if(n?.scope===void 0||r?.input?.for===void 0)return;let o;try{let f=n.scope(t);if(f===void 0)return;o=r.input.for(f)}catch{return}if(o==null)return;let i=o.insertReference,s=o.focus,l=o.notify;return{...typeof i=="function"?{insertReference:(f,d)=>i.call(o,f,d)}:{},...typeof s=="function"?{focus:()=>s.call(o)}:{},...typeof l=="function"?{notify:(f,d)=>l.call(o,f,d)}:{}}}}function vr(e){return{available:()=>pi(e),list:()=>{try{let o=e.get?.("workspaces")?.list?.getSnapshot().items;return Array.isArray(o)?o:[]}catch{return[]}},startSession:r=>{let o=e.get?.("uiWorkspace");typeof o?.startSession=="function"&&o.startSession(r)}}}function pi(e){try{return typeof e.get?.("workspaces")?.list?.getSnapshot!="function"?!1:typeof e.get?.("uiWorkspace")?.startSession=="function"}catch{return!1}}var ht;function wr(e){let t=e.locale.bind(_e);ht?.();let n=e.locale.register(_e,{zh:$t,en:Bt});ht=n;let r=Ln(typeof document>"u"?void 0:document),o=Yt(e),i=xr(e),s=yr(e),l=Fn(e,()=>Wn(e.workbench)),f=gn({store:an(i),t});e.slots.inject(kt,()=>e.slots.register({name:kt,id:Qt,order:30,locale:_e},f));let d=e.workbench;if(d!=null){let p=vr(e),a=hr({workbench:d,version:d.version,t,remote:i,reference:s,referenceSourceAvailable:()=>l.available,workspaces:p});e.slots.inject(wt,()=>e.slots.register({name:wt,id:ve,order:110,label:()=>t("tab.label"),locale:_e},a))}return()=>{r(),o(),l.dispose(),n(),ht===n&&(ht=void 0)}}var kr={groupChanges:Oe,formatCommitDetail:it,createJump:at,computeWindow:st},Sr={name:"dsh-git-explorer",inject:mr,apply:wr,__test:kr},fi=Sr;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
