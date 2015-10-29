
var React = require('react');

var ScoreStore = require('../stores/scoreStore');

var classNames = require('classnames');

var ResultPanel = React.createClass({
	getStateFromStores: function() {
		return {
			resultData: ScoreStore.getResultData()
		};
	},

	getInitialState: function() {return this.getStateFromStores();},
	componentDidMount: function() {ScoreStore.addChangeListener(this._onChange);},
	componentWillUnmount: function() {ScoreStore.removeChangeListener(this._onChange);},
	_onChange: function() {this.setState(this.getStateFromStores());},
	render: function() {

		if (_.isEmpty(this.state.resultData)) {
			return (
				<section id="result" className="panel">
					<div>
						<ul>
						</ul>
					</div>
				</section>
			)
		}

		var messageText = '';
		if (_.isEmpty(this.state.resultData)) {
			messageText = '';
		} else if (this.state.resultData.rule === 'last-team') {
			messageText = 'team ' + this.state.resultData.team + ' has won.'
		} else if (this.state.resultData.rule === 'last-snake') {
			messageText = this.state.resultData.name + ' from team ' + this.state.resultData.team + ' has won.'
		} else if (this.state.resultData.rule === 'first-snake') {
			messageText = this.state.resultData.name + ' from team '
					+ this.state.resultData.team + ' has '
					+ 'reached length ' + this.state.resultData.goal + 'first.'
		}

		var messageContents;
		var logoClass = classNames('team-logo', this.state.resultData.team);
		if (!_.isEmpty(this.state.resultData)) {
			messageContents = (
					<ul>
						<li className={logoClass}> </li>
						<li className="message">
							{messageText}
						</li>
					</ul>
			)
		}

		var panelClass = classNames('panel', {'active': !_.isEmpty(this.state.resultData)});

		return (
			<section id="result" className={panelClass}>
				<div>
					{messageContents}
				</div>
			</section>
		);

	}
});

module.exports = ResultPanel;