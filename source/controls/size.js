/**
 * Control used for managing size-related properties.
 */
CoffeeBuilderControls.add('size', {

    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return typeof manifest['default'] === 'string' && manifest['default'].match(/^\d+px$/);
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
        options = this.manifest.options || {},
        min = options.min || '0',
        max = options.max || '1000';

      this.$element = $('<label class="label_input"><span class="primary_left"></span><input type="number" class="input_right size_field"></label>');
      this.fields.input = this.$element.find('input');
      this.setTitle(this.$element.find('span:first'));

      this.fields.input.attr({
        name: this.name,
        min: min,
        max: max,
        maxlength: max.length
      })
      .change($.proxy(this.inputChange, this))
      .keyup($.proxy(this.inputKeyup, this));

      this.refresh();
    }

    /**
     * Refreshes the control to reflect the current DOM value.
     *
     * @return  void
     */
  , refresh: function() {
      var value = parseInt(this.getCss() || this.manifest.options['default'] || this.fields.input.min, 10);
      CoffeeBuilderEvents.get('initialize_sizers')(this.fields.input.val(value));
    }

    /**
     * Event listener (proxy) for the size input field's `change()` event.
     *
     * @param  jQuery.Event event  The input `change()` event.
     * @param  Boolean
     */
  , inputChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this);
    }

    /**
     * Event listener (proxy) for the size input field's `keyup()` event.
     *
     * @param  jQuery.Event event  The input `keyup()` event.
     * @param  Boolean
     */
  , inputKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this);
    }
});
