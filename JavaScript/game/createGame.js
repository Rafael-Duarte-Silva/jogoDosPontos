let ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, canvas.width, canvas.height);

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

drawDots();

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

let lines = {
    fill: "rgb(153, 153, 153)",

    matrix: {
        verticals: {
            amount: {
                rows: dots.amount.rows - 1,
                columns: dots.amount.columns,
            },
            rows: {},
            columns: {},
            isClicked: new Array(),
        },

        horizontals: {
            amount: {
                rows: dots.amount.rows,
                columns: dots.amount.columns - 1,
            },
            rows: {},
            columns: {},
            isClicked: new Array(),
        },
    },
}

drawLinesVerticals();
drawLinesHorizontals();

function drawLinesHorizontals(){
    for(let rowsCount = 0; rowsCount < lines.matrix.horizontals.amount.rows; rowsCount++){
        lines.matrix.horizontals.isClicked[rowsCount] = new Array();

        for(let columnsCount = 0; columnsCount < lines.matrix.horizontals.amount.columns; columnsCount++){
            ctx.fillStyle = lines.fill;
            ctx.fillRect(
                dots.matrix.columns[columnsCount].right,
                dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 3,
                dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right,
                dots.radius / 2 + 1,
            );

            lines.matrix.horizontals.rows[columnsCount] = {
                right: dots.matrix.columns[columnsCount + 1].left,
                left: dots.matrix.columns[columnsCount].right,
            }

            lines.matrix.horizontals.isClicked[rowsCount][columnsCount] = false;
        }

        lines.matrix.horizontals.columns[rowsCount] = {
            top: dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 3,
            bottom: dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 3 + dots.radius / 2 + 1,
        };
    }
}

function drawLinesVerticals(){
    for(let rowsCount = 0; rowsCount < lines.matrix.verticals.amount.rows; rowsCount++){
        lines.matrix.verticals.isClicked[rowsCount] = new Array();

        for(let columnsCount = 0; columnsCount < lines.matrix.verticals.amount.columns; columnsCount++){
            ctx.fillStyle = lines.fill;
            ctx.fillRect(
                dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 3,
                dots.matrix.rows[rowsCount].bottom,
                dots.radius / 2 + 1,
                dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom,
            );

            lines.matrix.verticals.rows[columnsCount] = {
                right: dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 3 + dots.radius / 2 + 1,
                left: dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 3,
            };

            lines.matrix.verticals.isClicked[rowsCount][columnsCount] = false;
        }

        lines.matrix.verticals.columns[rowsCount] = {
            top: dots.matrix.rows[rowsCount].bottom,
            bottom: dots.matrix.rows[rowsCount + 1].top,
        };
    }
}

console.log(dots.matrix, lines.matrix);