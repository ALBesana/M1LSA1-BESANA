class levelTwo extends Phaser.Scene {
    constructor() {
        super({ key: 'levelTwo' });
    }

    init(data) {
    this.bananaCount = data?.bananasCollected || 0;
    }

    create() {
        this.jumpCount = 0;
        this.maxJump = 2;
        this.gameOver = false;
        this.colors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee];
        this.tintIndex = 0;

        this.gameBackground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'levelTwoBG').setOrigin(0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();

        //platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 585, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 425, 'ground');
        this.platforms.create(-50, 310, 'ground');
        this.platforms.create(80, 410, 'ground');
        this.platforms.create(750, 270, 'ground');
        this.platforms.create(380, 205, 'ground').setScale(0.3).refreshBody();

        this.jumpSFX = this.sound.add('jumpSFX');
        this.runSFX = this.sound.add('runSFX');
        this.collectSFX = this.sound.add('collectSFX');
        this.hurtSFX = this.sound.add('hurtSFX');

        //animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 10 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 10 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 0 }),
            frameRate: 1
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('playerFall', { start: 0, end: 0 }),
            frameRate: 1
        });

        this.anims.create({
            key: 'prize',
            frames: this.anims.generateFrameNumbers('prizeFruit', { start: 0, end: 16 }),
            frameRate: 32,
            repeat: -1
        });

        this.player = this.physics.add.sprite(100, 350, 'playerIdle');
        this.player.play('idle');
        this.player.setCollideWorldBounds(true);

        this.player.on('animationupdate', (anim, frame, gameObject) => {
            if (anim.key === 'run' && (frame.index === 2 || frame.index === 8)) {
                this.runSFX.play({ volume: 0.2 });
            }
        });

        this.bananaBundle = this.physics.add.group({
            key: 'prizeFruit',
            repeat: 19,
            setXY: { x: 50, y: 0, stepX: 40 }
        });

        this.bananaBundle.children.iterate((prize) => {
            prize.play('prize');
            prize.setBounce(Phaser.Math.FloatBetween(0.3, 0.8));
            prize.setCollideWorldBounds(true);
            prize.body.setAllowGravity(true);
            prize.y = Phaser.Math.Between(0, 200);
        });

        this.physics.add.collider(this.player, this.platforms, () => {
            this.jumpCount = 0;
        });

        this.physics.add.collider(this.bananaBundle, this.platforms);

        //level indicator
        const levelNames = {
            levelOne: 'Level 1',
            levelTwo: 'Level 2',
            levelThree: 'Level 3',
        };

        const currentLevelName = levelNames[this.scene.key] || 'Level';

        this.levelText = this.add.text(16, 12, currentLevelName, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            fill: '#fff'
        });

        //banana counter
        this.countText = this.add.text(this.scale.width - 410, 12, 'Banans Collected: ' + this.bananaCount, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            fill: '#ffffff'
        });

        this.spkBall = this.physics.add.group();
        this.physics.add.collider(this.spkBall, this.platforms);
        this.physics.add.collider(this.player, this.spkBall, this.hitBall, null, this);

        this.physics.add.overlap(this.player, this.bananaBundle, (player, prize) => {
            prize.disableBody(true, true);

            this.bananaCount++;
            this.collectSFX.play();
            this.countText.setText('Banans Collected: ' + this.bananaCount);

            //color changer
            if (this.bananaCount > 0) {
                this.player.setTint(this.colors[this.tintIndex]);
                this.tintIndex = (this.tintIndex + 1) % this.colors.length;
            }

            console.log(
                `After Update - Index: ${this.tintIndex}, ` +
                `Color: #${this.colors[this.tintIndex].toString(16).padStart(6, '0')}`
            );

            //size changer
            if (this.bananaCount % 5 === 0) {
                this.player.setScale(this.player.scaleX * 1.1, this.player.scaleY * 1.1);

                for (let i = 0; i < 2; i++) {
                    const ball = this.spkBall.create(
                        Phaser.Math.Between(0, this.scale.width),
                        16,
                        'spikedBall'
                    );
                    ball.setBounce(1);
                    ball.setCollideWorldBounds(true);
                    ball.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    ball.body.setAllowGravity(true);
                }
            }

            const newBanana = this.bananaBundle.create(
                Phaser.Math.Between(50, this.scale.width - 50),
                Phaser.Math.Between(0, 200), 'prizeFruit'
            );

            //banana generator
            newBanana.play('prize');
            newBanana.setBounce(Phaser.Math.FloatBetween(0.3, 0.8));
            newBanana.setCollideWorldBounds(true);
            newBanana.body.setAllowGravity(true);

            if (this.bananaCount >= 50 && !this.gameOver) {
                this.gameOver = true;
                this.physics.pause();
                this.player.anims.pause();

                //next level countdown
                const countdownText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Next level in 3', {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '32px',
                    fill: '#fff'
                }).setOrigin(0.5);

                let countdown = 3;
                this.time.addEvent({
                    delay: 1000,
                    repeat: 2,
                    callback: () => {
                        countdown--;
                        countdownText.setText(`Next level in ${countdown}`);

                        //level checker
                        if (countdown === 0) {
                            countdownText.destroy();

                            const nextLevel = this.scene.key === 'levelOne' ? 'levelTwo': this.scene.key === 'levelTwo' ? 'levelThree' : 'winGame';

                            if (nextLevel === 'winGame') {
                                this.scene.start('winGame', { bananasCollected: this.bananaCount });
                            } else {
                                this.scene.start(nextLevel, { bananasCollected: this.bananaCount });
                            }
                        }
                    }
                });
            }
        });

        //music player & stopper
        let currentMusic = this.registry.get('currentMusic');

        if (currentMusic && currentMusic.isPlaying && currentMusic.key !== 'gameMusic') {
            currentMusic.stop();
        }

        if (!currentMusic || currentMusic.key !== 'gameMusic') {
            currentMusic = this.sound.add('gameMusic', { loop: true, volume: 0.3 });
            currentMusic.play();
            this.registry.set('currentMusic', currentMusic);
        } else if (!currentMusic.isPlaying) {
            currentMusic.play();
        }
    }

    //hit condition
    hitBall(player, ball) {
        this.hurtSFX.play();
        this.physics.pause();
        player.anims.stop();
        this.gameOver = true;

        this.scene.start('loseGame', {
            bananasCollected: this.bananaCount,
            level: this.scene.key
        });
    }

    update() {
        this.gameBackground.tilePositionY -= 0.3;
        if (this.gameOver) return;

        this.player.setVelocityX(0);

        //controls
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true;
            this.player.anims.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            this.player.anims.play('run', true);
        } else {
            this.player.anims.play('idle', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.jumpCount < this.maxJump) {
            this.player.setVelocityY(-450);
            this.jumpCount++;
            this.jumpSFX.play();
        }

        if (this.player.body.velocity.y < 0) {
            this.player.anims.play('jump', true);
        } else if (this.player.body.velocity.y > 0) {
            this.player.anims.play('fall', true);
        }
    }
}
