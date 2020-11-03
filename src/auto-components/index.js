import Vue from 'vue';

function registerComponents(moduleContext) {
  // https://webpack.js.org/guides/dependency-management/
  moduleContext.keys().forEach(key => {
    const module = moduleContext(key);
    const component = module.default;
    const keyParts = key.replace(/\.vue$/, '').split('/');
    const componentName = keyParts[keyParts.length - 1];
    // console.log('componentName: ', componentName, ' component: ', component);
    Vue.component(componentName, component);
  });
}

registerComponents(require.context('.', true, /\.vue$/));
