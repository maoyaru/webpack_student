<!-- question-list-hw -->
<template>
  <div class="container-x" v-if="!pageLoading">
    <!-- 未全部完成提交提示 -->
    <el-dialog class="submit-dialog" :show-close="false" :visible.sync="submitDialogVisible" width="400px" height="200px">
      <span class="tips">现在还有未完成的作业，要现在<br />提交吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitResult">现在提交</el-button>
        <el-button type="primary" @click="submitDialogVisible = false">先全部完成</el-button>
      </span>
    </el-dialog>
    <!-- 结果展示 -->
    <el-dialog class="result-dialog" :show-close="false" :visible.sync="resultDialogVisible" width="400px" height="415px" v-if="teacherFeedback">
      <div class="title">完成作业</div>
      <div class="result-count">正确 <span style="color: #56BECD;">{{questionRightCount}}</span> 题，错误 <span style="color: #EB532F;">{{questionWrongCount}}</span> 题</div>
      <div class="result-img">
<!--         <img src="@/images/homework/countAplus.png" v-if="teacherFeedback.score == 5">
        <img src="@/images/homework/countA.png" v-if="teacherFeedback.score == 4">
        <img src="@/images/homework/countB.png" v-if="teacherFeedback.score == 3"> -->
        <img src="@/assets/theme-default/images/history/score5.png" v-if="teacherFeedback.score == 5">
        <img src="@/assets/theme-default/images/history/score4.png" v-if="teacherFeedback.score == 4">
        <img src="@/assets/theme-default/images/history/score3.png" v-if="teacherFeedback.score == 3">
        <img src="@/images/homework/countC.png" v-if="teacherFeedback.score == 2">
        <img src="@/images/homework/countF.png" v-if="teacherFeedback.score == 1">
      </div>
      <div class="result-tips" v-if="teacherFeedback.score == 5">非常完美！您做对了所有题目！</div>
      <div class="result-tips" v-if="teacherFeedback.score == 4">继续努力！距完美只差一步！</div>
      <div class="result-tips" v-if="teacherFeedback.score == 3">再接再厉！下次一定能作对更多！</div>
      <div class="result-tips" v-if="teacherFeedback.score == 2">再看一遍错题！下次一定能作对更多！</div>
      <div class="result-tips" v-if="teacherFeedback.score == 1">成绩有点差！在复习一遍吧！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewResult">查看详情</el-button>
      </span>
    </el-dialog>
    <div class="hw-container">
      <homework-teacher-feedback :result="result" v-if="pageStatus == 'completed' && result.length" :feedback="teacherFeedback"></homework-teacher-feedback>
      <div>
        <div class="hw-item-box" v-for="(i,iIndex) in list" :key="i.id">
          <!-- 题型 -->
          <question-stem :item="i" :qType="i.type" :stem="i.remark" :itemType="i.title" :isReaderChildren="i.isReaderChildren"></question-stem>
          <!-- 选择题 -->
          <div v-if="i.type == 1">
            <div v-for="(j,index) in i.childList">
              <div class="sub-title">{{index + 1}}、 {{j.questionText}}<span class="hw-no-work" v-if="j.status == 0 && pageStatus == 'completed'"> [未做]</span></div>
              <question-single-choice :ref="'qSingleChoice' + iIndex" :options="j.contentJson" :stemImg="j.questionImage" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-single-choice>
            </div>
          </div>
          <!-- 填空题 -->
          <div v-if="i.type == 2">
            <div class="fill-box">
              <div v-for="(j,jIndex) in i.childList">
                <question-fill :ref="'qFill' + iIndex" :content="j.contentJson.options" :jIndex="jIndex" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-fill>
              </div>
            </div>
          </div>
          <!-- 连线题 -->
          <div v-if="i.type == 3">
            <div class="matching-box">
              <div v-for="(j,jIndex) in i.childList">
                <div style="display: flex;">
                  <div class="judge">
                    <div class="right-icon" v-if="j.status == 1 && pageStatus == 'completed'">
                      <img class="img" src="@/images/homework/right.png">
                    </div>
                    <div class="wrong-icon" v-if="j.status == 2 && pageStatus == 'completed'">
                      <img class="img" src="@/images/homework/wrong.png">
                    </div>
                  </div>
                  <div class="sub-title">{{jIndex + 1}}、请连线</div>
                </div>
                <div class="matching-item">
                  <question-matching :iIndex="iIndex" :jIndex="jIndex" :ref="'qMatching' + iIndex" :content="j.contentJson" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-matching>
                  <question-matching-result :iIndex="iIndex" :jIndex="jIndex" v-if="j.status == 2 && pageStatus == 'completed'" style="margin-top: 30px;" :content="j.contentJson" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-matching-result>
                </div>
              </div>
              <!--               <div style="height: 30px;"></div>
              <div class="sub-title">2、请连接词组和对应的图片：</div>
              <div class="matching-item">
                <question-matching-img v-if="pageStatus == null"></question-matching-img>
                <question-matching-img-result v-if="pageStatus == 'completed'"></question-matching-img-result>
              </div> -->
            </div>
          </div>
          <!-- 排序题 -->
          <div v-if="i.type == 4">
            <div class="sort-box">
              <div v-for="(j, jIndex) in i.childList" :key="jIndex">
                <question-sort :ref="'qSort' + iIndex" :content="j.contentJson" :jIndex="jIndex" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-sort>
              </div>
            </div>
          </div>
          <!-- 阅读题 -->
          <div v-if="i.type == 5">
            <div style="padding: 20px;" v-html="i.content"></div>
            <div class="hw-item-box" v-for="j in i.modelList" :key="j.id">
              <!-- 题型 -->
              <question-stem :stem="j.remark" :itemType="j.title" :isReaderChildren="true"></question-stem>
              <!-- 选择题 -->
              <div v-if="j.type == 1">
                <div v-for="(k,index) in j.childList">
                  <div class="sub-title">{{index + 1}}、 {{k.questionText}}<span class="hw-no-work" v-if="k.status == 0 && pageStatus == 'completed'"> [未做]</span></div>
                  <question-single-choice :ref="'qSingleChoiceSmall' + iIndex" :options="k.contentJson" :stemImg="k.questionImage" :isFinished="pageStatus == 'completed'" :status="k.status" :rightAnswer="k.answer0" :studentAnswer="k.answer1"></question-single-choice>
                </div>
              </div>
              <!-- 填空题 -->
              <div v-if="j.type == 2">
                <div class="fill-box">
                  <div v-for="(k,kIndex) in j.childList">
                    <question-fill :ref="'qFillSmall' + iIndex" :content="k.contentJson.options" :jIndex="kIndex" :isFinished="pageStatus == 'completed'" :status="k.status" :rightAnswer="k.answer0" :studentAnswer="k.answer1"></question-fill>
                  </div>
                </div>
              </div>
            </div>
            <!-- <question-reader :isFinished="pageStatus" :content="i.content" :modelList="i.modelList"></question-reader> -->
          </div>
          <!-- 写作题 -->
          <div v-if="i.type == 6">
            <div v-for="(j,jIndex) in i.childList">
              <question-writing :myImg="j.questionImage" ref="qWriting" :jIndex="jIndex" :isFinished="pageStatus == 'completed'" :status="j.status" :rightAnswer="j.answer0" :studentAnswer="j.answer1"></question-writing>
            </div>
          </div>
        </div>
        <!-- 提交按钮 -->
        <div class="btn-group" v-if="pageStatus == null">
          <div class="save-btn" @mouseover="saveBtnActive = true" @mouseout="saveBtnActive = false" @click="saveForm">
            <img src="@/images/homework/submit-save-blue.png" v-if="!saveBtnActive">
            <img src="@/images/homework/save-btn.png" v-else>
            <span>保存一下</span>
          </div>
          <div class="submit-btn" @mouseover="submitBtnActive = true" @mouseout="submitBtnActive = false" @click="submitForm">
            <img src="@/images/homework/submit-btn-blue.png" v-if="!submitBtnActive">
            <img src="@/images/homework/submit-btn.png" v-else>
            <span>提交作业</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";

export default {

  name: 'question-list-hw',

  data() {
    return {
      pageLoading: true,
      pageStatus: null,
      // pageStatus: 'completed',
      submitDialogVisible: false,
      resultDialogVisible: false,
      saveBtnActive: false,
      submitBtnActive: false,
      result: [],
      originList: [],
      list: [],
      submitAnswerArray: [],
      allAnswer: false,
      teacherFeedback: null,
      questionRightCount: 0,
      questionWrongCount: 0
    }
  },

  props: {
    queryInfo: null,
  },

  created() {
    this.loadHomework();
    this.searchTeacherFeedback();
  },

  mounted() {
    let app = document.getElementById('app');
    let self = this;
    app.addEventListener('scroll', function() {
      if (this.scrollTop > 200) {
        self.showBack = true;
      } else {
        self.showBack = false;
      }
    });
  },

  methods: {

    // 获取试卷
    loadHomework() {
      this.result = [];
      this.originList = [];
      this.list = [];
      this.submitAnswerArray = [];
      this.questionRightCount = 0;
      this.questionWrongCount = 0;
      // api.homework.getHomeworkDetail(1661, 5862498457664265).then(res => {
      api.homework.getHomeworkDetail(this.queryInfo.lessonId, this.queryInfo.studentId).then(res => {
        this.originList = this.deepClone(res.data.data.questions);
        this.list = res.data.data.questions;
        this.addOptionLetter();
        this.resultProcessing();
        this.computedResult();
        this.pageLoading = false;
      });
    },

    // 保存试卷
    saveHomework() {
      this.getAnswer();
      const loading = this.$loading({
        lock: true,
        text: '结果保存中 ...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
      });
      let dto = [
        { "questionId": "709483951915536384", "studentAnswer": [] },
        { "questionId": "709483952183971841", "studentAnswer": [] },
        { "questionId": "709483952188166146", "studentAnswer": [] },
        { "questionId": "709483952192360449", "studentAnswer": [] },
        { "questionId": "709483952192360452", "studentAnswer": [] },
        { "questionId": "709483952196554753", "studentAnswer": [] },
        { "questionId": "709483952196554755", "studentAnswer": [] }
      ];
      // api.homework.saveHomework(1908816204099011, 1661, 5862498457664265, this.submitAnswerArray).then(res => {
      api.homework.saveHomework(this.queryInfo.virtualclassId, this.queryInfo.lessonId, this.queryInfo.studentId, this.submitAnswerArray).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          loading.close();
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.loadHomework();
        } else {
          loading.close();
          this.$message(res.data.message);
        }
      });
    },

    // 提交试卷
    submitHomework() {
      this.getAnswer();
      const loading = this.$loading({
        lock: true,
        text: '提交试卷 ...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
      });
      let dto = [
        { "questionId": "709483951915536384", "studentAnswer": [] },
        { "questionId": "709483952183971841", "studentAnswer": [] },
        { "questionId": "709483952188166146", "studentAnswer": [] },
        { "questionId": "709483952192360449", "studentAnswer": [] },
        { "questionId": "709483952192360452", "studentAnswer": [] },
        { "questionId": "709483952196554753", "studentAnswer": [] },
        { "questionId": "709483952196554755", "studentAnswer": [] }
      ];
      // api.homework.submitHomework(1908816204099011, 1661, 5862498457664265, this.submitAnswerArray).then(res => {
      api.homework.submitHomework(this.queryInfo.virtualclassId, this.queryInfo.lessonId, this.queryInfo.studentId, this.submitAnswerArray).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          loading.close();
          this.$message({
            message: '提交成功！',
            type: 'success'
          });
          this.loadHomework();
          this.searchTeacherFeedback();
          this.resultDialogVisible = true;
        } else {
          loading.close();
          this.$message(res.data.message);
        }
      });
    },

    // 查询教师反馈
    searchTeacherFeedback() {
      // api.homework.getHomeworkTeacherFeedback(1908816204099011, 5862498457664265).then(res => {
      api.homework.getHomeworkTeacherFeedback(this.queryInfo.virtualclassId, this.queryInfo.studentId).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          this.teacherFeedback = res.data.data;
          this.pageStatus = this.teacherFeedback.score ? 'completed' : null;
        } else {
          this.$message(res.data.message);
        }
      });
    },

    // option 加字母
    addOptionLetter() {
      let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      this.list.forEach((i, index) => {
        if (i.type == 1) {
          i.childList.forEach(j => {
            j.contentJson.map((k, kIndex) => {
              Vue.set(k, 'letter', letters[kIndex]);
            });
          });
        }
        if (i.type == 5) {
          i.modelList.forEach(j => {
            if (j.type == 1) {
              j.childList.forEach(k => {
                k.contentJson.map((l, lIndex) => {
                  Vue.set(l, 'letter', letters[lIndex]);
                });
              });
            }
          })
        }
      });
    },

    // 加结果
    resultProcessing() {
      this.list.forEach(i => {
        let currentGroup = {};
        currentGroup.title = i.title;
        currentGroup.type = i.type;
        if (i.type == 5) {
          currentGroup.childList = [];
          currentGroup.childList2 = [];
          i.modelList.forEach(j => {
            if (j.type == 1) {
              j.childList.forEach(k => {
                currentGroup.childList.push(k.status);
              });
            } else if (j.type == 2) {
              j.childList.forEach(k => {
                currentGroup.childList2.push(k.status);
              });
            }
          });
        } else {
          currentGroup.childList = [];
          i.childList.forEach(j => {
            currentGroup.childList.push(j.status);
          });
        }
        this.result.push(currentGroup);
      });
    },

    // 回到顶部
    back() {
      let app = document.getElementById('app');
      let scrollTop = app.scrollTop;
      // 假设要求300ms回到顶部，求出每10ms的滚动距离
      let unitTop = scrollTop / 300 * 10;
      this.scrollUnit(app, 10, unitTop);
    },

    scrollUnit(app, time, unitTop) {
      setTimeout(() => {
        if (app.scrollTop >= unitTop) {
          app.scrollTop -= unitTop;
          this.scrollUnit(app, time, unitTop);
        } else {
          app.scrollTop = 0;
        }
      }, time);
    },

    // 保存表单
    saveForm() {
      this.getAnswer();
      this.saveHomework();
    },

    computedResult() {
      this.result.forEach(i => {
        i.childList.forEach(j => {
          if (j == 1) {
            this.questionRightCount++;
          } else {
            this.questionWrongCount++;
          }
        });
        if (i.type == 5) {
          i.childList2.forEach(j => {
            if (j == 1) {
              this.questionRightCount++;
            } else {
              this.questionWrongCount++;
            }
          });
        }
      });
    },

    // 获取答案
    getAnswer() {
      this.submitAnswerArray = [];
      this.allAnswer = true;
      this.originList.forEach((i, iIndex) => {
        // 单选题
        if (i.type == 1) {
          i.childList.forEach((j, jIndex) => {
            let obj = {
              questionId: j.id,
              studentAnswer: []
            };
            if (j.contentJson[this.$refs['qSingleChoice' + iIndex][jIndex].currentSelectitem]) {
              obj.studentAnswer.push(j.contentJson[this.$refs['qSingleChoice' + iIndex][jIndex].currentSelectitem]);
            } else {
              this.allAnswer = false;
            }
            this.submitAnswerArray.push(obj);
          });
        }
        // 填空题
        if (i.type == 2) {
          i.childList.forEach((j, jIndex) => {
            let obj = {
              questionId: j.id,
              studentAnswer: []
            }
            if (this.$refs['qFill' + iIndex][jIndex].valueResult.length) {
              obj.studentAnswer = this.$refs['qFill' + iIndex][jIndex].valueResult;
            } else {
              this.allAnswer = false;
            }
            this.submitAnswerArray.push(obj);
          });
        }
        // 连线题
        if (i.type == 3) {
          i.childList.forEach((j, jIndex) => {
            let obj = {
              questionId: j.id,
              studentAnswer: []
            }
            if (this.$refs['qMatching' + iIndex][jIndex].canvasLineGroup) {
              obj.studentAnswer = this.$refs['qMatching' + iIndex][jIndex].outputValue;
            } else {
              this.allAnswer = false;
            }
            this.submitAnswerArray.push(obj);
          });
        }
        // 排序题
        if (i.type == 4) {
          i.childList.forEach((j, jIndex) => {
            let obj = {
              questionId: j.id,
              studentAnswer: []
            }
            if (this.$refs['qSort' + iIndex][jIndex].valueArray.length) {
              obj.studentAnswer = this.$refs['qSort' + iIndex][jIndex].valueArray;
            } else {
              this.allAnswer = false;
            }
            this.submitAnswerArray.push(obj);
          });
        }
        // 阅读题
        if (i.type == 5) {
          i.modelList.forEach((j, jIndex) => {
            if (j.type == 1) {
              j.childList.forEach((k, kIndex) => {
                let obj = {
                  questionId: k.id,
                  studentAnswer: []
                };
                if (k.contentJson[this.$refs['qSingleChoiceSmall' + iIndex][kIndex].currentSelectitem]) {
                  obj.studentAnswer.push(k.contentJson[this.$refs['qSingleChoiceSmall' + iIndex][kIndex].currentSelectitem]);
                } else {
                  this.allAnswer = false;
                }
                this.submitAnswerArray.push(obj);
              });
            }
            if (j.type == 2) {
              j.childList.forEach((k, kIndex) => {
                let obj = {
                  questionId: k.id,
                  studentAnswer: []
                };
                if (this.$refs['qFillSmall' + iIndex][kIndex].valueResult.length) {
                  obj.studentAnswer = this.$refs['qFillSmall' + iIndex][kIndex].valueResult;
                } else {
                  this.allAnswer = false;
                }
                this.submitAnswerArray.push(obj);
              });
            }
          });
        }
        // 其他
        if (i.type == 6) {
          i.childList.forEach((j, jIndex) => {
            let obj = {
              questionId: j.id,
              studentAnswer: []
            }
            if (this.$refs.qWriting[jIndex].homeWorkPhotosStr) {
              obj.studentAnswer.push(this.$refs.qWriting[jIndex].homeWorkPhotosStr);
            } else {
              this.allAnswer = false;
            }
            this.submitAnswerArray.push(obj);
          });
        }
      });
    },

    // 提交表单
    submitForm() {
      this.getAnswer();
      console.log(this.allAnswer);
      console.log(this.submitAnswerArray);
      // return;
      if (this.allAnswer) {
        this.submitHomework();
      } else {
        this.submitDialogVisible = true;
      }
      // this.submitDialogVisible = true;
    },

    // 提交结果
    submitResult() {
      this.submitDialogVisible = false;
      this.submitHomework();
    },

    // 查看详情
    reviewResult() {
      this.resultDialogVisible = false;
      this.back();
      this.pageStatus = 'completed';
    },

    // 深克隆
    deepClone(data) {
      let _data = JSON.stringify(data),
        dataClone = JSON.parse(_data);
      return dataClone;
    }

  }

}

</script>
<style scoped lang="stylus">
.container-x {
  background: #fff;
  padding: 50px 0;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 2px 2px 5px #888888;

  .hw-container {
    box-sizing: border-box;
    width: 890px;
    margin: 0 auto;
    /*background: #fbe9e7;*/

    .hw-item-box {
      /*padding: 20px 0;*/
    }

    .sub-title {
      font-size: 18px;
      color: #34364d;
      margin: 30px 0 20px;
    }

    .fill-box {
      padding-top: 30px;
    }

    .sort-box {
      padding-top: 30px;
    }

    .matching-box {
      padding-bottom: 60px;
    }

    .matching-item {
      padding-left: 40px;
    }

    .btn-group {
      width: 440px;
      height: 44px;
      margin: 30px auto;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 42px;
      cursor: pointer;

      .save-btn {
        width: 120px;
        color: #6E70A0;
        border-radius: 6px;
        display: flex;
        justify-content: center;

        img {
          width: 26px;
          height: 26px;
          margin-right: 10px;
          margin-top: 7px;
        }
      }

      .save-btn:hover,
      .submit-btn:hover {
        background: #6E70A0;
        color: #fff;
        transition: all 0.1s linear;
      }

      .submit-btn {
        width: 300px;
        border: 2px solid #6E70A0;
        border-radius: 6px;
        color: #6E70A0;
        display: flex;
        justify-content: center;

        img {
          width: 30px;
          height: 25px;
          margin-right: 10px;
          margin-top: 6px;
        }
      }
    }
  }

}


/*提交 dialog*/
.submit-dialog {

  .tips {
    display: block;
    text-align: center;
    font-size: 18px;
    line-height: 28px;
    color: #333;
  }

  button {
    width: 160px;
  }
}

/*结果 dialog*/
.result-dialog {
  text-align: center;

  .title {
    color: #34364D;
    text-align: center;
    font-size: 28px;
    margin-bottom: 25px;
  }

  .result-count {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    line-height: 28px;
  }

  img {
    display: block;
    width: 144px;
    height: 100px;
    margin: 0 auto 20px;
  }

  .result-tips {
    color: #333;
    font-size: 18px;
    line-height: 28px;
  }

  button {
    width: 340px;
  }
}

.judge {
  width: 40px;
  margin-top: 25px;
}

.hw-no-work {
  color: #EB532F;
}

.right-icon,
.wrong-icon {
  img {
    width: 28px;
    height: 28px;
    margin: 0 auto;
  }
}

</style>
