var cmdPressed = false;
window.onkeydown = function(e){
  if(e.keyCode === 91){
    cmdPressed = true;
  }else if(e.keyCode === 69 && cmdPressed){
    chrome.extension.sendMessage({readLater : "www.example.com"}, function(response) {});
  }
};

window.onkeyup = function(e){
  if(e.keyCode === 91){
    cmdPressed = false;
  }
};
