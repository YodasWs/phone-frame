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

	// Change Section
	$('a[href^="#"]').click(function() {
		switchSection($(this).attr('href'), $(this).closest('section'));
		return false;
	});

	// Add Back Button to Home
	switch(device.platform) {
	case 'Android':
	case 'iOS':
		btnBack = $('<a href="#back">Back</a>').click(function() {
			switchSection('#'+$(this).closest('article').find('section').first().attr('id'));

			return false;
		});
		if (device.platform == 'Android') {
			btnBack.html($('<span>').addClass('glyphicon').addClass('glyphicon-chevron-left'));
		}
		if (device.platform == 'iOS') {
			btnBack.prepend('<span class="glyphicon glyphicon-chevron-left"></span>');
			btnBack.addClass('btn').addClass('btn-default');
		}
		$('section:not(:first-of-type) > header').each(function() {
			if (device.platform == 'Android') btnBack.append($(this).find('h1'));
			$(this).prepend(btnBack);
		});
	}

	// Add Button to Next Page
	switch(device.platform) {
	case 'Android':
	case 'iOS':
		btnNext = $('<a href="#next">Next Page</a>').click(function() {
			switchSection($(this).closest('section').next('section'));
			return false;
		}).addClass('btn').addClass('btn-default').css({
			float:'right'
		});
		$('section:not(:last-of-type)').append(btnNext);
	}

	// Make Dropdowns Selectable and Update Button Text
	$('.dropdown-menu.select > li').click(function() {
		$(this).attr('selected', 'selected').siblings('li').removeAttr('selected');
		$(this).closest('.btn-group').find('.btn').first().html($(this).text()+' <span class="caret"></span>');
		$(document).trigger('click.bs.dropdown.data-api');
	});

	// Toggle Dropdown Caret
	$(document).on('click.bs.dropdown.data-api', function() {
		$('.btn-group').each(function() {
			if ($(this).is('.open'))
				$(this).find('.caret').removeClass('caret-right').removeClass('caret-left');
			else
				$(this).find('.caret').addClass('caret-right');
		});
	});

});

function switchSection(newSection, oldSection) { $=Zepto;
	if (!oldSection)
		oldSection = $('section').filter(function() {
			return $(this).css('display') != 'none';
		});
	else if (typeof oldSection === 'string')
		oldSection = $(oldSection);
	if (typeof newSection === 'string' && newSection == '#home')
		newSection = $('#home > section').first();
	else if (typeof newSection === 'string')
		newSection = $(newSection);
	else if (typeof newSection !== 'object' || typeof newSection.closest !== 'function' || newSection.closest('article').attr('id') != 'home')
		return false;
	// Move to Same Section ?
	if (oldSection.attr('id') == newSection.attr('id')) {
		switch(device.platform) {
		case 'WinCE': case 'Win32NT':
			break;
		case 'iOS': case 'Android':
			oldSection.animate({
				opacity:0
			}, 'fast', 'ease', function() {
				oldSection.animate({
					opacity:1
				}, 'slow').find('input[type="password"]').val('');
			});
			break;
		}
		return false;
	}
//*
oldSection.closest('article').hide();
oldSection.hide();
newSection.closest('article').show();
newSection.show();
if (newSection.is('article'))
	newSection.find('section').first().show();
return;
//*/
	// Slide to New Section
	var direction = newSection.is(':first-of-type') ? 1 : -1;
	switch(device.platform) {
	case 'Android':
	case 'iOS':
		$('body').css({
			overflow:'hidden',height:$('window').height()
		});
		oldSection.css({
			position:'absolute',top:oldSection.offset().top+'px',width:'100%'
		});
		newSection.css({
			position:'absolute',top:-1*direction*$(window).height()+'px',width:'100%'
		}).show();
		oldSection.animate({
			top:direction*$(window).height()+'px'
		}, 'slow', 'ease', function() {
			$(this).hide();
		});
		newSection.animate({
			top:'0px'
		}, 'slow', 'ease', function() {
			$(this).css({position:''});
			oldSection.hide();
			$('body').css({overflow:'auto',height:'auto'});
		});
		break;
	case 'Win32NT':
	case 'WinCE':
		break;
	}
	return false;
}