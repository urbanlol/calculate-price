import datas from './data.js';

const container = document.querySelector('.container');
const calcContainer = container.querySelector('.b-calculating');
const bottomInfo = container.querySelector('.b-bottom-info');
const result = container.querySelector('#result');
const resetBtn = container.querySelector('.b-control__reset');
const roomArea = container.querySelector('#area');
const allItems = container.querySelector('#all-items');
const rooms = container.querySelectorAll('.b-calculating__rooms__type');
const culcBtn = container.querySelector('#calculate-btn');

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

const reset = (sum, allSum, selects, input, pdfBtn) => {
  resetBtn.addEventListener('click', (e) => {
    input.value = '0';
    sum.textContent = '0';

    result.textContent = '0';
    selects.forEach((select) => (select.selectedIndex = 0));
    pdfBtn.classList.remove('active');

    rooms.forEach((room) => room.classList.remove('active'));
    rooms[0].classList.add('active');

    bottomInfo.classList.add('none');
    bottomInfo.innerHTML = '';

    roomArea.value = '60';

    allSum = [];
  });
};

const infoTable = () => {
  bottomInfo.innerHTML = '';
  const bottomInfoTitle = document.createElement('h3');

  const detail = document.createElement('div');

  bottomInfoTitle.classList.add('b-bottom-info__title');
  detail.classList.add('b-bottom-info__container__detail');

  if (!!+result.textContent) {
    bottomInfo.classList.remove('none');
    rooms.forEach((room) => {
      console.log(room)
      if(room.classList.contains('active')) {
        bottomInfoTitle.textContent = `${room.textContent.trim()}, пощадь: ${
          roomArea.value
        } м²`;
      }

      bottomInfo.append(bottomInfoTitle);
    });
  }

  blockContainer.forEach((block) => {
    const detail = document.createElement('div');
    const totalSum = document.createElement('div');
    const title = block.querySelector('.b-calculating__rooms__part__title');
    const sum = block.querySelector('.sum-item');
    const moreInfo = block.querySelectorAll(
      '.b-calculating__rooms__part__moreinfo__item'
    );
    const bottomInfoContainer = document.createElement('div');
    bottomInfoContainer.classList.add('b-bottom-info__container');
    const titleItem = document.createElement('div');

    totalSum.classList.add('b-bottom-info__container__total');
    titleItem.classList.add('b-bottom-info__container__title');
    detail.classList.add('b-bottom-info__container__detail');
    titleItem.textContent = `${title.textContent}`;

    if (!!+sum.textContent) {
      bottomInfo.append(bottomInfoContainer);
      bottomInfoContainer.append(titleItem, detail, totalSum);
    }

    totalSum.insertAdjacentHTML(
      'afterbegin',
      `
    <div>Итого:</div>
    <div><b>${sum.textContent} грн</b></div>
    `
    );
    moreInfo.forEach((info) => {
      const itemTitle = info.querySelector('h3');
      const itemInput = info.querySelector('input');
      const itemSelect = info.querySelector('select');

      const itemDetail = `
      <div class="b-bottom-info__container__detail__item">${itemTitle.textContent.replace(
        ', м²',
        ''
      )}, пощадь: ${itemInput.value} м²</div>
      <div class="b-bottom-info__container__detail__item">${
        itemSelect.options[itemSelect.options.selectedIndex].textContent
      } - <b>${Math.round(+itemInput.value * +itemSelect.value)} грн</b></div>
      `;

      if (!!+itemSelect.value && !!+itemInput.value) {
        detail.insertAdjacentHTML('afterbegin', itemDetail);
      }
    });
  });

  if (!!+result.textContent) {
    bottomInfo.insertAdjacentHTML(
      'beforeend',
      `
      <div class="b-bottom-info__total">
      Всего: ${result.textContent} грн
      </div>
      `
    );
  }
};

const culc = () => {
  culcBtn.addEventListener('click', (e) => {
    const allSum = [];
    const pdfBtn = calcContainer.querySelector('.b-control__pdf');

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
        reset(sumItem, allSum, selects, input, pdfBtn);
      });

      if (culcArr.length !== 0) {
        sum = culcArr.reduce((prev, next) => +prev + +next, 0);
        pdfBtn.classList.add('active');
      }

      sumItem.textContent = `${sum}`;
      allSum.push(sum);
    });

    result.textContent = `${allSum.reduce((prev, next) => prev + next, 0)}`;

    let error = `<div class="error">Для расчета необходимо ввести данные</div>`;
    const input = allItems.querySelector('input')
    const select =  allItems.querySelector('select')

    if(!+result.textContent) {
      culcBtn.insertAdjacentHTML('afterend', error)
      input.classList.add('red')
      select.classList.add('red')
    } else {
      if(!!container.querySelector('.error')) {
        container.querySelector('.error').remove()
      }

      input.classList.remove('red')
      select.classList.remove('red')
    } 
    infoTable();
  });
};
culc();
