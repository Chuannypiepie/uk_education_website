<template>
  <div class="main-container homeWork">
    <TableHeader
      :title="title"
      :can-collapsed="false"
    >
      <template slot="right">
        <el-button
          v-if="isCanSort"
          type="primary"
          size="mini"
          :icon="pageParameter.orderByTime?'el-icon-sort-up':'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
        <el-button
          v-if="isCanAdd"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="openAddRole"
        >添加
        </el-button>
      </template>
    </TableHeader>
    <TableBody ref="tableBody">
      <el-table
        ref="table"
        v-loading="tableLoading"
        :data="dataList"
      >
        <el-table-column
          v-for="item in renderFieldList"
          :key="item.label+'_'+item.field"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <!-- {{ scope.row[item.firld] }} -->
            {{ item.rander(scope.row[item.field]) }}
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
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'ApproveHomework',
  components: {
  },
  data: () => ({
    /** @type {String} 表格标题 */
    title: '作业审批',
    /** @type {Boolean} 是否能够添加 */
    isCanAdd: false,
    /** @type {Boolean} 是否有时间排序 */
    isCanSort: true,
    /** @type {Boolean} 表格是否在加载 */
    tableLoading: false,
    /** 操作设置 */
    operation: {
      /** @property {Boolean} 是否能够删除 */
      isCanDelete: false,
      /** @property {Boolean} 是否能够编辑 */
      isCanEdit: false,
    },
    /** @type {Array<Map<String,any>>} 数据源*/
    dataList: [
      {
        'a': 1,
        'b': 'aw',
        'c': new Date(),
      },
    ],
    /** @type {Array<Map<String,any>>} 渲染的字段 */
    renderFieldList: [
      {
        label: '字段A',
        field: 'a',
        rander: function(data) {
          return data;
        },
      },
      {
        label: '字段B',
        field: 'b',
        rander: function(data) {
          return data;
        },
      },
      {
        label: '字段C',
        field: 'c',
        rander: function(data) {
          return moment(data).format('YYYY:MM:DD');
        },
      },
    ],
    /** @type {Object} 页面相关*/
    pageParameter: {
      pageNo: 1,
      pageSize: 10,
      totalSize: 20,
      searchWord: null,
      orderByTime: 0,
      startTime: null,
      endTime: null,
    },
  }),
  watch: {

  },
  methods: {
    /**
     * @method
     * @description 修改时间排序然后获取表 */
    reverseSort() {
      this.pageParameter.pageNo = 1;
      this.pageParameter.pageSize = 10;
      this.pageParameter.orderByTime = !this.pageParameter.orderByTime;
      this.getTable();
    },
    getTable() {},
    /**
     * @method
     * @description 请求角色详情并打开编辑框,如果设置不允许添加直接结束
     * @param {RoleItem} res - 角色模型
     */
    openAddRole() {
      if (!this.isCanAdd) {
        return;
      }
    },
  },
};

</script>

<style>

</style>

