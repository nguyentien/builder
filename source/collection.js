/**
 * A collection is a generic object that has properties which can be referenced
 * by a named key or numeric index.
 *
 * @return  void
 */
var CoffeeBuilderCollection = function() {
  this.length = 0;
  this.keys = [];
  this.items = {};
};
CoffeeBuilderCollection.prototype = {
    constructor: CoffeeBuilderCollection
    
    /**
     * Adds a new item to the collection.
     *
     * @param   String key       A unique key to identify the item
     * @param   Object item      The object to store in the collection
     * @param   Number position  Optional position for element in collection
     * @return  Object
     */
  , add: function(key, item, position) {
      if($.inArray(key, this.keys) !== -1) {
        $.error('Index already defined: ' + key);
      }
      
      if(position === undefined) {
        position = this.length;
      }
      
      if(position > this.length) {
        $.error('Position is larger than collection length: ' + position);
      }
    
      if(position === this.length) {
        this.keys.push(key);
      } else {
        this.keys.splice(position, 0, key);        
      }     

      this.items[key] = item;
      this.length++;

      return this.items[key];
    }
    
    /**
     * Removes an item from the collection.
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */
  , remove: function(key) {
      var
        index = this.getIndex(key),
        deleted = this.items[index.named];

      this.keys.splice(index.numeric,1);
      delete this.items[index.named];
      this.length--;
      
      return deleted;
    }
    
    /**
     * Gets an item from the collection.
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */    
  , get: function(key) {
      return this.items[this.getIndex(key).named];
    }
    
    /**
     * Given a string key or numeric index, returns an object that holds both
     * the named and numeric equivalent indexes for the collection.
     *
     * Return format:
     * --------------
     * {
     *   numeric: 5, 
     *   named: 'myindex'
     * }
     *
     * @param   String|Number key  A string key or numeric index to idenfity the item.
     * @return  Object
     */
  , getIndex: function(key) {
      return typeof key === 'number' ? { numeric: key, named: this.getKeyForIndex(key) } : { numeric: this.getIndexForKey(key), named: key  };
    }
    
    /**
     * Gets the string equivalent of a provided numeric index.
     *
     * @param   Number index  A numeric index to get the string key for.
     * @return  String
     */    
  , getKeyForIndex: function(index) {
      if(typeof index === 'number' && index === ~~index && index < this.length) {
        return this.keys[index];
      }
      
      $.error('Invalid index provided: ' + index);    
    }
    
    /**
     * Gets the numeric equivalent of a provided string key.
     *
     * @param   String key  A string key to get the numeric index for.
     * @return  String
     */    
  , getIndexForKey: function(key) {
      var index = $.inArray(key, this.keys);
      if(index !== -1) {
        return index;
      }

      $.error('Invalid index provided: ' + key);
    }
};