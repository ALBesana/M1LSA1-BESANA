const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [ preloadScene, mainMenu, myCredits, levelOne, levelTwo, levelThree, loseGame, winGame ]
};

let game = new Phaser.Game(config);
