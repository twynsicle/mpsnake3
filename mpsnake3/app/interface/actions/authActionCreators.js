
var Dispatcher = require('../dispatcher/dispatcher');

var Constants = require('../constants/constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {

	authSuccess: function(response) {
		Dispatcher.dispatch({
			type: ActionTypes.AUTH_RESPONSE,
			response: response
		});
	}

};
