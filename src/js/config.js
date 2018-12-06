jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    // Get configuration settings
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    var $datetime = $('#select_datetime_field'); // Drop-down with ID 'select_datetime_field'
    var $status = $('#select_status'); // Drop-down with ID 'select_status'
    var $form = $('.js-submit-settings'); // Form with class 'js-submit-settings'
    var appId = kintone.app.getId(); // Variable with the App ID

    // Retrieve URL to App Settings page
    function getSettingsUrl() {
        return '/k/admin/app/flow?app=' + appId;
    };

    // Retrieve URL to Process Management Settings page
    function getProcessManagementUrl() {
        return '/k/admin/app/status?app=' + kappId;
    };

    // Set body for API requests
    var body = { 
        "app": appId
    };

    // Retrieve Datetime field information, then set drop-down
    function setDatetimeDropdown() {

        return kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body, function(resp) {
        // Success
            var props = resp.properties;

            for (var datetimeField in props) {
                var field = props[datetimeField];

                if (field.type === 'DATETIME') {
                    console.log(field.code);
                    var $optionDatetime = $('<option>');
                    $optionDatetime.attr('value', field.code);
                    $optionDatetime.text(field.code);
                    $('#select_datetime_field').append($optionDatetime);
                };
            };
            $('#select_datetime_field').val(config.select_datetime_field); 
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Datetime field information. Please try activating your App if it is not activated yet.');
        });
    };

    // Retrieve Status information, then set drop-down
    function setStatusDropdown() {
        return kintone.api(kintone.api.url('/k/v1/app/status', true), 'GET', body, function(resp) {
        // Success
            if (resp.enable === true) {
                for ( var i = 0; i < resp.actions.length; i++){
                    console.log(statuses);
                    var statuses = resp.actions[i].to;
                    var $optionStatus = $('<option>');
                    $optionStatus.attr('value', statuses);
                    $optionStatus.text(statuses);
                    $('#select_status').append($optionStatus);
                };
                $('#select_status').val(config.select_status); 
            } else if (resp.enable === false) {
                // Redirect to Process Management settings if PM is not enabled  
                alert('Please enable Process Management and then update the App to use this plug-in.');
                window.location.href = getProcessManagementUrl();
            };
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Status information. Please try activating your App if it is not activated yet.');
        });
    };

    // Run drop-down functions
    setDatetimeDropdown();
    setStatusDropdown();

    // Set input values when form is submitted
    $form.on('submit', function(e) {
        e.preventDefault();

        kintone.plugin.app.setConfig({select_datetime_field: $('#select_datetime_field').val(), select_status: $('#select_status').val()}, function() {
            // Redirect to App Settings
            alert('Please update the app!');
            window.location.href = getSettingsUrl();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
