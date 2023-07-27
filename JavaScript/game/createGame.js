//Talvez mudar nome dos elementos da matrix (x e y).
//Talvez mudar o local da variavel distanceBetweenDots.
//Melhorar o codigo do arquivo mouse-listerner.js.
//Melhorar se a linha está preenchida.
//Trocar rowsCount e columnsCount por columns e rows.
//Atualizar os fills reacts com o left, right, top e bottom dos elementos lines.
//Quarda alguns valores/conta para evitar repetir processos.
//Melhorar a conta que calcula a posição das letras.
//Adicionar width as linhas.
//Fazer player 1 e player 2. Eles poderam colocar seus nomes e a primeira letra(inicial do nome) será usado para preencher os quadrados.


//ver os videos sobre flex e grid e quando usar div, section e tec.

const canvas = document.getElementsByClassName("game")[0];
let ctx = canvas.getContext('2d');

resizeCanvastoPointOfView();
ctx.clearRect(0, 0, canvas.width, canvas.height);

let dots = {
    fill: "black",
    radius: 12,

    margin: {
        top: 45,
        left: 65,
    },

    amount: {
        columns: 7,
        rows: 7,
    },

    matrix: {
        columns: {},
        rows: {},
    },
}

function calculateDistanceBetweenDots(){
    return {
        x: Math.floor(canvas.offsetWidth / dots.amount.columns),
        y: Math.floor(canvas.offsetHeight / dots.amount.rows),
    };
}

drawDots(calculateDistanceBetweenDots());

function drawDots(distanceBetweenDots){
    console.log(distanceBetweenDots);

    let positionDotsX = dots.margin.left;
    let positionDotsY = dots.margin.top;

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
        positionDotsX = dots.margin.left;
    }
}

let lines = {
    fill: "rgb(153, 153, 153)",

    amount: {
        verticals: dots.amount.rows - 1,
        horizontals: dots.amount.columns - 1,
    },

    matrix: {
        verticals: {
            rows: {},
            columns: {},
            isClicked: new Array(),
        },

        horizontals: {
            rows: {},
            columns: {},
            isClicked: new Array(),
        },
    },
}

drawLines();

function drawLines(){
    for(let rowsCount = 0; rowsCount < dots.amount.rows; rowsCount++){
        lines.matrix.horizontals.isClicked[rowsCount] = new Array();

        for(let columnsCount = 0; columnsCount < lines.amount.horizontals; columnsCount++){
            ctx.fillStyle = lines.fill;
            ctx.fillRect(
                dots.matrix.columns[columnsCount].right,
                dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 4,
                dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right,
                dots.radius / 2,
            );

            lines.matrix.horizontals.rows[columnsCount] = {
                right: dots.matrix.columns[columnsCount + 1].left,
                left: dots.matrix.columns[columnsCount].right,
            }

            lines.matrix.horizontals.isClicked[rowsCount][columnsCount] = false;
        }

        lines.matrix.horizontals.columns[rowsCount] = {
            top: dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 4,
            bottom: dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 4 + dots.radius / 2,
        };
    }

    for(let rowsCount = 0; rowsCount < lines.amount.verticals; rowsCount++){
        lines.matrix.verticals.isClicked[rowsCount] = new Array();

        for(let columnsCount = 0; columnsCount < dots.amount.columns; columnsCount++){
            ctx.fillStyle = lines.fill;
            ctx.fillRect(
                dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 4,
                dots.matrix.rows[rowsCount].bottom,
                dots.radius / 2,
                dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom,
            );

            lines.matrix.verticals.rows[columnsCount] = {
                right: dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 4 + dots.radius / 2,
                left: dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 4,
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