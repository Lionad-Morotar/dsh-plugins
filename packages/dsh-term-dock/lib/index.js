// src/shared.ts
var PACKAGE_NAME = "dsh-term-dock";
var DOCK_SLOT = "shell.bottom";
var DOCK_ID = "term-dock";

// src/index.ts
var name = PACKAGE_NAME;
var inject = [];
function describe() {
  return { name: PACKAGE_NAME, slot: DOCK_SLOT, id: DOCK_ID };
}
function apply() {
}
export {
  DOCK_ID,
  DOCK_SLOT,
  PACKAGE_NAME,
  apply,
  describe,
  inject,
  name
};
