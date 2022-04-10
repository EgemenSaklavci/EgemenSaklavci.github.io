class Thing {

    constructor(sq, html, direct, color, isWeird) {

        this.active = true
        this.color = color;
        this.strength = info.strengthOfColor[color];
        this.id = "thing" + info.idCounter;
        info.idCounter++;

        if (isWeird) {} //? add as coin or a gate in the child object
        else Board.in.push(this) //? add thing to the board object;

        $("#board").append(html);
        this.turn(direct);
        this.firstTurn = direct;
        this.reput(sq);


        $("#" + this.id).draggable(thing_draggable);
        $("#" + this.id).click(thing_click)
        $("#" + this.id).contextmenu(thing_right_click);

    }

    walkTo(sq) {

        this.sq = sq
        let position = $("#" + sq).position(); //? set the location of the absolute element
        $(`#${this.id}`).css("left", position.left /* + 3 */);
        $(`#${this.id}`).css("top", position.top /* + 3 */);

    }

    reput(sq) {

        this.walkTo(sq);
        this.first = sq;

    }

    turn(direct) {

        this.direct = direct
        let rotate = info.directToRotate[direct.join()]; //? set direction to rotate property
        $(`#${this.id}`).children().css("transform", `rotate(${rotate})`)

    }

    turnClockWise() {

        let dirs = Object.keys(info.directToRotate);
        let i = dirs.indexOf(this.direct.join());
        let dir = dirs[i + 1]?.split(",").map(Number) ?? dirs[0].split(",").map(Number)

        this.turn(dir);
        this.firstTurn = dir;
        
    }

    push(direct, strength) {

        if (!this.active) return true;

        let squareToGo = twod(this.sq, direct);
        let thingInSquare = Board.getThing(squareToGo);

        let gate = Board.getGate(squareToGo); //? check if there is a gate

        if (thingInSquare.type == "Wall") return false; //? return false if stands by a wall
        if (this.strength > strength) return false; //? or strength of push is weak

        if (gate) {

            if (gate.push(direct, this.strength, this.type)) {

                this.walkTo(squareToGo);
                let coin = Board.getCoin(squareToGo) //? check if there is a coin
                if (coin && this.strength == coin?.strength && this.type == "Car") {Board.erease(coin)}

            } else return false

        }


       
        if (thingInSquare.type == "Space") {

            this.walkTo(squareToGo);
            let coin = Board.getCoin(squareToGo) //? check if there is a coin
            if (coin && this.strength == coin?.strength && this.type == "Car") {Board.erease(coin)}
            return true;
            
        } else if (thingInSquare.push(direct, strength)) { //? try to push the thing in front of you

            this.walkTo(squareToGo);
            let coin = Board.getCoin(squareToGo) //? check if there is a coin
            if (coin && this.strength == coin?.strength && this.type == "Car") {Board.erease(coin)}
            return true;

        } else return false;

    }

}


class Car extends Thing {

    constructor(sq, direct, color) { //? handle direct, color and html, give them to the super

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
            <div id="${id}" class="thing">
                <svg style="background-color: var(--${color});">
                    <polygon 
                        points="12,10 12,40, 40,25" >
                    </polygon>
                </svg>
            </div>
        `

        super(sq, html, direct, color);

        this.type = "Car";

    }

    moveRegular() {

        let squareToGo = twod(this.sq, this.direct);
        let thingInSquare = Board.getThing(squareToGo);

        let gate = Board.getGate(squareToGo);
        if (gate) {

            if (!gate.push(this.direct, this.strength, this.type)) {

                let newDirect = this.direct.map(x => x * -1); //? turn 180 deg if gate color doesnt match
                this.turn(newDirect);
                return;

            }

        }

        switch (thingInSquare.type) {

            case "Space":
                this.walkTo(squareToGo);
                break;

            case "Sign":

                if (this.direct.indexOf(0) == thingInSquare.direct.indexOf(0)) { //? check if the sign is paralel with the car

                    let tryPush = thingInSquare.push(this.direct, this.strength); //? try to push the sign 
                    if (tryPush) {
                        this.walkTo(squareToGo);
                    } else { //? turn 180 deg if not pushable

                        let newDirect = this.direct.map(x => x * -1); //? turn 180 deg if its wall or doesn't exist
                        this.turn(newDirect);
                        return;
                    }

                } else {

                    this.turn(thingInSquare.direct)
                    return;

                }
                break;

            case "Wall":

                let newDirect = this.direct.map(x => x * -1); //? turn 180 deg if its wall or doesn't exist
                this.turn(newDirect);
                break;

            default:

                if (thingInSquare.push(this.direct, this.strength, this.type)) {

                    this.walkTo(squareToGo);

                } else {

                    let newDirect = this.direct.map(x => x * -1); //? turn 180 deg if its wall or doesn't exist
                    this.turn(newDirect);
                    return;

                }


        } //switch

        //! coin checking
        if (Board.getCoin(squareToGo)) { //?check if there is a coin there 

            let coin = Board.getCoin(squareToGo)
            if (coin.color == this.color) { //? check for color
                Board.erease(coin)
            }

        }


    }

}


class Sign extends Thing {

    constructor(sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
            <div id="${id}" class="thing">
                <svg style="background-color: var(--purple);">
                    <polygon
                        points="7,20 30,20 30,10 45,25 30,40 30,30 7,30"
                    ></polygon>
                </svg>
            </div>
        `

        super(sq, html, direct, color);

        this.type = "Sign";
        this.strength = 0;

    }

}


class Box extends Thing {

    constructor(sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
            <div id="${id}" class="thing">
                <svg style="background-color: var(--${color});">
                    <circle
                        cx="25" cy="25" r="16" stroke="black" stroke-width="7" fill="none"
                    ></circle>
                </svg>
            </div>
        `

        super(sq, html, direct, color);

        this.type = "Box";

    }

}

class Coin extends Thing {

    constructor(sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
        <div id="${id}" class="thing" style="z-index: 8; border-color: transparent;">
            <svg style=" border-color: transparent;">
                <circle cx="25" cy="25" r="12.5"  stroke-width="4" fill="var(--${color})">
            </svg>
        </div>            
        `

        super(sq, html, direct, color, true);

        Board.coins.push(this)
        this.type = "Coin";
        this.collected = false;
        
    }

}


class Wall extends Thing {

    constructor(sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
            <div id="${id}" class="thing">
                <div class="wall">
                </div>
            </div>
        `

        super(sq, html, direct, color);

        this.type = "Wall";

        $("#" + id).css("z-index", 0) //? get wall at the behind

    }

}


class Piston extends Thing {

    constructor(sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
            <div id="${id}" class="thing">
                <svg style="background-color: var(--purple);">
                    <polygon
                        points="7,12 30,12 30,5 47,25 30,45 30,38 7,38 7,28 30,28 30,22 7,22 ">
                    </polygon>
                </svg>
            </div>
        `

        super(sq, html, direct, color);

        this.type = "Piston";
        this.strength = 0;

    }

    moveRegular() {

        let squareFront = twod(this.sq, this.direct);
        let thingFront = Board.getThing(squareFront)

        if (!["Wall", "Space", "Gate"].includes(thingFront.type)) { //? check if there is something pushable
            
            if (thingFront.push(this.direct, 5)) {

                if (thingFront.type == "Car") thingFront.turn(this.direct);
                
                    let sq = this.sq
                    this.animate(squareFront);
                    setTimeout(() => {
                        this.animate(sq)
                    }, 200)

            }

        }

    }

    animate (sq) {
        let position = $("#" + sq).position(); //? set the location of the absolute element
        $(`#${this.id}`).css("left", position.left /* + 3 */);
        $(`#${this.id}`).css("top", position.top /* + 3 */);
    }

}


class Gate extends Thing {

    constructor (sq, direct, color) {

        let id = "thing" + info.idCounter; //? things html id
        let html = /*html*/ `
        <div class="thing" id="${id}">
        <svg style="background-color: var(--${color}); z-index: 10;" >
            <line x1="5" y1="18" x2="20" y2="18"></line>
            <line x1="18" y1="20" x2="18" y2="5"></line>

            <line x1="45" y1="18" x2="30" y2="18"></line>
            <line x1="32" y1="20" x2="32" y2="5"></line>

            <line x1="5" y1="32" x2="20" y2="32"></line>
            <line x1="18" y1="30" x2="18" y2="45"></line>

            <line x1="45" y1="32" x2="30" y2="32"></line>
            <line x1="32" y1="30" x2="32" y2="45"></line>
        </svg>
    </div>
        `

        super(sq, html, direct, color, true);

        Board.gates.push(this);
        this.type = "Gate";
        this.firstStrength = info.strengthOfColor[color];

    }

    push(direct, strength, type) {
        
        if (type == undefined) return false; //? check if the object is box or car

        switch (type) {
            case "Car":
                if (this.strength == strength) return true; //? allow same colored cars
                break;

            case "Box": 

                if (strength == this.strength) return true;

                this.strength = strength; //? get the color of the box and erease the box
                $("#"+this.id).children().css("background-color", `var(--${info.colorOfStrength[strength]})`);
                
                let oppositeDirect = direct.map(x => x*-1); //? erease the box
                let box = Board.getThing(twod(this.sq, oppositeDirect));
                Board.erease(box)
                

                return true;
                break;

        
            default:
                return false;
                break;
        }

    }

}



