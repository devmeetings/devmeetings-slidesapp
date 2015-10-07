export default class DashboardViewOperator {
  isFullscreen (vm, eventId) {
    return eventId === vm.viewOptions.fullscreenEvent._id;
  }

  toggleEventDetailedView (vm, eventId) {
    if (this.isFullscreen(vm, eventId)) {
      vm.viewOptions.fullscreenEvent._id = false;
    } else {
      vm.viewOptions.fullscreenEvent._id = eventId;
    }
  }

  sortBy (vm, byWhat) {
    vm.viewOptions.sort.by = byWhat;
    vm.viewOptions.sort.desc = !vm.viewOptions.sort.desc;
  }
}
