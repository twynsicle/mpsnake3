

Random = {
	generateString: function (length) {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < length; i++ ) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
	generateHex() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},
	getInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getBetween (min, max) {
		return Math.random() * (max - min) + min;
	},
	guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
};

module.exports = Random;