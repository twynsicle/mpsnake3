
/// <reference path="entities/Fruit.ts" />

module MPSnake {

	export class Global {

		public static SNAKE_INITIAL_LENGTH:number = 5;
		public static CELL_HEIGHT:number = 20;
		public static GRID_CELLS:number = 40;

		public static FRUIT_COLOR:string = '#FF0000';

		public static monsterSprites:Phaser.Group;

		public static fruit:Fruit;

		//TODO function to check collisions.




	}
}
