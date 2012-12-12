/**
 * Change event for repeat position control which change repeat of background image
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The repeat control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('repeat_change', function (event, control, property, callback) {
    var newvalue = $(event.currentTarget).val();
    
    // Set value for hidden field
    control.fields.hidden_repeat.val(newvalue);
    return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});