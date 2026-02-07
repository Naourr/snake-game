const restart = document.querySelector('.restart-btn')
const deid = document.querySelector('.ded')
const main = document.querySelector('main')
const row_size = 5
document.documentElement.style.setProperty('--row-size', row_size)
let html_grids
let snek_grids
let snek_growth_queue
let snek_direction
let last_direction
let is_ded
let coin_index

function start() {
    main.innerHTML = ""
    is_ded = false
    deid.innerHTML = "ded"
    snek_direction = "right"
    last_direction = snek_direction
    snek_growth_queue = 1
    for (let i = 0; i < row_size; i++) {
       for (let j = 0; j < row_size; j++) {
            main.appendChild(document.createElement("div"))
        }
    }
    html_grids = document.querySelectorAll('main > div')
    snek_grids = [0]
    coin_index = rand_index()
    render()
}
start()

restart.addEventListener('click', () => {
    start()
})

const left = document.querySelector('.left')
const right = document.querySelector('.right')
const up = document.querySelector('.up')
const down = document.querySelector('.down')
function controls() {
    left.addEventListener('click', () => {
        snek_direction = "left"
    })
    right.addEventListener('click', () => {
        snek_direction = "right"
    })
    up.addEventListener('click', () => {
        snek_direction = "up"
    })
    down.addEventListener('click', () => {
        snek_direction = "down"
    })
}
controls()

function rand_index() {
    return Math.floor(Math.random() * html_grids.length);
}

setInterval(() => {
    tick()
}, 600)

function tick() {
    if (is_ded) return

    if (snek_direction == "right") {
        if (last_direction == "left") {
            go_left() 
        } else {
            go_right()
        }
    } else if (snek_direction == "left") {
        if (last_direction == "right") {
            go_right() 
        } else {
            go_left()
        }
    }
    else if (snek_direction == "up") {
        if (last_direction == "down") {
            go_down() 
        } else {
            go_up()
        }
    }
    else if (snek_direction == "down") {
        if (last_direction == "up") {
            go_up()
        } else {
            go_down()
        }
    }
    
    function go_right() {
        let looped = false
        let new_snek = snek_grids[0]
        for (let i = 1; i < row_size +1 ; i++) {
            if (new_snek == (row_size * i)-1) {
                new_snek -= row_size -1
                looped = true
                snek_grids = [new_snek,...snek_grids]
            }
        }
        if (looped == false) {
            new_snek += 1
            snek_grids = [new_snek,...snek_grids]
        }
        last_direction = "right"
        erase_tail()
    }

    function go_left() {
        let looped = false
        let new_snek = snek_grids[0]
        for (let i = 0; i < row_size ; i++) {
            if (new_snek == row_size * i) {
                new_snek += row_size -1
                looped = true
                snek_grids = [new_snek,...snek_grids]
            }
        }
        if (looped == false) {
            new_snek -= 1
            snek_grids = [new_snek,...snek_grids]
        }
        last_direction = "left"
        erase_tail()
    }

    function go_up() {
        let looped = false
        let new_snek = snek_grids[0]
        for (let i = 0; i < row_size ; i++) {
            if (new_snek == i) {
                new_snek += row_size * (row_size -1)
                looped = true
                snek_grids = [new_snek,...snek_grids]
            }
        }
        if (looped == false) {
            new_snek -= row_size
            snek_grids = [new_snek,...snek_grids]
        }
        last_direction = "up"
        erase_tail()
    }

    function go_down() {
        let looped = false
        let new_snek = snek_grids[0]
        for (let i = (row_size*row_size) -1; i > row_size*(row_size-1) ; i--) {
            if (new_snek == i) {
                new_snek -= row_size * (row_size -1)
                looped = true
                snek_grids = [new_snek,...snek_grids]
            }
        }
        if (looped == false) {
            new_snek += row_size
            snek_grids = [new_snek,...snek_grids]
        }
        last_direction = "down"
        erase_tail()
    }

    function erase_tail() {
        if (snek_growth_queue == 0) {
            let tail_index = snek_grids.length -1
            snek_grids = snek_grids.filter((snek, index) => index != tail_index)
        } else {
            snek_growth_queue -= 1
        }
    }
    
    snek_grids.forEach(snek1 => {
        let tally = 0
        snek_grids.forEach(snek2 => {
            if (snek1 == snek2) {
                tally += 1
            }
        })
        if (tally > 1) {
            is_ded = true
        }
    })

    snek_grids.forEach(snek => {
        if (snek == coin_index) {
            coin_index = rand_index()
            snek_growth_queue += 1
        }
    })

    const occupied = document.querySelectorAll('.snek')
    if (occupied.length == html_grids.length) {
        deid.innerHTML = "Dammm, I couldnt even playtest this. Congratulationss"
        is_ded = true
    }
    render()
}

function render() {
    if (is_ded) {
        deid.classList.add('active')
        return
    } else {
        deid.classList.remove('active')
    }
    html_grids.forEach(grid => {
        grid.classList.remove('snek')
        grid.classList.remove('hed')
        grid.classList.remove('coin')
    })
    snek_grids.forEach(snek => {
        html_grids[snek].classList.add('snek')
    })
    let head = snek_grids[0]
    html_grids[head].classList.add('hed')
    html_grids[coin_index].classList.add('coin')
}
