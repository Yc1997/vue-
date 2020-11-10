<template>
  <div class="login">
    <div class="login-content">
      <div class="avatar_box">
        <img class="avatar_img" src="../assets/logo.png" alt />
      </div>
      <el-form :model="loginForm"   class="demo-ruleForm"  :rules='loginFormRules' ref="loginFormRef">
        <el-form-item  prop="username" >
          <el-input prefix-icon="iconfont icon-user_login" type="text" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" >
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button @click="resetClick('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
       loginForm: {
        username: '',
        password: ''
      } ,
      loginFormRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
          { min:3,max:10,message:'请输入3-10位用户名', trigger: 'blur'}
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
          { min:6,max:16,message:'请输入6-16位密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    //登录
    // 'http://timemeetyou.com:8889/api/private/v1/login?username='+this.loginForm.username+'&password='+this.loginForm.password+''
    login(formName){
      this.$refs[formName].validate(async valid=>{
        if(!valid) return;
        const {data:res} = await this.$http.get(
          'http://timemeetyou.com:8889/api/private/v1/login',{ 
            params:{
              username:this.loginForm.username,
              password:this.loginForm.password
            }
          })
        console.log(res)
      })
    },
    //重置
    resetClick(formName){
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.login{
  height: 100%;
  background-color: #2b4b6b;
}
.login-content{
  width: 500px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
  background-color: #fff;
  padding: 10px;
}
.avatar_img{
  width: 150px;
  height: 150px;
  border: 8px solid #f7f7f7;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform:translate(-50%,-50%);
}
.demo-ruleForm{
  margin-top: 100px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>