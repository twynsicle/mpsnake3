

var keyMirror = require('keymirror');

module.exports = {

	ActionTypes: keyMirror({
		UPDATE_SCORES: null,
		LOGIN: null,
		SPECTATE: null,
		SET_READY_STATUS: null,
		UPDATE_ROUND_DATA: null,
		END_ROUND: null
	}),

	PlayerState: keyMirror({
		PENDING: null,
		PLAYING: null,
		SPECTATING: null
	})

};
