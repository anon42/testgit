function Promotion()
{
	this.load = function(promotions)
	{
		var self = this;
		
		// Bind actions (delete, editable..) on future promotions
		$('#promotion')
			.delegate('dd.delete a', 'click', function()
			{
				self.remove($(this).parents('dd.menuItem').attr('rel'));
			
				return false;
			})
			.delegate('dd.editableItem', 'hover', self._editable);
		
		$('#promotion > dl.appDl dd').not('.last').each(function()
		{
			$('#' + $('dl', $(this)).attr('rel')).remove();
			$(this).remove();
		});
		
		// Load all promotions from Web Service
		$.each(promotions, function(index, promotion)
		{
			self._load(promotion, false);			
		});
	}
	
	this._load_details = function(promotion)
	{
		var dd_upload =	$('<dd class="file_upload">' +
							'<span class="span_upload">' +
								'<div class="image"></div>' +
								'<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">' +
							        '<label>' +
										'<input type="file" name="file[]" multiple>' +
									'</label>' +
							        '<button type="submit">Upload</button>' +
							    '</form>' +
								'<div class="progressBar"></div>' +
								'<div class="delete"><a href=""></a></div>' +
							'</span>' +
						'</dd>');
		
		$('dt > a > span.title', '#' + promotion.id).text(l('promotion'));
		if (promotion.photo)
		{
			var newSrc = 'files/' + promotion.photo;
			var image = new Image();
	
			image.onload = function()
			{
				$('.span_upload', dd_upload).css('background', 'url()');
				$('div.image', dd_upload).append($(this)).fadeIn();
			}
	
			image.src = newSrc;
	
			$('.span_upload', dd_upload).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		}

		this._setup_details_upload($('.span_upload', dd_upload), promotion.id);

		dd_upload.insertBefore('#' + promotion.id + ' dd.last');
		$('<dd class="editable"><span></span></dd>')
					.insertBefore('#' + promotion.id + ' dd.last')
					.find('span')
					.editable('ws.php?r=promotion',
					{
						type: 'textarea',
						submitdata :
						{
							lang: $('#main').hasClass('th') ? 'th' : 'en',
							promotionid: promotion.id,
							details: true
						},
						submit: 'ok',
						select: true,
						cssclass: 'descriptionEditable'
					});
		$('dd.editable span', '#' + promotion.id).text(promotion.details ? promotion.details : "Click to edit text");
	}

	this._load = function(promotion, animated)
	{
		var self = this;
		var firstChild = $('#promotion > dl.appDl dd:first');
		var dd = $('<dd class="menuItem">' +
			'<dl class="item">' +
				'<dt>' +
					'<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">' +
				        '<label>' +
							'<input type="file" name="file[]" multiple>' +
						'</label>' +
				        '<button type="submit">Upload</button>' +
				    '</form>' +
					'<div class="progressBar"></div>' +
					'<div class="image"></div>' +
				'</dt>' +
				'<dd class="editableItem"></dd>' +
				'<dd class="delete"><a href=""></a></dd>' +
			'</dl>' +
		'</dd>');

		var details = $('<div class="promotionDetails iOSScroll">' +
								'<dl class="appDl">' +
									'<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>' +
									'<dd class="last"></dd>' +
								'</dl>' +
							'</div>');

		if (promotion.id != null && promotion.title && promotion.id && promotion.title)
		{
			dd.attr('rel', promotion.id);

			$('dl.item dd.editableItem', dd).text(promotion.title);
			
			if (promotion.thumbnail)
			{
				var newSrc = 'files/' + promotion.thumbnail;
				var image = new Image();
		
				image.onload = function()
				{
					$('dt', dd).css('background', 'url(images/dropBackground92.png) 0 0');
					$('div.image', dd).append($(this)).fadeIn();
				}

				image.src = newSrc;
		
				$('dt', dd).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
			}
			
			// insert a new menuDetails page for the category
			details.attr('id', promotion.id).hide().insertBefore('#gallery');

			// set a doubleClick behavior to display the promotionDetails page
			$('dl.item', dd).attr('rel', promotion.id).dblclick(function()
			{
				window.location.hash = promotion.id;
					
				hideAllBut(promotion.id);
			
				return false;
			}).css('cursor', 'pointer');


			self._setup_upload(dd.children().children('dt'), promotion.id);
			self._load_details(promotion);
				
			if (animated)
			{
				dd.hide().insertBefore(firstChild).slideDown();	
			}
			else
			{
				dd.insertBefore(firstChild);
			}

			if (location.hash == '#' + promotion.id)
			{		
				hideAllBut(promotion.id);
			}
		}
	}

	this.remove = function(promotion)
	{
		$.ajax({
					type : 'POST',
					url : 'ws.php?r=promotion',
					dataType : 'json',
					data:
					{
						remove: true,
						id: promotion
					},
					success : function(xhr_data)
					{
						$('dd[rel|=' + promotion + ']', '#promotion').hide('blind', {}, 'slow', function()
						{
							$(this).remove();
							$('#' + promotion).remove();
						});
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Delete Promotion', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
	}

	this.create = function()
	{
		var self = this;

		$.ajax({
					type : 'POST',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'promotion'
					},
					success : function(promotion)
					{
						self._load(promotion, true);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Add Promotion', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});

		return false;
	}

	this._editable = function()
	{
		$(this).editable('ws.php?r=promotion', 
		{
			submitdata :
			{
				lang: $('#main').hasClass('th') ? 'th' : 'en',
				promotionid: $(this).parents('dd.menuItem').attr('rel')
			},
			cssclass: 'titleEditable',
			select: true
		});
	}

	this._setup_upload = function($elem, promotion_id)
	{
		$elem.fileUpload(
		{
		    url: 'ws.php?r=promotion&upload=' + promotion_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) -96px 0 no-repeat');
				$('div.image', $elem).css('display', 'none');
			},
			onDragLeave: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
				
				$img = $('div.image > img', $elem);
				if ($img.attr('src') && $img.attr('src').length)
				{
					$($img).parent().css('display', 'block');
				}
			},
			onDrop: function (event)
			{
				$('div.progressBar', $elem).css('display', 'block').progressbar({ 'value': 100 });
				$('div.image > img', $elem).remove();
				$($elem).css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
			},
			onProgress: function (event, files, index, xhr, handler)
			{
		        $('div.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				$('div.image > img', $elem).remove();

				if (xhr.status == 401)
				{
					th_log('401');
				}
				else
				{
					var json = $.parseJSON(xhr.responseText);
					var img = $('.image > img', handler.dropZone)[0];
					
					var newSrc = 'files/' + json.name;
					var image = new Image();

					image.onload = function()
					{
						$(handler.dropZone).css('background', 'url(images/dropBackground92.png) 0 0');
						$('div.image', handler.dropZone).append($(this)).fadeIn();
					}

					image.src = newSrc;

					$(handler.dropZone).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
					$('div.progressBar', handler.dropZone).css('display', 'none');
				}
			}
		});
	}
	
	this._setup_details_upload = function($elem, promotion_id)
	{
		$elem.fileUpload(
		{
		    url: 'ws.php?r=promotion&details=' + promotion_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/dropBackground.png) 0 -162px no-repeat');
				$('div.image', $elem).css('display', 'none');
			},
			onDragLeave: function(event)
			{
				$elem.css('background', 'url(images/dropBackground.png) 0 0 no-repeat');
				
				$img = $('div.image > img', $elem);
				if ($img.attr('src') && $img.attr('src').length)
				{
					$($img).parent().css('display', 'block');
				}
			},
			onDrop: function (event)
			{
				$('div.progressBar', $elem).css('display', 'block').progressbar({ 'value': 100 });
				$('div.image > img', $elem).remove();
				$($elem).css('background', 'url(images/dropBackground.png) 0 0 no-repeat');
			},
			onProgress: function (event, files, index, xhr, handler)
			{
		        $('div.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				$('div.image > img', $elem).remove();
				
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
						$($elem).css('background', 'url()');
						$('div.image', $elem).append($(this)).fadeIn();
					}
				
					image.src = newSrc;
				
					$($elem).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
					$('div.progressBar', $elem).css('display', 'none');
				}
			}
		});
	}
}
