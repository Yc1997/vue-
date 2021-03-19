<template>
  <div>
    <el-tag type="info" disabled>首页</el-tag>
    <el-tag class="tags" :closable="tabs.length > 1" v-for="(item, index) in tabs" :key="index" @close="close(item, index)" @click="click(item, index)" :type="item.checked ? 'primary' : 'info'">{{
      item.name
    }}</el-tag>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: '',
  data() {
    return {
      isChecked: false,
    }
  },
  created() {},
  computed: {
    ...mapState({
      tabs: (state) => state.tabList,
    }),
    // tagType() {
    //   return this.isChecked ? 'primary' : 'info'
    // },
  },
  methods: {
    ...mapMutations(['removeTag']),
    close(item) {
      if (item.checked && this.tabs.length > 1) {
        let index = this.tabs.indexOf(item)
        this.tabs.splice(index, 1)
        this.tabs[this.tabs.length - 1].checked = true
        let finallyPath = this.tabs[this.tabs.length - 1].path
        this.$router.replace(finallyPath)
        this.$emit('changePath', finallyPath)
        sessionStorage.setItem('path', finallyPath)
        sessionStorage.setItem('tabList', JSON.stringify(this.tabs))

        return
      }
      this.removeTag(item)
    },
    click(item, index) {
      this.$router.replace(item.path)
      this.$emit('changePath', item.path)
      sessionStorage.setItem('path', item.path)
      this.tabs.forEach((item) => {
        item.checked = false
      })
      this.tabs[index].checked = true
      // this.tabs[index].checked = !this.tabs[index].checked
      sessionStorage.setItem('tabList', JSON.stringify(this.tabs))
    },
  },
}
</script>

<style lang='less' scoped>
.tags {
  margin-bottom: 10px;
}
</style>