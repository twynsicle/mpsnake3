/// <reference path="../libs/phaser.d.ts" />
/// <reference path="SnakeHub.ts"/>

module MPSnake {

	export class Boot extends Phaser.State {

		preload() {

			this.load.image('preloadBar', 'game/images/loader.png');

		}

		create() {

			//  Unless you specifically need to support multitouch I would recommend setting this to 1
			this.input.maxPointers = 1;

			//  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
			this.stage.disableVisibilityChange = true;

			if (this.game.device.desktop) {
				//  If you have any desktop specific settings, they can go in here
				//this.stage.scale.pageAlignHorizontally = true;
			}
			else {
				//  Same goes for mobile settings.
			}

			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			// Open connection.
			//$.connection.hub.start().done(()=> {
			// Register with the server, currently there is no room separation, so all players are in the same room.
			var snakeHub = new SnakeHub('abc', ()=> {

				$(window).trigger('register');

				$(window).on('registered', () => {
					this.game.state.start('Preloader', true, false);
				});

			});

		}

	}

}
