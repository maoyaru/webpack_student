import Vue from 'vue';
import Toaster from './toaster.vue';
var $toaster = {};
$toaster.install = function (Vue, options) {
    Vue.prototype.$toaster = function(msg, duration = 2000){
        var MyComponent = Vue.extend(Toaster);
        var model = new MyComponent({
            el: document.createElement('div'),
            data(){
                return{
                    msg,
                    show:true
                }
            }
        }).$mount();

        document.body.appendChild(model.$el);
        setTimeout(() => {model.show=false},duration);
    }
}

export default $toaster;