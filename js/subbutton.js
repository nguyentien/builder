$(document).ready(function(){
	$("#body_subpanel_defaults_title").hide();
	$("#body_subpanel_title_title").width('65px');
	$("#body_subpanel_hoover_title").hide();
	$("#body_subpanel_nav_title").width('65px');
	$("#body_subpanel_active_title").hide();
	$("#body_subpanel_submenu_title").width('65px');
	$("#body_subpanel_visited_title").hide();
	$("#body_subpanel_button_title").width('65px');
	$("#body_subpanel_content_title").width('67px');

	var i=1;
	$("#body_subpanel_button_title").one('click',function() {
	  $("#body_subpanel_defaults_controls").children().find("fieldset").each(function() {
	    $(this).attr({
	      'id': function(_, id) { return id + i },
	      'name': function(_, name) { return name + i },
	      'value': ''               
	    });      
	  }).end().appendTo("div#tab_default_contents");
	 i++;
	 return false;
	});
	
	var i=1;
	$("#body_subpanel_button_title").one('click',function() {
	  $("#body_subpanel_hoover_controls").children().find("fieldset").each(function() {
	    $(this).attr({
	      'id': function(_, id) { return id + i },
	      'name': function(_, name) { return name + i },
	      'value': ''               
	    });      
	  }).end().appendTo("div#tab_hoover_contents");
	 i++;
	 return false;
	});
	
	var i=1;
	$("#body_subpanel_button_title").one('click',function() {
	  $("#body_subpanel_active_controls").children().find("fieldset").each(function() {
	    $(this).attr({
	      'id': function(_, id) { return id + i },
	      'name': function(_, name) { return name + i },
	      'value': ''               
	    });      
	  }).end().appendTo("div#tab_active_contents");
	 i++;
	 return false;
	});
	
	var i=1;
	$("#body_subpanel_button_title").one('click',function() {
	  $("#body_subpanel_visited_controls").children().find("fieldset").each(function() {
	    $(this).attr({
	      'id': function(_, id) { return id + i },
	      'name': function(_, name) { return name + i },
	      'value': ''               
	    });      
	  }).end().appendTo("div#tab_visited_contents");
	 i++;
	 return false;
	});

	$('.tab').click(function () {
	     $('#tabs_container_button > .tabs > li.active')
	             .removeClass('active');
	     $(this).parent().addClass('active');
	     $('#tabs_container_button > .tab_contents_container > div.tab_contents_active')
	             .removeClass('tab_contents_active');
	     $(this.rel).addClass('tab_contents_active');
	     var tab=$(this).text();
	     
	     // Unset variable
	     if (tab == 'Default') {
		    if ($('.checkbox-applyall-type-default').attr('checked') == true){
		    	CoffeeBuilderControl.apply.regular.type = 1;
		    } else {
		    	CoffeeBuilderControl.apply.regular.type = 0;
		    }
		    
		    if ($('.checkbox-applyall-icon-default').attr('checked') == true){
		    	CoffeeBuilderControl.apply.regular.icon = 1;
		    } else {
		    	CoffeeBuilderControl.apply.regular.icon = 0;
		    }
		    
	     }
	     if (tab == 'Hoover') {
	    	 CoffeeBuilderControl.apply.regular.type = 0;
	    	 CoffeeBuilderControl.apply.regular.icon = 0;
		 }
	     if (tab == 'Active') {
	    	 CoffeeBuilderControl.apply.regular.type = 0;
	    	 CoffeeBuilderControl.apply.regular.icon = 0;
		 }
	     if (tab == 'Visited') {
	    	 CoffeeBuilderControl.apply.regular.type = 0;
	    	 CoffeeBuilderControl.apply.regular.icon = 0;
		 }
	 });
       
       
                
       /**
       * hide tabbutton, call when click over tab of body panel
       *
       */   
         function hideTabButton()
         {
                if($('#body_subpanel_button_title').hasClass('active'))
                        $('#body_subpanel_button_title').removeClass('active')
                if($('#body_subpanel_button_controls').hasClass('active'))
                        $('#body_subpanel_button_controls').removeClass('active')                 
         }
       /**
       * hide tabbutton, call when click over tab of body panel
       *
       */            
         function hideTabMenu()
         {
                if($('#body_subpanel_nav_title').hasClass('active'))
                        $('#body_subpanel_nav_title').removeClass('active')
                if($('#body_subpanel_nav_controls').hasClass('active'))
                        $('#body_subpanel_nav_controls').removeClass('active')                 
         }         

        $("#body_subpanel_nav_title").one('click',function() {
                hideTabButton();
	});
        $("#body_subpanel_button_title").one('click',function() {
                hideTabMenu();
	});        
        $("#body_subpanel_title_title").one('click',function() {
                hideTabButton();
                hideTabMenu();
	});        
        $("#body_subpanel_submenu_title").one('click',function() {
                hideTabButton();
                hideTabMenu();                
	});
        $("#body_subpanel_content_title").one('click',function() {
                hideTabButton();
                hideTabMenu();                
	}); 
        $("#control_prev").one('click',function() {
                hideTabButton();
                hideTabMenu();                
	});
        $("#control_next").one('click',function() {
                hideTabButton();
                hideTabMenu();                
	}); 
       
       $(".file").attr("disabled",true); 
   
});


