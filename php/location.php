<?php

function save_address($address)
{
	if (isset($_SESSION['uid']) && isset($_SESSION['appid']) && isset($_SESSION['lang']))
	{
		connect_db();
		
		$sql = 'UPDATE applications ' .
			   ' SET `address' . '-' . $_SESSION['lang'] . '` = "' . $address . '", ' .
			   ' `updated` = NOW()' .
			   ' WHERE id = "' . $_SESSION['appid'] . '"' .
			   ' AND id_user = "' . $_SESSION['uid'] . '"';
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}
	
	return $address;
}

function save_location($lat, $lon)
{
	if (isset($_SESSION['uid']) && isset($_SESSION['appid']))
	{
		connect_db();
		
		$sql = 'UPDATE applications ' .
			   ' SET `lat` = "' . $lat . '", ' .
			   ' `lon` = "' . $lon . '", ' .
			   ' `updated` = NOW()' .
			   ' WHERE id = "' . $_SESSION['appid'] . '"' .
			   ' AND id_user = "' . $_SESSION['uid'] . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}	
}

function save_telephone($telephone)
{
	if (isset($_SESSION['uid']) && isset($_SESSION['appid']) && isset($_SESSION['lang']))
	{
		connect_db();
		
		$sql = 'UPDATE applications ' .
			   ' SET `telephone` = "' . $telephone . '", ' .
			   ' `updated` = NOW()' .
			   ' WHERE id = "' . $_SESSION['appid'] . '"' .
			   ' AND id_user = "' . $_SESSION['uid'] . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}
	
	return $telephone;
}

function save_email($email)
{
	if (isset($_SESSION['uid']) && isset($_SESSION['appid']) && isset($_SESSION['lang']))
	{
		connect_db();
		
		$sql = 'UPDATE applications ' .
			   ' SET `email` = "' . $email . '", ' .
			   ' `updated` = NOW()' .
			   ' WHERE id = "' . $_SESSION['appid'] . '"' .
			   ' AND id_user = "' . $_SESSION['uid'] . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}
	
	return $email;
}

?>