<template>
	<el-dialog
    title=""
    :visible.sync="isShow"
    width="400px"
    @close="close"
    :show-close="false"
    :center="true"
    class="m-dialog-with-icon"
    :destroy-on-close="false"
    append-to-body
  >
    <div class="c-header">
      <div class="c-success-icon"></div>
    </div>
    <div class="c-suc-tips f18 c-tips">
      {{message ? $t(message) : ''}}
    </div>
  </el-dialog>
</template>
<script>
	export default{
		props:{
			isOpen: {
				default: false,
				type: Boolean
			},
			message: {
				default: '',
				type: String
			}
		},
		data() {
			return {
				isShow: this.isOpen
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
				this.$emit('close');
			}
		}
	}
</script>