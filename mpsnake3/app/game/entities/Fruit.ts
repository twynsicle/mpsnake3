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

		sprite:Phaser.Sprite;

		pos:Vec2;

		// TODO we only want to spawn this when the game starts.
		constructor(game:Phaser.Game, startingPosition: Vec2) {
			this.game = game;
			this.pos = new Vec2(startingPosition.x, startingPosition.y);

			this.sprite = this.createCell();
			this.sprite.x = this.pos.toPoint().x;
			this.sprite.y = this.pos.toPoint().y;
			//console.log(this.pos);
			this.game.add.existing(this.sprite);
		}

		public respawn(newPosition?:Vec2):void {
			if (newPosition) {
				this.pos = new Vec2(newPosition.x, newPosition.y);
			} else {
				this.pos = Global.getEmptyCell();
			}
			this.sprite.x = this.pos.toPoint().x;
			this.sprite.y = this.pos.toPoint().y;
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

		public destroy():void {
			this.sprite.kill();
		}
	}
}