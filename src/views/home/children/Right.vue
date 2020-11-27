<template>
  <div>
     <Breadcrumb 
        index='首页' 
        index1='权限管理' 
        index2='权限列表'>
    </Breadcrumb>
    <el-card>
      <el-table :data="RightsData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="权限路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot='scope'>
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components:{
    Breadcrumb
  },
  data() {
    return {
      RightsData: [],
    }
  },
  created() {
    this.getRightInfo()
  },
  methods: {
    //获取权限列表
    async getRightInfo() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.RightsData = res.data
    },
  },
}
</script>

<style scoped>
</style>