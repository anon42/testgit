
function setup_location_editables()
{
	$("#telephone").editable('ws.php?r=telephone',
	{
		select: true
	});

	$("#email").editable('ws.php?r=email',
	{
		select: true
	});

	$("#address").editable('ws.php?r=address',
	{
		cssclass: 'editableAddress',
		select: true
	});		
}