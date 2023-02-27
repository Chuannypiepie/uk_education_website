<template>
  <div class="main-container">
    <TableHeader
      title="课程资料列表"
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
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="序号/请假人/请假课程..." />
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
          :key="item.label+'_'+item.field"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            {{ item.rander(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="downloadFile(scope.row)">下载</el-link>
            <el-link
              type="danger"
              :underline="false"
              @click="deleteFile(scope.row.id)"
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
          @current-change="currentChanged"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import * as filesApi from '@/api/files-api';
import { PageParameter } from '@/api/model';
import moment from 'moment';
export default {
  name: 'FilesList',
  data() {
    return {
      /** @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Array<Map<String,any>>} 数据源*/
      dataList: [],
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
          label: 'type',
          field: 'type',
          rander: function(data) {
            return data['content'];
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
            return moment(data['createTime'] * 1000).format('YY-MM-DD HH:mm:ss');
          },
        },
      ],
      pageParameter: new PageParameter({ pageSize: 20, }),
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
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
     * @description 默认根据data的 pageParameter 获取数据
     */
    getTable() {
      this.tableLoading = true;
      this.pageParameter.content = '教学资料';
      filesApi.getPageFilesList({
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
      }, _error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      }).catch(_error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      });
    },
    /**
     * @method
     * @description 下载文件
     * @param {String} fileNum 文件编号
     */
    downloadFile(file) {
      filesApi.readFile({
        fileNum: file.fileNum,
      }).then(blob => {
        console.log(blob);
        const urlObject = window.URL || window.webkitURL || window;
        const exportBlob = new Blob([ blob, ]);
        const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        const url = urlObject.createObjectURL(exportBlob);
        a.href = url;
        a.download = file.fileName;
        a.click();
      });
    },
    /**
     * @method
     * @description 删除角色
     * @param {RoleModel} data - 角色模型
     */
    deleteFile(fileId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        filesApi.deleteFile({ fileId, }).then(res => {
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
  },
};
</script>

<style scoped>
.search-card.el-card {
  margin-bottom: 10px;
  box-shadow: none;
}
</style>
