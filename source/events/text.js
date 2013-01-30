/**
 * Change event for text fields which updates corresponding text elements.
 *
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The text control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('text_change', function(event, control, callback){
  var newvalue = $(event.currentTarget).val();
  return $.isFunction(callback) ? callback(newvalue) : control.updateTextElement(newvalue);
});
