function runGame(player1Name, player2Name){
    class Player{
        constructor(id, name, color){
            this.id = id;
            this.name = name;
            this.initial = name[0].toUpperCase();
            this.color = color;
            this.points = 0;

            this.playerNameHTML();
        }

        playerNameHTML(){
            document.getElementsByClassName("playerName player" + this.id)[0].innerText = this.name;
        }
    }
    
    const player1 = new Player(1, player1Name, "rgb(223, 57, 57)");
    const player2 = new Player(2, player2Name, "rgb(0, 42, 255)");
    
    let playerCurrent = player1;

    const second = 1000;

    const timeout = second * 15;
    let cooldown = timeout;

    const interval = second / 100;

    const onePercent = timeout / 100;
    let cooldownBar = 100; //%

    const POINTSTOTHEEND = player1.points + player2.points;
    const TOTALPOINTSPOSSIBLE = dots.amount.columns - 1 + dots.amount.rows - 1;
    
    const myInterval = setInterval(() => {
        if(cooldown <= 0){
            if(cooldownBar === 0){
                timeoutRandomClickOnLines();
            }

            if(playerCurrent.id === player1.id){
                console.log("player2");
                player1.points = playerCurrent.points;
                console.log(player1.points);
                playerCurrent = player2;
            }
        
            else if(playerCurrent.id === player2.id){
                console.log("player1");
                player2.points = playerCurrent.points;
                console.log(player2.points);
                playerCurrent = player1;
            }

            if(POINTSTOTHEEND == TOTALPOINTSPOSSIBLE){
                clearInterval(myInterval);
            }

            const $TogglePlayerEffect = () => {
                document.getElementsByClassName("container-players container-player" + player1.id)[0].classList.toggle("active");
                document.getElementsByClassName("container-players container-player" + player2.id)[0].classList.toggle("active");
            }

            $TogglePlayerEffect();

            cooldown = timeout;
        }

        const $cooldownBar = document.getElementsByClassName("cooldown player" + playerCurrent.id)[0];
        $cooldownBar.setAttribute("value", cooldownBar);
        $cooldownBar.innerText = cooldownBar + "%";
        
        cooldown -= interval;
        cooldownBar = cooldown / onePercent;
    }, interval);

    function lineClick(mouseEvent){
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
    
        return [LINES_HORIZONTALS_CLICK, LINES_VERTICALS_CLICK];
    }

    canvas.addEventListener("mousedown", (mouseEvent) => {
        console.log("x: " + mouseEvent.offsetX);
        console.log("y: " + mouseEvent.offsetY);
    
        const [LINES_HORIZONTALS_CLICK, LINES_VERTICALS_CLICK] = lineClick(mouseEvent);
    
        if(LINES_HORIZONTALS_CLICK || LINES_VERTICALS_CLICK){
            cooldown = 0;
        }
    });

    function timeoutRandomClickOnLines(){
        const randomLine = Math.floor(Math.random() * 2);
        let rowsRandom = 0;
        let columnsRandom = 0;
    
        let mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            buttons: 1,
        };
    
        if(randomLine === 0){
            rowsRandom = Math.floor(Math.random() * lines.matrix.verticals.amount.rows);
            columnsRandom = Math.floor(Math.random() * lines.matrix.verticals.amount.columns);
    
            mouseEvent.offsetX = Math.floor(lines.matrix.verticals.rows[rowsRandom].left + 1);
            mouseEvent.offsetY = Math.floor(lines.matrix.verticals.columns[columnsRandom].top + 1);
        }
    
        else{
            rowsRandom = Math.floor(Math.random() * lines.matrix.horizontals.amount.rows);
            columnsRandom = Math.floor(Math.random() * lines.matrix.horizontals.amount.columns);
    
            mouseEvent.offsetX = Math.floor(lines.matrix.horizontals.rows[rowsRandom].left + 1);
            mouseEvent.offsetY = Math.floor(lines.matrix.horizontals.columns[columnsRandom].top + 1);
        }
    
        const [LINES_HORIZONTALS_CLICK, LINES_VERTICALS_CLICK] = lineClick(mouseEvent);
    
        if(LINES_HORIZONTALS_CLICK || LINES_VERTICALS_CLICK){
            cooldown = 0;
        }
    
        else{
            return timeoutRandomClickOnLines();
        }
    }

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
                        lines1.isClicked[rowsCount][columnsCount] = true;
                        drawLine(rowsCount, columnsCount, color);

                        if(scoreUpdate(rowsCount, columnsCount, amountLines, lines1, lines2, direction, color, initial)){
                            playerCurrent.points += 1;
                        } 
                            
                        return true;
                    }
                }
            }
        }
    }

    function scoreUpdate(rowsCount, columnsCount, amountLines, lines1, lines2, direction, color, initial){
        const SCORE = {
            TOP: () => {
                const TOP_MARGIN = rowsCount !== 0;
    
                if(TOP_MARGIN){
                    const LINE_TOP_FILL = lines1.isClicked[rowsCount - 1][columnsCount];
                    const LINE_LEFT_FILL = lines2.isClicked[rowsCount - 1][columnsCount];
                    const LINE_RIGHT_FILL = lines2.isClicked[rowsCount - 1][columnsCount + 1];
    
                    return LINE_TOP_FILL
                    && LINE_LEFT_FILL
                    && LINE_RIGHT_FILL;
                }
            },
    
            BOTTOM: () => {
                const BOTTOM_MARGIN = rowsCount !== amountLines.first - 1;
    
                if(BOTTOM_MARGIN){
                    const LINE_BOTTOM_FILL = lines1.isClicked[rowsCount + 1][columnsCount];
                    const LINE_LEFT_FILL = lines2.isClicked[rowsCount][columnsCount];
                    const LINE_RIGHT_FILL = lines2.isClicked[rowsCount][columnsCount + 1];
    
                    return LINE_BOTTOM_FILL
                    && LINE_LEFT_FILL
                    && LINE_RIGHT_FILL;
                }
            },
    
            LEFT: () => {
                const LEFT_MARGIN = columnsCount !== 0;
    
                if(LEFT_MARGIN){
                    const LINE_LEFT_FILL = lines1.isClicked[rowsCount][columnsCount - 1];
                    const LINE_TOP_FILL = lines2.isClicked[rowsCount][columnsCount - 1];
                    const LINE_BOTTOM_FILL = lines2.isClicked[rowsCount + 1][columnsCount - 1];
    
                    return LINE_LEFT_FILL
                    && LINE_TOP_FILL
                    && LINE_BOTTOM_FILL;
                }
            },
    
            RIGHT: () => {
                const RIGHT_MARGIN = columnsCount !== amountLines.second - 1;
    
                if(RIGHT_MARGIN){
                    const LINE_RIGHT_FILL = lines1.isClicked[rowsCount][columnsCount + 1];
                    const LINE_TOP_FILL = lines2.isClicked[rowsCount][columnsCount];
                    const LINE_BOTTOM_FILL = lines2.isClicked[rowsCount + 1][columnsCount];
    
                    return LINE_RIGHT_FILL
                    && LINE_TOP_FILL
                    && LINE_BOTTOM_FILL;
                }
            },
        }

        let isPoint = false;
    
        switch(direction){
            case "horizontal":
                if(SCORE.TOP()){
                    console.log("preenchida a cima");
                    isPoint = true;
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount - 1].top + (dots.matrix.rows[rowsCount].top - dots.matrix.rows[rowsCount - 1].bottom),
                    );
                }
    
                if(SCORE.BOTTOM()){
                    console.log("preenchida a baixo");
                    isPoint = true;
                    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
                    );
                }
                break;
            case "vertical":
                if(SCORE.LEFT()){
                    console.log("preenchida a esquerda");
                    isPoint = true;
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount - 1].left + (dots.matrix.columns[columnsCount].left - dots.matrix.columns[columnsCount - 1].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
                    );
                }
    
                if(SCORE.RIGHT()){
                    console.log("preenchida a direita");
                    isPoint = true;
    
                    drawInitial(
                        color,
                        initial,
                        dots.matrix.columns[columnsCount].left + (dots.matrix.columns[columnsCount + 1].left - dots.matrix.columns[columnsCount].right) / 2,
                        dots.matrix.rows[rowsCount].top + (dots.matrix.rows[rowsCount + 1].top - dots.matrix.rows[rowsCount].bottom),
                    );
                }
                break;
        }

        if(isPoint){
            return true;
        }
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