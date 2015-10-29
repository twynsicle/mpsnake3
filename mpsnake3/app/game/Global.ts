
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="utils/Enums.ts" />
/// <reference path="../libs/easystarjs.d.ts" />
///<reference path="managers\SnakeManager.ts"/>
///<reference path="entities/Round.ts"/>

module MPSnake {

	declare var scoreActionCreator:any;

	export class Global {

		public static game:Phaser.Game;

		// Constants
		public static SNAKE_INITIAL_LENGTH:number = 5;
		public static CELL_HEIGHT:number = 20;
		public static GRID_CELLS:number = 40;

		public static FRUIT_COLOR:string = '#FF0000';

		// State
		//public static gameState:GameState = GameState.READY;

		// Entities
		//public static fruit:Fruit;
		public static round:Round;

		// Managers
		public static snakeManager:SnakeManager;

		//TODO function to check collisions.

		// --------------------------------------------------------------------
		// AStar
		// --------------------------------------------------------------------
		static easyStar:EasyStar.js;
		/// Map containing squares that are clear and free of entities.
		static pathMap:number[][] = [];
		/// If true PathMap needs to be rebuilt.
		static pathMapDirty:boolean = true;


		static preBuildPathMap() {
			var i, j;
			for (i = 0; i < Global.GRID_CELLS; i += 1) {
				var row = [];
				for (j = 0; j < Global.GRID_CELLS; j += 1) {
					row.push(0)
				}
				Global.pathMap.push(row);
			}
		}


		//TODO we could have snakes adding and removing themselves rather than rebuilding.
		static rebuildPathMap():void {
			if (!Global.pathMap || !Global.pathMap.length) {
				Global.preBuildPathMap();
			}

			// Zero out array //TODO we want the snake to remove themselves.
			var i, j;
			for (i = 0; i < Global.pathMap.length; i += 1) {
				for (j = 0; j < Global.pathMap[i].length; j += 1) {
					Global.pathMap[i][j] = 0;
				}
			}

			// Fill in snake positions.
			if (this.snakeManager.localPlayer) {
				// We ignore the first position in the array for each snake since it is a placeholder.
				for (i = 1; i < this.snakeManager.localPlayer.segmentPositions.length; i += 1) {
					var pos:Vec2 = this.snakeManager.localPlayer.segmentPositions[i];
					// Mark head of snake as separate to the body.
					if (i === this.snakeManager.localPlayer.segmentPositions.length - 1) {
						Global.setPathMapValue(pos, PathMapContents.LOCAL_HEAD);
					} else {
						Global.setPathMapValue(pos, PathMapContents.LOCAL_SNAKE);
					}
				}
			}
			_.forEach(this.snakeManager.remotePlayers, (player:Snake) => {
				for (i = 1; i < player.segmentPositions.length; i += 1) {
					var pos:Vec2 = player.segmentPositions[i];
					Global.setPathMapValue(pos, PathMapContents.REMOTE_SNAKE);
				}
			});
		}


		static setPathMapValue(pos:Vec2, val:PathMapContents) {
			Global.pathMap[pos.y][pos.x] = val;
		}


		/// Sets PathMap to require rebuilding before it is used again.
		static setPathMapDirty():void {
			Global.pathMapDirty = true;
		}

		//
		// Utils
		//

		// Uses pathmap to check if any snakes in cell.
		static checkCellEmpty(cell:Vec2):boolean {
			return !(Global.pathMap[cell.y][cell.x] != PathMapContents.EMPTY);
		}
		static getEmptyCell():Vec2 {
			while (true) {
				var randomPos = new Vec2(_.random(0, Global.GRID_CELLS - 1),_.random(0, Global.GRID_CELLS -1));
				if (Global.checkCellEmpty(randomPos)) {
					return randomPos;
				}
			}
		}


		/**
		 * Sends score data to the interface.
		 */
		public static updateInterface() {
			var scores = [];
			if (Global.snakeManager.localPlayer) {
				scores.push(Global.snakeManager.localPlayer.getScoreData());
			}
			_.each(Global.snakeManager.remotePlayers, (snake:Snake) => {
				scores.push(snake.getScoreData());
			});

			scoreActionCreator.updateScores(scores);
			if (Global.round) {
				scoreActionCreator.updateRoundData(Global.round.getRoundData());
			}
		}


		public static signalInterfaceRoundEnd(message:any):void {
			scoreActionCreator.endRound(message);
		}
	}
}
