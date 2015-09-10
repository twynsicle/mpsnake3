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

		isInactive: boolean = false;

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
					var sprite = this.createCell(pos, this.color);
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
					var sprite = this.createCell(tilePos, this.color);
					this.segments.push(sprite);
					this.game.add.existing(sprite);
				});
				this.headPosition = this.segmentPositions[this.segmentPositions.length - 1];

				// Controls.
				// We want to ignore any direction changes that would mean the snakes head
				// would do a 180 and run into  itself.
				$(document).on('keydown', (event:JQueryEventObject) => {
					var newDirection;
					switch (event.keyCode) {
						case 37: // left
							if (this.direction !== Directions.RIGHT) {
								this.direction = Directions.LEFT;
								return false;
							}
							break;
						case 39: // right
							if (this.direction !== Directions.LEFT) {
								this.direction = Directions.RIGHT;
								return false;
							}
							break;
						case 38: // up
							if (this.direction !== Directions.DOWN) {
								this.direction = Directions.UP;
								return false;
							}
							break;
						case 40: //down
							if (this.direction !== Directions.UP) {
								this.direction = Directions.DOWN;
								return false;
							}
							break;
						default:
							break;
					}

				});
			}

			// Force pathmap to update with new snakes positions.
			Global.setPathMapDirty();
		}


		private createCell(tilePos:Vec2, color:string):Phaser.Sprite {
			var bitmap = new Phaser.BitmapData(this.game, Random.guid(), Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.beginPath();
			bitmap.ctx.rect(0, 0, Global.CELL_HEIGHT, Global.CELL_HEIGHT);
			bitmap.ctx.fillStyle = color;
			//bitmap.ctx.fillStyle = Random.generateHex();
			bitmap.ctx.fill();

			var pos:Vec2 = new Vec2(tilePos.x * Global.CELL_HEIGHT, (tilePos.y * Global.CELL_HEIGHT));

			return new Phaser.Sprite(this.game, pos.x, pos.y , bitmap);
		}

		private changeColor (newColor:string):void {

			// Remove old cells.
			_.each(this.segments, (segment:Phaser.Sprite) => {
				segment.destroy();
			});
			this.segments = [];

			// Create new cells.
			for (var i = 1; i < this.segmentPositions.length; i += 1) {
				// Ignore the first segment as it is placeholder.
				var sprite = this.createCell(this.segmentPositions[i], newColor);
				this.segments.push(sprite);
				this.game.add.existing(sprite);
			}
			//this.logPositions();
			//this.logSpritePositions();
		}


		public setInactive ():void {
			this.color = '#777777';
			this.changeColor('#777777');
			this.isInactive = true;
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
			this.segments[0] = this.createCell(this.segmentPositions[0], this.color);
		}


		/**
		 * Checks whether Snake has collided with a relevant game object and updates game state
		 * and snake state in response.
		 * @param newHeadPosition square the snake is attempting to move into.
		 * @return false if collision should prevent movement.
		 */
		private checkCollisions(newHeadPosition:Vec2):boolean {
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

			// Check for collisions with other snakes.
			if (Global.pathMap[newHeadPosition.y][newHeadPosition.x] === PathMapContents.REMOTE_SNAKE) {
				console.log('Snake has collided with another snake.');
				this.setInactive();
				$(window).trigger('updateSnake', [{updateType: UpdateType.COLLIDE_PLAYER}]);
				return false;
			}

			// Check collision with self, snake head is marked separately since we might be checking for a square we
			// our currently in - which might still contain the snakes head.
			if (Global.pathMap[newHeadPosition.y][newHeadPosition.x] === PathMapContents.LOCAL_SNAKE){
				console.log('Snake has collided with itself.');
				this.setInactive();
				$(window).trigger('updateSnake', [{updateType: UpdateType.COLLIDE_PLAYER}]);
				return false;
			}

			return true;
		}


		public updatePosition(newHeadPosition:Vec2):void {
			// Check if new head position is the same as existing head position.
			if (this.headPosition === newHeadPosition) {
				console.error('duplicate head position ' + newHeadPosition.toString() + '' + this.headPosition.toString());
				return;
			}

			if (!this.isRemote) {
				$(window).trigger('updateSnake', [{updateType: UpdateType.MOVE, pos: newHeadPosition}]);
			}

			// Ensure tail is removed - this should not be required.
			this.segments[0].destroy();

			// Move snake head.
			this.segmentPositions.push(newHeadPosition);
			var sprite = this.createCell(newHeadPosition, this.color);
			this.segments.push(sprite);
			this.game.add.existing(sprite);

			// We want to leave the last space vacant to make it easier to extend the length of the snake.
			while ((this.segments.length - this.length) > 1) {
				this.segments.shift();
				this.segmentPositions.shift();
				this.segments[0].destroy();
			}

			this.headPosition = newHeadPosition;

			// Update pathmap.
			Global.setPathMapValue(this.segmentPositions[0], PathMapContents.EMPTY);
			if (this.isRemote) {
				Global.setPathMapValue(_.last(this.segmentPositions), PathMapContents.REMOTE_SNAKE);
			} else {
				Global.setPathMapValue(this.segmentPositions[this.segmentPositions.length - 2], PathMapContents.LOCAL_SNAKE);
				Global.setPathMapValue(_.last(this.segmentPositions), PathMapContents.LOCAL_HEAD);
			}

		}


		update() {

			// Remote snakes are updated from the broadcasted results, rather than
			// determining their behavior locally.
			if (this.isRemote) {
				return;
			}

			if (this.isInactive) {
				return
			}

			var continueMoving;

			// We want to check for collisions before updating the snake this loop ans other snakes
			// positions may have changed so that this snake has now collided.
			continueMoving = this.checkCollisions(this.headPosition);
			if (!continueMoving) {
				return;
			}

			if (!this.isAI) {
				var newHeadPosition:Vec2 = new Vec2(this.headPosition.x, this.headPosition.y);

				// Update position according to current direction.
				switch (this.direction) {
					case Directions.UP:
						newHeadPosition.add(0, -1);
						break;
					case Directions.DOWN:
						newHeadPosition.add(0, 1);
						break;
					case Directions.LEFT:
						newHeadPosition.add(-1, 0);
						break;
					case Directions.RIGHT:
						newHeadPosition.add(1, 0);
						break;
					default:
						console.error('default direction being entered.');
						newHeadPosition = newHeadPosition.add(0, -1);
						break;
				}
				newHeadPosition.wrapToBoard();
				continueMoving = this.checkCollisions(newHeadPosition);
				if (continueMoving) {
					this.updatePosition(newHeadPosition);
				}
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

						newHeadPosition.wrapToBoard();
						continueMoving = this.checkCollisions(newHeadPosition);
						if (continueMoving) {
							this.updatePosition(newHeadPosition);
						}
					} else {
						console.log('trapped!');
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
				sprite.destroy();
			});
		}

		private logPositions():void {
			var out = this.segmentPositions.map(function(pos) {return pos.toString()});
			var message = 'a-' + this.segmentPositions.length + ': ' + out.join(',');
			console.log('%c ' + message, 'color: #777');
		}

		private logSpritePositions(): void {
			var out = this.segments.map((sprite:Phaser.Sprite) => {
				return '{x:' + sprite.x / Global.CELL_HEIGHT+ ',y:' + sprite.y / Global.CELL_HEIGHT + '}';
			});
			console.log('b-' + this.segments.length + ': ' + out.join(','));
		}
	}
}