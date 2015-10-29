/// <reference path="Global.ts" />
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="../libs/easystarjs.d.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="utils/Enums.ts" />
/// <reference path="utils/Vec2.ts" />
///<reference path="managers\SnakeManager.ts"/>
/*
//TODO move these somewhere meaningful.
interface ObjectConstructor {
	observe(o: any, callback: Function): any;
}

interface ArrayConstructor {
	observe(o: any, callback: Function): any;
}

declare var userDetails: any[];
*/

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

			/*Global.snakeManager.createLocalPlayer({
				color: Random.generateHex(),
				headPosition: null,
				name: 'derp',
				startingPosition: Global.getEmptyCell(),
				isAI: false,
				snakeLength: Global.SNAKE_INITIAL_LENGTH
			});*/
			//TODO wait until a) player requests, be other snake position recieved
			//TODO check all spawn squares.
			//var startingPos:Vec2 = Global.getEmptyCell();
			//console.log('localSnake starting at:', startingPos);
			//Global.localSnake = new Snake(this.game, startingPos, Global.SNAKE_INITIAL_LENGTH, '#00FF00');
			//TODO send snake to everyone registered  -they can double check based on client id.

			// Check session storage for user details.
			// This allows us to both persist this across sessions and communicate between
			// the interface and game components.
			var userDetails = sessionStorage.getItem('user-details');
			if (userDetails) {
				userDetails = JSON.parse(userDetails);

				// Convert game rule provided as string to GameRule enum.
				var rule:GameRule;
				switch (userDetails.rule) {
					case 'last-team':
						rule = GameRule.LAST_TEAM;
						break;
					case 'last-snake':
						rule = GameRule.LAST_SNAKE;
						break;
					case 'first-snake':
						rule = GameRule.FIRST_SNAKE_15;
						break;
					default:
						rule = GameRule.LAST_SNAKE;
				}

				console.log('creating snake');
				Global.snakeManager.createLocalPlayer({
					color: userDetails.color || Random.generateHex(),
					headPosition: null,
					name: userDetails.name || Random.generateString(4),
					team: userDetails.team || 'no team',
					startingPosition: Global.getEmptyCell(),
					isAI: userDetails.isAI || false,
					snakeLength: Global.SNAKE_INITIAL_LENGTH,
					isReady: false,
					rule: rule
				});
			}

			// Monitor controls for when ready status changes.
			$('body').on('click', '.ready button', function() {
				if ($(this).val() === 'ready') {
					// Give time for react layer to perform it's operations.
					window.setTimeout(function() {
						Global.snakeManager.localPlayer.setReady(true, true);
					}, 10);
				} else {
					window.setTimeout(function() {
						Global.snakeManager.localPlayer.setReady(false, true);
					}, 10);
				}
			});

		}

		update():void {

			// this.player.update();

			//Global.lightingManager.update();

			if ((new Date().getTime() - this.lastUpdate) > this.timeBetweenUpdates) {

				if (Global.round && Global.round.gameState === GameState.STARTED) {

					if (Global.pathMapDirty) {
						Global.rebuildPathMap();
						Global.easyStar.setGrid(Global.pathMap);
					}
					Global.easyStar.calculate();

					Global.snakeManager.update();

					Global.round.update();
				}

				this.lastUpdate = (new Date().getTime());
			}
		}

	}
} 