<template>
  <div class="main-container student">
    <TableHeader
      title="作业列表"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="orderByTime?'el-icon-sort-up':'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="作业id">
          <el-input v-model="searchFrom.id" size="mini" placeholder="名称" />
        </el-form-item>
        <el-form-item label="主体作业id">
          <el-input v-model="searchFrom.homeworkId" size="mini" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="所在的作业目录id">
          <el-input v-model="searchFrom.curriculumHomeworkId" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchFrom.homeworkDescribe" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="评价">
          <el-input v-model="searchFrom.homeworkComment" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="searchFrom.homeworkLink" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="searchFrom.homeworkScore" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="学生id">
          <el-input v-model="searchFrom.studentId" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="老师id">
          <el-input v-model="searchFrom.masterId" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="课程id">
          <el-input v-model="searchFrom.curriculumId" size="mini" placeholder="电话" />
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="searchFrom.status" size="mini" placeholder="请选择账号状态">
            <el-option label="申请中" value="0" />
            <el-option label="同意" value="1" />
            <el-option label="拒绝" value="2" />
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
    <!-- TODO需要修改 -->
    <el-dialog :title="isNewRole?'添加角色':'编辑角色'" :visible.sync="dialogEditVisible">
      <el-form ref="form" :model="editFrom" label-width="150px" label-position="left">
        <el-form-item label="homeworkId">
          <el-input v-model="editFrom.userName" disabled />
        </el-form-item>
        <el-form-item label="curriculumHomeworkId">
          <el-input v-model="editFrom.userEmail" disabled />
        </el-form-item>
        <el-form-item label="homeworkDescribe">
          <el-input v-model="editFrom.userPhone" :disabled="!isNewRole" />
        </el-form-item>
        <el-form-item label="homeworkComment">
          <el-input v-model="editFrom.userAvatar" />
        </el-form-item>
        <el-form-item label="homeworkLink">
          <el-input v-model="editFrom.loginPassword" type="textarea" />
        </el-form-item>
        <el-form-item label="homeworkScore">
          <el-input v-model="editFrom.loginPassword" type="textarea" />
        </el-form-item>
        <el-form-item label="studentId">
          <el-input v-model="editFrom.loginPassword" type="textarea" />
        </el-form-item>
        <el-form-item label="masterId">
          <el-input v-model="editFrom.loginPassword" type="textarea" />
        </el-form-item>
        <el-form-item label="curriculumId">
          <el-input v-model="editFrom.loginPassword" type="textarea" />
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
import * as homeWorkApi from '@/api/home-work';
import { HomeWorkModel } from '@/api/model';
export default {
  name: 'HomeWorkView',
  data: () => ({
    tableLoading: false,
    /** @type {Boolean} - 展示dialog */
    dialogEditVisible: false,
    /**
     * @type {Array<HomeWorkModel>}
     * @description 表格数据
     */
    dataList: [],
    /**
     * @type {String}
     * @description 渲染的tabs
     */
    tabs: [ ],
    /** @type {HomeWorkModel} 编辑添加表单 */
    editFrom: new HomeWorkModel({}),
    /** @type {Array<PermissioModel>} - 权限列表 */
    permissioList: [],
    permissioActive: '',
    /** @type {HomeWorkModel}  搜索条件表单*/
    searchFrom: new HomeWorkModel({}),
    // 页码控制
    pageNo: 1,
    pageSize: 10,
    totalSize: 20,
    searchWord: '',
    orderByTime: false, // 0 : 1
    startTime: 0,
    endTime: 0,
  }),
  methods: {
    /**
     * @method
     * @description 修改时间排序然后获取表 */
    reverseSort() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.orderByTime = !this.orderByTime;
      this.getTable();
    },
    /**
     * @method
     * @description  修改搜索条件然后获取表 按钮触发 */
    searchWordChange() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getTable();
    },
    /** @method
     * @description 页面改变
     * @param {Number} data -页码
    */
    currentChanged(data) {
      console.log('页码改变', data, this.pageNo);
      this.getTable();
    },
    /** @method
     * @description 重置表格获取表格
    */
    refreshTable() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.searchWord = null;
      this.orderByTime = false;
      this.searchFrom = new HomeWorkModel({});
      this.getTable();
    },
    /** @method
     * @description 只获取信息列表不做操作
    */
    getTable() {
      this.tableLoading = true;
      homeWorkApi.getPageHomeworkInfo({
        homeWork: this.searchFrom,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchWord: this.searchWord,
        timeType: this.orderByTime,
        startTime: this.startTime,
        endTime: this.endTime === 0 ? new Date().getTime() : this.endTime,
      }).then(res => {
        console.log('成功返回', res);
      }, (error) => {
        console.log('失败返回', error);
      });
    },
    /**
     * @method
     * @description 传入角色详情并打开编辑框
     * @param {HomeWorkModel} res - 传入角色模型
     */
    openEditRole(res) {
      this.isNewRole = false;
      // homeWorkApi.masterExcel(res).then((result) => {
      //   console.log('表格详情', new HomeWorkModel(result.result));
      this.editFrom = res;
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框
     * @param {RoleItem} res - 角色模型
     */
    openAddRole() {
      this.isNewRole = true;
      this.editFrom = new HomeWorkModel({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     * */
    confirmClick(isNew) {
      console.log('编辑角色');
      this.submitEditRole();
    },
    /**
     * @method
     * @description 提交角色编辑成功后关闭编辑框
     * @param {HomeWorkModel} data - 角色模型
     */
    submitEditRole() {
      console.log(this.editFrom);
      homeWorkApi.approvalHomeworkCheck({
        homeWork: this.editFrom,
        pageNo: 1,
        pageSize: 10,
        searchWord: null,
        timeType: 0,
        startTime: 0,
        endTime: Math.floor(new Date().getTime() / 1000),
      }).then(res => {
        console.log(res);
        this.dialogEditVisible = false;
        this.refreshTable();
      }, (error) => {
        console.log(error);
        this.$message.error('错了哦，这是一条错误消息');
      });
    },
  },
};
</script>

<style scoped>
.student .search-card.el-card {
  margin-bottom: 10px;
  box-shadow: none;
}
</style>
