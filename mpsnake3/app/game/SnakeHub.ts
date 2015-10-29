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
				var positionData = Global.snakeManager.localPlayer.getSegmentPositions();
				this.proxy.invoke('SendSnakeToAll', this.group, JSON.stringify(snakeData), JSON.stringify(positionData));
				Global.updateInterface();
			});
			$(window).on('playerLeft', (event:JQueryEventObject) => {
				this.proxy.invoke('RemoveSnake', this.group);
			});
			// Game state.
			$(window).on('updateSnake', (event:JQueryEventObject, data) => {
				if (!Global.snakeManager.localPlayer) return;

				this.proxy.invoke('UpdateSnake', this.group, JSON.stringify(data));

				// Update interface.
				if (data.updateType === UpdateType.INCREASE_LENGTH ||
						data.updateType === UpdateType.COLLIDE_PLAYER ||
						data.updateType === UpdateType.CHANGE_READY) {
					Global.updateInterface();
				}
			});
			$(window).on('updateGameState', (event:JQueryEventObject) => {
				if (!Global.snakeManager.localPlayer) return;

				var data = Global.round.getRoundData();
				this.proxy.invoke('UpdateGameState', this.group, JSON.stringify(data));
				Global.updateInterface();
			});


		}


		/**********************************************************************
		 * Outbound
		 *********************************************************************/
		wireEventListeners():void {
			// Player Management.
			this.proxy.on("registerResponse", (clientId:string) => {
				this.clientId = clientId;
				$(window).trigger('registered');
			});
			// Another player has requested information about all snakes.
			this.proxy.on("requestSnake", (clientId:string) => {
				console.log('snake requested, sending to ', clientId);
				if (Global.snakeManager.localPlayer) {
					var snakeData = Global.snakeManager.localPlayer.getData();
					var positionData = Global.snakeManager.localPlayer.getSegmentPositions();
					this.proxy.invoke('SendSnake', clientId, JSON.stringify(snakeData), JSON.stringify(positionData));
				}
			});
			this.proxy.on("receiveNewSnake", (clientId:string, snakeData:string, segmentData:string) => {
				Global.snakeManager.addRemotePlayer(clientId, JSON.parse(snakeData), JSON.parse(segmentData));
				console.log('snake received', snakeData);
				Global.updateInterface();
			});
			this.proxy.on("removeSnake", (clientId:string) => {
				Global.snakeManager.removePlayer(clientId);
				console.log('snake has left the game ', clientId);
				Global.updateInterface();
			});
			// Game State.
			this.proxy.on("updateSnake", (clientId:string, data:string) => {
				//TODO we are receiving twice as many of these packets as we want
				var snakeData = JSON.parse(data);
				Global.snakeManager.updateRemoteSnake(clientId, snakeData);
				if (snakeData.updateType === UpdateType.INCREASE_LENGTH ||
						snakeData.updateType === UpdateType.COLLIDE_PLAYER ||
						snakeData.updateType === UpdateType.CHANGE_READY) {
					Global.updateInterface();
				}
			});
			this.proxy.on("updateGameState", (data:any) => {
				data = JSON.parse(data);
				console.log(data);
				if (!Global.round) {
					Global.round = new Round(data)
				} else {
					Global.round.updateRoundData(data);
				}
				Global.updateInterface();
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