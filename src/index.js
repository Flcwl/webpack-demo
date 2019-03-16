import _ from 'lodash';
// css
import './css/index.css';
import './css/style.css';
import less from './css/base.less';
import sass from './css/base.scss';

import Fens from './img/fens.jpg';

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack', 'test for devServer'], ' ');
  element.classList.add('hello');
  const img = new Image();
  console.dir(Fens);
  img.src = Fens;
  element.appendChild(img);
  return element;
}

document.body.appendChild(component());
