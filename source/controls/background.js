/**
 * Control used for managing background properties.
 */  
CoffeeBuilderControls.add('background', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {        
      return CoffeeBuilderControl.getSelector(manifest).property === 'background';
    }
    
    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire control
     * this.fields   // hash of jQuery objects for all form fields in the control
     *
     * @return  void
     */      
  , init: function() {
      var bgcolor = this.getCss('background-color') || '#000000';

      this.$element = $('<label class="label_input"><span class="primary_left"></span><input type="text" class="color_right color_picker"></label>');
      this.fields.bgcolor = this.$element.find('input.color_picker').val(bgcolor);
      this.setTitle(this.$element.find('span:first'));

      CoffeeBuilderEvents.get('colorpicker_initialize')(this, this.fields.bgcolor, 'background-color');
    }
});
