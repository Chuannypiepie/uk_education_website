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
    <!-- <Dialog ref="dialog">
      <template>
        <el-form
          ref="baseForm"
          :model="menuModel"
          :rules="formRules"
          label-width="80px"
          label-position="right"
        >
          <el-form-item label="上级菜单">
            <el-col :span="20">
              <el-select
                v-model="menuModel.parentItem"
                size="small"
                placeholder="请输入菜单名称"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of menuListData"
                  :key="index"
                  :label="item.menuName"
                  :value="item.menuUrl"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item
            label="菜单名称"
            prop="name"
          >
            <el-col :span="20">
              <el-input
                v-model="menuModel.name"
                size="small"
                placeholder="请输入菜单名称"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label="菜单地址"
            prop="url"
          >
            <el-col :span="20">
              <el-input
                v-model="menuModel.url"
                size="small"
                placeholder="请输入菜单地址"
              >
                <template slot="prepend">{{ menuModel.parentItem ? menuModel.parentItem : '/' }}</template>
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </template>
    </Dialog> -->
    <el-dialog :title="isNew ? '添加角色' : '编辑角色'" :visible.sync="dialogEditVisible">
      <el-form ref="baseForm" :model="menuModel" :rules="formRules" label-width="80px" label-position="right">
        <el-form-item label="上级菜单" prop="parentId">
          <el-col :span="22">
            <el-select v-model="menuModel.parentId" size="small" placeholder="请输入菜单名称" style="width: 100%">
              <el-option label="顶级菜单" :value="0" />
              <el-option v-for="(item, index) of dataList" :key="index" :label="item.permissionAlias" :value="item.permissionId" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单名称" prop="permissionName">
          <el-col :span="22">
            <el-input v-model="menuModel.permissionName" size="small" placeholder="请输入菜单名称" />
          </el-col>
        </el-form-item>
        <el-form-item label="菜单别名" prop="permissionAlias">
          <el-col :span="22">
            <el-input v-model="menuModel.permissionAlias" size="small" placeholder="请输入菜单别名" />
          </el-col>
        </el-form-item>
        <el-form-item label="菜单描述" prop="description">
          <el-col :span="22">
            <el-input v-model="menuModel.description" size="small" placeholder="请输入菜单描述" />
          </el-col>
        </el-form-item>
        <el-form-item label="菜单地址" prop="path">
          <el-col :span="22">
            <el-input v-model="menuModel.path" size="small" placeholder="例: /login、/index、/index/home">
              <template slot="prepend">/</template>
            </el-input>
          </el-col>
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
// import TableMixin from '@/mixins/TableMixin';
// import { randomString } from '@/utils/utils';
import { PermissioModel } from '@/api/model';
import * as premiseionApi from '@/api/premiseion-operation';
import moment from 'moment';
/*
  import {
    UpdateItemMixin,
    GetDataMixin,
    AddItemMixin,
    DeleteItemsMixin
  } from '@/mixins/ActionMixin';
*/
export default {
  name: 'Menu',
  /*
    mixins: [
      TableMixin,
      GetDataMixin,
      UpdateItemMixin,
      AddItemMixin,
      DeleteItemsMixin,
    ],
  */
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
          label: '菜单名称',
          field: 'permissionName',
          rander: function (data) {
            return data['permissionName'];
          },
        },
        {
          label: '菜单别名',
          field: 'permissionAlias',
          rander: function (data) {
            return data['permissionAlias'];
          },
        },
        {
          label: '菜单描述',
          field: 'description',
          rander: function (data) {
            return data['description'];
          },
        },
        {
          label: '菜单状态',
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
    // 添加菜单按钮
    openAddMenu() {
      this.isNew = true;
      this.menuModel = new PermissioModel({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 修该菜单按钮
     * @param {PermissioModel} res - 传入模型
     */
    openEditMenu(res) {
      console.log(res);
      this.isNew = false;
      this.menuModel = new PermissioModel(res);
      this.menuModel.id = res.permissionId;
      this.dialogEditVisible = true;
    },
    // 初始化菜单列表
    initMenuData(data) {
      const res = data.filter(item => {
        if (item.subPermissionList && item.subPermissionList.length > 0) {
          item.subPermissionList = this.initMenuData(item.subPermissionList);
        }
        // return item.parentId === item.rootId;
        return item.isShow !== 0;
      });
      return [ ...res, ];
    },
    // 获取菜单列表
    async getMenuList() {
      this.tableLoading = true;
      const res = await premiseionApi.getPermissionList();
      console.log(res);
      if (res.code !== 200) {
        this.$errorMsg('获取菜单失败 ' + res.message);
        this.tableLoading = false;
        return;
      }
      const menuList = res.result.filter(item => item.type === 1);
      this.dataList = this.initMenuData(menuList);
      this.tableLoading = false;
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     */
    confirmClick(isNew) {
      if (isNew) {
        // 添加
        this.createMenu();
      } else {
        // 修改
        this.submitEditRole();
      }
    },
    /**
     * @method
     * @description 添加菜单功能
     * @param {PermissioModel} data - 权限模型
     */
    createMenu() {
      this.menuModel.type = this.menuModel.parentId === 0 ? 1 : 2;
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
    // 编辑菜单功能
    submitEditRole() {
      this.menuModel.permissionNames = this.menuModel.permissionName;
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
     * @desciption 删除菜单
     * @param {Number} id - 菜单id
     */
    deleteMenu(row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        if (row.subPermissionList && row.subPermissionList.length > 0) {
          this.$errorMsg('删除失败, 里面还有子菜单');
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
  /*
    mounted() {
      this.initGetData({
        url: this.$urlPath.getMenuList,
        method: 'GET',
        onResult: (res) => {
          this.handleSuccess(res);
        },
      }).then(this.getData());
      this.initAddItem({
        url: this.$urlPath.getMenuList,
        params: () => {
          return {
            menuName: this.menuModel.name,
            menuUrl: this.menuModel.menuUrl,
          };
        },
        onAddItem: () => {
          this.$refs.dialog.show({
            beforeShowAction: () => {
              this.menuModel.name = '';
              this.menuModel.url = '';
            },
            onConfirmCallback: () => {
              this.$refs.baseForm.validate((valid) => {
                if (!valid) { return; }
                this.doAddItem();
              });
            },
          });
        },
        onResult: () => { },
        onError: () => { },
      });
      this.initUpdateItem({
        url: this.$urlPath.getMenuList,
        params: () => {
          return {
            menuName: this.menuModel.name,
            menuUrl: this.menuModel.menuUrl,
          };
        },
        onUpdateItem: (item) => {
          this.$refs.dialog.show({
            beforeShowAction: () => {
              this.menuModel.id = item.id;
              this.menuModel.name = item.menuName;
              this.menuModel.url = item.menuUrl;
            },
            onConfirmCallback: () => {
              this.$refs.baseForm.validate((valid) => {
                if (!valid) { return; }
                this.doUpdateItem();
              });
            },
          });
        },
        onResult: () => {
          this.$successMsg('菜单模拟添加成功');
        },
        onError: () => { },
      });
      this.initDeleteItem({
        url: this.$urlPath.getMenuList,
        params: {
          id: this.menuModel.id,
        },
        onDeleteItem: (item) => {
          this.menuModel.id = item.id;
          if (item.children && item.children.length > 0) {
            this.$errorMsg('当前菜单包含有子菜单，不可删除，请先删除子菜单');
          } else {
            this.$showConfirmDialog(
              '是否要删除此菜单信息，删除后不可恢复？'
            ).then(() => {
              this.$successMsg('菜单模拟删除成功');
            });
          }
        },
      });
    },
  */
};
</script>

<style lang="scss" scoped>
.table-container {
  bottom: 8px;
}
</style>

