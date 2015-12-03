
var React = require('react');
var classNames = require('classnames');

var FakeSelect = React.createClass({
	getInitialState: function() {
		return {
			selected: this.props.value,
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

	_selectOption: function(event) {
		var option = React.findDOMNode(event.target),
			value = option.getAttribute('data-value');

		if ($(option).is('span')) {
			value = $(event.target).closest('[data-value]').data('value');
		}

		if (value) {
			// Set option.
			this.setState({selected: value});
			var input = React.findDOMNode(this.refs.input);
			input.value = value;

			// Hide fake select.
			React.findDOMNode(this.refs.fakeSelect).blur();

			// Remove error highlighting.
			this.setState({showErrorHighlight: false});
		}
	},
	_onInvalid: function(event) {
		event.preventDefault();
		this.setState({showErrorHighlight: true});
	},

	render: function() {
		var that = this;
		var options = this.props.options.map(function(option, index) {
			if (typeof option === 'string') {
				return (
					<li className={option + ' option'} onClick={that._selectOption} key={index} data-value={option}>
						<span>{option}</span>
					</li>
				)
			} else {
				return (
					<li className={option.value + ' option'} onClick={that._selectOption} key={index} data-value={option.value}>
						<span>{option.name}</span>
					</li>
				)
			}
		});

		var selected;
		if (!this.state.selected) {
			selected = <li>{this.props.initialText}</li>;
		} else {
			selected = (
				<li className={this.state.selected+ ' option'} data-value={this.state.selected}>
					<span>{this.state.selected}</span>
				</li>
			);
		}

		var parentClasses = classNames('fake-select', {
			'error-highlight': this.state.showErrorHighlight
		});

		var tabIndex = this.props.tabindex || -1;

		return (
			<div className={parentClasses} ref="fakeSelect" tabIndex={tabIndex}>
				<input type="text" defaultValue={this.props.value} name={this.props.name} ref="input" required={this.props.required} > </input>
				<div className="selected">
					<ul>
						{selected}
					</ul>
				</div>
				<div className="options">
					<ul>
						{options}
					</ul>
				</div>
			</div>
		);
	}

});

module.exports = FakeSelect;