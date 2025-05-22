class myCredits extends Phaser.Scene {
    constructor() {
        super({ key: 'myCredits' });
    }

    create() {
        this.gameBackground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'creditBg').setOrigin(0, 0);
        this.add.text(230, 100, 'CREDITS', { 
            fontFamily: '"Press Start 2P"',
            fontSize: '48px', 
            fill: '#fff' 
        });

        this.add.text(40, 220, 'Name:    A.L. Schatz A. Besana \nSection: A224 \nProgram: BSEMC', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#fff',
            lineSpacing: 20
        });

        const imageLink = this.add.text(100, 380, 'Click here -> Image Assets used <-', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#00f'
        }).setInteractive({ useHandCursor: true });
        imageLink.on('pointerdown', () => {
            window.open('https://pixelfrog-assets.itch.io/pixel-adventure-1', '_blank');
        });

        const soundLink = this.add.text(100, 430, 'Click here -> Sound Assets used <-', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#00f'
        }).setInteractive({ useHandCursor: true });
        soundLink.on('pointerdown', () => {
            window.open('https://brackeysgames.itch.io/brackeys-platformer-bundle', '_blank');
        });

        this.add.image(317, 504, 'backBtn').setScale(2);
        const backButton = this.add.text(340, 490, 'BACK', { 
            fontFamily: '"Press Start 2P"',
            fontSize: '32px', 
            fill: '#f00' 
        }).setInteractive();
        
        backButton.on('pointerdown', () => {
            this.sound.play('clickSFX');

            this.time.delayedCall(150, () => {
                this.scene.start('mainMenu');
            });
        });
    }

    update() {
        this.gameBackground.tilePositionY -= 0.2;
    }
}
