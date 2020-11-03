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
      var key = 'ex5lZksGvEmoeC1m';
      var ts = Date.parse(new Date());
      var serial = 1419683487;
      var usertype = 2;
      var auth = MD5(key + ts + serial + usertype);
      var domain = 'oks';
      var username = this.$store.state.student.currentStudent.realName;
      var url = `http://global.talk-cloud.net/WebAPI/entry?serial=${serial}&username=${username}&usertype=2&ts=${ts}&auth=${auth}&domain=${domain}`;
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
