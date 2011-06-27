function Menu()
{
	this.load = function(menus)
	{
		var self = this;

		$('#menu > dl.appDl dd').not('.last').each(function()
		{
			$('#' + $('dl', $(this)).attr('rel')).remove();
			$(this).remove();
		});
	
		$.each(menus, function(index, category)
		{
			self.load_category(category, false);
		
			$.each(category.sections, function(index, section)
			{
				self.load_section(section, category, false);
			
				$.each (section.items, function(index, item)
				{
					self.load_item(item, section.id, false);				
				});
			});
		});	
	}

	this.load_item = function(item, section, animated)
	{
		var self = this;
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

		$('dd.delete > a', dd).click(function()
		{
			self.delete_item(item.id);

			return false;
		});

		$('dd.editableItem', dd).text(item.title).editable('ws.php?r=item',
		{
			submitdata :
			{
				lang: $('#main').hasClass('th') ? 'th' : 'en',
				itemid: item.id
			},
			cssclass: 'titleEditable',
			select: true
		});

		if (item.thumbnail)
		{
			var newSrc = 'files/' + item.thumbnail;
			var image = new Image();

			image.onload = function()
			{
				$('div.image', dd).css('background', 'url()').append($(this)).fadeIn();
				$('dt', dd).css('background', 'url()');
			}
			
			image.src = newSrc;

			$('dt', dd).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		}

		this._item_upload($('dt', dd), item.id);
		
		if (animated)
		{
			dd.attr('rel', item.id).hide().insertAfter($('#' + section)).slideDown('fast');
		}
		else
		{
			dd.attr('rel', item.id).insertAfter($('#' + section));
		}
	}

	this.load_section = function(data, category, animated)
	{
		var self = this;
		var section = $('<dd class="section">' +
							'<dl>' +
								'<dt><span class="editableItem"></span><a href="" class="delete"></a></dt>' +
							'</dl>' +
						'</dd>');

		$('a.delete', section).click(function()
		{
			self.delete_section(data.id);
		
			return false;
		});

		// set a doubleClick behavior to add a new item to a section
		$('dt > span.editableItem', section).text(data.title).editable('ws.php?r=section',
		{
			submitdata :
			{
				lang: $('#main').hasClass('th') ? 'th' : 'en',
				sectionid: data.id
			},
			cssclass: 'titleEditable',
			select: true
		});
	
		$('dt', section).attr('id', data.id).dblclick(function()
		{
			self.create_item(data.id);
		});
	
		// insert the new section
		if (animated)
		{
			section.hide().insertAfter($('#' + category + ' dl.appDl > dt')).slideDown('fast');
		}
		else
		{
			section.insertAfter($('#' + category.id + ' dl.appDl > dt'));
		}
	}

	this.load_category = function(category, animated)
	{
		var self = this;
		var firstChild = $('#menu > dl.appDl dd:first');
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

		var menuDetails = $('<div class="menuDetails iOSScroll">' +
								'<dl class="appDl">' +
									'<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>' +
									'<dd class="last"></dd>' +
								'</dl>' +
							'</div>');

		$('dt > a > span.title', menuDetails).text(l('menu'));
	
		$('dd.delete > a', dd).click(function()
		{
			self.delete_category(category.id);

			return false;
		});

		// Add the editable and uploadable behavior to the new category
		$('dl.item dd.editableItem', dd).text(category.title).editable('ws.php?r=category',
		{
			submitdata :
			{
				lang: $('#main').hasClass('th') ? 'th' : 'en',
				categoryid: category.id
			},
			cssclass: 'titleEditable',
			select: true
		});
		if (category.thumbnail)
		{
			var newSrc = 'files/' + category.thumbnail;
			var image = new Image();
		
			image.onload = function()
			{
				$('dt', dd).css('background', 'url()');
				$('div.image', dd).append($(this)).fadeIn();
			}

			image.src = newSrc;

			$('dt', dd).css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		}
		
		self._category_upload(dd.children().children('dt'), category.id);

		// insert a new section on click
		$('dt', menuDetails).click(function()
		{
			return self.create_section(category.id);
		});

		// set a doubleClick behavior to display the menuDetails page
		$('dl.item', dd).attr('rel', category.id).dblclick(function()
		{
			window.location.hash = category.id;
		
			hideAllBut(category.id);

			return false;
		}).css('cursor', 'pointer');
	
		// insert a new menuDetails page for the category
		menuDetails.attr('id', category.id).hide().insertBefore('#promotion');

		// insert the new category row
		if (animated)
		{
			dd.hide().insertBefore(firstChild).slideDown('fast');
		}
		else
		{
			dd.insertBefore(firstChild);
		}
	
		if (location.hash == '#' + category.id)
		{		
			hideAllBut(category.id);
		}
	}

	this.delete_item = function(item)
	{
		$.ajax({
					type : 'POST',
					url : 'ws.php?r=item',
					dataType : 'json',
					data:
					{
						remove: true,
						id: item
					},
					success : function(xhr_data)
					{					
						$('dd.menuItem[rel|=' + item + ']').hide('blind', {}, 'slow', function()
						{
							$(this).remove();
						});
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Remove Item', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
	}

	this.delete_section = function(section)
	{
		var self = this;

		$.ajax({
					type : 'POST',
					url : 'ws.php?r=section',
					dataType : 'json',
					data:
					{
						remove: true,
						id: section
					},
					success : function(xhr_data)
					{					
						$('#' + section).siblings().each(function(index, element)
						{
							self.delete_item($(element).attr('rel'));
						});
					
						$('#' + section).hide('blind', {}, 'slow', function()
						{
							$(this).remove();
						});
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Remove Section', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
	}

	this.delete_category = function(category)
	{
		$.ajax({
					type : 'POST',
					url : 'ws.php?r=category',
					dataType : 'json',
					data:
					{
						remove: true,
						id: category
					},
					success : function(xhr_data)
					{					
						$('dl.item[rel|=' + category + ']').parent().hide('blind', {}, 'slow', function()
						{
							$(this).remove();
						});

						$('#' + category).remove();
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Remove Category', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
				
		return false;
	}

	this.create_item = function(section)
	{
		var self = this;
		
		$.ajax({
					type : 'POST',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'item',
						section: section
					},
					success: function(item)
					{
						self.load_item(item, section, true);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Add Item', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
				
		return false;
	}

	this.create_section = function(category)
	{
		var self = this;
		
		$.ajax({
					type : 'POST',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'section',
						category: category
					},
					success: function(section)
					{
						self.load_section(section, category, true);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Add Section', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});
				
		return false;
	}

	this.create_category = function()
	{
		var self = this;

		$.ajax({
			type : 'POST',
			url : 'ws.php',
			dataType : 'json',
			data:
			{
				r: 'category'
			},
			success: function(category)
			{
				self.load_category(category, true);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown)
			{
				show_publish('Can\'t Add Category', 'You can\'t edit you app once it\'s approved', true);
				th_log(textStatus);
				th_log(errorThrown);
			}
		});
		
		return false;
	}

	this._category_upload = function($elem, cat_id)
	{
		$elem.fileUpload(
		{
		    url: 'ws.php?r=category&upload=' + cat_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) -96px 0 no-repeat');
			},
			onDragLeave: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
			},
			onDrop: function (event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
				$('.image > img', $elem).remove()
				$('.progressBar', $elem).progressbar({ 'value': 100 }).show();
			},
			onProgress: function(event, files, index, xhr, handler)
			{
				$('.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });	
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				$('.image > img', $elem).remove()

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
						$('.image', handler.dropZone).css('background', 'url()').append($(this)).fadeIn();
						$elem.css('background', 'url()');
					}
					
					image.src = newSrc;

					$elem.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
				}
				
				$('.progressBar', $elem).hide();
			}
		});
	}

	this._item_upload = function($elem, item_id)
	{
		$elem.fileUpload(
		{
		    url: 'ws.php?r=item&upload=' + item_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) -96px 0 no-repeat');
			},
			onDragLeave: function(event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
			},
			onDrop: function (event)
			{
				$elem.css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
				$('.progressBar', $elem).progressbar({ 'value': 100 }).show();
			},
			onProgress: function(event, files, index, xhr, handler)
			{
				$('.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });	
			},
			onLoad: function (event, files, index, xhr, handler)
			{
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
						$('.image', $elem).css('background', 'url()').append($(this)).fadeIn();
						$elem.css('background', 'url()');
					}
					
					image.src = newSrc;

					$elem.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
				}

				$('.progressBar', $elem).hide();
			}
		});
	}
}
