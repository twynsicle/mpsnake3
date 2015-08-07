

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
	}

};

module.exports = Random;