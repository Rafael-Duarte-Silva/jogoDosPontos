class Player{
    constructor(id, color){
        this.id = id;
        this.initial = id[0];
        this.color = color;
    }
}

let player1 = new Player("Rafael", "rgb(223, 57, 57)");
let player2 = new Player("Thaynara", "rgb(0, 42, 255)");

let playerCurrent = player1;

setInterval(() => {
    console.log("reniciou o tempo");

    if(playerCurrent.id === player1.id){
        console.log("player1");
        playerCurrent = player2;
    }

    else if(playerCurrent.id === player2.id){
        console.log("player2");
        playerCurrent = player1;
    }
},5000);

canvas.addEventListener("mousedown", (e) => {
    console.log("x: " + e.offsetX);
    console.log("y: " + e.offsetY);

    checkClickOnLines(
        e,
        {
            first: dots.amount.rows,
            second: lines.amount.horizontals,
        },
        lines.matrix.horizontals,
        lines.matrix.verticals,
        "horizontal",
        drawHorizontalsLines,
        playerCurrent.color,
        playerCurrent.initial
    )

    checkClickOnLines(
        e,
        {
            first: lines.amount.verticals,
            second: dots.amount.columns, 
        },
        lines.matrix.verticals,
        lines.matrix.horizontals,
        "vertical",
        drawVerticalsLines,
        playerCurrent.color,
        playerCurrent.initial
    );
});

function checkClickOnLines(e, repeat, obj, obj2, direction, draw, color, initial){
    if(e.buttons === 1){
        for(let rowsCount = 0; rowsCount < repeat.first; rowsCount++){
            for(let columnsCount = 0; columnsCount < repeat.second; columnsCount++){
                if(!obj.isClicked[rowsCount][columnsCount] 
                && e.offsetY < obj.columns[rowsCount].bottom && e.offsetY > obj.columns[rowsCount].top 
                && e.offsetX > obj.rows[columnsCount].left && e.offsetX < obj.rows[columnsCount].right){
                    draw(rowsCount, columnsCount, color);

                    obj.isClicked[rowsCount][columnsCount] = true;

                    scoreUpdate(rowsCount, columnsCount, repeat, obj, obj2, direction, color, initial);
                    return;
                }   
            }
        }
    }

    function scoreUpdate(rowsCount, columnsCount, repeat, obj, obj2, direction, color, initial){
        switch(direction){
            case "horizontal":
                if(rowsCount !== 0
                && obj.isClicked[rowsCount - 1][columnsCount]
                && obj2.isClicked[rowsCount - 1][columnsCount]
                && obj2.isClicked[rowsCount - 1][columnsCount + 1]){
                    console.log("preenchida a cima");
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount - 1].top + (dots.matrix.rows[rowsCount].top - dots.matrix.rows[rowsCount - 1].bottom) * 1.25,
                    );
                }
    
                if(rowsCount !== repeat.first - 1
                && obj.isClicked[rowsCount + 1][columnsCount]
                && obj2.isClicked[rowsCount][columnsCount]
                && obj2.isClicked[rowsCount][columnsCount + 1]){
                    console.log("preenchida a baixo");
                    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom) * 1.25,
                    );
                }
                break;
            case "vertical":
                if(columnsCount !== 0
                && obj.isClicked[rowsCount][columnsCount - 1]
                && obj2.isClicked[rowsCount][columnsCount - 1]
                && obj2.isClicked[rowsCount + 1][columnsCount - 1]){
                    console.log("preenchida a esquerda");
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount - 1].left + (dots.matrix.columns[columnsCount].left - dots.matrix.columns[columnsCount - 1].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom) * 1.25,
                    );
                }
    
                if(columnsCount !== repeat.second - 1
                && obj.isClicked[rowsCount][columnsCount + 1]
                && obj2.isClicked[rowsCount][columnsCount]
                && obj2.isClicked[rowsCount + 1][columnsCount]){
                    console.log("preenchida a direita");
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom) * 1.25,
                    );
                }
                break;
        }

        function drawInitial(color, initial, x, y){
            ctx.fillStyle = color;
            ctx.font = "70px Verdana";
            ctx.fillText(
                initial, 
                x,
                y,
            );
        }
    }
}

function drawVerticalsLines(rowsCount, columnsCount, color){
    ctx.fillStyle = color;
    ctx.fillRect(
        dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 4,
        dots.matrix.rows[rowsCount].bottom,
        dots.radius / 2,
        dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom,
    );
}

function drawHorizontalsLines(rowsCount, columnsCount, color){   
    ctx.fillStyle = color;
    ctx.fillRect(
        dots.matrix.columns[columnsCount].right,
        dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 4,
        dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right,
        dots.radius / 2,
    );
}