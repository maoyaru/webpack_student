<!-- question-stem -->
<template>
  <div>
    <div class="stem" :class="{'is-reader-children': isReaderChildren}">
      <span class="item-type">
        <span>{{itemType}}</span>
      </span>
      <span class="line" v-if="stem"> | </span>
      <span class="content">{{stem}}</span>
      <div class="icon-group" v-if="qType == 6">
        <div @mouseover="uploadBtnActive = true" @mouseout="uploadBtnActive = false" @click="onDownloadIamge()">
          <img src="@/images/homework/upload_active.png" v-if="uploadBtnActive">
          <img src="@/images/homework/upload.png" v-else>
        </div>
<!--         <div @mouseover="printBtnActive = true" @mouseout="printBtnActive = false" @click="onPrint()">
          <img src="@/images/homework/print_active.png" v-if="printBtnActive">
          <img src="@/images/homework/print.png" v-else>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-stem',

  props: {
    stem: {
      type: String
    },
    itemType: {
      type: String
    },
    isReaderChildren: {
      type: Boolean
    },
    qType: null,
    item: null
  },

  data() {
    return {
      uploadBtnActive: false,
      printBtnActive: false
    }
  },

  created() {

  },

  mounted() {
    if (this.item && this.item.type == 6) {
      console.log(this.item.childList[0].questionImage);
    }
  },

  methods: {
    onDownloadIamge() {
      window.open(this.item.childList[0].questionImage);
      // this.downloadIamge(this.item.childList[0].questionImage, 'image');
    },
    onPrint() {
      this.$message({
        message: '未连接到打印机！',
        type: 'error'
      });
    },
    // 下载图片
    downloadIamge(imgsrc, name) { //下载图片地址和图片名
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
  }

}

</script>
<style scoped lang="stylus">
.stem {
  box-sizing: border-box;
  min-height: 48px;
  padding: 8px 30px 7px;
  background: #ddd;
  color: #34364D;
  font-size: 20px;
  line-height: 33px;
  position: relative;

  .line {
    margin: 0 10px;
  }

  .content {
    font-size: 16px;
  }

  &.is-reader-children {
    background: #f4f4f4;
  }

  .icon-group {
    position: absolute;
    right: 20px;
    top: 4px;
    display: flex;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
    }
  }
}

</style>
