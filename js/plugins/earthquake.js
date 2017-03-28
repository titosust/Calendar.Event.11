function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = this.height / 2 - 100;
	var dataImage = false;
	var yRotate = 0;
	var xRotate = 0;

	this.view = function(param) {
		this.clear();
		var width = this.width;
		var height = this.height;
		var earth = new Sphere3D(Math.abs(distance));
		this.add(earth);
		this.draw();
	}

	this.addView();
	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			yRotate += dy / 10;
			xRotate += dx / 10;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			distance += zoom * 10;
			this.view();
		}
	}
}


function Point3D(x, y, z) {
	this.x = isNaN(x) ? 0 : x;
	this.y = isNaN(y) ? 0 : y;
	this.z = isNaN(z) ? 0 : z;
	console.log(this)
}

function Sphere3D(radius) {
	Drawable.call(this);

	this.vertices = new Array();
	this.radius = (typeof(radius) == "undefined" || typeof(radius) != "number") ? 20.0 : radius;
	this.rings = 16;
	this.slices = 32;
	this.numberOfVertices = 0;

	var M_PI_2 = Math.PI / 2;
	var dTheta = (Math.PI * 2) / this.slices;
	var dPhi = Math.PI / this.rings;
	var width = radius * 2;
	var height = radius * 2;
	var rotation = new Point3D();
	var lastX = -1;
	var lastY = -1;
	// Iterate over latitudes (rings)
	for (var lat = 0; lat < this.rings + 1; ++lat) {
		var phi = M_PI_2 - lat * dPhi;
		var cosPhi = Math.cos(phi);
		var sinPhi = Math.sin(phi);

		// Iterate over longitudes (slices)
		for (var lon = 0; lon < this.slices + 1; ++lon) {
			var theta = lon * dTheta;
			var cosTheta = Math.cos(theta);
			var sinTheta = Math.sin(theta);
			this.vertices[this.numberOfVertices] = new Point3D(this.radius * cosTheta * cosPhi,
				this.radius * sinPhi,
				this.radius * sinTheta * cosPhi);

			this.numberOfVertices++;
		}
	}
	this.rotation = function(dx, dy) {
		rotation.x += dx;
		rotation.y += dy;
	}
	this.draw = function(ctx) {
		// draw each vertex to get the first sphere skeleton
		for (i = 0; i < this.numberOfVertices; i++) {
			this.strokeSegment(i, ctx, width, height);
		}

		// now walk through rings to draw the slices
		for (i = 0; i < this.slices + 1; i++) {
			for (var j = 0; j < this.rings + 1; j++) {
				this.strokeSegment(this.vertices, i + (j * (this.slices + 1)), ctx, width, height);
			}
		}
	}

	this.strokeSegment = function(index, ctx, width, height) {
		var x, y;
		var p = this.vertices[index];

		rotateX(p, this.rotation.x);
		rotateY(p, this.rotation.y);
		rotateZ(p, this.rotation.z);

		x = projection(p.x, p.z, width / 2.0, 100.0, this.radius);
		y = projection(p.y, p.z, height / 2.0, 100.0, this.radius);

		if (lastX == -1 && lastY == -1) {
			lastX = x;
			lastY = y;
			return;
		}

		if (x >= 0 && x < width && y >= 0 && y < height) {
			if (p.z < 0) {
				ctx.strokeStyle = "gray";
			} else {
				ctx.strokeStyle = "black";
			}
			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
			lastX = x;
			lastY = y;
		}
	}
}
Sphere3D.prototype = Object.create(Drawable.prototype);
Sphere3D.prototype.constructor = Sphere3D;

function rotateX(point, radians) {

	var y = point.y;
	point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
	point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));


}

function rotateY(point, radians) {

	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
	point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));


}

function rotateZ(point, radians) {

	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
	point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));


}

function projection(xy, z, xyOffset, zOffset, distance) {
	return ((distance * xy) / (z - zOffset)) + xyOffset;
}