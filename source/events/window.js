/**
 * Event triggered when a window is resized to ensure that the iframe element
 * always occupies all available space except for what is designated for the
 * UI controls.
 *
 * @param   jQuery.Event event     The resize event.
 * @param   CoffeeBuilder builder  The parent builder
 * @param   Function callback      An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('window_resize', function(event, builder, callback){
  builder.$center.width($(event.currentTarget.document).width() - builder.width);

  if($.isFunction(callback)) {
    callback();
  }
});
