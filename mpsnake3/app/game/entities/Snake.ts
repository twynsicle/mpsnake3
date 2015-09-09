/// <reference path="../../libs/jquery.d.ts" />
/// <reference path="../../libs/phaser.d.ts" />
/// <reference path="../../libs/lodash.d.ts" />
/// <reference path="../../libs/Q.d.ts" />
/// <reference path="../Global.ts" />

/// <reference path="../utils/Enums.ts" />
/// <reference path="../utils/Random.ts" />
/// <reference path="../utils/Vec2.ts" />
///<reference path="ISnakeData.ts"/>


module MPSnake {

	export class Snake {

		game:Phaser.Game;

		sprites:Phaser.Group;

		headPosition:Vec2;
		segments:Phaser.Sprite[] = [];
		segmentPositions:Vec2[] = [];
		color: string;
		name: string;
		length:number;
		direction:Directions = Directions.DOWN;
		isAI: boolean;
		isRemote: boolean;


		//constructor(game:Phaser.Game, startingPosition:Vec2, length:number, color:string) {
		constructor(game:Phaser.Game, isRemote:boolean, data:SnakeData) {
			this.game = game;
			this.isRemote = isRemote;
			this.color = data.color;
			this.name = data.name;
			this.length = data.snakeLength;
			this.isAI = data.isAI;

			this.sprites = game.add.group();

			if (isRemote) {
				this.segmentPositions = data.segmentPositions;
				_.each(this.segmentPositions, (pos) => {
					var sprite = this.createCell(pos);
					this.segments.push(sprite);
					this.game.add.existing(sprite);
				});
			} else {
				// Setup body.
				// We generate an extra cell to use as the placeholder for new segments.
				_.times(this.length + 1, (i) => {

					var tilePos = new Vec2(data.startingPosition.x, data.startingPosition.y + i);
					tilePos.wrapToBoard();
					this.segmentPositions.push(tilePos);
					var sprite = this.createCell(tilePos);
					this.segments.push(sprite);
					this.game.add.existing(sprite);
				});
				this.headPosition = this.segmentPositions[this.segmentPositions.length - 1];

				// Controls.
				$(document).on('keydown', (event:JQueryEventObject) => {
					switch (event.keyCode) {
						case 37: // left
							this.direction = Directions.LEFT;
							return false;
							break;
						case 39: // right
							this.direction = Directions.RIGHT;
							return false;
							break;
						case 38: // up
							this.direction = Directions.UP;
							return false;
							break;
						case 40: //down
							this.direction = Directions.DOWN;
							return false;
							break;
						default:
							break;
					}
				});
			}

		}


		private createCell(tilePos:Vec2):Phaser.Sprite {
			var bitmap = new Phaser.BitmapData(this.game, Random.guid(), Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.beginPath();
			bitmap.ctx.rect(0, 0, Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.fillStyle = this.color;
			//bitmap.ctx.fillStyle = Random.generateHex();
			bitmap.ctx.fill();

			var pos:Vec2 = new Vec2(tilePos.x * Global.CELL_HEIGHT, (tilePos.y * Global.CELL_HEIGHT));

			return new Phaser.Sprite(this.game, pos.x, pos.y , bitmap);
		}

		/// Wrapper for EasyStar pathfinding to convert from using callbacks to
		/// using promises.
		private findPath (from:Vec2, to:Vec2):Q.Promise<any> {
			var deferred = Q.defer();
			Global.easyStar.findPath(from.x, from.y,
				to.x, to.y, function (path) {

					// Let parsing function filter out invalid results.
					deferred.resolve(path);
				});
			return deferred.promise;
		}


		public increaseLength() {
			if (!this.isRemote) {
				$(window).trigger('updateSnake', [{updateType: UpdateType.INCREASE_LENGTH}]);
			}

			this.length += 1;
			this.segments[0] = this.createCell(this.segmentPositions[0]);
		}


		private checkCollisions(newHeadPosition:Vec2):void {
			if (this.isRemote) {
				console.error('Collisions can only be checked by local snake.');
				return;
			}

			// Check for collision with fruit
			if (newHeadPosition.x === Global.fruit.pos.x && newHeadPosition.y === Global.fruit.pos.y) {
				this.increaseLength();

				Global.fruit.respawn();
				$(window).trigger('updateGameState');
			}
		}


		public updatePosition(newHeadPosition:Vec2):void {
			if (!this.isRemote) {
				$(window).trigger('updateSnake', [{updateType: UpdateType.MOVE, pos: newHeadPosition}]);
			}

			// Ensure tail is removed - this should not be required.
			this.segments[0].kill();

			// Move snake head.
			this.segmentPositions.push(newHeadPosition);
			var sprite = this.createCell(newHeadPosition);
			this.segments.push(sprite);
			this.game.add.existing(sprite);

			// We want to leave the last space vacant to make it easier to extend the length of the snake.
			while ((this.segments.length - this.length) > 1) {
				this.segments.shift();
				this.segmentPositions.shift();
				this.segments[0].kill();
			}

			this.headPosition = newHeadPosition;

			// AStar //TODO we don't want to rebuild this from scratch each time.
			Global.setPathMapDirty();
		}


		update() {

			// Remote snakes are updated from the broadcasted results, rather than
			// determining their behavior locally.
			if (this.isRemote) {
				return;
			}

			if (!this.isAI) {
				var newHeadPosition:Vec2 = this.headPosition;

				// Update position according to current direction.
				switch (this.direction) {
					case Directions.UP:
						newHeadPosition = this.headPosition.add(0, -1);
						break;
					case Directions.DOWN:
						newHeadPosition = this.headPosition.add(0, 1);
						break;
					case Directions.LEFT:
						newHeadPosition = this.headPosition.add(-1, 0);
						break;
					case Directions.RIGHT:
						newHeadPosition = this.headPosition.add(1, 0);
						break;
				}
				newHeadPosition.wrapToBoard();
				this.checkCollisions(newHeadPosition);
				this.updatePosition(newHeadPosition);
			} else {
				var promises = [];
				promises.push(this.findPath(this.headPosition, Global.fruit.pos));
				Q.all(promises).then((paths:Vec2[][]) => {
					if (paths.length && paths[0] && paths[0].length > 1) {
						var newHeadPosition:Vec2;
						// Find current head position in best path - we need to check since the path might not have updated in time.
						for (var i = 0; i < paths[0].length; i += 1) {
							if (paths[0][i].x === this.headPosition.x && paths[0][i].y === this.headPosition.y) {
								newHeadPosition = new Vec2(paths[0][i+1].x, paths[0][i+1].y);
								break;
							}
						}

						//console.log('pathing from: ', this.headPosition, ' to: ', Global.fruit.pos, ' first step: ', nextPos);
						newHeadPosition.wrapToBoard();
						this.checkCollisions(newHeadPosition);
						this.updatePosition(newHeadPosition);
					} else {
						console.log('trapped!');
						//console.log('pathing from: ', this.headPosition, ' to: ', Global.fruit.pos);
					}
				});
			}
		}


		public getData():SnakeData {
			//TODO name
			return {
				color: this.color,
				segmentPositions: this.segmentPositions,
				snakeLength: this.length,
				headPosition: this.headPosition,
				name: this.name,
				startingPosition: null,
				isAI: this.isAI

			};
		}


		public destroy():void {
			_.each(this.segments, (sprite:Phaser.Sprite) => {
				sprite.kill();
			});
		}

	}
}