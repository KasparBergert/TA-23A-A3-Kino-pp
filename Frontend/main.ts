import { createApp } from 'vue'
import App from './src/App.vue'
import router from './src/router'
import './src/assets/styles/main.css'
import './src/assets/styles/base.css'
import $ from "jquery";
import _ from "lodash";
import noUiSlider from "nouislider";
import "datatables.net";
import "dropzone/dist/dropzone-min.js";
import * as VanillaCalendarPro from "vanilla-calendar-pro";

window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;
window.VanillaCalendarPro = VanillaCalendarPro;


createApp(App).use(router).mount('#app')

import("preline/dist/index.js");
