class GameTimer {
  constructor(onUpdate) {
    this.onUpdate = onUpdate; // callback appelé à chaque tick
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.timerInterval = null;
    this.isRunning = false;
  }
  
  start() {
    if (this.isRunning) return; // éviter de redémarrer
    this.startTime = Date.now() - this.elapsedBeforePause * 1000;
    this.timerInterval = setInterval(() => this.update(), 100);
    this.isRunning = true;
  }
  
  pause() {
    if (!this.isRunning) return;
    clearInterval(this.timerInterval);
    this.elapsedBeforePause = Math.floor((Date.now() - this.startTime) / 1000);
    this.isRunning = false;
  }
  
  reset() {
    clearInterval(this.timerInterval);
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.isRunning = false;
    this.onUpdate(0); // notifier reset
  }
  
  update() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.onUpdate(elapsed); // notification externe
  }
}