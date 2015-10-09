

var keyMirror = require('keymirror');

module.exports = {

	ActionTypes: keyMirror({
		UPDATE_SCORES: null,
		SET_GAME_OVER: null,
		LOGIN: null,
		SPECTATE: null,
		SET_READY_STATUS: null,
		SET_GAME_RULE: null
	}),

	PlayerState: keyMirror({
		PENDING: null,
		PLAYING: null,
		SPECTATING: null
	})

};
