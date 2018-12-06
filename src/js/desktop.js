(function(PLUGIN_ID) {
    'use strict';

    // Specify events to run the plug-in at
    var runEvents = [
        'app.record.detail.show',
        'mobile.app.record.detail.show'
    ];

    kintone.events.on(runEvents, function() {

        var config = kintone.plugin.app.getConfig(PLUGIN_ID);
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
        
            // Insert current datetime into timestamp datetime field if status is 'Completed'
            if (status === STATUS_NAME) {
                record[TIMESTAMP_FIELD]['value'] = timestamp;
            };
            
            return event;
        })
    });

})(kintone.$PLUGIN_ID);