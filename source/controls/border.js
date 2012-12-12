/**
 * Control used for managing border properties.
 */  
CoffeeBuilderControls.add('border', {

    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, [
        'border-top',
        'border-bottom',
        'border-left',
        'border-right',
        'border'
      ]) !== -1;
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
      var 
        css,
        styles = '',
        revert = false,
        self = this,
        selector = self.getSelector(),
        style = self.getCss(selector.property + '-style') || 'none',
        width = self.getCss(selector.property + '-width') || '0',
        color = self.getCss(selector.property + '-color') || '#000000';
      
      $.each({
        'None':   'none',
        'Dotted': 'dotted',
        'Dashed': 'dashed',
        'Solid':  'solid',
        'Double': 'double',
        'Groove': 'groove',
        'Ridge':  'ridge',
        'Inset':  'inset',
        'Outset': 'outset'
      }, function(name, value) {
        styles += '<option value="' + value + '" title="' + name + '">' + name + '</option>';
      });

      // Set the element
      self.$element = $(
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field">' + styles + '</select></label>' +
        '<label class="label_grouped"><input class="input_right size_field combo_color_and_size" type="text" min="0" max="20" value="13" maxlength="2">%</label>' +
        '<label class="label_grouped"><input type="text" class="color_right color_picker"></label>'
      );
      
      // Set the title
      this.$element.find('span:first').text(self.manifest.name + ':');
      
      // Set the fields
      self.fields = {
        style: this.$element.find('select').val(style),
        width: this.$element.find('input.size_field').val(parseInt(width, 10)),
        color: this.$element.find('input.color_picker').val(color)
      };
      
      // Set field properties
      $.each(['style','width','color'], function(index, name){
        self[name + '_property'] = selector.property + '-' + name;
      });
      
      // Set field events
      self.fields.style.change($.proxy(self.styleChange, self));
      CoffeeBuilderEvents.get('initialize_sizers')(self.fields.width.change($.proxy(self.widthChange, self)).keyup($.proxy(self.widthKeyup, self)));
      CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.color, self.color_property, undefined, $.proxy(self.colorChangeAll, self));
      
      // Add the lock if part of a group
      if(self.group) {
        if(self.group.controls.length === 0) {
          self.locked = true;
          self.$lock = $('<span class="starter_icon border_lock">').wrap('<label class="label_grouped">').click($.proxy(self.borderLock, self));
          this.$element = this.$element.add(self.$lock).find('span:first').prepend($('<b>').text(self.group.manifest.name + ' ')).end();
        } else {
          CoffeeBuilderEvents.get('border_initialize')(self);
        }          
      }
    }

    /**
     * Event listener (proxy) for a width input field's `change()` event.
     *
     * @param  jQuery.Event event  The input `change()` event.
     * @param  Boolean
     */
  , widthChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, this.width_property, $.proxy(this.widthChangeAll, this));
    }
  
    /**
     * Event listener (proxy) for a width input field's `keyup()` event.
     *
     * @param  jQuery.Event event  The input `keyup()` event.
     * @param  Boolean
     */    
  , widthKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, this.width_property, $.proxy(this.widthChangeAll, this));
    }

    /**
     * Hook called after the width input field's `change()` and `keyup()` event
     * to update locked fields if necessary.
     *
     * @param  String newvalue  The updated CSS width
     * @param  Boolean
     */
  , widthChangeAll: function(newvalue) {
      return this.propertyUpdateAll('width_property', 'width', newvalue);
    }      
    
    /**
     * Event listener (proxy) for a style select field's `change()` event.
     *
     * @param  jQuery.Event event  The select `change()` event.
     * @param  Boolean
     */      
  , styleChange: function(event) {
      return CoffeeBuilderEvents.get('select_change')(event, this, this.style_property, $.proxy(this.styleChangeAll, this));
    }
    
    /**
     * Hook called after the width style select field's `change()` event
     * to update locked fields if necessary.
     *
     * @param  String newvalue  The updated CSS style
     * @param  Boolean
     */      
  , styleChangeAll: function(newvalue) {
      return this.propertyUpdateAll('style_property', 'style', newvalue);
    }
    
    /**
     * Hook called after the width color input field's `change()` event
     * to update locked fields if necessary.
     *
     * @param  String newvalue  The updated CSS color
     * @param  Boolean
     */   
  , colorChangeAll: function(newvalue) {
      return this.propertyUpdateAll('color_property', 'color', newvalue);
    }
  
    /**
     * Hook called after`change()` events to update locked fields if 
     * necessary.
     *
     * @param  String newvalue  The updated CSS color
     * @param  Boolean
     */    
  , propertyUpdateAll: function(property, element, newvalue) {
      var self = this;
      self.updateCss(self[property], newvalue);
      
      if(element === 'width') {
        newvalue = parseInt(newvalue, 10);
      }
  
      if(self.locked) {
        $.each(self.group.controls.keys, function(index, name) {
          if(name === self.name) {
            return true;
          }

          self.group.controls.get(name).fields[element].val(newvalue).change();
        });
      }      
    }      
    
    /**
     * Event listener (proxy) for a lock's `click()` event.
     *
     * @param  jQuery.Event event  The lock `click()` event.
     * @param  Boolean
     */      
  , borderLock: function(event) {
      return CoffeeBuilderEvents.get('border_lock')(event, this);
    }      
});
