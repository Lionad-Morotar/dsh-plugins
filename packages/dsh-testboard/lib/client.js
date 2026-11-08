window.__ModuleLoader__.load({
  id: "dsh-testboard",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var l=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var S=(t,e)=>{for(var o in e)l(t,o,{get:e[o],enumerable:!0})},C=(t,e,o,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of T(e))!x.call(t,r)&&r!==o&&l(t,r,{get:()=>e[r],enumerable:!(i=E(e,r))||i.enumerable});return t};var A=t=>C(l({},"__esModule",{value:!0}),t);var I={};S(I,{apply:()=>y,clientPlugin:()=>w,default:()=>_,inject:()=>h});module.exports=A(I);var f="dsh-testboard",c="conversation.view",g="testboard";var s="testboard";var b={"testboard.tabTitle":"\u6D4B\u8BD5","testboard.placeholderTitle":"\u6D4B\u8BD5\u770B\u677F","testboard.placeholderHint":"\u6D4B\u8BD5\u6E05\u5355\u4E0E\u7ED3\u679C\u5C06\u5728\u540E\u7EED\u7248\u672C\u63A5\u5165\u3002"},p={"testboard.tabTitle":"Tests","testboard.placeholderTitle":"Test board","testboard.placeholderHint":"The test inventory and results land in a later slice."};var u="data-dsh-testboard",V=`
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
`;function v(t=typeof document>"u"?void 0:document){if(t===void 0)return;let e=t.querySelector(`style[${u}]`);if(e!==null)return e;let o=t.createElement("style");return o.setAttribute(u,""),o.textContent=V,t.head.append(o),o}var n=require("react/jsx-runtime");function m(t){return function(){return(0,n.jsxs)("div",{"data-testboard-view":"",children:[(0,n.jsx)("h2",{"data-testboard-title":"",children:t.title}),(0,n.jsx)("p",{"data-testboard-hint":"",children:t.hint})]})}}var h=["slots","locale"],d,a;function L(t){let e=t.locale.getSnapshot?.();return typeof e?.active=="string"?e.active:"zh"}function y(t){v();let e=t.locale.bind(s);d?.();let o=t.locale.register(s,{zh:b,en:p});d=o;let i=m({title:e("testboard.placeholderTitle"),hint:e("testboard.placeholderHint")});return t.slots.inject(c,()=>{a?.();let r=t.slots.register({name:c,id:g,order:130,label:()=>L(t).startsWith("zh")?b["testboard.tabTitle"]:p["testboard.tabTitle"],locale:s},i);return a=r,()=>{r(),a===r&&(a=void 0)}}),()=>{a?.(),a=void 0,o(),d===o&&(d=void 0)}}var w={name:f,inject:h,apply:y},_=w;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
