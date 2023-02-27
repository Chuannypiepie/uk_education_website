<template>
  <div class="auto-search">
    <el-card>
      <el-form :inline="true" :model="from" class="demo-form-inline">
        <el-form-item label="高级搜索" />
        <el-form-item label="名称">
          <el-input v-model="from.userName" size="mini" placeholder="名称" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AutoSearch',
  props: {
    searchFrom: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    from: { userName: '', },
  }),
  watch: {
    searchFrom: {
      deep: true,
      handler (newData) {
        console.log('外部变化了', newData);
        this.from = newData;
      },
    },
  },
  methods: {
    inputFn() {
      this.$emit('input', this.from);
    },
  },
};
</script>

<style>

</style>
