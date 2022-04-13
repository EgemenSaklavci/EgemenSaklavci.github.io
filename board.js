const info = { //? represents info about colors, directs and html

    strengthOfColor: {
        orange: 3,
        blue: 2,
        green: 1,
        red: 0
    },

    colorOfStrength: {
        3: "orange",
        2: "blue",
        1: "green",
        0: "red"
    },

    idCounter: 0,

    directToRotate: {
        "1,0": "0deg",
        "0,1": "90deg",
        "-1,0": "180deg",
        "0,-1": "-90deg",
    },

    models: [
        [Car, "", [1, 0], "orange"],
        [Sign, "", [1, 0], "orange"],
        [Box, "", [1, 0], "orange"],
        [Coin, "", [1, 0], "orange"],
        [Wall, "", [1, 0], "orange"],
        [Piston, "", [1, 0], "orange"],
        [Gate, "", [1, 0], "orange"]
    ],

    isModel: false,
    modelHtml: $("#models").html(),
    isCreator: true,
    size : []

}

var focusedThing //? drag and drop variable


const Board = new class {

    in = [];
    coins = [];
    gates = [];
    editables = [];
    squares = [];

    getThing = square => {

        if (this.squares.includes(square))
            return this.in.find(obj => obj.sq == square && obj.active) ?? {
                type: "Space"
            };

        else return {
            type: "Wall"
        }

    }

    getCoin = square => this.coins.find(obj => obj.sq == square && obj.active) ?? false;
    getGate = square => this.gates.find(obj => obj.sq == square) ?? false;

    erease(thing) {

        thing.active = false
        $("#" + thing.id).css("opacity", 0)

    }

    delete(thing) { //? delete object when dragged to model section

        let arr = thing.type == "Coin" ? this.coins : //? find the type and array of the element
            thing.type == "Gate" ? this.gates :
            this.in

        let _thing = arr.find(x => x.id == thing.id)

        let ind = arr.indexOf(_thing)
        arr.splice(ind, 1)
        $("#" + thing.id).remove(); //? removing from array and html

    }

}


function writeBoard(row, column) {

    Board.in = [];
    Board.coins = [];
    Board.squares = []; //? reseting properities
    Board.gates = [];
    Board.editables = [];
    $("#board").html("");

    info.size = [row, column];

    let color = "black"

    for (let i = 0; i < row; i++) { //? set rows

        if (! (column % 2)) color = color == "black" ? "white" : "black";

        $("#board").append( /*html*/ `
                <div class="row row${i}">    
                </div>
            `)


        for (let j = 0; j < column; j++) { //? set columns

            $(`.row${i}`).append( /*html*/ ` 
                    <div class="square ${color}" id="sq_${j}_${i}">
                    </div>
                `)

            Board.squares.push(`sq_${j}_${i}`); //? Board.squares

            color = color == "black" ? "white" : "black"

        }

    }

    $(".square").droppable(square_droppable)
    $(".square").contextmenu(square_right_click)
    $(".square").click(square_click)

}

//? const twod : returns the new calculated square if you give it a sq and direct to go
const twod = (sq, direct) => `sq_${Number(sq.split("_")[1]) + direct[0]}_${Number(sq.split("_")[2]) + direct[1]}`

//* trial game loop
var gameLoop

const startGameLoop = () => {

    $("#board , .model").css("pointer-events", "none")

    gameLoop = setInterval(() => {

        $(".thing, svg").css("transition", "all 0.5s linear")

        let cars = Board.in.filter(thing => thing.type == "Car") //! car moves

        for (let i = 0; i < 4; i++) {

            let car = cars.find(x => x.strength == i) ?? {
                moveRegular: () => {}
            }

            car.moveRegular();

            for (let j = 0; j < 10; j++) {

                Board.in.filter(x => x.type == "Piston").forEach(piston => { //! push pistons

                    setTimeout(() => {
                        piston.moveRegular()
                    }, 250)

                })

            }

        }

        Board.in.filter(x => x.type == "Piston").forEach(x => x.moved = false);

        if (Board.coins.every(c => !c.active)) {
          /*   nextLevel() */
        }

    }, 500)

}

const stopGameLoop = () => {

    clearInterval(gameLoop);
    gameLoop = false;

    let all = Board.in.slice().concat(Board.coins, Board.gates);

    all.forEach(t => {
        t.active = true;
        $(`#${t.id}`).css("opacity", "1");
        t.walkTo(t.first);
        t.turn(t.firstTurn);

        if (t.type == "Gate") {
            t.strength = t.firstStrength; 
            $("#"+t.id).children().css("background-color", `var(--${t.color})`);
        }
    })

    setTimeout(() => {  
        $(".thing, svg").css("transition", "")
    }, 500)

    $("#board , .model").css("pointer-events", "all")

}