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
function addLeftImg(){
	var ppw = window.open('left_input.html', '', 'width=1400,height=800');
}
function toHyperLink(){
	var text = prompt("要變成連結的字");
	var ele1 = '<!--====超連結--><a href="#info_block" id="godown"><b>';
	var ele2 = '</b></a><!--超連結END====-->';
	if(text){
		var txtArea = document.getElementById('txtArea');
		var cursor = txtArea.selectionStart;
		txtArea.value = (txtArea.value.substring(0, cursor) + ele1 + text + ele2 + txtArea.value.substring(cursor));
	}
}
function typing(){
	document.getElementById("txtArea").innerHTML = document.getElementById("txtArea").value;
}
function exportHTML(){
	var text = prompt("檔案名稱：")
	downloadInnerHtml(text);
}
function downloadInnerHtml(filename) {
	var HTMLcode = "<!DOCTYPE html><html><head><meta charset='UTF-8' /><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js' type='text/javascript'></script><script>$(function(){$('#btn').on('click', function(){$('.js-copy')[0].select();try{var successful = document.execCommand('copy');var msg = successful ? '程式碼已複製到剪貼簿' : 'Oops! 出錯了!';alert(msg);}catch(err){alert(err);}});});</script></head><body><textarea class='js-copy'>" + document.getElementById('txtArea').innerHTML + "</textarea><button id='btn'>複製程式碼</button></body></html>"
	
    var elHtml = HTMLcode;    
    var mimeType = 'text/html' || 'text/plain';
	var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}
function copyHTML(){
	$('.js-copy')[0].value = $('#txtArea')[0].value;
	$('.js-copy')[0].select();
	try{
		var successful = document.execCommand('copy');
		var msg = successful ? '成功：）' : '失敗:(';
		alert('複製' + msg)
	}
	catch(err){
		alert(err);
	}
}










