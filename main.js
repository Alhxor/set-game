"use strict";

const COLORS = ['red', 'green', 'blue']
const SHAPES = ['diamond', 'oval', 'squiggle']
const FILLS = ['open', 'striped', 'solid']
const NUMBERS = [1, 2, 3]

class Card {
    constructor(shape, fill, color, number) {
        this.shape = shape
        this.fill = fill
        this.color = color
        this.number = number
        this.selected = false

        const node = document.createElement('div')
        node.classList.add('card')
        node.innerHTML = `<div class="shape ${this.shape}-${this.fill}-${this.color}"></div>`.repeat(this.number)

        this.node = node
    }

    select() {
        this.selected = true
        this.node.classList.add('selected')
    }

    deselect() {
        this.selected = false
        this.node.classList.remove('selected')
    }

    toggleSelection() {
        if (!this.selected) {
            this.select()
        } else {
            this.deselect()
        }
    }

    remove() {
        this.node.remove()
    }

    toHTML() {
        return this.node
    }
}

class Deck {
    constructor() {
        this.deck = []

        COLORS.forEach(color => 
        SHAPES.forEach(shape => 
        FILLS.forEach(fill => 
        NUMBERS.forEach (number => 
            this.deck.push(new Card(shape, fill, color, number))
        ))))
    }

    drawCard() {
        return this.deck.pop()
    }

    getLength() {
        return this.deck.length
    }

    shuffle() {
        // Fisher-Yates Sorting Algorithm
        for (let i = this.deck.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; 
        } 
    }

    toHTML() {
        const deck = new DocumentFragment()
        this.deck.forEach(card => deck.append(card.toHTML()))

        return deck
    }
}

function isASet(card1, card2, card3) {
    // In a set each parameter is either the same or different for all three cards
    const isSet = (a, b, c) => (a === b && a === c && b === c) || (a !== b && a !== c && b !== c)

    const colors = isSet(card1.color, card2.color, card3.color)
    const shapes = isSet(card1.shape, card2.shape, card3.shape)
    const fills = isSet(card1.fill, card2.fill, card3.fill)
    const numbers = isSet(card1.number, card2.number, card3.number)

    return Boolean(colors && shapes && fills && numbers)
}

document.addEventListener("DOMContentLoaded", function () {
    const boardEl = document.getElementById('board')
    const drawBtn = document.getElementById('draw')
    const newGameBtn = document.getElementById('new')
    const findBtn = document.getElementById('find')
    const autoDrawBtn = document.getElementById('autodraw')
    const drawUntilSetBtn = document.getElementById('draw-until-set')
    const cardsLeft = document.getElementById('cards-left')

    let deck, board = [], selected = [];
    let autoDraw = true;
    let drawUntilSet = true;

    newGame()

    newGameBtn.addEventListener('click', _ => newGame())
    drawBtn.addEventListener('click', _ => { draw3() })
    findBtn.addEventListener('click', _ => {
        let set = findSet()
        selected = []
        board.forEach(card => card.deselect())
        set.forEach(card => card.select())
    })

    autoDrawBtn.addEventListener('click', e => {
        autoDrawBtn.classList.toggle('disabled')
        autoDraw = !autoDraw
    })

    drawUntilSetBtn.addEventListener('click', e => {
        drawUntilSetBtn.classList.toggle('disabled')
        drawUntilSet = !drawUntilSet
    })

    function findSet() {
        for (let i = 0; i < board.length; i++)
        for (let j = 0; j < board.length; j++)
        for (let z = 0; z < board.length; z++) {
            if (i === j || i === z || j === z) continue
            if (isASet(board[i], board[j], board[z])) return [board[i], board[j], board[z]]
        }
        return []
    }

    function newGame() {
        deck = new Deck()
        deck.shuffle()

        for (const card of board) card.remove()
        board = []
        selected = []

        for (let i = 12; i > 0; i--) {
            draw()
        }

        if (drawUntilSet) drawUntilSetExistsOnBoard()
    }

    const setFound = (set) => {
        console.log("Set found: ", set)

        set.forEach(card => {
            let i = board.indexOf(card)
            board.splice(i, 1)
        })

        if (deck.getLength() > 0) {
            if (autoDraw && board.length < 12) draw3()
            if (drawUntilSet) drawUntilSetExistsOnBoard()
        }
    }

    function draw3() { draw(); draw(); draw(); }

    function drawUntilSetExistsOnBoard() {
        let setOnBoard = findSet()
        // console.log(setOnBoard)

        let i = 0
        while (setOnBoard.length === 0 && deck.getLength() > 0 && i < 27) {
            draw3()
            setOnBoard = findSet()
            i++
        }

        // if (setOnBoard) {
        //     console.log(`Drew 3 cards ${i} times before finding set`, setOnBoard)
        // }
    }

    function cardClick(card) {
        card.toggleSelection()
    
        const ind = selected.indexOf(card)
        if (ind === -1)
            selected.push(card)
        else
            selected.splice(ind, 1)
    
        if (selected.length > 2) {
            console.log("Checking for a set: ", selected)

            if (isASet(...selected)) {
                setFound([...selected])
                for (const c of selected) c.remove()
            }
            else {
                console.log("Not a set")
                for (const c of selected) c.toggleSelection()
            }

            selected = []
        }
    }

    function draw() {
        const card = deck.drawCard()

        cardsLeft.innerText = deck.getLength()

        card.node.addEventListener('click', _ => cardClick(card))

        board.push(card)
        boardEl.append(card.toHTML())
    }

});
