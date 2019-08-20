jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';

  // Get configuration settings
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $date = $('select[name="js-select-date-field"]');
  var $status = $('select[name="js-select-status"]');
  var appId = kintone.app.getId();
  var statusGetBody = {
    'app': appId
  };

  // Retrieve Date field information, then set drop-down
  function setDateDropDown() {
    return KintoneConfigHelper.getFields(['DATETIME', 'DATE']).then(function(resp) {
      var $dateDropDown = $date;
      resp.forEach(function(respField) {
        var $option = $('<option></option>');
        switch (respField.type) {
          case 'DATE':
            $option.attr('value', respField.code + ',' + 'DATE');
            $option.text(respField.label);
            $dateDropDown.append($option.clone());
            break;
          case 'DATETIME':
            $option.attr('value', respField.code + ',' + 'DATETIME');
            $option.text(respField.label);
            $dateDropDown.append($option.clone());
            break;
          default:
            break;
        }
      });
      if (CONF.date) {
        $dateDropDown.val(CONF.date + ',' + CONF.fieldType);
      }
    }, function() {
      alert('There was an error retrieving the Date field information.');
    });
  }

  // Retrieve Status information, then set drop-down
  function setStatusDropDown() {
    return kintone.api(kintone.api.url('/k/v1/preview/app/status', true), 'GET', statusGetBody, function(resp) {
      var $statusDropDown = $status;

      if (resp.enable) {
        resp.actions.forEach(function(respStatus) {
          var status = respStatus.to;
          var $option = $('<option></option>');
          $option.attr('value', status);
          $option.text(status);
          $statusDropDown.append($option.clone());
        });

        if (CONF.status) {
          $status.val(CONF.status);
        }
      } else {
        alert('Please enable Process Management to use this plug-in.');
        window.location.href = '/k/admin/app/status?app=' + appId;
      }
    }, function() {
      // Error
      alert('There was an error retrieving the Status information.');
    });
  }

  $(document).ready(function() {
    // Run drop-down functions
    setDateDropDown();
    setStatusDropDown();

    // Set input values when save button is clicked
    $form.on('submit', function(e) {
      var config = [];
      var date = $date.val();

      config.date = date.split(',')[0]; // Set date or datetime field code
      config.fieldType = date.split(',')[1]; // Set date or datetime field type
      config.status = $status.val(); // Set status value

      e.preventDefault();

      kintone.plugin.app.setConfig(config, function() {
        // Redirect to App Settings
        alert('The plug-in settings have been saved. Please update the app!');
        window.location.href = '/k/admin/app/flow?app=' + appId;
      });
    });
    // Go back a page when cancel button is clicked
    $cancelButton.on('click', function() {
      window.location.href = '/k/admin/app/' + appId + '/plugin/';
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
