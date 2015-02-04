/* jshint esnext:true */

UI.registerHelper('asTime', (time) => {
    return time ? moment(time).format('HH:mm') : null;
});
