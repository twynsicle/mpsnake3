
// Kick off react
var React = require('react');
window.React = React;

var AccountPanel = require('./components/AccountPanel.react');
var ScorePanel = require('./components/ScorePanel.react');
React.render(
	<div className="homepage content">
		<div className="main">
			<section className="game" id="game"></section>
		</div>
		<aside>
			<AccountPanel/>
			<ScorePanel/>
		</aside>
	</div>,
	document.getElementsByClassName('page')[0]
);
