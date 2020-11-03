<template>
  <div>
    <Login />
    <NavigatorTip/>
  </div>
</template>
<script>
import Login from '@/components/LoginCom'
import NavigatorTip from '@/components/common/NavigatorTip'
export default {
  name: "LoginApp",
  components: {
    Login,
    NavigatorTip
  }
};

</script>
