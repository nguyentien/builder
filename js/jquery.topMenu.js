$.fn.topMenu = function(option) {
	var self = this,
		$html = $(
		'<div id="top_menu">' +
			'<div class="all_menus">' +
			'<a class="a_all" href="#">All Menus</a>' +
			'</div>' +
			'<div class="ele_dev_des">' +
			'<a class="a_ele" href="#">Element</a>' +
			'<a class="a_dev" href="#">Device</a>' +
			'<a class="a_des" href="#">Design</a>' +
			'</div>' +
			'<div class="export">' +
			'<a class="a_exp" href="#">Export</a>' +
			'</div>' +
		'</div>' +
		'<div class="clear"></div>' + 
		'<div id="top_title"><span>AAAAA</span></div>'
	);
	$html.insertBefore(this);
	
	// Active
	if (option.preview) {
		$('.a_ele').addClass('top_menu_active');
	}
	
	// Element click
	$('.a_ele').click(function() {
		var width = parseInt($('#layout-center').css('width'));
		if ($(this).hasClass('top_menu_active')) {
			$(this).removeClass('top_menu_active');
			$('#layout-center').css({'width': width + 347 + 'px', 'z-index': 10});
		} else {
			$('#layout-center').css({'width': width - 347 + 'px', 'z-index': 1});
			$(this).addClass('top_menu_active');
		}
		
		return false;
	});
	
	// Design click
	$('.a_des').click(function() {
		
	});
};