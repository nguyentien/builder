/**
 * A sub panel holds groups and controls.
 *
 * @param   CoffeeBuilder breakpoint   The parent breakpoint
 * @param   String name                A unique key for the sub panel
 * @param   Object manifest            A JSON manifest that defines the sub panel
 * @return  void
 */
var CoffeeBuilderSubPanel = function(breakpoint, name, manifest) {
  CoffeeBuilderPanel.call(this, breakpoint, name, manifest);
};
CoffeeBuilderSubPanel.prototype = $.extend({}, CoffeeBuilderPanel.prototype, {
    constructor: CoffeeBuilderSubPanel

    /**
     * Builds and adds the DOM elements for a sub panel that will hold groups
     * and controls.
     *
     * @param   CoffeeBuilderPanel panel  The parent panel
     * @return  CoffeeBuilderSubPanel
     */
  , build: function(panel){
      var self = this;

      // Add the title
      self.$title.attr('id', panel.name + '_subpanel_' + self.name + '_title').click(function(){
        panel.activatePanel(self.name);
      });
      panel.$subswitcher.append(self.$title);

      // Add the controls
      self.$controls.attr('id', panel.name + '_subpanel_' + self.name + '_controls');
      this.breakpoint.$controlset.append(self.$controls);

      // Add the fieldset
      self.$fieldset.attr('class', 'sub_panelset');
      self.$controls.append(self.$fieldset);

      if(self.manifest.customizations) {
        $.each(self.manifest.customizations, function(name, manifest){
          self.addControl(name, manifest);
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
      this.enableStates();
      this.refresh();
    }

    /**
     * Deactivates this panel.
     *
     * @return  void
     */
  , deactivate: function() {
      this.$title.removeClass('active');
      this.$controls.removeClass('active');
      this.disableStates();
    }
});
