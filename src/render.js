import {size} from './moveCalculator';
import {getKey} from './keyGenerator';
import {
  animate,
  getMargin
} from './animation';

const generateBoxList = (itemList, numberOfItems) => {  
  for(let i = 0; i < numberOfItems; i++) {
    itemList.push(generateBox(itemList));
  }

  return itemList;
}

const generateBox = (itemList) => {
  let top,
    left;

  do {
    top = randomMarginInRange();
    left = randomMarginInRange();
  } while(areMarginsColide(top, left, itemList));

  return {
    number: randomInRange(1, 2) * 2,
    key: getKey(),
    margin: {
      top,
      left
    }
  };
}

const randomMarginInRange = () => {
  const {grid, cell} = size;
  return randomInRange(0, grid) * cell;
}

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const areMarginsColide = (inputTop, inputLeft, itemList) =>
  itemList.some(({margin: {top, left}}) => 
    top === inputTop && left === inputLeft
  );

const renderItemList = (itemList) => {
  const container = document.getElementsByClassName('container')[0];
  let zIndexCounter = 0;

  clearChildElements(container);
  itemList.forEach((item) => 
    createBox(item, container, zIndexCounter--)
  );
}

const clearChildElements = (domElement) => {
  while(domElement.firstChild) {
    domElement.removeChild(domElement.lastChild);
  }
}

const createBox = ({number, key, margin}, container, zIndex) => {
  const box = document.createElement('div');
  box.innerText = number;
  box.setAttribute('class', 'box');
  box.setAttribute('data-key', key);
  appendChildStyle(
    box, 
    getBoxStyle(
      getBoxSelector(key), 
      margin, 
      zIndex
    )
  );
  container.appendChild(box);
}

const appendChildStyle = (createdElement, styleText) => {
  let css = document.createElement("style"),
    style = styleText;

  css.type = "text/css";

  if (css.styleSheet) {
    css.styleSheet.cssText = style;
  } else {
    css.appendChild(document.createTextNode(style));
  }

  createdElement.appendChild(css);
}

const updateRenderredItemList = (itemList, prevList) => {
  let zIndeCounter = 0;

  itemList.forEach(item => {
    const {key: currentItemKey} = item;
    const {margin: prevMargin} = prevList.filter(({key}) => key === currentItemKey)[0];
    //if there is not such item with prev key then render item list
    //and don't update it
    updateBox(item, prevMargin, zIndeCounter--)
  });
}

const updateBox = ({number, key, margin}, prevMargin, zIndex) => {
  const boxSelector = getBoxSelector(key),
  box = document.querySelector(boxSelector);
  moveBoxAnimation(box, boxSelector, number, margin, prevMargin, zIndex, 0.1);
}

const moveBoxAnimation = (
  box, 
  boxSelector, 
  number, 
  {top, left}, 
  {top: prevTop, left: prevLeft}, 
  zIndex, 
  msDuration
) => {
  animate({
    timing: linear,
    draw(progress) {
      clearChildElements(box);
      box.innerText = number;

      appendChildStyle(
        box, 
        getBoxStyle(
          boxSelector, 
          {
            top: getMargin(progress, prevTop, top),
            left: getMargin(progress, prevLeft, left)
          },
          zIndex
        )
      );
    },
    duration: msDuration * 1000
  });
};

const linear = (timeFraction) => timeFraction;

const getBoxStyle = (boxSelector, {top, left}, zIndex) => 
  `${boxSelector} { 
    margin-top: ${top}px; 
    margin-left: ${left}px;
    z-index: ${zIndex};
  }`

const removeBoxList = (itemList) => {
  return itemList.filter((item) => {
    const {key, needToRemove} = item;

    if(needToRemove) {
      const box = document.querySelector(getBoxSelector(key));
      box.remove();
    } else {
      return item;
    }
  });
}

const getBoxSelector = (key) => `.box[data-key="${key}"]`;

export {
  renderItemList,
  updateRenderredItemList,
  removeBoxList,
  generateBoxList,
  randomInRange
};