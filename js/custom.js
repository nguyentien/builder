        $(document).ready(function(){
                        firstLoad = 1;  
                        callElementMode();  
                         
                        $("#elements").toggle(function(){    
                                //mode preview  
                                $("#layout-center").animate({
                                    width: 1364
                                },500);   
                                $("#controls").hide(500);                                   
                                //remove class add top
                                $("#control_switcher").removeClass("height_element");
                                //callPropertiesAction('main_menuone_1_a_a span.text_menu_link');
                                $("#elements_text").removeClass("active");
                                var content_menu = $("#preview").contents().find("#mainmenu").html();
                                $("#preview").contents().find("#mainmenu_preview").html(content_menu)                                
                                $("#preview").contents().find("#mainmenu_preview li").removeAttr("id");
                                $("#preview").contents().find("#mainmenu_preview li a").removeAttr("id");                                
                                $("#preview").contents().find("#mainmenu_preview li a").removeAttr("onmouseover");
                                $("#preview").contents().find("#mainmenu_preview li a").removeAttr("onclick");
                                $("#preview").contents().find("#mainmenu_preview li a").removeAttr("onclick");
                                $("#preview").contents().find(".mainnavigation").toggle();                                                                                                                                    
                        },
                        function(){     
                                //mode edit
                                //effect show
                                $("#layout-center").animate({                    
                                    width: 1034
                                },500);         
                                $("#controls").show(500);    
                                $("#control_switcher").addClass("height_element");
                                $("#elements_text").addClass("active");
                                $("#preview").contents().find(".mainnavigation").toggle();                                 
                        });

      });
              
        /**
       * Call server generate panel each button 
       *
       * @param   string id     The id element when click on  of the event to add.
       * @param   Function event  The event to add
       * @return  void
       */ 
        function callPropertiesAction(id)
        {
                liid = id.split("_a_a");
                newvalue = id.split(" "); 
                $.ajax({
                        url: "action/getAllElements.php",
                        type: "POST",
                        data: {
                                idButtonSpan: id,
                                idButton: newvalue[0],
                                liButton:liid[0],
                                firstLoad:firstLoad,
                                time:Math.random()
                        },  
                        success: function(data) {                                          
                                $("#navigation_controls").html(data);
                                //$("#body_controls").html(data);
                                $("#control_switcher").removeClass("height_element");  
                                $('#preview').coffeeBuilder('activatePanel', 'body');
                                //call when click on menupreview
                                if(firstLoad==0)
                                {
                                        $("#body_subpanel_title_title").removeClass("active");                        
                                        $("#body_subpanel_button_title").addClass("active");
                                        $("#body_subpanel_title_controls").removeClass("active");                        
                                        $("#body_subpanel_button_controls").addClass("active");   
                                        loadTabOfButton();
                                }
                                else
                                {
                                        $("#body_subpanel_title_title").removeClass("active");           
                                        $("#body_subpanel_title_controls").removeClass("active");         
                                        $("#body_subpanel_nav_title").addClass("active");                                          
                                        $("#body_subpanel_nav_controls").addClass("active");  
                                }  
                                //set firstload 
                                firstLoad = 0;                                  
                                    //show button add menu    
                                $("#group_add_menu").show();
                                $("#preview").contents().find("#"+liid[0]).show();
                        }                          
                });
        }

      /**
       * Load all tab of button: default,hoover,actice,visited
       *
       * @param   string id     The id element when click on  of the event to add.
       * @param   Function event  The event to add
       * @return  void
       */         
        function loadTabOfButton()
        {
                //for tab default
                var i=1;
                $("#body_subpanel_defaults_controls").children().find("fieldset").each(function() {
                        $(this).attr({
                                'id': function(_, id) { return id + i },
                                'name': function(_, name) { return name + i },
                                'value': ''               
                        });      
                }).end().appendTo("div#tab_default_contents");
                i++;
                //for tab hoover                
                var i=1;
                $("#body_subpanel_hoover_controls").children().find("fieldset").each(function() {
                        $(this).attr({
                        'id': function(_, id) { return id + i },
                        'name': function(_, name) { return name + i },
                        'value': ''               
                        });      
                }).end().appendTo("div#tab_hoover_contents");
                i++;
                //for tab active                
                var i=1;        
                $("#body_subpanel_active_controls").children().find("fieldset").each(function() {
                        $(this).attr({
                        'id': function(_, id) { return id + i },
                        'name': function(_, name) { return name + i },
                        'value': ''               
                        });      
                }).end().appendTo("div#tab_active_contents");
                i++;
                //for tab visited                
                var i=1;
                $("#body_subpanel_visited_controls").children().find("fieldset").each(function() {
                        $(this).attr({
                        'id': function(_, id) { return id + i },
                        'name': function(_, name) { return name + i },
                        'value': ''               
                        });      
                }).end().appendTo("div#tab_visited_contents");
                i++;                
        }
         
      /**
       * Show menu action when click menu
       *
       * @param   string id     The id element when click on  of the event to add.
       * @param   Function event  The event to add
       * @return  void
       */     
        var curent_mainmenu = "";
        function showMenuAction(id_element_menu) {
            curent_mainmenu = id_element_menu;
            $('.menumassaction').remove();
            $('.menumassaction_sub').remove();
            var x = $("#preview").contents().find('#' + id_element_menu).offset();     
            $("<div id='menu' class='menumassaction' style='display: none;position: absolute;background:#F0F0F0;z-index:9999999;'>\n\
                                        <ul class='menu_action'><li class='add'><a href='#addsub' onclick=\"addSubMenu('" + id_element_menu + "')\">Add new button on submenu</a></li>\n\
                                        <li class='delete'><a href='#delete'  onclick=\"deleteMenu('" + id_element_menu + "')\">Delete this button</a></li>\n\
                                        <li class='edit'><a href='#edit' onclick=\"callPropertiesAction('" + id_element_menu + "_a_a span.text_menu_link')\">Edit this button </a></li>\n\
                                   </ul></div>").appendTo("body");
            var topx = parseInt(x.top) + 50;
            $('.menumassaction').css({
                top: topx + 'px',
                left: x.left + 'px'
            }).show();
            changeAllStyleActive(id_element_menu);
            return false;

        }
      /**
       * Add more menu with name tmp
       *
       * @param   string id     The id element when click on  of the event to add.
       * @param   Function event  The event to add
       * @return  void
       */        
      var num_menu =4;
        function addMoreMenu(id)
        {        
                $("#group_add_menu").show();
                num_menu++;
                var text_name  = "More";
                var menu_change_link = "#";
                var menu_name = num_menu;//Math.floor((Math.random()*100)+1);
                if(idbuttonold)
                        menu_name = idbuttonold;//Math.floor((Math.random()*100)+1);   
                for(i=1;i<num_menu;i++)
                {
                        if ($("#preview").contents().find("#main_menuone_"+i+"_a_a").attr("style")!='undefined')                                
                        {
                                var styleCurrent = $("#preview").contents().find("#main_menuone_"+i+"_a_a").attr("style");                
                                var styleSpanCurrent = $("#preview").contents().find("#main_menuone_"+i+"_a_a span.icon_menu_handle").attr("style");                
                                break;
                        }                                
                }
                $("#preview").contents().find("#mainmenu").append('<li  class="main_menuone_a main_menuone_'+menu_name+'" id="main_menuone_'+menu_name+'" style="display:none"  >\n\
                                                                        <a style=\'positoion: relative;'+styleCurrent+'\'  class="main_menuone_a_a" href="#" id="main_menuone_'+menu_name+'_a_a"  onclick="parent.showMenuAction(\'main_menuone_'+menu_name+'\'); return false;" onmouseover="parent.changeAllStyleActive(\'main_menuone_'+menu_name+'\');">\n\
                                                                                <span class="icon_menu_handle" style=\''+styleSpanCurrent+'\'>&nbsp;</span><span class = "text_menu_link">'+text_name+'&nbsp;</span>\n\
                                                                        </a>\n\
                                                                        <input type="hidden" id="exist_main_menuone_'+menu_name+'" name="exist_main_menuone_'+menu_name+'" value="0"></li>');
                callPropertiesAction('main_menuone_'+menu_name+'_a_a span.text_menu_link');	
        }
        
        function applyAll()
        {
        	alert($(".apply_checkbox").is("checked","checked"));
        }
        /**
         * Delete picture
         */
        function deleteFile(path)
        {
                //$('#preview').coffeeBuilder('removePanel', 'navigation');   
                $.ajax({
                        url: "action/deleteFile.php",
                        type: "POST",
                        data: {
                                filepath: path
                        } 
                });
        }
  
/*-------------------
	* Function Name: addButtonMenuSub_old
	* Description: add submenu of child menu
        -------------------- */     
        var curent_mainmenu = "main_menuone_1";
        var numsubmenu = 0;
        function addSubMenu(curentMenuId)
        {
                numsubmenu++;
                curent_mainmenu = curentMenuId;
                var text_add  = "Name"
                var menu_change_link = "#";
                var sub_menu_name = "sub_"+curent_mainmenu+"_"+numsubmenu;//Math.floor((Math.random()*100)+1);
                val_current_count = $("#preview").contents().find('input:hidden[name=exist_'+curent_mainmenu+']').val(); 
                if ($("#preview").contents().find("#"+curentMenuId+"_a_a").attr("style")!='undefined')                                
                {
                        var styleCurrent = $("#preview").contents().find("#"+curentMenuId+"_a_a").attr("style");
                        if (temp) {
                        	styleCurrent += ';background-image:' + temp;
                        }
                        var styleSpanCurrent = $("#preview").contents().find("#"+curentMenuId+"_a_a span.icon_menu_handle").attr("style");                
                }                                
                             
                if(val_current_count==0)//not submenu set  in input hidden   
                {
                        $("#preview").contents().find('input:hidden[name=exist_'+curent_mainmenu+']').val(1)            
                        $("#preview").contents().find('#'+curent_mainmenu).append('<ul class="submenu_a sub_'+curent_mainmenu+'">\n\
                                                                                        <li class="submenu_a_a '+sub_menu_name+'" id="'+sub_menu_name+'" >\n\
                                                                                                <a style=\'positoion: relative;'+styleCurrent+'\'  id="'+sub_menu_name+'_a_a" class="submenu_a_a_a '+sub_menu_name+'_a_a" href="'+menu_change_link+'" onclick="parent.showMenuActionSub(\''+curent_mainmenu+'\',\''+sub_menu_name+'\'); return false;" onmouseover="parent.changeAllStyleActive(\''+sub_menu_name+'\')"  >\n\
                                                                                                        <span class="icon_menu_handle" style=\''+styleSpanCurrent+'\'>&nbsp;</span><span class = "text_menu_link">'+text_add+'</span>\n\
                                                                                                        &nbsp; </a>\n\
                                                                                        <input type="hidden" value="0" name="exist_sub_'+sub_menu_name+'" id="exist_sub_'+sub_menu_name+'"/></li></ul>');                         
                }            
                else
                {
                        $("#preview").contents().find('input:hidden[name=exist_'+curent_mainmenu+']').val(parseInt(val_current_count)+1); 
                        $("#preview").contents().find('.sub_'+curent_mainmenu).append('<li class="submenu_a_a '+sub_menu_name+'"  id="'+sub_menu_name+'">\n\
                                                                                                <a style=\'positoion: relative;'+styleCurrent+'\' id="'+sub_menu_name+'_a_a" class="submenu_a_a_a '+sub_menu_name+'_a_a" href="'+menu_change_link+'" onclick="parent.showMenuActionSub(\''+curent_mainmenu+'\',\''+sub_menu_name+'\'); return false;" onmouseover="parent.changeAllStyleActive(\''+sub_menu_name+'\')" >\n\
                                                                                                        <span class="icon_menu_handle" style=\''+styleSpanCurrent+'\'>&nbsp;</span><span class = "text_menu_link">'+text_add+'</span>\n\
                                                                                                        &nbsp; </a>\n\
                                                                                        <input type="hidden" value="0" name="exist_sub_'+sub_menu_name+'" id="exist_sub_'+sub_menu_name+'"/></li>');
                } 
                callPropertiesAction(''+sub_menu_name+'_a_a span.text_menu_link');
        }
         
         /*-------------------
	* Function Name: showMenuActionSub
	* Description: show menu for mass action
        -------------------- */    
        function showMenuActionSub(id_main_menu,id_element_menu)
        {

                $('.menumassaction_sub').remove();
                $('.menumassaction').remove();
                        var x=$("#preview").contents().find('#'+id_element_menu).offset();
                        //remove old menuaction showed            
                        $('#main_menu_button_delete').show();
                        $('#main_menu_button_delete').attr({ 
                                href: "javascript:deleteSubMenu('"+id_main_menu+"','"+id_element_menu+"')"    
                        });          
                        var cssrules =  $("<div id='menu_sub' class='menumassaction_sub' style='display: none;position: absolute;background:#efefef;z-index:9999999'>\n\
                                        <ul class='menu_action'>\n\
                                        <li class='add'><a href='#add' onclick=\"addButtonMenuSub('"+id_main_menu+"','"+id_element_menu+"')\">Add more sub menu button</a></li>\n\
                                        <li class='delete'><a href='#delete' onclick=\"deleteSubMenu('"+id_main_menu+"','"+id_element_menu+"')\">Delete this sub menu</a></li>\n\
                                        <li class='edit'><a href='#edit' onclick=\"callPropertiesAction('"+id_element_menu+"_a_a span.text_menu_link')\">Edit this button</a></li>\n\
                                   </ul></div>").appendTo("body");
                        $('.menumassaction_sub').css({
                                top: x.top+'px',
                                left: x.left+'px'
                        }).show();
                        changeAllStyleActive(id_element_menu, 'submenu_subname');
                        return false;			
                //});
        }    
        /*-------------------
	* Function Name: addButtonMenuSub_old
	* Description: add submenu of child menu
        -------------------- */         
        var numchildmenu = 0;
        function addButtonMenuSub(menu_id,submenu_id)
        {
                numchildmenu++;
                var text_add = "Name";
                var menu_change_link = "#";

                var sub_menu_name = "sub_child_"+submenu_id+"_"+numchildmenu;//Math.floor((Math.random()*100)+1);
                var val_current_count = $("#preview").contents().find('input:hidden[name=exist_sub_'+submenu_id+']').val(); 
                if ($("#preview").contents().find("#"+menu_id+"_a_a").attr("style")!='undefined')                                
                {
                        var styleCurrent = $("#preview").contents().find("#"+menu_id+"_a_a").attr("style");                
                        var styleSpanCurrent = $("#preview").contents().find("#"+menu_id+"_a_a span.icon_menu_handle").attr("style");                
                }                                            
                if(val_current_count==0)//not submenu set  in input hidden   
                {
                        $("#preview").contents().find('input:hidden[name=exist_sub_'+submenu_id+']').val(1)            
                        $("#preview").contents().find('.'+submenu_id).append('<ul class="child_submenu_a submenu_a sub_'+submenu_id+'">\n\
                                                                                        <li class="submenu_a_a '+sub_menu_name+'" id="'+sub_menu_name+'">\n\
                                                                                                <a style=\'positoion: relative;'+styleCurrent+'\'  id="'+sub_menu_name+'_a_a"  class="submenu_a_a_a '+sub_menu_name+'_a_a" href="'+menu_change_link+'"  onclick="parent.showMenuActionSub(\''+curent_mainmenu+'\',\''+sub_menu_name+'\'); return false;" onmouseover="parent.changeAllStyleActive(\''+sub_menu_name+'\')">\n\
                                                                                                        <span class="icon_menu_handle" style=\''+styleSpanCurrent+'\'>&nbsp;</span><span class = "text_menu_link">'+text_add+'</span>\n\
                                                                                          &nbsp; </a>\n\
                                                                                        </li>\n\
                                                                                        <input type="hidden" value="0" name="exist_sub_'+sub_menu_name+'" id="exist_sub_'+curent_mainmenu+'"/></ul>');
                }            
                else
                {
                        $("#preview").contents().find('input:hidden[name=exist_sub_'+submenu_id+']').val(parseInt(val_current_count)+1); 
                        $("#preview").contents().find('.sub_'+submenu_id).append('<li class="submenu_a_a '+sub_menu_name+'" id="'+sub_menu_name+'">\n\
                                                                                        <a style=\'positoion: relative;'+styleCurrent+'\'  id="'+sub_menu_name+'_a_a"  class="submenu_a_a_a '+sub_menu_name+'_a_a" href="'+menu_change_link+'" onclick="parent.showMenuActionSub(\''+curent_mainmenu+'\',\''+sub_menu_name+'\'); return false;" onmouseover="parent.changeAllStyleActive(\''+sub_menu_name+'\')">\n\
                                                                                                <span class="icon_menu_handle" style=\''+styleSpanCurrent+'\'>&nbsp;</span><span class = "text_menu_link">'+text_add+'</span>\n\
                                                                                 &nbsp; </a>\n\
                                                                                        <input type="hidden" value="0" name="exist_sub_'+sub_menu_name+'" id="exist_sub_'+curent_mainmenu+'"/></li>');
                }       
                callPropertiesAction(''+sub_menu_name+'_a_a span');
        }
        /*-------------------
	* Function Name: deleteSubMenu
	* Description: remove menu in mainmenu
        -------------------- */    
        function deleteSubMenu(id_menu,id_sub_menu)
        {
                val_current_count = $("#preview").contents().find('input:hidden[name=exist_sub_'+id_sub_menu+']').val(); 
                $("#preview").contents().find('input:hidden[name=exist_sub_'+id_sub_menu+']').val(parseInt(val_current_count)-1); 
                $("#preview").contents().find("."+id_sub_menu).remove();

                if(val_current_count==1)
                {                          
                        $("#preview").contents().find(".sub_"+id_sub_menu).remove();
                }     
        }  
        /*-------------------
	* Function Name: deleteMenu
	* Description: remove menu in mainmenu
        -------------------- */    
        var idbuttonold = "";
        function deleteMenu(id_menu)
        {
                id = id_menu.split("main_menuone_");
                idbuttonold = id[1];
                num_menu--;
                $("#preview").contents().find("#"+id_menu).remove();
        }
        /*-------------------
	* Function Name: changeAllStyleActive
	* Description: Change all style button
        -------------------- */            
        function changeAllStyleActive(id_element_menu, flagsubmenu)
        { 
                // Set effect to submenu
                if (flagsubmenu!=undefined) {curent_mainmenu = id_element_menu;}

                if (id_element_menu != '') {
                        var idDiv = '';
                        var event = '';
                        var flagStatusButton = $("#tabs_container_button").children().find("li.active_element_menu").html();
                        // When hover
                        if(flagStatusButton.indexOf("Hoover") != -1 || flagStatusButton.indexOf("hover") != -1){
                                idDiv = "#tab_hoover_contents";
                                event = 'hover';    
                                var flagEditHoverButton = $(idDiv).children().find("input.padding_ext_top").val();
                                if (initCssButton(idDiv, event) != '' && flagEditHoverButton != undefined) {
                                        var cssButtonHover = "<style type='text/css'>" + initCssButton(idDiv, event) + "</style>";
                                        $("#preview").contents().find('#cssHoverButton').html(cssButtonHover);
                                }
                        }
                        // When active
                        else if(flagStatusButton.indexOf("Active") != -1){
                                idDiv = "#tab_active_contents";
                                event = 'active';
                                var flagEditActiveButton = $(idDiv).children().find("input.padding_ext_top").val();
                                if (initCssButton(idDiv, event) != '' && flagEditActiveButton != undefined) { 
                                         var cssButtonActive = "<style type='text/css'>" + initCssButton(idDiv, event) + "</style>";
                                        $("#preview").contents().find('#cssActiveButton').html(cssButtonActive);
                                }
                        }
                }

        }
        /**
         * init css for button
         * return final css of button
         */
        function initCssButton(idDiv, event) {
                var css = " ";
                var id;
                // Css of pading and margin button

                /**
                 * If apply to this button
                 */
                if(curent_mainmenu!="") {
                        if (changePaddingMarginButon(idDiv, event) != undefined && changePaddingMarginButon(idDiv, event) != ' ') {
                                // If check all menu
                                if ($(idDiv).children().find('input.checkbox-applyall-padding-margin').is(':checked')) {
                                        id = $("#preview").contents().find('#'+curent_mainmenu).closest("ul").attr("id");
                                        css += '#'+id+' a:'+event+'{'+changePaddingMarginButon(idDiv, event)+'}';
                                }
                                else {
                                        css += '#'+curent_mainmenu+' a:'+event+'{'+changePaddingMarginButon(idDiv, event)+'}';
                                }
                                //css += '#'+curent_mainmenu+' a:'+event+'{'+changePaddingMarginButon(idDiv, event)+'}';
                        } 
                        if (changeBorderButton(idDiv, event) != undefined) {
                        	
                                // If check all menu
                                if ($(idDiv).children().find('input.checkbox-applyall-border').is(':checked')) {
                                        id = $("#preview").contents().find('#'+curent_mainmenu).closest("ul").attr("id");
                                        css += '#'+id+' a:'+event+'{'+changeBorderButton(idDiv, event)+'}';
                                }
                                else {
                                        css += '#'+curent_mainmenu+' a:'+event+'{'+changeBorderButton(idDiv, event)+'}';
                                }
                        }
                        if (ChangeFontButton(idDiv, event) != undefined) {
                        	css += '.'+event+'_span{'+ChangeFontButton(idDiv, event)+'}';
                        	if(event =="active"){
                        		  $("#preview").contents().find('#'+curent_mainmenu+' a').mousedown(function () {
                                  	var spantext = $(this).find('.text_menu_link');
                                  	 spantext.addClass('active_span').siblings();
                                    });
                        		  $("#preview").contents().find('#'+curent_mainmenu+' a').mouseup(function () {
                                    	var spantext = $(this).find('.text_menu_link');
                                    	 spantext.removeClass('active_span');
                                     });
                        	}
                            if(event=="hover"){      
                                     $("#preview").contents().find('#'+curent_mainmenu+' a').mouseover(function () {
                                    	var spantext = $(this).find('.text_menu_link');
                                    	spantext.addClass('hover_span')
                                      });
                                     $("#preview").contents().find('#'+curent_mainmenu+' a').mouseout(function () {
                                    	 var spantext = $(this).find('.text_menu_link');
                                    	 spantext.removeClass('hover_span');
                                     });
                                }
                        }
                        if (changeBgButton(idDiv, event) != undefined) {
                            // If check all menu
                            if ($(idDiv).children().find('input.checkbox-applyall-bgimage').is(':checked')) {
                                    id = $("#preview").contents().find('#'+curent_mainmenu).closest("ul").attr("id");
                                    css += '#'+id+' a:'+event+'{'+changeBgButton(idDiv, event)+'}';
                            }
                            else {
                                    css += '#'+curent_mainmenu+' a:'+event+'{'+changeBgButton(idDiv, event)+'}';
                            }

                    	}
                        if (changeIconButton(idDiv, event) != undefined) {
                            // If check all menu
                          //  if ($(idDiv).children().find('input.checkbox-applyall-bgimage').is(':checked')) {
                         //           id = $("#preview").contents().find('#'+curent_mainmenu).closest("ul").attr("id");
                          //          css += '#'+id+' a:'+event+'{'+changeIconButton(idDiv, event)+'}';
                          //  }
                          //  else {
                               css += '#'+curent_mainmenu+' a span.icon_menu_handle:'+event+'{'+changeIconButton(idDiv, event)+'}';
                         //   }

                    	}
                }
                // Return css for browser
                return css;
        }
        /**
         * Change border button
         */
        function changeBorderButton(idDiv, event) {
                var cssObj_li_a_border = ' ';
                // Get border type of button
                if ($(idDiv).children().find("select.border_type_ext").val() != undefined && $(idDiv).children().find("select.border_type_ext").val() != 'none') {
                        cssObj_li_a_border += ' border-top-style:'+ $(idDiv).children().find("select.border_type_ext").val() + ' !important;';
                        // Get border size of button
                        if ($(idDiv).children().find("input.border_size_ext").val() != undefined && $(idDiv).children().find("input.border_size_ext").val() != 0) {
                                cssObj_li_a_border += 'border-top-width:'+ $(idDiv).children().find("input.border_size_ext").val() + 'px !important;';


                        }
                        
                        if ($(idDiv).children().find("input.border_color_ext").val() != undefined && $(idDiv).children().find("input.border_size_ext").val() != 0) {
                                cssObj_li_a_border += ' border-top-color:'+ $(idDiv).children().find("input.border_color_ext").val() + ' !important';
                        }
                }
                if (cssObj_li_a_border != ' ') {return cssObj_li_a_border + ';';}

        } 


        //Change padding, margin
        function changePaddingMarginButon(idDiv, event)
        {        

                var cssObj_li_a_Padding = ' ';
                var cssObj_li_a_Margin = ' ';
                var css = " ";
                $arrPosition = ['top', 'right', 'bottom', 'left'];

                for(var i = 0, length = $arrPosition.length; i < length; i++ ) {
                        // Get css padding
                        if ($(idDiv).children().find("input.padding_ext_" + $arrPosition[i]).val() != 0) {
                                if (i == 0) { 
                                        cssObj_li_a_Padding += 'padding-' + $arrPosition[0] + ':' + $(idDiv).children().find("input.padding_ext_" + $arrPosition[0]).val()+'px !important;';
                                }
                                else {
                                        cssObj_li_a_Padding += 'padding-' + $arrPosition[i] + ':' + $(idDiv).children().find("input.padding_ext_" + $arrPosition[i]).val()+'px !important;';
                                }
                        }
                        // Get css margin
                        if ($(idDiv).children().find("input.margin_ext_" + $arrPosition[i]).val() != 0) {
                                if ( i== 0 ) {
                                        cssObj_li_a_Margin += 'margin-' + $arrPosition[0] + ':' + $(idDiv).children().find("input.margin_ext_" + $arrPosition[0]).val()+'px !important; ';
                                }
                                else {
                                        cssObj_li_a_Margin += 'margin-' + $arrPosition[i] + ':' + $(idDiv).children().find("input.margin_ext_" + $arrPosition[i]).val()+'px !important; ';
                                }
                        }
                }
                if (cssObj_li_a_Padding != ' ') {css+=cssObj_li_a_Padding;}
                if (cssObj_li_a_Margin != ' ') {css+=cssObj_li_a_Margin;}


                return css;
        }
        /**
         * Change icon button when hover, active, visited
         */
        function changeIconButton(idDiv, event) {
        	 var idCheck;
        	 var css = " ";
        	 
        	 // Set idCheck with event
             if (event == 'hover') {idCheck = '#ahrefHandleIconHover';}
             else if (event == 'active') {idCheck = '#ahrefHandleIconActive';}
             else if (event == 'visited') {idCheck = 'ahrefHandleIconVisited';}
             var UrlIcon = $("#preview").contents().find(idCheck).css('background-image');
             
             if (UrlIcon != 'none' && UrlIcon != undefined) {
            	// Get all style #ahrefHandleIconHover
            	 var cssPosition = $("#preview").contents().find(idCheck).css('background-position');
            	 css += 'background-image:' + UrlIcon + ';' + 'background-position:' +  cssPosition + ';';
             }
             if (css != ' ') {
                 // Add !important
            	 css = css.replace(/;/gi, ' !important ;');
            	 return css;
             }
        }
        
        /**
         * Change background button when active, hover, visited
         * @param idDiv is div contain input of status button
         * @param event is event of button
         */
        function changeBgButton(idDiv, event)
        {    
                var cssBgColor, css = ' ';
                var cssBgImage = " ";
            	// Check transparent
                if ($(idDiv).children().find('input.bg_checkbox').is(':checked')) {
                        cssBgColor =  'background-color:' + $(idDiv).children().find('input.bg_color').val()+' !important;';
                }
                /**
                 * Get background-image, repeat, position
                 */ 
                var idCheck;
                // When hover button
                if (event == 'hover') {
                	
                	idCheck = '#ahrefHandleHover';
                }
                // When active button
                if (event == 'active') {
                	idCheck = '#ahrefHandleActive';
                     //   cssBgImage = $("#preview").contents().find('#ahrefHandleActive').attr('style');
                }
                // When visited button
                if (event == 'visited') {
                	idCheck = '#ahrefHandleVisited';
                }
                // Get css
                var selector =  $("#preview").contents().find(idCheck);
                // Get css background-image
                if (selector.css('background-image') != undefined) {
                	cssBgImage += 'background-image:' + selector.css('background-image') + ';';
                }
                // Get css background-position
                if (selector.css('background-position') != undefined) {
                	cssBgImage += ' background-position:' + selector.css('background-position') + ';';
                }
                // Get css background-repeat
                if (selector.css('background-repeat') != undefined) {
                	cssBgImage += ' background-repeat:' + selector.css('background-repeat') + ';';
                }
                if (cssBgColor != undefined) {css+= cssBgColor;};
                if (cssBgImage != undefined) {
                        // Add !important
                        cssBgImage = cssBgImage.replace(/;/gi, ' !important ;');
                        css += cssBgImage;
                }
            	if (css != ' ') {return css;}
        }

        /*-------------------
	* Function Name: ChangeFontButton
	* Description: Change font button
        -------------------- */           
        function ChangeFontButton(idDiv, event)
        {         	
                var cssObj = 
                        'font-family:'+  $(idDiv).children().find("select.fontflied").val()+';'+
                        'font-size:'+  $(idDiv).children().find("input.sizefield").val()+'px;'+
                        'font-weight:'+  $(idDiv).children().find("select.fweight").val()+';'+
                        'font-style:'+  $(idDiv).children().find("select.fstyle").val()+';'+
                        'text-decoration:'+  $(idDiv).children().find("select.fdecoration").val()+';'+
                        'text-transform:'+  $(idDiv).children().find("select.ftransform").val()+';'+
                        'color:'+  $(idDiv).children().find("input.fcolor").val()+';';

                var align1 = $(idDiv).children().find("select.leftal").val();
                var align2 = $(idDiv).children().find("select.comboxofver").val();
                var spinAlign1 = $(idDiv).children().find("input.spinleft").val();
                var spinAlign2 = $(idDiv).children().find("input.spinvertical").val();
                if(align2 != "middle" || align1!="center"){
                        cssObj+='position:absolute !important;';
                }

                cssObj += Checkpsotion(align1,spinAlign1,'center','left','right',align2);
                cssObj += Checkpsotion(align2,spinAlign2,'middle','top','bottom',align1);
                return cssObj;
        } 
        /*-------------------
	* Function Name: changeFontButtonActive
	* Description: Change font active button
        -------------------- */          
        function changeFontButtonActive(id_element_menu, idDiv, event)
        {         	
                var cssObj_a_active = 
                        'font-family:'+  $(idDiv).children().find("select.fontflied").val()+';'+
                        'font-size:'+  $(idDiv).children().find("input.sizefield").val()+'px;'+
                        'font-weight:'+  $(idDiv).children().find("select.fweight").val()+';'+
                        'font-style:'+  $(idDiv).children().find("select.fstyle").val()+';'+
                        'text-decoration:'+  $(idDiv).children().find("select.fdecoration").val()+';'+
                        'text-transform:'+  $(idDiv).children().find("select.ftransform").val()+';'+
                        //'text-align:'+  Ext.getCmp('button_default_type_algin_active').getValue()+';'+
                        'color:'+  $(idDiv).children().find("input.fcolor").val()+';';
                        var align1 = $(idDiv).children().find("select.leftal").val();
                        var align2 = $(idDiv).children().find("select.comboxofver").val();
                        var spinAlign1 = $(idDiv).children().find("input.spinleft").val();
                        var spinAlign2 = $(idDiv).children().find("input.spinvertical").val();

                        cssObj_a_active+='position:relative;';
                        if(align2=='Left'){cssObj_a_active +='letter-spacing:'+ spinAlign1+';'}
                        if(align2=='Center'){cssObj_a_active+='letter-spacing:'+ spinAlign1+';'}
                        if(align2=='Right'){cssObj_a_active+='letter-spacing:'+ spinAlign1+';'}
                        if(align1=='Bottom'){cssObj_a_active +='bottom:'+spinAlign2+';'}
                        if(align1=='Top'){cssObj_a_active +='top:'+spinAlign2+';'}
                        if(align1=='Center'){cssObj_a_active +='center:'+spinAlign2+';'}
                if($(idDiv).children().find("input:eq(0)").attr("checked")==true)    //apply to all menu
                {                
                        //cssrules.append('ul#css3menu li a:hover{'+cssObj_a_hoover+'}'); 
                        for(i=1;i<=num_menu;i++)
                        {
                                cssrules.append('ul#mainmenu li#main_menuone_'+i+' a:'+event+'{ '+cssObj_a_active+'}');                                                 
                               //$styles = 'ul#css3menu li.main_menuone_'+i+' a:hover{'+cssObj_a_hoover+'}';
                               //hover submenu
                                //dyn_css_rule('ul#mainmenu li.main_menuone_'+i+' ul.submenu_a li.submenu_a_a a:active',cssObj_a_active);


                        }                        
                }
                else//apply  to this button seleect
                {       

                        if(curent_mainmenu!="")
                        {
                                cssrules.append('ul#mainmenu li#'+curent_mainmenu+' a:'+event+'{ '+cssObj_a_active+'}'); 
                        }
                        else
                        {
                                cssrules.append('ul#mainmenu li#main_menuone_1 a:'+event+'{ '+cssObj_a_active+'}');                         
                        } 
                }  
        } 
        function Checkpsotion(combo,spin,middle,comparevalue1,comparevalue2,combo2){
                var newvalue='';
                if(!spin && combo != middle){
                        newvalue = combo+':5px !important;';
                    if(combo !=comparevalue1){
                                newvalue = combo +":5px !important; "+comparevalue1+":auto !important;";
                    }else
                        newvalue = combo +":5px !important; "+comparevalue2+":auto !important;";
                }
                 if(combo != middle && combo && spin){
                        newvalue = combo +":"+ spin+"px !important;";
                        if(combo !=comparevalue1){
                                newvalue = combo +":"+spin+"px !important; "+comparevalue1+":auto !important;";
                    }else
                        newvalue = combo +":"+spin+"px !important; "+comparevalue2+":auto !important;";
                 }
                 if(combo==middle ){
                        if(combo == "center"){
                                newvalue = "left:0px !important; right:0px !important;";
                        }else
                                newvalue = "bottom:auto !important; top:auto !important;";
                        if(combo2 !="center"){
                                newvalue += "bottom:auto !important; top:auto !important;";
                        }else if(combo2 !="middle"){
                                newvalue+= "left:0px !important; right:0px !important;";
                        }
                }
                return newvalue
	}
        /**
         * Function get all menu
         * @param control is name of control
         * @returns {Array}
         */
        function getAllMenuButton(control)
        {
        	var buttons = {},
        	selector;
        
        	if (control == 'Typeofbutton' || 
        			control == 'Style-text') {
        		selector = '_a_a span';
        	}
        	if (control == 'background-icon' || 
        			control == 'Iconbutton-position') {
        		selector = '_a_a span.icon_menu_handle';
        	}
        	
        	for(i = 1; i <= window.num_menu; i++) {
        		buttons['#main_menuone_' + i + selector] = [control];
        		for(j = 1; j <= window.numsubmenu; j++) {
        			buttons['#sub_main_menuone_' + i + '_' + j + selector] = [control];
        		};
        	}
        	
        	return buttons;
        }
        
        /**
         * Apply css for all menu button
         * @param section		A secion in right.
         */
        function applyAllMenuButton(section)
        {
        	var style;
        	
        	// Type
        	if (section == 'type') {
        		style = $('#preview').contents().find(id).find('.text_menu_link').attr('style');
        		if (!style) {
        			return false;
        		}
        		for(var i = 1; i <= window.num_menu; i++) {
					$('#preview').contents().find('#main_menuone_' + i + '_a_a').find('.text_menu_link').attr('style', style);
					for(var j = 1; j <= window.numsubmenu; j++) {
						$('#preview').contents().find('#sub_main_menuone_' + i + '_' + j + '_a_a').find('.text_menu_link').attr('style', style);
					};
				}
        	}
        	
        	// Icon
        	if (section == 'icon') {
        		style = $('#preview').contents().find(id).find('.icon_menu_handle').attr('style');
        		if (!style) {
        			return false;
        		}
        		for(var i = 1; i <= window.num_menu; i++) {
					$('#preview').contents().find('#main_menuone_' + i + '_a_a').find('.icon_menu_handle').attr('style', style);
					for(var j = 1; j <= window.numsubmenu; j++) {
						$('#preview').contents().find('#sub_main_menuone_' + i + '_' + j + '_a_a').find('.icon_menu_handle').attr('style', style);
					};
				}
        	}
        }
/**************************************************************************************************************/
       
        /**
         * Get all element menu from template , and show these in list_all_menu control
         */
        function getAllMenuForEdit() {
        	// Get all menu from template
        	var all_menu = $('#preview').contents().find('#mainmenu').html();
    		$('#list_all_menu').html(all_menu);
    		$('#list_all_menu li').prepend('<div class="dropzone"></div>');
    		// Remove onclick
    		$('#list_all_menu a').removeAttr('onclick');
    		// Add event onclick, dbclick
    		$('#list_all_menu li').each(function() {
	 			var id = this.id;
	 			$('#' + id + ' a').attr("onClick","activeButtonMenu(\'"+id+"\');return false;");
	 			$('#' + id + ' a').attr("onDblclick","editTextMenu(\'"+id+"\');return false;");
    		});
    		// Add class for submenu
    		$('#list_all_menu ul').each(function() {
	 			var id_ul = this.id;
	 			$('#' + id_ul).addClass('submenu');
    		});
    		dragDrop();
        }
        
        /**
         * Apply all element menu from control list all menu into iframe review
         */
        function applyAllMenuAfterEdit() {
        	// Get all element from list_all_menu of control
        	var all_element = $('#list_all_menu').html();
        	$('#preview').contents().find('#mainmenu').html(all_element);
        	// Remove onclick
        	$('#preview').contents().find('#mainmenu a').removeAttr('onclick');
        	// Remove dbclick
        	$('#preview').contents().find('#mainmenu a').removeAttr('ondblclick');
        	// Remove class submenu
        	$('#preview').contents().find('#mainmenu ul').removeClass('submenu');
        	// Remove after drag drop
        	$('#preview').contents().find('#mainmenu li').removeClass('ui-draggable ui-draggable-dragging');
        	$('#preview').contents().find('#mainmenu a').removeClass('ui-droppable');
        	$('#preview').contents().find('#mainmenu li').attr('style', '');
        	$('#preview').contents().find('.dropzone').remove();
        	$('#preview').contents().find('span').removeClass('add_margin');
        	$('#preview').contents().find('li').css('left', '');
        	$('#preview').contents().find('li').css('top', '');
        }
        /**
         * Update text menu
         *
         */        
          function updateTextMenu(e)
          {  
			if ($('#edit_text_hide').attr('name') != undefined) {
				var id_button = $('#edit_text_hide').attr('name');
				
				var value_text_box= $('#edit_text_hide').val();
				//valueTextBox = valueTextBox + String.fromCharCode(e.keyCode);
				$('#' + id_button + ' span:eq(1)').text(value_text_box);
			}
			if(e.keyCode == 13 || e.keyCode === 27) {
				$('#edit_text_hide').hide();
			}
			applyAllMenuAfterEdit();
          }
        
        /**
         * Edit text menu
         *
         */        
          function editTextMenu(id_click)
          {
        	var position_parent;
        	var final_position;
        	// Init textbox
          	var current_position = $('#' + id_click).position();
          	if (current_position == null) {
          		return false;
          	}
          	current_position.top = parseInt(current_position.top);
        	// Set position for submenu
        	if (id_click.indexOf('sub') != -1) {
        		var ul_li_parent = $('#' + id_click).parent('ul').attr('id');
        		var li_id_parent = $('#' + ul_li_parent).parent('li').attr('id');
        		position_parent = $('#' + li_id_parent).position();
        		position_parent.top = parseInt(position_parent.top);
        		final_position = current_position.top + position_parent.top;
        	}
        	else {
        		final_position = current_position.top;
        	}
        	
        	
        	$("#edit_text_hide").css("top", final_position);
        	$('#edit_text_hide').show();
        	$("#edit_text_hide").attr('name', id_click);
        	$("#edit_text_hide").val($('#' + id_click + ' span:eq(1)').text());
        	$("#edit_text_hide").focus(); 
          }
        /**
         * Update link menu
         *
         */        
          function updateLinkMenu(e)
          {  
    		var value_text_box_link = $('#id_link_button_menu').val().toString();
    		//valueTextBoxLink = valueTextBoxLink + String.fromCharCode(e.keyCode);
        	$('#list_all_menu a.active_element_menu').attr('href', value_text_box_link);
        	applyAllMenuAfterEdit();
        	
          }
        /**
         * Active button menu
         *
         */        
          function activeButtonMenu(id_click)
          {  
        	//Hide textbox edit text menu
        	$('#edit_text_hide').hide();
        	// Add class active_element_menu and remove class at orther element
        	var id_has_class = $('#list_all_menu a.active_element_menu').parent('li').attr("id");
        	if (id_has_class != undefined) {
        		// Remove class
        		$('#' + id_has_class + ' a').removeClass('active_element_menu');
        	}
        	if (id_has_class != id_click) {
	        	// Add class this element
	        	$('#' + id_click + ' a:first').addClass('active_element_menu');
        	}
        	// Reload link to textbox edit link
        	var value_href = $('#' + id_click +' a:first').attr("href");
        	$('#id_link_button_menu').val(value_href);
        	// Disable button add submenu
        	disableButtonAddSubmenu();
          }
        /**
         * Disable button add submenu
         */
          function disableButtonAddSubmenu() {
        	  var id_has_class = $('#list_all_menu a.active_element_menu').parent('li').attr("id");
        	  var id_check;
        	  if (id_has_class != undefined) {
        		  if (id_has_class.indexOf('sub') != -1) {
        			  $('#add-submenu').attr('disabled', 'disabled');
        		  }
        		  else {
        			  // Have select element and this element is not submenu
        			  id_check = id_has_class;
        		  }
        	  }
        	  else {
        		  // Have not select element
        		  var id_last_main_menu = this.findLastElementMainMenu();
        		  id_check = id_last_main_menu;
        		  
        	  }
        	  if (id_check != undefined && $('#' + id_check).children().length > 2) {
        		  $('#add-submenu').attr('disabled', 'disabled');
        	  }
    		  else {
    			  if (id_check != undefined) {
    				  // Enable button add submenu
    				  $('#add-submenu').removeAttr('disabled');
    			  }
        	  }
          }
        /**
         * Delete button
         *
         */        
          function deleteButton()
          {  
        	  // Get id element with class active
        	var id_choose = $('#list_all_menu a.active_element_menu').parent('li').attr("id");
        	if (id_choose != undefined) {
        		// Is submenu
      		  	if (id_choose.indexOf('sub') != -1) {
      		  		// Check this element is union submenu
      		  		var parent_element = $('#' + id_choose).parent('ul').attr("id");
      		  		var count_children = $('#' + parent_element).children().length;
      		  		if (count_children > 1) {
      		  			$('#' + id_choose).remove();
      		  		}
      		  		else {
      		  			$('#' + parent_element).remove();
      		  		}
      		  	}
      		  	else {
      		  		// Remove this element
      		  		$('#' + id_choose).remove();
      		  	}
        	}
        	applyAllMenuAfterEdit();
        	 // Disable button add submenu
       	  	disableButtonAddSubmenu();
       	  	dragDrop();
          }
          /**
           * Function init string add submenu button element 
           */
          function initStringAddSubmenu(id_ul, id_new_element) {
        	  return '<ul  class = "submenu" id = "'+id_ul+'"><li id = "'+id_new_element+'"><div class="dropzone"></div><a href = "#"  ondblclick = "editTextMenu(\''+id_new_element+'\');return false;" onclick = "activeButtonMenu(\''+id_new_element+'\'); return false;"><span class = "icon_menu_handle">&nbsp;</span><span class="text_menu_link add_margin">Submenu</span>&nbsp;</a></li></ul>';
          }
         /**
         * Add button for sub menu . Apply to control list all buttons
         *
         */
          function addButtonSubMenu()
          {  
        	  // Get id element with class active
        	  
        	  var id_choose = $('#list_all_menu a.active_element_menu').parent('li').attr("id");
        	  var id_new_element;// = createIdSubmenu(idChoose);
        	  if (id_choose != undefined) {
        		  var id_ul = 'submenu_' + id_choose;
        		  // If idChoose is submenu, add new element after the last element in submenu
        		  if (id_choose.indexOf('sub') != -1) {
        			  // Pending waiting for confirm customer
        			  var id_last_main_menu = this.findLastElementMainMenu();
	        		  if (id_last_main_menu != undefined) {
	        			  if ($('#' + id_last_main_menu).children().find("li:first").html() == undefined) {
	        				  id_new_element = createIdSubmenu(id_last_main_menu);
	        				  $('#' + id_last_main_menu).append(initStringAddSubmenu('submenu_'+id_last_main_menu, id_new_element));
	        			  }
	        		  }
        			  
        			  
        		  }
        		  else {
        			// Check button have no children
        			if ($('#' + id_choose).children().find("li:first").html() == undefined) {
        				id_new_element = createIdSubmenu(id_choose);
        				$('#' + id_choose).append(initStringAddSubmenu(id_ul, id_new_element));
        			}
    	      		
        		  }
        	  }
        	  else {
	        		var id_last_main_menu = this.findLastElementMainMenu();
	        		if (id_last_main_menu != undefined) {
	        			if ($('#' + id_last_main_menu).children().find("li:first").html() == undefined) {
	        				id_new_element = createIdSubmenu(id_last_main_menu);
	        				$('#' + id_last_main_menu).append(initStringAddSubmenu('submenu_'+id_last_main_menu, id_new_element));
	        			}
	        		}
        	  }
        	  applyAllMenuAfterEdit();
        	  // Disable button add submenu
        	  disableButtonAddSubmenu();
        	  dragDrop();
          }
        /**
         * Function init string add button element 
         */
          function initStringAddButton(id_new_element, text_element) {
        	  return '<li id = "'+id_new_element+'"><div class="dropzone"></div><a style="position: relative" href = "#" ondblclick = "editTextMenu(\''+id_new_element+'\');return false;" onclick = "activeButtonMenu(\''+id_new_element+'\'); return false;"><span class = "icon_menu_handle">&nbsp;</span><span class = "text_menu_link add_margin">'+text_element+'</span>&nbsp;</a></li>';
          }
        /**
         * Add menu button. Apply to control list all buttons
         *
         */       
          function addButtonMenu()
          {        
        	  // Get id element with class active
        	  var id_choose = $('#list_all_menu a.active_element_menu').parent('li').attr("id");
        	  // Create id of new element
        	  var id_new_element = findMaxIdAndCreateNewId(id_choose, 1);
        	  if (id_choose != undefined) {
        		  // If idChoose is submenu, add new element after the last element in submenu
        		  if (id_choose.indexOf('sub') != -1) {
        			 var id_ul_tag_parent = $('#' + id_choose).parent('ul').attr("id");
        			 $('#' + id_ul_tag_parent + ' li').last().after(initStringAddButton(id_new_element, 'Submenu'));
        		  }
        		  else {
        			// Add button after this element with maxId
    	      		$('#' + id_choose).after(initStringAddButton(id_new_element, 'Button'));
        		  }
	        	  
        	  }
        	  else {
        		  var id_last_main_menu = this.findLastElementMainMenu();
        		  if (id_last_main_menu != undefined) {
        			  $("#" + id_last_main_menu).after(initStringAddButton(id_new_element, 'Button'));
        		  }
        		  else {
        			  $('#list_all_menu').after(initStringAddButton(id_new_element, 'Button'));
        		  }
        	  }
        	  applyAllMenuAfterEdit();
        	  // Disable button add submenu
        	  disableButtonAddSubmenu();
                  //reload element
        	  dragDrop();
                  
          }
        /**
         * Find max id of main menu or submenu in list all menu
         */
         function findMaxIdAndCreateNewId (current_id, flag) {
        	 var number_id = 0;
        	 var number_id_max = 0;
        	 var prefix_current_id = '';
        	 // Nothing selected in list all menu
        	 if (current_id == undefined) {
        		// Find menu_maxid
        		 $('#list_all_menu li').each(function() {
        			    var id_element = this.id;
        			    number_id = id_element.split("_");
        			    if (number_id.length == 2) {
        			    	number_id = number_id[1];
        			    	number_id = parseInt(number_id);
            			    if (number_id >= number_id_max) {
            			    	number_id_max = number_id;
            			    }
        			    }
        			    
        		 });
    			 // Return new id
    			 if (flag == 1) {
    				 number_id_max++;
    				 return 'menu_' + number_id_max;
    			 }
    			 // Return id max
    			 return 'menu_' + number_id_max;
        	 }
        	 else {
        		// Find max id same format currentId
        		var arr_string_id = current_id.split('_');
        		// Get length of current id
        		var count_current_element = arr_string_id.length;
        		// Create string of if for return 
        		for (var i = 0; i < arr_string_id.length - 1; i++) {
        			prefix_current_id += arr_string_id[i];
        			if (i != arr_string_id.length - 2) {
        				prefix_current_id += '_';
        			}
        		}
        		 $('#list_all_menu li').each(function() {
     			    var id_element = this.id;
     			   number_id = id_element.split("_");
     			    // Get id max
     			    if (number_id.length == count_current_element && current_id.indexOf(prefix_current_id) != -1) {
     			    	 
     			    	number_id = number_id[number_id.length-1];
     			    	number_id = parseInt(number_id);
         			    if (number_id >= number_id_max) {
         			    	number_id_max = number_id;
         			    }
     			    }
     			    
        		 });
        		if (prefix_current_id != '') {
        			// Return new id
        			if (flag == 1) {
        				number_id_max ++;
        				return prefix_current_id + "_" + number_id_max;
        			}
        			// Return id max
        			return prefix_current_id + "_" + number_id_max;
        		}
        	 }
        	 
         }
         /**
          * Function find last element in main menu  
          */
         function findLastElementMainMenu() {
        	 var arr_list_id = new Array();
        	 var i = 0;
        	 $('#list_all_menu li').each(function() {
 			    var id_element = this.id;
 			    
 			    number_id = id_element.split("_");
 			    if (number_id.length == 2 && number_id[0] == "menu") {
 			    	arr_list_id[i] = id_element;
 			    	i++;
 			    }
        	 });
        	 if (arr_list_id.length > 0) {return arr_list_id[arr_list_id.length-1];}
         }
         /**
          * Create id submenu with id of parent element
          */
         function createIdSubmenu(id_parent) {
        	 
        	if (id_parent != undefined) {
        		var max_id_in_parent = 0;
        		var number_id;
        		// When id_parent is main menu
        		if (id_parent.indexOf('sub') == -1) {
        			 $('#' + id_parent + ' li').each(function() {
          			    var idElement = this.id;
          			    number_id = idElement.split("_");
          			    // Get id max
          			    if (number_id.length == 4 && v.indexOf('level') == -1) {// id of sub 1
          			    	number_id = number_id[number_id.length-1];
          			    	number_id = parseInt(number_id);
              			    if (number_id >= max_id_in_parent) {
              			    	max_id_in_parent = number_id;
              			    }
          			    }
          			    
             		 });
        			return id_parent + '_sub_' + max_id_in_parent;
        		}
        	}
         }
          
         /**
          * Get list menu
          * @returns string
          */
         function getListMenu()
         {
        	var	str = '<ul class="style-list-all-menu">';
        	$('#preview').contents().find('#mainmenu > li').each(function(index) {
        		if (index % 2) {
        			str += '<li class ="style-color-odd" id=' + $(this).attr('id') + '>' + $(this).find('.text_menu_link').last().text() + '</li>';
        		} else {
        			str += '<li id=' + $(this).attr('id') + '>' + $(this).find('.text_menu_link').last().text() + '</li>';
        		}
        	});
        	str += '</ul>';
        	
        	return str;
         }
         
         /**
          * Change background-color for tag li of list all menu
          * @param selector
          */
         function changBackgroundColor(selector)
         {
        	selector.each(function(index) {
        		 if (index % 2) {
        			$(this).addClass('style-color-odd');
        		 } else {
        			$(this).removeClass('style-color-odd');
        		 }
        	 });
         }
         
         /**
          * Apply all for menu
          * @param selector
          */
         function applyForMenu(selector)
         {
        	var	html = '';
        	for(var i = 0; i < selector.find('li').length; i++) {
        		for(var j = 0; j < $('#preview').contents().find('#mainmenu li').length; j++) {
        			if (selector.find('li')[i].id == $('#preview').contents().find('#mainmenu li')[j].id) {
        				$('#preview').contents().find('#mainmenu').find('#' + selector.find('li')[i].id).appendTo($('#preview').contents().find('#mainmenu'));
        			}
        		}
        	}
         }
         /**
          * Call element panel on right and hide old panel
          **/
         function callElementMode()
         {                                                                                
                 $.ajax({
                        url: "action/getElementMode.php",
                        type: "POST",
                        data: {
                                firstLoad:firstLoad,
                                time:Math.random()
                        },  
                        success: function(data) {                                          
                                $("#navigation_controls").html(data);
                                //add class set headerfor element tab
                                $("#control_switcher").addClass("height_element");
                                //hide button next and pre
                                $("#control_next").hide();
                                $("#control_prev").hide();
                                //active panel body for content element
                                $('#preview').coffeeBuilder('activatePanel', 'body');
                                //set firstload  
                                firstLoad = 0;     
                                // Show list all menu in control                                
                                setTimeout('getAllMenuForEdit()', 1000);
                        }                          
                }); 
                      
         }
         
         /**
          * Drap drop for list menu in right panel
          */
          function dragDrop() {
              $('#list_all_menu li').draggable({
                  start: function() {
                      $(this).find('a').removeClass('active_element_menu');
                  },
                  revert: true
              });
              
      		$('#list_all_menu a, .dropzone').droppable({
          		drop: function(event, ui) {
  	    			$(this).filter('div').removeClass('ui-state-highlight');
  	        		$(this).filter('a').removeClass('ui-state-highlight');

  	    			var id;
          			if ($(this).is('div')) {
          				if (ui.draggable.find('ul > li').length && $(this).parent().parent().hasClass('submenu') == true) {
      	            		return false;
      	        		}
  						if (ui.draggable.parent().hasClass('submenu')) {
  							if ($(this).parent().parent().hasClass('submenu') == false) {
  								id = findMaxIdAndCreateNewId($(this).parent().attr('id'), 1);
  								ui.draggable.attr('id', id);
  								ui.draggable.find('a').last()
  										.attr('onClick', 'activeButtonMenu("' + id + '");return false;')
  		            					.attr('onDblClick', 'editTextMenu("'+ id + '");return false;');
  							}
  						} else {
  							if ($(this).parent().parent().hasClass('submenu')) {
  								id = findMaxIdAndCreateNewId($(this).parent().attr('id'), 1);
  								ui.draggable.attr('id', id);
  								ui.draggable.find('a').last()
  										.attr('onClick', 'activeButtonMenu("' + id + '");return false;')
  		                				.attr('onDblClick', 'editTextMenu("'+ id + '");return false;');
  							}
  						}
          				$(this).parent().before(ui.draggable);
              		} else {
              			if (ui.draggable.find('ul > li').length) {
      	            		return false;
      	        		}
                  		if ($(this).parent().has('ul').length) {
                      		id = findMaxIdAndCreateNewId($(this).siblings('ul').last().find('li').last().attr('id'), 1);
                      		ui.draggable.find('a').last()
  		        						.attr('onClick', 'activeButtonMenu("' + id + '");return false;')
  		        						.attr('onDblClick', 'editTextMenu("'+ id + '");return false;');
                  			ui.draggable.attr('id', id)
                  						.appendTo($(this).parent().find('ul').last());
                  		} else {
  	                		if ($(this).parent().parent().hasClass('submenu') == false) {
  		                		id = $(this).parent().attr('id') + '_sub_0';
  		                		$('<ul></ul>').addClass('submenu')
  		                					.attr('id', 'submenu_' + $(this).parent().attr('id'))
  		                					.appendTo($(this).parent());
  		                		ui.draggable.find('a').last()
  		                					.attr('onClick', 'activeButtonMenu("' + id + '");return false;')
  		                					.attr('onDblClick', 'editTextMenu("'+ id + '");return false;')
  		                		ui.draggable.attr('id', id).appendTo($(this).parent().find('ul').last());
  	                		}
                  		}
              		}
              		$('#list_all_menu ul').each(function() {
                  		if ($(this).has('li').length == 0) {
                      		$(this).remove();
                      	}
                  	});
              		applyAllMenuAfterEdit();
          		},
          		over: function() {
              		$(this).filter('div').addClass('ui-state-highlight');
              		$(this).filter('a').addClass('ui-state-highlight');
          		},
          		out: function() {
          			$(this).filter('div').removeClass('ui-state-highlight');
              		$(this).filter('a').removeClass('ui-state-highlight');
          		}
          	}).disableSelection();
          }
