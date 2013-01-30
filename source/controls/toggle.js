/**
 * Add a grouping of toggleable, hidden controls.
 */
CoffeeBuilderControls.add('toggle', {

	/**
     * Given a manifest, checks if this group is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */
	check: function(manifest) {
		return manifest.type === 'toggle';
	}

	/**
     * Initializes the group by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire toggle group
     *
     * @return  void
     */	
	, init: function() {
		// Answers the question, "Which this is this?"
		var $initThis = this;

		// Create a new control group to manage the individual controls in the toggleable control
		var buttonControlGroup = new CoffeeBuilderControlGroup(this.breakpoint, this.panel, this.name, this.manifest);
		var $toggleGroup = $('<div/>', {'class':'toggleGroup', id: this.name + '_group' }).append( buttonControlGroup.$element );

		this.$element = this.manifest.element || $('<div id="' + this.name + '" class="controls_static">').append($('<span>', {'class':'control_text' + ((this.manifest.iconClass) ? ' '+this.manifest.iconClass : '')}).text(this.manifest.name));

		// Make sure element is a jQuery object
		(!this.$element.jquery) ? this.$element = $(this.$element) : this.$element;

		// Make sure the element has an ID
		if (this.$element.attr('id') === undefined) {
			this.$element.attr('id', this.name);
		}

		// Toggle the control group
		this.$element.on('click', function(e){
			e.preventDefault();
			$initThis.toggleGroup($initThis, $toggleGroup, this);
		});
	}
	, initializeGroup: function($toggleGroup, element) {
		var $panel_buttons = $(".controls_static, .drag_tool");
		var indexOfClickedButton = $panel_buttons.index(element);

		if ( (indexOfClickedButton % 2) === 0 ) {
			indexOfClickedButton = indexOfClickedButton + 1;
			$panel_buttons.eq(indexOfClickedButton).after($toggleGroup);
		} else {
			$panel_buttons.eq(indexOfClickedButton).after($toggleGroup);
		}
	}
	, toggleGroup: function(control, $group, element) {
		if ( $("#"+control.name+"_group").length > 0 ) {
			if ($("#"+control.name+"_group").css('display') === 'none') {
				$("#"+control.name+"_group").fadeIn();
			} else {
				$("#"+control.name+"_group").fadeOut();
			}
		} else {
			control.initializeGroup($group, element);
			$group.fadeIn();
		}
	}
});