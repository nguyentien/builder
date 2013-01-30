(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.coffeeBuilderSlider", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "ccbslide",
  handleHtml: "<a class='ui-ccb-slider-handle ui-state-default ui-corner-all' href='#'></a>",

	options: {
		distance: 0,
		step: 1,
		values: [ -20 ],
    maxHandles: 10,
    min: 0,
    canModify: false
	},

	_create: function() {
		var i, handleCount,
			o = this.options,
			existingHandles = this.element.find( ".ui-ccb-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handles = [];

    this._moved = false;
		this._mouseSliding = false;
		this._handleIndex = null;
		this._mouseInit();

		this.element
			.addClass( "ui-ccb-slider" +
				" ui-ccb-slider-horizontal" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" +
				( o.disabled ? " ui-ccb-slider-disabled ui-disabled" : "" ) );

    if ( !$.isArray(o.values) ) {
      o.values = []
    }

    if ( o.values[0] !== -20 ) {
      o.values.unshift(-20);
    }

    if (!this.options.canModify && o.values.length === 1) {
      o.values.push(this.element.width());
    }

		handleCount = o.values.length;
		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( this.handleHtml );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this.handle = this.handles.eq( 0 );
    this.handleWidth = this.handle.width();
    this.activeHandle = null;

		this.handles.filter( "a" )
			.click(function( event ) {
				event.preventDefault();
			})
			.mouseenter(function() {
				if ( !o.disabled ) {
					$( this ).addClass( "ui-state-hover" );
				}
			})
			.mouseleave(function() {
				$( this ).removeClass( "ui-state-hover" );
			});

		this.handles.each(function( i ) {
			$( this ).data( "ui-ccb-slider-handle-index", i );
		});

		this._refreshValue();
    this.handle.hide();

    $(window).bind('resize' + this.eventNamespace, $.proxy(this, '_refreshValue'));
	},

	_destroy: function() {
    $(window).unbind('resize' + this.eventNamespace);
		this.handles.remove();

		this.element
			.removeClass( "ui-ccb-slider" +
				" ui-ccb-slider-horizontal" +
				" ui-ccb-slider-disabled" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" );

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = this._normValueFromMouse({ x: event.pageX, y: event.pageY });
		normValue = position.value;
		distance = this._valueMax() - this._valueMin() + 1;

		this.handles.each(function( i ) {
      if ( i === 0 || (that.options.values[i] > that._valueMax() && this.canModify) ) {
        return;
      }

			var thisDistance = Math.abs( normValue - that.values(i) );
			if ( distance > thisDistance ) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

    if ( distance > this.handleWidth && this.options.canModify ) {
      if(position.x >= this._valueMin()) {
        this._add(event, normValue);
        this._activate(event, this.options.values.length - 1);
      }
      return;
    }

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-ccb-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
      this._slide( event, index, normValue );
		}
		return true;
	},

  _add: function( event, value ) {
    if (!this.options.canModify) {
      return;
    }

    if (this.handles.length > this.options.maxHandles) {
      this._trigger( "addFailed", event, {
        reason: 'maxHit',
        max: this.options.maxHandles
      });
      return;
    }

    var index = (this.options.values.length || 1);
    this.handles = this.handles.add(this.handle.clone(true).show().appendTo(this.element));
    this.values( index ,  value );
    this._trigger( "add", event, {
      index: index,
      value: value
    });
  },

  _remove: function( event, index ) {
    if (!this.options.canModify) {
      return;
    }

    if (this.handles.length <= 1) {
      this._trigger( "removeFailed", event, {
        reason: 'minHit',
        min: 1
      });
      return;
    }

    this.handles = this.handles.not(this.handles.eq(index).remove());
    this.options.values.splice(index,1);

    this._trigger( "remove", event, {
      index: index,
    });
  },

  _activate: function( event, index ) {
    this.activate(index);
    this._trigger( "activated", event, {
      index: index,
      value: this.values( index )
    });
  },

  activate: function( index ) {
    this.activeHandle = index;
    this.handles.removeClass( "ui-ccb-state-active" );
    this.handles.eq(index).addClass( "ui-ccb-state-active" );
  },

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );
    this.handles.eq(this._handleIndex).fadeTo("fast", 0.8);
		this._slide( event, this._handleIndex, normValue.value );
    this._slidePosition = normValue;

		return false;
	},

	_mouseStop: function( event ) {
    var that = this,
      handle = this.handles.eq(this._handleIndex),
      newTop = Math.floor(parseFloat(handle.css('top'))),
      height = Math.ceil(this.element.height() + handle.height()),
      index = this._handleIndex;

		this.handles.removeClass( "ui-state-active" );

		this._mouseSliding = false;
    this._slidePosition = undefined;

		this._stop( event, index );
		this._change( event, index );

    if(newTop > height) {
      handle.animate({
        opacity: 0,
        marginTop: '30px'
      }, "fast", function(){
        that._remove( event, index );
      });
    } else {
      if(this._moved) {
        this._trigger( "move", event, {
          index: index,
          handle: this.handles[ index ],
          value: this.values( index ),
          values: this.values()
        });
      }
      this._activate( event, index );

      handle.animate({
        top: this.handle.css('top'),
        opacity: 1
      }, "fast");
    }

		this._handleIndex = null;
		this._clickOffset = null;
		this._moved = false;

		return false;
	},

	_normValueFromMouse: function( position ) {
    var horizontal = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 ),
      vertical = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );

		return {
		  x: horizontal,
      y: vertical,
      value: this._trimAlignValue(horizontal)
		};
	},

	_start: function( event, index ) {
    $('iframe').each(function() {
        $('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
        .css({
            width: this.offsetWidth+"px", height: this.offsetHeight+"px",
            position: "absolute", opacity: "0.001", zIndex: 1000
        })
        .css($(this).offset())
        .appendTo("body");
    });

		return this._trigger( "start", event, {
      index: index,
			handle: this.handles[ index ],
			value: this.values( index ),
			values: this.values()
		});
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		otherVal = this.values( index ? 0 : 1 );

			newValues = this.values();
			newValues[ index ] = newVal;
			// A slide can be canceled by returning false from the slide callback
			allowed = this._trigger( "slide", event, {
				handle: this.handles[ index ],
				value: newVal,
				values: newValues
			} );
			otherVal = this.values( index ? 0 : 1 );
			if ( allowed !== false ) {
        this._moved = true;
				this.values( index, newVal, true );
			}
	},

	_stop: function( event, index ) {
    $("div.ui-resizable-iframeFix").each(function() { this.parentNode.removeChild(this); });

		this._trigger( "stop", event, {
      index: index,
			handle: this.handles[ index ],
			value: this.values( index ),
			values: this.values()
		});
	},

	_change: function( event, index ) {
		if ( !this._mouseSliding ) {
			this._trigger( "change", event, {
        index: index,
				handle: this.handles[ index ],
				value: this.values( index ),
				values: this.values()
			});
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				return this._values( index );
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		$.Widget.prototype._setOption.apply( this, arguments );

		switch ( key ) {
			case "disabled":
				if ( value ) {
					this.handles.removeClass( "ui-state-hover" );
					this.handles.prop( "disabled", true );
					this.element.addClass( "ui-disabled" );
				} else {
					this.handles.prop( "disabled", false );
					this.element.removeClass( "ui-disabled" );
				}
				break;
			case "value":
				this._refreshValue();
				this._change( null, 0 );
				break;
			case "values":
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				break;
		}
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i+= 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step,
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return parseInt(this.element.width(), 10);
	},

	_refreshValue: function() {
		var that = this,
      origTop = parseFloat(this.handle.css('top')),
      max = that._valueMax(),
      top;

    if ( this._mouseSliding && this._handleIndex && this._slidePosition && this.options.canModify ) {
      if((top = this._slidePosition.y - this.handle.height()) < origTop) {
        top = origTop;
      }

      this.handles.eq(this._handleIndex).css({
        top: top,
      });
    }

    this.handles.each(function( i ) {
      if(i === 0) {
        return;
      }

      var left = that.options.values[i];
      $( this ).stop( 1, 1 ).css( 'left',  left + "px" );
      $( this ).toggle(left <= max);
    });
	}

});

}(jQuery));