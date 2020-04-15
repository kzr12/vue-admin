<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{'current':item.current}"
          @click="toggleMenu(item)"
        >{{item.txt}}</li>
      </ul>
      <!-- form表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-from"
        size="medium"
      >
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-from">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input id="code" v-model="ruleForm.code" maxlength="6" minlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeBtn.status"
              >{{codeBtn.txt}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginBtn"
          >{{model=='login'?'登录':'注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetSms, Register, Login } from "@/api/login";
import { stripscript, validateEmail, validatePass, validateVCode } from "@/utils/Validate";
import { reactive, ref, isRef, onMounted } from "@vue/composition-api";
import sha1 from "js-sha1";
export default {
  name: "login",
  setup(props, context) {
    //表单数据
    //验证邮箱
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        if (ruleForm.checkPass !== "") {
          context.refs.loginForm.validateField("checkPass");
        }
        callback(); //返回true
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //过滤后的数值
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6-20位的字母和数字"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //如果模块值为login 则直接通过
      if (model.value == "login") callback();
      //过滤后的数值
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        return callback();
      }
    };
    /**
     * 声明数据
     */
    //这里放置data数据、生命周期、自定义的函数
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //模块值
    const model = ref("login");
    //登录按钮禁用状态
    const loginBtn = ref(true);
    //验证码按钮状态
    const codeBtn = reactive({
      status: false,
      txt: '获取验证码'
    });
    //倒计时
    const timer = ref(null);
    // 表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    /***
     * 声明函数
     */
    //登录和注册按钮点击事件
    const toggleMenu = e => {
      menuTab.forEach(item => {
        item.current = false;
      });
      e.current = true;
      //模块赋值
      model.value = e.type;
      //重置表单
      context.refs['loginForm'].resetFields();
      //清除验证码按钮状态
      clearCountDown();
    };

    /**
     * 获取验证码
     */
    const getSms = (() => {
      //进行提示
      if (ruleForm.username == '') {
        // context.root==this
        context.root.$message.error('邮箱不能为空！！');
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        context.root.$message.error('邮箱格式有误！！');
        return false;
      }
      //修改获取验证码按钮状态
      codeBtn.status = true;
      codeBtn.txt = '发送中';

      //请求接口
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      GetSms(requestData).then(res => {
        //弹消息框
        context.root.$message({
          message: res.data.message,
          type: 'success'
        });
        //启用登录或者注册按钮
        loginBtn.value = false;
        //调定时器 倒计时60S
        countDown(60);
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      });


    });
    /**
     * 提交表单
     */
    const submitForm = (loginForm => {
      context.refs[loginForm].validate(valid => {
        if (valid) {
          //表单验证通过时
          model.value == 'login' ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    });
    //登录
    //登录
    const login = (() => {
      let loginData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      //登录接口
      Login(loginData).then(res => {
        let data = res.data;
        context.root.$message({
          message: data.message,
          type: 'success'
        })
      });
    });

    //注册
    //注册
    const register = (() => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      //注册接口
      Register(requestData).then(res => {
        let data = res.data;
        context.root.$message({
          message: data.message,
          type: 'success'
        })
        //模拟注册成功
        toggleMenu(menuTab[0]);
        clearCountDown();
      }).catch(err => {

      });

    });



    /**
     * 倒计时
     */
    const countDown = ((num) => {
      //判断定时器是否存在 存在则先清除
      if (timer.value) clearInterval(timer.value);
      //定时器
      timer.value = setInterval(() => {
        num--;
        if (num === 0) {
          clearInterval(timer.value);
          codeBtn.status = false;
          codeBtn.txt = '重新发送';
        } else {
          codeBtn.txt = `发送中${num}秒`;
        }
      }, 1000)
    });
    // 清除倒计时
    const clearCountDown = (() => {
      //还原验证码按钮默认状态
      codeBtn.status = false;
      codeBtn.txt = "获取验证码";
      clearInterval(timer.value);//清除倒计时计时器
    });


    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {

    });

    return {
      menuTab,
      model,
      loginBtn,
      codeBtn,
      ruleForm,
      rules,
      toggleMenu,
      getSms,
      submitForm
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  min-height: 100vh;
  background-color: #34465f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-from {
  margin-top: 29px;
  label {
    margin-bottom: 3px;
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
