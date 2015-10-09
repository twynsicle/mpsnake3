///<reference path="..\utils\Vec2.ts"/>


module MPSnake {
	export interface IRoundData {

		gameState:GameState;
		fruitPosition:Vec2;
		gameRule: GameRule;
	}
}