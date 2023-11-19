/* Készítette: Dienes Ádám - i93ajy */
/* Webprogramozás: JavaScript beadandó */

const controlsDiv = document.querySelector('div#holder')
const playersInput = document.querySelector('#players')
const cardsInput = document.querySelector('#cards')
const startButton = document.querySelector('#start')
const helpButton = document.querySelector('#help')
const controls = document.querySelector('#controls')
const resetButton = document.querySelector('#reset')
const errorSpan = document.querySelector('#error')
const descSpan = document.querySelector('#desc')
const result = document.querySelector('#result')
const table = document.querySelector('table')
const tableholder = document.querySelector('#tableholder')
const figureHolder = document.querySelector('#figureHolder')
const stats = document.querySelector('#stats')
const rotateButton = document.querySelector('#rotate')
const savedGameHolder = document.querySelector('#savedGame')
const saveButton = document.querySelector('#save')
const deleteButton = document.querySelector('#delete')
const loadButton = document.querySelector('#load')
const actualitem = document.querySelector('#actualitem')
const holderItem = document.querySelector('#holderItem')
const leftovercell = document.querySelector('#leftovercell')
const actualPlayer = document.querySelector('#actualPlayer')
const credit = document.querySelector('#credit')

const left1 = document.querySelector('#left1')
const left2 = document.querySelector('#left2')
const left3 = document.querySelector('#left3')
const right1 = document.querySelector('#right1')
const right2 = document.querySelector('#right2')
const right3 = document.querySelector('#right3')
const up1 = document.querySelector('#up1')
const up2 = document.querySelector('#up2')
const up3 = document.querySelector('#up3')
const down1 = document.querySelector('#down1')
const down2 = document.querySelector('#down2')
const down3 = document.querySelector('#down3')

//let
let angles = [0, 90, 180, 270]
let playerDiamonds = [0, 0, 0, 0] //achieved diamonds by players
let cells = ["egyenes", "harmas", "kanyar"]
let playerIcon = ["blue", "red", "magenta", "green"]
let rotateOption = ["rotate0", "rotate90", "rotate180", "rotate270"]

let angle, className, random, random2, imgUrl, nrEgyenes, nrHarmas, nrKanyar, tmp, tmp2, rowfix, colfix, previousCell
let leftCell, rightCell, upCell, downCell
let actualPlayerIndex = 0
leftCell = rightCell = upCell = downCell = null
let remaningCells = [] 
let bgimg = null
let actualRotate = "rotate0"
let rotateIndex = 0
let firstStep = true

//start screen - nr. of players
function displayFigures(){
    figureHolder.innerHTML = ""
    let x = playersInput.valueAsNumber
    if (x > 4 || x <= 0){
        errorSpan.classList.remove("hidden")
        errorSpan.innerHTML = "Helytelen játékosok száma! <br>Maximum: 4 megengedett. "
        return
    }
    for (let i = 0; i < x; i++){
        errorSpan.innerHTML = ""
        errorSpan.classList.add("hidden")
        iconUrl = "<img src='img/player_" + playerIcon[i] + ".png' width='25'>"
        figureHolder.innerHTML += iconUrl
    }           
}

//start screen - help
helpButton.addEventListener('click', function(){
    descSpan.classList.toggle("hidden")
})

//stats of players
function statsRefresh(){
    stats.innerHTML = "<p><b>Játékosok adatai</b></p>"
    let x = playersInput.valueAsNumber
    let c = cardsInput.valueAsNumber
    for (let i = 0; i < x; i++){
        iconUrl = "<img src='img/player_" + playerIcon[i] + ".png' width='25'> Kincskártyák: " + c + "/" + playerDiamonds[i]
        if (playerDiamonds[i] == c && atStartPos(i)){
            alert("Játék vége. Nyert: " + playerIcon[i] + " játékos!")
            resetGameplay()
        }
        stats.innerHTML += iconUrl
    }   
}

//checking winner is at start pos.
function atStartPos(player){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            let htmlstring = cell.innerHTML.substring(10).slice(0, -13); 
            let acutalPlayerImg = "img/player_" + playerIcon[player] + ".png"  
            if (player == 0 && htmlstring == acutalPlayerImg && i == 0 && j == 0){ return true }      
            if (player == 1 && htmlstring == acutalPlayerImg && i == 0 && j == 6){ return true }   
            if (player == 2 && htmlstring == acutalPlayerImg && i == 6 && j == 0){ return true }
            if (player == 3 && htmlstring == acutalPlayerImg && i == 6 && j == 6){ return true }
        }
    }
    return false
}

//save game
saveButton.addEventListener('click', saveGame)
function saveGame(){
    localStorage.setItem("table", JSON.stringify(table))
    localStorage.setItem("actualPlayerIndex", actualPlayerIndex)
    localStorage.setItem("bgimg", bgimg)
    alert("Sikeres mentés!")
}

//has saved game
hasSavedGame()
function hasSavedGame(){    
    if (localStorage.length == 0){ savedGameHolder.classList.add("hidden") } 
    else { savedGameHolder.classList.remove("hidden") }
}

//load game
loadButton.addEventListener('click', loadGame)
function loadGame(){
    let savedtable = localStorage.getItem("table")
    let obj = JSON.parse(savedtable);
    console.log('Saved table: ', obj)
}

//delete saved game 
deleteButton.addEventListener('click', deleteGame)
function deleteGame(){
    localStorage.clear()
    hasSavedGame()
}

//actual player
function acutalPlayerRefresh(){
    let x = playersInput.valueAsNumber
    actualPlayer.innerHTML = "Aktuális játékos: <img src='img/player_" + playerIcon[actualPlayerIndex] + ".png' width='25'>"
    actualPlayerIndex++
    if (actualPlayerIndex >= x) { actualPlayerIndex = 0 }
}

//leftover element
function actualitemRefresh(){
    let tmpImg = bgimg.substring(5).slice(0, -2);
    actualitem.className = ""
    if (tmpImg == "img/harmas.jpg"){
        actualitem.innerHTML = "<img src='img/harmas.jpg' class='rotateImg' width='50'>" 
        actualitem.className += actualRotate 
    }
    if (tmpImg == "img/egyenes.jpg"){
        actualitem.innerHTML = "<img src='img/egyenes.jpg' class='rotateImg' width='50'>" 
        actualitem.className += actualRotate   
    } 
    if (tmpImg == "img/kanyar.jpg"){
        actualitem.innerHTML = "<img src='img/kanyar.jpg' class='rotateImg' width='50'>" 
        actualitem.className += actualRotate 
    }
}

//rotate of the leftover element
rotateButton.addEventListener('click', calcRotate)
function calcRotate(){
        rotateIndex++
        if (rotateIndex > 3){ rotateIndex = 0 }          
        actualRotate = rotateOption[rotateIndex]    
        actualitemRefresh()
}

//game reset
resetButton.addEventListener('click', resetGameplay)
function resetGameplay(){
    table.classList.add("hidden")
    tableholder.classList.add("hidden")
    controls.classList.add("hidden")
    stats.classList.add("hidden")
    actualitem.classList.add("hidden")
    actualPlayer.classList.add("hidden")
    holderItem.classList.add("hidden")
    leftovercell.classList.add("hidden")
    credit.classList.remove("hidden")
    controlsDiv.style.display = 'block'
    errorSpan.classList.add("hidden")

    table.innerHTML = "";
    playerDiamonds = [0, 0, 0, 0]
    actualPlayerIndex = 0
    leftCell = rightCell = upCell = downCell = null
    remaningCells = [] 
    bgimg = null
    actualRotate = "rotate0"
    rotateIndex = 0
    firstStep = true
    hasSavedGame()
}

//game start
startButton.addEventListener('click', function(){
    let n = playersInput.valueAsNumber
    let c = cardsInput.valueAsNumber
   
    if (c <= 24 / n && c > 0){
        controls.classList.remove("hidden")
        descSpan.classList.add("hidden")
        controls.classList.remove("hidden")
        tableholder.classList.remove("hidden")
        stats.classList.remove("hidden")
        actualitem.classList.remove("hidden")
        holderItem.classList.remove("hidden")
        leftovercell.classList.remove("hidden")
        actualPlayer.classList.remove("hidden")
        table.classList.remove("hidden")
        credit.classList.add("hidden")
        actualPlayerIndex = 0
        generateTable(7)
        controlsDiv.style.display = 'none'
        t1 = performance.now()
    } else {
        errorSpan.classList.remove("hidden")
        errorSpan.innerHTML = "Helytelen kincskártya száma játékosonként! <br>Maximum: (24 / játékosok száma) megengedett."
    }
})

//init game table
function generateTable(n){
    table.innerHTML = ''
    let angle = 0
    nrEgyenes = 0
    nrHarmas = 0 
    let numberOfPlayers = playersInput.valueAsNumber
    let c = cardsInput.valueAsNumber
    let playerCounter = 0
    nrKanyar = 0
    remainingPlaces()
    statsRefresh()
    acutalPlayerRefresh()

    for (let i = 0; i < n; i++){
        let tr = document.createElement('tr')
        for (let j = 0; j < n; j++){
            random = Math.floor(Math.random() * 4);
            angle = angles[random]
            let td = document.createElement('td')
            tr.appendChild(td)

            if (i % 2 == 0 && j % 2 == 0) td.classList.add("fix")
            if (td.classList.contains("fix")){
                if (i == 0 && j == 0 || i == 6 && j == 6 || i == 0 && j == 6 || i == 6 && j == 0){
                    td.classList.add("player")
                    if (playerCounter < numberOfPlayers){
                        iconUrl = "<img src='img/player_" + playerIcon[playerCounter] + ".png' width='25'>"
                        td.innerHTML = iconUrl
                        playerCounter++
                    }
                    td.style.backgroundImage = "url('img/kanyar.jpg')"
                    angle = 0
                    if (i == 6 && j == 6 ){angle = 180}
                    if (i == 0 && j == 6 ){angle = 90}
                    if (i == 6 && j == 0 ){angle = 270}
                } else {
                    td.style.backgroundImage = "url('img/harmas.jpg')"
                    if (i == 0 && j == 2 || i == 0 && j == 4 || i == 2 && j == 4){angle = 90}
                    if (i == 2 && j == 0 || i == 4 && j == 0 || i == 2 && j == 2){angle = 0}
                    if (i == 2 && j == 6 || i == 4 && j == 6 || i == 4 && j == 4){angle = 180}
                    if (i == 6 && j == 2 || i == 6 && j == 4 || i == 4 && j == 2){angle = 270}
                }      
            } else {
                switch (remaningCells[0]){
                    case "egyenes":
                        imgUrl = "url('img/egyenes.jpg')"
                        break
                    case "kanyar":
                        imgUrl = "url('img/kanyar.jpg')"
                        break
                    case "harmas":
                        imgUrl = "url('img/harmas.jpg')"
                        break
                }   
                remaningCells.shift()            
                td.style.backgroundImage = imgUrl
            }            
            className = "rotate" + angle;
            td.classList.add(className)
        }
        table.appendChild(tr)  
    }
    placeDiamond(numberOfPlayers)
    leftoverCell()
    actualitemRefresh()
}

//random last cell
function leftoverCell(){
    switch (remaningCells[0]){
        case "egyenes":
            bgimg = "url('img/egyenes.jpg')"
            break
        case "kanyar":
            bgimg = "url('img/kanyar.jpg')"
            break
        case "harmas":
            bgimg = "url('img/harmas.jpg')"
            break
    }   
}

//fill table w/ random cells
function remainingPlaces(){
    let remaningEgyeness = Array(13).fill("egyenes")
    let remaningKanyar = Array(15).fill("kanyar")
    let remaningHarmas = Array(6).fill("harmas")
    remaningCells = remaningEgyeness.concat(remaningKanyar, remaningHarmas)

    for (let i = remaningCells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random()*(i+1))
        let temp = remaningCells[i]
        remaningCells[i] = remaningCells[j]
        remaningCells[j] = temp
    }
}

//init diamonds on random pos.
function placeDiamond(numberOfPlayers){
    let counter = 0
    while (counter < numberOfPlayers){
        let randomx = Math.floor(Math.random() * 7)
        let randomy = Math.floor(Math.random() * 7)
        for (let i = 0, row; row = table.rows[i]; i++){
            for (let j = 0, col; col = row.cells[j]; j++){
                let cell = table.rows[i].cells[j]
                if (!cell.classList.contains("diamond") && !cell.classList.contains("player") && cell.innerHTML == "" && i == randomx && j == randomy){
                    iconUrl = "<img src='img/diamond_" + playerIcon[counter] + ".png' width='25'>"
                    cell.classList.add("diamond")
                    cell.innerHTML = iconUrl
                    counter++
                }   
            }  
        }
    }
}

//place diamond after the prev. is achieved
function placeNewDiamond(playerNumber){
    let c = cardsInput.valueAsNumber
    if (c == playerDiamonds[playerNumber] + 1 ){ return }
    let randomx = Math.floor(Math.random() * 7)
    let randomy = Math.floor(Math.random() * 7)
    for (let i = 0, row; row = table.rows[i]; i++){
        for (let j = 0, col; col = row.cells[j]; j++){
            let cell = table.rows[i].cells[j]
            if (i == randomx && j == randomy){
                if (cell.innerHTML == "" && !cell.classList.contains("player")){
                iconUrl = "<img src='img/diamond_" + playerIcon[playerNumber] + ".png' width='25'>"
                cell.classList.add("diamond")
                cell.innerHTML = iconUrl
                } else { placeNewDiamond(playerNumber) }
            } 
        }  
    }
}

//shiftbuttons
right1.addEventListener('click', function(){ shiftRight(1), resetDisabled(), left1.disabled = true; })
right2.addEventListener('click', function(){ shiftRight(3), resetDisabled(), left2.disabled = true; })
right3.addEventListener('click', function(){ shiftRight(5), resetDisabled(), left3.disabled = true; })

function shiftRight(rowId){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (i == rowId){
                tmpCell = cell.style.backgroundImage
                tmpClass = cell.className
                cell.className = ""
                if (j == 0){ 
                    cell.style.backgroundImage = bgimg    
                    cell.className += actualRotate   
                } else {
                    cell.style.backgroundImage = tmp
                    cell.className += tmp2
                }                         
                tmp = tmpCell
                tmp2 = tmpClass
                bgimg = tmpCell
                actualitemRefresh()
            }            
        }
    }
    rotateIndex = 0
    calcRotate()
    resetPreviousCells()   
}

left1.addEventListener('click', function(){ shiftLeft(1), resetDisabled(), right1.disabled = true; })
left2.addEventListener('click', function(){ shiftLeft(3), resetDisabled(), right2.disabled = true; })
left3.addEventListener('click', function(){ shiftLeft(5), resetDisabled(), right3.disabled = true; })

function shiftLeft(rowId){
    for (let i = table.rows.length-1, row; row = table.rows[i]; i--) {
        for (let j = table.rows.length-1, col; col = row.cells[j]; j--) {
            let cell = table.rows[j].cells[i]        
            if (j == rowId){                
                tmpCell = cell.style.backgroundImage
                tmpClass = cell.className
                cell.className = ""
                if (i == 6){ 
                    cell.style.backgroundImage = bgimg   
                    cell.className += actualRotate           
                } else {
                    cell.style.backgroundImage = tmp
                    cell.className += tmp2
                }                         
                tmp = tmpCell
                tmp2 = tmpClass
                bgimg = tmpCell
                actualitemRefresh()
            }            
        }
   
    }
    rotateIndex = 0
    calcRotate()
    resetPreviousCells()   
}

down1.addEventListener('click', function(){ shiftDown(1), resetDisabled(), up1.disabled = true; })
down2.addEventListener('click', function(){ shiftDown(3), resetDisabled(), up2.disabled = true;  })
down3.addEventListener('click', function(){ shiftDown(5), resetDisabled(), up3.disabled = true;  })

function shiftDown(colId){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (j == colId){
                tmpCell = cell.style.backgroundImage
                tmpClass = cell.className
                cell.className = ""
                if (i == 0){ 
                    cell.style.backgroundImage = bgimg
                    cell.className += actualRotate                    
                } else {
                    cell.style.backgroundImage = tmp
                    cell.className += tmp2
                }                         
                tmp = tmpCell
                tmp2 = tmpClass
                bgimg = tmpCell
                actualitemRefresh()
            }            
        }
    }
    rotateIndex = 0
    calcRotate()
    resetPreviousCells()       
}

up1.addEventListener('click', function(){ shiftUp(1), resetDisabled(), down1.disabled = true; })
up2.addEventListener('click', function(){ shiftUp(3), resetDisabled(), down2.disabled = true;  })
up3.addEventListener('click', function(){ shiftUp(5), resetDisabled(), down3.disabled = true;  })

function shiftUp(colId){
    for (let i = table.rows.length-1, row; row = table.rows[i]; i--) {
        for (let j = table.rows.length-1, col; col = row.cells[j]; j--) {
            let cell = table.rows[j].cells[i]        
            if (i == colId){                
                tmpCell = cell.style.backgroundImage
                tmpClass = cell.className
                cell.className = ""
                if (j == 6){ 
                    cell.style.backgroundImage = bgimg 
                    cell.className += actualRotate            
                } else {
                    cell.style.backgroundImage = tmp
                    cell.className += tmp2
                }                         
                tmp = tmpCell
                tmp2 = tmpClass
                bgimg = tmpCell
                actualitemRefresh()
            }            
        }
    }
    rotateIndex = 0
    calcRotate()
    resetPreviousCells()   
}

//reset disabled buttons
function resetDisabled(){
    down1.disabled = false;
    down2.disabled = false;
    down3.disabled = false;

    up1.disabled = false;
    up2.disabled = false;
    up3.disabled = false;

    right1.disabled = false;
    right2.disabled = false;
    right3.disabled = false;

    left1.disabled = false;
    left2.disabled = false;
    left3.disabled = false;    
}

//table click - moving players
delegate(table, 'click', 'td', function(){
    let row = this.parentElement.rowIndex
    let col = this.cellIndex
    let cell = table.rows[row].cells[col]

    if (firstStep){
        let diamondString = cell.innerHTML.substring(10).slice(0, -13);
        if (cell.innerHTML == "" || diamondString == "img/diamond_blue.png" || diamondString == "img/diamond_red.png" || diamondString == "img/diamond_magenta.png" || diamondString == "img/diamond_green.png") { return }
        
        let tmpImg = cell.style.backgroundImage.substring(5).slice(0, -2);
        if (tmpImg == "img/egyenes.jpg"){
            if (cell.classList.contains("rotate90") || cell.classList.contains("rotate270")){
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
            } 
            if (cell.classList.contains("rotate0") || cell.classList.contains("rotate180")){
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
            } 
        }

        if (tmpImg == "img/harmas.jpg"){
            if (cell.classList.contains("rotate0")){
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate90")){
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate180")){
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate270")){
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
            }
        } 
        if (tmpImg == "img/kanyar.jpg"){
            if (cell.classList.contains("rotate0")){
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate90")){
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
                if (validDown(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate180")){
                if (validLeft(row, col)){ cell.style.opacity = 0.2 }
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
            }
            if (cell.classList.contains("rotate270")){
                if (validRight(row, col)){ cell.style.opacity = 0.2 }
                if (validUp(row, col)){ cell.style.opacity = 0.2 }
            }
        }
        cell.style.opacity = 0.2
        previousCell = cell
        firstStep = false
    } else {
        if (cell.style.opacity == 0.2){
            if (cell == previousCell){
                console.log("Helyben maradt.")
            } else {        
            // ["blue", "red", "magenta", "green"] 
            let htmlstring = cell.innerHTML.substring(10).slice(0, -13);
            if (htmlstring == "img/diamond_blue.png"){
                placeNewDiamond(0)
                let tmp = playerDiamonds[0]
                playerDiamonds[0] = ++tmp
            }
            if (htmlstring == "img/diamond_red.png"){
                placeNewDiamond(1)
                let tmp = playerDiamonds[1]
                playerDiamonds[1] = ++tmp
            }
            if (htmlstring == "img/diamond_magenta.png"){
                placeNewDiamond(2)
                let tmp = playerDiamonds[2]
                playerDiamonds[2] = ++tmp
            }
            if (htmlstring == "img/diamond_green.png"){
                placeNewDiamond(3)
                let tmp = playerDiamonds[3]
                playerDiamonds[3] = ++tmp
            }
            cell.innerHTML = previousCell.innerHTML
            previousCell.innerHTML = ""
            }
            acutalPlayerRefresh() 
            statsRefresh()
        }
        resetPreviousCells()    
    }
})

//background reset of cells after step
function resetPreviousCells(){
    if (rightCell != null ){ rightCell.style.opacity = 1 }
    if (downCell != null ){ downCell.style.opacity = 1 }
    if (upCell != null ){ upCell.style.opacity = 1 }
    if (leftCell != null ){ leftCell.style.opacity = 1 }
    if (previousCell != null ) { previousCell.style.opacity = 1 }

    firstStep = true
}

function validDown(rowfix, colfix){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (i == rowfix+1 && j == colfix){
                let htmlstring = cell.innerHTML.substring(10).slice(0, -13);                
                if (htmlstring == "img/player_blue.png" || htmlstring == "img/player_red.png" || htmlstring == "img/player_magenta.png" || htmlstring == "img/player_green.png"){
                    return false
                }

                let nextCell = cell.style.backgroundImage.substring(5).slice(0, -2);
                if (nextCell == "img/egyenes.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    downCell = cell
                    return true
                } 
                if (nextCell == "img/harmas.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate270") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    downCell = cell
                    return true
                }            
                if (nextCell == "img/kanyar.jpg" && (cell.classList.contains("rotate270") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    downCell = cell
                    return true
                }               
            }
        }
    }
    return false;
}

function validUp(rowfix, colfix){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (i == rowfix-1 && j == colfix){
                let htmlstring = cell.innerHTML.substring(10).slice(0, -13);                
                if (htmlstring == "img/player_blue.png" || htmlstring == "img/player_red.png" || htmlstring == "img/player_magenta.png" || htmlstring == "img/player_green.png"){
                    return false
                }

                let nextCell = cell.style.backgroundImage.substring(5).slice(0, -2);
                if (nextCell == "img/egyenes.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    upCell = cell
                    return true
                } 
                if (nextCell == "img/harmas.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate90") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    upCell = cell
                    return true
                }            
                if (nextCell == "img/kanyar.jpg" && (cell.classList.contains("rotate90") || cell.classList.contains("rotate0"))){
                    cell.style.opacity = 0.2
                    upCell = cell
                    return true
                }               
            }
        }
    }
    return false;
}

function validRight(rowfix, colfix){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (i == rowfix && j == colfix+1){
                let htmlstring = cell.innerHTML.substring(10).slice(0, -13);                
                if (htmlstring == "img/player_blue.png" || htmlstring == "img/player_red.png" || htmlstring == "img/player_magenta.png" || htmlstring == "img/player_green.png"){
                    return false
                }

                let nextCell = cell.style.backgroundImage.substring(5).slice(0, -2);
                if (nextCell == "img/egyenes.jpg" && (cell.classList.contains("rotate90") || cell.classList.contains("rotate270"))){
                    cell.style.opacity = 0.2
                    rightCell = cell
                    return true
                } 
                if (nextCell == "img/harmas.jpg" && (cell.classList.contains("rotate180") || cell.classList.contains("rotate90") || cell.classList.contains("rotate270"))){
                    cell.style.opacity = 0.2
                    rightCell = cell
                    return true
                }            
                if (nextCell == "img/kanyar.jpg" && (cell.classList.contains("rotate90") || cell.classList.contains("rotate180"))){
                    cell.style.opacity = 0.2
                    rightCell = cell
                    return true
                }               
            }
        }
    }
    return false;
}

function validLeft(rowfix, colfix){
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            let cell = table.rows[i].cells[j]
            if (i == rowfix && j == colfix-1){
                let htmlstring = cell.innerHTML.substring(10).slice(0, -13);                
                if (htmlstring == "img/player_blue.png" || htmlstring == "img/player_red.png" || htmlstring == "img/player_magenta.png" || htmlstring == "img/player_green.png"){
                    return false
                }

                let nextCell = cell.style.backgroundImage.substring(5).slice(0, -2);
                if (nextCell == "img/egyenes.jpg" && (cell.classList.contains("rotate90") || cell.classList.contains("rotate270"))){
                    cell.style.opacity = 0.2
                    leftCell = cell
                    return true
                } 
                if (nextCell == "img/harmas.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate90") || cell.classList.contains("rotate270"))){
                    cell.style.opacity = 0.2
                    leftCell = cell
                    return true
                }            
                if (nextCell == "img/kanyar.jpg" && (cell.classList.contains("rotate0") || cell.classList.contains("rotate270"))){
                    cell.style.opacity = 0.2
                    leftCell = cell
                    return true
                }               
            }
        }
    }
    return false;
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}