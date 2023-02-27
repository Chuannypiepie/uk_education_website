<template>
  <div class="admin-user">
    <TableHeader
      :title="title"
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
        <el-form-item label="关键字">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchWordChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <TableBody ref="tableBody">
      <template>
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="dataList"
          class="table-item-imgsize"
        >
          <el-table-column
            align="center"
            label="序号"
            width="80"
            prop="id"
          />
          <el-table-column
            align="center"
            label="聊天室名称"
            prop="roomName"
          />
          <el-table-column
            align="center"
            label="老师名称"
            prop="details"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row['userType'] === 1 ? scope.row['userName']: scope.row['pmUserName'] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="学生名称"
            prop="requestDevice"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row['userType'] === 0 ? scope.row['userName']: scope.row['pmUserName'] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建时间"
          >
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['createTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="修改时间"
          >
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['updateTime'] * 1000).format('YY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="openMessagesLog(scope.row.id)">查看聊天记录</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
import moment from 'moment';
import * as chatRoomApi from '@/api/chat-room';
import { PageParameter } from '@/api/model';
export default {
  name: 'AdminUser',
  data() {
    return {
      title: '聊天室列表',
      /** @type {Boolean} 表格是否在加载 */
      tableLoading: false,
      /** @type {Array} - Table表格展示数据 */
      dataList: [],
      /** @type {PageParameter} - 页码状态 */
      pageParameter: new PageParameter({ pageSize: 20, }),
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
    getTable() {
      this.tableLoading = true;
      chatRoomApi.getChatRoomPage({
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
     * 查看聊天室的消息记录
     * @date 2022-12-19
     * @param {any} id - 获取聊天室id
     * @returns {any}
     */
    openMessagesLog(id) {
      console.log(id);
      this.$router.push('/messageManage/room-log/' + id);
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
</style>
