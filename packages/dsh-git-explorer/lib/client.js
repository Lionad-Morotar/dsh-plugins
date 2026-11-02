window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var xe=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var St=Object.getOwnPropertyNames;var Rt=Object.prototype.hasOwnProperty;var Tt=(e,t)=>{for(var n in t)xe(e,n,{get:t[n],enumerable:!0})},Mt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of St(t))!Rt.call(e,o)&&o!==n&&xe(e,o,{get:()=>t[o],enumerable:!(r=Ct(t,o))||r.enumerable});return e};var Nt=e=>Mt(xe({},"__esModule",{value:!0}),e);var Zt={};Tt(Zt,{__test:()=>lt,apply:()=>st,clientPlugin:()=>dt,createRemoteResolver:()=>it,createRpcCall:()=>at,default:()=>Qt,inject:()=>ot});module.exports=Nt(Zt);var Me={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5","preview.revision":"\u8BE5\u63D0\u4EA4\u65F6\u7684\u7248\u672C","preview.loading":"\u6B63\u5728\u8BFB\u53D6\u8BE5\u63D0\u4EA4\u7684\u7248\u672C\u2026","preview.unavailable":"\u9884\u89C8\u4E0D\u53EF\u7528","preview.noService":"\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u6587\u4EF6\u9884\u89C8","preview.binary":"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.submodule":"\u5B50\u6A21\u5757\uFF0C\u6682\u4E0D\u652F\u6301\u9884\u89C8","preview.tooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u65E0\u6CD5\u9884\u89C8","preview.notFound":"\u8BE5\u63D0\u4EA4\u4E2D\u627E\u4E0D\u5230\u6B64\u6587\u4EF6","preview.deleted":"\u8BE5\u63D0\u4EA4\u5220\u9664\u4E86\u6B64\u6587\u4EF6\uFF0C\u663E\u793A\u7B2C\u4E00\u7236\u7248\u672C","preview.truncated":"\u5DF2\u622A\u65AD\uFF0C\u4EC5\u663E\u793A\u524D 40 \u884C","preview.empty":"\uFF08\u7A7A\u6587\u4EF6\uFF09"},Ne={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail","preview.revision":"version at this commit","preview.loading":"Reading this commit's version\u2026","preview.unavailable":"Preview unavailable","preview.noService":"This host does not provide file previews","preview.binary":"Binary file, no preview","preview.submodule":"Submodule, no preview","preview.tooLarge":"File too large to preview","preview.notFound":"File not found in this commit","preview.deleted":"This commit deleted the file; showing the first parent","preview.truncated":"Truncated to the first 40 lines","preview.empty":"(empty file)"};var ye="conversation.view",Y="git-explorer";var re="git-explorer",Pe="gitExplorer";var Pt={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Q(e){return Pt[e]}var Ee={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Et(e,t){return(Ee[e]??0)>=(Ee[t]??0)?e:t}function Le(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function ve(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function Lt(e){let t=e.split("\0"),n=new Map,r=o=>{let l=n.get(o.path);if(l===void 0){n.set(o.path,o);return}n.set(o.path,{...l,status:Et(l.status,o.status),staged:l.staged||o.staged,isDirectory:l.isDirectory||o.isDirectory,...l.origPath===void 0&&o.origPath===void 0?{}:{origPath:l.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let l=t[o];if(l===void 0||l===""||l.startsWith("#"))continue;let c=l[0];if(c==="1"){let i=l.slice(2),u=i.slice(0,2),a=ve(i,7);a!==""&&r({path:a,status:Le(u),staged:u[0]!==".",isDirectory:!1})}else if(c==="2"){let i=l.slice(2),u=i.slice(0,2),a=ve(i,8),g=t[o+1]??"";a!==""&&g!==""&&(o+=1,r({path:a,status:Le(u),staged:u[0]!==".",isDirectory:!1,origPath:g}))}else if(c==="u"){let i=l.slice(2),u=ve(i,9);u!==""&&r({path:u,status:"conflicted",staged:!1,isDirectory:!1})}else if(c==="?"){let i=l.slice(2);if(i==="")continue;let u=i.endsWith("/");r({path:u?i.slice(0,-1):i,status:"untracked",staged:!1,isDirectory:u})}}return[...n.values()]}function Gt(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function be(e){let t=new Map;for(let n of e){let r=Gt(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,l)=>o.path.localeCompare(l.path))}))}function oe(e){return be(Lt(e))}function we(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let l=Math.floor(o/24);if(l<7)return`${l}d`;let c=Math.floor(l/7);if(c<5)return`${c}w`;let i=Math.floor(l/30);return i<12?`${i}mo`:`${Math.floor(l/365)}y`}function ie(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:we(e.time,t)}}function ae({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),l=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${l}`)}}function Ge({seam:e,sessionId:t}){return(n,r,o=1)=>{let l=typeof n=="string"?n.trim().toLowerCase():"";if(l===""||typeof r!="string")return;let c=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(c==="")return;let i=Number.isFinite(o)&&o>0?Math.floor(o):1,u=`git:${l}:${String(i)}:${c}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",u);let a=e.openViewOrSwitch("fs-explorer",u);if(a.focused){e.viewFocus?.take?.("fs-explorer");return}if(a.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",u)!==!0&&e.openView?.("fs-explorer",u)!==!0&&e.viewFocus?.request?.("fs-explorer",u)}}var Ft=/^commit:([0-9a-f]{4,64})$/iu;function Fe(e){if(e===void 0)return;let t=Ft.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function se(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),l=Math.max(1,Math.ceil(r/n)),c=Math.max(0,e.length-l-o*2),i=Math.floor(Math.max(0,t.scrollTop)/n)-o,u=Math.min(Math.max(i,0),c),a=Math.min(e.length,u+l+o*2);return{rows:e.slice(u,a),startIndex:u,endIndex:a}}function De(e){let t=[],n=[],r=[],o=0,l=[],c=()=>r.length===0?o++:(r.sort((g,v)=>g-v),r.shift()??o++),i=a=>{a!==null&&!r.includes(a)&&r.push(a)},u=()=>{let a=t.indexOf(null);return a>=0?a:(t.push(null),n.push(null),t.length-1)};for(let a of e){let g=[...t],v=[...n],b=g.indexOf(a.hash),A=b>=0;A||(b=u());let R=A?n[b]??null:null;R===null&&(R=c(),n[b]=R);for(let x=0;x<g.length;x+=1)x!==b&&g[x]===a.hash&&(i(n[x]??null),t[x]=null,n[x]=null);let N=a.parents[0];N===void 0?(i(n[b]??null),t[b]=null,n[b]=null):(t[b]=N,n[b]=R);let L=[];for(let x=1;x<a.parents.length;x+=1){let D=a.parents[x];if(D===void 0)continue;let P=t.indexOf(D);P<0&&(P=u(),t[P]=D),n[P]===null&&(n[P]=c()),L.push(P)}let G=[];for(let x=0;x<g.length;x+=1){let D=g[x];if(D===null)continue;let P=v[x]??R;D===a.hash?G.push({kind:"into",from:x,to:b,color:P}):G.push({kind:"pass",from:x,to:x,color:P})}N!==void 0&&G.push({kind:"out",from:b,to:b,color:n[b]??R});for(let x of L)G.push({kind:"out",from:b,to:x,color:n[x]??R});for(l.push({lane:b,color:R,merge:a.parents.length>=2,segments:G});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return l}function Ie(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function q(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function He(e,t){return`${e.trim().toLowerCase()}\0${t}`}function We(e){let t=Math.max(1,Math.trunc(e)),n=new Map;return{get(r){let o=n.get(r);if(o!==void 0)return n.delete(r),n.set(r,o),o},set(r,o){if(n.delete(r),n.set(r,o),n.size>t){let l=n.keys().next();l.done||n.delete(l.value)}},get size(){return n.size}}}function ze(e,t,n,r=10,o=8){let l=Math.max(o,n.width-t.width-o),c=e.right+r;c>l&&(c=e.left-t.width-r,c<o&&(c=Math.min(l,Math.max(o,e.left))));let i=Math.max(o,n.height-t.height-o),u=e.bottom+r,a=e.top-t.height-r,g;return u<=i?g=Math.max(o,u):a>=o?g=a:g=Math.min(i,Math.max(o,e.top)),{left:c,top:g}}var $e="dsh-git-explorer-styles",Dt=`
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

@media (max-width: 720px) {
  .gx-body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(140px, 34%) minmax(0, 1fr); }
  /* Stacked columns have no horizontal split to resize, so the handle and any
     persisted width (this rule wins the cascade over the variable) both go
     inert. */
  .gx-pane-handle { display: none; }
  .gx-author { display: none; }
}
`;function _e(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${$e}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=$e,n.textContent=Dt,e.head.appendChild(n),()=>{n.remove()}}var h=require("react");var le=require("react");var S=require("react/jsx-runtime");function It(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Ht({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,S.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,S.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Ae({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:l}){let c=e.reduce((u,a)=>u+a.files.length,0),i=(0,le.useRef)(null);return(0,le.useEffect)(()=>{o&&(l(),It(i.current))},[o,l]),(0,S.jsxs)("section",{ref:i,className:"gx-pane","data-testid":"git-changes",children:[(0,S.jsxs)("header",{className:"gx-pane-head",children:[(0,S.jsx)("span",{children:n("changes.title")}),(0,S.jsx)("span",{className:"gx-count",children:c})]}),(0,S.jsx)("div",{className:"gx-scroll",children:c===0?(0,S.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,S.jsx)("strong",{children:n("changes.empty")})}):e.map(u=>(0,S.jsxs)("div",{children:[(0,S.jsxs)("div",{className:"gx-group-head",children:[(0,S.jsx)("span",{className:"gx-group-dir",children:u.dir===""?n("changes.root"):u.dir}),(0,S.jsx)("span",{className:"gx-count",children:u.files.length})]}),u.files.map(a=>{let g=t.get(a.path),v=n(`status.${a.status}`);return(0,S.jsxs)("button",{type:"button",className:"gx-file","data-status":a.status,"data-directory":a.isDirectory?"true":"false","data-renamed":a.origPath===void 0?"false":"true","data-testid":"git-change-file",title:a.isDirectory?`${v} \xB7 ${n("changes.directory")}`:`${v} \xB7 ${n("changes.jump")}`,onClick:()=>{a.isDirectory||r(a.path,1)},children:[(0,S.jsx)("span",{className:"gx-badge","data-status":a.status,children:Q(a.status)}),(0,S.jsxs)("span",{className:"gx-file-name",children:[q(a.path),a.origPath===void 0?null:(0,S.jsx)("span",{className:"gx-file-orig",children:q(a.origPath)})]}),(0,S.jsx)("span",{className:"gx-file-stats",children:(0,S.jsx)(Ht,{stat:g})})]},a.path)})]},u.dir===""?".":u.dir))})]})}var k=require("react"),Oe=require("react-dom");function Ve(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),show:t("show")}}function J(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function K(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var d=require("react/jsx-runtime"),Wt=200,zt=40,$t=24,_t=7;function At({additions:e,deletions:t}){return e===null&&t===null?(0,d.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,d.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Vt(e,t,n){return e==="too-large"?n("preview.tooLarge"):e==="not-found"?n("preview.notFound"):t===""?n("preview.unavailable"):t}function Ot({preview:e,t,textRef:n}){if(e.kind==="loading")return(0,d.jsx)("span",{className:"gx-preview-note",children:t("preview.loading")});if(e.kind==="unavailable")return(0,d.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,d.jsx)("strong",{children:t("preview.unavailable")}),(0,d.jsx)("span",{className:"gx-preview-note",children:e.message})]});let{page:r}=e;return r.kind==="binary"||r.kind==="submodule"?(0,d.jsxs)("div",{className:"gx-preview-unavailable",children:[(0,d.jsx)("strong",{children:t("preview.unavailable")}),(0,d.jsx)("span",{className:"gx-preview-note",children:r.kind==="binary"?t("preview.binary"):`${t("preview.submodule")} \xB7 ${r.revision.slice(0,12)}`})]}):(0,d.jsxs)(d.Fragment,{children:[r.text===""?(0,d.jsx)("span",{className:"gx-preview-note",children:t("preview.empty")}):(0,d.jsx)("pre",{ref:n,className:"gx-preview-text",children:r.text}),r.source==="first-parent"?(0,d.jsx)("span",{className:"gx-preview-note",children:t("preview.deleted")}):null,r.eof?null:(0,d.jsx)("span",{className:"gx-preview-note",children:t("preview.truncated")})]})}function qt({preview:e,hash:t,t:n}){let r=(0,k.useRef)(null),o=(0,k.useRef)(null),[l,c]=(0,k.useState)(null),[i,u]=(0,k.useState)(!1);return(0,k.useLayoutEffect)(()=>{let a=r.current;if(a===null)return;let g=a.getBoundingClientRect();c(ze(e.anchor,{width:g.width,height:g.height},{width:window.innerWidth,height:window.innerHeight}));let v=o.current;u(v!==null&&v.scrollHeight>v.clientHeight+1)},[e]),typeof document>"u"?null:(0,Oe.createPortal)((0,d.jsxs)("div",{ref:r,className:"gx-preview","data-testid":"gx-preview-card","data-clipped":i?"true":"false",role:"tooltip",style:{position:"fixed",pointerEvents:"none",left:l?.left??0,top:l?.top??0,visibility:l===null?"hidden":"visible"},children:[(0,d.jsxs)("div",{className:"gx-preview-head",children:[(0,d.jsx)("span",{className:"gx-badge","data-status":e.file.status,title:n(`status.${e.file.status}`),children:Q(e.file.status)}),(0,d.jsx)("span",{className:"gx-preview-name",title:e.file.path,children:q(e.file.path)}),(0,d.jsx)("span",{className:"gx-preview-rev",children:`${t.slice(0,_t)} \xB7 ${n("preview.revision")}`})]}),(0,d.jsx)("div",{className:"gx-preview-body",children:(0,d.jsx)(Ot,{preview:e,t:n,textRef:o})})]}),document.body)}function qe({sessionId:e,hash:t,remote:n,t:r,onSelect:o,onOpenFile:l}){let[c,i]=(0,k.useState)({kind:"idle"}),[u,a]=(0,k.useState)(0),g=(0,k.useRef)(new Map),[v,b]=(0,k.useState)({kind:"idle"}),A=(0,k.useRef)(We($t)),R=(0,k.useRef)(void 0),N=(0,k.useRef)(void 0),L=(0,k.useRef)(void 0),G=(0,k.useRef)(null),x=(0,k.useCallback)(()=>{R.current=void 0,N.current!==void 0&&(window.clearTimeout(N.current),N.current=void 0),L.current?.abort(),L.current=void 0,b(m=>m.kind==="idle"?m:{kind:"idle"})},[]),D=(0,k.useCallback)((m,y)=>{if(x(),t===void 0)return;let C=y.getBoundingClientRect(),M={left:C.left,top:C.top,right:C.right,bottom:C.bottom},E=He(t,m.path);R.current=E,N.current=window.setTimeout(()=>{if(N.current=void 0,R.current!==E)return;let ee=A.current.get(E);if(ee!==void 0){b({kind:"ready",file:m,anchor:M,page:ee});return}if(e===void 0||n===void 0||typeof n.show!="function"){b({kind:"unavailable",file:m,anchor:M,message:r("preview.noService")});return}let O=new AbortController;L.current=O,b({kind:"loading",file:m,anchor:M}),Promise.resolve().then(()=>n.show({sessionId:e,hash:t,path:m.path,offset:1,limit:zt},O.signal)).then(H=>{if(O.signal.aborted||R.current!==E)return;let z=J(H);if(!z.ok){b({kind:"unavailable",file:m,anchor:M,message:z.message});return}let W=z.result;if(!W.ok){b({kind:"unavailable",file:m,anchor:M,message:Vt(W.error.code,W.error.message,r)});return}A.current.set(E,W.page),b({kind:"ready",file:m,anchor:M,page:W.page})}).catch(H=>{O.signal.aborted||R.current!==E||b({kind:"unavailable",file:m,anchor:M,message:K(H)})}).finally(()=>{L.current===O&&(L.current=void 0)})},Wt)},[x,t,n,e,r]);(0,k.useEffect)(()=>{if(t===void 0){i({kind:"idle"});return}let m=g.current.get(t);if(m!==void 0){i({kind:"ready",detail:m});return}if(n===void 0||e===void 0){i({kind:"failed",message:r("state.noService.description")});return}let y=!0;return i({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(C=>{if(!y)return;let M=J(C);if(!M.ok){i({kind:"failed",message:M.message});return}let E=M.result;E.ok?(g.current.set(t,E.detail),i({kind:"ready",detail:E.detail})):i({kind:"failed",message:E.error.message===""?E.error.code:E.error.message})}).catch(C=>{y&&i({kind:"failed",message:K(C)})}),()=>{y=!1}},[t,n,e,u,r]),(0,k.useEffect)(()=>{if(v.kind==="idle")return;let m=y=>{y.key==="Escape"&&x()};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[v.kind,x]),(0,k.useEffect)(()=>{let m=G.current;if(m===null)return;let y=()=>x();return m.addEventListener("scroll",y,{passive:!0}),()=>m.removeEventListener("scroll",y)},[x]),(0,k.useEffect)(()=>{x()},[t,u,e,n,x]),(0,k.useEffect)(()=>()=>{R.current=void 0,N.current!==void 0&&window.clearTimeout(N.current),L.current?.abort()},[]);let P=ie(c.kind==="ready"?c.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,d.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,d.jsxs)("header",{className:"gx-detail-head",children:[(0,d.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,d.jsx)("span",{className:"gx-hash",children:P.shortHash}),(0,d.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,d.jsx)("div",{className:"gx-detail-body",ref:G,children:c.kind==="idle"?(0,d.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):c.kind==="loading"?(0,d.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):c.kind==="failed"?(0,d.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,d.jsx)("strong",{children:r("detail.failed")}),(0,d.jsx)("span",{children:c.message}),(0,d.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>a(m=>m+1),children:r("action.retry")})]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"gx-detail-subject",children:c.detail.subject}),(0,d.jsxs)("div",{className:"gx-detail-meta",children:[(0,d.jsx)("span",{className:"gx-author",children:c.detail.author}),(0,d.jsx)("span",{children:P.relative}),(0,d.jsx)("span",{title:new Date(c.detail.time*1e3).toLocaleString(),children:new Date(c.detail.time*1e3).toLocaleDateString()})]}),(0,d.jsxs)("div",{className:"gx-parents",children:[(0,d.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),c.detail.parents.length===0?(0,d.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):c.detail.parents.map(m=>(0,d.jsx)("button",{type:"button",className:"gx-parent",title:m,onClick:()=>o(m),children:m.slice(0,7)},m))]}),c.detail.body===""?null:(0,d.jsx)("pre",{className:"gx-body-text",children:c.detail.body}),(0,d.jsxs)("div",{className:"gx-detail-files",children:[(0,d.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(c.detail.files.length)}`}),c.detail.files.length===0?(0,d.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):be(c.detail.files).map(m=>(0,d.jsxs)("div",{className:"gx-detail-group",children:[(0,d.jsx)("div",{className:"gx-detail-dir",children:m.dir===""?r("changes.root"):m.dir}),m.files.map(y=>(0,d.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:y.path,onClick:()=>l?.(y.path),onMouseEnter:C=>D(y,C.currentTarget),onMouseLeave:x,children:[(0,d.jsx)("span",{className:"gx-badge","data-status":y.status,children:Q(y.status)}),(0,d.jsxs)("span",{className:"gx-file-name",children:[q(y.path),y.origPath===void 0?null:(0,d.jsx)("span",{className:"gx-file-orig",children:q(y.origPath)})]}),(0,d.jsx)("span",{className:"gx-file-stats",children:(0,d.jsx)(At,{additions:y.additions,deletions:y.deletions})})]},y.path))]},m.dir===""?".":m.dir))]})]})}),v.kind==="idle"?null:(0,d.jsx)(qt,{preview:v,hash:t??"",t:r})]})}var _=require("react");var Z=require("react/jsx-runtime");function je(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Ue({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),l=u=>u*o+o/2,c=n/2,i=e.segments.map((u,a)=>{let g=l(u.from),v=l(u.to),b=u.kind==="pass"?`M ${String(g)} 0 L ${String(v)} ${String(n)}`:u.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(v)} ${String(n*.45)}, ${String(v)} ${String(c)}`:`M ${String(g)} ${String(c)} C ${String(g)} ${String(n*.55)}, ${String(v)} ${String(n*.45)}, ${String(v)} ${String(n)}`;return(0,Z.jsx)("path",{d:b,fill:"none",stroke:je(u.color),strokeWidth:1.4,strokeLinecap:"round"},`${u.kind}-${String(u.from)}-${String(u.to)}-${String(a)}`)});return(0,Z.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[i,(0,Z.jsx)("circle",{cx:l(e.lane),cy:c,r:e.merge?4:3.2,fill:je(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var w=require("react/jsx-runtime"),de=24,Be=100;function jt({commit:e,row:t,laneCount:n,top:r,selected:o,head:l,onSelect:c}){return(0,w.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":l?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>c(e.hash),children:[t===void 0?(0,w.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,w.jsx)(Ue,{row:t,laneCount:n,height:de}),(0,w.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,w.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(i=>(0,w.jsxs)("span",{className:"gx-ref","data-kind":i.kind,children:[(0,w.jsx)("span",{className:"gx-ref-name",children:i.name}),(0,w.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:i.name})]},`${i.kind}:${i.name}`)),(0,w.jsx)("span",{className:"gx-author",children:e.author}),(0,w.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:we(e.time)})]})}function Je(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:l,hasMore:c,loadingMore:i,loadError:u,t:a,onSelect:g,onLoadMore:v}=e,b=(0,_.useRef)(null),[A,R]=(0,_.useState)(0),[N,L]=(0,_.useState)(0),G=(0,_.useRef)(!1);(0,_.useEffect)(()=>{let y=b.current;if(y===null)return;let C=()=>L(y.clientHeight);if(C(),typeof ResizeObserver>"u")return;let M=new ResizeObserver(C);return M.observe(y),()=>M.disconnect()},[]),(0,_.useEffect)(()=>{i||(G.current=!1)},[i]);let x=(0,_.useCallback)(()=>{!c||i||G.current||(G.current=!0,v())},[c,i,v]),D=y=>{let C=y.currentTarget;R(C.scrollTop),C.scrollTop+C.clientHeight>=C.scrollHeight-160&&x()},P=se(t,{scrollTop:A,height:N===0?480:N,rowHeight:de}),m=Math.max(1,Ie(n));return(0,w.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,w.jsxs)("header",{className:"gx-pane-head",children:[(0,w.jsx)("span",{children:a("history.title")}),(0,w.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(l)}`})]}),t.length===0?(0,w.jsxs)("div",{className:"gx-empty",children:[(0,w.jsx)("strong",{children:e.emptyTitle??a("history.empty")}),e.emptyDescription===void 0?null:(0,w.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,w.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??a("action.retry")})]}):(0,w.jsx)("div",{className:"gx-scroll",ref:b,onScroll:D,"data-testid":"git-history-scroll",children:(0,w.jsx)("div",{className:"gx-vlist",style:{height:t.length*de},children:P.rows.map((y,C)=>{let M=P.startIndex+C;return(0,w.jsx)(jt,{commit:y,row:n[M],laneCount:m,top:M*de,selected:y.hash===r,head:y.hash===o,onSelect:g},y.hash)})})}),(0,w.jsxs)("footer",{className:"gx-loadbar",children:[(0,w.jsx)("span",{children:`${a("history.loaded")} ${String(t.length)}`}),u===void 0?null:(0,w.jsx)("span",{className:"gx-del",children:u}),(0,w.jsx)("span",{className:"gx-spacer"}),c?(0,w.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:i,onClick:x,children:a(i?"history.loading":"history.loadMore")}):(0,w.jsx)("span",{children:t.length===0?"":a("history.noMore")})]})]})}var ke="git-explorer.leftColumnWidth";function Ce(e){return Math.min(560,Math.max(240,e))}function Xe(e){if(e==null)return null;let t;try{t=e.getItem(ke)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function ce(e,t){let n=Math.round(Ce(t));if(e!=null)try{e.setItem(ke,String(n))}catch{}return n}function Ye(e){if(e!=null)try{e.removeItem(ke)}catch{}}function Qe(e,t){return Math.round(e)===Math.round(t)}var Ke=16;function Ze(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Ke};case"ArrowRight":return{kind:"nudge",delta:Ke};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var f=require("react/jsx-runtime");function Ut(e,t){return e===void 0?"idle":t?"loading":"no-service"}function tt(e,t){let n=Fe(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}var Bt={display:"flex",alignItems:"center",gap:8};function Jt(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Kt=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function ue({title:e,description:t,actionLabel:n,onAction:r}){return(0,f.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,f.jsx)("strong",{children:e}),t===void 0?null:(0,f.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,f.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Xt(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function nt(e){let{workbench:t,version:n,t:r,remote:o}=e;function l(c){let i=c.sessionId??t.currentSessionId(),u=(0,h.useRef)(i);u.current=i;let a=(0,h.useMemo)(()=>o(),[o]),[g,v]=(0,h.useState)(()=>({kind:Ut(i,a!==void 0)})),[b,A]=(0,h.useState)(0),[R,N]=(0,h.useState)([]),[L,G]=(0,h.useState)(!1),[x,D]=(0,h.useState)(!1),[P,m]=(0,h.useState)(void 0),[y,C]=(0,h.useState)(void 0),M=(0,h.useRef)(void 0),E=(0,h.useRef)(void 0),[ee,O]=(0,h.useState)(!0),H=(0,h.useMemo)(()=>Jt(),[]),[z,W]=(0,h.useState)(()=>Xe(H)),ge=(0,h.useRef)(null),j=(0,h.useRef)(null),te=(0,h.useCallback)(s=>{M.current=s,C(s),O(!1)},[]),ct=(0,h.useCallback)(()=>{O(!1)},[]),ut=(0,h.useCallback)(s=>{if(s.button!==0||j.current!==null||Kt())return;let p=ge.current?.previousElementSibling;if(p instanceof HTMLElement){try{s.currentTarget.setPointerCapture(s.pointerId)}catch{return}j.current={pointerId:s.pointerId,startX:s.clientX,baseWidth:p.getBoundingClientRect().width,restWidth:z},document.body.classList.add("gx-pane-resizing")}},[z]),pt=(0,h.useCallback)(s=>{let p=j.current;p===null||p.pointerId!==s.pointerId||W(Ce(p.baseWidth+s.clientX-p.startX))},[]),me=(0,h.useCallback)(s=>{let p=j.current;if(p===null||p.pointerId!==s.pointerId)return;j.current=null,document.body.classList.remove("gx-pane-resizing");try{s.currentTarget.releasePointerCapture(s.pointerId)}catch{}let T=p.baseWidth+s.clientX-p.startX;if(Qe(T,p.baseWidth)){W(p.restWidth);return}W(ce(H,T))},[H]),fe=(0,h.useCallback)(()=>{Ye(H),W(null)},[H]),gt=(0,h.useCallback)(s=>{if(s.nativeEvent.isComposing)return;let p=Ze(s.key,s.altKey||s.ctrlKey||s.metaKey||s.shiftKey);if(p===null)return;if(s.preventDefault(),s.stopPropagation(),p.kind==="reset"){fe();return}if(p.kind==="min"||p.kind==="max"){let $=p.kind==="min"?240:560;W(ce(H,$));return}let T=ge.current?.previousElementSibling,I=T instanceof HTMLElement?T.getBoundingClientRect().width:z??240;W(ce(H,I+p.delta))},[H,fe,z]);(0,h.useEffect)(()=>()=>{j.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,h.useEffect)(()=>{if(i===void 0||c.openView===void 0)return;let s=t.views;if(s?.bind!==void 0)return s.bind(i,c.openView)},[i,c.openView,t]),(0,h.useEffect)(()=>{if(i===void 0){v({kind:"idle"});return}if(a===void 0){v({kind:"no-service"});return}let s=!0;return v({kind:"loading"}),m(void 0),Promise.resolve().then(()=>a.snapshot({sessionId:i})).then(p=>{if(!s)return;let T=J(p);if(!T.ok){v({kind:"failed",message:T.message});return}let I=T.result;if(!I.ok){v({kind:"failed",message:I.error.message===""?I.error.code:I.error.message});return}let $=I.snapshot;v({kind:"ready",snapshot:$}),N($.commits),G($.commits.length<$.counts.commits);let U=M.current;M.current=void 0,C(X=>U!==void 0?U:X!==void 0&&$.commits.some(ne=>ne.hash===X)?X:$.commits[0]?.hash)}).catch(p=>{s&&v({kind:"failed",message:K(p)})}),()=>{s=!1}},[i,a,b]),(0,h.useEffect)(()=>{let s=c.viewRequest;if(s==null||s.view!==Y)return;let p=`${s.view}:${s.focus}`;E.current!==p&&(E.current=p,tt(s.focus,{select:te,complete:()=>c.completeViewRequest?.()}))},[c.viewRequest,c.completeViewRequest,te]),(0,h.useEffect)(()=>{let s=t.viewFocus;if(s===void 0||i===void 0)return;let p=()=>{let T=s.take(Y);T!==void 0&&tt(T,{select:te})};return p(),s.subscribe(p)},[t,i,te]);let mt=(0,h.useMemo)(()=>De(R),[R]),F=g.kind==="ready"?g.snapshot:void 0,Re=(0,h.useMemo)(()=>F===void 0?[]:oe(F.status),[F]),ft=(0,h.useMemo)(()=>{let s=new Map;for(let p of F?.stats??[])s.set(p.path,{additions:p.additions,deletions:p.deletions});return s},[F]),Te=(0,h.useMemo)(()=>{let s=new Map;for(let p of F?.branches??[]){let T=s.get(p.hash);T===void 0?s.set(p.hash,[{kind:p.kind,name:p.name,head:p.head}]):T.push({kind:p.kind,name:p.name,head:p.head})}return s},[F]),ht=(0,h.useCallback)(()=>{if(i===void 0||a===void 0||!L||x)return;let s=i;D(!0),m(void 0),Promise.resolve().then(()=>a.query({sessionId:i,skip:R.length,limit:Be})).then(p=>{if(u.current!==s)return;let T=J(p);if(!T.ok){m(T.message);return}let I=T.result;if(!I.ok){m(I.error.message===""?I.error.code:I.error.message);return}let $=I.page;N(U=>{let X=new Set(U.map(B=>B.hash)),ne=$.commits.filter(B=>!X.has(B.hash)).map(B=>({...B,refs:Te.get(B.hash)??[]}));return ne.length===0?U:[...U,...ne]}),G($.hasMore)}).catch(p=>m(K(p))).finally(()=>D(!1))},[i,a,L,x,R.length,Te]),xt=(0,h.useMemo)(()=>{let s=t.views??{open:(p,T)=>t.openView?.(p,T)??!1};return ae({views:s,sessionId:i??""})},[t,i]),yt=(s,p=1)=>{i!==void 0&&xt(s,p)},vt=(0,h.useMemo)(()=>{let s={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(p,T)=>t.openViewOrSwitch?.(p,T)??{opened:!1,focused:!1}}};return Ge({seam:s,sessionId:i??""})},[t,i]),bt=(s,p=1)=>{i!==void 0&&y!==void 0&&vt(y,s,p)},wt=()=>A(s=>s+1),he=()=>A(s=>s+1),V=F?.head,kt=Re.reduce((s,p)=>s+p.files.length,0);return(0,f.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":i??"","data-testid":"git-explorer-view",children:[(0,f.jsxs)("header",{className:"gx-head",children:[(0,f.jsxs)("div",{className:"gx-head-main",children:[(0,f.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,f.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,f.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,f.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,f.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,f.jsx)("span",{className:"gx-repo",title:F?.root??r("view.title"),children:F===void 0?r("view.title"):Xt(F.root)}),V?.branch===null||V?.branch===void 0?null:(0,f.jsx)("span",{className:"gx-branch",children:V.branch}),V?.detached===!0?(0,f.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,V?.ahead!==void 0&&V.ahead>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(V.ahead)}`}):null,V?.behind!==void 0&&V.behind>0?(0,f.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(V.behind)}`}):null]}),(0,f.jsxs)("div",{className:"gx-head-meta",style:Bt,children:[F===void 0?null:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("span",{children:[r("head.changes")," ",(0,f.jsx)("b",{children:kt})]}),(0,f.jsxs)("span",{children:[r("head.commits")," ",(0,f.jsx)("b",{children:F.counts.commits})]}),(0,f.jsxs)("span",{children:[r("head.branches")," ",(0,f.jsx)("b",{children:F.counts.branches})]})]}),(0,f.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:wt,children:"\u21BB"})]})]}),i===void 0?(0,f.jsx)(ue,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,f.jsx)(ue,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,f.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,f.jsx)(ue,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:he}):g.kind==="ready"&&!g.snapshot.isRepository?(0,f.jsx)(ue,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:he}):g.kind==="ready"?(0,f.jsxs)("div",{className:"gx-body",style:z===null?void 0:{"--gx-left-col":`${z}px`},children:[(0,f.jsx)(Ae,{groups:Re,stats:ft,t:r,onOpen:yt,claimFocus:ee,onFocusClaimed:ct}),(0,f.jsx)("div",{ref:ge,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":z??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:ut,onPointerMove:pt,onPointerUp:me,onPointerCancel:me,onLostPointerCapture:me,onKeyDown:gt,onDoubleClick:fe}),(0,f.jsxs)("div",{className:"gx-col",children:[(0,f.jsx)(Je,{commits:R,graph:mt,selectedHash:y,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:L,loadingMore:x,loadError:P,t:r,onSelect:C,onLoadMore:ht,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:he,retryLabel:r("action.retry")}:{}}),(0,f.jsx)(qe,{sessionId:i,hash:y,remote:a,t:r,onSelect:C,onOpenFile:bt})]})]}):null]})}return l}var ot=["slots","locale","workbench","remote"];function rt(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function it(e){return()=>{try{let n=e.remote?.gitExplorer;if(rt(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(rt(n))return n}catch{}let t=at(e);return t===void 0?void 0:Ve(t)}}function at(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,l)=>n.call("/api",`${Pe}/${r}`,o,l)}var pe;function st(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(re);pe?.();let r=e.locale.register(re,{zh:Me,en:Ne});pe=r;let o=_e(typeof document>"u"?void 0:document),l=nt({workbench:t,version:t.version,t:n,remote:it(e)});return e.slots.inject(ye,()=>e.slots.register({name:ye,id:Y,order:110,label:()=>n("tab.label"),locale:re},l)),()=>{o(),r(),pe===r&&(pe=void 0)}}var lt={groupChanges:oe,formatCommitDetail:ie,createJump:ae,computeWindow:se},dt={name:"dsh-git-explorer",inject:ot,apply:st,__test:lt},Qt=dt;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
