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
    }

    toHTML() {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `<div class="shape ${this.shape}-${this.fill}-${this.color}"></div>`.repeat(this.number)

        return card
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

    shuffle() {
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

document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById('board')
    const deck = new Deck()
    deck.shuffle()

    for (let i = 12; i > 0; i--) {
        board.append(deck.drawCard().toHTML())
    }
    // board.append(deck.toHTML())
});