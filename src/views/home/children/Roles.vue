<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="dialogVisible = true">添加角色</el-button></el-col>
      </el-row>
      <el-table :data="RolesData" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="角色操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="toEditRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deledeRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色管理弹出的对话框 -->
      <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="closeAddReset()">
        <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑修改角色弹出的对话框 -->
      <!-- 添加角色管理弹出的对话框 -->
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="closeEditReset()">
        <el-form :model="editRoles" :rules="editRolesRules" ref="editRolesRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      RolesData: [],
      dialogVisible: false,
      editDialogVisible: false,
      //添加角色相关信息
      addRoles: {
        roleName: '',
        roleDesc: '',
      },
      // 编辑角色
      editRoles: {
        id: '',
        roleName: '',
        roleDesc: '',
      },
      //验证添加角色的规则
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入 3 到 10 个字符角色名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入 3 到 16 个角色描述字符', trigger: 'blur' },
        ],
      },
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入 3 到 10 个字符角色名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入 3 到 16 个角色描述字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getRolesInfo()
  },
  methods: {
    //获取角色列表信息
    async getRolesInfo() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.RolesData = res.data
    },
    // 添加角色临时退出时重置表单
    closeAddReset() {
      this.$refs.addRolesRef.resetFields()
    },
    // 编辑修改角色临时退出时重置表单
    closeEditReset() {
      this.$refs.editRolesRef.resetFields()
    },
    async toEditRoles(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editRoles.id = res.data.roleId
      this.editRoles.roleName = res.data.roleName
      this.editRoles.roleDesc = res.data.roleDesc
    },
    //添加角色
    async addRolesConfirm() {
      const { data: res } = await this.$http.post('roles', this.addRoles)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败')
      }
      this.dialogVisible = false
      this.$message.success('添加角色成功')
      this.getRolesInfo()
    },
    //编辑修改角色
    editRolesConfirm() {
      this.$refs.editRolesRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put('roles/' + this.editRoles.id, { roleName: this.editRoles.roleName })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.editDialogVisible = false
        this.$message.success('修改成功')
        this.getRolesInfo()
      })
    },
    // 删除角色
    deledeRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getRolesInfo()
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

<style lang='less' scoped>
</style>