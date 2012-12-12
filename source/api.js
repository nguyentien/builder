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
