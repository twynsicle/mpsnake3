/// <reference path="../../libs/jquery.d.ts" />
/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/lodash.d.ts" />
/// <reference path="../Global.ts" />

/// <reference path="../utils/Directions.ts" />
/// <reference path="../utils/Random.ts" />
/// <reference path="../utils/Vec2.ts" />


module MPSnake {

	export class Snake {

		game:Phaser.Game;

		sprites:Phaser.Group;

		headPosition:Vec2;
		segments:Vec2[] = [];
		color: string;
		length:number;
		direction:Directions = Directions.DOWN;


		constructor(game:Phaser.Game, startingPosition:Vec2, length:number, color:string) {
			this.game = game;
			this.color = color;
			this.length = length;

			this.sprites = game.add.group();

			this.headPosition = new Vec2(startingPosition.x, startingPosition.y);

			// Setup body.
			_.times(length, (i) => {

				var tileX:number = startingPosition.x;
				var tileY:number = startingPosition.y;
				this.sprites.add(this.createCell(tileX, tileY));
			});

			// Controls.
			$(document).on('keydown', (event:JQueryEventObject) => {
				switch(event.keyCode){
					case 37: // left
						this.direction = Directions.LEFT;
						break;
					case 39: // right
						this.direction = Directions.RIGHT;
						break;
					case 38: // up
						this.direction = Directions.UP;
						break;
					case 40: //down
						this.direction = Directions.DOWN;
						break;
					default:
						break;
				}
			});

		}

		createCell(tileX, tileY):Phaser.Sprite {
			var bitmap = new Phaser.BitmapData(this.game, Random.guid(), Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.beginPath();
			bitmap.ctx.rect(0, 0, Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.fillStyle = this.color;
			bitmap.ctx.fill();

			var pos:Vec2 = new Vec2(tileX * Global.CELL_HEIGHT, (tileY * Global.CELL_HEIGHT));

			return new Phaser.Sprite(this.game, pos.x, pos.y , bitmap);
		}


		update() {
			// Update position according to current direction.
			switch(this.direction) {
				case Directions.UP:
					this.headPosition = this.headPosition.add(0, -1);
					break;
				case Directions.DOWN:
					this.headPosition = this.headPosition.add(0, 1);
					break;
				case Directions.LEFT:
					this.headPosition = this.headPosition.add(-1, 0);
					break;
				case Directions.RIGHT:
					this.headPosition = this.headPosition.add(1, 0);
					break;
			}

			// Loop around the bounds of the arena
			if (this.headPosition.x < 0) {this.headPosition.x = Global.GRID_CELLS - 1;}
			if (this.headPosition.y < 0) {this.headPosition.y = Global.GRID_CELLS - 1;}
			if (this.headPosition.x > Global.GRID_CELLS) {this.headPosition.x = 0;}
			if (this.headPosition.y > Global.GRID_CELLS) {this.headPosition.y = 0;}

			// Check for collision with fruit
			if (this.headPosition.x === Global.fruit.pos.x && this.headPosition.y === Global.fruit.pos.y) {
				Global.fruit.respawn();
				console.log('collision');
			}

			// Move snake head.
			this.sprites.children.shift();
			this.sprites.add(this.createCell(this.headPosition.x, this.headPosition.y));
		}

		render() {

		}
	}
}