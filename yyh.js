(function(global,factory){
	if(global.YYH)return;
	global.YYH = {};
	factory(global);
})(window,function(global){
	//动画工具函数
	var requestAnimFrame = (function(){
		return  global.requestAnimationFrame       ||
			global.webkitRequestAnimationFrame ||
			global.mozRequestAnimationFrame    ||
			function( callback ){
				global.setTimeout(callback, 1000 / 60);
			};
	})();

	//获取元素位置
	function getRect(ele) {
		var rect = ele.getBoundingClientRect();
		var top = global.document.documentElement.clientTop;
		var left= global.document.documentElement.clientLeft;
		return{
			top: rect.top - top,
			bottom: rect.bottom - top,
			left: rect.left - left,
			right : rect.right - left
		}
	}

	/**形状类
	*@param x坐标
	*@param y坐标
	*@param 宽
	*@param 高
	*@param 颜色
	*/
	var BlRect = (function(){
		var BlRect = function(x, y, width, height, background)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.banjing = height * 0.05;
			this.background = background;
		};
		BlRect.prototype.draw = function(ctx)
		{
			ctx.save();

			ctx.translate(this.x,this.y);
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.bezierCurveTo(this.width / 2, 0+this.banjing, this.width / 2, 0-this.banjing, this.width, 0);
			ctx.bezierCurveTo(this.width + this.width / 2, 0+this.banjing, this.width + this.width / 2, 0-this.banjing, this.width * 2, 0);
			ctx.lineTo(this.width * 2, this.height);
			ctx.lineTo(0, this.height);
			ctx.closePath();
			ctx.fillStyle = this.background;
			ctx.fill();

			ctx.restore();
		}
		return BlRect;
	})();


	/**圆形遮罩类
	*@param x坐标
	*@param y坐标
	*@param 半径
	*@param 边框大小
	*@param 边框颜色
	*/
	var ZhezhaoYuan = (function(){
		var ZhezhaoYuan = function(x, y, banjing, borderSize, borderColor)
		{
			this.x = x;
			this.y = y;
			this.banjing = banjing;
			this.borderSize = borderSize;
			this.borderColor = borderColor;
		};
		ZhezhaoYuan.prototype.draw = function(ctx)
		{
			ctx.save();
			ctx.beginPath();
			ctx.translate(this.x, this.y);
			ctx.globalCompositeOperation = "destination-in";
			ctx.arc(this.banjing, this.banjing, this.banjing, 0, 2*Math.PI);
			ctx.fill();
			ctx.restore();
			if(this.borderSize && this.borderColor)
			{
				ctx.lineWidth = this.borderSize;
				ctx.strokeStyle = this.borderColor;
				ctx.stroke();
			}
		}
		return ZhezhaoYuan;
	})();

	/**数值类
	*@param 数值
	*@param 当前值
	*@param x坐标
	*@param y坐标
	*@param 字体大小
	*@param 字体
	*@param 字体颜色
	*/
	var Shuzhi =  (function(){
		var Shuzhi = function(shuzhi, cur, x, y, fontSize, fontFamily, fontColor){
			this.shuzhi = shuzhi>1?shuzhi:shuzhi*100;
			this.cur = cur;
			this.x = x;
			this.y = y;
			this.fontSize = fontSize;
			this.fontFamily = fontFamily;
			this.fontColor = fontColor;
			this.textAlign = "center";
			this.textBaseline = "middle";
		};
		Shuzhi.prototype.draw = function(ctx){
			var str = Math.floor(this.cur) + '%';;
			ctx.save();
			ctx.font = this.fontSize + ' ' + this.fontFamily;
			ctx.fillStyle = this.fontColor;
			ctx.translate(this.x, this.y);
			ctx.textAlign = this.textAlign;
			ctx.textBaseline = this.textBaseline;
			ctx.globalCompositeOperation = "xor";
			ctx.fillText(str, 0, 0);
			ctx.restore();
		};
		return Shuzhi;
	})();

	//动画容器
	var quee = [];
	//缓存容器
	var cacheQuee = [];
	//动画方法
	var aniamte = function(){
		requestAnimFrame(aniamte);
		for(var i=0; i<quee.length; i++)
		{
			quee[i].runner();
		}
	};
	aniamte.flage = true;

	//波浪球方法
	var bolangqiu = function(opts){

		//获取变量
		var opts = opts || bolangqiu.opts,
			wrap = opts.wrap || bolangqiu.opts.wrap,
			banjing = opts.banjing || bolangqiu.opts.banjing,
			background = opts.yanse || bolangqiu.opts.background,
			fontSize = opts.fontSize || bolangqiu.opts.fontSize,
			fontFamily = opts.fontFamily || bolangqiu.opts.fontFamily,
			fontColor = opts.fontColor || bolangqiu.opts.fontColor,
			borderSize = opts.borderSize || bolangqiu.opts.borderSize,
			borderColor = opts.borderColor || bolangqiu.opts.borderColor,
			shuzhi = (typeof opts.shuzhi=='number')?opts.shuzhi:bolangqiu.opts.shuzhi,
			quanjing = banjing * 2;
		
		var offset = (borderSize - 1);
		
		//获取对象
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = quanjing + offset * 2;
		if(wrap){
			wrap.appendChild(canvas);
		}else{
			document.body.appendChild(canvas);
		}
		var ctx = canvas.getContext('2d');
		var blRect = new BlRect(0 + offset, quanjing + offset, quanjing + offset, quanjing + offset, background);
		var zhezhao = new ZhezhaoYuan(0 + offset, 0 + offset, banjing, borderSize, borderColor);
		var shuzhi = new Shuzhi(shuzhi, 0, banjing + offset, banjing + offset, fontSize, fontFamily, fontColor);
		var targetHeight = blRect.height - blRect.height *  shuzhi.shuzhi / 100;
		var speedC = 0.5;
		var speedX = banjing / 30;
		var speedY = shuzhi.shuzhi==0?0:(blRect.y - targetHeight) / shuzhi.shuzhi * speedC;
		//var speedY = shuzhi.shuzhi==0?0:shuzhi.shuzhi/(blRect.y - targetHeight);
		
		canvas.runner = function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);

			blRect.x -= speedX;
			if(blRect.x < 0-blRect.width)
			{
				blRect.x = blRect.x + blRect.width;
			}

			if(blRect.y > targetHeight)
			{
				blRect.y-=speedY;
			}
			else
			{
				blRect.y = targetHeight;
			}

			blRect.draw(ctx);
			
			zhezhao.draw(ctx);

			if(shuzhi.cur < shuzhi.shuzhi)
			{
				shuzhi.cur += speedC;
			}
			else
			{
				shuzhi.cur = shuzhi.shuzhi;
			}
			shuzhi.draw(ctx);
		};

		//动画元素加入缓存
		cacheQuee.push(canvas);

		//促发滚动条事件
		winScroll();
		
		//开启动画
		if(aniamte.flage)
		{
			aniamte.flage = false;
			aniamte();
		}
	};

	//判断是否在可视窗口中
	var isInWin = function(ele){
		var rect = getRect(ele);
		if(rect.top+ele.height<0 || rect.top>global.document.documentElement.clientHeight)
		{
			return false;
		}
		if(rect.left+ele.width<0 || rect.left>global.document.documentElement.clientWidth)
		{
			return false;
		}
		return true;
	};

	//定义滚动事件
	var winScroll = function(){
		quee.length = 0;
		for(var i=0; i<cacheQuee.length; i++)
		{
			if(isInWin(cacheQuee[i]))
			{
				quee.push(cacheQuee[i]);
			}
		}
	};
	global.addEventListener('scroll',winScroll,false);
	
	//默认值
	bolangqiu.opts = {
		//容器元素
		wrap:null,
		//球半径
		banjing:100,
		//波浪颜色
		background:'#24cb24',
		//字体大小
		fontSize:'40px',
		//字体
		fontFamily:'Arial',
		//字体颜色
		fontColor:'#24cb24',
		//边框大小
		borderSize:'1',
		//边框颜色
		borderColor:'#ccc',
		//数值
		shuzhi:50
	};

	global.YYH.bolangqiu = bolangqiu;
});