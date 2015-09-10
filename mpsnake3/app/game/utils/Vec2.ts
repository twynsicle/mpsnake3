/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../Global.ts" />

module MPSnake {

	export class Vec2 extends Phaser.Point{

		constructor(x:number, y: number) {

			super(x, y);
		}

		public wrapToBoard() {
			// Wrap to board.
			if (this.x < 0) {this.x = Global.GRID_CELLS - 1;}
			if (this.y < 0) {this.y = Global.GRID_CELLS - 1;}
			if (this.x >= Global.GRID_CELLS) {this.x = 0;}
			if (this.y >= Global.GRID_CELLS) {this.y = 0;}
		}

		public add(a:number, b:number):Vec2 {
			return <Vec2>super.add(a, b);
		}

		public toTile() {
			return new Vec2(Math.floor(this.x/Global.CELL_HEIGHT), Math.floor(this.y/Global.CELL_HEIGHT));
		}

		public toPoint() {
			return new Vec2(this.x*Global.CELL_HEIGHT, this.y*Global.CELL_HEIGHT);
		}

		public toString() {
			return '{x:' + this.x + ',y:' + this.y + '}';
		}


	}
}
