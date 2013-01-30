/**
 * A breakpoint holds panels, sub panels, groups, and controls.
 *
 * @param   CoffeeBuilderBuilder  The parent builder
 * @param   String name           A unique key for the panel
 * @param   Object manifest       A JSON manifest that defines the panel
 * @return  void
 */
var CoffeeBuilderBreakpoint = function(builder, name, manifest) {
  this.builder = builder;
  this.manifest = manifest;
  this.name = name;

  // Panels
  this.panels = new CoffeeBuilderCollection();
  this.current = undefined;

  // Controls
  this.$controlset = $('<form id="controlset" class="tabsform" method="get" action=""></form>');
  this.$switcher = $('<ul id="control_switcher">');
  this.$prev = $('<div id="control_prev">').click($.proxy(this, 'prev'));
  this.$next = $('<div id="control_next">').click($.proxy(this, 'next'));

  // Build
  this.$styles = $();
  this.build();
};

CoffeeBuilderBreakpoint.prototype = {
    constructor: CoffeeBuilderBreakpoint

    /**
     * Builds and adds the DOM elements for the UI that will control the CSS
     * for this breakpoint.
     *
     * @return  CoffeeBuilderBreakpoint
     */
  , build: function() {
      if(this.name === 'default' || /^\d+$/.test(this.name)) {
        this.$styles = $('<style>').attr('media', this.getStyleMedia());
        this.builder.addStylesheet(this.$styles);
      } else {
        $.error('`CoffeeBuilderBreakpoint` name must be \'default\' or a natural number greater than zero.');
      }

      this.addPanels();
      this.data(this.manifest.data || {});

      return this;
    }

    /**
     * Activates this breakpoint so that customizations can be made.
     *
     * @return  void
     */
  , activate: function() {
      var self = this;

      $.each(['$next','$prev','$switcher','$controlset'], function(index, name){
        self.builder.$controls.append(self[name]);
      });
    }

    /**
     * Deactivates this breakpoint so that customizations can be made to
     * another breakpoint.
     *
     * @return  void
     */
  , deactivate: function() {
      var self = this;

      $.each(['$next','$prev','$switcher','$controlset'], function(index, name){
        self[name].detach();
      });
    }

    /**
     * Moves this breakpoint to a new pixel location.
     *
     * NOTE: You can not move the default breakpoint.
     *
     * @param   string name  The name (pixel position) of the new breakpoint.
     * @return  void
     */
  , move: function(name) {
      if(this.name === 'default') {
        $.error('`CoffeeBuilderBreakpoint` default can not be moved.');
      }

      if(!/^\d+$/.test(name)) {
        $.error('`CoffeeBuilderBreakpoint` name must be a natural number greater than zero.');
      }

      this.name = name;
      this.$styles.attr('media', this.getStyleMedia()).detach();
      this.builder.addStylesheet(this.$styles);
    }

    /**
     * Gets the media attribute value for this breakpoint.
     *
     * @return  string
     */
  , getStyleMedia: function() {
      var media = 'screen';

      if(this.name !== 'default') {
        media += ' and (max-width: ' + this.name + 'px)';
      }

      return media;
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
     * Triggers the `refresh()` event for all controls.
     *
     * @return  void
     */
  , refresh: function() {
      $.each(this.panels.items, function(panel_name, panel){
        panel.refresh();
      });
    }

    /**
     * Returns a stylesheet representing all current customizations.
     *
     * @param   boolean full  If the full stylesheet (not just customizations) should be returned.
     * @return  string
     */
  , getStyleSheet: function(full) {
      var stylesheet = new CoffeeBuilderStylesheet(this);

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
     * Adds a new panel to the UI.
     *
     * @param   String name      A unique key to identify the panel
     * @param   Object manifest  A JSON manifest that defines the panel
     * @return  void
     */
  , addPanel: function(name, manifest) {
      this.panels.add(name, (new CoffeeBuilderPanel(this, name, manifest)).build());

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
      this.panels.get(panel).addSubPanel(sub_panel, manifest);
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
      this.panels.get(panel).addControl(name, manifest);
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
      this.panels.get(panel).addControlToPanel(sub_panel, name, manifest);
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
        $.error('`CoffeeBuilderBreakpoint.addPanels` should only be used when no panels exist');
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
     * Removes this breakpoint from the DOM.
     *
     * @return  void
     */
  , destroy: function(){
      var self = this;

      $.each(['$controlset','$switcher','$prev','$next','$styles'], function(index, name){
        self[name].remove();
      });
      $.each(self.panels.items, function(panel_name, panel) {
        self.removePanel(panel_name);
      });
    }

    /**
     * Removes a sub panel given the panel and sub panel name/indexes.
     *
     * @param   String panel      A unique key that identifies the panel
     * @param   String sub_panel  A unique key that identifies the sub_panel
     * @return  void
     */
  , removeSubPanel: function(panel, sub_panel) {
      this.panels.get(panel).removePanel(sub_panel);
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
};