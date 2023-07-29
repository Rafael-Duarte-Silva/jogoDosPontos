function validateForm(){
    let player1Name = document.forms["form"]["player1"].value;
    let player2Name = document.forms["form"]["player2"].value;

    if(player1Name != "" && player2Name != ""){
        document.getElementsByClassName("container-startScreen")[0].classList.add("active");

        startGame(player1Name, player2Name);
        return false;
    }
}