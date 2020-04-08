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

const createBox = ({number, key, margin: {top, left}}, container, zIndex) => {
  const box = document.createElement('div');
  box.innerText = number;
  box.setAttribute('class', 'box box__animation');
  box.setAttribute('data-key', key);
  appendChildStyle(box, `
    .box[data-key="${key}"] { 
      margin-top: ${top}px; 
      margin-left: ${left}px;
      z-index: ${zIndex};
    }`);
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

const updateRenderredItemList = (itemList) => {
  let zIndeCounter = 0;

  itemList.forEach(item => updateBox(item, zIndeCounter--));
}

const updateBox = ({number, key, margin: {top, left}}, zIndex) => {
  const boxSelector = `.box[data-key="${key}"]`,
    box = document.querySelector(boxSelector);

  clearChildElements(box);
  box.innerText = number;
  appendChildStyle(box, `
    ${boxSelector} { 
      margin-top: ${top}px; 
      margin-left: ${left}px;
      z-index: ${zIndex};
    }`);
}

export {
  renderItemList,
  updateRenderredItemList
};