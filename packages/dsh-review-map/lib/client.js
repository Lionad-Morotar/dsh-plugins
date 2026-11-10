window.__ModuleLoader__.load({
  id: "dsh-review-map",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var p=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var E=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var k=(e,t)=>{for(var n in t)p(e,n,{get:t[n],enumerable:!0})},C=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of E(t))!S.call(e,r)&&r!==n&&p(e,r,{get:()=>t[r],enumerable:!(o=R(t,r))||o.enumerable});return e};var L=e=>C(p({},"__esModule",{value:!0}),e);var z={};k(z,{apply:()=>x,clientPlugin:()=>b,default:()=>H,inject:()=>h});module.exports=L(z);var f="dsh-review-map",y="conversation.view",v="review-map";var l="review-map";var c={"review-map.tabTitle":"\u8BC4\u5BA1","review-map.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u53D8\u66F4","review-map.emptyHint":"\u8BC4\u5BA1\u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u53D8\u66F4\u8303\u56F4\u94FA\u5F00\u3002","review-map.loading":"\u52A0\u8F7D\u4E2D"},m={"review-map.tabTitle":"Review","review-map.empty":"Select a session to load its changes","review-map.emptyHint":"The review map will lay the change set out here.","review-map.loading":"Loading"};var u="data-dsh-review-map",M=`[data-testid="review-map"] {
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

[data-testid="review-map"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: baseline;
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

[data-testid="review-map"] [data-rm="subtitle"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--dsh-code-font-size, 11px);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="body"] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

[data-testid="review-map"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
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
`;function g(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${u}]`);if(t!==null)return t;let n=e.createElement("style");return n.setAttribute(u,""),n.textContent=M,e.head.append(n),n}var i=require("react/jsx-runtime");function w({strings:e}){return function(n){return(0,i.jsxs)("div",{"data-testid":"review-map","data-conversation-composer-overlay":"",children:[(0,i.jsx)("div",{"data-rm":"header",children:(0,i.jsx)("h2",{"data-rm":"title",children:e.title})}),(0,i.jsx)("div",{"data-rm":"body",children:(0,i.jsxs)("div",{"data-rm":"empty",children:[(0,i.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,i.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]})})]})}}var h=["slots","locale"],s,a;function T(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function x(e){g();let t=e.locale.bind(l);s?.();let n=e.locale.register(l,{zh:c,en:m});s=n;let o=w({strings:{title:t("review-map.tabTitle"),empty:t("review-map.empty"),emptyHint:t("review-map.emptyHint")}}),r;return e.slots.inject(y,()=>{a?.();let d=e.slots.register({name:y,id:v,order:140,label:()=>T(e).startsWith("zh")?c["review-map.tabTitle"]:m["review-map.tabTitle"],locale:l},o);return a=d,r=d,()=>{d(),a===d&&(a=void 0)}}),()=>{r!==void 0&&a===r&&(a(),a=void 0),r=void 0,s===n&&(n(),s=void 0)}}var b={name:f,inject:h,apply:x},H=b;

    return module.exports.default ?? module.exports;
  }
});
