(function(PLUGIN_ID) {
  'use strict';

  var config = kintone.plugin.app.getConfig(PLUGIN_ID); // Get plug-in setting configuration
  var TIMESTAMP_FIELD = config.select_datetime_field; // Field code of Datetime field
  var STATUS_NAME = config.select_status; // Name of status

  // Specify Status change events
  var statusEvents = [
    'app.record.detail.process.proceed'
  ];
    // When process management is changed do the following
  kintone.events.on(statusEvents, function(event) {
    var currenttime = new Date(); // Get current datetime
    var timestamp = currenttime.toISOString(); // Change date object to ISO string
    var record = event.record;
    var status = event.nextStatus.value;
    var datetimeFieldSetting = record[TIMESTAMP_FIELD];

    if (!TIMESTAMP_FIELD) {
      alert('Status Timestamp Plug-in Warning:\nThe datetime field is not defined in the plug-in settings.');
    } else if (status === STATUS_NAME) {
      datetimeFieldSetting.value = timestamp;
    }
    return event;
  });
})(kintone.$PLUGIN_ID);
