<?php 

session_start();

include 'php/db.php';
include 'php/functions.php';

if (isset($_GET['logout']))
{
	logout();
}

if (isset($_POST['login']) && isset($_POST['username']) && isset($_POST['password']))
{
	connect(th_escape($_POST['username']), th_escape($_POST['password']));
}

connect_db();

?>

<!DOCTYPE HTML>
<html lang="en" class="no-js">
<head>
	<meta charset="utf-8">

	<title>ThaiHosting Template Generator</title>

	<link rel="stylesheet" href="css/Templater.css.php" />
	<link media="only screen and (max-device-width: 480px)" href="css/Templater/iPhone.css" type="text/css" rel="stylesheet" />
	<script type="text/javascript" src="js/Templater.js.php"></script>
</head>

<body>
<!-- 
	#scrollContainer: Fix a bug for Chrome to scroll to top
	http://stackoverflow.com/questions/1830080/jquery-scrolltop-doesnt-seem-to-work-in-safari-or-chrome-windows
-->
<div id="scrollContainer">

<div id="publish-overlay">
	<div>
		<div>
			<h2></h2>
	
			<p></p>
	
			<div class="buttons">
				<a href="" class="confirm"><span>Confirm</a>
				<a href="" class="cancel"><span>Cancel</a>
				<div style="clear: both"></div>
			</div>
		</div>
	</div>
</div>

<div id="browser">
	<h1>Your browser is not compatible</h1>
	
	<p>You need a modern browser, at the latest version :</p>
	
	<ul>
		<li><a href="http://www.google.com/chrome">Chrome 11+</a></li>
		<li><a href="http://www.mozilla.com">Firefox 4+</a></li>
		<li><a href="http://www.apple.com/safari/download/">Safari 5+</a></li>
	</ul>
	
	<a href="" class="dismiss">I'm think I'm gonna be ok</a> 
</div>

<div id="header">
	<a href="index.php"></a>
	
	<ul id="select-lang">
		<li>Select Language</li>
		<li><a href="" id="app-en"></a></li>
		<li><a href="" id="app-th"></a></li>
	</ul>
</div>

<div id="main">

	<div id="user-header">
		<h2>
			<?php
			if (isset($_GET['profile']))
			{
				echo 'Edit <span class="blue_span">Your Profile</span>';
			}
			elseif (isset($_SESSION['uid']) && $_SESSION['uid'] != -1)
			{
				echo 'Create <span class="blue_span">Your App</span>';
			}
			elseif (isset($_GET['register']))
			{
				echo 'Register <span class="blue_span">Form</span>';
			}
			else
			{
				echo 'Create Your App by <span class="blue_span">iBizApp</span>';				
			}
			?>
		</h2>

		<?php if (isset($_SESSION['uid']) && $_SESSION['uid'] != -1) { ?>
		<ul>
			<li class="welcome">Welcome</li>
			<li class="member"><?php echo $_SESSION['member_name']; ?></li>
			<li class="edit-profile"><a href="?profile">Edit Profile</a></li>
			<li class="logout"><a href="?logout">Logout</a></li>
		</ul>
		<?php } ?>
	</div>
	
<?php

if (isset($_SESSION['uid']) && $_SESSION['uid'] != -1 && !isset($_GET['profile'])) // connected
{

?>	
	<div id="container">
		<div style="float: left">
			<?php if (isset($_SESSION['root']) && $_SESSION['root'] == true) { ?>
			<div id="users">
				<h2>Users <span></span></h2>

				<ul>
				</ul>

				<div style="clear: both"></div>
			</div>
			<?php } ?>
			<div id="apps">
				<h2>Your iPhone Apps <span></span></h2>
				<ul>
					<li class="loading"></li>
				</ul>

				<hr />
				
				<a href="" id="apps-prev"></a>
				<a href="" id="apps-next"></a>
				
				<div style="clear: both"></div>
			</div>
			
			<a href="#first" id="new_app"><span>Create New App</a>
			<a href="mailto:contact@hosting.co.th?subject=iPhone%20App" id="by_thaihosting"><span>Create Your App by Thaihosting</span></a>
		</div>

		<h1 id="page-title">Customize Your App</h1>

		<div id="iphone">
	
			<div id="applicationLogo">
			    <form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
					<label>
			        	<input type="file" name="file[]" multiple>
					</label>
			        <button type="submit">Upload</button>
			    </form>

				<div class="image"></div>
				<div class="delete"><a href=""></a></div>
				<div id="logoProgressBar"></div>
			</div>
	
			<div id="backButton">
				<a href="">Back</a>
			</div>
	
			<div id="overlay">
				<div class="white-spinner"></div>
			</div>

			<div id="splashscreen-overlay"></div>
				
			<div id="background"></div>
			<div id="status"></div>
			<div id="navigationBar"></div>
			
			<div id="first" class="iOSScroll">
				<ul>
					<li class="about">
						<span class="sq"><span></span></span>
						<span class="title">About Us</span>
						<span class="disclosure"></span>
					</li>
					<li class="menu">
						<span class="sq"><span></span></span>
						<span class="title">Menu</span>
						<span class="disclosure"></span>
					</li>
					<li class="promotion">
						<span class="sq"><span></span></span>
						<span class="title">Promotion</span>
						<span class="disclosure"></span>
					</li>
					<li class="gallery">
						<span class="sq"><span></span></span>
						<span class="title">Gallery</span>
						<span class="disclosure"></span>
					</li>
					<li class="location">
						<span class="sq"><span></span></span>
						<span class="title">Location</span>
						<span class="disclosure"></span>
					</li>
					<li class="accomodation">
						<span class="sq"><span></span></span>
						<span class="title">Accomodation</span>
						<span class="disclosure"></span>
					</li>
			</div>
	
			<div id="about" class="iOSScroll">
		
				<dl class="appDl">
					<dt><span class="sq"><span></span></span><span id="title" class="title">About Us</span></dt>
					<dd>
						<span id="aboutImage">
					    	<div class="progressBar"></div>
							<div id="image"></div>
							<div class="delete"><a href=""></a></div>

						    <form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
						        <label>
									<input type="file" name="file[]" multiple>
								</label>
						        <button type="submit">Upload</button>
						    </form>
						</span>
					</dd>
					<dd><span id="description" class="editableArea">Click to edit text</span></dd>
					<dd class="last"></dd>
				</dl>
		
			</div>

			<div id="menu" class="iOSScroll">
		
				<dl class="appDl">
					<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>
					<dd class="last"></dd>
				</dl>
		
			</div>

			<div id="promotion" class="iOSScroll">
		
				<dl class="appDl">
					<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>
					<dd class="last"></dd>
				</dl>

			</div>

			<div id="gallery" class="iOSScroll">
				<dl class="appDl">
					<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>
					<dd>
						<table>
							<tr>
								<td class="upload">
									<div id="fileUpload">
										<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
											<label>
									        	<input type="file" name="file[]" multiple>
											</label>
									        <button type="submit">Upload</button>
									    </form>

										<div class="progressBar"></div>										
									</div>
								</td>
								<td></td>
								<td></td>
							</tr>
						</table>
				
						<div>&nbsp;</div>
					</dd>
					<dd class="last"></dd>
				</dl>
			</div>

			<div id="location" class="iOSScroll">
		
				<dl class="appDl">
					<dt><a href=""><span class="sq"><span></span></span><span id="title" class="title"></span></a></dt>
					<dd>
						<dl class="contactDl">
							<dt>Address</dt>
							<dd id="address">Lorem ipsum dolor sit amet,<br />
							consectetur adipiscing elit.<br />
							Aliquam mattis facilisis rutrum.<br /></dd>
							<dt>Tel.</dt>
							<dd id="telephone" class="editableItem">0xx - xxx - xxxx</dd>
							<dt>Email</dt>
							<dd id="email" class="editableItem">katsuking@hotmail.com</dd>
						</dl>
					</dd>
					<dd style="height:205px">
						<input style="display:none" id="addresspicker_map" />
						<input style="display:none" id="locality" disabled=disabled>
						<input style="display:none" id="country" disabled=disabled>
						<input style="display:none" id="lat" value="" disabled=disabled>
						<input style="display:none" id="lng" value="" disabled=disabled>
					</dd>
					<dd class="last"></dd>
				</dl>
		
			</div>
	
			<ul id="tabs">
				<li id="aboutTab" class="selected"><div class="inner"><a href="#about"><span>About</span></a></div></li>
				<li id="menuTab"><div class="inner"><a href="#menu"><span>Menu</span></a></div></li>
				<li id="promotionTab"><div class="inner"><a href="#promotion"><span>Promotion</span></a></div></li>
				<li id="galleryTab"><div class="inner"><a href="#gallery"><span>Gallery</span></a></div></li>
				<li id="locationTab"><div class="inner"><a href="#location"><span>Location</span></a></div></li>
			</ul>

		</div>

		<ul id="customize-buttons">
			<li class="back"><a href="#first"><span>Back</span></a></li>
			<li class="tutorial"><a href=""><span>Tutorial</span></a></li>
			<li class="lang">
				<ul>
					<li><a href="" id="lang-en"></a></li>
					<li><a href="" id="lang-th"></a></li>
				</ul>				
			</li>
		</ul>

		<div id="create">
			<div id="app-name" class="editableItem">Untitled</div>
			<div id="theme-chooser">
				<h2>Choose Color Theme</h2>
				<dl>
					<dt>Color Theme <span class="blue_span">01</span></dt>
					<dd class="bar-color">Accent Color</dd>
					<dd class="text-color">Background Color</dd>
					<dd class="theme-no">Theme 1 of 20</dd>
					<dd class="backward-theme"><a href=""></a></dd>
					<dd class="forward-theme"><a href=""></a></dd>
				</dl>
			</div>

			<div id="splashscreen">
				<h2>Your App Splashscreen</h2>
				<div id="applicationSplashscreen">
					<div class="delete"><a href=""></a></div>
				    <form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
						<label>
				        	<input type="file" name="file[]" multiple>
						</label>
				        <button type="submit">Upload</button>
				    </form>

					<div class="progressBar"></div>
				</div>
				<p>Add Your Splashscreen<br />Picture format: 320px x 480px</p>
			</div>

			<div id="app-background">
				<h2>Your App Background</h2>
				<div id="applicationBackground">
					<div class="delete"><a href=""></a></div>

				    <form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
						<label>
				        	<input type="file" name="file[]" multiple>
						</label>
				        <button type="submit">Upload</button>
				    </form>

					<div class="progressBar"></div>
				</div>
				<p>Add Your Background<br />Picture format: 320px x 480px</p>
			</div>

			<div id="icon-theme">
				<h2>Choose icon menu theme</h2>
				
				<div class="top"></div>
				<dl id="theme-1">
					<dt></dt>
					<dd class="about">
						<a href=""><span>About</span></a>
						<input type="checkbox" />
					</dd>
					<dd class="menu">
						<a href=""><span>Menu</span></a>
						<input type="checkbox" />
					</dd>
					<dd class="promotion">
						<a href=""><span>Promotion</span></a>
						<input type="checkbox" />
					</dd>
					<dd class="gallery">
						<a href=""><span>Gallery</span></a>
						<input type="checkbox" />
					</dd>
					<dd class="location">
						<a href=""><span>Location</span></a>
						<input type="checkbox" />
					</dd>
					<dd class="accomodation">
						<a href=""><span>Accomodation</span></a>
						<input type="checkbox" />
					</dd>
					<dd style="float:none; clear: both; height: 0; margin: 0; padding: 0"></dd>
				</dl>
				<div class="bottom"></div>

			</div>
		</div>

		<a href="#" id="publish"><span>Submit Your App</span></a>
		<a class="next-step top" href="#about"><span>Next Step</span></a>
		<a class="next-step" href="#about"><span>Next Step</span></a>

		<div style="clear: both"></div>
	</div>
<?php

}
elseif (isset($_GET['register']) || (isset($_GET['profile']) && isset($_SESSION['uid'])))
{
	$fills = array("name" => "", "lastname" => "", "company" => "", 'address' => '', "phone" => "", "ext" => "", "mobile" => "", "email" => "");

	if (isset($_GET['profile']))
	{
		connect_db();	
	
		$sql = 'SELECT `name`, `lastname`, `address`, `company`, `phone`, `ext`, `mobile`, `email`' .
			   ' FROM users ' .
			   ' WHERE id = "' . $_SESSION['uid'] . '"';
		
		$req = mysql_query($sql) or die('Erreur SQL !<br>'.$sql.'<br>'.mysql_error()); 
		
		if (mysql_num_rows($req))
		{
			$fills = mysql_fetch_assoc($req);
		}
	}
?>

	<form id="register" class="niceform" action="ws.php?r=register" method="POST">
		<fieldset id="personal-infos">
			<legend>Personal <span class="blue_span">Information</span></legend>
			
			<label class="required">
				<span>Name</span>
				<input type="text" name="name" value="<?php echo $fills['name'] ?>" />
			</label>

			<label class="required">
				<span>Last Name</span>
				<input type="text" name="lastname" value="<?php echo $fills['lastname'] ?>" />
			</label>

			<label>
				<span>Company Name</span>
				<input type="text" name="company" value="<?php echo $fills['company'] ?>" />
			</label>

			<label class="textarea">
				<span>Address</span>
				<textarea name="address"><?php echo $fills['address'] ?></textarea>
			</label>

			<label id="form-phone">
				<span>Phone Number</span>
				<input type="text" name="phone" value="<?php echo $fills['phone'] ?>" />
			</label>

			<label id="form-ext">
				<span>Ext.</span>
				<input type="text" name="ext" value="<?php echo $fills['ext'] ?>" />
			</label>

			<label>
				<span>Mobile Phone</span>
				<input type="text" name="mobile" value="<?php echo $fills['mobile'] ?>" />
			</label>
		</fieldset>

		<fieldset id="login-infos">
			<legend>Login <span class="blue_span">Information</span></legend>

			<label class="required">
				<span>Email</span>
				<input type="text" name="email" value="<?php echo $fills['email'] ?>" />
			</label>

			<label class="required">
				<span>Password</span>
				<input type="password" name="password"/>
			</label>

			<label class="required">
				<span>Confirm Password</span>
				<input type="password" name="confirm" />
			</label>
			
			<textarea id="register-conditions">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pulvinar vestibulum mauris, dictum placerat mauris laoreet vitae. Ut dictum pellentesque velit ac faucibus. Aliquam bibendum sagittis ligula sed tempor. Proin placerat vehicula odio, non congue dolor egestas vestibulum. Donec blandit porttitor purus, nec aliquet nibh elementum at. Sed varius egestas turpis vitae ornare. Curabitur scelerisque suscipit leo, viverra faucibus neque adipiscing ornare. Nulla lacinia justo enim, nec aliquet dolor. Nunc vel ligula at dui interdum ultricies. In ac magna eget purus semper malesuada eu ultrices urna. Aliquam a nisi nisl, sed sollicitudin turpis. Morbi vitae luctus purus. Praesent nec facilisis justo. Sed neque ante, pulvinar eu accumsan fermentum, vulputate vel leo. Ut elementum, lacus vel sollicitudin blandit, dolor nunc consequat nulla, et faucibus sapien tortor in nulla. Pellentesque dignissim, ante sit amet semper pulvinar, leo purus mollis massa, in placerat metus neque non velit. Phasellus at sem nec justo mattis eleifend. Nam non est mauris, ut consequat leo.</textarea>
			
			<label id="register-checkbox" class="required">
				<input type="checkbox" name="conditions" />
				<span>Accept Conditions</span>
			</label>
		</fieldset>

		<div>
			<p>Please Note: Field marked with an <img src="images/required.png" /> are compulsory</p>
			<input type="hidden" name="register" value="1" />
			<input type="hidden" name="uid" value="<?php echo isset($_SESSION['uid']) ? $_SESSION['uid'] : '' ?>" />
			<input type="submit" value="Register" />
		</div>
	</form>

<?php
}
else
{
	
?>
	<div id="login">
		
		<form method="POST" class="niceform">
			<fieldset>
				<legend>Member <span class="blue_span">Login</span><div class="spinner"></div></legend>
				<label style="clear: both">
					<div style="float:left; width: 70px; padding-top: 5px">Email</div>
					<input type="text" id="username" name="username" />
				</label>
				<label style="clear: both; margin-bottom:20px">
					<div style="float:left; width: 70px; padding-top: 5px">Password</div>
					<input type="password" id="password" name="password" />
				</label>
				<input type="hidden" id="login-button" name="login" />
				<div style="clear:both;margin: 30px 10px 0 10px;padding-bottom:10px;position:relative">
					<input class="login" id="login-button" type="submit" value="Connect" />
				</div>
			</fieldset>
		</form>
		
		<div id="register">
			<h2>iBizApp Lorem Ipsum iPhone</h2>
		
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis elementum purus. Nam vitae elit non purus vulputate facilisis ac in sapien.</p>
		
			<a href="?register"></a>
		</div>
		
		<a href="" id="appstore"></a>
	</div>
	
	<div id="showcase"></div>

	<?php

	}
	
	?>
	
	<div id="footer">
		<p>Copyright 2011 <strong>Thaihosting Communication Co.,Ltd.</strong> All rights reserved. One-Stop Internet Service Solution.</p>
		
		<a href="http://hosting.co.th"></a>
	</div>
</div>

</div> <!-- scroll container -->
</body> 
</html>