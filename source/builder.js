/**
 * The buider is the core component which holds all panels, sub panels,
 * groups, and controls.
 *
 * @param   jQuery $element  The iframe to be controlled
 * @param   object options   A list of options
 * @return  void
 *
 * Valid options:
 * --------------
 *  .design_mode:  (Boolean) If the iframe should be in design mode at startup.
 *  .manifest:     (Object)  JSON structure that defines the panels and controls.
 *  .width:        (Number)  A pixel width for the controls.
 */
var CoffeeBuilder = function($element, options) {
  // Builder options
  this.setOptions(options);

  // Breakpoints
  this.breakpoints = new CoffeeBuilderCollection();
  this.current = undefined;

  // iframe
  if($element.length !== 1) {
    $.error('CoffeeBuilder requires exactly one iframe');
  }
  this.$element = $element;
  this.$contents = this.$element.contents();
  this.$center = $('#layout-center');
  this.$blocker = $('<div id="builder_blocker">');

  this.$top = $('<div class="ui-layout-top" id="layout-top">');
  this.$breakpoints = $('<div class="slider" id="breakpoints"></div>');
  this.$slider = $('<div class="slider" id="slider"></div>');

  // Navigation
  this.$controls = $('<div class="ui-layout-east" id="controls">');

  this.build();
};
CoffeeBuilder.prototype = {
    constructor: CoffeeBuilder

    /**
     * Builds and adds the DOM elements for the UI that will control the CSS
     * for the contents of the `$element` iframe.
     *
     * @return  CoffeeBuilder
     */
  , build: function() {
      var self = this;

      this.$center.prepend(this.$top).after(this.$controls).after(this.$blocker);
      this.buildIframe();
      this.addBreakpoints();

      // Add the resize event
      $(window).resize($.proxy(this.windowResize, this)).resize();

      this.$breakpoints.appendTo(this.$top).coffeeBuilderSlider({
        values: [],
        canModify: true,
        min: 200,
        add: function(event, data) {
          self.addBreakpoint(data.value);
        },
        remove: function(event, data) {
          self.removeBreakpoint(data.index);
        },
        move: function(event, data) {
          self.moveBreakpoint(data.index, data.value);
        },
        activated: function(event, data) {
          self.$slider.coffeeBuilderSlider("values", 1, data.value);
          self.$element.css('width', data.value + 'px');
          self.activateBreakpoint(data.index);
        },
        deactivated: function(event) {
          self.activateBreakpoint('default');
        }
      });
      this.$slider.appendTo(this.$top).coffeeBuilderSlider({
        values: [ self.$element.width() ],
        min: 200,
        slide: function(event, data) {
          self.$element.css('width', data.value + 'px');

          var closest_breakpoint = self.getClosestBreakpoint(data.value);
          if(closest_breakpoint.index !== self.current) {
            self.activateBreakpoint(closest_breakpoint.index);
            self.$breakpoints.coffeeBuilderSlider('activate', closest_breakpoint.index);
          }
        }
      });

      return this;
    }

    /**
     * Builds and adds the DOM elements that live in the `$element` iframe.
     *
     * @param   object options  A list of options
     * @return  void
     *
     * Valid options:
     * --------------
     *  .design_mode:  (Boolean) If the iframe should be in design mode at startup
     *  .manifest:     (Object)  JSON structure that defines the panels and controls.
     *  .width:        (Number)  A pixel width for the controls
     */
  , setOptions: function(options) {
      this.options = options || {};
      this.manifest = this.options.manifest || {};
      this.width = this.options.width || 332;
      this.design_mode = this.options.design_mode || false;
    }

    /**
     * Gets the closest breakpoint to a specific pixel position.
     *
     * @param   Number position  A pixel position
     * @return  Object
     *
     * Return format:
     * --------------
     * {index:0, value:'default'}
     */
  , getClosestBreakpoint: function(position) {
      var
        self = this,
        closest_breakpoint = {index:0, value:'default'};

      $.each(self.breakpoints.keys, function(index, value){
        var int_value = parseInt(value, 10);

        if(int_value === position) {
          closest_breakpoint = {index:index, value:value};
          return false;
        }

        if(int_value > position && (closest_breakpoint.value === 'default' || int_value < parseInt(closest_breakpoint.value, 10))) {
          closest_breakpoint = {index:index, value:value};
        }
      });

      return closest_breakpoint;
    }

    /**
     * Adds all breakpoints defined in the manifest.
     *
     * NOTE: This should only be used when no breakpoints exist.
     *
     * @return  void
     */
  , addBreakpoints: function() {
      var self = this;

      // Make sure we have breakpoints
      if(!self.manifest.breakpoints) {
        if(!self.manifest.panels) {
          $.error('Invalid manifest: no panels provided');
        }

        self.manifest.breakpoints = {
          'default': {panels: self.manifest.panels}
        };
      }

      // Make sure we have a default breakpoint
      if(!self.manifest.breakpoints['default']) {
        $.each(self.manifest.breakpoints, function(name, manifest){
          self.manifest.breakpoints['default'] = manifest;
          return false;
        });
      }

      $.each(self.manifest.breakpoints, function(name, manifest){
        self.addBreakpoint(name, manifest);
      });
      self.activateBreakpoint('default');
    }

    /**
     * Public API method for removing a breakpoint.
     *
     * NOTE: The default breakpoint can not be removed this way.
     *
     * @param   String name  A unique key to identify the breakpoint ('default' or a natural number > 0)
     * @return  void
     */
  , removeBreakpoint: function(name) {
      var
        index = this.breakpoints.getIndex(name),
        panels = this.getCurrentPanels();

      if(name === 'default') {
        $.error('`CoffeeBuilder` can not remove default breakpoint');
      }

      this.breakpoints.remove(name).destroy();

      // Get a new breakpoint if the current breakpoint is being removed
      if(this.current === index.numeric) {
        var closest_breakpoint = this.getClosestBreakpoint(parseInt(index.named, 10));

        this.current = undefined;
        this.activateBreakpoint(closest_breakpoint.index);
        this.$breakpoints.coffeeBuilderSlider('activate', closest_breakpoint.index);

        if(panels.panel !== undefined) {
          var breakpoint = this.getCurrentBreakpoint();
          breakpoint.activatePanel(panels.panel);

          if(panels.subpanel !== undefined) {
            breakpoint.activateSubPanel(panels.subpanel);
          }
        }
      }
    }

  , getStyleSheet: function(full) {
      var styleSheet = '';

      $.each(this.breakpoints.items, function(breakpoint_name, breakpoint){
        styleSheet += "\n" + breakpoint.getStyleSheet(full).toString();
      });

      return styleSheet;
    }
    /**
     * Adds a new breakpoint.
     *
     * @param   String name      A unique key to identify the breakpoint ('default' or a natural number > 0)
     * @param   Object manifest  A JSON manifest that defines the breakpoint
     * @return  void
     */
  , addBreakpoint: function(name, manifest) {
      if(manifest === undefined || !manifest.panels) {
        manifest = this.manifest.breakpoints['default'];
      }

      this.breakpoints.add(name, (new CoffeeBuilderBreakpoint(this, name, manifest)));
    }

    /**
     * Gets the currently active breakpoint.
     *
     * @return  CoffeeBuilderBreakpoint
     */
  , getCurrentBreakpoint: function() {
      return this.breakpoints.get(this.current);
    }

    /**
     * Gets the currently active panel/subpanel.
     *
     * @return  Object
     *
     * Return format:
     * --------------
     * {panel:0, subpanel:2}
     */
  , getCurrentPanels: function() {
      var current = {panel: undefined, subpanel: undefined};

      if(this.current !== undefined) {
        var breakpoint = this.getCurrentBreakpoint();
        current.panel = breakpoint.current;
        current.subpanel = breakpoint.panels.get(current.panel).current;
      }

      return current;
    }

    /**
     * Activates a breakpoint.
     *
     * @param   String|Number name  A unique key that identifies the breakpoint to activate.
     * @return  void
     */
  , activateBreakpoint: function(name) {
      var
        new_breakpoint = this.breakpoints.get(name),
        panels = this.getCurrentPanels();

      if(this.current !== undefined) {
        this.getCurrentBreakpoint().deactivate();
      }

      this.current = this.breakpoints.getIndex(name).numeric;
      new_breakpoint.activate();

      if(panels.panel !== undefined) {
        new_breakpoint.activatePanel(panels.panel);

        if(panels.subpanel !== undefined) {
          new_breakpoint.activateSubPanel(panels.subpanel);
        }
      }
    }

    /**
     * Moves a breakpoint to a new pixel location.
     *
     * NOTE: You can not move the default breakpoint.
     *
     * @param   string oldname  The old name (pixel position).
     * @param   string newname  The new name (pixel position).
     * @return  void
     */
  , moveBreakpoint: function(oldname, newname) {
      this.breakpoints.rename(oldname, newname).move(newname);
    }

    /**
     * Builds and adds the DOM elements that live in the `$element` iframe.
     *
     * @return  void
     */
  , buildIframe: function() {
      this.$blocker.css('width', this.width);
      this.toggleDesignMode(this.design_mode);

      // For mocking elements
      this.put = put.forDocument(this.$contents.get(0));
      this.$mock_area = $('<div id="coffee_mocker">').css({height: 0, overflow: 'hidden', position: 'absolute'}).appendTo(this.$contents.find('body'));
    }

    /**
     * Event listener (proxy) for window resizing.
     *
     * @param   jQuery.Event  the resize event
     * @return  void
     */
  , windowResize: function(event) {
      return CoffeeBuilderEvents.get('window_resize')(event, this);
    }

    /**
     * Used when the iframe is reloaded to update the DOM references.
     *
     * If the manifest parameter is provided, all panels and controls are
     * reset. Otherwise, the CSS for all elements is updated to match the
     * current controls.
     *
     * @param   Object manifest  JSON structure that defines the panels and controls.
     * @return  void
     *
     * Valid options:
     * --------------
     *  .design_mode:  (Boolean) If the iframe should be in design mode at startup
     *  .manifest:     (Object)  JSON structure that defines the panels and controls.
     *  .width:        (Number)  A pixel width for the controls
     */
  , refresh: function(options) {
      var self = this;

      self.$contents = self.$element.contents();
      if(options === undefined) {
        self.change();
        return;
      }

      $.each(self.breakpoints.items, function(breakpoint_name, breakpoint) {
        self.breakpoints.remove(breakpoint_name).destroy();
      });
      self.setOptions(options);
      self.buildIframe();
      self.addBreakpoints();
    }

    /**
     * Disables all panels so that no controls can be used. This is useful
     * while the iframe is loading content.
     *
     * @return  void
     */
  , disable: function() {
      this.$blocker.show();
    }

    /**
     * Enables all panels so that all controls can be used. This is useful
     * after the iframe is done loading content.
     *
     * @return  void
     */
  , enable: function() {
      this.$blocker.hide();
    }

    /**
     * Enables/disables design mode.
     *
     * Design mode is a mode where clicking on DOM elements in the iframe
     * activates the corresponding panel.
     *
     * @param   Boolean check  If design mode should be enabled/disabled
     * @return  void
     */
  , toggleDesignMode: function(check) {
      var self = this;
      self.design_mode = check === undefined ? !self.design_mode : Boolean(check);

      if(self.design_mode) {
        self.$contents.find('*').bind('click.coffeeBuilder', function(event){
          event.preventDefault();
          self.breakpoints.get(self.current).activatePanelByElement($(this));
          return false;
        });
      } else {
        self.$contents.find('*').unbind('click.coffeeBuilder');
      }
    }

    /**
     * Given a selector, this will generate a hidden "mock element"
     * in the iframe which satisfies the selector.
     *
     * @param   string selector The selector of the element to mock
     * @return  void
     */
  , mockElement: function(selector){
      if(typeof selector !== "string" || selector.length === 0) {
        return;
      }

      if($.inArray(selector.charAt(0), ['.','#','[', '!']) !== -1) {
        selector = 'div' + selector;
      }

      this.put(this.$mock_area.get(0), selector);
    }

    /**
     * Adds a stylesheet to the iframe `$element`.
     *
     * @param   jQuery $stylesheet  The stylesheet to add
     * @return  void
     */
  , addStylesheet: function($stylesheet){
      var
        self = this,
        styles = self.$contents.find('style'),
        matches = $stylesheet.attr('media').match(/^screen and \(max-width: (\d+)px\)$/),
        $last;

      if(!matches) {
        $last = styles.not('[media$=")"]').last();
        if($last.length === 0) {
          $stylesheet.appendTo(self.$contents.find('head'));
        } else {
          $stylesheet.insertAfter($last);
        }
        return;
      }

      var
        width = parseInt(matches[1], 10),
        $mediaStyles = styles.filter('[media$=")"]');

      $last = styles.last();
      $mediaStyles.each(function(index){
        $last = $(this);
        matches = $last.attr('media').match(/^screen and \(max-width: (\d+)px\)$/);

        if(parseInt(matches[1], 10) < width) {
          $last = $last.prev();
          return false;
        }
      });
      $stylesheet.insertAfter($last);
    }
};
