window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var d=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var R=(e,t)=>{for(var r in t)d(e,r,{get:t[r],enumerable:!0})},V=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of P(t))!S.call(e,n)&&n!==r&&d(e,n,{get:()=>t[n],enumerable:!(a=b(t,n))||a.enumerable});return e};var T=e=>V(d({},"__esModule",{value:!0}),e);var _={};R(_,{apply:()=>E,clientPlugin:()=>w,default:()=>L,inject:()=>v});module.exports=T(_);var m="dsh-pr-explorer",c="conversation.view",g="pr-explorer";var l="pr-explorer";var x={"pr-explorer.tabTitle":"PR","pr-explorer.empty":"\u9009\u62E9 base \u4E0E head \u540E\u52A0\u8F7D x...y \u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.loading":"\u52A0\u8F7D\u4E2D"},f={"pr-explorer.tabTitle":"PR","pr-explorer.empty":"Pick a base and a head to load the x...y comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.loading":"Loading"};var y="data-dsh-pr-explorer",C=`[data-testid="pr-explorer"] {
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
}

[data-testid="pr-explorer"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="pr-explorer"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="subtitle"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--dsh-code-font-size, 11px);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="body"] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

[data-testid="pr-explorer"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  padding: 24px;
  text-align: center;
}

[data-testid="pr-explorer"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="empty-hint"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}
`;function h(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${y}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(y,""),r.textContent=C,e.head.append(r),r}var o=require("react/jsx-runtime");function u({strings:e}){return function(r){return(0,o.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,o.jsx)("div",{"data-rm":"header",children:(0,o.jsx)("h2",{"data-rm":"title",children:e.title})}),(0,o.jsx)("div",{"data-rm":"body",children:(0,o.jsxs)("div",{"data-rm":"empty",children:[(0,o.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,o.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]})})]})}}var v=["slots","locale"],p,i;function A(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function E(e){h();let t=e.locale.bind(l);p?.();let r=e.locale.register(l,{zh:x,en:f});p=r;let a=u({strings:{title:t("pr-explorer.tabTitle"),empty:t("pr-explorer.empty"),emptyHint:t("pr-explorer.emptyHint")}}),n;return e.slots.inject(c,()=>{i?.();let s=e.slots.register({name:c,id:g,order:115,label:()=>A(e).startsWith("zh")?x["pr-explorer.tabTitle"]:f["pr-explorer.tabTitle"],locale:l},a);return i=s,n=s,()=>{s(),i===s&&(i=void 0)}}),()=>{n!==void 0&&i===n&&(i(),i=void 0),n=void 0,p===r&&(r(),p=void 0)}}var w={name:m,inject:v,apply:E},L=w;

    return module.exports.default ?? module.exports;
  }
});
