window.__ModuleLoader__.load({
  id: "dsh-testboard",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var c=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var k=(e,t)=>{for(var o in t)c(e,o,{get:t[o],enumerable:!0})},R=(e,t,o,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of T(t))!C.call(e,n)&&n!==o&&c(e,n,{get:()=>t[n],enumerable:!(s=x(t,n))||s.enumerable});return e};var A=e=>R(c({},"__esModule",{value:!0}),e);var H={};k(H,{apply:()=>E,boot:()=>v,clientPlugin:()=>S,default:()=>M,inject:()=>w});module.exports=A(H);var i="dsh-testboard",u="conversation.view",h="testboard";var d="testboard",p="client.snapshot.js";var f={"testboard.tabTitle":"\u6D4B\u8BD5","testboard.placeholderTitle":"\u6D4B\u8BD5\u770B\u677F","testboard.placeholderHint":"\u6D4B\u8BD5\u6E05\u5355\u4E0E\u7ED3\u679C\u5C06\u5728\u540E\u7EED\u7248\u672C\u63A5\u5165\u3002"},b={"testboard.tabTitle":"Tests","testboard.placeholderTitle":"Test board","testboard.placeholderHint":"The test inventory and results land in a later slice."};var g="data-dsh-testboard",P=`
[data-testboard-view] {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow: auto;
  color: var(--dsw-alias-label-primary, #0f1115);
  background: var(--dsw-alias-bg-base, #ffffff);
  font-size: var(--dsh-content-font-size, 14px);
}

[data-testboard-view] [data-testboard-title] {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #0f1115);
}

[data-testboard-view] [data-testboard-hint] {
  margin: 0;
  color: var(--dsw-alias-label-secondary, #61666b);
}

body[data-ds-dark-theme] [data-testboard-view] {
  color: var(--dsw-alias-label-primary, #e8eaed);
  background: var(--dsw-alias-bg-base, #1a1d23);
}

body[data-ds-dark-theme] [data-testboard-view] [data-testboard-title] {
  color: var(--dsw-alias-label-primary, #e8eaed);
}

body[data-ds-dark-theme] [data-testboard-view] [data-testboard-hint] {
  color: var(--dsw-alias-label-secondary, #a3a8b0);
}
`;function m(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${g}]`);if(t!==null)return t;let o=e.createElement("style");return o.setAttribute(g,""),o.textContent=P,e.head.append(o),o}var a=require("react/jsx-runtime");function y(e){return function(){return(0,a.jsxs)("div",{"data-testboard-view":"",children:[(0,a.jsx)("h2",{"data-testboard-title":"",children:e.title}),(0,a.jsx)("p",{"data-testboard-hint":"",children:e.hint})]})}}var $=Object.freeze({chunk:p,id:`${i}/${p}`}),L=null;function v(e){L=e}var w=["slots","locale"],l,r;function _(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function E(e){m();let t=e.locale.bind(d);l?.();let o=e.locale.register(d,{zh:f,en:b});l=o;let s=y({title:t("testboard.placeholderTitle"),hint:t("testboard.placeholderHint")});return e.slots.inject(u,()=>{r?.();let n=e.slots.register({name:u,id:h,order:130,label:()=>_(e).startsWith("zh")?f["testboard.tabTitle"]:b["testboard.tabTitle"],locale:d},s);return r=n,()=>{n(),r===n&&(r=void 0)}}),()=>{r?.(),r=void 0,o(),l===o&&(l=void 0)}}var S={name:i,inject:w,apply:E},M=S;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
