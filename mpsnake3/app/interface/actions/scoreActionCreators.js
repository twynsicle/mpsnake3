
var Dispatcher = require('../dispatcher/dispatcher');

var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {

	updateScores: function(scores) {
		Dispatcher.dispatch({
			type: ActionTypes.UPDATE_SCORES,
			scores: scores
		});
	},

	setTeam: function(teamName) {
		Dispatcher.dispatch({
			type: ActionTypes.SET_TEAM,
			teamName: teamName
		});
	},

	setColor: function(color) {
		Dispatcher.dispatch({
			type: ActionTypes.SET_COLOR,
			color: color
		});
	},

	receiveBoardState: function(boardState) {
		Dispatcher.dispatch({
			type: ActionTypes.BOARD_STATE_RECEIVED,
			state: boardState
		});
	},

	setGameOver: function () {
		Dispatcher.dispatch({
			type: ActionTypes.SET_GAME_OVER
		});
	}



};
