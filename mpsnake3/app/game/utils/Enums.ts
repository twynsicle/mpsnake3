

module MPSnake {

	export enum Directions {
		UP,
		DOWN,
		LEFT,
		RIGHT
	}

	export enum GameState {
		READY,
		STARTED,
		ENDED
	}

	export enum UpdateType {
		MOVE,
		INCREASE_LENGTH
	}
}