module Random {

	/// Returns integer between 0 and max.
	export function getInt(max:number):number {
		return Math.floor((Math.random() * max));
	}


	/// Returns float between min and max
	export function getBetween(min:number, max:number) {
		return Math.random() * (max - min) + min;
	}

	export function getString(length:number):string {
		var text = '';
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}

	export function guid():string {

		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
		return guid;
	}

}