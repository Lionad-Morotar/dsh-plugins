window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var te=Object.defineProperty;var ze=Object.getOwnPropertyDescriptor;var Fe=Object.getOwnPropertyNames;var We=Object.prototype.hasOwnProperty;var Ve=(e,t)=>{for(var n in t)te(e,n,{get:t[n],enumerable:!0})},Ae=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Fe(t))!We.call(e,o)&&o!==n&&te(e,o,{get:()=>t[o],enumerable:!(r=ze(t,o))||r.enumerable});return e};var _e=e=>Ae(te({},"__esModule",{value:!0}),e);var nt={};Ve(nt,{__test:()=>Te,apply:()=>Me,clientPlugin:()=>Ee,createRemoteResolver:()=>Ge,default:()=>tt,inject:()=>Ne});module.exports=_e(nt);var de={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},ce={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var ne="conversation.view",pe="git-explorer";var q="git-explorer";var Oe={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function U(e){return Oe[e]}var ge={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function je(e,t){return(ge[e]??0)>=(ge[t]??0)?e:t}function ue(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function re(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function qe(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:je(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let s=a[0];if(s==="1"){let i=a.slice(2),p=i.slice(0,2),l=re(i,7);l!==""&&r({path:l,status:ue(p),staged:p[0]!==".",isDirectory:!1})}else if(s==="2"){let i=a.slice(2),p=i.slice(0,2),l=re(i,8),g=t[o+1]??"";l!==""&&g!==""&&(o+=1,r({path:l,status:ue(p),staged:p[0]!==".",isDirectory:!1,origPath:g}))}else if(s==="u"){let i=a.slice(2),p=re(i,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(s==="?"){let i=a.slice(2);if(i==="")continue;let p=i.endsWith("/");r({path:p?i.slice(0,-1):i,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function Ue(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function ae(e){let t=new Map;for(let n of e){let r=Ue(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function B(e){return ae(qe(e))}function oe(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let s=Math.floor(a/7);if(s<5)return`${s}w`;let i=Math.floor(a/30);return i<12?`${i}mo`:`${Math.floor(a/365)}y`}function J(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:oe(e.time,t)}}function Y({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}function Q(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),s=Math.max(0,e.length-a-o*2),i=Math.floor(Math.max(0,t.scrollTop)/n)-o,p=Math.min(Math.max(i,0),s),l=Math.min(e.length,p+a+o*2);return{rows:e.slice(p,l),startIndex:p,endIndex:l}}function xe(e){let t=[],n=[],r=[],o=0,a=[],s=()=>r.length===0?o++:(r.sort((g,u)=>g-u),r.shift()??o++),i=l=>{l!==null&&!r.includes(l)&&r.push(l)},p=()=>{let l=t.indexOf(null);return l>=0?l:(t.push(null),n.push(null),t.length-1)};for(let l of e){let g=[...t],u=[...n],x=g.indexOf(l.hash),T=x>=0;T||(x=p());let w=T?n[x]??null:null;w===null&&(w=s(),n[x]=w);for(let m=0;m<g.length;m+=1)m!==x&&g[m]===l.hash&&(i(n[m]??null),t[m]=null,n[m]=null);let k=l.parents[0];k===void 0?(i(n[x]??null),t[x]=null,n[x]=null):(t[x]=k,n[x]=w);let I=[];for(let m=1;m<l.parents.length;m+=1){let E=l.parents[m];if(E===void 0)continue;let S=t.indexOf(E);S<0&&(S=p(),t[S]=E),n[S]===null&&(n[S]=s()),I.push(S)}let G=[];for(let m=0;m<g.length;m+=1){let E=g[m];if(E===null)continue;let S=u[m]??w;E===l.hash?G.push({kind:"into",from:m,to:x,color:S}):G.push({kind:"pass",from:m,to:m,color:S})}k!==void 0&&G.push({kind:"out",from:x,to:x,color:n[x]??w});for(let m of I)G.push({kind:"out",from:x,to:m,color:n[m]??w});for(a.push({lane:x,color:w,merge:l.parents.length>=2,segments:G});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function me(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function A(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var he="dsh-git-explorer-styles",Be=`
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
  grid-template-columns: minmax(240px, 31%) minmax(0, 1fr);
  gap: 10px;
  flex: 1;
  min-height: 0;
  padding: 10px 12px 0;
  box-sizing: border-box;
}
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
  .gx-author { display: none; }
}
`;function fe(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${he}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=he,n.textContent=Be,e.head.appendChild(n),()=>{n.remove()}}var v=require("react");var b=require("react/jsx-runtime");function Je({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,b.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,b.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function ye({groups:e,stats:t,t:n,onOpen:r}){let o=e.reduce((a,s)=>a+s.files.length,0);return(0,b.jsxs)("section",{className:"gx-pane","data-testid":"git-changes",children:[(0,b.jsxs)("header",{className:"gx-pane-head",children:[(0,b.jsx)("span",{children:n("changes.title")}),(0,b.jsx)("span",{className:"gx-count",children:o})]}),(0,b.jsx)("div",{className:"gx-scroll",children:o===0?(0,b.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,b.jsx)("strong",{children:n("changes.empty")})}):e.map(a=>(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"gx-group-head",children:[(0,b.jsx)("span",{className:"gx-group-dir",children:a.dir===""?n("changes.root"):a.dir}),(0,b.jsx)("span",{className:"gx-count",children:a.files.length})]}),a.files.map(s=>{let i=t.get(s.path),p=n(`status.${s.status}`);return(0,b.jsxs)("button",{type:"button",className:"gx-file","data-status":s.status,"data-directory":s.isDirectory?"true":"false","data-renamed":s.origPath===void 0?"false":"true","data-testid":"git-change-file",title:s.isDirectory?`${p} \xB7 ${n("changes.directory")}`:`${p} \xB7 ${n("changes.jump")}`,onClick:()=>{s.isDirectory||r(s.path,1)},children:[(0,b.jsx)("span",{className:"gx-badge","data-status":s.status,children:U(s.status)}),(0,b.jsxs)("span",{className:"gx-file-name",children:[A(s.path),s.origPath===void 0?null:(0,b.jsx)("span",{className:"gx-file-orig",children:A(s.origPath)})]}),(0,b.jsx)("span",{className:"gx-file-stats",children:(0,b.jsx)(Je,{stat:i})})]},s.path)})]},a.dir===""?".":a.dir))})]})}var W=require("react");function _(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function O(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var d=require("react/jsx-runtime");function Ye({additions:e,deletions:t}){return e===null&&t===null?(0,d.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,d.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function be({sessionId:e,hash:t,remote:n,t:r,onSelect:o}){let[a,s]=(0,W.useState)({kind:"idle"}),[i,p]=(0,W.useState)(0),l=(0,W.useRef)(new Map);(0,W.useEffect)(()=>{if(t===void 0){s({kind:"idle"});return}let u=l.current.get(t);if(u!==void 0){s({kind:"ready",detail:u});return}if(n===void 0||e===void 0){s({kind:"failed",message:r("state.noService.description")});return}let x=!0;return s({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(T=>{if(!x)return;let w=_(T);if(!w.ok){s({kind:"failed",message:w.message});return}let k=w.result;k.ok?(l.current.set(t,k.detail),s({kind:"ready",detail:k.detail})):s({kind:"failed",message:k.error.message===""?k.error.code:k.error.message})}).catch(T=>{x&&s({kind:"failed",message:O(T)})}),()=>{x=!1}},[t,n,e,i,r]);let g=J(a.kind==="ready"?a.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,d.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,d.jsxs)("header",{className:"gx-detail-head",children:[(0,d.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,d.jsx)("span",{className:"gx-hash",children:g.shortHash}),(0,d.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,d.jsx)("div",{className:"gx-detail-body",children:a.kind==="idle"?(0,d.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,d.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,d.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,d.jsx)("strong",{children:r("detail.failed")}),(0,d.jsx)("span",{children:a.message}),(0,d.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>p(u=>u+1),children:r("action.retry")})]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,d.jsxs)("div",{className:"gx-detail-meta",children:[(0,d.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,d.jsx)("span",{children:g.relative}),(0,d.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,d.jsxs)("div",{className:"gx-parents",children:[(0,d.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,d.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(u=>(0,d.jsx)("button",{type:"button",className:"gx-parent",title:u,onClick:()=>o(u),children:u.slice(0,7)},u))]}),a.detail.body===""?null:(0,d.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,d.jsxs)("div",{className:"gx-detail-files",children:[(0,d.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,d.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):ae(a.detail.files).map(u=>(0,d.jsxs)("div",{className:"gx-detail-group",children:[(0,d.jsx)("div",{className:"gx-detail-dir",children:u.dir===""?r("changes.root"):u.dir}),u.files.map(x=>(0,d.jsxs)("div",{className:"gx-detail-file",children:[(0,d.jsx)("span",{className:"gx-badge","data-status":x.status,children:U(x.status)}),(0,d.jsxs)("span",{className:"gx-file-name",children:[A(x.path),x.origPath===void 0?null:(0,d.jsx)("span",{className:"gx-file-orig",children:A(x.origPath)})]}),(0,d.jsx)("span",{className:"gx-file-stats",children:(0,d.jsx)(Ye,{additions:x.additions,deletions:x.deletions})})]},x.path))]},u.dir===""?".":u.dir))]})]})})]})}var $=require("react");var j=require("react/jsx-runtime");function ve(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function we({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=p=>p*o+o/2,s=n/2,i=e.segments.map((p,l)=>{let g=a(p.from),u=a(p.to),x=p.kind==="pass"?`M ${String(g)} 0 L ${String(u)} ${String(n)}`:p.kind==="into"?`M ${String(g)} 0 C ${String(g)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(s)}`:`M ${String(g)} ${String(s)} C ${String(g)} ${String(n*.55)}, ${String(u)} ${String(n*.45)}, ${String(u)} ${String(n)}`;return(0,j.jsx)("path",{d:x,fill:"none",stroke:ve(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(l)}`)});return(0,j.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[i,(0,j.jsx)("circle",{cx:a(e.lane),cy:s,r:e.merge?4:3.2,fill:ve(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var h=require("react/jsx-runtime"),Z=24,ke=100;function Qe({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,onSelect:s}){return(0,h.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>s(e.hash),children:[t===void 0?(0,h.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,h.jsx)(we,{row:t,laneCount:n,height:Z}),(0,h.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,h.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(i=>(0,h.jsx)("span",{className:"gx-ref","data-kind":i.kind,title:i.name,children:i.name},`${i.kind}:${i.name}`)),(0,h.jsx)("span",{className:"gx-author",children:e.author}),(0,h.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:oe(e.time)})]})}function Se(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:s,loadingMore:i,loadError:p,t:l,onSelect:g,onLoadMore:u}=e,x=(0,$.useRef)(null),[T,w]=(0,$.useState)(0),[k,I]=(0,$.useState)(0),G=(0,$.useRef)(!1);(0,$.useEffect)(()=>{let R=x.current;if(R===null)return;let N=()=>I(R.clientHeight);if(N(),typeof ResizeObserver>"u")return;let z=new ResizeObserver(N);return z.observe(R),()=>z.disconnect()},[]),(0,$.useEffect)(()=>{i||(G.current=!1)},[i]);let m=(0,$.useCallback)(()=>{!s||i||G.current||(G.current=!0,u())},[s,i,u]),E=R=>{let N=R.currentTarget;w(N.scrollTop),N.scrollTop+N.clientHeight>=N.scrollHeight-160&&m()},S=Q(t,{scrollTop:T,height:k===0?480:k,rowHeight:Z}),H=Math.max(1,me(n));return(0,h.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,h.jsxs)("header",{className:"gx-pane-head",children:[(0,h.jsx)("span",{children:l("history.title")}),(0,h.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`})]}),t.length===0?(0,h.jsxs)("div",{className:"gx-empty",children:[(0,h.jsx)("strong",{children:e.emptyTitle??l("history.empty")}),e.emptyDescription===void 0?null:(0,h.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,h.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??l("action.retry")})]}):(0,h.jsx)("div",{className:"gx-scroll",ref:x,onScroll:E,"data-testid":"git-history-scroll",children:(0,h.jsx)("div",{className:"gx-vlist",style:{height:t.length*Z},children:S.rows.map((R,N)=>{let z=S.startIndex+N;return(0,h.jsx)(Qe,{commit:R,row:n[z],laneCount:H,top:z*Z,selected:R.hash===r,head:R.hash===o,onSelect:g},R.hash)})})}),(0,h.jsxs)("footer",{className:"gx-loadbar",children:[(0,h.jsx)("span",{children:`${l("history.loaded")} ${String(t.length)}`}),p===void 0?null:(0,h.jsx)("span",{className:"gx-del",children:p}),(0,h.jsx)("span",{className:"gx-spacer"}),s?(0,h.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:i,onClick:m,children:l(i?"history.loading":"history.loadMore")}):(0,h.jsx)("span",{children:t.length===0?"":l("history.noMore")})]})]})}var c=require("react/jsx-runtime");function Ze(e,t){return e===void 0?"idle":t?"loading":"no-service"}var Xe={display:"flex",alignItems:"center",gap:8};function X({title:e,description:t,actionLabel:n,onAction:r}){return(0,c.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,c.jsx)("strong",{children:e}),t===void 0?null:(0,c.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,c.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Ke(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function Ce(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(s){let i=s.sessionId??t.currentSessionId(),p=(0,v.useRef)(i);p.current=i;let l=(0,v.useMemo)(()=>o(),[o]),[g,u]=(0,v.useState)(()=>({kind:Ze(i,l!==void 0)})),[x,T]=(0,v.useState)(0),[w,k]=(0,v.useState)([]),[I,G]=(0,v.useState)(!1),[m,E]=(0,v.useState)(!1),[S,H]=(0,v.useState)(void 0),[R,N]=(0,v.useState)(void 0);(0,v.useEffect)(()=>{if(i===void 0||s.openView===void 0)return;let y=t.views;if(y?.bind!==void 0)return y.bind(i,s.openView)},[i,s.openView,t]),(0,v.useEffect)(()=>{if(i===void 0){u({kind:"idle"});return}if(l===void 0){u({kind:"no-service"});return}let y=!0;return u({kind:"loading"}),H(void 0),Promise.resolve().then(()=>l.snapshot({sessionId:i})).then(f=>{if(!y)return;let M=_(f);if(!M.ok){u({kind:"failed",message:M.message});return}let L=M.result;if(!L.ok){u({kind:"failed",message:L.error.message===""?L.error.code:L.error.message});return}let D=L.snapshot;u({kind:"ready",snapshot:D}),k(D.commits),G(D.commits.length<D.counts.commits),N(F=>F!==void 0&&D.commits.some(ee=>ee.hash===F)?F:D.commits[0]?.hash)}).catch(f=>{y&&u({kind:"failed",message:O(f)})}),()=>{y=!1}},[i,l,x]);let z=(0,v.useMemo)(()=>xe(w),[w]),C=g.kind==="ready"?g.snapshot:void 0,ie=(0,v.useMemo)(()=>C===void 0?[]:B(C.status),[C]),Le=(0,v.useMemo)(()=>{let y=new Map;for(let f of C?.stats??[])y.set(f.path,{additions:f.additions,deletions:f.deletions});return y},[C]),se=(0,v.useMemo)(()=>{let y=new Map;for(let f of C?.branches??[]){let M=y.get(f.hash);M===void 0?y.set(f.hash,[{kind:f.kind,name:f.name,head:f.head}]):M.push({kind:f.kind,name:f.name,head:f.head})}return y},[C]),$e=(0,v.useCallback)(()=>{if(i===void 0||l===void 0||!I||m)return;let y=i;E(!0),H(void 0),Promise.resolve().then(()=>l.query({sessionId:i,skip:w.length,limit:ke})).then(f=>{if(p.current!==y)return;let M=_(f);if(!M.ok){H(M.message);return}let L=M.result;if(!L.ok){H(L.error.message===""?L.error.code:L.error.message);return}let D=L.page;k(F=>{let ee=new Set(F.map(V=>V.hash)),le=D.commits.filter(V=>!ee.has(V.hash)).map(V=>({...V,refs:se.get(V.hash)??[]}));return le.length===0?F:[...F,...le]}),G(D.hasMore)}).catch(f=>H(O(f))).finally(()=>E(!1))},[i,l,I,m,w.length,se]),Pe=(0,v.useMemo)(()=>{let y=t.views??{open:(f,M)=>t.openView?.(f,M)??!1};return Y({views:y,sessionId:i??""})},[t,i]),De=(y,f=1)=>{i!==void 0&&Pe(y,f)},Ie=()=>T(y=>y+1),K=()=>T(y=>y+1),P=C?.head,He=ie.reduce((y,f)=>y+f.files.length,0);return(0,c.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":g.kind,"data-session":i??"","data-testid":"git-explorer-view",children:[(0,c.jsxs)("header",{className:"gx-head",children:[(0,c.jsxs)("div",{className:"gx-head-main",children:[(0,c.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,c.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,c.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,c.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,c.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,c.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,c.jsx)("span",{className:"gx-repo",title:C?.root??r("view.title"),children:C===void 0?r("view.title"):Ke(C.root)}),P?.branch===null||P?.branch===void 0?null:(0,c.jsx)("span",{className:"gx-branch",children:P.branch}),P?.detached===!0?(0,c.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,P?.ahead!==void 0&&P.ahead>0?(0,c.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(P.ahead)}`}):null,P?.behind!==void 0&&P.behind>0?(0,c.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(P.behind)}`}):null]}),(0,c.jsxs)("div",{className:"gx-head-meta",style:Xe,children:[C===void 0?null:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)("span",{children:[r("head.changes")," ",(0,c.jsx)("b",{children:He})]}),(0,c.jsxs)("span",{children:[r("head.commits")," ",(0,c.jsx)("b",{children:C.counts.commits})]}),(0,c.jsxs)("span",{children:[r("head.branches")," ",(0,c.jsx)("b",{children:C.counts.branches})]})]}),(0,c.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:g.kind==="loading",onClick:Ie,children:"\u21BB"})]})]}),i===void 0?(0,c.jsx)(X,{title:r("state.noSession.title"),description:r("state.noSession.description")}):g.kind==="no-service"?(0,c.jsx)(X,{title:r("state.noService.title"),description:r("state.noService.description")}):g.kind==="loading"?(0,c.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):g.kind==="failed"?(0,c.jsx)(X,{title:r("state.failed.title"),description:g.message,actionLabel:r("action.retry"),onAction:K}):g.kind==="ready"&&!g.snapshot.isRepository?(0,c.jsx)(X,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:K}):g.kind==="ready"?(0,c.jsxs)("div",{className:"gx-body",children:[(0,c.jsx)(ye,{groups:ie,stats:Le,t:r,onOpen:De}),(0,c.jsxs)("div",{className:"gx-col",children:[(0,c.jsx)(Se,{commits:w,graph:z,selectedHash:R,headHash:g.snapshot.head?.hash??null,total:g.snapshot.counts.commits,hasMore:I,loadingMore:m,loadError:S,t:r,onSelect:N,onLoadMore:$e,...g.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:K,retryLabel:r("action.retry")}:{}}),(0,c.jsx)(be,{sessionId:i,hash:R,remote:l,t:r,onSelect:N})]})]}):null]})}return a}var Ne=["slots","locale","workbench","remote"];function Re(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function Ge(e){return()=>{try{let t=e.remote?.gitExplorer;if(Re(t))return t}catch{}try{let t=e.get?.("remote.gitExplorer");if(Re(t))return t}catch{}}}function Me(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(q),r=e.locale.register(q,{zh:de,en:ce}),o=fe(typeof document>"u"?void 0:document),a=Ce({workbench:t,version:t.version,t:n,remote:Ge(e)});return e.slots.inject(ne,()=>e.slots.register({name:ne,id:pe,order:110,label:()=>n("tab.label"),locale:q},a)),()=>{o(),r()}}var Te={groupChanges:B,formatCommitDetail:J,createJump:Y,computeWindow:Q},Ee={name:"dsh-git-explorer",inject:Ne,apply:Me,__test:Te},tt=Ee;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
