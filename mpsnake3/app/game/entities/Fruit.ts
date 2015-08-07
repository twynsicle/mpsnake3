/// <reference path="../../libs/jquery.d.ts" />
/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/lodash.d.ts" />
/// <reference path="../Global.ts" />

/// <reference path="../utils/Enums.ts" />
/// <reference path="../utils/Random.ts" />
/// <reference path="../utils/Vec2.ts" />


module MPSnake {

	export class Fruit {

		game:Phaser.Game;

		sprites:Phaser.Group;

		pos:Vec2;


		constructor(game:Phaser.Game) {
			this.game = game;

			// Determine position.
			this.pos = new Vec2(_.random(0, Global.GRID_CELLS),_.random(0, Global.GRID_CELLS));

			this.sprites = game.add.group();
			this.sprites.add(this.createCell());
			this.sprites.x = this.pos.toPoint().x;
			this.sprites.y = this.pos.toPoint().y;
			console.log(this.pos);
		}

		public respawn():void {
			var pos = Global.getEmptyCell;
			this.sprites.x = this.pos.toPoint().x;
			this.sprites.y = this.pos.toPoint().y;
		}

		private createCell():Phaser.Sprite {
			var bitmap = new Phaser.BitmapData(this.game, Random.guid(), Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.beginPath();
			bitmap.ctx.rect(0, 0, Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.fillStyle = Global.FRUIT_COLOR;
			bitmap.ctx.fill();

			return new Phaser.Sprite(this.game, 0, 0 , bitmap);
		}

		update() {

		}

		render() {

		}
	}
}