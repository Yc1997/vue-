<template>
  <div>
    <el-button :plain="true" type='info' @click="logOut">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logOut(){
      window.sessionStorage.clear()
      this.$message('退出成功')
      this.$router.replace('/login')
    }
  },
}
</script>

<style scoped>
</style>