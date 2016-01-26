var API_key = 'AIzaSyBzMomwt4w-woNKe0UlPJgZ14k1OEeEYO8';

$(function(){	
	$('.newpost').click(function(){
		valid('newPost')
	});
	$('.savepost').click(function(){
		var cb = confirm("確定儲存? 這將會覆蓋掉原始文章!");
		if (cb == true)
			valid('savePost');
	});
	updatePostsMenu();
	
	$('#post_titles').on('change', function(){
		var postId = $('#post_titles').find(":selected").data('value').id;;
		$.get('https://www.googleapis.com/blogger/v3/blogs/5768039957092517741/posts/' + postId + '?key=' + API_key, function(data){
			$('#postTitle')[0].innerHTML = data.title;
			$('#post_id')[0].innerHTML = postId;
			$('#showArea')[0].innerHTML = data.content;
			$('#txtArea')[0].innerHTML =  $('#showArea')[0].innerHTML.replace(/<br.*?>/g, '\n');
		});
	});
});

function valid(operate){
	var access_token = $('.access_token')[0].value;
	var post_id = $('.post_id')[0].value;
		if (access_token == "")
		{
			var wo = window.open('auth.html', '', 'width=800,height=600');
			var timer = setInterval(function(){
				if(wo.closed){
					access_token = $('.access_token')[0].value;
					clearInterval(timer);
					if(operate == 'newPost')
						addPost(access_token);
					else if (operate == 'savePost')
						savePost(access_token, post_id);
				}
			});
		}
		else
		{
			$.ajax({		
					url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token, 
					type: 'GET',
					success: function(){
						if(operate == 'newPost')
							addPost(access_token);
						else if (operate == 'savePost')
							savePost(access_token, post_id);
					},
					error: function (){ //expire
						var wo = window.open('auth.html', '', 'width=800,height=600');
						var timer = setInterval(function(){
							if(wo.closed){
								access_token = $('.access_token')[0].value;
								clearInterval(timer);
								if(operate == 'newPost')
									addPost(access_token);
								else if (operate == 'savePost')
									savePost(access_token, post_id);
							}
						});
					}
				});
		}
}

function savePost(access_token, post_id){
	var selfLink = $('#post_titles').find(":selected").data('value').selfLink;
	var data = {
		'kind': 'blogger#post',
		'id': post_id,
		'blog': {
			'id': "5768039957092517741"
		},
		'url': $('#post_titles').find(":selected").data('value').url,
		'selfLink': selfLink,
		"title": $('#postTitle')[0].value,
		"content": $('#txtArea')[0].value		
	}
	$.ajax({
		url: selfLink,
		method: 'PUT',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		success: function(){
			alert('儲存成功!');
		}
	});
}

function addPost(token){
	var data = {
			"kind": "blogger#post",
			"blog": {
				"id": "5768039957092517741"
			},
			"title": $('#postTitle')[0].value,
			"content": $('#txtArea')[0].value
		};
	$.ajax({
		url: 'https://www.googleapis.com/blogger/v3/blogs/5768039957092517741/posts',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		success: function(){
			updatePostsMenu();
			alert('發文成功!');
		}
	});
}


function updatePostsMenu(){
	$('#post_titles')[0].innerHTML = '<option disabled selected>--請選擇文章--</option>';
	$.ajax({
		url: 'https://www.googleapis.com/blogger/v3/blogs/5768039957092517741/posts',
		data: {
			key: API_key
		},
		success: function(data){
			for(i=0; i<data.items.length; i++){
			$('#post_titles').append($('<option></option>').attr('data-value', JSON.stringify(data.items[i])).text(data.items[i].title));
		}
		}
	});
}

function changeView(){
	$('#txtArea').toggle(  );
	$('#showArea').toggle(  );
	
	
	if($('.btn_changeView')[0].innerHTML == '預覽'){
		$('.btn_changeView')[0].innerHTML = '編輯';
		var text = document.getElementById('txtArea').value.replace(/(?:\r\n|\r|\n)/g, '<br />');
		document.getElementById('showArea').innerHTML = text;
	}
	else{
		$('.btn_changeView')[0].innerHTML = '預覽';
		var text = document.getElementById('showArea').innerHTML.replace(/<br.*?>/g, '\n');
		document.getElementById('txtArea').innerHTML = text;
	}
}
function addThumbNail(){
	window.open('thumbnail_input.html', '', 'width=1400,height=800');
}
function addGoDown(){
	var text = prompt("要變成連結的字");
	var ele1 = '<!--====超連結--><a href="#info_block" id="godown"><b>';
	var ele2 = '</b></a><!--超連結END====-->';
	if(text){
		var txtArea = document.getElementById('txtArea');
		var cursor = txtArea.selectionStart;
		txtArea.value = (txtArea.value.substring(0, cursor) + ele1 + text + ele2 + txtArea.value.substring(cursor));
	}
}
function addCentralImg(){
	window.open('central_input.html', '', 'width=1400,height=800');
}
function addRowImg(){
	window.open('row_input.html', '', 'width=1400,height=800');
}
function addRightImg(){
	window.open('right_input.html', '', 'width=1400,height=800');
}
function addLeftImg(){
	window.open('left_input.html', '', 'width=1400,height=800');
}
function addInfo(){
	window.open('info_input.html', '', 'width=1400,height=800')
}
function addKnowledge(){
	window.open('knowledge_input.html', '', 'width=1400,height=800')
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










