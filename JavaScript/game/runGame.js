function runGame(player1Name, player2Name){
    class Player{
        constructor(id, name, color){
            this.id = id;
            this.name = name;
            this.initial = name[0].toUpperCase();
            this.color = color;

            this.playerNameHTML();
        }

        playerNameHTML(){
            document.getElementsByClassName("playerName")[this.id].innerText = this.name;
        }
    }
    
    const player1 = new Player(0, player1Name, "rgb(223, 57, 57)");
    const player2 = new Player(1, player2Name, "rgb(0, 42, 255)");
    
    let playerCurrent = player1;

    const second = 1000;

    const timeout = second * 15;
    let cooldown = timeout;

    const interval = second / 100;

    const onePercent = timeout / 100;
    let cooldownBar = 100; //%
    
    setInterval(() => {
        if(cooldown <= 0){
            if(playerCurrent.id === player1.id){
                console.log("player1");
                playerCurrent = player2;
            }
        
            else if(playerCurrent.id === player2.id){
                console.log("player2");
                playerCurrent = player1;
            }

            const $TogglePlayerEffect = () => {
                document.getElementsByClassName("container-players")[player1.id].classList.toggle("active");
                document.getElementsByClassName("container-players")[player2.id].classList.toggle("active");
            }

            $TogglePlayerEffect();

            cooldown = timeout;
        }

        const $cooldownBar = document.getElementsByClassName("cooldown")[playerCurrent.id];
        $cooldownBar.setAttribute("value", cooldownBar);
        $cooldownBar.innerText = cooldownBar + "%";
        
        cooldown -= interval;
        cooldownBar = cooldown / onePercent;
    }, interval);
    
    canvas.addEventListener("mousedown", (mouseEvent) => {
        console.log("x: " + mouseEvent.offsetX);
        console.log("y: " + mouseEvent.offsetY);

        const LINES_HORIZONTALS_CLICK = checkClickOnLines
        ({
            mouseEvent: mouseEvent,
            amountLines: {
                first: lines.matrix.horizontals.amount.rows,
                second: lines.matrix.horizontals.amount.columns,
            },
            lines1: lines.matrix.horizontals,
            lines2: lines.matrix.verticals,
            direction: "horizontal",
            drawLine: drawHorizontalsLines,
            color: playerCurrent.color,
            initial: playerCurrent.initial
        });

        const LINES_VERTICALS_CLICK = checkClickOnLines
        ({
            mouseEvent: mouseEvent,
            amountLines: {
                first: lines.matrix.verticals.amount.rows,
                second: lines.matrix.verticals.amount.columns,
            },
            lines1: lines.matrix.verticals,
            lines2: lines.matrix.horizontals,
            direction: "vertical",
            drawLine: drawVerticalsLines,
            color: playerCurrent.color,
            initial: playerCurrent.initial
        });

        if(LINES_HORIZONTALS_CLICK || LINES_VERTICALS_CLICK){
            cooldown = 0;
        }
    });
    
    function checkClickOnLines({mouseEvent, amountLines, lines1, lines2, direction, drawLine, color, initial}){
        const MOUSE_RIGHT_CLICK = mouseEvent.buttons === 1;

        if(MOUSE_RIGHT_CLICK){
            for(let rowsCount = 0; rowsCount < amountLines.first; rowsCount++){
                for(let columnsCount = 0; columnsCount < amountLines.second; columnsCount++){
                    const LINE_CLICK = () => {
                        const LINE_NOT_CLICK = !lines1.isClicked[rowsCount][columnsCount];
                        const MOUSE_CLICK_OVER_LINE_Y = mouseEvent.offsetY < lines1.columns[rowsCount].bottom && mouseEvent.offsetY > lines1.columns[rowsCount].top;
                        const MOUSE_CLICK_OVER_LINE_X = mouseEvent.offsetX > lines1.rows[columnsCount].left && mouseEvent.offsetX < lines1.rows[columnsCount].right;

                        return LINE_NOT_CLICK
                        && MOUSE_CLICK_OVER_LINE_Y
                        && MOUSE_CLICK_OVER_LINE_X;
                    }
                    if(LINE_CLICK()){
                        drawLine(rowsCount, columnsCount, color);
    
                        lines1.isClicked[rowsCount][columnsCount] = true;

                        scoreUpdate(rowsCount, columnsCount, amountLines, lines1, lines2, direction, color, initial);
                        
                        return true;
                    }
                }
            }
        }
    
        function scoreUpdate(rowsCount, columnsCount, amountLines, lines1, lines2, direction, color, initial){
            switch(direction){
                case "horizontal":
                    const SCORE_TOP = () => {
                        const TOP_MARGIN = rowsCount !== 0;
                        if(TOP_MARGIN){
                            const LINE_TOP_FILL = lines1.isClicked[rowsCount - 1][columnsCount];
                            const LINE_LEFT_FILL = lines2.isClicked[rowsCount - 1][columnsCount];
                            const LINE_RIGHT_FILL = lines2.isClicked[rowsCount - 1][columnsCount + 1];

                            return LINE_TOP_FILL
                            && LINE_LEFT_FILL
                            && LINE_RIGHT_FILL;
                        }
                    }

                    if(SCORE_TOP()){
                        console.log("preenchida a cima");
        
                        drawInitial(
                            color,
                            initial,
                            dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                            dots.matrix.rows[rowsCount - 1].top + (dots.matrix.rows[rowsCount].top - dots.matrix.rows[rowsCount - 1].bottom),
                        );
                    }
                    
                    const SCORE_BOTTOM = () => {
                        const BOTTOM_MARGIN = rowsCount !== amountLines.first - 1;
                        if(BOTTOM_MARGIN){
                            const LINE_BOTTOM_FILL = lines1.isClicked[rowsCount + 1][columnsCount];
                            const LINE_LEFT_FILL = lines2.isClicked[rowsCount][columnsCount];
                            const LINE_RIGHT_FILL = lines2.isClicked[rowsCount][columnsCount + 1];

                            return LINE_BOTTOM_FILL
                            && LINE_LEFT_FILL
                            && LINE_RIGHT_FILL;
                        }
                    }

                    if(SCORE_BOTTOM()){
                        console.log("preenchida a baixo");
                        
                        drawInitial(
                            color,
                            initial,
                            dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                            dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
                        );
                    }
                    break;
                case "vertical":    
                    const SCORE_LEFT = () => {
                        const LEFT_MARGIN = columnsCount !== 0;
                        if(LEFT_MARGIN){
                            const LINE_LEFT_FILL = lines1.isClicked[rowsCount][columnsCount - 1];
                            const LINE_TOP_FILL = lines2.isClicked[rowsCount][columnsCount - 1];
                            const LINE_BOTTOM_FILL = lines2.isClicked[rowsCount + 1][columnsCount - 1];

                            return LINE_LEFT_FILL
                            && LINE_TOP_FILL
                            && LINE_BOTTOM_FILL;
                        }
                    }

                    if(SCORE_LEFT()){
                        console.log("preenchida a esquerda");
        
                        drawInitial(
                            color,
                            initial,
                            dots.matrix.columns[columnsCount - 1].left + (dots.matrix.columns[columnsCount].left - dots.matrix.columns[columnsCount - 1].right) / 2,
                            dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
                        );
                    }

                    const SCORE_RIGHT = () => {
                        const RIGHT_MARGIN = columnsCount !== amountLines.second - 1;
                        if(RIGHT_MARGIN){
                            const LINE_RIGHT_FILL = lines1.isClicked[rowsCount][columnsCount + 1];
                            const LINE_TOP_FILL = lines2.isClicked[rowsCount][columnsCount];
                            const LINE_BOTTOM_FILL = lines2.isClicked[rowsCount + 1][columnsCount];

                            return LINE_RIGHT_FILL
                            && LINE_TOP_FILL
                            && LINE_BOTTOM_FILL;
                        }
                    }
        
                    if(SCORE_RIGHT()){
                        console.log("preenchida a direita");
        
                        drawInitial(
                            color,
                            initial,
                            dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                            dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
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
            dots.matrix.columns[columnsCount].left + dots.radius - dots.radius / 3,
            dots.matrix.rows[rowsCount].bottom,
            dots.radius / 2 + 1,
            dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom,
        );
    }
    
    function drawHorizontalsLines(rowsCount, columnsCount, color){   
        ctx.fillStyle = color;
        ctx.fillRect(
            dots.matrix.columns[columnsCount].right,
            dots.matrix.rows[rowsCount].top + dots.radius - dots.radius / 3,
            dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right,
            dots.radius / 2 + 1,
        );
    }
}