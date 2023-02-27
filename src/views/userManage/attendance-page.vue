<template>
  <div class="admin-user">
    <TableHeader :title="title" :can-collapsed="false">
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.timeOrder ? 'el-icon-sort-up' : 'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="出勤类型">
          <el-select v-model="pageParameter.type" size="mini" placeholder="请选择账号状态">
            <el-option label="全部" :value="0" />
            <el-option label="准时" :value="1" />
            <el-option label="迟到" :value="2" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出勤角色">
          <el-select v-model="pageParameter.role" size="mini" placeholder="请选择角色">
            <el-option label="全部" :value="0" />
            <el-option label="老师" :value="1" />
            <el-option label="学生" :value="2" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item v-if="pageParameter.role > 0" label="用户Id">
          <el-input v-model="pageParameter.userId" size="mini" placeholder="用户Id" />
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
      <template>
        <el-table ref="table" v-loading="tableLoading" :data="dataList" class="table-item-imgsize">
          <el-table-column align="center" label="序号" prop="id" />
          <el-table-column align="center" label="课程名称" prop="curriculumName" />
          <el-table-column align="center" label="出勤人" prop="userName" />
          <el-table-column align="center" label="出勤人ID" prop="userId" />
          <el-table-column align="center" label="考勤时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['attendanceTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出勤时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['createTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
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
      title: '后台用户操作日志',
      /** @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Array} - Table表格展示数据 */
      dataList: [],
      /** @type {PageParameter} - 页码状态 */
      pageParameter: new PageParameter({ pageSize: 20, }),
    };
  },
  watch: {
    // pageParameter
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
      this.pageParameter.timeOrder = !this.pageParameter.timeOrder ? 1 : 0;
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
    getTable() {
      this.tableLoading = true;
      if (this.pageParameter.role === 0) {
        this.pageParameter.userId = '';
      }
      attendanceApi.getAttendancePageInfo({
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
