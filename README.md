# Multiplayer Snake

![screenshot][screenshot]


##### Overview
Multiplayer implementation of the game of snake, multiple snakes compete for the fruit that allows them to increase in length and score. Snakes that crash into themselves or other snakes are frozen for the rest of the round.

##### Built with
- Interface is built in React and Flux.
- Game is built using Typescript and Phaser.
- Network communication is handled with Signalr.

##### Features
- Up to 8 simultaneous players.
- Allows for users to spectate a current game without playing.
- Interface updates with current scores and game state.
- Dead snakes become obstacles for live players.
- Players can select their snakes name, team and colour. 
- Players can vote on different game rules.
    * Last team standing.
    * Last snake standing.
    * First snake to length 15.



[screenshot]: /screenshot.png