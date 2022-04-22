import VueMultiStepForm from "./VueMultiStepForm.js";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('vue-multi-step-form',VueMultiStepForm);
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

VueMultiStepForm.install = install;

export default VueMultiStepForm;