class ViewController {
  constructor() {
    this.mode = 'system';
    this.finalDisplay = 0;
    this.prevIdealDisplay = 0;
    this.prevDisplay = 0;
  }


  setPrevIdealDisplay(display) {
    this.prevIdealDisplay = display;
  }

  setPrevDisplay(display) {
    this.prevDisplay = display;
  }

  setFinalDisplay(display) {
    this.finalDisplay = display;
  }

}

export default ViewController;