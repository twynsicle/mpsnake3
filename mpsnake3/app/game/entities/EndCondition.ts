
module MPSnake {
	export interface IEndCondition {

		checkEnded:() => boolean;
	}


	export class LastTeam implements IEndCondition {
		constructor() {}

		public checkEnded():boolean {


			return false;
		}
	}


	export class LastSnake implements IEndCondition {
		constructor() {}

		public checkEnded():boolean {


			return false;
		}
	}


	export class FirstSnake implements IEndCondition {

		private goalLength;

		constructor(goalLength:number) {
			this.goalLength= goalLength
		}

		public checkEnded():boolean {


			return false;
		}
	}
}






