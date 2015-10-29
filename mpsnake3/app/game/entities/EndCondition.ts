/// <reference path="../Global.ts" />
/// <reference path="../../libs/lodash.d.ts" />

module MPSnake {

	// Strategy pattern, implements checking for different game end conditions.
	// Each strategy returns an object containing information about the winners or null if the
	// condition hasn't been met yet.
	export interface IEndCondition {

		checkEnded:() => any;
	}
	//TODO make end condition an object.

	export class LastTeam implements IEndCondition {
		constructor() {}

		public checkEnded():any {
			var localSnake = Global.snakeManager.localPlayer;

			var activeTeams = {};
			if (localSnake && !localSnake.isInactive) {
				activeTeams[localSnake.team] = true;
			}
			_.each(Global.snakeManager.remotePlayers, (snake:Snake) => {
				if (!snake.isInactive) {
					activeTeams[snake.team] = true;
				}
			});
			if (Object.keys(activeTeams).length === 1) {
				return {
					team: Object.keys(activeTeams)[0],
					rule: 'last-team'
				};
			} /*else if (Object.keys(activeTeams).length === 0) {
				return 'Something has gone terribly wrong and no team has won.';
			}*/

			return null;
		}
	}


	export class LastSnake implements IEndCondition {
		constructor() {}

		public checkEnded():any {
			var localSnake = Global.snakeManager.localPlayer;

			// All but one snake is inactive.
			var activeSnakes = 0;

			if (localSnake && !localSnake.isInactive) {
				activeSnakes += 1;
			}
			_.each(Global.snakeManager.remotePlayers, (snake:Snake) => {
				if (!snake.isInactive) {
					activeSnakes += 1;
				}
			});
			if (activeSnakes <= 1) {
				if (localSnake && !localSnake.isInactive) {
					return {
						team: localSnake.team,
						name: localSnake.name,
						rule: 'last-snake'
					}
				} else {
					// Retrieve name of winning snake.
					var winningSnake:Snake;
					_.each(Global.snakeManager.remotePlayers, (snake:Snake) => {
						if (!snake.isInactive) {
							winningSnake = snake;
							return false;
						}
					});
					if (winningSnake) {
						return {
							team: winningSnake.team,
							name: winningSnake.name,
							rule: 'last-snake'
						}
					}
					return null;
				}
			}

			return null;
		}
	}


	export class FirstSnake implements IEndCondition {

		private goalLength;
		private secondaryCondition:IEndCondition;

		constructor(goalLength:number) {
			this.goalLength= goalLength;
			this.secondaryCondition = new LastSnake();
		}

		public checkEnded():any {
			var localSnake = Global.snakeManager.localPlayer;

			if (localSnake && localSnake.length >= this.goalLength) {
				return {
					team: localSnake.team,
					name: localSnake.name,
					goal: this.goalLength,
					rule: 'first-snake'
				};
			}
			var goalLengthReached:boolean = false,
				winningSnake:Snake;
			_.each(Global.snakeManager.remotePlayers, (snake:Snake) => {
				if (snake.length >= this.goalLength) {
					goalLengthReached = true;
					winningSnake = snake;
					return false;
				}
			});
			if (goalLengthReached) {
				if (winningSnake) {
					return {
						team: winningSnake.team,
						name: winningSnake.name,
						goal: this.goalLength,
						rule: 'first-snake'
					}
				}
			}

			// All but one snake could have become inactive, check secondary condition.
			return this.secondaryCondition.checkEnded();
		}
	}
}






