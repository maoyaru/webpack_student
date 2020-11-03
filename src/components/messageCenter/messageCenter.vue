<template>
  <div class="messagePage">
    <!-- <div class="l-header">
            <Top></Top>
            <TopMenu @selectMenu="selectMenu"></TopMenu>
    </div>-->
    <div class="messageConWrapper">
      <div class="messageInner">
        <h3>{{$t('Notification Center')}}</h3>
        <div class="messageList">
          <div class="messageTabs">
            <p
              @click="changeTabIndex(index)"
              :class="{'activetab': index === ind}"
              v-for="(item, index) in tabsData"
              :key="index"
            >
              <span>{{$t(item.text)}}</span>
              <b></b>
            </p>
          </div>
          <div class="messageContent">
            <MessageItem v-for="(item, index) in list" :key="index" :item="item"></MessageItem>
          </div>
          <div class="noData" v-if="list.length === 0">
            <span>{{$i18n.t('No message')}}</span>
          </div>
        </div>
        <div class="pagination" v-show="totalPage != 0">
          <el-pagination
            class="paginationBtns"
            background
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            layout="prev, pager, next"
            :total="totalPage"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "../index/components/Top";
import TopMenu from "../index/components/TopMenu";
import MessageItem from "./components/messageItem";
export default {
  components: {
    Top,
    TopMenu,
    MessageItem
  },
  data() {
    return {
      tabsData: [
        {
          text: "Class"
        },
        {
          text: "Promotion"
        },
        {
          text: "System"
        }
      ],
      ind: 0,
      totalPage: 0,
      pageNum: 1,
      list: []
    };
  },
  watch: {
    ind(newVal, oldVal) {
      this.pageNum = 0;
      if (newVal === 0) {
        this.classMessageAJAX();
      } else if (newVal === 1) {
        this.promotionMessageAJAX();
      } else if (newVal === 2) {
        this.systemMessageAJAX();
      }
    }
  },
  methods: {
    // // 路由跳转钩子函数
    // selectMenu(path) {
    //     this.$router.push(path);
    // },
    // 改变tab下标
    changeTabIndex(index) {
      this.ind = index;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.ind === 2) {
        this.systemMessageAJAX();
      } else if (this.ind === 0) {
        this.classMessageAJAX();
      }
    },
    systemMessageAJAX() {
      let userParentInfo = JSON.parse(
        window.localStorage.getItem("__lgzy__s__")
      ).login_info.user.userParentInfo;
      this.$api.user
        .messageCenter({
          role: this.ApiConstants.userRoleParent,
          userId: userParentInfo.id,
          lastTime: userParentInfo.createTime,
          category: this.ApiConstants.systemMessageCode,
          pageNum: this.pageNum,
          pageSize: this.ApiConstants.messagePageSize
        })
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            data.data.list.forEach(ite => {
              ite.detailObj = JSON.parse(ite.detail);
            });
            this.totalPage = data.data.totalPage * 10;
            this.list = data.data.list;
          }
        });
    },
    classMessageAJAX() {
      let userParentInfo = JSON.parse(
        window.localStorage.getItem("__lgzy__s__")
      ).login_info.user.userParentInfo;
      this.$api.user
        .messageCenter({
          role: this.ApiConstants.userRoleParent,
          userId: userParentInfo.id,
          lastTime: userParentInfo.createTime,
          category: this.ApiConstants.classesMessageCode,
          pageNum: this.pageNum,
          pageSize: this.ApiConstants.messagePageSize
        })
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            data.data.list.forEach(ite => {
              ite.detailObj = JSON.parse(ite.detail);
            });
            this.totalPage = data.data.totalPage * 10;
            this.list = data.data.list;
          }
        });
    },
    promotionMessageAJAX() {
      let userParentInfo = JSON.parse(
        window.localStorage.getItem("__lgzy__s__")
      ).login_info.user.userParentInfo;
      this.$api.user
        .messageCenter({
          role: this.ApiConstants.userRoleParent,
          userId: userParentInfo.id,
          lastTime: userParentInfo.createTime,
          category: this.ApiConstants.promotionMessage,
          pageNum: this.pageNum,
          pageSize: this.ApiConstants.messagePageSize
        })
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            data.data.list.forEach(ite => {
              ite.detailObj = JSON.parse(ite.detail);
            });
            this.totalPage = data.data.totalPage * 10;
            this.list = data.data.list;
          }
        });
    }
  },
  created() {
    this.classMessageAJAX();
  }
};
</script>
<style lang='stylus' scoped>
.messagePage {
  width: 100%;
  height: auto;

  .messageConWrapper {
    width: 100%;
    height: auto;

    .messageInner {
      width: 800px;
      height: 100%;
      margin: 30px auto;
      min-height: 460px;
      position: relative;

      h3 {
        font-size: 28px;
        font-family: Comfortaa-Regular, Comfortaa;
        font-weight: 400;
        color: rgba(215, 143, 37, 1);
        line-height: 35px;
      }

      .messageList {
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;

        .messageTabs {
          width: 100%;
          border-bottom: 1px solid #B2B2B2;
          display: flex;

          p {
            padding: 10px 0;
            margin-right: 80px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;

            span {
              font-size: 18px;
              font-family: Comfortaa-Regular, Comfortaa;
              font-weight: 400;
              color: rgba(52, 54, 77, 1);
              line-height: 22px;
            }

            b {
              width: 48px;
              height: 4px;
              border-radius: 3px;
              margin-top: 6px;
            }
          }

          .activetab {
            span {
              color: #56BECD;
            }

            b {
              background-color: #56BECD;
            }
          }
        }

        .noData {
          width: 100%;
          text-align: center;
          padding-top: 30px;
          color: #ccc;
        }
      }

      .pagination {
        margin-top: 15px;
        width: 100%;
        position: relative;
        text-align: right;

        .paginationBtns {
        }
      }
    }
  }
}
</style>