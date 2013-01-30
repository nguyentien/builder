/**
 * Control used for managing box-shadow properties.
 */
CoffeeBuilderControls.add('shadow', {

    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return CoffeeBuilderControl.getSelector(manifest).property === 'box-shadow';
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
      var self = this;

      // Set the element
      self.$element = $(
        '<div class="control_group shadow_group">' +
        ' <label class="label_input_grouped"><span class="primary_left section_head"><input class="shadow_enabled shadow_checkbox" type="checkbox"></span></label>' +
        ' <label class="label_input_grouped"><input type="text" class="color_right color_picker shadow_color" value="#777777"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_opacity" type="text" value="90" min="0" max="100" maxlength="3"><span class="shadow_text">%</span></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_x" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_y" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_blur" type="text" value="5" min="0" max="10" maxlength="2"></label>' +
        '</div>' +
        '<span class="shadow_label first">Alpha</span><span class="shadow_label">X</span><span class="shadow_label">Y</span><span class="shadow_label">Blur</span>'
      );

      // Set the fields
      $.each(['checkbox','color','opacity','x','y','blur'], function(index, name){
        self.fields[name] = self.$element.find('input.shadow_' + name);
      });

      // Set the title
      self.setTitle(self.$element.find('span:first'));

      // Add checkbox events
      self.fields.checkbox.change($.proxy(self.checkboxChange, self));

      // Add value events
      CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.color, undefined, {}, $.proxy(self.shadowChange, self));
      $.each(self.fields, function(field_name, field) {
        if(field_name !== 'checkbox' && field_name !== 'color') {
          field.change($.proxy(self.sizerChange, self)).keyup($.proxy(self.sizerKeyup, self));
        }
      });

      self.refresh();
    }

    /**
     * Refreshes the control to reflect the current DOM value.
     *
     * @return  void
     */
  , refresh: function() {
      var shadow = this.getCss();

      // Set defaults
      if(shadow && shadow !== 'none') {
        this.fields.checkbox.attr('checked','checked');

        var hexa = this.getHexAlpha(shadow);
        if(hexa.hex)
        {
          this.fields.opacity.val(Math.round((hexa.alpha ? hexa.alpha : 1) * 100));
          CoffeeBuilderEvents.get('colorpicker_input_change')(hexa.hex, this, this.fields.color, undefined, function(){});
        }

        var match = shadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
        if(match)
        {
           this.fields.x.val(match[1]);
           this.fields.y.val(match[2]);
           this.fields.blur.val(match[3]);
        }
      } else {
        this.fields.checkbox.attr('checked', false);
      }

      CoffeeBuilderEvents.get('shadow_checkbox')(this, null, function(){});
      $.each(this.fields, function(field_name, field) {
        if(field_name !== 'checkbox' && field_name !== 'color') {
          CoffeeBuilderEvents.get('initialize_sizers')(field);
        }
      });
    }

    /**
     * Event listener (proxy) for an input's `change()` event.
     *
     * @param  jQuery.Event event  The input's `change()` event.
     * @param  Boolean
     */
  , sizerChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Event listener (proxy) for an input's `keyup()` event.
     *
     * @param  jQuery.Event event  The input's `keyup()` event.
     * @param  Boolean
     */
  , sizerKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Callback to be triggered when any shadow field changes.
     *
     * @param  void
     */
  , shadowChange: function() {
      return CoffeeBuilderEvents.get('shadow_change')(this);
    }

    /**
     * Event listener (proxy) for the checkbox's `change()` event.
     *
     * @param  jQuery.Event event  The checkbox's `change()` event.
     * @param  Boolean
     */
  , checkboxChange: function(event) {
      return CoffeeBuilderEvents.get('shadow_checkbox')(this);
    }
});
