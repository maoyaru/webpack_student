<template>
  <div class="page-class-detail" v-loading="pageLoading" element-loading-spinner="custom-loading">
    <div class="dash">
      <div class="dash-item" :class="{'dash-item-active': currentTabIndex == 1}" @click="changeCurrentTabIndex(1)">
        <div class="line-1">{{$t('Normal Point Balance')}}</div>
        <div class="line-2" v-if="lessonsInfo">{{lessonsInfo.formalAccount || 0}}</div>
        <div class="line-3" v-if="currentTabIndex == 1 && lessonsInfo"></div>
        <div></div>
      </div>
      <div class="dash-item" :class="{'dash-item-active': currentTabIndex == 2}" @click="changeCurrentTabIndex(2)">
        <div class="line-1">{{$t('Special Point Balance')}}</div>
        <div class="line-2" v-if="lessonsInfo">{{lessonsInfo.dirtAccount || 0}}</div>
        <div class="line-3" v-if="currentTabIndex == 2 && lessonsInfo"></div>
      </div>
    </div>
    <div class="filter-box" tabindex="0" @blur="filterBlur()">
      <div class="filter" @click="filterActiveChange">
        <div v-if="currentFilterCondition == 3">{{$t('Recent 3 month')}}</div>
        <div v-if="currentFilterCondition == 6">{{$t('Recent 6 month')}}</div>
        <div><img src="@/images/order/arrow_down.png"></div>
      </div>
      <div class="filter-item" v-if="filterItemShow">
        <div class="filter-item-single" :class="{'filter-item-single-active': currentFilterCondition == 3}" @click="changeCurrentFilterConditon(3)">{{$t('Recent 3 month')}}</div>
        <div class="filter-item-single" :class="{'filter-item-single-active': currentFilterCondition == 6}" @click="changeCurrentFilterConditon(6)">{{$t('Recent 6 month')}}</div>
      </div>
    </div>
    <div class="list">
      <div>
        <div class="list-item" v-for="(i,index) in listData" :key="index">
          <div class="line-1">
            <div class="line-1-l">{{i.createTime | orderCreateDateToFilter}}</div>
            <div class="line-1-r"><span v-if="i.amount > 0" style="color: #EB532F;">+{{i.amount}}</span><span v-else>{{i.amount}}</span></div>
          </div>
          <div class="line-2">
            <div class="item item-1">
              <div class="item-1-1">
                <div v-if="i.reason == 1">{{i.studentName}}</div>
                <div v-if="i.reason == 2">{{$t('Purchase package')}}</div>
                <div v-if="i.reason == 3">{{$t('Obtained by top-up')}}</div>
                <div v-if="i.reason == 4">{{$t('Top-up bonus')}}</div>
                <div v-if="i.reason == 5">{{$t("Bonus for recommended friend's top-up")}}</div>
                <div v-if="i.reason == 6">{{$t('Free trial class')}}</div>
                <div v-if="i.reason == 10">{{$t('Transfer in')}}</div>
                <div v-if="i.reason == 11">{{$t('Transfer out')}}</div>
                <div v-if="i.reason == 12">{{$t('Compensation of system')}}</div>
                <div v-if="i.reason == 13">{{$t("Penalty on student's absence")}}</div>
                <div v-if="i.reason == 14">{{$t("Compensation for teacher's absence")}}</div>
                <div v-if="i.reason == 15">{{$t("Refund")}}</div>
                <div v-if="i.reason == 16">{{$t("Compensation")}}</div>
                <div v-if="i.reason == 17">{{$t("Refer bonus")}}</div>
                <div v-if="i.reason == 18">{{$t("Bonus for first top-up")}}</div> 
                <div v-if="i.reason == 19">{{$t("Bonus for recommended friend's trial class")}}</div>
                <div v-if="i.reason == 22">{{$t("Free trial class sent by the system")}}</div>
              </div>
            </div>
            <div class="item item-2">
              <!-- <div class="item-3-1" v-if="i.reason == 1 || i.reason == 13 || i.reason == 14 ">{{$t(levelTitle(i.courseEditionId))}} Level{{i.courseLevel}} Lesson{{i.lessonNo}}</div> -->
              <div class="item-3-1" v-if="i.reason == 1 || i.reason == 13 || i.reason == 14 ">{{$t(levelTitle(i.courseEditionId))}} {{i.lessonDescription}}</div>
            </div>
            <img
              v-if="i.classTypeId === 2 && i.amount < 0 && (i.reason == 1 || i.reason == 13 || i.reason == 14)"
              class="icon-group"
              src="@/images/order/icon-group.png"
            />
            <div class="item item-3">
              <div class="item-3-1" v-if="i.reason == 1 || i.reason == 13 || i.reason == 14 ">{{i.teacherName}}</div>
            </div>
            <div class="item item-4">
              <div class="item-4-1">
                <span v-if="i.reason == 1">{{$t('Class attended')}}</span>
                <span v-if="i.reason == 2 || i.reason == 3 || i.reason == 4">{{$t('Order number')}}：{{i.orderNo}}</span>
                <span v-if="i.reason == 5">{{i.otherUserName}}</span>
                <span v-if="i.reason == 6">{{i.otherUserName}}</span>
                <span v-if="i.reason == 10">{{i.otherUserName}}</span>
                <span v-if="i.reason == 11">{{i.otherUserName}}</span>
                <span v-if="i.reason == 12">{{i.otherUserName}}</span>
                <span v-if="i.reason == 13">{{$t('Penalty on absent')}}</span>
                <span v-if="i.reason == 14">{{i.otherUserName}}</span>
                <span v-if="i.reason == 15 && i.orderNo">{{$t('Order number')}}：{{i.orderNo}}</span>
                <span v-if="i.reason == 16">{{i.otherUserName}}</span>
                <span v-if="i.reason == 17">{{i.otherUserName}}</span>
                <span v-if="i.reason == 18">{{i.otherUserName}}</span>
                <span v-if="i.reason == 19">{{i.otherUserName}}</span>
                <span v-if="i.reason == 22">{{i.otherUserName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="see-more" v-if="!pageLoading && !allLoaded" @click="loadListData">{{$t('SEE MORE')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index"
import { mapGetters } from 'vuex'
export default {

  name: 'classDetail',

  data() {
    return {
      allLoaded: false,
      pageLoading: false,
      filterItemShow: false,
      currentTabIndex: 1,
      currentFilterCondition: 3,
      listData: [],
      standardClassListData: [],
      specialClassListData: [],
      pathParameter: {
        pageNum: 1,
        pageSize: 10,
        parentUserId: null,
        type: null,
        startTime: moment().subtract(3, "months").format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
      },
      lessonsInfo: null,
      userParentInfo: this.$store.state.user.user.userParentInfo
    }
  },

  created() {
    this.currentTabIndex = this.$route.query.type ? this.$route.query.type : 1
  },

  mounted() {
    this.loadListData()
    this.getAccountLessons()
  },

  computed: {
    ...mapGetters({
      parentInfo: 'user/getParentInfo'
    }),
  },

  methods: {
    levelTitle(courseEditionId) {
      let filter = Vue.filter('levelTitle')
      return filter(courseEditionId);
    },
    filterActiveChange() {
      this.filterItemShow = !this.filterItemShow
    },
    filterBlur() {
      this.filterItemShow = false
    },
    changeCurrentFilterConditon(e) {
      this.filterItemShow = false
      this.currentFilterCondition = e
      this.pathParameter.startTime = moment().subtract(e, "months").format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
      this.allLoaded = false
      this.pathParameter.pageNum = 1
      this.listData = []
      this.loadListData()
    },
    loadListData() {
      this.pageLoading = true
      let params = {
        startTime: this.pathParameter.startTime
      }
      api.order.getLessonList(this.pathParameter.pageNum, this.pathParameter.pageSize, this.parentInfo.id, this.currentTabIndex, params).then(res => {
        this.pageLoading = false
        if (res.status === 200 && res.data.code === 200) {
          this.allLoaded = res.data.data.pageNum >= res.data.data.totalPage
          this.listData = this.listData.concat(res.data.data.list)
          this.pathParameter.pageNum++
        } else {
          this.$message(res.data.message)
        }
      })
    },
    changeCurrentTabIndex(index) {
      this.currentTabIndex = index
      this.allLoaded = false
      this.pathParameter.pageNum = 1
      this.listData = []
      this.loadListData()
    },
    getAccountLessons() {
      const userId = this.userParentInfo.id
      this.$api.finance.getAccountLessons({ userId }).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.lessonsInfo = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            center: true
          });
        }
      }, err => {
        console.log('err', err)
      })
    },
  }

}

</script>
<style scoped lang="stylus">
* {
  box-sizing: border-box;
}

.page-class-detail {
  height: 100%;

  .dash {
    height: 110px;
    background: #fff;
    box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 0 50px;
    display: flex;

    .dash-item {
      min-width: 120px;
      text-align: center;
      margin-right: 100px;
      cursor: pointer;
      color: #34364D;

      .line-1 {
        font-size: 20px;
        padding-top: 20px;
        margin-bottom: 15px;
      }

      .line-2 {
        font-size: 30px;
        margin-bottom: 10px;
      }

      .line-3 {
        height: 4px;
        width: 100px;
        margin: 0 auto;
        background: #56BECD;
      }

      &.dash-item-active {
        color: #56BECD;
      }
    }
  }

  .filter-box {
    position: relative;
    min-width: 160px;
    display: inline-block;

    .filter {
      margin-bottom: 20px;
      min-width: 160px;
      height: 40px;
      background: #fff;
      border-radius: 48px;
      border: 1px solid rgba(89, 94, 155, 1);
      padding: 0 26px;
      display: flex;
      justify-content: space-between;
      line-height: 38px;
      color: #6E70A0;
      cursor: pointer;

      img {
        width: 20px;
        height: 10px;
      }
    }

    .filter-item {
      position: absolute;
      top: 50px;
      left: 0;
      min-width: 160px;
      height: 78px;
      border: 1px solid #6E70A0;
      border-radius: 8px;
      background: #fff;
      padding-top: 10px;

      .filter-item-single {
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        padding: 0 20px;
        color: #34364D;
        cursor: pointer;

        &.filter-item-single-active {
          color: #fff;
          background: #6E70A0;

          &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
      }
    }
  }

  .list {
    .list-item {
      min-height: 110px;
      background: #fff;
      box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 0 30px;

      .line-1 {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        border-bottom: 2px solid #DEDEDE;
        color: #999;

        .line-1-l {
          color: #666;
        }
      }

      .line-2 {
        display: flex;

        .item {
          width: 25%;
          padding-top: 18px;

          &.item-1 {
            .item-1-1 {
              font-size: 18px;
              color: #34364D;

              img {
                width: 60px;
                vertical-align: top;
                margin-top: -3px;
              }
            }

            .item-1-2 {
              font-size: 14px;
              color: #666;
              margin-top: 6px;
            }
          }

          &.item-2 {
            text-align: center;

            .item-2-1 {
              color: #34364D;
              margin-bottom: 10px;
              font-size: 18px;
            }

            .item-2-2 {
              color: #999;
              font-size: 14px;
              text-decoration: line-through;
            }
          }

          &.item-3 {
            text-align: center;

            .item-3-1 {
              color: #34364D;
              font-size: 18px;
              margin-bottom: 10px;
            }

            .item-3-2 {
              color: #999;
              font-size: 14px;
            }
          }

          &.item-4 {
            display: flex;
            justify-content: flex-end;

            .item-4-1 {
              color: #666;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .see-more {
    border: 2px solid #D78F25;
    width: 150px;
    height: 26px;
    line-height: 22px;
    text-align: center;
    border-radius: 8px;
    font-size: 16px;
    color: #D78F25;
    cursor: pointer;
    margin: 0 auto;

    &:hover {
      color: #fff;
      background: #D78F25;
      transition: all .25s linear;
    }
  }
}
.icon-group {
  width: 64px;
  height: 24px;
  margin-top: 15px;
}
</style>
