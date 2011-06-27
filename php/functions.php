<?php

date_default_timezone_set('Asia/Bangkok');

function is_production()
{
	return true;
}

function updated_app()
{
	connect_db();

	$sql = 'UPDATE applications' .
		   ' SET `updated` = NOW() ' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
}

function uuid()
{
	return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
						mt_rand(0, 0xffff), mt_rand(0, 0xffff),
						mt_rand(0, 0xffff),
						mt_rand(0, 0x0fff) | 0x4000,
						mt_rand(0, 0x3fff) | 0x8000,
						mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));
}

function randomStr($length = 10, $letters = '1234567890qwertyuiopasdfghjklzxcvbnm') 
{ 
	$s = ''; 
	$lettersLength = strlen($letters)-1; 

	for ($i = 0 ; $i < $length ; $i++) 
	{ 
		$s .= $letters[rand(0,$lettersLength)]; 
	} 

	return $s; 
}

function json_append($key, $val, &$arr, $lang)
{
	if (isset($val[$key]) && $val[$key] != NULL)
	{
		array_push($arr, "\t\"" . str_replace('-' . $lang, '', $key) . "\": \"" . $val[$key] . "\"");
	}
}

function createUser($username, $password)
{
	$salt = sha1(randomStr());
	$salted_password = sha1(sha1($username) . $salt . sha1($password));

	connect_db();
	$sql = "INSERT INTO users(`username`, `password`, `salt`) VALUES('" . $username . "', '" . $salted_password . "', '" . $salt . "')";
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
	mysql_close();

	return true;
}
	
function connect($username, $password)
{
	if (empty($username) && empty($password))
	{
		return json_encode(array('error' => array('username', 'password')));
	}
	$link = connect_db();
	$sql = 'SELECT id, name, lastname, salt, password, confirm FROM users WHERE username = "' . $username . '"'; 
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 

	$data = mysql_fetch_assoc($req);
	
	if (mysql_num_rows($req))
	{
		$salted_password = sha1(sha1($username) . $data['salt'] . sha1($password));
	
		if ($data['confirm'])
		{
			header('HTTP/1.1 401 Unauthorized');
		}
		elseif ($salted_password == $data['password'])
		{
			$_SESSION['uid'] = $data['id'];
			$_SESSION['root'] = $data['id'] == 0;
			$_SESSION['member_name'] = $data['name'] . ' ' . $data['lastname'];

			return true;
		}
		else
		{
			return json_encode(array('error' => array('password')));
		}
	}
	else
	{
		return json_encode(array('error' => array('username')));
	}

	mysql_close();	
}

function logout()
{
	$_SESSION['uid'] = -1;
	
	session_destroy();

	header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF']);
}

?>