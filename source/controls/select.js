/**
 * Control used for managing select-based data controls.
 */
CoffeeBuilderControls.add('select', {
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return manifest.type === 'select';
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
  , init: function() {
      var
        self = this,
        options = self.manifest.options || {},
        values = options.values || ['Choice 1', 'Choice 2', 'Choice 3'],
        default_data = options['default'];

      // Set the element
      self.$element = $(
        '<div class="control_group">' +
        ' <label class="label_input"><span class="primary_left"></span>' +
        ' <select class="select_field">' +
        ' </select>' +
        '</label>' +
        '</div>'
      );

      self.setTitle(self.$element.find('span:first'));
      self.fields.select = self.$element.find('select');

      // Allow specifying an array of values, which is especially helpful if the
      // keys need to be sorted as jQuery's $.each function will sometimes iterate
      // in an order that is different than the order in which they were defined
      if($.isArray(values)) {
        $.each(values, function(index, value){
          self.fields.select.append($('<option>').val(value).html(value));
        });
      } else {
        $.each(values, function(key, value){
          self.fields.select.append($('<option>').val(key).html(value));
        });
      }

      if(default_data === undefined) {
        default_data = self.fields.select.find('option:first').val();
      } else {
        self.fields.select.val(default_data);
      }

      self.data_name = options.data_name || self.name;
      self.addData(self.data_name, default_data);

      self.fields.select.val(default_data).change($.proxy(self.selectChange, self));
    }

    /**
     * Event listener (proxy) for the select's `change()` event.
     *
     * @param  jQuery.Event event  The select's `change()` event.
     * @param  Boolean
     */
  , selectChange: function(event) {
      return CoffeeBuilderEvents.get('select_data')(event, this, this.data_name);
    }

    /**
     * Listener for when `this.props.data` changes.
     *
     * @param  string name  The name of the key that changed
     * @param  mixed value  The new value
     * @param  mixed
     */
  , dataChanged: function(name, value) {
      if(typeof value === 'number') {
        value = value.toString();
      }

      if(name === this.data_name && this.fields.select.val() !== value) {
        this.fields.select.val(value);
      }

      return value;
    }
});