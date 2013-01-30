/**
 * Global collection of all available controls.
 *
 * Use `CoffeeBuilderControls.add()` for adding controls and
 * `CoffeeBuilderControls.get()` for retrieving controls.
 */
var CoffeeBuilderControls = {
    controls: {}
  , pristine: {}

    /**
     * Adds or replaces a control in to the collection of available controls.
     *
     * control format:
     * --------------
     * {
     *   init:        function(){ },
     *   check:       function(){ },
     *   refresh:     function(){ }, // (optional for style controls)
     *   dataChanged: function(name, value){ } // (optional for data controls)
     * }
     *
     * @param   String name     The name of the control to add.
     * @param   Object control  The control to add
     * @return  void
     */
  , add: function(name, control) {
      if(!control || !$.isFunction(control.init) || !$.isFunction(control.check)) {
        $.error('Invalid control provided');
      }

      this.pristine[name] = control;
      this.controls[name] = function(breakpoint, panel, name, manifest, group) {
        CoffeeBuilderControl.call(this, breakpoint, panel, name, manifest, group);
      };
      this.controls[name].prototype = $.extend(
        {}, control, CoffeeBuilderControl.prototype, { constructor: this.controls[name] }
      );
      this.controls[name].check = control.check;
    }

    /**
     * Gets a CoffeeBuilderControl instance given a JSON manifest.
     *
     * @param   CoffeeBuilder breakpoint   The parent breakpoint
     * @param   CoffeeBuilderPanel panel   The parent panel
     * @param   String name                A unique key to identify the control
     * @param   Object manifest            A JSON manifest that defines the control
     * @param   CoffeeBuilderControlGroup  An optional parent group of related controls
     * @return  CoffeeBuilderControl|CoffeeBuilderControlGroup
     */
  , get: function(breakpoint, panel, name, manifest, group) {
      group = group || {};

      // Every control must have a unique name
      if(!manifest.name) {
        $.error('Invalid control: no name provided');
      }

      // Returns a CoffeeBuilderControlGroup instance if the contorl type is 'group'
      if(manifest.type === 'group') {
        return new CoffeeBuilderControlGroup(breakpoint, panel, name, manifest);
      }

      // Find the control type that is required for the current manifest
      var ControlType = CoffeeBuilderControl;
      $.each(this.controls, function(control_name, control_class) {
        if(control_class.check(manifest)) {
          ControlType = control_class;
          return false;
        }
      });

      // Get an instance of the control and build the element if necessary
      return new ControlType(breakpoint, panel, name, manifest, group);
    }

    /**
     * Gets the prestine version of a control.
     *
     * @param   String name     The name of the control to get.
     * @return  Object
     */
  , getPristine: function(name) {
      if(!$.isPlainObject(this.pristine[name])) {
        $.error('Invalid index provided: ' + name);
      }

      return this.pristine[name];
    }
};
