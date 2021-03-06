"use strict";

Object.defineProperty(Object.prototype, 'extend', {
	value: function() {
		var target = this;
		for (var i = 0; i < arguments.length; i++)
			for (var key in arguments[i])
				if (arguments[i].hasOwnProperty(key))
					target[key] = arguments[i][key];
		return target;
	}
});

Object.defineProperty(Object.prototype, 'forEach', {
	value: function(callBack) {
		for (var name in this) {
			callBack(name, this[name]);
		}
	}
});

Object.defineProperty(Object.prototype, 'filter', {
	value: function(predicateFunction) {
		var results = {};
		this.forEach(function(name, val) {
			if (predicateFunction(name, val)) results[name] = val;
		});
		return results;
	}
});
Object.defineProperty(Array.prototype, 'chunk', {
	value: function(chunkSize, show) {
		var R = [];
		for (var i = 0; i < this.length; i += chunkSize) {
			R.push(this.slice(i, i + chunkSize));
		}
		return R;
	}
});
//http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
Object.defineProperty(Object.prototype, 'getName', {
	value: function() {
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((this).constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
	}
});

Object.defineProperty(Array.prototype, 'unique', {
	value: function() {
		var u = {},
			a = [];
		for (var i = 0, l = this.length; i < l; ++i) {
			if (u.hasOwnProperty(this[i])) {
				continue;
			}
			a.push(this[i]);
			u[this[i]] = 1;
		}
		return a;
	}
});

Object.defineProperty(Number.prototype, 'mapTo', {
	value: function(sm, sx, dm, dx) {
		return (this - sm) / (sx - sm) * (dx - dm) + dm;
	}
})

//http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
String.prototype.fistCapital = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

Object.defineProperty(Image.prototype, 'isOk', {
	value: function() {
		if (!this.complete) {
			return false;
		}
		if (typeof this.naturalWidth !== "undefined" && this.naturalWidth === 0) {
			return false;
		}
		return true;
	}
});

window.loadScript = function(u, c) {
	if (typeof u !== "string") throw "Invalid js[" + Object.prototype.toString.call(u) + "] name to load.";

	if (!u.endsWith('.js')) {
		u = u + '.js';
	}

	var newJs = u.startsWith('http') ? u : 'js/' + u;
	var scripts = document.getElementsByTagName('script');
	for (var i = 0, ln = scripts.length; i < ln; i++) {
		if (scripts[i].src.endsWith(newJs)) {
			return c.call(null);
		}
	}
	var d = document,
		j = d.createElement('script');
	j.src = newJs;

	if (c && typeof c === 'function') {
		j.addEventListener('load', function cb(e) {
			e.currentTarget.removeEventListener(e.type, cb);
			return c.call(null);
		}, false);
	}
	d.body.appendChild(j);
}