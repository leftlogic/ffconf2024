function main(container, template) {
  const COLS = 16;

  const colours = [
    '#FFA19E',
    '#79E6F1',
    '#F2AB40',
    '#9DD37C',
    '#FFE994',
    '#A9B5C8',
    '#C9939B',
    '#6B8E8E',
  ];

  const bag = colours
    .map((colour, i) => {
      return Array.from({ length: 12 }, () => colour);
    }, [])
    .flat();

  // use the fisher yates shuffle to randomise the `bag` array
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  const getXYForIndex = (i) => {
    const x = i % COLS;
    const y = (i / COLS) | 0;

    return { x, y };
  };

  // const template = document.querySelector('#template');
  const padding = 16;
  const width = 78;
  const height = 78;

  const circles = [];

  for (let i = 0; i < 96; i++) {
    const clone = template.cloneNode(true);
    const colour = bag.shift();
    clone.setAttribute('fill', colour);
    const coords = getXYForIndex(i);
    const x = coords.x * width + padding * coords.x;
    const y = coords.y * height + padding * coords.y;
    clone.setAttribute('x', x);
    clone.setAttribute('y', y);
    container.appendChild(clone);
    circles.push(clone);
  }
  template.remove();

  let index = (Math.random() * circles.length) | 0;
  let last = circles[index].getAttribute('fill');
  let lastIndex = index;
  let current;
  // index = (index + 1) % circles.length;

  let lastTick = performance.now();
  function mix(delta) {
    requestAnimationFrame(mix);
    if (delta - lastTick < 500 + Math.random() * 800) {
      return;
    }

    lastTick = delta;
    // sequence
    // lastIndex = (Math.random() * circles.length) | 0;
    index = (Math.random() * circles.length) | 0;
    current = circles[index].getAttribute('fill');
    circles[lastIndex].setAttribute('fill', current);
    // circles[index].setAttribute('fill', last);
    last = current;
    lastIndex = index;

    update(container);
  }

  requestAnimationFrame(mix);
}

function addToDoc() {
  const svgNS = 'http://www.w3.org/2000/svg';

  // Create the SVG element
  // <svg width="1508" id="container" height="548" viewBox="0 0 1508 548" fill="none" xmlns="http://www.w3.org/2000/svg">
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '1508');
  svg.setAttribute('height', '548');
  svg.setAttribute('viewBox', '0 0 1508 548');
  svg.setAttribute('fill', 'none');

  const nest = document.createElementNS(svgNS, 'svg');
  nest.setAttribute('x', '0');
  nest.setAttribute('y', '0');
  svg.appendChild(nest);

  // Create a circle element
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '39');
  circle.setAttribute('cy', '39');
  circle.setAttribute('r', '39');
  circle.setAttribute('fill', 'inherit');

  nest.appendChild(circle);

  main(svg, nest);

  // Convert SVG to data URL
  update(svg);
}

function update(svg) {
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgURL = URL.createObjectURL(svgBlob);

  // Set as background image
  const bgElement = document.querySelector('body > header');
  if (bgElement.style.backgroundImage) {
    bgElement.style.backgroundImage =
      `url(${svgURL}),` + bgElement.style.backgroundImage.split(',')[0];
  } else {
    bgElement.style.backgroundImage = `url(${svgURL})`;
  }
}

addToDoc();
