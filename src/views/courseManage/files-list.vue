<template>
  <div class="main-container">
    <TableHeader
      title="文件管理列表"
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
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="openAddFile"
        >添加
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
        <el-form-item label="用户类型">
          <el-select v-model="pageParameter.type" clearable size="mini" placeholder="请选择审核状态">
            <el-option label="学生" :value="0" />
            <el-option label="老师" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程ID">
          <el-input v-model="pageParameter.curriculumId" size="mini" placeholder="关联的课程ID" />
        </el-form-item>
        <!-- <el-form-item label="用户ID">
          <el-input v-model="pageParameter.userId" size="mini" placeholder="关联的用户ID" />
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
    <el-dialog :title="isNewFile?'添加文件':'编辑文件'" :visible.sync="dialogEditVisible">
      <el-form ref="form" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="file" prop="fileList">
          <el-upload
            ref="upload"
            :action="'http://ukedunet.test.jobs123.cn/admin/upload-file?purpose=' + editFrom.purpose"
            :auto-upload="false"
            :with-credentials="true"
            :file-list="editFrom.fileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :headers="{
              Authorization: token,
            }"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="file Purpose" prop="purpose">
          <el-input v-model="editFrom.purpose" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmClick(isNewFile)">sumbit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as filesApi from '@/api/files-api';
import { PageParameter } from '@/api/model';
import Cookies from 'js-cookie';
import moment from 'moment';
export default {
  name: 'FilesList',
  data() {
    return {
      /** @type {Boolean} - 判断是新增还修改 在点击时候改变 */
      isNewFile: true,
      /** @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Array<Map<String,any>>} 数据源*/
      dataList: [],
      /** @type {Boolean} - 展示dialog */
      dialogEditVisible: false,
      /* 获取token */
      token: Cookies.get('admin-token'),
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
          label: 'userName',
          field: 'userName',
          rander: function(data) {
            return data['userName'];
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
          label: 'createTime',
          field: 'createTime',
          rander: function(data) {
            return data['createTime'] ? moment(data['createTime'] * 1000).format('YY-MM-DD HH:mm:ss') : '暂无';
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
      pageParameter: new PageParameter({ pageSize: 20, }),
      editFrom: {
        fileList: [],
        purpose: '',
      },
      /** 表单验证 */
      rules: {
        purpose: [
          { required: true, message: '请输入上传目的描述', trigger: 'blur', },
        ],
      },
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
     * @description 请求角色详情并打开编辑框,如果设置不允许添加直接结束
     * @param {RoleItem} res - 角色模型
     */
    openAddFile() {
      this.isNewFile = true;
      this.editFrom = {};
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 文件上传成功钩子函数
     */
    uploadSuccess() {
      this.$successMsg('文件上传成功');
      this.dialogEditVisible = false;
      this.$refs.upload.clearFiles();
      this.getTable();
    },
    /**
     * @method
     * @description 文件上传失败钩子函数
     */
    uploadError() {
      this.$errorMsg('文件上传错误');
    },
    /**
     * @method
     * @description 提交角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    createFile() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // console.log(this.$refs.upload);
          this.$refs.upload.submit();
        } else {
          this.$errorMsg('请按要求填写');
        }
      });
    },
    /**
     * @method
     * @description 提交按钮是分流编辑或者添加
     * @param {boolean} isNew - true添加 false修改
     * */
    confirmClick(isNew) {
      if (isNew) {
        this.createFile();
      } else {
        this.submitEditFile();
      }
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
