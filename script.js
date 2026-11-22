const board = document.querySelector("#board");

const restartButton = document.querySelector("#restart");

const pairsLabel = document.querySelector("#pairs");

const movesLabel = document.querySelector("#moves");

const message = document.querySelector("#message");

const numbers = [
    1, 2, 3, 4, 5,
    6, 7, 8, 9, 10
];

const pairs = {
    1: 9,
    9: 1,

    2: 6,
    6: 2,

    3: 8,
    8: 3,

    4: 7,
    7: 4,

    5: 10,
    10: 5,
}

let firstCard = null;

let lockBoard = false;

let foundPairs = 0;

let moves = 0;

let matched = new Set();

function shuffle(items) {

    const result = [...items];

    for(let i = result.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [result[i], result[j]] =
        [result[j], result[i]];
    }

    return result;
    
}

function createCard(number) {

    const button = document.createElement("button");

    button.className = "card";

    button.dataset.number = number;

    const img = document.createElement("img");

    img.src = `images/${number}.jpg`;

    img.alt = `Картинка номер ${number}`;

    button.append(img);

    button.addEventListener("click", () => {
        chooseCard(button);
    });

    return button;
}

const shuffledNumbers = shuffle(numbers);

shuffledNumbers.forEach(number => {

    const card = createCard(number);

    board.append(card);
})

function chooseCard(card) {

    const number = Number(card.dataset.number);

    if (
        lockBoard ||
        matched.has(number) ||
        card === firstCard
    ) {
        return;
    }

    card.classList.add("selected");

    if (firstCard === null) {
        firstCard = card;
        message.textContent = "Теперь выбери вторую картинку."
        return;
    }

    moves++;
    movesLabel.textContent = moves;

    const firstNumber =
        Number(firstCard.dataset.number);

    if (pairs[firstNumber] === number) {

        // Правильная пара
        matched.add(firstNumber);
        matched.add(number);

        foundPairs++;
        pairsLabel.textContent = `${foundPairs} / 5`;
        message.textContent = "Отлично! Пара найдена!";

        firstCard.classList.add("matched");
        card.classList.add("matched");

        firstCard.disabled = true;
        card.disabled = true;

        firstCard = null;

        if (foundPairs === 5) {

            message.textContent =
                "Поздравляем! Ты нашёл все пары!"
        }

    } else {
        
        // Неправильная пара
        firstCard.classList.add("wrong");
        card.classList.add("wrong");

        message.textContent = "Неверно! Попробуй ещё раз.";

        lockBoard = true;
        

        mismatchTimer = setTimeout(() => {
            firstCard.classList.remove("selected", "wrong");
            card.classList.remove("selected", "wrong");

            firstCard = null;
            lockBoard = false;
            mismatchTimer = null

        }, 1000)
    }
}

function startGame() {
    firstCard = null;
    lockBoard = false;

    foundPairs = 0;
    moves = 0;

    matched = new Set();

    pairsLabel.textContent = "0 / 5";
    movesLabel.textContent = "0";

    message.textContent = "Нажми на первую картинку."

    board.replaceChildren();

    shuffle(numbers).forEach(number => {
        board.append(createCard(number));
    });
}

restartButton.addEventListener("click", startGame);

startGame();