window.__ModuleLoader__.load({
  id: "dsh-preview-more/client.pdf.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
/*! dsh-preview-more | MIT
 * Bundles third-party code: three.js and utif (MIT),
 * dxf-viewer (MPL-2.0), Google Draco (Apache-2.0).
 * Full license texts: see THIRD-PARTY-NOTICES.md in this package.
 */
"use strict";var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var s=Object.prototype.hasOwnProperty;var l=(t,e)=>{for(var a in e)o(t,a,{get:e[a],enumerable:!0})},f=(t,e,a,p)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of m(e))!s.call(t,n)&&n!==a&&o(t,n,{get:()=>e[n],enumerable:!(p=d(e,n))||p.enumerable});return t};var u=t=>f(o({},"__esModule",{value:!0}),t);var R={};l(R,{Body:()=>v,Viewer:()=>E,marker:()=>i});module.exports=u(R);var r=require("react/jsx-runtime"),i="WorkerMessageHandler";function c(){return(0,r.jsxs)("div",{className:"preview-more-status","data-testid":"preview-more-pending","data-family":"pdf",children:[(0,r.jsx)("p",{children:"\u8BE5\u7C7B\u9884\u89C8\u5C1A\u672A\u63A5\u5165"}),(0,r.jsx)("p",{children:i})]})}function v(){return(0,r.jsx)(c,{})}function E(){return(0,r.jsx)(c,{})}

    return module.exports.default ?? module.exports;
  }
});
