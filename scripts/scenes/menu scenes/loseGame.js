class loseGame extends Phaser.Scene {
    constructor() {
        super({ key: 'loseGame' });
    }

    init(data) {
        this.bananaCount = data.bananasCollected || 0;
        this.currentLevel = data.level || 'levelOne';
    }

    create() {
        this.loseBackground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'loseBg').setOrigin(0, 0);

        this.add.text(68, 200, `💀 You Lost! \nBanan's Collected: ${this.bananaCount}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            fill: '#ff0',
            align: 'center',
            lineSpacing: 20
        });
    
        this.add.image(300, 344, 'retryBtn').setScale(1.5);
        const retryButton = this.add.text(325, 330, 'RETRY', {
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

            music = this.sound.add('loseMusic', { loop: true, volume: 0.3 });
            music.play();
            this.registry.set('currentMusic', music);
        }
    }

    update() {
        this.loseBackground.tilePositionY -= 0.2;
    }
}
