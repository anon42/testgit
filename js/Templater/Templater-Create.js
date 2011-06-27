function setup_splashscreen_delete_overlay()
{
	var hoverIntent = null;
	$('div#applicationSplashscreen').hover(function()
	{
		var elem = this;
	
		hoverIntent = setTimeout(function()
		{
			var $overlay = $('#splashscreen-overlay');
			var $deleteDiv = $('div.delete', elem);
			var img = $('img', elem);
		
			if (img.attr('src'))
			{
				if ($overlay.is(':animated'))
				{
					$overlay.stop().fadeTo(400, 1);
				}
				else
				{
					$overlay.fadeIn();
				}
	
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
		var img = $('img', this);
	
		clearTimeout(hoverIntent);		
		
		if (img.attr('src'))
		{
			$('#splashscreen-overlay').fadeOut();
			$('div.delete', this).fadeOut();
		}
	});
}

function setup_background_delete_overlay()
{
	var hoverIntent = null;
	
	$('div#applicationBackground').hover(function()
	{
		var elem = this;
		
		hoverIntent = setTimeout(function()
		{
			var $deleteDiv = $('div.delete', elem);
			var img = $('img', elem);
		
			if (img.attr('src'))
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
		
		if (img.attr('src'))
		{
			$('div.delete', this).fadeOut();
		}
	});
}

function setup_about_delete_overlay()
{
	var hoverIntent = null;
	
	$('#aboutImage').hover(function()
	{
		var elem = this;
		
		hoverIntent = setTimeout(function()
		{
			var $deleteDiv = $('div.delete', elem);
			var img = $('#image > img');
		
			if (img.attr('src'))
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
		
		var img = $('#image > img');
		
		if (img.attr('src'))
		{
			$('div.delete', this).fadeOut();
		}
	});
}

function remove_splashscreen()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=splashscreen',
				dataType : 'json',
				data:
				{
					remove: true
				},
				success : function(xhr_data)
				{					
					$('div#applicationSplashscreen > img, #splashscreen-overlay > img').remove();
					//$('#apps li[rel|=' + $('#main').attr('rel') + '] div.preview').css('background-image', 'url()');
					$('div#applicationSplashscreen > div.delete, #splashscreen-overlay').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Remove Splashscreen', 'You can\'t edit you app once it\'s approved', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	return false;
}

function remove_background()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=background',
				dataType : 'json',
				data:
				{
					remove: true
				},
				success : function(xhr_data)
				{					
					$('div#applicationBackground > img').remove();
					$('div#applicationBackground > div.delete').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Remove Background', 'You can\'t edit you app once it\'s approved', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	return false;	
}

function remove_about_image()
{
	$.ajax({
				type : 'POST',
				url : 'ws.php?r=about',
				dataType : 'json',
				data:
				{
					remove: true
				},
				success : function(xhr_data)
				{					
					$('#image > img').removeAttr('src');
					$('#aboutImage > div.delete').fadeOut();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown)
				{
					show_publish('Can\'t Remove Image', 'You can\'t edit you app once it\'s approved', true);
					th_log(textStatus);
					th_log(errorThrown);
				}
			});
	
	return false;	
}

function setup_splashscreen_upload()
{
	$('div#applicationSplashscreen').fileUpload({
	    url: 'ws.php?r=splashscreen',
	    onDragEnter: function (event)
		{
			$(event.target).css('background', 'url(images/dropBackground152.png) 0 -226px no-repeat');
			$('div#applicationSplashscreen img').css('display', 'none');
		},
		onDragLeave: function (event)
		{
			$(event.target).css('background', 'url(images/dropBackground152.png) 0 0 no-repeat');
			
			var $img = $('div#applicationSplashscreen img');
			if ($img.attr('src') && $img.attr('src').length)
			{
				$('img').css('display', 'block');
			}
		},
		onDrop: function (event)
		{
			$('#applicationSplashscreen div.progressBar').css('display', 'block').progressbar({ 'value': 100 });
			$('#splashscreen-overlay > img').remove();
			$('#applicationSplashscreen > img').remove();
			$('#splashscreen-overlay').css('background', 'url(images/dropBackground152.png) 0 0 no-repeat');
		},
		onProgress: function (event, files, index, xhr, handler)
		{
	        $('#applicationSplashscreen div.progressBar').progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
		},
		onLoad: function (event, files, index, xhr, handler)
		{
			$('#splashscreen-overlay > img').remove();
			$('#applicationSplashscreen > img').remove();

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
					$('#applicationSplashscreen').css('background', 'url(images/dropBackground152.png) 0 0');
					$(this).insertBefore($('#applicationSplashscreen > div.progressBar')).fadeIn();

					var clone = $(this).clone();

					$('#splashscreen-overlay').append(clone.css('opacity', 1));
					
					if ($('#first').is(':visible'))
					{
						$('#splashscreen-overlay').fadeIn();
						setTimeout(function()
						{
							$('#splashscreen-overlay').fadeOut();
						}, 800);
					}
				}

				image.src = newSrc;
				
				//$('#apps li[rel|=' + $('#main').attr('rel') + '] div.preview').css('background-image', 'url(' + newSrc + ')');
				
				$('#applicationSplashscreen').css('background', 'url(images/aaa-spinner.gif) center no-repeat');
				$('#applicationSplashscreen .progressBar').css('display', 'none');
			}
		}		
	});
}

function setup_background_upload()
{
	$('div#applicationBackground').fileUpload({
	    url: 'ws.php?r=background',
	    onDragEnter: function (event)
		{
			$('#applicationBackground').css('background', 'url(images/dropBackground152.png) 0 -226px no-repeat');
			$('#applicationBackground img').css('display', 'none');
		},
		onDragLeave: function (event)
		{
			$('#applicationBackground').css('background', 'url(images/dropBackground152.png) 0 0 no-repeat');
			
			var $img = $('#applicationBackground img');
			if ($img.attr('src') && $img.attr('src').length)
			{
				$('img').css('display', 'block');
			}
		},
		onDrop: function (event)
		{
			$('#applicationBackground div.progressBar').css('display', 'block').progressbar({ 'value': 100 });
			$('#applicationBackground > img').remove();
			$('#applicationBackground').css('background', 'url(images/dropBackground152.png) 0 0 no-repeat');
		},
		onProgress: function (event, files, index, xhr, handler)
		{
	        $('#applicationBackground div.progressBar').progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
		},
		onLoad: function (event, files, index, xhr, handler)
		{
			$('#applicationBackground > img').remove();

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
					$('#applicationBackground').css('background', 'url(images/dropBackground152.png) 0 0');
					$(this).insertBefore($('#applicationBackground > div.progressBar')).fadeIn();
				}

				image.src = newSrc;
				
				$('#applicationBackground').css('background', 'url(images/aaa-spinner.gif) center no-repeat');
				$('#applicationBackground .progressBar').css('display', 'none');

				$('#background').css('background', 'url(files/' + json.name + ')');
			}
		}
	});
}

function setup_app_name_editable()
{
	$("#app-name").editable('ws.php?r=appname',
	{
		select: true,
		cssclass: 'descriptionEditable',
		callback: function (value, settings)
		{
			if (value.length > 11)
			{
				value = value.substring(0, 5) + '...' + value.substring(value.length - 3);
			}
			$('div#apps > ul > li[rel|=' + $('#main').attr('rel') + '] dl.app-infos > dt > a').text(value);
		}
	});
}

$(document).ready(function()
{
	var theme = new Theme();
	
	theme.setup();
		
	setup_splashscreen_upload();
	setup_background_upload();
	setup_about_delete_overlay();
	
	$('div#applicationSplashscreen div.delete > a').click(remove_splashscreen);
	$('div#applicationBackground div.delete > a').click(remove_background);
	$('#aboutImage div.delete > a').click(remove_about_image);

	setup_splashscreen_delete_overlay();
	setup_background_delete_overlay();

	setup_app_name_editable();

});