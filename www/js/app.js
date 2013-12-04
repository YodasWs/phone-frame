document.addEventListener('deviceready', function() { $ = Zepto;
	// Load device-specific styling
	switch(device.platform) {
	case 'WinCE': case 'Win32NT':
		$('link').first().after('<link rel="stylesheet" href="css/windowsphone.css"/>');
		break;
	case 'iOS':
		$('link').last().after('<link rel="stylesheet" href="css/ios.css"/>');
		break;
	case 'Android':
	default:
		$('link').last().after('<link rel="stylesheet" href="css/android.css"/>');
		break;
	}

	// Add Cross-Device Bootstrap Styling
	$('input[type="submit"]').addClass('btn').addClass('btn-default');
});