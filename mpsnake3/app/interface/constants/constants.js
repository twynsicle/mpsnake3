

var keyMirror = require('keymirror');

module.exports = {

	ActionTypes: keyMirror({
		AUTH_RESPONSE: null,
		UPDATE_SCORES: null,
		SET_TEAM: null,
		SET_COLOR: null,
		BOARD_STATE_RECEIVED: null,
		SET_GAME_OVER: null
	})

};
