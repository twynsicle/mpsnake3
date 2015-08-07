/// <reference path="Global.ts" />
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="../libs/easystarjs.d.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="utils/Enums.ts" />
/// <reference path="utils/Vec2.ts" />

module MPSnake {

	/// Sets up the game.
	export class Level1 extends Phaser.State {

		background:Phaser.Sprite;
		//music:Phaser.Sound;

		lastUpdate:number = 0;
		timeBetweenUpdates:number = 1; //ms time between updates of game state.

		create() {

			//this.game.physics.startSystem(Phaser.Physics.P2JS);

			this.game.stage.backgroundColor = '#333333';

			// AStar
			//TODO only set up if AI?
			Global.easyStar = new EasyStar.js();
			Global.easyStar.setAcceptableTiles([0]);
			Global.rebuildPathMap();
			Global.easyStar.setGrid(Global.pathMap);

			// Spawn Snakes
			//TODO wait until a) player requests, be other snake position recieved
			//TODO check all spawn squares.
			var startingPos:Vec2 = Global.getEmptyCell();
			console.log('localSnake starting at:', startingPos);
			Global.localSnake = new Snake(this.game, startingPos, Global.SNAKE_INITIAL_LENGTH, '#00FF00');

			// Create fruit
			Global.fruit = new Fruit(this.game);
		}

		update():void {

			// this.player.update();

			//Global.lightingManager.update();

			if ((new Date().getTime() - this.lastUpdate) > this.timeBetweenUpdates) {

				if (Global.pathMapDirty) {
					Global.rebuildPathMap();
					Global.easyStar.setGrid(Global.pathMap);
				}
				Global.easyStar.calculate();


				if (Global.gameState === GameState.STARTED) {
					Global.localSnake.update();
				}

				this.lastUpdate = (new Date().getTime());
			}
		}


		render():void {
			//Global.lightingManager.render();


			// game.debug.text(game.time.physicsElapsed, 32, 32);
			// game.debug.body(player);

			Global.localSnake.render();
		}

	}
} 