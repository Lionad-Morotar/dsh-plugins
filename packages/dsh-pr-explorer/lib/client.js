window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var p=Object.defineProperty;var P=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var w=Object.prototype.hasOwnProperty;var C=(e,r)=>{for(var t in r)p(e,t,{get:r[t],enumerable:!0})},S=(e,r,t,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of R(r))!w.call(e,n)&&n!==t&&p(e,n,{get:()=>r[n],enumerable:!(i=P(r,n))||i.enumerable});return e};var k=e=>S(p({},"__esModule",{value:!0}),e);var z={};C(z,{apply:()=>E,clientPlugin:()=>v,default:()=>H,inject:()=>b});module.exports=k(z);var c="dsh-pr-explorer",y="conversation.view",g="pr-explorer";var d="pr-explorer";var f={"pr-explorer.tabTitle":"PR","pr-explorer.empty":"\u9009\u62E9 base \u4E0E head \u540E\u52A0\u8F7D x...y \u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.loading":"\u52A0\u8F7D\u4E2D"},m={"pr-explorer.tabTitle":"PR","pr-explorer.empty":"Pick a base and a head to load the x...y comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.loading":"Loading"};var x="data-dsh-pr-explorer",L=`[data-testid="pr-explorer"] {
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
`;function u(e=typeof document>"u"?void 0:document){if(e===void 0)return;let r=e.querySelector(`style[${x}]`);if(r!==null)return r;let t=e.createElement("style");return t.setAttribute(x,""),t.textContent=L,e.head.append(t),t}var o=require("react/jsx-runtime");function h({strings:e}){return function(t){return(0,o.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,o.jsx)("div",{"data-rm":"header",children:(0,o.jsx)("h2",{"data-rm":"title",children:e.title})}),(0,o.jsx)("div",{"data-rm":"body",children:(0,o.jsxs)("div",{"data-rm":"empty",children:[(0,o.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,o.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]})})]})}}var b=["slots","locale"],s,a;function T(e){let r=e.locale.getSnapshot?.();return typeof r?.active=="string"?r.active:"zh"}function E(e){u();let r=e.locale.bind(d);s?.();let t=e.locale.register(d,{zh:f,en:m});s=t;let i=h({strings:{title:r("pr-explorer.tabTitle"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint")}}),n;return e.slots.inject(y,()=>{a?.();let l=e.slots.register({name:y,id:g,order:115,label:()=>T(e).startsWith("zh")?f["pr-explorer.tabTitle"]:m["pr-explorer.tabTitle"],locale:d},i);return a=l,n=l,()=>{l(),a===l&&(a=void 0)}}),()=>{n!==void 0&&a===n&&(a(),a=void 0),n=void 0,s===t&&(t(),s=void 0)}}var v={name:c,inject:b,apply:E},H=v;

    return module.exports.default ?? module.exports;
  }
});
