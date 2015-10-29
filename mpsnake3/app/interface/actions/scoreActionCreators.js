
var Dispatcher = require('../dispatcher/dispatcher');

var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

// Expose the action creator to the window allowing our game component to call
// actions.
module.exports = window.scoreActionCreator = {

	login: function(data) {
		Dispatcher.dispatch({
			type: ActionTypes.LOGIN,
			data: data
		})
	},

	spectate: function(data) {
		Dispatcher.dispatch({
			type: ActionTypes.SPECTATE
		})
	},

	setReadyStatus: function(isReady) {
		Dispatcher.dispatch({
			type: ActionTypes.SET_READY_STATUS,
			isReady: isReady
		})
	},

	updateScores: function(scores) {
		Dispatcher.dispatch({
			type: ActionTypes.UPDATE_SCORES,
			scores: scores
		});
	},

	updateRoundData: function (roundData) {
		Dispatcher.dispatch({
			type: ActionTypes.UPDATE_ROUND_DATA,
			roundData: roundData
		});
	},

	endRound: function (message) {
		Dispatcher.dispatch({
			type: ActionTypes.END_ROUND,
			message: message
		});
	}



};
