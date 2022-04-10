function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
    return this
}

function data(key, _default) {

    let res = localStorage.getItem(key);
    return res ? JSON.parse(res) : _default;
}

var chapter = data("chapter", [])

$("#send-level-button").click(e => {

    let allThings = Board.in.slice().concat(Board.coins, Board.gates);
    let allStuff = allThings.map(t => [t.type, t.sq, t.direct, t.color]);
    let editables = Board.editables.slice();
    let size = info.size;

    let data = {
        message: $("textarea").val(),
        level: {
            things: allStuff,
            size,
            editables
        },
    }
    chapter.push(data);
    
    save("chapter", chapter)
})

