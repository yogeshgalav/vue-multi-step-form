import VueNicePagination from "./VueNicePagination.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("vue-nice-pagination", VueNicePagination);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

VueNicePagination.install = install;

export default VueNicePagination;