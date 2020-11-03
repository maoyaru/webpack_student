<template>
  <div class="comment">
    <div class="teachers">
      <p class="f18">{{$t("Teacher's comment")}}</p>
      <div class="no-comment" v-if="teacherCommentFlag">
        <i class="no-comment-pic"></i>
        <span class="f16">{{$t("No teacher's feedback yet")}}</span>
      </div>
      <CommentFromTeacher v-else :teachercomment="teacherComment"></CommentFromTeacher>
    </div>
    <div class="my-feedback">
      <p class="f18">{{$t("My feedback to teacher")}}</p>
      <Feedback v-if="studentCommentFlag" :classinfo="classInfo" :getCommentInfo="getCommentInfo"></Feedback>
      <FeedbackFromMe v-else :studentComment="studentComment"></FeedbackFromMe>
    </div>
  </div>
</template>
 
<script>
import Feedback from "./Feedback";
import CommentFromTeacher from "./CommentFromTeacher";
import FeedbackFromMe from "./FeedbackFromMe";
import request from "../../../api/index";
export default {
  props: ["classInfo"],
  data() {
    return {
      teacherComment: {},
      teacherCommentFlag: false,
      studentComment: {},
      studentCommentFlag: true,
      studentId:
        this.$store.state.student.currentStudent.id ||
        window.localStorage.getItem("currentChild")
    };
  },
  mounted() {
    this.getCommentInfo();
  },
  methods: {
    hideStudentComment() {
      this.studentCommentFlag = false;
    },
    //获取学生评论和老师评论 信息
    getCommentInfo() {
      if (this.classInfo) {
        let { virtualclassId } = this.classInfo;
        request.history
          .getClassedTeacherForStudents(virtualclassId)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data) {
                let teacherCommentLists = res.data.data.filter(
                  item =>
                    item.role === this.ApiConstants.teacherToStudent &&
                    item.studentUserId === this.studentId
                )[0];
                let StudentCommentLists = res.data.data
                  .filter(
                    item => item.role === this.ApiConstants.studentToTeacher
                  )
                  .find(ite => ite.studentUserId == this.studentId);
                if (!teacherCommentLists) {
                  this.teacherCommentFlag = true;
                } else {
                  this.teacherComment = teacherCommentLists;
                }
                if (StudentCommentLists) {
                  this.studentCommentFlag = false;
                  this.studentComment = StudentCommentLists;
                }
              }
            } else {}
          });
      }
    }
  },
  components: {
    Feedback,
    CommentFromTeacher,
    FeedbackFromMe
  }
};
</script>

<style scoped lang="stylus">
.comment {
  margin-top: 24px;

  p {
    margin: 0;
    color: rgba(52, 54, 77, 1);
  }

  .no-comment {
    margin-top: 20px;
    margin-bottom: 30px;
    color: rgba(178, 178, 178, 1);
    text-align: center;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    .no-comment-pic {
      display: inline-block;
      width: 120px;
      height: 120px;
      background: #eee;
      margin-right: 40px;
      border-radius: 50%; 
      bg-image:('../../../assets/theme-default/images/history/noFeedback');
    }
  }

  .my-feedback {
    >p {
      margin-bottom: 10px;
    }
  }
}
</style>
