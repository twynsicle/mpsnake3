

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
var gameRule;

// Old
var isAuthenticated = false;
var gameInProgress = false;
var scores = [];
var scoresByTeam = {};
var name = '';


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

	getScores: function() {
		return scores;
	},
	getScoresByTeam: function() {
		return scoresByTeam;
	},
	setScores: function(scoreData) {

		// Sort score data into teams for display.
		_.each(scoreData, function(snake) {
			// Rename snake properties to a format that makes more sense for the interface.
			snake.active = !snake.isInactive;
			snake.score = snake.snakeLength;
			snake.ready = snake.isReady;


			//TODO note - this won't removed any players/teams not in scoreData - add removed flag and style faded out.
			if (!scoresByTeam[snake.team]) {
				scoresByTeam[snake.team] = {}
			}
			if (!scoresByTeam[snake.team][snake.name]) {
				scoresByTeam[snake.team][snake.name] = {};
			}
			scoresByTeam[snake.team][snake.name] = snake;
		});

		// Also store score on local player so we don't need to pass references to the entire
		// score object around.
		if (playerState === PlayerState.PLAYING) {
			localPlayer.score = scoresByTeam[localPlayer.team][localPlayer.name].score;
		}
	},

	getGameRule: function(){
		return gameRule;
	},
	setGameRule: function(rule) {
		gameRule = rule;
		console.log('setting game rule');
	},

	getTeams: function() {
		return teams;
	},
	getRules: function() {
		return rules;
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
	getGameInProgress: function () {
		return gameInProgress;
	},

	setReadyStatus: function (isReady) {
		localPlayer.ready = isReady;
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
		case ActionTypes.SET_GAME_OVER:
				//TODO
			ScoreStore.setGameInProgress(false);
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
		case ActionTypes.SET_GAME_RULE:
			ScoreStore.setGameRule(action.rule);
			ScoreStore.emitChange();
			break;
		// Reset game clears both score containers.
		default:
		// do nothing
	}

});

module.exports = ScoreStore;
