<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="always">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserInfo()">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo()"> </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"> 添加用户 </el-button>
        </el-col>
      </el-row>
      <!-- table表格渲染用户列表 -->
      <template>
        <el-table :data="menuList" style="width: 100%" border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserState(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <!-- 操作用户按钮 -->
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"> </el-button>
              <!-- 删除用户 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"> </el-button>
              <!-- 分配角色 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"> </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹出的对话框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="closeReset()">
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户信息弹出的对话框 -->
      <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditReset()">
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名">
            <el-input disabled v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSaveUser()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则
    // 验证邮箱的自定义的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 验证通过 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机的自定义校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机的正则表达式
      // const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 验证通过 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机'))
    }
    return {
      input: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      menuList: [],
      total: 0,
      dialogVisible: false,
      //添加用户的信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //添加用户验证用户信息的规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入 3 到 10 个字符用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入 6 到 16 个字符密码', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 编辑用户的信息
      editForm: {
        id: '',
        email: '',
        mobile: '',
      },
      //控制对话框的隐藏
      editDialogVisible: false,
      //编辑用户信息的验证规则
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    //获取用户列表信息
    async getUserInfo() {
      const { data: res } = await this.$http.get('users', {
        // eslint-disable-line no-unused-vars
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize,
        },
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.menuList = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    //修改用户状态
    async changeUserState(state) {
      const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) {
        //如果设置失败了就不能让状态修改成功，取反即可
        state.mg_state = !state.mg_state
        this.$message.error('修改失败')
        this.getUserInfo()
      }
      //修改状态成功重新获取用户数据渲染
      this.$message.success('修改状态成功')

      this.getUserInfo()
    },
    //每页条数发现改变时触发的方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserInfo()
    },
    //当前页数发生改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserInfo()
    },
    //点击取消添加用户时重置表单
    closeReset() {
      this.$refs.addFormRef.resetFields()
    },
    //添加用户
    addUserInfo() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加用户成功!')
        this.dialogVisible = false
        //添加成功后重新获取用户信息
        this.getUserInfo()
      })
    },
    //点击编辑角色并且查询角色相关信息
    async editUser(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      console.log(this.editForm.id)
    },
    //确认修改用户信息
    editSaveUser() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改信息成功!')
        this.editDialogVisible = false
        this.getUserInfo()
      })
    },
    //修改信息中途退出重置表单验证规则
    closeEditReset() {
      this.$refs.editFormRef.resetFields()
    },
    //删除用户
    removeUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const {data:res} = await this.$http.delete('users/'+id)
          if(res.meta.status!==200) return
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getUserInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>