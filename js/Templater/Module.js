function Module()
{
	this.load = function(modules)
	{
		var self = this;
		$.each(modules, function(module, v)
		{
			if (v == 0)
			{
				self.hide_module(module);
			}
			else
			{
				self.show_module(module);
			}
		})
		
		self.refresh_tabs();
	}

	this.hide_module = function(module)
	{
		$('ul#tabs li#' + module + 'Tab').hide();
		$('#first ul li.' + module).hide();
		$('#icon-theme dd.' + module + ' input').attr('checked', false);
	}

	this.show_module = function(module)
	{
		$('ul#tabs li#' + module + 'Tab').show();
		$('#first ul li.' + module).show();
		$('#icon-theme dd.' + module + ' input').attr('checked', true);
	}

	this.refresh_tabs = function()
	{
		$('ul#tabs li').removeClass('first');
		$('ul#tabs li').filter(function()
		{
			return $(this).css('display') != 'none';
		}).first().addClass('first');

		var tabs = $("input:checked", $('#icon-theme dl')).length;
	
		$('ul#tabs > li').css('width', Math.floor((320 / tabs) - 4));
	}

	this.remove_module = function(name)
	{
		var self = this;
		
		$('#overlay').fadeIn();
		$.ajax({
					type : 'POST',
					url : 'ws.php?r=module',
					dataType : 'json',
					data:
					{
						remove: true,
						module: name
					},
					success : function(xhr_data)
					{
						self.hide_module(name);
						self.refresh_tabs();
						$('#overlay').fadeOut();
					}
				});
	}

	this.add_module = function(name)
	{
		var self = this;
		
		$('#overlay').fadeIn();

		$.ajax({
					type : 'POST',
					url : 'ws.php?r=module',
					dataType : 'json',
					data:
					{
						module: name
					},
					success : function(xhr_data)
					{
						self.show_module(name);
						self.refresh_tabs();
						$('#overlay').fadeOut();
					}
				});
	}

	/*
		Either adds or removes a module on click
	 */
	this.toggle_module = function(elem)
	{
		// Store the module's checkbox 
		var $input = $(elem);
		if (elem.tagName == 'A')
		{
			$input = $(elem).next();
		}

		// Get the module name
		var module = $(elem).parents('dd').attr('class');
	
		if (module != 'accomodation') // not yet developed module accomodation
		{
			if (($input.is(':checked') == true && elem.tagName == 'A') ||
				($input.is(':checked') == false && elem.tagName == 'INPUT'))
			{
				this.remove_module(module);
			}
			else
			{
				this.add_module(module);
			}

			return elem.tagName == 'INPUT';
		}
		
		return false;
	}	
}
