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
		proxy:HubProxy;

		private connected:boolean;

		private group:string;
		private clientId:string;

		constructor(group, callback:()=>void) {
			this.connected = false;
			this.connection = $.hubConnection();
			this.connection.logging = false;
			// Binding with createHubProxy means you can use a string name, so no need to add dynamic properties to the hub
			this.proxy = this.connection.createHubProxy('snakeHub');
			this.wireEventListeners();
			this.initializeConnection(callback);

			this.group = group;

			/******************************************************************
			 * Outbound
			 *****************************************************************/
			// Player management.
			$(window).on('register', (event:JQueryEventObject) => {
				this.proxy.invoke('Register', this.group);
			});
			$(window).on('requestSnakes', (event:JQueryEventObject) => {
				console.log('requesting snakes already in game.');
				this.proxy.invoke('RequestSnakes', this.group);
			});
			$(window).on('playerCreated', (event:JQueryEventObject) => {
				var snakeData = Global.snakeManager.localPlayer.getData();
				this.proxy.invoke('SendSnakeToAll', this.group, JSON.stringify(snakeData));
			});
			$(window).on('playerLeft', (event:JQueryEventObject) => {
				this.proxy.invoke('RemoveSnake', this.group);
			});
			// Game state.
			$(window).on('updateSnake', (event:JQueryEventObject, data) => {
				this.proxy.invoke('UpdateSnake', this.group, JSON.stringify(data));
			});
			$(window).on('updateGameState', (event:JQueryEventObject) => {
				var data = Global.getGameData();
				this.proxy.invoke('UpdateGameState', this.group, JSON.stringify(data));
			});


		}


		/**********************************************************************
		 * Outbound
		 *********************************************************************/
		wireEventListeners():void {
			// Player Managemen.
			this.proxy.on("registerResponse", (clientId:string) => {
				this.clientId = clientId;
				$(window).trigger('registered');
			});
			this.proxy.on("requestSnake", (clientId:string) => {
				console.log('snake requested, sending to ', clientId);
				//TODO this can be a method of the snake object
				var snakeData = Global.snakeManager.localPlayer.getData();
				this.proxy.invoke('SendSnake', clientId, JSON.stringify(Global.snakeManager.localPlayer.getData()));
			});
			this.proxy.on("receiveNewSnake", (clientId:string, snakeData:string) => {
				var data = JSON.parse(snakeData);
				Global.snakeManager.addRemotePlayer(clientId, data);
				console.log('snake received', data);
			});
			this.proxy.on("removeSnake", (clientId:string) => {
				Global.snakeManager.removePlayer(clientId);
				console.log('snake has left the game ', clientId);
			});
			// Game State.
			this.proxy.on("updateSnake", (clientId:string, data:string) => {
				//TODO we are recieving twice as many of these packets as we want
				Global.snakeManager.updateRemoteSnake(clientId, JSON.parse(data));
			});
			this.proxy.on("updateGameState", (data:any) => {
				//TODO we are recieving twice as many of these as we want
				Global.setGameData(JSON.parse(data));
			});

		}

		initializeConnection(callback):void {
			//console.log("Framework Hub initializeConnection");
			//var that = this;
			//Again, using invoke means passing a string argument.
			this.connection.start().done(() => {
				callback();

			});
		}

	}
}