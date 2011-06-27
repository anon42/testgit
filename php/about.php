<?php

function upload_about_image()
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE applications' .
		   ' SET `about-image` = "' . $infos->name . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	
	return json_encode($infos);
}

function save_about($about)
{
	if (isset($_SESSION['uid']) && isset($_SESSION['appid']) && isset($_SESSION['lang']))
	{
		connect_db();
		
		$sql = 'UPDATE applications ' .
			   ' SET `about' . '-' . $_SESSION['lang'] . '` = "' . $about . '", ' .
			   ' `updated` = NOW()' .
			   ' WHERE id = "' . $_SESSION['appid'] . '"' .
			   ' AND id_user = "' . $_SESSION['uid'] . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}
	
	return $about;
}

?>