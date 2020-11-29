<template>
  <div>
    <Breadcrumb 
        index='首页' 
        index1='商品管理' 
        index2='商品分类'>
    </Breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCates">添加分类</el-button>
      <tree-table style="margin-top: 15px" :data="cateList" :columns="columns" border :show-row-hover="false" :selection-type="false" show-index index-text="#" :expand-type="false">
        <!-- 是否有效列 slot要和定义在columns列中template对应 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="level" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="edit" slot-scope="scope">
          <el-button type="primary" size="mini" @click="editCates(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="removeCates(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="50%">
        <el-form :model="addCateForm" :rules="addrules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm" @close="addCateDialogClosed">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 级联选择器 -->
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象，必须要 -->
            <!-- popper-class 漂浮层类名 -->
            <el-cascader v-model="value" :options="addCateList" :props="addCatesProps" @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCatesConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类的对话框 -->
      <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close='editCatesReset'>
          <el-form :model="editCateForm" :rules="addrules" ref="editCateFormRef" label-width="100px" class="demo-ruleForm" >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCatesConfirm">确 定</el-button>
        </span>
      </el-dialog>
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
      // 请求商品分类的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 数据总页数
      total: 0,
      cateList: [],
      // 配置每一列的数据
      columns: [
        {
          label: '分类名称', //每一列的名称
          prop: 'cat_name', //每一个对应的数据名称
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template', // 表示将当前列定义为模板列
          template: 'isOk', // 表示当前这一列使用模板名称
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template', // 表示将当前列定义为模板列
          template: 'level', // 表示当前这一列使用模板名称
        },
        {
          label: '操作',
          type: 'template', // 表示将当前列定义为模板列
          template: 'edit', // 表示当前这一列使用模板名称
        },
      ],
      adddialogVisible: false,
      editDialogVisible: false,
      // 添加分类的数据
      addCateForm: {
        cat_name: '',
        // 父级分类的id 默认：如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        // 分类的等级，默认是一级分类
        cat_level: 0,
      },
      // 验证添加分类的规则
      addrules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      // 添加分类数据
      addCateList: [],
      //级联选择器双向绑定的必须是一个数组
      value: [],
      addCatesProps: {
        expandTrigger: 'hover',
        value: 'cat_id',//最终会添加到双向绑定的数组中的id值(可根据项目需求自行设置最终网络请求需要的参数)
        label: 'cat_name',// 最终选择后显示在级联选择器上的文字
        children: 'children',
      },
      //编辑修改分类的信息
      editCateForm:{
        id:'',
        cat_name:''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 当前页数发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //每页显示条目个数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //添加分类按钮
    async addCates() {
      this.adddialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.addCateList = res.data
    },
    //级联选择器发生改变时触发的方法
    handleChange() {
      if (this.value.length > 0) {
        // 最近一级的父级id就是value数组中的最后一项
        this.addCateForm.cat_pid = this.value[this.value.length - 1]
        // 0 -> 1级分类   1-> 2级分类   2-> 3级分类
        //因为最多只有三级分类 自己添加分类的情况下只允许两个父级分类
        this.addCateForm.cat_level = this.value.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    // 确定添加分类
    addCatesConfirm() {
      this.$refs.addCateFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.adddialogVisible = false
      })
    },
    // 对话框关闭时重置表单
    addCateDialogClosed() {
      // 清空 input
      this.$refs.addCateFormRef.resetFields()
      // 重置
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    //编辑分类对话框的展开
    async editCates(cate) {
      this.editDialogVisible = true
      const {data:res} = await this.$http.get(`categories/${cate.cat_id}`)
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateForm.id = res.data.cat_id
    },
    // 确定修改分类
    editCatesConfirm(){
      this.$refs.editCateFormRef.validate(async vaild => {
        if(!vaild) return
        const {data:res} = await this.$http.put(`categories/${this.editCateForm.id}`,{cat_name:this.editCateForm.cat_name})
        if(res.meta.status!==200){
          return this.$message.error('修改分类失败')
        }
        this.$message.success('修改分类成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 重置修改分类的表单
    editCatesReset(){
      this.$refs.editCateFormRef.resetFields()
    },
    // 删除分类列表
    removeCates(cate){
       this.$confirm('此操作将永久删除该分类列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} =await this.$http.delete(`categories/${cate.cat_id}`)
          if(res.meta.status!==200) {
            return this.$message.error('删除分类列表失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getCateList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
}
</script>

<style lang='less' scoped>
tree-table {
  margin-top: 15px;
}
</style>