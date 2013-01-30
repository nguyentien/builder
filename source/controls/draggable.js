/**
 * Draggable used for inserting an h1 tag with a default text
 */  
CoffeeBuilderControls.add('draggable', {

    /**
     * Given a manifest, checks if this draggable is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */    
    check: function(manifest) {
      return manifest.type === 'draggable';
    }
    
    /**
     * Initializes the draggable by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire draggable
     *
     * @return  void
     */      
  , init: function() {
      var options = this.manifest.options || {};

      this.$element = (this.manifest.element) ? $(this.manifest.element) : $('<div class="drag_tool">').append($('<span>', {'class':'control_text' + ((this.manifest.iconClass) ? ' '+this.manifest.iconClass : '')}).text(this.manifest.name));
      this.$markup = this.manifest.markup ? $(this.manifest.markup) : $('<div/>');
      this.sibling = this.manifest.sibling || '* *';
      this.container = this.manifest.container || '* *';
      this.setTooltip(this.$element);

      // If a draggable doesn't have an ID, get one.
      if ( this.$element.attr('id') === undefined ) {
        this.$element.attr('id', this.name);
      }

      // this.cbInsertOnBeginEvent = this.manifest.cbInsertOnBeginEvent || undefined;
      // this.cbInsertOnEndEvent = this.manifest.cbInsertOnEndEvent || undefined;

      this.$theDraggable = this.$element;
      this.$iframeDoc = this.builder.$contents;

      CoffeeBuilderEvents.get('draggable_initialize')(this.builder.$contents, this.$element, this, options);
      this.$element.click( $.proxy( this.dragClick, this ) );
    }
  , setTooltip: function(element) {
      if( typeof this.manifest.tooltip === 'string' ) {
        element.attr('title',this.manifest.tooltip);
      }
  }
  , dragStart: function (event, ui, $iframeDoc, $theDraggable) {
      return CoffeeBuilderEvents.get('draggable_start')(this.$iframeDoc, this.$theDraggable, event, ui);
  }
  , dragDragging: function (event, ui, $iframeDoc, $theDraggable) {
      return CoffeeBuilderEvents.get('draggable_dragging')(this.$iframeDoc, this.$theDraggable, event, ui);
  }
  , dragStop: function (event, ui, $iframeDoc, $theDraggable) {
      return CoffeeBuilderEvents.get('draggable_stop')(this.$iframeDoc, this.$theDraggable, event, ui);
  }
  , dragClick: function (event, ui, $iframeDoc, $theDraggable, container) {
      return CoffeeBuilderEvents.get('draggable_click')(this.$iframeDoc, this.$theDraggable, container, event);
  }

});
