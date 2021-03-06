/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById('coffee_counter').innerText = coffeeQty;
}


function clickCoffee(data) {
  data.coffee = data.coffee + 1;
  document.getElementById('coffee_counter').innerText = data.coffee;
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(prodObj => {
    if (coffeeCount >= (prodObj.price/2)) {
      prodObj.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter(obj => obj.unlocked === true);
}

function makeDisplayNameFromId(id) {
  let arr = [...id];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '_') {
      let char = arr[i + 1].toUpperCase();
      arr.splice(i + 1, 1, char);
    }
  }
  return arr
    .map((char, index) => {
      if (index === 0) {
        return char.toUpperCase();
      } else if (char === '_') {
        return char = ' ';
      } else {
        return char;
      }})
    .join('');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild){
      parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const producerArr = data.producers;
  const prodCont = document.getElementById('producer_container');

  unlockProducers(producerArr, data.coffee);

  const producerInfo = producerArr
    .filter((producerElement) => producerElement.unlocked === true)
    .map((producerElement) => makeProducerDiv(producerElement));

  deleteAllChildNodes(prodCont);
  producerInfo.forEach((contDiv) => prodCont.appendChild(contDiv));
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  const producerArr = data.producers;
  return  producerArr.filter(prodObj => prodObj.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
  const prodObj = getProducerById(data, producerId); 
  if (data.coffee >= prodObj.price) {
    return true;
  } else {
    return false;
  }
}

function updateCPSView(cps) {
  let cpers = document.getElementById('cps');
  cpers.innerText = cps;
  return cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
 
  prodBuy = canAffordProducer(data, producerId);
  
  const producerIdInfo = getProducerById(data, producerId);
  if (prodBuy) {
    producerIdInfo.qty++;
    data.coffee = data.coffee - producerIdInfo.price;
    producerIdInfo.price = updatePrice(producerIdInfo.price);
    data.totalCPS = data.totalCPS + producerIdInfo.cps;
    data.totalCPS = updateCPSView(data.totalCPS);
    renderProducers(data);
    updateCoffeeView(data.coffee);
  } else {
    window.alert('Not enough coffee!')
  }
  return prodBuy;
}

function buyButtonClick(event, data) {
  let eventIdName = event.target.id;
  if (event.target.tagName === 'BUTTON') {
    const name = eventIdName.split('_').slice(1).join('_');
    attemptToBuyProducer(data, name);
  }
}

function tick(data) {
  data.coffee = data.coffee + data.totalCPS
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;
  

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
