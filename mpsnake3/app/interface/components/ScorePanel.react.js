var React = require('react');

var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');

function getStateFromStores() {
	return {
		scores: ScoreStore.getScores(),
		scoresByTeam: ScoreStore.getScoresByTeam(),
		localPlayer: ScoreStore.getPlayer(),
		gameRule: ScoreStore.getGameRule()
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

		if (!Object.keys(this.state.scoresByTeam).length) return null;

		var that = this;
		var teamList = Object.keys(this.state.scoresByTeam).map(function(teamName, index) {

			return (
				<Team teamName={teamName} localPlayerName={that.state.localPlayer.name}
					  teamData={that.state.scoresByTeam[teamName]} key={index} />
			)
		});

		var allReady = true;
		for (var player in that.state.scores) {
			if (!that.state.scores.hasOwnProperty(player)) continue;
			if (!that.state.scores[player].ready) {
				allReady = false;
			}
		}
		var readyMessage;
		//TODO Probably shouldn't show scores container while empty either.
		if (!allReady && Object.keys(this.state.scores).length) {
			readyMessage = <p>waiting for all players to ready</p>
		}

		var gameRule;
		if (this.state.gameRule) {
			gameRule = <div className="game-rule">this.rules[this.state.gameRule].name</div>
		}

		return (
			<section id="scores" className="panel">
				{gameRule}
				<div className="score-container">
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
		var playerList = Object.keys(this.props.teamData).map(function(name, index) {
			var player = that.props.teamData[name];
			var isLocalPlayer = !!(that.props.localPlayerName && that.props.localPlayerName === name);

			return (
				<Player name={name} playerData={player} key={index} isLocal={isLocalPlayer} isReady={player.ready} />
			)
		});

		return (
			<li key={this.props.key} className="team">
				<h4>{this.props.teamName}</h4>
				<ul>
					{playerList}
				</ul>
			</li>
		);
	}
});

var Player = React.createClass({
	render: function () {
		var playerClass = 'player ' + (this.props.isLocal ? 'local' : ''),
			readyState = this.props.isReady ? 'ready status' : 'unready status',
			styles = {color: this.props.playerData.colour};
		return (
			<li className={playerClass} key={this.props.key}>
				<span className={readyState}></span>
				<span className="name" style={styles}>{this.props.name}</span>
				<span className="score">{this.props.playerData.score}</span>
			</li>
		)
	}
});


module.exports = ScorePanel;