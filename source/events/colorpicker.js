/**
 * Initializes colorpickers.
 *
 * @param   CoffeeBuilderControl control  The colorpicker control
 * @param   jQuery $input                 The input that is linked to the colorpicker
 * @param   String property               An optional CSS property for the control
 * @param   object Options                Options for customizing colorpicker
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('colorpicker_initialize', function(control, $input, property, options, callback){
  var
    design_mode_disabled,
    value = $input.val() || '#000000',
    $picker = $('<div class="color_right fb-color-control"><div></div></div>').insertBefore($input).find('div').css('background-color', value);

  // Initialize the picker, merging the `options` parameter if necessary.
  $picker.ColorPicker(
    $.extend({
        additionalDocuments: control.builder.$contents

      , iframeFix: true

        /**
         * Change event for the colorpicker.
         *
         * @param   String hsb  New hue, saturation, and brightness value
         * @param   String hex  New hex value
         * @param   String rgb  New rgb value
         * @return  void
         */
      , onChange: function(hsb, hex, rgb) {
          CoffeeBuilderEvents.get('colorpicker_change')('#' + hex, control, $input, property, callback);
        }

        /**
         * Event called when a colorpicker is ready to show.
         *
         * @param   DOMElement picker  The colorpicker dom element
         * @return  void
         */
      , onShow: function(picker) {
          // Show the picker if the input is not disabled
          if(!$input.is(':disabled')) {
            if(design_mode_disabled = control.builder.design_mode) {
              control.builder.toggleDesignMode(false);
            }

            $(picker).fadeIn(500);
          }
          return false;
        }

        /**
         * Event called when a colorpicker is ready to hide.
         *
         * @param   DOMElement picker  The colorpicker dom element
         * @return  void
         */
      , onHide: function(picker) {
          $(picker).fadeOut(500, function(){
            if(design_mode_disabled) {
              control.builder.toggleDesignMode(true);
            }
          });
          return false;
        }
    }, options)
  ).ColorPickerSetColor(value);

  // Updating the input should also update the colorpicker
  $input.change(function(){
    CoffeeBuilderEvents.get('colorpicker_input_change')($(this).val(), control, $input, property, callback);
  });
});

/**
 * Change event for when a colorpicker value changes.
 *
 * @param   String value                  The new colorpicker value
 * @param   CoffeeBuilderControl control  The colorpicker control
 * @param   jQuery $input                 The input that is linked to the colorpicker
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('colorpicker_change', function(value, control, $input, property, callback){
  $input.val(value).prev('.fb-color-control').find('div').css('background-color', value);
  return $.isFunction(callback) ? callback(value) : control.updateCss(property, value);
});

/**
 * Change event for when a colorpicker's input value changes.
 *
 * @param   String value                  The new colorpicker value
 * @param   CoffeeBuilderControl control  The colorpicker control
 * @param   jQuery $input                 The input that is linked to the colorpicker
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('colorpicker_input_change', function(value, control, $input, property, callback){
  $input.prev('.fb-color-control').ColorPickerSetColor(value);
  CoffeeBuilderEvents.get('colorpicker_change')(value, control, $input, property, callback);
});
