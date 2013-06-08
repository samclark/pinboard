window.open(
	'https://pinboard.in/add' 
	+ '?url='+encodeURIComponent(location.href)	
	+ '&title='+encodeURIComponent(document.title)
	+ '&description='+encodeURIComponent(window.getSelection().toString()),
	'Pinboard',
	'toolbar=no,width=700,height=350');
