<template>
  <div>
    <Breadcrumb index="首页" index1="商品管理" index2="商品列表"> </Breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="clearGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="goPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsData" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170">
          <template v-slot="scope">
            {{ scope.row.add_time | formatData }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="editGoods(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table :data="goodsData" border stripe v-else></el-table> -->
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size.sync="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 编辑商品对话框 -->
      <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editRuleForm" :rules="editRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="editRuleForm.goods_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'goods',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      goodsData: [],
      total: 0,
      edidGoodsData: [],
      editDialogVisible: false,
      // 绑定编辑商品信息
      editRuleForm:{
        
      },
      editRules:{

      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: { query: this.queryInfo.query, pagenum: this.queryInfo.pagenum, pagesize: this.queryInfo.pagesize } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // console.log(res)
      this.$message({
        type:'success',
        message:'获取商品列表成功',
        duration:500
      })
      this.goodsData = res.data.goods
      this.total = res.data.total
    },
    //每页条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页数发生改变
    handleCurrentChange(newNum) {
      console.log(newNum)
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 搜索商品
    searchGoods() {
      if (this.queryInfo.query.trim().length === 0) {
        return this.$message.error('请输入您想搜索的商品')
      }
      this.getGoodsList()
    },
    //删除搜索关键词后重新获取数据
    clearGoods() {
      this.getGoodsList()
    },
    //编辑商品
    editGoods(row) {
      console.log(row)
    },
    // 删除商品
    async deleteGoods(row) {
      let confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getGoodsList()
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    },
    goPage(){
      let path = '/goods/add'
      this.$router.push(path)
    }
  },
}
</script>

<style lang='less' scoped>
// .el-input{
//   width: 200px;
// }
</style>