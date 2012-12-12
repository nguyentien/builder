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

    $.each(['style','width','color'], function(index, field){

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
  
  $.each(['style','width','color'], function(index, field){

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
