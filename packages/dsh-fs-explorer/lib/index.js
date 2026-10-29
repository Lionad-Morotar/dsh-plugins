// src/shared.ts
var PACKAGE_NAME = "dsh-fs-explorer";
var VIEW_SLOT = "conversation.view";
var VIEW_ID = "fs-explorer";
var VIEW_ORDER = 100;

// src/index.ts
var name = PACKAGE_NAME;
var inject = [];
function describe() {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
}
function apply() {
}
export {
  PACKAGE_NAME,
  VIEW_ID,
  VIEW_ORDER,
  VIEW_SLOT,
  apply,
  describe,
  inject,
  name
};
