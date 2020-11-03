<template>
  <div>
    <iframe :src="tkUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
import MD5 from "crypto-js/md5";
export default {
  props: [],
  data() {
      return {
        src: this.$route.params.src
      };
  },
  computed: {
    tkUrl(){
      var url =this.$store.state.enterclassroom.classroomInfo.tkUrl+window.location.protocol+"//"+window.location.host;
      return url;
    }
  },
  mounted() {
  },
  methods: {
      
  },
  components: {

  },
};
</script>

<style scoped>
iframe {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
