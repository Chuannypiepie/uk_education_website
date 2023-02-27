<template>
  <div class="main-container">
    欢迎来到英国教育网后台管理系统！
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/ResizeMixin';
export default {
  name: 'Main',
  mixins: [ ResizeMixin, ],
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  font-size: 28px;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
