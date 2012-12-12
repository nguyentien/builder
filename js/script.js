/**
 * Call coffeebuider
 */
$('#preview').coffeeBuilder({
	manifest: {
		panels: {
			page: {
				name: 'Page',
				customizations: {
					background: {
						name: 'Background',
						selectors: {'body': ['background']}
					}
				}
			},
			body: {
				name: 'Body',
				customizations: {
					background: {
						name: 'Background',
						selectors: {'body': ['background']}
					}
				}
			}
		}
	}
});

/**
 * Add top menu
 */
$('#preview').topMenu({
	preview: 1
});

/**
 * Add panel for button
 */
$('#preview').contents().delegate('a', 'click', function(event) {
	var id = $(this).parent().attr('id'),
		name = $(this).text(),
		selectors = {};
	
	// Stop event
	event.preventDefault();
	
	// Add panel
	if (!$('#controls').find('#' + id).length) {
		selectors['#' + id + ' > a'] = ['background'];
		$('#preview').coffeeBuilder('addPanel', id, {
			name: 'Menu button' + name,
			customizations: {
				background: {
					name: 'Background',
					selectors: selectors
				}
			}
		});
	}
	$('#preview').coffeeBuilder('activatePanel', id);
});
