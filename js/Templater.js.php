<?php

header("content-type: application/x-javascript");

if (false)
{
	include 'Templater.min.js';
}
else
{
	include "Vendors/jquery-1.5.1.min.js";
	include "Vendors/jquery-ui-1.8.12.custom.min.js";
	include "Vendors/jquery.fileupload.js";
	include "Vendors/jquery.jeditable.js";
	include "Vendors/jquery.ba-hashchange.min.js";
	include "Vendors/niceforms.js";

	include "Templater/Gallery.js";
	include "Templater/Module.js";
	include "Templater/Menu.js";
	include "Templater/Promotion.js";
	include "Templater/Templater.js";
	include "Templater/Templater-Create.js";
	include "Templater/Templater-About.js";
	include "Templater/Templater-Location.js";
	include "Templater/Theme.js";
	include "Templater/ws.js";
}

?>
