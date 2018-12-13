(function(PLUGIN_ID) {
    'use strict';

    var config = kintone.plugin.app.getConfig(PLUGIN_ID); // Get plug-in setting configuration
    var TIMESTAMP_FIELD = config.select_datetime_field; // Field code of Datetime field
    var STATUS_NAME = config.select_status; // Name of status

    // Specify Status change events
    var statusEvents = [
        'app.record.detail.process.proceed',
        'mobile.app.record.detail.process.proceed'
    ];

    // When process management is changed do the following
    kintone.events.on(statusEvents, function(event) {
        var currenttime = new Date(); // Get current datetime
        var timestamp = currenttime.toISOString(); // Change date object to ISO string
        var record = event.record; 
        var status = event.nextStatus.value;
        var datetimeFieldSetting = record[TIMESTAMP_FIELD];

        /* Give alert errors if the status or datetime field has not been set in the plug-in settings. 
        If set, insert current datetime into timestamp datetime field if status matches that defined in the settings.*/
        if (STATUS_NAME === '-----') {
            alert('Status Timestamp Plug-in Warning:\nThe status is not defined in the plug-in settings.')
        } else if (status === STATUS_NAME && !datetimeFieldSetting || status === STATUS_NAME && datetimeFieldSetting === '-----' ) {
            alert('Status Timestamp Plug-in Warning:\nThe datetime field is not defined in the plug-in settings.');
        } else if (status === STATUS_NAME) {
            datetimeFieldSetting['value'] = timestamp;
        };
        
        return event;
    })

})(kintone.$PLUGIN_ID);
