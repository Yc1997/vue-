<template>
  <div>
    <Breadcrumb index="首页" index1="商品管理" index2="添加商品"> </Breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 添加商品步骤条 -->
      <!-- 每一个步骤条绑定的 active 都是从0开始，可以跟标签页的name进行互相绑定-->

      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息">基本信息</el-step>
        <el-step title="商品参数">商品参数</el-step>
        <el-step title="商品属性">商品属性</el-step>
        <el-step title="商品图片">商品图片</el-step>
        <el-step title="商品内容">商品内容</el-step>
        <el-step title="完成">完成</el-step>
      </el-steps>
      <!-- 标签页 -->
      <!-- :before-leave 在切换标签页时可以获取到要进入的标签页的name的值和离开当前标签页的name值 -->
      <!-- 嵌套关系：el-tabs里面只允许嵌套el-tab-pane,在el-tab-pane外层嵌套form表单是不行的，最好用el-form把el-tabs包裹起来 -->
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleRef" label-width="100px" :label-position="'top'">
        <el-tabs :tab-position="tabPosition" :before-leave="beforeLeave" @tab-click="changeTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addRuleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addRuleForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addRuleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addRuleForm.goods_cat" :options="cateList" :props="goodsProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="k" v-for="(k, i) in item.attr_vals" border :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 
                  action: 图片要上传的后台api地址
                  on-preview: 图片预览触发的事件
                  on-remove: 处理移除图片的事件
                  list-type: 图片显示的效果
                  headers 属性 上传时的请求头配置
                  on-success 上传成功后的处理函数
            -->
            <el-upload :action='imgUpload' list-type="picture-card" :on-preview="handlePreview" :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headerObj">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog title="图片预览" :visible.sync="imgDialogVisible">
              <img width="100%" :src="imgUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
            <el-button type='primary'  @click='addGoods'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 预览图片对话框 -->
      <!-- <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
        <img :src="imgUrl" alt="" class="previewImg" />
      </el-dialog> -->
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    let checkPrice =  (rule, value, cb) => {
      if(value =='0'){
        return cb('商品价格不能为空')
      }
    }
    let checkWeight =  (rule, value, cb) => {
      if(value =='0'){
        return cb('商品重量不能为空')
      }
    }
    let checkNum =  (rule, value, cb) => {
      if(value =='0'){
        return cb('商品数量不能为空')
      }
    }
    return {
      tabPosition: 'left',
      activeIndex: '0',
      // 添加商品的数据
      addRuleForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        //富文本编辑器输入的内容
        goods_introduce:'',
        pics: [],
        attrs:[]
      },
      //验证添加商品的规则
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' },{validator: checkPrice, trigger: 'blur'}],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' },{validator: checkWeight, trigger: 'blur'}],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' },{validator: checkNum, trigger: 'blur'}],
        // goods_cat: [
        //   {
        //     required: true,
        //     message: '商品分类不能为空',
        //     trigger: 'blur',
        //   },
        // ],
      },
      cateList: [],
      goodsProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      manyData: [],
      onlyData: [],
      // 图片上传路径
      imgUpload: 'http://api.ojbk666.top/api/private/v1/upload',
      //设置上传的请求头部
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      imgUrl: '',
      imgDialogVisible: false,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    // 获取到要进入的标签页的name的值和离开当前标签页的name值
    beforeLeave(activeName, oldActiveName) {
      // console.log('要进入的标签页name值', activeName)
      // console.log('要离开当前标签页的name值', oldActiveName)
      if (oldActiveName === '0' && this.addRuleForm.goods_cat.length !== 3) {
      this.$refs.addRuleRef.validate(vaild => {
        if(!vaild) return false
      })
        this.$message.error('请先选择商品分类')
        return false
      }
      this.activeIndex = activeName
    },
    handleChange() {
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.addRuleForm.goods_cat.length = []
      }
    },
    // 切换标签页
    async changeTab() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.manyData = res.data

      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        this.onlyData = res.data
      }
    },
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.imgDialogVisible = true
      this.imgUrl = file.url
    },
    //文件列表移除文件时的钩子
    handleRemove(file) {
      // console.log(file)
      let filePath = file.response.data.tmp_path
      const index = this.addRuleForm.pics.findIndex(v => v.pic === filePath)
      this.addRuleForm.pics.splice(index,1)
    },
    //文件上传成功的钩子
    handleSuccess(res) {
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('上传失败')
      }
      this.$message.success('上传成功')
      const picUrl = {}
      picUrl.pic = res.data.tmp_path
      this.addRuleForm.pics.push(picUrl)
    },
    //添加商品
    async addGoods(){
        const cloneAdd = _.cloneDeep(this.addRuleForm)
        cloneAdd.goods_cat = cloneAdd.goods_cat.join(',')
       
          this.manyData.forEach(item => {
            const newAttr = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addRuleForm.attrs.push(newAttr)
          })
          this.onlyData.forEach(item => {
            const newAttr = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addRuleForm.attrs.push(newAttr)
          })
          cloneAdd.attrs = this.addRuleForm.attrs
        console.log(cloneAdd)
        const {data:res} = await this.$http.post('goods',cloneAdd)
        console.log(res)
        if(res.meta.status!==201){
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功',{duration:1000})
        this.$router.push('/goods')
        
    }
  },
  computed: {
    // 返回id
    cateId() {
      if (this.addRuleForm.goods_cat.length === 3) {
        return this.addRuleForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang='less' scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.el-button {
  margin-top:15px;
}
</style>