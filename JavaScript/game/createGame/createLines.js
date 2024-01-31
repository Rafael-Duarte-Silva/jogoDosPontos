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