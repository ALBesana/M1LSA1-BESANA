class winGame extends Phaser.Scene {
    constructor() {
        super({ key: 'winGame' });
    }

    init(data) {
        this.bananaCount = data.bananasCollected || 0;
        this.currentLevel = data.level || 'levelOne';
    }

    create() {
        this.winBackground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'winBg').setOrigin(0, 0);

        this.add.text(19, 200, `🎉 You Win! \nTotal Bananas Collected: ${this.bananaCount}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            fill: '#ff0',
            align: 'center',
            lineSpacing: 20
        });

        this.add.image(270, 344, 'retryBtn').setScale(1.5);
        const retryButton = this.add.text(295, 330, 'RESTART', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px', 
            fill: '#fff'
        }).setInteractive();

        this.add.image(255, 412, 'backBtn').setScale(2);
        const menuButton = this.add.text(280, 400, 'MAIN MENU', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px', 
            fill: '#f00' 
        }).setInteractive();

        retryButton.on('pointerdown', () => {
            this.sound.play('clickSFX');

            this.time.delayedCall(150, () => {
                this.scene.start(this.currentLevel);
            });
        });

        menuButton.on('pointerdown', () => {
            this.sound.play('clickSFX');

            this.time.delayedCall(150, () => {
                this.scene.start('mainMenu');
            });
        });

        let music = this.registry.get('currentMusic');
        if (!music || !music.isPlaying || music.key !== 'menuMusic') {
            if (music && music.isPlaying) {
                music.stop();
            }

            music = this.sound.add('winMusic', { loop: true, volume: 0.3 });
            music.play();
            this.registry.set('currentMusic', music);
        }
    }

    update() {
        this.winBackground.tilePositionY -= 0.2;
    }
}
