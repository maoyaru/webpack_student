<template>
  <div class="feedback">
    <div class="feedbackItem" v-for="(item, index) in feedbackItems" :key="index">
      <span class="f18">{{$t(index)}}</span>
      <div class="star">
        <i v-for="count in item" :key="index+count" class="lighten-star"></i>
        <i v-for="count in 5-item" :key="index+(5-count+1)" class="grey-star"></i>
      </div>
    </div>
    <p class="comment-time f16">{{time}}</p>
    <div class="comment">
      <span class="f16">{{textDomain}}</span>
      <div class="translate">
        <div class="change-btns">
          <i
            v-for="(item,index) in changeBtns"
            :key="index"
            class="zh"
            :class="{'active':index===ind}"
            @click="changeLanguage(index)"
          >{{item.title}}</i>
        </div>
        <div class="words">
          <i class="translate_icon"></i>
          <span class="f16">{{$t('Translated by Google translation')}}</span>
        </div>
      </div>
      <i class="little-arrow"></i>
    </div>
  </div>
</template>

<script>
import datetimeUtils from "../../../utils/datetime_utils";
export default {
  props: ["teachercomment"],
  data() {
    return {
      feedbackItems: {
        "Learning Result": 0,
        "Learning Progress": 0,
        "Learning Attitude": 0
      },
      textDomain: "",
      time: "",
      ind: 0,
      lang: window.localStorage.getItem("localeLanguage"),
      changeBtns: [{ title: "English" }, { title: "中文" }]
    };
  },
  watch: {
    teachercomment() {
      this.feedbackItems["Learning Result"] = this.teachercomment.ratingPk;
      this.feedbackItems["Learning Progress"] = this.teachercomment.ratingId;
      this.feedbackItems["Learning Attitude"] = this.teachercomment.ratingLe;
      if (this.lang == "zh") {
        this.ind = 1;
        this.textDomain = this.teachercomment.commentZh;
      } else {
        this.ind = 0;
        this.textDomain = this.teachercomment.commentEn;
      }
    }
  },
  methods: {
    changeLanguage(index) {
      this.ind = index;
      if (index === 0) {
        this.textDomain = this.teachercomment.commentEn;
      } else {
        this.textDomain = this.teachercomment.commentZh;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.feedback {
  margin-top: 10px;

  .feedbackItem {
    padding: 0 500px 0 30px;
    line-height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: rgba(178, 178, 178, 1);
  }

  .star {
    display: flex;
    justify-content: space-between;

    .lighten-star, .grey-star {
      display: block;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
    }

    .lighten-star {
      bg-image('../../../assets/theme-default/images/history/xingxing');
    }

    .grey-star {
      bg-image('../../../assets/theme-default/images/history/greystar');
    }
  }

  .comment-time {
    margin-top: 20px;
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
    
    span {
      line-height: 24px;
    }

    .translate {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-bottom: 13px;

      .change-btns {
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
          margin-left: 10px;
        }

        .active {
          background: rgba(103, 107, 168, 1);
          color: rgba(255, 255, 255, 1);
        }
      }

      .words {
        color: rgba(153, 153, 144, 1);
        display: flex;
        align-items: center;

        .translate_icon {
          display: inline-block;
          width: 39px;
          height: 36px;
          bg-image('../../../assets/theme-default/images/history/translation');
          background-size: 100%;
          margin-right: 20px;
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
}
</style>
