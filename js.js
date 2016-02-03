var API_key = 'AIzaSyBzMomwt4w-woNKe0UlPJgZ14k1OEeEYO8';

$(function(){	
	$('.newpost').click(function(){
		else if($('.postLabel')[0].innerHTML == "")
			alert('請填寫標籤(e.g. 日本-東京)');
		else if($('.searchExp')[0].innerHTML == "")
			alert('請填寫搜尋說明');
		else
			valid('newPost');
	});
	$('.savepost').click(function(){
		var cb = confirm("確定儲存? 這將會覆蓋掉原始文章!");
		if (cb == true)
		{	
			if($('#post_id')[0].innerHTML == "")
				alert('請選擇文章!');
			else if($('.postLabel')[0].innerHTML == "")
				alert('請填寫標籤(e.g. 日本-東京)');
			else if($('.searchExp')[0].innerHTML == "")
				alert('請填寫搜尋說明');
			else
				valid('savePost');
		}
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
	$.loading();
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
			$.loading('hide');
			window.location='http://leonshih.github.io/626-Editor/';
		}
	});
}

function addPost(token){
	var postUrl = prompt("永久連結：<br/>http://no626.blogspot.com/...");
	if(postUrl!=null)
	{
		var data = {
			"kind": "blogger#post",
			"blog": {
				"id": "5768039957092517741"
			},
			"title": $('#postTitle')[0].value,
			"content": $('#txtArea')[0].value,
			"url": [postUrl]
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
				alert('發文成功! 請進入Blogger後台編輯﹝搜尋說明﹞');
				$.loading('hide');
				window.location='http://leonshih.github.io/626-Editor/';
			}
		});	
	}
	else
	{
		alert('發文失敗 (請輸入標籤與網址名稱)');
		$.loading('hide');
	}
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
function addReadMore(){
	var txtArea = document.getElementById('txtArea');
	var cursor = txtArea.selectionStart;
	txtArea.value = (txtArea.value.substring(0, cursor) + '<!--more-->' + txtArea.value.substring(cursor));
	
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


	//#region 顯示或隱藏 Loading 畫面, command: 'hide' --> 隱藏, command: 整數 --> 延遲 n 毫秒後才顯示
	(function () {
		var tmDelayLoading = null;
		$.loading = function (command) {
			if (tmDelayLoading) {
				clearTimeout(tmDelayLoading);
				tmDelayLoading = null;
			}

			if (command == 'hide') {
				$('#ibLoading').remove();
			} else {
				if ($('#ibLoading').length) return;

				function add() {
					if ($('#ibLoading').length) return;

					$('<div id="ibLoading"><div/><img/></div>')
					.css({
						display: 'block'
						, position: 'fixed'
						, top: 0, left: 0, width: '100%', height: '100%'
						, 'z-index': $.loading.settings.zIndex
					})
					.find('div').css({
						position: 'absolute'
						, 'background-color': $.loading.settings.overlayBgColor
						, opacity: $.loading.settings.overlayOpacity
						, top: 0, left: 0, width: '100%', height: '100%'
					}).end()
					.find('img').attr('src', $.loading.settings.imageURL).css({
						position: 'absolute'
						, top: '50%', left: '50%'
						, 'margin-top': '-' + ($.loading.settings.imageHeight / 2) + 'px', 'margin-left': '-' + ($.loading.settings.imageWidth / 2) + 'px'
						, width : $.loading.settings.imageWidth
						, height : $.loading.settings.imageHeight
					}).end()
					.appendTo('body')
					;
				}

				if ($.isNumeric(command))
					tmDelayLoading = setTimeout(add, command);
				else
					add();
			}
		};

		$.loading.settings = {
			overlayBgColor: '#000'  // 遮罩顏色
			, overlayOpacity: 0.7   // 遮罩透明度
			, zIndex: 99999999	  // z-index
			, imageURL: '//www.facebook.com/images/loaders/indicator_blue_large.gif'	// 圖檔位址
			, imageWidth: 32		// 圖檔寬
			, imageHeight: 32	   // 圖檔高
		};
	})();
	//#endregion









