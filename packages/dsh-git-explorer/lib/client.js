window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var de=Object.defineProperty;var it=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var lt=Object.prototype.hasOwnProperty;var dt=(e,t)=>{for(var n in t)de(e,n,{get:t[n],enumerable:!0})},ct=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of st(t))!lt.call(e,a)&&a!==n&&de(e,a,{get:()=>t[a],enumerable:!(r=it(t,a))||r.enumerable});return e};var pt=e=>ct(de({},"__esModule",{value:!0}),e);var Gt={};dt(Gt,{__test:()=>Be,apply:()=>Xe,clientPlugin:()=>Ye,createRemoteResolver:()=>je,createRpcCall:()=>Ue,default:()=>Mt,inject:()=>qe});module.exports=pt(Gt);var we={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","pane.resize":"\u62D6\u62FD\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},ke={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","pane.resize":"Drag to resize the left column","pane.resizeHint":"Drag to resize; double-click to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var ce="conversation.view",j="git-explorer";var Q="git-explorer",Ce="gitExplorer";var gt={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function Z(e){return gt[e]}var Se={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function ut(e,t){return(Se[e]??0)>=(Se[t]??0)?e:t}function Re(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function pe(e,t){let n=0;for(let r=0;r<t;r+=1){let a=e.indexOf(" ",n);if(a<0)return"";n=a+1}return e.slice(n)}function mt(e){let t=e.split("\0"),n=new Map,r=a=>{let o=n.get(a.path);if(o===void 0){n.set(a.path,a);return}n.set(a.path,{...o,status:ut(o.status,a.status),staged:o.staged||a.staged,isDirectory:o.isDirectory||a.isDirectory,...o.origPath===void 0&&a.origPath===void 0?{}:{origPath:o.origPath??a.origPath}})};for(let a=0;a<t.length;a+=1){let o=t[a];if(o===void 0||o===""||o.startsWith("#"))continue;let s=o[0];if(s==="1"){let i=o.slice(2),u=i.slice(0,2),d=pe(i,7);d!==""&&r({path:d,status:Re(u),staged:u[0]!==".",isDirectory:!1})}else if(s==="2"){let i=o.slice(2),u=i.slice(0,2),d=pe(i,8),m=t[a+1]??"";d!==""&&m!==""&&(a+=1,r({path:d,status:Re(u),staged:u[0]!==".",isDirectory:!1,origPath:m}))}else if(s==="u"){let i=o.slice(2),u=pe(i,9);u!==""&&r({path:u,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let i=o.slice(2);if(i==="")continue;let u=i.endsWith("/");r({path:u?i.slice(0,-1):i,status:"untracked",staged:!1,isDirectory:u})}}return[...n.values()]}function ht(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function ge(e){let t=new Map;for(let n of e){let r=ht(n.path),a=t.get(r);a===void 0?t.set(r,[n]):a.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((a,o)=>a.path.localeCompare(o.path))}))}function K(e){return ge(mt(e))}function ue(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let a=Math.floor(r/60);if(a<24)return`${a}h`;let o=Math.floor(a/24);if(o<7)return`${o}d`;let s=Math.floor(o/7);if(s<5)return`${s}w`;let i=Math.floor(o/30);return i<12?`${i}mo`:`${Math.floor(o/365)}y`}function ee(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:ue(e.time,t)}}function te({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let a=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),o=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${a}:${o}`)}}var xt=/^commit:([0-9a-f]{4,64})$/iu;function Ne(e){if(e===void 0)return;let t=xt.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function ne(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),a=Math.max(0,Math.trunc(t.overscan??6)),o=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-o-a*2),i=Math.floor(Math.max(0,t.scrollTop)/n)-a,u=Math.min(Math.max(i,0),s),d=Math.min(e.length,u+o+a*2);return{rows:e.slice(u,d),startIndex:u,endIndex:d}}function Me(e){let t=[],n=[],r=[],a=0,o=[],s=()=>r.length===0?a++:(r.sort((m,h)=>m-h),r.shift()??a++),i=d=>{d!==null&&!r.includes(d)&&r.push(d)},u=()=>{let d=t.indexOf(null);return d>=0?d:(t.push(null),n.push(null),t.length-1)};for(let d of e){let m=[...t],h=[...n],x=m.indexOf(d.hash),T=x>=0;T||(x=u());let w=T?n[x]??null:null;w===null&&(w=s(),n[x]=w);for(let y=0;y<m.length;y+=1)y!==x&&m[y]===d.hash&&(i(n[y]??null),t[y]=null,n[y]=null);let C=d.parents[0];C===void 0?(i(n[x]??null),t[x]=null,n[x]=null):(t[x]=C,n[x]=w);let W=[];for(let y=1;y<d.parents.length;y+=1){let L=d.parents[y];if(L===void 0)continue;let S=t.indexOf(L);S<0&&(S=u(),t[S]=L),n[S]===null&&(n[S]=s()),W.push(S)}let G=[];for(let y=0;y<m.length;y+=1){let L=m[y];if(L===null)continue;let S=h[y]??w;L===d.hash?G.push({kind:"into",from:y,to:x,color:S}):G.push({kind:"pass",from:y,to:y,color:S})}C!==void 0&&G.push({kind:"out",from:x,to:x,color:n[x]??w});for(let y of W)G.push({kind:"out",from:x,to:y,color:n[y]??w});for(o.push({lane:x,color:w,merge:d.parents.length>=2,segments:G});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return o}function Ge(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,a)=>Math.max(r,a.from,a.to),0));return t+1}function A(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var Te="dsh-git-explorer-styles",ft=`
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
  flex: none;
  max-width: 12ch;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
  border: 1px solid color-mix(in srgb, var(--gx-accent) 35%, transparent);
  border-radius: 999px;
  color: var(--gx-accent);
  font-family: var(--gx-mono);
  font-size: 9.5px;
  line-height: 15px;
}
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

@media (max-width: 720px) {
  .gx-body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(140px, 34%) minmax(0, 1fr); }
  /* Stacked columns have no horizontal split to resize, so the handle and any
     persisted width (this rule wins the cascade over the variable) both go
     inert. */
  .gx-pane-handle { display: none; }
  .gx-author { display: none; }
}
`;function Le(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Te}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Te,n.textContent=ft,e.head.appendChild(n),()=>{n.remove()}}var f=require("react");var v=require("react/jsx-runtime");function yt({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,v.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,v.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function Ee({groups:e,stats:t,t:n,onOpen:r}){let a=e.reduce((o,s)=>o+s.files.length,0);return(0,v.jsxs)("section",{className:"gx-pane","data-testid":"git-changes",children:[(0,v.jsxs)("header",{className:"gx-pane-head",children:[(0,v.jsx)("span",{children:n("changes.title")}),(0,v.jsx)("span",{className:"gx-count",children:a})]}),(0,v.jsx)("div",{className:"gx-scroll",children:a===0?(0,v.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,v.jsx)("strong",{children:n("changes.empty")})}):e.map(o=>(0,v.jsxs)("div",{children:[(0,v.jsxs)("div",{className:"gx-group-head",children:[(0,v.jsx)("span",{className:"gx-group-dir",children:o.dir===""?n("changes.root"):o.dir}),(0,v.jsx)("span",{className:"gx-count",children:o.files.length})]}),o.files.map(s=>{let i=t.get(s.path),u=n(`status.${s.status}`);return(0,v.jsxs)("button",{type:"button",className:"gx-file","data-status":s.status,"data-directory":s.isDirectory?"true":"false","data-renamed":s.origPath===void 0?"false":"true","data-testid":"git-change-file",title:s.isDirectory?`${u} \xB7 ${n("changes.directory")}`:`${u} \xB7 ${n("changes.jump")}`,onClick:()=>{s.isDirectory||r(s.path,1)},children:[(0,v.jsx)("span",{className:"gx-badge","data-status":s.status,children:Z(s.status)}),(0,v.jsxs)("span",{className:"gx-file-name",children:[A(s.path),s.origPath===void 0?null:(0,v.jsx)("span",{className:"gx-file-orig",children:A(s.origPath)})]}),(0,v.jsx)("span",{className:"gx-file-stats",children:(0,v.jsx)(yt,{stat:i})})]},s.path)})]},o.dir===""?".":o.dir))})]})}var H=require("react");function Pe(e){let t=n=>(r,a)=>e(n,{args:{request:r}},a);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit")}}function U(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function X(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var p=require("react/jsx-runtime");function bt({additions:e,deletions:t}){return e===null&&t===null?(0,p.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,p.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function Ie({sessionId:e,hash:t,remote:n,t:r,onSelect:a}){let[o,s]=(0,H.useState)({kind:"idle"}),[i,u]=(0,H.useState)(0),d=(0,H.useRef)(new Map);(0,H.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let h=d.current.get(t);if(h!==void 0){s({kind:"ready",detail:h});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let x=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(T=>{if(!x)return;let w=U(T);if(!w.ok){s({kind:"failed",message:w.message});return}let C=w.result;C.ok?(d.current.set(t,C.detail),s({kind:"ready",detail:C.detail})):s({kind:"failed",message:C.error.message===""?C.error.code:C.error.message})}).catch(T=>{x&&s({kind:"failed",message:X(T)})}),()=>{x=!1}},[t,n,e,i,r]);let m=ee(o.kind==="ready"?o.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,p.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,p.jsxs)("header",{className:"gx-detail-head",children:[(0,p.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,p.jsx)("span",{className:"gx-hash",children:m.shortHash}),(0,p.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,p.jsx)("div",{className:"gx-detail-body",children:o.kind==="idle"?(0,p.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):o.kind==="loading"?(0,p.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):o.kind==="failed"?(0,p.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,p.jsx)("strong",{children:r("detail.failed")}),(0,p.jsx)("span",{children:o.message}),(0,p.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>u(h=>h+1),children:r("action.retry")})]}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("div",{className:"gx-detail-subject",children:o.detail.subject}),(0,p.jsxs)("div",{className:"gx-detail-meta",children:[(0,p.jsx)("span",{className:"gx-author",children:o.detail.author}),(0,p.jsx)("span",{children:m.relative}),(0,p.jsx)("span",{title:new Date(o.detail.time*1e3).toLocaleString(),children:new Date(o.detail.time*1e3).toLocaleDateString()})]}),(0,p.jsxs)("div",{className:"gx-parents",children:[(0,p.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),o.detail.parents.length===0?(0,p.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):o.detail.parents.map(h=>(0,p.jsx)("button",{type:"button",className:"gx-parent",title:h,onClick:()=>a(h),children:h.slice(0,7)},h))]}),o.detail.body===""?null:(0,p.jsx)("pre",{className:"gx-body-text",children:o.detail.body}),(0,p.jsxs)("div",{className:"gx-detail-files",children:[(0,p.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(o.detail.files.length)}`}),o.detail.files.length===0?(0,p.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):ge(o.detail.files).map(h=>(0,p.jsxs)("div",{className:"gx-detail-group",children:[(0,p.jsx)("div",{className:"gx-detail-dir",children:h.dir===""?r("changes.root"):h.dir}),h.files.map(x=>(0,p.jsxs)("div",{className:"gx-detail-file",children:[(0,p.jsx)("span",{className:"gx-badge","data-status":x.status,children:Z(x.status)}),(0,p.jsxs)("span",{className:"gx-file-name",children:[A(x.path),x.origPath===void 0?null:(0,p.jsx)("span",{className:"gx-file-orig",children:A(x.origPath)})]}),(0,p.jsx)("span",{className:"gx-file-stats",children:(0,p.jsx)(bt,{additions:x.additions,deletions:x.deletions})})]},x.path))]},h.dir===""?".":h.dir))]})]})})]})}var P=require("react");var B=require("react/jsx-runtime");function De(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Fe({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),a=r/Math.max(1,t),o=u=>u*a+a/2,s=n/2,i=e.segments.map((u,d)=>{let m=o(u.from),h=o(u.to),x=u.kind==="pass"?`M ${String(m)} 0 L ${String(h)} ${String(n)}`:u.kind==="into"?`M ${String(m)} 0 C ${String(m)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(s)}`:`M ${String(m)} ${String(s)} C ${String(m)} ${String(n*.55)}, ${String(h)} ${String(n*.45)}, ${String(h)} ${String(n)}`;return(0,B.jsx)("path",{d:x,fill:"none",stroke:De(u.color),strokeWidth:1.4,strokeLinecap:"round"},`${u.kind}-${String(u.from)}-${String(u.to)}-${String(d)}`)});return(0,B.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[i,(0,B.jsx)("circle",{cx:o(e.lane),cy:s,r:e.merge?4:3.2,fill:De(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var b=require("react/jsx-runtime"),re=24,We=100;function vt({commit:e,row:t,laneCount:n,top:r,selected:a,head:o,onSelect:s}){return(0,b.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":a?"true":"false","data-head":o?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,b.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,b.jsx)(Fe,{row:t,laneCount:n,height:re}),(0,b.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,b.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(i=>(0,b.jsx)("span",{className:"gx-ref","data-kind":i.kind,title:i.name,children:i.name},`${i.kind}:${i.name}`)),(0,b.jsx)("span",{className:"gx-author",children:e.author}),(0,b.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:ue(e.time)})]})}function $e(e){let{commits:t,graph:n,selectedHash:r,headHash:a,total:o,hasMore:s,loadingMore:i,loadError:u,t:d,onSelect:m,onLoadMore:h}=e,x=(0,P.useRef)(null),[T,w]=(0,P.useState)(0),[C,W]=(0,P.useState)(0),G=(0,P.useRef)(!1);(0,P.useEffect)(()=>{let M=x.current;if(M===null)return;let R=()=>W(M.clientHeight);if(R(),typeof ResizeObserver>"u")return;let D=new ResizeObserver(R);return D.observe(M),()=>D.disconnect()},[]),(0,P.useEffect)(()=>{i||(G.current=!1)},[i]);let y=(0,P.useCallback)(()=>{!s||i||G.current||(G.current=!0,h())},[s,i,h]),L=M=>{let R=M.currentTarget;w(R.scrollTop),R.scrollTop+R.clientHeight>=R.scrollHeight-160&&y()},S=ne(t,{scrollTop:T,height:C===0?480:C,rowHeight:re}),$=Math.max(1,Ge(n));return(0,b.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,b.jsxs)("header",{className:"gx-pane-head",children:[(0,b.jsx)("span",{children:d("history.title")}),(0,b.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(o)}`})]}),t.length===0?(0,b.jsxs)("div",{className:"gx-empty",children:[(0,b.jsx)("strong",{children:e.emptyTitle??d("history.empty")}),e.emptyDescription===void 0?null:(0,b.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,b.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??d("action.retry")})]}):(0,b.jsx)("div",{className:"gx-scroll",ref:x,onScroll:L,"data-testid":"git-history-scroll",children:(0,b.jsx)("div",{className:"gx-vlist",style:{height:t.length*re},children:S.rows.map((M,R)=>{let D=S.startIndex+R;return(0,b.jsx)(vt,{commit:M,row:n[D],laneCount:$,top:D*re,selected:M.hash===r,head:M.hash===a,onSelect:m},M.hash)})})}),(0,b.jsxs)("footer",{className:"gx-loadbar",children:[(0,b.jsx)("span",{children:`${d("history.loaded")} ${String(t.length)}`}),u===void 0?null:(0,b.jsx)("span",{className:"gx-del",children:u}),(0,b.jsx)("span",{className:"gx-spacer"}),s?(0,b.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:i,onClick:y,children:d(i?"history.loading":"history.loadMore")}):(0,b.jsx)("span",{children:t.length===0?"":d("history.noMore")})]})]})}var me="git-explorer.leftColumnWidth";function he(e){return Math.min(560,Math.max(240,e))}function He(e){if(e==null)return null;let t;try{t=e.getItem(me)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function ze(e,t){let n=Math.round(he(t));if(e!=null)try{e.setItem(me,String(n))}catch{}return n}function _e(e){if(e!=null)try{e.removeItem(me)}catch{}}var g=require("react/jsx-runtime");function wt(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Ve(e,t){let n=Ne(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}var kt={display:"flex",alignItems:"center",gap:8};function Ct(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var St=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function oe({title:e,description:t,actionLabel:n,onAction:r}){return(0,g.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,g.jsx)("strong",{children:e}),t===void 0?null:(0,g.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,g.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Rt(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function Ae(e){let{workbench:t,version:n,t:r,remote:a}=e;function o(s){let i=s.sessionId??t.currentSessionId(),u=(0,f.useRef)(i);u.current=i;let d=(0,f.useMemo)(()=>a(),[a]),[m,h]=(0,f.useState)(()=>({kind:wt(i,d!==void 0)})),[x,T]=(0,f.useState)(0),[w,C]=(0,f.useState)([]),[W,G]=(0,f.useState)(!1),[y,L]=(0,f.useState)(!1),[S,$]=(0,f.useState)(void 0),[M,R]=(0,f.useState)(void 0),D=(0,f.useRef)(void 0),xe=(0,f.useRef)(void 0),O=(0,f.useMemo)(()=>Ct(),[]),[fe,ie]=(0,f.useState)(()=>He(O)),ye=(0,f.useRef)(null),z=(0,f.useRef)(null),Y=(0,f.useCallback)(l=>{D.current=l,R(l)},[]),Je=(0,f.useCallback)(l=>{if(l.button!==0||z.current!==null||St())return;let c=ye.current?.previousElementSibling;if(c instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}z.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:c.getBoundingClientRect().width},document.body.classList.add("gx-pane-resizing")}},[]),Qe=(0,f.useCallback)(l=>{let c=z.current;c===null||c.pointerId!==l.pointerId||ie(he(c.baseWidth+l.clientX-c.startX))},[]),se=(0,f.useCallback)(l=>{let c=z.current;if(c===null||c.pointerId!==l.pointerId)return;z.current=null,document.body.classList.remove("gx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let k=c.baseWidth+l.clientX-c.startX;Math.round(k)!==Math.round(c.baseWidth)&&ie(ze(O,k))},[O]),Ze=(0,f.useCallback)(()=>{_e(O),ie(null)},[O]);(0,f.useEffect)(()=>()=>{z.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,f.useEffect)(()=>{if(i===void 0||s.openView===void 0)return;let l=t.views;if(l?.bind!==void 0)return l.bind(i,s.openView)},[i,s.openView,t]),(0,f.useEffect)(()=>{if(i===void 0){h({kind:"idle"});return}if(d===void 0){h({kind:"no-service"});return}let l=!0;return h({kind:"loading"}),$(void 0),Promise.resolve().then(()=>d.snapshot({sessionId:i})).then(c=>{if(!l)return;let k=U(c);if(!k.ok){h({kind:"failed",message:k.message});return}let E=k.result;if(!E.ok){h({kind:"failed",message:E.error.message===""?E.error.code:E.error.message});return}let F=E.snapshot;h({kind:"ready",snapshot:F}),C(F.commits),G(F.commits.length<F.counts.commits);let _=D.current;D.current=void 0,R(q=>_!==void 0?_:q!==void 0&&F.commits.some(J=>J.hash===q)?q:F.commits[0]?.hash)}).catch(c=>{l&&h({kind:"failed",message:X(c)})}),()=>{l=!1}},[i,d,x]),(0,f.useEffect)(()=>{let l=s.viewRequest;if(l==null||l.view!==j)return;let c=`${l.view}:${l.focus}`;xe.current!==c&&(xe.current=c,Ve(l.focus,{select:Y,complete:()=>s.completeViewRequest?.()}))},[s.viewRequest,s.completeViewRequest,Y]),(0,f.useEffect)(()=>{let l=t.viewFocus;if(l===void 0||i===void 0)return;let c=()=>{let k=l.take(j);k!==void 0&&Ve(k,{select:Y})};return c(),l.subscribe(c)},[t,i,Y]);let Ke=(0,f.useMemo)(()=>Me(w),[w]),N=m.kind==="ready"?m.snapshot:void 0,be=(0,f.useMemo)(()=>N===void 0?[]:K(N.status),[N]),et=(0,f.useMemo)(()=>{let l=new Map;for(let c of N?.stats??[])l.set(c.path,{additions:c.additions,deletions:c.deletions});return l},[N]),ve=(0,f.useMemo)(()=>{let l=new Map;for(let c of N?.branches??[]){let k=l.get(c.hash);k===void 0?l.set(c.hash,[{kind:c.kind,name:c.name,head:c.head}]):k.push({kind:c.kind,name:c.name,head:c.head})}return l},[N]),tt=(0,f.useCallback)(()=>{if(i===void 0||d===void 0||!W||y)return;let l=i;L(!0),$(void 0),Promise.resolve().then(()=>d.query({sessionId:i,skip:w.length,limit:We})).then(c=>{if(u.current!==l)return;let k=U(c);if(!k.ok){$(k.message);return}let E=k.result;if(!E.ok){$(E.error.message===""?E.error.code:E.error.message);return}let F=E.page;C(_=>{let q=new Set(_.map(V=>V.hash)),J=F.commits.filter(V=>!q.has(V.hash)).map(V=>({...V,refs:ve.get(V.hash)??[]}));return J.length===0?_:[..._,...J]}),G(F.hasMore)}).catch(c=>$(X(c))).finally(()=>L(!1))},[i,d,W,y,w.length,ve]),nt=(0,f.useMemo)(()=>{let l=t.views??{open:(c,k)=>t.openView?.(c,k)??!1};return te({views:l,sessionId:i??""})},[t,i]),rt=(l,c=1)=>{i!==void 0&&nt(l,c)},ot=()=>T(l=>l+1),le=()=>T(l=>l+1),I=N?.head,at=be.reduce((l,c)=>l+c.files.length,0);return(0,g.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":m.kind,"data-session":i??"","data-testid":"git-explorer-view",children:[(0,g.jsxs)("header",{className:"gx-head",children:[(0,g.jsxs)("div",{className:"gx-head-main",children:[(0,g.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,g.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,g.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,g.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,g.jsx)("span",{className:"gx-repo",title:N?.root??r("view.title"),children:N===void 0?r("view.title"):Rt(N.root)}),I?.branch===null||I?.branch===void 0?null:(0,g.jsx)("span",{className:"gx-branch",children:I.branch}),I?.detached===!0?(0,g.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,I?.ahead!==void 0&&I.ahead>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(I.ahead)}`}):null,I?.behind!==void 0&&I.behind>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(I.behind)}`}):null]}),(0,g.jsxs)("div",{className:"gx-head-meta",style:kt,children:[N===void 0?null:(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)("span",{children:[r("head.changes")," ",(0,g.jsx)("b",{children:at})]}),(0,g.jsxs)("span",{children:[r("head.commits")," ",(0,g.jsx)("b",{children:N.counts.commits})]}),(0,g.jsxs)("span",{children:[r("head.branches")," ",(0,g.jsx)("b",{children:N.counts.branches})]})]}),(0,g.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:m.kind==="loading",onClick:ot,children:"\u21BB"})]})]}),i===void 0?(0,g.jsx)(oe,{title:r("state.noSession.title"),description:r("state.noSession.description")}):m.kind==="no-service"?(0,g.jsx)(oe,{title:r("state.noService.title"),description:r("state.noService.description")}):m.kind==="loading"?(0,g.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):m.kind==="failed"?(0,g.jsx)(oe,{title:r("state.failed.title"),description:m.message,actionLabel:r("action.retry"),onAction:le}):m.kind==="ready"&&!m.snapshot.isRepository?(0,g.jsx)(oe,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:le}):m.kind==="ready"?(0,g.jsxs)("div",{className:"gx-body",style:fe===null?void 0:{"--gx-left-col":`${fe}px`},children:[(0,g.jsx)(Ee,{groups:be,stats:et,t:r,onOpen:rt}),(0,g.jsx)("div",{ref:ye,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),title:r("pane.resizeHint"),"data-testid":"gx-pane-handle",onPointerDown:Je,onPointerMove:Qe,onPointerUp:se,onPointerCancel:se,onLostPointerCapture:se,onDoubleClick:Ze}),(0,g.jsxs)("div",{className:"gx-col",children:[(0,g.jsx)($e,{commits:w,graph:Ke,selectedHash:M,headHash:m.snapshot.head?.hash??null,total:m.snapshot.counts.commits,hasMore:W,loadingMore:y,loadError:S,t:r,onSelect:R,onLoadMore:tt,...m.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:le,retryLabel:r("action.retry")}:{}}),(0,g.jsx)(Ie,{sessionId:i,hash:M,remote:d,t:r,onSelect:R})]})]}):null]})}return o}var qe=["slots","locale","workbench","remote"];function Oe(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function je(e){return()=>{try{let n=e.remote?.gitExplorer;if(Oe(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Oe(n))return n}catch{}let t=Ue(e);return t===void 0?void 0:Pe(t)}}function Ue(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,a,o)=>n.call("/api",`${Ce}/${r}`,a,o)}var ae;function Xe(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(Q);ae?.();let r=e.locale.register(Q,{zh:we,en:ke});ae=r;let a=Le(typeof document>"u"?void 0:document),o=Ae({workbench:t,version:t.version,t:n,remote:je(e)});return e.slots.inject(ce,()=>e.slots.register({name:ce,id:j,order:110,label:()=>n("tab.label"),locale:Q},o)),()=>{a(),r(),ae===r&&(ae=void 0)}}var Be={groupChanges:K,formatCommitDetail:ee,createJump:te,computeWindow:ne},Ye={name:"dsh-git-explorer",inject:qe,apply:Xe,__test:Be},Mt=Ye;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
