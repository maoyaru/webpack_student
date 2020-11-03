<template>
  <div>
    <PayBillList></PayBillList>
    <NavigatorTip/>
  </div>
</template>
<script>
import PayBillList from '@/multipages/pay'
import NavigatorTip from '@/components/common/NavigatorTip'
export default {
  name: "PayBillListApp",
  components: {
    PayBillList,
    NavigatorTip
  }
};

</script>
