<template>
</template>
<script>
export default {
  name: 'ClassCardScrollScreen',
  bind: function(el, binding) {
    let value;
    value = window.screen.width / 1700 * 290 + 'px';
    el.style.height = `calc(100vh - ${value})`;
  }
}

</script>
