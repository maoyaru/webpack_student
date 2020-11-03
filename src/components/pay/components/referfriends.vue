<template>
  <div class="lg-pay refer-firends">
    <h1 class="lg-title">{{$t('Refer friends to get bonus classes')}}</h1>
    <el-card>
      <el-row :gutter="50">
        <el-col :span="15" class="info">
          <p
            class="lhx36"
          >{{$t('Share the joy of learning Chinese and its culture with your friends to make learning more fun and effective!')}}</p>
          <p
            class="lhx36"
          >{{$t('When your friend purchases 25 or more classes with us, you will receive an additional 3 FREE classes. Your friend will receive 1 FREE class!')}}</p>
          <p
            class="lhx36"
          >{{$t('Refer as many friends as you want - the more you refer, the more FREE classes you could get!')}}</p>
          <p class="lhx36">{{$t('Start sharing the joy with your friends now!')}}</p>
        </el-col>
        <el-col :span="9">
          <a target="_blank" :href="'https://twitter.com/share?text=lingoace&url='+encodeURIComponent(url)" class="btn-facebook"></a>
          <a target="_blank" :href="'http://www.facebook.com/sharer.php?u='+ encodeURIComponent(url)+'&t='+encodeURIComponent('lingoace')" class="btn-twitter"></a>
          <h3>{{$t('Your referral link')}}</h3>
          <el-row>
            <el-col :span="15" class="net-url">
              <textarea class="copy-box" type="text" readonly id="copyact" name v-model="url"></textarea>
            </el-col>
            <el-col :span="9" class="btn-copy-warpper">
              <el-button type="info" size="small" plain round @click="copyAct">{{$t('Copy')}}</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="18">
            <el-col :span="12" class="qrCode">
              <div id="qrcode"></div>
            </el-col>
            <el-col :span="12" class="tip">{{$t('Scan QR Code to share to your friends')}}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <div class="bonus">
      <div class="bonus-num">{{referSummary.bonusClasses}}</div>
      <dl>
        <dt>
          <label for>{{$t('BONUS CLASSES')}}</label>
        </dt>
        <dd>
          <label for>{{$t('Joined')}}</label>
          <span>{{referSummary.joinedFriends}}</span>
        </dd>
        <dd>
          <label for>{{$t('Attend Trial class')}}</label>
          <span>{{referSummary.trialClasses}}</span>
        </dd>
        <dd>
          <label for>{{$t('Top-up more than 20 points')}}</label>
          <span>{{referSummary.topupFriends}}</span>
        </dd>
      </dl>
    </div>
    <h1 class="lg-title">
      {{$t('Referral Details')}}
      <span class="new-time">{{$t('Show details after 2020-05-20')}}</span>
    </h1>
    <el-card>
      <table class="lg-list">
        <thead>
          <th>{{$t('Name')}}</th>
          <th>{{$t('Joined date')}}</th>
          <th>{{$t('Trail date')}}</th>
          <th>{{$t('Top-up date')}}</th>
          <th>{{$t('Top-up points')}}</th>
          <th>{{$t('Your bonus')}}</th>
        </thead>
        <tbody>
          <tr v-for="(item,key) in referDetail.list" :key="key">
            <td>
              <span v-if="item.userName">{{item.userName}}</span>
            </td>
            <td>
              <span
                v-if="item.createTime"
              >{{DateTimeUtils.formartDateFromUTC(item.createTime,'yyyy.MM.dd')}}</span>
            </td>
            <td>
              <span
                v-if="item.startTime"
              >{{DateTimeUtils.formartDateFromUTC(item.startTime,'yyyy.MM.dd')}}</span>
            </td>
            <td>
              <span
                v-if="item.rechargeTime"
              >{{DateTimeUtils.formartDateFromUTC(item.rechargeTime,'yyyy.MM.dd')}}</span>
            </td>
            <td>
              <span v-if="item.rechargeAmount">{{item.rechargeAmount}}{{$t('Points')}}</span>
            </td>
            <td>
              <span v-if="item.bonus">{{item.bonus}}{{$t('Points')}}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <footer>
        <el-pagination
          v-if="tableData && tableData.totalPage > 1"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :total="tableData && tableData.totalPage*10"
        ></el-pagination>
      </footer>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/api";

export default {
  components: {},
  data() {
    //这里存放数据
    return {
      pageNum: 1,
      pageSize: 10,
      referSummary: [],
      referDetail: [],
      tableData: [],
      // url: window.location.origin + "/login.html?type=register",
      url: window.location.origin + "/referLogin.html",
      currentPage1: 1,
      currentPage: 1,
      list: [
        {
          classTime: "FriendName123",
          lesson: "2019.02.01",
          student: "2019.02.01",
          teacher: "2019.02.01",
          consumePoint: "50points",
          yourBonus: "3 points"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUserInfo"
    })
  },
  methods: {
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage) {
      // this.currentPage = currentPage;
      this.pageNum = currentPage;

      this.getrefDetail();
    },
    copyAct() {
      let str = this.url;
      if (window.clipboardData) {
        return window.clipboardData.setData("text", str);
      }
      var save = function(e) {
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
      };
      document.addEventListener("copy", save);
      document.getElementById("copyact").select();
      document.execCommand("copy", false, null);
      document.removeEventListener("copy", save);
      this.$message({
        message: "Replication success"
      });
    },
    //汇总
    getrefSummary() {
      const params = {
        parentUserId: this.user.userParentInfo.id
      };
      api.refer.referSummary(params.parentUserId).then(({status, data}) => {
        if (status == 200 && data.code == 200) {
          this.referSummary = data.data;
        }
      });
    },
    //明细
    getrefDetail() {
      const params = {
        parentUserId: this.user.userParentInfo.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      api.refer
        .referDetail(params.parentUserId, params.pageNum, params.pageSize)
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            this.referDetail = data.data;
            this.tableData = data.data;
          }
        });
    }
  },
  created() {
    this.url += "?referrerId=" + this.user.userParentInfo.id;
    this.getrefSummary();
    this.getrefDetail();
  },
  mounted() {
    // 生成分享二维码
    let func = () => {
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          width: 100,
          height: 100,
          correctLevel: QRCode.CorrectLevel.H
        });
        qrcode.makeCode(this.url);
      },
      isCalled = true;
    try {
      func();
    } catch (e) {
      isCalled = false;
    }
    if (!isCalled) {
      if (typeof window.onload != "function") {
        window.onload = func;
      } else {
        let oldonload = window.onload;
        window.onload = function() {
          oldonload();
          func(); //调用当前事件函数
        };
      }
    }
  }
};
</script>
<style lang='stylus' scoped>
.refer-firends {
  width: 960px;
  font-family: Rubik-Regular, Rubik;

  .info {
    p {
      font-size: 16px;
      font-weight: 400;
      color: rgba(52, 54, 77, 1);
      line-height: 24px;
    }
  }

  .btn-facebook, .btn-twitter {
    display: block;
    width: 290px;
    height: 48px;
    margin-top: 20px;
  }

  .btn-facebook {
    bg-image('../../../assets/theme-default/images/pay/icon-facebook');
  }

  .btn-twitter {
    bg-image('../../../assets/theme-default/images/pay/icon-twitter');
  }

  .copy-box {
    border: none;
    resize: none;
    overflow: hidden;
    height: 60px;
    color:rgba(110,112,160,1);
  }

  h3 {
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 19px;
    margin-top: 20px; 
    margin-bottom: 6px;
  }

  .net-url {
    font-size: 14px;
    font-weight: 400;
    color: rgba(110, 112, 160, 1);
    line-height: 22px;
  }

  .qrCode {
    img {
      width: 120px;
      height: 120px;
      background: #ccc;
      display: block;
    }
  }

  .tip {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 24px;
    display: table;
    padding-top: 30px;
    margin-left: -50px;
    height: 60px;
  }

  .btn-copy-warpper {
    padding-top: 5px;
    text-align: center;
  }

  .bonus {
    height: 140px;
    margin-top: 20px;
    background: url('~@/assets/theme-default/images/pay/pic_chongzhi_banner3.png') no-repeat 0 0/100% auto;
    position:relative;
    .bonus-num{
      position: absolute;
      left: 52px;
      top: 22px;
      font-size: 46px;
      color: #fff;
      width: 106px;
      height: 106px;
      /* background: rgba(0,0,0,.3); */
      text-align: center;
      line-height: 106px;
    }
    dl {
      display: flex;
      padding: 30px;
      text-align: center;
      color: #fff;

      dd, dt {
        margin: 0;
        padding: 0;
      }

      dt {
        flex: 0 145px;
        padding-top: 75px;
      }

      dd {
        flex: 1;
        font-size: 18px;
        margin-top: 15px;

        label {
          font-size: 20px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
          display: block;
        }

        span {
          font-size: 30px;
          line-height: 48px;
        }

        &:last-child {
          flex: 0 270px;
        }
      }
    }
  }

  .lg-list {
    width: 100%;
    background: rgba(244, 244, 244, 1);
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(52, 54, 77, 1);
    line-height: 60px;

    th {
      text-align: left;
      height: 60px;
      font-size: 18px;
      padding: 0 10px;
      box-sizing: border-box;
      border-bottom: 2px solid #fff;
    }

    td {
      font-size: 16px;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }

  footer {
    text-align: right;
    margin: 20px 0;
  }
}

.new-time {
  font-size: 15px;
  color: #666666;
}
</style>