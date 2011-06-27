<?php

session_start();

include 'php/db.php';
include 'php/functions.php';
include 'UploadHandler.php';

if (isset($_SESSION['uid']) && isset($_SESSION['appid']))
{
	$upload_handler = new UploadHandler();

	switch ($_SERVER['REQUEST_METHOD']) {
	    // case 'HEAD':
	    // case 'GET':
	    //     $upload_handler->get();
	    //     break;
	    case 'POST':
	        $infos = $upload_handler->post();
			save_photo($infos->name);
			echo json_encode($infos);
	        break;
	    // case 'DELETE':
	    //     $upload_handler->delete();
	    //     break;
	    default:
	        header('HTTP/1.0 405 Method Not Allowed');
	}
}

?>