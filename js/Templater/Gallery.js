function Gallery()
{	
	this.load = function(photos)
	{
		var self = this;

		$('#gallery')
			.delegate('div.delete > a', 'click', function()
			{
				return self.remove($(this).parents('td.image2'));
			})
			.delegate('td.image2', 'dblclick', function()
			{
				window.location.hash = $(this).attr('rel');
			
				hideAllBut($(this).attr('rel'));
			
				return false;
			})
			.delegate('td.image2', 'dragover', function()
			{
				console.log('over');
			});

		// Remove old photos
		$('#gallery	table tr').not(':first').remove();
		$('#gallery	table td img').remove().parent().removeClass('image2');

		// Display photos from Web Service
		$.each(photos, function(i, photo)
		{
			// remove old photoDetails
			$('#' + photo.id).remove();
			self._load(photo, false);
		})
	}

	this.remove = function($cell)
	{
		var self = this;
		var photo_id = $cell.attr('rel');

		$.ajax({
					type : 'POST',
					url : 'ws.php?r=photo',
					dataType : 'json',
					data:
					{
						remove: true,
						id: photo_id
					},
					success : function(xhr_data)
					{					
						var all = '#gallery td.image2';
						var index = $cell.index(all);

						var toMove = $(all).slice(index + 1);

						$cell.nextAll().remove();
						$cell.parents('tr').nextAll().remove();
						$cell.remove();
						$('#' + photo_id).remove();

						toMove.each(function(i, e)
						{
							var $table = $('#gallery table');
							var $tr = $('tr:last', $table);
							
							self._setup_delete_overlay($(e));

							if ($('td', $tr).length == 3)
							{
								$table.append($('<tr></tr>').append(e));
							}
							else
							{
								$tr.append(e);
							}
						});
					},
					error : function(XMLHttpRequest, textStatus, errorThrown)
					{
						show_publish('Can\'t Remove Photo', 'You can\'t edit you app once it\'s approved', true);
						th_log(textStatus);
						th_log(errorThrown);
					}
				});	
	
		return false;
	}
	
	this._setup_delete_overlay = function($e)
	{
		var hoverIntent = null;

		$e.hover(function()
		{
			var elem = this;
	
			hoverIntent = setTimeout(function()
			{
				$deleteDiv = $('div.delete', elem);
				
				if ($deleteDiv.is(':animated'))
				{
					$deleteDiv.stop().fadeTo(400, 1);					
				}
				else
				{
					$deleteDiv.fadeIn();
				}
			}, 100);
		}, function()
		{
			clearTimeout(hoverIntent);		
		
			$('div.delete', this).fadeOut('fast');
		});
	}

	this._load_details = function(photo)
	{
		var upload = $('<span class="span_upload">' +
							'<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">' +
						        '<label>' +
									'<input type="file" name="file[]" multiple>' +
								'</label>' +
						        '<button type="submit">Upload</button>' +
						    '</form>' +
							'<div class="progressBar"></div>' +
							'<div class="delete"><a href=""></a></div>' +
						'</span>');
						
		if (photo.details)
		{
			var newSrc = 'files/' + photo.details;
			var image = new Image();
		
			image.onload = function()
			{
				$(this).insertBefore(upload).fadeIn();
				upload.css('background', 'none');			
			}

			image.src = newSrc;
		
			upload.css('background', 'url(images/aaa-spinner.gif) center no-repeat');			
		}

		this._setup_details_upload(upload, photo.id);
		$('.photo_upload', '#' + photo.id).append(upload);
	}

	this._load = function(photo, animated)
	{
		var self = this;
		var img = $('<img></img>').attr('src', 'files/' + photo.thumbnail);
		var lastRow = $('#gallery table tr:last');
		var nextAvailableCell = $('td', lastRow).not('.upload, .image2').first();
		var details = $('<div class="photoDetails iOSScroll">' +
								'<div class="photo_upload"></dl>' +
							'</div>');

		// Check if a the last cell of the last row is available
		if (nextAvailableCell.length == 0)
		{
			// Otherwise create a row with 3 cells and store the first cell
			if (animated)
			{
				nextAvailableCell = $('<tr></tr>')
					.hide()
					.insertAfter(lastRow)
					.slideDown('fast')
					.css('display', 'table-row')
					.append('<td></td><td></td><td></td>').find('td:first');
			}
			else
			{
				nextAvailableCell = $('<tr></tr>')
					.insertAfter(lastRow)
					.css('display', 'table-row')
					.append('<td></td><td></td><td></td>').find('td:first');
			}
		}
	
		var newSrc = 'files/' + photo.thumbnail;
		var image = new Image();
		
		image.onload = function()
		{
			nextAvailableCell.css('background', 'url()').append($(this).fadeIn());
		}

		image.src = newSrc;
		
		nextAvailableCell.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
		
		var del = $('<div class="delete"></div>').append($('<a href=""></a>'));

		// insert a new menuDetails page for the category
		details.attr('id', photo.id).hide().insertBefore('#location');

		this._setup_delete_overlay(nextAvailableCell);
		this._load_details(photo);
		nextAvailableCell.addClass('image2').attr('rel', photo.id).append(del);
		
		if (location.hash == '#' + photo.id)
		{		
			hideAllBut(photo.id);
		}
	}

	this.setup = function()
	{
		var self = this;
	
		$('div#fileUpload').fileUpload({
		    url: 'ws.php?r=photo',
		    onDragEnter: function(event)
			{
				$('#fileUpload').css('background', 'url(images/dropBackground92.png) -96px 0 no-repeat');
			},
			onDragLeave: function(event)
			{
				$('#fileUpload').css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
			},
			onDrop: function(event)
			{
				$('#fileUpload').css('background', 'url(images/dropBackground92.png) 0 0 no-repeat');
				$('#fileUpload .progressBar').progressbar({ 'value': 100 }).show();
			},
			onProgress: function(event, files, index, xhr, handler)
			{
				$('#fileUpload .progressBar').progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				if (xhr.status == 401)
				{
					th_log('401');
				}
				else
				{
					self._load($.parseJSON(xhr.responseText), true);
				}
				
				$('#fileUpload .progressBar').hide();
			}		
		});
	}

	this._setup_details_upload = function($elem, photo_id)
	{
		$elem.fileUpload(
		{
		    url: 'ws.php?r=photo&details=' + photo_id,
		    onDragEnter: function(event)
			{
				$elem.css('background', 'url(images/dropBackground.png) 0 -162px no-repeat');
				$('img', $elem.parent()).css('display', 'none');
			},
			onDragLeave: function(event)
			{
				$elem.css('background', 'url(images/dropBackground.png) 0 0 no-repeat');
				
				$img = $('img', $elem.parent());
				if ($img.attr('src') && $img.attr('src').length)
				{
					$img.parent().css('display', 'block');
				}
			},
			onDrop: function (event)
			{
				$('div.progressBar', $elem).css('display', 'block').progressbar({ 'value': 100 });
				$('img', $elem.parent()).remove();
				$elem.css('background', 'url(images/dropBackground.png) 0 0 no-repeat');
			},
			onProgress: function (event, files, index, xhr, handler)
			{
		        $('div.progressBar', $elem).progressbar({ 'value': parseInt(event.loaded / event.total * 100, 10) });
			},
			onLoad: function (event, files, index, xhr, handler)
			{
				$('img', $elem.parent()).remove();
				
				if (xhr.status == 401)
				{
					th_log('401');
				}
				else
				{
					var json = $.parseJSON(xhr.responseText);
					
					var newSrc = 'files/' + json.details;
					var image = new Image();
				
					image.onload = function()
					{
						$elem.css('background', 'url()');
						$(this).insertBefore($elem).fadeIn();
					}
				
					image.src = newSrc;
				
					$elem.css('background', 'url(images/aaa-spinner.gif) center no-repeat');
					$('div.progressBar', $elem).css('display', 'none');
				}
			}
		});		
	}
}
