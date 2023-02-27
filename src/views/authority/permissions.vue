<template>
  <div class="main-container">
    <TableHeader :can-collapsed="false">
      <template slot="right">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddMenu">添加
        </el-button>
      </template>
    </TableHeader>
    <TableBody ref="tableBody">
      <template>
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="dataList"
          row-key="permissionId"
          :tree-props="{ children: 'subPermissionList' }"
        >
          <el-table-column v-for="item in renderFieldList" :key="item.field" align="center" :label="item.label">
            <template slot-scope="scope">
              {{ item.rander(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="openEditMenu(scope.row)">编辑</el-link>
              <el-link type="danger" :underline="false" @click="deleteMenu(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableBody>
    <el-dialog :title="isNew ? '添加角色' : '编辑角色'" :visible.sync="dialogEditVisible">
      <el-form ref="baseForm" :model="menuModel" :rules="formRules" label-width="80px" label-position="right">
        <el-form-item label="上级权限" prop="parentId">
          <el-col :span="22">
            <el-select v-model="menuModel.parentId" size="small" placeholder="请选择上级权限" style="width: 100%">
              <el-option label="请选择上级权限" :value="0" />
              <el-option v-for="(item, index) of dataList" :key="index" :label="item.permissionAlias" :value="item.permissionId" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-col :span="22">
            <el-input v-model="menuModel.permissionName" size="small" placeholder="请输入权限名称" />
          </el-col>
        </el-form-item>
        <el-form-item label="权限别名" prop="permissionAlias">
          <el-col :span="22">
            <el-input v-model="menuModel.permissionAlias" size="small" placeholder="请输入权限别名" />
          </el-col>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-col :span="22">
            <el-input v-model="menuModel.description" size="small" placeholder="请输入权限描述" />
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="显示状态" prop="isShow">
          <el-col :span="22">
            <el-select v-model="menuModel.isShow" size="small" placeholder="请输入权限名称" style="width: 100%">
              <el-option label="显示" :value="1" />
              <el-option label="隐藏" :value="0" />
            </el-select>
          </el-col>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick(isNew)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PermissioModel } from '@/api/model';
import * as premiseionApi from '@/api/premiseion-operation';
import moment from 'moment';
export default {
  name: 'Permissions',
  data() {
    return {
      tableLoading: false,
      /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
      isNew: true,
      /** @type {Boolean} - 展示dialog */
      dialogEditVisible: false,
      /** @type {Array} - 菜单列表 */
      dataList: [],
      /** @type {Object} - 表单数据 */
      menuModel: new PermissioModel({}),
      /** @type {Object} - 表达验证规则 */
      formRules: {
        parentId: [
          {
            validator: (rule, value, callback) => {
              console.log(value);
              if (!value || value === 0) {
                callback(new Error('请选择上级'));
              }
              callback();
            },
            trigger: 'blur',
          },
        ],
        permissionName: [ { required: true, message: '请输入菜单名称', trigger: 'blur', }, ],
        permissionAlias: [ { required: true, message: '请输入菜单别名', trigger: 'blur', }, ],
        description: [ { required: true, message: '请输入菜单描述', trigger: 'blur', }, ],
        path: [ { required: true, message: '请输入菜单地址', trigger: 'blur', }, ],
      },
      // 表格列名
      renderFieldList: [
        {
          label: 'id',
          field: 'permissionId',
          rander: function (data) {
            return data['permissionId'];
          },
        },
        {
          label: '权限名称',
          field: 'permissionName',
          rander: function (data) {
            return data['permissionName'];
          },
        },
        {
          label: '权限别名',
          field: 'permissionAlias',
          rander: function (data) {
            return data['permissionAlias'];
          },
        },
        {
          label: '权限描述',
          field: 'description',
          rander: function (data) {
            return data['description'];
          },
        },
        {
          label: '权限状态',
          field: 'status',
          rander: function (data) {
            return data['status'] === 0 ? '正常' : '已删除';
          },
        },
        {
          label: '创建时间',
          field: 'createTime',
          rander: function (data) {
            return moment(data['createTime'] * 1000).format('YYYY-MM-DD');
          },
        },
        {
          label: '修改时间',
          field: 'updateTime',
          rander: function (data) {
            return moment(data['updateTime'] * 1000).format('YYYY-MM-DD');
          },
        },
      ],
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 添加权限按钮
    openAddMenu() {
      this.isNew = true;
      this.menuModel = new PermissioModel({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 修该权限按钮
     * @param {PermissioModel} res - 传入模型
     */
    openEditMenu(res) {
      console.log(res);
      this.isNew = false;
      this.menuModel = new PermissioModel(res);
      this.menuModel.id = res.permissionId;
      this.dialogEditVisible = true;
    },
    // 获取权限列表
    async getMenuList() {
      this.tableLoading = true;
      const res = await premiseionApi.getPermissionList();
      console.log(res);
      if (res.code !== 200) {
        this.$errorMsg('获取菜单失败 ' + res.message);
      }
      // const menuList = res.result.filter(item => item.type === 1);
      this.dataList = res.result;
      this.tableLoading = false;
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     */
    confirmClick(isNew) {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (isNew) {
            // 添加
            this.createMenu();
          } else {
            // 修改
            this.submitEditRole();
          }
        } else {
          this.$errorMsg('请按要求填写');
          return false;
        }
      });
    },
    /**
     * @method
     * @description 添加权限功能
     * @param {PermissioModel} data - 权限模型
     */
    createMenu() {
      this.menuModel.type = 2;
      // 权限默认隐藏
      this.menuModel.isShow = 0;
      this.menuModel.rootId = this.menuModel.parentId;
      premiseionApi.createPermission({
        permissioModel: this.menuModel,
      }).then((res) => {
        console.log(res);
        this.$successMsg('添加成功');
        this.dialogEditVisible = false;
        this.getMenuList();
      }, (error) => {
        this.$errorMsg('添加失败' + error);
      });
    },
    // 编辑权限功能
    submitEditRole() {
      premiseionApi.updatePermission({
        permissionId: this.menuModel.id,
        permissioModel: this.menuModel,
      }).then(() => {
        this.$successMsg('修改成功');
        this.dialogEditVisible = false;
        this.getMenuList();
      }, (error) => {
        this.$errorMsg('修改失败' + error);
      });
    },
    /**
     * @method
     * @desciption 删除权限
     * @param {Number} id - 权限id
     */
    deleteMenu(row) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        if (row.subPermissionList && row.subPermissionList.length > 0) {
          this.$errorMsg('删除失败, 里面还有子权限');
          return;
        }
        premiseionApi.deletePermission({
          permissionId: row.permissionId,
        }).then(() => {
          this.$successMsg('删除成功');
          this.dialogEditVisible = false;
          this.getMenuList();
        }, (error) => {
          this.$errorMsg('删除失败' + error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  bottom: 8px;
}
</style>

