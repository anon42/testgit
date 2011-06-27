function Theme()
{
	this.load = function(theme)
	{
		var self = this;
		var index = 0;
	
		if (theme)
		{
			index = parseInt(theme);
		}
	
		var prev = ((index - 1) < 0) ? this.themes.length - 1 : (index - 1);
		var next = ((index + 1) > this.themes.length - 1) ? 0 : (index + 1);
	
		$('#theme-chooser dd.bar-color').css('background', 'url(images/themes/colors/packs/' + self.themes[index].pack + '/navigationBar.png)');
		$('#theme-chooser dd.text-color').css('background', self.themes[index].bgcolor);
		var packs = '';
		$.each(self.themes, function(index, theme)
		{
			packs += theme.pack + '-pack ';
		});
		$('#iphone').removeClass(packs).addClass(self.themes[index].pack + '-pack');
		var elements = '';
		$.each(self.themes, function(index, theme)
		{
			elements += theme.elements + '-elements ';
		});
		$('#iphone').removeClass(elements).addClass(self.themes[index].elements + '-elements');
		$('#theme-chooser dl > dt > span.blue_span').text(index + 1);
		$('#theme-chooser dd.theme-no').text('Theme ' + (index + 1) + ' of ' + self.themes.length);
		$('#theme-chooser dd.backward-theme a').attr('rel', prev);
		$('#theme-chooser dd.forward-theme a').attr('rel', next);
	}

	this.load_icons = function(theme)
	{
		var icon_theme = '1';
		if (theme)
		{
			icon_theme = theme;
		}

		$('#iphone').removeClass('icons-1 icons-2 icons-3').addClass('icons-' + icon_theme);
	
		// $('#icon-theme span.radio').removeClass('selected');
		// $('#icon-theme dd input').css('display', 'none');
		// $('dl#theme-' + icon_theme + ' > dt > a > span.radio').addClass('selected');						
		// $('dl#theme-' + icon_theme + ' dd input').css('display', 'inline-block');
	}

	this.change_icons = function()
	{	
		var id = $(this).parents('dl').attr('id');
		var theme = id.substr(id.length - 1, 1);	
	
		$('#overlay').fadeIn();
		$('div#icon-theme dl dd input').css('display', 'none');
		$('div#icon-theme dl > dt > a > span.radio').removeClass('selected');
		$('span.radio', this).addClass('selected');
		$('input', $(this).parents('dl')).css('display', 'inline-block');

		$.ajax({
					type : 'GET',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'icon_theme',
						theme: theme
					},
					success : function(xhr_data)
					{
						$('#iphone').removeClass('icons-1 icons-2 icons-3').addClass('icons-' + theme);
						$('#overlay').fadeOut();
					}
				});
			
		return false;
	}

	this.load_next = function()
	{
		var self = this;
		var i = parseInt($('#theme-chooser dd.forward-theme a').attr('rel'));
		var next = ((i + 1) > self.themes.length - 1) ? 0 : (i + 1);
		var prev = ((i - 1) < 0) ? (self.themes.length - 1) : (i - 1);
	
		$('#overlay').fadeIn();
	
		$.ajax({
					type : 'GET',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'theme',
						theme: i
					},
					success : function(xhr_data)
					{
						$('#theme-chooser dd.bar-color').css('background', 'url(images/themes/colors/packs/' + self.themes[i].pack + '/navigationBar.png)');
						$('#theme-chooser dd.text-color').css('background', self.themes[i].bgcolor);
						var packs = '';
						$.each(self.themes, function(index, theme)
						{
							packs += theme.pack + '-pack ';
						});
						$('#iphone').removeClass(packs).addClass(self.themes[parseInt(i)].pack + '-pack');
						var elements = '';
						$.each(self.themes, function(index, theme)
						{
							elements += theme.elements + '-elements ';
						});
						$('#iphone').removeClass(elements).addClass(self.themes[parseInt(i)].elements + '-elements');
						$('#theme-chooser dl > dt > span.blue_span').text(parseInt(i) + 1);
						$('#theme-chooser dd.theme-no').text('Theme ' + (parseInt(i) + 1) + ' of ' + self.themes.length);
						$('#theme-chooser dd.forward-theme a').attr('rel', next);
						$('#theme-chooser dd.backward-theme a').attr('rel', prev);

						$('#overlay').fadeOut();
					}
				});			

		return false;
	}

	this.load_previous = function()
	{
		var self = this;
		var i = parseInt($('#theme-chooser dd.backward-theme a').attr('rel'));
		var prev = ((i - 1) < 0) ? self.themes.length - 1 : (i - 1);
		var next = ((i + 1) > self.themes.length - 1) ? 0 : (i + 1);
	
		$('#overlay').fadeIn();
	
		 $.ajax({
					type : 'GET',
					url : 'ws.php',
					dataType : 'json',
					data:
					{
						r: 'theme',
						theme: i
					},
					success : function(xhr_data)
					{
					
						$('#theme-chooser dd.bar-color').css('background', 'url(images/themes/colors/packs/' + self.themes[parseInt(i)].pack + '/navigationBar.png)');
						$('#theme-chooser dd.text-color').css('background', self.themes[i].bgcolor);
						var packs = '';
						$.each(self.themes, function(index, theme)
						{
							packs += theme.pack + '-pack ';
						});
						$('#iphone').removeClass(packs).addClass(self.themes[parseInt(i)].pack + '-pack');
						var elements = '';
						$.each(self.themes, function(index, theme)
						{
							elements += theme.elements + '-elements ';
						});
						$('#iphone').removeClass(elements).addClass(self.themes[parseInt(i)].elements + '-elements');
						$('#theme-chooser dl > dt > span.blue_span').text(parseInt(i) + 1);
						$('#theme-chooser dd.theme-no').text('Theme ' + (parseInt(i) + 1) + ' of ' + self.themes.length);
						$('#theme-chooser dd.backward-theme a').attr('rel', prev);
						$('#theme-chooser dd.forward-theme a').attr('rel', next);

						$('#overlay').fadeOut();
					}
				});			

		return false;
	}

	this.setup = function()
	{
		var self = this;

		// Deactivated. Use later if multiple icon sets
		// $('dl#theme-1 > dt > a, dl#theme-2 > dt > a, dl#theme-3 > dt > a').click(self.change_icons);

		$('#icon-theme dd a, #icon-theme dd input').click(function()
		{
			var module = new Module();
			module.toggle_module(this);
		
			return false;
		});
	
		$('#theme-chooser dd.theme-no').text('Theme 1 of ' + self.themes.length);

		$('#theme-chooser dd.forward-theme a').attr('rel', '1').click(function()
		{
			return self.load_next();
		});
		$('#theme-chooser dd.backward-theme a').attr('rel', self.themes.length - 1).click(function()
		{
			return self.load_previous();
		});
	}
		
	this._themes = function()
	{
		return [{
				"pack": "orange",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "blue",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "red",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "chocolate",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "cashew",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "green",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "pink",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "purple",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "yellow",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "navy",
				"bgcolor": "white",
				"elements": "white"
			},
			{
				"pack": "night-purple",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "night-blue",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "night-red",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "night-green",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "night-brown",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "night-magenta",
				"bgcolor": "black",
				"elements": "black"
			},
			{
				"pack": "pistachio",
				"bgcolor": "#9EB4AA",
				"elements": "pistachio"
			},
			{
				"pack": "vanilla-chocolate",
				"bgcolor": "#CB9169",
				"elements": "vanilla"
			},
			{
				"pack": "mint",
				"bgcolor": "#BDC9AD",
				"elements": "mint"
			},
			{
				"pack": "sunset",
				"bgcolor": "#A29798",
				"elements": "sunset"
			}];
	}
	
	this.themes = this._themes();
}
