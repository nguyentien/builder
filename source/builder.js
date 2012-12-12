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
 *  .data:         (Object)  JSON structure to hold some generic application-specific data.
 */
var CoffeeBuilder = function($element, options) {
  // Builder options
  this.setOptions(options);

  // Panels
  this.panels = new CoffeeBuilderCollection();
  this.current = undefined;

  // iframe
  if($element.length !== 1) {
    $.error('CoffeeBuilder requires exactly one iframe');
  }
  this.$element = $element;
  this.$contents = this.$element.contents();
  this.$center = $('#layout-center');
  this.$blocker = $('<div id="builder_blocker">');

  // Navigation
  this.$controls = $('<div class="ui-layout-east" id="controls">');
  this.$controlset = $('<form id="controlset" class="tabsform" method="get" action=""></form>');
  this.$switcher = $('<ul id="control_switcher">');
  this.$prev = $('<div id="control_prev">').click($.proxy(this, 'prev'));
  this.$next = $('<div id="control_next">').click($.proxy(this, 'next'));

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
      
      // Add core UI elements
      $.each(['$next','$prev','$switcher','$controlset'], function(index, name){
        self.$controls.append(self[name]);
      });

      // Add the controls      
      $.each(['$controls','$blocker'], function(index, name){
        self.$center.after(self[name]);
      });

      // Add panels
      self.buildIframe();
      self.addPanels();
      self.data(this.options.data);
      
      // Add the resize event        
      $(window).resize($.proxy(self.windowResize, self)).resize();
      
      return self;
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
     *  .data:         (Object)  JSON structure to hold some generic application-specific data.     
     */    
  , setOptions: function(options) {
      this.options = options || {};
      this.manifest = this.options.manifest || {};
      this.width = this.options.width || 332;
      this.design_mode = this.options.design_mode || false;
      this.options.data = this.options.data || {};
    }
    
    /**
     * Builds and adds the DOM elements that live in the `$element` iframe.
     *
     * @return  void
     */    
  , buildIframe: function() {
      this.$blocker.css('width', this.width);
      this.$styles = $('<style id="coffeebuilder_styles">').appendTo(this.$contents.find('head'));      
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
     * Triggers the `change()` event for all form fields on all panels. 
     *
     * @return  void
     */
  , change: function() {
      $.each(this.panels.items, function(panel_name, panel){
        panel.change();
      });
    }
    
    /**
     * Returns a stylesheet representing all current customizations.
     *
     * @param   boolean full  If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */
  , getStyleSheet: function(full) {
      var stylesheet = new CoffeeBuilderStylesheet();
      
      $.each(this.panels.items, function(panel_name, panel){
        stylesheet.merge(panel.getStyleSheet(full));
      });
      
      return stylesheet;
    }
    
    /**
     * Returns a stylesheet representing all current customizations for a given
     * panel.
     *
     * @param   string panel  The name of the panel to get the customizations for
     * @param   boolean full  If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */
  , getStyleSheetForPanel: function(panel, full) {
      return this.panels.get(panel).getStyleSheet(full);    
    }
    
    /**
     * Returns a stylesheet representing all current customizations for a given
     * panel's control.
     *
     * @param   string panel    The name of the panel where the control can be found
     * @param   string control  The name of the control to get the customizations for
     * @param   boolean full    If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */    
  , getStyleSheetForPanelControl: function(panel, control, full) {
      return this.panels.get(panel).getStyleSheetForControl(control, full);
    }
    
    /**
     * Returns a stylesheet representing all current customizations for a given
     * panel's sub panel.
     *
     * @param   string panel      The name of the panel where the sub panel can be found
     * @param   string sub_panel  The name of the sub_panel to get the customizations for
     * @param   boolean full      If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */    
  , getStyleSheetForSubPanel: function(panel, sub_panel, full) {
      return this.panels.get(panel).getStyleSheetForPanel(sub_panel, full);
    }
    
    /**
     * Returns a stylesheet representing all current customizations for a given
     * sub panel's control.
     *
     * @param   string panel      The name of the panel where the sub panel can be found
     * @param   string sub_panel  The name of the sub panel where the control can be found
     * @param   string control    The name of the control to get the customizations for
     * @param   boolean full      If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */    
  , getStyleSheetForSubPanelControl: function(panel, sub_panel, control, full) {
      return this.panels.get(panel).getStyleSheetForPanelControl(sub_panel, control, full);
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
     *  .data:         (Object)  JSON structure to hold some generic application-specific data.
     */      
  , refresh: function(options) {
      var self = this;
      
      self.$contents = self.$element.contents();
      if(options === undefined) {
        self.change();
        return;
      }
      
      $.each(self.panels.items, function(panel_name, panel) {
        self.removePanel(panel_name);
      });
      self.setOptions(options);
      self.buildIframe();
      self.addPanels();
      self.data(this.options.data);
    }
    
    /**
     * Given an element from the iframe, activate the first panel that holds
     * controls that correspond to the element.
     *
     * @param   jQuery $element  The element from the iframe
     * @return  void
     */      
  , activatePanelByElement: function($element) {
      var found = this.findPanelWithElementControl($element);

      if(found.panel !== undefined) {
        this.activatePanel(found.panel);
        
        if(found.subpanel !== undefined) {
          this.panels.get(found.panel).activatePanel(found.subpanel);
        }
      }
    }
  
    /**
     * Given an element from the iframe, find the first panel that holds
     * controls that correspond to the element.
     *
     * Return format:
     * --------------
     * {
     *   panel: 'page', 
     *   subpanel: 'title'
     * }
     *
     * @param   jQuery $element  The element from the iframe
     * @return  void
     */    
  , findPanelWithElementControl: function($element) {
      var found = { panel: undefined, subpanel: undefined };
  
      $.each(this.panels.items, function(panel_name, panel) {
        if((found = panel.findElementControl($element)).panel !== undefined) {
          return false;
        }
      });
  
      return found;
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
     * Adds a new panel to the UI.
     *
     * @param   String name      A unique key to identify the panel
     * @param   Object manifest  A JSON manifest that defines the panel
     * @return  void
     */
  , addPanel: function(name, manifest) {
      this.panels.add(name, (new CoffeeBuilderPanel(name, manifest)).build(this));
      
      // Enable $next link if necessary
      if(this.current === this.panels.length - 2) {
        this.$next.addClass('active');
      }
    }
    
    /**
     * Adds a new sub panel to a panel.
     *
     * @param   String panel      A unique key to identify the parent panel
     * @param   String sub_panel  A unique key to identify the sub panel
     * @param   Object manifest   A JSON manifest that defines the sub panel
     * @return  void
     */    
  , addSubPanel: function(panel, sub_panel, manifest) {
      this.panels.get(panel).addSubPanel(this, sub_panel, manifest);
    }
    
    /**
     * Adds a new control to a panel.
     *
     * @param   String panel     A unique key that identifies the panel
     * @param   String name      A unique key to identify the control
     * @param   Object manifest  A JSON manifest that defines the control
     * @return  void
     */    
  , addControlToPanel: function(panel, name, manifest) {
      this.panels.get(panel).addControl(this, name, manifest);
    }
    
    /**
     * Adds a new control to a sub panel.
     *
     * @param   String panel      A unique key that identifies the panel
     * @param   String sub_panel  A unique key that identifies the sub_panel
     * @param   String name       A unique key to identify the control
     * @param   Object manifest   A JSON manifest that defines the control
     * @return  void
     */    
  , addControlToSubPanel: function(panel, sub_panel, name, manifest) {
      this.panels.get(panel).addControlToPanel(this, sub_panel, name, manifest);
    }
    
    /**
     * Gets/Sets data object for all panels/controls.
     *
     * @param   Object data  The data object (optional, used for setting)
     * @return  Object
     */
  , data: function(data) {
      var writer = arguments.length > 0;
      data = data || {};
  
      $.each(this.panels.items, function(panel_name, panel){
        if(writer) {
          panel.data(data);
        } else {
          $.extend(data, panel.data());
        }
      });
  
      return data;
    }
  
    /**
     * Gets/Sets data object for a given panel.
     *
     * @param   string panel  The name of the panel to get the data object for
     * @param   Object data   The data object (optional, used for setting)
     * @return  string
     */
  , dataForPanel: function(panel, data) {
      return this.panels.get(panel).data(data);    
    }
  
    /**
     * Gets/Sets data object for a given panel's control.
     *
     * @param   string panel    The name of the panel where the control can be found
     * @param   string control  The name of the control to get the customizations for
     * @param   Object data     The data object (optional, used for setting)
     * @return  string
     */    
  , dataForPanelControl: function(panel, control, data) {
      return this.panels.get(panel).dataForControl(control, data);
    }
  
    /**
     * Gets/Sets data object for a given panel's sub panel.
     *
     * @param   string panel      The name of the panel where the sub panel can be found
     * @param   string sub_panel  The name of the sub_panel to get the customizations for
     * @param   Object data       The data object (optional, used for setting)
     * @return  string
     */    
  , dataForSubPanel: function(panel, sub_panel, data) {
      return this.panels.get(panel).dataForPanel(sub_panel, data);
    }
  
    /**
     * Gets/Sets data object for a given sub panel's control.
     *
     * @param   string panel      The name of the panel where the sub panel can be found
     * @param   string sub_panel  The name of the sub panel where the control can be found
     * @param   string control    The name of the control to get the customizations for
     * @param   Object data       The data object (optional, used for setting) 
     * @return  string
     */    
  , dataForSubPanelControl: function(panel, sub_panel, control, data) {
      return this.panels.get(panel).dataForPanelControl(sub_panel, control, data);
    }
    
    /**
     * Adds all panels defined in the manifest to the UI.
     *
     * NOTE: This should only be used when no panels exist.
     *
     * @return  void
     */      
  , addPanels: function() {
      var self = this;
      
      if(!self.manifest.panels) {
        $.error('Invalid manifest: no panels provided');
      }
      
      if(self.panels.length) {
        $.error('`CoffeeBuilder.addPanels` should only be used when no panels exist');
      }
      
      $.each(self.manifest.panels, function(name, manifest){
        self.addPanel(name, manifest);
      });
      self.activatePanel(0);      
    }
    
    /**
     * Removes a panel given the panels name/index.
     *
     * @param   String name  A unique key that identifies the panel to activate
     * @return  void
     */      
  , removePanel: function(name) {
      var index = this.panels.getIndex(name);

      // Activate another panel if the current panel is being removed
      if(this.current === index.numeric) {
        if(this.canPrev()) {
          this.prev();
        } else if(this.canNext()) {
          this.next();
        } else {
          this.current = undefined;
        }
      }
      
      // Delete the panels
      this.panels.remove(name).destroy(this);
      
      // Change `this.current` if necessary
      if(this.current !== undefined) {
        this.setActive(this.current > index.numeric ? this.current-1 : this.current);
      }
    }
    
    /**
     * Removes a sub panel given the panel and sub panel name/indexes.
     *
     * @param   String panel      A unique key that identifies the panel
     * @param   String sub_panel  A unique key that identifies the sub_panel
     * @return  void
     */    
  , removeSubPanel: function(panel, sub_panel) {
      this.panels.get(panel).removePanel(this, sub_panel);
    }
    
    /**
     * Removes a control given the panel and control name/indexes.
     *
     * @param   String panel    A unique key that identifies the panel
     * @param   String control  A unique key that identifies the control
     * @return  void
     */    
  , removeControlFromPanel: function(panel, control) {
      this.panels.get(panel).removeControl(control);
    }
    
    /**
     * Removes a control given the panel, sub panel and control name/indexes.
     *
     * @param   String panel      A unique key that identifies the panel
     * @param   String sub_panel  A unique key that identifies the sub_panel     
     * @param   String control    A unique key that identifies the control
     * @return  void
     */    
  , removeControlFromSubPanel: function(panel, sub_panel, control) {
      this.panels.get(panel).removeControlFromPanel(sub_panel, control);
    }
  
    /**
     * Activates a UI panel.
     *
     * @param   String|Number name  A unique key that identifies the panel to activate.
     * - OR -
     * @param   jQuery name         a jQuery element that is controlled by the panel to activate
     *
     * @return  void
     */
  , activatePanel: function(name) {
      // If name is a jQuery element, use `activatePanelByElement`.
      if(name instanceof $) {
        return this.activatePanelByElement(name);
      }
    
      // If we have a current panel, deactivate it
      if(this.current !== undefined) {
        this.panels.get(this.current).deactivate();
      }

      this.setActive(name);
    }
    
    /**
     * Activates a UI sub panel on the current panel.
     *
     * @param   String|Number name  A unique key that identifies the sub panel to activate.
     * @return  void
     */    
  , activateSubPanel: function(name) {
      this.panels.get(this.current).activatePanel(name);
    }

    /**
     * Sets the active UI panel.
     *
     * NOTE: this differs from `activatePanel` in that it does not deactivate
     * the current panel.
     *
     * @param   String name  A unique key that identifies the panel.
     * @return  void
     */
  , setActive: function(name) {
      this.current = this.panels.getIndex(name).numeric;

      this.$next.toggleClass('active', this.canNext());
      this.$prev.toggleClass('active', this.canPrev());

      this.panels.get(name).activate();
    }
  
    /**
     * Activates the previous panel.
     *
     * @return  void
     */    
  , prev: function() {
      if(this.canPrev()) {
        this.activatePanel(this.current - 1);
      }
    }
    
    /**
     * Activates the next panel.
     *
     * @return  void
     */
  , next: function() {
      if(this.canNext()) {
        this.activatePanel(this.current + 1);
      }
    }
  
    /**
     * Checks if it's possible to go to a previous frame.
     *
     * @return  Boolean
     */    
  , canPrev: function() {
      return this.current > 0;
    }
  
    /**
     * Checks if it's possible to go to the next frame.
     *
     * @return  Boolean
     */
  , canNext: function() {
      return this.current < this.panels.length - 1;
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
          self.activatePanelByElement($(this));
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
};
