
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="utils/Enums.ts" />
/// <reference path="../libs/easystarjs.d.ts" />
///<reference path="managers\SnakeManager.ts"/>

module MPSnake {

	export class Global {

		public static game:Phaser.Game;

		// Constants
		public static SNAKE_INITIAL_LENGTH:number = 5;
		public static CELL_HEIGHT:number = 20;
		public static GRID_CELLS:number = 40;

		public static FRUIT_COLOR:string = '#FF0000';

		// State
		public static gameState:GameState = GameState.READY;

		// Entities
		public static fruit:Fruit;

		// Managers
		public static snakeManager:SnakeManager;

		//TODO function to check collisions.

		// --------------------------------------------------------------------
		// AStar
		// --------------------------------------------------------------------
		static easyStar: EasyStar.js;
		/// Map containing squares that are clear and free of entities.
		static pathMap:number[][] = [];
		/// If true PathMap needs to be rebuilt.
		static pathMapDirty:boolean = true;


		static preBuildPathMap() {
			var i,j;
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
					Global.pathMap[pos.y][pos.x] = 1;
				}
			}
			_.forEach(this.snakeManager.remotePlayers, (player:Snake) => {
				for (i = 1; i < player.segmentPositions.length; i += 1) {
					var pos:Vec2 = player.segmentPositions[i];
					Global.pathMap[pos.y][pos.x] = 1;
				}
			});
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
			return !(Global.pathMap[cell.y][cell.x] === 1);
		}
		static getEmptyCell():Vec2 {
			while (true) {
				var randomPos = new Vec2(_.random(0, Global.GRID_CELLS - 1),_.random(0, Global.GRID_CELLS -1));
				if (Global.checkCellEmpty(randomPos)) {
					return randomPos;
				}
			}
		}

		//
		// GameState
		//
		static getGameData ():any {
			return {
				gameState: Global.gameState,
				fruitPosition: Global.fruit.pos
			}
		}
		static setGameData(data:any) {
			Global.gameState = data.gameState;
			var fruitPosition = new Vec2(data.fruitPosition.x, data.fruitPosition.y);
			if (!Global.fruit) {
				Global.fruit = new Fruit(Global.game, fruitPosition);
			} else {
				Global.fruit.destroy();
				Global.fruit = new Fruit(Global.game, fruitPosition);
			}
		}
		
	}
}
