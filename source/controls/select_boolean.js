/**
 * Control used for managing select-based (boolean) data controls.
 */
CoffeeBuilderControls.add('select_boolean', $.extend({}, CoffeeBuilderControls.getPristine('select'), {
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */    
    check: function(manifest) {
      return manifest.type === 'select_boolean';
    }

    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element    // jQuery object for the entire control
     * this.fields      // hash of jQuery objects for all form fields in the control
     * this.props.data  // An object of data controlled by this element
     *
     * @return  void
     */  
  , init: function(){    
      if(this.manifest.options === undefined) {
        this.manifest.options = {};
      }
      
      if(this.manifest.options.values === undefined) {
        this.manifest.options.values = ['Yes', 'No'];
      }

      CoffeeBuilderControls.getPristine('select').init.call(this);
    }
    
    /**
     * Listener for when `this.props.data` changes.
     *
     * @param  string name  The name of the key that changed
     * @param  mixed value  The new value
     * @param  mixed
     */    
  , dataChanged: function(name, value) {
      var
        self = this,
        false_values = ['off','disabled','no','false','0','null','undefined'];

      if(name === self.data_name && self.fields.select.val() !== value) {
        if(typeof value === 'boolean') {
          self.fields.select.find('option').each(function(){
            var val = $(this).val();
            if($.inArray(val.toLowerCase(), false_values) !== -1) {
              if(!value) {
                self.fields.select.val(val);
                return false;
              }
            } else if(value) {
              self.fields.select.val(val);
              return false;
            }
          });
        } else {
          self.fields.select.val(value);
        }
      }
  
      return (!value || $.inArray(value.toString().toLowerCase(), false_values) !== -1) ? false : true;
    }
}));