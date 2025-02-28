export class SoundManager {
  private jumpSound: HTMLAudioElement;
  private coinSound: HTMLAudioElement;
  private hurtSound: HTMLAudioElement;
  private gameOverSound: HTMLAudioElement;
  private levelCompleteSound: HTMLAudioElement;
  private backgroundMusic: HTMLAudioElement;
  private muted: boolean = false;

  constructor() {
    // Create audio elements
    this.jumpSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2622/2622-preview.mp3');
    this.coinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
    this.hurtSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2620/2620-preview.mp3');
    this.gameOverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/3162/3162-preview.mp3');
    this.levelCompleteSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    this.backgroundMusic = new Audio('https://assets.mixkit.co/active_storage/sfx/208/208-preview.mp3');
    
    // Set up background music to loop
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    
    if (muted) {
      this.backgroundMusic.pause();
    } else if (this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(() => {
        console.log('Background music playback prevented by browser');
      });
    }
  }

  public playJumpSound() {
    if (!this.muted) {
      this.jumpSound.currentTime = 0;
      this.jumpSound.play().catch(() => {
        console.log('Jump sound playback prevented by browser');
      });
    }
  }

  public playCoinSound() {
    if (!this.muted) {
      this.coinSound.currentTime = 0;
      this.coinSound.play().catch(() => {
        console.log('Coin sound playback prevented by browser');
      });
    }
  }

  public playHurtSound() {
    if (!this.muted) {
      this.hurtSound.currentTime = 0;
      this.hurtSound.play().catch(() => {
        console.log('Hurt sound playback prevented by browser');
      });
    }
  }

  public playGameOverSound() {
    if (!this.muted) {
      this.gameOverSound.currentTime = 0;
      this.gameOverSound.play().catch(() => {
        console.log('Game over sound playback prevented by browser');
      });
    }
  }

  public playLevelCompleteSound() {
    if (!this.muted) {
      this.levelCompleteSound.currentTime = 0;
      this.levelCompleteSound.play().catch(() => {
        console.log('Level complete sound playback prevented by browser');
      });
    }
  }

  public playBackgroundMusic() {
    if (!this.muted) {
      this.backgroundMusic.play().catch(() => {
        console.log('Background music playback prevented by browser');
      });
    }
  }

  public stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }
}