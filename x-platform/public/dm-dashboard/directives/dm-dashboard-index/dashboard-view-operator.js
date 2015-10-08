import _ from '_';
import moment from 'moment';

let viewOptions = {
  strategicView: 'table',
  fullscreenEvent: {
    _id: undefined
  },
  showTiles: true,
  sort: {
    by: undefined,
    desc: false
  },
  allProblemsOnScreen: false
};

class DashboardViewOperator {

  constructor (data) {
    _.extend(this, data);
  }

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

  minutesAfterExpectedEndDate (expectedEnd) {
    let now = moment();
    let difference = now.diff(expectedEnd, 'minutes');
    return difference;
  }

  referToExpectedEndDate (expectedEnd) {
    if (!expectedEnd) {
      return 'ended';
    }

    let minutesAfterExpectedEndDate = this.minutesAfterExpectedEndDate(expectedEnd);

    if (minutesAfterExpectedEndDate) {
      if (minutesAfterExpectedEndDate < 60) {
        return minutesAfterExpectedEndDate + 'min. after expected end';
      } else {
        return 'ended';
      }
    }

    return moment(expectedEnd).format('HH:mm');
  }
}

let dVOperator = new DashboardViewOperator({viewOptions});
export default dVOperator;
