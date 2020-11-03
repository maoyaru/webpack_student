<template>
  <div class="student-list">
    学生：
    <span
      class="student"
      :class="{'isdot':student.dot}"
      v-for="(student,$key) in students"
      :key="$key"
    >{{student.name}}</span>
  </div>
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {};
  },
  props: {
    students: {
      default: [],
      type: Array
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style lang='stylus' scoped>
.student-list {
  .student {
    padding: 0 3px;

    &:after {
      content: '、';
    }

    &:last-child:after {
      content: '';
    }
  }

  .isdot:before {
    content: '*';
    color: red;
  }
}
</style>