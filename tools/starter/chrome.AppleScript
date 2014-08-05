tell application "Google Chrome"
	activate
	tell window 1 to enter presentation mode
    execute front window's active tab javascript "
    	if (!$('iframe').first().contents().find('slide-live-save input').first().is(':checked')) {
    		$('iframe').first().contents().find('slide-live-save input').first().click();
    	}
    "
end tell