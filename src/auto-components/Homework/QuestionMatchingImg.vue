<!-- question-matching -->
<template>
  <div class="line-container">
    <div class="groupA">
      <div v-for="q in question.groupA">
        <div class="item" :class="{'item-active': currentItem == q}" @click="onClickItem(q)">
          {{q.name}}
        </div>
      </div>
    </div>
    <div>
      <canvas id="canvasLine2" style="height: 100px;"></canvas>
    </div>
    <div class="groupB">
      <div v-for="q in question.groupB">
        <div class="item" :class="{'img-item-active': currentItem == q}" @click="onClickItem(q)">
          <img :src="q.imgUrl">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'question-matching',

  data() {
    return {
      // 存放canvas线条组
      canvasLineGroup: [],
      // 存放当前高亮项
      currentItem: null,
      // 存放题目
      question: {
        groupA: [{
            id: 1,
            name: '苹果',
            group: 'A',
            coordinate: {
              x: 60,
              y: 0
            },
            linked: false
          },
          {
            id: 2,
            name: '香蕉',
            group: 'A',
            coordinate: {
              x: 260,
              y: 0
            },
            linked: false
          },
          {
            id: 3,
            name: '鸭梨',
            group: 'A',
            coordinate: {
              x: 460,
              y: 0
            },
            linked: false
          },
          {
            id: 4,
            name: '橘子',
            group: 'A',
            coordinate: {
              x: 660,
              y: 0
            },
            linked: false
          }
        ],
        groupB: [{
          id: 5,
          name: 'apple',
          imgUrl: require('@/images/demo1.png'),
          group: 'B',
          coordinate: {
            x: 60,
            y: 100
          },
          linked: false
        }, {
          id: 6,
          name: 'banana',
          imgUrl: require('@/images/demo2.png'),
          group: 'B',
          coordinate: {
            x: 260,
            y: 100
          },
          linked: false
        }, {
          id: 7,
          name: 'peer',
          imgUrl: require('@/images/demo3.png'),
          group: 'B',
          coordinate: {
            x: 460,
            y: 100
          },
          linked: false
        }, {
          id: 8,
          name: 'orange',
          imgUrl: require('@/images/demo4.png'),
          group: 'B',
          coordinate: {
            x: 660,
            y: 100
          },
          linked: false
        }]
      }
    }
  },

  created() {

  },

  mounted() {

  },

  methods: {

    onClickItem(q) {
      // 之前没有选中状态
      if (!this.currentItem) {
        this.currentItem = q;
      } else {
        // 如果同组替换 || 如果不同组就连线
        if (this.currentItem.group == q.group) {
          this.currentItem = q;
        } else {
          let arr = [];
          arr[0] = this.currentItem;
          arr[1] = q;
          this.checkedLineStatus(this.currentItem.id);
          this.checkedLineStatus(q.id);
          this.canvasLineGroup.push(arr);
          this.drawLine();
          this.currentItem = null;
        }
      }
      console.log(this.currentItem);
    },

    // 划线
    drawLine() {
      // 拿到canvas
      let targetCanvas = document.getElementById('canvasLine2');
      // 设置宽高
      targetCanvas.width = 720;
      targetCanvas.height = 100;
      // 拿到上下文
      let context = targetCanvas.getContext('2d');
      // 设置颜色
      context.strokeStyle = '#6E70A0';
      // 设置线条的宽度
      context.lineWidth = 4;
      // 绘制直线
      context.beginPath();

      this.canvasLineGroup.forEach(item => {
        context.moveTo(item[0].coordinate.x, item[0].coordinate.y);
        context.lineTo(item[1].coordinate.x, item[1].coordinate.y);
      })

      context.closePath();
      context.stroke();
    },

    // 检查是否已经连线了
    checkedLineStatus(targetId) {
      let arr = [];
      this.canvasLineGroup.map((i, index) => {
        if (targetId != i[0].id && targetId != i[1].id) {
          arr.push(i);
        }
      });
      this.canvasLineGroup = arr;
    }
  }

}

</script>
<style scoped lang="stylus">
#canvasLine {
  width: 720px;
  height: 100px;
  display: block;
  background: blue;
}

.groupA,
.groupB {
  display: flex;

  .item {
    box-sizing: border-box;
    width: 120px;
    height: 30px;
    line-height: 30px !important;
    background: #f4f4f4;
    color: #fff;
    line-height: 40px;
    text-align: center;
    margin-right: 80px;
    /*border-radius: 6px;*/
    cursor: pointer;
    color: #34364D;
    border-radius: 15px;
    font-size: 16px;
    text-align: center;
  }

  .item-active {
    background: #6E70A0;
    color: #fff;
  }
}

.groupB .item {
  width: 120px;
  height: 120px;
  border: 1px solid #B2B2B2;
  border-radius: 0;

  &.img-item-active {
    border: 2px solid #6E70A0;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
}

</style>
