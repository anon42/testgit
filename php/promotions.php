<?php

function delete_promotion($promotion)
{
	$db = connect_db();

	$sql = 'DELETE FROM promotions WHERE `id` = "' . $promotion . '" AND `id_application` = "' . $_SESSION['appid'] . '"';
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
}

function upload_promotion_thumbnail($promotionid)
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE promotions' .
		   ' SET `thumbnail` = "' . $infos->name . '"' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
		   ' AND id = "' . $promotionid . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	updated_app();

	return json_encode($infos);
}

function upload_promotion_details($promotionid)
{
	connect_db();

	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();

	$sql = 'UPDATE promotions' .
		   ' SET `photo` = "' . $infos->name . '"' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
		   ' AND id = "' . $promotionid . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	updated_app();

	return json_encode($infos);
}

function get_promotion($appid, $lang, $id = null)
{
	connect_db();
	$sql = 'SELECT `id`, `title-' . $lang . '` AS title, `promotion-' . $lang . '` AS promotion, photo, thumbnail FROM promotions ' .
	 	   'WHERE id_application = "' . $appid . '"';
	if ($id != null)
	{
		$sql .= ' AND id = "' . $id . '"';
	} 

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 

	$i = 0;
	$total = mysql_num_rows($req);

	$ret = "\n\t[\n";
	while ($data = mysql_fetch_assoc($req))
	{
		$sep = ($i < ($total - 1)) ? ",\n" : '';
		$ret .= "\t\t{\n\t\t\t\"id\": \"" . $data['id'] . "\",\n" .
				"\t\t\t\"title\": \"" . $data['title'] . "\",\n" .
				"\t\t\t\"details\": \"" . $data['promotion'] . "\",\n" .
				"\t\t\t\"photo\": \"" . $data['photo'] . "\",\n" .
				"\t\t\t\"thumbnail\": \"" . $data['thumbnail'] . "\"\n\t\t}" . $sep;
				
		$i++;
	}
	$ret .= "\n\t]";
	
	return $ret;
}

function create_promotion()
{
	connect_db();

	$title_en = "Untitled Promotion";
	$title_th = "Untitled Promotion";
	$promotion = array('id' => uuid(), 'title' => ($_SESSION['lang'] == 'th') ? $title_th : $title_en);

	$sql = 'INSERT INTO promotions(`id`, `id_application`, `title-en`, `title-th`) ' .
		   ' VALUES ("' . $promotion['id'] . '", "' . $_SESSION['appid'] . '", ' .
		   ' "' . $title_en . '", "' . $title_th . '")';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
	updated_app();

	return json_encode($promotion);
}

function save_promotion($id, $title, $lang)
{
	connect_db();

	$sql = 'UPDATE promotions' .
		   ' SET `title-' . $lang . '` = "' . $title . '"' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
		   ' AND id = "' . $id . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	updated_app();
	
	return $title;	
}

function save_promotion_details($id, $title, $lang)
{
	connect_db();

	$sql = 'UPDATE promotions' .
		   ' SET `promotion-' . $lang . '` = "' . $title . '"' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
		   ' AND id = "' . $id . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	updated_app();
	
	return $title;	
}

?>