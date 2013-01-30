/**
 * Control used for managing select-based (number) data controls.
 */
CoffeeBuilderControls.add('select_number', $.extend({}, CoffeeBuilderControls.getPristine('select'), {
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return manifest.type === 'select_number';
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

      this.manifest.options.fix = 0;
      if(this.manifest.options.values === undefined) {
        this.manifest.options.values = ['1','2','3','4','5','6','7','8','9','10'];
      }

      if(this.manifest.options.min && this.manifest.options.max) {
        this.manifest.options.values = [];
        this.manifest.options.step = this.manifest.options.step || 1;
        this.manifest.options.fix = this.manifest.options.step.toString().replace(/^(?:(.*)\.)?.+$/, '$1').length;

        for(var i = this.manifest.options.min; i <= this.manifest.options.max; i += this.manifest.options.step) {
          this.manifest.options.values.push(i.toFixed(this.manifest.options.fix).toString());
        }
      }

      if(typeof this.manifest.options['default'] === "number") {
        this.manifest.options['default'] = this.manifest.options['default'].toFixed(this.manifest.options.fix).toString();
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
      if(typeof value === 'number') {
        value = value.toString();
      }

      if(name === this.data_name && this.fields.select.val() !== value) {
        this.fields.select.val(value);
      }

      return this.manifest.options.fix !== 0 ? parseFloat(value, 10) : parseInt(value, 10);
    }
}));