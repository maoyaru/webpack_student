<template>
  <div class="smallGroupPage">
    <CreateGroupClass :showCreatClass="showDialog" @closeDialog="closeDialog"></CreateGroupClass>
    <!-- <div class="l-header">
      <Top></Top>
      <TopMenu @selectMenu="selectMenu"></TopMenu>
    </div>-->
    <div class="smallClass">
      <div class="qrcode">
        <div class="code-img">
          <img src="../../assets/theme-default/images/index/phoneapp.png" alt />
        </div>
        <span class="f18">{{$t('Scan to download LingoAce Connect APP')}}</span>
      </div>
      <div class="main">
        <div class="banner">
          <div class="left">
            <p class="title comfortaa f28">{{$t('LingoAce Group Class')}}</p>
            <p
              class="learn f20"
            >{{$t('Learn Chinese with classmates from all over the world')}}</p>
          </div>
          <div class="right">
            <p>{{$t('Better learning effect')}}</p>
            <p>{{$t('More interesting')}}</p>
            <p>{{$t('Lower unit price')}}</p>
          </div>
        </div>
        <div class="creat">
          <div class="image"></div>
          <div class="profile f16">
            <p>{{$t('The planned class time is for reference only. The accurate class time shall be based on the actual appointment. Chat with your classmates about suitable class time on Connect APP , then the owner can book group classes for you all.')}}</p>
            <el-button
              class="creat-group f16"
              @click="showCreateGroup"
            >{{$t('GREATE A GROUP')}}</el-button>
          </div>
        </div>

        <JoinedClass
          :allCount="allCount"
          @changeNotGroupFlag="changeNotGroupFlag"
          ref="joinedClass"
          v-if="notGroup"
        ></JoinedClass>
        <div class="no-class" v-else>
          <div class="image"></div>
          <p class="f16">{{$t('No group class at your level yet , you can create one')}}</p>
          <div class="booking">{{$t('BOOKING')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "../index/components/Top";
import TopMenu from "../index/components/TopMenu";
import CreateGroupClass from "./components/CreateGroupClass";
import JoinedClass from "./components/JoinedClass";
import { mapState } from "vuex";
export default {
  data() {
    return {
      showDialog: false,
      notGroup: true,
      allCount: -1
    };
  },
  created() {
    let parentId = JSON.parse(window.localStorage.getItem("__lgzy__s__"))
      .login_info.user.userParentInfo.id;
    this.$store.dispatch("user/getParentInfoAction", parentId).then(res => {
      this.allCount = res.balance + res.bonusBalance;
    });
  },
  computed: {
    ...mapState("user", {
      user: state => state.user
    })
  },
  methods: {
    showCreateGroup() {
      // let count =
      //   this.user.userParentInfo.balance * 1 +
      //   this.user.userParentInfo.bonusBalance * 1;
      // if (count <= 0) {
      //   this.sureLoading = false;
      //   this.showDialog = false;
      //   this.$message({
      //     message: this.$t("Insufficient class balance, please go to recharge"),
      //     onClose: () => {
      //       this.$router.push({
      //         name: "pay"
      //       });
      //     }
      //   });
      //   return;
      // }
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },
    // selectMenu(path) {
    //   if(path!='/home') {
    //     if(!this.currentStudent.realName) {
    //       // 打开添加孩子弹窗
    //       this.isOpen = true;
    //     }else if(!this.currentStudent.courseLevel) {
    //       let pathname = location.pathname
    //         location.href= `${pathname}questionnaire.html?uid=${this.$store.state.user.user.userParentInfo.id}&id=${this.$store.state.student.currentStudent.id}&from=pc`;
    //       return false;
    //     }else {
    //       this.$router.push(path);
    //     }
    //   }else {
    //     this.$router.push(path);
    //   }
    // },
    changeNotGroupFlag() {
      this.notGroup = true;
    }
  },
  components: {
    Top,
    TopMenu,
    CreateGroupClass,
    JoinedClass
  }
};
</script>

<style scoped lang="stylus">
.smallGroupPage {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
}

.smallClass {
  width: 1200px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 100px;
  flex: 1;

  .qrcode {
    position: absolute;
    top: 220px;
    line-height: 24px;
    width: 180px;
    text-align: center;

    .code-img {
      width: 180px;
      height: 180px;
      background: rgba(216, 216, 216, 1);
      margin-bottom: 20px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .main {
    margin-left: 252px;
    padding-top: 20px;

    .banner {
      width: 100%;
      height: 160px;
      background-size: 100%;
      padding: 30px 0 0 30px;
      box-sizing: border-box;
      bg-image('../../assets/theme-default/images/group/bg_smallClass');
      margin-bottom: 20px;
      display: flex;

      .left {
        margin-right: 78px;

        .title {
          color: rgba(78, 79, 105, 1);
          margin-bottom: 20px;
        }

        .learn {
          color: white;
          width: 370px;
          line-height: 24px;
        }
      }

      .right {
        color: white;

        p {
          margin-bottom: 15px;
        }

        p:before {
          content: '*';
          color: white;
          font-size: 14px;
          height: 10px;
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          line-height: 23px;
        }
      }
    }

    .creat {
      display: flex;
      margin-bottom: 30px;

      .image {
        width: 185px;
        height: 130px;
        background-size: 100%;
        margin-right: 30px;
        bg-image('../../assets/theme-default/images/group/bg_creat');
      }

      .profile {
        padding-top: 33px;
        box-sizing: border-box;
        line-height: 24px;
        color: rgba(52, 54, 77, 1);
        margin-left: 20px;
        flex: 1;
        display: flex;
        justify-content: space-between;

        p {
          width: 525px;
        }

        .creat-group {
          width: 180px;
          height: 60px;
          text-align: center;
          border-radius: 8px;
          border: 1px solid rgba(110, 112, 160, 1);
          background: rgba(110, 112, 160, 1);
          color: white;
          font-weight: 500;
          cursor: pointer;
        }
      }
    }

    .no-class {
      background: #fff;
      padding-top: 80px;
      padding-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0px 4px 8px 4px rgba(182, 182, 182, 0.08);

      .image {
        width: 240px;
        height: 240px;
        bg-image('../../assets/theme-default/images/group/no_group');
        background-size: 100% 100%;
        margin-bottom: 20px;
      }

      p {
        color: rgba(178, 178, 178, 1);
        margin-bottom: 54px;
      }

      .booking {
        width: 300px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        border-radius: 6px;
        border: 2px solid rgba(55, 56, 76, 1);
      }
    }
  }
}
</style>
