<template>
  <div class="myHomeworkWrapper">
    <p class="myHomework">{{$t('My Homework')}}</p>
    <div class="studentsWord" v-if="renderText != undefined">
      {{renderText.attachment}}
      <div class="triangleBottom"></div>
    </div>
    <span
      class="time"
      v-if="renderText != undefined"
    >{{DateTimeUtils.dateClockTime(renderText.createTime)}}</span>
    <div class="homeworkPhotos">
      <el-image
        lazy
        v-for="(item,index) in renderPhotos"
        :key="index"
        @click="handlePictureCardPreview"
        :src="item.attachment"
        class="homeWorkimg"
        alt
      ></el-image>
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <div class="edit-homework" v-if="showEditBtn">
      <el-button @click="editHomework">{{$t('Edit Homework')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["studentHomework", "showEditBtn"],
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      renderPhotos: [],
      renderText: {}
    };
  },
  methods: {
    handlePictureCardPreview(e) {
      this.dialogImageUrl = e.path[0].src;
      this.dialogVisible = true;
    },
    editHomework() {
      this.$emit('editHomework')
    },
  },
  mounted() {
    this.renderPhotos = this.studentHomework.filter(
      item => item.attachmentType === 2
    );
    this.renderText = this.studentHomework.filter(
      item => item.attachmentType === 1
    )[0];
  }
};
</script>
<style lang='stylus' scoped>
.myHomeworkWrapper {
  position: relative;
}

.myHomework {
  font-size: 18px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: rgba(52, 54, 77, 1);
  line-height: 22px;
  margin: 10px 0;
}

.studentsWord {
  position: relative;
  padding: 20px 30px 20px 30px;
  border: 1px solid #e5e5e5;
  color: 12px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-family: Rubik-Regular, Rubik;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
   .triangleBottom {
      position: absolute;
      right: 30px;
      bottom: -15px;
      width:10px;
      height:15px;  
      background-size: 100% 100%;
      bg-image: ('../../../assets/theme-default/images/history/triangleBottom');
  }
}

.time {
  display: block;
  width: 100%;
  text-align: right;
  font-size: 16px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: rgba(189, 189, 189, 1);
  line-height: 19px;
}

.homeworkPhotos {
  width: 100%;
  margin: 4px 14px 14px 0;
  padding: 10px 0;
  box-sizing: border-box;

  .homeWorkimg {
    width: 120px;
    height: 120px;
    background: rgba(216, 216, 216, 1);
    margin: 10px 15px 10px 0;
  }
}

.edit-homework {
  display: flex;
  justify-content: center;  
}
</style>