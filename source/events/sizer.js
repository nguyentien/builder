/**
 * Initializes input sizers by adding the `oldvalue` data property which 
 * enables sizer controls to keep track of previous values in case validation 
 * fails and values need to be reset.
 * 
 * @param   jQuery $sizers  The input sizers
 * @return  void   
 */
CoffeeBuilderEvents.add('initialize_sizers', function($sizers){
  $sizers.each(function(){
    var $sizer = $(this);
    $sizer.data('oldvalue', $sizer.val());
  });
});

/**
 * Change event for sizer controls which updates CSS related to a sizer.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('sizer_change', function(event, control, property, callback){
  var 
    $field = $(event.currentTarget),
    min = parseInt($field.attr('min'), 10),
    max = parseInt($field.attr('max'), 10),
    newvalue = $field.val();

  if(!/^\d+$/.test(newvalue)) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback);
  }

  newvalue = parseInt(newvalue, 10);
  if(!isNaN(min) && newvalue < min) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback, 'The minimum allowed value is ' + min + '.');
  }

  if(!isNaN(max) && newvalue > max) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback, 'The maximum allowed value is ' + max + '.');
  }

  $field.data('oldvalue', newvalue);
  return $.isFunction(callback) ? callback(newvalue + 'px') : control.updateCss(property, newvalue + 'px');
});

/**
 * Keyup event for sizer controls which updates CSS related to a sizer.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('sizer_keyup', function(event, control, property, callback){
  var 
    $field = $(event.currentTarget),
    min = parseInt($field.attr('min'), 10),
    max = parseInt($field.attr('max'), 10),
    newvalue = $field.val();

  if(!/^\d+$/.test(newvalue)) {
     return;
  }

  newvalue = parseInt(newvalue, 10);
  if((!isNaN(min) && newvalue < min) || (!isNaN(min) && newvalue > max)) {
     return;
  }

  return $.isFunction(callback) ? callback(newvalue + 'px') : control.updateCss(property, newvalue + 'px');
});


/**
 * Reset event for sizer controls which is used internally by the other sizer
 * events to reset the sizer values.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @param   string message                An optional message
 * @return  void
 */
CoffeeBuilderEvents.add('sizer_reset', function(event, control, property, callback, message){
  var 
    $field = $(event.currentTarget),
    oldvalue = $field.data('oldvalue') || parseInt(control.getCss(property), 10) || 0;
  
  if(typeof message === 'string') {
     alert(message);
  }
  
  $field.val(oldvalue);
  return $.isFunction(callback) ? callback(oldvalue + 'px') : control.updateCss(property, oldvalue + 'px');  
});