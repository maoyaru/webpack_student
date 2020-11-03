<template>
  <div class="submit-homework">
    <div class="teacherFeedback" v-if="showTeacherComment" v-show="showTeacher">
      <p class="homeWorkTitle">{{$t("Teacher's feedback")}}</p>
      <p class="comment-time f16" v-if="teacherComment.updateTime">{{DateTimeUtils.dateClockTime(teacherComment.updateTime)}}</p>
      <!-- 这里放个评分 -->
      <div class="homework_status" :class="homework_status(teacherComment.score)"></div>
      <div class="comment">
        <div class="triangleTop"></div>
        <span class="f16">{{showText(ind)}}</span>
        <div class="translate">
          <div class="change-btns">
            <i v-for="(item,index) in changeBtns" :key="index" class="zh" :class="{'active':index===ind}"
              @click="changeLanguage(index)">{{item.title}}</i>
          </div>
        </div>
        <div class="words">
          <i class="translate_icon"></i>
          <span class="f16">{{$t('Translated by Google translation')}}</span>
        </div>
      </div>
      <i class="little-arrow"></i>
    </div>
    <!-- 此处展示老师的评价 -->
    <div class="teacherNotFeedBack" v-if="!showTeacherComment" v-show="showTeacher">
      <div class="homeWorkTitle f16">{{$t("Teacher's feedback")}}</div>
      <div class="teacherNotFeedBackWrapper">
        <i class="teacherNotFeedBackSrc"></i>
        <span class="teacherNotFeedBackText f16">{{$t("No teacher's feedback yet")}}</span>
      </div>
    </div>
    <!-- 老师未评价显示 -->
    <div class="studentsSay" v-if="showStudentSubmit">
      <textarea v-model="textValue" name id cols="30" rows="5"
        :placeholder="$i18n.t('Say something to your teacher …')"></textarea>
      <el-upload accept="image/*" action ref="upload" list-type="picture-card" :http-request="uploadImg" :on-remove="handleRemove"
        :file-list="fileList"
        :class="{homeworkUpload: showEditModel}"
        :on-preview="handlePictureCardPreview">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <div class="submitMyHomeworkWrapper">
        <el-button class="submitMyHomework" v-if="showEditModel" plain @click="cancelEdit">{{$t('Cancel Modify')}}</el-button>
        <el-button class="submitMyHomework" :disabled="disabledSubmit" @click="submitMyHomeworkBtn" :loading="subLoading">{{$t("SUBMIT MY HOMEWORK")}}</el-button>
      </div>
    </div>
    <!-- 学生未提交显示 -->
    <StudentSubmitOver v-if="!showStudentSubmit" :studentHomework="studentHomework" :showEditBtn="showEditBtn" @editHomework="editHomework"></StudentSubmitOver>
    <!-- 学生提交过后显示 -->
  </div>
</template>

<script>
import UpLoad from "../../plugin/Upload";
import request from "../../../api/index";
import StudentSubmitOver from "./StudentsSubmitOver";
export default {
  props: ["classInfo", "propsHomeworkId"],
  data() {
    return {
      dialogImageUrl: "",
      showTeacher: true, // 老师状态全部隐藏
      showTeacherComment: true, //控制老师是否评价
      showStudentSubmit: true, //是否展示提交
      showEditModel: false, //是否展示编辑
      showEditBtn: false, //是否展示修改作业按钮
      dialogVisible: false,
      fileList: [], //已经上传图片列表
      changeBtns: [{ title: "English" }, { title: "中文" }],
      ind: 0,
      // homeworkId: null,
      homeWorkPhotos: [],
      homeWorkPhotosRemoveArr: [],
      fileSize: 0,
      textValue: "",
      studentHomework: [],
      teacherComment: {},
      subLoading: false,
      disabledSubmit: false,
      willUploadCount: 0,
      downUploadCount: 0,
    };
  },
  mounted() {
    this.subLoading = false;
    // let { virtualclassId, lessonId, score } = this.classInfo;
    this.getClassHomeworkStutesAjax();
    // request.history.getHomeworkInfo(lessonId).then(res => {
    //   //获取 家庭作业标识
    //   if (res.data.data.length != 0) {
    //     this.homeworkId = res.data.data[0].id;
    //   }
    // });
  },
  methods: {
    //获取 老师评价和学生评价，视图权限
    getClassHomeworkStutesAjax() {
      let { virtualclassId, lessonId, score } = this.classInfo;
      request.history.getClassHomeworkStutes(virtualclassId).then(res => {
        if (res.data.code === 200) {
          let studentUserId = window.localStorage.getItem("currentChild");
          if (res.data.data != null) {
            let teacherForStudent = res.data.data.classroomVirtualclassHomeworkResultList.find(
              item => item.studentUserId == studentUserId
            );
            if (teacherForStudent !== undefined) {
              let studentHomeworkArray = res.data.data.classroomVirtualclassHomeworkAttachmentList.filter(
                item => item.homeworkResultId == teacherForStudent.id
              );
              let tempFileList = [], tempAttachment = ""
              // 家庭作业图片获取处理 or 家庭作业想对老师说的文本获取
              studentHomeworkArray.forEach(item => {
                if (item.attachmentType === 1) {
                  tempAttachment = item.attachment
                } else if (item.attachmentType === 2) {
                  tempFileList.push({
                    url: item.attachment,
                    attachment: item.attachment,
                    attachmentType: item.attachmentType,
                    length: item.length
                  })
                }
              })
              this.fileList = tempFileList
              this.homeWorkPhotos = [...this.fileList]
              this.homeWorkPhotosRemoveArr = [...this.fileList]
              this.textValue = tempAttachment
              if (teacherForStudent.score === null) {
                //学生提交了，老师未更改
                this.showEditBtn = true
                this.showTeacherComment = false;
                this.showStudentSubmit = false;
                this.studentHomework = [...studentHomeworkArray];
              } else {
                //学生提交了，老师也更正了
                this.showEditBtn = false
                if (studentHomeworkArray.length === 0) {
                  this.showTeacher = false;
                } else {
                  this.showStudentSubmit = false;
                  this.studentHomework = [...studentHomeworkArray];
                  this.teacherComment = { ...teacherForStudent };

                  if(this.teacherComment.commentEn === "" && this.teacherComment.commentZh !== "") {
                    this.ind = 1
                  }else if(this.teacherComment.commentEn !== "" && this.teacherComment.commentZh === ""){
                    this.ind = 0
                  }else {
                    if(window.localStorage.getItem("localeLanguage") === "zh") {
                      this.ind = 1
                    }else {
                      this.ind = 0
                    }
                  }
                }
              }
            } else {
              //学生未提交，老师未更改
              this.showTeacher = false;
            }
          } else {
            this.showTeacher = false;
          }
        } else {
          //错误处理
        }
      });
    },

    changeLanguage(index) {
      this.ind = index;
      this.showText(index);
    },
    showText(ind) {
      if (ind === 0) {
        return this.teacherComment.commentEn;
      } else {
        return this.teacherComment.commentZh;
      }
    },
    //点击+号上传文件
    uploadImg(item) {
      let flag = item.file.type.indexOf('image')
      if(flag === -1) {
        this.$message({
          message: this.$t('Pictures in JPG and PNG formats can be uploaded')
        })
        return
      }
      this.disabledSubmit = true;
      this.willUploadCount++

      let fileSize = item.file.size;
      let uid = item.file.uid;
      let fromData = new FormData();
      fromData.append("category", "avator");
      fromData.append("file", item.file);
      request.history.upLoad(fromData).then(res => {
        let arr = this.homeWorkPhotos;
        this.homeWorkPhotosRemoveArr = [
          ...this.homeWorkPhotosRemoveArr,
          {
            attachment: res.data.data, //url
            attachmentType: 2, //文件类型
            length: fileSize, //文件大小
            uid
          }
        ];
        this.homeWorkPhotos = [
          ...arr,
          {
            attachment: res.data.data, //url
            attachmentType: 2, //文件类型
            length: fileSize //文件大小
          }
        ];
        this.downUploadCount++
        if (this.willUploadCount === this.downUploadCount) {
          this.disabledSubmit = false;
        }
      });
    },
    //删除文件
    handleRemove(file, fileList) {
      this.disabledSubmit = true;
      let ind = this.homeWorkPhotosRemoveArr.findIndex(
        item => item.attachment === file.attachment || item.uid === file.uid
      );
      this.homeWorkPhotosRemoveArr.splice(ind, 1);
      this.homeWorkPhotos.splice(ind, 1);
      this.disabledSubmit = false;
    },
    //放大显示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //提交
    submitMyHomeworkBtn() {
      this.subLoading = true;
      let { virtualclassId, tutorUserId } = this.classInfo;
      //提交
      let studentUserId =
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild");
      //判断文本框是否有输入
      if (this.textValue) {
        this.homeWorkPhotos = [
          {
            attachment: this.textValue, //输入框文本
            attachmentType: 1, //文件类型
            length: 0 //文件大小
          },
          ...this.homeWorkPhotos
        ];
      }
      //请求参数
      let params = {
        attachmentList: this.homeWorkPhotos,
        homeworkId: this.propsHomeworkId,
        studentUserId: studentUserId,
        tutorUserId: tutorUserId,
        virtualclassId: virtualclassId
      };
      //判断是否没有图片
      let photosFlag = params.attachmentList.find(
        item => item.attachmentType === 2
      );
      // 有内容并且上传了图片的判断
      if (photosFlag === undefined) {
        this.$message({
          message: this.$t("Please upload your homework first"),
          center: true
        });
        this.subLoading = false;
      } else {
        this.$api.history
          .submitHomework(params)
          .then(res => {
            this.subLoading = false
            //提交成功的状态
            if (res.data.code === 200) {
              this.getClassHomeworkStutesAjax();
              this.$message({
                message: this.$t("submit success"),
                center: true
              });
              this.showTeacherComment = false;
            } else {
              this.$message({
                message: this.$t("submit fail"),
                center: true
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    editHomework () {
      this.showStudentSubmit = true
      this.showEditModel = true
    },
    cancelEdit () {
      this.showEditModel = false
      this.showStudentSubmit = false
    },
    homework_status(score) {
      //判断本堂课 作业状态
      if (score === 1 || score === 2) {
        return "";
      } else if (score === 3) {
        return "score3";
      } else if (score === 4) {
        return "score4";
      } else if (score === 5) {
        return "score5";
      }
    }
  },
  components: {
    StudentSubmitOver
  }
};
</script>

<style lang="stylus">
.homework_status {
  width: 144px;
  height: 100px;
  position: absolute;
  z-index: 9;
  top: 14px;
  right: 0;
  background-size: 100%;
}

.score3 {
  bg-image:('../../../assets/theme-default/images/history/score3');
}

.score4 {
  bg-image('../../../assets/theme-default/images/history/score4');
}

.score5 {
  bg-image('../../../assets/theme-default/images/history/score5');
}

.not-corrected {
  bg-image('../../../assets/theme-default/images/history/tobe_corrected');
}

.not-submitted {
  bg-image('../../../assets/theme-default/images/history/not_submitted');
}

.homeWorkTitle {
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: rgba(52, 54, 77, 1);
  line-height: 22px;
}

.teacherNotFeedBackWrapper {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacherNotFeedBackSrc {
  display: block;
  width: 122px;
  height: 120px;
  bg-image('../../../assets/theme-default/images/history/teacherNotComment');
}

.teacherNotFeedBackText {
  font-family: Rubik-Regular, Rubik;
  color: rgba(178, 178, 178, 1);
  line-height: 19px;
}

.comment-time {
  margin-top: 10px;
  margin-bottom: 24px;
  color: rgba(189, 189, 189, 1);
}

.comment {
  padding: 20px 30px 0 30px;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 12px;
  color: rgba(51, 51, 51, 1);
  position: relative;
  margin-bottom: 40px;
  position: relative;

  .triangleTop {
      position: absolute;
      left: 30px;
      top: -15px;
      width:10px;
      height:15px;  
      background-size: 100% 100%;
      bg-image('../../../assets/theme-default/images/history/triangleTop');
  }
  
  span {
    line-height: 24px;
  }

  .translate {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 30px;

    .change-btns {
      margin-left: -20px;
      .en, .zh {
        display: inline-block;
        padding: 8px 28px;
        color: rgba(255, 255, 255, 1);
        border-radius: 24px;
        background: rgba(103, 107, 168, 1);
        font-style: normal;
        cursor: pointer;
      }

      .zh {
        padding: 6px 41px;
        background: rgba(244, 244, 244, 1);
        color: rgba(153, 153, 153, 1);
        margin-left:20px;
      }

      .active {
        background: rgba(103, 107, 168, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .little-arrow {
    position: absolute;
    width: 10px;
    height: 15px;
    left: 30px;
    top: -15px;
    background-size: 100% 100%;
    bg-image('../../../assets/theme-default/images/history/little_arrow');
  }
}

.words {
  color: rgba(153, 153, 144, 1);
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: 15px;

  .translate_icon {
    display: inline-block;
    width: 39px;
    height: 36px;
    bg-image('../../../assets/theme-default/images/history/translation');
    background-size: 100%;
    margin-right: 20px;
  }
}

.submit-homework {
  textarea {
    width: 100%;
    padding: 20px 30px 22px;
    box-sizing: border-box;
    resize: none;
    border-radius: 12px;
    border: 1px solid rgba(229, 229, 229, 1);
    outline: none;
    color: rgba(178, 178, 178, 1);
    margin-bottom: 30px;
  }
}

.submitMyHomeworkWrapper {
  height: 17px;
  margin: 40px auto;
  width: 100%;
  text-align: center;

  .submitMyHomework {
    border: 2px solid rgba(55, 56, 76, 1);
    color: rgba(55, 56, 76, 1);
    font-size: 14px;
  }
}

.homeworkUpload {
  li.el-upload-list__item {
    position: relative;
    &:after {
      position: absolute;
      left: 5px;
      top: 5px;
      content: '一';
      color: #ffffff;
      text-align: center;
      background: #e6a23c;
      font-size: 12px;
      line-height: 22px;
      border-radius: 100%;
      // border: 1px solid #c0c0c0;
      display: none;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}
</style>
