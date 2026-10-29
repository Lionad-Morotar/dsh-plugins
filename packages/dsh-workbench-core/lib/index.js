// src/shared.ts
var PACKAGE_NAME = "dsh-workbench-core";
var WORKBENCH_SERVICE = "workbench";
var WORKBENCH_VERSION = 1;

// src/index.ts
var name = PACKAGE_NAME;
var inject = [];
function describe() {
  return { name: PACKAGE_NAME, service: WORKBENCH_SERVICE, version: WORKBENCH_VERSION };
}
function apply() {
}
export {
  PACKAGE_NAME,
  WORKBENCH_SERVICE,
  WORKBENCH_VERSION,
  apply,
  describe,
  inject,
  name
};
