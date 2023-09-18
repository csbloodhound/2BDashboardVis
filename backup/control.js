class ViewController {
    constructor() {
      this.mode = 'system';
      this.finalDisplay = undefined;
      this.prevDisplay = undefined;
    }
  
    modeSwitch(shown, choice="confirm") {
      if (shown){
          if (choice == "confirm") {
              this.mode = 'system';
          } 
          if (choice == "cancel") {
              this.mode = 'user';
          }
      } else {
          this.mode = 'system';
      }
    }
  
    setPrevDisplay(display) {
      if (this.mode == "system"){
        this.prevDisplay = display;
      }
    }
  
    setFinalDisplay(display) {
      if (this.mode == 'system') {
          this.finalDisplay = display;
      }
      if (this.mode == 'user') {
          this.finalDisplay = this.prevDisplay;
      }
    }
  
  }
  
  export default ViewController;