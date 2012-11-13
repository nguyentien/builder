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
			}
		}
	}
});
