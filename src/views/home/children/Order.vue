<template>
  <div>
    <Breadcrumb index="首页" index1="订单管理" index2="订单列表"> </Breadcrumb>
    <el-card>
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="orderData" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | formatData }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" circle @click="editOrder"></el-button>
            <el-button type="success" icon="el-icon-location-outline" circle @click="checkOrder"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑订单对话框 -->
      <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close='close'>
        <el-form :model="editRuleForm" :rules="editRules" ref="editRef" label-width="100px" >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options='orderCity' :props="{ expandTrigger: 'hover' }" v-model='selectCity'></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editRuleForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
import orderCity from '@/plugins/citydata'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 1,
        pagenum: 5,
      },
      orderData: [],
      total: 0,
      editDialogVisible: false,
      // 地址信息
      editRuleForm:{
        address1:[],
        address2:''
      },
      editRules:{
        address1:[{required:true,message:'请输入您的地址',trigger:'blur'}],
        address2:[{required:true,message:'请输入您的详细地址',trigger:'blur'}]
      },
      orderCity,
      selectCity:[],
      //订单物流信息
      progressInfo:[],
      progressVisible:false
    }
    
  },
  created() {
    this.getOrder()
  },
  methods: {
    async getOrder() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '获取订单失败',
          duration: 500,
        })
      }
      this.$message({
        type: 'success',
        message: '获取订单成功',
        duration: 500,
      })
      this.orderData = res.data.goods
      this.total = res.data.total
    },
    //编辑查看订单
    editOrder() {
      this.editDialogVisible = true
    },
    close(){
      this.$refs.editRef.resetFields()
    },
    async checkOrder(){
      // progressNum: '804909574412544580'
      this.progressVisible = true
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
       if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.$message.success(res.meta.message)
      this.progressInfo = res.data
    }
  },
}
</script>

<style lang='less' scoped>
.input-with-select {
  width: 500px;
}
</style>