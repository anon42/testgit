
var getAppXhr = null;

function get_lang_db()
{
	return {'en':
	{
		'aboutTab': 'About',
		'menuTab': 'Menu',
		'promotionTab': 'Promotion',
		'galleryTab': 'Gallery',
		'locationTab': 'Location',
		'menu': 'Menu',
		'promotion': 'Event & Promotion',
		'gallery': 'Gallery',
		'location': 'Location'
	},
	'th':
	{
		'aboutTab': 'เกี่ยวกับ',
		'menuTab': 'เมนู',
		'promotionTab': 'โปรโมชั่น',
		'galleryTab': 'อัลบั้ม',
		'locationTab': 'สถานที่ตั้ง',
		'menu': 'เมนู',
		'promotion': 'โปรโมชั่น',
		'gallery': 'อัลบั้ม',
		'location': 'สถานที่ตั้ง'
	}};
}

function l(key)
{
	var lang = $('#main').hasClass('th') ? 'th' : 'en';
	var lang_db = get_lang_db()[lang];

	return lang_db[key]
}

function update_core_lang(lang)
{
	var t = get_lang_db()[lang];

	$('#aboutTab a > span').text(t.aboutTab);
	$('#menuTab a > span').text(t.menuTab);
	$('#promotionTab a > span').text(t.promotionTab);
	$('#galleryTab a > span').text(t.galleryTab);
	$('#locationTab a > span').text(t.locationTab);
	
	$('#menu > dl.appDl > dt span.title').text(t.menu);
	$('#promotion > dl.appDl > dt span.title').text(t.promotion);
	$('#gallery > dl.appDl > dt span.title').text(t.gallery);
	$('#location > dl.appDl > dt span.title').text(t.location);
	$('div.menuDetails > dl.appDl > dt span.title').text(t.menu);
	$('div.promotionDetails > dl.appDl > dt span.title').text(t.promotion);
}

function set_text($element, value, placeholder)
{
	if (value != null && value)
	{
		$element.text(value);
	}
	else
	{
		$element.text(placeholder);
	}
}

function load_logo(logo)
{
	if (logo)
	{
		var newSrc = 'files/' + logo;
		var image = new Image();
		
		image.onload = function()
		{
			$('#applicationLogo div.image').append($(this)).fadeIn();
			$('#applicationLogo').css('background-image', 'url()');
		}

		image.src = newSrc;

		$('#applicationLogo div.image img').remove();
		$('#applicationLogo').css('background-image', 'url(images/aaa-spinner.gif)');
	}
	else
	{
		$('#applicationLogo').css('background-image', 'url("images/dropBackgroundSmall.png")');
	}
}

function load_background(background)
{
	$('#applicationBackground img').remove();

	if (background)
	{
		var newSrc = 'files/' + background;
		var image = new Image();
		
		image.onload = function()
		{
			$('#applicationBackground').css('background', 'url(images/dropBackground152.png) 0 0');
			$(this).insertBefore($('#applicationBackground > div.progressBar')).fadeIn();
		}

		image.src = newSrc;
		
		$('#applicationBackground').css('background', 'url(images/aaa-spinner.gif) center no-repeat');		

		$('#background').css('background', 'url(./files/' + background + ')');
	}
	else
	{
		$('#background').css('background', 'url()');		
		$('#applicationBackground > img').attr('src', '').hide();
	}
}

function load_splashscreen(splashscreen)
{	
	$('#applicationSplashscreen img').remove();
		
	if (splashscreen)
	{
		var newSrc = 'files/' + splashscreen;
		var image = new Image();
		
		image.onload = function()
		{
			$('#applicationSplashscreen').css('background', 'url(images/dropBackground152.png) 0 0');
			$(this).insertBefore($('#applicationSplashscreen > div.progressBar')).fadeIn();

			var clone = $(this).clone();
			$('#splashscreen-overlay').append(clone.css('opacity', 1));
		}

		image.src = newSrc;
		
		$('#applicationSplashscreen').css('background', 'url(images/aaa-spinner.gif) center no-repeat');		
		
		// $('div#apps > ul > li > div.app-text > dl.app-infos > dt > a.selected')
		// 	.parents('li');
		// 	.find('div.preview')
		// 	.css('background-image', 'url(' + './files/' + splashscreen + ')');
	}
}

function delete_app(app)
{
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=app',
				dataType : 'json',
				data:
				{
					remove: true,
					id: app
				},
				success : function(xhr_data)
				{					
					$('#apps li[rel|=' + app + ']').hide('blind', null, 'slow', function()
					{
						var next = $(this).next(":not(.loading)");
						
						if (!next.length)
						{
							next = $(this).prev(":not(.loading)");
						}
						
						$(this).remove();

						if (next.length)
						{
							$('#apps > ul > li').not('.loading').slice(2).hide();

							show_appropriate_app_page(next.attr('rel'));
							
							if ($('#main').attr('rel') == app)
							{
								show_app(next.attr('rel'), 'en');
							}

							toggle_apps_nav_visibility();
						}
						else
						{
							create_app();
						}
					});
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Delete App', 'You can\'t edit you app once it\'s approved', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});	
}

function show_app(app, lang)
{
	var link = null;
	var apps = $('#apps div.app-text dl.app-infos dt a');

	if (lang === undefined)
	{
		lang = 'en';
		if ($(this).hasClass('th'))
		{
			lang = 'th';
		}
		
		app = $(this).attr('rel');
		
		link = $(this);
	}
	else
	{		
		for (var i = 0; i < apps.length; i++)
		{
			if ($(apps[i]).attr('rel') == app)
			{
				link = apps[i];
				break;
			}
		}
	}
	
	th_log('load app #' + app + ' in ' + lang);
	$('#main').removeClass(lang == 'en' ? 'th' : 'en');
	$('#main').addClass(lang)
	$('#main').attr('rel', app);
	
	var selectedCss = {
		'font-weight': 'bold',
		'text-decoration': 'none'
	};
	var unselectedCss = {
		'font-weight': 'normal',
		'text-decoration': 'none'
	};

	$(apps).css(unselectedCss).removeClass('selected');
	$(link).css(selectedCss).addClass('selected');
	
	$('li.lang li').removeClass('selected');
	if (lang == 'en')
	{
		$('li.lang li:first-child').addClass('selected');
	}
	else
	{
		$('li.lang li:nth-child(2)').addClass('selected');
	}
	
	$('div#app-name').text($(link).text());

	$('#iphone, #overlay').fadeIn();
	hideAllBut(location.hash ? location.hash.substr(1) : 'first');
	
	if (getAppXhr != null)
	{
		getAppXhr.abort();
	}
	
	update_core_lang(lang);

	getAppXhr = $.ajax({
				type : 'GET',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'app',
					id: app,
					lang: lang
				},
				success : function(xhr_data)
				{
					if (xhr_data.status && xhr_data.status != 1)
					{
						$('#create').fadeOut();
						$('a#publish').fadeOut();
					}
					
					if (xhr_data.lat && xhr_data.lon)
					{
						$('#lat').val(xhr_data.lat);
						$('#lng').val(xhr_data.lon);						
					}
					else
					{
						$('#lat').val('13.8');
						$('#lng').val('100.7');
					}
					
					if (location.hash == '#location')
					{		
						load_map();
					}
					
					set_text($('span#description'), xhr_data.about, "Click to edit text");
					set_text($('#address'), xhr_data.address, "Click here to edit the address");
					set_text($('#email'), xhr_data.email, 'email@company.com');
					set_text($('#telephone'), xhr_data.telephone, '0xx - xxx - xxxx');

					var menus = new Menu();
					var modules = new Module();
					var promotions = new Promotion();
					var gallery = new Gallery();
					var theme = new Theme();

					theme.load_icons(xhr_data.icon);
					modules.load(xhr_data.modules);
					theme.load(xhr_data.theme);
					load_logo(xhr_data.logo);
					load_background(xhr_data.background);
					load_splashscreen(xhr_data.splashscreen);
					load_about_image(xhr_data.about_image);
					gallery.load(xhr_data.photos);
					promotions.load(xhr_data.promotions);
					menus.load(xhr_data.menu);
					
					getAppXhr = null;
					
					$('#overlay').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					$(apps).css(unselectedCss).removeClass('selected');
					$('#overlay, #iphone, #create, .next-step').fadeOut();
					show_publish('Can\'t Load App', 'Contact iphone@hosting.co.th if the problem persists', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	return false;
}

/* 	when loading the website, the page containing
 	the app might not be the first one.

	apps are like a set :
	[o, o, o, o, o]
	
	Apps page shows two apps per page.
	
	We get the index of the current app, compute
	its binome (either the previous or next elem in set)
	
	And hide all the set except the two
 */
function show_appropriate_app_page(current_app)
{
	// DOM selector
	var selector = '#apps div.app-text dl.app-infos dt a';

	// Get the set
	var $set = $(selector);

	// Get our element index
	var index = $set.not(function(index) { return $(this).attr('rel') != current_app }).index(selector);

	// Get is binome
	var binome = index % 2 == 0 ? index + 1 : index - 1;
	
	// Hide all the set...
	$set.parents('li').hide();

	// And then only show element & binome
	$set.not(function(cmp) { return index != cmp && binome != cmp }).parents('li').show();
	
	// update current page number
	$('#apps > h2 > span').text((Math.ceil(index / 2) + 1) + ' / ' + Math.ceil($set.length / 2));	
}

function load_prefs()
{
	$.ajax({
				type : 'GET',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'prefs'
				},
				success : function(data)
				{
					var appToShow = $('div#apps > ul > li').first().attr('rel');
					var langToShow = 'en';
					
					if (data != null && data.lang != null && data.lang)
					{
						langToShow = data.lang;
					}
										
					if (data != null && data.lang != null && data.app != null && data.lang && data.app)
					{
						if ($('dl.app-infos a[rel|="' + data.app + '"]').length != 0)
						{
							appToShow = data.app;
						}
					}
					
					if (data != null && data.uid != null && data.uid)
					{
						$('#users ul li a[rel|=' + data.uid + ']').css('font-weight', 'bold');
					}

					if ($('dl.app-infos a[rel|="' + appToShow + '"]').length != 0)
					{
						show_app(appToShow, langToShow);
					
						show_appropriate_app_page(appToShow);
					}

					toggle_apps_nav_visibility();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
}

function setup_appicon_upload($elem, app_id)
{
	$elem.fileUpload(
		{
		    url: 'ws.php?r=appicon&id=' + app_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/shine.png) 0 -57px no-repeat');
				$('img', $elem).css('display', 'none');
			},
			onDragLeave: function(event)
			{				
				$img = $('img', $elem);
				if ($img.attr('src') && $img.attr('src').length)
				{
					$elem.css('background', 'none');
					$img.css('display', 'block');
				}
				else
				{
					$elem.css('background', 'url(images/shine.png) 0 0 no-repeat');
				}
			},
			onDrop: function (event)
			{
				$('div.progressBar', $elem).css('display', 'block').progressbar({ 'value': 100 });
				$('img', $elem).remove();
				$elem.css('background', 'url(images/dropBackground.png) 0 0 no-repeat');
			},
			onProgress: function (event, files, index, xhr, handler)
			{
		        $('div.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				$('img', $elem).remove();
				
				if (xhr.status == 401)
				{
					th_log('401');
				}
				else
				{
					var json = $.parseJSON(xhr.responseText);
					
					var newSrc = 'files/' + json.name;
					var image = new Image();
				
					image.onload = function()
					{
						$elem.css('background', 'url()');
						$elem.append($(this).fadeIn());
					}
				
					image.src = newSrc;
				
					$elem.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
					$('div.progressBar', $elem).css('display', 'none');
				}
			}
		});	
}

function add_app(app)
{
	var li = $("#apps > ul > li.loading");
	var elem = $('<li>' +
			'<div class="preview">' +
				'<div class="file_upload">' +
					'<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">' +
				        '<label>' +
							'<input type="file" name="file[]" multiple>' +
						'</label>' +
				        '<button type="submit">Upload</button>' +
				    '</form>' +
					'<div class="progressBar"></div>' +
					'<div class="delete"><a href=""></a></div>' +
				'</div>' +
			'</div>' +
			'<div class="app-text">' +
				'<a href="" class="delete"></a>' +
				'<dl class="app-infos">' +
					'<dt><a href=""></a></dt>' +
					'<dd><span>Created</span></dd>' +
					'<dd><span>Updated</span></dd>' +
				'</dl>' +
				'<dl class="app-status">' +
					'<dt>Status</dt>' +
					'<dd>Not submited yet</dd>' +
					'<dd>' +
						'<ul>' +
							'<li><a href=""></a><span></span></li>' +
							'<li><a href=""></a><span></span></li>' +
							'<li><a href=""></a><span></span></li>' +
							'<li><a href=""></a><span></span></li>' +
							'<li><a href=""></a><span></span></li>' +
						'</ul>' +
					'</dd>' +
				'</dl>' +
			'</div>' +
		'</li>');

	var $icon_container = $('div.file_upload', elem);
	setup_appicon_upload($icon_container, app.id);

	if (app.appicon)
	{		
		var newSrc = 'files/' + app.appicon;
		var image = new Image();
	
		image.onload = function()
		{
			$icon_container.css('background', 'url()');
			$icon_container.append($(this).fadeIn());
		}
	
		image.src = newSrc;
	
		$icon_container.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
	}


	var status = ['Requested', 'Approved', 'Developing', 'Submited', 'Published'];
	$('dl.app-status ul li', elem).each(function(i, e)
	{
		$('span', this).text(status[i]);
	})
	
	if (app.status)
	{
		$('dl.app-status li a', elem).slice(0, app.status).addClass('done');
			
		$('dl.app-status dd', elem).first().text(status[(app.status - 1)]);
	}
		
	$('dl.app-status li a', elem).click(function()
	{
		var status = $(this).parent().index();
		
		$.ajax({
					type : 'POST',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'set_status',
						id: app.id,
						status: (status + 1)
					},
					success : function(data)
					{
						$('dl.app-status li a', elem).removeClass('done');
						$('dl.app-status li a', elem).slice(0, (status + 1)).addClass('done');
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
		return false;
	});

	$('div.app-text > a.delete', elem).click(function()
	{
		delete_app(app.id)
		
		return false;
	});
	
	$(elem).attr('rel', app.id);
	if (app.name.length > 11)
	{
		app.name = app.name.substring(0, 5) + '...' + app.name.substring(app.name.length - 3);
	}
	$('dl.app-infos > dt > a', elem).text(app.name).attr('rel', app.id).click(show_app);
	// if (app.splashscreen)
	// {
	// 	$('div.preview', elem).css('background-image', 'url(./files/' + app.splashscreen + ')');
	// }

	$($('dl.app-infos dd', elem).get(0)).append(app.created);
	$($('dl.app-infos dd', elem).get(1)).append(app.updated);

	elem.insertBefore(li);
}

function toggle_apps_nav_visibility()
{
	var all = $('#apps > ul > li').not('.loading');
	var visible = $('#apps > ul > li:visible').not('.loading');

	if (visible.first().prev().not('.loading').length == 0)
	{
		$('#apps-prev').hide();
	}
	else
	{
		$('#apps-prev').show();
	}
	
	
	if (visible.last().next().not('.loading').length == 0)
	{
		$('#apps-next').hide();
	}
	else
	{
		$('#apps-next').show();
	}
}

function load_apps()
{
	$('#create, #customize-buttons, #publish, #page-title').hide();

	$.ajax({
				type : 'GET',
				url : 'ws.php',
				dataType : 'json',
				data:
				{
					r: 'apps'
				},
				success : function(data)
				{
					if (data && data.length)
					{
						$.each(data, function(i, app)
						{
							add_app(app);
						});
						
						$('#apps > ul > li').not('.loading').slice(2).hide();

						load_prefs();					
					}
					else
					{
						th_log('create app');
						create_app();
					}

					$('#page-title').show();
					$("#apps > ul > li.loading").fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
}

function load_previous_apps_page()
{
	var selector = '#apps > ul > li:not(.loading)';
	var $set = $(selector);
	var visible = $set.filter(':visible');
	var prev = visible.first().prev(':not(.loading)');
	var index = prev.index(selector);

	visible.hide();
	prev.show();
	prev.prev(':not(.loading)').show();
	toggle_apps_nav_visibility();

	$('#apps > h2 > span').text(Math.ceil(index / 2) + ' / ' + Math.ceil($set.length / 2));

	return false;
}

function load_next_apps_page()
{
	var selector = '#apps > ul > li:not(.loading)';
	var $set = $(selector);
	var visible = $set.filter(':visible');
	var next = visible.last().next(':not(.loading)');
	var index = next.index(selector);
	
	visible.hide();
	next.show();
	next.next(':not(.loading)').show();
	toggle_apps_nav_visibility();
	
	$('#apps > h2 > span').text((Math.ceil(index / 2) + 1) + ' / ' + Math.ceil($set.length / 2));

	return false;
}

function switch_to_en()
{
		show_app($('#main').attr('rel'), 'en');
		$(this).parent().addClass('selected');
		$('#lang-th').parent().removeClass('selected');

		return false;
}

function switch_to_th()
{
	show_app($('#main').attr('rel'), 'th');
	$(this).parent().addClass('selected');
	$('#lang-en').parent().removeClass('selected');
	
	return false;
}

$(document).ready(function()
{	
	load_apps();

	$('#lang-en').parent().addClass('selected');
		
	$('#lang-en').click(switch_to_en);
	$('#lang-th').click(switch_to_th);
	
	$('#apps-prev').click(load_previous_apps_page);
	$('#apps-next').click(load_next_apps_page);
	
});