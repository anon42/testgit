function load_about_image(about_image)
{
	$('#image img').remove();

	if (about_image)
	{
		var newSrc = 'files/' + about_image;
		var image = new Image();

		image.onload = function()
		{
			$('#aboutImage').css('background', 'url() 0 0');
			$('#image').append($(this)).fadeIn();
		}

		$('#aboutImage').css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		image.src = newSrc;
	}
}

function setup_aboutImage_upload()
{
	$('#aboutImage').fileUpload(
	{
	    url: 'ws.php?r=about&upload=1',
		sequentialUploads: true,
		multipart: false,
	    onDragEnter: function (event)
		{
			$('#aboutImage').css('background', 'url(images/dropBackground.png) 0 -162px');
		},
		onDragLeave: function (event)
		{
			if ($('#image img').length)
			{
				$('#aboutImage').css('background', 'url()');
			}
			else
			{
				$('#aboutImage').css('background', 'url(images/dropBackground.png) 0 0');
			}
		},
		onDrop: function (event)
		{
			$('#aboutImage').css('background', 'url(images/dropBackground.png) 0 0');
			$('#aboutImage .progressBar').css('display', 'block').progressbar({ 'value': 100 });
			$('#image > img').remove();
		},
		onProgress: function (event, files, index, xhr, handler)
		{
	        $('#aboutImage .progressBar').progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
		},
		onLoad: function (event, files, index, xhr, handler)
		{
			if (xhr.status == 401)
			{
				show_publish('Can\'t Add Image', 'You cant change design after submit your app.', true);
			}
			else
			{
				var json = $.parseJSON(xhr.responseText);
					
				var newSrc = 'files/' + json.name;
				var image = new Image();
				
				image.onload = function()
				{
					$('#aboutImage').css('background', 'url() 0 0');
					$('#image').append($(this)).fadeIn();
				}

				$('#image > img').remove();
				image.src = newSrc;
				
				$('#aboutImage').css('background', 'url(../images/aaa-spinner.gif) center no-repeat');
				$('#aboutImage .progressBar').css('display', 'none');
			}
		}
	});
}

function setup_description_editable()
{
	$("#description").editable('ws.php?r=about',
	{
		type: 'textarea',
		submit: 'ok',
		select: true,
		cssclass: 'descriptionEditable'
	});
}

