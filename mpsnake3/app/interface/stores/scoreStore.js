

var Dispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;
var PlayerState = Constants.PlayerState;

// Constants
var teams = ['lemons', 'ai', 'biebs', 'giants', 'illuminati', 'ops'];
var rules = [
	{name: 'Last team standing', value: 'last-team'},
	{name: 'Last snake standing', value: 'last-snake'},
	{name: 'First snake to 15 length', value: 'first-snake'}
];
var gameState = ['ready', 'started', 'ended'];
var countPlayers = 0;
var countReadyPlayers = 0;

// New
var game;
var playerState = PlayerState.PENDING;
// Player data object.
var localPlayer = {
	name: '',
	team: '',
	color: '',
	isAI: false,
	ready: false,
	score: null,
	rule: ''
};
var roundData = {};
var scoresByTeam = {};
var resultData = {};

var ScoreStore = assign({}, EventEmitter.prototype, {
	init: function() {
		// Get any information we can from local storage.
		//if (localStorage.getItem('name')) {
	//		localPlayer.name = localStorage.getItem('name');
	//	}
		this.emitChange()
	},


	login: function(data) {

		sessionStorage.setItem('user-details', JSON.stringify(data));

		localPlayer = _.merge(localPlayer, data);
		playerState = PlayerState.PLAYING;

		game = new MPSnake.Game();

		//TODO do we want to persist details?
	},
	spectate: function () {

		sessionStorage.clear();

		playerState = PlayerState.SPECTATING;
		game = new MPSnake.Game();
	},

	getScoresByTeam: function() {
		return scoresByTeam;
	},
	setScores: function(scoreData) {

		// Rebuild scores from scratch each time so we can removed players that have left.
		scoresByTeam = {};
		countPlayers = 0;
		countReadyPlayers = 0;

		// Sort score data into teams for display.
		_.each(scoreData, function(snake) {
			// Rename snake properties to a format that makes more sense for the interface.
			snake.active = !snake.isInactive;
			snake.score = snake.snakeLength;
			snake.ready = snake.isReady;

			if (!scoresByTeam[snake.team]) {
				scoresByTeam[snake.team] = {}
			}
			// Since we are clearing the array each time, if we match on snake name, there must be a
			// duplicate name, currently we cannot prevent this, so will rename the dupe.
			if (scoresByTeam[snake.team][snake.name]) {
				snake.name += ' duplicate';
				scoresByTeam[snake.team][snake.name] = snake;
			}
			scoresByTeam[snake.team][snake.name] = snake;

			// While iterating through the scores, we'll perform some calculations to save
			// going through the data additional times.
			countPlayers += 1;
			if (snake.ready) {
				countReadyPlayers += 1;
			}
		});

		//console.log('scores updated', scoresByTeam);

		// Also store details on local player so we don't need to pass references to the entire
		// score object around.
		if (playerState === PlayerState.PLAYING) {
			localPlayer.score = scoresByTeam[localPlayer.team][localPlayer.name].score;
			localPlayer.ready = scoresByTeam[localPlayer.team][localPlayer.name].isReady;
		}
	},

	endRound: function(data) {
		resultData = data;
	},

	getRoundData: function(){
		return roundData;
	},
	setRoundData: function(data) {
		roundData = data;
	},

	getTeams: function() {
		return teams;
	},
	getRules: function() {
		return rules;
	},

	getResultData() {
		return resultData;
	},

	getColors: function(teamName) {
		return colors[teamName];
	},
	setColor: function(color) {
		localPlayer.color = color;
	},


	getPlayer: function() {
		return localPlayer;
	},


	getPlayerState: function() {
		return playerState;
	},

	setReadyStatus: function (isReady) {
		localPlayer.ready = isReady;

		// Clear result message fresh for new game.
		resultData = {};
	},

	getCountPlayers () {
		return countPlayers;
	},
	getCountReadyPlayers () {
		return countReadyPlayers;
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

		case ActionTypes.UPDATE_SCORES:
			ScoreStore.setScores(action.scores);
			ScoreStore.emitChange();
			break;
		case ActionTypes.LOGIN:
			ScoreStore.login(action.data);
			ScoreStore.emitChange();
			break;
		case ActionTypes.SPECTATE:
			ScoreStore.spectate();
			ScoreStore.emitChange();
			break;
		case ActionTypes.SET_READY_STATUS:
			ScoreStore.setReadyStatus(action.isReady);
			ScoreStore.emitChange();
			break;
		case ActionTypes.UPDATE_ROUND_DATA:
			ScoreStore.setRoundData(action.roundData);
			ScoreStore.emitChange();
			break;
		case ActionTypes.END_ROUND:
			ScoreStore.endRound(action.message);
			ScoreStore.emitChange();
			break;
		// Reset game clears both score containers.
		default:
		// do nothing
	}

});

module.exports = ScoreStore;
