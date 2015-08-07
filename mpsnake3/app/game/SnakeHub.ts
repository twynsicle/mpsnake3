/// <reference path="Global.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/signalr.d.ts" />
/// <reference path="utils/Random.ts" />
module MPSnake {

	/**
	 * Handles communication with server.
	 */
	export class SnakeHub {

		private connection:HubConnection;
		private proxy:HubProxy;

		private connected:boolean;

		private group:string;
		private clientId:string;

		constructor(group, callback:()=>void) {
			this.connected = false;
			this.connection = $.hubConnection();
			this.connection.logging = false;
			// Binding with createHubProxy means you can use a string name, so no need to add dynamic properties to the hub
			this.proxy = this.connection.createHubProxy('runHub');
			this.wireEventListeners();
			this.initializeConnection(callback);

			this.group = group;

			// Wire event listeners.
			$(window).on('register', (event:JQueryEventObject) => {
				this.proxy.invoke("Register", this.group);
			});
			$(window).on('playerCreated', (event:JQueryEventObject, data:PlayerData) => {
				this.proxy.invoke("PlayerCreated", this.group, JSON.stringify(data));
			});
			$(window).on('playerLeft', (event:JQueryEventObject, data:PlayerData) => {
				this.proxy.invoke("PlayerLeft", this.group);
			});
			$(window).on('syncPlayer', (event:JQueryEventObject, data:PlayerData) => {
				this.proxy.invoke("SyncPlayer", this.group, JSON.stringify(data));
			});
			$(window).on('keyChange', (event:JQueryEventObject, data:{key:string; state:string}) => {
				this.proxy.invoke("KeyChange", this.group, JSON.stringify(data));
			});
			$(window).on('fire', (event:JQueryEventObject, data:{pos:string;}) => {
				this.proxy.invoke("Fire", this.group, JSON.stringify(data));
			});
			$(window).on('playerHit', (event:JQueryEventObject, data:ImpulseData) => {
				this.proxy.invoke("AddImpulse", this.group, JSON.stringify(data));
			});

		}

		// Binding with proxy.on means you can use a string name for the function, so no need to add dynamic properties to the hub.
		wireEventListeners():void {
			/*this.proxy.on("HandleFrameworkMessage", (message: IFrameworkMessage) => {
			 console.log("HandleFrameworkMessage: " + message.AccountID + " - " + message.ArmID);
			 // Do something to handle the message here.
			 });*/
			this.proxy.on("registerResponse", (clientId:string) => {
				this.clientId = clientId;

				$(window).trigger('registered');
				//alert(name);
				//console.log("HandleFrameworkMessage: " + message.AccountID + " - " + message.ArmID);
				// Do something to handle the message here.
			});
			this.proxy.on("addPlayer", (clientId, data) => {
				Global.playerManager.createRemotePlayer(clientId, JSON.parse(data));
			});
			this.proxy.on("removePlayer", (clientId, data) => {
				Global.playerManager.removePlayer(clientId);
			});
			this.proxy.on("syncPlayer", (clientId, data) => {
				Global.playerManager.syncPlayer(clientId, JSON.parse(data));
			});
			this.proxy.on("keyChange", (clientId, data) => {
				Global.playerManager.keyChange(clientId, JSON.parse(data));
			});
			this.proxy.on("fire", (clientId, data) => {
				var data:any = JSON.parse(data);
				Global.projectileManager.createBullet(Global.playerManager.remotePlayers[clientId].getGunPosition(),
					data.pos, 'remote');
			});
			this.proxy.on("addImpulse", (clientId, data) => {
				Global.playerManager.addImpulse(clientId, JSON.parse(data));
			});
		}

		initializeConnection(callback):void {
			//console.log("Framework Hub initializeConnection");
			//var that = this;
			//Again, using invoke means passing a string argument.
			this.connection.start().done(() => {
				callback();
				/*that.proxy.invoke("Connect", this.AccountID, this.ArmID).done((response:FrameworkHubResponse) => {
				 //console.log("FHR: " + response.Success + " - " + response.Message);
				 if (response.Success) {
				 // Do something.
				 }
				 else {
				 // Try again. Would be better with some kind of exponential back-off.
				 setTimeout(that.initializeConnection, 500);
				 }
				 });*/

			});
		}

		/*public createPlayer(name:string, pos:Phaser.Point) {
		 this.proxy.invoke("send", name, pos.toString());
		 }*/
	}
}