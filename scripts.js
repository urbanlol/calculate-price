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
const pdfBtn = container.querySelector('.b-control__pdf');

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
      <div>Вартість: <span class="sum-item">0</span> грн</div>
      <span class="read-more">Детальніше</span>
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
      if (room.classList.contains('active')) {
        bottomInfoTitle.textContent = `${room.textContent.trim()}, площа: ${
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
    <div>Підсумок:</div>
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
      )}, площа: ${itemInput.value} м²</div>
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
      Всього: ${result.textContent} грн
      </div>
      `
    );
  }
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

    let error = `<div class="error">Для розрахунку необхідно ввести дані</div>`;
    const input = allItems.querySelector('input');
    const select = allItems.querySelector('select');

    if (!+result.textContent) {
      culcBtn.insertAdjacentHTML('afterend', error);
      setTimeout(() => {
        container.querySelector('.error').remove();
      }, 4000);
      input.classList.add('red');
      select.classList.add('red');
    } else {
      input.classList.remove('red');
      select.classList.remove('red');
    }
    infoTable();
  });
};
culc();

const popUpPdf = () => {
  pdfBtn.addEventListener('click', () => {
    const popUp = document.createElement('div');
    const overlay = document.createElement('div');
    const popUpForm = document.createElement('form');
    const popUpPhone = document.createElement('input');
    const popUpName = document.createElement('input');
    const popUpEmail = document.createElement('input');
    const popUpSubmit = document.createElement('button');
    const popUpCloseBtn = document.createElement('div');

    popUp.classList.add('b-popup');
    overlay.classList.add('b-popup__overlay');

    popUpForm.setAttribute('method', 'post');

    popUpForm.name = 'popup-form';
    popUpName.type = 'text';
    popUpName.placeholder = "Ваш ім'я *";
    popUpName.setAttribute('required', '');

    popUpEmail.type = 'email';
    popUpEmail.placeholder = 'Ваш Email *';
    popUpEmail.setAttribute('required', '');
    popUpEmail.setAttribute(
      'pattern',
      '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
    );

    popUpPhone.type = 'tel';
    popUpPhone.setAttribute('pattern', '[0-9]{10}');
    popUpPhone.placeholder = 'Ваш телефон';
    popUpPhone.maxLength = '12';
    popUpPhone.minLength = '10';

    popUpSubmit.type = 'submit'
    popUpSubmit.textContent = 'Відправити';
    popUpCloseBtn.classList.add('close');

    popUpForm.append(popUpName, popUpEmail, popUpPhone, popUpSubmit);
    popUp.append(popUpForm, popUpCloseBtn);
    container.append(popUp, overlay);

    popUpSubmit.insertAdjacentHTML('afterend', '<div class="after-btn-info">Після відправки форми Ви зможете завантажити pdf файл</div>')

    popUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!!popUpName.value && !!popUpEmail.value) {
        window.print();
        popUpName.value = ''
        popUpEmail.value = ''
        popUp.remove();
        overlay.remove();
      }
    })

    removePopup(popUp, overlay);
  });
};
popUpPdf();

function removePopup(popUp, overlay) {
  window.addEventListener('click', (e) => {
    if (
      e.target.className === 'close' ||
      e.target.className === 'b-popup__overlay'
    ) {
      popUp.remove();
      overlay.remove();
    }
  });
}

// скрипт для того шоб можна було вставити посилання в iframe
window.onload = function () {
  const height = document.body.scrollHeight; // Обчислення висоти контенту
  window.parent.postMessage(height, '*'); // Надсилаємо висоту батьківському вікну
};
