/**
 * Global collection of all available events.
 *
 * Use `CoffeeBuilderEvents.add()` for adding events and
 * `CoffeeBuilderEvents.get()` for retrieving events.   
 */
var CoffeeBuilderEvents = {
    events: {}
    
    /**
     * Adds or replaces an event in the collection of available events.
     *
     * @param   String name     The name of the event to add.
     * @param   Function event  The event to add
     * @return  void
     */      
  , add: function(name, event) {
      if(!$.isFunction(event)) {
        $.error('Invalid event provided');
      }
      this.events[name] = event;
    }

    /**
     * Gets an event given the event's name.
     *
     * @param   String name  The name of the event to get.
     * @return  void
     */      
  , get: function(name) {
      if(!$.isFunction(this.events[name])) {
        $.error('Event doesn\'t exist: ' + name);
      }
      return this.events[name];
    }
};
