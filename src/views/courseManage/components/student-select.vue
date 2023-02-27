<template>
  <div>
    <el-select
      v-model="selectVal"
      v-infinite-scroll="load"
      :infinite-scroll-immediate="true"
      :infinite-scroll-disabled="!isCanNext || rolesLoading"
      value-key="id"
      placeholder="请选择添加权限"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.username"
        :value="item"
      />
      <p v-if="rolesLoading" style="text-align: center;">加载中...</p>
      <p v-if="!isCanNext" style="text-align: center;">没有更多了</p>
    </el-select>
    <el-button @click="setParentVal()">添加权限</el-button>
  </div>
</template>

<script>
import * as axios from '@/api/http.js';
import { PageParameter } from '@/api/model';
export default {
  name: 'StudentSelect',
  props: {
    value: {
      type: [ Number, Array, null, ],
      default: null,
    },
  },
  data() {
    return {
      rolesLoading: false,
      dataList: [],
      selectVal: this.value,
      pageParameter: new PageParameter({}),
    };
  },
  computed: {
    // 判断是否不是最后一页
    isCanNext() {
      if (this.pageParameter.pageNo <= this.pageParameter.totalSize || this.pageParameter.totalSize === 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    value(newVal) {
      this.selectVal = null;
    },
  },
  mounted() {
    this.getDataListAction();
    console.log('StudentSelect');
  },
  methods: {
    // 请求接口获取值
    getDataListAction() {
      if (!this.isCanNext) {
        return;
      }
      this.rolesLoading = true;
      axios.http({
        url: '/admin/student/getPageStudentInfo',
        method: 'GET',
        data: {
          ...this.pageParameter.toSpecialMap(),
        },
      }).then((res) => {
        if (res.code !== 200) {
          this.$errorMsg('获取列表数据失败, 请刷新重试');
          return;
        }
        this.dataList.push(...res.result.records);
        this.pageParameter.totalSize = res.result.pages;
        this.pageParameter.pageNo = res.result.current + 1;
        this.rolesLoading = false;
      }, () => {
        // console.log('失败返回', error);
        this.$errorMsg('获取列表数据失败, 请刷新重试');
        this.rolesLoading = false;
      });
    },
    /**
     * @method
     * @description 赋值给父元素
     */
    setParentVal() {
      this.$emit('associated', this.selectVal);
      this.selectVal = null;
    },
    /**
     * @method
     * @description 加载角色列表
     */
    load() {
      if (!this.isCanNext) {
        return;
      }
      this.getDataListAction();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
