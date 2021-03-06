/**
 * CoffeeBuilder - v0.1.3 - 2012-12-12
 * Copyright (c) 2006-2012  CoffeeCup Software, Inc. (http://www.coffeecup.com/)
 */

!function($, window, undefined){

'use strict';

/**
 * A collection is a generic object that has properties which can be referenced
 * by a named key or numeric index.
 *
 * @return  void
 */
var CoffeeBuilderCollection = function() {
  this.length = 0;
  this.keys = [];
  this.items = {};
};
CoffeeBuilderCollection.prototype = {
    constructor: CoffeeBuilderCollection
    
    /**
     * Adds a new item to the collection.
     *
     * @param   String key       A unique key to identify the item
     * @param   Object item      The object to store in the collection
     * @param   Number position  Optional position for element in collection
     * @return  Object
     */
  , add: function(key, item, position) {
      if($.inArray(key, this.keys) !== -1) {
        $.error('Index already defined: ' + key);
      }
      
      if(position === undefined) {
        position = this.length;
      }
      
      if(position > this.length) {
        $.error('Position is larger than collection length: ' + position);
      }
    
      if(position === this.length) {
        this.keys.push(key);
      } else {
        this.keys.splice(position, 0, key);        
      }     

      this.items[key] = item;
      this.length++;

      return this.items[key];
    }
    
    /**
     * Removes an item from the collection.
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */
  , remove: function(key) {
      var
        index = this.getIndex(key),
        deleted = this.items[index.named];

      this.keys.splice(index.numeric,1);
      delete this.items[index.named];
      this.length--;
      
      return deleted;
    }
    
    /**
     * Gets an item from the collection.
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */    
  , get: function(key) {
      return this.items[this.getIndex(key).named];
    }
    
    /**
     * Given a string key or numeric index, returns an object that holds both
     * the named and numeric equivalent indexes for the collection.
     *
     * Return format:
     * --------------
     * {
     *   numeric: 5, 
     *   named: 'myindex'
     * }
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */
  , getIndex: function(key) {
      return typeof key === 'number' ? { numeric: key, named: this.getKeyForIndex(key) } : { numeric: this.getIndexForKey(key), named: key  };
    }
    
    /**
     * Gets the string equivalent of a provided numeric index.
     *
     * @param   Number index  A numeric index to get the string key for.
     * @return  String
     */    
  , getKeyForIndex: function(index) {
      if(typeof index === 'number' && index === ~~index && index < this.length) {
        return this.keys[index];
      }
      
      $.error('Invalid index provided: ' + index);    
    }
    
    /**
     * Gets the numeric equivalent of a provided string key.
     *
     * @param   String key  A string key to get the numeric index for.
     * @return  String
     */    
  , getIndexForKey: function(key) {
      var index = $.inArray(key, this.keys);
      if(index !== -1) {
        return index;
      }

      $.error('Invalid index provided: ' + key);
    }
};
/**
 * Global notifications manager.
 *
 * Use `CoffeeBuilderControls.addObserver()` for adding observers to the
 * notifications system and use `CoffeeBuilderControls.postNotification()`
 * for notifying observers of an event.
 *
 * <code>
 *
 * var observer = function(x, y, width, height){
 *   console.log('New rectangle drawn!');
 *   console.log('x: ' + x);
 *   console.log('y: ' + y);
 *   console.log('width: ' + width);
 *   console.log('height: ' + height);
 * }
 *
 * CoffeeBuilderNotifications.addObserver('drawRect', observer);
 * 
 * function drawRect(x, y, width, height, color) {
 *   var canvas = document.getElementById("canvas");
 *   var ctx = canvas.getContext("2d");
 * 
 *   if(color){
 *     ctx.fillStyle = color;
 *   }
 * 
 *   ctx.fillRect (x, y, width, height);
 *   CoffeeBuilderNotifications.postNotification('drawRect', x, y, width, height);
 * }
 * 
 * drawRect(10, 10, 200, 200);
 * drawRect(25, 25, 170, 170, "rgb(200,0,0)");
 *
 * CoffeeBuilderNotifications.removeObserver(observer);
 *
 * drawRect(50, 50, 120, 120, "rgb(0,0,200)");
 *
 * </code>
 */
var CoffeeBuilderNotifications = {
    observerCollection: {}

    /**
     * Adds a new obvserver for a given notification type.
     *
     * @param   String name        The name of the notification type to observe.
     * @param   Function observer  The function to call when the notification is posted.
     * @return  void
     */
  , addObserver: function(name, observer){
      if(!$.isFunction(observer)) {
        $.error('observer must be a function');
      }
      
      if(!$.isArray(this.observerCollection[name])) {
        this.observerCollection[name] = [];
      }
      
      this.observerCollection[name].push(observer);
    }

    /**
     * Removes an obvserver from all notifications or a given notification type
     * if the name parameter is provided.
     *
     * @param   String name        The name of the notification type to remove from.
     * @param   Function observer  The function to remove.
     * - OR -
     * @param   Function observer  The function to remove from all notifications.
     * 
     * @return  void
     */
  , removeObserver: function(name, observer){
      if(arguments.length === 1) {
        var self = this;

        observer = name;
        $.each(this.observerCollection, function(name){
          self.removeObserver(name, observer);
        });

        return;
      }
    
      if(!$.isArray(this.observerCollection[name])) {
        $.error('invalid observer: ' + name);
      }

      this.observerCollection[name] = $.grep(this.observerCollection[name], function(value){
        return value !== observer;
      });
    }

    /**
     * Post a notification to all registered observers.
     *
     * @param   String name  The name of the notification type to post.
     * @return  void
     */
  , postNotification: function(name){
      if(!$.isArray(this.observerCollection[name])) {
        return;
      }
    
      var notification_arguments = Array.prototype.slice.call(arguments, 1);

      $.each(this.observerCollection[name], function(index, observer){
        observer.apply(null, notification_arguments);
      });
    }
};

/**
 * A basic stylesheet representation.
 *
 * @return  void
 */
var CoffeeBuilderStylesheet = function(rules) {
  this.rules = {};
};
CoffeeBuilderStylesheet.prototype = {
    constructor: CoffeeBuilderStylesheet

    /**
     * Add a new rule to the stylesheet.
     *
     * @param   string selector  The CSS selector
     * @param   string property  The CSS property
     * @param   string selector  The CSS value
     * @return  void
     */
  , addRule: function(selector, property, value) {
      if(!this.rules.hasOwnProperty(selector)) {
        this.rules[selector] = {};
      }
      
      this.rules[selector][property] = value;
    }

    /**
     * Merges the rules from another stylesheet object with the current one.
     *
     * @param   CoffeeBuilderStylesheet stylesheet  The other stylesheet object
     * @return  void
     */
  , merge: function(stylesheet) {
      $.extend(true, this.rules, stylesheet.getRules());
    }

    /**
     * Removes a rule from the stylesheet.
     *
     * @param   string selector  The CSS selector
     * @param   string property  The CSS property
     * @return  void
     */
  , removeRule: function(selector, property) {
      if(this.rules.hasOwnProperty(selector)) {
        delete this.rules[selector][property];
      }
    }
  
    /**
     * Removes all rules for a given selector.
     *
     * @param   string selector  The CSS selector
     * @return  void
     */
  , removeRulesForSelector: function(selector) {
      delete this.rules[selector];
    }
    
    /**
     * Clear all rules.
     *
     * @return  void
     */
  , clearRules: function() {
      this.rules = {};
    }    

    /**
     * Gets a plain object representation of all rules in the current 
     * stylesheet.
     *
     * @return  Object
     */
  , getRules: function() {
      return this.rules;
    }
  
    /**
     * Gets a string representation of all rules in the current stylesheet.
     *
     * @return  string
     */  
  , toString: function() {
      var styles = '';
      
      $.each(this.rules, function(selector, properties){
        styles += selector + '{' + "\n";
        $.each(properties, function(property, value){
          styles += '\t' + property + ':' + value + ';' + "\n";
        });
        styles += '}' + "\n";
      });
      
      return $.trim(styles);
    }
};

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

/**
 * A panel holds sub panels, groups, and controls.
 *
 * @param   String name      A unique key for the panel
 * @param   Object manifest  A JSON manifest that defines the panel
 * @return  void
 */  
var CoffeeBuilderPanel = function(name, manifest) {
  this.manifest = manifest;
  this.name = name;
  
  // Panels
  this.panels = new CoffeeBuilderCollection();
  this.current = undefined;
  
  // Controls
  this.controls = new CoffeeBuilderCollection();
  
  // Important DOM elements
  this.$title = $('<li id="' + this.name + '">').text(this.manifest.name);
  this.$controls = $('<div id="' + this.name + '_controls" class="controlpane">');
  this.$fieldset = $('<fieldset class="panelset">');
  this.$subswitcher = $('<ul class="control_toolbar" id="' + this.name + '_subpanel">');

  if(!this.manifest.name) {
    $.error('Invalid manifest: no name provided');
  }
};
CoffeeBuilderPanel.prototype = {
    constructor: CoffeeBuilderPanel
    
    /**
     * Builds and adds the DOM elements for a panel that will hold sub 
     * panels, groups, and controls.
     *
     * @param   CoffeeBuilder builder  The parent builder
     * @return  CoffeeBuilderPanel
     */      
  , build: function(builder) {
      var self = this;
      
      // Add the title
      builder.$switcher.append(self.$title);
      
      // Add sub panels
      if(self.manifest.subpanels) {
        builder.$switcher.after(self.$subswitcher);

        $.each(self.manifest.subpanels, function(name, manifest){
          self.addSubPanel(builder, name, manifest);
        });
      
        return self;
      }
      
      // Add controlsets
      builder.$controlset.append(self.$controls);
      self.$controls.append(self.$fieldset);        

      // Add controls
      if(self.manifest.customizations) {
        $.each(self.manifest.customizations, function(name, manifest){
          self.addControl(builder, name, manifest);
        });
      }
      
      return self;
    }
    
    /**
     * Removes this panel from the DOM.
     *
     * @param   CoffeeBuilder builder  The parent builder
     * @return  void
     */      
  , destroy: function(builder) {
      this.$title.remove();
      this.$controls.remove();
      this.$subswitcher.remove();

      $.each(this.panels.items, function(panel_name, panel){
        panel.destroy(builder);
      });          
    }
    
    /**
     * Adds a new control to the panel.
     *
     * @param   CoffeeBuilder builder  The parent builder
     * @param   String name            A unique key to identify the control
     * @param   Object manifest        A JSON manifest that defines the control
     * @return  void
     */
  , addControl: function(builder, name, manifest) {
      if(typeof manifest === "object" && typeof manifest.position === "number" && manifest.position < this.controls.length) {
        this.controls.add(name, CoffeeBuilderControls.get(builder, this, name, manifest).build(this.controls.get(manifest.position).$element), manifest.position);        
      } else {
        this.controls.add(name, CoffeeBuilderControls.get(builder, this, name, manifest).build());
      }
    }
    
    /**
     * Adds a new control to a sub panel.
     *
     * @param   CoffeeBuilder builder  The parent builder
     * @param   String sub_panel       A unique key that identifies the sub panel
     * @param   String name            A unique key to identify the control
     * @param   Object manifest        A JSON manifest that defines the control
     * @return  void
     */    
  , addControlToPanel: function(builder, sub_panel, name, manifest) {
      return this.panels.get(sub_panel).addControl(builder, name, manifest);    
    }

    /**
     * Removes a control given the control's name/index.
     *
     * @param   String name  A unique key that identifies the control to remove
     * @return  void
     */
  , removeControl: function(control) {
      this.controls.get(control).$element.remove();
    }

    /**
     * Adds a new sub panel to the panel.
     *
     * @param   CoffeeBuilder builder  The parent builder
     * @param   String name            A unique key to identify the sub panel
     * @param   Object manifest        A JSON manifest that defines the sub panel
     * @return  void
     */    
  , addSubPanel: function(builder, name, manifest) {
      this.panels.add(name, (new CoffeeBuilderSubPanel(name, manifest)).build(builder, this));
      CoffeeBuilderEvents.get('subpanels_change')(builder, this);
    }
    
    /**
     * Triggers the `change()` event for all form fields on all controls and
     * sub panels.
     *
     * @return  void
     */      
  , change: function() {      
      $.each(this.controls.items, function(control_name, control){
        control.change();
      });
      
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
  
      $.each(this.controls.items, function(control_name, control){
        stylesheet.merge(control.getStyleSheet(full));
      });
      
      $.each(this.panels.items, function(panel_name, panel){
        stylesheet.merge(panel.getStyleSheet(full));
      });
  
      return stylesheet;
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
  
      $.each(this.controls.items, function(control_name, control){
        if(writer) {
          control.data(data);
        } else {
          $.extend(data, control.data());
        }
      });
      
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
     * Returns a stylesheet representing all current customizations for a given
     * control.
     *
     * @param   string control  The name of the control to get the customizations for
     * @param   boolean full    If the full stylesheet (not just customizations) should be returned.     
     * @return  string
     */    
  , getStyleSheetForControl: function(control, full) {
      return this.controls.get(control).getStyleSheet(full);
    }
    
    /**
     * Gets/Sets data object for a given control.
     *
     * @param   string control  The name of the control to get the customizations for
     * @param   Object data     The data object (optional, used for setting)
     * @return  string
     */    
  , dataForControl: function(control, data) {
      return this.controls.get(control).data(data);
    }    
  
    /**
     * Activates this panel.
     *
     * @return  void
     */    
  , activate: function() {
      this.$title.addClass('active');
      
      if(this.controls.length) {
        this.$controls.addClass('active');
      } else if(this.panels.length) {
        this.$subswitcher.addClass('active');
        
        if(typeof this.current !== 'number') {
          this.activatePanel(0);
        }
      }
    }
  
    /**
     * Deactivates this panel.
     *
     * @return  void
     */    
  , deactivate: function() {        
      this.$title.removeClass('active');

      if(this.controls.length) {
        this.$controls.removeClass('active');
      } else if(this.panels.length) {
        this.$subswitcher.removeClass('active');

        // If we have a current panel, deactivate it          
        if(this.current !== undefined) {
          this.panels.get(this.current).deactivate();
          this.current = undefined;            
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
  , findElementControl: function($element) {
      var 
        self = this,
        found = { panel: undefined, subpanel: undefined };
  
      if(self.controls.length) {
        $.each(self.controls.items, function(control_name, control){
          if(control.hasElement($element)) {
            found.panel = self.name;
            return false;
          }
        });
      } else if (self.panels.length) {
        if((found = self.findPanelWithElementControl($element)).panel !== undefined) {
          found = { panel:self.name, subpanel: found.panel };
        }
      }
      
      return found;
    }
  
    /**
     * Removes a panel given the panel's name/index.
     *
     * @param   String name  A unique key that identifies the panel to activate
     * @return  void
     */
  , removePanel: function(builder, panel_name) {
      CoffeeBuilder.prototype.removePanel.call(this, panel_name);
      CoffeeBuilderEvents.get('subpanels_change')(builder, this);      
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
      this.panels.get(name).activate();
    }
  
    /**
     * Given an element from the iframe, find the first subpanel that holds
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
  , findPanelWithElementControl: CoffeeBuilder.prototype.findPanelWithElementControl
  
    /**
     * Removes a control given the panel and control name/indexes.
     *
     * @param   String panel    A unique key that identifies the panel
     * @param   String control  A unique key that identifies the control
     * @return  void
     */
  , removeControlFromPanel: CoffeeBuilder.prototype.removeControlFromPanel
  
    /**
     * Activates a sub panel.
     *
     * @param   String name  A unique key that identifies the sub panel to activate
     * @return  void
     */    
  , activatePanel: CoffeeBuilder.prototype.activatePanel
  
    /**
     * Activates the previous panel.
     *
     * @return  void
     */    
  , prev: CoffeeBuilder.prototype.prev
    
    /**
     * Activates the next panel.
     *
     * @return  void
     */
  , next: CoffeeBuilder.prototype.next
  
    /**
     * Checks if it's possible to go to a previous frame.
     *
     * @return  Boolean
     */    
  , canPrev: CoffeeBuilder.prototype.canPrev
  
    /**
     * Checks if it's possible to go to the next frame.
     *
     * @return  Boolean
     */
  , canNext: CoffeeBuilder.prototype.canNext
   
    /**
     * Returns a stylesheet representing all current customizations for a given
     * panel.
     *
     * @param   string panel  The name of the panel to get the customizations for
     * @return  string
     */     
  , getStyleSheetForPanel: CoffeeBuilder.prototype.getStyleSheetForPanel
  

    /**
     * Returns a stylesheet representing all current customizations for a given
     * panel's control.
     *
     * @param   string panel    The name of the panel where the control can be found
     * @param   string control  The name of the control to get the customizations for
     * @return  string
     */
  , getStyleSheetForPanelControl: CoffeeBuilder.prototype.getStyleSheetForPanelControl
  
    /**
     * Gets/Sets data object for a given panel.
     *
     * @param   string panel  The name of the panel to get the data object for
     * @param   Object data   The data object (optional, used for setting)
     * @return  string
     */
  , dataForPanel: CoffeeBuilder.prototype.dataForPanel
  
    /**
     * Gets/Sets data object for a given panel's control.
     *
     * @param   string panel    The name of the panel where the control can be found
     * @param   string control  The name of the control to get the customizations for
     * @param   Object data     The data object (optional, used for setting)
     * @return  string
     */    
  , dataForPanelControl: CoffeeBuilder.prototype.dataForPanelControl
};

/**
 * A sub panel holds groups and controls.
 *
 * @param   String name      A unique key for the sub panel
 * @param   Object manifest  A JSON manifest that defines the sub panel
 * @return  void
 */  
var CoffeeBuilderSubPanel = function(name, manifest) {
  CoffeeBuilderPanel.call(this, name, manifest);    
};
CoffeeBuilderSubPanel.prototype = $.extend({}, CoffeeBuilderPanel.prototype, {
    constructor: CoffeeBuilderSubPanel
    
    /**
     * Builds and adds the DOM elements for a sub panel that will hold groups 
     * and controls.
     *
     * @param   CoffeeBuilder builder     The parent builder
     * @param   CoffeeBuilderPanel panel  The parent panel
     * @return  CoffeeBuilderSubPanel
     */      
  , build: function(builder, panel){
      var self = this;
    
      // Add the title
      self.$title.attr('id', panel.name + '_subpanel_' + self.name + '_title').click(function(){
        panel.activatePanel(self.name);
      });
      panel.$subswitcher.append(self.$title);
      
      // Add the controls
      self.$controls.attr('id', panel.name + '_subpanel_' + self.name + '_controls');
      builder.$controlset.append(self.$controls);
      
      // Add the fieldset
      self.$fieldset.attr('class', 'sub_panelset');
      self.$controls.append(self.$fieldset);
      
      if(self.manifest.customizations) {
        $.each(self.manifest.customizations, function(name, manifest){
          self.addControl(builder, name, manifest);
        });
      }
      
      return self;
    }
    
    /**
     * Activates this panel.
     *
     * @return  void
     */      
  , activate: function() {
      this.$title.addClass('active');
      this.$controls.addClass('active');      
    }
  
    /**
     * Deactivates this panel.
     *
     * @return  void
     */    
  , deactivate: function() {
      this.$title.removeClass('active');
      this.$controls.removeClass('active');            
    }    
});

/**
 * A control is a form element or a group of form elements used for 
 * controlling CSS properties.
 *
 * @param   CoffeeBuilder builder      The parent builder
 * @param   CoffeeBuilderPanel panel   The parent panel 
 * @param   String name                A unique key to identify the control
 * @param   Object manifest            A JSON manifest that defines the control
 * @param   CoffeeBuilderControlGroup  An optional parent group of related controls
 * @return  void   
 */  
var CoffeeBuilderControl = function(builder, panel, name, manifest, group) {
  this.builder = builder;
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
  this.stylesheet = new CoffeeBuilderStylesheet();
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
        old_style = null,
        old_css = null,
        css = null,
        selector = this.getSelector(),
        $element = this.getElement();

      // Can't get the CSS if there is no selector/property
      property = property || selector.property;      
      if(!selector.selector || !property) {
        return null;
      }
      
      // If the element doesn't exist uet, attempt to mock it
      if($element.length === 0) {
        this.builder.mockElement(selector.selector);
        $element = this.getElement();
      }
      
      // Some browsers require a style before a valid width/color is reported      
      var matches = property.match(/^(border.*)(?:-(?:color|width))$/);
      if(matches && $element.css(matches[1] + '-style') === 'none') {
        old_css = { property: matches[1] + '-style', value: 'none' };
        old_style = $element.attr('style') || '';
        $element.css(old_css.property, 'solid');
      }
      
      // Get the CSS of the element, converting rgba to hex 
      css = $element.css(property);
      if(typeof css === 'string' && css.match(/^rgba?\(.*?\)$/)) {
        css = this.getHexAlpha(css).hex;
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

      var css = self.builder.getStyleSheet().toString();
      if(self.builder.$styles[0].styleSheet) { // IE
        self.builder.$styles[0].styleSheet.cssText = css;
      } else {
        self.builder.$styles.html(css);
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
        stylesheet = new CoffeeBuilderStylesheet();      
      
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

/**
 * A group to hold related controls.
 *
 * @param   CoffeeBuilder builder      The parent builder
 * @param   CoffeeBuilderPanel panel   The parent panel 
 * @param   String name                A unique key to identify the control
 * @param   Object manifest            A JSON manifest that defines the control
 * @return  void
 */  
var CoffeeBuilderControlGroup = function(builder, panel, name, manifest) {
  var self = this;
  self.controls = new CoffeeBuilderCollection();
  
  CoffeeBuilderControl.call(self, builder, panel, name, manifest);
  self.$element = $('<div class="control_group">');

  if(manifest.customizations) {
    $.each(manifest.customizations, function(control_name, control){
      var new_control = CoffeeBuilderControls.get(builder, panel, control_name, control, self);
      
      self.controls.add(control_name, new_control);
      self.$element.append(new_control.$element);
    });
  }
};
CoffeeBuilderControlGroup.prototype = $.extend({}, CoffeeBuilderControl.prototype, {
    constructor: CoffeeBuilderControlGroup
    
    /**
     * Triggers the `change()` event for all form fields on all controls.
     *
     * @return  void
     */      
  , change: function(){
      $.each(this.controls.items, function(control_name, control){
        control.change();
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
    
      $.each(this.controls.items, function(control_name, control){
        stylesheet.merge(control.getStyleSheet(full));
      });
      
      return stylesheet;
    }
    
    /**
     * Gets/Sets data object for all controls.
     *
     * @param   Object data  The data object (optional, used for setting)
     * @return  Object
     */
  , data: function(data) {
      var writer = arguments.length > 0;
      data = data || {};
  
      $.each(this.controls.items, function(control_name, control){
        if(writer) {
          control.data(data);
        } else {
          $.extend(data, control.data());
        }
      });
  
      return data;
    }    
    
    /**
     * Given a jQuery element, checks if this group has fields that are meant 
     * to manage that element.
     *
     * @param   jQuery $element  The element to check for
     * @return  Boolean
     */      
  , hasElement: function($element) {
      var found = false;
  
      if(this.controls.length) {
        $.each(this.controls.items, function(control_name, control){
          if(control.hasElement($element)) {
            found = true;
            return false;
          }
        });      
      }
  
      return found;
    }
});

/**
 * Global collection of all available controls.
 *
 * Use `CoffeeBuilderControls.add()` for adding controls and
 * `CoffeeBuilderControls.get()` for retrieving controls.
 */
var CoffeeBuilderControls = {
    controls: {}  
  , pristine: {}
    
    /**
     * Adds or replaces a control in to the collection of available controls.
     *
     * control format:
     * --------------
     * {
     *   init:        function(){ }, 
     *   check:       function(){ },
     *   dataChanged: function(name, value){ } // (optional for data controls)
     * }
     *
     * @param   String name     The name of the control to add.
     * @param   Object control  The control to add
     * @return  void
     */      
  , add: function(name, control) {
      if(!control || !$.isFunction(control.init) || !$.isFunction(control.check)) {
        $.error('Invalid control provided');
      }

      this.pristine[name] = control;
      this.controls[name] = function(builder, panel, name, manifest, group) {
        CoffeeBuilderControl.call(this, builder, panel, name, manifest, group);
      };
      this.controls[name].prototype = $.extend(
        {}, control, CoffeeBuilderControl.prototype, { constructor: this.controls[name] }
      );
      this.controls[name].check = control.check;
    }
    
    /**
     * Gets a CoffeeBuilderControl instance given a JSON manifest.
     *
     * @param   CoffeeBuilder builder      The parent builder
     * @param   CoffeeBuilderPanel panel   The parent panel 
     * @param   String name                A unique key to identify the control
     * @param   Object manifest            A JSON manifest that defines the control
     * @param   CoffeeBuilderControlGroup  An optional parent group of related controls
     * @return  CoffeeBuilderControl|CoffeeBuilderControlGroup
     */      
  , get: function(builder, panel, name, manifest, group) {
      group = group || {};

      // Every control must have a unique name
      if(!manifest.name) {
        $.error('Invalid control: no name provided');
      }
      
      // Returns a CoffeeBuilderControlGroup instance if the contorl type is 'group'
      if(manifest.type === 'group') {
        return new CoffeeBuilderControlGroup(builder, panel, name, manifest);
      }

      // Find the control type that is required for the current manifest
      var ControlType = CoffeeBuilderControl;
      $.each(this.controls, function(control_name, control_class) {
        if(control_class.check(manifest)) {
          ControlType = control_class;
          return false;
        }
      });

      // Get an instance of the control and build the element if necessary
      return new ControlType(builder, panel, name, manifest, group);
    }

    /**
     * Gets the prestine version of a control.
     *
     * @param   String name     The name of the control to get.
     * @return  Object
     */  
  , getPristine: function(name) {
      if(!$.isPlainObject(this.pristine[name])) {
        $.error('Invalid index provided: ' + name);
      }
      
      return this.pristine[name];
    }
};

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
        options = this.manifest.options || [],
        min = options.min || '0',
        max = options.max || '1000',
        value = this.getCss() || options['default'] || min;
        
      this.$element = $('<label class="label_input"><span class="primary_left"></span><input type="number" class="input_right size_field"></label>');
      this.fields.input = this.$element.find('input');
      this.setTitle(this.$element.find('span:first'));
      
      CoffeeBuilderEvents.get('initialize_sizers')(        
        this.fields.input.attr({
          name: this.name,
          value: parseInt(value, 10),
          min: min,
          max: max,
          maxlength: max.length
        })
        .change($.proxy(this.inputChange, this))
        .keyup($.proxy(this.inputKeyup, this))
      );
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
     * this.properties // (optional) CSS properties managed by the control
     *
     * @return  void
     */      
  , init: function() {
      var 
        options = this.manifest.options || [],
        fonts = '',
        family = this.getCss('font-family') || 'Helvetica, Arial, sans-serif',
        size = this.getCss('font-size') || '13px',
        color = this.getCss('color') || '#000000',
        $text = this.getElement();

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
      this.properties = ['font-family','font-size','color'];
      
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
        family: this.$element.find('select').val(family),
        size: this.$element.find('input.size_field').val(parseInt(size, 10)),
        input: this.$element.find('input.description_text'),
        color: this.$element.find('input.color_picker').val(color)
      };
      
      // Set the title
      this.setTitle(this.$element.find('span:first'));        

      // Initialize the color picker
      CoffeeBuilderEvents.get('colorpicker_initialize')(this, this.fields.color, 'color');

      // Add events
      if($text.length) {

        this.fields.input.val($text.text()).change($.proxy(this.textChange, this)).keyup($.proxy(this.textChange, this));
        this.fields.family.change($.proxy(this.fontFamilyChange, this));
        
        CoffeeBuilderEvents.get('initialize_sizers')(
          this.fields.size.change($.proxy(this.fontSizeChange, this)).keyup($.proxy(this.fontSizeKeyup, this))
        );

      // Otherwise, disable controls
      } else {
        $.each(this.fields, function(field_name, field){
          field.attr('disabled', true);
        });
      }
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
      var
        self = this,          
        shadow = self.getCss();
        
      // Set the element
      self.$element = $(
        '<div class="control_group shadow_group">' +
        ' <label class="label_input_grouped"><span class="primary_left section_head"><input class="shadow_enabled shadow_checkbox" type="checkbox"></span></label>' +
        ' <label class="label_input_grouped"><input type="text" class="color_right color_picker shadow_color" value="#777777"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_opacity" type="text" value="90" min="0" max="100" maxlength="3"><span class="shadow_text">%</span></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_x" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_y" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_blur" type="text" value="5" min="0" max="10" maxlength="2"></label>' +
        ' <span class="shadow_label first">Alpha</span><span class="shadow_label">X</span><span class="shadow_label">Y</span><span class="shadow_label">Blur</span>' +
        '</div>'
      );
      
      // Set the fields
      $.each(['checkbox','color','opacity','x','y','blur'], function(index, name){
        self.fields[name] = self.$element.find('input.shadow_' + name);
      });

      // Set the title
      self.setTitle(self.$element.find('span:first'));

      // Set defaults
      if(shadow && shadow !== 'none') {
        self.fields.checkbox.attr('checked','checked');
        
        var hexa = self.getHexAlpha(shadow);
        if(hexa.hex)
        {
          self.fields.color.val(hexa.hex);
          self.fields.opacity.val(Math.round((hexa.alpha ? hexa.alpha : 1) * 100));
        }

        var match = shadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
        if(match)
        {
           self.fields.x.val(match[1]);
           self.fields.y.val(match[2]);
           self.fields.blur.val(match[3]);
        }          
      }
      
      // Add events
      self.fields.checkbox.change($.proxy(self.checkboxChange, self)).change();
      CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.color, undefined, {}, $.proxy(self.shadowChange, self));
      $.each(self.fields, function(field_name, field) {
        if(field_name !== 'checkbox' && field_name !== 'color') {
          CoffeeBuilderEvents.get('initialize_sizers')(field.change($.proxy(self.sizerChange, self)).keyup($.proxy(self.sizerKeyup, self)));
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

/**
 * Control used for managing background properties.
 */  
CoffeeBuilderControls.add('background', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
    check: function(manifest) {        
      return CoffeeBuilderControl.getSelector(manifest).property === 'background';
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
      var bgcolor = this.getCss('background-color') || '#000000';

      this.$element = $('<label class="label_input"><span class="primary_left"></span><input type="text" class="color_right color_picker"></label>');
      this.fields.bgcolor = this.$element.find('input.color_picker').val(bgcolor);
      this.setTitle(this.$element.find('span:first'));

      CoffeeBuilderEvents.get('colorpicker_initialize')(this, this.fields.bgcolor, 'background-color');
    }
});

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
     * this.properties // (optional) CSS properties managed by the control
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
      self.$element = $('<div class="four_sided_container">');
      self.$four_sided_labels= $('<div class="four_sided_labels">');
      
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
          self.properties.push(property);
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

/**
 * Global collection of all available events.
 *
 * Use `CoffeeBuilderEvents.add()` for adding events and
 * `CoffeeBuilderEvents.get()` for retrieving events.   
 */
var CoffeeBuilderEvents = {
    events: {}
    
    /**
     * Adds or replaces an event in the collection of available events.
     *
     * @param   String name     The name of the event to add.
     * @param   Function event  The event to add
     * @return  void
     */      
  , add: function(name, event) {
      if(!$.isFunction(event)) {
        $.error('Invalid event provided');
      }
      this.events[name] = event;
    }

    /**
     * Gets an event given the event's name.
     *
     * @param   String name  The name of the event to get.
     * @return  void
     */      
  , get: function(name) {
      if(!$.isFunction(this.events[name])) {
        $.error('Event doesn\'t exist: ' + name);
      }
      return this.events[name];
    }
};

/**
 * Initializes colorpickers.
 * 
 * @param   CoffeeBuilderControl control  The colorpicker control
 * @param   jQuery $input                 The input that is linked to the colorpicker
 * @param   String property               An optional CSS property for the control
 * @param   object Options                Options for customizing colorpicker
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('colorpicker_initialize', function(control, $input, property, options, callback){
  var
    value = $input.val() || '#000000',
    $picker = $('<div class="color_right fb-color-control"><div></div></div>').insertBefore($input).find('div').css('background-color', value);

  // Initialize the picker, merging the `options` parameter if necessary.
  $picker.ColorPicker(
    $.extend({
      
        /**
         * Change event for the colorpicker.
         * 
         * @param   String hsb  New hue, saturation, and brightness value
         * @param   String hex  New hex value
         * @param   String rgb  New rgb value
         * @return  void
         */
        onChange: function(hsb, hex, rgb) {
          CoffeeBuilderEvents.get('colorpicker_change')('#' + hex, control, $input, property, callback);
        }
        
        /**
         * Event called when a colorpicker is ready to show.
         *
         * @param   DOMElement picker  The colorpicker dom element
         * @return  void
         */          
      , onShow: function(picker) {
          var design_mode_disabled;
        
          // Show the picker if the input is not disabled
          if(!$input.is(':disabled')) {
            if(design_mode_disabled = control.builder.design_mode) {
              control.builder.toggleDesignMode(false);
            }
            
            // Clicking in the iframe should also close the picker
            control.builder.$element.contents().click(function(event){
              $(this).unbind(event);
              $(window.document).mousedown();

              if(design_mode_disabled) {
                control.builder.toggleDesignMode(true);
              }
            });

            $(picker).fadeIn(500);          
          }
          
          return false;
        }
        
        /**
         * Event called when a colorpicker is ready to hide.
         * 
         * @param   DOMElement picker  The colorpicker dom element
         * @return  void
         */       
      , onHide: function(picker) {
          $(picker).fadeOut(500);
          return false;
        }
    }, options)
  ).ColorPickerSetColor(value);
  
  // Updating the input should also update the colorpicker
  $input.change(function(){
    var color = $(this).val();

    $picker.ColorPickerSetColor(color);
    CoffeeBuilderEvents.get('colorpicker_change')(color, control, $input, property, callback);      
  });    
});

/**
 * Change event for when a colorpicker value changes.
 * 
 * @param   String value                  The new colorpicker value
 * @param   CoffeeBuilderControl control  The colorpicker control
 * @param   jQuery $input                 The input that is linked to the colorpicker
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('colorpicker_change', function(value, control, $input, property, callback){
  $input.val(value).prev('.fb-color-control').find('div').css('background-color', value);
  return $.isFunction(callback) ? callback(value) : control.updateCss(property, value);
});

/**
 * Change event for selects which updates corresponding CSS.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The select control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('select_change', function(event, control, property, callback){
  var newvalue = $(event.currentTarget).val();
  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});

/**
 * Initializes input sizers by adding the `oldvalue` data property which 
 * enables sizer controls to keep track of previous values in case validation 
 * fails and values need to be reset.
 * 
 * @param   jQuery $sizers  The input sizers
 * @return  void   
 */
CoffeeBuilderEvents.add('initialize_sizers', function($sizers){
  $sizers.each(function(){
    var $sizer = $(this);
    $sizer.data('oldvalue', $sizer.val());
  });
});

/**
 * Change event for sizer controls which updates CSS related to a sizer.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('sizer_change', function(event, control, property, callback){
  var 
    $field = $(event.currentTarget),
    min = parseInt($field.attr('min'), 10),
    max = parseInt($field.attr('max'), 10),
    newvalue = $field.val();

  if(!/^\d+$/.test(newvalue)) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback);
  }

  newvalue = parseInt(newvalue, 10);
  if(!isNaN(min) && newvalue < min) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback, 'The minimum allowed value is ' + min + '.');
  }

  if(!isNaN(max) && newvalue > max) {
    return CoffeeBuilderEvents.get('sizer_reset')(event, control, property, callback, 'The maximum allowed value is ' + max + '.');
  }

  $field.data('oldvalue', newvalue);
  return $.isFunction(callback) ? callback(newvalue + 'px') : control.updateCss(property, newvalue + 'px');
});

/**
 * Keyup event for sizer controls which updates CSS related to a sizer.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('sizer_keyup', function(event, control, property, callback){
  var 
    $field = $(event.currentTarget),
    min = parseInt($field.attr('min'), 10),
    max = parseInt($field.attr('max'), 10),
    newvalue = $field.val();

  if(!/^\d+$/.test(newvalue)) {
     return;
  }

  newvalue = parseInt(newvalue, 10);
  if((!isNaN(min) && newvalue < min) || (!isNaN(min) && newvalue > max)) {
     return;
  }

  return $.isFunction(callback) ? callback(newvalue + 'px') : control.updateCss(property, newvalue + 'px');
});


/**
 * Reset event for sizer controls which is used internally by the other sizer
 * events to reset the sizer values.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The sizer control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @param   string message                An optional message
 * @return  void
 */
CoffeeBuilderEvents.add('sizer_reset', function(event, control, property, callback, message){
  var 
    $field = $(event.currentTarget),
    oldvalue = $field.data('oldvalue') || parseInt(control.getCss(property), 10) || 0;
  
  if(typeof message === 'string') {
     //alert(message);
  }
  
  $field.val(oldvalue);
  return $.isFunction(callback) ? callback(oldvalue + 'px') : control.updateCss(property, oldvalue + 'px');  
});
/**
 * Event triggered when a window is resized to ensure that the iframe element
 * always occupies all available space except for what is designated for the
 * UI controls.
 * 
 * @param   jQuery.Event event     The resize event.
 * @param   CoffeeBuilder builder  The parent builder
 * @param   Function callback      An optional callback
 * @return  void   
 */
CoffeeBuilderEvents.add('window_resize', function(event, builder, callback){
  builder.$center.width($(event.currentTarget.document).width() - builder.width);
  
  if($.isFunction(callback)) {
    callback();
  }
});

/**
 * Change event for text fields which updates corresponding text elements.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The text control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('text_change', function(event, control, callback){
  var newvalue = $(event.currentTarget).val();
  return $.isFunction(callback) ? callback(newvalue) : control.updateTextElement(newvalue);
});

/**
 * Change event for all elements in the shadow control.
 *
 * NOTE: All shadow controls share the same change event because currently
 * specs do not allow for specifying individual shadow properties like
 * `box-shadow-blur`.
 *
 * @see     http://lists.w3.org/Archives/Public/www-style/2009Nov/0315.html
 * @see     http://lists.w3.org/Archives/Public/www-style/2009Nov/0317.html
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('shadow_change', function(control, property, callback){
  if(!control.fields.checkbox.is(':checked')) {
    return;
  }
  
  var newvalue = 
    'rgba(' + 
      control.getRgb(control.fields.color.val()) + ', ' + 
      control.fields.opacity.val() / 100 + 
    ') ' + 
    control.fields.x.val() + 'px ' + 
    control.fields.y.val() + 'px ' + 
    control.fields.blur.val() + 'px 0';

  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});  

/**
 * Change event for the checkbox that enables/disables box-shadow.
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('shadow_checkbox', function(control, property, callback) {
  var checked = control.fields.checkbox.is(':checked');

  // Disable fields in control if checkbox isn't checked
  $.each(control.fields, function(control_name, $field) {
    if(control_name !== 'checkbox') {
      $field.attr('disabled', !checked);
    }
  });

  return checked ? CoffeeBuilderEvents.get('shadow_change')(control, property, callback) : control.updateCss(property, 'none');
});

/**
 * Event triggered when a window is resized to ensure that the iframe element
 * always occupies all available space except for what is designated for the
 * UI controls.
 * 
 * @param   jQuery.Event event     The resize event.
 * @param   CoffeeBuilder builder  The parent builder
 * @param   Function callback      An optional callback
 * @return  void   
 */
CoffeeBuilderEvents.add('subpanels_change', function(builder, parent){
  var width = (builder.width - parent.panels.length + 1) / parent.panels.length;
  $.each(parent.panels.items, function(index, panel){
    panel.$title.removeClass('last').css('width', width + 'px');
  });
  parent.panels.get(parent.panels.length-1).$title.addClass('last');
});
/**
 * Lock/Unlock event for locks on groups of border controls.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The text control
 * @return  void
 */  
CoffeeBuilderEvents.add('border_lock', function(event, control){
  var locked = {};

  control.locked = !control.locked;
  control.$lock.removeClass('border_lock border_unlock').addClass('border_' + (control.locked ? 'lock' : 'unlock'));

  $.each(control.group.controls.keys, function(index, name) {
    var lock_control = control.group.controls.get(name);

    $.each(['width','style','color'], function(index, field){

      // Keep track of the first control in the group as it will serve as the
      // template for all other controls
      if(name === control.name) {
        locked[field] = lock_control.fields[field].val();
        
      } else {

        // If the group is locked, make all control fields match the original field
        // and disable them.
        if(control.locked) {
          lock_control.fields[field].val(locked[field]).change().attr('disabled', true);

        // Otherwise, enable all controls
        } else {
          lock_control.fields[field].removeAttr('disabled');
        }
      }
    });
  });
}); 

/**
 * Initializes border groups by unlocking the group if any of the
 * controls in the group don't match the first control.
 * 
 * @param   CoffeeBuilderControl control  The text control
 * @return  void
 */  
CoffeeBuilderEvents.add('border_initialize', function(control){
  var first = control.group.controls.get(0);
  
  // The first control in the group is not locked, no reason to proceed
  if(!first.locked) {
    return;
  }
  
  $.each(['width','style','color'], function(index, field){

    // If the control field doesn't match the corresponding field from the
    // first control in the group, unlock the control and exit.
    if(control.fields[field].val() !== first.fields[field].val()) {
      first.$lock.click();
      return false;

    // Otherwise, disable the control field
    } else {
      control.fields[field].attr('disabled', true);
    }

  });
});
/**
 * Change event for repeat position control which change repeat of background image
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The repeat control
 * @param   Function callback             An optional callback
 * @return  void
 */
CoffeeBuilderEvents.add('repeat_change', function (event, control, property, callback) {
    var newvalue = $(event.currentTarget).val();
    
    // Set value for hidden field
    control.fields.hidden_repeat.val(newvalue);
    return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});
/**
 * Change event for background icon position control which change position icon with XY.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The background_icon control
 * @param   Function callback             An optional callback
 * @return  void
 */ 
CoffeeBuilderEvents.add('position_xy', function(control, property, callback){
	var position = control.fields.position.attr("value");
    var value = "0% 0%";
    var x = '0%';
    var y = '0%';
    var control_hover, control_selected;
    
    if (control.name === 'background_regular') {
        // Get control background image hover
        control_hover = control.builder.panels.get('body').panels.get('hover').controls.get('background_hover');
        
        // Get control background_icon_selected
        control_selected = control.builder.panels.get('body').panels.get('selected').controls.get('background_selected');
    }
    else if (control.name === 'background_icon'){
        control_hover = control.builder.panels.get('body').panels.get('hover').controls.get('background_icon_hover');
        control_selected = control.builder.panels.get('body').panels.get('selected').controls.get('background_icon_selected');
    }
    
    // If checkbox hover state is not checked
    if ((control_hover) && !control_hover.fields.check_hover.is(':checked')) {
         control_hover.fields.position.val(position);
    }
    
    // If checkbox selected state is not checked
    if ((control_selected) && !control_selected.fields.check_hover.is(':checked')) {
         control_selected.fields.position.val(position);
    }
    
    // Set value position
    if(position === 'left' || position === 'right' || position === 'center'){
        
        // Disable both spin left right when not select custom
        control.fields.spinleft.attr('disabled','disabled');
        control.fields.spinright.attr('disabled','disabled');
        
        // Disable spin when hover and selected
        if (control_hover) {
            control_hover.fields.spinleft.attr('disabled','disabled');
            control_hover.fields.spinright.attr('disabled','disabled');
        }
        
        if (control_selected) {
            control_selected.fields.spinleft.attr('disabled','disabled');
            control_selected.fields.spinright.attr('disabled','disabled');
        }
        
        // Set value for position
        if (position === 'left') {
            value = "0% 10%";
        }
        else if (position === 'right') {
            value = "95% 10%";
        }
        else if (position === 'center') {
            value = "50% 10%";
        }
    }
    else{
        // Enable both spin left right when select custom
        control.fields.spinleft.removeAttr('disabled');
        control.fields.spinright.removeAttr('disabled');
        
        // Get value from both spin
        if (control.fields.spinleft.val()) {
            x = control.fields.spinleft.val() + "%";
            
            // When checkbox hover state is not checked
            if ((control_hover) && !control_hover.fields.check_hover.is(':checked')) {
                control_hover.fields.spinleft.val(control.fields.spinleft.val());
            }
            
            // When checkbox selected state is not checked
            if ((control_selected) && !control_selected.fields.check_hover.is(':checked')) {
                control_selected.fields.spinleft.val(control.fields.spinleft.val());
            }
        }
        if (control.fields.spinright.val()) {
            y = control.fields.spinright.val() + "%";
            
            // When checkbox hover state is not checked
            if ((control_hover) && !control_hover.fields.check_hover.is(':checked')) {
                control_hover.fields.spinright.val(control.fields.spinright.val());
            }
            
            // When checkbox selected state is not checked
            if ((control_selected) && !control_selected.fields.check_hover.is(':checked')) {
                control_selected.fields.spinright.val(control.fields.spinright.val());
            }
        }
        value = x + " " + y;
    }
     return $.isFunction(callback) ? callback(value) : control.updateCss(property, value);
});

/**
 * Change event for background color control which change background color and transparent.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The background-transparent control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('change_background_color', function (control, property, callback) {
    var newvalue = control.fields.bgcolor.val() + ' !important';
    return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property,newvalue);
});

/**
 * Change event for background color control which check or uncheck checkbox transparent.
 * 
 * @param   jQuery.Event event            The change event
 * @param   CoffeeBuilderControl control  The background-transparent control
 * @param   Function callback             An optional callback
 * @return  void
 */ 
CoffeeBuilderEvents.add('background_checkbox', function (control, property, callback) {
    var checked = control.fields.checkbox.is(':checked');
    var newvalue = control.fields.bgcolor.val();
    
    if (control.name === 'background_regular') {
        
        // Get control background hover
        var control_hover = control.builder.panels.get('body').panels.get('hover').controls.get('background_hover');
        
        (checked) ? control_hover.fields.checkbox.attr('checked', 'checked') : control_hover.fields.checkbox.removeAttr('checked');
        
        CoffeeBuilderEvents.get('colorpicker_change')(newvalue, control_hover, control_hover.fields.bgcolor, 'color');
        control_hover.fields.bgcolor.val(newvalue);
    }
    // Set value for hidden field
    (checked) ? control.fields.hidden_color.val('transparent') : control.fields.hidden_color.val(newvalue);
    
    // Disable fields in control if checkbox isn't checked
    return !checked ? CoffeeBuilderEvents.get('change_background_color')(control, property, callback) : control.updateCss(property,"transparent !important");
});

/**
 * Change event for upload background image control which delete background image
 * 
 * @param   jQuery.Event event            The click event
 * @param   CoffeeBuilderControl control  The upload_background_image control
 * @param   Function callback             An optional callback
 * @return  void
 */ 
CoffeeBuilderEvents.add('delete_background', function (control, property, callback) {
    var isNotDelete = control.fields.field_element.val() === "";
    var control_hover, control_selected;
    var newvalue = "none";
    
    if (!isNotDelete) {
        alert('Delete successfully');
    }
    if (control.fields.hidden_delete_file.val() !== undefined) {
        $.ajax({
            url: "action/deleteFile.php",
            type: "POST",
            data: {
                    filepath: control.fields.hidden_delete_file.val()
            } 
        });
        
        if (control.name === 'background_regular') {
            // Get control background image hover
            control_hover = control.builder.panels.get('body').panels.get('hover').controls.get('background_hover');
            
            // Get control background image hover
            control_selected = control.builder.panels.get('body').panels.get('selected').controls.get('background_selected');
            
        }
        else if (control.name === 'background_icon'){
            control_hover = control.builder.panels.get('body').panels.get('hover').controls.get('background_icon_hover');
            
            control_selected = control.builder.panels.get('body').panels.get('selected').controls.get('background_icon_selected');
        }
        
        // If checkbox hover state is not checked
        if ((control_hover) && !control_hover.fields.check_hover.is(':checked')) {
            control_hover.$element.find('input:text').val('');
            control_hover.updateCss(property, newvalue);
        }
        
        // If checkbox selected state is not checked
        if ((control_selected) && !control_selected.fields.check_hover.is(':checked')) {
            control_selected.$element.find('input:text').val('');
            control_selected.updateCss(property, newvalue);
        }
        
        // Clear hidden file
        control.fields.hidden_file.val('');
    }
 
    if (control.fields.spinleft !== undefined) {
        control.fields.spinleft.val(0);
        control.fields.spinright.val(0);
     }
    
    return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});

/**
 * Event get value for background image
 * @param CoffeeBuilderControl control  The background_image control
 * @return void
 */
CoffeeBuilderEvents.add('get_value_background_hover', function(control) {
    var regular = control.builder.panels.get('body').panels.get('regular').controls.get('background_regular');
    // Set color default for hover or selected
    CoffeeBuilderEvents.get('colorpicker_change')(regular.fields.bgcolor.val() + ' !important', control, control.fields.bgcolor, 'background-color');
    
    // Set check transparent
    var checked = regular.fields.checkbox.is(':checked');
    (checked) ? control.fields.checkbox.attr('checked', 'checked') : control.fields.checkbox.removeAttr('checked');
    
});

var

  /**
   * Public API methods for the jQuery.fn.coffeeBuilder plugin.
   *
   * To init the plugin:
   *
   * <code>
   *
   * $('iframe').coffeeBuilder({
   *   width: 332,
   *   design_mode: true,
   *   manifest: {
   *     panels: {
   *       page: {
   *         name: "Page",
   *         customizations: {
   *           background: {
   *             name: "Background",
   *             selectors: {
   *               body: [
   *                 "background"
   *               ]
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * });
   *
   * </code>
   *
   * Valid options:
   * --------------
   *  .design_mode:  (Boolean) If the iframe should be in design mode at startup
   *  .manifest:     (Object)  JSON structure that defines the panels and controls.
   *  .width:        (Number)  A pixel width for the controls
   */
  dom_api = [
      /**
       * Activates a UI panel.
       *
       * <code>
       *
       * // By index
       * $('iframe').coffeeBuilder('activatePanel', 4);
       *
       * // By name
       * $('iframe').coffeeBuilder('activatePanel', 'page');
       *
       * // By Element
       * $('iframe').coffeeBuilder('activatePanel', $('iframe').contents().find('h1'));
       *
       * </code>
       *
       * @param   String name  A unique key that identifies the panel to activate
       * @return  jQuery
       */
      'activatePanel'
      
      /**
       * Activates a UI sub panel on the current panel.
       *
       * <code>
       *
       * // By index
       * $('iframe').coffeeBuilder('activateSubPanel', 2);
       *
       * // By name
       * $('iframe').coffeeBuilder('activateSubPanel', 'nav');
       *
       * </code>
       *
       * @param   String|Number name  A unique key that identifies the sub panel to activate.
       * @return  void
       */      
    , 'activateSubPanel'
      
      /**
       * Adds a new panel to the UI.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('addPanel', 'page', {
       *   name: "Page",
       *   customizations: {
       *     background: {
       *       name: "Background",
       *       selectors: {
       *         body: [
       *           "background"
       *         ]
       *       }
       *     }
       *   }
       * });
       *
       * </code>
       *
       * @param   String name      A unique key to identify the panel
       * @param   Object manifest  JSON manifest that defines the panel
       * @return  jQuery
       */
    , 'addPanel'
    
      /**
       * Triggers the `change()` event for all form fields on all panels. 
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('change');
       *
       * </code>
       *
       * @return  jQuery
       */
    , 'change'
    
      /**
       * Disables all panels so that no controls can be used. This is useful
       * while the iframe is loading content.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('disable');
       *
       * </code>
       *
       * @return  jQuery
       */
    , 'disable'
    
      /**
       * Enables all panels so that all controls can be used. This is useful
       * after the iframe is done loading content.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('enable');
       *
       * </code>
       *
       * @return  jQuery
       */
    , 'enable'
    
      /**
       * Activates the next panel.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('next');
       *
       * </code>
       *
       * @return  jQuery
       */
    , 'next'
    
      /**
       * Activates the previous panel.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('prev');
       *
       * </code>
       *
       * @return  jQuery
       */
    , 'prev'
    
      /**
       * Used when the iframe is reloaded to update the DOM references.
       *
       * If the manifest parameter is provided, all panels and controls are 
       * reset. Otherwise, the CSS for all elements is updated to match the 
       * current controls.
       *
       * <code>
       *
       * // Update all CSS elements
       * $('iframe').coffeeBuilder('refresh');
       *
       * // Update all panels
       * $('iframe').coffeeBuilder('refresh', {
       *   panels: {
       *     page: {
       *       name: "Page",
       *       customizations: {
       *         background: {
       *           name: "Background",
       *           selectors: {
       *             body: [
       *               "background"
       *             ]
       *           }
       *         }
       *       }
       *     }
       *   }
       * });
       *
       * </code>
       *
       * @param   Object manifest  JSON structure that defines the panels and controls.
       * @return  jQuery
       */
    , 'refresh'
    
      /**
       * Removes a panel given the panels name/index.
       *
       * <code>
       *
       * // By index
       * $('iframe').coffeeBuilder('removePanel', 4);
       *
       * // By name
       * $('iframe').coffeeBuilder('removePanel', 'page');
       *
       * </code>
       *
       * @param   String name  A unique key that identifies the panel to activate
       * @return  jQuery
       */
    , 'removePanel'

      /**
       * Enables/disables design mode.
       *
       * Design mode is a mode where clicking on DOM elements in the iframe
       * activates the corresponding panel. 
       *
       * <code>
       *
       * // Enable/disable design mode depending on the current state
       * $('iframe').toggleDesignMode();
       *
       * // Enable design mode
       * $('iframe').toggleDesignMode(true);
       *
       * </code>
       *
       * @param   Boolean check  If design mode should be enabled/disabled
       * @return  jQuery
       */
    , 'toggleDesignMode'
    
      /**
       * Adds a new sub panel to a panel.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('addSubPanel', 'body', 'page', {
       *   name: "Page",
       *   customizations: {
       *     background: {
       *       name: "Background",
       *       selectors: {
       *         body: [
       *           "background"
       *         ],
       *         html: [
       *           "background"
       *         ]
       *       }
       *     }
       *   }
       * });
       *
       * </code>
       *
       * @param   String panel      A unique key to identify the parent panel
       * @param   String sub_panel  A unique key to identify the sub panel
       * @param   Object manifest   A JSON manifest that defines the sub panel
       * @return  jQuery
       */    
    , 'addSubPanel'
    
      /**
       * Adds a new control to a panel.
       *
       * <code>
       * $('iframe').coffeeBuilder('addControlToPanel', 'container', 'shadow', {
       *   name: "Shadow",
       *   selectors: {
       *     '#container': [
       *       "box-shadow"
       *     ]
       *   }
       * });
       * </code>
       *
       * @param   String panel     A unique key that identifies the panel
       * @param   String name      A unique key to identify the control
       * @param   Object manifest  A JSON manifest that defines the control
       * @return  jQuery
       */   
    , 'addControlToPanel'
    
      /**
       * Adds a new control to a sub panel.
       *
       * <code>
       * $('iframe').coffeeBuilder('addControlToSubPanel', 'body', 'nav', 'shadow', {
       *   name: "Shadow",
       *   selectors: {
       *     '#header': [
       *       "box-shadow"
       *     ]
       *   }
       * });
       * </code>
       *
       * @param   String panel      A unique key that identifies the panel
       * @param   String sub_panel  A unique key that identifies the sub_panel
       * @param   String name       A unique key to identify the control
       * @param   Object manifest   A JSON manifest that defines the control
       * @return  jQuery
       */   
    , 'addControlToSubPanel'
    
      /**
       * Removes a sub panel given the panel and sub panel name/indexes.
       *
       * <code>
       *
       * $('iframe').coffeeBuilder('removeSubPanel', 'body', 'nav');
       *
       * </code>
       *
       * @param   String panel      A unique key that identifies the panel
       * @param   String sub_panel  A unique key that identifies the sub_panel
       * @return  jQuery
       */    
    , 'removeSubPanel'
    
      /**
       * Removes a control given the panel and control name/indexes.
       *
       * <code>
       *
       * // By index
       * $('iframe').coffeeBuilder('removeControlFromPanel', 0, 0);
       *
       * // By name
       * $('iframe').coffeeBuilder('removeControlFromPanel', 'page', 'background');
       *
       * // Mixed
       * $('iframe').coffeeBuilder('removeControlFromPanel', 'page', 0);
       *
       * </code>
       *       
       * @param   String panel    A unique key that identifies the panel
       * @param   String control  A unique key that identifies the control
       * @return  void
       */    
    , 'removeControlFromPanel'
    
      /**
       * Removes a control given the panel, sub panel and control name/indexes.
       *
       * <code>
       *
       * // By index
       * $('iframe').coffeeBuilder('removeControlFromSubPanel', 2, 0, 0);
       *
       * // By name
       * $('iframe').coffeeBuilder('removeControlFromSubPanel', 'body', 'title', 'background');
       *
       * // Mixed
       * $('iframe').coffeeBuilder('removeControlFromSubPanel', 'body', 0, 0);
       *
       * </code>
       *
       * @param   String panel      A unique key that identifies the panel
       * @param   String sub_panel  A unique key that identifies the sub_panel     
       * @param   String control    A unique key that identifies the control
       * @return  void
       */    
    , 'removeControlFromSubPanel'
  ],
  
  /**
   * Data API methods for the jQuery.fn.coffeeBuilder plugin.
   *
   * These methods return data instead of a reference to a jQuery object. 
   */
  data_api = [
      /**
       * Returns a stylesheet representing all current customizations.
       *
       * <code>
       *
       * // Just get the current control customizations
       * $('iframe').coffeeBuilder('getStyleSheet');
       *
       * // Get the full stylesheet
       * $('iframe').coffeeBuilder('getStyleSheet', true);
       *
       * </code>
       *
       * @param   boolean full  If the full stylesheet (not just customizations) should be returned.
       * @return  string
       */  
      'getStyleSheet'
      
      /**
       * Returns a stylesheet representing all current customizations for a given
       * panel.
       *
       * <code>
       *  
       * // Just get the current control customizations
       * $('iframe').coffeeBuilder('getStyleSheetForPanel', 'container');
       *
       * // Get the full stylesheet
       * $('iframe').coffeeBuilder('getStyleSheetForPanel', 'container', true);
       *
       * </code>
       *
       * @param   string panel  The name of the panel to get the customizations for
       * @param   boolean full  If the full stylesheet (not just customizations) should be returned.       
       * @return  string
       */      
    , 'getStyleSheetForPanel'
    
      /**
       * Returns a stylesheet representing all current customizations for a given
       * panel's control.
       *
       * <code>
       *  
       * // Just get the current control customizations
       * $('iframe').coffeeBuilder('getStyleSheetForPanelControl', 'container', 'width');
       *
       * // Get the full stylesheet
       * $('iframe').coffeeBuilder('getStyleSheetForPanelControl', 'container', 'width', true);
       *
       * </code>
       *
       * @param   string panel    The name of the panel where the control can be found
       * @param   string control  The name of the control to get the customizations for
       * @param   boolean full    If the full stylesheet (not just customizations) should be returned.       
       * @return  string
       */    
    , 'getStyleSheetForPanelControl'
    
      /**
       * Returns a stylesheet representing all current customizations for a given
       * panel's sub panel.
       *
       * <code>
       *  
       * // Just get the current control customizations
       * $('iframe').coffeeBuilder('getStyleSheetForSubPanel', 'body', 'title');
       *
       * // Get the full stylesheet
       * $('iframe').coffeeBuilder('getStyleSheetForSubPanel', 'body', 'title', true);
       *
       * </code>
       *
       * @param   string panel      The name of the panel where the sub panel can be found
       * @param   string sub_panel  The name of the sub_panel to get the customizations for
       * @param   boolean full      If the full stylesheet (not just customizations) should be returned.       
       * @return  string
       */
    , 'getStyleSheetForSubPanel'
    
      /**
       * Returns a stylesheet representing all current customizations for a given
       * sub panel's control.
       *
       * <code>
       *
       * // Just get the current control customizations
       * $('iframe').coffeeBuilder('getStyleSheetForSubPanelControl', 'body', 'title', 'padding');
       *
       * // Get the full stylesheet
       * $('iframe').coffeeBuilder('getStyleSheetForSubPanelControl', 'body', 'title', 'padding', true);
       *
       * </code>
       *
       * @param   string panel      The name of the panel where the sub panel can be found
       * @param   string sub_panel  The name of the sub panel where the control can be found
       * @param   string control    The name of the control to get the customizations for
       * @param   boolean full      If the full stylesheet (not just customizations) should be returned.       
       * @return  string
       */
    , 'getStyleSheetForSubPanelControl'
    
      /**
       * Gets/Sets data object for all panels/controls.
       *
       * <code>
       *
       * // Getter
       * $('iframe').coffeeBuilder('data');
       *
       * // Setter
       * $('iframe').coffeeBuilder('data', {fadein: 'iscool'});
       *
       * </code>
       *
       * @param   Object data  The data object (optional, used for setting)
       * @return  Object
       */  
    , 'data'

      /**
       * Gets/Sets data object for a given panel.
       *
       * <code>
       *  
       * // Getter
       * $('iframe').coffeeBuilder('dataForPanel', 'container');
       *
       * // Setter
       * $('iframe').coffeeBuilder('dataForPanel', 'container', {fadein: 'iscool'});
       *
       * </code>
       *
       * @param   string panel  The name of the panel to get the data object for
       * @param   Object data   The data object (optional, used for setting)
       * @return  Object
       */      
    , 'dataForPanel'
    
      /**
       * Gets/Sets data object for a given panel's control.
       *
       * <code>
       *  
       * // Getter
       * $('iframe').coffeeBuilder('dataForPanelControl', 'container', 'width');
       *
       * // Setter
       * $('iframe').coffeeBuilder('dataForPanelControl', 'container', 'width', {fadein: 'iscool'});
       *
       * </code>
       *
       * @param   string panel    The name of the panel where the control can be found
       * @param   string control  The name of the control to get the customizations for
       * @param   Object data     The data object (optional, used for setting)
       * @return  Object
       */    
    , 'dataForPanelControl'
    
      /**
       * Gets/Sets data object for a given panel's sub panel.
       *
       * <code>
       *  
       * // Getter
       * $('iframe').coffeeBuilder('dataForSubPanel', 'body', 'title');
       *
       * // Setter
       * $('iframe').coffeeBuilder('dataForSubPanel', 'body', 'title', {fadein: 'iscool'});
       *
       * </code>
       *
       * @param   string panel      The name of the panel where the sub panel can be found
       * @param   string sub_panel  The name of the sub_panel to get the customizations for
       * @param   Object data       The data object (optional, used for setting)
       * @return  Object
       */
    , 'dataForSubPanel'

      /**
       * Gets/Sets data object for a given sub panel's control.
       *
       * <code>
       *
       * // Getter
       * $('iframe').coffeeBuilder('dataForSubPanelControl', 'body', 'title', 'padding');
       *
       * // Setter
       * $('iframe').coffeeBuilder('dataForSubPanelControl', 'body', 'title', 'padding', {fadein: 'iscool'});
       *
       * </code>
       *
       * @param   string panel      The name of the panel where the sub panel can be found
       * @param   string sub_panel  The name of the sub panel where the control can be found
       * @param   string control    The name of the control to get the customizations for
       * @param   Object data       The data object (optional, used for setting)
       * @return  Object
       */
    , 'dataForSubPanelControl'
  ],
  
  /**
   * Public API methods for the jQuery.coffeeBuilder plugin.
   *
   * <code>
   *
   * $.coffeeBuilder('iframe', {
   *   width: 332,
   *   design_mode: true,
   *   manifest: {
   *     panels: {
   *       page: {
   *         name: "Page",
   *         customizations: {
   *           background: {
   *             name: "Background",
   *             selectors: {
   *               body: [
   *                 "background"
   *               ]
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * });
   *
   * </code>
   *
   * Valid options:
   * --------------
   *  .design_mode:  (Boolean) If the iframe should be in design mode at startup
   *  .manifest:     (Object)  JSON structure that defines the panels and controls.
   *  .width:        (Number)  A pixel width for the controls
   */  
  utility_apis = {
    
      /**
       * Public API methods for the jQuery.coffeeBuilder.events plugin.
       */
      events: {
          'object': CoffeeBuilderEvents
        , methods: [
              /**
               * Adds or replaces an event in the collection of available events.
               *
               * <code>
               *
               * $.coffeeBuilder.events('add', 'window_resize', function(event, builder, callback){
               *    console.log($(event.currentTarget.document).width());
               * });
               *
               * </code>
               *
               * @param   String name     The name of the event to add.
               * @param   Function event  The event to add
               * @return  void
               */      
              'add'
          ]
      }
      
      /**
       * Public API methods for the jQuery.coffeeBuilder.controls plugin.
       */      
    , controls: {
          'object': CoffeeBuilderControls
        , methods: [
                /**
                 * Adds or replaces a control in the collection of available controls.
                 *
                 * <code>
                 *
                 * $.coffeeBuilder.controls('add', 'size', {
                 *   check: function(manifest) {
                 *     return true;
                 *   }
                 * 
                 * , init: function() {
                 *     this.$element = $('<label class="label_input"><span class="primary_left"></span><input type="number" class="input_right size_field"></label>');
                 *     this.fields.$input = this.$element.find('input');
                 *   }
                 * });
                 *
                 * </code>
                 *
                 * @param   String name     The name of the control to add.
                 * @param   Object control  The control to add
                 * @return  void
                 */
                'add'
          ]
      }
      
        /**
         * Public API methods for the jQuery.coffeeBuilder.notifications plugin.
         */      
      , notifications: {
            'object': CoffeeBuilderNotifications
          , methods: [
                /**
                 * Adds a new obvserver for a given notification type.
                 *
                 * <code>
                 *
                 * var observer = function(selector, property, value){ 
                 *   console.log(selector + '{' + property + ':' + value + '};');
                 * };
                 * $.coffeeBuilder.notifications('addObserver', 'updateCss', observer);
                 *
                 * </code>
                 *
                 * @param   String name        The name of the notification type to observe.
                 * @param   Function observer  The function to call when the notification is posted.
                 * @return  void
                 */          
                'addObserver'
                
                /**
                 * Removes an obvserver from all notifications or a given notification type
                 * if the name parameter is provided.
                 *
                 * <code>
                 *
                 * var observer = function(selector, property, value){ 
                 *   console.log(selector + '{' + property + ':' + value + '};');
                 * };
                 *
                 * // Remove by name
                 * $.coffeeBuilder.notifications('removeObserver', 'updateCss', observer);
                 *
                 * // Remove for all names
                 * $.coffeeBuilder.notifications('removeObserver', observer);
                 *
                 * </code>
                 *
                 * @param   String name        The name of the notification type to remove from.
                 * @param   Function observer  The function to remove.
                 * - OR -
                 * @param   Function observer  The function to remove from all notifications.
                 * 
                 * @return  void
                 */                
              , 'removeObserver'
              
                /**
                 * Post a notification to all registered observers.
                 *
                 * <code>
                 *
                 * var
                 *   selector = 'body',
                 *   property = 'width',
                 *   value = '500px';
                 *
                 * $.coffeeBuilder.notifications('postNotification', 'updateCss', selector, property, value);
                 *
                 * </code>
                 *
                 * @param   String name  The name of the notification type to post.
                 * @return  void
                 */              
              , 'postNotification'
            ]
        }      
  };

/**
 * The jQuery.fn.coffeeBuilder plugin. 
 *
 * See the public API docs at the top of this document for usage information.
 */    
$.fn.coffeeBuilder = function(option){
  var data = this.data('coffeeBuilder');

  // Initialize the plugin
  if(!data) {
    this.data('coffeeBuilder', (data = new CoffeeBuilder(this, option)));
  }

  // Call the api method if necessary
  if(typeof option === 'string') {
    if($.inArray(option, data_api) !== -1) {
      return data[option].apply(data, Array.prototype.slice.call(arguments, 1));
    } 
    
    if($.inArray(option, dom_api) !== -1) {
      data[option].apply(data, Array.prototype.slice.call(arguments, 1));
    } else {
      $.error('Method ' +  option + ' does not exist on jQuery.fn.coffeeBuilder');
    }
  }

  return this;
};

/**
 * The jQuery.coffeeBuilder plugin. 
 *
 * See the public API docs at the top of this document for usage information.
 */
$.coffeeBuilder = function(element){
  var $element = $(element);
  return $element.coffeeBuilder.apply($element, Array.prototype.slice.call(arguments, 1));
};
$.each(utility_apis, function(name, api){
  $.coffeeBuilder[name] = function(method){
    if($.inArray(method, api['methods']) !== -1) {
      return api['object'][method].apply(api['object'], Array.prototype.slice.call(arguments, 1));
    }

    $.error('Method ' +  method + ' does not exist on jQuery.coffeeBuilder.' + name);
  };
});

}(jQuery, window);