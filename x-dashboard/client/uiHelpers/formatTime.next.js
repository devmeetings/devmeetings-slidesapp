/* jshint esnext:true */
moment.locale("pl");

UI.registerHelper('asTime', (time) => {
    return time ? moment(time).format('HH:mm') : null;
});

UI.registerHelper('asDate', (time) => {
  return time ? moment(time).format('LL') : null;
});
