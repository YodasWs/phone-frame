document.addEventListener('deviceready', function() {$=Zepto;

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
			btnBack.text('').addClass('glyphicon').addClass('glyphicon-chevron-left');
		}
		if (device.platform == 'iOS') {
			btnBack.prepend('<span class="glyphicon glyphicon-chevron-left"></span>');
			btnBack.addClass('btn').addClass('btn-default');
		}
		$('section:not(:first-of-type) > header').prepend(btnBack);
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

	// Login Form
	$('#login form').submit(function() {
		var password = $('#login form input[name="password"]').val();
		var username = $('#login form input[name="username"]').val();
		if (username && password) $.ajax({
			url: 'http://yodas.ws/fps/user', type:'POST', dataType:'text',
			data: { password:password, username:username },
//			headers: {'Origin':'urn:x-mobile:'+device.uuid},
			complete:function(xhr) { switch (xhr.status) {
			case 200:
				switchSection('#homebase');
				break;
			case 401:
			case 418:
			default:
				alert('error ' + xhr.status);
				switchSection('#login');
				break;
			} }
		}); else console.log('not logged in');
		return false;
	});

	// Login User at App Start
	$.ajax({
		url: 'http://yodas.ws/fps/user',
data:{uuid:'urn:x-mobile:'+device.uuid},
		type:'POST', dataType:'json', //headers:{'Origin':'urn:x-mobile:'+device.uuid},
		complete:function(xhr) {
			switch (xhr.status) {
			case 200:
				$('article#homebase').show().find('section').first().show();
				break;
			case 401:
			case 418:
			default:
				$('article#start, section#login').show();
				break;
			}
			$('#loading').animate({opacity:0}, 'slow', 'ease-out', function() {
				$(this).remove();
			});
		}
	});
}, false);

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
oldSection.closest('article').hide();
oldSection.hide();
newSection.closest('article').show();
newSection.show();
if (newSection.is('article'))
	newSection.find('section').first().show();
return;

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