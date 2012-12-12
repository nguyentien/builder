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
