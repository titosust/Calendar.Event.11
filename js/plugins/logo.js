function Logo() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));



	var center = new Point(this.width / 2, this.height / 2);
	this.clear();
	var mlogo = new MLogo(this.width, this.height);
	mlogo.position(center.x, center.y);
	this.add(mlogo);
	//save screen?
	this.screenShoot = function(ctx, x, y, w, h) {
			var data = ctx.getImageData(x, y, w, h);
			var tc = document.createElement('canvas');
			tc.width = w;
			tc.height = h;

			var tcc = tc.getContext("2d");
			tcc.putImageData(data, 0, 0);

			window.open(tc.toDataURL("image/png"), '_blank');
		}
		// this.screenShoot(ctx, center.x - radius, center.y - radius, 2 * radius, 2 * radius);
}

function MLogo(w, h) {
	Drawable.call(this);
	this.w = w;
	this.h = h;
	this.radius = Math.min(this.w / 2.4, this.h / 2.4);
	this.draw = function(ctx) {
		ctx.save();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#000';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();

		var drawCircle = function(cn, radius, rotate) {
			var centers = [];
			if (arguments.length >= 2) {
				if (arguments[0] instanceof Array) {
					centers = arguments[0];
				} else if (arguments[0] instanceof Object) {
					var obj = arguments[0];
					if (obj.hasOwnProperty('x') && obj.hasOwnProperty('y')) {
						centers.push({
							'x': obj.x,
							'y': obj.y
						});
						centers.push({
							'x': obj.x,
							'y': obj.y
						});
					}
				} else {
					throw 'Invalid arguments for origin.';
				}
			} else {
				throw 'Invalid arguments supplied for draw both.';
			}

			ctx.save();
			rotate = rotate == undefined ? 0 : rotate;
			var pad = Number(rotate) * Math.PI / 180,
				centr = [pad + (1.5 * Math.PI), pad + Math.PI / 2, ],
				colors = ['#000', '#fff'];
			for (var i = 0, sz = colors.length; i < sz; i++) {
				ctx.beginPath();
				ctx.fillStyle = colors[i % 2];
				ctx.arc(centers[i].x, centers[i].y, radius, centr[i % 2], centr[((i % 2) + 1) % 2]);
				ctx.fill();

			}
		}
		var center = new Point(this.x, this.y);
		drawCircle(center, this.radius);
		var centerA = [new Point(center.x, center.y + this.radius / 2), new Point(center.x, center.y - this.radius / 2)];
		drawCircle(centerA, this.radius / 2, 180);
	}
}
MLogo.prototype = Object.create(Drawable.prototype);
MLogo.prototype.constructor = MLogo;