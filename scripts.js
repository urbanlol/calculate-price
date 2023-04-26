import datas from './data.js';

const calcContainer = document.querySelector('.b-calculating');
const result = calcContainer.querySelector('#result');
const resetBtn = calcContainer.querySelector('.b-control__reset');
const allItems = calcContainer.querySelector('#all-items');
const culcBtn = calcContainer.querySelector('#calculate-btn');

function createItems() {
  datas.map((data) => {
    const { id, title, info } = data;
    const container = document.createElement('div');
    const moreInfo = document.createElement('div');

    container.classList.add('b-calculating__block__container');
    moreInfo.classList.add('b-calculating__rooms__part__moreinfo');

    const roomsPart = `
    <div class="b-calculating__rooms__part">
      <div class="b-calculating__rooms__part__title">${title}</div>
      <div>Сумма: <span class="sum-item">0</span> грн</div>
      <span class="read-more">Подробнее</span>
    </div>
    `;
    allItems.append(container);

    container.insertAdjacentHTML('afterbegin', roomsPart);
    container.append(moreInfo);

    info.map(({ title, infoDescript }, i) => {
      const moreInfoItem = document.createElement('div');
      const moreInfoTitle = document.createElement('h3');
      const select = document.createElement('select');
      const input = document.createElement('input');

      moreInfoItem.classList.add('b-calculating__rooms__part__moreinfo__item');
      moreInfoTitle.textContent = `${title}, м²`;
      select.name = `${id}-${i + 1}`;
      input.type = 'number';
      input.value = '0';

      moreInfo.append(moreInfoItem);
      moreInfoItem.append(moreInfoTitle, input, select);
      infoDescript.map(({ title, price }) => {
        const option = document.createElement('option');

        option.textContent = `${title}`;
        option.value = `${price}`;
        select.append(option);
      });
    });
  });
}
createItems();

const blockContainer = allItems.querySelectorAll(
  '.b-calculating__block__container'
);

(function () {
  blockContainer[0].classList.add('active');

  blockContainer.forEach((block) => {
    block.addEventListener('click', (e) => {
      if (e.target.localName !== 'input') {
        blockContainer.forEach((block) => block.classList.remove('active'));
        e.currentTarget.classList.add('active');
      }
    });
  });
})();

const typesRoom = () => {
  const rooms = calcContainer.querySelectorAll('.b-calculating__rooms__type');

  rooms[0].classList.add('active');

  calcContainer.addEventListener('click', (e) => {
    if (e.target.className === 'b-calculating__rooms__type') {
      rooms.forEach((room, i) => {
        room.classList.remove('active');
      });

      e.target.classList.add('active');
    }
  });
};

typesRoom();

const reset = (sum, allSum, selects, input) => {
  resetBtn.addEventListener('click', (e) => {
    input.value = '0';
    sum.textContent = '0';
    result.textContent = '0';
    selects.forEach((select) => (select.selectedIndex = 0));
    allSum = [];
  });
};

const culc = () => {
  culcBtn.addEventListener('click', (e) => {
    const allSum = [];
    blockContainer.forEach((block) => {
      const culcArr = [];
      const selects = block.querySelectorAll('select');
      const sumItem = block.querySelector('.sum-item');
      const items = block.querySelectorAll(
        '.b-calculating__rooms__part__moreinfo__item'
      );
      let sum = 0;

      items.forEach((item) => {
        const input = item.querySelector('input');
        const select = item.querySelector('select');
        if (select.value !== '0' && input.value !== '0') {
          culcArr.push(
            Math.round(+select.value * +input.value.replace(/\,/g, '.'))
          );
        }
        reset(sumItem, allSum, selects, input);
      });

      if (culcArr.length !== 0) {
        sum = culcArr.reduce((prev, next) => +prev + +next, 0);
      }

      sumItem.textContent = `${sum}`;
      allSum.push(sum);
    });

    result.textContent = `${allSum.reduce((prev, next) => prev + next, 0)}`;
  });
};
culc();
