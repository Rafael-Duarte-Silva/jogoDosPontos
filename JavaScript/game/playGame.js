function startGame(player1Name, player2Name){
    class Player{
        constructor(id, name, color){
            this.id = id;
            this.name = name;
            this.initial = name[0].toUpperCase();
            this.color = color;

            this.innerText();
        }

        innerText(){
            document.getElementsByClassName("playerName")[this.id].innerText = this.name;
        }
    }
    
    let player1 = new Player(0, player1Name, "rgb(223, 57, 57)");
    let player2 = new Player(1, player2Name, "rgb(0, 42, 255)");
    
    let playerCurrent = player1;
    let timeout = 15000;
    let cooldown = timeout;

    let interval = 1000 / 100;
    let onePercent = timeout / 100;
    let percentage = 0;
    
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

            document.getElementsByClassName("container-players")[player1.id].classList.toggle("active");
            document.getElementsByClassName("container-players")[player2.id].classList.toggle("active");

            cooldown = timeout;
        }

        document.getElementsByClassName("cooldown")[playerCurrent.id].setAttribute("value", percentage);
        document.getElementsByClassName("cooldown")[playerCurrent.id].innerText = percentage + "%";
        
        cooldown -= interval;
        percentage = cooldown / onePercent;
    }, interval);
    
    canvas.addEventListener("mousedown", (e) => {
        console.log("x: " + e.offsetX);
        console.log("y: " + e.offsetY);

        if(
            checkClickOnLines({
                e: e,
                repeat: {
                    first: dots.amount.rows,
                    second: lines.amount.horizontals,
                },
                obj: lines.matrix.horizontals,
                obj2: lines.matrix.verticals,
                direction: "horizontal",
                draw: drawHorizontalsLines,
                color: playerCurrent.color,
                initial: playerCurrent.initial
            })
        ||
            checkClickOnLines({
                e: e,
                repeat: {
                    first: lines.amount.verticals,
                    second: dots.amount.columns, 
                },
                obj: lines.matrix.verticals,
                obj2: lines.matrix.horizontals,
                direction: "vertical",
                draw: drawVerticalsLines,
                color: playerCurrent.color,
                initial: playerCurrent.initial
            })
        ){
            cooldown = 0;
        }
        
    });
    
    function checkClickOnLines({e, repeat, obj, obj2, direction, draw, color, initial}){
        if(e.buttons === 1){
            for(let rowsCount = 0; rowsCount < repeat.first; rowsCount++){
                for(let columnsCount = 0; columnsCount < repeat.second; columnsCount++){
                    if(!obj.isClicked[rowsCount][columnsCount] 
                    && e.offsetY < obj.columns[rowsCount].bottom && e.offsetY > obj.columns[rowsCount].top 
                    && e.offsetX > obj.rows[columnsCount].left && e.offsetX < obj.rows[columnsCount].right){
                        draw(rowsCount, columnsCount, color);
    
                        obj.isClicked[rowsCount][columnsCount] = true;

                        scoreUpdate(rowsCount, columnsCount, repeat, obj, obj2, direction, color, initial);
                        
                        return true;
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