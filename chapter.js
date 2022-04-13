function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
    return this
}

function data(key, _default) {

    let res = localStorage.getItem(key);
    return res ? JSON.parse(res) : _default;
}

function display(level) {

    if (level.message != "") message(level.message)

    info.isCreator = true;

    writeBoard(...level.level.size)

    level.level.things.forEach(t => {
        obj = eval(t.shift());

        new obj(...t)
    })

    level.level.editables.forEach(sq => {

        $(`#${sq}`).trigger("click")

    })

    info.isCreator = false;

}

var index = 0;



function nextLevel() {

    clearInterval(gameLoop);

    setTimeout(() => {

        message("Tebrikler!")

        index++;
    
        if (chapter.length == index) {
            message(`
"Kareler"in ilk sürümü bu kadardı... 
oynadığın için teşekkürler.
-Egemen Saklavcı`)
        } else {
            
            setTimeout(() => {
                
                stopGameLoop();
                display(chapter[index])
                
            }, 1000)
    
        
        }

    }, 1000)

}

function message(text) {

    $("body").append(/*html*/`
        <div class="message-card" style="opacity: 0">
            <p>
                ${text}
            </p>
        </div>
    `)

    $(".message-card").css("opacity", 1)

    $(".message-card").click(function () {
        $(".message-card").css("opacity", 0);
        setTimeout(() => $(".message-card").remove(), 100)
    })

}

$(document).ready( function () {
    display(chapter[index]);
})