
var React = require('react');

var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');
var Random = require('../utils/random');

var Constants = require('../constants/constants');
var PlayerState = Constants.PlayerState;

var ControlPanel = React.createClass({
	getStateFromStores: function() {
		return {
			countPlayers: ScoreStore.getCountPlayers(),
			playerState: ScoreStore.getPlayerState(),
			localPlayer: ScoreStore.getPlayer(),
			roundData: ScoreStore.getRoundData()
		};
	},

	getInitialState: function() {return this.getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},
	_setUnready: function() {
		ScoreActionCreators.setReadyStatus(false);
	},
	_setReady: function() {
		ScoreActionCreators.setReadyStatus(true);
	},
	render: function() {
		if (this.state.playerState !== PlayerState.PLAYING) {return null;}

		var ready;
		if (this.state.countPlayers < 2) {
			ready = <li className="message">waiting for additional players to join game.</li>
		} else if (this.state.roundData.gameState == 1) { // Playing
			ready = <li className="ready">game in progress</li>
		} else {
			 ready = (
					 <li className="ready">
						<span>join game?</span>
						<button type="button" value="unready" className={!this.state.localPlayer.ready ? 'active' : ''} onClick={this._setUnready}>not ready</button>
						<button type="button" value="ready" className={this.state.localPlayer.ready ? 'active' : ''} onClick={this._setReady}>ready</button>
					</li>
			 );
		}

		var profileStyle = {
			backgroundColor: this.state.localPlayer.color
		};
		return (
			<section id="controls" className="panel">
				<div className="">
					<ul>
						<li className="profile">
							<div className="info">
								<span className="name">{this.state.localPlayer.name}</span>
								<span className="team">team {this.state.localPlayer.team}</span>
							</div>
							<span className="profile-color" style={profileStyle}>{this.state.localPlayer.score}</span>
						</li>
						{ready}
					</ul>
				</div>
			</section>
		);

	}
});

module.exports = ControlPanel;