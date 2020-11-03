<template>
  <el-dialog
    :visible.sync="isShow"
    width="400px"
    @close="close"
    :show-close="false"
    :center="true"
    class="m-alert-dialog"
    :destroy-on-close="false"
    append-to-body
  >
    <div class="c-tips f18">{{tip}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button class="wp100" @click="close">{{$t('CLOSE')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  props: {
    tip: {
      default: "",
      type: String
    },
    isOpen: {
      default: false,
      type: Boolean
    },
    flag: {
      default: "success",
      type: String
    }
  },
  watch: {
    isOpen(val) {
      let _self = this;
      _self.isShow = val;
      if (val)
        setTimeout(() => {
          _self.$emit("close", _self.isShow);
        }, 3000);
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>