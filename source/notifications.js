/**
 * Global notifications manager.
 *
 * Use `CoffeeBuilderControls.addObserver()` for adding observers to the
 * notifications system and use `CoffeeBuilderControls.postNotification()`
 * for notifying observers of an event.
 *
 * <code>
 *
 * var observer = function(x, y, width, height){
 *   console.log('New rectangle drawn!');
 *   console.log('x: ' + x);
 *   console.log('y: ' + y);
 *   console.log('width: ' + width);
 *   console.log('height: ' + height);
 * }
 *
 * CoffeeBuilderNotifications.addObserver('drawRect', observer);
 *
 * function drawRect(x, y, width, height, color) {
 *   var canvas = document.getElementById("canvas");
 *   var ctx = canvas.getContext("2d");
 *
 *   if(color){
 *     ctx.fillStyle = color;
 *   }
 *
 *   ctx.fillRect (x, y, width, height);
 *   CoffeeBuilderNotifications.postNotification('drawRect', x, y, width, height);
 * }
 *
 * drawRect(10, 10, 200, 200);
 * drawRect(25, 25, 170, 170, "rgb(200,0,0)");
 *
 * CoffeeBuilderNotifications.removeObserver(observer);
 *
 * drawRect(50, 50, 120, 120, "rgb(0,0,200)");
 *
 * </code>
 */
var CoffeeBuilderNotifications = {
    observerCollection: {}

    /**
     * Adds a new obvserver for a given notification type.
     *
     * @param   String name        The name of the notification type to observe.
     * @param   Function observer  The function to call when the notification is posted.
     * @return  void
     */
  , addObserver: function(name, observer){
      if(!$.isFunction(observer)) {
        $.error('observer must be a function');
      }

      if(!$.isArray(this.observerCollection[name])) {
        this.observerCollection[name] = [];
      }

      this.observerCollection[name].push(observer);
    }

    /**
     * Removes an obvserver from all notifications or a given notification type
     * if the name parameter is provided.
     *
     * @param   String name        The name of the notification type to remove from.
     * @param   Function observer  The function to remove.
     * - OR -
     * @param   Function observer  The function to remove from all notifications.
     *
     * @return  void
     */
  , removeObserver: function(name, observer){
      if(arguments.length === 1) {
        var self = this;

        observer = name;
        $.each(this.observerCollection, function(name){
          self.removeObserver(name, observer);
        });

        return;
      }

      if(!$.isArray(this.observerCollection[name])) {
        $.error('invalid observer: ' + name);
      }

      this.observerCollection[name] = $.grep(this.observerCollection[name], function(value){
        return value !== observer;
      });
    }

    /**
     * Post a notification to all registered observers.
     *
     * @param   String name  The name of the notification type to post.
     * @return  void
     */
  , postNotification: function(name){
      if(!$.isArray(this.observerCollection[name])) {
        return;
      }

      var notification_arguments = Array.prototype.slice.call(arguments, 1);

      $.each(this.observerCollection[name], function(index, observer){
        observer.apply(null, notification_arguments);
      });
    }
};
