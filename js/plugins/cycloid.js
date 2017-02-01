function Cycloid() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);

	this.addView();
	/* TODO: make rows and cols configurable */
	var inpRadious = this.addModel('Cycloid Radius', {
		'type': 'number',
		'value': 43,
		'input.group': 'input-group',
		'input.class': 'form-control'
	});

	this.view = function() {
		this.clear();

		var data = this.data;
		if (!this.data) return false;

		var centerX = this.width / 2,
			centerY = this.height / 2,
			radius = parseInt(inpRadious.value);

		for (var i in data) {
			var date = new Date(data[i].start.dateTime),
				hour = date.getHours(),
				hour = hour.mapTo(0, 23, 0, 4);

			var circle = new PeripheralCircle(centerX, centerY, radius, hour);
			this.add(circle);
			radius += hour;

		}
		this.draw();
	}
	var self = this,
		_view = this.view,
		_rInterval = false;

	inpRadious.addEventListener("mousedown", function() {
		_rInterval = setInterval(function() {
			_view.call(self);
		}, 1000 / 30);
	});
	inpRadious.addEventListener("mouseup", function() {
		clearInterval(_rInterval);
	});

	if (this._isView()) this.view();
}
Cycloid.prototype = Object.create(Plugin.prototype);
Cycloid.prototype.constructor = Cycloid;

function PeripheralCircle(x, y, r) {
	Drawable.call(this);
	this.x = x;
	this.y = y;
	this.r = r;

	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.strokeStyle = '#444';
		ctx.stroke();
		ctx.restore();
	}
}

PeripheralCircle.prototype = Object.create(Drawable.prototype);
PeripheralCircle.prototype.constructor = PeripheralCircle;