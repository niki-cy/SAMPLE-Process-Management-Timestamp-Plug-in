(function(PLUGIN_ID) {
  'use strict';

  var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID); // Get plug-in setting configuration
  var TIMESTAMP_FIELD = CONFIG.date; // Field code of Date or Datetime field
  var FIELD_TYPE = CONFIG.fieldType; // Field type of Date or Datetime field
  var STATUS_NAME = CONFIG.status; // Name of status

  // Specify Status change events
  var statusEvents = [
    'app.record.detail.process.proceed'
  ];
    // When process management is changed do the following
  kintone.events.on(statusEvents, function(event) {
    var currenttime = new Date(); // Get current datetime
    var timestamp = currenttime.toISOString(); // Change date object to ISO string
    var currentdate = currenttime.getFullYear() + '-' + (currenttime.getMonth() + 1) + '-' + currenttime.getDate();
    var record = event.record;
    var status = event.nextStatus.value;
    var dateFieldSetting = record[TIMESTAMP_FIELD];

    if (!TIMESTAMP_FIELD) {
      alert('Status Timestamp Plug-in Warning:\nThe datetime field is not defined in the plug-in settings.');
    } else if (status === STATUS_NAME) {
      if (FIELD_TYPE === 'DATETIME') {
        dateFieldSetting.value = timestamp;
      } else if (FIELD_TYPE === 'DATE') {
        dateFieldSetting.value = currentdate;
      }
    }
    return event;
  });
})(kintone.$PLUGIN_ID);
