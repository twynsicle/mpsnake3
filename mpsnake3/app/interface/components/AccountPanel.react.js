
var React = require('react');
//var NetManager = require('../netManager');


var ScoreActionCreators = require('../actions/scoreActionCreators');
var ScoreStore = require('../stores/scoreStore');

//TODO need to validate color and team chosen

var AccountPanel = React.createClass({
	getStateFromStores: function() {
		return {
			authenticated: ScoreStore.isAuthenticated(),
			gameInProgress: ScoreStore.gameInProgress()
		};
	},

	getInitialState: function() {return this.getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},

	render: function () {
		var activePanel = (this.state.authenticated || this.state.gameInProgress) ? <AccountContainer/> : <LoginContainer/>;
		return (
			<div>
				{activePanel}
			</div>
		);
	}
});

var LoginContainer = React.createClass({
	getStateFromStores: function() {
		return {
			name: '',
			localPlayer: ScoreStore.getPlayer()
			//name: ScoreStore.getPlayerName() || '' //TODO this doesn't work and will need to react to changes in state
		};
	},
	getDefaultProps: function() {
		return {
			teams: ScoreStore.getTeams()
		}
	},

	getInitialState: function() {return this.getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},

	_login: function () {
		var name = React.findDOMNode(this.refs.name).value;
		//NetManager.login(name, this.state.localPlayer);
	},
	_setTeam: function (event) {
		var teamName = React.findDOMNode(event.target).value;
		ScoreActionCreators.setTeam(teamName)
	},
	_setColor: function () {
		var color = React.findDOMNode(event.target).value;
		ScoreActionCreators.setColor(color)
	},
	_createAI: function () {
		//NetManager.loginAsAI();
	},
	render: function() {
		var that = this;
		var teams = this.props.teams.map(function(name, index) {
			var id = 'team-' + name;
			return (
				<li className="team radio-input" key={index}>
					<input type="radio" name="team" value={name} onChange={that._setTeam} id={id}/>
					<label className={name} htmlFor={id}></label>
				</li>
			);
		});

		var colors;
		if (this.state.localPlayer.team) {
			var colorList = ScoreStore.getColors(this.state.localPlayer.team);
			var colorSwatches =  colorList.map(function(hex, index) {
				var styles = {backgroundColor: hex};
				var id = 'color' + that.state.localPlayer.team + '-' + hex;
				return (
					<li className="color radio-input" key={index} >
						<input type="radio" name="color" value={hex} onChange={that._setColor} id={id}/>
						<label style={styles} htmlFor={id}></label>
					</li>
				);
			});
			colors = (
				<li>
					<h4>snake color</h4>
					<ul className="colors">
						{colorSwatches}
					</ul>
				</li>);
		}

		return (
			<section id="account" className="panel">
				<header>
					<h3>login</h3>
				</header>
				<div className="login-container">
					<form action="">
						<ul>
							<li>
								<h4>name</h4>
								<input type="text" className="name" name="name" ref="name" />
							</li>
							<li>
								<h4>team</h4>
								<ul className="teams">
									{teams}
								</ul>
							</li>
							{colors}
							<li>
								<button className="login" type="button" onClick={this._login}>login</button>
								<button className="createAI" type="button" onClick={this._createAI}>create ai player</button>
							</li>
						</ul>
					</form>
				</div>
			</section>
		);
	}
});

var AccountContainer = React.createClass({
	getStateFromStores: function() {
		return ({
			localPlayer: ScoreStore.getPlayer(),
			authenticated: ScoreStore.isAuthenticated(),
			gameInProgress: ScoreStore.gameInProgress()
		});
		//TODO get state from parent
	},

	getInitialState: function() {return this.getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},

	render: function() {
		var contents;

		if (this.state.authenticated) {
			if (this.state.localPlayer && this.state.localPlayer.ready) {
				contents = <button className="unready" onClick={this._unready}>unready</button>
			} else {
				contents = <button className="ready" onClick={this._ready}>ready</button>
			}
		} else {
			contents = <p>game in progress</p>
		}

		return (
			<section id="account" className="panel">
				<header>
					<h3>game</h3>
				</header>
				<div className="login-container">
					{contents}
				</div>
			</section>
		);

	},
	_unready: function() {
		//NetManager.ready(false);
	},
	_ready: function() {
		//NetManager.ready(true);
	}
});


module.exports = AccountPanel;