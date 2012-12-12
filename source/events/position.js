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
