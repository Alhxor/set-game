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

    toggleSelection() {
        if (!this.selected) {
            this.selected = true
            this.node.classList.add('selected')
        } else {
            this.selected = false
            this.node.classList.remove('selected')
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

    let deck, board = [], selected = [];

    newGame()

    newGameBtn.addEventListener('click', _ => newGame())
    drawBtn.addEventListener('click', _ => { draw(); draw(); draw() })
    findBtn.addEventListener('click', _ => {
        let set = findSet()
        for (const card of set) card.toggleSelection()
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
    }

    const setFound = (set) => {
        console.log("Set found: ", set)

        set.forEach(card => {
            let i = board.indexOf(card)
            board.splice(i, 1)
        })
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
        if (!card) {
            console.log("No more cards in deck!")
            return
        }

        console.log(deck.getLength(), " cards remaining in deck")

        card.node.addEventListener('click', _ => cardClick(card))

        board.push(card)
        boardEl.append(card.toHTML())
    }

});
