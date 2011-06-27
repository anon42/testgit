<?php

$themes = get_color_themes();
$elements = get_elements();
$total_colors = count($themes);
$total_elements = count($elements);

$icons = 3;

function get_color_themes()
{
	return array('orange',
				'blue',
				'red',
				'chocolate',
				'cashew',
				'green',
				'pink',
				'purple',
				'yellow',
				'navy',
				'night-purple',
				'night-blue',
				'night-red',
				'night-green',
				'night-brown',
				'night-magenta',
				'pistachio',
				'vanilla-chocolate',
				'mint',
				'sunset');
}

function get_elements()
{
	return array('white', 'black', 'vanilla', 'pistachio', 'mint', 'sunset');
}

function icons_path($i)
{
	return '../images/themes/icons/' . ($i + 1) . '/';
}

function elements_path($i)
{
	$elements = get_elements();
	
	return '../images/themes/colors/elements/' . $elements[$i] . '/';
}

function colors_path($i)
{
	$themes = get_color_themes();
	
	return '../images/themes/colors/packs/' . $themes[$i] . '/';
}

?>

/*
 * --------------------------------------------------------
 * Icons Themes
 * --------------------------------------------------------
 */

<?php

for ($i = 0; $i < $icons; $i++)
{

?>
/*
 * Icon Set #<?php echo $i; ?>
 */

div#iphone.icons-<?php echo $i + 1; ?> #aboutTab a
{
	background-image: url(<?php echo icons_path($i); ?>info.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #menuTab a
{
	background-image: url(<?php echo icons_path($i); ?>menu.png);	
}

div#iphone.icons-<?php echo $i + 1; ?> #promotionTab a
{
	background-image: url(<?php echo icons_path($i); ?>promotion.png);	
}

div#iphone.icons-<?php echo $i + 1; ?> #galleryTab a
{
	background-image: url(<?php echo icons_path($i); ?>gallery.png);	
}

div#iphone.icons-<?php echo $i + 1; ?> #locationTab a
{
	background-image: url(<?php echo icons_path($i); ?>location.png);	
}

div#iphone.icons-<?php echo $i + 1; ?> #accomodationTab a
{
	background-image: url(<?php echo icons_path($i); ?>accomodation.png);	
}

div#iphone.icons-<?php echo $i + 1; ?> #about dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>info.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.about span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>info.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.menu span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>menu.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.promotion span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>promotion.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.gallery span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>gallery.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.location span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>location.png);
}

div#iphone.icons-<?php echo $i + 1; ?> div#first ul li.accomodation span.sq > span
{
	background-image: url(<?php echo icons_path($i); ?>accomodation.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #gallery dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>gallery.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #location dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>location.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #accomodation dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>location.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #menu dl.appDl > dt span.sq > span,
div#iphone.icons-<?php echo $i + 1; ?> .menuDetails dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>menu.png);
}

div#iphone.icons-<?php echo $i + 1; ?> #promotion dl.appDl > dt span.sq > span,
div#iphone.icons-<?php echo $i + 1; ?> .promotionDetails dl.appDl > dt span.sq > span
{
	background: url(<?php echo icons_path($i); ?>promotion.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.about a
{
	background-image: url(<?php echo icons_path($i); ?>theme/info.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.menu a
{
	background-image: url(<?php echo icons_path($i); ?>theme/menu.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.promotion a
{
	background-image: url(<?php echo icons_path($i); ?>theme/promotion.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.gallery a
{
	background-image: url(<?php echo icons_path($i); ?>theme/gallery.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.location a
{
	background-image: url(<?php echo icons_path($i); ?>theme/location.png);
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.accomodation
{
	display: none;
}

div#icon-theme dl#theme-<?php echo $i + 1; ?> dd.accomodation a
{
	background-image: url(<?php echo icons_path($i); ?>theme/accomodation.png);
}

<?php

}

?>

/*
 * --------------------------------------------------------
 * Color Themes
 * --------------------------------------------------------
 */


<?php

for ($i = 0; $i < $total_colors; $i++)
{

?>

/*
 *  <?php echo $themes[$i]; ?> Color Pack
 */

/*
 * Navigation Bar
 */

div#iphone.<?php echo $themes[$i]; ?>-pack #navigationBar
{	
	background-image: url(<?php echo colors_path($i); ?>navigationBar.png);
}

/*
 * Back Button
 */

div#iphone.<?php echo $themes[$i]; ?>-pack #backButton
{
	background: url(<?php echo colors_path($i); ?>backButton.png) no-repeat;	
}

/*
 * Tab Bar
 */

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs
{
	background: url(<?php echo colors_path($i); ?>tabBar.png) repeat-x;
}

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li.selected
{
	background: url(../images/tab-sep.png) center left no-repeat,
				url(<?php echo colors_path($i); ?>tab-left.png) 4px top no-repeat,
				url(<?php echo colors_path($i); ?>tab-right.png) top right no-repeat;
}

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li
{
	background: url(../images/tab-sep.png) center left no-repeat;
}

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li.selected > div.inner
{
	margin: 0 5px 0 9px;
	background: url(<?php echo colors_path($i); ?>tab-bg.png);
}

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li:first-child,
div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li.first
{
	background: none;
}

div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li:first-child.selected,
div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li.first.selected
{
	background: url(<?php echo colors_path($i); ?>tab-left.png) no-repeat,
				url(<?php echo colors_path($i); ?>tab-right.png) top right no-repeat;
}


div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li:first-child.selected > div.inner,
div#iphone.<?php echo $themes[$i]; ?>-pack ul#tabs > li.first.selected > div.inner
{
	margin: 0 5px 0 5px;
}

/*
 * Icon Square
 */

div#iphone.<?php echo $themes[$i]; ?>-pack dl.appDl > dt span.sq
{
	background-image: url(<?php echo colors_path($i); ?>icon-sq.png);
}

div#iphone.<?php echo $themes[$i]; ?>-pack div#first ul li span.sq
{
	background: url(<?php echo colors_path($i); ?>icon-sq.png);
}

/*
 * Disclosure Indicator
 */

div#iphone.<?php echo $themes[$i]; ?>-pack div#first ul li span.disclosure
{
	background: url(<?php echo colors_path($i); ?>arrow.png);
}

<?php

}

?>

/*
 * --------------------------------------------------------
 * Elements Themes
 * --------------------------------------------------------
 */

<?php

for ($i = 0; $i < $total_elements; $i++)
{
?>

div#iphone.<?php echo $elements[$i]; ?>-elements dd.section > dl,
div#iphone.<?php echo $elements[$i]; ?>-elements dl.appDl > dd
{
	background: url(<?php echo elements_path($i); ?>dd.png) repeat-y;
}

div#iphone.<?php echo $elements[$i]; ?>-elements dl.appDl > dt
{
	background: url(<?php echo elements_path($i); ?>dt.png);
}

div#iphone.<?php echo $elements[$i]; ?>-elements dl.appDl > dd.last
{
	background: url(<?php echo elements_path($i); ?>lastDd.png);
}

div#iphone.<?php echo $elements[$i]; ?>-elements div#first ul li
{
	background: url(<?php echo elements_path($i); ?>row.png);
}

<?php

}

?>

div#iphone.white-elements,
dl.item > dd,
span.title,
dl.appDl > dt a
{
	color: black;
}

div#iphone.black-elements,
div#iphone.black-elements dl.item > dd,
div#iphone.black-elements span.title,
div#iphone.white-elements dl.appDl > dt a
{
	color: white;
}

dl.item
{
	border-top: 1px solid #ccc;
}

div#iphone.black-elements dl.item
{
	border-top: 1px solid #333;
}

div#iphone.pistachio-elements dl.item
{
	border-top: 1px solid #9EB4AA;
}

div#iphone.mint-elements dl.item
{
	border-top: 1px solid #BDC9AD;
}

div#iphone.vanilla-elements dl.item
{
	border-top: 1px solid #CB9169;
}

div#iphone.sunset-elements dl.item
{
	border-top: 1px solid #A29798;
}
