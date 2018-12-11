jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    // Get configuration settings
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    var $datetime = $('#select_datetime_field'); // Drop-down with ID 'select_datetime_field'
    var $status = $('#select_status'); // Drop-down with ID 'select_status'
    var appId = kintone.app.getId(); // Variable with the App ID

    // Retrieve URL to App Settings page
    function getSettingsUrl() {
        return '/k/admin/app/flow?app=' + appId;
    };

    // Retrieve URL to Process Management Settings page
    function getProcessManagementUrl() {
        return '/k/admin/app/status?app=' + appId;
    };

    // Set body for API requests
    var body = { 
        "app": appId
    };

    // Retrieve Datetime field information, then set drop-down
    function setDatetimeDropdown() {

        return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', body, function(resp) {
        // Success
            var props = resp.properties;

            for (var datetimeField in props) {
                var field = props[datetimeField];

                if (field.type === 'DATETIME') {
                    var $optionDatetime = $('<option>');
                    $optionDatetime.attr('value', field.code);
                    $optionDatetime.text(field.code);
                    $datetime.append($optionDatetime);
                };
            };
            
            if (config.select_datetime_field) {
                $datetime.val(config.select_datetime_field);
            };
            
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Datetime field information.');
        });
    };

    // Retrieve Status information, then set drop-down
    function setStatusDropdown() {
        return kintone.api(kintone.api.url('/k/v1/preview/app/status', true), 'GET', body, function(resp) {
        // Success
            if (resp.enable === true) {
                for ( var i = 0; i < resp.actions.length; i++){
                    var statuses = resp.actions[i].to;
                    var $optionStatus = $('<option>');
                    $optionStatus.attr('value', statuses);
                    $optionStatus.text(statuses);
                    $status.append($optionStatus);
                };
                
                if (config.select_status) {
                    $status.val(config.select_status);
                };
                
            } else {
                // Redirect to Process Management settings if PM is not enabled  
                alert('Please enable Process Management to use this plug-in.');
                window.location.href = getProcessManagementUrl();
            };
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Status information.');
        });
    };

    // Run drop-down functions
    setDatetimeDropdown();
    setStatusDropdown();

    // Go back a page when cancel button is clicked
    $('#settings-cancel').click(function() {
        history.back();
    });

    // Set input values when save button is clicked
    $('#settings-save').click(function(e) {
        e.preventDefault();
        kintone.plugin.app.setConfig({select_datetime_field: $datetime.val(), select_status: $status.val()}, function() {
            // Redirect to App Settings
            alert('Plug-in settings have been saved. Please update the app!');
            window.location.href = getSettingsUrl();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
