function aa() {
  console.log('aa');
  require([ '@/layouts/RouterViewLayout.vue', ], 'aa');
}
console.log(typeof aa());
