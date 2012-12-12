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
