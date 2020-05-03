<template>
    <el-dialog
        title="新增"
        :visible.sync="data.dialog_info_flag"
        @close="close"
        width="630px"
        @open="openDialog"
    >
        <el-form :model="data.form" ref="addInfoForm" :rules="data.rules">
            <el-form-item label="用户名：" :label-width="data.formLabelWidth" prop="username">
                <el-input placeholder="请输入邮箱" v-model="data.form.username"></el-input>
            </el-form-item>

            <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="data.form.password"></el-input>
            </el-form-item>

            <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
                <el-input placeholder="请输入姓名" v-model="data.form.truename"></el-input>
            </el-form-item>

            <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
                <el-input placeholder="请输入手机号" v-model.number="data.form.phone"></el-input>
            </el-form-item>

            <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
                <!-- <CityPicker :cityPickerLevel="['province','city','area']" :cityPickerData.sync="data.cityPickerData" /> -->
                <CityPicker :cityPickerData.sync="data.cityPickerData" />
            </el-form-item>

            <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop="status">
                <el-radio v-model="data.form.status" label="1">禁用</el-radio>
                <el-radio v-model="data.form.status" label="2">启用</el-radio>
            </el-form-item>

            <el-form-item label="系统：" :label-width="data.formLabelWidth" prop="role">
                <el-checkbox-group v-model="data.form.role">
                    <el-checkbox
                        v-for="item in data.roleItem"
                        :label="item.role"
                        :key="item.role"
                    >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="按钮：" :label-width="data.formLabelWidth">
                <template v-if="data.btnPerm.length>0">
                    <div v-for="item in data.btnPerm" :key="item.id">
                        <h4>{{item.name}}</h4>
                        <template v-if="item.perm && item.perm.length>0">
                            <el-checkbox-group v-model="data.form.btnPerm">
                                <el-checkbox
                                    v-for="buttons in item.perm"
                                    :label="buttons.value"
                                    :key="buttons.value"
                                >{{buttons.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </div>
                </template>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button
                type="danger"
                @click="submit('addInfoForm')"
                :loading="data.submitLoading"
            >确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import sha1 from "js-sha1";
import { GetRole, GetPermButton, GetSystem, UserAdd, UserEdit } from "@/api/user"
import { stripscript, validateEmail, validatePass, validateVCode } from "@/utils/Validate";
import { ref, reactive, watchEffect, onBeforeMount } from "@vue/composition-api"
import CityPicker from "@c/CityPicker";
export default {
    name: 'dialogInfo',
    components: { CityPicker },
    props: {
        flag: {
            type: Boolean,
            default: false
        },
        editData: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, { emit, root, refs }) {
        /**
         * 表单验证
         */
        //验证邮箱
        let validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else if (validateEmail(value)) {
                callback(new Error("用户名格式有误"));
            } else {
                callback(); //返回true
            }
        };
        //验证密码
        let validatePassword = (rule, value, callback) => {
            if (data.form.id && !value) {
                callback();
            }
            if ((data.form.id && value) || !data.form.id) {
                //过滤后的数值
                if (value) {
                    data.form.password = stripscript(value);
                    value = data.form.password;
                }
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else if (validatePass(value)) {
                    callback(new Error("密码为6-20位的字母和数字"));
                } else {
                    callback();
                }
            }

        };


        /**
         * 数据监听
         */
        watchEffect(() => {
            data.dialog_info_flag = props.flag;
        });

        /**
         * 数据
         */
        const data = reactive({
            formLabelWidth: '90px',
            //城市数据
            cityPickerData: {},
            //弹窗标记
            dialog_info_flag: false,
            //from
            form: {
                username: '',
                truename: '',
                password: '',
                phone: '',
                region: {},
                status: '2',
                role: [],
                btnPerm: [],
            },
            //表单的验证
            rules: reactive({
                username: [{ validator: validateUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }],
                role: [{ required: true, message: '请选择', trigger: "change" }],
            }),
            //角色数组
            roleItem: [],
            //按钮权限
            btnPerm: [],
            //按钮加载
            submitLoading: false,
        })


        /******
         * ****
         * *方法
         * *方法
         * *方法
         * *
         * 
         */


        /**
         * 请求角色
         */
        const getrole = () => {
            if (data.roleItem.length > 0 && data.btnPerm.length > 0) { return false }//如果数组里面有数据则不请求 减少请求资源浪费
            GetRole().then(res => {
                data.roleItem = res.data.data
            });
            GetPermButton().then(res => {
                data.btnPerm = res.data.data
            })
        }


        /**
         * 关闭和取消的方法
         */
        const close = (() => {
            data.dialog_info_flag = false
            emit("update:flag", false)
            //重置表单
            resetForm();
        });

        /**
         * 弹窗打开的时候
         */
        const openDialog = (() => {
            //角色请求
            getrole();
            //初始值处理
            let editData = props.editData;
            if (editData.id) {//编辑
                editData.role = editData.role ? editData.role.split(',') : [];
                editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(',') : [];
                //循环json对象
                for (let key in editData) {
                    data.form[key] = editData.id ? editData[key] : '';
                }
            } else {//添加
                data.form.id && delete data.form.id;
                //循环json对象
                for (let key in data.form) {
                    data.form[key] = key == 'status' ? '2' : key == 'region' ? {} : key == 'role' ? [] : key == 'btnPerm' ? [] : '';
                }
            }

        })

        /**
         * 重置表单
         */
        const resetForm = (() => {
            data.cityPickerData = {};
            refs['addInfoForm'].resetFields();
        })

        /**
         * 确定添加按钮
         */
        const submit = ((loginForm) => {
            //表单验证
            refs[loginForm].validate(valid => {
                if (valid) {
                    /**
                     * 请求接口
                     */
                    //深拷贝 JSON.parse(JSON.stringify(data.form))  脱离同一根线
                    //浅拷贝 Object.assign({},data.from)
                    let reqData = JSON.parse(JSON.stringify(data.form));
                    reqData.role = reqData.role.join();
                    reqData.btnPerm = reqData.btnPerm.join();
                    reqData.region = JSON.stringify(data.cityPickerData)

                    if (reqData.id) {//编辑状态
                        if (reqData.password) {
                            reqData.password = sha1(reqData.password)
                        } else {
                            delete reqData.password;
                        }
                        userEdit(reqData);
                    } else {//添加状态
                        reqData.password = sha1(reqData.password);
                        userAdd(reqData);
                    }


                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
            return false;
        })

        //添加接口
        const userAdd = (reqData) => {
            UserAdd(reqData).then(res => {
                root.$message.success(res.data.message);
                close();
                //刷新table数据
                emit('refreshTableData');
            })
        }
        //编辑接口
        const userEdit = (reqData) => {
            UserEdit(reqData).then(res => {
                console.log(res)
                root.$message.success(res.data.message);
                close();
                //刷新table数据
                emit('refreshTableData');
            })
        }
        return {
            close, openDialog, submit, data
        }
    },

}
</script>

<style>
</style>