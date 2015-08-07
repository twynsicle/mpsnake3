using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(mpsnake3.Startup))]

namespace mpsnake3 {
	public class Startup {

		public void Configuration(IAppBuilder app) {

			var hubConfiguration = new HubConfiguration();
			hubConfiguration.EnableDetailedErrors = true;
			hubConfiguration.EnableJavaScriptProxies = true;

			app.MapSignalR("/signalr", hubConfiguration);
		}

	}
}