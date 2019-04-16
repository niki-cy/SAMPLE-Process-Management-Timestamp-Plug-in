jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';

  // Get configuration settings
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $datetime = $('#select_datetime_field'); // Drop-down with ID 'select_datetime_field'
  var $status = $('#select_status'); // Drop-down with ID 'select_status'
  var appId = kintone.app.getId(); // Variable with the App ID

  // Set body for API requests
  var body = {
    'app': appId
  };

  // Retrieve URL to App Settings page
  function getSettingsUrl() {
    return '/k/admin/app/flow?app=' + appId;
  }
  // Retrieve URL to Process Management Settings page
  function getProcessManagementUrl() {
    return '/k/admin/app/status?app=' + appId;
  }

  // Retrieve Datetime field information, then set drop-down
  function setDatetimeDropdown() {
    return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', body, function(resp) {
      var field;
      var datetimeField;
      var $optionDatetime;
      // Success
      var props = resp.properties;
      for (datetimeField in props) {
        if (props.hasOwnProperty(datetimeField)) {
          field = props[datetimeField];
          if (field.type === 'DATETIME') {
            $optionDatetime = $('<option>');
            $optionDatetime.attr('value', field.code);
            $optionDatetime.text(field.label);
            $datetime.append($optionDatetime);
          }
        }
      }
      if (config.select_datetime_field) {
        $datetime.val(config.select_datetime_field);
      }
    }, function(error) {
      // Error
      alert('There was an error retrieving the Datetime field information.');
    });
  }

  // Retrieve Status information, then set drop-down
  function setStatusDropdown() {
    return kintone.api(kintone.api.url('/k/v1/preview/app/status', true), 'GET', body, function(resp) {
      var i;
      var statuses;
      var $optionStatus;
      // Success
      if (resp.enable === true) {
        for (i = 0; i < resp.actions.length; i++) {
          statuses = resp.actions[i].to;
          $optionStatus = $('<option>');
          $optionStatus.attr('value', statuses);
          $optionStatus.text(statuses);
          $status.append($optionStatus);
        }
        if (config.select_status) {
          $status.val(config.select_status);
        }
      } else {
        // Redirect to Process Management settings if PM is not enabled
        alert('Please enable Process Management to use this plug-in.');
        window.location.href = getProcessManagementUrl();
      }
    }, function(error) {
      // Error
      alert('There was an error retrieving the Status information.');
    });
  }

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
    // Check required fields
    if ($datetime.val() === '-----' || $status.val() === '-----') {
      alert('Please set the required fields');
    } else {
      kintone.plugin.app.setConfig({select_datetime_field: $datetime.val(), select_status: $status.val()}, function() {
        // Redirect to App Settings
        alert('Plug-in settings have been saved. Please update the app!');
        window.location.href = getSettingsUrl();
      });
    }
  });
})(jQuery, kintone.$PLUGIN_ID);
