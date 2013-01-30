/**
 * Control used for managing text-related properties.
 */
CoffeeBuilderControls.add('text', {

    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {
      return manifest.type === 'text';
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
        fonts = '',
        $text = this.getElement(true);

      // Fonts list
      $.each({
        'Arial':                  "Arial, Helvetica, sans-serif",
        'Baskerville':            "Baskerville, 'Times New Roman', Times, serif",
        'Cambria':                "Cambria, Georgia, Times, 'Times New Roman', serif",
        'Century Gothic':         "'Century Gothic', 'Apple Gothic', sans-serif",
        'Consolas':               "Consolas, 'Lucida Console', Monaco, monospace",
        'Copperplate Light':      "'Copperplate Light', 'Copperplate Gothic Light', serif",
        'Courier New':            "'Courier New', Courier, monospace",
        'Franklin Gothic Medium': "'Franklin Gothic Medium', 'Arial Narrow Bold', Arial, sans-serif",
        'Futura':                 "Futura, 'Century Gothic', AppleGothic, sans-serif",
        'Garamond':               "Garamond, 'Hoefler Text', 'Times New Roman', Times, serif",
        'Geneva':                 "Geneva, 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', Verdana, sans-serif",
        'Georgia':                "Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif",
        'Gill Sans':              "'Gill Sans', Calibri, 'Trebuchet MS', sans-serif",
        'Helvetica':              "Helvetica, Arial, sans-serif",
        'Impact':                 "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
        'Lucida Sans':            "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
        'Palatino':               "Palatino, 'Palatino Linotype', Georgia, Times, 'Times New Roman', serif",
        'Tahoma':                 "Tahoma, Geneva, Verdana",
        'Times':                  "Times, 'Times New Roman', Georgia, serif",
        'Trebuchet MS':           "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        'Verdana':                "Verdana, Geneva, Tahoma, sans-serif"
      }, function(name, value) {
        fonts += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
      });

      // Set the CSS properties
      this.props.css = ['font-family','font-size','color'];

      // Set the element
      this.$element = $(
        '<div class="control_group text_group">' +
        ' <label class="label_input"><span class="primary_left"></span><input type="text" class="input_right description_text" maxlength="36"></label>' +
        ' <label class="label_grouped_main"><span class="primary_left">Font:</span><select class="combo_right combo_font select_field">' + fonts + '</select></label>' +
        ' <label class="label_grouped"><input class="input_right size_field combo_color_and_size" type="text" min="8" max="80" maxlength="2"></label>' +
        ' <label class="label_grouped"><input type="text" class="color_right color_picker"></label>' +
        '</div>'
      );

      // Core elements
      this.fields = {
        family: this.$element.find('select'),
        size: this.$element.find('input.size_field'),
        input: this.$element.find('input.description_text'),
        color: this.$element.find('input.color_picker')
      };

      // Set the title
      this.setTitle(this.$element.find('span:first'));

      // Initialize the color picker
      CoffeeBuilderEvents.get('colorpicker_initialize')(this, this.fields.color, 'color');

      // Add events
      if($text.length) {

        this.fields.input.val($.trim($text.text())).change($.proxy(this.textChange, this)).keyup($.proxy(this.textChange, this));
        this.fields.family.change($.proxy(this.fontFamilyChange, this));
        this.fields.size.change($.proxy(this.fontSizeChange, this)).keyup($.proxy(this.fontSizeKeyup, this));

      // Otherwise, disable controls
      } else {
        $.each(this.fields, function(field_name, field){
          field.attr('disabled', true);
        });
      }

      this.refresh();
    }

    /**
     * Refreshes the control to reflect the current DOM value.
     *
     * @return  void
     */
  , refresh: function() {
      var
        family = this.getCss('font-family') || 'Helvetica, Arial, sans-serif',
        size = this.getCss('font-size') || '13px',
        color = this.getCss('color') || '#000000';

      this.fields.family.val(family);
      CoffeeBuilderEvents.get('initialize_sizers')(this.fields.size.val(parseInt(size, 10)));
      CoffeeBuilderEvents.get('colorpicker_input_change')(color, this, this.fields.color, 'color', function(){});
    }

    /**
     * Event listener (proxy) for the font-size input field's `change()` event.
     *
     * @param  jQuery.Event event  The font-size input `change()` event.
     * @param  Boolean
     */
  , fontSizeChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, 'font-size');
    }

    /**
     * Event listener (proxy) for the font-size input field's `keyup()` event.
     *
     * @param  jQuery.Event event  The font-size input `keyup()` event.
     * @param  Boolean
     */
  , fontSizeKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'font-size');
    }

    /**
     * Event listener (proxy) for the font-family select field's `change()` event.
     *
     * @param  jQuery.Event event  The input `keyup()` event.
     * @param  Boolean
     */
  , fontFamilyChange: function(event) {
      return CoffeeBuilderEvents.get('select_change')(event, this, 'font-family');
    }

    /**
     * Event listener (proxy) for the text input field's `change()` event.
     *
     * @param  jQuery.Event event  The input `change()` event.
     * @param  Boolean
     */
  , textChange: function(event) {
      return CoffeeBuilderEvents.get('text_change')(event, this);
    }
});
