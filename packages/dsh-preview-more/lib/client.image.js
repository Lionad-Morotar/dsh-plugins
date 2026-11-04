window.__ModuleLoader__.load({
  id: "dsh-preview-more/client.image.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
/*! dsh-preview-more | MIT
 * Bundles third-party code: three.js and utif (MIT),
 * dxf-viewer (MPL-2.0), Google Draco (Apache-2.0).
 * Full license texts: see THIRD-PARTY-NOTICES.md in this package.
 */
"use strict";var i=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var s=Object.prototype.hasOwnProperty;var l=(t,e)=>{for(var a in e)i(t,a,{get:e[a],enumerable:!0})},u=(t,e,a,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of d(e))!s.call(t,r)&&r!==a&&i(t,r,{get:()=>e[r],enumerable:!(o=m(e,r))||o.enumerable});return t};var f=t=>u(i({},"__esModule",{value:!0}),t);var E={};l(E,{Body:()=>R,Viewer:()=>v,marker:()=>c});module.exports=f(E);var n=require("react/jsx-runtime"),c="createObjectURL";function p(){return(0,n.jsxs)("div",{className:"preview-more-status","data-testid":"preview-more-pending","data-family":"image",children:[(0,n.jsx)("p",{children:"\u8BE5\u7C7B\u9884\u89C8\u5C1A\u672A\u63A5\u5165"}),(0,n.jsx)("p",{children:c})]})}function R(){return(0,n.jsx)(p,{})}function v(){return(0,n.jsx)(p,{})}

    return module.exports.default ?? module.exports;
  }
});
