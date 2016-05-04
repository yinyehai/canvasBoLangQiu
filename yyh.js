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

	/**形状类
	*@param 宽
	*@param 高
	*@param 半径
	*@param 颜色
	*/
	var BlRect = (function(){
		var BlRect = function(x, y, width,height,banjing,yanse)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.banjing = banjing;
			this.yanse = yanse;
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
			ctx.fillStyle = this.yanse;
			ctx.fill();

			ctx.restore();
		}
		return BlRect;
	})();


	/**圆形遮罩类
	*@param x坐标
	*@param y坐标
	*@param 半径
	*@param 边框颜色
	*/
	var ZhezhaoYuan = (function(){
		var ZhezhaoYuan = function(x, y, banjing, border)
		{
			this.x = x;
			this.y = y;
			this.banjing = banjing;
			this.border = border;
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
			if(this.border)
			{
				ctx.strokeStyle = this.border;
				ctx.stroke();
			}
		}
		return ZhezhaoYuan;
	})();

	/**文本对象
	*@paran
	*/
	var Shuzhi =  (function(){
		var Shuzhi = function(shuzhi,cur,x,y,yanse){
			this.shuzhi = shuzhi>1?shuzhi:shuzhi*100;
			this.cur = cur;
			this.x = x;
			this.y = y;
			this.font = '40px Arial';
			this.yanse = yanse;
			this.textAlign = "center";
			this.textBaseline = "middle";
		};
		Shuzhi.prototype.draw = function(ctx){
			var str = this.cur + '%';;
			ctx.save();
			ctx.font = this.font;
			ctx.fillStyle = this.yanse;
			ctx.translate(this.x, this.y);
			ctx.textAlign = this.textAlign;
			ctx.textBaseline = this.textBaseline;
			ctx.fillText(str, 0, 0);
			ctx.restore();
		};
		return Shuzhi;
	})();

	//动画队列
	var quee = [];
	//创建动画
	var aniamte = function(){
		requestAnimFrame(aniamte);
		for(var i=0; i<quee.length; i++)
		{
			quee[i]();
		}
	};
	aniamte.flage = true;
	//动画方法
	

	//波浪球方法
	var bolangqiu = function(opts){

		var opts = opts || bolangqiu.opts;
		var wrap = opts.wrap || bolangqiu.opts.wrap;
		var banjing = opts.banjing || bolangqiu.opts.banjing;
		var yanse = opts.yanse || bolangqiu.opts.yanse;
		var border = opts.border || bolangqiu.opts.border;
		var shuzhi = (typeof opts.shuzhi=='number')?opts.shuzhi:bolangqiu.opts.shuzhi;
		var quanjing = banjing * 2;
		
		
		//获取对象
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = banjing * 2;
		if(wrap){
			wrap.appendChild(canvas);
		}else{
			document.body.appendChild(canvas);
		}
		var ctx = canvas.getContext('2d');
		var blRect = new BlRect(0, quanjing, quanjing, quanjing, 20,'#24cb24');
		var zhezhao = new ZhezhaoYuan(0, 0, banjing, border);
		var shuzhi = new Shuzhi(shuzhi, 0, banjing, banjing, "red");
		var speedX = banjing / 38;
		
		quee.push(function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);

			if(blRect.x > 0-blRect.width)
			{
				blRect.x -= 3;
			}
			else
			{
				blRect.x = 0;
			}
			

			blRect.y =  quanjing - shuzhi.cur / 100 * quanjing;

			blRect.draw(ctx);
			
			zhezhao.draw(ctx);

			if(shuzhi.cur < shuzhi.shuzhi)
			{
				shuzhi.cur++;
			}
			else
			{
				shuzhi.cur = shuzhi.shuzhi;
			}
			shuzhi.draw(ctx);
		});
		if(aniamte.flage)
		{
			aniamte.flage = false;
			aniamte();
		}
	};
	
	//默认值
	bolangqiu.opts = {
		wrap:null,
		banjing:100,
		yanse:'#24cb24',
		border:'#ccc',
		shuzhi:50
	};

	global.YYH.bolangqiu = bolangqiu;
});