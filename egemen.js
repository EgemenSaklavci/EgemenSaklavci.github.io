export function Q(query) {

    function id (query) {
        return $("#" + query)
    }

    function c(query) {
        return $("." + query)
    }

    return $(query)
}

export function ls() {

    function save(key, data) {
        localStorage.setItem(key, JSON.stringify(data))
        return this
    }

    function data(key, _default) {

        let res = localStorage.getItem(key);
        return res ? JSON.parse(res) : _default;
    }


    return localStorage;

}
