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
CoffeeBuilderEvents.add('subpanels_change', function(builder, parent){
  var width = (builder.width - parent.panels.length + 1) / parent.panels.length;
  $.each(parent.panels.items, function(index, panel){
    panel.$title.removeClass('last').css('width', width + 'px');
  });
  parent.panels.get(parent.panels.length-1).$title.addClass('last');
});