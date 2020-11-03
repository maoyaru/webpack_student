<template>
  <div class="questionnaire">
    <header>
      <div class="header-content">
        <div class="c-user-info thidden">
          <div class="c-student el-avatar img fl" v-if="!studentInfo.avatar"></div>
          <img
            class="c-student el-avatar img fl br"
            v-if="studentInfo.avatar"
            :src="studentInfo.avatar"
          />
          <span class="f20">{{studentInfo.realName}}</span>
        </div>
        <div class="c-exam-title f16">
          <span>{{isEnLanguage?'Take one minute to answer the following questions, and we will arrange the most suitable course and teacher for the child.':'完成问卷，以便我们为您安排最合适的老师和课程'}}</span>
        </div>
      </div>
    </header>
    <div class="m-subject">
      <section
        v-for="(item, index) in subjects"
        :key="index"
        :data-no="item.no"
        v-show="item.no === activeNo && !loadQuestionnaireFailed"
      >
        <!-- 题目 -->
        <div class="title f26">{{isEnLanguage? item.title_en : item.title_zh}}</div>
        <!-- 选项 -->
        <div v-if="item.alternatives.length > 10" style="width: 700px;">
          <div style="width: 50%;float: left;"
            class="option-item"
            v-for="(optionItem, optionIndex) in item.alternatives"
            :key="item.no-optionIndex"
            v-show="optionItem.detail.content != ''"
            @click="saveOption(item, optionItem)"
            :class="{'option-active': optionItem.id === activeOption}"
          >
            <div
              class="text f20 iptbox"
            >{{isEnLanguage? optionItem.detail.content_en : optionItem.detail.content}}</div>
            <input
              type="text"
              class="other-area"
              v-if="isShowOtherArea(item, optionItem)"
              v-model="otherArea"
            />
          </div>
        </div>
        <div v-else>
          <div
            class="option-item"
            v-for="(optionItem, optionIndex) in item.alternatives"
            :key="item.no-optionIndex"
            v-show="optionItem.detail.content != ''"
            @click="saveOption(item, optionItem)"
            :class="{'option-active': optionItem.id === activeOption}"
          >
            <div
              class="text f20 iptbox"
            >{{isEnLanguage? optionItem.detail.content_en : optionItem.detail.content}}</div>
            <input
              type="text"
              class="other-area"
              v-if="isShowOtherArea(item, optionItem)"
              v-model="otherArea"
            />
          </div>
        </div>
      </section>
      <!-- 结果 -->
      <section v-show="activeNo === 'result' && submitResultSuccess" class="result">
        <div class="info">
          <img class="c-student el-avatar br" :src="studentInfo.avatar" alt />
          <p>{{isEnLanguage?`Recommended course for ${studentInfo.realName} is`:`推荐${studentInfo.realName}学习`}}</p>
        </div>
        <div class="test-result">
          <p class="edition f24">{{isEnLanguage?editionRoleEn[edition]:editionRoleZh[edition]}}</p>
          <p class="level comfortaa">Level {{level}}</p>
        </div>
        <p>{{isEnLanguage?'*The level here is for reference only , specific rating is determined by your teacher.':'*此处的级别仅供参考，正式级别由老师确定'}}</p>
        <div class="result-btns">
          <div class="close" v-if="isPC()" @click="jumpToBooking('close')">{{isEnLanguage?'Close':'关闭'}}</div>
          <div class="booking" :class="{'booking-mobile':!isPC}" @click="jumpToBooking('booking')">{{isEnLanguage?'Book Class':'约课'}}</div>
        </div>
      </section>
    </div>
    <!-- 加载问卷失败展示重新加载按钮 -->
    <div v-if="loadQuestionnaireFailed" class="resubmit-section">
      <span>{{isEnLanguage?'Failed to load questionnaire, click to reload':'加载问卷失败，点击重新加载'}}</span>
      <div @click="loadQuestionnaire" class="resubmit">{{$t('reload')}}</div>
    </div>
    <div v-if="submitResultFailed" class="resubmit-section">
      <span>{{isEnLanguage?'Failed to submit result, click to resubmit':'提交问卷结果失败，点击重新提交'}}</span>
      <div @click="submitResult" class="resubmit">{{isEnLanguage?'submit':'提交'}}</div>
    </div>
    <div class="jump-btns" v-if="activeNo != 'result' && !loadQuestionnaireFailed">
      <div
        class="last"
        :class="{'disable': activeNo == '33101211', 'can-click': activeNo != '33101211'}"
        @click="toLastSubject"
      >&lt; {{isEnLanguage?'LAST':'上一步'}}</div>
      <div class="next can-click" @click="toNextSubject">{{btnText}} ></div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { saveToLocal, loadFromLocal } from "@/common/js/store";
import datetime from "@/utils/datetime_utils";
import axios from "axios";
// ?uid=${UserData.userId}&id=${UserData.childUserId}&from=mobile&avatar=${UserData.currentChild.avatar}&realName=${UserData.currentChild.realName}&token=${Application.headers['Authorization'].split(' ')[1]}&lang=${Application.isPreferZh?zh:en}'
export default {
  props: {},
  computed: {
    isEnLanguage() {
      if (this.queryArr[2] == "pc") {
        return !(localStorage.localeLanguage == "zh");
      } else {
        return this.queryArr[6] == "zh" ? false : true;
      }
    },
    rules() {
      return {
        "33101211": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "33101142",
              score: null,
              edition: null
            },
            B: {
              to: "33101142",
              score: null,
              edition: null
            },
            C: {
              to: "33101022",
              score: null,
              edition: null
            },
            D: {
              to: "33101142",
              score: null,
              edition: null
            },
            E: {
              to: "33101142",
              score: null,
              edition: null
            }
          }
        },
        "33101142": {
          isAddScore: false,
          isDecideEdition: true,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "33101143",
              score: null,
              edition: this.editionIn
            },
            B: {
              to: "33101143",
              score: null,
              edition: this.editionAd
            }
          }
        },
        "33101143": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: this.edition == this.editionIn ? "30101205" : "31101205",
              score: null,
              edition: null
            },
            B: {
              to: this.edition == this.editionIn ? "30101205" : "31101205",
              score: null,
              edition: null
            },
            C: {
              to: this.edition == this.editionIn ? "30101205" : "31101205",
              score: null,
              edition: null
            },
            D: {
              to: this.edition == this.editionIn ? "30101205" : "31101205",
              score: null,
              edition: null
            }
          }
        },
        "30101205": {
          isAddScore: true,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "result",
              score: 1,
              edition: null
            },
            B: {
              to: "result",
              score: 2,
              edition: null
            },
            C: {
              to: "result",
              score: 3,
              edition: null
            },
            D: {
              to: "result",
              score: 4,
              edition: null
            }
          }
        },
        "31101205": {
          isAddScore: true,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "31101206",
              score: 1,
              edition: null
            },
            B: {
              to: "31101206",
              score: 2,
              edition: null
            },
            C: {
              to: "31101206",
              score: 3,
              edition: null
            },
            D: {
              to: "31101206",
              score: 3,
              edition: null
            },
            E: {
              to: "31101206",
              score: 5,
              edition: null
            }
          }
        },
        "31101206": {
          isAddScore: true,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "result",
              score: 1,
              edition: null
            },
            B: {
              to: "result",
              score: 2,
              edition: null
            },
            C: {
              to: "result",
              score: 3,
              edition: null
            },
            D: {
              to: "result",
              score: 4,
              edition: null
            },
            E: {
              to: "result",
              score: 5,
              edition: null
            }
          }
        },
        "33101022": {
          isAddScore: false,
          isDecideEdition: true,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "30101205",
              score: null,
              edition: this.editionIn
            },
            B: {
              to: "33101033",
              score: null,
              edition: null
            },
            C: {
              to: "31101205",
              score: null,
              edition: this.editionAd
            }
          }
        },
        "33101033": {
          isAddScore: false,
          isDecideEdition: true,
          isDecideLevel: true,
          isDecideLesson: false,
          options: {
            A: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 1
            },
            B: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 2
            },
            C: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 3
            },
            D: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 4
            },
            E: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 5
            },
            F: {
              to: "32101204",
              score: null,
              edition: this.editionSg,
              level: 6
            },
            G: {
              to: "31101205",
              score: null,
              edition: this.editionAd
            },
            H: {
              to: "31101205",
              score: null,
              edition: this.editionAd
            },
            I: {
              to: "31101205",
              score: null,
              edition: this.editionAd
            },
            J: {
              to: "31101205",
              score: null,
              edition: this.editionAd
            }
          }
        },
        "32101204": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: "32101205",
              score: null,
              edition: null
            },
            B: {
              to: "32101205",
              score: null,
              edition: null
            },
            C: {
              to: "32101205",
              score: null,
              edition: null
            },
            D: {
              to: "32101205",
              score: null,
              edition: null
            },
            E: {
              to: "32101205",
              score: null,
              edition: null
            }
          }
        },
        "32101205": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: false,
          options: {
            A: {
              to: this.sgLevelRole[this.level],
              score: null,
              edition: null
            },
            B: {
              to: this.sgLevelRole[this.level],
              score: null,
              edition: null
            },
            C: {
              to: this.sgLevelRole[this.level],
              score: null,
              edition: null
            },
            D: {
              to: this.sgLevelRole[this.level],
              score: null,
              edition: null
            },
            E: {
              to: this.sgLevelRole[this.level],
              score: null,
              edition: null
            }
          }
        },
        "33101220": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 5
            },
            D: {
              to: "result",
              lesson: 7
            },
            E: {
              to: "result",
              lesson: 10
            },
            F: {
              to: "result",
              lesson: 12
            },
            G: {
              to: "result",
              lesson: 14
            },
            H: {
              to: "result",
              lesson: 17
            },
            I: {
              to: "result",
              lesson: 19
            },
            J: {
              to: "result",
              lesson: 21
            },
            K: {
              to: "result",
              lesson: 25
            },
            L: {
              to: "result",
              lesson: 27
            },
            M: {
              to: "result",
              lesson: 29
            },
            N: {
              to: "result",
              lesson: 33
            },
            O: {
              to: "result",
              lesson: 35
            },
            P: {
              to: "result",
              lesson: 37
            },
            Q: {
              to: "result",
              lesson: 41
            },
            R: {
              to: "result",
              lesson: 43
            },
            T: {
              to: "result",
              lesson: 45
            }
          }
        },
        "33101221": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 5
            },
            D: {
              to: "result",
              lesson: 7
            },
            E: {
              to: "result",
              lesson: 10
            },
            F: {
              to: "result",
              lesson: 12
            },
            G: {
              to: "result",
              lesson: 14
            },
            H: {
              to: "result",
              lesson: 17
            },
            I: {
              to: "result",
              lesson: 19
            },
            J: {
              to: "result",
              lesson: 21
            },
            K: {
              to: "result",
              lesson: 25
            },
            L: {
              to: "result",
              lesson: 27
            },
            M: {
              to: "result",
              lesson: 30
            },
            N: {
              to: "result",
              lesson: 32
            },
            O: {
              to: "result",
              lesson: 35
            },
            P: {
              to: "result",
              lesson: 37
            },
            Q: {
              to: "result",
              lesson: 40
            },
            R: {
              to: "result",
              lesson: 42
            },
            T: {
              to: "result",
              lesson: 45
            }
          }
        },
        "33101222": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 6
            },
            D: {
              to: "result",
              lesson: 8
            },
            E: {
              to: "result",
              lesson: 11
            },
            F: {
              to: "result",
              lesson: 13
            },
            G: {
              to: "result",
              lesson: 16
            },
            H: {
              to: "result",
              lesson: 18
            },
            I: {
              to: "result",
              lesson: 21
            },
            J: {
              to: "result",
              lesson: 25
            },
            K: {
              to: "result",
              lesson: 27
            },
            L: {
              to: "result",
              lesson: 31
            },
            M: {
              to: "result",
              lesson: 33
            },
            N: {
              to: "result",
              lesson: 37
            },
            O: {
              to: "result",
              lesson: 39
            },
            P: {
              to: "result",
              lesson: 43
            },
            Q: {
              to: "result",
              lesson: 45
            }
          }
        },
        "33101223": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 6
            },
            D: {
              to: "result",
              lesson: 8
            },
            E: {
              to: "result",
              lesson: 11
            },
            F: {
              to: "result",
              lesson: 13
            },
            G: {
              to: "result",
              lesson: 16
            },
            H: {
              to: "result",
              lesson: 18
            },
            I: {
              to: "result",
              lesson: 21
            },
            J: {
              to: "result",
              lesson: 25
            },
            K: {
              to: "result",
              lesson: 27
            },
            L: {
              to: "result",
              lesson: 31
            },
            M: {
              to: "result",
              lesson: 33
            },
            N: {
              to: "result",
              lesson: 37
            },
            O: {
              to: "result",
              lesson: 39
            },
            P: {
              to: "result",
              lesson: 43
            }
          }
        },
        "33101224": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 6
            },
            D: {
              to: "result",
              lesson: 8
            },
            E: {
              to: "result",
              lesson: 11
            },
            F: {
              to: "result",
              lesson: 13
            },
            G: {
              to: "result",
              lesson: 16
            },
            H: {
              to: "result",
              lesson: 18
            },
            I: {
              to: "result",
              lesson: 21
            },
            J: {
              to: "result",
              lesson: 25
            },
            K: {
              to: "result",
              lesson: 27
            },
            L: {
              to: "result",
              lesson: 31
            },
            M: {
              to: "result",
              lesson: 33
            },
            N: {
              to: "result",
              lesson: 37
            },
            O: {
              to: "result",
              lesson: 39
            },
            P: {
              to: "result",
              lesson: 43
            },
            Q: {
              to: "result",
              lesson: 45
            }
          }
        },
        "33101225": {
          isAddScore: false,
          isDecideEdition: false,
          isDecideLevel: false,
          isDecideLesson: true,
          options: {
            A: {
              to: "result",
              lesson: 1
            },
            B: {
              to: "result",
              lesson: 3
            },
            C: {
              to: "result",
              lesson: 5
            },
            D: {
              to: "result",
              lesson: 7
            },
            E: {
              to: "result",
              lesson: 11
            },
            F: {
              to: "result",
              lesson: 13
            },
            G: {
              to: "result",
              lesson: 15
            }
          }
        }
      };
    },
    btnText() {
      //如果为最后一题，下一步按钮内容应为sunmit
      let lastSubjecyArr = [
        "30101205",
        "31101206",
        "33101220",
        "33101221",
        "33101222",
        "33101223",
        "33101224",
        "33101225"
      ];
      if (lastSubjecyArr.includes(this.activeNo)) {
        return this.isEnLanguage?'Submit':'提交';
      } else {
        return this.isEnLanguage?'Next':'下一步';
      }
    }
  },
  data() {
    return {
      avatar: "",
      queryArr: [],
      studentInfo: {},
      subjects: [],
      totalScore: null,
      options: {
        no: 33101211
      },
      editionDetail: {},
      levelDetail: {},
      scoreArr: [],
      subectArr: ["33101211"],
      activeNo: "33101211",
      edition: null,
      level: null,
      lesson: null,
      otherArea: null, //来自可供选择的地区之外的地区
      activeOption: null,
      submitResultSuccess: false,
      submitResultFailed: false,
      loadQuestionnaireFailed: false,
      levelRole: {
        //计算分数的level规则
        2: {
          //国际版level规则
          1: 1,
          2: 2,
          3: 3,
          4: 4
        },
        1: {
          //高级版level规则
          1: 1,
          2: 1,
          3: 1,
          4: 2,
          5: 2,
          6: 2,
          7: 3,
          8: 4,
          9: 5,
          10: 6
        }
      },
      sgLevelRole: {
        1: "33101220",
        2: "33101221",
        3: "33101222",
        4: "33101223",
        5: "33101224",
        6: "33101225"
      }, //sg版本确定level后显示孩子学校目前在学哪一课
      editionIn: this.ApiConstants.courseEditionIn,
      editionAd: this.ApiConstants.courseEditionNn,
      editionSg: this.ApiConstants.courseEditionSg,
      editionRoleEn: {
        2: 'International Chinese',
        1: 'Advanced Chinese',
        3: 'SG Bilingual Chinese'
      },
      editionRoleZh: {
        2: '国际中文',
        1: '高级中文',
        3: 'SG双语版'
      }
    };
  },
  mounted() {
    //判断来源，如果是来自APP，则从cookie中获取孩子头像和姓名，否则从localstorage中获取
    location.search
      .split("?")[1]
      .split("&")
      .forEach(item => {
        this.queryArr.push(item.split("=")[1]);
      });
    this.loadQuestionnaire();
  },
  methods: {
    isShowOtherArea(item, optionItem) {
      return item.no == "33101211" && optionItem.id == "E";
    },
    saveOption(item, optionItem) {
      this.activeOption = optionItem.id;
      let key = item.no;

      //决定版本与决定level的题与答案分开
      if (!this.edition) {
        this.$set(
          this.editionDetail,
          key,
          this.otherArea ? this.otherArea : optionItem.detail.content
        );
      } else {
        this.$set(
          this.levelDetail,
          key,
          this.otherArea ? this.otherArea : optionItem.detail.content
        );
      }
    },
    toLastSubject() {
      // 第一道题不能回退
      if (this.activeNo == "33101211") {
        return;
      }
      this.activeOption = null;
      let activeNoInfo = this.rules[this.activeNo];

      //如果这道题需要计算分数, 并且已经进行过选择，则从分数数组中删除最后一项
      if (activeNoInfo.isAddScore && this.activeOption) {
        this.scoreArr.pop();
      }

      //如果这道题决定版本，并且已经进行过选择，则应该清除版本
      if (activeNoInfo.isDecideEdition && this.edition) {
        this.edition = null;
      }

      this.subectArr.pop();
      this.activeNo = this.subectArr[this.subectArr.length - 1];
    },
    toNextSubject() {
      if (!this.activeOption) return false;

      //第一道题选择其他地区，地区为必填项
      if (this.activeNo == "33101211") {
        if (this.activeOption == "E") {
          if (!this.otherArea) {
            document.querySelector(".other-area").focus();
            return false;
          }
        }
      }
      let activeNoInfo = this.rules[this.activeNo];
      //如果这道题需要计算分数,存入scoreArr
      if (activeNoInfo.isAddScore) {
        this.scoreArr.push(activeNoInfo.options[this.activeOption].score);
      }

      //如果这道题决定版本，记录版本
      if (activeNoInfo.isDecideEdition) {
        this.edition = activeNoInfo.options[this.activeOption].edition;
      }

      //如果这道题决定level，并且版本为新加坡双语版，则读取选项的level
      if (activeNoInfo.isDecideLevel && this.edition == this.editionSg) {
        this.level = activeNoInfo.options[this.activeOption].level;
      }

      //最后一道题计算level
      if (activeNoInfo.options[this.activeOption].to == "result") {
        if (!this.level) {
          let sum = this.scoreArr.reduce(function(prev, cur) {
            return prev + cur;
          });
          this.level = this.levelRole[this.edition][sum];
        }
        this.submitResult();
      }

      //如果这道题决定lesson，记录lesson
      if (activeNoInfo.isDecideLesson) {
        this.lesson = activeNoInfo.options[this.activeOption].lesson;
      }

      this.activeNo = activeNoInfo.options[this.activeOption].to;
      this.activeOption = null;
      this.subectArr.push(this.activeNo);
    },
    submitResult() {
      this.submitResultFailed = false;

      let activeNoInfo = this.rules[this.activeNo];
      //如果这道题决定lesson，记录lesson
      if (activeNoInfo && activeNoInfo.isDecideLesson) {
        this.lesson = activeNoInfo.options[this.activeOption].lesson;
      }
      let id,
        studentUserId,
        idArr = [];
      id = this.queryArr[0];
      studentUserId = this.queryArr[1];
      
      let submitQuestionnaireParams = {
        edition: this.edition,
        editionDetail: JSON.stringify(this.editionDetail),
        level: this.level,
        levelDetail: JSON.stringify(this.levelDetail),
        studentUserId: Number(studentUserId),
        lessonNo: this.lesson
      };
      if (this.queryArr[2] == "pc") {
        this.$api.course
          .submitQuestionnaire(submitQuestionnaireParams)
          .then(res => {
            if (res.data.code == 200) {
              this.submitResultSuccess = true;
            } else {
              this.submitResultFailed = true;
            }
          }, reason => {
            this.submitResultFailed = true
          });
      } else {
        axios({
          method: "post",
          url: `/api/course/questionnaire/result`,
          headers: {
            "Content-Type": "application/json",
            "X-LNG": this.queryArr[6],
            "X-TZ": datetime.getTimeZone(),
            Authorization: `Bearer ${this.queryArr[5]}`
          },
          data: submitQuestionnaireParams
        }).then(res => {
          if (res.status == 200 && res.data.code == 200) {
            this.submitResultSuccess = true;
          } else {
            this.submitResultFailed = true;
          }
        }).catch(error => {
          this.submitResultFailed = true;
        });
      }
    },
    isPC() {
      let userAgentInfo = navigator.userAgent;
      let Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      ];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    jumpToBooking(str) {
      //如果是学生用户中心跳转过来的，则返回上一页
      if (this.queryArr[2] == "pc") {
        // window.history.back(-1);
        if (str === "close") {
          window.location.href = window.location.origin + "/#/home";
        } else {
          window.location.href = window.location.origin + "/#/booking";
        }
      } else {
        //app接收问卷提交结果
        Questionnaire.postMessage(1);
      }
    },
    loadQuestionnaire() {
      this.loadQuestionnaireFailed = false;
      if (this.queryArr[2] == "pc") {
        this.studentInfo = loadFromLocal(
          "currentStudentInfo",
          "studentInfo",
          null
        );
        //如果已经做过家长问卷直接展示结果
        if (this.studentInfo.courseEditionId) {
          this.activeNo = "result";
          this.edition = this.studentInfo.courseEditionId;
          this.level = this.studentInfo.courseLevel;
        } else {
          this.$api.user.getQuestionnaire().then(res => {
            if (res.data.code == 200) {
              let subjectArr = [];
              res.data.data.forEach(item => {
                subjectArr.push(JSON.parse(item.detail));
              });
              this.subjects = subjectArr;
            } else {
              this.loadQuestionnaireFailed = true;
            }
          }, reason => {
            this.loadQuestionnaireFailed = true;
          });
        }
      } else {
        this.$set(this.studentInfo, "avatar", this.queryArr[3]);
        this.$set(this.studentInfo, "realName", decodeURIComponent(this.queryArr[4]));

        axios({
          method: "get",
          url: `/api/course/questionnaire`,
          headers: {
            "Content-Type": "application/json",
            "X-LNG": this.queryArr[6],
            "X-TZ": datetime.getTimeZone(),
            Authorization: `Bearer ${this.queryArr[5]}`
          }
        }).then(res => {
          if (res.status == 200 && res.data.code == 200) {
            let subjectArr = [];
            res.data.data.forEach(item => {
              subjectArr.push(JSON.parse(item.detail));
            });
            this.subjects = subjectArr;
          } else {
            this.loadQuestionnaireFailed = true;
          }
        }).catch(error => {
          this.loadQuestionnaireFailed = true
        })
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
.br {
  border-radius: 50%;
}

.questionnaire {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url('../../assets/theme-default/images/common/lg-bg.jpg') no-repeat 0 0 / 100% auto;

  header {
    height: 72px;
    background: #F9F9F9;
    box-sizing: border-box;
    padding: 0 30px;
    width: 100%;
    box-shadow: 0 5px 5px rgba(0,0,0,0.1);

    .header-content {
      width: 700px;
      height: 100%;
      display: flex;
      margin: 0 auto;
    }

    .c-exam-title {
      height: 100%;
      line-height: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      margin-left:30px;
    }

    .c-user-info {
      max-width: 300px;
      line-height: 72px;
      float: left;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;


      .c-student {
        width: 60px;
        height: 60px;
        margin: 6px 8px 0 0;

        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }

  // 自定义单选钮
  .option-item {
    cursor: pointer;
    margin-top: 20px;
    text-align: left;
    display: flex;

    .iptbox {
      margin-top: 5px;
      padding-left: 20px;
      bg-image('../../assets/theme-default/images/common/not_chosed');
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 16px 16px !important;
      margin-right: 10px;
      flex: none;
    }

    .text {
      font-family: Rubik-Regular, Rubik;
      color: rgba(51, 51, 51, 1);
    }
  }

  // 自定义单选钮选中
  .option-active {
    .iptbox {
      bg-image('../../assets/theme-default/images/common/chosed');
      background-repeat: no-repeat;
    }

    .text {
      color: #56BECD;
    }
  }

  .resubmit-section {
    flex: 1;
    margin: 0 auto;
    text-align: center;
    div {
      width: 120px;
      text-align: center;
      line-height: 40px;
      border-radius: 8px;
      cursor: pointer;
      margin: 20px auto 0;
      background-color: #4e4f69;
      color: #ffffff;
    }
  }

  .m-subject {
    margin: 0 auto;
    box-sizing: border-box;
    padding: 40px 0 40px 0;
    text-align: center;
    overflow: auto;

    section {
      display: inline-block;
      padding: 0 30px;
      line-height: 1.2;

      .title {
        font-family: Rubik-Medium, Rubik;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        text-align: center;
        margin-bottom: 30px;
      }
    }

    .result {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .test-result {
        width: 400px;
        height: 238px;
        background: url('~@/assets/theme-default/images/home/exam-result.png') no-repeat 0 0 / 100% auto;
        box-sizing: border-box;
        padding-top: 81px;
        padding-bottom: 46px;
        color: #595e9b;

        .edition {
          font-family: Helvetica;
          line-height: 36px;
        }

        .level {
          font-size: 60px;
          font-family: Helvetica;
          font-weight: bold;
        }
      }

      .info {
        text-align: center;

        >img {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }

        p {
          font-size: 16px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 28px;
          margin-bottom: 20px;
        }
      }

      >p {
        margin-top: 38px;
        font-size: 14px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #333;
        line-height: 20px;
      }
    }


    .result-btns, .jump-btns, {
      display: flex;
      max-width: 400px;
      width: 100%;
      margin-top: 30px;
      padding: 0 30px;
      color: #B2B2B2;
      box-sizing: border-box;
      justify-content: center;

      >div {
        display: inline-block;
        width: 204px;
        text-align: center;
        line-height: 40px;
        border-radius: 8px;
        border: 2px solid rgba(178, 178, 178, 1);
        cursor: pointer;
        margin: 0 10px;
      }

      .booking {
        color: #37384C;
        border-color: #37384C;
      }

      .booking-mobile {
        color: white;
        background-color: #595E9B;
        border: none;
      }
    }

  }

  .jump-btns {
    width: 700px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom 30px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    color: #fff;

    .next, .last {
      background: #4E4F69;
      border-radius: 8px;
      width: 120px;
      line-height: 40px;
      border: none;
    }

    .can-click {
      background: #4E4F69;
      cursor: pointer;
    }

    .disable {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  @media screen and (max-width: 768px) {
    background: none;

    input {
      border: none;
      border-bottom: 1px solid #D8D8D8;
    }

    header {
      width: 100%;
      height: 38px;

      .header-content {
        width: 100%;

        .c-exam-title {
          display: none;
        }
      }

      .c-user-info {
        width: 100%;
        line-height: 38px;

        .c-student {
          width: 24px;
          height: 24px;
          margin: 6px 8px 0 0;
        }
      }
    }

    .m-subject {
      width: 100%;
      >section {
        max-width: 100%;
        >div {
          max-width: 100%;
          div.text {
            max-width: 100%;
          }
        }
      }

      section.result {
        padding: 0;

        .result-btns {
          display: flex;
          justify-content: center;
        }
      }
    }

    .c-exam-title {
      display: none;
    }

    .jump-btns {
      width: 100%;

      .next, .last {
        background: none;
        color: #595e9b;
      }

      .disable {
        color: #c4c4c4;
      }
    }

  }
}
</style>
