<template>
  <div>
    <Breadcrumb index="首页" index1="商品管理" index2="参数列表"> </Breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级联分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader v-model="selectParams" :options="paramsList" :props="paramsProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 动态参数标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag  
                v-for="(item, index) in scope.row.attr_vals" :key="index" 
                closable  
                @close="handleClose(scope.row,index)">{{ item }}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 点击按钮显示输入框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  静态属性标签页-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag  
                v-for="(item, index) in scope.row.attr_vals" :key="index" 
                closable  
                @close="handleClose(scope.row,index)">{{ item }}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 点击按钮显示输入框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加动态参数 | 静态属性对话框 -->
      <el-dialog :title="'添加' + checkName" :visible.sync="addDialogVisible" width="50%" @close="closeAddParams">
        <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForms" label-width="100px">
          <el-form-item :label="checkName" prop="attr_name">
            <el-input v-model="addRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改动态参数 | 静态属性对话框 -->
      <el-dialog :title="'修改' + checkName" :visible.sync="editDialogVisible" width="50%" @close="closeEditParams">
        <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item :label="checkName" prop="attr_name">
            <el-input v-model="editRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 双向绑定的数据
      selectParams: [],
      //级联选择器的数据源
      paramsList: [],
      paramsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      manyTableData: [], //动态参数数据
      onlyTableData: [], //静态属性数据,
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加参数/属性需要的数据
      addRuleForm: {
        attr_name: '',
      },
      // 编辑修改参数/属性
      editRuleForm: {
        attr_name: '',
      },
      addRules: {
        attr_name: [{ required: true, message: `请输入参数/属性名称`, trigger: 'blur' }],
      },
      editRules: {
        attr_name: [{ required: true, message: `请输入参数/属性名称`, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    checkName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    // 按钮是否禁用
    isDisabled() {
      if (this.selectParams.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 选择id
    cateId() {
      if (this.selectParams.length === 3) {
        return this.selectParams[2]
      }
      return null
    },
  },
  methods: {
    // 获取商品列表
    async getParamsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      this.paramsList = res.data
    },
    // 级联选择器发生改变触发的方法
    handleChange() {
      // 避免在不是三级菜单的情况下显示数据的bug
      if(this.selectParams.length!==3) {
        this.manyTableData = []
        this.onlyTableData = []
      }
      this.getParamsData()
    },
    // 点击标签页触发的方法
    handleClick() {
      this.getParamsData()
    },
    // 封装一个请求数据的方法实现切换标签页展示不同的数据
    async getParamsData() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败')
      }

      // 由于出现了一个bug,在不同动态参数展开栏中打开input输入框添加参数都会同时打开，所有需要循环数据让每一个输入框之间的inputVisible和inputValue这两个属性都是互相独立的
      res.data.forEach((item) => {
        // 因为item.attr_vals原本是一堆字符串，所有需要手动分割为数组方便v-for循环
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res)
      // 两个不同的标签页获取不同的数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加动态参数
    addParams() {
      this.addDialogVisible = true
    },
    // 确定添加
    addParamsConfirm() {
      this.$refs.addRuleForms.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addRuleForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 关闭对话框重置form表单内容
    closeAddParams() {
      this.$refs.addRuleForms.resetFields()
    },
    closeEditParams() {
      this.$refs.editRuleForm.resetFields()
    },
    // 打开编辑页面
    async editParams(params) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${params.attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.editRuleForm = res.data
    },
    // 确认编辑修改
    editParamsConfirm() {
      this.$refs.editRuleForm.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editRuleForm.attr_id}`, { attr_name: this.editRuleForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数/属性
    async deleteParams(params) {
      this.$confirm('此操作将永久删除该参数/属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${params.attr_id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      /**
       * this.$confirm弹窗返回得是一个promise,使用async await得到的确定值是confirm  取消的是cancel
       *
       */

      // let confirm =  await this.$confirm('此操作将永久删除该参数/属性, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).catch(err=>err)
      // console.log(confirm)
      // if(confirm==='confirm'){
      //    const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${params.attr_id}`)
      //     if(res.meta.status!==200){
      //       return this.$message.error('删除失败')
      //     }
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!',
      //     })
      //     this.getParamsData()
      // }else {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除',
      //     })
      // }
    },
    // 当输入框点击enter按键或者失去焦点会触发的方法
     handleInputConfirm(row) {
      // 如果去除空格以后输入框中的长度为空的情况下
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 如果不为空 就往row.attr_vals添加数据即可
        row.attr_vals.push(row.inputValue.trim())
        this.saveParams(row)
        row.inputVisible = false
        row.inputValue = ''
    },
    // 控制输入框的显示和隐藏
    showInput(row) {
      row.inputVisible = true
       // 让文本框自动获得焦点
      // $nextTick 的作用：当页面中元素被重新渲染后，才会执行回调函数中的代码
      /* 关于：页面中的元素，
        当执行 showTagInput() 这个方法 ，row.inputTagVisable = true 会让元素重新渲染，那么
        渲染完毕后就会执行下面 $nextTick 中的回调函数
       */
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //封装一个通用更新或删除参数的方法，避免重复请求数据
    async saveParams(row){
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,//由于只修改attr_vals中的值，所有不需要修改attr_name
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')
      })
      if(res.meta.status!==200){
        return this.$message.error('更新参数失败')
      }
       this.$message.success('更新参数成功')
    },
    //点击关闭按钮删除数据
    handleClose(row,i){
      row.attr_vals.splice(i,1)
      this.saveParams(row)
    }
  },
}
</script>

<style lang='less' scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>