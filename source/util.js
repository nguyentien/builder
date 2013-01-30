/**
 * Global utility functions.
 */
var CoffeeBuilderUtil = {
    /**
     * Escape a string for use in regexp.
     *
     * @param  String string  Strings to escape
     * @return string
     */
    escapeRegExp: function(string){
      return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
};
