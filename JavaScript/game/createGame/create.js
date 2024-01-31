let ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, canvas.width, canvas.height);

drawDots();
drawLinesVerticals();
drawLinesHorizontals();

console.log(dots.matrix, lines.matrix);