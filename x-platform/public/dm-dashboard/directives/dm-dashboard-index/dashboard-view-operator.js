export default class DashboardViewOperator {
  isFullscreen (eventId, fullscreenEventId) {
    return eventId === fullscreenEventId;
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
