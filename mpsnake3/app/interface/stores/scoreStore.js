

var Dispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

var colors = {
	lemons: ['#FFEA00', '#FFD600', '#FFC400', '#FFAB00'],
	ai: ['#FF9E80', '#FF6E40', '#FF3D00', '#DD2C00'],
	biebs: ['#4FC3F7', '#03A9F4', '#0288D1', '#01579B'],
	giants: ['#66BB6A', '#43A047', '#2E7D32', '#1B5E20'],
	illuminati: ['#B388FF', '#7C4DFF', '#651FFF', '#6200EA'],
	ops: ['#4DB6AC', '#009688', '#00796B', '#004D40']
};

var isAuthenticated = false;
var gameInProgress = false;
var scores = [];
var scoresByTeam = [];
var name = '';
var localPlayer = {
	ready: false,
	team: '',
	color: ''
};

var ScoreStore = assign({}, EventEmitter.prototype, {
	init: function() {
		// Get any information we can from local storage.
		//if (localStorage.getItem('name')) {
	//		localPlayer.name = localStorage.getItem('name');
	//	}
		this.emitChange()
	},

	getPlayer: function() {
		return localPlayer;
	},
	getPlayerName: function() {
		return name;
	},

	getScores: function() {
		return scores;
	},
	getScoresByTeam: function() {
		return scoresByTeam;
	},
	setScores: function(scoreData) {
		scores = scoreData;

		for (var name in scoreData) {
			if (!scoreData.hasOwnProperty(name)) {
				continue;
			}
			//TODO note - this won't removed any players/teams not in scoreData.
			var p = scoreData[name];
			if (!scoresByTeam[p.team]) {
				scoresByTeam[p.team] = {}
			}
			if (!scoresByTeam[p.team][name]) {
				scoresByTeam[p.team][name] = {};
			}
			scoresByTeam[p.team][name] = p;

		}
	},

	isAuthenticated: function() {
		return isAuthenticated;
	},
	setAuthentication: function (response) {
		if (response.auth) {
			name = response.name;
			localStorage.setItem('name', response.name);
		}
		//TODO pull player data straight from server.
		isAuthenticated = response.auth;
	},

	gameInProgress: function () {
		return gameInProgress;
	},
	setGameInProgress: function(state) {
		if (state && !gameInProgress) {
			gameInProgress = true;
		} else if (!state && gameInProgress) {
			gameInProgress = false;
		}
	},

	getTeams: function() {
		return ['lemons', 'ai', 'biebs', 'giants', 'illuminati', 'ops'];
	},
	setTeam: function(teamName) {
		localPlayer.team = teamName;
	},

	getColors: function(teamName) {
		return colors[teamName];
	},
	setColor: function(color) {
		localPlayer.color = color;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});


ScoreStore.dispatchToken = Dispatcher.register(function(action) {

	switch(action.type) {

		case ActionTypes.AUTH_RESPONSE:
			//console.log('store received auth action');
			ScoreStore.setAuthentication(action.response);
			ScoreStore.init();
			ScoreStore.emitChange();
			break;
		case ActionTypes.UPDATE_SCORES:
			// Update stored local player info with info from server.
			if (isAuthenticated && name) {
				localPlayer = action.scores[name];
			}

			// Update scores
			console.log('scores updated', action.scores);
			ScoreStore.setScores(action.scores);
			ScoreStore.emitChange();
			break;
		case ActionTypes.SET_TEAM:
			ScoreStore.setTeam(action.teamName);
			ScoreStore.emitChange();
			break;
		case ActionTypes.SET_COLOR:
			ScoreStore.setColor(action.color);
			ScoreStore.emitChange();
			break;
		case ActionTypes.BOARD_STATE_RECEIVED:
			ScoreStore.setGameInProgress(true);
			ScoreStore.emitChange();
			break;
		case ActionTypes.SET_GAME_OVER:
			ScoreStore.setGameInProgress(false);
			ScoreStore.emitChange();
		// Reset game clears both score containers.
		default:
		// do nothing
	}

});

module.exports = ScoreStore;
