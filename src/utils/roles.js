import store from '@/store';
export class RolesData {
  constructor() {
    this.pageNo = store.state.roles.pageNo;
    this.pageSize = store.state.roles.pageSize;
    this.rolesList = store.state.roles.rolesList;
  }
}
