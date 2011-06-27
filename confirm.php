<?php

session_start();

include 'php/db.php';
include 'php/functions.php';

if (isset($_GET['id']) && isset($_GET['h']))
{
	connect_db();
	
	$sql = 'SELECT id, email, salt, confirm, name, lastname FROM users WHERE `id` = "' . intval($_GET['id']) . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	$data = mysql_fetch_assoc($req);

	if ($_GET['h'] == sha1(sha1($data['email']) . $data['confirm'] . $data['salt']))
	{
		$_SESSION['uid'] = $data['id'];
		$_SESSION['root'] = false; // No way root received a confirmation email
		$_SESSION['member_name'] = $data['name'] . ' ' . $data['lastname'];

		$sql = 'UPDATE users SET confirm = "" WHERE `id` = "' . intval($_GET['id']) . '"';
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());		
	}	
}

$paths = explode('/', $_SERVER['PHP_SELF']);
$dir = implode('/', array_splice(&$paths, 0, count($paths) - 1));

header('Location: http://' . $_SERVER['HTTP_HOST'] . $dir);

?>
