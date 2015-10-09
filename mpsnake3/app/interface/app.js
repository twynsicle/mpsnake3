
// Kick off react
var React = require('react');
window.React = React;

var LoginPanel = require('./components/LoginPanel.react.js');
var ScorePanel = require('./components/ScorePanel.react');
var ControlPanel = require('./components/ControlPanel.react.js');
React.render(
	<div className="homepage content">
		<div className="main">
			<section className="game" id="game"></section>
			<LoginPanel/>
		</div>
		<aside>
			<ControlPanel />
			<ScorePanel/>
		</aside>
	</div>,
	document.getElementsByClassName('page')[0]
);
