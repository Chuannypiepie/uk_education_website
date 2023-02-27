<template>
  <div class="admin-user">
    <TableHeader
      :title="title"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.orderByCreateTime?'el-icon-sort-up':'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="openAddUser"
        >添加
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="关键字">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchWordChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <TableBody ref="tableBody">
      <template>
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="dataList"
          class="table-item-imgsize"
        >
          <el-table-column
            align="center"
            label="序号"
            width="80"
            prop="userId"
          />
          <el-table-column
            align="center"
            label="名称"
            prop="adminUserName"
          />
          <el-table-column
            align="center"
            label="头像"
          >
            <template slot-scope="scope">
              <div class="avatar-container">
                <el-image
                  :src="scope.row.userAvatar || require('@/assets/img_avatar_01.jpeg')"
                  class="avatar"
                  :class="{'avatar-vip' : scope.row.vip === 1}"
                />
                <img
                  v-if="scope.row.vip === 1"
                  class="vip"
                  :src="require('@/assets/img_vip_icon.png')"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="绑定角色"
            prop="gender"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.roleNames.join(',') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建时间"
          >
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['createTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :active-value="1"
                :inactive-value="0"
              />
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="openEditUser(scope.row)"
              >编辑</el-link>
              <el-link
                type="danger"
                :underline="false"
                @click="deleteUser(scope.row.userId)"
              >删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableBody>
    <!-- 表尾 -->
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
    <!-- TODO需要修改 -->
    <el-dialog :title="isNew?'添加角色':'编辑角色'" :visible.sync="dialogEditVisible">
      <el-form ref="userForm" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="user Name" prop="userName">
          <el-input v-model="editFrom.userName" />
        </el-form-item>
        <el-form-item label="loginPassword" prop="loginPassword">
          <el-input v-model="editFrom.loginPassword" type="password" />
        </el-form-item>
        <el-form-item label="permission name" prop="roleNames">
          <el-select
            v-model="editFrom.roleNames"
            v-infinite-scroll="load"
            :infinite-scroll-immediate="true"
            :infinite-scroll-disabled="!isCanNext || rolesLoading"
            multiple
            placeholder="请选择添加权限"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.roleId"
              :label="item.description"
              :value="item.roleName"
            />
            <p v-if="rolesLoading" style="text-align: center;">加载中...</p>
            <p v-if="!isCanNext" style="text-align: center;">没有更多了</p>
          </el-select>
          <!-- <el-button @click="addTab(permissioActive)">添加权限</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick(isNew)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import * as manageUserApi from '@/api/manage-users';
import { mapGetters, mapActions } from 'vuex';
import { PageParameter } from '@/api/model';
export default {
  name: 'AdminUser',
  data() {
    return {
      title: '后台用户列表',
      /** @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
      isNew: true,
      /** @type {Boolean} - 展示dialog */
      dialogEditVisible: false,
      /* 角色列表是否正在加载 */
      rolesLoading: false,
      /** @type {Array} - Table表格展示数据 */
      dataList: [],
      /** @type {PageParameter} - 页码状态 */
      pageParameter: new PageParameter({}),
      /** @type {Object} - form 表单数据 */
      editFrom: {
        userName: '',
        loginPassword: '',
        roleNames: [],
      },
      /** 表单验证 */
      rules: {
        userName: [
          { required: this.isNew, message: '请输入用户名', trigger: 'blur', },
        ],
        loginPassword: [
          { required: this.isNew, message: '请输入登录密码', trigger: 'blur', },
          { validator: (rule, value, callback) => {
            callback();
          }, trigger: 'blur', },
        ],
        roleNames: [
          { required: true, message: '请选择权限角色', trigger: 'blur', },
        ],
      },
    };
  },
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
  },
  methods: {
    moment,
    ...mapActions({
      // 调用接口获取 角色列表
      getRolesListAction: 'roles/getRolesListAction',
    }),
    /**
     * @method
     * @description 修改时间排序然后获取表 */
    reverseSort() {
      this.pageParameter.pageNo = 1;
      this.pageParameter.orderByCreateTime = !this.pageParameter.orderByCreateTime ? 1 : 0;
      this.getTable();
    },
    /** @method
     * @description 页面改变
     * @param {Number} data -页码
    */
    currentChanged(data) {
      console.log('页面改变', data, this.pageNo);
      this.getTable();
    },
    /**
     * @method
     * @description  修改搜索条件然后获取表 按钮触发 */
    searchWordChange() {
      this.pageParameter.pageNo = 1;
      this.getTable();
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
    getTable() {
      this.tableLoading = true;
      manageUserApi.getAdminUserList({
        pageParameter: this.pageParameter,
      }).then(res => {
        if (res.code !== 200) {
          this.$errorMsg(res.message);
          return;
        }
        // 赋值表格数据
        this.dataList = res.result.records;
        // 总数
        this.pageParameter.totalSize = res.result.total;
        this.tableLoading = false;
      }, (_error) => {
        this.$errorMsg(_error);
        this.tableLoading = false;
      }).catch(_err => {
        this.$errorMsg(_err);
      });
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框,如果设置不允许添加直接结束
     * @param {RoleItem} res - 角色模型
     */
    openAddUser() {
      this.isNew = true;
      this.editFrom = {};
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 传入角色详情并打开编辑框
     * @param {RoleModel} res - 传入角色模型
     */
    openEditUser(res) {
      this.isNew = false;
      // teacherApi.masterExcel(res).then((result) => {
      //   console.log('表格详情', new RoleModel(result.result));
      this.editFrom.userName = res.adminUserName;
      this.editFrom.roleNames = res.roleNames;
      this.editFrom.encryptionPassword = res.loginPassword;
      // 获取id
      this.editFrom.userId = res.userId;
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 增加角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    createUser() {
      manageUserApi.createAdminUser({
        userName: this.editFrom.userName,
        password: this.editFrom.loginPassword,
        roleNames: this.editFrom.roleNames,
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
     * @description 提交角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    submitEditUser() {
      manageUserApi.updateAdminUser({
        adminUserId: this.editFrom.userId,
        userName: this.editFrom.userName,
        loginPassword: this.editFrom.loginPassword,
        roleNames: this.editFrom.roleNames,
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
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     * */
    confirmClick(isNew) {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (isNew) {
            this.createUser();
          } else {
            this.submitEditUser();
          }
        } else {
          this.$errorMsg('请按要求填写');
          return false;
        }
      });
    },
    /**
     * @method
     * @description 删除用户
     * @param {Int} userid - 用户id
     */
    deleteUser(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        manageUserApi.deleteAdminUser(userId).then(res => {
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
  },
};
</script>

<style lang="scss" scoped>
.table-item-imgsize {
  img {
    width: 50px;
    height: 50px;
  }
}
.search-card.el-card {
  margin-bottom: 10px;
  box-shadow: none;
}
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    width: 128px;
    height: 128px;
  }
}
</style>
