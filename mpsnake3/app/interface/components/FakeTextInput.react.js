
var React = require('react');
var classNames = require('classnames');

var FakeSelect = React.createClass({
	getInitialState: function() {
		return {
			showErrorHighlight: false
		}
	},
	componentDidMount: function() {
		var input = React.findDOMNode(this.refs.input);
		input.addEventListener('invalid', this._onInvalid);
	},

	componentWillUnmount: function() {
		var input = React.findDOMNode(this.refs.input);
		input.removeEventListener('invalid', this._onInvalid);
	},

	_onChange: function() {
		var input = React.findDOMNode(this.refs.input);
		if (input.value.length) {
			this.setState({showErrorHighlight: false});
		} else {
			this.setState({showErrorHighlight: true});
		}
	},
	_onInvalid: function(event) {
		event.preventDefault();
		this.setState({showErrorHighlight: true});
	},

	render: function() {
		var classes = classNames(this.props.className, {
			'error-highlight': this.state.showErrorHighlight
		});

		return (
			<input type="text" id={this.props.id} className={classes}
				value={this.props.value}
				name={this.props.name} ref="input" placeholder={this.props.placeholder}
				required={this.props.required} onChange={this._onChange}
				pattern={this.props.pattern}
				tabIndex={this.props.tabindex}
			/>
			//<input type="text" name="team" ref="input" required={this.props.required} > </input>

		);
	}

});

module.exports = FakeSelect;