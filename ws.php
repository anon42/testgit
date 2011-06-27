<?php

session_start();

include 'php/db.php';
include 'php/functions.php';
include 'php/about.php';
include 'php/promotions.php';
include 'php/location.php';
include 'php/menu.php';
include 'UploadHandler.php';

function create_app()
{
	$db = connect_db();

	$sql = 'SELECT `id` FROM applications ' .
		   ' WHERE `id_user` = "' .  $_SESSION['uid'] . '" ' .
		   ' AND status >= 2';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	

	if (mysql_num_rows($req) == 0)
	{
		$name_en = "Untitled";
		$name_th = "Untitled";

		$sql = 'INSERT INTO applications(`id_user`, `name`, `created`, `updated`) ' .
			   ' VALUES ("' . $_SESSION['uid'] . '", "' . $name_en . '", NOW(), NOW())';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	

		$app = array('id' => mysql_insert_id($db),
					 'name' => $name_en,
					 'created' => date('d / m / y'),
					 'updated' => date('d / m / y'));

		$sql = 'INSERT INTO modules(`id_application`) VALUES ("' . $app['id'] . '")';
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
	
		return json_encode($app);
	}
	else
	{
		return null;
	}
}

function delete_app($app)
{
	$db = connect_db();

	$sql_categories = 'SELECT `id` FROM menu_categories WHERE id_application = "' . $app . '" ';
	$req_categories = mysql_query($sql_categories) or die('Erreur SQL !<br>'.$sql_categories.'<br>'.mysql_error());	

	while ($data_categories = mysql_fetch_assoc($req_categories))
	{
		delete_category($data_categories['id']);
	}
	
	$sql_delete_photos = 'DELETE FROM photos WHERE `id_application` = "' . $app . '" ';
	$req_delete_photos = mysql_query($sql_delete_photos) or die('Erreur SQL !<br>'.$sql_delete_photos.'<br>'.mysql_error());	

	$sql_delete_promotions = 'DELETE FROM promotions WHERE `id_application` = "' . $app . '" ';
	$req_delete_promotions = mysql_query($sql_delete_promotions) or die('Erreur SQL !<br>'.$sql_delete_promotions.'<br>'.mysql_error());	

	$sql_modules = 'DELETE FROM modules WHERE id_application = "' . $app . '" ';
	$req_modules = mysql_query($sql_modules) or die('Erreur SQL !<br>'.$sql_modules.'<br>'.mysql_error());
	
	$sql_application = 'DELETE FROM applications WHERE id = "' . $app . '" ';
	$req_application = mysql_query($sql_application) or die('Erreur SQL !<br>'.$sql_application.'<br>'.mysql_error());
}

function get_apps()
{
	connect_db();
	$sql = 'SELECT id, name, splashscreen, appicon, DATE_FORMAT(`created`, "%d / %m / %y") as created, DATE_FORMAT(`updated`, "%d / %m / %y") as updated, status FROM applications ';
	$sql .= 'WHERE id_user = "' . $_SESSION['uid'] . '"'; 
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 

	$ret = "[\n";
	$i = 0;
	$total = mysql_num_rows($req);
	while ($data = mysql_fetch_assoc($req))
	{
		$ret .= "\t{\n";
		$ret .= "\t\t\"id\": \"" . $data['id'] . "\",\n";
		$ret .= "\t\t\"name\": \"" . $data['name'] . "\",\n";
		$ret .= "\t\t\"created\": \"" . $data['created'] . "\",\n";
		$ret .= "\t\t\"updated\": \"" . $data['updated'] . "\",\n";
		$ret .= "\t\t\"status\": \"" . $data['status'] . "\",\n";
		$ret .= "\t\t\"appicon\": \"" . $data['appicon'] . "\",\n";
		$ret .= "\t\t\"splashscreen\": \"" . $data['splashscreen'] . "\"\n";
		$ret .= "\t}";
		
		if ($total > 1 && ($i < ($total - 1)))
		{
			$ret .= ",\n";
		}

		$i++;
	}
	$ret .= "\n]";

	mysql_close();
	
	return $ret;
}

function get_photos($appid)
{
	connect_db();
	$sql = 'SELECT `id`, `photo`, `thumbnail`' .
		   ' FROM photos ' .
		   ' WHERE id_application = "' . $appid . '"';
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
	
	$i = 0;
	$total = mysql_num_rows($req);

	$ret = "\n\t[\n";
	while ($photos = mysql_fetch_assoc($req))
	{
		$ret .= "\t\t{\n";
		$ret .= "\t\t\t\"thumbnail\": \"" . $photos['thumbnail'] . "\",\n";
		$ret .= "\t\t\t\"details\": \"" . $photos['photo'] . "\",\n";
		$ret .= "\t\t\t\"id\": \"" . $photos['id'] . "\"\n\t\t}";
		$ret .= ($i < ($total - 1)) ? ",\n" : "\n";
		
		$i++;
	}
	$ret .= "\t]";
	
	return $ret;
}

function get_app($appid, $lang)
{
	connect_db();	
	$sql = 'SELECT `logo`, `background`, `splashscreen`, `status`, `theme`, `icon`, `about-image` AS about_image, `about' . '-' . $lang . '`, `address' . '-' . $lang . '`, `telephone`, `email`, `lat`, `lon`' .
		   ' FROM applications ' .
		   ' WHERE id_user = "' . $_SESSION['uid'] . '"' .
		   ' AND id = "' . $appid . '"'; 
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
		
	$app = mysql_fetch_assoc($req);

	$ret = "{\n";
	if (mysql_num_rows($req))
	{
		$arr = array();
		json_append('logo', $app, $arr, $lang);
		json_append('theme', $app, $arr, $lang);
		json_append('icon', $app, $arr, $lang);
		json_append('background', $app, $arr, $lang);
		json_append('splashscreen', $app, $arr, $lang);
		json_append('about_image', $app, $arr, $lang);
		json_append('about-' . $lang, $app, $arr, $lang);
		json_append('address-' . $lang, $app, $arr, $lang);
		json_append('telephone', $app, $arr, $lang);
		json_append('email', $app, $arr, $lang);
		json_append('status', $app, $arr, $lang);
		json_append('lat', $app, $arr, $lang);
		json_append('lon', $app, $arr, $lang);
		
		$ret .= implode(",\n", $arr);
	}

	if ($photos = get_photos($appid, $lang))
	{
		if (substr($ret, -2) != "{\n")
		{
			$ret .= ",\n";
		}
		$ret .= "\t\"photos\":" . $photos;
	}
	
	if ($promotion = get_promotion($appid, $lang))
	{
		if (substr($ret, -2) != "{\n")
		{
			$ret .= ",\n";
		}
		$ret .= "\t\"promotions\":" . $promotion;
	}

	if ($menu = get_menu($appid, $lang))
	{
		if (substr($ret, -2) != "{\n")
		{
			$ret .= ",\n";
		}
		$ret .= "\t\"menu\":" . $menu;
	}
	
	if ($modules = get_modules($appid))
	{
		if (substr($ret, -2) != "{\n")
		{
			$ret .= ",\n";
		}
		$ret .= "\t\"modules\":" . $modules;
	}
	
	$ret .= "\n}";
	echo $ret;
	
	$_SESSION['appid'] = $appid;
	$_SESSION['lang'] = $lang;
	
	mysql_close();
}

function upload_logo()
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE applications' .
		   ' SET `logo` = "' . $infos->name . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return json_encode($infos);
}

function save_app_theme($theme)
{
	connect_db();

	$sql = 'UPDATE applications' .
		   ' SET `theme` = "' . $theme . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return $theme;
}

function save_icon_theme($theme)
{
	connect_db();

	$sql = 'UPDATE applications' .
		   ' SET `icon` = "' . $theme . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return $theme;
}

function upload_app_background()
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE applications' .
		   ' SET `background` = "' . $infos->name . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return json_encode($infos);
}

function upload_splashscreen()
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE applications' .
		   ' SET `splashscreen` = "' . $infos->name . '", ' .
		   ' `updated` = NOW()' .
		   ' WHERE id = "' . $_SESSION['appid'] . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return json_encode($infos);
}

function delete_background()
{
	connect_db();
	
	$sql = 'UPDATE applications SET `background` = "" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function delete_splashscreen()
{
	connect_db();
	
	$sql = 'UPDATE applications SET `splashscreen` = "" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function delete_logo()
{
	connect_db();
	
	$sql = 'UPDATE applications SET `logo` = "" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function delete_about_image()
{
	connect_db();
	
	$sql = 'UPDATE applications SET `about-image` = "" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function save_app_name($name)
{
	connect_db();
	
	$sql = 'UPDATE applications SET `name` = "' . $name . '" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());		
	
	return $name;
}

function upload_photo()
{
	connect_db();
	
	$upload_handler = new UploadHandler();

	$infos = $upload_handler->post();
	
	$photo = array('id' => uuid(), 'thumbnail' => $infos->name);
	
	$sql = 'INSERT INTO photos(`id`, `id_application`, `thumbnail`) VALUES("' . $photo['id'] . '", "' . $_SESSION['appid'] . '", "' . $photo['thumbnail'] . '")';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return json_encode($photo);
}

function upload_photo_details($photo)
{
	connect_db();
	
	$upload_handler = new UploadHandler();

	$infos = $upload_handler->post();
	
	$ret = array('id' => $photo, 'details' => $infos->name);
	
	$sql = 'UPDATE photos SET `photo` = "' . $ret['details'] . '"';
	$sql .= ' WHERE `id` = "' . $photo . '"';
	$sql .= ' AND id_application = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	return json_encode($ret);
}

function delete_photo($id)
{
	connect_db();
	
	$sql = 'DELETE FROM photos WHERE `id` = "' . $id . '" AND `id_application` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());		
}

function load_users()
{
	connect_db();
	
	$sql = 'SELECT `id`, `name`, `lastname` FROM `users`';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	
	$arr = array();
	
	while ($data = mysql_fetch_assoc($req))
	{
		$name = $data['name'] . ' ' . $data['lastname'];
		$name = trim($name);
		if (empty($name))
		{
			$name = 'Undefined';
		}
		array_push(&$arr, array('id' => $data['id'], 'name' => $name));
	}
	
	return json_encode($arr);
}

function switch_user($id)
{
	$_SESSION['uid'] = $id;
}

function set_status($app, $status)
{
	connect_db();
	
	$sql = 'UPDATE applications SET `status` = "' . $status . '" WHERE `id` = "' . $app . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());		
}

function get_modules($appid)
{
	connect_db();
	$sql = 'SELECT `about`, `menu`, `promotion`, `gallery`, `location`, `accomodation` FROM modules ' .
	 	   'WHERE id_application = "' . $appid . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 

	$ret = "";
	if (mysql_num_rows($req))
	{
		$data = mysql_fetch_assoc($req);
		$ret .= "\n\t{\n\t\t\"about\": \"" . $data['about'] . "\",\n" .
				"\t\t\"menu\": \"" . $data['menu'] . "\",\n" .
				"\t\t\"promotion\": \"" . $data['promotion'] . "\",\n" .
				"\t\t\"gallery\": \"" . $data['gallery'] . "\",\n" .
				"\t\t\"accomodation\": \"" . $data['accomodation'] . "\",\n" .
				"\t\t\"location\": \"" . $data['location'] . "\"\n\t}";
	}

	return $ret;
}

function add_module($module)
{
	connect_db();
	
	$sql = 'UPDATE modules SET ' . $module . ' = "1" WHERE `id_application` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function remove_module($module)
{
	connect_db();
	
	$sql = 'UPDATE modules SET ' . $module . ' = "0" WHERE `id_application` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());		
}

function can_edit()
{
	connect_db();
	
	if ($_SESSION['root'] == true)
	{
		return true;
	}
	
	$sql = 'SELECT `status` FROM applications WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	$data = mysql_fetch_assoc($req);
	
	return $data['status'] == null || $data['status'] == 1;
}

function publish()
{
	connect_db();
	
	$sql = 'UPDATE applications SET status = "1" WHERE `id` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
}

function upload_appicon($app)
{
	connect_db();

	$sql = 'SELECT `id` FROM applications WHERE `id` = "' . $app . '" AND  `id_user` = "' . $_SESSION['uid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());

	if (mysql_num_rows($req) || (isset($_SESSION['root']) && $_SESSION['root'] == true))
	{	
		$upload_handler = new UploadHandler();

		$infos = $upload_handler->post();
	
		$ret = array('id' => $app, 'name' => $infos->name);
	
		$sql = 'UPDATE applications SET `appicon` = "' . $ret['name'] . '"';
		$sql .= ' WHERE id = "' . $app . '"';
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	}

	return json_encode($ret);	
}

$request = null;
if (isset($_GET['r']))
{
	$request = $_GET['r'];
}
if (isset($_POST['r']))
{
	$request = $_POST['r'];
}

if (isset($_GET['r']) && $_GET['r'] == 'login')
{
	echo connect(th_escape($_POST['username']), th_escape($_POST['password']));
}
elseif (isset($_SESSION['uid']) && isset($request) && $request != 'register')
{
	switch ($request)
	{
		case "appicon":
			if (can_edit())
			{
				if (isset($_GET['id']))
				{
					echo upload_appicon(th_escape($_GET['id']));
				}
			}
			break;
		case "about":
			if (can_edit())
			{
				if (isset($_POST['remove']))
				{
					echo delete_about_image();
				}
				elseif (isset($_GET['upload']))
				{
					echo upload_about_image();
				}
				elseif (isset($_POST['value']))
				{
					echo save_about(th_escape($_POST['value']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "address":
			if (can_edit())
			{
				if (isset($_POST['location']))
				{
					echo save_location(th_escape($_POST['lat']), th_escape($_POST['lon']));
				}
				if (isset($_POST['value']))
				{
					echo save_address(th_escape($_POST['value']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "app":
			if (isset($_POST['remove']) && isset($_POST['id']))
			{
				if (can_edit())
				{
					echo delete_app(intval($_POST['id']));
				}
				else
				{
					header('HTTP/1.1 401 Unauthorized');
				}
			}
			elseif (isset($_POST['r']))
			{
				echo create_app();
			}
			elseif (isset($_GET['id']) && isset($_GET['lang']))
			{
				echo get_app(intval($_GET['id']), th_escape($_GET['lang']));
			}
			break;
		case "appname":
			if (can_edit())
			{
				if (isset($_POST['value']))
				{
					echo save_app_name(th_escape($_POST['value']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "apps":
			echo get_apps();
			break;
		case "background":
			if (can_edit())
			{
				if (isset($_POST['remove']))
				{
					echo delete_background();
				}
				else
				{
					echo upload_app_background();
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "category":
			if (can_edit())
			{
				if (isset($_POST['remove']) && isset($_POST['id']))
				{
					echo delete_category(th_escape($_POST['id']));
				}
				elseif (isset($_GET['upload']))
				{
					echo upload_category_thumbnail(th_escape($_GET['upload']));
				}
				elseif (isset($_POST['categoryid']) && isset($_POST['value'])  && isset($_POST['lang']))
				{
					echo save_category(th_escape($_POST['categoryid']), th_escape($_POST['value']), th_escape($_POST['lang']));
				}
				elseif (isset($_POST['r']))
				{
					echo create_category();
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "email":
			if (can_edit())
			{
				if (isset($_POST['value']))
				{
					echo save_email(th_escape($_POST['value']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "icon_theme":
			if (can_edit())
			{
				if (isset($_GET['theme']))
				{
					echo save_icon_theme(intval($_GET['theme']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "item":
			if (can_edit())
			{
				if (isset($_POST['remove']) && isset($_POST['id']))
				{
					echo delete_item(th_escape($_POST['id']));
				}
				elseif (isset($_GET['upload']))
				{
					echo upload_item_thumbnail(th_escape($_GET['upload']));
				}
				elseif (isset($_POST['r']) && isset($_POST['section']))
				{
					echo create_item(th_escape($_POST['section']));
				}
				elseif (isset($_GET['r']) && isset($_POST['itemid']) && isset($_POST['value']) && isset($_POST['lang']))
				{
					echo save_item(th_escape($_POST['itemid']), th_escape($_POST['value']), th_escape($_POST['lang']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "load_users":
			if ($_SESSION['root'] == true)
			{
				echo load_users();
			}
			break;
		case "logo":
			if (can_edit())
			{
				if (isset($_POST['remove']))
				{
					echo delete_logo();
				}
				else
				{
					echo upload_logo();
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "module":
			if (can_edit())
			{
				if (isset($_POST['module']) && isset($_POST['remove']))
				{
					echo remove_module(th_escape($_POST['module']));
				}
				elseif (isset($_POST['module']))
				{
					echo add_module(th_escape($_POST['module']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "photo":
			if (can_edit())
			{
				if (isset($_GET['details']))
				{
					echo upload_photo_details(th_escape($_GET['details']));
				}
				elseif (isset($_POST['id']) && isset($_POST['remove']))
				{
					echo delete_photo(th_escape($_POST['id']));
				}
				else
				{
					echo upload_photo();
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "prefs":
			$uid = (isset($_SESSION['uid']) ? $_SESSION['uid'] : null);
			$appid = (isset($_SESSION['appid']) ? $_SESSION['appid'] : null);
			$lang = (isset($_SESSION['lang']) ? $_SESSION['lang'] : null);
			echo '{"app": "' . $appid . '", "lang": "' . $lang . '", "uid": "' . $uid . '"}';
			break;
		case "promotion":
			if (isset($_GET['id']))
			{
				echo get_promotion($_SESSION['appid'], $_SESSION['lang'], th_escape($_GET['id']));
			}
			else if (isset($_GET['r']) && !isset($_POST))
			{
				echo get_promotion($_SESSION['appid'], $_SESSION['lang']);
			}
			else
			{
				if (can_edit())
				{
					if (isset($_POST['id']) && isset($_POST['remove']))
					{
						echo delete_promotion(th_escape($_POST['id']));
					}
					else if (isset($_GET['details']))
					{
						echo upload_promotion_details(th_escape($_GET['details']));
					}
					else if (isset($_GET['upload']))
					{
						echo upload_promotion_thumbnail(th_escape($_GET['upload']));
					}
					else if (isset($_POST['details']) && isset($_POST['promotionid']) && isset($_POST['lang']) && isset($_POST['value']))
					{
						echo save_promotion_details(th_escape($_POST['promotionid']), th_escape($_POST['value']), th_escape($_POST['lang']));
					}
					else if (isset($_POST['promotionid']) && isset($_POST['lang']) && isset($_POST['value']))
					{
						echo save_promotion(th_escape($_POST['promotionid']), th_escape($_POST['value']), th_escape($_POST['lang']));
					}
					else if (isset($_POST['r']))
					{
						echo create_promotion();
					}
				}
				else
				{
					header('HTTP/1.1 401 Unauthorized');
				}
			}
			break;
		case "publish":
			if (can_edit())
			{
				echo publish();
			}
			break;
		case "section":
			if (can_edit())
			{
				if (isset($_POST['id']) && isset($_POST['remove']))
				{
					echo delete_section(th_escape($_POST['id']));
				}
				if (isset($_POST['r']) && isset($_POST['category']))
				{
					echo create_section(th_escape($_POST['category']));
				}
				elseif (isset($_GET['r']) && isset($_POST['sectionid']) && isset($_POST['value']) && isset($_POST['lang']))
				{
					echo save_section(th_escape($_POST['sectionid']), th_escape($_POST['value']), th_escape($_POST['lang']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "set_status":
			if (can_edit())
			{
				if (isset($_POST['id']) && isset($_POST['status']) && $_SESSION['root'] == true)
				{
					echo set_status(th_escape($_POST['id']), th_escape($_POST['status']));
				}
				else
				{
					header('HTTP/1.1 401 Unauthorized');
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "splashscreen":
			if (can_edit())
			{
				if (isset($_POST['remove']))
				{
					echo delete_splashscreen();
				}
				else
				{
					echo upload_splashscreen();
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "switch_user":
			if (isset($_POST['id']) && $_SESSION['root'] == true)
			{
				echo switch_user(th_escape($_POST['id']));
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "telephone":
			if (can_edit())
			{
				if (isset($_POST['value']))
				{
					echo save_telephone(th_escape($_POST['value']));
				}
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
			break;
		case "theme":
			if (can_edit())
			{
				if (isset($_GET['theme']))
				{
					echo save_app_theme(intval($_GET['theme']));
				}
				break;
			}
			else
			{
				header('HTTP/1.1 401 Unauthorized');
			}
		default:
			break;
	}
}
elseif (isset($_GET['r']) && $_GET['r'] == 'register')
{
	$errors = array();
	$fields = array('name', 'lastname', 'email', 'password');

	foreach ($fields as $field)
	{
		if (!isset($_POST[$field]) || empty($_POST[$field]))
		{
			array_push(&$errors, $field);
		}
	}

	if (empty($errors))
	{
		if (!filter_var(th_escape($_POST['email']), FILTER_VALIDATE_EMAIL))
		{
			array_push(&$errors, 'email');
		}
	}
	
	if (empty($errors) && !filter_var(th_escape($_POST['email']), FILTER_VALIDATE_EMAIL))
	{
		array_push(&$errors, 'email');
	}

	$link = connect_db();
	
	$sql = 'SELECT `id` FROM users WHERE `email` = "' . th_escape($_POST['email']) . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	if (empty($errors) && mysql_num_rows($req))
	{
		array_push(&$errors, 'email');			
	}

		
	if (empty($errors) && isset($_POST['uid']) && (empty($_POST['uid']) || $_POST['uid'] == $_SESSION['uid']))
	{		
		
		$salt = sha1(randomStr());
		$salted_password = sha1(sha1(th_escape($_POST['email'])) . $salt . sha1(th_escape($_POST['password'])));
		$confirm = sha1(randomStr());
		$confirm_hash = sha1(sha1(th_escape($_POST['email'])) . $confirm . $salt);
		
		if (empty($_POST['uid']))
		{
			$sql = 'INSERT INTO users(`name`, `lastname`, `company`, `address`, `phone`, `ext`, `mobile`, `email`, `username`, `password`, `salt`, `confirm`)' .
				   ' VALUES("' . th_escape($_POST['name']) . '", "' .
					th_escape($_POST['lastname']) . '", "' .
					th_escape($_POST['company']) . '", "' .
					th_escape($_POST['address']) . '", "' .
					th_escape($_POST['phone']) . '", "' .
					th_escape($_POST['ext']) . '", "' .
					th_escape($_POST['mobile']) . '", "' .
					th_escape($_POST['email']) . '", "' .
					th_escape($_POST['email']) . '", "' .
					$salted_password . '", "' .
					$salt . '","' .
					$confirm . '")';

			$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
			$_SESSION['uid'] = mysql_insert_id($link);
			
			mail(th_escape($_POST['email']), 'Confirm iBizApp Registration', "Thanks for creating an account at http://ibizapp.hosting.co.th.\nYou're account needs to be activated so you can start building iPhone Apps.\n\nPlease copy and paste or click the following link into you're browser address bar :\n\nhttp://ibizapp.hosting.co.th/confirm.php?id=" . $_SESSION['uid'] . "&h=" . $confirm_hash . "\n\nIf you have any issue during this process or by using iBizApp, please contact iphone@hosting.co.th");
		}
		else
		{
			$sql = 'UPDATE users ';
			$sql .= 'SET name = "' . th_escape($_POST['name']) . '", ';
			$sql .= 'lastname = "' . th_escape($_POST['lastname']) . '", ';
			$sql .= 'company = "' . th_escape($_POST['company']) . '", ';
			$sql .= 'address = "' . th_escape($_POST['address']) . '", ';
			$sql .= 'phone = "' . th_escape($_POST['phone']) . '", ';
			$sql .= 'ext = "' . th_escape($_POST['ext']) . '", ';
			$sql .= 'mobile = "' . th_escape($_POST['mobile']) . '", ';
			$sql .= 'email = "' . th_escape($_POST['email']) . '", ';
			$sql .= 'username = "' . th_escape($_POST['email']) . '", ';
			$sql .= 'password = "' . $salted_password . '", ';
			$sql .= 'salt = "' . $salt . '" ';
			$sql .= 'WHERE id = "' . $_SESSION['uid'] . '"';

			$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
		}

		$_SESSION['member_name'] = th_escape($_POST['name']) . ' ' . th_escape($_POST['lastname']);
		$_SESSION['root'] = false;
	}
	else
	{
		echo json_encode($errors);
	}
}
else
{
	header('HTTP/1.1 401 Unauthorized');
}

?>