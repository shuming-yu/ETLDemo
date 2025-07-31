// import './assets/main.css'
import "@/css/app.scss";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from "@/App.vue";
import router from './router'
import i18n from "@/i18n";

import { Quasar } from "quasar";
import { QPlugins } from "@/plugins/quasar";

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/node-resizer/dist/style.css';

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(i18n);

app.use(Quasar, { plugins: QPlugins });

app.mount('#app')
