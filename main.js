const myHand = document.getElementById("myHand")
const getCard = document.getElementById("getCard")
const stop = document.getElementById("stop")
const myPoints_html = document.getElementById("myPoints")
const botPoints_html = document.getElementById("botPoints")
const botHand_html = document.getElementById("botHand")
const myMoney_html = document.getElementById("myMoney")
const con = document.getElementById("con")
const fixCon = document.getElementById("fixCon")

const translateRus = {
    "valet": "валет",
    "dama": "дама",
    "king": "король",
    "tyz": "туз",
}

const points = {
    "valet": 2,
    "dama": 3,
    "king": 4,
    "tyz": 11,
}

let coloda = []
let myPoints = 0
let myMoney = 1000
let botPoints = 0
let isStart = false

// получение рандомной цифры
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// перезапуск колоды
function resetColoda() {
    coloda = []
    // worms - черви, peaks - пики, baby - буби, kresti - крести
    const cards = {
        "worms": [],
        "peaks": [],
        "baby": [],
        "kresti": [],
    }
    // выбор масти
    for (const key in cards) {
        for (let i = 2; i <= 10; i++) {
            cards[key].push({
                mast: key,
                value: i
            })
        }
        cards[key].push({
            mast: key,
            value: "valet"
        })
        cards[key].push({
            mast: key,
            value: "dama"
        })
        cards[key].push({
            mast: key,
            value: "king"
        })
        cards[key].push({
            mast: key,
            value: "tyz"
        })

        cards[key].sort(() => getRandom(-1, 0))
        coloda.push(...cards[key])
    }

    coloda.sort(() => getRandom(-1, 0)).sort(() => getRandom(-1, 0))
}

// получить информацию о карте (название на русском, значение, исходное название)
function getDataCard(card) {
    let value = null
    let nameValue = ''
    if (typeof card.value == "number") {
        value = card.value
        nameValue = card.value
    } else {
        value = points[card.value]
        nameValue = translateRus[card.value]
    }

    return [card.mast, value, nameValue]
}

// получить одну карту из колоды
function getOneCard() {
    const indexCard = getRandom(0, coloda.length - 1)
    const card = coloda[indexCard]
    coloda.splice(indexCard, 1)

    return card
}

// начать новую игру
function resetGame() {
    fixCon.style.backgroundColor = "white"
    con.removeAttribute("readonly", true)
    myPoints = 0
    myPoints_html.innerHTML = myPoints
    botPoints = 0
    botPoints_html.innerHTML = botPoints
    myHand.innerHTML = ''
    botHand.innerHTML = ''
    isStart = false

    resetColoda()
}

// проигрыш
function iLose() {
    isStart = false

    if (myMoney <= 0) {
        alert("Вы проиграли все деньги, мы вам дали в долг 1000")
        myMoney = 1000
    }

    myMoney_html.innerHTML = myMoney
    con.removeAttribute("readonly", true)
    fixCon.style.backgroundColor = "white"
}

// отрисовка карты
function renderCard(hand, mast, nameValue) {
    console.log(mast);
    hand.insertAdjacentHTML("beforeend", `<div class="card">
    <img class="img1" src="./imgs/${mast}.png">
    <img class="img2" src="./imgs/${mast}.png">
    <p>${nameValue}</p>
    </div>`)
}

// получить карту в свою руку
function getMyHand() {
    const card = getOneCard()

    const [mast, value, nameValue] = getDataCard(card)
    myPoints += value

    if (myPoints > 21) {
        alert("Перебор")
        myMoney -= +con.value
        iLose()
        return
    }

    myPoints_html.innerHTML = myPoints
    renderCard(myHand, mast, nameValue)
}

// клик на "Взять карту"
getCard.addEventListener('click', () => {
    if (!isStart) {
        alert("Сделайте ставку")
    } else {
        getMyHand()
    }
})

// клик на "Поставить"
fixCon.addEventListener('click', () => {
    if (con.value < 1) {
        alert("Минимальная ставка 1 рубль")
        return
    }

    if (con.value > myMoney) {
        alert("Недостаточно денег")
        return
    }

    if (!isStart) {
        resetGame()
        con.setAttribute("readonly", true)
        fixCon.style.backgroundColor = "green"
        isStart = true

        getMyHand()
        getMyHand()
    } else {
        alert("Ставка уже сделана")
    }
})

// клик на "Зафиксировать"
stop.addEventListener("click", () => {
    if (!isStart) {
        alert("Игра не начета")
        return
    }

    while (botPoints <= myPoints && botPoints <= 21) {
        const card = getOneCard()
        const [mast, value, nameValue] = getDataCard(card)
        botPoints += value

        botPoints_html.innerHTML = botPoints
        renderCard(botHand, mast, nameValue)
    }

    if (botPoints > 21) {
        setTimeout(() => {
            alert("Победа")
        }, 10);

        myMoney += +con.value
    } else {
        setTimeout(() => {
            alert("Проигрыш")
        }, 10);

        myMoney -= +con.value
    }

    iLose()
})

// для начала игры
resetGame()