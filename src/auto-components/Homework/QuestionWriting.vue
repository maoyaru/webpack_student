<!-- question-writing -->
<template>
  <div class="question-writing-container">
    <div class="section-img">
      <div class="row-box" v-if="imgShowType == 'row'">
        <img :src="myImg">
      </div>
      <div class="column-box" v-if="imgShowType == 'column'">
        <img :src="myImg">
      </div>
    </div>
    <div class="section-upload-box" v-if="!isFinished">
      <el-upload accept="image/*" action ref="upload" :file-list="homeWorkPhotos" list-type="picture-card" :http-request="uploadImg" :on-remove="handleRemove" :on-preview="handlePictureCardPreview">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
    <div v-else>
      <div class="result-pic" v-if="status == 1">
        <div v-for="i in studentAnswerArr">
          <img :src="i">
          <div class="text" @click="openPic(i)">查看大图</div>
        </div>
      </div>
    </div>
    <!--     <div class="section-upload-img">
      <div class="upload-box">
        <input class="upload-input" type="file" id="file" name="file">
        <div class="upload-btn">
          <img src="@/images/homework/upload-btn.png">
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import UpLoad from "@/components/plugin/Upload";
import request from "@/api/index";
export default {

  name: 'question-writing',

  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      homeWorkPhotos: [],
      imgInfo: {},
      imgShowType: null
    }
  },

  props: {
    myImg: null,
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
  },

  computed: {
    homeWorkPhotosStr() {
      let arr = [];
      this.homeWorkPhotos.forEach(i => {
        arr.push(i.url);
      });
      return arr.join(',');
    },
    studentAnswerArr() {
      return this.studentAnswer[0].split(',');
    }
  },

  created() {
    this.getImgInfo();
  },

  mounted() {
    this.homeWorkPhotos = [];
    if (this.studentAnswer && this.studentAnswer.length) {
      let arr = this.studentAnswer[0].split(',');
      arr.forEach((i,index) => {
        this.homeWorkPhotos.push({
          url: i,
          uid: index
        });
      });
    }
  },

  methods: {

    // 获取图片信息
    getImgInfo() {
      let img = new Image();
      img.src = this.myImg;
      const vm = this;
      img.onload = function() {
        vm.$set(vm.imgInfo, 'width', img.width);
        vm.$set(vm.imgInfo, 'height', img.height);
      }
      this.imgType();
    },

    // 判断图片横竖展示   
    // 竖着 column 横着 row
    imgType() {
      this.imgShowType = this.imgInfo.width / this.imgInfo.height >= 800 / 360 ? 'row' : 'column';
    },

    //点击+号上传文件
    uploadImg(item) {
      let flag = item.file.type.indexOf('image')
      if (flag === -1) {
        this.$message({
          message: this.$t('Pictures in JPG and PNG formats can be uploaded')
        })
        return
      }
      this.disabledSubmit = true;
      let fileSize = item.file.size;
      let uid = item.file.uid;
      let fromData = new FormData();
      fromData.append("category", "avator");
      fromData.append("file", item.file);
      request.history.upLoad(fromData).then(res => {
        this.homeWorkPhotos.push({
          url: res.data.data,
          uid: uid
        });
      });
    },

    //删除文件
    handleRemove(file, fileList) {
      let index = this.homeWorkPhotos.findIndex(
        item => item.uid === file.uid
      );
      this.homeWorkPhotos.splice(index, 1);
    },

    //放大显示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    openPic(url) {
      window.open(url);
    }

  }

}

</script>
<style scoped lang="stylus">
* {
  box-sizing: border-box;
}

.question-writing-container {
  padding: 30px 40px;

  .section-img {

    /*横屏展示*/
    .row-box {
      width: 800px;

      img {
        width: 100%;
      }
    }

    /*纵屏展示*/
    .column-box {
      height: 360px;

      img {
        height: 100%;
      }
    }
  }

  .section-upload-box {
    margin-top: 30px;
  }

  .section-upload-img {
    margin-top: 30px;

    .upload-box {
      position: relative;

      .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        background: red;
        opacity: 0;
        cursor: pointer;
      }

      .upload-btn {
        width: 120px;
        height: 120px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.result-pic {
  margin-top: 50px;
  display: flex;
  img {
    width: 120px;
    height: 120px;
    border-radius: 0px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .text {
    width: 120px;
    text-align: center;
    color: #56becd;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}

</style>
