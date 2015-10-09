

module MPSnake {

	export const enum Directions {
		UP,
		DOWN,
		LEFT,
		RIGHT
	}

	export const enum GameState {
		READY = 0,
		STARTED = 1,
		ENDED = 2
	}

	export const enum UpdateType {
		MOVE = 0,
		INCREASE_LENGTH = 1,
		COLLIDE_PLAYER = 2,
		CHANGE_READY = 3
	}

	export const enum PathMapContents {
		EMPTY,
		LOCAL_SNAKE,
		REMOTE_SNAKE,
		LOCAL_HEAD
	}

	export enum GameRule {
		LAST_TEAM,
		LAST_SNAKE,
		FIRST_SNAKE_15
	}
}