<template>
  <div class="main-container student">
    <TableHeader
      title="老师编辑"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.orderByTime?'el-icon-sort-up':'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="openAddRole"
        >添加
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="名称">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="名称" />
        </el-form-item>
        <!-- <el-form-item label="邮箱">
          <el-input v-model="pageParameter.userEmail" size="mini" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="pageParameter.userPhone" size="mini" placeholder="电话" />
        </el-form-item> -->
        <el-form-item label="注册时间范围">
          <el-date-picker
            v-model="pageParameter.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            unlink-panels
            :picker-options="{
              onPick: formatPickDate
            }"
          />
        </el-form-item>
        <!-- <el-form-item label="此注册时间之后">
          <el-date-picker
            v-model="pageParameter.startTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item> -->
        <!-- <el-form-item label="此注册时间之前">
          <el-date-picker
            v-model="pageParameter.endTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item> -->
        <el-form-item label="账号状态">
          <el-select v-model="pageParameter.isDel" size="mini" placeholder="请选择账号状态">
            <el-option label="正常" value="0" />
            <el-option label="删除" value="1" />
          </el-select>
          <!-- <el-input v-model="searchFrom.isDel" size="mini" placeholder="审批人" /> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchWordChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <TableBody ref="tableBody">
      <el-table
        ref="table"
        v-loading="tableLoading"
        :data="dataList"
      >
        <el-table-column v-for="item in renderFieldList" :key="item.label+'_'+item.field" align="center" :label="item.label">
          <template slot-scope="scope">
            {{ item.rander(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-link
              v-if="operation.isCanEdit"
              type="primary"
              :underline="false"
              @click="openEditRole(scope.row)"
            >编辑</el-link>
            <el-link
              v-if="operation.isCanDelete"
              type="danger"
              :underline="false"
              @click="deleteRole(scope.row.id)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </TableBody>
    <el-card
      :body-style="{ padding: 0 }"
      class="table-footer-container"
      shadow="never"
    >
      <div class="flex">
        <el-pagination
          :current-page.sync="pageParameter.pageNo"
          :page-size="pageParameter.pageSize"
          layout="prev, pager, next, jumper"
          :total="pageParameter.totalSize"
          @current-change="currentChanged"
        />
      </div>
    </el-card>
    <el-dialog :title="isNewRole?'添加老师':'编辑老师'" :visible.sync="dialogEditVisible">
      <el-form ref="form" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="user Name" prop="userName">
          <el-input v-model="editFrom.userName" />
        </el-form-item>
        <el-form-item label="user Email" prop="userEmail">
          <el-input v-model="editFrom.userEmail" type="email" />
        </el-form-item>
        <el-form-item label="user Phone" prop="userPhone">
          <el-input v-model="editFrom.userPhone" type="tel" />
        </el-form-item>
        <el-form-item label="loginPassword" prop="loginPassword">
          <el-input v-model="editFrom.loginPassword" type="password" />
        </el-form-item>
        <el-form-item label="Exempt from audit" prop="roleNames">
          <el-select
            v-model="editFrom.roleNames"
            multiple
            placeholder="请选择添加权限"
          >
            <el-option
              label="homework"
              value="homework"
            />
            <el-option
              label="curriculumData"
              value="curriculumData"
            />
          </el-select>
          <!-- <el-button @click="addTab(permissioActive)">添加权限</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick(isNewRole)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment';
import * as teacherApi from '@/api/teacher-api';
import Cookies from 'js-cookie';
import { mapGetters, mapActions } from 'vuex';
import { RoleModel, PageParameter } from '@/api/model';
export default {
  name: 'TeacherView',
  data: () => ({
    tableLoading: false,
    rolesLoading: false,
    /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
    isNewRole: false,
    /** @type {Boolean} - 展示dialog */
    dialogEditVisible: false,
    /* 获取token */
    token: Cookies.get('admin-token'),
    /** @type {Object} - 操作设置 */
    operation: {
      /** @property {Boolean} 是否能够删除 */
      isCanDelete: true,
      /** @property {Boolean} 是否能够编辑 */
      isCanEdit: true,
    },
    /**
     * @type {Array<RoleModel>}
     * @description 表格数据
     */
    dataList: [],
    /**
     * @type {String}
     * @description 渲染的tabs
     */
    tabs: [ ],
    /** @type {RoleModel} 编辑添加表单 */
    editFrom: new RoleModel({}),
    /** @type {Array<PermissioModel>} - 权限列表 */
    permissioList: [],
    permissioActive: '',
    /** @type {RoleModel}  搜索条件表单*/
    searchFrom: new RoleModel({}),
    renderFieldList: [
      {
        label: 'id',
        field: 'id',
        rander: function (data) {
          return data['id'];
        },
      },
      {
        label: 'username',
        field: 'username',
        rander: function (data) {
          return data['username'];
        },
      },
      {
        label: 'userEmail',
        field: 'userEmail',
        rander: function (data) {
          return data['userEmail'];
        },
      },
      /* {
        label: 'loginPassword',
        field: 'loginPassword',
        rander: function (data) {
          return data['loginPassword'];
        },
      }, */
      {
        label: 'userPhone',
        field: 'userPhone',
        rander: function (data) {
          return data['userPhone'];
        },
      },
      {
        label: 'createTime',
        field: 'createTime',
        rander: function (data) {
          return moment(data['createTime'] * 1000).format('YY-MM-DD HH:mm:ss');
        },
      },
    ],
    pageParameter: new PageParameter({}),
    /**
     * @typedef {String} 用于提交 page信息 名
     */
    pageInfoName: 'pageInfoName',
    disabled: false,
    // 页码控制
    // pageNo: 1,
    // pageSize: 10,
    // totalSize: 20,
    // searchWord: '',
    // orderByTime: false, // 0 : 1
    // startTime: 0,
    // endTime: 0,
    /** 表单验证 */
    rules: {
      userEmail: [
        { validator: (rule, value, callback) => {
          console.log(rule, value);
          const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (reg.test(value) || value === '') {
            callback();
          }
          callback(new Error('邮箱格式不正确'));
        }, trigger: 'blur', },
      ],
      userPhone: [
        { validator: (rule, value, callback) => {
          const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
          if (reg.test(value) || value === '') {
            callback();
          }
          callback(new Error('手机号格式不正确!'));
        }, trigger: 'blur', },
      ],
      loginPassword: [
        { validator: (rule, value, callback) => {
          callback();
        }, trigger: 'blur', },
      ],
    },
  }),
  computed: {
    ...mapGetters({
      // 获取 角色列表
      rolesList: 'roles/getRolesList',
      // 判断最后一页状态
      isCanNext: 'roles/isCanNext',
    }),
  },
  mounted() {
    this.getTable();
    // this.getRolesListAction();
  },
  methods: {
    ...mapActions({
      // 调用接口获取 角色列表
      getRolesListAction: 'roles/getRolesListAction',
    }),
    /**
     * @method
     * @description 修改时间排序然后获取表 */
    reverseSort() {
      this.pageParameter.pageNo = 1;
      this.pageParameter.orderByTime = !this.pageParameter.orderByTime;
      this.getTable();
    },
    /**
     * @method
     * @description  修改搜索条件然后获取表 按钮触发 */
    searchWordChange() {
      this.pageParameter.pageNo = 1;
      this.getTable();
    },
    /** @method
     * @description 页面改变
     * @param {Number} data -页码
    */
    currentChanged(data) {
      console.log('页码改变', data, this.pageParameter.pageNo);
      this.getTable();
    },
    /** @method
     * @description 重置表单获取表格
    */
    refreshTable() {
      this.pageParameter.pageNo = 1;
      this.pageParameter.searchWord = null;
      this.pageParameter.orderByTime = false;
      this.searchFrom = new RoleModel({});
      this.getTable();
    },
    /** @method
     * @description 只获取信息列表不做操作
    */
    getTable() {
      this.tableLoading = true;
      teacherApi.getPageMasterInfo({
        // teacherInfo: this.searchFrom,
        [this.pageInfoName]: this.pageParameter,
      }).then(res => {
        console.log('成功返回', res);
        if (res.code !== 200) {
          this.$errorMsg('发生错误, 请刷新');
        }
        // 赋值表格数据
        this.dataList = res.result.records;
        // 总数
        this.pageParameter.totalSize = res.result.total;
        this.tableLoading = false;
      }, _error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
        this.tableLoading = false;
      }).catch(_error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      });
    },
    /**
     * @method
     * @description 传入角色详情并打开编辑框
     * @param {RoleModel} res - 传入角色模型
     */
    openEditRole(res) {
      this.isNewRole = false;
      // teacherApi.masterExcel(res).then((result) => {
      //   console.log('表格详情', new RoleModel(result.result));
      this.editFrom = new RoleModel(res);
      // 获取id
      this.editFrom.id = res.id;
      // 获取用户名
      this.editFrom.userName = res.username ?? '';
      // 隐藏密码
      this.editFrom.encryptionPassword = res.loginPassword;
      this.editFrom.loginPassword = '';
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框
     * @param {RoleItem} res - 角色模型
     */
    openAddRole() {
      this.isNewRole = true;
      this.editFrom = new RoleModel({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     * */
    confirmClick(isNew) {
      if (isNew) {
        console.log('添加角色');
        this.createRole();
      } else {
        console.log('编辑角色');
        this.submitEditRole();
      }
    },
    /**
     * @method
     * @description 编辑表删除tabs
     * @param {String} tagName - 权限名
     */
    tabClose(tagName) {
      console.log(tagName);
      const index = this.editFrom.roleNames.indexOf(tagName);
      if (index !== -1) {
        this.editFrom.roleNames.splice(index, 1);
      }
      // console.log(this.form.permissionNames);
    },
    /**
     * @method
     * @description 编辑表添加tabs
     * @param {String} tagName - 权限名
     */
    addTab(tagName) {
      console.log(tagName);
      if (tagName === '') {
        return;
      }
      const index = this.editFrom.roleNames.indexOf(tagName);
      if (index === -1) {
        this.editFrom.roleNames.unshift(tagName);
      }
      // console.log(this.form.permissionNames);
    },
    /**
     * @method
     * @description 角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    submitEditRole() {
      this.editFrom.loginPassword = this.editFrom.loginPassword ? this.editFrom.loginPassword : null;
      teacherApi.updateMaster({
        teacherInfo: this.editFrom,
        pageNo: 1,
        pageSize: 10,
        searchWord: null,
        timeType: 0,
        startTime: 0,
        endTime: Math.floor(new Date().getTime() / 1000),
      }).then(res => {
        console.log(res);
        this.$message.success('修改成功');
        this.dialogEditVisible = false;
        this.getTable();
      }, (error) => {
        console.log(error);
        this.$message.error('修改失败 ' + error);
      }).catch(_error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      });
    },
    /**
     * @method
     * @description 增加角色后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    createRole() {
      this.editFrom.username = this.editFrom.userName;
      this.editFrom.userAvatar = 'http://ukedunet.test.jobs123.cn/admin/read-file/ecc74c67d729676f518c135fbfbcd444';
      teacherApi.addMaster({
        teacherInfo: this.editFrom,
        pageNo: 1,
        pageSize: 10,
        searchWord: null,
        timeType: 0,
        startTime: 0,
        endTime: Math.floor(new Date().getTime() / 1000),
      }).then(res => {
        console.log(res);
        this.$message.success('添加成功');
        this.dialogEditVisible = false;
        this.getTable();
      }, (error) => {
        console.log(error);
        this.$message.error('添加失败 ' + error);
      }).catch(_error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      });
    },
    /**
     * @method
     * @description 删除角色
     * @param {RoleModel} data - 角色模型
     */
    deleteRole(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        teacherApi.deleteMaster({ userId, }).then(res => {
          // console.log(userId);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getTable();
        }, (error) => {
          this.$message.error('删除失败 ' + error);
        }).catch(_error => {
          console.log(_error);
          this.$errorMsg('发生错误, 请刷新');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
      // console.log(this.form.permissionNames);
    },
    /**
     * @method
     * @description 格式化选中的日期范围值 -- 去除毫秒值
     * @param {Object} data - 日期范围值
     */
    formatPickDate({ maxDate, minDate, }) {
      this.pageParameter.startTime = minDate ? Number(minDate.getTime() / 1000) : null;
      this.pageParameter.endTime = maxDate ? Number(maxDate.getTime() / 1000) : null;
    },
    /**
     * @method
     * @description 加载角色列表
     */
    load() {
      if (!this.isCanNext) {
        return;
      }
      this.rolesLoading = true;
      this.getRolesListAction().then(_ => {
        this.rolesLoading = false;
      });
    },
    /**
     * @method
     * @description 用户头像上传成功回调
     * @param {Object} res - 响应的值
     * @param {File} file - 头像
     */
    handleAvatarSuccess(res, file) {
      console.log(res.result);
      this.editFrom.userAvatar = res.result;
    },
  },
};
</script>

<style scoped>
  .student .search-card.el-card {
    margin-bottom: 10px;
    box-shadow: none;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
