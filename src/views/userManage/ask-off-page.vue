<template>
  <div class="admin-user">
    <TableHeader :title="title" :can-collapsed="false">
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.orderByCreateTime ? 'el-icon-sort-up' : 'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="搜索关键字">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="序号/请假人/请假课程..." />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="pageParameter.status" clearable size="mini" placeholder="请选择审核状态">
            <el-option label="待审核" :value="0" />
            <el-option label="已同意" :value="1" />
            <el-option label="已拒绝" :value="2" />
            <el-option label="已撤销" :value="3" />
          </el-select>
          <!-- <el-input v-model="searchFrom.isDel" size="mini" placeholder="审批人" /> -->
        </el-form-item>
        <!-- <el-form-item label="请假人类型">
          <el-select v-model="pageParameter.type" clearable size="mini" placeholder="请选择审核状态">
            <el-option label="学生" :value="0" />
            <el-option label="老师" :value="1" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item v-if="pageParameter.type || pageParameter.type === 0" label="用户Id">
          <el-input v-model="pageParameter.userId" size="mini" placeholder="用户Id" />
        </el-form-item> -->
        <el-form-item label="用户名称">
          <el-input v-model="pageParameter.userName" size="mini" placeholder="用户名称" />
        </el-form-item>
        <!-- <el-form-item label="课程ID">
          <el-input v-model="pageParameter.curriculumId" size="mini" placeholder="课程ID" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchWordChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <TableBody ref="tableBody">
      <template>
        <el-table ref="table" v-loading="tableLoading" :data="dataList" class="table-item-imgsize">
          <el-table-column type="selection" width="45" />
          <el-table-column align="center" label="序号" width="80" prop="id" />
          <el-table-column align="center" label="请假人" prop="userName" />
          <el-table-column align="center" label="请假理由" prop="askOffReason" />
          <el-table-column align="center" label="请假课程名称" prop="curriculumName" />
          <el-table-column align="center" label="原开课时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['startTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="新开课时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['updateCurriculumTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课程状态">
            <template slot-scope="scope">
              <!-- <el-switch
                v-model="scope.row.curriculumStatus"
                :active-value="1"
                :inactive-value="0"
              /> -->
              <el-tag v-if="scope.row.status === 0">申请中</el-tag>
              <el-tag v-else-if="scope.row.status === 1" type="success">已同意</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="info">已撤销</el-tag>
              <el-tag v-else type="info">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link
                v-if="scope.row.status === 0"
                type="primary"
                :underline="false"
                @click="openSetReview(scope.row)"
              >审批请假</el-link>
              <el-link v-else type="primary" :underline="false" @click="openQuerIofn(scope.row)">查看详情</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableBody>
    <!-- 表尾 -->
    <el-card :body-style="{ padding: 0 }" class="table-footer-container" shadow="never">
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
    <el-dialog :title="isNew ? '审核请假' : '查看详情'" :visible.sync="dialogEditVisible">
      <el-form ref="userForm" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="表单id" prop="id	">
          <el-input :value="editFrom.id" disabled />
        </el-form-item>
        <el-form-item label="请假人名称" prop="userName">
          <el-input :value="editFrom.userName" disabled />
        </el-form-item>
        <el-form-item label="请假理由" prop="askOffReason">
          <el-input :value="editFrom.askOffReason" disabled />
        </el-form-item>
        <el-form-item label="请假课程名称" prop="curriculumName">
          <el-input :value="editFrom.curriculumName" disabled />
        </el-form-item>
        <el-form-item label="原开课时间" prop="startTime">
          <el-input :value="moment(editFrom.startTime).format('YYYY-MM-DD HH:mm:ss')" disabled />
        </el-form-item>
        <el-form-item label="新开课时间" prop="updateCurriculumTime">
          <el-input :value="moment(editFrom.updateCurriculumTime).format('YYYY-MM-DD HH:mm:ss')" disabled />
        </el-form-item>
        <el-form-item label="是否批准" prop="type">
          <el-select v-if="isNew" v-model="editFrom.status" clearable size="small" style="width: 100%">
            <el-option label="请选择" :value="0" />
            <el-option label="同意" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
          <div v-else>
            <el-tag v-if="editFrom.status === 1" type="success">已同意</el-tag>
            <el-tag v-else-if="editFrom.status === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else-if="editFrom.status === 3" type="info">已撤销</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </div>
        </el-form-item>
        <el-form-item v-if="editFrom.status === 2" label="不通过原因" prop="updateCurriculumTime">
          <el-input v-model="editFrom.refuseReason" />
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
import * as attendanceApi from '@/api/attendance';
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
      editFrom: {},
      /** 表单验证 */
      rules: {
        /* userName: [
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
        ], */
      },
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    moment,
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
      this.editFrom.startTime = minDate ? Number(minDate.getTime() / 1000) : null;
      this.editFrom.endTime = maxDate ? Number(maxDate.getTime() / 1000) : null;
    },
    getTable() {
      this.tableLoading = true;
      if (!this.pageParameter.type && this.pageParameter.type === '') {
        this.pageParameter.userId = '';
      }
      attendanceApi.getEtAskOffPage({
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
     * @description 设置审查
     * @param {Object} row - 对应的表格属性
     */
    openSetReview(row) {
      this.isNew = true;
      this.editFrom = new attendanceApi.EtAskOffModel(row);
      this.editFrom.startTime = this.editFrom.startTime ? Math.floor(this.editFrom.startTime * 1000) : '未设置';
      this.editFrom.updateCurriculumTime = this.editFrom.updateCurriculumTime ? Math.floor(this.editFrom.updateCurriculumTime * 1000) : '未设置';
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 查看请假详情
     * @param {Object} row - 对应的表格属性
     */
    openQuerIofn(row) {
      this.isNew = false;
      this.editFrom = row;
      this.editFrom.startTime = this.editFrom.startTime ? Math.floor(this.editFrom.startTime * 1000) : '未设置';
      this.editFrom.endTime = this.editFrom.updateCurriculumTime ? Math.floor(this.editFrom.updateCurriculumTime * 1000) : '未设置';
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 审核请假
     */
    setReview() {
      attendanceApi.approvalAskOff({
        askIds: [ this.editFrom.id, ],
        status: this.editFrom.status,
        refuseReason: this.editFrom.refuseReason,
      }).then(res => {
        console.log(res);
        this.$message.success('审核成功');
        this.dialogEditVisible = false;
        this.getTable();
      }, (error) => {
        console.log(error);
        this.$message.error('审核失败 ' + error);
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
      if (isNew) {
        this.setReview();
      } else {
        this.dialogEditVisible = false;
      }
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
</style>
