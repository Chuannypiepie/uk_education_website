<template>
  <div class="admin-user">
    <TableHeader :title="title" :can-collapsed="false">
      <template slot="right">
        <el-button
          type="primary"
          size="mini"
          :icon="pageParameter.timeType ? 'el-icon-sort-up' : 'el-icon-sort-down'"
          @click="reverseSort"
        >时间排序
        </el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddUser">添加
        </el-button>
      </template>
    </TableHeader>
    <el-card class="search-card">
      <el-form :inline="true" :model="pageParameter" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="名称">
          <el-input v-model="pageParameter.searchWord" size="mini" placeholder="名称" />
        </el-form-item>
        <!-- <el-form-item label="账号状态">
          <el-select v-model="pageParameter.isDel" size="mini" placeholder="请选择账号状态">
            <el-option label="正常" value="0" />
            <el-option label="删除" value="1" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="课程类型">
          <el-select v-model="pageParameter.type" clearable size="mini" placeholder="请选择课程类型">
            <el-option label="一对多" :value="0" />
            <el-option label="一对一" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="此开课时间之后">
          <el-date-picker
            v-model="pageParameter.courseStartTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="此开课时间之前">
          <el-date-picker
            v-model="pageParameter.courseEndTime"
            type="date"
            placeholder="选择日期时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="教师ID">
          <el-input v-model="pageParameter.masterId" size="mini" placeholder="教师关联课程" />
        </el-form-item>
        <el-form-item label="学生ID">
          <el-input v-model="pageParameter.studentId" size="mini" placeholder="学生关联课程" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchWordChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <TableBody ref="tableBody">
      <template>
        <el-table ref="table" v-loading="tableLoading" :data="dataList" class="table-item-imgsize">
          <!-- <el-table-column type="selection" width="45" /> -->
          <el-table-column align="center" label="序号" width="80" prop="id" />
          <el-table-column align="center" label="课程名称" prop="curriculumName" />
          <el-table-column align="center" label="课程描述" prop="curriculumDescribe" />
          <el-table-column align="center" label="课程分类" prop="curriculumType" />
          <el-table-column align="center" label="课程类型">
            <template slot-scope="scope">
              <div>
                {{ !!scope.row.type ? '一对一' : '一对多' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="会议链接" prop="conferenceLink" />
          <el-table-column align="center" label="会议密码" prop="conferencePassword" />
          <el-table-column align="center" label="创建人" prop="masterName" />
          <el-table-column align="center" label="开课时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['startTime'] * 1000).format('YY-MM-DD HH:mm') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结束时间">
            <template slot-scope="scope">
              <div>
                {{ moment(scope.row['endTime'] * 1000).format('YY-MM-DD HH:mm') }}
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
              <el-tag v-if="!scope.row.curriculumStatus">进行中</el-tag>
              <el-tag v-else type="danger">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="openEditUser(scope.row.id)">编辑</el-link>
              <el-link type="danger" :underline="false" @click="deleteUser(scope.row.id)">删除</el-link>
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
    <el-dialog :title="isNew ? '添加课程' : '编辑课程'" :visible.sync="dialogEditVisible">
      <el-form ref="userForm" :model="editFrom" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="课程名称" prop="curriculumName	">
          <el-input v-model="editFrom.curriculumName" />
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
          <el-date-picker v-model="editFrom.startTime" type="date" placeholder="选择日期时间" value-format="timestamp" />
        </el-form-item>
        <el-form-item label="课程结束时间">
          <el-date-picker v-model="editFrom.endTime" type="date" placeholder="选择日期时间" value-format="timestamp" />
        </el-form-item>
        <el-form-item label="关联教师" prop="masterId">
          <TeacherSelect
            v-model="editFrom.masterId"
            @associated="associatedTeacher"
          />
        </el-form-item>
        <el-form-item v-if="!isNew" label="关联学生" prop="students">
          <StudentSelect
            :value="null"
            @associated="associatedStudents"
          />
        </el-form-item>
        <el-form-item v-if="!isNew" label="关联的学生">
          <el-tag
            v-for="tag in editFrom.students"
            :key="tag.studentId"
            closable
            :disable-transitions="false"
            @close="tabClose(tag.studentId)"
          >
            {{ tag.studentName }}
          </el-tag>
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
import TeacherSelect from './components/teacher-select.vue';
import StudentSelect from './components/student-select.vue';
import * as lessonsApi from '@/api/lessons-set';
import { PageParameter, LessonModel } from '@/api/model';
export default {
  name: 'AdminUser',
  components: {
    StudentSelect,
    TeacherSelect,
  },
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
      /** @type {Object} - 获取的学生列表 */
      studentsData: {
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
        studentsList: [],
      },
      /** @type {Object} - 获取的老师列表 */
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
     * @description 格式化选中的日期范围值 -- 去除毫秒值
     * @param {Object} data - 日期范围值
     */
    formatPickDate({ maxDate, minDate, }) {
      this.pageParameter.startTime = minDate ? Number(minDate.getTime() / 1000) : null;
      this.pageParameter.endTime = maxDate ? Number(maxDate.getTime() / 1000) : null;
    },
    getTable() {
      this.tableLoading = true;
      lessonsApi.getPageCurriculumInfo({
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
      }, (error) => {
        this.$errorMsg(error);
        this.tableLoading = false;
      }).catch(err => {
        this.$errorMsg(err);
        this.tableLoading = false;
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
    openEditUser(id) {
      lessonsApi.getCurriculumCheckInfo({ CCid: id, }).then(res => {
        if (res.code !== 200) {
          this.$errorMsg('获取数据失败, 请刷新重试');
          return;
        }
        this.isNew = false;
        this.editFrom = new LessonModel(res.result);
        this.editFrom.startTime = this.editFrom.startTime ? Math.floor(this.editFrom.startTime * 1000) : this.editFrom.startTime;
        this.editFrom.endTime = this.editFrom.endTime ? Math.floor(this.editFrom.endTime * 1000) : this.editFrom.endTime;
        // this.editFrom.students = Array.from(new Set(this.editFrom.students.map(item => item.studentId)));
        this.dialogEditVisible = true;
      }, err => {
        this.$errorMsg('错误' + err);
      });
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
      }).catch(error => {
        console.log(error);
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
      }).catch(error => {
        console.log(error);
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
        }).catch(error => {
          console.log(error);
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
     * @description  获取关联老师数据
     */
    associatedTeacher(val) {
      this.editFrom.masterId = val;
    },
    /**
     * @method
     * @description 获取关联学生数据
     */
    associatedStudents(val) {
      !this.editFrom.students && (this.editFrom.students = []);
      if (this.editFrom.students.find(item => item.studentId === val.id)) {
        this.$errorMsg('该用户已存在');
        return;
      }
      this.allotStudent(val.id);
      this.editFrom.students.push({
        /* 后面改为 studentId */
        studentId: val.id,
        studentName: val.username,
      });
    },
    /**
     * @method
     * @description 调用关联学生接口
     */
    allotStudent(studentId) {
      lessonsApi.allotStudentCurriculum({
        curriculumId: this.editFrom.id,
        userIds: [ studentId, ],
      }).then((res) => {
        if (res.code !== 200) {
          this.$message.success('关联学生失败, 请重试');
          return;
        }
      }, err => {
        this.$message.success(err);
      });
    },
    /**
     * @method
     * @description 调用取消关联学生接口
     */
    tabClose(userId) {
      if (this.editFrom.students && this.editFrom.students.length > 0) {
        lessonsApi.removeStudentCurriculum({
          curriculumId: this.editFrom.id,
          userIds: [ userId, ],
        }).then((res) => {
          if (res.code !== 200) {
            this.$message.success('取消关联失败, 请重试');
            return;
          }
          this.editFrom.students.splice(this.editFrom.students.findIndex(item => item.studentId === userId), 1);
        });
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
</style>
