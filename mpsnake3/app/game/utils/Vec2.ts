/// <reference path="../../libs/phaser.d.ts" />

module MPSnake {

	export class Vec2 extends Phaser.Point{

		constructor(x:number, y: number) {
			super(x, y);
		}

		public add(a:number, b:number):Vec2 {
			return <Vec2>super.add(a, b);
		}

		public toTile() {
			return new Vec2(Math.floor(this.x/20), Math.floor(this.y/20));
		}

		public toPoint() {
			return new Vec2(this.x*20, this.y*20);
		}


	}
}
