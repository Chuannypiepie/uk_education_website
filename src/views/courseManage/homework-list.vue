<template>
  <div>
    <TableHeader
      title="作业管理"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.timeType?'el-icon-sort-up':'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="搜索关键字">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="搜索关键字" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="pageParameter.status" clearable size="mini" placeholder="请选择审核状态">
            <el-option label="保存中" :value="0" />
            <el-option label="上传完成（通过审核）" :value="1" />
            <el-option label="审核中" :value="2" />
            <el-option label="未通过审核" :value="3" />
          </el-select>
          <!-- <el-input v-model="searchFrom.isDel" size="mini" placeholder="审批人" /> -->
        </el-form-item>
        <el-form-item label="课程ID">
          <el-input v-model="pageParameter.curriculumId" size="mini" placeholder="关联的课程ID" />
        </el-form-item>
        <!-- <el-form-item label="用户ID">
          <el-input v-model="pageParameter.studentId" size="mini" placeholder="关联的用户ID" />
        </el-form-item> -->
        <el-form-item label="用户名称">
          <el-input v-model="pageParameter.userName" size="mini" placeholder="用户名称" />
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
          v-for="item in renderFieldList"
          :key="item.field"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            {{ item.rander(scope.row) }}
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
    <el-dialog :title="isNew ? '审核请假' : '查看详情'" :visible.sync="dialogEditVisible">
      <el-form ref="userForm" :model="editFrom" label-width="150px" label-position="left">
        <el-form-item label="表单id" prop="id	">
          <el-input :value="editFrom.id" disabled />
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <el-input :value="editFrom.fileName" disabled />
        </el-form-item>
        <el-form-item label="文件大小" prop="fileName">
          <el-input :value="editFrom.fileName" disabled />
        </el-form-item>
        <el-form-item label="文件存放路径" prop="systemFileName">
          <el-input :value="editFrom.systemFileName" disabled />
        </el-form-item>
        <el-form-item label="上传时间" prop="createTime">
          <el-input :value="moment(editFrom.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')" disabled />
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
import * as homeworkApi from '@/api/home-work';
import { HomeWorkModel, PageParameter } from '@/api/model';
export default {
  name: 'HomeworkList',
  data() {
    return {
      /**  @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
      isNew: true,
      /** @type {Boolean} - 展示dialog */
      dialogEditVisible: false,
      homeworkForm: new HomeWorkModel({}),
      pageParameter: new PageParameter({}),
      dataList: [],
      /** @type {Object} - form 表单数据 */
      editFrom: {},
      /** @type {Array<Map<String,any>>} 渲染的字段 */
      renderFieldList: [
        {
          label: 'id',
          field: 'id',
          rander: function(data) {
            return data['id'];
          },
        },
        {
          label: 'fileName',
          field: 'fileName',
          rander: function(data) {
            return data['fileName'];
          },
        },
        {
          label: 'fileSize',
          field: 'fileSize',
          rander: function(data) {
            return data['fileSize'];
          },
        },
        {
          label: 'userName',
          field: 'userName',
          rander: function(data) {
            return data['userName'];
          },
        },
        {
          label: 'createTime',
          field: 'createTime',
          rander: function(data) {
            return moment(data['createTime'] * 1000).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          label: 'deleteTime',
          field: 'deleteTime',
          rander: function(data) {
            return data['deleteTime'] ? moment(data['deleteTime'] * 1000).format('YY-MM-DD HH:mm:ss') : '未删除';
          },
        },
      ],
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
      this.pageParameter.timeType = !this.pageParameter.timeType ? 1 : 0;
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
     * @description 根据页码参数获取作业列表
     */
    getTable() {
      this.tableLoading = true;
      homeworkApi.getPageHomeworkInfo({
        pageParameter: this.pageParameter,
      }).then(_res => {
        if (_res.code !== 200) {
          console.log(_res.message);
          this.$errorMeg('发生错误, 请刷新');
          return;
        }
        // 赋值表格数据
        this.dataList = _res.result.records;
        // 总数
        this.pageParameter.totalSize = _res.result.total;
        this.tableLoading = false;
      }, (_error) => {
        this.$errorMeg('发生错误, 请刷新');
        this.tableLoading = false;
      });
    },
    /**
     * @method
     * @description 设置审查
     * @param {Object} row - 对应的表格属性
     */
    openSetReview(row) {
      this.isNew = true;
      this.editFrom = row;
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
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 审核请假
     */
    setReview() {
      homeworkApi.approvalHomeworkCheck({
        homeworkCheckId: [ this.editFrom.id, ],
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

</style>
