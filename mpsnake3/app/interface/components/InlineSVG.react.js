

var InlineSvg = React.createClass({

	componentDidMount: function() {

		var svg = $('#' + this.props.name);

		svg = svg.removeAttr('xmlns:a');

		var myNode = this.getDOMNode();
		for (var i=0; i < myNode.children.length; i++) {
			myNode.removeChild(myNode.children[i]);
		}

		if (svg) {
			$(myNode).append(svg.clone());
		}
	},

	render: function () {
		return (<div className="inline-svg" />)

	}
});

module.exports = InlineSvg;