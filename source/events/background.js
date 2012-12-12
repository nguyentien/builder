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
