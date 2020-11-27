<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">{{index}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{index1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{index2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>

export default {
  props:{
    index:{
      type:String,
      default:'首页'
    },
    index1:{
      type:String,
      default:''
    },
    index2:{
      type:String,
      default:''
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang='less' scoped>

</style>