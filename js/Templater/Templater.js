function S4()
{
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid()
{
	// fake UUID v4 : xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	return (S4() + S4() + "-" + S4() + "-4" + S4().substring(1) + "-y" + S4().substring(1) + "-" + S4() + S4() + S4());
}

function th_log(value)
{
  	if (this.console && typeof console.log != "undefined")
	{
		console.log(value);
	}
}

function initialize_addresspicker()
{
	$.getScript('js/Vendors/jquery.ui.addresspicker.js', function()
	{
		_load_map();
	});
}

// Really loads Maps when we're sure plugins are loaded
function _load_map()
{
	if ($('#lat').val())
	{
		var addresspickerMap = $('#map').addresspicker(
		{
			markerMoved: function(lat, lon)
			{
				$.ajax({
							type : 'POST',
							url : 'ws.php?r=address',
							dataType : 'json',
							data:
							{
								location: true,
								lat: lat.val(),
								lon: lon.val()
							},
							success : function(xhr_data)
							{
							},
							error : function(XMLHttpRequest, textStatus, errorThrown)
							{
								show_publish('Can\'t Update Location', 'You can\'t edit you app once it\'s approved', true);
								th_log(textStatus);
								th_log(errorThrown);
							}
						});
			},
			mapOptions:
			{
				zoom: 8,
				center: new google.maps.LatLng($('#lat').val(), $('#lat').val())
			},
			elements:
			{
				map:      "#map",
				lat:      "#lat",
				lng:      "#lng",
				locality: '#locality',
				country:  '#country'
			}
		});

		var gmarker = addresspickerMap.addresspicker("marker");


		gmarker.setVisible(true);
		addresspickerMap.addresspicker("reloadPosition");

		return addresspickerMap;
	}	
}

// Safely load map
function load_map()
{
	// Load everything only if we have lat and lng data
	if ($('#lat').val() && $('#lng').val())
	{
		$('#map').remove();
		var $map = $('<div id="map"></div>').css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		$('#location dd').not('.last').last().append($map);

		// If plugins are not loaded, load them first
		if ($.fn.addresspicker == undefined)
		{
			$.getScript('http://maps.google.com/maps/api/js?sensor=false&callback=initialize_addresspicker');		
		}
		else
		{
			_load_map();
		}
	}
}

function hideAllBut(elem)
{
	$('.iOSScroll').hide();
	$('ul#tabs > li').removeClass('selected');

	if (elem)
	{
		$('#' + elem).show();
		$('#' + elem + 'Tab').addClass('selected');
	}
	
	if (elem && elem == 'location')
	{
		load_map();
	}
	else if (elem && $('#' + elem).hasClass('menuDetails'))
	{
		$('#menuTab').addClass('selected');
		$('#backButton').show();
	}
	else if (elem && $('#' + elem).hasClass('promotionDetails'))
	{
		$('#promotionTab').addClass('selected');
		$('#backButton').show();
	}
	else if (elem && $('#' + elem).hasClass('photoDetails'))
	{
		$('#galleryTab').addClass('selected');
		$('#backButton').show();
	}
	else
	{
		$('#backButton').hide();
	}

	// Can edit if step #2 is not done
	var can_edit = $('#apps ul li[rel|=' + $('#main').attr('rel') + '] dl.app-status dd ul li:nth-child(2) a').hasClass('done') == false;
	if (elem == 'first')
	{		
		if (can_edit)
		{
			$('#create').fadeIn();
		}
		$('.next-step').fadeIn();
		$('#customize-buttons, a#publish').fadeOut();
		$('#tabs').hide();
	}
	else
	{
		$('#create, .next-step').fadeOut();
		if (elem)
		{
			$('#customize-buttons').fadeIn();
			if (can_edit)
			{
				$('a#publish').fadeIn();
			}
			$('#tabs').show();
		}
	}
	
	return false;
}

function create_app()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'app'
				},
				success : function(app)
				{
					if (app)
					{
						add_app(app);
						$('#apps > ul > li').not('.loading').slice(2).hide();
						show_appropriate_app_page(app.id);
						show_app(app.id, 'en');
						toggle_apps_nav_visibility();
					}
					else
					{
						show_publish('Can\'t Create App', 'You have Apps in progress, you need to wait for their publication', true);						
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Create App', 'Contact iphone@hosting.co.th if the problem persists', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	return false;
}

function check_register()
{
	var errors = false;

	var fields = $.map($('label.required > input'), function(e, i)
	{
		return $(e).attr('name');
	});
	
	$('#register label').removeClass('error');
	$.each(fields, function(i, field)
	{
		var $e = $('[name|=' + field + ']');
		if ($e.length == 0 || $e.val().length == 0)
		{
			$e.parents('label').addClass('error');
			errors = true;
		}
	})
	
	if ($('[name|=password]').val() != $('[name|=confirm]').val())
	{
		$('[name|=password]').parents('label').addClass('error');
		$('[name|=confirm]').parents('label').addClass('error');
		errors = true;			
	}
	
	if ($('[name|=conditions]').is(':checked') == false)
	{
		$('[name|=conditions]').parents('label').addClass('error');
		errors = true;
	}
	
	return errors;
}

function submit_register()
{
	th_log('submit');
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=register',
				dataType : 'json',
				data:
				{
					name: $('[name|=name]').val(),
					lastname: $('[name|=lastname]').val(),
					company: $('[name|=company]').val(),
					address: $('[name|=address]').val(),
					phone: $('[name|=phone]').val(),
					ext: $('[name|=ext]').val(),
					mobile: $('[name|=mobile]').val(),
					email: $('[name|=email]').val(),
					password: $('[name|=password]').val(),
					uid: $('[name|=uid]').val()
				},
				success : function(data)
				{
					if (data && data.length)
					{
						$('#register label').removeClass('error');
						$.each(data, function(i, field)
						{
							var $e = $('[name|=' + field + ']');
							if ($e.length != 0)
							{
								$e.parents('label').addClass('error');
							}
						});
					}
					else
					{
						window.location = window.location.href.replace(window.location.search, '');
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Register', 'Contact iphone@hosting.co.th if the problem persists', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
}

function register()
{
	var errors = check_register();
	
	if (!errors)
	{
		th_log('errors');
		submit_register();
	}
	
	return false;
}

function load_users()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'load_users'
				},
				success : function(users)
				{
					if (users)
					{
						$.each(users, function(i, e)
						{
							li = $('<li></li>').append($('<a href=""></a>').attr('rel', e.id).text(e.name).click(function()
							{
								$.ajax({
											type : 'POST',
											url : 'ws.php',
											dataType : 'json',
											data:
											{
												r: 'switch_user',
												id: e.id
											},
											success : function(users)
											{
												$('#users ul li a').css('font-weight', 'normal');
												$('#users ul li a[rel|=' + e.id + ']').css('font-weight', 'bold');
												$('#apps ul li').not('.loading').remove();
												load_apps();							
											},
											error : function(XMLHttpRequest, textStatus, errorThrown)
											{
												th_log(textStatus);
												th_log(errorThrown);
											}
										});
								
								return false;
							}));
							$('#users ul').append(li);
						})

					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
}

function show_publish(title, message, hide_publish)
{
	$('#publish-overlay h2').text(title);
	$('#publish-overlay p').text(message);
	if (hide_publish)
	{
		$('#publish-overlay a.confirm').hide();
	}
	else
	{
		$('#publish-overlay a.confirm').show();
	}
	$('#publish-overlay').fadeIn().css('display', 'table');
 	$("#scrollContainer").scrollTop(0, 0);
	$('#body, #scrollContainer').css('overflow', 'hidden');
	
	return false;
}

function hide_publish()
{
	$('#publish-overlay').fadeOut();
	$('#body, #scrollContainer').css('overflow', 'auto');

	return false;
}

function publish()
{
	hide_publish();
	$('#overlay').fadeIn();
	
	$.ajax({
				type : 'POST',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'publish'
				},
				success : function(app)
				{
					$('dl.app-status ul li:first-child a', $('#apps ul li[rel|=' + $('#main').attr('rel') + '] dl.app-infos dt a.selected').parents('div.app-text')).addClass('done');
					$('#publish, #create, #overlay').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Publish App', 'Contact iphone@hosting.co.th if the problem persists', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	
	return false;
}

function remove_logo()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=logo',
				dataType : 'json',
				data:
				{
					remove: true
				},
				success : function(xhr_data)
				{					
					$('#applicationLogo').css('background', 'url(images/dropBackgroundSmall.png) center top no-repeat');
					$('#applicationLogo div.image img').remove();
					$('#applicationLogo div.delete').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Remove Logo', 'You can\'t edit you app once it\'s approved', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});

	return false;
}

function setup_logo_delete_overlay()
{
	var hoverIntent = null;
	
	$('#applicationLogo').hover(function()
	{
		var elem = this;
		
		hoverIntent = setTimeout(function()
		{
			var $deleteDiv = $('div.delete', elem);
			var img = $('img', elem);
		
			var bg = $('div#applicationLogo').css('background-image');
			if (bg.indexOf('dropBackgroundSmall') == -1)
			{
				if ($deleteDiv.is(':animated'))
				{
					$deleteDiv.stop().fadeTo(400, 1);
				}
				else
				{
					$deleteDiv.fadeIn();
				}
			}			
		}, 100);
	}, function()
	{
		clearTimeout(hoverIntent);
		
		var img = $('img', this);
		var bg = $('div#applicationLogo').css('background-image');

		if (bg.indexOf('dropBackgroundSmall') == -1)
		{
			$('div.delete', this).fadeOut();
		}
	});
}

function setup_logo_upload()
{
	$('#applicationLogo').fileUpload(
	{
	    url: 'ws.php?r=logo',
	    onDragEnter: function (event)
		{
			$('#applicationLogo').css(
			{
				'background-image': 'url(images/dropBackgroundSmall.png)',
				'background-position': 'center -80px'
			});
		},
		onDragLeave: function (event)
		{
			$('#applicationLogo').css(
			{
				'background-image': 'url(images/dropBackgroundSmall.png)',
				'background-position': 'center top'
			});
		},
		onDrop: function (event)
		{
			$('#applicationLogo').css(
			{
				'background-image': 'url(images/dropBackgroundSmall.png)',
				'background-position': 'center top'
			});
			$('#logoProgressBar').css('display', 'block');
			$('#logoProgressBar').progressbar({ 'value': 100 });
			$('#applicationLogo div.image img').remove();
		},
		onProgress: function (event, files, index, xhr, handler)
		{
		    $('#logoProgressBar').progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
		},
		onLoad: function (event, files, index, xhr, handler)
		{
			$('#applicationLogo div.image img').remove();
			if (xhr.status == 401)
			{
				show_publish('Can\'t Add Logo', 'You cant change design after submit your app.', true);
			}
			else
			{
				var json = $.parseJSON(xhr.responseText);
				var newSrc = 'files/' + json.name;
				var image = new Image();
		
				image.onload = function()
				{
					$('#applicationLogo div.image').append($(this)).fadeIn();
					$('#applicationLogo').css('background-image', 'url()');
				}

				image.src = newSrc;

				$('#applicationLogo').css('background-image', 'url(images/aaa-spinner.gif)');
			}
			
			$('#logoProgressBar').css('display', 'none');
		}
	});
}

function back_button_clicked()
{
	var backTo = 'menu';

	if ($('#promotionTab').hasClass('selected'))
	{
		backTo = 'promotion';
	}
	else if ($('#galleryTab').hasClass('selected'))
	{
		backTo = 'gallery';
	}

	window.location.hash = backTo;
	hideAllBut(backTo);
	
	return false;
}

$(document).ready(function()
{	
	$('#publish').click(function()
	{
		return show_publish('Confirm Your App', 'You cant change design after submit your app.', false);
	});
	$('#publish-overlay a.cancel').click(hide_publish);
	$('#publish-overlay a.confirm').click(publish);

	if ((!$.browser.webkit && (parseInt($.browser.version, 10) >= 533)) &&
		(!$.browser.mozilla && (parseInt($.browser.version, 10) >= 2)))
	{
		$('#browser').show();
	}
	
	$('#browser .dismiss').click(function()
	{
		$('#browser').fadeOut();
		
		return false;
	});
	
	$(window).hashchange(function()
	{
		hideAllBut(location.hash.substr(1));
	});
	
	$('#backButton > a').click(back_button_clicked);
	$('a#new_app').click(create_app);
	
	$('form#register').submit(register);

	setup_logo_upload();
	setup_logo_delete_overlay();
	$('div#applicationLogo > div.delete > a').click(remove_logo);
	
	load_users();
	
	var menu = new Menu();
	$('#menu > dl > dt > a').click(function()
	{
		return menu.create_category();
	});
	
	var promotion = new Promotion();
	$('#promotion > dl > dt > a').click(function()
	{
		return promotion.create();
	});

	var gallery = new Gallery();
	gallery.setup();
	
	setup_location_editables();
	setup_description_editable();
	setup_aboutImage_upload();
	
	$('#username').focus();
	$('#login form').submit(function()
	{
		$('#login .spinner').fadeIn();

		$.ajax({
					type : 'POST',
					url : 'ws.php?r=login',
					dataType : 'json',
					data:
					{
						username: $('#username').val(),
						password: $('#password').val()
					},
					success : function(data)
					{
						$('#login label').removeClass('error');
						if (data.error)
						{
							$.each(data.error, function(i, e)
							{
								$('#' + e).parents('label').addClass('error');
							});
						}
						else
						{
							var paths = window.location.pathname.split('/');
							
							window.location = 'http://' + window.location.host + paths.splice(0, paths.length - 1).join('/');
						}
						
						$('#login .spinner').fadeOut();
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						$('#login .spinner').fadeOut();
						show_publish('Can\'t Login', 'You might need to confirm registration, see you\'re email for instructions', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
			
		return false;
	});
});
