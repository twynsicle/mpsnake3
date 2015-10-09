
var React = require('react');

var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');
var Random = require('../utils/random');

var Constants = require('../constants/constants');
var PlayerState = Constants.PlayerState;

var ControlPanel = React.createClass({
	getStateFromStores: function() {
		return {
			playerState: ScoreStore.getPlayerState(),
			localPlayer: ScoreStore.getPlayer(),
			gameInProgress: ScoreStore.getGameInProgress()
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
		var contents;

		if (this.state.playerState !== PlayerState.PLAYING) {return null;}

		// TODO this is still important
		if (!this.state.gameInProgress) {
			if (this.state.localPlayer.ready) {
				contents = <button className="unready" onClick={this._unready}>unready</button>
			} else {
				contents = <button className="ready" onClick={this._ready}>ready</button>
			}
		} else {
			contents = <p>game in progress</p>
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
						<li className="ready">
							<span>join game?</span>
							<button type="button" value="unready" className={!this.state.localPlayer.ready ? 'active' : ''} onClick={this._setUnready}>not ready</button>
							<button type="button" value="ready" className={this.state.localPlayer.ready ? 'active' : ''} onClick={this._setReady}>ready</button>
						</li>
						<li className="logout">
							<button type="button">log out</button>
						</li>
					</ul>
				</div>
			</section>
		);

	}
});

module.exports = ControlPanel;