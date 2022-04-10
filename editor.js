const activateModels = () => {

    $(".model").draggable({

            drag: function (ev) {

                focusedThing = info.models[ev.target.id.split("model")[1]]
                info.isModel = true;

            }

        })

        .click(function (ev) {

            let id = ev.target.id.split("model")[1] //? get color
            let oldColor = info.models[id][3];

            let colors = Object.keys(info.strengthOfColor); //? get new color
            let ind = colors.indexOf(oldColor);
            let newColor = colors[ind + 1] ?? colors[0];

            let html = $("#model" + id).html().replace(oldColor, newColor); //? set new color
            $("#model" + id).html(html);
            info.models[id][3] = newColor

            info.modelHtml = $("#models").html(); //? get html of .models for resetting it when dropping a new thing

        })

    $("#models").droppable({
        accept: ".thing",
        drop: function (ev) {
            Board.delete(focusedThing) //? delete element when dropped to outside
        }
    })

};
activateModels()



const thing_draggable = {

    drag: thingDragStart,
    containment: "#board"

}

const square_droppable = {
    drop: function (ev) {

        if (info.isModel) {

            focusedThing = focusedThing.slice(); //? put new thing 
            let thing = focusedThing.shift();
            focusedThing[0] = ev.target.id;
            focusedThing = new thing(...focusedThing)
            info.isModel = false;

            $("#models").children().remove(); //? reset model section
            $("#models").html(info.modelHtml)
            activateModels()

        } else if ( //* check for editables or is creator
            Board.editables.includes(focusedThing.sq) && Board.editables.includes(ev.target.id) || info.isCreator
        ) focusedThing.reput(ev.target.id)
        else focusedThing.walkTo(focusedThing.sq)

    }
}

function square_right_click(ev) {

    ev.preventDefault()
    if (!info.isCreator) return;

        let t = eval(focusedThing.type);
        let prop = [ev.target.id, focusedThing.direct, focusedThing.color];
        new t(...prop)


}

function square_click(event) { //* setting editables 

    if (!info.isCreator) return;

    if (Board.editables.includes(event.target.id)) {

        let i = Board.editables.indexOf(event.target.id);
        Board.editables.splice(i, 1); //? delete the square

    } else Board.editables.push(event.target.id);
    $(this).toggleClass("editable"); //? change the color,

}

function thing_click(ev) { //? turn clockwise if right click 
    if (!info.isCreator) return;
    Board.in.find(x => x.id == ev.target.id)?.turnClockWise()
}

function thingDragStart(ev) {

    focusedThing = Board.in.find(x => x.id == ev.target.id) ??
        Board.gates.find(x => x.id == ev.target.id) ??
        Board.coins.find(x => x.id == ev.target.id)

    info.isModel = false

}

function thing_right_click(ev) { //* delete the object when double click

    ev.preventDefault()
    if (!info.isCreator) return;

    let thing = Board.in.find(x => x.id == ev.target.id) ??
        Board.gates.find(x => x.id == ev.target.id) ??
        Board.coins.find(x => x.id == ev.target.id)

    Board.delete(thing)

}

$("#button").click(function () { //? stop/start the game when enter pressed

    

})
$(document).keypress(e => {
    if (gameLoop) {
        stopGameLoop();
    } else {
        startGameLoop();
    }

})

document.addEventListener("touchstart", function (e) {
    if (! e.target.matches("body")) return;
    if (gameLoop) {
        stopGameLoop();
    } else {
        startGameLoop();
    }

})

document.addEventListener("click", function (e) {
    if (! e.target.matches("body")) return;
    if (gameLoop) {
        stopGameLoop();
    } else {
        startGameLoop();
    }

})