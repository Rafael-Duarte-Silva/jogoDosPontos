let dots = {
    fill: "black",
    radius: 13,

    amount: {
        columns: 7,
        rows: 7,
    },

    matrix: {
        columns: {},
        rows: {},
    },
}

function drawDots(){
    const distanceBetweenDots = {
        x: Math.floor((canvas.offsetWidth - dots.radius * 2)  / (dots.amount.columns - 1)),
        y: Math.floor((canvas.offsetHeight -  dots.radius * 2)  / (dots.amount.rows - 1)),
    };

    console.log(distanceBetweenDots);

    let positionDotsX = dots.radius;
    let positionDotsY = dots.radius;

    for(let rowsCount = 0; rowsCount < dots.amount.rows; rowsCount++){
        for(let columnsCount = 0; columnsCount < dots.amount.columns; columnsCount++){
            ctx.beginPath();
            ctx.arc(positionDotsX, positionDotsY, dots.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = dots.fill;
            ctx.fill();
            
            dots.matrix.columns[columnsCount] = {
                right: positionDotsX + dots.radius,
                left: positionDotsX - dots.radius,
            };

            positionDotsX += distanceBetweenDots.x;
        }

        dots.matrix.rows[rowsCount] = {
            top: positionDotsY - dots.radius, 
            bottom: positionDotsY + dots.radius,
        };

        positionDotsY += distanceBetweenDots.y;
        positionDotsX = dots.radius;
    }
}