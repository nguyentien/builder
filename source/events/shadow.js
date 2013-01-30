/**
 * Change event for all elements in the shadow control.
 *
 * NOTE: All shadow controls share the same change event because currently
 * specs do not allow for specifying individual shadow properties like
 * `box-shadow-blur`.
 *
 * @see     http://lists.w3.org/Archives/Public/www-style/2009Nov/0315.html
 * @see     http://lists.w3.org/Archives/Public/www-style/2009Nov/0317.html
 *
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('shadow_change', function(control, property, callback){
  if(!control.fields.checkbox.is(':checked')) {
    return;
  }

  var newvalue =
    'rgba(' +
      control.getRgb(control.fields.color.val()) + ', ' +
      control.fields.opacity.val() / 100 +
    ') ' +
    control.fields.x.val() + 'px ' +
    control.fields.y.val() + 'px ' +
    control.fields.blur.val() + 'px 0';

  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});

/**
 * Change event for the checkbox that enables/disables box-shadow.
 *
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('shadow_checkbox', function(control, property, callback) {
  var checked = control.fields.checkbox.is(':checked');

  // Disable fields in control if checkbox isn't checked
  $.each(control.fields, function(control_name, $field) {
    if(control_name !== 'checkbox') {
      $field.attr('disabled', !checked);
    }
  });

  if(checked) {
    return CoffeeBuilderEvents.get('shadow_change')(control, property, callback);
  }

  return $.isFunction(callback) ? callback('none') : control.updateCss(property, 'none');
});
