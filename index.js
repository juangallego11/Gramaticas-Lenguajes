/* 
  Author: Andrés Maya
  Git: https://github.com/AndresMaya13
  Subject: Gramáticas y lenguajes
  Ing sistemas || UTP 

  Soluciona cualquier Máquina de Turing acotada
  Este ejemplo: a^n b^n c^n
*/

let currentState;
let index = 1; 
let currentTapePosition = 1;
let movements = {'L': -1, 'R': 1, 'H': 0};
const entry = toArray('aabbbccc');
let alphabet = toArray('abc');
let states = toArray('ABCDEFG');
let currentNode = '';

// [simbolo de entrada, nodo al que va, simbolo que pongo, direccion del movimiento];
let A = [['a', 'B', 'x', 'R'], ['y', 'E', 'y', 'R']];
let B = [['a', 'B', 'a', 'R'], ['y','B', 'y', 'R'], ['b','C', 'y', 'R']];
let C = [['z', 'C', 'z', 'R'], ['b', 'C', 'b', 'R'], ['c','D', 'z', 'L']];
let D = [['a', 'D', 'a', 'L'],
         ['y', 'D', 'y', 'L'],
         ['b', 'D', 'b', 'L'],
         ['z', 'D', 'z', 'L'],
         ['x', 'A', 'x', 'R']
        ];
let E = [['y', 'E', 'y', 'R'], ['z', 'F', 'z', 'R']];
let F = [['z', 'F', 'z', 'R'], ['$', 'G', '$', 'L']];
let G = [];
let Delta = {A,B,C,D,E,F,G};

let MTA = {
  Q: [],
  alphabet,
  states,
  tapeAlphabet: entry,
  Delta,
  initialState: 'A',
  acceptanceStatus: 'G',
  start: '#',
  end: '$'
};

currentNode = MTA.initialState;
MTA.tapeAlphabet.unshift(MTA.start)
MTA.tapeAlphabet.push(MTA.end)

async function* generator() {
  while(true) {
    yield index;
    if(index < MTA.tapeAlphabet.length) {
      index++;
    }
  }
}

let g = generator();
(async function main() {
  currentState = MTA.Delta[MTA.initialState];
  evaluate();
})()

async function evaluate() {
  await g.next();
  decideDelta(MTA.tapeAlphabet[currentTapePosition]);
}

function decideDelta(symbol) {
  let counter = 0
  if(currentNode == MTA.acceptanceStatus) return console.log('Cadena aceptada')
  for (let deltaIndex = 0; deltaIndex < currentState.length; deltaIndex++) {
    let delta = currentState[deltaIndex]
    delta[0] == symbol ? aplyRule(delta) : counter++
  }
  if(currentState.length == counter) console.log('Cadena NO aceptada');
}

async function aplyRule(delta) {
  let symbolToReplace = delta[2];
  fillTapeAlphabet(currentTapePosition, symbolToReplace);
  currentTapePosition = currentTapePosition + movements[delta[3]];
  currentNode = delta[1]
  currentState = deltasOfState(currentNode);
  evaluate();
  console.log(
    {'PositionTape:': currentTapePosition},
    {'currentNode: ' :currentNode},
    {'TapeAlphabet: ': MTA.tapeAlphabet}
  )
}

function fillTapeAlphabet(index, value) {
  console.log(`Se cambia ${MTA.tapeAlphabet[index]} por ${value} en la posición ${index} de la cinta`)
  MTA.tapeAlphabet[index] = value;
}

//retorna los deltas de x estado
function deltasOfState(state) {
  return MTA.Delta[state];
}

function toArray(str) {
  return Array.from(str)
}





