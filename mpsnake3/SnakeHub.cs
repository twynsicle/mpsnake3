using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace mpsnake3 {
	public class SnakeHub: Hub {


		public void Register(string group) {
			Groups.Add(Context.ConnectionId, group);

			// Let caller know their clientid
			var clientId = GetClientId();
			Clients.Caller.registerResponse(clientId);
		}

		public void RequestSnakes(string group) {
			var clientId = GetClientId();
			Clients.OthersInGroup(group).requestSnake(clientId);
		}

		public void SendSnake(string clientId, string data) {
			Clients.User(clientId).recieveSnake(data);
		}

		#region Utilities

		private string GetClientId() {
			string clientId = "";
			if (Context.QueryString["clientId"] != null) {
				//clientId passed from application 
				clientId = Context.QueryString["clientId"].ToString();
			}

			if (clientId.Trim() == "") {
				//default clientId: connectionId 
				clientId = Context.ConnectionId;
			}
			return clientId;

		}

		#endregion

	}
}