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
          icon="el-icon-plus"
          @click="openAddUser"
        >添加
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-button type="primary" size="mini" @click="setDayCourseDate">设置每天授课时段</el-button>
      <el-button type="primary" size="mini" @click="searchWordChange">设置授课延期最大天数</el-button>
      <el-button type="primary" size="mini" @click="searchWordChange">设置每节课程时间时段</el-button>
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
            type="selection"
            width="45"
          />
          <el-table-column
            align="center"
            label="序号"
            width="80"
            prop="id"
          />
          <el-table-column
            align="center"
            label="课程名称"
            prop="curriculumName"
          />
          <el-table-column
            align="center"
            label="课程描述"
            prop="curriculumDescribe"
          />
          <el-table-column
            align="center"
            label="课程分类"
            prop="curriculumType"
          />
          <el-table-column
            align="center"
            label="课程类型"
          >
            <template slot-scope="scope">
              <div>
                {{ !!scope.row.type ? '一对一':'一对多' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建人"
            prop="masterName"
          />
          <el-table-column
            align="center"
            label="开课时间"
          >
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['startTime'] * 1000).format('YYYY-MM-DD') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="结束时间"
          >
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['endTime'] * 1000).format('YYYY-MM-DD') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="课程状态"
          >
            <template slot-scope="scope">
              <!-- <el-switch
                v-model="scope.row.curriculumStatus"
                :active-value="1"
                :inactive-value="0"
              /> -->
              <el-tag v-if="!scope.row.curriculumStatus">进行中</el-tag>
              <el-tag v-else type="danger">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="openEditUser(scope.row)"
              >编辑</el-link>
              <el-link
                type="danger"
                :underline="false"
                @click="deleteUser(scope.row.id)"
              >删除</el-link>
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
    <el-dialog :title="isNew?'添加课程':'编辑课程'" :visible.sync="dialogEditVisible">
      <el-form ref="userForm" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="课程名称" prop="curriculumName	">
          <el-input v-model="editFrom.curriculumName	" />
        </el-form-item>
        <el-form-item label="课程描述" prop="curriculumDescribe">
          <el-input v-model="editFrom.curriculumDescribe" />
        </el-form-item>
        <el-form-item label="课程分类" prop="curriculumType">
          <el-input v-model="editFrom.curriculumType" />
        </el-form-item>
        <el-form-item label="课程会议密码" prop="conferencePassword">
          <el-input v-model="editFrom.conferencePassword" />
        </el-form-item>
        <el-form-item label="课程会议链接" prop="conferenceLink">
          <el-input v-model="editFrom.conferenceLink" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editFrom.type" size="small" style="width: 100%">
            <el-option label="一对多" :value="0" />
            <el-option label="一对一" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程开始时间">
          <el-date-picker
            v-model="editFrom.startTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="课程结束时间">
          <el-date-picker
            v-model="editFrom.endTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="教师" prop="masterId">
          <!-- <el-select
            v-model="editFrom.masterId"
            v-infinite-scroll="load"
            :infinite-scroll-immediate="true"
            :infinite-scroll-disabled="!isCanNext || rolesLoading"
            multiple
            placeholder="请选择添加权限"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.roleId"
              :label="item.description"
              :value="item.roleName"
            />
            <p v-if="rolesLoading" style="text-align: center;">加载中...</p>
            <p v-if="!isCanNext" style="text-align: center;">没有更多了</p>
          </el-select> -->
          <el-input v-model="editFrom.masterId" />
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
import * as lessonsApi from '@/api/lessons-set';
import * as attendanceApi from '@/api/attendance';
import { mapGetters, mapActions } from 'vuex';
import { PageParameter, LessonModel } from '@/api/model';
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
      editFrom: new LessonModel({}),
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
  computed: {
    ...mapGetters({
      // 获取 角色列表
      rolesList: 'roles/getRolesList',
      // 判断最后一页状态
      isCanNext: 'roles/isCanNext',
    }),
  },
  mounted() {
    this.getTable();
  },
  methods: {
    moment,
    ...mapActions({
      // 调用接口获取 角色列表
      getRolesListAction: 'roles/getRolesListAction',
    }),
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
      attendanceApi.getTimeOptions({
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
      }, (_error) => {
        this.$errorMsg(_error);
      }).catch(_err => {
        this.$errorMsg(_err);
      });
    },
    /**
     * @method
     * @description 请求角色详情并打开编辑框,如果设置不允许添加直接结束
     * @param {RoleItem} res - 角色模型
     */
    openAddUser() {
      this.isNew = true;
      this.editFrom = new LessonModel({});
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 传入角色详情并打开编辑框
     * @param {RoleModel} res - 传入角色模型
     */
    openEditUser(res) {
      this.isNew = false;
      console.log(res);
      this.editFrom = new LessonModel(res);
      this.editFrom.startTime = this.editFrom.startTime ? Math.floor(this.editFrom.startTime * 1000) : this.editFrom.startTime;
      this.editFrom.endTime = this.editFrom.endTime ? Math.floor(this.editFrom.endTime * 1000) : this.editFrom.endTime;
      this.dialogEditVisible = true;
    },
    /**
     * @method
     * @description 增加角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    createUser() {
      lessonsApi.addCurriculum({
        lessonModel: this.editFrom,
      }).then(res => {
        console.log(res);
        this.$message.success('添加成功');
        this.dialogEditVisible = false;
        this.getTable();
      }, (error) => {
        console.log(error);
        this.$message.error('添加失败 ' + error);
      }).catch(_error => {
        console.log(_error);
        this.$errorMsg('发生错误, 请刷新');
      });
    },
    /**
     * @method
     * @description 提交角色编辑成功后关闭编辑框
     * @param {RoleModel} data - 角色模型
     */
    submitEditUser() {
      lessonsApi.updateCurriculum({
        lessonModel: this.editFrom,
      }).then(res => {
        console.log(res);
        this.$message.success('修改成功');
        this.dialogEditVisible = false;
        this.getTable();
      }, (error) => {
        console.log(error);
        this.$message.error('修改失败 ' + error);
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
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.editFrom.startTime = this.editFrom.startTime ? Math.floor(this.editFrom.startTime / 1000) : this.editFrom.startTime;
          this.editFrom.endTime = this.editFrom.endTime ? Math.floor(this.editFrom.endTime / 1000) : this.editFrom.endTime;
          if (isNew) {
            this.createUser();
          } else {
            this.submitEditUser();
          }
        } else {
          this.$errorMsg('请按要求填写');
          return false;
        }
      });
    },
    /**
     * @method
     * @description 删除用户
     * @param {Int} userid - 用户id
     */
    deleteUser(cId) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '重要提示', {
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
        type: 'warning',
      }).then(() => {
        lessonsApi.deleteCurriculum({ cid: cId, }).then(res => {
          // console.log(userId);
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
    /**
     * @method
     * @description 加载角色列表
     */
    load() {
      if (!this.isCanNext) {
        return;
      }
      this.rolesLoading = true;
      this.getRolesListAction().then(_ => {
        this.rolesLoading = false;
      });
    },
    /**
     * @method
     * @description 设置每天授课时段
     */
    setDayCourseDate() {
      console.log('DayCourseDate');
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
