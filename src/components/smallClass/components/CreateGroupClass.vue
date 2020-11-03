<template>
  <el-dialog
    :visible.sync="showCreatClass"
    :show-close="false"
    :title="$t('Create a group')"
    width="800px"
    :center="true"
    :before-close="closeCreatClass"
    append-to-body
    class="m-alert-dialog-with-title"
  >
    <div class="c-group-create f20">
      <div class="course">
        <span>{{$t('Course')}}</span>
        <span class="edition">{{$t(courseEdition)}}{{getStudentEditionInfo}}</span>
      </div>
      <p class="plan">{{$t('Planned Class Time')}}</p>
      <el-input
        type="textarea"
        :rows="5"
        :placeholder="placeholder"
        v-model="remark"
        class="c-group-textarea"
      >
      </el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="w330" @click="closeCreatClass">{{$t('CANCEL')}}</el-button>
      <el-button class="w330" type="primary" @click="creatSmallClass">{{$t('CONFIRM')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
export default {
  props: ["showCreatClass"],
  data() {
    return {
			currentStudent: {},
      remark: '',
      placeholder: this.$i18n.t('Write down your planned class time so that other students can decide whether to join your group or not. The accurate class time shall be based on the actual appointment. e.g. around 21:00 every Wed, around 16:00 every Sat, Limited to 200 characters')
    };
  },
  computed: {
    getStudentEditionInfo: function() {
      let currentStudent = JSON.parse(window.localStorage.getItem("__lgzy__s__")).currentStudentInfo.studentInfo
      this.currentStudent = currentStudent;
      currentStudent.courseLevel = currentStudent.courseLevel == '7' ? '5h' : (currentStudent.courseLevel == '8' ? '6h' : currentStudent.courseLeve);
			if (localStorage.localeLanguage == 'zh') {
        return ` Level${currentStudent.courseLevel} Lesson${currentStudent.lessonNo}`
      } else {
        return ` Level${currentStudent.courseLevel} Lesson${currentStudent.lessonNo}`
      }
    },
    courseEdition() {
      let filter = Vue.filter('levelTitle')
      return filter(this.currentStudent.courseEditionId);
    }
  },
  methods: {
    closeCreatClass() {
      this.$emit("closeDialog")
    },
    creatSmallClass() {
      let params = {
        classTypeId: this.ApiConstants.classTypeSmallclass,
        remark: this.remark,
        userId: localStorage.currentChild
      }
      this.$api.classroom.createClass(params)
      .then( res => {
        if (res.data.code === 200) {
          this.closeCreatClass()
          this.$parent.$refs.joinedClass.dataInfo()
        } else {
          this.closeCreatClass()
        }
      })
    }
  },
};
</script>