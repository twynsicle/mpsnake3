var React = require('react');
var classNames = require('classnames');

var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');

function getStateFromStores() {
	return {
		scores: ScoreStore.getScoresByTeam(),
		localPlayer: ScoreStore.getPlayer(),
		roundData: ScoreStore.getRoundData(),
		countPlayers: ScoreStore.getCountPlayers(),
		countReadyPlayers: ScoreStore.getCountReadyPlayers()
	};
}

var ScorePanel = React.createClass({
	getDefaultProps: function() {
		return {
			rules: ScoreStore.getRules()
		}
	},

	getInitialState: function() {return getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(getStateFromStores());},

	render: function () {

		if (!Object.keys(this.state.scores).length) return null;

		var that = this;
		var teamList = Object.keys(this.state.scores).map(function(teamName, index) {

			return (
				<Team teamName={teamName} localPlayerName={that.state.localPlayer.name}
					  teamData={that.state.scores[teamName]} key={index} />
			)
		});

		var readyMessage;
		if (this.state.countPlayers !== this.state.countReadyPlayers) {
			readyMessage = <p className="message">waiting for all players to ready.</p>
		}

		var gameRule;
		if (this.state.roundData.gameRule >= 0) {
			gameRule = <div className="game-rule">Current Rule: {this.props.rules[this.state.roundData.gameRule].name}</div>
		}

		return (
			<section id="scores" className="panel">
				<div className="score-container">
					{gameRule}
					<ul>
						{teamList}
					</ul>
					{readyMessage}
				</div>
			</section>
		);
	}
});

var Team = React.createClass({

	render: function() {
		var that = this;
		var teamTotal = 0;
		var playerList = Object.keys(this.props.teamData).map(function(name, index) {
			var player = that.props.teamData[name];
			var isLocalPlayer = !!(that.props.localPlayerName && that.props.localPlayerName === name);

			// Shouldn't be counting this here, but saves an additional iteration.
			teamTotal += player.score;

			return (
				<Player name={name} playerData={player} key={index} isLocal={isLocalPlayer} isReady={player.ready} />
			)
		});

		var teamClass = 'team ' + this.props.teamName;
		return (
			<li key={this.props.key} className={teamClass}>
				<h4>{this.props.teamName}</h4>
				<ul>
					{playerList}
					<li className="total-score"><span>{teamTotal}</span></li>
				</ul>
			</li>
		);
	}
});

var Player = React.createClass({
	render: function () {
		var playerClass = 'player' + (this.props.isLocal ? ' local' : '') + (!this.props.playerData.active ? ' inactive' : ''),
			readyState = this.props.isReady ? 'ready status' : 'unready status',
			styles = {color: this.props.playerData.color};

		return (
			<li className={playerClass} key={this.props.key} style={styles}>
				<span className="name">{this.props.name}</span>
				<span className="score">{this.props.playerData.score}</span>
				<span className={readyState}> </span>
			</li>
		)
	}
});


module.exports = ScorePanel;