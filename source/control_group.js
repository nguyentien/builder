/**
 * A group to hold related controls.
 *
 * @param   CoffeeBuilder breakpoint   The parent breakpoint
 * @param   CoffeeBuilderPanel panel   The parent panel
 * @param   String name                A unique key to identify the control
 * @param   Object manifest            A JSON manifest that defines the control
 * @return  void
 */
var CoffeeBuilderControlGroup = function(breakpoint, panel, name, manifest) {
  var self = this;
  self.controls = new CoffeeBuilderCollection();

  CoffeeBuilderControl.call(self, breakpoint, panel, name, manifest);
  self.$element = $('<div class="control_group">');

  if(manifest.customizations) {
    $.each(manifest.customizations, function(control_name, control){
      var new_control = CoffeeBuilderControls.get(breakpoint, panel, control_name, control, self);

      self.controls.add(control_name, new_control);
      self.$element.append(new_control.$element);
    });
  }
};
CoffeeBuilderControlGroup.prototype = $.extend({}, CoffeeBuilderControl.prototype, {
    constructor: CoffeeBuilderControlGroup

    /**
     * Triggers the `change()` event for all form fields on all controls.
     *
     * @return  void
     */
  , change: function(){
      $.each(this.controls.items, function(control_name, control){
        control.change();
      });
    }

    /**
     * Triggers the `refresh()` event for all all controls.
     *
     * @return  void
     */
  , refresh: function() {
      $.each(this.controls.items, function(control_name, control){
        if($.isFunction(control.refresh)) {
          control.refresh();
        }
      });
    }

    /**
     * Returns a stylesheet representing all current customizations.
     *
     * @param   boolean full  If the full stylesheet (not just customizations) should be returned.
     * @return  string
     */
  , getStyleSheet: function(full) {
      var stylesheet = new CoffeeBuilderStylesheet(this.breakpoint);

      $.each(this.controls.items, function(control_name, control){
        stylesheet.merge(control.getStyleSheet(full));
      });

      return stylesheet;
    }

    /**
     * Gets/Sets data object for all controls.
     *
     * @param   Object data  The data object (optional, used for setting)
     * @return  Object
     */
  , data: function(data) {
      var writer = arguments.length > 0;
      data = data || {};

      $.each(this.controls.items, function(control_name, control){
        if(writer) {
          control.data(data);
        } else {
          $.extend(data, control.data());
        }
      });

      return data;
    }

    /**
     * Given a jQuery element, checks if this group has fields that are meant
     * to manage that element.
     *
     * @param   jQuery $element  The element to check for
     * @return  Boolean
     */
  , hasElement: function($element) {
      var found = false;

      if(this.controls.length) {
        $.each(this.controls.items, function(control_name, control){
          if(control.hasElement($element)) {
            found = true;
            return false;
          }
        });
      }

      return found;
    }
});
