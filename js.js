function changeView(){
	$('#txtArea').toggle(  );
	$('#showArea').toggle(  );
	
	var text = document.getElementById('txtArea').value.replace(/(?:\r\n|\r|\n)/g, '<br />');
	document.getElementById('showArea').innerHTML = text;	
}
function addCentralImg(){
	var ppw = window.open('central_input.html', '', 'width=1400,height=800');
}
function addRowImg(){
	var ppw = window.open('row_input.html', '', 'width=1400,height=800');
}
function addRightImg(){
	var ppw = window.open('right_input.html', '', 'width=1400,height=800');
}

function toHyperLink(){
	
}