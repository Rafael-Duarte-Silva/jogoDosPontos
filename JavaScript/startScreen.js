function validateForm(){
    const player1Name = document.forms["form"]["player1"].value;
    const player2Name = document.forms["form"]["player2"].value;

    if(player1Name != "" && player2Name != ""){
        document.getElementsByClassName("startScreen")[0].classList.add("active");
        document.getElementsByTagName("main")[0].classList.toggle("active");

        runGame(player1Name, player2Name);
        return false;
    }
}