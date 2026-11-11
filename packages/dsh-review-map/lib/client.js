window.__ModuleLoader__.load({
  id: "dsh-review-map",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Z=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var We=Object.getOwnPropertyNames;var _e=Object.prototype.hasOwnProperty;var je=(e,a)=>{for(var t in a)Z(e,t,{get:a[t],enumerable:!0})},Ge=(e,a,t,n)=>{if(a&&typeof a=="object"||typeof a=="function")for(let i of We(a))!_e.call(e,i)&&i!==t&&Z(e,i,{get:()=>a[i],enumerable:!(n=Ke(a,i))||n.enumerable});return e};var Xe=e=>Ge(Z({},"__esModule",{value:!0}),e);var oa={};je(oa,{apply:()=>Ne,boot:()=>xe,clientPlugin:()=>ze,default:()=>da,inject:()=>Fe});module.exports=Xe(oa);var H="dsh-review-map",J="conversation.view",we="review-map";var K="review-map",W="/review-map/api",Q="client.map.js";var ee={"review-map.tabTitle":"\u8BC4\u5BA1","review-map.repoFallback":"\u672A\u77E5\u4ED3\u5E93","review-map.scopeWorktree":"\u672A\u63D0\u4EA4","review-map.scopeBranch":"\u5206\u652F\u5BF9\u6BD4","review-map.refresh":"\u91CD\u65B0\u8BFB\u53D6","review-map.statLines":"\u6E90\u7801\u884C","review-map.statFiles":"\u6539\u52A8\u6587\u4EF6","review-map.statNewImports":"\u65B0\u589E\u5BFC\u5165","review-map.statDroppedImports":"\u4E22\u5931\u5BFC\u5165","review-map.indexPartial":"\u7D22\u5F15 {parsed}/{total}","review-map.unresolved":"\u2265{count} \u672A\u89E3\u6790\uFF08\u542B\u5916\u90E8\u4F9D\u8D56\uFF09","review-map.unresolvedHint":"\u5916\u90E8\u5305\u4E0E\u52A8\u6001 import \u8BA1\u5165\u6B64\u5904\uFF0C\u4E0D\u753B\u4F9D\u8D56\u8FB9\u3002","review-map.mapTitle":"\u76EE\u5F55\u5730\u56FE","review-map.mapLoading":"\u5730\u56FE\u7D22\u5F15\u4E2D","review-map.mapEmpty":"\u6CA1\u6709\u53EF\u94FA\u5F00\u7684\u7ED3\u6784","review-map.mapError":"\u5730\u56FE\u7D22\u5F15\u5931\u8D25","review-map.flowImports":"imports","review-map.flowImportedBy":"imported by","review-map.flowUnresolved":"\u672A\u89E3\u6790","review-map.mapUnresolved":"\u2265{count} \u672A\u89E3\u6790","review-map.mapPartial":"\u7D22\u5F15 {parsed}/{total}","review-map.uncommitted":"\u672A\u63D0\u4EA4 {count}","review-map.listMetaWorktree":"\u672A\u63D0\u4EA4\u6539\u52A8","review-map.listMetaBranch":"\u5BF9\u6BD4 {base}","review-map.listSort":"\u6309\u53D8\u66F4\u91CF\u6392\u5E8F","review-map.listEmpty":"\u5DE5\u4F5C\u533A\u6CA1\u6709\u53D8\u66F4","review-map.renameHint":"\u539F\u8DEF\u5F84 {path}","review-map.markBinary":"\u4E8C\u8FDB\u5236","review-map.markUntracked":"\u672A\u8DDF\u8E2A","review-map.markConflicted":"\u51B2\u7A81","review-map.statusAdded":"\u65B0\u589E","review-map.statusModified":"\u4FEE\u6539","review-map.statusDeleted":"\u5220\u9664","review-map.statusRenamed":"\u91CD\u547D\u540D","review-map.statusCopied":"\u590D\u5236","review-map.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","review-map.statusUntracked":"\u672A\u8DDF\u8E2A","review-map.statusConflicted":"\u51B2\u7A81","review-map.statusUnknown":"\u672A\u77E5","review-map.loading":"\u52A0\u8F7D\u4E2D","review-map.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u53D8\u66F4","review-map.emptyHint":"\u8BC4\u5BA1\u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u53D8\u66F4\u8303\u56F4\u94FA\u5F00\u3002","review-map.detailClose":"\u5173\u95ED\u8BE6\u60C5","review-map.detailTruncated":"\u5DF2\u622A\u65AD","review-map.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","review-map.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","review-map.detailEmpty":"\u8BE5\u6587\u4EF6\u6CA1\u6709\u53EF\u663E\u793A\u7684\u5DEE\u5F02","review-map.detailErrorConflicted":"\u6587\u4EF6\u6709\u672A\u89E3\u51B3\u7684\u51B2\u7A81","review-map.detailErrorTooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u5DF2\u8DF3\u8FC7","review-map.detailErrorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.detailErrorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u6587\u4EF6","review-map.detailErrorUnknown":"\u8BFB\u53D6\u8BE5\u6587\u4EF6\u65F6\u51FA\u9519","review-map.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","review-map.errorNoBase":"\u4ED3\u5E93\u6CA1\u6709\u53EF\u6BD4\u57FA\u7EBF","review-map.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","review-map.errorTooLarge":"\u53D8\u66F4\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","review-map.errorConflicted":"\u8BE5\u6587\u4EF6\u5904\u4E8E\u51B2\u7A81\u4E2D","review-map.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.errorUnknown":"\u8BFB\u53D6\u53D8\u66F4\u65F6\u51FA\u9519"},ae={"review-map.tabTitle":"Review","review-map.repoFallback":"Unknown repository","review-map.scopeWorktree":"Uncommitted","review-map.scopeBranch":"Branch","review-map.refresh":"Refresh","review-map.statLines":"Source lines","review-map.statFiles":"Files changed","review-map.statNewImports":"New imports","review-map.statDroppedImports":"Dropped imports","review-map.indexPartial":"indexed {parsed}/{total}","review-map.unresolved":"\u2265{count} unresolved (incl. external)","review-map.unresolvedHint":"External packages and dynamic imports are counted here and are not drawn as edges.","review-map.mapTitle":"Directory map","review-map.mapLoading":"Indexing the map","review-map.mapEmpty":"No structure to lay out","review-map.mapError":"The map index failed","review-map.flowImports":"imports","review-map.flowImportedBy":"imported by","review-map.flowUnresolved":"unresolved","review-map.mapUnresolved":"\u2265{count} unresolved","review-map.mapPartial":"indexed {parsed}/{total}","review-map.uncommitted":"{count} uncommitted","review-map.listMetaWorktree":"Uncommitted changes","review-map.listMetaBranch":"Against {base}","review-map.listSort":"Sorted by churn","review-map.listEmpty":"No changes in this workspace","review-map.renameHint":"was {path}","review-map.markBinary":"binary","review-map.markUntracked":"untracked","review-map.markConflicted":"conflict","review-map.statusAdded":"added","review-map.statusModified":"modified","review-map.statusDeleted":"deleted","review-map.statusRenamed":"renamed","review-map.statusCopied":"copied","review-map.statusTypeChanged":"type changed","review-map.statusUntracked":"untracked","review-map.statusConflicted":"conflicted","review-map.statusUnknown":"unknown","review-map.loading":"Loading","review-map.empty":"Select a session to load its changes","review-map.emptyHint":"The review map will lay the change set out here.","review-map.detailClose":"Close the detail","review-map.detailTruncated":"Truncated","review-map.detailBinary":"Binary file, {size}","review-map.detailUnknownSize":"size unknown","review-map.detailEmpty":"This file has no diff to show","review-map.detailErrorConflicted":"This file has an unresolved conflict","review-map.detailErrorTooLarge":"This file is too large and was skipped","review-map.detailErrorUnreadable":"The read failed","review-map.detailErrorBadRequest":"This file cannot be read","review-map.detailErrorUnknown":"Something went wrong reading this file","review-map.errorNotARepo":"This directory is not a git repository","review-map.errorNoBase":"This repository has no baseline to compare against","review-map.errorNoSession":"This session has no workspace","review-map.errorTooLarge":"The change is too large to read in full","review-map.errorConflicted":"This file is in conflict","review-map.errorUnreadable":"The read failed","review-map.errorUnknown":"Something went wrong reading the changes"};var ve="data-dsh-review-map",Ye=`[data-testid="review-map"] {
  position: relative;
  display: flex;
  flex-direction: column;
  /* The host only gives the conversation view a definite height when the panel
     declares itself a composer overlay (see the attribute in view.tsx). Without
     \`flex: 1 1 auto\` plus \`align-self: stretch\` the panel sits at its content
     height inside a column flex parent, and \`height: 100%\` then resolves
     against an auto parent. */
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  padding: 22px 26px calc(var(--dsh-composer-height, 140px) + 12px);
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 1.45;

  /* The two state colours the list needs. Both are derived from host tokens so
     the light and dark palettes move them without a second block of rules. */
  --rm-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-del: var(--dsw-alias-state-error-primary, #cf222e);
  /* The diff's line backgrounds and gutter colours. Declared here so a theme can
     override them in one place; the values are mixed from the two state colours
     rather than used at full strength, because a solid green block behind every
     added line is unreadable in a dark theme. */
  --rm-add-bg: color-mix(in srgb, var(--rm-add) 14%, transparent);
  --rm-del-bg: color-mix(in srgb, var(--rm-del) 14%, transparent);
  --rm-add-fg: var(--rm-add);
  --rm-del-fg: var(--rm-del);
  --rm-mono: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  --rm-code: var(--dsh-code-font-size, 11px);
}

/* Header: identity, range, refresh. */
[data-testid="review-map"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="review-map"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="repo-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="head"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  white-space: nowrap;
}

[data-testid="review-map"] [data-rm="scope"] {
  display: inline-flex;
  gap: 2px;
  margin-left: auto;
}

[data-testid="review-map"] [data-rm="scope"] button,
[data-testid="review-map"] [data-rm="refresh"] {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="review-map"] [data-rm="scope"] button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.04));
  border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
}

[data-testid="review-map"] [data-rm="refresh"]:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Stats: two readings, side by side. */
[data-testid="review-map"] [data-rm="stats"] {
  flex: none;
  display: flex;
  gap: 10px;
  padding: 12px 0;
}

[data-testid="review-map"] [data-rm="stat"] {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
}

[data-testid="review-map"] [data-rm="stat-label"] {
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="stat-value"] {
  font-family: var(--rm-mono);
  font-size: calc(var(--dsh-content-font-size, 14px) * 16 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="stat-add"] {
  color: var(--rm-add);
}

[data-testid="review-map"] [data-rm="stat-del"] {
  color: var(--rm-del);
}

[data-testid="review-map"] [data-rm="uncommitted"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

/* Split region: the list, and the panel beside it when one is open. */
[data-testid="review-map"] [data-rm="split"] {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* Closed: one column, the list takes everything. Open: the list keeps a
     readable minimum and the panel takes the larger share. Grid rather than
     flex because the two columns must not fight over a percentage. */
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
}

/* Three regions, and the map is always one of them: the review is a map with a
   list beside it, not a list that sometimes grows a map. The list keeps a
   readable minimum, the map takes the slack, and the detail takes the larger
   share only while it is open. */
[data-testid="review-map"] [data-rm="split"] {
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.2fr);
  gap: 14px;
}

[data-testid="review-map"] [data-rm="split"][data-open="true"] {
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1fr) minmax(0, 1.3fr);
  gap: 14px;
}

/* The map pane: a frame the chunk draws inside. */
[data-testid="review-map"] [data-rm="map-pane"] {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  overflow: hidden;
}

/* The map's title names the repository. It lives in the view's stylesheet
   because the pane frame does; the map's own rules travel with the chunk. */
[data-testid="review-map"] [data-rm="map-title"] {
  flex: none;
  margin: 0;
  padding: 6px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="map-title-repo"] {
  color: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

/* A hovered row is lit without moving: the linkage must not shift the list. */
[data-testid="review-map"] [data-testid="review-row"][data-hovered="true"] {
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.06));
}

[data-testid="review-map"] [data-rm="map-host"] {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

[data-testid="review-map"] [data-rm="map-loading"],
[data-testid="review-map"] [data-rm="map-error"],
[data-testid="review-map"] [data-rm="map-empty"] {
  margin: 12px;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
  text-align: center;
}

[data-testid="review-map"] [data-rm="map-error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

/* The index annotations sit under their card's number: they qualify it rather
   than competing with it. */
[data-testid="review-map"] [data-rm="index-partial"],
[data-testid="review-map"] [data-rm="unresolved"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="unresolved"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

/* A narrow panel stacks instead of scrolling sideways: a two-column split at
   this width would leave the diff narrower than its line numbers. */
@media (max-width: 720px) {
  [data-testid="review-map"] [data-rm="split"],
  [data-testid="review-map"] [data-rm="split"][data-open="true"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(120px, 0.8fr) minmax(120px, 1fr);
  }

  [data-testid="review-map"] [data-rm="split"][data-open="true"] {
    grid-template-rows: minmax(100px, 0.6fr) minmax(100px, 0.8fr) minmax(0, 1.2fr);
  }
}

[data-testid="review-map"] [data-rm="list"] {
  min-height: 0;
  overflow-y: auto;
  /* No horizontal scroll: a long path is ellipsized, not panned. A review list
     that scrolls sideways hides the churn column, which is the column the sort
     is about. */
  overflow-x: hidden;
}

[data-testid="review-map"] [data-rm="list-meta"] {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 0 8px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="review-map"] [data-rm="list-empty"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-testid="review-row"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 4px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
}

[data-testid="review-map"] [data-testid="review-row"]:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
}

[data-testid="review-map"] [data-rm="mark"] {
  flex: none;
  width: 1.2em;
  text-align: center;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="mark"][data-status="added"] {
  color: var(--rm-add);
}

[data-testid="review-map"] [data-rm="mark"][data-status="deleted"] {
  color: var(--rm-del);
}

[data-testid="review-map"] [data-rm="mark"][data-status="conflicted"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="review-map"] [data-rm="path"] {
  flex: 1 1 auto;
  min-width: 0;
  /* The ellipsis has to land on the path, not on the row: the row also holds the
     mark and the churn, and clipping it would cut the numbers off. */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

[data-testid="review-map"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="path-name"] {
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="path-name"].rm-struck {
  text-decoration: line-through;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-testid="review-row"][data-deleted="true"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  opacity: 0.7;
}

[data-testid="review-map"] [data-rm="churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
  white-space: nowrap;
}

[data-testid="review-map"] [data-rm="churn"][data-note] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-style: italic;
}

/* Detail panel: header, then a scrolling diff. */
[data-testid="review-map"] [data-rm="detail"] {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  overflow: hidden;
}

[data-testid="review-map"] [data-rm="detail-header"] {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
}

[data-testid="review-map"] [data-rm="detail-path"] {
  flex: 1 1 auto;
  min-width: 0;
  /* The full path is the point of this header, so it wraps rather than being
     ellipsized: a truncated path in a detail panel is the one place a reader
     cannot work around. */
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="detail-status"] {
  flex: none;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-close"] {
  flex: none;
  font: inherit;
  line-height: 1;
  padding: 2px 6px;
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  cursor: pointer;
}

[data-testid="review-map"] [data-rm="detail-body"] {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 4px 0;
}

[data-testid="review-map"] [data-rm="detail-loading"],
[data-testid="review-map"] [data-rm="detail-error"],
[data-testid="review-map"] [data-rm="detail-empty"],
[data-testid="review-map"] [data-rm="detail-binary"],
[data-testid="review-map"] [data-rm="detail-truncated"] {
  margin: 8px 10px;
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="review-map"] [data-rm="detail-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

/* Diff rows: two number gutters, a sign, then the text. */
[data-testid="review-map"] [data-rm="diff"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  /* No horizontal scroll: a long line is clipped with an ellipsis rather than
     turning the panel into a two-axis scroller. */
  overflow-x: hidden;
}

[data-testid="review-map"] [data-rm="diff-hunk"] {
  padding: 2px 10px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.05));
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

[data-testid="review-map"] [data-rm="diff-line"] {
  display: grid;
  grid-template-columns: 3.2em 3.2em 1.2em minmax(0, 1fr);
  align-items: baseline;
  /* Compact: a diff is read by scanning, and 20px is the tightest line that
     still separates two rows of a mono face at this size. */
  line-height: 20px;
  min-height: 20px;
}

[data-testid="review-map"] [data-rm="diff-old"],
[data-testid="review-map"] [data-rm="diff-new"] {
  text-align: right;
  padding-right: 6px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

[data-testid="review-map"] [data-rm="diff-sign"] {
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
  user-select: none;
}

[data-testid="review-map"] [data-rm="diff-text"] {
  padding-right: 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

/* The two state colours are mixed with the surface rather than used at full
   strength: a solid green block behind every added line is unreadable in a dark
   theme, and the mix keeps the text's contrast against the panel. */
[data-testid="review-map"] [data-rm="diff-line"][data-kind="add"] {
  background: var(--rm-add-bg, color-mix(in srgb, var(--rm-add) 14%, transparent));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="add"] [data-rm="diff-sign"] {
  color: var(--rm-add-fg, var(--rm-add));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="del"] {
  background: var(--rm-del-bg, color-mix(in srgb, var(--rm-del) 14%, transparent));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="del"] [data-rm="diff-sign"] {
  color: var(--rm-del-fg, var(--rm-del));
}

/* States. */
[data-testid="review-map"] [data-rm="loading"],
[data-testid="review-map"] [data-rm="error"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="review-map"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  margin: auto;
  padding: 24px;
  text-align: center;
}

[data-testid="review-map"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="empty-hint"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}
`;function he(e=typeof document>"u"?void 0:document){if(e===void 0)return;let a=e.querySelector(`style[${ve}]`);if(a!==null)return a;let t=e.createElement("style");return t.setAttribute(ve,""),t.textContent=Ye,e.head.append(t),t}var l=require("react");async function re(e,a){let t=await e(a);if(!t.ok)throw new Error(`${a} answered ${String(t.status)}`);return await t.json()}function ye(e=fetch){return{async loadSnapshot(a,t){let n=new URLSearchParams({sessionId:a,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&n.set("base",t.baseRef),await re(e,`${W}/state?${n.toString()}`)},async loadDiff(a,t,n){let i=new URLSearchParams({sessionId:a,path:n,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&i.set("base",t.baseRef),await re(e,`${W}/diff?${i.toString()}`)},async loadIndex(a,t){let n=new URLSearchParams({sessionId:a,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&n.set("base",t.baseRef),await re(e,`${W}/index?${n.toString()}`)}}}var ge=Object.freeze({chunk:Q,id:`${H}/${Q}`}),be=null,N=null;function xe(e){be=e}function ke(){if(N!==null)return N;let e=be;if(e===null)return Promise.reject(new Error(`${H}: the loader require was not handed over`));let a=e.async(`./${ge.chunk}`).then(t=>{let n=t;if(n===null||typeof n.createMap!="function")throw new Error(`${H}: chunk ${ge.id} is missing createMap`);return n});return N=a,a.catch(()=>{N===a&&(N=null)}),a}function Se(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";case"untracked":return"U";case"conflicted":return"!";default:return"?"}}function ne(e){if(e.status==="conflicted")return{additions:null,deletions:null,note:"conflicted"};if(e.untracked)return{additions:null,deletions:null,note:"untracked"};if(e.binary)return{additions:null,deletions:null,note:"binary"};let a=e.additions!==null&&e.additions>0?e.additions:null,t=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:a,deletions:t,note:null}}function z(e,a){return a===0?"0":`${e==="+"?"+":"\u2212"}${String(a)}`}function ie(e){let a=[];return e.additions!==null&&a.push(`+${String(e.additions)}`),e.deletions!==null&&a.push(`\u2212${String(e.deletions)}`),a.join(" ")}function Ee(e){let a=e.lastIndexOf("/");return a<0?{dir:"",name:e}:{dir:e.slice(0,a+1),name:e.slice(a+1)}}function Ce(e){let a=t=>(t.additions??0)+(t.deletions??0);return[...e].sort((t,n)=>{let i=a(n)-a(t);return i!==0?i:t.path<n.path?-1:t.path>n.path?1:0})}function Me(e){let a=e.summary,t=a!==void 0&&a.files>0?a.files:e.files.length;if(a!==void 0&&a.files>0)return{files:t,additions:a.additions,deletions:a.deletions};let n=0,i=0;for(let s of e.files)n+=s.additions??0,i+=s.deletions??0;return{files:t,additions:n,deletions:i}}function Te(e){return e.slice(0,7)}function U(e,a){return e.replace(/\{(\w+)\}/gu,(t,n)=>a[n]??t)}function Ze(e){let a=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?a:`${a} ${e.heading}`}function Je(e){return e==="add"?"+":e==="del"?"\u2212":" "}function te(e,a,t,n){return{kind:"line",key:`${String(a??"x")}:${String(t??"x")}`,lineKind:e,oldLine:a,newLine:t,sign:Je(e),text:n}}function Ue(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((t,n)=>te("del",n+1,null,t));if(e.kind==="untracked")return e.lines.map((t,n)=>te("add",null,n+1,t));let a=[];for(let t of e.hunks){a.push({kind:"hunk",header:Ze(t)});for(let n of t.lines)a.push(te(n.kind,n.oldLine,n.newLine,n.text))}return a}function De(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Pe(e){let a=0,t=0;for(let n of e.changed)a+=n.additions??0,t+=n.deletions??0;return{additions:a,deletions:t,files:e.changed.length,newImports:e.imports.newImports,droppedImports:e.imports.droppedImports,unresolved:e.unresolved.count,partial:e.indexed.complete?null:{parsed:e.indexed.parsed,total:e.indexed.files},note:e.indexed.note,indexedFiles:e.indexed.files}}function Re(e){let a=e.lastIndexOf("/");return a<0?"":e.slice(0,a)}function Ie(e,a){let t=new Map(e.changed.map(o=>[o.path,o])),n=new Map,i=o=>{let p=n.get(o);return p!==void 0?{dirs:[...p.dirs],files:[...p.files]}:{dirs:[],files:[]}};for(let o of e.dirs){let p=i(o.path);n.set(o.path,{path:o.path,dirs:p.dirs,files:p.files})}n.has("")||n.set("",{path:"",dirs:[],files:[]});for(let o of e.dirs){if(o.path==="")continue;let p=Re(o.path),m=i(p);m.dirs.push({path:o.path,lines:o.lines,changed:o.changed>0,files:o.files,changedFiles:o.changed,additions:o.additions,deletions:o.deletions}),n.set(p,{path:p,dirs:m.dirs,files:m.files})}for(let o of e.files){let p=Re(o.path),m=i(p),u=t.get(o.path);m.files.push({path:o.path,lines:o.lines,changed:u!==void 0,...u===void 0?{}:{status:u.status,additions:u.additions,deletions:u.deletions,binary:u.binary||o.binary,hunks:u.hunks.map(b=>({newStart:b.newStart,newLines:b.newLines,oldLines:b.oldLines}))}}),n.set(p,{path:p,dirs:m.dirs,files:m.files})}for(let[o,p]of n)n.set(o,{path:o,dirs:[...p.dirs].sort((m,u)=>m.path<u.path?-1:m.path>u.path?1:0),files:[...p.files].sort((m,u)=>m.path<u.path?-1:m.path>u.path?1:0)});let s=new Set(e.changed.map(o=>o.path)),x=e.edges.filter(o=>s.has(o.from)||s.has(o.to)).map(o=>({from:o.from,to:o.to,state:o.state})),w={};for(let o of e.unresolved.files)w[o]=(w[o]??0)+1;return{levels:n,rootPath:"",edges:x,unresolvedFiles:w,indexed:{parsed:e.indexed.parsed,total:e.indexed.files,complete:e.indexed.complete,note:e.indexed.note}}}var r=require("react/jsx-runtime");function Le(e,a){switch(e){case"added":return a.statusAdded;case"modified":return a.statusModified;case"deleted":return a.statusDeleted;case"renamed":return a.statusRenamed;case"copied":return a.statusCopied;case"type-changed":return a.statusTypeChanged;case"untracked":return a.statusUntracked;case"conflicted":return a.statusConflicted;default:return a.statusUnknown}}function Qe(e,a){switch(e){case"not-a-repo":return a.errorNotARepo;case"no-base":return a.errorNoBase;case"no-session":return a.errorNoSession;case"too-large":return a.errorTooLarge;case"conflicted":return a.errorConflicted;case"unreadable":return a.errorUnreadable;default:return a.errorUnknown}}function ea(e,a){switch(e){case"conflicted":return a.detailErrorConflicted;case"too-large":return a.detailErrorTooLarge;case"unreadable":return a.detailErrorUnreadable;case"bad-request":return a.detailErrorBadRequest;default:return a.detailErrorUnknown}}function He(e,a){return e==="binary"?a.markBinary:e==="untracked"?a.markUntracked:e==="conflicted"?a.markConflicted:null}function aa({file:e,strings:a,selected:t,hovered:n,onSelect:i,onOpen:s,onHover:x,onKey:w}){let o=Ee(e.path),p=ne(e),m=He(p.note,a),u=e.status==="deleted",b=e.oldPath===void 0?void 0:U(a.renameHint,{path:e.oldPath});return(0,r.jsxs)("div",{"data-testid":"review-row","data-path":e.path,"data-status":e.status,"data-deleted":u?"true":void 0,"data-selected":t?"true":"false","data-hovered":n?"true":void 0,role:"option","aria-selected":t,tabIndex:t?0:-1,title:b,"aria-label":b,onClick:()=>{i(e.path),s(e.path)},onKeyDown:P=>w(P,e.path),onPointerEnter:()=>x(e.path),onPointerLeave:()=>x(null),children:[(0,r.jsx)("span",{"data-rm":"mark","data-status":e.status,title:Le(e.status,a),children:Se(e.status)}),(0,r.jsxs)("span",{"data-rm":"path",children:[o.dir===""?null:(0,r.jsx)("span",{"data-rm":"path-dir",children:o.dir}),(0,r.jsx)("span",{"data-rm":"path-name",className:u?"rm-struck":void 0,children:o.name})]}),(0,r.jsx)("span",{"data-rm":"churn","data-note":p.note??void 0,children:m??ie(p)})]})}function ra({path:e,file:a,phase:t,strings:n,onClose:i,bodyRef:s}){let x=a===void 0?void 0:ne(a),w=x===void 0?null:He(x.note,n);return(0,r.jsxs)("div",{"data-testid":"review-detail","data-rm":"detail",children:[(0,r.jsxs)("div",{"data-rm":"detail-header",children:[(0,r.jsx)("span",{"data-rm":"detail-path",children:e}),a===void 0?null:(0,r.jsx)("span",{"data-rm":"detail-status",children:Le(a.status,n)}),x===void 0||w!==null?null:(0,r.jsx)("span",{"data-rm":"detail-churn",children:ie(x)}),(0,r.jsx)("button",{type:"button","data-rm":"detail-close","aria-label":n.detailClose,onClick:i,children:"\xD7"})]}),(0,r.jsxs)("div",{"data-rm":"detail-body",ref:s,children:[t.kind==="loading"?(0,r.jsx)("p",{"data-rm":"detail-loading",children:n.loading}):null,t.kind==="error"?(0,r.jsx)("p",{"data-rm":"detail-error",children:ea(t.code,n)}):null,t.kind==="ready"?(0,r.jsx)(ta,{diff:t.diff,strings:n}):null]})]})}function ta({diff:e,strings:a}){if(e.kind==="binary"){let n=e.bytes===null?a.detailUnknownSize:De(e.bytes);return(0,r.jsx)("p",{"data-rm":"detail-binary",children:U(a.detailBinary,{size:n})})}let t=Ue(e);return t.length===0?(0,r.jsx)("p",{"data-rm":"detail-empty",children:a.detailEmpty}):(0,r.jsxs)(r.Fragment,{children:[e.kind==="text"&&e.truncated?(0,r.jsx)("p",{"data-rm":"detail-truncated",children:a.detailTruncated}):null,(0,r.jsx)("div",{"data-rm":"diff",children:t.map(n=>n.kind==="hunk"?(0,r.jsx)("div",{"data-rm":"diff-hunk",children:n.header},`hunk:${n.header}`):(0,r.jsxs)("div",{"data-rm":"diff-line","data-kind":n.lineKind,children:[(0,r.jsx)("span",{"data-rm":"diff-old",children:n.oldLine??""}),(0,r.jsx)("span",{"data-rm":"diff-new",children:n.newLine??""}),(0,r.jsx)("span",{"data-rm":"diff-sign",children:n.sign}),(0,r.jsx)("span",{"data-rm":"diff-text",children:n.text})]},n.key))})]})}function Be({strings:e,runtime:a=ye(),mapLoader:t=ke}){return function({sessionId:i}){let[s,x]=(0,l.useState)("worktree"),[w,o]=(0,l.useState)({kind:"idle"}),[p,m]=(0,l.useState)(void 0),[u,b]=(0,l.useState)(void 0),[P,E]=(0,l.useState)(void 0),[I,C]=(0,l.useState)({kind:"idle"}),[A,de]=(0,l.useState)(null),B=(0,l.useRef)(0),M=(0,l.useRef)(0),L=(0,l.useRef)(0),oe=(0,l.useRef)(null),F=(0,l.useRef)(null),j=(0,l.useRef)(i),G=(0,l.useRef)(null),$=(0,l.useCallback)((d,f)=>{B.current+=1;let c=B.current;o({kind:"loading"});let y=f==="branch"?{kind:"branch"}:{kind:"worktree"};a.loadSnapshot(d,y).then(k=>{B.current===c&&o(k.ok?{kind:"ready",snapshot:k.snapshot}:{kind:"error",code:k.error.code})},()=>{B.current===c&&o({kind:"error",code:"unreadable"})})},[a]),X=(0,l.useCallback)((d,f,c)=>{M.current+=1;let y=M.current;b(c),E({kind:"loading",path:c});let k=f==="branch"?{kind:"branch"}:{kind:"worktree"};a.loadDiff(d,k,c).then(S=>{M.current===y&&E(S.ok?{kind:"ready",diff:S.diff}:{kind:"error",code:S.error.code})},()=>{M.current===y&&E({kind:"error",code:"unreadable"})})},[a]),O=(0,l.useCallback)((d,f)=>{let c=a.loadIndex;if(c===void 0){C({kind:"idle"});return}L.current+=1;let y=L.current;C({kind:"loading"});let k=f==="branch"?{kind:"branch"}:{kind:"worktree"};c.call(a,d,k).then(S=>{L.current===y&&C(S.ok?{kind:"ready",index:S.index}:{kind:"error",code:S.error.code})},()=>{L.current===y&&C({kind:"error",code:"unreadable"})})},[a]);(0,l.useEffect)(()=>{if(i===void 0||i===""){B.current+=1,M.current+=1,L.current+=1,j.current=i,o({kind:"idle"}),C({kind:"idle"}),m(void 0),b(void 0),E(void 0);return}if(j.current!==i){j.current=i,x("worktree"),M.current+=1,b(void 0),E(void 0),m(void 0),$(i,"worktree"),O(i,"worktree");return}$(i,s),O(i,s)},[i,s,$,O]),(0,l.useEffect)(()=>{G.current!==null&&(G.current.scrollTop=0)},[u,P?.kind==="ready"?P.diff.path:""]);let v=(0,l.useMemo)(()=>({statNewImports:e.statNewImports??"New imports",statDroppedImports:e.statDroppedImports??"Dropped imports",indexPartial:e.indexPartial??"indexed {parsed}/{total}",unresolved:e.unresolved??"\u2265{count} unresolved (incl. external)",unresolvedHint:e.unresolvedHint??"External packages and dynamic imports are counted here and are not drawn as edges.",mapTitle:e.mapTitle??"Directory map",mapLoading:e.mapLoading??"Indexing the map",mapEmpty:e.mapEmpty??"No structure to lay out",mapError:e.mapError??"The map index failed",flowImports:e.flowImports??"imports",flowImportedBy:e.flowImportedBy??"imported by",flowUnresolved:e.flowUnresolved??"unresolved",mapUnresolved:e.mapUnresolved??"\u2265{count} unresolved",mapPartial:e.mapPartial??"indexed {parsed}/{total}"}),[e.statNewImports,e.statDroppedImports,e.indexPartial,e.unresolved,e.mapTitle,e.mapLoading,e.mapEmpty,e.mapError,e.flowImports,e.flowImportedBy,e.flowUnresolved,e.mapUnresolved,e.mapPartial]),T=I.kind==="ready"?I.index:void 0,V=(w.kind==="ready"?w.snapshot.repo:void 0)??e.repoFallback,le=(0,l.useCallback)(d=>{i===void 0||i===""||(m(d),X(i,s,d))},[i,s,X]),se=(0,l.useCallback)(d=>{de(d)},[]);(0,l.useEffect)(()=>{let d=oe.current;if(d===null||T===void 0||T.files.length===0)return;let f=!1,c=null;return t().then(y=>{if(f)return;let k=y.createMap;c=k(d,Ie(T,V),{onOpenFile:le,onHover:se},{title:V,strings:{imports:v.flowImports,importedBy:v.flowImportedBy,unresolved:v.flowUnresolved,unresolvedTemplate:v.mapUnresolved,partialTemplate:v.mapPartial}}),F.current=c},()=>{f||C({kind:"error",code:"unreadable"})}),()=>{f=!0,c?.destroy(),F.current===c&&(F.current=null)}},[T,V,t,le,se,v]);let Ae=(0,l.useCallback)(d=>{de(d),F.current?.setHighlight(d)},[]);(0,l.useEffect)(()=>{if(A===null)return;let d=document.querySelector(`[data-testid="review-row"][data-path="${CSS.escape(A)}"]`);if(d===null)return;let f=d.closest('[data-rm="list"]');if(f===null)return;let c=d.getBoundingClientRect(),y=f.getBoundingClientRect();c.top>=y.top&&c.bottom<=y.bottom||d.scrollIntoView({block:"nearest"})},[A]);let pe=d=>{d!==s&&(M.current+=1,L.current+=1,C({kind:"loading"}),b(void 0),E(void 0),m(void 0),x(d))},$e=()=>{i===void 0||i===""||($(i,s),O(i,s))},Oe=i!==void 0&&i!=="",g=T===void 0?void 0:Pe(T),h=w.kind==="ready"?w.snapshot:void 0,q=h===void 0?void 0:Me(h),R=h===void 0?[]:Ce(h.files),Ve=h===void 0?void 0:h.scope==="branch"&&h.baseRef!==null?U(e.listMetaBranch,{base:Te(h.baseRef)}):e.listMetaWorktree,me=R.some(d=>d.path===p)?p:R[0]?.path,ue=u===void 0?void 0:R.find(d=>d.path===u),Y=ue===void 0?void 0:u,ce=d=>{i===void 0||i===""||d!==u&&X(i,s,d)},fe=d=>{if(R.length===0)return;let f=R.findIndex(S=>S.path===me),c=Math.min(R.length-1,Math.max(0,(f<0?0:f)+d)),y=R[c];if(y===void 0)return;m(y.path),document.querySelector(`[data-testid="review-row"][data-path="${CSS.escape(y.path)}"]`)?.focus()},qe=(d,f)=>{if(d.key==="Enter"||d.key===" "){d.preventDefault(),m(f),ce(f);return}if(d.key==="Escape"){if(u!==void 0){d.preventDefault(),b(void 0),E(void 0);return}F.current?.up()===!0&&d.preventDefault();return}if(d.key==="ArrowDown"){d.preventDefault(),fe(1);return}d.key==="ArrowUp"&&(d.preventDefault(),fe(-1))};return(0,r.jsxs)("div",{"data-testid":"review-map","data-conversation-composer-overlay":"",children:[(0,r.jsxs)("div",{"data-rm":"header",children:[(0,r.jsx)("h2",{"data-rm":"title",children:e.title}),(0,r.jsx)("span",{"data-rm":"repo-name",children:h?.repo??e.repoFallback}),h===void 0?null:(0,r.jsxs)("span",{"data-rm":"head","data-head-kind":h.head.kind,children:[h.head.kind==="branch"?h.head.ref:"HEAD"," ",h.head.shortHash]}),(0,r.jsxs)("span",{"data-rm":"scope",role:"group",children:[(0,r.jsx)("button",{type:"button","data-rm":"scope-worktree","aria-pressed":s==="worktree",onClick:()=>pe("worktree"),children:e.scopeWorktree}),(0,r.jsx)("button",{type:"button","data-rm":"scope-branch","aria-pressed":s==="branch",onClick:()=>pe("branch"),children:e.scopeBranch})]}),(0,r.jsx)("button",{type:"button","data-rm":"refresh",onClick:$e,disabled:!Oe,children:e.refresh})]}),w.kind==="idle"?(0,r.jsxs)("div",{"data-rm":"empty",children:[(0,r.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,r.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,w.kind==="loading"?(0,r.jsx)("p",{"data-rm":"loading",children:e.loading}):null,w.kind==="error"?(0,r.jsx)("p",{"data-rm":"error",children:Qe(w.code,e)}):null,h!==void 0&&q!==void 0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{"data-rm":"stats",children:[(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"lines",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:e.statLines}),(0,r.jsxs)("span",{"data-rm":"stat-value",children:[(0,r.jsx)("span",{"data-rm":"stat-add",children:z("+",g?.additions??q.additions)})," ",(0,r.jsx)("span",{"data-rm":"stat-del",children:z("-",g?.deletions??q.deletions)})]})]}),(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"files",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:e.statFiles}),(0,r.jsx)("span",{"data-rm":"stat-value",children:g?.files??q.files}),(0,r.jsx)("span",{"data-rm":"uncommitted",children:U(e.uncommitted,{count:String(h.uncommitted)})})]}),g===void 0?null:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"new-imports",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:v.statNewImports}),(0,r.jsx)("span",{"data-rm":"stat-value","data-rm-value":"new-imports",children:z("+",g.newImports)})]}),(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"dropped-imports",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:v.statDroppedImports}),(0,r.jsx)("span",{"data-rm":"stat-value","data-rm-value":"dropped-imports",children:z("-",g.droppedImports)}),g.unresolved>0?(0,r.jsx)("span",{"data-rm":"unresolved","data-count":g.unresolved,title:v.unresolvedHint,children:U(v.unresolved,{count:String(g.unresolved)})}):null,g.partial===null?null:(0,r.jsx)("span",{"data-rm":"index-partial","data-parsed":g.partial.parsed,"data-total":g.partial.total,title:g.note??void 0,children:U(v.indexPartial,{parsed:String(g.partial.parsed),total:String(g.partial.total)})})]})]})]}),(0,r.jsxs)("div",{"data-rm":"split","data-open":Y===void 0?"false":"true",children:[(0,r.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,children:[(0,r.jsxs)("div",{"data-rm":"list-meta",children:[(0,r.jsx)("span",{"data-rm":"list-scope",children:Ve}),(0,r.jsx)("span",{"data-rm":"list-sort",children:e.listSort})]}),R.length===0?(0,r.jsx)("p",{"data-rm":"list-empty",children:e.listEmpty}):R.map(d=>(0,r.jsx)(aa,{file:d,strings:e,selected:d.path===me,hovered:d.path===A,onSelect:m,onOpen:ce,onHover:Ae,onKey:qe},d.path))]}),(0,r.jsxs)("div",{"data-rm":"map-pane","data-state":I.kind,"aria-label":v.mapTitle,role:"group",children:[(0,r.jsxs)("p",{"data-rm":"map-title",children:[(0,r.jsx)("span",{"data-rm":"map-title-label",children:v.mapTitle})," ",(0,r.jsx)("span",{"data-rm":"map-title-repo",children:V})]}),I.kind==="loading"?(0,r.jsx)("p",{"data-rm":"map-loading",children:v.mapLoading}):null,I.kind==="error"?(0,r.jsx)("p",{"data-rm":"map-error",children:v.mapError}):null,I.kind==="ready"&&(T?.files.length??0)===0?(0,r.jsx)("p",{"data-rm":"map-empty",children:v.mapEmpty}):null,(0,r.jsx)("div",{"data-rm":"map-host",ref:oe})]}),Y===void 0||P===void 0?null:(0,r.jsx)(ra,{path:Y,file:ue,phase:P,strings:e,bodyRef:G,onClose:()=>{b(void 0),E(void 0)}})]})]}):null]})}}var Fe=["slots","locale"],_,D;function ia(e){let a=e.locale.getSnapshot?.();return typeof a?.active=="string"?a.active:"zh"}function Ne(e){he();let a=e.locale.bind(K);_?.();let t=e.locale.register(K,{zh:ee,en:ae});_=t;let n=Be({strings:{title:a("review-map.tabTitle"),repoFallback:a("review-map.repoFallback"),scopeWorktree:a("review-map.scopeWorktree"),scopeBranch:a("review-map.scopeBranch"),refresh:a("review-map.refresh"),statLines:a("review-map.statLines"),statFiles:a("review-map.statFiles"),statNewImports:a("review-map.statNewImports"),statDroppedImports:a("review-map.statDroppedImports"),indexPartial:a("review-map.indexPartial"),unresolved:a("review-map.unresolved"),unresolvedHint:a("review-map.unresolvedHint"),mapTitle:a("review-map.mapTitle"),mapLoading:a("review-map.mapLoading"),mapEmpty:a("review-map.mapEmpty"),mapError:a("review-map.mapError"),flowImports:a("review-map.flowImports"),flowImportedBy:a("review-map.flowImportedBy"),flowUnresolved:a("review-map.flowUnresolved"),mapUnresolved:a("review-map.mapUnresolved"),mapPartial:a("review-map.mapPartial"),uncommitted:a("review-map.uncommitted"),listMetaWorktree:a("review-map.listMetaWorktree"),listMetaBranch:a("review-map.listMetaBranch"),listSort:a("review-map.listSort"),listEmpty:a("review-map.listEmpty"),markBinary:a("review-map.markBinary"),markUntracked:a("review-map.markUntracked"),markConflicted:a("review-map.markConflicted"),renameHint:a("review-map.renameHint"),statusAdded:a("review-map.statusAdded"),statusModified:a("review-map.statusModified"),statusDeleted:a("review-map.statusDeleted"),statusRenamed:a("review-map.statusRenamed"),statusCopied:a("review-map.statusCopied"),statusTypeChanged:a("review-map.statusTypeChanged"),statusUntracked:a("review-map.statusUntracked"),statusConflicted:a("review-map.statusConflicted"),statusUnknown:a("review-map.statusUnknown"),errorNotARepo:a("review-map.errorNotARepo"),errorNoBase:a("review-map.errorNoBase"),errorNoSession:a("review-map.errorNoSession"),errorTooLarge:a("review-map.errorTooLarge"),errorConflicted:a("review-map.errorConflicted"),errorUnreadable:a("review-map.errorUnreadable"),errorUnknown:a("review-map.errorUnknown"),loading:a("review-map.loading"),empty:a("review-map.empty"),emptyHint:a("review-map.emptyHint"),detailClose:a("review-map.detailClose"),detailTruncated:a("review-map.detailTruncated"),detailBinary:a("review-map.detailBinary"),detailUnknownSize:a("review-map.detailUnknownSize"),detailEmpty:a("review-map.detailEmpty"),detailErrorConflicted:a("review-map.detailErrorConflicted"),detailErrorTooLarge:a("review-map.detailErrorTooLarge"),detailErrorUnreadable:a("review-map.detailErrorUnreadable"),detailErrorBadRequest:a("review-map.detailErrorBadRequest"),detailErrorUnknown:a("review-map.detailErrorUnknown")}}),i;return e.slots.inject(J,()=>{D?.();let s=e.slots.register({name:J,id:we,order:140,label:()=>ia(e).startsWith("zh")?ee["review-map.tabTitle"]:ae["review-map.tabTitle"],locale:K},n);return D=s,i=s,()=>{s(),D===s&&(D=void 0)}}),()=>{i!==void 0&&D===i&&(D(),D=void 0),i=void 0,_===t&&(t(),_=void 0)}}var ze={name:H,inject:Fe,apply:Ne},da=ze;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
