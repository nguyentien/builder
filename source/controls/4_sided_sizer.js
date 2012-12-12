/**
 * Control used for managing properties with top, left, bottom, and right
 * sizes (margins/padding).
 */  
CoffeeBuilderControls.add('4_sided_sizer', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, ['margin','padding']) !== -1;
    }
    
    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element   // jQuery object for the entire control
     * this.fields     // hash of jQuery objects for all form fields in the control
     * this.props.css  // (optional) CSS properties managed by the control
     *
     * @return  void
     */      
  , init: function() {
      var 
        self = this,
        selector = self.getSelector(),
        properties = ['top','right','bottom','left'];

      if(self.manifest.options && $.isArray(self.manifest.options.properties)) {
        properties = self.manifest.options.properties;
      }

      // Set the element
      self.$element = $('<div class="four_sided_container clearfix">');
      self.$four_sided_labels= $('<div class="four_sided_labels clearfix">');
      
      // Set the fields
      $.each(properties, function(index, side){
        
        var 
          $field = $('<label class="label_input_grouped"><input class="input_right sizer" type="number" min="0" max="100"></label>'),
          $label = $('<span class="sizer_label">' + side.charAt(0).toUpperCase() + side.substr(1) + '</span>'),
          property = selector.property + '-' + side,
          size = self.getCss(property) || 0;
          
        // Add the title
        if(index === 0) {
          $field.prepend(self.setTitle($('<span class="primary_left"></span>')));
        }
        
        // Specify specific properties if necessary
        if(properties.length !== 4) {
          self.props.css.push(property);
        }
        
        self.fields[property] = $field.find('input.sizer')
          .data('builder-property', property)
          .val(parseInt(size, 10))
          .change($.proxy(self.sizeChange, self))
          .keyup($.proxy(self.sizeKeyup, self));
        CoffeeBuilderEvents.get('initialize_sizers')(self.fields[property]);
        
        self.$element.append($field);
        self.$four_sided_labels.append($label);
      });

      self.$element.append(self.$four_sided_labels);
    }
    
    /**
     * Event listener (proxy) for a size input field's `change()` event.
     *
     * @param  jQuery.Event event  The input `change()` event.
     * @param  Boolean
     */      
  , sizeChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, $(event.currentTarget).data('builder-property'));
    }
  
    /**
     * Event listener (proxy) for a size input field's `keyup()` event.
     *
     * @param  jQuery.Event event  The input `keyup()` event.
     * @param  Boolean
     */
  , sizeKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, $(event.currentTarget).data('builder-property'));
    }      
});
