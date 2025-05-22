class mainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }

    create() {
        this.menuBackground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'menuBg').setOrigin(0, 0);
        this.add.image(380, 350, 'banan').setScale(1.2);
        this.add.text(23, 100, 'Catch the Banan!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            fill: '#fff'
        });

        this.add.image(320, 214, 'playBtn').setScale(1.5);
        const playButton = this.add.text(350, 200, 'PLAY', { 
            fontFamily: '"Press Start 2P"',
            fontSize: '32px', 
            fill: '#fff' 
        }).setInteractive();

        this.add.image(270, 274, 'creditBtn').setScale(1.5);
        const creditsButton = this.add.text(295, 260, 'CREDITS', { 
            fontFamily: '"Press Start 2P"',
            fontSize: '32px', 
            fill: '#fff' 
        }).setInteractive();

        this.add.image(320, 334, 'closeBtn').setScale(2.2);
        const quitButton = this.add.text(350, 320, 'QUIT', { 
            fontFamily: '"Press Start 2P"',
            fontSize: '32px', 
            fill: '#f00' 
        }).setInteractive();

        playButton.on('pointerdown', () => {
            this.sound.play('clickSFX');

            this.time.delayedCall(150, () => {
                this.scene.start('levelOne');
            });
        });
        
        creditsButton.on('pointerdown', () => {
            this.sound.play('clickSFX');

            this.time.delayedCall(150, () => {
            this.scene.start('myCredits');
            });
        });

        quitButton.on('pointerdown', () => {
            this.sound.play('clickSFX');
            alert('You have quit the game.');
            music.stop();
            
            this.time.delayedCall(150, () => {

            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
            this.add.text(180, 280, 'Game Quit', { 
                fontFamily: '"Press Start 2P"',
                fontSize: '48px', 
                fill: '#fff' });

            this.sys.game.loop.stop();
            });
        });

        let music = this.registry.get('currentMusic');
        if (!music || !music.isPlaying || music.key !== 'menuMusic') {
            if (music && music.isPlaying) {
                music.stop();
            }

            music = this.sound.add('menuMusic', { loop: true, volume: 0.3 });
            music.play();
            this.registry.set('currentMusic', music);
        }
    }

    update() {
        this.menuBackground.tilePositionY -= 0.2;
    }
}
