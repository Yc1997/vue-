<template>
  <div>
    <Breadcrumb 
        index='首页' 
        index1='角色管理' 
        index2='角色列表'>
    </Breadcrumb>
    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="dialogVisible = true">添加角色</el-button></el-col>
      </el-row>
      <el-table :data="RolesData" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bottom', index1 == '0' ? 'top' : '', 'center']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesTag(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 == '0' ? '' : 'top', 'center']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="5">
                    <el-tag closable type="success" @close="removeRolesTag(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag closable :class="[index3]" type="warning" v-for="(item3, index3) in item2.children" :key="item3.id" @close="removeRolesTag(scope.row, item3.id)">{{
                      item3.authName
                    }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 比较美观的查看scope.row每一行的数据 -->
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="角色操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="toEditRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deledeRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRoles(scope.row)">分配权限</el-button>
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
      <!-- 分配权限弹出的对话框 -->
      <el-dialog title="分配权限" :visible.sync="setDialogVisible" width="50%" @close='closeRights'>
        <span>
          <el-tree :data="setRolesData"  :props="defaultProps" show-checkbox default-expand-all  node-key="id" :default-checked-keys='defKeys' ref="tree"></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRolesConfirm">确 定</el-button>
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
      RolesData: [],
      setRolesData:[],
      dialogVisible: false,
      editDialogVisible: false,
      setDialogVisible:false,
      //当前角色的id
      roleId:'',
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
      //给树节点设置的信息
      defaultProps: {
          children: 'children',
          label: 'authName'
      },
      // 权限列表默认选中的节点绑定的id
      defKeys:[]
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
      this.$message.success('添加角色成功')
      this.getRolesInfo()
      this.dialogVisible = false
    },
    //编辑修改角色
    editRolesConfirm() {
      this.$refs.editRolesRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put('roles/' + this.editRoles.id, { roleName: this.editRoles.roleName,roleDesc:this.editRoles.roleDesc })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getRolesInfo()
        this.editDialogVisible = false
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
    //删除权限tag标签
    removeRolesTag(scope, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${scope.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          // 因为重新请求页面会把展开页关闭不美观，数据接口正好也是响应式返回，所有直接把scope.row这一行的children权限重新赋值即可
          scope.children = res.data
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 分配权限对话框
    async setRoles(role){
      this.setDialogVisible = true
      this.roleId = role.id
      // 在弹出对话框的同时把树形结构的权限列表请求出来
       const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200) {
        return this.$message.error('获取权限列表失败')
      }
      this.setRolesData = res.data
      
      this.getCheckedRole(role,this.defKeys)
    },
    // 默认展开勾选中的权限
    getCheckedRole(node,arr){
      // 如果node不包含children属性的话，就直接把权限的id返回出去
      if(!node.children){
        return arr.push(node.id)
      }
     node.children.forEach(item => this.getCheckedRole(item,arr))
    },
    // 关闭对话框
    closeRights(){
      this.defKeys = []
    },
    // 分配角色点击确定
    async setRolesConfirm(){
      const keys = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys()
        ]
      const rids = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids})
      if(res.meta.status!==200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesInfo()
      this.setDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-row {
  padding: 5px 15px;
  .el-tag {
    margin: 5px 10px;
  }
}
.bottom {
  border-bottom: 1px solid #eee;
}
.top {
  border-top: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>