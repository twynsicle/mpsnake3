/// <reference path="../../libs/jquery.d.ts" />
/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/lodash.d.ts" />
/// <reference path="../../libs/Q.d.ts" />
/// <reference path="../Global.ts" />

/// <reference path="../utils/Enums.ts" />
/// <reference path="../utils/Random.ts" />
/// <reference path="../utils/Vec2.ts" />
///<reference path="ISnakeData.ts"/>
///<reference path="IRoundData.ts"/>
///<reference path="EndCondition.ts"/>


module MPSnake {

	export class Round {

		gameState:GameState;
		fruit:Fruit;
		gameRule:GameRule;
		endCondition: IEndCondition;

		constructor();
		constructor(data: IRoundData);
		constructor(data?: IRoundData) {
			if (!data) {

				// Create new game and broadcast to other players.
				var fruitPosition = Global.getEmptyCell();
				this.fruit = new Fruit(Global.game, fruitPosition);

				// Get rule that has the most votes.
				this.gameRule = this.getVotedRule();

				this.gameState = GameState.STARTED;
			} else {

				// Create game from data received from another player.
				this.gameState = data.gameState;
				this.fruit = new Fruit(Global.game, data.fruitPosition);
				this.gameRule = GameRule[GameRule[data.gameRule]];
			}

			switch(this.gameRule) {
				case GameRule.LAST_TEAM:
					this.endCondition = new LastTeam();
					break;
				case GameRule.LAST_SNAKE:
					this.endCondition = new LastSnake();
					break;
				case GameRule.FIRST_SNAKE_15:
					this.endCondition = new FirstSnake(15);
					break;
			}
		}


		public startRound ():void {

		}

		public update():void {
			// Check if player is the only remaining player in the game.
			if (!Object.keys(Global.snakeManager.remotePlayers).length) {

				console.log('only player remaining');
				this.endRound({
					team: Global.snakeManager.localPlayer.team,
					name: Global.snakeManager.localPlayer.name,
					rule: 'last-snake'
				});
			}

			// Check if round end condition has been met.
			var endMessage = this.endCondition.checkEnded();
			if (!_.isEmpty(endMessage)) {

				console.log(endMessage);
				this.endRound(endMessage);
			}
		}


		public endRound(endMessage):void {
			this.fruit.destroy();

			Global.snakeManager.localPlayer.roundsPlayed += 1;

			Global.snakeManager.localPlayer.isReady = false;
			_.each(Global.snakeManager.remotePlayers, (remoteSnake:Snake) => {
				remoteSnake.isReady = false;
			});

			this.gameState = GameState.ENDED;

			Global.updateInterface();
			Global.signalInterfaceRoundEnd(endMessage);

			// We don't need to broadcast this as each client should
			// come to this realization independently.

			// Destroy the round object to ensure we start each round fresh.
			Global.round = null;
		}


		public broadcastRoundData() {
			$(window).trigger('updateGameState');
		}


		public getRoundData():IRoundData {
			return {
				gameState: this.gameState,
				fruitPosition: this.fruit.pos,
				gameRule: this.gameRule
			}
		}


		public updateRoundData(data:IRoundData):void {
			this.gameState = data.gameState;

			if (this.getFruitPosition() !== data.fruitPosition) {
				this.fruit.respawn(data.fruitPosition);
			}
		}

		//
		// Fruit
		//
		public getFruitPosition() {
			return this.fruit.pos;
		}


		//
		// Rules
		//

		// Get the GameRule that the majority of snakes have voted on.
		private getVotedRule ():GameRule {
			var votes = [];
			_.each(Global.snakeManager.remotePlayers, (remoteSnake:Snake) => {
				if (votes[remoteSnake.votedRule]) {
					votes[remoteSnake.votedRule] += 1;
				} else {
					votes[remoteSnake.votedRule] = 1;
				}
			});
			var localVote = Global.snakeManager.localPlayer.votedRule;
			if (votes[localVote]) {
				votes[localVote] += 1;
			} else {
				votes[localVote] = 1;
			}

			// Find index with maximum value;
			var maxCount:number = 0;
			var maxIndex:number = 0;
			_.each(votes, function(count, index) {
				if (count > maxCount) {
					maxCount = count;
					maxIndex = index;
				}
			});
			return GameRule[GameRule[maxIndex]];
		}

	}


}
