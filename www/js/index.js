document.addEventListener('deviceready', function() {$=Zepto;

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
				switchSection('#index');
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
				$('article#index').show().find('section').first().show();
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