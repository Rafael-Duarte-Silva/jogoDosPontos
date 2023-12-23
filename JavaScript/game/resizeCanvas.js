const canvas = document.getElementsByClassName("game")[0];

resizeCanvastoPointOfView();

function resizeCanvastoPointOfView(){
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
    
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
 
  return false;
}