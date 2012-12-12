/**
 * A basic stylesheet representation.
 *
 * @return  void
 */
var CoffeeBuilderStylesheet = function(rules) {
  this.rules = {};
};
CoffeeBuilderStylesheet.prototype = {
    constructor: CoffeeBuilderStylesheet

    /**
     * Add a new rule to the stylesheet.
     *
     * @param   string selector  The CSS selector
     * @param   string property  The CSS property
     * @param   string selector  The CSS value
     * @return  void
     */
  , addRule: function(selector, property, value) {
      if(!this.rules.hasOwnProperty(selector)) {
        this.rules[selector] = {};
      }
      
      this.rules[selector][property] = value;
    }

    /**
     * Merges the rules from another stylesheet object with the current one.
     *
     * @param   CoffeeBuilderStylesheet stylesheet  The other stylesheet object
     * @return  void
     */
  , merge: function(stylesheet) {
      $.extend(true, this.rules, stylesheet.getRules());
    }

    /**
     * Removes a rule from the stylesheet.
     *
     * @param   string selector  The CSS selector
     * @param   string property  The CSS property
     * @return  void
     */
  , removeRule: function(selector, property) {
      if(this.rules.hasOwnProperty(selector)) {
        delete this.rules[selector][property];
      }
    }
  
    /**
     * Removes all rules for a given selector.
     *
     * @param   string selector  The CSS selector
     * @return  void
     */
  , removeRulesForSelector: function(selector) {
      delete this.rules[selector];
    }
    
    /**
     * Clear all rules.
     *
     * @return  void
     */
  , clearRules: function() {
      this.rules = {};
    }    

    /**
     * Gets a plain object representation of all rules in the current 
     * stylesheet.
     *
     * @return  Object
     */
  , getRules: function() {
      return this.rules;
    }
  
    /**
     * Gets a string representation of all rules in the current stylesheet.
     *
     * @return  string
     */  
  , toString: function() {
      var styles = '';
      
      $.each(this.rules, function(selector, properties){
        styles += selector + '{' + "\n";
        $.each(properties, function(property, value){
          styles += '\t' + property + ':' + value + ';' + "\n";
        });
        styles += '}' + "\n";
      });
      
      return $.trim(styles);
    }
};
