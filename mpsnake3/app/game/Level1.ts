/// <reference path="Global.ts" />
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="../libs/easystarjs.d.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="utils/Enums.ts" />
/// <reference path="utils/Vec2.ts" />
///<reference path="managers\SnakeManager.ts"/>

module MPSnake {

	/// Sets up the game.
	export class Level1 extends Phaser.State {

		background:Phaser.Sprite;
		//music:Phaser.Sound;

		lastUpdate:number = 0;
		timeBetweenUpdates:number = 100; //ms time between updates of game state.

		create() {

			Global.game = this.game;
			Global.snakeManager = new SnakeManager(this.game);

			this.game.stage.backgroundColor = '#333333';

			// AStar
			//TODO only set up if AI?
			Global.easyStar = new EasyStar.js();
			Global.easyStar.setAcceptableTiles([0]);
			Global.rebuildPathMap();
			Global.easyStar.setGrid(Global.pathMap);

			$(window).trigger('requestSnakes');

			// Spawn Snakes

			Global.snakeManager.createLocalPlayer({
				color: Random.generateHex(),
				segmentPositions: [],
				headPosition: null,
				name: 'derp',
				startingPosition: Global.getEmptyCell(),
				isAI: false,
				snakeLength: Global.SNAKE_INITIAL_LENGTH
			});
			//TODO wait until a) player requests, be other snake position recieved
			//TODO check all spawn squares.
			//var startingPos:Vec2 = Global.getEmptyCell();
			//console.log('localSnake starting at:', startingPos);
			//Global.localSnake = new Snake(this.game, startingPos, Global.SNAKE_INITIAL_LENGTH, '#00FF00');
			//TODO send snake to everyone registered  -they can double check based on client id.



			$(document).on('keydown', (event:JQueryEventObject) => {
				if (event.which === 32) {
					if (Global.gameState === GameState.STARTED) {
						Global.gameState = GameState.READY;
					} else {
						Global.gameState = GameState.STARTED;
						// Setup gamestate.
						// Create fruit
						Global.setGameData({
							gameState: GameState.STARTED,
							fruitPosition: Global.getEmptyCell()
						});
					}
					$(window).trigger('updateGameState');
					return false;
				}
			});
		}

		update():void {

			// this.player.update();

			//Global.lightingManager.update();

			if ((new Date().getTime() - this.lastUpdate) > this.timeBetweenUpdates) {

				if (Global.gameState === GameState.STARTED) {

					if (Global.pathMapDirty) {
						Global.rebuildPathMap();
						Global.easyStar.setGrid(Global.pathMap);
					}
					Global.easyStar.calculate();

					Global.snakeManager.update();
				}

				this.lastUpdate = (new Date().getTime());
			}
		}

	}
} 