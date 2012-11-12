/**
 * CoffeeCup Software: CoffeeCup UI Builder
 *
 * This file contains a javascript library for generating dynamic UI's which 
 * can edit CSS/HTML that is in an iframe.
 *
 * @author     Jeff Welch <jw@coffeecup.com>
 * @category   Empire
 * @package    Public
 * @copyright  Copyright (c) 2006-2012 CoffeeCup Software, Inc. (http://www.coffeecup.com/)
 * @version    $Id$
 */


   /**
   * Initializes width and height element
   * controls in the group don't match the first control.
   * 
   * @param   CoffeeBuilderControl control  The text control
   * @return  void
   */  
 var builder;
 var deleted_message = "Delete successfully";

 !function (window) {

     'use strict';

     /**
     * Initializes width and height element
     * controls in the group don't match the first control.
     * 
     * @param   CoffeeBuilderControl control  The text control
     * @return  void
     */
     CoffeeBuilderControls.add('menusize', {

         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'menusize';
         }
    , init: function () {


        var options = this.manifest.options || [],
          menusize =  'none',
          menusizeopt = '',
          width = this.getCss('width') || '33px',
          height = this.getCss('height') || '16px',
          $text = this.getElement();
        $.each({
            'Custom': "none",
            'S': "60_15",
            'M': "80_20",
            'L': "120_30",
            'XL': "160_50"
        }, function (name, value) {
            menusizeopt += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        this.$element = $(
        '<div class="control_group text_group">' +
        '<label class="label_input"><span class="primary_left"></span><select class="combo_right combo_size_menu">'+menusizeopt+'</select></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><input type="spin" max="1000" min="0" class="input_right sizerm size_width_menu"></label>' +
        '<label class="label_grouped"><input type="spin" max="1000" min="0" class="input_right sizerm size_height_menu"></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><span class="sizer_label">Width</span></label>' +
        '<label class="label_grouped"><span class="sizer_label">Height</span></label>' +
        '</div>');



        // Set the fields
        this.fields = {
            width: this.$element.find('input.size_width_menu').val(parseInt(width)),
            height: this.$element.find('input.size_height_menu').val(parseInt(height)),
            menusize: this.$element.find('select.combo_size_menu').val(menusize)
        };

        // Set the title
        this.setTitle(this.$element.find('span:first'));

        // Add events
        if ($text.length) {
            this.fields.menusize.change($.proxy(this.fontMenuSizeChange, this));
            this.fields.menusize.change($.proxy(this.fontMenuSizeChangeHeight, this));
            // Otherwise, disable controls
        } else {
            this.fields.menusize.change($.proxy(this.fontMenuSizeChange, this));
            this.fields.menusize.change($.proxy(this.fontMenuSizeChangeHeight, this));            
        }


        //CoffeeBuilderEvents.getEvent('initialize_sizers')(this.fields.width.change($.proxy(self.widthChange, self)).keyup($.proxy(self.widthKeyup, self)));
        CoffeeBuilderEvents.get('initialize_sizers')(
            this.fields.height.change($.proxy(this.menuSizeHeightChange, this)).keyup($.proxy(this.menuSizeHeightKeyup, this))
          );
        // Add events

        CoffeeBuilderEvents.get('initialize_sizers')(
            this.fields.width.change($.proxy(this.menuSizeWidthChange, this)).keyup($.proxy(this.menuSizeWidthKeyup, this))
          );


        // Otherwise, disable controls

    }

         /**
         * Event listener (proxy) for the width of menu input field's `change()` event.
         *
         * @param  jQuery.Event event  The width input `change()` event.
         * @param  boolean
         */
    , menuSizeWidthChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_change')(event, this, 'width');
    }
         /**
         * Event listener (proxy) for the width of menu select size field's `change()` event.
         *
         * @param  jQuery.Event event  The width input `change()` event.
         * @param  boolean
         */
      , fontMenuSizeChange: function (event) {
          return CoffeeBuilderEvents.get('select_change_menu')(event, this, 'width');
      }
         /**
         * Event listener (proxy) for the height of menu select size field's `change()` event.
         *
         * @param  jQuery.Event event  The height input `change()` event.
         * @param  boolean
         */
       , fontMenuSizeChangeHeight: function (event) {



           return CoffeeBuilderEvents.get('select_change_menu')(event, this, 'height');
       }
         /**
         * Event listener (proxy) for the width of menu input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The width input `change()` event.
         * @param  boolean
         */
    , menuSizeWidthKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'width');
    }
         /**
         * Event listener (proxy) for the height of menu input field's `change()` event.
         *
         * @param  jQuery.Event event  The height input `change()` event.
         * @param  boolean
         */
    , menuSizeHeightChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_change')(event, this, 'height');
    }
         /**
         * Event listener (proxy) for the height of menu input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The height input `change()` event.
         * @param  boolean
         */
    , menuSizeHeightKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'height');
    }

     });



     /**
     * Initializes linefor group control
     * controls in the group don't match the first control.
     * 
     * @param   CoffeeBuilderControl control  The text control
     * @return  void
     */
     CoffeeBuilderControls.add('linegroup', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'linegroup';
         }


         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        this.$element = $(
                '<div class=".control_group_line">' +

                '<label class="label_input"><span class="primary_left_new "></span>&nbsp;</label>' +

                '<label class="label_grouped_line"></label>' +
                '</div>');
        //set title before line of group
        this.setTitle(this.$element.find('span:first'));
    }
     });


     /**
     * Control texarea
     */
     CoffeeBuilderControls.add('textarea', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return manifest.type === 'textarea';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        var 
          options = this.manifest.options || [],

          width = this.getCss('width') || '33px',
          height = this.getCss('height') || '16px',
          $text = this.getElement();
        // Fonts list


        // Set the element
        this.$element = $(
        '<div class="control_group text_group">' +
          ' <label class="label_input"><span class="primary_left"></span><textarea  class="label_grouped_main description_text textarea_right" style="width:170px" ></textarea ></label>' +
          '</div>'
              );
        // Core elements
        this.fields = {
            input: this.$element.find('textarea.description_text'),
            width: this.$element.find('input.size_width').val(parseInt(width)),
            height: this.$element.find('input.size_height').val(parseInt(height))

        };

        // Set the title
        this.setTitle(this.$element.find('span:first'));

        // Initialize the color picker


        // Add events
        if ($text.length) {

            this.fields.input.val($text.text()).change($.proxy(this.textChange, this)).keyup($.proxy(this.textChange, this));


            // Otherwise, disable controls
        } else {
            $.each(this.fields, function (field_name, field) {
                field.attr('disabled', true);
            });
        }
    }
         /**
         * Event listener (proxy) for the text input field's `change()` event.
         *
         * @param  jQuery.Event event  The input `change()` event.
         * @param  boolean
         */

    , textChange: function (event) {
        return CoffeeBuilderEvents.get('text_change')(event, this);
    }

         /**
         * Event listener (proxy) for the font-size input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The font-size input `keyup()` event.
         * @param  boolean
         */

     });

     CoffeeBuilderControls.add('controlsize', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return manifest.type === 'controlsize';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        var 
          options = this.manifest.options || [],

          width = this.getCss('width') || '33px',
          height = this.getCss('height') || '16px';
        // Fonts list


        // Set the element
        this.$element = $(
        '<div class="control_group text_group">' +
          '<label class="label_grouped_main"><span class="primary_left"></span><input type="spin"  min="0" class="input_right sizerm size_width"></label>' +
          '<label class="label_grouped"><input type="spin" min="0" class="input_right sizerm size_height"></label>' +
          '<label class="label_grouped_main"><span class="primary_left"></span><span class="sizer_label">Width</span></label>' +
          '<label class="label_grouped"><span class="sizer_label">Height</span></label>' +
          '</div>'
              );
        // Set the title
        this.setTitle(this.$element.find('span:first'));
        // Core elements
        this.fields = {
            input: this.$element.find('textarea.description_text'),
            width: this.$element.find('input.size_width').val(parseInt(width)),
            height: this.$element.find('input.size_height').val(parseInt(height))

        };

        // Set the title


        // Add events

        CoffeeBuilderEvents.get('initialize_sizers')(
                  this.fields.height.change($.proxy(this.menuHeightChange, this)).keyup($.proxy(this.fontHeightKeyup, this))
           );

        CoffeeBuilderEvents.get('initialize_sizers')(
                  this.fields.width.change($.proxy(this.menuWidthChange, this)).keyup($.proxy(this.fontWidthKeyup, this))
           );
    }

         /**
         * Event listener (proxy) for the font-size input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The width input `keyup()` event.
         * @param  boolean
         */
    , fontWidthKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'width');
    }

         /**
         * Event listener (proxy) for the font-family select field's `change()` event.
         *
         * @param  jQuery.Event event  The height input `keyup()` event.
         * @param  boolean
         */
    , fontHeightKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'height');
    }
    , menuWidthChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_change')(event, this, 'width');
    }
    , menuHeightChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_change')(event, this, 'height');
    }

     });


     CoffeeBuilderControls.add('Link', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return manifest.type === 'link';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        var 
          options = this.manifest.options || [],
        //          fonts = '',
          link = '',
        //          family = this.getCss('font-family') || 'Helvetica, Arial, sans-serif',
        //          size = this.getCss('font-size') || '13px',
        //          color = this.getCss('color') || '#000000',
          $text = this.getElement();
        // Fonts list


        // Set the element
        this.$element = $(
          ' <label class="label_input"><span class="primary_left"></span><input  class="input_right description_text" ></input ></label>'
        );

        // Core elements
        this.fields = {
            //          family: this.$element.find('select').val(family),
            //          size: this.$element.find('input.size_field').val(parseInt(size)),
            input: this.$element.find('input.description_text')
        };

        // Set the title
        this.setTitle(this.$element.find('span:first'));

        // Initialize the color picker


        // Add events
        if ($text.length) {

            this.fields.input.val($text.attr('href')).change($.proxy(this.linkChange, this)).keyup($.proxy(this.linkChange, this));
            //          this.fields.family.change($.proxy(this.fontFamilyChange, this));

            // Otherwise, disable controls
        } else {
            $.each(this.fields, function (field_name, field) {
                field.attr('disabled', true);
            });
        }
    }
         /**
         * Event listener (proxy) for the text input field's `change()` event.
         *
         * @param  jQuery.Event event  The input `change()` event.
         * @param  boolean
         */
    , linkChange: function (event) {
        return CoffeeBuilderEvents.get('link_change')(event, this);

    }
     });
     /**
     * control used for managing background properties width transparent checkbox
     */

     CoffeeBuilderControls.add('background-transparent', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'background-color';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        var self = this,
        bgcolor = self.getCss('background-color') || '#000000',
        shadow = self.getCss();

        self.$element = $('<div class="control_group text_group">' +
        		'<label class="label_grouped"><span class="primary_left"></span><input type="text" class="color_right color_picker bg_color"></label>' +
        		'<label class="label_grouped"><span class="primary_left section_head"><input type="checkbox" class="bg_checkbox" > Transparent</span></label>' +
        		'<div>');
        this.fields.bgcolor = this.$element.find('input.color_picker').val(bgcolor);

        $.each(['checkbox', 'color'], function (index, name) {
            self.fields[name] = self.$element.find('input.bg_' + name);
        });

        // Set the title
        self.setTitle(self.$element.find('span:first'));
        self.fields.bgcolor = self.$element.find('input.color_picker').val(bgcolor);

        // Add events
        self.fields.checkbox.change($.proxy(self.checkboxChange, self));
        CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.bgcolor, undefined, {}, $.proxy(self.checkboxChange, self));
    }

      , checkboxChange: function (event) {
          return CoffeeBuilderEvents.get('bg_checkbox')(this);
      }
     });

     /**
     * control use for manaping position of background 
     */
     CoffeeBuilderControls.add('Repeat', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'background-repeat';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {

        var combotop = '',
    		repeat = 'repeat',
    		repeatx = 'repeat-x',
    		repeaty = 'repeat-y',
    		repeatnone = 'no-repeat',
    		spinleft = '',
    		spintop = '',
    		comboleft = '';
        $.each({
            'Top': "top",
            'Center': "center",
            'Bottom': "bottom"
        }, function (name, value) {
            combotop += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        $.each({
            'Left': "left",
            'Center': "center",
            'Right': "right"
        }, function (name, value) {
            comboleft += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        this.$element = $(
        '<div class="control_group text_group">' +
        '<label class="label_input_grouped"><span class="primary_left"></span></label>' +
        ' <label class="label_grouped_main"><button class="buttonreapt icon-norepeat" type="button" ></button></label>' +
        ' <label class="label_grouped"><button class="buttonreapt icon-repeaty" type="button" ></button></label>' +
        ' <label class="label_grouped"><button class="buttonreapt icon-repeatx" type="button" ></button></label>' +
        ' <label class="label_grouped"><button class="buttonreapt icon-repeatall" type="button" ></button></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field left">' + comboleft + '</select></label>' +
        '<label class="label_grouped"><input type="spin" max="100" min="0" class="input_right sizerm left"></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field top">' + combotop + '</select></label>' +
        '<label class="label_grouped"><input type="spin" max="100" min="0" class="input_right sizerm top"></label>' +
        '</div>');
        this.fields = {
            repeatnone: this.$element.find('button.icon-norepeat').val(repeatnone),
            repeatx: this.$element.find('button.icon-repeatx').val(repeatx),
            repeaty: this.$element.find('button.icon-repeaty').val(repeaty),
            repeat: this.$element.find('button.icon-repeatall').val(repeat),
            combotop: this.$element.find('select.top').val(combotop),
            comboleft: this.$element.find('select.left').val(comboleft),
            spinleft: this.$element.find('input.left').val(spinleft),
            spintop: this.$element.find('input.top').val(spintop)

        };
        this.setTitle(this.$element.find('span:first'));
        this.fields.repeatnone.click($.proxy(this.repeatChange, this));
        this.fields.repeatx.click($.proxy(this.repeatChange, this));
        this.fields.repeaty.click($.proxy(this.repeatChange, this));
        this.fields.repeat.click($.proxy(this.repeatChange, this));
        this.fields.combotop.change($.proxy(this.changePosition, this));
        this.fields.comboleft.change($.proxy(this.changePosition, this));
        this.fields.spintop.change($.proxy(this.changePosition, this)).keyup($.proxy(this.widthKeyup, this));
        this.fields.spinleft.change($.proxy(this.changePosition, this)).keyup($.proxy(this.widthKeyup, this));
    }, repeatChange: function (event) {
        return CoffeeBuilderEvents.get('repeat_change')(event, this);
    }, changePosition: function (event) {
        return CoffeeBuilderEvents.get('repeat_position')(this, 'background-position');
    }, widthKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'background-position', $.proxy(this.changePosition, this));
    }
     });

     /**
     * control use for control Menu of tab Button
     */
     CoffeeBuilderControls.add('Typeofbutton', {

         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'Typeofbutton';
         }

    , init: function () {

        var Buttonsize = '',
    		alginleft = this.getCss('text-align')||'center',
    		algintop = '',
    		fonts = '',
    		cbvertical ='middle',
    		spinver='',
            options = this.manifest.options || [],
            family = this.getCss('font-family') || 'Helvetica, Arial, sans-serif',
            size = this.getCss('font-size') || '13px',
            color = this.getCss('color') || '#000000',   
            align = this.getCss('text-algin')||'center',
            spinleft = '',
            $text = this.getElement();
        // Fonts list
        $.each({
            'Arial': "Arial, Helvetica, sans-serif",
            'Baskerville': "Baskerville, 'Times New Roman', Times, serif",
            'Cambria': "Cambria, Georgia, Times, 'Times New Roman', serif",
            'Century Gothic': "'Century Gothic', 'Apple Gothic', sans-serif",
            'Consolas': "Consolas, 'Lucida Console', Monaco, monospace",
            'Copperplate Light': "'Copperplate Light', 'Copperplate Gothic Light', serif",
            'Courier New': "'Courier New', Courier, monospace",
            'Franklin Gothic Medium': "'Franklin Gothic Medium', 'Arial Narrow Bold', Arial, sans-serif",
            'Futura': "Futura, 'Century Gothic', AppleGothic, sans-serif",
            'Garamond': "Garamond, 'Hoefler Text', 'Times New Roman', Times, serif",
            'Geneva': "Geneva, 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', Verdana, sans-serif",
            'Georgia': "Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif",
            'Gill Sans': "'Gill Sans', Calibri, 'Trebuchet MS', sans-serif",
            'Helvetica': "Helvetica, Arial, sans-serif",
            'Impact': "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            'Lucida Sans': "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif",
            'Palatino': "Palatino, 'Palatino Linotype', Georgia, Times, 'Times New Roman', serif",
            'Tahoma': "Tahoma, Geneva, Verdana",
            'Times': "Times, 'Times New Roman', Georgia, serif",
            'Trebuchet MS': "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            'Verdana': "Verdana, Geneva, Tahoma, sans-serif"
        }, function (name, value) {
            fonts += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        $.each({
            'Left': "left",
            'Center': "center",
            'Right': "right"
        }, function (name, value) {
            alginleft += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        //vertical list
        $.each({
            'Top':'top',
            'Middle':'middle',
            'Bottom':'bottom'       
        }, function (name, value) {
        	algintop += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        this.$element = $(
        '<div id="button_state_type_group" class="control_group text_group">' +
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field fontflied">' + fonts + '</select></label>' +
        '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm sizefield  "></label>' +
        ' <label class="label_grouped"><input type="text" class="color_right color_picker fcolor"></label>' +
        '<label class="label_grouped_main"><span class="primary_left"><b>Align</b>:</span><select class="combo_right leftal combo_font select_field">' + alginleft + '</select></label>' +
        '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm spinleft "></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font comboxofver select_field">' +algintop  + '</select></label>' +
        '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm spinvertical"></label>' +
        '</div>');
        this.fields = {
            family: this.$element.find('select.fontflied').val(family),
            size: this.$element.find('input.sizefield').val(parseInt(size)),
            color: this.$element.find('input.color_picker').val(color),
            align: this.$element.find('select.leftal').val(align),
            spinleft :this.$element.find('input.spinleft').val(spinleft),
        	cbvertical:this.$element.find('select.comboxofver').val(cbvertical),
        	spinver:this.$element.find('input.spinvertical').val(spinver)
        };

        // Set the title
        this.setTitle(this.$element.find('span:eq(0)'));
        // Initialize the color picker
        CoffeeBuilderEvents.get('colorpicker_initialize')(this, this.fields.color, 'color');
        // Add events 
        if ($text.length) {
            this.fields.family.change($.proxy(this.fontFamilyChange, this));
            this.fields.align.change($.proxy(this.spinChange,this));
            this.fields.spinleft.change($.proxy(this.spinChange,this)).keyup($.proxy(this.spinalignKeyup, this));
            this.fields.cbvertical.change($.proxy(this.verticalChange,this));
            this.fields.spinver.change($.proxy(this.verticalChange,this)).keyup($.proxy(this.spinverKeyup, this));
            CoffeeBuilderEvents.get('initialize_sizers')(
                  this.fields.size.change($.proxy(this.fontSizeChange, this)).keyup($.proxy(this.fontSizeKeyup, this))
            );
            
            this.temp = this.manifest.selectors;

            // Otherwise, disable controls
        } else {
            $.each(this.fields, function (field_name, field) {
                field.attr('disabled', true);
            });
        }
    }

         /**
         * Event listener (proxy) for the font-size input field's `change()` event.
         *
         * @param  jQuery.Event event  The font-size input `change()` event.
         * @param  boolean
         */
          , fontSizeChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
        	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
        	  } else {
        	  	this.manifest.selectors = this.temp;
        	  }
              return CoffeeBuilderEvents.get('sizer_change')(event, this, 'font-size');
          }
          , alignChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
              return CoffeeBuilderEvents.get('align_change')(event, this, 'text-align');
          }
          , spinChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
              return CoffeeBuilderEvents.get('spinalign_change')(event, this, 'text-align');
          },
          spinalignKeyup:function (event){
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
        	  return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'text-align',$.proxy(this.spinChange, this));
          }
          , textDecorationChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'text-decoration');
          }
          , textTransformChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'text-transform');
          }, verticalChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
              return CoffeeBuilderEvents.get('vertical_change')(event, this, 'vertical-align');
          },
          spinverKeyup:function (event){
        	  if (CoffeeBuilderControl.apply.regular.type) {
          	  	this.manifest.selectors = getAllMenuButton('Typeofbutton');
          	  } else {
          	  	this.manifest.selectors = this.temp;
          	  }
        	  return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'vertical-align',$.proxy(this.verticalChange, this));
          }

         /**
         * Event listener (proxy) for the font-size input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The font-size input `keyup()` event.
         * @param  boolean
         */
          , fontSizeKeyup: function (event) {
              return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'font-size');
          }

         /**
         * Event listener (proxy) for the font-family select field's `change()` event.
         *
         * @param  jQuery.Event event  The input `keyup()` event.
         * @param  boolean
         */
          , fontFamilyChange: function (event) {
              return CoffeeBuilderEvents.get('select_change')(event, this, 'font-family');
          }

         /**
         * Event listener (proxy) for the text input field's `change()` event.
         *
         * @param  jQuery.Event event  The input `change()` event.
         * @param  boolean
         */
          , textChange: function (event) {
              return CoffeeBuilderEvents.get('text_change')(event, this);
          }
     });
     /**
     * control Icon position
     */
     CoffeeBuilderControls.add('Iconbutton-position', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'Iconbutton-position';
         }

         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {

        var Position = '',
        	spinleft='',
        	spinright='',
        	spincustom='';
        	
        $.each({
            'Custom': "None",
            'Left': "left",
            'Right': "right"
        }, function (name, value) {
            Position += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });

        this.$element = $(
        '<div class="control_group text_group">' +
        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field Position hover_position">' + Position + '</select></label>' +
        '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm xfiled left left_hover"></label>' +
        '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm yfiled top top_hover"></label>' +
         '<span class="sizer_label">X</span>' +
        '<span class="sizer_label">Y</span>' +
        '</div>');
        this.setTitle(this.$element.find('span:first'));
        this.fields = {
        		Position: this.$element.find('select.Position').val(Position),
        		spinleft:this.$element.find('input.left').val(spinleft),
        		spinright:this.$element.find('input.top').val(spinright)
        		
        };
        this.fields.Position.change($.proxy(this.changePosition, this));
        this.fields.spinleft.change($.proxy(this.changePositionX, this)).keyup($.proxy(this.widthKeyupX, this));
        this.fields.spinright.change($.proxy(this.changePositionY, this)).keyup($.proxy(this.widthKeyupY, this));    
    },
	changePosition:function(event){
  	  return CoffeeBuilderEvents.get('positionXY')(this,'background-position');
    	},
    	changePositionX:function(event){
    	  	  return CoffeeBuilderEvents.get('positionX')(this,'background-position');
    	    	},
    	    	changePositionY:function(event){
    	    	  	  return CoffeeBuilderEvents.get('positionY')(this,'background-position');
    	    	    	},
    	widthKeyupX: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'background-position', $.proxy(this.changePositionX, this));
    },
    widthKeyupY: function(event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'background-position', $.proxy(this.changePositionY, this));
      }
     });
     /**
     * control for manaping button size of menu size
     */

     CoffeeBuilderControls.add('buttonsize', {

         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'buttonsize';
         }

    , init: function () {

        var buttonsize = '',
    		width = this.getCss('width') || '33px',
    		height = this.getCss('height') || '16px';
        $.each({
            'Percentage of Main Menu': "%",
            'Custom': "px"
        }, function (name, value) {
            buttonsize += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        this.$element = $(
        '<div class="control_group text_group">' +
        '<label class="label_input"><span class="primary_left"></span><select class="combo_right  select_field">' + buttonsize + '</select></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><input type="spin" max="2000" min="0" class="input_right sizerm width"></label>' +
        '<label class="label_grouped"><input type="spin" max="2000" min="0" class="input_right sizerm height"></label>' +
        '<label class="label_grouped_main"><span class="primary_left"></span><span class="sizer_label">Width</span></label>' +
        '<label class="label_grouped"><span class="sizer_label">Height</span></label>' +
        '</div>');
        this.setTitle(this.$element.find('span:first'));
        this.fields = {
            width: this.$element.find('input.width').val(parseInt(width)),
            height: this.$element.find('input.height').val(parseInt(height)),
            buttonsize: this.$element.find('select').val(buttonsize)
        };

        CoffeeBuilderEvents.get('initialize_sizers')(this.fields.width.change($.proxy(this.widthChange, this)).keyup($.proxy(this.widthKeyup, this)));
        CoffeeBuilderEvents.get('initialize_sizers')(this.fields.height.change($.proxy(this.heightChange, this)).keyup($.proxy(this.heightKeyup, this)));

    }, widthChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_changeofcombobox')(event, this, 'width');
    }

         /**
         * Event listener (proxy) for a width input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The input `keyup()` event.
         * @param  boolean
         */
    , widthKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyupcombobox')(event, this, 'width');
    }
    , heightChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_changeofcombobox')(event, this, 'height');
    }

         /**
         * Event listener (proxy) for a width input field's `keyup()` event.
         *
         * @param  jQuery.Event event  The input `keyup()` event.
         * @param  boolean
         */
    , heightKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyupcombobox')(event, this, 'height');
    }

         /**
         * Hook called after the width input field's `change()` and `keyup()` event
         * to update locked fields if necessary.
         *
         * @param  string newvalue  The updated CSS width
         * @param  boolean
         */
     });

     /****
     * Upload control
     */

     CoffeeBuilderControls.add('upload', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'background-image';
         }
  , init: function () {
      var fieldelement = '',
      hiddenDeleteFile = '',
      xbutton = '';

      this.$element = $('<form id="fimages"><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="images" id="images" class="rightupload" ></label>' +
    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button" ></button></label> <input type = "hidden" class = "fileNameMenuUpload" /></from>');
      this.fields = {
          fieldelement: this.$element.find('input#images').val(fieldelement),
          xbutton: this.$element.find('button').val(xbutton),
          hiddenDeleteFile: this.$element.find('input.fileNameMenuUpload').val(hiddenDeleteFile)

      }
      this.setTitle(this.$element.find('span:first'));
      this.fields.xbutton.click($.proxy(this.imageBackgroundChane, this));
    
  },
         imageBackgroundChane: function (event) {
             return CoffeeBuilderEvents.get('bg_changeimage')(this, 'background-image');
    
         }

     });

     CoffeeBuilderControls.add('uploadicon', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'background-icon';
         }
     , init: function () {
	      var fieldelement = '',
	      $text = this.getElement(),
	      hiddenDeleteFile = '',
	      xbutton = '';
	
	      this.$element = $('<form id = "icon_default"><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="icondf" id="icondf" class="iconupload" ></label>' +
	    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button" ></button></label><input type = "hidden" class = "fileNameIconButtonDefalut" /></form>');
	      this.fields = {
	          fieldelement: this.$element.find('input.iconupload').val(fieldelement),
	          xbutton: this.$element.find('button.btndelete').val(xbutton),
	          hiddenDeleteFile: this.$element.find('input.fileNameIconButtonDefalut').val(hiddenDeleteFile)
	      }
	      this.setTitle(this.$element.find('span:first'));
	      if ($text.length) {
	
	    	  this.fields.xbutton.click($.proxy(this.imageBackgroundChange, this));
	
	          // Otherwise, disable controls
	      } else {
	          $.each(this.fields, function (field_name, field) {
	              field.attr('disabled', true);
	          });
	      }
	      
	      this.temp = this.manifest.selectors;
  	  }
     ,imageBackgroundChange: function (event) {
            return CoffeeBuilderEvents.get('bg_changeimage')(this, 'background-image');
         }
     });
     
     
     
     CoffeeBuilderControls.add('icon', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'icon';
         }
  , init: function () {
      var fieldelement = '',
      $text = this.getElement(),
      xbutton = '';

      this.$element = $('<label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="icondf" id="icondf" class="icon_hoover " ></label>' +
    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button"></button></label>');
      this.fields = {
          fieldelement: this.$element.find('input.icon_hoover').val(fieldelement),
          xbutton: this.$element.find('button.btndelete').val(xbutton)

      }
      this.setTitle(this.$element.find('span:first'));
      if ($text.length) {

    	  this.fields.xbutton.click($.proxy(this.imageBackgroundChane, this));

          // Otherwise, disable controls
      } else {
          $.each(this.fields, function (field_name, field) {
              field.attr('disabled', true);
          });
      }
      


  },
         imageBackgroundChane: function (event) {
             return CoffeeBuilderEvents.get('bg_changeicondf')(this, 'background-image');
         }

     });


     CoffeeBuilderControls.add('uploadsubmenu', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'background-imagesubmenu';
         }
  , init: function () {
      var fieldelement = '',
      xbutton = '';
      this.$element = $('<form id="formsubmenu"><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="imagessub" id="imagessub" class="sumneuupload" ></label>' +
    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button"></button></label></form>');
      this.fields = {
          fieldelement: this.$element.find('input#imagessub').val(fieldelement),
          xbutton: this.$element.find('button').val(xbutton)         
      }
      this.setTitle(this.$element.find('span:first'));
      
      this.fields.xbutton.click($.proxy(this.imageBackgroundChane, this));


  },
         imageBackgroundChane: function (event) {
             return CoffeeBuilderEvents.get('bg_changeimagesubmenu')(this, 'background-image');
         }

     });

     CoffeeBuilderControls.add('upload-bgbutton-default', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'upload-bgbutton-default';
         }
  , init: function () {
      var fieldelement = '',
      $text = this.getElement(),
      hiddenDeleteFile = '',
      xbutton = '';

      this.$element = $('<form id="formdefault"><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="imagesdf" id="imagesdf" class="upload-bgbutton-default" ></label>' +
    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button"></button></label><input type = "hidden" class = "fileNameButtonUploadDefault" /><form>');
      this.fields = {
          fieldelement: this.$element.find('input#imagesdf').val(fieldelement),
          xbutton: this.$element.find('button').val(xbutton),
          hiddenDeleteFile : this.$element.find('input.fileNameButtonUploadDefault').val(hiddenDeleteFile)
          
      }
      this.setTitle(this.$element.find('span:first'));
      if ($text.length) {

    	  this.fields.xbutton.click($.proxy(this.imageBackgroundChange, this));

          // Otherwise, disable controls
      } else {
          $.each(this.fields, function (field_name, field) {
              field.attr('disabled', true);
          });
      }
     
  }
  ,imageBackgroundChange: function (event) {
      return CoffeeBuilderEvents.get('bg_changeimage')(this, 'background-image');
  }
     });
     
     CoffeeBuilderControls.add('apply', {

         check: function (manifest) {
          //   return CoffeeBuilderControl.getSelector(manifest).property === 'applyall';
             return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, [
                                                                        	        'applyall',
                                                                        	        'applyall-type-default',
                                                                        	        'applyall-type-hover',
                                                                        	        'applyall-type-active',
                                                                        	        'applyall-type-visited',
                                                                        	        'applyall-icon-default',
                                                                        	        'applyall-icon-hover',
                                                                        	        'applyall-icon-active',
                                                                        	        'applyall-icon-visited',
                                                                        	        'applyall-bgimage-default',
                                                                        	        'applyall-bgimage-hover',
                                                                        	        'applyall-bgimage-active',
                                                                        	        'applyall-bgimage-visited',
                                                                        	        'applyall-border-default',
                                                                        	        'applyall-border-hover',
                                                                        	        'applyall-border-active',
                                                                        	        'applyall-border-visited',
                                                                        	        'applyall-padding-margin-default',
                                                                        	        'applyall-padding-margin-hover',
                                                                        	        'applyall-padding-margin-active',
                                                                        	        'applyall-padding-margin-visited'
                                                                        	      ]) !== -1;
         }
  , init: function () {
      var self = this;
      var selector = this.getSelector();
      var classExt = selector.property;
      self.$element = $('<label class="label_grouped_main"><span class="primary_left "></span><input type="checkbox" class="checkbox-'+classExt+'">  Apply to all Menu buttons </label>');
      self.fields = {
    	checkbox: self.$element.find('input[type=checkbox]')
      };
      self.fields.checkbox.change($.proxy(self.checkboxChange, this)).change();
  }
  , checkboxChange: function (event) {
      return CoffeeBuilderEvents.get('checkbox_change')(this);
  }

     });
     CoffeeBuilderControls.add('tabbutton', {
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'tabbutton';
         }
  	, init: function () {
  	    var self = this;
  	    self.$element = $(
	  	       '<div id="tabs_container_button">' +
                        '<ul class="tabs ">' +
                        '<li class="active"><a rel="#tab_default_contents" class="tab">Default</a> </li>' +
                        '<li><a rel="#tab_hoover_contents" class="tab">Hoover</a></li>' +
                        '<li><a rel="#tab_active_contents" class="tab">Active</a></li>' +
                        '<li><a rel="#tab_visited_contents" class="tab">Visited</a></li>' +
                        '</ul>' +
                        '<div class="clear"></div>' +
                        '<div class="tab_contents_container">' +
                        '<div id="tab_default_contents" class="tab_contents tab_contents_active"></div>' +
                        '<div id="tab_hoover_contents" class="tab_contents"></div>' +
                        ' <div id="tab_active_contents" class="tab_contents"></div>' +
						' <div id="tab_visited_contents" class="tab_contents"></div>' +
	  	        '</div>');
  	}
     });
     

CoffeeBuilderControls.add('Style', {

         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'Style-text';
         }

    , init: function () {

        var fontWeight = '',
    		fontStyle = '',
    		textDecoration = '',
    		textTransform = '',
            options = this.manifest.options || [],
            weight = this.getCss('font-weight') || 'normal',
            style = this.getCss('font-style') || 'normal',
            decoration = this.getCss('text-decoration') || 'none',
            transform = this.getCss('text-transform') || 'uppercase',
        
            $text = this.getElement();
        // Fonts list
       
        // Fonts weight list
        $.each({
            'Normal': "normal",
            'Bold': "bold"
        }, function (name, value) {
            fontWeight += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        // Fonts style list
        $.each({
            'Normal': "normal",
            'Italic': "italic"
        }, function (name, value) {
            fontStyle += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        // Text decoration list
        $.each({
        	'None': "none",
            'Overline': "overline",
            'Line Through': "line-through",
            'Underline': "underline" 
        }, function (name, value) {
            textDecoration += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        // Text transform list
        $.each({
            'Uppercase': "uppercase",
            'Lowercase': "lowercase",
            'Capitalize': "capitalize"
        }, function (name, value) {
            textTransform += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
        });
        this.$element = $(
        '<div id="button_state_type_group" class="control_group text_group">' +
        ' <label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font  select_field fweight">' + fontWeight + '</select></label>' +
        ' <label class="label_grouped"><select class="combo_right combo_algin  select_field fdecoration ">' + textDecoration + '</select></label>' +
        ' <label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font  select_field fstyle">' + fontStyle + '</select></label>' +
        ' <label class="label_grouped"><select class="combo_right combo_algin  select_field ftransform">' + textTransform + '</select></label>' +
        '</div>');
        this.fields = {
            weight: this.$element.find('select.fweight').val(weight),
            style: this.$element.find('select.fstyle').val(style),
            decoration: this.$element.find('select.fdecoration').val(decoration),
            transform: this.$element.find('select.ftransform').val(transform)
        };

        // Set the title
        this.setTitle(this.$element.find('span:eq(0)'));
        
        // Add events 
        if ($text.length) {
           
            this.fields.weight.change($.proxy(this.fontWeightChange, this)); //event change font weight
            this.fields.style.change($.proxy(this.fontStyleChange, this)); //event change font style
            this.fields.decoration.change($.proxy(this.textDecorationChange, this)); //event change text decoration
            this.fields.transform.change($.proxy(this.textTransformChange, this));    //event change text transform
           
            this.temp = this.manifest.selectors;
            
            // Otherwise, disable controls
        } else {
            $.each(this.fields, function (field_name, field) {
                field.attr('disabled', true);
            });
        }
    }

         /**
         * Event listener (proxy) for the font-size input field's `change()` event.
         *
         * @param  jQuery.Event event  The font-size input `change()` event.
         * @param  boolean
         */   
    	

          , fontWeightChange: function (event) {
        	 if (CoffeeBuilderControl.apply.regular.type) {
        		this.manifest.selectors = getAllMenuButton('Style-text');
        	 } else {
        		this.manifest.selectors = this.temp;
        	 }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'font-weight');
          }
          , fontStyleChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
         		this.manifest.selectors = getAllMenuButton('Style-text');
         	 } else {
         		this.manifest.selectors = this.temp;
         	 }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'font-style');
          }
          , textDecorationChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
         		this.manifest.selectors = getAllMenuButton('Style-text');
         	 } else {
         		this.manifest.selectors = this.temp;
         	 }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'text-decoration');
          }
          , textTransformChange: function (event) {
        	  if (CoffeeBuilderControl.apply.regular.type) {
         		this.manifest.selectors = getAllMenuButton('Style-text');
         	 } else {
         		this.manifest.selectors = this.temp;
         	 }
              return CoffeeBuilderEvents.get('select_change')(event, this, 'text-transform');
          }
  
     });
	/**
	 * Add control padding, margin  - clone 4_sided_sizer
	 * Control used for managing properties with top, left, bottom, and right
	 * sizes (margins/padding).
	 */
	CoffeeBuilderControls.add('4_sided_sizer_ext', {
	  
	    /**
	     * Given a manifest, checks if this control is the appropriate type to
	     * manage the properties specified in the manifest.
	     *
	     * @param   Object manifest  The JSON manifest to check.
	     * @return  Boolean
	     */
	    check: function(manifest) {
	      return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, ['margin_ext','padding_ext']) !== -1;
	    }
	    
	    /**
	     * Initializes the control by adding the following instance variables:
	     *
	     * this.$element // jQuery object for the entire control
	     * this.fields   // hash of jQuery objects for all form fields in the control
	     *
	     * @return  void
	     */      
	  , init: function() {
	      var 
	        self = this,
	        selector = self.getSelector(),
	        size, 
	        property;        
	    var classExt = selector.property;
	      // Set the element
	      self.$element = $(
	    		   '<label class="label_grouped_main"><span class="primary_left"></span><input class="input_right sizerm '+classExt+'_top" type="spin" min="0" max="100"></label>' +
	    	          '<label class="label_grouped"><input class="input_right sizerm '+classExt+'_right" type="spin" min="0" max="100"></label>' +
	    	          '<label class="label_grouped"><input class="input_right sizerm '+classExt+'_bottom" type="spin" min="0" max="100"></label>' +
	    	          '<label class="label_grouped "><input class="input_right sizerm '+classExt+'_left" type="spin" min="0" max="100"></label>' +
	    	          '<span class="primary_left"></span><span class="input_right sizer_label">Top</span><span class="sizer_label">Right</span><span class="sizer_label">Bottom</span><span class="sizer_label">Left</span>'
	   );
	      
	      // Set the fields
	      $.each(['top','right','bottom','left'], function(index, side){
	        
	        property = selector.property + '-' + side;
	        size = self.getCss(property) || 0;
	        
	        self.fields[property] = self.$element.eq(index).find('input.sizerm')
	          .data('builder-property', property)
	          .val(parseInt(size, 10))
	          .change($.proxy(self.sizeChange, self))
	          .keyup($.proxy(self.sizeKeyup, self));
	              
	        CoffeeBuilderEvents.get('initialize_sizers')(self.fields[property]);
	      });
	      
	      // Set the title
	      self.setTitle(self.$element.find('span:first'));                
	    }
	    
	    /**
	     * Event listener (proxy) for a size input field's `change()` event.
	     *
	     * @param  jQuery.Event event  The input `change()` event.
	     * @param  Boolean
	     */      
	  , sizeChange: function(event) {
	      return CoffeeBuilderEvents.get('sizer_change')(event, this, $(event.currentTarget).data('builder-property'));
	    }
	  
	    /**
	     * Event listener (proxy) for a size input field's `keyup()` event.
	     *
	     * @param  jQuery.Event event  The input `keyup()` event.
	     * @param  Boolean
	     */
	  , sizeKeyup: function(event) {
	      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, $(event.currentTarget).data('builder-property'));
	    }      
	});
	
	/**
	 * Add control border for buttons  - clone border
	 * Control used for border properties.
	 */  
	CoffeeBuilderControls.add('border_ext', {

	    /**
	     * Given a manifest, checks if this control is the appropriate type to
	     * manage the properties specified in the manifest.
	     *
	     * @param   Object manifest  The JSON manifest to check.
	     * @return  Boolean
	     */
	    check: function(manifest) {
	      return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, [
	        'border-top-ext',
	        'border-bottom-ext',
	        'border-left-ext',
	        'border-right-ext',
	        'border-ext'
	      ]) !== -1;
	    }
	    
	    /**
	     * Initializes the control by adding the following instance variables:
	     *
	     * this.$element // jQuery object for the entire control
	     * this.fields   // hash of jQuery objects for all form fields in the control
	     *
	     * @return  void
	     */      
	  , init: function() {      
	      var 
	        css,
	        styles = '',
	        revert = false,
	        self = this,
	        selector = self.getSelector(),
	        style = self.getCss(selector.property + '-style') || 'none',
	        width,
	        color;
	      
	      $.each({
	        'None':   'none',
	        'Dotted': 'dotted',
	        'Dashed': 'dashed',
	        'Solid':  'solid',
	        'Double': 'double',
	        'Groove': 'groove',
	        'Ridge':  'ridge',
	        'Inset':  'inset',
	        'Outset': 'outset'
	      }, function(name, value) {
	        styles += '<option value="' + value + '" title="' + name + '">' + name + '</option>';
	      });      
	      
	      // Some browsers require a style before a valid width/color is reported
	      self.updateCss(selector.property + '-style', 'solid');
	      width = self.getCss(selector.property + '-width') || '0';
	      color = self.getCss(selector.property + '-color') || '#000000';
	      self.updateCss(selector.property + '-style', style);
	    
	      // Set the element
	      self.$element = $(
	        '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field border_type_ext">' + styles + '</select></label>' +
	        '<label class="label_grouped"><input type="spin" class="input_right sizerm border_size_ext" type="text" min="0" max="20" value="13" maxlength="2"></label>' +
	        '<label class="label_grouped"><input type="text" class="color_right color_picker border_color_ext"></label>'
	      );
	      
	      // Set the title
	      this.$element.find('span:first').text(self.manifest.name);
	      
	      // Set the fields
	      self.fields = {
	        style: this.$element.find('select').val(style),
	        width: this.$element.find('input.sizerm').val(parseInt(width, 10)),
	        color: this.$element.find('input.color_picker').val(color)
	      };
	      
	      // Set field properties
	      $.each(['style','width','color'], function(index, name){
	        self[name + '_property'] = selector.property + '-' + name;
	      });
	      
	      // Set field events
	      self.fields.style.change($.proxy(self.styleChange, self));
	      CoffeeBuilderEvents.get('initialize_sizers')(self.fields.width.change($.proxy(self.widthChange, self)).keyup($.proxy(self.widthKeyup, self)));
	      CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.color, self.color_property, undefined, $.proxy(self.colorChangeAll, self));
	      
	      // Add the lock if part of a group
	      if(self.group) {
	        if(self.group.controls.length === 0) {
	          self.locked = true;
	          self.$lock = $('<img class="starter_icon border_lock" src="images/icons/padlock-closed.png" width="12" height="12">').wrap('<label class="label_grouped">').click($.proxy(self.borderLock, self));
	          this.$element = this.$element.add(self.$lock).find('span:first').prepend($('<b>').text(self.group.manifest.name + ' ')).end();
	        } else {
	          CoffeeBuilderEvents.get('border_initialize')(self);
	        }          
	      }
	    }

	    /**
	     * Event listener (proxy) for a width input field's `change()` event.
	     *
	     * @param  jQuery.Event event  The input `change()` event.
	     * @param  Boolean
	     */
	  , widthChange: function(event) {
	      return CoffeeBuilderEvents.get('sizer_change')(event, this, this.width_property, $.proxy(this.widthChangeAll, this));
	    }
	  
	    /**
	     * Event listener (proxy) for a width input field's `keyup()` event.
	     *
	     * @param  jQuery.Event event  The input `keyup()` event.
	     * @param  Boolean
	     */    
	  , widthKeyup: function(event) {
	      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, this.width_property, $.proxy(this.widthChangeAll, this));
	    }

	    /**
	     * Hook called after the width input field's `change()` and `keyup()` event
	     * to update locked fields if necessary.
	     *
	     * @param  String newvalue  The updated CSS width
	     * @param  Boolean
	     */
	  , widthChangeAll: function(newvalue) {
	      return this.propertyUpdateAll('width_property', 'width', newvalue);
	    }      
	    
	    /**
	     * Event listener (proxy) for a style select field's `change()` event.
	     *
	     * @param  jQuery.Event event  The select `change()` event.
	     * @param  Boolean
	     */      
	  , styleChange: function(event) {
	      return CoffeeBuilderEvents.get('select_change')(event, this, this.style_property, $.proxy(this.styleChangeAll, this));
	    }
	    
	    /**
	     * Hook called after the width style select field's `change()` event
	     * to update locked fields if necessary.
	     *
	     * @param  String newvalue  The updated CSS style
	     * @param  Boolean
	     */      
	  , styleChangeAll: function(newvalue) {
	      return this.propertyUpdateAll('style_property', 'style', newvalue);
	    }
	    
	    /**
	     * Hook called after the width color input field's `change()` event
	     * to update locked fields if necessary.
	     *
	     * @param  String newvalue  The updated CSS color
	     * @param  Boolean
	     */   
	  , colorChangeAll: function(newvalue) {
	      return this.propertyUpdateAll('color_property', 'color', newvalue);
	    }
	  
	    /**
	     * Hook called after`change()` events to update locked fields if 
	     * necessary.
	     *
	     * @param  String newvalue  The updated CSS color
	     * @param  Boolean
	     */    
	  , propertyUpdateAll: function(property, element, newvalue) {
	      var self = this;
	      self.updateCss(self[property], newvalue);
	      
	      if(element === 'width') {
	        newvalue = parseInt(newvalue, 10);
	      }
	  
	      if(self.locked) {
	        $.each(self.group.controls.keys, function(index, name) {
	          if(name === self.name) {
	            return true;
	          }

	          self.group.controls.get(name).fields[element].val(newvalue).change();
	        });
	      }      
	    }      
	    
	    /**
	     * Event listener (proxy) for a lock's `click()` event.
	     *
	     * @param  jQuery.Event event  The lock `click()` event.
	     * @param  Boolean
	     */      
	  , borderLock: function(event) {
	      return CoffeeBuilderEvents.get('border_lock')(event, this);
	    }      
	});
	
	/**
     * Control upload background image of button when hover, active, visited
     */
     CoffeeBuilderControls.add('upload-button-ext', {
         check: function (manifest) {
        	  return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, ['bgimage-hover-ext','bgimage-active-ext', 'bgimage-visited-ext']) !== -1;
         }
	      , init: function () {
		       var fieldelement = '',
		       selector = this.getSelector(),
		       hiddenDeleteFile = '',
		       xbutton = '';
		       
		       
		       var propertyValue = selector.property ;
		       this.$element = $('<form id = "'+propertyValue+'"><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="images" id="images" class="'+propertyValue+'" ></label>' +
		     		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button"></button></label><input type = "hidden" class = "filename_'+propertyValue+'" /></form>');
		       this.fields = {
		           fieldelement: this.$element.find('input#images').val(fieldelement),
		           xbutton: this.$element.find('button.btndelete').val(xbutton),
		           hiddenDeleteFile:this.$element.find('input.filename_' + propertyValue).val(hiddenDeleteFile)
		       }
		       this.setTitle(this.$element.find('span:first'));
		       this.fields.xbutton.click($.proxy(this.imageBackgroundChange, this));
	      },
	      imageBackgroundChange: function (event) {
	            return CoffeeBuilderEvents.get('bg_changeimage')(this, 'background-image');
	      }

     });
     /**
      * Add control background icon for button hover, active, visited
      */
     CoffeeBuilderControls.add('uploadicon-button-ext', {
         check: function (manifest) {
        	 return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, ['uploadicon-button-hover-ext','uploadicon-button-active-ext', 'uploadicon-button-visited-ext']) !== -1;
         }
     , init: function () {
	      var fieldelement = '',
	    //  $text = this.getElement(),
	      selector = this.getSelector(),
	      hiddenDeleteFile = '',
	      xbutton = '';
	      var propertyValue = selector.property ;
	      this.$element = $('<form id= "frm_'+propertyValue+'" ><label class="label_grouped_main"><span class="primary_left"></span><input type="file" name="'+propertyValue+'" id="'+propertyValue+'" class="'+propertyValue+'" ></label>' +
	    		  '<label class="label_grouped">' + '<button  style="margin-left: 19px;" class= "btndelete" type="button"></button></label><input type = "hidden" class = "filename_'+propertyValue+'" /></form>');
	      this.fields = {
	          fieldelement: this.$element.find('input#' + propertyValue).val(fieldelement),
	          xbutton: this.$element.find('button.btndelete').val(xbutton),
	          hiddenDeleteFile: this.$element.find('input.filename_' + propertyValue).val(hiddenDeleteFile)
	
	      }
	      this.setTitle(this.$element.find('span:first'));
	      this.fields.xbutton.click($.proxy(this.imageBackgroundChange, this));
	      /*
	      if (this.getElement().length) {
	
	    	  this.fields.xbutton.click($.proxy(this.imageBackgroundChange, this));
	          // Otherwise, disable controls
	      } else {
	          $.each(this.fields, function (field_name, field) {
	              field.attr('disabled', true);
	          });
	      }
	      */
  	  }
     ,imageBackgroundChange: function (event) {
         return CoffeeBuilderEvents.get('bg_changeimage')(this, 'background-image');
      }
     });
     
     /**
      * Add control position button when hover, active, visited
      */
      CoffeeBuilderControls.add('Icon-position-ext', {
          check: function (manifest) {
        	  return $.inArray(CoffeeBuilderControl.getSelector(manifest).property, ['Icon-position-hover-ext','Icon-position-active-ext', 'Icon-position-visited-ext']) !== -1;
          }

     , init: function () {

         var Position = '',
         	spinleft='',
         	spinright='',
         	selector = this.getSelector(),
         	spincustom='';
         var propertyValue = selector.property ;
         $.each({
             'Custom': "None",
             'Left': "left",
             'Right': "right"
         }, function (name, value) {
             Position += '<option value="' + value + '" title="' + value + '">' + name + '</option>';
         });

         this.$element = $(
         '<div class="control_group text_group">' +
         '<label class="label_grouped_main"><span class="primary_left"></span><select class="combo_right combo_font select_field Position hover_position icon-select-position-ext ">' + Position + '</select></label>' +
         '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm xfiled left left_hover icon-position-x-px-ext "></label>' +
         '<label class="label_grouped"><input type="spin"  min="0" class="input_right sizerm yfiled top top_hover icon-position-y-px-ext "></label>' +
          '<span class="sizer_label">X</span>' +
         '<span class="sizer_label">Y</span>' +
         '</div>');
         this.setTitle(this.$element.find('span:first'));
         this.fields = {
         		Position: this.$element.find('select.Position').val(Position),
         		spinleft:this.$element.find('input.left').val(spinleft),
         		spinright:this.$element.find('input.top').val(spinright)
         		
         };
         this.fields.Position.change($.proxy(this.changePosition, this));
         this.fields.spinleft.change($.proxy(this.changePositionX, this)).keyup($.proxy(this.widthKeyupX, this));
         this.fields.spinright.change($.proxy(this.changePositionY, this)).keyup($.proxy(this.widthKeyupY, this));    
     },
 	changePosition:function(event){
   	  return CoffeeBuilderEvents.get('positionXY')(this,'background-position');
     	},
     	changePositionX:function(event){
     	  	  return CoffeeBuilderEvents.get('positionX')(this,'background-position');
     	    	},
     	    	changePositionY:function(event){
     	    	  	  return CoffeeBuilderEvents.get('positionY')(this,'background-position');
     	    	    	},
     	widthKeyupX: function(event) {
       return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'background-position', $.proxy(this.changePositionX, this));
     },
     widthKeyupY: function(event) {
         return CoffeeBuilderEvents.get('sizer_keyup')(event, this, 'background-position', $.proxy(this.changePositionY, this));
       }
      });
     
     
     /**
     *  _____                _       
     * |  ___|              | |      
     * | |____   _____ _ __ | |_ ___ 
     * |  __\ \ / / _ \ '_ \| __/ __|
     * | |___\ V /  __/ | | | |_\__ \
     * \____/ \_/ \___|_| |_|\__|___/
     *_______________________________
     *ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªª   
     *
     * Global collection of all available events.
     *
     * Use `CoffeeBuilderEvents.addEvent()` for adding events and
     * `CoffeeBuilderEvents.getEvent()` for retrieving events. 
     */
     /**
     * Change event for text fields which updates corresponding text elements.
     * 
     * @param   jQuery.Event event            The change event
     * @param   CoffeeBuilderControl control  The text control
     * @param   Function callback             An optional callback
     * @return  void
     */


     CoffeeBuilderEvents.add('link_change', function (event, control, callback) {
         var newvalue = $(event.currentTarget).val();
         return $.isFunction(callback) ? callback(newvalue) : control.updateLinkElement(newvalue); //this.builder.$contents.find(selector.selector).attr('href',newvalue);// 
     });
     CoffeeBuilderEvents.add('bg_checkbox', function (control, property, callback) {
         var checked = control.fields.checkbox.is(':checked');
         // Disable fields in control if checkbox isn't checked

         return checked ? CoffeeBuilderEvents.get('bg_change')(control, property, callback) : control.updateCss(property,"");
     });
     CoffeeBuilderEvents.add('bg_change', function (control, property, callback) {
    	 var newvalue = control.fields.bgcolor.val();

        // return control.updateCss(property,newvalue);
    	return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property,newvalue);
    	 //return  control.updateCss(property,newvalue);

     });
     CoffeeBuilderEvents.add('bg_changeimage', function (control, property, callback) {
    	 var isNotDelete = control.fields.fieldelement.val() == "";
    	 if (!isNotDelete) {
             alert(deleted_message);
         }
    	 if (control.fields.hiddenDeleteFile.val() != undefined) {
    		 deleteFile(control.fields.hiddenDeleteFile.val());
    	 }
    	 
    	 control.fields.fieldelement[0].form.reset();
    	 
    	 if (CoffeeBuilderControl.apply.regular.icon) {
         	control.manifest.selectors = getAllMenuButton('background-icon');
         } else {
         	 control.manifest.selectors = control.temp;
         }
    	 
         var newvalue = "none";
         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
     });
     CoffeeBuilderEvents.add('bg_changeimagesubmenu', function (control, property, callback) {
    	 var isNotDelete = control.fields.fieldelement.val() == "";
         control.fields.fieldelement[0].form.reset();
         deleteFile(uploadsubmenu);
         if (!isNotDelete) {
             alert(deleted_message);
         }
         var newvalue = "";
         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);

     });
     CoffeeBuilderEvents.add('bg_changeimagedf', function (control, property, callback) {
    	 var isNotDelete = control.fields.fieldelement.val() == "";
         control.fields.fieldelement[0].form.reset();
         deleteFile(imagedefault);
         if (!isNotDelete) {
             alert(deleted_message);
         }
         var newvalue = "";
         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
     });
     CoffeeBuilderEvents.add('bg_changeicondf', function (control, property, callback) {
    	 var isNotDelete = control.fields.fieldelement.val() == "";
         control.fields.fieldelement[0].form.reset();
         deleteFile(icondefault);
         if (!isNotDelete) {
             alert(deleted_message);
         }
         var newvalue = "none";
         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
         //return $.isFunction(callback) ? callback(newvalue) : control.deleteIcon();
     });
     CoffeeBuilderEvents.add('repeat_change', function (event, control, property, callback) {
         var newvalue = $(event.currentTarget).val();
         return $.isFunction(callback) ? callback(value) : control.updateCss(property, newvalue);
     });
     CoffeeBuilderEvents.add('repeat_position', function (control, property, callback) {

         var top = control.fields.combotop.val();
         var left = control.fields.comboleft.val();
         if (control.fields.spintop.val()) {
             top = control.fields.spintop.val() + "%";
         }
         if (control.fields.spinleft.val()) {
             left = control.fields.spinleft.val() + "%";
         }
         var newvalue = left + " " + top;
         return $.isFunction(callback) ? callback(value) : control.updateCss(property, newvalue);
     });
     CoffeeBuilderEvents.add('menusize_change', function (control, property, callback) {
         var newvalue = $(event.currentTarget).val();

         return $.isFunction(callback) ? callback(value) : control.updateCss(property, newvalue);
     });
     CoffeeBuilderEvents.add('select_change_menu', function (event, control, property, callback) {
         var newvalue = $(event.currentTarget).val();
         newvalue = newvalue.split("_");
         var size
         if (newvalue != 'none') {
             size = newvalue[1] + "px";
             control.fields.height.val(newvalue[1]);
             if (property == "width") {
                 control.fields.width.val(newvalue[0]);
                 size = newvalue[0] + "px";
             }
         }

         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, size);
     });

     CoffeeBuilderEvents.add('sizer_changeofcombobox', function (event, control, property, callback) {
         var 
	    $field = $(event.currentTarget),
	    min = parseInt($field.attr('min'), 10),
	    max = parseInt($field.attr('max'), 10),
	    newvalue = $field.val();
         var count = control.fields.buttonsize.val();
         if (!/^\d+$/.test(newvalue)) {
             return CoffeeBuilderEvents.get('sizer_resetcombobox')(event, control, property, callback, count);
         }

         newvalue = parseInt(newvalue, 10);
         if (!isNaN(min) && newvalue < min) {
             return CoffeeBuilderEvents.get('sizer_resetcombobox')(event, control, property, callback, count, 'The minimum allowed value is ' + min + '.');
         }

         if (!isNaN(max) && newvalue > max) {
             return CoffeeBuilderEvents.get('sizer_resetcombobox')(event, control, property, callback, count, 'The maximum allowed value is ' + max + '.');
         }

         $field.data('oldvalue', newvalue);
         return $.isFunction(callback) ? callback(newvalue + "" + count) : control.updateCss(property, newvalue + "" + count);
     });
     CoffeeBuilderEvents.add('sizer_keyupcombobox', function (event, control, property, callback) {
         var 
	    $field = $(event.currentTarget),
	    min = parseInt($field.attr('min'), 10),
	    max = parseInt($field.attr('max'), 10),
	    newvalue = $field.val();
         var count = control.field.buttonsize.val();
         if (!/^\d+$/.test(newvalue)) {
             return;
         }

         newvalue = parseInt(newvalue, 10);
         if ((!isNaN(min) && newvalue < min) || (!isNaN(min) && newvalue > max)) {
             return;
         }
         return $.isFunction(callback) ? callback(newvalue + '' + count) : control.updateCss(property, newvalue + '' + count);
     });

     CoffeeBuilderEvents.add('sizer_resetcombobox', function (event, control, property, callback, count, message) {
         var 
	    $field = $(event.currentTarget),
	    oldvalue = $field.data('oldvalue') || parseInt(control.getCss(property), 10) || 0;

         if (typeof message === 'string') {
             alert(message);
             return false;
         }

         $field.val(oldvalue);
         return $.isFunction(callback) ? callback(oldvalue + "" + count) : control.updateCss(property, oldvalue + "" + count);
     });
     
     CoffeeBuilderEvents.add('positionXY', function(control, property, callback){
    	 	var position = control.fields.Position.attr("value");
	  		var value = "0% 0%";
	  		if(position=='left' || position=='right'){
	  			control.fields.spinleft.attr('disabled','disabled');
	  			control.fields.spinright.attr('disabled','disabled');
	  			if (position == 'left') {
	  				var value = "0% 10%";
	  			}
	  			else if (position == 'right') {
	  				var value = "95% 10%";
	  			}
	  		}
	  		else{
	  			control.fields.spinleft.removeAttr('disabled');
	  			control.fields.spinright.removeAttr('disabled');
	  			control.fields.spinleft.val('');
	  			control.fields.spinright.val('');
	  		}
    		 return $.isFunction(callback) ? callback(value) : control.updateCss(property, value);
    	});
     
     CoffeeBuilderEvents.add('positionY', function(control, property, callback){
    	 var x = '0%';
         var y = '0%';
         if (control.fields.spinleft.val()) {
             x = control.fields.spinleft.val() + "%";
         }
         if (control.fields.spinright.val()) {
             y = control.fields.spinright.val() + "%";
         }
         var newvalue = x + " " + y;
         return $.isFunction(callback) ? callback(value) : control.updateCss(property, newvalue);
 	});
     CoffeeBuilderEvents.add('positionX', function(control, property, callback){
    	 var x = '0%';
         var y = '0%';
         if (control.fields.spinleft.val()) {
             x = control.fields.spinleft.val() + "%";
         }
         if (control.fields.spinright.val()) {
             y = control.fields.spinright.val() + "%";
         }
         var newvalue = x + " " + y;
         return $.isFunction(callback) ? callback(value) : control.updateCss(property, newvalue);
  	});
 CoffeeBuilderEvents.add('vertical_change', function(event, control, property, callback){
	  
	  control.updateCss("position", 'absolute');
    	 var newvalue = '';
    	 var othervalue = control.fields.align.val();
    	 var properties =  control.fields.cbvertical.val();
    	 if(!control.fields.spinver.val()){
    		
    	   	newvalue = '5px';
    	 }
    	 if(control.fields.cbvertical.val() != 'middle' && control.fields.cbvertical.val() && control.fields.spinver.val()){
    	   	newvalue =  + control.fields.spinver.val()+"px"
    	 }
    	 if(properties =="top"){
    		control.updateCss("bottom", '');
    		if(othervalue == "center"){
    			control.updateCss('left','0px');
    			control.updateCss('right','0px');
    		}
    	}else{
    		control.updateCss("top", '');
    	}
    	 if(properties=="middle" ){
    		 	newvalue = '';
    		 	if(control.fields.align.val() =="center" ){
    		 		control.updateCss("position", '');
    		 		
    		 	}
    			control.updateCss("bottom", '');
    			control.updateCss("top", '');
    		
    		
    	}
    	
         return $.isFunction(callback) ? callback(newvalue) : control.updateCss(properties, newvalue);
     });
     CoffeeBuilderEvents.add('spinalign_change', function(event, control, property, callback){
   	  var newvalue = ''
   	   control.updateCss("position", 'absolute');  
   	  var properties =  control.fields.align.val();
   	  
   	  if(control.fields.spinleft.val()){
   		properties = control.fields.align.val();
   	  }else{
   		 newvalue = '5px';
         }
   	  if(control.fields.align.val() != 'center' && control.fields.align.val() && control.fields.spinleft.val()){
   		newvalue =  + control.fields.spinleft.val()+"px"
   	  }
   	  if(properties =="left"){
                  control.updateCss("right", '');
          }else{
                  control.updateCss("left", '');
	}if(properties=="center"){
		newvalue = '';
		if(control.fields.cbvertical.val()=="middle"){
			control.updateCss("position", '');
		}
		control.updateCss("right", '0px');
		control.updateCss("left", '0px');
	}
	
   	return $.isFunction(callback) ? callback(newvalue) : control.updateCss(properties, newvalue); 
    });

/**
 * Change event for the checkbox that enables/disables CSS3
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('text_shadow_change', function(control, property, callback){
  if(!control.fields.checkbox_text.is(':checked')) {                   
    return;
  }
  var newvalue = 
    'rgba(' + 
      control.getRgb(control.fields.color.val()) + ', ' + 
      control.fields.opacity.val() / 100 + 
    ') ' + 
    control.fields.x.val() + 'px ' + 
    control.fields.y.val() + 'px ' + 
    ' 0';
  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});  


/**
 * Change event for the checkbox that enables/disables box-shadow.
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('shadow_checkbox_text', function(control, property, callback) {
  var checked = control.fields.checkbox_text.is(':checked');

  // Disable fields in control if checkbox isn't checked
  $.each(control.fields, function(control_name, $field) {
    if(control_name !== 'checkbox_text') {
      $field.attr('disabled', !checked);
    }
  });
  return checked ? CoffeeBuilderEvents.get('text_shadow_change')(control, property, callback) : control.updateCss(property, 'none');
});
/**
 * Change event for the checkbox that enables/disables box-shadow.
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('shadow_checkbox_radius', function(control, property, callback) {
  var checked = control.fields.checkbox_radius.is(':checked');
  // Disable fields in control if checkbox isn't checked
  $.each(control.fields, function(control_name, $field) {
    if(control_name !== 'checkbox_radius') {            
      $field.attr('disabled', !checked);
    }
  });
  return checked ? CoffeeBuilderEvents.get('border_radius_change')(control, property, callback) : control.updateCss(property, '');
});

/**
 * Event for checkbox
 * @param control		An control
 */
CoffeeBuilderEvents.add('checkbox_change', function(control) {
	var input = control.$element.children('input');
	if (input.attr('class') == 'checkbox-applyall-type-default') {
		if (control.fields.checkbox.is(':checked')) {
			applyAllMenuButton('type');
			CoffeeBuilderControl.apply.regular.type = 1;
		} else {
			if (!CoffeeBuilderControl.apply.regular) {
				CoffeeBuilderControl.apply.regular = {};
			}
			CoffeeBuilderControl.apply.regular.type = 0;
		}
	}
	if (input.attr('class') == 'checkbox-applyall-icon-default') {
		if (control.fields.checkbox.is(':checked')) {
			applyAllMenuButton('icon');
			CoffeeBuilderControl.apply.regular.icon = 1;
		} else {
			if (!CoffeeBuilderControl.apply.regular) {
				CoffeeBuilderControl.apply.regular = {};
			}
			CoffeeBuilderControl.apply.regular.icon = 0;
		}
	}
});

/**
 * Change event for the checkbox that enables/disables border-radius
 * 
 * @param   CoffeeBuilderControl control  The shadow control
 * @param   String property               An optional CSS property for the control
 * @param   Function callback             An optional callback
 * @return  void
 */  
CoffeeBuilderEvents.add('border_radius_change', function(control, property, callback){
  if(!control.fields.checkbox_radius.is(':checked')) {
    return;
  }
  var newvalue = control.fields.border_radius.val() + 'px';
  return $.isFunction(callback) ? callback(newvalue) : control.updateCss(property, newvalue);
});
/**
 * Control used for managing text-shadow properties.
 */  
CoffeeBuilderControls.add('textshadow', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */    
    check: function(manifest) {
      return CoffeeBuilderControl.getSelector(manifest).property === 'text-shadow';
    }
    
    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire control
     * this.fields   // hash of jQuery objects for all form fields in the control
     *
     * @return  void
     */      
  , init: function() {
      var
        self = this,       
        shadow = self.getCss();
        
      // Set the element
      self.$element = $(
        '<div class="control_group " style="width:260px">' +
        ' <label class="label_input_grouped"><span class="primary_left section_head" ><input class="shadow_enabled shadow_checkbox_text" type="checkbox"></span></label>' +
        ' <label class="label_input_grouped"><input type="text" class="color_right color_picker shadow_color" value="#777777"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_opacity" type="text" value="90" min="0" max="100" maxlength="3"><span class="shadow_text">%</span></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_x" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <label class="label_input_grouped"><input class="input_right shadow_size shadow_y" type="text" value="2" min="0" max="10" maxlength="2"></label>' +
        ' <span class="shadow_label first">Alpha</span><span class="shadow_label">X</span><span class="shadow_label">Y</span>' +
        ' <label class="label_input_grouped"><span class="primary_left section_head">CSS3 help:</span><span class="shadow_label help"></span></label>' +
        '</div>'
      );
      // Set the fields
      $.each(['checkbox_text','color','opacity','x','y'], function(index, name){
        self.fields[name] = self.$element.find('input.shadow_' + name);
      });
      
      // Set the title
      self.setTitle(self.$element.find('span:first'));

      // Set defaults
      if(shadow && shadow !== 'none') {
        self.fields.checkbox_text.attr('checked','checked');
        
        var hexa = self.getHexAlpha(shadow);
        if(hexa.hex)
        {
          self.fields.color.val(hexa.hex);
          self.fields.opacity.val(Math.round((hexa.alpha ? hexa.alpha : 1) * 100));
        }

        var match = shadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
        if(match)
        {               
           self.fields.x.val(match[1]);
           self.fields.y.val(match[2]);
        }          
      }
      // Add events     
      self.fields.checkbox_text.change($.proxy(self.checkboxChange, self)).change();
      
      CoffeeBuilderEvents.get('colorpicker_initialize')(self, self.fields.color, undefined, {}, $.proxy(self.shadowChange, self));
      $.each(self.fields, function(field_name, field) {
        if(field_name !== 'checkbox_text' && field_name !== 'color') {
          CoffeeBuilderEvents.get('initialize_sizers')(field.change($.proxy(self.sizerChange, self)).keyup($.proxy(self.sizerKeyup, self)));
        }
      });
    }
    
    /**
     * Event listener (proxy) for an input's `change()` event.
     *
     * @param  jQuery.Event event  The input's `change()` event.
     * @param  Boolean
     */      
  , sizerChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Event listener (proxy) for an input's `keyup()` event.
     *
     * @param  jQuery.Event event  The input's `keyup()` event.
     * @param  Boolean
     */  
  , sizerKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Callback to be triggered when any shadow field changes.
     *
     * @param  void
     */
  , shadowChange: function() {
      return CoffeeBuilderEvents.get('text_shadow_change')(this);
    }
    
    /**
     * Event listener (proxy) for the checkbox's `change()` event.
     *
     * @param  jQuery.Event event  The checkbox's `change()` event.
     * @param  Boolean
     */      
  , checkboxChange: function(event) {
      return CoffeeBuilderEvents.get('shadow_checkbox_text')(this);      
    }
  
});



/**
 * Control used for managing border-radius properties.
 */  
CoffeeBuilderControls.add('borderradius', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */    
    check: function(manifest) {
      return CoffeeBuilderControl.getSelector(manifest).property === 'border-radius';
    }
    
    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire control
     * this.fields   // hash of jQuery objects for all form fields in the control
     *
     * @return  void
     */      
  , init: function() {
      var
        self = this,       
        shadow = self.getCss("box-shadow"),
        radius = self.getCss("border-radius"),
        text_shadow = self.getCss("text-shadow");
        
      // Set the element
      self.$element = $(
        '<div class="control_group text_group" style="padding-bottom: 17px;">' +
        ' <label class="label_input_grouped"><span class="primary_left"><input class="shadow_enabled checkbox_radius" type="checkbox"></span></label>' +
        ' <label class="label_input_grouped"><input type="spin" max="1000" value="10" min="0" class="input_right sizerm border_radius"></label>' +
        '</div>'
      );
      // Set the fields
      $.each(['checkbox_radius','border_radius'], function(index, name){
        self.fields[name] = self.$element.find('input.' + name);
      });
      
      // Set the title
      self.setTitle(self.$element.find('span:first'));
      // Set defaults
      if(text_shadow && text_shadow !== 'none' || shadow && shadow !== 'none' ) {
        self.fields.checkbox_radius.attr('checked','checked');

        var match = shadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
        if(match)
        {           
           self.fields.border_radius.val(10);
           
        }          
      }
      // Add events     
      self.fields.checkbox_radius.change($.proxy(self.checkboxChange, self)).change();
      
        $.each(self.fields, function(field_name, field) {
        if(field_name !== 'checkbox_radius') {
          CoffeeBuilderEvents.get('initialize_sizers')(field.change($.proxy(self.sizerChange, self)).keyup($.proxy(self.sizerKeyup, self)));
        }
      });
    }
    
    /**
     * Event listener (proxy) for an input's `change()` event.
     *
     * @param  jQuery.Event event  The input's `change()` event.
     * @param  Boolean
     */      
  , sizerChange: function(event) {
      return CoffeeBuilderEvents.get('sizer_change')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Event listener (proxy) for an input's `keyup()` event.
     *
     * @param  jQuery.Event event  The input's `keyup()` event.
     * @param  Boolean
     */  
  , sizerKeyup: function(event) {
      return CoffeeBuilderEvents.get('sizer_keyup')(event, this, undefined, $.proxy(this.shadowChange, this));
    }

    /**
     * Callback to be triggered when any shadow field changes.
     *
     * @param  void
     */
  , shadowChange: function() {
      return CoffeeBuilderEvents.get('border_radius_change')(this);
    }
    
    /**
     * Event listener (proxy) for the checkbox's `change()` event.
     *
     * @param  jQuery.Event event  The checkbox's `change()` event.
     * @param  Boolean
     */      
  , checkboxChange: function(event) {
      return CoffeeBuilderEvents.get('shadow_checkbox_radius')(this);      
    }
  
});

/**
 * Control used for managing text-shadow properties.
 */  
CoffeeBuilderControls.add('borderradius11', {
  
    /**
     * Given a manifest, checks if this control is the appropriate type to
     * manage the properties specified in the manifest.
     *
     * @param   Object manifest  The JSON manifest to check.
     * @return  Boolean
     */    
    check: function(manifest) {
      return CoffeeBuilderControl.getSelector(manifest).property === 'border-radius11';
    }

    /**
     * Initializes the control by adding the following instance variables:
     *
     * this.$element // jQuery object for the entire control
     * this.fields   // hash of jQuery objects for all form fields in the control
     *
     * @return  void
     */      
  , init: function() {
      var
        self = this,  
        shadow = self.getCss();
      // Set the element
      self.$element = $(
        '<div class="control_group shadow_group"  style="width:169px;padding-bottom: 17px;">' +
        ' <label class="label_input_grouped"><span class="primary_left_shadow section_head" style="width:121px"><input class="shadow_enabled shadow_checkbox_radius" type="checkbox"></span></label>' +
        ' <label class="label_input_grouped"><input type="spin" max="1000" value="10" min="0" class="input_right shadow_size shadow_border_radius"></label>' +
        '</div>'
      );
        
      // Set the fields
//      $.each(['checkbox_radius','border_radius'], function(index, name){
//        self.fields[name] = self.$element.find('input.shadow_' + name);
//      });
      self.fields['checkbox_radius'] = self.$element.find('input.shadow_checkbox_radius');
      self.fields['border_radius'] = self.$element.find('input.shadow_border_radius');
      
      // Set the title
      self.setTitle(self.$element.find('span:first'));
      // Set defaults
       self.fields.checkbox_radius.attr('checked','checked');
      if(shadow && shadow !== 'none') {
        self.fields.checkbox_radius.attr('checked','checked');
        var match = shadow.match(/(\d+)px/);
        if(match)
        {
           self.fields.radius.val(match[1]);     
        }          
      }
      
       // Add events
      self.fields.checkbox_radius.change($.proxy(self.checkboxChangeRadius, self)).change();
       $.each(self.fields, function(field_name, field) {
        if(field_name !== 'checkbox_radius') {
          CoffeeBuilderEvents.get('initialize_sizers')(field.change($.proxy(self.borderRadiusChange, self)).keyup($.proxy(self.borderRadiusKeyup, self)));
        }
      });
    }
    
          

    /**
     * Event listener (proxy) for an input's `change()` event.
     *
     * @param  jQuery.Event event  The input's `change()` event.
     * @param  Boolean
     */      
  , borderRadiusChange: function (event) {
        return CoffeeBuilderEvents.get('sizer_change')(event, this, undefined, $.proxy(this.borderRadChange, this));                  
    }    
 
    /**
     * Event listener (proxy) for an input's `keyup()` event-mode.
     *
     * @param  jQuery.Event event  The input's `keyup()` event.
     * @param  Boolean
     */      
  , borderRadiusKeyup: function (event) {
        return CoffeeBuilderEvents.get('sizer_keyup')(event, this, undefined, $.proxy(this.borderRadChange, this));             
    }      
    
    /**
     * Callback to be triggered when any shadow field changes.
     *
     * @param  void
     */    
  , borderRadChange: function() {          
      return CoffeeBuilderEvents.get('border_radius_change')(this);
    }
    
    /**
     * Event listener (proxy) for the checkbox's `change()` event.
     *
     * @param  jQuery.Event event  The checkbox's `change()` event.
     * @param  Boolean
     */      
  , checkboxChangeRadius: function(event) {       
      return CoffeeBuilderEvents.get('shadow_checkbox_radius')(this);      
    } 
});


	/**
	 * Control used for managing add more button
	 */ 
     CoffeeBuilderControls.add('buttonadd', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'buttonadd';
         }
         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {   
        this.$element = $(
          '<span class="primary_left_addbutton"><strong> Add new button:<strong></span><button type="button" id="add-buttonmenu" class="icon-add" onclick="addMoreMenu()"></button>'
        );      
    }
    
     });

     /**********************************************************************MenuBuilder**********************************************************/
     /********************************************************************************************************************************/
     
/**
 * Control used for managing all element of menu
 */ 
     CoffeeBuilderControls.add('content_element', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'content_element';
         }
         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
	     , init: function () {   
	        this.$element = $(
	          '<div><div class="primary_left_content_element" >' +
	        		'<ul id = "list_all_menu"></ul>' +
	   		  		'<input type = "text" id = "edit_text_hide" class = "edit_text_menu_hide" onkeypress="updateTextMenu(event)"/>' +
	        		'</div>'+
	                '<div style="padding:10px"><span style="padding-right:5px"><button type="button" id="add-buttonmenu" class="icon-add" onclick="addButtonMenu()">Add Button</button></span>'+
	                '<span style="padding-right:5px"><button type="button" id="add-submenu" class="icon-add" onclick="addButtonSubMenu()">Add Submenu</button></span>'+
	                                '<span style="padding-right:5px"><button type="button" id="deletebutton" class="icon-delete" onclick="deleteButton()">&nbsp;</button></span></div>'+
	                                '<br><label class="label_grouped"><span class="primary_left">Link to:</span><input type="text" id = "id_link_button_menu" value="#" onkeyup="updateLinkMenu(event)"></label></div>'
	               
	        );      
	    }
    
    });
     
     CoffeeBuilderControls.add('content_element_temp', {

         /**
         * Given a manifest, checks if this control is the appropriate type to
         * manage the properties specified in the manifest.
         *
         * @param   JSON manifest  The manifest to check.
         * @return  bool
         */
         check: function (manifest) {
             return CoffeeBuilderControl.getSelector(manifest).property === 'content_element_temp';
         }
         /**
         * Initializes the control by adding the following instance variables:
         *
         * this.$element // jQuery object for the entire control
         * this.fields   // hash of jQuery objects for all form fields in the control
         *
         * @return  void
         */
    , init: function () {
        this.$element = $(
          '<div><div class="primary_left_content_element"><ul class="style-list-all-menu"></ul></div>'+
                '<div style="padding:10px"><span style="padding-right:5px"><button type="button" id="add-buttonmenu" class="icon-add" onclick="addMoreMenu()">Add Button</button></span>'+
                '<span style="padding-right:5px"><button type="button" id="add-submenu" class="icon-add" onclick="addMoreMenu()">Add Submenu</button></span>'+
                                '<span style="padding-right:5px"><button type="button" id="deletebutton" class="icon-delete" onclick="addMoreMenu()">&nbsp;</button></span></div>'+
                                '<br><label class="label_grouped"><span class="primary_left">Link to:</span><input type="text" class="" value="Link"></label></div>' 
        );
    }
    
     });

 } (window);
  
  
