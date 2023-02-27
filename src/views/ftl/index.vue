<template>
  <div class="main-container ftl">
    <TableHeader
      title="成员编辑"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-input slot="left" v-model="searchWord" size="mini" placeholder="请输入内容" />
        <span class="left-margin"></span>
        <el-button
          type="primary"
          size="mini"
          @click="searchWordChange"
        >搜索
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :icon="orderByTime?'el-icon-sort-up':'el-icon-sort-down'"
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
    <TableBody ref="tableBody">
      <template>
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="dataList"
        >
          <el-table-column
            v-for="item in tabs"
            :key="item+'_tabs'"
            align="center"
            :prop="item"
            :label="item"
          >
            <template slot-scope="scope">
              {{ returnTextOfTas(item,scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="openEditRole(scope.row)">编辑</el-link>
              <el-link
                type="danger"
                :underline="false"
                @click="deleteRole(scope.row)"
              >删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableBody>
    <el-card
      :body-style="{ padding: 0 }"
      class="table-footer-container"
      shadow="never"
    >
      <div class="flex">
        <el-pagination
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalSize"
          @current-change="currentChanged"
        />
      </div>
    </el-card>
    <!-- <TableFooter
      :page-size="pageSize"
      :total-size="totalSize"
      @currentChanged="currentChanged"
    /> -->
    <!-- 添加角色和编辑角色都使用这个dialog -->
    <el-dialog :title="isNewRole?'添加角色':'编辑角色'" :visible.sync="dialogEditVisible">
      <el-form ref="form" :model="form" label-width="150px" label-position="left">
        <el-form-item label="role id">
          <el-input v-model="form.roleId" disabled />
        </el-form-item>
        <el-form-item label="status">
          <el-input v-model="form.status" disabled />
        </el-form-item>
        <el-form-item label="role name">
          <el-input v-model="form.roleName" :disabled="!isNewRole" />
        </el-form-item>
        <el-form-item label="role alias">
          <el-input v-model="form.roleAlias" :placeholder="form.roleAliasTips?form.roleAliasTips:''" />
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="permission name">
          <el-select v-model="permissioActive" placeholder="请选择添加权限">
            <el-option
              v-for="item in permissioList"
              :key="item.permissionName+'_permissio'"
              :label="item.permissionAlias"
              :value="item.permissionName"
            />
          </el-select>
          <el-button @click="addTab(permissioActive)">添加权限</el-button>
        </el-form-item>
        <el-form-item label="permissionList">
          <el-tag
            v-for="tag in form.permissionNames"
            :key="tag+'_tab'"
            closable
            :disable-transitions="false"
            @close="tabClose(tag)"
          >
            {{ tag }}
          </el-tag>
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
import * as roleApi from '@/api/permission-role';
import * as premiseionApi from '@/api/premiseion-operation';
import { RoleItem, PermissioModel } from '@/api/model';
import moment from 'moment';
export default {
  name: 'FtlView',
  components: {
  },
  data: () => ({
    tableLoading: false,
    /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
    isNewRole: false,
    /**
     * @type {Array<RoleItem>}
     * @description 表格数据
     */
    dataList: [],
    /**
     * @type {String}
     * @description 渲染的tabs
     */
    tabs: [ 'description', 'roleAlias', 'roleId', 'roleName', 'status', 'deleteTime', 'createTime', 'updateTime', ],
    /** @type {RoleItem} - 表单结构套用RoleItem */
    form: {
      description: '',
      roleAlias: '',
      roleId: '',
      roleName: '',
      permissionNames: [],
      status: 0,
      deleteTime: 0,
      createTime: 0,
      updateTime: 0,
    },
    /** @type {Array<PermissioModel>} - 权限列表 */
    permissioList: [],
    permissioActive: '',
    dialogEditVisible: false,
    // 下面是页的控制
    pageNo: 1,
    pageSize: 10,
    totalSize: 20,
    searchWord: '',
    orderByTime: false,
  }),
  mounted() {
    this.refreshRoleList();
    premiseionApi.getPermissionList().then(res => {
      /** @type {Array<RoleItem>} */
      // const list = [];
      // res.result.forEach(element => {
      //   list.push(new PermissioModel(element));
      // });
      console.log('res', res);
      this.initpermissionList(res.result);
      this.permissioList = this.initpermissionList(res.result);
    });
  },
  methods: {
    /**
     * @method
     * @description 修改时间排序然后获取表 */
    reverseSort() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.orderByTime = !this.orderByTime;
      this.getRoleList();
    },
    /**
     * @method
     * @description  修改搜索关键字然后获取表 */
    searchWordChange() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getRoleList();
    },
    /** @method
     * @description 页面改变
     * @param {Number} data -页码
    */
    currentChanged(data) {
      console.log('页面改变', data, this.pageNo);
      this.getRoleList();
    },
    /** @method
     * @description 重置表格获取表格
    */
    refreshRoleList() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.searchWord = null;
      this.orderByTime = false;
      this.getRoleList();
    },
    /** @method
     * @description 只获取信息列表不做操作
    */
    getRoleList() {
      this.tableLoading = true;
      roleApi.getRoleList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchWord: this.searchWord === '' ? null : this.searchWord,
        orderByTime: this.orderByTime ? 0 : 1,
      }).then((res) => {
        console.log(res);
        /** @type {Array<RoleItem>} */
        const list = [];
        res.result.records.forEach((item) => {
          list.push(new RoleItem(item));
          this.tableLoading = false;
        });
        this.totalSize = res.result.total;
        this.dataList = list;
      }, (error) => {
        console.log('失败返回,', error);
        this.tableLoading = false;
      });
    },
    /** @method
     * @description 根据标签名来进行对应文本处理返回
     * @param {String} tabName
     * @param {RoleItem} TabData
    */
    returnTextOfTas(tabName, TabData) {
      switch (tabName) {
        case 'deleteTime':
        case 'createTime':
        case 'updateTime':
          if (TabData[tabName] instanceof Date) {
            return moment(TabData[tabName]).format('YYYY:MM:DD');
          } else {
            return TabData[tabName];
          }
        default:
          return TabData[tabName];
      }
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框
     * @param {RoleItem} res - 角色模型
     */
    openEditRole(res) {
      this.isNewRole = false;
      roleApi.roleInfo(res).then((result) => {
        console.log('表格详情', new RoleItem(result.result));
        this.form = new RoleItem(result.result);
        /** 编辑时清除 角色别名, 因为接口上传和之前相同的别民会报错
         * roleAliasTips: 在 角色别名 那栏的 提示文字
         * roleAlias: 清空
         */
        this.form.roleAliasTips = result.result.roleAlias;
        this.form.roleAlias = '';
        this.dialogEditVisible = true;
      });
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框
     * @param {RoleItem} res - 角色模型
     */
    openAddRole() {
      this.isNewRole = true;
      this.form = new RoleItem({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     * */
    confirmClick(isNew) {
      if (isNew) {
        // console.log('添加角色');
        this.createRole();
      } else {
        // console.log('编辑角色');
        this.submitEditRole();
      }
    },
    /**
     * @method
     * @description 提交角色编辑成功后关闭编辑框
     * @param {RoleItem} data - 角色模型
     */
    submitEditRole() {
      console.log(this.form);
      roleApi.updateRole(this.form).then(res => {
        console.log(res);
        this.dialogEditVisible = false;
        this.refreshRoleList();
      }, (error) => {
        console.log(error);
        this.$message.error('错了哦，这是一条错误消息');
      });
    },
    /**
     * @method
     * @description 增加角色编辑成功后关闭编辑框
     * @param {RoleItem} data - 角色模型
     */
    createRole() {
      console.log(this.form);
      roleApi.createRole(this.form).then(res => {
        console.log(res);
        this.dialogEditVisible = false;
        this.refreshRoleList();
      }, (error) => {
        console.log(error);
        this.$message.error('错了哦，这是一条错误消息');
      });
    },
    /**
     * @method
     * @description 编辑表删除tabs
     * @param {String} tagName - 权限名
     */
    tabClose(tagName) {
      console.log(tagName);
      const index = this.form.permissionNames.indexOf(tagName);
      if (index !== -1) {
        this.form.permissionNames.splice(index, 1);
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
      const index = this.form.permissionNames.indexOf(tagName);
      if (index === -1) {
        this.form.permissionNames.unshift(tagName);
      }
      // console.log(this.form.permissionNames);
    },
    /**
     * @method
     * @description 删除角色
     * @param {RoleItem} data - 角色模型
     */
    deleteRole(data) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        console.log(data);
        roleApi.deleteRole(data).then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
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
     * @description 获取所有权限的值
     * @param {Array} data - 权限列表
     */
    initpermissionList(data) {
      const list = [];
      data.forEach(element => {
        list.push(new PermissioModel(element));
        if (element.subPermissionList && element.subPermissionList.length > 0) {
          list.push(...this.initpermissionList(element.subPermissionList));
        }
      });
      return list;
    },
  },
};
</script>
<style scoped>
.left-margin{
 margin-left: 15px;
}
</style>
<style >
.ftl .el-input{
  width: 300px;
}

</style>
