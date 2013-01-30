/**
 * A control is a form element or a group of form elements used for
 * controlling CSS properties.
 *
 * @param   CoffeeBuilder breakpoint   The parent breakpoint
 * @param   CoffeeBuilderPanel panel   The parent panel
 * @param   String name                A unique key to identify the control
 * @param   Object manifest            A JSON manifest that defines the control
 * @param   CoffeeBuilderControlGroup  An optional parent group of related controls
 * @return  void
 */
var CoffeeBuilderControl = function(breakpoint, panel, name, manifest, group) {
  this.breakpoint = breakpoint;
  this.builder = this.breakpoint.builder;
  this.panel = panel;
  this.name = name;
  this.manifest = manifest;
  this.group = group;

  // jQuery object for the entire control
  this.$element = $();

  // hash of jQuery objects for all form fields in the control
  this.fields = {};

  // properties managed by the control
  this.props = {
    css: [],
    data: {}
  };

  // The stylesheet to be managed by the control
  this.stylesheet = new CoffeeBuilderStylesheet(this.breakpoint);
  if($.isFunction(this.init)) {
    this.init();
  }
};
/**
 * Gets the first selector/property pair from a control's manifest. This
 * is useful in determining the type of control to use based on the type
 * of properties to be controlled.
 *
 * Return format:
 * --------------
 * {
 *   selector: '.myselector',
 *   property: 'myproperty'
 * }
 *
 * @param   Object manifest  A JSON manifest that defines the control
 * @return  Object
 */
CoffeeBuilderControl.getSelector = function(manifest){
  var getSelector = { selector: undefined, property: undefined };

  if(manifest.selectors) {
    $.each(manifest.selectors, function(selector, properties) {
      // Skip psuedo-selectors
      if(selector.indexOf(':') === -1) {
        getSelector = { selector: selector, property: properties[0] };
        return false;
      }
    });
  }

  return getSelector;
};
CoffeeBuilderControl.prototype = {
    constructor: CoffeeBuilderControl

    /**
     * Builds and adds the DOM elements for the control.
     *
     * @param   jQuery $element  Optional element to insert the control before
     * @return  CoffeeBuilderControl
     */
  , build: function($element) {
      if(this.$element.length) {
        if($element !== undefined) {
          this.$element.insertBefore($element.eq(0));
        } else {
          this.$element.appendTo(this.panel.$fieldset);
        }
      }

      return this;
    }

    /**
     * Gets the CSS value for the property managed by a control.
     *
     * @param   String property  An optional property to use instead of the default
     * @return  String
     */
  , getCss: function(property) {
      var
        self = this,
        old_style = null,
        old_css = null,
        css = null,
        selector = self.getSelector(),
        $element = self.getElement();

      // Can't get the CSS if there is no selector/property
      property = property || selector.property;
      if(!selector.selector || !property) {
        return null;
      }

      // If the element doesn't exist uet, attempt to mock it
      if($element.length === 0) {
        self.builder.mockElement(selector.selector);
        $element = self.getElement();
      }

      // Some browsers require a style before a valid width/color is reported
      var matches = property.match(/^(border.*)(?:-(?:color|width))$/);
      if(matches && $element.css(matches[1] + '-style') === 'none') {
        old_css = { property: matches[1] + '-style', value: 'none' };
        old_style = $element.attr('style') || '';
        $element.css(old_css.property, 'solid');
      }

      // Build a background that works well in all browsers
      else if(property === 'background') {
        return $.map(['color','image','repeat','position'], function(value){
          return self.getCss('background-' + value);
        }).join(' ');
      }

      // Get the CSS of the element, converting rgba to hex
      css = $element.css(property);
      if(typeof css === 'string' && css.match(/^rgba?\(.*?\)$/)) {
        css = self.getHexAlpha(css).hex;
      }

      // Revert styles if necessary
      if(old_css) {
        $element.css(old_css.property, old_css.value);
        $element.attr('style', old_style);
      }

      return css;
    }

    /**
     * Updates the CSS value for the properties managed by a control.
     *
     * @param   String property  An optional property to use instead of the default
     * @param   String value     The new CSS value
     * - OR -
     * @param   String value     The new CSS value
     *
     * @return  void
     */
  , updateCss: function(property, value) {

      var self = this;

      // Argumemt shifting for the optional `property` argument.
      if(arguments.length === 1) {
        value = property;
        property = value;
      }

      // Bail if the control doesn't map to any selectors
      if(self.manifest.selectors === undefined) {
        return;
      }

      $.each(self.manifest.selectors, function(selector, properties){
        if(property) {
          self.stylesheet.addRule(selector, property, value);
          CoffeeBuilderNotifications.postNotification('updateCss', selector, property, value);
          return true;
        }

        for(var i = 0; i < properties.length; i++) {
          self.stylesheet.addRule(selector, properties[i], value);
          CoffeeBuilderNotifications.postNotification('updateCss', selector, properties[i], value);
        }
      });

      var css = self.breakpoint.getStyleSheet().toString();
      if(self.breakpoint.$styles[0].styleSheet) { // IE
        self.breakpoint.$styles[0].styleSheet.cssText = css;
      } else {
        self.breakpoint.$styles.html(css);
      }
    }

    /**
     * Given a jQuery element, checks if this control has fields that are meant
     * to manage that element.
     *
     * @param   jQuery $element  The element to check for
     * @return  Boolean
     */
  , hasElement: function($find_element) {
      var
        self = this,
        found = false,
        find_element = $find_element.get(0),
        $element;

      if(self.manifest.selectors !== undefined) {
        $.each(self.manifest.selectors, function(selector, properties){
          if(selector.indexOf(':') !== -1 || !($element = self.builder.$contents.find(selector)).length) {
            return false;
          }

          $element.each(function(){
            if(this === find_element) {
              found = true;
              return false;
            }
          });
        });
      }

      return found;
    }

    /**
     * Gets the jQuery element associated with the DOM element managed by the
     * current control.
     *
     * @param   ignore_mocker  If mocked elements sould be ignored
     * @return  jQuery
     */
  , getElement: function(ignore_mocker) {
      var selector = this.getSelector();
      if(!selector.selector) {
        return $();
      }

      var $find = this.builder.$contents.find(selector.selector);
      if(ignore_mocker && $find.parent().is('#coffee_mocker')) {
        return $();
      }

      return $find;
    }

    /**
     * Updates the text for the DOM element managed by the current control.
     *
     * @param   String newvalue  The new text value.
     * @return  void
     */
  , updateTextElement: function(newvalue) {
      this.getElement().text(newvalue);
    }

    /**
     * Gets an object with hex/alpha properties from an rgb(a) string.
     *
     * Return format:
     * --------------
     * {
     *   hex: '#FFFFFF',
     *   alpha: '.65'
     * }
     *
     * @param   String style  The rgb(a) string
     * @return  Object
     */
  , getHexAlpha: function(style) {
      var hexa = { hex: undefined, alpha: undefined };

      var rgba = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:,\s*([\d\.]+))?/.exec(style);
      if(rgba) {
        hexa = {
          hex: '#' + (1 << 24 | rgba[1] << 16 | rgba[2] << 8 | rgba[3]).toString(16).substr(1),
          alpha: rgba[4]
        };
      }

      return hexa;
    }

    /**
     * Gets an rgb string from a hex string.
     *
     * @param   String hex  The hex string
     * @return  String
     */
  , getRgb: function(hex) {
      var bigint = parseInt(hex.substr(1), 16);
      return ((bigint >> 16) & 255) + ', ' + ((bigint >> 8) & 255) + ', ' + (bigint & 255);
    }

    /**
     * Gets the first selector/property pair for the current control. This is
     * useful for updating and getting the CSS associated with the control.
     *
     * Return format:
     * --------------
     * {
     *   selector: '.myselector',
     *   property: 'myproperty'
     * }
     *
     * @return  Object
     */
  , getSelector: function(){
      return CoffeeBuilderControl.getSelector(this.manifest);
    }

    /**
     * Sets the title for a control.
     *
     * @param   jQuery $element  The title element
     * @return  jQuery
     */
  , setTitle: function($element){
      return $element.toggleClass('section_head', !this.manifest.weak_label).append(window.document.createTextNode(' ' + this.manifest.name + ':'));
    }

    /**
     * Triggers the `change()` event for all form fields.
     *
     * @return  void
     */
  , change: function(){
      $.each(this.fields, function(field_name, field){
        field.change();
      });
    }

    /**
     * Returns a stylesheet representing all current customizations.
     *
     * @param   boolean full  If the full stylesheet (not just customizations) should be returned.
     * @return  string
     */
  , getStyleSheet: function(full) {
      if(!full){
        return this.stylesheet;
      }

      var
        self = this,
        stylesheet = new CoffeeBuilderStylesheet(this.breakpoint);

      // Bail if the control doesn't map to any selectors
      if(self.manifest.selectors === undefined) {
        return stylesheet;
      }

      // The control defines static properties
      if(self.props.css.length !== 0) {
        $.each(self.props.css, function(index, property){
          var value = self.getCss(property);
          $.each(self.manifest.selectors, function(selector){
            stylesheet.addRule(selector, property, value);
          });
        });

      // The properties come from the manifest
      } else {
        var value = self.getCss();
        $.each(self.manifest.selectors, function(selector, properties){
          for(var i = 0; i < properties.length; i++) {
            stylesheet.addRule(selector, properties[i], value);
          }
        });
      }

      return stylesheet;
    }

    /**
     * Adds a new data value and initializes it
     *
     * @param   string key   The new data key
     * @param   mixed value  The new data value
     * @return  Object
     */
  , addData: function(key, value) {
      var data = {};

      this.props.data[key] = undefined;
      data[key] = value;

      this.data(data);
    }

    /**
     * Gets/Sets data object.
     *
     * @param   Object data  The data object (optional, used for setting)
     * @return  Object
     */
  , data: function(data) {
      var
        self = this,
        writer = arguments.length > 0;
      data = data || {};

      if(writer) {
        $.each(data, function(index, value){
          if(self.props.data.hasOwnProperty(index) && self.props.data[index] !== value) {
            if($.isFunction(self.dataChanged)) {
              value = self.dataChanged(index, value);
            }

            self.props.data[index] = value;
            CoffeeBuilderNotifications.postNotification('data', index, value);
          }
        });
      }

      return self.props.data;
    }
};
