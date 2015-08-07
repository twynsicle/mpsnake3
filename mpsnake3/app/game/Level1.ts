/// <reference path="Global.ts" />
/// <reference path="entities/Fruit.ts" />
/// <reference path="entities/Snake.ts" />
/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="utils/Vec2.ts" />

module MPSnake {

	/// Sets up the game.
	export class Level1 extends Phaser.State {

		background:Phaser.Sprite;
		//music:Phaser.Sound;

		snake:Snake;

		lastUpdate:number = 0;
		timeBetweenUpdates:number = 200; //ms time between updates of game state.

		create() {

			//this.game.physics.startSystem(Phaser.Physics.P2JS);

			this.game.stage.backgroundColor = '#333333';



			// Spawn Monsters
			Global.monsterSprites = this.game.add.group();
			Global.monsterSprites.x = 0;
			Global.monsterSprites.y = 0;

			this.snake = new Snake(this.game, new Vec2(10,10), Global.SNAKE_INITIAL_LENGTH, '#00FF00');

			// Create fruit
			Global.fruit = new Fruit(this.game);

		}

		update():void {

			// this.player.update();

			//Global.lightingManager.update();

			if ((new Date().getTime() - this.lastUpdate) > this.timeBetweenUpdates) {

				this.snake.update();

				this.lastUpdate = (new Date().getTime());
			}
		}


		render():void {
			//Global.lightingManager.render();


			// game.debug.text(game.time.physicsElapsed, 32, 32);
			// game.debug.body(player);

			this.snake.render();
		}

	}
} 