
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
			localPlayer: ScoreStore.getPlayer(),
			scores: ScoreStore.getScoresByTeam()
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

		var name = React.findDOMNode(this.refs.name).value;

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

		// If we're in test mode, pre-populate as many inputs as we can.
		var testAccount = {};
		if (location.search.indexOf('test') > -1) {
			testAccount = _.sample([
				{name: 'steven',team: 'lemons',rule: 'last-team'},
				{name: 'francis',team: 'lemons',rule: 'last-team'},
				{name: 'jaz',team: 'lemons',rule: 'last-team'},
				{name: 'chris',team: 'biebs',rule: 'last-team'},
				{name: 'mike',team: 'ai',rule: 'last-team'},
				{name: 'nik',team: 'ops',rule: 'last-team'},
				{name: 'geoff',team: 'ops',rule: 'last-team'}
			]);
		}

		var ai;
		if (location.search.indexOf('test') > -1) {
			ai = (
				<li className="is-ai fake-checkbox" >
					<input type="checkbox" id="is-ai" name="is-ai" onChange={this._setAI} tabIndex="5" checked={this.state.isAI} />
					<label htmlFor="is-ai">
						<InlineSvg name="tick"/>
						<span>is ai?</span>
					</label>
				</li>
			);
		}

		return (
			<section id="account" className="panel" className={this.state.playerState !== PlayerState.PENDING ? 'panel user-active' : 'panel'}>
				<div className="login-container">
					<header>
						<h2>make snake</h2>
					</header>
					<form action="" onSubmit={this._login}>
						<ul className="account-inputs">
							<li>
								<FakeTextInput id="name" className="name" value={testAccount.name} name="name" ref="name"
											   tabindex="1"
											   placeholder="name" required="required" pattern="[A-Za-z-0-9_\-]+"/>
							</li>
							<li className="teams">
								<FakeSelect name="team" value={testAccount.team} initialText="team" options={this.props.teams}
											tabindex="2"
											required="required"> </FakeSelect>
							</li>
							<li className="color-input">
								<label ref="colorButton" style={colorButtonStyle}>
									<span>snake color</span>
									<input type="color" defaultValue={this.state.color} className="color" name="color" ref="color" tabIndex="3" onInput={this._changeColor}/>
								</label>
							</li>
							{ai}
							<li className="rules">
								<FakeSelect name="rule" value={testAccount.rule} initialText="vote on game rule"
											tabindex="4"
											options={this.props.rules} required="required"> </FakeSelect>
							</li>

						</ul>
						<ul className="account-controls">
							<li>
								<button className="login" type="submit">play</button>
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

module.exports = LoginPanel;