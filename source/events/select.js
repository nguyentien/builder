/**
 * Change event for selects which updates corresponding CSS.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The select control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('select_change', function(event, control, property, callback){
  var newvalue = $(event.currentTarget).val();
  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});
