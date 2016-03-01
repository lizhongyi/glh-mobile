
$('a.item')
	.on('click', function() {
		$(this)
			.addClass('active')
			.siblings()
			.removeClass('active')
		;
	})
;
//过滤时间的函数
function getTime(timestamp)
{
	var ts = arguments[0] || 0;
	var t,y,m,d,h,i,s;
	t = ts ? new Date(ts*1000) : new Date();
	y = t.getFullYear();
	m = t.getMonth()+1;
	d = t.getDate();
	h = t.getHours();
	i = t.getMinutes();
	s = t.getSeconds();
	// 可根据需要在这里定义时间格式
	return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d);
}

/*前段加上股票和用户的链接*/
function addLink(text) {
		if (text == null) {
			return text;
		}
		//var uReg=/@[^\s]+\s?/;
		//匹配开头已@结尾是空格或者冒号 远端原则
		//var uReg = /@\S+?\s|@\S+?\s|@\S+?:/
		var uReg = /@([^(|:| |<|@|&|!)]*)(|:| |<|@|&)/g;
		//var uReg = /@(.*?)(@| |:|<)/g
		var uRegLen = 0;

		var regText = text;
		do {
			var uArr = uReg.exec(regText);
			uRegLen = uArr == null ? 0 : uArr.length;
			if (uArr != null && uArr.length > 0) {
				for (var i = 0; i < uArr.length; i++) {
					if (uArr[i].indexOf("@") >= 0 && uArr[i].length > 1) {
						var nick = uArr[i].substring(1, uArr[i].length);
						var uHtml = '<a class="user-popover" href="javascript:userPopover.openUser();" user-Nick="' + nick + '">' + uArr[i] + '</a>';
						text = text.replace(new RegExp(uArr[i], 'gm'), uHtml);
					}
				}
			}
		} while (uRegLen > 0)


		//匹配以$开头,$+空格结尾的字符
		var sReg = /\$(.*?)\((.*?)\)\$/g;
		var sRegLen = 0;
		var regSText = text;
		do {
			var sArr = sReg.exec(regSText);
			sRegLen = sArr == null ? 0 : sArr.length;
			if (sArr != null && sArr.length >= 3) {
				if (sArr[0].indexOf("$") >= 0 && sArr[0].indexOf("(") >= 0 && sArr[0].indexOf(")") >= 0 && sArr[0].length > 3 && sArr[1].length > 0 && sArr[2].length > 0) {
					//提取股票代码
					sArrNew = sArr[2].replace(')', '\\)').replace('(', '\\(');
					dReg = /[a-zA-Z.0-9]+|[0-9]+/;
					stockCode = dReg.exec(sArrNew);
					var replaceTarget = '\\$' + sArr[1] + '\\(' + sArrNew + '\\)\\$';
					var sHtml = '<a href="/glhm/stock.html#' + stockCode + '" target="flag">' + sArr[0] + '</a>';
					//var replaceTarget = sArr[2].replace("(", "/(").replace(")", "/)");
					text = text.replace(new RegExp(replaceTarget, 'gm'), sHtml);
				}
			}
		} while (sRegLen > 0)
		return text;
		//return text;
	}

//向上还是向下滚动

function scroll( fn ) {
	var beforeScrollTop = document.body.scrollTop,
			fn = fn || function() {};
	window.addEventListener("scroll", function() {
			var afterScrollTop = document.body.scrollTop,
					delta = afterScrollTop - beforeScrollTop;
			if( delta === 0 ) return false;
			fn( delta > 0 ? "down" : "up" );
			beforeScrollTop = afterScrollTop;
	}, false);
}

//跳到下载app页面

function goDownApp(){
	window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gelonghui.glhapp';
}

//格式化时间

 function formatTime(publishTime) {
	var date = new Date();
	var tmpTime = publishTime * 1000;
	var time = Math.floor(date.getTime() / 1000);
	var publishTime = time - publishTime;
	if (publishTime < 60) {
		return "刚刚";
	} else if (60 <= publishTime && publishTime < 60 * 60) {
		return Math.floor(publishTime / 60) + "分钟前";
	} else if (publishTime >= 60 * 60 && publishTime < 24 * 60 * 60) {
		return Math.floor(publishTime / 3600) + "小时前";
	} else if (publishTime >= 24 * 60 * 60 && publishTime < 10 * 24 * 60 * 60) {
		return Math.floor(publishTime / 86400) + "天前";
	} else {
		var resultDate = new Date(tmpTime);
		var year = resultDate.getFullYear();
		var month = resultDate.getMonth();
		month += 1;
		var day = resultDate.getDate();
		return year + "年" + month + "月" + day + "日";
	}
}
