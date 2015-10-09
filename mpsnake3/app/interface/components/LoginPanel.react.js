
var React = require('react');

var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');
var Random = require('../utils/random');

var FakeSelect = require('../components/FakeSelect.react');
var FakeTextInput = require('../components/FakeTextInput.react');
var InlineSvg = require('../components/InlineSvg.react');

var Constants = require('../constants/constants');
var PlayerState = Constants.PlayerState;

var LoginPanel = React.createClass({
	getStateFromStores: function() {
		return {
			playerState: ScoreStore.getPlayerState(),
			name: '',
			localPlayer: ScoreStore.getPlayer()
			//name: ScoreStore.getPlayerName() || '' //TODO this doesn't work and will need to react to changes in state
		};
	},
	getDefaultProps: function() {
		return {
			teams: ScoreStore.getTeams(),
			rules: ScoreStore.getRules()
		}
	},

	getInitialState: function() {
		return _.merge({
			color: _.sample(['#F94E82', '#FF7F50', '#9039A9', '#7FDF46', '#F84E5A', '#CE418E', '#FF9F50']),//Random.generateHex(),
			isAI: false
		}, this.getStateFromStores());

	},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},

	_login: function (event) {
		event.preventDefault();

		ScoreActionCreators.login({
			name: React.findDOMNode(this.refs.name).value,
			team: event.target.team.value,
			color: this.state.color,
			isAI: this.state.isAI,
			rule: event.target.rule.value
		});
	},
	_spectate: function (event) {
		event.preventDefault();
		event.stopPropagation();
		ScoreActionCreators.spectate();
	},
	_changeColor: function (event) {
		this.setState({color: event.target.value});
	},
	_setAI: function (event) {
		var checked = event.currentTarget.checked;
		this.setState({isAI: checked});
	},
	render: function() {

		var colorButtonStyle = {
			backgroundColor: this.state.color
		};

		return (
			<section id="account" className="panel" className={this.state.playerState !== PlayerState.PENDING ? 'panel user-active' : 'panel'}>
				<div className="login-container">
					<header>
						<h2>login</h2>
					</header>
					<form action="" onSubmit={this._login}>
						<ul className="account-inputs">
							<li>
								<FakeTextInput id="name" className="name" name="name" ref="name" placeholder="name" required="required" />
							</li>
							<li className="teams">
								<FakeSelect name="team" initialText="team" options={this.props.teams} required="required"> </FakeSelect>
							</li>
							<li className="color-input">
								<label ref="colorButton" style={colorButtonStyle}>
									<span>snake color</span>
									<input type="color" className="color" name="color" ref="color" onInput={this._changeColor}/>
								</label>
							</li>
							<li className="rules">
								<FakeSelect name="rule" initialText="vote on game rule" options={this.props.rules} required="required"> </FakeSelect>
							</li>
							<li className="is-ai fake-checkbox" >
								<input type="checkbox" id="is-ai" name="is-ai" onChange={this._setAI} checked={this.state.isAI} />
								<label htmlFor="is-ai">
									<InlineSvg name="tick"/>
									<span>is ai?</span>
								</label>
							</li>
						</ul>
						<ul className="account-controls">
							<li>
								<button className="login" type="submit">login</button>
							</li>
							<li>
								<p className="or">or</p>
							</li>
							<li>
								<button className="spectate" type="submit" onClick={this._spectate}>spectate</button>
							</li>
						</ul>
					</form>
				</div>
			</section>
		);
	}
});

//var AccountContainer = React.createClass({
//	getStateFromStores: function() {
//		return ({
//			localPlayer: ScoreStore.getPlayer(),
//			authenticated: ScoreStore.isAuthenticated(),
//			gameInProgress: ScoreStore.gameInProgress()
//		});
//		//TODO get state from parent
//	},
//
//	getInitialState: function() {return this.getStateFromStores();},
//	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
//	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
//	_onChange: function() {this.setState(this.getStateFromStores());},
//
//	render: function() {
//		var contents;
//
//		if (this.state.authenticated) {
//			if (this.state.localPlayer && this.state.localPlayer.ready) {
//				contents = <button className="unready" onClick={this._unready}>unready</button>
//			} else {
//				contents = <button className="ready" onClick={this._ready}>ready</button>
//			}
//		} else {
//			contents = <p>game in progress</p>
//		}
//
//		return (
//			<section id="account" className="panel">
//				<header>
//					<h3>game</h3>
//				</header>
//				<div className="login-container">
//					{contents}
//				</div>
//			</section>
//		);
//
//	},
//	_unready: function() {
//		//NetManager.ready(false);
//	},
//	_ready: function() {
//		//NetManager.ready(true);
//	}
//});


module.exports = LoginPanel;