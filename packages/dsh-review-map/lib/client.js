window.__ModuleLoader__.load({
  id: "dsh-review-map",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var G=Object.defineProperty;var Ae=Object.getOwnPropertyDescriptor;var $e=Object.getOwnPropertyNames;var Ve=Object.prototype.hasOwnProperty;var Oe=(a,e)=>{for(var t in e)G(a,t,{get:e[t],enumerable:!0})},qe=(a,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of $e(e))!Ve.call(a,i)&&i!==t&&G(a,i,{get:()=>e[i],enumerable:!(n=Ae(e,i))||n.enumerable});return a};var Ke=a=>qe(G({},"__esModule",{value:!0}),a);var ra={};Oe(ra,{apply:()=>Fe,boot:()=>ve,clientPlugin:()=>Ie,default:()=>aa,inject:()=>Ue});module.exports=Ke(ra);var F="dsh-review-map",X="conversation.view",me="review-map";var $="review-map",V="/review-map/api",Y="client.map.js";var Z={"review-map.tabTitle":"\u8BC4\u5BA1","review-map.repoFallback":"\u672A\u77E5\u4ED3\u5E93","review-map.scopeWorktree":"\u672A\u63D0\u4EA4","review-map.scopeBranch":"\u5206\u652F\u5BF9\u6BD4","review-map.refresh":"\u91CD\u65B0\u8BFB\u53D6","review-map.statLines":"\u6E90\u7801\u884C","review-map.statFiles":"\u6539\u52A8\u6587\u4EF6","review-map.statNewImports":"\u65B0\u589E\u5BFC\u5165","review-map.statDroppedImports":"\u4E22\u5931\u5BFC\u5165","review-map.indexPartial":"\u7D22\u5F15 {parsed}/{total}","review-map.unresolved":"\u2265{count} \u672A\u89E3\u6790","review-map.mapTitle":"\u76EE\u5F55\u5730\u56FE","review-map.mapLoading":"\u5730\u56FE\u7D22\u5F15\u4E2D","review-map.mapEmpty":"\u6CA1\u6709\u53EF\u94FA\u5F00\u7684\u7ED3\u6784","review-map.mapError":"\u5730\u56FE\u7D22\u5F15\u5931\u8D25","review-map.uncommitted":"\u672A\u63D0\u4EA4 {count}","review-map.listMetaWorktree":"\u672A\u63D0\u4EA4\u6539\u52A8","review-map.listMetaBranch":"\u5BF9\u6BD4 {base}","review-map.listSort":"\u6309\u53D8\u66F4\u91CF\u6392\u5E8F","review-map.listEmpty":"\u5DE5\u4F5C\u533A\u6CA1\u6709\u53D8\u66F4","review-map.renameHint":"\u539F\u8DEF\u5F84 {path}","review-map.markBinary":"\u4E8C\u8FDB\u5236","review-map.markUntracked":"\u672A\u8DDF\u8E2A","review-map.markConflicted":"\u51B2\u7A81","review-map.statusAdded":"\u65B0\u589E","review-map.statusModified":"\u4FEE\u6539","review-map.statusDeleted":"\u5220\u9664","review-map.statusRenamed":"\u91CD\u547D\u540D","review-map.statusCopied":"\u590D\u5236","review-map.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","review-map.statusUntracked":"\u672A\u8DDF\u8E2A","review-map.statusConflicted":"\u51B2\u7A81","review-map.statusUnknown":"\u672A\u77E5","review-map.loading":"\u52A0\u8F7D\u4E2D","review-map.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u53D8\u66F4","review-map.emptyHint":"\u8BC4\u5BA1\u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u53D8\u66F4\u8303\u56F4\u94FA\u5F00\u3002","review-map.detailClose":"\u5173\u95ED\u8BE6\u60C5","review-map.detailTruncated":"\u5DF2\u622A\u65AD","review-map.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","review-map.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","review-map.detailEmpty":"\u8BE5\u6587\u4EF6\u6CA1\u6709\u53EF\u663E\u793A\u7684\u5DEE\u5F02","review-map.detailErrorConflicted":"\u6587\u4EF6\u6709\u672A\u89E3\u51B3\u7684\u51B2\u7A81","review-map.detailErrorTooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u5DF2\u8DF3\u8FC7","review-map.detailErrorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.detailErrorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u6587\u4EF6","review-map.detailErrorUnknown":"\u8BFB\u53D6\u8BE5\u6587\u4EF6\u65F6\u51FA\u9519","review-map.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","review-map.errorNoBase":"\u4ED3\u5E93\u6CA1\u6709\u53EF\u6BD4\u57FA\u7EBF","review-map.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","review-map.errorTooLarge":"\u53D8\u66F4\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","review-map.errorConflicted":"\u8BE5\u6587\u4EF6\u5904\u4E8E\u51B2\u7A81\u4E2D","review-map.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.errorUnknown":"\u8BFB\u53D6\u53D8\u66F4\u65F6\u51FA\u9519"},J={"review-map.tabTitle":"Review","review-map.repoFallback":"Unknown repository","review-map.scopeWorktree":"Uncommitted","review-map.scopeBranch":"Branch","review-map.refresh":"Refresh","review-map.statLines":"Source lines","review-map.statFiles":"Files changed","review-map.statNewImports":"New imports","review-map.statDroppedImports":"Dropped imports","review-map.indexPartial":"indexed {parsed}/{total}","review-map.unresolved":"\u2265{count} unresolved","review-map.mapTitle":"Directory map","review-map.mapLoading":"Indexing the map","review-map.mapEmpty":"No structure to lay out","review-map.mapError":"The map index failed","review-map.uncommitted":"{count} uncommitted","review-map.listMetaWorktree":"Uncommitted changes","review-map.listMetaBranch":"Against {base}","review-map.listSort":"Sorted by churn","review-map.listEmpty":"No changes in this workspace","review-map.renameHint":"was {path}","review-map.markBinary":"binary","review-map.markUntracked":"untracked","review-map.markConflicted":"conflict","review-map.statusAdded":"added","review-map.statusModified":"modified","review-map.statusDeleted":"deleted","review-map.statusRenamed":"renamed","review-map.statusCopied":"copied","review-map.statusTypeChanged":"type changed","review-map.statusUntracked":"untracked","review-map.statusConflicted":"conflicted","review-map.statusUnknown":"unknown","review-map.loading":"Loading","review-map.empty":"Select a session to load its changes","review-map.emptyHint":"The review map will lay the change set out here.","review-map.detailClose":"Close the detail","review-map.detailTruncated":"Truncated","review-map.detailBinary":"Binary file, {size}","review-map.detailUnknownSize":"size unknown","review-map.detailEmpty":"This file has no diff to show","review-map.detailErrorConflicted":"This file has an unresolved conflict","review-map.detailErrorTooLarge":"This file is too large and was skipped","review-map.detailErrorUnreadable":"The read failed","review-map.detailErrorBadRequest":"This file cannot be read","review-map.detailErrorUnknown":"Something went wrong reading this file","review-map.errorNotARepo":"This directory is not a git repository","review-map.errorNoBase":"This repository has no baseline to compare against","review-map.errorNoSession":"This session has no workspace","review-map.errorTooLarge":"The change is too large to read in full","review-map.errorConflicted":"This file is in conflict","review-map.errorUnreadable":"The read failed","review-map.errorUnknown":"Something went wrong reading the changes"};var ce="data-dsh-review-map",We=`[data-testid="review-map"] {
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

/* The directory map. Scoped to its own data-rm namespace rather than to the tab,
   because the map is mounted by the lazy chunk into a host the view owns and
   must not need the tab's wrapper to be styled. Colours are host tokens with a
   hex fallback: the map has to survive a host that ships no palette at all. */
[data-rm="map-root"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary, #14110d);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);

  /* The map's own state colours, derived from host tokens so a theme switch
     moves them without a second block of rules. */
  --rm-map-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-map-del: var(--dsw-alias-state-error-primary, #cf222e);
  --rm-map-warn: var(--dsw-alias-state-warning-primary, #bf8700);
  --rm-map-surface: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
  --rm-map-surface-strong: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.07));
  --rm-map-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
  --rm-map-muted: var(--dsw-alias-label-tertiary, #a39c91);
  --rm-map-secondary: var(--dsw-alias-label-secondary, #6b655c);
}

/* Breadcrumb: one button per level, root first. */
[data-rm="map-breadcrumb"] {
  flex: none;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 26px;
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: max(9px, var(--dsh-code-font-size, 11px));
}

[data-rm="map-crumb"] {
  font: inherit;
  padding: 1px 6px;
  color: var(--rm-map-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

[data-rm="map-crumb"]:hover {
  background: var(--rm-map-surface);
}

[data-rm="map-crumb"][data-current="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

/* The crumb that holds a highlighted target the map has not drilled into. */
[data-rm="map-crumb"][data-breadcrumb-target="true"] {
  border-color: var(--rm-map-warn);
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-root"] svg {
  flex: 1 1 auto;
  min-height: 0;
  display: block;
  width: 100%;
}

/* Cards. The rect carries the surface; the group carries the identity. */
[data-rm="map-tile"] {
  cursor: pointer;
}

[data-rm="map-tile-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
}

/* A changed card is drawn on a stronger surface and a heavier border: the map
   must show what changed before it shows what did not. */
[data-rm="map-tile-rect"][data-changed="true"] {
  fill: var(--rm-map-surface-strong);
  stroke: var(--rm-map-secondary);
  stroke-width: 1;
}

[data-rm="map-tile"]:hover [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-tile"][data-highlighted="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 2;
}

/* Status: colour and shape, both. The dash patterns are the shape channel, so a
   greyscale render still separates the states; the fills are the colour one. */
[data-rm="map-tile-rect"][data-status="added"] {
  fill: color-mix(in srgb, var(--rm-map-add) 16%, transparent);
  stroke: var(--rm-map-add);
}

[data-rm="map-tile-rect"][data-status="modified"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 14%, transparent);
  stroke: var(--rm-map-warn);
}

[data-rm="map-tile-rect"][data-status="deleted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 16%, transparent);
  stroke: var(--rm-map-del);
  stroke-dasharray: 4 2;
}

[data-rm="map-tile-rect"][data-status="untracked"] {
  fill: color-mix(in srgb, var(--rm-map-add) 8%, transparent);
  stroke: var(--rm-map-add);
  stroke-dasharray: 1 2;
}

[data-rm="map-tile-rect"][data-status="conflicted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 10%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 2 1 4 1;
}

[data-rm="map-tile-rect"][data-status="renamed"],
[data-rm="map-tile-rect"][data-status="copied"] {
  fill: color-mix(in srgb, var(--rm-map-secondary) 10%, transparent);
  stroke: var(--rm-map-secondary);
  stroke-dasharray: 6 2;
}

[data-rm="map-tile-rect"][data-status="type-changed"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 8%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 1 3;
}

/* A deleted card is struck through as well as dashed: the dash says "gone" at a
   glance, the strike says it again on the label, and neither depends on colour. */
[data-rm="map-tile"][data-deleted="true"] [data-rm="map-file-name"] {
  text-decoration: line-through;
  fill: var(--rm-map-muted);
}

/* Text. 9px is the floor: below it a label is a smudge, and the renderer drops
   the text entirely rather than drawing something unreadable. */
[data-rm="map-root"] text {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: 9px;
  fill: var(--dsw-alias-label-primary, #14110d);
  pointer-events: none;
}

[data-rm="map-dir-name"] {
  font-weight: 600;
}

[data-rm="map-dir-reading"],
[data-rm="map-file-churn"] {
  fill: var(--rm-map-secondary);
}

[data-rm="map-dir-reading"][data-pending="true"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}

[data-rm="map-file-mark"][data-status="added"] {
  fill: var(--rm-map-add);
}

[data-rm="map-file-mark"][data-status="deleted"] {
  fill: var(--rm-map-del);
}

[data-rm="map-file-mark"][data-status="conflicted"] {
  fill: var(--rm-map-warn);
}

/* The distribution bar: where in the file the edits landed. */
[data-rm="map-bar-seg"][data-kind="add"] {
  fill: var(--rm-map-add);
}

[data-rm="map-bar-seg"][data-kind="del"] {
  fill: var(--rm-map-del);
}

/* The aggregate marker a capped level shows instead of silently dropping files. */
[data-rm="map-overflow-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-dasharray: 2 2;
  stroke-width: 0.5;
}

[data-rm="map-overflow-text"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}
`;function ue(a=typeof document>"u"?void 0:document){if(a===void 0)return;let e=a.querySelector(`style[${ce}]`);if(e!==null)return e;let t=a.createElement("style");return t.setAttribute(ce,""),t.textContent=We,a.head.append(t),t}var p=require("react");async function Q(a,e){let t=await a(e);if(!t.ok)throw new Error(`${e} answered ${String(t.status)}`);return await t.json()}function fe(a=fetch){return{async loadSnapshot(e,t){let n=new URLSearchParams({sessionId:e,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&n.set("base",t.baseRef),await Q(a,`${V}/state?${n.toString()}`)},async loadDiff(e,t,n){let i=new URLSearchParams({sessionId:e,path:n,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&i.set("base",t.baseRef),await Q(a,`${V}/diff?${i.toString()}`)},async loadIndex(e,t){let n=new URLSearchParams({sessionId:e,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&n.set("base",t.baseRef),await Q(a,`${V}/index?${n.toString()}`)}}}var we=Object.freeze({chunk:Y,id:`${F}/${Y}`}),he=null,z=null;function ve(a){he=a}function ye(){if(z!==null)return z;let a=he;if(a===null)return Promise.reject(new Error(`${F}: the loader require was not handed over`));let e=a.async(`./${we.chunk}`).then(t=>{let n=t;if(n===null||typeof n.createMap!="function")throw new Error(`${F}: chunk ${we.id} is missing createMap`);return n});return z=e,e.catch(()=>{z===e&&(z=null)}),e}function be(a){switch(a){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";case"untracked":return"U";case"conflicted":return"!";default:return"?"}}function ae(a){if(a.status==="conflicted")return{additions:null,deletions:null,note:"conflicted"};if(a.untracked)return{additions:null,deletions:null,note:"untracked"};if(a.binary)return{additions:null,deletions:null,note:"binary"};let e=a.additions!==null&&a.additions>0?a.additions:null,t=a.deletions!==null&&a.deletions>0?a.deletions:null;return{additions:e,deletions:t,note:null}}function re(a){let e=[];return a.additions!==null&&e.push(`+${String(a.additions)}`),a.deletions!==null&&e.push(`\u2212${String(a.deletions)}`),e.join(" ")}function ke(a){let e=a.lastIndexOf("/");return e<0?{dir:"",name:a}:{dir:a.slice(0,e+1),name:a.slice(e+1)}}function xe(a){let e=t=>(t.additions??0)+(t.deletions??0);return[...a].sort((t,n)=>{let i=e(n)-e(t);return i!==0?i:t.path<n.path?-1:t.path>n.path?1:0})}function Re(a){let e=a.summary,t=e!==void 0&&e.files>0?e.files:a.files.length;if(e!==void 0&&e.files>0)return{files:t,additions:e.additions,deletions:e.deletions};let n=0,i=0;for(let d of a.files)n+=d.additions??0,i+=d.deletions??0;return{files:t,additions:n,deletions:i}}function Se(a){return a.slice(0,7)}function T(a,e){return a.replace(/\{(\w+)\}/gu,(t,n)=>e[n]??t)}function _e(a){let e=`@@ -${String(a.oldStart)},${String(a.oldLines)} +${String(a.newStart)},${String(a.newLines)} @@`;return a.heading===void 0||a.heading===""?e:`${e} ${a.heading}`}function je(a){return a==="add"?"+":a==="del"?"\u2212":" "}function ee(a,e,t,n){return{kind:"line",key:`${String(e??"x")}:${String(t??"x")}`,lineKind:a,oldLine:e,newLine:t,sign:je(a),text:n}}function Ee(a){if(a.kind==="binary")return[];if(a.kind==="deleted")return a.lines.map((t,n)=>ee("del",n+1,null,t));if(a.kind==="untracked")return a.lines.map((t,n)=>ee("add",null,n+1,t));let e=[];for(let t of a.hunks){e.push({kind:"hunk",header:_e(t)});for(let n of t.lines)e.push(ee(n.kind,n.oldLine,n.newLine,n.text))}return e}function Ce(a){return a<1024?`${String(a)} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:`${(a/(1024*1024)).toFixed(1)} MB`}function Me(a){let e=0,t=0;for(let n of a.changed)e+=n.additions??0,t+=n.deletions??0;return{additions:e,deletions:t,files:a.changed.length,newImports:a.imports.newImports,droppedImports:a.imports.droppedImports,unresolved:a.unresolved.count,partial:a.indexed.complete?null:{parsed:a.indexed.parsed,total:a.indexed.files},note:a.indexed.note,indexedFiles:a.indexed.files}}function ge(a){let e=a.lastIndexOf("/");return e<0?"":a.slice(0,e)}function Te(a,e){let t=new Map(a.changed.map(d=>[d.path,d])),n=new Map,i=d=>{let s=n.get(d);return s!==void 0?{dirs:[...s.dirs],files:[...s.files]}:{dirs:[],files:[]}};for(let d of a.dirs){let s=i(d.path);n.set(d.path,{path:d.path,dirs:s.dirs,files:s.files})}n.has("")||n.set("",{path:"",dirs:[],files:[]});for(let d of a.dirs){if(d.path==="")continue;let s=ge(d.path),l=i(s);l.dirs.push({path:d.path,lines:d.lines,changed:d.changed>0,files:d.files,changedFiles:d.changed,additions:d.additions,deletions:d.deletions}),n.set(s,{path:s,dirs:l.dirs,files:l.files})}for(let d of a.files){let s=ge(d.path),l=i(s),m=t.get(d.path);l.files.push({path:d.path,lines:d.lines,changed:m!==void 0,...m===void 0?{}:{status:m.status,additions:m.additions,deletions:m.deletions,binary:m.binary||d.binary,hunks:m.hunks.map(y=>({newStart:y.newStart,newLines:y.newLines,oldLines:y.oldLines}))}}),n.set(s,{path:s,dirs:l.dirs,files:l.files})}for(let[d,s]of n)n.set(d,{path:d,dirs:[...s.dirs].sort((l,m)=>l.path<m.path?-1:l.path>m.path?1:0),files:[...s.files].sort((l,m)=>l.path<m.path?-1:l.path>m.path?1:0)});return{levels:n,rootPath:""}}var r=require("react/jsx-runtime");function De(a,e){switch(a){case"added":return e.statusAdded;case"modified":return e.statusModified;case"deleted":return e.statusDeleted;case"renamed":return e.statusRenamed;case"copied":return e.statusCopied;case"type-changed":return e.statusTypeChanged;case"untracked":return e.statusUntracked;case"conflicted":return e.statusConflicted;default:return e.statusUnknown}}function Ge(a,e){switch(a){case"not-a-repo":return e.errorNotARepo;case"no-base":return e.errorNoBase;case"no-session":return e.errorNoSession;case"too-large":return e.errorTooLarge;case"conflicted":return e.errorConflicted;case"unreadable":return e.errorUnreadable;default:return e.errorUnknown}}function Xe(a,e){switch(a){case"conflicted":return e.detailErrorConflicted;case"too-large":return e.detailErrorTooLarge;case"unreadable":return e.detailErrorUnreadable;case"bad-request":return e.detailErrorBadRequest;default:return e.detailErrorUnknown}}function Le(a,e){return a==="binary"?e.markBinary:a==="untracked"?e.markUntracked:a==="conflicted"?e.markConflicted:null}function Ye({file:a,strings:e,selected:t,onSelect:n,onOpen:i,onKey:d}){let s=ke(a.path),l=ae(a),m=Le(l.note,e),y=a.status==="deleted",v=a.oldPath===void 0?void 0:T(e.renameHint,{path:a.oldPath});return(0,r.jsxs)("div",{"data-testid":"review-row","data-path":a.path,"data-status":a.status,"data-deleted":y?"true":void 0,"data-selected":t?"true":"false",role:"option","aria-selected":t,tabIndex:t?0:-1,title:v,"aria-label":v,onClick:()=>{n(a.path),i(a.path)},onKeyDown:k=>d(k,a.path),children:[(0,r.jsx)("span",{"data-rm":"mark","data-status":a.status,title:De(a.status,e),children:be(a.status)}),(0,r.jsxs)("span",{"data-rm":"path",children:[s.dir===""?null:(0,r.jsx)("span",{"data-rm":"path-dir",children:s.dir}),(0,r.jsx)("span",{"data-rm":"path-name",className:y?"rm-struck":void 0,children:s.name})]}),(0,r.jsx)("span",{"data-rm":"churn","data-note":l.note??void 0,children:m??re(l)})]})}function Ze({path:a,file:e,phase:t,strings:n,onClose:i,bodyRef:d}){let s=e===void 0?void 0:ae(e),l=s===void 0?null:Le(s.note,n);return(0,r.jsxs)("div",{"data-testid":"review-detail","data-rm":"detail",children:[(0,r.jsxs)("div",{"data-rm":"detail-header",children:[(0,r.jsx)("span",{"data-rm":"detail-path",children:a}),e===void 0?null:(0,r.jsx)("span",{"data-rm":"detail-status",children:De(e.status,n)}),s===void 0||l!==null?null:(0,r.jsx)("span",{"data-rm":"detail-churn",children:re(s)}),(0,r.jsx)("button",{type:"button","data-rm":"detail-close","aria-label":n.detailClose,onClick:i,children:"\xD7"})]}),(0,r.jsxs)("div",{"data-rm":"detail-body",ref:d,children:[t.kind==="loading"?(0,r.jsx)("p",{"data-rm":"detail-loading",children:n.loading}):null,t.kind==="error"?(0,r.jsx)("p",{"data-rm":"detail-error",children:Xe(t.code,n)}):null,t.kind==="ready"?(0,r.jsx)(Je,{diff:t.diff,strings:n}):null]})]})}function Je({diff:a,strings:e}){if(a.kind==="binary"){let n=a.bytes===null?e.detailUnknownSize:Ce(a.bytes);return(0,r.jsx)("p",{"data-rm":"detail-binary",children:T(e.detailBinary,{size:n})})}let t=Ee(a);return t.length===0?(0,r.jsx)("p",{"data-rm":"detail-empty",children:e.detailEmpty}):(0,r.jsxs)(r.Fragment,{children:[a.kind==="text"&&a.truncated?(0,r.jsx)("p",{"data-rm":"detail-truncated",children:e.detailTruncated}):null,(0,r.jsx)("div",{"data-rm":"diff",children:t.map(n=>n.kind==="hunk"?(0,r.jsx)("div",{"data-rm":"diff-hunk",children:n.header},`hunk:${n.header}`):(0,r.jsxs)("div",{"data-rm":"diff-line","data-kind":n.lineKind,children:[(0,r.jsx)("span",{"data-rm":"diff-old",children:n.oldLine??""}),(0,r.jsx)("span",{"data-rm":"diff-new",children:n.newLine??""}),(0,r.jsx)("span",{"data-rm":"diff-sign",children:n.sign}),(0,r.jsx)("span",{"data-rm":"diff-text",children:n.text})]},n.key))})]})}function Pe({strings:a,runtime:e=fe(),mapLoader:t=ye}){return function({sessionId:i}){let[d,s]=(0,p.useState)("worktree"),[l,m]=(0,p.useState)({kind:"idle"}),[y,v]=(0,p.useState)(void 0),[k,L]=(0,p.useState)(void 0),[H,x]=(0,p.useState)(void 0),[P,E]=(0,p.useState)({kind:"idle"}),I=(0,p.useRef)(0),C=(0,p.useRef)(0),U=(0,p.useRef)(0),te=(0,p.useRef)(null),q=(0,p.useRef)(null),K=(0,p.useRef)(i),W=(0,p.useRef)(null),B=(0,p.useCallback)((o,w)=>{I.current+=1;let u=I.current;m({kind:"loading"});let h=w==="branch"?{kind:"branch"}:{kind:"worktree"};e.loadSnapshot(o,h).then(S=>{I.current===u&&m(S.ok?{kind:"ready",snapshot:S.snapshot}:{kind:"error",code:S.error.code})},()=>{I.current===u&&m({kind:"error",code:"unreadable"})})},[e]),_=(0,p.useCallback)((o,w,u)=>{C.current+=1;let h=C.current;L(u),x({kind:"loading",path:u});let S=w==="branch"?{kind:"branch"}:{kind:"worktree"};e.loadDiff(o,S,u).then(b=>{C.current===h&&x(b.ok?{kind:"ready",diff:b.diff}:{kind:"error",code:b.error.code})},()=>{C.current===h&&x({kind:"error",code:"unreadable"})})},[e]),N=(0,p.useCallback)((o,w)=>{let u=e.loadIndex;if(u===void 0){E({kind:"idle"});return}U.current+=1;let h=U.current;E({kind:"loading"});let S=w==="branch"?{kind:"branch"}:{kind:"worktree"};u.call(e,o,S).then(b=>{U.current===h&&E(b.ok?{kind:"ready",index:b.index}:{kind:"error",code:b.error.code})},()=>{U.current===h&&E({kind:"error",code:"unreadable"})})},[e]);(0,p.useEffect)(()=>{if(i===void 0||i===""){I.current+=1,C.current+=1,U.current+=1,K.current=i,m({kind:"idle"}),E({kind:"idle"}),v(void 0),L(void 0),x(void 0);return}if(K.current!==i){K.current=i,s("worktree"),C.current+=1,L(void 0),x(void 0),v(void 0),B(i,"worktree"),N(i,"worktree");return}B(i,d),N(i,d)},[i,d,B,N]),(0,p.useEffect)(()=>{W.current!==null&&(W.current.scrollTop=0)},[k,H?.kind==="ready"?H.diff.path:""]);let M=P.kind==="ready"?P.index:void 0,ne=(l.kind==="ready"?l.snapshot.repo:void 0)??a.repoFallback,ie=(0,p.useCallback)(o=>{i===void 0||i===""||(v(o),_(i,d,o))},[i,d,_]);(0,p.useEffect)(()=>{let o=te.current;if(o===null||M===void 0||M.files.length===0)return;let w=!1,u=null;return t().then(h=>{w||(u=h.createMap(o,Te(M,ne),{onOpenFile:ie}),q.current=u)},()=>{w||E({kind:"error",code:"unreadable"})}),()=>{w=!0,u?.destroy(),q.current===u&&(q.current=null)}},[M,ne,t,ie]);let de=o=>{o!==d&&(C.current+=1,U.current+=1,E({kind:"loading"}),L(void 0),x(void 0),v(void 0),s(o))},ze=()=>{i===void 0||i===""||(B(i,d),N(i,d))},He=i!==void 0&&i!=="",f=M===void 0?void 0:Me(M),R={statNewImports:a.statNewImports??"New imports",statDroppedImports:a.statDroppedImports??"Dropped imports",indexPartial:a.indexPartial??"indexed {parsed}/{total}",unresolved:a.unresolved??"\u2265{count} unresolved",mapTitle:a.mapTitle??"Directory map",mapLoading:a.mapLoading??"Indexing the map",mapEmpty:a.mapEmpty??"No structure to lay out",mapError:a.mapError??"The map index failed"},c=l.kind==="ready"?l.snapshot:void 0,A=c===void 0?void 0:Re(c),g=c===void 0?[]:xe(c.files),Be=c===void 0?void 0:c.scope==="branch"&&c.baseRef!==null?T(a.listMetaBranch,{base:Se(c.baseRef)}):a.listMetaWorktree,oe=g.some(o=>o.path===y)?y:g[0]?.path,se=k===void 0?void 0:g.find(o=>o.path===k),j=se===void 0?void 0:k,le=o=>{i===void 0||i===""||o!==k&&_(i,d,o)},pe=o=>{if(g.length===0)return;let w=g.findIndex(b=>b.path===oe),u=Math.min(g.length-1,Math.max(0,(w<0?0:w)+o)),h=g[u];if(h===void 0)return;v(h.path),document.querySelector(`[data-testid="review-row"][data-path="${CSS.escape(h.path)}"]`)?.focus()},Ne=(o,w)=>{if(o.key==="Enter"||o.key===" "){o.preventDefault(),v(w),le(w);return}if(o.key==="Escape"){if(k===void 0)return;o.preventDefault(),L(void 0),x(void 0);return}if(o.key==="ArrowDown"){o.preventDefault(),pe(1);return}o.key==="ArrowUp"&&(o.preventDefault(),pe(-1))};return(0,r.jsxs)("div",{"data-testid":"review-map","data-conversation-composer-overlay":"",children:[(0,r.jsxs)("div",{"data-rm":"header",children:[(0,r.jsx)("h2",{"data-rm":"title",children:a.title}),(0,r.jsx)("span",{"data-rm":"repo-name",children:c?.repo??a.repoFallback}),c===void 0?null:(0,r.jsxs)("span",{"data-rm":"head","data-head-kind":c.head.kind,children:[c.head.kind==="branch"?c.head.ref:"HEAD"," ",c.head.shortHash]}),(0,r.jsxs)("span",{"data-rm":"scope",role:"group",children:[(0,r.jsx)("button",{type:"button","data-rm":"scope-worktree","aria-pressed":d==="worktree",onClick:()=>de("worktree"),children:a.scopeWorktree}),(0,r.jsx)("button",{type:"button","data-rm":"scope-branch","aria-pressed":d==="branch",onClick:()=>de("branch"),children:a.scopeBranch})]}),(0,r.jsx)("button",{type:"button","data-rm":"refresh",onClick:ze,disabled:!He,children:a.refresh})]}),l.kind==="idle"?(0,r.jsxs)("div",{"data-rm":"empty",children:[(0,r.jsx)("p",{"data-rm":"empty-title",children:a.empty}),(0,r.jsx)("p",{"data-rm":"empty-hint",children:a.emptyHint})]}):null,l.kind==="loading"?(0,r.jsx)("p",{"data-rm":"loading",children:a.loading}):null,l.kind==="error"?(0,r.jsx)("p",{"data-rm":"error",children:Ge(l.code,a)}):null,c!==void 0&&A!==void 0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{"data-rm":"stats",children:[(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"lines",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:a.statLines}),(0,r.jsxs)("span",{"data-rm":"stat-value",children:[(0,r.jsxs)("span",{"data-rm":"stat-add",children:["+",f?.additions??A.additions]})," ",(0,r.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",f?.deletions??A.deletions]})]})]}),(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"files",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:a.statFiles}),(0,r.jsx)("span",{"data-rm":"stat-value",children:f?.files??A.files}),(0,r.jsx)("span",{"data-rm":"uncommitted",children:T(a.uncommitted,{count:String(c.uncommitted)})})]}),f===void 0?null:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"new-imports",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:R.statNewImports}),(0,r.jsxs)("span",{"data-rm":"stat-value","data-rm-value":"new-imports",children:["+",f.newImports]})]}),(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"dropped-imports",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:R.statDroppedImports}),(0,r.jsxs)("span",{"data-rm":"stat-value","data-rm-value":"dropped-imports",children:["\u2212",f.droppedImports]}),f.unresolved>0?(0,r.jsx)("span",{"data-rm":"unresolved","data-count":f.unresolved,children:T(R.unresolved,{count:String(f.unresolved)})}):null,f.partial===null?null:(0,r.jsx)("span",{"data-rm":"index-partial","data-parsed":f.partial.parsed,"data-total":f.partial.total,title:f.note??void 0,children:T(R.indexPartial,{parsed:String(f.partial.parsed),total:String(f.partial.total)})})]})]})]}),(0,r.jsxs)("div",{"data-rm":"split","data-open":j===void 0?"false":"true",children:[(0,r.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":a.title,children:[(0,r.jsxs)("div",{"data-rm":"list-meta",children:[(0,r.jsx)("span",{"data-rm":"list-scope",children:Be}),(0,r.jsx)("span",{"data-rm":"list-sort",children:a.listSort})]}),g.length===0?(0,r.jsx)("p",{"data-rm":"list-empty",children:a.listEmpty}):g.map(o=>(0,r.jsx)(Ye,{file:o,strings:a,selected:o.path===oe,onSelect:v,onOpen:le,onKey:Ne},o.path))]}),(0,r.jsxs)("div",{"data-rm":"map-pane","data-state":P.kind,"aria-label":R.mapTitle,role:"group",children:[P.kind==="loading"?(0,r.jsx)("p",{"data-rm":"map-loading",children:R.mapLoading}):null,P.kind==="error"?(0,r.jsx)("p",{"data-rm":"map-error",children:R.mapError}):null,P.kind==="ready"&&(M?.files.length??0)===0?(0,r.jsx)("p",{"data-rm":"map-empty",children:R.mapEmpty}):null,(0,r.jsx)("div",{"data-rm":"map-host",ref:te})]}),j===void 0||H===void 0?null:(0,r.jsx)(Ze,{path:j,file:se,phase:H,strings:a,bodyRef:W,onClose:()=>{L(void 0),x(void 0)}})]})]}):null]})}}var Ue=["slots","locale"],O,D;function ea(a){let e=a.locale.getSnapshot?.();return typeof e?.active=="string"?e.active:"zh"}function Fe(a){ue();let e=a.locale.bind($);O?.();let t=a.locale.register($,{zh:Z,en:J});O=t;let n=Pe({strings:{title:e("review-map.tabTitle"),repoFallback:e("review-map.repoFallback"),scopeWorktree:e("review-map.scopeWorktree"),scopeBranch:e("review-map.scopeBranch"),refresh:e("review-map.refresh"),statLines:e("review-map.statLines"),statFiles:e("review-map.statFiles"),statNewImports:e("review-map.statNewImports"),statDroppedImports:e("review-map.statDroppedImports"),indexPartial:e("review-map.indexPartial"),unresolved:e("review-map.unresolved"),mapTitle:e("review-map.mapTitle"),mapLoading:e("review-map.mapLoading"),mapEmpty:e("review-map.mapEmpty"),mapError:e("review-map.mapError"),uncommitted:e("review-map.uncommitted"),listMetaWorktree:e("review-map.listMetaWorktree"),listMetaBranch:e("review-map.listMetaBranch"),listSort:e("review-map.listSort"),listEmpty:e("review-map.listEmpty"),markBinary:e("review-map.markBinary"),markUntracked:e("review-map.markUntracked"),markConflicted:e("review-map.markConflicted"),renameHint:e("review-map.renameHint"),statusAdded:e("review-map.statusAdded"),statusModified:e("review-map.statusModified"),statusDeleted:e("review-map.statusDeleted"),statusRenamed:e("review-map.statusRenamed"),statusCopied:e("review-map.statusCopied"),statusTypeChanged:e("review-map.statusTypeChanged"),statusUntracked:e("review-map.statusUntracked"),statusConflicted:e("review-map.statusConflicted"),statusUnknown:e("review-map.statusUnknown"),errorNotARepo:e("review-map.errorNotARepo"),errorNoBase:e("review-map.errorNoBase"),errorNoSession:e("review-map.errorNoSession"),errorTooLarge:e("review-map.errorTooLarge"),errorConflicted:e("review-map.errorConflicted"),errorUnreadable:e("review-map.errorUnreadable"),errorUnknown:e("review-map.errorUnknown"),loading:e("review-map.loading"),empty:e("review-map.empty"),emptyHint:e("review-map.emptyHint"),detailClose:e("review-map.detailClose"),detailTruncated:e("review-map.detailTruncated"),detailBinary:e("review-map.detailBinary"),detailUnknownSize:e("review-map.detailUnknownSize"),detailEmpty:e("review-map.detailEmpty"),detailErrorConflicted:e("review-map.detailErrorConflicted"),detailErrorTooLarge:e("review-map.detailErrorTooLarge"),detailErrorUnreadable:e("review-map.detailErrorUnreadable"),detailErrorBadRequest:e("review-map.detailErrorBadRequest"),detailErrorUnknown:e("review-map.detailErrorUnknown")}}),i;return a.slots.inject(X,()=>{D?.();let d=a.slots.register({name:X,id:me,order:140,label:()=>ea(a).startsWith("zh")?Z["review-map.tabTitle"]:J["review-map.tabTitle"],locale:$},n);return D=d,i=d,()=>{d(),D===d&&(D=void 0)}}),()=>{i!==void 0&&D===i&&(D(),D=void 0),i=void 0,O===t&&(t(),O=void 0)}}var Ie={name:F,inject:Ue,apply:Fe},aa=Ie;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
