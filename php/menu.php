<?php

function delete_item($id)
{
	if (_item_belongs_to_user($id))
	{
		$db = connect_db();

		$sql_delete_items = 'DELETE FROM menu_items WHERE `id` = "' . $id . '" ';
		$req_delete_items = mysql_query($sql_delete_items) or die('Erreur SQL !<br>'.$sql_delete_items.'<br>'.mysql_error());
	}
}

function delete_section($id)
{
	if (_section_belongs_to_user($id))
	{
		$db = connect_db();

		$sql_items = 'SELECT `id` FROM menu_items WHERE id_section = "' . $id . '" ';
		$req_items = mysql_query($sql_items) or die('Erreur SQL !<br>'.$sql_items.'<br>'.mysql_error());
	
		while ($data_items = mysql_fetch_assoc($req_items))
		{
			delete_item($data_items['id']);
		}
	
		$sql_delete_sections = 'DELETE FROM menu_sections WHERE `id` = "' . $id . '" ';
		$req_delete_sections = mysql_query($sql_delete_sections) or die('Erreur SQL !<br>'.$sql_delete_sections.'<br>'.mysql_error());	
	}
}

function delete_category($id)
{
	if (_category_belongs_to_user($id))
	{
		$db = connect_db();

		$sql_sections = 'SELECT `id` FROM menu_sections WHERE id_category = "' . $id . '" ';
		$req_sections = mysql_query($sql_sections) or die('Erreur SQL !<br>'.$sql_sections.'<br>'.mysql_error());	
	
		while ($data_sections = mysql_fetch_assoc($req_sections))
		{
			delete_section($data_sections['id']);
		}
	
		$sql_delete_categories = 'DELETE FROM menu_categories WHERE `id` = "' . $id . '" ';
		$req_delete_categories = mysql_query($sql_delete_categories) or die('Erreur SQL !<br>'.$sql_delete_categories.'<br>'.mysql_error());	
	}
}

function _section_for_item($item)
{
	connect_db();

	$sql = 'SELECT `id_section`' .
		   ' FROM menu_items ' .
		   ' WHERE id = "' . $item . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 	
	$data = mysql_fetch_assoc($req);
	
	return $data['id_section'];
}

function _category_for_section($section)
{
	connect_db();

	$sql = 'SELECT `id_category`' .
		   ' FROM menu_sections ' .
		   ' WHERE id = "' . $section . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 	
	$data = mysql_fetch_assoc($req);
	
	return $data['id_category'];	
}

function _item_belongs_to_user($itemid)
{
	connect_db();

	return _category_belongs_to_user(_category_for_section(_section_for_item($itemid)));
}

function _section_belongs_to_user($section)
{
	connect_db();

	if (_category_belongs_to_user(_category_for_section($section)))
	{
		return true;
	}
	
	return false;
}

function _category_belongs_to_user($category)
{
	connect_db();

	$sql = 'SELECT `id`' .
		   ' FROM menu_categories ' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"';
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 

	return mysql_num_rows($req) != 0;
}

function upload_category_thumbnail($categoryid)
{
	$upload_handler = new UploadHandler();
	
	$infos = $upload_handler->post();
	
	connect_db();

	$sql = 'UPDATE menu_categories' .
		   ' SET `thumbnail` = "' . $infos->name . '"' .
		   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
		   ' AND id = "' . $categoryid . '"';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
	updated_app();
    
	echo json_encode($infos);
}

function upload_item_thumbnail($itemid)
{
	if (_item_belongs_to_user($itemid))
	{
		$upload_handler = new UploadHandler();
	
		$infos = $upload_handler->post();
	
		connect_db();

		$sql = 'UPDATE menu_items' .
			   ' SET `thumbnail` = "' . $infos->name . '"' .
			   ' WHERE id = "' . $itemid . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
    	updated_app();
	
		echo json_encode($infos);
	}
}

function get_sections($category, $lang)
{
	$sql = 'SELECT `id`, `title-' . $lang . '` AS title' .
		   ' FROM menu_sections ' .
		   ' WHERE id_category = "' . $category . '"';
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
	
	$ret = "\n\t\t\t[\n";
	$arr = array();
	while ($data = mysql_fetch_assoc($req))
	{
		$s = "\t\t\t\t{\n\t\t\t\t\t";
		$s .= "\"id\": \"" . $data['id'] . "\",\n\t\t\t\t\t";
		$s .= "\"title\": \"" . $data['title'] . "\",\n\t\t\t\t\t";
		$s .= "\"items\": " . get_items($data['id'], $lang);
		$s .= "\n\t\t\t\t}";
		array_push($arr, $s);
	}
	$ret .= implode(",\n", $arr);
	$ret .= "\n\t\t\t]";
	
	return $ret;	
}

function get_items($section, $lang)
{
	$sql = 'SELECT `id`, `title-' . $lang . '` AS title, thumbnail' .
		   ' FROM menu_items ' .
		   ' WHERE id_section = "' . $section . '"';
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
	
	$ret = "\n\t\t\t\t\t[\n";
	$arr = array();
	while ($data = mysql_fetch_assoc($req))
	{
		$s = "\t\t\t\t\t\t{\n\t\t\t\t\t\t\t";
		$s .= "\"id\": \"" . $data['id'] . "\",\n\t\t\t\t\t\t\t";
		$s .= "\"title\": \"" . $data['title'] . "\",\n\t\t\t\t\t\t\t";
		$s .= "\"thumbnail\": \"" . $data['thumbnail'] . "\"";
		$s .= "\n\t\t\t\t\t\t}";
		array_push($arr, $s);
	}
	$ret .= implode(",\n", $arr);
	$ret .= "\n\t\t\t\t\t]";
	
	return $ret;
}

function get_menu($appid, $lang)
{
	$sql = 'SELECT `id`, `title-' . $lang . '` AS title, `thumbnail`' .
		   ' FROM menu_categories ' .
		   ' WHERE id_application = "' . $appid . '"';
		
	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
	
	$ret = "\n\t[\n";
	$arr = array();
	while ($data = mysql_fetch_assoc($req))
	{
		$s = "\t\t{\n\t\t\t";
		$s .= "\"id\": \"" . $data['id'] . "\",\n\t\t\t";
		$s .= "\"title\": \"" . $data['title'] . "\",\n\t\t\t";
		$s .= "\"thumbnail\": \"" . $data['thumbnail'] . "\",\n\t\t\t";
		$s .= "\"sections\": " . get_sections($data['id'], $lang);
		$s .= "\n\t\t}";
		array_push($arr, $s);
	}
	$ret .= implode(",\n", $arr);
	$ret .= "\n\t]";
	
	return $ret;
}

function save_category($categoryid, $title, $lang)
{
	connect_db();

	if (_category_belongs_to_user($categoryid))
	{
		$sql = 'UPDATE menu_categories' .
			   ' SET `title-' . $lang . '` = "' . $title . '"' .
			   ' WHERE id_application = "' . $_SESSION['appid'] . '"' .
			   ' AND id = "' . $categoryid . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
		updated_app();
	}
	
	return $title;		
}

function create_category()
{
	connect_db();

	$title_en = "Untitled Category";
	$title_th = "Untitled Category";
	$category = array('id' => uuid(), 'title' => ($_SESSION['lang'] == 'th') ? $title_th : $title_en);

	$sql = 'INSERT INTO menu_categories(`id`, `id_application`, `title-en`, `title-th`) ' .
		   ' VALUES ("' . $category['id'] . '", "' . $_SESSION['appid'] . '", ' .
		   ' "' . $title_en . '", "' . $title_th . '")';

	$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
	updated_app();
	
	return json_encode($category);	
}

function create_section($parent_category)
{
	connect_db();

	if (_category_belongs_to_user($parent_category))
	{
		$title_en = "Untitled Section";
		$title_th = "Untitled Section";
		$section = array('id' => uuid(), 'title' => ($_SESSION['lang'] == 'th') ? $title_th : $title_en);

		$sql = 'INSERT INTO menu_sections(`id`, `id_category`, `title-en`, `title-th`) ' .
			   ' VALUES ("' . $section['id'] . '", "' . $parent_category . '", ' .
			   ' "' . $title_en . '", "' . $title_th . '")';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
	
		return json_encode($section);
	}
	
	return null;
}

function save_section($sectionid, $value, $lang)
{
	connect_db();
	
	if (_section_belongs_to_user($sectionid))
	{
		$sql = 'UPDATE menu_sections' .
			   ' SET `title-' . $lang . '` = "' . $value . '"' .
			   ' WHERE id = "' . $sectionid . '"';
			
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());
		updated_app();
	}
	
	return $value;
}

function create_item($parent_section)
{
	if (_section_belongs_to_user($parent_section))
	{
		$title_en = "Untitled Item";
		$title_th = "Untitled Item";
		$item = array('id' => uuid(), 'title' => ($_SESSION['lang'] == 'th') ? $title_th : $title_en);

		$sql = 'INSERT INTO menu_items(`id`, `id_section`, `title-en`, `title-th`) ' .
			   ' VALUES ("' . $item['id'] . '", "' . $parent_section . '", ' .
			   ' "' . $title_en . '", "' . $title_th . '")';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
		updated_app();

		return json_encode($item);
	}

	return null;
}

function save_item($itemid, $value, $lang)
{
	connect_db();

	if (_item_belongs_to_user($itemid))
	{
		$sql = 'UPDATE menu_items' .
			   ' SET `title-' . $lang . '` = "' . $value . '"' .
			   ' WHERE id = "' . $itemid . '"';

		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error());	
		updated_app();
	}
	
	return $value;
}

function menu($appid)
{
	
}
	
?>